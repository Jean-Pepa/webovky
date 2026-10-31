// Věci na trati: krystaly (sebrání → losování věci), olej (vylít / hodit), kokos (odráží se),
// raketa (navádí se dopředu i dozadu), roj včel (na vedoucího), štít, beranidlo a turbo.
import * as THREE from "three";
import type { ItemId } from "../shared/items";
import { ITEMS } from "../shared/items";
import type { Kart, HitKind } from "./kart";
import { KART_R } from "./kart";
import type { Track, Projection } from "./track";
import type { Effects } from "./effects";
import { clamp, pickWeighted, wrapAngle } from "./util";

export type HitBy = "rocket" | "oil" | "coconut" | "bees" | "ram";

export interface ItemEvents {
  pickup(k: Kart): void;
  gotItem(k: Kart, item: ItemId): void;
  used(k: Kart, item: ItemId, dir: number): void;
  hit(k: Kart, by: Kart | null, kind: HitBy): void;
  blocked(k: Kart): void;
  explosion(x: number, z: number): void;
  bounce(x: number, z: number): void;
  bees(target: Kart): void;
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
interface Proj {
  kind: "rocket" | "coconut" | "flask" | "bees";
  x: number;
  z: number;
  y: number;
  vy: number;
  heading: number;
  speed: number;
  owner: Kart;
  target: Kart | null;
  life: number;
  safe: number;
  bounces: number;
  mesh: THREE.Group;
  proj: Projection;
  t: number;
}

const ROLL_TIME = 1.1;
const TABLES: { v: ItemId; w: number }[][] = [
  // vedoucí
  [
    { v: "oil", w: 38 },
    { v: "coconut", w: 30 },
    { v: "shield", w: 22 },
    { v: "turbo", w: 10 },
  ],
  // přední polovina
  [
    { v: "coconut", w: 26 },
    { v: "oil", w: 20 },
    { v: "rocket", w: 20 },
    { v: "turbo", w: 20 },
    { v: "shield", w: 14 },
  ],
  // zadní polovina
  [
    { v: "rocket", w: 28 },
    { v: "turbo", w: 22 },
    { v: "turbo3", w: 16 },
    { v: "coconut", w: 14 },
    { v: "shield", w: 8 },
    { v: "bees", w: 7 },
    { v: "ram", w: 5 },
  ],
  // poslední
  [
    { v: "turbo3", w: 28 },
    { v: "rocket", w: 22 },
    { v: "ram", w: 20 },
    { v: "bees", w: 16 },
    { v: "turbo", w: 14 },
  ],
];

export class Items {
  readonly group = new THREE.Group();
  private crystals: Crystal[] = [];
  private oils: Oil[] = [];
  private projs: Proj[] = [];
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

  /** Počet letících věcí (pro test). */
  get flying() {
    return this.projs.length;
  }

  get beesActive() {
    return this.projs.some((p) => p.kind === "bees");
  }

  /** Vylosuje věc podle pořadí (0 = první, 1 = poslední). */
  roll(rank01: number, players: number): ItemId {
    const t = players <= 1 ? TABLES[1] : rank01 <= 0.001 ? TABLES[0] : rank01 < 0.5 ? TABLES[1] : rank01 < 0.99 ? TABLES[2] : TABLES[3];
    let id = pickWeighted(t, Math.random());
    if (id === "bees" && this.beesActive) id = "rocket";
    return id;
  }

  /** Použije věc. dir: 1 = dopředu, -1 = za sebe, 0 = výchozí směr věci. */
  use(k: Kart, standings: Kart[], dir: number) {
    if (!k.item || k.rollT > 0) return;
    const item = k.item;
    const d = dir === 0 ? ITEMS[item].dir || 1 : Math.sign(dir);
    const fx = Math.sin(k.heading), fz = Math.cos(k.heading);
    const spd = Math.max(0, k.vF);
    switch (item) {
      case "turbo":
        k.boost(1.5);
        break;
      case "turbo3":
        k.boost(1.5);
        k.itemN -= 1;
        break;
      case "shield":
        k.shieldT = 9;
        break;
      case "ram":
        k.ramT = 6.5;
        k.boost(0.5);
        break;
      case "oil":
        if (d < 0) this.addOil(k.x - fx * 2.9, k.z - fz * 2.9, k);
        else this.launch("flask", k, k.heading, 26 + spd * 0.6, 1.1, null);
        break;
      case "coconut":
        this.launch("coconut", k, d > 0 ? k.heading : wrapAngle(k.heading + Math.PI), d > 0 ? 38 + spd * 0.3 : 30, 0.55, null);
        break;
      case "rocket": {
        const i = standings.indexOf(k);
        const target = d > 0 ? (i > 0 ? standings[i - 1] : null) : i < standings.length - 1 ? standings[i + 1] : null;
        this.launch("rocket", k, d > 0 ? k.heading : wrapAngle(k.heading + Math.PI), 46, 0.9, target && !target.finished ? target : null);
        break;
      }
      case "bees": {
        const leader = standings.find((s) => !s.finished) ?? null;
        const target = leader === k ? standings.find((s) => s !== k && !s.finished) ?? null : leader;
        if (target) {
          this.launch("bees", k, k.heading, 50, 3.2, target);
          this.ev.bees(target);
        }
        break;
      }
    }
    if (item !== "turbo3" || k.itemN <= 0) {
      k.item = null;
      k.itemN = 0;
    }
    this.ev.used(k, item, d);
  }

  private addOil(x: number, z: number, owner: Kart) {
    const pr = this.track.project(x, z, owner.proj.idx, { idx: 0, s: 0, d: 0 });
    const lim = this.track.wallD - 2;
    if (Math.abs(pr.d) > lim) {
      const k = pr.idx, sg = Math.sign(pr.d), over = Math.abs(pr.d) - lim;
      x -= this.track.rx[k] * sg * over;
      z -= this.track.rz[k] * sg * over;
    }
    const mesh = new THREE.Mesh(new THREE.CircleGeometry(1.75, 18), this.oilMat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.rotation.z = Math.random() * 3;
    mesh.scale.set(1, 0.75 + Math.random() * 0.3, 1);
    mesh.position.set(x, 0.06, z);
    this.group.add(mesh);
    this.oils.push({ x, z, mesh, owner, safe: 1, life: 32 });
    this.ev.bounce(x, z);
  }

  private launch(kind: Proj["kind"], k: Kart, heading: number, speed: number, y: number, target: Kart | null) {
    const fx = Math.sin(heading), fz = Math.cos(heading);
    const mesh = kind === "rocket" ? rocketMesh() : kind === "coconut" ? coconutMesh() : kind === "flask" ? flaskMesh() : beesMesh();
    const p: Proj = {
      kind,
      x: k.x + fx * 2.6,
      z: k.z + fz * 2.6,
      y,
      vy: kind === "flask" ? 7 : 0,
      heading,
      speed,
      owner: k,
      target,
      life: kind === "bees" ? 30 : kind === "coconut" ? 9 : 7,
      safe: 0.45,
      bounces: 0,
      mesh,
      proj: { idx: k.proj.idx, s: 0, d: 0 },
      t: 0,
    };
    mesh.position.set(p.x, y, p.z);
    this.group.add(mesh);
    this.projs.push(p);
  }

  reset() {
    for (const c of this.crystals) {
      c.respawn = 0;
      c.mesh.visible = true;
      c.mesh.scale.setScalar(1);
    }
    for (const o of this.oils) this.group.remove(o.mesh);
    for (const r of this.projs) this.group.remove(r.mesh);
    this.oils = [];
    this.projs = [];
  }

  /** Zásah motokáry; vrací true, když se věc spotřebovala. */
  private strike(k: Kart, by: Kart, kind: HitBy, hk: HitKind = "spin") {
    const res = k.hit(hk);
    if (res === "immune") return k.ramT > 0;
    if (res === "hit") this.ev.hit(k, by === k ? null : by, kind);
    else this.ev.blocked(k);
    return true;
  }

  update(dt: number, time: number, karts: Kart[], standings: Kart[]) {
    const tr = this.track;
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
        if ((k.x - c.x) ** 2 + (k.z - c.z) ** 2 > (KART_R + 1.0) ** 2 || k.y > 2.5) continue;
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
    const humans = karts.filter((k) => k.human).length;
    for (const k of karts) {
      if (k.rollT <= 0) continue;
      k.rollT -= dt;
      if (k.rollT <= 0) {
        k.rollT = 0;
        const rank = n > 1 ? standings.indexOf(k) / (n - 1) : 0;
        k.item = this.roll(rank, n > 1 ? 2 : humans);
        k.itemN = k.item === "turbo3" ? 3 : 1;
        this.ev.gotItem(k, k.item);
      }
    }

    // olej na zemi
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
          if (k.ramT > 0) {
            gone = true;
            break;
          }
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

    // letící věci
    for (let i = this.projs.length - 1; i >= 0; i--) {
      const p = this.projs[i];
      p.life -= dt;
      p.safe -= dt;
      p.t += dt;
      tr.project(p.x, p.z, p.proj.idx, p.proj, 24);
      let done = p.life <= 0;
      if (p.kind === "flask") {
        p.vy -= 20 * dt;
        p.y += p.vy * dt;
        p.x += Math.sin(p.heading) * p.speed * dt;
        p.z += Math.cos(p.heading) * p.speed * dt;
        p.mesh.rotation.x += dt * 12;
        if (p.y <= 0.1) {
          this.addOil(p.x, p.z, p.owner);
          done = true;
        }
      } else if (p.kind === "coconut") {
        p.x += Math.sin(p.heading) * p.speed * dt;
        p.z += Math.cos(p.heading) * p.speed * dt;
        p.mesh.rotation.x += dt * p.speed * 1.6;
        const lim = tr.wallD - 0.7;
        if (Math.abs(p.proj.d) > lim) {
          const k = p.proj.idx, sg = Math.sign(p.proj.d);
          const nx = tr.rx[k] * sg, nz = tr.rz[k] * sg;
          let vx = Math.sin(p.heading), vz = Math.cos(p.heading);
          const dot = vx * nx + vz * nz;
          if (dot > 0) {
            vx -= 2 * dot * nx;
            vz -= 2 * dot * nz;
            p.heading = Math.atan2(vx, vz);
          }
          const over = Math.abs(p.proj.d) - lim;
          p.x -= nx * over;
          p.z -= nz * over;
          p.bounces++;
          this.ev.bounce(p.x, p.z);
          this.fx.burst(p.x, 0.6, p.z, [0xd9b38c, 0xffffff], 8, 4, 0.3, 0.3);
          if (p.bounces > 5) done = true;
        }
      } else {
        // raketa a včely: navádění
        let aimX: number, aimZ: number;
        const t = p.target;
        const near = p.kind === "bees" ? 14 : 32;
        if (t && !t.finished && (t.x - p.x) ** 2 + (t.z - p.z) ** 2 < near * near) {
          aimX = t.x;
          aimZ = t.z;
        } else {
          const back = Math.cos(wrapAngle(p.heading - Math.atan2(tr.tx[p.proj.idx], tr.tz[p.proj.idx]))) < 0;
          const step = Math.round(14 / tr.ds) * (back ? -1 : 1);
          const ai = (p.proj.idx + step + tr.n) % tr.n;
          const lat = t ? clamp(t.proj.d, -tr.hw * 0.7, tr.hw * 0.7) : clamp(p.proj.d, -tr.hw * 0.6, tr.hw * 0.6);
          aimX = tr.px[ai] + tr.rx[ai] * lat;
          aimZ = tr.pz[ai] + tr.rz[ai] * lat;
        }
        const want = Math.atan2(aimX - p.x, aimZ - p.z);
        const rate = p.kind === "bees" ? 7 : 5.5;
        p.heading = wrapAngle(p.heading + clamp(wrapAngle(want - p.heading), -rate * dt, rate * dt));
        p.x += Math.sin(p.heading) * p.speed * dt;
        p.z += Math.cos(p.heading) * p.speed * dt;
        if (p.kind === "rocket") {
          this.fx.flame(p.x - Math.sin(p.heading) * 0.8, 0.9, p.z - Math.cos(p.heading) * 0.8, 0, 0, false);
          if (Math.random() < 0.5) this.fx.smoke(p.x, 0.9, p.z, 0.9);
          if (Math.abs(p.proj.d) > tr.wallD - 0.4) done = true;
        } else {
          // včely: letí výš, nad cílem slétnou dolů
          const dist = t ? Math.hypot(t.x - p.x, t.z - p.z) : 99;
          p.y += ((dist < 10 ? 1 : 3.4) - p.y) * Math.min(1, dt * 3);
          p.mesh.children.forEach((b, j) => {
            const a = time * 9 + j * 1.7;
            b.position.set(Math.cos(a) * 0.9, Math.sin(a * 1.3) * 0.4, Math.sin(a) * 0.9);
          });
          if (!t || t.finished) done = true;
        }
      }
      if (!done && p.kind !== "flask") {
        const r = p.kind === "bees" ? 2.6 : KART_R + 0.6;
        for (const k of karts) {
          if (k === p.owner && p.safe > 0) continue;
          if (p.kind === "bees" && k !== p.target && p.y > 1.6) continue;
          if (Math.abs(k.y - (p.kind === "bees" ? p.y - 1 : 0)) > 1.6) continue;
          if ((k.x - p.x) ** 2 + (k.z - p.z) ** 2 > r * r) continue;
          if (this.strike(k, p.owner, p.kind === "bees" ? "bees" : p.kind, p.kind === "bees" ? "bees" : "spin")) {
            done = true;
            break;
          }
        }
        // včely zasáhnou i ty, kdo jsou těsně u cíle
        if (done && p.kind === "bees")
          for (const k of karts)
            if (k !== p.target && k !== p.owner && (k.x - p.x) ** 2 + (k.z - p.z) ** 2 < 4.5 ** 2) this.strike(k, p.owner, "bees", "bees");
      }
      p.mesh.position.set(p.x, p.y, p.z);
      if (p.kind !== "coconut" && p.kind !== "flask") p.mesh.rotation.y = p.heading;
      if (done) {
        if (p.kind === "rocket") {
          this.fx.explosion(p.x, p.z);
          this.ev.explosion(p.x, p.z);
        } else if (p.kind === "bees") this.fx.burst(p.x, p.y, p.z, [0xffd21f, 0x1b1430], 30, 8, 0.4);
        else if (p.kind === "coconut") this.fx.burst(p.x, 0.6, p.z, [0x8b5a2b, 0xffffff], 18, 6, 0.4);
        this.group.remove(p.mesh);
        this.projs.splice(i, 1);
      }
    }
  }
}

// ---------------------------------------------------------------- modely věcí

function rocketMesh() {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 1.2, 10), new THREE.MeshPhongMaterial({ color: 0xff3b4f, shininess: 80 }));
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
  return g;
}

function coconutMesh() {
  const g = new THREE.Group();
  const nut = new THREE.Mesh(new THREE.IcosahedronGeometry(0.55, 1), new THREE.MeshLambertMaterial({ color: 0x7a4a26, flatShading: true }));
  g.add(nut);
  for (let i = 0; i < 3; i++) {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.08, 6, 4), new THREE.MeshLambertMaterial({ color: 0x2b1a0e }));
    eye.position.set(Math.cos(i * 2.1) * 0.2, 0.48, Math.sin(i * 2.1) * 0.2);
    g.add(eye);
  }
  return g;
}

function flaskMesh() {
  const g = new THREE.Group();
  const can = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.7, 12), new THREE.MeshPhongMaterial({ color: 0x1b1b24, shininess: 90 }));
  g.add(can);
  const band = new THREE.Mesh(new THREE.CylinderGeometry(0.33, 0.33, 0.18, 12), new THREE.MeshLambertMaterial({ color: 0xffd21f }));
  g.add(band);
  return g;
}

function beesMesh() {
  const g = new THREE.Group();
  const yellow = new THREE.MeshLambertMaterial({ color: 0xffd21f });
  const black = new THREE.MeshLambertMaterial({ color: 0x1b1430 });
  const wing = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.7 });
  for (let i = 0; i < 7; i++) {
    const b = new THREE.Group();
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.22, 10, 8), yellow);
    body.scale.z = 1.4;
    b.add(body);
    const stripe = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.05, 4, 12), black);
    stripe.position.z = -0.05;
    b.add(stripe);
    for (const sx of [-1, 1]) {
      const w = new THREE.Mesh(new THREE.CircleGeometry(0.16, 8), wing);
      w.position.set(sx * 0.16, 0.18, 0);
      w.rotation.set(-Math.PI / 2, 0, sx * 0.5);
      b.add(w);
    }
    g.add(b);
  }
  return g;
}
