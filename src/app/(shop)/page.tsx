import Link from "next/link";
import { featuredProducts } from "@/data/catalog";
import ProductCard from "@/components/ProductCard";
import { BeamIcon, CartIcon, TruckIcon, StarBadgeIcon, BoxesIcon, ArrowRightIcon } from "@/components/Icons";
import { getLang } from "@/i18n/server";
import { t } from "@/i18n/messages";
import { locCategories } from "@/i18n/data";

export default async function HomePage() {
  const lang = await getLang();
  const cats = locCategories(lang);
  const featured = featuredProducts();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 space-y-8">
      {/* HERO BANNER – obsah na střed (bez obrázku) */}
      <section className="relative rounded-3xl overflow-hidden bg-[#f3f4f6]" style={{ transform: "scale(0.95)", transformOrigin: "top center", marginTop: "-2cm" }}>
        {/* Video na pozadí (nahraj public/banner.mp4) – běží ve smyčce, ztlumené */}
        <video autoPlay muted loop playsInline preload="auto" className="absolute inset-0 w-full h-full object-cover">
          <source src="/banner.mp4" type="video/mp4" />
        </video>
        {/* Světlý překryv pro čitelnost obsahu */}
        <div className="absolute inset-0 bg-white/70" />

        <div className="relative z-10 px-6 md:px-12 py-16 md:py-20 flex flex-col items-center text-center">
          <h2 className="text-4xl md:text-6xl font-semibold tracking-tight leading-[1.08]">
            {t(lang, "hero.t1")}
            <br />
            {t(lang, "hero.t2a")}{" "}
            <span style={{ color: "var(--color-accent)" }}>{t(lang, "hero.t2b")}</span>
          </h2>
          <p className="mt-6 text-base md:text-lg text-[var(--color-ink-soft)] max-w-2xl">{t(lang, "hero.sub")}</p>

          {/* 3 funkční tlačítka */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-5 w-full max-w-6xl">
            {[
              { icon: BeamIcon, label: t(lang, "promo.t1"), href: "/katalog" },
              { icon: CartIcon, label: t(lang, "hero.retail"), href: "/kontakt" },
              { icon: TruckIcon, label: t(lang, "promo.t4"), href: "/kontakt" },
            ].map((c, i) => {
              const Icon = c.icon;
              return (
                <Link key={i} href={c.href} className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition flex flex-col items-center gap-4">
                  <Icon className="w-9 h-9 text-[var(--color-accent)]" />
                  <div className="font-bold text-base tracking-wide uppercase text-[var(--color-ink)]">{c.label}</div>
                  <ArrowRightIcon className="w-6 h-6 text-[var(--color-ink-soft)] group-hover:translate-x-1 transition-transform" />
                </Link>
              );
            })}
          </div>

          {/* Statistiky */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-10 w-full max-w-6xl">
            {[
              { icon: StarBadgeIcon, h: t(lang, "stat.h1"), s: t(lang, "stat.s1") },
              { icon: BoxesIcon, h: t(lang, "stat.h2"), s: t(lang, "stat.s2") },
              { icon: TruckIcon, h: t(lang, "stat.h3"), s: t(lang, "stat.s3") },
            ].map((st, i) => {
              const Icon = st.icon;
              return (
                <div key={i} className="flex flex-col items-center text-center">
                  <Icon className="w-12 h-12 text-[var(--color-accent)]" />
                  <div className="mt-3 text-xl font-bold text-[var(--color-accent)]">{st.h}</div>
                  <div className="mt-1 text-base text-[var(--color-ink-soft)] max-w-[18rem]">{st.s}</div>
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
