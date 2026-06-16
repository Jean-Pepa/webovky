"use client";

import { useState } from "react";
import { useStore, type ConsultationNote, type ConsultationStatus } from "@/lib/store";
import { ROLE_LABELS, ROLE_INITIALS } from "@/lib/access";
import { formatDate } from "@/lib/format";
import { IconUsers, IconPlus, IconTrash } from "@/components/Icons";

const STATUS_TEXT: Record<ConsultationStatus, string> = {
  OPEN: "text-stone-500",
  WAITING: "text-amber-600",
  RESOLVED: "text-emerald-600",
};
const STATUS_CARD: Record<ConsultationStatus, string> = {
  OPEN: "border-stone-200",
  WAITING: "border-amber-200 bg-amber-50/30",
  RESOLVED: "border-emerald-200 bg-emerald-50/30",
};

export function ConsultationSection({
  propertyId,
  consultations,
}: {
  propertyId: string;
  consultations: ConsultationNote[];
}) {
  const { addConsultation, deleteConsultation, setConsultationStatus, role } = useStore();
  const [open, setOpen] = useState(false);

  const sorted = [...consultations].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

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
    <section className="card mt-8 p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <IconUsers className="h-4 w-4 text-teal-700" />
          <h2 className="text-sm font-semibold text-stone-900">Konzultace</h2>
          {consultations.length > 0 && (
            <span className="text-xs text-stone-400">· {consultations.length}</span>
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
            return (
              <li key={c.id} className={`rounded-xl border p-3.5 ${STATUS_CARD[status]}`}>
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
                        {c.topic ? ` · ${c.topic}` : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <select
                      value={status}
                      onChange={(e) =>
                        setConsultationStatus(propertyId, c.id, e.target.value as ConsultationStatus)
                      }
                      className={`rounded-md border border-stone-200 bg-white px-2 py-1 text-xs font-medium ${STATUS_TEXT[status]}`}
                      aria-label="Stav konzultace"
                    >
                      <option value="OPEN">Otevřeno</option>
                      <option value="WAITING">Čeká na klienta</option>
                      <option value="RESOLVED">Vyřešeno</option>
                    </select>
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
