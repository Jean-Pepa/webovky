"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { Loading } from "@/components/Loading";
import { YearSwitcher } from "@/components/YearSwitcher";
import { Icon, type IconName } from "@/components/Icons";
import { isAdmin } from "@/lib/admin";
import { downloadArchive } from "@/lib/export";

const NAV: { href: string; label: string; icon: IconName }[] = [
  { href: "/zazemi", label: "Nástěnka", icon: "board" },
  { href: "/zazemi/hlasovani", label: "Hlasování", icon: "vote" },
  { href: "/zazemi/kalendar", label: "Kalendář", icon: "calendar" },
  { href: "/zazemi/program", label: "Program", icon: "mic" },
  { href: "/zazemi/tym", label: "Tým & role", icon: "users" },
  { href: "/zazemi/ukoly", label: "Úkoly", icon: "tasks" },
  { href: "/zazemi/provoz", label: "Provoz & směny", icon: "ops" },
  { href: "/zazemi/kuchyne", label: "Kuchyně", icon: "food" },
  { href: "/zazemi/finance", label: "Finance", icon: "finance" },
  { href: "/zazemi/kontakty", label: "Kontakty", icon: "contacts" },
];

export default function ZazemiLayout({ children }: { children: React.ReactNode }) {
  const { ready, authed, me, logout, syncError, dismissSyncError, db, currentYear, canEditCurrentYear } = useStore();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (ready && !authed) router.replace("/prihlaseni");
  }, [ready, authed, router]);

  if (!ready) return <Loading />;
  if (!authed) return <Loading label="Přesměrování na přihlášení…" />;
  if (!me) return <IdentityGate />;

  async function doLogout() {
    setMenuOpen(false);
    await logout();
    router.replace("/");
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-ink/10 bg-paper/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-x-4 gap-y-2 px-4 py-3">
          <div className="flex items-baseline gap-2">
            <Link href="/zazemi" aria-label="Mařena — zázemí" className="font-display text-2xl font-bold tracking-[0.06em] sm:text-3xl">
              {"MAŘENA".split("").map((ch, i) => (
                <span key={i} className="marena-letter" style={{ animationDelay: `${i * -0.06}s` }}>
                  {ch}
                </span>
              ))}
            </Link>
            {currentYear && (
              <span className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                {currentYear.label.match(/\d{4}/)?.[0] ?? currentYear.id}
              </span>
            )}
          </div>
          {/* Desktop: přepínač ročníku + jméno */}
          <div className="ml-auto hidden items-center gap-2 md:flex">
            <YearSwitcher />
            <MeBadge />
          </div>
          {/* Mobil: hamburger */}
          <button
            className="ml-auto inline-flex items-center justify-center rounded-full p-2 text-ink-soft hover:bg-black/5 md:hidden"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Zavřít menu" : "Otevřít menu"}
            aria-expanded={menuOpen}
          >
            <Icon name={menuOpen ? "close" : "menu"} className="h-6 w-6" />
          </button>
        </div>

        {/* Desktopová navigace */}
        <nav className="mx-auto hidden max-w-6xl flex-wrap gap-1 px-3 pb-2 md:flex">
          {NAV.map((n) => {
            const active = pathname === n.href;
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  active ? "bg-marigold-600 text-white" : "text-ink-soft hover:bg-black/5"
                }`}
              >
                <Icon name={n.icon} className="h-4 w-4" /> {n.label}
              </Link>
            );
          })}
          <Link
            href="/zazemi/almanach"
            className="ml-auto inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-marigold-600 px-3.5 py-1.5 text-sm font-medium text-white transition-colors hover:bg-marigold-700"
          >
            <Icon name="book" className="h-4 w-4" /> Almanach
          </Link>
          {isAdmin(me) && db && (
            <button
              onClick={() => downloadArchive(db)}
              title="Stáhnout kompletní archiv všech ročníků do PDF (pro úschovu na další roky)"
              className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-ink px-3.5 py-1.5 text-sm font-medium text-white transition-colors hover:bg-ink/90"
            >
              <Icon name="download" className="h-4 w-4" /> Stáhnout vše
            </button>
          )}
          <button
            onClick={doLogout}
            className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium text-ink-soft hover:bg-black/5"
          >
            <Icon name="logout" className="h-4 w-4" /> Odhlásit
          </button>
        </nav>

        {/* Mobilní menu (rozbalovací) */}
        {menuOpen && (
          <div className="max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-ink/10 bg-paper/95 px-3 py-3 md:hidden">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <YearSwitcher />
              <MeBadge />
            </div>
            <nav className="flex flex-col gap-1">
              {NAV.map((n) => {
                const active = pathname === n.href;
                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    onClick={() => setMenuOpen(false)}
                    className={`inline-flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[15px] font-medium transition-colors ${
                      active ? "bg-marigold-600 text-white" : "text-ink hover:bg-black/5"
                    }`}
                  >
                    <Icon name={n.icon} className="h-5 w-5" /> {n.label}
                  </Link>
                );
              })}
              <Link
                href="/zazemi/almanach"
                onClick={() => setMenuOpen(false)}
                className="inline-flex items-center gap-2.5 rounded-xl bg-marigold-600 px-3 py-2.5 text-[15px] font-medium text-white"
              >
                <Icon name="book" className="h-5 w-5" /> Almanach
              </Link>
              {isAdmin(me) && db && (
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    downloadArchive(db);
                  }}
                  className="inline-flex items-center gap-2.5 rounded-xl bg-ink px-3 py-2.5 text-left text-[15px] font-medium text-white"
                >
                  <Icon name="download" className="h-5 w-5" /> Stáhnout vše
                </button>
              )}
              <button
                onClick={doLogout}
                className="inline-flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[15px] font-medium text-ink-soft hover:bg-black/5"
              >
                <Icon name="logout" className="h-5 w-5" /> Odhlásit
              </button>
            </nav>
          </div>
        )}
      </header>

      {currentYear && !canEditCurrentYear && (
        <div className="flex items-center justify-center gap-2 border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-xs font-medium text-amber-800">
          <Icon name="book" className="h-4 w-4 shrink-0" />
          <span>🔒 {currentYear.label} je uzamčený ročník — jde jen prohlížet. Měnit lze jen aktuální (nejnovější) ročník.</span>
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
          <input className="input text-center" placeholder="Tvoje jméno / přezdívka" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
          <button className="btn-primary" type="submit">
            Vstoupit do zázemí
          </button>
        </form>
      </div>
    </div>
  );
}
