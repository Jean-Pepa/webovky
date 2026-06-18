"use client";

import { useParams } from "next/navigation";
import { useStore } from "@/lib/store";
import { canSeeProperty, canEditProperty, canContributeToProperty } from "@/lib/access";
import { Loading } from "@/components/Loading";
import { PropertySectionHeader, PropertyNotFound } from "@/components/PropertySectionHeader";
import { PhotoGallery } from "@/components/PhotoGallery";

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const { getProperty, hydrated, role } = useStore();
  if (!hydrated) return <Loading />;
  const property = getProperty(id);
  if (!property || (role && !canSeeProperty(property, role))) return <PropertyNotFound />;
  const editable = role ? canEditProperty(property, role) : false;
  const canAdd = role ? canContributeToProperty(property, role) : false;

  return (
    <div>
      <PropertySectionHeader id={id} name={property.name} title="Fotodokumentace" />
      <div className="mt-6">
        <PhotoGallery
          propertyId={id}
          photos={property.photos ?? []}
          systems={property.systems ?? []}
          editable={editable}
          canAdd={canAdd}
        />
      </div>
    </div>
  );
}
