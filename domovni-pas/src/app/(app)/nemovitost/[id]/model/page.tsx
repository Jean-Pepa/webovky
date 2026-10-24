"use client";

import Link from "next/link";
import { Suspense, useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useStore, type ElementCategory, type HouseElement, type HouseModel, type Property } from "@/lib/store";
import { canEditProperty, canSeeProperty } from "@/lib/access";
import { ELEMENT_CATEGORY_COLORS, ELEMENT_CATEGORY_ORDER, findElement } from "@/lib/elements";
import { denormalizePoints, normalizePoint, pxPerMeterFrom, formatScale, type Pt } from "@/lib/plan";
import { Loading } from "@/components/Loading";
import { BackLink } from "@/components/BackLink";
import { Badge } from "@/components/ui/Badge";
import { IconBox, IconChevronDown, IconClose, IconPlus, IconShield } from "@/components/Icons";
import { PlanViewer, type PlanViewerHandle } from "@/components/model/PlanViewer";
import { ModelUpload } from "@/components/model/ModelUpload";
import { LayerToggles } from "@/components/model/LayerToggles";
import { AccuracyLegend } from "@/components/model/AccuracyLegend";
import { PlacementBar } from "@/components/model/PlacementBar";
import { ScaleCalibration } from "@/components/model/ScaleCalibration";
import { ElementPanel } from "@/components/model/ElementPanel";
import { UnderlayPicker } from "@/components/model/UnderlayPicker";
import { IconMapPin } from "@/components/model/icons";
import {
  elementPageHref,
  floorplans,
  groupPlans,
  isOnModel,
  planDims,
  plural,
} from "@/components/model/model-utils";

type Mode =
  | { type: "view" }
  | { type: "place"; elementId: string; points: Pt[] } // body 0–1
  | { type: "calibrate"; points: Pt[] }; // body v px podkladu

const VIEW: Mode = { type: "view" };

export default function ModelPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ModelRoute />
    </Suspense>
  );
}

function ModelRoute() {
  const { id } = useParams<{ id: string }>();
  const search = useSearchParams();
  const prvek = search.get("prvek") ?? undefined;
  const place = search.get("umistit") === "1";
  const { getProperty, hydrated, role } = useStore();

  if (!hydrated) return <Loading />;

  const property = getProperty(id);
  if (!property || (role && !canSeeProperty(property, role))) {
    return (
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-stone-500">
          {property ? "K této nemovitosti nemáte přístup." : "Nemovitost nenalezena."}
        </p>
        <Link href="/prehled" className="btn-secondary mt-4">
          Zpět na přehled
        </Link>
      </div>
    );
  }

  const editable = role ? canEditProperty(property, role) : false;
  // nové parametry v adrese (?prvek=…) = nový výchozí stav
  return (
    <ModelWorkspace
      key={`${prvek ?? ""}|${place ? 1 : 0}`}
      property={property}
      editable={editable}
      initialElementId={prvek}
      initialPlace={place}
    />
  );
}

function ModelWorkspace({
  property,
  editable,
  initialElementId,
  initialPlace,
}: {
  property: Property;
  editable: boolean;
  initialElementId?: string;
  initialPlace: boolean;
}) {
  const { updateElement, updateModel, deleteModel } = useStore();
  const pid = property.id;

  const plans = floorplans(property);
  const groups = groupPlans(plans);
  const allModels = property.models ?? [];
  const elements = property.elements ?? [];

  // Výchozí stav z adresy: vybraný prvek, jeho podklad, případně rovnou umísťování
  const [modelId, setModelId] = useState<string | null>(() => {
    const mid = findElement(property, initialElementId)?.plan?.modelId;
    return mid && plans.some((m) => m.id === mid) ? mid : null;
  });
  const [selectedId, setSelectedId] = useState<string | null>(
    () => findElement(property, initialElementId)?.id ?? null,
  );
  const [mode, setMode] = useState<Mode>(() => {
    const el = findElement(property, initialElementId);
    return el && initialPlace && editable ? { type: "place", elementId: el.id, points: [] } : VIEW;
  });
  const [hidden, setHidden] = useState<ElementCategory[]>([]);
  const [upload, setUpload] = useState<{ title?: string } | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const viewerRef = useRef<PlanViewerHandle>(null);
  const workRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  const current: HouseModel | undefined = plans.find((m) => m.id === modelId) ?? groups[0]?.latest;
  const dims = current ? planDims(current) : null;

  const placingEl = mode.type === "place" ? elements.find((e) => e.id === mode.elementId) : undefined;
  // neplatný režim (smazaný prvek, chybí podklad, jen ke čtení) = prohlížení
  const active: Mode =
    !editable || (mode.type === "place" && !placingEl) || (mode.type === "calibrate" && !current) ? VIEW : mode;

  const onCurrent = current ? elements.filter((e) => isOnModel(e, current.id)) : [];
  const visible = onCurrent.filter((e) => !hidden.includes(e.category));
  const modelOf = (el: HouseElement) =>
    el.plan && el.plan.points.length > 0 ? allModels.find((m) => m.id === el.plan?.modelId) : undefined;
  const onOther = elements.filter((e) => !isOnModel(e, current?.id) && modelOf(e));
  const unplaced = elements.filter((e) => !modelOf(e));
  const counts = Object.fromEntries(
    ELEMENT_CATEGORY_ORDER.map((c) => [c, onCurrent.filter((e) => e.category === c).length]),
  ) as Record<ElementCategory, number>;
  const selected = selectedId ? elements.find((e) => e.id === selectedId) : undefined;
  const showPanel = !!selected && !!current && active.type === "view";

  // Při načtení s ?umistit=1 posunout stránku k půdorysu
  useEffect(() => {
    if (initialPlace && editable) workRef.current?.scrollIntoView({ block: "start" });
  }, [initialPlace, editable]);

  // Escape: zruší umísťování / kalibraci, jinak zavře panel prvku
  const activeType = active.type;
  const hasSelection = !!selectedId;
  useEffect(() => {
    if (activeType === "view" && !hasSelection) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (activeType !== "view") setMode(VIEW);
      else setSelectedId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeType, hasSelection]);

  function scrollToPlan() {
    requestAnimationFrame(() => workRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  function switchModel(id: string) {
    setModelId(id);
    setMode((m) => (m.type === "place" ? { ...m, points: [] } : m.type === "calibrate" ? VIEW : m));
  }

  function startPlace(el: HouseElement) {
    if (!editable) return;
    setSelectedId(el.id);
    setHidden((h) => h.filter((c) => c !== el.category));
    setMode({ type: "place", elementId: el.id, points: [] });
    setNotice(null);
    scrollToPlan();
  }

  function focusElement(el: HouseElement) {
    setSelectedId(el.id);
    setHidden((h) => h.filter((c) => c !== el.category));
    if (current && dims && isOnModel(el, current.id) && el.plan) {
      viewerRef.current?.focusOn(denormalizePoints(el.plan.points, dims.w, dims.h));
    }
    scrollToPlan();
  }

  // Výběr klepnutím do půdorysu; na mobilu posunout půdorys, ať prvek nezakryje spodní list
  function selectOnPlan(id: string | null) {
    setSelectedId(id);
    const el = id ? elements.find((e) => e.id === id) : undefined;
    if (!el?.plan || !current || !dims || !isOnModel(el, current.id)) return;
    const pts = denormalizePoints(el.plan.points, dims.w, dims.h);
    requestAnimationFrame(() => {
      const sheet = sheetRef.current?.getBoundingClientRect();
      if (sheet && sheet.height > 0) viewerRef.current?.reveal(pts, sheet.top);
    });
  }

  function showOnModel(el: HouseElement) {
    const m = modelOf(el);
    if (!m || m.kind !== "FLOORPLAN") return;
    switchModel(m.id);
    setSelectedId(el.id);
    scrollToPlan();
  }

  function onPlanTap(p: Pt) {
    if (!dims) return;
    if (active.type === "place") {
      setMode({ ...active, points: [...active.points, normalizePoint(p, dims.w, dims.h)] });
    } else if (active.type === "calibrate") {
      setMode({ type: "calibrate", points: active.points.length >= 2 ? [p] : [...active.points, p] });
    }
  }

  function finishPlace() {
    if (active.type !== "place" || !current || !placingEl || active.points.length === 0) return;
    updateElement(pid, placingEl.id, { plan: { modelId: current.id, points: active.points } });
    setMode(VIEW);
    setSelectedId(placingEl.id);
    setNotice(`Poloha prvku „${placingEl.name}“ je uložená na podkladu ${current.title}.`);
  }

  function saveScale(meters: number) {
    if (active.type !== "calibrate" || !current || active.points.length < 2) return;
    const ppm = pxPerMeterFrom(active.points[0], active.points[1], meters);
    if (!ppm) return;
    updateModel(pid, current.id, { pxPerMeter: ppm });
    setMode(VIEW);
    setNotice(`Měřítko nastaveno: ${formatScale(ppm)}. Šířka pruhů teď odpovídá skutečné přesnosti.`);
  }

  function clearScale() {
    if (!current) return;
    if (!confirm(`Zrušit měřítko podkladu „${current.title}“? Šířka pruhů pak bude jen orientační.`)) return;
    updateModel(pid, current.id, { pxPerMeter: undefined });
    setNotice("Měřítko zrušeno.");
  }

  function removeModel(m: HouseModel) {
    const n = elements.filter((e) => isOnModel(e, m.id)).length;
    const ok = confirm(
      `Smazat podklad „${m.title}“ (verze ${m.version})?` +
        (n > 0
          ? `\n\n${plural(n, "prvek na něm umístěný přijde", "prvky na něm umístěné přijdou", "prvků na něm umístěných přijde")} o polohu na tomto podkladu. Prvky samotné, jejich záznamy a dokumenty zůstanou.`
          : ""),
    );
    if (!ok) return;
    deleteModel(pid, m.id);
    // zůstat u stejného podlaží (předchozí verze), jinak výchozí podklad
    const sameTitle = groupPlans(plans.filter((x) => x.id !== m.id)).find((g) => g.title === m.title);
    setModelId(sameTitle?.latest.id ?? null);
    setMode(VIEW);
    setNotice(`Podklad „${m.title}“ (verze ${m.version}) je smazaný.`);
  }

  function removeFromPlan(el: HouseElement) {
    if (!confirm(`Odebrat „${el.name}“ z půdorysu? Prvek i jeho záznamy zůstanou, jen ztratí polohu na tomto podkladu.`))
      return;
    updateElement(pid, el.id, { plan: undefined });
    setNotice(`„${el.name}“ už na půdorysu není.`);
  }

  function toggleLayer(cat: ElementCategory) {
    const turningOff = !hidden.includes(cat);
    setHidden((h) => (h.includes(cat) ? h.filter((c) => c !== cat) : [...h, cat]));
    if (turningOff && selected?.category === cat) setSelectedId(null);
  }

  const backHref = initialElementId && findElement(property, initialElementId)
    ? elementPageHref(pid, initialElementId)
    : `/nemovitost/${pid}`;

  const panel = selected && (
    <ElementPanel
      propertyId={pid}
      element={selected}
      currentModel={current}
      placedOn={modelOf(selected)}
      editable={editable}
      onClose={() => setSelectedId(null)}
      onPlace={() => startPlace(selected)}
      onRemove={() => removeFromPlan(selected)}
      onShowModel={(mid) => {
        switchModel(mid);
        scrollToPlan();
      }}
    />
  );

  const initialFocus =
    current && dims && selected?.plan && isOnModel(selected, current.id)
      ? denormalizePoints(selected.plan.points, dims.w, dims.h)
      : null;

  return (
    <div>
      <BackLink href={backHref}>
        {backHref === `/nemovitost/${pid}` ? "Zpět na nemovitost" : "Zpět na prvek"}
      </BackLink>

      <div className="mt-4">
        <h1 className="text-2xl font-semibold tracking-tight text-stone-900">Model domu</h1>
        <p className="mt-1 break-words text-sm text-stone-500">{property.name}</p>
      </div>

      {!editable && (
        <div className="mt-4 flex items-start gap-3 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
          <IconShield className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <p>Model máte jen ke čtení — prohlížet můžete, umísťovat a nahrávat ne.</p>
        </div>
      )}

      {notice && (
        <div
          role="status"
          className="mt-4 flex items-start gap-2 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800"
        >
          <p className="min-w-0 flex-1 break-words">✓ {notice}</p>
          <button
            type="button"
            onClick={() => setNotice(null)}
            className="-m-2 grid h-10 w-10 shrink-0 place-items-center text-emerald-700 hover:text-emerald-900"
            aria-label="Zavřít"
          >
            <IconClose className="h-4 w-4" />
          </button>
        </div>
      )}

      {current && (
        <div className="mt-4">
          <UnderlayPicker
            groups={groups}
            current={current}
            editable={editable}
            busy={active.type !== "view"}
            onSelect={switchModel}
            onUpload={() => setUpload({})}
            onNewVersion={(title) => setUpload({ title })}
            onCalibrate={() => {
              setMode({ type: "calibrate", points: [] });
              setNotice(null);
              scrollToPlan();
            }}
            onClearScale={clearScale}
            onDelete={removeModel}
          />
        </div>
      )}

      {editable && (upload || !current) && (
        <section className="card mt-4 p-5">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h2 className="text-sm font-semibold text-stone-900">
                {!current
                  ? "Nahrajte půdorys"
                  : upload?.title
                    ? `Nová verze podkladu „${upload.title}“`
                    : "Nový podklad"}
              </h2>
              <p className="mt-1 text-sm text-stone-500">
                {!current
                  ? "Půdorys je podklad, na který prvky domu ručně umístíte. Stačí obrázek z projektu, zaměření nebo i vlastní nákres."
                  : "Každé podlaží jako samostatný podklad. Stejný název = nová verze."}
              </p>
              {!current && placingEl && (
                <p className="mt-2 text-sm text-teal-800">
                  Pak na něj umístíte „{placingEl.name}“.
                </p>
              )}
            </div>
            {upload && current && (
              <button
                type="button"
                onClick={() => setUpload(null)}
                className="-m-2 grid h-10 w-10 shrink-0 place-items-center rounded-lg text-stone-400 hover:bg-stone-100 hover:text-stone-700"
                aria-label="Zavřít"
              >
                <IconClose className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="mt-4">
            <ModelUpload
              key={upload?.title ?? "-"}
              property={property}
              initialTitle={upload?.title}
              onCancel={current ? () => setUpload(null) : undefined}
              onSaved={(id, label) => {
                setUpload(null);
                switchModel(id);
                setNotice(`Podklad ${label} je nahraný.`);
                scrollToPlan();
              }}
            />
          </div>
        </section>
      )}

      {!editable && !current && (
        <div className="card mt-4 flex flex-col items-center px-6 py-10 text-center">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-teal-50 text-teal-700">
            <IconBox className="h-6 w-6" />
          </div>
          <p className="mt-3 text-sm font-medium text-stone-800">Zatím žádný půdorys</p>
          <p className="mt-1 max-w-xs text-sm text-stone-500">
            Až majitel nahraje půdorys, uvidíte tu, kde jednotlivé prvky domu jsou.
          </p>
        </div>
      )}

      {current && dims && (
        <div className="mt-4 lg:grid lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start lg:gap-5">
          <div ref={workRef} className="min-w-0 scroll-mt-16">
            {active.type === "place" && placingEl ? (
              <PlacementBar
                element={placingEl}
                pointCount={active.points.length}
                placedOn={modelOf(placingEl)}
                currentModel={current}
                onUndo={() => setMode({ ...active, points: active.points.slice(0, -1) })}
                onDone={finishPlace}
                onCancel={() => setMode(VIEW)}
              />
            ) : active.type === "calibrate" ? (
              <ScaleCalibration
                points={active.points}
                pxPerMeter={current.pxPerMeter}
                onSave={saveScale}
                onReset={() => setMode({ type: "calibrate", points: [] })}
                onCancel={() => setMode(VIEW)}
              />
            ) : (
              <LayerToggles
                counts={counts}
                hidden={hidden}
                onToggle={toggleLayer}
                onShowAll={() => setHidden([])}
              />
            )}

            <div className="-mx-6 mt-3 overflow-hidden border-y border-stone-200 sm:mx-0 sm:rounded-2xl sm:border">
              <PlanViewer
                key={current.id}
                ref={viewerRef}
                model={current}
                elements={visible}
                selectedId={active.type === "view" ? selectedId : null}
                mode={active.type === "view" ? "select" : "draw"}
                draft={
                  active.type === "place" && placingEl
                    ? {
                        points: denormalizePoints(active.points, dims.w, dims.h),
                        color: ELEMENT_CATEGORY_COLORS[placingEl.category],
                      }
                    : null
                }
                calibration={active.type === "calibrate" ? active.points : null}
                dimOthers={active.type !== "view"}
                initialFocus={initialFocus}
                onSelect={selectOnPlan}
                onPlanTap={onPlanTap}
                className="h-[58vh] min-h-[300px] max-h-[720px]"
              />
            </div>
            <p className="mt-2 text-xs text-stone-500">
              {active.type === "view"
                ? "Klepněte na prvek. Tažením posunete, kolečkem nebo dvěma prsty přiblížíte."
                : "Tažením posunete půdorys, klepnutím přidáte bod. Esc = zrušit."}
            </p>

            <AccuracyLegend pxPerMeter={current.pxPerMeter} className="mt-3" />
          </div>

          <aside className="hidden lg:block">
            <div className="card sticky top-20 p-4">
              {showPanel ? (
                panel
              ) : (
                <div className="text-sm text-stone-600">
                  <p className="font-medium text-stone-900">
                    {active.type === "place"
                      ? "Umísťování"
                      : active.type === "calibrate"
                        ? "Měřítko"
                        : "Vyberte prvek"}
                  </p>
                  <p className="mt-1">
                    {active.type === "place"
                      ? "Klepněte do půdorysu na místo prvku. U rozvodu postupně na body trasy, pak „Hotovo“."
                      : active.type === "calibrate"
                        ? "Klepněte na dva body se známou vzdáleností a zadejte ji v metrech."
                        : "Klepněte na prvek v půdorysu — uvidíte, co to je, jak přesně známe jeho polohu, a můžete k němu rovnou zapsat."}
                  </p>
                </div>
              )}
            </div>
          </aside>
        </div>
      )}

      <ElementLists
        propertyId={pid}
        current={current}
        editable={editable}
        onCurrent={onCurrent}
        unplaced={unplaced}
        onOther={onOther}
        modelOf={modelOf}
        selectedId={selectedId}
        totalElements={elements.length}
        onSelect={focusElement}
        onPlace={startPlace}
        onShowModel={showOnModel}
      />

      <section className="card mt-6 flex items-start gap-3 p-5">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-stone-100 text-stone-500">
          <IconBox className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-sm font-semibold text-stone-900">Import IFC (Archicad / Revit)</h2>
            <Badge color="amber">připravujeme</Badge>
          </div>
          <p className="mt-1 text-sm leading-relaxed text-stone-600">
            Načte z projektu prvky domu i s jejich IFC GlobalId — stěny, okna, rozvody, zařízení — a ukáže
            je i ve 3D. Poloha z modelu projektu se povede jako „z výkresu“. Do té doby nahrajte půdorys jako
            obrázek a prvky na něj umístěte ručně.
          </p>
        </div>
      </section>

      {/* Mobil: panel vybraného prvku jako spodní list */}
      {showPanel && (
        <>
          <div className="h-80 lg:hidden" aria-hidden />
          <div ref={sheetRef} className="fixed bottom-0 left-16 right-0 z-30 lg:hidden">
            <div className="max-h-[55vh] overflow-y-auto rounded-t-2xl border-t border-stone-200 bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(42,33,30,0.12)]">
              {panel}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function ElementDot({ el }: { el: HouseElement }) {
  return (
    <span
      className="h-2.5 w-2.5 shrink-0 rounded-full"
      style={{ background: ELEMENT_CATEGORY_COLORS[el.category] }}
      aria-hidden
    />
  );
}

// Seznamy pod půdorysem: co je na tomto podkladu, co nemá polohu, co je jinde
function ElementLists({
  propertyId,
  current,
  editable,
  onCurrent,
  unplaced,
  onOther,
  modelOf,
  selectedId,
  totalElements,
  onSelect,
  onPlace,
  onShowModel,
}: {
  propertyId: string;
  current?: HouseModel;
  editable: boolean;
  onCurrent: HouseElement[];
  unplaced: HouseElement[];
  onOther: HouseElement[];
  modelOf: (el: HouseElement) => HouseModel | undefined;
  selectedId: string | null;
  totalElements: number;
  onSelect: (el: HouseElement) => void;
  onPlace: (el: HouseElement) => void;
  onShowModel: (el: HouseElement) => void;
}) {
  const byName = (a: HouseElement, b: HouseElement) =>
    ELEMENT_CATEGORY_ORDER.indexOf(a.category) - ELEMENT_CATEGORY_ORDER.indexOf(b.category) ||
    (a.name ?? "").localeCompare(b.name ?? "", "cs");
  const canPlace = editable && !!current;

  if (totalElements === 0) {
    return (
      <section className="card mt-6 p-5">
        <h2 className="text-sm font-semibold text-stone-900">Prvky domu</h2>
        <p className="mt-1 text-sm text-stone-500">
          Zatím žádné prvky. Přidejte rozvaděč, kotel nebo okruh — pak je tu umístíte na půdorys.
        </p>
        {editable && (
          <Link href={`/nemovitost/${propertyId}/prvky?nova=1`} className="btn-primary btn-sm mt-3 min-h-10">
            <IconPlus className="h-4 w-4" />
            Přidat prvek
          </Link>
        )}
      </section>
    );
  }

  return (
    <div className="mt-6 space-y-4">
      {current && onCurrent.length > 0 && (
        <section className="card p-5">
          <h2 className="text-sm font-semibold text-stone-900">
            Na tomto podkladu <span className="font-normal text-stone-400">· {onCurrent.length}</span>
          </h2>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {[...onCurrent].sort(byName).map((el) => (
              <li key={el.id} className="max-w-full">
                <button
                  type="button"
                  onClick={() => onSelect(el)}
                  aria-pressed={el.id === selectedId}
                  className={`inline-flex min-h-10 max-w-full items-center gap-1.5 rounded-full border px-3 text-xs font-medium transition ${
                    el.id === selectedId
                      ? "border-teal-700 bg-teal-50 text-teal-900"
                      : "border-stone-300 bg-white text-stone-700 hover:bg-stone-50"
                  }`}
                >
                  <ElementDot el={el} />
                  <span className="truncate">{el.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="card p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-stone-900">
            Prvky bez polohy na tomto podkladu
            {unplaced.length > 0 && <span className="font-normal text-stone-400"> · {unplaced.length}</span>}
          </h2>
          {editable && (
            <Link
              href={`/nemovitost/${propertyId}/prvky?nova=1`}
              className="btn-ghost btn-sm min-h-10 text-teal-700"
            >
              <IconPlus className="h-4 w-4" />
              Přidat prvek
            </Link>
          )}
        </div>

        {unplaced.length === 0 ? (
          <p className="mt-1 text-sm text-stone-500">Všechny prvky mají polohu na některém podkladu.</p>
        ) : (
          <>
            {editable && !current && (
              <p className="mt-1 text-sm text-stone-500">Nejdřív nahrajte půdorys, pak prvky umístíte.</p>
            )}
            <ul className="mt-1 divide-y divide-stone-100">
              {[...unplaced].sort(byName).map((el) => (
                <li key={el.id} className="flex items-center gap-3 py-2">
                  <ElementDot el={el} />
                  <div className="min-w-0 flex-1">
                    <Link
                      href={elementPageHref(propertyId, el.id)}
                      className="block break-words text-sm font-medium text-stone-800 hover:text-teal-800"
                    >
                      {el.name}
                    </Link>
                    {(el.kind || el.room) && (
                      <p className="break-words text-xs text-stone-500">
                        {[el.kind, el.room].filter(Boolean).join(" · ")}
                      </p>
                    )}
                  </div>
                  {canPlace && (
                    <button
                      type="button"
                      onClick={() => onPlace(el)}
                      className="btn-secondary btn-sm min-h-10 shrink-0"
                    >
                      <IconMapPin className="h-4 w-4" />
                      Umístit
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </>
        )}

        {onOther.length > 0 && (
          <details className="group mt-3 border-t border-stone-100 pt-2">
            <summary className="flex min-h-10 cursor-pointer list-none items-center gap-1.5 text-sm text-stone-600 hover:text-stone-900 [&::-webkit-details-marker]:hidden">
              <IconChevronDown className="h-4 w-4 shrink-0 transition group-open:rotate-180" />
              {plural(onOther.length, "prvek je umístěný", "prvky jsou umístěné", "prvků je umístěných")} na jiném
              podkladu
            </summary>
            <ul className="mt-1 divide-y divide-stone-100">
              {[...onOther].sort(byName).map((el) => {
                const m = modelOf(el);
                return (
                  <li key={el.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2">
                    <ElementDot el={el} />
                    <div className="min-w-0 flex-1">
                      <p className="break-words text-sm font-medium text-stone-800">{el.name}</p>
                      {m && (
                        <p className="text-xs text-stone-500">
                          {m.title} · verze {m.version}
                        </p>
                      )}
                    </div>
                    <div className="flex shrink-0 gap-1">
                      {m?.kind === "FLOORPLAN" && (
                        <button
                          type="button"
                          onClick={() => onShowModel(el)}
                          className="btn-ghost btn-sm min-h-10 text-teal-700"
                        >
                          Zobrazit
                        </button>
                      )}
                      {canPlace && (
                        <button
                          type="button"
                          onClick={() => onPlace(el)}
                          className="btn-ghost btn-sm min-h-10 text-stone-600"
                        >
                          <IconMapPin className="h-4 w-4" />
                          Umístit sem
                        </button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </details>
        )}
      </section>
    </div>
  );
}
