// Termíny a revize — stav vůči dnešku.
// Lhůty se nevymýšlejí natvrdo: interval zadá majitel nebo ho převezme z protokolu
// a potvrzuje ho revizní technik (intervalConfirmed).

import type { Property, Reminder } from "./store";

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

// Pořadí v seznamech: nejdřív co hoří
export const DEADLINE_STATE_ORDER: Record<DeadlineState, number> = {
  OVERDUE: 0,
  SOON: 1,
  OK: 2,
  DONE: 3,
};

// Kolik dní předem upozornit, když to připomínka neříká jinak
export const DEFAULT_NOTIFY_DAYS = 30;

// Volby „Upozornit předem" (dny)
export const NOTIFY_DAYS_OPTIONS = [7, 14, 30, 60, 90] as const;

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

// --- Pomocné funkce pro zobrazení -------------------------------------------

export const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

// Dnešní datum v MÍSTNÍM čase jako YYYY-MM-DD (toISOString by vrátil UTC)
export function localIsoDate(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// YYYY-MM-DD → „12. října 2026" (místní datum; neplatné datum vrátí beze změny, nespadne)
export function formatDay(date?: string): string {
  if (!date) return "—";
  if (!ISO_DATE_RE.test(date)) return date;
  const d = new Date(`${date}T00:00:00`);
  if (Number.isNaN(d.getTime())) return date;
  return new Intl.DateTimeFormat("cs-CZ", { day: "numeric", month: "long", year: "numeric" }).format(d);
}

// YYYY-MM-DD + n dní (bez vlivu časového pásma)
export function addDays(date: string, days: number): string {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
}

// České skloňování podle počtu: 1 den / 2 dny / 5 dní
export function pluralCs(n: number, one: string, few: string, many: string): string {
  const a = Math.abs(n);
  if (a === 1) return one;
  if (a >= 2 && a <= 4) return few;
  return many;
}

function daysText(n: number) {
  return `${n} ${pluralCs(n, "den", "dny", "dní")}`;
}
function monthsText(n: number) {
  return `${n} ${pluralCs(n, "měsíc", "měsíce", "měsíců")}`;
}
function yearsText(n: number) {
  return `${n} ${pluralCs(n, "rok", "roky", "let")}`;
}

// Relativní text k termínu: „Po termínu o 3 dny", „Termín dnes", „Za 12 dní", „Za 5 měsíců"
export function relativeDueLabel(daysLeft: number): string {
  if (!Number.isFinite(daysLeft)) return "";
  if (daysLeft < 0) {
    const n = Math.abs(daysLeft);
    if (n <= 60) return `Po termínu o ${daysText(n)}`;
    if (n < 730) return `Po termínu o ${monthsText(Math.round(n / 30.44))}`;
    return `Po termínu o ${yearsText(Math.floor(n / 365))}`;
  }
  if (daysLeft === 0) return "Termín dnes";
  if (daysLeft === 1) return "Zítra";
  if (daysLeft <= 60) return `Za ${daysText(daysLeft)}`;
  if (daysLeft < 730) return `Za ${monthsText(Math.round(daysLeft / 30.44))}`;
  return `Za ${yearsText(Math.floor(daysLeft / 365))}`;
}

// „každých 12 měsíců", „každé 3 měsíce", „každý měsíc"
export function intervalLabel(months: number): string {
  if (months === 1) return "každý měsíc";
  const base =
    months >= 2 && months <= 4 ? `každé ${months} měsíce` : `každých ${months} měsíců`;
  if (months >= 24 && months % 12 === 0) return `${base} (${yearsText(months / 12)})`;
  return base;
}

// --- Termíny napříč nemovitostmi --------------------------------------------

export type DeadlineRow = {
  reminder: Reminder;
  property: Property;
  state: DeadlineState;
  daysLeft: number;
  elementName?: string; // jen když prvek v domě existuje
};

export function compareDeadlineRows(
  a: Pick<DeadlineRow, "state" | "reminder">,
  b: Pick<DeadlineRow, "state" | "reminder">,
): number {
  return (
    DEADLINE_STATE_ORDER[a.state] - DEADLINE_STATE_ORDER[b.state] ||
    (a.reminder.dueDate ?? "").localeCompare(b.reminder.dueDate ?? "")
  );
}

// Všechny termíny zadaných nemovitostí se stavem; seřazené (po termínu → blíží se → v pořádku → splněné)
export function collectDeadlines(
  properties: Property[],
  opts: { includeDone?: boolean; today?: Date } = {},
): DeadlineRow[] {
  const rows: DeadlineRow[] = [];
  for (const property of properties) {
    for (const reminder of property.reminders ?? []) {
      if (reminder.done && !opts.includeDone) continue;
      if (!reminder.dueDate) continue;
      const { state, daysLeft } = deadlineState(reminder, opts.today);
      const elementName = reminder.elementId
        ? property.elements?.find((e) => e.id === reminder.elementId)?.name
        : undefined;
      rows.push({ reminder, property, state, daysLeft, elementName });
    }
  }
  return rows.sort(compareDeadlineRows);
}

// Počty pro upozornění (jen nesplněné)
export function countDeadlines(properties: Property[], today?: Date) {
  let overdue = 0;
  let soon = 0;
  for (const row of collectDeadlines(properties, { today })) {
    if (row.state === "OVERDUE") overdue++;
    else if (row.state === "SOON") soon++;
  }
  return { overdue, soon };
}

// „2 termíny po termínu, 1 se blíží"
export function deadlineSummaryText({ overdue, soon }: { overdue: number; soon: number }): string {
  const parts: string[] = [];
  if (overdue > 0) {
    parts.push(`${overdue} ${pluralCs(overdue, "termín", "termíny", "termínů")} po termínu`);
  }
  if (soon > 0) {
    parts.push(
      overdue > 0
        ? `${soon} se blíží`
        : `${soon} ${pluralCs(soon, "termín se blíží", "termíny se blíží", "termínů se blíží")}`,
    );
  }
  return parts.length ? parts.join(", ") : "Žádný termín nehoří";
}
