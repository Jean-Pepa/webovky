// Počítačový šermíř: napřáhne se (s mrknutím špičky), švihne, kryje soupeřovy rány a po vykrytí
// rychle odpoví protiútokem. Ovládá meč stejně jako hráč — natočením (AISword) a KRYTEM.
import * as THREE from "three";
import { AISword, swordToward } from "./controls";
import type { Fighter } from "./fighter";
import { clamp, pick, rand } from "./util";

export interface AIProfile {
  /** reakční doba na soupeřův švih (s) */
  react: number;
  /** šance, že švih vykryje */
  block: number;
  /** pauza mezi útoky (s) */
  gap: [number, number];
  /** napřahování (s) — čím delší, tím líp je útok vidět */
  windup: number;
  /** rychlost švihu (rad/s) */
  swing: number;
  /** rychlost přesunu do krytu (rad/s) */
  guardRate: number;
  /** chyba míření (rad) */
  aim: number;
  /** šance na protiútok po vykrytí */
  counter: number;
  /** šance na klamný útok */
  feint: number;
  /** útočí sám (panák v tréninku jen na pokyn) */
  attacks: boolean;
}

export const AI_PROFILES: AIProfile[] = [
  { react: 0.45, block: 0.32, gap: [1.6, 2.8], windup: 0.6, swing: 6.2, guardRate: 7, aim: 0.3, counter: 0.2, feint: 0, attacks: true },
  { react: 0.3, block: 0.58, gap: [1.0, 2.0], windup: 0.45, swing: 7.6, guardRate: 10, aim: 0.18, counter: 0.5, feint: 0.1, attacks: true },
  { react: 0.19, block: 0.8, gap: [0.65, 1.4], windup: 0.32, swing: 9.0, guardRate: 14, aim: 0.1, counter: 0.8, feint: 0.22, attacks: true },
];

/** Cvičný panák: útočí jen na pokyn tréninku, pomalu a s dlouhým napřahováním. */
export const DUMMY_PROFILE: AIProfile = { react: 9, block: 0, gap: [99, 99], windup: 1.0, swing: 5.2, guardRate: 6, aim: 0.05, counter: 0, feint: 0, attacks: false };

type State = "idle" | "windup" | "swing" | "recover" | "block" | "stunned";

/** Směry švihů v čelní rovině (kam se pohybuje špička): dolů, šikmo, vodorovně. */
const ATTACKS = [-90, -135, -45, 180, 0, -160, -20].map((deg) => {
  const a = (deg * Math.PI) / 180;
  return new THREE.Vector2(Math.cos(a), Math.sin(a));
});

const _v = new THREE.Vector3(), _q = new THREE.Quaternion();

export class DuelAI {
  readonly ctl: AISword;
  p: AIProfile;
  private state: State = "idle";
  private t = 0;
  private next = rand(1.2, 2);
  private u = new THREE.Vector2(0, -1);
  private start = new THREE.Vector3();
  private mid = new THREE.Vector3();
  private end = new THREE.Vector3();
  private stage = 0;
  private threatT = -1;
  private threatBlock = false;
  private blockDir = new THREE.Vector3();
  private blockT = 0;
  private wasFast = false;
  private sway = rand(0, 10);
  /** záblesk špičky při napřahování (0…1) */
  glint = 0;
  /** trénink si objedná útok (směr švihu); vrací se false, až útok skončí */
  requested: THREE.Vector2 | null = null;
  busy = false;

  constructor(ctl: AISword, p: AIProfile) {
    this.ctl = ctl;
    this.p = p;
  }

  private set(dir: THREE.Vector3, rate: number, flat?: THREE.Vector3) {
    swordToward(dir, flat ?? new THREE.Vector3(0, 0, 1), this.ctl.target);
    this.ctl.rate = rate;
  }

  /** Po vykrytí (soupeř je odražený) — šance na rychlý protiútok. */
  onBlocked() {
    if (Math.random() < this.p.counter) this.next = Math.min(this.next, rand(0.05, 0.18));
  }

  /** Útok s daným směrem švihu (pro trénink). */
  attack(u: THREE.Vector2) {
    this.requested = u.clone();
  }

  update(dt: number, self: Fighter, opp: Fighter, active: boolean) {
    this.t += dt;
    this.sway += dt;
    this.glint = Math.max(0, this.glint - dt * 3);
    const ctl = this.ctl;
    if (!active || self.state !== "stand") {
      ctl.guard = false;
      this.state = "idle";
      this.idlePose(0.5);
      return;
    }
    if (self.stun > 0 || self.stagger > 0) {
      this.state = "stunned";
      ctl.guard = false;
      ctl.rate = 3;
      return;
    }
    if (this.state === "stunned") {
      this.state = "recover";
      this.t = 0;
    }

    // soupeřův švih: hrozba → po reakční době kryt (podle šance)
    const fast = opp.canAct && !opp.spent && opp.speedSm > 4.2;
    if (fast && !this.wasFast) {
      this.threatT = 0;
      this.threatBlock = Math.random() < this.p.block;
    }
    this.wasFast = fast;
    if (this.threatT >= 0) {
      this.threatT += dt;
      if (this.threatT >= this.p.react && this.threatBlock && this.state !== "swing") {
        this.startBlock(self, opp);
        this.threatT = -1;
      } else if (this.threatT > this.p.react + 0.3) this.threatT = -1;
    }

    switch (this.state) {
      case "idle":
        ctl.guard = false;
        this.idlePose(this.p.guardRate * 0.6);
        this.next -= dt * (opp.teeter > 0.3 ? 1.8 : 1);
        if (this.requested) {
          this.beginAttack(this.requested, self, opp);
          this.requested = null;
        } else if (this.p.attacks && this.next <= 0) this.beginAttack(pick(ATTACKS), self, opp);
        break;
      case "windup":
        ctl.guard = false;
        this.busy = true;
        this.set(this.start, 5.5);
        if (this.t > this.p.windup * 0.55) this.glint = 1;
        if (this.t > this.p.windup) {
          if (this.p.feint > 0 && this.stage === 0 && Math.random() < this.p.feint) {
            // klamný útok: napřáhne se jinam
            this.stage = 1;
            this.plan(pick(ATTACKS), self, opp);
            this.t = this.p.windup * 0.4;
          } else {
            this.state = "swing";
            this.stage = 0;
            this.t = 0;
          }
        }
        break;
      case "swing": {
        ctl.guard = false;
        const target = this.stage === 0 ? this.mid : this.end;
        this.set(target, this.p.swing, _v.set(-this.u.y, this.u.x, 0).cross(target).normalize());
        const ang = ctl.q.angleTo(ctl.target);
        if (ang < 0.12) {
          if (this.stage === 0) this.stage = 1;
          else this.toRecover();
        }
        if (this.t > 1.2) this.toRecover();
        break;
      }
      case "recover":
        ctl.guard = false;
        this.idlePose(4);
        if (this.t > 0.35) {
          this.state = "idle";
          this.busy = false;
          this.next = rand(this.p.gap[0], this.p.gap[1]);
        }
        break;
      case "block":
        ctl.guard = true;
        this.set(this.blockDir, this.p.guardRate);
        this.blockT -= dt;
        if (opp.speedSm > 3.5 && opp.canAct) this.blockT = Math.max(this.blockT, 0.2);
        if (this.blockT <= 0) {
          ctl.guard = false;
          this.state = "idle";
          this.next = Math.min(this.next, rand(0.3, 0.8));
        }
        break;
    }
  }

  private toRecover() {
    this.state = "recover";
    this.t = 0;
  }

  /** Klidový postoj: meč míří soupeři na hlavu, jemně se pohupuje. */
  private idlePose(rate: number) {
    const s = this.sway;
    this.set(_v.set(-0.08 + Math.sin(s * 1.3) * 0.08, 0.32 + Math.sin(s * 0.9) * 0.06, -1).normalize(), rate);
  }

  private plan(u: THREE.Vector2, self: Fighter, opp: Fighter) {
    this.u.copy(u);
    const e = this.p.aim;
    this.start.set(-u.x * 0.9, -u.y * 0.9 + 0.3, 0.3).normalize();
    // míří na hlavu nebo trup soupeře (v souřadnicích šermíře)
    const target = (Math.random() < 0.5 ? opp.body.head : opp.body.torsoB).clone();
    const loc = self.group.worldToLocal(target);
    const from = new THREE.Vector3(0.17, 1.0, -0.33);
    this.mid.subVectors(loc, from).normalize();
    this.mid.x += rand(-e, e);
    this.mid.y += rand(-e, e);
    this.mid.normalize();
    this.end.set(u.x * 0.95, u.y * 0.95 - 0.1, -0.4).normalize();
  }

  private beginAttack(u: THREE.Vector2, self: Fighter, opp: Fighter) {
    this.plan(u, self, opp);
    this.state = "windup";
    this.stage = 0;
    this.t = 0;
    this.busy = true;
  }

  /** Kryt kolmo na směr soupeřova švihu (v čelní rovině). */
  private startBlock(self: Fighter, opp: Fighter) {
    const inv = _q.copy(self.group.quaternion).invert();
    const v = _v.copy(opp.tipVel).applyQuaternion(inv);
    let bx = -v.y, by = v.x;
    if (Math.hypot(bx, by) < 0.5) {
      // bodnutí přímo: svislý kryt
      bx = 0;
      by = 1;
    }
    if (by < 0) {
      bx = -bx;
      by = -by;
    }
    const l = Math.hypot(bx, by) || 1;
    this.blockDir.set(bx / l, by / l, -0.3).normalize();
    // trochu nepřesnosti podle obtížnosti
    this.blockDir.x += rand(-this.p.aim, this.p.aim) * 0.6;
    this.blockDir.y = clamp(this.blockDir.y + rand(-this.p.aim, this.p.aim) * 0.6, -0.2, 1);
    this.blockDir.normalize();
    this.state = "block";
    this.blockT = 0.45;
    this.busy = false;
  }
}
