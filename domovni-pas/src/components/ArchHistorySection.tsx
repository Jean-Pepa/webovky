"use client";

import { useState } from "react";
import { useStore, type ArchMilestone } from "@/lib/store";
import { IconBuilding, IconPlus, IconTrash } from "@/components/Icons";

export function ArchHistorySection({
  propertyId,
  milestones,
  editable = true,
}: {
  propertyId: string;
  milestones: ArchMilestone[];
  editable?: boolean;
}) {
  const { addMilestone, deleteMilestone } = useStore();
  const [open, setOpen] = useState(false);

  const sorted = [...milestones].sort((a, b) => a.year - b.year || a.createdAt.localeCompare(b.createdAt));

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const year = Number(String(fd.get("year") || "").trim());
    const title = String(fd.get("title") || "").trim();
    if (!year || !title) return;
    addMilestone(propertyId, { year, title, note: String(fd.get("note") || "").trim() || undefined });
    form.reset();
    setOpen(false);
  }

  return (
    <section className="card mt-6 p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <IconBuilding className="h-4 w-4 text-teal-700" />
          <h2 className="text-sm font-semibold text-stone-900">Architektonická historie</h2>
          {milestones.length > 0 && (
            <span className="text-xs text-stone-400">· {milestones.length}</span>
          )}
        </div>
        {editable && (
          <button onClick={() => setOpen((o) => !o)} className="btn-ghost btn-sm text-teal-700">
            <IconPlus className="h-4 w-4" />
            Přidat
          </button>
        )}
      </div>

      {editable && open && (
        <form onSubmit={submit} className="mt-3 space-y-2 border-b border-stone-100 pb-4">
          <div className="grid grid-cols-3 gap-2">
            <input name="year" type="number" required className="input" placeholder="Rok" />
            <input
              name="title"
              required
              className="input col-span-2"
              placeholder="Událost — např. Přístavba, Rekonstrukce fasády"
            />
          </div>
          <input name="note" className="input" placeholder="Poznámka (volitelné)" />
          <button type="submit" className="btn-secondary w-full">
            Přidat do historie
          </button>
        </form>
      )}

      {sorted.length > 0 ? (
        <ol className="mt-4">
          {sorted.map((m, i) => (
            <li key={m.id} className="flex gap-4">
              <div className="flex flex-col items-center pt-1.5">
                <span className="h-3 w-3 shrink-0 rounded-full bg-teal-600" />
                {i < sorted.length - 1 && <span className="mt-1 w-px flex-1 bg-stone-200" />}
              </div>
              <div className="flex-1 pb-5">
                <div className="flex items-start justify-between gap-2">
                  <p>
                    <span className="text-base font-semibold text-teal-700">{m.year}</span>
                    <span className="ml-2 font-medium text-stone-800">{m.title}</span>
                  </p>
                  {editable && (
                    <button
                      onClick={() => {
                        if (confirm("Smazat milník?")) deleteMilestone(propertyId, m.id);
                      }}
                      className="btn-ghost btn-sm shrink-0 text-stone-400 hover:text-red-600"
                      aria-label="Smazat"
                    >
                      <IconTrash className="h-4 w-4" />
                    </button>
                  )}
                </div>
                {m.note && <p className="mt-0.5 text-sm text-stone-500">{m.note}</p>}
              </div>
            </li>
          ))}
        </ol>
      ) : (
        !open && (
          <p className="mt-2 text-sm text-stone-500">
            Zatím žádné milníky. Zapisujte klíčové okamžiky stavby — návrh, realizaci, přístavby,
            rekonstrukce. Vznikne tak životopis stavby.
          </p>
        )
      )}
    </section>
  );
}
