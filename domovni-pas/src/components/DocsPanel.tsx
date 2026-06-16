"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { useStore, type Property, type DocItem, type DocSection } from "@/lib/store";
import { canSeeProperty } from "@/lib/access";
import {
  DOCUMENT_CATEGORIES,
  DOC_SECTIONS,
  DOC_SECTION_ORDER,
  CATEGORY_TO_SECTION,
} from "@/lib/enums";
import { IconClose, IconFile, IconSearch, IconDownload } from "@/components/Icons";

const sectionOf = (doc: DocItem): DocSection =>
  (doc.section ?? CATEGORY_TO_SECTION[doc.category] ?? "BUDOVA") as DocSection;

export function DocsPanel() {
  const pathname = usePathname();
  const { properties, getProperty, role } = useStore();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<DocSection>("POZEMEK");

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("bulo-open-docs", handler);
    return () => window.removeEventListener("bulo-open-docs", handler);
  }, []);

  // Zavřít panel při přechodu na jinou stránku (a vyčistit stav)
  useEffect(() => {
    setOpen(false);
    setQuery("");
    setActive("POZEMEK");
  }, [pathname]);

  // Kontext: jsme v detailu konkrétní nemovitosti?
  const match = pathname.match(/^\/nemovitost\/([^/]+)/);
  const propId = match?.[1];
  const property =
    propId && !["nova", "zalozit"].includes(propId) ? getProperty(propId) : undefined;

  // Home režim — vyhledávání napříč všemi dokumenty
  const q = query.trim().toLowerCase();
  const rows = useMemo(() => {
    if (property) return [];
    const visible = role ? properties.filter((p) => canSeeProperty(p, role)) : [];
    const all = visible.flatMap((p) => p.documents.map((doc) => ({ doc, property: p })));
    if (!q) return all;
    return all.filter(
      ({ doc, property: p }) =>
        doc.title.toLowerCase().includes(q) ||
        (doc.fileName ?? "").toLowerCase().includes(q) ||
        (DOCUMENT_CATEGORIES[doc.category] ?? "").toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q),
    );
  }, [properties, role, property, q]);

  if (!open) return null;

  return (
    <div className="no-print fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30" onClick={() => setOpen(false)} />
      <aside className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4">
          <div className="flex min-w-0 items-center gap-2">
            <IconFile className="h-5 w-5 shrink-0 text-teal-700" />
            <div className="min-w-0">
              <h2 className="truncate text-base font-semibold text-stone-900">Dokumentace</h2>
              <p className="truncate text-xs text-stone-400">
                {property ? property.name : "Hledání napříč nemovitostmi"}
              </p>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Zavřít"
            className="text-stone-400 hover:text-stone-700"
          >
            <IconClose className="h-5 w-5" />
          </button>
        </div>

        {property ? (
          <>
            {/* Záložky sekcí projektu */}
            <div className="flex gap-1 overflow-x-auto border-b border-stone-200 px-3 py-2">
              {DOC_SECTION_ORDER.map((s) => (
                <button
                  key={s}
                  onClick={() => setActive(s)}
                  className={`shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                    s === active ? "bg-teal-50 text-teal-800" : "text-stone-600 hover:bg-stone-100"
                  }`}
                >
                  {DOC_SECTIONS[s]}
                </button>
              ))}
            </div>
            <PropertyDocs property={property} section={active} onNavigate={() => setOpen(false)} />
          </>
        ) : (
          <SearchDocs query={query} setQuery={setQuery} rows={rows} onNavigate={() => setOpen(false)} />
        )}
      </aside>
    </div>
  );
}

// Dokumenty konkrétní nemovitosti pro vybranou sekci
function PropertyDocs({
  property,
  section,
  onNavigate,
}: {
  property: Property;
  section: DocSection;
  onNavigate: () => void;
}) {
  const docs = property.documents.filter((d) => sectionOf(d) === section);

  if (docs.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-stone-100 text-stone-400">
          <IconFile className="h-6 w-6" />
        </div>
        <p className="mt-3 text-sm font-medium text-stone-700">Žádné dokumenty v sekci „{DOC_SECTIONS[section]}"</p>
        <p className="mt-1 text-sm text-stone-500">
          Dokumenty do této sekce přidáte v detailu nemovitosti.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <ul className="space-y-2">
        {docs.map((doc) => (
          <DocRow key={doc.id} doc={doc} property={property} onNavigate={onNavigate} />
        ))}
      </ul>
    </div>
  );
}

// Home režim — hledání jednotlivých dokumentů
function SearchDocs({
  query,
  setQuery,
  rows,
  onNavigate,
}: {
  query: string;
  setQuery: (v: string) => void;
  rows: { doc: DocItem; property: Property }[];
  onNavigate: () => void;
}) {
  return (
    <>
      <div className="border-b border-stone-200 p-3">
        <div className="relative">
          <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Hledat dokument…"
            className="input pl-9"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {rows.length === 0 ? (
          <p className="text-sm text-stone-400">
            {query ? `Nic nenalezeno pro „${query}".` : "Zatím žádné dokumenty."}
          </p>
        ) : (
          <ul className="space-y-2">
            {rows.map(({ doc, property }) => (
              <DocRow key={doc.id} doc={doc} property={property} showProperty onNavigate={onNavigate} />
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

function DocRow({
  doc,
  property,
  showProperty = false,
  onNavigate,
}: {
  doc: DocItem;
  property: Property;
  showProperty?: boolean;
  onNavigate: () => void;
}) {
  const sub = showProperty
    ? `${DOCUMENT_CATEGORIES[doc.category]} · ${property.name}`
    : (doc.fileName ?? DOCUMENT_CATEGORIES[doc.category]);

  const body = (
    <>
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-teal-50 text-teal-700">
        <IconFile className="h-4 w-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-stone-800">{doc.title}</span>
        <span className="block truncate text-xs text-stone-400">{sub}</span>
      </span>
      {doc.dataUrl && <IconDownload className="h-4 w-4 shrink-0 text-stone-400" />}
    </>
  );

  const cls =
    "flex items-center gap-3 rounded-lg border border-stone-200 px-3 py-2.5 transition hover:bg-stone-50";

  // Když máme nahraný soubor, otevřeme ho; jinak odkážeme na detail nemovitosti.
  if (doc.dataUrl) {
    return (
      <li>
        <a href={doc.dataUrl} download={doc.fileName} target="_blank" rel="noreferrer" className={cls}>
          {body}
        </a>
      </li>
    );
  }
  return (
    <li>
      <Link href={`/nemovitost/${property.id}`} onClick={onNavigate} className={cls}>
        {body}
      </Link>
    </li>
  );
}
