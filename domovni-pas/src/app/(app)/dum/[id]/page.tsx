"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  getHouse,
  handoverHouse,
  claimHouse,
  deleteHouse,
  getMe,
  type DbHouse,
  type Me,
} from "@/lib/db/houses";
import { PROPERTY_TYPES } from "@/lib/enums";
import { Loading } from "@/components/Loading";
import { Badge } from "@/components/ui/Badge";
import { CloudDocuments } from "@/components/cloud/CloudDocuments";
import { CloudPhotos } from "@/components/cloud/CloudPhotos";
import {
  IconArrowLeft,
  IconTrash,
  IconTransfer,
  IconShield,
  IconFile,
  IconCamera,
  IconBuilding,
} from "@/components/Icons";

const STATUS_LABEL: Record<string, string> = {
  draft: "Rozpracováno",
  handed_over: "Předáno – čeká na převzetí",
  active: "Aktivní",
};

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [house, setHouse] = useState<DbHouse | null | "loading">("loading");
  const [me, setMe] = useState<Me | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [docCount, setDocCount] = useState<number | null>(null);
  const [photoCount, setPhotoCount] = useState<number | null>(null);

  async function load() {
    setError(null);
    try {
      const [h, m] = await Promise.all([getHouse(id), getMe()]);
      setHouse(h);
      setMe(m);
    } catch (e) {
      setHouse(null);
      setError(e instanceof Error ? e.message : "Načtení selhalo.");
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const myId = me?.id;
  const myEmail = me?.email;
  const isOwner = house.owner_id === myId;
  const isCreator = house.created_by === myId;
  const canHandover = isCreator && house.owner_id === myId; // ještě nepředáno/nepřevzato
  const canClaim = !!house.owner_email && house.owner_email === myEmail && house.owner_id !== myId;
  const readOnly = !isOwner; // tvůrce po převzetí klientem
  const canEditFiles = isOwner || isCreator; // vlastník i tvůrce (profík) mohou nahrávat
  const address = [house.street, house.zip, house.city].filter(Boolean).join(", ");

  const roleLabel = canClaim
    ? "K převzetí"
    : isOwner
      ? "Vlastník"
      : isCreator
        ? "Předáno"
        : "Host";

  async function handover(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "").trim();
    if (!email) return;
    setBusy(true);
    setError(null);
    try {
      await handoverHouse(id, email);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Předání selhalo.");
    }
    setBusy(false);
  }

  async function claim() {
    setBusy(true);
    setError(null);
    try {
      await claimHouse(id);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Převzetí selhalo.");
    }
    setBusy(false);
  }

  return (
    <div>
      <Link
        href="/domy"
        className="inline-flex items-center gap-1.5 text-sm text-stone-500 transition hover:text-teal-700"
      >
        <IconArrowLeft className="h-4 w-4" />
        Zpět na domy
      </Link>

      {/* Hlavička */}
      <div className="mt-3 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <Badge color="teal">{PROPERTY_TYPES[house.type] ?? house.type}</Badge>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-stone-900">{house.name}</h1>
          {address && <p className="mt-1 text-sm text-stone-500">{address}</p>}
        </div>
        <span className="shrink-0 rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-600">
          {STATUS_LABEL[house.status] ?? house.status}
        </span>
      </div>

      {error && <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      {readOnly && !canClaim && (
        <div className="mt-4 flex items-start gap-3 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
          <IconShield className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <p>Tento dům jste předali klientovi — máte ho jen ke čtení.</p>
        </div>
      )}

      {/* Příjemce: převzetí */}
      {canClaim && (
        <section className="card mt-4 border-amber-300 p-5 ring-1 ring-amber-200">
          <div className="flex items-start gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-amber-100 text-amber-700">
              <IconTransfer className="h-6 w-6" />
            </span>
            <div className="min-w-0">
              <h2 className="text-sm font-semibold text-stone-900">Tento dům vám byl předán</h2>
              <p className="mt-1 text-sm text-stone-600">
                Po převzetí se stanete vlastníkem a získáte všechna data, dokumenty i fotky.
              </p>
              <button onClick={claim} disabled={busy} className="btn-primary btn-sm mt-3 disabled:opacity-50">
                <IconTransfer className="h-4 w-4" />
                {busy ? "Přebírám…" : "Převzít dům"}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Statistiky */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat
          icon={<IconFile className="h-4 w-4" />}
          label="Dokumentů"
          value={docCount === null ? "—" : String(docCount)}
        />
        <Stat
          icon={<IconCamera className="h-4 w-4" />}
          label="Fotek a videí"
          value={photoCount === null ? "—" : String(photoCount)}
        />
        <Stat
          icon={<IconBuilding className="h-4 w-4" />}
          label="Rok výstavby"
          value={house.year_built ? String(house.year_built) : "—"}
        />
        <Stat icon={<IconShield className="h-4 w-4" />} label="Vaše role" value={roleLabel} />
      </div>

      {/* Profík: předání klientovi */}
      {canHandover && (
        <section className="card mt-6 p-5">
          <h2 className="text-sm font-semibold text-stone-900">Předat klientovi</h2>
          <p className="mt-1 text-sm text-stone-600">
            Zadejte e-mail klienta. Až se s ním přihlásí, uvidí dům a klikne „Převzít“ — stane se vlastníkem.
          </p>
          <form onSubmit={handover} className="mt-3 flex flex-wrap gap-2">
            <input
              name="email"
              type="email"
              required
              defaultValue={house.owner_email ?? ""}
              placeholder="email.klienta@example.cz"
              className="input flex-1"
            />
            <button type="submit" disabled={busy} className="btn-primary btn-sm disabled:opacity-50">
              <IconTransfer className="h-4 w-4" />
              {house.status === "handed_over" ? "Změnit příjemce" : "Předat"}
            </button>
          </form>
          {house.status === "handed_over" && (
            <p className="mt-2 text-xs text-amber-700">
              Předáno na {house.owner_email}. Čeká na převzetí klientem.
            </p>
          )}
        </section>
      )}

      <CloudDocuments houseId={id} canEdit={canEditFiles} onCount={setDocCount} />
      <CloudPhotos houseId={id} canEdit={canEditFiles} onCount={setPhotoCount} />

      {/* Údaje o domě */}
      <section className="card mt-6 p-5">
        <h2 className="text-sm font-semibold text-stone-900">Údaje o domě</h2>
        <dl className="mt-3 space-y-2.5 text-sm">
          <Row label="Typ" value={PROPERTY_TYPES[house.type] ?? house.type} />
          {address && <Row label="Adresa" value={address} />}
          {house.year_built && <Row label="Rok výstavby" value={String(house.year_built)} />}
          {house.owner_email && <Row label="Předáno na e-mail" value={house.owner_email} />}
          <Row label="Stav" value={STATUS_LABEL[house.status] ?? house.status} />
        </dl>
        {house.description && (
          <p className="mt-3 border-t border-stone-100 pt-3 text-sm leading-relaxed text-stone-600">
            {house.description}
          </p>
        )}
        {isOwner && (
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
            className="btn-danger btn-sm mt-4 w-full"
          >
            <IconTrash className="h-4 w-4" />
            Smazat dům
          </button>
        )}
      </section>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="card p-4">
      <div className="flex items-center gap-1.5 text-xs text-stone-400">
        {icon}
        {label}
      </div>
      <p className="mt-1 text-lg font-semibold text-stone-900">{value}</p>
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
