"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useStore } from "@/lib/store";
import { Loading } from "@/components/Loading";
import { EntryForm } from "@/components/forms/EntryForm";
import { BackLink } from "@/components/BackLink";

export default function NewEntryPage() {
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
      <h1 className="mt-4 text-2xl font-semibold tracking-tight text-stone-900">Nový záznam</h1>
      <p className="mt-1 text-sm text-stone-500">{property.name}</p>
      <div className="card mt-6 p-6">
        <EntryForm propertyId={id} />
      </div>
    </div>
  );
}
