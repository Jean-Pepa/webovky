// Nastavení, rutiny a postup v lekcích — vše v localStorage prohlížeče.

import type { Direction } from "./harmonica";
import type { Mode } from "./music";

export type Settings = {
  mode: Mode;
  holes: number;
  harpKey: string;
  tuning: string;
  scaleId: string;
  arpId: string;
  key: string;
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
  holes: 12,
  harpKey: "C",
  tuning: "solo",
  scaleId: "major",
  arpId: "maj7",
  key: "C",
  bpm: 90,
  direction: "both",
  metronome: true,
  startHole: 1,
  endHole: 12,
  repetitions: 1,
  a4: 440,
  labels: "notes",
  tapToPlay: true,
  volume: 0.8,
};

export type Routine = {
  id: string;
  name: string;
  created: number;
  settings: Pick<
    Settings,
    | "mode"
    | "holes"
    | "harpKey"
    | "scaleId"
    | "arpId"
    | "key"
    | "bpm"
    | "direction"
    | "metronome"
    | "startHole"
    | "endHole"
    | "repetitions"
  >;
};

export type LessonProgress = {
  opened: boolean;
  completed: boolean;
  seconds: number;
  interactions: number;
  step: number;
  quiz?: Record<string, number>;
};

const K_SETTINGS = "harmonika:settings:v1";
const K_ROUTINES = "harmonika:routines:v1";
const K_LESSONS = "harmonika:lessons:v1";

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

export function loadSettings(): Settings {
  const s = { ...DEFAULT_SETTINGS, ...read<Partial<Settings>>(K_SETTINGS, {}) };
  if (![10, 12, 14, 16].includes(s.holes)) s.holes = 12;
  s.startHole = Math.min(Math.max(1, s.startHole), s.holes);
  s.endHole = Math.min(Math.max(s.startHole, s.endHole), s.holes);
  return s;
}
export const saveSettings = (s: Settings) => write(K_SETTINGS, s);

export const loadRoutines = (): Routine[] => read<Routine[]>(K_ROUTINES, []);
export const saveRoutines = (r: Routine[]) => write(K_ROUTINES, r);

export const loadLessons = (): Record<string, LessonProgress> => read(K_LESSONS, {});
export const saveLessons = (p: Record<string, LessonProgress>) => write(K_LESSONS, p);

export function routineFrom(s: Settings): Routine["settings"] {
  const { mode, holes, harpKey, scaleId, arpId, key, bpm, direction, metronome, startHole, endHole, repetitions } = s;
  return { mode, holes, harpKey, scaleId, arpId, key, bpm, direction, metronome, startHole, endHole, repetitions };
}

export const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
