#!/usr/bin/env python3
"""
pull.py – stáhne tvoje data z Google Health API (v4) do složky data/raw/.

Použití:
  python pull.py                          # přírůstkově od posledního stažení (poprvé 30 dní zpět)
  python pull.py --since 2026-06-01       # od zadaného data do dneška
  python pull.py --since 2026-06-01 --until 2026-06-30
  python pull.py --types heart-rate,sleep # jen vybrané typy (seznam: --list-types)
  python pull.py --dry-run                # jen vypíše, co by se stahovalo (bez přihlášení)

První spuštění otevře prohlížeč a nechá tě přihlásit Google účtem (OAuth).
Potřebuje secrets/client_secret.json – postup je v README.md.

Výstup: data/raw/<typ>/<datum>.json – vždy původní (nezjednodušená) odpověď API,
tj. {"dataPoints": [...]} nebo {"rollupDataPoints": [...]}. Stejný tvar dává
`ghealth ... --raw -o soubor.json`, takže soubory z ghealth jde do složek přihodit.
"""

from __future__ import annotations

import argparse
import datetime as dt
import json
import os
import sys
import time
from pathlib import Path
from zoneinfo import ZoneInfo

BASE_URL = "https://health.googleapis.com/v4"
HERE = Path(__file__).resolve().parent

SCOPES = [
    "https://www.googleapis.com/auth/googlehealth.activity_and_fitness.readonly",
    "https://www.googleapis.com/auth/googlehealth.health_metrics_and_measurements.readonly",
    "https://www.googleapis.com/auth/googlehealth.sleep.readonly",
]

# Co se stahuje a jak.
#   mode:  "list" = jednotlivé záznamy, "daily-rollup" = denní součty (API pro kroky
#          apod. v listu vrací jen intervaly bez hodnot, proto rollup)
#   time:  jak se filtruje čas – "sample" (fyzický čas v UTC), "interval" (civilní
#          start), "sleep" (civilní konec spánku), "daily" (datum)
#   chunk: kolik dní jde do jednoho požadavku/souboru (rollup má limit API:
#          90 dní, u total-calories a active-minutes jen 14)
#   page:  max velikost stránky (spánek a cvičení má API limit 25)
TYPES: dict[str, dict] = {
    # --- jednotlivé záznamy ---
    "heart-rate": dict(mode="list", time="sample", chunk=1, page=10000,
                       desc="tep (vzorky po několika sekundách)"),
    "heart-rate-variability": dict(mode="list", time="sample", chunk=30, page=10000,
                                   desc="HRV – jednotlivá měření"),
    "oxygen-saturation": dict(mode="list", time="sample", chunk=30, page=10000,
                              desc="SpO2 – jednotlivá měření"),
    "sleep": dict(mode="list", time="sleep", chunk=30, page=25,
                  desc="spánek – sessions s fázemi"),
    "exercise": dict(mode="list", time="interval", chunk=30, page=25,
                     desc="cvičení / tréninky"),
    # --- denní souhrny (jedna hodnota na den) ---
    "daily-resting-heart-rate": dict(mode="list", time="daily", chunk=90, page=10000,
                                     desc="klidový tep za den"),
    "daily-heart-rate-variability": dict(mode="list", time="daily", chunk=90, page=10000,
                                         desc="HRV za den"),
    "daily-oxygen-saturation": dict(mode="list", time="daily", chunk=90, page=10000,
                                    desc="SpO2 za den"),
    "daily-respiratory-rate": dict(mode="list", time="daily", chunk=90, page=10000,
                                   desc="dechová frekvence za den"),
    "daily-sleep-temperature-derivations": dict(mode="list", time="daily", chunk=90, page=10000,
                                                desc="odchylka teploty kůže ve spánku"),
    "daily-vo2-max": dict(mode="list", time="daily", chunk=90, page=10000,
                          desc="VO2 max za den"),
    # --- denní součty přes rollup ---
    "steps": dict(mode="daily-rollup", chunk=90, desc="kroky za den"),
    "distance": dict(mode="daily-rollup", chunk=90, desc="vzdálenost za den (mm)"),
    "floors": dict(mode="daily-rollup", chunk=90, desc="patra za den"),
    "active-zone-minutes": dict(mode="daily-rollup", chunk=90, desc="aktivní zónové minuty"),
    "total-calories": dict(mode="daily-rollup", chunk=14, desc="kalorie celkem za den"),
    "active-minutes": dict(mode="daily-rollup", chunk=14, desc="aktivní minuty za den"),
}


# ─── pomocné ────────────────────────────────────────────────────────────────

def die(msg: str, code: int = 1) -> None:
    print(f"CHYBA: {msg}", file=sys.stderr)
    sys.exit(code)


def snake(type_id: str) -> str:
    return type_id.replace("-", "_")


def local_midnight_utc(day: dt.date, tz: ZoneInfo) -> str:
    """Půlnoc daného dne v místní zóně vyjádřená jako RFC-3339 UTC ('Z')."""
    local = dt.datetime.combine(day, dt.time(0), tzinfo=tz)
    return local.astimezone(dt.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def build_filter(type_id: str, cfg: dict, start: dt.date, end_excl: dt.date, tz: ZoneInfo) -> str:
    """Filtr podle AIP-160 tak, jak ho Health API v4 chce (jen >= a <)."""
    name = snake(type_id)
    kind = cfg["time"]
    if kind == "sample":
        field = f"{name}.sample_time.physical_time"
        return (f'{field} >= "{local_midnight_utc(start, tz)}" AND '
                f'{field} < "{local_midnight_utc(end_excl, tz)}"')
    if kind == "interval":
        field = f"{name}.interval.civil_start_time"
        return f'{field} >= "{start}T00:00:00" AND {field} < "{end_excl}T00:00:00"'
    if kind == "sleep":
        field = "sleep.interval.civil_end_time"
        return f'{field} >= "{start}T00:00:00" AND {field} < "{end_excl}T00:00:00"'
    if kind == "daily":
        field = f"{name}.date"
        return f'{field} >= "{start}" AND {field} < "{end_excl}"'
    raise ValueError(f"neznámý typ času {kind!r}")


def civil_date(day: dt.date) -> dict:
    return {"date": {"year": day.year, "month": day.month, "day": day.day}}


def windows(since: dt.date, until: dt.date, chunk_days: int):
    """Rozdělí [since, until] (včetně) na okna [a, b) o délce chunk_days."""
    a = since
    end_excl = until + dt.timedelta(days=1)
    while a < end_excl:
        b = min(a + dt.timedelta(days=chunk_days), end_excl)
        yield a, b
        a = b


def window_filename(a: dt.date, b: dt.date, chunk_days: int) -> str:
    last = b - dt.timedelta(days=1)
    return f"{a}.json" if chunk_days == 1 else f"{a}_{last}.json"


def write_json_atomic(path: Path, payload: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix(".tmp")
    tmp.write_text(json.dumps(payload, ensure_ascii=False), encoding="utf-8")
    tmp.replace(path)


def load_state(path: Path) -> dict:
    if path.exists():
        try:
            return json.loads(path.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            pass
    return {}


# ─── OAuth ──────────────────────────────────────────────────────────────────

def get_session(secrets_dir: Path):
    """Vrátí requests session s platným tokenem; poprvé otevře prohlížeč."""
    try:
        from google.auth.exceptions import RefreshError
        from google.auth.transport.requests import AuthorizedSession, Request
        from google.oauth2.credentials import Credentials
        from google_auth_oauthlib.flow import InstalledAppFlow
    except ImportError:
        die("chybí knihovny – spusť: pip install -r requirements.txt")

    client_secret = secrets_dir / "client_secret.json"
    token_file = secrets_dir / "token.json"

    creds = None
    if token_file.exists():
        try:
            creds = Credentials.from_authorized_user_file(str(token_file), SCOPES)
        except ValueError:
            creds = None

    if creds and not creds.valid and creds.refresh_token:
        try:
            creds.refresh(Request())
        except RefreshError:
            # Refresh token vypršel (v režimu Testing platí 7 dní) nebo byl odvolán.
            print("Uložené přihlášení už neplatí, přihlas se znovu v prohlížeči.", file=sys.stderr)
            creds = None

    if not creds or not creds.valid:
        if not client_secret.exists():
            die(f"nenašel jsem {client_secret}\n"
                "  1. https://console.cloud.google.com/apis/credentials\n"
                "  2. Create credentials → OAuth client ID → Application type: Desktop app\n"
                "  3. Download JSON a ulož ho jako secrets/client_secret.json\n"
                "  (celý postup je v README.md)", code=5)
        flow = InstalledAppFlow.from_client_secrets_file(str(client_secret), SCOPES)
        creds = flow.run_local_server(port=0, prompt="consent")
        secrets_dir.mkdir(parents=True, exist_ok=True)
        token_file.write_text(creds.to_json(), encoding="utf-8")
        try:
            os.chmod(token_file, 0o600)
        except OSError:
            pass
        print(f"Přihlášení uloženo do {token_file}")

    return AuthorizedSession(creds)


# ─── volání API ─────────────────────────────────────────────────────────────

def api(session, method: str, path: str, *, params: dict | None = None, body: dict | None = None) -> dict:
    """Jedno volání s opakováním při 429/5xx a srozumitelnou chybou při 4xx."""
    url = BASE_URL + path
    last_err = None
    for attempt in range(4):
        if attempt:
            time.sleep(2 ** attempt)
        resp = session.request(method, url, params=params, json=body, timeout=60,
                               headers={"x-goog-api-client": "webovky-health-data/1"})
        if 200 <= resp.status_code < 300:
            return resp.json() if resp.content else {}
        if resp.status_code == 429 or resp.status_code >= 500:
            last_err = f"HTTP {resp.status_code}: {resp.text[:300]}"
            retry_after = resp.headers.get("Retry-After")
            if retry_after and retry_after.isdigit():
                time.sleep(int(retry_after))
            continue
        # 4xx – neopakovat, vysvětlit
        try:
            msg = resp.json().get("error", {}).get("message", resp.text)
        except ValueError:
            msg = resp.text
        hint = ""
        low = msg.lower()
        if resp.status_code == 403 and ("not been used" in low or "disabled" in low or "not enabled" in low):
            hint = "\n  → Zapni Google Health API v projektu: https://console.cloud.google.com/apis/api/health.googleapis.com"
        elif resp.status_code == 403 and "scope" in low:
            hint = "\n  → Smaž secrets/token.json a spusť znovu, aby se udělily všechny scopes."
        elif resp.status_code == 403 and ("access_denied" in low or "verification" in low or "test user" in low):
            hint = "\n  → V Google Cloud přidej svůj účet mezi Test users (OAuth consent screen / Audience)."
        raise RuntimeError(f"{method} {path} → HTTP {resp.status_code}: {msg}{hint}")
    raise RuntimeError(f"{method} {path} se nepovedlo ani po opakování: {last_err}")


def fetch_list(session, type_id: str, flt: str, page_size: int) -> dict:
    points: list = []
    token = None
    while True:
        params = {"filter": flt, "pageSize": page_size}
        if token:
            params["pageToken"] = token
        res = api(session, "GET", f"/users/me/dataTypes/{type_id}/dataPoints", params=params)
        points.extend(res.get("dataPoints", []))
        token = res.get("nextPageToken")
        if not token:
            break
    return {"dataPoints": points}


def fetch_daily_rollup(session, type_id: str, a: dt.date, b: dt.date) -> dict:
    body = {"range": {"start": civil_date(a), "end": civil_date(b)}, "windowSizeDays": 1}
    points: list = []
    token = None
    while True:
        if token:
            body["pageToken"] = token
        res = api(session, "POST", f"/users/me/dataTypes/{type_id}/dataPoints:dailyRollUp", body=body)
        points.extend(res.get("rollupDataPoints", []))
        token = res.get("nextPageToken")
        if not token:
            break
    return {"rollupDataPoints": points}


# ─── hlavní běh ─────────────────────────────────────────────────────────────

def parse_args(argv=None) -> argparse.Namespace:
    p = argparse.ArgumentParser(description="Stáhne data z Google Health API do data/raw/.")
    p.add_argument("--since", type=dt.date.fromisoformat, help="od data (YYYY-MM-DD)")
    p.add_argument("--until", type=dt.date.fromisoformat, help="do data včetně (výchozí: dnes)")
    p.add_argument("--types", help="čárkou oddělené typy (výchozí: všechny, viz --list-types)")
    p.add_argument("--tz", default=os.environ.get("HEALTH_TZ", "Europe/Prague"),
                   help="časová zóna pro hranice dnů (výchozí: Europe/Prague)")
    p.add_argument("--data", type=Path, default=HERE / "data", help="složka pro data (výchozí: ./data)")
    p.add_argument("--secrets", type=Path, default=HERE / "secrets", help="složka s client_secret.json a token.json")
    p.add_argument("--force", action="store_true", help="stáhnout znovu i už stažená okna")
    p.add_argument("--dry-run", action="store_true", help="jen vypsat plán, nic nestahovat")
    p.add_argument("--list-types", action="store_true", help="vypsat podporované typy a skončit")
    return p.parse_args(argv)


def main(argv=None) -> int:
    args = parse_args(argv)

    if args.list_types:
        for tid, cfg in TYPES.items():
            print(f"{tid:38} {cfg['mode']:13} {cfg['desc']}")
        return 0

    try:
        tz = ZoneInfo(args.tz)
    except Exception:
        die(f"neznámá časová zóna {args.tz!r} (např. Europe/Prague)")

    selected = list(TYPES) if not args.types else [t.strip() for t in args.types.split(",") if t.strip()]
    unknown = [t for t in selected if t not in TYPES]
    if unknown:
        die(f"neznámé typy: {', '.join(unknown)} (viz --list-types)")

    today = dt.datetime.now(tz).date()
    until = args.until or today
    raw_dir = args.data / "raw"
    state_path = args.data / "state.json"
    state = load_state(state_path)

    # plán
    plan: list[tuple[str, dt.date, dt.date, Path]] = []
    for tid in selected:
        cfg = TYPES[tid]
        if args.since:
            since = args.since
        elif tid in state:
            # znovu vezmi poslední 2 dny – data se ze zařízení synchronizují se zpožděním
            since = dt.date.fromisoformat(state[tid]) - dt.timedelta(days=2)
        else:
            since = today - dt.timedelta(days=30)
        if since > until:
            continue
        for a, b in windows(since, until, cfg["chunk"]):
            path = raw_dir / tid / window_filename(a, b, cfg["chunk"])
            recent = (b - dt.timedelta(days=1)) >= today - dt.timedelta(days=1)
            if path.exists() and not args.force and not recent:
                continue
            plan.append((tid, a, b, path))

    if not plan:
        print("Nic nového ke stažení.")
        return 0

    if args.dry_run:
        print(f"Plán ({len(plan)} požadavků, zóna {args.tz}):")
        for tid, a, b, path in plan:
            cfg = TYPES[tid]
            if cfg["mode"] == "daily-rollup":
                what = f"POST dataPoints:dailyRollUp {a} → {b} (excl.)"
            else:
                what = "GET dataPoints filter=" + build_filter(tid, cfg, a, b, tz)
            print(f"  {tid:38} {path.relative_to(args.data)}\n      {what}")
        return 0

    session = get_session(args.secrets)
    ok = 0
    failed: list[str] = []
    for tid, a, b, path in plan:
        cfg = TYPES[tid]
        try:
            if cfg["mode"] == "daily-rollup":
                payload = fetch_daily_rollup(session, tid, a, b)
                n = len(payload["rollupDataPoints"])
            else:
                payload = fetch_list(session, tid, build_filter(tid, cfg, a, b, tz), cfg["page"])
                n = len(payload["dataPoints"])
            write_json_atomic(path, payload)
            ok += 1
            print(f"{tid:38} {path.name:28} {n:>7} záznamů")
            done_until = min(b - dt.timedelta(days=1), until)
            if done_until.isoformat() >= state.get(tid, "0000-00-00"):
                state[tid] = done_until.isoformat()
                args.data.mkdir(parents=True, exist_ok=True)
                state_path.write_text(json.dumps(state, indent=2), encoding="utf-8")
        except RuntimeError as e:
            failed.append(f"{tid} {path.name}: {e}")
            print(f"{tid:38} {path.name:28}   CHYBA – {e}", file=sys.stderr)

    print(f"\nHotovo: {ok} souborů uloženo do {raw_dir}")
    if failed:
        print(f"Nepovedlo se ({len(failed)}):", file=sys.stderr)
        for f in failed:
            print("  " + f, file=sys.stderr)
        return 1
    print("Další krok: python summarize.py")
    return 0


if __name__ == "__main__":
    sys.exit(main())
