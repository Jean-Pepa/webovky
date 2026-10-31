// Částice: jiskry z driftu, plameny turba, prach z trávy, výbuchy, konfety.
import * as THREE from "three";
import * as TX from "./textures";

const VERT = `
attribute float psize; attribute float palpha; attribute vec3 pcolor;
uniform float uScale; varying vec3 vC; varying float vA;
void main(){ vC = pcolor; vA = palpha; vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = psize * uScale / max(0.5, -mv.z); gl_Position = projectionMatrix * mv; }`;
const FRAG = `
uniform sampler2D map; varying vec3 vC; varying float vA;
void main(){ float a = texture2D(map, gl_PointCoord).a * vA; if (a < 0.01) discard;
  gl_FragColor = vec4(vC, a);
#include <colorspace_fragment>
}`;

class Pool {
  readonly points: THREE.Points;
  private readonly n: number;
  private pos: Float32Array;
  private col: Float32Array;
  private size: Float32Array;
  private alpha: Float32Array;
  private vel: Float32Array;
  private life: Float32Array;
  private max: Float32Array;
  private s0: Float32Array;
  private s1: Float32Array;
  private grav: Float32Array;
  private drag: Float32Array;
  private cursor = 0;
  readonly uniforms: { uScale: { value: number }; map: { value: THREE.Texture } };

  constructor(n: number, additive: boolean, tex: THREE.Texture) {
    this.n = n;
    this.pos = new Float32Array(n * 3);
    this.col = new Float32Array(n * 3);
    this.size = new Float32Array(n);
    this.alpha = new Float32Array(n);
    this.vel = new Float32Array(n * 3);
    this.life = new Float32Array(n);
    this.max = new Float32Array(n);
    this.s0 = new Float32Array(n);
    this.s1 = new Float32Array(n);
    this.grav = new Float32Array(n);
    this.drag = new Float32Array(n);
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(this.pos, 3).setUsage(THREE.DynamicDrawUsage));
    g.setAttribute("pcolor", new THREE.BufferAttribute(this.col, 3).setUsage(THREE.DynamicDrawUsage));
    g.setAttribute("psize", new THREE.BufferAttribute(this.size, 1).setUsage(THREE.DynamicDrawUsage));
    g.setAttribute("palpha", new THREE.BufferAttribute(this.alpha, 1).setUsage(THREE.DynamicDrawUsage));
    this.uniforms = { uScale: { value: 500 }, map: { value: tex } };
    const m = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
      blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
    });
    this.points = new THREE.Points(g, m);
    this.points.frustumCulled = false;
    this.points.renderOrder = additive ? 4 : 3;
  }

  emit(x: number, y: number, z: number, vx: number, vy: number, vz: number, c: THREE.Color, s0: number, s1: number, life: number, grav: number, drag: number) {
    const i = this.cursor;
    this.cursor = (this.cursor + 1) % this.n;
    this.pos[i * 3] = x;
    this.pos[i * 3 + 1] = y;
    this.pos[i * 3 + 2] = z;
    this.vel[i * 3] = vx;
    this.vel[i * 3 + 1] = vy;
    this.vel[i * 3 + 2] = vz;
    this.col[i * 3] = c.r;
    this.col[i * 3 + 1] = c.g;
    this.col[i * 3 + 2] = c.b;
    this.life[i] = life;
    this.max[i] = life;
    this.s0[i] = s0;
    this.s1[i] = s1;
    this.size[i] = s0;
    this.alpha[i] = 1;
    this.grav[i] = grav;
    this.drag[i] = drag;
  }

  update(dt: number) {
    for (let i = 0; i < this.n; i++) {
      if (this.life[i] <= 0) {
        this.alpha[i] = 0;
        continue;
      }
      this.life[i] -= dt;
      const t = 1 - Math.max(0, this.life[i]) / this.max[i];
      const k = Math.exp(-this.drag[i] * dt);
      this.vel[i * 3] *= k;
      this.vel[i * 3 + 2] *= k;
      this.vel[i * 3 + 1] = this.vel[i * 3 + 1] * k - this.grav[i] * dt;
      this.pos[i * 3] += this.vel[i * 3] * dt;
      this.pos[i * 3 + 1] = Math.max(0.05, this.pos[i * 3 + 1] + this.vel[i * 3 + 1] * dt);
      this.pos[i * 3 + 2] += this.vel[i * 3 + 2] * dt;
      this.size[i] = this.s0[i] + (this.s1[i] - this.s0[i]) * t;
      this.alpha[i] = t < 0.15 ? 1 : 1 - (t - 0.15) / 0.85;
    }
    const g = this.points.geometry;
    for (const name of ["position", "pcolor", "psize", "palpha"]) g.getAttribute(name).needsUpdate = true;
  }
}

const tmp = new THREE.Color();

export class Effects {
  readonly group = new THREE.Group();
  private glowPool: Pool;
  private smokePool: Pool;

  constructor() {
    const tex = TX.glow();
    this.glowPool = new Pool(2200, true, tex);
    this.smokePool = new Pool(1600, false, tex);
    this.group.add(this.smokePool.points, this.glowPool.points);
  }

  /** Velikost částic závisí na výšce výřezu obrazovky a zorném úhlu kamery. */
  setViewport(heightPx: number, fovDeg: number) {
    const s = heightPx / (2 * Math.tan((fovDeg * Math.PI) / 360));
    this.glowPool.uniforms.uScale.value = s;
    this.smokePool.uniforms.uScale.value = s;
  }

  spark(x: number, y: number, z: number, color: number, speed = 4, size = 0.22) {
    const a = Math.random() * Math.PI * 2;
    this.glowPool.emit(x, y, z, Math.cos(a) * speed, 1.5 + Math.random() * speed, Math.sin(a) * speed, tmp.set(color), size, size * 0.4, 0.25 + Math.random() * 0.2, 14, 2);
  }

  flame(x: number, y: number, z: number, vx: number, vz: number, hot: boolean) {
    tmp.set(hot ? 0x7cf3ff : Math.random() < 0.5 ? 0xffb02e : 0xff5a1f);
    this.glowPool.emit(x, y, z, vx + (Math.random() - 0.5), 0.6 + Math.random(), vz + (Math.random() - 0.5), tmp, 0.55, 0.15, 0.22, -2, 3);
  }

  dust(x: number, z: number, color: number, vx: number, vz: number) {
    tmp.set(color);
    this.smokePool.emit(x, 0.25, z, vx * 0.15 + (Math.random() - 0.5) * 2, 1 + Math.random() * 1.5, vz * 0.15 + (Math.random() - 0.5) * 2, tmp, 0.5, 1.6, 0.6, 2, 2);
  }

  smoke(x: number, y: number, z: number, gray = 0.85) {
    tmp.setRGB(gray, gray, gray);
    this.smokePool.emit(x, y, z, (Math.random() - 0.5) * 1.5, 1 + Math.random() * 1.5, (Math.random() - 0.5) * 1.5, tmp, 0.6, 2.2, 0.8, -0.5, 1.5);
  }

  burst(x: number, y: number, z: number, colors: number[], count: number, speed: number, size: number, life = 0.7) {
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const e = Math.random() * 1.2;
      const v = speed * (0.4 + Math.random() * 0.6);
      tmp.set(colors[i % colors.length]);
      this.glowPool.emit(x, y, z, Math.cos(a) * Math.cos(e) * v, Math.sin(e) * v + 2, Math.sin(a) * Math.cos(e) * v, tmp, size, size * 0.3, life * (0.6 + Math.random() * 0.6), 9, 1.5);
    }
  }

  explosion(x: number, z: number) {
    this.burst(x, 1, z, [0xffe14d, 0xff7a1a, 0xff3b1f, 0xffffff], 70, 16, 0.9, 0.6);
    for (let i = 0; i < 26; i++) this.smoke(x + (Math.random() - 0.5) * 2, 0.8, z + (Math.random() - 0.5) * 2, 0.35 + Math.random() * 0.3);
  }

  confetti(x: number, z: number) {
    const cols = [0xff4d6d, 0xffd21f, 0x2f6bff, 0x3ccf4e, 0x9b4dff, 0xffffff];
    for (let i = 0; i < 90; i++) {
      tmp.set(cols[i % cols.length]);
      this.smokePool.emit(x + (Math.random() - 0.5) * 6, 5 + Math.random() * 3, z + (Math.random() - 0.5) * 6, (Math.random() - 0.5) * 6, 2 + Math.random() * 5, (Math.random() - 0.5) * 6, tmp, 0.32, 0.3, 2.4, 3, 1.2);
    }
  }

  update(dt: number) {
    this.glowPool.update(dt);
    this.smokePool.update(dt);
  }
}

/** Sněžení kolem hráčů (jen na zasněžené trati). */
export class Snow {
  readonly points: THREE.Points;
  private pos: Float32Array;
  private vel: Float32Array;
  private n = 1800;
  private box = { x: 150, y: 70, z: 150 };

  constructor() {
    this.pos = new Float32Array(this.n * 3);
    this.vel = new Float32Array(this.n);
    for (let i = 0; i < this.n; i++) {
      this.pos[i * 3] = (Math.random() - 0.5) * this.box.x;
      this.pos[i * 3 + 1] = Math.random() * this.box.y;
      this.pos[i * 3 + 2] = (Math.random() - 0.5) * this.box.z;
      this.vel[i] = 2 + Math.random() * 2.5;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(this.pos, 3).setUsage(THREE.DynamicDrawUsage));
    const m = new THREE.PointsMaterial({ color: 0xffffff, size: 0.35, map: TX.glow(), transparent: true, depthWrite: false, opacity: 0.9 });
    this.points = new THREE.Points(g, m);
    this.points.frustumCulled = false;
  }

  update(dt: number, cx: number, cz: number, time: number) {
    const { x: bx, y: by, z: bz } = this.box;
    for (let i = 0; i < this.n; i++) {
      let x = this.pos[i * 3], y = this.pos[i * 3 + 1], z = this.pos[i * 3 + 2];
      y -= this.vel[i] * dt;
      x += Math.sin(time * 0.7 + i) * dt * 0.8;
      if (y < 0) y += by;
      // posouvat vločky s hráči (obal kolem středu)
      x = ((((x - cx + bx / 2) % bx) + bx) % bx) + cx - bx / 2;
      z = ((((z - cz + bz / 2) % bz) + bz) % bz) + cz - bz / 2;
      this.pos[i * 3] = x;
      this.pos[i * 3 + 1] = y;
      this.pos[i * 3 + 2] = z;
    }
    this.points.geometry.getAttribute("position").needsUpdate = true;
  }
}
