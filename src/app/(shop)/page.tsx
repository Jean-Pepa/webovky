import Link from "next/link";
import { featuredProducts } from "@/data/catalog";
import ProductCard from "@/components/ProductCard";
import { BeamIcon, CartIcon, TruckIcon, BoxIcon, ArrowRightIcon } from "@/components/Icons";
import { getLang } from "@/i18n/server";
import { t } from "@/i18n/messages";
import { locCategories } from "@/i18n/data";

export default async function HomePage() {
  const lang = await getLang();
  const cats = locCategories(lang);
  const featured = featuredProducts();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 space-y-8">
      {/* HERO BANNER – obsah na střed, připraveno na video v pozadí */}
      <section className="relative rounded-3xl overflow-hidden" style={{ background: "#101722" }}>
        {/* Video v pozadí (nahraj public/banner.mp4) */}
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/banner.mp4" type="video/mp4" />
        </video>
        {/* Tmavý překryv pro čitelnost */}
        <div className="absolute inset-0" style={{ background: "rgba(12,17,26,0.6)" }} />

        {/* Obsah na střed */}
        <div className="relative z-10 px-6 py-12 md:py-16 flex flex-col items-center text-center text-white">
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight leading-[1.08]">
            {t(lang, "hero.t1")}
            <br />
            {t(lang, "hero.t2a")}{" "}
            <span style={{ color: "var(--color-accent-light)" }}>{t(lang, "hero.t2b")}</span>
          </h2>
          <div className="mt-4 w-12 h-1 rounded-full" style={{ background: "var(--color-accent)" }} />
          <p className="mt-5 text-white/85 max-w-xl">{t(lang, "hero.sub")}</p>

          {/* 3 funkční tlačítka */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-2xl">
            {[
              { icon: BeamIcon, label: t(lang, "promo.t1"), href: "/katalog" },
              { icon: CartIcon, label: t(lang, "hero.retail"), href: "/kontakt" },
              { icon: TruckIcon, label: t(lang, "promo.t4"), href: "/kontakt" },
            ].map((c, i) => {
              const Icon = c.icon;
              return (
                <Link key={i} href={c.href} className="group bg-white rounded-2xl p-4 shadow-sm hover:shadow-lg transition flex flex-col items-center gap-3">
                  <Icon className="w-7 h-7 text-[var(--color-accent)]" />
                  <div className="font-bold text-sm tracking-wide uppercase text-[var(--color-ink)]">{c.label}</div>
                  <ArrowRightIcon className="w-5 h-5 text-[var(--color-ink-soft)] group-hover:translate-x-1 transition-transform" />
                </Link>
              );
            })}
          </div>

          {/* Údaje */}
          <div className="mt-8 pt-6 border-t border-white/20 flex flex-wrap justify-center gap-x-10 gap-y-4">
            {[
              { icon: BoxIcon, title: t(lang, "hero.f1t"), sub: t(lang, "hero.f1s") },
              { icon: TruckIcon, title: t(lang, "hero.f2t"), sub: t(lang, "hero.f2s") },
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl grid place-items-center bg-white/15 text-white">
                    <Icon className="w-5 h-5" />
                  </span>
                  <div className="text-left">
                    <div className="font-semibold text-sm text-white">{f.title}</div>
                    <div className="text-xs text-white/70">{f.sub}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
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
