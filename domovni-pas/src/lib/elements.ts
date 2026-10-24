// Prvky domu — číselníky, zdroj údaje a přesnost.
// Model je zdroj pravdy: každý prvek nese ZDROJ polohy a PŘESNOST v mm.

import type {
  AccuracyClass,
  ElementCategory,
  ElementCondition,
  ElementSource,
  HouseElement,
  Property,
} from "./store";

// Kategorie = vrstvy v prohlížeči modelu (elektro / voda / topení…)
export const ELEMENT_CATEGORIES: Record<ElementCategory, string> = {
  ELEKTRO: "Elektro",
  VODA: "Voda a odpady",
  TOPENI: "Topení",
  PLYN: "Plyn",
  KONSTRUKCE: "Konstrukce",
  ZARIZENI: "Zařízení",
};

export const ELEMENT_CATEGORY_ORDER: ElementCategory[] = [
  "ELEKTRO",
  "VODA",
  "TOPENI",
  "PLYN",
  "KONSTRUKCE",
  "ZARIZENI",
];

// Barva vrstvy (SVG / tečky v seznamu). Hex kvůli SVG mimo Tailwind.
export const ELEMENT_CATEGORY_COLORS: Record<ElementCategory, string> = {
  ELEKTRO: "#d97706",
  VODA: "#2563eb",
  TOPENI: "#dc2626",
  PLYN: "#ca8a04",
  KONSTRUKCE: "#57534e",
  ZARIZENI: "#b5543a",
};

// Návrhy druhů prvku podle kategorie (datalist, ne povinný výčet)
export const ELEMENT_KIND_SUGGESTIONS: Record<ElementCategory, string[]> = {
  ELEKTRO: ["Rozvaděč", "Elektrický okruh", "Zásuvka", "Vypínač", "Svítidlo", "Hromosvod", "Fotovoltaika"],
  VODA: ["Stoupačka", "Rozvod studené vody", "Rozvod teplé vody", "Odpad", "Vodoměr", "Hlavní uzávěr vody"],
  TOPENI: ["Kotel", "Tepelné čerpadlo", "Radiátor", "Podlahové topení", "Rozdělovač", "Komín / spalinová cesta"],
  PLYN: ["Plynový rozvod", "Hlavní uzávěr plynu", "Plynoměr", "Plynový spotřebič"],
  KONSTRUKCE: ["Nosná stěna", "Příčka", "Strop", "Střecha", "Okno", "Dveře", "Základy"],
  ZARIZENI: ["Rekuperace", "Klimatizace", "Ohřívač vody", "Čerpadlo", "Zabezpečení", "Spotřebič"],
};

export const ELEMENT_SOURCES: Record<ElementSource, string> = {
  SKEN: "Sken (LiDAR / laser)",
  FOTO_OTEVRENE_ZDI: "Foto otevřené zdi",
  KOTA_VYKRESU: "Kóta z výkresu",
  MERITKO_VYKRESU: "Odměřeno z výkresu (měřítko)",
  MODEL_IFC: "Model projektu (IFC)",
  TYPOLOGIE: "Typické vedení",
  ZADAL_UZIVATEL: "Zadal uživatel",
};

// Zdroj → třída přesnosti. Aplikace ji vždy ukazuje (tenká čára = změřeno, široký pruh = odhad).
export const SOURCE_ACCURACY_CLASS: Record<ElementSource, AccuracyClass> = {
  SKEN: "MEASURED",
  FOTO_OTEVRENE_ZDI: "MEASURED",
  KOTA_VYKRESU: "DRAWING",
  MERITKO_VYKRESU: "DRAWING",
  MODEL_IFC: "DRAWING",
  TYPOLOGIE: "ESTIMATE",
  ZADAL_UZIVATEL: "ESTIMATE",
};

export const ACCURACY_CLASSES: Record<AccuracyClass, string> = {
  MEASURED: "Změřeno",
  DRAWING: "Z výkresu",
  ESTIMATE: "Odhad",
};

// Výchozí přesnost (±mm) nabízená ve formuláři podle zdroje — jen předvyplnění, uživatel ji přepíše.
export const DEFAULT_ACCURACY_MM: Record<ElementSource, number> = {
  SKEN: 10,
  FOTO_OTEVRENE_ZDI: 20,
  KOTA_VYKRESU: 50,
  MERITKO_VYKRESU: 100,
  MODEL_IFC: 50,
  TYPOLOGIE: 300,
  ZADAL_UZIVATEL: 300,
};

export const ELEMENT_CONDITIONS: Record<ElementCondition, string> = {
  OK: "V pořádku",
  ATTENTION: "Sledovat",
  DEFECT: "Závada",
  UNKNOWN: "Neznámý stav",
};

export const ELEMENT_CONDITION_COLORS = {
  OK: "emerald",
  ATTENTION: "amber",
  DEFECT: "red",
  UNKNOWN: "gray",
} as const;

// Bezpečnostní zásada: nikdy netvrdit, že je někde bezpečné vrtat.
export const SAFETY_NOTE =
  "Poloha je podklad, ne záruka. Před vrtáním nebo bouráním vždy ověřte vedení detektorem.";

export function accuracyClass(el: Pick<HouseElement, "source">): AccuracyClass {
  return SOURCE_ACCURACY_CLASS[el.source] ?? "ESTIMATE";
}

// „±20 mm · změřeno (foto otevřené zdi)"
export function accuracyLabel(el: Pick<HouseElement, "source" | "accuracyMm">): string {
  const cls = ACCURACY_CLASSES[accuracyClass(el)].toLowerCase();
  const src = (ELEMENT_SOURCES[el.source] ?? "").toLowerCase();
  const mm = el.accuracyMm != null ? `±${formatMm(el.accuracyMm)} · ` : "";
  return `${mm}${cls} (${src})`;
}

export function formatMm(mm: number): string {
  if (mm >= 1000) return `${(mm / 1000).toLocaleString("cs-CZ", { maximumFractionDigits: 1 })} m`;
  if (mm >= 100) return `${(mm / 10).toLocaleString("cs-CZ", { maximumFractionDigits: 0 })} cm`;
  return `${mm} mm`;
}

export function elementName(property: Property, elementId?: string): string | undefined {
  if (!elementId) return undefined;
  return property.elements?.find((e) => e.id === elementId)?.name;
}

export function findElement(property: Property, elementId?: string): HouseElement | undefined {
  if (!elementId) return undefined;
  return property.elements?.find((e) => e.id === elementId);
}

// Vše, co se k prvku váže (pro „Vše o prvku").
export function elementLinks(property: Property, elementId: string) {
  return {
    entries: property.entries.filter((e) => e.elementIds?.includes(elementId)),
    documents: property.documents.filter((d) => d.elementIds?.includes(elementId)),
    reminders: property.reminders.filter((r) => r.elementId === elementId),
    inventory: property.inventory.filter((i) => i.elementId === elementId),
  };
}
