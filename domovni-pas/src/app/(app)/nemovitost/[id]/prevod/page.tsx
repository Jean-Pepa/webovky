"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useStore } from "@/lib/store";
import { Loading } from "@/components/Loading";
import { BackLink } from "@/components/BackLink";
import { TransferForm } from "@/components/forms/TransferForm";
import { IconTransfer } from "@/components/Icons";
import { formatDate } from "@/lib/format";

export default function TransferPage() {
  const { id } = useParams<{ id: string }>();
  const { getProperty, hydrated } = useStore();
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

  return (
    <div className="mx-auto max-w-2xl">
      <BackLink href={`/nemovitost/${id}`}>Zpět na nemovitost</BackLink>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight text-stone-900">
        Převod vlastnictví
      </h1>
      <p className="mt-1 text-sm text-stone-500">
        Předejte <strong className="text-stone-700">{property.name}</strong> i s celou historií
        novému majiteli. To je jádro hodnoty — pas nemovitost provází i po prodeji.
      </p>

      <div className="card mt-6 p-6">
        <div className="mb-5 flex items-start gap-3 rounded-lg bg-teal-50 p-4 text-sm text-teal-900">
          <IconTransfer className="mt-0.5 h-5 w-5 shrink-0 text-teal-700" />
          <p>
            Po předání zůstane v historii auditní záznam o převodu. Aktuální vlastník:{" "}
            <strong>{property.ownerName}</strong>.
          </p>
        </div>

        <TransferForm propertyId={id} />
      </div>

      {property.transfers.length > 0 && (
        <div className="card mt-6 p-6">
          <h2 className="text-sm font-semibold text-stone-900">Historie převodů</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {property.transfers.map((t) => (
              <li key={t.id} className="flex flex-wrap justify-between gap-x-3 text-stone-600">
                <span>
                  {t.fromName} → <strong className="text-stone-800">{t.toName}</strong>
                  {t.note ? ` · ${t.note}` : ""}
                </span>
                <span className="shrink-0 text-stone-400">{formatDate(t.date)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
