"use client";

import Link from "next/link";
import type { Property } from "@/lib/store";
import {
  ELEMENT_CATEGORIES,
  ELEMENT_CATEGORY_ORDER,
  ELEMENT_CONDITIONS,
  ELEMENT_CONDITION_COLORS,
} from "@/lib/elements";
import { Badge } from "@/components/ui/Badge";
import { IconArrowRight, IconBox, IconPlus } from "@/components/Icons";
import { AccuracyIndicator } from "./AccuracyIndicator";
import { CategoryDot } from "./ElementChip";
import { IconLayers } from "./icons";
import { elementHref, isPlaced, sortByAttention } from "./element-utils";

const PREVIEW = 6;

// Přehled prvků domu na stránce nemovitosti — model domu je páteř knihy.
export function ElementsSection({ property, editable }: { property: Property; editable: boolean }) {
  const id = property.id;
  const elements = property.elements ?? [];

  const header = (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <IconLayers className="h-4 w-4 text-teal-700" />
        <h2 className="text-sm font-semibold text-stone-900">Prvky domu</h2>
        {elements.length > 0 && <span className="text-xs text-stone-400">· {elements.length}</span>}
      </div>
      {elements.length > 0 && (
        <div className="flex flex-wrap gap-1">
          <Link href={`/nemovitost/${id}/model`} className="btn-ghost btn-sm min-h-10 text-teal-700">
            <IconBox className="h-4 w-4" />
            Model domu
          </Link>
          {editable && (
            <Link
              href={`/nemovitost/${id}/prvky?nova=1`}
              className="btn-ghost btn-sm min-h-10 text-teal-700"
            >
              <IconPlus className="h-4 w-4" />
              Přidat prvek
            </Link>
          )}
        </div>
      )}
    </div>
  );

  if (elements.length === 0) {
    return (
      <section className="card mt-6 p-5">
        {header}
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-stone-600">
          Model domu je páteř knihy: každá revize, záruka nebo oprava patří ke konkrétnímu prvku —
          revize k rozvaděči, záruka ke kotli.
          {editable ? " Začněte tím nejdůležitějším." : " Prvky zatím nikdo nezadal."}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {editable && (
            <Link href={`/nemovitost/${id}/prvky?nova=1`} className="btn-primary">
              <IconPlus className="h-4 w-4" />
              Přidat první prvek
            </Link>
          )}
          <Link href={`/nemovitost/${id}/model`} className="btn-secondary">
            <IconBox className="h-4 w-4" />
            Model domu
          </Link>
        </div>
      </section>
    );
  }

  const counts = ELEMENT_CATEGORY_ORDER.map((c) => ({
    cat: c,
    n: elements.filter((e) => e.category === c).length,
  })).filter((x) => x.n > 0);
  const placed = elements.filter((e) => isPlaced(property, e)).length;
  const preview = sortByAttention(elements).slice(0, PREVIEW);
  const rest = elements.length - preview.length;

  return (
    <section className="card mt-6 p-5">
      {header}

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-stone-600">
        {counts.map(({ cat, n }) => (
          <span key={cat} className="inline-flex items-center gap-1.5">
            <CategoryDot category={cat} />
            {ELEMENT_CATEGORIES[cat]} <span className="font-semibold text-stone-800">{n}</span>
          </span>
        ))}
      </div>
      <p className="mt-1.5 text-xs text-stone-400">
        Zakresleno v modelu: {placed} z {elements.length}
      </p>

      <ul className="mt-3 divide-y divide-stone-100">
        {preview.map((el) => {
          const meta = [el.kind, el.room].filter(Boolean).join(" · ");
          return (
            <li key={el.id}>
              <Link
                href={elementHref(id, el.id)}
                className="-mx-2 flex min-h-12 items-center gap-3 rounded-lg px-2 py-2.5 transition hover:bg-stone-50"
              >
                <CategoryDot category={el.category} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-stone-800">{el.name}</span>
                  <span className="mt-0.5 flex min-w-0 items-center gap-2 text-xs text-stone-400">
                    <AccuracyIndicator element={el} size="sm" />
                    {meta && <span className="truncate">{meta}</span>}
                  </span>
                </span>
                <span className="shrink-0">
                  <Badge color={ELEMENT_CONDITION_COLORS[el.condition]}>
                    {ELEMENT_CONDITIONS[el.condition]}
                  </Badge>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      <Link
        href={`/nemovitost/${id}/prvky`}
        className="mt-2 inline-flex min-h-10 items-center gap-1.5 text-sm font-medium text-teal-700 hover:underline"
      >
        {rest > 0 ? `Všechny prvky (další ${rest})` : "Všechny prvky"}
        <IconArrowRight className="h-4 w-4" />
      </Link>
    </section>
  );
}
