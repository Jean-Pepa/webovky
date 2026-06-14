import Link from "next/link";
import { CATEGORIES, featuredProducts } from "@/data/catalog";
import ProductCard from "@/components/ProductCard";
import CategorySidebar from "@/components/CategorySidebar";
import CategoryBanner from "@/components/CategoryBanner";

export default function HomePage() {
  const featured = featuredProducts();

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      {/* HERO – menu kategorií + tři bannery vedle sebe */}
      <section className="grid lg:grid-cols-[260px_1fr] gap-5">
        <div className="hidden lg:block">
          <CategorySidebar />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {CATEGORIES.map((c) => (
            <CategoryBanner key={c.slug} category={c} />
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <section className="mt-12">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Doporučené zboží</h2>
            <p className="text-[var(--color-ink-soft)] text-sm">Nejžádanější položky našeho sortimentu</p>
          </div>
          <Link href="/katalog" className="text-sm font-semibold text-[var(--color-accent)]">
            Celý katalog →
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featured.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      {/* B2B CALLOUT – červený */}
      <section className="mt-12">
        <div
          className="text-white rounded-2xl p-8 md:p-12 grid md:grid-cols-2 gap-8 items-center"
          style={{ background: "var(--color-accent)" }}
        >
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-white/80">
              Pro firmy a živnostníky
            </span>
            <h2 className="mt-3 text-3xl font-extrabold">
              Objednávejte rychleji a za velkoobchodní ceny
            </h2>
            <p className="mt-3 text-white/90">
              Firemní účet vám zpřístupní zvýhodněné ceny, historii objednávek,
              opakování dřívějších odběrů a fakturaci na IČO/DIČ.
            </p>
            <Link
              href="/kosik"
              className="inline-block mt-6 px-5 py-3 rounded-lg font-semibold bg-white text-[var(--color-accent)]"
            >
              Vytvořit firemní účet
            </Link>
          </div>
          <ul className="space-y-3">
            {[
              "Velkoobchodní ceny po přihlášení",
              "Historie a opakování objednávek",
              "Fakturace na IČO / DIČ",
            ].map((t) => (
              <li key={t} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full grid place-items-center text-[var(--color-accent)] text-sm font-bold bg-white">
                  ✓
                </span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
