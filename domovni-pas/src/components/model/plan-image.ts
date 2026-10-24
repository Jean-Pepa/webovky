// Příprava obrázku půdorysu pro uložení v prohlížeči: rastr se zmenší (max 2400 px, JPEG),
// SVG do 800 kB zůstane, jak je. PDF zatím neumíme.

export type PreparedPlan = {
  dataUrl: string;
  width: number;
  height: number;
  fileName: string;
  bytes: number; // přibližná velikost uložených dat
  kind: "svg" | "raster";
};

export class PlanFileError extends Error {}

const MAX_SIDE = 2400;
const SVG_MAX_BYTES = 800 * 1024;
const TARGET_CHARS = 1_200_000; // ~900 kB — kvůli místu v prohlížeči (Safari má jen ~2,5 mil. znaků)

const RASTER_TYPES = ["image/png", "image/jpeg", "image/webp"];
const RASTER_EXT = /\.(png|jpe?g|webp)$/i;

export const PLAN_ACCEPT = "image/png,image/jpeg,image/webp,image/svg+xml,.svg,application/pdf,.pdf";

function readAsDataUrl(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () =>
      typeof reader.result === "string" ? resolve(reader.result) : reject(new Error("read"));
    reader.onerror = () => reject(new Error("read"));
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("image"));
    img.src = src;
  });
}

function dataUrlBytes(url: string): number {
  const i = url.indexOf(",");
  const body = url.slice(i + 1);
  return url.slice(0, i).includes(";base64") ? Math.round((body.length * 3) / 4) : body.length;
}

// Rozměr SVG z width/height (px, mm, cm…) nebo z viewBox
const UNIT_PX: Record<string, number> = { "": 1, px: 1, pt: 4 / 3, pc: 16, mm: 96 / 25.4, cm: 96 / 2.54, in: 96 };

function svgLength(v: string | null): number | null {
  if (!v) return null;
  const m = /^\s*([\d.]+)\s*(px|pt|pc|mm|cm|in)?\s*$/i.exec(v);
  if (!m) return null;
  const n = parseFloat(m[1]) * (UNIT_PX[(m[2] ?? "").toLowerCase()] ?? 1);
  return n > 0 && Number.isFinite(n) ? n : null;
}

function svgSize(text: string): { width: number; height: number } | null {
  const doc = new DOMParser().parseFromString(text, "image/svg+xml");
  const root = doc.documentElement;
  if (!root || root.nodeName.toLowerCase() !== "svg" || doc.getElementsByTagName("parsererror").length) {
    throw new PlanFileError("Soubor SVG se nepodařilo přečíst. Zkuste ho uložit znovu nebo nahrajte PNG/JPG.");
  }
  const vb = (root.getAttribute("viewBox") ?? "").trim().split(/[\s,]+/).map(Number);
  const vbW = vb.length === 4 && vb[2] > 0 ? vb[2] : null;
  const vbH = vb.length === 4 && vb[3] > 0 ? vb[3] : null;
  let w = svgLength(root.getAttribute("width"));
  let h = svgLength(root.getAttribute("height"));
  if (w && !h && vbW && vbH) h = (w * vbH) / vbW;
  if (h && !w && vbW && vbH) w = (h * vbW) / vbH;
  if (!w || !h) {
    w = vbW;
    h = vbH;
  }
  if (!w || !h) return null;
  // velmi malé SVG (viewBox v metrech apod.) zvětšíme, ať mají tloušťky čar rozumné měřítko
  const scale = Math.max(w, h) < 800 ? 1000 / Math.max(w, h) : 1;
  return { width: Math.round(w * scale), height: Math.round(h * scale) };
}

// Vykreslí obrázek do JPEG; když je moc velký, zkusí nižší kvalitu a menší rozměr
function rasterize(img: CanvasImageSource, srcW: number, srcH: number, maxSide: number) {
  const attempts: [number, number][] = [
    [maxSide, 0.8],
    [maxSide, 0.7],
    [Math.min(maxSide, 2000), 0.68],
    [Math.min(maxSide, 1600), 0.65],
    [Math.min(maxSide, 1280), 0.6],
  ];
  let out: { dataUrl: string; width: number; height: number } | null = null;
  for (const [side, q] of attempts) {
    const scale = Math.min(1, side / Math.max(srcW, srcH));
    const width = Math.max(1, Math.round(srcW * scale));
    const height = Math.max(1, Math.round(srcH * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new PlanFileError("Prohlížeč neumí obrázek zpracovat.");
    ctx.fillStyle = "#ffffff"; // průhledné PNG/SVG na bílém
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);
    out = { dataUrl: canvas.toDataURL("image/jpeg", q), width, height };
    if (out.dataUrl.length <= TARGET_CHARS) break;
  }
  if (!out) throw new PlanFileError("Obrázek se nepodařilo zpracovat.");
  return out;
}

export async function preparePlanImage(file: File): Promise<PreparedPlan> {
  const name = file.name || "pudorys";
  const type = file.type.toLowerCase();

  if (type === "application/pdf" || /\.pdf$/i.test(name)) {
    throw new PlanFileError(
      "PDF zatím neumíme. Otevřete výkres a uložte potřebnou stránku jako obrázek (PNG nebo JPG) — třeba „Exportovat jako obrázek“ nebo snímkem obrazovky — a nahrajte ho sem.",
    );
  }

  if (type === "image/svg+xml" || /\.svg$/i.test(name)) {
    const text = await file.text();
    const dims = svgSize(text);
    const dataUrl = await readAsDataUrl(new Blob([text], { type: "image/svg+xml" }));
    let width = dims?.width;
    let height = dims?.height;
    if (!width || !height) {
      const img = await loadImage(dataUrl).catch(() => null);
      width = img?.naturalWidth || 1000;
      height = img?.naturalHeight || 700;
    }
    if (file.size <= SVG_MAX_BYTES) {
      return { dataUrl, width, height, fileName: name, bytes: dataUrlBytes(dataUrl), kind: "svg" };
    }
    // velké SVG převedeme na obrázek
    const img = await loadImage(dataUrl).catch(() => {
      throw new PlanFileError("SVG je příliš velké a nepodařilo se ho převést. Nahrajte ho prosím jako PNG nebo JPG.");
    });
    try {
      const r = rasterize(img, width, height, MAX_SIDE);
      return { ...r, fileName: name, bytes: dataUrlBytes(r.dataUrl), kind: "raster" };
    } catch (e) {
      if (e instanceof PlanFileError) throw e;
      throw new PlanFileError("SVG je příliš velké a nepodařilo se ho převést. Nahrajte ho prosím jako PNG nebo JPG.");
    }
  }

  if (!RASTER_TYPES.includes(type) && !RASTER_EXT.test(name)) {
    throw new PlanFileError("Nahrajte prosím obrázek PNG, JPG, WebP nebo SVG.");
  }

  const url = URL.createObjectURL(file);
  try {
    const img = await loadImage(url).catch(() => {
      throw new PlanFileError("Obrázek se nepodařilo otevřít. Zkuste ho uložit jako PNG nebo JPG.");
    });
    const w = img.naturalWidth;
    const h = img.naturalHeight;
    if (w < 100 || h < 100) {
      throw new PlanFileError("Obrázek je příliš malý — půdorys by nebyl čitelný (min. 100 × 100 px).");
    }
    const r = rasterize(img, w, h, MAX_SIDE);
    return { ...r, fileName: name, bytes: dataUrlBytes(r.dataUrl), kind: "raster" };
  } finally {
    URL.revokeObjectURL(url);
  }
}
