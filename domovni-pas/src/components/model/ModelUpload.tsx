"use client";

import { useRef, useState } from "react";
import { useStore, type Property } from "@/lib/store";
import { PLAN_ACCEPT, PlanFileError, preparePlanImage, type PreparedPlan } from "./plan-image";
import { floorplans, formatBytes, groupPlans, isOnModel, plural, todayIso } from "./model-utils";
import { IconUpload } from "./icons";

const TITLE_SUGGESTIONS = ["Přízemí", "1. NP", "2. NP", "Podkroví", "Suterén", "1. PP", "Střecha", "Situace"];
const SOURCE_SUGGESTIONS = ["Projekt", "Zaměření", "Vlastní nákres"];

// Vejde se podklad ještě do úložiště prohlížeče? Zkusí zapsat stejně dlouhý zkušební řetězec
// (limity se liší — Safari ~2,5 mil. znaků, Chrome / Firefox ~5 mil.).
function storageHasRoom(chars: number): boolean {
  const key = "bulo-plan-space-probe";
  try {
    localStorage.setItem(key, "x".repeat(chars));
    return true;
  } catch {
    return false;
  } finally {
    try {
      localStorage.removeItem(key);
    } catch {
      // ignore
    }
  }
}

// Nahrání půdorysu (obrázek) jako podkladu modelu. Stejný název = další verze.
export function ModelUpload({
  property,
  initialTitle,
  onSaved,
  onCancel,
}: {
  property: Property;
  initialTitle?: string;
  onSaved: (modelId: string, label: string) => void;
  onCancel?: () => void;
}) {
  const { addModel, updateElement } = useStore();
  const [prepared, setPrepared] = useState<PreparedPlan | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState(initialTitle ?? (floorplans(property).length === 0 ? "Přízemí" : ""));
  const [today] = useState(todayIso);
  const [carryOver, setCarryOver] = useState(false);
  const [lowSpace, setLowSpace] = useState(false);
  const pickRef = useRef(0);

  const groups = groupPlans(floorplans(property));
  const typed = title.trim();
  // stejný název bez ohledu na velikost písmen → stejná řada verzí
  const group = typed ? groups.find((g) => g.title.toLocaleLowerCase("cs") === typed.toLocaleLowerCase("cs")) : undefined;
  const prev = group?.latest;
  const prevPlaced = prev ? (property.elements ?? []).filter((e) => isOnModel(e, prev.id)) : [];
  const titleOptions = [...new Set([...groups.map((g) => g.title), ...TITLE_SUGGESTIONS])];

  function pick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    const ticket = ++pickRef.current; // ignorovat výsledek staršího výběru
    setError(null);
    setPrepared(null);
    setLowSpace(false);
    if (!file) return;
    setProcessing(true);
    preparePlanImage(file)
      .then((p) => {
        if (ticket !== pickRef.current) return;
        setPrepared(p);
        // data se ukládají v prohlížeči (pár MB) — upozornit, když by se podklad nevešel
        setLowSpace(!storageHasRoom(p.dataUrl.length + 4096));
      })
      .catch((err: unknown) => {
        if (ticket !== pickRef.current) return;
        setError(err instanceof PlanFileError ? err.message : "Obrázek se nepodařilo zpracovat. Zkuste jiný soubor.");
        e.target.value = "";
      })
      .finally(() => {
        if (ticket === pickRef.current) setProcessing(false);
      });
  }

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (!prepared) {
      setError(processing ? "Chvilku — obrázek se ještě připravuje." : "Vyberte soubor s půdorysem.");
      return;
    }
    if (!typed) {
      setError("Vyplňte název podkladu, např. Přízemí nebo 1. NP.");
      return;
    }
    const finalTitle = group?.title ?? typed;
    const carry = carryOver && prev && prevPlaced.length > 0;
    // měřítko platí jen při stejném výřezu — přepočte se na nový rozměr obrázku
    const pxPerMeter =
      carry && prev?.pxPerMeter && prev.width
        ? Math.round(prev.pxPerMeter * (prepared.width / prev.width) * 100) / 100
        : undefined;
    const id = addModel(property.id, {
      kind: "FLOORPLAN",
      title: finalTitle,
      fileName: prepared.fileName,
      dataUrl: prepared.dataUrl,
      width: prepared.width,
      height: prepared.height,
      date: String(fd.get("date") || "") || today,
      source: String(fd.get("source") || "").trim() || undefined,
      pxPerMeter,
    });
    if (carry) {
      for (const el of prevPlaced) {
        if (el.plan) updateElement(property.id, el.id, { plan: { modelId: id, points: el.plan.points } });
      }
    }
    onSaved(id, `${finalTitle} · verze ${prev ? prev.version + 1 : 1}`);
  }

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <div>
        <p className="label">Soubor s půdorysem</p>
        <label className="flex min-h-24 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-stone-300 bg-stone-50 px-4 py-5 text-center transition focus-within:border-teal-600 focus-within:ring-2 focus-within:ring-teal-600/20 hover:border-teal-600 hover:bg-teal-50/40">
          <IconUpload className="h-6 w-6 text-teal-700" />
          <span className="text-sm font-medium text-stone-800">
            {prepared ? "Vybrat jiný soubor" : "Vybrat obrázek nebo vyfotit výkres"}
          </span>
          <span className="text-xs text-stone-500">
            PNG, JPG, WebP nebo SVG · fotka výkresu z mobilu stačí, ať je rovně a celá
          </span>
          <input type="file" accept={PLAN_ACCEPT} onChange={pick} className="sr-only" />
        </label>
      </div>

      {processing && (
        <p className="text-sm text-stone-500" aria-live="polite">
          Připravuji obrázek…
        </p>
      )}

      {error && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-800" role="alert">
          {error}
        </p>
      )}

      {prepared && (
        <div className="flex items-center gap-3 rounded-xl border border-stone-200 bg-white p-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={prepared.dataUrl}
            alt="Náhled půdorysu"
            className="h-20 w-28 shrink-0 rounded-md border border-stone-100 bg-white object-contain"
          />
          <div className="min-w-0 text-xs text-stone-500">
            <p className="truncate text-sm font-medium text-stone-800">{prepared.fileName}</p>
            <p>
              {prepared.width.toLocaleString("cs-CZ")} × {prepared.height.toLocaleString("cs-CZ")} px ·{" "}
              {formatBytes(prepared.bytes)}
              {prepared.kind === "raster" ? " · zmenšeno pro uložení" : ""}
            </p>
          </div>
        </div>
      )}

      {lowSpace && (
        <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900" role="alert">
          Místo v prohlížeči dochází — podklad by se po zavření stránky ztratil. Zkuste menší obrázek
          nebo smažte starší verze podkladů či velké přílohy.
        </p>
      )}

      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <label htmlFor="plan-title" className="label">
            Název
          </label>
          <input
            id="plan-title"
            name="title"
            className="input"
            list="plan-title-list"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Přízemí, 1. NP…"
            autoComplete="off"
            required
          />
          <datalist id="plan-title-list">
            {titleOptions.map((t) => (
              <option key={t} value={t} />
            ))}
          </datalist>
        </div>
        <div>
          <label htmlFor="plan-date" className="label">
            Stav k
          </label>
          <input id="plan-date" name="date" type="date" className="input" defaultValue={today} />
        </div>
        <div>
          <label htmlFor="plan-source" className="label">
            Zdroj
          </label>
          <input
            id="plan-source"
            name="source"
            className="input"
            list="plan-source-list"
            placeholder="projekt, zaměření…"
            autoComplete="off"
          />
          <datalist id="plan-source-list">
            {SOURCE_SUGGESTIONS.map((t) => (
              <option key={t} value={t} />
            ))}
          </datalist>
        </div>
      </div>

      {prev && (
        <div className="rounded-xl bg-stone-50 p-3 text-sm text-stone-700">
          <p>
            Podklad „{prev.title}“ už máte (verze {prev.version}). Uloží se jako{" "}
            <strong>verze {prev.version + 1}</strong> — starší verze zůstane v historii.
          </p>
          {prevPlaced.length > 0 && (
            <label className="mt-2 flex min-h-10 cursor-pointer items-start gap-2.5">
              <input
                type="checkbox"
                checked={carryOver}
                onChange={(e) => setCarryOver(e.target.checked)}
                className="mt-1 h-4 w-4 shrink-0 accent-teal-700"
              />
              <span>
                Převzít polohy ({plural(prevPlaced.length, "prvek", "prvky", "prvků")}){prev.pxPerMeter ? " a měřítko" : ""}{" "}
                z verze {prev.version}
                <span className="block text-xs text-stone-500">
                  Jen když je nový výkres ve stejném výřezu — jinak prvky umístěte znovu.
                </span>
              </span>
            </label>
          )}
        </div>
      )}

      <p className="text-xs text-stone-500">
        PDF zatím neumíme — stránku výkresu uložte jako obrázek. Podklad se ukládá v tomto prohlížeči.
      </p>

      <div className="flex flex-wrap gap-2">
        <button type="submit" className="btn-primary min-h-10" disabled={processing || !prepared}>
          <IconUpload className="h-4 w-4" />
          Uložit podklad
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-ghost min-h-10">
            Zrušit
          </button>
        )}
      </div>
    </form>
  );
}
