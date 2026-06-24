import type { Metadata } from "next";
import { ALMANACH, type Callout } from "@/lib/almanach";

export const metadata: Metadata = {
  title: "Almanach Mařeny — manuál pro organizátory",
};

const CALLOUT_STYLE: Record<Callout["kind"], { label: string; cls: string; emoji: string }> = {
  tip: { label: "Tip", cls: "border-leaf/30 bg-leaf/10 text-ink", emoji: "💡" },
  pozor: { label: "Pozor", cls: "border-marigold-300 bg-marigold-50 text-ink", emoji: "⚠️" },
  kontakt: { label: "Kontakt", cls: "border-sky/30 bg-sky/10 text-ink", emoji: "📇" },
};

export default function AlmanachPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Almanach Mařeny</h1>
        <p className="text-sm text-ink-soft">
          Veškerá nasbíraná moudrost dvou ročníků v jednom dokumentu — interní manuál pro ty, kdo
          Mařenu organizují. Čti, doplňuj a předávej dál.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[230px_1fr]">
        {/* Obsah */}
        <aside className="order-1 hidden lg:block">
          <nav className="sticky top-28 space-y-0.5">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-soft">Obsah</p>
            {ALMANACH.map((s, i) => (
              <a key={s.id} href={`#${s.id}`} className="block rounded-lg px-3 py-1.5 text-sm text-ink-soft transition hover:bg-paper2 hover:text-ink">
                <span className="mr-1.5 text-ink-soft/50">{String(i + 1).padStart(2, "0")}</span>
                {s.emoji} {s.title}
              </a>
            ))}
          </nav>
        </aside>

        {/* Sekce */}
        <article className="order-2 max-w-3xl space-y-10">
          {ALMANACH.map((s, i) => (
            <section key={s.id} id={s.id} className="scroll-mt-28">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-paper2 text-2xl">{s.emoji}</span>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-marigold-700">Kapitola {String(i + 1).padStart(2, "0")}</p>
                  <h2 className="font-display text-xl font-semibold tracking-tight">{s.title}</h2>
                </div>
              </div>

              <p className="mt-3 text-ink-soft">{s.intro}</p>

              <ul className="mt-3 space-y-2">
                {s.tips.map((tip, j) => (
                  <li key={j} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-marigold-600" />
                    <span className="text-[15px] leading-relaxed">{tip}</span>
                  </li>
                ))}
              </ul>

              {s.callouts.length > 0 && (
                <div className="mt-3 space-y-2">
                  {s.callouts.map((c, j) => {
                    const st = CALLOUT_STYLE[c.kind];
                    return (
                      <div key={j} className={`rounded-xl border px-4 py-3 text-sm ${st.cls}`}>
                        <span className="font-semibold">{st.emoji} {st.label}:</span> {c.text}
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          ))}
        </article>
      </div>
    </div>
  );
}
