"use client";

import { useParams } from "next/navigation";
import { useStore } from "@/lib/store";
import { canEditProperty } from "@/lib/access";
import { Loading } from "@/components/Loading";
import { PropertySectionHeader, PropertyNotFound } from "@/components/PropertySectionHeader";
import { ImportExportSection } from "@/components/ImportExportSection";

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const { getProperty, hydrated, role } = useStore();
  if (!hydrated) return <Loading />;
  const property = getProperty(id);
  if (!property || (role && !canEditProperty(property, role))) return <PropertyNotFound />;

  return (
    <div>
      <PropertySectionHeader id={id} name={property.name} title="Import / Export" />
      <p className="mt-2 max-w-2xl text-sm text-stone-500">
        Nasajte data z exportu jiné SVJ aplikace (CSV/JSON), nebo si pas budovy zazálohujte.
      </p>
      <div className="mt-6">
        <ImportExportSection property={property} />
      </div>
    </div>
  );
}
