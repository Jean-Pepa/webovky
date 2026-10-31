// Ovladač v telefonu: připojení k PC, výběr postavy, řízení (náklon / dotyk), tlačítka, vibrace.
import "@fontsource/lilita-one/latin-400.css";
import "@fontsource/lilita-one/latin-ext-400.css";
import "@fontsource/baloo-2/latin-600.css";
import "@fontsource/baloo-2/latin-ext-600.css";
import "@fontsource/baloo-2/latin-800.css";
import "@fontsource/baloo-2/latin-ext-800.css";
import "../styles/pad.css";
import { CHARACTERS, hex } from "../shared/characters";
import { ITEMS, ITEM_IDS, throwable, type ItemId } from "../shared/items";
import { charImg, itemImg, padImg } from "../shared/assets";
import {
  CODE_LENGTH,
  PROTOCOL_VERSION,
  normalizeCode,
  type HostMsg,
  type HudState,
  type Phase,
} from "../shared/protocol";
import { PadNet } from "./net";
import { Tilt } from "./tilt";

type Screen = "code" | "connecting" | "lobby" | "race" | "results" | "full";
type LobbyMsg = Extract<HostMsg, { t: "lobby" }>;
type ResultsMsg = Extract<HostMsg, { t: "results" }>;

interface Settings {
  mode: "tilt" | "touch";
  autoGas: boolean;
  sens: number;
  vibrate: boolean;
}

const SENS = [40, 28, 18];
const SENS_LABEL = ["nízká", "střední", "vysoká"];
const secure = window.isSecureContext;
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

function avatar(id: number, cls = "av") {
  const c = CHARACTERS[id] ?? CHARACTERS[0];
  const src = charImg(c.id);
  return `<span class="${cls}" style="--c:${hex(c.kart)}">${src ? `<img src="${src}" alt="">` : `<span>${c.emoji}</span>`}</span>`;
}
function itemIcon(id: ItemId | null) {
  if (!id) return "";
  const src = itemImg(id);
  return src ? `<img src="${src}" alt="${ITEMS[id].name}">` : ITEMS[id].emoji;
}
function btnIcon(name: "gas" | "brake" | "drift" | "item", fallback: string) {
  const src = padImg(name);
  return src ? `<img class="bi" src="${src}" alt="">` : `<span class="bi">${fallback}</span>`;
}

class Pad {
  private screen: Screen = "code";
  private code = normalizeCode(new URLSearchParams(location.search).get("r") ?? "");
  private net: PadNet | null = null;
  private tilt = new Tilt();
  private settings: Settings = load<Settings>("tk_pad", {
    mode: secure && "DeviceOrientationEvent" in window ? "tilt" : "touch",
    autoGas: false,
    sens: 1,
    vibrate: true,
  });
  private cid = load<string>("tk_cid", "") || this.newCid();
  private name = load<string>("tk_name", "");
  private char = load<number>("tk_char", -1);
  private slot = -1;
  private lobby: LobbyMsg | null = null;
  private phase: Phase = "lobby";
  private hud: HudState | null = null;
  private results: ResultsMsg | null = null;
  private status = "";
  private ping = 0;
  private held = { gas: false, brake: false, drift: false };
  private touchSteer = 0;
  private lastSent = "";
  private lastSentAt = 0;
  private wake: WakeLockSentinel | null = null;
  /** uživatel povolil senzory (iPhone) */
  private permOk = false;
  private raceEl: HTMLElement | null = null;
  private tiltWarned = false;
  private raceStartedAt = 0;
  private nameTimer = 0;

  constructor() {
    this.tilt.fullLock = SENS[this.settings.sens] ?? 28;
    // posloucháme hned; na Androidu data chodí bez ptaní, na iPhonu až po povolení
    if (secure) this.tilt.start();
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") void this.keepAwake();
    });
    document.addEventListener("gesturestart", (e) => e.preventDefault());
    document.addEventListener("contextmenu", (e) => e.preventDefault());
    setInterval(() => this.tick(), 33);
    setInterval(() => this.net?.send({ t: "ping", ts: performance.now() }), 1000);
    requestAnimationFrame(() => this.anim());
    if (this.code.length === CODE_LENGTH) this.connect();
    else this.show("code");
    (window as unknown as { __pad: unknown }).__pad = {
      state: () => ({
        screen: this.screen,
        mode: this.settings.mode,
        autoGas: this.settings.autoGas,
        steer: this.steerValue(),
        tiltLive: this.tilt.live,
        tiltAngle: Math.round(this.tilt.angle * 10) / 10,
        held: { ...this.held },
        hud: this.hud,
        open: !!this.net?.open,
      }),
      tilt: this.tilt,
    };
  }

  private newCid() {
    const id = (crypto.randomUUID?.() ?? Math.random().toString(36).slice(2) + Date.now().toString(36)).slice(0, 36);
    save("tk_cid", id);
    return id;
  }

  // ------------------------------------------------------------ spojení

  private connect() {
    this.show("connecting");
    this.net?.stop();
    const url = new URL(location.href);
    url.searchParams.set("r", this.code);
    history.replaceState(null, "", url.toString());
    this.net = new PadNet(this.code, {
      open: () => {
        this.status = "";
        this.net!.send({ t: "hello", cid: this.cid, name: this.name, char: this.char, v: PROTOCOL_VERSION });
      },
      closed: (reason) => {
        this.status = reason;
        if (this.screen === "race" || this.screen === "lobby" || this.screen === "results") this.renderStatus();
        else this.show("connecting");
      },
      message: (m) => this.onMessage(m),
    });
    this.net.connect();
  }

  private onMessage(m: HostMsg) {
    switch (m.t) {
      case "welcome":
        this.slot = m.slot;
        this.status = "";
        void this.keepAwake();
        break;
      case "full":
        this.net?.stop();
        this.show("full");
        break;
      case "lobby": {
        this.lobby = m;
        const me = m.players.find((p) => p.slot === m.you);
        if (me) {
          this.char = me.char;
          save("tk_char", me.char);
          if (!this.name) this.name = me.name;
        }
        if (this.screen === "connecting" || (this.phase === "lobby" && this.screen !== "lobby")) this.show("lobby");
        else if (this.screen === "lobby") this.updateLobby();
        break;
      }
      case "phase":
        this.phase = m.p;
        if (m.p === "countdown" || m.p === "race") {
          if (this.screen !== "race") {
            this.raceStartedAt = performance.now();
            this.show("race");
          }
          this.setOverlay(m.p === "countdown" ? "Připrav se!" : "");
        } else if (m.p === "lobby") {
          this.results = null;
          this.show("lobby");
        }
        break;
      case "hud":
        this.hud = m;
        this.updateRace();
        break;
      case "buzz":
        if (this.settings.vibrate) navigator.vibrate?.(m.ms);
        break;
      case "results":
        this.results = m;
        this.show("results");
        break;
      case "pong":
        this.ping = Math.max(0, Math.round(performance.now() - m.ts));
        this.renderStatus();
        break;
    }
  }

  /** Náklon je zvolený, ale telefon (iPhone) ještě čeká na povolení senzorů. */
  private tiltBlocked() {
    return this.settings.mode === "tilt" && this.tilt.needsPermission && !this.tilt.everReceived && !this.permOk;
  }

  // ------------------------------------------------------------ vstupy

  private steerValue() {
    if (this.settings.mode === "tilt" && this.tilt.live) return this.tilt.steer;
    return this.touchSteer;
  }

  private tick() {
    if (this.screen !== "race" || !this.net?.open) return;
    const brake = this.held.brake;
    const gas = this.settings.autoGas ? (brake ? 0 : 1) : this.held.gas ? 1 : 0;
    const msg = { t: "in" as const, s: Math.round(this.steerValue() * 100) / 100, g: gas, b: brake ? 1 : 0, d: this.held.drift ? 1 : 0 };
    const key = `${msg.s}|${msg.g}|${msg.b}|${msg.d}`;
    const now = performance.now();
    if (key !== this.lastSent || now - this.lastSentAt > 150) {
      this.lastSent = key;
      this.lastSentAt = now;
      this.net.send(msg);
    }
    // náklon nereaguje → přepnout na dotyk
    const silent = !this.tilt.everReceived || now - this.tilt.lastEvent > 3000;
    if (this.settings.mode === "tilt" && silent && !this.tiltWarned && now - this.raceStartedAt > 3000 && !this.tiltBlocked()) {
      this.tiltWarned = true;
      this.settings.mode = "touch";
      this.settings.autoGas = true;
      save("tk_pad", this.settings);
      this.buildRace();
      this.toast("Senzor náklonu nereaguje — zapnuto dotykové řízení.");
    }
  }

  private useItem(dir: -1 | 0 | 1 = 0) {
    this.net?.send({ t: "item", dir });
    if (this.settings.vibrate) navigator.vibrate?.(12);
  }

  // ------------------------------------------------------------ obrazovky

  private show(s: Screen) {
    this.screen = s;
    this.raceEl = null;
    document.body.dataset.screen = s;
    const app = document.getElementById("app")!;
    if (s === "code") app.innerHTML = this.codeHtml();
    else if (s === "connecting") app.innerHTML = this.connectingHtml();
    else if (s === "lobby") app.innerHTML = this.lobbyHtml();
    else if (s === "race") this.buildRace();
    else if (s === "results") app.innerHTML = this.resultsHtml();
    else if (s === "full")
      app.innerHTML = `<div class="scr center"><h1 class="logo">Turbo<span>Káry</span></h1><p class="big-msg">Hra je plná 🙈</p><p>Najednou můžou hrát 4 hráči. Počkej na další závod a zkus to znovu.</p><button class="big" data-a="retry">Zkusit znovu</button></div>`;
    this.wire(app);
    if (s === "lobby") this.updateLobby();
  }

  private codeHtml() {
    return `<div class="scr center code-scr">
      <h1 class="logo">Turbo<span>Káry</span></h1>
      <p>Zadej kód, který vidíš na obrazovce PC:</p>
      <input class="code-in" maxlength="${CODE_LENGTH}" autocomplete="off" autocapitalize="characters" spellcheck="false" value="${esc(this.code)}" placeholder="ABCD">
      <button class="big" data-a="join">Připojit ▶</button>
      <p class="hint">Nejjednodušší je naskenovat QR kód fotoaparátem.</p>
    </div>`;
  }

  private connectingHtml() {
    return `<div class="scr center">
      <h1 class="logo">Turbo<span>Káry</span></h1>
      <div class="spinner"></div>
      <p>Připojuji se k PC s kódem <b class="code-b">${esc(this.code)}</b>…</p>
      <p class="status-line">${esc(this.status)}</p>
      <button class="link" data-a="change">Zadat jiný kód</button>
    </div>`;
  }

  private lobbyHtml() {
    const s = this.settings;
    const chars = CHARACTERS.map(
      (c) => `<button class="ch" data-char="${c.id}" style="--c:${hex(c.kart)}">${avatar(c.id)}<small>${c.short}</small></button>`,
    ).join("");
    return `<div class="scr lobby-scr">
      <header class="lb-top"><span class="me-av"></span><div class="me"><b class="me-name"></b><small class="status"></small></div></header>
      <label class="name-row">Jméno <input class="name-in" maxlength="14" value="${esc(this.name)}" placeholder="Tvoje jméno" autocomplete="off"></label>
      <div class="chars">${chars}</div>
      <div class="stats"></div>
      <section class="card settings">
        <h3>Ovládání</h3>
        <div class="seg" data-set="mode">
          <button data-v="tilt" ${secure ? "" : "disabled"}>📱 Náklon jako volant</button>
          <button data-v="touch">👆 Dotykem</button>
        </div>
        ${secure ? "" : `<p class="warn">Náklon funguje jen přes https (např. na Vercelu). Teď jde jen dotykové řízení.</p>`}
        <button class="big perm" data-a="perm" hidden>Povolit náklon telefonu</button>
        <div class="tilt-row" ${s.mode === "tilt" ? "" : "hidden"}>
          <span>Citlivost</span>
          <div class="seg small" data-set="sens">${SENS_LABEL.map((l, i) => `<button data-v="${i}">${l}</button>`).join("")}</div>
          <div class="wheel-mini"><div class="wheel-svg">${wheelSvg()}</div></div>
          <button class="link" data-a="center">Srovnat volant</button>
        </div>
        <label class="tog"><input type="checkbox" data-set="autoGas" ${s.autoGas ? "checked" : ""}><span>Automatický plyn</span></label>
        <label class="tog"><input type="checkbox" data-set="vibrate" ${s.vibrate ? "checked" : ""}><span>Vibrace</span></label>
      </section>
      <section class="card host-box" hidden>
        <h3>👑 Ty vybíráš závod</h3>
        <div class="seg" data-host="mode"><button data-v="0">🏁 Jeden závod</button><button data-v="1">🏆 Pohár (3 tratě)</button></div>
        <div class="host-opts">
          <div class="wide"><small class="track-label">Trať</small><div class="stepper"><button data-a="track-">◀</button><b class="track-name"></b><button data-a="track+">▶</button></div></div>
          <div class="wide"><small>Rychlost</small><div class="stepper"><button data-a="speed-">◀</button><b class="speed-name"></b><button data-a="speed+">▶</button></div></div>
          <div><small>Kola</small><div class="stepper"><button data-a="laps-">−</button><b class="laps"></b><button data-a="laps+">+</button></div></div>
          <div><small>Soupeři</small><div class="stepper"><button data-a="bots-">−</button><b class="bots"></b><button data-a="bots+">+</button></div></div>
        </div>
      </section>
      <p class="wait"></p>
      <div class="players"></div>
      <div class="start-bar" hidden><button class="big start" data-a="start">START ▶</button></div>
    </div>`;
  }

  private updateLobby() {
    if (this.screen !== "lobby") return;
    const app = document.getElementById("app")!;
    const l = this.lobby;
    const me = l?.players.find((p) => p.slot === l.you);
    const taken = new Set(l?.players.filter((p) => p.slot !== l.you).map((p) => p.char) ?? []);
    app.querySelectorAll<HTMLButtonElement>(".ch").forEach((b) => {
      const id = Number(b.dataset.char);
      b.disabled = taken.has(id);
      b.classList.toggle("on", id === this.char);
    });
    const av = app.querySelector(".me-av") as HTMLElement;
    av.innerHTML = avatar(this.char >= 0 ? this.char : 0);
    (app.querySelector(".me-name") as HTMLElement).textContent = me ? `Hráč ${me.slot + 1} · ${CHARACTERS[me.char].name}` : "Připojeno";
    app.querySelectorAll<HTMLElement>(".seg").forEach((seg) => {
      const key = seg.dataset.set as "mode" | "sens";
      seg.querySelectorAll<HTMLButtonElement>("button").forEach((b) => b.classList.toggle("on", String(this.settings[key]) === b.dataset.v));
    });
    const perm = app.querySelector(".perm") as HTMLElement;
    perm.hidden = !this.tiltBlocked();
    (app.querySelector(".tilt-row") as HTMLElement).hidden = this.settings.mode !== "tilt";
    const host = app.querySelector(".host-box") as HTMLElement;
    const isHost = !!l?.host;
    host.hidden = !isHost;
    (app.querySelector(".start-bar") as HTMLElement).hidden = !isHost || !!l?.racing;
    if (l) {
      (app.querySelector(".track-name") as HTMLElement).textContent = l.tracks[l.track] ?? "";
      (app.querySelector(".track-label") as HTMLElement).textContent = l.mode === "cup" ? "První trať poháru" : "Trať";
      (app.querySelector(".speed-name") as HTMLElement).textContent = l.speeds[l.speed] ?? "";
      (app.querySelector(".laps") as HTMLElement).textContent = String(l.laps);
      (app.querySelector(".bots") as HTMLElement).textContent = String(l.bots);
      app.querySelectorAll<HTMLButtonElement>("[data-host=mode] button").forEach((b) => b.classList.toggle("on", (l.mode === "cup" ? "1" : "0") === b.dataset.v));
    }
    const c = CHARACTERS[this.char >= 0 ? this.char : 0];
    const bar = (label: string, key: keyof (typeof c)["stats"]) => {
      const all = CHARACTERS.map((x) => x.stats[key]);
      const lo = Math.min(...all), hi = Math.max(...all);
      const v = 20 + ((c.stats[key] - lo) / (hi - lo || 1)) * 80;
      return `<div class="st"><span>${label}</span><i style="--v:${Math.round(v)}%"></i></div>`;
    };
    (app.querySelector(".stats") as HTMLElement).innerHTML = `<b>${c.name}</b><small>${c.cls} postava</small>
      ${bar("Rychlost", "speed")}${bar("Zrychlení", "accel")}${bar("Ovladatelnost", "handling")}${bar("Váha", "weight")}`;
    const wait = app.querySelector(".wait") as HTMLElement;
    const hostP = l?.players.find((p) => p.host);
    wait.textContent = l?.racing
      ? "Závod právě běží — přidáš se do dalšího."
      : isHost
        ? ""
        : hostP
          ? `Čekáme, až ${hostP.name} spustí závod…`
          : "Čekáme na start závodu…";
    (app.querySelector(".players") as HTMLElement).innerHTML = (l?.players ?? [])
      .map((p) => `<span class="pchip ${p.online ? "" : "off"}">${avatar(p.char, "av sm")}${esc(p.name)}${p.host ? " 👑" : ""}</span>`)
      .join("");
    this.renderStatus();
  }

  private renderStatus() {
    const el = document.querySelector(".status, .race-status");
    if (!el) return;
    const conn = this.net?.open;
    el.textContent = conn ? `kód ${this.code} · ${this.ping} ms` : this.status || "připojuji…";
    el.classList.toggle("bad", !conn);
  }

  private resultsHtml() {
    const r = this.results;
    if (!r) return `<div class="scr center"><div class="spinner"></div></div>`;
    const me = r.rows.find((x) => x.slot === this.slot);
    const isHost = !!this.lobby?.host;
    const cup = r.cup;
    const myCup = cup?.rows.find((x) => x.human && x.slot === this.slot);
    const rows = cup ? cup.rows.map((x) => ({ place: x.place, char: x.char, name: x.name, slot: x.human ? x.slot : -1, val: `${x.pts} b. (+${x.add})` }))
      : r.rows.map((x) => ({ place: x.place, char: x.char, name: x.name, slot: x.human ? x.slot : -1, val: x.time }));
    const btn = cup && !cup.final ? `Další závod: ${esc(cup.next ?? "")} ▶` : cup ? "Zpět do lobby" : "Další závod ▶";
    return `<div class="scr results-scr">
      <div class="res-head">${avatar(this.char)}<div><div class="place">${me ? me.place + "." : "–"}</div><small>místo${me ? " · " + me.time : ""}</small></div></div>
      ${cup ? `<p class="cup-line">${cup.final ? "🏆 Konec poháru" : `Pohár · ${cup.round}/${cup.of}`}${myCup ? ` · celkem <b>${myCup.place}.</b> (${myCup.pts} b.)` : ""}</p>` : ""}
      ${r.record ? `<p class="record">🏆 ${esc(r.record)}</p>` : ""}
      <ol class="res-list">${rows
        .map((x) => `<li class="${x.slot === this.slot ? "me" : ""}"><b>${x.place}.</b>${avatar(x.char, "av sm")}<span>${esc(x.name)}</span><i>${x.val}</i></li>`)
        .join("")}</ol>
      ${isHost ? `<div class="start-bar"><button class="big" data-a="next">${btn}</button></div>` : `<p class="wait">Čekáme na hráče 1…</p>`}
    </div>`;
  }

  // ------------------------------------------------------------ závod

  private buildRace() {
    const app = document.getElementById("app")!;
    const s = this.settings;
    app.innerHTML = `<div class="race-scr mode-${s.mode} ${s.autoGas ? "autogas" : ""}">
      <div class="col left">
        <div class="steer-pad" data-steer><div class="track"><div class="knob"></div></div><span>◀ táhni do stran ▶</span></div>
        <button class="btn item" data-b="item">${btnIcon("item", "⭐")}<b>VĚC</b></button>
        <button class="btn drift" data-b="drift">${btnIcon("drift", "↯")}<b>DRIFT</b></button>
      </div>
      <div class="mid">
        <div class="race-status"></div>
        <div class="pos"><b>–</b><small></small></div>
        <div class="lap"></div>
        <button class="item-big" data-b="item"><span class="ic"></span><small class="cnt"></small></button>
        <div class="throw-hint">↑ švihni dopředu · ↓ za sebe</div>
        <div class="wheel">${wheelSvg()}</div>
        <button class="link center-btn" data-a="center">Srovnat</button>
        <button class="pause-btn" data-a="pause" hidden aria-label="Pauza">⏸</button>
      </div>
      <div class="col right">
        <button class="btn brake" data-b="brake">${btnIcon("brake", "▼")}<b>BRZDA</b></button>
        <button class="btn gas" data-b="gas">${btnIcon("gas", "▲")}<b>PLYN</b></button>
        <button class="btn drift drift2" data-b="drift">${btnIcon("drift", "↯")}<b>DRIFT</b></button>
      </div>
      <div class="overlay-msg"></div>
      <div class="pause-ov" hidden><b>Pauza</b><div class="pause-host"><button class="big" data-a="pause">▶ Pokračovat</button>
        <button data-a="restart">↻ Znovu</button><button data-a="quit">⏏ Do lobby</button></div><p class="pause-wait">Čekáme, až hostitel bude pokračovat…</p></div>
      <div class="toast"></div>
      <div class="rotate" data-a="fs">🔄<b>Otoč telefon na šířku</b><small>${isIOS ? "" : "nebo sem ťukni"}</small></div>
      ${this.tiltBlocked() ? `<button class="perm-overlay" data-a="perm">Ťukni a povol náklon telefonu</button>` : ""}
    </div>`;
    this.raceEl = app.firstElementChild as HTMLElement;
    this.held = { gas: false, brake: false, drift: false };
    this.touchSteer = 0;
    this.wireRace(this.raceEl);
    this.wire(app);
    this.updateRace();
    this.renderStatus();
  }

  private setOverlay(text: string) {
    const o = this.raceEl?.querySelector(".overlay-msg") as HTMLElement | null;
    if (!o) return;
    o.textContent = text;
    o.classList.toggle("show", !!text);
  }

  private toast(text: string) {
    const t = this.raceEl?.querySelector(".toast") as HTMLElement | null;
    if (!t) return;
    t.textContent = text;
    t.classList.add("show");
    setTimeout(() => t.classList.remove("show"), 3500);
  }

  private updateRace() {
    const el = this.raceEl;
    const h = this.hud;
    if (!el || !h) return;
    (el.querySelector(".pos b") as HTMLElement).textContent = `${h.pos}.`;
    (el.querySelector(".pos small") as HTMLElement).textContent = `/${h.of}`;
    (el.querySelector(".lap") as HTMLElement).textContent = h.fin ? "🏁 V CÍLI" : `Kolo ${h.lap}/${h.laps}`;
    const big = el.querySelector(".item-big") as HTMLElement;
    const ic = big.querySelector(".ic") as HTMLElement;
    const html = h.roll ? "" : itemIcon((h.item as ItemId | null) ?? null);
    if (ic.dataset.k !== (h.roll ? "roll" : h.item ?? "")) {
      ic.dataset.k = h.roll ? "roll" : h.item ?? "";
      ic.innerHTML = html;
    }
    (big.querySelector(".cnt") as HTMLElement).textContent = h.item === "turbo3" && h.n > 1 ? `×${h.n}` : "";
    big.classList.toggle("has", !!h.item && !h.roll);
    el.classList.toggle("can-throw", !!h.item && !h.roll && throwable(h.item as ItemId));
    big.classList.toggle("roll", h.roll);
    el.querySelectorAll(".btn.item").forEach((b) => b.classList.toggle("ready", !!h.item && !h.roll));
    el.dataset.drift = String(h.drift);
    el.classList.toggle("boost", h.boost);
    el.classList.toggle("shield", h.shield);
    if (h.fin) this.setOverlay("🏁 Cíl!");
    (el.querySelector(".pause-btn") as HTMLElement).hidden = !h.host;
    const ov = el.querySelector(".pause-ov") as HTMLElement;
    ov.hidden = !h.pause;
    (ov.querySelector(".pause-host") as HTMLElement).hidden = !h.host;
    (ov.querySelector(".pause-wait") as HTMLElement).hidden = h.host;
  }

  private anim() {
    requestAnimationFrame(() => this.anim());
    const el = this.raceEl ?? (this.screen === "lobby" ? document.querySelector(".wheel-mini") : null);
    if (!el) return;
    const steer = this.screen === "lobby" ? this.tilt.steer : this.steerValue();
    const w = el.querySelector(".wheel svg, .wheel-svg svg") as SVGElement | null;
    if (w) w.style.transform = `rotate(${steer * 90}deg)`;
    if (this.raceEl) {
      const knob = this.raceEl.querySelector(".knob") as HTMLElement | null;
      if (knob) knob.style.transform = `translateX(${this.touchSteer * 100}%)`;
      // ruleta věci
      const h = this.hud;
      if (h?.roll) {
        const ic = this.raceEl.querySelector(".item-big .ic") as HTMLElement;
        const id = ITEM_IDS[Math.floor(performance.now() / 90) % ITEM_IDS.length];
        if (ic.dataset.r !== id) {
          ic.dataset.r = id;
          ic.innerHTML = itemIcon(id);
        }
      }
    }
  }

  private wireRace(root: HTMLElement) {
    const press = (b: HTMLElement, on: boolean) => {
      const k = b.dataset.b as "gas" | "brake" | "drift" | "item";
      if (k === "item") {
        /* věc se použije až při puštění nebo švihnutí (viz níže) */
      } else {
        this.held[k] = on;
        root.querySelectorAll(`[data-b=${k}]`).forEach((x) => x.classList.toggle("on", on));
      }
      if (on) b.classList.add("on");
      else if (k === "item") b.classList.remove("on");
    };
    // VĚC: ťuknutí = výchozí směr, švihnutí nahoru = dopředu, dolů = za sebe
    root.querySelectorAll<HTMLElement>("[data-b=item]").forEach((b) => {
      let pid = -1, y0 = 0, dy = 0, fired = true;
      const fire = (dir: -1 | 0 | 1) => {
        if (fired) return;
        fired = true;
        pid = -1;
        this.useItem(dir);
        b.classList.add("on");
        setTimeout(() => b.classList.remove("on"), 120);
      };
      const dirOf = (d: number): -1 | 0 | 1 => (d < -28 ? 1 : d > 28 ? -1 : 0);
      b.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        this.goFullscreen();
        try {
          b.setPointerCapture(e.pointerId);
        } catch {
          /* ukazatel už není aktivní */
        }
        pid = e.pointerId;
        y0 = e.clientY;
        dy = 0;
        fired = false;
      });
      b.addEventListener("pointermove", (e) => {
        if (e.pointerId !== pid || fired) return;
        dy = e.clientY - y0;
        if (dirOf(dy)) fire(dirOf(dy));
      });
      // puštění i zrušení dotyku (prohlížeč si gesto „vzal“) = použít věc
      const end = (e: PointerEvent) => {
        if (e.pointerId !== pid) return;
        if (e.type === "pointerup") dy = e.clientY - y0;
        fire(dirOf(dy));
      };
      b.addEventListener("pointerup", end);
      b.addEventListener("pointercancel", end);
      b.addEventListener("lostpointercapture", end);
    });
    root.querySelectorAll<HTMLElement>("[data-b]:not([data-b=item])").forEach((b) => {
      const pointers = new Set<number>();
      b.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        this.goFullscreen();
        try {
          b.setPointerCapture(e.pointerId);
        } catch {
          /* ukazatel už není aktivní */
        }
        if (!pointers.size) press(b, true);
        pointers.add(e.pointerId);
      });
      const up = (e: PointerEvent) => {
        if (!pointers.delete(e.pointerId)) return;
        if (!pointers.size) press(b, false);
      };
      b.addEventListener("pointerup", up);
      b.addEventListener("pointercancel", up);
      b.addEventListener("lostpointercapture", up);
    });
    const pad = root.querySelector("[data-steer]") as HTMLElement;
    let pid = -1, x0 = 0;
    pad.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      this.goFullscreen();
      try {
        pad.setPointerCapture(e.pointerId);
      } catch {
        /* ukazatel už není aktivní */
      }
      pid = e.pointerId;
      x0 = e.clientX;
      this.touchSteer = 0;
    });
    pad.addEventListener("pointermove", (e) => {
      if (e.pointerId !== pid) return;
      const range = Math.max(40, pad.clientWidth * 0.28);
      this.touchSteer = Math.max(-1, Math.min(1, (e.clientX - x0) / range));
    });
    const end = (e: PointerEvent) => {
      if (e.pointerId !== pid) return;
      pid = -1;
      this.touchSteer = 0;
    };
    pad.addEventListener("pointerup", end);
    pad.addEventListener("pointercancel", end);
    pad.addEventListener("lostpointercapture", end);
  }

  // ------------------------------------------------------------ události

  private wire(app: HTMLElement) {
    app.onclick = (e) => {
      const t = e.target as HTMLElement;
      const a = t.closest("[data-a]") as HTMLElement | null;
      const ch = t.closest("[data-char]") as HTMLButtonElement | null;
      const seg = t.closest(".seg button") as HTMLButtonElement | null;
      if (ch && !ch.disabled) {
        this.char = Number(ch.dataset.char);
        save("tk_char", this.char);
        this.net?.send({ t: "me", char: this.char });
        this.updateLobby();
        if (this.settings.vibrate) navigator.vibrate?.(10);
        return;
      }
      if (seg && (seg.parentElement as HTMLElement).dataset.host === "mode") {
        this.net?.send({ t: "cmd", c: "mode", v: Number(seg.dataset.v) });
        return;
      }
      if (seg && !seg.disabled) {
        const key = (seg.parentElement as HTMLElement).dataset.set as "mode" | "sens";
        if (key === "mode") {
          this.settings.mode = seg.dataset.v as Settings["mode"];
          if (this.settings.mode === "touch" && !load("tk_pad_touched", false)) {
            this.settings.autoGas = true;
            save("tk_pad_touched", true);
            const cb = app.querySelector("[data-set=autoGas]") as HTMLInputElement | null;
            if (cb) cb.checked = true;
          }
          if (this.settings.mode === "tilt" && secure) this.tilt.start();
        } else {
          this.settings.sens = Number(seg.dataset.v);
          this.tilt.fullLock = SENS[this.settings.sens];
        }
        this.tiltWarned = false;
        save("tk_pad", this.settings);
        this.updateLobby();
        return;
      }
      if (!a) return;
      switch (a.dataset.a) {
        case "join": {
          const v = normalizeCode((app.querySelector(".code-in") as HTMLInputElement).value);
          if (v.length === CODE_LENGTH) {
            this.code = v;
            this.connect();
          }
          break;
        }
        case "change":
          this.net?.stop();
          this.net = null;
          this.show("code");
          break;
        case "retry":
          this.connect();
          break;
        case "perm":
          void this.tilt.request().then((ok) => {
            this.permOk = ok;
            if (!ok) {
              this.settings.mode = "touch";
              this.settings.autoGas = true;
              save("tk_pad", this.settings);
            }
            if (this.screen === "race") this.buildRace();
            else this.updateLobby();
          });
          break;
        case "center":
          this.tilt.recenter();
          break;
        case "fs":
          this.goFullscreen();
          break;
        case "start":
          this.goFullscreen();
          this.net?.send({ t: "cmd", c: "start" });
          break;
        case "next":
          this.net?.send({ t: "cmd", c: "next" });
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
        case "laps-":
        case "laps+":
          if (this.lobby) this.net?.send({ t: "cmd", c: "laps", v: this.lobby.laps + (a.dataset.a === "laps+" ? 1 : -1) });
          break;
        case "track-":
        case "track+":
          if (this.lobby) {
            const n = this.lobby.tracks.length;
            this.net?.send({ t: "cmd", c: "track", v: (this.lobby.track + (a.dataset.a === "track+" ? 1 : -1) + n) % n });
          }
          break;
        case "speed-":
        case "speed+":
          if (this.lobby) {
            const n = this.lobby.speeds.length;
            this.net?.send({ t: "cmd", c: "speed", v: Math.max(0, Math.min(n - 1, this.lobby.speed + (a.dataset.a === "speed+" ? 1 : -1))) });
          }
          break;
        case "bots-":
        case "bots+":
          if (this.lobby) this.net?.send({ t: "cmd", c: "bots", v: Math.min(this.lobby.maxBots, this.lobby.bots + (a.dataset.a === "bots+" ? 1 : -1)) });
          break;
      }
    };
    app.onchange = (e) => {
      const t = e.target as HTMLInputElement;
      const key = t.dataset.set as "autoGas" | "vibrate" | undefined;
      if (key) {
        this.settings[key] = t.checked;
        save("tk_pad", this.settings);
      }
    };
    app.oninput = (e) => {
      const t = e.target as HTMLInputElement;
      if (t.classList.contains("name-in")) {
        this.name = t.value.slice(0, 14);
        save("tk_name", this.name);
        clearTimeout(this.nameTimer);
        this.nameTimer = window.setTimeout(() => this.net?.send({ t: "me", name: this.name }), 400);
      }
      if (t.classList.contains("code-in")) t.value = normalizeCode(t.value);
    };
    app.onkeydown = (e) => {
      if ((e.target as HTMLElement).classList.contains("code-in") && e.key === "Enter") (app.querySelector("[data-a=join]") as HTMLElement)?.click();
    };
  }

  private goFullscreen() {
    if (isIOS || document.fullscreenElement) return;
    const el = document.documentElement;
    void el
      .requestFullscreen?.({ navigationUI: "hide" })
      .then(() => (screen.orientation as unknown as { lock?: (o: string) => Promise<void> }).lock?.("landscape"))
      .catch(() => {});
  }

  private async keepAwake() {
    try {
      if ("wakeLock" in navigator && !this.wake && document.visibilityState === "visible") {
        this.wake = await navigator.wakeLock.request("screen");
        this.wake.addEventListener("release", () => (this.wake = null));
      }
    } catch {
      /* nepovoleno */
    }
  }
}

function wheelSvg() {
  return `<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" stroke-width="9"/>
    <circle cx="50" cy="50" r="9" fill="currentColor"/><path d="M50 50 L12 44 M50 50 L88 44 M50 50 L50 92" stroke="currentColor" stroke-width="9" stroke-linecap="round"/>
    <rect x="46" y="4" width="8" height="12" rx="3" fill="#ff4d6d"/></svg>`;
}

new Pad();
