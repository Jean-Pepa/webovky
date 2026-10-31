// Rozložení 12dírkové chromatické harmoniky (solo ladění) a stavba cvičebních sekvencí.
//
// Harmonika v C má rozsah C4–D7, každá skupina 4 dírek = 1 oktáva:
//   foukání  C E G C   tah  D F A B   (šoupátko = +1 půltón)
// Poslední (12.) dírka dává při tahu se šoupátkem D místo C.

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

export const HOLES = 12;
export const HOLES_RANGE = "C4 – D7";

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

export function buildLayout(tuningId: string, harpKey: string): Hole[] {
  const t = TUNINGS.find((x) => x.id === tuningId) ?? TUNINGS[0];
  const shift = harpShift(harpKey);
  const out: Hole[] = [];
  for (let i = 0; i < HOLES; i++) {
    const g = Math.floor(i / 4);
    const p = i % 4;
    const base = 60 + 12 * g + shift;
    const blow = base + t.blow[p];
    const draw = base + t.draw[p];
    const top = i === HOLES - 1 && t.id === "solo";
    out.push({
      hole: i + 1,
      group: g,
      blowSlide: blow + 1,
      blow,
      draw,
      drawSlide: draw + (top ? 3 : 1),
    });
  }
  return out;
}

/** Nejnižší a nejvyšší tón harmoniky. */
export function layoutRange(layout: Hole[]): [number, number] {
  let lo = Infinity;
  let hi = -Infinity;
  for (const h of layout)
    for (const a of ROWS) {
      lo = Math.min(lo, h[a]);
      hi = Math.max(hi, h[a]);
    }
  return [lo, hi];
}

export type Pos = { hole: number; action: Action; midi: number };
export const posKey = (p: { hole: number; action: Action }) => `${p.hole}-${p.action}`;
export const isSlide = (a: Action) => a === "blowSlide" || a === "drawSlide";

/** Zápis tabulatury: 4 = foukání, -4 = tah, < = se šoupátkem. */
export function tabOf(p: { hole: number; action: Action }): string {
  const draw = p.action === "draw" || p.action === "drawSlide";
  return `${isSlide(p.action) ? "<" : ""}${draw ? "-" : ""}${p.hole}`;
}

/** Všechny polohy (dírka + akce) pro daný tón. */
export function positionsOf(layout: Hole[], midi: number): Pos[] {
  const out: Pos[] = [];
  for (const h of layout) for (const a of ROWS) if (h[a] === midi) out.push({ hole: h.hole, action: a, midi });
  return out;
}

/**
 * Prstoklad pro řadu tónů: pro každý tón nejpohodlnější poloha — bez šoupátka,
 * co nejblíž předchozí dírce. Tón mimo rozsah dostane null.
 */
export function choosePositions(
  layout: Hole[],
  midis: (number | null)[],
  start = 1,
  end = HOLES,
): (Pos | null)[] {
  const cands = new Map<number, Pos[]>();
  for (const h of layout) {
    if (h.hole < start || h.hole > end) continue;
    for (const a of ROWS) {
      const list = cands.get(h[a]) ?? [];
      list.push({ hole: h.hole, action: a, midi: h[a] });
      cands.set(h[a], list);
    }
  }
  let prev: number | null = null;
  return midis.map((midi, i) => {
    if (midi === null) return null;
    const list = cands.get(midi);
    if (!list) return null;
    let j = i + 1;
    while (j < midis.length && midis[j] === null) j++;
    const next = midis[j];
    let k = i - 1;
    while (k >= 0 && midis[k] === null) k--;
    const before = k >= 0 ? midis[k] : null;
    const ascending =
      next !== undefined && next !== null ? next > midi : before !== null && before !== undefined ? midi > before : true;
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

export type Direction = "forward" | "reverse" | "both";

/**
 * Sekvence pro přehrávání stupnice/arpeggia: všechny tóny v rozsahu dírek,
 * vzestupně / sestupně / tam i zpět, opakovaně.
 */
export function buildSequence(
  layout: Hole[],
  pcs: Set<number>,
  start: number,
  end: number,
  direction: Direction,
  repetitions: number,
): Pos[] {
  const set = new Set<number>();
  for (const h of layout) {
    if (h.hole < start || h.hole > end) continue;
    for (const a of ROWS) if (pcs.has(mod12(h[a]))) set.add(h[a]);
  }
  const up = [...set].sort((a, b) => a - b);
  if (!up.length) return [];
  const down = [...up].reverse();
  const one = direction === "forward" ? up : direction === "reverse" ? down : up.concat(down.slice(1));
  const full: number[] = [];
  const reps = Math.max(1, repetitions);
  for (let r = 0; r < reps; r++) {
    if (r > 0 && direction === "both" && one.length > 1) full.push(...one.slice(1));
    else full.push(...one);
  }
  return choosePositions(layout, full, start, end).filter((p): p is Pos => p !== null);
}
