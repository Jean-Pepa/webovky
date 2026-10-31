// Telefon jako klient: najde PC podle kódu místnosti a udržuje s ním spojení.
import Peer, { type DataConnection } from "peerjs";
import type { HostMsg, PadMsg } from "../shared/protocol";
import { CONNECT_OPTIONS, hostPeerId, peerOptions } from "../shared/net";

export interface PadNetEvents {
  open(): void;
  closed(reason: string): void;
  message(m: HostMsg): void;
}

export class PadNet {
  private peer: Peer | null = null;
  private conn: DataConnection | null = null;
  private retryTimer = 0;
  private openTimer = 0;
  private stopped = false;
  private code: string;
  private ev: PadNetEvents;

  constructor(code: string, ev: PadNetEvents) {
    this.code = code;
    this.ev = ev;
  }

  get open() {
    return !!this.conn && this.conn.open;
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
      this.fail("Spojení s PC se přerušilo, připojuji znovu…");
    };
    conn.on("close", closed);
    conn.on("error", closed);
  }

  private fail(reason: string, retry = true) {
    clearTimeout(this.openTimer);
    this.ev.closed(reason);
    if (!retry || this.stopped) return;
    clearTimeout(this.retryTimer);
    this.retryTimer = window.setTimeout(() => this.connect(), 2500);
  }

  send(m: PadMsg) {
    if (!this.conn || !this.conn.open || this.conn.dataChannel?.readyState !== "open") return;
    try {
      void this.conn.send(m);
    } catch {
      /* kanál se zavírá */
    }
  }

  stop() {
    this.stopped = true;
    clearTimeout(this.retryTimer);
    this.conn?.close();
    this.peer?.destroy();
  }
}
