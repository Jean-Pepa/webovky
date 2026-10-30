"""Společné přihlášení ke Googlu pro nástroje agenta (agent-fitbit, agent-kalendar).

Přihlášení je OAuth pro aplikaci v počítači s PKCE: jednou se potvrdí v prohlížeči a pak se
samo obnovuje. Klient z Google Cloud je jeden pro všechny nástroje, každý nástroj má vlastní
uložené přihlášení jen se svými oprávněními. Všechno je v ~/.config/agent/ s právy 600, kam
agent nevidí.
"""

from __future__ import annotations

import base64
import hashlib
import http.server
import json
import os
import secrets
import shutil
import subprocess
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

CONFIG_DIR = Path(os.environ.get("AGENT_CONFIG_DIR", Path.home() / ".config/agent"))
AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
TOKEN_URL = "https://oauth2.googleapis.com/token"
AUTH_KEYS = ("refresh_token", "access_token", "expires_at", "scope")


class GoogleError(Exception):
    """Chyba, kterou umíme uživateli srozumitelně vysvětlit."""


class RequestError(GoogleError):
    """Google odmítl jeden dotaz (400 nebo 404). Ostatní dotazy můžou pokračovat."""

    def __init__(self, code: int, detail: str):
        super().__init__(f"HTTP {code}: {detail[:150]}")
        self.code = code


class ApiError(Exception):
    def __init__(self, code: int, detail: str):
        super().__init__(f"HTTP {code}: {detail}")
        self.code = code
        self.detail = detail


def client_file() -> Path:
    return CONFIG_DIR / "google-health-client.json"


def write_private(path: Path, data: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_name(f".{path.name}.part")
    fd = os.open(tmp, os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o600)
    with os.fdopen(fd, "w", encoding="utf-8") as f:
        json.dump(data, f)
    os.replace(tmp, path)


def kept_values(path: Path) -> dict:
    """Co nástroj uložil k přihlášení sám (třeba ID kalendáře Mozek). Nové přihlášení to nesmaže."""
    try:
        old = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, ValueError):
        return {}
    return {k: v for k, v in old.items() if k not in AUTH_KEYS} if isinstance(old, dict) else {}


def load_client() -> dict:
    path = client_file()
    if not path.exists():
        raise GoogleError(f"Chybí {path}. Stáhni ho v Google Cloud (Clients → Download JSON) a zkopíruj "
                          "sem (NAVOD.md, krok 18).")
    try:
        raw = json.loads(path.read_text(encoding="utf-8"))
    except ValueError as exc:
        raise GoogleError(f"{path} není platný JSON: {exc}") from None
    client = raw.get("installed") or raw.get("web") or raw
    if not client.get("client_id") or not client.get("client_secret"):
        raise GoogleError(f"V {path} chybí client_id nebo client_secret.")
    return client


def http_json(method: str, url: str, *, token: str | None = None, data: dict | None = None,
              form: dict | None = None) -> dict:
    headers = {"Accept": "application/json"}
    body = None
    if form is not None:
        body = urllib.parse.urlencode(form).encode()
        headers["Content-Type"] = "application/x-www-form-urlencoded"
    elif data is not None:
        body = json.dumps(data).encode()
        headers["Content-Type"] = "application/json"
    if token:
        headers["Authorization"] = f"Bearer {token}"
    request = urllib.request.Request(url, data=body, headers=headers, method=method)
    try:
        with urllib.request.urlopen(request, timeout=60) as response:
            return json.loads(response.read().decode("utf-8") or "{}")
    except urllib.error.HTTPError as exc:
        raise ApiError(exc.code, exc.read().decode("utf-8", errors="replace")[:300]) from None
    except urllib.error.URLError as exc:
        raise GoogleError(f"Google není dostupný ({exc.reason}). Zkontroluj připojení k internetu.") from None


class _Callback(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        query = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query)
        if "code" not in query and "error" not in query:
            self.send_response(404)
            self.end_headers()
            return
        self.server.result = {k: v[0] for k, v in query.items()}
        ok = "code" in query
        text = ("Hotovo, přihlášení se uložilo. Okno můžeš zavřít." if ok
                else "Přihlášení se nepovedlo. Vrať se do Ubuntu a podívej se na chybu.")
        page = f"<!doctype html><meta charset='utf-8'><p style='font:20px sans-serif'>{text}</p>".encode()
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(page)))
        self.end_headers()
        self.wfile.write(page)

    def log_message(self, *args):
        pass


def open_browser(url: str) -> None:
    """Otevře adresu v prohlížeči ve Windows (WSL). Když to nejde, adresa je vypsaná v terminálu."""
    for command in (["powershell.exe", "-NoProfile", "-Command", f"Start-Process '{url}'"], ["xdg-open", url]):
        if shutil.which(command[0]):
            subprocess.run(command, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=False)
            return


def login(token_path: Path, scopes: list[str], login_cmd: str, *, port: int = 0, opener=open_browser,
          timeout: float = 300) -> dict:
    client = load_client()
    verifier = secrets.token_urlsafe(64)
    challenge = base64.urlsafe_b64encode(hashlib.sha256(verifier.encode()).digest()).rstrip(b"=").decode()
    state = secrets.token_urlsafe(16)
    server = http.server.HTTPServer(("127.0.0.1", port), _Callback)
    server.timeout = 1
    server.result = None
    redirect = f"http://127.0.0.1:{server.server_port}"
    url = AUTH_URL + "?" + urllib.parse.urlencode({
        "client_id": client["client_id"],
        "redirect_uri": redirect,
        "response_type": "code",
        "scope": " ".join(scopes),
        "access_type": "offline",
        "prompt": "consent",
        "code_challenge": challenge,
        "code_challenge_method": "S256",
        "state": state,
    })
    print("Otevírám přihlášení ke Googlu v prohlížeči. Kdyby se neotevřelo, zkopíruj tuhle adresu do "
          "prohlížeče ve Windows:\n")
    print(url + "\n", flush=True)
    opener(url)
    deadline = time.monotonic() + timeout
    try:
        while server.result is None and time.monotonic() < deadline:
            server.handle_request()
    finally:
        server.server_close()
    result = server.result
    if result is None:
        raise GoogleError(f"Přihlášení nedoběhlo do 5 minut. Spusť {login_cmd} znovu.")
    if result.get("state") != state:
        raise GoogleError(f"Odpověď z prohlížeče nesedí na tohle přihlášení. Spusť {login_cmd} znovu.")
    if "error" in result:
        raise GoogleError(f"Google přihlášení odmítl: {result['error']}. Spusť {login_cmd} znovu "
                          "a na konci povol přístup.")
    try:
        tokens = http_json("POST", TOKEN_URL, form={
            "grant_type": "authorization_code",
            "code": result["code"],
            "client_id": client["client_id"],
            "client_secret": client["client_secret"],
            "redirect_uri": redirect,
            "code_verifier": verifier,
        })
    except ApiError as exc:
        raise GoogleError(f"Google nevydal přihlášení ({exc}).") from None
    if not tokens.get("refresh_token"):
        raise GoogleError(f"Google nevrátil trvalé přihlášení (refresh token). Spusť {login_cmd} znovu.")
    granted = set((tokens.get("scope") or "").split())
    missing = [s.rsplit("/", 1)[-1] for s in scopes if granted and s not in granted]
    saved = kept_values(token_path)
    saved.update({
        "refresh_token": tokens["refresh_token"],
        "access_token": tokens.get("access_token"),
        "expires_at": time.time() + int(tokens.get("expires_in", 0)),
        "scope": tokens.get("scope", ""),
    })
    write_private(token_path, saved)
    print(f"Hotovo. Přihlášení je uložené v {token_path}.")
    if missing:
        print("Pozor: nepovolil jsi tato oprávnění: " + ", ".join(missing) +
              f". Bez nich část věcí nepůjde. Spusť {login_cmd} znovu a povol vše.")
    return saved


class Session:
    """Volání jednoho Google API s automatickou obnovou přihlášení."""

    def __init__(self, token_path: Path, api_url: str, api_label: str, login_cmd: str):
        self.token_path, self.api_url = token_path, api_url
        self.api_label, self.login_cmd = api_label, login_cmd
        self.client = load_client()
        if not token_path.exists():
            raise GoogleError(f"Ještě nejsi přihlášený. Spusť: {login_cmd}")
        try:
            self.token = json.loads(token_path.read_text(encoding="utf-8"))
        except ValueError:
            raise GoogleError(f"{token_path} je poškozený. Spusť: {login_cmd}") from None

    def save(self) -> None:
        write_private(self.token_path, self.token)

    def access_token(self) -> str:
        if self.token.get("access_token") and self.token.get("expires_at", 0) > time.time() + 60:
            return self.token["access_token"]
        try:
            fresh = http_json("POST", TOKEN_URL, form={
                "grant_type": "refresh_token",
                "refresh_token": self.token["refresh_token"],
                "client_id": self.client["client_id"],
                "client_secret": self.client["client_secret"],
            })
        except ApiError as exc:
            if exc.code in (400, 401):
                raise GoogleError(f"Přihlášení ke Googlu vypršelo nebo bylo zrušené. Spusť: {self.login_cmd}. "
                                  "Když se to opakuje každý týden, přepni aplikaci v Google Cloud do stavu "
                                  "In production (NAVOD.md, krok 18).") from None
            raise
        self.token["access_token"] = fresh["access_token"]
        self.token["expires_at"] = time.time() + int(fresh.get("expires_in", 3600))
        if fresh.get("refresh_token"):
            self.token["refresh_token"] = fresh["refresh_token"]
        self.save()
        return self.token["access_token"]

    def call(self, method: str, path: str, *, query: dict | None = None, data: dict | None = None) -> dict:
        url = self.api_url + path + ("?" + urllib.parse.urlencode(query) if query else "")
        for attempt in (1, 2):
            try:
                return http_json(method, url, token=self.access_token(), data=data)
            except ApiError as exc:
                if exc.code == 401 and attempt == 1:
                    self.token["expires_at"] = 0
                    continue
                if exc.code == 403:
                    raise GoogleError(f"Google odmítl přístup (403). Zkontroluj, že je v projektu zapnuté "
                                      f"{self.api_label} a že jsi při přihlášení povolil všechna oprávnění. "
                                      f"Pak spusť {self.login_cmd}. Podrobnosti: {exc.detail[:150]}") from None
                if exc.code == 429:
                    raise GoogleError("Google hlásí moc dotazů najednou. Zkus to za chvíli znovu.") from None
                if exc.code in (400, 404):
                    raise RequestError(exc.code, exc.detail) from None
                raise GoogleError(f"Google vrátil chybu: {exc}") from None
        raise GoogleError(f"Google přihlášení opakovaně odmítl. Spusť: {self.login_cmd}")
