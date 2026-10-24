import type { HouseModel } from "@/lib/store";
import { formatScale } from "@/lib/plan";
import { IconChevronDown, IconTrash } from "@/components/Icons";
import { IconRuler, IconUpload } from "./icons";
import { formatPlanDate, type PlanGroup } from "./model-utils";

// Výběr podkladu (půdorysu): názvy podlaží, verze, stav k, zdroj, měřítko
export function UnderlayPicker({
  groups,
  current,
  editable,
  busy,
  onSelect,
  onUpload,
  onNewVersion,
  onCalibrate,
  onClearScale,
  onDelete,
}: {
  groups: PlanGroup[];
  current: HouseModel;
  editable: boolean;
  busy: boolean; // probíhá umísťování / kalibrace
  onSelect: (modelId: string) => void;
  onUpload: () => void;
  onNewVersion: (title: string) => void;
  onCalibrate: () => void;
  onClearScale: () => void;
  onDelete: (model: HouseModel) => void;
}) {
  const group = groups.find((g) => g.title === current.title);
  const isOld = !!group && group.latest.id !== current.id;

  return (
    <section className="card p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-stone-900">Podklad</h2>
        {editable && (
          <button type="button" onClick={onUpload} className="btn-ghost btn-sm min-h-10 text-teal-700">
            <IconUpload className="h-4 w-4" />
            Nahrát podklad
          </button>
        )}
      </div>

      <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Podklady">
        {groups.map((g) => {
          const active = g.title === current.title;
          return (
            <button
              key={g.title}
              type="button"
              aria-pressed={active}
              onClick={() => onSelect(g.latest.id)}
              className={`inline-flex min-h-10 max-w-full items-center gap-2 rounded-lg border px-3 py-1.5 text-left text-sm transition ${
                active
                  ? "border-teal-700 bg-teal-50 font-semibold text-teal-900"
                  : "border-stone-300 bg-white text-stone-700 hover:bg-stone-50"
              }`}
            >
              <span className="truncate">{g.title}</span>
              <span className={`shrink-0 text-xs font-normal ${active ? "text-teal-800" : "text-stone-400"}`}>
                verze {g.latest.version}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-3 border-t border-stone-100 pt-3">
        <p className="break-words text-sm text-stone-700">
          <span className="font-medium text-stone-900">
            {current.title} · verze {current.version}
          </span>
          {" · "}stav k {formatPlanDate(current.date)}
          {current.source ? ` · ${current.source}` : ""}
        </p>
        <p className="mt-0.5 text-xs text-stone-500">
          Měřítko: {formatScale(current.pxPerMeter)}
          {!current.pxPerMeter && editable ? " — nastavte ho, ať šířka pruhů odpovídá skutečné přesnosti." : ""}
        </p>

        {isOld && group && (
          <div className="mt-2 flex flex-wrap items-center gap-2 rounded-lg bg-amber-50 p-2.5 text-xs text-amber-900">
            <p className="min-w-0 flex-1">
              Prohlížíte starší verzi {current.version}. Aktuální je verze {group.latest.version}.
            </p>
            <button
              type="button"
              onClick={() => onSelect(group.latest.id)}
              className="btn-secondary btn-sm min-h-10"
            >
              Zobrazit aktuální
            </button>
          </div>
        )}

        {editable && !busy && (
          <div className="mt-2 flex flex-wrap gap-1">
            <button type="button" onClick={onCalibrate} className="btn-ghost btn-sm min-h-10 text-teal-700">
              <IconRuler className="h-4 w-4" />
              {current.pxPerMeter ? "Změnit měřítko" : "Nastavit měřítko"}
            </button>
            {current.pxPerMeter ? (
              <button type="button" onClick={onClearScale} className="btn-ghost btn-sm min-h-10 text-stone-500">
                Zrušit měřítko
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => onNewVersion(current.title)}
              className="btn-ghost btn-sm min-h-10 text-stone-600"
            >
              <IconUpload className="h-4 w-4" />
              Nová verze
            </button>
            <button
              type="button"
              onClick={() => onDelete(current)}
              className="btn-ghost btn-sm min-h-10 text-stone-500 hover:text-red-600"
            >
              <IconTrash className="h-4 w-4" />
              Smazat
            </button>
          </div>
        )}

        {group && group.older.length > 0 && (
          <details className="group mt-2">
            <summary className="flex min-h-10 cursor-pointer list-none items-center gap-1.5 text-sm font-medium text-stone-600 hover:text-stone-900 [&::-webkit-details-marker]:hidden">
              <IconChevronDown className="h-4 w-4 transition group-open:rotate-180" />
              Starší verze ({group.older.length})
            </summary>
            <ul className="mt-1 divide-y divide-stone-100">
              {[group.latest, ...group.older].map((m) => {
                const active = m.id === current.id;
                return (
                  <li key={m.id}>
                    <button
                      type="button"
                      onClick={() => onSelect(m.id)}
                      aria-current={active ? "true" : undefined}
                      className={`flex min-h-10 w-full flex-wrap items-center gap-x-2 rounded-lg px-2 py-1.5 text-left text-sm transition hover:bg-stone-50 ${
                        active ? "font-semibold text-teal-800" : "text-stone-700"
                      }`}
                    >
                      <span>verze {m.version}</span>
                      <span className="text-xs font-normal text-stone-500">
                        stav k {formatPlanDate(m.date)}
                        {m.source ? ` · ${m.source}` : ""}
                        {m.id === group.latest.id ? " · aktuální" : ""}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </details>
        )}
      </div>
    </section>
  );
}
