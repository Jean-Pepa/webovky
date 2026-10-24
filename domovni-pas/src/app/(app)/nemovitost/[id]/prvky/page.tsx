"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useStore, type ElementCategory, type HouseElement, type Property } from "@/lib/store";
import { canEditProperty, canSeeProperty } from "@/lib/access";
import {
  ELEMENT_CATEGORIES,
  ELEMENT_CATEGORY_ORDER,
  ELEMENT_CONDITIONS,
  ELEMENT_CONDITION_COLORS,
  accuracyLabel,
} from "@/lib/elements";
import { Loading } from "@/components/Loading";
import { BackLink } from "@/components/BackLink";
import { Badge } from "@/components/ui/Badge";
import { IconBox, IconPlus, IconSearch, IconShield, IconTrash } from "@/components/Icons";
import { AccuracyIndicator } from "@/components/elements/AccuracyIndicator";
import { CategoryDot } from "@/components/elements/ElementChip";
import { ElementCreatedNotice, ElementForm } from "@/components/elements/ElementForm";
import { IconLayers, IconPencil, IconPin } from "@/components/elements/icons";
import {
  elementHref,
  isPlaced,
  linkSummary,
  matchesQuery,
  sortElements,
} from "@/components/elements/element-utils";

type Panel = { mode: "new" } | { mode: "created"; elementId: string } | null;

export default function ElementsPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ElementsRoute />
    </Suspense>
  );
}

// ?nova=1 otevře formulář nového prvku (klíč = při změně parametru čistý stav)
function ElementsRoute() {
  const nova = useSearchParams().get("nova") === "1";
  return <ElementsContent key={nova ? "nova" : "seznam"} startNew={nova} />;
}

function ElementsContent({ startNew }: { startNew: boolean }) {
  const { id } = useParams<{ id: string }>();
  const { getProperty, hydrated, role, deleteElement } = useStore();
  const [panel, setPanel] = useState<Panel>(startNew ? { mode: "new" } : null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<ElementCategory | "ALL">("ALL");
  const [query, setQuery] = useState("");

  if (!hydrated) return <Loading />;

  const property = getProperty(id);
  if (!property || (role && !canSeeProperty(property, role))) {
    return (
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-stone-500">
          {property ? "K této nemovitosti nemáte přístup." : "Nemovitost nenalezena."}
        </p>
        <Link href="/prehled" className="btn-secondary mt-4">
          Zpět na přehled
        </Link>
      </div>
    );
  }

  const editable = role ? canEditProperty(property, role) : false;
  // formulář nového prvku jen pro toho, kdo smí upravovat (?nova=1 u čtenáře nic neskryje)
  const showNew = editable && panel?.mode === "new";
  const elements = property.elements ?? [];
  const created =
    panel?.mode === "created" ? elements.find((e) => e.id === panel.elementId) : undefined;

  const counts = ELEMENT_CATEGORY_ORDER.map((c) => ({
    cat: c,
    n: elements.filter((e) => e.category === c).length,
  })).filter((x) => x.n > 0);
  // vrstva bez prvků (např. po smazání posledního) už filtr nemá
  const activeFilter = counts.some((c) => c.cat === filter) ? filter : "ALL";
  const visible = sortElements(elements).filter(
    (e) => (activeFilter === "ALL" || e.category === activeFilter) && matchesQuery(e, query),
  );

  function remove(el: HouseElement) {
    const ok = confirm(
      `Smazat prvek „${el.name}“?\n\nNavázané záznamy, dokumenty, termíny a vybavení zůstanou v knize, jen se od prvku odpojí. Pozvánky k tomuto prvku přestanou platit.`,
    );
    if (!ok) return;
    deleteElement(id, el.id);
    if (editingId === el.id) setEditingId(null);
    if (panel?.mode === "created" && panel.elementId === el.id) setPanel(null);
  }

  return (
    <div>
      <BackLink href={`/nemovitost/${id}`}>Zpět na nemovitost</BackLink>

      {!editable && (
        <div className="mt-4 flex items-start gap-3 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
          <IconShield className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <p>Tuto nemovitost máte jen ke čtení.</p>
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight text-stone-900">Prvky domu</h1>
          <p className="mt-1 text-sm text-stone-500">{property.name}</p>
          <p className="mt-2 max-w-xl text-sm text-stone-600">
            Rozvaděč, kotel, okruhy, stoupačky, stěny… Ke každému prvku patří jeho revize, záruky,
            opravy a doklady. U každého vidíte, jak přesně známe jeho polohu.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href={`/nemovitost/${id}/model`} className="btn-secondary">
            <IconBox className="h-4 w-4" />
            Model domu
          </Link>
          {editable && !showNew && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setPanel({ mode: "new" });
              }}
              className="btn-primary"
            >
              <IconPlus className="h-4 w-4" />
              Přidat prvek
            </button>
          )}
        </div>
      </div>

      {showNew && (
        <section className="card mt-6 p-5 sm:p-6">
          <h2 className="text-base font-semibold text-stone-900">Nový prvek</h2>
          <p className="mt-0.5 text-sm text-stone-500">
            Stačí název, vrstva a odkud polohu znáte. Zbytek doplníte kdykoli.
          </p>
          <div className="mt-5">
            <ElementForm
              property={property}
              onSaved={(elementId) => setPanel({ mode: "created", elementId })}
              onCancel={() => setPanel(null)}
            />
          </div>
        </section>
      )}

      {editable && created && (
        <div className="mt-6">
          <ElementCreatedNotice
            property={property}
            element={created}
            onAnother={() => setPanel({ mode: "new" })}
            onClose={() => setPanel(null)}
          />
        </div>
      )}

      {elements.length === 0 ? (
        !showNew && (
          <div className="card mt-6 flex flex-col items-center px-6 py-12 text-center">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-teal-50 text-teal-700">
              <IconLayers className="h-6 w-6" />
            </div>
            <p className="mt-4 text-sm font-medium text-stone-800">Zatím žádné prvky</p>
            <p className="mt-1 max-w-sm text-sm text-stone-500">
              Model domu je páteř knihy: revize patří k rozvaděči, záruka ke kotli, oprava ke
              střešnímu oknu.
              {editable ? " Začněte tím nejdůležitějším." : ""}
            </p>
            {editable && (
              <button
                type="button"
                onClick={() => setPanel({ mode: "new" })}
                className="btn-primary mt-5"
              >
                <IconPlus className="h-4 w-4" />
                Přidat první prvek
              </button>
            )}
          </div>
        )
      ) : (
        <>
          <div className="mt-6 space-y-3">
            <div className="relative">
              <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="input pl-9"
                placeholder="Hledat podle názvu, druhu nebo místnosti…"
                aria-label="Hledat prvek"
              />
            </div>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filtr vrstev">
              <FilterChip active={activeFilter === "ALL"} onClick={() => setFilter("ALL")}>
                Vše <span className="text-stone-400">{elements.length}</span>
              </FilterChip>
              {counts.map(({ cat, n }) => (
                <FilterChip key={cat} active={activeFilter === cat} onClick={() => setFilter(cat)}>
                  <CategoryDot category={cat} />
                  {ELEMENT_CATEGORIES[cat]} <span className="text-stone-400">{n}</span>
                </FilterChip>
              ))}
            </div>
          </div>

          {visible.length === 0 ? (
            <p className="card mt-6 px-5 py-8 text-center text-sm text-stone-500">
              Nic nenalezeno. Zkuste jiné slovo nebo vrstvu.
            </p>
          ) : (
            <div className="mt-6 space-y-6">
              {ELEMENT_CATEGORY_ORDER.map((cat) => {
                const group = visible.filter((e) => e.category === cat);
                if (group.length === 0) return null;
                return (
                  <section key={cat}>
                    <h2 className="flex items-center gap-2 text-sm font-semibold text-stone-900">
                      <CategoryDot category={cat} className="h-3 w-3" />
                      {ELEMENT_CATEGORIES[cat]}
                      <span className="text-xs font-normal text-stone-400">· {group.length}</span>
                    </h2>
                    <ul className="card mt-2 divide-y divide-stone-100">
                      {group.map((el) =>
                        editable && editingId === el.id ? (
                          <li key={el.id} className="p-4 sm:p-5">
                            <h3 className="mb-4 text-sm font-semibold text-stone-900">
                              Upravit prvek
                            </h3>
                            <ElementForm
                              property={property}
                              element={el}
                              onSaved={() => setEditingId(null)}
                              onCancel={() => setEditingId(null)}
                            />
                          </li>
                        ) : (
                          <ElementRow
                            key={el.id}
                            property={property}
                            element={el}
                            editable={editable}
                            onEdit={() => {
                              setPanel(null);
                              setEditingId(el.id);
                            }}
                            onDelete={() => remove(el)}
                          />
                        ),
                      )}
                    </ul>
                  </section>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex min-h-10 items-center gap-1.5 rounded-full border px-3.5 text-sm font-medium transition ${
        active
          ? "border-teal-600 bg-teal-50 text-teal-800"
          : "border-stone-200 bg-white text-stone-700 hover:bg-stone-50"
      }`}
    >
      {children}
    </button>
  );
}

function ElementRow({
  property,
  element: el,
  editable,
  onEdit,
  onDelete,
}: {
  property: Property;
  element: HouseElement;
  editable: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const meta = [el.kind, el.room].filter(Boolean).join(" · ");
  const placed = isPlaced(property, el);
  const links = linkSummary(property, el.id);

  return (
    <li className="flex items-start gap-2 p-2 sm:p-3">
      <Link
        href={elementHref(property.id, el.id)}
        className="min-w-0 flex-1 rounded-xl p-2 transition hover:bg-stone-50"
      >
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="break-words text-sm font-semibold text-stone-900">{el.name}</span>
          <Badge color={ELEMENT_CONDITION_COLORS[el.condition]}>
            {ELEMENT_CONDITIONS[el.condition]}
          </Badge>
        </div>
        {meta && <p className="mt-0.5 break-words text-xs text-stone-500">{meta}</p>}
        <div className="mt-2 flex items-center gap-2 text-xs text-stone-600">
          <AccuracyIndicator element={el} />
          <span className="min-w-0 break-words">{accuracyLabel(el)}</span>
        </div>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
          <span
            className={`inline-flex items-center gap-1 ${placed ? "text-emerald-700" : "text-stone-400"}`}
          >
            <IconPin className="h-3.5 w-3.5" />
            {placed ? "Zakresleno v modelu" : "Nezakresleno"}
          </span>
          <span className="text-stone-500">{links.total ? links.text : "Zatím bez záznamů"}</span>
        </div>
      </Link>
      {editable && (
        <div className="flex shrink-0 flex-col gap-1">
          <button
            type="button"
            onClick={onEdit}
            className="grid h-10 w-10 place-items-center rounded-lg text-stone-500 transition hover:bg-stone-100 hover:text-stone-800"
            aria-label={`Upravit ${el.name}`}
            title="Upravit"
          >
            <IconPencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="grid h-10 w-10 place-items-center rounded-lg text-stone-400 transition hover:bg-red-50 hover:text-red-600"
            aria-label={`Smazat ${el.name}`}
            title="Smazat"
          >
            <IconTrash className="h-4 w-4" />
          </button>
        </div>
      )}
    </li>
  );
}
