"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { DEFAULT_LANG, LANG_COOKIE, t as translate, unit as unitFn, type Lang } from "./messages";

interface Ctx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
  unit: (u: string) => string;
}

const I18nContext = createContext<Ctx | null>(null);

export function I18nProvider({
  initial,
  children,
}: {
  initial: Lang;
  children: ReactNode;
}) {
  const [lang, setLangState] = useState<Lang>(initial);
  const router = useRouter();

  function setLang(l: Lang) {
    setLangState(l);
    document.cookie = `${LANG_COOKIE}=${l}; path=/; max-age=31536000`;
    router.refresh(); // překreslí serverové komponenty s novým jazykem
  }

  const value: Ctx = {
    lang,
    setLang,
    t: (key, vars) => translate(lang, key, vars),
    unit: (u) => unitFn(lang, u),
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): Ctx {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}

export { DEFAULT_LANG };
export type { Lang };
