"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { fmtRelative, fmtDateTime } from "@/lib/format";
import { DeleteButton } from "@/components/DeleteButton";
import { Icon } from "@/components/Icons";
import { isAdmin } from "@/lib/admin";
import { flash } from "@/components/Flash";
import { isPollClosed, formatRemaining, DEADLINE_PRESETS, nowPlusHours, isoToLocalInput, localInputToIso } from "@/lib/poll";
import type { Poll } from "@/lib/types";

// Správné české skloňování: 1 člověk hlasoval / 2–4 lidé hlasovali / 5+ lidí hlasovalo.
function votersWord(n: number): string {
  if (n === 1) return "člověk hlasoval";
  if (n >= 2 && n <= 4) return "lidé hlasovali";
  return "lidí hlasovalo";
}

// Nastavení časového limitu ankety — rychlé volby (za jak dlouho) + přesný čas.
// Když je limit nastavený, anketa se po jeho vypršení sama uzavře.
export function DeadlineField({ value, onChange }: { value?: string; onChange: (v: string | undefined) => void }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(id);
  }, []);
  const remaining = value ? formatRemaining(value, now) : null;
  return (
    <div className="rounded-xl bg-paper2/60 p-3 ring-1 ring-ink/10">
      <p className="mb-2 text-sm font-medium text-ink">⏳ Časový limit (nepovinné) — anketa se pak sama uzavře</p>
      <div className="flex flex-wrap gap-1.5">
        {DEADLINE_PRESETS.map((p) => (
          <button
            key={p.h}
            type="button"
            className="rounded-full px-3 py-1 text-xs font-medium text-ink-soft ring-1 ring-ink/10 transition hover:bg-ink/5"
            onClick={() => onChange(nowPlusHours(p.h))}
          >
            {p.label}
          </button>
        ))}
        <button
          type="button"
          className={`rounded-full px-3 py-1 text-xs font-medium transition ${value ? "text-ink-soft ring-1 ring-ink/10 hover:bg-ink/5" : "bg-gold-500 text-[#1d1d1f]"}`}
          onClick={() => onChange(undefined)}
        >
          Bez limitu
        </button>
      </div>
      <input
        type="datetime-local"
        className="input mt-2"
        value={value ? isoToLocalInput(value) : ""}
        onChange={(e) => onChange(localInputToIso(e.target.value))}
      />
      {value && (
        <p className="mt-1.5 text-xs text-ink-soft">
          Uzavře se {fmtDateTime(value)}
          {remaining ? ` · zbývá ${remaining}` : " · čas už vypršel"}
        </p>
      )}
    </div>
  );
}

export function PollCard({ poll, yearId, me, totalPeople, highlight, linkedPost, canVote = true }: { poll: Poll; yearId: string; me: string; totalPeople: number; highlight?: boolean; linkedPost?: { id: string; title: string }; canVote?: boolean }) {
  const { dispatch } = useStore();
  const [showOverview, setShowOverview] = useState(false);
  const totalVoters = new Set(poll.options.flatMap((o) => o.voters)).size;
  const maxVotes = Math.max(1, ...poll.options.map((o) => o.voters.length));
  const admin = isAdmin(me);
  const canEdit = admin || poll.author === me;

  // Odpočet: každou půlminutu přepočítáme „teď", ať se odpočet i uzavření hýbou.
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!poll.closesAt) return;
    const id = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(id);
  }, [poll.closesAt]);
  const closed = isPollClosed(poll, now);
  const remaining = poll.closesAt && !closed ? formatRemaining(poll.closesAt, now) : null;

  // Úprava ankety (otázka + možnosti + limit). Hlasy u zachovaných možností zůstanou.
  const [editing, setEditing] = useState(false);
  const [q, setQ] = useState(poll.question);
  const [opts, setOpts] = useState<{ id?: string; label: string }[]>([]);
  const [multiEdit, setMultiEdit] = useState(poll.multi);
  const [closesAtEdit, setClosesAtEdit] = useState<string | undefined>(poll.closesAt);

  function startEdit() {
    setQ(poll.question);
    setOpts(poll.options.map((o) => ({ id: o.id, label: o.label })));
    setMultiEdit(poll.multi);
    setClosesAtEdit(poll.closesAt);
    setEditing(true);
  }

  async function saveEdit() {
    const cleaned = opts.map((o) => ({ id: o.id, label: o.label.trim() })).filter((o) => o.label);
    if (!q.trim() || cleaned.length < 2) return;
    await dispatch({ type: "updatePoll", yearId, pollId: poll.id, question: q, multi: multiEdit, options: cleaned, closesAt: closesAtEdit ?? null });
    setEditing(false);
  }

  return (
    <div
      id={`poll-${poll.id}`}
      className={`card scroll-mt-24 p-5 transition-shadow ${closed ? "bg-leaf/[0.04] ring-2 ring-leaf" : ""} ${
        highlight ? "ring-2 ring-red-500 shadow-[0_0_0_4px_rgba(239,68,68,0.3)]" : ""
      }`}
    >
      <div className="mb-1 flex flex-wrap items-center gap-2 text-xs text-ink-soft">
        <span>{poll.author}</span>
        <span>· {fmtRelative(poll.createdAt)}</span>
        {poll.multi && <span className="chip">vícevýběr</span>}
        {remaining && (
          <span className="badge badge-wait tabular-nums" title={`Uzavře se ${fmtDateTime(poll.closesAt!)}`}>
            ⏳ zbývá {remaining}
          </span>
        )}
        {closed && (
          <span className="badge-closed-glow inline-flex items-center gap-1 rounded-full bg-leaf px-2.5 py-0.5 text-xs font-semibold text-white">
            <Icon name="tasks" className="h-3.5 w-3.5" /> uzavřeno
          </span>
        )}
        {linkedPost && (
          <Link
            href={`/zazemi?post=${linkedPost.id}`}
            title={`Nástěnka: ${linkedPost.title}`}
            className="ml-auto inline-flex shrink-0 items-center gap-1 rounded-full bg-gold-100 px-2.5 py-1 text-xs font-medium text-gold-800 ring-1 ring-gold-200 transition hover:bg-gold-200"
          >
            📌 Nástěnka
          </Link>
        )}
      </div>
      <h3 className="font-display text-[20px] font-semibold">{poll.question}</h3>

      <div className="mt-3 space-y-2">
        {poll.options.map((o) => {
          const mine = o.voters.includes(me);
          const pct = Math.round((o.voters.length / maxVotes) * 100);
          return (
            <button
              key={o.id}
              disabled={closed || !canVote}
              onClick={async () => {
                await dispatch({ type: "vote", yearId, pollId: poll.id, optionId: o.id, voter: me });
                flash(`Hlasoval jsi: ${o.label}`, "🗳️");
              }}
              className={`relative block w-full overflow-hidden rounded-xl border px-3 py-2.5 text-left transition ${
                mine ? "border-gold-400 bg-gold-50" : "border-ink/10 bg-white hover:bg-paper2"
              } ${closed || !canVote ? "cursor-default" : "cursor-pointer"}`}
            >
              <span
                aria-hidden
                className={`absolute inset-y-0 left-0 ${mine ? "bg-gold-200/60" : "bg-paper2"}`}
                style={{ width: `${pct}%` }}
              />
              <span className="relative flex items-center justify-between gap-2">
                <span className="flex items-center gap-2 text-sm font-medium">
                  <span className={`grid h-4 w-4 place-items-center border text-[10px] ${poll.multi ? "rounded-[4px]" : "rounded-full"} ${mine ? "border-gold-600 bg-gold-500 text-[#1d1d1f]" : "border-ink/30"}`}>
                    {mine ? "✓" : ""}
                  </span>
                  {o.label}
                </span>
                <span className="relative text-xs text-ink-soft tabular-nums">
                  {o.voters.length}
                  {o.voters.length > 0 && <span className="ml-1 hidden sm:inline">· {o.voters.join(", ")}</span>}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {!canVote && !closed && <p className="mt-2 text-xs text-ink-soft">Tuhle anketu můžeš jen sledovat — hlasovat smí jen výzdobáři.</p>}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {totalVoters === 0 ? (
          <span className="inline-flex items-center rounded-full bg-paper2 px-4 py-2 text-sm font-medium text-ink-soft">
            {totalPeople > 0 ? `Zatím nikdo z ${totalPeople} nehlasoval` : "Zatím nikdo nehlasoval"}
          </span>
        ) : (
          <span className="inline-flex items-center gap-2.5 rounded-full bg-gold-500 px-4 py-2 text-[#1d1d1f] shadow-sm">
            <span className="font-display text-3xl font-bold leading-none tracking-tight tabular-nums">
              {totalVoters}
              {totalPeople > 0 && <span className="text-xl font-semibold opacity-80"> z {totalPeople}</span>}
            </span>
            <span className="text-sm font-semibold leading-tight">
              {totalPeople > 0 ? `${totalPeople === 1 ? "člověka" : "lidí"} hlasovalo` : votersWord(totalVoters)}
            </span>
          </span>
        )}
        <span className="ml-auto flex items-center gap-2">
          <button className="btn-ghost px-2 py-1 text-xs" onClick={() => setShowOverview((v) => !v)}>
            <Icon name="vote" className="h-3.5 w-3.5" /> {showOverview ? "Skrýt přehled" : "Přehled"}
          </button>
          {canEdit && (
            <button className="btn-ghost px-2 py-1 text-xs" onClick={() => (editing ? setEditing(false) : startEdit())}>
              {editing ? "Zavřít úpravu" : "Upravit"}
            </button>
          )}
          {admin && (
            <button
              className="btn-ghost px-2 py-1 text-xs"
              onClick={() => dispatch(closed ? { type: "reopenPoll", yearId, pollId: poll.id } : { type: "closePoll", yearId, pollId: poll.id })}
            >
              {closed ? "Otevřít" : "Uzavřít"}
            </button>
          )}
          {(admin || poll.author === me) && (
            <DeleteButton onConfirm={() => dispatch({ type: "removePoll", yearId, pollId: poll.id })} />
          )}
        </span>
      </div>

      {showOverview && (
        <div className="mt-3 space-y-3 rounded-xl bg-paper2 p-4">
          <p className="text-xs font-semibold text-ink-soft">Kdo hlasoval za co</p>
          {poll.options.map((o) => (
            <div key={o.id}>
              <div className="flex items-center justify-between gap-2 text-sm font-medium">
                <span>{o.label}</span>
                <span className="text-ink-soft tabular-nums">{o.voters.length}</span>
              </div>
              {o.voters.length > 0 ? (
                <div className="mt-1.5 flex flex-col items-start gap-1.5">
                  {o.voters.map((v) => (
                    <span key={v} className="chip inline-flex items-center gap-1">
                      {v}
                      {admin && (
                        <button
                          onClick={() => dispatch({ type: "removeVoter", yearId, pollId: poll.id, optionId: o.id, voter: v })}
                          className="text-ink-soft/60 hover:text-red-600"
                          title={`Odebrat hlas — ${v}`}
                        >
                          ✕
                        </button>
                      )}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-1 text-xs text-ink-soft">— nikdo —</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Úprava se ukáže až po kliknutí na „Upravit" — rozbalí se pod anketou. */}
      {editing && (
        <div className="mt-3 space-y-3 rounded-xl border border-gold-200 bg-gold-50/40 p-4">
          <p className="text-xs font-semibold text-ink-soft">Úprava ankety</p>
          <input className="input" placeholder="Otázka" value={q} onChange={(e) => setQ(e.target.value)} autoFocus />
          <div className="space-y-2">
            {opts.map((o, i) => {
              const votes = poll.options.find((po) => po.id === o.id)?.voters.length ?? 0;
              return (
                <div key={o.id ?? `new-${i}`} className="flex items-center gap-2">
                  <input
                    className="input"
                    placeholder={`Možnost ${i + 1}`}
                    value={o.label}
                    onChange={(e) => setOpts((arr) => arr.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))}
                  />
                  {votes > 0 && (
                    <span className="shrink-0 text-xs text-ink-soft tabular-nums" title="Hlasy zůstanou">
                      {votes}×
                    </span>
                  )}
                  {opts.length > 2 && (
                    <button
                      className="btn-ghost px-2"
                      aria-label={`Odebrat možnost ${i + 1}`}
                      title={votes > 0 ? "Odebrat (přijde o hlasy)" : "Odebrat možnost"}
                      onClick={() => setOpts((arr) => arr.filter((_, j) => j !== i))}
                    >
                      ✕
                    </button>
                  )}
                </div>
              );
            })}
            <button className="btn-ghost" onClick={() => setOpts((arr) => [...arr, { label: "" }])}>
              + Další možnost
            </button>
          </div>
          <DeadlineField value={closesAtEdit} onChange={setClosesAtEdit} />
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-ink-soft">
              <input type="checkbox" checked={multiEdit} onChange={(e) => setMultiEdit(e.target.checked)} />
              Lze vybrat víc možností
            </label>
            <div className="ml-auto flex gap-2">
              <button className="btn-ghost" onClick={() => setEditing(false)}>
                Zrušit
              </button>
              <button className="btn-primary" onClick={saveEdit}>
                Uložit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
