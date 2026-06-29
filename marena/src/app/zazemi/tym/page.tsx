"use client";

import { useRef, useState } from "react";
import { useStore } from "@/lib/store";
import { ROLES, roleById, type Role } from "@/lib/roles";
import { DeleteButton } from "@/components/DeleteButton";
import { Modal } from "@/components/Modal";
import { Icon } from "@/components/Icons";
import { isAdmin } from "@/lib/admin";
import { sameName } from "@/lib/names";
import type { Member, Year } from "@/lib/types";

export default function TymPage() {
  const { currentYear, me, setMe, dispatch, canEditCurrentYear } = useStore();
  const [openRole, setOpenRole] = useState<string | null>(null);
  const [purge, setPurge] = useState<Member | null>(null); // účet ke smazání (tabulka co vše)
  // Profilový modal: buď "vezmi si roli X" (roleToAdd), nebo jen úprava profilu.
  const [modal, setModal] = useState<{ roleToAdd?: string } | null>(null);
  // Správce (Mařena) může upravit libovolného člena.
  const [editMember, setEditMember] = useState<Member | null>(null);
  // Oslavné okno po výběru role (zmizí za 3 s).
  const [celebrate, setCelebrate] = useState<string | null>(null);
  const celebrateTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function congratulate(roleId: string) {
    const roleName = ROLES.find((r) => r.id === roleId)?.name;
    if (!roleName) return;
    if (celebrateTimer.current) clearTimeout(celebrateTimer.current);
    setCelebrate(roleName);
    celebrateTimer.current = setTimeout(() => setCelebrate(null), 3000);
  }

  const current = currentYear;
  if (!current) return null;
  const year = current; // typ Year (zachová zúžení i ve vnořených funkcích)
  const editable = canEditCurrentYear; // starší (zamčený) ročník = jen ke čtení
  const admin = isAdmin(me);

  const myMember = year.members.find((m) => sameName(m.name, me));
  const mineRoles = ROLES.filter((r) => myMember?.roleIds.includes(r.id));
  const otherRoles = ROLES.filter((r) => !myMember?.roleIds.includes(r.id));

  const takenBy = (roleId: string) => year.members.filter((m) => m.roleIds.includes(roleId));

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
  }

  // Kdo už má účet, přidá si další roli na jeden klik (bez vyplňování kontaktu).
  async function takeRoleDirect(roleId: string) {
    if (!myMember) return;
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
  }

  async function saveProfile(data: { name: string; email: string; phone: string; roleToAdd?: string; asLead?: boolean }) {
    const finalName = data.name.trim() || me;
    if (data.roleToAdd) {
      // Braní role: jeden atomický krok (vytvoří/upraví člena, přidá roli, určí vedoucího).
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
      <div className={`rounded-xl p-2.5 ${isLead ? "border-2 border-leaf bg-white" : "bg-white/70 ring-1 ring-black/[0.05]"}`}>
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
              <a href={`tel:${p.phone}`} className="hover:text-marigold-700">
                📞 {p.phone}
              </a>
            )}
            {p.email && (
              <a href={`mailto:${p.email}`} className="min-w-0 break-all hover:text-marigold-700">
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
      <div className={`rounded-lg p-2 ${isLead ? "border border-leaf bg-white" : "bg-white/70 ring-1 ring-black/[0.05]"}`}>
        <div className="flex items-start gap-1.5">
          <span className="shrink-0 text-sm">{marker}</span>
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1.5 text-sm font-semibold">
              <span className="truncate">{m.name}</span>
              {sameName(m.name, me) && <span className="chip shrink-0 bg-leaf text-white">ty</span>}
            </p>
            {m.phone && (
              <a href={`tel:${m.phone}`} className="block truncate text-xs text-ink-soft hover:text-marigold-700">
                📞 {m.phone}
              </a>
            )}
            {m.email && (
              <a href={`mailto:${m.email}`} className="block truncate text-xs text-ink-soft hover:text-marigold-700">
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

  function RoleCard({ r }: { r: Role }) {
    const people = takenBy(r.id);
    const taken = people.length > 0;
    const mine = myMember?.roleIds.includes(r.id) ?? false;
    const open = openRole === r.id;
    return (
      <div className={`card p-4 transition ${mine ? "role-taken bg-leaf/5" : ""}`}>
        <div className="flex items-start gap-3">
          <span className="text-2xl">{r.emoji}</span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-display text-base font-semibold">{r.name}</h3>
              {taken ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-marigold-600 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white">
                  <Icon name="users" className="h-3.5 w-3.5" />
                  <span className="text-xs leading-none">{people.length}</span>
                  <span className="opacity-85">· Obsazeno</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-leaf/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-leaf-700">
                  <Icon name="users" className="h-3.5 w-3.5" />
                  <span className="text-xs leading-none">0</span>
                  <span className="opacity-85">· Volné</span>
                </span>
              )}
            </div>
            <p className="text-sm text-ink-soft">{r.short}</p>
          </div>
        </div>

        {/* Kdo funkci drží — vedoucí (červený rámeček) + odsazení pomocníci */}
        <div className="mt-3">
          {!taken ? (
            <p className="text-xs text-ink-soft/70">Zatím nikdo — můžeš si ji vzít a stát se vedoucím.</p>
          ) : (
            (() => {
              const leadId = leadIdOf(r.id);
              const lead = people.find((p) => p.id === leadId);
              const helpers = people.filter((p) => p.id !== leadId);
              return (
                <div className="space-y-2">
                  {lead && <PersonRow p={lead} roleId={r.id} variant="lead" />}
                  {helpers.length > 0 && (
                    <div className="ml-3 space-y-2 border-l-2 border-marigold-300 pl-3">
                      {helpers.map((p) => (
                        <PersonRow key={p.id} p={p} roleId={r.id} variant="helper" />
                      ))}
                    </div>
                  )}
                </div>
              );
            })()
          )}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {editable &&
            (mine ? (
              <button className="btn-secondary" onClick={() => removeRoleFromMe(r.id)}>
                Uvolnit funkci
              </button>
            ) : r.id === "ekonom" && !admin ? (
              <span className="text-xs text-ink-soft">🔒 Tuto funkci přiděluje jen správce (Mařena).</span>
            ) : (
              <button
                className={taken ? "btn-secondary" : "btn-primary"}
                onClick={() => (myMember ? takeRoleDirect(r.id) : setModal({ roleToAdd: r.id }))}
              >
                {taken ? "Přidat se taky" : "Vzít si"}
              </button>
            ))}
          <button className="btn-ghost" onClick={() => setOpenRole(open ? null : r.id)}>
            {open ? "Skrýt úkoly" : "Co to obnáší"}
          </button>
        </div>
        {open && (
          <ul className="mt-3 space-y-1.5 border-t border-black/[0.06] pt-3 text-sm text-ink-soft">
            {r.duties.map((d, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-marigold-600">•</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Tým &amp; role</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Vlevo: můj profil + funkce */}
        <div className="min-w-0 space-y-8">
          {/* Já v týmu */}
          <section className="card p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-lg font-semibold">Já v týmu</h2>
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

          {/* Moje funkce nahoře */}
          {mineRoles.length > 0 && (
            <section className="space-y-3">
              <h2 className="font-display text-lg font-semibold">Moje funkce</h2>
              <div className="grid gap-3 md:grid-cols-2">
                {mineRoles.map((r) => (
                  <RoleCard key={r.id} r={r} />
                ))}
              </div>
            </section>
          )}

          {/* Ostatní posty */}
          <section className="space-y-3">
            <h2 className="font-display text-lg font-semibold">{mineRoles.length > 0 ? "Další posty" : "Posty a co obnášejí"}</h2>
            <div className="grid gap-3 md:grid-cols-2">
              {otherRoles.map((r) => (
                <RoleCard key={r.id} r={r} />
              ))}
            </div>
          </section>
        </div>

        {/* Vpravo: počítadlo + seznam všech přihlášených + jejich role */}
        <aside className="h-fit min-w-0 space-y-4 lg:sticky lg:top-4">
          <div className="flex items-center gap-3 rounded-2xl bg-marigold-600 px-5 py-3 text-white shadow-sm">
            <Icon name="users" className="h-8 w-8 shrink-0" />
            <div className="leading-none">
              <div className="font-display text-4xl font-bold tracking-tight">{year.members.length}</div>
              <div className="mt-1 text-xs font-medium uppercase tracking-wide text-white/85">zapsáno v týmu</div>
            </div>
          </div>
          <section className="card p-4">
            <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-semibold">
              <Icon name="users" className="h-5 w-5 text-marigold-600" /> Přihlášení ({year.members.length})
            </h2>
            {year.members.length === 0 ? (
              <p className="text-sm text-ink-soft">Zatím nikdo. Buď první!</p>
            ) : (
              <div className="space-y-4">
                {ROLES.filter((r) => takenBy(r.id).length > 0).map((r) => {
                  const holders = takenBy(r.id);
                  const leadId = leadIdOf(r.id);
                  const lead = holders.find((h) => h.id === leadId);
                  const helpers = holders.filter((h) => h.id !== leadId);
                  return (
                    <div key={r.id}>
                      <h3 className="mb-1.5 flex flex-wrap items-center gap-1.5 text-sm font-semibold">
                        <span>{r.emoji}</span> {r.name}
                        <span className="chip">{holders.length}</span>
                      </h3>
                      <div className="space-y-1.5">
                        {lead && <RosterPerson m={lead} variant="lead" />}
                        {helpers.length > 0 && (
                          <div className="ml-3 space-y-1.5 border-l-2 border-marigold-300 pl-3">
                            {helpers.map((h) => (
                              <RosterPerson key={h.id} m={h} variant="helper" />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {year.members.filter((m) => m.roleIds.length === 0).length > 0 && (
                  <div>
                    <h3 className="mb-1.5 text-sm font-semibold text-ink-soft">Bez role</h3>
                    <div className="space-y-1.5">
                      {year.members
                        .filter((m) => m.roleIds.length === 0)
                        .map((m) => (
                          <RosterPerson key={m.id} m={m} variant="none" />
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            {!admin && (
              <p className="mt-3 text-[11px] text-ink-soft/60">Upravovat a mazat lidi v seznamu může jen správce.</p>
            )}
          </section>
        </aside>

      </div>

      {/* Jen pro správce: schvalování a správa účtů (plná šířka, ať se vejde celé jméno i kontakt) */}
      {admin && (
        <section className="card p-4 sm:p-5">
          <h2 className="font-display text-lg font-semibold">Účty ({year.members.length})</h2>
          <p className="mb-3 mt-0.5 text-xs text-ink-soft">
            Tady schvaluješ nové účty. Čekající jsou nahoře. „Smazat účet“ odstraní člověka úplně — z týmu, rolí i seznamu.
          </p>
          {year.members.length === 0 ? (
            <p className="text-sm text-ink-soft">Zatím nikdo.</p>
          ) : (
            <ul className="divide-y divide-black/[0.06]">
              {[...year.members]
                .sort((a, b) => {
                  // čekající nahoru, pak abecedně
                  const ap = a.approved === false ? 0 : 1;
                  const bp = b.approved === false ? 0 : 1;
                  if (ap !== bp) return ap - bp;
                  return a.name.localeCompare(b.name, "cs");
                })
                .map((m) => {
                  const pending = m.approved === false;
                  return (
                    <li key={m.id} className="flex flex-wrap items-center gap-x-3 gap-y-2 py-2.5">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-medium">{m.name}</span>
                          {pending ? (
                            <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">⏳ Čeká</span>
                          ) : (
                            <span className="shrink-0 rounded-full bg-leaf/15 px-2 py-0.5 text-xs font-semibold text-leaf-700">✓ Schváleno</span>
                          )}
                        </div>
                        {(m.phone || m.email) && (
                          <div className="mt-0.5 break-words text-xs text-ink-soft">
                            {m.phone && <span>📞 {m.phone}</span>}
                            {m.phone && m.email && <span> · </span>}
                            {m.email && <span>✉️ {m.email}</span>}
                          </div>
                        )}
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        {pending && (
                          <button
                            className="rounded-full bg-leaf px-3 py-1.5 text-xs font-semibold text-white transition hover:opacity-90"
                            onClick={() => dispatch({ type: "approveMember", yearId: year.id, memberId: m.id })}
                          >
                            Schválit
                          </button>
                        )}
                        <button className="btn-danger" onClick={() => setPurge(m)}>
                          Smazat účet
                        </button>
                      </div>
                    </li>
                  );
                })}
            </ul>
          )}
        </section>
      )}

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
      {purge && <PurgeAccountModal key={purge.id} member={purge} year={year} onClose={() => setPurge(null)} />}

      {/* Oslava po výběru role — vyskočí na 3 s a zmizí. */}
      {celebrate && (
        <div className="pointer-events-none fixed inset-0 z-50 grid place-items-center px-4">
          <div className="marena-pop max-w-sm rounded-3xl bg-gradient-to-br from-marigold-500 to-plum-600 px-8 py-7 text-center text-white shadow-2xl ring-2 ring-white/30">
            <div className="text-5xl">🎉</div>
            <p className="mt-2 font-display text-xl font-bold">Mařena ti gratuluje, boží bojovníku!</p>
            <p className="mt-2 text-base">
              Tvoje role je <strong>{celebrate}</strong>.
            </p>
            <p className="mt-1 text-sm text-white/90">Hodně zdaru. 💪</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Tabulka „co vše navždy smazat" u jednoho účtu (jen pro správce).
function PurgeAccountModal({ member, year, onClose }: { member: Member; year: Year; onClose: () => void }) {
  const { dispatch } = useStore();
  const [posts, setPosts] = useState(true);
  const [votes, setVotes] = useState(true);
  const [shifts, setShifts] = useState(true);
  const [busy, setBusy] = useState(false);
  const name = member.name;

  const postCount = (year.posts ?? []).filter((p) => sameName(p.author, name)).length;
  const voteCount = (year.polls ?? []).reduce(
    (s, poll) => s + poll.options.reduce((a, o) => a + o.voters.filter((v) => sameName(v, name)).length, 0),
    0,
  );
  const shiftCount = (year.shifts ?? []).filter(
    (s) => s.people.some((n) => sameName(n, name)) || (s.backup ?? []).some((n) => sameName(n, name)),
  ).length;

  async function go() {
    setBusy(true);
    await dispatch({ type: "purgeMember", yearId: year.id, memberId: member.id, name, opts: { posts, votes, shifts } });
    onClose();
  }

  const rows: { checked: boolean; onToggle: () => void; label: string; count: number }[] = [
    { checked: posts, onToggle: () => setPosts((v) => !v), label: "Příspěvky na nástěnce", count: postCount },
    { checked: votes, onToggle: () => setVotes((v) => !v), label: "Hlasy v anketách", count: voteCount },
    { checked: shifts, onToggle: () => setShifts((v) => !v), label: "Přihlášení na směny", count: shiftCount },
  ];

  return (
    <Modal open onClose={onClose} title={`Smazat účet — ${name}`}>
      <p className="mb-3 text-sm text-ink-soft">
        Vyber, co se má u tohoto člověka <strong>navždy</strong> smazat. Účet (jméno, kontakt, role) se smaže vždy.
      </p>
      <div className="space-y-2">
        <div className="flex items-center gap-3 rounded-xl bg-red-50 px-3 py-2.5 text-sm">
          <Icon name="users" className="h-4 w-4 text-red-600" />
          <span className="flex-1 font-medium">Účet — jméno, kontakt, role</span>
          <span className="shrink-0 text-xs font-medium text-red-600">smaže se vždy</span>
        </div>
        {rows.map((r) => (
          <label
            key={r.label}
            className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm ${r.count === 0 ? "border-black/[0.06] opacity-50" : "border-black/10"}`}
          >
            <input
              type="checkbox"
              checked={r.checked && r.count > 0}
              onChange={r.onToggle}
              disabled={r.count === 0}
              className="h-4 w-4 accent-red-600"
            />
            <span className="min-w-0 flex-1 break-words">{r.label}</span>
            <span className="shrink-0 text-xs text-ink-soft">{r.count}×</span>
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
                    on ? "bg-marigold-600 text-white" : "bg-paper2 text-ink-soft hover:bg-black/5"
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
                  asLead ? "bg-leaf text-white" : "bg-paper2 text-ink-soft hover:bg-black/5"
                }`}
              >
                👑 Vedoucí
              </button>
              <button
                type="button"
                onClick={() => setAsLead(false)}
                className={`flex-1 rounded-xl px-3 py-2 text-sm font-medium transition ${
                  !asLead ? "bg-marigold-600 text-white" : "bg-paper2 text-ink-soft hover:bg-black/5"
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
