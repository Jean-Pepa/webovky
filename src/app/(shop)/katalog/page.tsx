import Link from "next/link";
import { CATEGORIES, PRODUCTS, searchProducts } from "@/data/catalog";
import CatalogBrowser from "@/components/CatalogBrowser";

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const products = query ? searchProducts(query) : PRODUCTS;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <nav className="text-sm text-[var(--color-ink-soft)] mb-3">
        <Link href="/" className="hover:text-[var(--color-accent)]">Úvod</Link>
        <span className="mx-2">/</span>
        <span>Katalog</span>
      </nav>

      <h1 className="text-3xl font-bold">
        {query ? <>Výsledky pro „{query}“</> : "Katalog zboží"}
      </h1>

      {/* Category quick links */}
      <div className="flex flex-wrap gap-2 mt-5 mb-8">
        <span className="px-3 py-1.5 rounded-full text-sm font-semibold text-white" style={{ background: "var(--color-steel-800)" }}>
          Vše
        </span>
        {CATEGORIES.map((c) => (
          <Link
            key={c.slug}
            href={`/katalog/${c.slug}`}
            className="px-3 py-1.5 rounded-full text-sm font-medium border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition"
          >
            {c.name}
          </Link>
        ))}
      </div>

      {products.length === 0 ? (
        <div className="py-16 text-center text-[var(--color-ink-soft)]">
          <p className="text-lg">Pro „{query}“ jsme nic nenašli.</p>
          <Link href="/katalog" className="text-[var(--color-accent)] font-semibold">
            Zobrazit celý katalog →
          </Link>
        </div>
      ) : (
        <CatalogBrowser products={products} />
      )}
    </div>
  );
}
