// Meč v telefonu: připojení k PC, výběr šermíře, posílání natočení (1:1), KRYT, vyrovnání, vibrace.
import "@fontsource/lilita-one/latin-400.css";
import "@fontsource/lilita-one/latin-ext-400.css";
import "@fontsource/baloo-2/latin-600.css";
import "@fontsource/baloo-2/latin-ext-600.css";
import "@fontsource/baloo-2/latin-800.css";
import "@fontsource/baloo-2/latin-ext-800.css";
import "../styles/pad.css";
import { CHARACTERS, hex } from "../shared/characters";
import { charImg, modeImg, padImg } from "../shared/assets";
import {
  CODE_LENGTH,
  DIFFS,
  MODES,
  PROTOCOL_VERSION,
  ROUND_LABEL,
  normalizeCode,
  type Hand,
  type HostMsg,
  type HudState,
} from "../shared/protocol";
import type { Q } from "../shared/quat";
import { PadNet } from "./net";
import { Motion } from "./motion";

type Screen = "code" | "connecting" | "lobby" | "game" | "results" | "full";
type LobbyMsg = Extract<HostMsg, { t: "lobby" }>;
type ResultsMsg = Extract<HostMsg, { t: "results" }>;

interface Settings {
  vibrate: boolean;
  hand: Hand;
}

const isIOS = /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

function load<T>(k: string, f: T): T {
  try {
    const v = localStorage.getItem(k);
    return v === null ? f : (JSON.parse(v) as T);
  } catch {
    return f;
  }
}
function save(k: string, v: unknown) {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch {
    /* soukromé okno */
  }
}
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
const r4 = (v: number) => Math.round(v * 10000) / 10000;

function avatar(id: number, cls = "av") {
  const c = CHARACTERS[id] ?? CHARACTERS[0];
  const src = charImg(c.id);
  return `<span class="${cls}" style="--c:${hex(c.main)}">${src ? `<img src="${src}" alt="">` : `<span>${c.emoji}</span>`}</span>`;
}

const SHIELD_SVG = `<svg viewBox="0 0 100 116" aria-hidden="true"><path d="M50 4 L92 18 V54 C92 82 72 100 50 112 C28 100 8 82 8 54 V18 Z" fill="currentColor" stroke="#1b1430" stroke-width="7" stroke-linejoin="round"/><path d="M50 22 V94 M28 46 H72" stroke="#1b1430" stroke-width="7" stroke-linecap="round" opacity="0.35"/></svg>`;

class Pad {
  private screen: Screen = "code";
  private code = normalizeCode(new URLSearchParams(location.search).get("r") ?? "");
  private net: PadNet | null = null;
  private motion = new Motion();
  private settings: Settings = load<Settings>("mc_pad", { vibrate: true, hand: "R" });
  private cid = load<string>("mc_cid", "") || this.newCid();
  private name = load<string>("mc_name", "");
  private char = load<number>("mc_char", -1);
  private slot = -1;
  private lobby: LobbyMsg | null = null;
  private hud: HudState | null = null;
  private results: ResultsMsg | null = null;
  private status = "";
  private ping = 0;
  private guards = new Set<number>();
  private aimId = -1;
  private lastSentAt = 0;
  private wake: WakeLockSentinel | null = null;
  private nameTimer = 0;
  private toastTimer = 0;
  private gameEl: HTMLElement | null = null;
  private permAsked = false;
  private sensorKey = "";

  constructor() {
    if (!this.settings.hand) this.settings.hand = "R";
    this.motion.onSample = () => this.sendSample();
    // na Androidu data chodí bez ptaní, na iPhonu až po povolení (ťuknutím)
    this.motion.start();
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") void this.keepAwake();
    });
    // udržovací vzorky: i bez pohybu (a bez senzoru) PC ví, že telefon žije a jestli drží KRYT
    setInterval(() => {
      if (performance.now() - this.lastSentAt > 90) this.sendSample();
    }, 50);
    setInterval(() => {
      if (this.net?.open) this.net.send({ t: "ping", ts: Math.round(performance.now()) });
      this.refreshSensor();
    }, 1000);
    addEventListener("contextmenu", (e) => e.preventDefault());
    if (this.code.length === CODE_LENGTH) this.connect();
    else this.show("code");
  }

  private newCid() {
    const id = Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
    save("mc_cid", id);
    return id;
  }

  // ---------------------------------------------------------------- síť

  private connect() {
    this.net?.stop();
    this.show("connecting");
    this.status = "Hledám PC…";
    this.net = new PadNet(this.code, this.cid, {
      open: () => {
        this.status = "";
        this.net!.send({ t: "hello", cid: this.cid, name: this.name, char: this.char, hand: this.settings.hand, v: PROTOCOL_VERSION });
      },
      closed: (reason) => {
        this.status = reason;
        if (this.screen === "connecting") this.renderConnecting();
        else this.renderStatus();
      },
      message: (m) => this.onMessage(m),
    });
    this.net.connect();
  }

  private onMessage(m: HostMsg) {
    switch (m.t) {
      case "welcome":
        this.slot = m.slot;
        this.net?.openMotion();
        break;
      case "full":
        this.show("full");
        break;
      case "lobby": {
        this.lobby = m;
        const me = m.players.find((p) => p.slot === m.you);
        if (me) {
          this.char = me.char;
          save("mc_char", me.char);
          if (!this.name) this.name = me.name;
        }
        if (this.screen === "code" || this.screen === "connecting" || this.screen === "full") this.show("lobby");
        else if (this.screen === "lobby") this.updateLobby();
        break;
      }
      case "hud": {
        const prev = this.hud;
        this.hud = m;
        if (m.phase === "lobby") {
          if (this.screen === "game" || this.screen === "results") this.show("lobby");
        } else if (m.phase === "results") {
          if (this.screen !== "results" && this.results) this.show("results");
        } else if (this.screen !== "game") this.show("game");
        else this.updateGame(prev);
        break;
      }
      case "results":
        this.results = m;
        if (this.hud?.phase === "results" || this.screen === "game") this.show("results");
        break;
      case "buzz":
        if (this.settings.vibrate) navigator.vibrate?.(m.ms);
        break;
      case "pong":
        this.ping = Math.max(0, Math.round(performance.now() - m.ts));
        this.renderStatus();
        break;
    }
  }

  private sendSample() {
    if (!this.net?.open) return;
    const q: Q = this.motion.q;
    this.lastSentAt = performance.now();
    this.net.sendMotion({
      t: "m",
      q: [r4(q[0]), r4(q[1]), r4(q[2]), r4(q[3])],
      g: this.guards.size > 0 ? 1 : 0,
      ts: Math.round(this.motion.lastAt > 0 ? this.motion.lastAt : this.lastSentAt),
      k: this.motion.live ? this.motion.kind : "none",
    });
  }

  // ---------------------------------------------------------------- obrazovky

  private show(s: Screen) {
    this.screen = s;
    document.body.dataset.screen = s;
    const app = document.getElementById("app")!;
    this.gameEl = null;
    if (s === "code") app.innerHTML = this.codeHtml();
    else if (s === "connecting") app.innerHTML = this.connectingHtml();
    else if (s === "lobby") app.innerHTML = this.lobbyHtml();
    else if (s === "results") app.innerHTML = this.resultsHtml();
    else if (s === "full")
      app.innerHTML = `<div class="scr center"><h1 class="logo">Mečo<span>vačka</span></h1><p class="big-msg">Aréna je plná</p><p class="hint">Hrají už dva šermíři. Počkej na další zápas.</p><button class="big" data-a="retry">Zkusit znovu</button></div>`;
    else if (s === "game") {
      app.innerHTML = this.gameHtml();
      this.gameEl = app.querySelector(".game");
      this.wireGame(app.querySelector(".game")!);
      this.updateGame(null);
      void this.keepAwake();
    }
    this.wire(app);
    if (s === "lobby") this.updateLobby();
  }

  private codeHtml() {
    return `<div class="scr center">
      <h1 class="logo">Mečo<span>vačka</span></h1>
      <p class="hint">Zadej kód z obrazovky PC</p>
      <input class="code-in" maxlength="${CODE_LENGTH}" autocomplete="off" autocapitalize="characters" spellcheck="false" value="${esc(this.code)}" inputmode="text">
      <button class="big" data-a="join">Připojit ⚔️</button>
      <p class="hint small">Nebo naskenuj QR kód fotoaparátem.</p>
    </div>`;
  }

  private connectingHtml() {
    return `<div class="scr center"><h1 class="logo">Mečo<span>vačka</span></h1><div class="spinner"></div>
      <p class="big-msg">Připojuji k <span class="code-b">${esc(this.code)}</span></p>
      <p class="status-line">${esc(this.status)}</p>
      <button class="link" data-a="change">Jiný kód</button></div>`;
  }

  private renderConnecting() {
    const el = document.querySelector(".status-line");
    if (el) el.textContent = this.status;
  }

  private sensorHtml() {
    const m = this.motion;
    if (!m.secure)
      return `<div class="sensor bad"><b>⚠️ Pohyb meče nefunguje přes http.</b><br>Otevři hru přes https (na Vercelu, nebo <code>npm run dev:https</code>). Zatím jde mířit prstem.</div>`;
    if (m.live && m.kind !== "touch")
      return `<div class="sensor ok"><b>✓ Meč sleduje telefon</b> <small>(${m.kind === "rel" ? "gyroskop" : "senzor natočení"})</small></div>`;
    if (m.needsPermission && !this.permAsked)
      return `<div class="sensor"><b>Povol pohybové senzory</b> — bez nich meč nepojede.<br><button class="big small-big" data-a="perm">Povolit pohyb</button></div>`;
    if (m.needsPermission)
      return `<div class="sensor bad"><b>Senzory nejsou povolené.</b> Zavři stránku a otevři ji znovu, pak dej „Povolit“.<br><button class="link" data-a="perm">Zkusit znovu</button></div>`;
    return `<div class="sensor bad"><b>Telefon neposílá natočení.</b> Nemá gyroskop, nebo ho prohlížeč nepustí. Jde mířit prstem.</div>`;
  }

  private lobbyHtml() {
    const s = this.settings;
    const chars = CHARACTERS.map(
      (c) => `<button class="ch" data-char="${c.id}" style="--c:${hex(c.main)}">${avatar(c.id)}<b>${c.short}</b><small>${c.cls} · ${c.trait}</small></button>`,
    ).join("");
    return `<div class="scr lobby-scr">
      <div class="lb-top"><span class="me-av"></span><div class="me"><input class="name-in" maxlength="14" placeholder="Tvoje jméno" value="${esc(this.name)}"><span class="status"></span></div></div>
      <div class="sensor-box">${this.sensorHtml()}</div>
      <div class="hold-tip"><div class="phone-pic">${padImg("hold") ? `<img src="${padImg("hold")}" alt="">` : phonePic()}</div><p><b>Drž telefon jako rukojeť meče:</b> na výšku, horní hrana míří jako čepel, palec na displeji. Palcem držíš <b>KRYT</b>.</p></div>
      <h2>Vyber si šermíře</h2>
      <div class="chars">${chars}</div>
      <div class="row">
        <div class="seg" role="group" aria-label="Ruka"><button data-hand="R" class="${s.hand === "R" ? "on" : ""}">✋ Pravák</button><button data-hand="L" class="${s.hand === "L" ? "on" : ""}">🤚 Levák</button></div>
        <label class="tog"><input type="checkbox" data-set="vibrate" ${s.vibrate ? "checked" : ""}><span>Vibrace</span></label>
      </div>
      <div class="host-box"></div>
    </div>`;
  }

  private updateLobby() {
    const L = this.lobby;
    const app = document.getElementById("app")!;
    if (!L) return;
    const me = L.players.find((p) => p.slot === L.you);
    const used = new Set(L.players.filter((p) => p.slot !== L.you).map((p) => p.char));
    app.querySelectorAll<HTMLButtonElement>(".ch").forEach((b) => {
      const id = Number(b.dataset.char);
      b.classList.toggle("sel", id === me?.char);
      b.classList.toggle("taken", used.has(id));
      b.disabled = used.has(id);
    });
    const meAv = app.querySelector(".me-av");
    if (meAv && me) meAv.innerHTML = avatar(me.char, "av big-av");
    const box = app.querySelector(".host-box") as HTMLElement | null;
    if (box) box.innerHTML = this.hostHtml(L);
    const sb = app.querySelector(".sensor-box");
    if (sb) sb.innerHTML = this.sensorHtml();
    this.renderStatus();
  }

  private hostHtml(L: LobbyMsg) {
    const others = L.players.filter((p) => p.slot !== L.you);
    const opp = others.length
      ? `<p class="vs">Soupeř: ${avatar(others[0].char, "av sm")} <b>${esc(others[0].name)}</b>${others[0].online ? "" : " <small>(offline)</small>"}</p>`
      : `<p class="vs">Soupeř: počítač 🤖 <small>(druhý hráč se připojí stejným QR kódem)</small></p>`;
    if (L.playing) return `${opp}<p class="wait">Hra běží na PC…</p>`;
    if (!L.host) return `${opp}<p class="wait">⏳ Čeká se, až <b>hráč 1</b> spustí hru.</p>`;
    const mode = MODES[L.mode] ?? MODES[0];
    const modes = MODES.map((m, i) => {
      const icon = modeImg(m.id);
      return `<button data-mode="${i}" class="${i === L.mode ? "on" : ""}">${icon ? `<img class="mi" src="${icon}" alt="">` : m.emoji} ${m.name}</button>`;
    }).join("");
    const vsCpu = others.length === 0;
    return `${opp}
      <div class="seg modes" role="group" aria-label="Hra">${modes}</div>
      <p class="mode-desc">${esc(mode.desc)}</p>
      <div class="opts">
        ${vsCpu && mode.id !== "train" ? `<div class="opt"><small>Počítač</small><div class="stepper"><button data-cmd="diff" data-d="-1">◀</button><b>${DIFFS[L.diff]}</b><button data-cmd="diff" data-d="1">▶</button></div></div>` : ""}
        ${mode.id === "duel" ? `<div class="opt"><small>Zápas</small><div class="stepper"><button data-cmd="rounds" data-d="-1">◀</button><b>${ROUND_LABEL[L.rounds]}</b><button data-cmd="rounds" data-d="1">▶</button></div></div>` : ""}
      </div>
      <button class="big start" data-a="start">START ⚔️</button>`;
  }

  private renderStatus() {
    const el = document.querySelector(".status");
    if (!el) return;
    const ok = !!this.net?.open;
    el.textContent = ok
      ? `${this.slot >= 0 ? `hráč ${this.slot + 1} · ` : ""}připojeno k ${this.code}${this.ping ? ` · ${this.ping} ms` : ""}${this.net?.fast ? "" : " · pomalý kanál"}`
      : this.status || "odpojeno";
    el.classList.toggle("bad", !ok);
  }

  /** Stav senzoru se mění (povolení, výpadek) → překreslit, co ho ukazuje. */
  private refreshSensor() {
    const key = `${this.motion.live}:${this.motion.kind}:${this.permAsked}`;
    if (this.sensorKey === key) return;
    this.sensorKey = key;
    if (this.screen === "lobby") {
      const sb = document.querySelector(".sensor-box");
      if (sb) sb.innerHTML = this.sensorHtml();
    } else if (this.screen === "game") this.updateGame(this.hud);
  }

  private resultsHtml() {
    const R = this.results!;
    const host = !!this.lobby?.host;
    const rows = R.rows
      .map(
        (r) =>
          `<div class="rr ${r.slot === R.you && r.human ? "me" : ""} ${r.win ? "win" : ""}">${avatar(r.char, "av sm")}<div><b>${esc(r.name)}${r.win ? " 🏆" : ""}</b><small>${esc(r.sub)}</small></div><span class="rmain">${esc(r.main)}</span></div>`,
      )
      .join("");
    return `<div class="scr results-scr"><h1 class="res-title">${esc(R.title)}</h1><div class="rows">${rows}</div>
      ${host ? `<button class="big" data-a="again">↻ Odveta</button><button class="big ghost" data-a="menu">Zpět do menu</button>` : `<p class="wait">Hráč 1 vybírá, co dál…</p>`}</div>`;
  }

  // ---------------------------------------------------------------- hra (meč)

  private gameHtml() {
    return `<div class="game">
      <div class="g-top">
        <button class="g-btn" data-a="cal">⟲ Vyrovnat</button>
        <div class="g-score"></div>
        <button class="g-btn pause-btn" data-a="pause" hidden>⏸</button>
      </div>
      <div class="g-msg"></div>
      <div class="g-sensor"></div>
      <div class="g-pads">
        <div class="aim" hidden><div class="aim-dot"></div><span>mířit prstem</span></div>
        <div class="guard"><div class="shield">${padImg("shield") ? `<img src="${padImg("shield")}" alt="">` : SHIELD_SVG}</div><b>KRYT</b><small>drž palcem</small></div>
      </div>
      <div class="toast" hidden></div>
      <div class="paused" hidden></div>
    </div>`;
  }

  private updateGame(prev: HudState | null) {
    const el = this.gameEl;
    const h = this.hud;
    if (!el || !h) return;
    (el.querySelector(".g-msg") as HTMLElement).textContent = h.msg;
    el.classList.toggle("ready", h.ready);
    el.dataset.phase = h.phase;
    const sc = el.querySelector(".g-score") as HTMLElement;
    sc.innerHTML =
      h.mode === "duel"
        ? `<small>kolo ${h.round}</small><b>${h.score[0]} : ${h.score[1]}</b>`
        : h.mode === "slice"
          ? `<small>body</small><b>${h.score[0]}${h.score[1] >= 0 ? ` : ${h.score[1]}` : ""}</b>`
          : `<small>trénink</small><b>${h.score[0]}</b>`;
    (el.querySelector(".pause-btn") as HTMLElement).hidden = !h.host;
    const m = this.motion;
    const touchMode = !m.live || m.kind === "touch";
    (el.querySelector(".aim") as HTMLElement).hidden = !touchMode;
    el.classList.toggle("touch-mode", touchMode);
    const gs = el.querySelector(".g-sensor") as HTMLElement;
    if (touchMode && m.needsPermission) gs.innerHTML = `<button class="big small-big" data-a="perm">Povolit pohyb meče</button>`;
    else if (touchMode) gs.innerHTML = `<small>Senzor natočení nejede — miř prstem vlevo, KRYT vpravo.</small>`;
    else gs.innerHTML = "";
    if (prev && prev.ready !== h.ready && h.ready) this.buzz(30);
    const pz = el.querySelector(".paused") as HTMLElement;
    pz.hidden = !h.pause;
    const pzKey = `${h.pause}:${h.host}`;
    if (pz.dataset.k !== pzKey) {
      pz.dataset.k = pzKey;
      pz.innerHTML = h.host
        ? `<h2>Pauza</h2><button class="big" data-a="pause">▶ Pokračovat</button><button class="big ghost" data-a="restart">↻ Začít znovu</button><button class="big ghost" data-a="quit">⏏ Do menu</button>`
        : `<h2>Pauza</h2><p class="hint">Hráč 1 dal pauzu.</p>`;
    }
  }

  private wireGame(root: HTMLElement) {
    const guard = root.querySelector(".guard") as HTMLElement;
    const setGuard = () => {
      guard.classList.toggle("on", this.guards.size > 0);
      this.sendSample();
    };
    guard.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      guard.setPointerCapture?.(e.pointerId);
      this.guards.add(e.pointerId);
      if (this.guards.size === 1) this.buzz(8);
      setGuard();
    });
    const up = (e: PointerEvent) => {
      if (!this.guards.delete(e.pointerId)) return;
      setGuard();
    };
    guard.addEventListener("pointerup", up);
    guard.addEventListener("pointercancel", up);
    guard.addEventListener("lostpointercapture", up);

    const aim = root.querySelector(".aim") as HTMLElement;
    const dot = aim.querySelector(".aim-dot") as HTMLElement;
    const move = (e: PointerEvent) => {
      const r = aim.getBoundingClientRect();
      const dx = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1));
      const dy = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1));
      dot.style.transform = `translate(${dx * 42}%, ${dy * 42}%)`;
      this.motion.touch(dx, dy);
    };
    aim.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      aim.setPointerCapture?.(e.pointerId);
      this.aimId = e.pointerId;
      move(e);
    });
    aim.addEventListener("pointermove", (e) => {
      if (e.pointerId === this.aimId) move(e);
    });
    const aimUp = (e: PointerEvent) => {
      if (e.pointerId !== this.aimId) return;
      this.aimId = -1;
    };
    aim.addEventListener("pointerup", aimUp);
    aim.addEventListener("pointercancel", aimUp);
  }

  private toast(text: string) {
    const t = document.querySelector(".toast") as HTMLElement | null;
    if (!t) return;
    t.textContent = text;
    t.hidden = false;
    clearTimeout(this.toastTimer);
    this.toastTimer = window.setTimeout(() => (t.hidden = true), 1400);
  }

  private buzz(ms: number) {
    if (this.settings.vibrate) navigator.vibrate?.(ms);
  }

  // ---------------------------------------------------------------- ovládání

  private wire(app: HTMLElement) {
    app.onclick = (e) => {
      const t = e.target as HTMLElement;
      const a = (t.closest("[data-a]") as HTMLElement | null)?.dataset.a;
      const ch = t.closest("[data-char]") as HTMLElement | null;
      const hand = t.closest("[data-hand]") as HTMLElement | null;
      const mode = t.closest("[data-mode]") as HTMLElement | null;
      const cmd = t.closest("[data-cmd]") as HTMLElement | null;
      if (a) void this.action(a);
      else if (ch && !(ch as HTMLButtonElement).disabled) {
        this.char = Number(ch.dataset.char);
        save("mc_char", this.char);
        this.net?.send({ t: "me", char: this.char });
        this.buzz(10);
      } else if (hand) {
        this.settings.hand = hand.dataset.hand === "L" ? "L" : "R";
        save("mc_pad", this.settings);
        app.querySelectorAll("[data-hand]").forEach((b) => b.classList.toggle("on", (b as HTMLElement).dataset.hand === this.settings.hand));
        this.net?.send({ t: "me", hand: this.settings.hand });
      } else if (mode) this.net?.send({ t: "cmd", c: "mode", v: Number(mode.dataset.mode) });
      else if (cmd && this.lobby) {
        const d = Number(cmd.dataset.d);
        const c = cmd.dataset.cmd as "diff" | "rounds";
        const cur = c === "diff" ? this.lobby.diff : this.lobby.rounds;
        const n = c === "diff" ? DIFFS.length : ROUND_LABEL.length;
        this.net?.send({ t: "cmd", c, v: (cur + d + n) % n });
      }
    };
    const codeIn = app.querySelector(".code-in") as HTMLInputElement | null;
    if (codeIn) {
      codeIn.addEventListener("input", () => {
        codeIn.value = normalizeCode(codeIn.value);
        if (codeIn.value.length === CODE_LENGTH) void this.action("join");
      });
      codeIn.addEventListener("keydown", (e) => {
        if (e.key === "Enter") void this.action("join");
      });
      if (!this.code) setTimeout(() => codeIn.focus(), 50);
    }
    const nameIn = app.querySelector(".name-in") as HTMLInputElement | null;
    if (nameIn) {
      nameIn.addEventListener("input", () => {
        this.name = nameIn.value.slice(0, 14);
        save("mc_name", this.name);
        clearTimeout(this.nameTimer);
        this.nameTimer = window.setTimeout(() => this.net?.send({ t: "me", name: this.name }), 350);
      });
    }
    app.querySelectorAll<HTMLInputElement>("[data-set]").forEach((inp) => {
      inp.addEventListener("change", () => {
        if (inp.dataset.set === "vibrate") this.settings.vibrate = inp.checked;
        save("mc_pad", this.settings);
        if (inp.checked) this.buzz(15);
      });
    });
  }

  private async action(a: string) {
    switch (a) {
      case "join": {
        const inp = document.querySelector(".code-in") as HTMLInputElement | null;
        const code = normalizeCode(inp?.value ?? "");
        if (code.length !== CODE_LENGTH) return;
        this.code = code;
        const u = new URL(location.href);
        u.searchParams.set("r", code);
        history.replaceState(null, "", u);
        await this.askMotion();
        this.connect();
        break;
      }
      case "change":
        this.net?.stop();
        this.net = null;
        this.code = "";
        this.show("code");
        break;
      case "retry":
        this.connect();
        break;
      case "perm":
        await this.askMotion(true);
        break;
      case "start":
        await this.askMotion();
        this.goFullscreen();
        this.net?.send({ t: "cmd", c: "start" });
        break;
      case "again":
        this.net?.send({ t: "cmd", c: "next" });
        break;
      case "menu":
        this.net?.send({ t: "cmd", c: "lobby" });
        break;
      case "pause":
        this.net?.send({ t: "cmd", c: "pause" });
        break;
      case "restart":
        this.net?.send({ t: "cmd", c: "restart" });
        break;
      case "quit":
        this.net?.send({ t: "cmd", c: "quit" });
        break;
      case "cal":
        this.net?.send({ t: "cal" });
        this.buzz(25);
        this.toast("Vyrovnáno — meč míří na obrazovku");
        break;
    }
  }

  /** iPhone: povolení senzorů (jen po ťuknutí). */
  private async askMotion(force = false) {
    if (!this.motion.needsPermission || (this.motion.live && !force)) return;
    this.permAsked = true;
    await this.motion.request();
    setTimeout(() => this.refreshSensor(), 400);
    if (this.screen === "lobby") this.updateLobby();
  }

  private goFullscreen() {
    if (isIOS) return;
    const el = document.documentElement as HTMLElement & { requestFullscreen?: (o?: FullscreenOptions) => Promise<void> };
    void el
      .requestFullscreen?.({ navigationUI: "hide" })
      .then(() => (screen.orientation as ScreenOrientation & { lock?: (o: string) => Promise<void> }).lock?.("portrait"))
      .catch(() => {});
  }

  private async keepAwake() {
    try {
      if ("wakeLock" in navigator && !this.wake && document.visibilityState === "visible") {
        this.wake = await navigator.wakeLock.request("screen");
        this.wake.addEventListener("release", () => (this.wake = null));
      }
    } catch {
      /* nepodporováno */
    }
  }
}

function phonePic() {
  return `<svg viewBox="0 0 120 170" aria-hidden="true">
    <path d="M60 78 V8" stroke="#1b1430" stroke-width="16" stroke-linecap="round"/>
    <path d="M60 78 V8" stroke="#ffd21f" stroke-width="10" stroke-linecap="round"/>
    <rect x="42" y="70" width="36" height="74" rx="8" fill="#e9e6ff" stroke="#1b1430" stroke-width="4"/>
    <rect x="47" y="78" width="26" height="52" rx="3" fill="#4fd1ff"/>
    <path d="M38 104 C30 116 32 146 46 160 L76 160 C88 148 90 124 84 108 C80 100 72 102 72 110 L72 96 C72 90 64 90 64 96 L64 106" fill="#ffc69c" stroke="#1b1430" stroke-width="4" stroke-linejoin="round"/>
    <circle cx="60" cy="102" r="7" fill="#ff4d6d" stroke="#1b1430" stroke-width="3"/>
  </svg>`;
}

new Pad();
