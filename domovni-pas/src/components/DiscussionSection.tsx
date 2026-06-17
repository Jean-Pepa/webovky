"use client";

import { useState } from "react";
import { useStore, type DiscussionThread } from "@/lib/store";
import { ROLE_LABELS } from "@/lib/access";
import { formatDate } from "@/lib/format";
import { IconPlus, IconTrash } from "@/components/Icons";

export function DiscussionSection({
  propertyId,
  threads,
}: {
  propertyId: string;
  threads: DiscussionThread[];
}) {
  const { addDiscussionThread, deleteDiscussionThread, role } = useStore();
  const manage = role === "CREATOR";
  const [open, setOpen] = useState(false);

  const sorted = [...threads].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const title = String(fd.get("title") || "").trim();
    const text = String(fd.get("text") || "").trim();
    if (!title) return;
    addDiscussionThread(propertyId, title, text);
    e.currentTarget.reset();
    setOpen(false);
  }

  return (
    <section className="card p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-stone-900">Diskuze</h2>
          {threads.length > 0 && <span className="text-xs text-stone-400">· {threads.length}</span>}
        </div>
        <button onClick={() => setOpen((o) => !o)} className="btn-ghost btn-sm text-teal-700">
          <IconPlus className="h-4 w-4" />
          Nové téma
        </button>
      </div>

      {open && (
        <form onSubmit={submit} className="mt-3 space-y-2 border-b border-stone-100 pb-4">
          <input name="title" required className="input" placeholder="Název tématu" />
          <textarea name="text" className="input min-h-20" placeholder="První příspěvek (volitelné)…" />
          <button className="btn-secondary w-full" type="submit">Založit téma</button>
        </form>
      )}

      {sorted.length === 0 ? (
        !open && <p className="mt-2 text-sm text-stone-500">Zatím žádná diskuze. Založte první téma.</p>
      ) : (
        <ul className="mt-3 space-y-3">
          {sorted.map((t) => (
            <ThreadCard
              key={t.id}
              propertyId={propertyId}
              thread={t}
              canDelete={manage}
              onDelete={() => deleteDiscussionThread(propertyId, t.id)}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

function ThreadCard({
  propertyId,
  thread,
  canDelete,
  onDelete,
}: {
  propertyId: string;
  thread: DiscussionThread;
  canDelete: boolean;
  onDelete: () => void;
}) {
  const { addDiscussionPost } = useStore();
  const [text, setText] = useState("");

  function send(e: React.FormEvent) {
    e.preventDefault();
    const t = text.trim();
    if (!t) return;
    addDiscussionPost(propertyId, thread.id, t);
    setText("");
  }

  return (
    <li className="rounded-xl border border-stone-200 p-3.5">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold text-stone-900">{thread.title}</p>
        {canDelete && (
          <button
            onClick={() => {
              if (confirm("Smazat téma?")) onDelete();
            }}
            className="shrink-0 text-stone-300 hover:text-red-600"
            aria-label="Smazat"
          >
            <IconTrash className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="mt-2 space-y-2.5 border-l-2 border-stone-100 pl-3">
        {thread.posts.map((post) => (
          <div key={post.id}>
            <p className="text-xs text-stone-400">
              {ROLE_LABELS[post.authorRole]} · {formatDate(post.createdAt)}
            </p>
            <p className="whitespace-pre-wrap text-sm text-stone-700">{post.text}</p>
          </div>
        ))}
      </div>

      <form onSubmit={send} className="mt-3 flex gap-2">
        <input
          className="input flex-1"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Napsat příspěvek…"
        />
        <button type="submit" className="btn-secondary btn-sm shrink-0">Odeslat</button>
      </form>
    </li>
  );
}
