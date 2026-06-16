"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const KEY = "bulo-cookies";

export function CookieConsent() {
  const [open, setOpen] = useState(false);
  const [statistics, setStatistics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const c = JSON.parse(raw) as { statistics?: boolean; marketing?: boolean };
        setStatistics(!!c.statistics);
        setMarketing(!!c.marketing);
      } else {
        setOpen(true); // první návštěva → otevřít volbu
      }
    } catch {
      // ignore
    }
  }, []);

  function persist(stats: boolean, mkt: boolean) {
    try {
      localStorage.setItem(
        KEY,
        JSON.stringify({ necessary: true, statistics: stats, marketing: mkt, ts: Date.now() }),
      );
    } catch {
      // ignore
    }
    setStatistics(stats);
    setMarketing(mkt);
    setOpen(false);
  }

  return (
    <>
      {/* Stálý chip vlevo dole */}
      <div className="no-print fixed bottom-4 left-4 z-40 flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3 py-2 text-xs font-medium text-stone-600 shadow-md">
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-1.5 transition hover:text-stone-900"
        >
          <span aria-hidden>🍪</span> Cookies
        </button>
        <span className="text-stone-300">·</span>
        <Link href="/zasady" className="transition hover:text-stone-900">
          Zásady
        </Link>
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setOpen(false)} />
          <div className="card relative w-full max-w-md p-6">
            <h2 className="text-lg font-semibold text-stone-900">Cookies a soukromí</h2>
            <p className="mt-2 text-sm leading-relaxed text-stone-500">
              Nezbytné cookies jedou vždy, aby web fungoval. Se souhlasem k tomu přidáme vlastní
              měření návštěvnosti — pomáhá nám web vylepšovat. Změnit nebo odvolat to můžeš kdykoli.
            </p>
            <Link
              href="/zasady"
              className="mt-3 inline-block text-sm font-medium text-brass hover:underline"
            >
              Více v zásadách ochrany soukromí →
            </Link>

            <div className="mt-4 space-y-4 border-t border-stone-100 pt-4">
              <label className="flex gap-3">
                <input
                  type="checkbox"
                  checked
                  readOnly
                  disabled
                  className="mt-0.5 h-4 w-4 accent-teal-700"
                />
                <span>
                  <span className="block text-sm font-medium text-stone-800">
                    Nezbytné <span className="text-xs font-normal text-stone-400">· Vždy zapnuto</span>
                  </span>
                  <span className="text-xs text-stone-500">
                    Provoz webu, bezpečnost, záznam tvé volby. Nelze vypnout.
                  </span>
                </span>
              </label>

              <label className="flex gap-3">
                <input
                  type="checkbox"
                  checked={statistics}
                  onChange={(e) => setStatistics(e.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-teal-700"
                />
                <span>
                  <span className="block text-sm font-medium text-stone-800">Statistiky</span>
                  <span className="text-xs text-stone-500">
                    Naše vlastní měření návštěvnosti (bez třetích stran).
                  </span>
                </span>
              </label>

              <label className="flex gap-3">
                <input
                  type="checkbox"
                  checked={marketing}
                  onChange={(e) => setMarketing(e.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-teal-700"
                />
                <span>
                  <span className="block text-sm font-medium text-stone-800">Marketing</span>
                  <span className="text-xs text-stone-500">
                    Měření reklam a interaktivní mapy třetích stran.
                  </span>
                </span>
              </label>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => persist(true, true)} className="btn-secondary btn-sm">
                Přijmout vše
              </button>
              <button onClick={() => persist(statistics, marketing)} className="btn-primary btn-sm">
                Uložit volbu
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
