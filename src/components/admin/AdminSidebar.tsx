"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/projects", label: "Projekty" },
  { href: "/admin/blog", label: "Blog" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="w-[220px] min-h-screen bg-[#222] text-white flex flex-col">
      <div className="p-6 text-lg font-bold border-b border-white/10">
        KVIN Admin
      </div>

      <nav className="flex-1 py-4">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-6 py-3 text-sm transition-colors ${
                isActive
                  ? "bg-white/10 text-white"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="text-white/60 text-sm hover:text-white transition-colors"
        >
          Odhlásit se
        </button>
      </div>

      <div className="p-4 border-t border-white/10">
        <Link href="/" className="text-white/60 text-sm hover:text-white transition-colors">
          Zpět na web
        </Link>
      </div>
    </aside>
  );
}
