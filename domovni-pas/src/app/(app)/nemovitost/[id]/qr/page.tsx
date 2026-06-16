"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useStore } from "@/lib/store";
import { Loading } from "@/components/Loading";
import { BackLink } from "@/components/BackLink";
import { PrintButton } from "@/components/ui/PrintButton";
import { QrCode } from "@/components/QrCode";
import { Logo } from "@/components/Logo";
import { IconShare } from "@/components/Icons";
import { addressLine } from "@/lib/format";

export default function QrStickerPage() {
  const { id } = useParams<{ id: string }>();
  const { getProperty, hydrated, setShare } = useStore();
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

  const url = origin ? `${origin}/sdileno/${id}` : "";

  return (
    <div className="mx-auto max-w-md">
      <div className="no-print mb-6 flex items-center justify-between">
        <BackLink href={`/nemovitost/${id}`}>Zpět na nemovitost</BackLink>
        {property.shareEnabled && <PrintButton />}
      </div>

      {!property.shareEnabled ? (
        <div className="card flex flex-col items-center px-6 py-10 text-center">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-teal-50 text-teal-700">
            <IconShare className="h-6 w-6" />
          </div>
          <p className="mt-4 text-sm font-medium text-stone-800">Nejdřív zapněte sdílení</p>
          <p className="mt-1 max-w-sm text-sm text-stone-500">
            QR kód vede na veřejný náhled pasu nemovitosti. Aby fungoval, musí být sdílení zapnuté.
          </p>
          <button onClick={() => setShare(id, true)} className="btn-primary mt-5">
            <IconShare className="h-4 w-4" />
            Zapnout sdílení a vytvořit QR
          </button>
        </div>
      ) : (
        <div className="card print-clean p-8 text-center">
          <div className="-mx-8 -mt-8 mb-6 h-1.5 rounded-t-2xl bg-brass" />
          <Logo />
          <h1 className="mt-5 text-xl font-semibold tracking-tight text-stone-900">{property.name}</h1>
          <p className="mt-1 text-sm text-stone-500">{addressLine(property)}</p>

          <div className="mt-6 flex justify-center">{url && <QrCode value={url} size={210} />}</div>

          <p className="mt-5 text-sm font-medium text-stone-800">
            Naskenujte telefonem a prohlédněte si pas této nemovitosti
          </p>
          <p className="mt-1 text-xs text-stone-400">
            Historie, dokumenty, záruky i vybavení — na jednom místě.
          </p>
          <p className="mt-6 border-t border-stone-200 pt-4 text-xs tracking-[0.2em] text-stone-400">
            BULO · DIGITÁLNÍ PAS NEMOVITOSTI
          </p>
        </div>
      )}

      <p className="no-print mt-4 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
        Pozn.: V této ukázce běží data v prohlížeči, takže QR otevře náhled na stejném zařízení.
        V ostré verzi (s backendem) by QR fungoval pro kohokoli, kdo ho naskenuje.
      </p>
    </div>
  );
}
