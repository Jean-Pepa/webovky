"use client";

import { useState } from "react";
import { EXERCISES, GROUPS, type Group } from "@/lib/exercises";

export default function ExercisesView() {
  const [filter, setFilter] = useState<Group | "all">("all");
  const shown = filter === "all" ? EXERCISES : EXERCISES.filter((e) => e.group === filter);

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-line bg-card p-4 shadow-sm">
        <h2 className="mb-1 text-base font-bold">Zásobník cviků pro běžkaře bez sněhu</h2>
        <p className="text-sm text-ink-soft">
          Vybírej podle toho, co je v plánu na daný den (Síla A/B, imitace). Technika vždy před vahou. U silových 2–3
          série, poslední blízko selhání.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Chip label="Vše" active={filter === "all"} onClick={() => setFilter("all")} />
        {GROUPS.map((g) => (
          <Chip key={g.key} label={g.label} active={filter === g.key} onClick={() => setFilter(g.key)} />
        ))}
      </div>

      {(filter === "all" ? GROUPS : GROUPS.filter((g) => g.key === filter)).map((g) => {
        const items = shown.filter((e) => e.group === g.key);
        if (!items.length) return null;
        return (
          <section key={g.key}>
            <div className="mb-2 flex items-baseline gap-2">
              <h3 className="text-sm font-bold">{g.label}</h3>
              <span className="text-xs text-ink-soft">{g.note}</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {items.map((ex) => (
                <div key={ex.name} className="rounded-2xl border border-line bg-card p-4 shadow-sm">
                  <div className="mb-1 flex items-start justify-between gap-2">
                    <h4 className="font-semibold">{ex.name}</h4>
                    <span className="shrink-0 rounded-md bg-paper2 px-2 py-0.5 text-xs font-semibold text-ink-soft">
                      {ex.sets}
                    </span>
                  </div>
                  <p className="mb-2 text-sm text-ink-soft">
                    <span className="font-semibold text-ink">Proč: </span>
                    {ex.why}
                  </p>
                  <p className="text-sm text-ink-soft">
                    <span className="font-semibold text-ink">Jak: </span>
                    {ex.how}
                  </p>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
        active ? "bg-sky text-white" : "border border-line bg-card text-ink-soft hover:border-sky"
      }`}
    >
      {label}
    </button>
  );
}
