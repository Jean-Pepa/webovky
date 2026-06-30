"use client";

import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { DonutChart, BarList } from "@/components/Charts";
import { CATEGORIES, catMeta, expenseStats } from "@/lib/expenses";
import { fmtCZK, fmtDate, todayISO } from "@/lib/format";
import { newId } from "@/lib/id";
import type { Trip, Expense, ExpenseCategory } from "@/lib/types";

export function Expenses({ trip, me }: { trip: Trip; me: string }) {
  const { dispatch } = useStore();
  const expenses = useMemo(
    () =>
      [...(trip.expenses ?? [])].sort((a, b) =>
        a.date !== b.date ? (a.date < b.date ? 1 : -1) : a.createdAt < b.createdAt ? 1 : -1,
      ),
    [trip.expenses],
  );
  const stats = useMemo(() => expenseStats(trip), [trip]);
  const carOptions = useMemo(
    () => Array.from(new Set((trip.expenses ?? []).map((e) => (e.car ?? "").trim()).filter(Boolean))),
    [trip.expenses],
  );

  return (
    <div className="space-y-5">
      <AddExpense trip={trip} me={me} carOptions={carOptions} />

      {/* souhrn */}
      <div className="grid grid-cols-3 gap-3">
        <Stat label="Celkem" value={fmtCZK(stats.total)} />
        <Stat label="Na osobu" value={fmtCZK(stats.perPerson)} hint={`${trip.members.length} lidí`} />
        <Stat label="Položek" value={String(stats.count)} />
      </div>

      {/* grafy */}
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="card p-4">
          <h3 className="mb-3 font-display text-base font-semibold">Podle kategorie</h3>
          <DonutChart data={stats.byCategory} />
        </div>
        <div className="card p-4">
          <h3 className="mb-3 font-display text-base font-semibold">Kdo kolik zaplatil</h3>
          <BarList items={stats.byPerson} empty="Zatím nikdo nic nezaplatil." />
          {stats.byCar.length > 0 && (
            <>
              <h3 className="mb-2 mt-4 font-display text-sm font-semibold text-ink-soft">Podle auta</h3>
              <BarList items={stats.byCar} />
            </>
          )}
        </div>
      </div>

      {/* vyrovnání */}
      {stats.count > 0 && (
        <div className="card p-4">
          <h3 className="font-display text-base font-semibold">Vyrovnání</h3>
          <p className="mb-3 text-xs text-ink-soft">Kdo komu má poslat, aby to bylo fér (rozpočítáno rovným dílem).</p>
          {stats.settlements.length === 0 ? (
            <p className="rounded-xl bg-free-soft p-3 text-sm text-free">🎉 Všichni jsou vyrovnaní.</p>
          ) : (
            <ul className="space-y-1.5">
              {stats.settlements.map((s, i) => (
                <li key={i} className="flex items-center gap-2 rounded-xl border border-black/[0.06] p-2.5 text-sm">
                  <span className="font-medium text-out">{s.from}</span>
                  <span className="text-ink-soft">→</span>
                  <span className="font-medium text-free">{s.to}</span>
                  <span className="ml-auto font-semibold tabular-nums">{fmtCZK(s.amount)}</span>
                </li>
              ))}
            </ul>
          )}

          {/* detail zůstatků */}
          <div className="mt-3 grid gap-1.5 border-t border-black/[0.06] pt-3 text-xs">
            {stats.balances.map((b) => (
              <div key={b.person} className="flex items-center gap-2">
                <span className="w-20 truncate font-medium">{b.person}</span>
                <span className="text-ink-soft">zaplatil {fmtCZK(b.paid)}</span>
                <span
                  className={`ml-auto font-semibold tabular-nums ${b.balance > 0.5 ? "text-free" : b.balance < -0.5 ? "text-out" : "text-ink-soft"}`}
                >
                  {b.balance > 0.5 ? `dostane ${fmtCZK(b.balance)}` : b.balance < -0.5 ? `dluží ${fmtCZK(-b.balance)}` : "vyrovnán"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* seznam útrat */}
      <div className="card p-4">
        <h3 className="mb-2 font-display text-base font-semibold">Útraty ({expenses.length})</h3>
        {expenses.length === 0 ? (
          <p className="text-sm text-ink-soft">Zatím žádná útrata. Přidej první nahoře.</p>
        ) : (
          <ul className="divide-y divide-black/[0.06]">
            {expenses.map((e) => {
              const c = catMeta(e.category);
              return (
                <li key={e.id} className="flex items-center gap-3 py-2.5">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-lg" style={{ background: `${c.color}1a` }}>
                    {c.emoji}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-medium">{c.label}</span>
                      {e.car && <span className="chip bg-paper2 text-[10px]">🚗 {e.car}</span>}
                    </div>
                    <p className="truncate text-xs text-ink-soft">
                      {e.paidBy} · {fmtDate(e.date)}
                      {e.note ? ` · ${e.note}` : ""}
                    </p>
                  </div>
                  <span className="shrink-0 font-semibold tabular-nums">{fmtCZK(e.amount)}</span>
                  <button
                    className="btn-ghost shrink-0 px-2 py-1 text-xs"
                    onClick={() => dispatch({ type: "removeExpense", tripId: trip.id, expenseId: e.id })}
                    title="Smazat"
                  >
                    ✕
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="card p-3 text-center">
      <p className="text-[11px] text-ink-soft">{label}</p>
      <p className="font-display text-lg font-semibold tabular-nums">{value}</p>
      {hint && <p className="text-[10px] text-ink-soft">{hint}</p>}
    </div>
  );
}

function AddExpense({ trip, me, carOptions }: { trip: Trip; me: string; carOptions: string[] }) {
  const { dispatch } = useStore();
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<ExpenseCategory>("benzin");
  const [paidBy, setPaidBy] = useState(me);
  const [car, setCar] = useState("");
  const [date, setDate] = useState(todayISO());
  const [note, setNote] = useState("");

  const value = Math.round(Number(amount.replace(",", ".")));
  const valid = Number.isFinite(value) && value > 0;

  async function add() {
    if (!valid) return;
    const expense: Expense = {
      id: newId(),
      amount: value,
      category,
      paidBy: paidBy || me,
      car: car.trim() || undefined,
      note: note.trim() || undefined,
      date,
      createdAt: new Date().toISOString(),
    };
    await dispatch({ type: "addExpense", tripId: trip.id, expense });
    setAmount("");
    setCar("");
    setNote("");
  }

  return (
    <div className="card space-y-3 p-4">
      <h3 className="font-display text-base font-semibold">+ Přidat útratu</h3>

      {/* kategorie jako chipy */}
      <div className="flex flex-wrap gap-1.5">
        {CATEGORIES.map((c) => (
          <button
            key={c.key}
            onClick={() => setCategory(c.key)}
            className={`chip border ${category === c.key ? "text-ink" : "border-transparent text-ink-soft"}`}
            style={category === c.key ? { borderColor: c.color, background: `${c.color}1a` } : undefined}
          >
            {c.emoji} {c.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="label">Částka (Kč)</label>
          <input
            className="input"
            type="number"
            inputMode="decimal"
            min={0}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="např. 850"
          />
        </div>
        <div>
          <label className="label">Zaplatil</label>
          <select className="input" value={paidBy} onChange={(e) => setPaidBy(e.target.value)}>
            {trip.members.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="label">Auto (nepovinné)</label>
          <input
            className="input"
            list="dovca-cars"
            value={car}
            onChange={(e) => setCar(e.target.value)}
            placeholder="např. Kubova Octavia"
          />
          <datalist id="dovca-cars">
            {carOptions.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>
        <div>
          <label className="label">Datum</label>
          <input type="date" className="input" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
      </div>

      <div>
        <label className="label">Poznámka (nepovinné)</label>
        <input className="input" value={note} onChange={(e) => setNote(e.target.value)} placeholder="třeba tankování u Lince" />
      </div>

      <button className="btn-primary w-full" onClick={add} disabled={!valid}>
        Přidat útratu
      </button>
    </div>
  );
}
