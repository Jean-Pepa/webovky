"use client";

import { useState } from "react";
import { Modal } from "@/components/Modal";

// Mazací tlačítko s potvrzovacím oknem — upozorní, že smazání je natrvalo.
// `what` je nepovinný popis mazané věci (např. jméno) do textu okna.
export function DeleteButton({ onConfirm, label = "Smazat", what }: { onConfirm: () => void; label?: string; what?: string }) {
  const [ask, setAsk] = useState(false);
  return (
    <>
      <button className="btn-danger" onClick={() => setAsk(true)} aria-label={label} title={label}>
        {label}
      </button>
      <Modal open={ask} onClose={() => setAsk(false)} title="Opravdu smazat?">
        <p className="text-sm text-ink-soft">
          {what ? (
            <>
              Opravdu chceš smazat <strong className="text-ink">{what}</strong>?{" "}
            </>
          ) : (
            "Opravdu to chceš smazat? "
          )}
          Smaže se to <strong className="text-ink">natrvalo</strong> a nejde to vrátit.
        </p>
        <div className="mt-4 flex items-center gap-2">
          <button
            className="btn-primary flex-1"
            onClick={() => {
              onConfirm();
              setAsk(false);
            }}
          >
            Ano, smazat
          </button>
          <button className="btn-ghost" onClick={() => setAsk(false)}>
            Ne
          </button>
        </div>
      </Modal>
    </>
  );
}
