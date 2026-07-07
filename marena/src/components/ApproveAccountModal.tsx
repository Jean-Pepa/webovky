"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { Modal } from "@/components/Modal";
import { flash as toast } from "@/components/Flash";
import type { Member } from "@/lib/types";

// Schválení nového účtu (jen správce): velké okno uprostřed — vybere se, kdo
// to je. Člen týmu dostane plný přístup; výpomoc u stánku uvidí jen Prodej;
// výběrčí vkladů uvidí jen Finance → Výběr.
type AccessKind = "member" | "prodej" | "vyber";

export function ApproveAccountModal({ member, yearId, onClose }: { member: Member; yearId: string; onClose: () => void }) {
  const { dispatch } = useStore();
  const [busy, setBusy] = useState(false);

  async function pick(kind: AccessKind) {
    if (busy) return;
    setBusy(true);
    // Přístupy jsou navzájem výlučné — vždy nastavíme oba příznaky.
    const ok = await dispatch({
      type: "updateMember",
      yearId,
      memberId: member.id,
      patch: { approved: true, posOnly: kind === "prodej", vyberOnly: kind === "vyber" },
    });
    setBusy(false);
    if (ok) {
      const msg =
        kind === "prodej"
          ? { text: `${member.name} schválen jako výpomoc — uvidí jen Prodej`, emoji: "🛒" }
          : kind === "vyber"
            ? { text: `${member.name} schválen jako výběrčí — uvidí jen Výběr peněz`, emoji: "💰" }
            : { text: `${member.name} je v týmu — plný přístup`, emoji: "🎉" };
      toast(msg.text, msg.emoji);
      onClose();
    }
  }

  return (
    <Modal open onClose={onClose} title={`Schválit účet — ${member.name}`}>
      <p className="mb-4 text-sm text-ink-soft">Kdo to je? Podle toho dostane přístup do zázemí.</p>
      <div className="space-y-3">
        <button
          onClick={() => pick("member")}
          disabled={busy}
          className="w-full rounded-2xl border-2 border-leaf bg-leaf/5 p-4 text-left transition hover:bg-leaf/10 disabled:opacity-60"
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎪</span>
            <div className="min-w-0">
              <div className="font-display text-lg font-semibold">Nový člen týmu</div>
              <div className="mt-0.5 text-sm text-ink-soft">Plný přístup — nástěnka, úkoly, role, kalendář, prostě všechno.</div>
            </div>
          </div>
        </button>
        <button
          onClick={() => pick("prodej")}
          disabled={busy}
          className="w-full rounded-2xl border-2 border-gold-500 bg-gold-50 p-4 text-left transition hover:bg-gold-100 disabled:opacity-60"
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">🛒</span>
            <div className="min-w-0">
              <div className="font-display text-lg font-semibold">Výpomoc — jen Prodej</div>
              <div className="mt-0.5 text-sm text-ink-soft">Brigádník u stánku: uvidí jen Prodej, nic jiného z týmu.</div>
            </div>
          </div>
        </button>
        <button
          onClick={() => pick("vyber")}
          disabled={busy}
          className="w-full rounded-2xl border-2 border-gold-500 bg-gold-50 p-4 text-left transition hover:bg-gold-100 disabled:opacity-60"
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">💰</span>
            <div className="min-w-0">
              <div className="font-display text-lg font-semibold">Výběrčí — jen Finance Výběr</div>
              <div className="mt-0.5 text-sm text-ink-soft">Vybírá vklady: uvidí jen Finance → Výběr, kde odškrtává, kdo zaplatil.</div>
            </div>
          </div>
        </button>
      </div>
      <button onClick={onClose} className="mt-4 w-full text-center text-sm font-medium text-ink-soft hover:text-ink">
        Zrušit
      </button>
    </Modal>
  );
}
