"use client";

import { useEffect, useState } from "react";
import {
  listMedia,
  uploadMedia,
  signedMediaUrls,
  deleteMedia,
  type DbMedia,
} from "@/lib/db/files";
import { formatDate } from "@/lib/format";
import { IconCamera, IconPlus, IconTrash } from "@/components/Icons";

export function CloudPhotos({ houseId, canEdit }: { houseId: string; canEdit: boolean }) {
  const [items, setItems] = useState<DbMedia[] | null>(null);
  const [urls, setUrls] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  async function load() {
    setError(null);
    try {
      const list = await listMedia(houseId);
      setItems(list);
      setUrls(await signedMediaUrls(list.map((m) => m.storage_path)));
    } catch (e) {
      setItems([]);
      setError(e instanceof Error ? e.message : "Načtení fotek selhalo.");
    }
  }
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [houseId]);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const file = fd.get("file") as File | null;
    if (!file || !file.size) return;
    setBusy(true);
    setError(null);
    try {
      await uploadMedia(houseId, file, {
        caption: String(fd.get("caption") || ""),
        room: String(fd.get("room") || ""),
      });
      form.reset();
      setOpen(false);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Nahrání selhalo.");
    }
    setBusy(false);
  }

  return (
    <section className="card mt-6 p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <IconCamera className="h-4 w-4 text-teal-700" />
          <h2 className="text-sm font-semibold text-stone-900">Fotodokumentace</h2>
          {items && items.length > 0 && <span className="text-xs text-stone-400">· {items.length}</span>}
        </div>
        {canEdit && (
          <button onClick={() => setOpen((o) => !o)} className="btn-ghost btn-sm text-teal-700">
            <IconPlus className="h-4 w-4" />
            Přidat
          </button>
        )}
      </div>

      {canEdit && open && (
        <form onSubmit={submit} className="mt-3 space-y-2 border-b border-stone-100 pb-4">
          <input
            name="file"
            type="file"
            accept="image/*,video/*"
            capture="environment"
            required
            className="block w-full text-sm text-stone-600 file:mr-3 file:rounded-lg file:border-0 file:bg-teal-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-teal-700"
          />
          <input name="caption" className="input" placeholder="Popis (např. Vedení elektřiny ve stěně)" />
          <input name="room" className="input" placeholder="Místnost (např. Kuchyně)" />
          <button type="submit" disabled={busy} className="btn-secondary w-full disabled:opacity-50">
            {busy ? "Nahrávám…" : "Nahrát do cloudu"}
          </button>
        </form>
      )}

      {error && <div className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

      {items === null ? (
        <p className="mt-3 text-sm text-stone-400">Načítám…</p>
      ) : items.length === 0 ? (
        <p className="mt-2 text-sm text-stone-500">Zatím žádné fotky ani videa.</p>
      ) : (
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {items.map((m) => (
            <figure key={m.id} className="group relative overflow-hidden rounded-xl border border-stone-200">
              <div className="aspect-[4/3] w-full bg-stone-100">
                {m.kind === "video" ? (
                  // eslint-disable-next-line jsx-a11y/media-has-caption
                  <video src={urls[m.storage_path]} controls className="h-full w-full object-cover" />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={urls[m.storage_path]} alt={m.caption ?? ""} className="h-full w-full object-cover" />
                )}
                {canEdit && (
                  <button
                    onClick={async () => {
                      if (!confirm("Smazat?")) return;
                      try {
                        await deleteMedia(m.id, m.storage_path);
                        await load();
                      } catch (e) {
                        setError(e instanceof Error ? e.message : "Smazání selhalo.");
                      }
                    }}
                    className="absolute right-1.5 top-1.5 rounded-lg bg-white/85 p-1.5 text-stone-500 opacity-0 transition hover:text-red-600 group-hover:opacity-100"
                    aria-label="Smazat"
                  >
                    <IconTrash className="h-4 w-4" />
                  </button>
                )}
              </div>
              <figcaption className="px-3 py-2">
                <p className="truncate text-sm font-medium text-stone-800">{m.caption || "Bez názvu"}</p>
                <p className="truncate text-xs text-stone-400">
                  {[m.room, formatDate(m.created_at)].filter(Boolean).join(" · ")}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </section>
  );
}
