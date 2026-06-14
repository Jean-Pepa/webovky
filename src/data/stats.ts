// Demo provozní statistiky pro admin dashboard (Fáze 1).
// Ve Fázi 4 se nahradí reálnými agregacemi z databáze objednávek.

export const REVENUE_BY_MONTH = [
  { month: "Led", value: 412000 },
  { month: "Úno", value: 388000 },
  { month: "Bře", value: 521000 },
  { month: "Dub", value: 604000 },
  { month: "Kvě", value: 712000 },
  { month: "Čer", value: 668000 },
];

export const TOP_PRODUCTS = [
  { name: "Betonářská ocel R 10", sku: "HM-BR10", sold: 1840, unit: "m" },
  { name: "Jekl 40×40×2 mm", sku: "HM-J40402", sold: 1260, unit: "m" },
  { name: "Vrut do dřeva 5,0×60", sku: "ZE-VR560", sold: 312, unit: "bal." },
  { name: "Vinohradnický sloupek 2,2 m", sku: "VI-SL22", sold: 540, unit: "ks" },
  { name: "Profil IPE 160", sku: "HM-IPE160", sold: 420, unit: "m" },
];

export const CUSTOMER_SPLIT = [
  { type: "Firmy", share: 48, color: "var(--color-accent)" },
  { type: "Živnostníci", share: 37, color: "var(--color-steel-600)" },
  { type: "Koncoví", share: 15, color: "var(--color-steel-400)" },
];

export const RECENT_ORDERS = [
  { ref: "EIKA-204815", customer: "Stavby Novák s.r.o.", type: "Firma", total: 48200, status: "Vyřizuje se" },
  { ref: "EIKA-204814", customer: "Jan Dvořák (OSVČ)", type: "Živnostník", total: 6450, status: "Expedováno" },
  { ref: "EIKA-204813", customer: "Vinařství Pod Kraví horou", type: "Firma", total: 31900, status: "Nová" },
  { ref: "EIKA-204812", customer: "Petr Svoboda", type: "Koncový", total: 1290, status: "Hotovo" },
  { ref: "EIKA-204811", customer: "Zámečnictví Kovo Brno", type: "Firma", total: 18750, status: "Hotovo" },
];

export const STATUS_COLORS: Record<string, string> = {
  Nová: "text-blue-700 bg-blue-50",
  "Vyřizuje se": "text-amber-700 bg-amber-50",
  Expedováno: "text-violet-700 bg-violet-50",
  Hotovo: "text-green-700 bg-green-50",
};
