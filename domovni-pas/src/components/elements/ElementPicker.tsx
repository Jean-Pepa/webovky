"use client";

import Link from "next/link";
import { useId, useState } from "react";
import type { HouseElement } from "@/lib/store";
import { ELEMENT_CATEGORIES, ELEMENT_CATEGORY_ORDER } from "@/lib/elements";
import { IconCheck, IconChevronDown, IconClose, IconSearch } from "@/components/Icons";
import { CategoryDot } from "./ElementChip";
import { matchesQuery, sortElements } from "./element-utils";

// Výběr prvků domu (víc najednou), seskupený podle vrstev. Řízený: value + onChange.
// S `name` přidá skrytá pole, takže formulář přes FormData dostane fd.getAll(name).
export function ElementPicker({
  elements,
  value,
  onChange,
  name,
  label = "Týká se prvku",
  hint,
  propertyId,
  defaultOpen = false,
}: {
  elements: HouseElement[];
  value: string[];
  onChange: (ids: string[]) => void;
  name?: string;
  label?: string;
  hint?: string;
  propertyId?: string; // pro odkaz „Přidat prvek", když dům žádné nemá
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const [query, setQuery] = useState("");
  const listId = useId();

  const byId = new Map(elements.map((e) => [e.id, e]));
  const selected = value.map((id) => byId.get(id)).filter((e): e is HouseElement => !!e);
  const sorted = sortElements(elements);
  const visible = sorted.filter((e) => matchesQuery(e, query));

  function toggle(id: string) {
    onChange(value.includes(id) ? value.filter((x) => x !== id) : [...value, id]);
  }

  if (elements.length === 0) {
    return (
      <div>
        <p className="label">{label}</p>
        <p className="text-sm text-stone-500">
          Dům zatím nemá žádné prvky.{" "}
          {propertyId && (
            <Link
              href={`/nemovitost/${propertyId}/prvky?nova=1`}
              className="font-medium text-teal-700 hover:underline"
            >
              Přidat prvek
            </Link>
          )}
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="label">{label}</p>
      {name && value.map((id) => <input key={id} type="hidden" name={name} value={id} />)}

      <div className="flex flex-wrap items-center gap-2">
        {selected.map((el) => (
          <button
            key={el.id}
            type="button"
            onClick={() => toggle(el.id)}
            className="inline-flex min-h-10 max-w-full items-center gap-1.5 rounded-full border border-teal-200 bg-teal-50 py-1.5 pl-3 pr-2 text-sm font-medium text-teal-800 transition hover:bg-teal-100"
            aria-label={`Odebrat prvek ${el.name}`}
          >
            <CategoryDot category={el.category} className="h-2 w-2" />
            <span className="truncate">{el.name}</span>
            <IconClose className="h-4 w-4 shrink-0 text-teal-600" />
          </button>
        ))}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="btn-secondary min-h-10 py-2"
          aria-expanded={open}
          aria-controls={open ? listId : undefined}
        >
          {selected.length ? "Upravit výběr" : "Vybrat prvky"}
          <IconChevronDown className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`} />
        </button>
      </div>
      {hint && <p className="mt-1.5 text-xs text-stone-400">{hint}</p>}

      {open && (
        <div id={listId} className="mt-2 rounded-xl border border-stone-200 bg-white">
          {elements.length > 6 && (
            <div className="relative border-b border-stone-100 p-2">
              <IconSearch className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                // Enter (na mobilu „Hledat") nesmí odeslat formulář, ve kterém výběr je
                onKeyDown={(e) => {
                  if (e.key === "Enter") e.preventDefault();
                }}
                enterKeyHint="search"
                className="input pl-9"
                placeholder="Hledat prvek…"
                aria-label="Hledat prvek"
              />
            </div>
          )}
          <div className="max-h-80 overflow-y-auto overscroll-contain p-1">
            {visible.length === 0 && (
              <p className="px-3 py-4 text-sm text-stone-500">Nic nenalezeno.</p>
            )}
            {ELEMENT_CATEGORY_ORDER.map((cat) => {
              const group = visible.filter((e) => e.category === cat);
              if (group.length === 0) return null;
              return (
                <div key={cat} className="py-1">
                  <p className="flex items-center gap-2 px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-stone-400">
                    <CategoryDot category={cat} className="h-2 w-2" />
                    {ELEMENT_CATEGORIES[cat]}
                  </p>
                  {group.map((el) => {
                    const on = value.includes(el.id);
                    const meta = [el.kind, el.room].filter(Boolean).join(" · ");
                    return (
                      <button
                        key={el.id}
                        type="button"
                        onClick={() => toggle(el.id)}
                        aria-pressed={on}
                        className={`flex min-h-11 w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition ${
                          on ? "bg-teal-50" : "hover:bg-stone-50"
                        }`}
                      >
                        <span
                          className={`grid h-5 w-5 shrink-0 place-items-center rounded-md border ${
                            on
                              ? "border-teal-600 bg-teal-600 text-white"
                              : "border-stone-300 text-transparent"
                          }`}
                          aria-hidden
                        >
                          <IconCheck className="h-3.5 w-3.5" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block break-words text-sm font-medium text-stone-800">
                            {el.name}
                          </span>
                          {meta && <span className="block truncate text-xs text-stone-400">{meta}</span>}
                        </span>
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
          <div className="flex justify-end border-t border-stone-100 p-2">
            <button type="button" onClick={() => setOpen(false)} className="btn-ghost min-h-10 py-2">
              Hotovo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
