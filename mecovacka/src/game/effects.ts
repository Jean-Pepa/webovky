// Částice: jiskry a hvězdičky při zásazích (zářivé), kapky vody a šťávy (běžné).
import * as THREE from "three";
import { rand } from "./util";

class Particles {
  readonly points: THREE.Points;
  private max: number;
  private pos: Float32Array;
  private vel: Float32Array;
  private col: Float32Array;
  private size: Float32Array;
  private life: Float32Array;
  private maxLife: Float32Array;
  private grav: Float32Array;
  private baseSize: Float32Array;
  private next = 0;
  private geo: THREE.BufferGeometry;

  constructor(max: number, additive: boolean) {
    this.max = max;
    this.pos = new Float32Array(max * 3);
    this.vel = new Float32Array(max * 3);
    this.col = new Float32Array(max * 4);
    this.size = new Float32Array(max);
    this.baseSize = new Float32Array(max);
    this.life = new Float32Array(max);
    this.maxLife = new Float32Array(max);
    this.grav = new Float32Array(max);
    this.geo = new THREE.BufferGeometry();
    this.geo.setAttribute("position", new THREE.BufferAttribute(this.pos, 3).setUsage(THREE.DynamicDrawUsage));
    this.geo.setAttribute("color", new THREE.BufferAttribute(this.col, 4).setUsage(THREE.DynamicDrawUsage));
    this.geo.setAttribute("size", new THREE.BufferAttribute(this.size, 1).setUsage(THREE.DynamicDrawUsage));
    const mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
      uniforms: { scale: { value: 600 } },
      vertexShader: `attribute float size; attribute vec4 color; varying vec4 vC; uniform float scale;
        void main(){ vC = color; vec4 mv = modelViewMatrix * vec4(position,1.0); gl_PointSize = size * scale / max(0.1, -mv.z); gl_Position = projectionMatrix * mv; }`,
      fragmentShader: `varying vec4 vC; void main(){ vec2 d = gl_PointCoord - 0.5; float r = length(d); if (r > 0.5) discard;
        float a = smoothstep(0.5, 0.15, r); gl_FragColor = vec4(vC.rgb, vC.a * a); }`,
    });
    this.points = new THREE.Points(this.geo, mat);
    this.points.frustumCulled = false;
    this.points.renderOrder = 6;
  }

  setScale(h: number) {
    (this.points.material as THREE.ShaderMaterial).uniforms.scale.value = h * 0.9;
  }

  emit(p: THREE.Vector3, v: THREE.Vector3, color: THREE.Color, size: number, life: number, grav: number) {
    const i = this.next;
    this.next = (this.next + 1) % this.max;
    this.pos.set([p.x, p.y, p.z], i * 3);
    this.vel.set([v.x, v.y, v.z], i * 3);
    this.col.set([color.r, color.g, color.b, 1], i * 4);
    this.size[i] = this.baseSize[i] = size;
    this.life[i] = this.maxLife[i] = life;
    this.grav[i] = grav;
  }

  update(dt: number) {
    for (let i = 0; i < this.max; i++) {
      if (this.life[i] <= 0) {
        this.size[i] = 0;
        continue;
      }
      this.life[i] -= dt;
      const k = Math.max(0, this.life[i] / this.maxLife[i]);
      this.vel[i * 3 + 1] -= this.grav[i] * dt;
      const drag = 1 - Math.min(1, dt * 1.5);
      for (let q = 0; q < 3; q++) {
        this.vel[i * 3 + q] *= drag;
        this.pos[i * 3 + q] += this.vel[i * 3 + q] * dt;
      }
      this.col[i * 4 + 3] = Math.min(1, k * 1.6);
      this.size[i] = this.baseSize[i] * (0.4 + 0.6 * k);
    }
    this.geo.attributes.position.needsUpdate = true;
    this.geo.attributes.color.needsUpdate = true;
    this.geo.attributes.size.needsUpdate = true;
  }
}

const _v = new THREE.Vector3(), _c = new THREE.Color();

export class Effects {
  private glow = new Particles(700, true);
  private drops = new Particles(900, false);
  readonly group = new THREE.Group();

  constructor() {
    this.group.add(this.glow.points, this.drops.points);
  }

  setViewportHeight(h: number) {
    this.glow.setScale(h);
    this.drops.setScale(h);
  }

  /** Zásah do těla: hvězdičky a jiskry v barvě útočníka. */
  hit(p: THREE.Vector3, color: number, strength: number) {
    const n = 14 + Math.round(strength * 22);
    for (let i = 0; i < n; i++) {
      _v.set(rand(-1, 1), rand(-0.6, 1.2), rand(-1, 1)).normalize().multiplyScalar(rand(2, 5 + strength * 4));
      _c.set(i % 3 === 0 ? 0xffffff : i % 3 === 1 ? 0xffd21f : color);
      this.glow.emit(p, _v, _c, rand(0.05, 0.12) * (1 + strength * 0.5), rand(0.25, 0.55), 6);
    }
  }

  /** Meč o meč: žluté jiskry (kryt = modrobílé). */
  clash(p: THREE.Vector3, block: boolean) {
    for (let i = 0; i < 26; i++) {
      _v.set(rand(-1, 1), rand(-0.4, 1.4), rand(-1, 1)).normalize().multiplyScalar(rand(2.5, 7));
      _c.set(block ? (i % 2 ? 0x9fe8ff : 0xffffff) : i % 2 ? 0xffd21f : 0xffffff);
      this.glow.emit(p, _v, _c, rand(0.03, 0.07), rand(0.2, 0.45), 9);
    }
  }

  /** Šplouchnutí: kapky vody vzhůru. */
  splash(p: THREE.Vector3, power = 1) {
    for (let i = 0; i < 140 * power; i++) {
      const a = rand(0, Math.PI * 2), r = rand(0, 0.8);
      const pos = _v.set(p.x + Math.cos(a) * r, p.y, p.z + Math.sin(a) * r).clone();
      const vel = new THREE.Vector3(Math.cos(a) * rand(0.5, 2.5), rand(3, 8) * power, Math.sin(a) * rand(0.5, 2.5));
      _c.set(i % 4 === 0 ? 0xffffff : 0xcdefff);
      this.drops.emit(pos, vel, _c, rand(0.06, 0.16), rand(0.6, 1.2), 14);
    }
  }

  /** Rozseknutá věc: šťáva v její barvě. */
  juice(p: THREE.Vector3, color: number, dir: THREE.Vector3) {
    for (let i = 0; i < 34; i++) {
      const vel = new THREE.Vector3(rand(-1, 1), rand(-0.2, 1), rand(-1, 1)).normalize().multiplyScalar(rand(1, 4)).addScaledVector(dir, 2);
      _c.set(color);
      this.drops.emit(p, vel, _c, rand(0.04, 0.1), rand(0.4, 0.9), 9);
    }
  }

  /** Konfety pro vítěze. */
  confetti(p: THREE.Vector3) {
    const cols = [0xffd21f, 0xff4d6d, 0x4fd1ff, 0x3ccf4e, 0xffffff, 0xff7a1a];
    for (let i = 0; i < 120; i++) {
      const vel = new THREE.Vector3(rand(-2, 2), rand(4, 9), rand(-2, 2));
      _c.set(cols[i % cols.length]);
      this.drops.emit(_v.copy(p), vel, _c, rand(0.07, 0.12), rand(1.5, 2.6), 5);
    }
  }

  update(dt: number) {
    this.glow.update(dt);
    this.drops.update(dt);
  }
}
