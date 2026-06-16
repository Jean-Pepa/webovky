import { Badge } from "@/components/ui/Badge";
import { IconBuilding } from "@/components/Icons";
import type { Property } from "@/lib/store";

export function ProjectCard({
  property,
  className = "",
}: {
  property: Property;
  className?: string;
}) {
  const has =
    property.investor ||
    property.floorArea != null ||
    property.energyClass ||
    property.architect ||
    property.contractors;
  if (!has) return null;

  const contractorLines = (property.contractors ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  return (
    <section className={`card p-5 ${className}`}>
      <div className="flex items-center gap-2">
        <IconBuilding className="h-4 w-4 text-teal-700" />
        <h2 className="text-sm font-semibold text-stone-900">Projektová karta</h2>
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-4">
        {property.investor && <Field label="Investor" value={property.investor} />}
        {property.architect && <Field label="Architekt" value={property.architect} />}
        {property.floorArea != null && <Field label="Plocha" value={`${property.floorArea} m²`} />}
        {property.energyClass && (
          <div>
            <dt className="text-xs text-stone-400">Energetická třída</dt>
            <dd className="mt-0.5">
              <Badge color="teal">{property.energyClass}</Badge>
            </dd>
          </div>
        )}
      </dl>

      {contractorLines.length > 0 && (
        <div className="mt-4 border-t border-stone-100 pt-3">
          <p className="text-xs text-stone-400">Kontakty na dodavatele</p>
          <ul className="mt-1 space-y-0.5 text-sm text-stone-700">
            {contractorLines.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-stone-400">{label}</dt>
      <dd className="font-medium text-stone-800">{value}</dd>
    </div>
  );
}
