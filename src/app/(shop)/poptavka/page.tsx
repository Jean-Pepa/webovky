"use client";

import Link from "next/link";
import { useState } from "react";
import { useI18n } from "@/i18n/context";

export default function InquiryPage() {
  const { t } = useI18n();
  const [done, setDone] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setDone(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (done) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <div className="w-16 h-16 mx-auto rounded-full grid place-items-center text-white text-3xl" style={{ background: "var(--color-success)" }}>✓</div>
        <h1 className="mt-6 text-3xl font-extrabold">{t("inq.sent")}</h1>
        <p className="mt-2 text-[var(--color-ink-soft)]">{t("inq.sentText")}</p>
        <Link href="/katalog" className="inline-block mt-8 px-6 py-3 rounded-full font-semibold text-white" style={{ background: "var(--color-accent)" }}>
          {t("cart.browse")}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <nav className="text-sm text-[var(--color-ink-soft)] mb-3">
        <Link href="/" className="hover:text-[var(--color-accent)]">{t("crumb.home")}</Link>
        <span className="mx-2">/</span>
        <span>{t("inq.title")}</span>
      </nav>

      <h1 className="text-4xl font-extrabold border-b border-[var(--color-border)] pb-4">{t("inq.title")}</h1>
      <p className="mt-4 text-[var(--color-ink-soft)]">{t("inq.intro")}</p>

      <form onSubmit={submit} className="mt-8 space-y-5">
        <Field label={t("inq.name")} required />
        <Field label={t("inq.email")} type="email" required />
        <Field label={t("inq.phone")} type="tel" required />
        <Field label={t("inq.place")} required />
        <label className="block">
          <span className="block text-sm font-bold mb-1.5">{t("inq.message")} <span className="text-[var(--color-accent)]">*</span></span>
          <textarea
            required
            rows={6}
            placeholder={t("inq.messagePlaceholder")}
            className="w-full px-3 py-2 rounded-md border border-[var(--color-border)] bg-white outline-none focus:border-[var(--color-accent)]"
          />
        </label>

        <button
          type="submit"
          className="px-6 py-3 rounded-md border border-black text-white font-semibold"
          style={{ background: "var(--color-accent)" }}
        >
          {t("inq.submit")}
        </button>
      </form>
    </div>
  );
}

function Field({ label, type = "text", required }: { label: string; type?: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="block text-sm font-bold mb-1.5">
        {label} {required && <span className="text-[var(--color-accent)]">*</span>}
      </span>
      <input
        type={type}
        required={required}
        className="w-full px-3 py-2 rounded-md border border-[var(--color-border)] bg-white outline-none focus:border-[var(--color-accent)]"
      />
    </label>
  );
}
