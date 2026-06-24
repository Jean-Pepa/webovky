"use client";

import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { DeleteButton } from "@/components/DeleteButton";
import type { Invite, Interest } from "@/lib/types";

const CAT_META: Record<string, string> = {
  Přednášky: "🎓",
  Kapely: "🎸",
  DJs: "🎧",
  Workshopy: "🛠️",
  Moderátor: "🎙️",
  Sponzoři: "🤝",
  Ostatní: "📍",
};
const CAT_ORDER = Object.keys(CAT_META);
const catEmoji = (c: string) => CAT_META[c] ?? "📍";

const INTEREST: Interest[] = ["nevim", "ceka", "ano", "ne"];
const INTEREST_META: Record<Interest, { label: string; cls: string }> = {
  nevim: { label: "?", cls: "bg-paper2 text-ink-soft" },
  ceka: { label: "čeká", cls: "bg-marigold-100 text-marigold-800" },
  ano: { label: "má zájem", cls: "bg-leaf/15 text-leaf-700" },
  ne: { label: "nemá", cls: "bg-black/[0.06] text-ink-soft line-through" },
};

export default function ProgramPage() {
  const { currentYear, dispatch } = useStore();
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  const [priority, setPriority] = useState("");

  const year = currentYear;
  const invites = useMemo(() => year?.invites ?? [], [year]);

  const groups = useMemo(() => {
    const map = new Map<string, Invite[]>();
    for (const i of invites) {
      const arr = map.get(i.category) || [];
      arr.push(i);
      map.set(i.category, arr);
    }
    for (const arr of map.values()) {
      arr.sort((a, b) => (a.priority ?? 999) - (b.priority ?? 999) || a.name.localeCompare(b.name));
    }
    return [...map.entries()].sort((a, b) => {
      const ia = CAT_ORDER.indexOf(a[0]);
      const ib = CAT_ORDER.indexOf(b[0]);
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib) || a[0].localeCompare(b[0]);
    });
  }, [invites]);

  if (!year) return null;

  async function add() {
    if (!name.trim() || !category.trim() || !year) return;
    await dispatch({ type: "addInvite", yearId: year.id, category, name, link: link || undefined, priority: parseInt(priority, 10) || undefined });
    setName("");
    setLink("");
    setPriority("");
    setOpen(false);
  }

  return (
    <div className="space-y-5">
      <datalist id="cat-list">
        {CAT_ORDER.map((c) => (
          <option key={c} value={c} />
        ))}
      </datalist>

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Program</h1>
        </div>
        <button className="btn-primary" onClick={() => setOpen((v) => !v)}>
          {open ? "Zavřít" : "+ Přidat do programu"}
        </button>
      </div>

      {open && (
        <div className="card space-y-2 p-4">
          <div className="grid gap-2 sm:grid-cols-4">
            <input className="input" list="cat-list" placeholder="Kategorie (Přednášky, Kapely…)" value={category} onChange={(e) => setCategory(e.target.value)} />
            <input className="input sm:col-span-2" placeholder="Kdo? (jméno / kapela)" value={name} onChange={(e) => setName(e.target.value)} />
            <input className="input" inputMode="numeric" placeholder="Priorita č." value={priority} onChange={(e) => setPriority(e.target.value)} />
          </div>
          <input className="input" placeholder="Odkaz (web / instagram)" value={link} onChange={(e) => setLink(e.target.value)} />
          <button className="btn-primary" onClick={add}>
            Přidat
          </button>
        </div>
      )}

      {groups.length === 0 ? (
        <div className="card grid place-items-center p-10 text-center text-sm text-ink-soft">
          Zatím prázdné. Přidej přednášející a kapely, které chcete oslovit.
        </div>
      ) : (
        <div className="space-y-6">
          {groups.map(([cat, items]) => (
            <section key={cat}>
              <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-semibold">
                <span>{catEmoji(cat)}</span> {cat}
                <span className="chip">{items.length}</span>
              </h2>
              <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[820px] border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-black/[0.06] text-left text-xs font-medium uppercase tracking-wide text-ink-soft">
                        <th className="px-3 py-2.5 w-10">#</th>
                        <th className="px-3 py-2.5">Kdo</th>
                        <th className="px-3 py-2.5">Osloveno?</th>
                        <th className="px-3 py-2.5">Zájem?</th>
                        <th className="px-3 py-2.5">Kdy může</th>
                        <th className="px-3 py-2.5">Cena</th>
                        <th className="px-3 py-2.5">Potvrzeno</th>
                        <th className="px-3 py-2.5" />
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((i) => (
                        <InviteRow key={i.id} invite={i} yearId={year.id} />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function InviteRow({ invite, yearId }: { invite: Invite; yearId: string }) {
  const { dispatch } = useStore();
  const [edit, setEdit] = useState(false);
  const [name, setName] = useState(invite.name);
  const [link, setLink] = useState(invite.link ?? "");
  const [priority, setPriority] = useState(invite.priority ? String(invite.priority) : "");
  const [availability, setAvailability] = useState(invite.availability ?? "");
  const [price, setPrice] = useState(invite.price ?? "");
  const [confirmedDate, setConfirmedDate] = useState(invite.confirmedDate ?? "");

  function cycleInterest() {
    const next = INTEREST[(INTEREST.indexOf(invite.interest) + 1) % INTEREST.length];
    dispatch({ type: "updateInvite", yearId, inviteId: invite.id, patch: { interest: next } });
  }

  async function save() {
    await dispatch({
      type: "updateInvite",
      yearId,
      inviteId: invite.id,
      patch: {
        name: name.trim() || invite.name,
        link: link.trim() || undefined,
        priority: parseInt(priority, 10) || undefined,
        availability: availability.trim() || undefined,
        price: price.trim() || undefined,
        confirmedDate: confirmedDate.trim() || undefined,
      },
    });
    setEdit(false);
  }

  if (edit) {
    return (
      <tr className="border-b border-black/[0.06] bg-paper2/40 align-top">
        <td className="px-3 py-2"><input className="input w-14" inputMode="numeric" value={priority} onChange={(e) => setPriority(e.target.value)} /></td>
        <td className="px-3 py-2">
          <input className="input mb-1" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jméno" />
          <input className="input" value={link} onChange={(e) => setLink(e.target.value)} placeholder="Odkaz" />
        </td>
        <td className="px-3 py-2 text-ink-soft" colSpan={2}>—</td>
        <td className="px-3 py-2"><input className="input" value={availability} onChange={(e) => setAvailability(e.target.value)} placeholder="Kdy" /></td>
        <td className="px-3 py-2"><input className="input" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Cena" /></td>
        <td className="px-3 py-2"><input className="input" value={confirmedDate} onChange={(e) => setConfirmedDate(e.target.value)} placeholder="Datum" /></td>
        <td className="px-3 py-2">
          <div className="flex gap-1">
            <button className="btn-primary px-3 py-1.5 text-xs" onClick={save}>Uložit</button>
            <button className="btn-ghost px-2 py-1.5 text-xs" onClick={() => setEdit(false)}>Zrušit</button>
          </div>
        </td>
      </tr>
    );
  }

  const im = INTEREST_META[invite.interest];
  return (
    <tr className="border-b border-black/[0.06] transition-colors hover:bg-paper2/40">
      <td className="px-3 py-3 text-ink-soft">{invite.priority ?? "—"}</td>
      <td className="px-3 py-3">
        <span className="font-medium">{invite.name}</span>
        {invite.link && (
          <a href={invite.link.startsWith("http") ? invite.link : `https://${invite.link}`} target="_blank" rel="noreferrer" className="ml-2 text-xs font-medium text-marigold-700 hover:underline">
            odkaz ↗
          </a>
        )}
      </td>
      <td className="px-3 py-3">
        <button
          onClick={() => dispatch({ type: "updateInvite", yearId, inviteId: invite.id, patch: { contacted: !invite.contacted } })}
          className={`rounded-full px-2.5 py-1 text-xs font-medium transition ${invite.contacted ? "bg-leaf/15 text-leaf-700 hover:bg-leaf/25" : "bg-paper2 text-ink-soft hover:bg-black/5"}`}
        >
          {invite.contacted ? "Osloveno ✓" : "Neosloveno"}
        </button>
      </td>
      <td className="px-3 py-3">
        <button onClick={cycleInterest} className={`rounded-full px-2.5 py-1 text-xs font-medium transition hover:opacity-80 ${im.cls}`} title="Klikni pro změnu">
          {im.label}
        </button>
      </td>
      <td className="px-3 py-3 text-ink-soft">{invite.availability || "—"}</td>
      <td className="px-3 py-3 text-ink-soft">{invite.price || "—"}</td>
      <td className="px-3 py-3 whitespace-nowrap">{invite.confirmedDate ? <span className="font-medium text-leaf-700">{invite.confirmedDate}</span> : <span className="text-ink-soft/50">—</span>}</td>
      <td className="px-3 py-3">
        <div className="flex items-center justify-end gap-1">
          <button className="btn-ghost px-2 py-1 text-xs" onClick={() => setEdit(true)}>Upravit</button>
          <DeleteButton onConfirm={() => dispatch({ type: "removeInvite", yearId, inviteId: invite.id })} />
        </div>
      </td>
    </tr>
  );
}
