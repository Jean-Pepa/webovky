"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getHouse, deleteHouse, type DbHouse } from "@/lib/db/houses";
import { PROPERTY_TYPES } from "@/lib/enums";
import { Loading } from "@/components/Loading";
import { Badge } from "@/components/ui/Badge";
import { IconArrowLeft, IconTrash } from "@/components/Icons";

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [house, setHouse] = useState<DbHouse | null | "loading">("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setHouse(await getHouse(id));
      } catch (e) {
        setHouse(null);
        setError(e instanceof Error ? e.message : "Načtení selhalo.");
      }
    })();
  }, [id]);

  if (house === "loading") return <Loading />;

  if (!house) {
    return (
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-stone-500">{error ?? "Dům nenalezen."}</p>
        <Link href="/domy" className="btn-secondary mt-4">
          Zpět na domy
        </Link>
      </div>
    );
  }

  const address = [house.street, house.zip, house.city].filter(Boolean).join(", ");

  return (
    <div>
      <Link
        href="/domy"
        className="inline-flex items-center gap-1.5 text-sm text-stone-500 transition hover:text-teal-700"
      >
        <IconArrowLeft className="h-4 w-4" />
        Moje domy (cloud)
      </Link>

      <div className="mt-2 flex items-start justify-between gap-4">
        <div>
          <Badge color="teal">{PROPERTY_TYPES[house.type] ?? house.type}</Badge>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-stone-900">{house.name}</h1>
          {address && <p className="mt-1 text-sm text-stone-500">{address}</p>}
        </div>
      </div>

      <section className="card mt-6 p-5">
        <h2 className="text-sm font-semibold text-stone-900">Údaje o domě</h2>
        <dl className="mt-3 space-y-2.5 text-sm">
          <Row label="Typ" value={PROPERTY_TYPES[house.type] ?? house.type} />
          {address && <Row label="Adresa" value={address} />}
          {house.year_built && <Row label="Rok výstavby" value={String(house.year_built)} />}
        </dl>
        {house.description && (
          <p className="mt-3 border-t border-stone-100 pt-3 text-sm leading-relaxed text-stone-600">
            {house.description}
          </p>
        )}
      </section>

      <div className="mt-6 rounded-xl bg-teal-50 px-4 py-3 text-sm text-teal-800">
        ✅ Tento dům je uložený v cloudu (Supabase). Dokumenty a fotky sem přidáme v dalším kroku.
      </div>

      <button
        onClick={async () => {
          if (!confirm("Opravdu smazat tento dům z cloudu?")) return;
          try {
            await deleteHouse(house.id);
            router.push("/domy");
          } catch (e) {
            setError(e instanceof Error ? e.message : "Smazání selhalo.");
          }
        }}
        className="btn-danger btn-sm mt-6"
      >
        <IconTrash className="h-4 w-4" />
        Smazat dům
      </button>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="shrink-0 text-stone-400">{label}</dt>
      <dd className="text-right font-medium text-stone-700">{value}</dd>
    </div>
  );
}
