"""Testy pro kalendar.py s falešným serverem Googlu (žádný skutečný účet ani internet)."""

import http.server
import importlib.util
import io
import json
import os
import shlex
import stat
import sys
import tempfile
import threading
import unittest
import urllib.parse
import urllib.request
from contextlib import redirect_stderr, redirect_stdout
from datetime import date, datetime
from pathlib import Path

HERE = Path(__file__).resolve().parent


def load(name, file):
    spec = importlib.util.spec_from_file_location(name, HERE.parent / file)
    module = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = module  # dataclasses potřebují modul v sys.modules
    spec.loader.exec_module(module)
    return module


google = load("google_ucet", "google_ucet.py")
kalendar = load("kalendar", "kalendar.py")
FRIDAY = date(2026, 10, 30)
MONDAY = date(2026, 11, 2)
NOW = datetime(2026, 10, 30, 10, 0)
MOZEK = "mozek1@group.calendar.google.com"


def timed(event_id, title, start, end, status="confirmed"):
    return {"id": event_id, "summary": title, "status": status,
            "start": {"dateTime": start, "timeZone": "Europe/Prague"}, "end": {"dateTime": end}}


def primary_events():
    return [
        timed("p1", "Porada", "2026-10-31T17:30:00+01:00", "2026-10-31T18:30:00+01:00"),
        timed("p2", "Zrušená schůzka", "2026-10-31T18:00:00+01:00", "2026-10-31T19:00:00+01:00", "cancelled"),
        {"id": "p3", "summary": "Dušičky", "start": {"date": "2026-11-02"}, "end": {"date": "2026-11-03"}},
        {"id": "p4", "summary": "Dovolená", "location": "Šumava", "start": {"date": "2026-10-31"},
         "end": {"date": "2026-11-03"}},
    ]


class FakeCalendar(http.server.BaseHTTPRequestHandler):
    calls: list = []
    calendars: dict = {}
    created = 0
    api_status = 200

    def log_message(self, *args):
        pass

    def reply(self, status, obj=None):
        body = b"" if obj is None else json.dumps(obj).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def request_parts(self, data=None):
        url = urllib.parse.urlparse(self.path)
        query = dict(urllib.parse.parse_qsl(url.query))
        FakeCalendar.calls.append((self.command, url.path, query, data))
        # /calendar/v3/calendars/<kalendář>/events/<událost>
        parts = [urllib.parse.unquote(p) for p in url.path.split("/")]
        return url.path, parts, query

    def not_found(self):
        self.reply(404, {"error": {"code": 404, "message": "Not Found"}})

    def blocked(self):
        if FakeCalendar.api_status != 200:
            self.reply(FakeCalendar.api_status, {"error": {"code": FakeCalendar.api_status}})
            return True
        return False

    def do_POST(self):
        raw = self.rfile.read(int(self.headers.get("Content-Length") or 0)).decode()
        if self.path == "/token":
            form = dict(urllib.parse.parse_qsl(raw))
            FakeCalendar.calls.append(("token", form))
            if form.get("grant_type") == "authorization_code":
                return self.reply(200, {"access_token": "a1", "refresh_token": "r-novy", "expires_in": 3600,
                                        "scope": " ".join(kalendar.SCOPES)})
            return self.reply(200, {"access_token": "a2", "expires_in": 3600})
        path, parts, _ = self.request_parts(json.loads(raw or "{}"))
        if self.blocked():
            return
        data = json.loads(raw or "{}")
        if path.endswith("/calendars"):
            FakeCalendar.created += 1
            new_id = f"mozek{FakeCalendar.created}@group.calendar.google.com"
            FakeCalendar.calendars[new_id] = []
            return self.reply(200, {"id": new_id, "summary": data["summary"]})
        items = FakeCalendar.calendars.get(parts[4])
        if items is None:
            return self.not_found()
        item = dict(data, id=f"ev{len(items) + 1}", status="confirmed")
        items.append(item)
        return self.reply(200, item)

    def do_GET(self):
        _, parts, query = self.request_parts()
        if self.blocked():
            return
        items = FakeCalendar.calendars.get(parts[4])
        if items is None:
            return self.not_found()
        if len(parts) > 6:
            match = [e for e in items if e["id"] == parts[6]]
            return self.reply(200, match[0]) if match else self.not_found()
        if parts[4] == "primary":  # dvě stránky
            if query.get("pageToken") != "p2":
                return self.reply(200, {"items": items[:2], "nextPageToken": "p2"})
            return self.reply(200, {"items": items[2:]})
        return self.reply(200, {"items": items})

    def do_DELETE(self):
        _, parts, _ = self.request_parts()
        for item in FakeCalendar.calendars.get(parts[4], []):
            if item["id"] == parts[6]:
                item["status"] = "cancelled"
                return self.reply(204)
        return self.not_found()


class KalendarTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), FakeCalendar)
        threading.Thread(target=cls.server.serve_forever, daemon=True).start()
        base = f"http://127.0.0.1:{cls.server.server_port}"
        google.TOKEN_URL = base + "/token"
        google.AUTH_URL = base + "/auth"
        kalendar.API_URL = base + "/calendar/v3/"

    @classmethod
    def tearDownClass(cls):
        cls.server.shutdown()
        cls.server.server_close()

    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        google.CONFIG_DIR = Path(self.tmp.name) / "config"
        google.CONFIG_DIR.mkdir()
        (google.CONFIG_DIR / "google-health-client.json").write_text(
            json.dumps({"installed": {"client_id": "cid", "client_secret": "sec"}}), encoding="utf-8")
        FakeCalendar.calls = []
        FakeCalendar.calendars = {"primary": primary_events()}
        FakeCalendar.created = 0
        FakeCalendar.api_status = 200
        self.real_now = kalendar.now
        kalendar.now = lambda: NOW

    def tearDown(self):
        kalendar.now = self.real_now
        self.tmp.cleanup()

    def save_token(self, mozek=MOZEK):
        data = {"refresh_token": "r1", "access_token": "old", "expires_at": 0}
        if mozek:
            data["kalendar_mozek"] = mozek
        google.write_private(kalendar.token_file(), data)

    def run_cmd(self, *argv):
        out, err = io.StringIO(), io.StringIO()
        with redirect_stdout(out), redirect_stderr(err):
            code = kalendar.main(list(argv))
        return code, out.getvalue(), err.getvalue()

    def event(self, *argv, moment=NOW):
        return kalendar.build_event(kalendar.build_parser().parse_args(["navrh", *argv]), moment)

    def writes(self):
        return [c for c in FakeCalendar.calls if c[0] in ("POST", "DELETE")]

    # ---------- den, čas a délka ----------

    def test_days_in_czech(self):
        cases = {
            "dnes": "2026-10-30", "zítra": "2026-10-31", "pozítří": "2026-11-01", "sobota": "2026-10-31",
            "v sobotu": "2026-10-31", "v pátek": "2026-11-06", "V neděli": "2026-11-01", "ve středu": "2026-11-04",
            "za 3 dny": "2026-11-02", "za tři dny": "2026-11-02", "za týden": "2026-11-06",
            "za 2 týdny": "2026-11-13", "31.10.": "2026-10-31", "31. 10. 2026": "2026-10-31",
            "15. 1.": "2027-01-15", "2026-12-24": "2026-12-24",
        }
        for text, expected in cases.items():
            with self.subTest(text=text):
                self.assertEqual(kalendar.parse_day(text, FRIDAY).isoformat(), expected)
        # „příští" je den v příštím týdnu, ne nejbližší
        self.assertEqual(kalendar.parse_day("úterý", MONDAY).isoformat(), "2026-11-03")
        self.assertEqual(kalendar.parse_day("příští úterý", MONDAY).isoformat(), "2026-11-10")
        self.assertEqual(kalendar.parse_day("v příštím týdnu v pondělí", MONDAY).isoformat(), "2026-11-09")
        self.assertEqual(kalendar.parse_day("příští týden ve středu", FRIDAY).isoformat(), "2026-11-04")
        for bad in ("31.2.", "příští týden", "brzy", "za pár dní"):
            with self.subTest(bad=bad), self.assertRaises(kalendar.KalendarError):
                kalendar.parse_day(bad, FRIDAY)

    def test_times_and_durations(self):
        self.assertEqual(kalendar.parse_time("18").isoformat(), "18:00:00")
        self.assertEqual(kalendar.parse_time("v 9.15").isoformat(), "09:15:00")
        self.assertEqual(kalendar.parse_time("18:30 hod").isoformat(), "18:30:00")
        for bad in ("25:00", "18:75", "večer"):
            with self.subTest(bad=bad), self.assertRaises(kalendar.KalendarError):
                kalendar.parse_time(bad)
        minutes = {"1h30m": 90, "2 hodiny": 120, "90 min": 90, "1,5 h": 90, "1:30": 90, "45 minut": 45}
        for text, expected in minutes.items():
            with self.subTest(text=text):
                self.assertEqual(kalendar.parse_duration(text).total_seconds() / 60, expected)
        for bad in ("0m", "25h", "chvíli"):
            with self.subTest(bad=bad), self.assertRaises(kalendar.KalendarError):
                kalendar.parse_duration(bad)

    # ---------- událost ----------

    def test_timed_event_and_exact_command(self):
        event = self.event("--nazev", "Oslava u Petra", "--den", "zítra", "--cas", "18")
        self.assertEqual(event.body, {
            "summary": "Oslava u Petra",
            "description": "Zapsal osobní agent.",
            "start": {"dateTime": "2026-10-31T18:00:00", "timeZone": "Europe/Prague"},
            "end": {"dateTime": "2026-10-31T19:00:00", "timeZone": "Europe/Prague"},
            "reminders": {"useDefault": False, "overrides": [{"method": "popup", "minutes": 60}]},
        })
        self.assertEqual(event.line, "Oslava u Petra — sobota 31. 10. 2026, 18:00–19:00, připomenutí v 17:00 "
                                     "(kalendář Mozek)")
        self.assertEqual(event.command, "agent-kalendar zapis --nazev 'Oslava u Petra' --den 2026-10-31 "
                                        "--cas 18:00 --do 19:00 --pripomenout 60")
        # příkaz z návrhu zapíše přesně totéž, i kdyby se spustil až později
        again = kalendar.build_event(kalendar.build_parser().parse_args(shlex.split(event.command)[1:]),
                                     datetime(2026, 10, 31, 9, 0))
        self.assertEqual(again.body, event.body)

    def test_overnight_event_with_place_and_note(self):
        event = self.event("--nazev", "Párty", "--den", "sobota", "--cas", "22:00", "--do", "1:00",
                           "--misto", "U Petra", "--poznamka", "koupit\n  víno")
        self.assertEqual(event.body["end"], {"dateTime": "2026-11-01T01:00:00", "timeZone": "Europe/Prague"})
        self.assertEqual(event.body["location"], "U Petra")
        self.assertEqual(event.body["description"], "koupit víno\n\nZapsal osobní agent.")
        self.assertEqual(event.line, "Párty — sobota 31. 10. 2026, 22:00–neděle 1. 11. 2026 01:00, U Petra, "
                                     "připomenutí v 21:00 (kalendář Mozek)")
        self.assertIn("--misto 'U Petra' --poznamka 'koupit víno'", event.command)
        self.assertNotIn("attendees", event.body)

    def test_all_day_event(self):
        event = self.event("--nazev", "Narozeniny mámy", "--den", "31. 10.", "--celodenni", "--pripomenout", "900")
        self.assertEqual(event.body["start"], {"date": "2026-10-31"})
        self.assertEqual(event.body["end"], {"date": "2026-11-01"})
        self.assertEqual(event.line, "Narozeniny mámy — sobota 31. 10. 2026, celý den, připomenutí pátek 30. 10. "
                                     "v 09:00 (kalendář Mozek)")
        self.assertEqual(event.command, "agent-kalendar zapis --nazev 'Narozeniny mámy' --den 2026-10-31 "
                                        "--celodenni --pripomenout 900")
        quiet = self.event("--nazev", "Výlet", "--den", "neděle", "--celodenni")
        self.assertNotIn("reminders", quiet.body)

    def test_event_errors(self):
        cases = [
            (("--nazev", "Ráno", "--den", "dnes", "--cas", "8:00"), "už je pryč"),
            (("--nazev", "X", "--den", "zitra", "--celodenni", "--cas", "18"), "Buď --celodenni"),
            (("--nazev", "X", "--den", "zitra"), "Chybí čas začátku"),
            (("--nazev", "X", "--den", "zitra", "--cas", "18", "--delka", "25h"), "nejvýš 24 hodin"),
            (("--nazev", "   ", "--den", "zitra", "--cas", "18"), "Chybí název"),
            (("--nazev", "X", "--den", "zitra", "--cas", "18", "--pripomenout", "50000"), "4 týdny"),
        ]
        for argv, message in cases:
            with self.subTest(message=message), self.assertRaisesRegex(kalendar.KalendarError, message):
                self.event(*argv)
        with redirect_stderr(io.StringIO()), self.assertRaises(SystemExit):
            self.event("--nazev", "X", "--den", "zitra", "--cas", "18", "--do", "19", "--delka", "2h")

    # ---------- práce s Googlem ----------

    def test_proposal_shows_conflict_and_writes_nothing(self):
        self.save_token(mozek=None)
        code, out, _ = self.run_cmd("navrh", "--nazev", "Oslava u Petra", "--den", "zitra", "--cas", "18")
        self.assertEqual(code, 0)
        self.assertIn("Návrh: Oslava u Petra — sobota 31. 10. 2026, 18:00–19:00, připomenutí v 17:00", out)
        self.assertIn("Pozor, v tu dobu už máš: Porada (17:30–18:30)", out)  # zrušená schůzka a dovolená ne
        self.assertNotIn("Zrušená", out)
        self.assertIn("Zapsat: agent-kalendar zapis --nazev 'Oslava u Petra' --den 2026-10-31 --cas 18:00", out)
        self.assertEqual(self.writes(), [])

    def test_proposal_works_without_login(self):
        code, out, _ = self.run_cmd("navrh", "--nazev", "Kino", "--den", "zitra", "--cas", "20")
        self.assertEqual(code, 0)
        self.assertIn("Kolize jsem nezkontroloval: Ještě nejsi přihlášený. Spusť: agent-kalendar prihlasit", out)
        self.assertIn("Zapsat: agent-kalendar zapis --nazev Kino --den 2026-10-31", out)

    def test_write_creates_mozek_once_and_never_invites(self):
        self.save_token(mozek=None)
        code, out, _ = self.run_cmd("zapis", "--nazev", "Oslava u Petra", "--den", "2026-10-31", "--cas", "18:00",
                                    "--do", "21:00")
        self.assertEqual(code, 0)
        self.assertIn("Založil jsem kalendář Mozek", out)
        self.assertIn("Zapsáno: Oslava u Petra — sobota 31. 10. 2026, 18:00–21:00, připomenutí v 17:00 "
                      "(kalendář Mozek)\nID: ev1", out)
        code, out, _ = self.run_cmd("zapis", "--nazev", "Večeře", "--den", "pondělí", "--cas", "19")
        self.assertEqual(code, 0)
        self.assertNotIn("Založil", out)
        self.assertEqual(FakeCalendar.created, 1)
        created = [c for c in self.writes() if c[1].endswith("/calendars")]
        self.assertEqual(created[0][3]["summary"], "Mozek")
        events = [c for c in self.writes() if c[1].endswith("/events")]
        self.assertEqual(len(events), 2)
        for _, path, query, body in events:
            self.assertEqual(path, "/calendar/v3/calendars/mozek1%40group.calendar.google.com/events")
            self.assertEqual(query, {"sendUpdates": "none"})
            self.assertNotIn("attendees", body)
        saved = json.loads(kalendar.token_file().read_text(encoding="utf-8"))
        self.assertEqual(saved["kalendar_mozek"], MOZEK)
        self.assertEqual(stat.S_IMODE(os.stat(kalendar.token_file()).st_mode), 0o600)

    def test_write_recreates_deleted_mozek(self):
        self.save_token(mozek="smazany@group.calendar.google.com")
        code, out, _ = self.run_cmd("zapis", "--nazev", "Kino", "--den", "zitra", "--cas", "20")
        self.assertEqual(code, 0)
        self.assertIn("Kalendář Mozek chyběl, založil jsem nový.", out)
        saved = json.loads(kalendar.token_file().read_text(encoding="utf-8"))
        self.assertEqual(saved["kalendar_mozek"], MOZEK)
        self.assertEqual(len(FakeCalendar.calendars[MOZEK]), 1)

    def test_events_from_both_calendars(self):
        self.save_token()
        FakeCalendar.calendars[MOZEK] = [timed("m1", "Oslava u Petra", "2026-10-31T18:00:00+01:00",
                                               "2026-10-31T21:00:00+01:00")]
        code, out, _ = self.run_cmd("udalosti", "--den", "zitra", "--dni", "3")
        self.assertEqual(code, 0)
        data = json.loads(out)
        self.assertEqual((data["od"], data["do"]), ("2026-10-31", "2026-11-02"))
        listed = [(e["nazev"], e["kalendar"], e["den"], e["cas"]) for e in data["udalosti"]]
        self.assertEqual(listed, [
            ("Dovolená", "hlavní", "sobota 31. 10.", "celý den, do pondělí 2. 11."),
            ("Porada", "hlavní", "sobota 31. 10.", "17:30–18:30"),
            ("Oslava u Petra", "Mozek", "sobota 31. 10.", "18:00–21:00"),
            ("Dušičky", "hlavní", "pondělí 2. 11.", "celý den"),
        ])
        self.assertEqual(data["udalosti"][0]["misto"], "Šumava")
        primary = [c for c in FakeCalendar.calls if c[0] == "GET" and "/calendars/primary/" in c[1]]
        self.assertEqual(len(primary), 2)  # obě stránky
        query = primary[0][2]
        self.assertEqual(query["timeMin"], "2026-10-31T00:00:00+01:00")
        self.assertEqual(query["timeMax"], "2026-11-03T00:00:00+01:00")
        self.assertEqual((query["singleEvents"], query["orderBy"], query["timeZone"]),
                         ("true", "startTime", "Europe/Prague"))
        self.assertEqual(primary[1][2]["pageToken"], "p2")

    def test_delete_only_in_mozek(self):
        self.save_token()
        FakeCalendar.calendars[MOZEK] = [timed("m1", "Oslava u Petra", "2026-10-31T18:00:00+01:00",
                                               "2026-10-31T21:00:00+01:00")]
        code, out, _ = self.run_cmd("smaz", "m1")
        self.assertEqual(code, 0)
        self.assertIn("Smazáno: Oslava u Petra (sobota 31. 10., 18:00–21:00)", out)
        deletes = [c for c in self.writes() if c[0] == "DELETE"]
        self.assertEqual(deletes[0][1], "/calendar/v3/calendars/mozek1%40group.calendar.google.com/events/m1")
        self.assertEqual(deletes[0][2], {"sendUpdates": "none"})
        code, out, _ = self.run_cmd("smaz", "m1")
        self.assertIn("už je smazaná", out)
        code, _, err = self.run_cmd("smaz", "p1")  # událost z hlavního kalendáře
        self.assertEqual(code, 1)
        self.assertIn("Jiné kalendáře měnit nesmím", err)
        self.assertEqual(len([c for c in self.writes() if c[0] == "DELETE"]), 1)
        self.save_token(mozek=None)
        code, _, err = self.run_cmd("smaz", "m1")
        self.assertIn("Kalendář Mozek zatím neexistuje", err)

    def test_login_asks_only_calendar_and_keeps_mozek(self):
        self.save_token()

        def browser(url):
            query = dict(urllib.parse.parse_qsl(urllib.parse.urlparse(url).query))
            self.assertEqual(query["scope"].split(), kalendar.SCOPES)
            target = f"{query['redirect_uri']}/?code=abc&state={query['state']}"
            threading.Thread(target=lambda: urllib.request.urlopen(target, timeout=10).read(), daemon=True).start()

        with redirect_stdout(io.StringIO()):
            kalendar.login(opener=browser, timeout=10)
        saved = json.loads(kalendar.token_file().read_text(encoding="utf-8"))
        self.assertEqual(saved["refresh_token"], "r-novy")
        self.assertEqual(saved["kalendar_mozek"], MOZEK)  # nové přihlášení nezaloží druhý kalendář
        self.assertEqual(kalendar.token_file().name, "google-calendar-token.json")

    def test_errors_are_explained(self):
        self.save_token()
        FakeCalendar.api_status = 403
        code, _, err = self.run_cmd("udalosti")
        self.assertEqual(code, 1)
        self.assertIn("Google Calendar API", err)
        self.assertIn("agent-kalendar prihlasit", err)
        code, _, err = self.run_cmd("udalosti", "--den", "brzy")
        self.assertEqual(code, 1)
        self.assertIn("Nerozumím dni", err)


if __name__ == "__main__":
    unittest.main()
