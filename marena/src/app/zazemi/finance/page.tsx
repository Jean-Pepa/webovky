"use client";

import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { fmtCZK, fmtDate, fmtDateTime, todayISO } from "@/lib/format";
import { DeleteButton } from "@/components/DeleteButton";
import { Icon } from "@/components/Icons";
import { Modal } from "@/components/Modal";
import { isAdmin } from "@/lib/admin";
import { compressImage, saveReceipt, loadReceipt, deleteReceipt } from "@/lib/receipts";
import { uid } from "@/lib/id";
import type { FinanceItem, FinanceKind, Cashbox, Contribution } from "@/lib/types";

const CATEGORIES = [
  "vklad",
  "kasa",
  "bar",
  "lístky",
  "výzdoba",
  "přednášející",
  "merch",
  "sponzoring",
  "nákup",
  "Fléda",
  "doprava",
  "ostatní",
];

type Filter = "vse" | "prijem" | "vydaj" | "nezaplaceno";

function parseAmount(s: string): number {
  const n = Number(s.replace(/\s/g, "").replace(",", "."));
  return Number.isFinite(n) ? Math.round(n) : 0;
}

// DPH 21 % (ČR). „s DPH" = reálná hotovost (amount). „bez DPH" = net.
const DPH_RATE = 0.21;
const grossFromNet = (net: number) => Math.round(net * (1 + DPH_RATE));
const netFromGross = (gross: number) => Math.round(gross / (1 + DPH_RATE));
type VatMode = "incl" | "none"; // s DPH / bez DPH

function receiptsOf(item: FinanceItem): string[] {
  if (item.receiptIds && item.receiptIds.length) return item.receiptIds;
  return item.receiptId ? [item.receiptId] : [];
}

export default function FinancePage() {
  const { currentYear, me, dispatch, canEditCurrentYear } = useStore();
  const [open, setOpen] = useState(false);
  const [kasaOpen, setKasaOpen] = useState(false);
  const [filter, setFilter] = useState<Filter>("vse");
  const [catFilter, setCatFilter] = useState<string>("");

  // Výběr (vklady) – rychlé přidání přispěvatele.
  const [ctName, setCtName] = useState("");
  const [ctAmount, setCtAmount] = useState("");

  const [kind, setKind] = useState<FinanceKind>("vydaj");
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [who, setWho] = useState("");
  const [date, setDate] = useState(todayISO());
  const [paid, setPaid] = useState(true);
  const [vatMode, setVatMode] = useState<VatMode>("incl");

  const year = currentYear;

  const items = useMemo(() => year?.finances ?? [], [year]);
  const contributions = useMemo(() => year?.contributions ?? [], [year]);

  // Výběr: kolik je aktuálně v balíku (nevrácené) a kolik se už vrátilo.
  const vyber = useMemo(() => {
    let inPool = 0,
      returned = 0;
    for (const c of contributions) {
      if (c.returned) returned += c.amount;
      else inPool += c.amount;
    }
    return { inPool, returned, total: inPool + returned };
  }, [contributions]);

  const totals = useMemo(() => {
    let prijmy = 0,
      vydaje = 0,
      vybrano = 0,
      zaplaceno = 0,
      otevreno = 0;
    for (const f of items) {
      if (f.kind === "prijem") {
        prijmy += f.amount;
        if (f.paid) vybrano += f.amount;
        else otevreno += f.amount;
      } else {
        vydaje += f.amount;
        if (f.paid) zaplaceno += f.amount;
        else otevreno += f.amount;
      }
    }
    // Nevrácený výběr je hotovost v balíku → příjem (a tedy i bilance).
    prijmy += vyber.inPool;
    vybrano += vyber.inPool;
    return { prijmy, vydaje, bilance: prijmy - vydaje, kasa: vybrano - zaplaceno, otevreno };
  }, [items, vyber]);

  const byCategory = useMemo(() => {
    const map = new Map<string, { prijem: number; vydaj: number }>();
    for (const f of items) {
      const key = f.category || "bez kategorie";
      const cur = map.get(key) || { prijem: 0, vydaj: 0 };
      cur[f.kind] += f.amount;
      map.set(key, cur);
    }
    return [...map.entries()].sort((a, b) => b[1].prijem + b[1].vydaj - (a[1].prijem + a[1].vydaj));
  }, [items]);

  // Merch — kolik už merch vydělal (příjmy z kategorie „merch", hlavně z vyřízených objednávek).
  const merchTotal = useMemo(
    () => items.filter((f) => f.category === "merch" && f.kind === "prijem").reduce((s, f) => s + f.amount, 0),
    [items],
  );
  // Kolik jsme do merche vložili (výdaje) a kolik se vrátilo (příjmy).
  const merchExpense = useMemo(
    () => items.filter((f) => f.category === "merch" && f.kind === "vydaj").reduce((s, f) => s + f.amount, 0),
    [items],
  );
  const merchItems = useMemo(
    () => items.filter((f) => f.category === "merch").sort((a, b) => (b.date || b.createdAt).localeCompare(a.date || a.createdAt)),
    [items],
  );

  const rows = useMemo(() => {
    return items
      .filter((f) => {
        if (filter === "prijem") return f.kind === "prijem";
        if (filter === "vydaj") return f.kind === "vydaj";
        if (filter === "nezaplaceno") return !f.paid;
        return true;
      })
      .filter((f) => (catFilter ? (f.category || "bez kategorie") === catFilter : true))
      .sort((a, b) => (b.date || b.createdAt).localeCompare(a.date || a.createdAt));
  }, [items, filter, catFilter]);

  if (!year) return null;

  // Přidávat položky i kasy může každý z aktuálního ročníku (canAdd).
  // Upravovat / mazat / přepínat zaplaceno už jen správce (canEdit).
  const canAdd = canEditCurrentYear;
  const canEdit = isAdmin(me);

  // Kasy: kolik se ráno vložilo (vklady) a kolik se vydělalo (tržba z uzavřených).
  const kasaOpenings = (year.cashboxes ?? []).reduce((s, c) => s + c.opening, 0);
  const kasaTrzba = (year.cashboxes ?? []).reduce((s, c) => s + (c.closedAt && c.closing != null ? c.closing - c.opening : 0), 0);

  async function add() {
    const num = parseAmount(amount);
    if (!label.trim() || num <= 0 || !year || !canAdd) return;
    const gross = vatMode === "none" ? grossFromNet(num) : num;
    const net = vatMode === "none" ? num : undefined;
    await dispatch({ type: "addFinance", yearId: year.id, kind, label, amount: gross, net, category: category || undefined, who: who || undefined, paid, date: date || undefined });
    setLabel("");
    setAmount("");
    setCategory("");
    setWho("");
    setPaid(true);
    setKind("vydaj");
    setVatMode("incl");
    setOpen(false);
  }

  async function addContribution() {
    const num = parseAmount(ctAmount);
    if (!ctName.trim() || num <= 0 || !year || !canAdd) return;
    await dispatch({ type: "addContribution", yearId: year.id, name: ctName.trim(), amount: num });
    setCtName("");
    setCtAmount("");
  }

  return (
    <div className="space-y-6">
      <datalist id="fin-cats">
        {CATEGORIES.map((c) => (
          <option key={c} value={c} />
        ))}
      </datalist>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Finance</h1>
        </div>
        {canAdd && (
          <div className="flex flex-wrap items-center gap-2">
            <button className="btn-secondary" onClick={() => document.getElementById("vyber")?.scrollIntoView({ behavior: "smooth" })}>
              + Výběr
            </button>
            <button className="btn-secondary" onClick={() => setKasaOpen(true)}>
              + Kasa
            </button>
            <button className="btn-primary" onClick={() => setOpen((v) => !v)}>
              {open ? "Zavřít" : "+ Přidat položku"}
            </button>
          </div>
        )}
      </div>

      {/* Kdo co smí: každý přidává, upravuje jen správce; zamčený ročník = jen náhled */}
      {!canAdd ? (
        <div className="flex items-start gap-2 rounded-2xl border border-marigold-200 bg-marigold-50 px-4 py-3 text-sm text-marigold-800">
          <Icon name="finance" className="mt-0.5 h-4 w-4 shrink-0" />
          <span>Tento ročník je uzamčený — máš jen náhled.</span>
        </div>
      ) : (
        !canEdit && (
          <div className="flex items-start gap-2 rounded-2xl border border-marigold-200 bg-marigold-50 px-4 py-3 text-sm text-marigold-800">
            <Icon name="finance" className="mt-0.5 h-4 w-4 shrink-0" />
            <span>Můžeš přidávat položky i kasy. Upravovat a mazat zapsané může jen správce.</span>
          </div>
        )
      )}

      {/* Souhrn */}
      <div className="grid gap-3 sm:grid-cols-3">
        <SummaryCard label="Příjmy" value={totals.prijmy} sub={`vybráno ${fmtCZK(totals.prijmy - itemsOpen(items, "prijem"))}`} tone="prijem" />
        <SummaryCard label="Výdaje" value={totals.vydaje} sub={`zaplaceno ${fmtCZK(totals.vydaje - itemsOpen(items, "vydaj"))}`} tone="vydaj" />
        <SummaryCard label="Bilance" value={totals.bilance} sub={`v kase ${fmtCZK(totals.kasa)} · otevřené ${fmtCZK(totals.otevreno)}`} tone="bilance" />
      </div>

      {/* Denní kasy */}
      {((year.cashboxes?.length ?? 0) > 0 || canAdd) && (
        <section className="card p-4">
          <h2 className="mb-1 flex flex-wrap items-center gap-2 font-display text-lg font-semibold">
            🧰 Denní kasy
            {(year.cashboxes?.length ?? 0) > 0 && (
              <>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-ink/[0.06] px-2.5 py-0.5 text-sm">
                  <span className="text-xs font-normal text-ink-soft">vloženo</span>
                  <span className="font-bold text-ink">{fmtCZK(kasaOpenings)}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-leaf/12 px-2.5 py-0.5 text-sm">
                  <span className="text-xs font-normal text-leaf-700">tržba</span>
                  <span className="font-bold text-leaf-700">+{fmtCZK(kasaTrzba)}</span>
                </span>
              </>
            )}
          </h2>
          <p className="mb-3 text-xs text-ink-soft">
            Ráno zapiš vklad (na vracení), večer doplň stav v kase — tržba (večer − ráno) se sama zapíše do financí.
          </p>
          {(year.cashboxes?.length ?? 0) === 0 ? (
            <p className="text-sm text-ink-soft">Zatím žádná kasa. Klikni nahoře na tlačítko + Kasa.</p>
          ) : (
            <Collapsible peekClass="max-h-[150px]" expandable={(year.cashboxes?.length ?? 0) > 1} total={year.cashboxes?.length ?? 0}>
              <div className="space-y-2">
                {[...(year.cashboxes ?? [])]
                  .sort((a, b) => b.openedAt.localeCompare(a.openedAt))
                  .map((c) => (
                    <CashboxCard key={c.id} box={c} yearId={year.id} canAdd={canAdd} canEdit={canEdit} />
                  ))}
              </div>
            </Collapsible>
          )}
        </section>
      )}

      {/* Výběr (vklady) — kdo dal kolik do společné kasy */}
      {(contributions.length > 0 || canAdd) && (
        <section id="vyber" className="card scroll-mt-20 p-4">
          <h2 className="mb-1 flex flex-wrap items-center gap-2 font-display text-lg font-semibold">
            💰 Výběr (vklady)
            {contributions.length > 0 && (
              <>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-leaf/12 px-2.5 py-0.5 text-sm">
                  <span className="text-xs font-normal text-leaf-700">v balíku</span>
                  <span className="font-bold text-leaf-700">+{fmtCZK(vyber.inPool)}</span>
                </span>
                {vyber.returned > 0 && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-ink/[0.06] px-2.5 py-0.5 text-sm">
                    <span className="text-xs font-normal text-ink-soft">vráceno</span>
                    <span className="font-bold text-ink">−{fmtCZK(vyber.returned)}</span>
                  </span>
                )}
                <span className="chip">{contributions.length}</span>
              </>
            )}
          </h2>
          <p className="mb-3 text-xs text-ink-soft">
            Zapiš, kdo dal kolik do společné kasy. Nevrácené se počítá do celkového balíku. Na konci u každého odklikni Vráceno.
          </p>
          {canAdd && (
            <div className="mb-3 flex flex-wrap gap-2">
              <input
                className="input min-w-[140px] flex-1"
                placeholder="Jméno a příjmení"
                value={ctName}
                onChange={(e) => setCtName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && document.getElementById("ct-amount")?.focus()}
              />
              <input
                id="ct-amount"
                className="input w-28"
                inputMode="numeric"
                placeholder="Částka"
                value={ctAmount}
                onChange={(e) => setCtAmount(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addContribution()}
              />
              <button className="btn-primary" onClick={addContribution} disabled={!ctName.trim() || !ctAmount.trim()}>
                + Přidat
              </button>
            </div>
          )}
          {contributions.length === 0 ? (
            <p className="text-sm text-ink-soft">Zatím nikdo. Zapiš výše, kdo dal do výběru.</p>
          ) : (
            <Collapsible peekClass="max-h-[230px]" expandable={contributions.length > 4} total={contributions.length}>
              <ul className="divide-y divide-black/[0.06]">
                {[...contributions]
                  .sort((a, b) => Number(!!a.returned) - Number(!!b.returned) || a.name.localeCompare(b.name, "cs"))
                  .map((c) => (
                    <ContributionRow key={c.id} c={c} yearId={year.id} canEdit={canEdit} />
                  ))}
              </ul>
            </Collapsible>
          )}
        </section>
      )}

      {/* Merch — samostatně (tržby/výdaje z kategorie merch) */}
      {merchItems.length > 0 && (
        <section className="card p-4">
          <h2 className="mb-3 flex flex-wrap items-center gap-2 font-display text-lg font-semibold">
            🛍️ Merch
            <span className="inline-flex items-center gap-1.5 rounded-full bg-ink/[0.06] px-2.5 py-0.5 text-sm">
              <span className="text-xs font-normal text-ink-soft">vloženo</span>
              <span className="font-bold text-ink">−{fmtCZK(merchExpense)}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-leaf/12 px-2.5 py-0.5 text-sm">
              <span className="text-xs font-normal text-leaf-700">zpátky</span>
              <span className="font-bold text-leaf-700">+{fmtCZK(merchTotal)}</span>
            </span>
          </h2>
          <Collapsible peekClass="max-h-[150px]" expandable={merchItems.length > 2} total={merchItems.length}>
            <div className="space-y-2">
              {merchItems.map((f) => (
                <div key={f.id} className="flex flex-wrap items-center gap-x-3 gap-y-0.5 rounded-xl border border-black/[0.05] bg-paper2/40 px-3 py-2 text-sm">
                  <span className="font-semibold">{f.label}</span>
                  {f.note && <span className="text-xs text-ink-soft">· {f.note}</span>}
                  <span className="text-xs text-ink-soft/70">{fmtDate(f.date || f.createdAt)}</span>
                  <span className={`ml-auto font-display font-bold ${f.kind === "prijem" ? "text-leaf-700" : "text-ink"}`}>
                    {f.kind === "prijem" ? "+" : "−"}
                    {fmtCZK(f.amount)}
                  </span>
                </div>
              ))}
            </div>
          </Collapsible>
        </section>
      )}

      <NewKasaModal open={kasaOpen} yearId={year.id} onClose={() => setKasaOpen(false)} />

      {/* Přidat */}
      {open && (
        <div className="card space-y-3 p-4">
          <div className="inline-flex rounded-full bg-paper2 p-1 text-sm">
            <button onClick={() => setKind("vydaj")} className={`rounded-full px-4 py-1.5 font-medium transition ${kind === "vydaj" ? "bg-white text-ink shadow-sm" : "text-ink-soft"}`}>
              − Výdaj
            </button>
            <button onClick={() => setKind("prijem")} className={`rounded-full px-4 py-1.5 font-medium transition ${kind === "prijem" ? "bg-white text-ink shadow-sm" : "text-ink-soft"}`}>
              + Příjem
            </button>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <input className="input sm:col-span-2" placeholder="Popis (např. Pronájem Flédy, Třídní vklad — Petra)" value={label} onChange={(e) => setLabel(e.target.value)} />
            <div className="sm:col-span-2">
              <AmountField value={amount} setValue={setAmount} vatMode={vatMode} setVatMode={setVatMode} onEnter={add} />
            </div>
            <input className="input" list="fin-cats" placeholder="Kategorie" value={category} onChange={(e) => setCategory(e.target.value)} />
            <input className="input" placeholder="Kdo / od koho (nepovinné)" value={who} onChange={(e) => setWho(e.target.value)} />
            <input type="date" className="input sm:col-span-2" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-ink-soft">
              <input type="checkbox" checked={paid} onChange={(e) => setPaid(e.target.checked)} className="h-4 w-4 accent-marigold-600" />
              {kind === "prijem" ? "Už vybráno / přišlo" : "Už zaplaceno / proplaceno"}
            </label>
            <button className="btn-primary ml-auto" onClick={add}>
              Uložit
            </button>
          </div>
        </div>
      )}

      {/* Filtr */}
      <div className="space-y-2">
      <h2 className="font-display text-lg font-semibold">Všechny finance</h2>
      <div className="flex flex-wrap items-center gap-2">
        {([
          ["vse", "Vše"],
          ["prijem", "Příjmy"],
          ["vydaj", "Výdaje"],
          ["nezaplaceno", "Nezaplacené"],
        ] as [Filter, string][]).map(([f, l]) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${filter === f ? "bg-ink text-white" : "bg-white text-ink-soft ring-1 ring-black/10 hover:bg-paper2"}`}
          >
            {l}
          </button>
        ))}
        {/* Záložky pro kategorie merch a kasa — stejný vzhled jako ostatní */}
        {([
          ["merch", "Merch"],
          ["kasa", "Kasy"],
        ] as [string, string][]).map(([cat, l]) => (
          <button
            key={cat}
            onClick={() => setCatFilter((c) => (c === cat ? "" : cat))}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${catFilter === cat ? "bg-ink text-white" : "bg-white text-ink-soft ring-1 ring-black/10 hover:bg-paper2"}`}
          >
            {l}
          </button>
        ))}
        {byCategory.length > 0 && (
          <select className="ml-auto rounded-full border border-black/10 bg-white px-3 py-1.5 text-sm text-ink-soft" value={catFilter} onChange={(e) => setCatFilter(e.target.value)}>
            <option value="">Všechny kategorie</option>
            {byCategory.map(([cat]) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        )}
      </div>
      </div>

      {/* Tabulka */}
      {rows.length === 0 ? (
        <div className="card grid place-items-center p-10 text-center text-sm text-ink-soft">
          Zatím žádné položky. Přidej první vklad nebo výdaj.
        </div>
      ) : (
        <div className="card overflow-hidden">
          <Collapsible peekClass="max-h-[260px]" expandable={rows.length > 2} total={rows.length}>
            {/* Mobil: karty (tabulka se na úzký displej nevejde) */}
            <div className="divide-y divide-black/[0.06] md:hidden">
              {rows.map((f) => (
                <FinanceCard key={f.id} item={f} yearId={year.id} canAdd={canAdd} canEdit={canEdit} />
              ))}
            </div>
            {/* Desktop: klasická tabulka */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[640px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-black/[0.06] text-left text-xs font-medium uppercase tracking-wide text-ink-soft">
                    <th className="px-4 py-3">Popis</th>
                    <th className="px-3 py-3">Kategorie</th>
                    <th className="px-3 py-3">Kdo</th>
                    <th className="px-3 py-3">Datum</th>
                    <th className="px-3 py-3 text-right">Částka</th>
                    <th className="px-3 py-3">Stav</th>
                    <th className="px-3 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {rows.map((f) => (
                    <FinanceRow key={f.id} item={f} yearId={year.id} canAdd={canAdd} canEdit={canEdit} />
                  ))}
                </tbody>
              </table>
            </div>
          </Collapsible>
        </div>
      )}

      {/* Souhrn po kategoriích */}
      {byCategory.length > 0 && (
        <div className="card p-5">
          <h2 className="mb-3 font-display text-base font-semibold">Souhrn po kategoriích</h2>
          <ul className="divide-y divide-black/[0.06]">
            {byCategory.map(([cat, v]) => (
              <li key={cat} className="flex items-center gap-3 py-2 text-sm">
                <span className="font-medium">{cat}</span>
                <span className="ml-auto flex items-center gap-4">
                  {v.prijem > 0 && <span className="text-leaf-700">+{fmtCZK(v.prijem)}</span>}
                  {v.vydaj > 0 && <span className="text-ink-soft">−{fmtCZK(v.vydaj)}</span>}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function itemsOpen(items: FinanceItem[], kind: FinanceKind): number {
  return items.filter((i) => i.kind === kind && !i.paid).reduce((s, i) => s + i.amount, 0);
}

function SummaryCard({ label, value, sub, tone }: { label: string; value: number; sub: string; tone: "prijem" | "vydaj" | "bilance" }) {
  const color = tone === "prijem" ? "text-leaf-700" : tone === "vydaj" ? "text-ink" : value >= 0 ? "text-leaf-700" : "text-red-600";
  const prefix = tone === "prijem" ? "+" : tone === "vydaj" ? "−" : value >= 0 ? "+" : "−";
  return (
    <div className="card p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-ink-soft">{label}</p>
      <p className={`mt-1 font-display text-2xl font-semibold tracking-tight ${color}`}>
        {prefix}
        {fmtCZK(Math.abs(value))}
      </p>
      <p className="mt-1 text-xs text-ink-soft">{sub}</p>
    </div>
  );
}

// Sdílený stav řádku financí — používá ho tabulkový řádek (desktop) i karta (mobil).
function useFinanceRow(item: FinanceItem, yearId: string) {
  const { dispatch } = useStore();
  const [edit, setEdit] = useState(false);
  const [label, setLabel] = useState(item.label);
  const [vatMode, setVatMode] = useState<VatMode>(item.net != null ? "none" : "incl");
  const [amount, setAmount] = useState(String(item.net != null ? item.net : item.amount));
  const [category, setCategory] = useState(item.category ?? "");
  const [who, setWho] = useState(item.who ?? "");
  const [date, setDate] = useState(item.date ?? "");

  async function save() {
    const num = parseAmount(amount);
    const gross = vatMode === "none" ? grossFromNet(num) : num;
    const net = vatMode === "none" ? num : undefined;
    await dispatch({
      type: "updateFinance",
      yearId,
      financeId: item.id,
      patch: { label: label.trim() || item.label, amount: gross, net, category: category.trim() || undefined, who: who.trim() || undefined, date: date || undefined },
    });
    setEdit(false);
  }

  return { dispatch, edit, setEdit, label, setLabel, vatMode, setVatMode, amount, setAmount, category, setCategory, who, setWho, date, setDate, save };
}

// Mobilní karta jedné finanční položky (na úzkém displeji místo tabulky).
function FinanceCard({ item, yearId, canAdd, canEdit }: { item: FinanceItem; yearId: string; canAdd: boolean; canEdit: boolean }) {
  const s = useFinanceRow(item, yearId);
  const isPrijem = item.kind === "prijem";

  if (s.edit) {
    return (
      <div className="space-y-2 bg-paper2/40 p-3">
        <input className="input" value={s.label} onChange={(e) => s.setLabel(e.target.value)} placeholder="Popis" />
        <AmountField value={s.amount} setValue={s.setAmount} vatMode={s.vatMode} setVatMode={s.setVatMode} onEnter={s.save} />
        <input className="input" list="fin-cats" value={s.category} onChange={(e) => s.setCategory(e.target.value)} placeholder="Kategorie" />
        <input className="input" value={s.who} onChange={(e) => s.setWho(e.target.value)} placeholder="Kdo / od koho" />
        <input type="date" className="input" value={s.date} onChange={(e) => s.setDate(e.target.value)} />
        <div className="flex gap-2 pt-0.5">
          <button className="btn-primary flex-1 py-2 text-sm" onClick={s.save}>Uložit</button>
          <button className="btn-ghost py-2 text-sm" onClick={() => s.setEdit(false)}>Zrušit</button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3">
      <div className="flex items-start gap-2">
        <span className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs ${isPrijem ? "bg-leaf/12 text-leaf-700" : "bg-black/[0.05] text-ink-soft"}`}>
          {isPrijem ? "+" : "−"}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-medium">{item.label}</p>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-ink-soft">
            {item.category && <span className="chip">{item.category}</span>}
            {item.who && <span>👤 {item.who}</span>}
            {item.date && <span>📅 {fmtDate(item.date)}</span>}
          </div>
          {item.note && <p className="mt-0.5 text-xs text-ink-soft">{item.note}</p>}
        </div>
        <div className="shrink-0 text-right">
          <div className={`font-semibold ${isPrijem ? "text-leaf-700" : "text-ink"}`}>
            {isPrijem ? "+" : "−"}
            {fmtCZK(item.amount)}
          </div>
          {item.net != null && <div className="text-[11px] text-ink-soft">bez DPH {fmtCZK(item.net)}</div>}
        </div>
      </div>
      <div className="mt-2 pl-8">
        <ReceiptControl item={item} yearId={yearId} canAdd={canAdd} canEdit={canEdit} />
      </div>
      <div className="mt-2 flex items-center justify-between gap-2 pl-8">
        {canEdit ? (
          <button
            onClick={() => s.dispatch({ type: "toggleFinancePaid", yearId, financeId: item.id })}
            className={`rounded-full px-2.5 py-1 text-xs font-medium transition ${item.paid ? "bg-leaf/12 text-leaf-700" : "bg-marigold-600 text-white"}`}
          >
            {item.paid ? "Zaplaceno" : "Čeká"}
          </button>
        ) : (
          <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${item.paid ? "bg-leaf/12 text-leaf-700" : "bg-marigold-600 text-white"}`}>
            {item.paid ? "Zaplaceno" : "Čeká"}
          </span>
        )}
        {canEdit && (
          <div className="flex items-center gap-1">
            <button className="btn-ghost px-2 py-1 text-xs" onClick={() => s.setEdit(true)}>Upravit</button>
            <DeleteButton onConfirm={() => s.dispatch({ type: "removeFinance", yearId, financeId: item.id })} />
          </div>
        )}
      </div>
    </div>
  );
}

function FinanceRow({ item, yearId, canAdd, canEdit }: { item: FinanceItem; yearId: string; canAdd: boolean; canEdit: boolean }) {
  const { dispatch, edit, setEdit, label, setLabel, vatMode, setVatMode, amount, setAmount, category, setCategory, who, setWho, date, setDate, save } =
    useFinanceRow(item, yearId);

  if (edit) {
    return (
      <tr className="border-b border-black/[0.06] bg-paper2/40 align-top">
        <td className="px-4 py-2"><input className="input" value={label} onChange={(e) => setLabel(e.target.value)} /></td>
        <td className="px-3 py-2"><input className="input" list="fin-cats" value={category} onChange={(e) => setCategory(e.target.value)} /></td>
        <td className="px-3 py-2"><input className="input" value={who} onChange={(e) => setWho(e.target.value)} /></td>
        <td className="px-3 py-2"><input type="date" className="input" value={date} onChange={(e) => setDate(e.target.value)} /></td>
        <td className="px-3 py-2"><AmountField value={amount} setValue={setAmount} vatMode={vatMode} setVatMode={setVatMode} /></td>
        <td className="px-3 py-2" colSpan={2}>
          <div className="flex gap-1">
            <button className="btn-primary px-3 py-1.5 text-xs" onClick={save}>Uložit</button>
            <button className="btn-ghost px-2 py-1.5 text-xs" onClick={() => setEdit(false)}>Zrušit</button>
          </div>
        </td>
      </tr>
    );
  }

  const isPrijem = item.kind === "prijem";
  return (
    <tr className="border-b border-black/[0.06] transition-colors hover:bg-paper2/40">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs ${isPrijem ? "bg-leaf/12 text-leaf-700" : "bg-black/[0.05] text-ink-soft"}`}>
            {isPrijem ? "+" : "−"}
          </span>
          <span className="font-medium">{item.label}</span>
        </div>
        {item.note && <p className="mt-0.5 pl-8 text-xs text-ink-soft">{item.note}</p>}
        <div className="pl-8"><ReceiptControl item={item} yearId={yearId} canAdd={canAdd} canEdit={canEdit} /></div>
      </td>
      <td className="px-3 py-3">{item.category ? <span className="chip">{item.category}</span> : <span className="text-ink-soft/50">—</span>}</td>
      <td className="px-3 py-3 text-ink-soft">{item.who || "—"}</td>
      <td className="px-3 py-3 whitespace-nowrap text-ink-soft">{item.date ? fmtDate(item.date) : "—"}</td>
      <td className="px-3 py-3 text-right whitespace-nowrap">
        <div className={`font-semibold ${isPrijem ? "text-leaf-700" : "text-ink"}`}>
          {isPrijem ? "+" : "−"}
          {fmtCZK(item.amount)}
        </div>
        {item.net != null && <div className="text-[11px] font-normal text-ink-soft">bez DPH {fmtCZK(item.net)}</div>}
      </td>
      <td className="px-3 py-3">
        {canEdit ? (
          <button
            onClick={() => dispatch({ type: "toggleFinancePaid", yearId, financeId: item.id })}
            className={`rounded-full px-2.5 py-1 text-xs font-medium transition ${item.paid ? "bg-leaf/12 text-leaf-700 hover:bg-leaf/20" : "bg-marigold-600 text-white hover:bg-marigold-700"}`}
            title="Přepnout stav"
          >
            {item.paid ? "Zaplaceno" : "Čeká"}
          </button>
        ) : (
          <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${item.paid ? "bg-leaf/12 text-leaf-700" : "bg-marigold-600 text-white"}`}>
            {item.paid ? "Zaplaceno" : "Čeká"}
          </span>
        )}
      </td>
      <td className="px-3 py-3">
        {canEdit && (
          <div className="flex items-center justify-end gap-1">
            <button className="btn-ghost px-2 py-1 text-xs" onClick={() => setEdit(true)}>Upravit</button>
            <DeleteButton onConfirm={() => dispatch({ type: "removeFinance", yearId, financeId: item.id })} />
          </div>
        )}
      </td>
    </tr>
  );
}

// Pole pro částku s přepínačem DPH (bez DPH / s DPH) + živý přepočet.
function AmountField({
  value,
  setValue,
  vatMode,
  setVatMode,
  onEnter,
}: {
  value: string;
  setValue: (v: string) => void;
  vatMode: VatMode;
  setVatMode: (m: VatMode) => void;
  onEnter?: () => void;
}) {
  const num = parseAmount(value);
  const gross = vatMode === "none" ? grossFromNet(num) : num;
  function switchMode(m: VatMode) {
    if (m === vatMode) return;
    if (num > 0) setValue(String(m === "none" ? netFromGross(num) : grossFromNet(num)));
    setVatMode(m);
  }
  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <input
          className="input min-w-[120px] flex-1"
          inputMode="numeric"
          placeholder={vatMode === "none" ? "Částka bez DPH (Kč)" : "Částka (Kč)"}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onEnter?.()}
        />
        <div className="inline-flex shrink-0 rounded-full bg-paper2 p-0.5 text-xs">
          <button type="button" onClick={() => switchMode("none")} className={`rounded-full px-2.5 py-1.5 font-medium transition ${vatMode === "none" ? "bg-white text-ink shadow-sm" : "text-ink-soft"}`}>
            bez DPH
          </button>
          <button type="button" onClick={() => switchMode("incl")} className={`rounded-full px-2.5 py-1.5 font-medium transition ${vatMode === "incl" ? "bg-white text-ink shadow-sm" : "text-ink-soft"}`}>
            s DPH
          </button>
        </div>
      </div>
      {vatMode === "none" && num > 0 && (
        <p className="mt-1 text-xs text-ink-soft">
          = <strong className="text-ink">{fmtCZK(gross)}</strong> s DPH (21 %)
        </p>
      )}
    </div>
  );
}

// Účtenky jako fotky: víc účtenek na položku, zobrazení, stažení (správce) a smazání.
function ReceiptControl({ item, yearId, canAdd, canEdit }: { item: FinanceItem; yearId: string; canAdd: boolean; canEdit: boolean }) {
  const { configured, dispatch } = useStore();
  const list = receiptsOf(item);
  const [busy, setBusy] = useState(false);
  const [viewing, setViewing] = useState<string | null>(null);
  const [err, setErr] = useState(false);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setBusy(true);
    setErr(false);
    try {
      const dataUrl = await compressImage(file);
      const id = uid("rc_");
      const ok = await saveReceipt(id, dataUrl, configured);
      if (ok) await dispatch({ type: "updateFinance", yearId, financeId: item.id, patch: { receiptIds: [...list, id], receiptId: undefined } });
      else setErr(true);
    } catch {
      setErr(true);
    } finally {
      setBusy(false);
    }
  }
  async function view(id: string) {
    const url = await loadReceipt(id, configured);
    if (url) setViewing(url);
    else setErr(true);
  }
  async function download(id: string) {
    const url = await loadReceipt(id, configured);
    if (!url) { setErr(true); return; }
    const a = document.createElement("a");
    a.href = url;
    a.download = `${item.label || "uctenka"}.jpg`;
    a.click();
  }
  async function remove(id: string) {
    await deleteReceipt(id, configured);
    await dispatch({ type: "updateFinance", yearId, financeId: item.id, patch: { receiptIds: list.filter((x) => x !== id), receiptId: undefined } });
  }

  return (
    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
      {list.map((id, i) => (
        <span key={id} className="inline-flex items-center gap-1.5 rounded-full bg-leaf/12 px-2 py-0.5 text-leaf-700">
          <button onClick={() => view(id)} className="font-medium hover:underline">
            📎 Účtenka{list.length > 1 ? ` ${i + 1}` : ""}
          </button>
          {canAdd && (
            <button onClick={() => download(id)} title="Stáhnout účtenku" className="hover:text-ink">
              <Icon name="download" className="h-3.5 w-3.5" />
            </button>
          )}
          {canEdit && (
            <button onClick={() => remove(id)} title="Odebrat účtenku" className="hover:text-red-600">
              ✕
            </button>
          )}
        </span>
      ))}
      {canAdd && (
        <label className="inline-flex cursor-pointer items-center gap-1 text-ink-soft/70 hover:text-ink">
          📎 {busy ? "Nahrávám…" : list.length ? "Přidat další" : "Přidat účtenku"}
          <input type="file" accept="image/*" className="hidden" onChange={onFile} disabled={busy} />
        </label>
      )}
      {err && <span className="text-red-600">nepovedlo se</span>}

      <Modal open={viewing !== null} onClose={() => setViewing(null)} title="Účtenka">
        {viewing && (
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={viewing} alt="Účtenka" className="max-h-[64vh] w-full rounded-xl object-contain" />
            <div className="mt-3 flex justify-center">
              <button
                onClick={() => setViewing(null)}
                aria-label="Zavřít"
                className="grid h-11 w-11 place-items-center rounded-full bg-black/5 text-ink-soft transition hover:bg-black/10 hover:text-ink"
              >
                <Icon name="close" className="h-6 w-6" />
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

// Řádek výběru (vkladu) — jméno + částka + (pro správce) Vráceno / smazat.
function ContributionRow({ c, yearId, canEdit }: { c: Contribution; yearId: string; canEdit: boolean }) {
  const { dispatch } = useStore();
  return (
    <li className="flex items-center gap-3 py-2">
      <p className={`min-w-0 flex-1 break-words font-medium ${c.returned ? "text-ink-soft line-through" : ""}`}>{c.name}</p>
      <span className={`shrink-0 font-display font-semibold ${c.returned ? "text-ink-soft line-through" : "text-leaf-700"}`}>{fmtCZK(c.amount)}</span>
      {canEdit && (
        <button
          onClick={() => dispatch({ type: "toggleContributionReturned", yearId, contributionId: c.id })}
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium transition ${c.returned ? "bg-leaf/12 text-leaf-700 hover:bg-leaf/20" : "bg-paper2 text-ink-soft hover:bg-black/5"}`}
          title={c.returned ? "Označit jako nevrácené" : "Označit jako vrácené"}
        >
          {c.returned ? "Vráceno ✓" : "Vrátit"}
        </button>
      )}
      {canEdit && <DeleteButton onConfirm={() => dispatch({ type: "removeContribution", yearId, contributionId: c.id })} />}
    </li>
  );
}

// Denní kasa: ráno vklad → večer stav; tržba se po uzavření zapíše do financí.
function CashboxCard({ box, yearId, canAdd, canEdit }: { box: Cashbox; yearId: string; canAdd: boolean; canEdit: boolean }) {
  const { dispatch } = useStore();
  const [closeVal, setCloseVal] = useState("");
  const closed = !!box.closedAt;
  const trzba = closed && box.closing != null ? box.closing - box.opening : null;

  function close() {
    const n = parseAmount(closeVal);
    if (closeVal.trim() === "" || !Number.isFinite(n)) return;
    dispatch({ type: "closeCashbox", yearId, cashboxId: box.id, closing: n });
    setCloseVal("");
  }

  return (
    <div className={`rounded-2xl border p-3 ${closed ? "border-leaf/30 bg-leaf/[0.05]" : "border-amber-200 bg-amber-50"}`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-1.5 font-semibold">
            Kasa{box.label ? ` — ${box.label}` : ""}
            {closed ? (
              <span className="chip bg-leaf/15 text-leaf-700">uzavřeno</span>
            ) : (
              <span className="chip bg-amber-100 text-amber-800">otevřeno</span>
            )}
          </p>
          <p className="text-xs text-ink-soft">
            Ráno {fmtCZK(box.opening)} · {fmtDateTime(box.openedAt)}
            {closed && box.closing != null && ` → Večer ${fmtCZK(box.closing)} · ${fmtDateTime(box.closedAt!)}`}
          </p>
        </div>
        {canEdit && <DeleteButton onConfirm={() => dispatch({ type: "removeCashbox", yearId, cashboxId: box.id })} />}
      </div>

      {closed ? (
        trzba != null && (
          <p className="mt-1.5 text-sm">
            Tržba: <span className={`font-display font-bold ${trzba >= 0 ? "text-leaf-700" : "text-red-600"}`}>{fmtCZK(trzba)}</span>
            <span className="ml-2 text-xs text-ink-soft">✓ zapsáno do financí</span>
          </p>
        )
      ) : canAdd ? (
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <input
            className="input w-44"
            inputMode="numeric"
            placeholder="Večer v kase (Kč)"
            value={closeVal}
            onChange={(e) => setCloseVal(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && close()}
          />
          <button className="btn-primary" onClick={close} disabled={!closeVal.trim()}>
            Uzavřít a zapsat tržbu
          </button>
        </div>
      ) : (
        <p className="mt-1 text-xs text-ink-soft">Kasa je otevřená.</p>
      )}
    </div>
  );
}

function NewKasaModal({ open, yearId, onClose }: { open: boolean; yearId: string; onClose: () => void }) {
  const { dispatch } = useStore();
  const [label, setLabel] = useState("");
  const [opening, setOpening] = useState("");

  function create() {
    const n = parseAmount(opening);
    if (n <= 0) return;
    dispatch({ type: "openCashbox", yearId, label: label.trim() || undefined, opening: n });
    setLabel("");
    setOpening("");
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Nová kasa — ranní vklad">
      <div className="space-y-3">
        <p className="text-sm text-ink-soft">
          Zapiš ranní vklad do kasy (základ na vracení). Večer pak u kasy doplníš stav a tržba se sama zapíše do financí.
        </p>
        <div>
          <label className="label">Označení (nepovinné)</label>
          <input className="input" placeholder="např. Bar, úterý" value={label} onChange={(e) => setLabel(e.target.value)} />
        </div>
        <div>
          <label className="label">Ranní vklad (Kč)</label>
          <input
            className="input"
            inputMode="numeric"
            placeholder="např. 2000"
            value={opening}
            onChange={(e) => setOpening(e.target.value)}
            autoFocus
            onKeyDown={(e) => e.key === "Enter" && create()}
          />
        </div>
        <div className="flex items-center gap-2 pt-1">
          <button className="btn-primary flex-1" onClick={create} disabled={!opening.trim()}>
            Otevřít kasu
          </button>
          <button className="btn-ghost" onClick={onClose}>
            Zrušit
          </button>
        </div>
      </div>
    </Modal>
  );
}

// Sbalovací obal: ukáže jen „peek" (kousek) a tlačítkem se šipkou rozbalí celé.
function Collapsible({
  peekClass,
  expandable,
  total,
  children,
}: {
  peekClass: string;
  expandable: boolean;
  total: number;
  children: React.ReactNode;
}) {
  const [expanded, setExpanded] = useState(false);
  if (!expandable) return <>{children}</>;
  return (
    <>
      <div className="relative">
        <div className={expanded ? "" : `${peekClass} overflow-hidden`}>{children}</div>
        {!expanded && <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-white to-transparent" />}
      </div>
      <button
        onClick={() => setExpanded((v) => !v)}
        className="mt-1.5 flex w-full items-center justify-center gap-1 rounded-xl py-1.5 text-sm font-medium text-ink-soft transition hover:bg-black/[0.04]"
      >
        {expanded ? "Sbalit" : `Zobrazit vše (${total})`}
        <Icon name="chevron" className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
      </button>
    </>
  );
}
