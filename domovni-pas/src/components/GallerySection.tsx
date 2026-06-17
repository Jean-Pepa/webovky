"use client";

import { useState } from "react";
import { useStore, type GalleryPhoto } from "@/lib/store";
import { formatDate } from "@/lib/format";
import { IconPlus, IconTrash, IconCamera } from "@/components/Icons";

export function GallerySection({
  propertyId,
  photos,
}: {
  propertyId: string;
  photos: GalleryPhoto[];
}) {
  const { addPhoto, deletePhoto, role } = useStore();
  const manage = role === "CREATOR";
  const [busy, setBusy] = useState(false);

  const sorted = [...photos].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setBusy(true);
    let remaining = files.length;
    for (const f of files) {
      const reader = new FileReader();
      reader.onload = () => {
        addPhoto(propertyId, String(reader.result ?? ""), f.name.replace(/\.[^.]+$/, ""));
        remaining--;
        if (remaining === 0) setBusy(false);
      };
      reader.readAsDataURL(f);
    }
    e.target.value = "";
  }

  return (
    <section className="card p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <IconCamera className="h-4 w-4 text-teal-700" />
          <h2 className="text-sm font-semibold text-stone-900">Fotogalerie</h2>
          {photos.length > 0 && <span className="text-xs text-stone-400">· {photos.length}</span>}
        </div>
        {manage && (
          <label className="btn-ghost btn-sm cursor-pointer text-teal-700">
            <IconPlus className="h-4 w-4" />
            {busy ? "Nahrávám…" : "Přidat fotky"}
            <input type="file" accept="image/*" multiple className="hidden" onChange={onFiles} />
          </label>
        )}
      </div>

      {sorted.length === 0 ? (
        <p className="mt-2 text-sm text-stone-500">Zatím žádné fotky.</p>
      ) : (
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {sorted.map((ph) => (
            <figure key={ph.id} className="group relative overflow-hidden rounded-xl border border-stone-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={ph.dataUrl} alt={ph.caption ?? ""} className="aspect-[4/3] w-full object-cover" />
              <figcaption className="flex items-center justify-between gap-2 px-2 py-1.5">
                <span className="min-w-0">
                  <span className="block truncate text-xs font-medium text-stone-700">{ph.caption || "Bez názvu"}</span>
                  <span className="block text-[11px] text-stone-400">{formatDate(ph.createdAt)}</span>
                </span>
                {manage && (
                  <button
                    onClick={() => {
                      if (confirm("Smazat fotku?")) deletePhoto(propertyId, ph.id);
                    }}
                    className="shrink-0 text-stone-300 hover:text-red-600"
                    aria-label="Smazat"
                  >
                    <IconTrash className="h-4 w-4" />
                  </button>
                )}
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </section>
  );
}
