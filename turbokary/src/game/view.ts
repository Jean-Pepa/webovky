// Vykreslování: renderer, kamery za motokárami, rozdělená obrazovka pro 1–4 hráče.
import * as THREE from "three";
import { MAX_SPEED, type Kart } from "./kart";
import type { Track } from "./track";
import type { Effects } from "./effects";
import { clamp, damp, dampAngle } from "./util";

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export class ChaseCam {
  readonly cam = new THREE.PerspectiveCamera(68, 1, 0.5, 2600);
  private yaw = 0;
  private pos = new THREE.Vector3();
  private look = new THREE.Vector3();
  private fov = 68;
  shake = 0;

  constructor(slot: number) {
    this.cam.layers.enableAll();
    if (slot >= 0) this.cam.layers.disable(1 + slot);
  }

  snap(k: Kart) {
    this.yaw = k.heading;
    const fx = Math.sin(this.yaw), fz = Math.cos(this.yaw);
    this.pos.set(k.x - fx * 6.4, 2.7, k.z - fz * 6.4);
    this.look.set(k.x + fx * 4, 1.1, k.z + fz * 4);
    this.cam.position.copy(this.pos);
    this.cam.lookAt(this.look);
  }

  update(k: Kart, dt: number) {
    const sp = Math.hypot(k.vx, k.vz);
    const velYaw = sp > 3 && k.vF > 0 ? Math.atan2(k.vx, k.vz) : k.heading;
    const target = dampAngle(k.heading, velYaw, 1, 0.35);
    this.yaw = dampAngle(this.yaw, target, 5.5, dt);
    const fx = Math.sin(this.yaw), fz = Math.cos(this.yaw);
    const want = new THREE.Vector3(k.x - fx * 6.4, 2.7 + k.y * 0.6, k.z - fz * 6.4);
    this.pos.lerp(want, 1 - Math.exp(-12 * dt));
    this.look.set(k.x + fx * 4, 1.1 + k.y * 0.5, k.z + fz * 4);
    const f = 66 + 10 * clamp(k.vF / MAX_SPEED, 0, 1.4) + (k.boostT > 0 ? 6 : 0);
    this.fov = damp(this.fov, f, 4, dt);
    this.cam.fov = this.fov;
    this.cam.position.copy(this.pos);
    if (this.shake > 0) {
      this.shake = Math.max(0, this.shake - dt * 2.5);
      const s = this.shake * 0.35;
      this.cam.position.x += (Math.random() - 0.5) * s;
      this.cam.position.y += (Math.random() - 0.5) * s;
    }
    this.cam.lookAt(this.look);
  }
}

export class View {
  readonly renderer: THREE.WebGLRenderer;
  readonly scene = new THREE.Scene();
  readonly cams = [0, 1, 2, 3].map((i) => new ChaseCam(i));
  private overview = new THREE.PerspectiveCamera(50, 1, 1, 3200);
  private attractCam = new THREE.PerspectiveCamera(58, 1, 0.5, 2600);
  private attractT = 0;
  private attractMode = 0;
  private attractKart = 0;
  private chase = new ChaseCam(-1);
  width = 1;
  height = 1;

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.overview.layers.enableAll();
    this.attractCam.layers.enableAll();
    this.resize();
    addEventListener("resize", () => this.resize());
  }

  resize() {
    this.width = innerWidth;
    this.height = innerHeight;
    const big = this.width * devicePixelRatio > 2600;
    this.renderer.setPixelRatio(big ? 1 : Math.min(devicePixelRatio, 1.5));
    this.renderer.setSize(this.width, this.height, false);
  }

  setTrack(track: Track) {
    const th = track.theme;
    this.scene.fog = new THREE.Fog(th.skyHorizon, th.fogNear, th.fogFar);
    this.scene.background = new THREE.Color(th.skyHorizon);
  }

  /** Rozložení výřezů (souřadnice CSS, počátek vlevo nahoře). */
  layout(n: number): Rect[] {
    const W = this.width, H = this.height;
    if (n <= 1) return [{ x: 0, y: 0, w: W, h: H }];
    if (n === 2) return [{ x: 0, y: 0, w: W, h: Math.floor(H / 2) }, { x: 0, y: Math.floor(H / 2), w: W, h: H - Math.floor(H / 2) }];
    const w2 = Math.floor(W / 2), h2 = Math.floor(H / 2);
    return [
      { x: 0, y: 0, w: w2, h: h2 },
      { x: w2, y: 0, w: W - w2, h: h2 },
      { x: 0, y: h2, w: w2, h: H - h2 },
      { x: w2, y: h2, w: W - w2, h: H - h2 },
    ];
  }

  private draw(cam: THREE.PerspectiveCamera, r: Rect, fx: Effects) {
    const gl = this.renderer;
    const y = this.height - r.y - r.h;
    gl.setViewport(r.x, y, r.w, r.h);
    gl.setScissor(r.x, y, r.w, r.h);
    cam.aspect = r.w / Math.max(1, r.h);
    cam.updateProjectionMatrix();
    fx.setViewport(r.h * gl.getPixelRatio(), cam.fov);
    gl.render(this.scene, cam);
  }

  snapCams(humans: Kart[]) {
    humans.forEach((k, i) => this.cams[i].snap(k));
  }

  shake(index: number, amount: number) {
    const c = this.cams[index];
    if (c) c.shake = Math.max(c.shake, amount);
  }

  renderRace(track: Track, fx: Effects, humans: Kart[], all: Kart[], dt: number) {
    const rects = this.layout(humans.length);
    this.renderer.setScissorTest(true);
    humans.forEach((k, i) => {
      this.cams[i].update(k, dt);
      this.draw(this.cams[i].cam, rects[i], fx);
    });
    if (humans.length === 3) {
      this.updateOverview(track, all, dt);
      this.draw(this.overview, rects[3], fx);
    }
    if (humans.length === 0) {
      this.updateAttract(track, all, dt);
      this.draw(this.attractCam, rects[0], fx);
    }
    this.renderer.setScissorTest(false);
    return rects;
  }

  renderAttract(track: Track, fx: Effects, karts: Kart[], dt: number) {
    this.renderer.setScissorTest(true);
    this.updateAttract(track, karts, dt);
    this.draw(this.attractCam, { x: 0, y: 0, w: this.width, h: this.height }, fx);
    this.renderer.setScissorTest(false);
  }

  /** Průlet kamerou nad tratí ke startovnímu roštu (t = 0 → 1). */
  renderIntro(track: Track, fx: Effects, t: number) {
    const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    const L = track.length;
    const p = track.pointAt(L - 170 + 150 * e, 26 * (1 - e));
    const look = track.pointAt(L - 12, 0);
    const cam = this.attractCam;
    cam.position.set(p.x, 6 + 46 * (1 - e), p.z);
    cam.lookAt(look.x, 1, look.z);
    cam.fov = 60;
    this.renderer.setScissorTest(true);
    this.draw(cam, { x: 0, y: 0, w: this.width, h: this.height }, fx);
    this.renderer.setScissorTest(false);
  }

  /** Kamera kroužící kolem vítěze (při výsledcích). */
  renderPodium(track: Track, fx: Effects, k: Kart, dt: number) {
    this.attractT += dt;
    const a = this.attractT * 0.45;
    const cam = this.attractCam;
    cam.position.set(k.x + Math.cos(a) * 8.5, 3.2, k.z + Math.sin(a) * 8.5);
    cam.lookAt(k.x, 1.1, k.z);
    cam.fov = 55;
    this.renderer.setScissorTest(true);
    this.draw(cam, { x: 0, y: 0, w: this.width, h: this.height }, fx);
    this.renderer.setScissorTest(false);
    void track;
  }

  private updateOverview(track: Track, karts: Kart[], dt: number) {
    this.attractT += dt;
    const lead = karts.reduce((a, b) => (b.dist > a.dist ? b : a), karts[0]);
    const a = this.attractT * 0.15;
    this.overview.position.set(lead.x + Math.cos(a) * 60, 55, lead.z + Math.sin(a) * 60);
    this.overview.lookAt(lead.x, 0, lead.z);
    void track;
  }

  private updateAttract(track: Track, karts: Kart[], dt: number) {
    this.attractT += dt;
    if (this.attractT > 9) {
      this.attractT = 0;
      this.attractMode = (this.attractMode + 1) % 2;
      this.attractKart = (this.attractKart + 1) % Math.max(1, karts.length);
      if (karts[this.attractKart]) this.chase.snap(karts[this.attractKart]);
    }
    const c = track.center;
    if (this.attractMode === 0 && karts.length) {
      const k = karts[this.attractKart % karts.length];
      this.chase.update(k, dt);
      this.attractCam.position.copy(this.chase.cam.position);
      this.attractCam.position.y += 2.5;
      this.attractCam.quaternion.copy(this.chase.cam.quaternion);
      this.attractCam.rotateX(-0.12);
      this.attractCam.fov = 64;
    } else {
      const R = Math.max(track.bounds.maxX - track.bounds.minX, track.bounds.maxZ - track.bounds.minZ) * 0.62;
      const a = performance.now() * 0.00005;
      this.attractCam.position.set(c.x + Math.cos(a) * R, 95, c.z + Math.sin(a) * R);
      this.attractCam.lookAt(c.x, 0, c.z);
      this.attractCam.fov = 55;
    }
  }
}
