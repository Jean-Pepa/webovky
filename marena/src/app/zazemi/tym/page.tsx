"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { ROLES, roleById, type Role } from "@/lib/roles";
import { DeleteButton } from "@/components/DeleteButton";
import { Modal } from "@/components/Modal";

export default function TymPage() {
  const { currentYear, me, setMe, dispatch } = useStore();
  const [openRole, setOpenRole] = useState<string | null>(null);
  // Profilový modal: buď "vezmi si roli X" (roleToAdd), nebo jen úprava profilu.
  const [modal, setModal] = useState<{ roleToAdd?: string } | null>(null);

  const current = currentYear;
  if (!current) return null;
  const year = current; // typ Year (zachová zúžení i ve vnořených funkcích)

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
                <span className="inline-flex items-center gap-1 rounded-full bg-marigold-600 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white">
                  <span className="h-1.5 w-1.5 rounded-full bg-white" /> Obsazeno
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-leaf/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-leaf-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-leaf" /> Volné
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
          {mine ? (
            <button className="btn-secondary" onClick={() => removeRoleFromMe(r.id)}>
              Uvolnit funkci
            </button>
          ) : taken ? (
            <button className="btn-secondary cursor-not-allowed opacity-60" disabled title="Funkce je obsazená — uvolní ji jen ten, kdo ji drží.">
              Obsazeno
            </button>
          ) : (
            <button className="btn-primary" onClick={() => setModal({ roleToAdd: r.id })}>
              Vzít si
            </button>
          )}
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
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Tým &amp; role — {year.label}</h1>
        <p className="text-sm text-ink-soft">Vyber si svůj post (klidně víc). Posty a co obnášejí jsou vybrané podle manuálu.</p>
      </div>

      {/* Já v týmu */}
      <section className="card p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-lg font-semibold">Já v týmu</h2>
          <button className="btn-secondary" onClick={() => setModal({})}>
            {myMember ? "Upravit profil" : "Vyplnit profil"}
          </button>
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

      {/* Celý roster */}
      <section className="card p-5">
        <h2 className="mb-3 font-display text-lg font-semibold">Celý tým ({year.members.length})</h2>
        {year.members.length === 0 ? (
          <p className="text-sm text-ink-soft">Zatím nikdo. Buď první!</p>
        ) : (
          <ul className="divide-y divide-black/[0.06]">
            {year.members.map((m) => (
              <li key={m.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 py-3">
                <span className="font-semibold">{m.name}</span>
                {m.name === me && <span className="chip bg-marigold-600 text-white">to jsi ty</span>}
                <span className="flex flex-wrap gap-1">
                  {m.roleIds.map((id) => {
                    const role = roleById(id);
                    return role ? (
                      <span key={id} className="chip">
                        {role.emoji} {role.name}
                      </span>
                    ) : null;
                  })}
                </span>
                {(m.email || m.phone || m.contact) && (
                  <span className="text-xs text-ink-soft">
                    {[m.email, m.phone, m.contact].filter(Boolean).join(" · ")}
                  </span>
                )}
                <span className="ml-auto">
                  <DeleteButton label="Odebrat" onConfirm={() => dispatch({ type: "removeMember", yearId: year.id, memberId: m.id })} />
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <ProfileModal
        open={modal !== null}
        roleToAdd={modal?.roleToAdd}
        initial={{ name: myMember?.name ?? me, email: myMember?.email ?? "", phone: myMember?.phone ?? "" }}
        onClose={() => setModal(null)}
        onSave={saveProfile}
      />
    </div>
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
