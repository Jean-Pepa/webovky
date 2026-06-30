import type { Trip, Expense, ExpenseCategory } from "./types";

// Kategorie nákladů na cestu — pořadí, popisek, emoji a barva (pro grafy).
export const CATEGORIES: { key: ExpenseCategory; label: string; emoji: string; color: string }[] = [
  { key: "benzin", label: "Benzín", emoji: "⛽", color: "#ef7d34" },
  { key: "myto", label: "Dálnice / mýtné", emoji: "🛣️", color: "#0c7e8e" },
  { key: "parkovne", label: "Parkovné", emoji: "🅿️", color: "#8b5cf6" },
  { key: "ubytovani", label: "Ubytování", emoji: "🛏️", color: "#2faa57" },
  { key: "jidlo", label: "Jídlo & pití", emoji: "🍽️", color: "#df4b56" },
  { key: "ostatni", label: "Ostatní", emoji: "🧾", color: "#94a3b8" },
];

const CAT_MAP: Record<ExpenseCategory, (typeof CATEGORIES)[number]> = CATEGORIES.reduce(
  (acc, c) => {
    acc[c.key] = c;
    return acc;
  },
  {} as Record<ExpenseCategory, (typeof CATEGORIES)[number]>,
);

export function catMeta(key: ExpenseCategory) {
  return CAT_MAP[key] ?? CATEGORIES[CATEGORIES.length - 1];
}

export interface Slice {
  label: string;
  value: number;
  color: string;
}

export interface Balance {
  person: string;
  paid: number; // kolik dotyčný zaplatil
  share: number; // jeho spravedlivý podíl
  balance: number; // paid - share (kladné = má dostat, záporné = dluží)
}

export interface Settlement {
  from: string; // kdo platí
  to: string; // komu
  amount: number;
}

export interface ExpenseStats {
  total: number;
  count: number;
  perPerson: number; // spravedlivý podíl na osobu
  byCategory: Slice[]; // pro koláč
  byPerson: Slice[]; // kdo kolik zaplatil (pro sloupce)
  byCar: Slice[]; // součet po autech (pokud jsou vyplněná)
  balances: Balance[];
  settlements: Settlement[]; // kdo komu kolik pošle, aby byli vyrovnaní
}

function sum(list: number[]): number {
  return list.reduce((s, n) => s + (Number.isFinite(n) ? n : 0), 0);
}

// Greedy vyrovnání: dlužníky (záporný zůstatek) postupně páruje s věřiteli.
function settle(balances: Balance[]): Settlement[] {
  const debtors = balances
    .filter((b) => b.balance < -0.5)
    .map((b) => ({ person: b.person, amt: -b.balance }))
    .sort((a, b) => b.amt - a.amt);
  const creditors = balances
    .filter((b) => b.balance > 0.5)
    .map((b) => ({ person: b.person, amt: b.balance }))
    .sort((a, b) => b.amt - a.amt);

  const out: Settlement[] = [];
  let i = 0;
  let j = 0;
  let guard = 0;
  while (i < debtors.length && j < creditors.length && guard < 1000) {
    guard++;
    const pay = Math.min(debtors[i].amt, creditors[j].amt);
    if (pay > 0.5) {
      out.push({ from: debtors[i].person, to: creditors[j].person, amount: Math.round(pay) });
    }
    debtors[i].amt -= pay;
    creditors[j].amt -= pay;
    if (debtors[i].amt <= 0.5) i++;
    if (creditors[j].amt <= 0.5) j++;
  }
  return out;
}

function groupSlices(
  expenses: Expense[],
  keyOf: (e: Expense) => string,
  colorOf: (key: string) => string,
): Slice[] {
  const map = new Map<string, number>();
  for (const e of expenses) map.set(keyOf(e), (map.get(keyOf(e)) ?? 0) + e.amount);
  return Array.from(map.entries())
    .map(([label, value]) => ({ label, value, color: colorOf(label) }))
    .sort((a, b) => b.value - a.value);
}

// Jednoduchá paleta pro osoby/auta (cyklí se).
const PALETTE = ["#0c7e8e", "#ef7d34", "#8b5cf6", "#2faa57", "#df4b56", "#129dab", "#e0a313", "#6d7c84"];
function paletteColor(i: number): string {
  return PALETTE[i % PALETTE.length];
}

export function expenseStats(trip: Trip): ExpenseStats {
  const expenses = trip.expenses ?? [];
  const members = trip.members.length ? trip.members : Array.from(new Set(expenses.map((e) => e.paidBy)));
  const total = sum(expenses.map((e) => e.amount));
  const perPerson = members.length ? total / members.length : 0;

  // po kategoriích (v pevném pořadí kategorií, jen neprázdné)
  const byCategory: Slice[] = CATEGORIES.map((c) => ({
    label: c.label,
    value: sum(expenses.filter((e) => e.category === c.key).map((e) => e.amount)),
    color: c.color,
  })).filter((s) => s.value > 0);

  // kdo kolik zaplatil
  const paidByPerson = new Map<string, number>();
  members.forEach((m) => paidByPerson.set(m, 0));
  for (const e of expenses) paidByPerson.set(e.paidBy, (paidByPerson.get(e.paidBy) ?? 0) + e.amount);
  const byPerson: Slice[] = Array.from(paidByPerson.entries())
    .map(([label, value], i) => ({ label, value, color: paletteColor(i) }))
    .sort((a, b) => b.value - a.value);

  // po autech (jen vyplněná)
  const withCar = expenses.filter((e) => (e.car ?? "").trim() !== "");
  const byCar = groupSlices(
    withCar,
    (e) => e.car!.trim(),
    () => "#0c7e8e",
  ).map((s, i) => ({ ...s, color: paletteColor(i) }));

  // zůstatky + vyrovnání
  const balances: Balance[] = members.map((m) => {
    const paid = paidByPerson.get(m) ?? 0;
    return { person: m, paid, share: perPerson, balance: paid - perPerson };
  });
  const settlements = settle(balances);

  return {
    total,
    count: expenses.length,
    perPerson,
    byCategory,
    byPerson,
    byCar,
    balances,
    settlements,
  };
}
