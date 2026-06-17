"use client";

import { useState } from "react";
import { useStore, type Assembly } from "@/lib/store";
import { formatDate } from "@/lib/format";
import { IconUsers, IconPlus, IconTrash, IconCheck } from "@/components/Icons";

export function AssemblySection({
  propertyId,
  assemblies,
}: {
  propertyId: string;
  assemblies: Assembly[];
}) {
  const { addAssembly, role } = useStore();
  const manage = role === "CREATOR";
  const [open, setOpen] = useState(false);

  const sorted = [...assemblies].sort((a, b) => b.date.localeCompare(a.date));

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const title = String(fd.get("title") || "").trim();
    const date = String(fd.get("date") || "").trim();
    if (!title || !date) return;
    addAssembly(propertyId, {
      title,
      date,
      time: String(fd.get("time") || "").trim() || undefined,
      location: String(fd.get("location") || "").trim() || undefined,
      agenda: String(fd.get("agenda") || "").trim() || undefined,
    });
    e.currentTarget.reset();
    setOpen(false);
  }

  return (
    <section className="card p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <IconUsers className="h-4 w-4 text-teal-700" />
          <h2 className="text-sm font-semibold text-stone-900">Shromáždění vlastníků</h2>
          {assemblies.length > 0 && <span className="text-xs text-stone-400">· {assemblies.length}</span>}
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
          <input name="title" required className="input sm:col-span-2" placeholder="Název (Řádné shromáždění 2026)" />
          <input name="date" type="date" required className="input" />
          <input name="time" type="time" className="input" />
          <input name="location" className="input sm:col-span-2" placeholder="Místo konání" />
          <textarea name="agenda" className="input min-h-24 sm:col-span-2" placeholder={"Program — každý bod na řádek\nSchválení účetní závěrky\nRozpočet a příspěvky\nRůzné"} />
          <button className="btn-secondary sm:col-span-2" type="submit">Přidat shromáždění</button>
        </form>
      )}

      {sorted.length === 0 ? (
        !open && <p className="mt-2 text-sm text-stone-500">Zatím žádná shromáždění.</p>
      ) : (
        <ul className="mt-3 space-y-3">
          {sorted.map((a) => (
            <AssemblyCard key={a.id} propertyId={propertyId} assembly={a} manage={manage} />
          ))}
        </ul>
      )}
    </section>
  );
}

function AssemblyCard({
  propertyId,
  assembly,
  manage,
}: {
  propertyId: string;
  assembly: Assembly;
  manage: boolean;
}) {
  const { updateAssembly, deleteAssembly } = useStore();
  const done = assembly.status === "DONE";
  const [minutes, setMinutes] = useState(assembly.minutes ?? "");
  const [editMin, setEditMin] = useState(false);
  const agenda = (assembly.agenda ?? "").split("\n").map((s) => s.trim()).filter(Boolean);

  return (
    <li className="rounded-xl border border-stone-200 p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-stone-900">{assembly.title}</p>
          <p className="text-xs text-stone-400">
            {formatDate(assembly.date)}
            {assembly.time ? ` · ${assembly.time}` : ""}
            {assembly.location ? ` · ${assembly.location}` : ""}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
              done ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
            }`}
          >
            {done ? "Proběhlo" : "Plánováno"}
          </span>
          {manage && (
            <>
              <button
                onClick={() =>
                  updateAssembly(propertyId, assembly.id, { status: done ? "PLANNED" : "DONE" })
                }
                className="btn-ghost btn-sm text-teal-700"
                title={done ? "Označit jako plánované" : "Označit jako proběhlé"}
              >
                <IconCheck className="h-4 w-4" />
              </button>
              <button
                onClick={() => {
                  if (confirm("Smazat shromáždění?")) deleteAssembly(propertyId, assembly.id);
                }}
                className="btn-ghost btn-sm text-stone-400 hover:text-red-600"
                aria-label="Smazat"
              >
                <IconTrash className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {agenda.length > 0 && (
        <div className="mt-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">Program</p>
          <ol className="mt-1 list-decimal space-y-0.5 pl-5 text-sm text-stone-700">
            {agenda.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ol>
        </div>
      )}

      <div className="mt-3 border-t border-stone-100 pt-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">Zápis</p>
        {manage && editMin ? (
          <div className="mt-1">
            <textarea
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
              className="input min-h-24"
              placeholder="Zápis ze shromáždění…"
            />
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => {
                  updateAssembly(propertyId, assembly.id, { minutes: minutes.trim() || undefined });
                  setEditMin(false);
                }}
                className="btn-primary btn-sm"
              >
                Uložit zápis
              </button>
              <button onClick={() => setEditMin(false)} className="btn-ghost btn-sm">
                Zrušit
              </button>
            </div>
          </div>
        ) : assembly.minutes ? (
          <div className="mt-1">
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-stone-700">{assembly.minutes}</p>
            {manage && (
              <button onClick={() => setEditMin(true)} className="btn-ghost btn-sm mt-1 text-teal-700">
                Upravit zápis
              </button>
            )}
          </div>
        ) : manage ? (
          <button onClick={() => setEditMin(true)} className="btn-ghost btn-sm mt-1 text-teal-700">
            <IconPlus className="h-4 w-4" />
            Přidat zápis
          </button>
        ) : (
          <p className="mt-1 text-sm text-stone-400">Zápis zatím není k dispozici.</p>
        )}
      </div>
    </li>
  );
}
