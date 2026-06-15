import { notFound } from "next/navigation";
import { requireUser, getOwnedProperty } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BackLink } from "@/components/BackLink";
import { PrintButton } from "@/components/ui/PrintButton";
import { Logo } from "@/components/Logo";
import { Badge } from "@/components/ui/Badge";
import { EntryCard } from "@/components/EntryCard";
import {
  PROPERTY_TYPES,
  DOCUMENT_CATEGORIES,
  type PropertyType,
  type DocumentCategory,
} from "@/lib/enums";
import { addressLine, formatCurrency, formatDate } from "@/lib/format";

export const metadata = { title: "Report nemovitosti — Domovní pas" };

export default async function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser();

  const access = await getOwnedProperty(id, user.id);
  if (!access) notFound();

  const property = await prisma.property.findUnique({
    where: { id },
    include: {
      owner: true,
      entries: { orderBy: { date: "desc" }, include: { attachments: true } },
      documents: { orderBy: { createdAt: "desc" } },
    },
  });
  if (!property) notFound();

  const typeLabel = PROPERTY_TYPES[property.type as PropertyType] ?? property.type;
  const totalCost = property.entries.reduce((s, e) => s + (e.cost ?? 0), 0);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="no-print mb-6 flex items-center justify-between">
        <BackLink href={`/nemovitost/${id}`}>Zpět na nemovitost</BackLink>
        <PrintButton />
      </div>

      <div className="card print-clean p-8">
        {/* Hlavička reportu */}
        <div className="flex items-start justify-between border-b border-stone-200 pb-5">
          <Logo />
          <div className="text-right text-sm text-stone-400">
            <p className="font-medium text-stone-600">Report nemovitosti</p>
            <p>Vygenerováno {formatDate(new Date())}</p>
          </div>
        </div>

        {/* Identifikace */}
        <div className="mt-6">
          <Badge color="teal">{typeLabel}</Badge>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-stone-900">
            {property.name}
          </h1>
          <p className="mt-1 text-stone-500">{addressLine(property)}</p>
        </div>

        <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-3">
          {property.cadastralArea && <Fact label="Katastrální území" value={property.cadastralArea} />}
          {property.parcelNumber && <Fact label="Parcela / č. popisné" value={property.parcelNumber} />}
          {property.yearBuilt && <Fact label="Rok výstavby" value={String(property.yearBuilt)} />}
          <Fact label="Vlastník" value={property.owner.name} />
          <Fact label="Počet záznamů" value={String(property.entries.length)} />
          <Fact label="Náklady celkem" value={totalCost > 0 ? formatCurrency(totalCost) : "—"} />
        </dl>

        {property.description && (
          <p className="mt-4 rounded-lg bg-stone-50 p-4 text-sm leading-relaxed text-stone-600">
            {property.description}
          </p>
        )}

        {/* Historie */}
        <h2 className="mt-8 text-lg font-semibold text-stone-900">Historie nemovitosti</h2>
        {property.entries.length === 0 ? (
          <p className="mt-3 text-sm text-stone-500">Zatím nebyl zaznamenán žádný záznam.</p>
        ) : (
          <ol className="mt-5 space-y-4 border-l-2 border-stone-200 pl-7">
            {property.entries.map((entry) => (
              <EntryCard key={entry.id} entry={entry} canEdit={false} />
            ))}
          </ol>
        )}

        {/* Dokumenty */}
        {property.documents.length > 0 && (
          <>
            <h2 className="mt-8 text-lg font-semibold text-stone-900">Dokumenty</h2>
            <ul className="mt-3 space-y-1.5 text-sm">
              {property.documents.map((doc) => (
                <li key={doc.id} className="flex justify-between gap-3">
                  <span className="text-stone-700">{doc.title}</span>
                  <span className="shrink-0 text-stone-400">
                    {DOCUMENT_CATEGORIES[doc.category as DocumentCategory] ??
                      DOCUMENT_CATEGORIES.OTHER}
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}

        <p className="mt-10 border-t border-stone-200 pt-4 text-center text-xs text-stone-400">
          Tento report byl vygenerován z Domovního pasu — trvalého záznamu historie nemovitosti.
        </p>
      </div>
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
