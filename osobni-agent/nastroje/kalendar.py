#!/usr/bin/env python3
"""Kalendář Google pro osobního agenta.

Čte události z tvého hlavního kalendáře Google. Zapisuje jen do vlastního kalendáře „Mozek",
který si sám založí. Na ostatní kalendáře nesáhne, Google mu to s tímhle přihlášením ani
nedovolí. Nikoho nezve a nikomu nic neposílá.

    agent-kalendar prihlasit                       jednorázové přihlášení (stejný klient jako agent-fitbit)
    agent-kalendar udalosti [--den DEN] [--dni N]  události od daného dne na N dní (výchozí dnes, 1 den)
    agent-kalendar navrh --nazev TEXT --den DEN [--cas HH:MM] [--do HH:MM | --delka 1h30m]
                         [--celodenni] [--misto TEXT] [--poznamka TEXT] [--pripomenout MINUT]
                                                   ukáže, co by se zapsalo, kolize a přesný příkaz
                                                   k zápisu; nic nemění
    agent-kalendar zapis (stejné volby jako navrh) zapíše událost do kalendáře Mozek a ohlásí
                                                   kolize; stejnou událost podruhé nezapíše
    agent-kalendar smaz ID                         smaže událost z kalendáře Mozek

DEN je dnes, zitra, pozitri, den v týdnu (sobota = nejbližší příští, pristi sobota = sobota
v příštím týdnu), za 3 dny, za tyden, datum 31.10. nebo 31. 10. 2026, nebo RRRR-MM-DD.
Datum a čas počítá tenhle skript v pražském čase, ne model.
"""

from __future__ import annotations

import argparse
import json
import re
import shlex
import sys
import unicodedata
import urllib.parse
from dataclasses import dataclass
from datetime import date, datetime, time, timedelta
from pathlib import Path

import google_ucet as google

try:
    from zoneinfo import ZoneInfo

    TZ = ZoneInfo("Europe/Prague")
except Exception:  # bez databáze časových pásem platí čas počítače
    TZ = None

API_URL = "https://www.googleapis.com/calendar/v3/"
SCOPES = [
    "https://www.googleapis.com/auth/calendar.events.readonly",
    "https://www.googleapis.com/auth/calendar.app.created",
]
LOGIN = "agent-kalendar prihlasit"
ZONE = "Europe/Prague"
WEEKDAYS = ["pondělí", "úterý", "středa", "čtvrtek", "pátek", "sobota", "neděle"]
WEEKDAY_FORMS = {"pondeli": 0, "utery": 1, "streda": 2, "stredu": 2, "ctvrtek": 3, "patek": 4,
                 "sobota": 5, "sobotu": 5, "nedele": 6, "nedeli": 6}
NUMBERS = {"jeden": 1, "jednu": 1, "dva": 2, "dve": 2, "tri": 3, "ctyri": 4, "pet": 5, "sest": 6,
           "sedm": 7, "osm": 8, "devet": 9, "deset": 10, "ctrnact": 14}
DEFAULT_REMINDER = 60
MAX_REMINDER = 40320  # 4 týdny, víc Google nedovolí

KalendarError = google.GoogleError


def now() -> datetime:
    """Teď v Praze, bez časového pásma. Stejně se počítá i čas události."""
    return datetime.now(TZ).replace(tzinfo=None)


def aware(moment: datetime) -> datetime:
    return moment.replace(tzinfo=TZ) if TZ else moment.astimezone()


def token_file() -> Path:
    return google.CONFIG_DIR / "google-calendar-token.json"


def login(port=0, opener=google.open_browser, timeout=300):
    return google.login(token_file(), SCOPES, LOGIN, port=port, opener=opener, timeout=timeout)


class Session(google.Session):
    """Volání Google Calendar API s automatickou obnovou přihlášení."""

    def __init__(self):
        super().__init__(token_file(), API_URL, "Google Calendar API", LOGIN)


# ---------- den, čas a délka ----------

def plain(text: str) -> str:
    t = unicodedata.normalize("NFKD", " ".join(text.lower().split()))
    return "".join(c for c in t if not unicodedata.combining(c))


def parse_day(text: str, today: date) -> date:
    t = re.sub(r"^(v|ve|na) ", "", plain(text))
    if t in ("dnes", "dneska"):
        return today
    if t == "zitra":
        return today + timedelta(days=1)
    if t == "pozitri":
        return today + timedelta(days=2)
    next_week = False
    if m := re.fullmatch(r"pristi(?:m)?(?: (?:tyden|tydnu))? (?:v |ve )?(\w+)", t):
        next_week, t = True, m[1]
    if t in WEEKDAY_FORMS:
        wanted = WEEKDAY_FORMS[t]
        if next_week:  # den v příštím týdnu (od pondělí do neděle)
            return today + timedelta(days=7 - today.weekday() + wanted)
        return today + timedelta(days=(wanted - today.weekday()) % 7 or 7)
    if m := re.fullmatch(r"za (?:(\w+) )?(den|dny|dni|tyden|tydny|tydnu)", t):
        count = 1 if not m[1] else int(m[1]) if m[1].isdigit() else NUMBERS.get(m[1])
        if count:
            return today + timedelta(days=count * (7 if m[2].startswith("tyd") else 1))
    if m := re.fullmatch(r"(\d{4})-(\d{1,2})-(\d{1,2})", t):
        return _date(int(m[1]), int(m[2]), int(m[3]), text)
    if m := re.fullmatch(r"(\d{1,2})\. ?(\d{1,2})\.?(?: ?(\d{4}))?", t):
        day = _date(int(m[3]) if m[3] else today.year, int(m[2]), int(m[1]), text)
        if not m[3] and day < today:
            day = _date(today.year + 1, int(m[2]), int(m[1]), text)
        return day
    raise KalendarError(f"Nerozumím dni „{text}“. Použij dnes, zitra, pozitri, den v týdnu, pristi sobota, "
                        "za 3 dny, 31. 10. nebo 2026-10-31.")


def _date(year: int, month: int, day: int, text: str) -> date:
    try:
        return date(year, month, day)
    except ValueError:
        raise KalendarError(f"Datum „{text}“ neexistuje.") from None


def parse_time(text: str) -> time:
    t = re.sub(r"^(v|ve|od|do) ", "", plain(text))
    m = re.fullmatch(r"(\d{1,2})(?:[:.](\d{2}))? ?(?:h|hod)?", t)
    if not m or int(m[1]) > 23 or int(m[2] or 0) > 59:
        raise KalendarError(f"Nerozumím času „{text}“. Napiš ho jako 18:00.")
    return time(int(m[1]), int(m[2] or 0))


def parse_duration(text: str) -> timedelta:
    t = plain(text).replace(" ", "").replace(",", ".")
    if m := re.fullmatch(r"(\d{1,2}):(\d{2})", t):
        minutes = int(m[1]) * 60 + int(m[2])
    elif (m := re.fullmatch(r"(?:(\d+(?:\.\d+)?)h(?:od(?:in[ay]?)?)?)?(?:(\d+)m(?:in(?:ut[ay]?)?)?)?", t)) \
            and (m[1] or m[2]):
        minutes = round(float(m[1] or 0) * 60) + int(m[2] or 0)
    else:
        raise KalendarError(f"Nerozumím délce „{text}“. Napiš ji jako 2h, 90m nebo 1h30m.")
    if not 0 < minutes <= 24 * 60:
        raise KalendarError("Délka musí být víc než 0 a nejvýš 24 hodin.")
    return timedelta(minutes=minutes)


def day_text(d: date) -> str:
    return f"{WEEKDAYS[d.weekday()]} {d.day}. {d.month}. {d.year}"


def short_day(d: date) -> str:
    return f"{WEEKDAYS[d.weekday()]} {d.day}. {d.month}."


def one_line(text: str | None, limit: int) -> str:
    return " ".join((text or "").split())[:limit]


# ---------- událost ----------

@dataclass
class Event:
    body: dict     # tělo pro Google
    line: str      # jedna věta pro uživatele
    command: str   # přesný příkaz k zápisu, s vypočteným datem
    start: datetime
    end: datetime
    all_day: bool


def build_event(args, moment: datetime) -> Event:
    title = one_line(args.nazev, 200)
    if not title:
        raise KalendarError("Chybí název události (--nazev).")
    place, note = one_line(args.misto, 300), one_line(args.poznamka, 1000)
    reminder = args.pripomenout
    if reminder is not None and not 0 <= reminder <= MAX_REMINDER:
        raise KalendarError("Připomenutí může být 0 až 40 320 minut (4 týdny) předem.")
    day = parse_day(args.den, moment.date())
    command = ["agent-kalendar", "zapis", "--nazev", title, "--den", day.isoformat()]
    body: dict = {"summary": title, "description": (note + "\n\n" if note else "") + "Zapsal osobní agent."}
    if place:
        body["location"] = place
    if args.celodenni:
        if args.cas or args.do or args.delka:
            raise KalendarError("Buď --celodenni, nebo čas (--cas, --do, --delka), ne obojí.")
        if day < moment.date():
            raise KalendarError(f"Den {day_text(day)} už je pryč.")
        start, end = datetime.combine(day, time.min), datetime.combine(day + timedelta(days=1), time.min)
        body["start"] = {"date": day.isoformat()}
        body["end"] = {"date": (day + timedelta(days=1)).isoformat()}
        when = f"{day_text(day)}, celý den"
        command.append("--celodenni")
    else:
        if not args.cas:
            raise KalendarError("Chybí čas začátku (--cas). Zeptej se, v kolik to začíná, nebo jestli je "
                                "to na celý den (--celodenni).")
        start = datetime.combine(day, parse_time(args.cas))
        if args.do:
            end = datetime.combine(day, parse_time(args.do))
            if end <= start:
                end += timedelta(days=1)  # např. 22:00 až 1:00
        else:
            end = start + (parse_duration(args.delka) if args.delka else timedelta(hours=1))
        if start <= moment:
            raise KalendarError(f"Začátek {day_text(day)} v {start:%H:%M} už je pryč.")
        body["start"] = {"dateTime": start.strftime("%Y-%m-%dT%H:%M:00"), "timeZone": ZONE}
        body["end"] = {"dateTime": end.strftime("%Y-%m-%dT%H:%M:00"), "timeZone": ZONE}
        until = f"{end:%H:%M}" if end.date() == start.date() else f"{day_text(end.date())} {end:%H:%M}"
        when = f"{day_text(day)}, {start:%H:%M}–{until}"
        command += ["--cas", f"{start:%H:%M}", "--do", f"{end:%H:%M}"]
        if reminder is None:
            reminder = DEFAULT_REMINDER
    line = f"{title} — {when}"
    if place:
        line += f", {place}"
        command += ["--misto", place]
    if note:
        command += ["--poznamka", note]
    if reminder is not None:
        body["reminders"] = {"useDefault": False, "overrides": [{"method": "popup", "minutes": reminder}]}
        alarm = start - timedelta(minutes=reminder)
        line += (f", připomenutí v {alarm:%H:%M}" if alarm.date() == start.date()
                 else f", připomenutí {short_day(alarm.date())} v {alarm:%H:%M}")
        command += ["--pripomenout", str(reminder)]
    return Event(body, line + " (kalendář Mozek)", " ".join(shlex.quote(p) for p in command),
                 start, end, bool(args.celodenni))


def quoted(calendar_id: str) -> str:
    return urllib.parse.quote(calendar_id, safe="")


def mozek_calendar(session: Session) -> tuple[str, bool]:
    """ID kalendáře Mozek a jestli se teď založil. Při prvním zápisu ho založí."""
    if session.token.get("kalendar_mozek"):
        return session.token["kalendar_mozek"], False
    created = session.call("POST", "calendars", data={
        "summary": "Mozek", "timeZone": ZONE,
        "description": "Události, které zapsal osobní agent na tvůj pokyn."})
    session.token["kalendar_mozek"] = created["id"]
    session.save()
    return created["id"], True


def insert_event(session: Session, body: dict) -> tuple[dict, str]:
    """Zapíše událost do kalendáře Mozek. Vrátí odpověď Googlu a poznámku pro uživatele."""
    note = ""
    for attempt in (1, 2):
        calendar_id, new = mozek_calendar(session)
        if new:
            note = ("Kalendář Mozek chyběl, založil jsem nový." if attempt == 2 else
                    "Založil jsem kalendář Mozek. V iPhonu ho najdeš v aplikaci Kalendář → Kalendáře.")
        try:
            created = session.call("POST", f"calendars/{quoted(calendar_id)}/events",
                                   query={"sendUpdates": "none"}, data=body)
            return created, note
        except google.RequestError as exc:
            if exc.code != 404 or attempt == 2:
                raise
            session.token.pop("kalendar_mozek", None)  # kalendář Mozek někdo smazal
    raise KalendarError("Zápis do kalendáře se nepovedl.")


def event_json(item: dict, label: str) -> dict:
    start, end = item.get("start") or {}, item.get("end") or {}
    first, last = start.get("dateTime") or start.get("date") or "", end.get("dateTime") or end.get("date") or ""
    out = {"kalendar": label, "id": item.get("id"), "nazev": item.get("summary") or "(bez názvu)",
           "den": "", "cas": "", "zacatek": first, "konec": last, "celodenni": "date" in start}
    try:
        if out["celodenni"]:
            d0, d1 = date.fromisoformat(first), date.fromisoformat(last) - timedelta(days=1)
            out["den"] = short_day(d0)
            out["cas"] = "celý den" if d1 <= d0 else f"celý den, do {short_day(d1)}"
        else:
            s, e = moment_of(first), moment_of(last)
            out["den"] = short_day(s.date())
            out["cas"] = (f"{s:%H:%M}–{e:%H:%M}" if e.date() == s.date()
                          else f"{s:%H:%M}–{short_day(e.date())} {e:%H:%M}")
    except ValueError:
        pass
    if item.get("location"):
        out["misto"] = item["location"]
    if item.get("description"):
        out["popis"] = item["description"][:500]
    return out


def list_events(session: Session, first_day: date, days: int) -> list[dict]:
    time_min = aware(datetime.combine(first_day, time.min)).isoformat()
    time_max = aware(datetime.combine(first_day + timedelta(days=days), time.min)).isoformat()
    sources = [("hlavní", "primary")]
    if session.token.get("kalendar_mozek"):
        sources.append(("Mozek", session.token["kalendar_mozek"]))
    events = []
    for label, calendar_id in sources:
        page = None
        for _ in range(20):
            query = {"timeMin": time_min, "timeMax": time_max, "singleEvents": "true", "orderBy": "startTime",
                     "timeZone": ZONE, "maxResults": 250}
            if page:
                query["pageToken"] = page
            try:
                answer = session.call("GET", f"calendars/{quoted(calendar_id)}/events", query=query)
            except google.RequestError as exc:
                if label == "Mozek" and exc.code == 404:
                    break  # kalendář Mozek mezitím někdo smazal
                raise
            events += [event_json(e, label) for e in answer.get("items", []) if e.get("status") != "cancelled"]
            page = answer.get("nextPageToken")
            if not page:
                break
    return sorted(events, key=lambda e: e["zacatek"])


def moment_of(text: str) -> datetime:
    moment = datetime.fromisoformat(text)
    return aware(moment) if moment.tzinfo is None else moment


def nearby(session: Session, event: Event) -> list[dict]:
    """Události ve dnech, kdy je nová událost."""
    days = (event.end.date() - event.start.date()).days + (0 if event.all_day else 1)
    return list_events(session, event.start.date(), max(days, 1))


def duplicate(events: list[dict], event: Event) -> dict | None:
    """Stejná událost, která už v kalendáři Mozek je (třeba když se příkaz spustí podruhé)."""
    title = event.body["summary"].casefold()
    for other in events:
        if other["kalendar"] != "Mozek" or other["nazev"].casefold() != title:
            continue
        if event.all_day:
            if other["celodenni"] and other["zacatek"] == event.start.date().isoformat():
                return other
            continue
        try:
            if not other["celodenni"] and moment_of(other["zacatek"]) == aware(event.start):
                return other
        except ValueError:
            continue
    return None


def conflicts(events: list[dict], event: Event) -> list[str]:
    """Události s časem, které se s novou překrývají."""
    if event.all_day:
        return []
    start, end = aware(event.start), aware(event.end)
    clash = []
    for other in events:
        if other["celodenni"]:
            continue
        try:
            s, e = moment_of(other["zacatek"]), moment_of(other["konec"])
        except ValueError:
            continue
        if s < end and e > start:
            clash.append(f"{other['nazev']} ({other['cas']})")
    return clash


# ---------- příkazy ----------

def add_event_options(parser: argparse.ArgumentParser) -> None:
    parser.add_argument("--nazev", required=True)
    parser.add_argument("--den", required=True)
    parser.add_argument("--cas")
    end = parser.add_mutually_exclusive_group()
    end.add_argument("--do")
    end.add_argument("--delka")
    parser.add_argument("--celodenni", action="store_true")
    parser.add_argument("--misto")
    parser.add_argument("--poznamka")
    parser.add_argument("--pripomenout", type=int, metavar="MINUT")


def cmd_proposal(args) -> None:
    event = build_event(args, now())
    print(f"Návrh: {event.line}")
    try:
        events = nearby(Session(), event)
    except (KalendarError, OSError) as exc:
        print(f"Kolize jsem nezkontroloval: {exc}")
    else:
        same = duplicate(events, event)
        if same:
            print(f"Pozor, tahle událost už v kalendáři Mozek je (ID {same['id']}).")
        clash = conflicts([e for e in events if e is not same], event)
        if clash:
            print("Pozor, v tu dobu už máš: " + "; ".join(clash))
    print(f"Zapsat: {event.command}")
    print("Nic se zatím nezapsalo.")


def cmd_write(args) -> None:
    event = build_event(args, now())
    session = Session()
    events = nearby(session, event)
    same = duplicate(events, event)
    if same:
        print(f"Už zapsáno, podruhé nezapisuji: {event.line}\nID: {same['id']}")
        return
    created, note = insert_event(session, event.body)
    if note:
        print(note)
    print(f"Zapsáno: {event.line}\nID: {created.get('id')}")
    clash = conflicts(events, event)
    if clash:
        print("Pozor, v tu dobu už máš: " + "; ".join(clash))


def cmd_delete(event_id: str) -> None:
    session = Session()
    calendar_id = session.token.get("kalendar_mozek")
    if not calendar_id:
        raise KalendarError("Kalendář Mozek zatím neexistuje, není co mazat.")
    path = f"calendars/{quoted(calendar_id)}/events/{quoted(event_id)}"
    try:
        item = session.call("GET", path)
    except google.RequestError:
        raise KalendarError(f"Událost {event_id} v kalendáři Mozek není. Jiné kalendáře měnit nesmím.") from None
    info = event_json(item, "Mozek")
    if item.get("status") == "cancelled":
        print(f"Událost {info['nazev']} už je smazaná.")
        return
    session.call("DELETE", path, query={"sendUpdates": "none"})
    print(f"Smazáno: {info['nazev']} ({info['den']}, {info['cas']})")


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(prog="agent-kalendar",
                                     description="Kalendář Google: čtení a zápis do kalendáře Mozek.")
    sub = parser.add_subparsers(dest="cmd", required=True)
    p_login = sub.add_parser("prihlasit", help="jednorázové přihlášení přes prohlížeč")
    p_login.add_argument("--port", type=int, default=0)
    p_list = sub.add_parser("udalosti", help="události od daného dne")
    p_list.add_argument("--den", default="dnes")
    p_list.add_argument("--dni", type=int, default=1)
    add_event_options(sub.add_parser("navrh", help="ukáže, co by se zapsalo, nic nemění"))
    add_event_options(sub.add_parser("zapis", help="zapíše událost do kalendáře Mozek"))
    sub.add_parser("smaz", help="smaže událost z kalendáře Mozek").add_argument("id")
    return parser


def main(argv: list[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    try:
        if args.cmd == "prihlasit":
            login(port=args.port)
        elif args.cmd == "navrh":
            cmd_proposal(args)
        elif args.cmd == "zapis":
            cmd_write(args)
        elif args.cmd == "smaz":
            cmd_delete(args.id)
        else:
            first_day = parse_day(args.den, now().date())
            days = max(1, min(args.dni, 31))
            print(json.dumps({"od": first_day.isoformat(), "do": (first_day + timedelta(days=days - 1)).isoformat(),
                              "udalosti": list_events(Session(), first_day, days)}, ensure_ascii=False, indent=2))
        return 0
    except (KalendarError, OSError) as exc:
        print(f"Chyba: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
