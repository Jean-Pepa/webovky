// Sdílené typy pro zápisy od řemeslníků (pozvánka → odeslání → potvrzení majitelem)
// a pro AI vyčtení dokladů. Bez "use client" — importují je i serverové routy.

export type InviteRole = "CRAFTSMAN" | "INSPECTOR";

export const INVITE_ROLES: Record<InviteRole, string> = {
  CRAFTSMAN: "Řemeslník",
  INSPECTOR: "Revizní technik",
};

// Typ práce = typ záznamu v historii (podmnožina EntryType)
export type WorkType = "REPAIR" | "INSPECTION" | "RENOVATION" | "DEFECT" | "OTHER";

export const WORK_TYPES: Record<WorkType, string> = {
  INSPECTION: "Revize / kontrola",
  REPAIR: "Oprava / servis",
  RENOVATION: "Montáž / rekonstrukce",
  DEFECT: "Zjištěná závada",
  OTHER: "Jiné",
};

export type InspectionResult = "OK" | "DEFECTS" | "FAIL";

export const INSPECTION_RESULTS: Record<InspectionResult, string> = {
  OK: "Schopné bezpečného provozu",
  DEFECTS: "Se závadami (provoz možný)",
  FAIL: "Neschopné provozu",
};

export type ExtractedDocKind = "PROTOCOL" | "INVOICE" | "WARRANTY" | "OTHER";

// Výsledek AI vyčtení protokolu / faktury. Vždy jen NÁVRH — ukládá se až po potvrzení člověkem.
export type ExtractionResult = {
  docKind: ExtractedDocKind;
  workType: WorkType;
  title: string;
  summary: string;
  date: string | null; // YYYY-MM-DD
  result: InspectionResult | null;
  device: string | null; // zařízení / předmět revize
  elementId: string | null; // shoda s prvkem domu z kontextu
  nextDueDate: string | null; // další termín (YYYY-MM-DD), jen když je v dokladu
  intervalMonths: number | null; // lhůta, jen když je v dokladu výslovně
  cost: number | null; // Kč vč. DPH
  supplier: string | null; // firma / dodavatel
  technician: string | null; // jméno, příp. číslo oprávnění
  defects: string[];
  confidence: "HIGH" | "MEDIUM" | "LOW";
  warnings: string[];
};

// Kontext, který posíláme AI, aby uměla přiřadit prvek
export type ExtractionContext = {
  propertyName?: string;
  elements: { id: string; name: string; category: string; kind?: string; room?: string }[];
};

// Veřejné údaje pozvánky — vidí je řemeslník (nic dalšího o domě)
export type InvitePublic = {
  token: string;
  propertyId: string;
  propertyName: string;
  city?: string;
  elementId?: string;
  elementName?: string;
  elementCategory?: string;
  role: InviteRole;
  expiresAt: string; // YYYY-MM-DD (včetně)
  elements?: ExtractionContext["elements"]; // prvky, ke kterým smí řemeslník zapisovat (pro AI párování)
};

export type SubmissionFileRole = "PROTOCOL" | "INVOICE" | "PHOTO";

export type SubmissionFile = {
  id: string;
  name: string;
  kind: "image" | "file";
  mediaType: string;
  role: SubmissionFileRole;
  size?: number; // bajty data URL
  dataUrl?: string; // v inboxu na serveru se posílá zvlášť (GET souboru)
};

// Zápis od řemeslníka čekající na potvrzení majitelem
export type Submission = {
  id: string;
  token: string;
  propertyId: string;
  elementId?: string;
  author: { name: string; company?: string; phone?: string; role: InviteRole };
  workType: WorkType;
  title: string;
  description?: string;
  date: string; // YYYY-MM-DD
  cost?: number;
  result?: InspectionResult;
  nextDueDate?: string;
  intervalMonths?: number;
  measuredOpenWall?: boolean; // fotky otevřené zdi s metrem → zpřesnění polohy
  attachments: SubmissionFile[];
  extracted?: ExtractionResult;
  createdAt: string;
};

// Limity (Vercel tělo požadavku ≤ 4,5 MB)
export const SUBMISSION_LIMITS = {
  maxFiles: 8,
  maxFileBytes: 1_400_000, // délka data URL jednoho souboru
  maxTotalBytes: 4_000_000,
  maxPendingPerProperty: 50,
};
