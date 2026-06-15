import type { ReactNode } from "react";
import Link from "@/components/LocLink";
import BackButton from "@/components/BackButton";
import type { LegalMeta, LegalSection } from "@/components/LegalLayout";

export type LegalGroup = {
  id: string;
  heading: string;
  intro?: string;
  sections: LegalSection[];
  appendices?: LegalSection[];
};

// Souhrnná právní stránka s více dokumenty (každý má vlastní číslování a obsah).
export default function MultiLegalLayout({
  eyebrow,
  title,
  home,
  meta,
  groups,
}: {
  eyebrow: string;
  title: string;
  home: string;
  meta: LegalMeta[];
  groups: LegalGroup[];
}) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-center gap-3 mb-5">
        <BackButton />
        <nav className="text-sm text-[var(--color-ink-soft)]">
          <Link href="/" className="hover:text-[var(--color-accent)]">{home}</Link>
          <span className="mx-2">/</span>
          <span>{title}</span>
        </nav>
      </div>

      <p className="text-xs font-bold uppercase tracking-wide" style={{ color: "var(--color-accent)" }}>{eyebrow}</p>
      <h1 className="mt-1 text-4xl font-extrabold">{title}</h1>

      {/* Info box */}
      <div className="mt-6 rounded-2xl border border-[var(--color-border)] bg-white p-6">
        <dl className="grid sm:grid-cols-2 gap-x-10 gap-y-4">
          {meta.map((m) => (
            <div key={m.label} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
              <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-soft)] sm:w-40 shrink-0">{m.label}</dt>
              <dd className="text-sm text-[var(--color-ink)]">{m.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="mt-8 grid lg:grid-cols-[280px_1fr] gap-10">
        {/* Obsah / TOC */}
        <aside className="hidden lg:block">
          <div className="sticky top-28 max-h-[calc(100vh-9rem)] overflow-auto pr-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-soft)] mb-3">Obsah</p>
            <div className="space-y-4 text-sm">
              {groups.map((g) => (
                <div key={g.id}>
                  <a href={`#${g.id}`} className="block font-semibold text-[var(--color-ink)] hover:text-[var(--color-accent)]">{g.heading}</a>
                  <ol className="mt-1 space-y-1">
                    {g.sections.map((s, i) => (
                      <li key={s.id} className="flex gap-2">
                        <span className="text-[var(--color-ink-soft)]">{i + 1}.</span>
                        <a href={`#${s.id}`} className="text-[var(--color-ink-soft)] hover:text-[var(--color-accent)]">{s.title}</a>
                      </li>
                    ))}
                    {(g.appendices ?? []).map((s) => (
                      <li key={s.id} className="flex gap-2">
                        <span className="text-[var(--color-ink-soft)]">›</span>
                        <a href={`#${s.id}`} className="text-[var(--color-ink-soft)] hover:text-[var(--color-accent)]">{s.title}</a>
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Dokumenty */}
        <article className="min-w-0 space-y-14">
          {groups.map((g) => (
            <div key={g.id} id={g.id} className="scroll-mt-28 rounded-2xl border border-[var(--color-border)] bg-white p-6 sm:p-8">
              <h2 className="text-2xl font-extrabold">{g.heading}</h2>
              {g.intro && <p className="mt-2 text-sm text-[var(--color-ink-soft)]">{g.intro}</p>}

              <div className="mt-6 space-y-10">
                {g.sections.map((s, i) => (
                  <section key={s.id} id={s.id} className="scroll-mt-28">
                    <h3 className="text-lg font-bold">
                      <span className="text-[var(--color-ink-soft)] font-semibold mr-2">{i + 1}</span>
                      {s.title}
                    </h3>
                    <div className="mt-3 space-y-3 text-sm leading-relaxed text-[var(--color-ink-soft)]">{s.body}</div>
                  </section>
                ))}
              </div>

              {(g.appendices ?? []).length > 0 && (
                <div className="mt-10 space-y-10 border-t border-[var(--color-border)] pt-8">
                  {(g.appendices ?? []).map((s) => (
                    <section key={s.id} id={s.id} className="scroll-mt-28">
                      <h3 className="text-base font-bold uppercase tracking-wide">{s.title}</h3>
                      <div className="mt-3 space-y-3 text-sm leading-relaxed text-[var(--color-ink-soft)]">{s.body}</div>
                    </section>
                  ))}
                </div>
              )}
            </div>
          ))}
        </article>
      </div>
    </div>
  );
}

export type { LegalMeta, LegalSection };
