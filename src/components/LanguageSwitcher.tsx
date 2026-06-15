"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { CzFlag, GbFlag, DeFlag } from "./Icons";
import { useI18n, type Lang } from "@/i18n/context";

const LANGS: { code: Lang; label: string; Flag: typeof CzFlag }[] = [
  { code: "cs", label: "Čeština", Flag: CzFlag },
  { code: "en", label: "English", Flag: GbFlag },
  { code: "de", label: "Deutsch", Flag: DeFlag },
];

export default function LanguageSwitcher() {
  const { lang } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  function switchTo(code: Lang) {
    // odstraň stávající jazykový prefix
    let path = pathname || "/";
    if (path.startsWith("/en") || path.startsWith("/de")) {
      path = path.slice(3) || "/";
    }
    const target = code === "cs" ? path : `/${code}${path === "/" ? "" : path}`;
    setOpen(false);
    router.push(target);
  }

  const Active = LANGS.find((l) => l.code === lang)!.Flag;
  const ordered = [
    ...LANGS.filter((l) => l.code === lang),
    ...LANGS.filter((l) => l.code !== lang),
  ];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="grid place-items-center w-10 h-10 rounded-lg hover:bg-[var(--color-bg)]"
        aria-label="Change language"
        aria-expanded={open}
      >
        <Active className="w-6 h-6" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-[var(--color-border)] rounded-xl shadow-xl py-1.5 z-50">
          {ordered.map(({ code, label, Flag }) => (
            <button
              key={code}
              onClick={() => switchTo(code)}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-[var(--color-bg)] ${
                code === lang ? "font-semibold" : ""
              }`}
            >
              <Flag className="w-5 h-5" />
              <span>{label}</span>
              {code === lang && <span className="ml-auto text-[var(--color-accent)]">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
