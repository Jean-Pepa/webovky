"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { ROLES, roleById } from "@/lib/roles";
import { fmtRelative, fmtDayShort, todayISO, fmtCZK } from "@/lib/format";
import { KINDS } from "@/lib/kinds";
import { DeleteButton } from "@/components/DeleteButton";
import { Onboarding } from "@/components/Onboarding";
import { Icon } from "@/components/Icons";

export default function NastenkaPage() {
  const { currentYear, me, dispatch } = useStore();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [roleId, setRoleId] = useState("");
  const [pinned, setPinned] = useState(false);
  const [open, setOpen] = useState(false);

  const year = currentYear;

  const posts = useMemo(() => {
    if (!year) return [];
    return [...year.posts].sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return b.createdAt.localeCompare(a.createdAt);
    });
  }, [year]);

  const upcoming = useMemo(() => {
    if (!year) return [];
    const t = todayISO();
    return [...year.events].filter((e) => e.date >= t).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 5);
  }, [year]);

  const openPolls = year?.polls.filter((p) => !p.closed).length ?? 0;
  const myTasks = year?.tasks.filter((t) => !t.done && (t.assignee === me || !t.assignee)).length ?? 0;
  const myShifts = (year?.shifts ?? []).filter((s) => s.people.includes(me)).length;

  const bilance = (year?.finances ?? []).reduce((s, f) => s + (f.kind === "prijem" ? f.amount : -f.amount), 0);
  const hasFinance = (year?.finances ?? []).length > 0;

  if (!year) return null;

  async function submit() {
    if (!title.trim() || !year) return;
    await dispatch({ type: "addPost", yearId: year.id, author: me, roleId: roleId || undefined, title, body, pinned });
    setTitle("");
    setBody("");
    setRoleId("");
    setPinned(false);
    setOpen(false);
  }

  return (
    <div className="space-y-6">
      <Onboarding />
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-5">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-semibold">Nástěnka — {year.label}</h1>
            <p className="text-sm text-ink-soft">
              {year.theme ? `Téma: ${year.theme}` : "Důležité info od ostatních na jednom místě."}
            </p>
          </div>
          <button className="btn-primary" onClick={() => setOpen((v) => !v)}>
            {open ? "Zavřít" : "+ Přidat info"}
          </button>
        </div>

        {open && (
          <div className="card space-y-3 p-4">
            <input className="input" placeholder="Nadpis (např. Fléda potvrzena na 4.10.)" value={title} onChange={(e) => setTitle(e.target.value)} />
            <textarea className="input min-h-24" placeholder="Co potřebují ostatní vědět?" value={body} onChange={(e) => setBody(e.target.value)} />
            <div className="flex flex-wrap items-center gap-3">
              <select className="input max-w-56" value={roleId} onChange={(e) => setRoleId(e.target.value)}>
                <option value="">Za jakou roli? (nepovinné)</option>
                {ROLES.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.emoji} {r.name}
                  </option>
                ))}
              </select>
              <label className="flex items-center gap-2 text-sm text-ink-soft">
                <input type="checkbox" checked={pinned} onChange={(e) => setPinned(e.target.checked)} />
                Připnout nahoru
              </label>
              <button className="btn-primary ml-auto" onClick={submit}>
                Zveřejnit
              </button>
            </div>
          </div>
        )}

        {posts.length === 0 ? (
          <Empty>Zatím tu nic není. Buď první a napiš ostatním důležité info.</Empty>
        ) : (
          <div className="space-y-3">
            {posts.map((p) => {
              const role = roleById(p.roleId);
              return (
                <article key={p.id} className={`card p-4 ${p.pinned ? "ring-1 ring-marigold-300" : ""}`}>
                  <div className="mb-1 flex items-center gap-2 text-xs text-ink-soft">
                    {p.pinned && <span className="chip bg-marigold-600 text-white">📌 Připnuto</span>}
                    {role && (
                      <span className="chip">
                        {role.emoji} {role.name}
                      </span>
                    )}
                    <span className="ml-auto">
                      {p.author} · {fmtRelative(p.createdAt)}
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-semibold">{p.title}</h3>
                  {p.body && <p className="mt-1 whitespace-pre-wrap text-sm text-ink-soft">{p.body}</p>}
                  <div className="mt-2 flex items-center gap-2">
                    <button className="btn-ghost px-2 py-1 text-xs" onClick={() => dispatch({ type: "togglePin", yearId: year.id, postId: p.id })}>
                      {p.pinned ? "Odepnout" : "Připnout"}
                    </button>
                    <DeleteButton onConfirm={() => dispatch({ type: "removePost", yearId: year.id, postId: p.id })} />
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      <aside className="space-y-4">
        <WidgetLinks openPolls={openPolls} myTasks={myTasks} myShifts={myShifts} />
        {hasFinance && (
          <Link href="/zazemi/finance" className="card block p-4 transition hover:border-black/10">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-base font-semibold">💰 Bilance</h2>
              <span className="text-xs font-medium text-marigold-700">detail →</span>
            </div>
            <p className={`mt-1 font-display text-2xl font-semibold tracking-tight ${bilance >= 0 ? "text-leaf-700" : "text-red-600"}`}>
              {bilance >= 0 ? "+" : "−"}
              {fmtCZK(Math.abs(bilance))}
            </p>
            <p className="text-xs text-ink-soft">příjmy minus výdaje</p>
          </Link>
        )}
        <div className="card p-4">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="font-display text-base font-semibold">📅 Nejbližší termíny</h2>
            <Link href="/zazemi/kalendar" className="text-xs font-medium text-marigold-700 hover:underline">
              vše →
            </Link>
          </div>
          {upcoming.length === 0 ? (
            <p className="text-sm text-ink-soft">Žádné nadcházející termíny.</p>
          ) : (
            <ul className="space-y-2">
              {upcoming.map((e) => {
                const d = fmtDayShort(e.date);
                const k = KINDS[e.kind];
                return (
                  <li key={e.id} className="flex items-center gap-3">
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-paper2 text-center leading-none">
                      <span className="text-sm font-bold">{d.day}</span>
                      <span className="text-[10px] uppercase text-ink-soft">{d.month}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{e.title}</p>
                      <span className={`chip ${k.chip}`}>
                        {k.emoji} {k.label}
                        {e.time ? ` · ${e.time}` : ""}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="card p-4">
          <h2 className="mb-2 font-display text-base font-semibold">🧑‍🤝‍🧑 Tým</h2>
          {year.members.length === 0 ? (
            <p className="text-sm text-ink-soft">
              Zatím nikdo. <Link href="/zazemi/tym" className="text-marigold-700 hover:underline">Přidej se a vyber roli →</Link>
            </p>
          ) : (
            <ul className="space-y-1.5 text-sm">
              {year.members.slice(0, 8).map((m) => (
                <li key={m.id} className="flex items-center justify-between gap-2">
                  <span className="font-medium">{m.name}</span>
                  <span className="truncate text-xs text-ink-soft">
                    {m.roleIds.map((id) => roleById(id)?.emoji).join(" ") || "—"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
      </div>
    </div>
  );
}

function WidgetLinks({ openPolls, myTasks, myShifts }: { openPolls: number; myTasks: number; myShifts: number }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <Link href="/zazemi/hlasovani" className="card p-3 transition hover:border-marigold-300">
        <Icon name="vote" className="h-4 w-4 text-marigold-600" />
        <div className="mt-1 text-2xl font-bold text-marigold-700">{openPolls}</div>
        <div className="text-xs text-ink-soft">anket</div>
      </Link>
      <Link href="/zazemi/ukoly" className="card p-3 transition hover:border-marigold-300">
        <Icon name="tasks" className="h-4 w-4 text-plum-600" />
        <div className="mt-1 text-2xl font-bold text-plum-600">{myTasks}</div>
        <div className="text-xs text-ink-soft">úkolů</div>
      </Link>
      <Link href="/zazemi/provoz" className="card p-3 transition hover:border-marigold-300">
        <Icon name="ops" className="h-4 w-4 text-marigold-600" />
        <div className="mt-1 text-2xl font-bold text-marigold-700">{myShifts}</div>
        <div className="text-xs text-ink-soft">směn</div>
      </Link>
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <div className="card grid place-items-center p-10 text-center text-sm text-ink-soft">{children}</div>;
}
