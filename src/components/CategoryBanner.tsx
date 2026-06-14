import Link from "next/link";
import type { Category, CategorySlug } from "@/data/catalog";
import { CategoryIcon } from "./Icons";

// Barvy dle reálných kategorií EIKA (tyrkysová / zlatá / zelená)
const THEME: Record<CategorySlug, { bg: string; label: string }> = {
  "hutni-material": {
    bg: "linear-gradient(135deg,#3a8c8c,#205f5f)",
    label: "HUTNÍ MATERIÁL",
  },
  zelezarstvi: {
    bg: "linear-gradient(135deg,#bda23a,#8f7a22)",
    label: "ŽELEZÁŘSTVÍ",
  },
  vinohradnictvi: {
    bg: "linear-gradient(135deg,#4ca05c,#347a43)",
    label: "VINOHRADNICTVÍ",
  },
};

export default function CategoryBanner({ category }: { category: Category }) {
  const t = THEME[category.slug];
  return (
    <Link
      href={`/katalog/${category.slug}`}
      aria-label={category.name}
      className="group relative block w-full h-40 md:h-44 rounded-xl overflow-hidden bg-grid"
      style={{ background: t.bg }}
    >
      {/* Dekorativní ikony (textura) */}
      <CategoryIcon
        icon={category.icon}
        className="absolute -left-6 -bottom-6 w-40 h-40 text-white/10"
      />
      <CategoryIcon
        icon={category.icon}
        className="absolute -right-8 -top-8 w-44 h-44 text-white/10 rotate-12"
      />

      {/* Tmavší přechod pro čitelnost */}
      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition" />

      {/* Název uprostřed */}
      <div className="relative h-full grid place-items-center text-center px-6">
        <div>
          <h3 className="text-2xl md:text-3xl font-extrabold text-white tracking-wide drop-shadow">
            {t.label}
          </h3>
          <span className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-white/90 opacity-0 group-hover:opacity-100 group-hover:gap-2 transition-all">
            Zobrazit sortiment →
          </span>
        </div>
      </div>
    </Link>
  );
}
