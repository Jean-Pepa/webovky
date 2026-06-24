"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { ROLES, roleById } from "@/lib/roles";
import { DeleteButton } from "@/components/DeleteButton";

export default function TymPage() {
  const { currentYear, me, dispatch } = useStore();
  const [openRole, setOpenRole] = useState<string | null>(null);
  const year = currentYear;
  if (!year) return null;

  const myMember = year.members.find((m) => m.name === me);

  async function toggleRoleForMe(roleId: string) {
    if (!year) return;
    if (myMember) {
      const has = myMember.roleIds.includes(roleId);
      const roleIds = has ? myMember.roleIds.filter((r) => r !== roleId) : [...myMember.roleIds, roleId];
      await dispatch({ type: "updateMember", yearId: year.id, memberId: myMember.id, patch: { roleIds } });
    } else {
      await dispatch({ type: "addMember", yearId: year.id, name: me, roleIds: [roleId] });
    }
  }

  const takenBy = (roleId: string) => year.members.filter((m) => m.roleIds.includes(roleId));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold">Tým &amp; role — {year.label}</h1>
        <p className="text-sm text-ink-soft">
          Vyber si svůj post (klidně víc). Posty a co obnášejí jsou vybrané podle manuálu.
        </p>
      </div>

      {/* Já v týmu */}
      <section className="card p-5">
        <h2 className="mb-3 font-display text-lg font-semibold">Já v týmu</h2>
        {myMember ? (
          <MyMember />
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-sm text-ink-soft">Ještě nejsi v týmu. Přidej se a vyber roli níže.</p>
            <button className="btn-primary" onClick={() => dispatch({ type: "addMember", yearId: year.id, name: me, roleIds: [] })}>
              Přidat se jako {me}
            </button>
          </div>
        )}
      </section>

      {/* Posty / role */}
      <section className="space-y-3">
        <h2 className="font-display text-lg font-semibold">Posty a co obnášejí</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {ROLES.map((r) => {
            const people = takenBy(r.id);
            const mine = myMember?.roleIds.includes(r.id);
            const open = openRole === r.id;
            return (
              <div key={r.id} className={`card p-4 ${mine ? "ring-1 ring-marigold-300" : ""}`}>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{r.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-base font-semibold">{r.name}</h3>
                    <p className="text-sm text-ink-soft">{r.short}</p>
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  {people.length === 0 ? (
                    <span className="text-xs text-ink-soft">Zatím nikdo</span>
                  ) : (
                    people.map((p) => (
                      <span key={p.id} className="chip">
                        {p.name}
                      </span>
                    ))
                  )}
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <button className={mine ? "btn-secondary" : "btn-primary"} onClick={() => toggleRoleForMe(r.id)}>
                    {mine ? "Odebrat ze mě" : "Vzít si"}
                  </button>
                  <button className="btn-ghost" onClick={() => setOpenRole(open ? null : r.id)}>
                    {open ? "Skrýt úkoly" : "Co to obnáší"}
                  </button>
                </div>
                {open && (
                  <ul className="mt-3 space-y-1.5 border-t border-ink/10 pt-3 text-sm text-ink-soft">
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
          })}
        </div>
      </section>

      {/* Celý roster */}
      <section className="card p-5">
        <h2 className="mb-3 font-display text-lg font-semibold">Celý tým ({year.members.length})</h2>
        {year.members.length === 0 ? (
          <p className="text-sm text-ink-soft">Zatím nikdo. Buď první!</p>
        ) : (
          <ul className="divide-y divide-ink/10">
            {year.members.map((m) => (
              <li key={m.id} className="flex flex-wrap items-center gap-3 py-3">
                <span className="font-semibold">{m.name}</span>
                {m.name === me && <span className="chip bg-marigold-100 text-marigold-800">to jsi ty</span>}
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
                {m.contact && <span className="text-xs text-ink-soft">· {m.contact}</span>}
                <span className="ml-auto">
                  <DeleteButton label="Odebrat" onConfirm={() => dispatch({ type: "removeMember", yearId: year.id, memberId: m.id })} />
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

// Detail mojí karty s editací kontaktu/poznámky.
function MyMember() {
  const { currentYear, me, dispatch } = useStore();
  const year = currentYear!;
  const m = year.members.find((x) => x.name === me)!;
  const [edit, setEdit] = useState(false);
  const [contact, setContact] = useState(m.contact ?? "");
  const [note, setNote] = useState(m.note ?? "");

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-semibold">{m.name}</span>
        {m.roleIds.length === 0 ? (
          <span className="text-sm text-ink-soft">— zatím bez role, vyber si níže</span>
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
        <button className="btn-ghost ml-auto" onClick={() => setEdit((v) => !v)}>
          {edit ? "Zavřít" : "Upravit kontakt"}
        </button>
      </div>
      {m.contact && !edit && <p className="mt-1 text-sm text-ink-soft">📞 {m.contact}</p>}
      {m.note && !edit && <p className="text-sm text-ink-soft">📝 {m.note}</p>}
      {edit && (
        <div className="mt-3 space-y-2">
          <input className="input" placeholder="Kontakt (instagram / telefon / e-mail)" value={contact} onChange={(e) => setContact(e.target.value)} />
          <input className="input" placeholder="Poznámka (např. co můžu vzít, kdy mám čas)" value={note} onChange={(e) => setNote(e.target.value)} />
          <button
            className="btn-primary"
            onClick={async () => {
              await dispatch({ type: "updateMember", yearId: year.id, memberId: m.id, patch: { contact, note } });
              setEdit(false);
            }}
          >
            Uložit
          </button>
        </div>
      )}
    </div>
  );
}
