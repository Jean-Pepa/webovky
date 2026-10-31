// Obrazovka na PC: spojuje síť (telefony), lobby, závod, kamery, HUD a zvuk.
import "@fontsource/lilita-one/latin-400.css";
import "@fontsource/lilita-one/latin-ext-400.css";
import "@fontsource/baloo-2/latin-500.css";
import "@fontsource/baloo-2/latin-ext-500.css";
import "@fontsource/baloo-2/latin-700.css";
import "@fontsource/baloo-2/latin-ext-700.css";
import "@fontsource/baloo-2/latin-800.css";
import "@fontsource/baloo-2/latin-ext-800.css";
import "../styles/game.css";
import * as THREE from "three";
import type { DataConnection } from "peerjs";
import { CHARACTERS, type CharacterDef } from "../shared/characters";
import { ITEMS } from "../shared/items";
import { img } from "../shared/assets";
import { peerParam } from "../shared/net";
import {
  CUP_POINTS,
  MAX_RACERS,
  PROTOCOL_VERSION,
  SPEED_CLASSES,
  type CupInfo,
  type HostMsg,
  type HudState,
  type Mode,
  type PadMsg,
  type Phase,
  type ResultRow,
} from "../shared/protocol";
import { TRACKS } from "./tracks";
import { THEMES } from "./themes";
import { Track } from "./track";
import { View } from "./view";
import { Effects, Snow } from "./effects";
import { loadModels } from "./models";
import { Race, type Entry, type RaceListener } from "./race";
import { Hud } from "./hud";
import { Lobby, Results } from "./screens";
import { Music, Sound, type EngineVoice } from "./audio";
import { NetHost } from "./net-host";
import { Session, cleanName, type Player } from "./session";
import { Keyboard } from "./input";
import { MAX_SPEED, type Kart } from "./kart";
import { clamp, formatTime } from "./util";

const params = new URLSearchParams(location.search);
const TIME_SCALE = clamp(Number(params.get("speed")) || 1, 0.1, 10);
const AUTOPILOT = params.has("autopilot");

function store<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v === null ? fallback : (JSON.parse(v) as T);
  } catch {
    return fallback;
  }
}
function save(key: string, v: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(v));
  } catch {
    /* soukromé okno apod. */
  }
}

interface Cup {
  tracks: number[];
  round: number;
  points: Map<string, number>;
  info: Map<string, { name: string; char: number; human: boolean; slot: number }>;
  bots: CharacterDef[];
}

class Game {
  private view = new View(document.getElementById("scene") as HTMLCanvasElement);
  private sound = new Sound();
  private music = new Music(this.sound);
  private fx = new Effects();
  private hud = new Hud(document.getElementById("hud")!);
  private ui = document.getElementById("ui")!;
  private lobby: Lobby;
  private results: Results;
  private net: NetHost;
  private session = new Session();
  private kb = new Keyboard();
  private trackIdx = 0;
  private track!: Track;
  private laps = clamp(store("tk_laps", 3), 1, 5);
  private bots = clamp(store("tk_bots", 5), 0, 7);
  private mode: Mode = store<Mode>("tk_mode", "race") === "cup" ? "cup" : "race";
  private speed = clamp(store("tk_speed", 1), 0, SPEED_CLASSES.length - 1);
  private cup: Cup | null = null;
  private lastCup: CupInfo | null = null;
  phase: Phase = "lobby";
  race: Race | null = null;
  private demo: Race | null = null;
  private humans: Kart[] = [];
  private engines = new Map<number, EngineVoice>();
  private lastResults: ResultRow[] = [];
  private lastRecord: string | null = null;
  private last = performance.now();
  private tick = 0;
  private kbSteer = new Map<number, number>();
  private onlineKey = "";
  /** sloty, za které má řídit počítač i s připojeným ovladačem (ladění, test) */
  private forced = new Set<number>();
  private paused = false;
  private pauseEl!: HTMLElement;
  /** zpětná zrcátka (hlavní vypínač na PC) */
  private mirrors = store("tk_mirrors", true);
  private mirrorFlags: boolean[] = [];
  private snow: Snow | null = null;

  constructor() {
    this.lobby = new Lobby(this.ui, {
      start: () => this.start(),
      laps: (d) => this.setLaps(this.laps + d),
      bots: (d) => this.setBots(this.bots + d),
      track: (d) => this.setTrack(this.trackIdx + d),
      mode: () => this.setMode(this.mode === "cup" ? "race" : "cup"),
      speed: (d) => this.setSpeed(this.speed + d),
      addKeyboard: () => this.addKeyboard(),
      removePlayer: (s) => this.removePlayer(s),
      toggleSound: () => this.toggleSound(),
      fullscreen: () => void document.documentElement.requestFullscreen?.().catch(() => {}),
      mirrors: () => this.toggleMirrors(),
    });
    this.results = new Results(this.ui, () => this.next());
    this.pauseEl = document.createElement("div");
    this.pauseEl.className = "pause hidden";
    this.pauseEl.innerHTML = `<div class="ps-card"><h2>Pauza</h2>
      <button data-a="resume">▶ Pokračovat</button><button data-a="restart">↻ Začít znovu</button><button data-a="quit">⏏ Zpět do lobby</button>
      <p><kbd>Esc</kbd> pokračovat · <kbd>R</kbd> znovu · <kbd>Q</kbd> do lobby</p></div>`;
    this.pauseEl.addEventListener("click", (e) => {
      const a = (e.target as HTMLElement).closest("[data-a]") as HTMLElement | null;
      if (a?.dataset.a === "resume") this.setPaused(false);
      else if (a?.dataset.a === "restart") this.restartRace();
      else if (a?.dataset.a === "quit") this.toLobby();
    });
    this.ui.append(this.pauseEl);
    this.net = new NetHost({
      status: (k, d) => this.netStatus(k, d),
      room: (code) => this.lobby.setRoom(code, this.padUrl(code), this.shortUrl()),
      message: (c, m) => this.onMessage(c, m),
      closed: (c) => this.onClosed(c),
    });
    this.sound.setMuted(store("tk_muted", false));
    this.view.scene.add(this.fx.group);
    this.loadTrack(0);
    this.kb.onKey = (code, e) => this.onKey(code, e);
    const unlock = () => {
      const was = this.sound.ready;
      this.sound.unlock();
      if (!was && this.phase === "lobby") setTimeout(() => this.renderLobby(), 100);
    };
    addEventListener("pointerdown", unlock);
    addEventListener("keydown", unlock);
    this.renderLobby();
    this.lanCheck();
    // 3D modely od Codexe (pokud jsou): po načtení se lobby scéna postaví znovu
    void loadModels().then((ok) => {
      if (ok && this.phase === "lobby") this.startDemo();
    });
    this.net.start();
    this.debugHooks();
    requestAnimationFrame((t) => this.frame(t));
  }

  // ------------------------------------------------------------------ trať

  private loadTrack(i: number) {
    if (this.track) this.view.scene.remove(this.track.group);
    this.trackIdx = i;
    const def = TRACKS[i];
    this.track = new Track(def, THEMES[def.theme]);
    this.view.scene.add(this.track.group);
    this.view.setTrack(this.track);
    this.hud.setTrack(this.track);
    if (this.snow) this.view.scene.remove(this.snow.points);
    this.snow = this.track.theme.snow ? new Snow() : null;
    if (this.snow) this.view.scene.add(this.snow.points);
    this.trackAssets();
    this.startDemo();
  }

  /** Obrázky od Codexe (plachty, brána, obloha), pokud už existují. */
  private trackAssets() {
    const loader = new THREE.TextureLoader();
    const load = (url: string) =>
      new Promise<THREE.Texture>((res, rej) =>
        loader.load(
          url,
          (t) => {
            t.colorSpace = THREE.SRGBColorSpace;
            t.anisotropy = 8;
            res(t);
          },
          undefined,
          rej,
        ),
      );
    const banners = [1, 2, 3, 4].map((i) => img(`banners/${i}`)).filter((u): u is string => !!u);
    if (banners.length) void Promise.all(banners.map(load)).then((ts) => this.track.setBannerTextures(ts)).catch(() => {});
    const sb = img("start-banner");
    if (sb) void load(sb).then((t) => this.track.setStartBanner(t)).catch(() => {});
    const theme = this.track.theme.id;
    const sky = img(`sky-${theme}`) ?? (theme === "meadow" ? img("sky") : null);
    if (sky) void load(sky).then((t) => this.track.setSkyPanorama(t)).catch(() => {});
  }

  private startDemo() {
    this.demo?.dispose();
    const bots = [...CHARACTERS].sort(() => Math.random() - 0.5).slice(0, 6);
    this.demo = new Race(this.track, this.fx, [], bots, 99, {}, { attract: true });
    this.view.scene.add(this.demo.group);
  }

  // ------------------------------------------------------------------ lobby

  private maxBots() {
    return Math.max(0, MAX_RACERS - this.session.players.length);
  }

  private setLaps(n: number) {
    this.laps = clamp(Math.round(n), 1, 5);
    save("tk_laps", this.laps);
    this.renderLobby();
    this.broadcastLobby();
  }

  private setBots(n: number) {
    this.bots = clamp(Math.round(n), 0, 7);
    save("tk_bots", this.bots);
    this.renderLobby();
    this.broadcastLobby();
  }

  private setMode(m: Mode) {
    this.mode = m === "cup" ? "cup" : "race";
    save("tk_mode", this.mode);
    this.renderLobby();
    this.broadcastLobby();
  }

  private setSpeed(n: number) {
    this.speed = clamp(Math.round(n), 0, SPEED_CLASSES.length - 1);
    save("tk_speed", this.speed);
    this.renderLobby();
    this.broadcastLobby();
  }

  private setTrack(i: number) {
    const n = TRACKS.length;
    const idx = ((Math.round(i) % n) + n) % n;
    if (idx !== this.trackIdx) this.loadTrack(idx);
    this.renderLobby();
    this.broadcastLobby();
  }

  private renderLobby() {
    const def = TRACKS[this.trackIdx];
    this.lobby.render({
      players: this.session.lobbyPlayers(),
      trackName: def.name,
      trackDesc: def.desc,
      trackId: def.id,
      laps: this.laps,
      bots: Math.min(this.bots, this.maxBots()),
      maxBots: this.maxBots(),
      canStart: this.session.players.length > 0,
      muted: this.sound.muted,
      soundReady: this.sound.ready,
      mode: this.mode,
      speed: this.speed,
      speedName: SPEED_CLASSES[this.speed].name,
      trackCount: TRACKS.length,
      mirrors: this.mirrors,
    });
  }

  private lobbyMsg(p: Player): HostMsg {
    return {
      t: "lobby",
      players: this.session.lobbyPlayers(),
      you: p.slot,
      host: p.slot === this.session.hostSlot(),
      track: this.trackIdx,
      tracks: TRACKS.map((t) => t.name),
      laps: this.laps,
      bots: Math.min(this.bots, this.maxBots()),
      maxBots: this.maxBots(),
      racing: this.phase === "countdown" || this.phase === "race",
      mode: this.mode,
      speed: this.speed,
      speeds: SPEED_CLASSES.map((c) => c.name),
      cupRound: this.cup ? this.cup.round + 1 : 0,
    };
  }

  private broadcastLobby() {
    for (const p of this.session.players) if (p.kind === "pad") this.net.send(p.conn, this.lobbyMsg(p));
  }

  private addKeyboard() {
    if (this.phase !== "lobby" || this.session.full) return;
    const kbs = this.session.players.filter((p) => p.kind === "kb").length;
    if (kbs >= 2) return;
    this.session.add("kb", "kb-" + Math.random().toString(36).slice(2), `Klávesnice ${kbs + 1}`, -1, null);
    this.sound.play("join");
    this.renderLobby();
    this.broadcastLobby();
  }

  private removePlayer(slot: number) {
    if (this.phase !== "lobby") return;
    const p = this.session.bySlot(slot);
    if (!p) return;
    if (p.conn) {
      this.net.send(p.conn, { t: "full" });
      setTimeout(() => p.conn?.close(), 300);
    }
    this.session.remove(slot);
    this.renderLobby();
    this.broadcastLobby();
  }

  private toggleMirrors() {
    this.mirrors = !this.mirrors;
    save("tk_mirrors", this.mirrors);
    this.renderLobby();
  }

  private toggleSound() {
    this.sound.unlock();
    this.sound.setMuted(!this.sound.muted);
    save("tk_muted", this.sound.muted);
    this.renderLobby();
  }

  private netStatus(kind: "connecting" | "ready" | "error", detail?: string) {
    const text =
      kind === "ready"
        ? "Připraveno — čekám na telefony"
        : kind === "connecting"
          ? "Připojuji se k serveru…"
          : detail ?? "Chyba spojení";
    this.lobby.setStatus(kind, text);
  }

  private padUrl(code: string) {
    const u = new URL(import.meta.env.DEV ? "pad.html" : "pad", location.href);
    u.search = "";
    u.hash = "";
    u.searchParams.set("r", code);
    const peer = peerParam();
    if (peer) u.searchParams.set("peer", peer);
    return u.toString();
  }

  private shortUrl() {
    return `${location.host}/${import.meta.env.DEV ? "pad.html" : "pad"}`;
  }

  private lanCheck() {
    const h = location.hostname;
    if (h === "localhost" || h === "127.0.0.1" || h === "[::1]")
      this.lobby.setLanWarning(
        "Hra běží jako „localhost“ — telefon se k ní nedostane. Otevři ji na PC přes síťovou adresu (např. http://192.168.…:5173), kterou vypíše npm run dev.",
      );
  }

  // ------------------------------------------------------------------ síť

  private onMessage(conn: DataConnection, msg: PadMsg) {
    if (msg.t === "hello") return this.onHello(conn, msg);
    const p = this.session.byConn(conn);
    if (!p) return;
    p.lastSeen = performance.now();
    switch (msg.t) {
      case "in":
        p.input.s = clamp(Number(msg.s) || 0, -1, 1);
        p.input.g = clamp(Number(msg.g) || 0, 0, 1);
        p.input.b = msg.b ? 1 : 0;
        p.input.d = msg.d ? 1 : 0;
        break;
      case "item":
        this.useItem(p.slot, msg.dir === 1 || msg.dir === -1 ? msg.dir : 0);
        break;
      case "me":
        if (typeof msg.name === "string") p.name = cleanName(msg.name) || p.name;
        if (typeof msg.mirror === "boolean") p.mirror = msg.mirror;
        if (typeof msg.char === "number" && this.phase !== "countdown" && this.phase !== "race")
          p.char = this.session.freeChar(msg.char, p.slot) === msg.char ? msg.char : p.char;
        this.renderLobby();
        this.broadcastLobby();
        break;
      case "cmd":
        this.onCmd(p, msg);
        break;
      case "ping":
        this.net.send(conn, { t: "pong", ts: msg.ts });
        break;
    }
  }

  private onHello(conn: DataConnection, msg: Extract<PadMsg, { t: "hello" }>) {
    const cid = String(msg.cid || "").slice(0, 64) || Math.random().toString(36).slice(2);
    let p = this.session.byCid(cid);
    if (p) {
      if (p.conn && p.conn !== conn) {
        const old = p.conn;
        setTimeout(() => old.close(), 100);
      }
      p.conn = conn;
      p.lastSeen = performance.now();
    } else {
      if (this.session.full) {
        this.net.send(conn, { t: "full" });
        setTimeout(() => conn.close(), 600);
        return;
      }
      p = this.session.add("pad", cid, cleanName(msg.name), Number(msg.char), conn)!;
      this.sound.play("join");
    }
    this.net.send(conn, { t: "welcome", slot: p.slot, v: PROTOCOL_VERSION });
    this.net.send(conn, this.lobbyMsg(p));
    this.net.send(conn, { t: "phase", p: this.race && this.race.kartOf(p.slot) ? this.phase : "lobby" });
    if (this.phase === "results" && this.race?.kartOf(p.slot)) this.sendResults(p);
    p.hudKey = "";
    this.renderLobby();
    this.broadcastLobby();
  }

  private onClosed(conn: DataConnection) {
    const p = this.session.byConn(conn);
    if (!p) return;
    p.conn = null;
    this.renderLobby();
    this.broadcastLobby();
  }

  private onCmd(p: Player, msg: Extract<PadMsg, { t: "cmd" }>) {
    const host = this.session.hostSlot();
    if (host >= 0 && host !== p.slot) return;
    switch (msg.c) {
      case "start":
        this.start();
        break;
      case "lobby":
      case "next":
        if (this.phase === "results") this.next();
        break;
      case "mode":
        if (this.phase === "lobby") this.setMode(msg.v === 1 ? "cup" : "race");
        break;
      case "pause":
        if (this.phase === "countdown" || this.phase === "race") this.setPaused(!this.paused);
        break;
      case "restart":
        if (this.paused) this.restartRace();
        break;
      case "quit":
        if (this.paused || this.phase === "results") this.toLobby();
        break;
      case "speed":
        if (this.phase === "lobby") this.setSpeed(Number(msg.v));
        break;
      case "laps":
        if (this.phase === "lobby") this.setLaps(Number(msg.v));
        break;
      case "bots":
        if (this.phase === "lobby") this.setBots(Number(msg.v));
        break;
      case "track":
        if (this.phase === "lobby" && TRACKS[Number(msg.v)]) this.setTrack(Number(msg.v));
        break;
    }
  }

  private setPhase(ph: Phase) {
    this.phase = ph;
    for (const p of this.session.players) {
      if (p.kind !== "pad") continue;
      const inRace = !!this.race?.kartOf(p.slot);
      this.net.send(p.conn, { t: "phase", p: inRace || ph === "lobby" ? ph : "lobby" });
      if (!inRace) this.net.send(p.conn, this.lobbyMsg(p));
    }
  }

  private buzz(k: Kart, ms: number | number[]) {
    const p = this.session.bySlot(k.slot);
    if (p?.kind === "pad") this.net.send(p.conn, { t: "buzz", ms });
  }

  private hudState(k: Kart): HudState {
    const r = this.race!;
    return {
      pos: k.place,
      of: r.karts.length,
      lap: clamp(k.lap, 1, r.laps),
      laps: r.laps,
      item: k.rollT > 0 ? null : k.item,
      n: k.itemN,
      roll: k.rollT > 0,
      fin: k.finished,
      drift: k.drifting ? k.driftLevel : -1,
      boost: k.boostT > 0,
      shield: k.shieldT > 0 || k.ramT > 0,
      pause: this.paused,
      host: k.slot === this.session.hostSlot(),
    };
  }

  private pushHuds() {
    if (!this.race) return;
    const now = performance.now();
    for (const p of this.session.players) {
      if (p.kind !== "pad" || !p.conn) continue;
      const k = this.race.kartOf(p.slot);
      if (!k) continue;
      const st = this.hudState(k);
      const key = JSON.stringify(st);
      if ((key !== p.hudKey && now - p.hudAt > 100) || now - p.hudAt > 1000) {
        p.hudKey = key;
        p.hudAt = now;
        this.net.send(p.conn, { t: "hud", ...st });
      }
    }
  }

  private sendResults(p: Player) {
    if (!this.race) return;
    const k = this.race.kartOf(p.slot);
    this.net.send(p.conn, {
      t: "results",
      rows: this.lastResults,
      you: k ? k.place : 0,
      record: this.lastRecord ?? undefined,
      cup: this.lastCup ?? undefined,
    });
  }

  // ------------------------------------------------------------------ závod

  private start() {
    if (this.phase !== "lobby" || this.session.players.length === 0) return;
    if (this.mode === "cup") {
      const order = TRACKS.map((_, i) => (this.trackIdx + i) % TRACKS.length);
      this.cup = { tracks: order, round: 0, points: new Map(), info: new Map(), bots: this.pickBots() };
      this.startRace(order[0]);
    } else {
      this.cup = null;
      this.startRace(this.trackIdx);
    }
  }

  /** Soupeři: postavy, které si nevybrali hráči (v poháru stejní po celou dobu). */
  private pickBots(): CharacterDef[] {
    const used = new Set(this.session.players.map((p) => p.char));
    const free = CHARACTERS.filter((c) => !used.has(c.id)).sort(() => Math.random() - 0.5);
    return free.slice(0, Math.min(this.bots, MAX_RACERS - this.session.players.length));
  }

  private startRace(trackIdx: number) {
    this.paused = false;
    this.pauseEl.classList.add("hidden");
    this.results.hide();
    this.race?.dispose();
    this.race = null;
    if (trackIdx !== this.trackIdx || !this.track) this.loadTrack(trackIdx);
    const entries: Entry[] = this.session.players.map((p) => ({ char: CHARACTERS[p.char], slot: p.slot, name: p.name }));
    let bots = this.cup ? this.cup.bots : this.pickBots();
    const used = new Set(entries.map((e) => e.char.id));
    bots = bots.filter((b) => !used.has(b.id)).slice(0, MAX_RACERS - entries.length);
    this.demo?.dispose();
    this.demo = null;
    this.fx.update(10);
    const race = new Race(this.track, this.fx, entries, bots, this.laps, this.listener(), {
      speedMul: SPEED_CLASSES[this.speed].mul,
      intro: 3,
    });
    this.race = race;
    this.view.scene.add(race.group);
    if (AUTOPILOT) for (const p of this.session.players) race.autopilot.add(p.slot);
    for (const s of this.forced) race.autopilot.add(s);
    this.humans = this.session.players.map((p) => race.kartOf(p.slot)!);
    this.view.snapCams(this.humans);
    this.mirrorFlags = this.session.players.map((p) => this.mirrors && p.mirror);
    this.hud.layout(
      this.view.layout(this.humans.length),
      this.humans,
      this.session.players.map((p) => (p.kind === "kb" ? "⌨️" : "📱")),
      this.mirrorFlags,
    );
    this.hud.show(false);
    this.lobby.show(false);
    this.kb.blockGameKeys = true;
    this.lastCup = null;
    for (const p of this.session.players) p.input = { s: 0, g: 0, b: 0, d: 0 };
    this.setPhase("countdown");
    this.startEngines();
    this.music.play(this.track.theme.id);
  }

  /** Tlačítko „Další závod“: v poháru další trať, jinak zpět do lobby. */
  private next() {
    if (this.phase !== "results") return;
    if (this.cup && this.cup.round < this.cup.tracks.length - 1) {
      this.cup.round++;
      this.startRace(this.cup.tracks[this.cup.round]);
    } else this.toLobby();
  }

  private idx(k: Kart) {
    return this.humans.indexOf(k);
  }

  private listener(): RaceListener {
    return {
      countdown: (n) => {
        if (n === 3) this.hud.show(true);
        this.hud.count(String(n));
        this.sound.play("count");
      },
      startBoost: (k, good) => {
        if (!k.human) return;
        this.hud.message(this.idx(k), good ? "TURBO START!" : "Přetočený motor!", good ? "good" : "hit");
        if (good) this.sound.play("boost");
      },
      trick: (k) => {
        if (!k.human) return;
        this.sound.play("trick");
        this.hud.message(this.idx(k), "TRIK!", "good", 900);
        this.buzz(k, 20);
      },
      launch: (k) => {
        if (k.human) this.sound.play("jump");
      },
      land: (k) => {
        if (k.human) this.sound.play("land", 0.6);
      },
      bees: (t) => {
        this.sound.play("bees");
        if (t.human) {
          this.hud.message(this.idx(t), "🐝 Letí na tebe včely!", "hit", 2200);
          this.buzz(t, [60, 40, 60, 40, 60]);
        }
      },
      bounce: () => this.sound.play("bonk", 0.5),
      golden: (k, item) => {
        if (!k.human) return;
        this.sound.play("fanfare", 0.6);
        this.hud.message(this.idx(k), item === "wings" ? "🦅 ZLATÁ BEDNA: KŘÍDLA!" : "ZLATÁ BEDNA!", "good", 1800);
        this.buzz(k, [40, 30, 40]);
      },
      planeWarn: (x, _y, z, inS) => {
        this.sound.play("warn");
        this.humans.forEach((k, i) => {
          if ((k.x - x) ** 2 + (k.z - z) ** 2 < 380 ** 2) {
            this.hud.message(i, "✈️ Pozor! Padá letadlo!", "hit", Math.round(inS * 1000));
            this.buzz(k, [80, 60, 80]);
          }
        });
      },
      planeCrash: (x, _y, z) => {
        this.sound.play("boom", 1);
        this.sound.play("hit", 0.8);
        this.humans.forEach((k, i) => {
          const d = Math.hypot(k.x - x, k.z - z);
          if (d < 160) this.view.shake(i, Math.max(0.3, 1.4 - d / 120));
          if (d < 60) this.buzz(k, 250);
        });
      },
      go: () => {
        this.hud.count("JEĎ!");
        this.sound.play("go");
        this.setPhase("race");
      },
      lap: (k, lap, final) => {
        if (!k.human) return;
        this.hud.message(this.idx(k), final ? "POSLEDNÍ KOLO!" : `KOLO ${lap}`, final ? "final" : "");
        this.sound.play(final ? "final" : "lap");
        if (final) this.music.setFast(true);
        this.buzz(k, 60);
      },
      finish: (k, place) => {
        if (!k.human) return;
        this.hud.message(this.idx(k), `CÍL! ${place}. místo`, "finish", 5000);
        this.sound.play("finish");
        this.fx.confetti(k.x, k.z, k.gy);
        this.buzz(k, [90, 60, 90, 60, 220]);
      },
      over: () => this.showResults(),
      wall: (k, s) => {
        if (!k.human) return;
        this.sound.play("wall", Math.min(1, s / 12));
        this.view.shake(this.idx(k), Math.min(1, s / 14));
        this.buzz(k, s > 9 ? 70 : 35);
      },
      bump: (a, b) => {
        for (const k of [a, b])
          if (k.human) {
            this.sound.play("bump");
            this.buzz(k, 30);
          }
      },
      hit: (k, by, kind) => {
        this.sound.play(kind === "oil" ? "oil" : "hit", k.human ? 1 : 0.5);
        if (k.human) {
          const msg = { rocket: "Zásah raketou!", oil: "Uklouznutí na oleji!", coconut: "Bum! Kokos!", bees: "Au, včely!", ram: "Trkl tě beran!", plane: "Trosky letadla!" }[kind];
          this.hud.message(this.idx(k), msg, "hit");
          this.buzz(k, [220, 80, 220]);
          this.view.shake(this.idx(k), 1);
        }
        if (by && by.human && by !== k) this.hud.message(this.idx(by), `Trefa! ${k.name}`, "good");
      },
      blocked: (k) => {
        this.sound.play("shield");
        if (k.human) this.hud.message(this.idx(k), "Štít tě ochránil!", "good");
      },
      boost: (k, kind) => {
        if (!k.human) return;
        this.sound.play("boost", kind === "pad" ? 0.7 : 1);
        if (kind === "draft") this.hud.message(this.idx(k), "ZÁVĚTŘÍ!", "good", 900);
      },
      pickup: (k) => {
        if (!k.human) return;
        this.sound.play("pickup");
        this.buzz(k, 25);
      },
      gotItem: (k) => {
        if (k.human) this.sound.play("item");
      },
      used: (k, item, dir) => {
        if (!k.human && item !== "rocket" && item !== "bees") return;
        const v = k.human ? 1 : 0.5;
        if (item === "rocket") this.sound.play("rocket", v);
        else if (item === "turbo" || item === "turbo3") this.sound.play("boost");
        else if (item === "shield") this.sound.play("shield");
        else if (item === "ram") {
          this.sound.play("ram");
          this.hud.message(this.idx(k), "BERANIDLO!", "good", 1200);
        } else if (item === "wings") {
          this.sound.play("jump");
          this.hud.message(this.idx(k), "🦅 LETÍŠ!", "good", 1200);
        } else if (item === "coconut" || (item === "oil" && dir > 0)) this.sound.play("throw", v);
        else if (item !== "bees") this.sound.play("oil", 0.6);
      },
      driftLevel: (k, l) => {
        if (!k.human || l <= 0) return;
        this.sound.play(l === 2 ? "drift2" : "drift1");
        this.buzz(k, 20);
      },
      hop: (k) => {
        if (k.human) this.sound.play("hop", 0.6);
      },
      explosion: () => this.sound.play("boom", 0.7),
    };
  }

  private useItem(slot: number, dir = 0) {
    const k = this.race?.kartOf(slot);
    if (k && !k.finished && this.phase === "race") this.race!.useItem(k, dir);
  }

  private showResults() {
    if (!this.race || this.phase === "results") return;
    this.lastResults = this.race.results();
    this.lastRecord = this.checkRecords(this.race);
    this.lastCup = this.cup ? this.cupScore(this.cup, this.lastResults) : null;
    this.results.show(this.lastResults, this.track.def.name, this.lastRecord, this.lastCup);
    this.hud.show(false);
    this.setPhase("results");
    for (const p of this.session.players) if (p.kind === "pad") this.sendResults(p);
    this.stopEngines();
    this.music.stop();
    this.sound.play(this.lastCup?.final ? "fanfare" : "finish");
  }

  private cupScore(cup: Cup, rows: ResultRow[]): CupInfo {
    const key = (r: ResultRow) => (r.human ? `p${r.slot}` : `b${r.char}`);
    const add = new Map<string, number>();
    for (const r of rows) {
      const k = key(r);
      const pts = CUP_POINTS[r.place - 1] ?? 0;
      add.set(k, pts);
      cup.points.set(k, (cup.points.get(k) ?? 0) + pts);
      cup.info.set(k, { name: r.name, char: r.char, human: r.human, slot: r.slot });
    }
    const table = [...cup.points.entries()]
      .map(([k, pts]) => ({ ...cup.info.get(k)!, pts, add: add.get(k) ?? 0 }))
      .sort((a, b) => b.pts - a.pts || b.add - a.add)
      .map((r, i) => ({ place: i + 1, ...r }));
    const final = cup.round >= cup.tracks.length - 1;
    return {
      round: cup.round + 1,
      of: cup.tracks.length,
      rows: table,
      final,
      next: final ? null : TRACKS[cup.tracks[cup.round + 1]].name,
    };
  }

  private checkRecords(race: Race): string | null {
    const key = `tk_rec_${this.track.def.id}_${race.laps}`;
    const rec = store<{ race?: number; raceBy?: string; lap?: number; lapBy?: string }>(key, {});
    let msg: string | null = null;
    for (const k of race.humans) {
      if (k.finished && (!rec.race || k.finishTime * 1000 < rec.race)) {
        rec.race = k.finishTime * 1000;
        rec.raceBy = k.name;
        msg = `Nový rekord trati: ${k.name} ${formatTime(rec.race)}`;
      }
      if (isFinite(k.bestLap) && (!rec.lap || k.bestLap * 1000 < rec.lap)) {
        rec.lap = k.bestLap * 1000;
        rec.lapBy = k.name;
        msg ??= `Nejrychlejší kolo všech dob: ${k.name} ${formatTime(rec.lap)}`;
      }
    }
    save(key, rec);
    return msg;
  }

  private toLobby() {
    if (this.phase === "lobby") return;
    this.setPaused(false);
    this.cup = null;
    this.lastCup = null;
    this.music.stop();
    this.results.hide();
    this.race?.dispose();
    this.race = null;
    this.humans = [];
    this.hud.clear();
    this.hud.show(false);
    this.stopEngines();
    this.kb.blockGameKeys = false;
    this.startDemo();
    this.lobby.show(true);
    this.setPhase("lobby");
    this.renderLobby();
    this.broadcastLobby();
  }

  private setPaused(on: boolean) {
    if (!this.race) on = false;
    this.paused = on;
    this.pauseEl.classList.toggle("hidden", !on);
    if (on) this.music.stop();
    else if (this.race && this.phase !== "results") this.music.play(this.track.theme.id);
    for (const p of this.session.players) p.hudKey = "";
  }

  private restartRace() {
    this.setPaused(false);
    if (this.race) this.startRace(this.trackIdx);
  }

  private startEngines() {
    this.stopEngines();
    if (!this.sound.ready) return;
    this.humans.forEach((k, i) => {
      const e = this.sound.engine(i);
      if (e) this.engines.set(k.slot, e);
    });
  }

  private stopEngines() {
    for (const e of this.engines.values()) e.stop();
    this.engines.clear();
  }

  private updateEngines() {
    if (!this.engines.size && this.sound.ready && this.humans.length && this.phase !== "results") this.startEngines();
    const vol = 1 / Math.sqrt(Math.max(1, this.humans.length));
    for (const k of this.humans) {
      this.engines.get(k.slot)?.set(clamp(Math.abs(k.vF) / MAX_SPEED, 0, 1.4), k.boostT > 0, k.offroad, vol);
    }
  }

  private isOffline = (k: Kart) => {
    const p = this.session.bySlot(k.slot);
    return !!p && !this.session.online(p);
  };

  private applyInputs(dt: number) {
    const race = this.race!;
    const now = performance.now();
    for (const p of this.session.players) {
      const k = race.kartOf(p.slot);
      if (!k) continue;
      if (p.kind === "kb") {
        const c = this.kb.controls(p.scheme);
        const prev = this.kbSteer.get(p.slot) ?? 0;
        const rate = c.s === 0 ? 9 : 5;
        const s = prev + clamp(c.s - prev, -rate * dt, rate * dt);
        this.kbSteer.set(p.slot, s);
        if (!AUTOPILOT && !this.forced.has(p.slot)) k.input = { steer: s, gas: c.g, brake: c.b, drift: !!c.d };
      } else if (this.session.online(p, now)) {
        if (!AUTOPILOT && !this.forced.has(p.slot)) race.autopilot.delete(p.slot);
        if (!race.autopilot.has(p.slot)) k.input = { steer: p.input.s, gas: p.input.g, brake: p.input.b, drift: !!p.input.d };
      } else race.autopilot.add(p.slot);
    }
  }

  // ------------------------------------------------------------------ klávesy

  private onKey(code: string, e: KeyboardEvent) {
    if (code === "KeyM" && this.phase === "lobby") return this.toggleSound();
    if (this.phase === "lobby") {
      if (code === "KeyK") this.addKeyboard();
      else if (code === "Enter" || code === "NumpadEnter") this.start();
      else if (code === "ArrowUp") this.setLaps(this.laps + 1);
      else if (code === "ArrowDown") this.setLaps(this.laps - 1);
      else if (code === "ArrowRight") this.setBots(this.bots + 1);
      else if (code === "ArrowLeft") this.setBots(this.bots - 1);
      else if (code === "KeyT") this.setTrack(this.trackIdx + 1);
      else if (code === "KeyP") this.setMode(this.mode === "cup" ? "race" : "cup");
      else if (code === "KeyR") this.setSpeed((this.speed + 1) % SPEED_CLASSES.length);
      else if (code === "KeyZ") this.toggleMirrors();
      else if (code === "Backspace" || code === "Delete") {
        const kb = this.session.players.filter((p) => p.kind === "kb").pop();
        if (kb) this.removePlayer(kb.slot);
      } else if (code === "KeyF") void document.documentElement.requestFullscreen?.().catch(() => {});
      return;
    }
    if (this.phase === "results") {
      if (code === "Enter" || code === "NumpadEnter" || code === "Space") this.next();
      return;
    }
    if (this.race?.phase === "intro" && (code === "Enter" || code === "Space" || code === "NumpadEnter")) {
      this.race.skipIntro();
      return;
    }
    if (this.paused) {
      if (code === "Escape" || code === "Enter" || code === "NumpadEnter") this.setPaused(false);
      else if (code === "KeyR") this.restartRace();
      else if (code === "KeyQ") this.toLobby();
      return;
    }
    if (code === "Escape") {
      e.preventDefault();
      this.setPaused(true);
      return;
    }
    for (const p of this.session.players) {
      if (p.kind !== "kb") continue;
      const k = this.race?.kartOf(p.slot);
      if (Keyboard.isItemKey(code, p.scheme)) this.useItem(p.slot);
      else if (k?.item && Keyboard.isBackKey(code, p.scheme)) this.useItem(p.slot, -(ITEMS[k.item].dir || 1));
    }
  }

  // ------------------------------------------------------------------ smyčka

  private frame(t: number) {
    requestAnimationFrame((tt) => this.frame(tt));
    const real = Math.min(0.05, Math.max(0, (t - this.last) / 1000));
    this.last = t;
    const dt = real * TIME_SCALE;
    const sub = Math.max(1, Math.ceil(dt / (1 / 120)));
    const h = dt / sub;
    if (this.race) {
      this.applyInputs(real);
      if (!this.paused) for (let i = 0; i < sub; i++) this.race.step(h);
      this.race.updateVisuals(dt);
      if (this.race.phase === "intro") {
        this.view.renderIntro(this.track, this.fx, 1 - this.race.introT / this.race.introLen);
      } else if (this.phase === "results") {
        this.view.renderPodium(this.track, this.fx, this.race.standings[0], real);
      } else {
        this.view.renderRace(this.track, this.fx, this.humans, this.race.karts, real, this.mirrorFlags);
        this.hud.update(this.race, this.humans, this.isOffline);
      }
      this.updateEngines();
      this.pushHuds();
    } else if (this.demo) {
      for (let i = 0; i < sub; i++) this.demo.step(h);
      this.demo.updateVisuals(dt);
      this.view.renderAttract(this.track, this.fx, this.demo.karts, real);
    }
    if (this.snow) {
      const ks = this.humans.length ? this.humans : this.demo?.karts ?? this.race?.karts ?? [];
      let cx = this.track.center.x, cz = this.track.center.z;
      if (ks.length) {
        cx = ks.reduce((a, k) => a + k.x, 0) / ks.length;
        cz = ks.reduce((a, k) => a + k.z, 0) / ks.length;
      }
      this.snow.update(this.paused ? 0 : real, cx, cz, t / 1000);
    }
    if (t - this.tick > 1000) {
      this.tick = t;
      this.refreshOnline();
    }
  }

  /** Změny online/offline (telefon zhasl, vypadla Wi-Fi) → překreslit lobby. */
  private refreshOnline() {
    const now = performance.now();
    if (this.phase === "lobby") {
      for (const p of [...this.session.players])
        if (p.kind === "pad" && !this.session.online(p, now) && now - p.lastSeen > 90000) this.session.remove(p.slot);
    }
    const key = this.session.players.map((p) => `${p.slot}:${this.session.online(p, now)}`).join(",");
    if (key !== this.onlineKey) {
      this.onlineKey = key;
      this.renderLobby();
      this.broadcastLobby();
    }
  }

  private debugHooks() {
    (window as unknown as { __tk: unknown }).__tk = {
      state: () => ({
        phase: this.phase,
        code: this.net.code,
        ready: this.net.ready,
        padUrl: this.net.code ? this.padUrl(this.net.code) : null,
        players: this.session.lobbyPlayers(),
        mode: this.mode,
        cup: this.lastCup,
        track: this.trackIdx,
        race: this.race && {
          flying: this.race.flying,
          phase: this.race.phase,
          time: this.race.time,
          laps: this.race.laps,
          karts: this.race.karts.map((k) => ({
            name: k.name,
            slot: k.slot,
            place: k.place,
            lap: k.lap,
            dist: Math.round(k.dist),
            speed: Math.round(k.vF * 3.6),
            item: k.item,
            finished: k.finished,
            d: Math.round(k.proj.d * 10) / 10,
            frac: Math.round((k.proj.s / this.track.length) * 1000) / 1000,
            wy: Math.round(k.wy * 10) / 10,
            steer: Math.round(k.input.steer * 100) / 100,
            gas: k.input.gas,
            auto: this.race!.autopilot.has(k.slot),
          })),
        },
      }),
      autopilot: (slot: number, on: boolean) => {
        if (on) {
          this.forced.add(slot);
          this.race?.autopilot.add(slot);
        } else {
          this.forced.delete(slot);
          this.race?.autopilot.delete(slot);
        }
      },
      plane: () => this.race?.forcePlane(),
      debris: () => this.race?.events?.debrisCount ?? 0,
      events: () => this.race?.events?.stats ?? null,
      height: (slot: number) => {
        const k = this.race?.kartOf(slot);
        return k ? { y: k.y, gy: k.gy, wy: k.wy, fly: k.flyT } : null;
      },
      giveItem: (slot: number, item: string) => {
        const k = this.race?.kartOf(slot);
        if (k) {
          k.item = item as Kart["item"];
          k.itemN = item === "turbo3" ? 3 : 1;
        }
      },
    };
  }
}

new Game();
