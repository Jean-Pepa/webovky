import type { AccuracyClass } from "@/lib/store";
import { ACCURACY_CLASSES, SAFETY_NOTE } from "@/lib/elements";
import { PLAN_STYLE } from "@/lib/plan";

const DESCRIPTIONS: Record<AccuracyClass, string> = {
  MEASURED: "tenká čára",
  DRAWING: "čára se světlým pruhem",
  ESTIMATE: "široký pruh, čárkovaná osa",
};

const ORDER: AccuracyClass[] = ["MEASURED", "DRAWING", "ESTIMATE"];

// Vzorek čáry v daném stylu přesnosti (stejný jazyk jako na půdorysu)
export function AccuracySwatch({
  cls,
  color = "#57534e",
  width = 44,
  height = 18,
}: {
  cls: AccuracyClass;
  color?: string;
  width?: number;
  height?: number;
}) {
  const st = PLAN_STYLE[cls];
  const band = Math.min(st.bandMin, height);
  const y = height / 2;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden className="shrink-0">
      {band > 0 && (
        <line
          x1={band / 2}
          y1={y}
          x2={width - band / 2}
          y2={y}
          stroke={color}
          strokeOpacity={st.bandOpacity}
          strokeWidth={band}
          strokeLinecap="round"
        />
      )}
      <line
        x1={4}
        y1={y}
        x2={width - 4}
        y2={y}
        stroke={color}
        strokeOpacity={st.lineOpacity}
        strokeWidth={st.line}
        strokeLinecap="round"
        strokeDasharray={st.dash?.join(" ")}
      />
    </svg>
  );
}

// Legenda přesnosti pod půdorysem
export function AccuracyLegend({ pxPerMeter, className = "" }: { pxPerMeter?: number; className?: string }) {
  return (
    <div className={`rounded-xl bg-stone-50 p-3 ${className}`}>
      <p className="text-xs font-semibold text-stone-700">Jak přesně polohu známe</p>
      <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-2">
        {ORDER.map((cls) => (
          <li key={cls} className="flex items-center gap-2 text-xs text-stone-600">
            <AccuracySwatch cls={cls} />
            <span>
              <span className="font-medium text-stone-800">{ACCURACY_CLASSES[cls]}</span> — {DESCRIPTIONS[cls]}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-xs leading-relaxed text-stone-500">
        Zařízení (kotel, rozvaděč) má kolem značky kruh přesnosti.{" "}
        {pxPerMeter
          ? "Šířka pruhu i kruhu odpovídá přesnosti ± v měřítku půdorysu."
          : "Měřítko není nastavené — šířka pruhu je jen orientační."}
      </p>
      <p className="mt-1 text-xs leading-relaxed text-amber-800">{SAFETY_NOTE}</p>
    </div>
  );
}
