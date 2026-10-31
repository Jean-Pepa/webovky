// Režim Krájení: z rybníka před koncem mola vyskakuje zelenina a další věci (hází je vodník).
// Každá má šipku — rozsekni ji švihem v tom směru. Zlaté jablko jde seknout jakkoli, ježka ne!
// 1 hráč na rekord, 2 hráči zády k sobě (každý svůj konec mola), stejné pořadí věcí pro oba.
import * as THREE from "three";
import type { ResultRow } from "../shared/protocol";
import { ARENA } from "./arena";
import { makeFighter } from "./duel-mode";
import type { Fighter } from "./fighter";
import { MODELS, findNode } from "./models";
import { lambert } from "./puppet";
import { CamRig, behindToward, type Viewport } from "./view";
import type { Activity, Ctx, Entrant, PadView } from "./activity";
import { clamp, formatClock, seeded, store, save } from "./util";

const GAME_TIME = 60;
const V_CUT = 3.4;

type Shape = "sphere" | "pumpkin" | "roll" | "wheel" | "hedgehog";

interface ItemDef {
  id: string;
  name: string;
  shape: Shape;
  r: number;
  len?: number;
  color: number;
  flesh: number;
  pts: number;
}

const ITEMS: ItemDef[] = [
  { id: "meloun", name: "Meloun", shape: "sphere", r: 0.25, color: 0x2f8f3a, flesh: 0xff4d5a, pts: 1 },
  { id: "dyne", name: "Dýně", shape: "pumpkin", r: 0.26, color: 0xff8a1f, flesh: 0xffc24a, pts: 1 },
  { id: "jablko", name: "Jablko", shape: "sphere", r: 0.15, color: 0xe8302a, flesh: 0xfff2c4, pts: 1 },
  { id: "okurka", name: "Okurka", shape: "roll", r: 0.075, len: 0.5, color: 0x3a8a2a, flesh: 0xcfeea0, pts: 1 },
  { id: "knedlik", name: "Knedlík", shape: "roll", r: 0.13, len: 0.42, color: 0xf3ead2, flesh: 0xfaf3e2, pts: 2 },
  { id: "poleno", name: "Poleno", shape: "roll", r: 0.13, len: 0.5, color: 0x8a5a2b, flesh: 0xe0b878, pts: 2 },
  { id: "syr", name: "Sýr", shape: "wheel", r: 0.22, len: 0.16, color: 0xffd23f, flesh: 0xffe78a, pts: 1 },
];
const GOLD: ItemDef = { id: "zlate", name: "Zlaté jablko", shape: "sphere", r: 0.16, color: 0xffd21f, flesh: 0xfff7c2, pts: 5 };
const HEDGEHOG: ItemDef = { id: "jezek", name: "Ježek", shape: "hedgehog", r: 0.22, color: 0x7a5a3a, flesh: 0x7a5a3a, pts: -3 };

/** 8 směrů švihu (kam se pohybuje špička) v čelní rovině. */
const DIRS = Array.from({ length: 8 }, (_, i) => {
  const a = (i * Math.PI) / 4;
  return new THREE.Vector2(Math.cos(a), Math.sin(a));
});

interface Thing {
  def: ItemDef;
  lane: number;
  group: THREE.Group;
  halves: THREE.Object3D[];
  arrow: THREE.Object3D | null;
  /** poloha a rychlost (svět) */
  p: THREE.Vector3;
  v: THREE.Vector3;
  /** požadovaný směr švihu (souřadnice hráče), null = jakkoli */
  dir: THREE.Vector2 | null;
  state: "fly" | "cut" | "bounce" | "gone";
  t: number;
  spin: number;
  splitN: THREE.Vector3;
  halfV: THREE.Vector3[];
  splashed: boolean;
}

interface Lane {
  f: Fighter;
  score: number;
  combo: number;
  bestCombo: number;
  cuts: number;
  wrong: number;
  missed: number;
  /** kde vyskakují věci (svět) */
  spot: THREE.Vector3;
  fw: THREE.Vector3;
  right: THREE.Vector3;
}

let arrowTex: THREE.CanvasTexture | null = null;
function arrowTexture() {
  if (arrowTex) return arrowTex;
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  g.translate(64, 64);
  g.lineJoin = "round";
  g.beginPath();
  g.moveTo(54, 0);
  g.lineTo(10, -36);
  g.lineTo(10, -15);
  g.lineTo(-50, -15);
  g.lineTo(-50, 15);
  g.lineTo(10, 15);
  g.lineTo(10, 36);
  g.closePath();
  g.fillStyle = "#ffd21f";
  g.strokeStyle = "#1b1430";
  g.lineWidth = 9;
  g.stroke();
  g.fill();
  arrowTex = new THREE.CanvasTexture(c);
  arrowTex.colorSpace = THREE.SRGBColorSpace;
  return arrowTex;
}

let noTex: THREE.CanvasTexture | null = null;
function noTexture() {
  if (noTex) return noTex;
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  g.lineWidth = 14;
  g.strokeStyle = "#ff4d6d";
  g.fillStyle = "rgba(255,255,255,0.85)";
  g.beginPath();
  g.arc(64, 64, 50, 0, Math.PI * 2);
  g.fill();
  g.stroke();
  g.beginPath();
  g.moveTo(30, 30);
  g.lineTo(98, 98);
  g.stroke();
  noTex = new THREE.CanvasTexture(c);
  noTex.colorSpace = THREE.SRGBColorSpace;
  return noTex;
}

/** Dvě poloviny věci rozdělené rovinou x = 0 (model od Astry nebo náhrada). */
function buildHalves(def: ItemDef): THREE.Object3D[] {
  const tpl = MODELS.slice.get(def.id);
  if (tpl) {
    const m = tpl.clone(true);
    const a = findNode(m, "half_a"), b = findNode(m, "half_b");
    if (a && b) return [a, b];
    return [m];
  }
  const skin = lambert(def.color), flesh = lambert(def.flesh);
  const halves: THREE.Object3D[] = [];
  for (const sx of [1, -1]) {
    const g = new THREE.Group();
    if (def.shape === "sphere" || def.shape === "pumpkin") {
      const geo = new THREE.SphereGeometry(def.r, 18, 12, sx > 0 ? Math.PI / 2 : -Math.PI / 2, Math.PI);
      const m = new THREE.Mesh(geo, skin);
      if (def.shape === "pumpkin") m.scale.set(1, 0.82, 1);
      g.add(m);
      const face = new THREE.Mesh(new THREE.CircleGeometry(def.r * 0.97, 20), flesh);
      face.rotation.y = sx > 0 ? -Math.PI / 2 : Math.PI / 2;
      if (def.shape === "pumpkin") face.scale.set(1, 0.82, 1);
      g.add(face);
      if (def.id === "meloun") {
        for (let i = 0; i < 4; i++) {
          const stripe = new THREE.Mesh(new THREE.TorusGeometry(def.r * 1.002, 0.012, 4, 24, Math.PI), lambert(0x1d5f2a));
          stripe.rotation.set(0, (sx > 0 ? 0 : Math.PI) + (i - 1.5) * 0.4, Math.PI / 2);
          g.add(stripe);
        }
        for (let i = 0; i < 6; i++) {
          const seed = new THREE.Mesh(new THREE.SphereGeometry(0.014, 5, 4), lambert(0x1b1430));
          const a = (i / 6) * Math.PI * 2;
          seed.position.set(sx * 0.003, Math.cos(a) * def.r * 0.55, Math.sin(a) * def.r * 0.55);
          g.add(seed);
        }
      }
      if (def.id === "jablko" || def.id === "zlate") {
        if (sx > 0) {
          const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.08, 5), lambert(0x5a3a1a));
          stem.position.set(0.01, def.r + 0.02, 0);
          g.add(stem);
          const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.04, 6, 4), lambert(0x3ccf4e));
          leaf.scale.set(1, 0.3, 0.6);
          leaf.position.set(0.04, def.r + 0.04, 0);
          g.add(leaf);
        }
      }
      if (def.shape === "pumpkin" && sx > 0) {
        const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.035, 0.1, 6), lambert(0x4a6a2a));
        stem.position.set(0.02, def.r * 0.82 + 0.03, 0);
        g.add(stem);
      }
    } else {
      // váleček (okurka, knedlík, poleno, sýr): osa podél X, řez napříč
      const len = def.len ?? 0.4;
      const m = new THREE.Mesh(new THREE.CylinderGeometry(def.r, def.r, len / 2, 16), skin);
      m.rotation.z = Math.PI / 2;
      m.position.x = (sx * len) / 4;
      g.add(m);
      const face = new THREE.Mesh(new THREE.CircleGeometry(def.r * 0.96, 18), flesh);
      face.rotation.y = sx > 0 ? -Math.PI / 2 : Math.PI / 2;
      face.position.x = sx * 0.002;
      g.add(face);
      if (def.id === "poleno") {
        for (const rr of [0.5, 0.8]) {
          const ring = new THREE.Mesh(new THREE.RingGeometry(def.r * rr - 0.008, def.r * rr, 18), lambert(0xa87a48));
          ring.rotation.y = face.rotation.y;
          ring.position.x = sx * 0.004;
          g.add(ring);
        }
      }
      if (def.id === "syr") {
        for (let i = 0; i < 3; i++) {
          const hole = new THREE.Mesh(new THREE.CircleGeometry(0.025, 8), lambert(0xe8b82a));
          hole.rotation.y = face.rotation.y;
          hole.position.set(sx * 0.004, Math.cos(i * 2) * 0.1, Math.sin(i * 2) * 0.1);
          g.add(hole);
        }
      }
    }
    g.traverse((o) => ((o as THREE.Mesh).castShadow = true));
    halves.push(g);
  }
  return halves;
}

function buildHedgehog(): THREE.Object3D {
  const tpl = MODELS.slice.get("jezek");
  if (tpl) return tpl.clone(true);
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.2, 14, 10), lambert(0x6b4a2a));
  g.add(body);
  for (let i = 0; i < 46; i++) {
    const sp = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.16, 4), lambert(i % 2 ? 0x3a2a1a : 0x5a3a22));
    const dir = new THREE.Vector3().randomDirection();
    if (dir.z > 0.55) dir.z = -dir.z;
    sp.position.copy(dir).multiplyScalar(0.2);
    sp.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
    g.add(sp);
  }
  const face = new THREE.Mesh(new THREE.SphereGeometry(0.12, 10, 8), lambert(0xd9b08a));
  face.position.set(0, -0.02, 0.15);
  g.add(face);
  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.03, 6, 5), lambert(0x1b1430));
  nose.position.set(0, -0.02, 0.27);
  g.add(nose);
  for (const sx of [-1, 1]) {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.022, 6, 5), lambert(0x1b1430));
    eye.position.set(sx * 0.05, 0.04, 0.24);
    g.add(eye);
  }
  return g;
}

export interface SliceBest {
  score: number;
  name: string;
}
export const sliceBest = () => store<SliceBest | null>("mc_slice_best", null);

const _v = new THREE.Vector3(), _q = new THREE.Quaternion();

export class SliceActivity implements Activity {
  readonly kind = "slice" as const;
  readonly fighters: Fighter[];
  readonly timeScale = 1;
  finished = false;
  private ctx: Ctx;
  private lanes: Lane[] = [];
  private things: Thing[] = [];
  private rng: () => number;
  private t = -1;
  private phase: "ready" | "go" | "play" | "end" = "ready";
  private phaseT = 0;
  private spawnT = 1;
  private hold: number[] = [];
  private ready: boolean[] = [];
  private record: SliceBest | null = sliceBest();
  private newRecord = false;

  constructor(ctx: Ctx, entrants: Entrant[]) {
    this.ctx = ctx;
    this.rng = seeded((Math.random() * 1e9) | 0);
    const two = entrants.length > 1;
    this.fighters = entrants.slice(0, 2).map((e, i) => {
      const f = makeFighter(ctx, e.char, e.name, e.ctl, e.slot, i as 0 | 1, e.hand);
      // zády k sobě: každý míří ke „svému“ konci mola
      const z = two ? (i === 0 ? -2.75 : 2.75) : -2.75;
      f.place(z, i === 0 ? 0 : Math.PI);
      f.side = i as 0 | 1;
      return f;
    });
    for (const f of this.fighters) {
      const fw = f.forward(new THREE.Vector3());
      const right = new THREE.Vector3(-fw.z, 0, fw.x);
      const spot = new THREE.Vector3(f.x, ARENA.waterY, f.z).addScaledVector(fw, 1.45);
      this.lanes.push({ f, score: 0, combo: 0, bestCombo: 0, cuts: 0, wrong: 0, missed: 0, spot, fw, right });
      this.hold.push(0);
      this.ready.push(false);
    }
    ctx.hud.big("Krájení", "Vodník hází z rybníka — sekej ve směru šipky!", 2600, "title");
  }

  private get playing() {
    return this.phase === "play";
  }

  step(dt: number, now: number) {
    this.phaseT += dt;
    for (const f of this.fighters) {
      f.update(dt, now, null, ARENA.waterY);
      // stojí na místě (nikdo je netlačí)
      f.lookAt = this.lanes[f.side].spot.clone().setY(1.3);
    }
    if (this.phase === "ready") {
      let all = true;
      this.fighters.forEach((f, i) => {
        if (this.ready[i]) return;
        if (f.ctl.guard && f.ctl.live) this.hold[i] += dt;
        else this.hold[i] = Math.max(0, this.hold[i] - dt * 2);
        if (this.hold[i] >= 0.5) {
          f.ctl.calibrate();
          this.ready[i] = true;
          this.ctx.sound.play("ready");
          this.ctx.buzz(f.slot, 40);
        }
        if (!this.ready[i]) all = false;
      });
      if (all) {
        this.phase = "go";
        this.phaseT = 0;
        this.ctx.hud.big("Připravit…", "", 700);
        this.ctx.sound.play("count");
      }
    } else if (this.phase === "go") {
      if (this.phaseT > 0.9) {
        this.phase = "play";
        this.phaseT = 0;
        this.t = 0;
        this.ctx.hud.big("SEKEJ!", "", 700, "go");
        this.ctx.sound.play("gong");
      }
    } else if (this.phase === "play") {
      this.t += dt;
      this.spawnT -= dt;
      if (this.spawnT <= 0 && this.t < GAME_TIME - 1.2) this.spawn();
      if (this.t >= GAME_TIME) this.end();
    } else if (this.phase === "end") {
      if (this.phaseT > 3.2) this.finished = true;
    }
    this.updateThings(dt);
  }

  private spawn() {
    const k = clamp(this.t / GAME_TIME, 0, 1);
    this.spawnT = 1.45 - k * 0.7 + this.rng() * 0.25;
    const double = this.t > 18 && this.rng() < 0.18 + k * 0.2;
    const n = double ? 2 : 1;
    const picks: { def: ItemDef; dir: THREE.Vector2 | null; x: number; h: number }[] = [];
    for (let i = 0; i < n; i++) {
      const r = this.rng();
      const def = this.t > 8 && r < 0.09 ? HEDGEHOG : r > 0.95 ? GOLD : ITEMS[Math.floor(this.rng() * ITEMS.length)];
      const dir = def === HEDGEHOG || def === GOLD ? null : DIRS[Math.floor(this.rng() * 8)];
      const x = n === 1 ? (this.rng() - 0.5) * 0.9 : (i === 0 ? -0.42 : 0.42) + (this.rng() - 0.5) * 0.15;
      const h = 1.05 + this.rng() * 0.75;
      picks.push({ def, dir, x, h });
    }
    for (const lane of this.lanes) for (const p of picks) this.launch(lane, p.def, p.dir, p.x, p.h, k);
    this.ctx.sound.play("splash", 0.25);
  }

  private launch(lane: Lane, def: ItemDef, dir: THREE.Vector2 | null, x: number, apexH: number, k: number) {
    const g = new THREE.Group();
    const halves = def === HEDGEHOG ? [buildHedgehog()] : buildHalves(def);
    // poloviny se rozdělí rovinou kolmou na směr řezu: rovina obsahuje směr švihu a osu pohledu
    const inner = new THREE.Group();
    for (const h of halves) inner.add(h);
    g.add(inner);
    const fwd = lane.fw, right = lane.right, up = new THREE.Vector3(0, 1, 0);
    const d = dir ?? new THREE.Vector2(0, 1);
    // normála roviny řezu ve světě: kolmá na směr švihu v čelní rovině
    const n = new THREE.Vector3().addScaledVector(right, -d.y).addScaledVector(up, d.x).normalize();
    // místní osa X (normála řezu) → n, místní Z → k hráči
    const toPlayer = fwd.clone().negate();
    const yAxis = new THREE.Vector3().crossVectors(toPlayer, n).normalize();
    inner.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(n, yAxis, toPlayer));
    let arrow: THREE.Object3D | null = null;
    if (dir || def === HEDGEHOG) {
      const sm = new THREE.SpriteMaterial({ map: dir ? arrowTexture() : noTexture(), depthTest: false, transparent: true });
      const s = new THREE.Sprite(sm);
      s.scale.setScalar(dir ? 0.55 : 0.4);
      if (dir) sm.rotation = Math.atan2(dir.y, dir.x);
      s.renderOrder = 8;
      s.position.copy(toPlayer).multiplyScalar(def.r + 0.08);
      g.add(s);
      arrow = s;
    }
    if (def === GOLD) {
      const glow = new THREE.Sprite(new THREE.SpriteMaterial({ color: 0xfff1a0, transparent: true, opacity: 0.45, depthWrite: false, blending: THREE.AdditiveBlending }));
      glow.scale.setScalar(0.7);
      g.add(glow);
    }
    const start = lane.spot.clone().addScaledVector(right, x);
    start.y = ARENA.waterY - 0.2;
    const gravity = 7 + k * 3;
    const rise = apexH - start.y;
    const vy = Math.sqrt(2 * gravity * rise);
    g.position.copy(start);
    this.ctx.scene.add(g);
    this.things.push({
      def,
      lane: lane.f.side,
      group: g,
      halves,
      arrow,
      p: start,
      v: new THREE.Vector3(0, vy, 0),
      dir,
      state: "fly",
      t: 0,
      spin: (this.rng() - 0.5) * 4,
      splitN: n,
      halfV: [],
      splashed: false,
    });
    (g.userData as { gravity: number }).gravity = gravity;
    this.ctx.fx.splash(start.clone().setY(ARENA.waterY), 0.15);
  }

  private updateThings(dt: number) {
    for (const th of this.things) {
      th.t += dt;
      const grav = (th.group.userData as { gravity: number }).gravity ?? 8;
      if (th.state === "fly" || th.state === "bounce") {
        th.v.y -= grav * dt;
        th.p.addScaledVector(th.v, dt);
        th.group.position.copy(th.p);
        // točí se kolem normály řezu (rovina řezu zůstává stejná)
        const inner = th.group.children[0];
        inner.quaternion.premultiply(_q.setFromAxisAngle(th.splitN, th.spin * dt * (th.state === "bounce" ? 4 : 1)));
        if (th.state === "fly" && this.playing) this.checkCut(th);
        if (th.p.y < ARENA.waterY - 0.3 && th.v.y < 0) {
          if (th.state === "fly" && th.def !== HEDGEHOG && this.phase === "play") this.miss(th);
          this.drop(th);
        }
      } else if (th.state === "cut") {
        th.halves.forEach((h, i) => {
          const v = th.halfV[i];
          v.y -= grav * dt;
          h.position.addScaledVector(v, dt);
          h.rotation.x += dt * (i ? -3 : 3);
        });
        if (th.arrow) th.arrow.visible = false;
        const lowest = th.group.position.y + Math.min(...th.halves.map((h) => h.position.y));
        if (lowest < ARENA.waterY - 0.3) this.drop(th);
      }
    }
    this.things = this.things.filter((th) => {
      if (th.state !== "gone") return true;
      this.free(th);
      return false;
    });
  }

  /** Odebere věc ze scény a uvolní její geometrie (šablony od Astry ne). */
  private free(th: Thing) {
    th.group.removeFromParent();
    const shared = MODELS.slice.has(th.def.id);
    th.group.traverse((o) => {
      const m = o as THREE.Mesh & THREE.Sprite;
      if ((m as THREE.Sprite).isSprite) (m.material as THREE.Material).dispose();
      else if (m.isMesh && !shared) m.geometry.dispose();
    });
  }

  private drop(th: Thing) {
    if (!th.splashed) {
      th.splashed = true;
      this.ctx.fx.splash(th.group.position.clone().setY(ARENA.waterY), 0.25);
    }
    th.state = "gone";
  }

  private miss(th: Thing) {
    const lane = this.lanes[th.lane];
    lane.missed++;
    if (lane.combo >= 3) this.ctx.pop("Kombo pryč", th.p.clone().setY(0.6), "miss");
    lane.combo = 0;
    this.ctx.sound.play("miss", 0.5);
  }

  private checkCut(th: Thing) {
    const lane = this.lanes[th.lane];
    const f = lane.f;
    const r = th.def.r + 0.06;
    // úsečka čepele ve 4 krocích mezi minulou a současnou polohou
    for (let s = 1; s <= 4; s++) {
      const u = s / 4;
      const dir = _v.lerpVectors(f.prevDir, f.dir, u).normalize();
      const hilt = new THREE.Vector3().lerpVectors(f.prevHilt, f.hilt, u);
      const a = hilt.clone().addScaledVector(dir, f.sword.bladeStart);
      const b = hilt.clone().addScaledVector(dir, f.sword.length);
      const ab = b.clone().sub(a);
      const tt = clamp(th.p.clone().sub(a).dot(ab) / ab.lengthSq(), 0, 1);
      const closest = a.addScaledVector(ab, tt);
      if (closest.distanceTo(th.p) > r) continue;
      const speed = f.speedAt(tt);
      if (speed < V_CUT) return;
      // směr švihu v čelní rovině hráče
      const inv = _q.copy(f.group.quaternion).invert();
      const vL = f.tipVel.clone().applyQuaternion(inv);
      const sw = new THREE.Vector2(vL.x, vL.y);
      if (sw.lengthSq() < 1e-4) return;
      sw.normalize();
      this.resolve(th, lane, sw, speed);
      return;
    }
  }

  private resolve(th: Thing, lane: Lane, sw: THREE.Vector2, speed: number) {
    const c = this.ctx;
    const f = lane.f;
    if (th.def === HEDGEHOG) {
      lane.score = Math.max(0, lane.score - 3);
      lane.combo = 0;
      lane.wrong++;
      th.state = "bounce";
      th.v.set(sw.x * 2, 3, 0).addScaledVector(lane.fw, 3);
      c.sound.play("squeak");
      c.pop("AU! −3", th.p.clone(), "bad");
      c.buzz(f.slot, [80, 50, 80]);
      return;
    }
    const ok = !th.dir || th.dir.dot(sw) > Math.cos((50 * Math.PI) / 180);
    if (!ok) {
      lane.combo = 0;
      lane.wrong++;
      th.state = "bounce";
      const push = new THREE.Vector3().addScaledVector(lane.right, sw.x).add(new THREE.Vector3(0, sw.y, 0)).multiplyScalar(3);
      th.v.copy(push).addScaledVector(lane.fw, 1.5).setY(Math.max(1.5, push.y));
      th.spin *= 3;
      c.sound.play("bonk");
      c.pop("Špatný směr!", th.p.clone(), "bad");
      c.buzz(f.slot, 60);
      return;
    }
    lane.combo++;
    lane.bestCombo = Math.max(lane.bestCombo, lane.combo);
    lane.cuts++;
    const mult = Math.min(4, 1 + Math.floor(lane.combo / 4));
    const pts = th.def.pts * mult;
    lane.score += pts;
    th.state = "cut";
    if (!th.dir) {
      // zlaté jablko: rovinu řezu natočíme podle skutečného švihu
      const n = new THREE.Vector3().addScaledVector(lane.right, -sw.y).add(new THREE.Vector3(0, sw.x, 0)).normalize();
      th.splitN.copy(n);
    }
    const n = th.splitN;
    const inner = th.group.children[0];
    const invInner = inner.quaternion.clone().invert();
    th.halfV = th.halves.map((_, i) => {
      const side = i === 0 ? 1 : -1;
      const v = n.clone().multiplyScalar(side * (1.6 + speed * 0.05)).add(new THREE.Vector3(0, 1.2, 0)).addScaledVector(lane.fw, 0.6);
      return v.applyQuaternion(invInner);
    });
    th.v.set(0, 0, 0);
    c.fx.juice(th.p, th.def.flesh, lane.fw);
    c.sound.play("slice", 0.9);
    c.pop(`+${pts}`, th.p.clone().add(new THREE.Vector3(0, 0.3, 0)), th.def === GOLD ? "gold" : "plus");
    if (mult > 1 && lane.combo % 4 === 0) {
      c.pop(`Kombo ×${mult}!`, th.p.clone().add(new THREE.Vector3(0, 0.65, 0)), "combo");
      c.sound.play("combo");
    }
    c.buzz(f.slot, 25);
    c.cheer(th.def === GOLD ? 0.8 : 0.2);
  }

  private end() {
    this.phase = "end";
    this.phaseT = 0;
    const c = this.ctx;
    c.sound.play("win");
    c.cheer(1);
    const best = [...this.lanes].sort((a, b) => b.score - a.score)[0];
    if (this.lanes.length > 1) {
      const tie = this.lanes[0].score === this.lanes[1].score;
      c.hud.big(tie ? "Remíza!" : `Vítězí ${best.f.name}!`, `${this.lanes[0].score} : ${this.lanes[1].score}`, 3000, "win");
    } else c.hud.big("Konec!", `${best.score} bodů`, 3000, "win");
    if (!this.record || best.score > this.record.score) {
      this.record = { score: best.score, name: best.f.name };
      save("mc_slice_best", this.record);
      this.newRecord = best.score > 0;
      if (this.newRecord) setTimeout(() => c.hud.big("Nový rekord!", `${best.score} bodů`, 2200, "win"), 1600);
    }
    for (const th of this.things) if (th.state === "fly") th.state = "bounce";
  }

  cameras(rigs: CamRig[], dt: number) {
    const owners = this.fighters.slice(0, 2);
    owners.forEach((f, i) => {
      // díváme se tam, kde vyskakují věci
      const lane = this.lanes[i];
      behindToward(rigs[i], f, lane.spot.z + lane.fw.z * 0.4, dt, 6);
    });
    return { owners };
  }

  hud(vps: Viewport[]) {
    const h = this.ctx.hud;
    const panel = (l: Lane) => ({ name: l.f.name, char: l.f.char?.id ?? 0, score: `<b class="num">${l.score}</b>`, sub: l.combo >= 2 ? `kombo ${l.combo}` : "" });
    const left = this.lanes[0], left2 = this.lanes[1] ?? null;
    const timeHtml = `<small>${this.record ? `rekord ${this.record.score}` : "Krájení"}</small><b>${formatClock(this.phase === "play" ? GAME_TIME - this.t : this.phase === "end" ? 0 : GAME_TIME)}</b>`;
    h.setTop(panel(left), left2 ? panel(left2) : null, timeHtml);
    this.fighters.forEach((_f, i) => {
      if (this.phase === "ready") {
        if (this.ready[i]) h.prompt(i, `<b class="ok">✓ Připraven</b>${this.fighters.length > 1 ? " — čeká se na druhého" : ""}`, vps[i]);
        else {
          const pct = Math.round(Math.min(1, this.hold[i] / 0.5) * 100);
          h.prompt(i, `Namiř telefon <b>na obrazovku</b> a podrž <b>KRYT</b><span class="bar"><i style="width:${pct}%"></i></span>`, vps[i]);
        }
      } else if (this.phase === "play" && this.t < 6) h.prompt(i, "Sekni věc <b>ve směru šipky</b>. Ježka nech být!", vps[i]);
      else h.prompt(i, null);
    });
    if (this.fighters.length < 2) h.prompt(1, null);
  }

  pad(slot: number): PadView {
    const i = this.fighters.findIndex((f) => f.slot === slot);
    const lane = this.lanes[i];
    const other = this.lanes[1 - i];
    const score: [number, number] = [lane?.score ?? 0, other ? other.score : -1];
    if (this.phase === "ready")
      return this.ready[i]
        ? { phase: "ready", msg: "Připraven ✓", ready: true, round: 1, score }
        : { phase: "ready", msg: "Namiř telefon na obrazovku a podrž KRYT", ready: false, round: 1, score };
    if (this.phase === "end") return { phase: "point", msg: "Konec krájení!", ready: true, round: 1, score };
    return { phase: "fight", msg: lane && lane.combo >= 4 ? `Kombo ${lane.combo}!` : "", ready: true, round: 1, score };
  }

  results() {
    const rows: ResultRow[] = this.lanes.map((l) => ({
      slot: l.f.slot,
      name: l.f.name,
      char: l.f.char?.id ?? 0,
      human: true,
      win: this.lanes.length > 1 ? l.score > Math.min(...this.lanes.map((x) => x.score)) : true,
      main: `${l.score} b.`,
      sub: `rozseknuto ${l.cuts} · špatně ${l.wrong} · minuto ${l.missed} · nejdelší kombo ${l.bestCombo}`,
    }));
    rows.sort((a, b) => Number(b.win) - Number(a.win));
    const best = [...this.lanes].sort((a, b) => b.score - a.score)[0];
    const title =
      this.lanes.length > 1
        ? this.lanes[0].score === this.lanes[1].score
          ? "Remíza!"
          : `Vítězí ${best.f.name}!`
        : this.newRecord
          ? `Nový rekord: ${best.score} bodů!`
          : `${best.score} bodů`;
    return { title, rows };
  }

  skip() {}

  debug() {
    return {
      phase: this.phase,
      t: Math.round(this.t * 10) / 10,
      things: this.things.length,
      lanes: this.lanes.map((l) => ({ score: l.score, cuts: l.cuts, wrong: l.wrong, missed: l.missed, combo: l.combo })),
      ready: this.ready,
    };
  }

  dispose() {
    for (const f of this.fighters) f.dispose();
    for (const th of this.things) this.free(th);
    this.things = [];
  }
}
