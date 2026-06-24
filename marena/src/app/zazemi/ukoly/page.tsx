"use client";

import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { ROLES, roleById } from "@/lib/roles";
import { fmtDate } from "@/lib/format";
import { DeleteButton } from "@/components/DeleteButton";

type Filter = "vse" | "moje" | "nehotove" | "hotove";

export default function UkolyPage() {
  const { currentYear, me, dispatch } = useStore();
  const [filter, setFilter] = useState<Filter>("nehotove");
  const [title, setTitle] = useState("");
  const [roleId, setRoleId] = useState("");
  const [assignee, setAssignee] = useState("");
  const [due, setDue] = useState("");

  const year = currentYear;

  // Moje role v tomto ročníku — úkoly těchto rolí beru jako „moje".
  const myRoleIds = useMemo(() => year?.members.find((m) => m.name === me)?.roleIds ?? [], [year, me]);

  const tasks = useMemo(() => {
    if (!year) return [];
    return year.tasks.filter((t) => {
      if (filter === "moje") return !t.done && (t.assignee === me || (!!t.roleId && myRoleIds.includes(t.roleId)));
      if (filter === "nehotove") return !t.done;
      if (filter === "hotove") return t.done;
      return true;
    });
  }, [year, filter, me, myRoleIds]);

  // seskupení podle role
  const grouped = useMemo(() => {
    const map = new Map<string, typeof tasks>();
    for (const t of tasks) {
      const key = t.roleId || "_none";
      const arr = map.get(key) || [];
      arr.push(t);
      map.set(key, arr);
    }
    return map;
  }, [tasks]);

  if (!year) return null;

  const done = year.tasks.filter((t) => t.done).length;
  const total = year.tasks.length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  async function add() {
    if (!title.trim() || !year) return;
    await dispatch({ type: "addTask", yearId: year.id, title, roleId: roleId || undefined, assignee: assignee || undefined, due: due || undefined });
    setTitle("");
    setRoleId("");
    setAssignee("");
    setDue("");
  }

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <div>
        <h1 className="font-display text-2xl font-semibold">Úkoly — {year.label}</h1>
        <p className="text-sm text-ink-soft">Deleguj. Co má majitele, to se udělá.</p>
      </div>

      {/* progress */}
      <div className="card p-4">
        <div className="mb-1 flex items-center justify-between text-sm">
          <span className="font-medium">Hotovo {done} z {total}</span>
          <span className="text-ink-soft">{pct} %</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-paper2">
          <div className="h-full rounded-full bg-marigold-500 transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* přidat úkol */}
      <div className="card space-y-2 p-4">
        <input className="input" placeholder="Nový úkol (např. Obvolat aulu kvůli souběhu)" value={title} onChange={(e) => setTitle(e.target.value)} onKeyDown={(e) => e.key === "Enter" && add()} />
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
        <button className="btn-primary" onClick={add}>
          + Přidat úkol
        </button>
      </div>

      {/* filtr */}
      <div className="flex flex-wrap gap-2">
        {([
          ["nehotove", "Nehotové"],
          ["moje", "Moje"],
          ["hotove", "Hotové"],
          ["vse", "Vše"],
        ] as [Filter, string][]).map(([f, label]) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
              filter === f ? "bg-marigold-600 text-white" : "bg-white text-ink-soft ring-1 ring-ink/10 hover:bg-paper2"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* seznam */}
      {tasks.length === 0 ? (
        <div className="card grid place-items-center p-10 text-center text-sm text-ink-soft">Nic tu není. 🎉</div>
      ) : (
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
                    <li key={t.id} className="flex items-center gap-3 px-4 py-2.5">
                      <input
                        type="checkbox"
                        checked={t.done}
                        onChange={() => dispatch({ type: "toggleTask", yearId: year.id, taskId: t.id })}
                        className="h-4 w-4 accent-marigold-600"
                      />
                      <div className="min-w-0 flex-1">
                        <p className={`text-sm ${t.done ? "text-ink-soft line-through" : "font-medium"}`}>{t.title}</p>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-ink-soft">
                          {t.assignee && <span>👤 {t.assignee}</span>}
                          {t.due && <span>📅 {fmtDate(t.due)}</span>}
                        </div>
                      </div>
                      <DeleteButton onConfirm={() => dispatch({ type: "removeTask", yearId: year.id, taskId: t.id })} />
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
