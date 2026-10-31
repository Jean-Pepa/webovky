// Šílené události na trati: padající letadla s varováním, výbuchem a hořícími troskami.
import * as THREE from "three";
import type { Kart } from "./kart";
import type { Track } from "./track";
import type { Effects } from "./effects";
import { rng } from "./util";

export interface EventHooks {
  /** letadlo se objevilo, dopadne za `inS` sekund do bodu (x, y, z) */
  warn(x: number, y: number, z: number, inS: number): void;
  crash(x: number, y: number, z: number): void;
  hit(k: Kart): void;
}

interface Plane {
  mesh: THREE.Group;
  marker: THREE.Mesh;
  from: THREE.Vector3;
  to: THREE.Vector3;
  side: THREE.Vector3;
  t: number;
  dur: number;
}

interface Debris {
  mesh: THREE.Object3D;
  x: number;
  y: number;
  z: number;
  life: number;
}

const FLIGHT = 5;

function planeMesh() {
  const g = new THREE.Group();
  const white = new THREE.MeshLambertMaterial({ color: 0xf4f4f8, flatShading: true });
  const red = new THREE.MeshLambertMaterial({ color: 0xff4d6d, flatShading: true });
  const dark = new THREE.MeshLambertMaterial({ color: 0x2b2d42 });
  const body = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.1, 16, 10), white);
  body.rotation.x = Math.PI / 2;
  g.add(body);
  const nose = new THREE.Mesh(new THREE.ConeGeometry(1.4, 3, 10), red);
  nose.rotation.x = Math.PI / 2;
  nose.position.z = 9.5;
  g.add(nose);
  const wing = new THREE.Mesh(new THREE.BoxGeometry(20, 0.35, 3.2), white);
  wing.position.set(0, -0.3, 1);
  g.add(wing);
  for (const x of [-10, 10]) {
    const tip = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.4, 3.3), red);
    tip.position.set(x, -0.3, 1);
    g.add(tip);
  }
  const tail = new THREE.Mesh(new THREE.BoxGeometry(7, 0.3, 2), white);
  tail.position.set(0, 0.3, -7.2);
  g.add(tail);
  const fin = new THREE.Mesh(new THREE.BoxGeometry(0.3, 3.2, 2.4), red);
  fin.position.set(0, 1.8, -7.2);
  g.add(fin);
  for (const x of [-4.5, 4.5]) {
    const eng = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 2.6, 10), dark);
    eng.rotation.x = Math.PI / 2;
    eng.position.set(x, -1.0, 1.5);
    g.add(eng);
  }
  for (let i = 0; i < 6; i++) {
    const w = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.5, 0.7), new THREE.MeshBasicMaterial({ color: 0x7cf3ff }));
    w.position.set(1.38, 0.4, 5 - i * 2);
    g.add(w);
    const w2 = w.clone();
    w2.position.x = -1.38;
    g.add(w2);
  }
  return g;
}

function debrisMesh(r: () => number) {
  const mats = [0xf4f4f8, 0x2b2d42, 0xff4d6d, 0x8d8d9b].map((c) => new THREE.MeshLambertMaterial({ color: c, flatShading: true }));
  const g = new THREE.Group();
  const kind = Math.floor(r() * 3);
  const geo =
    kind === 0
      ? new THREE.BoxGeometry(3 + r() * 2, 0.3, 1.2 + r())
      : kind === 1
        ? new THREE.CylinderGeometry(0.8, 0.9, 2.5, 8)
        : new THREE.DodecahedronGeometry(0.9 + r() * 0.5, 0);
  const m = new THREE.Mesh(geo, mats[Math.floor(r() * mats.length)]);
  m.rotation.set(r() * 3, r() * 3, r() * 3);
  m.position.y = 0.5;
  g.add(m);
  return g;
}

export class PlaneEvents {
  readonly group = new THREE.Group();
  private planes: Plane[] = [];
  private debris: Debris[] = [];
  private craters: { mesh: THREE.Mesh; life: number }[] = [];
  private nextT: number;
  private r = rng((Date.now() & 0xffff) ^ 0xa1a1);
  private markerMat = new THREE.MeshBasicMaterial({ color: 0xff2a2a, transparent: true, opacity: 0.7, depthWrite: false, side: THREE.DoubleSide });
  private craterMat = new THREE.MeshBasicMaterial({ color: 0x1b1310, transparent: true, opacity: 0.8, depthWrite: false });
  private track: Track;
  private fx: Effects;
  private hooks: EventHooks;

  constructor(track: Track, fx: Effects, hooks: EventHooks) {
    this.track = track;
    this.fx = fx;
    this.hooks = hooks;
    this.nextT = 12 + this.r() * 8;
  }

  get debrisCount() {
    return this.debris.length;
  }

  get stats() {
    return { planes: this.planes.length, debris: this.debris.length, craters: this.craters.length };
  }

  /** Pošle letadlo hned (ladění) nebo na nejbližší místo před vedoucím. */
  spawn(leader: Kart | null) {
    const tr = this.track;
    if (!tr.planeSpots.length) return;
    const L = tr.length;
    let s = tr.planeSpots[Math.floor(this.r() * tr.planeSpots.length)];
    if (leader) {
      let best = Infinity;
      for (const sp of tr.planeSpots) {
        let ahead = sp - leader.proj.s;
        if (ahead < 0) ahead += L;
        const score = ahead < 90 ? ahead + L : ahead;
        if (score < best) {
          best = score;
          s = sp;
        }
      }
    }
    s += (this.r() - 0.5) * 30;
    const p = tr.pointAt(s, (this.r() - 0.5) * tr.hw * 1.1);
    const to = new THREE.Vector3(p.x, p.y, p.z);
    const a = this.r() * Math.PI * 2;
    const from = new THREE.Vector3(p.x + Math.cos(a) * 420, p.y + 150, p.z + Math.sin(a) * 420);
    const side = new THREE.Vector3(-Math.sin(a), 0, Math.cos(a)).multiplyScalar(60 * (this.r() < 0.5 ? -1 : 1));
    const mesh = planeMesh();
    mesh.position.copy(from);
    this.group.add(mesh);
    const marker = new THREE.Mesh(new THREE.RingGeometry(4, 6.5, 32), this.markerMat);
    marker.rotation.x = -Math.PI / 2;
    marker.position.set(p.x, p.y + 0.1, p.z);
    this.group.add(marker);
    this.planes.push({ mesh, marker, from, to, side, t: 0, dur: FLIGHT });
    this.hooks.warn(p.x, p.y, p.z, FLIGHT);
  }

  update(dt: number, time: number, raceTime: number, karts: Kart[], leader: Kart | null, racing: boolean) {
    if (racing && this.track.planeSpots.length && raceTime >= this.nextT) {
      this.nextT = raceTime + 24 + this.r() * 14;
      this.spawn(leader);
    }
    for (let i = this.planes.length - 1; i >= 0; i--) {
      const pl = this.planes[i];
      pl.t += dt;
      const u = Math.min(1, pl.t / pl.dur);
      const e = Math.pow(u, 1.7);
      const arc = Math.sin(u * Math.PI) * (1 - u);
      const pos = new THREE.Vector3().lerpVectors(pl.from, pl.to, e).addScaledVector(pl.side, arc);
      const ahead = new THREE.Vector3().lerpVectors(pl.from, pl.to, Math.min(1, Math.pow(Math.min(1, u + 0.02), 1.7)));
      pl.mesh.position.copy(pos);
      pl.mesh.lookAt(ahead.lengthSq() ? ahead : pl.to);
      pl.mesh.rotateZ(Math.sin(time * 3) * 0.3 + u * 1.2);
      this.fx.smoke(pos.x, pos.y, pos.z, 0.25);
      this.fx.flame(pos.x, pos.y - 1, pos.z, 0, 0, false);
      const pulse = 1 + Math.sin(time * 12) * 0.12;
      pl.marker.scale.setScalar(pulse * (1.4 - u * 0.4));
      if (u >= 1) {
        this.impact(pl.to, karts);
        this.group.remove(pl.mesh, pl.marker);
        this.planes.splice(i, 1);
      }
    }
    for (let i = this.debris.length - 1; i >= 0; i--) {
      const d = this.debris[i];
      d.life -= dt;
      if (Math.random() < 0.5) this.fx.fire(d.x, d.y + 0.6, d.z);
      let gone = d.life <= 0;
      if (!gone)
        for (const k of karts) {
          if (k.y > 1.2 || (k.x - d.x) ** 2 + (k.z - d.z) ** 2 > 2.4 ** 2) continue;
          if (k.hit() === "hit") this.hooks.hit(k);
          this.fx.burst(d.x, d.y + 0.6, d.z, [0x8d8d9b, 0xffb02e, 0x2b2d42], 20, 8, 0.5);
          gone = true;
          break;
        }
      if (gone) {
        this.group.remove(d.mesh);
        this.debris.splice(i, 1);
      }
    }
    for (let i = this.craters.length - 1; i >= 0; i--) {
      const c = this.craters[i];
      c.life -= dt;
      (c.mesh.material as THREE.MeshBasicMaterial).opacity = Math.min(0.8, c.life * 0.2);
      if (c.life <= 0) {
        this.group.remove(c.mesh);
        this.craters.splice(i, 1);
      }
    }
  }

  private impact(p: THREE.Vector3, karts: Kart[]) {
    const tr = this.track;
    this.fx.explosion(p.x, p.z, p.y, 2.2);
    this.fx.explosion(p.x + 3, p.z - 2, p.y, 1.4);
    this.fx.explosion(p.x - 2, p.z + 3, p.y, 1.4);
    this.hooks.crash(p.x, p.y, p.z);
    for (const k of karts) {
      if ((k.x - p.x) ** 2 + (k.z - p.z) ** 2 > 8 ** 2) continue;
      if (k.hit("bees") === "hit") this.hooks.hit(k);
    }
    const crater = new THREE.Mesh(new THREE.CircleGeometry(5.5, 20), this.craterMat.clone());
    crater.rotation.x = -Math.PI / 2;
    crater.position.set(p.x, p.y + 0.07, p.z);
    this.group.add(crater);
    this.craters.push({ mesh: crater, life: 16 });
    const pr = { idx: -1, s: 0, d: 0 };
    tr.project(p.x, p.z, -1, pr);
    for (let i = 0; i < 6; i++) {
      const s = pr.s + (this.r() - 0.5) * 22;
      const d = Math.max(-tr.hw, Math.min(tr.hw, pr.d + (this.r() - 0.5) * 12));
      const q = tr.pointAt(s, d);
      const m = debrisMesh(this.r);
      m.position.set(q.x, q.y, q.z);
      m.rotation.y = this.r() * 6;
      this.group.add(m);
      this.debris.push({ mesh: m, x: q.x, y: q.y, z: q.z, life: 14 + this.r() * 4 });
    }
  }
}
