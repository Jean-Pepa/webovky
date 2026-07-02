"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";

// Jednoduchý modální dialog — overlay + karta, zavírá se Esc i klikem mimo.
// Vykresluje se přes portál do <body>, aby se vždy vycentroval na celou
// obrazovku (jinak by ho „chytlo" backdrop-blur v hlavičce a posunulo nahoru).
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

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div
        className="relative max-h-[90vh] w-full max-w-md overflow-y-auto overscroll-contain rounded-3xl border border-ink/10 bg-white p-6 shadow-2xl"
        role="dialog"
        aria-modal="true"
      >
        {title && <h2 className="mb-4 font-display text-lg font-semibold tracking-tight">{title}</h2>}
        {children}
      </div>
    </div>,
    document.body,
  );
}
