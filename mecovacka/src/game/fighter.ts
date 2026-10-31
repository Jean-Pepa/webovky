// Šermíř: poloha na molu, natočení meče (z ovladače), dopočet ruky a těla, čepel pro srážky,
// zásahy, odhoz, balancování na okraji a pád do vody.
import * as THREE from "three";
import type { CharacterDef } from "../shared/characters";
import { Puppet } from "./puppet";
import { BLADE_R, SwordVisual, Trail } from "./sword";
import type { SwordCtl } from "./controls";
import { clamp, damp, lerp, smoothstep } from "./util";

export type FighterState = "stand" | "fall" | "water";

export interface FighterStats {
  hits: number;
  blocks: number;
  counters: number;
  strong: number;
  /** nejrychlejší zásah (m/s) */
  best: number;
}

const UP = new THREE.Vector3(0, 1, 0);
const _v = new THREE.Vector3(), _v2 = new THREE.Vector3();
const _q = new THREE.Quaternion();

/** Tělo pro zásahy: koule hlavy, kapsle trupu a nohou (svět). */
export interface Body {
  head: THREE.Vector3;
  headR: number;
  torsoA: THREE.Vector3;
  torsoB: THREE.Vector3;
  torsoR: number;
  legsA: THREE.Vector3;
  legsB: THREE.Vector3;
  legsR: number;
}

export class Fighter {
  readonly group = new THREE.Group();
  readonly puppet: Puppet;
  readonly sword: SwordVisual;
  readonly trail: Trail;
  readonly char: CharacterDef | null;
  readonly name: string;
  ctl: SwordCtl;
  /** -1 = počítač, jinak slot hráče */
  slot: number;
  /** 0 = strana +Z (dívá se do −Z), 1 = strana −Z */
  side: 0 | 1;
  hand: "R" | "L" = "R";
  /** připevněný panák (nepadá, jen se kymácí) */
  anchored = false;

  // poloha na molu (svět)
  x = 0;
  z = 0;
  vz = 0;
  vx = 0;
  facing = 0;
  state: FighterState = "stand";
  private fallVel = new THREE.Vector3();
  private fallSpin = 0;
  private fallT = 0;
  waterT = 0;

  // časovače
  /** po zásahu: nemůže útočit ani krýt */
  stun = 0;
  /** po vykrytí soupeřem: odražený meč, nemůže krýt */
  stagger = 0;
  /** chvíle nezranitelnosti po zásahu */
  invuln = 0;
  hitAnim = 0;
  cheer = 0;
  /** tenhle švih už zasáhl (další zásah až po zpomalení) */
  spent = false;
  /** krok vpřed (dotahuje soupeře) */
  walkPhase = 0;
  walkAmt = 0;
  teeter = 0;
  guardBlend = 0;
  /** výchylka meče po nárazu (souřadnice šermíře) */
  private defAxis = new THREE.Vector3(1, 0, 0);
  private defAng = 0;
  wobble = 0;
  private wobbleV = 0;

  // meč (souřadnice šermíře)
  readonly qL = new THREE.Quaternion();
  readonly dirL = new THREE.Vector3();
  // meč (svět)
  readonly qW = new THREE.Quaternion();
  readonly hilt = new THREE.Vector3();
  readonly dir = new THREE.Vector3(0, 0, -1);
  readonly base = new THREE.Vector3();
  readonly tip = new THREE.Vector3();
  readonly prevHilt = new THREE.Vector3();
  readonly prevDir = new THREE.Vector3(0, 0, -1);
  readonly prevTip = new THREE.Vector3();
  readonly tipVel = new THREE.Vector3();
  /** rychlost špičky (m/s): okamžitá a vyhlazená */
  speed = 0;
  speedSm = 0;
  private hasPrev = false;
  private lastDt = 0;

  readonly body: Body = {
    head: new THREE.Vector3(),
    headR: 0.3,
    torsoA: new THREE.Vector3(),
    torsoB: new THREE.Vector3(),
    torsoR: 0.27,
    legsA: new THREE.Vector3(),
    legsB: new THREE.Vector3(),
    legsR: 0.2,
  };

  stats: FighterStats = { hits: 0, blocks: 0, counters: 0, strong: 0, best: 0 };
  /** natočení soupeřovy hlavy (kam se dívat) */
  lookAt: THREE.Vector3 | null = null;
  private shoulderL = new THREE.Vector3(0.29, 1.23, 0);
  private reachLen = 0.58;
  private t = Math.random() * 10;

  constructor(char: CharacterDef | null, name: string, ctl: SwordCtl, slot: number, side: 0 | 1) {
    this.char = char;
    this.name = name;
    this.ctl = ctl;
    this.slot = slot;
    this.side = side;
    this.puppet = new Puppet(char);
    this.group.add(this.puppet.root);
    this.sword = new SwordVisual(char);
    this.trail = new Trail(char ? char.main : 0xffe9a8);
    this.measure();
  }

  /** Poloha ramene a délka paže z modelu (souřadnice šermíře). */
  private measure() {
    this.group.position.set(0, 0, 0);
    this.group.quaternion.identity();
    this.group.updateMatrixWorld(true);
    this.puppet.shoulderWorld("R", this.shoulderL);
    this.reachLen = this.puppet.reach("R") * 0.97;
  }

  /** Postaví šermíře na místo (začátek kola). */
  place(z: number, facing: number) {
    this.z = z;
    this.x = 0;
    this.vz = this.vx = 0;
    this.facing = facing;
    this.state = "stand";
    this.stun = this.stagger = this.invuln = this.hitAnim = this.cheer = 0;
    this.spent = false;
    this.walkAmt = 0;
    this.teeter = 0;
    this.defAng = 0;
    this.fallT = 0;
    this.waterT = 0;
    this.wobble = this.wobbleV = 0;
    this.group.rotation.set(0, facing, 0);
    this.group.position.set(this.x, 0, this.z);
    this.hasPrev = false;
    this.trail.clear();
  }

  /** Směr „dopředu“ (k soupeři) ve světě. */
  forward(out = new THREE.Vector3()) {
    return out.set(-Math.sin(this.facing), 0, -Math.cos(this.facing));
  }

  /** Může útočit / krýt? */
  get canAct() {
    return this.state === "stand" && this.stun <= 0 && this.stagger <= 0;
  }
  get guarding() {
    return this.ctl.guard && this.state === "stand" && this.stun <= 0 && this.stagger <= 0;
  }

  /** Náraz do meče: vychýlí ho kolem osy (souřadnice šermíře) o úhel. */
  knockSword(axisL: THREE.Vector3, ang: number) {
    if (axisL.lengthSq() < 1e-6) return;
    this.defAxis.copy(axisL).normalize();
    this.defAng = ang;
  }

  /** Úder do panáka: kymácení. */
  wobbleKick(v: number) {
    this.wobbleV += v;
  }

  /** Model paže: kde je ruka (střed rukojeti) podle toho, kam meč míří. Souřadnice šermíře. */
  private gripTarget(d: THREE.Vector3, g: number, crouch: number, out: THREE.Vector3) {
    const sx = this.hand === "R" ? 1 : -1;
    const drop = crouch * 0.12;
    // útočný postoj: ruka před tělem, posouvá se se směrem meče
    const ax = sx * 0.17 + 0.2 * d.x;
    const ay = 1.0 + 0.27 * d.y - drop;
    const az = -0.33 + 0.15 * d.z;
    // kryt: střed čepele před tělem — svislý meč na hrudi, vodorovný nad hlavou
    const h = 1 - Math.abs(d.y);
    const cx = 0.1 * d.x + sx * 0.05;
    const cy = 1.22 + 0.32 * h - drop;
    const cz = -0.46;
    const gx = cx - d.x * 0.48, gy = cy - d.y * 0.48, gz = cz - d.z * 0.48;
    out.set(lerp(ax, gx, g), lerp(ay, gy, g), Math.min(-0.16, lerp(az, gz, g)));
    // dosah paže kolem ramene
    const sh = _v2.set(sx * Math.abs(this.shoulderL.x), this.shoulderL.y - drop, this.shoulderL.z);
    const off = out.sub(sh);
    const len = off.length();
    if (len > this.reachLen) off.multiplyScalar(this.reachLen / len);
    return off.add(sh);
  }

  /** Jeden krok: natočení meče, tělo, čepel ve světě. `opp` = soupeř (kam se dívat). */
  update(dt: number, now: number, opp: Fighter | null, waterY: number) {
    this.t += dt;
    this.lastDt = dt;
    this.ctl.update(dt, now);
    this.stun = Math.max(0, this.stun - dt);
    this.stagger = Math.max(0, this.stagger - dt);
    this.invuln = Math.max(0, this.invuln - dt);
    this.hitAnim = Math.max(0, this.hitAnim - dt * 2.2);
    this.defAng *= 1 - damp(this.stagger > 0 ? 3.5 : 7, dt);
    this.guardBlend += ((this.guarding ? 1 : 0) - this.guardBlend) * damp(16, dt);
    if (this.speedSm < 2.2) this.spent = false;
    // kymácení panáka (pružina)
    this.wobbleV += (-this.wobble * 60 - this.wobbleV * 5) * dt;
    this.wobble += this.wobbleV * dt;

    // poloha a pád
    if (this.state === "fall") {
      this.fallT += dt;
      this.fallVel.y -= 16 * dt;
      this.group.position.addScaledVector(this.fallVel, dt);
      this.fallSpin += dt * 2.6;
      // padá na záda (hlava jde dozadu)
      this.group.rotation.set(Math.min(1.9, this.fallSpin), this.facing, 0, "YXZ");
      if (this.group.position.y < waterY - 0.2) {
        this.state = "water";
        this.waterT = 0;
      }
    } else if (this.state === "water") {
      this.waterT += dt;
      const sink = Math.min(1, this.waterT * 1.6);
      this.group.position.y = lerp(this.group.position.y, waterY - 1.15 + Math.sin(this.waterT * 2.4) * 0.06, damp(4 * sink + 1, dt));
      this.group.position.addScaledVector(this.fallVel.setY(0), dt * Math.max(0, 1 - this.waterT));
      this.group.rotation.set(Math.sin(this.waterT * 1.7) * 0.12, this.facing + Math.sin(this.waterT * 0.8) * 0.3, Math.sin(this.waterT * 2.1) * 0.1, "YXZ");
    } else {
      this.group.position.set(this.x, 0, this.z);
      this.group.rotation.set(this.anchored ? this.wobble * 0.5 : 0, this.facing, this.anchored ? this.wobble * 0.3 : 0, "YXZ");
    }
    this.group.updateMatrixWorld(true);

    // natočení meče: ovladač + výchylka po nárazu
    this.qL.copy(this.ctl.q);
    if (this.defAng > 0.002) this.qL.premultiply(_q.setFromAxisAngle(this.defAxis, this.defAng));
    if (this.state !== "stand") {
      // při pádu meč mává
      this.qL.premultiply(_q.setFromAxisAngle(_v.set(1, 0, 0), Math.sin(this.t * 9) * 0.8));
    }
    this.dirL.set(0, 1, 0).applyQuaternion(this.qL);
    const crouch = this.state === "stand" ? 0.22 + this.guardBlend * 0.55 - this.hitAnim * 0.2 : 0;
    const gripL = this.gripTarget(this.dirL, this.guardBlend, crouch, _v);
    const gripW = this.group.localToWorld(gripL.clone());
    this.qW.copy(this.group.quaternion).multiply(this.qL);
    const sx = this.hand === "R" ? 1 : -1;
    const pole = new THREE.Vector3(sx * 0.75, -1, 0.45).normalize().applyQuaternion(this.group.quaternion);

    this.puppet.pose({
      t: this.t,
      crouch,
      lean: this.guardBlend * 0.12 - this.hitAnim * 0.3 + (this.state === "stand" ? 0.04 : 0),
      twist: clamp(-this.dirL.x * 0.65, -0.6, 0.6) * (this.state === "stand" ? 1 : 0),
      hit: this.hitAnim,
      teeter: this.teeter,
      flail: this.state === "fall" ? 1 : this.state === "water" ? 0.4 : 0,
      cheer: this.cheer,
      walk: this.walkPhase,
      walkAmt: this.walkAmt,
      look: this.lookAt ?? (opp ? opp.body.head : null),
      hand: this.hand,
      gripPos: gripW,
      gripQuat: this.qW,
      pole,
    });

    // meč ve skutečné ruce
    this.sword.root.position.copy(this.puppet.gripActual);
    this.sword.root.quaternion.copy(this.qW);
    this.prevHilt.copy(this.hilt);
    this.prevDir.copy(this.dir);
    this.prevTip.copy(this.tip);
    this.hilt.copy(this.puppet.gripActual);
    this.dir.set(0, 1, 0).applyQuaternion(this.qW);
    this.base.copy(this.hilt).addScaledVector(this.dir, this.sword.bladeStart);
    this.tip.copy(this.hilt).addScaledVector(this.dir, this.sword.length);
    if (!this.hasPrev || dt <= 0) {
      this.prevHilt.copy(this.hilt);
      this.prevDir.copy(this.dir);
      this.prevTip.copy(this.tip);
      this.hasPrev = true;
      this.tipVel.set(0, 0, 0);
    } else this.tipVel.subVectors(this.tip, this.prevTip).divideScalar(dt);
    this.speed = this.tipVel.length();
    this.speedSm += (this.speed - this.speedSm) * damp(this.speed > this.speedSm ? 30 : 9, dt);
    const trailBase = _v2.copy(this.hilt).addScaledVector(this.dir, this.sword.length * 0.45);
    this.trail.push(trailBase, this.tip, smoothstep(3.5, 11, this.speedSm));
    this.updateBody();
  }

  private updateBody() {
    const b = this.body;
    const hips = this.puppet.get("hips"), head = this.puppet.get("head");
    hips.getWorldPosition(b.torsoA);
    head.getWorldPosition(b.torsoB);
    const up = _v.set(0, 1, 0).applyQuaternion(head.getWorldQuaternion(_q));
    b.head.copy(b.torsoB).addScaledVector(up, 0.26);
    b.torsoA.addScaledVector(UP, 0.12);
    b.torsoB.addScaledVector(UP, -0.05);
    b.legsA.copy(this.group.position).addScaledVector(UP, 0.12);
    b.legsB.copy(b.torsoA).addScaledVector(UP, -0.1);
    if (this.state !== "stand") b.legsA.copy(b.legsB);
  }

  /** Spadne z mola (rychlost ve směru pádu). */
  fall(dirZ: number) {
    if (this.state !== "stand" || this.anchored) return;
    this.state = "fall";
    this.fallT = 0;
    this.fallSpin = 0;
    this.fallVel.set(this.vx * 0.5, 2.6, dirZ * Math.max(1.6, Math.abs(this.vz)));
    this.walkAmt = 0;
  }

  /** Bod na čepeli podle parametru 0 (záštita) … 1 (špička). */
  bladePoint(s: number, out: THREE.Vector3) {
    return out.copy(this.base).lerp(this.tip, s);
  }

  /** Rychlost bodu čepele (m/s) — 0 = záštita, 1 = špička. */
  speedAt(s: number) {
    if (this.lastDt <= 0) return 0;
    const pNow = _v.copy(this.base).lerp(this.tip, s);
    const pb = _v2.copy(this.prevHilt).addScaledVector(this.prevDir, this.sword.bladeStart + (this.sword.length - this.sword.bladeStart) * s);
    return pNow.distanceTo(pb) / this.lastDt;
  }

  /** Poloměr čepele pro srážky meč × meč (kryt je velkorysejší). */
  bladeRadius() {
    return BLADE_R + (this.guarding ? 0.11 : 0.015);
  }

  dispose() {
    this.group.removeFromParent();
    this.puppet.dispose();
    this.sword.dispose();
    this.trail.dispose();
  }
}
