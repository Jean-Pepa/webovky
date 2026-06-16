"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Loading } from "@/components/Loading";
import { Badge } from "@/components/ui/Badge";
import { PROPERTY_TYPES } from "@/lib/enums";
import { addressLine } from "@/lib/format";
import { IconSearch } from "@/components/Icons";

export default function SearchPage() {
  const { properties, hydrated, role } = useStore();
  const router = useRouter();
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (hydrated && role && role !== "CREATOR") router.replace("/prehled");
  }, [hydrated, role, router]);

  const q = query.trim().toLowerCase();

  const results = useMemo(() => {
    if (q.length < 2) return [];
    const has = (s?: string | number) =>
      s !== undefined && s !== null && String(s).toLowerCase().includes(q);

    return properties
      .map((p) => {
        const fields: string[] = [];
        if (has(p.name)) fields.push("název");
        if (has(p.ownerName)) fields.push("vlastník");
        if ([p.investor, p.architect].some(has)) fields.push("kontakty");
        if ([p.street, p.city, p.zip, p.cadastralArea, p.parcelNumber].some(has)) fields.push("adresa");
        if (has(p.description)) fields.push("popis");

        const entryHits = p.entries.filter((e) => has(e.title) || has(e.description)).length;
        const docHits = p.documents.filter((d) => has(d.title)).length;
        const invHits = p.inventory.filter(
          (i) => has(i.name) || has(i.brand) || has(i.location) || has(i.note),
        ).length;

        const total = fields.length + entryHits + docHits + invHits;
        return { p, fields, entryHits, docHits, invHits, total };
      })
      .filter((r) => r.total > 0)
      .sort((a, b) => b.total - a.total);
  }, [properties, q]);

  if (!hydrated) return <Loading />;
  if (role !== "CREATOR") return <Loading label="Přesměrování…" />;

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-stone-900">Hledat</h1>
      <p className="mt-1 text-sm text-stone-500">
        Prohledejte všechny nemovitosti — názvy, vlastníky, adresy, záznamy, dokumenty i vybavení.
      </p>

      <div className="relative mt-5">
        <IconSearch className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />
        <input
          autoFocus
          className="input pl-11"
          placeholder="Hledat napříč nemovitostmi…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {q.length < 2 ? (
        <p className="mt-6 text-sm text-stone-400">Zadejte alespoň 2 znaky.</p>
      ) : results.length === 0 ? (
        <div className="card mt-6 px-6 py-12 text-center">
          <p className="text-sm font-medium text-stone-800">Nic nenalezeno</p>
          <p className="mt-1 text-sm text-stone-500">
            Pro „{query}" nemáme žádnou shodu napříč nemovitostmi.
          </p>
        </div>
      ) : (
        <>
          <p className="mt-6 text-xs font-medium text-stone-400">
            {results.length} {results.length === 1 ? "výsledek" : results.length <= 4 ? "výsledky" : "výsledků"}
          </p>
          <ul className="mt-2 space-y-2">
            {results.map(({ p, fields, entryHits, docHits, invHits }) => {
              const chips = [
                ...fields,
                entryHits ? `${entryHits} záznam${entryHits === 1 ? "" : "ů"}` : null,
                docHits ? `${docHits} dokument${docHits === 1 ? "" : "ů"}` : null,
                invHits ? `${invHits} vybavení` : null,
              ].filter(Boolean) as string[];
              return (
                <li key={p.id}>
                  <Link
                    href={`/nemovitost/${p.id}`}
                    className="card flex items-start justify-between gap-3 p-4 transition hover:border-teal-300 hover:shadow-sm"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-sm font-medium text-stone-900">{p.name}</p>
                        <Badge color="teal">{PROPERTY_TYPES[p.type]}</Badge>
                      </div>
                      <p className="mt-0.5 truncate text-xs text-stone-400">
                        {p.ownerName} · {addressLine(p)}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {chips.map((c) => (
                          <span
                            key={c}
                            className="rounded-full bg-stone-100 px-2 py-0.5 text-[11px] font-medium text-stone-500"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}
