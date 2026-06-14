import { StarIcon } from "./Icons";

export default function Stars({
  rating,
  count,
  size = "sm",
}: {
  rating: number;
  count?: number;
  size?: "sm" | "md";
}) {
  const px = size === "sm" ? "w-3.5 h-3.5" : "w-4.5 h-4.5";
  return (
    <div className="flex items-center gap-1">
      <div className="flex text-[var(--color-accent)]">
        {[0, 1, 2, 3, 4].map((i) => {
          const fill =
            rating >= i + 1 ? "full" : rating >= i + 0.5 ? "half" : "empty";
          return <StarIcon key={i} className={px} fill={fill} />;
        })}
      </div>
      <span className="text-xs text-[var(--color-ink-soft)]">
        {rating.toFixed(1)}
        {count !== undefined && <> ({count})</>}
      </span>
    </div>
  );
}
