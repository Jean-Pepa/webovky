import Link from "next/link";
import type { Category, CategorySlug } from "@/data/catalog";
import { CategoryIcon } from "./Icons";

// Barvy dle reálných kategorií EIKA (tyrkysová / zlatá / zelená).
// image: až dodáš skutečné fotky do /public/categories/, zobrazí se místo barvy.
const THEME: Record<CategorySlug, { bg: string; label: string; image?: string }> = {
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
      className="group relative block w-full aspect-[4/3] rounded-xl overflow-hidden bg-grid"
      style={{ background: t.bg }}
    >
      {/* Skutečná fotka (pokud je k dispozici) */}
      {t.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={t.image}
          alt={category.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Dekorativní ikony (textura) – jen když není fotka */}
      {!t.image && (
        <CategoryIcon
          icon={category.icon}
          className="absolute -right-6 -bottom-6 w-36 h-36 text-white/10 rotate-6"
        />
      )}

      {/* Tmavší přechod pro čitelnost názvu */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent group-hover:from-black/55 transition" />

      {/* Název uprostřed */}
      <div className="absolute inset-0 grid place-items-center text-center px-4">
        <div>
          <h3 className="text-lg sm:text-xl md:text-2xl font-extrabold text-white tracking-wide drop-shadow-lg">
            {t.label}
          </h3>
          <span className="mt-1 inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-white opacity-0 group-hover:opacity-100 group-hover:gap-2 transition-all">
            Zobrazit sortiment →
          </span>
        </div>
      </div>
    </Link>
  );
}
