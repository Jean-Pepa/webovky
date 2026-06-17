"use client";

import Link from "next/link";
import { useState } from "react";
import { useParams } from "next/navigation";
import { useStore, type EntryType, type Media } from "@/lib/store";
import { Logo } from "@/components/Logo";
import { fileToMedia } from "@/lib/media";
import { toDateInputValue, formatDate } from "@/lib/format";
import { IconCamera, IconCheck, IconShield, IconWrench } from "@/components/Icons";

const ACTIONS: { label: string; type: EntryType }[] = [
  { label: "Oprava", type: "REPAIR" },
  { label: "Výměna", type: "REPAIR" },
  { label: "Revize", type: "INSPECTION" },
  { label: "Montáž", type: "RENOVATION" },
  { label: "Výroba", type: "RENOVATION" },
  { label: "Údržba", type: "OTHER" },
];

export default function QrLandingPage() {
  const { id } = useParams<{ id: string }>();
  const { getProperty, addEntry } = useStore();
  const [mode, setMode] = useState<"home" | "form" | "done">("home");
  const [selected, setSelected] = useState<string[]>([]);
  const [desc, setDesc] = useState("");
  const [company, setCompany] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);

  const property = getProperty(id);

  function toggle(label: string) {
    setSelected((s) => (s.includes(label) ? s.filter((x) => x !== label) : [...s, label]));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (selected.length === 0 && !desc.trim()) return;
    setBusy(true);
    const media: Media[] = [];
    for (const f of files) media.push(await fileToMedia(f));
    const primary = ACTIONS.find((a) => a.label === selected[0]);
    const type: EntryType = primary?.type ?? "OTHER";
    const title = `Servis: ${selected.join(", ") || "práce"}`;
    const description =
      [desc.trim(), company.trim() ? `Provedl: ${company.trim()}` : null].filter(Boolean).join("\n") ||
      undefined;
    addEntry(id, { type, title, description, date: toDateInputValue(new Date()), media });
    setBusy(false);
    setMode("done");
  }

  return (
    <div className="min-h-screen bg-paper">
      <div className="h-1.5 w-full bg-brass" />
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-md items-center px-5 py-4">
          <Logo />
        </div>
      </header>

      <main className="mx-auto max-w-md px-5 py-8">
        {mode === "home" && (
          <>
            <h1 className="text-xl font-semibold text-stone-900">Pas nemovitosti</h1>
            {property && <p className="mt-1 text-stone-500">{property.name}</p>}

            <button
              onClick={() => setMode("form")}
              className="btn-primary mt-6 w-full justify-center py-3 text-base"
            >
              <IconWrench className="h-5 w-5" />
              Provedl jsem práci / servis
            </button>
            <Link
              href="/prihlaseni"
              className="btn-secondary mt-3 w-full justify-center py-3 text-base"
            >
              <IconShield className="h-5 w-5" />
              Jsem majitel — přihlásit se
            </Link>

            <p className="mt-5 text-center text-xs leading-relaxed text-stone-400">
              Záznam o provedené práci přidáte <strong>bez přihlášení</strong>. Údaje o nemovitosti
              vidí jen přihlášený majitel.
            </p>
          </>
        )}

        {mode === "form" && (
          <form onSubmit={submit} className="space-y-5">
            <div>
              <h1 className="text-xl font-semibold text-stone-900">Záznam o práci</h1>
              {property && <p className="mt-1 text-sm text-stone-500">{property.name}</p>}
            </div>

            <div>
              <label className="label">Co jste dělal?</label>
              <div className="flex flex-wrap gap-2">
                {ACTIONS.map((a) => (
                  <button
                    key={a.label}
                    type="button"
                    onClick={() => toggle(a.label)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      selected.includes(a.label)
                        ? "bg-teal-700 text-white"
                        : "border border-stone-300 text-stone-700 hover:bg-stone-50"
                    }`}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="label" htmlFor="desc">Popis (co konkrétně)</label>
              <textarea
                id="desc"
                className="input min-h-24"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Např. Vyměněn termostatický ventil u radiátoru v obýváku."
              />
            </div>

            <div>
              <label className="label" htmlFor="company">Firma / jméno (volitelné)</label>
              <input
                id="company"
                className="input"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Kdo práci provedl"
              />
            </div>

            <div>
              <label className="label">Fotky</label>
              <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-stone-300 p-6 text-center hover:bg-stone-50">
                <IconCamera className="h-8 w-8 text-stone-400" />
                <span className="text-sm font-medium text-stone-700">
                  {files.length > 0 ? `Vybráno: ${files.length} fotek` : "Vyfotit / vybrat fotky"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  multiple
                  className="hidden"
                  onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
                />
              </label>
            </div>

            <p className="text-xs text-stone-400">Datum se doplní automaticky: {formatDate(new Date())}.</p>

            <div className="flex gap-2">
              <button type="submit" className="btn-primary flex-1 justify-center py-3" disabled={busy}>
                {busy ? "Odesílám…" : "Odeslat záznam"}
              </button>
              <button type="button" onClick={() => setMode("home")} className="btn-ghost">
                Zpět
              </button>
            </div>
          </form>
        )}

        {mode === "done" && (
          <div className="flex flex-col items-center py-10 text-center">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-teal-600 text-white">
              <IconCheck className="h-8 w-8" />
            </div>
            <h1 className="mt-5 text-xl font-semibold text-stone-900">Děkujeme!</h1>
            <p className="mt-2 text-sm text-stone-500">
              Záznam o práci byl uložen do pasu nemovitosti
              {property ? ` „${property.name}"` : ""}. Majitel ho uvidí po přihlášení.
            </p>
            <button
              onClick={() => {
                setSelected([]);
                setDesc("");
                setCompany("");
                setFiles([]);
                setMode("home");
              }}
              className="btn-secondary mt-6"
            >
              Přidat další záznam
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
