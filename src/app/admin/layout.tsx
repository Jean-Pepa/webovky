import type { Metadata } from "next";
import Link from "@/components/LocLink";
import Logo from "@/components/Logo";

// Administrace se nesmí indexovat.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

const NAV = [
  { href: "/admin", label: "Přehled", icon: "▦" },
  { href: "/admin/produkty", label: "Produkty", icon: "▤" },
  { href: "/admin/objednavky", label: "Objednávky", icon: "▣" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-[var(--color-bg)]">
      {/* Sidebar */}
      <aside className="hidden md:flex w-60 flex-col bg-[var(--color-steel-900)] text-[var(--color-steel-200)] shrink-0">
        <div className="h-16 flex items-center px-5 border-b border-[var(--color-steel-700)]">
          <Logo light />
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-[var(--color-steel-700)] hover:text-white transition text-sm"
            >
              <span className="text-base">{n.icon}</span>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-[var(--color-steel-700)]">
          <Link href="/" className="flex items-center gap-2 px-3 py-2 text-sm hover:text-white">
            ← Zpět na web
          </Link>
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-[var(--color-surface)] border-b border-[var(--color-border)] flex items-center px-6 justify-between">
          <span className="font-semibold">Administrace · provozní přehled</span>
          <div className="flex items-center gap-3">
            <span className="text-sm text-[var(--color-ink-soft)] hidden sm:inline">
              Demo režim
            </span>
            <div className="w-8 h-8 rounded-full grid place-items-center text-white text-sm font-bold" style={{ background: "var(--color-accent)" }}>
              A
            </div>
          </div>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
