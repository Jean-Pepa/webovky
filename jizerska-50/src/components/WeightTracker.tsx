"use client";

import { useMemo, useState } from "react";
import {
  ACTIVITY_FACTORS,
  bmr,
  tdee,
  targetCalories,
  macros,
  weightProjection,
  START_WEIGHT,
  GOAL_WEIGHT,
  HEIGHT,
  AGE,
  type Activity,
} from "@/lib/nutrition";
import { useWeightLog, useDayIndex, type WeightEntry } from "@/lib/store";

const START = Date.UTC(2026, 7, 31); // pondělí 31. 8. 2026 = týden 1

function toWeekIndex(dateStr: string): number {
  const d = new Date(dateStr + "T00:00:00Z").getTime();
  const wk = Math.round((d - START) / (7 * 86400000));
  return Math.max(0, Math.min(24, wk));
}

export default function WeightTracker() {
  const [log, setLog] = useWeightLog();
  const [activity, setActivity] = useState<Activity>("mid");

  const latest = log.length ? [...log].sort((a, b) => a.date.localeCompare(b.date)).at(-1)!.kg : START_WEIGHT;
  const [calcWeight, setCalcWeight] = useState<number>(latest);

  const b = bmr(calcWeight, HEIGHT, AGE, "m");
  const t = tdee(calcWeight, HEIGHT, AGE, "m", activity);
  const target = targetCalories(t, b, 500);
  const m = macros(target, GOAL_WEIGHT);

  // dnešní datum odvozené z indexu dne (new Date(number) je deterministické)
  const dayIndex = useDayIndex();
  const today = dayIndex != null ? new Date(dayIndex * 86400000).toISOString().slice(0, 10) : "";

  // formulář pro nový záznam (prázdné = použij dnešek)
  const [newDate, setNewDate] = useState("");
  const [newKg, setNewKg] = useState<string>("");
  const dateValue = newDate || today;

  function addEntry() {
    const kg = parseFloat(newKg.replace(",", "."));
    if (!kg || kg < 40 || kg > 200 || !dateValue) return;
    setLog((prev) => {
      const without = prev.filter((e) => e.date !== dateValue);
      return [...without, { date: dateValue, kg }].sort((a, b) => a.date.localeCompare(b.date));
    });
    setNewKg("");
  }

  function removeEntry(date: string) {
    setLog((prev) => prev.filter((e) => e.date !== date));
  }

  return (
    <div className="space-y-5">
      {/* Kalkulačka */}
      <div className="rounded-2xl border border-line bg-card p-4 shadow-sm">
        <h2 className="mb-1 text-base font-bold">Kalorie & makra pro recompo</h2>
        <p className="mb-4 text-sm text-ink-soft">
          Mírný deficit ~500 kcal a hodně bílkovin = hubneš tuk a přitom stavíš svaly. Bílkoviny počítám na cílových{" "}
          {GOAL_WEIGHT} kg.
        </p>

        <div className="mb-4 grid gap-3 sm:grid-cols-2">
          <label className="text-sm">
            <span className="mb-1 block font-medium text-ink-soft">Aktuální váha (kg)</span>
            <input
              type="number"
              value={calcWeight}
              onChange={(e) => setCalcWeight(parseFloat(e.target.value) || 0)}
              className="w-full rounded-xl border border-line bg-paper px-3 py-2 text-base outline-none focus:border-sky"
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium text-ink-soft">Aktivita (dle fáze plánu)</span>
            <select
              value={activity}
              onChange={(e) => setActivity(e.target.value as Activity)}
              className="w-full rounded-xl border border-line bg-paper px-3 py-2 text-base outline-none focus:border-sky"
            >
              {(Object.keys(ACTIVITY_FACTORS) as Activity[]).map((k) => (
                <option key={k} value={k}>
                  {ACTIVITY_FACTORS[k].label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Klidový výdej" value={`${b}`} unit="kcal" />
          <Stat label="Denní výdej" value={`${t}`} unit="kcal" />
          <Stat label="Cíl příjmu" value={`${target}`} unit="kcal" accent />
          <Stat label="Deficit" value={`~${t - target}`} unit="kcal/den" />
        </div>

        <div className="mt-3 grid grid-cols-3 gap-3">
          <Macro label="Bílkoviny" value={m.protein} color="bg-leaf" />
          <Macro label="Sacharidy" value={m.carbs} color="bg-sky" />
          <Macro label="Tuky" value={m.fat} color="bg-amber" />
        </div>
        <p className="mt-3 text-xs text-ink-soft">
          V dnech dlouhých jednotek deficit zmírni a přidej sacharidy — jsou palivo. Nehubni rychleji než ~0,7 kg/týden.
        </p>
      </div>

      {/* Graf váhy */}
      <WeightChart log={log} />

      {/* Přidání záznamu */}
      <div className="rounded-2xl border border-line bg-card p-4 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold">Zapsat váhu</h3>
        <div className="flex flex-wrap items-end gap-2">
          <label className="text-sm">
            <span className="mb-1 block text-xs font-medium text-ink-soft">Datum</span>
            <input
              type="date"
              value={dateValue}
              onChange={(e) => setNewDate(e.target.value)}
              className="rounded-xl border border-line bg-paper px-3 py-2 outline-none focus:border-sky"
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-xs font-medium text-ink-soft">Váha (kg)</span>
            <input
              type="number"
              inputMode="decimal"
              placeholder="např. 96,4"
              value={newKg}
              onChange={(e) => setNewKg(e.target.value)}
              className="w-28 rounded-xl border border-line bg-paper px-3 py-2 outline-none focus:border-sky"
            />
          </label>
          <button
            onClick={addEntry}
            className="rounded-xl bg-sky px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-600"
          >
            Uložit
          </button>
        </div>

        {log.length > 0 && (
          <ul className="mt-4 divide-y divide-line">
            {[...log]
              .sort((a, b) => b.date.localeCompare(a.date))
              .map((e) => (
                <li key={e.date} className="flex items-center justify-between py-2 text-sm">
                  <span className="text-ink-soft">{e.date}</span>
                  <span className="font-semibold">{e.kg} kg</span>
                  <button
                    onClick={() => removeEntry(e.date)}
                    className="text-xs text-ink-soft hover:text-marigold"
                    aria-label="Smazat"
                  >
                    smazat
                  </button>
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value, unit, accent }: { label: string; value: string; unit: string; accent?: boolean }) {
  return (
    <div className={`rounded-xl p-3 ${accent ? "bg-sky-050" : "bg-paper"}`}>
      <div className="text-xs text-ink-soft">{label}</div>
      <div className={`text-lg font-bold ${accent ? "text-sky-600" : ""}`}>{value}</div>
      <div className="text-[11px] text-ink-soft">{unit}</div>
    </div>
  );
}

function Macro({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-xl bg-paper p-3 text-center">
      <div className={`mx-auto mb-1 h-1.5 w-8 rounded-full ${color}`} />
      <div className="text-lg font-bold">{value} g</div>
      <div className="text-xs text-ink-soft">{label}</div>
    </div>
  );
}

function WeightChart({ log }: { log: WeightEntry[] }) {
  const proj = useMemo(() => weightProjection(), []);
  const W = 700;
  const H = 240;
  const padL = 34;
  const padB = 24;
  const padT = 12;
  const padR = 10;
  const minKg = 82;
  const maxKg = 100;

  const x = (week: number) => padL + (week / 24) * (W - padL - padR);
  const y = (kg: number) => padT + ((maxKg - kg) / (maxKg - minKg)) * (H - padT - padB);

  const projPath = proj.map((p, i) => `${i === 0 ? "M" : "L"}${x(p.week).toFixed(1)},${y(p.kg).toFixed(1)}`).join(" ");

  const points = [...log]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((e) => ({ wk: toWeekIndex(e.date), kg: e.kg }));
  const realPath = points.map((p, i) => `${i === 0 ? "M" : "L"}${x(p.wk).toFixed(1)},${y(p.kg).toFixed(1)}`).join(" ");

  return (
    <div className="rounded-2xl border border-line bg-card p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold">Křivka váhy 98 → 85 kg</h3>
        <div className="flex gap-3 text-xs text-ink-soft">
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-4 rounded-full border-2 border-dashed border-ink-soft" /> plán
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-4 rounded-full bg-sky" /> tvoje data
          </span>
        </div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Graf vývoje váhy">
        {/* mřížka */}
        {[85, 90, 95, 100].map((kg) => (
          <g key={kg}>
            <line x1={padL} y1={y(kg)} x2={W - padR} y2={y(kg)} stroke="#dde5f0" strokeWidth={1} />
            <text x={4} y={y(kg) + 4} fontSize={10} fill="#5b6b80">
              {kg}
            </text>
          </g>
        ))}
        {/* cílová linka 85 */}
        <line x1={padL} y1={y(85)} x2={W - padR} y2={y(85)} stroke="#1f9d55" strokeWidth={1.5} strokeDasharray="2 3" />
        {/* měsíce */}
        {[
          [0, "IX"],
          [5, "X"],
          [9, "XI"],
          [13, "XII"],
          [18, "I"],
          [23, "II"],
        ].map(([wk, lbl]) => (
          <text key={lbl as string} x={x(wk as number)} y={H - 6} fontSize={10} fill="#5b6b80" textAnchor="middle">
            {lbl}
          </text>
        ))}
        {/* plánovaná křivka */}
        <path d={projPath} fill="none" stroke="#9aa8bd" strokeWidth={2} strokeDasharray="5 4" />
        {/* reálná data */}
        {realPath && <path d={realPath} fill="none" stroke="#0071e3" strokeWidth={2.5} />}
        {points.map((p) => (
          <circle key={p.wk + "-" + p.kg} cx={x(p.wk)} cy={y(p.kg)} r={3.5} fill="#0071e3" />
        ))}
      </svg>
      {log.length === 0 && (
        <p className="mt-1 text-center text-xs text-ink-soft">
          Zatím žádná data — zapiš váhu níže a uvidíš, jak sedíš na plánované křivce.
        </p>
      )}
    </div>
  );
}
