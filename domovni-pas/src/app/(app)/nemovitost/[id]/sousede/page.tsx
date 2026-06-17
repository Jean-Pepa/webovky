"use client";

import { useParams } from "next/navigation";
import { useStore } from "@/lib/store";
import { canSeeProperty } from "@/lib/access";
import { Loading } from "@/components/Loading";
import { PropertySectionHeader, PropertyNotFound } from "@/components/PropertySectionHeader";

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const { getProperty, hydrated, role } = useStore();
  if (!hydrated) return <Loading />;
  const property = getProperty(id);
  if (!property || (role && !canSeeProperty(property, role))) return <PropertyNotFound />;

  const units = [...(property.units ?? [])].sort((a, b) => a.label.localeCompare(b.label));

  return (
    <div>
      <PropertySectionHeader id={id} name={property.name} title="Vlastníci a sousedé" />
      {units.length === 0 ? (
        <p className="mt-6 text-sm text-stone-500">
          Zatím tu nejsou žádní vlastníci. Přidejte je v sekci „Jednotky a místnosti".
        </p>
      ) : (
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {units.map((u) => (
            <div key={u.id} className="card flex items-center gap-3 p-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-teal-700 text-sm font-semibold text-white">
                {initials(u.ownerName)}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-stone-900">{u.ownerName}</p>
                <p className="truncate text-xs text-stone-400">
                  Jednotka {u.label}
                  {u.floor ? ` · ${u.floor}` : ""}
                </p>
                {u.contact && (
                  <p className="truncate text-xs text-teal-700">{u.contact}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
