"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { Icon } from "@/components/Icons";
import { Modal } from "@/components/Modal";
import { DeleteButton } from "@/components/DeleteButton";
import { compressImage, readFileAsDataUrl, saveReceipt, loadReceipt, deleteReceipt } from "@/lib/receipts";
import { fmtDate } from "@/lib/format";
import { uid } from "@/lib/id";
import { isAdmin } from "@/lib/admin";
import type { KitchenFile, Meal } from "@/lib/types";

const CATS = ["Nákupy", "Menu", "Ostatní"];
const MAX_FILE_BYTES = 1_300_000; // ~1,3 MB pro ne-obrázky (fotky se zmenší samy)

export default function KuchynePage() {
  const { currentYear, me, dispatch, configured, canEditCurrentYear } = useStore();
  const [category, setCategory] = useState("Nákupy");
  const [label, setLabel] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const year = currentYear;
  if (!year) return null;
  const editable = canEditCurrentYear;
  const files = year.kitchen ?? [];

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !year) return;
    setBusy(true);
    setErr(null);
    try {
      const isImage = file.type.startsWith("image/");
      let dataUrl: string;
      if (isImage) {
        dataUrl = await compressImage(file);
      } else {
        if (file.size > MAX_FILE_BYTES) {
          setErr("Soubor je moc velký (max ~1,3 MB). Fotky řešit nemusíš — zmenší se samy.");
          setBusy(false);
          return;
        }
        dataUrl = await readFileAsDataUrl(file);
      }
      const blobId = uid("kb_");
      const ok = await saveReceipt(blobId, dataUrl, configured);
      if (!ok) {
        setErr("Nahrání se nepovedlo (soubor možná moc velký).");
        setBusy(false);
        return;
      }
      await dispatch({
        type: "addKitchenFile",
        yearId: year.id,
        label,
        category,
        blobId,
        fileKind: isImage ? "image" : "file",
        fileName: file.name,
        author: me,
      });
      setLabel("");
    } catch {
      setErr("Něco se pokazilo při nahrávání.");
    } finally {
      setBusy(false);
    }
  }

  // Seskupení podle kategorie (známé pořadí + případné ostatní).
  const known = new Set(CATS);
  const extraCats = [...new Set(files.map((f) => f.category).filter((c) => !known.has(c)))];
  const groups = [...CATS, ...extraCats].map((cat) => ({ cat, items: files.filter((f) => f.category === cat) }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Kuchyně 🍳</h1>
      </div>

      <MenuSection editable={editable} />
      <ShoppingSection editable={editable} />

      <h2 className="font-display text-lg font-semibold">📎 Soubory (nákupy, menu, recepty)</h2>
      {/* Nahrání */}
      {editable ? (
        <div className="card space-y-3 p-4">
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <label className="label">Kam to patří</label>
              <select
                className="rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="min-w-[200px] flex-1">
              <label className="label">Popis (nepovinné)</label>
              <input
                className="input"
                placeholder="např. Nákup Makro – sobota, Menu úterý"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
              />
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
        <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          🔒 Tento ročník je uzamčený — soubory jdou jen prohlížet a stahovat, ne přidávat.
        </p>
      )}

      {/* Galerie po kategoriích */}
      {files.length === 0 ? (
        <div className="card grid place-items-center p-10 text-center text-sm text-ink-soft">
          Zatím tu nic není. Nahraj první nákupní seznam nebo menu.
        </div>
      ) : (
        groups
          .filter((g) => g.items.length > 0)
          .map((g) => (
            <section key={g.cat} className="space-y-3">
              <h2 className="font-display text-lg font-semibold">
                {g.cat} <span className="text-sm font-normal text-ink-soft">({g.items.length})</span>
              </h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {g.items.map((item) => (
                  <KitchenCard key={item.id} item={item} yearId={year.id} editable={editable} />
                ))}
              </div>
            </section>
          ))
      )}
    </div>
  );
}

function KitchenCard({ item, yearId, editable }: { item: KitchenFile; yearId: string; editable: boolean }) {
  const { configured, dispatch, me } = useStore();
  const admin = isAdmin(me);
  const [viewing, setViewing] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(false);

  async function download() {
    setBusy(true);
    setErr(false);
    const url = await loadReceipt(item.blobId, configured);
    setBusy(false);
    if (!url) { setErr(true); return; }
    const a = document.createElement("a");
    a.href = url;
    a.download = item.fileName || `${item.label || "foto"}.jpg`;
    a.click();
  }

  async function open() {
    setBusy(true);
    setErr(false);
    const url = await loadReceipt(item.blobId, configured);
    setBusy(false);
    if (!url) {
      setErr(true);
      return;
    }
    if (item.fileKind === "image") {
      setViewing(url);
    } else {
      const a = document.createElement("a");
      a.href = url;
      a.download = item.fileName || item.label || "soubor";
      a.click();
    }
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
          <p className="text-xs text-ink-soft">
            {item.author} · {fmtDate(item.createdAt)}
            {item.fileName ? ` · ${item.fileName}` : ""}
          </p>
        </div>
        {editable && <DeleteButton onConfirm={remove} />}
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <button className="btn-secondary px-3 py-1.5 text-xs" onClick={open} disabled={busy}>
          {busy ? "Načítám…" : item.fileKind === "image" ? "Zobrazit foto" : "Stáhnout soubor"}
        </button>
        {admin && item.fileKind === "image" && (
          <button className="btn-ghost px-2.5 py-1.5 text-xs" onClick={download} disabled={busy} title="Stáhnout foto">
            <Icon name="download" className="h-4 w-4" /> Stáhnout
          </button>
        )}
        {err && <span className="text-xs text-red-600">nepovedlo se</span>}
      </div>

      <Modal open={viewing !== null} onClose={() => setViewing(null)} title={item.label}>
        {viewing && (
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={viewing} alt={item.label} className="max-h-[64vh] w-full rounded-xl object-contain" />
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

const MEAL_LABEL: Record<Meal, string> = { snidane: "🌅 Snídaně", obed: "🍲 Oběd", jine: "🍽️ Jiné" };

// Denní menu — co se který den vaří.
function MenuSection({ editable }: { editable: boolean }) {
  const { currentYear, dispatch } = useStore();
  const [open, setOpen] = useState(false);
  const [day, setDay] = useState("");
  const [meal, setMeal] = useState<Meal>("obed");
  const [dish, setDish] = useState("");
  const year = currentYear;
  if (!year) return null;
  const menu = year.menu ?? [];
  // Seskupení po dnech v pořadí prvního výskytu.
  const days: string[] = [];
  for (const m of menu) if (!days.includes(m.day)) days.push(m.day);

  async function add() {
    if (!day.trim() || !dish.trim() || !editable) return;
    await dispatch({ type: "addMenuEntry", yearId: year!.id, day: day.trim(), meal, dish: dish.trim() });
    setDish("");
  }

  return (
    <section className="card space-y-3 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-display text-lg font-semibold">📅 Denní menu</h2>
        {editable && (
          <button className="btn-secondary px-3 py-1.5 text-sm" onClick={() => setOpen((v) => !v)}>
            {open ? "Zavřít" : "+ Přidat jídlo"}
          </button>
        )}
      </div>
      {open && editable && (
        <div className="grid gap-2 sm:grid-cols-[10rem_8rem_1fr_auto]">
          <input className="input" placeholder="Den (Čtvrtek 18.9.)" value={day} onChange={(e) => setDay(e.target.value)} />
          <select className="input" value={meal} onChange={(e) => setMeal(e.target.value as Meal)}>
            <option value="snidane">Snídaně</option>
            <option value="obed">Oběd</option>
            <option value="jine">Jiné</option>
          </select>
          <input className="input" placeholder="Co se vaří" value={dish} onChange={(e) => setDish(e.target.value)} onKeyDown={(e) => e.key === "Enter" && add()} />
          <button className="btn-primary" onClick={add} disabled={!day.trim() || !dish.trim()}>+ Přidat</button>
        </div>
      )}
      {menu.length === 0 ? (
        <p className="text-sm text-ink-soft">Zatím žádné menu. {editable ? "Přidej, co se který den vaří." : ""}</p>
      ) : (
        <div className="space-y-3">
          {days.map((d) => (
            <div key={d}>
              <p className="mb-1 text-sm font-semibold">{d}</p>
              <ul className="divide-y divide-black/[0.06] rounded-xl bg-paper2/40">
                {menu.filter((m) => m.day === d).map((m) => (
                  <li key={m.id} className="flex items-center gap-2 px-3 py-1.5 text-sm">
                    <span className="shrink-0 text-xs">{MEAL_LABEL[m.meal]}</span>
                    <span className="min-w-0 flex-1 break-words font-medium">{m.dish}</span>
                    {editable && <DeleteButton onConfirm={() => dispatch({ type: "removeMenuEntry", yearId: year!.id, entryId: m.id })} />}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

// Nákupní seznam — odškrtávací checklist.
function ShoppingSection({ editable }: { editable: boolean }) {
  const { currentYear, dispatch } = useStore();
  const [name, setName] = useState("");
  const [qty, setQty] = useState("");
  const year = currentYear;
  if (!year) return null;
  const items = [...(year.shopping ?? [])].sort((a, b) => Number(!!a.bought) - Number(!!b.bought) || a.createdAt.localeCompare(b.createdAt));
  const boughtCount = items.filter((i) => i.bought).length;

  async function add() {
    if (!name.trim() || !editable) return;
    await dispatch({ type: "addShoppingItem", yearId: year!.id, name: name.trim(), qty: qty.trim() || undefined });
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
          <button className="btn-ghost px-3 py-1.5 text-xs" onClick={() => dispatch({ type: "clearBoughtShopping", yearId: year!.id })}>
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
              <input type="checkbox" checked={!!i.bought} onChange={() => dispatch({ type: "toggleShoppingBought", yearId: year!.id, itemId: i.id })} disabled={!editable} className="h-4 w-4 accent-marigold-600" />
              <span className={`min-w-0 flex-1 break-words ${i.bought ? "text-ink-soft line-through" : "font-medium"}`}>{i.name}</span>
              {i.qty && <span className="shrink-0 text-xs text-ink-soft">{i.qty}</span>}
              {editable && <DeleteButton onConfirm={() => dispatch({ type: "removeShoppingItem", yearId: year!.id, itemId: i.id })} />}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
