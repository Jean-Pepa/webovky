"use client";

import { useParams } from "next/navigation";
import { useStore } from "@/lib/store";
import { canSeeProperty } from "@/lib/access";
import { Loading } from "@/components/Loading";
import { PropertySectionHeader, PropertyNotFound } from "@/components/PropertySectionHeader";
import { SvjDetailSection } from "@/components/SvjDetailSection";

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const { getProperty, hydrated, role } = useStore();
  if (!hydrated) return <Loading />;
  const property = getProperty(id);
  if (!property || (role && !canSeeProperty(property, role))) return <PropertyNotFound />;

  return (
    <div>
      <PropertySectionHeader id={id} name={property.name} title="Detail společenství" />
      <div className="mt-6">
        <SvjDetailSection property={property} />
      </div>
    </div>
  );
}
