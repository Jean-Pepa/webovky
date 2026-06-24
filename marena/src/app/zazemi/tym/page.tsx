"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { ROLES, roleById, type Role } from "@/lib/roles";
import { DeleteButton } from "@/components/DeleteButton";
import { Modal } from "@/components/Modal";
import { Icon } from "@/components/Icons";
import { isAdmin } from "@/lib/admin";
import type { Member } from "@/lib/types";

export default function TymPage() {
  const { currentYear, me, setMe, dispatch, canEditCurrentYear } = useStore();
  const [openRole, setOpenRole] = useState<string | null>(null);
  // Profilový modal: buď "vezmi si roli X" (roleToAdd), nebo jen úprava profilu.
  const [modal, setModal] = useState<{ roleToAdd?: string } | null>(null);
  // Správce (Pan_Vyskočil) může upravit libovolného člena.
  const [editMember, setEditMember] = useState<Member | null>(null);

  const current = currentYear;
  if (!current) return null;
  const year = current; // typ Year (zachová zúžení i ve vnořených funkcích)
  const editable = canEditCurrentYear; // starší (zamčený) ročník = jen ke čtení
  const admin = isAdmin(me);

  const myMember = year.members.find((m) => m.name === me);
  const mineRoles = ROLES.filter((r) => myMember?.roleIds.includes(r.id));
  const otherRoles = ROLES.filter((r) => !myMember?.roleIds.includes(r.id));

  const takenBy = (roleId: string) => year.members.filter((m) => m.roleIds.includes(roleId));

  // Odebrání role je přímé; přidání projde modálem na doplnění kontaktu.
  async function removeRoleFromMe(roleId: string) {
    if (!myMember) return;
    await dispatch({
      type: "updateMember",
      yearId: year.id,
      memberId: myMember.id,
      patch: { roleIds: myMember.roleIds.filter((r) => r !== roleId) },
    });
  }

  async function saveProfile(data: { name: string; email: string; phone: string; roleToAdd?: string }) {
    const finalName = data.name.trim() || me;
    const existing = year.members.find((m) => m.name === me);
    if (existing) {
      const roleIds =
        data.roleToAdd && !existing.roleIds.includes(data.roleToAdd) ? [...existing.roleIds, data.roleToAdd] : existing.roleIds;
      await dispatch({
        type: "updateMember",
        yearId: year.id,
        memberId: existing.id,
        patch: { name: finalName, email: data.email, phone: data.phone, roleIds },
      });
    } else {
      await dispatch({
        type: "addMember",
        yearId: year.id,
        name: finalName,
        roleIds: data.roleToAdd ? [data.roleToAdd] : [],
        email: data.email,
        phone: data.phone,
      });
    }
    if (finalName !== me) setMe(finalName);
    setModal(null);
  }

  function RoleCard({ r }: { r: Role }) {
    const people = takenBy(r.id);
    const taken = people.length > 0;
    const mine = myMember?.roleIds.includes(r.id) ?? false;
    const open = openRole === r.id;
    return (
      <div className={`card p-4 transition ${taken ? "role-taken bg-marigold-50/50" : ""}`}>
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

        {/* Kdo funkci drží + kontakt (jméno, telefon, e-mail) */}
        <div className="mt-3">
          {!taken ? (
            <p className="text-xs text-ink-soft/70">Zatím nikdo — můžeš si ji vzít.</p>
          ) : (
            <ul className="space-y-2">
              {people.map((p) => (
                <li key={p.id} className="rounded-xl bg-white/80 p-2.5 ring-1 ring-black/[0.05]">
                  <p className="flex flex-wrap items-center gap-1.5 text-sm font-semibold">
                    <span>👤 {p.name}</span>
                    {p.name === me && <span className="chip bg-marigold-600 text-white">to jsi ty</span>}
                  </p>
                  {(p.phone || p.email) ? (
                    <p className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-ink-soft">
                      {p.phone && (
                        <a href={`tel:${p.phone}`} className="hover:text-marigold-700">
                          📞 {p.phone}
                        </a>
                      )}
                      {p.email && (
                        <a href={`mailto:${p.email}`} className="hover:text-marigold-700">
                          ✉️ {p.email}
                        </a>
                      )}
                    </p>
                  ) : (
                    <p className="mt-1 text-xs text-ink-soft/70">Bez kontaktu — doplň v profilu.</p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-3 flex items-center gap-2">
          {editable &&
            (mine ? (
              <button className="btn-secondary" onClick={() => removeRoleFromMe(r.id)}>
                Uvolnit funkci
              </button>
            ) : (
              <button
                className={taken ? "btn-secondary" : "btn-primary"}
                onClick={() => setModal({ roleToAdd: r.id })}
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
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Tým &amp; role — {year.label}</h1>
          <p className="text-sm text-ink-soft">Vyber si svůj post (klidně víc). Posty a co obnášejí jsou vybrané podle manuálu.</p>
        </div>
        <div className="flex items-center gap-3 rounded-2xl bg-marigold-600 px-5 py-3 text-white shadow-sm">
          <Icon name="users" className="h-8 w-8 shrink-0" />
          <div className="leading-none">
            <div className="font-display text-4xl font-bold tracking-tight">{year.members.length}</div>
            <div className="mt-1 text-xs font-medium uppercase tracking-wide text-white/85">zapsáno v týmu</div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Vlevo: můj profil + funkce */}
        <div className="space-y-8">
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
              <div className="mt-3">
                <p className="font-semibold">{myMember.name}</p>
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
                  <p className="mt-2 text-sm text-ink-soft">
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

        {/* Vpravo: seznam všech přihlášených + jejich role */}
        <aside className="h-fit lg:sticky lg:top-4">
          <section className="card p-4">
            <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-semibold">
              <Icon name="users" className="h-5 w-5 text-marigold-600" /> Přihlášení ({year.members.length})
            </h2>
            {year.members.length === 0 ? (
              <p className="text-sm text-ink-soft">Zatím nikdo. Buď první!</p>
            ) : (
              <ul className="space-y-2.5">
                {year.members.map((m) => (
                  <li key={m.id} className="rounded-xl border border-black/[0.06] bg-white p-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="flex flex-wrap items-center gap-1.5 font-semibold">
                          {m.name}
                          {m.name === me && <span className="chip bg-marigold-600 text-white">ty</span>}
                        </p>
                        {(m.email || m.phone) && (
                          <p className="mt-0.5 break-words text-xs text-ink-soft">{[m.phone, m.email].filter(Boolean).join(" · ")}</p>
                        )}
                      </div>
                      {admin && (
                        <div className="flex shrink-0 items-center gap-1">
                          <button className="btn-ghost px-2 py-1 text-xs" onClick={() => setEditMember(m)} title="Upravit člena">
                            Upravit
                          </button>
                          <DeleteButton onConfirm={() => dispatch({ type: "removeMember", yearId: year.id, memberId: m.id })} />
                        </div>
                      )}
                    </div>
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {m.roleIds.length === 0 ? (
                        <span className="text-xs text-ink-soft/60">bez role</span>
                      ) : (
                        m.roleIds.map((id) => {
                          const role = roleById(id);
                          return role ? (
                            <span key={id} className="chip">
                              {role.emoji} {role.name}
                            </span>
                          ) : null;
                        })
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {!admin && (
              <p className="mt-3 text-[11px] text-ink-soft/60">Upravovat a mazat lidi v seznamu může jen správce.</p>
            )}
          </section>
        </aside>
      </div>

      <ProfileModal
        open={modal !== null}
        roleToAdd={modal?.roleToAdd}
        initial={{ name: myMember?.name ?? me, email: myMember?.email ?? "", phone: myMember?.phone ?? "" }}
        onClose={() => setModal(null)}
        onSave={saveProfile}
      />

      {editMember && <AdminEditMemberModal member={editMember} yearId={year.id} onClose={() => setEditMember(null)} />}
    </div>
  );
}

// Správce (Pan_Vyskočil) může upravit jméno, kontakt i funkce libovolného člena.
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
  initial,
  onClose,
  onSave,
}: {
  open: boolean;
  roleToAdd?: string;
  initial: { name: string; email: string; phone: string };
  onClose: () => void;
  onSave: (d: { name: string; email: string; phone: string; roleToAdd?: string }) => void;
}) {
  const role = roleById(roleToAdd);
  return (
    <Modal open={open} onClose={onClose} title={role ? `Bereš si roli: ${role.emoji} ${role.name}` : "Můj profil"}>
      <ProfileForm key={`${open}-${roleToAdd ?? "profile"}`} initial={initial} roleToAdd={roleToAdd} onSave={onSave} onClose={onClose} />
    </Modal>
  );
}

function ProfileForm({
  initial,
  roleToAdd,
  onSave,
  onClose,
}: {
  initial: { name: string; email: string; phone: string };
  roleToAdd?: string;
  onSave: (d: { name: string; email: string; phone: string; roleToAdd?: string }) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(initial.name);
  const [email, setEmail] = useState(initial.email);
  const [phone, setPhone] = useState(initial.phone);

  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        if (!name.trim()) return;
        onSave({ name, email, phone, roleToAdd });
      }}
    >
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
