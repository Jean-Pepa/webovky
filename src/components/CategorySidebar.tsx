import Link from "@/components/LocLink";
import { CATEGORIES } from "@/data/catalog";
import { CategoryIcon, ChevronDownIcon } from "./Icons";

export default function CategorySidebar() {
  return (
    <nav className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl">
      <div className="px-4 py-3 border-b border-[var(--color-border)] flex items-center gap-2">
        <span className="flex flex-col gap-[3px]">
          <span className="w-4 h-0.5 bg-[var(--color-accent)]" />
          <span className="w-4 h-0.5 bg-[var(--color-accent)]" />
          <span className="w-4 h-0.5 bg-[var(--color-accent)]" />
        </span>
        <span className="font-bold text-sm">Sortiment</span>
      </div>

      <ul className="py-1">
        {CATEGORIES.map((c) => (
          <li key={c.slug} className="group relative">
            <Link
              href={`/katalog/${c.slug}`}
              className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--color-bg)] transition"
            >
              <span className="w-8 h-8 rounded-md grid place-items-center text-[var(--color-accent)] bg-[var(--color-bg)] group-hover:bg-[var(--color-accent)] group-hover:text-white transition">
                <CategoryIcon icon={c.icon} className="w-4.5 h-4.5" />
              </span>
              <span className="font-medium text-sm flex-1">{c.name}</span>
              <ChevronDownIcon className="w-4 h-4 -rotate-90 text-[var(--color-ink-soft)]" />
            </Link>

            {/* Flyout s podkategoriemi */}
            <div className="absolute left-full top-0 w-72 hidden group-hover:block z-30 pl-2">
              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-2xl p-4">
                <Link
                  href={`/katalog/${c.slug}`}
                  className="flex items-center gap-2 font-bold mb-3 hover:text-[var(--color-accent)]"
                >
                  <span className="w-7 h-7 rounded-md grid place-items-center text-white" style={{ background: "var(--color-steel-800)" }}>
                    <CategoryIcon icon={c.icon} className="w-4 h-4" />
                  </span>
                  {c.name}
                </Link>
                <ul className="space-y-1">
                  {c.subcategories.map((s) => (
                    <li key={s}>
                      <Link
                        href={`/katalog/${c.slug}`}
                        className="block text-sm text-[var(--color-ink-soft)] hover:text-[var(--color-accent)] py-1 leading-snug"
                      >
                        {s}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="px-4 py-3 border-t border-[var(--color-border)]">
        <Link href="/katalog" className="text-sm font-semibold text-[var(--color-accent)]">
          Zobrazit celý katalog →
        </Link>
      </div>
    </nav>
  );
}
