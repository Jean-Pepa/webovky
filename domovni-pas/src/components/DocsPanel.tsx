"use client";

import { useEffect, useState } from "react";
import { IconClose, IconCheck, IconFile } from "@/components/Icons";

const SECTIONS = [
  {
    key: "pozemek",
    label: "Pozemek",
    desc: "Vše o pozemku — kde nemovitost stojí a v jakém kontextu.",
    items: [
      "Fotky pozemku",
      "Výpis z katastru",
      "Územní regulativy",
      "Orientace ke světovým stranám",
      "Hluková mapa",
      "Sousedé a okolí",
    ],
  },
  {
    key: "navrh",
    label: "Návrh",
    desc: "Jak návrh vznikal a proč.",
    items: ["Koncept / studie", "Skici a vizualizace", "Varianty řešení", "Důvody klíčových rozhodnutí"],
  },
  {
    key: "realizace",
    label: "Realizace",
    desc: "Co se dělo během stavby.",
    items: ["Změny oproti projektu", "Fotky z průběhu stavby", "Použité materiály", "Kontakty na dodavatele"],
  },
  {
    key: "budova",
    label: "Budova",
    desc: "Dokumentace hotové budovy.",
    items: [
      "Projektová dokumentace (DSP)",
      "Technická zpráva",
      "Energetický štítek (PENB)",
      "Revizní zprávy",
      "Záruční listy",
    ],
  },
];

export function DocsPanel() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("bulo-open-docs", handler);
    return () => window.removeEventListener("bulo-open-docs", handler);
  }, []);

  if (!open) return null;
  const section = SECTIONS[active];

  return (
    <div className="no-print fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30" onClick={() => setOpen(false)} />
      <aside className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4">
          <div className="flex items-center gap-2">
            <IconFile className="h-5 w-5 text-teal-700" />
            <h2 className="text-base font-semibold text-stone-900">Dokumentace projektu</h2>
          </div>
          <button onClick={() => setOpen(false)} aria-label="Zavřít" className="text-stone-400 hover:text-stone-700">
            <IconClose className="h-5 w-5" />
          </button>
        </div>

        <div className="flex gap-1 overflow-x-auto border-b border-stone-200 px-3 py-2">
          {SECTIONS.map((s, i) => (
            <button
              key={s.key}
              onClick={() => setActive(i)}
              className={`shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                i === active ? "bg-teal-50 text-teal-800" : "text-stone-600 hover:bg-stone-100"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <p className="text-sm text-stone-500">{section.desc}</p>
          <ul className="mt-3 space-y-2">
            {section.items.map((it) => (
              <li
                key={it}
                className="flex items-center gap-2.5 rounded-lg border border-stone-200 px-3 py-2.5 text-sm text-stone-700"
              >
                <IconCheck className="h-4 w-4 shrink-0 text-teal-600" />
                {it}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-stone-400">
            Strukturovaná dokumentace nemovitosti po fázích. Dokumenty k jednotlivým sekcím přidáte v
            detailu nemovitosti.
          </p>
        </div>
      </aside>
    </div>
  );
}
