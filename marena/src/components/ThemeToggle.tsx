"use client";

import { useEffect, useState } from "react";

const KEY = "marena_theme";

function readStoredDark(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(KEY) === "dark";
  } catch {
    return false;
  }
}

function applyThemeClass(dark: boolean) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", dark);
}

// Noční režim jen pro zázemí. Volbu držíme v localStorage, třídu `.dark` dáváme
// na <html> (kvůli modálům, které se přes portál renderují do <body>).
// Při odchodu ze zázemí třídu sundáme, aby veřejná homepage zůstala světlá.
export function useZazemiTheme() {
  const [dark, setDark] = useState<boolean>(readStoredDark);

  useEffect(() => {
    applyThemeClass(dark);
  }, [dark]);

  useEffect(() => {
    // Úklid při odchodu ze zázemí (odmountování layoutu).
    return () => applyThemeClass(false);
  }, []);

  function toggle() {
    setDark((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(KEY, next ? "dark" : "light");
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

  return { dark, toggle };
}

export function ThemeToggle({ dark, onToggle, className = "" }: { dark: boolean; onToggle: () => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={dark ? "Přepnout na denní režim" : "Přepnout na noční režim"}
      title={dark ? "Denní režim" : "Noční režim"}
      className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink-soft ring-1 ring-ink/10 transition hover:bg-ink/5 hover:text-ink ${className}`}
    >
      {dark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

function MoonIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20 14.5A8 8 0 0 1 9.5 4a7 7 0 1 0 10.5 10.5Z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}
