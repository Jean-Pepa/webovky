"use client";

import { useState, type ReactNode } from "react";
import { Modal } from "@/components/Modal";

// Obecné tlačítko s potvrzovacím oknem — než se akce provede, zeptá se
// „Opravdu…?". Používá se u správcovských rozhodnutí (schválení role,
// proplacení…), ať nic neproběhne omylem na jeden klik. Vzhled spouštěcího
// tlačítka řídí `className`, aby vypadalo přesně jako původní tlačítko.
export function ConfirmButton({
  onConfirm,
  children,
  className,
  title = "Opravdu?",
  message,
  confirmLabel = "Ano",
  cancelLabel = "Zpět",
  confirmClassName = "btn-primary flex-1",
}: {
  onConfirm: () => void;
  children: ReactNode;
  className?: string;
  title?: string;
  message?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmClassName?: string;
}) {
  const [ask, setAsk] = useState(false);
  return (
    <>
      <button type="button" className={className} onClick={() => setAsk(true)}>
        {children}
      </button>
      <Modal open={ask} onClose={() => setAsk(false)} title={title}>
        {message && <div className="text-sm text-ink-soft">{message}</div>}
        <div className="mt-4 flex items-center gap-2">
          <button
            className={confirmClassName}
            onClick={() => {
              onConfirm();
              setAsk(false);
            }}
          >
            {confirmLabel}
          </button>
          <button className="btn-ghost" onClick={() => setAsk(false)}>
            {cancelLabel}
          </button>
        </div>
      </Modal>
    </>
  );
}
