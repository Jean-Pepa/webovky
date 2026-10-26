"use client";

import type { AppState } from "./store";
import { chimneyDue, sensorCount } from "./store";
import type { Boiler, FieldRow } from "./types";
import { DEVICES, DOCS, HISTORY } from "./data";
import { localAnswer, localBoilerFromDoc, localDraft, type Answer } from "./local-ai";
import { toDataUrl } from "./media";
import { dmy, hm, my } from "./time";

// Kontext pasu domu pro Clauda (stručně, jen fakta).
export function aiContext(s: AppState, now: number) {
  return {
    dum: { nazev: "Chata Loučky", misto: "Bítov", kod: "LOU-0127", dnes: dmy(now) },
    kotel: { ...s.boiler, misto: "Technická místnost, z chodby 2. dveře vlevo", predchozi: s.oldBoilers.map((b) => `${b.model} ${b.installed}–${b.until}`) },
    zarizeni: DEVICES.filter((d) => d.id !== "kotel").map((d) => ({ nazev: d.name, typ: d.type, mistnost: d.room, kde: d.where })),
    rozvody: [
      { trasa: "Voda", popis: "přívod od vodoměru ke koupelně, kuchyni a kotli; koleno za vodoměrem 70 cm nad podlahou, ve zdi 4 cm", presnost: "±2 cm" },
      { trasa: "Plyn", popis: "ve zdi od kotle k rohu, 85 cm nad podlahou; z přípojky přímo ke kotli", presnost: "±2 cm" },
      { trasa: "Elektro F7", popis: "ze stropu svisle k zásuvce vlevo od kotle", presnost: "±1 cm" },
      { trasa: "Topení", popis: "z kotle v podlaze ke koupelně a k radiátorům", presnost: "±2 cm" },
      { pravidlo: "Nevrtat v pásu ±5 cm kolem tras." },
    ],
    hlidace: {
      pocet: sensorCount(s),
      voda: s.water
        ? s.leak?.phase === "flow"
          ? `průtok 0,4 l/min od ${s.leak.since}, nikdo vodu nepouští`
          : s.leak?.phase === "closed"
            ? `hlásil 0,4 l/min od ${s.leak.since}; uzávěr zavřel majitel v ${hm(s.leak.closedAt ?? now)}, teď 0,0 l/min`
            : "0,0 l/min, v pořádku"
        : "není připojen",
      uzaver_vody: s.leak?.phase === "closed" ? "zavřen" : "otevřen",
      teplota: "21,5 °C",
      kour: "bez alarmu",
      komin: "usazeniny 64 %, vyčistit do 30 dní",
      elektrina: "1,2 kW",
      plyn: "0,3 m³/h, kotel topí",
    },
    spotreba_mesic: { elektrina: "312 kWh (−6 % meziročně)", voda: "4,1 m³ (+2 %)", plyn: "96 m³ (+18 % při stejném počasí)" },
    terminy: [
      { nazev: "Kontrola komína", kdy: dmy(chimneyDue(s)), povinne: "1× ročně, vyhl. 34/2016 Sb.", minule: "10/2025", objednano: s.chimneyBooked ? `${s.chimneyBooked.who} ${s.chimneyBooked.slot}` : null },
      { nazev: "Servis kotle", kdy: s.boiler.serviceNext },
      { nazev: "Kontrola plynu", kdy: "3/2027" },
      { nazev: "Revize elektro", kdy: "6/2027" },
    ],
    historie: [
      ...s.records.map((r) => ({ datum: dmy(r.at), co: r.title, kdo: r.who })),
      ...HISTORY.slice(0, 14).map((h) => ({ datum: h.date, co: `${h.title} – ${h.detail}`, kdo: h.who })),
    ],
    dokumenty: DOCS.map((d) => ({ nazev: d.name, stav: d.chip, popis: d.sub })),
  };
}

let enabled: Promise<boolean> | null = null;
function aiEnabled() {
  enabled ??= fetch("/api/bulo/ai")
    .then((r) => (r.ok ? (r.json() as Promise<{ enabled?: boolean }>) : { enabled: false }))
    .then((j) => !!j.enabled)
    .catch(() => false);
  return enabled;
}

async function post<T>(payload: Record<string, unknown>): Promise<T | null> {
  if (!(await aiEnabled())) return null;
  try {
    const res = await fetch("/api/bulo/ai", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export interface AskResult extends Answer {
  source: "claude" | "mistni";
}

export async function askHouse(question: string, photo: string | undefined, s: AppState, now = Date.now()): Promise<AskResult> {
  const local = localAnswer(question, !!photo, s, now);
  if (!(await aiEnabled())) return { ...local, source: "mistni" };
  const photoData = photo ? await toDataUrl(photo) : null;
  const r = await post<{ paragraphs: string[]; actions: Answer["actions"]; showOverlay: boolean }>({
    task: "ask",
    question,
    photo: photoData,
    context: aiContext(s, now),
  });
  if (!r || !Array.isArray(r.paragraphs) || !r.paragraphs.length) return { ...local, source: "mistni" };
  const actions = (r.actions ?? []).filter((a) => a !== "close_valve" || (s.leak?.phase === "flow"));
  return {
    paragraphs: r.paragraphs,
    actions,
    image: r.showOverlay && photo ? local.image ?? "/aplikace/img/ph_stain_ar.jpg" : r.showOverlay ? local.image : undefined,
    source: "claude",
  };
}

export interface DraftResult {
  title: string;
  fields: FieldRow[];
  source: "claude" | "mistni";
}

export async function draftRecord(
  kind: "unik" | "servis" | "obecny",
  sentence: string,
  docs: { name: string; src?: string }[],
  photos: string[],
  s: AppState,
  now: number,
  deviceName?: string,
): Promise<DraftResult> {
  const local = localDraft(kind, sentence, docs.map((d) => d.name), now, deviceName);
  if (!(await aiEnabled())) return { ...local, source: "mistni" };
  const docData = (await Promise.all(docs.filter((d) => d.src && d.src.startsWith("idb:")).map((d) => toDataUrl(d.src as string, 1600)))).filter(Boolean);
  const photoData = (await Promise.all(photos.slice(0, 2).map((p) => toDataUrl(p, 900)))).filter(Boolean);
  const r = await post<{ title: string; fields: FieldRow[] }>({
    task: "zapis",
    kind,
    sentence,
    docNames: docs.map((d) => d.name),
    docs: docData,
    photos: photoData,
    today: my(now),
    context: aiContext(s, now),
  });
  if (!r || !Array.isArray(r.fields) || !r.fields.length) return { ...local, source: "mistni" };
  return { title: r.title || local.title, fields: r.fields.map((f) => ({ k: f.k, v: f.v, note: f.note || undefined })), source: "claude" };
}

export interface BoilerResult {
  boiler: Boiler;
  source: "claude" | "mistni";
}

export async function readBoilerDoc(src: string | undefined, s: AppState, now: number): Promise<BoilerResult> {
  const local = localBoilerFromDoc(now);
  if (!src || !src.startsWith("idb:") || !(await aiEnabled())) return { boiler: local, source: "mistni" };
  const data = await toDataUrl(src, 1600);
  const r = await post<Partial<Boiler> & { found?: boolean }>({ task: "kotel", docs: [data], current: s.boiler, today: my(now) });
  if (!r || !r.found || !r.model || r.model === "—") return { boiler: local, source: "mistni" };
  return {
    boiler: {
      model: r.model,
      power: r.power && r.power !== "—" ? r.power : local.power,
      serial: r.serial && r.serial !== "—" ? r.serial : "—",
      warranty: r.warranty && r.warranty !== "—" ? r.warranty : local.warranty,
      installed: r.installed && r.installed !== "—" ? r.installed : local.installed,
      serviceLast: local.serviceLast,
      serviceNext: local.serviceNext,
      flueCheck: r.flueCheck && r.flueCheck !== "—" ? r.flueCheck : "do 30 dní",
    },
    source: "claude",
  };
}
