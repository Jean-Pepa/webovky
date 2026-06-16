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
  const p = property;
  const has =
    p.investor ||
    p.floorArea != null ||
    p.builtUpArea != null ||
    p.energyClass ||
    p.architect ||
    p.designer ||
    p.constructionSystem ||
    p.materials ||
    p.contractors ||
    p.yearBuilt != null;
  if (!has) return null;

  const contractorLines = (p.contractors ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  return (
    <section className={`card p-5 ${className}`}>
      <div className="flex items-center gap-2">
        <IconBuilding className="h-4 w-4 text-teal-700" />
        <h2 className="text-sm font-semibold text-stone-900">Architektonická karta</h2>
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-3">
        {p.yearBuilt != null && <Field label="Rok výstavby" value={String(p.yearBuilt)} />}
        {p.architect && <Field label="Autor projektu" value={p.architect} />}
        {p.designer && <Field label="Projektant" value={p.designer} />}
        {p.investor && <Field label="Investor" value={p.investor} />}
        {p.constructionSystem && <Field label="Konstrukční systém" value={p.constructionSystem} />}
        {p.floorArea != null && <Field label="Užitná plocha" value={`${p.floorArea} m²`} />}
        {p.builtUpArea != null && <Field label="Zastavěná plocha" value={`${p.builtUpArea} m²`} />}
        {p.energyClass && (
          <div>
            <dt className="text-xs text-stone-400">Energetická třída</dt>
            <dd className="mt-0.5">
              <Badge color="teal">{p.energyClass}</Badge>
            </dd>
          </div>
        )}
      </dl>

      {p.materials && (
        <div className="mt-4 border-t border-stone-100 pt-3">
          <p className="text-xs text-stone-400">Materiály</p>
          <p className="mt-0.5 text-sm text-stone-700">{p.materials}</p>
        </div>
      )}

      {contractorLines.length > 0 && (
        <div className="mt-4 border-t border-stone-100 pt-3">
          <p className="text-xs text-stone-400">Dodavatelé</p>
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
