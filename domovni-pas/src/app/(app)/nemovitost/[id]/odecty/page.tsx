"use client";

import { useParams } from "next/navigation";
import { useStore } from "@/lib/store";
import { canSeeProperty, canContributeToProperty } from "@/lib/access";
import { Loading } from "@/components/Loading";
import { PropertySectionHeader, PropertyNotFound } from "@/components/PropertySectionHeader";
import { ReadingsSection } from "@/components/ReadingsSection";

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const { getProperty, hydrated, role } = useStore();
  if (!hydrated) return <Loading />;
  const property = getProperty(id);
  if (!property || (role && !canSeeProperty(property, role))) return <PropertyNotFound />;
  const canAdd = role ? canContributeToProperty(property, role) : false;

  return (
    <div>
      <PropertySectionHeader id={id} name={property.name} title="Odečty měřidel" />
      <div className="mt-6">
        <ReadingsSection propertyId={id} systems={property.systems ?? []} canAdd={canAdd} />
      </div>
    </div>
  );
}
