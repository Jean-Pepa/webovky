"use client";

import { useParams } from "next/navigation";
import { useStore } from "@/lib/store";
import { canSeeProperty, canEditProperty } from "@/lib/access";
import { Loading } from "@/components/Loading";
import { PropertySectionHeader, PropertyNotFound } from "@/components/PropertySectionHeader";
import { ReminderSection } from "@/components/ReminderSection";

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const { getProperty, hydrated, role } = useStore();
  if (!hydrated) return <Loading />;
  const property = getProperty(id);
  if (!property || (role && !canSeeProperty(property, role))) return <PropertyNotFound />;
  const editable = role ? canEditProperty(property, role) : false;

  return (
    <div>
      <PropertySectionHeader id={id} name={property.name} title="Záruky a revize" />
      <p className="mt-1 text-sm text-stone-500">
        Termíny revizí, údržby a konce záruk u této nemovitosti.
      </p>
      <div className="mt-4">
        <ReminderSection propertyId={id} reminders={property.reminders} editable={editable} />
      </div>
    </div>
  );
}
