"use client";

import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { fmtCZK, fmtDate, todayISO } from "@/lib/format";
import { DeleteButton } from "@/components/DeleteButton";
import { Icon } from "@/components/Icons";
import { Modal } from "@/components/Modal";
import { isAdmin } from "@/lib/admin";
import { compressImage, saveReceipt, loadReceipt, deleteReceipt } from "@/lib/receipts";
import { uid } from "@/lib/id";
import type { FinanceItem, FinanceKind } from "@/lib/types";

const CATEGORIES = [
  "vklad",
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

// Funkci „Ekonom / Finance" v roles.ts má id `ekonom`.

export default function FinancePage() {
  const { currentYear, me, dispatch } = useStore();
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<Filter>("vse");
  const [catFilter, setCatFilter] = useState<string>("");

  const [kind, setKind] = useState<FinanceKind>("vydaj");
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [who, setWho] = useState("");
  const [date, setDate] = useState(todayISO());
  const [paid, setPaid] = useState(true);

  const year = currentYear;

  const items = useMemo(() => year?.finances ?? [], [year]);

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
    return { prijmy, vydaje, bilance: prijmy - vydaje, kasa: vybrano - zaplaceno, otevreno };
  }, [items]);

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

  // Finance smí upravovat jen správce (Pan_Vyskočil). Ostatní mají jen náhled.
  const canEdit = isAdmin(me);

  async function add() {
    const amt = parseAmount(amount);
    if (!label.trim() || amt <= 0 || !year || !canEdit) return;
    await dispatch({ type: "addFinance", yearId: year.id, kind, label, amount: amt, category: category || undefined, who: who || undefined, paid, date: date || undefined });
    setLabel("");
    setAmount("");
    setCategory("");
    setWho("");
    setPaid(true);
    setKind("vydaj");
    setOpen(false);
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
        {canEdit && (
          <button className="btn-primary" onClick={() => setOpen((v) => !v)}>
            {open ? "Zavřít" : "+ Přidat položku"}
          </button>
        )}
      </div>

      {/* Finance může upravovat jen správce */}
      {!canEdit && (
        <div className="flex items-start gap-2 rounded-2xl border border-marigold-200 bg-marigold-50 px-4 py-3 text-sm text-marigold-800">
          <Icon name="finance" className="mt-0.5 h-4 w-4 shrink-0" />
          <span>Finance může upravovat jen správce. Ty máš jen náhled.</span>
        </div>
      )}

      {/* Souhrn */}
      <div className="grid gap-3 sm:grid-cols-3">
        <SummaryCard label="Příjmy" value={totals.prijmy} sub={`vybráno ${fmtCZK(totals.prijmy - itemsOpen(items, "prijem"))}`} tone="prijem" />
        <SummaryCard label="Výdaje" value={totals.vydaje} sub={`zaplaceno ${fmtCZK(totals.vydaje - itemsOpen(items, "vydaj"))}`} tone="vydaj" />
        <SummaryCard label="Bilance" value={totals.bilance} sub={`v kase ${fmtCZK(totals.kasa)} · otevřené ${fmtCZK(totals.otevreno)}`} tone="bilance" />
      </div>

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
            <input className="input" inputMode="numeric" placeholder="Částka (Kč)" value={amount} onChange={(e) => setAmount(e.target.value)} onKeyDown={(e) => e.key === "Enter" && add()} />
            <input className="input" list="fin-cats" placeholder="Kategorie" value={category} onChange={(e) => setCategory(e.target.value)} />
            <input className="input" placeholder="Kdo / od koho (nepovinné)" value={who} onChange={(e) => setWho(e.target.value)} />
            <input type="date" className="input" value={date} onChange={(e) => setDate(e.target.value)} />
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

      {/* Tabulka */}
      {rows.length === 0 ? (
        <div className="card grid place-items-center p-10 text-center text-sm text-ink-soft">
          Zatím žádné položky. Přidej první vklad nebo výdaj.
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
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
                  <FinanceRow key={f.id} item={f} yearId={year.id} canEdit={canEdit} />
                ))}
              </tbody>
            </table>
          </div>
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

function FinanceRow({ item, yearId, canEdit }: { item: FinanceItem; yearId: string; canEdit: boolean }) {
  const { dispatch } = useStore();
  const [edit, setEdit] = useState(false);
  const [label, setLabel] = useState(item.label);
  const [amount, setAmount] = useState(String(item.amount));
  const [category, setCategory] = useState(item.category ?? "");
  const [who, setWho] = useState(item.who ?? "");
  const [date, setDate] = useState(item.date ?? "");

  async function save() {
    await dispatch({
      type: "updateFinance",
      yearId,
      financeId: item.id,
      patch: { label: label.trim() || item.label, amount: parseAmount(amount), category: category.trim() || undefined, who: who.trim() || undefined, date: date || undefined },
    });
    setEdit(false);
  }

  if (edit) {
    return (
      <tr className="border-b border-black/[0.06] bg-paper2/40 align-top">
        <td className="px-4 py-2"><input className="input" value={label} onChange={(e) => setLabel(e.target.value)} /></td>
        <td className="px-3 py-2"><input className="input" list="fin-cats" value={category} onChange={(e) => setCategory(e.target.value)} /></td>
        <td className="px-3 py-2"><input className="input" value={who} onChange={(e) => setWho(e.target.value)} /></td>
        <td className="px-3 py-2"><input type="date" className="input" value={date} onChange={(e) => setDate(e.target.value)} /></td>
        <td className="px-3 py-2"><input className="input text-right" inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value)} /></td>
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
        <div className="pl-8"><ReceiptControl item={item} yearId={yearId} canEdit={canEdit} /></div>
      </td>
      <td className="px-3 py-3">{item.category ? <span className="chip">{item.category}</span> : <span className="text-ink-soft/50">—</span>}</td>
      <td className="px-3 py-3 text-ink-soft">{item.who || "—"}</td>
      <td className="px-3 py-3 whitespace-nowrap text-ink-soft">{item.date ? fmtDate(item.date) : "—"}</td>
      <td className={`px-3 py-3 text-right font-semibold whitespace-nowrap ${isPrijem ? "text-leaf-700" : "text-ink"}`}>
        {isPrijem ? "+" : "−"}
        {fmtCZK(item.amount)}
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

// Účtenka jako foto: nahrání (zmenší se), zobrazení a smazání.
function ReceiptControl({ item, yearId, canEdit }: { item: FinanceItem; yearId: string; canEdit: boolean }) {
  const { configured, dispatch } = useStore();
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
      const id = item.receiptId || uid("rc_");
      const ok = await saveReceipt(id, dataUrl, configured);
      if (ok) await dispatch({ type: "updateFinance", yearId, financeId: item.id, patch: { receiptId: id } });
      else setErr(true);
    } catch {
      setErr(true);
    } finally {
      setBusy(false);
    }
  }

  async function view() {
    if (!item.receiptId) return;
    const url = await loadReceipt(item.receiptId, configured);
    if (url) setViewing(url);
    else setErr(true);
  }

  async function remove() {
    if (item.receiptId) await deleteReceipt(item.receiptId, configured);
    await dispatch({ type: "updateFinance", yearId, financeId: item.id, patch: { receiptId: "" } });
  }

  return (
    <div className="mt-1 flex items-center gap-2 text-xs">
      {item.receiptId ? (
        <>
          <button onClick={view} className="inline-flex items-center gap-1 rounded-full bg-leaf/12 px-2 py-0.5 font-medium text-leaf-700 hover:bg-leaf/20">
            📎 Účtenka
          </button>
          {canEdit && (
            <button onClick={remove} className="text-ink-soft/60 hover:text-red-600" title="Odebrat účtenku">✕</button>
          )}
        </>
      ) : (
        canEdit && (
          <label className="inline-flex cursor-pointer items-center gap-1 text-ink-soft/70 hover:text-ink">
            📎 {busy ? "Nahrávám…" : "Přidat účtenku"}
            <input type="file" accept="image/*" className="hidden" onChange={onFile} disabled={busy} />
          </label>
        )
      )}
      {err && <span className="text-red-600">nepovedlo se</span>}

      <Modal open={viewing !== null} onClose={() => setViewing(null)} title="Účtenka">
        {viewing && (
          <div className="space-y-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={viewing} alt="Účtenka" className="max-h-[70vh] w-full rounded-xl object-contain" />
            <a href={viewing} target="_blank" rel="noreferrer" className="btn-secondary w-full">Otevřít v plné velikosti</a>
          </div>
        )}
      </Modal>
    </div>
  );
}
