// Zdroje natočení meče: telefon (1:1 se senzory), myš na PC, počítač.
// Výstupem je vždy natočení meče v souřadnicích šermíře (dopředu = −Z, vpravo = +X, nahoru = +Y);
// meč má čepel v ose +Y, plochu kolmo na Z, ostří podél X (stejně jako telefon: horní hrana = špička).
import * as THREE from "three";
import type { SensorKind } from "../shared/protocol";
import { clamp, damp } from "./util";

export interface SwordCtl {
  /** natočení meče v souřadnicích šermíře */
  readonly q: THREE.Quaternion;
  /** drží KRYT */
  guard: boolean;
  /** úhlová rychlost meče (souřadnice šermíře), rad/s */
  readonly omega: THREE.Vector3;
  update(dt: number, now: number): void;
  /** „namiř na obrazovku“: srovná otočení kolem svislé osy */
  calibrate(): void;
  /** připravený ovladač (ví, kam míří) */
  readonly calibrated: boolean;
  /** dostává data */
  readonly live: boolean;
}

const Y = new THREE.Vector3(0, 1, 0);
/** zemské souřadnice telefonu (Z nahoru, Y sever) → souřadnice three.js (Y nahoru) */
const EARTH_TO_THREE = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2);
/** meč mířící dopředu (−Z) */
export const FORWARD = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2);

const _q = new THREE.Quaternion(), _q2 = new THREE.Quaternion(), _v = new THREE.Vector3();

/** Úhlová rychlost z rozdílu dvou natočení (svět), rad/s. */
function angVel(prev: THREE.Quaternion, cur: THREE.Quaternion, dt: number, out: THREE.Vector3) {
  const d = _q2.copy(cur).multiply(_q.copy(prev).invert());
  if (d.w < 0) d.set(-d.x, -d.y, -d.z, -d.w);
  const s = Math.sqrt(Math.max(0, 1 - d.w * d.w));
  const ang = 2 * Math.acos(clamp(d.w, -1, 1));
  if (s < 1e-6 || dt <= 0) return out.set(0, 0, 0);
  return out.set(d.x / s, d.y / s, d.z / s).multiplyScalar(ang / dt);
}

/** Otočí kvaternion o úhlovou rychlost × čas (ve světě). */
function integrate(q: THREE.Quaternion, w: THREE.Vector3, t: number, out: THREE.Quaternion) {
  const ang = w.length() * t;
  if (ang < 1e-6) return out.copy(q);
  _v.copy(w).normalize();
  return out.setFromAxisAngle(_v, ang).multiply(q);
}

/** Meč řízený telefonem. Vzorky chodí ~60× za sekundu; mezi nimi se natočení dopočítá. */
export class PhoneSword implements SwordCtl {
  readonly q = new THREE.Quaternion().copy(FORWARD);
  readonly omega = new THREE.Vector3();
  guard = false;
  calibrated = false;
  kind: SensorKind = "none";
  private raw = new THREE.Quaternion();
  private rawPrev = new THREE.Quaternion();
  private tsLast = -1;
  private arrived = -Infinity;
  private yaw = new THREE.Quaternion();
  private wWorld = new THREE.Vector3();
  private have = false;
  /** jak daleko dopředu odhadovat pohyb (s) — schová zpoždění sítě */
  lead = 0.012;

  get live() {
    return performance.now() - this.arrived < 1500;
  }

  /** Nový vzorek z telefonu (q = ze souřadnic telefonu do zemských). */
  sample(q: number[], g: boolean, ts: number, kind: SensorKind) {
    this.guard = g;
    this.kind = kind;
    if (!Array.isArray(q) || q.length < 4 || q.some((v) => typeof v !== "number" || !isFinite(v))) return;
    // neseřazený kanál: starší vzorek zahodíme (telefon po obnovení stránky začíná od nuly)
    if (ts <= this.tsLast && this.tsLast - ts < 5000) return;
    const cur = _q.set(q[0], q[1], q[2], q[3]);
    if (cur.lengthSq() < 0.5) return;
    cur.normalize();
    const next = new THREE.Quaternion().multiplyQuaternions(EARTH_TO_THREE, cur);
    if (this.have) {
      const dt = (ts - this.tsLast) / 1000;
      if (dt > 0.004 && dt < 0.12) {
        const w = angVel(this.raw, next, dt, new THREE.Vector3());
        // omezíme nesmysly (skok po výpadku)
        if (w.length() < 60) this.wWorld.lerp(w, 0.6);
      } else if (dt >= 0.12) this.wWorld.set(0, 0, 0);
    }
    this.rawPrev.copy(this.raw);
    this.raw.copy(next);
    this.tsLast = ts;
    this.arrived = performance.now();
    this.have = true;
  }

  calibrate() {
    if (!this.have) return;
    // kam míří horní hrana telefonu (čepel); při svislém držení bereme záda telefonu
    const b = _v.set(0, 1, 0).applyQuaternion(this.raw);
    let hx = b.x, hz = b.z;
    if (Math.hypot(hx, hz) < 0.35) {
      const back = new THREE.Vector3(0, 0, -1).applyQuaternion(this.raw);
      hx = back.x;
      hz = back.z;
    }
    if (Math.hypot(hx, hz) < 1e-3) return;
    // otočení kolem svislé osy, které pošle tento směr dopředu (−Z)
    const psi = Math.PI - Math.atan2(hx, hz);
    this.yaw.setFromAxisAngle(Y, psi);
    this.calibrated = true;
  }

  update(dt: number, now: number) {
    if (!this.have) return;
    const age = Math.max(0, (now - this.arrived) / 1000);
    // telefon zmlkl (zhasl, vypadla Wi-Fi): nedržet KRYT napořád
    if (age > 1.5) this.guard = false;
    // dopočet natočení: poslední vzorek + úhlová rychlost × (stáří + předstih), max. 45 ms
    const lead = clamp(age + this.lead, 0, 0.045);
    const pred = integrate(this.raw, this.wWorld, age > 0.2 ? 0 : lead, _q2);
    const target = new THREE.Quaternion().multiplyQuaternions(this.yaw, pred);
    // jemné vyhlazení chvění (téměř bez zpoždění)
    this.q.slerp(target, damp(55, dt));
    this.omega.copy(this.wWorld).applyQuaternion(this.yaw);
    if (age > 0.2) this.wWorld.multiplyScalar(1 - damp(8, dt));
  }
}

/** Meč na myši (ladění a hra bez telefonu): poloha myši = kam míří špička. */
export class MouseSword implements SwordCtl {
  readonly q = new THREE.Quaternion().copy(FORWARD);
  readonly omega = new THREE.Vector3();
  guard = false;
  readonly calibrated = true;
  readonly live = true;
  private nx = 0;
  private ny = 0.15;
  private prev = new THREE.Quaternion().copy(FORWARD);

  setPointer(nx: number, ny: number) {
    this.nx = clamp(nx, -1, 1);
    this.ny = clamp(ny, -1, 1);
  }

  update(dt: number) {
    const yaw = -this.nx * 1.45;
    const pitch = this.ny * 1.5;
    const target = new THREE.Quaternion()
      .setFromAxisAngle(Y, yaw)
      .multiply(_q.setFromAxisAngle(new THREE.Vector3(1, 0, 0), pitch))
      .multiply(FORWARD);
    this.prev.copy(this.q);
    this.q.slerp(target, damp(30, dt));
    if (dt > 0) angVel(this.prev, this.q, dt, this.omega);
  }

  calibrate() {}
}

/** Meč počítače: AI nastavuje cíl, meč se k němu otáčí omezenou rychlostí. */
export class AISword implements SwordCtl {
  readonly q = new THREE.Quaternion().copy(FORWARD);
  readonly omega = new THREE.Vector3();
  readonly target = new THREE.Quaternion().copy(FORWARD);
  guard = false;
  readonly calibrated = true;
  readonly live = true;
  /** max. úhlová rychlost (rad/s) */
  rate = 6;
  private prev = new THREE.Quaternion();

  update(dt: number) {
    this.prev.copy(this.q);
    this.q.rotateTowards(this.target, this.rate * dt);
    if (dt > 0) angVel(this.prev, this.q, dt, this.omega);
  }

  calibrate() {}
}

/** Natočení meče, který míří směrem `dir` (souřadnice šermíře); `flat` = kam má mířit plocha čepele. */
export function swordToward(dir: THREE.Vector3, flat = new THREE.Vector3(0, 0, 1), out = new THREE.Quaternion()) {
  const y = dir.clone().normalize();
  let x = new THREE.Vector3().crossVectors(y, flat);
  if (x.lengthSq() < 1e-4) x = new THREE.Vector3().crossVectors(y, new THREE.Vector3(1, 0, 0));
  x.normalize();
  const z = new THREE.Vector3().crossVectors(x, y).normalize();
  const m = new THREE.Matrix4().makeBasis(x, y, z);
  return out.setFromRotationMatrix(m);
}
