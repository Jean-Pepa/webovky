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
import { ChangePasswordModal } from "@/components/ChangePasswordModal";
import { SupabaseGate } from "@/components/SupabaseGate";
import { FlashHost } from "@/components/Flash";
import { AdminApprovals } from "@/components/AdminApprovals";
import { ThemeToggle, useZazemiTheme } from "@/components/ThemeToggle";
import { supabaseEnabled } from "@/lib/supabase/config";

// Navigace: Nástěnka přímo (1 ťuk) + 2 skupiny se sekcemi (2 ťuky na cokoli).
// Mobil = spodní lišta se 3 topicy, skupina vysune panel; desktop = rozbalovací
// menu v hlavičce. Nástroje (Almanach, Správa webu…) žijí v hamburgeru.
type NavItem = { href: string; label: string; icon: IconName };
type NavGroup = { id: string; label: string; icon: IconName; sections: { title: string; items: NavItem[] }[] };

const GROUPS: NavGroup[] = [
  {
    id: "plan",
    label: "Plán & lidé",
    icon: "calendar",
    sections: [
      {
        title: "Plán",
        items: [
          { href: "/zazemi/hlasovani", label: "Hlasování", icon: "vote" },
          { href: "/zazemi/kalendar", label: "Kalendář", icon: "calendar" },
          { href: "/zazemi/ukoly", label: "Úkoly", icon: "tasks" },
        ],
      },
      {
        title: "Lidé",
        items: [
          { href: "/zazemi/tym", label: "Tým & role", icon: "users" },
          { href: "/zazemi/prvaci", label: "Prváci", icon: "star" },
          { href: "/zazemi/kontakty", label: "Kontakty", icon: "contacts" },
        ],
      },
    ],
  },
  {
    id: "festival",
    label: "Festival & peníze",
    icon: "flag",
    sections: [
      {
        title: "Festival",
        items: [
          { href: "/zazemi/program", label: "Program", icon: "mic" },
          { href: "/zazemi/provoz", label: "Provoz & směny", icon: "ops" },
          { href: "/zazemi/kuchyne", label: "Kuchyně & bar", icon: "food" },
          { href: "/zazemi/vyzdoba", label: "Výzdoba", icon: "palette" },
        ],
      },
      {
        title: "Peníze",
        items: [
          { href: "/zazemi/prodej", label: "Prodej", icon: "cart" },
          { href: "/zazemi/finance", label: "Finance", icon: "finance" },
          { href: "/zazemi/sponzori", label: "Sponzoři", icon: "spark" },
          { href: "/zazemi/merch", label: "Merch", icon: "merch" },
        ],
      },
    ],
  },
];
const groupHrefs = (g: NavGroup) => g.sections.flatMap((s) => s.items.map((i) => i.href));

export default function ZazemiLayout({ children }: { children: React.ReactNode }) {
  const { ready, authed, me, logout, syncError, dismissSyncError, db, currentYear, canEditCurrentYear, pendingApproval } = useStore();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  // Omezení přístupu (nastavuje správce v Týmu):
  //  • posOnly = pomocník u stánku → vidí jen Prodej.
  //  • vyberOnly = výběrčí vkladů → vidí jen Finance → Výběr.
  // Obojí jsou brigádníci, kteří nemají vidět zbytek zázemí.
  const meMember = currentYear?.members.find((m) => sameName(m.name, me));
  const posOnly = !isAdmin(me) && !!meMember?.posOnly;
  const vyberOnly = !isAdmin(me) && !posOnly && !!meMember?.vyberOnly;
  const restricted = posOnly || vyberOnly;
  const restrictHref = vyberOnly ? "/zazemi/finance" : "/zazemi/prodej";
  const restrictLabel = vyberOnly ? "Výběr" : "Prodej";
  const restrictIcon: IconName = vyberOnly ? "finance" : "cart";
  const restrictBadge = vyberOnly ? "💰 Máš přístup jen k výběru peněz" : "🛒 Máš přístup jen k Prodeji";
  useEffect(() => {
    if (restricted && pathname.startsWith("/zazemi") && pathname !== restrictHref) {
      router.replace(restrictHref);
    }
  }, [restricted, restrictHref, pathname, router]);
  const [sheet, setSheet] = useState<string | null>(null); // otevřená skupina spodní lišty (mobil)
  const [deskMenu, setDeskMenu] = useState<string | null>(null); // otevřené rozbalovací menu (desktop)
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [pwdOpen, setPwdOpen] = useState(false);
  const [boardUnread, setBoardUnread] = useState(0);
  const [maint, setMaint] = useState<boolean | null>(null); // režim údržby (null = ještě nevíme)
  const { dark, toggle: toggleTheme } = useZazemiTheme();

  useEffect(() => {
    if (ready && !authed) router.replace("/prihlaseni");
  }, [ready, authed, router]);

  // Stav údržby — načti a pravidelně osvěžuj, ať se členům zámek projeví i bez
  // reloadu, když ho správce přepne.
  useEffect(() => {
    let alive = true;
    const load = () =>
      fetch("/api/maintenance", { cache: "no-store" })
        .then((r) => r.json())
        .then((d: { maintenance?: boolean }) => {
          if (alive) setMaint(!!d.maintenance);
        })
        .catch(() => {});
    load();
    // Často kontroluj (rychlé zamčení i bez reloadu) + hned při návratu na okno/záložku.
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
  if (supabaseEnabled()) {
    // S Supabase se jméno odvodí z přihlášeného e-mailu (žádné ruční zadávání).
    if (!me) return <SupabaseGate />;
  } else {
    // Bez kompletního záznamu (jméno + e-mail + telefon) se do týmu nevstoupí.
    // Platí pro nové, smazané i členy s neúplným kontaktem (kromě správce).
    const incompleteContact = !!meMember && (!meMember.email?.trim() || !meMember.phone?.trim());
    if (!me || (currentYear && canEditCurrentYear && !isAdmin(me) && (!meMember || incompleteContact))) return <IdentityGate />;
  }

  async function doLogout() {
    setMenuOpen(false);
    await logout();
    // Tvrdé přesměrování na úvod — kompletně vyčistí stav appky, takže příště
    // se musí znovu zadat heslo do zázemí i přihlášení.
    window.location.assign("/");
  }

  return (
    <div className="min-h-screen">
      <FlashHost />
      {/* pt env(safe-area) — v PWA režimu na iPhonu drží obsah pod hodinami/výřezem. */}
      <header className="sticky top-0 z-30 border-b border-ink/10 bg-paper/85 pt-[env(safe-area-inset-top)] backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-x-4 gap-y-2 px-4 py-3">
          <div className="flex items-baseline gap-2">
            {/* Zlatý „Las Vegas" nápis jako na homepage — bez tmavé cedulky, sytý zlatý přechod je čitelný i na světlém pozadí zázemí. */}
            <Link
              href="/zazemi"
              aria-label="Mařena — zázemí"
              className="marena-header-gold font-display text-2xl font-extrabold uppercase tracking-[0.05em] sm:text-3xl"
            >
              MAŘENA
            </Link>
            {currentYear && (
              <span className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                {currentYear.label.match(/\d{4}/)?.[0] ?? currentYear.id}
              </span>
            )}
          </div>
          {/* Desktop: přepínač den/noc + heslo (správce) + přepínač ročníku + jméno */}
          <div className="ml-auto hidden items-center gap-2 md:flex">
            <ThemeToggle dark={dark} onToggle={toggleTheme} />
            {isAdmin(me) && (
              <button
                onClick={() => setPwdOpen(true)}
                title="Změnit heslo do zázemí"
                className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium text-ink-soft ring-1 ring-ink/10 transition hover:bg-ink/5"
              >
                🔑 Heslo
              </button>
            )}
            <YearSwitcher />
            <MeBadge />
            {isAdmin(me) && <AppPowerToggle maint={maint} onChanged={setMaint} />}
          </div>
          {/* Mobil: přepínač den/noc (vlevo od hamburgeru) + hamburger */}
          <div className="ml-auto flex items-center gap-1 md:hidden">
            <ThemeToggle dark={dark} onToggle={toggleTheme} />
            <button
              className="inline-flex items-center justify-center rounded-full p-2 text-ink-soft hover:bg-ink/5"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? "Zavřít menu" : "Otevřít menu"}
              aria-expanded={menuOpen}
            >
              <Icon name={menuOpen ? "close" : "menu"} className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Desktopová navigace — Nástěnka + 2 rozbalovací skupiny, nástroje vpravo.
            Pomocník u stánku (posOnly) vidí jen Prodej + Odhlásit. */}
        <nav className="mx-auto hidden max-w-6xl flex-wrap items-center gap-1 px-3 pb-2 md:flex">
          {restricted ? (
            <>
              <Link
                href={restrictHref}
                className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-gold-500 px-3.5 py-1.5 text-sm font-medium text-[#1d1d1f]"
              >
                <Icon name={restrictIcon} className="h-4 w-4" /> {restrictLabel}
              </Link>
              <button
                onClick={doLogout}
                className="ml-auto inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium text-ink-soft hover:bg-ink/5"
              >
                <Icon name="logout" className="h-4 w-4" /> Odhlásit
              </button>
            </>
          ) : (
            <>
          <Link
            href="/zazemi"
            onClick={() => setDeskMenu(null)}
            className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
              pathname === "/zazemi" ? "bg-gold-500 text-[#1d1d1f]" : "text-ink-soft hover:bg-ink/5"
            }`}
          >
            <Icon name="board" className="h-4 w-4" /> Nástěnka
            {boardUnread > 0 && (
              <span className="grid h-5 min-w-[20px] place-items-center rounded-full bg-red-600 px-1 text-[11px] font-bold leading-none text-white">
                {boardUnread}
              </span>
            )}
          </Link>
          {GROUPS.map((g) => {
            const active = groupHrefs(g).includes(pathname);
            const open = deskMenu === g.id;
            return (
              <div key={g.id} className="relative">
                <button
                  onClick={() => setDeskMenu(open ? null : g.id)}
                  aria-expanded={open}
                  className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                    active ? "bg-gold-500 text-[#1d1d1f]" : open ? "bg-ink/5 text-ink" : "text-ink-soft hover:bg-ink/5"
                  }`}
                >
                  <Icon name={g.icon} className="h-4 w-4" /> {g.label}
                  <Icon name="chevron" className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
                </button>
                {open && (
                  <>
                    {/* neviditelná plocha — klik mimo menu ho zavře */}
                    <div className="fixed inset-0 z-30" onClick={() => setDeskMenu(null)} aria-hidden />
                    <div className="absolute left-0 top-full z-40 mt-1 w-64 rounded-xl border border-ink/10 bg-surface p-2 shadow-xl">
                      {g.sections.map((s) => (
                        <div key={s.title} className="mb-1 last:mb-0">
                          <p className="px-2.5 pb-1 pt-1.5 text-[11px] font-semibold uppercase tracking-wide text-ink-soft">{s.title}</p>
                          {s.items.map((n) => (
                            <Link
                              key={n.href}
                              href={n.href}
                              onClick={() => setDeskMenu(null)}
                              className={`flex items-center gap-2 rounded-xl px-2.5 py-2 text-sm font-medium ${
                                pathname === n.href ? "bg-gold-500 text-[#1d1d1f]" : "text-ink hover:bg-ink/5"
                              }`}
                            >
                              <Icon name={n.icon} className="h-4 w-4" /> {n.label}
                            </Link>
                          ))}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
          <Link
            href="/zazemi/almanach"
            className="ml-auto inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-gold-500 px-3.5 py-1.5 text-sm font-semibold text-[#1d1d1f] transition-colors hover:bg-gold-400"
          >
            <Icon name="book" className="h-4 w-4" /> Almanach
          </Link>
          {isAdmin(me) && (
            <Link
              href="/zazemi/web"
              title="Upravit veřejný web (texty, fotky, novinky)"
              className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium text-white transition-colors ${
                pathname === "/zazemi/web" ? "bg-plum-700" : "bg-plum-600 hover:bg-plum-700"
              }`}
            >
              <Icon name="globe" className="h-4 w-4" /> Web
            </Link>
          )}
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
            className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium text-ink-soft hover:bg-ink/5"
          >
            <Icon name="logout" className="h-4 w-4" /> Odhlásit
          </button>
            </>
          )}
        </nav>

        {/* Mobilní menu (hamburger) — už jen nástroje; stránky jsou ve spodní liště */}
        {menuOpen && (
          <div className="max-h-[calc(100dvh-3.25rem)] overflow-y-auto border-t border-ink/10 bg-paper px-3 py-3 md:hidden">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              {!restricted && <YearSwitcher />}
              <MeBadge />
              {isAdmin(me) && <AppPowerToggle maint={maint} onChanged={setMaint} />}
              {isAdmin(me) && (
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    setPwdOpen(true);
                  }}
                  className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium text-ink-soft ring-1 ring-ink/10 hover:bg-ink/5"
                >
                  🔑 Heslo
                </button>
              )}
            </div>
            <nav className="flex flex-col gap-1">
              {!restricted && (
                <Link
                  href="/zazemi/almanach"
                  onClick={() => setMenuOpen(false)}
                  className="inline-flex items-center gap-2.5 rounded-xl bg-gold-500 px-3 py-2.5 text-[15px] font-semibold text-[#1d1d1f]"
                >
                  <Icon name="book" className="h-5 w-5" /> Almanach
                </Link>
              )}
              {isAdmin(me) && (
                <Link
                  href="/zazemi/web"
                  onClick={() => setMenuOpen(false)}
                  className="inline-flex items-center gap-2.5 rounded-xl bg-plum-600 px-3 py-2.5 text-[15px] font-medium text-white"
                >
                  <Icon name="globe" className="h-5 w-5" /> Správa webu
                </Link>
              )}
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
                className="inline-flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[15px] font-medium text-ink-soft hover:bg-ink/5"
              >
                <Icon name="logout" className="h-5 w-5" /> Odhlásit
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* Správce: vše, co čeká na schválení (účty + role), svítí hned pod hlavičkou */}
      <AdminApprovals />

      {isAdmin(me) && <ArchiveModal open={archiveOpen} onClose={() => setArchiveOpen(false)} />}
      {isAdmin(me) && <ChangePasswordModal open={pwdOpen} onClose={() => setPwdOpen(false)} />}

      {currentYear && !canEditCurrentYear && !pendingApproval && (
        <div className="flex items-center justify-center gap-2 border-b border-red-300 bg-red-50 px-4 py-2 text-center text-xs font-semibold text-red-700">
          <span>🔒 {currentYear.label} je uzamčený ročník — jde jen prohlížet. Měnit lze jen aktuální (nejnovější) ročník.</span>
        </div>
      )}

      {/* Čekání na schválení správcem — velký nápis uprostřed. Vrstva přes celou
          obrazovku zachytává kliknutí (na nic se nedá klikat), ale nástěnku za ní
          je vidět. Jediná akce je odhlášení, ať člověk neuvízne. */}
      {pendingApproval && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink/40 px-4 backdrop-blur-[1px]">
          <div className="max-w-sm rounded-xl bg-amber-500 px-6 py-6 text-center text-white shadow-2xl ring-2 ring-white/30">
            <div className="font-display text-2xl font-bold sm:text-3xl">⏳ Čeká se na schválení</div>
            <div className="mt-2 text-sm text-white/95">
              Jsi v systému, ale dokud tě správce neschválí, nedá se nic ovládat. Mrkni sem za chvíli znovu.
            </div>
            <button
              onClick={doLogout}
              className="mt-4 rounded-full bg-white/20 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-white/30"
            >
              Odhlásit se
            </button>
          </div>
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

      {/* Údržba — když správce vypne aplikaci, ostatní mají přes celou obrazovku
          nápis a nic se nedá ovládat. Správce (může to zase zapnout) je výjimka. */}
      {maint === true && !isAdmin(me) && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink/50 px-4 backdrop-blur-[1px]">
          <div className="max-w-sm rounded-xl bg-ink px-6 py-6 text-center text-white shadow-2xl ring-2 ring-white/15">
            <div className="text-4xl">🛠️</div>
            <div className="mt-2 font-display text-2xl font-bold sm:text-3xl">Probíhá údržba</div>
            <div className="mt-2 text-sm text-white/85">
              Aplikace je dočasně vypnutá. Nedá se nic dělat, dokud ji správce zase nezapne. Zkus to za chvíli.
            </div>
            <button
              onClick={doLogout}
              className="mt-4 rounded-full bg-white/15 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-white/25"
            >
              Odhlásit se
            </button>
          </div>
        </div>
      )}

      {/* Brigádník s omezeným přístupem — informační proužek (mění to jen správce v Týmu) */}
      {restricted && (
        <div className="flex items-center justify-center gap-2 border-b border-gold-300 bg-gold-50 px-4 py-1.5 text-center text-xs font-medium text-gold-800">
          <span>{restrictBadge}</span>
        </div>
      )}

      {/* Spodní odsazení = plovoucí lišta (64 px + 12 px mezera) + bezpečná zóna + rezerva. */}
      <main className="mx-auto max-w-6xl px-4 py-6 pb-[calc(6.25rem+env(safe-area-inset-bottom))] md:pb-6">{children}</main>

      {/* Mobil: ztmavení + vysouvací panel skupiny (nad spodní lištou) */}
      {sheet && <div className="fixed inset-0 z-40 bg-black/40 md:hidden" onClick={() => setSheet(null)} aria-hidden />}
      {sheet &&
        (() => {
          const g = GROUPS.find((x) => x.id === sheet);
          if (!g) return null;
          return (
            <div className="fixed inset-x-0 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-40 mx-3 rounded-2xl border border-ink/10 bg-surface p-3 shadow-2xl md:hidden">
              {g.sections.map((s) => (
                <div key={s.title} className="mb-2 last:mb-0">
                  <p className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wide text-ink-soft">{s.title}</p>
                  <div className="grid gap-1">
                    {s.items.map((n) => (
                      <Link
                        key={n.href}
                        href={n.href}
                        onClick={() => setSheet(null)}
                        className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[15px] font-medium ${
                          pathname === n.href ? "bg-gold-500 text-[#1d1d1f]" : "text-ink hover:bg-ink/5"
                        }`}
                      >
                        <Icon name={n.icon} className="h-5 w-5" /> {n.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          );
        })()}

      {/* Mobil: plovoucí „bublina" (jako chatové pole) — odsazená od krajů i od
          domovského indikátoru, zaoblená, se stínem. Uvnitř M3: 64 px, 24px ikony,
          aktivní stav = jemná zlatá pilulka za ikonou. Brigádník s omezeným
          přístupem (posOnly/vyberOnly) lištu nemá — vidí jen svou jednu sekci. */}
      {!restricted && (
      <nav className="fixed inset-x-3 bottom-[calc(0.5rem+env(safe-area-inset-bottom))] z-40 rounded-[28px] border-2 border-gold-500 bg-paper/95 shadow-lg backdrop-blur md:hidden">
        <div className="grid h-16 grid-cols-3">
          <Link
            href="/zazemi"
            onClick={() => setSheet(null)}
            className={`flex flex-col items-center justify-center gap-1 text-[11px] ${
              pathname === "/zazemi" && !sheet ? "font-semibold text-ink" : "font-medium text-ink-soft"
            }`}
          >
            <span className={`relative grid h-8 w-14 place-items-center rounded-full transition-colors ${pathname === "/zazemi" && !sheet ? "bg-gold-100" : ""}`}>
              <Icon name="board" className="h-6 w-6" />
              {boardUnread > 0 && (
                <span className="absolute right-2 top-0 grid h-4 min-w-[16px] place-items-center rounded-full bg-red-600 px-0.5 text-[9px] font-bold leading-none text-white">
                  {boardUnread}
                </span>
              )}
            </span>
            Nástěnka
          </Link>
          {GROUPS.map((g) => {
            const active = groupHrefs(g).includes(pathname);
            const open = sheet === g.id;
            return (
              <button
                key={g.id}
                onClick={() => setSheet(open ? null : g.id)}
                aria-expanded={open}
                className={`flex flex-col items-center justify-center gap-1 text-[11px] ${
                  open || active ? "font-semibold text-ink" : "font-medium text-ink-soft"
                }`}
              >
                <span className={`grid h-8 w-14 place-items-center rounded-full transition-colors ${open || active ? "bg-gold-100" : ""}`}>
                  <Icon name={g.icon} className="h-6 w-6" />
                </span>
                {g.label}
              </button>
            );
          })}
        </div>
      </nav>
      )}
    </div>
  );
}

// Jméno přihlášeného — jen zobrazení (neměnné klikem). Změna jména jde přes
// tlačítko „Změnit jméno", které znovu otevře přihlašovací okno.
function MeBadge() {
  const { me } = useStore();
  return (
    <span className="chip" title="Tvoje jméno">
      👤 {me}
    </span>
  );
}

// Vypínač aplikace (jen správce). Zapnuto = appka běží; vypnuto = údržba
// (ostatní mají přes celou obrazovku nápis a nic nejde dělat).
function AppPowerToggle({ maint, onChanged }: { maint: boolean | null; onChanged: (next: boolean) => void }) {
  const [busy, setBusy] = useState(false);
  const appOn = maint === false;

  async function toggle() {
    if (maint === null || busy) return;
    const next = !maint; // nový stav údržby
    setBusy(true);
    const r = await fetch("/api/maintenance", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ on: next }),
    }).catch(() => null);
    setBusy(false);
    if (r && r.ok) onChanged(next);
    else alert("Přepnutí se nepovedlo. (Vypínač funguje jen s Redisem, ne v demu.)");
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={maint === null || busy}
      title={appOn ? "Aplikace běží — klikni pro údržbu (vypnutí)" : "Údržba — klikni pro zapnutí aplikace"}
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-ink/10 transition hover:bg-ink/5 disabled:opacity-50"
    >
      <span className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition ${appOn ? "bg-leaf" : "bg-red-500"}`}>
        <span className={`inline-block h-4 w-4 transform rounded-full bg-[#fff] shadow transition ${appOn ? "translate-x-[18px]" : "translate-x-0.5"}`} />
      </span>
      <span className={appOn ? "text-leaf-700" : "text-red-600"}>{appOn ? "Appka běží" : "Údržba"}</span>
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

  // Registrace (nový účet). Telefon začíná českou předvolbou — Slováci si přepíšou
  // na +421, ostatní na svou.
  const [name, setName] = useState(me);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+420 ");
  const touched = useRef({ email: false, phone: false }); // ať se ručně psané nepřepíše

  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Záložní přihlášení správce (login + heslo) — stejné jako na úvodním okně.
  const [admin, setAdmin] = useState(false);
  const [adminName, setAdminName] = useState("Mařena");
  const [adminPass, setAdminPass] = useState("");
  const [adminErr, setAdminErr] = useState<string | null>(null);
  const [adminBusy, setAdminBusy] = useState(false);

  const matched = currentYear?.members.find((m) => sameName(m.name, name));
  // Telefony porovnáváme bez mezer, ať „+420 776…" == „+420776…".
  const samePhone = (a?: string, b?: string) => !!a && !!b && a.replace(/\s+/g, "") === b.replace(/\s+/g, "");

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
    if (res && res.ok) setMe(adminName.trim() || ADMIN_NAME);
    else setAdminErr("Špatné heslo správce.");
  }

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
    const mail = email.trim();
    const tel = phone.trim();
    if (!n) return setErr("Vyplň jméno.");
    if (!mail) return setErr("Vyplň e-mail.");
    if (!tel) return setErr("Vyplň telefon.");

    // Žádné duplicity: e-mail, telefon ani jméno existujícího účtu nejdou znovu
    // zaregistrovat — člověk se má místo toho přihlásit přes „Už mám účet".
    const members = currentYear?.members ?? [];
    const byEmail = members.find((m) => (m.email ?? "").trim().toLowerCase() === mail.toLowerCase());
    if (byEmail) return setErr("Tento e-mail už v týmu existuje. Přihlas se vlevo přes „Už mám účet“.");
    const byPhone = members.find((m) => samePhone(m.phone, tel));
    if (byPhone) return setErr("Tento telefon už v týmu existuje. Přihlas se vlevo přes „Už mám účet“.");
    const byName = members.find((m) => sameName(m.name, n));
    // Jméno s vyplněným e-mailem = už zaregistrovaný účet → blokuj.
    if (byName && (byName.email ?? "").trim()) {
      return setErr("Účet s tímto jménem už existuje. Přihlas se vlevo přes „Už mám účet“.");
    }

    setBusy(true);
    // Založ nového člena — nebo doplň kontakt předpřipravenému členu (bez e-mailu),
    // kterého správce přidal jen jménem; to není duplicita. V obou případech účet
    // čeká na schválení správcem (approved: false) — do té doby je zamčený.
    if (currentYear && canEditCurrentYear) {
      if (byName) {
        await dispatch({ type: "updateMember", yearId: currentYear.id, memberId: byName.id, patch: { email: mail, phone: tel, approved: false } });
      } else {
        await dispatch({ type: "addMember", yearId: currentYear.id, name: n, roleIds: [], email: mail, phone: tel, approved: false });
      }
    }
    setMe(n);
  }

  if (admin) {
    return (
      <div className="grid min-h-screen place-items-center px-4">
        <div className="card w-full max-w-sm p-7">
          <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-gold-100 text-2xl">🔑</div>
          <h1 className="text-center font-display text-xl font-semibold">Přihlášení správce</h1>
          <p className="mt-1 text-center text-sm text-ink-soft">Login a heslo správce.</p>
          <form onSubmit={submitAdmin} className="mt-4 flex flex-col gap-2">
            <input className="input" placeholder="Login (jméno)" value={adminName} onChange={(e) => setAdminName(e.target.value)} />
            <input className="input" type="password" placeholder="Heslo správce" value={adminPass} onChange={(e) => setAdminPass(e.target.value)} autoFocus />
            {adminErr && <p className="text-sm text-red-600">{adminErr}</p>}
            <button className="btn-primary mt-1" type="submit" disabled={adminBusy || !adminPass}>
              {adminBusy ? "Přihlašuji…" : "Vstoupit jako správce"}
            </button>
            <button type="button" onClick={() => setAdmin(false)} className="text-center text-xs text-ink-soft hover:text-ink">
              ← Zpět na přihlášení
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="grid min-h-screen place-items-center px-4">
      <div className="card w-full max-w-sm p-7">
        <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-gold-100 text-2xl">👋</div>
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
              placeholder="E-mail"
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
            {matched &&
              ((matched.email ?? "").trim() ? (
                <p className="text-xs text-amber-700">
                  Účet „{matched.name}“ už existuje — přihlas se vlevo přes „Už mám účet“.
                </p>
              ) : (
                <p className="text-xs text-leaf-700">👋 Vítej zpátky, {matched.name}! Kontakt jsme ti předvyplnili.</p>
              ))}
            {err && <p className="text-sm text-red-600">{err}</p>}
            <button className="btn-primary mt-1" type="submit" disabled={busy}>
              {busy ? "Ukládám…" : "Vytvořit účet a vstoupit"}
            </button>
          </form>
        )}

        <div className="mt-4 border-t border-ink/10 pt-3 text-center">
          <button
            type="button"
            onClick={() => {
              setAdmin(true);
              setErr(null);
            }}
            title="Přihlášení správce (login + heslo)"
            className="inline-flex items-center gap-1 text-xs font-medium text-ink-soft hover:text-ink"
          >
            🔑 Správce
          </button>
        </div>
      </div>
    </div>
  );
}
