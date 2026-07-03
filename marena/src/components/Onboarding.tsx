"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Icon, type IconName } from "@/components/Icons";

const KEY = "marena_onboarded_v1";

const STEPS: { icon: IconName; title: string; text: string }[] = [
  { icon: "users", title: "Vyber si roli", text: "V „Tým & role“ klikni na svůj post — uvidíš rovnou úkoly, co k němu patří." },
  { icon: "board", title: "Sleduj Nástěnku", text: "Hlavní kanál — důležité info od ostatních na jednom místě." },
  { icon: "ops", title: "Přihlas se na směny", text: "V „Provoz & směny“ se jedním klikem zapíšeš na bar, vaření i nákupy." },
  { icon: "vote", title: "Rozhoduj s týmem", text: "Hlasování řeší rozhodnutí, v Kalendáři jsou termíny, ve Financích peníze." },
];

// Uvítací průvodce pro nové lidi (každý rok ~30 nováčků). Zavře se jednou a pak
// se už neukáže (uloženo v prohlížeči).
export function Onboarding() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // jednorázové načtení z localStorage po mountu (na serveru se nic neukáže)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShow(localStorage.getItem(KEY) !== "1");
  }, []);

  if (!show) return null;

  function dismiss() {
    localStorage.setItem(KEY, "1");
    setShow(false);
  }

  return (
    <div className="card relative overflow-hidden border-gold-200 bg-gradient-to-br from-gold-50 to-surface p-5">
      <button onClick={dismiss} className="absolute right-4 top-4 text-ink-soft/60 hover:text-ink" aria-label="Zavřít">
        ✕
      </button>
      <div className="flex items-center gap-2">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-gold-500 text-[#1d1d1f]">
          <Icon name="spark" className="h-5 w-5" />
        </span>
        <div>
          <h2 className="font-display text-[20px] font-semibold tracking-tight">Vítej v zázemí Mařeny</h2>
          <p className="text-sm text-ink-soft">Hlavní místo, kde běží celá organizace. Ve čtyřech krocích jsi v obraze:</p>
        </div>
      </div>

      <div className="mt-3 rounded-xl border border-gold-200 bg-surface/70 p-3">
        <p className="text-sm font-semibold text-ink">Všechno na jednom místě — žádné další platformy.</p>
        <p className="mt-0.5 text-xs text-ink-soft">
          Konec hledání po Messengeru, WhatsAppu, mailech, Excelech a skupinách. Tým, nástěnka, směny, hlasování,
          kalendář, finance, kontakty i merch — všechno řešíme tady. Jeden odkaz, jeden přehled.
        </p>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((s, i) => (
          <div key={s.title} className="rounded-xl border border-ink/[0.06] bg-white p-3">
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-paper2 text-ink">
                <Icon name={s.icon} className="h-4 w-4" />
              </span>
              <span className="text-xs font-semibold text-gold-700">{i + 1}.</span>
            </div>
            <h3 className="mt-2 text-sm font-semibold">{s.title}</h3>
            <p className="mt-0.5 text-xs text-ink-soft">{s.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Link href="/zazemi/tym" className="btn-primary" onClick={dismiss}>
          Jdu si vybrat roli
        </Link>
        <Link href="/zazemi/almanach" className="btn-secondary">
          Otevřít almanach
        </Link>
        <button onClick={dismiss} className="btn-ghost">
          Rozumím, skrýt
        </button>
      </div>
    </div>
  );
}
