// Fyzika motokáry: „arkádový“ model s driftem (3 stupně), turbem, skoky s triky,
// beranidlem, smykem a nárazy do bariér. Vlastnosti postav mění rychlost, zrychlení,
// ovladatelnost a váhu.
import type { CharacterDef } from "../shared/characters";
import type { ItemId } from "../shared/items";
import type { Track, Projection } from "./track";
import type { Theme } from "./themes";
import { buildKart, type KartVisual } from "./kart-model";
import { clamp, damp, wrapAngle } from "./util";

export const KART_R = 1.15;
export const MAX_SPEED = 27; // m/s ≈ 97 km/h
const ACCEL = 16;
const BRAKE = 30;
const REV_ACCEL = 12;
const REV_MAX = 9;
const COAST = 3.5;
const TURN = 2.1;
const DRIFT_BASE = 1.3;
const DRIFT_EXTRA = 0.75;
const GRIP = 9;
const DRIFT_GRIP = 3;
const TRACTION = 0.9;
const DRIFT_TRACTION = 0.55;
const BOOST_MULT = 1.4;
const BOOST_ACCEL = 34;
const RAM_MULT = 1.18;
const FLY_MULT = 1.3;
/** let s křídly: délka (s) a výška nad silnicí (m) */
export const FLY_TIME = 7.5;
const FLY_H = 7;
const HOP_V = 3.6;
export const GRAVITY = 24;
const DRIFT_MIN = 9;
/** časy driftu pro 1., 2. a 3. stupeň a délka turba za ně */
export const DRIFT_LEVELS = [0.9, 1.9, 3.0];
const DRIFT_BOOST = [0, 0.55, 1.0, 1.5];

export interface Controls {
  steer: number;
  gas: number;
  brake: number;
  drift: boolean;
}

export type HitKind = "spin" | "bees" | "ram";

export interface KartEvents {
  wall(k: Kart, strength: number): void;
  driftLevel(k: Kart, level: number): void;
  boost(k: Kart, kind: "drift" | "pad" | "item" | "trick" | "start" | "draft"): void;
  hop(k: Kart): void;
  trick(k: Kart): void;
  land(k: Kart): void;
}

export class Kart {
  readonly id: number;
  readonly char: CharacterDef;
  /** číslo hráče (0–3), boti mají -1 */
  readonly slot: number;
  readonly name: string;
  readonly visual: KartVisual;

  x = 0;
  z = 0;
  /** výška nad silnicí (0 = na zemi) */
  y = 0;
  /** výška silnice pod motokárou */
  gy = 0;
  /** výška v prostoru (gy + y) */
  wy = 0;
  /** svislá rychlost silnice pod motokárou (stoupání/klesání) */
  gv = 0;
  flyT = 0;
  vx = 0;
  vz = 0;
  vy = 0;
  heading = 0;
  /** dopředná rychlost z posledního kroku */
  vF = 0;
  /** násobek max. rychlosti (boti: obtížnost a „gumička“) */
  speedMul = 1;
  /** rychlostní třída závodu */
  classMul = 1;
  input: Controls = { steer: 0, gas: 0, brake: 0, drift: false };

  driftHeld = false;
  drifting = false;
  driftDir = 0;
  driftT = 0;
  driftLevel = 0;
  boostT = 0;
  spinT = 0;
  spinAngle = 0;
  shieldT = 0;
  ramT = 0;
  stallT = 0;
  padCool = 0;
  hitCool = 0;
  draftT = 0;
  offroad = false;
  /** ve vzduchu po skokánku */
  air = false;
  trickReady = false;
  trickDone = false;
  trickT = 0;
  onRamp = -1;
  rampF = 0;
  /** od kdy (čas odpočtu) drží plyn – pro turbo start */
  gasFrom = -1;

  item: ItemId | null = null;
  itemN = 0;
  rollT = 0;

  proj: Projection = { idx: -1, s: 0, d: 0 };
  lastS = 0;
  dist = 0;
  lap = 0;
  lapStart = 0;
  bestLap = Infinity;
  finished = false;
  finishTime = 0;
  place = 1;
  wrongT = 0;
  celebrateT = 0;

  private wheelSpin = 0;
  private pitchVis = 0;
  private yawVis = 0;
  private steerVis = 0;
  private rollVis = 0;

  constructor(id: number, char: CharacterDef, slot: number, name: string) {
    this.id = id;
    this.char = char;
    this.slot = slot;
    this.name = name;
    this.visual = buildKart(char, slot >= 0 ? name : null);
  }

  get human() {
    return this.slot >= 0;
  }

  get weight() {
    return this.char.stats.weight * (this.ramT > 0 ? 3 : 1);
  }

  /** Postaví motokáru na místo a vynuluje stav. */
  placeAt(x: number, z: number, heading: number, track: Track) {
    this.x = x;
    this.z = z;
    this.y = this.vx = this.vz = this.vy = this.vF = 0;
    this.heading = heading;
    this.drifting = this.driftHeld = false;
    this.driftDir = this.driftT = this.driftLevel = 0;
    this.boostT = this.spinT = this.spinAngle = this.shieldT = this.ramT = this.stallT = this.flyT = 0;
    this.padCool = this.hitCool = this.draftT = 0;
    this.air = this.trickReady = this.trickDone = false;
    this.trickT = 0;
    this.onRamp = -1;
    this.gasFrom = -1;
    this.item = null;
    this.itemN = this.rollT = 0;
    this.finished = false;
    this.finishTime = 0;
    this.lap = 0;
    this.lapStart = 0;
    this.bestLap = Infinity;
    this.wrongT = 0;
    this.celebrateT = 0;
    this.proj.idx = -1;
    track.project(x, z, -1, this.proj);
    this.gy = this.wy = track.heightAt(this.proj.s);
    this.gv = 0;
    this.lastS = this.proj.s;
    this.dist = this.proj.s > track.length / 2 ? this.proj.s - track.length : this.proj.s;
    this.input = { steer: 0, gas: 0, brake: 0, drift: false };
  }

  step(dt: number, track: Track, theme: Theme, canDrive: boolean, ev: KartEvents) {
    const c = this.input;
    const st = this.char.stats;
    const active = canDrive && this.spinT <= 0;
    const steer = active ? clamp(c.steer, -1, 1) : 0;
    const gas = active && this.stallT <= 0 ? clamp(c.gas, 0, 1) : 0;
    const brake = active && c.brake > 0 ? 1 : 0;

    this.boostT = Math.max(0, this.boostT - dt);
    this.shieldT = Math.max(0, this.shieldT - dt);
    this.ramT = Math.max(0, this.ramT - dt);
    this.stallT = Math.max(0, this.stallT - dt);
    this.padCool = Math.max(0, this.padCool - dt);
    this.hitCool = Math.max(0, this.hitCool - dt);
    this.trickT = Math.max(0, this.trickT - dt);
    this.celebrateT = Math.max(0, this.celebrateT - dt);
    if (this.spinT > 0) {
      this.spinT -= dt;
      this.spinAngle += dt * 12.5;
      if (this.spinT <= 0) {
        this.spinT = 0;
        this.spinAngle = 0;
      }
    }

    const fx = Math.sin(this.heading), fz = Math.cos(this.heading);
    const rx = -fz, rz = fx;
    let vF = this.vx * fx + this.vz * fz;
    let vR = this.vx * rx + this.vz * rz;

    const flying = this.flyT > 0;
    const airborne = (this.y > 0.25 && this.onRamp < 0) || flying;
    this.offroad = !airborne && Math.abs(this.proj.d) > track.hw + 0.9;
    let vmax = MAX_SPEED * this.speedMul * this.classMul * st.speed;
    if (this.offroad && this.boostT <= 0 && this.ramT <= 0) vmax *= theme.offroad;
    if (this.boostT > 0) vmax *= BOOST_MULT;
    if (this.ramT > 0) vmax *= RAM_MULT;
    if (flying) vmax *= FLY_MULT;
    if (this.drifting) vmax *= 0.98;
    const accel = ACCEL * st.accel * this.classMul;

    if (gas > 0 && vF > -1 && vF < vmax && (!airborne || flying)) {
      vF = Math.min(vmax, vF + accel * gas * (1 - (0.5 * Math.max(0, vF)) / vmax) * dt);
    }
    // do kopce zpomaluje, z kopce zrychluje
    if (!airborne && track.hasHeight) {
      const i0 = this.proj.idx < 0 ? 0 : this.proj.idx;
      const along = track.slopeAt(this.proj.s) * (fx * track.tx[i0] + fz * track.tz[i0]);
      vF -= GRAVITY * 0.5 * along * dt;
    }
    if (brake && !airborne) {
      if (vF > 0.5) vF -= BRAKE * dt;
      else if (gas === 0) vF = Math.max(-REV_MAX, vF - REV_ACCEL * dt);
    }
    if (this.boostT > 0 || this.ramT > 0 || flying) vF = Math.min(vmax, vF + BOOST_ACCEL * dt);
    if (vF > vmax) vF = Math.max(vmax, vF - (this.offroad ? 30 : 9) * dt);
    if (gas === 0 && !brake && !airborne) {
      const dec = (COAST + (this.spinT > 0 ? 16 : 0) + (this.offroad ? 4 : 0)) * dt;
      vF = Math.abs(vF) <= dec ? 0 : vF - Math.sign(vF) * dec;
    }
    if (vF < -REV_MAX) vF = -REV_MAX;

    const grip = (this.drifting ? DRIFT_GRIP : GRIP) * theme.grip * (this.spinT > 0 ? 0.25 : 1) * (airborne ? 0.2 : 1);
    vR *= Math.exp(-grip * dt);

    // drift (na zemi) a triky (ve vzduchu)
    const grounded = this.y <= 0.02 && !flying;
    if (c.drift && active) {
      if (!this.driftHeld) {
        this.driftHeld = true;
        if (airborne && this.trickReady) {
          this.trickReady = false;
          this.trickDone = true;
          this.trickT = 0.5;
          ev.trick(this);
        } else if (grounded) {
          this.vy = HOP_V + Math.max(0, this.gv);
          ev.hop(this);
        }
      }
      if (!this.drifting && !airborne && Math.abs(steer) > 0.35 && vF > DRIFT_MIN) {
        this.drifting = true;
        this.driftDir = Math.sign(steer);
        this.driftT = 0;
        this.driftLevel = 0;
      }
    } else {
      if (this.drifting) this.endDrift(active, ev);
      this.driftHeld = false;
    }
    if (this.drifting) {
      if (vF < DRIFT_MIN * 0.7 || !active) this.endDrift(false, ev);
      else {
        const tight = clamp(steer * this.driftDir, -1, 1);
        this.driftT += dt * (0.75 + 0.5 * Math.max(0, tight));
        let lvl = 0;
        for (const t of DRIFT_LEVELS) if (this.driftT > t) lvl++;
        if (lvl !== this.driftLevel) {
          this.driftLevel = lvl;
          ev.driftLevel(this, lvl);
        }
      }
    }

    let turn: number;
    if (this.drifting) {
      const tight = clamp(steer * this.driftDir, -1, 1);
      turn = -this.driftDir * (DRIFT_BASE + DRIFT_EXTRA * tight) * Math.sqrt(st.handling);
    } else {
      const sf = clamp(Math.abs(vF) / 6, 0, 1) * (1 - 0.28 * clamp(Math.abs(vF) / MAX_SPEED, 0, 1));
      turn = -steer * TURN * st.handling * sf * (vF >= 0 ? 1 : -1);
    }
    if (airborne && !flying) turn *= 0.5;
    if (this.spinT > 0) turn = 0;

    this.vx = fx * vF + rx * vR;
    this.vz = fz * vF + rz * vR;
    const dTheta = turn * dt;
    this.heading = wrapAngle(this.heading + dTheta);
    const trac = (this.drifting ? DRIFT_TRACTION : TRACTION) * (0.35 + 0.65 * theme.grip) * (airborne ? 0.6 : 1);
    const a = dTheta * trac, ca = Math.cos(a), sa = Math.sin(a);
    const nvx = this.vx * ca + this.vz * sa;
    const nvz = -this.vx * sa + this.vz * ca;
    this.vx = nvx;
    this.vz = nvz;
    this.vF = vF;

    this.x += this.vx * dt;
    this.z += this.vz * dt;

    // bariéry
    track.project(this.x, this.z, this.proj.idx, this.proj);
    const lim = track.wallD - KART_R;
    const d = this.proj.d;
    if (Math.abs(d) > lim) {
      const sg = Math.sign(d), i = this.proj.idx;
      const nx = track.rx[i] * sg, nz = track.rz[i] * sg;
      const pen = Math.abs(d) - lim;
      this.x -= nx * pen;
      this.z -= nz * pen;
      this.proj.d = sg * lim;
      const vn = this.vx * nx + this.vz * nz;
      if (vn > 0) {
        this.vx -= 1.35 * vn * nx;
        this.vz -= 1.35 * vn * nz;
        const keep = vn > 8 ? 0.8 : 0.96;
        this.vx *= keep;
        this.vz *= keep;
        if (vn > 4) {
          if (this.drifting) this.endDrift(false, ev);
          ev.wall(this, vn);
        }
      }
    }
    this.vertical(dt, track, ev);
  }

  /** Svislý pohyb v prostoru: silnice stoupá a klesá, na horizontu motokára vyletí. */
  private vertical(dt: number, track: Track, ev: KartEvents) {
    const gyNew = track.heightAt(this.proj.s);
    const gv = (gyNew - this.gy) / Math.max(1e-4, dt);
    if (this.flyT > 0) {
      this.flyT = Math.max(0, this.flyT - dt);
      const t = FLY_TIME - this.flyT;
      const lift = Math.min(1, t / 0.8) * Math.min(1, this.flyT / 1.1);
      const target = gyNew + FLY_H * lift;
      const nwy = this.wy + (target - this.wy) * Math.min(1, dt * 5);
      this.vy = (nwy - this.wy) / Math.max(1e-4, dt);
      this.wy = nwy;
      if (this.flyT <= 0) {
        this.air = true;
        this.trickReady = false;
      }
    } else if (this.onRamp < 0) {
      this.vy -= GRAVITY * dt;
      this.wy += this.vy * dt;
      if (this.wy <= gyNew) {
        this.wy = gyNew;
        if (this.vy < gv) this.vy = gv;
        if (this.air) {
          this.air = false;
          this.trickReady = false;
          if (this.trickDone) {
            this.trickDone = false;
            this.boost(0.8);
            ev.boost(this, "trick");
          }
          ev.land(this);
        }
      } else if (this.wy - gyNew > 0.7 && !this.air) {
        // vyletěl na horizontu → může udělat trik
        this.air = true;
        this.trickReady = true;
        this.trickDone = false;
      }
    }
    this.gy = gyNew;
    this.gv = gv;
    this.y = Math.max(0, this.wy - this.gy);
  }

  endDrift(reward: boolean, ev: KartEvents) {
    if (reward && this.driftLevel > 0) {
      this.boost(DRIFT_BOOST[this.driftLevel]);
      ev.boost(this, "drift");
    }
    this.drifting = false;
    this.driftDir = 0;
    this.driftT = 0;
    this.driftLevel = 0;
  }

  boost(t: number) {
    this.boostT = Math.max(this.boostT, t);
  }

  /** Zásah (raketa, kokos, olej, včely, beranidlo). */
  hit(kind: HitKind = "spin"): "hit" | "shield" | "immune" {
    if (this.ramT > 0 || this.flyT > 0 || this.hitCool > 0 || this.spinT > 0) return "immune";
    if (this.shieldT > 0) {
      this.shieldT = 0;
      this.hitCool = 0.6;
      return "shield";
    }
    this.spinT = kind === "bees" ? 1.7 : 1.25;
    this.hitCool = this.spinT + 0.6;
    this.drifting = false;
    this.driftDir = this.driftT = this.driftLevel = 0;
    this.boostT = 0;
    const keep = kind === "bees" ? 0.25 : 0.45;
    this.vx *= keep;
    this.vz *= keep;
    if (kind !== "spin" && this.y <= 0) this.vy = kind === "bees" ? 5 : 3.5;
    return "hit";
  }

  /** Posun po trati (po vyřešení srážek). */
  progress(track: Track) {
    track.project(this.x, this.z, this.proj.idx, this.proj);
    let ds = this.proj.s - this.lastS;
    const L = track.length;
    if (ds < -L / 2) ds += L;
    else if (ds > L / 2) ds -= L;
    this.lastS = this.proj.s;
    this.dist += ds;
  }

  updateVisual(dt: number, time: number) {
    const v = this.visual;
    v.root.position.set(this.x, this.gy, this.z);
    v.root.rotation.y = this.heading;
    this.yawVis = damp(this.yawVis, this.drifting ? -this.driftDir * 0.42 : 0, 10, dt);
    this.steerVis = damp(this.steerVis, this.spinT > 0 ? 0 : clamp(this.input.steer, -1, 1), 14, dt);
    const sp = clamp(this.vF / MAX_SPEED, -1, 1.5);
    // trik = otočka kolem podélné osy, oslava v cíli = poskakování
    if (this.trickT > 0) this.rollVis = (1 - this.trickT / 0.5) * Math.PI * 2;
    else this.rollVis = 0;
    v.body.rotation.y = this.yawVis + this.spinAngle;
    v.body.rotation.z = -this.steerVis * 0.07 * Math.abs(sp) * (this.drifting ? 1.7 : 1) + this.rollVis;
    const hf = Math.max(1, Math.abs(this.vF));
    const pitchT = this.flyT > 0 ? -0.08 : this.y > 0.25 ? Math.max(-0.4, Math.min(0.4, -Math.atan2(this.vy, hf))) : -Math.atan(this.gv / hf);
    this.pitchVis = damp(this.pitchVis, pitchT, 8, dt);
    v.body.rotation.x = this.pitchVis + (this.boostT > 0 ? -0.04 : 0);
    v.wings.visible = this.flyT > 0;
    if (v.wings.visible) {
      const flap = Math.sin(time * 14) * 0.25;
      v.wings.children[0].rotation.z = 0.25 + flap;
      v.wings.children[1].rotation.z = -0.25 - flap;
      v.wings.children[2].rotation.z += dt * 40;
    }
    const rumble = this.offroad && Math.abs(this.vF) > 3 ? Math.sin(time * 42 + this.id) * 0.035 : 0;
    const cheer = this.celebrateT > 0 ? Math.abs(Math.sin(time * 9)) * 0.45 : 0;
    v.body.position.y = this.y + rumble + cheer;
    this.wheelSpin += (this.vF * dt) / 0.32;
    for (const s of v.spinners) s.rotation.x = this.wheelSpin;
    for (const p of v.steerPivots) p.rotation.y = -this.steerVis * 0.42;
    v.head.rotation.z = -this.steerVis * 0.15;
    v.head.rotation.y = this.spinT > 0 ? Math.sin(time * 30) * 0.4 : this.celebrateT > 0 ? Math.sin(time * 6) * 0.5 : 0;
    const sh = 1 - Math.min(0.6, this.y * 0.12);
    v.shadow.scale.set(sh, sh, 1);
    v.shield.visible = this.shieldT > 0 || this.ramT > 0;
    if (v.shield.visible) {
      const m = v.shield.material as unknown as { opacity: number; color: { setHex(h: number): void } };
      const pulse = 1 + Math.sin(time * (this.ramT > 0 ? 16 : 8)) * 0.05;
      v.shield.scale.setScalar(pulse);
      m.color.setHex(this.ramT > 0 ? 0xffc53d : 0x7cf3ff);
      const left = this.ramT > 0 ? this.ramT : this.shieldT;
      m.opacity = left < 1.5 && Math.sin(time * 30) > 0 ? 0.1 : this.ramT > 0 ? 0.38 : 0.28;
    }
  }
}
