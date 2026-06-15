import Link from "next/link";
import { Logo } from "@/components/Logo";
import { IconPlus } from "@/components/Icons";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="no-print sticky top-0 z-20 border-b border-stone-200 bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <Link href="/prehled" aria-label="Přehled">
            <Logo />
          </Link>
          <Link href="/nemovitost/zalozit" className="btn-primary btn-sm">
            <IconPlus className="h-4 w-4" />
            <span className="hidden sm:inline">Založit pas</span>
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
    </div>
  );
}
