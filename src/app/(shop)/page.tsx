import Link from "next/link";
import { CATEGORIES, featuredProducts } from "@/data/catalog";
import ProductCard from "@/components/ProductCard";
import CategoryBanner from "@/components/CategoryBanner";

export default function HomePage() {
  const featured = featuredProducts();

  return (
    <div>
      {/* HERO */}
      <section className="text-center px-5 pt-20 pb-16 md:pt-28 md:pb-20">
        <p className="text-[var(--color-accent)] text-base md:text-lg font-medium">Eika</p>
        <h1 className="mt-2 text-4xl md:text-6xl font-semibold tracking-tight text-[var(--color-ink)]">
          Vše pro řemeslo i stavbu.
        </h1>
        <p className="mt-4 text-lg md:text-2xl text-[var(--color-ink-soft)] max-w-2xl mx-auto">
          Hutní materiál, železářství a vinohradnictví. Objednejte online.
        </p>
        <div className="mt-8 flex items-center justify-center gap-6">
          <Link
            href="/katalog"
            className="px-6 py-2.5 rounded-full text-white text-[15px] font-medium"
            style={{ background: "var(--color-accent)" }}
          >
            Procházet katalog
          </Link>
          <Link href="/kontakt" className="text-[15px] text-[var(--color-accent)] hover:underline">
            Kontakt ›
          </Link>
        </div>
      </section>

      {/* CATEGORY TILES */}
      <section className="px-5 pb-4">
        <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-5">
          {CATEGORIES.map((c) => (
            <CategoryBanner key={c.slug} category={c} />
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <section className="px-5 py-16 md:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Doporučené zboží</h2>
            <p className="mt-2 text-lg text-[var(--color-ink-soft)]">Nejžádanější položky našeho sortimentu</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featured.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/katalog" className="text-[15px] text-[var(--color-accent)] hover:underline">
              Zobrazit celý katalog ›
            </Link>
          </div>
        </div>
      </section>

      {/* B2B */}
      <section className="px-5 pb-20">
        <div className="mx-auto max-w-5xl rounded-3xl bg-[var(--color-bg)] text-center px-6 py-16 md:py-20">
          <p className="text-[var(--color-accent)] text-sm font-medium">Pro firmy a živnostníky</p>
          <h2 className="mt-2 text-3xl md:text-5xl font-semibold tracking-tight max-w-2xl mx-auto">
            Velkoobchodní ceny. Online objednávky.
          </h2>
          <p className="mt-4 text-lg text-[var(--color-ink-soft)] max-w-xl mx-auto">
            Firemní účet zpřístupní zvýhodněné ceny, historii objednávek a
            fakturaci na IČO/DIČ.
          </p>
          <div className="mt-8 flex items-center justify-center gap-6">
            <Link href="/kosik" className="px-6 py-2.5 rounded-full text-white text-[15px] font-medium" style={{ background: "var(--color-accent)" }}>
              Založit firemní účet
            </Link>
            <Link href="/katalog" className="text-[15px] text-[var(--color-accent)] hover:underline">
              Procházet sortiment ›
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
