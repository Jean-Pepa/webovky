"use client";

import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { DeleteButton } from "@/components/DeleteButton";
import type { Sponsor, SponsorStatus } from "@/lib/types";

const STATUS: Record<SponsorStatus, { label: string; cls: string; order: number }> = {
  oslovit: { label: "📋 oslovit", cls: "bg-paper2 text-ink-soft", order: 0 },
  ceka: { label: "⏳ čeká", cls: "bg-marigold-600/12 text-marigold-700", order: 1 },
  potvrzeno: { label: "✅ potvrzeno", cls: "bg-leaf/15 text-leaf-700", order: 2 },
  odmitl: { label: "✖️ odmítl", cls: "bg-red-500/10 text-red-600", order: 3 },
};
const NEXT: Record<SponsorStatus, SponsorStatus> = { oslovit: "ceka", ceka: "potvrzeno", potvrzeno: "odmitl", odmitl: "oslovit" };

export default function SponzoriPage() {
  const { currentYear, dispatch, canEditCurrentYear } = useStore();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  const year = currentYear;
  const list = useMemo(
    () => [...(year?.sponsors ?? [])].sort((a, b) => STATUS[a.status].order - STATUS[b.status].order || a.name.localeCompare(b.name, "cs")),
    [year],
  );
  const confirmed = useMemo(() => (year?.sponsors ?? []).filter((s) => s.status === "potvrzeno").length, [year]);

  if (!year) return null;
  const canEdit = canEditCurrentYear;

  async function add() {
    if (!name.trim() || !year || !canEdit) return;
    await dispatch({ type: "addSponsor", yearId: year.id, name: name.trim() });
    setName("");
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Sponzoři ✨</h1>
          <p className="mt-0.5 text-sm text-ink-soft">Koho oslovit, co dává a jak domluva stojí. Klikni na stav: oslovit → čeká → potvrzeno → odmítl.</p>
        </div>
        {canEdit && (
          <button className="btn-primary" onClick={() => setOpen((v) => !v)}>
            {open ? "Zavřít" : "+ Přidat sponzora"}
          </button>
        )}
      </div>

      {open && canEdit && (
        <div className="card flex flex-wrap gap-2 p-4">
          <input
            className="input min-w-[160px] flex-1"
            placeholder="Název sponzora (např. Rebel Bean, Pivovar Hauskrecht…)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && add()}
            autoFocus
          />
          <button className="btn-primary" onClick={add} disabled={!name.trim()}>
            + Přidat
          </button>
        </div>
      )}

      {(year.sponsors?.length ?? 0) > 0 && (
        <p className="text-sm text-ink-soft">
          {year.sponsors?.length} sponzorů · <span className="font-semibold text-leaf-700">{confirmed} potvrzeno</span>
        </p>
      )}

      {(year.sponsors?.length ?? 0) === 0 ? (
        <div className="card grid place-items-center p-10 text-center text-sm text-ink-soft">
          {canEdit ? "Zatím žádní sponzoři. Přidej prvního nahoře." : "Zatím žádní sponzoři."}
        </div>
      ) : (
        <ul className="space-y-2">
          {list.map((s) => (
            <SponsorRow key={s.id} s={s} yearId={year.id} canEdit={canEdit} />
          ))}
        </ul>
      )}
    </div>
  );
}

function SponsorRow({ s, yearId, canEdit }: { s: Sponsor; yearId: string; canEdit: boolean }) {
  const { dispatch } = useStore();
  const [edit, setEdit] = useState(false);
  const [name, setName] = useState(s.name);
  const [gives, setGives] = useState(s.gives ?? "");
  const [who, setWho] = useState(s.who ?? "");
  const [link, setLink] = useState(s.link ?? "");
  const [note, setNote] = useState(s.note ?? "");

  async function save() {
    await dispatch({ type: "updateSponsor", yearId, sponsorId: s.id, patch: { name, gives, who, link, note } });
    setEdit(false);
  }

  if (edit) {
    return (
      <li className="card space-y-2 p-3">
        <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Název sponzora" />
        <input className="input" value={gives} onChange={(e) => setGives(e.target.value)} placeholder="Co dává (pivo, čaj, kávovar, peníze…)" />
        <div className="grid gap-2 sm:grid-cols-2">
          <input className="input" value={who} onChange={(e) => setWho(e.target.value)} placeholder="Kdo to řeší" />
          <input className="input" value={link} onChange={(e) => setLink(e.target.value)} placeholder="Odkaz / kontakt" />
        </div>
        <input className="input" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Požadavky / poznámka (např. chce logo)" />
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
        onClick={() => canEdit && dispatch({ type: "updateSponsor", yearId, sponsorId: s.id, patch: { status: NEXT[s.status] } })}
        disabled={!canEdit}
        className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium transition ${STATUS[s.status].cls} ${canEdit ? "hover:opacity-80" : ""}`}
        title={canEdit ? "Klikni pro změnu stavu" : undefined}
      >
        {STATUS[s.status].label}
      </button>
      <div className="min-w-0 flex-1">
        <p className="break-words font-medium">{s.name}</p>
        {s.gives && <p className="break-words text-sm text-leaf-700">dává: {s.gives}</p>}
        <div className="mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-ink-soft">
          {s.who && <span>👤 {s.who}</span>}
          {s.link && (
            <a href={s.link.startsWith("http") ? s.link : `https://${s.link}`} target="_blank" rel="noreferrer" className="break-all text-marigold-700 hover:underline">
              🔗 odkaz
            </a>
          )}
          {s.note && <span className="break-words">📝 {s.note}</span>}
        </div>
      </div>
      {canEdit && (
        <div className="flex shrink-0 items-center gap-1">
          <button className="btn-ghost px-2 py-1 text-xs" onClick={() => setEdit(true)}>Upravit</button>
          <DeleteButton onConfirm={() => dispatch({ type: "removeSponsor", yearId, sponsorId: s.id })} />
        </div>
      )}
    </li>
  );
}
