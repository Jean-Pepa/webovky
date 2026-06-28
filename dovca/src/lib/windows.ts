import type { Trip } from "./types";
import { enumerateDates, addDays } from "./format";

export type DayStatus = "free" | "maybe" | "out";

// Stav jednoho člověka v jednom dni. Chybějící záznam = „můžu".
export function statusOf(trip: Trip, person: string, date: string): DayStatus {
  const s = trip.availability[person]?.[date];
  return s === "out" ? "out" : s === "maybe" ? "maybe" : "free";
}

export interface DayStat {
  date: string;
  free: number;
  maybe: number;
  out: number;
  total: number;
}

// Pro každý den horizontu spočítá, kolik členů může / možná / nemůže.
// Vrací mapu datum → statistika (pro heatmapu).
export function dayStats(trip: Trip): Map<string, DayStat> {
  const days = enumerateDates(trip.horizonStart, trip.horizonEnd);
  const total = trip.members.length;
  const map = new Map<string, DayStat>();
  for (const date of days) {
    let free = 0, maybe = 0, out = 0;
    for (const m of trip.members) {
      const s = statusOf(trip, m, date);
      if (s === "out") out++;
      else if (s === "maybe") maybe++;
      else free++;
    }
    map.set(date, { date, free, maybe, out, total });
  }
  return map;
}

export interface WindowResult {
  start: string;
  end: string;
  can: string[]; // můžou (v okně nemají jediný „nemůžu" den)
  hardCan: string[]; // úplně volní (ani jeden „možná")
  shaky: string[]; // můžou, ale mají v okně aspoň jeden „možná"
  cant: string[]; // nemůžou (mají v okně „nemůžu")
}

// Najde a seřadí okna délky trip.lengthDays, kde může aspoň trip.minPeople lidí.
// Řazení: nejvíc „můžou", pak nejvíc úplně volných, pak dřívější termín.
export function rankWindows(trip: Trip): WindowResult[] {
  const days = enumerateDates(trip.horizonStart, trip.horizonEnd);
  const n = days.length;
  const L = Math.max(1, Math.floor(trip.lengthDays || 1));
  if (n < L || trip.members.length === 0) return [];

  // Prefixové součty „out" a „maybe" dnů pro každého člena → O(1) dotaz na okno.
  const idx = new Map<string, number>();
  days.forEach((d, i) => idx.set(d, i));

  const prefix: Record<string, { out: number[]; maybe: number[] }> = {};
  for (const m of trip.members) {
    const out = new Array(n + 1).fill(0);
    const maybe = new Array(n + 1).fill(0);
    for (let i = 0; i < n; i++) {
      const s = statusOf(trip, m, days[i]);
      out[i + 1] = out[i] + (s === "out" ? 1 : 0);
      maybe[i + 1] = maybe[i] + (s === "maybe" ? 1 : 0);
    }
    prefix[m] = { out, maybe };
  }

  const results: WindowResult[] = [];
  const minPeople = Math.max(1, trip.minPeople || 1);

  for (let a = 0; a + L <= n; a++) {
    const can: string[] = [];
    const hardCan: string[] = [];
    const shaky: string[] = [];
    const cant: string[] = [];
    for (const m of trip.members) {
      const outCnt = prefix[m].out[a + L] - prefix[m].out[a];
      const maybeCnt = prefix[m].maybe[a + L] - prefix[m].maybe[a];
      if (outCnt > 0) {
        cant.push(m);
      } else {
        can.push(m);
        if (maybeCnt > 0) shaky.push(m);
        else hardCan.push(m);
      }
    }
    if (can.length >= minPeople) {
      results.push({ start: days[a], end: days[a + L - 1], can, hardCan, shaky, cant });
    }
  }

  results.sort((x, y) => {
    if (y.can.length !== x.can.length) return y.can.length - x.can.length;
    if (y.hardCan.length !== x.hardCan.length) return y.hardCan.length - x.hardCan.length;
    return x.start < y.start ? -1 : x.start > y.start ? 1 : 0;
  });
  return results;
}

// Z seřazených oken vybere greedy ta, která se nepřekrývají — aby „top tipy"
// nabízely opravdu různé termíny, ne 7 skoro stejných.
export function topDistinctWindows(ranked: WindowResult[], limit = 6): WindowResult[] {
  const picked: WindowResult[] = [];
  for (const w of ranked) {
    const overlaps = picked.some((p) => !(w.end < p.start || w.start > p.end));
    if (!overlaps) picked.push(w);
    if (picked.length >= limit) break;
  }
  return picked;
}

// Pomůcka: konec okna z začátku + délky.
export function windowEnd(start: string, lengthDays: number): string {
  return addDays(start, Math.max(1, lengthDays) - 1);
}
