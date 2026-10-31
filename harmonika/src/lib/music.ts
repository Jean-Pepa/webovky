// Hudební teorie: pojmenování not, intervaly, stupnice a arpeggia.
// Noty se píšou ASCII znaky (C#, Bb) stejně jako v originální appce.

export const LETTERS = ["C", "D", "E", "F", "G", "A", "B"] as const;
export const LETTER_PC = [0, 2, 4, 5, 7, 9, 11];
const MAJOR_SEMIS = [0, 2, 4, 5, 7, 9, 11];
const PERFECT_DEGREES = new Set([0, 3, 4]); // 1, 4, 5 (0-based)

export const SHARP_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
export const FLAT_NAMES = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];

export const mod12 = (n: number) => ((n % 12) + 12) % 12;

export type Spelled = { letter: number; acc: number };

export function parseNote(name: string): Spelled {
  const letter = LETTERS.indexOf(name[0].toUpperCase() as (typeof LETTERS)[number]);
  let acc = 0;
  for (const ch of name.slice(1)) {
    if (ch === "#" || ch === "♯") acc += 1;
    else if (ch === "b" || ch === "♭") acc -= 1;
    else if (ch === "x") acc += 2;
  }
  return { letter: Math.max(0, letter), acc };
}

export const pcOf = (s: Spelled) => mod12(LETTER_PC[s.letter] + s.acc);

export function noteName(s: Spelled): string {
  return LETTERS[s.letter] + (s.acc > 0 ? "#".repeat(s.acc) : "b".repeat(-s.acc));
}

export const pcOfName = (name: string) => pcOf(parseNote(name));

/** MIDI → jméno s oktávou (60 = C4). */
export function midiName(midi: number, flats = false): string {
  return (flats ? FLAT_NAMES : SHARP_NAMES)[mod12(midi)] + (Math.floor(midi / 12) - 1);
}

export function midiToFreq(midi: number, a4 = 440): number {
  return a4 * Math.pow(2, (midi - 69) / 12);
}

export type Interval = { name: string; number: number; semis: number };

const QUALITY_PERFECT: Record<string, number> = { P: 0, A: 1, AA: 2, d: -1, dd: -2 };
const QUALITY_IMPERFECT: Record<string, number> = { M: 0, m: -1, A: 1, AA: 2, d: -2, dd: -3 };

export function parseInterval(name: string): Interval {
  const m = /^(dd|d|m|M|P|AA|A)(\d+)$/.exec(name);
  if (!m) throw new Error("Bad interval " + name);
  const q = m[1];
  const number = parseInt(m[2], 10);
  const simple = (number - 1) % 7;
  const octave = Math.floor((number - 1) / 7);
  const off = PERFECT_DEGREES.has(simple) ? QUALITY_PERFECT[q] : QUALITY_IMPERFECT[q];
  return { name, number, semis: MAJOR_SEMIS[simple] + 12 * octave + (off ?? 0) };
}

export function transpose(root: Spelled, iv: Interval): Spelled {
  const letter = (root.letter + iv.number - 1) % 7;
  const target = mod12(pcOf(root) + iv.semis);
  let diff = mod12(target - LETTER_PC[letter]);
  if (diff > 6) diff -= 12;
  return { letter, acc: diff };
}

/** Interval mezi dvěma MIDI tóny (podle půltónů, bez ohledu na pravopis). */
export const SEMITONE_INTERVALS = [
  { short: "P1", long: "Perfect unison" },
  { short: "m2", long: "Minor second" },
  { short: "M2", long: "Major second" },
  { short: "m3", long: "Minor third" },
  { short: "M3", long: "Major third" },
  { short: "P4", long: "Perfect fourth" },
  { short: "A4", long: "Tritone (A4 / d5)" },
  { short: "P5", long: "Perfect fifth" },
  { short: "m6", long: "Minor sixth" },
  { short: "M6", long: "Major sixth" },
  { short: "m7", long: "Minor seventh" },
  { short: "M7", long: "Major seventh" },
  { short: "P8", long: "Perfect octave" },
];

export function intervalBetween(a: number, b: number): { short: string; long: string; semis: number } {
  const semis = Math.abs(b - a);
  const oct = Math.floor(semis / 12);
  const rest = semis % 12;
  if (semis === 0) return { ...SEMITONE_INTERVALS[0], semis };
  if (rest === 0) {
    return oct === 1
      ? { ...SEMITONE_INTERVALS[12], semis }
      : { short: `P8×${oct}`, long: `${oct} octaves`, semis };
  }
  const base = SEMITONE_INTERVALS[rest];
  return oct === 0
    ? { ...base, semis }
    : { short: `${base.short}+${oct}oct`, long: `${base.long} + ${oct} octave${oct > 1 ? "s" : ""}`, semis };
}

// ---------------------------------------------------------------------------
// Stupnice a arpeggia
// ---------------------------------------------------------------------------

export type PatternDef = {
  id: string;
  name: string;
  group: string;
  intervals: string[];
  /** Jak se vypíše na čipu: "space" → "C Major", jinak symbol přilepený ke klíči ("Cm7"). */
  symbol?: string;
};

export const SCALES: PatternDef[] = [
  // Major & modes
  { id: "major", name: "Major", group: "Major & Modes", intervals: ["P1", "M2", "M3", "P4", "P5", "M6", "M7"] },
  { id: "dorian", name: "Dorian", group: "Major & Modes", intervals: ["P1", "M2", "m3", "P4", "P5", "M6", "m7"] },
  { id: "phrygian", name: "Phrygian", group: "Major & Modes", intervals: ["P1", "m2", "m3", "P4", "P5", "m6", "m7"] },
  { id: "lydian", name: "Lydian", group: "Major & Modes", intervals: ["P1", "M2", "M3", "A4", "P5", "M6", "M7"] },
  { id: "mixolydian", name: "Mixolydian", group: "Major & Modes", intervals: ["P1", "M2", "M3", "P4", "P5", "M6", "m7"] },
  { id: "aeolian", name: "Natural Minor", group: "Major & Modes", intervals: ["P1", "M2", "m3", "P4", "P5", "m6", "m7"] },
  { id: "locrian", name: "Locrian", group: "Major & Modes", intervals: ["P1", "m2", "m3", "P4", "d5", "m6", "m7"] },
  // Minor
  { id: "harmonicMinor", name: "Harmonic Minor", group: "Minor", intervals: ["P1", "M2", "m3", "P4", "P5", "m6", "M7"] },
  { id: "melodicMinor", name: "Melodic Minor", group: "Minor", intervals: ["P1", "M2", "m3", "P4", "P5", "M6", "M7"] },
  { id: "harmonicMajor", name: "Harmonic Major", group: "Minor", intervals: ["P1", "M2", "M3", "P4", "P5", "m6", "M7"] },
  { id: "phrygianDominant", name: "Phrygian Dominant", group: "Minor", intervals: ["P1", "m2", "M3", "P4", "P5", "m6", "m7"] },
  // Jazz (melodic minor modes)
  { id: "dorianb2", name: "Dorian b2", group: "Jazz Modes", intervals: ["P1", "m2", "m3", "P4", "P5", "M6", "m7"] },
  { id: "lydianAugmented", name: "Lydian Augmented", group: "Jazz Modes", intervals: ["P1", "M2", "M3", "A4", "A5", "M6", "M7"] },
  { id: "lydianDominant", name: "Lydian Dominant", group: "Jazz Modes", intervals: ["P1", "M2", "M3", "A4", "P5", "M6", "m7"] },
  { id: "mixolydianb6", name: "Mixolydian b6", group: "Jazz Modes", intervals: ["P1", "M2", "M3", "P4", "P5", "m6", "m7"] },
  { id: "locrian2", name: "Locrian #2", group: "Jazz Modes", intervals: ["P1", "M2", "m3", "P4", "d5", "m6", "m7"] },
  { id: "altered", name: "Altered", group: "Jazz Modes", intervals: ["P1", "m2", "A2", "M3", "d5", "m6", "m7"] },
  // Pentatonic & blues
  { id: "majorPentatonic", name: "Major Pentatonic", group: "Pentatonic & Blues", intervals: ["P1", "M2", "M3", "P5", "M6"] },
  { id: "minorPentatonic", name: "Minor Pentatonic", group: "Pentatonic & Blues", intervals: ["P1", "m3", "P4", "P5", "m7"] },
  { id: "blues", name: "Blues", group: "Pentatonic & Blues", intervals: ["P1", "m3", "P4", "d5", "P5", "m7"] },
  { id: "majorBlues", name: "Major Blues", group: "Pentatonic & Blues", intervals: ["P1", "M2", "m3", "M3", "P5", "M6"] },
  { id: "suspendedPentatonic", name: "Suspended Pentatonic", group: "Pentatonic & Blues", intervals: ["P1", "M2", "P4", "P5", "m7"] },
  // Bebop
  { id: "bebopDominant", name: "Bebop Dominant", group: "Bebop", intervals: ["P1", "M2", "M3", "P4", "P5", "M6", "m7", "M7"] },
  { id: "bebopMajor", name: "Bebop Major", group: "Bebop", intervals: ["P1", "M2", "M3", "P4", "P5", "A5", "M6", "M7"] },
  { id: "bebopDorian", name: "Bebop Dorian", group: "Bebop", intervals: ["P1", "M2", "m3", "M3", "P4", "P5", "M6", "m7"] },
  { id: "bebopMelodicMinor", name: "Bebop Melodic Minor", group: "Bebop", intervals: ["P1", "M2", "m3", "P4", "P5", "A5", "M6", "M7"] },
  // Symmetric
  { id: "wholeTone", name: "Whole Tone", group: "Symmetric", intervals: ["P1", "M2", "M3", "A4", "A5", "m7"] },
  { id: "diminishedHW", name: "Diminished H-W", group: "Symmetric", intervals: ["P1", "m2", "A2", "M3", "A4", "P5", "M6", "m7"] },
  { id: "diminishedWH", name: "Diminished W-H", group: "Symmetric", intervals: ["P1", "M2", "m3", "P4", "d5", "m6", "M6", "M7"] },
  { id: "augmented", name: "Augmented", group: "Symmetric", intervals: ["P1", "A2", "M3", "P5", "A5", "M7"] },
  { id: "chromatic", name: "Chromatic", group: "Symmetric", intervals: ["P1", "m2", "M2", "m3", "M3", "P4", "A4", "P5", "m6", "M6", "m7", "M7"] },
  // Exotic
  { id: "hungarianMinor", name: "Hungarian Minor", group: "Exotic", intervals: ["P1", "M2", "m3", "A4", "P5", "m6", "M7"] },
  { id: "doubleHarmonic", name: "Double Harmonic", group: "Exotic", intervals: ["P1", "m2", "M3", "P4", "P5", "m6", "M7"] },
  { id: "neapolitanMinor", name: "Neapolitan Minor", group: "Exotic", intervals: ["P1", "m2", "m3", "P4", "P5", "m6", "M7"] },
  { id: "neapolitanMajor", name: "Neapolitan Major", group: "Exotic", intervals: ["P1", "m2", "m3", "P4", "P5", "M6", "M7"] },
  { id: "ukrainianDorian", name: "Ukrainian Dorian", group: "Exotic", intervals: ["P1", "M2", "m3", "A4", "P5", "M6", "m7"] },
  { id: "persian", name: "Persian", group: "Exotic", intervals: ["P1", "m2", "M3", "P4", "d5", "m6", "M7"] },
  { id: "enigmatic", name: "Enigmatic", group: "Exotic", intervals: ["P1", "m2", "M3", "A4", "A5", "A6", "M7"] },
  { id: "prometheus", name: "Prometheus", group: "Exotic", intervals: ["P1", "M2", "M3", "A4", "M6", "m7"] },
  { id: "hirajoshi", name: "Hirajoshi", group: "Exotic", intervals: ["P1", "M2", "m3", "P5", "m6"] },
  { id: "inSen", name: "In Sen", group: "Exotic", intervals: ["P1", "m2", "P4", "P5", "m7"] },
];

export const ARPEGGIOS: PatternDef[] = [
  // Triads
  { id: "major", name: "Major", group: "Triads", symbol: " Major", intervals: ["P1", "M3", "P5"] },
  { id: "minor", name: "Minor", group: "Triads", symbol: " Minor", intervals: ["P1", "m3", "P5"] },
  { id: "diminished", name: "Diminished", group: "Triads", symbol: " Diminished", intervals: ["P1", "m3", "d5"] },
  { id: "augmented", name: "Augmented", group: "Triads", symbol: " Augmented", intervals: ["P1", "M3", "A5"] },
  { id: "sus2", name: "sus2", group: "Triads", symbol: "sus2", intervals: ["P1", "M2", "P5"] },
  { id: "sus4", name: "sus4", group: "Triads", symbol: "sus4", intervals: ["P1", "P4", "P5"] },
  // Sixths & sevenths
  { id: "maj6", name: "6", group: "Sixths & Sevenths", symbol: "6", intervals: ["P1", "M3", "P5", "M6"] },
  { id: "min6", name: "m6", group: "Sixths & Sevenths", symbol: "m6", intervals: ["P1", "m3", "P5", "M6"] },
  { id: "maj7", name: "Maj7", group: "Sixths & Sevenths", symbol: "Maj7", intervals: ["P1", "M3", "P5", "M7"] },
  { id: "dom7", name: "7 (Dominant)", group: "Sixths & Sevenths", symbol: "7", intervals: ["P1", "M3", "P5", "m7"] },
  { id: "min7", name: "m7", group: "Sixths & Sevenths", symbol: "m7", intervals: ["P1", "m3", "P5", "m7"] },
  { id: "m7b5", name: "m7b5 (Half-dim.)", group: "Sixths & Sevenths", symbol: "m7b5", intervals: ["P1", "m3", "d5", "m7"] },
  { id: "dim7", name: "dim7", group: "Sixths & Sevenths", symbol: "dim7", intervals: ["P1", "m3", "d5", "d7"] },
  { id: "mMaj7", name: "mMaj7", group: "Sixths & Sevenths", symbol: "mMaj7", intervals: ["P1", "m3", "P5", "M7"] },
  { id: "maj7s5", name: "Maj7#5", group: "Sixths & Sevenths", symbol: "Maj7#5", intervals: ["P1", "M3", "A5", "M7"] },
  { id: "dom7s5", name: "7#5", group: "Sixths & Sevenths", symbol: "7#5", intervals: ["P1", "M3", "A5", "m7"] },
  { id: "dom7b5", name: "7b5", group: "Sixths & Sevenths", symbol: "7b5", intervals: ["P1", "M3", "d5", "m7"] },
  { id: "dom7sus4", name: "7sus4", group: "Sixths & Sevenths", symbol: "7sus4", intervals: ["P1", "P4", "P5", "m7"] },
  // Extended
  { id: "maj9", name: "Maj9", group: "Extended", symbol: "Maj9", intervals: ["P1", "M3", "P5", "M7", "M9"] },
  { id: "dom9", name: "9", group: "Extended", symbol: "9", intervals: ["P1", "M3", "P5", "m7", "M9"] },
  { id: "min9", name: "m9", group: "Extended", symbol: "m9", intervals: ["P1", "m3", "P5", "m7", "M9"] },
  { id: "dom7b9", name: "7b9", group: "Extended", symbol: "7b9", intervals: ["P1", "M3", "P5", "m7", "m9"] },
  { id: "dom7s9", name: "7#9", group: "Extended", symbol: "7#9", intervals: ["P1", "M3", "P5", "m7", "A9"] },
  { id: "min11", name: "m11", group: "Extended", symbol: "m11", intervals: ["P1", "m3", "P5", "m7", "M9", "P11"] },
  { id: "maj7s11", name: "Maj7#11", group: "Extended", symbol: "Maj7#11", intervals: ["P1", "M3", "P5", "M7", "M9", "A11"] },
  { id: "dom13", name: "13", group: "Extended", symbol: "13", intervals: ["P1", "M3", "P5", "m7", "M9", "M13"] },
  { id: "six9", name: "6/9", group: "Extended", symbol: "6/9", intervals: ["P1", "M3", "P5", "M6", "M9"] },
];

export type Mode = "scale" | "arpeggio";

export function findDef(mode: Mode, id: string): PatternDef {
  const list = mode === "scale" ? SCALES : ARPEGGIOS;
  return list.find((d) => d.id === id) ?? list[0];
}

export function patternTitle(mode: Mode, def: PatternDef, key: string): string {
  if (mode === "scale") return `${key} ${def.name}`;
  return `${key}${def.symbol ?? " " + def.name}`;
}

export type Pattern = {
  rootPc: number;
  /** Jména not ve stupnici (správný pravopis), bez oktávy. */
  notes: string[];
  /** Názvy intervalů od základního tónu (P1 M2 M3 …). */
  degrees: string[];
  semis: number[];
  pcs: Set<number>;
  nameByPc: Map<number, string>;
  degreeByPc: Map<number, string>;
};

export function buildPattern(key: string, def: PatternDef): Pattern {
  const root = parseNote(key);
  const ivs = def.intervals.map(parseInterval);
  const spelled = ivs.map((iv) => transpose(root, iv));
  const nameByPc = new Map<number, string>();
  const degreeByPc = new Map<number, string>();
  const pcs = new Set<number>();
  spelled.forEach((s, i) => {
    const pc = pcOf(s);
    pcs.add(pc);
    if (!nameByPc.has(pc)) nameByPc.set(pc, noteName(s));
    if (!degreeByPc.has(pc)) degreeByPc.set(pc, ivs[i].name);
  });
  return {
    rootPc: pcOf(root),
    notes: spelled.map(noteName),
    degrees: ivs.map((iv) => iv.name),
    semis: ivs.map((iv) => iv.semis),
    pcs,
    nameByPc,
    degreeByPc,
  };
}

/** Výpis not pro horní lištu: stupnice končí oktávou základního tónu ("C D E F G A B C"). */
export function noteBarList(p: Pattern): string[] {
  const within = p.semis.every((s) => s < 12);
  return within ? [...p.notes, p.notes[0]] : [...p.notes];
}

/** Klíče pro výběr tóniny: křížky nad, béčka pod přirozenými tóny. */
export const KEY_ROWS: (string | null)[][] = [
  ["C#", "D#", null, "F#", "G#", "A#", null],
  ["C", "D", "E", "F", "G", "A", "B"],
  [null, "Db", "Eb", null, "Gb", "Ab", "Bb"],
];

/** Ladění harmoniky (posun proti C) — G a níž se ladí dolů, jako u skutečných nástrojů. */
export const HARP_KEYS: { name: string; shift: number }[] = [
  { name: "C", shift: 0 },
  { name: "Db", shift: 1 },
  { name: "D", shift: 2 },
  { name: "Eb", shift: 3 },
  { name: "E", shift: 4 },
  { name: "F", shift: 5 },
  { name: "F#", shift: 6 },
  { name: "G", shift: -5 },
  { name: "Ab", shift: -4 },
  { name: "A", shift: -3 },
  { name: "Bb", shift: -2 },
  { name: "B", shift: -1 },
];

/** Kvintový kruh (dur) s předznamenáním. */
export const CIRCLE = [
  { major: "C", minor: "Am", acc: 0 },
  { major: "G", minor: "Em", acc: 1 },
  { major: "D", minor: "Bm", acc: 2 },
  { major: "A", minor: "F#m", acc: 3 },
  { major: "E", minor: "C#m", acc: 4 },
  { major: "B", minor: "G#m", acc: 5 },
  { major: "F#", minor: "D#m", acc: 6 },
  { major: "Db", minor: "Bbm", acc: -5 },
  { major: "Ab", minor: "Fm", acc: -4 },
  { major: "Eb", minor: "Cm", acc: -3 },
  { major: "Bb", minor: "Gm", acc: -2 },
  { major: "F", minor: "Dm", acc: -1 },
];

export const SHARP_ORDER = ["F#", "C#", "G#", "D#", "A#", "E#", "B#"];
export const FLAT_ORDER = ["Bb", "Eb", "Ab", "Db", "Gb", "Cb", "Fb"];
