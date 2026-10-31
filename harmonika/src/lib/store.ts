// Nastavení, rutiny a postup v lekcích — vše v localStorage prohlížeče.

import { HOLES, type Direction } from "./harmonica";

export type AppMode = "scale" | "arpeggio" | "song";

export type Settings = {
  mode: AppMode;
  harpKey: string;
  tuning: string;
  scaleId: string;
  arpId: string;
  key: string;
  songId: string;
  /** Tónina písničky (null = původní). */
  songKey: string | null;
  /** Při ▶ hraje melodie (vypnuto = jen zvýraznění a metronom, hraješ ty). */
  songSound: boolean;
  bpm: number;
  direction: Direction;
  /** Kliky metronomu během přehrávání (přepínač v Playback Options). */
  metronome: boolean;
  startHole: number;
  endHole: number;
  repetitions: number;
  a4: number;
  labels: "notes" | "degrees";
  tapToPlay: boolean;
  volume: number;
};

export const DEFAULT_SETTINGS: Settings = {
  mode: "scale",
  harpKey: "C",
  tuning: "solo",
  scaleId: "major",
  arpId: "maj7",
  key: "C",
  songId: "twinkle",
  songKey: null,
  songSound: true,
  bpm: 90,
  direction: "both",
  metronome: true,
  startHole: 1,
  endHole: HOLES,
  repetitions: 1,
  a4: 440,
  labels: "notes",
  tapToPlay: true,
  volume: 0.8,
};

const ROUTINE_KEYS = [
  "mode",
  "harpKey",
  "scaleId",
  "arpId",
  "key",
  "songId",
  "songKey",
  "bpm",
  "direction",
  "metronome",
  "startHole",
  "endHole",
  "repetitions",
] as const;

export type Routine = {
  id: string;
  name: string;
  created: number;
  settings: Partial<Pick<Settings, (typeof ROUTINE_KEYS)[number]>>;
};

export type LessonProgress = {
  opened: boolean;
  completed: boolean;
  seconds: number;
  interactions: number;
  step: number;
  quiz?: Record<string, number>;
};

/** Nejlepší výsledek procvičování písničky. */
export type SongScore = { best: number; plays: number };

const K_SETTINGS = "harmonika:settings:v1";
const K_ROUTINES = "harmonika:routines:v1";
const K_LESSONS = "harmonika:lessons:v1";
const K_SONGS = "harmonika:songs:v1";

function read<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* soukromé okno / plné úložiště – appka jede dál bez uložení */
  }
}

/** Pojistka pro data z localStorage nebo ze starších verzí (např. 16 dírek). */
export function sanitize(s: Settings): Settings {
  const out = { ...s };
  if (!["scale", "arpeggio", "song"].includes(out.mode)) out.mode = "scale";
  out.startHole = Math.min(Math.max(1, Math.round(out.startHole) || 1), HOLES);
  out.endHole = Math.min(Math.max(out.startHole, Math.round(out.endHole) || HOLES), HOLES);
  out.repetitions = Math.min(Math.max(1, Math.round(out.repetitions) || 1), 20);
  out.bpm = Math.min(Math.max(20, Math.round(out.bpm) || 90), 240);
  return out;
}

export function loadSettings(): Settings {
  const raw = read<Partial<Settings> & { holes?: number }>(K_SETTINGS, {});
  delete raw.holes;
  return sanitize({ ...DEFAULT_SETTINGS, ...raw });
}
export const saveSettings = (s: Settings) => write(K_SETTINGS, s);

export const loadRoutines = (): Routine[] => read<Routine[]>(K_ROUTINES, []);
export const saveRoutines = (r: Routine[]) => write(K_ROUTINES, r);

export const loadLessons = (): Record<string, LessonProgress> => read(K_LESSONS, {});
export const saveLessons = (p: Record<string, LessonProgress>) => write(K_LESSONS, p);

export const loadSongScores = (): Record<string, SongScore> => read(K_SONGS, {});
export const saveSongScores = (p: Record<string, SongScore>) => write(K_SONGS, p);

export function routineFrom(s: Settings): Routine["settings"] {
  const out: Routine["settings"] = {};
  for (const k of ROUTINE_KEYS) (out as Record<string, unknown>)[k] = s[k];
  return out;
}

export const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
