import Link from "next/link";
import type { Category, CategorySlug } from "@/data/catalog";
import { CategoryIcon } from "./Icons";

const BG: Record<CategorySlug, string> = {
  "hutni-material": "linear-gradient(135deg,#2b3a52,#0e1622)",
  zelezarstvi: "linear-gradient(135deg,#3a4a64,#161f2e)",
  vinohradnictvi: "linear-gradient(135deg,#46371f,#1c1710)",
};

export default function CategoryBanner({
  category,
  size = "sm",
}: {
  category: Category;
  size?: "sm" | "lg";
}) {
  return (
    <Link
      href={`/katalog/${category.slug}`}
      className={`group relative block rounded-xl overflow-hidden bg-grid ${
        size === "lg" ? "min-h-[220px]" : "min-h-[150px]"
      }`}
      style={{ background: BG[category.slug] }}
    >
      {/* Watermark icon */}
      <CategoryIcon
        icon={category.icon}
        className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10 group-hover:text-white/15 transition"
      />
      {/* Content */}
      <div className="relative h-full p-5 flex flex-col justify-between">
        <span className="self-start w-11 h-11 rounded-lg grid place-items-center text-white" style={{ background: "var(--color-accent)" }}>
          <CategoryIcon icon={category.icon} className="w-6 h-6" />
        </span>
        <div>
          <h3 className={`font-extrabold text-white ${size === "lg" ? "text-2xl" : "text-lg"}`}>
            {category.name}
          </h3>
          <p className="text-sm text-white/75 mt-0.5">{category.tagline}</p>
          <span className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-accent-light)] group-hover:gap-2 transition-all">
            Zobrazit sortiment →
          </span>
        </div>
      </div>
    </Link>
  );
}
