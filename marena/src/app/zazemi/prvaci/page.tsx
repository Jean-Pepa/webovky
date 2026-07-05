"use client";

import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { canEditSection } from "@/lib/access";
import { DeleteButton } from "@/components/DeleteButton";
import { normName } from "@/lib/names";
import { flash } from "@/components/Flash";
import type { Freshman } from "@/lib/types";

export default function PrvaciPage() {
  const { currentYear, me, dispatch, canEditCurrentYear } = useStore();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");

  const year = currentYear;
  const list = useMemo(() => {
    const arr = [...(year?.freshmen ?? [])].sort((a, b) => a.name.localeCompare(b.name, "cs"));
    const needle = normName(q);
    if (!needle) return arr;
    return arr.filter((f) => normName(f.name).includes(needle) || normName(f.email ?? "").includes(needle) || normName(f.note ?? "").includes(needle));
  }, [year, q]);

  if (!year) return null;
  const canEdit = canEditCurrentYear && canEditSection(year, me, "prvaci");

  async function add() {
    if (!name.trim() || !year || !canEdit) return;
    await dispatch({ type: "addFreshman", yearId: year.id, name: name.trim(), email: email.trim() || undefined, note: note.trim() || undefined });
    setName("");
    setEmail("");
    setNote("");
    flash("Prvák přidán", "🐣");
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-[28px] font-bold tracking-tight">Prváci</h1>
          <p className="mt-0.5 text-sm text-ink-soft">Seznam prváků, o které celá Mařena je. Zapisuje se ručně.</p>
        </div>
        {canEdit && (
          <button className="btn-primary" onClick={() => setOpen((v) => !v)}>
            {open ? "Zavřít" : "+ Přidat prváka"}
          </button>
        )}
      </div>

      {open && canEdit && (
        <div className="card space-y-2 p-4">
          <div className="grid gap-2 sm:grid-cols-2">
            <input className="input" placeholder="Jméno a příjmení" value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && add()} autoFocus />
            <input className="input" placeholder="E-mail (nepovinné)" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === "Enter" && add()} />
            <input className="input sm:col-span-2" placeholder="Poznámka (skupina, telefon… — nepovinné)" value={note} onChange={(e) => setNote(e.target.value)} onKeyDown={(e) => e.key === "Enter" && add()} />
          </div>
          <button className="btn-primary" onClick={add} disabled={!name.trim()}>
            + Přidat
          </button>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2">
        <input className="input max-w-xs" placeholder="🔎 Hledat…" value={q} onChange={(e) => setQ(e.target.value)} />
        <span className="text-sm text-ink-soft">
          {q ? `${list.length} z ${year.freshmen?.length ?? 0}` : `${year.freshmen?.length ?? 0} prváků`}
        </span>
      </div>

      {(year.freshmen?.length ?? 0) === 0 ? (
        <div className="card grid place-items-center p-10 text-center text-sm text-ink-soft">
          {canEdit ? "Zatím tu nikdo není. Přidej prvního prváka tlačítkem nahoře." : "Zatím tu nikdo není."}
        </div>
      ) : list.length === 0 ? (
        <div className="card grid place-items-center p-8 text-center text-sm text-ink-soft">Nikdo neodpovídá hledání.</div>
      ) : (
        <ul className="card divide-y divide-black/[0.06] overflow-hidden">
          {list.map((f) => (
            <FreshmanRow key={f.id} f={f} yearId={year.id} canEdit={canEdit} />
          ))}
        </ul>
      )}
    </div>
  );
}

function FreshmanRow({ f, yearId, canEdit }: { f: Freshman; yearId: string; canEdit: boolean }) {
  const { dispatch } = useStore();
  const [edit, setEdit] = useState(false);
  const [name, setName] = useState(f.name);
  const [email, setEmail] = useState(f.email ?? "");
  const [note, setNote] = useState(f.note ?? "");

  async function save() {
    await dispatch({ type: "updateFreshman", yearId, freshmanId: f.id, patch: { name, email, note } });
    setEdit(false);
  }

  if (edit) {
    return (
      <li className="space-y-2 bg-paper2/40 p-3">
        <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jméno a příjmení" />
        <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail" />
        <input className="input" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Poznámka" />
        <div className="flex gap-2">
          <button className="btn-primary py-2 text-sm" onClick={save}>Uložit</button>
          <button className="btn-ghost py-2 text-sm" onClick={() => setEdit(false)}>Zrušit</button>
        </div>
      </li>
    );
  }

  return (
    <li className="flex items-start gap-3 px-4 py-2.5">
      <div className="min-w-0 flex-1 flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
        <p className="break-words font-medium">{f.name}</p>
        {f.email && (
          <a href={`mailto:${f.email}`} className="break-all text-xs text-ink-soft hover:text-gold-700">
            ✉️ {f.email}
          </a>
        )}
        {f.note && <span className="break-words text-xs text-ink-soft">📝 {f.note}</span>}
      </div>
      {canEdit && (
        <div className="flex shrink-0 items-center gap-1">
          <button className="btn-ghost px-2 py-1 text-xs" onClick={() => setEdit(true)}>Upravit</button>
          <DeleteButton onConfirm={() => dispatch({ type: "removeFreshman", yearId, freshmanId: f.id })} />
        </div>
      )}
    </li>
  );
}
