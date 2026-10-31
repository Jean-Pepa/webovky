// Aréna: dřevěné molo na rybníce. Šermuje se po délce mola, zábradlí po stranách,
// konce jsou volné — kdo přepadne, žbluňkne do vody. Vzhled (model okolí, obloha) dodává Astra
// (models/arenas/molo.glb, img/sky-molo.jpg); bez nich se postaví náhrada z tvarů.
import * as THREE from "three";
import { img } from "../shared/assets";
import { MODELS, findNode } from "./models";
import { lambert } from "./puppet";
import { rand } from "./util";

export const ARENA = {
  id: "molo",
  name: "Molo na rybníce",
  /** polovina délky mola (konce = pád do vody) */
  halfLen: 3.6,
  halfWidth: 1.15,
  /** hladina vody (horní plocha mola je v y = 0) */
  waterY: -1.5,
  /** zpomalení po odhozu (m/s²) */
  friction: 6,
  fog: 0xf3dcc0,
  skyTop: 0x4d8fe8,
  skyHorizon: 0xffe2bd,
  water: 0x3f9fb0,
  waterDeep: 0x1a5670,
};

function skyMaterial(top: number, horizon: number) {
  return new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    fog: false,
    uniforms: { top: { value: new THREE.Color(top) }, horizon: { value: new THREE.Color(horizon) } },
    vertexShader: `varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
    fragmentShader: `uniform vec3 top; uniform vec3 horizon; varying vec3 vP;
      void main(){ float h = clamp(vP.y, 0.0, 1.0); vec3 c = mix(horizon, top, pow(h, 0.5)); gl_FragColor = vec4(c, 1.0); }`,
  });
}

/** Voda: vlnky a odlesky slunce (shader). */
function waterMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      shallow: { value: new THREE.Color(ARENA.water) },
      deep: { value: new THREE.Color(ARENA.waterDeep) },
      fogColor: { value: new THREE.Color(ARENA.fog) },
    },
    vertexShader: `uniform float time; varying float vDist; varying vec3 vW;
      void main(){ vec4 w = modelMatrix * vec4(position,1.0);
        w.y += sin(w.x*0.9 + time*1.3)*0.025 + cos(w.z*1.1 + time*1.1)*0.025;
        vW = w.xyz; vec4 mv = viewMatrix * w; vDist = -mv.z; gl_Position = projectionMatrix * mv; }`,
    fragmentShader: `uniform float time; uniform vec3 shallow; uniform vec3 deep; uniform vec3 fogColor;
      varying float vDist; varying vec3 vW;
      void main(){
        float waves = sin(vW.x*2.3 + time*1.7)*0.5 + sin(vW.z*2.9 - time*1.3)*0.5 + sin((vW.x+vW.z)*4.1 + time*2.2)*0.3;
        float r = length(vW.xz);
        vec3 c = mix(deep, shallow, 0.5 + waves*0.12 + smoothstep(14.0, 24.0, r)*0.3);
        float spark = smoothstep(0.93, 1.0, sin(vW.x*7.0 + time*2.0) * sin(vW.z*6.0 - time*1.6));
        c += spark * vec3(0.45, 0.4, 0.3);
        float f = smoothstep(20.0, 90.0, vDist);
        gl_FragColor = vec4(mix(c, fogColor, f), 1.0);
      }`,
  });
}

/** Loďky s diváky (náhrada z tvarů): po stranách mola, kousek před jeho konci. */
const BOATS = [
  { x: -4.4, z: -4.6, color: 0x2f6bff },
  { x: 4.4, z: 4.6, color: 0xff4d6d },
  { x: 4.6, z: -4.4, color: 0x3ccf4e },
  { x: -4.6, z: 4.4, color: 0xffb703 },
];

interface Ripple {
  t: number;
  mesh: THREE.Mesh;
}

interface Duck {
  o: THREE.Object3D;
  a: number;
  r: number;
  speed: number;
}

export class Arena {
  readonly group = new THREE.Group();
  readonly sun: THREE.DirectionalLight;
  /** místa pro diváky na břehu (poloha + kam se dívají) */
  readonly spectatorSpots: { pos: THREE.Vector3; yaw: number }[] = [];
  private waterMat: THREE.ShaderMaterial;
  private ripples: Ripple[] = [];
  private ducks: Duck[] = [];
  private t = 0;

  constructor(scene: THREE.Scene) {
    scene.fog = new THREE.Fog(ARENA.fog, 35, 140);
    scene.background = new THREE.Color(ARENA.skyHorizon);
    this.group.add(new THREE.Mesh(new THREE.SphereGeometry(450, 32, 16), skyMaterial(ARENA.skyTop, ARENA.skyHorizon)));
    const pano = img("sky-molo");
    if (pano) {
      const tex = new THREE.TextureLoader().load(pano);
      tex.colorSpace = THREE.SRGBColorSpace;
      const cyl = new THREE.Mesh(
        new THREE.CylinderGeometry(320, 320, 160, 64, 1, true),
        new THREE.MeshBasicMaterial({ map: tex, side: THREE.BackSide, fog: false, depthWrite: false }),
      );
      cyl.position.y = 58;
      this.group.add(cyl);
    }
    this.group.add(new THREE.HemisphereLight(0xcfe6ff, 0x6a7a3a, 1.2));
    // nízké odpolední slunce z boku — dlouhé stíny přes molo
    this.sun = new THREE.DirectionalLight(0xffe6c4, 2.6);
    this.sun.position.set(-9, 11, 5);
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(2048, 2048);
    const sc = this.sun.shadow.camera;
    sc.left = -7;
    sc.right = 7;
    sc.top = 7;
    sc.bottom = -7;
    sc.near = 1;
    sc.far = 40;
    this.sun.shadow.bias = -0.0005;
    this.group.add(this.sun, this.sun.target);

    this.waterMat = waterMaterial();
    const water = new THREE.Mesh(new THREE.PlaneGeometry(260, 260, 60, 60), this.waterMat);
    water.rotation.x = -Math.PI / 2;
    water.position.y = ARENA.waterY;
    water.receiveShadow = false;
    this.group.add(water);

    const model = MODELS.arenas.get(ARENA.id);
    if (model) {
      const m = model.clone(true);
      m.traverse((o) => {
        if (o.name.toLowerCase() === "water") o.visible = false;
      });
      this.group.add(m);
      for (let i = 1; i <= 12; i++) {
        const n = findNode(m, `spectator_${i}`);
        if (!n) continue;
        n.updateWorldMatrix(true, false);
        const p = new THREE.Vector3().setFromMatrixPosition(n.matrixWorld);
        const q = new THREE.Quaternion();
        n.getWorldQuaternion(q);
        const f = new THREE.Vector3(0, 0, 1).applyQuaternion(q);
        this.spectatorSpots.push({ pos: p, yaw: Math.atan2(f.x, f.z) + Math.PI });
      }
    } else this.buildFallback();
    if (!this.spectatorSpots.length) this.defaultSpots();
    scene.add(this.group);
  }

  private add(o: THREE.Object3D, x: number, y: number, z: number, shadow = true) {
    o.position.set(x, y, z);
    o.traverse((c) => {
      const m = c as THREE.Mesh;
      if (m.isMesh) {
        m.castShadow = shadow;
        m.receiveShadow = true;
      }
    });
    this.group.add(o);
    return o;
  }

  /** Diváci v loďkách po stranách mola, dívají se na střed mola. */
  private defaultSpots() {
    for (const b of BOATS)
      for (const dz of [-0.55, 0.55]) {
        const pos = new THREE.Vector3(b.x, ARENA.waterY + 0.32, b.z + dz);
        this.spectatorSpots.push({ pos, yaw: Math.atan2(pos.x, pos.z) });
      }
    // střídavě loďky, ať se diváci rozmístí po celém rybníce
    const order = [0, 2, 4, 6, 1, 3, 5, 7];
    const sorted = order.map((i) => this.spectatorSpots[i]).filter(Boolean);
    this.spectatorSpots.splice(0, this.spectatorSpots.length, ...sorted);
  }

  /** Náhrada z tvarů: molo se zábradlím, lávky pro diváky, rákos, lekníny, loďka, kachny, les a kostelík. */
  private buildFallback() {
    const L = ARENA.halfLen, W = ARENA.halfWidth, wy = ARENA.waterY;
    const wood = [0xc08a54, 0xae7841, 0xcf9a62];
    for (let z = -L + 0.135, i = 0; z < L; z += 0.27, i++) {
      const plank = new THREE.Mesh(new THREE.BoxGeometry(W * 2, 0.12, 0.25), lambert(wood[i % 3]));
      plank.rotation.y = (i % 2 ? 1 : -1) * 0.004;
      this.add(plank, 0, -0.06, z);
    }
    // nosníky a kůly ve vodě
    for (const sx of [-1, 1]) {
      const beam = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.2, 2 * L), lambert(0x7a5530));
      this.add(beam, sx * (W - 0.2), -0.2, 0);
      for (let z = -L + 0.15; z <= L; z += 1.2) {
        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.11, 2.4, 8), lambert(0x6b4a2a));
        this.add(post, sx * (W - 0.05), -1.1, z);
        if (Math.abs(z) < L - 0.3) {
          const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.065, 1.0, 7), lambert(0x7a5530));
          this.add(rail, sx * (W - 0.05), 0.5, z);
          const cap = new THREE.Mesh(new THREE.SphereGeometry(0.075, 8, 6), lambert(0x8a6038));
          this.add(cap, sx * (W - 0.05), 1.02, z);
        }
      }
      for (const y of [0.95, 0.55]) {
        const rope = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 2 * L - 0.7, 6), lambert(0xeadbb2));
        rope.rotation.x = Math.PI / 2;
        this.add(rope, sx * (W - 0.05), y, 0);
      }
    }
    // loďky s diváky
    for (const b of BOATS) {
      const boat = new THREE.Group();
      const hull = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.45, 2.6), lambert(b.color));
      const inner = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.4, 2.3), lambert(0xc08a54));
      inner.position.y = 0.08;
      const bow = new THREE.Mesh(new THREE.ConeGeometry(0.58, 0.9, 4), lambert(b.color));
      bow.rotation.set(Math.PI / 2, Math.PI / 4, 0);
      bow.position.z = 1.72;
      bow.scale.set(1, 1, 0.55);
      boat.add(hull, inner, bow);
      boat.rotation.y = b.z > 0 ? Math.PI : 0;
      this.add(boat, b.x, ARENA.waterY + 0.1, b.z, false);
    }
    // břeh
    const bank = new THREE.Mesh(new THREE.CylinderGeometry(34, 36, 2.4, 64, 1, true), lambert(0x7aa84a));
    this.add(bank, 0, wy + 0.6, 0, false);
    const meadow = new THREE.Mesh(new THREE.RingGeometry(34, 140, 64), lambert(0x86b552));
    meadow.rotation.x = -Math.PI / 2;
    this.add(meadow, 0, wy + 1.8, 0, false);
    // rákos u břehu
    for (let i = 0; i < 160; i++) {
      const a = rand(0, Math.PI * 2), r = rand(27, 33.5);
      const h = rand(1.2, 2.4);
      const reed = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.045, h, 5), lambert(i % 3 ? 0x6f9a3a : 0x87a845));
      reed.rotation.set(rand(-0.15, 0.15), 0, rand(-0.15, 0.15));
      this.add(reed, Math.cos(a) * r, wy + h / 2 - 0.1, Math.sin(a) * r, false);
      if (i % 4 === 0) {
        const head = new THREE.Mesh(new THREE.CapsuleGeometry(0.06, 0.22, 3, 6), lambert(0x6b4226));
        this.add(head, Math.cos(a) * r, wy + h - 0.05, Math.sin(a) * r, false);
      }
    }
    // lekníny
    for (let i = 0; i < 40; i++) {
      const a = rand(0, Math.PI * 2), r = rand(4, 22);
      const x = Math.cos(a) * r, z = Math.sin(a) * r;
      if (Math.abs(x) < 2.2 && Math.abs(z) < L + 3) continue;
      const pad = new THREE.Mesh(new THREE.CircleGeometry(rand(0.3, 0.55), 12, 0.3, Math.PI * 2 - 0.3), lambert(0x4f9a3f));
      pad.rotation.x = -Math.PI / 2;
      this.add(pad, x, wy + 0.03, z, false);
      if (i % 5 === 0) {
        const flower = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 6), lambert(0xffc7dd));
        this.add(flower, x + 0.1, wy + 0.1, z, false);
      }
    }
    // les a kopce
    for (let i = 0; i < 70; i++) {
      const a = rand(0, Math.PI * 2), r = rand(44, 95);
      const tree = new THREE.Group();
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.4, 2.6, 6), lambert(0x6b4a2a));
      trunk.position.y = 1.3;
      const s = rand(0.9, 1.5);
      const crown = new THREE.Mesh(new THREE.ConeGeometry(2.2 * s, 6.5 * s, 7), lambert(i % 3 === 0 ? 0x4a8a3a : i % 3 === 1 ? 0x2f6b34 : 0x3d7a3a));
      crown.position.y = 2.4 + 3.2 * s;
      tree.add(trunk, crown);
      this.add(tree, Math.cos(a) * r, wy + 1.8, Math.sin(a) * r, false);
    }
    for (let i = 0; i < 9; i++) {
      const a = (i / 9) * Math.PI * 2 + 0.3;
      const hill = new THREE.Mesh(new THREE.SphereGeometry(rand(28, 42), 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), lambert(i % 2 ? 0x7fae58 : 0x6f9e4c));
      hill.scale.y = rand(0.25, 0.4);
      this.add(hill, Math.cos(a) * 150, wy, Math.sin(a) * 150, false);
    }
    // kostelík na kopečku
    const church = new THREE.Group();
    const nave = new THREE.Mesh(new THREE.BoxGeometry(5, 4, 8), lambert(0xf3ead8));
    nave.position.y = 2;
    const roof = new THREE.Mesh(new THREE.ConeGeometry(4.6, 2.6, 4), lambert(0xb5452f));
    roof.position.y = 5.3;
    roof.rotation.y = Math.PI / 4;
    roof.scale.z = 1.6;
    const tower = new THREE.Mesh(new THREE.BoxGeometry(2.4, 9, 2.4), lambert(0xf3ead8));
    tower.position.set(0, 4.5, 5);
    const spire = new THREE.Mesh(new THREE.ConeGeometry(1.8, 4.5, 8), lambert(0x3d6b4a));
    spire.position.set(0, 11.2, 5);
    church.add(nave, roof, tower, spire);
    this.add(church, -38, wy + 1.8, -62, false);
    church.rotation.y = 0.5;
    // kachny
    for (let i = 0; i < 5; i++) {
      const duck = new THREE.Group();
      const body = new THREE.Mesh(new THREE.SphereGeometry(0.22, 10, 8), lambert(i === 0 ? 0xffffff : 0x8a6a3a));
      body.scale.set(1, 0.7, 1.4);
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 6), lambert(i === 0 ? 0xffffff : 0x2f7a4a));
      head.position.set(0, 0.2, 0.22);
      const beak = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.12, 6), lambert(0xffa31a));
      beak.rotation.x = Math.PI / 2;
      beak.position.set(0, 0.18, 0.36);
      duck.add(body, head, beak);
      this.add(duck, 0, wy + 0.08, 0, false);
      this.ducks.push({ o: duck, a: rand(0, Math.PI * 2), r: rand(8, 18), speed: rand(0.03, 0.07) * (i % 2 ? 1 : -1) });
    }
  }

  /** Šplouchnutí: rozbíhající se kruh na hladině. */
  splash(pos: THREE.Vector3) {
    for (let k = 0; k < 2; k++) {
      const mesh = new THREE.Mesh(
        new THREE.RingGeometry(0.5, 0.75, 40),
        new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.85, depthWrite: false }),
      );
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.set(pos.x, ARENA.waterY + 0.04, pos.z);
      this.group.add(mesh);
      this.ripples.push({ t: -k * 0.35, mesh });
    }
  }

  update(dt: number) {
    this.t += dt;
    this.waterMat.uniforms.time.value = this.t;
    for (const r of this.ripples) {
      r.t += dt;
      const s = 1 + Math.max(0, r.t) * 3.2;
      r.mesh.scale.set(s, s, s);
      (r.mesh.material as THREE.MeshBasicMaterial).opacity = r.t < 0 ? 0 : Math.max(0, 0.85 - r.t * 0.5);
    }
    this.ripples = this.ripples.filter((r) => {
      if (r.t < 1.9) return true;
      r.mesh.removeFromParent();
      r.mesh.geometry.dispose();
      return false;
    });
    for (const d of this.ducks) {
      d.a += d.speed * dt;
      d.o.position.x = Math.cos(d.a) * d.r;
      d.o.position.z = Math.sin(d.a) * d.r;
      d.o.position.y = ARENA.waterY + 0.08 + Math.sin(this.t * 2 + d.r) * 0.02;
      d.o.rotation.y = d.speed > 0 ? -d.a : Math.PI - d.a;
    }
  }
}
