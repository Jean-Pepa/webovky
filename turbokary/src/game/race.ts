// Závod: motokáry, boti, věci, kola, pořadí a konec závodu.
import * as THREE from "three";
import { CHARACTERS, type CharacterDef } from "../shared/characters";
import type { ItemId } from "../shared/items";
import type { ResultRow } from "../shared/protocol";
import { Kart, KART_R, type KartEvents } from "./kart";
import { BotBrain } from "./ai";
import { Items } from "./items";
import type { Track } from "./track";
import type { Effects } from "./effects";
import { formatTime, rng } from "./util";

export interface Entry {
  char: CharacterDef;
  slot: number;
  name: string;
}

export interface RaceListener {
  countdown?(n: number): void;
  go?(): void;
  lap?(k: Kart, lap: number, final: boolean): void;
  finish?(k: Kart, place: number): void;
  over?(): void;
  wall?(k: Kart, strength: number): void;
  bump?(a: Kart, b: Kart, strength: number): void;
  hit?(k: Kart, by: Kart | null, kind: "rocket" | "oil"): void;
  blocked?(k: Kart): void;
  boost?(k: Kart, kind: "drift" | "pad" | "item"): void;
  pickup?(k: Kart): void;
  gotItem?(k: Kart, item: ItemId): void;
  used?(k: Kart, item: ItemId): void;
  driftLevel?(k: Kart, lvl: number): void;
  hop?(k: Kart): void;
  explosion?(x: number, z: number): void;
}

export type RacePhase = "countdown" | "running" | "over";

const SPARK = [0xfff3d0, 0xffd21f, 0x7cf3ff];
const v3 = new THREE.Vector3();

export class Race {
  readonly karts: Kart[] = [];
  readonly group = new THREE.Group();
  readonly items: Items;
  readonly track: Track;
  readonly laps: number;
  readonly attract: boolean;
  standings: Kart[] = [];
  phase: RacePhase = "countdown";
  /** čas od startu (s) */
  time = 0;
  /** celkový čas včetně odpočtu (pro animace) */
  clock = 0;
  countT = 3.5;
  /** sloty hráčů, za které řídí počítač (odpojený ovladač, test) */
  autopilot = new Set<number>();
  private brains = new Map<Kart, BotBrain>();
  private lastCount = 4;
  private firstHumanFinish = -1;
  private overT = -1;
  private overSent = false;
  private fx: Effects;
  private L: RaceListener;
  private kev: KartEvents;

  constructor(track: Track, fx: Effects, entries: Entry[], botCount: number, laps: number, listener: RaceListener, attract = false) {
    this.track = track;
    this.fx = fx;
    this.laps = laps;
    this.L = listener;
    this.attract = attract;
    const r = rng((Date.now() & 0xffffff) ^ 0x5eed);
    const used = new Set(entries.map((e) => e.char.id));
    const free = CHARACTERS.filter((c) => !used.has(c.id)).sort(() => r() - 0.5);
    const bots: Entry[] = free.slice(0, botCount).map((c) => ({ char: c, slot: -1, name: c.short }));
    const skills = [0.99, 0.975, 0.96, 0.95, 0.94, 0.93, 0.92].sort(() => r() - 0.5);
    const order = [...bots, ...entries];
    order.forEach((e, i) => {
      const k = new Kart(i, e.char, e.slot, e.name);
      const p = track.gridSlot(i);
      k.placeAt(p.x, p.z, p.heading, track);
      this.karts.push(k);
      this.group.add(k.visual.root);
      if (k.visual.label) k.visual.label.layers.set(1 + e.slot);
      this.brains.set(k, new BotBrain(r, e.slot < 0 ? skills[i % skills.length] : 0.97));
    });
    this.standings = [...this.karts];
    this.kev = {
      wall: (k, s) => this.L.wall?.(k, s),
      driftLevel: (k, l) => this.L.driftLevel?.(k, l),
      boost: (k, kind) => this.L.boost?.(k, kind),
      hop: (k) => this.L.hop?.(k),
    };
    this.items = new Items(track, fx, {
      pickup: (k) => this.L.pickup?.(k),
      gotItem: (k, it) => this.L.gotItem?.(k, it),
      used: (k, it) => this.L.used?.(k, it),
      hit: (k, by, kind) => this.L.hit?.(k, by, kind),
      blocked: (k) => this.L.blocked?.(k),
      explosion: (x, z) => this.L.explosion?.(x, z),
    });
    this.group.add(this.items.group);
    if (attract) {
      this.phase = "running";
      track.setLights(0);
    } else track.setLights(0);
  }

  get humans() {
    return this.karts.filter((k) => k.human);
  }

  kartOf(slot: number) {
    return this.karts.find((k) => k.slot === slot) ?? null;
  }

  useItem(k: Kart) {
    if (this.phase === "countdown" || k.spinT > 0) return;
    this.items.use(k, this.standings);
  }

  step(dt: number) {
    const tr = this.track;
    this.clock += dt;
    if (this.phase === "countdown") {
      this.countT -= dt;
      const n = Math.ceil(this.countT);
      if (n !== this.lastCount && n >= 1 && n <= 3) {
        this.lastCount = n;
        tr.setLights(4 - n);
        this.L.countdown?.(n);
      }
      if (this.countT <= 0) {
        this.phase = "running";
        this.time = 0;
        tr.setLights(4);
        this.L.go?.();
      }
    } else {
      const before = this.time;
      this.time += dt;
      if (!this.attract && before < 2.5 && this.time >= 2.5) tr.setLights(0);
    }
    const canDrive = this.phase !== "countdown";
    const n = this.standings.length;

    // gumička: boti daleko vzadu za nejlepším hráčem trochu zrychlí, vepředu zpomalí
    let bestHuman = -Infinity;
    for (const k of this.karts) if (k.human) bestHuman = Math.max(bestHuman, k.dist);

    for (const k of this.karts) {
      const brain = this.brains.get(k)!;
      const auto = !k.human || k.finished || this.autopilot.has(k.slot);
      if (auto) {
        const i = this.standings.indexOf(k);
        const ahead = i > 0 ? this.standings[i - 1] : null;
        const behind = i < n - 1 ? this.standings[i + 1] : null;
        const out = brain.think(k, tr, dt, {
          racing: canDrive,
          ahead,
          aheadGap: ahead ? ahead.dist - k.dist : 1e9,
          behind,
          behindGap: behind ? k.dist - behind.dist : 1e9,
        });
        k.input = out.c;
        if (out.useItem && canDrive && !k.finished) this.useItem(k);
      }
      if (!k.human) {
        let band = 1;
        if (!this.attract && isFinite(bestHuman)) {
          const gap = k.dist - bestHuman;
          if (gap < -40) band = 1 + Math.min(0.07, (-gap - 40) / 600);
          else if (gap > 60) band = 1 - Math.min(0.08, (gap - 60) / 500);
        }
        k.speedMul = brain.skill * band;
      } else k.speedMul = k.finished ? 0.75 : 1;
      k.step(dt, tr, tr.theme, canDrive, this.kev);
    }

    this.collide();

    const L = tr.length;
    for (const k of this.karts) {
      k.progress(tr);
      // turbo pásy
      if (k.padCool <= 0 && k.y < 0.5) {
        for (const p of tr.pads) {
          let ds = k.proj.s - p.s0;
          if (ds < 0) ds += L;
          if (ds <= p.len && Math.abs(k.proj.d - p.d) <= p.halfW + 0.4) {
            k.boost(1.0);
            k.padCool = 0.6;
            this.L.boost?.(k, "pad");
          }
        }
      }
      // jízda v protisměru
      const i = k.proj.idx;
      const dot = Math.sin(k.heading) * tr.tx[i] + Math.cos(k.heading) * tr.tz[i];
      if (dot < -0.25 && k.vF > 3) k.wrongT += dt;
      else k.wrongT = Math.max(0, k.wrongT - dt * 2);
      this.lapCheck(k);
    }

    this.items.update(dt, this.clock, this.karts, this.standings);

    this.standings.sort((a, b) => {
      if (a.finished !== b.finished) return a.finished ? -1 : 1;
      if (a.finished) return a.finishTime - b.finishTime;
      return b.dist - a.dist;
    });
    this.standings.forEach((k, i) => (k.place = i + 1));

    if (!this.attract && this.phase === "running") {
      const hs = this.humans;
      const allDone = hs.length > 0 && hs.every((k) => k.finished);
      const timeout = this.firstHumanFinish >= 0 && this.time - this.firstHumanFinish > 30;
      if (allDone || timeout) {
        this.phase = "over";
        this.overT = 0;
      }
    }
    if (this.phase === "over" && !this.overSent) {
      this.overT += dt;
      if (this.overT > 2.6) {
        this.overSent = true;
        this.L.over?.();
      }
    }
  }

  private lapCheck(k: Kart) {
    if (this.attract) return;
    const L = this.track.length;
    const lapNow = k.dist < 0 ? 0 : Math.floor(k.dist / L) + 1;
    if (lapNow <= k.lap) return;
    if (k.lap >= 1) k.bestLap = Math.min(k.bestLap, this.time - k.lapStart);
    k.lap = lapNow;
    k.lapStart = this.time;
    if (k.lap > this.laps) {
      if (!k.finished) {
        k.finished = true;
        k.finishTime = this.time;
        const place = this.karts.filter((o) => o.finished).length;
        if (k.human && this.firstHumanFinish < 0) this.firstHumanFinish = this.time;
        this.L.finish?.(k, place);
      }
    } else if (k.lap > 1) this.L.lap?.(k, k.lap, k.lap === this.laps);
  }

  private collide() {
    const ks = this.karts;
    const R = KART_R * 1.9;
    for (let i = 0; i < ks.length; i++)
      for (let j = i + 1; j < ks.length; j++) {
        const a = ks[i], b = ks[j];
        let dx = b.x - a.x, dz = b.z - a.z;
        const d2 = dx * dx + dz * dz;
        if (d2 >= R * R || Math.abs(a.y - b.y) > 1) continue;
        let d = Math.sqrt(d2);
        if (d < 1e-4) {
          dx = 1;
          dz = 0;
          d = 1;
        }
        const nx = dx / d, nz = dz / d, pen = Math.max(0, R - d);
        a.x -= nx * pen * 0.5;
        a.z -= nz * pen * 0.5;
        b.x += nx * pen * 0.5;
        b.z += nz * pen * 0.5;
        const rel = (b.vx - a.vx) * nx + (b.vz - a.vz) * nz;
        if (rel < 0) {
          const imp = -1.5 * rel * 0.5;
          a.vx -= imp * nx;
          a.vz -= imp * nz;
          b.vx += imp * nx;
          b.vz += imp * nz;
          if (-rel > 4) this.L.bump?.(a, b, -rel);
        }
      }
  }

  /** Grafika a částice (jednou za snímek). */
  updateVisuals(dt: number) {
    const fx = this.fx;
    const th = this.track.theme;
    this.track.update(this.clock);
    for (const k of this.karts) {
      k.updateVisual(dt, this.clock);
      const v = k.visual;
      v.root.updateMatrixWorld();
      const sp = Math.abs(k.vF);
      if (k.drifting && k.y <= 0.05) {
        for (const w of v.wheelLocal) {
          if (Math.random() > 0.55 + k.driftLevel * 0.2) continue;
          v3.copy(w);
          v.body.localToWorld(v3);
          fx.spark(v3.x, v3.y + 0.1, v3.z, SPARK[k.driftLevel], 3 + k.driftLevel * 2, 0.16 + k.driftLevel * 0.08);
        }
      }
      if (k.boostT > 0) {
        for (const e of v.exhaustLocal) {
          v3.copy(e);
          v.body.localToWorld(v3);
          fx.flame(v3.x, v3.y, v3.z, -Math.sin(k.heading) * 4, -Math.cos(k.heading) * 4, false);
        }
      }
      if (k.offroad && sp > 6 && Math.random() < 0.5) {
        const w = v.wheelLocal[Math.random() < 0.5 ? 0 : 1];
        v3.copy(w);
        v.body.localToWorld(v3);
        fx.dust(v3.x, v3.z, th.dust, k.vx, k.vz);
      }
      if (k.spinT > 0 && Math.random() < 0.3) fx.smoke(k.x, 0.6, k.z, 0.9);
    }
    fx.update(dt);
  }

  results(): ResultRow[] {
    return this.standings.map((k, i) => ({
      place: i + 1,
      name: k.name,
      char: k.char.id,
      time: k.finished ? formatTime(k.finishTime * 1000) : "nedojel",
      best: isFinite(k.bestLap) ? formatTime(k.bestLap * 1000) : "–",
      human: k.human,
      slot: k.slot,
    }));
  }

  dispose() {
    this.group.parent?.remove(this.group);
    this.group.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.geometry) m.geometry.dispose();
      const s = o as THREE.Sprite;
      if (s.isSprite) (s.material as THREE.SpriteMaterial).map?.dispose();
    });
  }
}
