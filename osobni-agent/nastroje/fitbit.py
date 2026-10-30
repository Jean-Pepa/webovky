#!/usr/bin/env python3
"""Stahování dat z náramku Fitbit Air přes Google Health API, jen pro čtení.

Ukládá denní souhrny do Mozku (zdravi/data/RRRR-MM-DD.json), ze kterých počítá agent-zdravi.
Spouští ho časovač v systemd, ne agent. Od Googlu čte jen spánek, aktivitu a zdravotní
ukazatele, nic neodesílá a nic neukládá po minutách.

    agent-fitbit prihlasit [--port N]   jednorázové přihlášení přes prohlížeč ve Windows
    agent-fitbit stahni [--dni N]       stáhne posledních N dní (výchozí 3) do zdravi/data/
    agent-fitbit struktura              ukáže jen strukturu odpovědí Googlu, bez hodnot
    agent-fitbit casovac                stahování každou hodinu od 5:15 do 23:15 (systemd)

Soubory v ~/.config/agent/ (práva 600, agent do nich nevidí):
    google-health-client.json   klient OAuth stažený z Google Cloud (typ Desktop app)
    google-health-token.json    uložené přihlášení
"""

from __future__ import annotations

import argparse
import base64
import hashlib
import http.server
import json
import os
import secrets
import shutil
import subprocess
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from datetime import date, datetime, timedelta, timezone
from pathlib import Path

CONFIG_DIR = Path(os.environ.get("AGENT_CONFIG_DIR", Path.home() / ".config/agent"))
MOZEK = Path(os.environ.get("AGENT_MOZEK", Path.home() / "Mozek"))
AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
TOKEN_URL = "https://oauth2.googleapis.com/token"
API_URL = "https://health.googleapis.com/v4/"
SCOPES = [
    "https://www.googleapis.com/auth/googlehealth.sleep.readonly",
    "https://www.googleapis.com/auth/googlehealth.activity_and_fitness.readonly",
    "https://www.googleapis.com/auth/googlehealth.health_metrics_and_measurements.readonly",
]
# Denní ukazatele: typ dat v API → (pole v odpovědi, hodnota, pole v souboru dne).
DAILY = {
    "daily-heart-rate-variability": ("dailyHeartRateVariability", "averageHeartRateVariabilityMilliseconds",
                                     "hrv_rmssd_ms"),
    "daily-resting-heart-rate": ("dailyRestingHeartRate", "beatsPerMinute", "tep_klidovy"),
    "daily-oxygen-saturation": ("dailyOxygenSaturation", "averagePercentage", "spo2_prumer_pct"),
    "daily-respiratory-rate": ("dailyRespiratoryRate", "breathsPerMinute", "dech_za_min"),
}
TEMPERATURE = "daily-sleep-temperature-derivations"
MAX_PAGES = 50


class FitbitError(Exception):
    """Chyba, kterou umíme uživateli srozumitelně vysvětlit."""


class ApiError(Exception):
    def __init__(self, code: int, detail: str):
        super().__init__(f"HTTP {code}: {detail}")
        self.code = code
        self.detail = detail


def client_file() -> Path:
    return CONFIG_DIR / "google-health-client.json"


def token_file() -> Path:
    return CONFIG_DIR / "google-health-token.json"


def write_private(path: Path, data: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_name(f".{path.name}.part")
    fd = os.open(tmp, os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o600)
    with os.fdopen(fd, "w", encoding="utf-8") as f:
        json.dump(data, f)
    os.replace(tmp, path)


def load_client() -> dict:
    path = client_file()
    if not path.exists():
        raise FitbitError(f"Chybí {path}. Stáhni ho v Google Cloud (Clients → Download JSON) a zkopíruj "
                          "sem (NAVOD.md, krok 18).")
    try:
        raw = json.loads(path.read_text(encoding="utf-8"))
    except ValueError as exc:
        raise FitbitError(f"{path} není platný JSON: {exc}") from None
    client = raw.get("installed") or raw.get("web") or raw
    if not client.get("client_id") or not client.get("client_secret"):
        raise FitbitError(f"V {path} chybí client_id nebo client_secret.")
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
        raise FitbitError(f"Google není dostupný ({exc.reason}). Zkontroluj připojení k internetu.") from None


# ---------- přihlášení ----------

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


def login(port: int = 0, opener=open_browser, timeout: float = 300) -> dict:
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
        "scope": " ".join(SCOPES),
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
        raise FitbitError("Přihlášení nedoběhlo do 5 minut. Spusť agent-fitbit prihlasit znovu.")
    if result.get("state") != state:
        raise FitbitError("Odpověď z prohlížeče nesedí na tohle přihlášení. Spusť agent-fitbit prihlasit znovu.")
    if "error" in result:
        raise FitbitError(f"Google přihlášení odmítl: {result['error']}. Spusť agent-fitbit prihlasit znovu "
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
        raise FitbitError(f"Google nevydal přihlášení ({exc}).") from None
    if not tokens.get("refresh_token"):
        raise FitbitError("Google nevrátil trvalé přihlášení (refresh token). Spusť agent-fitbit prihlasit znovu.")
    granted = set((tokens.get("scope") or "").split())
    missing = [s.rsplit(".", 2)[-2] for s in SCOPES if granted and s not in granted]
    saved = {
        "refresh_token": tokens["refresh_token"],
        "access_token": tokens.get("access_token"),
        "expires_at": time.time() + int(tokens.get("expires_in", 0)),
        "scope": tokens.get("scope", ""),
    }
    write_private(token_file(), saved)
    print(f"Hotovo. Přihlášení je uložené v {token_file()}.")
    if missing:
        print("Pozor: nepovolil jsi přístup k části dat: " + ", ".join(missing) +
              ". Ta se stahovat nebudou. Pro všechna data spusť přihlášení znovu a povol vše.")
    return saved


class Session:
    """Volání Google Health API s automatickou obnovou přihlášení."""

    def __init__(self):
        self.client = load_client()
        path = token_file()
        if not path.exists():
            raise FitbitError("Ještě nejsi přihlášený. Spusť: agent-fitbit prihlasit")
        try:
            self.token = json.loads(path.read_text(encoding="utf-8"))
        except ValueError:
            raise FitbitError(f"{path} je poškozený. Spusť: agent-fitbit prihlasit") from None

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
                raise FitbitError("Přihlášení ke Googlu vypršelo nebo bylo zrušené. Spusť: agent-fitbit prihlasit. "
                                  "Když se to opakuje každý týden, přepni aplikaci v Google Cloud do stavu "
                                  "In production (NAVOD.md, krok 18).") from None
            raise
        self.token["access_token"] = fresh["access_token"]
        self.token["expires_at"] = time.time() + int(fresh.get("expires_in", 3600))
        if fresh.get("refresh_token"):
            self.token["refresh_token"] = fresh["refresh_token"]
        write_private(token_file(), self.token)
        return self.token["access_token"]

    def call(self, method: str, path: str, *, query: dict | None = None, data: dict | None = None) -> dict:
        url = API_URL + path + ("?" + urllib.parse.urlencode(query) if query else "")
        for attempt in (1, 2):
            try:
                return http_json(method, url, token=self.access_token(), data=data)
            except ApiError as exc:
                if exc.code == 401 and attempt == 1:
                    self.token["expires_at"] = 0
                    continue
                if exc.code == 403:
                    raise FitbitError("Google odmítl přístup (403). Zkontroluj, že je v projektu zapnuté Google "
                                      "Health API a že jsi při přihlášení povolil všechna data. Pak spusť "
                                      f"agent-fitbit prihlasit. Podrobnosti: {exc.detail[:150]}") from None
                if exc.code == 429:
                    raise FitbitError("Google hlásí moc dotazů najednou. Stáhne se to při dalším spuštění.") from None
                raise FitbitError(f"Google vrátil chybu: {exc}") from None
        raise FitbitError("Google přihlášení opakovaně odmítl. Spusť: agent-fitbit prihlasit")


# ---------- dotazy ----------

def ymd(d: date) -> dict:
    return {"year": d.year, "month": d.month, "day": d.day}


def from_ymd(value: dict | None) -> date | None:
    try:
        return date(int(value["year"]), int(value["month"]), int(value["day"]))
    except (TypeError, KeyError, ValueError):
        return None


def number(value) -> float | None:
    """Čísla int64 posílá Google jako text."""
    try:
        return float(value)
    except (TypeError, ValueError):
        return None


def integer(value) -> int | None:
    n = number(value)
    return int(round(n)) if n is not None else None


def local_iso(utc_text: str | None, offset_text: str | None) -> str | None:
    """Čas ze serveru (UTC) převede na místní čas s posunem, např. 2026-10-30T07:02+01:00."""
    if not utc_text:
        return None
    try:
        moment = datetime.fromisoformat(utc_text.replace("Z", "+00:00"))
        seconds = float(offset_text.rstrip("s")) if offset_text else 0.0
    except ValueError:
        return None
    return moment.astimezone(timezone(timedelta(seconds=seconds))).isoformat(timespec="minutes")


def date_filter(field: str, start: date, end: date) -> str:
    """Filtr podle AIP-160 na dny start..end (konec včetně)."""
    return f'{field} >= "{start.isoformat()}" AND {field} < "{(end + timedelta(days=1)).isoformat()}"'


def list_points(session: Session, data_type: str, filter_text: str, page_size: int | None = None) -> list[dict]:
    points, token = [], None
    for _ in range(MAX_PAGES):
        query = {"filter": filter_text}
        if page_size:
            query["pageSize"] = page_size
        if token:
            query["pageToken"] = token
        answer = session.call("GET", f"users/me/dataTypes/{data_type}/dataPoints", query=query)
        points += answer.get("dataPoints", [])
        token = answer.get("nextPageToken")
        if not token:
            break
    return points


def daily_rollup(session: Session, data_type: str, start: date, end: date) -> list[dict]:
    body = {"range": {"start": {"date": ymd(start)}, "end": {"date": ymd(end + timedelta(days=1))}},
            "windowSizeDays": 1, "pageSize": 100}
    points = []
    for _ in range(MAX_PAGES):
        answer = session.call("POST", f"users/me/dataTypes/{data_type}/dataPoints:dailyRollUp", data=body)
        points += answer.get("rollupDataPoints", [])
        if not answer.get("nextPageToken"):
            break
        body = dict(body, pageToken=answer["nextPageToken"])
    return points


def sleep_by_day(points: list[dict]) -> dict[date, dict]:
    """Hlavní spánek pro každý den probuzení. Šlofíky jen tehdy, když jiný spánek není."""
    best: dict[date, tuple[tuple, dict]] = {}
    for point in points:
        sleep = point.get("sleep") or {}
        interval = sleep.get("interval") or {}
        meta = sleep.get("metadata") or {}
        summary = sleep.get("summary") or {}
        day = from_ymd((interval.get("civilEndTime") or {}).get("date"))
        end = local_iso(interval.get("endTime"), interval.get("endUtcOffset"))
        if day is None and end:
            day = date.fromisoformat(end[:10])
        if day is None:
            continue
        asleep = integer(summary.get("minutesAsleep"))
        record = {
            "zacatek": local_iso(interval.get("startTime"), interval.get("startUtcOffset")),
            "konec": end,
            "v_posteli_min": integer(summary.get("minutesInSleepPeriod")),
            "spanek_min": asleep,
            "bdeni_min": integer(summary.get("minutesAwake")),
            "latence_min": integer(summary.get("minutesToFallAsleep")),
        }
        if sleep.get("type") == "STAGES":
            stages = {s.get("type"): integer(s.get("minutes")) for s in summary.get("stagesSummary", [])}
            record.update(lehky_min=stages.get("LIGHT"), hluboky_min=stages.get("DEEP"), rem_min=stages.get("REM"))
        rank = (bool(meta.get("mainSleep")), not meta.get("nap"), asleep or 0)
        if day not in best or rank > best[day][0]:
            best[day] = (rank, record)
    return {day: record for day, (_, record) in best.items()}


def daily_values(points: list[dict], field: str, value_key: str) -> dict[date, float]:
    out = {}
    for point in points:
        item = point.get(field) or {}
        day, value = from_ymd(item.get("date")), number(item.get(value_key))
        if day is not None and value is not None:
            out[day] = value
    return out


def temperature_by_day(points: list[dict]) -> dict[date, float]:
    out = {}
    for point in points:
        item = point.get("dailySleepTemperatureDerivations") or {}
        day = from_ymd(item.get("date"))
        nightly, baseline = number(item.get("nightlyTemperatureCelsius")), number(item.get("baselineTemperatureCelsius"))
        if day is not None and nightly is not None and baseline is not None:
            out[day] = round(nightly - baseline, 2)
    return out


def rollup_by_day(points: list[dict], extract) -> dict[date, int]:
    out = {}
    for point in points:
        day = from_ymd((point.get("civilStartTime") or {}).get("date"))
        value = extract(point)
        if day is not None and value is not None:
            out[day] = value
    return out


def steps_value(point: dict) -> int | None:
    return integer((point.get("steps") or {}).get("countSum"))


def zone_minutes_value(point: dict) -> int | None:
    """Minuty v aktivní zóně: vysoká intenzita už v nich je dvakrát, jako u WHO."""
    azm = point.get("activeZoneMinutes")
    if not azm:
        return None
    return sum(integer(azm.get(k)) or 0 for k in ("sumInFatBurnHeartZone", "sumInCardioHeartZone", "sumInPeakHeartZone"))


def fetch(session: Session, start: date, end: date) -> dict[date, dict]:
    """Stáhne dny start..end a vrátí je ve formátu zdravi/data (viz skills/zdravi/METODIKA.md)."""
    days: dict[date, dict] = {}

    def put(day: date, key: str, value) -> None:
        if start <= day <= end and value is not None:
            days.setdefault(day, {})[key] = value

    sleep = sleep_by_day(list_points(session, "sleep", date_filter("sleep.interval.civil_end_time", start, end),
                                     page_size=25))
    for day, record in sleep.items():
        put(day, "spanek", {k: v for k, v in record.items() if v is not None})
    for data_type, (field, value_key, target) in DAILY.items():
        points = list_points(session, data_type, date_filter(f"{data_type.replace('-', '_')}.date", start, end))
        for day, value in daily_values(points, field, value_key).items():
            put(day, target, value)
    points = list_points(session, TEMPERATURE, date_filter(f"{TEMPERATURE.replace('-', '_')}.date", start, end))
    for day, value in temperature_by_day(points).items():
        put(day, "teplota_odchylka_c", value)
    for day, value in rollup_by_day(daily_rollup(session, "steps", start, end), steps_value).items():
        put(day, "kroky", value)
    for day, value in rollup_by_day(daily_rollup(session, "active-zone-minutes", start, end),
                                    zone_minutes_value).items():
        put(day, "aktivni_min", value)
    return days


def save_days(days: dict[date, dict], mozek: Path) -> list[Path]:
    """Zapíše dny do zdravi/data. Hodnoty, které tentokrát nepřišly, ze starého souboru zůstanou."""
    folder = mozek / "zdravi" / "data"
    folder.mkdir(parents=True, exist_ok=True)
    now = datetime.now().astimezone().isoformat(timespec="minutes")
    written = []
    for day, values in sorted(days.items()):
        path = folder / f"{day.isoformat()}.json"
        try:
            old = json.loads(path.read_text(encoding="utf-8")) if path.exists() else {}
        except ValueError:
            old = {}
        merged = dict(old)
        for key, value in values.items():
            if key == "spanek" and isinstance(old.get("spanek"), dict):
                merged["spanek"] = {**old["spanek"], **value}
            else:
                merged[key] = value
        merged.update(datum=day.isoformat(), zdroj="google-health", stazeno=now)
        tmp = path.with_name(f".{path.name}.part")
        tmp.write_text(json.dumps(merged, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        os.replace(tmp, path)
        written.append(path)
    return written


def shape(value, depth: int = 0) -> str:
    """Struktura odpovědi bez hodnot: jen klíče a typy."""
    if isinstance(value, dict):
        if not value:
            return "{}"
        pad = "  " * (depth + 1)
        inner = "\n".join(f"{pad}{k}: {shape(v, depth + 1)}" for k, v in value.items())
        return "{\n" + inner + "\n" + "  " * depth + "}"
    if isinstance(value, list):
        return f"[{len(value)}× " + (shape(value[0], depth) if value else "nic") + "]"
    return type(value).__name__


# ---------- příkazy ----------

def cmd_download(days_back: int, mozek: Path) -> int:
    session = Session()
    end = date.today()
    start = end - timedelta(days=max(days_back, 1) - 1)
    days = fetch(session, start, end)
    written = save_days(days, mozek)
    nights = sum(1 for v in days.values() if "spanek" in v)
    print(f"Staženo {start.isoformat()} až {end.isoformat()}: {len(written)} dní s daty, z toho {nights} nocí. "
          f"Uloženo do {mozek / 'zdravi' / 'data'}.")
    return 0


def cmd_structure() -> int:
    session = Session()
    end = date.today()
    start = end - timedelta(days=1)
    print("Jen struktura odpovědí, žádné hodnoty. Tohle můžeš bezpečně poslat dál.\n")
    for data_type, filter_text in [("sleep", date_filter("sleep.interval.civil_end_time", start, end))] + [
            (t, date_filter(f"{t.replace('-', '_')}.date", start, end)) for t in [*DAILY, TEMPERATURE]]:
        answer = session.call("GET", f"users/me/dataTypes/{data_type}/dataPoints", query={"filter": filter_text})
        print(f"== {data_type}\n{shape(answer)}\n")
    for data_type in ("steps", "active-zone-minutes"):
        body = {"range": {"start": {"date": ymd(start)}, "end": {"date": ymd(end + timedelta(days=1))}},
                "windowSizeDays": 1}
        answer = session.call("POST", f"users/me/dataTypes/{data_type}/dataPoints:dailyRollUp", data=body)
        print(f"== {data_type} (denní součet)\n{shape(answer)}\n")
    return 0


SERVICE = """[Unit]
Description=Stažení dat z náramku (Google Health)

[Service]
Type=oneshot
ExecStart=%h/.local/bin/agent-fitbit stahni
ExecStartPost=-%h/.local/bin/agent-zdravi den
"""
TIMER = """[Unit]
Description=Stažení dat z náramku každou hodinu od 5:15 do 23:15

[Timer]
OnCalendar=*-*-* 05..23:15:00
Persistent=true
RandomizedDelaySec=120

[Install]
WantedBy=timers.target
"""


def cmd_timer(units: Path | None = None, run=subprocess.run) -> int:
    units = units or Path.home() / ".config/systemd/user"
    units.mkdir(parents=True, exist_ok=True)
    (units / "agent-fitbit.service").write_text(SERVICE, encoding="utf-8")
    (units / "agent-fitbit.timer").write_text(TIMER, encoding="utf-8")
    run(["systemctl", "--user", "daemon-reload"], check=True)
    run(["systemctl", "--user", "enable", "--now", "agent-fitbit.timer"], check=True)
    print("Hotovo. Data z náramku se stáhnou každou hodinu od 5:15 do 23:15 a hned se z nich spočítá "
          "souhrn dne. Stav: systemctl --user list-timers agent-fitbit.timer")
    return 0


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(prog="agent-fitbit", description="Stahování dat z náramku (jen čtení).")
    parser.add_argument("--mozek", type=Path, default=MOZEK)
    sub = parser.add_subparsers(dest="cmd", required=True)
    p_login = sub.add_parser("prihlasit", help="jednorázové přihlášení přes prohlížeč")
    p_login.add_argument("--port", type=int, default=0, help="pevný port zpětné adresy (jen pro klienta typu Web)")
    p_get = sub.add_parser("stahni", help="stáhne posledních N dní")
    p_get.add_argument("--dni", type=int, default=3)
    sub.add_parser("struktura", help="struktura odpovědí bez hodnot")
    sub.add_parser("casovac", help="stahování každou hodinu (systemd)")
    args = parser.parse_args(argv)
    try:
        if args.cmd == "prihlasit":
            login(args.port)
            return 0
        if args.cmd == "stahni":
            return cmd_download(min(args.dni, 90), args.mozek)
        if args.cmd == "struktura":
            return cmd_structure()
        return cmd_timer()
    except FitbitError as exc:
        print(f"Chyba: {exc}", file=sys.stderr)
        return 1
    except (OSError, subprocess.CalledProcessError) as exc:
        print(f"Chyba: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
