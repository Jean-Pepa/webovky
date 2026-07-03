"use client";

import { useEffect, useState } from "react";

const KEY = "marena_theme";

// Tři stavy motivu: "system" (řídí se telefonem — výchozí, dle NN/g lidi řeší
// tmu na úrovni OS), "dark" a "light" (ruční přepnutí). Volba drží v localStorage;
// "system" se ukládá jako smazaný klíč, ať starší hodnoty dál fungují.
export type ThemeMode = "system" | "light" | "dark";

function readMode(): ThemeMode {
  if (typeof window === "undefined") return "system";
  try {
    const v = localStorage.getItem(KEY);
    return v === "dark" || v === "light" ? v : "system";
  } catch {
    return "system";
  }
}

function systemDark(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function isDarkFor(mode: ThemeMode): boolean {
  return mode === "dark" || (mode === "system" && systemDark());
}

function applyThemeClass(dark: boolean) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", dark);
}

// Motiv zázemí. Třídu `.dark` dáváme na <html> (kvůli modálům přes portál);
// při odchodu ze zázemí ji sundáme, aby veřejná homepage zůstala světlá.
export function useZazemiTheme() {
  const [mode, setMode] = useState<ThemeMode>(readMode);

  // Aplikuj motiv + v režimu „system" sleduj změny nastavení telefonu.
  useEffect(() => {
    applyThemeClass(isDarkFor(mode));
    if (mode !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyThemeClass(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [mode]);

  useEffect(() => {
    // Úklid při odchodu ze zázemí (odmountování layoutu).
    return () => applyThemeClass(false);
  }, []);

  function cycle() {
    setMode((prev) => {
      // system → noc → den → system (první klik z výchozího stavu zapne noc)
      const next: ThemeMode = prev === "system" ? "dark" : prev === "dark" ? "light" : "system";
      try {
        if (next === "system") localStorage.removeItem(KEY);
        else localStorage.setItem(KEY, next);
      } catch {
        /* ignore */
      }
      // Jemný barevný přechod jen při ručním přepnutí.
      const el = document.documentElement;
      el.classList.add("theme-anim");
      window.setTimeout(() => el.classList.remove("theme-anim"), 400);
      return next;
    });
  }

  return { mode, dark: isDarkFor(mode), cycle };
}

const LABELS: Record<ThemeMode, string> = {
  system: "Motiv: podle telefonu — klikni pro noční",
  dark: "Motiv: noční — klikni pro denní",
  light: "Motiv: denní — klikni pro režim podle telefonu",
};

export function ThemeToggle({ mode, onCycle, className = "" }: { mode: ThemeMode; onCycle: () => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={onCycle}
      aria-label={LABELS[mode]}
      title={LABELS[mode]}
      className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink-soft ring-1 ring-ink/10 transition hover:bg-ink/5 hover:text-ink ${className}`}
    >
      {mode === "system" ? <AutoIcon /> : mode === "dark" ? <MoonIcon /> : <SunIcon />}
    </button>
  );
}

function MoonIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

// „Auto" — půl slunce / půl měsíc: kroužek s vyplněnou pravou polovinou.
function AutoIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 4a8 8 0 0 1 0 16Z" fill="currentColor" stroke="none" />
    </svg>
  );
}
