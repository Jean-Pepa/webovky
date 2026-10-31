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

export interface Ramp {
  s0: number;
  len: number;
  d: number;
  halfW: number;
  h: number;
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
  /** výška silnice (m) v každém bodu */
  readonly py: Float32Array;
  /** trať má výškové rozdíly */
  readonly hasHeight: boolean;
  /** 1 = úsek vede po mostě nad jinou částí trati */
  readonly bridge: Uint8Array;
  /** zakřivení (+ = doleva), vyhlazené */
  readonly curv: Float32Array;
  readonly group = new THREE.Group();
  readonly itemSpots: { x: number; z: number; y: number }[] = [];
  readonly goldens: { x: number; z: number; y: number }[] = [];
  readonly tunnels: { s0: number; s1: number }[] = [];
  readonly planeSpots: number[] = [];
  readonly pads: Pad[] = [];
  readonly ramps: Ramp[] = [];
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
      def.pts.map((p) => new THREE.Vector3(p[0], p[2] ?? 0, p[1])),
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
    this.py = new Float32Array(n);
    this.bridge = new Uint8Array(n);
    this.curv = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      this.px[i] = pts[i].x;
      this.pz[i] = pts[i].z;
      // křivka výšek může mezi body podkmitnout pod nulu → silnice by vedla pod zemí (tráva přes ni)
      this.py[i] = Math.max(0, pts[i].y);
      this.sAt[i] = i * this.ds;
    }
    this.hasHeight = def.pts.some((p) => (p[2] ?? 0) !== 0);
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

    // mosty: úsek je vysoko nad jinou (vzdálenou) částí trati
    if (this.hasHeight) {
      const reach = Math.ceil((2 * this.wallD + 6) / 16);
      for (let i = 0; i < n; i++) {
        if (this.py[i] < 5) continue;
        const cx = Math.floor(this.px[i] / 16), cz = Math.floor(this.pz[i] / 16);
        outer: for (let ix = -reach; ix <= reach; ix++)
          for (let iz = -reach; iz <= reach; iz++) {
            const arr = this.hash.get((cx + ix + 500) * 2000 + (cz + iz + 500));
            if (!arr) continue;
            for (const j of arr) {
              const along = Math.min(Math.abs(i - j), n - Math.abs(i - j)) * this.ds;
              if (along < 60 || this.py[i] - this.py[j] < 5) continue;
              if (Math.hypot(this.px[i] - this.px[j], this.pz[i] - this.pz[j]) < 2 * this.wallD + 6) {
                this.bridge[i] = 1;
                break outer;
              }
            }
          }
      }
    }

    for (const f of def.items) {
      for (const lat of [-0.62, -0.21, 0.21, 0.62]) {
        const p = this.pointAt(f * this.length, lat * this.hw);
        this.itemSpots.push(p);
      }
    }
    for (const g of def.golden) {
      const p = this.pointAt(g.at * this.length, g.d * this.hw * 0.8);
      this.goldens.push({ x: p.x, z: p.z, y: p.y + g.h });
    }
    for (const t of def.tunnels ?? []) this.tunnels.push({ s0: t.from * this.length, s1: t.to * this.length });
    for (const f of def.planes ?? []) this.planeSpots.push(f * this.length);
    for (const b of def.boosts) {
      this.pads.push({ s0: b.at * this.length, len: 8, d: b.d * this.hw * 0.7, halfW: 2.3 });
    }
    for (const r of def.ramps) {
      this.ramps.push({ s0: r.at * this.length, len: 7, d: r.d * this.hw * 0.7, halfW: 3, h: 1.1 });
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
    const y = this.py[i] + (this.py[j] - this.py[i]) * t;
    return { x, y, z, heading: Math.atan2(this.tx[i], this.tz[i]), idx: i };
  }

  /** Výška silnice ve vzdálenosti s od startu. */
  heightAt(s: number) {
    if (!this.hasHeight) return 0;
    const L = this.length;
    s = ((s % L) + L) % L;
    const f = s / this.ds;
    const i = Math.floor(f) % this.n, j = (i + 1) % this.n;
    return this.py[i] + (this.py[j] - this.py[i]) * (f - Math.floor(f));
  }

  /** Sklon silnice (stoupání na metr) ve směru jízdy. */
  slopeAt(s: number) {
    if (!this.hasHeight) return 0;
    const i = this.idxAt(s), j = (i + 1) % this.n;
    return (this.py[j] - this.py[i]) / this.ds;
  }

  /** Je místo s v tunelu? */
  inTunnel(s: number) {
    for (const t of this.tunnels) if (s >= t.s0 && s <= t.s1) return true;
    return false;
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
      const hy = y + this.py[i] + (this.py[j] - this.py[i]) * t;
      pos.push(cx + rx * dIn, hy, cz + rz * dIn, cx + rx * dOut, hy, cz + rz * dOut);
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
      pos.push(x, this.py[i], z, x, this.py[i] + h, z);
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
    const gTex = TX.ground(th.ground, th.groundDots, th.flowers);
    gTex.repeat.set(60, 60);
    // zem musí být rozdělená na menší dílky: u dvou obřích trojúhelníků je hloubka
    // nepřesná a tráva pak těsně před kamerou „prorůstá“ přes silnici (2 cm nad zemí)
    const groundMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2400, 2400, 60, 60),
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

    if (this.hasHeight) this.buildElevation();
    this.buildTunnels();
    this.buildRamps();
    this.buildBanners();
    this.buildDecor();
    this.buildScenery();
  }

  /** Výškové úseky: travnaté pásy v úrovni silnice, skalní srázy dolů k zemi, mosty s pilíři. */
  private buildElevation() {
    const th = this.theme;
    const L = this.length;
    const deckTex = TX.ground(th.ground, th.groundDots, th.flowers);
    const deckMat = new THREE.MeshLambertMaterial({ map: deckTex, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -2 });
    for (const side of [-1, 1]) {
      const a = side * (this.hw + 1.3), b = side * this.wallD;
      this.group.add(new THREE.Mesh(this.strip(0, L, Math.min(a, b), Math.max(a, b), 0.012, 8), deckMat));
    }
    // srázy a čela mostů
    const rockMat = new THREE.MeshLambertMaterial({ map: TX.rock(), side: THREE.DoubleSide });
    const n = this.n;
    for (const side of [-1, 1]) {
      const d = side * (this.wallD + 0.3);
      let run: number[] = [];
      const flush = () => {
        if (run.length > 1) {
          const pos: number[] = [], uv: number[] = [], idx: number[] = [];
          run.forEach((i, k) => {
            const x = this.px[i] + this.rx[i] * d, z = this.pz[i] + this.rz[i] * d;
            const bottom = this.bridge[i] ? this.py[i] - 0.9 : -1;
            pos.push(x, this.py[i] + 0.05, z, x, bottom, z);
            uv.push((k * this.ds) / 6, this.py[i] / 6, (k * this.ds) / 6, bottom / 6);
            if (k < run.length - 1) idx.push(k * 2, k * 2 + 2, k * 2 + 1, k * 2 + 1, k * 2 + 2, k * 2 + 3);
          });
          const g = new THREE.BufferGeometry();
          g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
          g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
          g.setIndex(idx);
          g.computeVertexNormals();
          this.group.add(new THREE.Mesh(g, rockMat));
        }
        run = [];
      };
      for (let k = 0; k <= n; k++) {
        const i = k % n;
        if (this.py[i] > 0.3) run.push(i);
        else flush();
      }
      flush();
    }
    // spodek mostů a pilíře
    const concrete = new THREE.MeshLambertMaterial({ color: 0x9aa0a8, side: THREE.DoubleSide });
    let start = -1;
    for (let k = 0; k <= n; k++) {
      const i = k % n;
      const on = k < n && this.bridge[i] === 1;
      if (on && start < 0) start = k;
      if (!on && start >= 0) {
        this.group.add(new THREE.Mesh(this.strip(start * this.ds, k * this.ds, -this.wallD - 0.3, this.wallD + 0.3, -0.9, 10), concrete));
        start = -1;
      }
    }
    const pillarGeo = new THREE.BoxGeometry(1.4, 1, 1.4);
    for (let i = 0; i < n; i += Math.round(12 / this.ds)) {
      if (!this.bridge[i]) continue;
      for (const side of [-1, 1]) {
        const x = this.px[i] + this.rx[i] * side * (this.wallD - 1.2);
        const z = this.pz[i] + this.rz[i] * side * (this.wallD - 1.2);
        // pilíř nesmí stát na silnici pod mostem
        let blocked = false;
        for (let j = 0; j < n && !blocked; j += 2)
          if (this.py[j] < this.py[i] - 5 && (this.px[j] - x) ** 2 + (this.pz[j] - z) ** 2 < (this.wallD + 1.5) ** 2) blocked = true;
        if (blocked) continue;
        const h = this.py[i] - 0.9;
        const m = new THREE.Mesh(pillarGeo, concrete);
        m.scale.y = h;
        m.position.set(x, h / 2, z);
        this.group.add(m);
      }
    }
  }

  /** Tunel skrz skálu: oblouk nad silnicí, lampy a balvany nad ním. */
  private buildTunnels() {
    if (!this.tunnels.length) return;
    const W = this.wallD + 0.3, H = 9, M = 14;
    const archMat = new THREE.MeshLambertMaterial({ map: TX.rock(0x5b534c), side: THREE.DoubleSide });
    const boulderMat = new THREE.MeshLambertMaterial({ color: 0x7a6e64, flatShading: true });
    const lampMat = new THREE.MeshBasicMaterial({ color: 0xfff2a8 });
    const lampGeo = new THREE.BoxGeometry(1.6, 0.25, 0.6);
    const r = rng(77);
    for (const t of this.tunnels) {
      const steps = Math.max(2, Math.round((t.s1 - t.s0) / 2));
      const pos: number[] = [], uv: number[] = [], idx: number[] = [];
      for (let k = 0; k <= steps; k++) {
        const s = t.s0 + ((t.s1 - t.s0) * k) / steps;
        const p = this.pointAt(s, 0);
        const i = p.idx;
        for (let m = 0; m <= M; m++) {
          const a = (Math.PI * m) / M;
          const d = -W * Math.cos(a);
          const y = p.y + H * Math.pow(Math.sin(a), 0.55);
          pos.push(p.x + this.rx[i] * d, y, p.z + this.rz[i] * d);
          uv.push(m / 3, ((s - t.s0) / 6));
          if (k < steps && m < M) {
            const a0 = k * (M + 1) + m, b0 = a0 + M + 1;
            idx.push(a0, b0, a0 + 1, a0 + 1, b0, b0 + 1);
          }
        }
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
      g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
      g.setIndex(idx);
      g.computeVertexNormals();
      this.group.add(new THREE.Mesh(g, archMat));
      // lampy u stropu
      for (let s = t.s0 + 5; s < t.s1 - 3; s += 10) {
        const p = this.pointAt(s, 0);
        const lamp = new THREE.Mesh(lampGeo, lampMat);
        lamp.position.set(p.x, p.y + H - 0.35, p.z);
        lamp.rotation.y = p.heading;
        this.group.add(lamp);
      }
      // skála nad tunelem a kolem vjezdů
      for (let s = t.s0 - 6; s <= t.s1 + 6; s += 14) {
        const p = this.pointAt(s, 0);
        const i = p.idx;
        const rad = 9 + r() * 5;
        const top = new THREE.Mesh(new THREE.DodecahedronGeometry(rad, 0), boulderMat);
        top.position.set(p.x + this.rx[i] * (r() - 0.5) * 6, p.y + H + rad * 0.8, p.z + this.rz[i] * (r() - 0.5) * 6);
        top.rotation.set(r() * 3, r() * 3, r() * 3);
        top.scale.y = 0.75;
        this.group.add(top);
        for (const side of [-1, 1]) {
          const rs = 7 + r() * 6;
          const b = new THREE.Mesh(new THREE.DodecahedronGeometry(rs, 0), boulderMat);
          b.position.set(p.x + this.rx[i] * side * (W + rs * 0.85), p.y + rs * 0.35, p.z + this.rz[i] * side * (W + rs * 0.85));
          b.rotation.set(r() * 3, r() * 3, r() * 3);
          this.group.add(b);
        }
      }
    }
  }

  private buildRamps() {
    const topMat = new THREE.MeshLambertMaterial({ map: TX.ramp() });
    const sideMat = new THREE.MeshLambertMaterial({ color: 0x2b2d42 });
    for (const r of this.ramps) {
      const w = r.halfW, L = r.len, h = r.h, z0 = -L / 2, z1 = L / 2;
      const top = new THREE.BufferGeometry();
      top.setAttribute("position", new THREE.Float32BufferAttribute([-w, 0, z0, w, h, z1, w, 0, z0, -w, 0, z0, -w, h, z1, w, h, z1], 3));
      top.setAttribute("uv", new THREE.Float32BufferAttribute([0, 0, 1, 1.5, 1, 0, 0, 0, 0, 1.5, 1, 1.5], 2));
      top.computeVertexNormals();
      const side = new THREE.BufferGeometry();
      side.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(
          [-w, 0, z1, w, 0, z1, w, h, z1, -w, 0, z1, w, h, z1, -w, h, z1, -w, 0, z0, -w, 0, z1, -w, h, z1, w, 0, z0, w, h, z1, w, 0, z1],
          3,
        ),
      );
      side.computeVertexNormals();
      const p = this.pointAt(r.s0 + L / 2, r.d);
      const g = new THREE.Group();
      g.position.set(p.x, p.y + 0.02, p.z);
      g.rotation.set(-Math.atan(this.slopeAt(r.s0 + L / 2)), p.heading, 0, "YXZ");
      g.add(new THREE.Mesh(top, topMat), new THREE.Mesh(side, sideMat));
      this.group.add(g);
    }
  }

  private projectS(x: number, z: number) {
    return this.project(x, z, -1, { idx: 0, s: 0, d: 0 }).s;
  }

  private buildGantry() {
    const p = this.pointAt(0, 0);
    const g = new THREE.Group();
    g.position.set(p.x, p.y, p.z);
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
      g.position.set(p.x, p.y, p.z);
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

    const color = new THREE.Color();
    const mInst = new THREE.Matrix4();
    const mLocal = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const e = new THREE.Euler();
    const v = new THREE.Vector3();
    const sc = new THREE.Vector3();
    for (const [kind, list] of lists) {
      if (!list.length) continue;
      for (const part of DECOR[kind]) {
        const mat = part.glow
          ? new THREE.MeshPhongMaterial({ flatShading: true, emissive: 0x3a7bd5, transparent: true, opacity: 0.85, shininess: 100 })
          : new THREE.MeshLambertMaterial({ flatShading: true });
        const mesh = new THREE.InstancedMesh(part.geo, mat, list.length);
        mLocal.compose(
          v.set(...part.pos),
          q.setFromEuler(e.set(...(part.rot ?? [0, 0, 0]))),
          sc.set(...(part.scale ?? [1, 1, 1])),
        );
        list.forEach((it, i) => {
          mInst.compose(v.set(it.x, 0, it.z), q.setFromEuler(e.set(0, it.rot, 0)), sc.set(it.s, it.s, it.s));
          mInst.multiply(mLocal);
          mesh.setMatrixAt(i, mInst);
          color.set(part.colors[Math.floor(it.tint * part.colors.length) % part.colors.length]);
          mesh.setColorAt(i, color);
        });
        mesh.instanceMatrix.needsUpdate = true;
        if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
        this.group.add(mesh);
      }
    }
  }

  private buildScenery() {
    const th = this.theme;
    const r = rng(99);
    const c = this.center;
    const radius = Math.max(this.bounds.maxX - this.bounds.minX, this.bounds.maxZ - this.bounds.minZ) / 2;
    // kopce / duny
    const hillMat = new THREE.MeshLambertMaterial({ color: th.hill, flatShading: true });
    for (let i = 0; i < 26; i++) {
      const a = (i / 26) * Math.PI * 2 + r() * 0.2;
      const dist = radius + 260 + r() * 140;
      const rr = 60 + r() * 70;
      const hill = new THREE.Mesh(new THREE.SphereGeometry(rr, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2), hillMat);
      hill.scale.y = th.scenery === "mesas" ? 0.18 + r() * 0.12 : 0.35 + r() * 0.3;
      hill.position.set(c.x + Math.cos(a) * dist, -2, c.z + Math.sin(a) * dist);
      this.group.add(hill);
    }
    if (th.scenery === "mesas") {
      // stolové hory z vrstev pískovce
      const bands = [th.mountain, th.mountainCap, 0xb85f30];
      for (let i = 0; i < 16; i++) {
        const a = (i / 16) * Math.PI * 2 + r() * 0.3;
        const dist = radius + 420 + r() * 360;
        const w = 60 + r() * 90;
        const g = new THREE.Group();
        let y = 0;
        const layers = 2 + Math.floor(r() * 3);
        for (let k = 0; k < layers; k++) {
          const h = 30 + r() * 40;
          const rad = w * (1 - k * 0.16);
          const m = new THREE.Mesh(
            new THREE.CylinderGeometry(rad * 0.92, rad, h, 7),
            new THREE.MeshLambertMaterial({ color: bands[k % bands.length], flatShading: true }),
          );
          m.position.y = y + h / 2;
          m.rotation.y = r() * 3;
          g.add(m);
          y += h;
        }
        g.position.set(c.x + Math.cos(a) * dist, -4, c.z + Math.sin(a) * dist);
        this.group.add(g);
      }
    } else {
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
        const cap = new THREE.Mesh(new THREE.ConeGeometry(w * (th.scenery === "snow" ? 0.55 : 0.31), h * (th.scenery === "snow" ? 0.55 : 0.3), m.geometry.parameters.radialSegments), capMat);
        cap.position.set(0, th.scenery === "snow" ? h * 0.225 + 0.5 : h * 0.35 + 0.5, 0);
        m.add(cap);
      }
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
    g.position.set(p.x, p.y, p.z);
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

// ---------------------------------------------------------------- výzdoba (instancované díly)

type V3 = [number, number, number];
interface DecorPart {
  geo: THREE.BufferGeometry;
  colors: number[];
  pos: V3;
  rot?: V3;
  scale?: V3;
  glow?: boolean;
}

const GREENS = [0x3f9e3a, 0x4fb543, 0x2f8a34, 0x63c24a];
const DARK_GREENS = [0x2a6e3a, 0x31804a, 0x245f33];
const BROWNS = [0x7a4b2a, 0x6b3f22];
const CACTUS = [0x3f8f3a, 0x4a9f44, 0x367f35];

const DECOR: Record<DecorKind, DecorPart[]> = {
  tree: [
    { geo: new THREE.CylinderGeometry(0.28, 0.4, 2.6, 6), colors: BROWNS, pos: [0, 1.3, 0] },
    { geo: new THREE.IcosahedronGeometry(2.1, 0), colors: GREENS, pos: [0, 3.9, 0] },
  ],
  pine: [
    { geo: new THREE.CylinderGeometry(0.22, 0.3, 1.6, 6), colors: BROWNS, pos: [0, 0.8, 0] },
    { geo: new THREE.ConeGeometry(1.9, 5.5, 7), colors: DARK_GREENS, pos: [0, 4.2, 0] },
  ],
  bush: [{ geo: new THREE.IcosahedronGeometry(1.2, 0), colors: [0x4caf50, 0x5cbf4a, 0x66bb6a, 0x8bc34a], pos: [0, 0.6, 0], scale: [1, 0.65, 1] }],
  rock: [{ geo: new THREE.DodecahedronGeometry(1.3, 0), colors: [0x9e9e9e, 0x8d8d8d, 0xb0aaa0], pos: [0, 0.5, 0], rot: [0.4, 0, 0.3], scale: [1, 0.6, 1] }],
  cactus: [
    { geo: new THREE.CylinderGeometry(0.45, 0.5, 4.2, 8), colors: CACTUS, pos: [0, 2.1, 0] },
    { geo: new THREE.SphereGeometry(0.45, 8, 6), colors: CACTUS, pos: [0, 4.2, 0] },
    { geo: new THREE.CylinderGeometry(0.28, 0.28, 1.0, 7), colors: CACTUS, pos: [0.55, 2.0, 0], rot: [0, 0, Math.PI / 2] },
    { geo: new THREE.CylinderGeometry(0.3, 0.3, 1.5, 7), colors: CACTUS, pos: [1.0, 2.7, 0] },
    { geo: new THREE.CylinderGeometry(0.26, 0.26, 0.9, 7), colors: CACTUS, pos: [-0.5, 2.6, 0], rot: [0, 0, Math.PI / 2] },
    { geo: new THREE.CylinderGeometry(0.28, 0.28, 1.2, 7), colors: CACTUS, pos: [-0.9, 3.2, 0] },
  ],
  palm: [
    { geo: new THREE.CylinderGeometry(0.25, 0.42, 6.2, 6), colors: [0x8a5a2b, 0x7a4a22], pos: [0.35, 3.1, 0], rot: [0, 0, -0.12] },
    { geo: new THREE.ConeGeometry(2.8, 1.4, 7), colors: [0x2f9a3a, 0x3caf45], pos: [0.75, 6.2, 0], rot: [Math.PI, 0, 0] },
    { geo: new THREE.SphereGeometry(0.28, 6, 4), colors: [0x6b3f22], pos: [0.75, 5.6, 0.35] },
  ],
  snowpine: [
    { geo: new THREE.CylinderGeometry(0.22, 0.3, 1.4, 6), colors: BROWNS, pos: [0, 0.7, 0] },
    { geo: new THREE.ConeGeometry(2.1, 3.2, 7), colors: DARK_GREENS, pos: [0, 2.6, 0] },
    { geo: new THREE.ConeGeometry(1.5, 2.6, 7), colors: DARK_GREENS, pos: [0, 4.3, 0] },
    { geo: new THREE.ConeGeometry(0.95, 1.5, 7), colors: [0xffffff, 0xf2f7ff], pos: [0, 5.45, 0] },
  ],
  snowman: [
    { geo: new THREE.SphereGeometry(1.1, 12, 8), colors: [0xffffff], pos: [0, 1.0, 0] },
    { geo: new THREE.SphereGeometry(0.8, 12, 8), colors: [0xffffff], pos: [0, 2.5, 0] },
    { geo: new THREE.SphereGeometry(0.55, 12, 8), colors: [0xffffff], pos: [0, 3.55, 0] },
    { geo: new THREE.ConeGeometry(0.1, 0.6, 6), colors: [0xff7a1a], pos: [0, 3.55, 0.75], rot: [Math.PI / 2, 0, 0] },
    { geo: new THREE.CylinderGeometry(0.6, 0.6, 0.08, 12), colors: [0x1b1430], pos: [0, 4.0, 0] },
    { geo: new THREE.CylinderGeometry(0.4, 0.4, 0.6, 12), colors: [0x1b1430], pos: [0, 4.3, 0] },
  ],
  crystal: [
    { geo: new THREE.OctahedronGeometry(1, 0), colors: [0xaee6ff, 0x8fd3ff], pos: [0, 2, 0], scale: [0.6, 2.2, 0.6], glow: true },
    { geo: new THREE.OctahedronGeometry(1, 0), colors: [0xc8f0ff], pos: [0.8, 1.2, 0.3], rot: [0, 0, -0.5], scale: [0.4, 1.4, 0.4], glow: true },
    { geo: new THREE.OctahedronGeometry(1, 0), colors: [0x9fdcff], pos: [-0.7, 1.0, -0.2], rot: [0.3, 0, 0.6], scale: [0.35, 1.2, 0.35], glow: true },
  ],
};
