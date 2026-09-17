"use client";

import { useEffect } from "react";

// Po nasazení nové verze si otevřená appka (hlavně zázemí připnuté na ploše
// telefonu, které se nikdy „neobnoví") sama načte nový kód: při návratu do
// aplikace a pak každých 5 minut se zeptá /api/version; když se otisk liší,
// stránku obnoví — ale ne uprostřed psaní (když je aktivní nějaké pole).
const MINE = process.env.NEXT_PUBLIC_BUILD_ID ?? "dev";
const EVERY = 5 * 60 * 1000;

export function VersionWatcher() {
  useEffect(() => {
    if (MINE === "dev") return; // lokální vývoj
    let pending = false;
    const typing = () => {
      const el = document.activeElement;
      return !!el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || (el as HTMLElement).isContentEditable);
    };
    const reloadIfIdle = () => {
      if (typing()) {
        pending = true; // zkusí to znovu, až člověk dopíše (blur) nebo při další kontrole
        return;
      }
      window.location.reload();
    };
    const check = async () => {
      if (document.hidden) return;
      try {
        const res = await fetch("/api/version", { cache: "no-store" });
        if (!res.ok) return;
        const { v } = (await res.json()) as { v?: string };
        if (v && v !== MINE) reloadIfIdle();
      } catch {
        /* offline — příště */
      }
    };
    const onVisible = () => {
      if (!document.hidden) void check();
    };
    const onBlur = () => {
      if (pending) reloadIfIdle();
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focusout", onBlur);
    const t = window.setInterval(check, EVERY);
    void check();
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focusout", onBlur);
      window.clearInterval(t);
    };
  }, []);
  return null;
}
