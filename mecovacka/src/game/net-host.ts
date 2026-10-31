// PC jako hostitel: zaregistruje se na signalizačním serveru pod kódem místnosti a přijímá
// přímá WebRTC spojení z telefonů — řídicí i rychlá pohybová (štítek MOTION_LABEL).
import Peer, { type DataConnection } from "peerjs";
import { MOTION_LABEL, makeRoomCode, type HostMsg, type PadMsg } from "../shared/protocol";
import { hostPeerId, peerOptions } from "../shared/net";

export interface HostEvents {
  status(kind: "connecting" | "ready" | "error", detail?: string): void;
  room(code: string): void;
  message(conn: DataConnection, msg: PadMsg): void;
  /** pohybové spojení telefonu (metadata.cid) */
  motion(conn: DataConnection, cid: string): void;
  closed(conn: DataConnection): void;
}

export class NetHost {
  code = "";
  private peer: Peer | null = null;
  private retries = 0;
  private restartTimer = 0;
  private ev: HostEvents;

  constructor(ev: HostEvents) {
    this.ev = ev;
  }

  get ready() {
    return !!this.peer && this.peer.open;
  }

  start(code = makeRoomCode()) {
    clearTimeout(this.restartTimer);
    this.code = code;
    this.ev.status("connecting");
    const peer = new Peer(hostPeerId(code), peerOptions());
    this.peer = peer;
    peer.on("open", () => {
      this.retries = 0;
      this.ev.room(code);
      this.ev.status("ready");
    });
    peer.on("connection", (conn) => this.wire(conn));
    peer.on("disconnected", () => {
      // spojení se signalizačním serverem spadlo; běžící spojení s telefony žijí dál
      setTimeout(() => {
        if (!peer.destroyed && peer.disconnected) peer.reconnect();
      }, 1500);
    });
    peer.on("error", (err) => {
      const type = (err as { type?: string }).type ?? "";
      if (type === "unavailable-id") {
        peer.destroy();
        this.start();
        return;
      }
      if (type === "peer-unavailable") return;
      if (type === "browser-incompatible") {
        this.ev.status("error", "Tenhle prohlížeč neumí WebRTC. Použij Chrome, Edge nebo Firefox.");
        return;
      }
      if (["network", "server-error", "socket-error", "socket-closed", "disconnected"].includes(type)) {
        this.ev.status("error", "Nedaří se spojit se signalizačním serverem, zkouším znovu…");
        this.scheduleRestart();
        return;
      }
      console.warn("PeerJS:", type, err);
    });
  }

  private scheduleRestart() {
    clearTimeout(this.restartTimer);
    this.retries++;
    this.restartTimer = window.setTimeout(() => {
      if (this.peer?.open) return;
      if (this.peer && !this.peer.destroyed && this.peer.disconnected) {
        this.peer.reconnect();
        this.scheduleRestart();
        return;
      }
      this.peer?.destroy();
      this.start(this.code);
    }, Math.min(10000, 1500 * this.retries));
  }

  private wire(conn: DataConnection) {
    let closed = false;
    const close = () => {
      if (closed) return;
      closed = true;
      this.ev.closed(conn);
    };
    const isMotion = conn.label === MOTION_LABEL;
    if (isMotion) {
      const cid = String((conn.metadata as { cid?: unknown } | undefined)?.cid ?? "");
      if (conn.open) this.ev.motion(conn, cid);
      else conn.on("open", () => this.ev.motion(conn, cid));
    }
    conn.on("data", (d) => {
      const msg = d as PadMsg;
      if (msg && typeof msg === "object" && typeof (msg as { t?: unknown }).t === "string") this.ev.message(conn, msg);
    });
    conn.on("close", close);
    conn.on("error", close);
  }

  send(conn: DataConnection | null, msg: HostMsg) {
    if (!conn || !conn.open) return;
    try {
      void conn.send(msg);
    } catch {
      /* kanál se právě zavírá */
    }
  }
}
