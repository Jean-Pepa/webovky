import "server-only";
import { mkdir, writeFile, readFile, unlink } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { randomBytes } from "crypto";

// Lokální objektové úložiště. Abstrakce kvůli pozdějšímu přechodu na S3 (report, sekce 13).
const ROOT = path.join(process.cwd(), "storage");

export type StoredFile = {
  key: string;
  fileName: string;
  mimeType: string;
  size: number;
};

export async function saveFile(file: File): Promise<StoredFile> {
  const buf = Buffer.from(await file.arrayBuffer());
  const ext = path.extname(file.name).slice(0, 12);
  const key = `${Date.now()}-${randomBytes(8).toString("hex")}${ext}`;
  if (!existsSync(ROOT)) await mkdir(ROOT, { recursive: true });
  await writeFile(path.join(ROOT, key), buf);
  return {
    key,
    fileName: file.name,
    mimeType: file.type || "application/octet-stream",
    size: buf.length,
  };
}

export async function readStoredFile(key: string): Promise<Buffer | null> {
  const safe = path.basename(key); // ochrana proti path traversal
  const full = path.join(ROOT, safe);
  if (!existsSync(full)) return null;
  return readFile(full);
}

export async function deleteStoredFile(key: string): Promise<void> {
  try {
    await unlink(path.join(ROOT, path.basename(key)));
  } catch {
    // soubor nemusí existovat (např. seed) – ignorujeme
  }
}
