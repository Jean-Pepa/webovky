import Link from "next/link";
import type { Category, CategorySlug } from "@/data/catalog";
import { CategoryIcon } from "./Icons";

// Jemné odstíny kategorií (Apple-clean tiles)
const THEME: Record<CategorySlug, { bg: string; icon: string }> = {
  "hutni-material": { bg: "#eef4f5", icon: "#2f7d7d" },
  zelezarstvi: { bg: "#f6f1e1", icon: "#977f1f" },
  vinohradnictvi: { bg: "#eef5ef", icon: "#34803f" },
};

export default function CategoryBanner({ category }: { category: Category }) {
  const t = THEME[category.slug];
  return (
    <Link
      href={`/katalog/${category.slug}`}
      className="group relative block rounded-3xl overflow-hidden text-center px-6 pt-10 pb-12"
      style={{ background: t.bg }}
    >
      <div className="mx-auto mb-5 w-14 h-14 rounded-2xl grid place-items-center bg-white/70" style={{ color: t.icon }}>
        <CategoryIcon icon={category.icon} className="w-7 h-7" />
      </div>
      <h3 className="text-2xl md:text-[28px] font-semibold tracking-tight text-[var(--color-ink)]">
        {category.name}
      </h3>
      <p className="mt-1 text-sm text-[var(--color-ink-soft)]">{category.tagline}</p>
      <span className="mt-4 inline-flex items-center gap-1 text-[15px] text-[var(--color-accent)] group-hover:gap-1.5 transition-all">
        Prohlédnout
        <span className="text-lg leading-none">›</span>
      </span>

      {/* jemná velká ikona na pozadí */}
      <CategoryIcon
        icon={category.icon}
        className="pointer-events-none absolute -right-6 -bottom-6 w-32 h-32 opacity-[0.06]"
      />
    </Link>
  );
}
