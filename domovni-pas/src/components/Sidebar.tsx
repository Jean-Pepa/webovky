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
  IconSearch,
} from "@/components/Icons";

type NavItem = { href: string; label: string; icon: React.ComponentType<{ className?: string }> };

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
    { href: "/prehled", label: "Přehled", icon: IconHome },
    { href: "/hledat", label: "Hledat", icon: IconSearch },
    { href: "/statistiky", label: "Statistiky", icon: IconChart },
    { href: "/kalendar", label: "Kalendář", icon: IconShield },
    { href: "/pripominky", label: "Připomínky", icon: IconCalendar },
    { href: "/dokumenty", label: "Dokumenty", icon: IconFile },
  ],
};

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { role, logout } = useStore();

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const nav = NAV_BY_ROLE[role ?? "CLIENT"];

  return (
    <aside className="no-print fixed inset-y-0 left-0 z-30 flex w-16 flex-col border-r border-stone-200 bg-white lg:w-64">
      {/* Logo — jen na desktopu (na mobilu je BULO na horní liště) */}
      <div className="hidden h-16 shrink-0 items-center border-b border-stone-100 px-5 lg:flex">
        <Link href="/prehled" aria-label="BULO">
          <Logo />
        </Link>
      </div>

      {/* Účet (role) — odkaz na nastavení */}
      <div className="px-2 py-3 lg:px-3">
        <Link
          href="/ucet"
          title="Nastavení účtu"
          className={`flex items-center justify-center gap-3 rounded-lg p-2 transition hover:bg-stone-100 lg:justify-start ${
            isActive("/ucet") ? "bg-teal-50" : ""
          }`}
        >
          <span
            className={`grid h-9 w-9 shrink-0 place-items-center rounded-full bg-teal-700 text-sm font-semibold text-white ${
              isActive("/ucet") ? "ring-2 ring-teal-300 ring-offset-2 ring-offset-white" : ""
            }`}
          >
            {role ? ROLE_INITIALS[role] : "—"}
          </span>
          <p className="hidden min-w-0 flex-1 truncate text-sm font-medium text-stone-800 lg:block">
            {role ? ROLE_LABELS[role] : "BULO"}
          </p>
        </Link>
      </div>

      {/* Navigace */}
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-2 lg:px-3">
        {nav.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
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
      </nav>

      {/* Akce podle role + odhlášení */}
      <div className="space-y-2 px-2 py-3 lg:px-3">
        {(role === "CLIENT" || role === "CREATOR") && (
          <Link
            href="/nemovitost/zalozit"
            title="Založit pas"
            className="btn-primary w-full px-0 lg:px-4"
          >
            <IconPlus className="h-4 w-4 shrink-0" />
            <span className="hidden lg:inline">Založit pas</span>
          </Link>
        )}
        {(role === "ARCHITECT" || role === "CREATOR") && (
          <Link
            href="/projekt/novy"
            title="Přidat projekt"
            className={`w-full px-0 lg:px-4 ${role === "ARCHITECT" ? "btn-primary" : "btn-secondary"}`}
          >
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
