import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CATEGORIES,
  getCategory,
  productsByCategory,
} from "@/data/catalog";
import { CategoryIcon } from "@/components/Icons";
import CatalogBrowser from "@/components/CatalogBrowser";

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
        <div className="mx-auto max-w-6xl px-4 py-10">
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
          <p className="mt-4 max-w-2xl text-[var(--color-steel-200)] text-sm">
            {category.description}
          </p>

          {/* Other categories */}
          <div className="flex flex-wrap gap-2 mt-5">
            {CATEGORIES.filter((c) => c.slug !== category.slug).map((c) => (
              <Link
                key={c.slug}
                href={`/katalog/${c.slug}`}
                className="px-3 py-1.5 rounded-full text-sm font-medium border border-white/20 hover:bg-white/10 transition"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8">
        <CatalogBrowser products={products} />
      </div>
    </div>
  );
}
