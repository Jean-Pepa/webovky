"use client";

import { useState } from "react";
import { useStore, type Announcement, type AnnouncementCategory } from "@/lib/store";
import { formatDate } from "@/lib/format";
import { ANN_CAT, ANN_CAT_ORDER } from "@/lib/svj";
import { IconMegaphone, IconPlus, IconTrash } from "@/components/Icons";

export function AnnouncementSection({
  propertyId,
  announcements,
  title = "Nástěnka",
}: {
  propertyId: string;
  announcements: Announcement[];
  title?: string;
}) {
  const { addAnnouncement, deleteAnnouncement, role } = useStore();
  const manage = role === "CREATOR";
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
    addAnnouncement(propertyId, {
      title,
      text,
      category: (String(fd.get("category")) as AnnouncementCategory) || "GENERAL",
      pinned: fd.get("pinned") === "on",
    });
    e.currentTarget.reset();
    setOpen(false);
  }

  return (
    <section className="card p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <IconMegaphone className="h-4 w-4 text-teal-700" />
          <h2 className="text-sm font-semibold text-stone-900">{title}</h2>
          {announcements.length > 0 && (
            <span className="text-xs text-stone-400">· {announcements.length}</span>
          )}
        </div>
        {manage && (
          <button onClick={() => setOpen((o) => !o)} className="btn-ghost btn-sm text-teal-700">
            <IconPlus className="h-4 w-4" />
            Přidat
          </button>
        )}
      </div>

      {open && manage && (
        <form onSubmit={submit} className="mt-3 space-y-2 border-b border-stone-100 pb-4">
          <input name="title" required className="input" placeholder="Nadpis oznámení" />
          <select name="category" className="input" defaultValue="GENERAL">
            {ANN_CAT_ORDER.map((c) => (
              <option key={c} value={c}>
                {ANN_CAT[c].label}
              </option>
            ))}
          </select>
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
                  <div className="mt-0.5 flex items-center gap-2">
                    <span
                      className={`rounded px-1.5 py-0.5 text-[11px] font-medium ${ANN_CAT[a.category ?? "GENERAL"].badge}`}
                    >
                      {ANN_CAT[a.category ?? "GENERAL"].label}
                    </span>
                    <span className="text-xs text-stone-400">{formatDate(a.createdAt)}</span>
                  </div>
                </div>
                {manage && (
                  <button
                    onClick={() => {
                      if (confirm("Smazat oznámení?")) deleteAnnouncement(propertyId, a.id);
                    }}
                    className="btn-ghost btn-sm text-stone-400 hover:text-red-600"
                    aria-label="Smazat"
                  >
                    <IconTrash className="h-4 w-4" />
                  </button>
                )}
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-stone-700">{a.text}</p>
            </li>
          ))}
        </ul>
      ) : (
        !open && (
          <p className="mt-2 text-sm text-stone-500">
            {manage
              ? "Zatím žádná oznámení. Napište vlastníkům první vzkaz na nástěnku."
              : "Zatím žádná oznámení."}
          </p>
        )
      )}
    </section>
  );
}
