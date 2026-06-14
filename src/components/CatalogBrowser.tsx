"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/data/catalog";
import { formatCZK } from "@/lib/format";
import ProductCard from "./ProductCard";
import { FilterIcon, ChevronDownIcon } from "./Icons";

type Sort = "doporucene" | "nejlevnejsi" | "nejdrazsi" | "hodnoceni" | "nazev";

const SORT_LABELS: Record<Sort, string> = {
  doporucene: "Doporučené",
  nejlevnejsi: "Nejlevnější",
  nejdrazsi: "Nejdražší",
  hodnoceni: "Nejlépe hodnocené",
  nazev: "Název A–Z",
};

export default function CatalogBrowser({ products }: { products: Product[] }) {
  const brands = useMemo(
    () =>
      Array.from(new Set(products.map((p) => p.brand))).sort((a, b) =>
        a.localeCompare(b, "cs")
      ),
    [products]
  );
  const subs = useMemo(
    () => Array.from(new Set(products.map((p) => p.subcategory))),
    [products]
  );
  const [minBound, maxBound] = useMemo(() => {
    const prices = products.map((p) => p.price);
    return [Math.min(...prices), Math.max(...prices)];
  }, [products]);

  const [sort, setSort] = useState<Sort>("doporucene");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [saleOnly, setSaleOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number>(maxBound);
  const [selBrands, setSelBrands] = useState<Set<string>>(new Set());
  const [selSubs, setSelSubs] = useState<Set<string>>(new Set());
  const [drawerOpen, setDrawerOpen] = useState(false);

  function toggle(set: Set<string>, value: string, setter: (s: Set<string>) => void) {
    const next = new Set(set);
    next.has(value) ? next.delete(value) : next.add(value);
    setter(next);
  }

  const filtered = useMemo(() => {
    let list = products.filter((p) => p.price <= maxPrice);
    if (inStockOnly) list = list.filter((p) => p.stock > 0);
    if (saleOnly) list = list.filter((p) => p.originalPrice);
    if (selBrands.size) list = list.filter((p) => selBrands.has(p.brand));
    if (selSubs.size) list = list.filter((p) => selSubs.has(p.subcategory));

    switch (sort) {
      case "nejlevnejsi":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "nejdrazsi":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case "hodnoceni":
        list = [...list].sort((a, b) => b.rating - a.rating);
        break;
      case "nazev":
        list = [...list].sort((a, b) => a.name.localeCompare(b.name, "cs"));
        break;
      default:
        list = [...list].sort(
          (a, b) =>
            Number(Boolean(b.featured)) - Number(Boolean(a.featured)) ||
            b.rating - a.rating
        );
    }
    return list;
  }, [products, maxPrice, inStockOnly, saleOnly, selBrands, selSubs, sort]);

  const activeFilters =
    selBrands.size + selSubs.size + (inStockOnly ? 1 : 0) + (saleOnly ? 1 : 0) + (maxPrice < maxBound ? 1 : 0);

  function reset() {
    setInStockOnly(false);
    setSaleOnly(false);
    setMaxPrice(maxBound);
    setSelBrands(new Set());
    setSelSubs(new Set());
  }

  const Sidebar = (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-bold">Filtry</h3>
        {activeFilters > 0 && (
          <button onClick={reset} className="text-xs font-medium text-[var(--color-accent)]">
            Zrušit ({activeFilters})
          </button>
        )}
      </div>

      {/* Dostupnost */}
      <div>
        <h4 className="text-sm font-semibold mb-2">Dostupnost</h4>
        <label className="flex items-center gap-2 text-sm cursor-pointer py-1">
          <input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} className="accent-[var(--color-accent)] w-4 h-4" />
          Pouze skladem
        </label>
        <label className="flex items-center gap-2 text-sm cursor-pointer py-1">
          <input type="checkbox" checked={saleOnly} onChange={(e) => setSaleOnly(e.target.checked)} className="accent-[var(--color-accent)] w-4 h-4" />
          Pouze v akci
        </label>
      </div>

      {/* Cena */}
      <div>
        <h4 className="text-sm font-semibold mb-2">Cena do</h4>
        <input
          type="range"
          min={minBound}
          max={maxBound}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-[var(--color-accent)]"
        />
        <div className="flex justify-between text-xs text-[var(--color-ink-soft)] mt-1">
          <span>{formatCZK(minBound)}</span>
          <span className="font-semibold text-[var(--color-ink)]">{formatCZK(maxPrice)}</span>
        </div>
      </div>

      {/* Podkategorie */}
      {subs.length > 1 && (
        <div>
          <h4 className="text-sm font-semibold mb-2">Druh zboží</h4>
          <div className="space-y-1 max-h-52 overflow-auto pr-1">
            {subs.map((s) => (
              <label key={s} className="flex items-start gap-2 text-sm cursor-pointer py-0.5">
                <input type="checkbox" checked={selSubs.has(s)} onChange={() => toggle(selSubs, s, setSelSubs)} className="accent-[var(--color-accent)] w-4 h-4 mt-0.5" />
                <span className="text-[var(--color-ink-soft)]">{s}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Značka */}
      <div>
        <h4 className="text-sm font-semibold mb-2">Značka</h4>
        <div className="space-y-1 max-h-52 overflow-auto pr-1">
          {brands.map((b) => (
            <label key={b} className="flex items-center gap-2 text-sm cursor-pointer py-0.5">
              <input type="checkbox" checked={selBrands.has(b)} onChange={() => toggle(selBrands, b, setSelBrands)} className="accent-[var(--color-accent)] w-4 h-4" />
              <span className="text-[var(--color-ink-soft)]">{b}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="grid lg:grid-cols-[240px_1fr] gap-8">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block">
        <div className="sticky top-28 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-5">
          {Sidebar}
        </div>
      </aside>

      <div>
        {/* Toolbar */}
        <div className="flex items-center gap-3 mb-5">
          <button
            onClick={() => setDrawerOpen(true)}
            className="lg:hidden inline-flex items-center gap-2 px-3 py-2 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] text-sm font-medium"
          >
            <FilterIcon className="w-4 h-4" />
            Filtry{activeFilters > 0 && ` (${activeFilters})`}
          </button>

          <span className="text-sm text-[var(--color-ink-soft)]">
            <strong className="text-[var(--color-ink)]">{filtered.length}</strong>{" "}
            {filtered.length === 1 ? "produkt" : filtered.length < 5 ? "produkty" : "produktů"}
          </span>

          <div className="ml-auto relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="appearance-none pl-3 pr-9 py-2 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] text-sm font-medium outline-none focus:border-[var(--color-accent)] cursor-pointer"
            >
              {(Object.keys(SORT_LABELS) as Sort[]).map((s) => (
                <option key={s} value={s}>
                  Řadit: {SORT_LABELS[s]}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-ink-soft)]" />
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-[var(--color-ink-soft)]">
            <p className="text-lg">Žádné zboží neodpovídá filtrům.</p>
            <button onClick={reset} className="mt-2 text-[var(--color-accent)] font-semibold">
              Zrušit filtry
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        )}
      </div>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/40" onClick={() => setDrawerOpen(false)} />
          <div className="w-80 max-w-[85%] bg-[var(--color-surface)] h-full overflow-auto p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="font-bold">Filtry</span>
              <button onClick={() => setDrawerOpen(false)} className="text-2xl leading-none">×</button>
            </div>
            {Sidebar}
            <button
              onClick={() => setDrawerOpen(false)}
              className="mt-6 w-full py-3 rounded-md font-semibold text-white"
              style={{ background: "var(--color-accent)" }}
            >
              Zobrazit {filtered.length} produktů
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
