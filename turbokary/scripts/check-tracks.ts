// Kontrola geometrie tratí: délka, nejmenší poloměr zatáčky, zda se trať nikde „nepřekrývá“.
// Spuštění: node scripts/check-tracks.ts [výstup.html]
import { CatmullRomCurve3, Vector3 } from "three";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { TRACKS } from "../src/game/tracks.ts";

const OFFROAD = 6; // musí odpovídat track.ts
const out = process.argv[2] || "e2e/out/tracks.html";
let svgs = "";
let bad = false;

for (const def of TRACKS) {
  const curve = new CatmullRomCurve3(def.pts.map(([x, z]) => new Vector3(x, 0, z)), true, "centripetal");
  curve.arcLengthDivisions = 6000;
  const L = curve.getLength();
  const n = Math.round(L);
  const pts = curve.getSpacedPoints(n).slice(0, n);
  const ds = L / n;
  const head: number[] = [];
  for (let i = 0; i < n; i++) {
    const a = pts[(i - 1 + n) % n], b = pts[(i + 1) % n];
    head.push(Math.atan2(b.x - a.x, b.z - a.z));
  }
  let minR = Infinity, minRAt = 0;
  for (let i = 0; i < n; i++) {
    let dh = head[(i + 2) % n] - head[(i - 2 + n) % n];
    while (dh > Math.PI) dh -= 2 * Math.PI;
    while (dh < -Math.PI) dh += 2 * Math.PI;
    const k = Math.abs(dh) / (4 * ds);
    const r = 1 / Math.max(k, 1e-6);
    if (r < minR) { minR = r; minRAt = i; }
  }
  const wallD = def.hw + OFFROAD;
  const need = 2 * wallD + 6;
  let minSep = Infinity, sepAt: [number, number] = [0, 0];
  for (let i = 0; i < n; i += 2) {
    for (let j = i + 1; j < n; j += 2) {
      const along = Math.min(j - i, n - (j - i)) * ds;
      if (along < Math.PI * wallD * 1.2) continue;
      const d = pts[i].distanceTo(pts[j]);
      if (d < minSep) { minSep = d; sepAt = [i, j]; }
    }
  }
  const okR = minR > wallD + 3;
  const okS = minSep > need;
  if (!okR || !okS) bad = true;
  console.log(
    `${def.name}: délka ${L.toFixed(0)} m, min. poloměr ${minR.toFixed(1)} m (bod ${minRAt}) ${okR ? "OK" : "MOC OSTRÁ"}, ` +
      `min. odstup ${minSep.toFixed(1)} m (potřeba ${need}) ${okS ? "OK" : "PŘEKRYV u " + sepAt.join("/")}`,
  );
  // SVG náhled
  const xs = pts.map((p) => p.x), zs = pts.map((p) => p.z);
  const pad = 40;
  const minX = Math.min(...xs) - pad, maxX = Math.max(...xs) + pad;
  const minZ = Math.min(...zs) - pad, maxZ = Math.max(...zs) + pad;
  const path = pts.map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)},${p.z.toFixed(1)}`).join("") + "Z";
  const marks = def.items
    .map((f) => pts[Math.floor(f * n) % n])
    .map((p) => `<circle cx="${p.x}" cy="${p.z}" r="5" fill="#c026d3"/>`)
    .join("");
  const boosts = def.boosts
    .map((b) => pts[Math.floor(b.at * n) % n])
    .map((p) => `<circle cx="${p.x}" cy="${p.z}" r="5" fill="#f59e0b"/>`)
    .join("");
  const s0 = pts[0], s1 = pts[6];
  const arrows = [0.25, 0.5, 0.75].map((f) => {
    const i = Math.floor(f * n), p = pts[i], q = pts[(i + 8) % n];
    return `<line x1="${p.x}" y1="${p.z}" x2="${q.x}" y2="${q.z}" stroke="#000" stroke-width="3" marker-end="url(#a)"/>`;
  }).join("");
  const bad1 = okS ? "" : `<circle cx="${pts[sepAt[0]].x}" cy="${pts[sepAt[0]].z}" r="9" fill="red"/><circle cx="${pts[sepAt[1]].x}" cy="${pts[sepAt[1]].z}" r="9" fill="red"/>`;
  svgs += `<figure><svg viewBox="${minX} ${minZ} ${maxX - minX} ${maxZ - minZ}" width="520">
  <defs><marker id="a" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M0,0L6,3L0,6z"/></marker></defs>
  <rect x="${minX}" y="${minZ}" width="${maxX - minX}" height="${maxZ - minZ}" fill="#9ccc65"/>
  <path d="${path}" fill="none" stroke="#795548" stroke-width="${2 * wallD}" stroke-linejoin="round" opacity="0.35"/>
  <path d="${path}" fill="none" stroke="#444" stroke-width="${2 * def.hw}" stroke-linejoin="round"/>
  <path d="${path}" fill="none" stroke="#fff" stroke-width="1" stroke-dasharray="4 6"/>
  <line x1="${s0.x}" y1="${s0.z}" x2="${s1.x}" y2="${s1.z}" stroke="#fff" stroke-width="6"/>
  ${marks}${boosts}${arrows}${bad1}
  ${def.pts.map(([x, z], i) => `<text x="${x}" y="${z}" font-size="9" fill="#003">${i}</text>`).join("")}
  </svg><figcaption>${def.name} — ${L.toFixed(0)} m</figcaption></figure>`;
}
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, `<!doctype html><meta charset="utf-8"><body style="display:flex;flex-wrap:wrap;gap:12px;font:14px sans-serif">${svgs}</body>`);
console.log("náhled:", out);
process.exit(bad ? 1 : 0);
