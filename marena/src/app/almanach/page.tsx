import Link from "next/link";
import type { Metadata } from "next";
import { Logo } from "@/components/Logo";
import { Mascot } from "@/components/Mascot";
import { ALMANACH, type Callout } from "@/lib/almanach";

export const metadata: Metadata = {
  title: "Almanach Mařeny — kompletní manuál festivalu",
  description:
    "Sloučená moudrost dvou ročníků Mařeny: příprava, fakulta, finance, propagace, program, výzdoba, prváci, merch, bar, průvod, Fléda a bezpečnost.",
};

const CALLOUT_STYLE: Record<Callout["kind"], { label: string; cls: string; emoji: string }> = {
  tip: { label: "Tip", cls: "border-leaf/30 bg-leaf/10 text-ink", emoji: "💡" },
  pozor: { label: "Pozor", cls: "border-marigold-300 bg-marigold-50 text-ink", emoji: "⚠️" },
  kontakt: { label: "Kontakt", cls: "border-sky/30 bg-sky/10 text-ink", emoji: "📇" },
};

export default function AlmanachPage() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-ink/10 bg-paper/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Logo />
          <nav className="flex items-center gap-1">
            <Link href="/" className="btn-ghost">Úvod</Link>
            <Link href="/prihlaseni" className="btn-primary">Vstoupit do zázemí</Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-ink/10 bg-plum-700 text-white">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-12 md:flex-row md:items-center">
          <div className="flex-1">
            <span className="chip bg-white/10 text-white ring-1 ring-white/15">manuál · v1.2 + 2024</span>
            <h1 className="mt-3 font-display text-4xl font-bold md:text-5xl">Almanach Mařeny</h1>
            <p className="mt-3 max-w-2xl text-white/75">
              Všechno, co se za roky nasbíralo — sloučené do jednoho dokumentu. Čti, předávej dál a
              hlavně to neztrať. Příští ročník ti poděkuje.
            </p>
          </div>
          <Mascot size={150} wave />
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[240px_1fr]">
        {/* Obsah */}
        <aside className="hidden lg:block">
          <nav className="sticky top-24 space-y-1">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-soft">Obsah</p>
            {ALMANACH.map((s, i) => (
              <a key={s.id} href={`#${s.id}`} className="block rounded-lg px-3 py-1.5 text-sm text-ink-soft transition hover:bg-black/5 hover:text-ink">
                <span className="mr-1.5 text-ink-soft/60">{String(i + 1).padStart(2, "0")}</span>
                {s.emoji} {s.title}
              </a>
            ))}
          </nav>
        </aside>

        {/* Sekce */}
        <article className="max-w-3xl space-y-12">
          {ALMANACH.map((s, i) => (
            <section key={s.id} id={s.id} className="scroll-mt-24">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-paper2 text-2xl">{s.emoji}</span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-marigold-700">
                    Kapitola {String(i + 1).padStart(2, "0")}
                  </p>
                  <h2 className="font-display text-2xl font-semibold">{s.title}</h2>
                </div>
              </div>

              <p className="mt-4 text-ink-soft">{s.intro}</p>

              <ul className="mt-4 space-y-2">
                {s.tips.map((tip, j) => (
                  <li key={j} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-marigold-500" />
                    <span className="text-[15px] leading-relaxed">{tip}</span>
                  </li>
                ))}
              </ul>

              {s.callouts.length > 0 && (
                <div className="mt-4 space-y-2">
                  {s.callouts.map((c, j) => {
                    const st = CALLOUT_STYLE[c.kind];
                    return (
                      <div key={j} className={`rounded-xl border px-4 py-3 text-sm ${st.cls}`}>
                        <span className="font-semibold">
                          {st.emoji} {st.label}:
                        </span>{" "}
                        {c.text}
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          ))}

          <div className="rounded-2xl border border-ink/10 bg-white p-6 text-center">
            <p className="font-display text-lg font-semibold">Užijte si to. Je to fakt sranda. 🧡</p>
            <p className="mt-1 text-sm text-ink-soft">A nezapomeňte tenhle almanach doplnit pro ty po vás.</p>
            <Link href="/prihlaseni" className="btn-primary mt-4">Vstoupit do zázemí</Link>
          </div>
        </article>
      </div>
    </div>
  );
}
