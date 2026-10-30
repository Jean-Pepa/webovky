"""Testy pro zdravi.py na vymyšlených datech (žádný náramek ani internet)."""

import importlib.util
import io
import json
import math
import random
import sys
import tempfile
import unittest
from contextlib import redirect_stderr, redirect_stdout
from datetime import date, datetime, time, timedelta
from pathlib import Path

HERE = Path(__file__).resolve().parent


def load_module():
    spec = importlib.util.spec_from_file_location("zdravi", HERE.parent / "zdravi.py")
    module = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = module  # dataclasses potřebují modul v sys.modules
    spec.loader.exec_module(module)
    return module


zdravi = load_module()
END = date(2026, 11, 15)


def make_day(datum, rng, deep_adj=0.0, hrv_mult=1.0, rhr_adj=0.0, tst_adj=0.0):
    tst = round(rng.gauss(420, 25) + tst_adj)
    deep = max(20, round(rng.gauss(80, 10) + deep_adj))
    rem = max(20, round(rng.gauss(95, 12)))
    awake = max(5, round(rng.gauss(40, 10)))
    tib = tst + awake + 10
    start = datetime.combine(datum - timedelta(days=1), time(23, 15)) + timedelta(minutes=rng.gauss(0, 20))
    end = start + timedelta(minutes=tib)
    return {
        "datum": datum.isoformat(),
        "spanek": {
            "zacatek": start.strftime("%Y-%m-%dT%H:%M:00+01:00"),
            "konec": end.strftime("%Y-%m-%dT%H:%M:00+01:00"),
            "v_posteli_min": tib, "spanek_min": tst, "lehky_min": tst - deep - rem,
            "hluboky_min": deep, "rem_min": rem, "bdeni_min": awake,
            "latence_min": max(1, round(rng.gauss(12, 4))),
        },
        "tep_klidovy": round(rng.gauss(55, 1.5) + rhr_adj, 1),
        "hrv_rmssd_ms": round(50 * math.exp(rng.gauss(0, 0.12)) * hrv_mult, 1),
        "dech_za_min": round(rng.gauss(14, 0.4), 1),
        "spo2_prumer_pct": round(rng.gauss(96, 0.7), 1),
        "teplota_odchylka_c": round(rng.gauss(0, 0.15), 2),
        "kroky": max(0, round(rng.gauss(8000, 2000))),
        "aktivni_min": max(0, round(rng.gauss(30, 12))),
        "noseni_h": 22.5,
    }


def write_day(root, record):
    folder = root / "zdravi" / "data"
    folder.mkdir(parents=True, exist_ok=True)
    (folder / f"{record['datum']}.json").write_text(json.dumps(record), encoding="utf-8")


def write_diary(root, datum, tags):
    folder = root / "memory"
    folder.mkdir(parents=True, exist_ok=True)
    (folder / f"{datum.isoformat()}.md").write_text(
        f"# {datum}\n\n## Večerní deník\n- běžný den\n\nŠtítky: {tags}\n", encoding="utf-8")


def build(root, days=70, seed=42, effect=True):
    """Alkohol večer zkrátí hluboký spánek o 20 min, sníží HRV o 15 % a zvedne tep o 2,5.
    Káva po 14:00 nemá žádný účinek, je to kontrola, že skript nevidí souvislosti v náhodě."""
    rng = random.Random(seed)
    alcohol = {}
    for i in range(days, 0, -1):
        x = END - timedelta(days=i)
        alcohol[x] = rng.random() < 0.3
        coffee = "ano" if rng.random() < 0.4 else "ne"
        sport = "ano" if rng.random() < 0.5 else "ne"
        write_diary(root, x, f"sport={sport}, alkohol={2 if alcohol[x] else 0}, kava-po-14={coffee}, "
                             f"stres={rng.choice([1, 2, 3, 4, 5])}")
    for i in range(days - 1, -1, -1):
        d = END - timedelta(days=i)
        hit = effect and alcohol.get(d - timedelta(days=1), False)
        write_day(root, make_day(d, rng, deep_adj=-20 if hit else 0, hrv_mult=0.85 if hit else 1.0,
                                 rhr_adj=2.5 if hit else 0))
    return alcohol


class FormatTests(unittest.TestCase):
    def test_czech_numbers_and_times(self):
        self.assertEqual(zdravi.cz(8432), "8 432")
        self.assertEqual(zdravi.cz(1234.5, 1), "1 234,5")
        self.assertEqual(zdravi.cz(-3), "−3")
        self.assertEqual(zdravi.duration(402), "6 h 42 min")
        self.assertEqual(zdravi.duration(45), "45 min")
        self.assertEqual(zdravi.duration(-30), "−30 min")
        self.assertEqual(zdravi.clock_text(zdravi.from_noon(datetime(2026, 11, 2, 0, 30))), "0:30")
        self.assertEqual(zdravi.clock_text(zdravi.from_noon(datetime(2026, 11, 1, 23, 41))), "23:41")


class TagTests(unittest.TestCase):
    def test_parse_tags_formats(self):
        text = ("## Večerní deník\n- **Štítky:** Sport, alkohol=2, Káva po 14 = ne, stres: 4, cesta=?\n"
                "stitky: jidlo-po-21\n")
        tags = zdravi.parse_tags(text)
        self.assertEqual(tags, {"sport": "", "alkohol": "2", "kava-po-14": "ne", "stres": "4",
                                "cesta": "?", "jidlo-po-21": ""})
        self.assertIsNone(zdravi.parse_tags("## Večerní deník\nbez štítků\n"))

    def test_factor_values(self):
        fv = zdravi.factor_value
        self.assertIs(fv("sport", ""), True)
        self.assertIs(fv("sport", "ne"), False)
        self.assertIs(fv("alkohol", "0"), False)
        self.assertIs(fv("alkohol", "1,5"), True)
        self.assertIs(fv("stres", "4"), True)
        self.assertIs(fv("stres", "2"), False)
        self.assertIsNone(fv("stres", "3"))
        self.assertIsNone(fv("sport", "?"))

    def test_missing_key_factor_is_unknown_but_free_tag_is_no(self):
        tags = {"sport": ""}
        self.assertIsNone(zdravi._factor(tags, "alkohol"))
        self.assertIs(zdravi._factor(tags, "cesta"), False)


class ParseDayTests(unittest.TestCase):
    def test_bad_values_are_dropped_with_reason(self):
        day = zdravi.parse_day({"spanek": {"spanek_min": 2000}, "tep_klidovy": "55", "kroky": -5},
                               date(2026, 11, 2))
        self.assertIsNone(day.values["spanek_min"])
        self.assertIsNone(day.values["tep_klidovy"])
        self.assertIsNone(day.values["kroky"])
        text = " ".join(day.notes)
        self.assertIn("mimo věrohodný rozsah", text)
        self.assertIn("není číslo", text)

    def test_short_night_and_wrong_stages(self):
        day = zdravi.parse_day({"spanek": {"spanek_min": 120, "lehky_min": 10, "hluboky_min": 10,
                                           "rem_min": 10}}, date(2026, 11, 2))
        self.assertFalse(day.night_ok)
        self.assertIsNone(day.values["hluboky_min"])
        self.assertTrue(any("do normálu se nepočítá" in n for n in day.notes))
        self.assertTrue(any("fáze spánku nesedí" in n for n in day.notes))

    def test_midpoint_efficiency_and_hrv(self):
        day = zdravi.parse_day({"spanek": {"zacatek": "2026-11-01T23:00:00+01:00",
                                           "konec": "2026-11-02T07:00:00+01:00",
                                           "spanek_min": 400, "v_posteli_min": 450},
                                "hrv_rmssd_ms": 50}, date(2026, 11, 2))
        self.assertEqual(zdravi.clock_text(day.values["stred"]), "3:00")
        self.assertAlmostEqual(day.values["efektivita_pct"], 400 / 450 * 100)
        self.assertAlmostEqual(day.values["ln_hrv"], math.log(50))


class NormalTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.root = Path(self.tmp.name)

    def tearDown(self):
        self.tmp.cleanup()

    def test_needs_14_days(self):
        rng = random.Random(1)
        for i in range(1, 11):
            write_day(self.root, make_day(END - timedelta(days=i), rng))
        data = zdravi.Data(self.root)
        normal = data.normal("tep_klidovy", END)
        self.assertFalse(normal.ready)
        self.assertEqual(normal.n, 10)
        self.assertIn("nevím, normál se teprve učí (10/14 dní)", zdravi.assess("tep_klidovy", None, normal))

    def test_median_mad_and_floor(self):
        for i, rhr in enumerate([50, 52, 54, 56, 58] * 4, start=1):
            write_day(self.root, {"datum": (END - timedelta(days=i)).isoformat(), "tep_klidovy": rhr})
        write_day(self.root, {"datum": END.isoformat(), "tep_klidovy": 60})
        data = zdravi.Data(self.root)
        normal = data.normal("tep_klidovy", END)
        self.assertEqual(normal.center, 54)
        self.assertAlmostEqual(normal.spread, 1.4826 * 2)
        self.assertAlmostEqual(data.z(END, "tep_klidovy"), 6 / (1.4826 * 2))
        self.assertEqual(data.normal("kroky", END).n, 0)

    def test_illness_days_are_left_out(self):
        rng = random.Random(2)
        for i in range(0, 30):
            write_day(self.root, make_day(END - timedelta(days=i), rng))
        sick = END - timedelta(days=5)
        write_diary(self.root, sick, "nemoc")
        data = zdravi.Data(self.root)
        self.assertIsNone(data.clean(sick, "tep_klidovy"))
        self.assertIsNone(data.clean(sick + timedelta(days=1), "tep_klidovy"))
        self.assertIsNotNone(data.clean(sick + timedelta(days=2), "tep_klidovy"))


class RecoveryAndWarningTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.root = Path(self.tmp.name)
        rng = random.Random(3)
        for i in range(1, 30):
            write_day(self.root, make_day(END - timedelta(days=i), rng))
        self.rng = rng

    def tearDown(self):
        self.tmp.cleanup()

    def test_good_day(self):
        record = make_day(END, self.rng)
        record.update(tep_klidovy=55, hrv_rmssd_ms=50)
        record["spanek"]["spanek_min"] = 430
        write_day(self.root, record)
        status, reasons = zdravi.recovery(zdravi.Data(self.root), END)
        self.assertEqual((status, reasons), ("dobré", []))

    def test_low_day_and_strain_warning(self):
        for d, rhr in ((END - timedelta(days=1), 62), (END, 63)):
            record = make_day(d, self.rng)
            record.update(tep_klidovy=rhr, hrv_rmssd_ms=30)
            write_day(self.root, record)
        data = zdravi.Data(self.root)
        status, reasons = zdravi.recovery(data, END)
        self.assertEqual(status, "nízké")
        self.assertIn("HRV nižší než obvykle", reasons)
        self.assertTrue(any(w.startswith("Možná zátěž") for w in zdravi.warnings(data, END)))

    def test_doctor_flags(self):
        for i in range(3):
            record = make_day(END - timedelta(days=i), self.rng)
            record.update(tep_klidovy=105, spo2_prumer_pct=88.5)
            write_day(self.root, record)
        alerts = " ".join(zdravi.warnings(zdravi.Data(self.root), END))
        self.assertIn("Klidový tep nad 100 tepů/min (dní: 3 ze 7)", alerts)
        self.assertIn("SpO2 v noci pod 90 % (nocí: 3 ze 7)", alerts)


class AssociationTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.tmp = tempfile.TemporaryDirectory()
        cls.root = Path(cls.tmp.name)
        build(cls.root)
        cls.found, cls.too_few, cls.notes = zdravi.associations(zdravi.Data(cls.root), END)

    @classmethod
    def tearDownClass(cls):
        cls.tmp.cleanup()

    def test_finds_alcohol_effect(self):
        alcohol = {t.metric: t for t in self.found if t.factor == "alkohol"}
        self.assertTrue(alcohol["hluboky_min"].significant)
        self.assertLess(alcohol["hluboky_min"].diff, -12)
        lo, hi = alcohol["hluboky_min"].ci
        self.assertLess(lo, hi)
        self.assertLess(hi, 0)
        self.assertTrue(alcohol["ln_hrv"].significant)
        self.assertTrue(alcohol["tep_klidovy"].significant)

    def test_coffee_noise_is_not_reported_as_proven(self):
        self.assertFalse(any(t.factor == "kava-po-14" and t.significant for t in self.found))

    def test_results_are_repeatable(self):
        again, _, _ = zdravi.associations(zdravi.Data(self.root), END)
        self.assertEqual([(t.factor, t.metric, t.p) for t in again],
                         [(t.factor, t.metric, t.p) for t in self.found])

    def test_benjamini_hochberg(self):
        self.assertEqual(zdravi.benjamini_hochberg([0.001, 0.02, 0.04, 0.5], 0.10),
                         [True, True, True, False])
        self.assertEqual(zdravi.benjamini_hochberg([0.2, 0.3], 0.10), [False, False])


class CommandTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.root = Path(self.tmp.name)

    def tearDown(self):
        self.tmp.cleanup()

    def run_cli(self, *args):
        out, err = io.StringIO(), io.StringIO()
        with redirect_stdout(out), redirect_stderr(err):
            code = zdravi.main(["--mozek", str(self.root), *args])
        return code, out.getvalue(), err.getvalue()

    def test_night_lookup_is_short_and_targeted(self):
        build(self.root)
        code, out, _ = self.run_cli("noc", "--den", "2026-11-08")
        self.assertEqual(code, 0)
        lines = out.splitlines()
        self.assertEqual(lines[0], "Noc 7. → 8. 11. 2026 (probuzení neděle)")
        self.assertRegex(lines[1], r"^Spánek \d+ h \d\d min \(normál \d+ h \d\d min\): ")
        self.assertRegex(lines[2], r"^Začátek spánku \d+:\d\d, konec spánku \d+:\d\d, efektivita spánku \d+ %$")
        self.assertTrue(any(l.startswith("HRV (RMSSD) ") for l in lines))
        self.assertEqual(lines[-1], "Zdroj: zdravi/data/2026-11-08.json")
        self.assertLess(len(out), 600)  # krátké, ať agent šetří tokeny
        self.assertFalse((self.root / "zdravi" / "2026-11-08.md").exists())  # nic neukládá
        code, _, err = self.run_cli("noc", "--den", "2025-01-01")
        self.assertEqual(code, 1)
        self.assertIn("nemám data z náramku", err)

    def test_past_days_in_czech(self):
        today = date(2026, 10, 30)  # pátek
        cases = {
            "dnes": "2026-10-30", "v noci": "2026-10-30", "dnes v noci": "2026-10-30", "včera": "2026-10-29",
            "předevčírem": "2026-10-28", "před týdnem": "2026-10-23", "před 3 dny": "2026-10-27",
            "před třemi dny": "2026-10-27", "před dvěma týdny": "2026-10-16", "v noci na sobotu": "2026-10-24",
            "minulý pátek": "2026-10-23", "ve středu": "2026-10-28", "v pondělí": "2026-10-26",
            "23.10.": "2026-10-23", "31. 12.": "2025-12-31", "2026-10-01": "2026-10-01",
        }
        for text, expected in cases.items():
            with self.subTest(text=text):
                self.assertEqual(zdravi.past_day(text, today).isoformat(), expected)
        for bad in ("brzy", "31.2.", "před pár dny"):
            with self.subTest(bad=bad), self.assertRaises(zdravi.HealthError):
                zdravi.past_day(bad, today)

    def test_day_report(self):
        build(self.root)
        code, out, _ = self.run_cli("den", "--datum", END.isoformat())
        self.assertEqual(code, 0)
        report = (self.root / "zdravi" / f"{END.isoformat()}.md").read_text(encoding="utf-8")
        self.assertIn("**Stav zotavení:", report)
        self.assertIn("## Noc 14. → 15. 11.", report)
        self.assertIn("Spánkový dluh", report)
        self.assertIn("Uloženo:", out)

    def test_week_report(self):
        build(self.root)
        code, _, _ = self.run_cli("tyden", "--do", END.isoformat())
        self.assertEqual(code, 0)
        report = (self.root / "zdravi" / "tyden-2026-W46.md").read_text(encoding="utf-8")
        self.assertIn("WHO doporučuje 150–300 minut", report)
        self.assertIn("**alkohol**", report)
        self.assertIn("## Zdroje", report)

    def test_no_data(self):
        code, _, err = self.run_cli("den", "--datum", END.isoformat())
        self.assertEqual(code, 1)
        self.assertIn("nemám data z náramku", err)

    def test_check(self):
        code, out, _ = self.run_cli("kontrola")
        self.assertEqual(code, 0)
        self.assertIn("zatím nejsou žádná data", out)

    def test_experiment(self):
        rng = random.Random(7)
        start = END - timedelta(days=13)
        for i in range(29):
            d = END - timedelta(days=28) + timedelta(days=i)
            write_day(self.root, make_day(d, rng, tst_adj=40 if d > start else 0))
        code, _, _ = self.run_cli("pokus", "--nazev", "Spát dřív", "--od", start.isoformat(),
                                  "--do", (END - timedelta(days=1)).isoformat(), "--hlavni", "spanek_min")
        self.assertEqual(code, 0)
        report = (self.root / "zdravi" / "pokusy" / "spat-driv.md").read_text(encoding="utf-8")
        row = next(line for line in report.splitlines() if line.startswith("| Spánek (hlavní ukazatel)"))
        self.assertIn("průkazný rozdíl", row)
        self.assertIn("delší", row)


if __name__ == "__main__":
    unittest.main()
