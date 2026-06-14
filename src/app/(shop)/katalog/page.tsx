import Link from "next/link";
import { PRODUCTS, searchProducts } from "@/data/catalog";
import CatalogBrowser from "@/components/CatalogBrowser";
import { getLang } from "@/i18n/server";
import { t } from "@/i18n/messages";
import { locCategories } from "@/i18n/data";

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const lang = await getLang();
  const cats = locCategories(lang);
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const products = query ? searchProducts(query) : PRODUCTS;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <nav className="text-sm text-[var(--color-ink-soft)] mb-3">
        <Link href="/" className="hover:text-[var(--color-accent)]">{t(lang, "crumb.home")}</Link>
        <span className="mx-2">/</span>
        <span>{t(lang, "nav.catalog")}</span>
      </nav>

      <h1 className="text-3xl font-bold">
        {query ? `${t(lang, "catalog.resultsFor")} „${query}“` : t(lang, "catalog.title")}
      </h1>

      <div className="flex flex-wrap gap-2 mt-5 mb-8">
        <span className="px-3 py-1.5 rounded-full text-sm font-semibold text-white" style={{ background: "var(--color-steel-800)" }}>
          {t(lang, "catalog.all")}
        </span>
        {cats.map((c) => (
          <Link key={c.slug} href={`/katalog/${c.slug}`} className="px-3 py-1.5 rounded-full text-sm font-medium border border-[var(--color-border)] bg-white hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition">
            {c.name}
          </Link>
        ))}
      </div>

      {products.length === 0 ? (
        <div className="py-16 text-center text-[var(--color-ink-soft)]">
          <p className="text-lg">{t(lang, "catalog.none")}</p>
          <Link href="/katalog" className="text-[var(--color-accent)] font-semibold">{t(lang, "footer.fullCatalog")} →</Link>
        </div>
      ) : (
        <CatalogBrowser products={products} />
      )}
    </div>
  );
}
