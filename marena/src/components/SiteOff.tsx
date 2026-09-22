import Link from "next/link";

// Veřejný web vypnutý správcem — místo hlavní stránky / rezervací se ukáže tohle.
// Serverová komponenta (bez hooků), ať se nic z webu nenačte ani nepřeblikne.
export function SiteOff() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#0b0b0e] px-6 text-center text-white">
      <div className="max-w-md">
        <p className="vegas-neon-gold font-display text-4xl font-extrabold uppercase tracking-[0.12em]">Mařena</p>
        <h1 className="mt-6 font-display text-2xl font-semibold">Web je dočasně vypnutý.</h1>
        <p className="mt-2 text-sm text-white/70">Zkus to prosím později.</p>
        <p className="mt-10 text-xs text-white/35">
          <Link href="/prihlaseni" className="underline-offset-2 hover:underline">
            Správce
          </Link>
        </p>
      </div>
    </main>
  );
}
