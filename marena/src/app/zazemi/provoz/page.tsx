"use client";

import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { fmtDate } from "@/lib/format";
import { DeleteButton } from "@/components/DeleteButton";
import { SearchBox } from "@/components/SearchBox";
import { isAdmin } from "@/lib/admin";
import { matchesQuery } from "@/lib/search";
import { flash } from "@/components/Flash";
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
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("vse");
  const [view, setView] = useState<"seznam" | "rozvrh">("seznam");

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
      if (!matchesQuery(q, s.title, s.area, s.note, s.people.join(" "), (s.backup ?? []).join(" "))) return false;
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
  }, [shifts, filter, me, q]);

  // Rozvrh: směny seskupené po dnech, seřazené podle času.
  const byDay = useMemo(() => {
    const filtered = shifts.filter((s) => {
      if (!matchesQuery(q, s.title, s.area, s.note, s.people.join(" "), (s.backup ?? []).join(" "))) return false;
      if (filter === "moje") return s.people.includes(me) || (s.backup ?? []).includes(me);
      if (filter === "volne") return s.capacity === 0 || s.people.length < s.capacity;
      return true;
    });
    const map = new Map<string, Shift[]>();
    for (const s of filtered) {
      const key = s.date || "Bez data";
      (map.get(key) ?? map.set(key, []).get(key)!).push(s);
    }
    for (const arr of map.values()) arr.sort((a, b) => (a.from || "").localeCompare(b.from || "") || a.area.localeCompare(b.area));
    return [...map.entries()].sort((a, b) => (a[0] === "Bez data" ? 1 : b[0] === "Bez data" ? -1 : a[0].localeCompare(b[0])));
  }, [shifts, filter, me, q]);

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
    flash("Směna přidána", "📋");
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
          <h1 className="font-display text-[28px] font-bold uppercase tracking-tight">Provoz &amp; směny</h1>
        </div>
        <button className="btn-primary" onClick={() => setOpen((v) => !v)}>
          {open ? "Zavřít" : "+ Přidat směnu"}
        </button>
      </div>

      <SearchBox value={q} onChange={setQ} placeholder="Hledat směnu…" />

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

      {/* filtr + přepínač pohledu */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          {([
            ["vse", "Vše"],
            ["moje", "Moje směny"],
            ["volne", "Volné"],
          ] as [Filter, string][]).map(([f, l]) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${filter === f ? "bg-gold-500 text-[#1d1d1f]" : "bg-white text-ink-soft ring-1 ring-ink/10 hover:bg-paper2"}`}
            >
              {l}
            </button>
          ))}
        </div>
        <div className="inline-flex rounded-full bg-paper2 p-0.5 text-sm">
          {([
            ["seznam", "Seznam"],
            ["rozvrh", "Rozvrh"],
          ] as ["seznam" | "rozvrh", string][]).map(([v, l]) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`rounded-full px-3 py-1.5 font-medium transition ${view === v ? "bg-white text-ink shadow-sm" : "text-ink-soft"}`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {shifts.length === 0 ? (
        <div className="card grid place-items-center p-10 text-center text-sm text-ink-soft">Zatím žádné směny. Přidej první rozpis.</div>
      ) : view === "seznam" ? (
        groups.length === 0 ? (
          <div className="card grid place-items-center p-10 text-center text-sm text-ink-soft">{q.trim() ? "Nic neodpovídá hledání." : "Nic tu není."}</div>
        ) : (
          <div className="space-y-6">
            {groups.map(([areaName, items]) => (
              <section key={areaName}>
                <h2 className="mb-3 flex items-center gap-2 font-display text-[20px] font-semibold">
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
        )
      ) : byDay.length === 0 ? (
        <div className="card grid place-items-center p-10 text-center text-sm text-ink-soft">{q.trim() ? "Nic neodpovídá hledání." : "Nic tu není."}</div>
      ) : (
        <div className="space-y-5">
          {byDay.map(([day, items]) => (
            <section key={day} className="card overflow-hidden">
              <h2 className="border-b border-ink/[0.06] bg-paper2/60 px-4 py-2 font-display text-base font-semibold">
                {day === "Bez data" ? "📌 Bez data" : `📅 ${fmtDate(day)}`}
                <span className="ml-2 text-sm font-normal text-ink-soft">{items.length} směn</span>
              </h2>
              <ul className="divide-y divide-black/[0.06]">
                {items.map((s) => (
                  <RozvrhRow key={s.id} shift={s} yearId={year.id} me={me} />
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

// Kompaktní řádek v rozvrhu (po dnech): čas · oblast · přihlášení + záloha.
function RozvrhRow({ shift, yearId, me }: { shift: Shift; yearId: string; me: string }) {
  const { dispatch } = useStore();
  const admin = isAdmin(me);
  const mine = shift.people.includes(me);
  const inBackup = (shift.backup ?? []).includes(me);
  const cap = shift.capacity;
  const full = cap > 0 && shift.people.length >= cap && !mine;
  const t = [shift.from, shift.to].filter(Boolean).join("–");

  return (
    <li className={`flex flex-col gap-2 p-3 sm:flex-row sm:items-center ${mine ? "bg-gold-50/50" : ""}`}>
      <div className="flex min-w-0 flex-1 items-start gap-2">
        <span className="shrink-0 text-base">{areaEmoji(shift.area)}</span>
        <div className="min-w-0">
          <p className="break-words text-sm font-medium">
            {shift.title || shift.area}
            {t && <span className="ml-2 font-normal text-ink-soft">{t}</span>}
          </p>
          <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs">
            {shift.people.length > 0 ? (
              shift.people.map((p) => (
                <span key={p} className={`chip ${p === me ? "bg-gold-500 text-[#1d1d1f]" : ""}`}>{p}</span>
              ))
            ) : (
              <span className="text-ink-soft/70">zatím nikdo</span>
            )}
            {(shift.backup ?? []).length > 0 && (
              <span className="text-ink-soft">záloha: {(shift.backup ?? []).join(", ")}</span>
            )}
          </div>
        </div>
      </div>
      <div className="flex shrink-0 gap-1.5">
        <button
          className={`rounded-full px-2.5 py-1 text-xs font-medium transition ${mine ? "bg-gold-500 text-[#1d1d1f]" : full ? "bg-paper2 text-ink-soft/50" : "bg-leaf/12 text-leaf-700 hover:bg-leaf/20"}`}
          onClick={async () => {
            if (full && !mine) return;
            const wasMine = mine;
            await dispatch({ type: "signShift", yearId, shiftId: shift.id, name: me });
            if (!wasMine) flash("Přihlášen na směnu", "🙌");
          }}
          disabled={full && !mine}
        >
          {mine ? "Odhlásit" : full ? "Plno" : "Přihlásit"}
        </button>
        <button
          className={`rounded-full px-2.5 py-1 text-xs font-medium transition ${inBackup ? "bg-gold-600/15 text-gold-700" : "bg-paper2 text-ink-soft hover:bg-ink/5"}`}
          onClick={async () => {
            const wasBackup = inBackup;
            await dispatch({ type: "signShiftBackup", yearId, shiftId: shift.id, name: me });
            if (!wasBackup) flash("Jsi záloha na směně", "🫡");
          }}
        >
          {inBackup ? "Záloha ✓" : "Záloha"}
        </button>
        {admin && <DeleteButton onConfirm={() => dispatch({ type: "removeShift", yearId, shiftId: shift.id })} />}
      </div>
    </li>
  );
}

function ShiftCard({ shift, yearId, me }: { shift: Shift; yearId: string; me: string }) {
  const { dispatch } = useStore();
  const admin = isAdmin(me);
  const filled = shift.people.length;
  const cap = shift.capacity;
  const mine = shift.people.includes(me);
  const inBackup = (shift.backup ?? []).includes(me);
  const full = cap > 0 && filled >= cap && !mine;
  const time = timeLabel(shift);

  return (
    <div className={`card flex flex-col p-4 ${mine ? "ring-2 ring-gold-400" : ""}`}>
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
            cap === 0 ? "bg-paper2 text-ink-soft" : full ? "bg-gold-500 text-[#1d1d1f]" : "bg-leaf/12 text-leaf-700"
          }`}
        >
          {cap === 0 ? `${filled} přihlášeno` : full ? "Plno" : `${filled}/${cap} obsazeno`}
        </span>
      </div>

      {shift.people.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {shift.people.map((p) => (
            <span key={p} className={`chip inline-flex items-center gap-1 ${p === me ? "bg-gold-500 text-[#1d1d1f]" : ""}`}>
              {p}
              {admin && (
                <button
                  onClick={() => dispatch({ type: "removeShiftPerson", yearId, shiftId: shift.id, name: p })}
                  className={p === me ? "text-white/70 hover:text-white" : "text-ink-soft/60 hover:text-red-600"}
                  title={`Odebrat ze směny — ${p}`}
                >
                  ✕
                </button>
              )}
            </span>
          ))}
        </div>
      )}

      {(shift.backup ?? []).length > 0 && (
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-xs text-ink-soft">
          <span>záloha:</span>
          {(shift.backup ?? []).map((p) => (
            <span key={p} className={`chip inline-flex items-center gap-1 ${p === me ? "bg-gold-600/15 text-gold-700" : ""}`}>
              {p}
              {admin && (
                <button onClick={() => dispatch({ type: "removeShiftPerson", yearId, shiftId: shift.id, name: p })} className="text-ink-soft/60 hover:text-red-600" title={`Odebrat ze zálohy — ${p}`}>
                  ✕
                </button>
              )}
            </span>
          ))}
        </div>
      )}

      {shift.note && <p className="mt-2 text-xs text-ink-soft">{shift.note}</p>}

      <div className="mt-3 flex gap-2 pt-1">
        {mine ? (
          <button className="btn-secondary flex-1" onClick={() => dispatch({ type: "signShift", yearId, shiftId: shift.id, name: me })}>
            Odhlásit se
          </button>
        ) : full ? (
          <button className="btn-secondary flex-1" disabled>
            Plno
          </button>
        ) : (
          <button
            className="btn-primary flex-1"
            onClick={async () => {
              await dispatch({ type: "signShift", yearId, shiftId: shift.id, name: me });
              flash("Přihlášen na směnu", "🙌");
            }}
          >
            Přihlásit se
          </button>
        )}
        <button
          className={`rounded-full px-3 py-2 text-sm font-medium transition ${inBackup ? "bg-gold-600/15 text-gold-700" : "bg-paper2 text-ink-soft hover:bg-ink/5"}`}
          onClick={async () => {
            const wasBackup = inBackup;
            await dispatch({ type: "signShiftBackup", yearId, shiftId: shift.id, name: me });
            if (!wasBackup) flash("Jsi záloha na směně", "🫡");
          }}
          title="Přihlásit se jako záloha"
        >
          {inBackup ? "Záloha ✓" : "Záloha"}
        </button>
      </div>
    </div>
  );
}
