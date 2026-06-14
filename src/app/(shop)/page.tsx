import Link from "next/link";
import { CATEGORIES, featuredProducts } from "@/data/catalog";
import { CategoryIcon } from "@/components/Icons";
import ProductCard from "@/components/ProductCard";

const SERVICES = [
  {
    title: "Doprava do 15 km zdarma",
    text: "Závoz materiálu na stavbu i provozovnu dle objemu objednávky.",
  },
  {
    title: "Kompletace zakázek",
    text: "Připravíme a zkompletujeme zboží pro řemeslníky a firmy na jeden odběr.",
  },
  {
    title: "Dělení materiálu na míru",
    text: "Řezání, stříhání a ohýbání hutního materiálu přesně dle potřeby.",
  },
  {
    title: "Velkoobchodní ceny",
    text: "Zvýhodněné ceny pro firmy a živnostníky po registraci účtu.",
  },
];

export default function HomePage() {
  const featured = featuredProducts();

  return (
    <div>
      {/* HERO */}
      <section className="relative bg-[var(--color-steel-900)] text-white overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-60" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 md:py-28">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[var(--color-accent-light)]">
            EIKA ZNOJMO · od roku 1991
          </span>
          <h1 className="mt-4 text-4xl md:text-6xl font-extrabold max-w-3xl leading-[1.05]">
            Hutní materiál a železářství.{" "}
            <span className="text-[var(--color-accent)]">Objednejte online.</span>
          </h1>
          <p className="mt-5 max-w-xl text-[var(--color-steel-200)] text-lg">
            Spolehlivý partner firem, živnostníků i kutilů. Profily, plechy,
            spojovací materiál, vodo-topo a potřeby pro vinohradnictví — vše na
            jednom místě s dopravou až k vám.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/katalog"
              className="px-6 py-3 rounded-md font-semibold text-white"
              style={{ background: "var(--color-accent)" }}
            >
              Procházet katalog
            </Link>
            <Link
              href="/kontakt"
              className="px-6 py-3 rounded-md font-semibold border border-white/25 hover:bg-white/10 transition"
            >
              Kontakt a pobočky
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl">
            {[
              ["30+", "let na trhu"],
              ["2", "pobočky (Brno, Znojmo)"],
              ["3", "obory sortimentu"],
              ["15 km", "doprava zdarma"],
            ].map(([num, label]) => (
              <div key={label}>
                <div className="text-2xl md:text-3xl font-extrabold text-[var(--color-accent-light)]">
                  {num}
                </div>
                <div className="text-xs text-[var(--color-steel-400)]">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-6xl px-4 -mt-10 relative z-10">
        <div className="grid md:grid-cols-3 gap-5">
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/katalog/${c.slug}`}
              className="group bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6 hover:shadow-xl hover:-translate-y-1 transition"
            >
              <div
                className="w-14 h-14 rounded-lg grid place-items-center text-white mb-4"
                style={{ background: "var(--color-steel-800)" }}
              >
                <CategoryIcon icon={c.icon} className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold group-hover:text-[var(--color-accent)] transition">
                {c.name}
              </h3>
              <p className="mt-1 text-sm text-[var(--color-ink-soft)]">{c.tagline}</p>
              <span className="mt-4 inline-block text-sm font-semibold text-[var(--color-accent)]">
                Zobrazit sortiment →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section className="mx-auto max-w-6xl px-4 mt-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SERVICES.map((s) => (
            <div
              key={s.title}
              className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-5"
            >
              <div className="w-9 h-9 rounded-md grid place-items-center text-white font-bold mb-3" style={{ background: "var(--color-accent)" }}>
                ✓
              </div>
              <h4 className="font-semibold">{s.title}</h4>
              <p className="mt-1 text-sm text-[var(--color-ink-soft)]">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <section className="mx-auto max-w-6xl px-4 mt-16">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Doporučené zboží</h2>
            <p className="text-[var(--color-ink-soft)] text-sm">
              Nejžádanější položky našeho sortimentu
            </p>
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

      {/* B2B CALLOUT */}
      <section className="mx-auto max-w-6xl px-4 mt-16">
        <div className="bg-[var(--color-steel-900)] text-white rounded-2xl p-8 md:p-12 grid md:grid-cols-2 gap-8 items-center overflow-hidden relative">
          <div className="absolute inset-0 bg-grid opacity-40" />
          <div className="relative">
            <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent-light)]">
              Pro firmy a živnostníky
            </span>
            <h2 className="mt-3 text-3xl font-extrabold">
              Objednávejte rychleji a za velkoobchodní ceny
            </h2>
            <p className="mt-3 text-[var(--color-steel-200)]">
              Firemní účet vám zpřístupní zvýhodněné ceny, historii objednávek,
              opakování dřívějších odběrů a fakturaci na IČO/DIČ.
            </p>
          </div>
          <ul className="relative space-y-3">
            {[
              "Velkoobchodní ceny po přihlášení",
              "Historie a opakování objednávek",
              "Fakturace na IČO / DIČ",
              "Kompletace a závoz na stavbu",
            ].map((t) => (
              <li key={t} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full grid place-items-center text-white text-sm" style={{ background: "var(--color-accent)" }}>
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
