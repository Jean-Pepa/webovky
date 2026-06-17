"use client";

import { useState } from "react";
import { useStore, type Poll, type PollKind } from "@/lib/store";
import { formatDate } from "@/lib/format";
import { IconVote, IconPlus, IconTrash, IconCheck } from "@/components/Icons";

export function PollsSection({
  propertyId,
  polls,
  kind = "VOTE",
}: {
  propertyId: string;
  polls: Poll[];
  kind?: PollKind;
}) {
  const { addPoll, deletePoll, votePoll, setPollStatus, role } = useStore();
  const manage = role === "CREATOR";
  const [open, setOpen] = useState(false);
  const isSurvey = kind === "SURVEY";
  const word = isSurvey ? "anketu" : "hlasování";

  const sorted = [...polls]
    .filter((p) => (p.kind ?? "VOTE") === kind)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const question = String(fd.get("question") || "").trim();
    const options = String(fd.get("options") || "")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    if (!question || options.length < 2) return;
    addPoll(propertyId, {
      kind,
      question,
      note: String(fd.get("note") || "").trim() || undefined,
      deadline: String(fd.get("deadline") || "").trim() || undefined,
      options,
    });
    e.currentTarget.reset();
    setOpen(false);
  }

  return (
    <section className="card p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <IconVote className="h-4 w-4 text-teal-700" />
          <h2 className="text-sm font-semibold text-stone-900">{isSurvey ? "Ankety" : "Hlasování"}</h2>
          {sorted.length > 0 && <span className="text-xs text-stone-400">· {sorted.length}</span>}
        </div>
        {manage && (
          <button onClick={() => setOpen((o) => !o)} className="btn-ghost btn-sm text-teal-700">
            <IconPlus className="h-4 w-4" />
            {isSurvey ? "Nová anketa" : "Nové hlasování"}
          </button>
        )}
      </div>

      {open && manage && (
        <form onSubmit={submit} className="mt-3 space-y-2 border-b border-stone-100 pb-4">
          <input name="question" required className="input" placeholder={isSurvey ? "Otázka ankety" : "Otázka k hlasování"} />
          <textarea name="note" className="input min-h-16" placeholder="Doplňující popis (volitelné)" />
          <textarea
            name="options"
            required
            className="input min-h-20"
            placeholder={"Možnosti — každá na samostatný řádek\nPro\nProti\nZdržuji se"}
            defaultValue={"Pro\nProti\nZdržuji se"}
          />
          <label className="block text-xs text-stone-500">
            Termín (per rollam)
            <input name="deadline" type="date" className="input mt-1" />
          </label>
          <button className="btn-secondary w-full" type="submit">
            {isSurvey ? "Vytvořit anketu" : "Vytvořit hlasování"}
          </button>
        </form>
      )}

      {sorted.length === 0 ? (
        !open && (
          <p className="mt-2 text-sm text-stone-500">
            {manage ? `Zatím nic. Vytvořte ${word}.` : "Zatím nic."}
          </p>
        )
      ) : (
        <ul className="mt-3 space-y-4">
          {sorted.map((poll) => {
            const total = poll.options.reduce((s, o) => s + o.votes, 0);
            const closed = poll.status === "CLOSED";
            return (
              <li key={poll.id} className="rounded-xl border border-stone-200 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-stone-900">{poll.question}</p>
                    <p className="text-xs text-stone-400">
                      {closed ? "Uzavřeno" : "Probíhá"}
                      {poll.deadline ? ` · do ${formatDate(poll.deadline)}` : ""} · {total} hlasů
                    </p>
                  </div>
                  {manage && (
                    <div className="flex shrink-0 items-center gap-1.5">
                      <button
                        onClick={() => setPollStatus(propertyId, poll.id, closed ? "OPEN" : "CLOSED")}
                        className={closed ? "btn-ghost btn-sm text-teal-700" : "btn-secondary btn-sm"}
                      >
                        <IconCheck className="h-4 w-4" />
                        {closed ? "Otevřít" : "Uzavřít"}
                      </button>
                      <button
                        onClick={() => {
                          if (confirm("Smazat hlasování?")) deletePoll(propertyId, poll.id);
                        }}
                        className="btn-ghost btn-sm text-stone-400 hover:text-red-600"
                        aria-label="Smazat"
                      >
                        <IconTrash className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
                {poll.note && <p className="mt-1 text-sm text-stone-600">{poll.note}</p>}

                <ul className="mt-3 space-y-2">
                  {poll.options.map((o) => {
                    const pct = total > 0 ? Math.round((o.votes / total) * 100) : 0;
                    return (
                      <li key={o.id}>
                        <div className="flex items-center justify-between gap-3 text-sm">
                          <span className="text-stone-700">{o.label}</span>
                          <span className="flex items-center gap-2 text-xs text-stone-400">
                            {o.votes} · {pct}%
                            {!closed && (
                              <button
                                onClick={() => votePoll(propertyId, poll.id, o.id)}
                                className="btn-ghost btn-sm text-teal-700"
                              >
                                Hlasovat
                              </button>
                            )}
                          </span>
                        </div>
                        <div className="mt-1 h-2 overflow-hidden rounded-full bg-stone-100">
                          <div className="h-full rounded-full bg-teal-600" style={{ width: `${pct}%` }} />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
