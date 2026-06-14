import Link from "next/link";
import Logo from "./Logo";
import { CATEGORIES } from "@/data/catalog";

export default function Footer() {
  return (
    <footer className="mt-20 bg-[var(--color-steel-900)] text-[var(--color-steel-200)]">
      <div className="mx-auto max-w-6xl px-4 py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-1">
          <Logo light />
          <p className="mt-4 text-sm text-[var(--color-steel-400)] leading-relaxed">
            Prodej hutního materiálu, železářství a potřeb pro vinohradnictví.
            Spolehlivý partner řemeslníků a firem od roku 1991.
          </p>
        </div>

        <div>
          <h4 className="text-white text-sm font-semibold mb-3">Sortiment</h4>
          <ul className="space-y-2 text-sm">
            {CATEGORIES.map((c) => (
              <li key={c.slug}>
                <Link href={`/katalog/${c.slug}`} className="hover:text-white">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white text-sm font-semibold mb-3">Pobočka Brno</h4>
          <p className="text-sm text-[var(--color-steel-400)]">
            Vodařská 10<br />
            Horní Heršpice, Brno<br />
            <a href="tel:+420545233742" className="hover:text-white">545 233 742</a><br />
            <a href="mailto:brno@eika.cz" className="hover:text-white">brno@eika.cz</a>
          </p>
        </div>

        <div>
          <h4 className="text-white text-sm font-semibold mb-3">Pobočka Znojmo</h4>
          <p className="text-sm text-[var(--color-steel-400)]">
            Oblekovice<br />
            Znojmo<br />
            <a href="mailto:info@eika.cz" className="hover:text-white">info@eika.cz</a>
          </p>
          <p className="mt-4 text-sm text-[var(--color-accent-light)]">
            Doprava do 15 km zdarma
          </p>
        </div>
      </div>

      <div className="border-t border-[var(--color-steel-700)]">
        <div className="mx-auto max-w-6xl px-4 py-5 flex flex-col sm:flex-row justify-between gap-2 text-xs text-[var(--color-steel-400)]">
          <span>© {new Date().getFullYear()} EIKA ZNOJMO, a.s. — demo objednávkové aplikace</span>
          <span>Vytvořeno jako ukázka · Fáze 1</span>
        </div>
      </div>
    </footer>
  );
}
