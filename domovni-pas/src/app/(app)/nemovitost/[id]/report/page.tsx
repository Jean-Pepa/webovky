"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useStore, type InventoryItem } from "@/lib/store";
import { Loading } from "@/components/Loading";
import { BackLink } from "@/components/BackLink";
import { PrintButton } from "@/components/ui/PrintButton";
import { Logo } from "@/components/Logo";
import { Badge } from "@/components/ui/Badge";
import { EntryCard } from "@/components/EntryCard";
import { PROPERTY_TYPES, ENTRY_TYPES, DOCUMENT_CATEGORIES } from "@/lib/enums";
import { addressLine, formatCurrency, formatDate } from "@/lib/format";

export default function ReportPage() {
  const { id } = useParams<{ id: string }>();
  const { getProperty, hydrated, branding } = useStore();
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

  const entries = [...property.entries].sort((a, b) => b.date.localeCompare(a.date));
  const totalCost = property.entries.reduce((s, e) => s + (e.cost ?? 0), 0);
  const age = property.yearBuilt ? new Date().getFullYear() - property.yearBuilt : null;

  // Náklady podle kategorie
  const costByType = new Map<string, number>();
  for (const e of property.entries) {
    if (e.cost) costByType.set(e.type, (costByType.get(e.type) ?? 0) + e.cost);
  }
  const costRows = [...costByType.entries()].sort((a, b) => b[1] - a[1]);

  // Fotogalerie napříč záznamy
  const photos = property.entries.flatMap((e) =>
    e.media.filter((m) => m.kind === "image" && m.dataUrl),
  );

  const inventoryGroups = (() => {
    const m = new Map<string, InventoryItem[]>();
    for (const it of property.inventory) {
      const loc = it.location?.trim() || "Ostatní";
      m.set(loc, [...(m.get(loc) ?? []), it]);
    }
    return [...m.entries()];
  })();

  return (
    <div className="mx-auto max-w-3xl">
      <div className="no-print mb-6 flex items-center justify-between">
        <BackLink href={`/nemovitost/${id}`}>Zpět na nemovitost</BackLink>
        <PrintButton />
      </div>

      <div className="card print-clean p-8">
        <div
          className="-mx-8 -mt-8 mb-6 h-1.5 rounded-t-2xl bg-brass"
          style={branding.color ? { backgroundColor: branding.color } : undefined}
        />
        {/* Hlavička */}
        <div className="flex items-start justify-between border-b border-stone-200 pb-5">
          <div>
            <Logo />
            {branding.studioName && (
              <p className="mt-1 text-sm font-semibold" style={{ color: branding.color }}>
                {branding.studioName}
              </p>
            )}
            {branding.tagline && <p className="text-xs text-stone-400">{branding.tagline}</p>}
          </div>
          <div className="text-right text-sm text-stone-400">
            <p
              className="font-medium text-brass"
              style={branding.color ? { color: branding.color } : undefined}
            >
              Historie nemovitosti
            </p>
            <p>Vygenerováno {formatDate(new Date())}</p>
          </div>
        </div>

        {/* Identifikace */}
        <div className="mt-6">
          <Badge color="teal">{PROPERTY_TYPES[property.type]}</Badge>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900">
            {property.name}
          </h1>
          <p className="mt-1 text-stone-500">{addressLine(property)}</p>
        </div>

        {/* Souhrn */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Summary label="Stáří" value={age != null ? `${age} let` : "—"} />
          <Summary label="Záznamů" value={String(property.entries.length)} />
          <Summary label="Dokumentů" value={String(property.documents.length)} />
          <Summary label="Náklady celkem" value={totalCost > 0 ? formatCurrency(totalCost) : "—"} />
        </div>

        {property.description && (
          <p className="mt-4 rounded-lg bg-stone-50 p-4 text-sm leading-relaxed text-stone-600">
            {property.description}
          </p>
        )}

        <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-3">
          {property.cadastralArea && <Fact label="Katastrální území" value={property.cadastralArea} />}
          {property.parcelNumber && <Fact label="Parcela / č. popisné" value={property.parcelNumber} />}
          {property.yearBuilt && <Fact label="Rok výstavby" value={String(property.yearBuilt)} />}
          <Fact label="Vlastník" value={property.ownerName} />
        </dl>

        {(property.investor ||
          property.architect ||
          property.floorArea != null ||
          property.energyClass ||
          property.contractors) && (
          <>
            <h2 className="mt-8 text-lg font-semibold text-stone-900">Projektová karta</h2>
            <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-3">
              {property.investor && <Fact label="Investor" value={property.investor} />}
              {property.architect && <Fact label="Architekt" value={property.architect} />}
              {property.floorArea != null && (
                <Fact label="Plocha" value={`${property.floorArea} m²`} />
              )}
              {property.energyClass && (
                <Fact label="Energetická třída" value={property.energyClass} />
              )}
            </dl>
            {property.contractors && (
              <div className="mt-3 text-sm">
                <p className="text-xs text-stone-400">Kontakty na dodavatele</p>
                <ul className="mt-1 space-y-0.5 text-stone-700">
                  {property.contractors
                    .split("\n")
                    .map((l) => l.trim())
                    .filter(Boolean)
                    .map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                </ul>
              </div>
            )}
          </>
        )}

        {/* Náklady podle kategorie */}
        {costRows.length > 0 && (
          <>
            <h2 className="mt-8 text-lg font-semibold text-stone-900">Náklady podle kategorie</h2>
            <ul className="mt-3 divide-y divide-stone-100">
              {costRows.map(([type, total]) => (
                <li key={type} className="flex justify-between py-2 text-sm">
                  <span className="text-stone-600">{ENTRY_TYPES[type] ?? type}</span>
                  <span className="font-medium text-stone-800">{formatCurrency(total)}</span>
                </li>
              ))}
              <li className="flex justify-between py-2 text-sm font-semibold">
                <span className="text-stone-800">Celkem</span>
                <span className="text-teal-700">{formatCurrency(totalCost)}</span>
              </li>
            </ul>
          </>
        )}

        {/* Časová osa */}
        <h2 className="mt-8 text-lg font-semibold text-stone-900">Časová osa</h2>
        {entries.length === 0 ? (
          <p className="mt-3 text-sm text-stone-500">Zatím nebyl zaznamenán žádný záznam.</p>
        ) : (
          <ol className="mt-5 space-y-4 border-l-2 border-stone-200 pl-7">
            {entries.map((entry) => (
              <EntryCard key={entry.id} entry={entry} />
            ))}
          </ol>
        )}

        {/* Fotogalerie */}
        {photos.length > 0 && (
          <>
            <h2 className="mt-8 text-lg font-semibold text-stone-900">Fotogalerie</h2>
            <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
              {photos.map((m) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={m.id}
                  src={m.dataUrl}
                  alt={m.name}
                  className="h-28 w-full rounded-lg border border-stone-200 object-cover"
                />
              ))}
            </div>
          </>
        )}

        {/* Dokumenty */}
        {property.documents.length > 0 && (
          <>
            <h2 className="mt-8 text-lg font-semibold text-stone-900">Dokumenty</h2>
            <ul className="mt-3 space-y-1.5 text-sm">
              {property.documents.map((doc) => (
                <li key={doc.id} className="flex justify-between gap-3">
                  <span className="text-stone-700">{doc.title}</span>
                  <span className="shrink-0 text-stone-400">
                    {DOCUMENT_CATEGORIES[doc.category] ?? DOCUMENT_CATEGORIES.OTHER}
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}

        {property.inventory.length > 0 && (
          <>
            <h2 className="mt-8 text-lg font-semibold text-stone-900">Vybavení a materiály</h2>
            {inventoryGroups.map(([loc, items]) => (
              <div key={loc} className="mt-3">
                <h3 className="text-sm font-semibold text-stone-700">{loc}</h3>
                <ul className="mt-1 divide-y divide-stone-100 text-sm">
                  {items.map((it) => (
                    <li key={it.id} className="flex justify-between gap-3 py-1.5">
                      <span className="text-stone-700">
                        {it.name}
                        {it.brand ? ` · ${it.brand}` : ""}
                      </span>
                      <span className="shrink-0 text-stone-400">
                        {[
                          it.price != null ? formatCurrency(it.price) : null,
                          it.warrantyUntil ? `záruka do ${formatDate(it.warrantyUntil)}` : null,
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </>
        )}

        {property.transfers.length > 0 && (
          <>
            <h2 className="mt-8 text-lg font-semibold text-stone-900">Historie převodů</h2>
            <ul className="mt-3 space-y-1.5 text-sm">
              {property.transfers.map((t) => (
                <li key={t.id} className="flex justify-between gap-3">
                  <span className="text-stone-700">
                    {t.fromName} → {t.toName}
                  </span>
                  <span className="shrink-0 text-stone-400">{formatDate(t.date)}</span>
                </li>
              ))}
            </ul>
          </>
        )}

        <p className="mt-10 border-t border-stone-200 pt-4 text-center text-xs text-stone-400">
          Tento report byl vygenerován z aplikace BULO — trvalého záznamu historie nemovitosti.
        </p>
      </div>
    </div>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-stone-50 p-4 text-center">
      <p className="text-xl font-semibold text-stone-900">{value}</p>
      <p className="mt-0.5 text-xs text-stone-500">{label}</p>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-stone-400">{label}</dt>
      <dd className="font-medium text-stone-800">{value}</dd>
    </div>
  );
}
