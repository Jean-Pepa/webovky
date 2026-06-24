"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { Logo } from "@/components/Logo";
import { Loading } from "@/components/Loading";
import { YearSwitcher } from "@/components/YearSwitcher";

const NAV = [
  { href: "/zazemi", label: "Nástěnka", emoji: "📌" },
  { href: "/zazemi/hlasovani", label: "Hlasování", emoji: "🗳️" },
  { href: "/zazemi/kalendar", label: "Kalendář", emoji: "📅" },
  { href: "/zazemi/tym", label: "Tým & role", emoji: "🧑‍🤝‍🧑" },
  { href: "/zazemi/ukoly", label: "Úkoly", emoji: "✅" },
  { href: "/zazemi/kontakty", label: "Kontakty", emoji: "📇" },
];

export default function ZazemiLayout({ children }: { children: React.ReactNode }) {
  const { ready, authed, me, configured, logout, syncError, dismissSyncError } = useStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (ready && !authed) router.replace("/prihlaseni");
  }, [ready, authed, router]);

  if (!ready) return <Loading />;
  if (!authed) return <Loading label="Přesměrování na přihlášení…" />;
  if (!me) return <IdentityGate />;

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-ink/10 bg-paper/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3">
          <Logo href="/zazemi" />
          <div className="ml-auto flex items-center gap-2">
            <YearSwitcher />
            <MeBadge />
          </div>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-3 pb-2">
          {NAV.map((n) => {
            const active = pathname === n.href;
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  active ? "bg-marigold-600 text-white" : "text-ink-soft hover:bg-black/5"
                }`}
              >
                <span aria-hidden>{n.emoji}</span> {n.label}
              </Link>
            );
          })}
          <Link
            href="/almanach"
            className="ml-auto whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium text-plum-700 hover:bg-plum-50"
          >
            📖 Almanach
          </Link>
          <button
            onClick={async () => {
              await logout();
              router.replace("/");
            }}
            className="whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium text-ink-soft hover:bg-black/5"
          >
            Odhlásit
          </button>
        </nav>
      </header>

      {!configured && (
        <div className="border-b border-marigold-200 bg-marigold-50 px-4 py-2 text-center text-xs text-marigold-800">
          Demo režim — data se ukládají jen v tomto prohlížeči. Pro sdílené zázemí nastavte úložiště
          (Upstash Redis / Vercel KV). Viz README.
        </div>
      )}

      {syncError && (
        <div className="flex items-center justify-center gap-3 border-b border-red-200 bg-red-50 px-4 py-2 text-center text-xs text-red-700">
          <span>⚠️ {syncError}</span>
          <button onClick={dismissSyncError} className="font-semibold underline">
            skrýt
          </button>
        </div>
      )}

      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}

function MeBadge() {
  const { me, setMe } = useStore();
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(me);
  if (editing) {
    return (
      <span className="flex items-center gap-1">
        <input value={val} onChange={(e) => setVal(e.target.value)} className="w-28 rounded-full border border-ink/15 px-3 py-1.5 text-sm" />
        <button
          className="btn-primary px-3 py-1.5 text-xs"
          onClick={() => {
            if (val.trim()) setMe(val.trim());
            setEditing(false);
          }}
        >
          OK
        </button>
      </span>
    );
  }
  return (
    <button
      className="chip hover:bg-paper"
      onClick={() => {
        setVal(me);
        setEditing(true);
      }}
      title="Změnit jméno"
    >
      👤 {me}
    </button>
  );
}

// Když je člověk přihlášený, ale ještě nezadal jméno (identita bez účtu).
function IdentityGate() {
  const { setMe } = useStore();
  const [name, setName] = useState("");
  return (
    <div className="grid min-h-screen place-items-center px-4">
      <div className="card w-full max-w-sm p-7 text-center">
        <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-marigold-100 text-2xl">👋</div>
        <h1 className="font-display text-xl font-semibold">Jak ti říkáme?</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Žádné účty — jen jméno, ať ostatní ví, kdo co píše, hlasuje a domlouvá.
        </p>
        <form
          className="mt-4 flex flex-col gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (name.trim()) setMe(name.trim());
          }}
        >
          {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
          <input className="input text-center" placeholder="Tvoje jméno / přezdívka" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
          <button className="btn-primary" type="submit">
            Vstoupit do zázemí
          </button>
        </form>
      </div>
    </div>
  );
}
