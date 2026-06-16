import type { Property } from "./store";
import { dueStatus, formatDate } from "./format";

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
};

export const ATTENTION_KIND_LABELS: Record<AttentionKind, string> = {
  reminder: "Připomínka",
  warranty: "Záruka",
  defect: "Závada",
};

function daysUntil(date: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(`${date}T00:00:00`);
  return Math.round((d.getTime() - today.getTime()) / 86_400_000);
}

// Proaktivní přehled toho, co „hoří" — napříč zadanými nemovitostmi.
// Záruky z vybavení a revize se hlídají automaticky, bez ručního zakládání.
export function getAttentionItems(properties: Property[]): AttentionItem[] {
  const WARRANTY_SOON_DAYS = 60;
  const items: AttentionItem[] = [];

  for (const p of properties) {
    // Připomínky (nesplněné) — jen po termínu nebo brzy (≤30 dní)
    for (const rem of p.reminders) {
      if (rem.done) continue;
      const st = dueStatus(rem.dueDate);
      if (st.overdue) {
        items.push({ id: `rem-${rem.id}`, kind: "reminder", title: rem.title, property: p, severity: "overdue", label: st.label, sortDate: rem.dueDate });
      } else if (st.soon) {
        items.push({ id: `rem-${rem.id}`, kind: "reminder", title: rem.title, property: p, severity: "soon", label: st.label, sortDate: rem.dueDate });
      }
    }

    // Záruky z vybavení — automaticky hlídané
    for (const it of p.inventory) {
      if (!it.warrantyUntil) continue;
      const st = dueStatus(it.warrantyUntil);
      if (st.overdue) {
        items.push({ id: `war-${it.id}`, kind: "warranty", title: `Záruka: ${it.name}`, property: p, severity: "overdue", label: "Záruka skončila", sortDate: it.warrantyUntil });
      } else if (daysUntil(it.warrantyUntil) <= WARRANTY_SOON_DAYS) {
        items.push({ id: `war-${it.id}`, kind: "warranty", title: `Záruka: ${it.name}`, property: p, severity: "soon", label: `Záruka do ${formatDate(it.warrantyUntil)}`, sortDate: it.warrantyUntil });
      }
    }

    // Nevyřešené závady — DEFECT bez pozdější opravy (REPAIR)
    const lastRepair = p.entries
      .filter((e) => e.type === "REPAIR")
      .map((e) => e.date)
      .sort()
      .at(-1);
    for (const e of p.entries) {
      if (e.type !== "DEFECT") continue;
      if (lastRepair && lastRepair >= e.date) continue;
      items.push({ id: `def-${e.id}`, kind: "defect", title: e.title, property: p, severity: "soon", label: "Nevyřešená závada", sortDate: e.date });
    }
  }

  const rank: Record<AttentionSeverity, number> = { overdue: 0, soon: 1 };
  items.sort((a, b) => rank[a.severity] - rank[b.severity] || a.sortDate.localeCompare(b.sortDate));
  return items;
}
