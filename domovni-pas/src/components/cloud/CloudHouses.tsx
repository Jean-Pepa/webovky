"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  listMyHouses,
  createHouse,
  claimHouse,
  getMe,
  type DbHouse,
  type Me,
} from "@/lib/db/houses";
import { useStore } from "@/lib/store";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { PROPERTY_TYPES } from "@/lib/enums";
import { Loading } from "@/components/Loading";
import { IconPlus, IconHome, IconBuilding, IconTransfer } from "@/components/Icons";

const STATUS_LABEL: Record<string, string> = {
  draft: "Rozpracováno",
  handed_over: "Předáno – čeká na převzetí",
  active: "Aktivní",
};

export function CloudHouses() {
  const configured = isSupabaseConfigured();
  const { role } = useStore();
  const isPro = role === "ARCHITECT" || role === "DEVELOPER";

  const [me, setMe] = useState<Me | null>(null);
  const [houses, setHouses] = useState<DbHouse[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  async function load() {
    setError(null);
    try {
      const [m, hs] = await Promise.all([getMe(), listMyHouses()]);
      setMe(m);
      setHouses(hs);
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
        status: isPro ? "draft" : "active",
      });
      form.reset();
      setOpen(false);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Uložení selhalo.");
    }
    setBusy(false);
  }

  async function claim(id: string) {
    setError(null);
    try {
      await claimHouse(id);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Převzetí selhalo.");
    }
  }

  if (!configured) {
    return (
      <div className="card p-6 text-sm text-stone-600">
        Cloud (Supabase) není nastavený. Doplň klíče do <code>.env.local</code> a restartuj.
      </div>
    );
  }

  const all = houses ?? [];
  const myId = me?.id;
  const myEmail = me?.email;
  const toClaim = all.filter((h) => h.owner_email && h.owner_email === myEmail && h.owner_id !== myId);
  const owned = all.filter((h) => h.owner_id === myId);
  const projects = all.filter((h) => h.created_by === myId); // profík: vše, co jsem založil

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-stone-900">
            {isPro ? "Projekty (cloud)" : "Moje domy (cloud)"}
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            {isPro
              ? "Založte dům, nahrajte data a předejte klientovi."
              : "Uloženo v databázi — dostupné odkudkoli."}
          </p>
        </div>
        <button onClick={() => setOpen((o) => !o)} className="btn-primary">
          <IconPlus className="h-4 w-4" />
          {isPro ? "Nový projekt" : "Založit dům"}
        </button>
      </div>

      {open && (
        <form onSubmit={submit} className="card mt-5 grid gap-2 p-5 sm:grid-cols-2">
          <input name="name" required className="input sm:col-span-2" placeholder="Název" />
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

      {error && <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      {houses === null ? (
        <Loading />
      ) : (
        <div className="mt-6 space-y-8">
          {/* K převzetí (příjemce) */}
          {toClaim.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-stone-500">Předané vám k převzetí · {toClaim.length}</h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {toClaim.map((h) => (
                  <div key={h.id} className="card border-amber-300 p-5 ring-1 ring-amber-200">
                    <h3 className="text-lg font-semibold text-stone-900">{h.name}</h3>
                    <p className="mt-1 text-sm text-stone-500">{PROPERTY_TYPES[h.type] ?? h.type}</p>
                    <button onClick={() => claim(h.id)} className="btn-primary btn-sm mt-4 w-full">
                      <IconTransfer className="h-4 w-4" />
                      Převzít dům
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {isPro ? (
            <Section
              title="Moje projekty"
              items={projects}
              myId={myId}
              empty="Zatím žádný projekt. Založte nový a předejte ho klientovi."
            />
          ) : (
            <Section
              title="Moje domy"
              items={owned}
              myId={myId}
              empty="Zatím žádný dům v cloudu. Založte první."
              icon
            />
          )}
        </div>
      )}
    </div>
  );
}

function Section({
  title,
  items,
  myId,
  empty,
  icon,
}: {
  title: string;
  items: DbHouse[];
  myId?: string;
  empty: string;
  icon?: boolean;
}) {
  return (
    <section>
      <h2 className="text-sm font-semibold text-stone-500">
        {title} <span className="text-stone-400">· {items.length}</span>
      </h2>
      {items.length === 0 ? (
        <div className="card mt-3 flex flex-col items-center px-6 py-12 text-center">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-teal-50 text-teal-700">
            {icon ? <IconHome className="h-7 w-7" /> : <IconBuilding className="h-7 w-7" />}
          </div>
          <p className="mt-4 max-w-sm text-sm text-stone-500">{empty}</p>
        </div>
      ) : (
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((h) => {
            const handedAway = h.created_by === myId && h.owner_id !== myId;
            return (
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
                <span className="mt-3 inline-block w-fit rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-600">
                  {handedAway ? "Předáno klientovi" : STATUS_LABEL[h.status] ?? h.status}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
