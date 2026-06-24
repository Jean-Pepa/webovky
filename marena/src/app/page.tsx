import Link from "next/link";
import { Mascot } from "@/components/Mascot";
import { Logo } from "@/components/Logo";
import { ROLES } from "@/lib/roles";

const WEEK = [
  { emoji: "🎓", title: "Přednášky", text: "Hosté z praxe i ze zahraničí, klasika ve velké aule. Max 2–3 denně od 17:00." },
  { emoji: "🎭", title: "Program", text: "Workshopy, dílny, promítání, Vlaštovkiáda, Formát 400 a fašák." },
  { emoji: "🍺", title: "Bar na dvoře", text: "Společný hub festivalu — pivo, jídlo, merch i lístky na jednom místě." },
  { emoji: "🎸", title: "Večery", text: "Kapely a DJs na dvoře a v Arše, dokud to noční klid dovolí." },
  { emoji: "🚩", title: "Průvod městem", text: "Poslední den. Maskota nesou prváci, zastávky u významných staveb." },
  { emoji: "🌟", title: "Křest na Flédě", text: "Velký finiš — pasování prváků a koncert do brzkých ranních hodin." },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hlavička */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
        <Logo />
        <nav className="flex items-center gap-1">
          <Link href="/almanach" className="btn-ghost">📖 Almanach</Link>
          <Link href="/prihlaseni" className="btn-primary">Vstoupit do zázemí</Link>
        </nav>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="paper-grain absolute inset-0 -z-10 opacity-60" />
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 pb-14 pt-6 md:grid-cols-2 md:pt-12">
          <div>
            <span className="chip bg-marigold-100 text-marigold-800">studentský festival · fakulta architektury</span>
            <h1 className="mt-4 font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-6xl">
              Mařena
            </h1>
            <p className="mt-4 max-w-md text-lg text-ink-soft">
              Nejlepší, nejšílenější a nejnáročnější studentská akce na fakultě. Týden přednášek,
              programu a baru na dvoře, zakončený průvodem městem a křtem prváků na Flédě.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/prihlaseni" className="btn-primary px-6 py-3 text-base">
                Vstoupit do zázemí →
              </Link>
              <Link href="/almanach" className="btn-secondary px-6 py-3 text-base">
                Přečíst almanach
              </Link>
            </div>
            <p className="mt-4 font-display text-sm italic text-plum-600">
              „Kolik Mařeny je dost Mařeny? Mařeny není nikdy dost.“
            </p>
          </div>

          <div className="relative grid place-items-center">
            <div className="absolute h-72 w-72 rounded-full bg-marigold-200/50 blur-3xl" />
            <div className="relative">
              <Mascot size={300} wave />
            </div>
          </div>
        </div>
      </section>

      {/* CO JE MAŘENA */}
      <section className="bg-white">
        <div className="mx-auto max-w-5xl px-4 py-14">
          <h2 className="font-display text-3xl font-semibold">Co je Mařena?</h2>
          <div className="mt-4 grid gap-6 text-ink-soft md:grid-cols-2">
            <p>
              Mařena je studentský festival pořádaný a organizovaný čistě studenty — fakulta ho jen
              zastřešuje. Trvá zhruba 7–10 dní, nejčastěji na přelomu září a října, kdy je ještě teplo.
              Škola se na týden promění: zóny ozdobené do společného tématu, přednášky hostů, workshopy,
              koncerty a velký bar na dvoře.
            </p>
            <p>
              Vyvrcholením je <strong className="text-ink">průvod městem</strong> s maskotem v čele, který
              prváci donesou až do klubu <strong className="text-ink">Fléda</strong>, kde proběhne tradiční
              křest prvního ročníku. Je to půl roku příprav, stovky e-mailů a spousta práce — ale taky
              obrovská sranda a nejlepší vzpomínka na školu.
            </p>
          </div>
        </div>
      </section>

      {/* TÝDEN */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="font-display text-3xl font-semibold">Jak vypadá týden Mařeny</h2>
        <p className="mt-1 text-ink-soft">Od příprav až po pasování na Flédě.</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {WEEK.map((w, i) => (
            <div key={w.title} className="card p-5 transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-paper2 text-2xl">{w.emoji}</span>
                <span className="text-xs font-semibold uppercase tracking-wide text-marigold-700">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-3 font-display text-lg font-semibold">{w.title}</h3>
              <p className="mt-1 text-sm text-ink-soft">{w.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* POSTY */}
      <section className="bg-plum-700 text-white">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="font-display text-3xl font-semibold">Každý má svůj post</h2>
          <p className="mt-1 max-w-2xl text-white/70">
            Organizace stojí na rolích vybraných podle manuálu. V zázemí si svůj post vybereš a uvidíš,
            co obnáší — od financí přes výzdobu až po průvod a Flédu.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {ROLES.map((r) => (
              <span key={r.id} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-2 text-sm ring-1 ring-white/15">
                <span>{r.emoji}</span>
                {r.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ALMANACH CTA */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="card flex flex-col items-center gap-4 bg-gradient-to-br from-marigold-50 to-paper2 p-10 text-center">
          <span className="text-4xl">📖</span>
          <h2 className="font-display text-3xl font-semibold">Almanach Mařeny</h2>
          <p className="max-w-2xl text-ink-soft">
            Veškerá nasbíraná moudrost dvou ročníků v jednom dokumentu — příprava, fakulta, finance,
            propagace, výzdoba, průvod, Fléda i upřímné rady, co dělat jinak. Předávej dál.
          </p>
          <Link href="/almanach" className="btn-primary px-6 py-3 text-base">
            Otevřít almanach →
          </Link>
        </div>
      </section>

      {/* PATIČKA */}
      <footer className="border-t border-ink/10 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-8 text-sm text-ink-soft">
          <Logo />
          <p>Studentská akce · organizují studenti · Mařeny není nikdy dost 🧡</p>
          <Link href="/prihlaseni" className="font-medium text-marigold-700 hover:underline">
            Vstup do zázemí →
          </Link>
        </div>
      </footer>
    </div>
  );
}
