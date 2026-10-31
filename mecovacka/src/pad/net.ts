// Telefon jako klient: najde PC podle kódu místnosti a drží s ním dvě spojení —
// řídicí (lobby, příkazy) a pohybové (natočení meče, neseřazené kvůli nízkému zpoždění).
import Peer, { type DataConnection } from "peerjs";
import { MOTION_LABEL, type HostMsg, type PadMsg } from "../shared/protocol";
import { CONNECT_OPTIONS, MOTION_OPTIONS, hostPeerId, peerOptions } from "../shared/net";

export interface PadNetEvents {
  open(): void;
  closed(reason: string): void;
  message(m: HostMsg): void;
}

export class PadNet {
  private peer: Peer | null = null;
  private conn: DataConnection | null = null;
  private motion: DataConnection | null = null;
  private retryTimer = 0;
  private openTimer = 0;
  private motionTimer = 0;
  private stopped = false;
  private code: string;
  private cid: string;
  private ev: PadNetEvents;

  constructor(code: string, cid: string, ev: PadNetEvents) {
    this.code = code;
    this.cid = cid;
    this.ev = ev;
  }

  get open() {
    return !!this.conn && this.conn.open;
  }

  /** běží rychlé pohybové spojení (jinak jde pohyb řídicím) */
  get fast() {
    return !!this.motion && this.motion.open;
  }

  connect() {
    this.stopped = false;
    clearTimeout(this.retryTimer);
    if (!this.peer || this.peer.destroyed) {
      const peer = new Peer(peerOptions());
      this.peer = peer;
      peer.on("open", () => this.dial());
      peer.on("disconnected", () => {
        setTimeout(() => {
          if (!peer.destroyed && peer.disconnected) peer.reconnect();
        }, 1000);
      });
      peer.on("error", (err) => {
        const type = (err as { type?: string }).type ?? "";
        if (type === "peer-unavailable") this.fail(`PC s kódem ${this.code} jsem nenašel. Běží hra na PC?`);
        else if (type === "browser-incompatible") this.fail("Tenhle prohlížeč neumí WebRTC. Zkus Chrome nebo Safari.", false);
        else if (["network", "server-error", "socket-error", "socket-closed"].includes(type)) {
          this.peer?.destroy();
          this.peer = null;
          this.fail("Nedaří se spojit se serverem. Je telefon připojený k internetu?");
        } else this.fail("Chyba spojení (" + type + ")");
      });
    } else if (this.peer.open) this.dial();
  }

  private dial() {
    if (!this.peer || this.stopped) return;
    this.conn?.close();
    this.closeMotion();
    const conn = this.peer.connect(hostPeerId(this.code), CONNECT_OPTIONS);
    this.conn = conn;
    clearTimeout(this.openTimer);
    this.openTimer = window.setTimeout(() => {
      if (!conn.open) {
        conn.close();
        this.fail("Spojení se nepodařilo navázat. Jsou telefon i PC na stejné Wi-Fi?");
      }
    }, 12000);
    conn.on("open", () => {
      clearTimeout(this.openTimer);
      this.ev.open();
    });
    conn.on("data", (d) => {
      const m = d as HostMsg;
      if (m && typeof m === "object" && typeof (m as { t?: unknown }).t === "string") this.ev.message(m);
    });
    const closed = () => {
      if (this.conn !== conn) return;
      this.conn = null;
      this.closeMotion();
      this.fail("Spojení s PC se přerušilo, připojuji znovu…");
    };
    conn.on("close", closed);
    conn.on("error", closed);
  }

  /** Otevře pohybové spojení (volá se po `welcome`). */
  openMotion() {
    if (!this.peer || !this.peer.open || this.stopped || this.motion) return;
    const m = this.peer.connect(hostPeerId(this.code), { ...MOTION_OPTIONS, label: MOTION_LABEL, metadata: { cid: this.cid } });
    this.motion = m;
    const drop = () => {
      if (this.motion !== m) return;
      this.motion = null;
      // zkusíme znovu za chvíli, mezitím jde pohyb řídicím spojením
      clearTimeout(this.motionTimer);
      this.motionTimer = window.setTimeout(() => {
        if (this.open) this.openMotion();
      }, 3000);
    };
    m.on("close", drop);
    m.on("error", drop);
    setTimeout(() => {
      if (this.motion === m && !m.open) {
        m.close();
        drop();
      }
    }, 10000);
  }

  private closeMotion() {
    clearTimeout(this.motionTimer);
    const m = this.motion;
    this.motion = null;
    m?.close();
  }

  private fail(reason: string, retry = true) {
    clearTimeout(this.openTimer);
    this.ev.closed(reason);
    if (!retry || this.stopped) return;
    clearTimeout(this.retryTimer);
    this.retryTimer = window.setTimeout(() => this.connect(), 2500);
  }

  send(m: PadMsg) {
    if (!this.conn || !this.conn.open) return;
    try {
      void this.conn.send(m);
    } catch {
      /* kanál se zavírá */
    }
  }

  /** Vzorek pohybu: rychlým kanálem, když běží, jinak řídicím. */
  sendMotion(m: PadMsg) {
    const c = this.motion && this.motion.open ? this.motion : this.conn;
    if (!c || !c.open) return;
    try {
      void c.send(m);
    } catch {
      /* kanál se zavírá */
    }
  }

  stop() {
    this.stopped = true;
    clearTimeout(this.retryTimer);
    this.closeMotion();
    this.conn?.close();
    this.peer?.destroy();
  }
}
