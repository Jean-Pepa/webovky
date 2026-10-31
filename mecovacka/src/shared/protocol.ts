// Společný „jazyk“ mezi obrazovkou na PC (host) a telefony (meče).
// Zprávy jsou malé JSON objekty posílané přes WebRTC datový kanál (PeerJS).
// Každý telefon otevírá dvě spojení: řídicí (spolehlivé, seřazené) a pohybové
// (neseřazené — ztracený paket nezdrží ty další, starší vzorky PC zahodí podle `ts`).

export const PEER_PREFIX = "mecovacka-";
export const MAX_PLAYERS = 2;
/** Písmena bez záměnných znaků (žádné I/O), kód místnosti má 4 znaky. */
export const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ";
export const CODE_LENGTH = 4;
export const PROTOCOL_VERSION = 1;
/** Štítek pohybového spojení (`conn.label`), `metadata.cid` určuje hráče. */
export const MOTION_LABEL = "m";

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
    return { host: url.hostname, port: Number(url.port) || (secure ? 443 : 80), path: url.pathname || "/", secure };
  } catch {
    return null;
  }
}

export type Mode = "duel" | "slice" | "train";
export const MODES: { id: Mode; name: string; desc: string; emoji: string }[] = [
  { id: "duel", name: "Souboj", desc: "Zásahy tlač soupeře k okraji, až žbluňkne do vody.", emoji: "⚔️" },
  { id: "slice", name: "Krájení", desc: "Rozsekni, co přiletí, ve směru šipky. Ježka nech být!", emoji: "🍉" },
  { id: "train", name: "Trénink", desc: "Seznam se s mečem: švih, zásah, kryt a protiútok.", emoji: "🎯" },
];
/** Obtížnost počítačového soupeře. */
export const DIFFS = ["Pohodový", "Rytířský", "Mistrovský"];
/** Na kolik vítězných kol se hraje (souboj). */
export const ROUNDS = [1, 2, 3];
export const ROUND_LABEL = ["1 kolo", "na 2 vítězná", "na 3 vítězná"];

/**
 * Fáze z pohledu telefonu:
 * lobby = menu, ready = namiř na obrazovku a podrž KRYT, fight = hraje se,
 * point = mezihra (kolo skončilo), results = konec zápasu.
 */
export type Phase = "lobby" | "ready" | "fight" | "point" | "results";

/** Odkud bere telefon natočení: rel = RelativeOrientationSensor, ori = deviceorientation, touch = prst. */
export type SensorKind = "rel" | "ori" | "touch" | "none";

export type Hand = "R" | "L";

export interface LobbyPlayer {
  slot: number;
  name: string;
  char: number;
  host: boolean;
  online: boolean;
  /** "pad" = telefon, "mouse" = myš na PC */
  kind: "pad" | "mouse";
  sensor: SensorKind;
}

export interface ResultRow {
  slot: number;
  name: string;
  char: number;
  human: boolean;
  win: boolean;
  /** hlavní údaj (skóre, výhry kol) */
  main: string;
  /** doplňkové údaje (zásahy, kryty, nejrychlejší švih) */
  sub: string;
}

// ---- telefon → PC ----
export type PadMsg =
  | { t: "hello"; cid: string; name: string; char: number; hand: Hand; v: number }
  /** Vzorek pohybu: q = natočení telefonu (x, y, z, w; ze souřadnic telefonu do zemských, osa Z nahoru),
   *  g = drží KRYT, ts = čas vzorku v telefonu (ms), k = zdroj natočení. */
  | { t: "m"; q: [number, number, number, number]; g: 0 | 1; ts: number; k: SensorKind }
  /** vyrovnat meč: telefon teď míří na obrazovku */
  | { t: "cal" }
  | { t: "me"; name?: string; char?: number; hand?: Hand }
  | { t: "cmd"; c: "start" | "mode" | "diff" | "rounds" | "next" | "lobby" | "pause" | "restart" | "quit"; v?: number }
  | { t: "ping"; ts: number };

// ---- PC → telefon ----
export interface HudState {
  phase: Phase;
  mode: Mode;
  /** text výzvy pro hráče (např. „Namiř na obrazovku a podrž KRYT“) */
  msg: string;
  /** hráč je připravený (kalibrace hotová) */
  ready: boolean;
  round: number;
  /** výhry kol / body (já, soupeř) */
  score: [number, number];
  pause: boolean;
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
      mode: number;
      diff: number;
      rounds: number;
      playing: boolean;
    }
  | ({ t: "hud" } & HudState)
  | { t: "buzz"; ms: number | number[] }
  | { t: "results"; title: string; rows: ResultRow[]; you: number }
  | { t: "pong"; ts: number };
