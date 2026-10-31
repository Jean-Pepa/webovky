// Společné rozhraní herních režimů (souboj, krájení, trénink) a služby, které jim dává hra.
import type * as THREE from "three";
import type { CharacterDef } from "../shared/characters";
import type { HudState, Mode, ResultRow } from "../shared/protocol";
import type { Arena } from "./arena";
import type { Sound } from "./audio";
import type { Effects } from "./effects";
import type { Hud } from "./hud";
import type { Fighter } from "./fighter";
import type { CamRig, View, Viewport } from "./view";
import type { SwordCtl } from "./controls";

export interface Ctx {
  scene: THREE.Scene;
  arena: Arena;
  fx: Effects;
  sound: Sound;
  hud: Hud;
  view: View;
  /** vibrace telefonu hráče */
  buzz(slot: number, ms: number | number[]): void;
  /** vyskakující nápis na místě ve světě (ve všech pohledech) */
  pop(text: string, p: THREE.Vector3, cls?: string): void;
  /** diváci na břehu zajásají (0…1) */
  cheer(amount: number): void;
  /** zatřese kamerou */
  shake(amount: number): void;
}

/** Kdo hraje: lidé (slot, postava, meč z telefonu / myši) a nastavení. */
export interface Entrant {
  slot: number;
  name: string;
  char: CharacterDef;
  hand: "R" | "L";
  ctl: SwordCtl;
}

export interface PadView {
  phase: HudState["phase"];
  msg: string;
  ready: boolean;
  round: number;
  score: [number, number];
}

export interface Activity {
  readonly kind: Mode;
  readonly fighters: Fighter[];
  /** zpomalení času (rozhodující rána) */
  readonly timeScale: number;
  readonly finished: boolean;
  step(dt: number, now: number): void;
  /** kamery: 1 nebo 2 pohledy podle počtu hráčů */
  cameras(rigs: CamRig[], dt: number): { owners: (Fighter | null)[] };
  hud(vps: Viewport[]): void;
  pad(slot: number): PadView;
  results(): { title: string; rows: ResultRow[] };
  /** Enter: přeskočit úvod */
  skip(): void;
  dispose(): void;
}

export const kmh = (ms: number) => Math.round(ms * 3.6);
