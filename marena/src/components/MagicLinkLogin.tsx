"use client";

import { useState } from "react";
import { createSupabaseBrowser } from "@/lib/supabase/client";

// Přihlášení e-mailem (magic link). Zadáš e-mail → přijde odkaz → klik → uvnitř.
// „Zaregistrovat se" navíc uloží jméno (použije se při založení člena).
export function MagicLinkLogin({ deniedHint }: { deniedHint?: boolean }) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    const mail = email.trim();
    if (!mail) return setErr("Zadej e-mail.");
    if (mode === "register" && !name.trim()) return setErr("Zadej jméno.");
    setBusy(true);
    try {
      const supabase = createSupabaseBrowser();
      const { error } = await supabase.auth.signInWithOtp({
        email: mail,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: mode === "register" ? { name: name.trim() } : undefined,
        },
      });
      if (error) {
        setErr(error.message || "Odeslání odkazu se nepovedlo.");
        setBusy(false);
        return;
      }
      setSent(true);
    } catch {
      setErr("Něco se pokazilo. Zkus to znovu.");
    } finally {
      setBusy(false);
    }
  }

  if (sent) {
    return (
      <div className="space-y-3 text-white">
        <h1 className="font-display text-2xl font-semibold">Mrkni do e-mailu 📬</h1>
        <p className="text-sm text-white/80">
          Na <strong>{email.trim()}</strong> jsme poslali přihlašovací odkaz. Klikni na něj na tomhle zařízení a budeš
          v zázemí. (Odkaz chvíli platí; pokud nepřišel, koukni do spamu.)
        </p>
        <button className="btn-secondary" onClick={() => setSent(false)}>
          Zadat jiný e-mail
        </button>
      </div>
    );
  }

  return (
    <div className="text-white">
      <h1 className="font-display text-2xl font-semibold">Vstup do zázemí</h1>
      {deniedHint && (
        <p className="mt-2 rounded-xl bg-red-500/20 px-3 py-2 text-sm text-red-100">
          Tenhle e-mail zatím nemá přístup. Napiš správci, ať tě přidá do týmu.
        </p>
      )}
      <div className="mt-4 inline-flex w-full rounded-full bg-white/10 p-0.5 text-sm">
        {(["login", "register"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => {
              setMode(m);
              setErr(null);
            }}
            className={`flex-1 rounded-full px-3 py-1.5 font-medium transition ${mode === m ? "bg-white text-ink" : "text-white/80"}`}
          >
            {m === "login" ? "Už mám účet" : "Zaregistrovat se"}
          </button>
        ))}
      </div>
      <form onSubmit={submit} className="mt-4 space-y-3">
        {mode === "register" && (
          <input
            className="w-full rounded-xl border border-white/20 bg-white/10 px-3.5 py-2.5 text-base text-white placeholder:text-white/50 outline-none focus:border-marigold-300 focus:ring-2 focus:ring-marigold-300/30 sm:text-sm"
            placeholder="Jméno a příjmení"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
        )}
        <input
          className="w-full rounded-xl border border-white/20 bg-white/10 px-3.5 py-2.5 text-base text-white placeholder:text-white/50 outline-none focus:border-marigold-300 focus:ring-2 focus:ring-marigold-300/30 sm:text-sm"
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoFocus={mode === "login"}
        />
        {err && <p className="rounded-xl bg-red-500/20 px-3 py-2 text-sm text-red-100">{err}</p>}
        <button type="submit" disabled={busy} className="btn-primary w-full">
          {busy ? "Posílám…" : "Poslat přihlašovací odkaz"}
        </button>
        <p className="text-xs text-white/60">Pošleme ti na e-mail odkaz, kterým se přihlásíš. Bez hesla.</p>
      </form>
    </div>
  );
}
