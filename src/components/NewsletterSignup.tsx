"use client";

import { useState } from "react";
import { useI18n } from "@/i18n/context";

export default function NewsletterSignup() {
  const { t } = useI18n();
  const [done, setDone] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setDone(true);
  }

  return (
    <div className="bg-white border border-[var(--color-border)] rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
      <div className="flex-1">
        <h4 className="text-[var(--color-ink)] font-semibold text-sm">{t("newsletter.title")}</h4>
        <p className="text-xs mt-0.5">{t("newsletter.desc")}</p>
      </div>
      {done ? (
        <p className="text-sm font-semibold text-[var(--color-success)] sm:w-80">{t("newsletter.thanks")}</p>
      ) : (
        <form onSubmit={submit} className="flex w-full sm:w-auto gap-2">
          <input
            type="email"
            required
            placeholder={t("newsletter.placeholder")}
            className="flex-1 sm:w-64 px-3 py-2.5 rounded-lg border border-[var(--color-border)] bg-white text-[var(--color-ink)] outline-none focus:border-[var(--color-accent)]"
          />
          <button type="submit" className="px-4 py-2.5 rounded-lg font-semibold text-white whitespace-nowrap" style={{ background: "var(--color-accent)" }}>
            {t("newsletter.btn")}
          </button>
        </form>
      )}
    </div>
  );
}
