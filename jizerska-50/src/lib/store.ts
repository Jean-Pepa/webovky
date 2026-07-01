"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

// Perzistentní úložiště v prohlížeči (localStorage) přes useSyncExternalStore —
// React-idiomatický způsob čtení externího stavu, který navíc drží všechny
// komponenty (i taby prohlížeče) synchronizované. Bez backendu a přihlašování.

const PREFIX = "j50:";

const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  if (typeof window !== "undefined") window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    if (typeof window !== "undefined") window.removeEventListener("storage", cb);
  };
}

function emit() {
  listeners.forEach((l) => l());
}

function readRaw(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(PREFIX + key);
  } catch {
    return null;
  }
}

function writeRaw(key: string, value: string) {
  try {
    window.localStorage.setItem(PREFIX + key, value);
  } catch {
    /* kvóta / privátní režim — tiše ignorujeme */
  }
  emit();
}

function parse<T>(raw: string | null, fallback: T): T {
  if (raw == null) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function useLocalStorage<T>(key: string, initial: T) {
  // getSnapshot vrací syrový string (stabilní primitiv) — parsujeme až v useMemo,
  // jinak by useSyncExternalStore dostával pokaždé nový objekt a zacyklil se.
  const raw = useSyncExternalStore(
    subscribe,
    () => readRaw(key),
    () => null
  );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const value = useMemo<T>(() => parse(raw, initial), [raw]);

  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );

  const update = useCallback(
    (next: T | ((prev: T) => T)) => {
      const current = parse(readRaw(key), initial);
      const resolved = typeof next === "function" ? (next as (p: T) => T)(current) : next;
      writeRaw(key, JSON.stringify(resolved));
    },
    // initial se v praxi nemění (literál) — držíme závislost na klíči
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key]
  );

  return [value, update, hydrated] as const;
}

// Jednoduchý „už jsme na klientu" flag bez setState v efektu.
export function useMounted(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

// Index dne (UTC) — čteme aktuální čas mimo tělo renderu (v getSnapshot callbacku),
// s denní granularitou, aby se snapshot neměnil každý ms a nezacyklil render.
const noopSubscribe = () => () => {};
const getDayIndex = () => Math.floor(Date.now() / 86400000);
const getDayServer = (): number | null => null;

// Vrací počet dní od 1. 1. 1970 (UTC) pro dnešek, nebo null při SSR.
export function useDayIndex(): number | null {
  return useSyncExternalStore(noopSubscribe, getDayIndex, getDayServer);
}

// ---- Typované pomocné hooky --------------------------------------------------

export interface WeightEntry {
  date: string; // YYYY-MM-DD
  kg: number;
}

export function useDoneSessions() {
  const [done, setDone, hydrated] = useLocalStorage<string[]>("done", []);
  const toggle = useCallback(
    (id: string) =>
      setDone((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])),
    [setDone]
  );
  return { done, toggle, hydrated };
}

export function useWeightLog() {
  return useLocalStorage<WeightEntry[]>("weightLog", []);
}
