"use client";

import { useMemo, useState } from "react";
import { PageTitle } from "@/components/PageTitle";
import { useStore } from "@/lib/store";
import { isAdmin } from "@/lib/admin";
import { sameName } from "@/lib/names";
import { DeleteButton } from "@/components/DeleteButton";
import { Modal } from "@/components/Modal";
import { SearchBox } from "@/components/SearchBox";
import { ReadOnlyBanner } from "@/components/ReadOnlyBanner";
import { flash } from "@/components/Flash";
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

// Přidávat a upravovat program smí jen tyto role (+ správce). Ostatní jen čtou.
const PROGRAM_EDIT_ROLES = ["kapelnik", "program"];
function useCanEditProgram(): boolean {
  const { currentYear, me } = useStore();
  if (isAdmin(me)) return true;
  const mine = currentYear?.members.find((m) => sameName(m.name, me));
  return (mine?.roleIds ?? []).some((r) => PROGRAM_EDIT_ROLES.includes(r));
}

// „Potvrzeno" = rozhodnuto ano (interest === "ano"). Datum se už nezadává.
const isConfirmed = (i: Invite) => i.interest === "ano";
// Pořadí ve skupině: potvrzeno (0) → osloveno/čeká (1) → odmítl (2) → neosloveno (3, dole).
function inviteRank(i: Invite): number {
  if (i.interest === "ano") return 0;
  if (i.interest === "ne") return 2;
  if (i.contacted) return 1;
  return 3;
}
// Barva řádku/karty podle stavu — potvrzeno = světle zelená s rámečkem (jako role),
// odmítnuto = světle červená také s rámečkem.
function inviteBg(i: Invite): string {
  if (i.interest === "ano") return "bg-leaf/15 ring-1 ring-inset ring-leaf/40";
  if (i.interest === "ne") return "bg-red-500/10 ring-1 ring-inset ring-red-400/50";
  return "";
}

export default function ProgramPage() {
  const { currentYear, dispatch, me } = useStore();
  const canEdit = useCanEditProgram();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  const [availability, setAvailability] = useState("");
  const [price, setPrice] = useState("");

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
      // Potvrzeno nahoře, pak osloveno/čeká, pak odmítl, dole neosloveno; pak abecedně.
      arr.sort((a, b) => inviteRank(a) - inviteRank(b) || a.name.localeCompare(b.name));
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
    const who = name.trim();
    // Číslo se přiděluje automaticky podle pořadí ve skupině — prioritu nezadáváme.
    await dispatch({ type: "addInvite", yearId: year.id, category, name, link: link || undefined, availability: availability || undefined, price: price || undefined, addedBy: me || undefined });
    setName("");
    setLink("");
    setAvailability("");
    setPrice("");
    setOpen(false);
    flash(`Přidáno do programu: ${who}`, "🎉");
  }

  return (
    <div className="space-y-5">
      <datalist id="cat-list">
        {CAT_ORDER.map((c) => (
          <option key={c} value={c} />
        ))}
      </datalist>

      {!canEdit && (
        <ReadOnlyBanner>Program vidí každý, upravovat ho může jen kapelník, koordinátor přednášek, bavič a správce.</ReadOnlyBanner>
      )}

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <PageTitle>Program</PageTitle>
        </div>
        {canEdit && (
          <button className="btn-primary" onClick={() => setOpen((v) => !v)}>
            {open ? "Zavřít" : "+ Přidat do programu"}
          </button>
        )}
      </div>

      <SearchBox value={q} onChange={setQ} placeholder="Hledat v programu…" />

      {canEdit && open && (
        <div className="card space-y-2 p-4">
          <div className="grid gap-2 sm:grid-cols-3">
            <input className="input" list="cat-list" placeholder="Kategorie (Přednášky, Kapely…)" value={category} onChange={(e) => setCategory(e.target.value)} />
            <input className="input sm:col-span-2" placeholder="Kdo? (jméno / kapela)" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <input className="input" placeholder="Odkaz (web / instagram)" value={link} onChange={(e) => setLink(e.target.value)} />
          <div className="grid gap-2 sm:grid-cols-2">
            <input className="input" placeholder="Kdy může (nepovinné)" value={availability} onChange={(e) => setAvailability(e.target.value)} />
            <input className="input" placeholder="Cena (nepovinné)" value={price} onChange={(e) => setPrice(e.target.value)} />
          </div>
          <button className="btn-primary" onClick={add}>
            Přidat
          </button>
        </div>
      )}

      {groups.length === 0 ? (
        <div className="empty-state">
          {q.trim() ? "Nic neodpovídá hledání." : "Zatím prázdné. Přidej přednášející a kapely, které chcete oslovit."}
        </div>
      ) : (
        <div className="space-y-6">
          {groups.map(([cat, items]) => (
            <section key={cat}>
              <h2 className="mb-3 flex items-center gap-2 eyebrow">
                {cat}
                <span className="chip tabular-nums">{items.length}</span>
              </h2>
              <div className="card overflow-hidden">
                {/* Mobil: karty */}
                <div className="divide-y divide-black/[0.06] md:hidden">
                  {items.map((i, idx) => (
                    <InviteCard key={i.id} invite={i} yearId={year.id} index={idx + 1} canEdit={canEdit} />
                  ))}
                </div>
                {/* Desktop: tabulka */}
                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full min-w-[820px] border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-ink/[0.06] text-left text-xs font-medium uppercase tracking-wide text-ink-soft">
                        <th className="px-3 py-2.5 w-10">#</th>
                        <th className="px-3 py-2.5">Kdo</th>
                        <th className="px-3 py-2.5">Osloveno?</th>
                        <th className="px-3 py-2.5">Stav</th>
                        <th className="px-3 py-2.5">Kdy může</th>
                        <th className="px-3 py-2.5">Cena</th>
                        <th className="px-3 py-2.5">Má zájem?</th>
                        <th className="px-3 py-2.5" />
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((i, idx) => (
                        <InviteRow key={i.id} invite={i} yearId={year.id} index={idx + 1} canEdit={canEdit} />
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

// Tlačítko „Osloveno?" — klik zároveň nastaví zájem na čeká. Po potvrzení
// (oranžová) je zamčené; změnit jde až po „Zrušit". Bez práva úpravy jen zobrazení.
function ContactedButton({ invite, yearId, canEdit }: { invite: Invite; yearId: string; canEdit: boolean }) {
  const { dispatch, me } = useStore();
  const admin = isAdmin(me);
  // Po rozhodnutí (ano/ne) zamčeno: potvrzené pro všechny (musí se Zrušit),
  // odmítnuté jen pro ne-správce (změnit může správce).
  const decided = invite.interest === "ano" || invite.interest === "ne";
  const locked = isConfirmed(invite) || (decided && !admin);

  // „Neosloveno" je jen štítek stavu — oslovení se dělá výrazným tlačítkem
  // „Oslovil jsem" vedle. Klikací (pro vrácení zpět) je až zelené „Osloveno ✓".
  if (!canEdit || !invite.contacted) {
    return (
      <span className={`badge ${invite.contacted ? "badge-done" : "badge-idle"}`}>
        {invite.contacted ? "Osloveno ✓" : "Neosloveno"}
      </span>
    );
  }

  return (
    <button
      disabled={locked}
      title={locked ? (admin ? "Potvrzeno — pro změnu nejdřív Zrušit" : "Rozhodnuto — změnit může jen správce") : undefined}
      onClick={() => {
        dispatch({
          type: "updateInvite",
          yearId,
          inviteId: invite.id,
          patch: { contacted: false, interest: "nevim", contactedBy: "" },
        });
        flash(`„${invite.name}" už není osloveno`, "↩️");
      }}
      className={`rounded-full px-2.5 py-1 text-xs font-medium transition bg-leaf/15 text-leaf-700 hover:bg-leaf/25 ${
        locked ? "cursor-not-allowed opacity-60 hover:bg-leaf/15" : ""
      }`}
    >
      Osloveno ✓
    </button>
  );
}

// Výrazné tlačítko „Oslovil jsem" — jen dokud není osloveno. Klik = osloveno
// (zapíše kdo a stav „čeká"). Umístěné mezi stavem a akcemi Upravit/Smazat.
function MarkContactedButton({ invite, yearId, canEdit }: { invite: Invite; yearId: string; canEdit: boolean }) {
  const { dispatch, me } = useStore();
  if (!canEdit || invite.contacted) return null;
  return (
    <button
      onClick={() => {
        dispatch({ type: "updateInvite", yearId, inviteId: invite.id, patch: { contacted: true, interest: "ceka", contactedBy: me } });
        flash(`„${invite.name}" je teď osloveno`, "✉️");
      }}
      className="btn-pill btn-pill-gold"
    >
      ✉️ Oslovil jsem
    </button>
  );
}

// Zájem — jen ZOBRAZENÍ stavu (neklikací). Řídí se přes ano/ne v „Má zájem?".
function InterestControl({ invite }: { invite: Invite }) {
  if (invite.interest === "ano")
    return <span className="badge badge-done ring-1 ring-inset ring-leaf/40">✅ potvrzeno</span>;
  if (invite.interest === "ne")
    return <span className="badge badge-reject">👎 odmítl</span>;
  if (invite.contacted)
    return <span className="badge badge-wait">čeká</span>;
  return <span className="text-xs text-ink-soft/50">—</span>;
}

// „Má zájem?" — dvě tlačítka ano/ne (po oslovení). ano → potvrzeno (oranžová),
// ne → odmítl. Jakmile padne rozhodnutí, zamkne se — změnit smí už jen správce.
// Bez práva úpravy se tlačítka nezobrazí (stav ukazuje InterestControl).
function ConfirmButtons({ invite, yearId, canEdit }: { invite: Invite; yearId: string; canEdit: boolean }) {
  const { dispatch, me } = useStore();
  const admin = isAdmin(me);
  // Po potvrzení (ano) se „má zájem?" schová a zamkne — potvrzené se tak omylem
  // nepřeklikne. Změnit ho jde už jen přes „Zrušeno?" (přesun mezi odmítnuté),
  // ať je to potvrzené i pro správce zamčené.
  if (!canEdit || !invite.contacted || isConfirmed(invite)) return null;
  const yes = invite.interest === "ano";
  const no = invite.interest === "ne";
  // Odmítnuté (ne) je zamčené pro ostatní — vrátit zpět může jen správce.
  const locked = no && !admin;
  const choose = (interest: Interest) => {
    if (locked) return;
    const decided = interest === "ano" || interest === "ne";
    dispatch({ type: "updateInvite", yearId, inviteId: invite.id, patch: { interest, interestBy: decided ? me : "" } });
    if (interest === "ano") flash(`„${invite.name}": má zájem — potvrzeno`, "✅");
    else if (interest === "ne") flash(`„${invite.name}": nemá zájem`, "👎");
    else flash(`„${invite.name}": zpět na čeká`, "⏳");
  };
  return (
    <div className="flex gap-1" title={locked ? "Rozhodnuto — změnit může jen správce" : undefined}>
      <button
        disabled={locked}
        onClick={() => choose(yes ? "ceka" : "ano")}
        className={`rounded-full px-2.5 py-1 text-xs font-semibold transition ${yes ? "bg-leaf text-white" : "bg-leaf/10 text-leaf-700 hover:bg-leaf/20"} ${locked ? "cursor-not-allowed opacity-60" : ""}`}
      >
        ano
      </button>
      <button
        disabled={locked}
        onClick={() => choose(no ? "ceka" : "ne")}
        className={`rounded-full px-2.5 py-1 text-xs font-semibold transition ${no ? "bg-red-500 text-white" : "bg-red-500/10 text-red-600 hover:bg-red-500/20"} ${locked ? "cursor-not-allowed opacity-60" : ""}`}
      >
        ne
      </button>
    </div>
  );
}

// „Zrušeno?" — jen u potvrzené (oranžové) pozvánky. Po potvrzení v okně
// přesune pozvánku mezi odmítnuté (interest = ne). Info (termín/cena/poznámka)
// zůstává, jen se změní stav; jméno/odkaz/kategorie beze změny.
function CancelButton({ invite, yearId, canEdit }: { invite: Invite; yearId: string; canEdit: boolean }) {
  const { dispatch, me } = useStore();
  const [ask, setAsk] = useState(false);
  if (!canEdit || !isConfirmed(invite)) return null;
  function confirmCancel() {
    dispatch({ type: "updateInvite", yearId, inviteId: invite.id, patch: { interest: "ne", cancelledBy: me } });
    setAsk(false);
    flash(`„${invite.name}" spadla mezi odmítnuté`, "👎");
  }
  return (
    <>
      <button
        className="btn-ghost px-2 py-1 text-xs text-red-600"
        onClick={() => setAsk(true)}
      >
        Zrušeno?
      </button>
      <Modal open={ask} onClose={() => setAsk(false)} title="Opravdu zrušeno?">
        <p className="text-sm text-ink-soft">
          Opravdu byla <strong className="text-ink">{invite.name}</strong> zrušena? Přesuneme ji mezi odmítnuté (info zůstane).
        </p>
        <div className="mt-4 flex items-center gap-2">
          <button className="btn-primary flex-1" onClick={confirmCancel}>
            Ano, zrušeno
          </button>
          <button className="btn-ghost" onClick={() => setAsk(false)}>
            Ne
          </button>
        </div>
      </Modal>
    </>
  );
}

// Sdílený stav pozvánky — používá řádek tabulky (desktop) i karta (mobil).
function useInviteRow(invite: Invite, yearId: string) {
  const { dispatch, me } = useStore();
  const [edit, setEdit] = useState(false);
  const [name, setName] = useState(invite.name);
  const [link, setLink] = useState(invite.link ?? "");
  const [availability, setAvailability] = useState(invite.availability ?? "");
  const [price, setPrice] = useState(invite.price ?? "");

  async function save() {
    // Posíláme i prázdné hodnoty ("") — aby šlo pole opravdu vymazat.
    await dispatch({
      type: "updateInvite",
      yearId,
      inviteId: invite.id,
      patch: {
        name: name.trim() || invite.name,
        link: link.trim(),
        availability: availability.trim(),
        price: price.trim(),
      },
    });
    setEdit(false);
  }

  // Reset stavu (jen správce) — vrátí do neutrality (neosloveno, bez zájmu) a smaže
  // záznamy „kdo co", ale info (jméno, odkaz, kdy může, cena) zůstane.
  async function resetState() {
    await dispatch({
      type: "updateInvite",
      yearId,
      inviteId: invite.id,
      patch: { contacted: false, interest: "nevim", contactedBy: "", interestBy: "", cancelledBy: "" },
    });
    setEdit(false);
    flash(`„${invite.name}": stav vyresetován`, "🔄");
  }

  return { dispatch, me, edit, setEdit, name, setName, link, setLink, availability, setAvailability, price, setPrice, save, resetState };
}

// Mobilní karta jedné pozvánky (na úzkém displeji místo tabulky).
function InviteCard({ invite, yearId, index, canEdit }: { invite: Invite; yearId: string; index: number; canEdit: boolean }) {
  const s = useInviteRow(invite, yearId);

  if (canEdit && s.edit) {
    return (
      <div className="space-y-2 bg-paper2/40 p-3">
        <input className="input" value={s.name} onChange={(e) => s.setName(e.target.value)} placeholder="Jméno" />
        <input className="input" value={s.link} onChange={(e) => s.setLink(e.target.value)} placeholder="Odkaz" />
        <div className="grid grid-cols-2 gap-2">
          <input className="input" value={s.availability} onChange={(e) => s.setAvailability(e.target.value)} placeholder="Kdy může" />
          <input className="input" value={s.price} onChange={(e) => s.setPrice(e.target.value)} placeholder="Cena" />
        </div>
        <div className="flex gap-2 pt-0.5">
          <button className="btn-primary flex-1 py-2 text-sm" onClick={s.save}>Uložit</button>
          <button className="btn-ghost py-2 text-sm" onClick={() => s.setEdit(false)}>Zrušit</button>
        </div>
        {isAdmin(s.me) && (
          <button className="btn-ghost w-full justify-center py-2 text-sm text-ink-soft ring-1 ring-ink/10" onClick={s.resetState}>
            🔄 Vyresetovat stav (osloveno + ano/ne)
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`p-3 ${inviteBg(invite)}`}>
      <div className="flex items-start gap-2">
        <span className="chip shrink-0 tabular-nums">{index}</span>
        <div className="min-w-0 flex-1">
          <span className="font-medium">{invite.name}</span>
          {invite.link && (
            <a href={invite.link.startsWith("http") ? invite.link : `https://${invite.link}`} target="_blank" rel="noreferrer" className="ml-2 text-xs font-medium text-gold-700 hover:underline">
              odkaz ↗
            </a>
          )}
          <div className="mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-ink-soft">
            {invite.availability && <span>🗓 {invite.availability}</span>}
            {invite.price && <span>💰 {invite.price}</span>}
            {invite.addedBy && <span>➕ přidal {invite.addedBy}</span>}
            {invite.contactedBy && <span>✉️ oslovil {invite.contactedBy}</span>}
            {invite.interestBy && <span>{invite.interest === "ne" ? "👎" : "✅"} rozhodl {invite.interestBy}</span>}
            {invite.cancelledBy && <span>↩️ zrušil {invite.cancelledBy}</span>}
          </div>
        </div>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <ContactedButton invite={invite} yearId={yearId} canEdit={canEdit} />
        {invite.contacted && <InterestControl invite={invite} />}
        <MarkContactedButton invite={invite} yearId={yearId} canEdit={canEdit} />
        {canEdit && invite.contacted && (
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-ink-soft">má zájem?</span>
            <ConfirmButtons invite={invite} yearId={yearId} canEdit={canEdit} />
          </div>
        )}
        {canEdit && (
          <div className="ml-auto flex items-center gap-1">
            <CancelButton invite={invite} yearId={yearId} canEdit={canEdit} />
            <button className="btn-ghost px-2 py-1 text-xs" onClick={() => s.setEdit(true)}>Upravit</button>
            <DeleteButton onConfirm={() => s.dispatch({ type: "removeInvite", yearId, inviteId: invite.id })} />
          </div>
        )}
      </div>
    </div>
  );
}

function InviteRow({ invite, yearId, index, canEdit }: { invite: Invite; yearId: string; index: number; canEdit: boolean }) {
  const { dispatch, me, edit, setEdit, name, setName, link, setLink, availability, setAvailability, price, setPrice, save, resetState } =
    useInviteRow(invite, yearId);

  if (canEdit && edit) {
    return (
      <tr className="border-b border-ink/[0.06] bg-paper2/40 align-top">
        <td className="px-3 py-2 text-ink-soft tabular-nums">{index}</td>
        <td className="px-3 py-2">
          <input className="input mb-1" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jméno" />
          <input className="input" value={link} onChange={(e) => setLink(e.target.value)} placeholder="Odkaz" />
        </td>
        <td className="px-3 py-2 text-ink-soft" colSpan={2}>—</td>
        <td className="px-3 py-2"><input className="input" value={availability} onChange={(e) => setAvailability(e.target.value)} placeholder="Kdy" /></td>
        <td className="px-3 py-2"><input className="input" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Cena" /></td>
        <td className="px-3 py-2 text-ink-soft">—</td>
        <td className="px-3 py-2">
          <div className="flex flex-wrap gap-1">
            <button className="btn-primary px-3 py-1.5 text-xs" onClick={save}>Uložit</button>
            <button className="btn-ghost px-2 py-1.5 text-xs" onClick={() => setEdit(false)}>Zrušit</button>
            {isAdmin(me) && (
              <button className="btn-ghost px-2 py-1.5 text-xs text-ink-soft ring-1 ring-ink/10" onClick={resetState}>
                🔄 Reset stavu
              </button>
            )}
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr className={`border-b border-ink/[0.06] transition-colors ${inviteBg(invite) || "hover:bg-paper2/40"}`}>
      <td className="px-3 py-3 font-medium text-ink-soft tabular-nums">{index}</td>
      <td className="px-3 py-3">
        <span className="font-medium">{invite.name}</span>
        {invite.link && (
          <a href={invite.link.startsWith("http") ? invite.link : `https://${invite.link}`} target="_blank" rel="noreferrer" className="ml-2 text-xs font-medium text-gold-700 hover:underline">
            odkaz ↗
          </a>
        )}
        {invite.addedBy && <div className="text-xs text-ink-soft">➕ přidal {invite.addedBy}</div>}
        {invite.contactedBy && <div className="text-xs text-ink-soft">✉️ oslovil {invite.contactedBy}</div>}
        {invite.interestBy && <div className="text-xs text-ink-soft">{invite.interest === "ne" ? "👎" : "✅"} rozhodl {invite.interestBy}</div>}
        {invite.cancelledBy && <div className="text-xs text-ink-soft">↩️ zrušil {invite.cancelledBy}</div>}
      </td>
      <td className="px-3 py-3">
        <div className="flex flex-col items-start gap-1.5">
          <ContactedButton invite={invite} yearId={yearId} canEdit={canEdit} />
          <MarkContactedButton invite={invite} yearId={yearId} canEdit={canEdit} />
        </div>
      </td>
      <td className="px-3 py-3">
        <InterestControl invite={invite} />
      </td>
      <td className="px-3 py-3 text-ink-soft">{invite.availability || "—"}</td>
      <td className="px-3 py-3 text-ink-soft tabular-nums">{invite.price || "—"}</td>
      <td className="px-3 py-3">
        {canEdit ? <ConfirmButtons invite={invite} yearId={yearId} canEdit={canEdit} /> : <span className="text-xs text-ink-soft/50">—</span>}
      </td>
      <td className="px-3 py-3">
        {canEdit ? (
          <div className="flex items-center justify-end gap-1">
            <CancelButton invite={invite} yearId={yearId} canEdit={canEdit} />
            <button className="btn-ghost px-2 py-1 text-xs" onClick={() => setEdit(true)}>Upravit</button>
            <DeleteButton onConfirm={() => dispatch({ type: "removeInvite", yearId, inviteId: invite.id })} />
          </div>
        ) : null}
      </td>
    </tr>
  );
}
