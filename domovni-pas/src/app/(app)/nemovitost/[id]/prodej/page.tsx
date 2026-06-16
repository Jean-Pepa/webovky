"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useStore } from "@/lib/store";
import { canEditProperty } from "@/lib/access";
import { getAttentionItems } from "@/lib/attention";
import { Loading } from "@/components/Loading";
import { BackLink } from "@/components/BackLink";
import { CopyButton } from "@/components/ui/CopyButton";
import { QrCode } from "@/components/QrCode";
import { IconCheck, IconClose, IconShare, IconFile, IconLink } from "@/components/Icons";

export default function SalePage() {
  const { id } = useParams<{ id: string }>();
  const { getProperty, hydrated, role, setShare } = useStore();
  const [origin, setOrigin] = useState("");

  useEffect(() => setOrigin(window.location.origin), []);

  if (!hydrated) return <Loading />;

  const property = getProperty(id);
  if (!property) {
    return (
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-stone-500">Nemovitost nenalezena.</p>
        <Link href="/prehled" className="btn-secondary mt-4">
          Zpět na přehled
        </Link>
      </div>
    );
  }

  const editable = role ? canEditProperty(property, role) : false;
  const url = origin ? `${origin}/sdileno/${id}` : "";
  const att = getAttentionItems([property]);
  const openDefects = att.filter((a) => a.kind === "defect").length;
  const expiredWarranties = att.filter((a) => a.kind === "warranty" && a.severity === "overdue").length;
  const hasEnergy =
    !!property.energyClass || property.documents.some((d) => d.category === "ENERGY_LABEL");

  const checks = [
    { ok: property.documents.length > 0, label: "Nahrané dokumenty", hint: "Smlouvy, projekt, revize" },
    { ok: hasEnergy, label: "Energetický štítek (PENB)", hint: "Třída nebo nahraný průkaz" },
    { ok: property.entries.length > 0, label: "Historie nemovitosti", hint: "Opravy, revize, rekonstrukce" },
    { ok: openDefects === 0, label: "Žádné nevyřešené závady", hint: "Závady mají pozdější opravu" },
    { ok: expiredWarranties === 0, label: "Žádné prošlé záruky", hint: "Záruky vybavení jsou platné" },
  ];
  const ready = checks.filter((c) => c.ok).length;

  return (
    <div className="mx-auto max-w-2xl">
      <BackLink href={`/nemovitost/${id}`}>Zpět na nemovitost</BackLink>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight text-stone-900">Připravit na prodej</h1>
      <p className="mt-1 text-sm text-stone-500">
        Kupujícímu předáte kompletní pas nemovitosti — naskenuje QR nebo otevře odkaz a vidí celou
        historii, dokumenty i záruky.
      </p>

      {/* Připravenost */}
      <section className="card mt-6 p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-stone-900">Připravenost</h2>
          <span className="text-sm font-medium text-stone-500">{ready}/{checks.length}</span>
        </div>
        <ul className="mt-3 space-y-2.5">
          {checks.map((c) => (
            <li key={c.label} className="flex items-start gap-3">
              <span
                className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full ${
                  c.ok ? "bg-teal-600 text-white" : "bg-amber-100 text-amber-700"
                }`}
              >
                {c.ok ? <IconCheck className="h-3.5 w-3.5" /> : <IconClose className="h-3.5 w-3.5" />}
              </span>
              <div>
                <p className="text-sm font-medium text-stone-800">{c.label}</p>
                <p className="text-xs text-stone-400">{c.hint}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Sdílení + QR */}
      <section className="card mt-4 p-5">
        <h2 className="text-sm font-semibold text-stone-900">Sdílení pro kupujícího</h2>
        {property.shareEnabled ? (
          <div className="mt-3 space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row">
              <input readOnly value={url} className="input flex-1 bg-stone-50" />
              <CopyButton text={url} />
            </div>
            <div className="flex flex-wrap items-center gap-4">
              {url && <QrCode value={url} size={130} />}
              <div className="space-y-2">
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-teal-700 hover:underline"
                >
                  <IconLink className="h-4 w-4" />
                  Otevřít náhled pasu
                </a>
                <Link href={`/nemovitost/${id}/qr`} className="btn-secondary btn-sm flex w-fit">
                  <IconFile className="h-4 w-4" />
                  Tisknout QR štítek k domu
                </Link>
              </div>
            </div>
            {editable && (
              <button onClick={() => setShare(id, false)} className="btn-ghost btn-sm text-stone-500">
                Vypnout sdílení
              </button>
            )}
          </div>
        ) : (
          <div className="mt-3">
            <p className="text-sm text-stone-500">
              Zapnutím vytvoříte veřejný náhled pasu a QR kód, který nalepíte u domu.
            </p>
            <button
              onClick={() => setShare(id, true)}
              className="btn-primary mt-3"
              disabled={!editable}
            >
              <IconShare className="h-4 w-4" />
              Zapnout sdílení a QR
            </button>
          </div>
        )}
      </section>

      {/* Report */}
      <section className="card mt-4 flex items-center justify-between gap-4 p-5">
        <div>
          <h2 className="text-sm font-semibold text-stone-900">Tištěný report</h2>
          <p className="mt-1 text-sm text-stone-500">„Historie nemovitosti" k vytištění pro kupujícího.</p>
        </div>
        <Link href={`/nemovitost/${id}/report`} className="btn-secondary btn-sm shrink-0">
          <IconFile className="h-4 w-4" />
          Otevřít report
        </Link>
      </section>
    </div>
  );
}
