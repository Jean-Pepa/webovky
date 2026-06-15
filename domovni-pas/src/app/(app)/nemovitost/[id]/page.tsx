"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Loading } from "@/components/Loading";
import { BackLink } from "@/components/BackLink";
import { Badge } from "@/components/ui/Badge";
import { EntryCard } from "@/components/EntryCard";
import { DocumentRow } from "@/components/DocumentRow";
import { DocumentUploadForm } from "@/components/forms/DocumentUploadForm";
import { ReminderSection } from "@/components/ReminderSection";
import {
  IconPlus,
  IconShare,
  IconTransfer,
  IconFile,
  IconCalendar,
  IconMoney,
  IconBuilding,
  IconTrash,
} from "@/components/Icons";
import { PROPERTY_TYPES } from "@/lib/enums";
import { addressLine, formatCurrency } from "@/lib/format";

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { getProperty, hydrated, deleteEntry, deleteDocument, deleteProperty } = useStore();

  if (!hydrated) return <Loading />;

  const property = getProperty(id);
  if (!property) {
    return (
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-stone-500">Nemovitost nenalezena.</p>
        <Link href="/prehled" className="btn-secondary mt-4">
          Zpět na přehled
        </Link>
      </div>
    );
  }

  const entries = [...property.entries].sort((a, b) => b.date.localeCompare(a.date));
  const totalCost = property.entries.reduce((s, e) => s + (e.cost ?? 0), 0);

  return (
    <div>
      <BackLink href="/prehled">Zpět na přehled</BackLink>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <Badge color="teal">{PROPERTY_TYPES[property.type]}</Badge>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-stone-900">
            {property.name}
          </h1>
          <p className="mt-1 text-sm text-stone-500">{addressLine(property)}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link href={`/nemovitost/${id}/report`} className="btn-primary btn-sm">
            <IconFile className="h-4 w-4" />
            Vygenerovat report
          </Link>
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
        </div>
      </div>

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
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-stone-900">Historie</h2>
            <Link href={`/nemovitost/${id}/zaznam/novy`} className="btn-primary btn-sm">
              <IconPlus className="h-4 w-4" />
              Přidat záznam
            </Link>
          </div>

          {entries.length === 0 ? (
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
              {entries.map((entry) => (
                <EntryCard key={entry.id} entry={entry} onDelete={() => deleteEntry(id, entry.id)} />
              ))}
            </ol>
          )}
        </div>

        <div className="space-y-6">
          <section className="card p-5">
            <h2 className="text-sm font-semibold text-stone-900">Údaje o nemovitosti</h2>
            <dl className="mt-3 space-y-2.5 text-sm">
              <Row label="Typ" value={PROPERTY_TYPES[property.type]} />
              <Row label="Adresa" value={addressLine(property)} />
              {property.cadastralArea && <Row label="Katastr. území" value={property.cadastralArea} />}
              {property.parcelNumber && <Row label="Parcela / č.p." value={property.parcelNumber} />}
              <Row label="Vlastník" value={property.ownerName} />
            </dl>
            {property.description && (
              <p className="mt-3 border-t border-stone-100 pt-3 text-sm leading-relaxed text-stone-600">
                {property.description}
              </p>
            )}
            <button
              onClick={() => {
                if (confirm("Opravdu smazat tuto nemovitost se všemi záznamy?")) {
                  deleteProperty(id);
                  router.push("/prehled");
                }
              }}
              className="btn-danger btn-sm mt-4 w-full"
            >
              <IconTrash className="h-4 w-4" />
              Smazat nemovitost
            </button>
          </section>

          <ReminderSection propertyId={id} reminders={property.reminders} />

          <section className="card p-5">
            <h2 className="text-sm font-semibold text-stone-900">Dokumenty</h2>
            {property.documents.length > 0 ? (
              <ul className="mt-1 divide-y divide-stone-100">
                {property.documents.map((doc) => (
                  <DocumentRow key={doc.id} doc={doc} onDelete={() => deleteDocument(id, doc.id)} />
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

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
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
