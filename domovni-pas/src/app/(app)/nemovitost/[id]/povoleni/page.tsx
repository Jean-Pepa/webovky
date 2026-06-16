"use client";

import Link from "next/link";
import { useState } from "react";
import { useParams } from "next/navigation";
import { useStore } from "@/lib/store";
import { canSeeProperty } from "@/lib/access";
import { analyzePermit, draftPruvodniZprava } from "@/lib/permit";
import { Loading } from "@/components/Loading";
import { BackLink } from "@/components/BackLink";
import { PrintButton } from "@/components/ui/PrintButton";
import { IconCheck, IconClose, IconSparkles, IconFile, IconBuilding } from "@/components/Icons";
import { DOCUMENT_CATEGORIES, DOC_SECTIONS } from "@/lib/enums";

type AiResult = {
  summary?: string;
  missing?: { item: string; why: string; how: string }[];
  recommendations?: string[];
  draft?: string;
};

export default function PermitPage() {
  const { id } = useParams<{ id: string }>();
  const { getProperty, hydrated, role } = useStore();
  const [ai, setAi] = useState<AiResult | null>(null);
  const [state, setState] = useState<"idle" | "loading" | "not_configured" | "error">("idle");

  if (!hydrated) return <Loading />;

  const property = getProperty(id);
  if (!property || (role && !canSeeProperty(property, role))) {
    return (
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-stone-500">Nemovitost nenalezena.</p>
        <Link href="/prehled" className="btn-secondary mt-4">
          Zpět na přehled
        </Link>
      </div>
    );
  }

  const analysis = analyzePermit(property);
  const templateDraft = draftPruvodniZprava(property);

  async function runAi() {
    setState("loading");
    setAi(null);
    const ctx = {
      nazev: property!.name,
      misto: [property!.street, property!.city, property!.zip].filter(Boolean).join(", "),
      katastr: property!.cadastralArea,
      parcela: property!.parcelNumber,
      investor: property!.investor,
      architekt: property!.architect,
      plocha_m2: property!.floorArea,
      energeticka_trida: property!.energyClass,
      rok: property!.yearBuilt,
      popis: property!.description,
      dokumenty: property!.documents.map((d) => ({
        nazev: d.title,
        kategorie: DOCUMENT_CATEGORIES[d.category],
        sekce: d.section ? DOC_SECTIONS[d.section] : undefined,
      })),
      zaznamy: property!.entries.map((e) => ({ typ: e.type, nazev: e.title, datum: e.date })),
      kontrola: analysis.groups,
    };
    try {
      const res = await fetch(`/api/permit/${id}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(ctx),
      });
      if (res.status === 503) return setState("not_configured");
      if (!res.ok) return setState("error");
      setAi(await res.json());
      setState("idle");
    } catch {
      setState("error");
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="no-print flex items-center justify-between">
        <BackLink href={`/nemovitost/${id}`}>Zpět na nemovitost</BackLink>
        <PrintButton />
      </div>

      <div className="mt-4 flex items-center gap-2">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-teal-50 text-teal-700">
          <IconBuilding className="h-5 w-5" />
        </span>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-stone-900">Stavební povolení</h1>
          <p className="text-sm text-stone-500">Příprava podkladů (DSP) — {property.name}</p>
        </div>
      </div>

      {/* Připravenost */}
      <section className="card mt-6 p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-stone-900">Připravenost dokumentace</h2>
          <span className="text-sm font-semibold text-stone-700">
            {analysis.present}/{analysis.total} · {analysis.readiness} %
          </span>
        </div>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-stone-100">
          <div
            className="h-full rounded-full bg-teal-600 transition-all"
            style={{ width: `${analysis.readiness}%` }}
          />
        </div>

        <div className="mt-5 space-y-4">
          {analysis.groups.map((g) => (
            <div key={g.key}>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-400">{g.label}</h3>
              <ul className="mt-1.5 space-y-1.5">
                {g.items.map((it) => (
                  <li key={it.label} className="flex items-start gap-2.5">
                    <span
                      className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full ${
                        it.present ? "bg-teal-600 text-white" : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {it.present ? <IconCheck className="h-3.5 w-3.5" /> : <IconClose className="h-3.5 w-3.5" />}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-stone-800">{it.label}</p>
                      <p className="text-xs text-stone-400">
                        {it.present ? `Nalezeno: ${it.via}` : it.hint || "Zatím chybí"}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* AI zpracování */}
      <section className="card mt-4 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-stone-900">Zpracovat dokumentaci (AI)</h2>
            <p className="mt-0.5 text-sm text-stone-500">
              Claude posoudí podklady a navrhne texty pro stavební povolení.
            </p>
          </div>
          <button onClick={runAi} className="btn-primary btn-sm no-print" disabled={state === "loading"}>
            <IconSparkles className="h-4 w-4" />
            {state === "loading" ? "Zpracovávám…" : "Spustit AI"}
          </button>
        </div>

        {state === "not_configured" && (
          <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
            AI zatím není zapnutá (chybí ANTHROPIC_API_KEY). Níže používáme šablonovou Průvodní zprávu.
          </p>
        )}
        {state === "error" && (
          <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
            Zpracování se nepodařilo. Zkuste to prosím znovu.
          </p>
        )}

        {ai && (
          <div className="mt-4 space-y-4">
            {ai.summary && <p className="text-sm leading-relaxed text-stone-700">{ai.summary}</p>}
            {ai.missing && ai.missing.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-400">Co doplnit</h3>
                <ul className="mt-2 space-y-2">
                  {ai.missing.map((m, i) => (
                    <li key={i} className="rounded-lg border border-stone-200 p-3 text-sm">
                      <p className="font-medium text-stone-800">{m.item}</p>
                      {m.why && <p className="mt-0.5 text-xs text-stone-500">Proč: {m.why}</p>}
                      {m.how && <p className="text-xs text-stone-500">Jak: {m.how}</p>}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {ai.recommendations && ai.recommendations.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-400">Doporučení</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-stone-700">
                  {ai.recommendations.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Průvodní zpráva */}
      <section className="card mt-4 p-5">
        <div className="flex items-center gap-2">
          <IconFile className="h-4 w-4 text-teal-700" />
          <h2 className="text-sm font-semibold text-stone-900">
            Návrh Průvodní zprávy {ai?.draft ? "(AI)" : "(šablona)"}
          </h2>
        </div>
        <pre className="mt-3 whitespace-pre-wrap rounded-lg bg-stone-50 p-4 text-sm leading-relaxed text-stone-700">
          {ai?.draft || templateDraft}
        </pre>
      </section>

      <p className="mt-6 text-center text-xs text-stone-400">
        Pomocný nástroj pro přípravu podkladů — nejde o právně závazné podání ani projektovou
        dokumentaci.
      </p>
    </div>
  );
}
