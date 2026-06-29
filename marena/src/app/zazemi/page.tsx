"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { ROLES, roleById } from "@/lib/roles";
import { fmtDateTime, fmtDayShort, todayISO, fmtCZK } from "@/lib/format";
import { KINDS } from "@/lib/kinds";
import { DeleteButton } from "@/components/DeleteButton";
import { Onboarding } from "@/components/Onboarding";
import { Icon } from "@/components/Icons";
import { SearchBox } from "@/components/SearchBox";
import { matchesQuery } from "@/lib/search";
import { isAdmin } from "@/lib/admin";
import type { Post } from "@/lib/types";

export default function NastenkaPage() {
  const { currentYear, me, dispatch } = useStore();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [roleId, setRoleId] = useState("");
  const [pinned, setPinned] = useState(false);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  const year = currentYear;

  const posts = useMemo(() => {
    if (!year) return [];
    return [...year.posts].sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return b.createdAt.localeCompare(a.createdAt);
    });
  }, [year]);

  const filteredPosts = useMemo(
    () => posts.filter((p) => matchesQuery(q, p.title, p.body, p.author)),
    [posts, q]
  );

  const upcoming = useMemo(() => {
    if (!year) return [];
    const t = todayISO();
    return [...year.events].filter((e) => e.date >= t).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 5);
  }, [year]);

  const openPolls = year?.polls.filter((p) => !p.closed).length ?? 0;
  const myTasks = year?.tasks.filter((t) => !t.done && (t.assignee === me || !t.assignee)).length ?? 0;
  const myShifts = (year?.shifts ?? []).filter((s) => s.people.includes(me)).length;

  const contribInPool = (year?.contributions ?? []).filter((c) => !c.returned).reduce((s, c) => s + c.amount, 0);
  const bilance = (year?.finances ?? []).reduce((s, f) => s + (f.kind === "prijem" ? f.amount : -f.amount), 0) + contribInPool;
  const hasFinance = (year?.finances ?? []).length > 0 || (year?.contributions ?? []).length > 0;

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
      <div className="min-w-0 space-y-5">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-semibold">Nástěnka</h1>
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

        {posts.length > 0 && (
          <SearchBox value={q} onChange={setQ} placeholder="Hledat v nástěnce…" />
        )}

        {posts.length === 0 ? (
          <Empty>Zatím tu nic není. Buď první a napiš ostatním důležité info.</Empty>
        ) : filteredPosts.length === 0 ? (
          <p className="text-sm text-ink-soft">Nic neodpovídá hledání.</p>
        ) : (
          <div className="space-y-3">
            {filteredPosts.map((p) => (
              <PostCard key={p.id} post={p} yearId={year.id} />
            ))}
          </div>
        )}
      </div>

      <aside className="min-w-0 space-y-4">
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

// Tělo příspěvku: ukáže ~3 řádky, zbytek schová do rolovačky se šipkou na rozbalení.
function PostBody({ body }: { body: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [overflow, setOverflow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || expanded) return;
    setOverflow(el.scrollHeight > el.clientHeight + 2);
  }, [body, expanded]);

  return (
    <div className="mt-1">
      <p
        ref={ref}
        className={`whitespace-pre-wrap break-words text-sm leading-5 text-ink-soft ${
          expanded ? "" : "max-h-[3.75rem] overflow-y-auto overscroll-contain pr-1"
        }`}
      >
        {body}
      </p>
      {(overflow || expanded) && (
        <button
          className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-marigold-700 hover:underline"
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? "Sbalit" : "Zobrazit celé"}
          <Icon name="chevron" className={`h-3.5 w-3.5 transition-transform ${expanded ? "rotate-180" : ""}`} />
        </button>
      )}
    </div>
  );
}

function PostCard({ post: p, yearId }: { post: Post; yearId: string }) {
  const { me, dispatch } = useStore();
  const [edit, setEdit] = useState(false);
  const [showEdits, setShowEdits] = useState(false);
  const [title, setTitle] = useState(p.title);
  const [body, setBody] = useState(p.body);
  const [roleId, setRoleId] = useState(p.roleId ?? "");
  // Historie úprav (nová), s fallbackem na stará data (jen poslední úprava).
  const edits = p.edits ?? (p.editedBy && p.editedAt ? [{ by: p.editedBy, at: p.editedAt }] : []);
  const canEdit = true; // úpravu nástěnky smí každý (kdo má přístup do zázemí)
  const canDelete = isAdmin(me); // mazat smí jen správce (Mařena)
  const role = roleById(p.roleId);

  function startEdit() {
    setTitle(p.title);
    setBody(p.body);
    setRoleId(p.roleId ?? "");
    setEdit(true);
  }
  async function save() {
    if (!title.trim()) return;
    await dispatch({ type: "updatePost", yearId, postId: p.id, editedBy: me, patch: { title, body, roleId: roleId || null } });
    setEdit(false);
  }

  if (edit) {
    return (
      <article className="card space-y-3 p-4 ring-2 ring-marigold-200">
        <input className="input" placeholder="Nadpis" value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
        <textarea className="input min-h-24" placeholder="Co potřebují ostatní vědět?" value={body} onChange={(e) => setBody(e.target.value)} />
        <select className="input max-w-56" value={roleId} onChange={(e) => setRoleId(e.target.value)}>
          <option value="">Za jakou roli? (nepovinné)</option>
          {ROLES.map((r) => (
            <option key={r.id} value={r.id}>
              {r.emoji} {r.name}
            </option>
          ))}
        </select>
        <div className="flex gap-2">
          <button className="btn-primary py-2 text-sm" onClick={save} disabled={!title.trim()}>
            Uložit
          </button>
          <button className="btn-ghost py-2 text-sm" onClick={() => setEdit(false)}>
            Zrušit
          </button>
        </div>
      </article>
    );
  }

  return (
    <article className={`card p-4 ${p.pinned ? "ring-1 ring-marigold-300" : ""}`}>
      <div className="mb-1 flex flex-wrap items-start gap-x-2 gap-y-1 text-xs text-ink-soft">
        {p.pinned && <span className="chip bg-marigold-600 text-white">📌 Připnuto</span>}
        {role && (
          <span className="chip">
            {role.emoji} {role.name}
          </span>
        )}
        <div className="ml-auto max-w-[70%] text-right leading-tight">
          <div>
            založil(a): <span className="font-medium text-ink">{p.author}</span> · {fmtDateTime(p.createdAt)}
          </div>
          {edits.length > 0 && (
            <div>
              upravil(a): <span className="font-medium text-ink">{edits[0].by}</span> · {fmtDateTime(edits[0].at)}
            </div>
          )}
          {edits.length > 1 &&
            (showEdits ? (
              <>
                <div className="mt-1 max-h-24 space-y-0.5 overflow-y-auto rounded-lg bg-paper2/70 px-2 py-1.5 text-left">
                  {edits.slice(1).map((e, i) => (
                    <div key={i}>
                      upravil(a): <span className="font-medium text-ink">{e.by}</span> · {fmtDateTime(e.at)}
                    </div>
                  ))}
                </div>
                <button onClick={() => setShowEdits(false)} className="font-medium text-marigold-700 hover:underline">
                  zobrazit méně
                </button>
              </>
            ) : (
              <button onClick={() => setShowEdits(true)} className="font-medium text-marigold-700 hover:underline">
                zobrazit více ({edits.length - 1})
              </button>
            ))}
        </div>
      </div>
      <h3 className="break-words font-display text-lg font-semibold">{p.title}</h3>
      {p.body && <PostBody body={p.body} />}
      <div className="mt-2 flex items-center gap-2">
        <button className="btn-ghost px-2 py-1 text-xs" onClick={() => dispatch({ type: "togglePin", yearId, postId: p.id })}>
          {p.pinned ? "Odepnout" : "Připnout"}
        </button>
        {canEdit && (
          <button className="btn-ghost px-2 py-1 text-xs" onClick={startEdit}>
            Upravit
          </button>
        )}
        {canDelete && <DeleteButton onConfirm={() => dispatch({ type: "removePost", yearId, postId: p.id })} />}
      </div>
    </article>
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
