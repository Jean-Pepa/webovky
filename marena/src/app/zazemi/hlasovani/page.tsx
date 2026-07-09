"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { SearchBox } from "@/components/SearchBox";
import { matchesQuery } from "@/lib/search";
import { flash } from "@/components/Flash";
import { isPollClosed } from "@/lib/poll";
import { PollCard, DeadlineField } from "@/components/PollCard";
import { isAdmin } from "@/lib/admin";
import { myRoleIds } from "@/lib/access";

export default function HlasovaniPage() {
  const { currentYear, me, dispatch } = useStore();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [multi, setMulti] = useState(false);
  const [closesAt, setClosesAt] = useState<string | undefined>(undefined);
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
    await dispatch({ type: "addPoll", yearId: year.id, author: me, question, options: opts, multi, closesAt });
    setQuestion("");
    setOptions(["", ""]);
    setMulti(false);
    setClosesAt(undefined);
    setOpen(false);
    flash("Anketa vytvořena", "🗳️");
  }

  // Ankety výzdoby jsou jen pro výzdobáře (a správce) — ostatní je tu nevidí.
  const canSeeVyzdoba = isAdmin(me) || myRoleIds(year, me).includes("vyzdoba");
  const polls = [...year.polls]
    .filter((p) => p.tag !== "vyzdoba" || canSeeVyzdoba)
    .sort((a, b) => {
      const ac = isPollClosed(a), bc = isPollClosed(b);
      if (ac !== bc) return ac ? 1 : -1;
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
          <h1 className="font-display text-[28px] font-bold uppercase tracking-tight">Hlasování</h1>
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
          <DeadlineField value={closesAt} onChange={setClosesAt} />
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
          {q ? "Nic neodpovídá hledání." : "Zatím žádná anketa."}
        </div>
      ) : (
        polls.map((p) => (
          <PollCard key={p.id} poll={p} yearId={year.id} me={me} totalPeople={year.members.length} highlight={highlight === p.id} linkedPost={postByPoll.get(p.id)} />
        ))
      )}
    </div>
  );
}
