#!/usr/bin/env python3
"""Stahování dat z náramku Fitbit Air přes Google Health API, jen pro čtení.

Ukládá denní souhrny do Mozku (zdravi/data/RRRR-MM-DD.json), ze kterých počítá agent-zdravi.
Spouští ho časovač v systemd, ne agent. Od Googlu čte jen spánek, aktivitu a zdravotní
ukazatele, nic neodesílá a nic neukládá po minutách.

    agent-fitbit prihlasit [--port N]   jednorázové přihlášení přes prohlížeč ve Windows
    agent-fitbit stahni [--dni N]       stáhne chybějící dny do zdravi/data/ (aspoň 3, nejvýš 30)
    agent-fitbit struktura              ukáže jen strukturu odpovědí Googlu, bez hodnot
    agent-fitbit casovac                stahování každou hodinu od 5:15 do 23:15 (systemd)

Soubory v ~/.config/agent/ (práva 600, agent do nich nevidí):
    google-health-client.json   klient OAuth stažený z Google Cloud (typ Desktop app)
    google-health-token.json    uložené přihlášení
"""


from __future__ import annotations

import argparse
import json
import os
import subprocess
import sys
from datetime import date, datetime, timedelta, timezone
from pathlib import Path

import google_ucet as google

MOZEK = Path(os.environ.get("AGENT_MOZEK", Path.home() / "Mozek"))
API_URL = "https://health.googleapis.com/v4/"
SCOPES = [
    "https://www.googleapis.com/auth/googlehealth.sleep.readonly",
    "https://www.googleapis.com/auth/googlehealth.activity_and_fitness.readonly",
    "https://www.googleapis.com/auth/googlehealth.health_metrics_and_measurements.readonly",
]
LOGIN = "agent-fitbit prihlasit"
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

FitbitError = google.GoogleError
DataTypeError = google.RequestError  # jeden druh dat nejde stáhnout, ostatní se stáhnou dál


def token_file() -> Path:
    return google.CONFIG_DIR / "google-health-token.json"


def login(port: int = 0, opener=google.open_browser, timeout: float = 300) -> dict:
    return google.login(token_file(), SCOPES, LOGIN, port=port, opener=opener, timeout=timeout)


class Session(google.Session):
    """Volání Google Health API s automatickou obnovou přihlášení."""

    def __init__(self):
        super().__init__(token_file(), API_URL, "Google Health API", LOGIN)


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


def fetch(session: Session, start: date, end: date, problems: list[str] | None = None) -> dict[date, dict]:
    """Stáhne dny start..end a vrátí je ve formátu zdravi/data (viz skills/zdravi/METODIKA.md).
    Když jeden druh dat nejde stáhnout, zapíše to do problems a pokračuje dalším."""
    days: dict[date, dict] = {}
    problems = [] if problems is None else problems

    def put(day: date, key: str, value) -> None:
        if start <= day <= end and value is not None:
            days.setdefault(day, {})[key] = value

    def daily(data_type: str) -> list[dict]:
        return list_points(session, data_type, date_filter(f"{data_type.replace('-', '_')}.date", start, end))

    def sleep() -> None:
        found = list_points(session, "sleep", date_filter("sleep.interval.civil_end_time", start, end), page_size=25)
        for day, record in sleep_by_day(found).items():
            put(day, "spanek", {k: v for k, v in record.items() if v is not None})

    def daily_metric(data_type: str) -> None:
        field, value_key, target = DAILY[data_type]
        for day, value in daily_values(daily(data_type), field, value_key).items():
            put(day, target, value)

    def temperature() -> None:
        for day, value in temperature_by_day(daily(TEMPERATURE)).items():
            put(day, "teplota_odchylka_c", value)

    def rollup(data_type: str, target: str, extract) -> None:
        for day, value in rollup_by_day(daily_rollup(session, data_type, start, end), extract).items():
            put(day, target, value)

    jobs = [("sleep", sleep)]
    jobs += [(data_type, lambda data_type=data_type: daily_metric(data_type)) for data_type in DAILY]
    jobs += [(TEMPERATURE, temperature),
             ("steps", lambda: rollup("steps", "kroky", steps_value)),
             ("active-zone-minutes", lambda: rollup("active-zone-minutes", "aktivni_min", zone_minutes_value))]
    for data_type, job in jobs:
        try:
            job()
        except DataTypeError as exc:
            problems.append(f"{data_type}: {exc}")
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

def count(n: int, one: str, few: str, many: str) -> str:
    """České skloňování počtu: 1 den, 2 dny, 5 dní."""
    return f"{n} {one if n == 1 else few if 2 <= n <= 4 else many}"


def default_days(mozek: Path, today: date) -> int:
    """Kolik dní stáhnout: aspoň 3. Když telefon několik dní nesynchronizoval, i celou mezeru
    od posledního dne s daty, nejvýš 30 dní."""
    for path in sorted((mozek / "zdravi" / "data").glob("*.json"), reverse=True):
        try:
            last = date.fromisoformat(path.stem)
        except ValueError:
            continue
        return min(30, max(3, (today - last).days + 2))
    return 30


def cmd_download(days_back: int, mozek: Path) -> int:
    session = Session()
    end = date.today()
    start = end - timedelta(days=max(days_back, 1) - 1)
    problems: list[str] = []
    days = fetch(session, start, end, problems)
    written = save_days(days, mozek)
    nights = sum(1 for v in days.values() if "spanek" in v)
    print(f"Staženo {start.isoformat()} až {end.isoformat()}: {count(len(written), 'den', 'dny', 'dní')} s daty, "
          f"z toho {count(nights, 'noc', 'noci', 'nocí')}. Uloženo do {mozek / 'zdravi' / 'data'}.")
    for problem in problems:
        print(f"Nestaženo {problem}", file=sys.stderr)
    return 1 if problems and not written else 0


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
    p_get = sub.add_parser("stahni", help="stáhne chybějící dny (nebo posledních N dní)")
    p_get.add_argument("--dni", type=int, default=None)
    sub.add_parser("struktura", help="struktura odpovědí bez hodnot")
    sub.add_parser("casovac", help="stahování každou hodinu (systemd)")
    args = parser.parse_args(argv)
    try:
        if args.cmd == "prihlasit":
            login(args.port)
            return 0
        if args.cmd == "stahni":
            days = args.dni if args.dni else default_days(args.mozek, date.today())
            return cmd_download(min(days, 90), args.mozek)
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
