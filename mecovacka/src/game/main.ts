// Obrazovka na PC: spojuje síť (telefony), lobby, herní režimy, kamery, HUD, diváky a zvuk.
import "@fontsource/lilita-one/latin-400.css";
import "@fontsource/lilita-one/latin-ext-400.css";
import "@fontsource/baloo-2/latin-500.css";
import "@fontsource/baloo-2/latin-ext-500.css";
import "@fontsource/baloo-2/latin-700.css";
import "@fontsource/baloo-2/latin-ext-700.css";
import "@fontsource/baloo-2/latin-800.css";
import "@fontsource/baloo-2/latin-ext-800.css";
import "../styles/game.css";
import type * as THREE from "three";
import type { DataConnection } from "peerjs";
import { CHARACTERS } from "../shared/characters";
import { peerParam } from "../shared/net";
import { DIFFS, MODES, PROTOCOL_VERSION, ROUNDS, type HostMsg, type HudState, type PadMsg, type ResultRow } from "../shared/protocol";
import { Arena } from "./arena";
import { Music, Sound, type SwingVoice } from "./audio";
import { Effects } from "./effects";
import { Hud } from "./hud";
import { Input } from "./input";
import { loadModels } from "./models";
import { NetHost } from "./net-host";
import { Lobby, Pause, Results } from "./screens";
import { Session, cleanName, type Player } from "./session";
import { Spectators } from "./spectators";
import { CamRig, View, type Viewport } from "./view";
import { MouseSword, PhoneSword } from "./controls";
import { DuelActivity } from "./duel-mode";
import { SliceActivity, sliceBest } from "./slice-mode";
import { TrainActivity } from "./train-mode";
import type { Activity, Ctx, Entrant } from "./activity";
import type { Fighter } from "./fighter";
import { clamp, store, save } from "./util";

const params = new URLSearchParams(location.search);

type Top = "lobby" | "play" | "results";

class Game {
  private view = new View(document.getElementById("scene") as HTMLCanvasElement);
  private sound = new Sound();
  private music = new Music(this.sound);
  private fx = new Effects();
  private hud = new Hud(document.getElementById("hud")!);
  private ui = document.getElementById("ui")!;
  private input = new Input(document.getElementById("scene")!);
  private session = new Session();
  private net: NetHost;
  private lobby: Lobby;
  private results: Results;
  private pause: Pause;
  private arena!: Arena;
  private spectators!: Spectators;
  private rigs = [new CamRig(), new CamRig()];
  private vps: Viewport[] = [];
  private mode = clamp(store("mc_mode", 0), 0, MODES.length - 1);
  private diff = clamp(store("mc_diff", 1), 0, DIFFS.length - 1);
  private rounds = clamp(store("mc_rounds", 1), 0, ROUNDS.length - 1);
  private top: Top = "lobby";
  private act: Activity | null = null;
  private demo: DuelActivity | null = null;
  private voices = new Map<Fighter, SwingVoice>();
  private paused = false;
  private last = performance.now();
  private tick = 0;
  private padAt = 0;
  private onlineKey = "";
  private lastResults: { title: string; rows: ResultRow[] } | null = null;
  private ctx: Ctx;

  constructor() {
    this.view.scene.add(this.fx.group);
    this.ctx = {
      scene: this.view.scene,
      arena: null as unknown as Arena,
      fx: this.fx,
      sound: this.sound,
      hud: this.hud,
      view: this.view,
      buzz: (slot, ms) => {
        const p = this.session.bySlot(slot);
        if (p?.conn) this.net.send(p.conn, { t: "buzz", ms });
      },
      pop: (text, p, cls) => this.pop(text, p, cls),
      cheer: (a) => this.spectators.cheer(a),
      shake: (a) => (this.view.shake = Math.max(this.view.shake, a)),
    };
    this.lobby = new Lobby(this.ui, {
      start: () => this.start(),
      mode: (i) => this.setMode(i),
      diff: (d) => this.setDiff(this.diff + d),
      rounds: (d) => this.setRounds(this.rounds + d),
      addMouse: () => this.addMouse(),
      removePlayer: (s) => this.removePlayer(s),
      toggleSound: () => this.toggleSound(),
      fullscreen: () => void document.documentElement.requestFullscreen?.().catch(() => {}),
    });
    this.results = new Results(this.ui, () => this.again(), () => this.toLobby());
    this.pause = new Pause(this.ui, { resume: () => this.setPaused(false), restart: () => this.again(), menu: () => this.toLobby() });
    this.hud.show(false);
    this.input.onKey = (c, e) => this.onKey(c, e);
    addEventListener("pointerdown", () => this.sound.unlock());
    addEventListener("keydown", () => this.sound.unlock());

    this.net = new NetHost({
      status: (k, d) => this.netStatus(k, d),
      room: (code) => this.lobby.setRoom(code, this.padUrl(code), this.shortUrl()),
      message: (c, m) => this.onMessage(c, m),
      motion: (c, cid) => {
        const p = this.session.byCid(cid);
        if (p) p.motion = c;
      },
      closed: (c) => this.onClosed(c),
    });
    this.lanCheck();
    void loadModels().finally(() => this.boot());
  }

  private boot() {
    this.arena = new Arena(this.view.scene);
    this.ctx.arena = this.arena;
    this.spectators = new Spectators(this.view.scene, this.arena);
    this.renderLobby();
    this.startDemo();
    this.net.start();
    if (params.has("mouse")) this.addMouse();
    this.debugHooks();
    requestAnimationFrame((t) => this.frame(t));
  }

  // ------------------------------------------------------------ lobby

  private startDemo() {
    this.demo?.dispose();
    this.demo = new DuelActivity(this.ctx, [], { diff: 1, roundsToWin: 99, demo: true });
    this.spectators.setup(this.demo.fighters.map((f) => f.char?.id ?? -1));
    for (const r of this.rigs) r.snap = true;
  }

  private setMode(i: number) {
    if (this.top !== "lobby") return;
    this.mode = clamp(i, 0, MODES.length - 1);
    save("mc_mode", this.mode);
    this.sound.play("click");
    this.renderLobby();
    this.broadcastLobby();
  }
  private setDiff(n: number) {
    if (this.top !== "lobby") return;
    this.diff = (n + DIFFS.length) % DIFFS.length;
    save("mc_diff", this.diff);
    this.renderLobby();
    this.broadcastLobby();
  }
  private setRounds(n: number) {
    if (this.top !== "lobby") return;
    this.rounds = (n + ROUNDS.length) % ROUNDS.length;
    save("mc_rounds", this.rounds);
    this.renderLobby();
    this.broadcastLobby();
  }

  private renderLobby() {
    const best = sliceBest();
    this.lobby.render({
      players: this.session.lobbyPlayers(),
      mode: this.mode,
      diff: this.diff,
      rounds: this.rounds,
      canStart: this.session.players.some((p) => this.session.online(p)),
      muted: this.sound.muted,
      best: best ? `${best.score} b. (${best.name})` : "—",
    });
  }

  private lobbyMsg(p: Player): HostMsg {
    const host = this.session.hostSlot();
    return {
      t: "lobby",
      players: this.session.lobbyPlayers(),
      you: p.slot,
      host: host === p.slot,
      mode: this.mode,
      diff: this.diff,
      rounds: this.rounds,
      playing: this.top !== "lobby",
    };
  }

  private broadcastLobby() {
    for (const p of this.session.players) if (p.conn) this.net.send(p.conn, this.lobbyMsg(p));
  }

  private addMouse() {
    if (this.top !== "lobby" || this.session.players.some((p) => p.kind === "mouse")) return;
    const p = this.session.add("mouse", "mouse", "Myš", -1, "R", null);
    if (!p) return;
    this.sound.play("join");
    this.renderLobby();
    this.broadcastLobby();
  }

  private removePlayer(slot: number) {
    const p = this.session.bySlot(slot);
    if (!p || this.top !== "lobby") return;
    if (p.conn) {
      this.net.send(p.conn, { t: "full" });
      const c = p.conn;
      setTimeout(() => c.close(), 300);
    }
    this.session.remove(slot);
    this.renderLobby();
    this.broadcastLobby();
  }

  private toggleSound() {
    this.sound.unlock();
    this.sound.setMuted(!this.sound.muted);
    if (!this.sound.muted) this.music.play("molo");
    this.renderLobby();
  }

  private netStatus(kind: "connecting" | "ready" | "error", detail?: string) {
    const text = kind === "ready" ? "Připraveno — čekám na telefony" : kind === "connecting" ? "Připojuji se k serveru…" : detail ?? "Chyba spojení";
    this.lobby.setStatus(kind, text);
  }

  private padUrl(code: string) {
    // podle BASE_URL: hra běží samostatně (/) i na webu TurboKár (/mece/)
    const u = new URL(import.meta.env.BASE_URL + (import.meta.env.DEV ? "pad.html" : "pad"), location.origin);
    u.search = "";
    u.hash = "";
    u.searchParams.set("r", code);
    const peer = peerParam();
    if (peer) u.searchParams.set("peer", peer);
    return u.toString();
  }

  private shortUrl() {
    return `${location.host}${import.meta.env.BASE_URL}${import.meta.env.DEV ? "pad.html" : "pad"}`;
  }

  private lanCheck() {
    const h = location.hostname;
    if (h === "localhost" || h === "127.0.0.1" || h === "[::1]")
      this.lobby.setLanWarning(
        "Hra běží jako „localhost“ — telefon se k ní nedostane. Otevři ji na PC přes síťovou adresu (např. https://192.168.…:5173), kterou vypíše npm run dev:https.",
      );
    else if (location.protocol !== "https:")
      this.lobby.setLanWarning("Hra běží přes http — telefony pak neposílají natočení (jen záložní míření prstem). Použij https: Vercel nebo npm run dev:https.");
  }

  // ------------------------------------------------------------ síť

  private onMessage(conn: DataConnection, msg: PadMsg) {
    if (msg.t === "hello") return this.onHello(conn, msg);
    const p = this.session.byConn(conn);
    if (!p) return;
    p.lastSeen = performance.now();
    switch (msg.t) {
      case "m":
        if (p.sword instanceof PhoneSword) p.sword.sample(msg.q, !!msg.g, Number(msg.ts) || 0, msg.k);
        p.sensor = msg.k;
        break;
      case "cal":
        p.sword.calibrate();
        break;
      case "me":
        if (typeof msg.name === "string") p.name = cleanName(msg.name) || p.name;
        if (msg.hand === "L" || msg.hand === "R") p.hand = msg.hand;
        if (typeof msg.char === "number" && this.top === "lobby") p.char = this.session.freeChar(msg.char, p.slot) === msg.char ? msg.char : p.char;
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
      if (this.session.full || this.top !== "lobby") {
        this.net.send(conn, { t: "full" });
        setTimeout(() => conn.close(), 600);
        return;
      }
      p = this.session.add("pad", cid, cleanName(msg.name), Number(msg.char), msg.hand, conn)!;
      this.sound.play("join");
    }
    this.net.send(conn, { t: "welcome", slot: p.slot, v: PROTOCOL_VERSION });
    this.net.send(conn, this.lobbyMsg(p));
    p.hudKey = "";
    if (this.top === "results" && this.lastResults) this.net.send(conn, { t: "results", ...this.lastResults, you: p.slot });
    this.renderLobby();
    this.broadcastLobby();
  }

  private onClosed(conn: DataConnection) {
    const p = this.session.byConn(conn);
    if (!p) return;
    if (p.conn === conn) p.conn = null;
    if (p.motion === conn) p.motion = null;
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
      case "mode":
        this.setMode(Number(msg.v) || 0);
        break;
      case "diff":
        this.setDiff(Number(msg.v) || 0);
        break;
      case "rounds":
        this.setRounds(Number(msg.v) || 0);
        break;
      case "next":
        if (this.top === "results") this.again();
        break;
      case "lobby":
        if (this.top === "results") this.toLobby();
        break;
      case "pause":
        if (this.top === "play") this.setPaused(!this.paused);
        break;
      case "restart":
        if (this.paused) this.again();
        break;
      case "quit":
        if (this.paused || this.top === "results") this.toLobby();
        break;
    }
  }

  // ------------------------------------------------------------ hra

  private entrants(): Entrant[] {
    return this.session.players
      .filter((p) => this.session.online(p))
      .map((p) => ({ slot: p.slot, name: p.name, char: CHARACTERS[p.char], hand: p.hand, ctl: p.sword }));
  }

  private start() {
    if (this.top !== "lobby") return;
    const ent = this.entrants();
    if (!ent.length) {
      this.hud.show(true);
      this.hud.big("Nikdo nehraje", "Připoj telefon (QR kód) nebo přidej hráče s myší klávesou M", 2600);
      return;
    }
    this.sound.unlock();
    this.demo?.dispose();
    this.demo = null;
    this.voicesOff();
    const m = MODES[this.mode].id;
    if (m === "duel") this.act = new DuelActivity(this.ctx, ent, { diff: this.diff, roundsToWin: ROUNDS[this.rounds] });
    else if (m === "slice") this.act = new SliceActivity(this.ctx, ent);
    else this.act = new TrainActivity(this.ctx, ent[0]);
    this.spectators.setup(this.act.fighters.map((f) => f.char?.id ?? -1));
    for (const r of this.rigs) r.snap = true;
    this.top = "play";
    this.paused = false;
    this.lobby.show(false);
    this.results.hide();
    this.hud.show(true);
    this.hud.split(this.act.fighters.filter((f) => f.slot >= 0).length > 1 && m !== "train");
    if (!this.sound.muted) this.music.play("molo");
    this.broadcastLobby();
    for (const p of this.session.players) p.hudKey = "";
  }

  private again() {
    if (this.top === "lobby") return;
    this.act?.dispose();
    this.act = null;
    this.top = "lobby";
    this.pause.show(false);
    this.start();
  }

  private toLobby() {
    this.act?.dispose();
    this.act = null;
    this.voicesOff();
    this.top = "lobby";
    this.paused = false;
    this.pause.show(false);
    this.results.hide();
    this.hud.show(false);
    this.hud.hideBig();
    this.lobby.show(true);
    this.startDemo();
    this.renderLobby();
    this.broadcastLobby();
    for (const p of this.session.players) p.hudKey = "";
  }

  private setPaused(on: boolean) {
    if (this.top !== "play") return;
    this.paused = on;
    this.pause.show(on);
  }

  private showResults() {
    if (!this.act) return;
    const r = this.act.results();
    this.lastResults = r;
    this.top = "results";
    this.results.show(r.title, r.rows);
    this.hud.prompt(0, null);
    this.hud.prompt(1, null);
    for (const p of this.session.players) if (p.conn) this.net.send(p.conn, { t: "results", ...r, you: p.slot });
    for (const p of this.session.players) p.hudKey = "";
  }

  private pop(text: string, p: THREE.Vector3, cls = "") {
    for (const vp of this.vps) {
      const s = this.view.project(p, vp);
      if (!s.behind && s.x > vp.x && s.x < vp.x + vp.w) this.hud.pop(text, s.x, s.y, cls);
    }
  }

  private onKey(code: string, e: KeyboardEvent) {
    if (this.paused) {
      if (code === "Escape") this.setPaused(false);
      else if (code === "KeyR") this.again();
      else if (code === "KeyQ") this.toLobby();
      return;
    }
    if (this.top === "lobby") {
      if (code === "KeyM") this.addMouse();
      else if (code === "Digit1" || code === "Digit2" || code === "Digit3") this.setMode(Number(code.slice(5)) - 1);
      else if (code === "Enter") this.start();
      else if (code === "KeyF") void document.documentElement.requestFullscreen?.().catch(() => {});
    } else if (this.top === "play") {
      if (code === "Escape") this.setPaused(true);
      else if (code === "Enter") this.act?.skip();
    } else if (this.top === "results") {
      if (code === "Enter") this.again();
      else if (code === "Escape") this.toLobby();
    }
    void e;
  }

  // ------------------------------------------------------------ smyčka

  private updateMouse() {
    for (const p of this.session.players) {
      if (!(p.sword instanceof MouseSword)) continue;
      p.sword.setPointer(this.input.mx, this.input.my);
      p.sword.guard = this.input.guard;
    }
  }

  private voicesOff() {
    for (const v of this.voices.values()) v.stop();
    this.voices.clear();
  }

  private updateVoices(fighters: Fighter[], owners: (Fighter | null)[]) {
    if (!this.sound.ready) return;
    for (const f of fighters) {
      let v = this.voices.get(f);
      if (!v) {
        const nv = this.sound.swing();
        if (!nv) continue;
        v = nv;
        this.voices.set(f, v);
      }
      const split = owners.length > 1;
      const pan = split ? (owners.indexOf(f) === 0 ? -0.5 : owners.indexOf(f) === 1 ? 0.5 : 0) : 0;
      v.set(f.speedSm, pan, this.demo ? 0.25 : 1);
    }
  }

  private frame(t: number) {
    requestAnimationFrame((tt) => this.frame(tt));
    const real = Math.min(0.05, Math.max(0, (t - this.last) / 1000));
    this.last = t;
    const now = performance.now();
    this.updateMouse();
    const act = this.act ?? this.demo;
    let owners: (Fighter | null)[] = [null];
    if (act) {
      if (!this.paused) act.step(real * act.timeScale, now);
      owners = act.cameras(this.rigs, real).owners;
      const head = act.fighters[0]?.body.head;
      if (head) this.spectators.setLook(head);
      this.updateVoices(act.fighters, owners);
    }
    this.spectators.update(real);
    this.arena.update(real);
    this.fx.update(this.paused ? 0 : real * (act?.timeScale ?? 1));
    const rigs = this.rigs.slice(0, Math.max(1, owners.length));
    this.vps = this.view.layout(rigs, owners);
    this.fx.setViewportHeight(this.vps[0].h);
    this.view.render(this.vps, rigs, act?.fighters ?? [], real);
    if (this.act) {
      this.act.hud(this.vps);
      if (this.act.finished && this.top === "play") this.showResults();
    }
    if (t - this.padAt > 160) {
      this.padAt = t;
      this.pushPads();
    }
    if (t - this.tick > 1000) {
      this.tick = t;
      this.refreshOnline();
    }
  }

  /** Stav pro telefony (asi 6× za sekundu a při změně). */
  private pushPads() {
    const host = this.session.hostSlot();
    for (const p of this.session.players) {
      if (!p.conn) continue;
      let h: HudState;
      const base = { mode: MODES[this.mode].id, pause: this.paused, host: p.slot === host };
      if (this.top === "lobby") h = { ...base, phase: "lobby", msg: "", ready: false, round: 0, score: [0, 0] };
      else if (this.top === "results") h = { ...base, phase: "results", msg: "", ready: true, round: 0, score: [0, 0] };
      else if (this.act && this.act.fighters.some((f) => f.slot === p.slot)) h = { ...base, ...this.act.pad(p.slot) };
      else h = { ...base, phase: "point", msg: "Hraje se na PC — sleduj obrazovku", ready: false, round: 0, score: [0, 0] };
      const key = JSON.stringify(h);
      if (key === p.hudKey && performance.now() - p.hudAt < 2000) continue;
      p.hudKey = key;
      p.hudAt = performance.now();
      this.net.send(p.conn, { t: "hud", ...h });
    }
  }

  /** Změny online/offline (telefon zhasl, vypadla Wi-Fi) → překreslit lobby. */
  private refreshOnline() {
    const now = performance.now();
    if (this.top === "lobby") {
      for (const p of [...this.session.players])
        if (p.kind === "pad" && !this.session.online(p, now) && now - p.lastSeen > 90000) this.session.remove(p.slot);
    }
    const key = this.session.players.map((p) => `${p.slot}:${this.session.online(p, now)}:${p.sensor}`).join(",");
    if (key !== this.onlineKey) {
      this.onlineKey = key;
      if (this.top === "lobby") this.renderLobby();
      this.broadcastLobby();
    }
  }

  private debugHooks() {
    (window as unknown as { __mc: unknown }).__mc = {
      state: () => ({
        top: this.top,
        code: this.net.code,
        ready: this.net.ready,
        padUrl: this.net.code ? this.padUrl(this.net.code) : null,
        players: this.session.lobbyPlayers(),
        mode: MODES[this.mode].id,
        paused: this.paused,
        act: this.act && {
          kind: this.act.kind,
          finished: this.act.finished,
          pad: this.session.players.map((p) => this.act!.pad(p.slot)),
          fighters: this.act.fighters.map((f) => ({
            name: f.name,
            slot: f.slot,
            z: Math.round(f.z * 100) / 100,
            state: f.state,
            speed: Math.round(f.speedSm * 10) / 10,
            guard: f.guarding,
            hits: f.stats.hits,
            blocks: f.stats.blocks,
            calibrated: f.ctl.calibrated,
            dir: f.dirL.toArray().map((v) => Math.round(v * 100) / 100),
          })),
          duel: this.act instanceof DuelActivity && {
            phase: this.act.duel.phase,
            round: this.act.duel.round,
            score: this.act.duel.score,
            ready: this.act.duel.ready,
          },
          slice: this.act instanceof SliceActivity && this.act.debug(),
          train: this.act instanceof TrainActivity && this.act.debug(),
        },
      }),
      start: () => this.start(),
      mode: (i: number) => this.setMode(i),
      skip: () => this.act?.skip(),
      lobby: () => this.toLobby(),
      /** strčí do šermíře (test pádu do vody): side 0/1, rychlost m/s směrem k okraji */
      knock: (side: number, v: number) => {
        const f = this.act?.fighters[side];
        if (f) f.vz += (f.side === 0 ? 1 : -1) * v;
      },
    };
  }
}

new Game();
