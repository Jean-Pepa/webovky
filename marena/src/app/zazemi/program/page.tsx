"use client";

import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { DeleteButton } from "@/components/DeleteButton";
import { SearchBox } from "@/components/SearchBox";
import { matchesQuery } from "@/lib/search";
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

const isConfirmed = (i: Invite) => !!i.confirmedDate?.trim();
// Zamčeno = rozhodnuto (má zájem / odmítl / potvrzeno) → stav osloveno a zájem už nejde měnit.
const isLocked = (i: Invite) => isConfirmed(i) || i.interest === "ano" || i.interest === "ne";
// Pořadí ve skupině: potvrzeno (0, oranžová) → osloveno/má zájem (1) → odmítl (2) → neosloveno (3).
function inviteRank(i: Invite): number {
  if (isConfirmed(i)) return 0;
  if (i.interest === "ne") return 2;
  if (i.contacted) return 1;
  return 3;
}
// Barva řádku/karty podle stavu.
function inviteBg(i: Invite): string {
  if (isConfirmed(i)) return "bg-amber-200";
  if (i.interest === "ano") return "bg-leaf/15";
  if (i.interest === "ne") return "bg-red-500/10";
  return "";
}

export default function ProgramPage() {
  const { currentYear, dispatch } = useStore();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [link, setLink] = useState("");

  const year = currentYear;
  const invites = useMemo(() => year?.invites ?? [], [year]);

  const filtered = useMemo(
    () => invites.filter((i) => matchesQuery(q, i.name, i.category, i.link, i.availability, i.price, i.confirmedDate, i.note)),
    [invites, q],
  );

  const groups = useMemo(() => {
    const map = new Map<string, Invite[]>();
    for (const i of filtered) {
      const arr = map.get(i.category) || [];
      arr.push(i);
      map.set(i.category, arr);
    }
    for (const arr of map.values()) {
      // Potvrzeno nahoře, pak osloveno/má zájem, pak odmítl, dole neosloveno; v rámci toho má zájem nahoru, jinak abecedně.
      arr.sort(
        (a, b) =>
          inviteRank(a) - inviteRank(b) ||
          (a.interest === "ano" ? 0 : 1) - (b.interest === "ano" ? 0 : 1) ||
          a.name.localeCompare(b.name),
      );
    }
    return [...map.entries()].sort((a, b) => {
      const ia = CAT_ORDER.indexOf(a[0]);
      const ib = CAT_ORDER.indexOf(b[0]);
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib) || a[0].localeCompare(b[0]);
    });
  }, [filtered]);

  if (!year) return null;

  async function add() {
    if (!name.trim() || !category.trim() || !year) return;
    // Číslo se přiděluje automaticky podle pořadí ve skupině — prioritu nezadáváme.
    await dispatch({ type: "addInvite", yearId: year.id, category, name, link: link || undefined });
    setName("");
    setLink("");
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

      <SearchBox value={q} onChange={setQ} placeholder="Hledat v programu…" />

      {open && (
        <div className="card space-y-2 p-4">
          <div className="grid gap-2 sm:grid-cols-3">
            <input className="input" list="cat-list" placeholder="Kategorie (Přednášky, Kapely…)" value={category} onChange={(e) => setCategory(e.target.value)} />
            <input className="input sm:col-span-2" placeholder="Kdo? (jméno / kapela)" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <input className="input" placeholder="Odkaz (web / instagram)" value={link} onChange={(e) => setLink(e.target.value)} />
          <button className="btn-primary" onClick={add}>
            Přidat
          </button>
        </div>
      )}

      {groups.length === 0 ? (
        <div className="card grid place-items-center p-10 text-center text-sm text-ink-soft">
          {q.trim() ? "Nic neodpovídá hledání." : "Zatím prázdné. Přidej přednášející a kapely, které chcete oslovit."}
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
                {/* Mobil: karty */}
                <div className="divide-y divide-black/[0.06] md:hidden">
                  {items.map((i, idx) => (
                    <InviteCard key={i.id} invite={i} yearId={year.id} index={idx + 1} />
                  ))}
                </div>
                {/* Desktop: tabulka */}
                <div className="hidden overflow-x-auto md:block">
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
                      {items.map((i, idx) => (
                        <InviteRow key={i.id} invite={i} yearId={year.id} index={idx + 1} />
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

// Tlačítko „Osloveno?" — klik zároveň nastaví zájem na čeká. Po rozhodnutí (má
// zájem / odmítl / potvrzeno) je zamčené.
function ContactedButton({ invite, yearId }: { invite: Invite; yearId: string }) {
  const { dispatch } = useStore();
  const locked = isLocked(invite);
  return (
    <button
      disabled={locked}
      title={locked ? "Zamčeno — už je rozhodnuto" : undefined}
      onClick={() =>
        dispatch({
          type: "updateInvite",
          yearId,
          inviteId: invite.id,
          patch: invite.contacted ? { contacted: false, interest: "nevim" } : { contacted: true, interest: "ceka" },
        })
      }
      className={`rounded-full px-2.5 py-1 text-xs font-medium transition ${
        invite.contacted ? "bg-leaf/15 text-leaf-700" : "bg-paper2 text-ink-soft hover:bg-black/5"
      } ${locked ? "cursor-not-allowed opacity-60" : ""}`}
    >
      {invite.contacted ? "Osloveno ✓" : "Neosloveno"}
    </button>
  );
}

// Zájem: dokud není rozhodnuto, nabídne volbu 👍/👎; po volbě zamčený stav.
function InterestControl({ invite, yearId }: { invite: Invite; yearId: string }) {
  const { dispatch } = useStore();
  const set = (interest: Interest) => dispatch({ type: "updateInvite", yearId, inviteId: invite.id, patch: { interest } });
  // Když je něco v „Potvrzeno" (oranžová), políčko zájem rovnou hlásí Potvrzeno.
  if (isConfirmed(invite))
    return <span className="inline-flex rounded-full bg-amber-200 px-2.5 py-1 text-xs font-semibold text-amber-900">✅ Potvrzeno</span>;
  if (invite.interest === "ano")
    return <span className="inline-flex rounded-full bg-leaf/20 px-2.5 py-1 text-xs font-semibold text-leaf-700">👍 má zájem 🔒</span>;
  if (invite.interest === "ne")
    return <span className="inline-flex rounded-full bg-red-500/15 px-2.5 py-1 text-xs font-semibold text-red-600">👎 odmítl 🔒</span>;
  if (!invite.contacted) return <span className="text-xs text-ink-soft/50">—</span>;
  return (
    <div className="flex flex-wrap gap-1">
      <button onClick={() => set("ano")} className="rounded-full bg-leaf/10 px-2 py-1 text-xs font-medium text-leaf-700 transition hover:bg-leaf/20">
        👍 zájem
      </button>
      <button onClick={() => set("ne")} className="rounded-full bg-red-500/[0.06] px-2 py-1 text-xs font-medium text-red-600 transition hover:bg-red-500/15">
        👎 odmítl
      </button>
    </div>
  );
}

// Sdílený stav pozvánky — používá řádek tabulky (desktop) i karta (mobil).
function useInviteRow(invite: Invite, yearId: string) {
  const { dispatch } = useStore();
  const [edit, setEdit] = useState(false);
  const [name, setName] = useState(invite.name);
  const [link, setLink] = useState(invite.link ?? "");
  const [availability, setAvailability] = useState(invite.availability ?? "");
  const [price, setPrice] = useState(invite.price ?? "");
  const [confirmedDate, setConfirmedDate] = useState(invite.confirmedDate ?? "");

  async function save() {
    // Posíláme i prázdné hodnoty ("" / null) — aby šlo pole opravdu vymazat.
    // (undefined by JSON.stringify zahodil a stará hodnota by zůstala.)
    await dispatch({
      type: "updateInvite",
      yearId,
      inviteId: invite.id,
      patch: {
        name: name.trim() || invite.name,
        link: link.trim(),
        availability: availability.trim(),
        price: price.trim(),
        confirmedDate: confirmedDate.trim(),
      },
    });
    setEdit(false);
  }

  return { dispatch, edit, setEdit, name, setName, link, setLink, availability, setAvailability, price, setPrice, confirmedDate, setConfirmedDate, save };
}

// Mobilní karta jedné pozvánky (na úzkém displeji místo tabulky).
function InviteCard({ invite, yearId, index }: { invite: Invite; yearId: string; index: number }) {
  const s = useInviteRow(invite, yearId);

  if (s.edit) {
    return (
      <div className="space-y-2 bg-paper2/40 p-3">
        <input className="input" value={s.name} onChange={(e) => s.setName(e.target.value)} placeholder="Jméno" />
        <input className="input" value={s.link} onChange={(e) => s.setLink(e.target.value)} placeholder="Odkaz" />
        <div className="grid grid-cols-2 gap-2">
          <input className="input" value={s.availability} onChange={(e) => s.setAvailability(e.target.value)} placeholder="Kdy může" />
          <input className="input" value={s.price} onChange={(e) => s.setPrice(e.target.value)} placeholder="Cena" />
          <input className="input col-span-2" value={s.confirmedDate} onChange={(e) => s.setConfirmedDate(e.target.value)} placeholder="Potvrzeno (datum)" />
        </div>
        <div className="flex gap-2 pt-0.5">
          <button className="btn-primary flex-1 py-2 text-sm" onClick={s.save}>Uložit</button>
          <button className="btn-ghost py-2 text-sm" onClick={() => s.setEdit(false)}>Zrušit</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-3 ${inviteBg(invite)}`}>
      <div className="flex items-start gap-2">
        <span className="chip shrink-0">{index}</span>
        <div className="min-w-0 flex-1">
          <span className="font-medium">{invite.name}</span>
          {invite.link && (
            <a href={invite.link.startsWith("http") ? invite.link : `https://${invite.link}`} target="_blank" rel="noreferrer" className="ml-2 text-xs font-medium text-marigold-700 hover:underline">
              odkaz ↗
            </a>
          )}
          <div className="mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-ink-soft">
            {invite.availability && <span>🗓 {invite.availability}</span>}
            {invite.price && <span>💰 {invite.price}</span>}
            {invite.confirmedDate && <span className="font-semibold text-amber-800">✓ potvrzeno: {invite.confirmedDate}</span>}
          </div>
        </div>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <ContactedButton invite={invite} yearId={yearId} />
        <InterestControl invite={invite} yearId={yearId} />
        <div className="ml-auto flex items-center gap-1">
          <button className="btn-ghost px-2 py-1 text-xs" onClick={() => s.setEdit(true)}>Upravit</button>
          <DeleteButton onConfirm={() => s.dispatch({ type: "removeInvite", yearId, inviteId: invite.id })} />
        </div>
      </div>
    </div>
  );
}

function InviteRow({ invite, yearId, index }: { invite: Invite; yearId: string; index: number }) {
  const { dispatch, edit, setEdit, name, setName, link, setLink, availability, setAvailability, price, setPrice, confirmedDate, setConfirmedDate, save } =
    useInviteRow(invite, yearId);

  if (edit) {
    return (
      <tr className="border-b border-black/[0.06] bg-paper2/40 align-top">
        <td className="px-3 py-2 text-ink-soft">{index}</td>
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

  return (
    <tr className={`border-b border-black/[0.06] transition-colors ${inviteBg(invite) || "hover:bg-paper2/40"}`}>
      <td className="px-3 py-3 font-medium text-ink-soft">{index}</td>
      <td className="px-3 py-3">
        <span className="font-medium">{invite.name}</span>
        {invite.link && (
          <a href={invite.link.startsWith("http") ? invite.link : `https://${invite.link}`} target="_blank" rel="noreferrer" className="ml-2 text-xs font-medium text-marigold-700 hover:underline">
            odkaz ↗
          </a>
        )}
      </td>
      <td className="px-3 py-3">
        <ContactedButton invite={invite} yearId={yearId} />
      </td>
      <td className="px-3 py-3">
        <InterestControl invite={invite} yearId={yearId} />
      </td>
      <td className="px-3 py-3 text-ink-soft">{invite.availability || "—"}</td>
      <td className="px-3 py-3 text-ink-soft">{invite.price || "—"}</td>
      <td className="px-3 py-3 whitespace-nowrap">{invite.confirmedDate ? <span className="font-semibold text-amber-800">{invite.confirmedDate}</span> : <span className="text-ink-soft/50">—</span>}</td>
      <td className="px-3 py-3">
        <div className="flex items-center justify-end gap-1">
          <button className="btn-ghost px-2 py-1 text-xs" onClick={() => setEdit(true)}>Upravit</button>
          <DeleteButton onConfirm={() => dispatch({ type: "removeInvite", yearId, inviteId: invite.id })} />
        </div>
      </td>
    </tr>
  );
}
