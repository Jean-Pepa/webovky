// Věci na trati: krystaly (sebrání → losování věci), olej, raketa, štít, turbo.
import * as THREE from "three";
import type { ItemId } from "../shared/items";
import type { Kart } from "./kart";
import { KART_R } from "./kart";
import type { Track, Projection } from "./track";
import type { Effects } from "./effects";
import { clamp, pickWeighted, wrapAngle } from "./util";

export interface ItemEvents {
  pickup(k: Kart): void;
  gotItem(k: Kart, item: ItemId): void;
  used(k: Kart, item: ItemId): void;
  hit(k: Kart, by: Kart | null, kind: "rocket" | "oil"): void;
  blocked(k: Kart): void;
  explosion(x: number, z: number): void;
}

interface Crystal {
  x: number;
  z: number;
  mesh: THREE.Group;
  respawn: number;
}
interface Oil {
  x: number;
  z: number;
  mesh: THREE.Mesh;
  owner: Kart;
  safe: number;
  life: number;
}
interface Rocket {
  x: number;
  z: number;
  heading: number;
  owner: Kart;
  target: Kart | null;
  life: number;
  safe: number;
  mesh: THREE.Group;
  proj: Projection;
}

const ROLL_TIME = 1.1;
const ROCKET_SPEED = 46;
const TABLES: Record<string, { v: ItemId; w: number }[]> = {
  front: [
    { v: "oil", w: 45 },
    { v: "shield", w: 30 },
    { v: "turbo", w: 25 },
  ],
  mid: [
    { v: "turbo", w: 30 },
    { v: "rocket", w: 30 },
    { v: "oil", w: 22 },
    { v: "shield", w: 18 },
  ],
  back: [
    { v: "turbo3", w: 35 },
    { v: "rocket", w: 35 },
    { v: "turbo", w: 20 },
    { v: "shield", w: 10 },
  ],
};

export class Items {
  readonly group = new THREE.Group();
  private crystals: Crystal[] = [];
  private oils: Oil[] = [];
  private rockets: Rocket[] = [];
  private crystalMat: THREE.MeshPhongMaterial;
  private coreMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  private oilMat = new THREE.MeshPhongMaterial({
    color: 0x0d0b14,
    shininess: 120,
    specular: 0x8888aa,
    polygonOffset: true,
    polygonOffsetFactor: -3,
    polygonOffsetUnits: -12,
  });
  private track: Track;
  private fx: Effects;
  private ev: ItemEvents;

  constructor(track: Track, fx: Effects, ev: ItemEvents) {
    this.track = track;
    this.fx = fx;
    this.ev = ev;
    this.crystalMat = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      emissive: 0x6622aa,
      shininess: 90,
      transparent: true,
      opacity: 0.88,
      flatShading: true,
    });
    const shell = new THREE.OctahedronGeometry(0.95, 0);
    const core = new THREE.IcosahedronGeometry(0.38, 0);
    for (const p of track.itemSpots) {
      const g = new THREE.Group();
      const m = new THREE.Mesh(shell, this.crystalMat);
      m.scale.y = 1.25;
      g.add(m);
      g.add(new THREE.Mesh(core, this.coreMat));
      g.position.set(p.x, 1.25, p.z);
      this.group.add(g);
      this.crystals.push({ x: p.x, z: p.z, mesh: g, respawn: 0 });
    }
  }

  reset() {
    for (const c of this.crystals) {
      c.respawn = 0;
      c.mesh.visible = true;
      c.mesh.scale.setScalar(1);
    }
    for (const o of this.oils) this.group.remove(o.mesh);
    for (const r of this.rockets) this.group.remove(r.mesh);
    this.oils = [];
    this.rockets = [];
  }

  /** Vylosuje věc podle pořadí (0 = první, 1 = poslední). */
  roll(rank01: number): ItemId {
    const t = rank01 < 0.2 ? TABLES.front : rank01 < 0.6 ? TABLES.mid : TABLES.back;
    return pickWeighted(t, Math.random());
  }

  use(k: Kart, standings: Kart[]) {
    if (!k.item || k.rollT > 0) return;
    const item = k.item;
    const fx = Math.sin(k.heading), fz = Math.cos(k.heading);
    switch (item) {
      case "turbo":
        k.boost(1.5);
        k.item = null;
        break;
      case "turbo3":
        k.boost(1.5);
        k.itemN -= 1;
        if (k.itemN <= 0) k.item = null;
        break;
      case "shield":
        k.shieldT = 9;
        k.item = null;
        break;
      case "oil": {
        const x = k.x - fx * 2.9, z = k.z - fz * 2.9;
        const mesh = new THREE.Mesh(new THREE.CircleGeometry(1.75, 18), this.oilMat);
        mesh.rotation.x = -Math.PI / 2;
        mesh.rotation.z = Math.random() * 3;
        mesh.scale.set(1, 0.75 + Math.random() * 0.3, 1);
        mesh.position.set(x, 0.06, z);
        this.group.add(mesh);
        this.oils.push({ x, z, mesh, owner: k, safe: 1, life: 32 });
        k.item = null;
        break;
      }
      case "rocket": {
        const idx = standings.indexOf(k);
        const target = idx > 0 ? standings[idx - 1] : null;
        const mesh = this.rocketMesh();
        const r: Rocket = {
          x: k.x + fx * 2.4,
          z: k.z + fz * 2.4,
          heading: k.heading,
          owner: k,
          target: target && !target.finished ? target : null,
          life: 7,
          safe: 0.35,
          mesh,
          proj: { idx: k.proj.idx, s: 0, d: 0 },
        };
        this.group.add(mesh);
        this.rockets.push(r);
        k.item = null;
        break;
      }
    }
    if (!k.item) k.itemN = 0;
    this.ev.used(k, item);
  }

  private rocketMesh() {
    const g = new THREE.Group();
    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(0.22, 0.22, 1.2, 10),
      new THREE.MeshPhongMaterial({ color: 0xff3b4f, shininess: 80 }),
    );
    body.rotation.x = Math.PI / 2;
    g.add(body);
    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.45, 10), new THREE.MeshPhongMaterial({ color: 0xffffff }));
    nose.rotation.x = Math.PI / 2;
    nose.position.z = 0.82;
    g.add(nose);
    for (let i = 0; i < 4; i++) {
      const fin = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.42, 0.36), new THREE.MeshLambertMaterial({ color: 0xffd21f }));
      fin.position.z = -0.45;
      fin.rotation.z = (i * Math.PI) / 2;
      fin.translateY(0.25);
      g.add(fin);
    }
    g.position.y = 0.9;
    return g;
  }

  update(dt: number, time: number, karts: Kart[], standings: Kart[]) {
    const tr = this.track;
    // barva krystalů se přelévá
    this.crystalMat.color.setHSL((time * 0.25) % 1, 0.9, 0.62);
    this.crystalMat.emissive.setHSL((time * 0.25 + 0.5) % 1, 0.8, 0.22);

    for (const c of this.crystals) {
      if (c.respawn > 0) {
        c.respawn -= dt;
        if (c.respawn <= 0) {
          c.mesh.visible = true;
          c.mesh.scale.setScalar(0.01);
        }
        continue;
      }
      if (c.mesh.scale.x < 1) c.mesh.scale.setScalar(Math.min(1, c.mesh.scale.x + dt * 3));
      c.mesh.rotation.y = time * 1.6;
      c.mesh.position.y = 1.25 + Math.sin(time * 2.4 + c.x) * 0.15;
      for (const k of karts) {
        if ((k.x - c.x) ** 2 + (k.z - c.z) ** 2 > (KART_R + 1.0) ** 2) continue;
        c.mesh.visible = false;
        c.respawn = 2.5;
        this.fx.burst(c.x, 1.2, c.z, [0xff4d6d, 0xffd21f, 0x7cf3ff, 0x9b4dff, 0x3ccf4e], 26, 7, 0.45);
        if (!k.item && k.rollT <= 0) {
          k.rollT = ROLL_TIME;
          this.ev.pickup(k);
        }
        break;
      }
    }

    // losování věci
    const n = standings.length;
    for (const k of karts) {
      if (k.rollT <= 0) continue;
      k.rollT -= dt;
      if (k.rollT <= 0) {
        k.rollT = 0;
        const rank = n > 1 ? standings.indexOf(k) / (n - 1) : 0;
        k.item = this.roll(rank);
        k.itemN = k.item === "turbo3" ? 3 : 1;
        this.ev.gotItem(k, k.item);
      }
    }

    // olej
    for (let i = this.oils.length - 1; i >= 0; i--) {
      const o = this.oils[i];
      o.life -= dt;
      o.safe -= dt;
      let gone = o.life <= 0;
      if (!gone) {
        for (const k of karts) {
          if (k === o.owner && o.safe > 0) continue;
          if (k.y > 0.3) continue;
          if ((k.x - o.x) ** 2 + (k.z - o.z) ** 2 > 2.3 ** 2) continue;
          const res = k.hit();
          if (res === "immune") continue;
          if (res === "hit") this.ev.hit(k, o.owner === k ? null : o.owner, "oil");
          else this.ev.blocked(k);
          for (let s = 0; s < 10; s++) this.fx.smoke(o.x, 0.3, o.z, 0.15);
          gone = true;
          break;
        }
      }
      if (gone) {
        this.group.remove(o.mesh);
        o.mesh.geometry.dispose();
        this.oils.splice(i, 1);
      }
    }

    // rakety
    for (let i = this.rockets.length - 1; i >= 0; i--) {
      const r = this.rockets[i];
      r.life -= dt;
      r.safe -= dt;
      tr.project(r.x, r.z, r.proj.idx, r.proj, 24);
      let aimX: number, aimZ: number;
      const t = r.target;
      if (t && !t.finished && (t.x - r.x) ** 2 + (t.z - r.z) ** 2 < 32 ** 2) {
        aimX = t.x;
        aimZ = t.z;
      } else {
        const ai = (r.proj.idx + Math.round(14 / tr.ds)) % tr.n;
        const lat = t ? clamp(t.proj.d, -tr.hw * 0.7, tr.hw * 0.7) : clamp(r.proj.d, -tr.hw * 0.6, tr.hw * 0.6);
        aimX = tr.px[ai] + tr.rx[ai] * lat;
        aimZ = tr.pz[ai] + tr.rz[ai] * lat;
      }
      const want = Math.atan2(aimX - r.x, aimZ - r.z);
      const dh = clamp(wrapAngle(want - r.heading), -5.5 * dt, 5.5 * dt);
      r.heading = wrapAngle(r.heading + dh);
      r.x += Math.sin(r.heading) * ROCKET_SPEED * dt;
      r.z += Math.cos(r.heading) * ROCKET_SPEED * dt;
      r.mesh.position.set(r.x, 0.9, r.z);
      r.mesh.rotation.y = r.heading;
      this.fx.flame(r.x - Math.sin(r.heading) * 0.8, 0.9, r.z - Math.cos(r.heading) * 0.8, 0, 0, false);
      if (Math.random() < 0.5) this.fx.smoke(r.x, 0.9, r.z, 0.9);
      let boom = r.life <= 0 || Math.abs(r.proj.d) > tr.wallD - 0.4;
      if (!boom) {
        for (const k of karts) {
          if (k === r.owner && r.safe > 0) continue;
          if ((k.x - r.x) ** 2 + (k.z - r.z) ** 2 > (KART_R + 0.6) ** 2) continue;
          const res = k.hit();
          if (res === "hit") this.ev.hit(k, r.owner === k ? null : r.owner, "rocket");
          else if (res === "shield") this.ev.blocked(k);
          boom = true;
          break;
        }
      }
      if (boom) {
        this.fx.explosion(r.x, r.z);
        this.ev.explosion(r.x, r.z);
        this.group.remove(r.mesh);
        this.rockets.splice(i, 1);
      }
    }
  }
}
