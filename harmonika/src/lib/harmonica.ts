// Rozložení chromatické harmoniky (solo ladění) a stavba cvičebních sekvencí.
//
// Vzor 16dírkové harmoniky v C (C3–D7), každá skupina 4 dírek = 1 oktáva:
//   foukání  C E G C   tah  D F A B   (šoupátko = +1 půltón)
// Poslední dírka má při tahu se šoupátkem D místo C (12, 14 i 16 dírek končí na D7).
// 14 dírek = 16 bez dvou nejnižších (G3–D7), 12 dírek = C4–D7, 10 dírek (Chrometta) = G3–Db6.

import { HARP_KEYS, mod12 } from "./music";

export type Action = "blowSlide" | "blow" | "draw" | "drawSlide";
export const ROWS: Action[] = ["blowSlide", "blow", "draw", "drawSlide"];

export const ACTION_LABEL: Record<Action, string> = {
  blowSlide: "Blow + slide",
  blow: "Blow",
  draw: "Draw",
  drawSlide: "Draw + slide",
};

export type Tuning = { id: string; name: string; blow: number[]; draw: number[] };

export const TUNINGS: Tuning[] = [
  { id: "solo", name: "Solo (Standard)", blow: [0, 4, 7, 12], draw: [2, 5, 9, 11] },
  { id: "diminished", name: "Diminished", blow: [0, 3, 6, 9], draw: [2, 5, 8, 11] },
];

export const HOLE_OPTIONS = [10, 12, 14, 16] as const;
export type Holes = (typeof HOLE_OPTIONS)[number];

const CONFIG: Record<number, { from: number; to: number; topD: boolean; range: string }> = {
  16: { from: 0, to: 15, topD: true, range: "C3 – D7" },
  14: { from: 2, to: 15, topD: true, range: "G3 – D7" },
  12: { from: 4, to: 15, topD: true, range: "C4 – D7" },
  10: { from: 2, to: 11, topD: false, range: "G3 – Db6" },
};

export const holesRange = (holes: number) => CONFIG[holes]?.range ?? "";

export type Hole = {
  hole: number;
  /** Oktávová skupina (kvůli svislým oddělovačům). */
  group: number;
  blowSlide: number;
  blow: number;
  draw: number;
  drawSlide: number;
};

export function harpShift(harpKey: string): number {
  return HARP_KEYS.find((k) => k.name === harpKey)?.shift ?? 0;
}

export function buildLayout(holes: number, tuningId: string, harpKey: string): Hole[] {
  const t = TUNINGS.find((x) => x.id === tuningId) ?? TUNINGS[0];
  const cfg = CONFIG[holes] ?? CONFIG[12];
  const shift = harpShift(harpKey);
  const out: Hole[] = [];
  for (let m = cfg.from; m <= cfg.to; m++) {
    const g = Math.floor(m / 4);
    const p = m % 4;
    const base = 48 + 12 * g + shift;
    const blow = base + t.blow[p];
    const draw = base + t.draw[p];
    const top = m === cfg.to && cfg.topD && t.id === "solo";
    out.push({
      hole: m - cfg.from + 1,
      group: g,
      blowSlide: blow + 1,
      blow,
      draw,
      drawSlide: draw + (top ? 3 : 1),
    });
  }
  return out;
}

export type Pos = { hole: number; action: Action; midi: number };
export const posKey = (p: { hole: number; action: Action }) => `${p.hole}-${p.action}`;
const isSlide = (a: Action) => a === "blowSlide" || a === "drawSlide";

/** Všechny polohy (dírka + akce) pro daný tón. */
export function positionsOf(layout: Hole[], midi: number): Pos[] {
  const out: Pos[] = [];
  for (const h of layout) for (const a of ROWS) if (h[a] === midi) out.push({ hole: h.hole, action: a, midi });
  return out;
}

export type Direction = "forward" | "reverse" | "both";

/**
 * Sekvence pro přehrávání: všechny tóny stupnice/arpeggia v rozsahu dírek,
 * vzestupně / sestupně / tam i zpět, opakovaně. Pro každý tón se vybere
 * nejpohodlnější poloha (bez šoupátka, co nejblíž předchozí dírce).
 */
export function buildSequence(
  layout: Hole[],
  pcs: Set<number>,
  start: number,
  end: number,
  direction: Direction,
  repetitions: number,
): Pos[] {
  const cands = new Map<number, Pos[]>();
  for (const h of layout) {
    if (h.hole < start || h.hole > end) continue;
    for (const a of ROWS) {
      const midi = h[a];
      if (!pcs.has(mod12(midi))) continue;
      const list = cands.get(midi) ?? [];
      list.push({ hole: h.hole, action: a, midi });
      cands.set(midi, list);
    }
  }
  const up = [...cands.keys()].sort((a, b) => a - b);
  if (!up.length) return [];
  const down = [...up].reverse();
  const one = direction === "forward" ? up : direction === "reverse" ? down : up.concat(down.slice(1));
  const full: number[] = [];
  const reps = Math.max(1, repetitions);
  for (let r = 0; r < reps; r++) {
    if (r > 0 && direction === "both" && one.length > 1) full.push(...one.slice(1));
    else full.push(...one);
  }

  let prev: number | null = null;
  return full.map((midi, i) => {
    const list = cands.get(midi)!;
    const next = full[i + 1];
    const ascending = next !== undefined ? next > midi : i > 0 ? midi > full[i - 1] : true;
    let best = list[0];
    let bestScore = Infinity;
    for (const c of list) {
      let score = isSlide(c.action) ? 100 : 0;
      if (prev === null) score += ascending ? c.hole : -c.hole;
      else score += Math.abs(c.hole - prev) * 2 + (ascending ? c.hole : -c.hole) * 0.01;
      if (score < bestScore) {
        bestScore = score;
        best = c;
      }
    }
    prev = best.hole;
    return best;
  });
}
