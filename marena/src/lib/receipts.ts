// Účtenky (fotky) — klientské funkce. Foto se zmenší a uloží buď na server
// (Redis, sdílené) nebo do localStorage (demo režim tohoto prohlížeče).

const lsKey = (id: string) => `marena_receipt_${id}`;

// Zmenší fotku přes canvas, ať base64 není obrovský (úložiště i přenos).
export async function compressImage(file: File, maxDim = 1280, quality = 0.6): Promise<string> {
  const dataUrl: string = await new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(String(r.result));
    r.onerror = rej;
    r.readAsDataURL(file);
  });
  const img: HTMLImageElement = await new Promise((res, rej) => {
    const im = new Image();
    im.onload = () => res(im);
    im.onerror = rej;
    im.src = dataUrl;
  });
  let { width, height } = img;
  const m = Math.max(width, height);
  if (m > maxDim) {
    const s = maxDim / m;
    width = Math.round(width * s);
    height = Math.round(height * s);
  }
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return dataUrl;
  ctx.drawImage(img, 0, 0, width, height);
  return canvas.toDataURL("image/jpeg", quality);
}

// Načte libovolný soubor jako data URL (base64) — pro ne-obrázky (PDF, …).
export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(String(r.result));
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}

export async function saveReceipt(id: string, dataUrl: string, configured: boolean): Promise<boolean> {
  if (configured) {
    const res = await fetch(`/api/receipt/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dataUrl }),
    }).catch(() => null);
    return !!(res && res.ok);
  }
  try {
    localStorage.setItem(lsKey(id), dataUrl);
    return true;
  } catch {
    return false; // localStorage je plný (fotka moc velká)
  }
}

export async function loadReceipt(id: string, configured: boolean): Promise<string | null> {
  if (configured) {
    const res = await fetch(`/api/receipt/${id}`, { cache: "no-store" }).catch(() => null);
    if (res && res.ok) {
      const j = (await res.json()) as { dataUrl?: string };
      return j.dataUrl ?? null;
    }
    return null;
  }
  return localStorage.getItem(lsKey(id));
}

export async function deleteReceipt(id: string, configured: boolean): Promise<void> {
  if (configured) {
    await fetch(`/api/receipt/${id}`, { method: "DELETE" }).catch(() => null);
  } else {
    try {
      localStorage.removeItem(lsKey(id));
    } catch {
      /* ignore */
    }
  }
}
