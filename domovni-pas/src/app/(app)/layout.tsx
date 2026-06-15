import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { logoutAction } from "@/app/(auth)/actions";
import { Logo } from "@/components/Logo";
import { IconLogout } from "@/components/Icons";
import { USER_ROLES, type UserRole } from "@/lib/enums";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const roleLabel = USER_ROLES[user.role as UserRole] ?? user.role;

  return (
    <div className="min-h-screen">
      <header className="no-print sticky top-0 z-20 border-b border-stone-200 bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <Link href="/prehled" aria-label="Domů">
            <Logo />
          </Link>
          <div className="flex items-center gap-4">
            <div className="hidden text-right leading-tight sm:block">
              <p className="text-sm font-medium text-stone-800">{user.name}</p>
              <p className="text-xs text-stone-400">{roleLabel}</p>
            </div>
            <form action={logoutAction}>
              <button className="btn-ghost btn-sm" title="Odhlásit se">
                <IconLogout className="h-4 w-4" />
                <span className="hidden sm:inline">Odhlásit</span>
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
    </div>
  );
}
