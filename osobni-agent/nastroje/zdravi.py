#!/usr/bin/env python3
"""Vyhodnocení dat z náramku (Fitbit Air přes Google Health) pro osobního agenta.

Všechna čísla počítá tento skript, ne jazykový model. Agent výsledky jen čte a vysvětluje.
Běží jen v notebooku a nic neodesílá. Pravidla a zdroje jsou v skills/zdravi/METODIKA.md.

Vstupy v Mozku (~/Mozek, jinou složku nastavíš proměnnou AGENT_MOZEK):
    zdravi/data/RRRR-MM-DD.json   jeden den z náramku (zapisuje je stahování dat)
    memory/RRRR-MM-DD.md          večerní deník s řádkem „Štítky: …“
    zdravi/nastaveni.md           volitelné, např. řádek „cil_spanku_h: 7.5“

Příkazy:
    agent-zdravi den [--datum RRRR-MM-DD]     ranní souhrn: noc, zotavení, včerejší aktivita
                                              → zdravi/RRRR-MM-DD.md
    agent-zdravi noc [--den DEN]              jedna noc krátce, na rychlou otázku; DEN je dnes,
                                              vcera, pred tydnem, pred 3 dny, v noci na sobotu,
                                              23.10. nebo RRRR-MM-DD (noc podle dne probuzení)
    agent-zdravi noci [--dni N] [--do D]      posledních N nocí (výchozí 14) po řádcích
                                              a nejdelší, nejkratší a průměr
    agent-zdravi data [--dni N] [--do D] [--ulozit]
                                              všechny dny v jedné tabulce a souhrn: u každého
                                              ukazatele nejvíc, nejméně a průměry (celkem,
                                              posledních 7 dní, předchozích 7 dní);
                                              s --ulozit → zdravi/prehled.md (spouští ho
                                              stahování dat po každém stažení)
    agent-zdravi tyden [--do RRRR-MM-DD]      týdenní rozbor a souvislosti s deníkem
                                              → zdravi/tyden-RRRR-Www.md
    agent-zdravi pokus --nazev TEXT --od D --do D [--srovnani-od D --srovnani-do D]
                       [--hlavni UKAZATEL]    vyhodnocení pokusu → zdravi/pokusy/<nazev>.md
    agent-zdravi kontrola                     kolik je dat, co chybí a co je vyřazené
"""

from __future__ import annotations

import argparse
import json
import math
import os
import random
import re
import statistics
import sys
import unicodedata
from dataclasses import dataclass, field
from datetime import date, datetime, timedelta
from pathlib import Path

VERSION = "1.0"

# Pravidla vyhodnocení. Odůvodnění a zdroje jsou v skills/zdravi/METODIKA.md.
NORMAL_DAYS = 28        # normál = medián tvých posledních 28 dní
NORMAL_MIN = 14         # s méně platnými dny je normál „nevím“
TREND_MIN = 3           # 7denní průměr HRV jen z aspoň 3 měření (Plews 2014)
SWC = 0.5               # pásmo 7denního průměru HRV: normál ± 0,5 rozptylu
ASSOC_DAYS = 90         # souvislosti s deníkem z posledních 90 dní
GROUP_MIN = 5           # aspoň 5 dní se štítkem a 5 bez něj
PERMUTATIONS = 2000
BOOTSTRAP = 2000
FDR_Q = 0.10            # Benjaminiho–Hochbergova oprava na mnoho srovnání najednou
MIN_NIGHT_MIN = 180     # kratší spánek není hlavní noc a do normálu se nepočítá
WEAR_MIN_H = 14         # Google počítá připravenost jen při nošení aspoň 14 h denně
SLEEP_GOAL_H = 7.0      # AASM a SRS 2015: dospělí 7 a více hodin
RHR_DOCTOR = 100        # klidový tep nad 100 tepů/min
SPO2_DOCTOR = 90        # průměrné SpO2 v noci pod 90 %
KEY_FACTORS = ("sport", "alkohol", "kava-po-14", "jidlo-po-21", "prace-po-22", "stres")


@dataclass(frozen=True)
class Metric:
    key: str
    label: str
    kind: str              # "min" délka, "clock" čas, "hrv" ln RMSSD, "num" číslo
    unit: str
    decimals: int
    floor: float           # nejmenší šířka pásma normálu, ať se drobnosti nehlásí jako odchylka
    better: int            # +1 vyšší je lepší, -1 nižší je lepší, 0 bez hodnocení
    relevant: float        # nejmenší rozdíl, který má smysl hlásit u souvislostí a pokusů
    words: tuple[str, str] = ("vyšší", "nižší")
    diff_decimals: int = 1  # desetinná místa u rozdílů


METRICS = {m.key: m for m in [
    Metric("spanek_min", "Spánek", "min", "", 0, 15, +1, 10, ("delší", "kratší")),
    Metric("zacatek", "Začátek spánku", "clock", "", 0, 15, 0, 10, ("později", "dříve")),
    Metric("konec", "Konec spánku", "clock", "", 0, 15, 0, 10, ("později", "dříve")),
    Metric("stred", "Střed spánku", "clock", "", 0, 15, 0, 10, ("později", "dříve")),
    Metric("efektivita_pct", "Efektivita spánku", "num", " %", 0, 2, +1, 1.5),
    Metric("hluboky_min", "Hluboký spánek", "min", "", 0, 8, +1, 5, ("delší", "kratší")),
    Metric("rem_min", "REM spánek", "min", "", 0, 8, +1, 5, ("delší", "kratší")),
    Metric("bdeni_min", "Bdění v noci", "min", "", 0, 8, -1, 5, ("delší", "kratší")),
    Metric("latence_min", "Usínání", "min", "", 0, 5, -1, 3, ("delší", "kratší")),
    Metric("ln_hrv", "HRV (RMSSD)", "hrv", " ms", 0, 0.05, +1, 0.03),
    Metric("tep_klidovy", "Klidový tep", "num", " tepů/min", 0, 1.5, -1, 1),
    Metric("dech", "Dech ve spánku", "num", " /min", 1, 0.3, -1, 0.3),
    Metric("spo2", "SpO2 v noci", "num", " %", 1, 0.5, +1, 0.5),
    Metric("teplota", "Teplota kůže (odchylka)", "num", " °C", 1, 0.15, -1, 0.1),
    Metric("kroky", "Kroky", "num", "", 0, 800, +1, 500, diff_decimals=0),
    Metric("aktivni_min", "Aktivní minuty", "num", " min", 0, 8, +1, 5, diff_decimals=0),
]}
NIGHT = ["spanek_min", "zacatek", "konec", "stred", "efektivita_pct", "hluboky_min",
         "rem_min", "bdeni_min", "latence_min"]
RECOVERY = ["ln_hrv", "tep_klidovy", "dech", "spo2", "teplota"]
ACTIVITY = ["kroky", "aktivni_min"]
OUTCOMES = ["spanek_min", "efektivita_pct", "hluboky_min", "rem_min", "bdeni_min",
            "ln_hrv", "tep_klidovy"]

# Věrohodné rozsahy vstupních polí. Hodnota mimo rozsah je chyba měření a vyřadí se.
RANGES = {
    ("spanek", "v_posteli_min"): (0, 1080),
    ("spanek", "spanek_min"): (0, 960),
    ("spanek", "lehky_min"): (0, 960),
    ("spanek", "hluboky_min"): (0, 480),
    ("spanek", "rem_min"): (0, 480),
    ("spanek", "bdeni_min"): (0, 600),
    ("spanek", "latence_min"): (0, 240),
    ("spanek", "efektivita_pct"): (0, 100),
    ("tep_klidovy",): (25, 150),
    ("hrv_rmssd_ms",): (3, 300),
    ("dech_za_min",): (4, 40),
    ("spo2_prumer_pct",): (60, 100),
    ("teplota_odchylka_c",): (-5, 5),
    ("kroky",): (0, 100000),
    ("aktivni_min",): (0, 1440),
    ("noseni_h",): (0, 24),
}
GOOGLE_SCORES = {"skore_spanku": "skóre spánku", "pripravenost": "připravenost",
                 "kardio_zatez": "kardio zátěž"}


class HealthError(Exception):
    """Chyba, kterou umíme uživateli srozumitelně vysvětlit."""


# ---------- formátování ----------

def cz(x: float, decimals: int = 0) -> str:
    x = round(x, decimals) + 0.0  # bez „−0“
    text = f"{x:,.{decimals}f}".replace(",", " ").replace(".", ",")
    return text.replace("-", "−")


def duration(minutes: float) -> str:
    total = int(round(abs(minutes)))
    hours, mins = divmod(total, 60)
    sign = "−" if minutes < 0 and total else ""
    return f"{sign}{hours} h {mins:02d} min" if hours else f"{sign}{mins} min"


def clock_text(from_noon: float) -> str:
    m = int(round(from_noon + 720)) % 1440
    return f"{m // 60}:{m % 60:02d}"


def show(key: str, value: float | None) -> str:
    if value is None:
        return "–"
    m = METRICS[key]
    if m.kind == "min":
        return duration(value)
    if m.kind == "clock":
        return clock_text(value)
    if m.kind == "hrv":
        return f"{cz(math.exp(value))} ms"
    return cz(value, m.decimals) + m.unit


def effect_text(key: str, diff: float) -> str:
    """Rozdíl slovy, např. „o 18 min kratší“ nebo „o 12 % nižší“."""
    m = METRICS[key]
    if m.kind == "hrv":
        pct = (math.exp(diff) - 1) * 100
        if round(pct) == 0:
            return "beze změny"
        return f"o {cz(abs(pct))} % {m.words[0] if pct > 0 else m.words[1]}"
    word = m.words[0] if diff > 0 else m.words[1]
    if m.kind in ("min", "clock"):
        return f"o {duration(abs(diff))} {word}" if round(diff) else "beze změny"
    decimals = 1 if key == "efektivita_pct" else m.diff_decimals
    if round(diff, decimals) == 0:
        return "beze změny"
    if key == "efektivita_pct":
        return f"o {cz(abs(diff), 1)} p. b. {word}"
    return f"o {cz(abs(diff), decimals)}{m.unit} {word}"


def signed(key: str, diff: float) -> str:
    """Rozdíl se znaménkem v jednotkách ukazatele (pro intervaly)."""
    m = METRICS[key]
    if m.kind == "hrv":
        return f"{'+' if diff >= 0 else '−'}{cz(abs((math.exp(diff) - 1) * 100))} %"
    sign = "+" if diff >= 0 else "−"
    if m.kind in ("min", "clock"):
        return f"{sign}{cz(abs(diff))} min"
    if key == "efektivita_pct":
        return f"{sign}{cz(abs(diff), 1)} p. b."
    return f"{sign}{cz(abs(diff), m.diff_decimals)}{m.unit}"


def p_text(p: float) -> str:
    return "p < 0,001" if p < 0.001 else f"p = {cz(p, 3)}"


def date_cz(d: date) -> str:
    return f"{d.day}. {d.month}. {d.year}"


def slug(text: str) -> str:
    t = unicodedata.normalize("NFKD", text.strip().lower())
    t = "".join(c for c in t if not unicodedata.combining(c))
    t = re.sub(r"[\s_]+", "-", t)
    return re.sub(r"[^a-z0-9.-]", "", t).strip("-.")


def parse_number(text: str) -> float | None:
    try:
        return float(text.replace(",", "."))
    except ValueError:
        return None


def mean(values: list[float]) -> float:
    return sum(values) / len(values)


# ---------- data ----------

@dataclass
class Day:
    datum: date
    values: dict[str, float | None]
    night_ok: bool = False
    wear_h: float | None = None
    google: dict[str, float] = field(default_factory=dict)
    notes: list[str] = field(default_factory=list)

    @property
    def activity_ok(self) -> bool:
        return self.wear_h is None or self.wear_h >= WEAR_MIN_H


def _number(raw: dict, keys: tuple[str, ...], notes: list[str]) -> float | None:
    obj = raw
    for k in keys:
        if not isinstance(obj, dict):
            return None
        obj = obj.get(k)
    if obj is None:
        return None
    name = ".".join(keys)
    if isinstance(obj, bool) or not isinstance(obj, (int, float)) or not math.isfinite(obj):
        notes.append(f"{name}: hodnota {obj!r} není číslo, vyřazeno")
        return None
    lo, hi = RANGES[keys]
    if not lo <= obj <= hi:
        notes.append(f"{name}: {obj} je mimo věrohodný rozsah {lo}–{hi}, vyřazeno jako chyba měření")
        return None
    return float(obj)


def _time(sleep: dict, key: str, notes: list[str]) -> datetime | None:
    text = sleep.get(key)
    if text is None:
        return None
    try:
        return datetime.fromisoformat(str(text))
    except ValueError:
        notes.append(f"spanek.{key}: {text!r} není čas, vyřazeno")
        return None


def from_noon(t: datetime) -> float:
    """Minuty od předchozího poledne, aby čas usnutí kolem půlnoci tvořil souvislou řadu."""
    return (t.hour * 60 + t.minute + t.second / 60 - 720) % 1440


def parse_day(raw: object, datum: date) -> Day:
    notes: list[str] = []
    if not isinstance(raw, dict):
        return Day(datum, {k: None for k in METRICS}, notes=["soubor neobsahuje data dne"])
    sleep = raw.get("spanek") if isinstance(raw.get("spanek"), dict) else {}
    tst = _number(raw, ("spanek", "spanek_min"), notes)
    tib = _number(raw, ("spanek", "v_posteli_min"), notes)
    light = _number(raw, ("spanek", "lehky_min"), notes)
    deep = _number(raw, ("spanek", "hluboky_min"), notes)
    rem = _number(raw, ("spanek", "rem_min"), notes)
    eff = _number(raw, ("spanek", "efektivita_pct"), notes)
    if eff is None and tst is not None and tib:
        eff = min(100.0, tst / tib * 100)
    night_ok = tst is not None and tst >= MIN_NIGHT_MIN
    if tst is not None and not night_ok:
        notes.append(f"spánek jen {duration(tst)}, do normálu se nepočítá")
    stages = [light, deep, rem]
    stages_ok = None not in stages and bool(tst) and abs(sum(stages) - tst) <= 0.1 * tst
    if not stages_ok and any(s is not None for s in stages):
        notes.append("fáze spánku nesedí na délku spánku, vynechávám je")

    start, end = _time(sleep, "zacatek", notes), _time(sleep, "konec", notes)
    mid = None
    if start and end:
        try:
            if end > start:
                mid = start + (end - start) / 2
                if mid.tzinfo and end.tzinfo:
                    mid = mid.astimezone(end.tzinfo)
            else:
                notes.append("konec spánku je dřív než začátek, časy vynechávám")
                start = end = None
        except TypeError:
            notes.append("časy spánku nemají stejný formát, vynechávám je")
            start = end = None

    hrv = _number(raw, ("hrv_rmssd_ms",), notes)
    values = {
        "spanek_min": tst,
        "efektivita_pct": eff,
        "hluboky_min": deep if stages_ok else None,
        "rem_min": rem if stages_ok else None,
        "bdeni_min": _number(raw, ("spanek", "bdeni_min"), notes),
        "latence_min": _number(raw, ("spanek", "latence_min"), notes),
        "zacatek": from_noon(start) if start else None,
        "konec": from_noon(end) if end else None,
        "stred": from_noon(mid) if mid else None,
        "ln_hrv": math.log(hrv) if hrv else None,
        "tep_klidovy": _number(raw, ("tep_klidovy",), notes),
        "dech": _number(raw, ("dech_za_min",), notes),
        "spo2": _number(raw, ("spo2_prumer_pct",), notes),
        "teplota": _number(raw, ("teplota_odchylka_c",), notes),
        "kroky": _number(raw, ("kroky",), notes),
        "aktivni_min": _number(raw, ("aktivni_min",), notes),
    }
    wear = _number(raw, ("noseni_h",), notes)
    if wear is not None and wear < WEAR_MIN_H:
        notes.append(f"náramek nošen jen {cz(wear, 1)} h, aktivita se do normálu nepočítá")
    google = {}
    if isinstance(raw.get("google"), dict):
        for k in GOOGLE_SCORES:
            v = raw["google"].get(k)
            if isinstance(v, (int, float)) and not isinstance(v, bool):
                google[k] = float(v)
    return Day(datum, values, night_ok, wear, google, notes)


TAG_LINE = re.compile(r"^[ \t>*-]*(?:štítky|stitky)\**[ \t]*:\**[ \t]*(.*)$", re.IGNORECASE | re.MULTILINE)
NOT_TAGS = {"zadne", "zadny", "nic"}


def parse_tags(text: str) -> dict[str, str] | None:
    """Řádky „Štítky: sport, alkohol=2, kava-po-14=ne“ z deníku. None = deník štítky nemá."""
    found: dict[str, str] | None = None
    for match in TAG_LINE.finditer(text):
        found = {} if found is None else found
        for item in re.split(r"[,;]", match.group(1)):
            name, *value = re.split(r"\s*[=:]\s*", item.strip().strip("*"), maxsplit=1)
            name = slug(name)
            if name and name not in NOT_TAGS:
                found[name] = (value[0] if value else "").strip().strip("*").strip().lower()
    return found


def factor_value(name: str, raw: str) -> bool | None:
    """Ano/ne pro srovnání. Stres 1–5: 4–5 ano, 1–2 ne, 3 se nepočítá."""
    if raw == "?":
        return None
    number = parse_number(raw)
    if number is not None:
        if name == "stres":
            return True if number >= 4 else False if number <= 2 else None
        return number > 0
    if raw in ("", "ano", "a", "yes"):
        return True
    if raw in ("ne", "n", "no"):
        return False
    return None


def load_settings(path: Path) -> dict[str, float]:
    settings = {"cil_spanku_h": SLEEP_GOAL_H}
    if not path.exists():
        return settings
    for line in path.read_text(encoding="utf-8").splitlines():
        key, sep, value = line.partition(":")
        key = slug(key).replace("-", "_")
        if not sep or key not in ("cil_spanku_h", "cil_spanku"):
            continue
        value = value.strip()
        if re.fullmatch(r"\d{1,2}:\d{2}", value):
            h, m = value.split(":")
            hours = int(h) + int(m) / 60
        else:
            hours = parse_number(value) or 0
        if 4 <= hours <= 12:
            settings["cil_spanku_h"] = hours
    return settings


@dataclass
class Normal:
    center: float | None
    spread: float | None
    n: int

    @property
    def ready(self) -> bool:
        return self.center is not None


class Data:
    def __init__(self, mozek: Path):
        self.mozek = mozek
        self.folder = mozek / "zdravi"
        self.days: dict[date, Day] = {}
        data_dir = self.folder / "data"
        if data_dir.is_dir():
            for path in sorted(data_dir.glob("*.json")):
                try:
                    datum = date.fromisoformat(path.stem)
                except ValueError:
                    continue
                try:
                    raw = json.loads(path.read_text(encoding="utf-8"))
                except (OSError, ValueError) as exc:
                    self.days[datum] = Day(datum, {k: None for k in METRICS},
                                           notes=[f"soubor nejde přečíst: {exc}"])
                    continue
                self.days[datum] = parse_day(raw, datum)
        self.tags: dict[date, dict[str, str]] = {}
        diary = mozek / "memory"
        if diary.is_dir():
            for path in diary.glob("*.md"):
                try:
                    datum = date.fromisoformat(path.stem)
                except ValueError:
                    continue
                tags = parse_tags(path.read_text(encoding="utf-8", errors="replace"))
                if tags is not None:
                    self.tags[datum] = tags
        self.settings = load_settings(self.folder / "nastaveni.md")

    @property
    def goal_min(self) -> float:
        return self.settings["cil_spanku_h"] * 60

    def ill(self, d: date) -> bool:
        tags = self.tags.get(d)
        return bool(tags and "nemoc" in tags and factor_value("nemoc", tags["nemoc"]))

    def value(self, d: date, key: str) -> float | None:
        day = self.days.get(d)
        return day.values.get(key) if day else None

    def clean(self, d: date, key: str) -> float | None:
        """Hodnota, která smí do normálu a do srovnání: bez dnů nemoci, krátkých nocí
        a dnů, kdy náramek nebyl nošen dost dlouho."""
        day = self.days.get(d)
        if day is None or self.ill(d) or self.ill(d - timedelta(days=1)):
            return None
        if key in NIGHT and not day.night_ok:
            return None
        if key in ACTIVITY and not day.activity_ok:
            return None
        return day.values.get(key)

    def normal(self, key: str, before: date) -> Normal:
        """Medián a robustní rozptyl z 28 dní před daným dnem."""
        vals = [v for i in range(1, NORMAL_DAYS + 1)
                if (v := self.clean(before - timedelta(days=i), key)) is not None]
        if len(vals) < NORMAL_MIN:
            return Normal(None, None, len(vals))
        center = statistics.median(vals)
        mad = statistics.median(abs(v - center) for v in vals)
        return Normal(center, max(1.4826 * mad, METRICS[key].floor), len(vals))

    def z(self, d: date, key: str) -> float | None:
        v = self.value(d, key)
        n = self.normal(key, d)
        if v is None or not n.ready:
            return None
        return (v - n.center) / n.spread


def assess(key: str, z: float | None, normal: Normal) -> str:
    if z is None:
        if not normal.ready:
            return f"nevím, normál se teprve učí ({normal.n}/{NORMAL_MIN} dní)"
        return "nevím, chybí hodnota"
    if abs(z) < 1:
        return "v normálu"
    m = METRICS[key]
    level = "mimo normál" if abs(z) < 2 else "výrazně mimo normál"
    text = f"{m.words[0] if z > 0 else m.words[1]} než obvykle, {level}"
    if m.better:
        text += ", příznivě" if (z > 0) == (m.better > 0) else ", nepříznivě"
    return text


def normal_text(key: str, n: Normal) -> str:
    if not n.ready:
        return "–"
    return f"{show(key, n.center)} ({show(key, n.center - n.spread)} až {show(key, n.center + n.spread)})"


def metric_rows(data: Data, d: date, keys: list[str]) -> list[str]:
    rows = []
    for key in keys:
        v = data.value(d, key)
        n = data.normal(key, d)
        if v is None and not n.ready:
            continue
        z = (v - n.center) / n.spread if v is not None and n.ready else None
        rows.append(f"| {METRICS[key].label} | {show(key, v)} | {normal_text(key, n)} | {assess(key, z, n)} |")
    return rows


# ---------- zotavení a upozornění ----------

def recovery(data: Data, d: date) -> tuple[str, list[str]]:
    """Stav zotavení podle pevných pravidel (odhad skriptu, není to skóre Googlu)."""
    hz, rz = data.z(d, "ln_hrv"), data.z(d, "tep_klidovy")
    if hz is None and rz is None:
        return "nevím", ["chybí HRV i klidový tep nebo jejich normál"]
    points, reasons = 0, []
    if hz is not None and hz <= -1:
        points += 2 if hz <= -2 else 1
        reasons.append("HRV nižší než obvykle")
    if rz is not None and rz >= 1:
        points += 2 if rz >= 2 else 1
        reasons.append("klidový tep vyšší než obvykle")
    tst = data.value(d, "spanek_min")
    if tst is not None and tst < data.goal_min - 60:
        points += 2 if tst < data.goal_min - 120 else 1
        reasons.append(f"spánek {duration(data.goal_min - tst)} pod cílem")
    for key, text in (("dech", "dech ve spánku rychlejší než obvykle"),
                      ("teplota", "teplota kůže vyšší než obvykle")):
        z = data.z(d, key)
        if z is not None and z >= 2:
            points += 1
            reasons.append(text)
    status = "dobré" if points == 0 else "snížené" if points <= 2 else "nízké"
    return status, reasons


def warnings(data: Data, d: date) -> list[str]:
    out = []
    strain = [text for key, sign, text in (
        ("tep_klidovy", 1, "klidový tep"), ("ln_hrv", -1, "HRV"),
        ("dech", 1, "dech ve spánku"), ("teplota", 1, "teplota kůže"))
        if (z := data.z(d, key)) is not None and z * sign >= 2]
    rhr_today, rhr_before = data.z(d, "tep_klidovy"), data.z(d - timedelta(days=1), "tep_klidovy")
    two_days = rhr_today is not None and rhr_before is not None and rhr_today >= 2 and rhr_before >= 2
    if len(strain) >= 2 or two_days:
        what = ", ".join(strain) if len(strain) >= 2 else "klidový tep druhý den po sobě"
        out.append(f"Možná zátěž organismu: výrazně mimo tvůj normál je {what}. Tělo může být pod "
                   "zátěží, třeba nemoc, únava, alkohol nebo stres. Není to diagnóza. Když se "
                   "necítíš dobře nebo to trvá, zajdi k lékaři.")
    week = [d - timedelta(days=i) for i in range(7)]
    fast = sum(1 for x in week if (v := data.value(x, "tep_klidovy")) is not None and v > RHR_DOCTOR)
    if fast >= 3:
        out.append(f"Klidový tep nad {RHR_DOCTOR} tepů/min (dní: {fast} ze 7). Doporučuji to "
                   "probrat s lékařem.")
    low = sum(1 for x in week if (v := data.value(x, "spo2")) is not None and v < SPO2_DOCTOR)
    if low >= 2:
        out.append(f"Průměrné SpO2 v noci pod {SPO2_DOCTOR} % (nocí: {low} ze 7). Doporučuji to "
                   "probrat s lékařem.")
    return out


def hrv_trend(data: Data, d: date) -> tuple[str, str]:
    """7denní průměr ln RMSSD proti normálu z 28 dní před tímto týdnem (pásmo ± 0,5 rozptylu)."""
    vals = [v for i in range(7) if (v := data.clean(d - timedelta(days=i), "ln_hrv")) is not None]
    base = data.normal("ln_hrv", d - timedelta(days=6))
    if len(vals) < TREND_MIN:
        return "nevím", f"jen {len(vals)} měření HRV za 7 dní, potřebuju aspoň {TREND_MIN}"
    if not base.ready:
        return "nevím", f"normál HRV se teprve učí ({base.n}/{NORMAL_MIN} dní)"
    avg = mean(vals)
    lo, hi = base.center - SWC * base.spread, base.center + SWC * base.spread
    status = "pod normálem" if avg < lo else "nad normálem" if avg > hi else "v normálu"
    detail = (f"{show('ln_hrv', avg)} z {len(vals)} měření, normál {show('ln_hrv', base.center)}, "
              f"pásmo {show('ln_hrv', lo)} až {show('ln_hrv', hi)}")
    return status, detail


# ---------- souvislosti s deníkem ----------

@dataclass
class Finding:
    factor: str
    metric: str
    yes: list[float]
    no: list[float]
    diff: float
    p: float
    significant: bool = False
    ci: tuple[float, float] | None = None


def permutation_p(a: list[float], b: list[float], rng: random.Random) -> float:
    pooled, n_a = a + b, len(a)
    total, n = sum(pooled), len(pooled)
    observed = abs(mean(a) - mean(b))
    hits = 0
    for _ in range(PERMUTATIONS):
        s = sum(rng.sample(pooled, n_a))
        if abs(s / n_a - (total - s) / (n - n_a)) >= observed - 1e-9:
            hits += 1
    return (hits + 1) / (PERMUTATIONS + 1)


def bootstrap_ci(a: list[float], b: list[float], rng: random.Random) -> tuple[float, float]:
    diffs = sorted(mean(rng.choices(a, k=len(a))) - mean(rng.choices(b, k=len(b)))
                   for _ in range(BOOTSTRAP))
    return diffs[int(0.025 * BOOTSTRAP)], diffs[int(0.975 * BOOTSTRAP) - 1]


def benjamini_hochberg(pvalues: list[float], q: float) -> list[bool]:
    order = sorted(range(len(pvalues)), key=lambda i: pvalues[i])
    cutoff = 0
    for rank, i in enumerate(order, 1):
        if pvalues[i] <= q * rank / len(pvalues):
            cutoff = rank
    passed = [False] * len(pvalues)
    for rank, i in enumerate(order, 1):
        passed[i] = rank <= cutoff
    return passed


def _factor(tags: dict[str, str], name: str) -> bool | None:
    if name in tags:
        return factor_value(name, tags[name])
    # Klíčové faktory počítám jen, když je deník výslovně uvádí. Ostatní štítky píšeš,
    # když se něco stalo, takže den se štítky, ale bez tohoto štítku je „ne“.
    return None if name in KEY_FACTORS else False


def compare(name: str, key: str, yes: list[float], no: list[float]) -> Finding:
    rng = random.Random(f"{name}|{key}|{len(yes)}|{len(no)}")
    return Finding(name, key, yes, no, mean(yes) - mean(no), permutation_p(yes, no, rng))


def associations(data: Data, end: date) -> tuple[list[Finding], list[str], list[str]]:
    """Večer X (štítky v deníku) proti noci a ránu X+1. Vrací souvislosti, málo dat, poznámky."""
    rows = []
    for i in range(1, ASSOC_DAYS + 1):
        x = end - timedelta(days=i)
        if x not in data.tags:
            continue
        rows.append((data.tags[x], {k: data.clean(x + timedelta(days=1), k) for k in OUTCOMES}))
    names = sorted({n for tags, _ in rows for n in tags} - {"nemoc"})
    tests, too_few = [], []
    for name in names:
        counts = [0, 0]
        for key in OUTCOMES:
            yes = [vals[key] for tags, vals in rows if vals[key] is not None and _factor(tags, name) is True]
            no = [vals[key] for tags, vals in rows if vals[key] is not None and _factor(tags, name) is False]
            counts = [max(counts[0], len(yes)), max(counts[1], len(no))]
            if len(yes) >= GROUP_MIN and len(no) >= GROUP_MIN:
                tests.append(compare(name, key, yes, no))
        if counts[0] < GROUP_MIN or counts[1] < GROUP_MIN:
            too_few.append(f"{name}: dní se štítkem {counts[0]}, bez něj {counts[1]} "
                           f"(potřebuju aspoň {GROUP_MIN} a {GROUP_MIN})")
    for test, ok in zip(tests, benjamini_hochberg([t.p for t in tests], FDR_Q)):
        test.significant = ok
    found = [t for t in tests if (t.significant or t.p < 0.05)
             and abs(t.diff) >= METRICS[t.metric].relevant]
    for t in found:
        t.ci = bootstrap_ci(t.yes, t.no, random.Random(f"ci|{t.factor}|{t.metric}"))
    found.sort(key=lambda t: (not t.significant, t.p))
    notes = []
    factors = sorted({t.factor for t in found})
    for i, a in enumerate(factors):
        for b in factors[i + 1:]:
            both = sum(1 for tags, _ in rows if _factor(tags, a) and _factor(tags, b))
            either = sum(1 for tags, _ in rows if _factor(tags, a) or _factor(tags, b))
            if either and both / either >= 0.5:
                notes.append(f"Štítky {a} a {b} se často objevují spolu (ve {both} z {either} dní), "
                             "jejich vliv od sebe nejde spolehlivě oddělit.")
    return found, too_few, notes


def finding_line(t: Finding) -> str:
    label = "průkazná souvislost" if t.significant else "naznačená souvislost, může jít o náhodu"
    lo, hi = t.ci if t.ci else (t.diff, t.diff)
    return (f"- **{t.factor}** → {METRICS[t.metric].label}: {effect_text(t.metric, t.diff)} po večerech "
            f"se štítkem (95% interval {signed(t.metric, lo)} až {signed(t.metric, hi)}; dní se štítkem "
            f"{len(t.yes)}, bez něj {len(t.no)}; {p_text(t.p)}; {label})")


# ---------- výstupy ----------

HEADER = ("Spočítal skript agent-zdravi {version} z dat v `zdravi/data/`. Normál = medián tvých "
          "posledních 28 dní (aspoň 14 platných), pásmo normálu = ± jeden robustní rozptyl. "
          "Postup: `skills/zdravi/METODIKA.md`.")

SOURCES = """## Zdroje
1. Watson NF a kol. Recommended Amount of Sleep for a Healthy Adult (AASM a SRS). J Clin Sleep Med 2015;11(6). https://www.aasm.org/resources/pdf/adultsleepdurationconsensus.pdf
2. Ohayon M a kol. National Sleep Foundation's sleep quality recommendations. Sleep Health 2017;3(1):6–19. doi:10.1016/j.sleh.2016.11.006
3. Chinoy ED a kol. Performance of seven consumer sleep-tracking devices compared with polysomnography. Sleep 2021. https://doi.org/10.1093/sleep/zsaa291
4. Bull FC a kol. World Health Organization 2020 guidelines on physical activity and sedentary behaviour. Br J Sports Med 2020. https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7719906/
"""


def quality_lines(data: Data, days: list[date]) -> list[str]:
    lines = []
    missing = [x for x in days if x not in data.days]
    if missing:
        lines.append("- Chybí data za: " + ", ".join(date_cz(x) for x in missing))
    for x in days:
        if x in data.days and data.days[x].notes:
            lines.append(f"- {date_cz(x)}: " + "; ".join(data.days[x].notes))
        if data.ill(x):
            lines.append(f"- {date_cz(x)}: v deníku je nemoc, den a následující noc nejdou do normálu")
    return lines or ["- Bez problémů."]


WEEKDAYS = ("pondělí", "úterý", "středa", "čtvrtek", "pátek", "sobota", "neděle")
WEEKDAYS_ON = ("pondělí", "úterý", "středu", "čtvrtek", "pátek", "sobotu", "neděli")  # „noc na sobotu“
WEEKDAY_FORMS = {"pondeli": 0, "utery": 1, "streda": 2, "stredu": 2, "ctvrtek": 3, "patek": 4,
                 "sobota": 5, "sobotu": 5, "nedele": 6, "nedeli": 6}
COUNT_WORDS = {"jednim": 1, "dvema": 2, "tremi": 3, "ctyrmi": 4, "peti": 5, "sesti": 6, "sedmi": 7,
               "osmi": 8, "deviti": 9, "deseti": 10, "ctrnacti": 14}


def past_day(text: str, today: date) -> date:
    """Den probuzení z češtiny: „včera“, „před týdnem“, „v noci na sobotu“, „23.10.“.
    Den v týdnu znamená poslední takový den před dneškem."""
    t = unicodedata.normalize("NFKD", " ".join(text.lower().split()))
    t = "".join(c for c in t if not unicodedata.combining(c))
    t = re.sub(r"^(?:dnes v |dnes |dnesni |tuhle |v )?noci?(?: na)? ?", "", t)
    t = re.sub(r"^(?:v|ve|na|minuly|minulou|minulej|posledni) ", "", t)
    if t in ("", "dnes", "dneska"):
        return today
    if t == "vcera":
        return today - timedelta(days=1)
    if t == "predevcirem":
        return today - timedelta(days=2)
    if t in WEEKDAY_FORMS:
        return today - timedelta(days=(today.weekday() - WEEKDAY_FORMS[t]) % 7 or 7)
    if m := re.fullmatch(r"pred (?:(\w+) )?(dnem|dny|dni|tydnem|tydny)", t):
        count = 1 if not m[1] else int(m[1]) if m[1].isdigit() else COUNT_WORDS.get(m[1])
        if count:
            return today - timedelta(days=count * (7 if m[2].startswith("tyd") else 1))
    try:
        if m := re.fullmatch(r"(\d{4})-(\d{1,2})-(\d{1,2})", t):
            return date(int(m[1]), int(m[2]), int(m[3]))
        if m := re.fullmatch(r"(\d{1,2})\. ?(\d{1,2})\.?(?: ?(\d{4}))?", t):
            d = date(int(m[3]) if m[3] else today.year, int(m[2]), int(m[1]))
            return d if m[3] or d <= today else date(today.year - 1, d.month, d.day)
    except ValueError:
        raise HealthError(f"Datum „{text}“ neexistuje.") from None
    raise HealthError(f"Nerozumím dni „{text}“. Použij dnes, vcera, pred tydnem, pred 3 dny, "
                      "v noci na sobotu, 23.10. nebo RRRR-MM-DD.")


def report_night(data: Data, d: date) -> str:
    """Jedna noc v pár řádcích, na rychlou otázku. Nic neukládá."""
    day = data.days.get(d)
    if day is None:
        raise HealthError(f"Za noc na {WEEKDAYS_ON[d.weekday()]} {date_cz(d)} nemám data z náramku "
                          f"(zdravi/data/{d.isoformat()}.json).")
    y = d - timedelta(days=1)

    def part(key: str) -> str:
        v, n = data.value(d, key), data.normal(key, d)
        z = (v - n.center) / n.spread if v is not None and n.ready else None
        text = f"{METRICS[key].label} {show(key, v)}"
        if n.ready:
            text += f" (normál {show(key, n.center)})"
        return text + f": {assess(key, z, n)}"

    lines = [f"Noc na {WEEKDAYS_ON[d.weekday()]} {date_cz(d)} ({y.day}. → {d.day}. {d.month}.)"]
    if data.value(d, "spanek_min") is None:
        lines.append("Spánek: za tuhle noc data chybí.")
    else:
        lines.append(part("spanek_min"))
        times = ", ".join(f"{METRICS[k].label.lower()} {show(k, data.value(d, k))}"
                          for k in ("zacatek", "konec", "efektivita_pct") if data.value(d, k) is not None)
        if times:
            lines.append(times[0].upper() + times[1:])
        if not day.night_ok:
            lines.append("Pozor: noc je neúplná nebo kratší než 3 h, do normálu se nepočítá.")
    lines += [part(k) for k in ("ln_hrv", "tep_klidovy") if data.value(d, k) is not None]
    lines.append(f"Zdroj: zdravi/data/{d.isoformat()}.json")
    return "\n".join(lines) + "\n"


def report_nights(data: Data, end: date, days: int) -> str:
    """Posledních N nocí po řádcích. Nejdelší, nejkratší a průměr počítá skript, ne model."""
    nights, lines = [], []
    for i in range(days):
        d = end - timedelta(days=i)
        day, v = data.days.get(d), data.value(d, "spanek_min")
        if day is None or v is None:
            continue
        s, e = data.value(d, "zacatek"), data.value(d, "konec")
        line = f"{WEEKDAYS[d.weekday()][:2]} {d.day}. {d.month}.: {duration(v)}"
        if s is not None and e is not None:
            line += f", {clock_text(s)}–{clock_text(e)}"
        if day.night_ok:
            nights.append((d, v))
        else:
            line += " (neúplná noc, do přehledu se nepočítá)"
        lines.append(line)
    if not nights:
        raise HealthError(f"Za posledních {days} nocí do {date_cz(end)} nemám data o spánku (zdravi/data/).")
    longest, shortest = max(nights, key=lambda n: n[1]), min(nights, key=lambda n: n[1])

    def night(n: tuple[date, float]) -> str:
        return f"noc na {WEEKDAYS_ON[n[0].weekday()]} {n[0].day}. {n[0].month}. ({duration(n[1])})"

    return "\n".join([
        f"Spánek za posledních {days} nocí do {date_cz(end)} (podle dne probuzení):", *lines,
        f"Nejdéle: {night(longest)}",
        f"Nejkratší: {night(shortest)}",
        f"Průměr: {duration(mean([v for _, v in nights]))} z {len(nights)} nocí",
        "Zdroj: zdravi/data/",
    ]) + "\n"


# Sloupce tabulky všech dní: klíč, záhlaví, slova pro nejvyšší a nejnižší hodnotu.
TABLE = [
    ("spanek_min", "spánek", "nejdéle", "nejkratší"),
    ("zacatek", "usnul", "nejpozději", "nejdříve"),
    ("konec", "vstal", "nejpozději", "nejdříve"),
    ("efektivita_pct", "efektivita", "nejvyšší", "nejnižší"),
    ("hluboky_min", "hluboký", "nejvíc", "nejméně"),
    ("rem_min", "REM", "nejvíc", "nejméně"),
    ("ln_hrv", "HRV", "nejvyšší", "nejnižší"),
    ("tep_klidovy", "tep", "nejvyšší", "nejnižší"),
    ("kroky", "kroky", "nejvíc", "nejméně"),
    ("aktivni_min", "aktivní min", "nejvíc", "nejméně"),
]


def cell(key: str, v: float | None) -> str:
    """Hodnota do tabulky, co nejkratší."""
    if v is None:
        return "–"
    kind = METRICS[key].kind
    if kind == "min":
        m = int(round(v))
        return f"{m // 60}:{m % 60:02d}"
    if kind == "clock":
        return clock_text(v)
    if kind == "hrv":
        return f"{cz(math.exp(v))} ms"
    return cz(v, METRICS[key].decimals) + (" %" if key == "efektivita_pct" else "")


def usable(data: Data, d: date, key: str) -> float | None:
    """Hodnota do souhrnů: bez neúplných nocí a dnů s krátkým nošením."""
    day = data.days.get(d)
    if day is None:
        return None
    if key in NIGHT and not day.night_ok:
        return None
    if key in ACTIVITY and not day.activity_ok:
        return None
    return day.values.get(key)


def week_line(data: Data, end: date) -> str:
    """Jeden řádek: průměr posledních 7 dní a v závorce předchozích 7 dní."""
    parts = []
    for key, label in (("spanek_min", "spánek"), ("ln_hrv", "HRV"), ("tep_klidovy", "klidový tep"),
                       ("kroky", "kroky")):
        week = [v for i in range(7) if (v := usable(data, end - timedelta(days=i), key)) is not None]
        before = [v for i in range(7, 14) if (v := usable(data, end - timedelta(days=i), key)) is not None]
        if week:
            parts.append(f"{label} {cell(key, mean(week))}" + (f" ({cell(key, mean(before))})" if before else ""))
    return ("Posledních 7 dní (v závorce předchozích 7): " + ", ".join(parts) + "."
            if parts else "Za posledních 7 dní nejsou data.")


def report_data(data: Data, end: date, days: int | None = None) -> str:
    """Všechny dny z náramku v jedné tabulce a souhrn. Agent z ní odpoví na jakoukoli otázku
    k historii. Nejvyšší, nejnižší a průměry počítá skript, ne model."""
    dates = sorted((d for d in data.days if d <= end), reverse=True)
    if days:
        dates = [d for d in dates if d > end - timedelta(days=days)]
    if not dates:
        raise HealthError(f"Do {date_cz(end)} nemám žádná data z náramku (zdravi/data/).")

    def short(d: date) -> str:
        return f"{WEEKDAYS[d.weekday()][:2]} {d.day}. {d.month}."

    first, last = dates[-1], dates[0]
    out = [f"Data z náramku: {len(dates)} dní ({date_cz(first)} až {date_cz(last)}). Řádek = den probuzení, "
           "spánek je noc před ním, kroky a aktivní minuty jsou za ten den. * = neúplná noc.",
           " | ".join(["den"] + [t[1] for t in TABLE])]
    for d in dates:
        mark = "" if data.days[d].night_ok else " *"
        out.append(" | ".join([short(d) + mark] + [cell(k, data.value(d, k)) for k, *_ in TABLE]))
    out += ["", "Souhrn (spočítal skript, neúplné noci a dny s krátkým nošením nepočítá):"]
    for key, label, high, low in TABLE:
        vals = [(d, v) for d in dates if (v := usable(data, d, key)) is not None]
        if not vals:
            continue
        top, bottom = max(vals, key=lambda x: x[1]), min(vals, key=lambda x: x[1])
        line = (f"- {METRICS[key].label}: {high} {cell(key, top[1])} ({short(top[0])}), "
                f"{low} {cell(key, bottom[1])} ({short(bottom[0])}), průměr {cell(key, mean([v for _, v in vals]))}")
        week = [v for d, v in vals if d > end - timedelta(days=7)]
        before = [v for d, v in vals if end - timedelta(days=14) < d <= end - timedelta(days=7)]
        if week:
            line += f", posledních 7 dní {cell(key, mean(week))}"
        if before:
            line += f", předchozích 7 dní {cell(key, mean(before))}"
        out.append(line)
    out.append("Zdroj: zdravi/data/")
    return "\n".join(out) + "\n"


def report_day(data: Data, d: date) -> str:
    if d not in data.days and d - timedelta(days=1) not in data.days:
        raise HealthError(f"Za {date_cz(d)} ani za předchozí den nemám data z náramku "
                          "(zdravi/data/). Nejdřív se musí stáhnout.")
    y = d - timedelta(days=1)
    out = [f"# Zdraví {date_cz(d)}", "", HEADER.format(version=VERSION), ""]
    day = data.days.get(d)
    if day and day.google:
        out += ["Google: " + ", ".join(f"{GOOGLE_SCORES[k]} {cz(v)}" for k, v in day.google.items())
                + " (vlastní výpočet Googlu, jeho vzorec není veřejný)", ""]

    out += [f"## Noc {y.day}. → {d.day}. {d.month}.", "",
            "| Ukazatel | Dnes | Tvůj normál (pásmo) | Hodnocení |", "|---|---|---|---|"]
    out += metric_rows(data, d, NIGHT) or ["| – | – | – | chybí data o spánku |"]
    out += ["", f"## Zotavení (ráno {d.day}. {d.month}.)", "",
            "| Ukazatel | Dnes | Tvůj normál (pásmo) | Hodnocení |", "|---|---|---|---|"]
    out += metric_rows(data, d, RECOVERY) or ["| – | – | – | chybí data o zotavení |"]
    status, reasons = recovery(data, d)
    out += ["", f"**Stav zotavení: {status}** (odhad skriptu podle pevných pravidel, ne skóre Googlu)"
            + (": " + "; ".join(reasons) if reasons else "")]

    out += ["", f"## Včera ({date_cz(y)}): aktivita", "",
            "| Ukazatel | Včera | Tvůj normál (pásmo) | Hodnocení |", "|---|---|---|---|"]
    out += metric_rows(data, y, ACTIVITY) or ["| – | – | – | chybí data o aktivitě |"]
    if y in data.days and data.days[y].wear_h is not None:
        out.append(f"\nNáramek nošen {cz(data.days[y].wear_h, 1)} h.")

    week = [d - timedelta(days=i) for i in range(7)]
    tst = [v for x in week if (v := data.clean(x, "spanek_min")) is not None]
    out += ["", "## Posledních 7 nocí", ""]
    if len(tst) >= 4:
        debt = sum(max(0.0, data.goal_min - v) for v in tst)
        out.append(f"- Průměrný spánek {duration(mean(tst))} ({len(tst)} nocí), cíl {duration(data.goal_min)}.")
        out.append(f"- Spánkový dluh {duration(debt)} (součet toho, co chybělo do cíle).")
    else:
        out.append(f"- Spánek: nevím, platných nocí jen {len(tst)} ze 7.")
    mids = [v for x in week if (v := data.clean(x, "stred")) is not None]
    if len(mids) >= 5:
        out.append(f"- Kolísání středu spánku ± {cz(statistics.stdev(mids))} min ({len(mids)} nocí).")
    status, detail = hrv_trend(data, d)
    out.append(f"- HRV 7denní průměr: {status} ({detail}).")

    alerts = warnings(data, d)
    out += ["", "## Upozornění", ""] + ([f"- {a}" for a in alerts] or ["- Žádné."])

    tags = data.tags.get(y)
    if tags:
        out += ["", f"## Večer {date_cz(y)} podle deníku", "",
                "- Štítky: " + ", ".join(f"{k}={v}" if v else k for k, v in tags.items())]
        found, _, _ = associations(data, d)
        related = [t for t in found if t.factor in tags and _factor(tags, t.factor)]
        if related:
            out.append("- Co z toho podle tvých dat souvisí se spánkem a zotavením:")
            out += ["  " + finding_line(t) for t in related]
        else:
            out.append("- U včerejších štítků zatím žádnou souvislost v tvých datech nevidím.")

    out += ["", "## Kvalita dat", ""] + quality_lines(data, [d, y])
    return "\n".join(out) + "\n"


def report_week(data: Data, d: date) -> str:
    nights = [d - timedelta(days=i) for i in range(6, -1, -1)]
    previous = [x - timedelta(days=7) for x in nights]
    active_days = [x - timedelta(days=1) for x in nights]
    if not any(x in data.days for x in nights + active_days):
        raise HealthError(f"Za týden do {date_cz(d)} nemám žádná data z náramku.")
    year, week, _ = d.isocalendar()
    out = [f"# Zdraví: týden {year}-W{week:02d} (noci {date_cz(nights[0])} až {date_cz(d)})", "",
           HEADER.format(version=VERSION), ""]

    def avg(days: list[date], key: str) -> tuple[float | None, int]:
        vals = [v for x in days if (v := data.clean(x, key)) is not None]
        return (mean(vals) if vals else None), len(vals)

    def cell(days: list[date], key: str) -> str:
        v, n = avg(days, key)
        return f"{show(key, v)} ({n})" if v is not None else "–"

    def debt(days: list[date]) -> str:
        vals = [v for x in days if (v := data.clean(x, "spanek_min")) is not None]
        return duration(sum(max(0.0, data.goal_min - v) for v in vals)) if vals else "–"

    def below(days: list[date]) -> str:
        return str(sum(1 for x in days if (v := data.clean(x, "spanek_min")) is not None
                       and v < data.goal_min))

    def spread(days: list[date]) -> str:
        vals = [v for x in days if (v := data.clean(x, "stred")) is not None]
        return f"± {cz(statistics.stdev(vals))} min" if len(vals) >= 5 else "–"

    out += ["## Spánek", "", "Čísla v závorce = počet platných nocí.", "",
            "| Ukazatel | Tento týden | Předchozí týden |", "|---|---|---|"]
    for key in ("spanek_min", "zacatek", "konec", "efektivita_pct", "hluboky_min", "rem_min", "bdeni_min"):
        out.append(f"| {METRICS[key].label} (průměr) | {cell(nights, key)} | {cell(previous, key)} |")
    out.append(f"| Nocí pod cílem {duration(data.goal_min)} | {below(nights)} | {below(previous)} |")
    out.append(f"| Spánkový dluh | {debt(nights)} | {debt(previous)} |")
    out.append(f"| Kolísání středu spánku | {spread(nights)} | {spread(previous)} |")
    context = []
    tst, n_tst = avg(nights, "spanek_min")
    if tst is not None and n_tst >= 4 and tst < 420:
        context.append("- Průměrný spánek je pod 7 h. AASM a SRS doporučují dospělým spát pravidelně "
                       "7 a více hodin [1].")
    eff, n_eff = avg(nights, "efektivita_pct")
    if eff is not None and n_eff >= 4 and eff < 85:
        context.append("- Průměrná efektivita je pod 85 %. NSF považuje 85 % a víc za znak dobré "
                       "kvality spánku [2].")
    context.append("- Fáze spánku (hluboký, REM) měří náramek méně přesně než délku spánku [3]. "
                   "Hodnotím je jen proti tvému normálu, ne podle jedné noci.")
    out += [""] + context

    statuses = [recovery(data, x)[0] for x in nights if x in data.days]
    status, detail = hrv_trend(data, d)
    rhr_now, n_now = avg(nights, "tep_klidovy")
    rhr_base = data.normal("tep_klidovy", nights[0])
    out += ["", "## Zotavení", "",
            f"- HRV 7denní průměr: {status} ({detail}).",
            f"- Klidový tep: průměr {show('tep_klidovy', rhr_now)} ({n_now} dní), "
            f"normál {normal_text('tep_klidovy', rhr_base)}.",
            f"- Rána podle stavu zotavení: dobré {statuses.count('dobré')}, snížené "
            f"{statuses.count('snížené')}, nízké {statuses.count('nízké')}, nevím {statuses.count('nevím')}."]
    strain = [x for x in nights if any(w.startswith("Možná zátěž") for w in warnings(data, x))]
    alerts = [w for w in warnings(data, d) if not w.startswith("Možná zátěž")]
    if strain:
        alerts.insert(0, "Možná zátěž organismu ve dnech " + ", ".join(date_cz(x) for x in strain)
                      + ", podrobnosti jsou v denních souhrnech.")
    out += [f"- Upozornění: {a}" for a in alerts] or ["- Upozornění: žádná."]

    active = [v for x in active_days if (v := data.clean(x, "aktivni_min")) is not None]
    steps, n_steps = avg(active_days, "kroky")
    out += ["", f"## Aktivita (dny {date_cz(active_days[0])} až {date_cz(active_days[-1])})", ""]
    if len(active) >= 5:
        total = sum(active)
        verdict = ("pod doporučením" if total < 150 else "v doporučeném rozsahu" if total <= 300
                   else "nad horní hranicí, podle WHO i to přináší další užitek")
        missing = f", chybí {7 - len(active)} dní" if len(active) < 7 else ""
        out.append(f"- Aktivní minuty celkem {cz(total)} min ({len(active)} dní{missing}). WHO doporučuje "
                   f"150–300 minut středně intenzivní aktivity týdně [4]: {verdict}.")
    else:
        out.append(f"- Aktivní minuty: nevím, dní s daty jen {len(active)} ze 7.")
    if steps is not None:
        out.append(f"- Kroky průměrně {cz(steps)} denně ({n_steps} dní), normál "
                   f"{normal_text('kroky', data.normal('kroky', active_days[0]))}.")

    found, too_few, notes = associations(data, d)
    out += ["", f"## Souvislosti s deníkem (posledních {ASSOC_DAYS} dní)", "",
            "Večer se štítkem proti večerům bez něj, porovnává se následující noc a ráno. "
            "Souvislost neznamená příčinu, tu ověří až pokus (`agent-zdravi pokus`).", ""]
    out += [finding_line(t) for t in found] or ["- Zatím žádná souvislost nad hranicí náhody."]
    out += [f"- {n}" for n in notes]
    if too_few:
        out += ["", "Málo dat:"] + [f"- {t}" for t in too_few]

    out += ["", "## Kvalita dat", ""] + quality_lines(data, nights)
    out += ["", SOURCES]
    return "\n".join(out)


def report_experiment(data: Data, name: str, start: date, end: date,
                      ref_start: date | None, ref_end: date | None, primary: str | None) -> str:
    if end < start:
        raise HealthError("Konec pokusu je dřív než začátek.")
    if (ref_start is None) != (ref_end is None):
        raise HealthError("Zadej obě data srovnávacího období, nebo žádné.")
    if ref_start is None:
        ref_end = start - timedelta(days=1)
        ref_start = ref_end - (end - start)
    if primary and primary not in OUTCOMES + ACTIVITY:
        raise HealthError(f"Neznámý ukazatel {primary}. Možnosti: {', '.join(OUTCOMES + ACTIVITY)}")

    def collect(a: date, b: date) -> dict[str, list[float]]:
        out = {k: [] for k in OUTCOMES + ACTIVITY}
        x = a
        while x <= b:
            for key in OUTCOMES:   # noc a ráno po dni pokusu
                if (v := data.clean(x + timedelta(days=1), key)) is not None:
                    out[key].append(v)
            for key in ACTIVITY:   # aktivita v den pokusu
                if (v := data.clean(x, key)) is not None:
                    out[key].append(v)
            x += timedelta(days=1)
        return out

    test, ref = collect(start, end), collect(ref_start, ref_end)
    lines = [f"# Pokus: {name}", "", HEADER.format(version=VERSION), "",
             f"- Pokus: {date_cz(start)} až {date_cz(end)} (noci a rána po těchto dnech).",
             f"- Srovnání: {date_cz(ref_start)} až {date_cz(ref_end)}."]
    last = max(data.days) if data.days else None
    if last is None or last < end + timedelta(days=1):
        lines.append("- Pokus ještě nemá všechna data, výsledek je průběžný.")
    results = []
    for key in OUTCOMES + ACTIVITY:
        if len(test[key]) >= 3 and len(ref[key]) >= 3:
            results.append(compare(name, key, test[key], ref[key]))
    others = [r for r in results if r.metric != primary]
    for r, ok in zip(others, benjamini_hochberg([r.p for r in others], FDR_Q)):
        r.significant = ok
    for r in results:
        if r.metric == primary:
            r.significant = r.p < 0.05
        r.ci = bootstrap_ci(r.yes, r.no, random.Random(f"ci|{name}|{r.metric}"))
    lines += ["", "| Ukazatel | Pokus | Srovnání | Rozdíl | 95% interval | p | Hodnotím |",
              "|---|---|---|---|---|---|---|"]
    for r in sorted(results, key=lambda r: (r.metric != primary, r.p)):
        small = abs(r.diff) < METRICS[r.metric].relevant
        verdict = ("bez znatelného rozdílu" if small or not r.significant
                   else "průkazný rozdíl")
        label = METRICS[r.metric].label + (" (hlavní ukazatel)" if r.metric == primary else "")
        lines.append(f"| {label} | {show(r.metric, mean(r.yes))} ({len(r.yes)}) | "
                     f"{show(r.metric, mean(r.no))} ({len(r.no)}) | {effect_text(r.metric, r.diff)} | "
                     f"{signed(r.metric, r.ci[0])} až {signed(r.metric, r.ci[1])} | {p_text(r.p)[2:].lstrip('= ')} | {verdict} |")
    if not results:
        lines.append("| – | – | – | – | – | – | málo dat, potřebuju aspoň 3 hodnoty v každém období |")
    lines += ["", "Pozor: pokus není slepý a výsledek mohou ovlivnit i jiné věci (práce, nemoc, "
              "počasí). Spolehlivější je pokus zopakovat (pokus, pauza, pokus).",
              "Hlavní ukazatel zadaný předem hodnotím s p < 0,05. U ostatních řádků rozhoduje "
              "oprava na počet srovnání (Benjamini–Hochberg), aby náhoda nevypadala jako výsledek."]
    return "\n".join(lines) + "\n"


def report_check(data: Data, today: date) -> str:
    out = [f"# Zdraví: kontrola dat ({date_cz(today)})", ""]
    if not data.days:
        return "\n".join(out + ["Ve složce `zdravi/data/` zatím nejsou žádná data z náramku."]) + "\n"
    first, last = min(data.days), max(data.days)
    window = [today - timedelta(days=i) for i in range(1, NORMAL_DAYS + 1)]
    out += [f"- Dny s daty: {len(data.days)} (od {date_cz(first)} do {date_cz(last)}).",
            f"- Za posledních {NORMAL_DAYS} dní chybí: {sum(1 for x in window if x not in data.days)} dní.",
            f"- Dny se štítky v deníku za posledních {NORMAL_DAYS} dní: "
            f"{sum(1 for x in window if x in data.tags)}.",
            "", "| Ukazatel | Platných hodnot (28 dní) | Normál |", "|---|---|---|"]
    for key in METRICS:
        n = data.normal(key, today)
        out.append(f"| {METRICS[key].label} | {n.n} | "
                   f"{normal_text(key, n) if n.ready else f'nevím ({n.n}/{NORMAL_MIN})'} |")
    problems = [f"- {date_cz(x)}: " + "; ".join(data.days[x].notes)
                for x in sorted(data.days) if x >= window[-1] and data.days[x].notes]
    out += ["", "## Vyřazené a sporné hodnoty", ""] + (problems or ["- Žádné."])
    return "\n".join(out) + "\n"


def write(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_name(f".{path.name}.part")
    tmp.write_text(text, encoding="utf-8")
    os.replace(tmp, path)


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(prog="agent-zdravi",
                                     description="Vyhodnocení dat z náramku. Čísla počítá skript, ne model.")
    parser.add_argument("--mozek", type=Path, default=Path(os.environ.get("AGENT_MOZEK", Path.home() / "Mozek")))
    sub = parser.add_subparsers(dest="cmd", required=True)
    p_day = sub.add_parser("den", help="ranní souhrn: noc, zotavení, včerejší aktivita")
    p_day.add_argument("--datum", type=date.fromisoformat, default=date.today())
    p_night = sub.add_parser("noc", help="jedna noc krátce, např. --den \"před týdnem\"")
    p_night.add_argument("--den", default="dnes")
    p_nights = sub.add_parser("noci", help="posledních N nocí a nejdelší, nejkratší a průměr")
    p_nights.add_argument("--dni", type=int, default=14)
    p_nights.add_argument("--do", dest="end", type=date.fromisoformat, default=date.today())
    p_data = sub.add_parser("data", help="všechny dny v jedné tabulce a souhrn")
    p_data.add_argument("--dni", type=int)
    p_data.add_argument("--do", dest="end", type=date.fromisoformat, default=date.today())
    p_data.add_argument("--ulozit", action="store_true", help="uložit do zdravi/prehled.md")
    p_week = sub.add_parser("tyden", help="týdenní rozbor a souvislosti s deníkem")
    p_week.add_argument("--do", dest="end", type=date.fromisoformat, default=date.today())
    p_exp = sub.add_parser("pokus", help="vyhodnocení pokusu")
    p_exp.add_argument("--nazev", required=True)
    p_exp.add_argument("--od", dest="start", type=date.fromisoformat, required=True)
    p_exp.add_argument("--do", dest="end", type=date.fromisoformat, required=True)
    p_exp.add_argument("--srovnani-od", dest="ref_start", type=date.fromisoformat)
    p_exp.add_argument("--srovnani-do", dest="ref_end", type=date.fromisoformat)
    p_exp.add_argument("--hlavni", help=f"hlavní ukazatel, např. {', '.join(OUTCOMES)}")
    sub.add_parser("kontrola", help="kolik je dat, co chybí a co je vyřazené")
    args = parser.parse_args(argv)

    data = Data(args.mozek)
    try:
        if args.cmd == "noc":
            print(report_night(data, past_day(args.den, date.today())), end="")
            return 0
        if args.cmd == "data":
            text = report_data(data, args.end, args.dni)
            if not args.ulozit:
                print(text, end="")
                return 0
            path = data.folder / "prehled.md"
            write(path, f"# Zdraví: všechny dny\n\nAktualizováno {datetime.now():%Y-%m-%d %H:%M} skriptem "
                        f"agent-zdravi po stažení dat z náramku.\n\n{text}")
            print(f"Uloženo: {path}")
            print(week_line(data, args.end))
            return 0
        if args.cmd == "noci":
            print(report_nights(data, args.end, max(1, min(args.dni, 90))), end="")
            return 0
        if args.cmd == "den":
            text = report_day(data, args.datum)
            path = data.folder / f"{args.datum.isoformat()}.md"
        elif args.cmd == "tyden":
            text = report_week(data, args.end)
            year, week, _ = args.end.isocalendar()
            path = data.folder / f"tyden-{year}-W{week:02d}.md"
        elif args.cmd == "pokus":
            text = report_experiment(data, args.nazev, args.start, args.end,
                                     args.ref_start, args.ref_end, args.hlavni)
            path = data.folder / "pokusy" / f"{slug(args.nazev) or 'pokus'}.md"
        else:
            print(report_check(data, date.today()), end="")
            return 0
    except HealthError as exc:
        print(f"Chyba: {exc}", file=sys.stderr)
        return 1
    write(path, text)
    print(text, end="")
    print(f"\nUloženo: {path}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
