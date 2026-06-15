import { notFound, redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TransferForm } from "@/components/forms/TransferForm";
import { BackLink } from "@/components/BackLink";
import { IconTransfer } from "@/components/Icons";
import { formatDate } from "@/lib/format";

export const metadata = { title: "Převod vlastnictví — Domovní pas" };

export default async function TransferPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser();

  const property = await prisma.property.findUnique({
    where: { id },
    include: { transfers: { orderBy: { createdAt: "desc" } } },
  });
  if (!property) notFound();
  if (property.ownerId !== user.id) redirect(`/nemovitost/${id}`);

  return (
    <div className="mx-auto max-w-2xl">
      <BackLink href={`/nemovitost/${id}`}>Zpět na nemovitost</BackLink>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight text-stone-900">
        Převod vlastnictví
      </h1>
      <p className="mt-1 text-sm text-stone-500">
        Předejte záznam nemovitosti <strong className="text-stone-700">{property.name}</strong> i s
        celou historií novému majiteli. Tohle je jádro hodnoty Domovního pasu.
      </p>

      <div className="card mt-6 p-6">
        <div className="mb-5 flex items-start gap-3 rounded-lg bg-teal-50 p-4 text-sm text-teal-900">
          <IconTransfer className="mt-0.5 h-5 w-5 shrink-0 text-teal-700" />
          <p>
            Po převodu se nový majitel stane vlastníkem, vy ztratíte přístup a v historii zůstane
            auditní záznam o předání.
          </p>
        </div>

        <TransferForm propertyId={id} />
      </div>

      {property.transfers.length > 0 && (
        <div className="card mt-6 p-6">
          <h2 className="text-sm font-semibold text-stone-900">Historie převodů</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {property.transfers.map((t) => (
              <li key={t.id} className="flex justify-between gap-3 text-stone-600">
                <span>
                  {t.fromEmail ?? "—"} → {t.toEmail ?? "—"}
                </span>
                <span className="shrink-0 text-stone-400">{formatDate(t.createdAt)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
