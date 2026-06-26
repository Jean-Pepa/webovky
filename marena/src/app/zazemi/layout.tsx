"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { Loading } from "@/components/Loading";
import { YearSwitcher } from "@/components/YearSwitcher";
import { Icon, type IconName } from "@/components/Icons";
import { isAdmin, ADMIN_NAME } from "@/lib/admin";
import { sameName } from "@/lib/names";
import { ArchiveModal } from "@/components/ArchiveModal";

// Pořadí podle významových skupin (co patří k sobě, je vedle sebe):
// komunikace & plán → lidé → festival (program/provoz) → peníze → kontakty.
const NAV: { href: string; label: string; icon: IconName }[] = [
  // Komunikace & plánování
  { href: "/zazemi", label: "Nástěnka", icon: "board" },
  { href: "/zazemi/hlasovani", label: "Hlasování", icon: "vote" },
  { href: "/zazemi/kalendar", label: "Kalendář", icon: "calendar" },
  { href: "/zazemi/ukoly", label: "Úkoly", icon: "tasks" },
  // Lidé
  { href: "/zazemi/tym", label: "Tým & role", icon: "users" },
  { href: "/zazemi/prvaci", label: "Prváci", icon: "star" },
  // Festival — obsah a provoz
  { href: "/zazemi/program", label: "Program", icon: "mic" },
  { href: "/zazemi/provoz", label: "Provoz & směny", icon: "ops" },
  { href: "/zazemi/kuchyne", label: "Kuchyně & bar", icon: "food" },
  { href: "/zazemi/vyzdoba", label: "Výzdoba", icon: "palette" },
  // Peníze a vnější vztahy
  { href: "/zazemi/sponzori", label: "Sponzoři", icon: "spark" },
  { href: "/zazemi/merch", label: "Merch", icon: "merch" },
  { href: "/zazemi/finance", label: "Finance", icon: "finance" },
  // Reference
  { href: "/zazemi/kontakty", label: "Kontakty", icon: "contacts" },
];

export default function ZazemiLayout({ children }: { children: React.ReactNode }) {
  const { ready, authed, me, logout, syncError, dismissSyncError, db, currentYear, canEditCurrentYear } = useStore();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [boardUnread, setBoardUnread] = useState(0);

  useEffect(() => {
    if (ready && !authed) router.replace("/prihlaseni");
  }, [ready, authed, router]);

  // Odznak nepřečtených na Nástěnce: spočítej příspěvky novější než poslední
  // návštěva nástěnky (per prohlížeč). Na /zazemi se vše označí za přečtené.
  useEffect(() => {
    let count = 0;
    if (currentYear) {
      const key = `marena_board_seen_${currentYear.id}`;
      if (pathname === "/zazemi") {
        try {
          localStorage.setItem(key, new Date().toISOString());
        } catch {
          /* ignore */
        }
      } else {
        let seen = "";
        try {
          seen = localStorage.getItem(key) || "";
        } catch {
          /* ignore */
        }
        count = (currentYear.posts ?? []).filter((p) => p.createdAt > seen && !sameName(p.author, me)).length;
      }
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBoardUnread(count);
  }, [currentYear, pathname, me]);

  if (!ready) return <Loading />;
  if (!authed) return <Loading label="Přesměrování na přihlášení…" />;
  // Bez kompletního záznamu (jméno + e-mail + telefon) se do týmu nevstoupí.
  // Platí pro nové, smazané i členy s neúplným kontaktem (kromě správce).
  const myMember = currentYear?.members.find((m) => sameName(m.name, me));
  const incompleteContact = !!myMember && (!myMember.email?.trim() || !myMember.phone?.trim());
  if (!me || (currentYear && canEditCurrentYear && !isAdmin(me) && (!myMember || incompleteContact))) return <IdentityGate />;

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
                {n.href === "/zazemi" && boardUnread > 0 && (
                  <span className="grid h-5 min-w-[20px] place-items-center rounded-full bg-red-600 px-1 text-[11px] font-bold leading-none text-white">
                    {boardUnread}
                  </span>
                )}
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
              onClick={() => setArchiveOpen(true)}
              title="Stáhnout archiv (PDF / ZIP fotek) a uvolnit místo na další roky"
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
                    {n.href === "/zazemi" && boardUnread > 0 && (
                      <span className="ml-auto grid h-5 min-w-[20px] place-items-center rounded-full bg-red-600 px-1 text-[11px] font-bold leading-none text-white">
                        {boardUnread}
                      </span>
                    )}
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
                    setArchiveOpen(true);
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

      {isAdmin(me) && <ArchiveModal open={archiveOpen} onClose={() => setArchiveOpen(false)} />}

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
        <input value={val} onChange={(e) => setVal(e.target.value)} className="w-28 rounded-full border border-ink/15 px-3 py-1.5 text-base sm:text-sm" />
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

// Vstupní brána do zázemí. Dva režimy:
//  • „Už mám účet" — stačí e-mail z registrace (na novém zařízení se jím přihlásíš).
//    Správce (Mařena) se přihlásí jen jménem „Mařena", nic dalšího nevyplňuje.
//  • „Zaregistrovat se" — jméno + e-mail + telefon; založí se člen v aktuálním ročníku.
function IdentityGate() {
  const { setMe, me, currentYear, canEditCurrentYear, dispatch } = useStore();
  const [mode, setMode] = useState<"login" | "register">("login");

  // Přihlášení (už mám účet) — e-mail; správce zadá jméno Mařena.
  const [loginId, setLoginId] = useState("");

  // Registrace (nový účet)
  const [name, setName] = useState(me);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const touched = useRef({ email: false, phone: false }); // ať se ručně psané nepřepíše

  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const matched = currentYear?.members.find((m) => sameName(m.name, name));

  function onNameChange(v: string) {
    setName(v);
    const member = currentYear?.members.find((m) => sameName(m.name, v));
    if (member) {
      if (!touched.current.email && member.email) setEmail(member.email);
      if (!touched.current.phone && member.phone) setPhone(member.phone);
    }
  }

  function doLogin(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    const val = loginId.trim();
    if (!val) return setErr("Zadej e-mail. (Správce zadá jméno Mařena.)");
    // Správce: stačí jméno Mařena, žádný kontakt.
    if (isAdmin(val)) return setMe(ADMIN_NAME);
    // Najdi člena podle e-mailu z registrace v aktuálním ročníku.
    const member = (currentYear?.members ?? []).find((m) => m.email && m.email.trim().toLowerCase() === val.toLowerCase());
    if (!member) return setErr("Účet s tímto e-mailem nenajdeme. Vlevo se nejdřív zaregistruj.");
    setMe(member.name);
  }

  async function doRegister(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    const n = name.trim();
    if (!n) return setErr("Vyplň jméno.");
    if (!email.trim()) return setErr("Vyplň e-mail.");
    if (!phone.trim()) return setErr("Vyplň telefon.");
    setBusy(true);
    // Založ (nebo doplň) člena s kontaktem v aktuálním ročníku.
    if (currentYear && canEditCurrentYear) {
      const existing = currentYear.members.find((m) => sameName(m.name, n));
      if (existing) {
        await dispatch({ type: "updateMember", yearId: currentYear.id, memberId: existing.id, patch: { email: email.trim(), phone: phone.trim() } });
      } else {
        await dispatch({ type: "addMember", yearId: currentYear.id, name: n, roleIds: [], email: email.trim(), phone: phone.trim() });
      }
    }
    setMe(n);
  }

  return (
    <div className="grid min-h-screen place-items-center px-4">
      <div className="card w-full max-w-sm p-7">
        <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-marigold-100 text-2xl">👋</div>
        <h1 className="text-center font-display text-xl font-semibold">Vítej v zázemí Mařeny</h1>

        {/* Přepínač: už mám účet / zaregistrovat se */}
        <div className="mt-4 inline-flex w-full rounded-full bg-paper2 p-0.5 text-sm">
          {(["login", "register"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setMode(m);
                setErr(null);
              }}
              className={`flex-1 rounded-full px-3 py-1.5 font-medium transition ${mode === m ? "bg-white text-ink shadow-sm" : "text-ink-soft"}`}
            >
              {m === "login" ? "Už mám účet" : "Zaregistrovat se"}
            </button>
          ))}
        </div>

        {mode === "login" ? (
          <form className="mt-4 flex flex-col gap-2" onSubmit={doLogin}>
            <p className="text-center text-sm text-ink-soft">Zadej e-mail, který jsi použil/a při registraci.</p>
            <input
              className="input"
              placeholder="E-mail (správce napíše: Mařena)"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              autoFocus
            />
            {err && <p className="text-sm text-red-600">{err}</p>}
            <button className="btn-primary mt-1" type="submit">
              Vstoupit do zázemí
            </button>
          </form>
        ) : (
          <form className="mt-4 flex flex-col gap-2" onSubmit={doRegister}>
            <p className="text-center text-sm text-ink-soft">Vyplň jméno, e-mail a telefon — ať tě ostatní v týmu zastihnou.</p>
            <input className="input" placeholder="Jméno a příjmení" value={name} onChange={(e) => onNameChange(e.target.value)} autoFocus />
            <input
              className="input"
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => {
                touched.current.email = true;
                setEmail(e.target.value);
              }}
            />
            <input
              className="input"
              type="tel"
              placeholder="Telefon (+420…)"
              value={phone}
              onChange={(e) => {
                touched.current.phone = true;
                setPhone(e.target.value);
              }}
            />
            {matched && <p className="text-xs text-leaf-700">👋 Vítej zpátky, {matched.name}! Kontakt jsme ti předvyplnili.</p>}
            {err && <p className="text-sm text-red-600">{err}</p>}
            <button className="btn-primary mt-1" type="submit" disabled={busy}>
              {busy ? "Ukládám…" : "Vytvořit účet a vstoupit"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
