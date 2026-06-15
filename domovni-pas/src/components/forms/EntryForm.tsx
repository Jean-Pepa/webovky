"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useStore, type EntryType, type Media } from "@/lib/store";
import { fileToMedia } from "@/lib/media";
import { ENTRY_TYPES } from "@/lib/enums";
import { toDateInputValue } from "@/lib/format";

export function EntryForm({ propertyId }: { propertyId: string }) {
  const { addEntry } = useStore();
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const title = String(fd.get("title") || "").trim();
    if (!title) return;

    setPending(true);
    const files = fd.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);
    const media: Media[] = [];
    for (const f of files) media.push(await fileToMedia(f));

    const costRaw = String(fd.get("cost") || "").replace(/\s/g, "");
    const desc = String(fd.get("description") || "").trim();

    addEntry(propertyId, {
      type: String(fd.get("type") || "OTHER") as EntryType,
      title,
      description: desc || undefined,
      date: String(fd.get("date") || toDateInputValue(new Date())),
      cost: costRaw ? Number(costRaw) : undefined,
      media,
    });
    router.push(`/nemovitost/${propertyId}`);
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="type">
            Typ záznamu
          </label>
          <select id="type" name="type" className="input" defaultValue="REPAIR">
            {Object.entries(ENTRY_TYPES).map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="date">
            Datum
          </label>
          <input
            id="date"
            name="date"
            type="date"
            className="input"
            defaultValue={toDateInputValue(new Date())}
          />
        </div>
      </div>

      <div>
        <label className="label" htmlFor="title">
          Název *
        </label>
        <input
          id="title"
          name="title"
          required
          className="input"
          placeholder="Např. Výměna plynového kotle"
        />
      </div>

      <div>
        <label className="label" htmlFor="description">
          Popis
        </label>
        <textarea
          id="description"
          name="description"
          className="input"
          placeholder="Co se dělo, kdo to prováděl…"
        />
      </div>

      <div>
        <label className="label" htmlFor="cost">
          Náklad (Kč)
        </label>
        <input id="cost" name="cost" type="number" min={0} className="input" placeholder="volitelné" />
      </div>

      <div>
        <label className="label" htmlFor="files">
          Fotky a přílohy
        </label>
        <input
          id="files"
          name="files"
          type="file"
          multiple
          accept="image/*"
          className="block w-full text-sm text-stone-600 file:mr-4 file:rounded-lg file:border-0 file:bg-teal-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-teal-700 hover:file:bg-teal-100"
        />
        <p className="mt-1.5 text-xs text-stone-400">
          Obrázky se v ukázce ukládají přímo v prohlížeči (zmenšené).
        </p>
      </div>

      <div className="flex gap-3">
        <button type="submit" className="btn-primary" disabled={pending}>
          {pending ? "Ukládám…" : "Uložit záznam"}
        </button>
        <Link href={`/nemovitost/${propertyId}`} className="btn-secondary">
          Zrušit
        </Link>
      </div>
    </form>
  );
}
