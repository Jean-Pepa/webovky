"use client";

import { useState } from "react";
import { useStore, type ChatMessage } from "@/lib/store";
import { ROLE_LABELS, ROLE_INITIALS } from "@/lib/access";
import { IconUsers, IconClose } from "@/components/Icons";

function fmt(iso: string) {
  const d = new Date(iso);
  return new Intl.DateTimeFormat("cs-CZ", {
    day: "numeric",
    month: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export function ChatSection({
  propertyId,
  messages,
}: {
  propertyId: string;
  messages: ChatMessage[];
}) {
  const { addChatMessage, deleteChatMessage, role } = useStore();
  const [text, setText] = useState("");

  const sorted = [...messages].sort((a, b) => a.createdAt.localeCompare(b.createdAt));

  function send(e: React.FormEvent) {
    e.preventDefault();
    const t = text.trim();
    if (!t) return;
    addChatMessage(propertyId, t);
    setText("");
  }

  return (
    <section className="card mt-6 p-5">
      <div className="flex items-center gap-2">
        <IconUsers className="h-4 w-4 text-teal-700" />
        <h2 className="text-sm font-semibold text-stone-900">Chat</h2>
        {messages.length > 0 && <span className="text-xs text-stone-400">· {messages.length}</span>}
      </div>

      <div className="mt-3 max-h-96 space-y-3 overflow-y-auto pr-1">
        {sorted.length === 0 ? (
          <p className="py-4 text-center text-sm text-stone-500">
            Zatím žádné zprávy. Napište první — architekt, klient i další tu spolu komunikují.
          </p>
        ) : (
          sorted.map((m) => {
            const mine = m.authorRole === role;
            return (
              <div key={m.id} className={`group flex gap-2 ${mine ? "flex-row-reverse" : ""}`}>
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-teal-700 text-[11px] font-semibold text-white">
                  {ROLE_INITIALS[m.authorRole]}
                </span>
                <div className={`max-w-[80%] ${mine ? "text-right" : ""}`}>
                  <p className="text-xs text-stone-400">
                    {ROLE_LABELS[m.authorRole]} · {fmt(m.createdAt)}
                  </p>
                  <div className="mt-0.5 flex items-center gap-1.5">
                    {mine && (
                      <button
                        onClick={() => deleteChatMessage(propertyId, m.id)}
                        className="text-stone-300 opacity-0 transition hover:text-red-500 group-hover:opacity-100"
                        aria-label="Smazat zprávu"
                      >
                        <IconClose className="h-3.5 w-3.5" />
                      </button>
                    )}
                    <span
                      className={`inline-block whitespace-pre-wrap rounded-2xl px-3 py-2 text-left text-sm ${
                        mine ? "bg-teal-700 text-white" : "bg-stone-100 text-stone-800"
                      }`}
                    >
                      {m.text}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <form onSubmit={send} className="mt-3 flex gap-2 border-t border-stone-100 pt-3">
        <input
          className="input flex-1"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Napište zprávu…"
        />
        <button type="submit" className="btn-primary shrink-0">
          Odeslat
        </button>
      </form>
    </section>
  );
}
