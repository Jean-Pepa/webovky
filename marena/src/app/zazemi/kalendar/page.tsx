"use client";

import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { KINDS, KIND_ORDER } from "@/lib/kinds";
import { fmtDate, todayISO } from "@/lib/format";
import { DeleteButton } from "@/components/DeleteButton";
import { isAdmin } from "@/lib/admin";
import type { CalEvent, EventKind } from "@/lib/types";

const MONTH_NAMES = ["Leden", "Únor", "Březen", "Duben", "Květen", "Červen", "Červenec", "Srpen", "Září", "Říjen", "Listopad", "Prosinec"];
const DOW = ["po", "út", "st", "čt", "pá", "so", "ne"];

function iso(y: number, m: number, d: number): string {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

// Vyjmenuje všechny dny v rozsahu od–do (včetně), s pojistkou proti nekonečnu.
function enumerateDates(start: string, end: string): string[] {
  const s = new Date(`${start}T00:00:00`);
  const e = new Date(`${end}T00:00:00`);
  if (isNaN(s.getTime()) || isNaN(e.getTime()) || e < s) return [start];
  const out: string[] = [];
  const cur = new Date(s);
  let guard = 0;
  while (cur <= e && guard < 366) {
    out.push(iso(cur.getFullYear(), cur.getMonth(), cur.getDate()));
    cur.setDate(cur.getDate() + 1);
    guard++;
  }
  return out;
}

export default function KalendarPage() {
  const { currentYear, me, dispatch } = useStore();
  const now = new Date();
  const [vy, setVy] = useState(now.getFullYear());
  const [vm, setVm] = useState(now.getMonth());
  const [selected, setSelected] = useState(todayISO());

  const year = currentYear;

  // Mapa den → události. Vícedenní (od–do) se zařadí do každého dne rozsahu.
  const byDate = useMemo(() => {
    const map: Record<string, CalEvent[]> = {};
    year?.events.forEach((e) => {
      const days = e.endDate && e.endDate > e.date ? enumerateDates(e.date, e.endDate) : [e.date];
      days.forEach((day) => {
        (map[day] ||= []).push(e);
      });
    });
    return map;
  }, [year]);

  if (!year) return null;

  // mřížka dní (pondělí první)
  const first = new Date(vy, vm, 1);
  const startOffset = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(vy, vm + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const selectedEvents = (byDate[selected] || []).slice().sort((a, b) => (a.time || "").localeCompare(b.time || ""));

  function shift(delta: number) {
    let m = vm + delta;
    let y = vy;
    if (m < 0) {
      m = 11;
      y--;
    } else if (m > 11) {
      m = 0;
      y++;
    }
    setVm(m);
    setVy(y);
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Kalendář</h1>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        {/* MŘÍŽKA */}
        <div className="card p-4">
          <div className="mb-3 flex items-center justify-between">
            <button className="btn-ghost" onClick={() => shift(-1)} aria-label="Předchozí měsíc">←</button>
            <h2 className="font-display text-lg font-semibold">
              {MONTH_NAMES[vm]} {vy}
            </h2>
            <div className="flex items-center gap-1">
              <button
                className="btn-ghost text-xs"
                onClick={() => {
                  setVy(now.getFullYear());
                  setVm(now.getMonth());
                  setSelected(todayISO());
                }}
              >
                dnes
              </button>
              <button className="btn-ghost" onClick={() => shift(1)} aria-label="Další měsíc">→</button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-semibold text-ink-soft">
            {DOW.map((d) => (
              <div key={d} className="py-1">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {cells.map((d, i) => {
              if (d === null) return <div key={i} />;
              const date = iso(vy, vm, d);
              const evs = byDate[date] || [];
              const isToday = date === todayISO();
              const isSel = date === selected;
              const tint = evs[0] ? KINDS[evs[0].kind].cell : "";
              return (
                <button
                  key={i}
                  onClick={() => setSelected(date)}
                  className={`min-h-[68px] rounded-xl border p-1.5 text-left transition ${
                    isSel
                      ? "border-marigold-500 bg-marigold-50 ring-2 ring-marigold-300"
                      : evs.length
                        ? `border-black/10 ${tint} hover:ring-1 hover:ring-black/15`
                        : "border-black/[0.05] bg-white hover:bg-paper2"
                  }`}
                >
                  <div className={`text-xs font-semibold ${isToday ? "inline-grid h-5 w-5 place-items-center rounded-full bg-marigold-600 text-white" : "text-ink"}`}>
                    {d}
                  </div>
                  <div className="mt-1 space-y-0.5">
                    {evs.slice(0, 2).map((e) => (
                      <div key={e.id} className="flex items-center gap-1 truncate text-[10px] font-medium text-ink/80">
                        <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${KINDS[e.kind].dot}`} />
                        <span className="truncate">{e.title}</span>
                      </div>
                    ))}
                    {evs.length > 2 && <div className="text-[10px] text-ink-soft">+{evs.length - 2} dalších</div>}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5 border-t border-black/[0.06] pt-3">
            {KIND_ORDER.map((k) => (
              <span key={k} className="flex items-center gap-1 text-xs text-ink-soft">
                <span className={`h-2 w-2 rounded-full ${KINDS[k].dot}`} /> {KINDS[k].label}
              </span>
            ))}
          </div>
        </div>

        {/* DETAIL DNE */}
        <div className="space-y-4">
          <div className="card p-4">
            <h2 className="font-display text-base font-semibold">{fmtDate(selected)}</h2>
            {selectedEvents.length === 0 ? (
              <p className="mt-2 text-sm text-ink-soft">Žádné události. Přidej níže.</p>
            ) : (
              <ul className="mt-2 space-y-2">
                {selectedEvents.map((e) => {
                  const k = KINDS[e.kind];
                  const isRange = e.endDate && e.endDate > e.date;
                  return (
                    <li key={e.id} className="rounded-xl border border-black/[0.06] p-3">
                      <div className="flex items-center gap-2">
                        <span className={`chip ${k.chip}`}>{k.emoji} {k.label}</span>
                        {e.time && <span className="text-xs font-semibold text-ink">{e.time}</span>}
                        {(isAdmin(me) || e.author === me) && (
                          <span className="ml-auto">
                            <DeleteButton onConfirm={() => dispatch({ type: "removeEvent", yearId: year.id, eventId: e.id })} />
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm font-medium">{e.title}</p>
                      {isRange && (
                        <p className="text-xs text-marigold-700">📆 {fmtDate(e.date)} – {fmtDate(e.endDate!)}</p>
                      )}
                      {e.note && <p className="text-xs text-ink-soft">{e.note}</p>}
                      <p className="mt-1 text-[11px] text-ink-soft">přidal {e.author}</p>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
          <AddEvent key={selected} date={selected} yearId={year.id} />
        </div>
      </div>
    </div>
  );
}

function AddEvent({ date, yearId }: { date: string; yearId: string }) {
  const { me, dispatch } = useStore();
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [kind, setKind] = useState<EventKind>("schuzka");
  const [note, setNote] = useState("");
  // Formulář se remountuje při změně dne (key={selected}), datum jde z propu.
  const [d, setD] = useState(date);
  const [dEnd, setDEnd] = useState("");

  return (
    <div className="card space-y-2 p-4">
      <h3 className="font-display text-base font-semibold">+ Přidat událost</h3>
      <input className="input" placeholder="Co se děje?" value={title} onChange={(e) => setTitle(e.target.value)} />
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="label">Od</label>
          <input type="date" className="input" value={d} onChange={(e) => setD(e.target.value)} />
        </div>
        <div>
          <label className="label">Do (nepovinné)</label>
          <input type="date" className="input" value={dEnd} min={d} onChange={(e) => setDEnd(e.target.value)} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="label">Čas (nepovinné)</label>
          <input type="time" className="input" value={time} onChange={(e) => setTime(e.target.value)} />
        </div>
        <div>
          <label className="label">Druh</label>
          <select className="input" value={kind} onChange={(e) => setKind(e.target.value as EventKind)}>
            {KIND_ORDER.map((k) => (
              <option key={k} value={k}>
                {KINDS[k].emoji} {KINDS[k].label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <input className="input" placeholder="Poznámka (nepovinné)" value={note} onChange={(e) => setNote(e.target.value)} />
      <button
        className="btn-primary w-full"
        onClick={async () => {
          if (!title.trim()) return;
          await dispatch({ type: "addEvent", yearId, date: d, endDate: dEnd || undefined, time: time || undefined, title, kind, note, author: me });
          setTitle("");
          setTime("");
          setNote("");
          setDEnd("");
        }}
      >
        Přidat do kalendáře
      </button>
    </div>
  );
}
