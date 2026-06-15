"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useStore } from "@/lib/store";
import { Loading } from "@/components/Loading";
import { PropertyForm } from "@/components/forms/PropertyForm";
import { BackLink } from "@/components/BackLink";

export default function EditPropertyPage() {
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
        Upravit nemovitost
      </h1>
      <div className="card mt-6 p-6">
        <PropertyForm initial={property} />
      </div>
    </div>
  );
}
