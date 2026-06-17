"use client";

import { useState } from "react";
import { useStore, type ConsultationNote, type ConsultationStatus } from "@/lib/store";
import { ROLE_LABELS, ROLE_INITIALS } from "@/lib/access";
import { formatDate } from "@/lib/format";
import { IconUsers, IconPlus, IconTrash, IconCheck } from "@/components/Icons";

const STATE: Record<ConsultationStatus, { label: string; card: string; text: string }> = {
  OPEN: { label: "Čeká na architekta", card: "border-amber-200 bg-amber-50/40", text: "text-amber-600" },
  WAITING: { label: "Čeká na klienta", card: "border-blue-200 bg-blue-50/40", text: "text-blue-600" },
  RESOLVED: { label: "Vyřešeno", card: "border-emerald-200 bg-emerald-50/40", text: "text-emerald-600" },
};

export function ConsultationSection({
  propertyId,
  consultations,
  title = "Konzultace",
}: {
  propertyId: string;
  consultations: ConsultationNote[];
  title?: string;
}) {
  const { addConsultation, deleteConsultation, setConsultationStatus, role } = useStore();
  const [open, setOpen] = useState(false);

  const sorted = [...consultations].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const important = consultations.some((c) => (c.status ?? "OPEN") !== "RESOLVED");

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const text = String(fd.get("text") || "").trim();
    if (!text) return;
    addConsultation(propertyId, {
      topic: String(fd.get("topic") || "").trim() || undefined,
      text,
    });
    form.reset();
    setOpen(false);
  }

  return (
    <section
      className={`card mt-8 p-5 transition ${
        important ? "shadow-md shadow-teal-100 ring-2 ring-teal-300/70" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <IconUsers className={`h-4 w-4 ${important ? "text-teal-600" : "text-teal-700"}`} />
          <h2 className="text-sm font-semibold text-stone-900">{title}</h2>
          {consultations.length > 0 && (
            <span className="text-xs text-stone-400">· {consultations.length}</span>
          )}
          {important && (
            <span className="relative ml-1 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-500" />
            </span>
          )}
        </div>
        <button onClick={() => setOpen((o) => !o)} className="btn-ghost btn-sm text-teal-700">
          <IconPlus className="h-4 w-4" />
          Přidat
        </button>
      </div>

      {open && (
        <form onSubmit={submit} className="mt-3 space-y-2 border-b border-stone-100 pb-4">
          <input
            name="topic"
            className="input"
            placeholder="Téma (volitelné) — např. Dispozice kuchyně"
          />
          <textarea
            name="text"
            required
            className="input min-h-24"
            placeholder="Napište poznámku nebo dotaz ke konzultaci…"
          />
          <button className="btn-secondary w-full" type="submit">
            Přidat konzultaci
          </button>
        </form>
      )}

      {sorted.length > 0 ? (
        <ul className="mt-3 space-y-3">
          {sorted.map((c) => {
            const status = c.status ?? "OPEN";
            const st = STATE[status];
            const resolved = status === "RESOLVED";
            return (
              <li key={c.id} className={`rounded-xl border p-3.5 ${st.card}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-teal-700 text-[11px] font-semibold text-white">
                      {ROLE_INITIALS[c.authorRole]}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-stone-800">
                        {ROLE_LABELS[c.authorRole]}
                      </p>
                      <p className="text-xs text-stone-400">
                        {formatDate(c.createdAt)}
                        {c.topic ? ` · ${c.topic}` : ""} ·{" "}
                        <span className={`font-medium ${st.text}`}>{st.label}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <button
                      onClick={() =>
                        setConsultationStatus(propertyId, c.id, resolved ? "OPEN" : "RESOLVED")
                      }
                      className={
                        resolved
                          ? "btn-ghost btn-sm text-emerald-600"
                          : "btn-secondary btn-sm"
                      }
                    >
                      <IconCheck className="h-4 w-4" />
                      {resolved ? "Vyřešeno" : "Vyřešit"}
                    </button>
                    <button
                      onClick={() => {
                        if (confirm("Smazat konzultaci?")) deleteConsultation(propertyId, c.id);
                      }}
                      className="btn-ghost btn-sm text-stone-400 hover:text-red-600"
                      aria-label="Smazat"
                    >
                      <IconTrash className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-stone-700">
                  {c.text}
                </p>

                {(c.replies?.length ?? 0) > 0 && (
                  <div className="mt-3 space-y-2.5 border-l-2 border-stone-100 pl-3">
                    {c.replies!.map((rep) => (
                      <div key={rep.id}>
                        <p className="text-xs text-stone-400">
                          {ROLE_LABELS[rep.authorRole]} · {formatDate(rep.createdAt)}
                        </p>
                        <p className="whitespace-pre-wrap text-sm text-stone-700">{rep.text}</p>
                      </div>
                    ))}
                  </div>
                )}

                <ReplyForm propertyId={propertyId} noteId={c.id} />
              </li>
            );
          })}
        </ul>
      ) : (
        !open && (
          <p className="mt-2 text-sm text-stone-500">
            Zatím žádné konzultace. Zapisujte si průběžné poznámky a dotazy mezi{" "}
            {role === "ARCHITECT" ? "vámi a klientem" : "vámi a architektem"}.
          </p>
        )
      )}
    </section>
  );
}

function ReplyForm({ propertyId, noteId }: { propertyId: string; noteId: string }) {
  const { addConsultationReply } = useStore();
  const [text, setText] = useState("");

  function send(e: React.FormEvent) {
    e.preventDefault();
    const t = text.trim();
    if (!t) return;
    addConsultationReply(propertyId, noteId, t);
    setText("");
  }

  return (
    <form onSubmit={send} className="mt-3 flex gap-2">
      <input
        className="input flex-1"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Odpovědět…"
      />
      <button type="submit" className="btn-secondary btn-sm shrink-0">
        Odeslat
      </button>
    </form>
  );
}
