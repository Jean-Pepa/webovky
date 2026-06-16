"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/Logo";
import { useStore, type Role } from "@/lib/store";
import { ROLE_LABELS, ROLE_INITIALS } from "@/lib/access";
import {
  IconHome,
  IconCalendar,
  IconFile,
  IconPlus,
  IconMenu,
  IconClose,
  IconBuilding,
  IconLogout,
  IconChart,
} from "@/components/Icons";

type NavItem = { href: string; label: string; icon: React.ComponentType<{ className?: string }> };

const NAV_BY_ROLE: Record<Role, NavItem[]> = {
  CLIENT: [
    { href: "/prehled", label: "Moje nemovitosti", icon: IconHome },
    { href: "/pripominky", label: "Připomínky", icon: IconCalendar },
    { href: "/dokumenty", label: "Dokumenty", icon: IconFile },
  ],
  ARCHITECT: [
    { href: "/prehled", label: "Moje projekty", icon: IconBuilding },
    { href: "/dokumenty", label: "Dokumenty", icon: IconFile },
  ],
  CREATOR: [
    { href: "/prehled", label: "Přehled", icon: IconHome },
    { href: "/statistiky", label: "Statistiky", icon: IconChart },
    { href: "/pripominky", label: "Připomínky", icon: IconCalendar },
    { href: "/dokumenty", label: "Dokumenty", icon: IconFile },
  ],
};

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { role, logout } = useStore();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const nav = NAV_BY_ROLE[role ?? "CLIENT"];

  const inner = (
    <>
      <div className="px-5 pt-5">
        <Link href="/prehled" onClick={() => setOpen(false)}>
          <Logo />
        </Link>
      </div>

      <div className="mt-5 flex items-center gap-3 px-5">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-teal-700 text-sm font-semibold text-white">
          {role ? ROLE_INITIALS[role] : "—"}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-stone-800">
            {role ? ROLE_LABELS[role] : "BULO"}
          </p>
          <button
            onClick={() => {
              logout();
              setOpen(false);
              router.push("/");
            }}
            className="inline-flex items-center gap-1 text-xs text-stone-400 transition hover:text-red-600"
          >
            <IconLogout className="h-3.5 w-3.5" />
            Odhlásit se
          </button>
        </div>
      </div>

      <nav className="mt-5 flex flex-1 flex-col gap-1 px-3">
        {nav.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                active ? "bg-teal-50 text-teal-800" : "text-stone-600 hover:bg-stone-100"
              }`}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-2 p-3">
        {(role === "CLIENT" || role === "CREATOR") && (
          <Link
            href="/nemovitost/zalozit"
            onClick={() => setOpen(false)}
            className="btn-primary w-full"
          >
            <IconPlus className="h-4 w-4" />
            Založit pas
          </Link>
        )}
        {(role === "ARCHITECT" || role === "CREATOR") && (
          <Link
            href="/projekt/novy"
            onClick={() => setOpen(false)}
            className={`w-full ${role === "ARCHITECT" ? "btn-primary" : "btn-secondary"}`}
          >
            <IconBuilding className="h-4 w-4" />
            Předat projekt
          </Link>
        )}
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="no-print fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-stone-200 bg-white lg:flex">
        {inner}
      </aside>

      {/* Mobilní horní lišta */}
      <div className="no-print sticky top-0 z-30 flex items-center justify-between border-b border-stone-200 bg-white/90 px-4 py-3 backdrop-blur lg:hidden">
        <Link href="/prehled">
          <Logo />
        </Link>
        <button onClick={() => setOpen(true)} className="btn-ghost btn-sm" aria-label="Otevřít menu">
          <IconMenu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobilní drawer */}
      {open && (
        <div className="no-print fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-72 flex-col bg-white shadow-xl">
            <button
              onClick={() => setOpen(false)}
              className="absolute right-3 top-4 text-stone-400 hover:text-stone-700"
              aria-label="Zavřít menu"
            >
              <IconClose className="h-5 w-5" />
            </button>
            {inner}
          </aside>
        </div>
      )}
    </>
  );
}
