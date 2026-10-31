// Společné nastavení spojení PeerJS pro PC (host) i telefon (ovladač).
import type { PeerJSOption } from "peerjs";
import { PEER_PREFIX, peerServerFromUrl } from "./protocol";

/** ID hostitele (PC) na signalizačním serveru. */
export const hostPeerId = (code: string) => PEER_PREFIX + code;

/** Volby pro `peer.connect(...)` — spolehlivý, seřazený kanál s JSON zprávami. */
export const CONNECT_OPTIONS = { reliable: true, serialization: "json" } as const;

/** Volby pro `new Peer(...)`: výchozí veřejný server PeerJS, nebo vlastní přes `?peer=host:port`. */
export function peerOptions(search: URLSearchParams = new URLSearchParams(location.search)): PeerJSOption {
  const custom = peerServerFromUrl(search);
  return custom ? { ...custom, debug: 1 } : { debug: 1 };
}

/** Parametr `peer` z aktuální adresy (předává se dál do odkazu pro telefony). */
export const peerParam = (search: URLSearchParams = new URLSearchParams(location.search)) => search.get("peer");
