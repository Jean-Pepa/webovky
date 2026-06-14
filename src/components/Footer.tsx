import Link from "next/link";
import { CATEGORIES } from "@/data/catalog";

export default function Footer() {
  return (
    <footer className="bg-[var(--color-bg)] text-[var(--color-ink-soft)]">
      <div className="mx-auto max-w-7xl px-5 py-10 text-xs leading-relaxed">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-8 border-b border-[var(--color-border)]">
          <div>
            <h4 className="text-[var(--color-ink)] font-semibold mb-3">Sortiment</h4>
            <ul className="space-y-2">
              {CATEGORIES.map((c) => (
                <li key={c.slug}>
                  <Link href={`/katalog/${c.slug}`} className="hover:text-[var(--color-ink)]">{c.name}</Link>
                </li>
              ))}
              <li><Link href="/katalog" className="hover:text-[var(--color-ink)]">Celý katalog</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[var(--color-ink)] font-semibold mb-3">Nákup</h4>
            <ul className="space-y-2">
              <li><Link href="/kosik" className="hover:text-[var(--color-ink)]">Košík</Link></li>
              <li><Link href="/oblibene" className="hover:text-[var(--color-ink)]">Oblíbené</Link></li>
              <li><Link href="/admin" className="hover:text-[var(--color-ink)]">Administrace</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[var(--color-ink)] font-semibold mb-3">Pobočka Brno</h4>
            <p>Vodařská 10, Horní Heršpice, Brno</p>
            <p className="mt-1"><a href="tel:+420545233742" className="hover:text-[var(--color-ink)]">545 233 742</a></p>
            <p><a href="mailto:brno@eika.cz" className="hover:text-[var(--color-ink)]">brno@eika.cz</a></p>
          </div>
          <div>
            <h4 className="text-[var(--color-ink)] font-semibold mb-3">Pobočka Znojmo</h4>
            <p>Oblekovice, Znojmo</p>
            <p className="mt-1"><a href="mailto:info@eika.cz" className="hover:text-[var(--color-ink)]">info@eika.cz</a></p>
            <p className="mt-2"><Link href="/kontakt" className="hover:text-[var(--color-ink)]">Všechny kontakty ›</Link></p>
          </div>
        </div>
        <p className="pt-6">© {new Date().getFullYear()} EIKA ZNOJMO, a.s. · Objednávková aplikace (ukázka)</p>
      </div>
    </footer>
  );
}
