import { CategoryIcon } from "./Icons";
import type { CategorySlug } from "@/data/catalog";

const ICON: Record<CategorySlug, "beam" | "tools" | "grape"> = {
  "hutni-material": "beam",
  zelezarstvi: "tools",
  vinohradnictvi: "grape",
};

export default function ProductThumb({
  category,
  className = "",
}: {
  category: CategorySlug;
  className?: string;
}) {
  return (
    <div
      className={`relative grid place-items-center overflow-hidden ${className}`}
      style={{ background: "linear-gradient(135deg,#ffffff,#f1f3f6)" }}
    >
      <CategoryIcon
        icon={ICON[category]}
        className="w-1/3 h-1/3 text-[var(--color-steel-400)]"
      />
    </div>
  );
}
