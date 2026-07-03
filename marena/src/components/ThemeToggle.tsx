"use client";

import { useEffect, useState } from "react";

const KEY = "marena_theme";

// Přepínač den/noc — jen dvě polohy. Dokud si člověk nevybere, výchozí motiv
// se tiše řídí nastavením telefonu (prefers-color-scheme); první kliknutí
// uloží výslovnou volbu a od té chvíle platí ona.
function storedTheme(): "light" | "dark" | null {
  if (typeof window === "undefined") return null;
  try {
    const v = localStorage.getItem(KEY);
    return v === "dark" || v === "light" ? v : null;
  } catch {
    return null;
  }
}

function systemDark(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function effectiveDark(): boolean {
  const stored = storedTheme();
  return stored ? stored === "dark" : systemDark();
}

function applyThemeClass(dark: boolean) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", dark);
}

// Motiv zázemí. Třídu `.dark` dáváme na <html> (kvůli modálům přes portál);
// při odchodu ze zázemí ji sundáme, aby veřejná homepage zůstala světlá.
export function useZazemiTheme() {
  const [dark, setDark] = useState<boolean>(effectiveDark);

  useEffect(() => {
    applyThemeClass(dark);
  }, [dark]);

  // Bez uložené volby sleduj změny nastavení telefonu za běhu.
  useEffect(() => {
    if (storedTheme()) return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setDark(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

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
