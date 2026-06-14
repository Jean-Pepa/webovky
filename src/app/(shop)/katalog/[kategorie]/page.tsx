import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CATEGORIES,
  getCategory,
  productsByCategory,
} from "@/data/catalog";
import CatalogBrowser from "@/components/CatalogBrowser";
import { getLang } from "@/i18n/server";
import { t } from "@/i18n/messages";
import { locCategory } from "@/i18n/data";

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ kategorie: c.slug }));
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ kategorie: string }>;
}) {
  const { kategorie } = await params;
  const orig = getCategory(kategorie);
  if (!orig) notFound();

  const lang = await getLang();
  const category = locCategory(orig, lang);
  const products = productsByCategory(orig.slug);

  return (
    <div>
      {/* Category header */}
      <div className="bg-white border-b border-[var(--color-border)]">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <nav className="text-sm text-[var(--color-ink-soft)] mb-4">
            <Link href="/" className="hover:text-[var(--color-accent)]">{t(lang, "crumb.home")}</Link>
            <span className="mx-2">/</span>
            <Link href="/katalog" className="hover:text-[var(--color-accent)]">{t(lang, "nav.catalog")}</Link>
            <span className="mx-2">/</span>
            <span className="text-[var(--color-ink)]">{category.name}</span>
          </nav>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl overflow-hidden bg-[var(--color-bg)] shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/categories/${category.slug}.png`} alt={category.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold">{category.name}</h1>
              <p className="text-[var(--color-ink-soft)]">{category.tagline}</p>
            </div>
          </div>
          <p className="mt-4 max-w-2xl text-[var(--color-ink-soft)] text-sm">
            {category.description}
          </p>

          {/* Other categories */}
          <div className="flex flex-wrap gap-2 mt-5">
            {CATEGORIES.filter((c) => c.slug !== orig.slug).map((c) => locCategory(c, lang)).map((c) => (
              <Link
                key={c.slug}
                href={`/katalog/${c.slug}`}
                className="px-3 py-1.5 rounded-full text-sm font-medium border border-[var(--color-border)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <CatalogBrowser products={products} />
      </div>
    </div>
  );
}
