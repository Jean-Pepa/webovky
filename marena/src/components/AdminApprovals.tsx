"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { isAdmin } from "@/lib/admin";
import { roleById } from "@/lib/roles";
import { fmtCZK } from "@/lib/format";
import { flash } from "@/components/Flash";
import { ApproveAccountModal } from "@/components/ApproveAccountModal";
import type { Member } from "@/lib/types";

// Akční pruhy správce — hned pod hlavičkou (čárou u MAŘENA 2026), zlaté se
// světelným pásem zleva doprava, ať to nejde přehlédnout. Dva druhy:
//  • Schválení — nové účty a žádosti o role.
//  • Proplacení — výdaje lidí, které čekají na proplacení (Moje výdaje).
// Ostatním se nikdy neukazují; zmizí samy, když není co řešit.
export function AdminApprovals() {
  const { currentYear, me, dispatch } = useStore();
  const [approve, setApprove] = useState<Member | null>(null);

  if (!isAdmin(me) || !currentYear) return null;
  const year = currentYear;
  const accounts = year.members.filter((m) => m.approved === false);
  const requests = year.members.flatMap((m) => (m.roleRequests ?? []).map((roleId) => ({ m, roleId })));
  // Proplacení: nezaplacené výdaje psané na jméno člověka (kdo zaplatil).
  const reimburse = (year.finances ?? []).filter((f) => f.kind === "vydaj" && !f.paid && !!f.who?.trim());
  const owedTotal = reimburse.reduce((s, f) => s + f.amount, 0);

  if (accounts.length === 0 && requests.length === 0 && reimburse.length === 0) return null;

  return (
    <>
      {/* Schválení — účty + role */}
      {(accounts.length > 0 || requests.length > 0) && (
        <div className="approve-sweep border-b-2 border-amber-500/70 bg-gradient-to-r from-gold-500 via-amber-300 to-gold-500 px-4 py-3 shadow-md">
          <div className="mx-auto max-w-6xl space-y-2">
            <p className="font-display text-lg font-bold tracking-tight text-[#1d1d1f] sm:text-xl">
              ⏳ Čeká na tvoje schválení ({accounts.length + requests.length})
            </p>
            {accounts.map((m) => (
              <div key={m.id} className="relative z-10 flex flex-wrap items-center gap-2 rounded-xl bg-white/80 px-3 py-2 shadow-sm">
                <span className="min-w-0 flex-1 text-[15px] text-[#1d1d1f]">
                  👤 <strong>{m.name}</strong> — nový účet
                </span>
                <button
                  className="shrink-0 rounded-full bg-leaf px-4 py-1.5 text-sm font-bold text-white transition hover:opacity-90"
                  onClick={() => setApprove(m)}
                >
                  Schválit
                </button>
              </div>
            ))}
            {requests.map(({ m, roleId }) => {
              const role = roleById(roleId);
              return (
                <div key={`${m.id}-${roleId}`} className="relative z-10 flex flex-wrap items-center gap-2 rounded-xl bg-white/80 px-3 py-2 shadow-sm">
                  <span className="min-w-0 flex-1 text-[15px] text-[#1d1d1f]">
                    {role?.emoji ?? "🎭"} <strong>{m.name}</strong> žádá o roli <strong>{role?.name ?? roleId}</strong>
                  </span>
                  <span className="flex shrink-0 gap-1.5">
                    <button
                      className="rounded-full bg-leaf px-4 py-1.5 text-sm font-bold text-white transition hover:opacity-90"
                      onClick={() => dispatch({ type: "resolveRoleRequest", yearId: year.id, memberId: m.id, roleId, approve: true })}
                    >
                      Schválit
                    </button>
                    <button
                      className="rounded-full bg-white px-4 py-1.5 text-sm font-bold text-red-600 transition hover:bg-red-50"
                      onClick={() => dispatch({ type: "resolveRoleRequest", yearId: year.id, memberId: m.id, roleId, approve: false })}
                    >
                      Zamítnout
                    </button>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Proplacení — výdaje lidí čekající na proplacení */}
      {reimburse.length > 0 && (
        <div className="approve-sweep border-b-2 border-amber-500/70 bg-gradient-to-r from-gold-500 via-amber-300 to-gold-500 px-4 py-3 shadow-md">
          <div className="mx-auto max-w-6xl space-y-2">
            <p className="font-display text-lg font-bold tracking-tight text-[#1d1d1f] sm:text-xl">
              💸 Čeká na proplacení ({reimburse.length}) · {fmtCZK(owedTotal)}
            </p>
            {reimburse.map((f) => (
              <div key={f.id} className="relative z-10 flex flex-wrap items-center gap-2 rounded-xl bg-white/80 px-3 py-2 shadow-sm">
                <span className="min-w-0 flex-1 text-[15px] text-[#1d1d1f]">
                  💸 <strong>{f.who}</strong> — {f.label} · <strong>{fmtCZK(f.amount)}</strong>
                </span>
                <button
                  className="shrink-0 rounded-full bg-leaf px-4 py-1.5 text-sm font-bold text-white transition hover:opacity-90"
                  onClick={async () => {
                    const ok = await dispatch({ type: "toggleFinancePaid", yearId: year.id, financeId: f.id });
                    if (ok) flash(`Proplaceno ${fmtCZK(f.amount)} — ${f.who}. Odečteno ze společného účtu (v kase).`, "💸");
                  }}
                >
                  Proplatit
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {approve && <ApproveAccountModal key={approve.id} member={approve} yearId={year.id} onClose={() => setApprove(null)} />}
    </>
  );
}
