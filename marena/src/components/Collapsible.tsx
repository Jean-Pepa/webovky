"use client";

import { useState, type ReactNode } from "react";
import { Icon } from "./Icons";

// Sbalitelná sekce s rolovací šipkou (chevron). Hlavička je klikací,
// po kliknutí se obsah sbalí/rozbalí. Šetří místo u dlouhých seznamů.
export function Collapsible({
  defaultOpen = false,
  header,
  children,
  className = "",
  headerClassName = "",
}: {
  defaultOpen?: boolean;
  // Hlavička může záviset na stavu (rozbaleno/sbaleno).
  header: ReactNode | ((open: boolean) => ReactNode);
  children: ReactNode;
  className?: string;
  headerClassName?: string;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={`flex w-full items-center gap-2 text-left ${headerClassName}`}
      >
        <div className="min-w-0 flex-1">{typeof header === "function" ? header(open) : header}</div>
        <Icon
          name="chevron"
          className={`mt-0.5 h-4 w-4 shrink-0 self-start text-ink-soft transition-transform ${open ? "" : "-rotate-90"}`}
        />
      </button>
      {open && children}
    </div>
  );
}
