// Natočení telefonu = natočení meče (1:1).
// Přednost má RelativeOrientationSensor (Chrome na Androidu: gyroskop + akcelerometr, bez kompasu,
// takže meč „neuskakuje“), jinak `deviceorientation` (iPhone, ostatní prohlížeče).
// Výsledek je vždy kvaternion ze souřadnic telefonu do zemských (osa Z nahoru, otočení kolem
// svislé osy je libovolné — srovná se kalibrací „namiř na obrazovku“).
import { qFromDeviceOrientation, qaxis, qmul, qrot, type Q } from "../shared/quat";
import type { SensorKind } from "../shared/protocol";

type PermissionCtor = { requestPermission?: () => Promise<"granted" | "denied"> };

interface GenericSensor extends EventTarget {
  quaternion: ArrayLike<number> | null;
  start(): void;
  stop(): void;
}
type SensorCtor = new (opts: { frequency: number; referenceFrame?: "device" | "screen" }) => GenericSensor;

export class Motion {
  q: Q = [0, 0, 0, 1];
  kind: SensorKind = "none";
  lastAt = -Infinity;
  /** volá se s každým novým vzorkem */
  onSample: ((q: Q, ts: number) => void) | null = null;
  private sensor: GenericSensor | null = null;
  private oriOn = false;
  /** poslední natočení z deviceorientation (pro kontrolu obecného senzoru) */
  private qOri: Q | null = null;
  private qOriAt = -Infinity;
  /** jak obecný senzor udává natočení: přímo (telefon → země), obráceně, nebo nesedí vůbec */
  private convention: "direct" | "inverse" | "bad" | null = null;
  private checkSince = -1;
  private touchYaw = 0;
  private touchPitch = 0;

  /** Dostáváme data ze senzoru? */
  get live() {
    return performance.now() - this.lastAt < 1200;
  }

  /** iPhone: povolení pohybových senzorů se musí vyžádat ťuknutím. */
  get needsPermission() {
    const C = (window as unknown as { DeviceOrientationEvent?: PermissionCtor }).DeviceOrientationEvent;
    return !!C && typeof C.requestPermission === "function";
  }

  get secure() {
    return window.isSecureContext;
  }

  /** Spustí čtení senzorů (bez dotazu na povolení). */
  start() {
    if (!this.secure) return;
    if (!this.sensor && "RelativeOrientationSensor" in window) this.startGeneric();
    this.startOrientation();
  }

  /** iPhone: požádá o povolení (musí být po ťuknutí), pak spustí senzory. */
  async request(): Promise<boolean> {
    try {
      const O = (window as unknown as { DeviceOrientationEvent?: PermissionCtor }).DeviceOrientationEvent;
      const M = (window as unknown as { DeviceMotionEvent?: PermissionCtor }).DeviceMotionEvent;
      if (O && typeof O.requestPermission === "function") {
        const r = await O.requestPermission();
        if (r !== "granted") return false;
      }
      if (M && typeof M.requestPermission === "function") await M.requestPermission().catch(() => "denied");
    } catch {
      return false;
    }
    this.start();
    return true;
  }

  private startGeneric() {
    try {
      const Ctor = (window as unknown as { RelativeOrientationSensor: SensorCtor }).RelativeOrientationSensor;
      const s = new Ctor({ frequency: 60, referenceFrame: "device" });
      s.addEventListener("reading", () => {
        const q = s.quaternion;
        if (!q || q.length < 4 || this.convention === "bad") return;
        let qq: Q = [q[0], q[1], q[2], q[3]];
        const conv = this.check(qq);
        if (conv === "bad") return;
        if (conv === "inverse") qq = [-qq[0], -qq[1], -qq[2], qq[3]];
        this.kind = "rel";
        this.push(qq);
      });
      s.addEventListener("error", () => {
        // senzor není nebo je zakázaný → zůstane deviceorientation
        try {
          s.stop();
        } catch {
          /* už neběží */
        }
        if (this.sensor === s) this.sensor = null;
      });
      s.start();
      this.sensor = s;
    } catch {
      this.sensor = null;
    }
  }

  private startOrientation() {
    if (this.oriOn) return;
    this.oriOn = true;
    addEventListener("deviceorientation", (e) => {
      if (e.alpha == null || e.beta == null || e.gamma == null) return;
      const q = qFromDeviceOrientation(e.alpha, e.beta, e.gamma);
      this.qOri = q;
      this.qOriAt = performance.now();
      // když běží obecný senzor, deviceorientation jen hlídá (je to totéž, jen přes Eulerovy úhly)
      if (this.sensor && this.kind === "rel" && this.live) return;
      this.kind = "ori";
      this.push(q);
    });
  }

  /**
   * Pojistka: směr gravitace v souřadnicích telefonu musí sedět s deviceorientation.
   * Kdyby obecný senzor udával natočení obráceně (země → telefon), otočíme ho; kdyby nesedělo
   * vůbec, vypneme ho a zůstane deviceorientation.
   */
  private check(q: Q) {
    if (this.convention || !this.qOri || performance.now() - this.qOriAt > 250) return this.convention;
    const conj = (a: Q): Q => [-a[0], -a[1], -a[2], a[3]];
    const g = qrot(conj(this.qOri), [0, 0, 1]);
    const a = qrot(conj(q), [0, 0, 1]);
    const b = qrot(q, [0, 0, 1]);
    const dA = a[0] * g[0] + a[1] * g[1] + a[2] * g[2];
    const dB = b[0] * g[0] + b[1] * g[1] + b[2] * g[2];
    if (this.checkSince < 0) this.checkSince = performance.now();
    if (dA > 0.95 && dA - dB > 0.25) this.convention = "direct";
    else if (dB > 0.95 && dB - dA > 0.25) this.convention = "inverse";
    else if (Math.abs(dA - dB) > 0.25 && Math.max(dA, dB) < 0.8 && performance.now() - this.checkSince > 2500) {
      this.convention = "bad";
      try {
        this.sensor?.stop();
      } catch {
        /* už neběží */
      }
      this.sensor = null;
    }
    return this.convention;
  }

  private push(q: Q) {
    this.q = q;
    const now = performance.now();
    this.lastAt = now;
    this.onSample?.(q, now);
  }

  /**
   * Záložní ovládání prstem (bez senzorů): posun prstu natáčí meč.
   * dx, dy v rozsahu −1…1 (střed = meč míří dopředu).
   */
  touch(dx: number, dy: number) {
    this.touchYaw = -dx * 1.25;
    this.touchPitch = -dy * 1.35;
    if (this.live && this.kind !== "touch") return;
    this.kind = "touch";
    // telefon „na plocho“ míří horní hranou dopředu; náklon kolem X zvedá špičku, kolem Z otáčí do stran
    this.push(qmul(qaxis(0, 0, 1, this.touchYaw), qaxis(1, 0, 0, this.touchPitch)));
  }
}
