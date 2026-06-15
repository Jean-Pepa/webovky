import { notFound, redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateProperty } from "@/lib/actions/property";
import { PropertyForm } from "@/components/forms/PropertyForm";
import { BackLink } from "@/components/BackLink";

export const metadata = { title: "Upravit nemovitost — Domovní pas" };

export default async function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser();

  const property = await prisma.property.findUnique({ where: { id } });
  if (!property) notFound();
  if (property.ownerId !== user.id) redirect(`/nemovitost/${id}`);

  return (
    <div className="mx-auto max-w-2xl">
      <BackLink href={`/nemovitost/${id}`}>Zpět na nemovitost</BackLink>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight text-stone-900">
        Upravit nemovitost
      </h1>
      <div className="card mt-6 p-6">
        <PropertyForm action={updateProperty} initial={property} submitLabel="Uložit změny" />
      </div>
    </div>
  );
}
