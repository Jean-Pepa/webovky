"use client";

import type { AppState, Action } from "./store";
import { initialState, todayAt, uid } from "./store";
import type { Entry, NavApi, Route } from "./nav";
import type { WorkRecord, ZapisPrefill } from "./types";
import { localAnswer, localBoilerFromDoc, localDraft } from "./local-ai";
import { BOILER_START, DEMO_DOC, DEMO_SENTENCE, IMG } from "./data";

// Kroky průvodce = scény z videa „BULO – ukázka aplikace“.
export interface Step {
  id: string;
  ch: string;
  title: string;
  caption: string;
  sub: string;
  run: (s: AppState, dispatch: (a: Action) => void, nav: NavApi) => void;
}

export const CHAPTERS: { id: string; name: string; title: string; text: string }[] = [
  { id: "1", name: "Vlastník", title: "Celý dům na jednom místě.", text: "Výkresy, dokumenty, 3D model, spotřeba i čidla. Data vkládají firmy, které se o dům starají." },
  { id: "2", name: "Únik vody", title: "Když se něco stane.", text: "Hlídač vody hlásí průtok i v noci. Ráno je na zdi skvrna. Stačí se zeptat: BULO ví, co vede za zdí." },
  { id: "3", name: "Instalatér", title: "Instalatér na místě.", text: "Hlídače jsou pro vlastníka. Na opravu přijede technik, i ten, který tu nikdy nebyl: naskenuje kód domu u vchodu a v AR vidí, co je ve zdi." },
  { id: "4", name: "Servis a výměna", title: "Servis a výměna.", text: "Pravidelný servis kotle: ikona v AR přímo na kotli, zápis s revizní zprávou a další termín sám. Nový kotel? Data přepíše krátký dokument." },
  { id: "5", name: "Připravujeme", title: "Co přijde dál.", text: "Plán obnovy, nabídky techniků a agent projektu." },
];

const owner = (dispatch: (a: Action) => void) => dispatch({ t: "role", role: "vlastnik" });
const tech = (dispatch: (a: Action) => void) => dispatch({ t: "role", role: "technik" });
const go = (nav: NavApi, routes: Route[]) => nav.reset(routes, "fade");

function leakPatch(s: AppState, phase: "flow" | "closed"): Partial<AppState> {
  const now = Date.now();
  const closedAt = todayAt(now, 7, 14) < now ? todayAt(now, 7, 14) : now;
  const jobs = s.jobs.filter((j) => j.id !== "unik");
  jobs.push({ id: "unik", title: "Únik vody", when: "Dnes 16:00", houseId: "loucky", status: "open" });
  return {
    water: s.water ?? { pairedAt: now, place: "Vodoměr, hlavní přívod", x: 250.9, y: 22.2 },
    leak: { phase, since: "2:10", detectedAt: s.leak?.detectedAt ?? now, closedAt: phase === "closed" ? s.leak?.closedAt ?? closedAt : undefined, closedBy: phase === "closed" ? "majitel" : undefined, photo: s.leak?.photo ?? IMG("img/ph_stain.jpg") },
    jobs,
    records: s.records.filter((r) => r.kind !== "unik"),
  };
}

function demoRecord(kind: "unik" | "servis", now: number): WorkRecord {
  const doc = DEMO_DOC[kind];
  const d = localDraft(kind, DEMO_SENTENCE[kind], [doc.name], now);
  return {
    id: uid("r"),
    at: now,
    kind,
    title: d.title,
    deviceId: kind === "unik" ? "uzaver" : "kotel",
    houseId: "loucky",
    who: kind === "unik" ? "Instalatérství Novák" : "Topení Bítov · P. Novák",
    sentence: DEMO_SENTENCE[kind],
    fields: d.fields,
    photos: kind === "unik" ? [IMG("img/ph_s1.jpg"), IMG("img/ph_s2.jpg")] : [IMG("img/ph1.jpg"), IMG("img/ph2.jpg")],
    docs: [{ id: uid("d"), ...doc }],
    ai: "mistni",
  };
}

// Nový zápis vyplněný jako na konci scény: fotky, dokument, věta a návrh od AI.
function zapisPrefill(kind: "unik" | "servis", now: number): ZapisPrefill {
  const doc = DEMO_DOC[kind];
  const d = localDraft(kind, DEMO_SENTENCE[kind], [doc.name], now, kind === "servis" ? "Kotel" : undefined);
  return { docs: [{ id: uid("d"), ...doc }], sentence: DEMO_SENTENCE[kind], draft: { title: d.title, fields: d.fields, source: "mistni" } };
}

const ownerHouse: Route[] = [{ name: "domy" }, { name: "dum", params: { id: "loucky" } }];

export const STEPS: Step[] = [
  // ----- 1 Vlastník
  { id: "domy", ch: "1", title: "Nemovitosti", caption: "Všechny domy na jednom místě.", sub: "Pro vlastníky: SVJ, spolky, lidi i firmy.", run: (_s, d, n) => (owner(d), go(n, [{ name: "domy" }])) },
  { id: "dum", ch: "1", title: "Pas domu", caption: "Domovská stránka domu.", sub: "Stav, termíny, hlídače a zařízení na první pohled.", run: (_s, d, n) => (owner(d), go(n, ownerHouse)) },
  { id: "dokumenty", ch: "1", title: "Výkresy a dokumenty", caption: "Výkresy a dokumenty.", sub: "Půdorysy, řezy, BIM, povolení, požárně bezpečnostní řešení.", run: (_s, d, n) => (owner(d), go(n, [{ name: "domy" }, { name: "dokumenty", params: { id: "loucky" } }])) },
  { id: "model", ch: "1", title: "Model domu", caption: "Všechny rozvody na jednom místě.", sub: "Z výkresů v ArchiCADu a záběrů ze stavby. Každá trasa má zdroj a přesnost.", run: (_s, d, n) => (owner(d), go(n, [...ownerHouse, { name: "model", params: { id: "loucky" } }])) },
  { id: "spotreba", ch: "1", title: "Spotřeba", caption: "Elektřina, voda a plyn.", sub: "AI pozná, co je neobvyklé: plyn o 18 % víc než loni při stejném počasí.", run: (_s, d, n) => (owner(d), go(n, [...ownerHouse, { name: "spotreba", params: { id: "loucky" } }])) },
  {
    id: "parovani",
    ch: "1",
    title: "Nový hlídač",
    caption: "Čidlo se samo zařadí do domu.",
    sub: "Telefon ho najde a model domu ví, že je u vodoměru.",
    run: (s, d, n) => {
      owner(d);
      d({ t: "preset", patch: { water: null, leak: s.leak?.phase === "fixed" ? s.leak : null } });
      go(n, [...ownerHouse, { name: "hlidace", params: { id: "loucky" } }, { name: "parovani" }]);
    },
  },
  {
    id: "hlidace",
    ch: "1",
    title: "Hlídače",
    caption: "Dům hlídá sám.",
    sub: "Teplo, kouř, usazeniny v komíně, průtok vody, elektřiny a plynu.",
    run: (s, d, n) => {
      owner(d);
      if (!s.water) d({ t: "pairWater", place: "Vodoměr, hlavní přívod", x: 250.9, y: 22.2 });
      go(n, [...ownerHouse, { name: "hlidace", params: { id: "loucky" } }]);
    },
  },
  // ----- 2 Únik vody
  {
    id: "noc",
    ch: "2",
    title: "Noční hlášení",
    caption: "Hlídač vody hlásí průtok, i když všichni spí.",
    sub: "Notifikace přijde i v noci: voda teče 0,4 l/min od 2:10 a nikdo ji nepouští.",
    run: (_s, d, n) => {
      owner(d);
      go(n, ownerHouse);
      setTimeout(() => d({ t: "startLeak", now: Date.now() }), 500);
    },
  },
  {
    id: "fotka",
    ch: "2",
    title: "Fotka a otázka",
    caption: "Vyfotí skvrnu a zeptá se domu.",
    sub: "Ráno je na zdi u vodoměru mokrá skvrna. Stačí vyfotit, co vidíte.",
    run: (s, d, n) => {
      owner(d);
      d({ t: "preset", patch: { ...leakPatch(s, "flow"), chat: [] } });
      go(n, [...ownerHouse, { name: "kamera", params: { mode: "ask", house: "loucky", __modal: true } }]);
    },
  },
  {
    id: "zeptat",
    ch: "2",
    title: "Ví, odkud to teče",
    caption: "Ví, odkud to teče.",
    sub: "Rozvody z modelu, data z hlídače a historie domu na jednom místě.",
    run: (s, d, n) => {
      owner(d);
      const patch = leakPatch(s, "flow");
      const st = { ...s, ...patch } as AppState;
      const a = localAnswer("Na zdi u vodoměru je mokrá skvrna. Co to je?", true, st, Date.now());
      d({
        t: "preset",
        patch: {
          ...patch,
          chat: [
            { id: uid("m"), from: "me", text: "Na zdi u vodoměru je mokrá skvrna. Co to je?", photo: IMG("img/ph_stain.jpg") },
            { id: uid("m"), from: "ai", text: a.paragraphs.join("\n\n"), image: a.image, actions: a.actions, source: "mistni" },
          ],
        },
      });
      go(n, [...ownerHouse, { name: "zeptat", params: { house: "loucky" } }]);
    },
  },
  {
    id: "uzaver",
    ch: "2",
    title: "Uzávěr zavřen",
    caption: "Uzávěr zavřen.",
    sub: "Jedním klepnutím. Voda přestala téct.",
    run: (s, d, n) => {
      owner(d);
      const st = { ...s, ...leakPatch(s, "flow") } as AppState;
      const a = localAnswer("Na zdi u vodoměru je mokrá skvrna. Co to je?", true, st, Date.now());
      d({
        t: "preset",
        patch: {
          ...leakPatch(s, "closed"),
          leak: { ...leakPatch(s, "closed").leak!, closedAt: Date.now() },
          chat: [
            { id: uid("m"), from: "me", text: "Na zdi u vodoměru je mokrá skvrna. Co to je?", photo: IMG("img/ph_stain.jpg") },
            { id: uid("m"), from: "ai", text: a.paragraphs.join("\n\n"), image: a.image, actions: ["close_valve"], source: "mistni" },
          ],
        },
      });
      go(n, [...ownerHouse, { name: "zeptat", params: { house: "loucky" } }]);
    },
  },
  // ----- 3 Instalatér
  {
    id: "zakazka",
    ch: "3",
    title: "Zakázka",
    caption: "Ví, kam jde a proč.",
    sub: "Fotka od majitele, místo a data z hlídače.",
    run: (s, d, n) => {
      tech(d);
      d({ t: "preset", patch: { ...leakPatch(s, "closed"), techIn: s.techIn.filter((h) => h !== "loucky") } });
      go(n, [{ name: "zakazky" }, { name: "zakazka", params: { job: "unik" } }]);
    },
  },
  {
    id: "kod",
    ch: "3",
    title: "Kód domu",
    caption: "Přihlásí se k domu.",
    sub: "Kód domu je na zdi u vchodu. Jeden kód na celý dům.",
    run: (s, d, n) => {
      tech(d);
      d({ t: "preset", patch: { ...leakPatch(s, "closed"), techIn: s.techIn.filter((h) => h !== "loucky") } });
      go(n, [{ name: "zakazky" }, { name: "zakazka", params: { job: "unik" } }, { name: "skener", params: { job: "unik" } }]);
    },
  },
  {
    id: "vodomer",
    ch: "3",
    title: "Vodoměr na mapě",
    caption: "Vodoměr na mapě.",
    sub: "Uzávěr zavřel majitel v 7:14.",
    run: (s, d, n) => {
      tech(d);
      d({ t: "preset", patch: { ...leakPatch(s, "closed"), techIn: [...new Set([...s.techIn, "loucky"])] } });
      go(n, [{ name: "zakazky" }, { name: "zakazka", params: { job: "unik" } }, { name: "zarizeni-dum", params: { job: "unik" } }]);
    },
  },
  {
    id: "ar-unik",
    ch: "3",
    title: "Místo úniku v AR",
    caption: "Ukáže místo úniku.",
    sub: "Koleno za vodoměrem, 70 cm nad podlahou.",
    run: (s, d, n) => {
      tech(d);
      d({ t: "preset", patch: { ...leakPatch(s, "closed"), techIn: [...new Set([...s.techIn, "loucky"])] } });
      go(n, [{ name: "zakazky" }, { name: "zakazka", params: { job: "unik" } }, { name: "zarizeni-dum", params: { job: "unik" } }, { name: "ar", params: { mode: "unik", job: "unik" } }]);
    },
  },
  {
    id: "ar-voda",
    ch: "3",
    title: "Kudy vede voda",
    caption: "Kudy vede voda.",
    sub: "Změřeno při stavbě ±2 cm. Zeď otevře jen tam, kde je třeba.",
    run: (s, d, n) => {
      tech(d);
      d({ t: "preset", patch: { ...leakPatch(s, "closed"), techIn: [...new Set([...s.techIn, "loucky"])] } });
      go(n, [{ name: "zakazky" }, { name: "zakazka", params: { job: "unik" } }, { name: "zarizeni-dum", params: { job: "unik" } }, { name: "ar", params: { mode: "unik", job: "unik", stage: "routes" } }]);
    },
  },
  {
    id: "zapis-unik",
    ch: "3",
    title: "Zápis opravy",
    caption: "Protokol a jedna věta.",
    sub: "Fotka po opravě, protokol o tlakové zkoušce a jedna věta. AI připraví zápis, instalatér jen podepíše.",
    run: (s, d, n) => {
      tech(d);
      d({ t: "preset", patch: { ...leakPatch(s, "closed"), techIn: [...new Set([...s.techIn, "loucky"])] } });
      go(n, [{ name: "zakazky" }, { name: "zakazka", params: { job: "unik" } }, { name: "zarizeni-dum", params: { job: "unik" } }, { name: "ar", params: { mode: "unik", job: "unik" } }, { name: "zapis", params: { kind: "unik", job: "unik", house: "loucky", photos: [IMG("img/ph_s1.jpg"), IMG("img/ph_s2.jpg")], prefill: zapisPrefill("unik", Date.now()) } }]);
    },
  },
  {
    id: "ulozeno-unik",
    ch: "3",
    title: "V pasu domu",
    caption: "V pasu domu.",
    sub: "Majitel má zprávu a dům ví, kde se opravovalo.",
    run: (s, d, n) => {
      tech(d);
      d({ t: "preset", patch: { ...leakPatch(s, "closed"), techIn: [...new Set([...s.techIn, "loucky"])] } });
      const now = Date.now();
      const rec = demoRecord("unik", now);
      d({ t: "sign", record: rec, now });
      go(n, [{ name: "zakazky" }, { name: "ulozeno", params: { id: rec.id } }]);
    },
  },
  // ----- 4 Servis a výměna
  {
    id: "ar-kotel",
    ch: "4",
    title: "Ikona na kotli",
    caption: "Ikona přesně na kotli.",
    sub: "Namiřte telefon a klepněte na ikonu. Vše o kotli hned na místě: servis, záruka, instalace a minulé zásahy.",
    run: (s, d, n) => {
      tech(d);
      d({
        t: "preset",
        patch: {
          serviceDoneAt: undefined,
          boiler: s.oldBoilers.length ? s.boiler : { ...BOILER_START },
          jobs: s.jobs.map((j) => (j.id === "servis" ? { ...j, status: "open", doneAt: undefined } : j)),
          records: s.records.filter((r) => r.kind !== "servis"),
          techIn: [...new Set([...s.techIn, "loucky"])],
        },
      });
      go(n, [{ name: "zakazky" }, { name: "zakazka", params: { job: "servis" } }, { name: "zarizeni-dum", params: { job: "servis" } }, { name: "ar", params: { mode: "kotel", job: "servis" } }]);
    },
  },
  {
    id: "vezdi",
    ch: "4",
    title: "Kde nevrtat",
    caption: "Kde nevrtat.",
    sub: "Plyn a elektro u kotle, pás ±5 cm je označený.",
    run: (s, d, n) => {
      tech(d);
      d({ t: "preset", patch: { techIn: [...new Set([...s.techIn, "loucky"])] } });
      go(n, [{ name: "zakazky" }, { name: "zakazka", params: { job: "servis" } }, { name: "zarizeni-dum", params: { job: "servis" } }, { name: "ar", params: { mode: "kotel", job: "servis", stage: "card" } }, { name: "vezdi", params: { dev: "kotel", from: "ar", job: "servis" } }]);
    },
  },
  {
    id: "zapis-servis",
    ch: "4",
    title: "Zápis servisu",
    caption: "Jedna věta stačí.",
    sub: "Fotka štítku, revizní zpráva jako PDF a jedna věta. AI připraví zápis, technik jen podepíše.",
    run: (s, d, n) => {
      tech(d);
      d({ t: "preset", patch: { serviceDoneAt: undefined, boiler: s.oldBoilers.length ? s.boiler : { ...BOILER_START }, jobs: s.jobs.map((j) => (j.id === "servis" ? { ...j, status: "open", doneAt: undefined } : j)), records: s.records.filter((r) => r.kind !== "servis"), techIn: [...new Set([...s.techIn, "loucky"])] } });
      go(n, [{ name: "zakazky" }, { name: "zakazka", params: { job: "servis" } }, { name: "zarizeni-dum", params: { job: "servis" } }, { name: "ar", params: { mode: "kotel", job: "servis" } }, { name: "zapis", params: { kind: "servis", job: "servis", dev: "kotel", house: "loucky", photos: [IMG("img/ph1.jpg"), IMG("img/ph2.jpg")], prefill: zapisPrefill("servis", Date.now()) } }]);
    },
  },
  {
    id: "zprava",
    ch: "4",
    title: "Zpráva majiteli",
    caption: "Zprávu má hned.",
    sub: "Další servis je v termínech sám.",
    run: (s, d, n) => {
      tech(d);
      const now = Date.now();
      const rec = demoRecord("servis", now);
      d({ t: "preset", patch: { records: s.records.filter((r) => r.kind !== "servis"), serviceDoneAt: undefined, boiler: s.oldBoilers.length ? s.boiler : { ...BOILER_START }, lockQueue: [] } });
      d({ t: "sign", record: rec, now });
      owner(d);
      go(n, [{ name: "domy" }, { name: "zamek" }]);
    },
  },
  {
    id: "vymena",
    ch: "4",
    title: "Nový kotel",
    caption: "Stačí krátký dokument.",
    sub: "Protokol od instalatéra nebo fotka štítku.",
    run: (s, d, n) => {
      owner(d);
      if (s.oldBoilers.length) d({ t: "preset", patch: { boiler: { ...BOILER_START }, oldBoilers: [], records: s.records.filter((r) => r.kind !== "vymena") } });
      go(n, [{ name: "domy" }, { name: "zarizeni", params: { id: "loucky" } }, { name: "zarizeni-detail", params: { id: "loucky", dev: "kotel" } }, { name: "vymena", params: { id: "loucky" } }]);
    },
  },
  {
    id: "zmeny",
    ch: "4",
    title: "Data se přepíšou sama",
    caption: "Data se přepíšou sama.",
    sub: "AI ukáže, co se změní. Vy jen potvrdíte. Starý kotel zůstane v historii.",
    run: (s, d, n) => {
      owner(d);
      if (s.oldBoilers.length) d({ t: "preset", patch: { boiler: { ...BOILER_START }, oldBoilers: [], records: s.records.filter((r) => r.kind !== "vymena") } });
      go(n, [
        { name: "domy" },
        { name: "zarizeni", params: { id: "loucky" } },
        { name: "zarizeni-detail", params: { id: "loucky", dev: "kotel" } },
        { name: "vymena", params: { id: "loucky" } },
        { name: "vymena-zmeny", params: { boiler: localBoilerFromDoc(Date.now()), source: "mistni", doc: "Protokol o instalaci kotle" } },
      ]);
    },
  },
  // ----- 5 Připravujeme
  { id: "obnova", ch: "5", title: "Plán obnovy", caption: "Co a kdy opravit.", sub: "AI plánuje podle stáří, revizí a spotřeby.", run: (_s, d, n) => (owner(d), go(n, [...ownerHouse, { name: "obnova", params: { id: "loucky" } }])) },
  { id: "nabidky", ch: "5", title: "Nabídky techniků", caption: "Technici se nabídnou sami.", sub: "Vidí termín kontroly a vybraný má přístup jen k ní.", run: (_s, d, n) => (owner(d), go(n, [{ name: "domy" }, { name: "terminy", params: { id: "loucky" } }, { name: "nabidky", params: { id: "loucky" } }])) },
  { id: "agent", ch: "5", title: "Agent projektu", caption: "Vše na jednom místě.", sub: "Hlídá celý projekt: třídí podklady od všech profesí, připomíná a hlídá termíny.", run: (_s, d, n) => (owner(d), go(n, [...ownerHouse, { name: "agent", params: { id: "loucky" } }])) },
];

/** Který krok odpovídá právě otevřené obrazovce (pro popisek v průvodci). */
export function stepFor(top: Entry, s: AppState): Step | null {
  const p = top.params ?? {};
  const by = (id: string) => STEPS.find((x) => x.id === id) ?? null;
  switch (top.name) {
    case "domy":
      return by("domy");
    case "dum":
      return s.leak?.phase === "flow" ? by("noc") : by("dum");
    case "dokumenty":
    case "kategorie":
    case "vykresy":
    case "vykres":
    case "soubor":
      return by("dokumenty");
    case "model":
      return by("model");
    case "spotreba":
      return by("spotreba");
    case "parovani":
      return by("parovani");
    case "hlidace":
      return by("hlidace");
    case "unik":
      return by("noc");
    case "kamera":
      return p.mode === "ask" ? by("fotka") : p.mode === "unik" ? by("zapis-unik") : p.mode === "servis" ? by("zapis-servis") : p.mode === "stitek" ? by("vymena") : null;
    case "zeptat":
      return s.leak?.phase === "closed" ? by("uzaver") : by("zeptat");
    case "zakazky":
    case "zakazka":
      return p.job === "servis" ? by("ar-kotel") : by("zakazka");
    case "skener":
      return by("kod");
    case "zarizeni-dum":
      return p.job === "servis" ? by("ar-kotel") : by("vodomer");
    case "ar":
      return p.mode === "unik" ? (p.stage === "routes" ? by("ar-voda") : by("ar-unik")) : by("ar-kotel");
    case "vezdi":
      return by("vezdi");
    case "zapis":
      return p.kind === "unik" ? by("zapis-unik") : p.kind === "servis" ? by("zapis-servis") : null;
    case "ulozeno": {
      const r = s.records.find((x) => x.id === p.id);
      return r?.kind === "servis" ? by("zprava") : by("ulozeno-unik");
    }
    case "zamek":
    case "terminy":
      return s.serviceDoneAt ? by("zprava") : null;
    case "vymena":
      return by("vymena");
    case "vymena-zmeny":
    case "vymena-hotovo":
      return by("zmeny");
    case "obnova":
      return by("obnova");
    case "nabidky":
      return by("nabidky");
    case "agent":
      return by("agent");
  }
  return null;
}

export function resetDemo(dispatch: (a: Action) => void) {
  const fresh = initialState(Date.now());
  dispatch({ t: "preset", patch: fresh });
}
