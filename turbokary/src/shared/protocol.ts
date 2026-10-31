// Společný „jazyk“ mezi obrazovkou na PC (host) a telefony (ovladače).
// Zprávy jsou malé JSON objekty posílané přes WebRTC datový kanál (PeerJS).

export const PEER_PREFIX = "turbokary-";
export const MAX_PLAYERS = 4;
export const MAX_RACERS = 8;
/** Písmena bez záměnných znaků (žádné I/O), kód místnosti má 4 znaky. */
export const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ";
export const CODE_LENGTH = 4;
export const PROTOCOL_VERSION = 1;

export function makeRoomCode(): string {
  const bytes = new Uint8Array(CODE_LENGTH);
  crypto.getRandomValues(bytes);
  let out = "";
  for (const b of bytes) out += CODE_ALPHABET[b % CODE_ALPHABET.length];
  return out;
}

export function normalizeCode(raw: string): string {
  const up = raw.toUpperCase().replace(/0/g, "O").replace(/1/g, "I");
  let out = "";
  for (const ch of up) if (CODE_ALPHABET.includes(ch)) out += ch;
  return out.slice(0, CODE_LENGTH);
}

export interface PeerServerOptions {
  host: string;
  port: number;
  path: string;
  secure: boolean;
  key?: string;
}

/**
 * Volitelný vlastní signalizační server: `?peer=localhost:9000` nebo `?peer=https://muj-server.cz/`.
 * Bez parametru se použije veřejný server PeerJS (0.peerjs.com).
 */
export function peerServerFromUrl(search: URLSearchParams): PeerServerOptions | null {
  const raw = search.get("peer");
  if (!raw) return null;
  try {
    const url = new URL(raw.includes("://") ? raw : `http://${raw}`);
    const secure = url.protocol === "https:";
    return {
      host: url.hostname,
      port: Number(url.port) || (secure ? 443 : 80),
      path: url.pathname || "/",
      secure,
    };
  } catch {
    return null;
  }
}

export type Phase = "lobby" | "countdown" | "race" | "results";
export type Mode = "race" | "cup";

/** Rychlostní třídy (násobek max. rychlosti všech motokár). */
export const SPEED_CLASSES = [
  { name: "Pohodová", mul: 0.86 },
  { name: "Závodní", mul: 1 },
  { name: "Šílená", mul: 1.14 },
];

/** Body v poháru podle umístění. */
export const CUP_POINTS = [10, 8, 6, 5, 4, 3, 2, 1];

export interface LobbyPlayer {
  slot: number;
  name: string;
  char: number;
  host: boolean;
  online: boolean;
  /** "pad" = telefon, "kb" = klávesnice na PC */
  kind: "pad" | "kb";
}

export interface CupRow {
  place: number;
  name: string;
  char: number;
  pts: number;
  add: number;
  human: boolean;
  slot: number;
}

export interface CupInfo {
  round: number;
  of: number;
  rows: CupRow[];
  final: boolean;
  next: string | null;
}

export interface ResultRow {
  place: number;
  name: string;
  char: number;
  time: string;
  best: string;
  human: boolean;
  slot: number;
}

// ---- telefon → PC ----
export type PadMsg =
  | { t: "hello"; cid: string; name: string; char: number; v: number }
  | { t: "in"; s: number; g: number; b: number; d: number }
  | { t: "item"; dir?: -1 | 0 | 1 }
  | { t: "me"; name?: string; char?: number; mirror?: boolean }
  | { t: "cmd"; c: "start" | "lobby" | "next" | "track" | "laps" | "bots" | "mode" | "speed" | "pause" | "restart" | "quit"; v?: number }
  | { t: "ping"; ts: number };

// ---- PC → telefon ----
export interface HudState {
  pos: number;
  of: number;
  lap: number;
  laps: number;
  item: string | null;
  n: number;
  roll: boolean;
  fin: boolean;
  drift: number;
  boost: boolean;
  shield: boolean;
  /** závod je pozastavený */
  pause: boolean;
  /** jsi hostitel (smíš pauzu a restart) */
  host: boolean;
}

export type HostMsg =
  | { t: "welcome"; slot: number; v: number }
  | { t: "full" }
  | {
      t: "lobby";
      players: LobbyPlayer[];
      you: number;
      host: boolean;
      track: number;
      tracks: string[];
      laps: number;
      bots: number;
      maxBots: number;
      racing: boolean;
      mode: Mode;
      speed: number;
      speeds: string[];
      cupRound: number;
    }
  | { t: "phase"; p: Phase; n?: number }
  | ({ t: "hud" } & HudState)
  | { t: "buzz"; ms: number | number[] }
  | { t: "results"; rows: ResultRow[]; you: number; record?: string; cup?: CupInfo }
  | { t: "pong"; ts: number };
