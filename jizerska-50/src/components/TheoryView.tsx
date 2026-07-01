"use client";

import { THEORY, SOURCES } from "@/lib/theory";

export default function TheoryView() {
  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-line bg-card p-4 shadow-sm">
        <h2 className="text-base font-bold">Jak a proč — souhrn researchu</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Celý plán stojí na pěti principech vytrvalostního tréninku a výživy. Tady je vysvětlení, proč jednotlivé
          jednotky vypadají tak, jak vypadají.
        </p>
      </div>

      {THEORY.map((sec) => (
        <section key={sec.id} className="rounded-2xl border border-line bg-card p-5 shadow-sm">
          <h3 className="text-lg font-bold">{sec.heading}</h3>
          <p className="mt-1 mb-4 text-sm text-ink-soft">{sec.lead}</p>
          <div className="space-y-4">
            {sec.blocks.map((b) => (
              <div key={b.title}>
                <h4 className="mb-1.5 text-sm font-bold text-sky-600">{b.title}</h4>
                <ul className="space-y-1.5">
                  {b.body.map((line, i) => (
                    <li key={i} className="flex gap-2 text-sm text-ink-soft">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-line" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      ))}

      <section className="rounded-2xl border border-line bg-card p-5 shadow-sm">
        <h3 className="mb-3 text-sm font-bold">Zdroje</h3>
        <ul className="space-y-2">
          {SOURCES.map((s) => (
            <li key={s.url}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-sky-600 underline decoration-line underline-offset-2 hover:decoration-sky"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-ink-soft">
          Plán je obecné doporučení pro zdravého sportovce. Při zdravotních obtížích, bolesti nebo nejistotě se poraď s
          lékařem nebo trenérem.
        </p>
      </section>
    </div>
  );
}
