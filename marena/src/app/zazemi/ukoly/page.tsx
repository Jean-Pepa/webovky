"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { ROLES, roleById } from "@/lib/roles";
import { fmtDate } from "@/lib/format";
import { DeleteButton } from "@/components/DeleteButton";
import { SearchBox } from "@/components/SearchBox";
import { Icon } from "@/components/Icons";
import { matchesQuery } from "@/lib/search";
import { isAdmin } from "@/lib/admin";
import { sameName } from "@/lib/names";
import { flash } from "@/components/Flash";

type Filter = "vse" | "nehotove" | "hotove";

export default function UkolyPage() {
  const { currentYear, me, dispatch } = useStore();
  const [filter, setFilter] = useState<Filter>("nehotove");
  const [q, setQ] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [allOpen, setAllOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [roleId, setRoleId] = useState("");
  const [assignee, setAssignee] = useState("");
  const [due, setDue] = useState("");

  const year = currentYear;

  // Moje role v tomto ročníku — úkoly těchto rolí beru jako „moje".
  const myRoleIds = useMemo(() => year?.members.find((m) => m.name === me)?.roleIds ?? [], [year, me]);

  // Moje = přiřazené mně jménem (i z nástěnky) nebo mojí roli.
  const isMine = (assignee?: string, roleId?: string) =>
    (!!assignee && sameName(assignee, me)) || (!!roleId && myRoleIds.includes(roleId));

  // Moje nesplněné úkoly — nahoře, jako první, co uživatele zajímá.
  const myOpen = useMemo(() => {
    if (!year) return [];
    return year.tasks
      .filter((t) => !t.done && isMine(t.assignee, t.roleId))
      .sort((a, b) => (a.due || "9999").localeCompare(b.due || "9999") || a.title.localeCompare(b.title, "cs"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, me, myRoleIds]);

  const tasks = useMemo(() => {
    if (!year) return [];
    return year.tasks.filter((t) => {
      const roleName = t.roleId ? roleById(t.roleId)?.name : undefined;
      if (!matchesQuery(q, t.title, t.assignee, roleName)) return false;
      if (filter === "nehotove") return !t.done;
      if (filter === "hotove") return t.done;
      return true;
    });
  }, [year, filter, q]);

  // Nejdřív jen prvních pár úkolů, zbytek se dorolová tlačítkem „Zobrazit více".
  const PEEK = 3;
  const shownTasks = useMemo(() => (allOpen ? tasks : tasks.slice(0, PEEK)), [tasks, allOpen]);

  // seskupení podle role (jen zobrazené úkoly)
  const grouped = useMemo(() => {
    const map = new Map<string, typeof tasks>();
    for (const t of shownTasks) {
      const key = t.roleId || "_none";
      const arr = map.get(key) || [];
      arr.push(t);
      map.set(key, arr);
    }
    return map;
  }, [shownTasks]);

  if (!year) return null;

  const total = year.tasks.length; // celkový počet — jen pro tlačítko „Smazat všechny"
  // Postup „Hotovo x/x" počítáme z úkolů přihlášené osoby (moje úkoly).
  const myAll = year.tasks.filter((t) => isMine(t.assignee, t.roleId));
  const myDone = myAll.filter((t) => t.done).length;
  const myTotal = myAll.length;
  const myPct = myTotal ? Math.round((myDone / myTotal) * 100) : 0;

  async function add() {
    if (!title.trim() || !year) return;
    await dispatch({ type: "addTask", yearId: year.id, title, roleId: roleId || undefined, assignee: assignee || undefined, due: due || undefined });
    setTitle("");
    setRoleId("");
    setAssignee("");
    setDue("");
    flash("Úkol přidán", "✅");
  }

  async function clearAll() {
    if (!year) return;
    if (!window.confirm(`Smazat všech ${year.tasks.length} úkolů? Nedá se to vrátit.`)) return;
    await dispatch({ type: "clearTasks", yearId: year.id });
    flash("Úkoly smazány", "🧹");
  }

  function onToggle(id: string, title: string, done: boolean) {
    if (!year) return;
    dispatch({ type: "toggleTask", yearId: year.id, taskId: id });
    if (!done) flash(`Splněno: ${title}${me ? ` — ${me}` : ""}`, "🎉");
  }
  function onDelete(id: string) {
    if (!year) return;
    dispatch({ type: "removeTask", yearId: year.id, taskId: id });
  }

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="font-display text-[28px] font-bold uppercase tracking-tight">Úkoly</h1>
        {isAdmin(me) && total > 0 && (
          <button className="btn-ghost px-3 py-1.5 text-xs text-red-600" onClick={clearAll}>
            Smazat všechny úkoly
          </button>
        )}
      </div>

      {/* ===== MOJE ÚKOLY — nahoře, hlavní věc pro uživatele ===== */}
      <section className="card overflow-hidden ring-1 ring-gold-300">
        <div className="flex items-center justify-between gap-2 bg-gold-50 px-4 py-3">
          <h2 className="font-display text-[19px] font-bold">🙋 Moje úkoly</h2>
          <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${myOpen.length ? "bg-red-100 text-red-700" : "bg-leaf/15 text-leaf-700"}`}>
            {myOpen.length ? `${myOpen.length} k splnění` : "vše hotovo ✅"}
          </span>
        </div>
        {/* Postup mých úkolů — Hotovo x/x pro mě */}
        {myTotal > 0 && (
          <div className="border-b border-ink/10 px-4 py-3">
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="font-medium">Hotovo {myDone} z {myTotal}</span>
              <span className="text-ink-soft">{myPct} %</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-paper2">
              <div className="h-full rounded-full bg-gold-500 transition-all" style={{ width: `${myPct}%` }} />
            </div>
          </div>
        )}
        {myOpen.length === 0 ? (
          <p className="px-4 py-6 text-center text-sm text-ink-soft">
            {myTotal > 0 ? "Všechno splněno. Paráda! 🎉" : "Nemáš žádný přiřazený úkol."}
          </p>
        ) : (
          <ul className="divide-y divide-ink/10">
            {myOpen.map((t) => (
              <TaskItem key={t.id} t={t} big onToggle={onToggle} onDelete={onDelete} />
            ))}
          </ul>
        )}
      </section>

      {/* přidat úkol — formulář se rozbalí až po kliknutí na tlačítko */}
      {!addOpen ? (
        <button className="btn-primary w-fit" onClick={() => setAddOpen(true)}>
          + Přidat úkol
        </button>
      ) : (
        <div className="card space-y-2 p-4">
          <input className="input" placeholder="Nový úkol (např. Obvolat aulu kvůli souběhu)" value={title} onChange={(e) => setTitle(e.target.value)} onKeyDown={(e) => e.key === "Enter" && add()} autoFocus />
          <div className="grid gap-2 sm:grid-cols-3">
            <select className="input" value={roleId} onChange={(e) => setRoleId(e.target.value)}>
              <option value="">Role (nepovinné)</option>
              {ROLES.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.emoji} {r.name}
                </option>
              ))}
            </select>
            <select className="input" value={assignee} onChange={(e) => setAssignee(e.target.value)}>
              <option value="">Kdo? (nepovinné)</option>
              <option value={me}>Já ({me})</option>
              {year.members.filter((m) => m.name !== me).map((m) => (
                <option key={m.id} value={m.name}>
                  {m.name}
                </option>
              ))}
            </select>
            <input type="date" className="input" value={due} onChange={(e) => setDue(e.target.value)} />
          </div>
          <div className="flex gap-2">
            <button className="btn-primary" onClick={add} disabled={!title.trim()}>
              Přidat úkol
            </button>
            <button className="btn-ghost" onClick={() => setAddOpen(false)}>
              Zavřít
            </button>
          </div>
        </div>
      )}

      {/* ===== VŠECHNY ÚKOLY (přehled celého týmu) — ukáže pár, zbytek se dorolová ===== */}
      <div className="space-y-3 pt-1">
        <h2 className="font-display text-[19px] font-bold">
          📋 Všechny úkoly <span className="text-sm font-normal text-ink-soft">({total})</span>
        </h2>

        <SearchBox value={q} onChange={setQ} placeholder="Hledat úkol…" />

        <div className="flex flex-wrap gap-2">
          {([
            ["nehotove", "Nehotové"],
            ["hotove", "Hotové"],
            ["vse", "Vše"],
          ] as [Filter, string][]).map(([f, label]) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                filter === f ? "bg-gold-500 text-[#1d1d1f]" : "bg-white text-ink-soft ring-1 ring-ink/10 hover:bg-paper2"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {tasks.length === 0 ? (
          <div className="card grid place-items-center p-10 text-center text-sm text-ink-soft">
            {q.trim() ? "Nic neodpovídá hledání." : "Nic tu není. 🎉"}
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {[...grouped.entries()].map(([key, items]) => {
                const role = key === "_none" ? null : roleById(key);
                return (
                  <div key={key} className="card overflow-hidden">
                    <div className="border-b border-ink/10 bg-paper2/60 px-4 py-2 text-sm font-semibold">
                      {role ? `${role.emoji} ${role.name}` : "📋 Bez role"}
                    </div>
                    <ul className="divide-y divide-ink/10">
                      {items.map((t) => (
                        <TaskItem key={t.id} t={t} onToggle={onToggle} onDelete={onDelete} />
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>

            {/* Rolovačka na další úkoly — ukázalo se prvních PEEK, zbytek se dorolová */}
            {tasks.length > PEEK && (
              <button
                type="button"
                onClick={() => setAllOpen((v) => !v)}
                aria-expanded={allOpen}
                className="mx-auto flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-medium text-gold-700 ring-1 ring-ink/10 transition hover:bg-paper2"
              >
                {allOpen ? "Zobrazit méně" : `Zobrazit další (${tasks.length - PEEK})`}
                <Icon name="chevron" className={`h-4 w-4 transition-transform ${allOpen ? "rotate-180" : ""}`} />
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Řádek úkolu s velkým, jasným zaškrtávátkem — ať je hned vidět, kde se
// odškrtává splnění. `big` = větší text/box pro sekci „Moje úkoly".
function TaskItem({
  t,
  big,
  onToggle,
  onDelete,
}: {
  t: { id: string; title: string; done: boolean; assignee?: string; due?: string; fromPostId?: string };
  big?: boolean;
  onToggle: (id: string, title: string, done: boolean) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <li className={`flex items-center gap-3 px-4 ${big ? "py-3.5" : "py-2.5"}`}>
      <button
        onClick={() => onToggle(t.id, t.title, t.done)}
        aria-label={t.done ? "Označit jako nesplněné" : "Označit jako splněné"}
        title={t.done ? "Hotovo — klikni pro vrácení" : "Klikni, když je hotovo"}
        className={`grid ${big ? "h-9 w-9" : "h-7 w-7"} shrink-0 place-items-center rounded-xl border-2 font-bold transition ${
          t.done
            ? "border-leaf bg-leaf text-white"
            : "border-ink/30 bg-white text-transparent hover:border-leaf hover:bg-leaf/5 hover:text-leaf/40"
        }`}
      >
        <span className={big ? "text-lg" : "text-sm"}>✓</span>
      </button>
      <div className="min-w-0 flex-1">
        <p className={`${big ? "text-base" : "text-[15px]"} ${t.done ? "text-ink-soft line-through" : "font-semibold"}`}>{t.title}</p>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-xs text-ink-soft">
          {t.assignee && <span>👤 {t.assignee}</span>}
          {t.due && <span>📅 {fmtDate(t.due)}</span>}
          {t.fromPostId && (
            <Link href={`/zazemi?post=${t.fromPostId}`} className="font-medium text-gold-700 hover:underline">
              📌 z nástěnky
            </Link>
          )}
        </div>
      </div>
      <DeleteButton onConfirm={() => onDelete(t.id)} />
    </li>
  );
}
