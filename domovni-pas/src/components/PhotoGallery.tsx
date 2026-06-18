"use client";

import { useState } from "react";
import { useStore, type HousePhoto, type HouseSystem } from "@/lib/store";
import { SYSTEM_KINDS } from "@/lib/systems";
import { formatDate } from "@/lib/format";
import { IconPlus, IconTrash, IconCamera } from "@/components/Icons";

export function PhotoGallery({
  propertyId,
  photos,
  systems,
  editable = true,
  canAdd,
}: {
  propertyId: string;
  photos: HousePhoto[];
  systems: HouseSystem[];
  editable?: boolean;
  canAdd?: boolean;
}) {
  const { addPhoto, deletePhoto } = useStore();
  const add = canAdd ?? editable;
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<string>("all");
  const [busy, setBusy] = useState(false);

  const systemName = (id?: string) => systems.find((s) => s.id === id)?.name;
  const shown = filter === "all" ? photos : photos.filter((p) => (p.systemId ?? "none") === filter);
  const sorted = [...shown].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const file = fd.get("file") as File | null;
    if (!file || !file.size) return;
    setBusy(true);
    const dataUrl = await new Promise<string>((res) => {
      const r = new FileReader();
      r.onload = () => res(String(r.result ?? ""));
      r.readAsDataURL(file);
    });
    addPhoto(propertyId, {
      kind: file.type.startsWith("video") ? "video" : "photo",
      dataUrl,
      fileName: file.name,
      caption: String(fd.get("caption") || "").trim() || undefined,
      room: String(fd.get("room") || "").trim() || undefined,
      systemId: String(fd.get("systemId") || "") || undefined,
    });
    form.reset();
    setBusy(false);
    setOpen(false);
  }

  return (
    <section>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-stone-900">Fotodokumentace</h2>
          <p className="text-sm text-stone-500">As-built fotky a videa — „kudy se vedla elektřina, voda…".</p>
        </div>
        {add && (
          <button onClick={() => setOpen((o) => !o)} className="btn-primary btn-sm">
            <IconPlus className="h-4 w-4" />
            Přidat
          </button>
        )}
      </div>

      {add && open && (
        <form onSubmit={submit} className="card mt-4 space-y-2 p-4">
          <input name="file" type="file" accept="image/*,video/*" capture="environment" required className="block w-full text-sm text-stone-600 file:mr-3 file:rounded-lg file:border-0 file:bg-teal-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-teal-700" />
          <input name="caption" className="input" placeholder="Popis (např. Vedení elektřiny ve stěně)" />
          <div className="grid gap-2 sm:grid-cols-2">
            <input name="room" className="input" placeholder="Místnost (např. Kuchyně)" />
            <select name="systemId" defaultValue="" className="input">
              <option value="">Bez systému</option>
              {systems.map((s) => (
                <option key={s.id} value={s.id}>
                  {SYSTEM_KINDS[s.kind].label} — {s.name}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" disabled={busy} className="btn-primary btn-sm disabled:opacity-50">
            {busy ? "Nahrávám…" : "Uložit"}
          </button>
          <p className="text-xs text-stone-400">
            Demo ukládá média lokálně (omezená velikost). Velká videa a sdílení napříč zařízeními
            poběží po napojení úložiště.
          </p>
        </form>
      )}

      {photos.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          <FilterChip active={filter === "all"} onClick={() => setFilter("all")} label={`Vše · ${photos.length}`} />
          {systems
            .filter((s) => photos.some((p) => p.systemId === s.id))
            .map((s) => (
              <FilterChip
                key={s.id}
                active={filter === s.id}
                onClick={() => setFilter(s.id)}
                label={`${s.name} · ${photos.filter((p) => p.systemId === s.id).length}`}
              />
            ))}
        </div>
      )}

      {sorted.length === 0 ? (
        !open && (
          <div className="card mt-4 flex flex-col items-center px-6 py-10 text-center">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-teal-50 text-teal-700">
              <IconCamera className="h-6 w-6" />
            </span>
            <p className="mt-3 text-sm text-stone-500">
              Zatím žádné fotky. Nafoťte skryté rozvody, než se zakryjí — ušetří to spoustu hádání
              při budoucí rekonstrukci.
            </p>
          </div>
        )
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {sorted.map((ph) => (
            <figure key={ph.id} className="card group overflow-hidden p-0">
              <div className="relative aspect-[4/3] w-full bg-stone-100">
                {ph.kind === "video" ? (
                  // eslint-disable-next-line jsx-a11y/media-has-caption
                  <video src={ph.dataUrl} controls className="h-full w-full object-cover" />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={ph.dataUrl} alt={ph.caption ?? ""} className="h-full w-full object-cover" />
                )}
                {editable && (
                  <button
                    onClick={() => {
                      if (confirm("Smazat?")) deletePhoto(propertyId, ph.id);
                    }}
                    className="absolute right-1.5 top-1.5 rounded-lg bg-white/85 p-1.5 text-stone-500 opacity-0 transition hover:text-red-600 group-hover:opacity-100"
                    aria-label="Smazat"
                  >
                    <IconTrash className="h-4 w-4" />
                  </button>
                )}
              </div>
              <figcaption className="px-3 py-2">
                <p className="truncate text-sm font-medium text-stone-800">{ph.caption || ph.fileName || "Bez názvu"}</p>
                <p className="truncate text-xs text-stone-400">
                  {[ph.room, systemName(ph.systemId), formatDate(ph.createdAt)].filter(Boolean).join(" · ")}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </section>
  );
}

function FilterChip({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-xs font-medium transition ${
        active ? "bg-teal-700 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"
      }`}
    >
      {label}
    </button>
  );
}
