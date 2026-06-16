"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Loading } from "@/components/Loading";
import { ROLE_LABELS, ROLE_INITIALS, canSeeProperty } from "@/lib/access";
import { IconLogout, IconDownload, IconShield, IconArrowRight } from "@/components/Icons";

const ROLE_DESC: Record<string, string> = {
  ARCHITECT: "Vidíte a spravujete své projekty a předáváte je klientům.",
  CLIENT: "Spravujete své nemovitosti, dokumenty, záruky a revize.",
  CREATOR: "Správce systému — vidíte všechny nemovitosti, statistiky a data.",
};

export default function AccountPage() {
  const { role, logout, properties, hydrated } = useStore();
  const router = useRouter();

  if (!hydrated) return <Loading />;
  const r = role ?? "CLIENT";
  const myCount = role ? properties.filter((p) => canSeeProperty(p, role)).length : 0;

  function exportData() {
    const blob = new Blob([JSON.stringify(properties, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bulo-zaloha-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-semibold tracking-tight text-stone-900">Nastavení účtu</h1>
      <p className="mt-1 text-sm text-stone-500">Vaše role, data a předvolby aplikace.</p>

      {/* Profil */}
      <section className="card mt-6 flex items-center gap-4 p-5">
        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-teal-700 text-lg font-semibold text-white">
          {ROLE_INITIALS[r]}
        </span>
        <div className="min-w-0">
          <p className="text-lg font-semibold text-stone-900">{ROLE_LABELS[r]}</p>
          <p className="text-sm text-stone-500">{ROLE_DESC[r]}</p>
        </div>
      </section>

      {/* Účet */}
      <section className="card mt-4 p-5">
        <h2 className="text-sm font-semibold text-stone-900">Účet</h2>
        <dl className="mt-3 divide-y divide-stone-100 text-sm">
          <div className="flex items-center justify-between py-2.5">
            <dt className="text-stone-500">Role</dt>
            <dd className="font-medium text-stone-800">{ROLE_LABELS[r]}</dd>
          </div>
          <div className="flex items-center justify-between py-2.5">
            <dt className="text-stone-500">
              {r === "ARCHITECT" ? "Mých projektů" : "Mých nemovitostí"}
            </dt>
            <dd className="font-medium text-stone-800">{myCount}</dd>
          </div>
        </dl>
        <button
          onClick={() => {
            logout();
            router.push("/");
          }}
          className="btn-danger btn-sm mt-4"
        >
          <IconLogout className="h-4 w-4" />
          Odhlásit se
        </button>
      </section>

      {/* Data */}
      <section className="card mt-4 p-5">
        <h2 className="text-sm font-semibold text-stone-900">Má data</h2>
        <p className="mt-1 text-sm text-stone-500">
          Data jsou uložená jen ve vašem prohlížeči. Stáhněte si zálohu pro jistotu.
        </p>
        <button onClick={exportData} className="btn-secondary btn-sm mt-3">
          <IconDownload className="h-4 w-4" />
          Stáhnout zálohu (JSON)
        </button>
      </section>

      {/* Branding studia — jen architekt */}
      {r === "ARCHITECT" && <BrandingCard />}

      {/* Aplikace */}
      <section className="card mt-4 p-5">
        <h2 className="text-sm font-semibold text-stone-900">Aplikace</h2>
        <Link
          href="/zasady"
          className="mt-2 flex items-center justify-between rounded-lg py-2 text-sm font-medium text-stone-700 transition hover:text-teal-700"
        >
          <span className="inline-flex items-center gap-2">
            <IconShield className="h-4 w-4" /> Zásady ochrany osobních údajů
          </span>
          <IconArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  );
}

const BRAND_COLORS = ["#b5543a", "#184E5A", "#2F5D50", "#6B4E2E", "#1f2937"];

function BrandingCard() {
  const { branding, setBranding } = useStore();
  const [studioName, setStudioName] = useState(branding.studioName ?? "");
  const [tagline, setTagline] = useState(branding.tagline ?? "");
  const [color, setColor] = useState(branding.color ?? "#b5543a");
  const [saved, setSaved] = useState(false);

  function save() {
    setBranding({
      studioName: studioName.trim() || undefined,
      tagline: tagline.trim() || undefined,
      color,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <section className="card mt-4 p-5">
      <h2 className="text-sm font-semibold text-stone-900">Branding studia</h2>
      <p className="mt-1 text-sm text-stone-500">
        Zobrazí se na reportu a sdíleném pasu, který předáte klientovi.
      </p>
      <div className="mt-4 space-y-4">
        <div>
          <label className="label" htmlFor="studio">Název studia</label>
          <input
            id="studio"
            className="input"
            value={studioName}
            onChange={(e) => setStudioName(e.target.value)}
            placeholder="Např. Ateliér Kořínek"
          />
        </div>
        <div>
          <label className="label" htmlFor="tagline">Claim (volitelné)</label>
          <input
            id="tagline"
            className="input"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            placeholder="Architektura, která dává smysl"
          />
        </div>
        <div>
          <label className="label">Barva</label>
          <div className="flex items-center gap-2">
            {BRAND_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                aria-label={c}
                className={`h-8 w-8 rounded-full border-2 transition ${
                  color === c ? "border-stone-900" : "border-transparent"
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="h-8 w-10 cursor-pointer rounded border border-stone-200 bg-white"
            />
          </div>
        </div>

        {/* Náhled hlavičky */}
        <div className="rounded-xl border border-stone-200 p-4">
          <div className="h-1.5 w-full rounded-full" style={{ backgroundColor: color }} />
          <p className="mt-3 text-base font-semibold" style={{ color }}>
            {studioName || "Název studia"}
          </p>
          {tagline && <p className="text-xs text-stone-500">{tagline}</p>}
          <p className="mt-1 text-[11px] uppercase tracking-wide text-stone-400">
            Náhled hlavičky reportu / pasu
          </p>
        </div>

        <button onClick={save} className="btn-primary btn-sm">
          {saved ? "Uloženo ✓" : "Uložit branding"}
        </button>
      </div>
    </section>
  );
}
