"use client";

import { useState } from "react";

// Malé mazací tlačítko s potvrzením na dvě kliknutí (žádný nativní confirm).
export function DeleteButton({ onConfirm, label = "Smazat" }: { onConfirm: () => void; label?: string }) {
  const [armed, setArmed] = useState(false);
  if (armed) {
    return (
      <span className="inline-flex items-center gap-1 text-xs">
        <button className="btn-danger" onClick={onConfirm}>
          Opravdu?
        </button>
        <button className="btn-ghost px-2 py-1 text-xs" onClick={() => setArmed(false)}>
          Ne
        </button>
      </span>
    );
  }
  return (
    <button className="btn-danger" onClick={() => setArmed(true)} aria-label={label} title={label}>
      {label}
    </button>
  );
}
