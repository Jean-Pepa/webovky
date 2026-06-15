import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Logo } from "@/components/Logo";
import { Badge } from "@/components/ui/Badge";
import { EntryCard } from "@/components/EntryCard";
import { IconFile, IconShield } from "@/components/Icons";
import {
  PROPERTY_TYPES,
  DOCUMENT_CATEGORIES,
  type PropertyType,
  type DocumentCategory,
} from "@/lib/enums";
import { addressLine, formatCurrency } from "@/lib/format";

export const metadata = {
  title: "Sdílený náhled nemovitosti — Domovní pas",
  robots: { index: false },
};

export default async function SharedPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  const property = await prisma.property.findFirst({
    where: { shareToken: token, shareEnabled: true },
    include: {
      owner: true,
      entries: { orderBy: { date: "desc" }, include: { attachments: true } },
      documents: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!property) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-stone-100 text-stone-400">
          <IconShield className="h-7 w-7" />
        </div>
        <h1 className="mt-5 text-xl font-semibold text-stone-900">Odkaz není dostupný</h1>
        <p className="mt-2 max-w-sm text-sm text-stone-500">
          Tento sdílený odkaz neexistuje nebo ho majitel vypnul.
        </p>
        <Link href="/" className="btn-primary mt-6">
          Domů
        </Link>
      </div>
    );
  }

  const typeLabel = PROPERTY_TYPES[property.type as PropertyType] ?? property.type;
  const totalCost = property.entries.reduce((s, e) => s + (e.cost ?? 0), 0);

  return (
    <div className="min-h-screen">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link href="/">
            <Logo />
          </Link>
          <Badge color="amber">Veřejný náhled · jen ke čtení</Badge>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-8">
        <Badge color="teal">{typeLabel}</Badge>
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
        {property.entries.length === 0 ? (
          <p className="mt-3 text-sm text-stone-500">Zatím žádné záznamy.</p>
        ) : (
          <ol className="mt-5 space-y-4 border-l-2 border-stone-200 pl-7">
            {property.entries.map((entry) => (
              <EntryCard key={entry.id} entry={entry} canEdit={false} />
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
                      {DOCUMENT_CATEGORIES[doc.category as DocumentCategory] ??
                        DOCUMENT_CATEGORIES.OTHER}
                    </p>
                  </div>
                  <a
                    href={`/api/files/${doc.storageKey}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-ghost btn-sm text-stone-500"
                  >
                    Otevřít
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="mt-10 rounded-2xl bg-teal-700 px-6 py-7 text-center text-white">
          <h3 className="text-lg font-semibold">Máte taky nemovitost?</h3>
          <p className="mx-auto mt-1.5 max-w-md text-sm text-teal-50">
            Veďte si vlastní domovní pas — historii, dokumenty i fotky na jednom místě, připravené
            na předání novému majiteli.
          </p>
          <Link
            href="/registrace"
            className="mt-4 inline-flex rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-teal-700 hover:bg-teal-50"
          >
            Vytvořit účet zdarma
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
