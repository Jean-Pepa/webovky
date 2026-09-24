// Rozšíření archivu do PDF — část „peníze, prodej, nabídka, lidé a statistiky":
// souhrn financí, denní kasy s prodanými položkami, rozpis tržby, výběr, lístky
// & merch, receptury a ceník, menu, nákupy, prváci, výzdoba, sponzoři, oznámení
// a statistiky webu. Vše čistý HTML string (renderuje prohlížeč → Uložit jako PDF).

import type { Year, FinanceItem, Cashbox, MerchOrder } from "./types";
import { fmtDate, fmtDateTime, fmtCZK } from "./format";
import { roleById } from "./roles";
import { posStats, boxDayFinances, makeCostLookup, makeTicketSplit, soldItems } from "./pos";
import { isTicketName, orderTicketChannel, pickedUpAfterDeadline, ONSITE_ORDER_NAME } from "./merch";
import { guessGender } from "./names";
import type { AnalyticsSummary } from "./analytics";

export function esc(s: unknown): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const sgn = (n: number) => `${n >= 0 ? "+" : "−"}${fmtCZK(Math.abs(n))}`;
const td = (v: unknown, right = false) => `<td${right ? ' style="text-align:right"' : ""}>${esc(v)}</td>`;
const th = (v: unknown, right = false) => `<th${right ? ' style="text-align:right"' : ""}>${esc(v)}</th>`;
const table = (head: string[], rows: string[], rightFrom = 99) =>
  `<table><tr>${head.map((h, i) => th(h, i >= rightFrom)).join("")}</tr>${rows.join("")}</table>`;
const kv = (rows: [string, string][]) =>
  `<table>${rows.map(([k, v]) => `<tr><th style="width:34%">${esc(k)}</th><td>${esc(v)}</td></tr>`).join("")}</table>`;

const KIND_LABEL: Record<string, string> = { koktejl: "koktejl", panak: "panák", snidane: "snídaně", obed: "oběd", jine: "jiné" };
const DAY_LABEL: Record<string, string> = { po: "pondělí", ut: "úterý", st: "středa", ct: "čtvrtek", pa: "pátek", so: "sobota", ne: "neděle" };
const MEAL_LABEL: Record<string, string> = { snidane: "snídaně", obed: "oběd", jine: "jiné" };
const DECOR_LABEL: Record<string, string> = { napad: "nápad", shani: "shání se", hotovo: "hotovo" };
const SPONSOR_STATUS: Record<string, string> = { oslovit: "oslovit", ceka: "čeká na odpověď", potvrzeno: "potvrzeno", odmitl: "odmítl" };
const SPONSOR_CAT: Record<string, string> = { jidlo_piti: "jídlo a pití", stavebni: "stavební materiál", tisk: "tisk", technika: "technika", ostatni: "ostatní" };
const VIA_LABEL: Record<string, string> = { email: "e-mail", phone: "telefon", osobne: "osobně" };

// ---------- prodej: pomocníci ----------
const POS_CATS = new Set(["bar", "kuchyně", "merch"]);
const isSale = (f: FinanceItem) => f.kind === "prijem" && POS_CATS.has(f.category ?? "") && (f.note ?? "").includes("×");
function parseItems(note?: string): { qty: number; name: string }[] {
  return (note ?? "")
    .split(" · ")[0]
    .split(", ")
    .map((p) => p.match(/^(\d+)× (.+)$/))
    .filter(Boolean)
    .map((m) => ({ qty: Number(m![1]), name: m![2] }));
}

// ---------- Finance — souhrn ----------
export function renderFinanceSummary(y: Year): string {
  const fin = y.finances ?? [];
  const cts = y.contributions ?? [];
  if (!fin.length && !cts.length) return "";
  let prijmy = 0, vydaje = 0, vybrano = 0, zaplaceno = 0;
  for (const f of fin) {
    if (f.kind === "prijem") { prijmy += f.amount; if (f.paid) vybrano += f.amount; }
    else { vydaje += f.amount; if (f.paid) zaplaceno += f.amount; }
  }
  const vyberTotal = cts.reduce((s, c) => s + c.amount, 0);
  const vyberReturned = cts.filter((c) => c.returned).reduce((s, c) => s + c.amount, 0);
  const inPool = vyberTotal - vyberReturned;
  return kv([
    ["Příjmy (vše zapsané, bez výběru)", fmtCZK(prijmy)],
    ["Výdaje (vše zapsané)", fmtCZK(vydaje)],
    ["Bilance bez výběru", sgn(prijmy - vydaje)],
    ["Výběr od lidí — vybráno / vráceno / v balíku", `${fmtCZK(vyberTotal)} / ${fmtCZK(vyberReturned)} / ${fmtCZK(inPool)}`],
    ["Bilance s výběrem v balíku (jak ji ukazuje appka)", sgn(prijmy + inPool - vydaje)],
    ["V kase (zaplacené příjmy − zaplacené výdaje + výběr v balíku)", fmtCZK(vybrano - zaplaceno + inPool)],
    ["Účet pro QR platby", y.paymentAccount || "—"],
  ]);
}

// ---------- Denní kasy ----------
export function renderCashboxes(y: Year): string {
  const boxes = [...(y.cashboxes ?? [])].sort((a, b) => a.openedAt.localeCompare(b.openedAt));
  if (!boxes.length) return "";
  const fin = y.finances ?? [];
  const costOf = makeCostLookup(y);
  const ticketOf = makeTicketSplit(y);
  const blocks = boxes.map((box: Cashbox) => {
    const dayFin = boxDayFinances(fin, box, y.cashboxes ?? []);
    const st = posStats(dayFin, costOf, ticketOf);
    const closed = !!box.closedAt && box.closing != null;
    const rozdil = closed ? box.closing! - box.opening - (box.alreadyRecorded ?? 0) : null;
    const tally = new Map<string, number>();
    for (const f of dayFin) if (isSale(f)) for (const it of parseItems(f.note)) tally.set(it.name, (tally.get(it.name) ?? 0) + it.qty);
    const items = [...tally.entries()].sort((a, b) => b[1] - a[1]).map(([n, q]) => `${q}× ${n}`).join(", ");
    const rows: [string, string][] = [
      ["Stav", closed ? `uzavřeno ${fmtDateTime(box.closedAt!)}` : "otevřeno"],
      ["Ranní vklad → večer v kase", closed ? `${fmtCZK(box.opening)} → ${fmtCZK(box.closing!)}` : fmtCZK(box.opening)],
      ["Markováno hotově z prodejů", fmtCZK(box.alreadyRecorded ?? st.cash)],
      ["Rozdíl při uzávěrce", rozdil == null ? "—" : rozdil === 0 ? "0 Kč · sedí" : `${sgn(rozdil)} (${rozdil > 0 ? "přebytek, v zisku" : "manko, odečteno ze zisku"})`],
      ["Tržba jídlo & pití", fmtCZK(st.takings)],
      ["Náklady (nákupní ceny prodaných kusů)", `−${fmtCZK(st.cost)}${st.unknownQty > 0 ? ` (${st.unknownQty} ks bez nákupní ceny)` : ""}`],
      ["Zisk jídlo & pití (vč. rozdílu v kase)", sgn(st.profit)],
      ["Lístky", st.ticketQty > 0 ? `${st.ticketQty} ks · tržba ${fmtCZK(st.ticketRevenue)} · zisk ${sgn(st.ticketProfit)}` : "—"],
      ["Merch", st.merchRevenue > 0 ? `tržba ${fmtCZK(st.merchRevenue)} · zisk ${sgn(st.merchProfit)}` : "—"],
      ["Kasou prošlo celkem", `${fmtCZK(st.allRevenue)} (QR ${fmtCZK(st.qr)} · hotově ${fmtCZK(st.cash)} · ${st.count}× prodej)`],
      ["Nákupy zboží zapsané v ten den", st.purchases > 0 ? fmtCZK(st.purchases) : "—"],
      ["Prodané položky", items || "—"],
    ];
    return `<h3>${esc(fmtDate(box.openedAt))}${box.label ? ` · ${esc(box.label)}` : ""}</h3>${kv(rows)}`;
  });
  return blocks.join("");
}

// ---------- Tržba z prodeje — rozpis za ročník ----------
export function renderSalesBreakdown(y: Year): string {
  const sales = (y.finances ?? []).filter(isSale);
  if (!sales.length) return "";
  const costOf = makeCostLookup(y);
  const ticketOf = makeTicketSplit(y);
  // Kanál lístku: přes navázanou objednávku; bez ní podle štítku zápisu („Prodej na místě" = na baru).
  const orderByFin = new Map<string, MerchOrder>();
  for (const o of y.merchOrders ?? []) if (o.financeId) orderByFin.set(o.financeId, o);
  const acc = { food: 0, foodCost: 0, drink: 0, drinkCost: 0, merch: 0, merchCost: 0, tickets: 0, ticketCost: 0, ticketQty: 0, barQty: 0, fledaQty: 0, unknown: 0, qr: 0, cash: 0, count: 0 };
  for (const f of sales) {
    let cost = 0;
    for (const it of parseItems(f.note)) {
      const c = costOf(it.name);
      if (c != null) cost += c * it.qty;
      else acc.unknown += it.qty;
      if (isTicketName(it.name)) {
        const ch = orderTicketChannel(orderByFin.get(f.id) ?? { name: f.label.includes(ONSITE_ORDER_NAME) ? ONSITE_ORDER_NAME : f.label }, it.name);
        if (ch === "bar") acc.barQty += it.qty;
        else if (ch === "fleda") acc.fledaQty += it.qty;
      }
    }
    const note = f.note ?? "";
    if (note.includes("QR platba")) acc.qr += f.amount;
    else if (note.includes("hotově")) acc.cash += f.amount;
    acc.count++;
    const cat = f.category ?? "";
    if (cat === "kuchyně") { acc.food += f.amount; acc.foodCost += cost; }
    else if (cat === "bar") { acc.drink += f.amount; acc.drinkCost += cost; }
    else {
      const t = ticketOf(f);
      acc.tickets += t.revenue; acc.ticketCost += t.cost; acc.ticketQty += t.qty;
      acc.merch += f.amount - t.revenue; acc.merchCost += Math.max(0, cost - t.cost);
    }
  }
  const total = acc.food + acc.drink + acc.merch + acc.tickets;
  const profit = acc.food - acc.foodCost + acc.drink - acc.drinkCost + acc.merch - acc.merchCost + acc.tickets - acc.ticketCost;
  const row = (label: string, rev: number, cost: number, extra = "") =>
    `<tr>${td(label)}${td(extra)}${td(fmtCZK(rev), true)}${td(`−${fmtCZK(cost)}`, true)}${td(sgn(rev - cost), true)}</tr>`;
  return (
    table(
      ["Část", "Kusy", "Tržba", "Náklady", "Zisk"],
      [
        row("🍽️ Jídlo (kuchyně)", acc.food, acc.foodCost),
        row("🍺 Pití (bar)", acc.drink, acc.drinkCost),
        row("🛍️ Merch", acc.merch, acc.merchCost),
        row("🎟️ Lístky", acc.tickets, acc.ticketCost, `${acc.ticketQty} ks (web ${acc.ticketQty - acc.barQty - acc.fledaQty} · na baru ${acc.barQty} · na Flédě ${acc.fledaQty})`),
        `<tr><th>Celkem</th><th></th><th style="text-align:right">${esc(fmtCZK(total))}</th><th style="text-align:right">−${esc(fmtCZK(total - profit))}</th><th style="text-align:right">${esc(sgn(profit))}</th></tr>`,
      ],
      2,
    ) +
    `<p class="muted">${acc.count}× prodej · QR ${esc(fmtCZK(acc.qr))} · hotově ${esc(fmtCZK(acc.cash))}${acc.unknown > 0 ? ` · ${acc.unknown} ks bez nákupní ceny (zisk je o ně nadsazený)` : ""}. Náklady = prodané kusy × nákupní cena položky (suroviny u jídla a pití, nákupní cena u merche); nákupy zboží ve financích se sem nepočítají.</p>`
  );
}

// ---------- Prodané položky za ročník ----------
// Tržba položky: u účtenky s jedinou položkou přesně (částka zápisu), u smíšené
// účtenky se částka rozdělí podle cen v nabídce (lístek na místě = cena na místě).
// Součet tržeb tedy sedí s kasou. Zisk = tržba − prodané kusy × nákupka.
export function renderSoldItems(y: Year): string {
  const sold = soldItems(y.finances ?? [], y);
  if (!sold.rows.length) return "";
  const rows = sold.rows.map(
    (r) =>
      `<tr>${td(r.name)}${td(r.cat)}${td(r.qty, true)}${td(fmtCZK(r.revenue), true)}${td(r.unitCost != null ? fmtCZK(r.unitCost) : "—", true)}${td(r.unitCost != null ? `−${fmtCZK(r.cost)}` : "—", true)}${td(
        r.unitCost != null ? sgn(r.profit) : `${sgn(r.revenue)} (bez nákupky)`,
        true,
      )}</tr>`,
  );
  rows.push(
    `<tr><th>Celkem</th><th></th><th style="text-align:right">${sold.qty}</th><th style="text-align:right">${esc(fmtCZK(sold.revenue))}</th><th></th><th style="text-align:right">−${esc(fmtCZK(sold.cost))}</th><th style="text-align:right">${esc(sgn(sold.profit))}</th></tr>`,
  );
  return (
    table(["Položka", "Stánek", "Prodáno ks", "Tržba", "Nákupka / ks", "Náklady", "Zisk"], rows, 2) +
    `<p class="muted">Tržba položky je z účtenek (u smíšené účtenky rozdělená podle cen v nabídce), proto součet sedí s kasou. Zisk = tržba − prodané kusy × nákupka.</p>`
  );
}

// ---------- Výběr od lidí ----------
export function renderContributions(y: Year): string {
  const cts = [...(y.contributions ?? [])].sort((a, b) => a.name.localeCompare(b.name, "cs"));
  if (!cts.length) return "";
  const rows = cts.map(
    (c) =>
      `<tr>${td(c.name)}${td([c.email, c.phone].filter(Boolean).join(" · "))}${td(c.pledged != null ? fmtCZK(c.pledged) : "—", true)}${td(fmtCZK(c.amount), true)}${td(
        c.returned ? `ano${c.returnedAt ? ` (${fmtDate(c.returnedAt)})` : ""}` : "ne",
      )}${td(c.paidAt ? fmtDate(c.paidAt) : fmtDate(c.createdAt))}</tr>`,
  );
  const total = cts.reduce((s, c) => s + c.amount, 0);
  const returned = cts.filter((c) => c.returned).reduce((s, c) => s + c.amount, 0);
  rows.push(`<tr><th colspan="3">Celkem vybráno / vráceno / v balíku</th><th colspan="3">${esc(fmtCZK(total))} / ${esc(fmtCZK(returned))} / ${esc(fmtCZK(total - returned))}</th></tr>`);
  return table(["Jméno", "Kontakt", "Má dát", "Zaplatil", "Vráceno", "Datum"], rows, 2);
}

// ---------- Lístky & merch ----------
export function renderMerch(y: Year): string {
  const products = y.merch ?? [];
  const orders = [...(y.merchOrders ?? [])].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  if (!products.length && !orders.length) return "";
  const isTicketItem = (it: MerchOrder["items"][number]) => isTicketName(it.name) || isTicketName(products.find((p) => p.id === it.productId)?.name ?? "");
  const qtyOf = (list: MerchOrder[], pred: (it: MerchOrder["items"][number]) => boolean) => list.reduce((s, o) => s + o.items.filter(pred).reduce((q, it) => q + it.qty, 0), 0);
  const withTicket = orders.filter((o) => o.items.some(isTicketItem));
  const isOnsiteOrder = (o: MerchOrder) => o.name === ONSITE_ORDER_NAME || o.items.some((it) => isTicketItem(it) && orderTicketChannel(o, it.name) !== "web");
  const webOrders = withTicket.filter((o) => !isOnsiteOrder(o));
  const gender = webOrders.reduce((acc, o) => { acc[guessGender(o.name)]++; return acc; }, { f: 0, m: 0, "?": 0 } as Record<string, number>);
  const chQty = (list: MerchOrder[], ch: "web" | "bar" | "fleda") => list.reduce((s, o) => s + o.items.filter((it) => isTicketItem(it) && orderTicketChannel(o, it.name) === ch).reduce((q, it) => q + it.qty, 0), 0);
  const webQty = (list: MerchOrder[]) => chQty(list, "web");
  const finById = new Map((y.finances ?? []).map((f) => [f.id, f]));
  const lateOrders = webOrders.filter((o) => pickedUpAfterDeadline(o, o.financeId ? finById.get(o.financeId) : undefined));
  const stats = kv([
    ["Objednávek celkem / s lístkem (vč. prodejů na místě)", `${orders.length} / ${withTicket.length}`],
    ["Rezervace z webu — lidí / lístků (zaplaceno / čeká)", `${webOrders.length} / ${webQty(orders)} (${webQty(orders.filter((o) => o.done))} / ${webQty(orders.filter((o) => !o.done))})`],
    ["Prodáno na baru před Flédou", `${chQty(orders, "bar")} ks`],
    ["Prodáno na Flédě", `${chQty(orders, "fleda")} ks`],
    ["Rezervace vyzvednuté až na Flédě (zaplaceno po odpočtu) — lidí / lístků", `${lateOrders.length} / ${webQty(lateOrders)}`],
    ["Lístků celkem / zaplaceno / čeká", `${qtyOf(orders, isTicketItem)} / ${qtyOf(orders.filter((o) => o.done), isTicketItem)} / ${qtyOf(orders.filter((o) => !o.done), isTicketItem)}`],
    ["Holky / kluci (odhad podle jména, lidé z rezervací)", `${gender.f} / ${gender.m}${gender["?"] ? ` (nejasné ${gender["?"]})` : ""}`],
  ]);
  const soldByProduct = new Map<string, number>();
  for (const o of orders) for (const it of o.items) soldByProduct.set(it.productId, (soldByProduct.get(it.productId) ?? 0) + it.qty);
  const prodRows = products.map(
    (p) =>
      `<tr>${td(p.name)}${td(p.price != null ? fmtCZK(p.price) : "—", true)}${td(p.cost != null ? fmtCZK(p.cost) : "—", true)}${td(p.stock != null ? p.stock : "neomezeně", true)}${td(soldByProduct.get(p.id) ?? 0, true)}${td(
        [p.sizes?.length ? `velikosti ${p.sizes.join(", ")}` : "", p.colors?.length ? `barvy ${p.colors.join(", ")}` : ""].filter(Boolean).join(" · "),
      )}${td(p.onWeb !== false ? "ano" : "ne")}</tr>`,
  );
  const total = (o: MerchOrder) => o.items.reduce((s, it) => s + (it.price ?? products.find((p) => p.id === it.productId)?.price ?? 0) * it.qty, 0);
  const orderRows = orders.map(
    (o) =>
      `<tr>${td(fmtDateTime(o.createdAt))}${td(o.name)}${td([o.phone, o.email].filter(Boolean).join(" · "))}${td(
        o.items.map((it) => `${it.qty}× ${it.name}${[it.size, it.color].filter(Boolean).length ? ` (${[it.size, it.color].filter(Boolean).join(" · ")})` : ""}`).join(", "),
      )}${td(fmtCZK(total(o)), true)}${td(o.paid ? "zaplaceno" : o.done ? "vyřízeno" : "čeká")}${td(o.note ?? "")}</tr>`,
  );
  return (
    `<h3>Souhrn</h3>${stats}` +
    (products.length ? `<h3>Nabídka</h3>${table(["Produkt", "Cena", "Nákupka", "Sklad", "Prodáno", "Varianty", "Na webu"], prodRows, 1)}` : "") +
    (orders.length ? `<h3>Objednávky a rezervace (${orders.length})</h3>${table(["Datum", "Jméno", "Kontakt", "Položky", "Částka", "Stav", "Poznámka"], orderRows, 4)}` : "")
  );
}

// ---------- Kuchyně & bar: nabídka, receptury, menu, nákupy ----------
export function renderBarAndKitchen(y: Year): string {
  const drinks = y.bar ?? [];
  const menu = y.menu ?? [];
  const shopping = y.shopping ?? [];
  if (!drinks.length && !menu.length && !shopping.length) return "";
  const rowsFor = (place: "bar" | "kuchyne") =>
    drinks
      .filter((d) => (d.place ?? "bar") === place)
      .sort((a, b) => a.name.localeCompare(b.name, "cs"))
      .map((d) => {
        const cost = d.ingredients.reduce((s, i) => s + (i.cost || 0), 0);
        const rec = d.ingredients.map((i) => `${i.name} (${fmtCZK(i.cost)})`).join(", ");
        return `<tr>${td(d.name)}${td(KIND_LABEL[d.kind] ?? d.kind)}${td(d.day ? DAY_LABEL[d.day] ?? d.day : "")}${td(rec)}${td(fmtCZK(cost), true)}${td(d.price != null ? fmtCZK(d.price) : "—", true)}${td(
          d.price != null ? sgn(d.price - cost) : "—",
          true,
        )}${td(d.note ?? "")}</tr>`;
      });
  const head = ["Název", "Druh", "Den", "Receptura (surovina · náklad / porce)", "Náklad", "Prodej", "Marže", "Poznámka"];
  const bar = rowsFor("bar");
  const kitchen = rowsFor("kuchyne");
  const menuRows = menu.map((m) => `<tr>${td(m.day)}${td(MEAL_LABEL[m.meal] ?? m.meal)}${td(m.dish)}</tr>`);
  const shopRows = shopping.map((s) => `<tr>${td(s.place === "bar" ? "bar" : "kuchyně")}${td(s.name)}${td(s.qty ?? "")}${td(s.bought ? "ano" : "ne")}</tr>`);
  return (
    (bar.length ? `<h3>Bar — ceník a receptury</h3>${table(head, bar, 4)}` : "") +
    (kitchen.length ? `<h3>Kuchyně — jídla a receptury</h3>${table(head, kitchen, 4)}` : "") +
    (menuRows.length ? `<h3>Menu po dnech</h3>${table(["Den", "Jídlo dne", "Co se vaří"], menuRows)}` : "") +
    (shopRows.length ? `<h3>Nákupní seznam</h3>${table(["Kam", "Položka", "Množství", "Koupeno"], shopRows)}` : "")
  );
}

// ---------- Prváci ----------
export function renderFreshmen(y: Year): string {
  const list = [...(y.freshmen ?? [])].sort((a, b) => a.name.localeCompare(b.name, "cs"));
  if (!list.length) return "";
  return `<p class="muted">${list.length} lidí</p>` + table(["Jméno", "E-mail", "Poznámka"], list.map((f) => `<tr>${td(f.name)}${td(f.email ?? "")}${td(f.note ?? "")}</tr>`));
}

// ---------- Výzdoba ----------
export function renderDecor(y: Year): string {
  const items = y.decor ?? [];
  const zones = y.decorZones ?? [];
  if (!items.length && !zones.length && !y.decorRules) return "";
  const zoneName = (id?: string) => zones.find((z) => z.id === id)?.name ?? "";
  return (
    (y.decorRules ? `<h3>Pravidla</h3><p>${esc(y.decorRules)}</p>` : "") +
    (y.decorPlanDesc ? `<p class="muted">Plánek zón: ${esc(y.decorPlanDesc)}</p>` : "") +
    (zones.length ? `<h3>Zóny</h3>${table(["Zóna", "Kdo spravuje", "Představa"], zones.map((z) => `<tr>${td(z.name)}${td(z.members.join(", "))}${td(z.description ?? "")}</tr>`))}` : "") +
    (items.length
      ? `<h3>Nápady a materiál</h3>${table(
          ["Položka", "Stav", "Kdo", "Zóna", "Odkaz", "Poznámka"],
          items.map((d) => `<tr>${td(d.title)}${td(DECOR_LABEL[d.status] ?? d.status)}${td(d.who ?? "")}${td(zoneName(d.zoneId))}${td(d.link ?? "")}${td(d.note ?? "")}</tr>`),
        )}`
      : "")
  );
}

// ---------- Sponzoři ----------
export function renderSponsors(y: Year): string {
  const list = y.sponsors ?? [];
  if (!list.length) return "";
  const rows = list.map(
    (s) =>
      `<tr>${td(s.name)}${td(SPONSOR_CAT[s.category ?? ""] ?? "")}${td(SPONSOR_STATUS[s.status] ?? s.status)}${td(s.gives ?? "")}${td(s.who ?? "")}${td(
        (s.contactedVia ?? []).map((v) => VIA_LABEL[v] ?? v).join(", "),
      )}${td(s.returning ? "ano" : "")}${td([...(s.links ?? []), s.link].filter(Boolean).join(", "))}${td(s.note ?? "")}</tr>`,
  );
  return table(["Sponzor", "Kategorie", "Stav", "Co dává", "Kdo řeší", "Osloveno", "Stálý", "Odkazy", "Poznámka"], rows);
}

// ---------- Oznámení ----------
export function renderAnnouncements(y: Year): string {
  const list = [...(y.announcements ?? [])].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  if (!list.length) return "";
  const audience = (a: { all?: boolean; roles?: string[]; people?: string[] }) =>
    a.all ? "všem" : [...(a.roles ?? []).map((r) => roleById(r)?.name ?? r), ...(a.people ?? [])].join(", ") || "—";
  return table(
    ["Datum", "Kdo", "Komu", "Zpráva", "Schváleno"],
    list.map((a) => `<tr>${td(fmtDateTime(a.createdAt))}${td(a.createdBy)}${td(audience(a.audience))}${td(a.text)}${td(a.approved === false ? "ne" : "ano")}</tr>`),
  );
}

// ---------- Statistiky webu (z Redisu; nejsou vázané na ročník) ----------
export function renderAnalytics(s: AnalyticsSummary | null): string {
  if (!s || !s.enabled) return `<p class="muted">Statistiky nebyly dostupné (běží jen na produkci s Redisem, nebo se nepodařilo je načíst).</p>`;
  const list = (rows: { label: string; count: number }[], head: [string, string]) =>
    rows.length ? table(head, rows.map((r) => `<tr>${td(r.label)}${td(r.count, true)}</tr>`), 1) : `<p class="muted">— nic —</p>`;
  const series = [...s.series].sort((a, b) => a.date.localeCompare(b.date));
  const users = [...s.users].sort((a, b) => b.hits - a.hits);
  return (
    `<h3>Souhrn za posledních ${s.periodDays} dní</h3>` +
    kv([
      ["Zobrazení stránek (lidé)", String(s.pageviews)],
      ["Lidé / boti (zobrazení)", `${s.humans} / ${s.bots}`],
      ["Unikátní lidé za období", `${s.uniquesInPeriod} (přihlášení ${s.loggedInUniques}, návštěvníci ${s.visitorUniques})`],
      ["Denně / týdně / měsíčně aktivní (DAU / WAU / MAU)", `${s.dau} / ${s.wau} / ${s.mau}`],
    ]) +
    `<h3>Návštěvy po dnech</h3>` +
    (series.length ? table(["Den", "Zobrazení"], series.map((d) => `<tr>${td(fmtDate(d.date))}${td(d.pv, true)}</tr>`), 1) : `<p class="muted">— nic —</p>`) +
    `<h3>Nejnavštěvovanější stránky</h3>${list(s.topPages, ["Stránka", "Zobrazení"])}` +
    `<h3>Na co se klikalo</h3>${list(s.topClicks, ["Prvek", "Kliků"])}` +
    `<h3>Trychtýř rezervace lístků</h3>${s.funnel.length ? table(["Krok", "Lidí"], s.funnel.map((f) => `<tr>${td(f.label)}${td(f.count, true)}</tr>`), 1) : `<p class="muted">— nic —</p>`}` +
    `<h3>Zařízení</h3>${list(s.devices, ["Zařízení", "Zobrazení"])}` +
    `<h3>Operační systémy</h3>${list(s.os, ["Systém", "Zobrazení"])}` +
    `<h3>Prohlížeče</h3>${list(s.browsers, ["Prohlížeč", "Zobrazení"])}` +
    `<h3>Boti a crawlery</h3>${list(s.botNames, ["Bot", "Zobrazení"])}` +
    `<h3>Uživatelé (${users.length})</h3>` +
    (users.length
      ? table(
          ["Kdo", "Zařízení", "Systém", "Prohlížeč", "Zobrazení", "Naposledy"],
          users.map((u) => `<tr>${td(u.name ?? "návštěvník")}${td(u.dev ?? "")}${td(u.os ?? "")}${td(u.br ?? "")}${td(u.hits, true)}${td(u.last ? fmtDateTime(new Date(u.last).toISOString()) : "")}</tr>`),
          4,
        )
      : `<p class="muted">— nic —</p>`)
  );
}
