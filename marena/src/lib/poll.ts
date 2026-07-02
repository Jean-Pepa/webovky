import type { Poll } from "./types";

// Anketa je uzavřená buď ručně (closed), nebo když jí vypršel časový limit.
export function isPollClosed(poll: Poll, nowMs: number = Date.now()): boolean {
  return poll.closed || (!!poll.closesAt && Date.parse(poll.closesAt) <= nowMs);
}

// Rychlé volby délky ankety (v hodinách).
export const DEADLINE_PRESETS: { label: string; h: number }[] = [
  { label: "1 h", h: 1 },
  { label: "6 h", h: 6 },
  { label: "12 h", h: 12 },
  { label: "1 den", h: 24 },
  { label: "3 dny", h: 72 },
  { label: "týden", h: 168 },
];

export function nowPlusHours(h: number): string {
  return new Date(Date.now() + h * 3600 * 1000).toISOString();
}

// Kolik zbývá do uzavření — lidsky. Vrátí null, když už je po termínu.
export function formatRemaining(closesAt: string, nowMs: number = Date.now()): string | null {
  const diff = Date.parse(closesAt) - nowMs;
  if (diff <= 0) return null;
  const totalMin = Math.floor(diff / 60000);
  const days = Math.floor(totalMin / 1440);
  const hours = Math.floor((totalMin % 1440) / 60);
  const mins = totalMin % 60;
  const dW = (n: number) => (n === 1 ? "den" : n >= 2 && n <= 4 ? "dny" : "dní");
  if (days > 0) return `${days} ${dW(days)}${hours > 0 ? ` ${hours} h` : ""}`;
  if (hours > 0) return `${hours} h${mins > 0 ? ` ${mins} min` : ""}`;
  if (mins > 0) return `${mins} min`;
  return "< 1 min";
}

// Převod mezi ISO a hodnotou pro <input type="datetime-local"> (lokální čas).
export function isoToLocalInput(iso: string): string {
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

export function localInputToIso(v: string): string | undefined {
  if (!v) return undefined;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
}
