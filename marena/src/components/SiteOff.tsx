import Link from "next/link";

// Veřejný web vypnutý správcem — místo hlavní stránky / rezervací se ukáže tohle.
// Klidná obrazovka ve stylu systémových hlášek iOS: ikona, tučný nadpis, šedý
// podtitulek. Serverová komponenta (bez hooků). Barvy podle
// systémového světlého / tmavého režimu (třídy .siteoff* v globals.css).
export function SiteOff() {
  return (
    <main className="siteoff grid min-h-screen place-items-center px-6 text-center">
      <div className="w-full max-w-xs">
        <div className="siteoff-icon mx-auto grid h-20 w-20 place-items-center rounded-full">
          {/* klíč + šroubovák (údržba) */}
          <svg viewBox="0 0 24 24" className="siteoff-sub h-9 w-9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
          </svg>
        </div>
        <h1 className="mt-6 text-[22px] font-semibold tracking-tight">Web je dočasně nefunkční</h1>
        <p className="siteoff-sub mt-2 text-[15px] leading-snug">Pracujeme na tom. Zkus to prosím za chvíli.</p>
        <p className="siteoff-sub mt-12 text-xs">
          <Link href="/prihlaseni" className="underline-offset-2 hover:underline">
            Správce
          </Link>
        </p>
      </div>
    </main>
  );
}
