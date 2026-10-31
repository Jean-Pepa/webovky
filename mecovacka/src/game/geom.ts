// Geometrie pro srážky: nejbližší body dvou úseček (čepel × čepel, čepel × tělo).
import * as THREE from "three";

const d1 = new THREE.Vector3(), d2 = new THREE.Vector3(), r = new THREE.Vector3();
const c1 = new THREE.Vector3(), c2 = new THREE.Vector3();

export interface SegHit {
  /** čtverec vzdálenosti */
  d2: number;
  /** parametr na první úsečce (0…1) */
  s: number;
  /** parametr na druhé úsečce (0…1) */
  t: number;
}

/** Nejbližší body úseček p0–p1 a q0–q1 (Ericson, Real-Time Collision Detection 5.1.9). */
export function segSeg(p0: THREE.Vector3, p1: THREE.Vector3, q0: THREE.Vector3, q1: THREE.Vector3, out: SegHit): SegHit {
  d1.subVectors(p1, p0);
  d2.subVectors(q1, q0);
  r.subVectors(p0, q0);
  const a = d1.dot(d1), e = d2.dot(d2), f = d2.dot(r);
  let s = 0, t = 0;
  const EPS = 1e-9;
  if (a <= EPS && e <= EPS) {
    s = t = 0;
  } else if (a <= EPS) {
    s = 0;
    t = Math.min(1, Math.max(0, f / e));
  } else {
    const c = d1.dot(r);
    if (e <= EPS) {
      t = 0;
      s = Math.min(1, Math.max(0, -c / a));
    } else {
      const b = d1.dot(d2);
      const denom = a * e - b * b;
      s = denom !== 0 ? Math.min(1, Math.max(0, (b * f - c * e) / denom)) : 0;
      t = (b * s + f) / e;
      if (t < 0) {
        t = 0;
        s = Math.min(1, Math.max(0, -c / a));
      } else if (t > 1) {
        t = 1;
        s = Math.min(1, Math.max(0, (b - c) / a));
      }
    }
  }
  c1.copy(p0).addScaledVector(d1, s);
  c2.copy(q0).addScaledVector(d2, t);
  out.d2 = c1.distanceToSquared(c2);
  out.s = s;
  out.t = t;
  return out;
}

/** Nejbližší bod úsečky a–b k bodu p: vrací parametr (0…1). */
export function segPointT(a: THREE.Vector3, b: THREE.Vector3, p: THREE.Vector3) {
  d1.subVectors(b, a);
  const l = d1.lengthSq();
  if (l < 1e-9) return 0;
  return Math.min(1, Math.max(0, r.subVectors(p, a).dot(d1) / l));
}
