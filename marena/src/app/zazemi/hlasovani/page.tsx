"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { fmtRelative } from "@/lib/format";
import { DeleteButton } from "@/components/DeleteButton";
import { Icon } from "@/components/Icons";
import { SearchBox } from "@/components/SearchBox";
import { matchesQuery } from "@/lib/search";
import { isAdmin } from "@/lib/admin";
import { flash } from "@/components/Flash";
import type { Poll } from "@/lib/types";

export default function HlasovaniPage() {
  const { currentYear, me, dispatch } = useStore();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [multi, setMulti] = useState(false);
  // Když přijdeme z nástěnky přes ?poll=<id>, odscrolujeme a anketu na chvíli zvýrazníme.
  const [highlight, setHighlight] = useState<string | null>(null);
  const year = currentYear;

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("poll");
    if (!id) return;
    const t = setTimeout(() => {
      setHighlight(id);
      document.getElementById(`poll-${id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 80);
    const clear = setTimeout(() => setHighlight(null), 2600);
    return () => {
      clearTimeout(t);
      clearTimeout(clear);
    };
  }, [year?.id]);

  if (!year) return null;

  async function create() {
    const opts = options.map((o) => o.trim()).filter(Boolean);
    if (!question.trim() || opts.length < 2 || !year) return;
    await dispatch({ type: "addPoll", yearId: year.id, author: me, question, options: opts, multi });
    setQuestion("");
    setOptions(["", ""]);
    setMulti(false);
    setOpen(false);
    flash("Anketa vytvořena", "🗳️");
  }

  const polls = [...year.polls]
    .sort((a, b) => {
      if (a.closed !== b.closed) return a.closed ? 1 : -1;
      return b.createdAt.localeCompare(a.createdAt);
    })
    .filter((p) => matchesQuery(q, p.question, p.author, p.options.map((o) => o.label).join(" ")));

  // Ke které anketě patří jaký příspěvek na nástěnce (pro tlačítko zpět na nástěnku).
  const postByPoll = new Map<string, { id: string; title: string }>();
  for (const po of year.posts) if (po.pollId) postByPoll.set(po.pollId, { id: po.id, title: po.title });

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold">Hlasování</h1>
        </div>
        <button className="btn-primary" onClick={() => setOpen((v) => !v)}>
          {open ? "Zavřít" : "+ Nová anketa"}
        </button>
      </div>

      <SearchBox value={q} onChange={setQ} placeholder="Hledat anketu…" />

      {open && (
        <div className="card space-y-3 p-4">
          <input className="input" placeholder="Otázka (např. Jaké téma letošní Mařeny?)" value={question} onChange={(e) => setQuestion(e.target.value)} />
          <div className="space-y-2">
            {options.map((o, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  className="input"
                  placeholder={`Možnost ${i + 1}`}
                  value={o}
                  onChange={(e) => setOptions((arr) => arr.map((x, j) => (j === i ? e.target.value : x)))}
                />
                {options.length > 2 && (
                  <button
                    className="btn-ghost px-2"
                    aria-label={`Odebrat možnost ${i + 1}`}
                    title="Odebrat možnost"
                    onClick={() => setOptions((arr) => arr.filter((_, j) => j !== i))}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button className="btn-ghost" onClick={() => setOptions((arr) => [...arr, ""])}>
              + Další možnost
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-ink-soft">
              <input type="checkbox" checked={multi} onChange={(e) => setMulti(e.target.checked)} />
              Lze vybrat víc možností
            </label>
            <button className="btn-primary ml-auto" onClick={create}>
              Vytvořit anketu
            </button>
          </div>
        </div>
      )}

      {polls.length === 0 ? (
        <div className="card grid place-items-center p-10 text-center text-sm text-ink-soft">
          {q ? "Nic neodpovídá hledání." : "Zatím žádná anketa. Založ první rozhodování týmu."}
        </div>
      ) : (
        polls.map((p) => (
          <PollCard key={p.id} poll={p} yearId={year.id} me={me} totalPeople={year.members.length} highlight={highlight === p.id} linkedPost={postByPoll.get(p.id)} />
        ))
      )}
    </div>
  );
}

// Správné české skloňování: 1 člověk hlasoval / 2–4 lidé hlasovali / 5+ lidí hlasovalo.
function votersWord(n: number): string {
  if (n === 1) return "člověk hlasoval";
  if (n >= 2 && n <= 4) return "lidé hlasovali";
  return "lidí hlasovalo";
}

function PollCard({ poll, yearId, me, totalPeople, highlight, linkedPost }: { poll: Poll; yearId: string; me: string; totalPeople: number; highlight?: boolean; linkedPost?: { id: string; title: string } }) {
  const { dispatch } = useStore();
  const [showOverview, setShowOverview] = useState(false);
  const totalVoters = new Set(poll.options.flatMap((o) => o.voters)).size;
  const maxVotes = Math.max(1, ...poll.options.map((o) => o.voters.length));
  const admin = isAdmin(me);
  const canEdit = admin || poll.author === me;

  // Úprava ankety (otázka + možnosti). Hlasy u zachovaných možností zůstanou.
  const [editing, setEditing] = useState(false);
  const [q, setQ] = useState(poll.question);
  const [opts, setOpts] = useState<{ id?: string; label: string }[]>([]);
  const [multiEdit, setMultiEdit] = useState(poll.multi);

  function startEdit() {
    setQ(poll.question);
    setOpts(poll.options.map((o) => ({ id: o.id, label: o.label })));
    setMultiEdit(poll.multi);
    setEditing(true);
  }

  async function saveEdit() {
    const cleaned = opts.map((o) => ({ id: o.id, label: o.label.trim() })).filter((o) => o.label);
    if (!q.trim() || cleaned.length < 2) return;
    await dispatch({ type: "updatePoll", yearId, pollId: poll.id, question: q, multi: multiEdit, options: cleaned });
    setEditing(false);
  }

  return (
    <div
      id={`poll-${poll.id}`}
      className={`card scroll-mt-24 p-5 transition-shadow ${poll.closed ? "bg-leaf/[0.04] ring-2 ring-leaf" : ""} ${
        highlight ? "ring-2 ring-marigold-500 shadow-[0_0_0_4px_rgba(253,175,34,0.25)]" : ""
      }`}
    >
      <div className="mb-1 flex items-center gap-2 text-xs text-ink-soft">
        <span>{poll.author}</span>
        <span>· {fmtRelative(poll.createdAt)}</span>
        {poll.multi && <span className="chip">vícevýběr</span>}
        {poll.closed && (
          <span className="badge-closed-glow inline-flex items-center gap-1 rounded-full bg-leaf px-2.5 py-0.5 text-xs font-semibold text-white">
            <Icon name="tasks" className="h-3.5 w-3.5" /> uzavřeno
          </span>
        )}
        {linkedPost && (
          <Link
            href={`/zazemi?post=${linkedPost.id}`}
            title={`Nástěnka: ${linkedPost.title}`}
            className="ml-auto inline-flex shrink-0 items-center gap-1 rounded-full bg-marigold-100 px-2.5 py-1 text-xs font-medium text-marigold-800 ring-1 ring-marigold-200 transition hover:bg-marigold-200"
          >
            📌 Nástěnka
          </Link>
        )}
      </div>
      <h3 className="font-display text-lg font-semibold">{poll.question}</h3>

      <div className="mt-3 space-y-2">
        {poll.options.map((o) => {
          const mine = o.voters.includes(me);
          const pct = Math.round((o.voters.length / maxVotes) * 100);
          return (
            <button
              key={o.id}
              disabled={poll.closed}
              onClick={async () => {
                await dispatch({ type: "vote", yearId, pollId: poll.id, optionId: o.id, voter: me });
                flash(`Hlasoval jsi: ${o.label}`, "🗳️");
              }}
              className={`relative block w-full overflow-hidden rounded-xl border px-3 py-2.5 text-left transition ${
                mine ? "border-marigold-400 bg-marigold-50" : "border-ink/10 bg-white hover:bg-paper2"
              } ${poll.closed ? "cursor-default" : "cursor-pointer"}`}
            >
              <span
                aria-hidden
                className={`absolute inset-y-0 left-0 ${mine ? "bg-marigold-200/60" : "bg-paper2"}`}
                style={{ width: `${pct}%` }}
              />
              <span className="relative flex items-center justify-between gap-2">
                <span className="flex items-center gap-2 text-sm font-medium">
                  <span className={`grid h-4 w-4 place-items-center border text-[10px] ${poll.multi ? "rounded-[4px]" : "rounded-full"} ${mine ? "border-marigold-600 bg-marigold-600 text-white" : "border-ink/30"}`}>
                    {mine ? "✓" : ""}
                  </span>
                  {o.label}
                </span>
                <span className="relative text-xs text-ink-soft">
                  {o.voters.length}
                  {o.voters.length > 0 && <span className="ml-1 hidden sm:inline">· {o.voters.join(", ")}</span>}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {totalVoters === 0 ? (
          <span className="inline-flex items-center rounded-full bg-paper2 px-4 py-2 text-sm font-medium text-ink-soft">
            {totalPeople > 0 ? `Zatím nikdo z ${totalPeople} nehlasoval` : "Zatím nikdo nehlasoval"}
          </span>
        ) : (
          <span className="inline-flex items-center gap-2.5 rounded-full bg-marigold-600 px-4 py-2 text-white shadow-sm">
            <span className="font-display text-3xl font-bold leading-none tracking-tight">
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
            <button className="btn-ghost px-2 py-1 text-xs" onClick={() => dispatch({ type: "closePoll", yearId, pollId: poll.id })}>
              {poll.closed ? "Otevřít" : "Uzavřít"}
            </button>
          )}
          {(admin || poll.author === me) && (
            <DeleteButton onConfirm={() => dispatch({ type: "removePoll", yearId, pollId: poll.id })} />
          )}
        </span>
      </div>

      {showOverview && (
        <div className="mt-3 space-y-3 rounded-2xl bg-paper2 p-4">
          <p className="text-xs font-semibold text-ink-soft">Kdo hlasoval za co</p>
          {poll.options.map((o) => (
            <div key={o.id}>
              <div className="flex items-center justify-between gap-2 text-sm font-medium">
                <span>{o.label}</span>
                <span className="text-ink-soft">{o.voters.length}</span>
              </div>
              {o.voters.length > 0 ? (
                <div className="mt-1.5 flex flex-wrap gap-1.5">
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
        <div className="mt-3 space-y-3 rounded-2xl border border-marigold-200 bg-marigold-50/40 p-4">
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
                    <span className="shrink-0 text-xs text-ink-soft" title="Hlasy zůstanou">
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
