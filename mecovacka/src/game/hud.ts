// HUD přes 3D scénu: jména a skóre nahoře, velké nápisy, výzvy pro hráče, vyskakující nápisy u zásahů.
import { CHARACTERS, hex } from "../shared/characters";
import { charImg } from "../shared/assets";
import type { Viewport } from "./view";
import { esc } from "./util";

export interface SidePanel {
  name: string;
  char: number;
  /** HTML se skóre (puntíky výher, body) */
  score: string;
  sub?: string;
}

export function avatarHtml(char: number, cls = "av") {
  const c = CHARACTERS[char];
  if (!c) return `<span class="${cls}" style="--c:#c9a46a"><span>🎯</span></span>`;
  const src = charImg(char);
  return src
    ? `<span class="${cls}" style="--c:${hex(c.main)}"><img src="${src}" alt="${c.name}"></span>`
    : `<span class="${cls}" style="--c:${hex(c.main)}"><span>${c.emoji}</span></span>`;
}

export function pips(won: number, need: number) {
  let s = "";
  for (let i = 0; i < need; i++) s += `<i class="${i < won ? "on" : ""}"></i>`;
  return `<span class="pips">${s}</span>`;
}

export class Hud {
  readonly el: HTMLElement;
  private top: HTMLElement;
  private left: HTMLElement;
  private right: HTMLElement;
  private mid: HTMLElement;
  private bigEl: HTMLElement;
  private prompts: HTMLElement[];
  private pops: HTMLElement;
  private bigTimer = 0;
  private keys: Record<string, string> = {};

  constructor(el: HTMLElement) {
    this.el = el;
    el.innerHTML = `
      <div class="h-top"><div class="h-pl h-left"></div><div class="h-mid"></div><div class="h-pl h-right"></div></div>
      <div class="h-big"></div>
      <div class="h-prompt"></div><div class="h-prompt"></div>
      <div class="h-pops"></div>
      <div class="h-split"></div>`;
    this.top = el.querySelector(".h-top")!;
    this.left = el.querySelector(".h-left")!;
    this.right = el.querySelector(".h-right")!;
    this.mid = el.querySelector(".h-mid")!;
    this.bigEl = el.querySelector(".h-big")!;
    this.prompts = [...el.querySelectorAll<HTMLElement>(".h-prompt")];
    this.pops = el.querySelector(".h-pops")!;
  }

  show(on: boolean) {
    this.el.classList.toggle("off", !on);
  }

  split(on: boolean) {
    this.el.classList.toggle("is-split", on);
  }

  private setHtml(el: HTMLElement, key: string, html: string) {
    if (this.keys[key] === html) return;
    this.keys[key] = html;
    el.innerHTML = html;
  }

  setTop(l: SidePanel | null, r: SidePanel | null, midHtml: string) {
    const side = (p: SidePanel | null) =>
      p ? `${avatarHtml(p.char)}<div class="h-name"><b>${esc(p.name)}</b>${p.sub ? `<small>${p.sub}</small>` : ""}</div><div class="h-score">${p.score}</div>` : "";
    this.setHtml(this.left, "l", side(l));
    this.setHtml(this.right, "r", side(r));
    this.setHtml(this.mid, "m", midHtml);
    this.top.hidden = !l && !r && !midHtml;
  }

  big(text: string, sub = "", ms = 1400, cls = "") {
    this.bigEl.className = `h-big show ${cls}`;
    this.bigEl.innerHTML = `<b>${esc(text)}</b>${sub ? `<small>${esc(sub)}</small>` : ""}`;
    // restart animace
    void this.bigEl.offsetWidth;
    this.bigEl.classList.add("anim");
    clearTimeout(this.bigTimer);
    if (ms > 0) this.bigTimer = window.setTimeout(() => this.bigEl.classList.remove("show"), ms);
  }

  hideBig() {
    clearTimeout(this.bigTimer);
    this.bigEl.classList.remove("show");
  }

  /** Výzva dole v pohledu hráče (null = schovat). */
  prompt(i: number, html: string | null, vp?: Viewport) {
    const el = this.prompts[i];
    if (!el) return;
    if (!html) {
      el.hidden = true;
      this.keys["p" + i] = "";
      return;
    }
    el.hidden = false;
    this.setHtml(el, "p" + i, html);
    if (vp) {
      el.style.left = `${vp.x + vp.w / 2}px`;
      el.style.maxWidth = `${Math.max(240, vp.w - 40)}px`;
    }
  }

  /** Vyskakující nápis na místě zásahu (pixely). */
  pop(text: string, x: number, y: number, cls = "") {
    const d = document.createElement("div");
    d.className = `pop ${cls}`;
    d.textContent = text;
    d.style.left = `${x}px`;
    d.style.top = `${y}px`;
    this.pops.append(d);
    setTimeout(() => d.remove(), 1100);
    while (this.pops.childElementCount > 12) this.pops.firstElementChild?.remove();
  }

  /** Záblesk přes obrazovku (silná rána, pád). */
  flash(color = "rgba(255,255,255,0.5)") {
    const d = document.createElement("div");
    d.className = "flash";
    d.style.background = color;
    this.el.append(d);
    setTimeout(() => d.remove(), 400);
  }
}
