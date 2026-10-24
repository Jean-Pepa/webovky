"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useStore, type ElementCategory } from "@/lib/store";
import { fileToDataUrl } from "@/lib/media";
import { ROOM_SUGGESTIONS } from "@/lib/enums";
import { ELEMENT_CATEGORIES, ELEMENT_CATEGORY_ORDER } from "@/lib/elements";
import { elementHref, sortElements } from "@/components/elements/element-utils";

const NEW_ELEMENT = "__novy__";

export function InventoryForm({
  propertyId,
  initialElementId,
}: {
  propertyId: string;
  initialElementId?: string; // přidání vybavení z prvku (?prvek=)
}) {
  const { addInventoryItem, addElement, getProperty } = useStore();
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const elements = sortElements(getProperty(propertyId)?.elements ?? []);
  const fromElement =
    initialElementId && elements.some((e) => e.id === initialElementId) ? initialElementId : undefined;
  const [elementChoice, setElementChoice] = useState(fromElement ?? "");
  const [newCategory, setNewCategory] = useState<ElementCategory>("ZARIZENI");
  const backHref = fromElement ? elementHref(propertyId, fromElement) : `/nemovitost/${propertyId}`;

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "").trim();
    if (!name) return;
    setPending(true);

    const opt = (k: string) => {
      const v = String(fd.get(k) || "").trim();
      return v || undefined;
    };
    const priceRaw = String(fd.get("price") || "").replace(/\s/g, "").replace(",", ".");
    const price = priceRaw ? Number(priceRaw) : NaN;

    let fileName: string | undefined;
    let dataUrl: string | undefined;
    const file = fd.get("file");
    if (file instanceof File && file.size > 0) {
      fileName = file.name;
      dataUrl = await fileToDataUrl(file);
    }

    // Prvek domu: existující, nebo nový vytvořený z této položky
    let elementId: string | undefined;
    if (elementChoice === NEW_ELEMENT) {
      elementId = addElement(propertyId, {
        name,
        category: newCategory,
        room: opt("location"),
        source: "ZADAL_UZIVATEL",
        condition: "UNKNOWN",
      });
    } else if (elementChoice && elements.some((el) => el.id === elementChoice)) {
      elementId = elementChoice;
    }

    addInventoryItem(propertyId, {
      name,
      location: opt("location"),
      brand: opt("brand"),
      price: Number.isFinite(price) ? price : undefined,
      warrantyUntil: opt("warrantyUntil"),
      productUrl: opt("productUrl"),
      note: opt("note"),
      fileName,
      dataUrl,
      elementId,
    });
    // nový prvek rovnou otevřít (ať ho jde zakreslit do modelu), jinak zpět, odkud uživatel přišel
    router.push(elementId && elementChoice === NEW_ELEMENT ? elementHref(propertyId, elementId) : backHref);
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div>
        <label className="label" htmlFor="name">
          Co to je *
        </label>
        <input id="name" name="name" required className="input" placeholder="Např. Baterie Grohe" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="location">
            Místnost / umístění
          </label>
          <input
            id="location"
            name="location"
            list="rooms"
            className="input"
            placeholder="Např. Koupelna"
          />
          <datalist id="rooms">
            {ROOM_SUGGESTIONS.map((r) => (
              <option key={r} value={r} />
            ))}
          </datalist>
        </div>
        <div>
          <label className="label" htmlFor="brand">
            Značka / model
          </label>
          <input id="brand" name="brand" className="input" placeholder="Např. Grohe Eurosmart" />
        </div>
        <div>
          <label className="label" htmlFor="price">
            Cena (Kč)
          </label>
          <input id="price" name="price" type="number" min={0} className="input" placeholder="volitelné" />
        </div>
        <div>
          <label className="label" htmlFor="warrantyUntil">
            Záruka do
          </label>
          <input id="warrantyUntil" name="warrantyUntil" type="date" className="input" />
        </div>
      </div>

      <div>
        <label className="label" htmlFor="element">
          Prvek domu
        </label>
        <select
          id="element"
          className="input"
          value={elementChoice}
          onChange={(e) => setElementChoice(e.target.value)}
        >
          <option value="">— bez prvku —</option>
          {ELEMENT_CATEGORY_ORDER.map((cat) => {
            const group = elements.filter((el) => el.category === cat);
            if (group.length === 0) return null;
            return (
              <optgroup key={cat} label={ELEMENT_CATEGORIES[cat]}>
                {group.map((el) => (
                  <option key={el.id} value={el.id}>
                    {el.name}
                    {el.room ? ` · ${el.room}` : ""}
                  </option>
                ))}
              </optgroup>
            );
          })}
          <option value={NEW_ELEMENT}>+ Vytvořit nový prvek z této položky</option>
        </select>
        {elementChoice === NEW_ELEMENT ? (
          <div className="mt-3 rounded-xl bg-stone-50 p-3">
            <label className="label" htmlFor="newCategory">
              Vrstva nového prvku
            </label>
            <select
              id="newCategory"
              className="input"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value as ElementCategory)}
            >
              {ELEMENT_CATEGORY_ORDER.map((c) => (
                <option key={c} value={c}>
                  {ELEMENT_CATEGORIES[c]}
                </option>
              ))}
            </select>
            <p className="mt-1.5 text-xs text-stone-500">
              Prvek dostane název a místnost z této položky. Polohu zatím neznáme — zakreslíte ji
              později v modelu domu.
            </p>
          </div>
        ) : (
          <p className="mt-1.5 text-xs text-stone-400">
            Záruka a doklad pak budou vidět u prvku (např. záruka ke kotli).
          </p>
        )}
      </div>

      <div>
        <label className="label" htmlFor="productUrl">
          Odkaz na produkt
        </label>
        <input
          id="productUrl"
          name="productUrl"
          type="url"
          className="input"
          placeholder="https://…"
        />
      </div>

      <div>
        <label className="label" htmlFor="note">
          Poznámka
        </label>
        <textarea id="note" name="note" className="input" placeholder="Např. servis 2025, montáž 2024…" />
      </div>

      <div>
        <label className="label" htmlFor="file">
          Doklad (faktura / záruční list)
        </label>
        <input
          id="file"
          name="file"
          type="file"
          className="block w-full text-sm text-stone-600 file:mr-4 file:rounded-lg file:border-0 file:bg-teal-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-teal-700 hover:file:bg-teal-100"
        />
      </div>

      <div className="flex gap-3">
        <button type="submit" className="btn-primary" disabled={pending}>
          {pending ? "Ukládám…" : "Přidat do vybavení"}
        </button>
        <Link href={backHref} className="btn-secondary">
          Zrušit
        </Link>
      </div>
    </form>
  );
}
