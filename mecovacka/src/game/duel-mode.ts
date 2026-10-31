// Režim Souboj: 1 hráč proti počítači, nebo 2 hráči (rozdělená obrazovka). Napojuje logiku souboje
// na efekty, zvuky, HUD, kamery a telefony.
import * as THREE from "three";
import { CHARACTERS, type CharacterDef } from "../shared/characters";
import type { ResultRow } from "../shared/protocol";
import { AI_PROFILES, DuelAI } from "./ai";
import { AISword, MouseSword } from "./controls";
import { Duel, type DuelEvents, type DuelPhase } from "./duel";
import { Fighter } from "./fighter";
import { pips } from "./hud";
import { CamRig, behind, orbit, sideShot, type Viewport } from "./view";
import { kmh, type Activity, type Ctx, type Entrant, type PadView } from "./activity";
import { formatClock, pick } from "./util";

export function makeFighter(ctx: Ctx, char: CharacterDef | null, name: string, ctl: Fighter["ctl"], slot: number, side: 0 | 1, hand: "R" | "L") {
  const f = new Fighter(char, name, ctl, slot, side);
  f.hand = hand;
  ctx.scene.add(f.group, f.sword.root, f.trail.mesh);
  return f;
}

export interface DuelOptions {
  diff: number;
  roundsToWin: number;
  /** souboj počítačů v lobby (bez HUD, potichu) */
  demo?: boolean;
}

const HIT_WORDS = ["BUM!", "PLÁC!", "BAC!", "PUF!"];

export class DuelActivity implements Activity {
  readonly kind = "duel" as const;
  readonly fighters: Fighter[];
  readonly duel: Duel;
  private ais: (DuelAI | null)[] = [];
  private viewers: Fighter[];
  private ctx: Ctx;
  private opts: DuelOptions;
  private faller: Fighter | null = null;
  private overT = -1;
  private fightT = 0;
  private orbitA = Math.random() * 6;
  finished = false;

  constructor(ctx: Ctx, entrants: Entrant[], opts: DuelOptions) {
    this.ctx = ctx;
    this.opts = opts;
    const used = new Set(entrants.map((e) => e.char.id));
    const fighters: Fighter[] = [];
    entrants.slice(0, 2).forEach((e, i) => fighters.push(makeFighter(ctx, e.char, e.name, e.ctl, e.slot, i as 0 | 1, e.hand)));
    while (fighters.length < 2) {
      const free = CHARACTERS.filter((c) => !used.has(c.id));
      const c = pick(free.length ? free : CHARACTERS);
      used.add(c.id);
      const ctl = new AISword();
      const f = makeFighter(ctx, c, c.short, ctl, -1, fighters.length as 0 | 1, "R");
      fighters.push(f);
    }
    this.fighters = fighters;
    this.ais = fighters.map((f) => (f.slot < 0 ? new DuelAI(f.ctl as AISword, AI_PROFILES[opts.demo ? 1 : opts.diff] ?? AI_PROFILES[1]) : null));
    this.viewers = fighters.filter((f) => f.slot >= 0);
    this.duel = new Duel(fighters[0], fighters[1], { roundsToWin: opts.demo ? 99 : opts.roundsToWin, roundTime: opts.demo ? 9999 : 60, training: false, skipIntro: !!opts.demo }, this.events());
  }

  get timeScale() {
    return this.duel.timeScale;
  }

  private quiet() {
    return this.opts.demo ? 0.25 : 1;
  }

  private events(): DuelEvents {
    const c = this.ctx;
    return {
      hit: (a, b, info) => {
        const col = a.char?.main ?? 0xffffff;
        c.fx.hit(info.p, col, info.strength);
        c.sound.play(info.strong || info.counter ? "hitStrong" : "hit", (0.6 + info.strength * 0.4) * this.quiet());
        if (this.opts.demo) return;
        const word = info.counter ? "PROTIÚTOK!" : info.strong ? "PRÁSK!" : info.part === "head" ? "DO HLAVY!" : pick(HIT_WORDS);
        c.pop(word, info.p, info.counter ? "counter" : info.strong ? "strong" : "hit");
        c.pop(`${kmh(info.speed)} km/h`, info.p.clone().add(new THREE.Vector3(0, -0.35, 0)), "speed");
        c.shake(info.strong ? 0.07 : 0.03);
        if (info.strong || info.counter) c.hud.flash("rgba(255,255,255,0.28)");
        c.buzz(b.slot, info.strong ? 150 : 70);
        c.buzz(a.slot, 25);
        c.cheer(info.strong || info.counter ? 0.8 : 0.35);
      },
      block: (att, def, p) => {
        c.fx.clash(p, true);
        c.sound.play("block", this.quiet());
        this.ais[def.side]?.onBlocked();
        if (this.opts.demo) return;
        c.pop("KRYT!", p, "block");
        c.buzz(def.slot, 35);
        c.buzz(att.slot, [70, 40, 70]);
        c.cheer(0.25);
      },
      clash: (a, b, p, power) => {
        c.fx.clash(p, false);
        c.sound.play("clash", (0.5 + power * 0.5) * this.quiet());
        if (this.opts.demo) return;
        if (power > 0.5) c.pop("ŤUK!", p, "clash");
        c.buzz(a.slot, 30);
        c.buzz(b.slot, 30);
      },
      teeter: (f) => {
        if (this.opts.demo) return;
        c.pop("Pozor!", f.body.head.clone().add(new THREE.Vector3(0, 0.55, 0)), "teeter");
        c.sound.play("teeter", 0.8);
        c.buzz(f.slot, [30, 30, 30, 30, 30]);
      },
      fall: (f) => {
        this.faller = f;
        c.sound.play("teeter", 0.9 * this.quiet());
        c.buzz(f.slot, 300);
      },
      splash: (_f, p) => {
        c.fx.splash(p, 1.2);
        c.arena.splash(p);
        c.sound.play("splash", this.quiet());
        if (this.opts.demo) return;
        c.shake(0.05);
        c.cheer(1);
        c.hud.big("ŽBLUŇK!", this.duel.roundWinner ? `Kolo pro ${this.duel.roundWinner.name}` : "", 2000, "splash");
      },
      ready: (f) => {
        c.sound.play("ready");
        c.buzz(f.slot, 40);
      },
      phase: (p) => this.onPhase(p),
      round: (w, reason) => {
        if (this.opts.demo) return;
        c.sound.play("point");
        if (reason === "time") c.hud.big("Čas!", w ? `Kolo pro ${w.name} — měl víc místa za zády` : "Nerozhodně", 2400);
        if (w) c.buzz(w.slot, [40, 60, 40]);
      },
      over: (w) => {
        if (this.opts.demo) return;
        setTimeout(() => {
          c.sound.play("win");
          if (w) c.fx.confetti(w.body.head.clone().add(new THREE.Vector3(0, 1, 0)));
          c.cheer(1);
          c.hud.big(w ? `Vítězí ${w.name}!` : "Remíza!", "", 2600, "win");
        }, 1300);
      },
    };
  }

  private onPhase(p: DuelPhase) {
    const c = this.ctx;
    if (this.opts.demo) return;
    if (p === "intro") c.hud.big("Mečovačka", "Molo na rybníce", 2600, "title");
    else if (p === "ready") {
      this.faller = null;
      c.hud.big(`Kolo ${this.duel.round}`, "", 1600);
    } else if (p === "go") {
      c.hud.big("Připravit…", "", 700);
      c.sound.play("count");
      setTimeout(() => {
        c.hud.big("TEĎ!", "", 700, "go");
        c.sound.play("gong");
      }, 600);
    } else if (p === "fight") this.fightT = 0;
    else if (p === "over") this.overT = 0;
  }

  step(dt: number, now: number) {
    const d = this.duel;
    const active = d.phase === "fight";
    this.fighters.forEach((f, i) => {
      const ai = this.ais[i];
      if (!ai) return;
      ai.update(dt, f, this.fighters[1 - i], active);
      f.sword.setGlint(ai.glint);
    });
    d.step(dt, now);
    this.fightT += dt;
    if (this.overT >= 0) {
      this.overT += dt;
      if (this.overT > 4.2) this.finished = true;
    }
  }

  cameras(rigs: CamRig[], dt: number) {
    const d = this.duel;
    const [a, b] = this.fighters;
    if (this.opts.demo || !this.viewers.length) {
      this.orbitA += dt * 0.08;
      orbit(rigs[0], this.orbitA, 8.5, 3.4, new THREE.Vector3(0, 0.9, (a.z + b.z) / 2));
      return { owners: [null] };
    }
    const owners: Fighter[] = this.viewers.slice(0, 2);
    owners.forEach((f, i) => {
      const rig = rigs[i];
      const opp = f === a ? b : a;
      if (d.phase === "intro") {
        const k = d.phaseT / 3.2;
        orbit(rig, this.orbitA + i * Math.PI + k * 2.2, 7.5 - k * 2, 3.6 - k, new THREE.Vector3(0, 0.9, 0));
        if (k > 0.85) {
          rig.snap = false;
          behind(rig, f, opp, dt, 3);
        }
      } else if (d.phase === "point" && this.faller && d.phaseT < 2.7) sideShot(rig, this.faller, dt);
      else if (d.phase === "over" && d.matchWinner) {
        this.orbitA += dt * 0.25;
        const w = d.matchWinner;
        orbit(rig, this.orbitA + i * Math.PI, 4.2, 2.3, w.group.position.clone().setY(1.1));
      } else behind(rig, f, opp, dt, d.phase === "point" ? 2.5 : 6);
    });
    return { owners };
  }

  hud(vps: Viewport[]) {
    const h = this.ctx.hud;
    if (this.opts.demo) {
      h.show(false);
      return;
    }
    h.show(true);
    const d = this.duel;
    const [a, b] = this.fighters;
    const panel = (f: Fighter) => ({
      name: f.name,
      char: f.char?.id ?? 0,
      score: pips(d.score[f.side], d.cfg.roundsToWin),
      sub: f.slot < 0 ? "počítač" : undefined,
    });
    h.setTop(panel(a), panel(b), `<small>Kolo ${d.round}</small><b>${d.phase === "fight" || d.phase === "point" ? formatClock(d.timeLeft) : "1:00"}</b>`);
    this.viewers.slice(0, 2).forEach((f, i) => {
      const vp = vps[i];
      const mouse = f.ctl instanceof MouseSword;
      if (d.phase === "ready") {
        const idx = f.side;
        if (d.ready[idx]) h.prompt(i, `<b class="ok">✓ Připraven</b> — čeká se na soupeře`, vp);
        else {
          const pct = Math.round(Math.min(1, d.hold[idx] / 0.5) * 100);
          h.prompt(
            i,
            `${!f.ctl.live ? `<b class="bad">📵 Telefon nepřipojen</b><br>` : ""}${mouse ? "Podrž <b>levé tlačítko myši</b>" : "Namiř telefon <b>na obrazovku</b> a podrž <b>KRYT</b>"}<span class="bar"><i style="width:${pct}%"></i></span>`,
            vp,
          );
        }
      } else if (d.phase === "fight" && this.fightT < 5 && d.round === 1)
        h.prompt(i, mouse ? "Švihni myší! Kryt = levé tlačítko." : "Švihni mečem! <b>KRYT</b> podržíš palcem — nastav meč proti úderu.", vp);
      else if (d.phase === "fight" && !f.ctl.live) h.prompt(i, `<b class="bad">📵 Telefon neposílá pohyb</b>`, vp);
      else h.prompt(i, null);
    });
    for (let i = this.viewers.length; i < 2; i++) h.prompt(i, null);
  }

  pad(slot: number): PadView {
    const d = this.duel;
    const f = this.fighters.find((x) => x.slot === slot);
    const me = f ? f.side : 0;
    const score: [number, number] = [d.score[me], d.score[1 - me]];
    const base = { round: d.round, score };
    switch (d.phase) {
      case "intro":
        return { ...base, phase: "point", msg: "Za chvíli to začne…", ready: false };
      case "ready":
        return d.ready[me]
          ? { ...base, phase: "ready", msg: "Připraven ✓ — čeká se na soupeře", ready: true }
          : { ...base, phase: "ready", msg: "Namiř telefon na obrazovku a podrž KRYT", ready: false };
      case "go":
      case "fight":
        return { ...base, phase: "fight", msg: f && f.teeter > 0.5 ? "Pozor, jsi na okraji!" : "", ready: true };
      case "point":
        return { ...base, phase: "point", msg: d.roundWinner ? (d.roundWinner === f ? "Kolo je tvoje! 🎉" : `Kolo pro ${d.roundWinner.name}`) : "Nerozhodně", ready: true };
      case "over":
        return { ...base, phase: "point", msg: d.matchWinner === f ? "Vyhráváš! 🏆" : "Konec zápasu", ready: true };
    }
  }

  results() {
    const d = this.duel;
    const w = d.matchWinner;
    const rows: ResultRow[] = this.fighters.map((f) => ({
      slot: f.slot,
      name: f.name,
      char: f.char?.id ?? 0,
      human: f.slot >= 0,
      win: f === w,
      main: String(d.score[f.side]),
      sub: `zásahy ${f.stats.hits} · kryty ${f.stats.blocks}${f.stats.counters ? ` · protiútoky ${f.stats.counters}` : ""} · nejrychlejší ${kmh(f.stats.best)} km/h`,
    }));
    rows.sort((x, y) => Number(y.win) - Number(x.win));
    return { title: w ? `Vítězí ${w.name}!` : "Remíza", rows };
  }

  skip() {
    this.duel.skip();
  }

  dispose() {
    for (const f of this.fighters) f.dispose();
  }
}
