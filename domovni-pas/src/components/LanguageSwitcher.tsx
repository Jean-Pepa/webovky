"use client";

import { useEffect, useRef, useState } from "react";
import { useLang, LANGS } from "@/lib/i18n";
import { IconGlobe, IconChevronDown } from "@/components/Icons";

export function LanguageSwitcher({ light = false }: { light?: boolean }) {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = LANGS.find((l) => l.lang === lang) ?? LANGS[0];

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const trigger = light
    ? "border-white/25 text-white/90 hover:bg-white/10"
    : "border-stone-300 text-stone-700 hover:bg-stone-50";

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition ${trigger}`}
        aria-label="Jazyk"
      >
        <IconGlobe className="h-4 w-4" />
        <span>{current.country}</span>
        <span className="opacity-60">{current.code}</span>
        <IconChevronDown className="h-3.5 w-3.5 opacity-70" />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-stone-200 bg-white py-1 text-stone-800 shadow-xl">
          {LANGS.map((l) => {
            const active = l.lang === lang;
            return (
              <button
                key={l.lang}
                onClick={() => {
                  setLang(l.lang);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-3 px-3 py-2 text-sm transition hover:bg-stone-50 ${
                  active ? "bg-teal-50" : ""
                }`}
              >
                <span
                  className={`w-7 text-xs font-semibold ${active ? "text-teal-700" : "text-stone-500"}`}
                >
                  {l.country}
                </span>
                <span className={`flex-1 text-left ${active ? "font-medium text-teal-800" : ""}`}>
                  {l.name}
                </span>
                <span className="text-xs text-stone-400">{l.code}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
