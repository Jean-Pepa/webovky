// Řízení náklonem: z gyroskopu (deviceorientation) spočítá, jak moc je telefon nakloněný do strany.
// Funguje, ať telefon držíš jako volant (na výšku displejem k sobě) nebo naplocho.

const D2R = Math.PI / 180;
const R2D = 180 / Math.PI;

type OrientationCtor = typeof DeviceOrientationEvent & { requestPermission?: () => Promise<"granted" | "denied"> };

function screenAngle(): number {
  const a = screen.orientation?.angle ?? (window as unknown as { orientation?: number }).orientation ?? 0;
  return ((Number(a) % 360) + 360) % 360;
}

export class Tilt {
  /** -1 (doleva) … 1 (doprava) */
  steer = 0;
  /** surový úhel náklonu ve stupních (+ = doprava) */
  angle = 0;
  lastEvent = -Infinity;
  /** přišla aspoň jedna platná data ze senzoru (tj. povolení je udělené) */
  everReceived = false;
  /** úhel pro plný rejd */
  fullLock = 28;
  deadzone = 3;
  offset = 0;
  private listening = false;

  get needsPermission() {
    const C = (window as unknown as { DeviceOrientationEvent?: OrientationCtor }).DeviceOrientationEvent;
    return !!C && typeof C.requestPermission === "function";
  }

  get supported() {
    return "DeviceOrientationEvent" in window;
  }

  /** Dostáváme data ze senzoru? */
  get live() {
    return performance.now() - this.lastEvent < 1500;
  }

  /** iOS: povolení se musí vyžádat po ťuknutí. */
  async request(): Promise<boolean> {
    const C = (window as unknown as { DeviceOrientationEvent?: OrientationCtor }).DeviceOrientationEvent;
    try {
      if (C && typeof C.requestPermission === "function") {
        const res = await C.requestPermission();
        if (res !== "granted") return false;
      }
    } catch {
      return false;
    }
    this.start();
    return true;
  }

  start() {
    if (this.listening) return;
    this.listening = true;
    addEventListener("deviceorientation", (e) => this.onOrientation(e));
  }

  recenter() {
    this.offset = this.angle + this.offset;
  }

  private onOrientation(e: DeviceOrientationEvent) {
    if (e.beta == null || e.gamma == null) return;
    const b = e.beta * D2R, g = e.gamma * D2R;
    // svislý směr („nahoru“) v souřadnicích telefonu
    const ux = -Math.cos(b) * Math.sin(g);
    const uy = Math.sin(b);
    // přepočet do souřadnic displeje podle otočení obrazovky
    const t = screenAngle() * D2R;
    const sx = ux * Math.cos(t) - uy * Math.sin(t);
    // úhel, o který je vodorovná osa displeje skloněná (+ = pravá strana dolů = doprava)
    const raw = Math.asin(Math.max(-1, Math.min(1, -sx))) * R2D;
    this.angle = raw - this.offset;
    const a = Math.abs(this.angle);
    const s = a <= this.deadzone ? 0 : Math.min(1, (a - this.deadzone) / (this.fullLock - this.deadzone));
    this.steer = Math.sign(this.angle) * s;
    this.lastEvent = performance.now();
    this.everReceived = true;
  }
}
