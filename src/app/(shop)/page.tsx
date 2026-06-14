import Link from "next/link";
import { PRODUCTS, featuredProducts } from "@/data/catalog";
import ProductCard from "@/components/ProductCard";
import { BeamIcon, CartIcon, TruckIcon, BoxIcon, ArrowRightIcon } from "@/components/Icons";
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
      {/* HERO BANNER – HTML verze (bez osoby), funkční tlačítka */}
      <section className="rounded-3xl overflow-hidden bg-[#f3f4f6] grid lg:grid-cols-[1.15fr_0.85fr]">
        {/* Left – content */}
        <div className="p-8 md:p-12 lg:p-14 order-2 lg:order-1">
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight leading-[1.08]">
            {t(lang, "hero.t1")}
            <br />
            {t(lang, "hero.t2a")}{" "}
            <span style={{ color: "var(--color-accent)" }}>{t(lang, "hero.t2b")}</span>
          </h2>
          <div className="mt-4 w-12 h-1 rounded-full" style={{ background: "var(--color-accent)" }} />
          <p className="mt-5 text-[var(--color-ink-soft)] max-w-md">{t(lang, "hero.sub")}</p>

          {/* 3 funkční tlačítka */}
          <div className="mt-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { icon: BeamIcon, label: t(lang, "promo.t1"), href: "/katalog" },
              { icon: CartIcon, label: t(lang, "hero.retail"), href: "/kontakt" },
              { icon: TruckIcon, label: t(lang, "promo.t4"), href: "/kontakt" },
            ].map((c, i) => {
              const Icon = c.icon;
              return (
                <Link key={i} href={c.href} className="group bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition flex flex-col gap-5">
                  <Icon className="w-7 h-7" style={{ color: "var(--color-accent)" }} />
                  <div>
                    <div className="font-bold text-sm tracking-wide uppercase">{c.label}</div>
                    <ArrowRightIcon className="w-5 h-5 mt-2 text-[var(--color-ink-soft)] group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Údaje */}
          <div className="mt-8 pt-6 border-t border-[var(--color-border)] flex flex-wrap gap-x-10 gap-y-4">
            {[
              { icon: BoxIcon, title: t(lang, "hero.f1t"), sub: t(lang, "hero.f1s") },
              { icon: TruckIcon, title: t(lang, "hero.f2t"), sub: t(lang, "hero.f2s") },
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl grid place-items-center bg-white shadow-sm text-[var(--color-accent)]">
                    <Icon className="w-5 h-5" />
                  </span>
                  <div>
                    <div className="font-semibold text-sm">{f.title}</div>
                    <div className="text-xs text-[var(--color-ink-soft)]">{f.sub}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right – fotka materiálu (bez osoby) */}
        <div
          className="relative min-h-[220px] lg:min-h-[480px] order-1 lg:order-2"
          style={{
            backgroundImage: "url(/categories/hutni-material.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundColor: "#e9ebee",
          }}
        />
      </section>

      {/* CATEGORY TILES */}
      <section style={{ marginTop: "6cm" }}>
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {cats.map((c) => (
            <Link key={c.slug} href={`/katalog/${c.slug}`} className="group bg-white rounded-2xl overflow-hidden hover:shadow-md transition">
              <div className="aspect-[4/3] overflow-hidden bg-[var(--color-bg)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/categories/${c.slug}.png`} alt={c.name} className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-300" />
              </div>
              <div className="p-3 sm:p-4 text-center" style={{ transform: "translateY(-10mm)" }}>
                <span
                  className="inline-block px-4 py-1.5 rounded-md text-white text-sm sm:text-base lg:text-lg leading-tight"
                  style={{
                    fontFamily: "Helvetica, Arial, sans-serif",
                    fontWeight: 400,
                    background: "var(--color-accent)",
                    border: "2px solid var(--color-accent)",
                  }}
                >
                  {c.name}
                </span>
                <p className="hidden sm:block text-xs text-[var(--color-ink-soft)] mt-2">{c.tagline}</p>
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
