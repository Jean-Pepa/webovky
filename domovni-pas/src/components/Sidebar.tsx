"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { useStore, type Role } from "@/lib/store";
import { ROLE_LABELS, ROLE_INITIALS } from "@/lib/access";
import {
  IconHome,
  IconCalendar,
  IconFile,
  IconPlus,
  IconBuilding,
  IconLogout,
  IconChart,
  IconShield,
  IconMoney,
  IconCamera,
  IconBox,
  IconUsers,
  IconWrench,
  IconArrowLeft,
  IconMegaphone,
  IconPhone,
  IconVote,
  IconKey,
  IconDownload,
  IconCheck,
} from "@/components/Icons";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
};

type NavGroup = { title?: string; items: NavItem[] };

const NAV_BY_ROLE: Record<Role, NavItem[]> = {
  CLIENT: [
    { href: "/prehled", label: "Moje nemovitosti", icon: IconHome },
    { href: "/kalendar", label: "Záruky a revize", icon: IconShield },
    { href: "/statistiky", label: "Statistiky", icon: IconChart },
    { href: "/pripominky", label: "Připomínky", icon: IconCalendar },
    { href: "/dokumenty", label: "Dokumenty", icon: IconFile },
  ],
  ARCHITECT: [
    { href: "/prehled", label: "Moje projekty", icon: IconBuilding },
    { href: "/dokumenty", label: "Dokumenty", icon: IconFile },
  ],
  CREATOR: [
    { href: "/prehled", label: "Moje domy", icon: IconHome },
    { href: "/kalendar", label: "Revize a termíny", icon: IconShield },
    { href: "/pripominky", label: "Připomínky", icon: IconCalendar },
    { href: "/dokumenty", label: "Dokumenty", icon: IconFile },
  ],
  OWNER: [
    { href: "/prehled", label: "Náš dům", icon: IconHome },
    { href: "/dokumenty", label: "Dokumenty", icon: IconFile },
  ],
};

// Navigace pro bytový dům / SVJ — struktura jako v SVJ aplikacích
// (Nástěnka / Oblíbené / Menu). Výbor (CREATOR) má vše, rezident (OWNER) zúžený výběr.
function svjGroups(id: string, role: Role | null): NavGroup[] {
  const manage = role === "CREATOR";
  const b = (s: string) => `/nemovitost/${id}${s}`;

  const oblibene: NavItem[] = [
    { href: b("/sousede"), label: "Vlastníci a sousedé", icon: IconUsers },
    { href: b("/dokumentace"), label: "Dokumenty", icon: IconFile },
    { href: b("/kontakty"), label: "Adresář kontaktů", icon: IconPhone },
  ];

  const menu: NavItem[] = [
    { href: b("/udalosti"), label: "Kalendář událostí", icon: IconCalendar },
    { href: b("/zpravy"), label: "Zprávy", icon: IconMegaphone },
    ...(manage ? [{ href: b("/vlastnici"), label: "Jednotky a místnosti", icon: IconKey }] : []),
    { href: b("/konzultace"), label: "Hlášení a požadavky", icon: IconWrench },
    { href: b("/diskuze"), label: "Diskuze", icon: IconUsers },
    { href: b("/ankety"), label: "Ankety", icon: IconChart },
    { href: b("/hlasovani"), label: "Hlasování", icon: IconVote },
    { href: b("/shromazdeni"), label: "Shromáždění vlastníků", icon: IconUsers },
    { href: b("/zaruky"), label: "Revize a termíny", icon: IconShield },
    { href: b("/fotogalerie"), label: "Fotogalerie", icon: IconCamera },
    { href: b("/pozadavky"), label: "Požadavky ke schválení", icon: IconCheck },
    { href: b("/detail"), label: "Detail společenství", icon: IconBuilding },
    { href: b("/poplatky"), label: "Přehled poplatků", icon: IconMoney },
    ...(manage
      ? [
          { href: b("/odecty"), label: "Odečty měřidel", icon: IconChart },
          { href: b("/rozpocet"), label: "Náklady / fond oprav", icon: IconMoney },
          { href: b("/import"), label: "Import / Export", icon: IconDownload },
        ]
      : []),
  ];

  return [
    { items: [{ href: b(""), label: "Nástěnka", icon: IconHome, exact: true }] },
    { title: "Oblíbené", items: oblibene },
    { title: "Menu", items: menu },
  ];
}

function houseNav(id: string, role: Role | null): NavItem[] {
  const items: NavItem[] = [
    { href: `/nemovitost/${id}`, label: "Přehled domu", icon: IconHome, exact: true },
    { href: `/nemovitost/${id}/zaruky`, label: "Záruky a revize", icon: IconShield },
    { href: `/nemovitost/${id}/rozpocet`, label: "Náklady", icon: IconMoney },
    { href: `/nemovitost/${id}/dokumentace`, label: "Dokumentace", icon: IconFile },
    { href: `/nemovitost/${id}/navrhy`, label: "Návrhy", icon: IconCamera },
    { href: `/nemovitost/${id}/vybaveni`, label: "Vybavení", icon: IconBox },
    { href: `/nemovitost/${id}/konzultace`, label: "Konzultace", icon: IconUsers },
  ];
  if (role === "ARCHITECT" || role === "CREATOR") {
    items.push({ href: `/nemovitost/${id}/povoleni`, label: "Stavební povolení", icon: IconBuilding });
    items.push({ href: `/nemovitost/${id}/firmy`, label: "Výběr firmy", icon: IconWrench });
  }
  return items;
}

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { role, logout, getProperty } = useStore();

  // Jsme v detailu konkrétního domu? Pak je lišta kontextová.
  const m = pathname.match(/^\/nemovitost\/([^/]+)/);
  const houseId = m && !["nova", "zalozit"].includes(m[1]) ? m[1] : null;
  const inHouse = !!houseId;
  const houseType = houseId ? getProperty(houseId)?.type : undefined;

  const isActive = (item: NavItem) =>
    item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);

  const groups: NavGroup[] = inHouse
    ? houseType === "BUILDING"
      ? svjGroups(houseId!, role)
      : [{ items: houseNav(houseId!, role) }]
    : [{ items: NAV_BY_ROLE[role ?? "CLIENT"] }];

  return (
    <aside className="no-print fixed inset-y-0 left-0 z-30 flex w-16 flex-col border-r border-stone-200 bg-white lg:w-64">
      {/* Logo */}
      <div className="hidden h-16 shrink-0 items-center border-b border-stone-100 px-5 lg:flex">
        <Link href="/prehled" aria-label="BULO">
          <Logo />
        </Link>
      </div>

      {/* Účet (role) */}
      <div className="px-2 py-3 lg:px-3">
        <Link
          href="/ucet"
          title="Nastavení účtu"
          className={`flex items-center justify-center gap-3 rounded-lg p-2 transition hover:bg-stone-100 lg:justify-start ${
            pathname.startsWith("/ucet") ? "bg-teal-50" : ""
          }`}
        >
          <span
            className={`grid h-9 w-9 shrink-0 place-items-center rounded-full bg-teal-700 text-sm font-semibold text-white ${
              pathname.startsWith("/ucet") ? "ring-2 ring-teal-300 ring-offset-2 ring-offset-white" : ""
            }`}
          >
            {role ? ROLE_INITIALS[role] : "—"}
          </span>
          <p className="hidden min-w-0 flex-1 truncate text-sm font-medium text-stone-800 lg:block">
            {role ? ROLE_LABELS[role] : "BULO"}
          </p>
        </Link>
      </div>

      {/* Zpět na přehled (v detailu domu) */}
      {inHouse && (
        <Link
          href="/prehled"
          title="Zpět na přehled"
          className="mx-2 mb-1 flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium text-stone-500 transition hover:bg-stone-100 lg:mx-3 lg:justify-start lg:px-3"
        >
          <IconArrowLeft className="h-4 w-4 shrink-0" />
          <span className="hidden lg:inline">Zpět na přehled</span>
        </Link>
      )}

      {/* Navigace (role nebo dům) */}
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-2 lg:px-3">
        {groups.map((g, gi) => (
          <div key={gi} className={gi > 0 ? "mt-3" : ""}>
            {g.title && (
              <p className="hidden px-3 pb-1 pt-1 text-[11px] font-semibold uppercase tracking-wide text-stone-400 lg:block">
                {g.title}
              </p>
            )}
            <div className="flex flex-col gap-1">
              {g.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={item.label}
                    className={`flex items-center justify-center gap-3 rounded-lg py-2.5 text-sm font-medium transition lg:justify-start lg:px-3 ${
                      active ? "bg-teal-50 text-teal-800" : "text-stone-600 hover:bg-stone-100"
                    }`}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    <span className="hidden lg:inline">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Akce + odhlášení */}
      <div className="space-y-2 px-2 py-3 lg:px-3">
        {!inHouse && (role === "CLIENT" || role === "CREATOR") && (
          <Link href="/nemovitost/zalozit" title="Založit pas" className="btn-primary w-full px-0 lg:px-4">
            <IconPlus className="h-4 w-4 shrink-0" />
            <span className="hidden lg:inline">Založit pas</span>
          </Link>
        )}
        {!inHouse && role === "ARCHITECT" && (
          <Link href="/projekt/novy" title="Přidat projekt" className="btn-primary w-full px-0 lg:px-4">
            <IconBuilding className="h-4 w-4 shrink-0" />
            <span className="hidden lg:inline">Přidat projekt</span>
          </Link>
        )}
        <button
          onClick={() => {
            logout();
            router.push("/");
          }}
          title="Odhlásit se"
          className="btn-ghost w-full px-0 text-stone-500 hover:text-red-600 lg:px-4"
        >
          <IconLogout className="h-4 w-4 shrink-0" />
          <span className="hidden lg:inline">Odhlásit se</span>
        </button>
      </div>
    </aside>
  );
}
