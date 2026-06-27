"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import { useStore } from "@/lib/store";

// Přihlášení e-mailem (magic link). Zadáš e-mail → přijde odkaz → klik → uvnitř.
// „Zaregistrovat se" navíc uloží jméno (použije se při založení člena).
// Malá ikonka „Správce" navíc nabízí záložní přihlášení správce (login + heslo).
export function MagicLinkLogin({ deniedHint }: { deniedHint?: boolean }) {
  const { setMe } = useStore();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [admin, setAdmin] = useState(false);
  const [adminName, setAdminName] = useState("Mařena");
  const [adminPass, setAdminPass] = useState("");
  const [adminErr, setAdminErr] = useState<string | null>(null);
  const [adminBusy, setAdminBusy] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phonePrefix, setPhonePrefix] = useState("+420"); // hodně Slováků → CZ/SK na výběr
  const [phoneNum, setPhoneNum] = useState("");
  const [busy, setBusy] = useState(false);

  const fullPhone = `${phonePrefix ? phonePrefix + " " : ""}${phoneNum.trim()}`.trim();

  async function submitAdmin(e: React.FormEvent) {
    e.preventDefault();
    setAdminErr(null);
    setAdminBusy(true);
    const res = await fetch("/api/auth/admin", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ password: adminPass }),
    }).catch(() => null);
    setAdminBusy(false);
    if (res && res.ok) {
      setMe(adminName.trim() || "Mařena");
      window.location.assign("/zazemi");
    } else {
      setAdminErr("Špatné heslo správce.");
    }
  }
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // Po odeslání odkazu hlídej, jestli se člověk mezitím přihlásil (klikl na odkaz
  // v jiné záložce) — pak pustí dovnitř i tohle původní okno.
  useEffect(() => {
    if (!sent) return;
    const id = setInterval(async () => {
      try {
        const res = await fetch("/api/auth/status", { cache: "no-store" });
        const d = (await res.json()) as { authed?: boolean };
        if (d?.authed) window.location.assign("/zazemi");
      } catch {
        /* ignore */
      }
    }, 3000);
    return () => clearInterval(id);
  }, [sent]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    const mail = email.trim();
    if (!mail) return setErr("Zadej e-mail.");
    if (mode === "register" && !name.trim()) return setErr("Zadej jméno.");
    setBusy(true);
    try {
      // „Už mám účet": odkaz pošli jen na e-mail, který v týmu existuje. Na neznámý
      // se nic neposílá — člověka to pošle na registraci.
      if (mode === "login") {
        const r = await fetch("/api/auth/email-known", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ email: mail }),
        }).catch(() => null);
        const known = !!(r && r.ok && ((await r.json()) as { known?: boolean }).known);
        if (!known) {
          setErr("Tenhle e-mail u nás nemáme. Zkontroluj ho, nebo se vpravo zaregistruj.");
          setBusy(false);
          return;
        }
      }
      const supabase = createSupabaseBrowser();
      const { error } = await supabase.auth.signInWithOtp({
        email: mail,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          // při přihlášení nezakládej nový účet v Supabase (jen existující),
          // při registraci ano.
          shouldCreateUser: mode === "register",
          data: mode === "register" ? { name: name.trim(), phone: fullPhone || undefined } : undefined,
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

  if (admin) {
    return (
      <div className="text-white">
        <h1 className="font-display text-2xl font-semibold">🔑 Přihlášení správce</h1>
        <p className="mt-1 text-sm text-white/70">Login a heslo správce (bez e-mailu).</p>
        <form onSubmit={submitAdmin} className="mt-4 space-y-3">
          <input
            className="w-full rounded-xl border border-white/20 bg-white/10 px-3.5 py-2.5 text-base text-white placeholder:text-white/50 outline-none focus:border-marigold-300 focus:ring-2 focus:ring-marigold-300/30 sm:text-sm"
            placeholder="Login (jméno)"
            value={adminName}
            onChange={(e) => setAdminName(e.target.value)}
          />
          <input
            className="w-full rounded-xl border border-white/20 bg-white/10 px-3.5 py-2.5 text-base text-white placeholder:text-white/50 outline-none focus:border-marigold-300 focus:ring-2 focus:ring-marigold-300/30 sm:text-sm"
            type="password"
            placeholder="Heslo správce"
            value={adminPass}
            onChange={(e) => setAdminPass(e.target.value)}
            autoFocus
          />
          {adminErr && <p className="rounded-xl bg-red-500/20 px-3 py-2 text-sm text-red-100">{adminErr}</p>}
          <button type="submit" disabled={adminBusy || !adminPass} className="btn-primary w-full">
            {adminBusy ? "Přihlašuji…" : "Vstoupit jako správce"}
          </button>
          <button type="button" onClick={() => setAdmin(false)} className="w-full text-center text-xs text-white/60 hover:text-white">
            ← Zpět na přihlášení e-mailem
          </button>
        </form>
      </div>
    );
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
        {mode === "register" && (
          <div className="flex gap-2">
            <select
              className="rounded-xl border border-white/20 bg-white/10 px-2 py-2.5 text-base text-white outline-none focus:border-marigold-300 sm:text-sm"
              value={phonePrefix}
              onChange={(e) => setPhonePrefix(e.target.value)}
              aria-label="Předvolba"
            >
              <option className="text-ink" value="+420">🇨🇿 +420</option>
              <option className="text-ink" value="+421">🇸🇰 +421</option>
              <option className="text-ink" value="">🌍 jiná</option>
            </select>
            <input
              className="min-w-0 flex-1 rounded-xl border border-white/20 bg-white/10 px-3.5 py-2.5 text-base text-white placeholder:text-white/50 outline-none focus:border-marigold-300 focus:ring-2 focus:ring-marigold-300/30 sm:text-sm"
              type="tel"
              placeholder={phonePrefix ? "telefon" : "celé číslo s předvolbou"}
              value={phoneNum}
              onChange={(e) => setPhoneNum(e.target.value)}
            />
          </div>
        )}
        {err && <p className="rounded-xl bg-red-500/20 px-3 py-2 text-sm text-red-100">{err}</p>}
        <button type="submit" disabled={busy} className="btn-primary w-full">
          {busy ? "Posílám…" : "Poslat přihlašovací odkaz"}
        </button>
        <p className="text-xs text-white/60">Pošleme ti na e-mail odkaz, kterým se přihlásíš. Bez hesla.</p>
      </form>
      <button
        type="button"
        onClick={() => setAdmin(true)}
        title="Přihlášení správce (login + heslo)"
        className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-white/60 hover:text-white"
      >
        🔑 Správce
      </button>
    </div>
  );
}
