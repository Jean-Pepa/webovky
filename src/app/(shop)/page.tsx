import Link from "next/link";
import { PRODUCTS, featuredProducts } from "@/data/catalog";
import ProductCard from "@/components/ProductCard";
import { getLang } from "@/i18n/server";
import { t } from "@/i18n/messages";
import { locCategories } from "@/i18n/data";

export default async function HomePage() {
  const lang = await getLang();
  const cats = locCategories(lang);
  const deals = PRODUCTS.filter((p) => p.originalPrice);
  const featured = featuredProducts();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 space-y-8">
      {/* PROMO BANNER – nahraná fotka Eika dny (nižší, ať jsou vidět kategorie) */}
      <section>
        <Link href="/katalog" className="block overflow-hidden rounded-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/eika-dny.png"
            alt={t(lang, "home.banner.title")}
            className="w-full h-[170px] sm:h-[220px] lg:h-[270px] object-cover object-top"
          />
        </Link>
      </section>

      {/* CATEGORY TILES */}
      <section>
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {cats.map((c) => (
            <Link key={c.slug} href={`/katalog/${c.slug}`} className="group bg-white rounded-2xl overflow-hidden hover:shadow-md transition">
              <div className="aspect-[4/3] overflow-hidden bg-[var(--color-bg)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/categories/${c.slug}.png`} alt={c.name} className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-300" />
              </div>
              <div className="p-3 sm:p-4 text-center" style={{ transform: "translateY(-10mm)" }}>
                <span
                  className="block text-xs sm:text-lg lg:text-2xl leading-tight"
                  style={{ fontFamily: "Helvetica, Arial, sans-serif", fontWeight: 400 }}
                >
                  {c.name}
                </span>
                <p className="hidden sm:block text-xs text-[var(--color-ink-soft)] mt-1">{c.tagline}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CENOVÉ HITY */}
      {deals.length > 0 && (
        <section className="bg-white rounded-2xl p-5 sm:p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-sm font-bold text-white" style={{ background: "var(--color-accent)" }}>%</span>
              {t(lang, "home.deals")}
            </h2>
            <Link href="/katalog" className="text-sm font-semibold text-[var(--color-accent)]">{t(lang, "home.all")}</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {deals.map((p) => (<ProductCard key={p.slug} product={p} />))}
          </div>
        </section>
      )}

      {/* DOPORUČUJEME */}
      <section className="bg-white rounded-2xl p-5 sm:p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl sm:text-2xl font-bold">{t(lang, "home.recommended")}</h2>
          <Link href="/katalog" className="text-sm font-semibold text-[var(--color-accent)]">{t(lang, "home.fullCatalog")}</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {featured.map((p) => (<ProductCard key={p.slug} product={p} />))}
        </div>
      </section>
    </div>
  );
}
