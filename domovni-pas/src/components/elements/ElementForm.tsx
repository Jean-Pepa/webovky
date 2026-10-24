"use client";

import Link from "next/link";
import { useId, useState } from "react";
import {
  useStore,
  type ElementCategory,
  type ElementCondition,
  type ElementInput,
  type ElementSource,
  type HouseElement,
  type Property,
} from "@/lib/store";
import {
  ACCURACY_CLASSES,
  DEFAULT_ACCURACY_MM,
  ELEMENT_CATEGORIES,
  ELEMENT_CATEGORY_ORDER,
  ELEMENT_CONDITIONS,
  ELEMENT_KIND_SUGGESTIONS,
  ELEMENT_SOURCES,
  SOURCE_ACCURACY_CLASS,
  formatMm,
} from "@/lib/elements";
import { ROOM_SUGGESTIONS } from "@/lib/enums";
import { IconCheck, IconChevronDown } from "@/components/Icons";
import { AccuracyIndicator } from "./AccuracyIndicator";
import { IconPin } from "./icons";
import { elementHref, modelHref } from "./element-utils";

const NEW_SOURCE: ElementSource = "ZADAL_UZIVATEL";

// Přidání / úprava prvku domu. Zdroj a přesnost jsou povinná součást (model je zdroj pravdy).
export function ElementForm({
  property,
  element,
  defaults,
  onSaved,
  onCancel,
}: {
  property: Property;
  element?: HouseElement; // úprava existujícího prvku
  defaults?: Partial<ElementInput>; // předvyplnění nového
  onSaved: (elementId: string, created: boolean) => void;
  onCancel?: () => void;
}) {
  const { addElement, updateElement } = useStore();
  const uid = useId();
  const init: Partial<ElementInput> | undefined = element ?? defaults;
  // neznámé hodnoty (např. ze zálohy jiné verze) nahradíme výchozími
  const initSource = init?.source && init.source in ELEMENT_SOURCES ? init.source : NEW_SOURCE;
  const initCategory =
    init?.category && init.category in ELEMENT_CATEGORIES ? init.category : "ELEKTRO";
  // rok výstavby jen jako platný čtyřciferný rok (jinak by vzniklo neplatné datum)
  const yearBuilt =
    property.yearBuilt && property.yearBuilt >= 1000 && property.yearBuilt <= 9999
      ? Math.trunc(property.yearBuilt)
      : undefined;

  const [category, setCategory] = useState<ElementCategory>(initCategory);
  const [source, setSource] = useState<ElementSource>(initSource);
  // nový prvek: přesnost předvyplněná podle zdroje; úprava: to, co prvek má
  const [accuracy, setAccuracy] = useState(() =>
    init?.accuracyMm != null
      ? String(init.accuracyMm)
      : element
        ? ""
        : String(DEFAULT_ACCURACY_MM[initSource]),
  );
  // vlastní hodnota (ne výchozí podle zdroje) se při změně zdroje nepřepisuje
  const [accuracyTouched, setAccuracyTouched] = useState(
    () => init?.accuracyMm != null && init.accuracyMm !== DEFAULT_ACCURACY_MM[initSource],
  );
  const [installDate, setInstallDate] = useState(init?.installDate ?? "");
  const [estimated, setEstimated] = useState(!!init?.installDateEstimated);
  const [error, setError] = useState<string | null>(null);

  const cls = SOURCE_ACCURACY_CLASS[source];
  const accNum = Number(accuracy.replace(",", "."));
  const accPreview = accuracy.trim() && Number.isFinite(accNum) && accNum >= 0 ? accNum : undefined;

  function changeSource(s: ElementSource) {
    setSource(s);
    if (!accuracyTouched || accuracy.trim() === "") {
      setAccuracy(String(DEFAULT_ACCURACY_MM[s]));
      setAccuracyTouched(false);
    }
  }

  function estimateFromYear() {
    if (!yearBuilt) return;
    setInstallDate(`${yearBuilt}-01-01`);
    setEstimated(true);
  }

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const opt = (k: string) => {
      const v = String(fd.get(k) || "").trim();
      return v || undefined;
    };
    const name = opt("name");
    if (!name) {
      setError("Vyplňte název prvku.");
      return;
    }
    let accuracyMm: number | undefined;
    if (accuracy.trim()) {
      if (!Number.isFinite(accNum) || accNum < 0) {
        setError("Přesnost zadejte jako kladné číslo v milimetrech.");
        return;
      }
      accuracyMm = Math.round(accNum);
    }

    const data: ElementInput = {
      name,
      category,
      kind: opt("kind"),
      room: opt("room"),
      location: opt("location"),
      source,
      accuracyMm,
      condition: String(fd.get("condition") || "UNKNOWN") as ElementCondition,
      installDate: installDate || undefined,
      installDateEstimated: installDate && estimated ? true : undefined,
      ifcGlobalId: opt("ifcGlobalId"),
      note: opt("note"),
    };

    setError(null);
    if (element) {
      updateElement(property.id, element.id, data);
      onSaved(element.id, false);
    } else {
      onSaved(addElement(property.id, data), true);
    }
  }

  const kinds = ELEMENT_KIND_SUGGESTIONS[category] ?? [];
  const kindListId = `${uid}-kinds`;
  const roomListId = `${uid}-rooms`;
  const f = (k: string) => `${uid}-${k}`;

  return (
    <form onSubmit={submit} className="space-y-5">
      <div>
        <label className="label" htmlFor={f("name")}>
          Název prvku *
        </label>
        <input
          id={f("name")}
          name="name"
          required
          className="input"
          defaultValue={init?.name ?? ""}
          placeholder="Např. Hlavní rozvaděč, Plynový kotel, Okruh zásuvek — kuchyň"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor={f("category")}>
            Vrstva / kategorie *
          </label>
          <select
            id={f("category")}
            className="input"
            value={category}
            onChange={(e) => setCategory(e.target.value as ElementCategory)}
          >
            {ELEMENT_CATEGORY_ORDER.map((c) => (
              <option key={c} value={c}>
                {ELEMENT_CATEGORIES[c]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor={f("kind")}>
            Druh
          </label>
          <input
            id={f("kind")}
            name="kind"
            list={kindListId}
            className="input"
            defaultValue={init?.kind ?? ""}
            placeholder={kinds[0] ? `Např. ${kinds[0]}` : undefined}
          />
          <datalist id={kindListId}>
            {kinds.map((k) => (
              <option key={k} value={k} />
            ))}
          </datalist>
        </div>
        <div>
          <label className="label" htmlFor={f("room")}>
            Místnost
          </label>
          <input
            id={f("room")}
            name="room"
            list={roomListId}
            className="input"
            defaultValue={init?.room ?? ""}
            placeholder="Např. Kotelna"
          />
          <datalist id={roomListId}>
            {ROOM_SUGGESTIONS.map((r) => (
              <option key={r} value={r} />
            ))}
          </datalist>
        </div>
        <div>
          <label className="label" htmlFor={f("condition")}>
            Stav
          </label>
          <select
            id={f("condition")}
            name="condition"
            className="input"
            defaultValue={init?.condition ?? "UNKNOWN"}
          >
            {Object.entries(ELEMENT_CONDITIONS).map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="label" htmlFor={f("location")}>
          Kudy vede / kde je
        </label>
        <textarea
          id={f("location")}
          name="location"
          className="input min-h-20"
          defaultValue={init?.location ?? ""}
          placeholder="Např. ve stěně 30 cm pod stropem, od rozvaděče ke kuchyni"
        />
      </div>

      {/* Zdroj a přesnost — vždy viditelné */}
      <fieldset className="rounded-xl border border-stone-200 bg-stone-50/60 p-4">
        <legend className="px-1 text-sm font-semibold text-stone-800">Odkud polohu známe</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor={f("source")}>
              Zdroj údaje *
            </label>
            <select
              id={f("source")}
              className="input"
              value={source}
              onChange={(e) => changeSource(e.target.value as ElementSource)}
            >
              {(Object.keys(ELEMENT_SOURCES) as ElementSource[]).map((s) => (
                <option key={s} value={s}>
                  {ELEMENT_SOURCES[s]} — {ACCURACY_CLASSES[SOURCE_ACCURACY_CLASS[s]].toLowerCase()}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor={f("accuracy")}>
              Přesnost (±mm)
            </label>
            <input
              id={f("accuracy")}
              type="number"
              inputMode="numeric"
              min={0}
              step={1}
              className="input"
              value={accuracy}
              onChange={(e) => {
                setAccuracy(e.target.value);
                setAccuracyTouched(true);
              }}
              placeholder="např. 50"
            />
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone-500">
          <AccuracyIndicator element={{ source, accuracyMm: accPreview, category }} showLabel />
          <span>
            ±mm — jak přesně známe polohu
            {accPreview != null && accPreview >= 100 ? ` (±${formatMm(accPreview)})` : ""}.
            {cls === "ESTIMATE" && " Odhad se zpřesní fotkou otevřené zdi s metrem nebo skenem."}
          </span>
        </div>
      </fieldset>

      <div>
        <label className="label" htmlFor={f("installDate")}>
          Datum instalace
        </label>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            id={f("installDate")}
            type="date"
            className="input sm:max-w-48"
            value={installDate}
            onChange={(e) => setInstallDate(e.target.value)}
          />
          <button
            type="button"
            onClick={estimateFromYear}
            disabled={!yearBuilt}
            className="btn-ghost min-h-10 justify-start px-3 py-2 text-teal-700 sm:justify-center"
            title={yearBuilt ? undefined : "Doplňte rok výstavby v údajích o nemovitosti"}
          >
            Odhadnout ze stáří domu
            {yearBuilt ? ` (${yearBuilt})` : ""}
          </button>
        </div>
        <label className="mt-2 inline-flex min-h-10 cursor-pointer items-center gap-2.5 text-sm text-stone-700">
          <input
            type="checkbox"
            className="h-5 w-5 accent-teal-700"
            checked={estimated}
            onChange={(e) => setEstimated(e.target.checked)}
          />
          datum je odhad
        </label>
      </div>

      <details
        className="group rounded-xl border border-stone-200 px-4"
        open={!!(init?.ifcGlobalId || init?.note) || undefined}
      >
        <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-2 text-sm font-medium text-stone-700 [&::-webkit-details-marker]:hidden">
          Pokročilé
          <span className="flex items-center gap-1.5 text-xs font-normal text-stone-400">
            <span className="group-open:hidden">IFC, poznámka</span>
            <IconChevronDown className="h-4 w-4 transition group-open:rotate-180" />
          </span>
        </summary>
        <div className="space-y-4 pb-4">
          <div>
            <label className="label" htmlFor={f("ifc")}>
              IFC GlobalId
            </label>
            <input
              id={f("ifc")}
              name="ifcGlobalId"
              className="input font-mono"
              defaultValue={init?.ifcGlobalId ?? ""}
              placeholder="Např. 2O2Fr$t4X7Zf8NOew3FLOH"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
            />
            <p className="mt-1 text-xs text-stone-400">Vazba na prvek v modelu projektu (BIM).</p>
          </div>
          <div>
            <label className="label" htmlFor={f("note")}>
              Poznámka
            </label>
            <textarea
              id={f("note")}
              name="note"
              className="input"
              defaultValue={init?.note ?? ""}
              placeholder="Např. změřeno při opravě omítky 2025"
            />
          </div>
        </div>
      </details>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <button type="submit" className="btn-primary">
          {element ? "Uložit změny" : "Přidat prvek"}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-secondary">
            Zrušit
          </button>
        )}
      </div>
    </form>
  );
}

// Po přidání prvku: nabídka zakreslit ho do půdorysu.
export function ElementCreatedNotice({
  property,
  element,
  onAnother,
  onClose,
}: {
  property: Property;
  element: HouseElement;
  onAnother?: () => void;
  onClose?: () => void;
}) {
  return (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5">
      <div className="flex items-start gap-3">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-emerald-600 text-white">
          <IconCheck className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="break-words text-sm font-semibold text-stone-900">
            Prvek „{element.name}“ je v knize domu.
          </p>
          <p className="mt-0.5 text-sm text-stone-600">
            Zakreslete ho do půdorysu, ať je vidět, kde je a kudy vede.
          </p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link href={modelHref(property.id, element.id, true)} className="btn-primary">
          <IconPin className="h-4 w-4" />
          Umístit na půdorys
        </Link>
        <Link href={elementHref(property.id, element.id)} className="btn-secondary">
          Otevřít prvek
        </Link>
        {onAnother && (
          <button type="button" onClick={onAnother} className="btn-ghost">
            Přidat další
          </button>
        )}
        {onClose && (
          <button type="button" onClick={onClose} className="btn-ghost text-stone-500">
            Zavřít
          </button>
        )}
      </div>
    </div>
  );
}
