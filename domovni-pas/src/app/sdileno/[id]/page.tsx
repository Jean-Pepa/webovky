"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useStore } from "@/lib/store";
import { Loading } from "@/components/Loading";
import { Logo } from "@/components/Logo";
import { Badge } from "@/components/ui/Badge";
import { EntryCard } from "@/components/EntryCard";
import { IconFile, IconShield } from "@/components/Icons";
import { PROPERTY_TYPES, DOCUMENT_CATEGORIES } from "@/lib/enums";
import { addressLine, formatCurrency } from "@/lib/format";

export default function SharedPage() {
  const { id } = useParams<{ id: string }>();
  const { getProperty, hydrated } = useStore();

  if (!hydrated) return <Loading />;

  const property = getProperty(id);

  if (!property || !property.shareEnabled) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-stone-100 text-stone-400">
          <IconShield className="h-7 w-7" />
        </div>
        <h1 className="mt-5 text-xl font-semibold text-stone-900">Náhled není dostupný</h1>
        <p className="mt-2 max-w-sm text-sm text-stone-500">
          Tento sdílený odkaz neexistuje nebo ho majitel vypnul.
        </p>
        <Link href="/" className="btn-primary mt-6">
          Domů
        </Link>
      </div>
    );
  }

  const entries = [...property.entries].sort((a, b) => b.date.localeCompare(a.date));
  const totalCost = property.entries.reduce((s, e) => s + (e.cost ?? 0), 0);

  return (
    <div className="min-h-screen">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link href="/">
            <Logo />
          </Link>
          <Badge color="amber">Náhled · jen ke čtení</Badge>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-8">
        <Badge color="teal">{PROPERTY_TYPES[property.type]}</Badge>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-stone-900">
          {property.name}
        </h1>
        <p className="mt-1 text-stone-500">{addressLine(property)}</p>

        <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-3">
          {property.yearBuilt && <Fact label="Rok výstavby" value={String(property.yearBuilt)} />}
          {property.cadastralArea && (
            <Fact label="Katastrální území" value={property.cadastralArea} />
          )}
          <Fact label="Počet záznamů" value={String(property.entries.length)} />
          <Fact label="Náklady celkem" value={totalCost > 0 ? formatCurrency(totalCost) : "—"} />
        </dl>

        {property.description && (
          <p className="mt-4 rounded-lg bg-stone-50 p-4 text-sm leading-relaxed text-stone-600">
            {property.description}
          </p>
        )}

        <h2 className="mt-8 text-lg font-semibold text-stone-900">Historie</h2>
        {entries.length === 0 ? (
          <p className="mt-3 text-sm text-stone-500">Zatím žádné záznamy.</p>
        ) : (
          <ol className="mt-5 space-y-4 border-l-2 border-stone-200 pl-7">
            {entries.map((entry) => (
              <EntryCard key={entry.id} entry={entry} />
            ))}
          </ol>
        )}

        {property.documents.length > 0 && (
          <section className="card mt-8 p-5">
            <h2 className="text-sm font-semibold text-stone-900">Dokumenty</h2>
            <ul className="mt-2 divide-y divide-stone-100">
              {property.documents.map((doc) => (
                <li key={doc.id} className="flex items-center gap-3 py-2.5">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-stone-100 text-stone-500">
                    <IconFile className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-stone-800">{doc.title}</p>
                    <p className="text-xs text-stone-400">
                      {DOCUMENT_CATEGORIES[doc.category] ?? DOCUMENT_CATEGORIES.OTHER}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="mt-10 rounded-2xl bg-teal-700 px-6 py-7 text-center text-white">
          <h3 className="text-lg font-semibold">Máte taky nemovitost?</h3>
          <p className="mx-auto mt-1.5 max-w-md text-sm text-teal-50">
            Veďte si vlastní záznam v BULO — historii, dokumenty i fotky na jednom místě.
          </p>
          <Link
            href="/prehled"
            className="mt-4 inline-flex rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-teal-700 hover:bg-teal-50"
          >
            Otevřít aplikaci
          </Link>
        </div>
      </main>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-stone-400">{label}</dt>
      <dd className="font-medium text-stone-800">{value}</dd>
    </div>
  );
}
