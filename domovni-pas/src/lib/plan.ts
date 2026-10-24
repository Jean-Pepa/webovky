// Geometrie půdorysu — čisté funkce (souřadnice, přesnost, zásah klepnutím, výřez, měřítko).
// Souřadnice podkladu = px obrázku (0…width, 0…height); uložená poloha prvku je 0–1.

import type { AccuracyClass } from "./store";

export type Pt = [number, number];
export type Box = { x: number; y: number; w: number; h: number };
// Pohled prohlížeče: x, y = bod podkladu v levém horním rohu, k = px obrazovky na 1 px podkladu
export type View = { x: number; y: number; k: number };

export function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

export function clamp01(v: number): number {
  return clamp(v, 0, 1);
}

const round = (v: number, digits: number) => {
  const f = 10 ** digits;
  return Math.round(v * f) / f;
};

export function distance(a: Pt, b: Pt): number {
  return Math.hypot(a[0] - b[0], a[1] - b[1]);
}

export function polylineLength(pts: Pt[]): number {
  let sum = 0;
  for (let i = 1; i < pts.length; i++) sum += distance(pts[i - 1], pts[i]);
  return sum;
}

export function bbox(points: Pt[]): Box | null {
  if (points.length === 0) return null;
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const [x, y] of points) {
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  }
  return { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
}

// px podkladu → 0–1 (zaokrouhleno, ať se do úložiště nepíšou zbytečně dlouhá čísla)
export function normalizePoint(p: Pt, w: number, h: number): Pt {
  return [round(clamp01(p[0] / w), 5), round(clamp01(p[1] / h), 5)];
}

export function denormalizePoint(p: Pt, w: number, h: number): Pt {
  return [p[0] * w, p[1] * h];
}

export function normalizePoints(pts: Pt[], w: number, h: number): Pt[] {
  return pts.map((p) => normalizePoint(p, w, h));
}

export function denormalizePoints(pts: Pt[], w: number, h: number): Pt[] {
  return pts.map((p) => denormalizePoint(p, w, h));
}

// Vzdálenost bodu od úsečky a–b
export function pointToSegmentDistance(p: Pt, a: Pt, b: Pt): number {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len2 = dx * dx + dy * dy;
  if (len2 === 0) return distance(p, a);
  const t = clamp(((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / len2, 0, 1);
  return distance(p, [a[0] + t * dx, a[1] + t * dy]);
}

export function pointToPolylineDistance(p: Pt, pts: Pt[]): number {
  if (pts.length === 0) return Infinity;
  if (pts.length === 1) return distance(p, pts[0]);
  let best = Infinity;
  for (let i = 1; i < pts.length; i++) {
    best = Math.min(best, pointToSegmentDistance(p, pts[i - 1], pts[i]));
  }
  return best;
}

// SVG cesta lomené čáry
export function polylinePath(pts: Pt[]): string {
  return pts
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${round(x, 2)} ${round(y, 2)}`)
    .join("");
}

// --- Přesnost: tenká čára = změřeno, široký pruh = odhad ---------------------

// line / dash / bandMin = px obrazovky; bandRel = podíl delší strany podkladu (když chybí měřítko)
export const PLAN_STYLE: Record<
  AccuracyClass,
  { line: number; lineOpacity: number; dash?: [number, number]; bandMin: number; bandRel: number; bandOpacity: number }
> = {
  MEASURED: { line: 2, lineOpacity: 1, bandMin: 0, bandRel: 0, bandOpacity: 0.16 },
  DRAWING: { line: 3.5, lineOpacity: 0.85, bandMin: 8, bandRel: 0.008, bandOpacity: 0.2 },
  ESTIMATE: { line: 1.75, lineOpacity: 1, dash: [6, 5], bandMin: 16, bandRel: 0.03, bandOpacity: 0.22 },
};

export function planSize(w: number, h: number): number {
  return Math.max(w, h, 1);
}

// Šířka pruhu přesnosti v px podkladu (celá šířka = 2 × ±přesnost). 0 = bez pruhu.
// S měřítkem skutečná šířka (accuracyMm / 1000 × pxPerMeter × 2), jinak podle třídy přesnosti.
// Vždy aspoň viditelné minimum (px obrazovky / k) a nanejvýš pětina podkladu.
export function accuracyBandWidth(opts: {
  cls: AccuracyClass;
  accuracyMm?: number;
  pxPerMeter?: number;
  planSize: number;
  k: number;
}): number {
  const st = PLAN_STYLE[opts.cls];
  const k = opts.k > 0 ? opts.k : 1;
  const real =
    opts.pxPerMeter && opts.pxPerMeter > 0 && opts.accuracyMm != null && opts.accuracyMm > 0
      ? (opts.accuracyMm / 1000) * opts.pxPerMeter * 2
      : undefined;
  const max = opts.planSize * 0.2;
  if (opts.cls === "MEASURED") {
    // změřeno: jen tenká čára; pruh jen tehdy, když je skutečná přesnost znatelně širší než čára
    if (real == null) return 0;
    const w = Math.min(real, max);
    return w * k >= st.line * 2.5 ? w : 0;
  }
  const w = real ?? st.bandRel * opts.planSize;
  return Math.min(Math.max(w, st.bandMin / k), Math.max(max, st.bandMin / k));
}

// Značka zařízení: poloměr jádra (px obrazovky) a kruhu přesnosti
export const MARKER_CORE_PX = 7;
const HALO = {
  MEASURED: { rel: 0, minExtra: 0 },
  DRAWING: { rel: 0.01, minExtra: 5 },
  ESTIMATE: { rel: 0.025, minExtra: 11 },
} as const;

// Poloměr kruhu přesnosti kolem zařízení v px podkladu (= ±přesnost). 0 = bez kruhu.
// S měřítkem skutečný, jinak podle třídy; vždy viditelně větší než značka.
export function accuracyHaloRadius(opts: {
  cls: AccuracyClass;
  accuracyMm?: number;
  pxPerMeter?: number;
  planSize: number;
  k: number;
}): number {
  const k = opts.k > 0 ? opts.k : 1;
  const real =
    opts.pxPerMeter && opts.pxPerMeter > 0 && opts.accuracyMm != null && opts.accuracyMm > 0
      ? (opts.accuracyMm / 1000) * opts.pxPerMeter
      : undefined;
  const max = opts.planSize * 0.2;
  const core = MARKER_CORE_PX / k;
  if (opts.cls === "MEASURED") {
    if (real == null) return 0;
    const r = Math.min(real, max);
    return r > core + 2 / k ? r : 0;
  }
  const h = HALO[opts.cls];
  const min = core + h.minExtra / k;
  return Math.min(Math.max(real ?? h.rel * opts.planSize, min), Math.max(max, min));
}

// Tolerance zásahu klepnutím (px podkladu) — štědrá, ať se trefí i prstem.
// reach = poloviční šířka pruhu (trasa) / poloměr kruhu přesnosti (zařízení)
export function hitTolerance(isPoint: boolean, reach: number, k: number): number {
  const kk = k > 0 ? k : 1;
  if (isPoint) return Math.max(22 / kk, Math.min(reach, 44 / kk));
  return Math.max(16 / kk, Math.min(reach, 40 / kk));
}

export type HitTarget = { id: string; points: Pt[]; tol: number };

// Nejbližší prvek v dosahu; body (zařízení) mají přednost před trasami, které k nim vedou.
export function hitTest(p: Pt, targets: HitTarget[]): string | null {
  let best: { id: string; score: number } | null = null;
  for (const t of targets) {
    if (t.points.length === 0 || t.tol <= 0) continue;
    const d = pointToPolylineDistance(p, t.points);
    if (d > t.tol) continue;
    const score = (d / t.tol) * (t.points.length === 1 ? 0.6 : 1);
    if (!best || score < best.score) best = { id: t.id, score };
  }
  return best?.id ?? null;
}

// --- Pohled (posun, zoom) ---------------------------------------------------

// Vměstná box do kontejneru (cw × ch px) s okrajem pad px
export function fitView(box: Box, cw: number, ch: number, pad = 12): View {
  const w = Math.max(box.w, 1);
  const h = Math.max(box.h, 1);
  const k = Math.max(Math.min((cw - pad * 2) / w, (ch - pad * 2) / h), 1e-4);
  return { x: box.x + w / 2 - cw / (2 * k), y: box.y + h / 2 - ch / (2 * k), k };
}

// Zoom kolem bodu obrazovky (sx, sy) — bod pod kurzorem/prsty zůstane na místě
export function zoomAt(v: View, k: number, sx: number, sy: number): View {
  const px = v.x + sx / v.k;
  const py = v.y + sy / v.k;
  return { x: px - sx / k, y: py - sy / k, k };
}

export function screenToPlan(v: View, sx: number, sy: number): Pt {
  return [v.x + sx / v.k, v.y + sy / v.k];
}

// Podklad nesmí úplně utéct z obrazovky (aspoň kus zůstane vidět)
export function clampView(v: View, w: number, h: number, cw: number, ch: number): View {
  const vw = cw / v.k;
  const vh = ch / v.k;
  const mx = Math.min(w, vw) * 0.25;
  const my = Math.min(h, vh) * 0.25;
  return {
    k: v.k,
    x: clamp(v.x, mx - vw, w - mx),
    y: clamp(v.y, my - vh, h - my),
  };
}

export function viewBoxOf(v: View, cw: number, ch: number): string {
  return `${round(v.x, 3)} ${round(v.y, 3)} ${round(cw / v.k, 3)} ${round(ch / v.k, 3)}`;
}

// --- Výřez pro náhled (PlanMini) --------------------------------------------

// Výřez kolem bodů s okrajem; aspoň minFrac delší strany podkladu (ať je vidět kontext),
// v poměru stran aspect (šířka / výška), posunutý dovnitř podkladu, kde to jde.
export function cropAround(
  points: Pt[],
  w: number,
  h: number,
  opts: { minFrac?: number; aspect?: number; padFrac?: number } = {},
): Box {
  const size = planSize(w, h);
  const minFrac = opts.minFrac ?? 0.3;
  const aspect = opts.aspect ?? 16 / 10;
  const b = bbox(points) ?? { x: w / 2, y: h / 2, w: 0, h: 0 };
  const pad = Math.max(Math.max(b.w, b.h) * (opts.padFrac ?? 0.2), size * 0.05);
  let cw = Math.max(b.w + pad * 2, size * minFrac);
  let ch = Math.max(b.h + pad * 2, (size * minFrac) / aspect);
  if (cw / ch > aspect) ch = cw / aspect;
  else cw = ch * aspect;
  // nikdy víc než celý podklad (v poměru stran výřezu)
  const maxW = Math.max(w, h * aspect);
  if (cw > maxW) {
    cw = maxW;
    ch = cw / aspect;
  }
  const cx = b.x + b.w / 2;
  const cy = b.y + b.h / 2;
  const fit = (c: number, len: number, total: number) =>
    len >= total ? total / 2 - len / 2 : clamp(c - len / 2, 0, total - len);
  return { x: fit(cx, cw, w), y: fit(cy, ch, h), w: cw, h: ch };
}

// --- Měřítko ----------------------------------------------------------------

export function pxPerMeterFrom(a: Pt, b: Pt, meters: number): number | null {
  const d = distance(a, b);
  if (!(meters > 0) || !(d > 0)) return null;
  return round(d / meters, 2);
}

// Vzdálenost v metrech mezi dvěma body podkladu
export function metersBetween(a: Pt, b: Pt, pxPerMeter: number): number {
  return distance(a, b) / pxPerMeter;
}

// Hezká délka měřítka (1, 2, 5 × 10ⁿ m), aby na obrazovce měla zhruba targetPx
export function niceScaleBar(pxPerMeter: number, k: number, targetPx = 90): { meters: number; px: number } {
  const screenPerMeter = pxPerMeter * k;
  if (!(screenPerMeter > 0)) return { meters: 1, px: 0 };
  const raw = targetPx / screenPerMeter;
  const exp = Math.floor(Math.log10(raw));
  const base = 10 ** exp;
  const step = [1, 2, 5, 10].find((s) => s * base >= raw * 0.75) ?? 10;
  const meters = step * base;
  return { meters, px: meters * screenPerMeter };
}

export function formatMeters(m: number): string {
  if (m < 1) return `${(m * 100).toLocaleString("cs-CZ", { maximumFractionDigits: 0 })} cm`;
  return `${m.toLocaleString("cs-CZ", { maximumFractionDigits: 2 })} m`;
}

// „1 m = 82 px"
export function formatScale(pxPerMeter?: number): string {
  if (!pxPerMeter || pxPerMeter <= 0) return "měřítko nenastaveno";
  return `1 m = ${pxPerMeter.toLocaleString("cs-CZ", { maximumFractionDigits: 1 })} px`;
}
