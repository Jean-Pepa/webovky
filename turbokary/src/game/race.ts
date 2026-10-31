// Závod: průlet kamerou, odpočet s turbo startem, motokáry, boti, věci, skokánky, závětří,
// kola, pořadí a konec závodu.
import * as THREE from "three";
import type { CharacterDef } from "../shared/characters";
import type { ItemId } from "../shared/items";
import type { ResultRow } from "../shared/protocol";
import { Kart, KART_R, type KartEvents } from "./kart";
import { BotBrain } from "./ai";
import { Items, type HitBy } from "./items";
import { PlaneEvents } from "./events";
import type { Track } from "./track";
import type { Effects } from "./effects";
import { formatTime, rng } from "./util";

export interface Entry {
  char: CharacterDef;
  slot: number;
  name: string;
}

export type BoostKind = "drift" | "pad" | "item" | "trick" | "start" | "draft";

export interface RaceListener {
  countdown?(n: number): void;
  go?(): void;
  startBoost?(k: Kart, good: boolean): void;
  lap?(k: Kart, lap: number, final: boolean): void;
  finish?(k: Kart, place: number): void;
  over?(): void;
  wall?(k: Kart, strength: number): void;
  bump?(a: Kart, b: Kart, strength: number): void;
  hit?(k: Kart, by: Kart | null, kind: HitBy): void;
  blocked?(k: Kart): void;
  boost?(k: Kart, kind: BoostKind): void;
  pickup?(k: Kart): void;
  gotItem?(k: Kart, item: ItemId): void;
  used?(k: Kart, item: ItemId, dir: number): void;
  driftLevel?(k: Kart, lvl: number): void;
  hop?(k: Kart): void;
  trick?(k: Kart): void;
  launch?(k: Kart): void;
  land?(k: Kart): void;
  explosion?(x: number, z: number): void;
  bounce?(x: number, z: number): void;
  bees?(target: Kart): void;
  golden?(k: Kart, item: ItemId): void;
  planeWarn?(x: number, y: number, z: number, inS: number): void;
  planeCrash?(x: number, y: number, z: number): void;
}

export interface RaceOptions {
  attract?: boolean;
  intro?: number;
}

export type RacePhase = "intro" | "countdown" | "running" | "over";

const SPARK = [0xfff3d0, 0xffd21f, 0x7cf3ff, 0xff6bd6];
const v3 = new THREE.Vector3();
export const COUNTDOWN = 3.5;

export class Race {
  readonly karts: Kart[] = [];
  readonly group = new THREE.Group();
  readonly items: Items;
  readonly events: PlaneEvents | null;
  readonly track: Track;
  readonly laps: number;
  readonly attract: boolean;
  standings: Kart[] = [];
  phase: RacePhase = "countdown";
  /** čas od startu (s) */
  time = 0;
  /** celkový čas včetně odpočtu (pro animace) */
  clock = 0;
  countT = COUNTDOWN;
  introT = 0;
  readonly introLen: number;
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
  private r: () => number;

  constructor(track: Track, fx: Effects, entries: Entry[], bots: CharacterDef[], laps: number, listener: RaceListener, opts: RaceOptions = {}) {
    this.track = track;
    this.fx = fx;
    this.laps = laps;
    this.L = listener;
    this.attract = !!opts.attract;
    this.introLen = this.attract ? 0 : opts.intro ?? 3;
    this.introT = this.introLen;
    this.phase = this.attract ? "running" : this.introLen > 0 ? "intro" : "countdown";
    const r = rng((Date.now() & 0xffffff) ^ 0x5eed);
    this.r = r;
    const botEntries: Entry[] = bots.map((c) => ({ char: c, slot: -1, name: c.short }));
    // boti mají stejné motokáry jako hráči, liší se jen tím, jak dobře řídí
    const skills = [1, 0.95, 0.9, 0.85, 0.8, 0.75, 0.7].sort(() => r() - 0.5);
    const order = [...botEntries, ...entries];
    order.forEach((e, i) => {
      const k = new Kart(i, e.char, e.slot, e.name);
      const p = track.gridSlot(i);
      k.placeAt(p.x, p.z, p.heading, track);
      this.karts.push(k);
      this.group.add(k.visual.root);
      if (k.visual.label) k.visual.label.layers.set(1 + e.slot);
      this.brains.set(k, new BotBrain(r, e.slot < 0 ? skills[i % skills.length] : 1));
    });
    this.standings = [...this.karts];
    this.kev = {
      wall: (k, s) => this.L.wall?.(k, s),
      driftLevel: (k, l) => this.L.driftLevel?.(k, l),
      boost: (k, kind) => this.L.boost?.(k, kind),
      hop: (k) => this.L.hop?.(k),
      trick: (k) => this.L.trick?.(k),
      land: (k) => {
        this.fx.burst(k.x, k.gy + 0.3, k.z, [0xffffff, this.track.theme.dust], 14, 5, 0.5, 0.4);
        this.L.land?.(k);
      },
    };
    this.items = new Items(track, fx, {
      pickup: (k) => this.L.pickup?.(k),
      gotItem: (k, it) => this.L.gotItem?.(k, it),
      used: (k, it, dir) => this.L.used?.(k, it, dir),
      hit: (k, by, kind) => this.L.hit?.(k, by, kind),
      blocked: (k) => this.L.blocked?.(k),
      explosion: (x, z) => this.L.explosion?.(x, z),
      bounce: (x, z) => this.L.bounce?.(x, z),
      bees: (t) => this.L.bees?.(t),
      golden: (k, it) => this.L.golden?.(k, it),
    });
    this.group.add(this.items.group);
    this.events = track.planeSpots.length
      ? new PlaneEvents(track, fx, {
          warn: (x, y, z, t) => this.L.planeWarn?.(x, y, z, t),
          crash: (x, y, z) => this.L.planeCrash?.(x, y, z),
          hit: (k) => this.L.hit?.(k, null, "plane"),
        })
      : null;
    if (this.events) this.group.add(this.events.group);
    track.setLights(0);
  }

  get humans() {
    return this.karts.filter((k) => k.human);
  }

  kartOf(slot: number) {
    return this.karts.find((k) => k.slot === slot) ?? null;
  }

  useItem(k: Kart, dir = 0) {
    if (this.phase === "countdown" || this.phase === "intro" || k.spinT > 0) return;
    this.items.use(k, this.standings, dir);
  }

  /** Přeskočí průlet kamerou. */
  skipIntro() {
    if (this.phase === "intro") this.introT = 0;
  }

  step(dt: number) {
    const tr = this.track;
    this.clock += dt;
    if (this.phase === "intro") {
      this.introT -= dt;
      if (this.introT <= 0) this.phase = "countdown";
    } else if (this.phase === "countdown") {
      this.countT -= dt;
      const n = Math.ceil(this.countT);
      if (n !== this.lastCount && n >= 1 && n <= 3) {
        this.lastCount = n;
        tr.setLights(4 - n);
        this.L.countdown?.(n);
      }
      // turbo start: plyn až v poslední vteřině odpočtu; kdo drží plyn od začátku, přetočí motor
      for (const k of this.karts) {
        const gas = k.human && !this.autopilot.has(k.slot) ? k.input.gas > 0 : this.countT < 0.7 + this.r() * 0.6;
        if (gas) {
          if (k.gasFrom < 0) k.gasFrom = this.countT;
        } else k.gasFrom = -1;
      }
      if (this.countT <= 0) {
        this.phase = "running";
        this.time = 0;
        tr.setLights(4);
        for (const k of this.karts) {
          if (k.gasFrom < 0) continue;
          const bot = !k.human || this.autopilot.has(k.slot);
          if (k.gasFrom <= 1.0 && (!bot || this.r() < 0.4)) {
            k.boost(1.2);
            this.L.startBoost?.(k, true);
          } else if (k.gasFrom > 2.3 && !bot) {
            k.stallT = 0.9;
            this.L.startBoost?.(k, false);
          }
        }
        this.L.go?.();
      }
    } else {
      const before = this.time;
      this.time += dt;
      if (!this.attract && before < 2.5 && this.time >= 2.5) tr.setLights(0);
    }
    const canDrive = this.phase === "running" || this.phase === "over";
    const n = this.standings.length;

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
        if (out.useItem && canDrive && !k.finished) this.useItem(k, out.dir);
      }
      // všichni stejně rychlí (žádná skrytá „gumička“), po cíli se jen dojíždí
      k.speedMul = k.finished ? 0.75 : 1;
      if (k.stallT > 0 && Math.random() < 0.3) this.fx.smoke(k.x - Math.sin(k.heading) * 1.4, 0.7, k.z - Math.cos(k.heading) * 1.4, 0.4);
      k.step(dt, tr, tr.theme, canDrive, this.kev);
    }

    this.collide();

    const L = tr.length;
    for (const k of this.karts) {
      k.progress(tr);
      this.ramps(k);
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
    if (canDrive) this.slipstream(dt);

    this.items.update(dt, this.clock, this.karts, this.standings);
    this.events?.update(dt, this.clock, this.attract ? this.clock : this.time, this.karts, this.standings[0] ?? null, canDrive);

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

  /** Skokánky: najetí zvedá motokáru, z horní hrany vyletí. */
  private ramps(k: Kart) {
    const tr = this.track;
    let on = -1, f = 0;
    for (let i = 0; i < tr.ramps.length; i++) {
      const r = tr.ramps[i];
      let ds = k.proj.s - r.s0;
      if (ds < 0) ds += tr.length;
      if (ds <= r.len && Math.abs(k.proj.d - r.d) <= r.halfW && k.y <= r.h * (ds / r.len) + 0.35) {
        on = i;
        f = ds / r.len;
        break;
      }
    }
    if (on >= 0 && k.flyT <= 0) {
      const r = tr.ramps[on];
      k.y = r.h * f;
      k.wy = k.gy + k.y;
      k.vy = k.gv;
      k.onRamp = on;
      k.rampF = f;
    } else if (k.onRamp >= 0) {
      const r = tr.ramps[k.onRamp];
      k.onRamp = -1;
      if (k.rampF > 0.8 && k.vF > 6) {
        k.y = r.h;
        k.wy = k.gy + r.h;
        k.vy = 3 + Math.max(0, k.vF) * 0.22 + Math.max(0, k.gv);
        k.air = true;
        k.trickReady = true;
        k.trickDone = false;
        this.L.launch?.(k);
      }
    }
  }

  /** Závětří: jízda těsně za soupeřem nabíjí turbo. */
  private slipstream(dt: number) {
    for (const a of this.karts) {
      let drafting = false;
      if (a.vF > 15 && a.y < 0.3) {
        const fx = Math.sin(a.heading), fz = Math.cos(a.heading);
        for (const b of this.karts) {
          if (b === a) continue;
          const dx = b.x - a.x, dz = b.z - a.z;
          const fwd = dx * fx + dz * fz;
          if (fwd < 3 || fwd > 16) continue;
          if (Math.abs(dx * fz - dz * fx) < 2.4) {
            drafting = true;
            break;
          }
        }
      }
      if (drafting) {
        a.draftT += dt;
        if (a.draftT > 1.3) {
          a.draftT = 0;
          a.boost(1.0);
          this.L.boost?.(a, "draft");
        }
      } else a.draftT = Math.max(0, a.draftT - dt * 2);
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
        if (place <= 3) k.celebrateT = 4;
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
        const wa = a.weight, wb = b.weight;
        const sa = wb / (wa + wb), sb = wa / (wa + wb);
        a.x -= nx * pen * sa;
        a.z -= nz * pen * sa;
        b.x += nx * pen * sb;
        b.z += nz * pen * sb;
        const rel = (b.vx - a.vx) * nx + (b.vz - a.vz) * nz;
        if (rel < 0) {
          const J = (-1.5 * rel) / (1 / wa + 1 / wb);
          a.vx -= (J / wa) * nx;
          a.vz -= (J / wa) * nz;
          b.vx += (J / wb) * nx;
          b.vz += (J / wb) * nz;
          if (-rel > 4) this.L.bump?.(a, b, -rel);
        }
        // beranidlo roztočí, koho trkne
        if (a.ramT > 0 && b.ramT <= 0 && b.hit() === "hit") this.L.hit?.(b, a, "ram");
        else if (b.ramT > 0 && a.ramT <= 0 && a.hit() === "hit") this.L.hit?.(a, b, "ram");
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
          if (Math.random() > 0.5 + k.driftLevel * 0.15) continue;
          v3.copy(w);
          v.body.localToWorld(v3);
          fx.spark(v3.x, v3.y + 0.1, v3.z, SPARK[k.driftLevel], 3 + k.driftLevel * 2, 0.16 + k.driftLevel * 0.07);
        }
      }
      if (k.boostT > 0 || k.ramT > 0) {
        for (const e of v.exhaustLocal) {
          v3.copy(e);
          v.body.localToWorld(v3);
          fx.flame(v3.x, v3.y, v3.z, -Math.sin(k.heading) * 4, -Math.cos(k.heading) * 4, k.ramT > 0);
        }
      }
      if (k.ramT > 0 && Math.random() < 0.6) fx.spark(k.x, k.gy + 1 + Math.random(), k.z, 0xffc53d, 3, 0.3);
      if (k.flyT > 0 && Math.random() < 0.7) fx.spark(k.x, k.wy + 0.6, k.z, [0xffffff, 0x7cf3ff, 0xffd21f][Math.floor(Math.random() * 3)], 2, 0.22);
      if (k.draftT > 0.3 && Math.random() < 0.6) {
        const side = (Math.random() - 0.5) * 2.4;
        fx.spark(k.x + Math.cos(k.heading) * side, k.gy + 0.6 + Math.random(), k.z - Math.sin(k.heading) * side, 0xffffff, 1, 0.12);
      }
      if (k.offroad && sp > 6 && Math.random() < 0.5) {
        const w = v.wheelLocal[Math.random() < 0.5 ? 0 : 1];
        v3.copy(w);
        v.body.localToWorld(v3);
        fx.dust(v3.x, v3.z, th.dust, k.vx, k.vz, v3.y);
      }
      if (k.spinT > 0 && Math.random() < 0.3) fx.smoke(k.x, k.gy + 0.6, k.z, 0.9);
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

  get flying() {
    return this.items.flying;
  }

  /** Ladění: jak dobře bot řídí (1 = jako autopilot). */
  skillOf(k: Kart) {
    return this.brains.get(k)?.skill ?? 1;
  }

  /** Ladění: pošle letadlo hned. */
  forcePlane() {
    this.events?.spawn(this.standings[0] ?? null);
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
