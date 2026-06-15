import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { IconCalendar, IconFile } from "@/components/Icons";
import { PROPERTY_TYPES, type PropertyType } from "@/lib/enums";
import { addressLine } from "@/lib/format";

type Props = {
  property: {
    id: string;
    name: string;
    type: string;
    street: string | null;
    city: string | null;
    zip: string | null;
    _count: { entries: number; documents: number };
  };
  shared?: boolean;
};

export function PropertyCard({ property, shared }: Props) {
  const typeLabel = PROPERTY_TYPES[property.type as PropertyType] ?? property.type;

  return (
    <Link
      href={`/nemovitost/${property.id}`}
      className="card group flex flex-col p-5 transition hover:border-teal-300 hover:shadow-md"
    >
      <div className="flex items-center gap-2">
        <Badge color="teal">{typeLabel}</Badge>
        {shared && <Badge color="amber">Sdílená se mnou</Badge>}
      </div>
      <h3 className="mt-3 text-lg font-semibold text-stone-900 group-hover:text-teal-800">
        {property.name}
      </h3>
      <p className="mt-1 text-sm text-stone-500">{addressLine(property)}</p>

      <div className="mt-4 flex items-center gap-4 border-t border-stone-100 pt-3 text-xs text-stone-500">
        <span className="inline-flex items-center gap-1.5">
          <IconCalendar className="h-4 w-4" />
          {property._count.entries} záznamů
        </span>
        <span className="inline-flex items-center gap-1.5">
          <IconFile className="h-4 w-4" />
          {property._count.documents} dokumentů
        </span>
      </div>
    </Link>
  );
}
