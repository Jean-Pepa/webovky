import type { ReactNode } from "react";
import Link from "@/components/LocLink";
import BackButton from "@/components/BackButton";

export type LegalMeta = { label: string; value: ReactNode };
export type LegalSection = { id: string; title: string; body: ReactNode };

export default function LegalLayout({
  eyebrow,
  title,
  home,
  meta,
  sections,
  appendices = [],
  effectiveNote,
}: {
  eyebrow: string;
  title: string;
  home: string;
  meta: LegalMeta[];
  sections: LegalSection[];
  appendices?: LegalSection[];
  effectiveNote?: string;
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

      <div className="mt-8 grid lg:grid-cols-[260px_1fr] gap-10">
        {/* Obsah / TOC */}
        <aside className="hidden lg:block">
          <div className="sticky top-28">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-soft)] mb-3">Obsah</p>
            <ol className="space-y-2 text-sm">
              {sections.map((s, i) => (
                <li key={s.id} className="flex gap-2">
                  <span className="text-[var(--color-ink-soft)]">{i + 1}.</span>
                  <a href={`#${s.id}`} className="text-[var(--color-ink-soft)] hover:text-[var(--color-accent)]">{s.title}</a>
                </li>
              ))}
              {appendices.map((s) => (
                <li key={s.id} className="flex gap-2 pt-1">
                  <span className="text-[var(--color-ink-soft)]">›</span>
                  <a href={`#${s.id}`} className="text-[var(--color-ink-soft)] hover:text-[var(--color-accent)]">{s.title}</a>
                </li>
              ))}
            </ol>
          </div>
        </aside>

        {/* Obsah dokumentu */}
        <article className="min-w-0 rounded-2xl border border-[var(--color-border)] bg-white p-6 sm:p-8">
          <div className="space-y-10">
            {sections.map((s, i) => (
              <section key={s.id} id={s.id} className="scroll-mt-28">
                <h2 className="text-xl font-bold">
                  <span className="text-[var(--color-ink-soft)] font-semibold mr-2">{i + 1}</span>
                  {s.title}
                </h2>
                <div className="mt-3 space-y-3 text-sm leading-relaxed text-[var(--color-ink-soft)]">{s.body}</div>
              </section>
            ))}
          </div>

          {effectiveNote && (
            <p className="mt-10 text-sm font-medium text-[var(--color-ink)]">{effectiveNote}</p>
          )}

          {appendices.length > 0 && (
            <div className="mt-12 space-y-10 border-t border-[var(--color-border)] pt-10">
              {appendices.map((s) => (
                <section key={s.id} id={s.id} className="scroll-mt-28">
                  <h2 className="text-lg font-bold uppercase tracking-wide">{s.title}</h2>
                  <div className="mt-3 space-y-3 text-sm leading-relaxed text-[var(--color-ink-soft)]">{s.body}</div>
                </section>
              ))}
            </div>
          )}
        </article>
      </div>
    </div>
  );
}
