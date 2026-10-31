// Hráči v místnosti (telefony a myš na PC): sloty, postavy, ruka a jejich meče.
import type { DataConnection } from "peerjs";
import { CHARACTERS } from "../shared/characters";
import { MAX_PLAYERS, type Hand, type LobbyPlayer, type SensorKind } from "../shared/protocol";
import { MouseSword, PhoneSword } from "./controls";

export interface Player {
  slot: number;
  cid: string;
  name: string;
  char: number;
  hand: Hand;
  kind: "pad" | "mouse";
  conn: DataConnection | null;
  motion: DataConnection | null;
  lastSeen: number;
  joinedAt: number;
  ping: number;
  sword: PhoneSword | MouseSword;
  sensor: SensorKind;
  hudKey: string;
  hudAt: number;
}

const OFFLINE_MS = 4000;

export class Session {
  players: Player[] = [];
  private seq = 0;

  bySlot(slot: number) {
    return this.players.find((p) => p.slot === slot) ?? null;
  }
  byCid(cid: string) {
    return this.players.find((p) => p.cid === cid) ?? null;
  }
  byConn(conn: DataConnection) {
    return this.players.find((p) => p.conn === conn || p.motion === conn) ?? null;
  }

  online(p: Player, now = performance.now()) {
    if (p.kind === "mouse") return true;
    return !!p.conn && p.conn.open && now - p.lastSeen < OFFLINE_MS;
  }

  get full() {
    return this.players.length >= MAX_PLAYERS;
  }

  freeChar(prefer = -1, except = -1) {
    const used = new Set(this.players.filter((p) => p.slot !== except).map((p) => p.char));
    if (prefer >= 0 && prefer < CHARACTERS.length && !used.has(prefer)) return prefer;
    return CHARACTERS.find((c) => !used.has(c.id))?.id ?? 0;
  }

  add(kind: "pad" | "mouse", cid: string, name: string, char: number, hand: Hand, conn: DataConnection | null): Player | null {
    if (this.full) return null;
    let slot = 0;
    while (this.bySlot(slot)) slot++;
    const p: Player = {
      slot,
      cid,
      name: cleanName(name) || `Hráč ${slot + 1}`,
      char: this.freeChar(char),
      hand: hand === "L" ? "L" : "R",
      kind,
      conn,
      motion: null,
      lastSeen: performance.now(),
      joinedAt: ++this.seq,
      ping: 0,
      sword: kind === "mouse" ? new MouseSword() : new PhoneSword(),
      sensor: kind === "mouse" ? "touch" : "none",
      hudKey: "",
      hudAt: 0,
    };
    this.players.push(p);
    this.players.sort((a, b) => a.slot - b.slot);
    return p;
  }

  remove(slot: number) {
    this.players = this.players.filter((p) => p.slot !== slot);
  }

  /** Hostitel lobby = nejdřív připojený telefon, který je online. */
  hostSlot(now = performance.now()) {
    const pads = this.players.filter((p) => p.kind === "pad" && this.online(p, now));
    pads.sort((a, b) => a.joinedAt - b.joinedAt);
    return pads.length ? pads[0].slot : -1;
  }

  lobbyPlayers(now = performance.now()): LobbyPlayer[] {
    const host = this.hostSlot(now);
    return this.players.map((p) => ({
      slot: p.slot,
      name: p.name,
      char: p.char,
      host: p.slot === host,
      online: this.online(p, now),
      kind: p.kind,
      sensor: p.sensor,
    }));
  }
}

export function cleanName(raw: unknown): string {
  if (typeof raw !== "string") return "";
  return raw.replace(/[\u0000-\u001f<>]/g, "").trim().slice(0, 14);
}
