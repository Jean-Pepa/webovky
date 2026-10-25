"use client";

import { createContext, useContext, useEffect, useMemo, useReducer, useRef, type ReactNode } from "react";
import { BOILER_START, HOUSES } from "./data";
import type { Boiler, ChatMsg, DocFile, HouseInfo, Job, Notif, Role, WorkRecord } from "./types";
import { DAY, my, nextTerm, startOfDay } from "./time";

// ---------- Stav ----------
export interface LeakState {
  phase: "flow" | "closed" | "fixed";
  since: string;
  detectedAt: number;
  closedAt?: number;
  closedBy?: string;
  fixedAt?: number;
  photo?: string;
}

export interface AppState {
  v: 3;
  epoch: number;
  role: Role;
  houses: HouseInfo[];
  water: null | { pairedAt: number; place: string; x: number; y: number };
  leak: null | LeakState;
  boiler: Boiler;
  oldBoilers: (Boiler & { until: string })[];
  serviceDoneAt?: number;
  chimneyBooked?: { who: string; slot: string; at: number };
  records: WorkRecord[];
  notifs: Notif[];
  jobs: Job[];
  techIn: string[];
  chat: ChatMsg[];
  userDocs: { houseId: string; cat: string; file: DocFile }[];
  seen: Record<string, boolean>;
  /** Majitelovy notifikace čekající na zamčené obrazovce (když se přepne z technika). */
  lockQueue: string[];
}

const KEY = "bulo-app-v3";

export function initialState(now = Date.now()): AppState {
  return {
    v: 3,
    epoch: startOfDay(now),
    role: "vlastnik",
    houses: HOUSES,
    water: null,
    leak: null,
    boiler: { ...BOILER_START },
    oldBoilers: [],
    records: [],
    notifs: [],
    jobs: [{ id: "servis", title: "Servis kotle", when: "Dnes 10:00", houseId: "loucky", status: "open" }],
    techIn: [],
    chat: [],
    userDocs: [],
    seen: {},
    lockQueue: [],
  };
}

function load(): AppState {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const s = JSON.parse(raw) as AppState;
      if (s && s.v === 3) return s;
    }
  } catch {
    // poškozená data → začneme znovu
  }
  return initialState();
}

// ---------- Akce ----------
type Action =
  | { t: "role"; role: Role }
  | { t: "addHouse"; house: HouseInfo }
  | { t: "pairWater"; place: string; x: number; y: number }
  | { t: "startLeak"; now: number }
  | { t: "closeValve"; now: number; by: string }
  | { t: "leakPhoto"; photo: string }
  | { t: "chatAdd"; msg: ChatMsg }
  | { t: "chatPatch"; id: string; patch: Partial<ChatMsg> }
  | { t: "chatClear" }
  | { t: "techLogin"; houseId: string }
  | { t: "sign"; record: WorkRecord; now: number }
  | { t: "replaceBoiler"; boiler: Boiler; now: number; record: WorkRecord }
  | { t: "bookChimney"; who: string; slot: string; now: number }
  | { t: "addDoc"; houseId: string; cat: string; file: DocFile }
  | { t: "removeDoc"; id: string }
  | { t: "notify"; notif: Notif }
  | { t: "readNotif"; id: string }
  | { t: "readAll"; role: Role }
  | { t: "seen"; key: string }
  | { t: "lockShown" }
  | { t: "preset"; patch: Partial<AppState> }
  | { t: "reset"; now: number };

function uid(p = "id") {
  return `${p}-${Math.random().toString(36).slice(2, 9)}`;
}

function todayAt(now: number, h: number, m: number) {
  const d = new Date(now);
  d.setHours(h, m, 0, 0);
  return d.getTime();
}

function reducer(s: AppState, a: Action): AppState {
  switch (a.t) {
    case "role":
      return { ...s, role: a.role };
    case "addHouse":
      return { ...s, houses: [...s.houses, a.house] };
    case "pairWater":
      return { ...s, water: { pairedAt: Date.now(), place: a.place, x: a.x, y: a.y } };
    case "startLeak": {
      const water = s.water ?? { pairedAt: a.now, place: "Vodoměr, hlavní přívod", x: 250.9, y: 22.2 };
      const notif: Notif = {
        id: uid("n"),
        at: a.now,
        role: "vlastnik",
        title: "BULO · Chata Loučky",
        body: "Voda teče i v noci: 0,4 l/min od 2:10. Nikdo vodu nepouští. Klepněte pro detail.",
        go: [{ name: "domy" }, { name: "dum", params: { id: "loucky" } }, { name: "unik" }],
      };
      const jobs = s.jobs.filter((j) => j.id !== "unik");
      jobs.push({ id: "unik", title: "Únik vody", when: "Dnes 16:00", houseId: "loucky", status: "open" });
      return {
        ...s,
        water,
        leak: { phase: "flow", since: "2:10", detectedAt: a.now },
        jobs,
        notifs: [notif, ...s.notifs],
        chat: [],
      };
    }
    case "closeValve":
      if (!s.leak) return s;
      return { ...s, leak: { ...s.leak, phase: "closed", closedAt: a.now, closedBy: a.by } };
    case "leakPhoto":
      return s.leak ? { ...s, leak: { ...s.leak, photo: a.photo } } : s;
    case "chatAdd":
      return { ...s, chat: [...s.chat, a.msg] };
    case "chatPatch":
      return { ...s, chat: s.chat.map((m) => (m.id === a.id ? { ...m, ...a.patch } : m)) };
    case "chatClear":
      return { ...s, chat: [] };
    case "techLogin":
      return s.techIn.includes(a.houseId) ? s : { ...s, techIn: [...s.techIn, a.houseId] };
    case "sign": {
      const r = a.record;
      let next: AppState = { ...s, records: [r, ...s.records] };
      if (r.kind === "unik") {
        next = {
          ...next,
          leak: s.leak ? { ...s.leak, phase: "fixed", fixedAt: a.now } : null,
          jobs: s.jobs.map((j) => (j.id === "unik" ? { ...j, status: "done", doneAt: a.now } : j)),
        };
        next = withNotif(next, {
          id: uid("n"),
          at: a.now,
          role: "vlastnik",
          title: "Únik vody je opravený",
          body: "Instalatér zapsal opravu a přiložil protokol o tlakové zkoušce. Uzávěr je znovu otevřený.",
          go: [{ name: "domy" }, { name: "dum", params: { id: "loucky" } }, { name: "zaznam", params: { id: r.id } }],
        });
      } else if (r.kind === "servis") {
        const nextTermStr = r.fields.find((f) => f.k === "Další termín")?.v ?? nextTerm(a.now, 12);
        next = {
          ...next,
          serviceDoneAt: a.now,
          boiler: { ...s.boiler, serviceLast: my(a.now), serviceNext: nextTermStr },
          jobs: s.jobs.map((j) => (j.id === "servis" ? { ...j, status: "done", doneAt: a.now } : j)),
          seen: { ...s.seen, "termin-servis": false },
        };
        next = withNotif(next, {
          id: uid("n"),
          at: a.now,
          role: "vlastnik",
          title: "Servis kotle je hotový",
          body: `Technik zapsal servis a přiložil PDF. Další servis ${nextTermStr}.`,
          go: [{ name: "domy" }, { name: "dum", params: { id: "loucky" } }, { name: "terminy" }],
        });
      }
      return next;
    }
    case "replaceBoiler": {
      const old = { ...s.boiler, until: my(a.now) };
      return {
        ...s,
        oldBoilers: [old, ...s.oldBoilers],
        boiler: a.boiler,
        records: [a.record, ...s.records],
        seen: { ...s.seen, "termin-servis": false, "termin-spaliny": false },
      };
    }
    case "bookChimney":
      return { ...s, chimneyBooked: { who: a.who, slot: a.slot, at: a.now } };
    case "addDoc":
      return { ...s, userDocs: [{ houseId: a.houseId, cat: a.cat, file: a.file }, ...s.userDocs] };
    case "removeDoc":
      return { ...s, userDocs: s.userDocs.filter((d) => d.file.id !== a.id) };
    case "notify":
      return withNotif(s, a.notif);
    case "readNotif":
      return { ...s, notifs: s.notifs.map((n) => (n.id === a.id ? { ...n, read: true } : n)) };
    case "readAll":
      return { ...s, notifs: s.notifs.map((n) => (n.role === a.role ? { ...n, read: true } : n)) };
    case "seen":
      return s.seen[a.key] ? s : { ...s, seen: { ...s.seen, [a.key]: true } };
    case "lockShown":
      return { ...s, lockQueue: [] };
    case "preset":
      return { ...s, ...a.patch };
    case "reset":
      return initialState(a.now);
  }
}

function withNotif(s: AppState, n: Notif): AppState {
  const queue = s.role !== n.role ? [...s.lockQueue, n.id] : s.lockQueue;
  return { ...s, notifs: [n, ...s.notifs], lockQueue: queue };
}

// ---------- Kontext ----------
export interface Store {
  s: AppState;
  dispatch: (a: Action) => void;
  /** Čas „teď“ (ms). */
  now: () => number;
}

const Ctx = createContext<Store | null>(null);

/** Kód domu z QR (např. LOU-0127) přihlásí technika k domu. */
export function houseByCode(houses: HouseInfo[], code?: string | null) {
  if (!code) return null;
  const c = code.trim().toUpperCase();
  return houses.find((h) => h.code === c) ?? null;
}

function loadWithCode(code?: string): AppState {
  const s = load();
  const h = houseByCode(s.houses, code);
  if (!h) return s;
  return { ...s, role: "technik", techIn: s.techIn.includes(h.id) ? s.techIn : [...s.techIn, h.id] };
}

export function StoreProvider({ children, code }: { children: ReactNode; code?: string }) {
  const [s, dispatch] = useReducer(reducer, code, loadWithCode);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    try {
      localStorage.setItem(KEY, JSON.stringify(s));
    } catch {
      // úložiště plné nebo zakázané — appka běží dál jen v paměti
    }
  }, [s]);
  const value = useMemo<Store>(() => ({ s, dispatch, now: () => Date.now() }), [s]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore(): Store {
  const v = useContext(Ctx);
  if (!v) throw new Error("useStore mimo StoreProvider");
  return v;
}

// ---------- Odvozené hodnoty ----------
export function chimneyDue(s: AppState) {
  return s.epoch + 12 * DAY;
}

export function sensorCount(s: AppState) {
  return 5 + (s.water ? 1 : 0);
}

export interface HouseStatus {
  tone: "ok" | "warn" | "bad";
  title: string;
  sub: string;
}

export function houseStatus(s: AppState, now: number): HouseStatus {
  if (s.leak?.phase === "flow") return { tone: "bad", title: "Možný únik vody", sub: `Hlídač hlásí průtok ${"0,4 l/min"} od ${s.leak.since}` };
  if (s.leak?.phase === "closed") return { tone: "warn", title: "Uzávěr vody zavřen", sub: "Čeká na opravu · instalatér přijde dnes" };
  const near = upcoming(s, now).length;
  if (near === 0) return { tone: "ok", title: "Vše v pořádku", sub: "Termíny máte pod kontrolou" };
  return { tone: "ok", title: "Vše v pořádku", sub: near === 1 ? "Jeden termín se blíží" : `${near} termíny se blíží` };
}

/** Termíny do 30 dní, které čekají na majitele (neobjednané). */
export function upcoming(s: AppState, now: number) {
  const out: string[] = [];
  const due = chimneyDue(s);
  if (!s.chimneyBooked && due - now < 30 * DAY) out.push("komin");
  if (s.boiler.flueCheck) out.push("spaliny");
  return out;
}

export { uid, todayAt };
export type { Action };
