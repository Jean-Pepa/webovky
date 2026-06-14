import type { CategorySlug } from "@/data/catalog";

export default function ProductThumb({
  category,
  className = "",
}: {
  category: CategorySlug;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden bg-white ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/categories/${category}.png`}
        alt=""
        className="w-full h-full object-cover"
      />
    </div>
  );
}
