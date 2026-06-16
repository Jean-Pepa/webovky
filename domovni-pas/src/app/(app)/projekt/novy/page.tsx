"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useStore,
  type DocCategory,
  type DocumentInput,
  type EntryInput,
  type Media,
} from "@/lib/store";
import { fileToMedia, fileToDataUrl } from "@/lib/media";
import { toDateInputValue } from "@/lib/format";
import { ENERGY_CLASSES } from "@/lib/enums";
import { BackLink } from "@/components/BackLink";
import { IconFile, IconCamera, IconCheck, IconBuilding } from "@/components/Icons";

const DOC_SLOTS: { key: string; category: DocCategory; title: string; desc: string }[] = [
  { key: "dsp", category: "PLAN", title: "Projektová dokumentace (DSP)", desc: "Dokumentace pro stavební povolení" },
  { key: "tz", category: "CERTIFICATE", title: "Technická zpráva", desc: "Popis konstrukcí a řešení" },
  { key: "situace", category: "PLAN", title: "Situace", desc: "Situační výkres" },
  { key: "penb", category: "ENERGY_LABEL", title: "Energetický štítek (PENB)", desc: "Průkaz energetické náročnosti" },
];

const STEPS = ["Projektová karta", "Dokumentace", "Fotky", "Dodavatelé"];

export default function ProjectHandoverPage() {
  const { createPropertyFull } = useStore();
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [investor, setInvestor] = useState("");
  const [floorArea, setFloorArea] = useState("");
  const [energyClass, setEnergyClass] = useState("");
  const [architect, setArchitect] = useState("");
  const [contractors, setContractors] = useState("");
  const [docFiles, setDocFiles] = useState<Record<string, File | null>>({});
  const [photos, setPhotos] = useState<File[]>([]);

  const canNext = step !== 0 || name.trim().length > 0;

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
    entries.push({ type: "OTHER", title: "Předání projektu architektem", date: today, media: [] });
    if (photos.length) {
      const media: Media[] = [];
      for (const f of photos) media.push(await fileToMedia(f));
      entries.push({ type: "HANDOVER", title: "Stav po dokončení", date: today, media });
    }

    const id = createPropertyFull(
      {
        name: name.trim(),
        type: "HOUSE",
        street: street.trim() || undefined,
        city: city.trim() || undefined,
        zip: zip.trim() || undefined,
        investor: investor.trim() || undefined,
        floorArea: floorArea ? Number(floorArea) : undefined,
        energyClass: energyClass || undefined,
        architect: architect.trim() || undefined,
        contractors: contractors.trim() || undefined,
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
          <IconBuilding className="h-5 w-5" />
        </span>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-stone-900">Předat projekt</h1>
          <p className="text-sm text-stone-500">
            Profesionální předání projektu klientovi — místo PDF, ZIP a WeTransferu.
          </p>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-2">
        {STEPS.map((label, i) => (
          <div key={label} className="flex flex-1 items-center gap-2">
            <div
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-medium ${
                i <= step ? "bg-teal-700 text-white" : "bg-stone-200 text-stone-500"
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
          <div className="space-y-5">
            <p className="rounded-lg bg-teal-50 px-3 py-2 text-xs text-teal-900">
              V ostré verzi se BULO pokusí kartu vyplnit automaticky z nahrané dokumentace. Teď ji
              vyplňte ručně.
            </p>
            <div>
              <label className="label" htmlFor="name">
                Název projektu *
              </label>
              <input
                id="name"
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Např. Rodinný dům Beroun"
                autoFocus
              />
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
                <label className="label" htmlFor="investor">
                  Investor
                </label>
                <input id="investor" className="input" value={investor} onChange={(e) => setInvestor(e.target.value)} />
              </div>
              <div>
                <label className="label" htmlFor="architect">
                  Architekt
                </label>
                <input id="architect" className="input" value={architect} onChange={(e) => setArchitect(e.target.value)} />
              </div>
              <div>
                <label className="label" htmlFor="floorArea">
                  Plocha (m²)
                </label>
                <input
                  id="floorArea"
                  type="number"
                  className="input"
                  value={floorArea}
                  onChange={(e) => setFloorArea(e.target.value)}
                />
              </div>
              <div>
                <label className="label" htmlFor="energyClass">
                  Energetická třída
                </label>
                <select
                  id="energyClass"
                  className="input"
                  value={energyClass}
                  onChange={(e) => setEnergyClass(e.target.value)}
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
          </div>
        )}

        {step === 1 && (
          <div className="space-y-3">
            <p className="text-sm text-stone-500">
              Nahrajte dokumentaci k projektu. Vše je volitelné — doplníte i později.
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

        {step === 2 && (
          <div className="space-y-4">
            <p className="text-sm text-stone-500">Fotky z realizace / po dokončení stavby.</p>
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

        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label className="label" htmlFor="contractors">
                Kontakty na dodavatele
              </label>
              <textarea
                id="contractors"
                className="input min-h-32"
                value={contractors}
                onChange={(e) => setContractors(e.target.value)}
                placeholder={"Stavební firma: …\nElektro: …\nVoda a topení: …"}
              />
              <p className="mt-1.5 text-xs text-stone-400">Každý dodavatel na nový řádek.</p>
            </div>
            <div className="rounded-lg bg-teal-50 p-4 text-sm text-teal-900">
              Po vytvoření projekt jedním klikem <strong>předáte klientovi</strong> (tlačítko Převést
              v detailu) — i s dokumentací, fotkami a projektovou kartou.
            </div>
          </div>
        )}

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
              {saving ? "Vytvářím…" : "Vytvořit projekt"}
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
      <input type="file" className="hidden" onChange={(e) => onChange(e.target.files?.[0] ?? null)} />
    </label>
  );
}
