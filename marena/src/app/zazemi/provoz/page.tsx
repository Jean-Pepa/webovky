"use client";

import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { fmtDate } from "@/lib/format";
import { DeleteButton } from "@/components/DeleteButton";
import type { Shift } from "@/lib/types";

const AREA_META: Record<string, string> = {
  Bar: "🍺",
  Kuchyně: "🍲",
  Snídaně: "🥐",
  Oběd: "🍽️",
  Nákupy: "🛒",
  Úklid: "🧹",
  Stavění: "🔨",
  Výzdoba: "🎨",
  Průvod: "🚩",
  Fléda: "🌟",
  Šatna: "🧥",
  Foto: "📸",
  Ostatní: "📍",
};
const AREA_ORDER = Object.keys(AREA_META);
const areaEmoji = (a: string) => AREA_META[a] ?? "📍";

type Filter = "vse" | "moje" | "volne";

function timeLabel(s: Shift): string {
  const parts: string[] = [];
  if (s.date) parts.push(fmtDate(s.date));
  if (s.from && s.to) parts.push(`${s.from}–${s.to}`);
  else if (s.from) parts.push(`od ${s.from}`);
  else if (s.to) parts.push(`do ${s.to}`);
  return parts.join(" · ");
}

export default function ProvozPage() {
  const { currentYear, me, dispatch } = useStore();
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<Filter>("vse");

  const [area, setArea] = useState("");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [capacity, setCapacity] = useState("2");
  const [note, setNote] = useState("");

  const year = currentYear;
  const shifts = useMemo(() => year?.shifts ?? [], [year]);

  const groups = useMemo(() => {
    const filtered = shifts.filter((s) => {
      if (filter === "moje") return s.people.includes(me);
      if (filter === "volne") return s.capacity === 0 || s.people.length < s.capacity;
      return true;
    });
    const map = new Map<string, Shift[]>();
    for (const s of filtered) {
      const arr = map.get(s.area) || [];
      arr.push(s);
      map.set(s.area, arr);
    }
    for (const arr of map.values()) {
      arr.sort((a, b) => (a.date || "").localeCompare(b.date || "") || (a.from || "").localeCompare(b.from || ""));
    }
    return [...map.entries()].sort((a, b) => {
      const ia = AREA_ORDER.indexOf(a[0]);
      const ib = AREA_ORDER.indexOf(b[0]);
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib) || a[0].localeCompare(b[0]);
    });
  }, [shifts, filter, me]);

  if (!year) return null;

  async function add() {
    if (!area.trim() || !year) return;
    await dispatch({ type: "addShift", yearId: year.id, area, title, date: date || undefined, from: from || undefined, to: to || undefined, capacity: parseInt(capacity, 10) || 0, note });
    setArea("");
    setTitle("");
    setDate("");
    setFrom("");
    setTo("");
    setCapacity("2");
    setNote("");
    setOpen(false);
  }

  return (
    <div className="space-y-5">
      <datalist id="area-list">
        {AREA_ORDER.map((a) => (
          <option key={a} value={a} />
        ))}
      </datalist>

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Provoz &amp; směny</h1>
        </div>
        <button className="btn-primary" onClick={() => setOpen((v) => !v)}>
          {open ? "Zavřít" : "+ Přidat směnu"}
        </button>
      </div>

      {open && (
        <div className="card space-y-2 p-4">
          <div className="grid gap-2 sm:grid-cols-2">
            <input className="input" list="area-list" placeholder="Oblast (Bar, Kuchyně, Nákupy…)" value={area} onChange={(e) => setArea(e.target.value)} />
            <input className="input" placeholder="Co se dělá (např. Výčep, Oběd – guláš)" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="grid gap-2 sm:grid-cols-4">
            <input type="date" className="input sm:col-span-2" value={date} onChange={(e) => setDate(e.target.value)} />
            <input type="time" className="input" value={from} onChange={(e) => setFrom(e.target.value)} />
            <input type="time" className="input" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-ink-soft">
              Kolik lidí
              <input type="number" min={0} className="input w-20" value={capacity} onChange={(e) => setCapacity(e.target.value)} />
              <span className="text-xs">(0 = neomezeně)</span>
            </label>
            <input className="input flex-1" placeholder="Poznámka (nepovinné)" value={note} onChange={(e) => setNote(e.target.value)} />
          </div>
          <button className="btn-primary" onClick={add}>
            Vytvořit směnu
          </button>
        </div>
      )}

      {/* filtr */}
      <div className="flex flex-wrap gap-2">
        {([
          ["vse", "Vše"],
          ["moje", "Moje směny"],
          ["volne", "Volné"],
        ] as [Filter, string][]).map(([f, l]) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${filter === f ? "bg-marigold-600 text-white" : "bg-white text-ink-soft ring-1 ring-black/10 hover:bg-paper2"}`}
          >
            {l}
          </button>
        ))}
      </div>

      {groups.length === 0 ? (
        <div className="card grid place-items-center p-10 text-center text-sm text-ink-soft">
          {filter === "vse" ? "Zatím žádné směny. Přidej první rozpis." : "Nic tu není."}
        </div>
      ) : (
        <div className="space-y-6">
          {groups.map(([areaName, items]) => (
            <section key={areaName}>
              <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-semibold">
                <span>{areaEmoji(areaName)}</span> {areaName}
                <span className="chip">{items.length}</span>
              </h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((s) => (
                  <ShiftCard key={s.id} shift={s} yearId={year.id} me={me} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function ShiftCard({ shift, yearId, me }: { shift: Shift; yearId: string; me: string }) {
  const { dispatch } = useStore();
  const filled = shift.people.length;
  const cap = shift.capacity;
  const mine = shift.people.includes(me);
  const full = cap > 0 && filled >= cap && !mine;
  const time = timeLabel(shift);

  return (
    <div className={`card flex flex-col p-4 ${mine ? "ring-2 ring-marigold-400" : ""}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="font-display text-base font-semibold">{shift.title || shift.area}</h3>
          {time && <p className="text-xs text-ink-soft">{time}</p>}
        </div>
        <DeleteButton onConfirm={() => dispatch({ type: "removeShift", yearId, shiftId: shift.id })} />
      </div>

      <div className="mt-2">
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
            cap === 0 ? "bg-paper2 text-ink-soft" : full ? "bg-marigold-600 text-white" : "bg-leaf/12 text-leaf-700"
          }`}
        >
          {cap === 0 ? `${filled} přihlášeno` : full ? "Plno" : `${filled}/${cap} obsazeno`}
        </span>
      </div>

      {shift.people.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {shift.people.map((p) => (
            <span key={p} className={`chip ${p === me ? "bg-marigold-600 text-white" : ""}`}>
              {p}
            </span>
          ))}
        </div>
      )}

      {shift.note && <p className="mt-2 text-xs text-ink-soft">{shift.note}</p>}

      <div className="mt-3 pt-1">
        {mine ? (
          <button className="btn-secondary w-full" onClick={() => dispatch({ type: "signShift", yearId, shiftId: shift.id, name: me })}>
            Odhlásit se
          </button>
        ) : full ? (
          <button className="btn-secondary w-full" disabled>
            Plno
          </button>
        ) : (
          <button className="btn-primary w-full" onClick={() => dispatch({ type: "signShift", yearId, shiftId: shift.id, name: me })}>
            Přihlásit se
          </button>
        )}
      </div>
    </div>
  );
}
