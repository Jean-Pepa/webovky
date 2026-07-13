"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { isAdmin } from "@/lib/admin";
import { myRoleIds } from "@/lib/access";
import { sameName, assigneeHas } from "@/lib/names";
import { todayISO } from "@/lib/format";
import { isPollClosed } from "@/lib/poll";

// Moje agenda — osobní rozcestník na nástěnce podle rolí: každý má svoje
// sekce s počítadly toho, co čeká, na jeden ťuk. Nikomu nic neschovává,
// jen zkracuje cestu. Správce (bez rolí) vidí jen to, co „hoří".
// `onOpenPost` doscrolluje a červeně zvýrazní prioritní zprávu na nástěnce.
export function MyAgenda({ onOpenPost }: { onOpenPost?: (id: string) => void }) {
  const { currentYear, me } = useStore();
  const year = currentYear;
  const seenKey = year ? `marena_priority_seen_${year.id}` : "";
  const [lastSeen, setLastSeen] = useState("");
  useEffect(() => {
    if (!seenKey) return;
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLastSeen(localStorage.getItem(seenKey) || "");
    } catch {
      /* ignore */
    }
  }, [seenKey]);

  if (!year) return null;

  const roles = myRoleIds(year, me);
  const admin = isAdmin(me);
  const chief = roles.includes("hlavni");
  const has = (...ids: string[]) => chief || ids.some((r) => roles.includes(r));

  // Prioritní zprávy „pro mě" (všichni / moje role / moje jméno), které jsem ještě
  // neviděl a nenapsal sám. Nejnovější první.
  const priorityForMe = (year.posts ?? [])
    .filter((p) => {
      const pr = p.priority;
      if (!pr || sameName(p.author, me)) return false;
      if (pr.all) return true;
      if (pr.roles?.some((r) => roles.includes(r))) return true;
      if (pr.people?.some((n) => sameName(n, me))) return true;
      return false;
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const unseen = priorityForMe.filter((p) => p.createdAt > lastSeen);

  function openPriority() {
    if (!unseen.length) return;
    const id = unseen[0].id;
    const stamp = new Date().toISOString();
    try {
      localStorage.setItem(seenKey, stamp);
    } catch {
      /* ignore */
    }
    setLastSeen(stamp);
    onOpenPost?.(id);
  }

  const pendingOrders = (year.merchOrders ?? []).filter((o) => !o.done).length;
  const unpaid = (year.finances ?? []).filter((f) => !f.paid).length;
  // Výzdobné zóny, kde jsem přihlášený — úkoly té zóny jsou taky moje.
  const myZoneIds = (year.decorZones ?? []).filter((z) => z.members.some((m) => sameName(m, me))).map((z) => z.id);
  // Moje úkoly = přiřazené mně jménem (i z nástěnky), mojí roli, nebo mojí výzdobné zóně.
  const myTasks = (year.tasks ?? []).filter(
    (t) => assigneeHas(t.assignee, me) || (t.roleId && roles.includes(t.roleId)) || (t.zoneId && myZoneIds.includes(t.zoneId)),
  );
  const myUndone = myTasks.filter((t) => !t.done).length;
  const today = todayISO();
  const shift = (year.shifts ?? []).find((s) => s.date === today && s.people.some((p) => sameName(p, me)));

  // Hlasování — otevřené ankety, kde smím hlasovat (výzdoba ankety jen výzdobáři)
  // a ještě jsem nehlasoval. Ať mi neuteče, vyskočí nahoře v agendě.
  const myOpenPolls = (year.polls ?? []).filter((p) => {
    if (isPollClosed(p)) return false;
    if (p.tag === "vyzdoba" && !roles.includes("vyzdoba")) return false;
    return !p.options.some((o) => o.voters.some((v) => sameName(v, me)));
  }).length;

  const cards: { href: string; emoji: string; label: string; badge?: string; tone?: "red" | "green" }[] = [];
  if (myOpenPolls > 0)
    cards.push({ href: "/zazemi/hlasovani", emoji: "🗳️", label: "Hlasování", badge: `${myOpenPolls} k hlasování`, tone: "red" });
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

  if (cards.length === 0 && unseen.length === 0) return null;

  return (
    <section className="agenda-pulse p-3">
      <h2 className="eyebrow mb-2">Moje agenda</h2>

      {/* Nová prioritní zpráva pro mě — bliká červeně, klik ji na nástěnce zvýrazní. */}
      {unseen.length > 0 && (
        <button
          type="button"
          onClick={openPriority}
          className="readonly-pulse mb-2 flex w-full items-center gap-2.5 rounded-xl border-2 border-red-500 bg-red-50 px-3 py-2.5 text-left transition hover:bg-red-100"
        >
          <span className="text-xl leading-none">📣</span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-bold text-red-700">Nová zpráva pro tebe{unseen.length > 1 ? ` (${unseen.length})` : ""}</span>
            <span className="block truncate text-xs font-medium text-red-600">{unseen[0].title}</span>
          </span>
          <span className="shrink-0 text-xs font-semibold text-red-700">Zobrazit →</span>
        </button>
      )}

      {cards.length > 0 && (
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
                  {c.badge && <span className={`block truncate text-xs font-medium tabular-nums ${badgeCls}`}>{c.badge}</span>}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
