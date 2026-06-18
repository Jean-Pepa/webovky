"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { listMyHouses, createHouse, type DbHouse } from "@/lib/db/houses";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { PROPERTY_TYPES } from "@/lib/enums";
import { Loading } from "@/components/Loading";
import { IconPlus, IconHome } from "@/components/Icons";

export function CloudHouses() {
  const configured = isSupabaseConfigured();
  const [houses, setHouses] = useState<DbHouse[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  async function load() {
    setError(null);
    try {
      setHouses(await listMyHouses());
    } catch (e) {
      setHouses([]);
      setError(e instanceof Error ? e.message : "Nepodařilo se načíst domy.");
    }
  }

  useEffect(() => {
    if (configured) load();
  }, [configured]);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const name = String(fd.get("name") || "").trim();
    if (!name) return;
    setBusy(true);
    setError(null);
    try {
      const yb = Number(fd.get("year_built"));
      await createHouse({
        name,
        type: String(fd.get("type") || "HOUSE"),
        street: String(fd.get("street") || "").trim() || null,
        city: String(fd.get("city") || "").trim() || null,
        zip: String(fd.get("zip") || "").trim() || null,
        year_built: Number.isFinite(yb) && yb > 0 ? yb : null,
      });
      form.reset();
      setOpen(false);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Uložení selhalo.");
    }
    setBusy(false);
  }

  if (!configured) {
    return (
      <div className="card p-6 text-sm text-stone-600">
        Cloud (Supabase) není nastavený. Doplň klíče do <code>.env.local</code> a restartuj.
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-stone-900">Moje domy (cloud)</h1>
          <p className="mt-1 text-sm text-stone-500">Uloženo v databázi — dostupné odkudkoli.</p>
        </div>
        <button onClick={() => setOpen((o) => !o)} className="btn-primary">
          <IconPlus className="h-4 w-4" />
          Založit dům
        </button>
      </div>

      {open && (
        <form onSubmit={submit} className="card mt-5 grid gap-2 p-5 sm:grid-cols-2">
          <input name="name" required className="input sm:col-span-2" placeholder="Název (např. Náš dům v Říčanech)" />
          <select name="type" defaultValue="HOUSE" className="input">
            {Object.entries(PROPERTY_TYPES).map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
          <input name="year_built" type="number" min="1800" max="2100" className="input" placeholder="Rok výstavby" />
          <input name="street" className="input" placeholder="Ulice a č.p." />
          <input name="city" className="input" placeholder="Město" />
          <input name="zip" className="input" placeholder="PSČ" />
          <button type="submit" disabled={busy} className="btn-primary sm:col-span-2 disabled:opacity-50">
            {busy ? "Ukládám…" : "Uložit do cloudu"}
          </button>
        </form>
      )}

      {error && (
        <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      {houses === null ? (
        <Loading />
      ) : houses.length === 0 ? (
        <div className="card mt-6 flex flex-col items-center px-6 py-16 text-center">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-teal-50 text-teal-700">
            <IconHome className="h-8 w-8" />
          </div>
          <p className="mt-5 text-lg font-semibold text-stone-900">Zatím žádný dům v cloudu</p>
          <p className="mt-2 max-w-sm text-sm text-stone-500">
            Založ první dům — uloží se do databáze a zůstane dostupný i po obnovení a na jiném zařízení.
          </p>
          <button onClick={() => setOpen(true)} className="btn-primary mt-6">
            <IconPlus className="h-4 w-4" />
            Založit dům
          </button>
        </div>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {houses.map((h) => (
            <Link
              key={h.id}
              href={`/dum/${h.id}`}
              className="card group flex flex-col p-5 transition hover:border-teal-300 hover:shadow-md"
            >
              <h3 className="text-lg font-semibold text-stone-900 group-hover:text-teal-800">{h.name}</h3>
              <p className="mt-1 text-sm text-stone-500">
                {PROPERTY_TYPES[h.type] ?? h.type}
                {h.city ? ` · ${[h.street, h.city].filter(Boolean).join(", ")}` : ""}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
