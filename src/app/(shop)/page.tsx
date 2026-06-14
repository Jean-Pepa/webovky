import Link from "next/link";
import { PRODUCTS, featuredProducts } from "@/data/catalog";
import ProductCard from "@/components/ProductCard";
import { BeamIcon, ToolsIcon, TruckIcon } from "@/components/Icons";
import { getLang } from "@/i18n/server";
import { t } from "@/i18n/messages";
import { locCategories } from "@/i18n/data";

function HexBadge({ title }: { title: string }) {
  return (
    <div className="relative w-24 h-[104px]">
      <svg viewBox="0 0 100 112" className="absolute inset-0 w-full h-full" aria-hidden>
        <polygon points="50,4 92,29 92,83 50,108 8,83 8,29" fill="rgba(0,0,0,0.25)" stroke="#ffffff" strokeWidth="2.5" />
      </svg>
      <div className="absolute inset-0 grid place-items-center px-2 text-center">
        <span className="text-white font-extrabold uppercase tracking-wide text-[13px] leading-tight">{title}</span>
      </div>
    </div>
  );
}

export default async function HomePage() {
  const lang = await getLang();
  const cats = locCategories(lang);
  const deals = PRODUCTS.filter((p) => p.originalPrice);
  const featured = featuredProducts();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 space-y-8">
      {/* PROMO TILES – Velkoobchod / Železářství / Služby */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { icon: BeamIcon, badge: t(lang, "promo.t1"), text: t(lang, "promo.x1"), btn: t(lang, "promo.b1"), href: "/katalog" },
          { icon: ToolsIcon, badge: t(lang, "promo.t2"), text: t(lang, "promo.x2"), btn: t(lang, "promo.b2"), href: "/kontakt" },
          { icon: TruckIcon, badge: t(lang, "promo.t4"), text: t(lang, "promo.x4"), btn: t(lang, "promo.b4"), href: "/kontakt" },
        ].map((tile, i) => {
          const Icon = tile.icon;
          return (
            <div
              key={i}
              className="rounded-2xl overflow-hidden flex flex-col text-white"
              style={{ background: "linear-gradient(165deg,#33404f,#161b22)" }}
            >
              <div className="relative h-32 grid place-items-center">
                <Icon className="w-16 h-16 text-white/90" />
              </div>
              <div className="px-5 pb-6 -mt-12 flex flex-col items-center text-center">
                <HexBadge title={tile.badge} />
                <p className="mt-4 text-sm text-white/90 min-h-[3.5em]">{tile.text}</p>
                <Link
                  href={tile.href}
                  className="mt-4 px-5 py-2.5 rounded-md bg-white font-semibold text-sm hover:opacity-90 transition"
                  style={{ color: "var(--color-accent)" }}
                >
                  {tile.btn}
                </Link>
              </div>
            </div>
          );
        })}
      </section>

      {/* CATEGORY TILES */}
      <section style={{ marginTop: "4cm" }}>
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
