"use client";

import { useRef, type ReactNode } from "react";

// Obálka formuláře: pole jsou vyplnitelná přímo na webu a tlačítko „Vytisknout"
// vytiskne pouze tento formulář (i s vyplněnými hodnotami).
export default function PrintableForm({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  function handlePrint() {
    const el = ref.current;
    if (!el) return;
    el.classList.add("is-printing");
    document.body.classList.add("printing-form");
    const cleanup = () => {
      el.classList.remove("is-printing");
      document.body.classList.remove("printing-form");
      window.removeEventListener("afterprint", cleanup);
    };
    window.addEventListener("afterprint", cleanup);
    window.print();
  }

  return (
    <div>
      <div ref={ref} className="rounded-xl border border-[var(--color-border)] bg-white p-5 sm:p-6">
        {children}
      </div>
      <button
        type="button"
        onClick={handlePrint}
        className="no-print mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-white"
        style={{ background: "var(--color-accent)" }}
      >
        <span aria-hidden>🖨</span> Vytisknout formulář
      </button>
    </div>
  );
}
