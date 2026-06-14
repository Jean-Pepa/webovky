import { CategoryIcon } from "./Icons";
import type { CategorySlug } from "@/data/catalog";

const BG: Record<CategorySlug, string> = {
  "hutni-material": "linear-gradient(135deg,#25344a,#121a28)",
  zelezarstvi: "linear-gradient(135deg,#364963,#1a2536)",
  vinohradnictvi: "linear-gradient(135deg,#3f4d33,#1f2718)",
};

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
      className={`relative grid place-items-center overflow-hidden bg-grid ${className}`}
      style={{ background: BG[category] }}
    >
      <CategoryIcon icon={ICON[category]} className="w-1/3 h-1/3 text-white/85" />
    </div>
  );
}
