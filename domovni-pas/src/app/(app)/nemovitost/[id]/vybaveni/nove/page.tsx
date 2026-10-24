"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useStore } from "@/lib/store";
import { canEditProperty, canSeeProperty } from "@/lib/access";
import { findElement } from "@/lib/elements";
import { Loading } from "@/components/Loading";
import { InventoryForm } from "@/components/forms/InventoryForm";
import { BackLink } from "@/components/BackLink";
import { elementHref } from "@/components/elements/element-utils";

export default function NewInventoryPage() {
  return (
    <Suspense fallback={<Loading />}>
      <NewInventory />
    </Suspense>
  );
}

function NewInventory() {
  const { id } = useParams<{ id: string }>();
  const prvek = useSearchParams().get("prvek") ?? undefined;
  const { getProperty, hydrated, role } = useStore();
  if (!hydrated) return <Loading />;

  const property = getProperty(id);
  const editable = property && role ? canEditProperty(property, role) : false;
  if (!property || (role && !canSeeProperty(property, role)) || !editable) {
    return (
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-stone-500">
          {!property
            ? "Nemovitost nenalezena."
            : role && !canSeeProperty(property, role)
              ? "K této nemovitosti nemáte přístup."
              : "Tuto nemovitost máte jen ke čtení — vybavení přidat nelze."}
        </p>
        <Link href={property ? `/nemovitost/${id}` : "/prehled"} className="btn-secondary mt-4">
          {property ? "Zpět na nemovitost" : "Zpět na přehled"}
        </Link>
      </div>
    );
  }

  const element = findElement(property, prvek);

  return (
    <div className="mx-auto max-w-2xl">
      {element ? (
        <BackLink href={elementHref(id, element.id)}>Zpět na prvek</BackLink>
      ) : (
        <BackLink href={`/nemovitost/${id}`}>Zpět na nemovitost</BackLink>
      )}
      <h1 className="mt-4 text-2xl font-semibold tracking-tight text-stone-900">
        Přidat vybavení
      </h1>
      <p className="mt-1 break-words text-sm text-stone-500">
        {property.name}
        {element ? ` · ${element.name}` : ""}
      </p>
      <div className="card mt-6 p-5 sm:p-6">
        <InventoryForm key={element?.id ?? "-"} propertyId={id} initialElementId={element?.id} />
      </div>
    </div>
  );
}
