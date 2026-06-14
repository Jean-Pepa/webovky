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
      {/* PROMO BANNER */}
      <section>
        <Link
          href="/katalog"
          className="relative block overflow-hidden rounded-2xl min-h-[240px]"
          style={{ background: "linear-gradient(120deg,#d4332b,#a51f18)" }}
        >
          {/* Záložní textový banner (zmizí, jakmile nahraješ fotku) */}
          <div className="relative z-0 p-8 md:p-12 min-h-[240px] flex flex-col justify-center text-white">
            <span className="inline-block w-fit px-3 py-1 rounded-full text-xs font-bold bg-white/20">
              {t(lang, "home.deals")}
            </span>
            <h1 className="mt-3 text-3xl md:text-5xl font-extrabold leading-tight max-w-2xl">
              {t(lang, "home.banner.title")}
            </h1>
            <p className="mt-2 text-white/90 max-w-xl">{t(lang, "home.banner.text")}</p>
            <span className="mt-5 inline-block w-fit px-5 py-2.5 rounded-full bg-white text-[var(--color-accent)] font-semibold text-sm">
              {t(lang, "home.banner.cta")}
            </span>
          </div>
          {/* Nahraná fotka Eika dny – public/eika-dny.png (stejné umístění i velikost) */}
          <div
            className="absolute inset-0 z-10 bg-center bg-cover"
            style={{ backgroundImage: "url(/eika-dny.png)" }}
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
