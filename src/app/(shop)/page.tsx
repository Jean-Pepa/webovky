import Link from "next/link";
import { CATEGORIES, featuredProducts } from "@/data/catalog";
import ProductCard from "@/components/ProductCard";
import CategorySidebar from "@/components/CategorySidebar";
import CategoryBanner from "@/components/CategoryBanner";
import { TruckIcon } from "@/components/Icons";

const SERVICES = [
  { title: "Doprava do 15 km zdarma", text: "Závoz materiálu na stavbu i provozovnu dle objemu objednávky." },
  { title: "Kompletace zakázek", text: "Připravíme a zkompletujeme zboží pro řemeslníky a firmy na jeden odběr." },
  { title: "Dělení materiálu na míru", text: "Řezání, stříhání a ohýbání hutního materiálu přesně dle potřeby." },
  { title: "Velkoobchodní ceny", text: "Zvýhodněné ceny pro firmy a živnostníky po registraci účtu." },
];

export default function HomePage() {
  const featured = featuredProducts();

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      {/* HERO – Alza-style: sidebar + bannery */}
      <section className="grid lg:grid-cols-[260px_1fr] gap-5">
        {/* Levé menu kategorií */}
        <div className="hidden lg:block">
          <CategorySidebar />
        </div>

        {/* Pravá část – velký banner + 3 kategorie */}
        <div className="space-y-5">
          {/* Hlavní banner */}
          <div className="relative overflow-hidden rounded-2xl bg-[var(--color-steel-900)] text-white bg-grid">
            <div
              className="absolute -right-20 -top-16 w-80 h-80 rounded-full opacity-25 blur-2xl"
              style={{ background: "var(--color-accent)" }}
            />
            <div className="relative p-8 md:p-10 max-w-xl">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[var(--color-accent)] text-white">
                EIKA · od roku 1991
              </span>
              <h1 className="mt-4 text-3xl md:text-4xl font-extrabold leading-tight">
                Vše pro stavbu, řemeslo i vinohrad.{" "}
                <span className="text-[var(--color-accent-light)]">Objednejte online.</span>
              </h1>
              <p className="mt-3 text-[var(--color-steel-200)]">
                Hutní materiál, železářství a potřeby pro vinohradnictví pro firmy,
                živnostníky i kutily — skladem a s dopravou až k vám.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/katalog" className="px-5 py-3 rounded-md font-semibold text-white" style={{ background: "var(--color-accent)" }}>
                  Procházet katalog
                </Link>
                <span className="inline-flex items-center gap-2 px-4 py-3 rounded-md border border-white/20 text-sm">
                  <TruckIcon className="w-5 h-5 text-[var(--color-accent-light)]" />
                  Doprava do 15 km zdarma
                </span>
              </div>
            </div>
          </div>

          {/* 3 klikací kategorie (úvodní fotky) */}
          <div className="grid sm:grid-cols-3 gap-5">
            {CATEGORIES.map((c) => (
              <CategoryBanner key={c.slug} category={c} />
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="mt-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SERVICES.map((s) => (
            <div key={s.title} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-5">
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

      {/* B2B CALLOUT */}
      <section className="mt-12">
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
