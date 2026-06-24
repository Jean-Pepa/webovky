"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { isAdmin } from "@/lib/admin";
import { activeYearId } from "@/lib/years";

// Přepínač ročníků — každý rok Mařeny je samostatný. Nový ročník může převzít
// kontakty a program z aktuálního (hladké předání mezi týmy).
export function YearSwitcher() {
  const { db, currentYear, me, setCurrentYearId, dispatch } = useStore();
  const [adding, setAdding] = useState(false);
  const [newYear, setNewYear] = useState(String(new Date().getFullYear() + 1));
  const [carry, setCarry] = useState(true);

  if (!db) return null;
  const admin = isAdmin(me);
  const activeId = activeYearId(db);

  async function add() {
    const id = newYear.trim();
    if (!id) return;
    await dispatch({ type: "createYear", id, label: `Mařena ${id}`, copyFromYearId: carry ? currentYear?.id : undefined });
    setCurrentYearId(id);
    setAdding(false);
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={currentYear?.id ?? ""}
        onChange={(e) => setCurrentYearId(e.target.value)}
        className="rounded-full border border-ink/15 bg-white px-3 py-1.5 text-sm font-semibold text-ink outline-none focus:border-marigold-500"
        aria-label="Vybrat ročník"
      >
        {db.years.map((y) => (
          <option key={y.id} value={y.id}>
            {y.label}
            {y.id !== activeId ? " 🔒" : ""}
          </option>
        ))}
      </select>

      {!admin ? null : adding ? (
        <span className="flex max-w-[calc(100vw-2rem)] flex-wrap items-center gap-2 rounded-2xl border border-ink/15 bg-white px-2.5 py-1.5">
          <input
            value={newYear}
            onChange={(e) => setNewYear(e.target.value)}
            className="w-16 rounded-full border border-ink/15 px-2.5 py-1 text-sm"
            placeholder="2026"
            autoFocus
          />
          <label className="flex items-center gap-1 text-xs text-ink-soft" title="Přenese kontakty a seznam programu (stav domlouvání se vynuluje)">
            <input type="checkbox" checked={carry} onChange={(e) => setCarry(e.target.checked)} className="accent-marigold-600" />
            převzít kontakty a program
          </label>
          <button className="btn-primary px-3 py-1 text-xs" onClick={add}>
            Založit
          </button>
          <button className="btn-ghost px-2 py-1 text-xs" onClick={() => setAdding(false)}>
            ✕
          </button>
        </span>
      ) : (
        <button className="btn-ghost px-2.5 py-1.5 text-sm" onClick={() => setAdding(true)} title="Založit nový ročník">
          + ročník
        </button>
      )}
    </div>
  );
}
