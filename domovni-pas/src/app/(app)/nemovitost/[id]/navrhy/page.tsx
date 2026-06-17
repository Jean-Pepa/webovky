"use client";

import { useParams } from "next/navigation";
import { useStore } from "@/lib/store";
import { canSeeProperty, canEditProperty } from "@/lib/access";
import { Loading } from "@/components/Loading";
import { PropertySectionHeader, PropertyNotFound } from "@/components/PropertySectionHeader";
import { DesignSection } from "@/components/DesignSection";

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const { getProperty, hydrated, role } = useStore();
  if (!hydrated) return <Loading />;
  const property = getProperty(id);
  if (!property || (role && !canSeeProperty(property, role))) return <PropertyNotFound />;
  const editable = role ? canEditProperty(property, role) : false;

  return (
    <div>
      <PropertySectionHeader id={id} name={property.name} title="Návrhy" />
      <DesignSection propertyId={id} designs={property.designs ?? []} editable={editable} />
    </div>
  );
}
