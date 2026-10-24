"use client";

import type { Property } from "@/lib/store";
import { cropAround, denormalizePoints } from "@/lib/plan";
import { ElementShape } from "./ElementShape";
import { isOnModel, modelVersionLabel, planDims } from "./model-utils";

const PREVIEW_PX = 360; // přibližná šířka náhledu na obrazovce (pro tloušťky čar)

// Malý náhled polohy prvku na půdorysu (pro „Vše o prvku"): výřez kolem prvku s okolím,
// prvek ve stylu své přesnosti, ostatní prvky jen slabě. Bez polohy / bez podkladu → null.
export function PlanMini({
  property,
  elementId,
  className = "",
  caption = true,
}: {
  property: Property;
  elementId: string;
  className?: string;
  caption?: boolean; // popisek „Přízemí · verze 1" pod náhledem
}) {
  const el = property.elements?.find((e) => e.id === elementId);
  const plan = el?.plan;
  if (!el || !plan || plan.points.length === 0) return null;
  const model = property.models?.find((m) => m.id === plan.modelId);
  if (!model || model.kind !== "FLOORPLAN") return null;

  const { w: W, h: H } = planDims(model);
  const crop = cropAround(denormalizePoints(plan.points, W, H), W, H, { minFrac: 0.3, aspect: 16 / 10 });
  const k = PREVIEW_PX / crop.w;
  const others = (property.elements ?? []).filter((e) => e.id !== el.id && isOnModel(e, model.id));

  return (
    <figure className={className}>
      <div className="overflow-hidden rounded-xl border border-stone-200 bg-white">
        <svg
          viewBox={`${crop.x} ${crop.y} ${crop.w} ${crop.h}`}
          preserveAspectRatio="xMidYMid meet"
          className="pointer-events-none block h-auto w-full select-none"
          role="img"
          aria-label={`Poloha prvku ${el.name} na podkladu ${model.title}`}
        >
          <rect x={crop.x} y={crop.y} width={crop.w} height={crop.h} fill="#f5f5f4" />
          <rect x={0} y={0} width={W} height={H} fill="#ffffff" />
          {model.dataUrl && (
            <image href={model.dataUrl} x={0} y={0} width={W} height={H} preserveAspectRatio="none" />
          )}
          {others.map((o) => (
            <ElementShape
              key={o.id}
              element={o}
              width={W}
              height={H}
              pxPerMeter={model.pxPerMeter}
              k={k}
              emphasis="faint"
            />
          ))}
          <ElementShape
            element={el}
            width={W}
            height={H}
            pxPerMeter={model.pxPerMeter}
            k={k}
            emphasis="selected"
          />
        </svg>
      </div>
      {caption && (
        <figcaption className="mt-1.5 text-xs text-stone-400">
          {modelVersionLabel(model)}
        </figcaption>
      )}
    </figure>
  );
}
