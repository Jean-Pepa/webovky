"use client";

import { useState } from "react";
import { useStore, type ApprovalRequest, type ApprovalStatus } from "@/lib/store";
import { ROLE_LABELS } from "@/lib/access";
import { formatDate } from "@/lib/format";
import { IconPlus, IconTrash, IconCheck, IconClose } from "@/components/Icons";

const STATE: Record<ApprovalStatus, { label: string; badge: string }> = {
  PENDING: { label: "Čeká na schválení", badge: "bg-amber-100 text-amber-700" },
  APPROVED: { label: "Schváleno", badge: "bg-emerald-100 text-emerald-700" },
  REJECTED: { label: "Zamítnuto", badge: "bg-rose-100 text-rose-700" },
};

export function ApprovalsSection({
  propertyId,
  approvals,
}: {
  propertyId: string;
  approvals: ApprovalRequest[];
}) {
  const { addApproval, setApprovalStatus, deleteApproval, role } = useStore();
  const manage = role === "CREATOR";
  const [open, setOpen] = useState(false);

  const sorted = [...approvals].sort((a, b) => {
    const rank = (s: ApprovalStatus) => (s === "PENDING" ? 0 : 1);
    return rank(a.status) - rank(b.status) || b.createdAt.localeCompare(a.createdAt);
  });

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const title = String(fd.get("title") || "").trim();
    if (!title) return;
    const amount = Number(fd.get("amount"));
    addApproval(propertyId, {
      title,
      description: String(fd.get("description") || "").trim() || undefined,
      amount: Number.isFinite(amount) && amount > 0 ? amount : undefined,
    });
    e.currentTarget.reset();
    setOpen(false);
  }

  return (
    <section className="card p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <IconCheck className="h-4 w-4 text-teal-700" />
          <h2 className="text-sm font-semibold text-stone-900">Požadavky ke schválení</h2>
          {approvals.length > 0 && <span className="text-xs text-stone-400">· {approvals.length}</span>}
        </div>
        <button onClick={() => setOpen((o) => !o)} className="btn-ghost btn-sm text-teal-700">
          <IconPlus className="h-4 w-4" />
          Nový požadavek
        </button>
      </div>

      {open && (
        <form onSubmit={submit} className="mt-3 space-y-2 border-b border-stone-100 pb-4">
          <input name="title" required className="input" placeholder="Název požadavku" />
          <textarea name="description" className="input min-h-20" placeholder="Popis (nabídka, rozsah prací…)" />
          <input name="amount" type="number" min="0" step="1" className="input" placeholder="Částka (Kč, volitelné)" />
          <button className="btn-secondary w-full" type="submit">Odeslat požadavek</button>
        </form>
      )}

      {sorted.length === 0 ? (
        !open && <p className="mt-2 text-sm text-stone-500">Žádné požadavky ke schválení.</p>
      ) : (
        <ul className="mt-3 space-y-3">
          {sorted.map((a) => {
            const st = STATE[a.status];
            return (
              <li key={a.id} className="rounded-xl border border-stone-200 p-3.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-stone-900">{a.title}</p>
                    <p className="text-xs text-stone-400">
                      {ROLE_LABELS[a.authorRole]} · {formatDate(a.createdAt)}
                      {a.amount ? ` · ${a.amount.toLocaleString("cs-CZ")} Kč` : ""}
                    </p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${st.badge}`}>
                    {st.label}
                  </span>
                </div>
                {a.description && (
                  <p className="mt-2 whitespace-pre-wrap text-sm text-stone-700">{a.description}</p>
                )}
                {a.decisionNote && (
                  <p className="mt-1 text-xs text-stone-500">Poznámka: {a.decisionNote}</p>
                )}

                {manage && (
                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    {a.status !== "APPROVED" && (
                      <button
                        onClick={() => setApprovalStatus(propertyId, a.id, "APPROVED")}
                        className="btn-secondary btn-sm text-emerald-700"
                      >
                        <IconCheck className="h-4 w-4" />
                        Schválit
                      </button>
                    )}
                    {a.status !== "REJECTED" && (
                      <button
                        onClick={() => setApprovalStatus(propertyId, a.id, "REJECTED")}
                        className="btn-ghost btn-sm text-rose-600"
                      >
                        <IconClose className="h-4 w-4" />
                        Zamítnout
                      </button>
                    )}
                    <button
                      onClick={() => {
                        if (confirm("Smazat požadavek?")) deleteApproval(propertyId, a.id);
                      }}
                      className="btn-ghost btn-sm ml-auto text-stone-400 hover:text-red-600"
                      aria-label="Smazat"
                    >
                      <IconTrash className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
