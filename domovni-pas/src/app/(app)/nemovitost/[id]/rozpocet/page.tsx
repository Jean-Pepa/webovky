"use client";

import Link from "next/link";
import { useState } from "react";
import { useParams } from "next/navigation";
import { useStore } from "@/lib/store";
import { canSeeProperty, canEditProperty } from "@/lib/access";
import { Loading } from "@/components/Loading";
import { BackLink } from "@/components/BackLink";
import { PrintButton } from "@/components/ui/PrintButton";
import { fileToDataUrl } from "@/lib/media";
import { COST_CATEGORIES } from "@/lib/enums";
import { formatCurrency, formatDateShort } from "@/lib/format";
import { IconMoney, IconPlus, IconTrash, IconFile, IconSparkles } from "@/components/Icons";

export default function BudgetPage() {
  const { id } = useParams<{ id: string }>();
  const { getProperty, hydrated, role, addCost, deleteCost } = useStore();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  if (!hydrated) return <Loading />;

  const property = getProperty(id);
  if (!property || (role && !canSeeProperty(property, role))) {
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
  const costs = [...(property.costs ?? [])].sort((a, b) => b.date.localeCompare(a.date));
  const total = costs.reduce((s, c) => s + (c.amount || 0), 0);
  const withInvoice = costs.filter((c) => c.invoiceUrl || c.invoiceName).length;

  // Součty podle kategorie
  const byCat = new Map<string, number>();
  for (const c of costs) {
    const key = c.category || "OSTATNI";
    byCat.set(key, (byCat.get(key) ?? 0) + (c.amount || 0));
  }
  const catRows = [...byCat.entries()].sort((a, b) => b[1] - a[1]);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const title = String(fd.get("title") || "").trim();
    const amount = Number(String(fd.get("amount") || "").replace(/\s/g, ""));
    const date = String(fd.get("date") || "");
    if (!title || !amount || !date) return;

    setBusy(true);
    const file = fd.get("invoice");
    let invoiceName: string | undefined;
    let invoiceUrl: string | undefined;
    if (file instanceof File && file.size > 0) {
      invoiceName = file.name;
      invoiceUrl = await fileToDataUrl(file);
    }
    addCost(id, {
      title,
      category: String(fd.get("category") || "OSTATNI"),
      amount,
      date,
      supplier: String(fd.get("supplier") || "").trim() || undefined,
      note: String(fd.get("note") || "").trim() || undefined,
      invoiceName,
      invoiceUrl,
    });
    form.reset();
    setBusy(false);
    setOpen(false);
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="no-print flex items-center justify-between">
        <BackLink href={`/nemovitost/${id}`}>Zpět na nemovitost</BackLink>
        <PrintButton />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-teal-50 text-teal-700">
            <IconMoney className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-stone-900">
              Náklady stavby
            </h1>
            <p className="text-sm text-stone-500">{property.name}</p>
          </div>
        </div>
        {editable && (
          <button onClick={() => setOpen((o) => !o)} className="btn-primary btn-sm no-print">
            <IconPlus className="h-4 w-4" />
            Přidat náklad
          </button>
        )}
      </div>

      {/* Souhrn */}
      <div className="mt-6 grid grid-cols-3 gap-3">
        <Stat label="Celkem" value={formatCurrency(total)} />
        <Stat label="Položek" value={String(costs.length)} />
        <Stat label="S fakturou" value={`${withInvoice}/${costs.length}`} />
      </div>

      {/* Formulář */}
      {editable && open && (
        <form onSubmit={submit} className="card mt-4 space-y-3 p-5">
          <div>
            <label className="label" htmlFor="title">Co to bylo *</label>
            <input id="title" name="title" required className="input" placeholder="Např. Rekonstrukce koupelny – obklady" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="amount">Částka (Kč) *</label>
              <input id="amount" name="amount" type="number" required className="input" placeholder="124000" />
            </div>
            <div>
              <label className="label" htmlFor="date">Datum *</label>
              <input id="date" name="date" type="date" required className="input" />
            </div>
            <div>
              <label className="label" htmlFor="category">Kategorie</label>
              <select id="category" name="category" className="input" defaultValue="PRACE">
                {Object.entries(COST_CATEGORIES).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="supplier">Dodavatel</label>
              <input id="supplier" name="supplier" className="input" placeholder="Firma / kdo" />
            </div>
          </div>
          <div>
            <label className="label" htmlFor="invoice">Faktura (PDF / foto)</label>
            <input
              id="invoice"
              name="invoice"
              type="file"
              accept="image/*,application/pdf"
              className="block w-full text-sm text-stone-600 file:mr-3 file:rounded-lg file:border-0 file:bg-teal-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-teal-700 hover:file:bg-teal-100"
            />
          </div>
          <div>
            <label className="label" htmlFor="note">Poznámka</label>
            <input id="note" name="note" className="input" />
          </div>
          <button type="submit" className="btn-secondary w-full" disabled={busy}>
            {busy ? "Ukládám…" : "Uložit náklad"}
          </button>
        </form>
      )}

      {/* Součty podle kategorie */}
      {catRows.length > 0 && (
        <section className="card mt-4 p-5">
          <h2 className="text-sm font-semibold text-stone-900">Podle kategorie</h2>
          <ul className="mt-2 divide-y divide-stone-100">
            {catRows.map(([cat, sum]) => (
              <li key={cat} className="flex items-center justify-between py-2 text-sm">
                <span className="text-stone-600">{COST_CATEGORIES[cat] ?? cat}</span>
                <span className="font-medium text-stone-800">{formatCurrency(sum)}</span>
              </li>
            ))}
            <li className="flex items-center justify-between py-2 text-sm font-semibold">
              <span className="text-stone-800">Celkem</span>
              <span className="text-teal-700">{formatCurrency(total)}</span>
            </li>
          </ul>
        </section>
      )}

      {/* Databáze nákladů */}
      <section className="card mt-4 p-5">
        <h2 className="text-sm font-semibold text-stone-900">Databáze nákladů</h2>
        {costs.length === 0 ? (
          <p className="mt-2 text-sm text-stone-500">
            Zatím žádné náklady. Přidávejte jednotlivé položky a připojujte k nim faktury.
          </p>
        ) : (
          <ul className="mt-2 divide-y divide-stone-100">
            {costs.map((c) => (
              <li key={c.id} className="flex items-start justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-stone-800">{c.title}</p>
                  <p className="mt-0.5 text-xs text-stone-400">
                    {formatDateShort(c.date)} · {COST_CATEGORIES[c.category ?? "OSTATNI"] ?? c.category}
                    {c.supplier ? ` · ${c.supplier}` : ""}
                  </p>
                  {(c.invoiceUrl || c.invoiceName) && (
                    <span className="mt-1 inline-flex items-center gap-1.5 text-xs">
                      {c.invoiceUrl ? (
                        <a
                          href={c.invoiceUrl}
                          download={c.invoiceName}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-teal-700 hover:underline"
                        >
                          <IconFile className="h-3.5 w-3.5" />
                          {c.invoiceName || "Faktura"}
                        </a>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-stone-400">
                          <IconFile className="h-3.5 w-3.5" />
                          {c.invoiceName}
                        </span>
                      )}
                    </span>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="text-sm font-semibold text-stone-900">{formatCurrency(c.amount)}</span>
                  {editable && (
                    <button
                      onClick={() => {
                        if (confirm("Smazat náklad?")) deleteCost(id, c.id);
                      }}
                      className="btn-ghost btn-sm text-stone-400 hover:text-red-600"
                      aria-label="Smazat"
                    >
                      <IconTrash className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* AI připravenost */}
      <div className="mt-4 flex items-start gap-3 rounded-xl bg-teal-50 p-4 text-sm text-teal-900 no-print">
        <IconSparkles className="mt-0.5 h-5 w-5 shrink-0 text-teal-700" />
        <p>
          <strong>Brzy s AI:</strong> nahrané faktury projde AI, sama z nich vyčte částky, zařadí je
          do kategorií a vše sečte — stačí připojit API klíč. Databáze nákladů je na to připravená.
        </p>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card p-4">
      <p className="truncate text-lg font-semibold text-stone-900">{value}</p>
      <p className="mt-0.5 text-xs text-stone-500">{label}</p>
    </div>
  );
}
