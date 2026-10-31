// Vykreslování: renderer, kamery (za zády šermíře, průlet, boční záběr na pád) a rozdělená obrazovka.
import * as THREE from "three";
import type { Fighter } from "./fighter";
import { damp, lerp } from "./util";

export interface Viewport {
  cam: THREE.PerspectiveCamera;
  /** levý / horní okraj a velikost v pixelech CSS */
  x: number;
  y: number;
  w: number;
  h: number;
  /** šermíř, jehož pohledem se dívá (zprůhlední se) */
  owner: Fighter | null;
}

/** Kamera s plynulým pohybem (poloha a cíl). */
export class CamRig {
  readonly cam = new THREE.PerspectiveCamera(50, 1, 0.08, 900);
  readonly pos = new THREE.Vector3(0, 3, 8);
  readonly look = new THREE.Vector3(0, 1, 0);
  private wantPos = new THREE.Vector3();
  private wantLook = new THREE.Vector3();
  fov = 50;
  snap = true;

  set(pos: THREE.Vector3, look: THREE.Vector3, rate = 6, dt = 0) {
    this.wantPos.copy(pos);
    this.wantLook.copy(look);
    if (this.snap || dt === 0) {
      this.pos.copy(pos);
      this.look.copy(look);
      this.snap = false;
    } else {
      const k = damp(rate, dt);
      this.pos.lerp(this.wantPos, k);
      this.look.lerp(this.wantLook, k);
    }
  }

  apply(aspect: number, shake: number, t: number) {
    this.cam.aspect = aspect;
    // úzký pohled (rozdělená obrazovka) potřebuje víc zorného pole
    this.cam.fov = aspect < 1.2 ? lerp(this.fov + 12, this.fov, (aspect - 0.7) / 0.5) : this.fov;
    this.cam.position.copy(this.pos);
    if (shake > 0) this.cam.position.add(new THREE.Vector3(Math.sin(t * 73) * shake, Math.sin(t * 91) * shake, Math.cos(t * 67) * shake));
    this.cam.lookAt(this.look);
    this.cam.updateProjectionMatrix();
  }
}

const _p = new THREE.Vector3(), _l = new THREE.Vector3();
/** kamera za zády: vzdálenost, posun do strany, výška */
export const CAM_BACK = 2.9, CAM_SIDE = 0.8, CAM_UP = 2.85;

/** Pohled za zády šermíře: kamera vlevo nad ramenem, dívá se na soupeře. */
export function behind(rig: CamRig, f: Fighter, opp: Fighter, dt: number, rate = 5) {
  behindToward(rig, f, opp.state === "stand" ? opp.z : opp.group.position.z, dt, rate);
}

/** Pohled za zády šermíře směrem k bodu na ose mola (z). */
export function behindToward(rig: CamRig, f: Fighter, targetZ: number, dt: number, rate = 5) {
  const sx = f.hand === "R" ? 1 : -1;
  const fz = f.state === "stand" ? f.z : f.group.position.z;
  const midZ = (fz + targetZ) / 2;
  const fw = f.forward(_l);
  const right = new THREE.Vector3(-fw.z, 0, fw.x);
  // za zády, kus do strany proti ruce s mečem a nad hlavou: vlastní šermíř vpravo dole, soupeř nad ním
  _p.set(f.x, 0, fz).addScaledVector(fw, -CAM_BACK).addScaledVector(right, -CAM_SIDE * sx);
  _p.y = CAM_UP;
  const look = new THREE.Vector3(f.x, 1.0, midZ).addScaledVector(fw, 0.55).addScaledVector(right, 0.05 * sx);
  rig.set(_p, look, rate, dt);
}

/** Kroužení kolem bodu `look` (úvod, lobby, vítěz). */
export function orbit(rig: CamRig, t: number, radius: number, height: number, look = new THREE.Vector3(0, 0.9, 0)) {
  _p.set(look.x + Math.sin(t) * radius, height, look.z + Math.cos(t) * radius);
  rig.set(_p, look);
}

/** Boční záběr na padajícího šermíře. */
export function sideShot(rig: CamRig, f: Fighter, dt: number) {
  const p = f.group.position;
  _p.set(p.x + 6.2, 1.6, p.z * 0.75);
  _l.set(p.x, Math.max(-1, p.y + 0.6), p.z * 0.92);
  rig.set(_p, _l, 3.2, dt);
}

export class View {
  readonly renderer: THREE.WebGLRenderer;
  readonly scene = new THREE.Scene();
  w = 1;
  h = 1;
  shake = 0;
  private t = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
    this.renderer.setPixelRatio(Math.min(2, devicePixelRatio));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.setScissorTest(true);
    addEventListener("resize", () => this.resize());
    this.resize();
  }

  resize() {
    this.w = innerWidth;
    this.h = innerHeight;
    this.renderer.setSize(this.w, this.h, false);
  }

  /** Rozložení pohledů: 1 = celá obrazovka, 2 = vlevo / vpravo. */
  layout(rigs: CamRig[], owners: (Fighter | null)[]): Viewport[] {
    if (rigs.length === 1) return [{ cam: rigs[0].cam, x: 0, y: 0, w: this.w, h: this.h, owner: owners[0] ?? null }];
    const half = Math.floor(this.w / 2);
    return [
      { cam: rigs[0].cam, x: 0, y: 0, w: half - 2, h: this.h, owner: owners[0] ?? null },
      { cam: rigs[1].cam, x: half + 2, y: 0, w: this.w - half - 2, h: this.h, owner: owners[1] ?? null },
    ];
  }

  render(vps: Viewport[], rigs: CamRig[], fighters: Fighter[], dt: number, onViewport?: (vp: Viewport) => void) {
    this.t += dt;
    this.shake = Math.max(0, this.shake - dt * 0.25);
    const r = this.renderer;
    r.setScissor(0, 0, this.w, this.h);
    r.setViewport(0, 0, this.w, this.h);
    r.setClearColor(0x0d0b26);
    r.clear();
    vps.forEach((vp, i) => {
      rigs[i].apply(vp.w / Math.max(1, vp.h), this.shake, this.t);
      for (const f of fighters) f.puppet.setOpacity(f === vp.owner && f.state === "stand" ? 0.5 : 1);
      onViewport?.(vp);
      const y = this.h - vp.y - vp.h;
      r.setViewport(vp.x, y, vp.w, vp.h);
      r.setScissor(vp.x, y, vp.w, vp.h);
      r.render(this.scene, vp.cam);
    });
  }

  /** Bod ve světě → pixely v rámci pohledu (pro nápisy). */
  project(p: THREE.Vector3, vp: Viewport) {
    const v = p.clone().project(vp.cam);
    return { x: vp.x + ((v.x + 1) / 2) * vp.w, y: vp.y + ((1 - v.y) / 2) * vp.h, behind: v.z > 1 };
  }
}
