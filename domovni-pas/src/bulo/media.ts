"use client";

import { useEffect, useState } from "react";

// Fotky a soubory nahrané v aplikaci leží v IndexedDB (v tomto prohlížeči).
// Ve stavu se na ně odkazuje jako "idb:<id>"; statické obrázky mají běžnou URL.

const DB_NAME = "bulo-media";
const STORE = "files";
let dbp: Promise<IDBDatabase> | null = null;

function db(): Promise<IDBDatabase> {
  if (!dbp) {
    dbp = new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = () => req.result.createObjectStore(STORE);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }
  return dbp;
}

export async function putBlob(id: string, blob: Blob): Promise<void> {
  const d = await db();
  await new Promise<void>((resolve, reject) => {
    const tx = d.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(blob, id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getBlob(id: string): Promise<Blob | null> {
  const d = await db();
  return new Promise((resolve, reject) => {
    const tx = d.transaction(STORE, "readonly");
    const req = tx.objectStore(STORE).get(id);
    req.onsuccess = () => resolve((req.result as Blob) ?? null);
    req.onerror = () => reject(req.error);
  });
}

export async function clearBlobs(): Promise<void> {
  try {
    const d = await db();
    await new Promise<void>((resolve) => {
      const tx = d.transaction(STORE, "readwrite");
      tx.objectStore(STORE).clear();
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    });
  } catch {
    // nic
  }
  urlCache.clear();
}

const urlCache = new Map<string, string>();

export async function resolveMedia(src: string): Promise<string | null> {
  if (!src.startsWith("idb:")) return src;
  const hit = urlCache.get(src);
  if (hit) return hit;
  const blob = await getBlob(src.slice(4));
  if (!blob) return null;
  const url = URL.createObjectURL(blob);
  urlCache.set(src, url);
  return url;
}

/** URL pro <img>: statická cesta rovnou, "idb:" asynchronně z IndexedDB. */
export function useMediaUrl(src?: string): string | undefined {
  const [entry, setEntry] = useState<{ src: string; url: string } | null>(null);
  useEffect(() => {
    if (!src || !src.startsWith("idb:") || urlCache.has(src)) return;
    let alive = true;
    resolveMedia(src)
      .then((url) => {
        if (alive && url) setEntry({ src, url });
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [src]);
  if (!src) return undefined;
  if (!src.startsWith("idb:")) return src;
  return urlCache.get(src) ?? (entry?.src === src ? entry.url : undefined);
}

function rid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

/** Zmenší fotku (delší strana max `max` px) a uloží; vrátí "idb:<id>". */
export async function saveImage(blob: Blob, max = 1400, q = 0.8): Promise<string> {
  const small = await compressImage(blob, max, q).catch(() => blob);
  const id = rid();
  await putBlob(id, small);
  const ref = `idb:${id}`;
  urlCache.set(ref, URL.createObjectURL(small));
  return ref;
}

export async function saveFile(file: Blob): Promise<string> {
  const id = rid();
  await putBlob(id, file);
  const ref = `idb:${id}`;
  urlCache.set(ref, URL.createObjectURL(file));
  return ref;
}

export async function compressImage(blob: Blob, max: number, q: number): Promise<Blob> {
  const bmp = await createImageBitmap(blob);
  const k = Math.min(1, max / Math.max(bmp.width, bmp.height));
  const w = Math.round(bmp.width * k);
  const h = Math.round(bmp.height * k);
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  if (!ctx) return blob;
  ctx.drawImage(bmp, 0, 0, w, h);
  bmp.close();
  return new Promise((resolve) => c.toBlob((b) => resolve(b ?? blob), "image/jpeg", q));
}

/** Data URL pro odeslání AI (statické obrázky se stáhnou). */
export async function toDataUrl(src: string, max = 1024): Promise<string | null> {
  try {
    const url = await resolveMedia(src);
    if (!url) return null;
    const res = await fetch(url);
    let blob = await res.blob();
    if (blob.type.startsWith("image/")) blob = await compressImage(blob, max, 0.8).catch(() => blob);
    return await new Promise((resolve) => {
      const r = new FileReader();
      r.onload = () => resolve(typeof r.result === "string" ? r.result : null);
      r.onerror = () => resolve(null);
      r.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

export function fileMeta(f: File): string {
  const kb = f.size / 1024;
  const size = kb > 1024 ? `${(kb / 1024).toFixed(1).replace(".", ",")} MB` : `${Math.max(1, Math.round(kb))} kB`;
  return size;
}
