"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { roleById, ROLES } from "@/lib/roles";
import { Modal } from "@/components/Modal";
import { fmtDateTime, fmtDayShort, todayISO, fmtCZK } from "@/lib/format";
import { KINDS } from "@/lib/kinds";
import { DeleteButton } from "@/components/DeleteButton";
import { Onboarding } from "@/components/Onboarding";
import { MyAgenda } from "@/components/MyAgenda";
import { Icon } from "@/components/Icons";
import { SearchBox } from "@/components/SearchBox";
import { ImageViewer } from "@/components/ImageViewer";
import { matchesQuery } from "@/lib/search";
import { isAdmin } from "@/lib/admin";
import { sameName, assigneeHas } from "@/lib/names";
import { flash } from "@/components/Flash";
import { compressImage, saveReceipt, loadReceipt, deleteReceipt } from "@/lib/receipts";
import { uid } from "@/lib/id";
import { isPollClosed } from "@/lib/poll";
import type { Post } from "@/lib/types";

// Koncept ankety připojené k příspěvku (žije pak v sekci Hlasování).
// Buď se připojí už existující anketa (mode "existing"), nebo se založí nová.
type PollDraft = { on: boolean; mode: "existing" | "new"; existingId: string; question: string; options: string[]; multi: boolean };
const emptyPoll: PollDraft = { on: false, mode: "new", existingId: "", question: "", options: ["", ""], multi: false };
type PollChoice = { kind: "existing"; id: string } | { kind: "new"; question: string; options: string[]; multi: boolean };
// Vyhodnotí koncept: co se má reálně stát (připojit / založit), nebo null když nic.
function resolvePoll(d: PollDraft): PollChoice | null {
  if (!d.on) return null;
  if (d.mode === "existing") return d.existingId ? { kind: "existing", id: d.existingId } : null;
  const opts = d.options.map((o) => o.trim()).filter(Boolean);
  if (!d.question.trim() || opts.length < 2) return null;
  return { kind: "new", question: d.question.trim(), options: opts, multi: d.multi };
}

// Editor ankety — sdílený mezi přidáním a úpravou příspěvku.
function PollComposer({ draft, setDraft, polls }: { draft: PollDraft; setDraft: (d: PollDraft) => void; polls: { id: string; question: string }[] }) {
  const setOpt = (i: number, v: string) => setDraft({ ...draft, options: draft.options.map((x, j) => (j === i ? v : x)) });
  const hasExisting = polls.length > 0;
  return (
    <div className="rounded-xl bg-paper2/60 p-3 ring-1 ring-ink/10">
      <label className="flex items-center gap-2 text-sm font-medium text-ink">
        <input
          type="checkbox"
          checked={draft.on}
          // Když jsou už nějaké ankety, přednastavíme „připojit existující".
          onChange={(e) => setDraft({ ...draft, on: e.target.checked, mode: e.target.checked && hasExisting ? "existing" : "new" })}
        />
        🗳️ Přidat anketu (objeví se i v sekci Hlasování)
      </label>
      {draft.on && (
        <div className="mt-3 space-y-2">
          {hasExisting && (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className={draft.mode === "existing" ? "btn-primary px-3 py-1.5 text-xs" : "btn-ghost px-3 py-1.5 text-xs"}
                onClick={() => setDraft({ ...draft, mode: "existing" })}
              >
                Připojit existující
              </button>
              <button
                type="button"
                className={draft.mode === "new" ? "btn-primary px-3 py-1.5 text-xs" : "btn-ghost px-3 py-1.5 text-xs"}
                onClick={() => setDraft({ ...draft, mode: "new" })}
              >
                Vytvořit novou
              </button>
            </div>
          )}
          {draft.mode === "existing" && hasExisting ? (
            <select className="input" value={draft.existingId} onChange={(e) => setDraft({ ...draft, existingId: e.target.value })}>
              <option value="">Vyber existující anketu…</option>
              {polls.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.question}
                </option>
              ))}
            </select>
          ) : (
            <>
              <input
                className="input"
                placeholder="Otázka ankety"
                value={draft.question}
                onChange={(e) => setDraft({ ...draft, question: e.target.value })}
              />
              {draft.options.map((o, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input className="input" placeholder={`Možnost ${i + 1}`} value={o} onChange={(e) => setOpt(i, e.target.value)} />
                  {draft.options.length > 2 && (
                    <button
                      type="button"
                      className="btn-ghost px-2"
                      aria-label={`Odebrat možnost ${i + 1}`}
                      title="Odebrat možnost"
                      onClick={() => setDraft({ ...draft, options: draft.options.filter((_, j) => j !== i) })}
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <div className="flex flex-wrap items-center gap-3">
                <button type="button" className="btn-ghost" onClick={() => setDraft({ ...draft, options: [...draft.options, ""] })}>
                  + Další možnost
                </button>
                <label className="flex items-center gap-2 text-sm text-ink-soft">
                  <input type="checkbox" checked={draft.multi} onChange={(e) => setDraft({ ...draft, multi: e.target.checked })} />
                  Lze vybrat víc možností
                </label>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// Koncept úkolů připojených k příspěvku — každý řádek = co udělat + kdo.
// Po zveřejnění se z nich stanou úkoly v sekci Úkoly (propojené zpět přes fromPostId).
type TaskRow = { text: string; who: string[] }; // who = jeden nebo víc řešitelů
type TaskDraft = { on: boolean; rows: TaskRow[] };
const emptyTasks: TaskDraft = { on: false, rows: [{ text: "", who: [] }] };
const resolveTasks = (d: TaskDraft): { text: string; who: string }[] =>
  d.on ? d.rows.map((r) => ({ text: r.text.trim(), who: r.who.join(", ") })).filter((r) => r.text) : [];

// Editor úkolů — „kdo a co má udělat". Sdílený mezi přidáním a úpravou příspěvku.
// `names` = jména z týmu do rozbalovacího výběru „Kdo?" (klik = rovnou seznam, bez psaní).
function TaskComposer({ draft, setDraft, names = [], title = "✅ Přidat úkol (propíše se do sekce Úkoly)" }: { draft: TaskDraft; setDraft: (d: TaskDraft) => void; names?: string[]; title?: string }) {
  const setRow = (i: number, patch: Partial<TaskRow>) => setDraft({ ...draft, rows: draft.rows.map((r, j) => (j === i ? { ...r, ...patch } : r)) });
  return (
    <div className="rounded-xl bg-paper2/60 p-3 ring-1 ring-ink/10">
      <label className="flex items-center gap-2 text-sm font-medium text-ink">
        <input type="checkbox" checked={draft.on} onChange={(e) => setDraft({ ...draft, on: e.target.checked })} />
        {title}
      </label>
      {draft.on && (
        <div className="mt-3 space-y-3">
          {draft.rows.map((r, i) => (
            <div key={i} className="rounded-lg bg-white/60 p-2 ring-1 ring-ink/10">
              <div className="flex items-center gap-2">
                <input className="input flex-1" placeholder="Co udělat? (např. Povolení průvodu)" value={r.text} onChange={(e) => setRow(i, { text: e.target.value })} />
                {/* Výběr přidává lidi — k jednomu úkolu jich může být víc. */}
                <select
                  className="input w-28 shrink-0 sm:w-40"
                  value=""
                  onChange={(e) => {
                    const n = e.target.value;
                    if (n && !r.who.some((w) => sameName(w, n))) setRow(i, { who: [...r.who, n] });
                  }}
                >
                  <option value="">+ Kdo?</option>
                  {names.filter((n) => !r.who.some((w) => sameName(w, n))).map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
                {draft.rows.length > 1 && (
                  <button
                    type="button"
                    className="btn-ghost px-2"
                    aria-label={`Odebrat úkol ${i + 1}`}
                    onClick={() => setDraft({ ...draft, rows: draft.rows.filter((_, j) => j !== i) })}
                  >
                    ✕
                  </button>
                )}
              </div>
              {r.who.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {r.who.map((w) => (
                    <span key={w} className="chip inline-flex items-center gap-1">
                      {w}
                      <button
                        type="button"
                        onClick={() => setRow(i, { who: r.who.filter((x) => x !== w) })}
                        className="opacity-70 hover:opacity-100"
                        aria-label={`Odebrat ${w}`}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
          <button type="button" className="btn-ghost" onClick={() => setDraft({ ...draft, rows: [...draft.rows, { text: "", who: [] }] })}>
            + Další úkol
          </button>
        </div>
      )}
    </div>
  );
}

// Krátký popisek prioritizace pro tlačítko (Všichni / názvy rolí + jména lidí).
function priorityLabel(p: { all: boolean; roles: string[]; people: string[] }): string {
  if (p.all) return "všichni";
  const parts = p.roles.map((rid) => roleById(rid)?.name ?? rid).concat(p.people);
  return parts.join(", ") || "nikdo";
}

// Středový modal „Pro koho prioritizovat?" — všichni / role (víc) / lidé (víc).
function PriorityModal({
  open,
  onClose,
  value,
  onChange,
  members,
}: {
  open: boolean;
  onClose: () => void;
  value: { all: boolean; roles: string[]; people: string[] };
  onChange: (v: { all: boolean; roles: string[]; people: string[] }) => void;
  members: { id: string; name: string }[];
}) {
  const toggleRole = (rid: string) =>
    onChange({ ...value, all: false, roles: value.roles.includes(rid) ? value.roles.filter((r) => r !== rid) : [...value.roles, rid] });
  const addPerson = (name: string) => {
    if (name && !value.people.some((p) => sameName(p, name))) onChange({ ...value, all: false, people: [...value.people, name] });
  };
  const removePerson = (name: string) => onChange({ ...value, people: value.people.filter((p) => p !== name) });
  return (
    <Modal open={open} onClose={onClose} title="📣 Pro koho zpráva svítí?">
      <div className="space-y-4">
        <p className="text-sm text-ink-soft">Vybraným bude zpráva blikat v Moje agendě, dokud si ji nepřečtou.</p>

        {/* Všichni */}
        <button
          type="button"
          onClick={() => onChange({ all: !value.all, roles: [], people: [] })}
          className={`flex w-full items-center gap-2 rounded-xl border-2 px-3 py-2.5 text-sm font-semibold transition ${
            value.all ? "border-marigold-500 bg-marigold-50 text-marigold-700" : "border-ink/15 text-ink hover:bg-ink/5"
          }`}
        >
          <span className={`grid h-5 w-5 place-items-center rounded-full border-2 text-[11px] ${value.all ? "border-marigold-500 bg-marigold-500 text-white" : "border-ink/30"}`}>
            {value.all ? "✓" : ""}
          </span>
          👥 Všichni
        </button>

        {/* Role / týmy */}
        <div>
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-ink-soft">Týmy / role</p>
          <div className="flex flex-wrap gap-1.5">
            {ROLES.map((r) => {
              const on = value.roles.includes(r.id);
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => toggleRole(r.id)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium ring-1 transition ${
                    on ? "bg-marigold-500 text-white ring-marigold-500" : "text-ink-soft ring-ink/15 hover:bg-ink/5"
                  }`}
                >
                  {r.emoji} {r.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Konkrétní lidé */}
        <div>
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-ink-soft">Konkrétní lidé</p>
          {value.people.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-1.5">
              {value.people.map((p) => (
                <span key={p} className="chip inline-flex items-center gap-1">
                  {p}
                  <button type="button" onClick={() => removePerson(p)} className="opacity-70 hover:opacity-100" aria-label={`Odebrat ${p}`}>
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
          <select
            className="input"
            value=""
            onChange={(e) => {
              addPerson(e.target.value);
              e.target.value = "";
            }}
          >
            <option value="">+ Přidat člověka…</option>
            {members
              .filter((m) => !value.people.some((p) => sameName(p, m.name)))
              .map((m) => (
                <option key={m.id} value={m.name}>
                  {m.name}
                </option>
              ))}
          </select>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <button className="btn-ghost flex-1" onClick={() => onChange({ all: false, roles: [], people: [] })}>
            Zrušit prioritu
          </button>
          <button className="btn-primary flex-1" onClick={onClose}>
            Hotovo
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default function NastenkaPage() {
  const { currentYear, me, dispatch, configured } = useStore();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [pinned, setPinned] = useState(false);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  // Přiložené obrázky k novému příspěvku — nahrají se hned, ukládáme si id + náhled.
  const [photos, setPhotos] = useState<{ id: string; url: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [pollDraft, setPollDraft] = useState<PollDraft>(emptyPoll);
  const [taskDraft, setTaskDraft] = useState<TaskDraft>(emptyTasks);
  // Prioritní zpráva — komu má „svítit" v Moje agendě (všichni / role / lidé).
  const [priority, setPriority] = useState<{ all: boolean; roles: string[]; people: string[] }>({ all: false, roles: [], people: [] });
  const [priorityOpen, setPriorityOpen] = useState(false);
  const hasPriority = priority.all || priority.roles.length > 0 || priority.people.length > 0;
  // Když přijdeme z ankety přes ?post=<id>, doscrollujeme a příspěvek na chvíli zvýrazníme.
  const [highlightPost, setHighlightPost] = useState<string | null>(null);
  // „Něco nového na nástěnce" (okno v layoutu) sem po zavření pošle id příspěvků
  // k probliknutí — bliknou červeně ~3 s (viz sessionStorage níže).
  const [flashIds, setFlashIds] = useState<Set<string>>(() => new Set());

  async function onPickPhotos(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (!files.length) return;
    setUploading(true);
    try {
      for (const file of files) {
        const url = await compressImage(file);
        const id = uid("pp_");
        const ok = await saveReceipt(id, url, configured);
        if (ok) setPhotos((prev) => [...prev, { id, url }]);
      }
    } catch {
      /* nepovedlo se — přeskočíme */
    } finally {
      setUploading(false);
    }
  }
  async function removePhoto(id: string) {
    await deleteReceipt(id, configured).catch(() => {});
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  }

  const year = currentYear;

  // Jména z týmu pro našeptávač u „Kdo?" v úkolech (bez duplikátů, abecedně).
  const memberNames = useMemo(
    () => [...new Set((year?.members ?? []).map((m) => m.name.trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b, "cs")),
    [year],
  );

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

  const openPolls = year?.polls.filter((p) => !isPollClosed(p)).length ?? 0;
  const myTasks = year?.tasks.filter((t) => !t.done && (assigneeHas(t.assignee, me) || !t.assignee)).length ?? 0;
  const myShifts = (year?.shifts ?? []).filter((s) => s.people.includes(me)).length;

  const contribInPool = (year?.contributions ?? []).filter((c) => !c.returned).reduce((s, c) => s + c.amount, 0);
  const bilance = (year?.finances ?? []).reduce((s, f) => s + (f.kind === "prijem" ? f.amount : -f.amount), 0) + contribInPool;
  const hasFinance = (year?.finances ?? []).length > 0 || (year?.contributions ?? []).length > 0;

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("post");
    if (!id) return;
    const t = setTimeout(() => {
      setHighlightPost(id);
      document.getElementById(`post-${id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 80);
    const clear = setTimeout(() => setHighlightPost(null), 2600);
    return () => {
      clearTimeout(t);
      clearTimeout(clear);
    };
  }, [year?.id]);

  // Otevření prioritní zprávy z Moje agendy — doscrolluje a červeně ji ohraničí (~2,6 s).
  function openPost(id: string) {
    setHighlightPost(id);
    setTimeout(() => document.getElementById(`post-${id}`)?.scrollIntoView({ behavior: "smooth", block: "center" }), 60);
    setTimeout(() => setHighlightPost(null), 2600);
  }

  // Po zavření okna „něco nového na nástěnce" (v layoutu) sem přijdou id
  // nových příspěvků — bliknou červeně ohraničené ~3 s a první se doscrolluje.
  const yearId = year?.id;
  useEffect(() => {
    if (!yearId) return;
    let ids: string[] = [];
    try {
      const k = `marena_board_flash_${yearId}`;
      const raw = sessionStorage.getItem(k);
      if (raw) {
        ids = JSON.parse(raw);
        sessionStorage.removeItem(k);
      }
    } catch {
      /* ignore */
    }
    if (!ids.length) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFlashIds(new Set(ids));
    const scroll = setTimeout(() => document.getElementById(`post-${ids[0]}`)?.scrollIntoView({ behavior: "smooth", block: "center" }), 120);
    const clear = setTimeout(() => setFlashIds(new Set()), 3000);
    return () => {
      clearTimeout(scroll);
      clearTimeout(clear);
    };
  }, [yearId]);

  if (!year) return null;

  async function submit() {
    if (!title.trim() || !year) return;
    // Volitelná anketa — buď připojíme existující, nebo založíme novou.
    const choice = resolvePoll(pollDraft);
    let pollId: string | undefined;
    if (choice?.kind === "existing") {
      pollId = choice.id;
    } else if (choice?.kind === "new") {
      pollId = uid("v_");
      await dispatch({ type: "addPoll", yearId: year.id, author: me, question: choice.question, options: choice.options, multi: choice.multi, id: pollId });
    }
    // Příspěvek s vlastním id, ať na něj mohou úkoly navázat (fromPostId).
    const postId = uid("p_");
    await dispatch({
      type: "addPost",
      yearId: year.id,
      id: postId,
      author: me,
      title,
      body,
      pinned,
      photoIds: photos.map((p) => p.id),
      pollId,
      priority: hasPriority ? { all: priority.all, roles: priority.all ? [] : priority.roles, people: priority.all ? [] : priority.people } : undefined,
    });
    // Volitelné úkoly — propíšou se do sekce Úkoly a zůstanou navázané na příspěvek.
    const tasks = resolveTasks(taskDraft);
    for (const tk of tasks) {
      await dispatch({ type: "addTask", yearId: year.id, title: tk.text, assignee: tk.who || undefined, fromPostId: postId });
    }
    setTitle("");
    setBody("");
    setPinned(false);
    setPhotos([]);
    setPollDraft(emptyPoll);
    setTaskDraft(emptyTasks);
    setPriority({ all: false, roles: [], people: [] });
    setOpen(false);
    flash(tasks.length ? `Příspěvek přidán · ${tasks.length} úkol${tasks.length > 1 ? "y" : ""} v Úkolech` : choice ? "Příspěvek i anketa přidány" : "Příspěvek přidán", tasks.length ? "✅" : choice ? "🗳️" : "📌");
  }

  return (
    <div className="space-y-6">
      <Onboarding />
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="min-w-0 space-y-5">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-[28px] font-bold uppercase tracking-tight">Nástěnka</h1>
          </div>
          <button className="btn-primary" onClick={() => setOpen((v) => !v)}>
            {open ? "Zavřít" : "+ Přidat info"}
          </button>
        </div>

        {/* Osobní rozcestník podle rolí — každý má svoje věci na jeden ťuk */}
        <MyAgenda onOpenPost={openPost} />

        {open && (
          <div className="card space-y-3 p-4">
            <input className="input" placeholder="Nadpis (např. Fléda potvrzena na 4.10.)" value={title} onChange={(e) => setTitle(e.target.value)} />
            <textarea className="input min-h-24" placeholder="Co potřebují ostatní vědět?" value={body} onChange={(e) => setBody(e.target.value)} />

            {/* Přílohy — obrázky */}
            {photos.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {photos.map((p) => (
                  <div key={p.id} className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.url} alt="příloha" className="h-20 w-20 rounded-lg object-cover ring-1 ring-ink/10" />
                    <button
                      type="button"
                      onClick={() => removePhoto(p.id)}
                      className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-ink text-xs text-white shadow"
                      aria-label="Odebrat obrázek"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
            <label className="inline-flex w-fit cursor-pointer items-center gap-1.5 rounded-full bg-paper2 px-3 py-1.5 text-sm font-medium text-ink-soft ring-1 ring-ink/10 transition hover:bg-ink/5">
              <span>📷</span> {uploading ? "Nahrávám…" : "Přidat obrázek"}
              <input type="file" accept="image/*" multiple className="hidden" onChange={onPickPhotos} disabled={uploading} />
            </label>

            <PollComposer draft={pollDraft} setDraft={setPollDraft} polls={year.polls} />
            <TaskComposer draft={taskDraft} setDraft={setTaskDraft} names={memberNames} />

            {/* Prioritizace — komu má zpráva „svítit" v Moje agendě */}
            <button
              type="button"
              onClick={() => setPriorityOpen(true)}
              className={`flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium ring-1 transition ${
                hasPriority ? "bg-marigold-50 text-marigold-700 ring-marigold-500/40" : "bg-paper2/60 text-ink-soft ring-ink/10 hover:bg-ink/5"
              }`}
            >
              <span>📣</span>
              <span className="min-w-0 flex-1 text-left">
                {hasPriority ? `Prioritní pro: ${priorityLabel(priority)}` : "Prioritizovat zprávu (komu má svítit)"}
              </span>
              <span className="shrink-0 text-xs font-semibold">{hasPriority ? "Změnit" : "Nastavit"}</span>
            </button>

            <div className="flex flex-wrap items-center gap-3">
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

        <PriorityModal
          open={priorityOpen}
          onClose={() => setPriorityOpen(false)}
          value={priority}
          onChange={setPriority}
          members={year.members}
        />

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
              <PostCard key={p.id} post={p} yearId={year.id} highlight={highlightPost === p.id} flash={flashIds.has(p.id)} />
            ))}
          </div>
        )}
      </div>

      <aside className="min-w-0 space-y-4">
        <WidgetLinks openPolls={openPolls} myTasks={myTasks} myShifts={myShifts} />
        {hasFinance && (
          <Link href="/zazemi/finance" className="card block p-4 transition hover:border-ink/10">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-base font-semibold">💰 Bilance</h2>
              <span className="text-xs font-medium text-gold-700">detail →</span>
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
            <Link href="/zazemi/kalendar" className="text-xs font-medium text-gold-700 hover:underline">
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
          className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-gold-700 hover:underline"
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? "Sbalit" : "Zobrazit celé"}
          <Icon name="chevron" className={`h-3.5 w-3.5 transition-transform ${expanded ? "rotate-180" : ""}`} />
        </button>
      )}
    </div>
  );
}

// Obrázky u příspěvku — načtou se přes loadReceipt (blob), klik zvětší na celou obrazovku.
function PostPhotos({ ids }: { ids: string[] }) {
  const { configured } = useStore();
  const [urls, setUrls] = useState<Record<string, string>>({});
  const [viewIdx, setViewIdx] = useState<number | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      for (const id of ids) {
        const url = await loadReceipt(id, configured);
        if (alive && url) setUrls((prev) => (prev[id] ? prev : { ...prev, [id]: url }));
      }
    })();
    return () => {
      alive = false;
    };
  }, [ids, configured]);

  const ready = ids.map((id) => urls[id]).filter(Boolean) as string[];
  if (ready.length === 0) return null;
  return (
    <>
      <div className="mt-2 flex flex-wrap gap-2">
        {ready.map((url, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={i}
            src={url}
            alt={`obrázek ${i + 1}`}
            onClick={() => setViewIdx(i)}
            className="h-24 w-24 cursor-zoom-in rounded-lg object-cover ring-1 ring-ink/10 transition hover:opacity-90"
          />
        ))}
      </div>
      <ImageViewer images={ready} index={viewIdx} onIndex={setViewIdx} />
    </>
  );
}

function PostCard({ post: p, yearId, highlight, flash: flashNew }: { post: Post; yearId: string; highlight?: boolean; flash?: boolean }) {
  const { me, dispatch, configured, currentYear } = useStore();
  const [edit, setEdit] = useState(false);
  const [showEdits, setShowEdits] = useState(false);
  const [title, setTitle] = useState(p.title);
  const [body, setBody] = useState(p.body);
  const [photos, setPhotos] = useState<{ id: string; url: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [pollDraft, setPollDraft] = useState<PollDraft>(emptyPoll);
  const [taskDraft, setTaskDraft] = useState<TaskDraft>(emptyTasks);
  // Připojená anketa (pokud existuje) — kvůli tlačítku „Hlasování".
  const poll = p.pollId ? currentYear?.polls.find((pl) => pl.id === p.pollId) : undefined;
  // Úkoly navázané na tenhle příspěvek (přes fromPostId) — checklist rovnou na nástěnce.
  const postTasks = (currentYear?.tasks ?? []).filter((t) => t.fromPostId === p.id);
  // Delší seznam úkolů (nad 3) se sbalí za klikací šipku; po rozbalení se roluje.
  const [tasksOpen, setTasksOpen] = useState(postTasks.length <= 3);
  // Všechny úkoly příspěvku hotové → příspěvek se rozsvítí zeleně.
  const allTasksDone = postTasks.length > 0 && postTasks.every((t) => t.done);
  // Moje úkoly z tohoto příspěvku (podle jména). Dokud mám nějaký nesplněný,
  // bliká mi celá zpráva červeně dokola; jakmile mám všechny hotové, blik zhasne
  // a ukáže se pochvala. (Odškrtává se v Úkolech, tady je to jen náhled.)
  const myPostTasks = postTasks.filter((t) => assigneeHas(t.assignee, me));
  const myUndone = myPostTasks.filter((t) => !t.done).length;
  const myAllDone = myPostTasks.length > 0 && myUndone === 0;
  // Červené blikající ohraničení: moje nesplněné úkoly, nebo nový příspěvek (3 s).
  const blink = myUndone > 0 || !!flashNew;
  // Jména z týmu pro našeptávač u „Kdo?".
  const memberNames = [...new Set((currentYear?.members ?? []).map((m) => m.name.trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b, "cs"));
  // Historie úprav (nová), s fallbackem na stará data (jen poslední úprava).
  const edits = p.edits ?? (p.editedBy && p.editedAt ? [{ by: p.editedBy, at: p.editedAt }] : []);
  const canEdit = true; // úpravu nástěnky smí každý (kdo má přístup do zázemí)
  const canDelete = isAdmin(me); // mazat smí jen správce (Mařena)
  const role = roleById(p.roleId);

  async function startEdit() {
    setTitle(p.title);
    setBody(p.body);
    setPollDraft(emptyPoll);
    setTaskDraft(emptyTasks);
    // Načti existující obrázky, ať je jde v úpravě vidět, odebrat i doplnit.
    const existing: { id: string; url: string }[] = [];
    for (const id of p.photoIds ?? []) {
      const url = await loadReceipt(id, configured);
      if (url) existing.push({ id, url });
    }
    setPhotos(existing);
    setEdit(true);
  }
  async function onPickPhotos(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (!files.length) return;
    setUploading(true);
    try {
      for (const file of files) {
        const url = await compressImage(file);
        const id = uid("pp_");
        const ok = await saveReceipt(id, url, configured);
        if (ok) setPhotos((prev) => [...prev, { id, url }]);
      }
    } catch {
      /* přeskočíme */
    } finally {
      setUploading(false);
    }
  }
  // Odebrání jen ze seznamu (blob nemažeme hned — kdyby uživatel dal Zrušit).
  const removePhoto = (id: string) => setPhotos((prev) => prev.filter((x) => x.id !== id));

  async function save() {
    if (!title.trim()) return;
    // Anketu jde doplnit jen když žádná ŽIVÁ připojená není. Pokud byla připojená
    // anketa mezitím smazána (mrtvý odkaz), odpojíme ji.
    const patch: { title: string; body: string; photoIds: string[]; pollId?: string } = {
      title,
      body,
      photoIds: photos.map((x) => x.id),
    };
    if (!poll) {
      const choice = resolvePoll(pollDraft);
      if (choice?.kind === "existing") {
        patch.pollId = choice.id;
      } else if (choice?.kind === "new" && currentYear) {
        const pollId = uid("v_");
        await dispatch({ type: "addPoll", yearId, author: me, question: choice.question, options: choice.options, multi: choice.multi, id: pollId });
        patch.pollId = pollId;
      } else if (p.pollId) {
        patch.pollId = ""; // odkaz na smazanou anketu → odpojit
      }
    }
    await dispatch({ type: "updatePost", yearId, postId: p.id, editedBy: me, patch });
    // Nově dopsané úkoly se navážou na tenhle příspěvek a objeví se v Úkolech.
    const newTasks = resolveTasks(taskDraft);
    for (const tk of newTasks) {
      await dispatch({ type: "addTask", yearId, title: tk.text, assignee: tk.who || undefined, fromPostId: p.id });
    }
    setEdit(false);
    if (patch.pollId) flash("Anketa připojena k příspěvku", "🗳️");
    else if (newTasks.length) flash(`Přidáno ${newTasks.length} úkol${newTasks.length > 1 ? "y" : ""}`, "✅");
  }

  if (edit) {
    return (
      <article className="card space-y-3 p-4 ring-2 ring-gold-200">
        <input className="input" placeholder="Nadpis" value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
        <textarea className="input min-h-24" placeholder="Co potřebují ostatní vědět?" value={body} onChange={(e) => setBody(e.target.value)} />

        {/* Existující úkoly z příspěvku — jen náhled + smazání; odškrtává se v Úkolech */}
        {postTasks.length > 0 && (
          <ul className="space-y-1 rounded-xl bg-paper2/50 p-3 ring-1 ring-ink/10">
            {postTasks.map((t) => (
              <li key={t.id} className="flex items-center gap-2">
                <span
                  aria-hidden
                  className={`grid h-4 w-4 shrink-0 place-items-center rounded-[5px] border text-[11px] font-bold leading-none ${
                    t.done ? "border-leaf bg-leaf text-white" : "border-ink/30 bg-white"
                  }`}
                >
                  {t.done ? "✓" : ""}
                </span>
                <span className={`min-w-0 flex-1 text-sm ${t.done ? "text-ink-soft line-through" : "font-medium"}`}>
                  {t.title}
                  {t.assignee ? <span className="text-ink-soft"> — {t.assignee}</span> : null}
                </span>
                <button type="button" className="btn-ghost px-2 py-0.5 text-xs" onClick={() => dispatch({ type: "removeTask", yearId, taskId: t.id })}>
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Obrázky — existující i nově přidané */}
        {photos.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {photos.map((ph) => (
              <div key={ph.id} className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={ph.url} alt="příloha" className="h-20 w-20 rounded-lg object-cover ring-1 ring-ink/10" />
                <button
                  type="button"
                  onClick={() => removePhoto(ph.id)}
                  className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-ink text-xs text-white shadow"
                  aria-label="Odebrat obrázek"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
        <label className="inline-flex w-fit cursor-pointer items-center gap-1.5 rounded-full bg-paper2 px-3 py-1.5 text-sm font-medium text-ink-soft ring-1 ring-ink/10 transition hover:bg-ink/5">
          <span>📷</span> {uploading ? "Nahrávám…" : "Přidat obrázek"}
          <input type="file" accept="image/*" multiple className="hidden" onChange={onPickPhotos} disabled={uploading} />
        </label>

        {poll ? (
          <p className="rounded-xl bg-paper2/60 px-3 py-2 text-sm text-ink-soft ring-1 ring-ink/10">
            🗳️ Anketa je k příspěvku připojena: „{poll.question}“. Upravit ji můžeš v sekci Hlasování.
          </p>
        ) : (
          <PollComposer draft={pollDraft} setDraft={setPollDraft} polls={currentYear?.polls ?? []} />
        )}
        <TaskComposer draft={taskDraft} setDraft={setTaskDraft} names={memberNames} title={postTasks.length ? "✅ Přidat další úkol" : "✅ Přidat úkol (propíše se do sekce Úkoly)"} />

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
    <article
      id={`post-${p.id}`}
      className={`card scroll-mt-24 p-4 transition-shadow ${
        blink
          ? "readonly-pulse border-2 border-red-500"
          : highlight
            ? "ring-2 ring-red-500 shadow-[0_0_0_4px_rgba(239,68,68,0.3)]"
            : allTasksDone
              ? "border-leaf/50 bg-leaf/[0.05] ring-1 ring-leaf/40"
              : p.pinned
                ? "ring-1 ring-gold-300"
                : ""
      }`}
    >
      <div className="mb-1 flex flex-wrap items-start gap-x-2 gap-y-1 text-xs text-ink-soft">
        {p.pinned && <span className="chip bg-gold-500 text-[#1d1d1f]">📌 Připnuto</span>}
        {role && (
          <span className="chip">
            {role.emoji} {role.name}
          </span>
        )}
        <div className="ml-auto text-right leading-tight">
          <div className="whitespace-nowrap">
            založil(a): <span className="font-medium text-ink">{p.author}</span> · {fmtDateTime(p.createdAt)}
          </div>
          {edits.length > 0 &&
            (showEdits ? (
              <>
                <div className="mt-1 max-h-24 space-y-0.5 overflow-auto rounded-lg bg-paper2/70 px-2 py-1.5 text-left">
                  {edits.map((e, i) => (
                    <div key={i} className="whitespace-nowrap">
                      upravil(a): <span className="font-medium text-ink">{e.by}</span> · {fmtDateTime(e.at)}
                    </div>
                  ))}
                </div>
                <button onClick={() => setShowEdits(false)} className="font-medium text-gold-700 hover:underline">
                  zobrazit méně
                </button>
              </>
            ) : (
              <button onClick={() => setShowEdits(true)} className="font-medium text-gold-700 hover:underline">
                zobrazit více ({edits.length})
              </button>
            ))}
        </div>
      </div>
      <h3 className="break-words font-display text-[20px] font-semibold">{p.title}</h3>
      {p.body && <PostBody body={p.body} />}
      {/* Úkoly z příspěvku — jen náhled; odškrtává se v sekci Úkoly (tady se needituje) */}
      {postTasks.length > 0 && (
        <div className={`mt-3 rounded-xl p-3 ring-1 ${allTasksDone ? "bg-leaf/10 ring-leaf/40" : "bg-paper2/50 ring-ink/10"}`}>
          <div className="mb-1.5 flex items-center justify-between gap-2">
            {/* Klikací šipka: rozbalí/sbalí seznam úkolů (dlouhý seznam nebobtná přes obrazovku). */}
            <button
              type="button"
              onClick={() => setTasksOpen((v) => !v)}
              aria-expanded={tasksOpen}
              className={`flex min-w-0 items-center gap-1 text-xs font-semibold uppercase tracking-wide ${allTasksDone ? "text-leaf-700" : "text-ink-soft"}`}
            >
              <span aria-hidden className={`shrink-0 text-[10px] transition-transform ${tasksOpen ? "rotate-0" : "-rotate-90"}`}>▼</span>
              {allTasksDone ? "✅ Hotovo" : "✅ Úkoly"} ({postTasks.filter((t) => t.done).length}/{postTasks.length})
            </button>
            <Link href="/zazemi/ukoly" className="shrink-0 text-xs font-medium text-gold-700 hover:underline">
              Odškrtnout v Úkolech →
            </Link>
          </div>
          {tasksOpen ? (
            <ul className={`space-y-1 ${postTasks.length > 3 ? "max-h-20 overflow-y-auto overscroll-contain pr-1" : ""}`}>
              {postTasks.map((t) => (
                <li key={t.id} className="flex items-center gap-2">
                  <span
                    aria-hidden
                    className={`grid h-4 w-4 shrink-0 place-items-center rounded-[5px] border text-[11px] font-bold leading-none ${
                      t.done ? "border-leaf bg-leaf text-white" : "border-ink/30 bg-white"
                    }`}
                  >
                    {t.done ? "✓" : ""}
                  </span>
                  <span className={`min-w-0 flex-1 text-sm ${t.done ? "text-ink-soft line-through" : "font-medium"}`}>
                    {t.title}
                    {t.assignee ? <span className="text-ink-soft"> — {t.assignee}</span> : null}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <button type="button" onClick={() => setTasksOpen(true)} className="text-xs font-medium text-gold-700 hover:underline">
              Zobrazit {postTasks.length} úkolů ▼
            </button>
          )}
          {/* Když mám všechny svoje úkoly z příspěvku hotové → pochvala (blik zhasne). */}
          {myAllDone && tasksOpen && (
            <p className="mt-2 rounded-lg bg-leaf/15 px-2.5 py-1.5 text-xs font-semibold text-leaf-700">
              🎉 Splnil(a) jsi zatím všechny dosavadní úkoly z tohoto příspěvku.
            </p>
          )}
        </div>
      )}
      {p.photoIds && p.photoIds.length > 0 && <PostPhotos ids={p.photoIds} />}
      {poll && (
        <div className="mt-3 flex items-center gap-2 rounded-xl bg-gold-50 px-3 py-2 ring-1 ring-gold-200">
          <span className="min-w-0 flex-1 truncate text-sm font-medium text-ink">🗳️ {poll.question}</span>
          <Link href={`/zazemi/hlasovani?poll=${poll.id}`} className="btn-primary shrink-0 px-3 py-1.5 text-xs font-bold uppercase tracking-wide">
            HLASOVAT
          </Link>
        </div>
      )}
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
      <Link href="/zazemi/hlasovani" className="card p-3 transition hover:border-gold-300">
        <Icon name="vote" className="h-4 w-4 text-gold-600" />
        <div className="mt-1 text-2xl font-bold text-gold-700">{openPolls}</div>
        <div className="text-xs text-ink-soft">anket</div>
      </Link>
      <Link href="/zazemi/ukoly" className="card p-3 transition hover:border-gold-300">
        <Icon name="tasks" className="h-4 w-4 text-plum-600" />
        <div className="mt-1 text-2xl font-bold text-plum-600">{myTasks}</div>
        <div className="text-xs text-ink-soft">úkolů</div>
      </Link>
      <Link href="/zazemi/provoz" className="card p-3 transition hover:border-gold-300">
        <Icon name="ops" className="h-4 w-4 text-gold-600" />
        <div className="mt-1 text-2xl font-bold text-gold-700">{myShifts}</div>
        <div className="text-xs text-ink-soft">směn</div>
      </Link>
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <div className="card grid place-items-center p-10 text-center text-sm text-ink-soft">{children}</div>;
}
