"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { isAdmin } from "@/lib/admin";
import { myRoleIds } from "@/lib/access";
import { sameName } from "@/lib/names";
import { todayISO } from "@/lib/format";

// Moje agenda — osobní rozcestník na nástěnce podle rolí: každý má svoje
// sekce s počítadly toho, co čeká, na jeden ťuk. Nikomu nic neschovává,
// jen zkracuje cestu. Správce (bez rolí) vidí jen to, co „hoří".
export function MyAgenda() {
  const { currentYear, me } = useStore();
  const year = currentYear;
  if (!year) return null;

  const roles = myRoleIds(year, me);
  const admin = isAdmin(me);
  const chief = roles.includes("hlavni");
  const has = (...ids: string[]) => chief || ids.some((r) => roles.includes(r));

  const pendingOrders = (year.merchOrders ?? []).filter((o) => !o.done).length;
  const unpaid = (year.finances ?? []).filter((f) => !f.paid).length;
  const myTasks = (year.tasks ?? []).filter((t) => !t.done && t.roleId && roles.includes(t.roleId)).length;
  const today = todayISO();
  const shift = (year.shifts ?? []).find((s) => s.date === today && s.people.some((p) => sameName(p, me)));

  const cards: { href: string; emoji: string; label: string; badge?: string }[] = [];
  if (has("merch") || (admin && pendingOrders > 0))
    cards.push({ href: "/zazemi/merch", emoji: "🛍️", label: "Merch", badge: pendingOrders ? `${pendingOrders} čeká` : undefined });
  if (has("bar")) cards.push({ href: "/zazemi/kuchyne", emoji: "🍳", label: "Kuchyně & bar" });
  if (has("merch", "bar")) cards.push({ href: "/zazemi/prodej", emoji: "🛒", label: "Prodej" });
  if (chief || (admin && unpaid > 0))
    cards.push({ href: "/zazemi/finance", emoji: "💰", label: "Finance", badge: unpaid ? `${unpaid} nezaplaceno` : undefined });
  if (has("sponzoring")) cards.push({ href: "/zazemi/sponzori", emoji: "✨", label: "Sponzoři" });
  if (has("vyzdoba")) cards.push({ href: "/zazemi/vyzdoba", emoji: "🎨", label: "Výzdoba" });
  if (has("program", "kapelnik")) cards.push({ href: "/zazemi/program", emoji: "🎤", label: "Program" });
  if (has("prvaci")) cards.push({ href: "/zazemi/prvaci", emoji: "🐣", label: "Prváci" });
  if (myTasks > 0) cards.push({ href: "/zazemi/ukoly", emoji: "✅", label: "Moje úkoly", badge: `${myTasks} nesplněno` });
  if (shift) cards.push({ href: "/zazemi/provoz", emoji: "🕐", label: "Dnešní směna", badge: [shift.area, shift.from].filter(Boolean).join(" · ") });

  if (cards.length === 0) return null;

  return (
    <section>
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-soft/70">Moje agenda</h2>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.href + c.label}
            href={c.href}
            className="card flex items-center gap-2.5 px-3 py-2.5 transition hover:bg-gold-50"
          >
            <span className="text-xl leading-none">{c.emoji}</span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold">{c.label}</span>
              {c.badge && <span className="block truncate text-xs font-medium text-gold-700">{c.badge}</span>}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
