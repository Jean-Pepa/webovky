import type { Lang } from "./homepage";

// Harmonogram Mařeny 2026 — čtvrtek 17. 9. → čtvrtek 24. 9. Zdroj: tabulka
// organizátorů. AOSI posunuto na 17:30, ať se Martina Mertová vejde do
// 16:30–17:30 (jediný čas, kdy může). Názvy hostů/kapel jsou napříč jazyky stejné.

type L = Record<Lang, string>;
export type SlotKind = "zahajeni" | "special" | "film" | "vikend" | "prednaska" | "kapela" | "dj" | "herni" | "pruvod" | "volno";

export interface Slot {
  from: string;
  to?: string; // chybí = „od" (běží dál / bez konce)
  title: string | L;
  kind: SlotKind;
  note?: L;
  place?: L; // místo konání — přepíše výchozí místo podle typu (KIND_PLACE)
  must?: boolean; // povinná účast (pasování)
}
export interface Day {
  day: number;
  dow: L;
  slots: Slot[];
  finale?: boolean;
}

// Barvy štítků podle typu programu (dle tabulky organizátorů, na bílém pozadí).
export const KIND_CLASS: Record<SlotKind, string> = {
  zahajeni: "bg-orange-500 text-white",
  special: "bg-yellow-300 text-yellow-950",
  film: "bg-purple-600 text-white",
  vikend: "bg-rose-800 text-white",
  prednaska: "bg-amber-400 text-amber-950",
  kapela: "bg-blue-600 text-white",
  dj: "bg-red-600 text-white",
  herni: "bg-emerald-500 text-white",
  pruvod: "bg-teal-500 text-white",
  volno: "bg-ink/5 text-ink-soft",
};

// Štítek typu programu nad blokem (malými písmeny): [jednotné, množné číslo].
// Sousední položky stejného typu dostanou štítek jen jednou. `null` = bez štítku.
export const KIND_LABEL: Record<SlotKind, [L, L] | null> = {
  zahajeni: [{ cs: "zahájení", en: "opening", de: "Auftakt" }, { cs: "zahájení", en: "opening", de: "Auftakt" }],
  special: [{ cs: "speciál", en: "special", de: "Spezial" }, { cs: "speciály", en: "specials", de: "Spezials" }],
  film: [{ cs: "film", en: "film", de: "Film" }, { cs: "filmy", en: "films", de: "Filme" }],
  vikend: [{ cs: "víkendový program", en: "weekend programme", de: "Wochenendprogramm" }, { cs: "víkendový program", en: "weekend programme", de: "Wochenendprogramm" }],
  prednaska: [{ cs: "přednáška", en: "lecture", de: "Vortrag" }, { cs: "přednášky", en: "lectures", de: "Vorträge" }],
  kapela: [{ cs: "kapela", en: "band", de: "Band" }, { cs: "kapely", en: "bands", de: "Bands" }],
  dj: [{ cs: "dj", en: "dj", de: "DJ" }, { cs: "djs", en: "djs", de: "DJs" }],
  herni: [{ cs: "herní večer", en: "game night", de: "Spieleabend" }, { cs: "herní večery", en: "game nights", de: "Spieleabende" }],
  pruvod: [{ cs: "průvod", en: "parade", de: "Umzug" }, { cs: "průvod", en: "parade", de: "Umzug" }],
  volno: null,
};

// Kde se to koná — výchozí podle typu: přednášky v aule, kapely / dj / herní
// večer na dvoře. Jednotlivá položka to může přepsat (finálové kapely na Flédě).
export const KIND_PLACE: Partial<Record<SlotKind, L>> = {
  prednaska: { cs: "aula", en: "lecture hall", de: "Aula" },
  kapela: { cs: "dvůr", en: "courtyard", de: "Hof" },
  dj: { cs: "dvůr", en: "courtyard", de: "Hof" },
  herni: { cs: "dvůr", en: "courtyard", de: "Hof" },
};
export function placeOf(s: Slot): L | undefined {
  return s.place ?? KIND_PLACE[s.kind];
}

export interface SlotGroup {
  kind: SlotKind;
  slots: Slot[];
}
// Sousední položky stejného typu → jeden blok (štítek se ukáže jen jednou nad ním).
export function groupSlots(slots: Slot[]): SlotGroup[] {
  const out: SlotGroup[] = [];
  for (const s of slots) {
    const last = out[out.length - 1];
    if (last && last.kind === s.kind) last.slots.push(s);
    else out.push({ kind: s.kind, slots: [s] });
  }
  return out;
}

export const UI: Record<"heading" | "finale" | "must" | "from" | "tickets", L> = {
  heading: { cs: "Harmonogram", en: "Schedule", de: "Programm" },
  from: { cs: "od", en: "from", de: "ab" },
  finale: { cs: "Velké finále", en: "Grand finale", de: "Großes Finale" },
  must: { cs: "povinné", en: "mandatory", de: "Pflicht" },
  tickets: {
    cs: "Kupuj lístky, než se vyprodají.",
    en: "Buy tickets before they sell out.",
    de: "Kauf dir Tickets, bevor sie ausverkauft sind.",
  },
};

const P = (cs: string, en: string, de: string): L => ({ cs, en, de });

export const SCHEDULE: Day[] = [
  {
    day: 17,
    dow: P("Čt", "Thu", "Do"),
    slots: [
      { from: "19:00", to: "20:00", title: P("Zahájení semestru", "Semester opening", "Semesterauftakt"), kind: "zahajeni" },
      { from: "20:00", to: "21:00", title: "Hopsen Clark", kind: "kapela" },
      { from: "21:00", to: "0:00", title: "DJ Vojta", kind: "dj" },
    ],
  },
  {
    day: 18,
    dow: P("Pá", "Fri", "Fr"),
    slots: [
      { from: "17:30", to: "19:00", title: P("Studentský speciál", "Student special", "Studenten-Spezial"), kind: "special" },
      { from: "19:00", to: "20:00", title: P("Kapela jednoho prváka BBzde", "One-freshman band BBzde", "Ein-Erstsemester-Band BBzde"), kind: "kapela" },
      { from: "20:00", to: "23:30", title: P("Film", "Film", "Film"), kind: "film" },
    ],
  },
  {
    day: 19,
    dow: P("So", "Sat", "Sa"),
    slots: [{ from: "", title: P("Volno", "Day off", "Frei"), kind: "volno" }],
  },
  {
    day: 20,
    dow: P("Ne", "Sun", "So"),
    slots: [
      {
        from: "14:00",
        to: "15:30",
        title: P(
          "Michal Konečný — procházka po okružní třídě 19. století",
          "Michal Konečný — walk along the 19th-century ring road",
          "Michal Konečný — Spaziergang entlang der Ringstraße des 19. Jh.",
        ),
        note: P("sraz u obelisku v Denisových sadech, cca 1,5 h", "meet at the obelisk in Denis Gardens, approx. 1.5 h", "Treffpunkt am Obelisken in den Denis-Gärten, ca. 1,5 h"),
        kind: "vikend",
      },
    ],
  },
  {
    day: 21,
    dow: P("Po", "Mon", "Mo"),
    slots: [
      { from: "16:00", to: "17:00", title: "prof. Ing. arch. Monika Mitášová, Ph.D.", kind: "prednaska" },
      { from: "17:00", to: "18:00", title: "Štěpán Flekna", kind: "prednaska" },
      { from: "18:00", to: "20:00", title: "Steve Davies", kind: "prednaska" },
      { from: "20:00", to: "22:00", title: "Stříbrný Rafael", kind: "kapela" },
    ],
  },
  {
    day: 22,
    dow: P("Út", "Tue", "Di"),
    slots: [
      { from: "16:30", to: "17:30", title: "INN", kind: "prednaska" },
      { from: "17:30", to: "18:30", title: "Městem na kole", kind: "prednaska" },
      { from: "18:30", to: "19:30", title: "Grau architekti", kind: "prednaska" },
      { from: "20:00", to: "0:00", title: "Albert Wawracz", kind: "dj" },
    ],
  },
  {
    day: 23,
    dow: P("St", "Wed", "Mi"),
    slots: [
      { from: "16:30", to: "17:30", title: "Martina Mertová", kind: "prednaska" },
      { from: "17:30", to: "18:30", title: "AOSI", kind: "prednaska" },
      { from: "18:30", to: "19:30", title: "Henkai architekti", kind: "prednaska" },
      { from: "20:00", to: "0:00", title: P("Herní večer", "Game night", "Spieleabend"), kind: "herni" },
    ],
  },
  {
    day: 24,
    dow: P("Čt", "Thu", "Do"),
    finale: true,
    slots: [
      { from: "17:30", to: "18:00", title: P("Sraz na fakultě", "Meet at the faculty", "Treffen an der Fakultät"), kind: "pruvod" },
      { from: "21:00", to: "22:30", title: "Obligatne", kind: "kapela", place: P("Fléda", "Fléda", "Fléda") },
      { from: "22:30", to: "23:30", title: "Eduv syn", kind: "kapela", place: P("Fléda", "Fléda", "Fléda") },
      { from: "23:30", to: "0:30", title: "Ragdoll", kind: "kapela", place: P("Fléda", "Fléda", "Fléda") },
    ],
  },
];

// Datum podle jazyka: cs/de „17. 9.", en „17 Sep".
export function fmtDay(day: number, lang: Lang): string {
  return lang === "en" ? `${day} Sep` : `${day}. 9.`;
}
export function pick(v: string | L, lang: Lang): string {
  return typeof v === "string" ? v : v[lang];
}
