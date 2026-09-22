"use client";

import { useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";

// Přihlášení správce — čistá obrazovka ve stejném stylu jako „Web je dočasně
// nefunkční": jen login, heslo, Vstoupit a Zpět. Vede sem kolečko z vypnutého webu.
export default function AdminLoginPage() {
  const { setMe } = useStore();
  const [name, setName] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    const res = await fetch("/api/auth/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pass }),
    }).catch(() => null);
    setBusy(false);
    if (res && res.ok) {
      setMe(name.trim() || "Mařena");
      window.location.assign("/zazemi");
    } else {
      setErr("Špatné heslo.");
    }
  }

  return (
    <main className="siteoff grid min-h-screen place-items-center px-6">
      <form onSubmit={submit} className="w-full max-w-xs space-y-3">
        <input
          className="siteoff-input w-full rounded-xl px-4 py-3 text-[17px] outline-none focus:ring-2 focus:ring-[#007aff]/50"
          placeholder="Login"
          autoComplete="username"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="siteoff-input w-full rounded-xl px-4 py-3 text-[17px] outline-none focus:ring-2 focus:ring-[#007aff]/50"
          type="password"
          placeholder="Heslo"
          autoComplete="current-password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          autoFocus
        />
        {err && <p className="text-center text-sm text-[#ff3b30]">{err}</p>}
        <button
          type="submit"
          disabled={busy || !pass}
          className="inline-flex w-full items-center justify-center rounded-full bg-[#007aff] px-6 py-3 text-[17px] font-semibold text-white transition active:opacity-80 disabled:opacity-40"
        >
          {busy ? "Přihlašuji…" : "Vstoupit"}
        </button>
        <Link href="/" className="siteoff-sub block py-2 text-center text-[15px] transition hover:opacity-70">
          Zpět
        </Link>
      </form>
    </main>
  );
}
