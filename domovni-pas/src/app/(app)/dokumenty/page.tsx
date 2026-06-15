"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { Loading } from "@/components/Loading";
import { DOCUMENT_CATEGORIES } from "@/lib/enums";
import { IconFile, IconDownload } from "@/components/Icons";

export default function DocumentsPage() {
  const { properties, hydrated } = useStore();
  if (!hydrated) return <Loading />;

  const withDocs = properties.filter((p) => p.documents.length > 0);
  const total = withDocs.reduce((s, p) => s + p.documents.length, 0);

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-stone-900">Dokumenty</h1>
      <p className="mt-1 text-sm text-stone-500">
        {total > 0
          ? `${total} dokumentů napříč vašimi nemovitostmi.`
          : "Dokumenty k nemovitostem na jednom místě."}
      </p>

      {total === 0 ? (
        <div className="card mt-8 flex flex-col items-center px-6 py-16 text-center">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-teal-50 text-teal-700">
            <IconFile className="h-7 w-7" />
          </div>
          <p className="mt-4 text-sm font-medium text-stone-800">Žádné dokumenty</p>
          <p className="mt-1 max-w-sm text-sm text-stone-500">
            Nahrajte projektovou dokumentaci, energetický štítek nebo smlouvy u konkrétní
            nemovitosti.
          </p>
          <Link href="/prehled" className="btn-secondary mt-6">
            Na přehled nemovitostí
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          {withDocs.map((p) => (
            <section key={p.id} className="card p-5">
              <div className="flex items-center justify-between">
                <Link
                  href={`/nemovitost/${p.id}`}
                  className="text-sm font-semibold text-stone-900 hover:text-teal-700"
                >
                  {p.name}
                </Link>
                <span className="text-xs text-stone-400">{p.documents.length} dokumentů</span>
              </div>
              <ul className="mt-2 divide-y divide-stone-100">
                {p.documents.map((doc) => (
                  <li key={doc.id} className="flex items-center gap-3 py-2.5">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-stone-100 text-stone-500">
                      <IconFile className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-stone-800">{doc.title}</p>
                      <p className="truncate text-xs text-stone-400">
                        {DOCUMENT_CATEGORIES[doc.category] ?? DOCUMENT_CATEGORIES.OTHER}
                        {doc.fileName ? ` · ${doc.fileName}` : ""}
                      </p>
                    </div>
                    {doc.dataUrl && (
                      <a
                        href={doc.dataUrl}
                        download={doc.fileName ?? doc.title}
                        className="btn-ghost btn-sm text-stone-500"
                        title="Stáhnout"
                      >
                        <IconDownload className="h-4 w-4" />
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
