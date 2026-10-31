// Klávesnice a myš na PC (hra bez telefonu a ladění).
export class Input {
  private down = new Set<string>();
  onKey: ((code: string, e: KeyboardEvent) => void) | null = null;
  /** poloha myši −1…1 (střed obrazovky = 0, nahoru = +) */
  mx = 0;
  my = 0.15;
  mouseDown = false;

  constructor(canvas: HTMLElement) {
    addEventListener("keydown", (e) => {
      if ((e.target as HTMLElement)?.tagName === "INPUT") return;
      if (e.code === "Space") e.preventDefault();
      if (e.repeat) return;
      this.down.add(e.code);
      this.onKey?.(e.code, e);
    });
    addEventListener("keyup", (e) => this.down.delete(e.code));
    addEventListener("blur", () => {
      this.down.clear();
      this.mouseDown = false;
    });
    addEventListener("pointermove", (e) => {
      this.mx = (e.clientX / innerWidth) * 2 - 1;
      this.my = -((e.clientY / innerHeight) * 2 - 1);
    });
    canvas.addEventListener("pointerdown", (e) => {
      if (e.button === 0) this.mouseDown = true;
    });
    addEventListener("pointerup", (e) => {
      if (e.button === 0) this.mouseDown = false;
    });
    canvas.addEventListener("contextmenu", (e) => e.preventDefault());
  }

  key(c: string) {
    return this.down.has(c);
  }

  /** KRYT pro hráče s myší */
  get guard() {
    return this.mouseDown || this.down.has("Space");
  }
}
