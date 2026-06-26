"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { Icon } from "@/components/Icons";
import { Modal } from "@/components/Modal";
import { DeleteButton } from "@/components/DeleteButton";
import { compressImage, readFileAsDataUrl, saveReceipt, loadReceipt, deleteReceipt } from "@/lib/receipts";
import { fmtCZK, fmtDate } from "@/lib/format";
import { uid } from "@/lib/id";
import { isAdmin } from "@/lib/admin";
import type { KitchenFile, Drink, DrinkKind, DrinkIngredient } from "@/lib/types";

type Place = "kuchyne" | "bar";
const placeOfDrink = (d: Drink): Place => d.place ?? "bar";

// Kategorie položek menu podle místa (bar = drinky, kuchyně = jídla).
const KINDS: Record<Place, { value: DrinkKind; label: string; group: string }[]> = {
  bar: [
    { value: "koktejl", label: "Koktejl", group: "🍸 Koktejly" },
    { value: "panak", label: "Panák", group: "🥃 Panáky" },
    { value: "jine", label: "Ostatní", group: "🍹 Ostatní" },
  ],
  kuchyne: [
    { value: "snidane", label: "Snídaně", group: "🌅 Snídaně" },
    { value: "obed", label: "Oběd", group: "🍲 Obědy" },
    { value: "jine", label: "Ostatní", group: "🍽️ Ostatní" },
  ],
};
const drinkCost = (d: Drink) => d.ingredients.reduce((s, i) => s + (i.cost || 0), 0);

const CATS = ["Nákupy", "Menu", "Ostatní"];
const MAX_FILE_BYTES = 1_300_000;

export default function KuchyneBarPage() {
  const { currentYear, canEditCurrentYear } = useStore();
  const [place, setPlace] = useState<Place>("kuchyne");
  const year = currentYear;
  if (!year) return null;
  const editable = canEditCurrentYear;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-semibold tracking-tight">Kuchyně &amp; bar 🍳🍸</h1>
        <div className="inline-flex rounded-full bg-paper2 p-0.5 text-sm">
          {(["kuchyne", "bar"] as Place[]).map((p) => (
            <button
              key={p}
              onClick={() => setPlace(p)}
              className={`rounded-full px-4 py-1.5 font-medium transition ${place === p ? "bg-white text-ink shadow-sm" : "text-ink-soft"}`}
            >
              {p === "kuchyne" ? "🍳 Kuchyně" : "🍸 Bar"}
            </button>
          ))}
        </div>
      </div>

      <MenuSection key={`m-${place}`} place={place} editable={editable} />
      <ShoppingSection key={`s-${place}`} place={place} editable={editable} />
      <FilesSection key={`f-${place}`} place={place} editable={editable} />
    </div>
  );
}

/* ---------------- MENU (skládá se jako drinky) ---------------- */

function MenuSection({ place, editable }: { place: Place; editable: boolean }) {
  const { currentYear, dispatch } = useStore();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [kind, setKind] = useState<DrinkKind>(place === "bar" ? "koktejl" : "obed");
  const year = currentYear!;
  const items = (year.bar ?? []).filter((d) => placeOfDrink(d) === place);

  const groups = KINDS[place]
    .map((k) => ({ group: k.group, list: items.filter((d) => d.kind === k.value).sort((a, b) => a.name.localeCompare(b.name, "cs")) }))
    .filter((g) => g.list.length > 0);

  async function add() {
    if (!name.trim() || !editable) return;
    await dispatch({ type: "addDrink", yearId: year.id, name: name.trim(), kind, place });
    setName("");
  }

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-display text-lg font-semibold">{place === "bar" ? "🍸 Nápojový lístek" : "🍲 Menu (jídla)"}</h2>
        {editable && (
          <button className="btn-secondary px-3 py-1.5 text-sm" onClick={() => setOpen((v) => !v)}>
            {open ? "Zavřít" : place === "bar" ? "+ Přidat drink" : "+ Přidat jídlo"}
          </button>
        )}
      </div>

      {open && editable && (
        <div className="card flex flex-wrap items-center gap-2 p-4">
          <input
            className="input min-w-[160px] flex-1"
            placeholder={place === "bar" ? "Název drinku (např. VÍLÍ NEKTAR)" : "Název jídla (např. Guláš)"}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && add()}
            autoFocus
          />
          <select className="input w-36" value={kind} onChange={(e) => setKind(e.target.value as DrinkKind)}>
            {KINDS[place].map((k) => (
              <option key={k.value} value={k.value}>{k.label}</option>
            ))}
          </select>
          <button className="btn-primary" onClick={add} disabled={!name.trim()}>+ Přidat</button>
        </div>
      )}

      {items.length === 0 ? (
        <div className="card grid place-items-center p-8 text-center text-sm text-ink-soft">
          {editable ? "Zatím prázdné. Přidej položku a doplň recepturu." : "Zatím prázdné."}
        </div>
      ) : (
        groups.map((g) => (
          <div key={g.group} className="space-y-2">
            <h3 className="font-display text-base font-semibold">{g.group}</h3>
            <div className="grid gap-3 md:grid-cols-2">
              {g.list.map((d) => (
                <DrinkCard key={d.id} d={d} place={place} yearId={year.id} editable={editable} />
              ))}
            </div>
          </div>
        ))
      )}
    </section>
  );
}

function DrinkCard({ d, place, yearId, editable }: { d: Drink; place: Place; yearId: string; editable: boolean }) {
  const { dispatch } = useStore();
  const [edit, setEdit] = useState(false);
  const cost = drinkCost(d);
  const margin = d.price != null ? d.price - cost : null;
  const showPrice = place === "bar";

  if (edit) return <DrinkEdit d={d} place={place} yearId={yearId} onClose={() => setEdit(false)} />;

  return (
    <div className="card p-4">
      <div className="flex items-start justify-between gap-2">
        <h4 className="min-w-0 break-words font-display text-base font-semibold">{d.name}</h4>
        {editable && (
          <div className="flex shrink-0 items-center gap-1">
            <button className="btn-ghost px-2 py-1 text-xs" onClick={() => setEdit(true)}>Upravit</button>
            <DeleteButton onConfirm={() => dispatch({ type: "removeDrink", yearId, drinkId: d.id })} />
          </div>
        )}
      </div>
      {d.ingredients.length > 0 && (
        <ul className="mt-2 space-y-0.5 text-sm">
          {d.ingredients.map((i, idx) => (
            <li key={idx} className="flex items-center justify-between gap-2 text-ink-soft">
              <span className="min-w-0 break-words">{i.name}</span>
              <span className="shrink-0 tabular-nums">{fmtCZK(i.cost)}</span>
            </li>
          ))}
        </ul>
      )}
      {d.note && <p className="mt-1 text-xs text-ink-soft">{d.note}</p>}
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-black/[0.06] pt-2 text-sm">
        <span className="text-ink-soft">náklad <strong className="text-ink">{fmtCZK(cost)}</strong></span>
        {showPrice && <span className="text-ink-soft">prodej <strong className="text-ink">{d.price != null ? fmtCZK(d.price) : "—"}</strong></span>}
        {showPrice && margin != null && (
          <span className={`ml-auto font-semibold ${margin >= 0 ? "text-leaf-700" : "text-red-600"}`}>
            marže {margin >= 0 ? "+" : "−"}{fmtCZK(Math.abs(margin))}
          </span>
        )}
      </div>
    </div>
  );
}

function DrinkEdit({ d, place, yearId, onClose }: { d: Drink; place: Place; yearId: string; onClose: () => void }) {
  const { dispatch } = useStore();
  const [name, setName] = useState(d.name);
  const [kind, setKind] = useState<DrinkKind>(d.kind);
  const [price, setPrice] = useState(d.price != null ? String(d.price) : "");
  const [note, setNote] = useState(d.note ?? "");
  const [ings, setIngs] = useState<DrinkIngredient[]>(d.ingredients.length ? d.ingredients : []);
  const cost = ings.reduce((s, i) => s + (Number(i.cost) || 0), 0);
  const showPrice = place === "bar";

  const setIng = (idx: number, patch: Partial<DrinkIngredient>) => setIngs((arr) => arr.map((i, x) => (x === idx ? { ...i, ...patch } : i)));
  async function save() {
    await dispatch({
      type: "updateDrink",
      yearId,
      drinkId: d.id,
      patch: { name, kind, price: price.trim() ? Number(price.replace(",", ".")) : 0, note, ingredients: ings.map((i) => ({ name: i.name, cost: Number(i.cost) || 0 })) },
    });
    onClose();
  }

  return (
    <div className="card space-y-3 p-4 ring-2 ring-marigold-200">
      <div className="grid gap-2 sm:grid-cols-[1fr_8rem]">
        <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Název" />
        <select className="input" value={kind} onChange={(e) => setKind(e.target.value as DrinkKind)}>
          {KINDS[place].map((k) => (
            <option key={k.value} value={k.value}>{k.label}</option>
          ))}
        </select>
      </div>
      <div>
        <p className="mb-1 text-xs font-medium text-ink-soft">Suroviny (název + náklad Kč)</p>
        <div className="space-y-1.5">
          {ings.map((i, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input className="input flex-1" value={i.name} onChange={(e) => setIng(idx, { name: e.target.value })} placeholder="surovina (gin 40ml, brambory 2kg…)" />
              <input className="input w-24" inputMode="numeric" value={String(i.cost)} onChange={(e) => setIng(idx, { cost: Number(e.target.value.replace(",", ".")) || 0 })} placeholder="Kč" />
              <button className="btn-ghost px-2 py-1.5 text-xs" onClick={() => setIngs((arr) => arr.filter((_, x) => x !== idx))} aria-label="Odebrat surovinu">✕</button>
            </div>
          ))}
        </div>
        <button className="btn-secondary mt-2 px-3 py-1.5 text-xs" onClick={() => setIngs((arr) => [...arr, { name: "", cost: 0 }])}>+ Surovina</button>
        <p className="mt-1 text-xs text-ink-soft">Náklad celkem: <strong className="text-ink">{fmtCZK(cost)}</strong></p>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {showPrice && (
          <div>
            <label className="label">Prodejní cena (Kč)</label>
            <input className="input" inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="např. 80" />
          </div>
        )}
        <div>
          <label className="label">Poznámka</label>
          <input className="input" value={note} onChange={(e) => setNote(e.target.value)} />
        </div>
      </div>
      <div className="flex gap-2">
        <button className="btn-primary py-2 text-sm" onClick={save}>Uložit</button>
        <button className="btn-ghost py-2 text-sm" onClick={onClose}>Zrušit</button>
      </div>
    </div>
  );
}

/* ---------------- NÁKUPNÍ SEZNAM ---------------- */

function ShoppingSection({ place, editable }: { place: Place; editable: boolean }) {
  const { currentYear, dispatch } = useStore();
  const [name, setName] = useState("");
  const [qty, setQty] = useState("");
  const year = currentYear!;
  const items = (year.shopping ?? [])
    .filter((s) => (s.place ?? "kuchyne") === place)
    .sort((a, b) => Number(!!a.bought) - Number(!!b.bought) || a.createdAt.localeCompare(b.createdAt));
  const boughtCount = items.filter((i) => i.bought).length;

  async function add() {
    if (!name.trim() || !editable) return;
    await dispatch({ type: "addShoppingItem", yearId: year.id, name: name.trim(), qty: qty.trim() || undefined, place });
    setName("");
    setQty("");
  }

  return (
    <section className="card space-y-3 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-display text-lg font-semibold">
          🛒 Nákupní seznam{items.length > 0 && <span className="ml-2 text-sm font-normal text-ink-soft">{boughtCount}/{items.length} koupeno</span>}
        </h2>
        {editable && boughtCount > 0 && (
          <button className="btn-ghost px-3 py-1.5 text-xs" onClick={() => dispatch({ type: "clearBoughtShopping", yearId: year.id, place })}>
            Smazat koupené
          </button>
        )}
      </div>
      {editable && (
        <div className="flex flex-wrap gap-2">
          <input className="input min-w-[140px] flex-1" placeholder="Co koupit" value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && add()} />
          <input className="input w-28" placeholder="Množství" value={qty} onChange={(e) => setQty(e.target.value)} onKeyDown={(e) => e.key === "Enter" && add()} />
          <button className="btn-primary" onClick={add} disabled={!name.trim()}>+ Přidat</button>
        </div>
      )}
      {items.length === 0 ? (
        <p className="text-sm text-ink-soft">Nákupní seznam je prázdný.</p>
      ) : (
        <ul className="divide-y divide-black/[0.06]">
          {items.map((i) => (
            <li key={i.id} className="flex items-center gap-3 py-2 text-sm">
              <input type="checkbox" checked={!!i.bought} onChange={() => dispatch({ type: "toggleShoppingBought", yearId: year.id, itemId: i.id })} disabled={!editable} className="h-4 w-4 accent-marigold-600" />
              <span className={`min-w-0 flex-1 break-words ${i.bought ? "text-ink-soft line-through" : "font-medium"}`}>{i.name}</span>
              {i.qty && <span className="shrink-0 text-xs text-ink-soft">{i.qty}</span>}
              {editable && <DeleteButton onConfirm={() => dispatch({ type: "removeShoppingItem", yearId: year.id, itemId: i.id })} />}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

/* ---------------- SOUBORY ---------------- */

function FilesSection({ place, editable }: { place: Place; editable: boolean }) {
  const { currentYear, me, dispatch, configured } = useStore();
  const [category, setCategory] = useState("Nákupy");
  const [label, setLabel] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const year = currentYear!;
  const files = (year.kitchen ?? []).filter((f) => (f.place ?? "kuchyne") === place);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setBusy(true);
    setErr(null);
    try {
      const isImage = file.type.startsWith("image/");
      let dataUrl: string;
      if (isImage) dataUrl = await compressImage(file);
      else {
        if (file.size > MAX_FILE_BYTES) {
          setErr("Soubor je moc velký (max ~1,3 MB). Fotky řešit nemusíš — zmenší se samy.");
          setBusy(false);
          return;
        }
        dataUrl = await readFileAsDataUrl(file);
      }
      const blobId = uid("kb_");
      const ok = await saveReceipt(blobId, dataUrl, configured);
      if (!ok) { setErr("Nahrání se nepovedlo (soubor možná moc velký)."); setBusy(false); return; }
      await dispatch({ type: "addKitchenFile", yearId: year.id, label, category, blobId, fileKind: isImage ? "image" : "file", fileName: file.name, author: me, place });
      setLabel("");
    } catch {
      setErr("Něco se pokazilo při nahrávání.");
    } finally {
      setBusy(false);
    }
  }

  const known = new Set(CATS);
  const extraCats = [...new Set(files.map((f) => f.category).filter((c) => !known.has(c)))];
  const groups = [...CATS, ...extraCats].map((cat) => ({ cat, items: files.filter((f) => f.category === cat) })).filter((g) => g.items.length > 0);

  return (
    <section className="space-y-3">
      <h2 className="font-display text-lg font-semibold">📎 Soubory (nákupy, menu, recepty)</h2>
      {editable ? (
        <div className="card space-y-3 p-4">
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <label className="label">Kam to patří</label>
              <select className="rounded-xl border border-black/10 bg-white px-3 py-2.5 text-base sm:text-sm" value={category} onChange={(e) => setCategory(e.target.value)}>
                {CATS.map((c) => (<option key={c} value={c}>{c}</option>))}
              </select>
            </div>
            <div className="min-w-[200px] flex-1">
              <label className="label">Popis (nepovinné)</label>
              <input className="input" placeholder="např. Nákup Makro – sobota, Menu úterý" value={label} onChange={(e) => setLabel(e.target.value)} />
            </div>
            <label className="btn-primary cursor-pointer">
              <Icon name="download" className="h-4 w-4 rotate-180" />
              {busy ? "Nahrávám…" : "Nahrát foto / soubor"}
              <input type="file" accept="image/*,application/pdf,.pdf,.doc,.docx,.xls,.xlsx,.txt" className="hidden" onChange={onFile} disabled={busy} />
            </label>
          </div>
          {err && <p className="text-sm text-red-600">{err}</p>}
        </div>
      ) : (
        <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">🔒 Tento ročník je uzamčený — soubory jdou jen prohlížet a stahovat.</p>
      )}

      {files.length === 0 ? (
        <div className="card grid place-items-center p-8 text-center text-sm text-ink-soft">Zatím tu nejsou žádné soubory.</div>
      ) : (
        groups.map((g) => (
          <div key={g.cat} className="space-y-2">
            <h3 className="font-display text-base font-semibold">{g.cat} <span className="text-sm font-normal text-ink-soft">({g.items.length})</span></h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {g.items.map((item) => (<KitchenCard key={item.id} item={item} yearId={year.id} editable={editable} />))}
            </div>
          </div>
        ))
      )}
    </section>
  );
}

function KitchenCard({ item, yearId, editable }: { item: KitchenFile; yearId: string; editable: boolean }) {
  const { configured, dispatch, me } = useStore();
  const admin = isAdmin(me);
  const [viewing, setViewing] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(false);

  async function download() {
    setBusy(true); setErr(false);
    const url = await loadReceipt(item.blobId, configured);
    setBusy(false);
    if (!url) { setErr(true); return; }
    const a = document.createElement("a");
    a.href = url; a.download = item.fileName || `${item.label || "foto"}.jpg`; a.click();
  }
  async function open() {
    setBusy(true); setErr(false);
    const url = await loadReceipt(item.blobId, configured);
    setBusy(false);
    if (!url) { setErr(true); return; }
    if (item.fileKind === "image") setViewing(url);
    else { const a = document.createElement("a"); a.href = url; a.download = item.fileName || item.label || "soubor"; a.click(); }
  }
  async function remove() {
    await deleteReceipt(item.blobId, configured);
    await dispatch({ type: "removeKitchenFile", yearId, fileId: item.id });
  }

  return (
    <div className="card p-3">
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-marigold-50 text-marigold-700">
          <Icon name={item.fileKind === "image" ? "image" : "file"} className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="break-words font-semibold">{item.label}</p>
          <p className="text-xs text-ink-soft">{item.author} · {fmtDate(item.createdAt)}{item.fileName ? ` · ${item.fileName}` : ""}</p>
        </div>
        {(admin || editable) && (
          <button className="text-xs font-medium text-red-600 hover:underline" onClick={remove}>Smazat</button>
        )}
      </div>
      <div className="mt-2 flex items-center gap-2">
        <button className="btn-secondary px-3 py-1.5 text-xs" onClick={open} disabled={busy}>
          {busy ? "…" : item.fileKind === "image" ? "Zobrazit foto" : "Otevřít"}
        </button>
        <button className="btn-ghost px-2 py-1.5 text-xs" onClick={download} disabled={busy}>
          <Icon name="download" className="h-3.5 w-3.5" /> Stáhnout
        </button>
        {err && <span className="text-xs text-red-600">nepovedlo se</span>}
      </div>
      <Modal open={viewing !== null} onClose={() => setViewing(null)} title={item.label}>
        {viewing && (
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={viewing} alt={item.label} className="max-h-[64vh] w-full rounded-xl object-contain" />
          </div>
        )}
      </Modal>
    </div>
  );
}
