"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";

// Brána: nejdřív společné heslo, pak jméno (identita bez účtu). Až potom obsah.
export function Gate({ children }: { children: React.ReactNode }) {
  const { ready, authed, me, login, setMe } = useStore();

  if (!ready) {
    return (
      <div className="grid min-h-screen place-items-center text-ink-soft">
        <div className="animate-pulse text-sm">Načítám…</div>
      </div>
    );
  }

  if (!authed) return <PasswordScreen onLogin={login} />;
  if (!me) return <NameScreen onSet={setMe} />;
  return <>{children}</>;
}

function PasswordScreen({ onLogin }: { onLogin: (pw: string) => Promise<boolean> }) {
  const [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(false);
    const ok = await onLogin(pw);
    setBusy(false);
    if (!ok) setErr(true);
  }

  return (
    <div className="grid min-h-screen place-items-center p-5">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 grid h-16 w-16 place-items-center rounded-3xl hero-sky text-3xl">
            🏖️
          </div>
          <h1 className="font-display text-2xl font-semibold">Dovča</h1>
          <p className="mt-1 text-sm text-ink-soft">Kdy spolu konečně vyrazíme.</p>
        </div>
        <form onSubmit={submit} className="card space-y-3 p-5">
          <div>
            <label className="label">Heslo party</label>
            <input
              className="input"
              type="password"
              autoFocus
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="společné heslo"
            />
          </div>
          {err && <p className="text-sm text-out">Špatné heslo, zkus to znovu.</p>}
          <button className="btn-primary w-full" disabled={busy || !pw.trim()}>
            {busy ? "Přihlašuju…" : "Vstoupit"}
          </button>
          <p className="text-center text-xs text-ink-soft">
            Bez nastaveného serveru jede appka v demo režimu — heslo je <code>dovca</code>.
          </p>
        </form>
      </div>
    </div>
  );
}

function NameScreen({ onSet }: { onSet: (name: string) => void }) {
  const [name, setName] = useState("");
  return (
    <div className="grid min-h-screen place-items-center p-5">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (name.trim()) onSet(name.trim());
        }}
        className="card w-full max-w-sm space-y-3 p-5"
      >
        <h1 className="font-display text-xl font-semibold">Jak ti říkáme?</h1>
        <p className="text-sm text-ink-soft">
          Pod tímhle jménem budeš značit, kdy můžeš, a hlasovat. Uloží se jen v tomhle
          prohlížeči.
        </p>
        <input
          className="input"
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="třeba Kuba"
        />
        <button className="btn-primary w-full" disabled={!name.trim()}>
          Jdeme na to
        </button>
      </form>
    </div>
  );
}
