"use client";

import { useEffect, useState } from "react";
import {
  listDocuments,
  uploadDocument,
  documentUrl,
  deleteDocument,
  type DbDocument,
} from "@/lib/db/files";
import { DOCUMENT_CATEGORIES } from "@/lib/enums";
import { formatDate } from "@/lib/format";
import { IconFile, IconPlus, IconTrash, IconDownload } from "@/components/Icons";

export function CloudDocuments({
  houseId,
  canEdit,
  onCount,
}: {
  houseId: string;
  canEdit: boolean;
  onCount?: (n: number) => void;
}) {
  const [docs, setDocs] = useState<DbDocument[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  async function load() {
    setError(null);
    try {
      const list = await listDocuments(houseId);
      setDocs(list);
      onCount?.(list.length);
    } catch (e) {
      setDocs([]);
      setError(e instanceof Error ? e.message : "Načtení dokumentů selhalo.");
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
      await uploadDocument(houseId, file, {
        title: String(fd.get("title") || ""),
        category: String(fd.get("category") || "OTHER"),
      });
      form.reset();
      setOpen(false);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Nahrání selhalo.");
    }
    setBusy(false);
  }

  async function openDoc(d: DbDocument) {
    try {
      const url = await documentUrl(d.storage_path);
      window.open(url, "_blank");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Otevření selhalo.");
    }
  }

  return (
    <section className="card mt-6 p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <IconFile className="h-4 w-4 text-teal-700" />
          <h2 className="text-sm font-semibold text-stone-900">Dokumentace</h2>
          {docs && docs.length > 0 && <span className="text-xs text-stone-400">· {docs.length}</span>}
        </div>
        {canEdit && (
          <button onClick={() => setOpen((o) => !o)} className="btn-ghost btn-sm text-teal-700">
            <IconPlus className="h-4 w-4" />
            Nahrát
          </button>
        )}
      </div>

      {canEdit && open && (
        <form onSubmit={submit} className="mt-3 space-y-2 border-b border-stone-100 pb-4">
          <input name="title" className="input" placeholder="Název (volitelné)" />
          <select name="category" defaultValue="PLAN" className="input">
            {Object.entries(DOCUMENT_CATEGORIES).map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
          <input name="file" type="file" required className="block w-full text-sm text-stone-600 file:mr-3 file:rounded-lg file:border-0 file:bg-teal-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-teal-700" />
          <button type="submit" disabled={busy} className="btn-secondary w-full disabled:opacity-50">
            {busy ? "Nahrávám…" : "Nahrát do cloudu"}
          </button>
        </form>
      )}

      {error && <div className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

      {docs === null ? (
        <p className="mt-3 text-sm text-stone-400">Načítám…</p>
      ) : docs.length === 0 ? (
        <p className="mt-2 text-sm text-stone-500">Zatím žádné dokumenty.</p>
      ) : (
        <ul className="mt-3 divide-y divide-stone-100">
          {docs.map((d) => (
            <li key={d.id} className="flex items-center justify-between gap-3 py-2.5">
              <button onClick={() => openDoc(d)} className="min-w-0 flex-1 text-left">
                <p className="truncate text-sm font-medium text-stone-800 hover:text-teal-700">{d.title}</p>
                <p className="truncate text-xs text-stone-400">
                  {DOCUMENT_CATEGORIES[d.category ?? "OTHER"] ?? d.category} · {formatDate(d.created_at)}
                </p>
              </button>
              <div className="flex shrink-0 items-center gap-2">
                <button onClick={() => openDoc(d)} className="text-stone-400 hover:text-teal-700" aria-label="Stáhnout">
                  <IconDownload className="h-4 w-4" />
                </button>
                {canEdit && (
                  <button
                    onClick={async () => {
                      if (!confirm("Smazat dokument?")) return;
                      try {
                        await deleteDocument(d.id, d.storage_path);
                        await load();
                      } catch (e) {
                        setError(e instanceof Error ? e.message : "Smazání selhalo.");
                      }
                    }}
                    className="text-stone-300 hover:text-red-600"
                    aria-label="Smazat"
                  >
                    <IconTrash className="h-4 w-4" />
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
