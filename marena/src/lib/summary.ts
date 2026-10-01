// Závěrečné shrnutí ročníku — jeden výpočet nad daty ročníku, který používá
// stránka /zazemi/shrnuti (grafy) i textový souhrn ke zkopírování.
// Čísla sedí s Financemi, Lístky & merchem a Prodejem, protože se počítají
// stejnými pomocníky (posStats, soldItems, ticketBreakdown, makeTicketSplit).

import type { Year, FinanceItem, MerchOrder } from "./types";
import { POS_CATS, posStats, makeCostLookup, makeTicketSplit, soldItems, ticketBreakdown, parseSaleItems, type TicketPlace, type TicketPlaceStat, type SoldItemRow } from "./pos";
import { isTicketName, orderTicketChannel, pickedUpAfterDeadline, ONSITE_ORDER_NAME } from "./merch";
import { guessGender } from "./names";
import { ROLES } from "./roles";
import { KINDS } from "./kinds";
import { fmtCZK, fmtDate } from "./format";

export const isPosSale = (f: FinanceItem) => f.kind === "prijem" && POS_CATS.has(f.category ?? "") && (f.note ?? "").includes("×");
const localDay = (iso: string) => {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
const saleHow = (note?: string) => ((note ?? "").includes("QR platba") ? "QR" : (note ?? "").includes("hotově") ? "hotově" : "");
const sum = (arr: number[]) => arr.reduce((s, v) => s + v, 0);

export type DaySales = { day: string; total: number; qr: number; cash: number; count: number; tickets: number; food: number; drink: number; merch: number; cost: number };
export type CatSum = { label: string; value: number };

export type YearSummary = ReturnType<typeof buildYearSummary>;

export function buildYearSummary(y: Year) {
  const fin = y.finances ?? [];
  const products = y.merch ?? [];
  const orders = y.merchOrders ?? [];

  // ---------- Finance celkem (stejně jako Finance → Všechny finance) ----------
  let prijmy = 0, vydaje = 0;
  const incomeByCat = new Map<string, number>();
  const expenseByCat = new Map<string, number>();
  for (const f of fin) {
    const cat = f.category?.trim() || "bez kategorie";
    if (f.kind === "prijem") {
      prijmy += f.amount;
      incomeByCat.set(cat, (incomeByCat.get(cat) ?? 0) + f.amount);
    } else {
      vydaje += f.amount;
      expenseByCat.set(cat, (expenseByCat.get(cat) ?? 0) + f.amount);
    }
  }
  const contributions = y.contributions ?? [];
  let inPool = 0, returned = 0, paidCount = 0;
  for (const c of contributions) {
    if (c.returned) returned += c.amount;
    else inPool += c.amount;
    if (c.amount > 0) paidCount++;
  }
  const vyber = { count: contributions.length, paidCount, total: inPool + returned, inPool, returned };
  // Nevrácený výběr je hotovost v balíku → příjem (a tedy i bilance), jako ve Financích.
  const prijmyAll = prijmy + inPool;
  const bilance = prijmyAll - vydaje;
  const toCat = (m: Map<string, number>): CatSum[] => [...m.entries()].map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);

  // ---------- Prodej ----------
  const costOf = makeCostLookup(y);
  const ticketOf = makeTicketSplit(y);
  const posItems = fin.filter((f) => POS_CATS.has(f.category ?? ""));
  const sales = fin.filter(isPosSale);
  const pos = posStats(posItems, costOf, ticketOf);
  const sold = soldItems(fin, y);
  const dayMap = new Map<string, DaySales>();
  const byHour = Array.from({ length: 24 }, () => ({ qr: 0, cash: 0, total: 0 }));
  for (const f of sales) {
    const day = f.date || localDay(f.createdAt);
    const d = dayMap.get(day) ?? { day, total: 0, qr: 0, cash: 0, count: 0, tickets: 0, food: 0, drink: 0, merch: 0, cost: 0 };
    const how = saleHow(f.note);
    d.total += f.amount;
    d.count += 1;
    if (how === "QR") d.qr += f.amount;
    else if (how === "hotově") d.cash += f.amount;
    let cost = 0;
    for (const it of parseSaleItems(f.note)) {
      const c = costOf(it.name);
      if (c != null) cost += c * it.qty;
    }
    d.cost += cost;
    const t = ticketOf(f);
    d.tickets += t.revenue;
    const cat = f.category ?? "";
    if (cat === "kuchyně") d.food += f.amount;
    else if (cat === "bar") d.drink += f.amount;
    else if (cat === "merch") d.merch += f.amount - t.revenue;
    dayMap.set(day, d);
    const h = new Date(f.createdAt).getHours();
    byHour[h].total += f.amount;
    if (how === "QR") byHour[h].qr += f.amount;
    else if (how === "hotově") byHour[h].cash += f.amount;
  }
  const days = [...dayMap.values()].sort((a, b) => a.day.localeCompare(b.day));
  const salesTotal = sum(days.map((d) => d.total));
  const salesCost = sum(days.map((d) => d.cost));
  const salesCount = sum(days.map((d) => d.count));
  const busiestDay = days.reduce<DaySales | null>((best, d) => (!best || d.total > best.total ? d : best), null);
  const busiestHour = byHour.reduce((best, h, i) => (h.total > byHour[best].total ? i : best), 0);

  // ---------- Lístky ----------
  const isTicketItem = (it: MerchOrder["items"][number]) => isTicketName(it.name) || isTicketName(products.find((p) => p.id === it.productId)?.name ?? "");
  const ticketOrders = orders.filter((o) => o.items.some(isTicketItem));
  const isOnsiteOrder = (o: MerchOrder) => o.name === ONSITE_ORDER_NAME || o.items.some((it) => isTicketItem(it) && orderTicketChannel(o, it.name) !== "web");
  const webOrders = ticketOrders.filter((o) => !isOnsiteOrder(o));
  const qtyOf = (list: MerchOrder[], ch?: "web" | "bar" | "fleda") =>
    list.reduce((s, o) => s + o.items.filter((it) => isTicketItem(it) && (!ch || orderTicketChannel(o, it.name) === ch)).reduce((q, it) => q + it.qty, 0), 0);
  const finById = new Map(fin.map((f) => [f.id, f]));
  const buckets = { "1": 0, "2": 0, "3": 0, "4+": 0 } as Record<"1" | "2" | "3" | "4+", number>;
  for (const o of ticketOrders) {
    const q = o.items.filter(isTicketItem).reduce((s, it) => s + it.qty, 0);
    buckets[q >= 4 ? "4+" : (String(q) as "1" | "2" | "3")]++;
  }
  const gender = { f: 0, m: 0, unknown: 0 };
  for (const o of webOrders) {
    const g = guessGender(o.name);
    if (g === "f") gender.f++;
    else if (g === "m") gender.m++;
    else gender.unknown++;
  }
  const lateList = webOrders.filter((o) => pickedUpAfterDeadline(o, o.financeId ? finById.get(o.financeId) : undefined));
  const resByDay = new Map<string, { orders: number; tickets: number }>();
  for (const o of webOrders) {
    const k = localDay(o.createdAt);
    const cur = resByDay.get(k) ?? { orders: 0, tickets: 0 };
    cur.orders++;
    cur.tickets += qtyOf([o], "web");
    resByDay.set(k, cur);
  }
  const paidByDay = new Map<string, { web: number; bar: number; fleda: number }>();
  const lead = { d0: 0, d1: 0, d4: 0, d8: 0 };
  for (const o of ticketOrders) {
    const f = o.financeId ? finById.get(o.financeId) : undefined;
    if (!f) continue;
    const k = f.date || localDay(f.createdAt);
    const cur = paidByDay.get(k) ?? { web: 0, bar: 0, fleda: 0 };
    for (const it of o.items) {
      if (!isTicketItem(it)) continue;
      cur[orderTicketChannel(o, it.name)] += it.qty;
    }
    paidByDay.set(k, cur);
    const webQty = qtyOf([o], "web");
    if (webQty > 0) {
      const diff = Math.floor((new Date(f.createdAt).getTime() - new Date(o.createdAt).getTime()) / 86400000);
      if (diff <= 0) lead.d0 += webQty;
      else if (diff <= 3) lead.d1 += webQty;
      else if (diff <= 7) lead.d4 += webQty;
      else lead.d8 += webQty;
    }
  }
  const tickets = {
    total: qtyOf(orders),
    orders: ticketOrders.length,
    web: { people: webOrders.length, qty: qtyOf(webOrders, "web"), paid: qtyOf(webOrders.filter((o) => o.done), "web"), pending: qtyOf(webOrders.filter((o) => !o.done), "web"), pendingPeople: webOrders.filter((o) => !o.done).length },
    places: ticketBreakdown(fin, y) as Record<TicketPlace, TicketPlaceStat>,
    buckets,
    gender,
    late: { people: lateList.length, qty: qtyOf(lateList, "web") },
    resByDay: [...resByDay.entries()].sort((a, b) => a[0].localeCompare(b[0])),
    paidByDay: [...paidByDay.entries()].sort((a, b) => a[0].localeCompare(b[0])),
    lead,
    avg: ticketOrders.length ? qtyOf(orders) / ticketOrders.length : 0,
  };

  // ---------- Kasy ----------
  const cashboxes = [...(y.cashboxes ?? [])]
    .sort((a, b) => a.openedAt.localeCompare(b.openedAt))
    .map((c) => ({
      id: c.id,
      label: c.label,
      day: c.openedAt.slice(0, 10),
      opening: c.opening,
      closing: c.closing,
      closed: !!c.closedAt,
      marked: c.alreadyRecorded ?? 0,
      diff: c.closedAt && c.closing != null ? c.closing - c.opening - (c.alreadyRecorded ?? 0) : null,
    }));

  // ---------- Merch (produkty) ----------
  const soldByProduct = new Map<string, { qty: number; revenue: number }>();
  for (const o of orders) {
    if (!o.done) continue;
    for (const it of o.items) {
      const cur = soldByProduct.get(it.productId) ?? { qty: 0, revenue: 0 };
      cur.qty += it.qty;
      cur.revenue += (it.price ?? products.find((p) => p.id === it.productId)?.price ?? 0) * it.qty;
      soldByProduct.set(it.productId, cur);
    }
  }
  const merchProducts = products.map((p) => {
    const s = soldByProduct.get(p.id) ?? { qty: 0, revenue: 0 };
    return { id: p.id, name: p.name, price: p.price, cost: p.cost, stock: p.stock, sold: s.qty, revenue: s.revenue, left: p.stock != null ? p.stock - s.qty : null, ticket: isTicketName(p.name) };
  });

  // ---------- Tým a organizace ----------
  const members = y.members ?? [];
  const rolesFilled = ROLES.filter((r) => members.some((m) => m.roleIds.includes(r.id))).length;
  const tasks = y.tasks ?? [];
  const shifts = y.shifts ?? [];
  const team = {
    members: members.length,
    approved: members.filter((m) => m.approved !== false).length,
    rolesFilled,
    rolesTotal: ROLES.length,
    tasks: tasks.length,
    tasksDone: tasks.filter((t) => t.done).length,
    shifts: shifts.length,
    shiftCapacity: sum(shifts.map((s) => s.capacity)),
    shiftPeople: sum(shifts.map((s) => s.people.length)),
    freshmen: (y.freshmen ?? []).length,
  };
  const events = y.events ?? [];
  const eventsByKind = (Object.keys(KINDS) as (keyof typeof KINDS)[])
    .map((k) => ({ kind: k, label: `${KINDS[k].emoji} ${KINDS[k].label}`, count: events.filter((e) => e.kind === k).length }))
    .filter((e) => e.count > 0);
  const invites = y.invites ?? [];
  const sponsors = y.sponsors ?? [];
  const decor = y.decor ?? [];
  const shopping = y.shopping ?? [];
  const program = {
    events: events.length,
    eventsByKind,
    posts: (y.posts ?? []).length,
    polls: (y.polls ?? []).length,
    pollsClosed: (y.polls ?? []).filter((p) => p.closed).length,
    pollVotes: sum((y.polls ?? []).map((p) => sum(p.options.map((o) => (o as { votes?: string[] }).votes?.length ?? 0)))),
    invites: { total: invites.length, contacted: invites.filter((i) => i.contacted).length, yes: invites.filter((i) => i.interest === "ano").length, no: invites.filter((i) => i.interest === "ne").length, waiting: invites.filter((i) => i.interest === "ceka").length },
    sponsors: { total: sponsors.length, confirmed: sponsors.filter((s) => s.status === "potvrzeno").length, waiting: sponsors.filter((s) => s.status === "ceka").length, toContact: sponsors.filter((s) => s.status === "oslovit").length, declined: sponsors.filter((s) => s.status === "odmitl").length },
    decor: { total: decor.length, done: decor.filter((d) => d.status === "hotovo").length, searching: decor.filter((d) => d.status === "shani").length, idea: decor.filter((d) => d.status === "napad").length },
    shopping: { total: shopping.length, bought: shopping.filter((s) => s.bought).length },
    menu: (y.menu ?? []).length,
    links: (y.links ?? []).length,
    announcements: (y.announcements ?? []).length,
    drinks: (y.bar ?? []).filter((d) => (d.place ?? "bar") === "bar").length,
    dishes: (y.bar ?? []).filter((d) => d.place === "kuchyne").length,
  };

  return {
    year: { id: y.id, label: y.label, theme: y.theme, fledaDate: y.fledaDate, plannedPeople: y.plannedPeople },
    finance: { prijmy: prijmyAll, prijmyZapsane: prijmy, vydaje, bilance, incomeByCat: toCat(incomeByCat), expenseByCat: toCat(expenseByCat), vyber },
    sales: { total: salesTotal, cost: salesCost, profit: salesTotal - salesCost, count: salesCount, avg: salesCount ? salesTotal / salesCount : 0, qr: pos.qr, cash: pos.cash, cashDiff: pos.cashDiff, days, byHour, busiestDay, busiestHour, unknownQty: sold.unknownQty, pos },
    sold: sold as { rows: SoldItemRow[]; qty: number; revenue: number; cost: number; profit: number; unknownQty: number },
    tickets,
    cashboxes,
    merchProducts,
    team,
    program,
  };
}

// Textový souhrn (do zprávy / e-mailu) — jen hlavní čísla, bez grafů.
export function summaryText(s: YearSummary): string {
  const sgn = (n: number) => `${n >= 0 ? "+" : "−"}${fmtCZK(Math.abs(n))}`;
  const pct = (a: number, b: number) => (b > 0 ? `${Math.round((a / b) * 100)} %` : "—");
  const t = s.tickets;
  const lines = [
    `${s.year.label}${s.year.theme ? ` · ${s.year.theme}` : ""}${s.year.fledaDate ? ` · Fléda ${fmtDate(s.year.fledaDate)}` : ""} — závěrečné shrnutí`,
    "",
    `FINANCE: příjmy ${fmtCZK(s.finance.prijmy)} · výdaje ${fmtCZK(s.finance.vydaje)} · bilance ${sgn(s.finance.bilance)}`,
    `Výběr: ${s.finance.vyber.paidCount}/${s.finance.vyber.count} lidí, vybráno ${fmtCZK(s.finance.vyber.total)}, v balíku ${fmtCZK(s.finance.vyber.inPool)}, vráceno ${fmtCZK(s.finance.vyber.returned)}`,
    "",
    `PRODEJ: tržba ${fmtCZK(s.sales.total)} · náklady ${fmtCZK(s.sales.cost)} · zisk ${sgn(s.sales.profit)} (marže ${pct(s.sales.profit, s.sales.total)}) · ${s.sales.count} účtenek, průměr ${fmtCZK(s.sales.avg)} · QR ${fmtCZK(s.sales.qr)} / hotově ${fmtCZK(s.sales.cash)}`,
    ...s.sales.days.map((d) => `  ${fmtDate(d.day)}: ${fmtCZK(d.total)} (lístky ${fmtCZK(d.tickets)}, jídlo ${fmtCZK(d.food)}, pití ${fmtCZK(d.drink)}, merch ${fmtCZK(d.merch)}) · ${d.count} účtenek`),
    s.sales.busiestDay ? `Nejsilnější den ${fmtDate(s.sales.busiestDay.day)} (${fmtCZK(s.sales.busiestDay.total)}), špička ${s.sales.busiestHour}–${s.sales.busiestHour + 1} h` : "",
    `Top položky: ${s.sold.rows.slice(0, 5).map((r) => `${r.name} ${r.qty} ks / ${fmtCZK(r.revenue)}`).join(" · ")}`,
    "",
    `LÍSTKY: ${t.total} ks v ${t.orders} objednávkách · rezervace z webu ${t.web.people} lidí / ${t.web.qty} ks (zaplaceno ${t.web.paid}, čeká ${t.web.pending}) · vyzvednuto ${pct(t.web.paid, t.web.qty)}`,
    `  na baru bez rezervace ${t.places.onsiteBar.qty} ks · na baru s rezervací ${t.places.resBar.qty} ks · na Flédě s rezervací ${t.places.resFleda.qty} ks · na Flédě bez rezervace ${t.places.onsiteFleda.qty} ks`,
    `  holky/kluci (odhad) ${t.gender.f}/${t.gender.m} · průměr ${t.avg.toFixed(2).replace(".", ",")} lístku na objednávku · vyzvednuto až na Flédě ${t.late.people} lidí / ${t.late.qty} ks`,
    "",
    `KASY: ${s.cashboxes.map((c) => `${fmtDate(c.day)}${c.label ? ` ${c.label}` : ""}: vklad ${fmtCZK(c.opening)}${c.closed && c.closing != null ? ` → večer ${fmtCZK(c.closing)}, rozdíl ${sgn(c.diff ?? 0)}` : " (otevřená)"}`).join(" · ") || "žádné"}`,
    "",
    `TÝM: ${s.team.members} lidí · role obsazené ${s.team.rolesFilled}/${s.team.rolesTotal} · úkoly ${s.team.tasksDone}/${s.team.tasks} hotovo · směny ${s.team.shiftPeople}/${s.team.shiftCapacity} míst · prváků ${s.team.freshmen}`,
    `PROGRAM: ${s.program.events} událostí · ${s.program.invites.yes} potvrzených hostů z ${s.program.invites.total} oslovených · sponzoři ${s.program.sponsors.confirmed} potvrzeno / ${s.program.sponsors.total} · výzdoba ${s.program.decor.done}/${s.program.decor.total} hotovo · nákupy ${s.program.shopping.bought}/${s.program.shopping.total}`,
    `NÁSTĚNKA: ${s.program.posts} příspěvků · ${s.program.polls} anket (${s.program.pollVotes} hlasů) · ${s.program.announcements} oznámení`,
  ];
  return lines.filter((l) => l !== "").join("\n");
}
