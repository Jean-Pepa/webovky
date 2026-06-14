"use client";

import { useState } from "react";
import type { Param } from "@/data/catalog";
import { useI18n } from "@/i18n/context";
import Stars from "./Stars";

type Tab = "popis" | "parametry" | "hodnoceni";

const REVIEWS: Record<"cs" | "en" | "de", { author: string; rating: number; text: string }[]> = {
  cs: [
    { author: "Martin K. (živnostník)", rating: 5, text: "Kvalita sedí, dodání rychlé. Doporučuji pro každodenní práci." },
    { author: "Stavby Novák s.r.o.", rating: 5, text: "Objednáváme opakovaně, vždy skladem a za dobrou cenu." },
    { author: "Petr S.", rating: 4, text: "Spokojenost, jen závoz přišel o den později." },
  ],
  en: [
    { author: "Martin K. (tradesman)", rating: 5, text: "Quality is spot on, fast delivery. Recommended for everyday work." },
    { author: "Novák Construction Ltd.", rating: 5, text: "We order repeatedly, always in stock and at a good price." },
    { author: "Peter S.", rating: 4, text: "Happy, only the delivery came a day later." },
  ],
  de: [
    { author: "Martin K. (Handwerker)", rating: 5, text: "Qualität stimmt, schnelle Lieferung. Für den täglichen Einsatz empfehlenswert." },
    { author: "Novák Bau GmbH", rating: 5, text: "Wir bestellen regelmäßig, immer auf Lager und zu gutem Preis." },
    { author: "Peter S.", rating: 4, text: "Zufrieden, nur die Lieferung kam einen Tag später." },
  ],
};

export default function ProductTabs({
  description,
  params,
  rating,
  ratingCount,
}: {
  description: string;
  params?: Param[];
  rating: number;
  ratingCount: number;
}) {
  const { t, lang } = useI18n();
  const [tab, setTab] = useState<Tab>("popis");
  const DEMO_REVIEWS = REVIEWS[lang];

  const tabs: [Tab, string][] = [
    ["popis", t("pd.tab.desc")],
    ["parametry", t("pd.tab.params")],
    ["hodnoceni", `${t("pd.tab.reviews")} (${ratingCount})`],
  ];

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden">
      <div className="flex border-b border-[var(--color-border)]">
        {tabs.map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-5 py-4 text-sm font-semibold border-b-2 -mb-px transition ${
              tab === key
                ? "border-[var(--color-accent)] text-[var(--color-accent)]"
                : "border-transparent text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="p-6">
        {tab === "popis" && (
          <p className="text-[var(--color-ink-soft)] leading-relaxed max-w-2xl">
            {description}
          </p>
        )}

        {tab === "parametry" && (
          <table className="w-full max-w-xl text-sm">
            <tbody>
              {(params ?? []).map((p, i) => (
                <tr key={p.label} className={i % 2 ? "" : "bg-[var(--color-bg)]"}>
                  <td className="py-2.5 px-3 text-[var(--color-ink-soft)] w-1/2">{p.label}</td>
                  <td className="py-2.5 px-3 font-medium">{p.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === "hodnoceni" && (
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="text-4xl font-extrabold">{rating.toFixed(1)}</div>
              <div>
                <Stars rating={rating} size="md" />
                <div className="text-sm text-[var(--color-ink-soft)] mt-1">
                  {ratingCount} {t("pd.ratingsCount")}
                </div>
              </div>
            </div>
            <div className="space-y-4 max-w-2xl">
              {DEMO_REVIEWS.map((r) => (
                <div key={r.author} className="border-b border-[var(--color-border)] pb-4 last:border-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">{r.author}</span>
                    <Stars rating={r.rating} />
                  </div>
                  <p className="text-sm text-[var(--color-ink-soft)] mt-1">{r.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
