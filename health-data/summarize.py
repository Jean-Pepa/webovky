#!/usr/bin/env python3
"""
summarize.py – z data/raw/ (výstup pull.py nebo `ghealth --raw`) udělá přehled
do data/summary/:

  daily.csv      jeden řádek na den: kroky, klidový tep, HRV, SpO2, spánek, tep min/avg/max…
  sleep.csv      jedna noc (session) na řádek, včetně fází
  exercise.csv   jeden trénink na řádek
  hr_hourly.csv  tep po hodinách (min/avg/max/počet vzorků)
  summary.md     čitelný souhrn posledních týdnů – tohle stačí vložit do chatu k analýze

Používá jen standardní knihovnu, žádné instalace.
"""

from __future__ import annotations

import argparse
import csv
import datetime as dt
import gzip
import json
import statistics
import sys
from collections import defaultdict
from pathlib import Path

HERE = Path(__file__).resolve().parent

TIME_KEYS = {"sampleTime", "interval", "date", "createTime", "updateTime", "civilStartTime", "civilEndTime"}
META_KEYS = {"dataSource", "name", "civilStartTime", "civilEndTime"}

# typ → (sloupec v daily.csv, klíč v datech nebo None = první číselná hodnota)
DAILY_TYPES = {
    "daily-resting-heart-rate": ("resting_hr", "beatsPerMinute"),
    "daily-heart-rate-variability": ("hrv", None),
    "daily-oxygen-saturation": ("spo2", None),
    "daily-respiratory-rate": ("resp_rate", None),
    "daily-sleep-temperature-derivations": ("skin_temp_dev", None),
    "daily-vo2-max": ("vo2max", None),
}
ROLLUP_TYPES = {
    "steps": ("steps", "countSum", 1),
    "distance": ("distance_km", "millimetersSum", 1 / 1_000_000),
    "floors": ("floors", "countSum", 1),
    "total-calories": ("calories_kcal", "kcalSum", 1),
    "active-minutes": ("active_minutes", None, 1),
    "active-zone-minutes": ("azm", None, 1),
}
SAMPLE_TYPES = {
    "heart-rate-variability": "hrv_samples",
    "oxygen-saturation": "spo2_samples",
}


# ─── pomocné ────────────────────────────────────────────────────────────────

def warn(msg: str) -> None:
    print(f"varování: {msg}", file=sys.stderr)


def type_key(dp: dict) -> str | None:
    for k, v in dp.items():
        if k not in META_KEYS and isinstance(v, dict):
            return k
    return None


def parse_ts(ts: str) -> dt.datetime:
    return dt.datetime.fromisoformat(ts.replace("Z", "+00:00"))


def offset_seconds(s) -> int:
    try:
        return int(str(s or "0").rstrip("s") or 0)
    except ValueError:
        return 0


def local_time(ts: str | None, offset) -> dt.datetime | None:
    if not ts:
        return None
    try:
        return parse_ts(ts).astimezone(dt.timezone(dt.timedelta(seconds=offset_seconds(offset))))
    except ValueError:
        return None


def civil(d: dict | None) -> dt.date | None:
    if not isinstance(d, dict):
        return None
    d = d.get("date", d)
    try:
        return dt.date(int(d["year"]), int(d["month"]), int(d["day"]))
    except (KeyError, TypeError, ValueError):
        return None


def num(v):
    if isinstance(v, bool):
        return None
    if isinstance(v, (int, float)):
        return v
    if isinstance(v, str):
        try:
            return int(v)
        except ValueError:
            try:
                return float(v)
            except ValueError:
                return None
    return None


def leaves(obj, path: tuple = (), out: dict | None = None) -> dict:
    """Všechny číselné listy objektu jako {'a.b.c': hodnota}; časové klíče se přeskakují.
    Seznam objektů s polem 'type' se indexuje podle něj (stagesSummary → DEEP.minutes)."""
    out = {} if out is None else out
    if isinstance(obj, dict):
        for k, v in obj.items():
            if k in TIME_KEYS:
                continue
            leaves(v, path + (k,), out)
    elif isinstance(obj, list):
        for i, v in enumerate(obj):
            if isinstance(v, dict) and isinstance(v.get("type"), str):
                rest = {k: x for k, x in v.items() if k != "type"}
                leaves(rest, path + (v["type"],), out)
            else:
                leaves(v, path + (str(i),), out)
    else:
        n = num(obj)
        if n is not None:
            out[".".join(path)] = n
    return out


def strings(obj: dict) -> dict:
    """Textové hodnoty na první úrovni (typ cvičení apod.)."""
    return {k: v for k, v in obj.items() if isinstance(v, str) and k not in TIME_KEYS}


def first_num(d: dict, preferred: str | None) -> tuple[str | None, object]:
    """(klíč, hodnota) preferovaného pole, jinak první číselný list."""
    if preferred and preferred in d:
        return preferred, d[preferred]
    for k, v in d.items():
        if preferred is None or k.endswith("." + preferred):
            return k, v
    return None, None


def source_of(dp: dict) -> str:
    ds = dp.get("dataSource") or {}
    dev = (ds.get("device") or {}).get("displayName")
    app = (ds.get("application") or {}).get("packageName")
    return dev or app or ds.get("platform") or ""


def iter_files(raw_dir: Path, type_id: str):
    """Všechny *.json a *.json.gz daného typu (výstup pull.py i ghealth --raw)."""
    d = raw_dir / type_id
    if not d.is_dir():
        return
    for f in sorted(list(d.glob("*.json")) + list(d.glob("*.json.gz"))):
        try:
            if f.name.endswith(".gz"):
                with gzip.open(f, "rt", encoding="utf-8") as fh:
                    yield f, json.load(fh)
            else:
                yield f, json.loads(f.read_text(encoding="utf-8"))
        except (json.JSONDecodeError, OSError, EOFError) as e:
            warn(f"{f}: {e}")


def load_points(raw_dir: Path, type_id: str) -> list[dict]:
    """Všechny dataPoints daného typu, deduplikované podle name."""
    seen: dict[str, dict] = {}
    for _, data in iter_files(raw_dir, type_id):
        for p in data.get("dataPoints", []):
            seen[p.get("name") or json.dumps(p, sort_keys=True)] = p
    return list(seen.values())


def load_rollups(raw_dir: Path, type_id: str) -> dict[dt.date, dict]:
    out: dict[dt.date, dict] = {}
    for _, data in iter_files(raw_dir, type_id):
        for r in data.get("rollupDataPoints", []):
            day = civil(r.get("civilStartTime"))
            if day is None:
                continue
            key = type_key(r)
            vals = leaves(r.get(key, {})) if key else {}
            if vals:
                out[day] = vals
    return out


def fmt(v, digits=0) -> str:
    if v is None or v == "":
        return ""
    if isinstance(v, float):
        return f"{v:.{digits}f}" if digits else f"{v:.0f}"
    return str(v)


# ─── sběr ───────────────────────────────────────────────────────────────────

class Agg:
    __slots__ = ("n", "sum", "min", "max")

    def __init__(self):
        self.n, self.sum, self.min, self.max = 0, 0.0, None, None

    def add(self, v):
        self.n += 1
        self.sum += v
        self.min = v if self.min is None else min(self.min, v)
        self.max = v if self.max is None else max(self.max, v)

    @property
    def mean(self):
        return self.sum / self.n if self.n else None


def collect(raw_dir: Path) -> dict:
    daily: dict[dt.date, dict] = defaultdict(dict)
    hourly: dict[tuple[dt.date, int], Agg] = defaultdict(Agg)
    hr_daily: dict[dt.date, Agg] = defaultdict(Agg)

    # tep – streamujeme po souborech, může jít o miliony vzorků
    for _, data in iter_files(raw_dir, "heart-rate"):
        for p in data.get("dataPoints", []):
            hr = p.get("heartRate") or p.get(type_key(p) or "", {})
            st = hr.get("sampleTime") or {}
            t = local_time(st.get("physicalTime"), st.get("utcOffset"))
            bpm = num(hr.get("beatsPerMinute"))
            if t is None or bpm is None:
                continue
            hr_daily[t.date()].add(bpm)
            hourly[(t.date(), t.hour)].add(bpm)
    for day, a in hr_daily.items():
        daily[day].update(hr_min=a.min, hr_avg=round(a.mean, 1), hr_max=a.max, hr_samples=a.n)

    # HRV / SpO2 jednotlivá měření → denní průměr
    for tid, col in SAMPLE_TYPES.items():
        per_day: dict[dt.date, list] = defaultdict(list)
        for p in load_points(raw_dir, tid):
            key = type_key(p)
            if not key:
                continue
            body = p[key]
            st = body.get("sampleTime") or {}
            t = local_time(st.get("physicalTime"), st.get("utcOffset"))
            _, v = first_num(leaves(body), None)
            if t is not None and v is not None:
                per_day[t.date()].append(v)
        for day, vs in per_day.items():
            daily[day][col + "_avg"] = round(statistics.fmean(vs), 2)
            daily[day][col + "_n"] = len(vs)

    # denní souhrny
    for tid, (col, pref) in DAILY_TYPES.items():
        for p in load_points(raw_dir, tid):
            key = type_key(p)
            if not key:
                continue
            body = p[key]
            day = civil(body.get("date"))
            if day is None:
                continue
            vals = leaves(body)
            main_key, main = first_num(vals, pref)
            if main is not None:
                daily[day][col] = main
            # ostatní hodnoty (např. HRV deep, SpO2 min/max) jako col.klíč
            for k, v in vals.items():
                if k != main_key:
                    daily[day][f"{col}.{k}"] = v

    # denní součty
    for tid, (col, pref, factor) in ROLLUP_TYPES.items():
        for day, vals in load_rollups(raw_dir, tid).items():
            main_key, main = first_num(vals, pref)
            if main is not None:
                daily[day][col] = round(main * factor, 2) if factor != 1 else main
            for k, v in vals.items():
                if k != main_key:
                    daily[day][f"{col}.{k}"] = v

    # spánek
    sleeps = []
    for p in load_points(raw_dir, "sleep"):
        s = p.get("sleep") or {}
        iv = s.get("interval") or {}
        start = local_time(iv.get("startTime"), iv.get("startUtcOffset"))
        end = local_time(iv.get("endTime"), iv.get("endUtcOffset"))
        if start is None or end is None:
            continue
        summ = s.get("summary") or {}
        row = {
            "date": end.date().isoformat(),
            "start": start.strftime("%Y-%m-%d %H:%M"),
            "end": end.strftime("%Y-%m-%d %H:%M"),
            "is_nap": bool((s.get("metadata") or {}).get("nap")),
            "type": s.get("type", ""),
            "minutes_asleep": num(summ.get("minutesAsleep")),
            "minutes_awake": num(summ.get("minutesAwake")),
            "minutes_in_bed": num(summ.get("minutesInSleepPeriod")),
            "minutes_to_fall_asleep": num(summ.get("minutesToFallAsleep")),
            "source": source_of(p),
        }
        for st in summ.get("stagesSummary") or []:
            if isinstance(st, dict) and st.get("type"):
                row["stage_" + str(st["type"]).lower()] = num(st.get("minutes"))
        known = {"stagesSummary", "minutesAsleep", "minutesAwake", "minutesInSleepPeriod", "minutesToFallAsleep"}
        for k, v in leaves({k: v for k, v in summ.items() if k not in known}).items():
            row.setdefault("summary." + k, v)
        sleeps.append(row)
    sleeps.sort(key=lambda r: r["start"])
    # hlavní spánek dne = nejdelší ne-šlofík končící ten den
    best: dict[str, dict] = {}
    for r in sleeps:
        if r["is_nap"]:
            continue
        cur = best.get(r["date"])
        if cur is None or (r["minutes_asleep"] or 0) > (cur["minutes_asleep"] or 0):
            best[r["date"]] = r
    for d, r in best.items():
        day = dt.date.fromisoformat(d)
        daily[day].update(
            sleep_start=r["start"][11:], sleep_end=r["end"][11:],
            sleep_minutes=r["minutes_asleep"], sleep_awake=r["minutes_awake"],
            sleep_in_bed=r["minutes_in_bed"],
        )
        for k, v in r.items():
            if k.startswith("stage_"):
                daily[day]["sleep_" + k[6:]] = v

    # cvičení
    exercises = []
    for p in load_points(raw_dir, "exercise"):
        e = p.get("exercise") or {}
        iv = e.get("interval") or {}
        start = local_time(iv.get("startTime"), iv.get("startUtcOffset"))
        end = local_time(iv.get("endTime"), iv.get("endUtcOffset"))
        if start is None or end is None:
            continue
        row = {
            "date": start.date().isoformat(),
            "start": start.strftime("%Y-%m-%d %H:%M"),
            "end": end.strftime("%Y-%m-%d %H:%M"),
            "duration_min": round((end - start).total_seconds() / 60, 1),
            "source": source_of(p),
        }
        row.update(strings(e))
        row.update(leaves(e))
        exercises.append(row)
    exercises.sort(key=lambda r: r["start"])
    ex_daily: dict[dt.date, list] = defaultdict(list)
    for r in exercises:
        ex_daily[dt.date.fromisoformat(r["date"])].append(r)
    for day, rows in ex_daily.items():
        daily[day]["exercise_count"] = len(rows)
        daily[day]["exercise_minutes"] = round(sum(r["duration_min"] for r in rows), 1)

    return dict(daily=dict(daily), hourly=hourly, sleeps=sleeps, exercises=exercises)


# ─── zápis ──────────────────────────────────────────────────────────────────

CORE_COLS = [
    "date", "weekday", "steps", "distance_km", "floors", "calories_kcal", "active_minutes", "azm",
    "resting_hr", "hr_min", "hr_avg", "hr_max", "hr_samples",
    "hrv", "hrv_samples_avg", "spo2", "spo2_samples_avg", "resp_rate", "skin_temp_dev", "vo2max",
    "sleep_start", "sleep_end", "sleep_minutes", "sleep_in_bed", "sleep_awake",
    "sleep_deep", "sleep_light", "sleep_rem",
    "exercise_count", "exercise_minutes",
]
WEEKDAYS = ["Po", "Út", "St", "Čt", "Pá", "So", "Ne"]


def write_csv(path: Path, rows: list[dict], first_cols: list[str]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    extra = sorted({k for r in rows for k in r} - set(first_cols))
    cols = [c for c in first_cols if any(c in r for r in rows)] + extra
    with path.open("w", newline="", encoding="utf-8") as fh:
        w = csv.DictWriter(fh, fieldnames=cols, restval="", extrasaction="ignore")
        w.writeheader()
        for r in rows:
            w.writerow({k: fmt(v, 2) if isinstance(v, float) else v for k, v in r.items()})


def daily_rows(daily: dict) -> list[dict]:
    rows = []
    for day in sorted(daily):
        r = {"date": day.isoformat(), "weekday": WEEKDAYS[day.weekday()]}
        r.update(daily[day])
        rows.append(r)
    return rows


def mean_of(rows: list[dict], col: str):
    vals = [num(r[col]) for r in rows if r.get(col) not in (None, "")]
    vals = [v for v in vals if v is not None]
    return statistics.fmean(vals) if vals else None


def md_table(headers: list[str], rows: list[list[str]]) -> str:
    out = ["| " + " | ".join(headers) + " |", "|" + "|".join("---" for _ in headers) + "|"]
    out += ["| " + " | ".join(r) + " |" for r in rows]
    return "\n".join(out)


def write_summary_md(path: Path, rows: list[dict], sleeps: list[dict], exercises: list[dict]) -> None:
    if not rows:
        path.write_text("Žádná data. Spusť nejdřív `python pull.py`.\n", encoding="utf-8")
        return
    last = dt.date.fromisoformat(rows[-1]["date"])
    first = dt.date.fromisoformat(rows[0]["date"])
    out = [f"# Souhrn zdravotních dat {first} až {last}", ""]
    out.append(f"- dní s daty: {len(rows)} (kalendářních dní v rozsahu: {(last - first).days + 1})")
    present = [c for c in CORE_COLS[2:] if any(r.get(c) not in (None, '') for r in rows)]
    out.append(f"- dostupné metriky: {', '.join(present) or 'žádné'}")
    out.append("")

    # trend: posledních 7 dní vs. předchozích 7
    cut7 = (last - dt.timedelta(days=6)).isoformat()
    cut14 = (last - dt.timedelta(days=13)).isoformat()
    w1 = [r for r in rows if r["date"] >= cut7]
    w0 = [r for r in rows if cut14 <= r["date"] < cut7]
    trend_cols = [("steps", "kroky", 0), ("resting_hr", "klidový tep", 1), ("hrv", "HRV", 1),
                  ("spo2", "SpO2", 1), ("sleep_minutes", "spánek (min)", 0), ("sleep_deep", "hluboký (min)", 0),
                  ("sleep_rem", "REM (min)", 0), ("hr_avg", "prům. tep", 1), ("exercise_minutes", "trénink (min)", 0)]
    trows = []
    for col, label, dg in trend_cols:
        a, b = mean_of(w1, col), mean_of(w0, col)
        if a is None and b is None:
            continue
        delta = "" if a is None or b is None else f"{a - b:+.{dg}f}"
        trows.append([label, fmt(a, dg) if a is not None else "", fmt(b, dg) if b is not None else "", delta])
    if trows:
        out += ["## Posledních 7 dní vs. předchozích 7", "",
                md_table(["metrika", f"od {cut7}", f"{cut14} až {(dt.date.fromisoformat(cut7) - dt.timedelta(days=1))}", "rozdíl"], trows), ""]

    # týdenní průměry (ISO týdny od pondělí), posledních 8 týdnů
    weeks: dict[str, list] = defaultdict(list)
    for r in rows:
        d = dt.date.fromisoformat(r["date"])
        weeks[(d - dt.timedelta(days=d.weekday())).isoformat()].append(r)
    wk_cols = [("steps", "kroky/den", 0), ("resting_hr", "klidový tep", 1), ("hrv", "HRV", 1),
               ("sleep_minutes", "spánek min", 0), ("sleep_deep", "hluboký", 0), ("sleep_rem", "REM", 0),
               ("hr_avg", "prům. tep", 1)]
    wk_cols = [c for c in wk_cols if c[0] in present]
    if len(weeks) >= 2 and wk_cols:
        wrows = []
        for start in sorted(weeks)[-8:]:
            rs = weeks[start]
            ex_min = sum(num(r.get("exercise_minutes")) or 0 for r in rs)
            wrows.append([f"{start} ({len(rs)} d)"] + [fmt(mean_of(rs, c), dg) if mean_of(rs, c) is not None else ""
                                                        for c, _, dg in wk_cols] + [fmt(ex_min)])
        out += ["## Týdny (průměr na den)", "",
                md_table(["týden od"] + [lbl for _, lbl, _ in wk_cols] + ["trénink min/týden"], wrows), ""]

    # denní tabulka posledních 14 dní
    cols = [c for c in ["date", "weekday", "steps", "resting_hr", "hrv", "spo2", "hr_avg", "hr_min", "hr_max",
                        "sleep_minutes", "sleep_deep", "sleep_rem", "sleep_awake", "exercise_minutes"]
            if c in ("date", "weekday") or c in present]
    drows = [[fmt(r.get(c), 1) if isinstance(r.get(c), float) else str(r.get(c, "") if r.get(c) is not None else "")
              for c in cols] for r in rows[-14:]]
    out += ["## Posledních 14 dní", "", md_table(cols, drows), ""]

    # spánek posledních 14 nocí
    ns = [s for s in sleeps if not s["is_nap"]][-14:]
    if ns:
        stage_cols = sorted({k for s in ns for k in s if k.startswith("stage_")})
        hdr = ["noc (konec)", "usnutí", "vstávání", "spánek min", "vzhůru min"] + [c[6:] for c in stage_cols]
        srows = [[s["date"], s["start"][11:], s["end"][11:], fmt(s["minutes_asleep"]), fmt(s["minutes_awake"])]
                 + [fmt(s.get(c)) for c in stage_cols] for s in ns]
        out += ["## Spánek – posledních 14 nocí", "", md_table(hdr, srows), ""]

    # tréninky posledních 30 dní
    cut30 = (last - dt.timedelta(days=29)).isoformat()
    ex = [e for e in exercises if e["date"] >= cut30]
    if ex:
        name_key = next((k for k in ("activityType", "exerciseType", "type", "name", "title")
                         if any(k in e for e in ex)), None)
        hr_key = next((k for k in ex[0] if "averageHeartRate" in k), None)
        kcal_key = next((k for k in ex[0] if "calories" in k.lower()), None)
        hdr = ["datum", "start", "min", "typ", "prům. tep", "kcal"]
        erows = [[e["date"], e["start"][11:], fmt(e["duration_min"]), str(e.get(name_key, "")) if name_key else "",
                  fmt(e.get(hr_key)) if hr_key else "", fmt(e.get(kcal_key)) if kcal_key else ""] for e in ex]
        out += ["## Tréninky – posledních 30 dní", "", md_table(hdr, erows), ""]

    out.append("Podrobná data: daily.csv, sleep.csv, exercise.csv, hr_hourly.csv ve stejné složce.")
    path.write_text("\n".join(out) + "\n", encoding="utf-8")


def main(argv=None) -> int:
    p = argparse.ArgumentParser(description="Udělá přehled z data/raw/ do data/summary/.")
    p.add_argument("--data", type=Path, default=HERE / "data", help="složka s daty (výchozí: ./data)")
    args = p.parse_args(argv)

    raw_dir = args.data / "raw"
    if not raw_dir.is_dir():
        print(f"Nenašel jsem {raw_dir}. Spusť nejdřív: python pull.py", file=sys.stderr)
        return 1
    out_dir = args.data / "summary"

    res = collect(raw_dir)
    rows = daily_rows(res["daily"])
    write_csv(out_dir / "daily.csv", rows, CORE_COLS)
    write_csv(out_dir / "sleep.csv", res["sleeps"],
              ["date", "start", "end", "is_nap", "type", "minutes_asleep", "minutes_awake", "minutes_in_bed",
               "minutes_to_fall_asleep", "stage_deep", "stage_light", "stage_rem", "stage_awake", "source"])
    write_csv(out_dir / "exercise.csv", res["exercises"], ["date", "start", "end", "duration_min", "source"])
    hourly = [{"date": d.isoformat(), "hour": h, "hr_min": a.min, "hr_avg": round(a.mean, 1), "hr_max": a.max, "n": a.n}
              for (d, h), a in sorted(res["hourly"].items())]
    write_csv(out_dir / "hr_hourly.csv", hourly, ["date", "hour", "hr_min", "hr_avg", "hr_max", "n"])
    write_summary_md(out_dir / "summary.md", rows, res["sleeps"], res["exercises"])

    print(f"daily.csv: {len(rows)} dní, sleep.csv: {len(res['sleeps'])} nocí, "
          f"exercise.csv: {len(res['exercises'])} tréninků, hr_hourly.csv: {len(hourly)} hodin")
    print(f"Souhrn k vložení do chatu: {out_dir / 'summary.md'}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
