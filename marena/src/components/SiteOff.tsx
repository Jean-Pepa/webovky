import Link from "next/link";

// Veřejný web vypnutý správcem — místo hlavní stránky / rezervací se ukáže tohle.
// Klidná obrazovka ve stylu systémových hlášek iOS: ikona, tučný nadpis, šedý
// podtitulek. Serverová komponenta (bez hooků). Barvy podle
// systémového světlého / tmavého režimu (třídy .siteoff* v globals.css).
export function SiteOff() {
  return (
    <main className="siteoff relative grid min-h-screen place-items-center px-6 text-center">
      {/* Vstup pro správce vpravo nahoře (kde je na hlavní stránce přihlášení) — jen malé
          prázdné, skoro neviditelné kolečko; plocha na ťuknutí je větší než kolečko. */}
      <Link
        href="/prihlaseni"
        aria-label="Správce"
        className="absolute right-3 top-[calc(0.75rem+env(safe-area-inset-top))] grid h-11 w-11 place-items-center"
      >
        <span className="siteoff-sub block h-3.5 w-3.5 rounded-full border border-current opacity-20" aria-hidden />
      </Link>
      <div className="w-full max-w-xs">
        <div className="siteoff-icon mx-auto grid h-20 w-20 place-items-center rounded-full">
          {/* klíč + šroubovák (údržba) */}
          <svg viewBox="0 0 24 24" className="siteoff-sub h-9 w-9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
          </svg>
        </div>
        <h1 className="mt-6 text-[22px] font-semibold tracking-tight">Web je dočasně nefunkční</h1>
        <p className="siteoff-sub mt-2 text-[15px] leading-snug">Pracujeme na tom. Zkus to prosím za chvíli.</p>
      </div>
    </main>
  );
}
