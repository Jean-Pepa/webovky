import Link from "next/link";
import { CATEGORIES, PRODUCTS, featuredProducts } from "@/data/catalog";
import ProductCard from "@/components/ProductCard";
import { CategoryIcon } from "@/components/Icons";

export default function HomePage() {
  const deals = PRODUCTS.filter((p) => p.originalPrice);
  const featured = featuredProducts();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 space-y-8">
      {/* PROMO BANNERS */}
      <section className="grid lg:grid-cols-3 gap-4">
        {/* Hlavní banner */}
        <Link
          href="/katalog"
          className="lg:col-span-2 relative overflow-hidden rounded-2xl text-white p-8 md:p-10 min-h-[240px] flex flex-col justify-center"
          style={{ background: "linear-gradient(120deg,#d4332b,#a51f18)" }}
        >
          <span className="inline-block w-fit px-3 py-1 rounded-full text-xs font-bold bg-white/20">
            Cenové hity
          </span>
          <h1 className="mt-3 text-3xl md:text-5xl font-extrabold leading-tight max-w-lg">
            Eika dny — slevy na celý sortiment
          </h1>
          <p className="mt-2 text-white/90 max-w-md">
            Hutní materiál, železářství a vinohradnictví za zvýhodněné ceny.
          </p>
          <span className="mt-5 inline-block w-fit px-5 py-2.5 rounded-full bg-white text-[var(--color-accent)] font-semibold text-sm">
            Nakoupit se slevou
          </span>
        </Link>

        {/* Dva malé bannery */}
        <div className="grid gap-4">
          <Link href="/kosik" className="rounded-2xl bg-white p-6 flex flex-col justify-center hover:shadow-md transition">
            <span className="text-xs font-bold text-[var(--color-accent)]">Pro firmy</span>
            <h3 className="mt-1 text-xl font-bold leading-snug">Velkoobchodní ceny</h3>
            <p className="text-sm text-[var(--color-ink-soft)] mt-1">Účet pro firmy a živnostníky</p>
            <span className="mt-3 text-sm font-semibold text-[var(--color-accent)]">Více ›</span>
          </Link>
          <Link href="/katalog/vinohradnictvi" className="rounded-2xl bg-white p-6 flex flex-col justify-center hover:shadow-md transition">
            <span className="text-xs font-bold text-[var(--color-accent)]">Sezóna</span>
            <h3 className="mt-1 text-xl font-bold leading-snug">Potřeby pro vinaře</h3>
            <p className="text-sm text-[var(--color-ink-soft)] mt-1">Sloupky, drát, nářadí</p>
            <span className="mt-3 text-sm font-semibold text-[var(--color-accent)]">Více ›</span>
          </Link>
        </div>
      </section>

      {/* CATEGORY TILES */}
      <section>
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/katalog/${c.slug}`}
              className="bg-white rounded-2xl p-4 sm:p-6 flex flex-col items-center text-center hover:shadow-md transition"
            >
              <span className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl grid place-items-center text-white" style={{ background: "var(--color-accent)" }}>
                <CategoryIcon icon={c.icon} className="w-6 h-6 sm:w-7 sm:h-7" />
              </span>
              <span className="mt-3 font-semibold text-sm sm:text-base">{c.name}</span>
              <span className="hidden sm:block text-xs text-[var(--color-ink-soft)] mt-0.5">{c.tagline}</span>
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
              Cenové hity
            </h2>
            <Link href="/katalog" className="text-sm font-semibold text-[var(--color-accent)]">Vše ›</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {deals.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* DOPORUČUJEME */}
      <section className="bg-white rounded-2xl p-5 sm:p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl sm:text-2xl font-bold">Doporučujeme</h2>
          <Link href="/katalog" className="text-sm font-semibold text-[var(--color-accent)]">Celý katalog ›</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {featured.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
