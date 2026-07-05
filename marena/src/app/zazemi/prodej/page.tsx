"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { Icon } from "@/components/Icons";
import { Modal } from "@/components/Modal";
import { PayQr } from "@/components/PayQr";
import { parseAccount } from "@/lib/payment";
import { fmtCZK, todayISO } from "@/lib/format";
import { uid } from "@/lib/id";
import { isAdmin } from "@/lib/admin";
import { flash } from "@/components/Flash";

// Prodej — jednotná pokladna pro celý festival (vzor z restauračních a
// festivalových POS: Toast, Square, Dotykačka, NFCtron). Obsluha si vybere
// svůj stánek (zařízení si volbu pamatuje), ťuká položky — nejprodávanější
// první — a platí se QR platbou nebo hotově, vždy s volbou způsobu.
// Do financí se zapisuje až PO zaplacení, odděleně po kategoriích
// (merch / bar / kuchyně / kasa) + kdo markoval a jak bylo placeno,
// takže se peníze nemíchají. Merch prodej vytvoří rovnou vyřízenou
// a uzamčenou objednávku (sklad i seznam v Merchi sedí).

type Kind = "merch" | "bar" | "kuchyne" | "custom";
type Stand = "vse" | "merch" | "bar" | "kuchyne" | "ostatni";

type Line = {
  key: string;
  kind: Kind;
  productId?: string;
  name: string;
  size?: string;
  color?: string;
  price: number;
  qty: number;
};

const STANDS: { id: Stand; label: string }[] = [
  { id: "vse", label: "Vše" },
  { id: "merch", label: "Merch" },
  { id: "bar", label: "Bar" },
  { id: "kuchyne", label: "Kuchyně" },
  { id: "ostatni", label: "Ostatní" },
];

// Slovo do zprávy pro banku, kategorie financí a barva dlaždic (obsluha
// hledá barvou dřív než čtením — vzor z barových POS).
const KIND_WORD: Record<Kind, string> = { merch: "MERCH", bar: "BAR", kuchyne: "JIDLO", custom: "KASA" };
const KIND_CATEGORY: Record<Exclude<Kind, "merch">, string> = { bar: "bar", kuchyne: "kuchyně", custom: "kasa" };
const KIND_BORDER: Record<Kind, string> = {
  merch: "border-l-gold-500",
  bar: "border-l-sky-500",
  kuchyne: "border-l-emerald-500",
  custom: "border-l-zinc-400",
};

const LS_STAND = "marena_pos_stand";
const LS_TALLY = "marena_pos_tally";

const lineLabel = (l: Line) =>
  `${l.name}${[l.size, l.color].filter(Boolean).length ? ` (${[l.size, l.color].filter(Boolean).join(" · ")})` : ""}`;

export default function ProdejPage() {
  const { currentYear, canEditCurrentYear } = useStore();
  if (!currentYear) return null;
  if (!canEditCurrentYear) {
    return (
      <div className="card p-6 text-center text-sm text-ink-soft">
        Prodej je jen pro aktuální ročník — uzamčené ročníky se prohlížejí.
      </div>
    );
  }
  // key: při přepnutí ročníku se rozmarkovaná účtenka zahodí.
  return <Pos key={currentYear.id} />;
}

function Pos() {
  const { currentYear, me, dispatch } = useStore();
  const [stand, setStand] = useState<Stand>("vse");
  const [lines, setLines] = useState<Line[]>([]);
  const [lastSale, setLastSale] = useState<Line[] | null>(null);
  const [tally, setTally] = useState<Record<string, number>>({});
  const [picker, setPicker] = useState<{ productId: string; size?: string; color?: string } | null>(null);
  const [qrOpen, setQrOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customPrice, setCustomPrice] = useState("");
  const year = currentYear;

  // Stánek: z odkazu (?stand=merch) nebo z minula — zařízení u baru
  // zůstává barem (vzor „zamčeného terminálu" z festivalových pokladen).
  useEffect(() => {
    // Odloženě (mimo tělo efektu), ať se stav nemění synchronně při renderu.
    const t = setTimeout(() => {
      const fromUrl = new URLSearchParams(window.location.search).get("stand");
      const stored = localStorage.getItem(LS_STAND);
      const pick = [fromUrl, stored].find((s) => STANDS.some((x) => x.id === s));
      if (pick) setStand(pick as Stand);
      try {
        setTally(JSON.parse(localStorage.getItem(LS_TALLY) ?? "{}"));
      } catch {
        /* poškozený záznam — začne se od nuly */
      }
    }, 0);
    return () => clearTimeout(t);
  }, []);
  function pickStand(s: Stand) {
    setStand(s);
    localStorage.setItem(LS_STAND, s);
  }

  if (!year) return null;

  const account = year.paymentAccount ?? "";
  const accountOk = !!account && !("error" in parseAccount(account));

  // Nabídka po druzích; nejprodávanější dlaždice první (podle prodejů
  // z tohoto zařízení — barový vzor „top sellers first").
  const bySold = (a: { id: string }, b: { id: string }) => (tally[b.id] ?? 0) - (tally[a.id] ?? 0);
  const grids: { kind: Exclude<Kind, "custom">; title: string; items: { id: string; name: string; price: number }[] }[] = [
    {
      kind: "merch" as const,
      title: "Merch",
      items: (year.merch ?? []).filter((p) => p.price != null && p.price > 0).map((p) => ({ id: p.id, name: p.name, price: p.price! })).sort(bySold),
    },
    {
      kind: "bar" as const,
      title: "Pití (bar)",
      items: (year.bar ?? [])
        .filter((d) => (d.place ?? "bar") === "bar" && d.price != null && d.price > 0)
        .map((d) => ({ id: d.id, name: d.name, price: d.price! }))
        .sort(bySold),
    },
    {
      kind: "kuchyne" as const,
      title: "Jídlo (kuchyně)",
      items: (year.bar ?? [])
        .filter((d) => (d.place ?? "bar") === "kuchyne" && d.price != null && d.price > 0)
        .map((d) => ({ id: d.id, name: d.name, price: d.price! }))
        .sort(bySold),
    },
  ].filter((g) => (stand === "vse" ? true : g.kind === stand));
  const showCustom = stand === "vse" || stand === "ostatni";

  const pickerProduct = picker ? (year.merch ?? []).find((p) => p.id === picker.productId) : undefined;
  const total = lines.reduce((s, l) => s + l.price * l.qty, 0);
  const kinds = [...new Set(lines.map((l) => l.kind))];
  const kindsWord =
    kinds.length === 1
      ? KIND_WORD[kinds[0]]
      : kinds.every((k) => k === "bar" || k === "kuchyne")
        ? "JIDLO A PITI"
        : "KASA";
  const qrMessage = `MARENA ${kindsWord} ${lines.map((l) => `${l.qty}X ${lineLabel(l)}`).join(", ")}`;

  // Dnešní tržby z prodeje — celkem + QR vs. hotově (kasař hned vidí,
  // kolik hotovosti má sedět v kase) + rozpad po kategoriích.
  const today = todayISO();
  const posCats = new Set(["merch", "bar", "kuchyně", "kasa"]);
  const todaySales = (year.finances ?? []).filter(
    (f) => f.kind === "prijem" && (f.date ?? f.createdAt.slice(0, 10)) === today && posCats.has(f.category ?? ""),
  );
  const sumBy = (pred: (note: string) => boolean) => todaySales.filter((f) => pred(f.note ?? "")).reduce((s, f) => s + f.amount, 0);
  const todayTotal = todaySales.reduce((s, f) => s + f.amount, 0);
  const todayQr = sumBy((n) => n.includes("QR platba"));
  const todayCash = sumBy((n) => n.includes("hotově"));
  const todayByCat = [...posCats]
    .map((c) => ({ cat: c, sum: todaySales.filter((f) => f.category === c).reduce((s, f) => s + f.amount, 0) }))
    .filter((x) => x.sum > 0);

  // Klíč řádku nese id, variantu i cenu — stejně pojmenované položky
  // s jinou cenou se nesmí slít do jedné.
  function addLine(kind: Kind, name: string, price: number, productId?: string, size?: string, color?: string) {
    setLines((prev) => {
      const key = `${kind}|${productId ?? name}|${size ?? ""}|${color ?? ""}|${price}`;
      const i = prev.findIndex((l) => l.key === key);
      if (i >= 0) return prev.map((l, j) => (j === i ? { ...l, qty: l.qty + 1 } : l));
      return [...prev, { key, kind, productId, name, size, color, price, qty: 1 }];
    });
  }
  function bump(key: string, delta: number) {
    setLines((prev) =>
      prev.flatMap((l) => (l.key === key ? (l.qty + delta <= 0 ? [] : [{ ...l, qty: l.qty + delta }]) : [l])),
    );
  }
  // Ťuknutí na dlaždici: merch s velikostmi/barvami se doptá (chipy),
  // všechno ostatní letí rovnou do účtenky.
  function tapItem(kind: Kind, item: { id: string; name: string; price: number }) {
    const product = kind === "merch" ? (year!.merch ?? []).find((p) => p.id === item.id) : undefined;
    if (product && ((product.sizes?.length ?? 0) > 0 || (product.colors?.length ?? 0) > 0)) {
      setPicker({ productId: product.id });
      return;
    }
    addLine(kind, item.name, item.price, item.id);
  }
  function confirmPicker() {
    if (!picker || !pickerProduct) return;
    addLine("merch", pickerProduct.name, pickerProduct.price!, pickerProduct.id, picker.size, picker.color);
    setPicker(null);
  }
  function addCustom() {
    const price = Math.round(Number(customPrice.replace(",", ".")));
    if (!customName.trim() || !Number.isFinite(price) || price <= 0) return;
    addLine("custom", customName.trim(), price);
    setCustomName("");
    setCustomPrice("");
  }

  // Zápis prodeje po zaplacení. Hlídá výsledek každého uložení: co se
  // nezapsalo, zůstává na účtence (po výpadku sítě jde zkusit znovu a nic
  // se nezapíše dvakrát). Merch → uzamčená zaplacená objednávka (sklad +
  // finance kategorie merch), zbytek → finance po kategoriích.
  async function settle(how: "qr" | "hotove") {
    if (!year || lines.length === 0 || busy) return;
    setBusy(true);
    try {
      const howText = how === "hotove" ? "hotově" : "QR platba";
      const merch = lines.filter((l) => l.kind === "merch");
      const written = new Set<string>();
      let ok = true;

      if (merch.length > 0) {
        const orderId = uid("mo_");
        ok = await dispatch({
          type: "addMerchOrder",
          yearId: year.id,
          id: orderId,
          name: "Prodej na místě",
          note: `markoval(a): ${me} · ${howText}`,
          items: merch.map((l) => ({ productId: l.productId!, name: l.name, size: l.size, color: l.color, price: l.price, qty: l.qty })),
        });
        if (ok) ok = await dispatch({ type: "settleMerchOrder", yearId: year.id, orderId, how: howText });
        if (ok) merch.forEach((l) => written.add(l.key));
      }
      for (const kind of ["bar", "kuchyne", "custom"] as const) {
        if (!ok) break;
        const group = lines.filter((l) => l.kind === kind);
        if (group.length === 0) continue;
        ok = await dispatch({
          type: "addFinance",
          yearId: year.id,
          kind: "prijem",
          label: "Prodej na místě",
          amount: group.reduce((s, l) => s + l.price * l.qty, 0),
          category: KIND_CATEGORY[kind],
          who: me,
          paid: true,
          date: todayISO(),
          note: group.map((l) => `${l.qty}× ${lineLabel(l)}`).join(", ") + ` · ${howText}`,
        });
        if (ok) group.forEach((l) => written.add(l.key));
      }

      if (!ok) {
        setLines((prev) => prev.filter((l) => !written.has(l.key)));
        flash("Nezapsáno — zkontroluj připojení a zkus to znovu", "⚠️");
        return;
      }

      // „Top sellers first": započítej prodané kusy pro řazení dlaždic.
      const t = { ...tally };
      for (const l of lines) if (l.productId) t[l.productId] = (t[l.productId] ?? 0) + l.qty;
      setTally(t);
      localStorage.setItem(LS_TALLY, JSON.stringify(t));

      setLastSale(lines);
      setLines([]);
      setQrOpen(false);
      flash(`Zaplaceno ${fmtCZK(total)} (${howText}) — zapsáno`, "💰");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4 tabular-nums">
      <div>
        <h1 className="font-display text-[28px] font-bold tracking-tight">Prodej</h1>
        <p className="mt-0.5 text-sm text-ink-soft">Ťukni položky, vyber QR nebo hotově, po zaplacení zapiš — finance a sklad se srovnají samy.</p>
      </div>

      {/* Výběr stánku — zařízení si volbu pamatuje */}
      <div className="flex gap-1.5 overflow-x-auto pb-0.5">
        {STANDS.map((s) => (
          <button
            key={s.id}
            onClick={() => pickStand(s.id)}
            className={`min-h-9 shrink-0 rounded-full px-4 text-sm font-semibold transition ${
              stand === s.id ? "bg-gold-500 text-[#1d1d1f]" : "bg-paper2 text-ink-soft hover:bg-gold-100"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Dnešní tržby — QR vs. hotovost (tolik má sedět v kase) */}
      {todayTotal > 0 && (
        <div className="card flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-2.5 text-sm">
          <span>
            Dnes <strong className="font-display text-base">{fmtCZK(todayTotal)}</strong>
          </span>
          <span className="text-ink-soft">QR {fmtCZK(todayQr)}</span>
          <span className="text-ink-soft">💵 hotově {fmtCZK(todayCash)}</span>
          <span className="ml-auto flex flex-wrap gap-1">
            {todayByCat.map((x) => (
              <span key={x.cat} className="chip">
                {x.cat} {fmtCZK(x.sum)}
              </span>
            ))}
          </span>
        </div>
      )}

      {!accountOk && (
        <p className="card p-3 text-sm text-amber-700">
          ⚠️ {isAdmin(me) ? "Nastav dole účet pro QR platby — do té doby vybírej hotově." : "Správce zatím nenastavil účet pro QR platby — zatím vybírej hotově."}
        </p>
      )}

      {/* Nabídka stánku */}
      {grids.map(
        (g) =>
          g.items.length > 0 && (
            <section key={g.kind} className="card p-4">
              <h2 className="font-display text-[20px] font-semibold">{g.title}</h2>
              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {g.items.map((i) => (
                  <button
                    key={i.id}
                    onClick={() => tapItem(g.kind, i)}
                    className={`flex min-h-11 items-center justify-between gap-2 rounded-lg border-l-4 bg-paper2 px-3 py-2.5 text-left transition hover:bg-gold-100 active:scale-[0.98] ${KIND_BORDER[g.kind]}`}
                  >
                    <span className="min-w-0 truncate text-[15px] font-medium">{i.name}</span>
                    <span className="shrink-0 text-sm font-semibold text-ink-soft">{fmtCZK(i.price)}</span>
                  </button>
                ))}
              </div>
            </section>
          ),
      )}

      {/* Doptání na velikost/barvu (merch s variantami) */}
      {picker && pickerProduct && (
        <div className="card border border-gold-300 bg-gold-50 p-4">
          <p className="text-sm font-semibold">{pickerProduct.name}</p>
          {(pickerProduct.sizes?.length ?? 0) > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {pickerProduct.sizes!.map((s) => (
                <button
                  key={s}
                  onClick={() => setPicker((p) => p && { ...p, size: p.size === s ? undefined : s })}
                  className={`min-h-9 rounded-full px-3 text-sm font-semibold transition ${
                    picker.size === s ? "bg-gold-500 text-[#1d1d1f]" : "bg-paper2 hover:bg-gold-100"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
          {(pickerProduct.colors?.length ?? 0) > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {pickerProduct.colors!.map((c) => (
                <button
                  key={c}
                  onClick={() => setPicker((p) => p && { ...p, color: p.color === c ? undefined : c })}
                  className={`min-h-9 rounded-full px-3 text-sm font-semibold transition ${
                    picker.color === c ? "bg-gold-500 text-[#1d1d1f]" : "bg-paper2 hover:bg-gold-100"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          )}
          <div className="mt-2 flex gap-2">
            <button className="btn-primary flex-1" onClick={confirmPicker} disabled={(pickerProduct.sizes?.length ?? 0) > 0 && !picker.size}>
              Přidat na účtenku
            </button>
            <button className="btn-ghost" onClick={() => setPicker(null)}>
              Zrušit
            </button>
          </div>
        </div>
      )}

      {/* Vlastní položka (vstupné, kelímek…) */}
      {showCustom && (
        <section className="card space-y-2 p-4">
          <h2 className="font-display text-[20px] font-semibold">Vlastní položka</h2>
          <div className="flex flex-wrap items-center gap-2">
            <input className="input min-w-[140px] flex-1" placeholder="Co prodáváš?" value={customName} onChange={(e) => setCustomName(e.target.value)} />
            <input className="input w-28" placeholder="Kč" inputMode="numeric" value={customPrice} onChange={(e) => setCustomPrice(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addCustom()} />
            <button className="btn-secondary px-4" onClick={addCustom} disabled={!customName.trim() || !customPrice.trim()}>
              + Přidat
            </button>
          </div>
        </section>
      )}

      {/* Účtenka */}
      <section className="card p-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-display text-[20px] font-semibold">Účtenka</h2>
          {lines.length === 0 && lastSale && (
            <button className="btn-secondary" onClick={() => setLines(lastSale)}>
              ↻ Zopakovat poslední
            </button>
          )}
        </div>
        {lines.length === 0 ? (
          <p className="mt-2 text-sm text-ink-soft">Zatím prázdná — ťukni nahoře na položky.</p>
        ) : (
          <div className="mt-2 divide-y divide-ink/[0.06]">
            {lines.map((l) => (
              <div key={l.key} className="flex min-h-11 items-center gap-2 py-1.5">
                <span className="min-w-0 flex-1 truncate text-[15px] font-medium">{lineLabel(l)}</span>
                <span className="text-sm text-ink-soft">{fmtCZK(l.price)}</span>
                <div className="flex items-center gap-1">
                  <button className="grid h-9 w-9 place-items-center rounded-full bg-paper2 text-lg leading-none hover:bg-ink/10" onClick={() => bump(l.key, -1)} aria-label="Ubrat">
                    −
                  </button>
                  <span className="w-7 text-center text-[15px] font-semibold">{l.qty}</span>
                  <button className="grid h-9 w-9 place-items-center rounded-full bg-paper2 text-lg leading-none hover:bg-ink/10" onClick={() => bump(l.key, 1)} aria-label="Přidat">
                    +
                  </button>
                </div>
                <span className="w-20 text-right text-[15px] font-semibold">{fmtCZK(l.price * l.qty)}</span>
              </div>
            ))}
          </div>
        )}

        <div className="mt-3 flex items-center justify-between border-t border-ink/10 pt-3">
          <span className="text-[15px] font-medium text-ink-soft">Celkem</span>
          <span className="font-display text-[28px] font-bold tracking-tight">{fmtCZK(total)}</span>
        </div>

        {/* Vždy se volí, jak se platilo: QR, nebo hotově */}
        <div className="mt-3 flex flex-wrap gap-2">
          <button className="btn-primary flex-1" disabled={total <= 0 || !accountOk || busy} onClick={() => setQrOpen(true)}>
            <Icon name="vote" className="h-4 w-4" /> QR platba
          </button>
          <button className="btn-secondary flex-1" disabled={total <= 0 || busy} onClick={() => settle("hotove")}>
            💵 Hotově — zapsat
          </button>
          {lines.length > 0 && (
            <button className="btn-ghost" onClick={() => setLines([])}>
              Vyčistit
            </button>
          )}
        </div>
      </section>

      {/* Účet pro QR platby (jen správce) */}
      {isAdmin(me) && <AccountSettings account={account} yearId={year.id} />}

      {/* QR platba — zákazník skenuje, obsluha po zaplacení potvrdí. */}
      <Modal open={qrOpen} onClose={() => setQrOpen(false)} title="Zaplať naskenováním">
        <div className="space-y-4">
          <PayQr account={account} amount={total} message={qrMessage} />
          <p className="text-center text-xs text-ink-soft">
            „Zaplaceno“ ťukni, až přijde notifikace tvé banky — obrazovka zákazníka není důkaz.
          </p>
          <div className="flex gap-2">
            <button className="btn-primary flex-1" disabled={busy} onClick={() => settle("qr")}>
              ✓ Zaplaceno — zapsat
            </button>
            <button className="btn-ghost" onClick={() => setQrOpen(false)}>
              Zrušit
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// Nastavení účtu (jen správce) — přijme český formát i IBAN, hned ověří součty.
function AccountSettings({ account, yearId }: { account: string; yearId: string }) {
  const { dispatch } = useStore();
  const [value, setValue] = useState(account);
  const [saved, setSaved] = useState(false);
  const parsed = value.trim() ? parseAccount(value) : null;

  async function save() {
    if (!parsed || "error" in parsed) return;
    if (!(await dispatch({ type: "updateYear", yearId, patch: { paymentAccount: value.trim() } }))) {
      flash("Účet se nepodařilo uložit — zkontroluj připojení", "⚠️");
      return;
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    flash("Účet pro platby uložen", "🏦");
  }

  return (
    <section className="card space-y-2 p-4">
      <h2 className="font-display text-[20px] font-semibold">🏦 Účet pro QR platby</h2>
      <div className="flex flex-wrap items-center gap-2">
        <input
          className="input min-w-[220px] flex-1"
          placeholder="123456789/0800 nebo IBAN CZ…"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button className="btn-primary px-4" onClick={save} disabled={!parsed || "error" in parsed}>
          {saved ? "✓ Uloženo" : "Uložit"}
        </button>
      </div>
      {parsed && ("error" in parsed ? (
        <p className="text-sm text-red-600">{parsed.error}</p>
      ) : (
        <p className="text-sm text-leaf-700">✓ Platný účet · IBAN {parsed.iban}</p>
      ))}
      {!value.trim() && <p className="text-sm text-ink-soft">Zadej účet, na který mají chodit platby z prodeje i online objednávek merche.</p>}
    </section>
  );
}
