"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "@/components/LocLink";
import { useI18n } from "@/i18n/context";

export default function AccountAuthPage() {
  const { t, lang } = useI18n();
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [accType, setAccType] = useState<"consumer" | "business">("consumer");
  const [ico, setIco] = useState("");
  const [company, setCompany] = useState("");
  const [ares, setAres] = useState<"idle" | "loading" | "error">("idle");

  // Doplnění firmy podle IČO z registru ARES (přes náš server endpoint)
  async function loadAres() {
    setAres("loading");
    try {
      const r = await fetch(`/api/ares?ico=${encodeURIComponent(ico)}`);
      if (!r.ok) throw new Error();
      const d = await r.json();
      setCompany(d.name || "");
      setAres("idle");
    } catch {
      setAres("error");
    }
  }

  // Demo: po odeslání jen přejdeme do přehledu účtu
  function go(e: React.FormEvent) {
    e.preventDefault();
    router.push(`${lang === "cs" ? "" : "/" + lang}/ucet/prehled`);
  }

  const field =
    "w-full px-3 py-2.5 rounded-lg border border-[var(--color-border)] outline-none focus:border-[var(--color-accent)]";

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-3xl font-extrabold text-center">{t("account.my")}</h1>

      {/* Přepínač přihlášení / registrace */}
      <div className="mt-6 grid grid-cols-2 gap-1 p-1 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)]">
        {(["login", "register"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`py-2 rounded-full text-sm font-semibold transition ${mode === m ? "text-white" : "text-[var(--color-ink-soft)]"}`}
            style={mode === m ? { background: "var(--color-accent)" } : undefined}
          >
            {m === "login" ? t("acc.tab") : t("acc.tabRegister")}
          </button>
        ))}
      </div>

      <p className="mt-4 text-xs text-center text-[var(--color-ink-soft)] bg-[var(--color-bg)] rounded-lg p-3">
        {t("acc.demoNote")}
      </p>

      {mode === "login" ? (
        <form onSubmit={go} className="mt-6 space-y-4">
          <h2 className="text-lg font-bold">{t("acc.signinTitle")}</h2>
          <p className="text-sm text-[var(--color-ink-soft)]">{t("acc.signinSub")}</p>
          <input type="email" required placeholder={t("acc.email")} className={field} />
          <input type="password" required placeholder={t("acc.password")} className={field} />
          <button type="submit" className="w-full py-3 rounded-full font-semibold text-white" style={{ background: "var(--color-accent)" }}>
            {t("acc.signinBtn")}
          </button>
          <div className="flex items-center justify-between text-sm">
            <button type="button" className="text-[var(--color-ink-soft)] hover:text-[var(--color-accent)]">{t("acc.forgot")}</button>
            <button type="button" onClick={() => setMode("register")} className="font-semibold text-[var(--color-accent)]">{t("acc.noAccount")}</button>
          </div>
        </form>
      ) : (
        <form onSubmit={go} className="mt-6 space-y-4">
          <h2 className="text-lg font-bold">{t("acc.registerTitle")}</h2>
          <p className="text-sm text-[var(--color-ink-soft)]">{t("acc.registerSub")}</p>

          {/* Typ účtu */}
          <div className="grid grid-cols-2 gap-2">
            {(["consumer", "business"] as const).map((tp) => (
              <button
                key={tp}
                type="button"
                onClick={() => setAccType(tp)}
                className={`py-2.5 rounded-lg text-sm font-semibold border transition ${
                  accType === tp ? "text-white border-transparent" : "border-[var(--color-border)] text-[var(--color-ink-soft)]"
                }`}
                style={accType === tp ? { background: "var(--color-accent)" } : undefined}
              >
                {tp === "consumer" ? t("acc.typeConsumer") : t("acc.typeBusiness")}
              </button>
            ))}
          </div>

          {accType === "business" ? (
            <>
              <div className="flex gap-2">
                <input
                  required
                  value={ico}
                  onChange={(e) => setIco(e.target.value)}
                  placeholder={t("acc.ico")}
                  className={field}
                  inputMode="numeric"
                />
                <button
                  type="button"
                  onClick={loadAres}
                  disabled={ares === "loading"}
                  className="shrink-0 px-4 rounded-lg font-semibold text-white disabled:opacity-60"
                  style={{ background: "var(--color-accent)" }}
                >
                  {ares === "loading" ? t("acc.aresLoading") : t("acc.aresLoad")}
                </button>
              </div>
              {ares === "error" && <p className="text-xs text-[var(--color-accent)]">{t("acc.aresError")}</p>}
              <input
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder={t("acc.company")}
                className={field}
              />
            </>
          ) : (
            <input required placeholder={t("acc.name")} className={field} />
          )}
          <input type="email" required placeholder={t("acc.email")} className={field} />
          <input type="tel" placeholder={t("acc.phone")} className={field} />
          <input type="password" required placeholder={t("acc.password")} className={field} />
          <input type="password" required placeholder={t("acc.passwordAgain")} className={field} />
          <button type="submit" className="w-full py-3 rounded-full font-semibold text-white" style={{ background: "var(--color-accent)" }}>
            {t("acc.registerBtn")}
          </button>
          <button type="button" onClick={() => setMode("login")} className="w-full text-sm font-semibold text-[var(--color-accent)]">
            {t("acc.haveAccount")}
          </button>
        </form>
      )}

      <p className="mt-8 text-center text-xs text-[var(--color-ink-soft)]">
        <Link href="/ochrana-osobnich-udaju" className="hover:text-[var(--color-accent)]">{t("legal.privacy")}</Link>
      </p>
    </div>
  );
}
