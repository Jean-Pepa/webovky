// Ukazatele na obrazovce: pořadí, kolo, čas, věc, zprávy, minimapa, odpočet.
import type { Kart } from "./kart";
import type { Race } from "./race";
import type { Track } from "./track";
import type { Rect } from "./view";
import { ITEMS, ITEM_IDS, type ItemId } from "../shared/items";
import { hex } from "../shared/characters";
import { itemImg } from "../shared/assets";
import { formatTime } from "./util";

interface Panel {
  el: HTMLElement;
  pos: HTMLElement;
  of: HTMLElement;
  lap: HTMLElement;
  time: HTMLElement;
  item: HTMLElement;
  cnt: HTMLElement;
  name: HTMLElement;
  msg: HTMLElement;
  warn: HTMLElement;
  msgUntil: number;
  cache: Record<string, string>;
}

function itemHtml(id: ItemId) {
  const src = itemImg(id);
  return src ? `<img src="${src}" alt="${ITEMS[id].name}">` : `<span>${ITEMS[id].emoji}</span>`;
}

export class Hud {
  private root: HTMLElement;
  private panels: Panel[] = [];
  private countEl: HTMLElement;
  private mini: HTMLCanvasElement;
  private miniBase: HTMLCanvasElement | null = null;
  private miniMap = { sx: 1, ox: 0, oz: 0, size: 200 };

  constructor(root: HTMLElement) {
    this.root = root;
    this.countEl = document.createElement("div");
    this.countEl.className = "countdown";
    this.mini = document.createElement("canvas");
    this.mini.className = "minimap";
    root.append(this.mini, this.countEl);
  }

  setTrack(track: Track) {
    const size = 220;
    const dpr = Math.min(2, devicePixelRatio);
    const c = document.createElement("canvas");
    c.width = c.height = size * dpr;
    const g = c.getContext("2d")!;
    g.scale(dpr, dpr);
    const b = track.bounds;
    const span = Math.max(b.maxX - b.minX, b.maxZ - b.minZ) + 2 * track.wallD;
    const sx = (size - 16) / span;
    const ox = size / 2 - ((b.minX + b.maxX) / 2) * sx;
    const oz = size / 2 - ((b.minZ + b.maxZ) / 2) * sx;
    this.miniMap = { sx, ox, oz, size };
    const path = () => {
      g.beginPath();
      for (let i = 0; i <= track.n; i++) {
        const k = i % track.n;
        const x = ox + track.px[k] * sx, y = oz + track.pz[k] * sx;
        if (i) g.lineTo(x, y);
        else g.moveTo(x, y);
      }
    };
    g.lineJoin = "round";
    path();
    g.strokeStyle = "rgba(22,15,51,0.75)";
    g.lineWidth = Math.max(9, track.hw * 2 * sx + 5);
    g.stroke();
    path();
    g.strokeStyle = "rgba(255,255,255,0.92)";
    g.lineWidth = Math.max(5, track.hw * 2 * sx);
    g.stroke();
    const s = track.pointAt(0, 0);
    const nx = track.rx[0], nz = track.rz[0];
    g.strokeStyle = "#111";
    g.lineWidth = 3;
    g.beginPath();
    g.moveTo(ox + (s.x - nx * track.hw) * sx, oz + (s.z - nz * track.hw) * sx);
    g.lineTo(ox + (s.x + nx * track.hw) * sx, oz + (s.z + nz * track.hw) * sx);
    g.stroke();
    this.miniBase = c;
  }

  /** Vytvoří panely pro hráče podle výřezů obrazovky. */
  layout(rects: Rect[], humans: Kart[], icons: string[]) {
    for (const p of this.panels) p.el.remove();
    this.panels = humans.map((k, i) => {
      const r = rects[i];
      const el = document.createElement("div");
      el.className = "pp";
      Object.assign(el.style, { left: r.x + "px", top: r.y + "px", width: r.w + "px", height: r.h + "px" });
      el.style.setProperty("--u", Math.max(11, Math.min(28, r.h / 24)) + "px");
      el.style.setProperty("--pc", hex(k.char.kart));
      el.innerHTML = `
        <div class="pp-tl"><div class="pp-pos"><b>1.</b><small>/8</small></div><div class="pp-lap">KOLO <b>1</b>/3</div></div>
        <div class="pp-tr"><div class="pp-item"><div class="slot"></div><i></i></div></div>
        <div class="pp-bl"><span class="pp-name"></span><span class="pp-time"></span></div>
        <div class="pp-msg"></div><div class="pp-warn"></div>`;
      this.root.insertBefore(el, this.mini);
      const q = (s: string) => el.querySelector(s) as HTMLElement;
      const panel: Panel = {
        el,
        pos: q(".pp-pos b"),
        of: q(".pp-pos small"),
        lap: q(".pp-lap"),
        time: q(".pp-time"),
        item: q(".pp-item .slot"),
        cnt: q(".pp-item i"),
        name: q(".pp-name"),
        msg: q(".pp-msg"),
        warn: q(".pp-warn"),
        msgUntil: 0,
        cache: {},
      };
      panel.name.textContent = `${icons[i] ?? ""} ${k.name}`;
      return panel;
    });
    // minimapa
    const n = humans.length;
    const W = innerWidth, H = innerHeight;
    const size = n >= 4 ? 150 : n === 3 ? Math.min(W / 2, H / 2) * 0.8 : n === 2 ? 170 : 200;
    let left = W - size - 18, top = H - size - 18;
    if (n === 2) top = H / 2 - size / 2;
    if (n === 3) {
      left = W * 0.75 - size / 2;
      top = H * 0.75 - size / 2;
    }
    if (n >= 4) {
      left = W / 2 - size / 2;
      top = H / 2 - size / 2;
    }
    const dpr = Math.min(2, devicePixelRatio);
    this.mini.width = this.mini.height = Math.round(size * dpr);
    Object.assign(this.mini.style, { width: size + "px", height: size + "px", left: left + "px", top: top + "px", display: "block" });
  }

  private set(p: Panel, key: string, el: HTMLElement, value: string, html = false) {
    if (p.cache[key] === value) return;
    p.cache[key] = value;
    if (html) el.innerHTML = value;
    else el.textContent = value;
  }

  message(i: number, text: string, cls = "", ms = 1600) {
    const p = this.panels[i];
    if (!p) return;
    p.msg.textContent = text;
    p.msg.className = "pp-msg show " + cls;
    p.msgUntil = performance.now() + ms;
  }

  count(text: string) {
    this.countEl.textContent = text;
    this.countEl.classList.remove("pop");
    void this.countEl.offsetWidth;
    this.countEl.classList.add("pop");
  }

  update(race: Race, humans: Kart[], offline: (k: Kart) => boolean) {
    const now = performance.now();
    const total = race.karts.length;
    humans.forEach((k, i) => {
      const p = this.panels[i];
      if (!p) return;
      this.set(p, "pos", p.pos, `${k.place}.`);
      this.set(p, "of", p.of, `/${total}`);
      const lap = Math.max(1, Math.min(race.laps, k.lap));
      this.set(p, "lap", p.lap, k.finished ? "CÍL" : `KOLO <b>${lap}</b>/${race.laps}`, true);
      const t = k.finished ? k.finishTime : race.phase === "countdown" ? 0 : race.time;
      this.set(p, "time", p.time, formatTime(t * 1000));
      let item = "";
      if (k.rollT > 0) item = itemHtml(ITEM_IDS[Math.floor(now / 80) % ITEM_IDS.length]);
      else if (k.item) item = itemHtml(k.item);
      this.set(p, "item", p.item, item, true);
      const cls = k.rollT > 0 ? "slot rolling" : k.item ? "slot full" : "slot";
      if (p.item.className !== cls) p.item.className = cls;
      this.set(p, "cnt", p.cnt, k.item === "turbo3" ? `×${k.itemN}` : "");
      let warn = "";
      if (offline(k)) warn = "📵 Ovladač odpojen — řídí počítač";
      else if (k.wrongT > 1.2 && !k.finished) warn = "⛔ ŠPATNÝ SMĚR";
      this.set(p, "warn", p.warn, warn);
      p.warn.classList.toggle("show", !!warn);
      if (p.msgUntil && now > p.msgUntil) {
        p.msg.className = "pp-msg";
        p.msgUntil = 0;
      }
      p.el.classList.toggle("boost", k.boostT > 0);
    });
    this.drawMini(race, humans);
  }

  private drawMini(race: Race, humans: Kart[]) {
    if (!this.miniBase) return;
    const g = this.mini.getContext("2d")!;
    const w = this.mini.width;
    const { sx, ox, oz, size } = this.miniMap;
    const sc = w / size;
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.clearRect(0, 0, w, w);
    g.drawImage(this.miniBase, 0, 0, w, w);
    g.setTransform(sc, 0, 0, sc, 0, 0);
    const scale = size / 220;
    const draw = (k: Kart, r: number, ring: boolean) => {
      const x = ox * scale + k.x * sx * scale, y = oz * scale + k.z * sx * scale;
      g.beginPath();
      g.arc(x, y, r, 0, Math.PI * 2);
      g.fillStyle = hex(k.char.kart);
      g.fill();
      g.lineWidth = ring ? 2.5 : 1.2;
      g.strokeStyle = ring ? "#fff" : "#1b1430";
      g.stroke();
    };
    for (const k of race.karts) if (!k.human) draw(k, 3.6, false);
    for (const k of humans) draw(k, 5.2, true);
  }

  show(on: boolean) {
    this.root.classList.toggle("off", !on);
  }

  clear() {
    for (const p of this.panels) p.el.remove();
    this.panels = [];
    this.mini.style.display = "none";
    this.countEl.textContent = "";
  }
}
