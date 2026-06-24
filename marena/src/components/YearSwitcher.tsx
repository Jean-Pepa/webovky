"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";

// Přepínač ročníků — každý rok Mařeny je samostatný (vlastní tým, nástěnka,
// hlasování, kalendář i úkoly). Umožní i založit nový ročník.
export function YearSwitcher() {
  const { db, currentYear, setCurrentYearId, dispatch } = useStore();
  const [adding, setAdding] = useState(false);
  const [newYear, setNewYear] = useState(String(new Date().getFullYear() + 1));

  if (!db) return null;

  async function add() {
    const id = newYear.trim();
    if (!id) return;
    await dispatch({ type: "createYear", id, label: `Mařena ${id}` });
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
          </option>
        ))}
      </select>

      {adding ? (
        <span className="flex items-center gap-1">
          <input
            value={newYear}
            onChange={(e) => setNewYear(e.target.value)}
            className="w-20 rounded-full border border-ink/15 px-3 py-1.5 text-sm"
            placeholder="2026"
            autoFocus
          />
          <button className="btn-primary px-3 py-1.5 text-xs" onClick={add}>
            Přidat
          </button>
          <button className="btn-ghost px-2 py-1 text-xs" onClick={() => setAdding(false)}>
            ✕
          </button>
        </span>
      ) : (
        <button
          className="btn-ghost px-2.5 py-1.5 text-sm"
          onClick={() => setAdding(true)}
          title="Založit nový ročník"
        >
          + ročník
        </button>
      )}
    </div>
  );
}
