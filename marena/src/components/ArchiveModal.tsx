"use client";

import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { Modal } from "@/components/Modal";
import { Icon } from "@/components/Icons";
import { downloadArchive } from "@/lib/export";
import { collectMedia, mediaCountsByYear, downloadMediaZip, deleteBlobs } from "@/lib/media";

// Okno „Stáhnout / archiv" pro správce: PDF dokumentace, ZIP všech fotek/účtenek
// a uvolnění místa (smazání fotek ročníku) pro další roky.
export function ArchiveModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { db, configured, dispatch } = useStore();
  const [zipBusy, setZipBusy] = useState(false);
  const [zipProgress, setZipProgress] = useState<{ done: number; total: number } | null>(null);
  const [zipResult, setZipResult] = useState<string | null>(null);
  const [delBusyYear, setDelBusyYear] = useState<string | null>(null);
  const [delMsg, setDelMsg] = useState<string | null>(null);

  const allMedia = useMemo(() => (db ? collectMedia(db) : []), [db]);
  const counts = useMemo(() => (db ? mediaCountsByYear(db) : []), [db]);
  const totalMedia = allMedia.length;

  if (!db) return null;

  async function downloadZip() {
    setZipBusy(true);
    setZipResult(null);
    setZipProgress({ done: 0, total: totalMedia });
    const res = await downloadMediaZip(allMedia, configured, (done, total) => setZipProgress({ done, total }));
    setZipBusy(false);
    setZipProgress(null);
    setZipResult(
      res.ok
        ? `Hotovo — staženo ${res.ok} souborů${res.failed ? `, ${res.failed} se nepovedlo načíst` : ""}.`
        : "Nepodařilo se načíst žádný soubor.",
    );
  }

  async function deleteYearMedia(yearId: string, label: string) {
    if (!db) return;
    const refs = collectMedia(db).filter((r) => r.yearId === yearId);
    setDelBusyYear(yearId);
    setDelMsg(null);
    await deleteBlobs(refs.map((r) => r.blobId), configured);
    await dispatch({ type: "clearYearMedia", yearId });
    setDelBusyYear(null);
    setDelMsg(`Smazáno ${refs.length} fotek/účtenek z „${label}". Místo se uvolnilo.`);
  }

  return (
    <Modal open={open} onClose={onClose} title="Stáhnout / archiv">
      <div className="space-y-5 text-sm">
        {/* 1) PDF */}
        <section className="rounded-2xl border border-black/10 p-4">
          <div className="flex items-start gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-ink/5 text-ink">
              <Icon name="book" className="h-5 w-5" />
            </span>
            <div className="flex-1">
              <p className="font-semibold">Kompletní archiv do PDF</p>
              <p className="text-xs text-ink-soft">Všechny ročníky a almanach jako dokument k tisku / uložení do PDF.</p>
            </div>
          </div>
          <button
            onClick={() => {
              downloadArchive(db);
              onClose();
            }}
            className="btn-primary mt-3 w-full justify-center"
          >
            <Icon name="download" className="h-4 w-4" /> Otevřít PDF
          </button>
        </section>

        {/* 2) ZIP fotek */}
        <section className="rounded-2xl border border-black/10 p-4">
          <div className="flex items-start gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-leaf/12 text-leaf-700">
              <Icon name="image" className="h-5 w-5" />
            </span>
            <div className="flex-1">
              <p className="font-semibold">Všechny fotky a účtenky (ZIP)</p>
              <p className="text-xs text-ink-soft">
                {totalMedia > 0
                  ? `${totalMedia} souborů ze všech ročníků, roztříděných do složek.`
                  : "Zatím nejsou nahrané žádné fotky ani účtenky."}
              </p>
            </div>
          </div>
          <button
            onClick={downloadZip}
            disabled={zipBusy || totalMedia === 0}
            className="btn-primary mt-3 w-full justify-center disabled:opacity-50"
          >
            <Icon name="download" className="h-4 w-4" />
            {zipBusy
              ? `Stahuji… ${zipProgress ? `${zipProgress.done}/${zipProgress.total}` : ""}`
              : "Stáhnout ZIP"}
          </button>
          {zipResult && <p className="mt-2 text-xs text-ink-soft">{zipResult}</p>}
        </section>

        {/* 3) Uvolnit místo */}
        <section className="rounded-2xl border border-red-200 bg-red-50/40 p-4">
          <div className="flex items-start gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-red-100 text-red-700">
              <Icon name="close" className="h-5 w-5" />
            </span>
            <div className="flex-1">
              <p className="font-semibold">Uvolnit místo (smazat fotky/účtenky)</p>
              <p className="text-xs text-ink-soft">
                Trvale smaže nahrané fotky a účtenky daného ročníku a uvolní místo na další rok. Texty (částky, popisy,
                tým…) zůstanou. Nejdřív si je stáhni přes ZIP nahoře.
              </p>
            </div>
          </div>
          <div className="mt-3 space-y-2">
            {counts.map((c) => (
              <div key={c.yearId} className="flex items-center justify-between gap-2 rounded-xl bg-white px-3 py-2">
                <span className="text-sm">
                  {c.yearLabel} <span className="text-ink-soft">· {c.count} fotek/účtenek</span>
                </span>
                {delBusyYear === c.yearId ? (
                  <span className="text-xs text-ink-soft">Mažu…</span>
                ) : c.count > 0 ? (
                  <ConfirmDelete onConfirm={() => deleteYearMedia(c.yearId, c.yearLabel)} />
                ) : (
                  <span className="text-xs text-ink-soft">prázdné</span>
                )}
              </div>
            ))}
          </div>
          {delMsg && <p className="mt-2 text-xs font-medium text-leaf-700">{delMsg}</p>}
        </section>
      </div>
    </Modal>
  );
}

// Mazání na dvě kliknutí (bez nativního confirm).
function ConfirmDelete({ onConfirm }: { onConfirm: () => void }) {
  const [armed, setArmed] = useState(false);
  if (armed) {
    return (
      <span className="inline-flex items-center gap-1">
        <button className="btn-danger" onClick={onConfirm}>
          Opravdu smazat?
        </button>
        <button className="btn-ghost px-2 py-1 text-xs" onClick={() => setArmed(false)}>
          Ne
        </button>
      </span>
    );
  }
  return (
    <button className="btn-danger" onClick={() => setArmed(true)}>
      Smazat
    </button>
  );
}
