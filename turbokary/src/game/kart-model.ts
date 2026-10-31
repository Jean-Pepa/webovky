// 3D model motokáry a řidiče (zvířátka poskládaná z jednoduchých tvarů).
import * as THREE from "three";
import type { CharacterDef } from "../shared/characters";
import * as TX from "./textures";

const matCache = new Map<string, THREE.Material>();
function lambert(color: number) {
  const key = "l" + color;
  let m = matCache.get(key);
  if (!m) matCache.set(key, (m = new THREE.MeshLambertMaterial({ color })));
  return m;
}
function paint(color: number) {
  const key = "p" + color;
  let m = matCache.get(key);
  if (!m) matCache.set(key, (m = new THREE.MeshPhongMaterial({ color, shininess: 70, specular: 0x444444 })));
  return m;
}
function glowMat(color: number) {
  const key = "g" + color;
  let m = matCache.get(key);
  if (!m) matCache.set(key, (m = new THREE.MeshBasicMaterial({ color })));
  return m;
}

const BLACK = 0x1b1b1f;
const DARK = 0x2b2d36;
const METAL = 0x9aa3ad;

function box(w: number, h: number, d: number, mat: THREE.Material, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z);
  return m;
}
function sphere(r: number, mat: THREE.Material, x = 0, y = 0, z = 0, seg = 14) {
  const m = new THREE.Mesh(new THREE.SphereGeometry(r, seg, Math.max(6, seg - 4)), mat);
  m.position.set(x, y, z);
  return m;
}
function cone(r: number, h: number, mat: THREE.Material, seg = 8) {
  return new THREE.Mesh(new THREE.ConeGeometry(r, h, seg), mat);
}

export interface KartVisual {
  root: THREE.Group;
  body: THREE.Group;
  steerPivots: THREE.Object3D[];
  spinners: THREE.Object3D[];
  head: THREE.Group;
  shield: THREE.Mesh;
  shadow: THREE.Mesh;
  /** místní souřadnice výfuků a zadních kol (pro plameny a jiskry) */
  exhaustLocal: THREE.Vector3[];
  wheelLocal: THREE.Vector3[];
  label: THREE.Sprite | null;
}

function eyes(g: THREE.Group, y: number, z: number, spread: number, size = 0.075) {
  for (const sx of [-1, 1]) {
    g.add(sphere(size, lambert(0xffffff), sx * spread, y, z, 10));
    g.add(sphere(size * 0.55, lambert(BLACK), sx * spread, y, z + size * 0.75, 8));
  }
}

function buildHead(c: CharacterDef): THREE.Group {
  const g = new THREE.Group();
  const fur = lambert(c.fur), fur2 = lambert(c.fur2);
  switch (c.style) {
    case "fox": {
      g.add(sphere(0.34, fur));
      const snout = cone(0.17, 0.38, fur2);
      snout.rotation.x = Math.PI / 2;
      snout.position.set(0, -0.08, 0.38);
      g.add(snout);
      g.add(sphere(0.06, lambert(BLACK), 0, -0.07, 0.57, 8));
      for (const sx of [-1, 1]) {
        const ear = cone(0.13, 0.32, fur, 4);
        ear.position.set(sx * 0.19, 0.34, -0.02);
        ear.rotation.z = -sx * 0.25;
        g.add(ear);
        const tip = cone(0.06, 0.12, lambert(BLACK), 4);
        tip.position.set(sx * 0.225, 0.47, -0.02);
        tip.rotation.z = -sx * 0.25;
        g.add(tip);
        g.add(sphere(0.12, fur2, sx * 0.17, -0.13, 0.2, 10));
      }
      eyes(g, 0.07, 0.27, 0.13);
      break;
    }
    case "frog": {
      const h = sphere(0.34, fur);
      h.scale.set(1.25, 0.8, 1.05);
      g.add(h);
      const chin = sphere(0.3, fur2, 0, -0.12, 0.1);
      chin.scale.set(1.15, 0.5, 0.95);
      g.add(chin);
      for (const sx of [-1, 1]) g.add(sphere(0.15, fur, sx * 0.18, 0.24, 0.12, 12));
      eyes(g, 0.27, 0.22, 0.18, 0.09);
      const mouth = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.02, 4, 14, Math.PI), lambert(0x7a1f2b));
      mouth.position.set(0, -0.04, 0.31);
      mouth.rotation.set(0.3, 0, Math.PI);
      g.add(mouth);
      break;
    }
    case "penguin": {
      g.add(sphere(0.35, fur));
      const face = sphere(0.3, fur2, 0, -0.03, 0.16);
      face.scale.set(0.85, 0.8, 0.6);
      g.add(face);
      const beak = cone(0.08, 0.24, lambert(0xffa31a), 6);
      beak.rotation.x = Math.PI / 2;
      beak.position.set(0, -0.07, 0.42);
      g.add(beak);
      eyes(g, 0.07, 0.3, 0.11, 0.065);
      break;
    }
    case "bunny": {
      g.add(sphere(0.34, fur));
      for (const sx of [-1, 1]) {
        const ear = new THREE.Mesh(new THREE.CapsuleGeometry(0.085, 0.42, 4, 8), fur);
        ear.position.set(sx * 0.13, 0.55, -0.04);
        ear.rotation.z = -sx * 0.18;
        g.add(ear);
        const inner = new THREE.Mesh(new THREE.CapsuleGeometry(0.045, 0.34, 4, 6), fur2);
        inner.position.set(sx * 0.135, 0.55, 0.03);
        inner.rotation.z = -sx * 0.18;
        g.add(inner);
        g.add(sphere(0.1, lambert(0xffd6e0), sx * 0.17, -0.12, 0.22, 10));
      }
      g.add(sphere(0.055, lambert(0xff7aa2), 0, -0.03, 0.34, 8));
      g.add(box(0.1, 0.07, 0.03, lambert(0xffffff), 0, -0.14, 0.31));
      eyes(g, 0.08, 0.27, 0.13);
      break;
    }
    case "cat": {
      g.add(sphere(0.34, fur));
      for (const sx of [-1, 1]) {
        const ear = cone(0.13, 0.24, fur, 4);
        ear.position.set(sx * 0.2, 0.3, 0);
        ear.rotation.z = -sx * 0.3;
        g.add(ear);
        const inner = cone(0.07, 0.14, lambert(0xffb3c9), 4);
        inner.position.set(sx * 0.2, 0.3, 0.05);
        inner.rotation.z = -sx * 0.3;
        g.add(inner);
        for (const dy of [0, -0.05]) {
          const wh = box(0.26, 0.012, 0.012, lambert(0x222222), sx * 0.3, -0.1 + dy, 0.26);
          wh.rotation.z = sx * (dy ? -0.15 : 0.12);
          g.add(wh);
        }
      }
      const muzzle = sphere(0.18, fur2, 0, -0.12, 0.24);
      muzzle.scale.set(1.2, 0.7, 0.8);
      g.add(muzzle);
      g.add(sphere(0.045, lambert(0xff7aa2), 0, -0.06, 0.37, 8));
      eyes(g, 0.07, 0.27, 0.13);
      break;
    }
    case "bear": {
      g.add(sphere(0.35, fur));
      for (const sx of [-1, 1]) {
        g.add(sphere(0.12, fur, sx * 0.25, 0.27, -0.02, 10));
        g.add(sphere(0.065, fur2, sx * 0.25, 0.27, 0.05, 8));
      }
      const muzzle = sphere(0.17, fur2, 0, -0.11, 0.26);
      muzzle.scale.set(1.15, 0.8, 0.85);
      g.add(muzzle);
      g.add(sphere(0.07, lambert(BLACK), 0, -0.04, 0.41, 8));
      eyes(g, 0.08, 0.28, 0.13, 0.065);
      break;
    }
    case "robot": {
      g.add(box(0.56, 0.5, 0.52, paint(c.fur)));
      g.add(box(0.48, 0.2, 0.05, lambert(0x14151a), 0, 0.03, 0.27));
      for (const sx of [-1, 1]) {
        g.add(box(0.12, 0.06, 0.02, glowMat(c.fur2), sx * 0.11, 0.04, 0.3));
        const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.08, 10), lambert(METAL));
        bolt.rotation.z = Math.PI / 2;
        bolt.position.set(sx * 0.31, 0, 0);
        g.add(bolt);
      }
      const ant = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.26, 6), lambert(METAL));
      ant.position.set(0, 0.38, 0);
      g.add(ant);
      g.add(sphere(0.06, glowMat(0xff3355), 0, 0.53, 0, 8));
      g.add(box(0.26, 0.04, 0.02, lambert(0x14151a), 0, -0.14, 0.27));
      break;
    }
    case "pig": {
      g.add(sphere(0.35, fur));
      const snout = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.14, 0.12, 14), fur2);
      snout.rotation.x = Math.PI / 2;
      snout.position.set(0, -0.07, 0.35);
      g.add(snout);
      for (const sx of [-1, 1]) {
        g.add(sphere(0.03, lambert(0x8a3a4d), sx * 0.05, -0.07, 0.415, 6));
        const ear = cone(0.11, 0.2, fur, 4);
        ear.position.set(sx * 0.21, 0.29, 0.04);
        ear.rotation.set(0.55, 0, -sx * 0.4);
        g.add(ear);
      }
      eyes(g, 0.09, 0.28, 0.13, 0.065);
      break;
    }
  }
  return g;
}

function wheel(r: number, w: number, hub: number) {
  const pivot = new THREE.Group();
  const spin = new THREE.Group();
  pivot.add(spin);
  const tire = new THREE.Mesh(new THREE.CylinderGeometry(r, r, w, 16), lambert(BLACK));
  tire.rotation.z = Math.PI / 2;
  spin.add(tire);
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.45, r * 0.45, w + 0.02, 8), lambert(hub));
  cap.rotation.z = Math.PI / 2;
  spin.add(cap);
  // „paprsek“, aby bylo vidět otáčení
  spin.add(box(w + 0.03, r * 0.25, r * 1.5, lambert(DARK)));
  return { pivot, spin };
}

let shadowTex: THREE.Texture | null = null;

export function buildKart(c: CharacterDef, label: string | null): KartVisual {
  const root = new THREE.Group();
  const body = new THREE.Group();
  root.add(body);
  const kart = paint(c.kart);
  const accent = paint(c.accent);
  const dark = lambert(DARK);

  body.add(box(1.45, 0.07, 2.35, dark, 0, 0.2, 0));
  body.add(box(1.25, 0.22, 2.05, kart, 0, 0.33, -0.02));
  const nose = box(1.05, 0.2, 0.75, kart, 0, 0.36, 1.28);
  nose.rotation.x = 0.16;
  body.add(nose);
  body.add(box(1.55, 0.14, 0.18, dark, 0, 0.25, 1.62));
  for (const sx of [-1, 1]) body.add(box(0.32, 0.3, 1.3, accent, sx * 0.8, 0.37, 0.05));
  body.add(box(0.78, 0.13, 0.62, dark, 0, 0.47, -0.32));
  body.add(box(0.78, 0.6, 0.16, dark, 0, 0.72, -0.58));
  body.add(box(0.88, 0.42, 0.55, lambert(0x3b3f4a), 0, 0.56, -1.0));
  body.add(box(0.9, 0.08, 0.57, kart, 0, 0.8, -1.0));
  const exhaustLocal: THREE.Vector3[] = [];
  for (const sx of [-1, 1]) {
    const ex = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.095, 0.42, 10), lambert(METAL));
    ex.rotation.x = Math.PI / 2;
    ex.position.set(sx * 0.26, 0.62, -1.38);
    body.add(ex);
    exhaustLocal.push(new THREE.Vector3(sx * 0.26, 0.62, -1.62));
    body.add(box(0.06, 0.4, 0.12, dark, sx * 0.5, 0.86, -1.22));
  }
  body.add(box(1.55, 0.07, 0.4, kart, 0, 1.08, -1.24));
  for (const sx of [-1, 1]) body.add(box(0.06, 0.3, 0.42, accent, sx * 0.78, 1.0, -1.24));
  // volant
  const col = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.5, 6), dark);
  col.position.set(0, 0.66, 0.5);
  col.rotation.x = -0.9;
  body.add(col);
  const wheelRim = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.035, 6, 16), dark);
  wheelRim.position.set(0, 0.86, 0.32);
  wheelRim.rotation.x = -0.9;
  body.add(wheelRim);
  // řidič
  const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.3, 0.52, 12), lambert(c.shirt));
  torso.position.set(0, 0.92, -0.4);
  body.add(torso);
  for (const sx of [-1, 1]) {
    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.55, 6), lambert(c.shirt));
    arm.position.set(sx * 0.24, 0.98, -0.08);
    arm.rotation.x = 1.15;
    arm.rotation.z = sx * 0.15;
    body.add(arm);
    body.add(sphere(0.075, lambert(c.style === "robot" ? METAL : c.fur), sx * 0.17, 0.86, 0.22, 8));
  }
  // šátek v barvě motokáry
  const scarf = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.06, 6, 14), lambert(c.kart));
  scarf.rotation.x = Math.PI / 2;
  scarf.position.set(0, 1.17, -0.36);
  body.add(scarf);
  const head = buildHead(c);
  head.position.set(0, 1.45, -0.34);
  body.add(head);

  // kola
  const steerPivots: THREE.Object3D[] = [];
  const spinners: THREE.Object3D[] = [];
  const wheelLocal: THREE.Vector3[] = [];
  for (const sx of [-1, 1]) {
    const rw = wheel(0.34, 0.36, c.accent);
    rw.pivot.position.set(sx * 0.84, 0.34, -0.78);
    body.add(rw.pivot);
    spinners.push(rw.spin);
    wheelLocal.push(new THREE.Vector3(sx * 0.84, 0.05, -0.95));
    const fw = wheel(0.29, 0.28, c.accent);
    fw.pivot.position.set(sx * 0.8, 0.29, 0.86);
    body.add(fw.pivot);
    spinners.push(fw.spin);
    steerPivots.push(fw.pivot);
  }

  const shield = new THREE.Mesh(
    new THREE.SphereGeometry(1.75, 22, 14),
    new THREE.MeshBasicMaterial({
      color: 0x7cf3ff,
      transparent: true,
      opacity: 0.28,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );
  shield.position.y = 0.8;
  shield.visible = false;
  root.add(shield);

  shadowTex ??= TX.blobShadow();
  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(2.3, 3.1),
    new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -4,
      polygonOffsetUnits: -16,
    }),
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.05;
  root.add(shadow);

  let sprite: THREE.Sprite | null = null;
  if (label) {
    sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: TX.nameTag(label, c.kart), depthWrite: false, transparent: true }),
    );
    sprite.scale.set(3.4, 0.85, 1);
    sprite.position.y = 2.75;
    sprite.renderOrder = 5;
    root.add(sprite);
  }

  return { root, body, steerPivots, spinners, head, shield, shadow, exhaustLocal, wheelLocal, label: sprite };
}
