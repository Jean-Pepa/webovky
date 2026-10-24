import type { HouseElement } from "@/lib/store";
import { ELEMENT_CATEGORY_COLORS, accuracyClass } from "@/lib/elements";
import {
  MARKER_CORE_PX,
  PLAN_STYLE,
  accuracyBandWidth,
  accuracyHaloRadius,
  denormalizePoints,
  planSize,
  polylinePath,
  type Pt,
} from "@/lib/plan";

export type ShapeEmphasis = "normal" | "selected" | "dim" | "faint";

const OPACITY: Record<ShapeEmphasis, number> = { normal: 1, selected: 1, dim: 0.45, faint: 0.2 };

// Geometrie prvku v px podkladu + přesnost (sdílí prohlížeč, náhled i zásah klepnutím):
// trasa → šířka pruhu, zařízení → poloměr kruhu přesnosti; reach = dosah pro klepnutí
export function elementGeometry(
  el: HouseElement,
  w: number,
  h: number,
  pxPerMeter: number | undefined,
  k: number,
): { points: Pt[]; band: number; halo: number; reach: number } {
  const points = el.plan ? denormalizePoints(el.plan.points, w, h) : [];
  const opts = { cls: accuracyClass(el), accuracyMm: el.accuracyMm, pxPerMeter, planSize: planSize(w, h), k };
  if (points.length === 1) {
    const halo = accuracyHaloRadius(opts);
    return { points, band: 0, halo, reach: halo };
  }
  const band = accuracyBandWidth(opts);
  return { points, band, halo: 0, reach: band / 2 };
}

// Jeden prvek na půdorysu. Trasa: tenká čára = změřeno, čára se světlým pruhem = z výkresu,
// široký průsvitný pruh s čárkovanou osou = odhad. Zařízení: značka s kruhem přesnosti.
// Rozměry v px obrazovky se přepočítají přes k (px obrazovky na 1 px podkladu).
export function ElementShape({
  element: el,
  width,
  height,
  pxPerMeter,
  k,
  emphasis = "normal",
}: {
  element: HouseElement;
  width: number;
  height: number;
  pxPerMeter?: number;
  k: number;
  emphasis?: ShapeEmphasis;
}) {
  const { points, band, halo } = elementGeometry(el, width, height, pxPerMeter, k);
  if (points.length === 0) return null;
  const cls = accuracyClass(el);
  const st = PLAN_STYLE[cls];
  const color = ELEMENT_CATEGORY_COLORS[el.category];
  const s = 1 / (k > 0 ? k : 1); // 1 px obrazovky v px podkladu
  const selected = emphasis === "selected";
  const opacity = OPACITY[emphasis];

  if (points.length === 1) {
    const [cx, cy] = points[0];
    const core = (MARKER_CORE_PX + (selected ? 1.5 : 0)) * s;
    return (
      <g opacity={opacity}>
        {halo > core + s && (
          <circle
            cx={cx}
            cy={cy}
            r={halo}
            fill={color}
            fillOpacity={selected ? 0.26 : 0.17}
            stroke={color}
            strokeOpacity={0.55}
            strokeWidth={1.25 * s}
            strokeDasharray={cls === "ESTIMATE" ? `${4 * s} ${3 * s}` : undefined}
          />
        )}
        {selected && (
          <circle cx={cx} cy={cy} r={core + 5 * s} fill="none" stroke={color} strokeWidth={2.5 * s} />
        )}
        <circle cx={cx} cy={cy} r={core} fill={color} stroke="#ffffff" strokeWidth={2 * s} />
      </g>
    );
  }

  const d = polylinePath(points);
  const line = st.line * (selected ? 1.35 : 1) * s;
  return (
    <g opacity={opacity} fill="none" strokeLinecap="round" strokeLinejoin="round">
      {band > 0 && (
        <path
          d={d}
          stroke={color}
          strokeOpacity={Math.min(st.bandOpacity * (selected ? 1.5 : 1), 0.4)}
          strokeWidth={band}
        />
      )}
      {selected && <path d={d} stroke="#ffffff" strokeWidth={line + 4 * s} strokeOpacity={0.9} />}
      <path
        d={d}
        stroke={color}
        strokeOpacity={selected ? 1 : st.lineOpacity}
        strokeWidth={line}
        strokeDasharray={st.dash ? `${st.dash[0] * s} ${st.dash[1] * s}` : undefined}
      />
      {selected &&
        points.map(([x, y], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={(i === 0 || i === points.length - 1 ? 4.5 : 3) * s}
            fill="#ffffff"
            stroke={color}
            strokeWidth={2 * s}
          />
        ))}
    </g>
  );
}
