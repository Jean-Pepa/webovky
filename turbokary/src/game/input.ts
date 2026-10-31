// Klávesnice na PC (pro hru bez telefonu a pro testování).
import type { PadInput } from "./session";

export type Scheme = "both" | "wasd" | "arrows";

const GAME_KEYS = new Set([
  "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space", "KeyW", "KeyA", "KeyS", "KeyD",
]);

export class Keyboard {
  private down = new Set<string>();
  onKey: ((code: string, e: KeyboardEvent) => void) | null = null;
  blockGameKeys = false;

  constructor() {
    addEventListener("keydown", (e) => {
      if ((e.target as HTMLElement)?.tagName === "INPUT") return;
      if (this.blockGameKeys && GAME_KEYS.has(e.code)) e.preventDefault();
      if (e.repeat) return;
      this.down.add(e.code);
      this.onKey?.(e.code, e);
    });
    addEventListener("keyup", (e) => this.down.delete(e.code));
    addEventListener("blur", () => this.down.clear());
  }

  private k(c: string) {
    return this.down.has(c);
  }

  controls(s: Scheme): PadInput {
    const w = s !== "arrows", a = s !== "wasd";
    const left = (w && this.k("KeyA")) || (a && this.k("ArrowLeft"));
    const right = (w && this.k("KeyD")) || (a && this.k("ArrowRight"));
    const gas = (w && this.k("KeyW")) || (a && this.k("ArrowUp"));
    const brake = (w && this.k("KeyS")) || (a && this.k("ArrowDown"));
    const drift =
      (w && (this.k("Space") || this.k("ShiftLeft"))) ||
      (a && (this.k("ShiftRight") || this.k("Period") || (s === "both" && this.k("Space"))));
    return { s: (right ? 1 : 0) - (left ? 1 : 0), g: gas ? 1 : 0, b: brake ? 1 : 0, d: drift ? 1 : 0 };
  }

  /** Klávesa pro použití věci podle schématu. */
  static isItemKey(code: string, s: Scheme) {
    const w = s !== "arrows", a = s !== "wasd";
    return (w && (code === "KeyE" || code === "KeyQ" || code === "ControlLeft")) ||
      (a && (code === "Enter" || code === "NumpadEnter" || code === "ControlRight" || code === "Slash"));
  }
}
