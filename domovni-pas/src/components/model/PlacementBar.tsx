import type { HouseElement, HouseModel } from "@/lib/store";
import { ELEMENT_CATEGORY_COLORS } from "@/lib/elements";
import { IconCheck } from "@/components/Icons";
import { IconMapPin, IconUndo } from "./icons";

// Režim umísťování: klepnutím do půdorysu přibývají body (1 bod = zařízení, víc bodů = trasa)
export function PlacementBar({
  element,
  pointCount,
  placedOn,
  currentModel,
  onUndo,
  onDone,
  onCancel,
}: {
  element: HouseElement;
  pointCount: number;
  placedOn?: HouseModel; // kde je prvek zakreslený teď
  currentModel: HouseModel;
  onUndo: () => void;
  onDone: () => void;
  onCancel: () => void;
}) {
  const color = ELEMENT_CATEGORY_COLORS[element.category];
  const status =
    pointCount === 0
      ? "Zatím žádný bod."
      : pointCount === 1
        ? "1 bod — zařízení (rozvaděč, kotel…). Další body z něj udělají trasu."
        : `${pointCount} ${pointCount <= 4 ? "body" : "bodů"} — trasa.`;
  const redraw = placedOn?.id === currentModel.id;
  const moving = placedOn && !redraw;

  return (
    <div className="rounded-xl border border-teal-200 bg-teal-50 p-3" role="region" aria-label="Umístění prvku">
      <div className="flex items-start gap-2">
        <IconMapPin className="mt-0.5 h-4 w-4 shrink-0" style={{ color }} />
        <p className="min-w-0 break-words text-sm font-semibold text-stone-900">
          {redraw ? "Překreslujete" : "Umísťujete"}: {element.name}
        </p>
      </div>
      <p className="mt-1 text-sm text-stone-700">
        Klepněte na místo prvku. U rozvodu klepněte postupně na body trasy.
      </p>
      <p className="mt-1 text-xs text-stone-500" aria-live="polite">
        {status}
        {redraw && " Původní poloha se nahradí."}
      </p>
      {moving && (
        <p className="mt-1 text-xs text-stone-500">
          Teď je zakreslený na podkladu „{placedOn.title}“ (verze {placedOn.version}) — uložením se přesune sem.
        </p>
      )}
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={onDone} disabled={pointCount === 0} className="btn-primary min-h-10">
          <IconCheck className="h-4 w-4" />
          Hotovo
        </button>
        <button type="button" onClick={onUndo} disabled={pointCount === 0} className="btn-secondary min-h-10">
          <IconUndo className="h-4 w-4" />
          Zpět o bod
        </button>
        <button type="button" onClick={onCancel} className="btn-ghost min-h-10">
          Zrušit
        </button>
      </div>
    </div>
  );
}
