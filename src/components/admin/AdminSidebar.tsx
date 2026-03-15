"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/projects", label: "Projekty" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/about", label: "O mně" },
  { href: "/admin/settings", label: "Nastavení" },
  { href: "/admin/media", label: "Média" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const params = useParams();
  const locale = (params?.locale as string) ?? "cs";
  const { logout } = useAuth();

  return (
    <aside className="w-[220px] min-h-screen bg-white border-r border-black/[0.06] flex flex-col">
      <div className="text-[21px] font-light tracking-widest uppercase text-black" style={{ paddingLeft: 62, paddingTop: 43, paddingBottom: 24 }}>
        INN Admin
      </div>

      <nav className="flex-1 py-2">
        {navItems.map((item) => {
          const fullHref = `/${locale}${item.href}`;
          const isActive =
            pathname === fullHref ||
            (item.href !== "/admin" && pathname?.startsWith(fullHref));

          return (
            <Link
              key={item.href}
              href={fullHref}
              className={`block py-3 text-[21px] transition-colors ${
                isActive
                  ? "border-l-2 border-black font-semibold text-black"
                  : "text-black/65 hover:text-black hover:bg-black/[0.02]"
              }`}
              style={{ paddingLeft: 62 }}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div style={{ paddingLeft: 62, paddingBottom: 16, paddingTop: 16 }}>
        <button
          onClick={async () => {
            await logout();
            window.location.href = `/${locale}`;
          }}
          className="text-black/40 text-[21px] hover:text-black transition-colors"
        >
          Zpět na web
        </button>
      </div>
    </aside>
  );
}
