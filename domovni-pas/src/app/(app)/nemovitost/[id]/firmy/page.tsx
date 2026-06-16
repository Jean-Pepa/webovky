"use client";

import Link from "next/link";
import { useState } from "react";
import { useParams } from "next/navigation";
import { useStore, type BidStatus } from "@/lib/store";
import { canSeeProperty } from "@/lib/access";
import { Loading } from "@/components/Loading";
import { BackLink } from "@/components/BackLink";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/format";
import { IconWrench, IconPlus, IconTrash, IconCheck, IconClose } from "@/components/Icons";
import type { BadgeColor } from "@/lib/enums";

const STATUS_META: Record<BidStatus, { label: string; color: BadgeColor }> = {
  REQUESTED: { label: "Poptáno", color: "gray" },
  RECEIVED: { label: "Nabídka", color: "blue" },
  SELECTED: { label: "Vybráno", color: "emerald" },
  REJECTED: { label: "Zamítnuto", color: "red" },
};

function Stars({ n }: { n?: number }) {
  if (!n) return <span className="text-stone-400">—</span>;
  return (
    <span className="text-amber-500">
      {"★".repeat(n)}
      <span className="text-stone-300">{"★".repeat(Math.max(0, 5 - n))}</span>
    </span>
  );
}

export default function FirmyPage() {
  const { id } = useParams<{ id: string }>();
  const { getProperty, hydrated, role, addBid, deleteBid, setBidStatus } = useStore();
  const [open, setOpen] = useState(false);

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

  const bids = property.bids ?? [];
  const priced = bids.filter((b) => b.price != null).map((b) => b.price!);
  const minPrice = priced.length ? Math.min(...priced) : null;
  const selected = bids.find((b) => b.status === "SELECTED");

  const sorted = [...bids].sort((a, b) => {
    if ((a.status === "SELECTED") !== (b.status === "SELECTED")) return a.status === "SELECTED" ? -1 : 1;
    return (a.price ?? Infinity) - (b.price ?? Infinity);
  });

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const company = String(fd.get("company") || "").trim();
    if (!company) return;
    const num = (k: string) => {
      const v = String(fd.get(k) || "").replace(/\s/g, "");
      return v ? Number(v) : undefined;
    };
    addBid(id, {
      company,
      contact: String(fd.get("contact") || "").trim() || undefined,
      price: num("price"),
      durationWeeks: num("durationWeeks"),
      rating: num("rating"),
      note: String(fd.get("note") || "").trim() || undefined,
    });
    form.reset();
    setOpen(false);
  }

  return (
    <div className="mx-auto max-w-3xl">
      <BackLink href={`/nemovitost/${id}`}>Zpět na nemovitost</BackLink>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-teal-50 text-teal-700">
            <IconWrench className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-stone-900">
              Výběr stavební firmy
            </h1>
            <p className="text-sm text-stone-500">{property.name}</p>
          </div>
        </div>
        <button onClick={() => setOpen((o) => !o)} className="btn-primary btn-sm">
          <IconPlus className="h-4 w-4" />
          Přidat nabídku
        </button>
      </div>

      {bids.length > 0 && (
        <div className="mt-6 grid grid-cols-3 gap-3">
          <Stat label="Nabídek" value={String(bids.length)} />
          <Stat label="Nejnižší cena" value={minPrice != null ? formatCurrency(minPrice) : "—"} />
          <Stat label="Vybraná firma" value={selected ? selected.company : "—"} />
        </div>
      )}

      {open && (
        <form onSubmit={submit} className="card mt-4 space-y-3 p-5">
          <div>
            <label className="label" htmlFor="company">Firma *</label>
            <input id="company" name="company" required className="input" placeholder="Např. Stavby Novák s.r.o." />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="contact">Kontakt</label>
              <input id="contact" name="contact" className="input" placeholder="Telefon / e-mail" />
            </div>
            <div>
              <label className="label" htmlFor="price">Nabídková cena (Kč)</label>
              <input id="price" name="price" type="number" className="input" placeholder="9500000" />
            </div>
            <div>
              <label className="label" htmlFor="durationWeeks">Doba realizace (týdny)</label>
              <input id="durationWeeks" name="durationWeeks" type="number" className="input" placeholder="52" />
            </div>
            <div>
              <label className="label" htmlFor="rating">Hodnocení</label>
              <select id="rating" name="rating" className="input" defaultValue="">
                <option value="">—</option>
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>{"★".repeat(n)}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="label" htmlFor="note">Poznámka</label>
            <textarea id="note" name="note" className="input min-h-20" placeholder="Reference, podmínky, dojem z jednání…" />
          </div>
          <button type="submit" className="btn-secondary w-full">Uložit nabídku</button>
        </form>
      )}

      {sorted.length === 0 ? (
        <div className="card mt-6 flex flex-col items-center px-6 py-12 text-center">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-teal-50 text-teal-700">
            <IconWrench className="h-6 w-6" />
          </div>
          <p className="mt-4 text-sm font-medium text-stone-800">Zatím žádné nabídky</p>
          <p className="mt-1 max-w-sm text-sm text-stone-500">
            Přidávejte nabídky stavebních firem a porovnejte cenu, termín a hodnocení.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {sorted.map((bid) => (
            <div
              key={bid.id}
              className={`card p-5 ${bid.status === "SELECTED" ? "border-emerald-300 ring-1 ring-emerald-200" : ""}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-stone-900">{bid.company}</h3>
                    <Badge color={STATUS_META[bid.status].color}>{STATUS_META[bid.status].label}</Badge>
                    {bid.price != null && bid.price === minPrice && (
                      <Badge color="teal">Nejnižší cena</Badge>
                    )}
                  </div>
                  {bid.contact && <p className="mt-0.5 text-xs text-stone-400">{bid.contact}</p>}
                </div>
                <button
                  onClick={() => {
                    if (confirm("Smazat nabídku?")) deleteBid(id, bid.id);
                  }}
                  className="btn-ghost btn-sm shrink-0 text-stone-400 hover:text-red-600"
                  aria-label="Smazat"
                >
                  <IconTrash className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-3 border-t border-stone-100 pt-3 text-sm">
                <div>
                  <p className="text-xs text-stone-400">Cena</p>
                  <p className="font-semibold text-stone-900">
                    {bid.price != null ? formatCurrency(bid.price) : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-stone-400">Termín</p>
                  <p className="font-medium text-stone-700">
                    {bid.durationWeeks ? `${bid.durationWeeks} týdnů` : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-stone-400">Hodnocení</p>
                  <p className="font-medium"><Stars n={bid.rating} /></p>
                </div>
              </div>

              {bid.note && <p className="mt-3 text-sm leading-relaxed text-stone-600">{bid.note}</p>}

              <div className="mt-3 flex flex-wrap gap-2 border-t border-stone-100 pt-3">
                {bid.status !== "SELECTED" ? (
                  <button onClick={() => setBidStatus(id, bid.id, "SELECTED")} className="btn-secondary btn-sm">
                    <IconCheck className="h-4 w-4" />
                    Vybrat
                  </button>
                ) : (
                  <button onClick={() => setBidStatus(id, bid.id, "RECEIVED")} className="btn-ghost btn-sm text-stone-500">
                    Zrušit výběr
                  </button>
                )}
                {bid.status !== "REJECTED" ? (
                  <button onClick={() => setBidStatus(id, bid.id, "REJECTED")} className="btn-ghost btn-sm text-stone-500">
                    <IconClose className="h-4 w-4" />
                    Zamítnout
                  </button>
                ) : (
                  <button onClick={() => setBidStatus(id, bid.id, "RECEIVED")} className="btn-ghost btn-sm text-stone-500">
                    Obnovit
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="mt-6 text-center text-xs text-stone-400">
        Evidence a porovnání nabídek dodavatelů — pro snadné rozhodnutí při výběru firmy.
      </p>
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
