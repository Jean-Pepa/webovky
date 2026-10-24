// Termíny a revize — stav vůči dnešku.
// Lhůty se nevymýšlejí natvrdo: interval zadá majitel nebo ho převezme z protokolu
// a potvrzuje ho revizní technik (intervalConfirmed).

import type { Reminder } from "./store";

export type DeadlineState = "OK" | "SOON" | "OVERDUE" | "DONE";

export const DEADLINE_STATE_LABELS: Record<DeadlineState, string> = {
  OK: "V pořádku",
  SOON: "Blíží se",
  OVERDUE: "Po termínu",
  DONE: "Splněno",
};

export const DEADLINE_STATE_COLORS = {
  OK: "emerald",
  SOON: "amber",
  OVERDUE: "red",
  DONE: "gray",
} as const;

// Kolik dní předem upozornit, když to připomínka neříká jinak
export const DEFAULT_NOTIFY_DAYS = 30;

function startOfToday(today?: Date): Date {
  const d = today ? new Date(today) : new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export function daysUntil(date: string, today?: Date): number {
  const due = new Date(`${date}T00:00:00`);
  return Math.round((due.getTime() - startOfToday(today).getTime()) / 86_400_000);
}

export function deadlineState(
  r: Pick<Reminder, "dueDate" | "done" | "notifyDaysBefore">,
  today?: Date,
): { state: DeadlineState; daysLeft: number } {
  const daysLeft = daysUntil(r.dueDate, today);
  if (r.done) return { state: "DONE", daysLeft };
  if (daysLeft < 0) return { state: "OVERDUE", daysLeft };
  if (daysLeft <= (r.notifyDaysBefore ?? DEFAULT_NOTIFY_DAYS)) return { state: "SOON", daysLeft };
  return { state: "OK", daysLeft };
}

// YYYY-MM-DD + n měsíců (31. 1. + 1 měsíc = 28./29. 2.)
export function addMonths(date: string, months: number): string {
  const [y, m, d] = date.split("-").map(Number);
  const target = new Date(Date.UTC(y, m - 1 + months, 1));
  const lastDay = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)).getUTCDate();
  target.setUTCDate(Math.min(d, lastDay));
  return target.toISOString().slice(0, 10);
}
