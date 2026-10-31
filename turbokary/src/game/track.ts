// Trať: vzorkování křivky, promítání polohy na trať a stavba 3D scény (silnice, obrubníky,
// bariéry, start, turbo pásy, výzdoba, hory, obloha).
import * as THREE from "three";
import type { TrackDef } from "./tracks";
import type { Theme, DecorKind } from "./themes";
import { rng, wrapAngle } from "./util";
import * as TX from "./textures";

/** Pás trávy mezi okrajem silnice a bariérou. */
export const OFFROAD = 6;
const WALL_H = 1.15;

export interface Projection {
  idx: number;
  s: number;
  d: number;
}

export interface Pad {
  s0: number;
  len: number;
  d: number;
  halfW: number;
}

export class Track {
  readonly def: TrackDef;
  readonly theme: Theme;
  readonly n: number;
  readonly length: number;
  readonly ds: number;
  readonly hw: number;
  readonly wallD: number;
  readonly px: Float32Array;
  readonly pz: Float32Array;
  readonly tx: Float32Array;
  readonly tz: Float32Array;
  readonly rx: Float32Array;
  readonly rz: Float32Array;
  readonly sAt: Float32Array;
  /** zakřivení (+ = doleva), vyhlazené */
  readonly curv: Float32Array;
  readonly group = new THREE.Group();
  readonly itemSpots: { x: number; z: number }[] = [];
  readonly pads: Pad[] = [];
  readonly bounds = { minX: 0, maxX: 0, minZ: 0, maxZ: 0 };
  readonly center = new THREE.Vector3();
  private boostTex: THREE.Texture | null = null;
  private bannerMats: THREE.MeshLambertMaterial[] = [];
  private startMats: THREE.MeshBasicMaterial[] = [];
  private skyGroup = new THREE.Group();
  private hash = new Map<number, number[]>();

  constructor(def: TrackDef, theme: Theme) {
    this.def = def;
    this.theme = theme;
    this.hw = def.hw;
    this.wallD = def.hw + OFFROAD;

    const curve = new THREE.CatmullRomCurve3(
      def.pts.map(([x, z]) => new THREE.Vector3(x, 0, z)),
      true,
      "centripetal",
    );
    curve.arcLengthDivisions = 6000;
    this.length = curve.getLength();
    const n = Math.round(this.length);
    this.n = n;
    this.ds = this.length / n;
    const pts = curve.getSpacedPoints(n);
    this.px = new Float32Array(n);
    this.pz = new Float32Array(n);
    this.tx = new Float32Array(n);
    this.tz = new Float32Array(n);
    this.rx = new Float32Array(n);
    this.rz = new Float32Array(n);
    this.sAt = new Float32Array(n);
    this.curv = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      this.px[i] = pts[i].x;
      this.pz[i] = pts[i].z;
      this.sAt[i] = i * this.ds;
    }
    const head = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const a = (i - 1 + n) % n, b = (i + 1) % n;
      let dx = this.px[b] - this.px[a], dz = this.pz[b] - this.pz[a];
      const l = Math.hypot(dx, dz) || 1;
      dx /= l;
      dz /= l;
      this.tx[i] = dx;
      this.tz[i] = dz;
      this.rx[i] = -dz;
      this.rz[i] = dx;
      head[i] = Math.atan2(dx, dz);
    }
    const raw = new Float32Array(n);
    for (let i = 0; i < n; i++) raw[i] = wrapAngle(head[(i + 2) % n] - head[(i - 2 + n) % n]) / (4 * this.ds);
    const W = 6;
    for (let i = 0; i < n; i++) {
      let acc = 0;
      for (let k = -W; k <= W; k++) acc += raw[(i + k + n) % n];
      this.curv[i] = acc / (2 * W + 1);
    }

    let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
    for (let i = 0; i < n; i++) {
      minX = Math.min(minX, this.px[i]);
      maxX = Math.max(maxX, this.px[i]);
      minZ = Math.min(minZ, this.pz[i]);
      maxZ = Math.max(maxZ, this.pz[i]);
    }
    Object.assign(this.bounds, { minX, maxX, minZ, maxZ });
    this.center.set((minX + maxX) / 2, 0, (minZ + maxZ) / 2);

    for (let i = 0; i < n; i += 2) {
      const key = this.cellKey(this.px[i], this.pz[i]);
      let arr = this.hash.get(key);
      if (!arr) this.hash.set(key, (arr = []));
      arr.push(i);
    }

    for (const f of def.items) {
      for (const lat of [-0.62, -0.21, 0.21, 0.62]) {
        const p = this.pointAt(f * this.length, lat * this.hw);
        this.itemSpots.push(p);
      }
    }
    for (const b of def.boosts) {
      this.pads.push({ s0: b.at * this.length, len: 8, d: b.d * this.hw * 0.7, halfW: 2.3 });
    }

    this.build();
  }

  // ---------------------------------------------------------------- dotazy

  private cellKey(x: number, z: number) {
    return (Math.floor(x / 16) + 500) * 2000 + (Math.floor(z / 16) + 500);
  }

  /** Vzdálenost bodu od osy trati (přibližně, pro rozmístění výzdoby). */
  distanceToTrack(x: number, z: number, reach = 3): number {
    const cx = Math.floor(x / 16), cz = Math.floor(z / 16);
    let best = Infinity;
    for (let ix = -reach; ix <= reach; ix++)
      for (let iz = -reach; iz <= reach; iz++) {
        const arr = this.hash.get((cx + ix + 500) * 2000 + (cz + iz + 500));
        if (!arr) continue;
        for (const i of arr) {
          const d = (x - this.px[i]) ** 2 + (z - this.pz[i]) ** 2;
          if (d < best) best = d;
        }
      }
    return Math.sqrt(best);
  }

  /** Promítne bod (x, z) na osu trati. `hint` = index z minula (-1 = hledej všude). */
  project(x: number, z: number, hint: number, out: Projection, window = 36): Projection {
    const n = this.n;
    let best = 0, bd = Infinity;
    if (hint < 0) {
      for (let i = 0; i < n; i++) {
        const d = (x - this.px[i]) ** 2 + (z - this.pz[i]) ** 2;
        if (d < bd) {
          bd = d;
          best = i;
        }
      }
    } else {
      for (let k = -window; k <= window; k++) {
        let i = hint + k;
        if (i < 0) i += n;
        else if (i >= n) i -= n;
        const d = (x - this.px[i]) ** 2 + (z - this.pz[i]) ** 2;
        if (d < bd) {
          bd = d;
          best = i;
        }
      }
    }
    const dx = x - this.px[best], dz = z - this.pz[best];
    let s = this.sAt[best] + dx * this.tx[best] + dz * this.tz[best];
    if (s < 0) s += this.length;
    else if (s >= this.length) s -= this.length;
    out.idx = best;
    out.s = s;
    out.d = dx * this.rx[best] + dz * this.rz[best];
    return out;
  }

  idxAt(s: number) {
    const n = this.n;
    return ((Math.floor(s / this.ds) % n) + n) % n;
  }

  /** Bod na trati ve vzdálenosti s od startu, d = příčný posun (+ = vpravo). */
  pointAt(s: number, d = 0) {
    const L = this.length;
    s = ((s % L) + L) % L;
    const f = s / this.ds;
    const i = Math.floor(f) % this.n, j = (i + 1) % this.n, t = f - Math.floor(f);
    const x = this.px[i] + (this.px[j] - this.px[i]) * t + this.rx[i] * d;
    const z = this.pz[i] + (this.pz[j] - this.pz[i]) * t + this.rz[i] * d;
    return { x, z, heading: Math.atan2(this.tx[i], this.tz[i]), idx: i };
  }

  /** Startovní rošt: dvě řady za startovní čarou. */
  gridSlot(k: number) {
    const row = Math.floor(k / 2), col = k % 2;
    const s = this.length - 7 - row * 7 - col * 3;
    return this.pointAt(s, (col ? 1 : -1) * this.hw * 0.42);
  }

  /** Průměrné zakřivení na úseku from..to metrů před indexem idx. */
  curvAhead(idx: number, from: number, to: number) {
    let acc = 0, c = 0;
    for (let m = from; m <= to; m += 2) {
      acc += this.curv[(idx + Math.round(m / this.ds)) % this.n];
      c++;
    }
    return c ? acc / c : 0;
  }

  update(time: number) {
    if (this.boostTex) this.boostTex.offset.y = -time * 2.2;
  }

  // ---------------------------------------------------------------- grafika z public/img

  setBannerTextures(texs: (THREE.Texture | null)[]) {
    this.bannerMats.forEach((m, i) => {
      const t = texs[i % texs.length];
      if (t) {
        m.map = t;
        m.needsUpdate = true;
      }
    });
  }

  setStartBanner(t: THREE.Texture) {
    for (const m of this.startMats) {
      m.map = t;
      m.needsUpdate = true;
    }
  }

  setSkyPanorama(t: THREE.Texture) {
    t.wrapS = THREE.RepeatWrapping;
    const mat = new THREE.ShaderMaterial({
      uniforms: { map: { value: t } },
      vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
      fragmentShader: `uniform sampler2D map; varying vec2 vUv;
        void main(){ vec4 c = texture2D(map, vUv); float a = smoothstep(1.0, 0.72, vUv.y);
        gl_FragColor = vec4(c.rgb, a);
#include <colorspace_fragment>
}`,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
      fog: false,
    });
    const cyl = new THREE.Mesh(new THREE.CylinderGeometry(1500, 1500, 820, 64, 1, true), mat);
    cyl.position.set(this.center.x, 330, this.center.z);
    cyl.renderOrder = -9;
    this.skyGroup.add(cyl);
  }

  // ---------------------------------------------------------------- stavba scény

  /** Pruh podél trati mezi příčnými polohami dIn..dOut, na úseku s0..s1 (s1 > s0, přes start smí přetéct). */
  private strip(s0: number, s1: number, dIn: number, dOut: number, y: number, vScale: number) {
    const L = this.length;
    const steps = Math.max(1, Math.round((s1 - s0) / this.ds));
    const pos: number[] = [], uv: number[] = [], nor: number[] = [], idx: number[] = [];
    for (let k = 0; k <= steps; k++) {
      const s = s0 + ((s1 - s0) * k) / steps;
      const ss = ((s % L) + L) % L;
      const f = ss / this.ds;
      const i = Math.floor(f) % this.n, j = (i + 1) % this.n, t = f - Math.floor(f);
      const cx = this.px[i] + (this.px[j] - this.px[i]) * t;
      const cz = this.pz[i] + (this.pz[j] - this.pz[i]) * t;
      let rx = this.rx[i] + (this.rx[j] - this.rx[i]) * t;
      let rz = this.rz[i] + (this.rz[j] - this.rz[i]) * t;
      const rl = Math.hypot(rx, rz) || 1;
      rx /= rl;
      rz /= rl;
      pos.push(cx + rx * dIn, y, cz + rz * dIn, cx + rx * dOut, y, cz + rz * dOut);
      const v = (s - s0) / vScale;
      uv.push(0, v, 1, v);
      nor.push(0, 1, 0, 0, 1, 0);
      if (k < steps) {
        const a = k * 2, b = a + 1, c = a + 2, d = a + 3;
        idx.push(a, b, c, b, d, c);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute("normal", new THREE.Float32BufferAttribute(nor, 3));
    g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
    g.setIndex(idx);
    return g;
  }

  /** Svislá stěna podél trati v příčné poloze d. */
  private wallGeom(d: number, h: number) {
    const pos: number[] = [], uv: number[] = [], idx: number[] = [];
    const n = this.n;
    for (let k = 0; k <= n; k++) {
      const i = k % n;
      const x = this.px[i] + this.rx[i] * d, z = this.pz[i] + this.rz[i] * d;
      pos.push(x, 0, z, x, h, z);
      const u = (k * this.ds) / 8;
      uv.push(u, 0, u, 1);
      if (k < n) {
        const a = k * 2;
        idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
    g.setIndex(idx);
    g.computeVertexNormals();
    return g;
  }

  private build() {
    const th = this.theme;
    const L = this.length;
    const offset = (m: THREE.Material, f: number) => {
      m.polygonOffset = true;
      m.polygonOffsetFactor = f;
      m.polygonOffsetUnits = f * 4;
      return m;
    };

    // obloha (přechod barev), světla
    const sky = new THREE.Mesh(
      new THREE.SphereGeometry(1700, 32, 16),
      new THREE.ShaderMaterial({
        uniforms: {
          top: { value: new THREE.Color(th.skyTop) },
          bottom: { value: new THREE.Color(th.skyHorizon) },
        },
        vertexShader: `varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
        fragmentShader: `uniform vec3 top; uniform vec3 bottom; varying vec3 vP;
          void main(){ float h = clamp(vP.y, 0.0, 1.0); vec3 c = mix(bottom, top, pow(h, 0.55));
          gl_FragColor = vec4(c, 1.0);
#include <colorspace_fragment>
}`,
        side: THREE.BackSide,
        depthWrite: false,
        fog: false,
      }),
    );
    sky.renderOrder = -10;
    this.skyGroup.add(sky);
    this.skyGroup.position.set(0, 0, 0);
    sky.position.copy(this.center);
    this.group.add(this.skyGroup);

    const hemi = new THREE.HemisphereLight(th.hemiSky, th.hemiGround, 1.1);
    const sun = new THREE.DirectionalLight(th.sun, th.sunIntensity);
    sun.position.set(0.5, 1, 0.3);
    this.group.add(hemi, sun);

    // zem
    const gTex = TX.ground(th.ground, th.groundDots);
    gTex.repeat.set(60, 60);
    const groundMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2400, 2400),
      new THREE.MeshLambertMaterial({ map: gTex }),
    );
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.position.set(this.center.x, 0, this.center.z);
    this.group.add(groundMesh);

    // silnice
    const road = new THREE.Mesh(
      this.strip(0, L, -this.hw, this.hw, 0.02, 14),
      offset(new THREE.MeshLambertMaterial({ map: TX.asphalt(th.road, th.roadLine) }), -1),
    );
    this.group.add(road);

    // obrubníky
    const curbTex = TX.curb(th.curbA, th.curbB);
    const curbMat = offset(new THREE.MeshLambertMaterial({ map: curbTex }), -1);
    this.group.add(new THREE.Mesh(this.strip(0, L, -this.hw - 1.3, -this.hw, 0.025, 3), curbMat));
    this.group.add(new THREE.Mesh(this.strip(0, L, this.hw, this.hw + 1.3, 0.025, 3), curbMat));

    // bariéry
    const wTex = TX.wall(th.wallA, th.wallB);
    const wMat = new THREE.MeshLambertMaterial({ map: wTex, side: THREE.DoubleSide });
    const capMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
    for (const side of [-1, 1]) {
      this.group.add(new THREE.Mesh(this.wallGeom(side * this.wallD, WALL_H), wMat));
      const cap = this.strip(0, L, side * this.wallD - 0.18, side * this.wallD + 0.18, WALL_H, 10);
      this.group.add(new THREE.Mesh(cap, capMat));
    }

    // startovní čára
    const startMat = offset(new THREE.MeshLambertMaterial({ map: TX.checker(10, 2) }), -2);
    this.group.add(new THREE.Mesh(this.strip(-1.4, 1.4, -this.hw, this.hw, 0.035, 2.8), startMat));
    // čáry roštu
    const gridMat = offset(new THREE.MeshBasicMaterial({ color: 0xffffff }), -2);
    for (let k = 0; k < 8; k++) {
      const p = this.gridSlot(k);
      const s = this.projectS(p.x, p.z);
      const d = (k % 2 ? 1 : -1) * this.hw * 0.42;
      this.group.add(new THREE.Mesh(this.strip(s + 1.6, s + 1.9, d - 1.1, d + 1.1, 0.035, 1), gridMat));
    }
    this.buildGantry();

    // turbo pásy
    this.boostTex = TX.boostPad();
    const padMat = offset(
      new THREE.MeshBasicMaterial({ map: this.boostTex, transparent: true, opacity: 0.95 }),
      -2,
    );
    for (const p of this.pads) {
      const g = this.strip(p.s0, p.s0 + p.len, p.d - p.halfW, p.d + p.halfW, 0.04, 4);
      this.group.add(new THREE.Mesh(g, padMat));
    }

    this.buildBanners();
    this.buildDecor();
    this.buildScenery();
  }

  private projectS(x: number, z: number) {
    return this.project(x, z, -1, { idx: 0, s: 0, d: 0 }).s;
  }

  private buildGantry() {
    const p = this.pointAt(0, 0);
    const g = new THREE.Group();
    g.position.set(p.x, 0, p.z);
    g.rotation.y = p.heading;
    const postMat = new THREE.MeshLambertMaterial({ color: 0x2b2d42 });
    const span = this.wallD + 0.8;
    for (const side of [-1, 1]) {
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.8, 7, 0.8), postMat);
      post.position.set(side * span, 3.5, 0);
      g.add(post);
    }
    const beam = new THREE.Mesh(new THREE.BoxGeometry(span * 2 + 0.8, 1.9, 0.7), postMat);
    beam.position.set(0, 6.6, 0);
    g.add(beam);
    const tex = TX.startBanner();
    for (const z of [-0.37, 0.37]) {
      const m = new THREE.MeshBasicMaterial({ map: tex });
      this.startMats.push(m);
      const plane = new THREE.Mesh(new THREE.PlaneGeometry(span * 2, 1.6), m);
      plane.position.set(0, 6.6, z);
      if (z < 0) plane.rotation.y = Math.PI;
      g.add(plane);
    }
    // semafor
    const lights = new THREE.Group();
    for (let i = 0; i < 3; i++) {
      const bulb = new THREE.Mesh(
        new THREE.SphereGeometry(0.28, 12, 8),
        new THREE.MeshBasicMaterial({ color: 0x331111 }),
      );
      bulb.position.set(-0.8 + i * 0.8, 5.3, -0.45);
      bulb.name = `bulb${i}`;
      lights.add(bulb);
    }
    lights.name = "lights";
    g.add(lights);
    g.name = "gantry";
    this.group.add(g);
  }

  /** Semafor na bráně: 0 = zhasnuto, 1–3 = červená, 4 = zelená. */
  setLights(state: number) {
    const lights = this.group.getObjectByName("lights");
    if (!lights) return;
    lights.children.forEach((b, i) => {
      const m = (b as THREE.Mesh).material as THREE.MeshBasicMaterial;
      if (state >= 4) m.color.set(0x34ff6a);
      else m.color.set(i < state ? 0xff2a2a : 0x331111);
    });
  }

  private buildBanners() {
    // plachty na rovinkách za bariérou
    const spots: { s: number; side: number }[] = [];
    let last = -100;
    for (let i = 0; i < this.n; i += 4) {
      const s = this.sAt[i];
      if (s < 30 || s > this.length - 30) continue;
      if (Math.abs(this.curv[i]) < 0.006 && s - last > 70) {
        const side = spots.length % 2 ? 1 : -1;
        spots.push({ s, side });
        last = s;
      }
    }
    spots.forEach((sp, k) => {
      const p = this.pointAt(sp.s, sp.side * (this.wallD + 0.7));
      const m = new THREE.MeshLambertMaterial({ map: TX.banner(k) });
      this.bannerMats.push(m);
      const g = new THREE.Group();
      g.position.set(p.x, 0, p.z);
      g.rotation.y = p.heading + (sp.side > 0 ? Math.PI / 2 : -Math.PI / 2);
      const board = new THREE.Mesh(new THREE.PlaneGeometry(9, 2.25), m);
      board.position.y = 1.9;
      g.add(board);
      const back = new THREE.Mesh(
        new THREE.BoxGeometry(9.2, 2.45, 0.15),
        new THREE.MeshLambertMaterial({ color: 0x2b2d42 }),
      );
      back.position.set(0, 1.9, -0.09);
      g.add(back);
      for (const x of [-4, 4]) {
        const leg = new THREE.Mesh(
          new THREE.BoxGeometry(0.2, 1.2, 0.2),
          new THREE.MeshLambertMaterial({ color: 0x2b2d42 }),
        );
        leg.position.set(x, 0.6, -0.1);
        g.add(leg);
      }
      this.group.add(g);
    });
  }

  private buildDecor() {
    const th = this.theme;
    const r = rng(1234);
    type Inst = { x: number; z: number; s: number; rot: number; tint: number };
    const lists = new Map<DecorKind, Inst[]>();
    for (const d of th.decor) lists.set(d.kind, []);
    const weights = th.decor.map((d) => ({ v: d.kind, w: d.weight }));
    const pick = () => {
      let x = r() * weights.reduce((a, b) => a + b.w, 0);
      for (const w of weights) if ((x -= w.w) <= 0) return w.v;
      return weights[0].v;
    };
    const minD = this.wallD + 3.5;
    const tryPlace = (x: number, z: number) => {
      const dist = this.distanceToTrack(x, z, 2);
      if (dist < minD) return;
      const kind = pick();
      lists.get(kind)!.push({ x, z, s: 0.75 + r() * 0.8, rot: r() * Math.PI * 2, tint: r() });
    };
    // podél trati
    for (let i = 0; i < this.n; i += 6) {
      for (const side of [-1, 1]) {
        if (r() > 0.55 * th.decorDensity) continue;
        const d = side * (this.wallD + 4 + r() * r() * 40);
        const x = this.px[i] + this.rx[i] * d + (r() - 0.5) * 6;
        const z = this.pz[i] + this.rz[i] * d + (r() - 0.5) * 6;
        tryPlace(x, z);
      }
    }
    // volně po okolí
    const b = this.bounds;
    for (let k = 0; k < 520 * th.decorDensity; k++) {
      const x = b.minX - 160 + r() * (b.maxX - b.minX + 320);
      const z = b.minZ - 160 + r() * (b.maxZ - b.minZ + 320);
      tryPlace(x, z);
    }

    const dummy = new THREE.Object3D();
    const color = new THREE.Color();
    const addInstanced = (geo: THREE.BufferGeometry, list: Inst[], colors: number[], y: number, sy = 1, rand = 0) => {
      if (!list.length) return;
      const mat = new THREE.MeshLambertMaterial({ flatShading: true });
      const mesh = new THREE.InstancedMesh(geo, mat, list.length);
      list.forEach((it, i) => {
        dummy.position.set(it.x, y * it.s, it.z);
        dummy.rotation.set(rand ? (it.tint - 0.5) * rand : 0, it.rot, 0);
        dummy.scale.set(it.s, it.s * sy, it.s);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
        color.set(colors[Math.floor(it.tint * colors.length) % colors.length]);
        mesh.setColorAt(i, color);
      });
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
      this.group.add(mesh);
    };
    const trees = lists.get("tree") ?? [];
    addInstanced(new THREE.CylinderGeometry(0.28, 0.4, 2.6, 6), trees, [0x7a4b2a, 0x6b3f22], 1.3);
    addInstanced(new THREE.IcosahedronGeometry(2.1, 0), trees, [0x3f9e3a, 0x4fb543, 0x2f8a34, 0x63c24a], 3.9);
    const pines = lists.get("pine") ?? [];
    addInstanced(new THREE.CylinderGeometry(0.22, 0.3, 1.6, 6), pines, [0x6b3f22], 0.8);
    addInstanced(new THREE.ConeGeometry(1.9, 5.5, 7), pines, [0x2a6e3a, 0x31804a, 0x245f33], 4.2);
    const bushes = lists.get("bush") ?? [];
    addInstanced(new THREE.IcosahedronGeometry(1.2, 0), bushes, [0x4caf50, 0x5cbf4a, 0x66bb6a, 0x8bc34a], 0.6, 0.65);
    const rocks = lists.get("rock") ?? [];
    addInstanced(new THREE.DodecahedronGeometry(1.3, 0), rocks, [0x9e9e9e, 0x8d8d8d, 0xb0aaa0], 0.5, 0.6, 1.2);
  }

  private buildScenery() {
    const th = this.theme;
    const r = rng(99);
    const c = this.center;
    const radius = Math.max(this.bounds.maxX - this.bounds.minX, this.bounds.maxZ - this.bounds.minZ) / 2;
    // kopce
    const hillMat = new THREE.MeshLambertMaterial({ color: th.hill, flatShading: true });
    for (let i = 0; i < 26; i++) {
      const a = (i / 26) * Math.PI * 2 + r() * 0.2;
      const dist = radius + 260 + r() * 140;
      const rr = 60 + r() * 70;
      const hill = new THREE.Mesh(new THREE.SphereGeometry(rr, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2), hillMat);
      hill.scale.y = 0.35 + r() * 0.3;
      hill.position.set(c.x + Math.cos(a) * dist, -2, c.z + Math.sin(a) * dist);
      this.group.add(hill);
    }
    // hory se sněhem
    const mMat = new THREE.MeshLambertMaterial({ color: th.mountain, flatShading: true });
    const capMat = new THREE.MeshLambertMaterial({ color: th.mountainCap, flatShading: true });
    for (let i = 0; i < 18; i++) {
      const a = (i / 18) * Math.PI * 2 + r() * 0.25;
      const dist = radius + 640 + r() * 220;
      const h = 160 + r() * 170;
      const w = 130 + r() * 110;
      const m = new THREE.Mesh(new THREE.ConeGeometry(w, h, 6 + Math.floor(r() * 3)), mMat);
      m.position.set(c.x + Math.cos(a) * dist, h / 2 - 5, c.z + Math.sin(a) * dist);
      m.rotation.y = r() * 3;
      this.group.add(m);
      const cap = new THREE.Mesh(new THREE.ConeGeometry(w * 0.31, h * 0.3, m.geometry.parameters.radialSegments), capMat);
      cap.position.set(0, h * 0.35 + 0.5, 0);
      m.add(cap);
    }
    // mraky
    const cloudMat = new THREE.MeshLambertMaterial({ color: 0xffffff, flatShading: true, fog: false, emissive: 0x9ab4d0 });
    for (let i = 0; i < 14; i++) {
      const g = new THREE.Group();
      const parts = 3 + Math.floor(r() * 3);
      for (let k = 0; k < parts; k++) {
        const s = new THREE.Mesh(new THREE.IcosahedronGeometry(18 + r() * 16, 0), cloudMat);
        s.position.set(k * 22 - parts * 11, r() * 8, (r() - 0.5) * 20);
        s.scale.y = 0.55;
        g.add(s);
      }
      const a = r() * Math.PI * 2;
      const dist = 300 + r() * 600;
      g.position.set(c.x + Math.cos(a) * dist, 170 + r() * 120, c.z + Math.sin(a) * dist);
      g.rotation.y = r() * 3;
      this.group.add(g);
    }
    // tribuna u startu na straně s více místem
    this.buildGrandstand();
  }

  private buildGrandstand() {
    const s = 24;
    const left = this.pointAt(s, -(this.wallD + 14));
    const right = this.pointAt(s, this.wallD + 14);
    const side = this.distanceToTrack(left.x, left.z) > this.distanceToTrack(right.x, right.z) ? -1 : 1;
    const p = this.pointAt(s, side * (this.wallD + 7));
    const g = new THREE.Group();
    g.position.set(p.x, 0, p.z);
    g.rotation.y = p.heading + (side > 0 ? Math.PI / 2 : -Math.PI / 2);
    const steelMat = new THREE.MeshLambertMaterial({ color: 0xdfe3ea });
    const seatMat = new THREE.MeshLambertMaterial({ color: 0x2f6bff });
    const width = 40;
    for (let k = 0; k < 5; k++) {
      const step = new THREE.Mesh(new THREE.BoxGeometry(width, 0.9, 1.6), k % 2 ? steelMat : seatMat);
      step.position.set(0, 0.45 + k * 0.9, -k * 1.6 - 0.8);
      g.add(step);
      const base = new THREE.Mesh(new THREE.BoxGeometry(width, k * 0.9 + 0.01, 1.6), steelMat);
      base.position.set(0, (k * 0.9) / 2, -k * 1.6 - 0.8);
      if (k) g.add(base);
    }
    const roof = new THREE.Mesh(new THREE.BoxGeometry(width + 2, 0.3, 9), new THREE.MeshLambertMaterial({ color: 0xff4d6d }));
    roof.position.set(0, 7.6, -4.4);
    roof.rotation.x = -0.08;
    g.add(roof);
    for (const x of [-width / 2, 0, width / 2]) {
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.4, 7.6, 0.4), steelMat);
      post.position.set(x, 3.8, -8.6);
      g.add(post);
    }
    // diváci
    const r = rng(7);
    const fans = new THREE.InstancedMesh(
      new THREE.BoxGeometry(0.6, 1.0, 0.5),
      new THREE.MeshLambertMaterial(),
      5 * 44,
    );
    const dummy = new THREE.Object3D();
    const col = new THREE.Color();
    const palette = [0xff4d6d, 0xffd21f, 0x2f6bff, 0x3ccf4e, 0xff7a1a, 0x9b4dff, 0xffffff, 0x22b8f0];
    let n = 0;
    for (let k = 0; k < 5; k++)
      for (let i = 0; i < 44; i++) {
        if (r() < 0.25) continue;
        dummy.position.set(-width / 2 + 0.6 + i * 0.88, 1.4 + k * 0.9, -k * 1.6 - 0.9);
        dummy.rotation.set(0, (r() - 0.5) * 0.5, 0);
        dummy.scale.set(1, 0.8 + r() * 0.4, 1);
        dummy.updateMatrix();
        fans.setMatrixAt(n, dummy.matrix);
        fans.setColorAt(n, col.set(palette[Math.floor(r() * palette.length)]));
        n++;
      }
    fans.count = n;
    fans.name = "fans";
    g.add(fans);
    this.group.add(g);
  }
}
