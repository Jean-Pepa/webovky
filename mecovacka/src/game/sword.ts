// Pěnový meč (model od Astry nebo náhrada z tvarů) a světelná stopa za čepelí.
import * as THREE from "three";
import type { CharacterDef } from "../shared/characters";
import { MODELS, findNode } from "./models";
import { lambert } from "./puppet";

/** Délka meče od středu rukojeti ke špičce (náhrada z tvarů). */
export const SWORD_LEN = 1.16;
/** Od středu rukojeti k záštitě — odtud začíná čepel. */
export const BLADE_START = 0.15;
/** Poloměr čepele pro srážky. */
export const BLADE_R = 0.05;

function proceduralSword(main: number, accent: number): THREE.Group {
  const g = new THREE.Group();
  const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.034, 0.22, 10), lambert(0x2a2238));
  g.add(grip);
  const pommel = new THREE.Mesh(new THREE.SphereGeometry(0.048, 10, 8), lambert(accent));
  pommel.position.y = -0.13;
  g.add(pommel);
  const guard = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.05, 0.08), lambert(accent));
  guard.position.y = 0.13;
  g.add(guard);
  const bladeLen = SWORD_LEN - BLADE_START - 0.05;
  const blade = new THREE.Mesh(new THREE.CylinderGeometry(0.047, 0.052, bladeLen, 12), lambert(main));
  blade.position.y = BLADE_START + bladeLen / 2;
  blade.name = "blade";
  g.add(blade);
  const tip = new THREE.Mesh(new THREE.SphereGeometry(0.048, 12, 8), lambert(0xffffff));
  tip.position.y = SWORD_LEN - 0.05;
  g.add(tip);
  // proužky na pěně
  for (const y of [0.35, 0.6, 0.85]) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.008, 4, 14), lambert(0xffffff));
    ring.rotation.x = Math.PI / 2;
    ring.position.y = y;
    g.add(ring);
  }
  g.traverse((o) => ((o as THREE.Mesh).castShadow = true));
  return g;
}

export class SwordVisual {
  /** počátek = střed rukojeti, čepel míří do +Y */
  readonly root = new THREE.Group();
  /** délka od středu rukojeti ke špičce */
  length = SWORD_LEN;
  bladeStart = BLADE_START;
  private glint: THREE.Sprite;
  private procedural = false;

  constructor(c: CharacterDef | null) {
    const main = c ? c.main : 0xb08a52, accent = c ? c.accent : 0x6b4a2a;
    const tpl = (c && MODELS.swords.get(String(c.id))) || MODELS.sword;
    if (tpl) {
      const m = tpl.clone(true);
      m.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (!mesh.isMesh) return;
        const fix = (mt: THREE.Material) => {
          const name = mt.name.toLowerCase();
          if (name === "foam" || name === "accent") {
            const cl = mt.clone() as THREE.MeshStandardMaterial;
            cl.color?.setHex(name === "foam" ? main : accent);
            return cl;
          }
          return mt;
        };
        mesh.material = Array.isArray(mesh.material) ? mesh.material.map(fix) : fix(mesh.material);
        mesh.castShadow = true;
      });
      this.root.add(m);
      const tip = findNode(m, "tip");
      if (tip) this.length = tip.position.length();
      else {
        const bb = new THREE.Box3().setFromObject(m);
        this.length = Math.max(0.6, bb.max.y);
      }
      const guard = findNode(m, "guard");
      if (guard) this.bladeStart = Math.max(0.05, guard.position.y);
    } else {
      this.root.add(proceduralSword(main, accent));
      this.procedural = true;
    }
    // záblesk na špičce (počítač ukazuje, že se chystá udeřit)
    this.glint = new THREE.Sprite(new THREE.SpriteMaterial({ map: glintTexture(), color: 0xffffff, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
    this.glint.position.y = this.length - 0.02;
    if (c) {
      // delší / kratší meč podle postavy
      this.root.scale.setScalar(c.stats.reach);
      this.length *= c.stats.reach;
      this.bladeStart *= c.stats.reach;
    }
    this.glint.scale.setScalar(0.001);
    this.root.add(this.glint);
  }

  dispose() {
    this.root.removeFromParent();
    this.glint.material.dispose();
    if (this.procedural)
      this.root.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.isMesh) m.geometry.dispose();
      });
  }

  /** Záblesk 0…1. */
  setGlint(v: number) {
    const s = v * 0.55;
    this.glint.scale.setScalar(Math.max(0.001, s));
    this.glint.material.opacity = Math.min(1, v);
    this.glint.material.rotation += 0.15;
  }
}

let glintTex: THREE.Texture | null = null;
function glintTexture() {
  if (glintTex) return glintTex;
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d")!;
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grd.addColorStop(0, "rgba(255,255,255,1)");
  grd.addColorStop(0.25, "rgba(255,240,180,0.8)");
  grd.addColorStop(1, "rgba(255,240,180,0)");
  g.fillStyle = grd;
  g.fillRect(0, 0, 64, 64);
  g.fillStyle = "rgba(255,255,255,0.9)";
  g.fillRect(30, 0, 4, 64);
  g.fillRect(0, 30, 64, 4);
  glintTex = new THREE.CanvasTexture(c);
  return glintTex;
}

/** Stopa za čepelí: pás posledních poloh čepele, slábne s věkem a sílí s rychlostí. */
export class Trail {
  readonly mesh: THREE.Mesh;
  private n: number;
  private base: Float32Array;
  private tip: Float32Array;
  private alpha: Float32Array;
  private pos: THREE.BufferAttribute;
  private col: THREE.BufferAttribute;
  private color: THREE.Color;
  private head = 0;
  private filled = 0;

  constructor(color: number, n = 18) {
    this.n = n;
    this.color = new THREE.Color(color).lerp(new THREE.Color(0xffffff), 0.35);
    this.base = new Float32Array(n * 3);
    this.tip = new Float32Array(n * 3);
    this.alpha = new Float32Array(n);
    const geo = new THREE.BufferGeometry();
    this.pos = new THREE.BufferAttribute(new Float32Array(n * 2 * 3), 3);
    this.pos.setUsage(THREE.DynamicDrawUsage);
    this.col = new THREE.BufferAttribute(new Float32Array(n * 2 * 4), 4);
    this.col.setUsage(THREE.DynamicDrawUsage);
    geo.setAttribute("position", this.pos);
    geo.setAttribute("color", this.col);
    const idx: number[] = [];
    for (let i = 0; i < n - 1; i++) {
      const a = i * 2, b = i * 2 + 1, c = (i + 1) * 2, d = (i + 1) * 2 + 1;
      idx.push(a, b, c, b, d, c);
    }
    geo.setIndex(idx);
    this.mesh = new THREE.Mesh(
      geo,
      new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending }),
    );
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = 5;
  }

  /** Přidá aktuální polohu čepele (svět) s průhledností podle rychlosti švihu. */
  push(base: THREE.Vector3, tip: THREE.Vector3, strength: number) {
    this.head = (this.head + 1) % this.n;
    const i = this.head;
    base.toArray(this.base, i * 3);
    tip.toArray(this.tip, i * 3);
    this.alpha[i] = strength;
    this.filled = Math.min(this.n, this.filled + 1);
    const p = this.pos.array as Float32Array, c = this.col.array as Float32Array;
    for (let k = 0; k < this.n; k++) {
      // k = 0 je nejnovější
      const j = (this.head - k + this.n) % this.n;
      const valid = k < this.filled;
      const age = 1 - k / (this.n - 1);
      const a = valid ? this.alpha[j] * age * age : 0;
      for (let q = 0; q < 3; q++) {
        p[k * 6 + q] = this.base[j * 3 + q];
        p[k * 6 + 3 + q] = this.tip[j * 3 + q];
      }
      const o = k * 8;
      c[o] = this.color.r * 0.5;
      c[o + 1] = this.color.g * 0.5;
      c[o + 2] = this.color.b * 0.5;
      c[o + 3] = a * 0.15;
      c[o + 4] = this.color.r;
      c[o + 5] = this.color.g;
      c[o + 6] = this.color.b;
      c[o + 7] = a * 0.85;
    }
    this.pos.needsUpdate = true;
    this.col.needsUpdate = true;
  }

  clear() {
    this.filled = 0;
    this.alpha.fill(0);
  }

  dispose() {
    this.mesh.removeFromParent();
    this.mesh.geometry.dispose();
    (this.mesh.material as THREE.Material).dispose();
  }
}
