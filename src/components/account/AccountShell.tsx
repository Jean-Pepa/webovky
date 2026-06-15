import type { ReactNode } from "react";
import Link from "@/components/LocLink";
import BackButton from "@/components/BackButton";
import { UserIcon, ClipboardIcon, HeartIcon } from "@/components/Icons";
import { getLang } from "@/i18n/server";
import { t } from "@/i18n/messages";

type Tab = "prehled" | "objednavky" | "udaje";

export default async function AccountShell({
  active,
  children,
}: {
  active: Tab;
  children: ReactNode;
}) {
  const lang = await getLang();

  const nav = [
    { key: "prehled", href: "/ucet/prehled", label: t(lang, "acc.overview"), icon: UserIcon },
    { key: "objednavky", href: "/ucet/objednavky", label: t(lang, "acc.orders"), icon: ClipboardIcon },
    { key: "udaje", href: "/ucet/udaje", label: t(lang, "acc.details"), icon: UserIcon },
    { key: "oblibene", href: "/oblibene", label: t(lang, "acc.favorites"), icon: HeartIcon },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-center gap-3 mb-5">
        <BackButton />
        <nav className="text-sm text-[var(--color-ink-soft)]">
          <Link href="/" className="hover:text-[var(--color-accent)]">{t(lang, "crumb.home")}</Link>
          <span className="mx-2">/</span>
          <span>{t(lang, "account.my")}</span>
        </nav>
      </div>

      <div className="grid lg:grid-cols-[240px_1fr] gap-8">
        {/* Postranní menu */}
        <aside>
          <div className="bg-white border border-[var(--color-border)] rounded-2xl p-3">
            <div className="flex items-center gap-3 px-2 py-3 border-b border-[var(--color-border)] mb-2">
              <span className="w-10 h-10 rounded-full grid place-items-center text-white" style={{ background: "var(--color-accent)" }}>
                <UserIcon className="w-5 h-5" />
              </span>
              <div className="leading-tight">
                <div className="text-sm font-semibold">{t(lang, "account.my")}</div>
                <div className="text-xs text-[var(--color-ink-soft)]">jan.novak@email.cz</div>
              </div>
            </div>
            <nav className="space-y-1">
              {nav.map((n) => {
                const Icon = n.icon;
                const isActive = n.key === active;
                return (
                  <Link
                    key={n.key}
                    href={n.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                      isActive
                        ? "text-white"
                        : "text-[var(--color-ink-soft)] hover:bg-[var(--color-bg)] hover:text-[var(--color-ink)]"
                    }`}
                    style={isActive ? { background: "var(--color-accent)" } : undefined}
                  >
                    <Icon className="w-4.5 h-4.5" />
                    {n.label}
                  </Link>
                );
              })}
              <Link href="/ucet" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[var(--color-ink-soft)] hover:bg-[var(--color-bg)] hover:text-[var(--color-ink)] transition border-t border-[var(--color-border)] mt-2 pt-3">
                {t(lang, "acc.logout")}
              </Link>
            </nav>
          </div>
        </aside>

        {/* Obsah */}
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
