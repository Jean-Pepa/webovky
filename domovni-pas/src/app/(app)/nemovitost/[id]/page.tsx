"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { canSeeProperty, canEditProperty, canContributeToProperty } from "@/lib/access";
import { Loading } from "@/components/Loading";
import { Badge } from "@/components/ui/Badge";
import { EntryCard } from "@/components/EntryCard";
import { ConsultationSection } from "@/components/ConsultationSection";
import { ProjectCard } from "@/components/ProjectCard";
import { SystemCard } from "@/components/SystemsSection";
import { QrCode } from "@/components/QrCode";
import {
  IconPlus,
  IconShare,
  IconTransfer,
  IconFile,
  IconCalendar,
  IconMoney,
  IconBuilding,
  IconTrash,
  IconShield,
  IconBolt,
  IconCamera,
  IconArrowRight,
  IconChevronDown,
} from "@/components/Icons";
import { PROPERTY_TYPES } from "@/lib/enums";
import { addressLine } from "@/lib/format";

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { getProperty, hydrated, role, deleteEntry, deleteProperty } = useStore();
  const [origin, setOrigin] = useState("");
  const [historyOpen, setHistoryOpen] = useState(false);
  useEffect(() => setOrigin(window.location.origin), []);

  if (!hydrated) return <Loading />;

  const property = getProperty(id);
  if (!property || (role && !canSeeProperty(property, role))) {
    return (
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-stone-500">
          {property ? "K této nemovitosti nemáte přístup." : "Nemovitost nenalezena."}
        </p>
        <Link href="/prehled" className="btn-secondary mt-4">
          Zpět na přehled
        </Link>
      </div>
    );
  }

  const editable = role ? canEditProperty(property, role) : false;
  const canAdd = role ? canContributeToProperty(property, role) : false;
  const lockedByHandover = role === "ARCHITECT" && property.handedOver;

  const entries = [...property.entries].sort((a, b) => b.date.localeCompare(a.date));
  const qrUrl = origin ? `${origin}/q/${id}` : "";
  const systems = property.systems ?? [];
  const photos = property.photos ?? [];

  return (
    <div>
      {!editable && (
        <div className="flex items-start gap-3 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
          <IconShield className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <p>
            {lockedByHandover
              ? "Tento projekt jste předali klientovi — máte ho jen ke čtení."
              : "Tuto nemovitost máte jen ke čtení."}
          </p>
        </div>
      )}

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <Badge color="teal">{PROPERTY_TYPES[property.type]}</Badge>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-stone-900">{property.name}</h1>
          <p className="mt-1 text-sm text-stone-500">{addressLine(property)}</p>
        </div>

        <Link
          href={`/nemovitost/${id}/qr`}
          title="QR štítek k domu"
          className="no-print group shrink-0 text-center"
        >
          {qrUrl && (
            <span className="block transition group-hover:opacity-80">
              <QrCode value={qrUrl} size={84} />
            </span>
          )}
          <span className="mt-1 block text-[11px] font-medium text-stone-400 group-hover:text-teal-700">
            QR štítek
          </span>
        </Link>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Link href={`/nemovitost/${id}/report`} className="btn-primary btn-sm">
          <IconFile className="h-4 w-4" />
          Report
        </Link>
        {editable && (
          <>
            <Link href={`/nemovitost/${id}/prodej`} className="btn-secondary btn-sm">
              <IconMoney className="h-4 w-4" />
              Připravit na prodej
            </Link>
            <Link href={`/nemovitost/${id}/sdileni`} className="btn-secondary btn-sm">
              <IconShare className="h-4 w-4" />
              Sdílet
            </Link>
            <Link href={`/nemovitost/${id}/prevod`} className="btn-secondary btn-sm">
              <IconTransfer className="h-4 w-4" />
              Převést
            </Link>
            <Link href={`/nemovitost/${id}/upravit`} className="btn-ghost btn-sm">
              Upravit
            </Link>
          </>
        )}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat icon={<IconFile className="h-4 w-4" />} label="Dokumentů" value={String(property.documents.length)} />
        <Stat icon={<IconBolt className="h-4 w-4" />} label="Systémů" value={String(systems.length)} />
        <Stat icon={<IconCamera className="h-4 w-4" />} label="Fotek" value={String(photos.length)} />
        <Stat
          icon={<IconBuilding className="h-4 w-4" />}
          label="Rok výstavby"
          value={property.yearBuilt ? String(property.yearBuilt) : "—"}
        />
      </div>

      {/* Dokumentace — páteř pasu */}
      <Link
        href={`/nemovitost/${id}/dokumentace`}
        className="card mt-6 flex items-center justify-between gap-4 p-5 transition hover:border-teal-300"
      >
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-teal-50 text-teal-700">
            <IconFile className="h-6 w-6" />
          </span>
          <div>
            <p className="text-sm font-semibold text-stone-900">Dokumentace</p>
            <p className="text-sm text-stone-500">
              Půdorysy, 3D model, certifikáty a smlouvy
              {property.documents.length > 0 ? ` · ${property.documents.length}` : ""}
            </p>
          </div>
        </div>
        <IconArrowRight className="h-5 w-5 shrink-0 text-stone-400" />
      </Link>

      {/* Systémy domu */}
      <section className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-stone-900">Systémy domu</h2>
          <Link href={`/nemovitost/${id}/systemy`} className="text-sm font-medium text-teal-700 hover:underline">
            {editable ? "Spravovat →" : "Vše →"}
          </Link>
        </div>
        {systems.length === 0 ? (
          <div className="card mt-3 px-6 py-8 text-center text-sm text-stone-500">
            Zatím žádné systémy.{" "}
            {editable && (
              <Link href={`/nemovitost/${id}/systemy`} className="font-medium text-teal-700 hover:underline">
                Přidat solár, elektřinu, vodu, topení →
              </Link>
            )}
          </div>
        ) : (
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {systems.map((s) => (
              <SystemCard
                key={s.id}
                system={s}
                propertyId={id}
                photoCount={photos.filter((p) => p.systemId === s.id).length}
              />
            ))}
          </div>
        )}
      </section>

      {/* Fotodokumentace */}
      <section className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-stone-900">Fotodokumentace</h2>
          <Link href={`/nemovitost/${id}/fotodokumentace`} className="text-sm font-medium text-teal-700 hover:underline">
            Vše →
          </Link>
        </div>
        {photos.length === 0 ? (
          <div className="card mt-3 px-6 py-8 text-center text-sm text-stone-500">
            Zatím žádné fotky.{" "}
            {editable && (
              <Link href={`/nemovitost/${id}/fotodokumentace`} className="font-medium text-teal-700 hover:underline">
                Nafotit skryté rozvody →
              </Link>
            )}
          </div>
        ) : (
          <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
            {photos.slice(0, 8).map((ph) => (
              <Link
                key={ph.id}
                href={`/nemovitost/${id}/fotodokumentace`}
                className="card overflow-hidden p-0 transition hover:border-teal-300"
              >
                <div className="aspect-[4/3] w-full bg-stone-100">
                  {ph.kind === "video" ? (
                    // eslint-disable-next-line jsx-a11y/media-has-caption
                    <video src={ph.dataUrl} className="h-full w-full object-cover" />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={ph.dataUrl} alt={ph.caption ?? ""} className="h-full w-full object-cover" />
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <ProjectCard property={property} className="mt-8" />

      <ConsultationSection propertyId={id} consultations={property.consultations ?? []} />

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => setHistoryOpen((o) => !o)}
              className="flex items-center gap-2 text-left"
            >
              <h2 className="text-lg font-semibold text-stone-900">Historie</h2>
              {entries.length > 0 && (
                <span className="text-sm text-stone-400">· {entries.length}</span>
              )}
              <IconChevronDown
                className={`h-4 w-4 shrink-0 text-stone-400 transition ${historyOpen ? "rotate-180" : ""}`}
              />
            </button>
            {canAdd && (
              <Link href={`/nemovitost/${id}/zaznam/novy`} className="btn-primary btn-sm">
                <IconPlus className="h-4 w-4" />
                Přidat záznam
              </Link>
            )}
          </div>

          {historyOpen &&
            (entries.length === 0 ? (
              <div className="card mt-4 flex flex-col items-center px-6 py-12 text-center">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-teal-50 text-teal-700">
                  <IconCalendar className="h-6 w-6" />
                </div>
                <p className="mt-4 text-sm font-medium text-stone-800">Zatím žádný záznam</p>
                {canAdd && (
                  <>
                    <p className="mt-1 max-w-xs text-sm text-stone-500">
                      Přidejte první událost — opravu, revizi, závadu nebo rekonstrukci.
                    </p>
                    <Link href={`/nemovitost/${id}/zaznam/novy`} className="btn-primary btn-sm mt-5">
                      <IconPlus className="h-4 w-4" />
                      Přidat záznam
                    </Link>
                  </>
                )}
              </div>
            ) : (
              <ol className="mt-5 space-y-5 border-l-2 border-stone-200 pl-7">
                {entries.map((entry) => (
                  <EntryCard
                    key={entry.id}
                    entry={entry}
                    onDelete={editable ? () => deleteEntry(id, entry.id) : undefined}
                  />
                ))}
              </ol>
            ))}
        </div>

        <div className="space-y-6">
          <section className="card p-5">
            <h2 className="text-sm font-semibold text-stone-900">Údaje o nemovitosti</h2>
            <dl className="mt-3 space-y-2.5 text-sm">
              <Row label="Typ" value={PROPERTY_TYPES[property.type]} />
              <Row label="Adresa" value={addressLine(property)} />
              {property.cadastralArea && <Row label="Katastr. území" value={property.cadastralArea} />}
              {property.parcelNumber && <Row label="Parcela / č.p." value={property.parcelNumber} />}
              <Row label="Vlastník" value={property.ownerName} />
            </dl>
            {property.description && (
              <p className="mt-3 border-t border-stone-100 pt-3 text-sm leading-relaxed text-stone-600">
                {property.description}
              </p>
            )}
            {editable && (
              <button
                onClick={() => {
                  if (confirm("Opravdu smazat tuto nemovitost se všemi záznamy?")) {
                    deleteProperty(id);
                    router.push("/prehled");
                  }
                }}
                className="btn-danger btn-sm mt-4 w-full"
              >
                <IconTrash className="h-4 w-4" />
                Smazat nemovitost
              </button>
            )}
          </section>
        </div>
      </div>
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
