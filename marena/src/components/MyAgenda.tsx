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
  // Výzdobné zóny, kde jsem přihlášený — úkoly té zóny jsou taky moje.
  const myZoneIds = (year.decorZones ?? []).filter((z) => z.members.some((m) => sameName(m, me))).map((z) => z.id);
  // Moje úkoly = přiřazené mně jménem (i z nástěnky), mojí roli, nebo mojí výzdobné zóně.
  const myTasks = (year.tasks ?? []).filter(
    (t) => (t.assignee && sameName(t.assignee, me)) || (t.roleId && roles.includes(t.roleId)) || (t.zoneId && myZoneIds.includes(t.zoneId)),
  );
  const myUndone = myTasks.filter((t) => !t.done).length;
  const today = todayISO();
  const shift = (year.shifts ?? []).find((s) => s.date === today && s.people.some((p) => sameName(p, me)));

  const cards: { href: string; emoji: string; label: string; badge?: string; tone?: "red" | "green" }[] = [];
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
  // Moje úkoly: má-li něco nesplněného → červená, vše hotové → zelená, nic → nezobrazí se.
  if (myTasks.length > 0)
    cards.push({
      href: "/zazemi/ukoly",
      emoji: myUndone > 0 ? "📋" : "✅",
      label: "Moje úkoly",
      badge: myUndone > 0 ? `${myUndone} nesplněno` : "vše splněno",
      tone: myUndone > 0 ? "red" : "green",
    });
  if (shift) cards.push({ href: "/zazemi/provoz", emoji: "🕐", label: "Dnešní směna", badge: [shift.area, shift.from].filter(Boolean).join(" · ") });

  if (cards.length === 0) return null;

  return (
    <section className="agenda-pulse p-3">
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-soft/70">Moje agenda</h2>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {cards.map((c) => {
          const toneCls =
            c.tone === "red"
              ? "border-red-300 bg-red-50 hover:bg-red-100"
              : c.tone === "green"
                ? "border-leaf/40 bg-leaf/10 hover:bg-leaf/15"
                : "hover:bg-gold-50";
          const badgeCls = c.tone === "red" ? "text-red-700" : c.tone === "green" ? "text-leaf-700" : "text-gold-700";
          return (
            <Link key={c.href + c.label} href={c.href} className={`card flex items-center gap-2.5 px-3 py-2.5 transition ${toneCls}`}>
              <span className="text-xl leading-none">{c.emoji}</span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold">{c.label}</span>
                {c.badge && <span className={`block truncate text-xs font-medium ${badgeCls}`}>{c.badge}</span>}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
