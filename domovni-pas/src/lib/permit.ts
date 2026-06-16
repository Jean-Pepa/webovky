import type { Property, DocItem } from "./store";

export type PermitGroup = {
  key: string;
  label: string;
  items: { key: string; label: string; hint: string }[];
};

// Členění dokumentace pro stavební povolení (DSP) dle vyhl. 499/2006 Sb.
export const PERMIT_GROUPS: PermitGroup[] = [
  {
    key: "A",
    label: "A — Průvodní zpráva",
    items: [{ key: "pruvodni", label: "Průvodní zpráva", hint: "Identifikace stavby, stavebníka, projektanta" }],
  },
  {
    key: "B",
    label: "B — Souhrnná technická zpráva",
    items: [{ key: "souhrnna", label: "Souhrnná technická zpráva", hint: "Celkový popis a technické řešení" }],
  },
  {
    key: "C",
    label: "C — Situační výkresy",
    items: [
      { key: "situace", label: "Situační výkres (koordinační, katastrální)", hint: "Umístění stavby na pozemku" },
      { key: "katastr", label: "Podklady z katastru / vlastnictví", hint: "Výpis z KN, list vlastnictví" },
    ],
  },
  {
    key: "D",
    label: "D — Dokumentace objektů",
    items: [
      { key: "arch", label: "Architektonicko-stavební řešení", hint: "Půdorysy, řezy, pohledy" },
      { key: "konstr", label: "Stavebně konstrukční řešení / statika", hint: "" },
      { key: "pozar", label: "Požárně bezpečnostní řešení", hint: "" },
      { key: "tzb", label: "Technika prostředí staveb (TZB)", hint: "Vytápění, elektro, ZTI, vzduchotechnika" },
    ],
  },
  {
    key: "E",
    label: "E — Dokladová část",
    items: [
      { key: "penb", label: "Průkaz energetické náročnosti (PENB)", hint: "" },
      { key: "pruzkumy", label: "Průzkumy (geologický, radonový)", hint: "" },
      { key: "stanoviska", label: "Závazná stanoviska a vyjádření", hint: "Dotčené orgány, správci sítí" },
    ],
  },
];

function kw(d: DocItem, words: string[]) {
  const t = `${d.title} ${d.fileName ?? ""}`.toLowerCase();
  return words.some((w) => t.includes(w));
}

const MATCHERS: Record<string, (d: DocItem) => boolean> = {
  pruvodni: (d) => kw(d, ["průvodní"]),
  souhrnna: (d) => kw(d, ["souhrnná", "technická zpráva"]),
  situace: (d) => kw(d, ["situace", "situační", "koordinač"]),
  katastr: (d) => kw(d, ["katastr", "vlastnictví"]),
  arch: (d) => d.category === "PLAN" || kw(d, ["půdorys", "řez", "pohled", "architekton", "stavební řešení", "projektová dokumentace"]),
  konstr: (d) => kw(d, ["statik", "konstrukč"]),
  pozar: (d) => kw(d, ["požár"]),
  tzb: (d) => kw(d, ["tzb", "vytápění", "elektro", "zdravotechnik", "vzduchotechnik", "topení"]),
  penb: (d) => d.category === "ENERGY_LABEL" || kw(d, ["penb", "energetick"]),
  pruzkumy: (d) => kw(d, ["průzkum", "geolog", "radon"]),
  stanoviska: (d) => d.category === "CERTIFICATE" || kw(d, ["stanovisko", "vyjádření", "dotčen", "revize"]),
};

export type PermitAnalysis = {
  groups: { key: string; label: string; items: { label: string; hint: string; present: boolean; via?: string }[] }[];
  present: number;
  total: number;
  readiness: number;
  missing: { group: string; label: string; hint: string }[];
};

export function analyzePermit(property: Property): PermitAnalysis {
  let present = 0;
  let total = 0;
  const missing: PermitAnalysis["missing"] = [];

  const groups = PERMIT_GROUPS.map((g) => ({
    key: g.key,
    label: g.label,
    items: g.items.map((it) => {
      total++;
      const match = property.documents.find((d) => MATCHERS[it.key]?.(d));
      if (match) present++;
      else missing.push({ group: g.label, label: it.label, hint: it.hint });
      return { label: it.label, hint: it.hint, present: !!match, via: match?.title };
    }),
  }));

  return { groups, present, total, readiness: total ? Math.round((present / total) * 100) : 0, missing };
}

// Šablonový návrh Průvodní zprávy z projektové karty (funguje i bez AI).
export function draftPruvodniZprava(p: Property): string {
  const lines: (string | null)[] = [
    "A. PRŮVODNÍ ZPRÁVA",
    "",
    "A.1 Identifikační údaje stavby",
    `Název stavby: ${p.name}`,
    `Místo stavby: ${[p.street, p.city, p.zip].filter(Boolean).join(", ") || "—"}`,
    p.cadastralArea ? `Katastrální území: ${p.cadastralArea}${p.parcelNumber ? `, parc. č. ${p.parcelNumber}` : ""}` : null,
    `Stavebník / investor: ${p.investor || p.ownerName || "—"}`,
    p.architect ? `Projektant / architekt: ${p.architect}` : null,
    "",
    "A.2 Údaje o stavbě",
    p.floorArea != null ? `Plocha: ${p.floorArea} m²` : null,
    p.energyClass ? `Energetická náročnost: třída ${p.energyClass}` : null,
    p.yearBuilt ? `Rok výstavby / dokončení: ${p.yearBuilt}` : null,
    p.description ? `Popis stavby: ${p.description}` : null,
    "",
    "A.3 Členění stavby na objekty",
    "Stavba je členěna dle přiložené dokumentace (část D — Dokumentace objektů).",
  ];
  return lines.filter((l): l is string => l !== null).join("\n");
}
