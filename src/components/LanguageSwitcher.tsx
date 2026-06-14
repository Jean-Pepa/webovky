"use client";

import { useEffect, useRef, useState } from "react";
import { CzFlag, GbFlag, DeFlag } from "./Icons";

type Lang = "cs" | "en" | "de";

const LANGS: { code: Lang; label: string; Flag: typeof CzFlag }[] = [
  { code: "cs", label: "Čeština", Flag: CzFlag },
  { code: "en", label: "English", Flag: GbFlag },
  { code: "de", label: "Deutsch", Flag: DeFlag },
];

export default function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<Lang>("cs");
  const ref = useRef<HTMLDivElement>(null);

  // zavřít při kliknutí mimo
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const Active = LANGS.find((l) => l.code === current)!.Flag;

  // pořadí: aktivní nahoře, pak ostatní
  const ordered = [
    ...LANGS.filter((l) => l.code === current),
    ...LANGS.filter((l) => l.code !== current),
  ];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="grid place-items-center w-10 h-10 rounded-lg hover:bg-[var(--color-bg)]"
        aria-label="Změnit jazyk"
        aria-expanded={open}
      >
        <Active className="w-6 h-6" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-[var(--color-border)] rounded-xl shadow-xl py-1.5 z-50">
          {ordered.map(({ code, label, Flag }) => (
            <button
              key={code}
              onClick={() => {
                setCurrent(code);
                setOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-[var(--color-bg)] ${
                code === current ? "font-semibold" : ""
              }`}
            >
              <Flag className="w-5 h-5" />
              <span>{label}</span>
              {code === current && (
                <span className="ml-auto text-[var(--color-accent)]">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
