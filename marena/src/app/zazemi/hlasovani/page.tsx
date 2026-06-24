"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { fmtRelative } from "@/lib/format";
import { DeleteButton } from "@/components/DeleteButton";
import type { Poll } from "@/lib/types";

export default function HlasovaniPage() {
  const { currentYear, me, dispatch } = useStore();
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [multi, setMulti] = useState(false);
  const year = currentYear;
  if (!year) return null;

  async function create() {
    const opts = options.map((o) => o.trim()).filter(Boolean);
    if (!question.trim() || opts.length < 2 || !year) return;
    await dispatch({ type: "addPoll", yearId: year.id, author: me, question, options: opts, multi });
    setQuestion("");
    setOptions(["", ""]);
    setMulti(false);
    setOpen(false);
  }

  const polls = [...year.polls].sort((a, b) => {
    if (a.closed !== b.closed) return a.closed ? 1 : -1;
    return b.createdAt.localeCompare(a.createdAt);
  });

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold">Hlasování — {year.label}</h1>
          <p className="text-sm text-ink-soft">O důležitých rozhodnutích se hlasuje. Rozhoduje tým.</p>
        </div>
        <button className="btn-primary" onClick={() => setOpen((v) => !v)}>
          {open ? "Zavřít" : "+ Nová anketa"}
        </button>
      </div>

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
                  <button className="btn-ghost px-2" onClick={() => setOptions((arr) => arr.filter((_, j) => j !== i))}>
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
          Zatím žádná anketa. Založ první rozhodování týmu.
        </div>
      ) : (
        polls.map((p) => <PollCard key={p.id} poll={p} yearId={year.id} me={me} />)
      )}
    </div>
  );
}

function PollCard({ poll, yearId, me }: { poll: Poll; yearId: string; me: string }) {
  const { dispatch } = useStore();
  const totalVoters = new Set(poll.options.flatMap((o) => o.voters)).size;
  const maxVotes = Math.max(1, ...poll.options.map((o) => o.voters.length));

  return (
    <div className={`card p-5 ${poll.closed ? "opacity-80" : ""}`}>
      <div className="mb-1 flex items-center gap-2 text-xs text-ink-soft">
        <span>{poll.author}</span>
        <span>· {fmtRelative(poll.createdAt)}</span>
        {poll.multi && <span className="chip">vícevýběr</span>}
        {poll.closed && <span className="chip bg-plum-100 text-plum-700">uzavřeno</span>}
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
              onClick={() => dispatch({ type: "vote", yearId, pollId: poll.id, optionId: o.id, voter: me })}
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

      <div className="mt-3 flex items-center gap-2 text-xs text-ink-soft">
        <span>Hlasovalo {totalVoters} lidí</span>
        <span className="ml-auto flex items-center gap-2">
          <button className="btn-ghost px-2 py-1 text-xs" onClick={() => dispatch({ type: "closePoll", yearId, pollId: poll.id })}>
            {poll.closed ? "Otevřít" : "Uzavřít"}
          </button>
          <DeleteButton onConfirm={() => dispatch({ type: "removePoll", yearId, pollId: poll.id })} />
        </span>
      </div>
    </div>
  );
}
