"use client";

import { useRef, useState } from "react";
import { useStore, type HouseSystem } from "@/lib/store";
import { SYSTEM_KINDS, systemUnit } from "@/lib/systems";
import { fileToDataUrl } from "@/lib/media";
import { formatDate } from "@/lib/format";
import { IconCamera, IconPlus, IconTrash } from "@/components/Icons";

const today = () => new Date().toISOString().slice(0, 10);

export function ReadingsSection({
  propertyId,
  systems,
  canAdd = true,
}: {
  propertyId: string;
  systems: HouseSystem[];
  canAdd?: boolean;
}) {
  if (systems.length === 0) {
    return (
      <div className="card px-6 py-10 text-center text-sm text-stone-500">
        Zatím žádné systémy. Nejdřív přidejte solár, elektřinu, vodu nebo plyn v sekci{" "}
        <span className="font-medium">Systémy domu</span>, pak tu budete zapisovat odečty.
      </div>
    );
  }
  return (
    <div className="space-y-3">
      <p className="text-sm text-stone-500">
        Jednou za období oběhněte měřidla a vyfoťte je — AI z fotky přečte stav a spotřeba se
        dopočítá sama.
      </p>
      {systems.map((s) => (
        <ReadingCard key={s.id} propertyId={propertyId} system={s} canAdd={canAdd} />
      ))}
    </div>
  );
}

function ReadingCard({
  propertyId,
  system,
  canAdd,
}: {
  propertyId: string;
  system: HouseSystem;
  canAdd: boolean;
}) {
  const { addReading, deleteReading } = useStore();
  const meta = SYSTEM_KINDS[system.kind];
  const Icon = meta.Icon;
  const unit = systemUnit(system.kind);
  const fileRef = useRef<HTMLInputElement>(null);

  const readings = [...(system.readings ?? [])].sort((a, b) => a.date.localeCompare(b.date));
  const last = readings.at(-1);
  const prev = readings.at(-2);
  const delta = last && prev ? last.value - prev.value : undefined;

  const [adding, setAdding] = useState(false);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [value, setValue] = useState("");
  const [date, setDate] = useState(today());
  const [source, setSource] = useState<"photo" | "manual">("manual");

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setBusy(true);
    setNote(null);
    setSource("photo");
    try {
      const dataUrl = await fileToDataUrl(file);
      const res = await fetch("/api/ocr-reading", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: dataUrl }),
      });
      if (res.status === 503) {
        setNote("AI čtení není zapnuté (chybí klíč) — zadejte stav ručně.");
        setValue("");
      } else if (res.ok) {
        const d = (await res.json()) as { value: number | null };
        if (d.value != null) {
          setValue(String(d.value));
          setNote("Přečteno z fotky — zkontrolujte a uložte.");
        } else {
          setValue("");
          setNote("Fotku se nepodařilo přečíst — zadejte stav ručně.");
        }
      } else {
        setValue("");
        setNote("Čtení selhalo — zadejte stav ručně.");
      }
    } catch {
      setValue("");
      setNote("Čtení selhalo — zadejte stav ručně.");
    }
    setDate(today());
    setAdding(true);
    setBusy(false);
  }

  function save() {
    const v = Number(value.replace(",", "."));
    if (!Number.isFinite(v)) return;
    addReading(propertyId, system.id, { date, value: v, source });
    setAdding(false);
    setValue("");
    setNote(null);
  }

  return (
    <section className="card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${meta.accent}`}>
            <Icon className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-semibold text-stone-900">{system.name}</p>
            {last ? (
              <p className="text-xs text-stone-400">
                Stav {last.value.toLocaleString("cs-CZ")} {unit} · {formatDate(last.date)}
                {delta !== undefined && (
                  <span className="ml-1 font-medium text-teal-700">
                    (spotřeba {delta.toLocaleString("cs-CZ")} {unit})
                  </span>
                )}
              </p>
            ) : (
              <p className="text-xs text-stone-400">Zatím bez odečtu</p>
            )}
          </div>
        </div>
        {canAdd && !adding && (
          <div className="flex shrink-0 items-center gap-1.5">
            <button
              onClick={() => fileRef.current?.click()}
              disabled={busy}
              className="btn-primary btn-sm disabled:opacity-50"
            >
              <IconCamera className="h-4 w-4" />
              {busy ? "Čtu…" : "Z fotky"}
            </button>
            <button
              onClick={() => {
                setSource("manual");
                setValue("");
                setNote(null);
                setDate(today());
                setAdding(true);
              }}
              className="btn-ghost btn-sm text-stone-500"
            >
              Ručně
            </button>
            <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={onFile} />
          </div>
        )}
      </div>

      {adding && (
        <div className="mt-3 space-y-2 border-t border-stone-100 pt-3">
          {note && <p className="text-xs text-stone-500">{note}</p>}
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="number"
              step="any"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={`Stav ${unit}`}
              className="input w-32"
              autoFocus
            />
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input w-40" />
            <button onClick={save} disabled={!value.trim()} className="btn-primary btn-sm disabled:opacity-50">
              Uložit odečet
            </button>
            <button onClick={() => setAdding(false)} className="btn-ghost btn-sm">
              Zrušit
            </button>
          </div>
        </div>
      )}

      {readings.length > 0 && (
        <ul className="mt-3 space-y-1 border-t border-stone-100 pt-3 text-sm">
          {[...readings]
            .reverse()
            .slice(0, 5)
            .map((r, i, arr) => {
              const before = arr[i + 1];
              const d = before ? r.value - before.value : undefined;
              return (
                <li key={r.id} className="flex items-center justify-between text-stone-600">
                  <span>{formatDate(r.date)}</span>
                  <span className="flex items-center gap-2">
                    <span className="font-medium text-stone-800">
                      {r.value.toLocaleString("cs-CZ")} {unit}
                    </span>
                    {d !== undefined && <span className="text-xs text-teal-700">+{d.toLocaleString("cs-CZ")}</span>}
                    {r.source === "photo" && <IconCamera className="h-3.5 w-3.5 text-stone-300" />}
                    {canAdd && (
                      <button
                        onClick={() => deleteReading(propertyId, system.id, r.id)}
                        className="text-stone-300 hover:text-red-600"
                        aria-label="Smazat odečet"
                      >
                        <IconTrash className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </span>
                </li>
              );
            })}
        </ul>
      )}
    </section>
  );
}
