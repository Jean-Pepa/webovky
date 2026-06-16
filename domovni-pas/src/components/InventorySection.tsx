"use client";

import Link from "next/link";
import { useStore, type InventoryItem } from "@/lib/store";
import { formatCurrency, formatDate } from "@/lib/format";
import { IconBox, IconPlus, IconTrash, IconExternal, IconDownload } from "@/components/Icons";

function warrantyInfo(it: InventoryItem) {
  if (!it.warrantyUntil) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expired = new Date(`${it.warrantyUntil}T00:00:00`) < today;
  return {
    expired,
    label: expired
      ? `Záruka skončila ${formatDate(it.warrantyUntil)}`
      : `Záruka do ${formatDate(it.warrantyUntil)}`,
  };
}

export function InventorySection({
  propertyId,
  inventory,
  editable = true,
}: {
  propertyId: string;
  inventory: InventoryItem[];
  editable?: boolean;
}) {
  const { deleteInventoryItem } = useStore();

  const groups = new Map<string, InventoryItem[]>();
  for (const item of inventory) {
    const loc = item.location?.trim() || "Ostatní";
    groups.set(loc, [...(groups.get(loc) ?? []), item]);
  }
  const groupList = [...groups.entries()];

  return (
    <section className="mt-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <IconBox className="h-5 w-5 text-teal-700" />
          <h2 className="text-lg font-semibold text-stone-900">Vybavení a materiály</h2>
        </div>
        {editable && (
          <Link href={`/nemovitost/${propertyId}/vybaveni/nove`} className="btn-primary btn-sm">
            <IconPlus className="h-4 w-4" />
            Přidat položku
          </Link>
        )}
      </div>
      <p className="mt-1 text-sm text-stone-500">
        „Co je v mém domě" — baterie, spotřebiče, podlahy… s cenou, zárukou a doklady.
      </p>

      {inventory.length === 0 ? (
        <div className="card mt-4 flex flex-col items-center px-6 py-10 text-center">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-teal-50 text-teal-700">
            <IconBox className="h-6 w-6" />
          </div>
          <p className="mt-3 text-sm font-medium text-stone-800">Zatím žádné vybavení</p>
          <p className="mt-1 max-w-xs text-sm text-stone-500">
            Přidejte třeba kotel, baterii nebo podlahu — ať víte, co kde je, dokdy platí záruka a kde
            je faktura.
          </p>
          {editable && (
            <Link
              href={`/nemovitost/${propertyId}/vybaveni/nove`}
              className="btn-primary btn-sm mt-5"
            >
              <IconPlus className="h-4 w-4" />
              Přidat položku
            </Link>
          )}
        </div>
      ) : (
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          {groupList.map(([loc, items]) => (
            <div key={loc} className="card p-5">
              <h3 className="text-sm font-semibold text-stone-900">{loc}</h3>
              <ul className="mt-2 divide-y divide-stone-100">
                {items.map((it) => {
                  const w = warrantyInfo(it);
                  return (
                    <li key={it.id} className="py-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-stone-800">{it.name}</p>
                          {it.brand && <p className="text-xs text-stone-400">{it.brand}</p>}
                        </div>
                        {editable && (
                          <button
                            onClick={() => {
                              if (confirm("Smazat položku vybavení?"))
                                deleteInventoryItem(propertyId, it.id);
                            }}
                            className="btn-ghost btn-sm shrink-0 text-stone-400 hover:text-red-600"
                            aria-label="Smazat"
                          >
                            <IconTrash className="h-4 w-4" />
                          </button>
                        )}
                      </div>

                      <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                        {it.price != null && (
                          <span className="font-medium text-stone-700">{formatCurrency(it.price)}</span>
                        )}
                        {w && (
                          <span className={w.expired ? "text-stone-400" : "text-emerald-700"}>
                            {w.label}
                          </span>
                        )}
                        {it.productUrl && (
                          <a
                            href={it.productUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-teal-700 hover:underline"
                          >
                            <IconExternal className="h-3.5 w-3.5" />
                            Produkt
                          </a>
                        )}
                        {it.dataUrl && (
                          <a
                            href={it.dataUrl}
                            download={it.fileName ?? it.name}
                            className="inline-flex items-center gap-1 text-teal-700 hover:underline"
                          >
                            <IconDownload className="h-3.5 w-3.5" />
                            Doklad
                          </a>
                        )}
                      </div>

                      {it.note && <p className="mt-1 text-xs text-stone-500">{it.note}</p>}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
