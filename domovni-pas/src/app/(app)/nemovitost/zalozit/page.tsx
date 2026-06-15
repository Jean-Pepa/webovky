"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useStore,
  type DocCategory,
  type DocumentInput,
  type EntryInput,
  type EntryType,
  type PropertyType,
} from "@/lib/store";
import { fileToMedia, fileToDataUrl } from "@/lib/media";
import { toDateInputValue } from "@/lib/format";
import { PROPERTY_TYPES } from "@/lib/enums";
import { BackLink } from "@/components/BackLink";
import { IconFile, IconCamera, IconCheck, IconSparkles } from "@/components/Icons";

const EVENTS: { id: string; title: string; desc: string }[] = [
  { id: "KOUPE", title: "Koupě nemovitosti", desc: "Zakládám pas k nově koupenému domu či bytu." },
  { id: "REKONSTRUKCE", title: "Rekonstrukce", desc: "Chci evidovat průběh a náklady přestavby." },
  { id: "POJISTNA", title: "Pojistná událost", desc: "Dokumentuji škodu a opravy." },
  { id: "PRODEJ", title: "Příprava na prodej", desc: "Chci doložit historii a péči kupujícímu." },
  { id: "HISTORIE", title: "Jen si vedu historii", desc: "Bez konkrétní události." },
];

const EVENT_ENTRY: Record<string, { type: EntryType; title: string } | null> = {
  KOUPE: { type: "PURCHASE", title: "Koupě nemovitosti" },
  REKONSTRUKCE: { type: "RENOVATION", title: "Zahájení rekonstrukce" },
  POJISTNA: { type: "INSURANCE", title: "Pojistná událost" },
  PRODEJ: { type: "OTHER", title: "Příprava na prodej" },
  HISTORIE: null,
};

const DOC_SLOTS: { key: string; category: DocCategory; title: string; desc: string }[] = [
  { key: "kupni", category: "CONTRACT", title: "Kupní smlouva", desc: "Smlouva o převodu nemovitosti" },
  { key: "penb", category: "ENERGY_LABEL", title: "Energetický štítek (PENB)", desc: "Průkaz energetické náročnosti" },
  { key: "projekt", category: "PLAN", title: "Projektová dokumentace", desc: "Půdorysy, plány, výkresy" },
  { key: "revize", category: "CERTIFICATE", title: "Revizní zprávy", desc: "Elektro, plyn, komín…" },
];

const STEPS = ["Událost", "Nemovitost", "Dokumenty", "Fotky převzetí"];

export default function WizardPage() {
  const { createPropertyFull } = useStore();
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [event, setEvent] = useState("KOUPE");
  const [name, setName] = useState("");
  const [type, setType] = useState<PropertyType>("HOUSE");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [yearBuilt, setYearBuilt] = useState("");
  const [docFiles, setDocFiles] = useState<Record<string, File | null>>({});
  const [photos, setPhotos] = useState<File[]>([]);

  const canNext = step !== 1 || name.trim().length > 0;

  async function finish() {
    setSaving(true);

    const documents: DocumentInput[] = [];
    for (const slot of DOC_SLOTS) {
      const file = docFiles[slot.key];
      if (file) {
        const dataUrl = await fileToDataUrl(file);
        documents.push({ title: slot.title, category: slot.category, fileName: file.name, dataUrl });
      }
    }

    const entries: EntryInput[] = [];
    const today = toDateInputValue(new Date());
    const ev = EVENT_ENTRY[event];
    if (ev) entries.push({ type: ev.type, title: ev.title, date: today, media: [] });
    if (photos.length) {
      const media = [];
      for (const f of photos) media.push(await fileToMedia(f));
      entries.push({ type: "HANDOVER", title: "Stav při převzetí", date: today, media });
    }

    const id = createPropertyFull(
      {
        name: name.trim(),
        type,
        street: street.trim() || undefined,
        city: city.trim() || undefined,
        zip: zip.trim() || undefined,
        yearBuilt: yearBuilt ? Number(yearBuilt) : undefined,
      },
      entries,
      documents,
    );
    router.push(`/nemovitost/${id}`);
  }

  return (
    <div className="mx-auto max-w-2xl">
      <BackLink href="/prehled">Zpět na přehled</BackLink>

      <div className="mt-4 flex items-center gap-2">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-teal-50 text-teal-700">
          <IconSparkles className="h-5 w-5" />
        </span>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-stone-900">Založit pas</h1>
          <p className="text-sm text-stone-500">Pár kroků a máte historii nemovitosti na jednom místě.</p>
        </div>
      </div>

      {/* Stepper */}
      <div className="mt-6 flex items-center gap-2">
        {STEPS.map((label, i) => (
          <div key={label} className="flex flex-1 items-center gap-2">
            <div
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-medium ${
                i < step
                  ? "bg-teal-700 text-white"
                  : i === step
                    ? "bg-teal-700 text-white"
                    : "bg-stone-200 text-stone-500"
              }`}
            >
              {i < step ? <IconCheck className="h-4 w-4" /> : i + 1}
            </div>
            <span className={`hidden text-xs sm:block ${i === step ? "text-stone-800" : "text-stone-400"}`}>
              {label}
            </span>
            {i < STEPS.length - 1 && <div className="h-px flex-1 bg-stone-200" />}
          </div>
        ))}
      </div>

      <div className="card mt-6 p-6">
        {step === 0 && (
          <div className="space-y-3">
            <p className="text-sm text-stone-500">Co tě sem přivádí? Podle toho ti napovíme, co nahrát.</p>
            {EVENTS.map((e) => (
              <label
                key={e.id}
                className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition ${
                  event === e.id ? "border-teal-600 bg-teal-50/50" : "border-stone-300 hover:bg-stone-50"
                }`}
              >
                <input
                  type="radio"
                  name="event"
                  value={e.id}
                  checked={event === e.id}
                  onChange={() => setEvent(e.id)}
                  className="mt-1"
                />
                <span>
                  <span className="block font-medium text-stone-800">{e.title}</span>
                  <span className="text-sm text-stone-500">{e.desc}</span>
                </span>
              </label>
            ))}
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5">
            <div>
              <label className="label" htmlFor="name">
                Název nemovitosti *
              </label>
              <input
                id="name"
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Např. Byt Karlín 3+kk"
                autoFocus
              />
            </div>
            <div>
              <label className="label" htmlFor="type">
                Typ
              </label>
              <select
                id="type"
                className="input"
                value={type}
                onChange={(e) => setType(e.target.value as PropertyType)}
              >
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
                <input id="street" className="input" value={street} onChange={(e) => setStreet(e.target.value)} />
              </div>
              <div>
                <label className="label" htmlFor="zip">
                  PSČ
                </label>
                <input id="zip" className="input" value={zip} onChange={(e) => setZip(e.target.value)} />
              </div>
              <div>
                <label className="label" htmlFor="city">
                  Obec
                </label>
                <input id="city" className="input" value={city} onChange={(e) => setCity(e.target.value)} />
              </div>
              <div>
                <label className="label" htmlFor="yearBuilt">
                  Rok výstavby
                </label>
                <input
                  id="yearBuilt"
                  type="number"
                  className="input"
                  value={yearBuilt}
                  onChange={(e) => setYearBuilt(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            <p className="text-sm text-stone-500">
              Nahrajte klíčové dokumenty od koupě. Vše je volitelné — můžete doplnit i později.
            </p>
            {DOC_SLOTS.map((slot) => (
              <FileSlot
                key={slot.key}
                title={slot.title}
                desc={slot.desc}
                file={docFiles[slot.key] ?? null}
                onChange={(f) => setDocFiles((prev) => ({ ...prev, [slot.key]: f }))}
              />
            ))}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <p className="text-sm text-stone-500">
              Vyfoťte stav nemovitosti při převzetí — důkaz stavu v čase, který oceníte při reklamaci i prodeji.
            </p>
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-stone-300 p-8 text-center hover:bg-stone-50">
              <IconCamera className="h-8 w-8 text-stone-400" />
              <span className="text-sm font-medium text-stone-700">Vyberte fotky</span>
              <span className="text-xs text-stone-400">
                {photos.length > 0 ? `Vybráno: ${photos.length} fotek` : "JPG / PNG, klidně víc najednou"}
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => setPhotos(Array.from(e.target.files ?? []))}
              />
            </label>
          </div>
        )}

        {/* Navigace */}
        <div className="mt-6 flex items-center justify-between gap-3 border-t border-stone-100 pt-5">
          {step > 0 ? (
            <button className="btn-ghost" onClick={() => setStep((s) => s - 1)} disabled={saving}>
              Zpět
            </button>
          ) : (
            <span />
          )}

          {step < STEPS.length - 1 ? (
            <button className="btn-primary" onClick={() => setStep((s) => s + 1)} disabled={!canNext}>
              Pokračovat
            </button>
          ) : (
            <button className="btn-primary" onClick={finish} disabled={saving}>
              <IconCheck className="h-4 w-4" />
              {saving ? "Zakládám…" : "Vytvořit pas"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function FileSlot({
  title,
  desc,
  file,
  onChange,
}: {
  title: string;
  desc: string;
  file: File | null;
  onChange: (f: File | null) => void;
}) {
  return (
    <label
      className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 transition ${
        file ? "border-teal-600 bg-teal-50/50" : "border-stone-300 hover:bg-stone-50"
      }`}
    >
      <span
        className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ${
          file ? "bg-teal-100 text-teal-700" : "bg-stone-100 text-stone-400"
        }`}
      >
        {file ? <IconCheck className="h-5 w-5" /> : <IconFile className="h-5 w-5" />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-medium text-stone-800">{title}</span>
        <span className="block truncate text-sm text-stone-500">{file ? file.name : desc}</span>
      </span>
      <span className="shrink-0 text-xs font-medium text-teal-700">{file ? "Změnit" : "Nahrát"}</span>
      <input
        type="file"
        className="hidden"
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
      />
    </label>
  );
}
