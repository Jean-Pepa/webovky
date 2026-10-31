// Fyzika motokáry: „arkádový“ model s driftem, turbem, smykem a nárazy do bariér.
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
const HOP_V = 3.6;
const GRAVITY = 24;
const DRIFT_MIN = 9;
export const DRIFT_L1 = 0.95;
export const DRIFT_L2 = 2.1;

export interface Controls {
  steer: number;
  gas: number;
  brake: number;
  drift: boolean;
}

export interface KartEvents {
  wall(k: Kart, strength: number): void;
  driftLevel(k: Kart, level: number): void;
  boost(k: Kart, kind: "drift" | "pad" | "item"): void;
  hop(k: Kart): void;
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
  y = 0;
  vx = 0;
  vz = 0;
  vy = 0;
  heading = 0;
  /** dopředná rychlost z posledního kroku */
  vF = 0;
  /** násobek max. rychlosti (boti: obtížnost a „gumička“) */
  speedMul = 1;
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
  padCool = 0;
  hitCool = 0;
  offroad = false;

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

  private wheelSpin = 0;
  private yawVis = 0;
  private steerVis = 0;

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

  /** Postaví motokáru na místo a vynuluje stav. */
  placeAt(x: number, z: number, heading: number, track: Track) {
    this.x = x;
    this.z = z;
    this.y = this.vx = this.vz = this.vy = this.vF = 0;
    this.heading = heading;
    this.drifting = this.driftHeld = false;
    this.driftDir = this.driftT = this.driftLevel = 0;
    this.boostT = this.spinT = this.spinAngle = this.shieldT = this.padCool = this.hitCool = 0;
    this.item = null;
    this.itemN = this.rollT = 0;
    this.finished = false;
    this.finishTime = 0;
    this.lap = 0;
    this.lapStart = 0;
    this.bestLap = Infinity;
    this.wrongT = 0;
    this.proj.idx = -1;
    track.project(x, z, -1, this.proj);
    this.lastS = this.proj.s;
    this.dist = this.proj.s > track.length / 2 ? this.proj.s - track.length : this.proj.s;
    this.input = { steer: 0, gas: 0, brake: 0, drift: false };
  }

  step(dt: number, track: Track, theme: Theme, canDrive: boolean, ev: KartEvents) {
    const c = this.input;
    const active = canDrive && this.spinT <= 0;
    const steer = active ? clamp(c.steer, -1, 1) : 0;
    const gas = active ? clamp(c.gas, 0, 1) : 0;
    const brake = active && c.brake > 0 ? 1 : 0;

    this.boostT = Math.max(0, this.boostT - dt);
    this.shieldT = Math.max(0, this.shieldT - dt);
    this.padCool = Math.max(0, this.padCool - dt);
    this.hitCool = Math.max(0, this.hitCool - dt);
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

    this.offroad = Math.abs(this.proj.d) > track.hw + 0.9;
    let vmax = MAX_SPEED * this.speedMul;
    if (this.offroad && this.boostT <= 0) vmax *= theme.offroad;
    if (this.boostT > 0) vmax *= BOOST_MULT;
    if (this.drifting) vmax *= 0.98;

    if (gas > 0 && vF > -1 && vF < vmax) {
      vF = Math.min(vmax, vF + ACCEL * gas * (1 - (0.5 * Math.max(0, vF)) / vmax) * dt);
    }
    if (brake) {
      if (vF > 0.5) vF -= BRAKE * dt;
      else if (gas === 0) vF = Math.max(-REV_MAX, vF - REV_ACCEL * dt);
    }
    if (this.boostT > 0) vF = Math.min(vmax, vF + BOOST_ACCEL * dt);
    if (vF > vmax) vF = Math.max(vmax, vF - (this.offroad ? 30 : 9) * dt);
    if (gas === 0 && !brake) {
      const dec = (COAST + (this.spinT > 0 ? 16 : 0) + (this.offroad ? 4 : 0)) * dt;
      vF = Math.abs(vF) <= dec ? 0 : vF - Math.sign(vF) * dec;
    }
    if (vF < -REV_MAX) vF = -REV_MAX;

    const grip = (this.drifting ? DRIFT_GRIP : GRIP) * theme.grip * (this.spinT > 0 ? 0.25 : 1);
    vR *= Math.exp(-grip * dt);

    // drift: stisk = poskok, se zatočením se rozjede smyk; puštění dá turbo podle délky smyku
    const grounded = this.y <= 0 && this.vy <= 0;
    if (c.drift && active) {
      if (!this.driftHeld) {
        this.driftHeld = true;
        if (grounded) {
          this.vy = HOP_V;
          ev.hop(this);
        }
      }
      if (!this.drifting && Math.abs(steer) > 0.35 && vF > DRIFT_MIN) {
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
        const lvl = this.driftT > DRIFT_L2 ? 2 : this.driftT > DRIFT_L1 ? 1 : 0;
        if (lvl !== this.driftLevel) {
          this.driftLevel = lvl;
          ev.driftLevel(this, lvl);
        }
      }
    }

    let turn: number;
    if (this.drifting) {
      const tight = clamp(steer * this.driftDir, -1, 1);
      turn = -this.driftDir * (DRIFT_BASE + DRIFT_EXTRA * tight);
    } else {
      const sf = clamp(Math.abs(vF) / 6, 0, 1) * (1 - 0.28 * clamp(Math.abs(vF) / MAX_SPEED, 0, 1));
      turn = -steer * TURN * sf * (vF >= 0 ? 1 : -1);
    }
    if (this.spinT > 0) turn = 0;

    this.vx = fx * vF + rx * vR;
    this.vz = fz * vF + rz * vR;
    const dTheta = turn * dt;
    this.heading = wrapAngle(this.heading + dTheta);
    const trac = (this.drifting ? DRIFT_TRACTION : TRACTION) * (0.35 + 0.65 * theme.grip);
    const a = dTheta * trac, ca = Math.cos(a), sa = Math.sin(a);
    const nvx = this.vx * ca + this.vz * sa;
    const nvz = -this.vx * sa + this.vz * ca;
    this.vx = nvx;
    this.vz = nvz;
    this.vF = vF;

    if (!grounded) {
      this.vy -= GRAVITY * dt;
      this.y += this.vy * dt;
      if (this.y <= 0) {
        this.y = 0;
        this.vy = 0;
      }
    }

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
  }

  endDrift(reward: boolean, ev: KartEvents) {
    if (reward && this.driftLevel > 0) {
      this.boost(this.driftLevel === 2 ? 1.25 : 0.6);
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

  /** Zásah raketou nebo olejem. */
  hit(): "hit" | "shield" | "immune" {
    if (this.hitCool > 0 || this.spinT > 0) return "immune";
    if (this.shieldT > 0) {
      this.shieldT = 0;
      this.hitCool = 0.6;
      return "shield";
    }
    this.spinT = 1.25;
    this.hitCool = 1.8;
    this.drifting = false;
    this.driftDir = this.driftT = this.driftLevel = 0;
    this.boostT = 0;
    this.vx *= 0.45;
    this.vz *= 0.45;
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
    v.root.position.set(this.x, 0, this.z);
    v.root.rotation.y = this.heading;
    this.yawVis = damp(this.yawVis, this.drifting ? -this.driftDir * 0.42 : 0, 10, dt);
    this.steerVis = damp(this.steerVis, this.spinT > 0 ? 0 : clamp(this.input.steer, -1, 1), 14, dt);
    const sp = clamp(this.vF / MAX_SPEED, -1, 1.5);
    v.body.rotation.y = this.yawVis + this.spinAngle;
    v.body.rotation.z = -this.steerVis * 0.07 * Math.abs(sp) * (this.drifting ? 1.7 : 1);
    v.body.rotation.x = this.boostT > 0 ? -0.04 : 0;
    const rumble = this.offroad && Math.abs(this.vF) > 3 ? Math.sin(time * 42 + this.id) * 0.035 : 0;
    v.body.position.y = this.y + rumble;
    this.wheelSpin += (this.vF * dt) / 0.32;
    for (const s of v.spinners) s.rotation.x = this.wheelSpin;
    for (const p of v.steerPivots) p.rotation.y = -this.steerVis * 0.42;
    v.head.rotation.z = -this.steerVis * 0.15;
    v.head.rotation.y = this.spinT > 0 ? Math.sin(time * 30) * 0.4 : 0;
    const sh = 1 - Math.min(0.45, this.y * 0.9);
    v.shadow.scale.set(sh, sh, 1);
    v.shield.visible = this.shieldT > 0;
    if (v.shield.visible) {
      const pulse = 1 + Math.sin(time * 8) * 0.04;
      v.shield.scale.setScalar(pulse);
      (v.shield.material as { opacity: number }).opacity =
        this.shieldT < 1.5 && Math.sin(time * 30) > 0 ? 0.1 : 0.28;
    }
  }
}
