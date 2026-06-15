"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useStore } from "@/lib/store";
import { Loading } from "@/components/Loading";
import { BackLink } from "@/components/BackLink";
import { CopyButton } from "@/components/ui/CopyButton";
import { IconShare, IconLink } from "@/components/Icons";

export default function SharePage() {
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
  const active = property.shareEnabled;

  return (
    <div className="mx-auto max-w-2xl">
      <BackLink href={`/nemovitost/${id}`}>Zpět na nemovitost</BackLink>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight text-stone-900">Sdílení</h1>
      <p className="mt-1 text-sm text-stone-500">
        Vytvořte read-only náhled pro kupujícího, makléře nebo řemeslníka. Uvidí historii i
        dokumenty, ale nemohou nic měnit. Náhled kdykoli vypnete.
      </p>

      <div className="card mt-6 p-6">
        {active ? (
          <div className="space-y-5">
            <div className="flex items-center gap-2 text-sm font-medium text-teal-700">
              <span className="h-2 w-2 rounded-full bg-teal-500" />
              Sdílení je zapnuté
            </div>

            <div>
              <label className="label">Odkaz na náhled</label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <input readOnly value={url} className="input flex-1 bg-stone-50" />
                <CopyButton text={url} />
              </div>
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center gap-1.5 text-sm text-teal-700 hover:underline"
              >
                <IconLink className="h-4 w-4" />
                Otevřít náhled
              </a>
            </div>

            <div className="border-t border-stone-100 pt-4">
              <button onClick={() => setShare(id, false)} className="btn-danger btn-sm">
                Vypnout sdílení
              </button>
            </div>

            <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
              Pozn.: V této ukázce běží data v prohlížeči, takže náhled otevřete na stejném
              zařízení. V ostré verzi by odkaz fungoval pro kohokoli.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center py-6 text-center">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-teal-50 text-teal-700">
              <IconShare className="h-6 w-6" />
            </div>
            <p className="mt-4 text-sm font-medium text-stone-800">Sdílení je vypnuté</p>
            <p className="mt-1 max-w-sm text-sm text-stone-500">
              Zapnutím vytvoříte odkaz, přes který si kdokoli prohlédne historii této nemovitosti —
              bez možnosti úprav.
            </p>
            <button onClick={() => setShare(id, true)} className="btn-primary mt-5">
              <IconShare className="h-4 w-4" />
              Zapnout sdílení
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
