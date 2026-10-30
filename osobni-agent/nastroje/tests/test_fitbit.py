"""Testy pro fitbit.py s falešným serverem Googlu (žádný skutečný účet ani internet)."""

import http.server
import importlib.util
import io
import json
import os
import stat
import sys
import tempfile
import threading
import unittest
import urllib.parse
import urllib.request
from contextlib import redirect_stderr, redirect_stdout
from datetime import date
from pathlib import Path

HERE = Path(__file__).resolve().parent


def load(name, file):
    spec = importlib.util.spec_from_file_location(name, HERE.parent / file)
    module = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = module  # dataclasses potřebují modul v sys.modules
    spec.loader.exec_module(module)
    return module


fitbit = load("fitbit", "fitbit.py")
zdravi = load("zdravi", "zdravi.py")
TODAY = date(2026, 10, 30)


def civil(d):
    return {"date": {"year": d.year, "month": d.month, "day": d.day}}


def sleep_point(day, start, end, asleep, main=True, nap=False, stages=True):
    point = {"sleep": {
        "type": "STAGES" if stages else "CLASSIC",
        "interval": {"startTime": start, "endTime": end, "startUtcOffset": "3600s", "endUtcOffset": "3600s",
                     "civilEndTime": civil(day)},
        "metadata": {"mainSleep": main, "nap": nap},
        "summary": {"minutesAsleep": str(asleep), "minutesAwake": "39", "minutesToFallAsleep": "12",
                    "minutesInSleepPeriod": str(asleep + 39),
                    "stagesSummary": [{"type": "LIGHT", "minutes": str(asleep - 182)},
                                      {"type": "DEEP", "minutes": "78"}, {"type": "REM", "minutes": "104"},
                                      {"type": "AWAKE", "minutes": "39"}]},
    }}
    return point


class FakeGoogle(http.server.BaseHTTPRequestHandler):
    calls: list = []
    first_api_401 = False
    refresh_fails = False
    api_status = 200
    missing = None

    def log_message(self, *args):
        pass

    def reply(self, status, obj):
        body = json.dumps(obj).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_POST(self):
        length = int(self.headers.get("Content-Length") or 0)
        raw = self.rfile.read(length).decode()
        if self.path == "/token":
            form = dict(urllib.parse.parse_qsl(raw))
            FakeGoogle.calls.append(("token", form))
            if form.get("grant_type") == "authorization_code":
                return self.reply(200, {"access_token": "a1", "refresh_token": "r1", "expires_in": 3600,
                                        "scope": " ".join(fitbit.SCOPES)})
            if FakeGoogle.refresh_fails:
                return self.reply(400, {"error": "invalid_grant"})
            return self.reply(200, {"access_token": "a2", "expires_in": 3600})
        FakeGoogle.calls.append(("POST", self.path, json.loads(raw or "{}"), self.headers.get("Authorization")))
        if not self.api_ok():
            return
        data_type = self.path.split("/dataTypes/")[1].split("/")[0]
        if data_type == "steps":
            return self.reply(200, {"rollupDataPoints": [
                {"civilStartTime": civil(date(2026, 10, 29)), "steps": {"countSum": "8432"}},
                {"civilStartTime": civil(date(2026, 10, 30)), "steps": {"countSum": "1200"}}]})
        if data_type == "active-zone-minutes":
            return self.reply(200, {"rollupDataPoints": [
                {"civilStartTime": civil(date(2026, 10, 29)),
                 "activeZoneMinutes": {"sumInFatBurnHeartZone": "20", "sumInCardioHeartZone": "10",
                                       "sumInPeakHeartZone": "4"}}]})
        return self.reply(404, {"error": "unknown"})

    def api_ok(self):
        if FakeGoogle.first_api_401:
            FakeGoogle.first_api_401 = False
            self.reply(401, {"error": "expired"})
            return False
        if FakeGoogle.api_status != 200:
            self.reply(FakeGoogle.api_status, {"error": "forbidden"})
            return False
        return True

    def do_GET(self):
        url = urllib.parse.urlparse(self.path)
        query = dict(urllib.parse.parse_qsl(url.query))
        FakeGoogle.calls.append(("GET", url.path, query, self.headers.get("Authorization")))
        if not self.api_ok():
            return
        data_type = url.path.split("/dataTypes/")[1].split("/")[0]
        if data_type == FakeGoogle.missing:
            return self.reply(404, {"error": "not found"})
        d29, d30 = date(2026, 10, 29), date(2026, 10, 30)
        if data_type == "sleep":
            if query.get("pageToken") != "p2":
                return self.reply(200, {"dataPoints": [
                    sleep_point(d30, "2026-10-29T22:41:00Z", "2026-10-30T06:02:00Z", 402)], "nextPageToken": "p2"})
            return self.reply(200, {"dataPoints": [
                sleep_point(d29, "2026-10-29T12:00:00Z", "2026-10-29T12:40:00Z", 40, main=False, nap=True,
                            stages=False),
                sleep_point(d29, "2026-10-28T22:10:00Z", "2026-10-29T05:40:00Z", 395)]})
        values = {
            "daily-heart-rate-variability": ("dailyHeartRateVariability", "averageHeartRateVariabilityMilliseconds", 48.2),
            "daily-resting-heart-rate": ("dailyRestingHeartRate", "beatsPerMinute", "54"),
            "daily-oxygen-saturation": ("dailyOxygenSaturation", "averagePercentage", 96.1),
            "daily-respiratory-rate": ("dailyRespiratoryRate", "breathsPerMinute", 14.1),
        }
        if data_type in values:
            field, key, value = values[data_type]
            return self.reply(200, {"dataPoints": [{field: {"date": civil(d30)["date"], key: value}}]})
        if data_type == "daily-sleep-temperature-derivations":
            return self.reply(200, {"dataPoints": [{"dailySleepTemperatureDerivations": {
                "date": civil(d30)["date"], "nightlyTemperatureCelsius": 33.9, "baselineTemperatureCelsius": 33.7}}]})
        return self.reply(404, {"error": "unknown"})


class FitbitTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), FakeGoogle)
        threading.Thread(target=cls.server.serve_forever, daemon=True).start()
        base = f"http://127.0.0.1:{cls.server.server_port}"
        fitbit.TOKEN_URL = base + "/token"
        fitbit.API_URL = base + "/v4/"
        fitbit.AUTH_URL = base + "/auth"

    @classmethod
    def tearDownClass(cls):
        cls.server.shutdown()
        cls.server.server_close()

    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.root = Path(self.tmp.name)
        fitbit.CONFIG_DIR = self.root / "config"
        fitbit.CONFIG_DIR.mkdir()
        (fitbit.CONFIG_DIR / "google-health-client.json").write_text(
            json.dumps({"installed": {"client_id": "cid", "client_secret": "sec"}}), encoding="utf-8")
        FakeGoogle.calls = []
        FakeGoogle.first_api_401 = False
        FakeGoogle.refresh_fails = False
        FakeGoogle.api_status = 200

    def tearDown(self):
        self.tmp.cleanup()

    def save_token(self, expires_at=0):
        fitbit.write_private(fitbit.token_file(), {"refresh_token": "r1", "access_token": "old",
                                                   "expires_at": expires_at})

    def test_login_with_browser_callback(self):
        def browser(url):
            query = dict(urllib.parse.parse_qsl(urllib.parse.urlparse(url).query))
            self.assertEqual(query["code_challenge_method"], "S256")
            self.assertEqual(query["access_type"], "offline")
            self.assertEqual(query["scope"].split(), fitbit.SCOPES)
            target = f"{query['redirect_uri']}/?code=abc&state={query['state']}"
            threading.Thread(target=lambda: urllib.request.urlopen(target, timeout=10).read(), daemon=True).start()

        with redirect_stdout(io.StringIO()):
            saved = fitbit.login(opener=browser, timeout=10)
        self.assertEqual(saved["refresh_token"], "r1")
        mode = stat.S_IMODE(os.stat(fitbit.token_file()).st_mode)
        self.assertEqual(mode, 0o600)
        exchange = next(c[1] for c in FakeGoogle.calls if c[0] == "token")
        self.assertEqual(exchange["code"], "abc")
        self.assertTrue(exchange["code_verifier"])

    def test_login_rejects_wrong_state(self):
        def browser(url):
            query = dict(urllib.parse.parse_qsl(urllib.parse.urlparse(url).query))
            target = f"{query['redirect_uri']}/?code=abc&state=jiny"
            threading.Thread(target=lambda: urllib.request.urlopen(target, timeout=10).read(), daemon=True).start()

        with redirect_stdout(io.StringIO()), self.assertRaises(fitbit.FitbitError):
            fitbit.login(opener=browser, timeout=10)

    def test_download_maps_all_values(self):
        self.save_token()
        FakeGoogle.first_api_401 = True  # první dotaz vrátí 401, skript si obnoví přihlášení
        days = fitbit.fetch(fitbit.Session(), date(2026, 10, 28), TODAY)
        d29, d30 = date(2026, 10, 29), TODAY
        self.assertEqual(days[d30]["spanek"], {
            "zacatek": "2026-10-29T23:41+01:00", "konec": "2026-10-30T07:02+01:00", "v_posteli_min": 441,
            "spanek_min": 402, "bdeni_min": 39, "latence_min": 12, "lehky_min": 220, "hluboky_min": 78,
            "rem_min": 104})
        self.assertEqual(days[d29]["spanek"]["spanek_min"], 395)  # hlavní spánek, ne šlofík
        self.assertEqual(days[d30]["hrv_rmssd_ms"], 48.2)
        self.assertEqual(days[d30]["tep_klidovy"], 54)
        self.assertEqual(days[d30]["spo2_prumer_pct"], 96.1)
        self.assertEqual(days[d30]["dech_za_min"], 14.1)
        self.assertEqual(days[d30]["teplota_odchylka_c"], 0.2)
        self.assertEqual(days[d29]["kroky"], 8432)
        self.assertEqual(days[d29]["aktivni_min"], 34)
        filters = {c[1].split("/dataTypes/")[1].split("/")[0]: c[2].get("filter") for c in FakeGoogle.calls
                   if c[0] == "GET"}
        self.assertEqual(filters["daily-resting-heart-rate"],
                         'daily_resting_heart_rate.date >= "2026-10-28" AND daily_resting_heart_rate.date < "2026-10-31"')
        self.assertEqual(filters["sleep"],
                         'sleep.interval.civil_end_time >= "2026-10-28" AND sleep.interval.civil_end_time < "2026-10-31"')
        auths = {c[-1] for c in FakeGoogle.calls if c[0] in ("GET", "POST")}
        self.assertIn("Bearer a2", auths)

    def test_saved_files_pass_health_checks(self):
        self.save_token()
        written = fitbit.save_days(fitbit.fetch(fitbit.Session(), date(2026, 10, 28), TODAY), self.root)
        self.assertEqual(len(written), 2)
        raw = json.loads((self.root / "zdravi/data/2026-10-30.json").read_text(encoding="utf-8"))
        day = zdravi.parse_day(raw, TODAY)
        self.assertEqual(day.notes, [])
        self.assertTrue(day.night_ok)
        self.assertEqual(zdravi.clock_text(day.values["zacatek"]), "23:41")
        self.assertAlmostEqual(day.values["efektivita_pct"], 402 / 441 * 100)

    def test_merge_keeps_values_that_did_not_arrive(self):
        folder = self.root / "zdravi/data"
        folder.mkdir(parents=True)
        (folder / "2026-10-30.json").write_text(json.dumps({"datum": "2026-10-30", "kroky": 5000,
                                                            "spanek": {"spanek_min": 400, "latence_min": 9}}))
        fitbit.save_days({TODAY: {"tep_klidovy": 55, "spanek": {"spanek_min": 410}}}, self.root)
        merged = json.loads((folder / "2026-10-30.json").read_text(encoding="utf-8"))
        self.assertEqual(merged["kroky"], 5000)
        self.assertEqual(merged["tep_klidovy"], 55)
        self.assertEqual(merged["spanek"], {"spanek_min": 410, "latence_min": 9})
        self.assertEqual(merged["zdroj"], "google-health")

    def test_one_missing_data_type_does_not_stop_the_rest(self):
        self.save_token(expires_at=10**12)
        FakeGoogle.missing = "daily-sleep-temperature-derivations"
        problems = []
        try:
            days = fitbit.fetch(fitbit.Session(), date(2026, 10, 28), TODAY, problems)
        finally:
            FakeGoogle.missing = None
        self.assertNotIn("teplota_odchylka_c", days[TODAY])
        self.assertEqual(days[TODAY]["tep_klidovy"], 54)
        self.assertEqual(len(problems), 1)
        self.assertTrue(problems[0].startswith("daily-sleep-temperature-derivations: HTTP 404"))

    def test_expired_login_explains_what_to_do(self):
        self.save_token()
        FakeGoogle.refresh_fails = True
        with self.assertRaisesRegex(fitbit.FitbitError, "agent-fitbit prihlasit"):
            fitbit.fetch(fitbit.Session(), TODAY, TODAY)

    def test_forbidden_explains_api_setup(self):
        self.save_token(expires_at=10**12)
        FakeGoogle.api_status = 403
        with self.assertRaisesRegex(fitbit.FitbitError, "Google Health API"):
            fitbit.fetch(fitbit.Session(), TODAY, TODAY)

    def test_missing_login_and_client(self):
        with self.assertRaisesRegex(fitbit.FitbitError, "prihlasit"):
            fitbit.Session()
        (fitbit.CONFIG_DIR / "google-health-client.json").unlink()
        err = io.StringIO()
        with redirect_stderr(err):
            self.assertEqual(fitbit.main(["stahni"]), 1)
        self.assertIn("google-health-client.json", err.getvalue())

    def test_default_days_cover_sync_gap(self):
        self.assertEqual(fitbit.default_days(self.root, TODAY), 30)
        folder = self.root / "zdravi/data"
        folder.mkdir(parents=True)
        (folder / "2026-10-12.json").write_text("{}")
        self.assertEqual(fitbit.default_days(self.root, TODAY), 20)
        (folder / "2026-10-30.json").write_text("{}")
        self.assertEqual(fitbit.default_days(self.root, TODAY), 3)
        (folder / "2026-01-01.json").unlink(missing_ok=True)
        (folder / "2026-10-30.json").unlink()
        (folder / "2026-10-12.json").unlink()
        (folder / "2025-01-01.json").write_text("{}")
        self.assertEqual(fitbit.default_days(self.root, TODAY), 30)

    def test_czech_counts(self):
        self.assertEqual(fitbit.count(1, "den", "dny", "dní"), "1 den")
        self.assertEqual(fitbit.count(2, "den", "dny", "dní"), "2 dny")
        self.assertEqual(fitbit.count(0, "noc", "noci", "nocí"), "0 nocí")
        self.assertEqual(fitbit.count(35, "den", "dny", "dní"), "35 dní")

    def test_shape_has_no_values(self):
        text = fitbit.shape({"dataPoints": [{"dailyRestingHeartRate": {"beatsPerMinute": "54"}}],
                             "nextPageToken": "x"})
        self.assertNotIn("54", text)
        self.assertIn("beatsPerMinute: str", text)

    def test_timer_units(self):
        calls = []
        with redirect_stdout(io.StringIO()):
            fitbit.cmd_timer(self.root / "units", run=lambda cmd, check: calls.append(cmd))
        service = (self.root / "units/agent-fitbit.service").read_text(encoding="utf-8")
        timer = (self.root / "units/agent-fitbit.timer").read_text(encoding="utf-8")
        self.assertIn("ExecStart=%h/.local/bin/agent-fitbit stahni", service)
        self.assertIn("ExecStartPost=-%h/.local/bin/agent-zdravi den", service)
        self.assertIn("OnCalendar=*-*-* 05..23:15:00", timer)
        self.assertEqual(calls[-1], ["systemctl", "--user", "enable", "--now", "agent-fitbit.timer"])


if __name__ == "__main__":
    unittest.main()
