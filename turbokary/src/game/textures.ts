// Textury kreslené v kódu (canvas) — hra nepotřebuje žádné soubory s obrázky.
import * as THREE from "three";

export const css = (c: number) => "#" + c.toString(16).padStart(6, "0");

function canvas(w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const g = c.getContext("2d")!;
  return { c, g };
}

function toTexture(c: HTMLCanvasElement, repeat = true): THREE.CanvasTexture {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  if (repeat) t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 8;
  return t;
}

function noise(g: CanvasRenderingContext2D, w: number, h: number, amount: number, seed = 1) {
  const img = g.getImageData(0, 0, w, h);
  let s = seed;
  for (let i = 0; i < img.data.length; i += 4) {
    s = (s * 16807) % 2147483647;
    const n = ((s / 2147483647) - 0.5) * amount;
    img.data[i] += n;
    img.data[i + 1] += n;
    img.data[i + 2] += n;
  }
  g.putImageData(img, 0, 0);
}

/** Asfalt: šířka textury = šířka silnice (u), opakuje se podél trati (v). */
export function asphalt(base: number, line: number) {
  const { c, g } = canvas(256, 256);
  g.fillStyle = css(base);
  g.fillRect(0, 0, 256, 256);
  noise(g, 256, 256, 26, 7);
  // jemné tmavší skvrny
  for (let i = 0; i < 40; i++) {
    g.fillStyle = `rgba(0,0,0,${0.03 + Math.random() * 0.05})`;
    g.beginPath();
    g.ellipse(Math.random() * 256, Math.random() * 256, 8 + Math.random() * 30, 4 + Math.random() * 12, Math.random() * 3, 0, Math.PI * 2);
    g.fill();
  }
  g.fillStyle = css(line);
  g.fillRect(5, 0, 6, 256);
  g.fillRect(245, 0, 6, 256);
  return toTexture(c);
}

/** Obrubník: střídání dvou barev podél trati. */
export function curb(a: number, b: number) {
  const { c, g } = canvas(32, 64);
  g.fillStyle = css(a);
  g.fillRect(0, 0, 32, 32);
  g.fillStyle = css(b);
  g.fillRect(0, 32, 32, 32);
  return toTexture(c);
}

/** Šachovnice startovní čáry (8 × 2 pole přes šířku silnice). */
export function checker(cols = 10, rows = 2) {
  const { c, g } = canvas(cols * 32, rows * 32);
  for (let y = 0; y < rows; y++)
    for (let x = 0; x < cols; x++) {
      g.fillStyle = (x + y) % 2 ? "#111" : "#f4f4f4";
      g.fillRect(x * 32, y * 32, 32, 32);
    }
  const t = toTexture(c, false);
  t.magFilter = THREE.NearestFilter;
  return t;
}

/** Bariéra (panely dvou barev). */
export function wall(a: number, b: number) {
  const { c, g } = canvas(256, 64);
  g.fillStyle = css(a);
  g.fillRect(0, 0, 128, 64);
  g.fillStyle = css(b);
  g.fillRect(128, 0, 128, 64);
  g.fillStyle = "rgba(0,0,0,0.25)";
  g.fillRect(0, 0, 256, 5);
  g.fillRect(0, 59, 256, 5);
  g.fillRect(126, 0, 4, 64);
  g.fillRect(254, 0, 2, 64);
  return toTexture(c);
}

/** Turbo pás: šipky ve směru jízdy (v). */
export function boostPad() {
  const { c, g } = canvas(128, 128);
  g.fillStyle = "#2b1a00";
  g.fillRect(0, 0, 128, 128);
  for (let i = 0; i < 2; i++) {
    const y = i * 64;
    const grd = g.createLinearGradient(0, y, 0, y + 64);
    grd.addColorStop(0, "#ffe14d");
    grd.addColorStop(1, "#ff7a1a");
    g.fillStyle = grd;
    g.beginPath();
    g.moveTo(10, y + 54);
    g.lineTo(64, y + 14);
    g.lineTo(118, y + 54);
    g.lineTo(96, y + 54);
    g.lineTo(64, y + 32);
    g.lineTo(32, y + 54);
    g.closePath();
    g.fill();
  }
  return toTexture(c);
}

/** Skokánek: žlutá s černými šipkami. */
export function ramp() {
  const { c, g } = canvas(128, 128);
  g.fillStyle = "#ffd21f";
  g.fillRect(0, 0, 128, 128);
  g.fillStyle = "#1b1430";
  for (let i = 0; i < 2; i++) {
    const y = i * 64 + 6;
    g.beginPath();
    g.moveTo(16, y + 44);
    g.lineTo(64, y + 8);
    g.lineTo(112, y + 44);
    g.lineTo(92, y + 44);
    g.lineTo(64, y + 24);
    g.lineTo(36, y + 44);
    g.closePath();
    g.fill();
  }
  return toTexture(c);
}

/** Zem (tráva / písek / sníh) se skvrnami, případně s kytičkami. */
export function ground(base: number, dots: number, flowers = true) {
  const { c, g } = canvas(512, 512);
  g.fillStyle = css(base);
  g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 70; i++) {
    g.fillStyle = css(dots) + (Math.random() < 0.5 ? "66" : "99");
    g.beginPath();
    g.ellipse(Math.random() * 512, Math.random() * 512, 20 + Math.random() * 60, 10 + Math.random() * 30, Math.random() * 3, 0, Math.PI * 2);
    g.fill();
  }
  noise(g, 512, 512, 14, 3);
  if (flowers) {
    const cols = ["#fff7d6", "#ffd21f", "#ff8fab", "#ffffff"];
    for (let i = 0; i < 260; i++) {
      g.fillStyle = cols[i % cols.length];
      g.fillRect(Math.random() * 512, Math.random() * 512, 2, 2);
    }
  }
  return toTexture(c);
}

/** Měkký kulatý stín pod motokárou. */
export function blobShadow() {
  const { c, g } = canvas(128, 128);
  const grd = g.createRadialGradient(64, 64, 4, 64, 64, 62);
  grd.addColorStop(0, "rgba(0,0,0,0.55)");
  grd.addColorStop(0.6, "rgba(0,0,0,0.3)");
  grd.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = grd;
  g.fillRect(0, 0, 128, 128);
  return toTexture(c, false);
}

/** Kulatá zářící skvrna (částice, záře). */
export function glow() {
  const { c, g } = canvas(64, 64);
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grd.addColorStop(0, "rgba(255,255,255,1)");
  grd.addColorStop(0.35, "rgba(255,255,255,0.8)");
  grd.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grd;
  g.fillRect(0, 0, 64, 64);
  return toTexture(c, false);
}

const SPONSORS: { text: string; sub: string; bg: string; fg: string }[] = [
  { text: "TURBO KNEDLÍK", sub: "palivo pro šampiony", bg: "#ffd21f", fg: "#1b1430" },
  { text: "PNEU HOP", sub: "gumy, co drží", bg: "#2f6bff", fg: "#ffffff" },
  { text: "BENZÍNKA U ŽABÁKA", sub: "kvak a natankováno", bg: "#3ccf4e", fg: "#1b1430" },
  { text: "KOBLIHY ZRZKA", sub: "s marmeládou", bg: "#ff4d6d", fg: "#ffffff" },
];

/** Náhradní reklamní plachta (dokud nedorazí obrázky v public/img/banners). */
export function banner(i: number) {
  const sp = SPONSORS[i % SPONSORS.length];
  const { c, g } = canvas(1024, 256);
  g.fillStyle = sp.bg;
  g.fillRect(0, 0, 1024, 256);
  g.fillStyle = "rgba(0,0,0,0.12)";
  for (let x = -256; x < 1024; x += 64) {
    g.beginPath();
    g.moveTo(x, 256);
    g.lineTo(x + 32, 256);
    g.lineTo(x + 160, 0);
    g.lineTo(x + 128, 0);
    g.fill();
  }
  g.fillStyle = sp.fg;
  g.textAlign = "center";
  g.font = "900 104px 'Lilita One', 'Arial Black', sans-serif";
  g.fillText(sp.text, 512, 140, 980);
  g.font = "700 44px 'Baloo 2', sans-serif";
  g.fillText(sp.sub, 512, 212, 900);
  return toTexture(c, false);
}

/** Náhradní nápis na bránu start/cíl. */
export function startBanner() {
  const { c, g } = canvas(2048, 256);
  g.fillStyle = "#160f33";
  g.fillRect(0, 0, 2048, 256);
  for (let x = 0; x < 2048; x += 64) {
    for (let y = 0; y < 2; y++) {
      g.fillStyle = (x / 64 + y) % 2 ? "#111" : "#f4f4f4";
      g.fillRect(x, y * 32, 64, 32);
      g.fillRect(x, 192 + y * 32, 64, 32);
    }
  }
  g.fillStyle = "#ffd21f";
  g.textAlign = "center";
  g.font = "900 120px 'Lilita One', 'Arial Black', sans-serif";
  g.fillText("START · CÍL", 1024, 168);
  return toTexture(c, false);
}

/** Jmenovka nad motokárou. */
export function nameTag(name: string, color: number) {
  const { c, g } = canvas(512, 128);
  g.font = "800 64px 'Baloo 2', sans-serif";
  const w = Math.min(480, g.measureText(name).width + 60);
  const x0 = 256 - w / 2;
  g.fillStyle = css(color);
  g.beginPath();
  g.roundRect(x0, 8, w, 84, 42);
  g.fill();
  g.strokeStyle = "#1b1430";
  g.lineWidth = 6;
  g.stroke();
  g.beginPath();
  g.moveTo(236, 92);
  g.lineTo(276, 92);
  g.lineTo(256, 122);
  g.closePath();
  g.fillStyle = css(color);
  g.fill();
  g.fillStyle = "#ffffff";
  g.strokeStyle = "#1b1430";
  g.lineWidth = 8;
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.strokeText(name, 256, 52, 440);
  g.fillText(name, 256, 52, 440);
  return toTexture(c, false);
}
