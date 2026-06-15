"use client";

import { useState } from "react";
import { useI18n } from "@/i18n/context";

export default function AccountDetailsForm() {
  const { t } = useI18n();
  const [saved, setSaved] = useState(false);

  const field =
    "w-full px-3 py-2.5 rounded-lg border border-[var(--color-border)] outline-none focus:border-[var(--color-accent)]";
  const labelCls = "text-sm font-medium text-[var(--color-ink)]";

  function save(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <form onSubmit={save} className="mt-5 bg-white border border-[var(--color-border)] rounded-2xl p-6 grid sm:grid-cols-2 gap-4">
      <label className="space-y-1">
        <span className={labelCls}>{t("acc.name")}</span>
        <input className={field} defaultValue="Jan Novák" />
      </label>
      <label className="space-y-1">
        <span className={labelCls}>{t("acc.company")}</span>
        <input className={field} defaultValue="Novák stavby s.r.o." />
      </label>
      <label className="space-y-1">
        <span className={labelCls}>{t("acc.ico")}</span>
        <input className={field} defaultValue="12345678" />
      </label>
      <label className="space-y-1">
        <span className={labelCls}>{t("acc.phone")}</span>
        <input className={field} defaultValue="+420 777 123 456" />
      </label>
      <label className="space-y-1">
        <span className={labelCls}>{t("acc.email")}</span>
        <input type="email" className={field} defaultValue="jan.novak@email.cz" />
      </label>
      <label className="space-y-1 sm:col-span-2">
        <span className={labelCls}>{t("cart.note")}</span>
        <input className={field} placeholder="Evropská 6/41, 671 81 Znojmo" />
      </label>

      <div className="sm:col-span-2 flex items-center gap-3">
        <button type="submit" className="px-6 py-2.5 rounded-full font-semibold text-white" style={{ background: "var(--color-accent)" }}>
          {t("acc.saveDetails")}
        </button>
        {saved && <span className="text-sm font-semibold text-[var(--color-success)]">✓</span>}
      </div>
    </form>
  );
}
