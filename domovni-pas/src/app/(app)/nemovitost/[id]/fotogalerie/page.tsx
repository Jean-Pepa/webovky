"use client";

import { useParams } from "next/navigation";
import { useStore } from "@/lib/store";
import { canSeeProperty } from "@/lib/access";
import { Loading } from "@/components/Loading";
import { PropertySectionHeader, PropertyNotFound } from "@/components/PropertySectionHeader";
import { GallerySection } from "@/components/GallerySection";

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const { getProperty, hydrated, role } = useStore();
  if (!hydrated) return <Loading />;
  const property = getProperty(id);
  if (!property || (role && !canSeeProperty(property, role))) return <PropertyNotFound />;

  return (
    <div>
      <PropertySectionHeader id={id} name={property.name} title="Fotogalerie" />
      <div className="mt-6">
        <GallerySection propertyId={id} photos={property.gallery ?? []} />
      </div>
    </div>
  );
}
