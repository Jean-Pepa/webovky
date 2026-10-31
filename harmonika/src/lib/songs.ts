// Písničky na trénink. Jen melodie volné k užití (lidové písně, klasika, jejíž
// autoři zemřeli před více než 70 lety) a vlastní cvičení.
//
// Zápis: "C4" = čtvrťová nota, "G4:2" = půlová, "F#4:.5" = osminová, "r" = pauza,
// "|" = taktová čára (jen pro zobrazení). Délky jsou ve čtvrťových dobách.

import { LETTER_PC, SEMITONE_INTERVALS, mod12, noteName, parseNote, pcOf, pcOfName, transpose, type Interval, type Pattern } from "./music";

export type SongDef = {
  id: string;
  title: string;
  by: string;
  group: string;
  level: 1 | 2 | 3;
  /** Základní tón původní tóniny. */
  key: string;
  minor?: boolean;
  bpm: number;
  /** Kolik čtvrťových dob trvá jeden klik metronomu (6/8 → 1.5). */
  beat: number;
  /** Kliků na takt. */
  bar: number;
  /** Předtaktí (ve čtvrťových dobách) — kvůli přízvuku metronomu. */
  pickup?: number;
  notes: string;
};

export type SongEvent = {
  idx: number;
  /** Jméno tónu bez oktávy (null = pauza). */
  name: string | null;
  midi: number | null;
  /** Začátek ve čtvrťových dobách od začátku písně. */
  q: number;
  dur: number;
  /** Před tónem je taktová čára. */
  bar: boolean;
};

export const SONGS: SongDef[] = [
  // ------------------------------------------------------------ Easy
  {
    id: "twinkle",
    title: "Twinkle, Twinkle, Little Star",
    by: "Traditional",
    group: "Easy",
    level: 1,
    key: "C",
    bpm: 100,
    beat: 1,
    bar: 4,
    notes: `C4 C4 G4 G4 | A4 A4 G4:2 | F4 F4 E4 E4 | D4 D4 C4:2 | G4 G4 F4 F4 | E4 E4 D4:2 |
            G4 G4 F4 F4 | E4 E4 D4:2 | C4 C4 G4 G4 | A4 A4 G4:2 | F4 F4 E4 E4 | D4 D4 C4:2`,
  },
  {
    id: "saints",
    title: "When the Saints Go Marching In",
    by: "Traditional spiritual",
    group: "Easy",
    level: 1,
    key: "C",
    bpm: 120,
    beat: 1,
    bar: 4,
    pickup: 3,
    notes: `C4 E4 F4 | G4:4 | r C4 E4 F4 | G4:4 | r C4 E4 F4 | G4:2 E4:2 | C4:2 E4:2 | D4:4 |
            r E4 E4 D4 | C4:3 C4 | E4:2 G4:2 | G4 F4:3 | r:2 E4 F4 | G4:2 E4:2 | C4:2 D4:2 | C4:4`,
  },
  {
    id: "jingle",
    title: "Jingle Bells (Rolničky)",
    by: "J. L. Pierpont",
    group: "Easy",
    level: 1,
    key: "C",
    bpm: 120,
    beat: 1,
    bar: 4,
    notes: `E4 E4 E4:2 | E4 E4 E4:2 | E4 G4 C4:1.5 D4:.5 | E4:4 | F4 F4 F4:1.5 F4:.5 | F4 E4 E4 E4:.5 E4:.5 |
            E4 D4 D4 E4 | D4:2 G4:2 | E4 E4 E4:2 | E4 E4 E4:2 | E4 G4 C4:1.5 D4:.5 | E4:4 |
            F4 F4 F4:1.5 F4:.5 | F4 E4 E4 E4:.5 E4:.5 | G4 G4 F4 D4 | C4:4`,
  },
  {
    id: "ode",
    title: "Ode to Joy (Óda na radost)",
    by: "L. van Beethoven",
    group: "Easy",
    level: 1,
    key: "C",
    bpm: 100,
    beat: 1,
    bar: 4,
    notes: `E5 E5 F5 G5 | G5 F5 E5 D5 | C5 C5 D5 E5 | E5:1.5 D5:.5 D5:2 | E5 E5 F5 G5 | G5 F5 E5 D5 |
            C5 C5 D5 E5 | D5:1.5 C5:.5 C5:2 | D5 D5 E5 C5 | D5 E5:.5 F5:.5 E5 C5 | D5 E5:.5 F5:.5 E5 D5 |
            C5 D5 G4:2 | E5 E5 F5 G5 | G5 F5 E5 D5 | C5 C5 D5 E5 | D5:1.5 C5:.5 C5:2`,
  },
  {
    id: "jacques",
    title: "Bratře Kubo (Frère Jacques)",
    by: "Traditional",
    group: "Easy",
    level: 1,
    key: "C",
    bpm: 100,
    beat: 1,
    bar: 4,
    notes: `C5 D5 E5 C5 | C5 D5 E5 C5 | E5 F5 G5:2 | E5 F5 G5:2 | G5:.5 A5:.5 G5:.5 F5:.5 E5 C5 |
            G5:.5 A5:.5 G5:.5 F5:.5 E5 C5 | C5 G4 C5:2 | C5 G4 C5:2`,
  },
  {
    id: "birthday",
    title: "Happy Birthday",
    by: "M. & P. Hill",
    group: "Easy",
    level: 1,
    key: "C",
    bpm: 100,
    beat: 1,
    bar: 3,
    pickup: 1,
    notes: `G4:.75 G4:.25 | A4 G4 C5 | B4:2 G4:.75 G4:.25 | A4 G4 D5 | C5:2 G4:.75 G4:.25 | G5 E5 C5 |
            B4 A4 F5:.75 F5:.25 | E5 C5 D5 | C5:3`,
  },
  // -------------------------------------------------------- Melodies
  {
    id: "largo",
    title: "Largo – From the New World",
    by: "A. Dvořák",
    group: "Melodies",
    level: 1,
    key: "C",
    bpm: 56,
    beat: 1,
    bar: 4,
    notes: `E4:1.5 G4:.5 G4:2 | E4:1.5 D4:.5 C4:2 | D4:.5 E4:.5 G4:.5 E4:.5 D4:2 |
            E4:1.5 G4:.5 G4:2 | E4:1.5 D4:.5 C4:2 | D4:.5 E4:.5 D4:.5 C4:.5 C4:2`,
  },
  {
    id: "amazing",
    title: "Amazing Grace",
    by: "Traditional",
    group: "Melodies",
    level: 2,
    key: "C",
    bpm: 80,
    beat: 1,
    bar: 3,
    pickup: 1,
    notes: `G4 | C5:2 E5:.5 C5:.5 | E5:2 D5 | C5:2 A4 | G4:2 G4 | C5:2 E5:.5 C5:.5 | E5:2 D5 | G5:5 E5 |
            G5:2 E5:.5 G5:.5 | E5:2 C5 | G4:2 A4 | C5:2 A4 | G4:2 G4 | C5:2 E5:.5 C5:.5 | E5:2 D5 | C5:3`,
  },
  {
    id: "silent",
    title: "Silent Night (Tichá noc)",
    by: "F. X. Gruber",
    group: "Melodies",
    level: 2,
    key: "C",
    bpm: 80,
    beat: 1,
    bar: 3,
    notes: `G4:1.5 A4:.5 G4 | E4:3 | G4:1.5 A4:.5 G4 | E4:3 | D5:2 D5 | B4:3 | C5:2 C5 | G4:3 |
            A4:2 A4 | C5:1.5 B4:.5 A4 | G4:1.5 A4:.5 G4 | E4:3 | A4:2 A4 | C5:1.5 B4:.5 A4 |
            G4:1.5 A4:.5 G4 | E4:3 | D5:2 D5 | F5:1.5 D5:.5 B4 | C5:3 | E5:3 | C5:1.5 G4:.5 E4 |
            G4:1.5 F4:.5 D4 | C4:3`,
  },
  {
    id: "minuet",
    title: "Minuet in G",
    by: "C. Petzold",
    group: "Melodies",
    level: 2,
    key: "G",
    bpm: 100,
    beat: 1,
    bar: 3,
    notes: `D5 G4:.5 A4:.5 B4:.5 C5:.5 | D5 G4 G4 | E5 C5:.5 D5:.5 E5:.5 F#5:.5 | G5 G4 G4 |
            C5 D5:.5 C5:.5 B4:.5 A4:.5 | B4 C5:.5 B4:.5 A4:.5 G4:.5 | F#4 G4:.5 A4:.5 B4:.5 G4:.5 | A4:3 |
            D5 G4:.5 A4:.5 B4:.5 C5:.5 | D5 G4 G4 | E5 C5:.5 D5:.5 E5:.5 F#5:.5 | G5 G4 G4 |
            C5 D5:.5 C5:.5 B4:.5 A4:.5 | B4 C5:.5 B4:.5 A4:.5 G4:.5 | A4 B4:.5 A4:.5 G4:.5 F#4:.5 | G4:3`,
  },
  // --------------------------------------------------- Slide practice
  {
    id: "vltava",
    title: "Vltava (The Moldau)",
    by: "B. Smetana",
    group: "Slide practice",
    level: 2,
    key: "E",
    minor: true,
    bpm: 56,
    beat: 1.5,
    bar: 2,
    notes: `E4 F#4:.5 G4 A4:.5 | B4:1.5 B4:1.5 | C5:1.5 C5:1.5 | B4:3 | A4:1.5 A4:1.5 | G4:1.5 G4:1.5 |
            F#4:1.5 F#4:1.5 | E4:3 | E4 F#4:.5 G4 A4:.5 | B4:1.5 B4:1.5 | C5:1.5 C5:1.5 | B4:3 |
            A4:1.5 A4:1.5 | G4:1.5 G4:1.5 | F#4:1.5 F#4:1.5 | E4:3`,
  },
  {
    id: "greensleeves",
    title: "Greensleeves",
    by: "Traditional",
    group: "Slide practice",
    level: 3,
    key: "A",
    minor: true,
    bpm: 90,
    beat: 1,
    bar: 3,
    pickup: 1,
    notes: `A4 | C5:2 D5 | E5:1.5 F5:.5 E5 | D5:2 B4 | G4:1.5 A4:.5 B4 | C5:2 A4 | A4:1.5 G#4:.5 A4 |
            B4:2 G#4 | E4:2 A4 | C5:2 D5 | E5:1.5 F5:.5 E5 | D5:2 B4 | G4:1.5 A4:.5 B4 |
            C5:1.5 B4:.5 A4 | G#4:1.5 F#4:.5 G#4 | A4:3 | G5:3 | G5:1.5 F#5:.5 E5 | D5:2 B4 |
            G4:1.5 A4:.5 B4 | C5:2 A4 | A4:1.5 G#4:.5 A4 | B4:2 G#4 | E4:3 | G5:3 |
            G5:1.5 F#5:.5 E5 | D5:2 B4 | G4:1.5 A4:.5 B4 | C5:1.5 B4:.5 A4 | G#4:1.5 F#4:.5 G#4 | A4:3`,
  },
  {
    id: "elise",
    title: "Für Elise",
    by: "L. van Beethoven",
    group: "Slide practice",
    level: 3,
    key: "A",
    minor: true,
    bpm: 120,
    beat: 0.5,
    bar: 3,
    pickup: 0.5,
    notes: `E5:.25 D#5:.25 | E5:.25 D#5:.25 E5:.25 B4:.25 D5:.25 C5:.25 | A4:.5 r:.25 C4:.25 E4:.25 A4:.25 |
            B4:.5 r:.25 E4:.25 G#4:.25 B4:.25 | C5:.5 r:.25 E4:.25 E5:.25 D#5:.25 |
            E5:.25 D#5:.25 E5:.25 B4:.25 D5:.25 C5:.25 | A4:.5 r:.25 C4:.25 E4:.25 A4:.25 |
            B4:.5 r:.25 E4:.25 C5:.25 B4:.25 | A4:1.5`,
  },
  // ------------------------------------------------------ Jazz & Blues
  {
    id: "blues",
    title: "Blues for Harp",
    by: "Etude · 12-bar blues",
    group: "Jazz & Blues",
    level: 2,
    key: "C",
    bpm: 90,
    beat: 1,
    bar: 4,
    notes: `C5 Eb5:.5 E5:.5 G5 A5 | G5 E5:.5 Eb5:.5 C5:2 | C5 Eb5:.5 E5:.5 G5 A5 | Bb5:.5 A5:.5 G5 E5:2 |
            F5 Ab5:.5 A5:.5 C6 D6 | C6 A5:.5 Ab5:.5 F5:2 | C5 Eb5:.5 E5:.5 G5 A5 | G5 E5:.5 Eb5:.5 C5:2 |
            D5 F5:.5 G5:.5 B5 D6 | C6 A5:.5 F5:.5 Eb5:2 | C5 E5 G5 Bb5 | B5:.5 C6:.5 G5 C5:2`,
  },
  {
    id: "iivi",
    title: "ii–V–I Etude",
    by: "Etude · C → F → Bb",
    group: "Jazz & Blues",
    level: 2,
    key: "C",
    bpm: 80,
    beat: 1,
    bar: 4,
    notes: `D5 F5 A5 C6 | B5 G5 F5 D5 | E5 G5 B5 D6 | C6:4 | G4 Bb4 D5 F5 | E5 C5 Bb4 G4 | A4 C5 E5 G5 | F5:4 |
            C5 Eb5 G5 Bb5 | A5 F5 Eb5 C5 | D5 F5 A5 C6 | Bb5:4`,
  },
];

export const SONG_GROUPS = [...new Set(SONGS.map((s) => s.group))];

export function findSong(id: string): SongDef {
  return SONGS.find((s) => s.id === id) ?? SONGS[0];
}

const NOTE = /^([A-G](?:#{1,2}|b{1,2})?)(-?\d)(?::([\d.]+))?$/;
const REST = /^r(?::([\d.]+))?$/;

export function parseSong(def: SongDef): SongEvent[] {
  const out: SongEvent[] = [];
  let q = 0;
  let bar = false;
  for (const tok of def.notes.trim().split(/\s+/)) {
    if (tok === "|") {
      bar = true;
      continue;
    }
    const n = NOTE.exec(tok);
    const r = REST.exec(tok);
    if (!n && !r) throw new Error(`Song ${def.id}: bad token ${tok}`);
    const dur = parseFloat((n ? n[3] : r![1]) ?? "1");
    if (n) {
      const sp = parseNote(n[1]);
      const midi = (parseInt(n[2], 10) + 1) * 12 + LETTER_PC[sp.letter] + sp.acc;
      out.push({ idx: out.length, name: noteName(sp), midi, q, dur, bar });
    } else {
      out.push({ idx: out.length, name: null, midi: null, q, dur, bar });
    }
    q += dur;
    bar = false;
  }
  return out;
}

export const songLength = (ev: SongEvent[]) => (ev.length ? ev[ev.length - 1].q + ev[ev.length - 1].dur : 0);

export function songKeyLabel(def: SongDef, root: string) {
  return root + (def.minor ? "m" : "");
}

/**
 * Převod písně do jiné tóniny se správným pravopisem. Oktáva se zvolí tak,
 * aby se melodie vešla do rozsahu harmoniky [lo, hi].
 */
export function transposeSong(ev: SongEvent[], fromKey: string, toKey: string, lo: number, hi: number): SongEvent[] {
  const from = parseNote(fromKey);
  const to = parseNote(toKey);
  const semis = mod12(pcOf(to) - pcOf(from));
  const iv: Interval = { name: "", number: (((to.letter - from.letter) % 7) + 7) % 7 + 1, semis };
  const notes = ev.filter((e) => e.midi !== null).map((e) => e.midi!);
  if (!notes.length) return ev;
  const min = Math.min(...notes);
  const max = Math.max(...notes);
  let best = semis;
  let bestScore = Infinity;
  for (const s of [semis - 24, semis - 12, semis, semis + 12]) {
    const over = Math.max(0, lo - (min + s)) + Math.max(0, max + s - hi);
    const score = over * 100 + Math.abs(s);
    if (score < bestScore) {
      bestScore = score;
      best = s;
    }
  }
  const same = semis === 0 && from.letter === to.letter;
  return ev.map((e) =>
    e.midi === null
      ? e
      : { ...e, midi: e.midi + best, name: same ? e.name : noteName(transpose(parseNote(e.name!), iv)) },
  );
}

/** Vzor pro mřížku: barevně se zvýrazní tóny, které v písni opravdu jsou. */
export function songPattern(ev: SongEvent[], root: string): Pattern {
  const rootPc = pcOfName(root);
  const pcs = new Set<number>();
  const nameByPc = new Map<number, string>();
  const degreeByPc = new Map<number, string>();
  for (const e of ev) {
    if (e.midi === null) continue;
    const pc = mod12(e.midi);
    pcs.add(pc);
    if (!nameByPc.has(pc)) nameByPc.set(pc, e.name!);
    degreeByPc.set(pc, SEMITONE_INTERVALS[mod12(pc - rootPc)].short);
  }
  const ordered = [...pcs].sort((a, b) => mod12(a - rootPc) - mod12(b - rootPc));
  return {
    rootPc,
    notes: ordered.map((pc) => nameByPc.get(pc)!),
    degrees: ordered.map((pc) => degreeByPc.get(pc)!),
    semis: ordered.map((pc) => mod12(pc - rootPc)),
    pcs,
    nameByPc,
    degreeByPc,
  };
}
