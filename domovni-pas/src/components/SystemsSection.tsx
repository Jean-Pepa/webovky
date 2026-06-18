"use client";

import { useState } from "react";
import Link from "next/link";
import { useStore, type HouseSystem, type HouseSystemKind, type HousePhoto } from "@/lib/store";
import { SYSTEM_KINDS, SYSTEM_KIND_ORDER, parseSpecs, specsToText } from "@/lib/systems";
import { IconPlus, IconTrash, IconPencil, IconCamera } from "@/components/Icons";

export function SystemsSection({
  propertyId,
  systems,
  photos = [],
  editable = true,
}: {
  propertyId: string;
  systems: HouseSystem[];
  photos?: HousePhoto[];
  editable?: boolean;
}) {
  const { addSystem, updateSystem, deleteSystem } = useStore();
  // null = zavřeno, "new" = nový, jinak id upravovaného
  const [mode, setMode] = useState<string | null>(null);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "").trim();
    if (!name) return;
    const data = {
      kind: (String(fd.get("kind")) as HouseSystemKind) || "other",
      name,
      installedAt: String(fd.get("installedAt") || "").trim() || undefined,
      specs: parseSpecs(String(fd.get("specs") || "")),
      note: String(fd.get("note") || "").trim() || undefined,
    };
    if (mode === "new") addSystem(propertyId, data);
    else if (mode) updateSystem(propertyId, mode, data);
    setMode(null);
  }

  const editing = mode && mode !== "new" ? systems.find((s) => s.id === mode) : undefined;

  return (
    <section>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-stone-900">Systémy domu</h2>
          <p className="text-sm text-stone-500">Solár, elektřina, voda, topení — parametry a doklady.</p>
        </div>
        {editable && mode === null && (
          <button onClick={() => setMode("new")} className="btn-primary btn-sm">
            <IconPlus className="h-4 w-4" />
            Přidat systém
          </button>
        )}
      </div>

      {editable && mode !== null && (
        <form onSubmit={submit} className="card mt-4 space-y-2 p-4">
          <div className="grid gap-2 sm:grid-cols-2">
            <select name="kind" defaultValue={editing?.kind ?? "solar"} className="input">
              {SYSTEM_KIND_ORDER.map((k) => (
                <option key={k} value={k}>
                  {SYSTEM_KINDS[k].label}
                </option>
              ))}
            </select>
            <input name="installedAt" type="month" defaultValue={editing?.installedAt} className="input" />
          </div>
          <input name="name" required defaultValue={editing?.name} className="input" placeholder="Název (např. Fotovoltaika)" />
          <textarea
            name="specs"
            defaultValue={editing ? specsToText(editing.specs) : ""}
            className="input min-h-28 font-mono text-xs"
            placeholder={`Parametry – jeden na řádek (Popisek: hodnota)\nVýkon: 8 kWp\nMěnič: SolarEdge SE8K`}
          />
          <textarea name="note" defaultValue={editing?.note} className="input min-h-16" placeholder="Poznámka (volitelné)" />
          <div className="flex gap-2">
            <button type="submit" className="btn-primary btn-sm">
              {mode === "new" ? "Přidat" : "Uložit"}
            </button>
            <button type="button" onClick={() => setMode(null)} className="btn-ghost btn-sm">
              Zrušit
            </button>
          </div>
        </form>
      )}

      {systems.length === 0 ? (
        mode === null && (
          <div className="card mt-4 px-6 py-10 text-center text-sm text-stone-500">
            Zatím žádné systémy. Přidejte solár, elektřinu, vodu nebo topení i s parametry.
          </div>
        )
      ) : (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {systems.map((s) => (
            <SystemCard
              key={s.id}
              system={s}
              photoCount={photos.filter((ph) => ph.systemId === s.id).length}
              propertyId={propertyId}
              editable={editable}
              onEdit={() => setMode(s.id)}
              onDelete={() => {
                if (confirm("Smazat systém?")) deleteSystem(propertyId, s.id);
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export function SystemCard({
  system,
  photoCount = 0,
  propertyId,
  editable = false,
  onEdit,
  onDelete,
}: {
  system: HouseSystem;
  photoCount?: number;
  propertyId: string;
  editable?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  const meta = SYSTEM_KINDS[system.kind];
  const Icon = meta.Icon;
  return (
    <div className="card flex flex-col p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${meta.accent}`}>
            <Icon className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-semibold text-stone-900">{system.name}</p>
            <p className="text-xs text-stone-400">
              {meta.label}
              {system.installedAt ? ` · ${system.installedAt}` : ""}
            </p>
          </div>
        </div>
        {editable && (
          <div className="flex shrink-0 items-center gap-1">
            <button onClick={onEdit} className="text-stone-300 hover:text-teal-700" aria-label="Upravit">
              <IconPencil className="h-4 w-4" />
            </button>
            <button onClick={onDelete} className="text-stone-300 hover:text-red-600" aria-label="Smazat">
              <IconTrash className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {system.specs.length > 0 && (
        <dl className="mt-3 space-y-1 border-t border-stone-100 pt-3 text-sm">
          {system.specs.map((sp, i) => (
            <div key={i} className="flex justify-between gap-3">
              <dt className="text-stone-400">{sp.label}</dt>
              <dd className="text-right font-medium text-stone-700">{sp.value || "—"}</dd>
            </div>
          ))}
        </dl>
      )}

      {system.note && <p className="mt-2 text-sm text-stone-600">{system.note}</p>}

      {photoCount > 0 && (
        <Link
          href={`/nemovitost/${propertyId}/fotodokumentace`}
          className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-teal-700 hover:underline"
        >
          <IconCamera className="h-4 w-4" />
          {photoCount} {photoCount === 1 ? "fotka" : photoCount < 5 ? "fotky" : "fotek"}
        </Link>
      )}
    </div>
  );
}
