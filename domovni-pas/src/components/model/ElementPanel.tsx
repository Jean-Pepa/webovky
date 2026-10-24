import Link from "next/link";
import type { HouseElement, HouseModel } from "@/lib/store";
import {
  ELEMENT_CATEGORIES,
  ELEMENT_CATEGORY_COLORS,
  ELEMENT_CONDITIONS,
  ELEMENT_CONDITION_COLORS,
  SAFETY_NOTE,
  accuracyClass,
  accuracyLabel,
  formatMm,
} from "@/lib/elements";
import { Badge } from "@/components/ui/Badge";
import { IconAlert, IconArrowRight, IconClose, IconPlus, IconTrash } from "@/components/Icons";
import { AccuracySwatch } from "./AccuracyLegend";
import { IconMapPin } from "./icons";
import { elementPageHref, isOnModel, newEntryHref } from "./model-utils";

// „Tudy vede elektrický okruh, přesnost ±2 cm." — nikdy netvrdíme, že je někde bezpečné vrtat
function whereSentence(el: HouseElement, onPlan: boolean): string | null {
  if (!onPlan || !el.plan) return null;
  const route = el.plan.points.length > 1;
  const noun = el.kind ? el.kind.charAt(0).toLocaleLowerCase("cs") + el.kind.slice(1) : route ? "vedení" : "prvek";
  const acc = el.accuracyMm != null ? `přesnost ±${formatMm(el.accuracyMm)}` : "přesnost neuvedená";
  return `${route ? "Tudy vede" : "Tady je"} ${noun}, ${acc}.`;
}

// Panel vybraného prvku: krátký popis, přesnost, „Vše o prvku", „Zapsat sem"
export function ElementPanel({
  propertyId,
  element: el,
  currentModel,
  placedOn,
  editable,
  onClose,
  onPlace,
  onRemove,
  onShowModel,
}: {
  propertyId: string;
  element: HouseElement;
  currentModel?: HouseModel;
  placedOn?: HouseModel; // podklad, na kterém je prvek zakreslený
  editable: boolean;
  onClose: () => void;
  onPlace: () => void;
  onRemove: () => void;
  onShowModel: (modelId: string) => void;
}) {
  const color = ELEMENT_CATEGORY_COLORS[el.category];
  const onThis = isOnModel(el, currentModel?.id);
  const elsewhere = !onThis && placedOn ? placedOn : undefined;
  const canSwitch = elsewhere?.kind === "FLOORPLAN";
  const meta = [el.kind, el.room].filter(Boolean).join(" · ");
  const sentence = whereSentence(el, onThis);
  const condition = el.condition && ELEMENT_CONDITIONS[el.condition] ? el.condition : "UNKNOWN";

  return (
    <div>
      <div className="flex items-start gap-2.5">
        <span className="mt-1.5 h-3 w-3 shrink-0 rounded-full" style={{ background: color }} aria-hidden />
        <div className="min-w-0 flex-1">
          <p className="text-xs text-stone-500">{ELEMENT_CATEGORIES[el.category]}</p>
          <h2 className="break-words text-base font-semibold leading-snug text-stone-900">{el.name}</h2>
          {meta && <p className="break-words text-sm text-stone-500">{meta}</p>}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="-m-1 grid h-10 w-10 shrink-0 place-items-center rounded-lg text-stone-400 transition hover:bg-stone-100 hover:text-stone-700"
          aria-label="Zavřít"
        >
          <IconClose className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <Badge color={ELEMENT_CONDITION_COLORS[condition]}>{ELEMENT_CONDITIONS[condition]}</Badge>
      </div>

      {sentence && <p className="mt-3 text-sm text-stone-800">{sentence}</p>}

      <div className="mt-2 flex items-center gap-2.5 rounded-xl bg-stone-50 p-2.5">
        <AccuracySwatch cls={accuracyClass(el)} color={color} />
        <div className="min-w-0">
          <p className="text-xs text-stone-500">Přesnost polohy</p>
          <p className="break-words text-sm font-medium text-stone-900">{accuracyLabel(el)}</p>
        </div>
      </div>

      {el.location && (
        <p className="mt-2 whitespace-pre-line break-words text-sm leading-relaxed text-stone-600">{el.location}</p>
      )}

      {!onThis && (
        <p className="mt-2 rounded-lg border border-dashed border-stone-300 p-2.5 text-xs text-stone-600">
          {elsewhere
            ? `Zakreslený na podkladu „${elsewhere.title}“ (verze ${elsewhere.version}).`
            : "Poloha zatím není zakreslená."}
        </p>
      )}

      <div className="mt-3 flex items-start gap-2 rounded-xl bg-amber-50 p-2.5 text-xs leading-relaxed text-amber-900" role="note">
        <IconAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
        <p>{SAFETY_NOTE}</p>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <Link href={elementPageHref(propertyId, el.id)} className="btn-primary min-h-10 flex-1 basis-32">
          Vše o prvku
          <IconArrowRight className="h-4 w-4" />
        </Link>
        {editable && (
          <Link href={newEntryHref(propertyId, el.id)} className="btn-secondary min-h-10 flex-1 basis-32">
            <IconPlus className="h-4 w-4" />
            Zapsat sem
          </Link>
        )}
      </div>

      {(elsewhere || (editable && currentModel)) && (
        <div className="mt-2 flex flex-wrap gap-1">
          {elsewhere && canSwitch && (
            <button
              type="button"
              onClick={() => onShowModel(elsewhere.id)}
              className="btn-ghost btn-sm min-h-10 text-teal-700"
            >
              Přepnout na {elsewhere.title}
            </button>
          )}
          {editable && currentModel && (
            <button type="button" onClick={onPlace} className="btn-ghost btn-sm min-h-10 text-teal-700">
              <IconMapPin className="h-4 w-4" />
              {onThis ? "Překreslit polohu" : elsewhere ? "Umístit sem" : "Umístit na půdorys"}
            </button>
          )}
          {editable && onThis && (
            <button
              type="button"
              onClick={onRemove}
              className="btn-ghost btn-sm min-h-10 text-stone-500 hover:text-red-600"
            >
              <IconTrash className="h-4 w-4" />
              Odebrat z půdorysu
            </button>
          )}
        </div>
      )}
    </div>
  );
}
