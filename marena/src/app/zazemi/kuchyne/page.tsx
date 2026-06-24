"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { Icon } from "@/components/Icons";
import { Modal } from "@/components/Modal";
import { DeleteButton } from "@/components/DeleteButton";
import { compressImage, readFileAsDataUrl, saveReceipt, loadReceipt, deleteReceipt } from "@/lib/receipts";
import { fmtDate } from "@/lib/format";
import { uid } from "@/lib/id";
import type { KitchenFile } from "@/lib/types";

const CATS = ["Nákupy", "Menu", "Ostatní"];
const MAX_FILE_BYTES = 1_300_000; // ~1,3 MB pro ne-obrázky (fotky se zmenší samy)

export default function KuchynePage() {
  const { currentYear, me, dispatch, configured, canEditCurrentYear } = useStore();
  const [category, setCategory] = useState("Nákupy");
  const [label, setLabel] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const year = currentYear;
  if (!year) return null;
  const editable = canEditCurrentYear;
  const files = year.kitchen ?? [];

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !year) return;
    setBusy(true);
    setErr(null);
    try {
      const isImage = file.type.startsWith("image/");
      let dataUrl: string;
      if (isImage) {
        dataUrl = await compressImage(file);
      } else {
        if (file.size > MAX_FILE_BYTES) {
          setErr("Soubor je moc velký (max ~1,3 MB). Fotky řešit nemusíš — zmenší se samy.");
          setBusy(false);
          return;
        }
        dataUrl = await readFileAsDataUrl(file);
      }
      const blobId = uid("kb_");
      const ok = await saveReceipt(blobId, dataUrl, configured);
      if (!ok) {
        setErr("Nahrání se nepovedlo (soubor možná moc velký).");
        setBusy(false);
        return;
      }
      await dispatch({
        type: "addKitchenFile",
        yearId: year.id,
        label,
        category,
        blobId,
        fileKind: isImage ? "image" : "file",
        fileName: file.name,
        author: me,
      });
      setLabel("");
    } catch {
      setErr("Něco se pokazilo při nahrávání.");
    } finally {
      setBusy(false);
    }
  }

  // Seskupení podle kategorie (známé pořadí + případné ostatní).
  const known = new Set(CATS);
  const extraCats = [...new Set(files.map((f) => f.category).filter((c) => !known.has(c)))];
  const groups = [...CATS, ...extraCats].map((cat) => ({ cat, items: files.filter((f) => f.category === cat) }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Kuchyně</h1>
      </div>

      {/* Nahrání */}
      {editable ? (
        <div className="card space-y-3 p-4">
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <label className="label">Kam to patří</label>
              <select
                className="rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="min-w-[200px] flex-1">
              <label className="label">Popis (nepovinné)</label>
              <input
                className="input"
                placeholder="např. Nákup Makro – sobota, Menu úterý"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
              />
            </div>
            <label className="btn-primary cursor-pointer">
              <Icon name="download" className="h-4 w-4 rotate-180" />
              {busy ? "Nahrávám…" : "Nahrát foto / soubor"}
              <input type="file" accept="image/*,application/pdf,.pdf,.doc,.docx,.xls,.xlsx,.txt" className="hidden" onChange={onFile} disabled={busy} />
            </label>
          </div>
          {err && <p className="text-sm text-red-600">{err}</p>}
        </div>
      ) : (
        <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          🔒 Tento ročník je uzamčený — soubory jdou jen prohlížet a stahovat, ne přidávat.
        </p>
      )}

      {/* Galerie po kategoriích */}
      {files.length === 0 ? (
        <div className="card grid place-items-center p-10 text-center text-sm text-ink-soft">
          Zatím tu nic není. Nahraj první nákupní seznam nebo menu.
        </div>
      ) : (
        groups
          .filter((g) => g.items.length > 0)
          .map((g) => (
            <section key={g.cat} className="space-y-3">
              <h2 className="font-display text-lg font-semibold">
                {g.cat} <span className="text-sm font-normal text-ink-soft">({g.items.length})</span>
              </h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {g.items.map((item) => (
                  <KitchenCard key={item.id} item={item} yearId={year.id} editable={editable} />
                ))}
              </div>
            </section>
          ))
      )}
    </div>
  );
}

function KitchenCard({ item, yearId, editable }: { item: KitchenFile; yearId: string; editable: boolean }) {
  const { configured, dispatch } = useStore();
  const [viewing, setViewing] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(false);

  async function open() {
    setBusy(true);
    setErr(false);
    const url = await loadReceipt(item.blobId, configured);
    setBusy(false);
    if (!url) {
      setErr(true);
      return;
    }
    if (item.fileKind === "image") {
      setViewing(url);
    } else {
      const a = document.createElement("a");
      a.href = url;
      a.download = item.fileName || item.label || "soubor";
      a.click();
    }
  }

  async function remove() {
    await deleteReceipt(item.blobId, configured);
    await dispatch({ type: "removeKitchenFile", yearId, fileId: item.id });
  }

  return (
    <div className="card p-3">
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-marigold-50 text-marigold-700">
          <Icon name={item.fileKind === "image" ? "image" : "file"} className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="break-words font-semibold">{item.label}</p>
          <p className="text-xs text-ink-soft">
            {item.author} · {fmtDate(item.createdAt)}
            {item.fileName ? ` · ${item.fileName}` : ""}
          </p>
        </div>
        {editable && <DeleteButton onConfirm={remove} />}
      </div>
      <div className="mt-2 flex items-center gap-2">
        <button className="btn-secondary px-3 py-1.5 text-xs" onClick={open} disabled={busy}>
          {busy ? "Načítám…" : item.fileKind === "image" ? "Zobrazit foto" : "Stáhnout soubor"}
        </button>
        {err && <span className="text-xs text-red-600">nepovedlo se</span>}
      </div>

      <Modal open={viewing !== null} onClose={() => setViewing(null)} title={item.label}>
        {viewing && (
          <div className="space-y-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={viewing} alt={item.label} className="max-h-[70vh] w-full rounded-xl object-contain" />
            <a href={viewing} target="_blank" rel="noreferrer" className="btn-secondary w-full">
              Otevřít v plné velikosti
            </a>
          </div>
        )}
      </Modal>
    </div>
  );
}
