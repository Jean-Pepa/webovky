// Pomocné funkce pro prvky domu (seznamy, odkazy, vyhledávání, počty vazeb).

import type { ElementCondition, HouseElement, Property } from "@/lib/store";
import { ELEMENT_CATEGORY_ORDER, elementLinks } from "@/lib/elements";
import { pluralCs } from "@/lib/deadlines";

export function elementHref(propertyId: string, elementId: string): string {
  return `/nemovitost/${propertyId}/prvek/${elementId}`;
}

export function modelHref(propertyId: string, elementId?: string, place = false): string {
  if (!elementId) return `/nemovitost/${propertyId}/model`;
  return `/nemovitost/${propertyId}/model?prvek=${encodeURIComponent(elementId)}${place ? "&umistit=1" : ""}`;
}

// Podle vrstvy (kategorie), pak podle názvu
export function sortElements(list: HouseElement[]): HouseElement[] {
  return [...list].sort(
    (a, b) =>
      ELEMENT_CATEGORY_ORDER.indexOf(a.category) - ELEMENT_CATEGORY_ORDER.indexOf(b.category) ||
      (a.name ?? "").localeCompare(b.name ?? "", "cs"),
  );
}

const CONDITION_RANK: Record<ElementCondition, number> = { DEFECT: 0, ATTENTION: 1, UNKNOWN: 2, OK: 2 };

// Nejdřív to, co potřebuje pozornost (závada, sledovat), pak podle vrstvy
export function sortByAttention(list: HouseElement[]): HouseElement[] {
  return sortElements(list).sort(
    (a, b) => (CONDITION_RANK[a.condition] ?? 2) - (CONDITION_RANK[b.condition] ?? 2),
  );
}

// Je prvek zakreslený na existujícím podkladu modelu?
export function isPlaced(property: Property, el: HouseElement): boolean {
  const plan = el.plan;
  if (!plan || !plan.points?.length) return false;
  return (property.models ?? []).some((m) => m.id === plan.modelId);
}

// Text bez diakritiky, malými písmeny (vyhledávání z mobilu bez háčků)
export function fold(s: string): string {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

export function matchesQuery(el: HouseElement, query: string): boolean {
  const q = fold(query.trim());
  if (!q) return true;
  return fold([el.name, el.kind, el.room, el.location].filter(Boolean).join(" ")).includes(q);
}

// „2 záznamy" (1 záznam, 2–4 záznamy, 5+ záznamů)
export function countLabel(n: number, one: string, few: string, many: string): string {
  return `${n} ${pluralCs(n, one, few, many)}`;
}

// „2 záznamy · 1 dokument · 1 termín"
export function linkSummary(property: Property, elementId: string): { total: number; text: string } {
  const l = elementLinks(property, elementId);
  const parts: string[] = [];
  if (l.entries.length) parts.push(countLabel(l.entries.length, "záznam", "záznamy", "záznamů"));
  if (l.documents.length) parts.push(countLabel(l.documents.length, "dokument", "dokumenty", "dokumentů"));
  if (l.reminders.length) parts.push(countLabel(l.reminders.length, "termín", "termíny", "termínů"));
  if (l.inventory.length) parts.push(`${l.inventory.length}× vybavení`);
  const total = l.entries.length + l.documents.length + l.reminders.length + l.inventory.length;
  return { total, text: parts.join(" · ") };
}

// Přidá / odebere id prvku ze seznamu (ostatní prvky zůstanou)
export function withElementId(ids: string[] | undefined, elementId: string, on: boolean): string[] {
  const rest = (ids ?? []).filter((x) => x !== elementId);
  return on ? [...rest, elementId] : rest;
}
