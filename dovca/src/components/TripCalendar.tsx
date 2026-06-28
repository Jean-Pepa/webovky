"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Trip, AvailStatus } from "@/lib/types";
import { useStore } from "@/lib/store";
import { MONTH_NAMES, DOW, iso } from "@/lib/format";
import { dayStats } from "@/lib/windows";

type CalMode = "edit" | "heat";

function monthsInRange(start: string, end: string): { y: number; m: number }[] {
  const s = new Date(`${start}T00:00:00`);
  const e = new Date(`${end}T00:00:00`);
  const out: { y: number; m: number }[] = [];
  let y = s.getFullYear();
  let m = s.getMonth();
  let guard = 0;
  while ((y < e.getFullYear() || (y === e.getFullYear() && m <= e.getMonth())) && guard < 60) {
    out.push({ y, m });
    m++;
    if (m > 11) {
      m = 0;
      y++;
    }
    guard++;
  }
  return out;
}

// Pozadí buňky v heatmapě podle podílu těch, kdo můžou.
function heatStyle(free: number, total: number): React.CSSProperties {
  if (total === 0) return { background: "#fff" };
  const ratio = free / total;
  const alpha = 0.1 + 0.8 * ratio;
  return { background: `rgba(18, 157, 171, ${alpha.toFixed(3)})` };
}

export function TripCalendar({ trip, me }: { trip: Trip; me: string }) {
  const { dispatch } = useStore();
  const months = useMemo(() => monthsInRange(trip.horizonStart, trip.horizonEnd), [trip.horizonStart, trip.horizonEnd]);
  const [mi, setMi] = useState(0);
  const [mode, setMode] = useState<CalMode>("edit");
  const [paint, setPaint] = useState<AvailStatus>("out");
  const [draft, setDraft] = useState<Record<string, AvailStatus | null>>({});

  const draftRef = useRef<Record<string, AvailStatus | null>>({});
  const dragging = useRef(false);
  const dragOp = useRef<AvailStatus | null>(null);

  const cur = months[Math.min(mi, Math.max(0, months.length - 1))] ?? { y: new Date().getFullYear(), m: 0 };
  const stats = useMemo(() => (mode === "heat" ? dayStats(trip) : null), [trip, mode]);
  const mine = trip.availability[me] ?? {};
  const total = trip.members.length;
  const inHorizon = (d: string) => d >= trip.horizonStart && d <= trip.horizonEnd;

  function myStatus(d: string): AvailStatus | undefined {
    if (d in draft) return draft[d] ?? undefined;
    return mine[d];
  }

  function setDraftCell(d: string, op: AvailStatus | null) {
    draftRef.current = { ...draftRef.current, [d]: op };
    setDraft(draftRef.current);
  }

  function dateFromPoint(x: number, y: number): string | null {
    const el = document.elementFromPoint(x, y);
    const cell = el && (el as Element).closest?.("[data-d]");
    const d = cell?.getAttribute("data-d") ?? null;
    return d && inHorizon(d) ? d : null;
  }

  function startDrag(d: string) {
    const current = mine[d];
    const op: AvailStatus | null = current === paint ? null : paint; // klik na stejný stav = smazat
    dragOp.current = op;
    dragging.current = true;
    draftRef.current = {};
    setDraftCell(d, op);
  }

  function extendDrag(d: string) {
    if (!dragging.current) return;
    if (draftRef.current[d] !== undefined) return;
    setDraftCell(d, dragOp.current);
  }

  // Dokončení tahu: čte aktuální refy (ne zachycený render), takže window
  // listener má vždy čerstvá data. Re-binduje se jen při změně výpravy / jména.
  useEffect(() => {
    const commit = () => {
      if (!dragging.current) return;
      dragging.current = false;
      const dates = Object.keys(draftRef.current);
      const op = dragOp.current;
      draftRef.current = {};
      setDraft({});
      if (dates.length) {
        dispatch({ type: "paintAvailability", tripId: trip.id, person: me, dates, status: op });
      }
    };
    window.addEventListener("pointerup", commit);
    window.addEventListener("pointercancel", commit);
    return () => {
      window.removeEventListener("pointerup", commit);
      window.removeEventListener("pointercancel", commit);
    };
  }, [dispatch, trip.id, me]);

  // mřížka měsíce (pondělí první)
  const first = new Date(cur.y, cur.m, 1);
  const startOffset = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(cur.y, cur.m + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="card p-4">
      {/* přepínač režimu */}
      <div className="mb-3 flex items-center gap-2">
        <div className="inline-flex rounded-full bg-paper2 p-0.5 text-xs font-medium">
          <button
            className={`rounded-full px-3 py-1.5 transition ${mode === "edit" ? "bg-white shadow-sm text-ink" : "text-ink-soft"}`}
            onClick={() => setMode("edit")}
          >
            Můj kalendář
          </button>
          <button
            className={`rounded-full px-3 py-1.5 transition ${mode === "heat" ? "bg-white shadow-sm text-ink" : "text-ink-soft"}`}
            onClick={() => setMode("heat")}
          >
            Všichni
          </button>
        </div>
      </div>

      {/* malovací režim — výběr co značím */}
      {mode === "edit" && (
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="text-xs text-ink-soft">Táhnutím označ dny, kdy:</span>
          <button
            className={`chip border ${paint === "out" ? "border-out bg-out-soft text-out" : "border-transparent"}`}
            onClick={() => setPaint("out")}
          >
            🔴 nemůžu
          </button>
          <button
            className={`chip border ${paint === "maybe" ? "border-maybe bg-maybe-soft text-maybe" : "border-transparent"}`}
            onClick={() => setPaint("maybe")}
          >
            🟡 možná
          </button>
          <button
            className="btn-ghost ml-auto px-2 py-1 text-xs"
            onClick={() => dispatch({ type: "clearAvailability", tripId: trip.id, person: me })}
          >
            Vymazat moje
          </button>
        </div>
      )}

      {/* navigace měsíců */}
      <div className="mb-2 flex items-center justify-between">
        <button className="btn-ghost px-3" onClick={() => setMi((i) => Math.max(0, i - 1))} disabled={mi <= 0} aria-label="Předchozí měsíc">
          ←
        </button>
        <h3 className="font-display text-base font-semibold">
          {MONTH_NAMES[cur.m]} {cur.y}
        </h3>
        <button
          className="btn-ghost px-3"
          onClick={() => setMi((i) => Math.min(months.length - 1, i + 1))}
          disabled={mi >= months.length - 1}
          aria-label="Další měsíc"
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-ink-soft">
        {DOW.map((d) => (
          <div key={d} className="py-1">{d}</div>
        ))}
      </div>

      <div
        className="grid grid-cols-7 gap-1"
        style={mode === "edit" ? { touchAction: "none" } : undefined}
        onPointerMove={(e) => {
          if (mode !== "edit" || !dragging.current) return;
          const d = dateFromPoint(e.clientX, e.clientY);
          if (d) extendDrag(d);
        }}
      >
        {cells.map((d, i) => {
          if (d === null) return <div key={i} />;
          const date = iso(cur.y, cur.m, d);
          const within = inHorizon(date);

          if (!within) {
            return (
              <div key={i} className="min-h-[42px] rounded-lg text-center text-xs text-ink-soft/30">
                <span className="inline-block pt-2">{d}</span>
              </div>
            );
          }

          if (mode === "heat") {
            const s = stats!.get(date);
            const free = s?.free ?? total;
            const maybe = s?.maybe ?? 0;
            const everyone = total > 0 && free === total;
            return (
              <div
                key={i}
                className={`min-h-[42px] rounded-lg border p-1 text-center ${everyone ? "border-free ring-1 ring-free/40" : "border-black/[0.05]"}`}
                style={heatStyle(free, total)}
                title={`${free}/${total} může${maybe ? `, ${maybe} možná` : ""}`}
              >
                <div className="text-[10px] font-semibold text-ink/70">{d}</div>
                <div className="text-xs font-bold leading-none text-ink">{free}</div>
                {maybe > 0 && <div className="mt-0.5 text-[9px] leading-none text-maybe">+{maybe}?</div>}
              </div>
            );
          }

          // editační režim
          const st = myStatus(date);
          const cls =
            st === "out"
              ? "border-out bg-out-soft text-out"
              : st === "maybe"
                ? "border-maybe bg-maybe-soft text-maybe"
                : "border-black/[0.06] bg-free-soft/60 text-free";
          return (
            <button
              key={i}
              data-d={date}
              onPointerDown={(e) => {
                e.preventDefault();
                startDrag(date);
              }}
              className={`min-h-[42px] select-none rounded-lg border text-center text-xs font-semibold transition ${cls}`}
              title={st === "out" ? "nemůžu" : st === "maybe" ? "možná" : "můžu"}
            >
              {d}
            </button>
          );
        })}
      </div>

      {/* legenda */}
      <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 border-t border-black/[0.06] pt-3 text-[11px] text-ink-soft">
        {mode === "edit" ? (
          <>
            <span className="flex items-center gap-1"><Dot c="free" /> můžu (výchozí)</span>
            <span className="flex items-center gap-1"><Dot c="maybe" /> možná</span>
            <span className="flex items-center gap-1"><Dot c="out" /> nemůžu</span>
          </>
        ) : (
          <span>Číslo = kolik z vás ({total}) ten den může. Tmavší = víc lidí. „+N?“ = kolik je na vážkách.</span>
        )}
      </div>
    </div>
  );
}

function Dot({ c }: { c: "free" | "maybe" | "out" }) {
  const bg = c === "free" ? "bg-free" : c === "maybe" ? "bg-maybe" : "bg-out";
  return <span className={`h-2 w-2 rounded-full ${bg}`} />;
}
