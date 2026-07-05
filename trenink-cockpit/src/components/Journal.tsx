"use client";

import { useState } from "react";
import { useJournal } from "@/lib/store";
import type { JournalKind } from "@/lib/types";

const KIND_META: Record<JournalKind, { label: string; color: string }> = {
  note: { label: "poznámka", color: "#6b7280" },
  analysis: { label: "analýza", color: "#0071e3" },
  plan: { label: "plán", color: "#6d4bd8" },
  question: { label: "otázka", color: "#e8850c" },
};

function fmtWhen(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("cs-CZ", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

export default function Journal() {
  const { entries, loading, addEntry } = useJournal();
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  const send = async () => {
    if (!text.trim() || sending) return;
    setSending(true);
    await addEntry(text, "note", "user");
    setText("");
    setSending(false);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-line bg-card p-3">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Napiš, jak ses cítil, co tě bolí, co se povedlo… Claude to uvidí a může navázat."
          rows={3}
          className="w-full resize-none rounded-xl bg-paper px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky/30"
        />
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-ink-soft">Píšeš jako ty · Claude odpovídá analýzami</span>
          <button
            onClick={send}
            disabled={!text.trim() || sending}
            className="rounded-xl bg-sky px-4 py-2 text-sm font-semibold text-white transition enabled:hover:bg-sky-600 disabled:opacity-40"
          >
            {sending ? "…" : "Odeslat"}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-line bg-card p-8 text-center text-ink-soft">Načítám deník…</div>
      ) : entries.length === 0 ? (
        <div className="rounded-2xl border border-line bg-card p-6 text-center text-sm text-ink-soft">
          Deník je zatím prázdný. Napiš první zprávu — třeba jak se cítíš dnes.
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((e) => {
            const mine = e.author === "user";
            const km = KIND_META[e.kind];
            return (
              <div key={e.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl border p-3 ${
                    mine ? "border-sky/20 bg-sky-050" : "border-line bg-card"
                  }`}
                >
                  <div className="mb-1 flex items-center gap-2">
                    <span className="text-sm font-semibold">{mine ? "Ty" : "🤖 Claude"}</span>
                    <span
                      className="rounded-md px-1.5 py-0.5 text-[10px] font-bold"
                      style={{ background: km.color + "1a", color: km.color }}
                    >
                      {km.label}
                    </span>
                    <span className="text-[11px] text-ink-soft">{fmtWhen(e.createdAt)}</span>
                  </div>
                  <div className="whitespace-pre-wrap text-sm">{e.body}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
