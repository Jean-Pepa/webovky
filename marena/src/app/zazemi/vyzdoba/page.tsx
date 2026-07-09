"use client";

import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { canEditSection } from "@/lib/access";
import { isAdmin } from "@/lib/admin";
import { ReadOnlyBanner } from "@/components/ReadOnlyBanner";
import { DeleteButton } from "@/components/DeleteButton";
import { Modal } from "@/components/Modal";
import { SearchBox } from "@/components/SearchBox";
import { matchesQuery } from "@/lib/search";
import { flash } from "@/components/Flash";
import type { Decor, DecorStatus } from "@/lib/types";

const STATUS: Record<DecorStatus, { label: string; cls: string; order: number }> = {
  napad: { label: "💡 nápad", cls: "bg-paper2 text-ink-soft", order: 0 },
  shani: { label: "🛒 shání se", cls: "bg-gold-600/12 text-gold-700", order: 1 },
  hotovo: { label: "✅ hotovo", cls: "bg-leaf/15 text-leaf-700", order: 2 },
};
const NEXT: Record<DecorStatus, DecorStatus> = { napad: "shani", shani: "hotovo", hotovo: "napad" };

export default function VyzdobaPage() {
  const { currentYear, me, dispatch, canEditCurrentYear } = useStore();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [title, setTitle] = useState("");
  const [who, setWho] = useState("");
  const [link, setLink] = useState("");
  const [note, setNote] = useState("");

  const year = currentYear;
  const list = useMemo(
    () =>
      [...(year?.decor ?? [])]
        .filter((d) => matchesQuery(q, d.title, d.who, d.link, d.note))
        .sort((a, b) => STATUS[a.status].order - STATUS[b.status].order || a.createdAt.localeCompare(b.createdAt)),
    [year, q],
  );
  const counts = useMemo(() => {
    const c = { napad: 0, shani: 0, hotovo: 0 } as Record<DecorStatus, number>;
    for (const d of year?.decor ?? []) c[d.status]++;
    return c;
  }, [year]);

  if (!year) return null;
  const canEdit = canEditCurrentYear && canEditSection(year, me, "vyzdoba");

  async function add() {
    if (!title.trim() || !year || !canEdit) return;
    await dispatch({ type: "addDecor", yearId: year.id, title: title.trim(), who, link, note });
    setTitle("");
    setWho("");
    setLink("");
    setNote("");
    flash("Nápad přidán", "🎨");
  }

  return (
    <div className="space-y-5">
      {canEditCurrentYear && !canEdit && (
        <ReadOnlyBanner>Výzdobu máš jen k náhledu — upravovat ji může jen správce a příslušná role.</ReadOnlyBanner>
      )}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-[28px] font-bold uppercase tracking-tight">Výzdoba</h1>
          <p className="mt-0.5 text-sm text-ink-soft">Nápady a materiál na výzdobu dvora i fakulty. Klikni na stav: nápad → shání se → hotovo.</p>
        </div>
        {canEdit && (
          <button className="btn-primary" onClick={() => setOpen((v) => !v)}>
            {open ? "Zavřít" : "+ Přidat nápad"}
          </button>
        )}
      </div>

      {(year.decor?.length ?? 0) > 0 && (
        <SearchBox value={q} onChange={setQ} placeholder="Hledat výzdobu…" />
      )}

      {open && canEdit && (
        <div className="card space-y-2 p-4">
          <input
            className="input"
            placeholder="Nápad / materiál (např. Luxfery z Bazoše, LED pásky…)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && add()}
            autoFocus
          />
          <div className="grid gap-2 sm:grid-cols-2">
            <input className="input" placeholder="Kdo shání" value={who} onChange={(e) => setWho(e.target.value)} />
            <input className="input" placeholder="Odkaz (nepovinné)" value={link} onChange={(e) => setLink(e.target.value)} />
          </div>
          <input
            className="input"
            placeholder="Poznámka"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && add()}
          />
          <div className="flex gap-2">
            <button className="btn-primary py-2 text-sm" onClick={add} disabled={!title.trim()}>
              + Přidat nápad
            </button>
            <button className="btn-ghost py-2 text-sm" onClick={() => setOpen(false)}>Zrušit</button>
          </div>
        </div>
      )}

      {(year.decor?.length ?? 0) > 0 && (
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="chip">{STATUS.napad.label} {counts.napad}</span>
          <span className="chip">{STATUS.shani.label} {counts.shani}</span>
          <span className="chip">{STATUS.hotovo.label} {counts.hotovo}</span>
        </div>
      )}

      {(year.decor?.length ?? 0) === 0 ? (
        <div className="card grid place-items-center p-10 text-center text-sm text-ink-soft">
          {canEdit ? "Zatím žádné nápady. Přidej první nahoře." : "Zatím žádné nápady."}
        </div>
      ) : list.length === 0 && q.trim() ? (
        <p className="text-sm text-ink-soft">Nic neodpovídá hledání.</p>
      ) : (
        <ul className="space-y-2">
          {list.map((d) => (
            <DecorRow key={d.id} d={d} yearId={year.id} canEdit={canEdit} admin={isAdmin(me)} />
          ))}
        </ul>
      )}
    </div>
  );
}

function DecorRow({ d, yearId, canEdit, admin }: { d: Decor; yearId: string; canEdit: boolean; admin?: boolean }) {
  const { dispatch } = useStore();
  const [edit, setEdit] = useState(false);
  const [askDone, setAskDone] = useState(false); // potvrzení „hotovo → uzamknout"
  const [title, setTitle] = useState(d.title);
  const [who, setWho] = useState(d.who ?? "");
  const [link, setLink] = useState(d.link ?? "");
  const [note, setNote] = useState(d.note ?? "");
  const locked = d.status === "hotovo"; // hotové je uzamčené, dokud se neodemkne

  async function save() {
    await dispatch({ type: "updateDecor", yearId, decorId: d.id, patch: { title, who, link, note } });
    setEdit(false);
  }
  // Klik na stav: nápad → shání se rovnou; před „hotovo" se to potvrdí a pak
  // se uzamkne. Hotové už samo neroluje zpět (šlo by jen omylem).
  function cycle() {
    if (!canEdit || locked) return;
    if (d.status === "shani") {
      setAskDone(true);
      return;
    }
    dispatch({ type: "updateDecor", yearId, decorId: d.id, patch: { status: NEXT[d.status] } });
  }
  function confirmDone() {
    dispatch({ type: "updateDecor", yearId, decorId: d.id, patch: { status: "hotovo" } });
    setAskDone(false);
    flash("Hotovo — uzamčeno 🔒", "✅");
  }
  // Reset (jen správce) — uzamčené hotové vrátí na začátek (nápad).
  function reset() {
    dispatch({ type: "updateDecor", yearId, decorId: d.id, patch: { status: "napad" } });
    flash("Resetováno na nápad", "🔄");
  }

  if (edit) {
    return (
      <li className="card space-y-2 p-3">
        <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Nápad / materiál" />
        <div className="grid gap-2 sm:grid-cols-2">
          <input className="input" value={who} onChange={(e) => setWho(e.target.value)} placeholder="Kdo shání" />
          <input className="input" value={link} onChange={(e) => setLink(e.target.value)} placeholder="Odkaz (nepovinné)" />
        </div>
        <input className="input" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Poznámka" />
        <div className="flex gap-2">
          <button className="btn-primary py-2 text-sm" onClick={save}>Uložit</button>
          <button className="btn-ghost py-2 text-sm" onClick={() => setEdit(false)}>Zrušit</button>
        </div>
      </li>
    );
  }

  return (
    <li className="card flex items-start gap-3 p-3">
      <button
        onClick={cycle}
        disabled={!canEdit || locked}
        className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium transition ${STATUS[d.status].cls} ${canEdit && !locked ? "hover:opacity-80" : ""}`}
        title={locked ? "Hotovo — uzamčeno" : canEdit ? "Klikni pro změnu stavu" : undefined}
      >
        {STATUS[d.status].label}
        {locked ? " 🔒" : ""}
      </button>
      <div className="min-w-0 flex-1">
        <p className={`break-words font-medium ${d.status === "hotovo" ? "text-ink-soft line-through" : ""}`}>{d.title}</p>
        <div className="mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-ink-soft">
          {d.who && <span>👤 {d.who}</span>}
          {d.link && (
            <a href={d.link.startsWith("http") ? d.link : `https://${d.link}`} target="_blank" rel="noreferrer" className="break-all text-gold-700 hover:underline">
              🔗 odkaz
            </a>
          )}
          {d.note && <span className="break-words">📝 {d.note}</span>}
        </div>
      </div>
      {canEdit && (
        <div className="flex shrink-0 items-center gap-1">
          {/* Reset (jen správce) — odemkne hotové a vrátí na nápad */}
          {locked && admin && (
            <button className="btn-ghost px-2 py-1 text-xs font-semibold text-gold-700" onClick={reset} title="Resetovat na nápad (odemknout)">
              🔄 Reset
            </button>
          )}
          {!locked && (
            <button className="btn-ghost px-2 py-1 text-xs" onClick={() => setEdit(true)}>Upravit</button>
          )}
          <DeleteButton onConfirm={() => dispatch({ type: "removeDecor", yearId, decorId: d.id })} />
        </div>
      )}

      {/* Potvrzení „hotovo" — pak se to uzamkne */}
      <Modal open={askDone} onClose={() => setAskDone(false)} title={`Označit jako hotovo — ${d.title}`}>
        <p className="text-sm text-ink-soft">
          Označit <strong className="text-ink">„{d.title}“</strong> jako <strong className="text-ink">hotovo</strong>? Pak se to
          <strong className="text-ink"> uzamkne</strong> — nepůjde omylem překlikat zpět. Odemknout může jen správce (tlačítkem Reset).
        </p>
        <div className="mt-4 flex items-center gap-2">
          <button className="btn-primary flex-1" onClick={confirmDone}>
            ✅ Ano, hotovo a uzamknout
          </button>
          <button className="btn-ghost" onClick={() => setAskDone(false)}>
            Zrušit
          </button>
        </div>
      </Modal>
    </li>
  );
}
