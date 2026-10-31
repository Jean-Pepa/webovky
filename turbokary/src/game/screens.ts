// Úvodní obrazovka (QR kód, hráči, nastavení) a výsledky závodu.
import QRCode from "qrcode";
import { CHARACTERS, hex } from "../shared/characters";
import { charImg, logoImg } from "../shared/assets";
import { MAX_PLAYERS, type LobbyPlayer, type ResultRow } from "../shared/protocol";

export interface LobbyHandlers {
  start(): void;
  laps(delta: number): void;
  bots(delta: number): void;
  addKeyboard(): void;
  removePlayer(slot: number): void;
  toggleSound(): void;
  fullscreen(): void;
}

export interface LobbyView {
  players: LobbyPlayer[];
  trackName: string;
  trackDesc: string;
  laps: number;
  bots: number;
  maxBots: number;
  canStart: boolean;
  muted: boolean;
  soundReady: boolean;
}

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

export function avatar(char: number, cls = "av") {
  const c = CHARACTERS[char];
  const src = charImg(char);
  return src
    ? `<span class="${cls}" style="--c:${hex(c.kart)}"><img src="${src}" alt="${c.name}"></span>`
    : `<span class="${cls}" style="--c:${hex(c.kart)}"><span>${c.emoji}</span></span>`;
}

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
          ${logo ? `<img class="lb-logo" src="${logo}" alt="TurboKáry">` : `<h1 class="logo-text">Turbo<span>Káry</span></h1>`}
          <p>Závody motokár na PC. Ovladač je tvůj telefon.</p>
        </header>
        <section class="lb-join">
          <div class="qr-card"><canvas class="qr" width="240" height="240"></canvas><div class="code">kód <b>····</b></div></div>
          <div class="lb-steps">
            <ol>
              <li><b>Naskenuj QR kód</b> fotoaparátem v telefonu<br><small class="url"></small></li>
              <li><b>Vyber si postavičku</b> a napiš jméno</li>
              <li>Hráč 1 dá na telefonu <b>START</b></li>
            </ol>
            <p class="net"><span class="dot"></span><span class="net-text">Připojuji se k serveru…</span></p>
            <p class="lan-warn" hidden></p>
          </div>
        </section>
        <section class="lb-players"></section>
        <section class="lb-setup">
          <div class="opt track"><small>Trať</small><b class="tname"></b><span class="tdesc"></span></div>
          <div class="opt"><small>Kola</small><div class="stepper"><button data-a="laps-">−</button><b class="laps">3</b><button data-a="laps+">+</button></div></div>
          <div class="opt"><small>Soupeři</small><div class="stepper"><button data-a="bots-">−</button><b class="bots">5</b><button data-a="bots+">+</button></div></div>
          <button class="start-btn" data-a="start">START ▶</button>
        </section>
        <footer class="lb-foot">
          <span>Bez telefonu: <kbd>K</kbd> přidá hráče na klávesnici (šipky/WASD, <kbd>mezerník</kbd> drift, <kbd>E</kbd>/<kbd>Enter</kbd> věc).</span>
          <span class="foot-btns"><button data-a="kb">⌨️ Hráč na klávesnici</button><button data-a="sound" class="snd">🔊 Zvuk</button><button data-a="fs">⛶ Celá obrazovka</button></span>
        </footer>
      </div>`;
    parent.append(this.el);
    this.qr = this.el.querySelector(".qr")!;
    this.el.addEventListener("click", (e) => {
      const b = (e.target as HTMLElement).closest("[data-a]") as HTMLElement | null;
      if (!b) return;
      const a = b.dataset.a!;
      if (a === "start") h.start();
      else if (a === "laps-") h.laps(-1);
      else if (a === "laps+") h.laps(1);
      else if (a === "bots-") h.bots(-1);
      else if (a === "bots+") h.bots(1);
      else if (a === "kb") h.addKeyboard();
      else if (a === "sound") h.toggleSound();
      else if (a === "fs") h.fullscreen();
      else if (a === "kick") h.removePlayer(Number(b.dataset.slot));
    });
  }

  setRoom(code: string, url: string, shortUrl: string) {
    (this.el.querySelector(".code b") as HTMLElement).textContent = code;
    (this.el.querySelector(".url") as HTMLElement).innerHTML = `nebo otevři <b>${esc(shortUrl)}</b> a zadej kód <b>${code}</b>`;
    void QRCode.toCanvas(this.qr, url, { width: 240, margin: 1, color: { dark: "#160f33", light: "#ffffff" } });
    this.qr.dataset.url = url;
  }

  setStatus(kind: "connecting" | "ready" | "error", text: string) {
    const p = this.el.querySelector(".net") as HTMLElement;
    p.dataset.kind = kind;
    (this.el.querySelector(".net-text") as HTMLElement).textContent = text;
  }

  setLanWarning(text: string | null) {
    const p = this.el.querySelector(".lan-warn") as HTMLElement;
    p.hidden = !text;
    p.textContent = text ?? "";
  }

  render(v: LobbyView) {
    const box = this.el.querySelector(".lb-players") as HTMLElement;
    let html = "";
    for (let i = 0; i < MAX_PLAYERS; i++) {
      const p = v.players.find((x) => x.slot === i);
      if (!p) {
        html += `<div class="pl empty"><span class="pl-n">${i + 1}</span><span>volné místo</span></div>`;
        continue;
      }
      const c = CHARACTERS[p.char];
      html += `<div class="pl ${p.online ? "" : "off"}" style="--c:${hex(c.kart)}">
        <span class="pl-n">${i + 1}</span>${avatar(p.char)}
        <span class="pl-info"><b>${esc(p.name)}</b><small>${c.name} · ${p.kind === "kb" ? "⌨️ klávesnice" : "📱 telefon"}${p.host ? " · 👑 vybírá" : ""}${p.online ? "" : " · 📵 odpojen"}</small></span>
        <button class="kick" data-a="kick" data-slot="${p.slot}" title="Odebrat">✕</button></div>`;
    }
    box.innerHTML = html;
    (this.el.querySelector(".tname") as HTMLElement).textContent = v.trackName;
    (this.el.querySelector(".tdesc") as HTMLElement).textContent = v.trackDesc;
    (this.el.querySelector(".laps") as HTMLElement).textContent = String(v.laps);
    (this.el.querySelector(".bots") as HTMLElement).textContent = String(v.bots);
    const start = this.el.querySelector(".start-btn") as HTMLButtonElement;
    start.disabled = !v.canStart;
    start.title = v.canStart ? "" : "Nejdřív se musí připojit aspoň jeden hráč";
    (this.el.querySelector(".snd") as HTMLElement).textContent = !v.soundReady
      ? "🔈 Klikni pro zvuk"
      : v.muted
        ? "🔇 Zvuk vypnutý"
        : "🔊 Zvuk";
  }

  show(on: boolean) {
    this.el.classList.toggle("hidden", !on);
  }
}

export class Results {
  readonly el: HTMLElement;

  constructor(parent: HTMLElement, onNext: () => void) {
    this.el = document.createElement("div");
    this.el.className = "results hidden";
    parent.append(this.el);
    this.el.addEventListener("click", (e) => {
      if ((e.target as HTMLElement).closest("[data-a=next]")) onNext();
    });
  }

  show(rows: ResultRow[], trackName: string, record: string | null) {
    const medal = ["🥇", "🥈", "🥉"];
    this.el.innerHTML = `<div class="rs-card">
      <h2>Výsledky · ${esc(trackName)}</h2>
      ${record ? `<p class="record">🏆 ${esc(record)}</p>` : ""}
      <ol class="rs-list">${rows
        .map(
          (r) => `<li class="${r.human ? "human" : ""}" style="--c:${hex(CHARACTERS[r.char].kart)}">
          <span class="rs-place">${medal[r.place - 1] ?? r.place + "."}</span>${avatar(r.char)}
          <span class="rs-name">${esc(r.name)}${r.human ? "" : " <small>bot</small>"}</span>
          <span class="rs-time">${r.time}</span><span class="rs-best">kolo ${r.best}</span></li>`,
        )
        .join("")}</ol>
      <div class="rs-actions"><button data-a="next">Další závod ▶</button></div>
      <p class="rs-hint">Pokračovat jde i z telefonu hráče 1, nebo klávesou Enter.</p></div>`;
    this.el.classList.remove("hidden");
  }

  hide() {
    this.el.classList.add("hidden");
  }

  get visible() {
    return !this.el.classList.contains("hidden");
  }
}
