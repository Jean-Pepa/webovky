import { notFound } from "next/navigation";
import { requireUser, getOwnedProperty } from "@/lib/auth";
import { EntryForm } from "@/components/forms/EntryForm";
import { BackLink } from "@/components/BackLink";

export const metadata = { title: "Nový záznam — Domovní pas" };

export default async function NewEntryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser();
  const property = await getOwnedProperty(id, user.id);
  if (!property) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <BackLink href={`/nemovitost/${id}`}>Zpět na nemovitost</BackLink>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight text-stone-900">Nový záznam</h1>
      <p className="mt-1 text-sm text-stone-500">{property.name}</p>
      <div className="card mt-6 p-6">
        <EntryForm propertyId={id} />
      </div>
    </div>
  );
}
