"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { compressImage, saveReceipt, loadReceipt, deleteReceipt } from "@/lib/receipts";
import { uid } from "@/lib/id";
import { ImageViewer } from "@/components/ImageViewer";

// Nahrávání + zobrazení galerie obrázků podle id (ukládá se přes receipts).
// `ids` drží rodič, `onChange` mu vrací novou sadu po přidání/odebrání.
// Klik na obrázek ho zvětší na celou obrazovku. Přidávat/mazat jen když canEdit.
export function ImageBoard({
  ids,
  onChange,
  canEdit,
  addLabel = "Přidat obrázek",
  thumb = "h-24 w-24",
}: {
  ids: string[];
  onChange: (ids: string[]) => void;
  canEdit: boolean;
  addLabel?: string;
  thumb?: string;
}) {
  const { configured } = useStore();
  const [urls, setUrls] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);
  const [viewIdx, setViewIdx] = useState<number | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      for (const id of ids) {
        const url = await loadReceipt(id, configured);
        if (alive && url) setUrls((p) => (p[id] ? p : { ...p, [id]: url }));
      }
    })();
    return () => {
      alive = false;
    };
  }, [ids, configured]);

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (!files.length) return;
    setUploading(true);
    const added: string[] = [];
    try {
      for (const file of files) {
        const url = await compressImage(file);
        const id = uid("img_");
        if (await saveReceipt(id, url, configured)) {
          added.push(id);
          setUrls((p) => ({ ...p, [id]: url }));
        }
      }
    } catch {
      /* přeskočíme */
    } finally {
      setUploading(false);
    }
    if (added.length) onChange([...ids, ...added]);
  }
  async function remove(id: string) {
    await deleteReceipt(id, configured).catch(() => {});
    onChange(ids.filter((x) => x !== id));
  }

  const ready = ids.filter((id) => urls[id]).map((id) => ({ id, url: urls[id] }));

  if (!canEdit && ready.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {ready.map((it, i) => (
        <div key={it.id} className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={it.url}
            alt="obrázek"
            onClick={() => setViewIdx(i)}
            className={`${thumb} cursor-zoom-in rounded-lg object-cover ring-1 ring-ink/10 transition hover:opacity-90`}
          />
          {canEdit && (
            <button
              type="button"
              onClick={() => remove(it.id)}
              className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-ink text-xs text-white shadow"
              aria-label="Odebrat obrázek"
            >
              ✕
            </button>
          )}
        </div>
      ))}
      {canEdit && (
        <label className={`${thumb} grid cursor-pointer place-items-center rounded-lg border-2 border-dashed border-ink/20 px-1 text-center text-[11px] font-medium text-ink-soft transition hover:bg-ink/5`}>
          <span>{uploading ? "Nahrávám…" : `📷 ${addLabel}`}</span>
          <input type="file" accept="image/*" multiple className="hidden" onChange={onPick} disabled={uploading} />
        </label>
      )}
      <ImageViewer images={ready.map((r) => r.url)} index={viewIdx} onIndex={setViewIdx} />
    </div>
  );
}
