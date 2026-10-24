// „Zeptej se knihy" — kontext pro AI z dat domu a záložní hledání bez AI (ukázkový režim).

import type { Property } from "@/lib/store";
import { ELEMENT_CATEGORIES, ELEMENT_CONDITIONS, accuracyLabel } from "@/lib/elements";
import { DOCUMENT_CATEGORIES, ENTRY_TYPES, REMINDER_TYPES } from "@/lib/enums";
import { INSPECTION_RESULTS } from "@/lib/submission";
import { localIsoDate } from "@/lib/deadlines";

export type BookContext = {
  today: string;
  focusElementId?: string;
  property: Record<string, string | number | undefined>;
  elements: Record<string, string | undefined>[];
  entries: Record<string, string | number | undefined>[];
  documents: Record<string, string | undefined>[];
  reminders: Record<string, string | number | boolean | undefined>[];
  inventory: Record<string, string | number | undefined>[];
};

export type BookAnswer = { answer: string; elementIds: string[] };

const cut = (s: string | undefined, max: number) =>
  s && s.length > max ? `${s.slice(0, max - 1)}…` : s || undefined;

// Data domu bez příloh (data URL) a bez citlivých klíčů — jen to, z čeho se dá odpovídat.
export function bookContext(property: Property, focusElementId?: string): BookContext {
  const elements = property.elements ?? [];
  const names = (ids?: string[]) => {
    const list = (ids ?? []).map((id) => elements.find((e) => e.id === id)?.name).filter(Boolean);
    return list.length ? list.join(", ") : undefined;
  };
  const name = (id?: string) => (id ? elements.find((e) => e.id === id)?.name : undefined);

  return {
    today: localIsoDate(),
    focusElementId: focusElementId && elements.some((e) => e.id === focusElementId) ? focusElementId : undefined,
    property: {
      name: property.name,
      city: property.city,
      yearBuilt: property.yearBuilt,
      floorArea: property.floorArea,
      constructionSystem: property.constructionSystem,
      materials: cut(property.materials, 300),
      description: cut(property.description, 500),
    },
    elements: elements.slice(0, 300).map((e) => ({
      id: e.id,
      name: e.name,
      category: ELEMENT_CATEGORIES[e.category],
      kind: e.kind,
      room: e.room,
      location: cut(e.location, 300),
      accuracy: accuracyLabel(e),
      condition: ELEMENT_CONDITIONS[e.condition],
      installDate: e.installDate ? `${e.installDate}${e.installDateEstimated ? " (odhad)" : ""}` : undefined,
      note: cut(e.note, 300),
    })),
    entries: [...property.entries]
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 150)
      .map((e) => ({
        date: e.date,
        type: ENTRY_TYPES[e.type],
        title: e.title,
        description: cut(e.description, 400),
        cost: e.cost,
        result: e.result ? INSPECTION_RESULTS[e.result] : undefined,
        elements: names(e.elementIds),
        author: e.author ? [e.author.name, e.author.company].filter(Boolean).join(", ") : undefined,
      })),
    documents: property.documents.slice(0, 150).map((d) => ({
      title: d.title,
      category: DOCUMENT_CATEGORIES[d.category],
      fileName: d.fileName,
      elements: names(d.elementIds),
    })),
    reminders: property.reminders.slice(0, 100).map((r) => ({
      title: r.title,
      type: REMINDER_TYPES[r.type],
      dueDate: r.dueDate,
      done: r.done,
      intervalMonths: r.intervalMonths,
      intervalConfirmed: r.intervalConfirmed,
      lastDone: r.lastDone,
      element: name(r.elementId),
    })),
    inventory: property.inventory.slice(0, 150).map((i) => ({
      name: i.name,
      location: i.location,
      brand: i.brand,
      warrantyUntil: i.warrantyUntil,
      element: name(i.elementId),
    })),
  };
}

// Otázka na polohu / vrtání → vždy připomenout detektor
export const LOCATION_QUESTION_RE =
  /vrt|bour|kop|sekat|vede|veden|kabel|trubk|potrub|kudy|zeď|zdi|stěn|strop|podlah|polo[hz]|přesnost|hřebík|hmožd/i;

// --- Záložní hledání bez AI -----------------------------------------------------

export type LocalHit = {
  kind: "element" | "entry" | "document" | "reminder" | "inventory";
  label: string; // „Prvek", „Zápis"…
  title: string;
  detail?: string;
  date?: string;
  elementId?: string; // pro odkaz na „Vše o prvku"
  score: number;
};

const STOP = new Set(
  (
    "kdy kde jak jaky jaka jake jakou co je jsou byl byla bylo byly mam mame ma na ve do od po pro se si to ten ta " +
    "nebo ktery ktera ktere kolik posledni dalsi mi muj moje nas nase dum domu tady tam jeste uz bych lze muzu mohu " +
    "prosim mel mela meli kdo cim proc ktery jaky jsem jste zda jestli neco nejaky nejaka"
  ).split(" "),
);

export function fold(s: string): string {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

function words(s: string): string[] {
  return fold(s).split(/[^a-z0-9]+/).filter((w) => w.length >= 3);
}

// Čeština se skloňuje (kotel / kotle, revize / revizní) — stačí shodný začátek slova
function wordMatch(a: string, b: string): boolean {
  let p = 0;
  while (p < a.length && p < b.length && a[p] === b[p]) p++;
  return p >= 3 && p >= Math.min(a.length, b.length) - 2;
}

function score(tokens: string[], text: string): number {
  const ws = words(text);
  return tokens.filter((t) => ws.some((w) => wordMatch(t, w))).length;
}

export function localSearch(property: Property, question: string, limit = 6): LocalHit[] {
  const tokens = [...new Set(words(question).filter((w) => !STOP.has(w)))];
  if (tokens.length === 0) return [];
  const elements = property.elements ?? [];
  const elName = (id?: string) => (id ? elements.find((e) => e.id === id)?.name : undefined);
  const hits: LocalHit[] = [];

  for (const e of elements) {
    const s = score(tokens, [e.name, e.kind, e.room, e.location, ELEMENT_CATEGORIES[e.category], e.note].join(" "));
    if (s) {
      hits.push({
        kind: "element",
        label: "Prvek",
        title: e.name,
        detail: [e.room, e.location, accuracyLabel(e)].filter(Boolean).join(" · "),
        elementId: e.id,
        score: s,
      });
    }
  }
  for (const en of property.entries) {
    const s = score(tokens, [en.title, en.description, ENTRY_TYPES[en.type], ...(en.elementIds ?? []).map(elName)].join(" "));
    if (s) {
      hits.push({
        kind: "entry",
        label: ENTRY_TYPES[en.type] ?? "Zápis",
        title: en.title,
        detail: cut(en.description, 160),
        date: en.date,
        elementId: en.elementIds?.[0],
        score: s,
      });
    }
  }
  for (const d of property.documents) {
    const s = score(tokens, [d.title, d.fileName, DOCUMENT_CATEGORIES[d.category], ...(d.elementIds ?? []).map(elName)].join(" "));
    if (s) {
      hits.push({
        kind: "document",
        label: "Dokument",
        title: d.title,
        detail: DOCUMENT_CATEGORIES[d.category],
        elementId: d.elementIds?.[0],
        score: s,
      });
    }
  }
  for (const r of property.reminders) {
    const s = score(tokens, [r.title, r.note, REMINDER_TYPES[r.type], "termin", elName(r.elementId)].join(" "));
    if (s) {
      hits.push({
        kind: "reminder",
        label: r.done ? "Termín (splněno)" : "Termín",
        title: r.title,
        date: r.dueDate,
        elementId: r.elementId,
        score: s,
      });
    }
  }
  for (const i of property.inventory) {
    const s = score(tokens, [i.name, i.brand, i.location, i.note, elName(i.elementId)].join(" "));
    if (s) {
      hits.push({
        kind: "inventory",
        label: "Vybavení",
        title: i.name,
        detail: [i.brand, i.warrantyUntil ? `záruka do ${i.warrantyUntil}` : undefined].filter(Boolean).join(" · "),
        elementId: i.elementId,
        score: s,
      });
    }
  }

  return hits
    .sort((a, b) => b.score - a.score || (b.date ?? "").localeCompare(a.date ?? ""))
    .slice(0, limit);
}
