// Souboj na molu: srážky čepelí (kryt, střet), zásahy do těla, odhoz, okraj mola, pád, kola zápasu.
import * as THREE from "three";
import { ARENA } from "./arena";
import type { Fighter } from "./fighter";
import { segSeg, segPointT, type SegHit } from "./geom";
import { clamp, damp } from "./util";

/** Rychlost bodu čepele (m/s), od které je to švih (střet, kryt). */
export const V_SWING = 3.2;
/** Od této rychlosti zásah do těla počítá. */
export const V_HIT = 3.0;
/** Silná rána. */
export const V_STRONG = 10.5;
/** Rozestup šermířů (střed–střed). */
export const GAP = 1.72;

export type DuelPhase = "intro" | "ready" | "go" | "fight" | "point" | "over";
export type BodyPart = "head" | "torso" | "legs";

export interface HitInfo {
  p: THREE.Vector3;
  speed: number;
  strength: number;
  strong: boolean;
  counter: boolean;
  part: BodyPart;
}

export interface DuelEvents {
  hit(a: Fighter, b: Fighter, info: HitInfo): void;
  block(attacker: Fighter, defender: Fighter, p: THREE.Vector3): void;
  clash(a: Fighter, b: Fighter, p: THREE.Vector3, power: number): void;
  teeter(f: Fighter): void;
  fall(f: Fighter): void;
  splash(f: Fighter, p: THREE.Vector3): void;
  ready(f: Fighter): void;
  phase(p: DuelPhase): void;
  round(winner: Fighter | null, reason: "out" | "time"): void;
  over(winner: Fighter | null): void;
}

export interface DuelConfig {
  roundsToWin: number;
  roundTime: number;
  /** trénink: žádná kola, panák nepadá */
  training: boolean;
  /** přeskočit úvodní průlet */
  skipIntro: boolean;
}

const _hit: SegHit = { d2: 0, s: 0, t: 0 };
const pa0 = new THREE.Vector3(), pa1 = new THREE.Vector3(), pb0 = new THREE.Vector3(), pb1 = new THREE.Vector3();
const _v = new THREE.Vector3(), _v2 = new THREE.Vector3(), _q = new THREE.Quaternion();

export class Duel {
  readonly f: [Fighter, Fighter];
  readonly cfg: DuelConfig;
  private ev: DuelEvents;
  phase: DuelPhase = "intro";
  phaseT = 0;
  round = 1;
  score: [number, number] = [0, 0];
  timeLeft: number;
  readonly ready: [boolean, boolean] = [false, false];
  readonly hold: [number, number] = [0, 0];
  /** zpomalení času (rozhodující rána) */
  timeScale = 1;
  private slowT = 0;
  private presser: Fighter | null = null;
  private lastClash = -10;
  private teeterSaid: [boolean, boolean] = [false, false];
  roundWinner: Fighter | null = null;
  matchWinner: Fighter | null = null;
  /** čas souboje (s) */
  time = 0;
  private splashed = false;

  constructor(a: Fighter, b: Fighter, cfg: DuelConfig, ev: DuelEvents) {
    this.f = [a, b];
    a.side = 0;
    b.side = 1;
    this.cfg = cfg;
    this.ev = ev;
    this.timeLeft = cfg.roundTime;
    this.placeFighters();
    if (cfg.skipIntro) this.setPhase("ready");
    else this.setPhase("intro");
  }

  private placeFighters() {
    const [a, b] = this.f;
    a.place(GAP / 2, 0);
    b.place(-GAP / 2, Math.PI);
  }

  private setPhase(p: DuelPhase) {
    this.phase = p;
    this.phaseT = 0;
    if (p === "ready") {
      this.ready[0] = this.ready[1] = false;
      this.hold[0] = this.hold[1] = 0;
    }
    this.ev.phase(p);
  }

  /** Přeskočí úvodní průlet. */
  skip() {
    if (this.phase === "intro") this.setPhase("ready");
  }

  /** Další kolo (po mezihře). */
  private nextRound() {
    this.round++;
    this.timeLeft = this.cfg.roundTime;
    this.presser = null;
    this.teeterSaid = [false, false];
    this.splashed = false;
    this.roundWinner = null;
    this.placeFighters();
    this.setPhase("ready");
  }

  /** Hráč je připravený (počítač hned, člověk po podržení KRYTU s mečem k obrazovce). */
  private updateReady(dt: number) {
    for (let i = 0; i < 2; i++) {
      const f = this.f[i];
      if (this.ready[i]) continue;
      if (f.slot < 0) {
        this.ready[i] = true;
        continue;
      }
      if (f.ctl.guard && f.ctl.live) this.hold[i] += dt;
      else this.hold[i] = Math.max(0, this.hold[i] - dt * 2);
      if (this.hold[i] >= 0.5) {
        f.ctl.calibrate();
        this.ready[i] = true;
        this.ev.ready(f);
      }
    }
    if (this.ready[0] && this.ready[1]) this.setPhase("go");
  }

  step(dt: number, now: number) {
    this.time += dt;
    this.phaseT += dt;
    if (this.slowT > 0) {
      this.slowT -= dt / Math.max(0.05, this.timeScale);
      if (this.slowT <= 0) this.timeScale = 1;
    }
    const [a, b] = this.f;
    a.update(dt, now, b, ARENA.waterY);
    b.update(dt, now, a, ARENA.waterY);

    switch (this.phase) {
      case "intro":
        if (this.phaseT > 3.2) this.setPhase("ready");
        break;
      case "ready":
        this.updateReady(dt);
        break;
      case "go":
        if (this.phaseT > 1.1) this.setPhase("fight");
        break;
      case "fight":
        this.combat(now);
        this.move(dt);
        if (!this.cfg.training) {
          this.timeLeft -= dt;
          if (this.timeLeft <= 0) this.timeUp();
        }
        break;
      case "point":
        this.move(dt);
        this.watchSplash();
        if (this.phaseT > 3.4) {
          if (this.matchWinner) this.setPhase("over");
          else this.nextRound();
        }
        break;
      case "over":
        this.watchSplash();
        break;
    }
  }

  private watchSplash() {
    for (const f of this.f) {
      if (f.state === "water" && !this.splashed) {
        this.splashed = true;
        this.ev.splash(f, f.group.position.clone().setY(ARENA.waterY));
      }
    }
  }

  // ------------------------------------------------------------ pohyb po molu

  /** Kolik místa má šermíř za zády k okraji. */
  edgeRoom(f: Fighter) {
    return f.side === 0 ? ARENA.halfLen - f.z : f.z + ARENA.halfLen;
  }

  private move(dt: number) {
    const [a, b] = this.f;
    for (const f of this.f) {
      if (f.state !== "stand") continue;
      // tření
      const fr = ARENA.friction * dt;
      if (Math.abs(f.vz) <= fr) f.vz = 0;
      else f.vz -= Math.sign(f.vz) * fr;
    }
    const gap = a.z - b.z;
    // dotahování: kdo naposledy zasáhl, jde za soupeřem
    for (const f of this.f) {
      if (f.state !== "stand" || this.phase !== "fight" || f.anchored) {
        f.walkAmt = Math.max(0, f.walkAmt - dt * 4);
        continue;
      }
      const other = f === a ? b : a;
      const toward = f.side === 0 ? -1 : 1;
      let want = 0;
      if (gap > GAP + 0.06 && Math.abs(other.vz) < 1.2 && (this.presser === f || (!this.presser && gap > GAP + 0.4))) want = 1.7;
      else if (gap < GAP - 0.35) want = -0.9;
      if (f.stun > 0 || f.stagger > 0) want = Math.min(want, 0);
      if (want !== 0 && Math.abs(f.vz) < 1.8) {
        f.z += toward * want * dt;
        f.walkPhase += dt * 9 * Math.sign(want);
        f.walkAmt = Math.min(1, f.walkAmt + dt * 5);
      } else f.walkAmt = Math.max(0, f.walkAmt - dt * 4);
    }
    for (const f of this.f) {
      if (f.state !== "stand") continue;
      if (f.anchored) {
        f.vz = 0;
        continue;
      }
      f.z += f.vz * dt;
      const room = this.edgeRoom(f);
      const i = f.side;
      if (room < -0.05 && !this.cfg.training) {
        f.fall(f.side === 0 ? 1 : -1);
        this.ev.fall(f);
        if (this.phase === "fight") this.roundOver(f === a ? b : a, "out");
      } else if (room < 0.45) {
        f.teeter = clamp(1 - room / 0.45, 0, 1) * (Math.abs(f.vz) < 0.8 ? 1 : 0.4);
        if (!this.teeterSaid[i] && room < 0.3 && Math.abs(f.vz) < 0.4) {
          this.teeterSaid[i] = true;
          this.ev.teeter(f);
        }
      } else {
        f.teeter = Math.max(0, f.teeter - dt * 3);
        if (room > 0.8) this.teeterSaid[i] = false;
      }
      if (this.cfg.training) f.z = clamp(f.z, -ARENA.halfLen + 0.3, ARENA.halfLen - 0.3);
    }
    // nikdy se neprostoupí
    if (a.state === "stand" && b.state === "stand" && a.z - b.z < 0.9) {
      const mid = (a.z + b.z) / 2;
      a.z = mid + 0.45;
      b.z = mid - 0.45;
    }
  }

  private timeUp() {
    const [a, b] = this.f;
    const ra = this.edgeRoom(a), rb = this.edgeRoom(b);
    const w = Math.abs(ra - rb) < 0.25 ? null : ra > rb ? a : b;
    this.roundOver(w, "time");
  }

  private roundOver(winner: Fighter | null, reason: "out" | "time") {
    if (this.phase !== "fight") return;
    this.roundWinner = winner;
    if (winner) {
      this.score[winner.side]++;
      winner.cheer = 1;
      if (this.score[winner.side] >= this.cfg.roundsToWin) this.matchWinner = winner;
    }
    if (reason === "out") {
      this.timeScale = 0.3;
      this.slowT = 0.9;
    }
    this.setPhase("point");
    this.ev.round(winner, reason);
    if (this.matchWinner) this.ev.over(this.matchWinner);
  }

  // ------------------------------------------------------------ srážky

  private combat(now: number) {
    const [a, b] = this.f;
    if (a.state !== "stand" || b.state !== "stand") return;
    const N = 6;
    let bladesDone = now - this.lastClash < 0.22;
    let hitA = false, hitB = false;
    for (let s = 1; s <= N; s++) {
      const u = s / N;
      pa0.lerpVectors(a.prevHilt, a.hilt, u).addScaledVector(_v.lerpVectors(a.prevDir, a.dir, u).normalize(), a.sword.bladeStart);
      pa1.lerpVectors(a.prevHilt, a.hilt, u).addScaledVector(_v, a.sword.length);
      pb0.lerpVectors(b.prevHilt, b.hilt, u).addScaledVector(_v2.lerpVectors(b.prevDir, b.dir, u).normalize(), b.sword.bladeStart);
      pb1.lerpVectors(b.prevHilt, b.hilt, u).addScaledVector(_v2, b.sword.length);
      if (!bladesDone) {
        segSeg(pa0, pa1, pb0, pb1, _hit);
        const r = a.bladeRadius() + b.bladeRadius();
        if (_hit.d2 < r * r) {
          const p = new THREE.Vector3().lerpVectors(pa0, pa1, _hit.s).lerp(new THREE.Vector3().lerpVectors(pb0, pb1, _hit.t), 0.5);
          if (this.blades(a, b, _hit.s, _hit.t, p, now)) {
            bladesDone = true;
            // meč, který narazil, už tělo nezasáhne
            break;
          }
          bladesDone = true;
        }
      }
      if (!hitA && this.tryHit(a, b, pa0, pa1)) hitA = true;
      if (!hitB && this.tryHit(b, a, pb0, pb1)) hitB = true;
      if (hitA || hitB) break;
    }
  }

  /** Čepel o čepel. Vrací true, když z toho byla událost (kryt / střet). */
  private blades(a: Fighter, b: Fighter, sa: number, sb: number, p: THREE.Vector3, now: number): boolean {
    const va = a.speedAt(sa), vb = b.speedAt(sb);
    const ga = a.guarding, gb = b.guarding;
    this.lastClash = now;
    if (gb && va > V_SWING && !ga && a.canAct) {
      this.block(a, b, p);
      return true;
    }
    if (ga && vb > V_SWING && !gb && b.canAct) {
      this.block(b, a, p);
      return true;
    }
    if (va > V_SWING && vb > V_SWING) {
      // střet: oba švihy proti sobě
      const power = clamp((va + vb) / 24, 0.3, 1);
      this.bounce(a, 0.9 * power, 0.28);
      this.bounce(b, 0.9 * power, 0.28);
      a.vz += this.back(a) * 0.9 * power;
      b.vz += this.back(b) * 0.9 * power;
      a.spent = b.spent = true;
      this.ev.clash(a, b, p, power);
      return true;
    }
    if (va > V_SWING || vb > V_SWING) {
      // švih narazil do stojícího meče: rychlejší odskočí méně, stojící meč odletí stranou
      const [mover, idle] = va > vb ? [a, b] : [b, a];
      this.bounce(mover, 0.55, 0);
      this.bounce(idle, 0.7, 0, mover);
      mover.spent = true;
      this.ev.clash(mover, idle, p, 0.45);
      return true;
    }
    this.lastClash = now - 0.15;
    return false;
  }

  /** Směr „dozadu“ pro šermíře (svět, osa Z). */
  private back(f: Fighter) {
    return f.side === 0 ? 1 : -1;
  }

  /** Odrazí meč proti směru jeho švihu (nebo ve směru švihu jiného meče). */
  private bounce(f: Fighter, ang: number, stagger: number, by: Fighter | null = null) {
    const inv = _q.copy(f.group.quaternion).invert();
    const vel = _v.copy((by ?? f).tipVel).applyQuaternion(inv);
    if (!by) vel.negate();
    const dir = _v2.copy(f.dir).applyQuaternion(inv);
    const axis = new THREE.Vector3().crossVectors(dir, vel);
    if (axis.lengthSq() < 1e-6) axis.set(1, 0, 0);
    f.knockSword(axis, ang);
    if (stagger > 0) f.stagger = Math.max(f.stagger, stagger);
  }

  private block(att: Fighter, def: Fighter, p: THREE.Vector3) {
    this.bounce(att, 1.25, 0.72);
    this.bounce(def, 0.25, 0, att);
    att.spent = true;
    att.vz += this.back(att) * 0.8;
    def.vz += this.back(def) * 0.55;
    def.stats.blocks++;
    this.ev.block(att, def, p);
  }

  /** Čepel útočníka proti tělu obránce. */
  private tryHit(att: Fighter, def: Fighter, p0: THREE.Vector3, p1: THREE.Vector3): boolean {
    if (!att.canAct || att.spent || def.invuln > 0 || def.state !== "stand") return false;
    const B = def.body;
    let best: { part: BodyPart; s: number; d: number } | null = null;
    const r = 0.05;
    // hlava
    {
      const s = segPointT(p0, p1, B.head);
      const d = _v.lerpVectors(p0, p1, s).distanceTo(B.head);
      if (d < B.headR + r) best = { part: "head", s, d };
    }
    for (const [part, A, C, R] of [
      ["torso", B.torsoA, B.torsoB, B.torsoR],
      ["legs", B.legsA, B.legsB, B.legsR],
    ] as const) {
      segSeg(p0, p1, A, C, _hit);
      const d = Math.sqrt(_hit.d2);
      if (d < R + r && (!best || d < best.d)) best = { part, s: _hit.s, d };
    }
    if (!best) return false;
    const speed = att.speedAt(best.s);
    if (speed < V_HIT) return false;
    const p = new THREE.Vector3().lerpVectors(p0, p1, best.s);
    this.hit(att, def, p, speed, best.part);
    return true;
  }

  private hit(att: Fighter, def: Fighter, p: THREE.Vector3, speed: number, part: BodyPart) {
    const strength = clamp((speed - V_HIT) / (V_STRONG - V_HIT), 0, 1);
    const strong = speed >= V_STRONG;
    const counter = def.stagger > 0;
    const pa = att.char?.stats.power ?? 1, wd = def.char?.stats.weight ?? 1.15;
    let push = (1.5 + 2.3 * strength) * (pa / wd) * (counter ? 1.35 : 1) * (part === "head" ? 1.1 : part === "legs" ? 0.85 : 1);
    push = Math.min(push, 4.4);
    if (this.cfg.training) {
      def.wobbleKick(push * 0.9);
      push = 0;
    }
    def.vz += this.back(def) * push;
    def.stun = 0.42;
    def.stagger = 0;
    def.invuln = 0.32;
    def.hitAnim = 1;
    this.bounce(def, 0.35, 0, att);
    att.spent = true;
    att.stats.hits++;
    att.stats.best = Math.max(att.stats.best, speed);
    if (strong) att.stats.strong++;
    if (counter) att.stats.counters++;
    this.presser = att;
    this.ev.hit(att, def, { p, speed, strength, strong, counter, part });
  }

  /** Vyhlazený „výkon“ švihu pro zvuk (0…1). */
  static swingLevel(f: Fighter) {
    return clamp((f.speedSm - 2.5) / 12, 0, 1);
  }

  /** Plynulý pohyb kamery ve fázi „point“ apod. */
  static ease(cur: number, want: number, rate: number, dt: number) {
    return cur + (want - cur) * damp(rate, dt);
  }
}
