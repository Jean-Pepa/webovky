"use client";

import { useState } from "react";
import { useStore, type DesignProposal } from "@/lib/store";
import { ROLE_LABELS, ROLE_INITIALS } from "@/lib/access";
import { formatDate } from "@/lib/format";
import { fileToMedia } from "@/lib/media";
import { IconCamera, IconPlus, IconTrash, IconFile } from "@/components/Icons";

export function DesignSection({
  propertyId,
  designs,
  editable = true,
}: {
  propertyId: string;
  designs: DesignProposal[];
  editable?: boolean;
}) {
  const { addDesign, deleteDesign } = useStore();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const sorted = [...designs].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const title = String(fd.get("title") || "").trim();
    if (!title) return;
    const input = form.elements.namedItem("files") as HTMLInputElement | null;
    const files = Array.from(input?.files ?? []);
    setBusy(true);
    const media = [];
    for (const f of files) media.push(await fileToMedia(f));
    addDesign(propertyId, { title, note: String(fd.get("note") || "").trim() || undefined, media });
    form.reset();
    setBusy(false);
    setOpen(false);
  }

  return (
    <section className="card mt-8 p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <IconCamera className="h-4 w-4 text-teal-700" />
          <h2 className="text-sm font-semibold text-stone-900">Návrhy</h2>
          {designs.length > 0 && <span className="text-xs text-stone-400">· {designs.length}</span>}
        </div>
        {editable && (
          <button onClick={() => setOpen((o) => !o)} className="btn-ghost btn-sm text-teal-700">
            <IconPlus className="h-4 w-4" />
            Nahrát návrh
          </button>
        )}
      </div>

      {editable && open && (
        <form onSubmit={submit} className="mt-3 space-y-2 border-b border-stone-100 pb-4">
          <input name="title" required className="input" placeholder="Název návrhu — např. Studie v3, Vizualizace fasády" />
          <textarea name="note" className="input min-h-20" placeholder="Poznámka k návrhu (volitelné)…" />
          <label className="flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-stone-300 p-6 text-center hover:bg-stone-50">
            <IconCamera className="h-7 w-7 text-stone-400" />
            <span className="text-sm font-medium text-stone-700">Vyberte obrázky / soubory návrhu</span>
            <span className="text-xs text-stone-400">PDF, JPG, PNG — klidně víc najednou</span>
            <input name="files" type="file" accept="image/*,application/pdf" multiple className="hidden" />
          </label>
          <button type="submit" className="btn-secondary w-full" disabled={busy}>
            {busy ? "Nahrávám…" : "Přidat návrh"}
          </button>
        </form>
      )}

      {sorted.length > 0 ? (
        <ul className="mt-3 space-y-4">
          {sorted.map((d) => {
            const images = d.media.filter((m) => m.kind === "image" && m.dataUrl);
            const files = d.media.filter((m) => m.kind !== "image");
            return (
              <li key={d.id} className="rounded-xl border border-stone-200 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-teal-700 text-[11px] font-semibold text-white">
                      {ROLE_INITIALS[d.authorRole]}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-stone-900">{d.title}</p>
                      <p className="text-xs text-stone-400">
                        {ROLE_LABELS[d.authorRole]} · {formatDate(d.createdAt)}
                      </p>
                    </div>
                  </div>
                  {editable && (
                    <button
                      onClick={() => {
                        if (confirm("Smazat návrh?")) deleteDesign(propertyId, d.id);
                      }}
                      className="btn-ghost btn-sm text-stone-400 hover:text-red-600"
                      aria-label="Smazat"
                    >
                      <IconTrash className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {d.note && <p className="mt-2 text-sm leading-relaxed text-stone-600">{d.note}</p>}

                {images.length > 0 && (
                  <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {images.map((m) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <a key={m.id} href={m.dataUrl} target="_blank" rel="noreferrer" className="block">
                        <img
                          src={m.dataUrl}
                          alt={m.name}
                          className="h-32 w-full rounded-lg border border-stone-200 object-cover transition hover:opacity-90"
                        />
                      </a>
                    ))}
                  </div>
                )}

                {files.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {files.map((m) => (
                      <li key={m.id}>
                        <a
                          href={m.dataUrl}
                          download={m.name}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm text-teal-700 hover:underline"
                        >
                          <IconFile className="h-4 w-4" />
                          {m.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        !open && (
          <p className="mt-2 text-sm text-stone-500">
            Zatím žádné návrhy. {editable ? "Nahrávejte sem průběžně studie a vizualizace." : "Architekt sem bude průběžně nahrávat studie a vizualizace."}
          </p>
        )
      )}
    </section>
  );
}
