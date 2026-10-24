import type { Entry, Property } from "./store";
import { dueStatus, formatDate } from "./format";
import { daysUntil, deadlineState, relativeDueLabel } from "./deadlines";
import { elementName } from "./elements";

export type AttentionKind = "reminder" | "warranty" | "defect";
export type AttentionSeverity = "overdue" | "soon";

export type AttentionItem = {
  id: string;
  kind: AttentionKind;
  title: string;
  property: Property;
  severity: AttentionSeverity;
  label: string;
  sortDate: string;
  elementId?: string; // prvek domu, ke kterému položka patří
};

export const ATTENTION_KIND_LABELS: Record<AttentionKind, string> = {
  reminder: "Termín",
  warranty: "Záruka",
  defect: "Závada",
};

// Závada je vyřešená pozdější opravou. Když mají závada i oprava prvky,
// musí oprava sdílet aspoň jeden prvek; bez prvků platí původní pravidlo (jakákoli pozdější oprava).
function isDefectResolved(defect: Entry, repairs: Entry[]): boolean {
  const defectEls = defect.elementIds ?? [];
  return repairs.some((r) => {
    if (r.date < defect.date) return false;
    const repairEls = r.elementIds ?? [];
    if (defectEls.length === 0 || repairEls.length === 0) return true;
    return repairEls.some((id) => defectEls.includes(id));
  });
}

// Proaktivní přehled toho, co „hoří" — napříč zadanými nemovitostmi.
// Záruky z vybavení a revize se hlídají automaticky, bez ručního zakládání.
export function getAttentionItems(properties: Property[]): AttentionItem[] {
  const WARRANTY_SOON_DAYS = 60;
  const items: AttentionItem[] = [];

  for (const p of properties) {
    // Termíny (nesplněné) — po termínu, nebo v okně „upozornit předem" u termínu
    for (const rem of p.reminders ?? []) {
      if (rem.done || !rem.dueDate) continue;
      const { state, daysLeft } = deadlineState(rem);
      if (state !== "OVERDUE" && state !== "SOON") continue;
      const el = elementName(p, rem.elementId);
      items.push({
        id: `rem-${rem.id}`,
        kind: "reminder",
        title: el ? `${el} — ${rem.title}` : rem.title,
        property: p,
        severity: state === "OVERDUE" ? "overdue" : "soon",
        label: relativeDueLabel(daysLeft),
        sortDate: rem.dueDate,
        elementId: el ? rem.elementId : undefined,
      });
    }

    // Záruky z vybavení — automaticky hlídané
    for (const it of p.inventory ?? []) {
      if (!it.warrantyUntil) continue;
      const st = dueStatus(it.warrantyUntil);
      if (st.overdue) {
        items.push({ id: `war-${it.id}`, kind: "warranty", title: `Záruka: ${it.name}`, property: p, severity: "overdue", label: "Záruka skončila", sortDate: it.warrantyUntil, elementId: it.elementId });
      } else if (daysUntil(it.warrantyUntil) <= WARRANTY_SOON_DAYS) {
        items.push({ id: `war-${it.id}`, kind: "warranty", title: `Záruka: ${it.name}`, property: p, severity: "soon", label: `Záruka do ${formatDate(it.warrantyUntil)}`, sortDate: it.warrantyUntil, elementId: it.elementId });
      }
    }

    // Nevyřešené závady — DEFECT bez pozdější opravy (REPAIR) téhož prvku
    const repairs = (p.entries ?? []).filter((e) => e.type === "REPAIR");
    for (const e of p.entries ?? []) {
      if (e.type !== "DEFECT") continue;
      if (isDefectResolved(e, repairs)) continue;
      items.push({ id: `def-${e.id}`, kind: "defect", title: e.title, property: p, severity: "soon", label: "Nevyřešená závada", sortDate: e.date, elementId: e.elementIds?.[0] });
    }
  }

  const rank: Record<AttentionSeverity, number> = { overdue: 0, soon: 1 };
  items.sort((a, b) => rank[a.severity] - rank[b.severity] || a.sortDate.localeCompare(b.sortDate));
  return items;
}
