import Link from "next/link";
import Logo from "./Logo";
import { CATEGORIES } from "@/data/catalog";

export default function Footer() {
  return (
    <footer className="mt-20 bg-white border-t border-[var(--color-border)]">
      <div className="mx-auto max-w-6xl px-4 py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-1">
          <Logo />
          <p className="mt-4 text-sm text-[var(--color-ink-soft)] leading-relaxed">
            Prodej hutního materiálu, železářství a potřeb pro vinohradnictví
            pro firmy, živnostníky i koncové zákazníky.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-bold mb-3">Sortiment</h4>
          <ul className="space-y-2 text-sm">
            {CATEGORIES.map((c) => (
              <li key={c.slug}>
                <Link href={`/katalog/${c.slug}`} className="text-[var(--color-ink-soft)] hover:text-[var(--color-accent)]">
                  {c.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/katalog" className="text-[var(--color-ink-soft)] hover:text-[var(--color-accent)]">
                Celý katalog
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold mb-3">Pobočka Brno</h4>
          <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed">
            Vodařská 10<br />
            Horní Heršpice, Brno<br />
            <a href="tel:+420545233742" className="hover:text-[var(--color-accent)]">545 233 742</a><br />
            <a href="mailto:brno@eika.cz" className="hover:text-[var(--color-accent)]">brno@eika.cz</a>
          </p>
        </div>

        <div>
          <h4 className="text-sm font-bold mb-3">Pobočka Znojmo</h4>
          <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed">
            Oblekovice<br />
            Znojmo<br />
            <a href="mailto:info@eika.cz" className="hover:text-[var(--color-accent)]">info@eika.cz</a>
          </p>
          <Link href="/kontakt" className="inline-block mt-3 text-sm font-semibold text-[var(--color-accent)]">
            Všechny kontakty →
          </Link>
        </div>
      </div>

      {/* Red bottom bar */}
      <div className="text-white" style={{ background: "var(--color-accent)" }}>
        <div className="mx-auto max-w-6xl px-4 py-4 flex flex-col sm:flex-row justify-between gap-2 text-xs">
          <span>© {new Date().getFullYear()} EIKA ZNOJMO, a.s.</span>
          <span className="text-white/80">Objednávková aplikace · ukázka</span>
        </div>
      </div>
    </footer>
  );
}
