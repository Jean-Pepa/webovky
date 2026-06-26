"use client";

import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { fmtCZK } from "@/lib/format";
import { DeleteButton } from "@/components/DeleteButton";
import type { Drink, DrinkKind, DrinkIngredient } from "@/lib/types";

const KIND_LABEL: Record<DrinkKind, string> = { koktejl: "🍸 Koktejly", panak: "🥃 Panáky", jine: "🍹 Ostatní" };
const KIND_ORDER: DrinkKind[] = ["koktejl", "panak", "jine"];

const drinkCost = (d: Drink) => d.ingredients.reduce((s, i) => s + (i.cost || 0), 0);

export default function BarPage() {
  const { currentYear, dispatch, canEditCurrentYear } = useStore();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [kind, setKind] = useState<DrinkKind>("koktejl");

  const year = currentYear;
  const groups = useMemo(() => {
    const map = new Map<DrinkKind, Drink[]>();
    for (const d of year?.bar ?? []) (map.get(d.kind) ?? map.set(d.kind, []).get(d.kind)!).push(d);
    for (const arr of map.values()) arr.sort((a, b) => a.name.localeCompare(b.name, "cs"));
    return KIND_ORDER.filter((k) => map.has(k)).map((k) => [k, map.get(k)!] as const);
  }, [year]);

  if (!year) return null;
  const canEdit = canEditCurrentYear;

  async function add() {
    if (!name.trim() || !year || !canEdit) return;
    await dispatch({ type: "addDrink", yearId: year.id, name: name.trim(), kind });
    setName("");
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Bar 🍸</h1>
          <p className="mt-0.5 text-sm text-ink-soft">Ceník drinků s recepturou — náklad na suroviny, prodejní cena a marže.</p>
        </div>
        {canEdit && (
          <button className="btn-primary" onClick={() => setOpen((v) => !v)}>
            {open ? "Zavřít" : "+ Přidat drink"}
          </button>
        )}
      </div>

      {open && canEdit && (
        <div className="card flex flex-wrap items-center gap-2 p-4">
          <input
            className="input min-w-[160px] flex-1"
            placeholder="Název drinku (např. VÍLÍ NEKTAR)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && add()}
            autoFocus
          />
          <select className="input w-36" value={kind} onChange={(e) => setKind(e.target.value as DrinkKind)}>
            <option value="koktejl">Koktejl</option>
            <option value="panak">Panák</option>
            <option value="jine">Ostatní</option>
          </select>
          <button className="btn-primary" onClick={add} disabled={!name.trim()}>
            + Přidat
          </button>
        </div>
      )}

      {(year.bar?.length ?? 0) === 0 ? (
        <div className="card grid place-items-center p-10 text-center text-sm text-ink-soft">
          {canEdit ? "Zatím žádné drinky. Přidej první nahoře a doplň recepturu." : "Zatím žádné drinky."}
        </div>
      ) : (
        groups.map(([k, drinks]) => (
          <section key={k} className="space-y-2">
            <h2 className="font-display text-lg font-semibold">{KIND_LABEL[k]}</h2>
            <div className="grid gap-3 md:grid-cols-2">
              {drinks.map((d) => (
                <DrinkCard key={d.id} d={d} yearId={year.id} canEdit={canEdit} />
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}

function DrinkCard({ d, yearId, canEdit }: { d: Drink; yearId: string; canEdit: boolean }) {
  const { dispatch } = useStore();
  const [edit, setEdit] = useState(false);
  const cost = drinkCost(d);
  const margin = d.price != null ? d.price - cost : null;

  if (edit) return <DrinkEdit d={d} yearId={yearId} onClose={() => setEdit(false)} />;

  return (
    <div className="card p-4">
      <div className="flex items-start justify-between gap-2">
        <h3 className="min-w-0 break-words font-display text-base font-semibold">{d.name}</h3>
        {canEdit && (
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
        <span className="text-ink-soft">prodej <strong className="text-ink">{d.price != null ? fmtCZK(d.price) : "—"}</strong></span>
        {margin != null && (
          <span className={`ml-auto font-semibold ${margin >= 0 ? "text-leaf-700" : "text-red-600"}`}>
            marže {margin >= 0 ? "+" : "−"}
            {fmtCZK(Math.abs(margin))}
          </span>
        )}
      </div>
    </div>
  );
}

function DrinkEdit({ d, yearId, onClose }: { d: Drink; yearId: string; onClose: () => void }) {
  const { dispatch } = useStore();
  const [name, setName] = useState(d.name);
  const [kind, setKind] = useState<DrinkKind>(d.kind);
  const [price, setPrice] = useState(d.price != null ? String(d.price) : "");
  const [note, setNote] = useState(d.note ?? "");
  const [ings, setIngs] = useState<DrinkIngredient[]>(d.ingredients.length ? d.ingredients : []);

  const cost = ings.reduce((s, i) => s + (Number(i.cost) || 0), 0);

  function setIng(idx: number, patch: Partial<DrinkIngredient>) {
    setIngs((arr) => arr.map((i, x) => (x === idx ? { ...i, ...patch } : i)));
  }
  function addIng() {
    setIngs((arr) => [...arr, { name: "", cost: 0 }]);
  }
  function removeIng(idx: number) {
    setIngs((arr) => arr.filter((_, x) => x !== idx));
  }
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
        <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Název drinku" />
        <select className="input" value={kind} onChange={(e) => setKind(e.target.value as DrinkKind)}>
          <option value="koktejl">Koktejl</option>
          <option value="panak">Panák</option>
          <option value="jine">Ostatní</option>
        </select>
      </div>

      <div>
        <p className="mb-1 text-xs font-medium text-ink-soft">Suroviny (název + náklad Kč)</p>
        <div className="space-y-1.5">
          {ings.map((i, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input className="input flex-1" value={i.name} onChange={(e) => setIng(idx, { name: e.target.value })} placeholder="surovina (gin 40ml…)" />
              <input className="input w-24" inputMode="numeric" value={String(i.cost)} onChange={(e) => setIng(idx, { cost: Number(e.target.value.replace(",", ".")) || 0 })} placeholder="Kč" />
              <button className="btn-ghost px-2 py-1.5 text-xs" onClick={() => removeIng(idx)} aria-label="Odebrat surovinu">✕</button>
            </div>
          ))}
        </div>
        <button className="btn-secondary mt-2 px-3 py-1.5 text-xs" onClick={addIng}>+ Surovina</button>
        <p className="mt-1 text-xs text-ink-soft">Náklad celkem: <strong className="text-ink">{fmtCZK(cost)}</strong></p>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <div>
          <label className="label">Prodejní cena (Kč)</label>
          <input className="input" inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="např. 80" />
        </div>
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
