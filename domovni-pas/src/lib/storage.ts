import "server-only";
import { mkdir, writeFile, readFile, unlink } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { randomBytes } from "crypto";
import { put, del } from "@vercel/blob";

// Objektové úložiště s abstrakcí (report, sekce 13).
// Produkce: Vercel Blob (aktivní, když je nastaven BLOB_READ_WRITE_TOKEN).
// Lokální vývoj bez tokenu: soubory na disku v /storage.
// storageKey je u Blobu plná URL, lokálně název souboru – rozlišujeme podle "http".

const ROOT = path.join(process.cwd(), "storage");
const useBlob = () => !!process.env.BLOB_READ_WRITE_TOKEN;
const isUrl = (key: string) => /^https?:\/\//.test(key);

export type StoredFile = {
  key: string;
  fileName: string;
  mimeType: string;
  size: number;
};

export async function saveFile(file: File): Promise<StoredFile> {
  const buf = Buffer.from(await file.arrayBuffer());
  const mimeType = file.type || "application/octet-stream";
  const ext = path.extname(file.name).slice(0, 12);
  const name = `${Date.now()}-${randomBytes(8).toString("hex")}${ext}`;

  if (useBlob()) {
    const blob = await put(name, buf, {
      access: "public",
      contentType: mimeType,
      addRandomSuffix: false,
    });
    return { key: blob.url, fileName: file.name, mimeType, size: buf.length };
  }

  if (!existsSync(ROOT)) await mkdir(ROOT, { recursive: true });
  await writeFile(path.join(ROOT, name), buf);
  return { key: name, fileName: file.name, mimeType, size: buf.length };
}

export async function readStoredFile(key: string): Promise<Buffer | null> {
  if (isUrl(key)) {
    try {
      const res = await fetch(key);
      if (!res.ok) return null;
      return Buffer.from(await res.arrayBuffer());
    } catch {
      return null;
    }
  }
  const full = path.join(ROOT, path.basename(key)); // ochrana proti path traversal
  if (!existsSync(full)) return null;
  return readFile(full);
}

export async function deleteStoredFile(key: string): Promise<void> {
  try {
    if (isUrl(key)) {
      await del(key);
      return;
    }
    await unlink(path.join(ROOT, path.basename(key)));
  } catch {
    // soubor nemusí existovat – ignorujeme
  }
}
