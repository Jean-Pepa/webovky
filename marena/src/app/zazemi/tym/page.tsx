"use client";

import { useRef, useState } from "react";
import { useStore } from "@/lib/store";
import { ROLES, roleById, type Role } from "@/lib/roles";
import { DeleteButton } from "@/components/DeleteButton";
import { Modal } from "@/components/Modal";
import { Icon } from "@/components/Icons";
import { isAdmin } from "@/lib/admin";
import { sameName } from "@/lib/names";
import { SearchBox } from "@/components/SearchBox";
import { flash as toast } from "@/components/Flash";
import { ApproveAccountModal } from "@/components/ApproveAccountModal";
import { Collapsible } from "@/components/Collapsible";
import { matchesQuery } from "@/lib/search";
import type { Member, Year } from "@/lib/types";

export default function TymPage() {
  const { currentYear, me, setMe, dispatch, canEditCurrentYear } = useStore();
  const [openRole, setOpenRole] = useState<string | null>(null);
  const [purge, setPurge] = useState<Member | null>(null); // účet ke smazání (tabulka co vše)
  const [approve, setApprove] = useState<Member | null>(null); // schválení účtu: člen × výpomoc (jen Prodej)
  // Profilový modal: buď "vezmi si roli X" (roleToAdd), nebo jen úprava profilu.
  const [modal, setModal] = useState<{ roleToAdd?: string } | null>(null);
  // Správce (Mařena) může upravit libovolného člena.
  const [editMember, setEditMember] = useState<Member | null>(null);
  // Správce mění role člena ve vyskakovacím okně (přidat / vyměnit / odebrat).
  const [rolesFor, setRolesFor] = useState<Member | null>(null);
  // Vyskakovací okno po výběru / uvolnění role (zmizí za 3 s).
  const [celebrate, setCelebrate] = useState<{ role: string; kind: "taken" | "released" } | null>(null);
  const celebrateTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [q, setQ] = useState("");

  // Stejné okno (a stejná doba) pro vzetí i uvolnění funkce — liší se jen text.
  function flash(roleId: string, kind: "taken" | "released") {
    const roleName = ROLES.find((r) => r.id === roleId)?.name;
    if (!roleName) return;
    if (celebrateTimer.current) clearTimeout(celebrateTimer.current);
    setCelebrate({ role: roleName, kind });
    celebrateTimer.current = setTimeout(() => setCelebrate(null), 3000);
  }
  function congratulate(roleId: string) {
    flash(roleId, "taken");
  }

  const current = currentYear;
  if (!current) return null;
  const year = current; // typ Year (zachová zúžení i ve vnořených funkcích)
  const editable = canEditCurrentYear; // starší (zamčený) ročník = jen ke čtení
  const admin = isAdmin(me);

  // Kolik lidí čeká na schválení správcem (oranžové upozornění u nadpisu).
  const pendingCount = year.members.filter((m) => m.approved === false).length;
  const pendingLabel =
    pendingCount === 1
      ? "1 člověk čeká na schválení"
      : pendingCount >= 2 && pendingCount <= 4
        ? `${pendingCount} lidé čekají na schválení`
        : `${pendingCount} lidí čeká na schválení`;

  const myMember = year.members.find((m) => sameName(m.name, me));
  const takenBy = (roleId: string) => year.members.filter((m) => m.roleIds.includes(roleId));

  // Kolik lidí už má aspoň jednu roli (z celkového počtu) + kdo je zatím bez role.
  const withRoleCount = year.members.filter((m) => m.roleIds.length > 0).length;
  const roleless = year.members.filter((m) => m.roleIds.length === 0);

  // Hledání filtruje posty podle názvu role nebo jména zapsaného člověka.
  const roleMatchesQ = (r: Role) => matchesQuery(q, r.name, r.short, ...takenBy(r.id).map((m) => m.name));
  const mineRoles = ROLES.filter((r) => myMember?.roleIds.includes(r.id) && roleMatchesQ(r));
  const otherRoles = ROLES.filter((r) => !myMember?.roleIds.includes(r.id) && roleMatchesQ(r));

  // Vedoucí role = výslovně určený (roleLeads), jinak nejdřív zapsaný držitel.
  const leadIdOf = (roleId: string): string | undefined => {
    const holders = takenBy(roleId);
    if (!holders.length) return undefined;
    const explicit = year.roleLeads?.[roleId];
    if (explicit && holders.some((h) => h.id === explicit)) return explicit;
    return [...holders].sort((a, b) => a.createdAt.localeCompare(b.createdAt))[0].id;
  };

  // Odebrání role je přímé; přidání projde modálem jen u nového člověka.
  async function removeRoleFromMe(roleId: string) {
    if (!myMember) return;
    await dispatch({
      type: "updateMember",
      yearId: year.id,
      memberId: myMember.id,
      patch: { roleIds: myMember.roleIds.filter((r) => r !== roleId) },
    });
    flash(roleId, "released");
  }

  // Kdo už má účet, žádá o roli na jeden klik. Správce ji dostává rovnou,
  // ostatním vznikne žádost, kterou správce schválí/zamítne.
  async function takeRoleDirect(roleId: string) {
    if (!myMember) return;
    if (admin) {
      await dispatch({
        type: "takeRole",
        yearId: year.id,
        memberId: myMember.id,
        name: myMember.name,
        email: myMember.email ?? "",
        phone: myMember.phone ?? "",
        roleId,
        asLead: false,
      });
      congratulate(roleId);
      return;
    }
    await dispatch({ type: "requestRole", yearId: year.id, memberId: myMember.id, name: myMember.name, roleId });
    toast("Žádost odeslána — roli ti schválí správce", "⏳");
  }

  async function saveProfile(data: { name: string; email: string; phone: string; roleToAdd?: string; asLead?: boolean }) {
    const finalName = data.name.trim() || me;
    if (data.roleToAdd) {
      if (admin) {
        // Správce si roli bere rovnou (jeden atomický krok).
        await dispatch({
          type: "takeRole",
          yearId: year.id,
          memberId: myMember?.id,
          name: finalName,
          email: data.email,
          phone: data.phone,
          roleId: data.roleToAdd,
          asLead: !!data.asLead,
        });
        congratulate(data.roleToAdd);
      } else {
        // Ostatní posílají žádost — profil vznikne hned, role po schválení.
        await dispatch({
          type: "requestRole",
          yearId: year.id,
          memberId: myMember?.id,
          name: finalName,
          email: data.email,
          phone: data.phone,
          roleId: data.roleToAdd,
        });
        toast("Žádost odeslána — roli ti schválí správce", "⏳");
      }
    } else {
      const existing = year.members.find((m) => sameName(m.name, me));
      if (existing) {
        await dispatch({
          type: "updateMember",
          yearId: year.id,
          memberId: existing.id,
          patch: { name: finalName, email: data.email, phone: data.phone },
        });
      } else {
        await dispatch({ type: "addMember", yearId: year.id, name: finalName, roleIds: [], email: data.email, phone: data.phone });
      }
    }
    if (finalName !== me) setMe(finalName);
    setModal(null);
  }

  function PersonRow({ p, roleId, variant }: { p: Member; roleId: string; variant: "lead" | "helper" }) {
    const isLead = variant === "lead";
    return (
      <div className={`rounded-xl p-2.5 ${isLead ? "border-2 border-leaf bg-white" : "bg-surface/70 ring-1 ring-ink/[0.05]"}`}>
        <p className="flex flex-wrap items-center gap-1.5 text-sm font-semibold">
          <span>{isLead ? "👑" : "↳"}</span>
          <span>{p.name}</span>
          {isLead ? (
            <span className="chip bg-leaf text-white">vedoucí</span>
          ) : (
            <span className="chip">pomocník</span>
          )}
          {sameName(p.name, me) && <span className="chip bg-leaf text-white">to jsi ty</span>}
        </p>
        {(p.phone || p.email) ? (
          <p className="mt-1 flex min-w-0 flex-wrap gap-x-3 gap-y-0.5 text-xs text-ink-soft">
            {p.phone && (
              <a href={`tel:${p.phone}`} className="hover:text-gold-700">
                📞 {p.phone}
              </a>
            )}
            {p.email && (
              <a href={`mailto:${p.email}`} className="min-w-0 break-all hover:text-gold-700">
                ✉️ {p.email}
              </a>
            )}
          </p>
        ) : (
          <p className="mt-1 text-xs text-ink-soft/70">Bez kontaktu — doplň v profilu.</p>
        )}
        {admin && !isLead && editable && (
          <button
            className="btn-ghost mt-1.5 px-2 py-0.5 text-[11px]"
            onClick={() => dispatch({ type: "setRoleLead", yearId: year.id, roleId, memberId: p.id })}
          >
            👑 Udělat vedoucím
          </button>
        )}
      </div>
    );
  }

  // Řádek v pravém přehledu (seskupeno po rolích): vedoucí / pomocník / bez role.
  function RosterPerson({ m, variant }: { m: Member; variant: "lead" | "helper" | "none" }) {
    const isLead = variant === "lead";
    const marker = variant === "lead" ? "👑" : variant === "helper" ? "↳" : "👤";
    return (
      <div className={`rounded-lg p-2 ${isLead ? "border border-leaf bg-white" : "bg-surface/70 ring-1 ring-ink/[0.05]"}`}>
        <div className="flex items-start gap-1.5">
          <span className="shrink-0 text-sm">{marker}</span>
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1.5 text-sm font-semibold">
              <span className="truncate">{m.name}</span>
              {sameName(m.name, me) && <span className="chip shrink-0 bg-leaf text-white">ty</span>}
            </p>
            {m.phone && (
              <a href={`tel:${m.phone}`} className="block truncate text-xs text-ink-soft hover:text-gold-700">
                📞 {m.phone}
              </a>
            )}
            {m.email && (
              <a href={`mailto:${m.email}`} className="block truncate text-xs text-ink-soft hover:text-gold-700">
                ✉️ {m.email}
              </a>
            )}
          </div>
        </div>
        {admin && (
          <div className="mt-1.5 flex items-center justify-end gap-1">
            <button className="btn-ghost px-1.5 py-0.5 text-[11px]" onClick={() => setEditMember(m)} title="Upravit člena">
              Upravit
            </button>
            <DeleteButton onConfirm={() => dispatch({ type: "removeMember", yearId: year.id, memberId: m.id })} />
          </div>
        )}
      </div>
    );
  }

  function RoleCard({ r, defaultOpen }: { r: Role; defaultOpen: boolean }) {
    const people = takenBy(r.id);
    const taken = people.length > 0;
    const mine = myMember?.roleIds.includes(r.id) ?? false;
    const dutiesOpen = openRole === r.id;
    const leadId = leadIdOf(r.id);
    const lead = people.find((p) => p.id === leadId);
    const helpers = people.filter((p) => p.id !== leadId);

    return (
      <Collapsible
        defaultOpen={defaultOpen}
        className={`card overflow-hidden transition ${mine ? "role-taken bg-leaf/5" : ""}`}
        headerClassName="items-start gap-3 p-4"
        header={(open) => (
          <div className="flex items-start gap-3">
            <span className="text-2xl">{r.emoji}</span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-display text-base font-semibold">{r.name}</span>
                {taken ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-500 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#1d1d1f]">
                    <Icon name="users" className="h-3.5 w-3.5" />
                    <span className="text-xs leading-none">{people.length}</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-leaf/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-leaf-700">
                    <Icon name="users" className="h-3.5 w-3.5" />
                    <span className="text-xs leading-none">0</span>
                    <span className="opacity-85">· Volné</span>
                  </span>
                )}
              </div>
              {/* Sbaleno → kdo to vede; rozbaleno → krátký popis. */}
              {open ? (
                <p className="mt-0.5 text-sm text-ink-soft">{r.short}</p>
              ) : taken && lead ? (
                <p className="mt-0.5 truncate text-sm text-ink-soft">
                  👑 {lead.name}
                  {helpers.length > 0 ? ` · +${helpers.length}` : ""}
                </p>
              ) : (
                <p className="mt-0.5 text-sm text-ink-soft/70">Zatím volné — můžeš si ji vzít.</p>
              )}
            </div>
          </div>
        )}
      >
        <div className="px-4 pb-4">
          {/* Kdo funkci drží — vedoucí (červený rámeček) + odsazení pomocníci */}
          {!taken ? (
            <p className="text-xs text-ink-soft/70">Zatím nikdo — můžeš si ji vzít a stát se vedoucím.</p>
          ) : (
            <div className="space-y-2">
              {lead && <PersonRow p={lead} roleId={r.id} variant="lead" />}
              {helpers.length > 0 && (
                <div className="ml-3 space-y-2 border-l-2 border-gold-300 pl-3">
                  {helpers.map((p) => (
                    <PersonRow key={p.id} p={p} roleId={r.id} variant="helper" />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Žádosti o roli — schvaluje správce */}
          {year.members.some((m) => (m.roleRequests ?? []).includes(r.id)) && (
            <div className="mt-2 space-y-1.5">
              {year.members
                .filter((m) => (m.roleRequests ?? []).includes(r.id))
                .map((m) => (
                  <div key={m.id} className="flex flex-wrap items-center gap-2 rounded-lg bg-amber-50 px-2.5 py-1.5 text-sm ring-1 ring-amber-200">
                    <span className="min-w-0 flex-1 truncate">⏳ <strong>{m.name}</strong> žádá o roli</span>
                    {admin && (
                      <span className="flex shrink-0 gap-1.5">
                        <button
                          className="rounded-full bg-leaf px-3 py-1 text-xs font-semibold text-white transition hover:opacity-90"
                          onClick={() => dispatch({ type: "resolveRoleRequest", yearId: year.id, memberId: m.id, roleId: r.id, approve: true })}
                        >
                          Schválit
                        </button>
                        <button
                          className="rounded-full bg-paper2 px-3 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                          onClick={() => dispatch({ type: "resolveRoleRequest", yearId: year.id, memberId: m.id, roleId: r.id, approve: false })}
                        >
                          Zamítnout
                        </button>
                      </span>
                    )}
                  </div>
                ))}
            </div>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {editable &&
              (mine ? (
                <button className="btn-secondary" onClick={() => removeRoleFromMe(r.id)}>
                  Uvolnit funkci
                </button>
              ) : r.id === "hlavni" && !admin ? (
                <span className="text-xs text-ink-soft">🔒 Tuto funkci přiděluje jen správce (Mařena).</span>
              ) : (myMember?.roleRequests ?? []).includes(r.id) ? (
                <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800">⏳ Žádost čeká na správce</span>
              ) : (
                <button
                  className={taken ? "btn-secondary" : "btn-primary"}
                  onClick={() => (myMember ? takeRoleDirect(r.id) : setModal({ roleToAdd: r.id }))}
                >
                  {taken ? "Přidat se taky" : "Vzít si"}
                </button>
              ))}
            <button className="btn-ghost" onClick={() => setOpenRole(dutiesOpen ? null : r.id)}>
              {dutiesOpen ? "Skrýt úkoly" : "Co to obnáší"}
            </button>
          </div>
          {dutiesOpen && (
            <ul className="mt-3 space-y-1.5 border-t border-ink/[0.06] pt-3 text-sm text-ink-soft">
              {r.duties.map((d, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-gold-600">•</span>
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Collapsible>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-display text-[28px] font-bold uppercase tracking-tight">Tým &amp; role</h1>
          {admin && pendingCount > 0 && (
            <span className="pending-glow inline-flex items-center gap-1.5 rounded-full bg-amber-500 px-3 py-1 text-sm font-semibold text-white">
              ⏳ {pendingLabel}
            </span>
          )}
        </div>
        <SearchBox value={q} onChange={setQ} placeholder="Hledat roli nebo člověka…" className="w-full sm:w-72" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Vlevo: můj profil + funkce */}
        <div className="min-w-0 space-y-8">
          {/* Já v týmu */}
          <section className="card p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-[20px] font-semibold">Já v týmu</h2>
              {editable && (
                <button className="btn-secondary" onClick={() => setModal({})}>
                  {myMember ? "Upravit profil" : "Vyplnit profil"}
                </button>
              )}
            </div>
            {myMember ? (
              <div className="mt-3 min-w-0">
                <p className="break-words font-semibold">{myMember.name}</p>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {myMember.roleIds.length === 0 ? (
                    <span className="text-sm text-ink-soft">Zatím bez role — vyber si níže.</span>
                  ) : (
                    myMember.roleIds.map((id) => {
                      const role = roleById(id);
                      return role ? (
                        <span key={id} className="chip">
                          {role.emoji} {role.name}
                        </span>
                      ) : null;
                    })
                  )}
                </div>
                {(myMember.email || myMember.phone) && (
                  <p className="mt-2 break-words text-sm text-ink-soft">
                    {myMember.email && <span>✉️ {myMember.email}</span>}
                    {myMember.email && myMember.phone && <span> · </span>}
                    {myMember.phone && <span>📞 {myMember.phone}</span>}
                  </p>
                )}
              </div>
            ) : (
              <p className="mt-2 text-sm text-ink-soft">Ještě nejsi v týmu. Vyber si roli níže — vyskočí okno na doplnění kontaktu.</p>
            )}
          </section>

          {/* Soupiska celého týmu — sbalitelná, vidí ji všichni; upravovat (schválit/smazat) může jen správce */}
          <Collapsible
            key={`soupiska-${q.length > 0}`}
            defaultOpen={q.length > 0}
            className="card p-4 sm:p-5"
            header={
              <span className="flex flex-wrap items-center gap-2 font-display text-[20px] font-semibold">
                Soupiska týmu ({year.members.length})
                {year.members.filter((m) => m.approved === false).length > 0 && (
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
                    ⏳ {year.members.filter((m) => m.approved === false).length} čeká
                  </span>
                )}
              </span>
            }
          >
            <p className="mb-3 mt-2 text-xs text-ink-soft">
              {admin
                ? "Tady schvaluješ nové účty. Čekající jsou nahoře. „Smazat účet“ odstraní člověka úplně — z týmu, rolí i seznamu."
                : "Přehled všech v týmu i s kontaktem. Upravovat a schvalovat může jen správce — tobě se ukazuje jen náhled."}
            </p>
            {year.members.length === 0 ? (
              <p className="text-sm text-ink-soft">Zatím nikdo.</p>
            ) : (
              <ul className="divide-y divide-black/[0.06]">
                {[...year.members]
                  .filter((m) => matchesQuery(q, m.name, m.email, m.phone))
                  .sort((a, b) => {
                    // čekající nahoru, pak abecedně
                    const ap = a.approved === false ? 0 : 1;
                    const bp = b.approved === false ? 0 : 1;
                    if (ap !== bp) return ap - bp;
                    return a.name.localeCompare(b.name, "cs");
                  })
                  .map((m) => {
                    const pending = m.approved === false;
                    // Vybrané role člověka (bez duplikátů, přeložené na názvy).
                    const roleNames = [...new Set(m.roleIds.map((id) => roleById(id)?.name).filter(Boolean) as string[])];
                    return (
                      <li key={m.id} className="space-y-2 py-2.5">
                        {/* Info přes celou šířku — role, telefon i e-mail se zobrazí CELÉ */}
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-medium">{m.name}</span>
                            {pending ? (
                              <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">⏳ Čeká</span>
                            ) : (
                              <span className="shrink-0 rounded-full bg-leaf/15 px-2 py-0.5 text-xs font-semibold text-leaf-700">✓ Schváleno</span>
                            )}
                          </div>
                          {/* Vybraná role (malým písmem) — nebo že žádnou nemá */}
                          <p className="mt-0.5 text-xs">
                            {roleNames.length ? (
                              <span className="text-ink-soft">🎭 {roleNames.join(" · ")}</span>
                            ) : (
                              <span className="italic text-ink-soft/70">bez role</span>
                            )}
                          </p>
                          {/* Kontakt — telefon i e-mail celé, každý na svém řádku */}
                          {m.phone && (
                            <a href={`tel:${m.phone}`} className="mt-0.5 block text-xs text-ink-soft hover:text-gold-700">
                              📞 {m.phone}
                            </a>
                          )}
                          {m.email && (
                            <a href={`mailto:${m.email}`} className="mt-0.5 block break-all text-xs text-ink-soft hover:text-gold-700">
                              ✉️ {m.email}
                            </a>
                          )}
                        </div>
                        {admin && (
                          <div className="flex flex-wrap items-center gap-2">
                            {pending && (
                              <button
                                className="rounded-full bg-leaf px-3 py-1.5 text-xs font-semibold text-white transition hover:opacity-90"
                                onClick={() => setApprove(m)}
                              >
                                Schválit
                              </button>
                            )}
                            {/* Pomocník u stánku: uvidí jen Prodej, nic jiného */}
                            <button
                              className={`rounded-full px-2.5 py-1.5 text-xs font-semibold transition ${
                                m.posOnly ? "bg-gold-500 text-[#1d1d1f] hover:bg-gold-400" : "bg-paper2 text-ink-soft hover:bg-gold-100"
                              }`}
                              title="Člověk uvidí jen Prodej (pomocník u stánku)"
                              onClick={() => dispatch({ type: "updateMember", yearId: year.id, memberId: m.id, patch: { posOnly: !m.posOnly, vyberOnly: false } })}
                            >
                              🛒 {m.posOnly ? "jen Prodej ✓" : "jen Prodej"}
                            </button>
                            {/* Výběrčí vkladů: uvidí jen Finance → Výběr */}
                            <button
                              className={`rounded-full px-2.5 py-1.5 text-xs font-semibold transition ${
                                m.vyberOnly ? "bg-gold-500 text-[#1d1d1f] hover:bg-gold-400" : "bg-paper2 text-ink-soft hover:bg-gold-100"
                              }`}
                              title="Člověk uvidí jen Finance → Výběr (výběrčí vkladů)"
                              onClick={() => dispatch({ type: "updateMember", yearId: year.id, memberId: m.id, patch: { vyberOnly: !m.vyberOnly, posOnly: false } })}
                            >
                              💰 {m.vyberOnly ? "jen Výběr ✓" : "jen Výběr"}
                            </button>
                            {/* Změnit role — vyskakovací okno (přidat / vyměnit / odebrat) */}
                            <button
                              className="rounded-full bg-plum-600 px-2.5 py-1.5 text-xs font-semibold text-white transition hover:bg-plum-700"
                              title="Změnit role člena — přidat, vyměnit nebo úplně odebrat"
                              onClick={() => setRolesFor(m)}
                            >
                              🎭 Změnit role
                            </button>
                            <button className="btn-danger" onClick={() => setPurge(m)}>
                              Smazat účet
                            </button>
                          </div>
                        )}
                      </li>
                    );
                  })}
              </ul>
            )}
          </Collapsible>

          {/* Moje funkce nahoře */}
          {mineRoles.length > 0 && (
            <section className="space-y-3">
              <h2 className="font-display text-[20px] font-semibold">Moje funkce</h2>
              <div className="grid items-start gap-3 md:grid-cols-2">
                {mineRoles.map((r) => (
                  <RoleCard key={r.id} r={r} defaultOpen />
                ))}
              </div>
            </section>
          )}

          {/* Ostatní posty */}
          <section className="space-y-3">
            <h2 className="font-display text-[20px] font-semibold">{mineRoles.length > 0 ? "Další posty" : "Posty a co obnášejí"}</h2>
            <div className="grid items-start gap-3 md:grid-cols-2">
              {otherRoles.map((r) => (
                <RoleCard key={`${r.id}-${q.length > 0}`} r={r} defaultOpen={q.length > 0} />
              ))}
            </div>
          </section>
        </div>

        {/* Vpravo: počítadlo (kolik lidí má roli z celku) + lidi bez role */}
        <aside className="h-fit min-w-0 space-y-4 lg:sticky lg:top-4">
          <div className="flex items-center gap-3 rounded-xl bg-gold-500 px-5 py-3 text-[#1d1d1f] shadow-sm">
            <Icon name="users" className="h-8 w-8 shrink-0" />
            <div className="leading-none">
              <div className="font-display text-4xl font-bold tracking-tight">
                {withRoleCount}
                <span className="text-2xl font-semibold opacity-80"> z {year.members.length}</span>
              </div>
              <div className="mt-1 text-xs font-medium uppercase tracking-wide text-[#1d1d1f]/75">má roli</div>
            </div>
          </div>

          {/* Lidi, kteří ještě nemají žádnou roli. */}
          <section className="card p-4">
            <h2 className="mb-3 flex items-center gap-2 font-display text-[20px] font-semibold">
              <Icon name="users" className="h-5 w-5 text-gold-600" /> Bez role ({roleless.length})
            </h2>
            {roleless.length === 0 ? (
              <p className="text-sm text-ink-soft">Všichni mají roli. 🎉</p>
            ) : (
              <div className="space-y-1.5">
                {roleless.map((m) => (
                  <RosterPerson key={m.id} m={m} variant="none" />
                ))}
              </div>
            )}
            {!admin && (
              <p className="mt-3 text-[11px] text-ink-soft/60">Upravovat a mazat lidi může jen správce.</p>
            )}
          </section>
        </aside>

      </div>

      <ProfileModal
        open={modal !== null}
        roleToAdd={modal?.roleToAdd}
        roleEmpty={modal?.roleToAdd ? takenBy(modal.roleToAdd).length === 0 : true}
        canChooseLead={modal?.roleToAdd ? takenBy(modal.roleToAdd).length === 0 || admin : false}
        currentLeadName={modal?.roleToAdd ? year.members.find((m) => m.id === leadIdOf(modal.roleToAdd!))?.name : undefined}
        initial={{ name: myMember?.name ?? me, email: myMember?.email ?? "", phone: myMember?.phone ?? "" }}
        onClose={() => setModal(null)}
        onSave={saveProfile}
      />

      {editMember && <AdminEditMemberModal member={editMember} yearId={year.id} onClose={() => setEditMember(null)} />}
      {rolesFor && <ChangeRolesModal key={rolesFor.id} member={rolesFor} yearId={year.id} onClose={() => setRolesFor(null)} />}
      {purge && <PurgeAccountModal key={purge.id} member={purge} year={year} onClose={() => setPurge(null)} />}
      {approve && <ApproveAccountModal key={approve.id} member={approve} yearId={year.id} onClose={() => setApprove(null)} />}

      {/* Vyskakovací okno po výběru / uvolnění role — vyskočí na 3 s a zmizí. */}
      {celebrate && (
        <div className="pointer-events-none fixed inset-0 z-50 grid place-items-center px-4">
          {celebrate.kind === "taken" ? (
            <div className="marena-pop max-w-sm rounded-2xl bg-gradient-to-br from-plum-700 to-ink px-8 py-7 text-center text-white shadow-2xl ring-2 ring-gold-500/60">
              <div className="text-5xl">🎉</div>
              <p className="mt-2 font-display text-xl font-bold">Mařena ti gratuluje, boží bojovníku!</p>
              <p className="mt-2 text-base">
                Tvoje role je <strong>{celebrate.role}</strong>.
              </p>
              <p className="mt-1 text-sm text-white/90">Hodně zdaru. 💪</p>
            </div>
          ) : (
            <div className="marena-pop max-w-sm rounded-2xl bg-gradient-to-br from-plum-600 to-ink px-8 py-7 text-center text-white shadow-2xl ring-2 ring-white/30">
              <div className="text-5xl">👋</div>
              <p className="mt-2 font-display text-xl font-bold">Funkci jsi uvolnil!</p>
              <p className="mt-2 text-base">
                Roli <strong>{celebrate.role}</strong> jsi pustil — je zase volná pro ostatní.
              </p>
              <p className="mt-1 text-sm text-white/90">Díky za pomoc! 🙌</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Tabulka „co vše navždy smazat" u jednoho účtu (jen pro správce).
function PurgeAccountModal({ member, year, onClose }: { member: Member; year: Year; onClose: () => void }) {
  const { dispatch } = useStore();
  const [busy, setBusy] = useState(false);
  const name = member.name;
  const his = (v?: string) => !!v && sameName(v, name);

  // Kolik čeho po člověku v ročníku zůstává — každá kategorie jde smazat zvlášť.
  const counts: Record<string, number> = {
    posts: (year.posts ?? []).filter((p) => his(p.author)).length,
    polls: (year.polls ?? []).filter((p) => his(p.author)).length,
    votes: (year.polls ?? []).reduce(
      (s, poll) => s + poll.options.reduce((a, o) => a + o.voters.filter((v) => sameName(v, name)).length, 0),
      0,
    ),
    events: (year.events ?? []).filter((e) => his(e.author)).length,
    shifts: (year.shifts ?? []).filter(
      (s) => s.people.some((n) => sameName(n, name)) || (s.backup ?? []).some((n) => sameName(n, name)),
    ).length,
    finances: (year.finances ?? []).filter((f) => his(f.who)).length,
    contributions: (year.contributions ?? []).filter((c) => his(c.name)).length,
    merchOrders: (year.merchOrders ?? []).filter((o) => his(o.name)).length,
    invites: (year.invites ?? []).filter((i) => his(i.addedBy)).length,
    kitchen: (year.kitchen ?? []).filter((k) => his(k.author)).length,
    mentions:
      (year.sponsors ?? []).filter((s) => his(s.who)).length +
      (year.decor ?? []).filter((d) => his(d.who)).length +
      (year.invites ?? []).filter((i) => his(i.addedBy) || his(i.contactedBy) || his(i.interestBy) || his(i.cancelledBy)).length +
      (year.tasks ?? []).filter((t) => his(t.assignee)).length +
      (year.posts ?? []).filter((p) => his(p.editedBy) || (p.edits ?? []).some((e) => sameName(e.by, name))).length,
  };

  const ROWS: { key: string; label: string }[] = [
    { key: "posts", label: "Příspěvky na nástěnce" },
    { key: "polls", label: "Založené ankety" },
    { key: "votes", label: "Hlasy v anketách" },
    { key: "events", label: "Události v kalendáři" },
    { key: "shifts", label: "Přihlášení na směny" },
    { key: "finances", label: "Finance psané na jméno" },
    { key: "contributions", label: "Vklady do společné kasy" },
    { key: "merchOrders", label: "Objednávky merche" },
    { key: "invites", label: "Program — koho přidal(a)" },
    { key: "kitchen", label: "Soubory v kuchyni" },
    { key: "mentions", label: "Jméno u cizích záznamů (řeší / má udělat / upravil)" },
  ];
  const [sel, setSel] = useState<Record<string, boolean>>(() => Object.fromEntries(ROWS.map((r) => [r.key, true])));

  const available = ROWS.filter((r) => counts[r.key] > 0);
  const allSelected = available.length > 0 && available.every((r) => sel[r.key]);
  function toggleAll() {
    const next = !allSelected;
    setSel((s) => ({ ...s, ...Object.fromEntries(available.map((r) => [r.key, next])) }));
  }

  async function go() {
    setBusy(true);
    const opts = Object.fromEntries(ROWS.map((r) => [r.key, !!sel[r.key] && counts[r.key] > 0]));
    await dispatch({ type: "purgeMember", yearId: year.id, memberId: member.id, name, opts });
    onClose();
  }

  return (
    <Modal open onClose={onClose} title={`Smazat účet — ${name}`}>
      <p className="mb-3 text-sm text-ink-soft">
        Vyber, co všechno se má po tomto člověku <strong>navždy</strong> smazat. Účet (jméno, kontakt, role) se smaže vždy.
      </p>
      <div className="space-y-2">
        <div className="flex items-center gap-3 rounded-xl bg-red-50 px-3 py-2.5 text-sm">
          <Icon name="users" className="h-4 w-4 text-red-600" />
          <span className="flex-1 font-medium">Účet — jméno, kontakt, role</span>
          <span className="shrink-0 text-xs font-medium text-red-600">smaže se vždy</span>
        </div>
        {available.length > 0 && (
          <div className="flex items-center justify-between px-1 pt-1">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-soft">Co dalšího smazat</span>
            <button type="button" onClick={toggleAll} className="text-xs font-bold text-red-600 hover:underline">
              {allSelected ? "Zrušit výběr" : "Vybrat vše"}
            </button>
          </div>
        )}
        {ROWS.map((r) => (
          <label
            key={r.key}
            className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm ${counts[r.key] === 0 ? "border-ink/[0.06] opacity-50" : "border-ink/10"}`}
          >
            <input
              type="checkbox"
              checked={!!sel[r.key] && counts[r.key] > 0}
              onChange={() => setSel((s) => ({ ...s, [r.key]: !s[r.key] }))}
              disabled={counts[r.key] === 0}
              className="h-4 w-4 accent-red-600"
            />
            <span className="min-w-0 flex-1 break-words">{r.label}</span>
            <span className="shrink-0 text-xs text-ink-soft">{counts[r.key]}×</span>
          </label>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <button className="btn-danger" onClick={go} disabled={busy}>
          {busy ? "Mažu…" : "Smazat navždy"}
        </button>
        <button className="btn-ghost" onClick={onClose}>Zrušit</button>
      </div>
    </Modal>
  );
}

// Správce (Mařena) může upravit jméno, kontakt i funkce libovolného člena.
function AdminEditMemberModal({ member, yearId, onClose }: { member: Member; yearId: string; onClose: () => void }) {
  const { dispatch } = useStore();
  const [name, setName] = useState(member.name);
  const [email, setEmail] = useState(member.email ?? "");
  const [phone, setPhone] = useState(member.phone ?? "");
  const [roleIds, setRoleIds] = useState<string[]>(member.roleIds);

  function toggleRole(id: string) {
    setRoleIds((arr) => (arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id]));
  }

  async function save() {
    await dispatch({
      type: "updateMember",
      yearId,
      memberId: member.id,
      patch: { name: name.trim() || member.name, email, phone, roleIds },
    });
    onClose();
  }

  return (
    <Modal open onClose={onClose} title={`Upravit: ${member.name}`}>
      <div className="space-y-3">
        <div>
          <label className="label">Jméno</label>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
        </div>
        <div>
          <label className="label">E-mail</label>
          <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ty@email.cz" />
        </div>
        <div>
          <label className="label">Telefon</label>
          <input className="input" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+420…" />
        </div>
        <div>
          <label className="label">Funkce (klikni pro přidání/odebrání)</label>
          <div className="flex flex-wrap gap-1.5">
            {ROLES.map((r) => {
              const on = roleIds.includes(r.id);
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => toggleRole(r.id)}
                  className={`rounded-full px-2.5 py-1 text-xs font-medium transition ${
                    on ? "bg-gold-500 text-[#1d1d1f]" : "bg-paper2 text-ink-soft hover:bg-ink/5"
                  }`}
                >
                  {r.emoji} {r.name}
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex items-center gap-2 pt-1">
          <button className="btn-primary flex-1" onClick={save}>
            Uložit
          </button>
          <button className="btn-ghost" onClick={onClose}>
            Zrušit
          </button>
        </div>
      </div>
    </Modal>
  );
}

// Změna rolí jednoho člena (jen správce) — vyskakovací okno uprostřed.
// Klikáním se role přidávají/odebírají (i víc najednou), „Odebrat všechny"
// je nechá bez role. Uloží se až tlačítkem.
function ChangeRolesModal({ member, yearId, onClose }: { member: Member; yearId: string; onClose: () => void }) {
  const { dispatch } = useStore();
  const [roleIds, setRoleIds] = useState<string[]>(member.roleIds);
  const [busy, setBusy] = useState(false);

  function toggle(id: string) {
    setRoleIds((arr) => (arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id]));
  }

  const chosen = ROLES.filter((r) => roleIds.includes(r.id));
  // Nezměněno? Tlačítko „Uložit" ať nesvádí, když se nic nevybralo jinak.
  const dirty = roleIds.length !== member.roleIds.length || roleIds.some((id) => !member.roleIds.includes(id));

  async function save() {
    if (busy) return;
    setBusy(true);
    await dispatch({ type: "updateMember", yearId, memberId: member.id, patch: { roleIds } });
    setBusy(false);
    toast(roleIds.length === 0 ? `${member.name} je teď bez role` : `Role uloženy — ${member.name}`, "🎭");
    onClose();
  }

  return (
    <Modal open onClose={onClose} title={`Změnit role — ${member.name}`}>
      <p className="mb-3 text-sm text-ink-soft">
        Chceš změnit role u <strong className="text-ink">{member.name}</strong>? Klikáním roli přidáš nebo odebereš — člověk jich může mít i víc najednou.
      </p>

      {/* Aktuální výběr — klikem na křížek roli hned pustíš */}
      <div className="mb-3 rounded-xl bg-paper2 px-3 py-2.5">
        <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-ink-soft">Vybrané role</p>
        {chosen.length === 0 ? (
          <p className="text-sm italic text-ink-soft/70">Zatím bez role</p>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {chosen.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => toggle(r.id)}
                title="Odebrat tuto roli"
                className="inline-flex items-center gap-1 rounded-full bg-gold-500 px-2.5 py-1 text-xs font-semibold text-[#1d1d1f] transition hover:bg-gold-400"
              >
                {r.emoji} {r.name} <span className="text-sm leading-none">×</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Všechny role — klik = přidat/odebrat */}
      <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-ink-soft">Klikni pro přidání / odebrání</p>
      <div className="flex flex-wrap gap-1.5">
        {ROLES.map((r) => {
          const on = roleIds.includes(r.id);
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => toggle(r.id)}
              className={`rounded-full px-2.5 py-1 text-xs font-medium transition ${
                on ? "bg-gold-500 text-[#1d1d1f]" : "bg-paper2 text-ink-soft hover:bg-ink/5"
              }`}
            >
              {r.emoji} {r.name} {on && "✓"}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button className="btn-primary flex-1" onClick={save} disabled={busy || !dirty}>
          {busy ? "Ukládám…" : "Uložit role"}
        </button>
        {roleIds.length > 0 && (
          <button
            type="button"
            className="rounded-full bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
            onClick={() => setRoleIds([])}
          >
            Odebrat všechny
          </button>
        )}
        <button type="button" className="btn-ghost" onClick={onClose}>
          Zrušit
        </button>
      </div>
    </Modal>
  );
}

function ProfileModal({
  open,
  roleToAdd,
  roleEmpty,
  canChooseLead,
  currentLeadName,
  initial,
  onClose,
  onSave,
}: {
  open: boolean;
  roleToAdd?: string;
  roleEmpty: boolean;
  canChooseLead: boolean;
  currentLeadName?: string;
  initial: { name: string; email: string; phone: string };
  onClose: () => void;
  onSave: (d: { name: string; email: string; phone: string; roleToAdd?: string; asLead?: boolean }) => void;
}) {
  const role = roleById(roleToAdd);
  return (
    <Modal open={open} onClose={onClose} title={role ? `Bereš si roli: ${role.emoji} ${role.name}` : "Můj profil"}>
      <ProfileForm
        key={`${open}-${roleToAdd ?? "profile"}`}
        initial={initial}
        roleToAdd={roleToAdd}
        roleEmpty={roleEmpty}
        canChooseLead={canChooseLead}
        currentLeadName={currentLeadName}
        onSave={onSave}
        onClose={onClose}
      />
    </Modal>
  );
}

function ProfileForm({
  initial,
  roleToAdd,
  roleEmpty,
  canChooseLead,
  currentLeadName,
  onSave,
  onClose,
}: {
  initial: { name: string; email: string; phone: string };
  roleToAdd?: string;
  roleEmpty: boolean;
  canChooseLead: boolean;
  currentLeadName?: string;
  onSave: (d: { name: string; email: string; phone: string; roleToAdd?: string; asLead?: boolean }) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(initial.name);
  const [email, setEmail] = useState(initial.email);
  const [phone, setPhone] = useState(initial.phone);
  // Volně obsazená funkce → výchozí vedoucí; jinak výchozí pomocník.
  const [asLead, setAsLead] = useState(roleEmpty);

  // Když si bereš roli a kontakt už máš kompletní (z registrace), znovu se neptáme.
  const contactComplete = !!(initial.name.trim() && initial.email.trim() && initial.phone.trim());
  const skipContact = !!roleToAdd && contactComplete;

  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        if (!name.trim()) return;
        // Vedoucího smí zvolit jen když je funkce volná, nebo je to správce.
        onSave({ name, email, phone, roleToAdd, asLead: canChooseLead ? asLead : false });
      }}
    >
      {skipContact ? (
        <p className="rounded-xl bg-paper2 px-3 py-2 text-sm text-ink-soft">
          Přidáš se jako <strong className="text-ink">{name}</strong>
          {email ? ` · ${email}` : ""}
          {phone ? ` · ${phone}` : ""}.
        </p>
      ) : (
        <>
          <p className="text-sm text-ink-soft">Doplň prosím jméno, e-mail a telefon, ať tě ostatní v týmu zastihnou.</p>
          <div>
            <label className="label">Jméno</label>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tvoje jméno" autoFocus />
          </div>
          <div>
            <label className="label">E-mail</label>
            <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ty@email.cz" />
          </div>
          <div>
            <label className="label">Telefon</label>
            <input className="input" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+420…" />
          </div>
        </>
      )}

      {roleToAdd &&
        (canChooseLead ? (
          <div>
            <label className="label">Tvoje pozice ve funkci</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setAsLead(true)}
                className={`flex-1 rounded-xl px-3 py-2 text-sm font-medium transition ${
                  asLead ? "bg-leaf text-white" : "bg-paper2 text-ink-soft hover:bg-ink/5"
                }`}
              >
                👑 Vedoucí
              </button>
              <button
                type="button"
                onClick={() => setAsLead(false)}
                className={`flex-1 rounded-xl px-3 py-2 text-sm font-medium transition ${
                  !asLead ? "bg-gold-500 text-[#1d1d1f]" : "bg-paper2 text-ink-soft hover:bg-ink/5"
                }`}
              >
                Pomocník
              </button>
            </div>
            <p className="mt-1.5 text-xs text-ink-soft">
              {roleEmpty
                ? "Tuto funkci zatím nikdo nedrží — můžeš se stát jejím vedoucím."
                : asLead
                  ? `Jako správce převezmeš vedení${currentLeadName ? ` po: ${currentLeadName}` : ""}.`
                  : `Vedoucí${currentLeadName ? `: ${currentLeadName}` : ""}. Přidáš se jako pomocník.`}
            </p>
          </div>
        ) : (
          <p className="rounded-xl bg-paper2 px-3 py-2 text-xs text-ink-soft">
            🔒 Vedoucí{currentLeadName ? `: ${currentLeadName}` : " už je obsazený"}. Přidáš se jako <strong>pomocník</strong> — vedení může změnit jen správce.
          </p>
        ))}

      <div className="flex items-center gap-2 pt-1">
        <button type="submit" className="btn-primary flex-1">
          {roleToAdd ? "Vzít si roli" : "Uložit"}
        </button>
        <button type="button" className="btn-ghost" onClick={onClose}>
          Zrušit
        </button>
      </div>
    </form>
  );
}
