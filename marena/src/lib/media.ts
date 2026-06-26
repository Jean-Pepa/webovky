// Hromadná správa nahraných fotek a účtenek — pro správce (Mařena):
//  • collectMedia: vyjmenuje všechny nahrané soubory napříč ročníky,
//  • downloadMediaZip: stáhne je všechny jako jeden ZIP (složky po ročnících),
//  • deleteBlobs: smaže bloby z úložiště (uvolnění místa na další ročník).
//
// ZIP se skládá ručně (metoda „store", bez komprese) — fotky jsou už JPEG, takže
// by se stejně nezmenšily, a odpadá tím externí knihovna.

import type { DB } from "./types";
import { loadReceipt, deleteReceipt } from "./receipts";

export interface MediaRef {
  blobId: string;
  yearId: string;
  yearLabel: string;
  kind: "uctenka" | "kuchyne";
  name: string; // navržený název souboru (bez přípony)
  fileName?: string; // původní název (u ne-obrázků z kuchyně)
  fileKind?: "image" | "file";
}

// Seznam všech nahraných souborů (účtenky z financí + soubory z kuchyně).
export function collectMedia(db: DB): MediaRef[] {
  const out: MediaRef[] = [];
  for (const y of db.years) {
    const yl = y.label || y.id;
    for (const f of y.finances ?? []) {
      const ids = [...(f.receiptIds ?? []), ...(f.receiptId ? [f.receiptId] : [])];
      const uniq = [...new Set(ids)];
      uniq.forEach((id, i) => {
        out.push({
          blobId: id,
          yearId: y.id,
          yearLabel: yl,
          kind: "uctenka",
          name: `${f.label || "uctenka"}${uniq.length > 1 ? `_${i + 1}` : ""}`,
          fileKind: "image",
        });
      });
    }
    for (const k of y.kitchen ?? []) {
      out.push({
        blobId: k.blobId,
        yearId: y.id,
        yearLabel: yl,
        kind: "kuchyne",
        name: k.label || k.fileName || "soubor",
        fileName: k.fileName,
        fileKind: k.fileKind,
      });
    }
  }
  return out;
}

// Počty souborů po ročnících (pro UI „uvolnit místo").
export function mediaCountsByYear(db: DB): { yearId: string; yearLabel: string; count: number }[] {
  const refs = collectMedia(db);
  return db.years.map((y) => ({
    yearId: y.id,
    yearLabel: y.label || y.id,
    count: refs.filter((r) => r.yearId === y.id).length,
  }));
}

// ---- ZIP (store) --------------------------------------------------------------

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(buf: Uint8Array): number {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (~c) >>> 0;
}

interface ZipEntry {
  path: string;
  data: Uint8Array;
}

function buildZip(entries: ZipEntry[]): Blob {
  const enc = new TextEncoder();
  const parts: Uint8Array[] = [];
  const central: Uint8Array[] = [];
  let offset = 0;

  for (const e of entries) {
    const nameBytes = enc.encode(e.path);
    const crc = crc32(e.data);
    const size = e.data.length;

    const lh = new DataView(new ArrayBuffer(30));
    lh.setUint32(0, 0x04034b50, true); // signatura
    lh.setUint16(4, 20, true); // verze potřebná
    lh.setUint16(6, 0x0800, true); // příznak UTF-8 názvu
    lh.setUint16(8, 0, true); // metoda 0 = store
    lh.setUint16(10, 0, true); // čas
    lh.setUint16(12, 0, true); // datum
    lh.setUint32(14, crc, true);
    lh.setUint32(18, size, true); // komprimovaná velikost
    lh.setUint32(22, size, true); // původní velikost
    lh.setUint16(26, nameBytes.length, true);
    lh.setUint16(28, 0, true); // délka extra
    const lhBytes = new Uint8Array(lh.buffer);
    parts.push(lhBytes, nameBytes, e.data);

    const ch = new DataView(new ArrayBuffer(46));
    ch.setUint32(0, 0x02014b50, true);
    ch.setUint16(4, 20, true);
    ch.setUint16(6, 20, true);
    ch.setUint16(8, 0x0800, true);
    ch.setUint16(10, 0, true);
    ch.setUint16(12, 0, true);
    ch.setUint16(14, 0, true);
    ch.setUint32(16, crc, true);
    ch.setUint32(20, size, true);
    ch.setUint32(24, size, true);
    ch.setUint16(28, nameBytes.length, true);
    ch.setUint16(30, 0, true);
    ch.setUint16(32, 0, true);
    ch.setUint16(34, 0, true);
    ch.setUint16(36, 0, true);
    ch.setUint32(38, 0, true);
    ch.setUint32(42, offset, true);
    const chBytes = new Uint8Array(46 + nameBytes.length);
    chBytes.set(new Uint8Array(ch.buffer), 0);
    chBytes.set(nameBytes, 46);
    central.push(chBytes);

    offset += lhBytes.length + nameBytes.length + size;
  }

  const centralSize = central.reduce((n, c) => n + c.length, 0);
  const eocd = new DataView(new ArrayBuffer(22));
  eocd.setUint32(0, 0x06054b50, true);
  eocd.setUint16(4, 0, true);
  eocd.setUint16(6, 0, true);
  eocd.setUint16(8, entries.length, true);
  eocd.setUint16(10, entries.length, true);
  eocd.setUint32(12, centralSize, true);
  eocd.setUint32(16, offset, true);
  eocd.setUint16(20, 0, true);

  for (const c of central) parts.push(c);
  parts.push(new Uint8Array(eocd.buffer));

  // Sloučení do jednoho pole (čerstvý ArrayBuffer) — kvůli typu BlobPart i menší fragmentaci.
  const total = parts.reduce((n, p) => n + p.length, 0);
  const merged = new Uint8Array(total);
  let pos = 0;
  for (const p of parts) {
    merged.set(p, pos);
    pos += p.length;
  }
  return new Blob([merged], { type: "application/zip" });
}

const MIME_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "application/pdf": "pdf",
};

function dataUrlToBytes(dataUrl: string): { bytes: Uint8Array; ext: string } {
  const comma = dataUrl.indexOf(",");
  const meta = dataUrl.slice(5, comma); // za "data:"
  const isB64 = /;base64/i.test(meta);
  const mime = (meta.split(";")[0] || "application/octet-stream").toLowerCase();
  const dataPart = dataUrl.slice(comma + 1);
  let bytes: Uint8Array;
  if (isB64) {
    const bin = atob(dataPart);
    bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  } else {
    bytes = new TextEncoder().encode(decodeURIComponent(dataPart));
  }
  return { bytes, ext: MIME_EXT[mime] ?? "bin" };
}

function sanitize(s: string): string {
  return (s || "")
    .replace(/[\\/:*?"<>|\n\r\t]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);
}

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

export function dateStamp(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

// Stáhne všechny (nebo zadané) soubory jako jeden ZIP. Vrací počty úspěch/chyba.
export async function downloadMediaZip(
  refs: MediaRef[],
  configured: boolean,
  onProgress?: (done: number, total: number) => void,
): Promise<{ ok: number; failed: number }> {
  const entries: ZipEntry[] = [];
  const used = new Set<string>();
  let ok = 0;
  let failed = 0;

  for (let i = 0; i < refs.length; i++) {
    const r = refs[i];
    const url = await loadReceipt(r.blobId, configured);
    onProgress?.(i + 1, refs.length);
    if (!url || !url.startsWith("data:")) {
      failed++;
      continue;
    }
    const { bytes, ext } = dataUrlToBytes(url);
    let fileExt = ext;
    if (r.fileName && r.fileName.includes(".")) fileExt = sanitize(r.fileName.split(".").pop() || ext) || ext;
    const folder = `${sanitize(r.yearLabel)}/${r.kind === "uctenka" ? "Uctenky" : "Kuchyne"}`;
    const base = sanitize(r.name) || (r.kind === "uctenka" ? "uctenka" : "soubor");
    let path = `${folder}/${base}.${fileExt}`;
    let n = 2;
    while (used.has(path.toLowerCase())) {
      path = `${folder}/${base}_${n}.${fileExt}`;
      n++;
    }
    used.add(path.toLowerCase());
    entries.push({ path, data: bytes });
    ok++;
  }

  if (entries.length) triggerDownload(buildZip(entries), `Marena_fotky_${dateStamp()}.zip`);
  return { ok, failed };
}

// Smaže bloby z úložiště (po dávkách, ať to nezahltí síť). DB reference se mažou
// zvlášť přes akci „clearYearMedia".
export async function deleteBlobs(
  blobIds: string[],
  configured: boolean,
  onProgress?: (done: number, total: number) => void,
): Promise<void> {
  const BATCH = 5;
  let done = 0;
  for (let i = 0; i < blobIds.length; i += BATCH) {
    const chunk = blobIds.slice(i, i + BATCH);
    await Promise.all(chunk.map((id) => deleteReceipt(id, configured)));
    done += chunk.length;
    onProgress?.(Math.min(done, blobIds.length), blobIds.length);
  }
}
