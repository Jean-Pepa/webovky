"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { fileToDataUrl } from "@/lib/media";
import { ROOM_SUGGESTIONS } from "@/lib/enums";

export function InventoryForm({ propertyId }: { propertyId: string }) {
  const { addInventoryItem } = useStore();
  const router = useRouter();
  const [pending, setPending] = useState(false);

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
    const priceRaw = String(fd.get("price") || "").replace(/\s/g, "");

    let fileName: string | undefined;
    let dataUrl: string | undefined;
    const file = fd.get("file");
    if (file instanceof File && file.size > 0) {
      fileName = file.name;
      dataUrl = await fileToDataUrl(file);
    }

    addInventoryItem(propertyId, {
      name,
      location: opt("location"),
      brand: opt("brand"),
      price: priceRaw ? Number(priceRaw) : undefined,
      warrantyUntil: opt("warrantyUntil"),
      productUrl: opt("productUrl"),
      note: opt("note"),
      fileName,
      dataUrl,
    });
    router.push(`/nemovitost/${propertyId}`);
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
        <Link href={`/nemovitost/${propertyId}`} className="btn-secondary">
          Zrušit
        </Link>
      </div>
    </form>
  );
}
