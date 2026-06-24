"use client";

import { useEffect } from "react";

// Jednoduchý modální dialog — overlay + karta, zavírá se Esc i klikem mimo.
export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div className="relative w-full max-w-md rounded-3xl border border-black/10 bg-white p-6 shadow-2xl" role="dialog" aria-modal="true">
        {title && <h2 className="mb-4 font-display text-lg font-semibold tracking-tight">{title}</h2>}
        {children}
      </div>
    </div>
  );
}
