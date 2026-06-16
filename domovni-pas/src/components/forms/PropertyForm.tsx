"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useStore, type Property, type PropertyInput, type PropertyType } from "@/lib/store";
import { PROPERTY_TYPES, ENERGY_CLASSES } from "@/lib/enums";

export function PropertyForm({ initial }: { initial?: Property }) {
  const { createProperty, updateProperty } = useStore();
  const router = useRouter();
  const [pending, setPending] = useState(false);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const opt = (k: string) => {
      const v = String(fd.get(k) || "").trim();
      return v || undefined;
    };
    const name = String(fd.get("name") || "").trim();
    if (!name) return;
    const yb = opt("yearBuilt");
    const fa = opt("floorArea");

    const data: PropertyInput = {
      name,
      type: String(fd.get("type") || "HOUSE") as PropertyType,
      street: opt("street"),
      city: opt("city"),
      zip: opt("zip"),
      cadastralArea: opt("cadastralArea"),
      parcelNumber: opt("parcelNumber"),
      yearBuilt: yb ? Number(yb) : undefined,
      description: opt("description"),
      investor: opt("investor"),
      floorArea: fa ? Number(fa) : undefined,
      energyClass: opt("energyClass"),
      architect: opt("architect"),
      contractors: opt("contractors"),
    };

    setPending(true);
    if (initial) {
      updateProperty(initial.id, data);
      router.push(`/nemovitost/${initial.id}`);
    } else {
      const id = createProperty(data);
      router.push(`/nemovitost/${id}`);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div>
        <label className="label" htmlFor="name">
          Název nemovitosti *
        </label>
        <input
          id="name"
          name="name"
          required
          className="input"
          defaultValue={initial?.name ?? ""}
          placeholder="Např. Rodinný dům Říčany"
        />
      </div>

      <div>
        <label className="label" htmlFor="type">
          Typ
        </label>
        <select id="type" name="type" className="input" defaultValue={initial?.type ?? "HOUSE"}>
          {Object.entries(PROPERTY_TYPES).map(([v, l]) => (
            <option key={v} value={v}>
              {l}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="label" htmlFor="street">
            Ulice a číslo
          </label>
          <input id="street" name="street" className="input" defaultValue={initial?.street ?? ""} />
        </div>
        <div>
          <label className="label" htmlFor="zip">
            PSČ
          </label>
          <input id="zip" name="zip" className="input" defaultValue={initial?.zip ?? ""} />
        </div>
        <div>
          <label className="label" htmlFor="city">
            Obec
          </label>
          <input id="city" name="city" className="input" defaultValue={initial?.city ?? ""} />
        </div>
        <div>
          <label className="label" htmlFor="cadastralArea">
            Katastrální území
          </label>
          <input
            id="cadastralArea"
            name="cadastralArea"
            className="input"
            defaultValue={initial?.cadastralArea ?? ""}
          />
        </div>
        <div>
          <label className="label" htmlFor="parcelNumber">
            Parcela / č. popisné
          </label>
          <input
            id="parcelNumber"
            name="parcelNumber"
            className="input"
            defaultValue={initial?.parcelNumber ?? ""}
          />
        </div>
        <div>
          <label className="label" htmlFor="yearBuilt">
            Rok výstavby
          </label>
          <input
            id="yearBuilt"
            name="yearBuilt"
            type="number"
            min={1500}
            max={2100}
            className="input"
            defaultValue={initial?.yearBuilt ?? ""}
          />
        </div>
      </div>

      <div>
        <label className="label" htmlFor="description">
          Popis
        </label>
        <textarea
          id="description"
          name="description"
          className="input"
          defaultValue={initial?.description ?? ""}
          placeholder="Stručný popis nemovitosti…"
        />
      </div>

      <fieldset className="space-y-4 rounded-xl border border-stone-200 p-4">
        <legend className="px-1 text-sm font-medium text-stone-600">
          Projektová karta (volitelné)
        </legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="investor">
              Investor
            </label>
            <input
              id="investor"
              name="investor"
              className="input"
              defaultValue={initial?.investor ?? ""}
            />
          </div>
          <div>
            <label className="label" htmlFor="architect">
              Architekt
            </label>
            <input
              id="architect"
              name="architect"
              className="input"
              defaultValue={initial?.architect ?? ""}
            />
          </div>
          <div>
            <label className="label" htmlFor="floorArea">
              Plocha (m²)
            </label>
            <input
              id="floorArea"
              name="floorArea"
              type="number"
              min={0}
              className="input"
              defaultValue={initial?.floorArea ?? ""}
            />
          </div>
          <div>
            <label className="label" htmlFor="energyClass">
              Energetická třída
            </label>
            <select
              id="energyClass"
              name="energyClass"
              className="input"
              defaultValue={initial?.energyClass ?? ""}
            >
              <option value="">—</option>
              {ENERGY_CLASSES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="label" htmlFor="contractors">
            Kontakty na dodavatele
          </label>
          <textarea
            id="contractors"
            name="contractors"
            className="input"
            defaultValue={initial?.contractors ?? ""}
            placeholder="Každý dodavatel na nový řádek…"
          />
        </div>
      </fieldset>

      <div className="flex gap-3">
        <button type="submit" className="btn-primary" disabled={pending}>
          {initial ? "Uložit změny" : "Vytvořit nemovitost"}
        </button>
        <Link href={initial ? `/nemovitost/${initial.id}` : "/prehled"} className="btn-secondary">
          Zrušit
        </Link>
      </div>
    </form>
  );
}
