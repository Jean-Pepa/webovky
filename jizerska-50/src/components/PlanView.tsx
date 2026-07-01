"use client";

import { useState } from "react";
import { PLAN, PHASES, ZONES, KIND_META, type Week, type Session } from "@/lib/plan";
import { useDoneSessions } from "@/lib/store";
import { accent } from "./accents";

function SessionRow({
  week,
  s,
  done,
  toggle,
}: {
  week: Week;
  s: Session;
  done: string[];
  toggle: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const id = `${week.n}-${s.day}`;
  const isDone = done.includes(id);
  const meta = KIND_META[s.kind];
  const a = accent(meta.color);

  return (
    <div className={`rounded-xl border ${isDone ? "border-line bg-paper2/50" : "border-line bg-card"}`}>
      <div className="flex items-center gap-3 p-3">
        <button
          onClick={() => toggle(id)}
          aria-label={isDone ? "Označit jako nesplněno" : "Označit jako splněno"}
          className={`grid h-6 w-6 shrink-0 place-items-center rounded-md border transition ${
            isDone ? "border-leaf bg-leaf text-white" : "border-line bg-paper hover:border-sky"
          }`}
        >
          {isDone ? "✓" : ""}
        </button>
        <div className="w-8 shrink-0 text-center text-xs font-semibold text-ink-soft">{s.day}</div>
        <button onClick={() => setOpen((v) => !v)} className="flex flex-1 items-center gap-2 text-left">
          <span className="text-base leading-none">{meta.icon}</span>
          <span className={`flex-1 text-sm font-medium ${isDone ? "text-ink-soft line-through" : ""}`}>
            {s.title}
          </span>
          <span className="hidden shrink-0 text-xs text-ink-soft sm:inline">{s.duration}</span>
          {s.zone !== "-" && (
            <span className={`shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-bold ${a.bgSoft} ${a.text}`}>
              {s.zone}
            </span>
          )}
          <span className="shrink-0 text-ink-soft">{open ? "▴" : "▾"}</span>
        </button>
      </div>
      {open && (
        <div className="border-t border-line px-3 py-2.5 text-sm text-ink-soft">
          <span className="sm:hidden">
            <span className="font-semibold text-ink">{s.duration}</span> ·{" "}
          </span>
          {s.detail}
        </div>
      )}
    </div>
  );
}

function WeekCard({
  week,
  done,
  toggle,
  defaultOpen,
}: {
  week: Week;
  done: string[];
  toggle: (id: string) => void;
  defaultOpen: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const phase = PHASES.find((p) => p.key === week.phaseKey)!;
  const a = accent(phase.color);
  const total = week.sessions.filter((s) => s.kind !== "rest").length;
  const doneCount = week.sessions.filter(
    (s) => s.kind !== "rest" && done.includes(`${week.n}-${s.day}`)
  ).length;

  return (
    <div id={`tyden-${week.n}`} className="overflow-hidden rounded-2xl border border-line bg-card shadow-sm">
      <button onClick={() => setOpen((v) => !v)} className="flex w-full items-center gap-3 p-4 text-left">
        <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${a.bgSoft} ${a.text} font-bold`}>
          {week.n}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">Týden {week.n}</span>
            <span className="text-xs text-ink-soft">· {week.dateRange}</span>
          </div>
          <div className="truncate text-xs text-ink-soft">{week.focus}</div>
        </div>
        <div className="hidden shrink-0 text-right sm:block">
          <div className="text-xs text-ink-soft">objem</div>
          <div className="text-sm font-semibold">{week.volume}</div>
        </div>
        <div className="shrink-0 text-xs font-semibold text-ink-soft">
          {doneCount}/{total}
        </div>
        <span className="shrink-0 text-ink-soft">{open ? "▴" : "▾"}</span>
      </button>
      {open && (
        <div className="space-y-2 border-t border-line bg-paper/40 p-3">
          {week.sessions.map((s) => (
            <SessionRow key={s.day} week={week} s={s} done={done} toggle={toggle} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function PlanView({ currentWeek }: { currentWeek: number }) {
  const { done, toggle, hydrated } = useDoneSessions();
  const [phaseFilter, setPhaseFilter] = useState<string>("all");

  const totalSessions = PLAN.reduce(
    (acc, w) => acc + w.sessions.filter((s) => s.kind !== "rest").length,
    0
  );
  const doneTotal = hydrated ? done.length : 0;
  const pct = Math.round((doneTotal / totalSessions) * 100);

  const weeks = phaseFilter === "all" ? PLAN : PLAN.filter((w) => w.phaseKey === phaseFilter);

  return (
    <div className="space-y-5">
      {/* Souhrn postupu */}
      <div className="rounded-2xl border border-line bg-card p-4 shadow-sm">
        <div className="mb-2 flex items-baseline justify-between">
          <h2 className="text-sm font-semibold">Celkový postup plánu</h2>
          <span className="text-sm font-semibold text-sky-600">
            {doneTotal}/{totalSessions} jednotek · {pct}%
          </span>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-paper2">
          <div className="h-full rounded-full bg-sky transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* Filtr fází */}
      <div className="flex flex-wrap gap-2">
        <FilterChip label="Vše" active={phaseFilter === "all"} onClick={() => setPhaseFilter("all")} color="ink" />
        {PHASES.map((p) => (
          <FilterChip
            key={p.key}
            label={p.name.split(" · ")[1] ?? p.name}
            active={phaseFilter === p.key}
            onClick={() => setPhaseFilter(p.key)}
            color={p.color}
          />
        ))}
      </div>

      {/* Popis fáze při filtru */}
      {phaseFilter !== "all" &&
        (() => {
          const p = PHASES.find((x) => x.key === phaseFilter)!;
          const a = accent(p.color);
          return (
            <div className={`rounded-2xl border-l-4 ${a.border} ${a.bgSoft} p-4`}>
              <div className="text-xs font-semibold text-ink-soft">{p.weeks}</div>
              <div className={`mb-1 text-base font-bold ${a.text}`}>{p.name}</div>
              <p className="text-sm text-ink-soft">{p.goal}</p>
            </div>
          );
        })()}

      {/* Týdny */}
      <div className="space-y-3">
        {weeks.map((w) => (
          <WeekCard key={w.n} week={w} done={done} toggle={toggle} defaultOpen={w.n === currentWeek} />
        ))}
      </div>

      {/* Legenda zón */}
      <div className="rounded-2xl border border-line bg-card p-4 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold">Intenzitní zóny — jak je poznáš bez měřáku</h3>
        <div className="grid gap-2 sm:grid-cols-2">
          {ZONES.map((z) => (
            <div key={z.z} className="flex items-start gap-2 text-sm">
              <span className="mt-0.5 shrink-0 rounded-md bg-paper2 px-1.5 py-0.5 text-[11px] font-bold">{z.z}</span>
              <span>
                <span className="font-semibold">{z.name}</span> — <span className="text-ink-soft">{z.feel}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
  color,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  color: string;
}) {
  const a = accent(color);
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
        active ? `${a.bgSolid} text-white` : "bg-card border border-line text-ink-soft hover:border-sky"
      }`}
    >
      {label}
    </button>
  );
}
