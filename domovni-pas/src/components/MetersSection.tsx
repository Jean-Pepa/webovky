"use client";

import { useState } from "react";
import { useStore, type Meter } from "@/lib/store";
import { formatDate } from "@/lib/format";
import { IconChart, IconPlus, IconTrash } from "@/components/Icons";

export function MetersSection({ propertyId, meters }: { propertyId: string; meters: Meter[] }) {
  const { addMeter, deleteMeter, role } = useStore();
  const manage = role === "CREATOR";
  const [open, setOpen] = useState(false);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const label = String(fd.get("label") || "").trim();
    if (!label) return;
    addMeter(propertyId, {
      label,
      kind: String(fd.get("kind") || "").trim() || undefined,
      unit: String(fd.get("unit") || "").trim() || undefined,
      serial: String(fd.get("serial") || "").trim() || undefined,
    });
    e.currentTarget.reset();
    setOpen(false);
  }

  return (
    <section className="card p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <IconChart className="h-4 w-4 text-teal-700" />
          <h2 className="text-sm font-semibold text-stone-900">Odečty měřidel</h2>
          {meters.length > 0 && <span className="text-xs text-stone-400">· {meters.length}</span>}
        </div>
        {manage && (
          <button onClick={() => setOpen((o) => !o)} className="btn-ghost btn-sm text-teal-700">
            <IconPlus className="h-4 w-4" />
            Přidat měřidlo
          </button>
        )}
      </div>

      {open && manage && (
        <form onSubmit={submit} className="mt-3 grid gap-2 border-b border-stone-100 pb-4 sm:grid-cols-2">
          <input name="label" required className="input sm:col-span-2" placeholder="Popis (Studená voda — hlavní)" />
          <input name="kind" className="input" placeholder="Druh (voda / plyn / elektřina)" />
          <input name="unit" className="input" placeholder="Jednotka (m³, kWh, GJ)" />
          <input name="serial" className="input sm:col-span-2" placeholder="Výrobní číslo" />
          <button className="btn-secondary sm:col-span-2" type="submit">
            Přidat měřidlo
          </button>
        </form>
      )}

      {meters.length === 0 ? (
        !open && <p className="mt-2 text-sm text-stone-500">Zatím žádná měřidla.</p>
      ) : (
        <ul className="mt-3 space-y-3">
          {meters.map((m) => (
            <MeterCard key={m.id} propertyId={propertyId} meter={m} manage={manage} onDelete={() => deleteMeter(propertyId, m.id)} />
          ))}
        </ul>
      )}
    </section>
  );
}

function MeterCard({
  propertyId,
  meter,
  manage,
  onDelete,
}: {
  propertyId: string;
  meter: Meter;
  manage: boolean;
  onDelete: () => void;
}) {
  const { addMeterReading, deleteMeterReading } = useStore();
  const today = new Date().toISOString().slice(0, 10);
  const sorted = [...meter.readings].sort((a, b) => b.date.localeCompare(a.date));
  const latest = sorted[0];
  const prev = sorted[1];
  const delta = latest && prev ? latest.value - prev.value : undefined;

  function add(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const date = String(fd.get("date") || today);
    const value = Number(fd.get("value"));
    if (!Number.isFinite(value)) return;
    addMeterReading(propertyId, meter.id, date, value);
    e.currentTarget.reset();
  }

  return (
    <li className="rounded-xl border border-stone-200 p-3.5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-stone-900">{meter.label}</p>
          <p className="text-xs text-stone-400">
            {[meter.kind, meter.serial && `v.č. ${meter.serial}`].filter(Boolean).join(" · ") || "—"}
          </p>
        </div>
        <div className="text-right">
          {latest ? (
            <>
              <p className="text-lg font-semibold text-stone-900">
                {latest.value.toLocaleString("cs-CZ")} {meter.unit}
              </p>
              <p className="text-xs text-stone-400">
                {formatDate(latest.date)}
                {delta !== undefined && (
                  <span className="ml-1 text-teal-700">(+{delta.toLocaleString("cs-CZ")})</span>
                )}
              </p>
            </>
          ) : (
            <p className="text-sm text-stone-400">Bez odečtu</p>
          )}
        </div>
      </div>

      {sorted.length > 0 && (
        <ul className="mt-2 space-y-1 border-t border-stone-100 pt-2 text-sm">
          {sorted.slice(0, 5).map((r) => (
            <li key={r.id} className="flex items-center justify-between text-stone-600">
              <span>{formatDate(r.date)}</span>
              <span className="flex items-center gap-2">
                <span className="font-medium text-stone-800">
                  {r.value.toLocaleString("cs-CZ")} {meter.unit}
                </span>
                {manage && (
                  <button
                    onClick={() => deleteMeterReading(propertyId, meter.id, r.id)}
                    className="text-stone-300 hover:text-red-600"
                    aria-label="Smazat odečet"
                  >
                    <IconTrash className="h-3.5 w-3.5" />
                  </button>
                )}
              </span>
            </li>
          ))}
        </ul>
      )}

      {manage && (
        <div className="mt-3 flex items-center justify-between gap-2">
          <form onSubmit={add} className="flex flex-1 gap-2">
            <input name="date" type="date" defaultValue={today} className="input" />
            <input name="value" type="number" step="any" required className="input flex-1" placeholder={`Stav ${meter.unit ?? ""}`} />
            <button type="submit" className="btn-secondary btn-sm shrink-0">
              Zapsat
            </button>
          </form>
          <button
            onClick={() => {
              if (confirm("Smazat měřidlo i s odečty?")) onDelete();
            }}
            className="btn-ghost btn-sm shrink-0 text-stone-400 hover:text-red-600"
            aria-label="Smazat měřidlo"
          >
            <IconTrash className="h-4 w-4" />
          </button>
        </div>
      )}
    </li>
  );
}
