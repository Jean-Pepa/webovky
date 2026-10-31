// Šermíř jako loutka z kloubů: boky, trup, hlava, paže (rameno–loket–zápěstí), nohy.
// Model od Codexu (fighters/<id>.glb) má stejné pojmenované uzly; když chybí, postaví se z tvarů.
// Ruka s mečem se dopočítá inverzní kinematikou: meč je přesně podle telefonu (1:1)
// a paže se k němu natáhne.
import * as THREE from "three";
import type { CharacterDef } from "../shared/characters";
import { MODELS, findNode } from "./models";
import { clamp } from "./util";

const matCache = new Map<string, THREE.Material>();
export function lambert(color: number) {
  const key = "l" + color;
  let m = matCache.get(key);
  if (!m) matCache.set(key, (m = new THREE.MeshLambertMaterial({ color })));
  return m;
}
export function glow(color: number) {
  const key = "g" + color;
  let m = matCache.get(key);
  if (!m) matCache.set(key, (m = new THREE.MeshBasicMaterial({ color })));
  return m;
}

const BLACK = 0x1b1b1f;
const METAL = 0x9aa3ad;
const PANTS = 0x2b2d42;

function mesh(geo: THREE.BufferGeometry, mat: THREE.Material, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z);
  m.castShadow = true;
  return m;
}
const sphere = (r: number, mat: THREE.Material, x = 0, y = 0, z = 0, seg = 14) =>
  mesh(new THREE.SphereGeometry(r, seg, Math.max(6, seg - 4)), mat, x, y, z);
const box = (w: number, h: number, d: number, mat: THREE.Material, x = 0, y = 0, z = 0) => mesh(new THREE.BoxGeometry(w, h, d), mat, x, y, z);
const cone = (r: number, h: number, mat: THREE.Material, seg = 8) => mesh(new THREE.ConeGeometry(r, h, seg), mat);
/** kapsle od počátku dolů o délce len (pro končetiny visící v klidu dolů) */
function limb(r: number, len: number, mat: THREE.Material) {
  const m = mesh(new THREE.CapsuleGeometry(r, Math.max(0.01, len - 2 * r), 4, 8), mat);
  m.position.y = -len / 2;
  return m;
}

function eyes(g: THREE.Group, y: number, z: number, spread: number, size = 0.075) {
  for (const sx of [-1, 1]) {
    g.add(sphere(size, lambert(0xffffff), sx * spread, y, z, 10));
    g.add(sphere(size * 0.55, lambert(BLACK), sx * spread, y, z + size * 0.75, 8));
  }
}

/** Hlava zvířátka (stejné tvary jako v TurboKárách), dívá se do +Z. */
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
      const mouth = mesh(new THREE.TorusGeometry(0.17, 0.02, 4, 14, Math.PI), lambert(0x7a1f2b), 0, -0.04, 0.31);
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
        const ear = mesh(new THREE.CapsuleGeometry(0.085, 0.42, 4, 8), fur, sx * 0.13, 0.55, -0.04);
        ear.rotation.z = -sx * 0.18;
        g.add(ear);
        const inner = mesh(new THREE.CapsuleGeometry(0.045, 0.34, 4, 6), fur2, sx * 0.135, 0.55, 0.03);
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
      g.add(box(0.56, 0.5, 0.52, lambert(c.fur)));
      g.add(box(0.48, 0.2, 0.05, lambert(0x14151a), 0, 0.03, 0.27));
      for (const sx of [-1, 1]) {
        g.add(box(0.12, 0.06, 0.02, glow(c.fur2), sx * 0.11, 0.04, 0.3));
        const bolt = mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.08, 10), lambert(METAL), sx * 0.31, 0, 0);
        bolt.rotation.z = Math.PI / 2;
        g.add(bolt);
      }
      g.add(mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.26, 6), lambert(METAL), 0, 0.38, 0));
      g.add(sphere(0.06, glow(0xff3355), 0, 0.53, 0, 8));
      g.add(box(0.26, 0.04, 0.02, lambert(0x14151a), 0, -0.14, 0.27));
      break;
    }
    case "pig": {
      g.add(sphere(0.35, fur));
      const snout = mesh(new THREE.CylinderGeometry(0.13, 0.14, 0.12, 14), fur2, 0, -0.07, 0.35);
      snout.rotation.x = Math.PI / 2;
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
  // šermířská čelenka v barvě postavy
  const band = mesh(new THREE.TorusGeometry(0.335, 0.045, 6, 22), lambert(c.main), 0, 0.12, 0);
  band.rotation.x = Math.PI / 2 - 0.12;
  if (c.style !== "robot") g.add(band);
  return g;
}

export type JointName =
  | "hips"
  | "torso"
  | "head"
  | "upperarm_r"
  | "forearm_r"
  | "hand_r"
  | "grip_r"
  | "upperarm_l"
  | "forearm_l"
  | "hand_l"
  | "grip_l"
  | "thigh_r"
  | "shin_r"
  | "thigh_l"
  | "shin_l";
const JOINTS: JointName[] = [
  "hips", "torso", "head", "upperarm_r", "forearm_r", "hand_r", "grip_r", "upperarm_l", "forearm_l", "hand_l", "grip_l", "thigh_r", "shin_r", "thigh_l", "shin_l",
];

/** Loutka z tvarů — stejná hierarchie uzlů jako model od Codexu (dívá se do +Z, pravá strana = −X). */
function proceduralFighter(c: CharacterDef | null): THREE.Group {
  const root = new THREE.Group();
  const main = c ? c.main : 0xc9a46a;
  const shirt = c ? c.shirt : 0xb08a52;
  const skin = c ? (c.style === "robot" ? METAL : c.fur) : 0xd8b878;
  const node = (name: JointName, parent: THREE.Object3D, x: number, y: number, z: number) => {
    const g = new THREE.Group();
    g.name = name;
    g.position.set(x, y, z);
    parent.add(g);
    return g;
  };
  const hips = node("hips", root, 0, 0.74, 0);
  hips.add(box(0.42, 0.2, 0.26, lambert(c ? PANTS : 0xb08a52), 0, -0.02, 0));
  const torso = node("torso", hips, 0, 0.06, 0);
  if (c) {
    const body = mesh(new THREE.CapsuleGeometry(0.25, 0.26, 4, 12), lambert(shirt), 0, 0.24, 0);
    body.scale.set(1, 1, 0.82);
    torso.add(body);
    // vycpaná šermířská vesta
    const vest = mesh(new THREE.CylinderGeometry(0.27, 0.29, 0.36, 12, 1, true), lambert(main), 0, 0.2, 0);
    vest.scale.set(1, 1, 0.84);
    torso.add(vest);
    const belt = mesh(new THREE.TorusGeometry(0.255, 0.035, 5, 16), lambert(c.accent), 0, 0.03, 0);
    belt.rotation.x = Math.PI / 2;
    belt.scale.set(1, 0.84, 1);
    torso.add(belt);
  } else {
    // panák: pytel se slámou
    const sack = mesh(new THREE.CylinderGeometry(0.24, 0.3, 0.6, 10), lambert(0xc9a46a), 0, 0.24, 0);
    torso.add(sack);
    for (const y of [0.05, 0.42]) {
      const rope = mesh(new THREE.TorusGeometry(y < 0.2 ? 0.29 : 0.25, 0.025, 4, 14), lambert(0x8a5a2b), 0, y, 0);
      rope.rotation.x = Math.PI / 2;
      torso.add(rope);
    }
  }
  const head = node("head", torso, 0, 0.5, 0);
  if (c) {
    const h = buildHead(c);
    h.scale.setScalar(0.92);
    h.position.y = 0.27;
    head.add(h);
  } else {
    const h = sphere(0.27, lambert(0xd8c08a), 0, 0.24, 0);
    head.add(h);
    for (const sx of [-1, 1]) head.add(sphere(0.045, lambert(BLACK), sx * 0.1, 0.28, 0.24, 8));
    const mouth = box(0.14, 0.02, 0.02, lambert(0x5a3a1a), 0, 0.16, 0.26);
    head.add(mouth);
    const hat = cone(0.3, 0.3, lambert(0x8a5a2b), 10);
    hat.position.y = 0.58;
    head.add(hat);
  }
  for (const side of ["r", "l"] as const) {
    const sx = side === "r" ? -1 : 1;
    const ua = node(`upperarm_${side}`, torso, sx * 0.29, 0.43, 0);
    ua.add(limb(0.07, 0.27, lambert(c ? shirt : 0xc9a46a)));
    const shoulder = sphere(0.09, lambert(c ? main : 0xc9a46a));
    ua.add(shoulder);
    const fa = node(`forearm_${side}`, ua, 0, -0.27, 0);
    fa.add(limb(0.06, 0.25, lambert(c ? shirt : 0xc9a46a)));
    const hand = node(`hand_${side}`, fa, 0, -0.25, 0);
    hand.add(sphere(0.075, lambert(skin), 0, -0.06, 0.01, 10));
    const grip = node(`grip_${side}`, hand, 0, -0.07, 0.02);
    grip.quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2);
    const th = node(`thigh_${side}`, hips, sx * 0.12, -0.06, 0);
    th.add(limb(0.095, 0.36, lambert(c ? PANTS : 0xc9a46a)));
    const sh = node(`shin_${side}`, th, 0, -0.36, 0);
    sh.add(limb(0.08, 0.32, lambert(c ? PANTS : 0x8a5a2b)));
    const boot = box(0.16, 0.1, 0.26, lambert(c ? c.accent : 0x6b4a2a), 0, -0.3, 0.05);
    sh.add(boot);
  }
  if (!c) {
    // panák stojí na kůlu: nohy schováme, kůl přidáme do boků
    root.getObjectByName("thigh_r")!.visible = false;
    root.getObjectByName("thigh_l")!.visible = false;
    hips.add(mesh(new THREE.CylinderGeometry(0.06, 0.07, 0.8, 8), lambert(0x6b4a2a), 0, -0.38, 0));
  }
  return root;
}

export interface PoseInput {
  t: number;
  /** 0 stojí, 1 hluboký podřep (kryt) */
  crouch: number;
  /** předklon (+) / záklon (−) trupu, rad */
  lean: number;
  /** natočení trupu do strany (+ = k levé ruce), rad */
  twist: number;
  /** náraz po zásahu 0…1 (záklon, kolébání) */
  hit: number;
  /** balancování na okraji 0…1 */
  teeter: number;
  /** pád do vody (máchání rukama i nohama) */
  flail: number;
  /** radost (vítěz) 0…1 */
  cheer: number;
  /** krok (chůze vpřed), fáze v rad, a síla 0…1 */
  walk: number;
  walkAmt: number;
  /** kam se dívá hlava (svět) */
  look: THREE.Vector3 | null;
  hand: "R" | "L";
  /** kde má být střed rukojeti a jak je meč natočený (svět); null = bez meče (divák) */
  gripPos: THREE.Vector3 | null;
  gripQuat: THREE.Quaternion | null;
  /** loket ven/dolů (svět) */
  pole: THREE.Vector3 | null;
}

const _v = new THREE.Vector3(), _v2 = new THREE.Vector3(), _v3 = new THREE.Vector3();
const _q = new THREE.Quaternion(), _q2 = new THREE.Quaternion(), _q3 = new THREE.Quaternion();
const _e = new THREE.Euler();
const X = new THREE.Vector3(1, 0, 0), Y = new THREE.Vector3(0, 1, 0), Z = new THREE.Vector3(0, 0, 1);

interface ArmChain {
  upper: THREE.Object3D;
  fore: THREE.Object3D;
  hand: THREE.Object3D;
  grip: THREE.Object3D;
  /** směr segmentu v klidu (v místních souřadnicích uzlu) */
  upperDir: THREE.Vector3;
  foreDir: THREE.Vector3;
  a: number;
  b: number;
  /** poloha a natočení úchopu v souřadnicích ruky */
  gripPos: THREE.Vector3;
  gripQuat: THREE.Quaternion;
}

export class Puppet {
  /** kořen v souřadnicích šermíře (dívá se do −Z) */
  readonly root = new THREE.Group();
  readonly model: THREE.Object3D;
  private j = new Map<JointName, THREE.Object3D>();
  private rest = new Map<THREE.Object3D, { p: THREE.Vector3; q: THREE.Quaternion }>();
  private arms: Record<"R" | "L", ArmChain>;
  private hipsY: number;
  /** skutečná poloha úchopu po dosažení paží (svět) */
  readonly gripActual = new THREE.Vector3();
  readonly materials: THREE.Material[] = [];
  /** model je kopie šablony od Codexu (geometrie sdílená — nemazat) */
  private fromTemplate = false;

  constructor(c: CharacterDef | null) {
    const tpl = MODELS.fighters.get(c ? String(c.id) : "dummy");
    let model: THREE.Object3D | null = null;
    if (tpl) {
      model = tpl.clone(true);
      if (!JOINTS.slice(0, 6).every((n) => findNode(model!, n))) {
        console.warn("Model šermíře nemá potřebné uzly, používám náhradu:", c?.id ?? "dummy");
        model = null;
      }
    }
    this.fromTemplate = !!model;
    this.model = model ?? proceduralFighter(c);
    this.model.rotation.y = Math.PI; // model se dívá do +Z, šermíř do −Z
    this.root.add(this.model);
    for (const n of JOINTS) {
      let o = findNode(this.model, n);
      if (!o) {
        // chybějící úchop / noha: prázdný uzel na rozumném místě
        o = new THREE.Group();
        o.name = n;
        if (n.startsWith("grip")) {
          const hand = this.j.get(n === "grip_r" ? "hand_r" : "hand_l")!;
          o.position.set(0, -0.07, 0.02);
          o.quaternion.setFromAxisAngle(X, Math.PI / 2);
          hand.add(o);
        } else this.model.add(o);
      }
      this.j.set(n, o);
      this.rest.set(o, { p: o.position.clone(), q: o.quaternion.clone() });
    }
    this.model.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) m.castShadow = true;
    });
    this.ownMaterials();
    this.hipsY = this.j.get("hips")!.position.y;
    this.root.updateMatrixWorld(true);
    this.arms = { R: this.chain("r"), L: this.chain("l") };
  }

  get(n: JointName) {
    return this.j.get(n)!;
  }

  private chain(side: "r" | "l"): ArmChain {
    const upper = this.get(`upperarm_${side}`), fore = this.get(`forearm_${side}`), hand = this.get(`hand_${side}`), grip = this.get(`grip_${side}`);
    const a = Math.max(0.12, fore.position.length());
    const b = Math.max(0.12, hand.position.length());
    return {
      upper,
      fore,
      hand,
      grip,
      upperDir: fore.position.lengthSq() > 1e-6 ? fore.position.clone().normalize() : new THREE.Vector3(0, -1, 0),
      foreDir: hand.position.lengthSq() > 1e-6 ? hand.position.clone().normalize() : new THREE.Vector3(0, -1, 0),
      a,
      b,
      gripPos: grip.position.clone(),
      gripQuat: grip.quaternion.clone(),
    };
  }

  /** Místní natočení uzlu = klidové · animace (osy v souřadnicích modelu: +Z dopředu, −X vpravo). */
  private rot(n: JointName, x: number, y: number, z: number) {
    const o = this.get(n);
    _e.set(x, y, z, "YXZ");
    o.quaternion.copy(this.rest.get(o)!.q).multiply(_q.setFromEuler(_e));
  }

  /** Ramenní kloub ruky s mečem ve světě (pro model paže). */
  shoulderWorld(hand: "R" | "L", out: THREE.Vector3) {
    return this.arms[hand].upper.getWorldPosition(out);
  }

  /** Délka paže (rameno → zápěstí) včetně úchopu. */
  reach(hand: "R" | "L") {
    const c = this.arms[hand];
    return c.a + c.b + c.gripPos.length() * 0.6;
  }

  pose(p: PoseInput) {
    const t = p.t;
    const breathe = Math.sin(t * 2.1) * 0.012;
    const hips = this.get("hips");
    const hipRest = this.rest.get(hips)!;
    const crouch = clamp(p.crouch, 0, 1);
    const bob = Math.abs(Math.sin(p.walk)) * 0.03 * p.walkAmt;
    hips.position.copy(hipRest.p);
    hips.position.y = this.hipsY - crouch * 0.12 + breathe + bob - p.teeter * 0.04;
    const hitLean = -p.hit * 0.45;
    const teet = p.teeter * Math.sin(t * 9) * 0.35;
    const flail = p.flail;
    this.rot("hips", p.lean * 0.4 + hitLean * 0.4 + teet * 0.6 + flail * Math.sin(t * 7) * 0.3, p.twist * 0.35, Math.sin(t * 1.3) * 0.02);
    this.rot("torso", p.lean * 0.6 + hitLean * 0.6 + teet * 0.4 - p.cheer * 0.15, p.twist * 0.65, teet * 0.3);

    // nohy: rozkročený postoj, pokrčená kolena; při pádu kopou
    const legSpread = 0.13 + crouch * 0.06;
    const stride = Math.sin(p.walk) * 0.45 * p.walkAmt;
    const kick = flail * Math.sin(t * 13) * 0.9;
    const front = p.hand === "R" ? "r" : "l";
    for (const side of ["r", "l"] as const) {
      const sx = side === "r" ? -1 : 1;
      const isFront = side === front;
      const base = isFront ? -0.28 : 0.22;
      const knee = 0.2 + crouch * 0.55 + (isFront ? 0.15 : 0.05);
      const swing = (side === "r" ? stride : -stride) + (side === "r" ? kick : -kick);
      this.rot(`thigh_${side}`, base * (1 - flail) + swing - crouch * 0.35 * (isFront ? 1 : 0.4), 0, sx * legSpread * -1 + teet * 0.2);
      this.rot(`shin_${side}`, knee + Math.max(0, -swing) * 0.6, 0, 0);
    }

    // volná ruka: balancuje, při pádu mává, vítěz ji zvedá (divák bez meče obě)
    const free: ("r" | "l")[] = p.gripPos ? [p.hand === "R" ? "l" : "r"] : ["r", "l"];
    for (const off of free) {
      const osx = off === "r" ? -1 : 1;
      const ph = off === "r" ? 0 : 1.7;
      const wave = Math.sin(t * 11 + ph) * (0.6 * flail + 0.9 * p.teeter + 0.35 * p.cheer);
      const up = p.cheer * 2.6 + flail * 1.8 + p.teeter * 1.2;
      this.rot(`upperarm_${off}`, 0.35 - crouch * 0.2 - up * 0.2, 0, osx * (0.35 + up * 0.55 + wave));
      this.rot(`forearm_${off}`, -0.9 - p.cheer * 0.4 + wave * 0.5, 0, 0);
      this.rot(`hand_${off}`, 0, 0, 0);
    }

    // hlava se dívá na soupeře
    const head = this.get("head");
    head.quaternion.copy(this.rest.get(head)!.q);
    this.root.updateMatrixWorld(true);
    if (p.look) {
      const hp = head.getWorldPosition(_v);
      const parentQ = head.parent!.getWorldQuaternion(_q2);
      const dirW = _v2.subVectors(p.look, hp).normalize();
      const dirL = dirW.applyQuaternion(_q3.copy(parentQ).invert());
      const yaw = clamp(Math.atan2(dirL.x, dirL.z), -0.7, 0.7);
      const pitch = clamp(-Math.asin(clamp(dirL.y, -1, 1)), -0.5, 0.5);
      _e.set(pitch + p.hit * -0.5 + Math.sin(t * 17) * p.hit * 0.25, yaw, Math.sin(t * 9) * p.teeter * 0.3, "YXZ");
      head.quaternion.multiply(_q.setFromEuler(_e));
    }

    // ruka s mečem: IK k úchopu
    if (p.gripPos && p.gripQuat && p.pole) this.solveArm(this.arms[p.hand], p.gripPos, p.gripQuat, p.pole);
    else this.root.updateMatrixWorld(true);
  }

  /** Dvoukloubová IK: rameno → loket → zápěstí tak, aby úchop seděl na meči. */
  private solveArm(c: ArmChain, gripPos: THREE.Vector3, gripQuat: THREE.Quaternion, pole: THREE.Vector3) {
    // natočení ruky ve světě: úchop = meč
    const handW = _q.copy(gripQuat).multiply(_q2.copy(c.gripQuat).invert());
    // kde musí být zápěstí
    const wrist = _v.copy(c.gripPos).applyQuaternion(handW).negate().add(gripPos);
    const S = c.upper.getWorldPosition(_v2);
    const D = _v3.subVectors(wrist, S);
    let d = D.length();
    const a = c.a, b = c.b;
    d = clamp(d, Math.abs(a - b) + 0.02, a + b - 0.005);
    const x = D.normalize();
    // loket: v rovině dané směrem k zápěstí a „pólem“ (loket ven a dolů)
    const yv = new THREE.Vector3().copy(pole).addScaledVector(x, -pole.dot(x));
    if (yv.lengthSq() < 1e-6) yv.set(0, -1, 0).addScaledVector(x, x.y);
    yv.normalize();
    const cosA = clamp((a * a + d * d - b * b) / (2 * a * d), -1, 1);
    const sinA = Math.sqrt(1 - cosA * cosA);
    const elbowDir = new THREE.Vector3().copy(x).multiplyScalar(cosA).addScaledVector(yv, sinA);
    const elbow = new THREE.Vector3().copy(S).addScaledVector(elbowDir, a);
    const wristReal = new THREE.Vector3().copy(S).addScaledVector(x, d);
    this.aim(c.upper, c.upperDir, elbowDir);
    c.upper.updateMatrixWorld(true);
    const fdir = new THREE.Vector3().subVectors(wristReal, elbow).normalize();
    this.aim(c.fore, c.foreDir, fdir);
    c.fore.updateMatrixWorld(true);
    // ruka: natočení ve světě → místní vůči předloktí
    const foreW = c.fore.getWorldQuaternion(_q3);
    c.hand.quaternion.copy(foreW.invert().multiply(handW));
    c.hand.updateMatrixWorld(true);
    c.grip.getWorldPosition(this.gripActual);
  }

  /** Natočí uzel tak, aby jeho klidový směr segmentu mířil na `dirW` (nejkratší oblouk). */
  private aim(o: THREE.Object3D, restDir: THREE.Vector3, dirW: THREE.Vector3) {
    const parentW = o.parent!.getWorldQuaternion(new THREE.Quaternion());
    const restW = parentW.clone().multiply(this.rest.get(o)!.q);
    const cur = restDir.clone().applyQuaternion(restW);
    const swing = new THREE.Quaternion().setFromUnitVectors(cur, dirW);
    const want = swing.multiply(restW);
    o.quaternion.copy(parentW.invert().multiply(want));
  }

  /** Průhlednost (vlastní šermíř nesmí zakrývat soupeře). */
  setOpacity(a: number) {
    const tr = a < 0.99;
    for (const m of this.materials) {
      if (m.transparent !== tr) {
        m.transparent = tr;
        m.depthWrite = !tr;
        m.needsUpdate = true;
      }
      m.opacity = a;
    }
  }

  /** Uvolní geometrie (jen u náhrady z tvarů) a vlastní kopie materiálů. */
  dispose() {
    this.root.removeFromParent();
    if (!this.fromTemplate)
      this.model.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.isMesh) m.geometry.dispose();
      });
    for (const m of this.materials) m.dispose();
  }

  /** Vlastní kopie materiálů (průhlednost jen u jednoho šermíře a jen v jeho pohledu). */
  private ownMaterials() {
    const map = new Map<THREE.Material, THREE.Material>();
    const own = (x: THREE.Material) => {
      let c = map.get(x);
      if (!c) {
        c = x.clone();
        map.set(x, c);
      }
      return c;
    };
    this.model.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      m.material = Array.isArray(m.material) ? m.material.map(own) : own(m.material);
    });
    this.materials.length = 0;
    this.materials.push(...map.values());
  }
}

export { Z as AXIS_Z, Y as AXIS_Y };
