"use client";

import { useState } from "react";
import { useStore, type Announcement } from "@/lib/store";
import { formatDate } from "@/lib/format";
import { IconMegaphone, IconPlus, IconTrash } from "@/components/Icons";

export function AnnouncementSection({
  propertyId,
  announcements,
}: {
  propertyId: string;
  announcements: Announcement[];
}) {
  const { addAnnouncement, deleteAnnouncement } = useStore();
  const [open, setOpen] = useState(false);

  const sorted = [...announcements].sort((a, b) => {
    if (!!b.pinned !== !!a.pinned) return b.pinned ? 1 : -1;
    return b.createdAt.localeCompare(a.createdAt);
  });

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const title = String(fd.get("title") || "").trim();
    const text = String(fd.get("text") || "").trim();
    if (!title || !text) return;
    addAnnouncement(propertyId, { title, text, pinned: fd.get("pinned") === "on" });
    e.currentTarget.reset();
    setOpen(false);
  }

  return (
    <section className="card p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <IconMegaphone className="h-4 w-4 text-teal-700" />
          <h2 className="text-sm font-semibold text-stone-900">Nástěnka</h2>
          {announcements.length > 0 && (
            <span className="text-xs text-stone-400">· {announcements.length}</span>
          )}
        </div>
        <button onClick={() => setOpen((o) => !o)} className="btn-ghost btn-sm text-teal-700">
          <IconPlus className="h-4 w-4" />
          Přidat
        </button>
      </div>

      {open && (
        <form onSubmit={submit} className="mt-3 space-y-2 border-b border-stone-100 pb-4">
          <input name="title" required className="input" placeholder="Nadpis oznámení" />
          <textarea name="text" required className="input min-h-24" placeholder="Text oznámení pro vlastníky…" />
          <label className="flex items-center gap-2 text-sm text-stone-600">
            <input type="checkbox" name="pinned" className="h-4 w-4 accent-teal-700" />
            Připnout nahoru
          </label>
          <button className="btn-secondary w-full" type="submit">
            Zveřejnit na nástěnce
          </button>
        </form>
      )}

      {sorted.length > 0 ? (
        <ul className="mt-3 space-y-3">
          {sorted.map((a) => (
            <li
              key={a.id}
              className={`rounded-xl border p-3.5 ${
                a.pinned ? "border-amber-200 bg-amber-50/50" : "border-stone-200"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-stone-900">
                    {a.pinned && <span className="mr-1.5 text-amber-600">📌</span>}
                    {a.title}
                  </p>
                  <p className="text-xs text-stone-400">{formatDate(a.createdAt)}</p>
                </div>
                <button
                  onClick={() => {
                    if (confirm("Smazat oznámení?")) deleteAnnouncement(propertyId, a.id);
                  }}
                  className="btn-ghost btn-sm text-stone-400 hover:text-red-600"
                  aria-label="Smazat"
                >
                  <IconTrash className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-stone-700">{a.text}</p>
            </li>
          ))}
        </ul>
      ) : (
        !open && (
          <p className="mt-2 text-sm text-stone-500">
            Zatím žádná oznámení. Napište vlastníkům první vzkaz na nástěnku.
          </p>
        )
      )}
    </section>
  );
}
