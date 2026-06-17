"use client";

import { useState } from "react";
import { useStore, type SvjEvent } from "@/lib/store";
import { formatDate } from "@/lib/format";
import { IconCalendar, IconPlus, IconTrash } from "@/components/Icons";

export function EventsSection({ propertyId, events }: { propertyId: string; events: SvjEvent[] }) {
  const { addEvent, deleteEvent, role } = useStore();
  const manage = role === "CREATOR";
  const [open, setOpen] = useState(false);

  const today = new Date().toISOString().slice(0, 10);
  const sorted = [...events].sort((a, b) => a.date.localeCompare(b.date));
  const upcoming = sorted.filter((e) => e.date >= today);
  const past = sorted.filter((e) => e.date < today).reverse();

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const title = String(fd.get("title") || "").trim();
    const date = String(fd.get("date") || "").trim();
    if (!title || !date) return;
    addEvent(propertyId, {
      title,
      date,
      time: String(fd.get("time") || "").trim() || undefined,
      kind: String(fd.get("kind") || "").trim() || undefined,
      note: String(fd.get("note") || "").trim() || undefined,
    });
    e.currentTarget.reset();
    setOpen(false);
  }

  return (
    <section className="card p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <IconCalendar className="h-4 w-4 text-teal-700" />
          <h2 className="text-sm font-semibold text-stone-900">Kalendář a termíny</h2>
          {events.length > 0 && <span className="text-xs text-stone-400">· {events.length}</span>}
        </div>
        {manage && (
          <button onClick={() => setOpen((o) => !o)} className="btn-ghost btn-sm text-teal-700">
            <IconPlus className="h-4 w-4" />
            Přidat
          </button>
        )}
      </div>

      {open && manage && (
        <form onSubmit={submit} className="mt-3 grid gap-2 border-b border-stone-100 pb-4 sm:grid-cols-2">
          <input name="title" required className="input sm:col-span-2" placeholder="Název (Shromáždění vlastníků)" />
          <input name="date" type="date" required className="input" defaultValue={today} />
          <input name="time" type="time" className="input" />
          <input name="kind" className="input sm:col-span-2" placeholder="Typ (schůze / shromáždění / termín)" />
          <textarea name="note" className="input min-h-16 sm:col-span-2" placeholder="Poznámka (místo, program…)" />
          <button className="btn-secondary sm:col-span-2" type="submit">
            Přidat do kalendáře
          </button>
        </form>
      )}

      {events.length === 0 ? (
        !open && <p className="mt-2 text-sm text-stone-500">Zatím žádné události.</p>
      ) : (
        <div className="mt-3 space-y-4">
          {upcoming.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">Nadcházející</p>
              <ul className="mt-1.5 space-y-2">
                {upcoming.map((e) => (
                  <EventRow key={e.id} ev={e} manage={manage} onDelete={() => deleteEvent(propertyId, e.id)} highlight />
                ))}
              </ul>
            </div>
          )}
          {past.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">Proběhlé</p>
              <ul className="mt-1.5 space-y-2">
                {past.slice(0, 5).map((e) => (
                  <EventRow key={e.id} ev={e} manage={manage} onDelete={() => deleteEvent(propertyId, e.id)} />
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function EventRow({
  ev,
  manage,
  onDelete,
  highlight,
}: {
  ev: SvjEvent;
  manage: boolean;
  onDelete: () => void;
  highlight?: boolean;
}) {
  return (
    <li className={`flex items-start justify-between gap-3 rounded-xl border p-3 ${highlight ? "border-teal-200 bg-teal-50/40" : "border-stone-200"}`}>
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white text-center ring-1 ring-stone-200">
          <span className="text-sm font-semibold leading-none text-stone-800">
            {new Date(`${ev.date}T00:00:00`).getDate()}
          </span>
          <span className="text-[10px] uppercase text-stone-400">
            {new Date(`${ev.date}T00:00:00`).toLocaleDateString("cs-CZ", { month: "short" })}
          </span>
        </div>
        <div>
          <p className="text-sm font-medium text-stone-800">{ev.title}</p>
          <p className="text-xs text-stone-400">
            {formatDate(ev.date)}
            {ev.time ? ` · ${ev.time}` : ""}
            {ev.kind ? ` · ${ev.kind}` : ""}
          </p>
          {ev.note && <p className="mt-0.5 text-xs text-stone-500">{ev.note}</p>}
        </div>
      </div>
      {manage && (
        <button
          onClick={() => {
            if (confirm("Smazat událost?")) onDelete();
          }}
          className="shrink-0 text-stone-300 hover:text-red-600"
          aria-label="Smazat"
        >
          <IconTrash className="h-4 w-4" />
        </button>
      )}
    </li>
  );
}
