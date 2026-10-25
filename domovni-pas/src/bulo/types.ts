import type { IconName } from "./icons";

export type Role = "vlastnik" | "technik";
export type Tone = "ok" | "warn" | "bad" | "clay" | "info" | "muted" | "orange" | "gas" | "bim" | "neutral";

export interface Conn {
  name: string;
  detail: string;
  acc: string;
  icon: IconName;
  tone: Tone;
}

export interface Device {
  id: string;
  name: string;
  type: string;
  room: string;
  where: string;
  icon: IconName;
  tone: Tone;
  plan?: [number, number];
  num?: number;
  installed?: string;
  warranty?: string;
  serviceLast?: string;
  serviceNext?: string;
  connections?: Conn[];
  photo?: string;
  model?: string;
  serial?: string;
  power?: string;
}

export type SensorId = "teplota" | "kour" | "komin" | "voda" | "elektrina" | "plyn";

export interface DocFile {
  id: string;
  name: string;
  meta: string;
  kind: "pdf" | "img" | "ifc" | "dwg";
  src?: string;
  source: string;
  /** Soubor nahraný uživatelem (data v IndexedDB). */
  stored?: boolean;
  at?: number;
}

export interface DocCat {
  id: string;
  name: string;
  sub: string;
  icon: IconName;
  tone: Tone;
  chip: string;
  files: DocFile[];
}

export interface Drawing {
  id: string;
  name: string;
  sub: string;
  img: string;
  chip: string;
}

export interface HistoryItem {
  id: string;
  date: string;
  title: string;
  detail: string;
  who: string;
  icon: IconName;
  tone: Tone;
  /** Odkaz na zápis vytvořený v aplikaci. */
  record?: string;
}

export interface Deadline {
  id: string;
  title: string;
  sub: string;
  chip: string;
  tone: Tone;
  tag?: string;
  /** Datum termínu (ms) pro řazení; undefined = podle textu. */
  due?: number;
  isNew?: boolean;
}

export interface HouseInfo {
  id: string;
  name: string;
  place: string;
  kind: string;
  icon: IconName;
  color: string;
  code: string;
  hero?: string;
  /** Plný scénář (hlídače, AR, zakázky) má jen ukázková chata. */
  demo?: boolean;
  userMade?: boolean;
  createdAt?: number;
}

export interface FieldRow {
  k: string;
  v: string;
  note?: string;
}

export interface WorkRecord {
  id: string;
  at: number;
  kind: "unik" | "servis" | "vymena" | "obecny";
  title: string;
  deviceId?: string;
  houseId: string;
  who: string;
  sentence: string;
  fields: FieldRow[];
  photos: string[];
  docs: { id: string; name: string; meta: string }[];
  ai: "claude" | "mistni";
}

export interface Notif {
  id: string;
  at: number;
  title: string;
  body: string;
  /** Kam vede klepnutí. */
  go?: { name: string; params?: Record<string, unknown> }[];
  role: Role;
  read?: boolean;
}

export interface Job {
  id: "servis" | "unik";
  title: string;
  when: string;
  houseId: string;
  status: "open" | "done";
  doneAt?: number;
}

export interface ChatMsg {
  id: string;
  from: "me" | "ai";
  text: string;
  photo?: string;
  image?: string;
  actions?: ("close_valve" | "open_model" | "open_terminy" | "open_spotreba")[];
  pending?: boolean;
  source?: "claude" | "mistni";
}

export interface Boiler {
  model: string;
  power: string;
  serial: string;
  warranty: string;
  installed: string;
  serviceLast: string;
  serviceNext: string;
  flueCheck?: string;
}

// Předvyplněný zápis (průvodce otevře scénu ve stavu jako ve videu).
export interface ZapisPrefill {
  docs: { id: string; name: string; meta: string }[];
  sentence: string;
  draft: { title: string; fields: { k: string; v: string; note?: string }[]; source: "claude" | "mistni" };
}
