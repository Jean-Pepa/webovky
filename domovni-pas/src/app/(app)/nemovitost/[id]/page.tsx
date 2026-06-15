import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser, getOwnedProperty } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deleteProperty } from "@/lib/actions/property";
import { BackLink } from "@/components/BackLink";
import { Badge } from "@/components/ui/Badge";
import { ConfirmSubmit } from "@/components/ui/ConfirmSubmit";
import { EntryCard } from "@/components/EntryCard";
import { DocumentRow } from "@/components/DocumentRow";
import { DocumentUploadForm } from "@/components/forms/DocumentUploadForm";
import {
  IconPlus,
  IconShare,
  IconTransfer,
  IconFile,
  IconCalendar,
  IconMoney,
  IconBuilding,
} from "@/components/Icons";
import { PROPERTY_TYPES, type PropertyType } from "@/lib/enums";
import { addressLine, formatCurrency } from "@/lib/format";

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
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

  const isOwner = property.ownerId === user.id;
  const typeLabel = PROPERTY_TYPES[property.type as PropertyType] ?? property.type;
  const totalCost = property.entries.reduce((sum, e) => sum + (e.cost ?? 0), 0);

  return (
    <div>
      <BackLink href="/prehled">Zpět na přehled</BackLink>

      {/* Hlavička */}
      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge color="teal">{typeLabel}</Badge>
            {!isOwner && <Badge color="amber">Sdílená se mnou</Badge>}
          </div>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-stone-900">
            {property.name}
          </h1>
          <p className="mt-1 text-sm text-stone-500">{addressLine(property)}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link href={`/nemovitost/${id}/report`} className="btn-secondary btn-sm">
            <IconFile className="h-4 w-4" />
            Report
          </Link>
          {isOwner && (
            <>
              <Link href={`/nemovitost/${id}/sdileni`} className="btn-secondary btn-sm">
                <IconShare className="h-4 w-4" />
                Sdílet
              </Link>
              <Link href={`/nemovitost/${id}/prevod`} className="btn-secondary btn-sm">
                <IconTransfer className="h-4 w-4" />
                Převést
              </Link>
              <Link href={`/nemovitost/${id}/upravit`} className="btn-ghost btn-sm">
                Upravit
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Statistiky */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat icon={<IconCalendar className="h-4 w-4" />} label="Záznamů" value={String(property.entries.length)} />
        <Stat icon={<IconFile className="h-4 w-4" />} label="Dokumentů" value={String(property.documents.length)} />
        <Stat
          icon={<IconMoney className="h-4 w-4" />}
          label="Náklady celkem"
          value={totalCost > 0 ? formatCurrency(totalCost) : "—"}
        />
        <Stat
          icon={<IconBuilding className="h-4 w-4" />}
          label="Rok výstavby"
          value={property.yearBuilt ? String(property.yearBuilt) : "—"}
        />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Časová osa */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-stone-900">Historie</h2>
            <Link href={`/nemovitost/${id}/zaznam/novy`} className="btn-primary btn-sm">
              <IconPlus className="h-4 w-4" />
              Přidat záznam
            </Link>
          </div>

          {property.entries.length === 0 ? (
            <div className="card mt-4 flex flex-col items-center px-6 py-12 text-center">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-teal-50 text-teal-700">
                <IconCalendar className="h-6 w-6" />
              </div>
              <p className="mt-4 text-sm font-medium text-stone-800">Zatím žádný záznam</p>
              <p className="mt-1 max-w-xs text-sm text-stone-500">
                Přidejte první událost — opravu, revizi, závadu nebo rekonstrukci.
              </p>
              <Link href={`/nemovitost/${id}/zaznam/novy`} className="btn-primary btn-sm mt-5">
                <IconPlus className="h-4 w-4" />
                Přidat záznam
              </Link>
            </div>
          ) : (
            <ol className="mt-5 space-y-5 border-l-2 border-stone-200 pl-7">
              {property.entries.map((entry) => (
                <EntryCard key={entry.id} entry={entry} canEdit />
              ))}
            </ol>
          )}
        </div>

        {/* Boční sloupec */}
        <div className="space-y-6">
          {/* Údaje */}
          <section className="card p-5">
            <h2 className="text-sm font-semibold text-stone-900">Údaje o nemovitosti</h2>
            <dl className="mt-3 space-y-2.5 text-sm">
              <Row label="Typ" value={typeLabel} />
              <Row label="Adresa" value={addressLine(property)} />
              {property.cadastralArea && <Row label="Katastr. území" value={property.cadastralArea} />}
              {property.parcelNumber && <Row label="Parcela / č.p." value={property.parcelNumber} />}
              {property.yearBuilt && <Row label="Rok výstavby" value={String(property.yearBuilt)} />}
              <Row label="Vlastník" value={property.owner.name} />
            </dl>
            {property.description && (
              <p className="mt-3 border-t border-stone-100 pt-3 text-sm leading-relaxed text-stone-600">
                {property.description}
              </p>
            )}
            {isOwner && (
              <form action={deleteProperty} className="mt-4 border-t border-stone-100 pt-4">
                <input type="hidden" name="id" value={id} />
                <ConfirmSubmit
                  message="Opravdu nenávratně smazat tuto nemovitost se všemi záznamy, dokumenty a soubory?"
                  className="btn-danger btn-sm w-full"
                >
                  Smazat nemovitost
                </ConfirmSubmit>
              </form>
            )}
          </section>

          {/* Dokumenty */}
          <section className="card p-5">
            <h2 className="text-sm font-semibold text-stone-900">Dokumenty</h2>
            {property.documents.length > 0 ? (
              <ul className="mt-1 divide-y divide-stone-100">
                {property.documents.map((doc) => (
                  <DocumentRow key={doc.id} doc={doc} canEdit />
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-stone-500">
                Zatím žádné dokumenty. Nahrajte projekt, energetický štítek nebo certifikáty.
              </p>
            )}
            <div className="mt-4 border-t border-stone-100 pt-4">
              <DocumentUploadForm propertyId={id} />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="card p-4">
      <div className="flex items-center gap-1.5 text-xs text-stone-400">
        {icon}
        {label}
      </div>
      <p className="mt-1 text-lg font-semibold text-stone-900">{value}</p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="shrink-0 text-stone-400">{label}</dt>
      <dd className="text-right font-medium text-stone-700">{value}</dd>
    </div>
  );
}
