"use client";

import { flash } from "@/components/Flash";

// Zkopíruje text do schránky. Nejdřív moderní Clipboard API, jinak záložní trik
// přes skryté <textarea> (starší prohlížeče / nezabezpečený kontext).
export async function copyText(text: string): Promise<boolean> {
  try {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* zkusíme fallback níže */
  }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.top = "-1000px";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

// Klikací e-mail / telefon — kliknutím se zkopíruje do schránky (+ potvrzení).
// Používá se všude, kde se zobrazuje kontakt (tým, kontakty, sponzoři, merch, finance, prváci).
export function CopyContact({
  value,
  kind,
  className = "",
  icon = true,
}: {
  value: string;
  kind: "email" | "phone";
  className?: string;
  icon?: boolean;
}) {
  const emoji = kind === "email" ? "✉️" : "📞";
  async function handle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation(); // ať se nespustí klik na rodičovské kartě
    const ok = await copyText(value);
    flash(ok ? `Zkopírováno: ${value}` : "Zkopírování se nepodařilo.", ok ? "📋" : "⚠️");
  }
  return (
    <button
      type="button"
      onClick={handle}
      title={`Klikni a ${kind === "email" ? "e-mail" : "telefon"} se zkopíruje`}
      className={`cursor-pointer border-0 bg-transparent p-0 text-left ${className}`}
    >
      {icon ? `${emoji} ${value}` : value}
    </button>
  );
}
