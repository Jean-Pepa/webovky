// Obrazovky na PC: lobby (QR kód, hráči, hra, soupeř), výsledky zápasu a pauza.
import QRCode from "qrcode";
import { CHARACTERS } from "../shared/characters";
import { logoImg, modeImg } from "../shared/assets";
import { DIFFS, MAX_PLAYERS, MODES, ROUND_LABEL, type LobbyPlayer, type ResultRow } from "../shared/protocol";
import { avatarHtml } from "./hud";
import { esc } from "./util";

export interface LobbyHandlers {
  start(): void;
  mode(i: number): void;
  diff(delta: number): void;
  rounds(delta: number): void;
  addMouse(): void;
  removePlayer(slot: number): void;
  toggleSound(): void;
  fullscreen(): void;
}

export interface LobbyView {
  players: LobbyPlayer[];
  mode: number;
  diff: number;
  rounds: number;
  canStart: boolean;
  muted: boolean;
  best: string;
}

const SENSOR: Record<string, string> = {
  rel: "✓ gyroskop",
  ori: "✓ senzor natočení",
  touch: "⚠ míří prstem",
  none: "⚠ bez senzoru",
};

export class Lobby {
  readonly el: HTMLElement;
  private qr: HTMLCanvasElement;

  constructor(parent: HTMLElement, h: LobbyHandlers) {
    this.el = document.createElement("div");
    this.el.className = "lobby";
    const logo = logoImg();
    this.el.innerHTML = `
      <div class="lb-card">
        <header class="lb-head">
          ${logo ? `<img class="lb-logo" src="${logo}" alt="Mečovačka">` : `<h1 class="logo-text">Mečo<span>vačka</span></h1>`}
          <p>Souboje s pěnovými meči na molu. <b>Mečem je tvůj telefon</b> — co uděláš rukou, udělá meč.</p>
        </header>
        <section class="lb-join">
          <div class="qr-card"><canvas class="qr" width="220" height="220"></canvas><div class="code">kód <b>····</b></div></div>
          <div class="lb-steps">
            <ol>
              <li><b>Naskenuj QR kód</b> telefonem<br><small class="url"></small></li>
              <li><b>Vyber si šermíře.</b> Druhý hráč se připojí stejně, jinak bojuješ s počítačem.</li>
              <li>Drž telefon <b>jako rukojeť meče</b>, palec na displeji. Hráč 1 dá <b>START</b>.</li>
            </ol>
            <p class="net"><span class="dot"></span><span class="net-text">Připojuji se k serveru…</span></p>
            <p class="lan-warn" hidden></p>
          </div>
        </section>
        <section class="lb-players"></section>
        <section class="lb-modes">${MODES.map(
          (m, i) => {
            const icon = modeImg(m.id);
            return `<button class="mode" data-a="mode" data-i="${i}"><span class="m-emoji">${icon ? `<img src="${icon}" alt="">` : m.emoji}</span><b>${m.name}</b><small>${esc(m.desc)}</small></button>`;
          },
        ).join("")}</section>
        <section class="lb-setup">
          <div class="opt opt-diff"><small>Počítač</small><div class="stepper"><button data-a="diff-">−</button><b class="diffn"></b><button data-a="diff+">+</button></div></div>
          <div class="opt opt-rounds"><small>Zápas</small><div class="stepper"><button data-a="rounds-">−</button><b class="roundsn"></b><button data-a="rounds+">+</button></div></div>
          <div class="opt opt-best"><small>Rekord</small><b class="bestn">—</b></div>
          <button class="start-btn" data-a="start">START ⚔️</button>
        </section>
        <footer class="lb-foot">
          <span>Bez telefonu: <kbd>M</kbd> přidá hráče s myší (pohyb myši = meč, levé tlačítko / <kbd>mezerník</kbd> = KRYT). <kbd>1</kbd><kbd>2</kbd><kbd>3</kbd> hra, <kbd>Enter</kbd> start, <kbd>Esc</kbd> pauza.</span>
          <span class="foot-btns">${import.meta.env.BASE_URL !== "/" ? `<a class="hub-link" href="/">🎮 Jiná hra</a>` : ""}<button data-a="mouse">🖱️ Hráč s myší</button><button data-a="sound" class="snd">🔊 Zvuk</button><button data-a="fs">⛶ Celá obrazovka</button></span>
        </footer>
      </div>`;
    parent.append(this.el);
    this.qr = this.el.querySelector(".qr")!;
    this.el.addEventListener("click", (e) => {
      const b = (e.target as HTMLElement).closest("[data-a]") as HTMLElement | null;
      if (!b) return;
      const a = b.dataset.a!;
      if (a === "start") h.start();
      else if (a === "mode") h.mode(Number(b.dataset.i));
      else if (a === "diff-") h.diff(-1);
      else if (a === "diff+") h.diff(1);
      else if (a === "rounds-") h.rounds(-1);
      else if (a === "rounds+") h.rounds(1);
      else if (a === "mouse") h.addMouse();
      else if (a === "sound") h.toggleSound();
      else if (a === "fs") h.fullscreen();
      else if (a === "kick") h.removePlayer(Number(b.dataset.slot));
    });
  }

  setRoom(code: string, url: string, shortUrl: string) {
    (this.el.querySelector(".code b") as HTMLElement).textContent = code;
    (this.el.querySelector(".url") as HTMLElement).innerHTML = `nebo otevři <b>${esc(shortUrl)}</b> a zadej kód <b>${code}</b>`;
    void QRCode.toCanvas(this.qr, url, { width: 220, margin: 1, color: { dark: "#14123a", light: "#ffffff" } });
    this.qr.dataset.url = url;
  }

  setStatus(kind: "connecting" | "ready" | "error", text: string) {
    const n = this.el.querySelector(".net") as HTMLElement;
    n.dataset.kind = kind;
    (n.querySelector(".net-text") as HTMLElement).textContent = text;
  }

  setLanWarning(text: string | null) {
    const w = this.el.querySelector(".lan-warn") as HTMLElement;
    w.hidden = !text;
    w.textContent = text ?? "";
  }

  render(v: LobbyView) {
    const slots: string[] = [];
    for (let i = 0; i < MAX_PLAYERS; i++) {
      const p = v.players.find((x) => x.slot === i);
      if (!p) {
        slots.push(
          i === 1
            ? `<div class="pl empty cpu"><span class="pl-n">2</span>${avatarHtml(-1)}<div class="pl-info"><b>Počítač</b><small>nebo se připoj druhým telefonem</small></div></div>`
            : `<div class="pl empty"><span class="pl-n">${i + 1}</span>čeká na hráče…</div>`,
        );
        continue;
      }
      const c = CHARACTERS[p.char];
      slots.push(`<div class="pl ${p.online ? "" : "off"}" style="--c:#${c.main.toString(16).padStart(6, "0")}">
        <span class="pl-n">${p.host ? "👑" : i + 1}</span>${avatarHtml(p.char)}
        <div class="pl-info"><b>${esc(p.name)}</b><small>${esc(c.name)} · ${c.cls}${p.kind === "mouse" ? " · 🖱️ myš" : ` · ${SENSOR[p.sensor] ?? ""}`}${p.online ? "" : " · offline"}</small></div>
        <button class="kick" data-a="kick" data-slot="${p.slot}" title="Odebrat">✕</button></div>`);
    }
    (this.el.querySelector(".lb-players") as HTMLElement).innerHTML = slots.join("");
    this.el.querySelectorAll<HTMLElement>(".mode").forEach((b) => b.classList.toggle("on", Number(b.dataset.i) === v.mode));
    const mode = MODES[v.mode];
    const vsCpu = v.players.length < 2;
    (this.el.querySelector(".opt-diff") as HTMLElement).hidden = !vsCpu || mode.id === "train" || mode.id === "slice";
    (this.el.querySelector(".opt-rounds") as HTMLElement).hidden = mode.id !== "duel";
    (this.el.querySelector(".opt-best") as HTMLElement).hidden = mode.id !== "slice";
    (this.el.querySelector(".diffn") as HTMLElement).textContent = DIFFS[v.diff];
    (this.el.querySelector(".roundsn") as HTMLElement).textContent = ROUND_LABEL[v.rounds];
    (this.el.querySelector(".bestn") as HTMLElement).textContent = v.best;
    const sb = this.el.querySelector(".start-btn") as HTMLButtonElement;
    sb.disabled = !v.canStart;
    (this.el.querySelector(".snd") as HTMLElement).textContent = v.muted ? "🔇 Zvuk" : "🔊 Zvuk";
  }

  show(on: boolean) {
    this.el.classList.toggle("hidden", !on);
  }
}

export class Results {
  readonly el: HTMLElement;
  constructor(parent: HTMLElement, onAgain: () => void, onMenu: () => void) {
    this.el = document.createElement("div");
    this.el.className = "results hidden";
    parent.append(this.el);
    this.el.addEventListener("click", (e) => {
      const a = ((e.target as HTMLElement).closest("[data-a]") as HTMLElement | null)?.dataset.a;
      if (a === "again") onAgain();
      else if (a === "menu") onMenu();
    });
  }

  show(title: string, rows: ResultRow[]) {
    this.el.innerHTML = `<div class="rs-card"><h2>${esc(title)}</h2>
      <div class="rs-rows">${rows
        .map(
          (r) => `<div class="rs-row ${r.win ? "win" : ""}">${avatarHtml(r.char)}<div class="rs-info"><b>${esc(r.name)}${r.win ? " 🏆" : ""}</b><small>${esc(r.sub)}</small></div><span class="rs-main">${esc(r.main)}</span></div>`,
        )
        .join("")}</div>
      <div class="rs-btns"><button data-a="again">↻ Odveta <kbd>Enter</kbd></button><button data-a="menu">Menu <kbd>Esc</kbd></button></div></div>`;
    this.el.classList.remove("hidden");
  }

  hide() {
    this.el.classList.add("hidden");
  }

  get visible() {
    return !this.el.classList.contains("hidden");
  }
}

export class Pause {
  readonly el: HTMLElement;
  constructor(parent: HTMLElement, h: { resume(): void; restart(): void; menu(): void }) {
    this.el = document.createElement("div");
    this.el.className = "pause hidden";
    this.el.innerHTML = `<div class="ps-card"><h2>Pauza</h2>
      <button data-a="resume">▶ Pokračovat</button><button data-a="restart">↻ Začít znovu</button><button data-a="menu">⏏ Do menu</button>
      <p><kbd>Esc</kbd> pokračovat · <kbd>R</kbd> znovu · <kbd>Q</kbd> do menu</p></div>`;
    this.el.addEventListener("click", (e) => {
      const a = ((e.target as HTMLElement).closest("[data-a]") as HTMLElement | null)?.dataset.a;
      if (a === "resume") h.resume();
      else if (a === "restart") h.restart();
      else if (a === "menu") h.menu();
    });
    parent.append(this.el);
  }
  show(on: boolean) {
    this.el.classList.toggle("hidden", !on);
  }
}
