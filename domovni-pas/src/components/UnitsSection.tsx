"use client";

import { useState } from "react";
import { useStore, type Unit } from "@/lib/store";
import { IconKey, IconPlus, IconTrash } from "@/components/Icons";

export function UnitsSection({ propertyId, units }: { propertyId: string; units: Unit[] }) {
  const { addUnit, deleteUnit } = useStore();
  const [open, setOpen] = useState(false);

  const totalArea = units.reduce((s, u) => s + (u.area ?? 0), 0);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const label = String(fd.get("label") || "").trim();
    const ownerName = String(fd.get("ownerName") || "").trim();
    if (!label || !ownerName) return;
    const area = Number(fd.get("area"));
    addUnit(propertyId, {
      label,
      ownerName,
      floor: String(fd.get("floor") || "").trim() || undefined,
      area: Number.isFinite(area) && area > 0 ? area : undefined,
      share: String(fd.get("share") || "").trim() || undefined,
      contact: String(fd.get("contact") || "").trim() || undefined,
    });
    e.currentTarget.reset();
    setOpen(false);
  }

  return (
    <section className="card p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <IconKey className="h-4 w-4 text-teal-700" />
          <h2 className="text-sm font-semibold text-stone-900">Vlastníci a jednotky</h2>
          {units.length > 0 && <span className="text-xs text-stone-400">· {units.length}</span>}
        </div>
        <button onClick={() => setOpen((o) => !o)} className="btn-ghost btn-sm text-teal-700">
          <IconPlus className="h-4 w-4" />
          Přidat
        </button>
      </div>

      {open && (
        <form onSubmit={submit} className="mt-3 grid gap-2 border-b border-stone-100 pb-4 sm:grid-cols-2">
          <input name="label" required className="input" placeholder="Č. jednotky (např. 12/3)" />
          <input name="ownerName" required className="input" placeholder="Vlastník" />
          <input name="floor" className="input" placeholder="Patro" />
          <input name="area" type="number" min="0" step="0.1" className="input" placeholder="Plocha m²" />
          <input name="share" className="input" placeholder="Podíl (např. 754/10000)" />
          <input name="contact" className="input" placeholder="Kontakt (e-mail / telefon)" />
          <button className="btn-secondary sm:col-span-2" type="submit">
            Přidat jednotku
          </button>
        </form>
      )}

      {units.length === 0 ? (
        !open && (
          <p className="mt-2 text-sm text-stone-500">
            Zatím žádné jednotky. Přidejte evidenci vlastníků a jejich podílů.
          </p>
        )
      ) : (
        <>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-100 text-left text-xs text-stone-400">
                  <th className="py-2 pr-3 font-medium">Jednotka</th>
                  <th className="py-2 pr-3 font-medium">Vlastník</th>
                  <th className="hidden py-2 pr-3 font-medium sm:table-cell">Patro</th>
                  <th className="py-2 pr-3 text-right font-medium">m²</th>
                  <th className="hidden py-2 pr-3 font-medium sm:table-cell">Podíl</th>
                  <th className="py-2" />
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {units.map((u) => (
                  <tr key={u.id}>
                    <td className="py-2 pr-3 font-medium text-stone-800">{u.label}</td>
                    <td className="py-2 pr-3 text-stone-700">
                      {u.ownerName}
                      {u.contact && <span className="block text-xs text-stone-400">{u.contact}</span>}
                    </td>
                    <td className="hidden py-2 pr-3 text-stone-500 sm:table-cell">{u.floor ?? "—"}</td>
                    <td className="py-2 pr-3 text-right text-stone-700">{u.area ?? "—"}</td>
                    <td className="hidden py-2 pr-3 text-stone-500 sm:table-cell">{u.share ?? "—"}</td>
                    <td className="py-2 text-right">
                      <button
                        onClick={() => {
                          if (confirm("Smazat jednotku?")) deleteUnit(propertyId, u.id);
                        }}
                        className="text-stone-300 hover:text-red-600"
                        aria-label="Smazat"
                      >
                        <IconTrash className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-stone-400">
            Celkem {units.length} jednotek{totalArea > 0 ? ` · ${totalArea} m²` : ""}
          </p>
        </>
      )}
    </section>
  );
}
