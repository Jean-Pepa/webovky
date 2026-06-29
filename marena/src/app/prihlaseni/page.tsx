"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { Logo } from "@/components/Logo";
import { Mascot } from "@/components/Mascot";
import { supabaseEnabled } from "@/lib/supabase/config";
import { MagicLinkLogin } from "@/components/MagicLinkLogin";

export default function LoginPage() {
  const { login, authed, ready, setMe } = useStore();
  const router = useRouter();
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);
  const [errParam, setErrParam] = useState<string | null>(null);
  const [passOk, setPassOk] = useState(false); // heslo do zázemí prošlo → ukaž e-mail
  const magic = supabaseEnabled();

  // Údržba: když je appka vypnutá, ukáže se místo přihlášení nápis. Dovnitř se
  // dostane jen správce (přes login + heslo), aby ji mohl zase zapnout.
  const [maint, setMaint] = useState<boolean | null>(null);
  const [adminMode, setAdminMode] = useState(false);
  const [adminName, setAdminName] = useState("Mařena");
  const [adminPass, setAdminPass] = useState("");
  const [adminErr, setAdminErr] = useState<string | null>(null);
  const [adminBusy, setAdminBusy] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setErrParam(new URLSearchParams(window.location.search).get("err"));
  }, []);

  useEffect(() => {
    let alive = true;
    const load = () =>
      fetch("/api/maintenance", { cache: "no-store" })
        .then((r) => r.json())
        .then((d: { maintenance?: boolean }) => alive && setMaint(!!d.maintenance))
        .catch(() => alive && setMaint(false));
    load();
    const id = setInterval(load, 3000);
    const onVisible = () => document.visibilityState === "visible" && load();
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", load);
    return () => {
      alive = false;
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", load);
    };
  }, []);

  useEffect(() => {
    if (ready && authed) router.replace("/zazemi");
  }, [ready, authed, router]);

  async function submitAdmin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setAdminErr(null);
    setAdminBusy(true);
    const res = await fetch("/api/auth/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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

  // Bez Supabase: heslo rovnou pustí dovnitř.
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    const fd = new FormData(e.currentTarget);
    const ok = await login(String(fd.get("password") || ""));
    setBusy(false);
    if (ok) router.push("/zazemi");
    else setError(true);
  }

  // Se Supabase: heslo je jen první krok — pak teprve přihlášení e-mailem.
  async function submitPassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: String(fd.get("password") || "") }),
    }).catch(() => null);
    setBusy(false);
    if (res && res.ok) {
      setError(false);
      setPassOk(true);
    } else {
      setError(true);
    }
  }

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden px-4">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-plum-700 via-plum-800 to-ink" />
      <div className="paper-grain absolute inset-0 -z-10 opacity-30" />

      <div className="absolute left-4 top-4">
        <Logo light />
      </div>

      <div className="w-full max-w-sm">
        <div className="mb-4 flex justify-center">
          <Mascot size={150} wave />
        </div>
        <div className="rounded-3xl bg-white/10 p-7 text-white ring-1 ring-white/15 backdrop-blur-md">
          {maint === true ? (
            adminMode ? (
              // Údržba: jediná cesta dovnitř je správce (login + heslo).
              <form onSubmit={submitAdmin} className="space-y-3">
                <h1 className="font-display text-2xl font-semibold">🔑 Přihlášení správce</h1>
                <p className="text-sm text-white/70">Aplikace je v údržbě. Dovnitř se dostaneš jen ty.</p>
                <input
                  className="w-full rounded-xl border border-white/20 bg-white/10 px-3.5 py-2.5 text-base text-white placeholder:text-white/50 outline-none focus:border-marigold-300 sm:text-sm"
                  placeholder="Login (jméno)"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                />
                <input
                  className="w-full rounded-xl border border-white/20 bg-white/10 px-3.5 py-2.5 text-base text-white placeholder:text-white/50 outline-none focus:border-marigold-300 sm:text-sm"
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
                <button type="button" onClick={() => setAdminMode(false)} className="w-full text-center text-xs text-white/60 hover:text-white">
                  ← Zpět
                </button>
              </form>
            ) : (
              // Údržba: nápis pro běžné lidi + nenápadný vstup pro správce.
              <div className="text-center">
                <div className="text-5xl">🛠️</div>
                <h1 className="mt-3 font-display text-2xl font-semibold">Probíhá údržba</h1>
                <p className="mt-2 text-sm text-white/80">
                  Aplikace je dočasně vypnutá. Nedá se nic dělat, dokud ji správce zase nezapne. Zkus to prosím za chvíli.
                </p>
                <button
                  type="button"
                  onClick={() => setAdminMode(true)}
                  className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-white/60 hover:text-white"
                >
                  🔑 Správce
                </button>
              </div>
            )
          ) : magic && passOk ? (
            // 2. krok (Supabase): přihlášení e-mailem
            <MagicLinkLogin deniedHint={errParam === "denied"} />
          ) : (
            // Heslo do zázemí — bez Supabase rovnou pustí dovnitř, se Supabase je to 1. krok.
            <>
              <h1 className="font-display text-2xl font-semibold">Vstup do zázemí</h1>
              {magic && <p className="mt-1 text-sm text-white/70">Nejdřív společné heslo, pak přihlášení e-mailem.</p>}
              <form onSubmit={magic ? submitPassword : submit} className="mt-5 space-y-3">
                <input
                  name="password"
                  type="password"
                  required
                  placeholder="Heslo do zázemí"
                  onChange={() => setError(false)}
                  className="w-full rounded-xl border border-white/20 bg-white/10 px-3.5 py-2.5 text-base text-white placeholder:text-white/50 outline-none transition focus:border-marigold-300 focus:ring-2 focus:ring-marigold-300/30 sm:text-sm"
                  autoFocus
                />
                {error && (
                  <p className="rounded-xl bg-red-500/20 px-3 py-2 text-sm text-red-100">
                    Špatné heslo. Zkus to znovu.
                  </p>
                )}
                <button type="submit" disabled={busy} className="btn-primary w-full">
                  {busy ? "Přihlašuji…" : magic ? "Pokračovat" : "Vstoupit"}
                </button>
              </form>
            </>
          )}
        </div>
        <p className="mt-4 text-center text-xs text-white/60">
          <Link href="/" className="hover:text-white">
            ← Zpět na úvod
          </Link>
        </p>
      </div>
    </div>
  );
}
