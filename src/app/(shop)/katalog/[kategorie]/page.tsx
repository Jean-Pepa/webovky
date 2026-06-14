import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CATEGORIES,
  getCategory,
  productsByCategory,
} from "@/data/catalog";
import { CategoryIcon } from "@/components/Icons";
import ProductCard from "@/components/ProductCard";

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ kategorie: c.slug }));
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ kategorie: string }>;
}) {
  const { kategorie } = await params;
  const category = getCategory(kategorie);
  if (!category) notFound();

  const products = productsByCategory(category.slug);

  return (
    <div>
      {/* Category header */}
      <div className="bg-[var(--color-steel-900)] text-white">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <nav className="text-sm text-[var(--color-steel-400)] mb-4">
            <Link href="/" className="hover:text-white">Úvod</Link>
            <span className="mx-2">/</span>
            <Link href="/katalog" className="hover:text-white">Katalog</Link>
            <span className="mx-2">/</span>
            <span className="text-white">{category.name}</span>
          </nav>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-lg grid place-items-center" style={{ background: "var(--color-accent)" }}>
              <CategoryIcon icon={category.icon} className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold">{category.name}</h1>
              <p className="text-[var(--color-steel-200)]">{category.tagline}</p>
            </div>
          </div>
          <p className="mt-5 max-w-2xl text-[var(--color-steel-200)]">
            {category.description}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10 grid lg:grid-cols-[220px_1fr] gap-8">
        {/* Subcategories sidebar */}
        <aside>
          <h3 className="font-semibold mb-3">Podkategorie</h3>
          <ul className="space-y-1.5 text-sm">
            {category.subcategories.map((s) => (
              <li
                key={s}
                className="px-3 py-2 rounded-md bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-ink-soft)]"
              >
                {s}
              </li>
            ))}
          </ul>

          <div className="mt-6 space-y-2">
            <h3 className="font-semibold mb-2">Další obory</h3>
            {CATEGORIES.filter((c) => c.slug !== category.slug).map((c) => (
              <Link
                key={c.slug}
                href={`/katalog/${c.slug}`}
                className="block px-3 py-2 rounded-md text-sm hover:text-[var(--color-accent)]"
              >
                {c.name} →
              </Link>
            ))}
          </div>
        </aside>

        {/* Products */}
        <div>
          <p className="text-[var(--color-ink-soft)] text-sm mb-4">
            {products.length} {products.length === 1 ? "položka" : "položek"} v kategorii
          </p>
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {products.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
