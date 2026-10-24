import Link from "next/link";
import type { HouseElement, Property } from "@/lib/store";
import { ELEMENT_CATEGORY_COLORS, ELEMENT_CATEGORIES } from "@/lib/elements";
import { elementHref } from "./element-utils";

export function CategoryDot({
  category,
  className = "h-2.5 w-2.5",
}: {
  category: HouseElement["category"];
  className?: string;
}) {
  return (
    <span
      className={`inline-block shrink-0 rounded-full ${className}`}
      style={{ backgroundColor: ELEMENT_CATEGORY_COLORS[category] }}
      aria-hidden
    />
  );
}

// Štítek prvku (barevná tečka vrstvy + název). S href je to odkaz na „Vše o prvku".
export function ElementChip({ element, href }: { element: HouseElement; href?: string }) {
  const body = (
    <>
      <CategoryDot category={element.category} className="h-2 w-2" />
      <span className="truncate">{element.name}</span>
    </>
  );
  const cls =
    "inline-flex min-h-8 max-w-full items-center gap-1.5 rounded-full border border-stone-200 bg-white px-2.5 py-1 text-xs font-medium text-stone-700";
  if (!href) {
    return (
      <span className={cls} title={ELEMENT_CATEGORIES[element.category]}>
        {body}
      </span>
    );
  }
  // neviditelné rozšíření plochy pro klepnutí na 40 px
  return (
    <Link
      href={href}
      title={`${ELEMENT_CATEGORIES[element.category]} — vše o prvku`}
      className={`${cls} relative transition after:absolute after:inset-x-0 after:-inset-y-1 hover:border-teal-300 hover:bg-teal-50 hover:text-teal-800`}
    >
      {body}
    </Link>
  );
}

// Štítky navázaných prvků podle id (neexistující id tiše vynechá)
export function ElementChips({
  property,
  ids,
  excludeId,
  linked = true,
  className = "",
}: {
  property: Property;
  ids?: string[];
  excludeId?: string; // na stránce prvku nevypisovat ten samý
  linked?: boolean;
  className?: string;
}) {
  const els = (ids ?? [])
    .filter((x) => x !== excludeId)
    .map((x) => property.elements?.find((e) => e.id === x))
    .filter((e): e is HouseElement => !!e);
  if (els.length === 0) return null;
  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {els.map((el) => (
        <ElementChip
          key={el.id}
          element={el}
          href={linked ? elementHref(property.id, el.id) : undefined}
        />
      ))}
    </div>
  );
}
