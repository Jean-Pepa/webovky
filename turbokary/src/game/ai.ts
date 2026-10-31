// Boti: jedou po ideální stopě (do vnitřku zatáček), driftují a používají věci.
// Motokáru mají stejnou jako hráči. Obtížnost (skill) mění jen to, jak dobře řídí:
// slabší boti méně driftují a v ostrých zatáčkách ubírají plyn.
import { MAX_SPEED, type Controls, type Kart } from "./kart";
import type { Track } from "./track";
import { clamp, wrapAngle } from "./util";

export interface BotContext {
  racing: boolean;
  ahead: Kart | null;
  aheadGap: number;
  behind: Kart | null;
  behindGap: number;
}

export class BotBrain {
  readonly skill: number;
  private lane = 0;
  private laneGoal = 0;
  private laneT = 0;
  private hold = false;
  private holdT = 0;
  private itemT = 1;
  private stuckT = 0;
  private reverseT = 0;
  private r: () => number;

  constructor(r: () => number, skill: number) {
    this.r = r;
    this.skill = skill;
    this.lane = (r() * 2 - 1) * 0.5;
    this.laneGoal = this.lane;
  }

  think(k: Kart, track: Track, dt: number, ctx: BotContext): { c: Controls; useItem: boolean; dir: number } {
    const r = this.r;
    this.laneT -= dt;
    if (this.laneT <= 0) {
      this.laneGoal = (r() * 2 - 1) * 0.55;
      this.laneT = 2 + r() * 4;
    }
    this.lane += (this.laneGoal - this.lane) * Math.min(1, dt * 0.8);

    const vF = Math.max(0, k.vF);
    const idx = k.proj.idx < 0 ? 0 : k.proj.idx;
    const look = 7 + vF * 0.55;
    const ti = (idx + Math.round(look / track.ds)) % track.n;
    const kAhead = track.curvAhead(idx, 8, 34);
    const inside = -Math.sign(kAhead) * Math.min(1, Math.abs(kAhead) * 45) * 0.55;
    const lat = clamp(this.lane * (1 - Math.min(1, Math.abs(kAhead) * 40)) + inside, -0.75, 0.75) * track.hw;
    const tx = track.px[ti] + track.rx[ti] * lat;
    const tz = track.pz[ti] + track.rz[ti] * lat;
    const diff = wrapAngle(Math.atan2(tx - k.x, tz - k.z) - k.heading);
    let steer = clamp(-diff * 2.4, -1, 1);
    let gas = 1;
    let brake = 0;

    if (ctx.racing && vF < 1.5 && k.spinT <= 0 && this.reverseT <= 0) {
      this.stuckT += dt;
      if (this.stuckT > 1.4) {
        this.reverseT = 1.1;
        this.stuckT = 0;
      }
    } else this.stuckT = 0;
    if (this.reverseT > 0) {
      this.reverseT -= dt;
      gas = 0;
      brake = 1;
      steer = -steer;
    } else if (this.skill < 1 && ctx.racing && k.boostT <= 0) {
      const sharp = clamp((Math.abs(track.curvAhead(idx, 4, 26)) - 0.02) / 0.04, 0, 1);
      if (vF > MAX_SPEED * (1 - (1 - this.skill) * 1.2 * sharp)) gas = 0;
    }

    // drift do delších zatáček
    let drift = false;
    if (this.hold) {
      this.holdT += dt;
      drift = true;
      const cNow = track.curvAhead(idx, 0, 18);
      if (!k.drifting && this.holdT > 0.45) this.hold = false;
      if (k.drifting) {
        const stillTurning = Math.abs(cNow) > 0.01 && Math.sign(cNow) === -k.driftDir;
        if (k.driftLevel >= 2 || (k.driftLevel >= 1 && !stillTurning) || this.holdT > 3.6) this.hold = false;
      }
      if (!k.drifting && Math.abs(steer) < 0.4) steer = Math.sign(-kAhead || steer) * 0.6;
      if (!this.hold) drift = false;
    } else if (this.reverseT <= 0 && vF > 15 && Math.abs(kAhead) > 0.02 && r() < dt * 2.5 * this.skill) {
      this.hold = true;
      this.holdT = 0;
      drift = true;
    }

    // věci
    let useItem = false;
    let dir = 0;
    if (k.item && k.rollT <= 0) {
      this.itemT -= dt;
      if (this.itemT <= 0) {
        const straight = Math.abs(track.curvAhead(idx, 0, 40)) < 0.01;
        const ahead = !!ctx.ahead && ctx.aheadGap < 45;
        const behind = !!ctx.behind && ctx.behindGap < 20;
        switch (k.item) {
          case "turbo":
          case "turbo3":
            useItem = straight;
            break;
          case "rocket":
            if (ctx.ahead && ctx.aheadGap < 70) useItem = true;
            else if (behind) {
              useItem = true;
              dir = -1;
            }
            break;
          case "coconut":
            if (ahead && straight) useItem = true;
            else if (behind) {
              useItem = true;
              dir = -1;
            } else useItem = this.itemT < -10;
            break;
          case "oil":
            if (behind || this.itemT < -9) {
              useItem = true;
              dir = -1;
            } else if (ahead && ctx.aheadGap < 26) {
              useItem = true;
              dir = 1;
            }
            break;
          case "ram":
            useItem = straight || ahead || behind;
            break;
          case "bees":
          case "shield":
            useItem = true;
            break;
          case "wings":
            useItem = straight || this.itemT < -3;
            break;
        }
        if (useItem) this.itemT = 0.5 + r() * 2.5;
      }
    } else if (!k.item) this.itemT = 0.8 + r() * 2.2;

    return { c: { steer, gas, brake, drift }, useItem, dir };
  }
}
