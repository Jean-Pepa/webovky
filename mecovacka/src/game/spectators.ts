// Diváci na břehu: zvířátka, která zrovna nešermují. Fandí při zásazích a hlavně při žbluňknutí.
import * as THREE from "three";
import { CHARACTERS } from "../shared/characters";
import type { Arena } from "./arena";
import { Puppet } from "./puppet";
import { rand } from "./util";

interface Fan {
  p: Puppet;
  group: THREE.Group;
  char: number;
  cheer: number;
  t: number;
  jump: number;
}

export class Spectators {
  private fans: Fan[] = [];
  private scene: THREE.Scene;
  private arena: Arena;
  private look = new THREE.Vector3(0, 1.2, 0);

  constructor(scene: THREE.Scene, arena: Arena) {
    this.scene = scene;
    this.arena = arena;
  }

  /** Rozestaví zvířátka, která nehrají (exclude = postavy na molu). */
  setup(exclude: number[]) {
    const want = CHARACTERS.filter((c) => !exclude.includes(c.id)).map((c) => c.id);
    const keep = this.fans.filter((f) => want.includes(f.char));
    for (const f of this.fans) if (!keep.includes(f)) f.group.removeFromParent();
    this.fans = keep;
    for (const id of want) {
      if (this.fans.some((f) => f.char === id)) continue;
      const g = new THREE.Group();
      const p = new Puppet(CHARACTERS[id]);
      g.add(p.root);
      this.scene.add(g);
      this.fans.push({ p, group: g, char: id, cheer: 0, t: rand(0, 10), jump: 0 });
    }
    const spots = this.arena.spectatorSpots;
    this.fans.forEach((f, i) => {
      const s = spots[i % spots.length];
      f.group.position.copy(s.pos);
      f.group.position.x += Math.floor(i / spots.length) * 0.9;
      // loutka se dívá do −Z; natočíme ji ke středu mola
      f.group.rotation.y = s.yaw;
      f.group.scale.setScalar(0.92);
    });
  }

  cheer(amount: number) {
    for (const f of this.fans) {
      f.cheer = Math.min(1, Math.max(f.cheer, amount * rand(0.6, 1.1)));
      if (amount > 0.6 && Math.random() < 0.7) f.jump = 1;
    }
  }

  setLook(p: THREE.Vector3) {
    this.look.copy(p);
  }

  update(dt: number) {
    for (const f of this.fans) {
      f.t += dt;
      f.cheer = Math.max(0, f.cheer - dt * 0.45);
      f.jump = Math.max(0, f.jump - dt * 1.6);
      const hop = Math.abs(Math.sin(f.t * 9)) * 0.22 * f.jump;
      f.p.root.position.y = hop;
      f.group.updateMatrixWorld(true);
      f.p.pose({
        t: f.t,
        crouch: 0.1,
        lean: 0,
        twist: 0,
        hit: 0,
        teeter: 0,
        flail: 0,
        cheer: f.cheer,
        walk: 0,
        walkAmt: 0,
        look: this.look,
        hand: "R",
        gripPos: null,
        gripQuat: null,
        pole: null,
      });
    }
  }

  dispose() {
    for (const f of this.fans) f.group.removeFromParent();
    this.fans = [];
  }
}
