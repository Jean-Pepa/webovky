"use client";

import { useEffect, useState } from "react";
import Link from "@/components/LocLink";
import { useI18n } from "@/i18n/context";

const STORAGE_KEY = "eika_cookie_consent";

type Consent = {
  necessary: true;
  stats: boolean;
  marketing: boolean;
  ts: number;
};

function readConsent(): Consent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Consent) : null;
  } catch {
    return null;
  }
}

export default function CookieConsent() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [stats, setStats] = useState(false);
  const [marketing, setMarketing] = useState(false);

  // Po načtení zjistíme, zda už uživatel volbu uložil
  useEffect(() => {
    const c = readConsent();
    if (!c) {
      setOpen(true);
    } else {
      setStats(c.stats);
      setMarketing(c.marketing);
    }
    // Otevření z patičky / plovoucí ikony
    const reopen = () => setOpen(true);
    window.addEventListener("eika:open-cookies", reopen);
    return () => window.removeEventListener("eika:open-cookies", reopen);
  }, []);

  function persist(s: boolean, m: boolean) {
    const data: Consent = { necessary: true, stats: s, marketing: m, ts: Date.now() };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      /* localStorage nedostupné – ignorujeme */
    }
    setStats(s);
    setMarketing(m);
    setOpen(false);
  }

  return (
    <>
      {/* Plovoucí ikona vlevo dole – znovuotevření nastavení */}
      <div className="fixed bottom-4 left-4 z-[60] flex items-center gap-1 rounded-full bg-white shadow-lg border border-[var(--color-border)] px-3 py-1.5 text-xs">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex items-center gap-1.5 font-medium text-[var(--color-ink)] hover:text-[var(--color-accent)]"
        >
          <span aria-hidden>🍪</span>
          {t("cookie.pill")}
        </button>
        <span className="text-[var(--color-border)]">·</span>
        <Link href="/ochrana-osobnich-udaju" className="underline text-[var(--color-ink-soft)] hover:text-[var(--color-accent)]">
          {t("cookie.pillLink")}
        </Link>
      </div>

      {open && (
        <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => readConsent() && setOpen(false)} />
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
            <h2 className="text-xl font-bold text-[var(--color-ink)]">{t("cookie.title")}</h2>
            <p className="mt-2 text-sm text-[var(--color-ink-soft)] leading-relaxed">{t("cookie.intro")}</p>
            <Link
              href="/ochrana-osobnich-udaju"
              className="mt-3 inline-block text-sm font-semibold"
              style={{ color: "var(--color-accent)" }}
            >
              {t("cookie.more")}
            </Link>

            <div className="mt-5 border-t border-[var(--color-border)] divide-y divide-[var(--color-border)]">
              {/* Nezbytné */}
              <label className="flex items-start gap-3 py-4 cursor-default">
                <input type="checkbox" checked disabled className="mt-0.5 h-4 w-4 accent-[var(--color-accent)]" />
                <span>
                  <span className="font-semibold text-[var(--color-ink)]">
                    {t("cookie.necessary")}{" "}
                    <span className="ml-1 text-xs font-normal text-[var(--color-ink-soft)]">{t("cookie.necessaryAlways")}</span>
                  </span>
                  <span className="block text-sm text-[var(--color-ink-soft)]">{t("cookie.necessaryDesc")}</span>
                </span>
              </label>

              {/* Statistiky */}
              <label className="flex items-start gap-3 py-4 cursor-pointer">
                <input type="checkbox" checked={stats} onChange={(e) => setStats(e.target.checked)} className="mt-0.5 h-4 w-4 accent-[var(--color-accent)]" />
                <span>
                  <span className="font-semibold text-[var(--color-ink)]">{t("cookie.stats")}</span>
                  <span className="block text-sm text-[var(--color-ink-soft)]">{t("cookie.statsDesc")}</span>
                </span>
              </label>

              {/* Marketing */}
              <label className="flex items-start gap-3 py-4 cursor-pointer">
                <input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} className="mt-0.5 h-4 w-4 accent-[var(--color-accent)]" />
                <span>
                  <span className="font-semibold text-[var(--color-ink)]">{t("cookie.marketing")}</span>
                  <span className="block text-sm text-[var(--color-ink-soft)]">{t("cookie.marketingDesc")}</span>
                </span>
              </label>
            </div>

            <div className="mt-5 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
              <button
                type="button"
                onClick={() => persist(stats, marketing)}
                className="px-6 py-2.5 rounded-full font-semibold text-white"
                style={{ background: "var(--color-steel-900)" }}
              >
                {t("cookie.save")}
              </button>
              <button
                type="button"
                onClick={() => persist(true, true)}
                className="px-6 py-2.5 rounded-full font-semibold text-white"
                style={{ background: "var(--color-accent)" }}
              >
                {t("cookie.acceptAll")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
