import type { AccuracyClass, HouseElement } from "@/lib/store";
import { ACCURACY_CLASSES, ELEMENT_CATEGORY_COLORS, accuracyClass, accuracyLabel } from "@/lib/elements";

// Přesnost polohy vždy vidět: tenká čára = změřeno, střední čára = z výkresu,
// široký průsvitný pruh = odhad (stejný jazyk jako v prohlížeči modelu).
const STYLE: Record<AccuracyClass, { line: number; band: number; dash?: string }> = {
  MEASURED: { line: 1.6, band: 0 },
  DRAWING: { line: 4.5, band: 0 },
  ESTIMATE: { line: 1.4, band: 13, dash: "3 2.5" },
};

const SIZES = {
  sm: { w: 28, h: 12 },
  md: { w: 40, h: 16 },
  lg: { w: 64, h: 26 },
};

export function AccuracyIndicator({
  element,
  color,
  size = "md",
  showLabel = false,
  className = "",
}: {
  element: Pick<HouseElement, "source" | "accuracyMm"> & { category?: HouseElement["category"] };
  color?: string; // hex; výchozí barva vrstvy prvku
  size?: keyof typeof SIZES;
  showLabel?: boolean; // „Změřeno" / „Z výkresu" / „Odhad"
  className?: string;
}) {
  const cls = accuracyClass(element);
  const s = STYLE[cls];
  const { w, h } = SIZES[size];
  const stroke = color ?? (element.category ? ELEMENT_CATEGORY_COLORS[element.category] : "#57534e");
  const title = `Přesnost polohy: ${accuracyLabel(element)}`;

  return (
    <span className={`inline-flex shrink-0 items-center gap-1.5 ${className}`} title={title}>
      <svg width={w} height={h} viewBox="0 0 40 16" role="img" aria-label={title}>
        {s.band > 0 && (
          <rect
            x={1}
            y={8 - s.band / 2}
            width={38}
            height={s.band}
            rx={s.band / 2}
            fill={stroke}
            fillOpacity={0.2}
          />
        )}
        <line
          x1={4}
          y1={8}
          x2={36}
          y2={8}
          stroke={stroke}
          strokeWidth={s.line}
          strokeLinecap="round"
          strokeDasharray={s.dash}
          strokeOpacity={cls === "DRAWING" ? 0.75 : 1}
        />
      </svg>
      {showLabel && <span className="text-xs text-stone-500">{ACCURACY_CLASSES[cls]}</span>}
    </span>
  );
}
