"use client";

import { useMemo, useState } from "react";
import { PageTitle } from "@/components/PageTitle";
import { useStore } from "@/lib/store";
import { fmtCZK, fmtDate, fmtDateTime, fmtRelative, todayISO } from "@/lib/format";
import { posStats, posOrders, boxDayFinances, DayCard, OrderHistory, PayBreakdown } from "@/lib/pos";
import { DeleteButton } from "@/components/DeleteButton";
import { Icon } from "@/components/Icons";
import { Modal } from "@/components/Modal";
import { ImageViewer } from "@/components/ImageViewer";
import { SearchClear } from "@/components/SearchBox";
import { isAdmin } from "@/lib/admin";
import { canEditSection } from "@/lib/access";
import { normName, sameName } from "@/lib/names";
import { compressImage, saveReceipt, loadReceipt, deleteReceipt } from "@/lib/receipts";
import { uid } from "@/lib/id";
import { flash } from "@/components/Flash";
import type { FinanceItem, FinanceKind, Cashbox, Contribution } from "@/lib/types";

// Stav jednoho vkladu — pro barvy, filtry i souhrny.
function contributionState(c: Contribution): "zaplatil" | "nezaplatil" | "pulka" | "vraceno" {
  if (c.returned) return "vraceno";
  const owes = c.pledged != null && c.pledged > c.amount ? c.pledged - c.amount : 0;
  if (c.amount === 0 && owes > 0) return "nezaplatil";
  if (c.amount > 0 && owes > 0) return "pulka";
  return "zaplatil";
}

const CATEGORIES = [
  "vklad",
  "kasa",
  "bar",
  "kuchyně",
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

type Filter = "vse" | "zaplaceno" | "nezaplaceno";

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

// Jednotlivý markovaný prodej z Prodeje nebo merche — pozná se podle rozpisu „×"
// v poznámce (např. „2× Guláš · hotově"). Tyto se ve financích neukazují
// samostatně (zahltily by přehled), ale sčítají se po dnech do „Prodej po dnech" —
// tedy do kasy za daný den.
const isPosSale = (f: FinanceItem) =>
  f.kind === "prijem" &&
  (f.note ?? "").includes("×") &&
  (f.label === "Prodej na místě" || f.label.startsWith("Merch"));

const saleHow = (note?: string) =>
  (note ?? "").includes("QR platba") ? "QR" : (note ?? "").includes("hotově") ? "hotově" : "";

const hhmmFin = (iso: string) => {
  const d = new Date(iso);
  return isNaN(d.getTime()) ? "" : `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

type SaleOrder = { id: string; at: string; items: string; cat: string; how: string; amount: number };
type SaleDay = { day: string; total: number; qr: number; cash: number; count: number; orders: SaleOrder[] };

// Prodeje (markované platby) sečtené po dnech. `catOk` vybere jen relevantní
// kategorie — Kasy berou bar/kuchyni/kasu, Merch jen merch.
function buildSaleDays(items: FinanceItem[], catOk: (cat: string) => boolean): SaleDay[] {
  const map = new Map<string, SaleDay>();
  for (const f of items) {
    if (!isPosSale(f) || !catOk(f.category ?? "")) continue;
    const day = (f.date || f.createdAt).slice(0, 10);
    const g = map.get(day) ?? { day, total: 0, qr: 0, cash: 0, count: 0, orders: [] };
    const how = saleHow(f.note);
    g.total += f.amount;
    g.count += 1;
    if (how === "QR") g.qr += f.amount;
    else if (how === "hotově") g.cash += f.amount;
    g.orders.push({ id: f.id, at: f.createdAt, items: (f.note ?? "").split(" · ")[0], cat: f.category ?? "", how, amount: f.amount });
    map.set(day, g);
  }
  return [...map.values()]
    .map((g) => ({ ...g, orders: g.orders.sort((a, b) => b.at.localeCompare(a.at)) }))
    .sort((a, b) => b.day.localeCompare(a.day));
}

export default function FinancePage() {
  const { currentYear, me, dispatch, canEditCurrentYear } = useStore();
  const [open, setOpen] = useState(false);
  const [kasaOpen, setKasaOpen] = useState(false);
  const [vyberOpen, setVyberOpen] = useState(false);
  // Hlavní přepínač financí (svítící lišta jako v Prodeji): 4 pohledy.
  // (výběrčí vkladů má pohled napevno na „vyber" — viz `tab` níže)
  const [tabState, setTab] = useState<"vse" | "kasy" | "merch" | "vyber">("vse");
  const [filter, setFilter] = useState<Filter>("vse");
  const [q, setQ] = useState(""); // vyhledávání podle popisu

  // Výběr (vklady) — hromadné vložení: všechna jména naráz + částka; rozdělí se
  // na jednotlivé lidi (kontakt se doplní zpětně úpravou).
  const [bulkText, setBulkText] = useState("");
  const [bulkPledged, setBulkPledged] = useState("");
  const [ctFilter, setCtFilter] = useState<"vse" | "zaplatil" | "nezaplatil" | "pulka">("vse");
  const [editCt, setEditCt] = useState<Contribution | null>(null); // úprava jména/kontaktu/částky
  const [recentOpen, setRecentOpen] = useState(false); // „Naposledy zaplatili" — 2 + rolovačka

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

  // Výběr: kolik je v balíku (nevrácené), kolik se vrátilo, kolik zbývá doplatit
  // a počty po stavech (do balíku jde jen skutečně zaplacené — sliby ne).
  const vyber = useMemo(() => {
    let inPool = 0,
      returned = 0,
      owed = 0;
    const counts = { vse: contributions.length, zaplatil: 0, nezaplatil: 0, pulka: 0, vraceno: 0 };
    for (const c of contributions) {
      if (c.returned) returned += c.amount;
      else inPool += c.amount;
      if (!c.returned && c.pledged != null && c.pledged > c.amount) owed += c.pledged - c.amount;
      counts[contributionState(c)]++;
    }
    return { inPool, returned, owed, paidCount: counts.zaplatil, counts, total: inPool + returned };
  }, [contributions]);

  // Seznam podle zvoleného filtru + hledání (jméno / e-mail / telefon).
  const filteredContributions = useMemo(() => {
    const byState = ctFilter === "vse" ? contributions : contributions.filter((c) => contributionState(c) === ctFilter);
    if (!q.trim()) return byState;
    const needle = normName(q);
    return byState.filter((c) => normName(`${c.name} ${c.email ?? ""} ${c.phone ?? ""}`).includes(needle));
  }, [contributions, ctFilter, q]);

  // Kdo zaplatil naposled — přehled, když chodí peníze v různé hodiny/dny.
  const recentPaid = useMemo(
    () =>
      contributions
        .filter((c) => c.paidAt && !c.returned)
        .sort((a, b) => (b.paidAt as string).localeCompare(a.paidAt as string))
        .slice(0, 12),
    [contributions],
  );

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

  // Proplácení — kolik kdo zaplatil z výdajů a kolik mu ještě dlužíme (nezaplaceno).
  const byPerson = useMemo(() => {
    const map = new Map<string, { total: number; owed: number }>();
    for (const f of items) {
      if (f.kind !== "vydaj" || !f.who?.trim()) continue;
      const key = f.who.trim();
      const cur = map.get(key) || { total: 0, owed: 0 };
      cur.total += f.amount;
      if (!f.paid) cur.owed += f.amount;
      map.set(key, cur);
    }
    return [...map.entries()].sort((a, b) => b[1].owed - a[1].owed || b[1].total - a[1].total);
  }, [items]);
  const totalOwed = useMemo(() => byPerson.reduce((s, [, v]) => s + v.owed, 0), [byPerson]);

  // Merch — kolik už merch vydělal (příjmy z kategorie „merch", hlavně z vyřízených objednávek).
  const merchTotal = useMemo(
    () => items.filter((f) => f.category === "merch" && f.kind === "prijem").reduce((s, f) => s + f.amount, 0),
    [items],
  );
  // Kolik jsme do merche vložili: výdaje kategorie „merch" + pořízení zboží
  // podle nabídky (nákupní cena × skladem). Tak „vloženo" sedí i když se
  // nákup zapíše jen u produktu (kolik kusů + za kolik), ne jako výdaj.
  const merchExpense = useMemo(
    () => items.filter((f) => f.category === "merch" && f.kind === "vydaj").reduce((s, f) => s + f.amount, 0),
    [items],
  );
  const merchInvest = useMemo(
    () => (year?.merch ?? []).reduce((s, p) => s + (p.cost != null && p.stock != null ? p.cost * p.stock : 0), 0),
    [year],
  );
  const merchIn = merchExpense + merchInvest;
  // Do seznamu merche jen „neprodejní" položky (nákupy zboží, refundace…).
  // Jednotlivé prodeje merche (rozpis „×") se sčítají po dnech v „Prodej po dnech".
  const merchExtras = useMemo(
    () => items.filter((f) => f.category === "merch" && !isPosSale(f)).sort((a, b) => (b.date || b.createdAt).localeCompare(a.date || a.createdAt)),
    [items],
  );

  // Merch prodeje po dnech (do pohledu Merch). Kasové prodeje (bar/kuchyně/kasa)
  // se ukazují přímo v denních kartách kasy; „bez kasy" jsou jen prodeje, které
  // nespadají pod žádnou kasu (starší data) — ty jdou samostatně, ať jdou smazat.
  const merchSaleDays = useMemo(() => buildSaleDays(items, (c) => c === "merch"), [items]);
  // Výdělek z prodeje i merche po dnech — ať je vidět i ve „Všechny finance".
  const allSaleDays = useMemo(() => buildSaleDays(items, () => true), [items]);
  const orphanSaleDays = useMemo(() => {
    const boxes = year?.cashboxes ?? [];
    return buildSaleDays(items.filter((f) => !boxes.some((b) => b.openedAt <= f.createdAt)), (c) => c !== "merch");
  }, [items, year]);

  const rows = useMemo(() => {
    return items
      // Jednotlivé prodeje sem nepatří — jsou sečtené po dnech v „Prodej po dnech".
      .filter((f) => !isPosSale(f))
      .filter((f) => {
        if (filter === "zaplaceno") return f.paid;
        if (filter === "nezaplaceno") return !f.paid;
        return true;
      })
      .filter((f) => (q.trim() ? normName(f.label).includes(normName(q)) : true))
      .sort((a, b) => (b.date || b.createdAt).localeCompare(a.date || a.createdAt));
  }, [items, filter, q]);

  if (!year) return null;

  // Výběrčí vkladů (vyberOnly): správce mu v Týmu zapnul „jen Výběr". Vidí
  // napevno jen pohled Výběr a smí odklikávat platby (jako by měl finanční roli).
  const vyberOnly = !isAdmin(me) && !!year.members.find((m) => sameName(m.name, me))?.vyberOnly;
  const tab = vyberOnly ? "vyber" : tabState;

  // Celé finance (bilance, kasy, všechny položky) vidí jen hlavní
  // koordinátor & finance + správce. Ostatní mají jen „Moje výdaje":
  // zapíšou, co zaplatili (propíše se ekonomovi), a vidí jen svoje.
  // Výběrčí (vyberOnly) tuto bránu obchází — potřebuje pohled Výběr.
  if (!canEditSection(year, me, "finance") && !vyberOnly) {
    return <MyExpenses yearId={year.id} me={me} items={items} canSubmit={canEditCurrentYear} />;
  }

  // Přidávat položky i kasy: hlavní koordinátor & finance + správce.
  // Upravovat / mazat / přepínat zaplaceno už jen správce (canEdit).
  // Výběrčí (vyberOnly) je jen pozorovatel — nic nepřidává ani nemění, jen
  // sleduje, kdo a kdy zaplatil.
  const canAdd = canEditCurrentYear && !vyberOnly;
  const canEdit = isAdmin(me);

  // Kasy: kolik se ráno vložilo (vklady) a kolik se vydělalo (tržba z uzavřených).
  const kasaOpenings = (year.cashboxes ?? []).reduce((s, c) => s + c.opening, 0);
  // Tržba kas = kolik se přes kasy prodalo (QR + hotově), NE rozdíl při uzávěrce.
  const kasaTrzba = (year.cashboxes ?? []).reduce((s, c) => s + posStats(boxDayFinances(year.finances ?? [], c, year.cashboxes ?? [])).takings, 0);
  // Rozdíl kas = manko/přebytek při uzávěrkách (uzavřené kasy).
  const kasaDiff = (year.cashboxes ?? []).reduce((s, c) => s + (c.closedAt && c.closing != null ? c.closing - c.opening - (c.alreadyRecorded ?? 0) : 0), 0);
  const merchProfit = merchTotal - merchIn; // zisk z merche (výdělek − vloženo)

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
    flash("Položka přidána", "💰");
  }

  // Hromadné vložení: všechna jména naráz (každé na řádek, e-mail nepovinný) +
  // částka pro všechny → rozdělí se na jednotlivé lidi s 0 Kč a slíbenou částkou.
  // Kontakt se doplní zpětně úpravou. Platby (celé/půlka/doplatil) se odklikávají.
  async function addBulkContributions() {
    if (!year || !canAdd) return;
    const per = bulkPledged.trim() ? parseAmount(bulkPledged) : (year.deposit ?? 0);
    if (per <= 0) {
      flash("Vyplň částku, kolik se vybírá od každého (Kč)", "⚠️");
      return;
    }
    const norm = (s: string) => s.trim().toLowerCase();
    const existing = new Set(contributions.map((c) => norm(c.name)));
    let added = 0;
    for (const line of bulkText.split("\n").map((l) => l.trim()).filter(Boolean)) {
      const parts = line.split(/[,;\t]/).map((p) => p.trim()).filter(Boolean);
      const email = parts.find((p) => p.includes("@"));
      const name = parts.filter((p) => !p.includes("@")).join(" ").trim();
      if (!name || existing.has(norm(name))) continue;
      existing.add(norm(name));
      if (await dispatch({ type: "addContribution", yearId: year.id, name, email, amount: 0, pledged: per })) added++;
    }
    setBulkText("");
    flash(added > 0 ? `Přidáno ${added} lidí — platby se odklikávají u jmen` : "Nikdo nový nepřibyl (jména už v seznamu jsou)", added > 0 ? "📋" : "ℹ️");
  }

  // Doplnit tým: všichni ze soupisky, kteří v seznamu výběru ještě nejsou.
  const teamToAdd = (year?.members ?? []).filter((m) => !contributions.some((c) => c.name.trim().toLowerCase() === m.name.trim().toLowerCase()));
  async function addTeamContributions() {
    if (!year || !canAdd) return;
    const per = bulkPledged.trim() ? parseAmount(bulkPledged) : (year.deposit ?? 0);
    if (per <= 0) {
      flash("Vyplň, kolik má každý dát (Kč)", "⚠️");
      return;
    }
    let added = 0;
    for (const m of teamToAdd) {
      if (await dispatch({ type: "addContribution", yearId: year.id, name: m.name, email: m.email, amount: 0, pledged: per })) added++;
    }
    flash(`Založeno ${added} lidí ze soupisky — platby se odklikávají u jmen`, "👥");
  }

  return (
    <div className="space-y-6 pb-24 tabular-nums md:pb-0">
      <datalist id="fin-cats">
        {CATEGORIES.map((c) => (
          <option key={c} value={c} />
        ))}
      </datalist>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <PageTitle>Finance</PageTitle>
        </div>
        {canAdd && (
          <div className="flex flex-wrap items-center gap-2">
            {/* Kontextové tlačítko podle zvoleného pohledu (Kasy → +Kasa, Výběr → +Výběr…). */}
            {tab === "vyber" && (
              <button
                className="btn-primary"
                onClick={() => {
                  const opening = !vyberOpen;
                  setVyberOpen(opening);
                  if (opening) setTimeout(() => document.getElementById("vyber")?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
                }}
              >
                {vyberOpen ? "Zavřít" : "+ Výběr"}
              </button>
            )}
            {tab === "kasy" && (
              <button className="btn-primary" onClick={() => setKasaOpen(true)}>
                + Kasa
              </button>
            )}
            {tab === "vse" && (
              <button
                className="btn-primary"
                onClick={() => {
                  const opening = !open;
                  setOpen(opening);
                  if (opening) setTimeout(() => document.getElementById("add-finance")?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
                }}
              >
                {open ? "Zavřít" : "+ Přidat položku"}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Přepínač financí (desktop) — na mobilu je dole ve svítící zlaté liště.
          Výběrčí (vyberOnly) přepínač nemá — má jen pohled Výběr. */}
      {!vyberOnly && (
        <div className="hidden gap-1.5 md:flex">
          {FIN_TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setTab(t.id);
                setQ("");
              }}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition ${
                tab === t.id ? "bg-gold-500 text-[#1d1d1f] shadow-sm" : "bg-paper2 text-ink-soft hover:bg-gold-100"
              }`}
            >
              {t.emoji} {t.label}
            </button>
          ))}
        </div>
      )}

      {/* Vyhledávání — velké, přes celou šířku, hned pod nadpisem (mění se podle pohledu) */}
      <div className="relative">
        <input
          type="search"
          className={`w-full rounded-2xl border-2 border-ink/10 bg-white px-5 py-4 text-base shadow-sm outline-none transition placeholder:text-ink-soft/60 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 ${q ? "pr-14" : ""}`}
          placeholder={tab === "vyber" ? "🔎 Hledat člověka…" : tab === "kasy" ? "🔎 Hledat kasu / den…" : tab === "merch" ? "🔎 Hledat v merchi…" : "🔎 Hledat v položkách…"}
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        {q && <SearchClear onClear={() => setQ("")} className="absolute right-4 top-1/2 h-6 w-6 -translate-y-1/2" />}
      </div>

      {/* Základní přehled podle pohledu — jednoduše a jasně, hned pod hledáním
          (kasa / merch / výběr / vše zvlášť: výdělek, vklady, bilance). */}
      <SummaryStrip
        cells={
          tab === "kasy"
            ? [
                { label: "Tržba", text: `+${fmtCZK(kasaTrzba)}`, cls: "text-leaf-700" },
                { label: "Vklady", text: fmtCZK(kasaOpenings) },
                { label: "Rozdíl", text: `${kasaDiff >= 0 ? "+" : "−"}${fmtCZK(Math.abs(kasaDiff))}`, cls: kasaDiff >= 0 ? "text-leaf-700" : "text-red-600" },
              ]
            : tab === "merch"
              ? [
                  { label: "Výdělek", text: `+${fmtCZK(merchTotal)}`, cls: "text-leaf-700" },
                  { label: "Vloženo", text: `−${fmtCZK(merchIn)}` },
                  { label: "Zisk", text: `${merchProfit >= 0 ? "+" : "−"}${fmtCZK(Math.abs(merchProfit))}`, cls: merchProfit >= 0 ? "text-leaf-700" : "text-red-600" },
                ]
              : tab === "vyber"
                ? [
                    { label: "V balíku", text: `+${fmtCZK(vyber.inPool)}`, cls: "text-leaf-700" },
                    { label: "Zbývá doplatit", text: fmtCZK(vyber.owed), cls: vyber.owed > 0 ? "text-amber-800" : "text-ink" },
                    { label: "Zaplatili", text: `${vyber.paidCount}/${contributions.length}` },
                    { label: "½ Zčásti", text: `${vyber.counts.pulka}`, cls: vyber.counts.pulka > 0 ? "text-amber-700" : "text-ink" },
                  ]
                : [
                    { label: "Příjmy", text: `+${fmtCZK(totals.prijmy)}`, cls: "text-leaf-700" },
                    { label: "Výdaje", text: `−${fmtCZK(totals.vydaje)}` },
                    { label: "Bilance", text: `${totals.bilance >= 0 ? "+" : "−"}${fmtCZK(Math.abs(totals.bilance))}`, cls: totals.bilance >= 0 ? "text-leaf-700" : "text-red-600" },
                    { label: "V kase", text: `${totals.kasa >= 0 ? "" : "−"}${fmtCZK(Math.abs(totals.kasa))}`, cls: totals.kasa >= 0 ? "text-ink" : "text-red-600" },
                  ]
        }
      />

      {/* Kdo co smí: výběrčí jen sleduje; jinak každý (s finanční rolí) přidává,
          upravuje jen správce; zamčený ročník = jen náhled */}
      {vyberOnly ? (
        <div className="flex items-start gap-2 rounded-xl border border-gold-200 bg-gold-50 px-4 py-3 text-sm text-gold-800">
          <Icon name="finance" className="mt-0.5 h-4 w-4 shrink-0" />
          <span>Máš jen náhled — vidíš, kdo a kdy zaplatil. Zapisovat platby může ekonom nebo správce.</span>
        </div>
      ) : !canAdd ? (
        <div className="flex items-start gap-2 rounded-xl border border-gold-200 bg-gold-50 px-4 py-3 text-sm text-gold-800">
          <Icon name="finance" className="mt-0.5 h-4 w-4 shrink-0" />
          <span>Tento ročník je uzamčený — máš jen náhled.</span>
        </div>
      ) : (
        !canEdit && (
          <div className="flex items-start gap-2 rounded-xl border border-gold-200 bg-gold-50 px-4 py-3 text-sm text-gold-800">
            <Icon name="finance" className="mt-0.5 h-4 w-4 shrink-0" />
            <span>Můžeš přidávat položky i kasy. Upravovat a mazat zapsané může jen správce.</span>
          </div>
        )
      )}

      {/* ===== POHLED: KASY ===== */}
      {tab === "kasy" &&
      ((year.cashboxes?.length ?? 0) > 0 || canAdd) && (
        <section className="card p-4">
          <h2 className="mb-1 section-title">🧰 Denní kasy</h2>
          {(() => {
            const boxes = [...(year.cashboxes ?? [])]
              .filter((c) => (q.trim() ? normName(`${c.label ?? ""} ${fmtDate(c.openedAt)}`).includes(normName(q)) : true))
              .sort((a, b) => b.openedAt.localeCompare(a.openedAt));
            if ((year.cashboxes?.length ?? 0) === 0)
              return <p className="text-sm text-ink-soft">Zatím žádná kasa.</p>;
            if (boxes.length === 0) return <p className="py-4 text-center text-sm text-ink-soft">Žádná kasa neodpovídá hledání.</p>;
            return (
              <Collapsible peekClass="max-h-[620px]" expandable={boxes.length > 2} total={boxes.length}>
                <div className="space-y-3">
                  {boxes.map((c) => {
                    // Denní karta = stejná evidence jako v Prodeji (tržba, QR/hotově,
                    // kategorie, historie objednávek). Otevřená kasa má navíc uzávěrku.
                    const dayFin = boxDayFinances(year.finances ?? [], c, year.cashboxes ?? []);
                    return c.closedAt ? (
                      <DayCard key={c.id} box={c} stats={posStats(dayFin)} orders={posOrders(dayFin)} yearId={year.id} admin={canEdit} />
                    ) : (
                      <CashboxCard key={c.id} box={c} stats={posStats(dayFin)} orders={posOrders(dayFin)} yearId={year.id} canAdd={canAdd} canEdit={canEdit} />
                    );
                  })}
                </div>
              </Collapsible>
            );
          })()}
        </section>
      )}
      {/* Prodej bez kasy — starší prodeje, které nespadají pod žádnou kasu (jdou smazat) */}
      {tab === "kasy" && orphanSaleDays.length > 0 && (
        <SalesByDay days={orphanSaleDays} title="🧾 Prodej bez kasy" q={q} canDelete={canEdit} yearId={year.id} />
      )}

      {/* ===== POHLED: VÝBĚR (vklady) ===== */}
      {tab === "vyber" &&
      (contributions.length > 0 || canAdd || vyberOnly) && (
        <section id="vyber" className="card scroll-mt-20 p-4">
          <h2 className="mb-1 flex flex-wrap items-center gap-2 section-title">
            💰 Výběr (vklady)
            {vyber.returned > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-ink/[0.06] px-2.5 py-0.5 text-sm">
                <span className="text-xs font-normal text-ink-soft">vráceno</span>
                <span className="font-bold text-ink">−{fmtCZK(vyber.returned)}</span>
              </span>
            )}
          </h2>

          {/* Kdo zaplatil naposled — 2 nejnovější + rolovačka na další */}
          {recentPaid.length > 0 && (
            <div className="mb-4 rounded-xl border border-ink/10 bg-surface p-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-soft">🕐 Naposledy zaplatili</p>
              <ul className="space-y-1.5">
                {(recentOpen ? recentPaid : recentPaid.slice(0, 2)).map((c, i) => (
                  <li key={c.id} className="flex items-center gap-2 text-sm">
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-paper2 text-[11px] font-bold text-ink-soft">{i + 1}</span>
                    <span className="min-w-0 flex-1 truncate font-medium">{c.name}</span>
                    <span className="shrink-0 font-semibold text-leaf-700">+{fmtCZK(c.amount)}</span>
                    <span className="shrink-0 whitespace-nowrap text-xs text-ink-soft" title={fmtDateTime(c.paidAt)}>
                      {fmtRelative(c.paidAt!)}
                    </span>
                  </li>
                ))}
              </ul>
              {recentPaid.length > 2 && (
                <button
                  type="button"
                  onClick={() => setRecentOpen((v) => !v)}
                  aria-expanded={recentOpen}
                  className="mt-2 flex items-center gap-1 text-xs font-medium text-gold-700 hover:underline"
                >
                  {recentOpen ? "Zobrazit méně" : `Zobrazit další (${recentPaid.length - 2})`}
                  <Icon name="chevron" className={`h-3.5 w-3.5 transition-transform ${recentOpen ? "rotate-180" : ""}`} />
                </button>
              )}
            </div>
          )}

          {/* Hromadné vložení — všechna jména naráz + částka pro všechny */}
          {canAdd && vyberOpen && (
            <div className="mb-4 rounded-xl border border-gold-200 bg-gold-50/40 p-3">
              <label className="mb-1 block text-xs font-semibold text-ink-soft">Jména — každé na svůj řádek</label>
              <textarea
                className="input min-h-28"
                placeholder={"Adam Pavlík\nJana Nováková\nPetr Malý\n…"}
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                autoFocus
              />
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <input
                  className="input w-full sm:w-52"
                  inputMode="numeric"
                  placeholder={`Kolik se vybírá (${year.deposit ?? 2000} Kč)`}
                  value={bulkPledged}
                  onChange={(e) => setBulkPledged(e.target.value)}
                />
                <button className="btn-primary" onClick={addBulkContributions} disabled={!bulkText.trim()}>
                  + Přidat
                </button>
                {teamToAdd.length > 0 && (
                  <button
                    className="btn-ghost"
                    onClick={addTeamContributions}
                  >
                    👥 Doplnit tým ({teamToAdd.length})
                  </button>
                )}
              </div>
            </div>
          )}
          {contributions.length === 0 ? (
            <p className="text-sm text-ink-soft">
              Zatím nikdo.
            </p>
          ) : (
            <>
              {/* Filtry podle stavu platby */}
              <div className="mb-3 flex flex-wrap gap-1.5">
                {([
                  ["vse", "Vše", vyber.counts.vse],
                  ["zaplatil", "✓ Zaplatili", vyber.counts.zaplatil],
                  ["nezaplatil", "🔴 Nezaplatili", vyber.counts.nezaplatil],
                  ["pulka", "½ Půlku", vyber.counts.pulka],
                ] as [typeof ctFilter, string, number][]).map(([f, l, n]) => (
                  <button
                    key={f}
                    onClick={() => setCtFilter(f)}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                      ctFilter === f ? "bg-ink text-white" : "bg-white text-ink-soft ring-1 ring-ink/10 hover:bg-paper2"
                    }`}
                  >
                    {l} <span className={ctFilter === f ? "opacity-80" : "opacity-60"}>{n}</span>
                  </button>
                ))}
              </div>
              {filteredContributions.length === 0 ? (
                <p className="py-4 text-center text-sm text-ink-soft">V tomto filtru nikdo není.</p>
              ) : (
                <Collapsible peekClass="max-h-[320px]" expandable={filteredContributions.length > 4} total={filteredContributions.length}>
                  <ul className="space-y-2">
                    {[...filteredContributions]
                      .sort(
                        (a, b) =>
                          // nezaplacení nahoru, vrácení dolů, pak abecedně
                          Number(!!a.returned) - Number(!!b.returned) ||
                          Number(a.amount > 0) - Number(b.amount > 0) ||
                          a.name.localeCompare(b.name, "cs"),
                      )
                      .map((c) => (
                        <ContributionRow key={c.id} c={c} yearId={year.id} canEdit={canEdit} onEdit={() => setEditCt(c)} />
                      ))}
                  </ul>
                </Collapsible>
              )}
            </>
          )}
          {editCt && <ContributionEditModal c={editCt} yearId={year.id} onClose={() => setEditCt(null)} />}
        </section>
      )}

      {/* ===== POHLED: MERCH ===== */}
      {tab === "merch" && (
        merchIn > 0 || merchTotal > 0 || merchExtras.length > 0 || merchSaleDays.length > 0 ? (
          <div className="space-y-4">
            {/* Prodeje merche sečtené po dnech (jednotlivé platby uvnitř) */}
            <SalesByDay days={merchSaleDays} title="🧾 Prodeje po dnech" q={q} canDelete={canEdit} yearId={year.id} />
            {/* Nákupy zboží a ostatní (neprodejní položky kategorie merch) */}
            {merchExtras.length > 0 && (
              <section className="card p-4">
                <h2 className="mb-2 section-title">📦 Nákupy a ostatní</h2>
                <Collapsible peekClass="max-h-[220px]" expandable={merchExtras.length > 3} total={merchExtras.length}>
                  <div className="space-y-2">
                    {merchExtras.map((f) => (
                      <div key={f.id} className="flex flex-wrap items-center gap-x-3 gap-y-0.5 rounded-xl border border-ink/[0.05] bg-paper2/40 px-3 py-2 text-sm">
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
          </div>
        ) : (
          <div className="empty-state">
            Zatím žádný merch. Prodeje se sem zapíšou z Prodeje, nákupy zboží přidáš ve „Všechny finance“ (kategorie merch).
          </div>
        )
      )}

      {/* ===== POHLED: VŠECHNY FINANCE ===== */}
      {tab === "vse" && (
      <>
      {/* Tlačítka (filtr) — jen Vše / Zaplacené / Nezaplacené */}
      <div className="flex flex-wrap items-center gap-2">
        {([
          ["vse", "Vše"],
          ["zaplaceno", "Zaplacené"],
          ["nezaplaceno", "Nezaplacené"],
        ] as [Filter, string][]).map(([f, l]) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              filter === f ? "bg-ink text-white" : "bg-white text-ink-soft ring-1 ring-ink/10 hover:bg-paper2"
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      {/* Výdělek z prodeje a merche — sečtený po dnech (jednotlivé platby v Kasách/Merchi) */}
      {filter !== "nezaplaceno" && allSaleDays.length > 0 && (
        <SalesByDay days={allSaleDays} title="🧾 Výdělek z prodeje a merche" q={q} canDelete={canEdit} yearId={year.id} />
      )}
      {/* Přidat */}
      {open && (
        <div id="add-finance" className="card scroll-mt-20 space-y-3 p-4 ring-2 ring-gold-200">
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
              <input type="checkbox" checked={paid} onChange={(e) => setPaid(e.target.checked)} className="h-4 w-4 accent-gold-600" />
              {kind === "prijem" ? "Už vybráno / přišlo" : "Už zaplaceno / proplaceno"}
            </label>
            <button className="btn-primary ml-auto" onClick={add}>
              Uložit
            </button>
          </div>
        </div>
      )}

      {/* Seznam položek (výdaje, vklady…) */}
      <h2 className="border-b-2 border-gold-600/70 pb-1.5 section-title tracking-tight">Položky</h2>

      {/* Tabulka */}
      {rows.length === 0 ? (
        <div className="empty-state">
          {q.trim() || filter !== "vse" ? "Nic neodpovídá filtru ani hledání." : "Zatím žádné položky."}
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
                  <tr className="border-b border-ink/[0.06] text-left text-xs font-medium uppercase tracking-wide text-ink-soft">
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

      <div className="grid gap-4 md:grid-cols-2">
        {/* Souhrn po kategoriích */}
        {byCategory.length > 0 && (
          <div className="card p-5">
            <h2 className="mb-3 section-title">Souhrn po kategoriích</h2>
            <ul className="divide-y divide-black/[0.06]">
              {byCategory.map(([cat, v]) => (
                <li key={cat} className="flex items-center gap-3 py-2 text-sm">
                  <span className="min-w-0 break-words font-medium">{cat}</span>
                  <span className="ml-auto flex shrink-0 items-center gap-4">
                    {v.prijem > 0 && <span className="text-leaf-700">+{fmtCZK(v.prijem)}</span>}
                    {v.vydaj > 0 && <span className="text-ink-soft">−{fmtCZK(v.vydaj)}</span>}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Proplácení — kdo zaplatil a kolik mu vrátit */}
        {byPerson.length > 0 && (
          <div className="card p-5">
            <h2 className="mb-1 flex flex-wrap items-center gap-2 section-title">
              Proplácení po lidech
              {totalOwed > 0 && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-600/10 px-2.5 py-0.5 text-sm">
                  <span className="text-xs font-normal text-gold-700">vrátit celkem</span>
                  <span className="font-bold text-gold-700">{fmtCZK(totalOwed)}</span>
                </span>
              )}
            </h2>
            <p className="mb-2 text-xs text-ink-soft">Vrátit = výdaje dané osoby, které ještě nejsou proplacené (přepneš je na Zaplaceno u položky).</p>
            <ul className="divide-y divide-black/[0.06]">
              {byPerson.map(([who, v]) => (
                <li key={who} className="flex items-center gap-3 py-2 text-sm">
                  <span className="min-w-0 break-words font-medium">{who}</span>
                  <span className="ml-auto flex shrink-0 items-center gap-3">
                    {v.owed > 0 ? (
                      <span className="font-semibold text-gold-700">vrátit {fmtCZK(v.owed)}</span>
                    ) : (
                      <span className="text-leaf-700">✓ vyrovnáno</span>
                    )}
                    <span className="text-xs text-ink-soft">z {fmtCZK(v.total)}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      </>
      )}

      {/* Kasa modal — vždy dostupný (i z pohledu Kasy) */}
      <NewKasaModal open={kasaOpen} yearId={year.id} onClose={() => setKasaOpen(false)} />

      {/* Svítící zlatá lišta (mobil) — 4 hlavní pohledy, jako stánky v Prodeji.
          Výběrčí (vyberOnly) lištu nemá — má jen pohled Výběr. */}
      {!vyberOnly && (
      <div className="fixed inset-x-3 bottom-[calc(5.1rem+env(safe-area-inset-bottom))] z-40 md:hidden">
        <div className="mx-auto max-w-3xl">
          <div className="drop-in-bounce grid grid-cols-4 gap-1 rounded-[28px] border-2 border-gold-500 bg-paper/95 p-1.5 shadow-lg backdrop-blur">
            {FIN_TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => {
              setTab(t.id);
              setQ("");
            }}
                className={`flex min-h-12 flex-col items-center justify-center rounded-[22px] px-0.5 text-[11px] font-semibold leading-tight transition ${
                  tab === t.id ? "bg-gold-100 text-ink" : "text-ink-soft active:scale-[0.97]"
                }`}
              >
                <span className="text-base leading-none">{t.emoji}</span>
                <span className="mt-0.5 text-center">{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      )}
    </div>
  );
}

// 4 hlavní pohledy financí (svítící lišta jako stánky v Prodeji).
const FIN_TABS: { id: "vse" | "kasy" | "merch" | "vyber"; emoji: string; label: string }[] = [
  { id: "vse", emoji: "📊", label: "Všechny finance" },
  { id: "kasy", emoji: "🧰", label: "Kasy" },
  { id: "merch", emoji: "🛍️", label: "Merch" },
  { id: "vyber", emoji: "💰", label: "Výběr" },
];

// Základní přehled pohledu (výdělek / vklady / bilance) — buňky vedle sebe,
// přes celou šířku, hned pod hledáním. Text i barvu si volí každý pohled sám.
function SummaryStrip({ cells }: { cells: { label: string; text: string; cls?: string }[] }) {
  return (
    <div className="flex items-stretch overflow-hidden rounded-2xl border border-ink/[0.06] bg-surface text-center shadow-sm">
      {cells.map((c, i) => (
        <div key={c.label} className={`flex-1 px-2 py-3 ${i > 0 ? "border-l border-ink/[0.06]" : ""}`}>
          <p className="text-[9px] font-medium uppercase tracking-wide text-ink-soft sm:text-[10px]">{c.label}</p>
          <p className={`mt-0.5 font-display text-sm font-bold leading-tight sm:text-base ${c.cls ?? "text-ink"}`}>{c.text}</p>
        </div>
      ))}
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
        <span className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs ${isPrijem ? "bg-leaf/12 text-leaf-700" : "bg-ink/[0.05] text-ink-soft"}`}>
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
            className={`rounded-full px-2.5 py-1 text-xs font-medium transition ${item.paid ? "bg-leaf/12 text-leaf-700" : "bg-gold-500 text-[#1d1d1f]"}`}
          >
            {item.paid ? "Zaplaceno" : "Čeká"}
          </button>
        ) : (
          <span className={`badge ${item.paid ? "bg-leaf/12 text-leaf-700" : "bg-gold-500 text-[#1d1d1f]"}`}>
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
      <tr className="border-b border-ink/[0.06] bg-paper2/40 align-top">
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
    <tr className="border-b border-ink/[0.06] transition-colors hover:bg-paper2/40">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs ${isPrijem ? "bg-leaf/12 text-leaf-700" : "bg-ink/[0.05] text-ink-soft"}`}>
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
            className={`rounded-full px-2.5 py-1 text-xs font-medium transition ${item.paid ? "bg-leaf/12 text-leaf-700 hover:bg-leaf/20" : "bg-gold-500 text-[#1d1d1f] hover:bg-gold-400"}`}
          >
            {item.paid ? "Zaplaceno" : "Čeká"}
          </button>
        ) : (
          <span className={`badge ${item.paid ? "bg-leaf/12 text-leaf-700" : "bg-gold-500 text-[#1d1d1f]"}`}>
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
  const [images, setImages] = useState<string[]>([]);
  const [viewIdx, setViewIdx] = useState<number | null>(null);
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
  async function view(i: number) {
    setErr(false);
    // Načteme všechny účtenky položky, aby šlo listovat šipkami mezi nimi.
    const urls = await Promise.all(list.map((rid) => loadReceipt(rid, configured)));
    const ready = urls.filter(Boolean) as string[];
    if (!ready.length) { setErr(true); return; }
    setImages(ready);
    setViewIdx(Math.min(i, ready.length - 1));
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
          <button onClick={() => view(i)} className="font-medium hover:underline">
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

      <ImageViewer images={images} index={viewIdx} onIndex={setViewIdx} title="Účtenka" />
    </div>
  );
}

// Karta výběru (vkladu) — přehledná na mobilu: jméno + e-mail nahoře, zaplacená
// částka vpravo, barevný stavový pruh a dole akce. Po „Vrátit" se karta uzamkne
// (nedá se nic měnit, jen smazat).
function ContributionRow({ c, yearId, canEdit, onEdit }: { c: Contribution; yearId: string; canEdit: boolean; onEdit?: () => void }) {
  const { dispatch } = useStore();
  const [askReturn, setAskReturn] = useState(false);
  // Zbývá doplatit; „nothingYet" = založený dopředu, zatím nedal nic.
  const owes = c.pledged != null && c.pledged > c.amount ? c.pledged - c.amount : 0;
  const nothingYet = c.amount === 0 && owes > 0;
  const partial = c.amount > 0 && owes > 0;
  const fullyPaid = c.amount > 0 && owes === 0;

  // Barva karty + částky podle stavu.
  const card = c.returned
    ? "border-ink/10 bg-paper2/50"
    : nothingYet
      ? "border-red-200 bg-red-50/60"
      : partial
        ? "border-amber-200 bg-amber-50/60"
        : "border-leaf/30 bg-leaf/[0.06]";
  const amountColor = c.returned ? "text-ink-soft" : nothingYet ? "text-red-600" : partial ? "text-amber-700" : "text-leaf-700";

  return (
    <li className={`rounded-xl border p-3 ${card}`}>
      {/* Jméno + e-mail vlevo, zaplaceno / slíbeno vpravo */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className={`font-semibold leading-tight ${c.returned ? "text-ink-soft line-through" : "text-ink"}`}>{c.name}</p>
          {c.email && (
            <a href={`mailto:${c.email}`} className="mt-0.5 block break-all text-xs text-ink-soft hover:text-gold-700">
              ✉️ {c.email}
            </a>
          )}
          {c.phone && (
            <a href={`tel:${c.phone}`} className="mt-0.5 block break-all text-xs text-ink-soft hover:text-gold-700">
              📞 {c.phone}
            </a>
          )}
        </div>
        <div className="shrink-0 text-right leading-tight">
          <p className={`font-display text-lg font-bold ${amountColor}`}>{fmtCZK(c.amount)}</p>
          {c.pledged != null && <p className="text-[11px] text-ink-soft">z {fmtCZK(c.pledged)}</p>}
        </div>
      </div>

      {/* Stavový pruh + kdy naposledy zaplatil */}
      <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
        {c.returned ? (
          <span className="badge bg-ink/[0.06] text-ink-soft">
            🔒 Vráceno — uzamčeno
          </span>
        ) : nothingYet ? (
          <span className="badge bg-red-100 text-red-700">
            🔴 Nezaplaceno
          </span>
        ) : partial ? (
          <span className="badge bg-amber-100 text-amber-800">
            ⏳ Splátka — zbývá {fmtCZK(owes)}
          </span>
        ) : (
          <span className="badge bg-leaf/15 text-leaf-700">
            ✓ Zaplaceno
          </span>
        )}
        {c.paidAt && !c.returned && !nothingYet && (
          <span className="text-[11px] text-ink-soft" title={fmtDateTime(c.paidAt)}>
            🕐 zaplatil {fmtRelative(c.paidAt)}
          </span>
        )}
      </div>

      {/* Akce (jen správce). Po vrácení je karta uzamčená — jen smazat. */}
      {canEdit && (
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          {c.returned ? (
            <DeleteButton onConfirm={() => dispatch({ type: "removeContribution", yearId, contributionId: c.id })} what={`vklad — ${c.name}`} />
          ) : (
            <>
              {nothingYet && (
                <>
                  <button
                    onClick={() => dispatch({ type: "settleContribution", yearId, contributionId: c.id })}
                    className="rounded-full bg-leaf px-3 py-1.5 text-sm font-semibold text-white transition hover:opacity-90"
                    title={`Zaplatil celých ${fmtCZK(c.pledged!)}`}
                  >
                    💰 Dal celé
                  </button>
                  <button
                    onClick={() => dispatch({ type: "payContribution", yearId, contributionId: c.id, amount: Math.round(c.pledged! / 2) })}
                    className="rounded-full bg-amber-200/70 px-3 py-1.5 text-sm font-semibold text-amber-900 transition hover:bg-amber-200"
                    title={`Zaplatil půlku (${fmtCZK(Math.round(c.pledged! / 2))}) — zbytek se hlídá`}
                  >
                    ½ Půlku
                  </button>
                </>
              )}
              {partial && (
                <button
                  onClick={() => dispatch({ type: "settleContribution", yearId, contributionId: c.id })}
                  className="rounded-full bg-leaf px-3 py-1.5 text-sm font-semibold text-white transition hover:opacity-90"
                  title={`Doplatil zbytek ${fmtCZK(owes)} — vklad bude celých ${fmtCZK(c.pledged!)}`}
                >
                  ✓ Doplatil
                </button>
              )}
              {(fullyPaid || partial) && (
                <button
                  onClick={() => setAskReturn(true)}
                  className="rounded-full bg-paper2 px-3 py-1.5 text-sm font-medium text-ink-soft transition hover:bg-ink/5"
                  title="Vrátit vklad — karta se uzamkne"
                >
                  ↩︎ Vrátit
                </button>
              )}
              {/* Upravit: doplnit e-mail, telefon, opravit jméno / částku */}
              {onEdit && (
                <button
                  onClick={onEdit}
                  className="rounded-full bg-paper2 px-3 py-1.5 text-sm font-medium text-ink-soft transition hover:bg-ink/5"
                  title="Upravit jméno, e-mail, telefon nebo částku"
                >
                  ✏️ Upravit
                </button>
              )}
              {/* U nezaplacených jde rovnou smazat; u zaplacených se maže až po vrácení. */}
              {nothingYet && (
                <DeleteButton onConfirm={() => dispatch({ type: "removeContribution", yearId, contributionId: c.id })} what={`vklad — ${c.name}`} />
              )}
            </>
          )}
        </div>
      )}

      {/* Potvrzení vrácení — upozorní, že se karta uzamkne */}
      <Modal open={askReturn} onClose={() => setAskReturn(false)} title={`Vrátit vklad — ${c.name}`}>
        <p className="text-sm text-ink-soft">
          Označit jako <strong className="text-ink">vrácené</strong>? Karta se <strong className="text-ink">uzamkne</strong> — nepůjde už
          měnit ani doplácet, jen smazat.
        </p>
        <div className="mt-4 flex items-center gap-2">
          <button
            className="btn-primary flex-1"
            onClick={() => {
              dispatch({ type: "toggleContributionReturned", yearId, contributionId: c.id });
              setAskReturn(false);
            }}
          >
            Ano, vrátit a uzamknout
          </button>
          <button className="btn-ghost" onClick={() => setAskReturn(false)}>
            Zrušit
          </button>
        </div>
      </Modal>
    </li>
  );
}

// Úprava vkladu (zpětně) — doplnit e-mail a telefon, opravit jméno, částku
// nebo slíbenou částku. Placení/splátky/vrácení řeší tlačítka na kartě.
function ContributionEditModal({ c, yearId, onClose }: { c: Contribution; yearId: string; onClose: () => void }) {
  const { dispatch } = useStore();
  const [name, setName] = useState(c.name);
  const [email, setEmail] = useState(c.email ?? "");
  const [phone, setPhone] = useState(c.phone ?? "");
  const [amount, setAmount] = useState(String(c.amount));
  const [pledged, setPledged] = useState(c.pledged != null ? String(c.pledged) : "");

  async function save() {
    if (!name.trim()) return;
    await dispatch({
      type: "updateContribution",
      yearId,
      contributionId: c.id,
      patch: {
        name: name.trim(),
        email,
        phone,
        amount: parseAmount(amount),
        pledged: pledged.trim() ? parseAmount(pledged) : null,
      },
    });
    onClose();
  }

  return (
    <Modal open onClose={onClose} title={`Upravit — ${c.name}`}>
      <div className="space-y-3">
        <div>
          <label className="label">Jméno a příjmení</label>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
        </div>
        <div>
          <label className="label">E-mail</label>
          <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ty@email.cz" />
        </div>
        <div>
          <label className="label">Telefon</label>
          <input className="input" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+420…" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="label">Zaplatil (Kč)</label>
            <input className="input" inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>
          <div>
            <label className="label">Má dát celkem</label>
            <input
              className="input"
              inputMode="numeric"
              value={pledged}
              onChange={(e) => setPledged(e.target.value)}
              placeholder="prázdné = platí celé"
            />
          </div>
        </div>
        <div className="flex items-center gap-2 pt-1">
          <button className="btn-primary flex-1" onClick={save} disabled={!name.trim()}>
            Uložit
          </button>
          <button className="btn-ghost" onClick={onClose}>
            Zrušit
          </button>
        </div>
      </div>
    </Modal>
  );
}

// Otevřená denní kasa: stejná evidence jako v Prodeji (tržba, QR/hotově vedle
// sebe, kategorie, historie objednávek) + večerní uzávěrka. Markovaná hotovost
// se při uzavření nepočítá dvakrát (odečte se jako alreadyRecorded).
function CashboxCard({
  box,
  stats,
  orders,
  yearId,
  canAdd,
  canEdit,
}: {
  box: Cashbox;
  stats: ReturnType<typeof posStats>;
  orders: ReturnType<typeof posOrders>;
  yearId: string;
  canAdd: boolean;
  canEdit: boolean;
}) {
  const { dispatch } = useStore();
  const [closeVal, setCloseVal] = useState("");
  const expected = box.opening + stats.cash; // co má být večer v šuplíku

  function close() {
    const n = parseAmount(closeVal);
    if (closeVal.trim() === "" || !Number.isFinite(n)) return;
    dispatch({ type: "closeCashbox", yearId, cashboxId: box.id, closing: n, alreadyRecorded: stats.cash });
    setCloseVal("");
  }

  return (
    <section className="card border-l-4 border-l-amber-300 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-display text-base font-semibold">
          📅 {fmtDate(box.openedAt)}
          {box.label ? <span className="ml-1.5 font-normal text-ink-soft">· {box.label}</span> : null}
        </h3>
        <div className="flex items-center gap-2">
          <span className="chip bg-amber-100 text-amber-800">🟢 otevřeno</span>
          {canEdit && (
            <DeleteButton
              what={`kasu ${fmtDate(box.openedAt)} — smaže i všechny prodeje toho dne`}
              onConfirm={() => dispatch({ type: "removeCashbox", yearId, cashboxId: box.id })}
            />
          )}
        </div>
      </div>

      {/* Tržba vlevo (zeleně — kolik se zatím vydělalo), platby vpravo */}
      <div className="mt-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <span className="flex items-baseline gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-ink-soft">Tržba</span>
          <span className="font-display text-[22px] font-bold tracking-tight text-leaf-700">{fmtCZK(stats.takings)}</span>
        </span>
        <PayBreakdown qr={stats.qr} cash={stats.cash} count={stats.count} />
      </div>

      {stats.byCat.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {stats.byCat.map((x) => (
            <span key={x.cat} className="chip">
              {x.cat} {fmtCZK(x.sum)}
            </span>
          ))}
        </div>
      )}

      <OrderHistory orders={orders} canDelete={canEdit} yearId={yearId} />

      {/* Večerní uzávěrka */}
      <div className="mt-3 border-t border-ink/[0.06] pt-2">
        <p className="text-sm text-ink-soft">Ráno vklad {fmtCZK(box.opening)} · {fmtDateTime(box.openedAt)}</p>
        {canAdd ? (
          <>
            <p className="mt-1 text-sm">
              V kase má být: vklad {fmtCZK(box.opening)} + hotově {fmtCZK(stats.cash)} ={" "}
              <strong className="font-display">{fmtCZK(expected)}</strong>
            </p>
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
          </>
        ) : (
          <p className="mt-1 text-xs text-ink-soft">Kasa je otevřená.</p>
        )}
      </div>
    </section>
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
    flash("Kasa přidána", "🧾");
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
        className="mt-1.5 flex w-full items-center justify-center gap-1 rounded-xl py-1.5 text-sm font-medium text-ink-soft transition hover:bg-ink/[0.04]"
      >
        {expanded ? "Sbalit" : `Zobrazit vše (${total})`}
        <Icon name="chevron" className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
      </button>
    </>
  );
}

// Prodej po dnech — jednotlivé markované platby (z Prodeje / merche) sečtené
// do jednoho dne (kasa dne). Ťuknutím na den se rozbalí rozpis plateb.
function SalesByDay({ days, title, q, canDelete, yearId }: { days: SaleDay[]; title: string; q: string; canDelete: boolean; yearId: string }) {
  if (days.length === 0) return null;
  const view = q.trim() ? days.filter((d) => normName(fmtDate(d.day)).includes(normName(q))) : days;
  const count = days.reduce((s, d) => s + d.count, 0);
  const sum = days.reduce((s, d) => s + d.total, 0);
  return (
    <section className="card p-4">
      <h2 className="flex flex-wrap items-center gap-2 section-title">
        {title}
        <span className="chip">{count}×</span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-leaf/12 px-2.5 py-0.5 text-sm">
          <span className="text-xs font-normal text-leaf-700">celkem</span>
          <span className="font-bold text-leaf-700">+{fmtCZK(sum)}</span>
        </span>
      </h2>
      {view.length === 0 ? (
        <p className="py-3 text-center text-sm text-ink-soft">Žádný den neodpovídá hledání.</p>
      ) : (
        <div className="mt-3 space-y-2">
          {view.map((d) => (
            <SaleDayRow key={d.day} d={d} canDelete={canDelete} yearId={yearId} />
          ))}
        </div>
      )}
    </section>
  );
}

function SaleDayRow({ d, canDelete, yearId }: { d: SaleDay; canDelete: boolean; yearId: string }) {
  const { dispatch } = useStore();
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-hidden rounded-xl border border-ink/[0.06] bg-paper2/40">
      <button onClick={() => setOpen((o) => !o)} className="flex w-full items-center gap-2 px-3 py-2.5 text-left" aria-expanded={open}>
        <span className="font-semibold">📅 {fmtDate(d.day)}</span>
        <span className="chip">{d.count}×</span>
        <span className="ml-auto flex items-center gap-2">
          {(d.qr > 0 || d.cash > 0) && (
            <span className="hidden text-xs text-ink-soft sm:inline">
              {d.qr > 0 && `QR ${fmtCZK(d.qr)}`}
              {d.qr > 0 && d.cash > 0 && " · "}
              {d.cash > 0 && `💵 ${fmtCZK(d.cash)}`}
            </span>
          )}
          <span className="font-display font-bold text-leaf-700">+{fmtCZK(d.total)}</span>
          <span className={`text-xs transition-transform ${open ? "rotate-180" : ""}`}>▾</span>
        </span>
      </button>
      {open && (
        <div className="border-t border-ink/[0.06]">
          <ul className="max-h-72 space-y-1 overflow-y-auto px-3 py-2">
            {d.orders.map((o) => (
              <SaleLine key={o.id} o={o} canDelete={canDelete} yearId={yearId} />
            ))}
          </ul>
          {/* Správce může smazat celý den (prodej se odečte z tržeb). */}
          {canDelete && (
            <div className="flex justify-end border-t border-ink/[0.06] px-3 py-2">
              <DeleteButton
                label="Smazat celý den"
                what={`všechny prodeje dne ${fmtDate(d.day)} (${d.count}×, ${fmtCZK(d.total)})`}
                onConfirm={() => dispatch({ type: "removeSales", yearId, financeIds: d.orders.map((o) => o.id) })}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Jeden prodej v rozpisu dne. Správce ho může smazat (✕ s potvrzením) —
// odečte se z tržeb a případná navázaná merch objednávka se uklidí.
function SaleLine({ o, canDelete, yearId }: { o: SaleOrder; canDelete: boolean; yearId: string }) {
  const { dispatch } = useStore();
  const [ask, setAsk] = useState(false);
  return (
    <li className="flex items-center gap-2 rounded-lg bg-surface px-2.5 py-1.5 text-sm">
      <span className="shrink-0 tabular-nums text-xs text-ink-soft">{hhmmFin(o.at)}</span>
      <span className="min-w-0 flex-1 truncate">{o.items}</span>
      {o.cat && <span className="chip shrink-0 text-[11px]">{o.cat}</span>}
      {o.how && <span className="shrink-0 text-xs text-ink-soft">{o.how === "QR" ? "QR" : "💵"}</span>}
      <span className="shrink-0 font-semibold tabular-nums">{fmtCZK(o.amount)}</span>
      {canDelete && (
        <button
          onClick={() => setAsk(true)}
          className="shrink-0 rounded-full px-1 leading-none text-ink-soft/70 transition hover:text-red-600"
          aria-label="Smazat prodej"
          title="Smazat prodej"
        >
          ✕
        </button>
      )}
      <Modal open={ask} onClose={() => setAsk(false)} title="Smazat prodej?">
        <p className="text-sm text-ink-soft">
          Smazat prodej <strong className="text-ink">{o.items}</strong> ({fmtCZK(o.amount)})? Odečte se z tržeb a nejde to vrátit.
        </p>
        <div className="mt-4 flex items-center gap-2">
          <button
            className="btn-primary flex-1"
            onClick={() => {
              dispatch({ type: "removeSales", yearId, financeIds: [o.id] });
              setAsk(false);
            }}
          >
            Ano, smazat
          </button>
          <button className="btn-ghost" onClick={() => setAsk(false)}>
            Ne
          </button>
        </div>
      </Modal>
    </li>
  );
}

// „Moje výdaje" — pohled pro lidi bez finanční role: zapíšou, co zaplatili
// (propíše se do financí jako výdaj k proplacení, se jménem), a vidí jen
// svoje položky se stavem proplacení. Zbytek financí nevidí.
function MyExpenses({ yearId, me, items, canSubmit }: { yearId: string; me: string; items: FinanceItem[]; canSubmit: boolean }) {
  const { dispatch } = useStore();
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(todayISO());
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  const mine = items
    .filter((f) => f.who && normName(f.who) === normName(me))
    .sort((a, b) => (b.date || b.createdAt).localeCompare(a.date || a.createdAt));
  const owed = mine.filter((f) => f.kind === "vydaj" && !f.paid).reduce((s, f) => s + f.amount, 0);

  async function submit() {
    const num = parseAmount(amount);
    if (!label.trim() || num <= 0 || busy) return;
    setBusy(true);
    try {
      const ok = await dispatch({
        type: "addFinance",
        yearId,
        kind: "vydaj",
        label: label.trim(),
        amount: num,
        who: me,
        paid: false,
        date: date || undefined,
        note: note.trim() || undefined,
      });
      if (!ok) {
        flash("Nepodařilo se uložit — zkontroluj připojení", "⚠️");
        return;
      }
      setLabel("");
      setAmount("");
      setNote("");
      setDate(todayISO());
      flash("Zapsáno — ekonom to uvidí ve financích", "💸");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4 tabular-nums">
      <div>
        <PageTitle>Moje výdaje</PageTitle>
      </div>

      {canSubmit ? (
        <section className="card space-y-2 p-4">
          <h2 className="section-title">💸 Zapsat výdaj</h2>
          <input className="input w-full" placeholder="Za co? (např. Kelímky Makro)" value={label} onChange={(e) => setLabel(e.target.value)} />
          <div className="flex flex-wrap gap-2">
            <input className="input w-32" inputMode="numeric" placeholder="Kč" value={amount} onChange={(e) => setAmount(e.target.value)} />
            <input className="input w-40" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <input className="input w-full" placeholder="Poznámka (nepovinné)" value={note} onChange={(e) => setNote(e.target.value)} />
          <button className="btn-primary w-full" onClick={submit} disabled={!label.trim() || !amount.trim() || busy}>
            Zapsat výdaj
          </button>
          <p className="text-xs text-ink-soft">Účtenku si schovej — ekonom si ji může vyžádat k proplacení.</p>
        </section>
      ) : (
        <p className="card p-3 text-sm text-ink-soft">Uzamčený ročník — výdaje jde jen prohlížet.</p>
      )}

      <section className="card p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="section-title">Moje položky</h2>
          {owed > 0 && (
            <span className="badge bg-amber-100 text-amber-800">
              čeká na proplacení {fmtCZK(owed)}
            </span>
          )}
        </div>
        {mine.length === 0 ? (
          <p className="mt-2 text-sm text-ink-soft">Zatím nic — první zapsaný výdaj se tu objeví.</p>
        ) : (
          <div className="mt-1 divide-y divide-ink/[0.06]">
            {mine.map((f) => (
              <div key={f.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2">
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-medium">{f.label}</p>
                  <p className="text-xs text-ink-soft">
                    {fmtDate(f.date || f.createdAt)}
                    {f.note ? ` · ${f.note}` : ""}
                  </p>
                </div>
                <span className="text-[15px] font-semibold">{fmtCZK(f.amount)}</span>
                {f.kind === "vydaj" ? (
                  f.paid ? (
                    <span className="chip bg-leaf/15 text-leaf-700">✓ proplaceno</span>
                  ) : (
                    <span className="chip bg-amber-100 text-amber-800">⏳ čeká</span>
                  )
                ) : (
                  <span className="chip">příjem</span>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
