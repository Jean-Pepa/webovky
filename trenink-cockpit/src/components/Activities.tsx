"use client";

import { useState } from "react";
import { useActivities } from "@/lib/store";
import { fmtDuration, fmtKm, fmtPace, typeMeta } from "@/lib/metrics";

export default function Activities() {
  const { activities, loading } = useActivities();
  const [filter, setFilter] = useState<string>("all");

  if (loading) {
    return <div className="rounded-2xl border border-line bg-card p-8 text-center text-ink-soft">Načítám…</div>;
  }
  if (!activities.length) {
    return (
      <div className="rounded-2xl border border-line bg-card p-6 text-center text-sm text-ink-soft">
        Zatím žádné aktivity. Až připojíš Garmin, řekni Claudovi „natáhni data“ a objeví se tu.
      </div>
    );
  }

  const types = Array.from(new Set(activities.map((a) => a.type)));
  const shown = filter === "all" ? activities : activities.filter((a) => a.type === filter);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <Chip label="Vše" active={filter === "all"} onClick={() => setFilter("all")} />
        {types.map((t) => (
          <Chip key={t} label={typeMeta(t).label} active={filter === t} onClick={() => setFilter(t)} />
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-line bg-card">
        {shown.map((a, i) => {
          const m = typeMeta(a.type);
          return (
            <div
              key={a.id}
              className={`flex items-center gap-3 p-3 ${i > 0 ? "border-t border-line" : ""}`}
            >
              <span
                className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-base"
                style={{ background: m.color + "1a" }}
              >
                {m.icon}
              </span>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{a.name || m.label}</div>
                <div className="text-xs text-ink-soft">{a.date}</div>
              </div>
              <div className="shrink-0 text-right">
                <div className="text-sm font-semibold">{fmtKm(a.distanceKm)} km</div>
                <div className="text-xs text-ink-soft">
                  {fmtDuration(a.durationS)}
                  {a.paceSPerKm ? ` · ${fmtPace(a.paceSPerKm)}/km` : ""}
                </div>
              </div>
              <div className="hidden shrink-0 text-right sm:block" style={{ minWidth: 64 }}>
                {a.avgHr != null && <div className="text-sm font-semibold text-red">{a.avgHr}</div>}
                <div className="text-xs text-ink-soft">
                  {a.avgHr != null ? "bpm" : ""}
                  {a.vo2max != null ? ` · VO₂ ${a.vo2max}` : ""}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-center text-xs text-ink-soft">{shown.length} aktivit</p>
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
