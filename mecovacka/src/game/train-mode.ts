// Režim Trénink: slaměný panák na kůlu. Krok za krokem: švih, zásah, silná rána, kryt, protiútok.
// Panák nepadá (jen se kymácí) a útočí pomalu s dlouhým napřahováním, ať je kryt vidět.
import * as THREE from "three";
import type { ResultRow } from "../shared/protocol";
import { ARENA } from "./arena";
import { DUMMY_PROFILE, DuelAI } from "./ai";
import { AISword, MouseSword } from "./controls";
import { Duel, type DuelEvents } from "./duel";
import { makeFighter } from "./duel-mode";
import type { Fighter } from "./fighter";
import { CamRig, behind, type Viewport } from "./view";
import { kmh, type Activity, type Ctx, type Entrant, type PadView } from "./activity";
import { pick } from "./util";

interface Step {
  id: "swing" | "hit" | "strong" | "block" | "counter" | "free";
  text: string;
  short: string;
  need: number;
}

const STEPS: Step[] = [
  { id: "swing", text: "Zamávej mečem — meč na obrazovce kopíruje tvou ruku. Udělej <b>3 rychlé švihy</b>.", short: "Zamávej mečem", need: 3 },
  { id: "hit", text: "Švihni do panáka: <b>3 zásahy</b>. Rána se počítá, jen když švihneš (ne když se meče jen dotkneš).", short: "Zasáhni panáka", need: 3 },
  { id: "strong", text: "<b>Silná rána:</b> švihni co nejrychleji — aspoň 38 km/h. Silná rána odhodí soupeře dál.", short: "Silná rána", need: 1 },
  { id: "block", text: "Panák útočí! Až mrkne špička jeho meče, <b>podrž KRYT</b> a dej meč do cesty jeho úderu: svisle proti ráně z boku, vodorovně proti ráně shora. <b>3 kryty</b>.", short: "Vykryj úder", need: 3 },
  { id: "counter", text: "Po vykrytí je panák chvíli odražený — hned pusť KRYT a udeř: <b>PROTIÚTOK</b> (2×). Odhodí nejvíc.", short: "Protiútok", need: 2 },
  { id: "free", text: "Hotovo! Trénuj dál, nebo dej pauzu (<b>Esc</b> / ⏸ v telefonu) a zkus Souboj.", short: "Volný trénink", need: 0 },
];

/** Útoky panáka v tréninku: hlavně z boku a shora. */
const DUMMY_ATTACKS = [180, 0, -90, -135].map((d) => new THREE.Vector2(Math.cos((d * Math.PI) / 180), Math.sin((d * Math.PI) / 180)));

export class TrainActivity implements Activity {
  readonly kind = "train" as const;
  readonly fighters: Fighter[];
  readonly duel: Duel;
  private ai: DuelAI;
  private ctx: Ctx;
  private me: Fighter;
  private dummy: Fighter;
  private stepIdx = 0;
  private count = 0;
  private fastPrev = false;
  private attackT = 2.5;
  private stepT = 0;
  readonly finished = false;

  constructor(ctx: Ctx, e: Entrant) {
    this.ctx = ctx;
    this.me = makeFighter(ctx, e.char, e.name, e.ctl, e.slot, 0, e.hand);
    const ctl = new AISword();
    this.dummy = makeFighter(ctx, null, "Panák", ctl, -1, 1, "R");
    this.dummy.anchored = true;
    this.ai = new DuelAI(ctl, DUMMY_PROFILE);
    this.fighters = [this.me, this.dummy];
    this.duel = new Duel(this.me, this.dummy, { roundsToWin: 99, roundTime: 9999, training: true, skipIntro: true }, this.events());
    ctx.hud.big("Trénink", "Slaměný panák to vydrží", 2200, "title");
  }

  get timeScale() {
    return 1;
  }

  private get cur() {
    return STEPS[this.stepIdx];
  }

  private progress(id: Step["id"]) {
    if (this.cur.id !== id) return;
    this.count++;
    this.ctx.sound.play("combo");
    if (this.count >= this.cur.need) this.next();
  }

  private next() {
    this.stepIdx = Math.min(STEPS.length - 1, this.stepIdx + 1);
    this.count = 0;
    this.stepT = 0;
    this.attackT = 1.6;
    this.ctx.sound.play("point");
    this.ctx.cheer(0.6);
    this.ctx.buzz(this.me.slot, [40, 60, 40]);
    this.ctx.hud.big(this.stepIdx === STEPS.length - 1 ? "Hotovo! 🎉" : "Výborně!", this.cur.short, 1500, "win");
  }

  private events(): DuelEvents {
    const c = this.ctx;
    return {
      hit: (a, b, info) => {
        c.fx.hit(info.p, a.char?.main ?? 0xffe9a8, info.strength);
        c.sound.play(info.strong || info.counter ? "hitStrong" : "hit", 0.6 + info.strength * 0.4);
        c.pop(`${kmh(info.speed)} km/h`, info.p.clone().add(new THREE.Vector3(0, -0.3, 0)), "speed");
        if (a === this.me) {
          c.pop(info.counter ? "PROTIÚTOK!" : info.strong ? "PRÁSK!" : pick(["BUM!", "PLÁC!", "BAC!"]), info.p, info.counter ? "counter" : info.strong ? "strong" : "hit");
          c.buzz(a.slot, 25);
          this.progress("hit");
          if (info.strong) this.progress("strong");
          if (info.counter) this.progress("counter");
        } else {
          c.pop("Au!", info.p, "bad");
          c.buzz(b.slot, 80);
        }
      },
      block: (_att, def, p) => {
        c.fx.clash(p, true);
        c.sound.play("block");
        if (def === this.me) {
          c.pop("KRYT!", p, "block");
          c.buzz(def.slot, 35);
          this.progress("block");
        }
      },
      clash: (_a, _b, p, power) => {
        c.fx.clash(p, false);
        c.sound.play("clash", 0.5 + power * 0.5);
      },
      teeter: () => {},
      fall: () => {},
      splash: () => {},
      ready: (f) => {
        c.sound.play("ready");
        c.buzz(f.slot, 40);
      },
      phase: (p) => {
        if (p === "go") c.hud.big("Jdeme na to!", "", 900, "go");
      },
      round: () => {},
      over: () => {},
    };
  }

  step(dt: number, now: number) {
    const d = this.duel;
    const active = d.phase === "fight";
    this.stepT += dt;
    // panák útočí jen v krocích kryt / protiútok / volný trénink
    if (active && ["block", "counter", "free"].includes(this.cur.id) && !this.ai.busy && this.dummy.canAct) {
      this.attackT -= dt;
      if (this.attackT <= 0) {
        this.ai.attack(pick(DUMMY_ATTACKS));
        this.attackT = this.cur.id === "free" ? 3.4 : 2.6;
      }
    }
    this.ai.update(dt, this.dummy, this.me, active);
    this.dummy.sword.setGlint(this.ai.glint);
    d.step(dt, now);
    // krok 1: rychlé švihy
    const fast = this.me.speedSm > 6;
    if (active && fast && !this.fastPrev) this.progress("swing");
    this.fastPrev = fast;
  }

  cameras(rigs: CamRig[], dt: number) {
    behind(rigs[0], this.me, this.dummy, dt, 6);
    return { owners: [this.me] };
  }

  hud(vps: Viewport[]) {
    const h = this.ctx.hud;
    const d = this.duel;
    const st = this.cur;
    h.setTop(
      { name: this.me.name, char: this.me.char?.id ?? 0, score: st.need ? `<b class="num">${this.count}/${st.need}</b>` : `<b class="num">✓</b>`, sub: st.short },
      null,
      `<small>Trénink</small><b>${Math.min(this.stepIdx + 1, STEPS.length - 1)}/${STEPS.length - 1}</b>`,
    );
    if (d.phase === "ready") {
      const mouse = this.me.ctl instanceof MouseSword;
      const pct = Math.round(Math.min(1, d.hold[0] / 0.5) * 100);
      h.prompt(
        0,
        `${mouse ? "Podrž <b>levé tlačítko myši</b>" : "Namiř telefon <b>na obrazovku</b> a podrž <b>KRYT</b> — tím se meč vyrovná."}<span class="bar"><i style="width:${pct}%"></i></span>`,
        vps[0],
      );
    } else h.prompt(0, st.text + (st.need ? ` <span class="cnt">${this.count}/${st.need}</span>` : ""), vps[0]);
    h.prompt(1, null);
  }

  pad(slot: number): PadView {
    void slot;
    const d = this.duel;
    if (d.phase === "ready")
      return d.ready[0]
        ? { phase: "ready", msg: "Připraven ✓", ready: true, round: 1, score: [this.count, -1] }
        : { phase: "ready", msg: "Namiř telefon na obrazovku a podrž KRYT", ready: false, round: 1, score: [this.count, -1] };
    return { phase: "fight", msg: this.cur.short + (this.cur.need ? ` ${this.count}/${this.cur.need}` : ""), ready: true, round: 1, score: [this.stepIdx, -1] };
  }

  results() {
    const s = this.me.stats;
    const rows: ResultRow[] = [
      {
        slot: this.me.slot,
        name: this.me.name,
        char: this.me.char?.id ?? 0,
        human: true,
        win: this.stepIdx >= STEPS.length - 1,
        main: `${Math.min(this.stepIdx, STEPS.length - 1)}/${STEPS.length - 1}`,
        sub: `zásahy ${s.hits} · kryty ${s.blocks} · protiútoky ${s.counters} · nejrychlejší ${kmh(s.best)} km/h`,
      },
    ];
    return { title: "Trénink", rows };
  }

  skip() {
    this.duel.skip();
  }

  debug() {
    return { step: this.cur.id, count: this.count, phase: this.duel.phase, ready: this.duel.ready, waterY: ARENA.waterY };
  }

  dispose() {
    for (const f of this.fighters) f.dispose();
  }
}
