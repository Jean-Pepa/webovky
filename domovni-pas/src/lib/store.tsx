"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { newId, newToken } from "./id";
import { addMonths } from "./deadlines";
import { withDemoModel } from "./demo-plan";
import type { ExtractionResult, InspectionResult, InviteRole } from "./submission";

// Sdílený „pas" pro server — bez datových příloh (dataUrl), ať je payload malý.
function toShareSnapshot(p: Property): Property {
  return {
    ...p,
    documents: p.documents.map((d) => ({ ...d, dataUrl: undefined })),
    entries: p.entries.map((e) => ({
      ...e,
      media: e.media.map((m) => ({ ...m, dataUrl: undefined })),
      // telefon řemeslníka zůstává jen majiteli
      author: e.author ? { ...e.author, phone: undefined } : undefined,
    })),
    inventory: p.inventory.map((i) => ({ ...i, dataUrl: undefined })),
    consultations: [], // interní konzultace nesdílíme veřejně
    bids: [], // nabídky firem jsou interní
    designs: [], // návrhy (velká média) nesdílíme přes server
    models: (p.models ?? []).map((m) => ({ ...m, dataUrl: undefined })),
    invites: [], // pozvánky (tokeny) jsou tajné
    ownerKey: undefined, // klíč majitele k inboxu nikdy neopouští jeho prohlížeč
  };
}

export type Role = "ARCHITECT" | "CLIENT" | "CREATOR";

// Branding architekta — zobrazí se na reportu a sdíleném pasu.
export type Branding = { studioName?: string; color?: string; tagline?: string };

export type PropertyType = "HOUSE" | "APARTMENT" | "OTHER";
export type EntryType =
  | "PURCHASE"
  | "HANDOVER"
  | "REPAIR"
  | "DEFECT"
  | "INSPECTION"
  | "RENOVATION"
  | "INSURANCE"
  | "OTHER";
export type DocCategory =
  | "CONTRACT"
  | "PLAN"
  | "CERTIFICATE"
  | "PROTOCOL"
  | "ENERGY_LABEL"
  | "INVOICE"
  | "WARRANTY"
  | "MANUAL"
  | "OTHER";

// Fáze/sekce projektu, do které dokument patří
export type DocSection = "POZEMEK" | "NAVRH" | "REALIZACE" | "BUDOVA";

export type Media = { id: string; name: string; kind: "image" | "file"; dataUrl?: string };

// --- Kniha domu: model domu jako páteř ---------------------------------------
// Všechno (záznamy, dokumenty, termíny, vybavení) se váže ke konkrétnímu PRVKU domu.

export type ElementCategory = "ELEKTRO" | "VODA" | "TOPENI" | "PLYN" | "KONSTRUKCE" | "ZARIZENI";

// Odkud známe polohu / údaj (viz lib/elements.ts → třída přesnosti)
export type ElementSource =
  | "SKEN"
  | "FOTO_OTEVRENE_ZDI"
  | "KOTA_VYKRESU"
  | "MERITKO_VYKRESU"
  | "MODEL_IFC"
  | "TYPOLOGIE"
  | "ZADAL_UZIVATEL";

export type AccuracyClass = "MEASURED" | "DRAWING" | "ESTIMATE"; // změřeno / z výkresu / odhad

export type ElementCondition = "OK" | "ATTENTION" | "DEFECT" | "UNKNOWN";

// Poloha na podkladu modelu: souřadnice 0–1 vůči šířce/výšce podkladu.
// 1 bod = zařízení (kotel, rozvaděč), ≥ 2 body = trasa (okruh, stoupačka, stěna).
export type PlanGeometry = { modelId: string; points: [number, number][] };

export type HouseElement = {
  id: string;
  name: string;
  category: ElementCategory;
  kind?: string; // druh: rozvaděč, kotel, okruh, stoupačka, stěna, okno…
  room?: string;
  location?: string; // slovní popis polohy („ve stěně 30 cm pod stropem")
  source: ElementSource;
  accuracyMm?: number; // přesnost polohy ±mm
  condition: ElementCondition;
  installDate?: string; // YYYY-MM-DD
  installDateEstimated?: boolean; // datum odvozené (např. ze stáří domu)
  ifcGlobalId?: string;
  plan?: PlanGeometry;
  note?: string;
  createdAt: string;
  updatedAt: string;
};

export type ElementInput = Omit<HouseElement, "id" | "createdAt" | "updatedAt">;

// Podklad modelu: půdorys (obrázek) nebo IFC soubor. Verzuje se.
export type HouseModelKind = "FLOORPLAN" | "IFC";

export type HouseModel = {
  id: string;
  kind: HouseModelKind;
  title: string; // „Přízemí", „1. NP"…
  fileName?: string;
  dataUrl?: string; // zmenšený obrázek půdorysu
  width?: number; // px podkladu (poměr stran)
  height?: number;
  version: number;
  date: string; // YYYY-MM-DD (stav k)
  source?: string; // odkud podklad je (projekt, zaměření, vlastní nákres)
  pxPerMeter?: number; // měřítko podkladu (px obrázku na 1 m) — z kalibrace dvěma body
  createdAt: string;
};

export type ModelInput = Omit<HouseModel, "id" | "version" | "createdAt"> & { version?: number };

// Kdo zápis udělal
export type AuthorRole = "OWNER" | "CRAFTSMAN" | "INSPECTOR" | "ARCHITECT";

export type EntryAuthor = { name: string; role: AuthorRole; company?: string; phone?: string };

export type Entry = {
  id: string;
  type: EntryType;
  title: string;
  description?: string;
  date: string; // YYYY-MM-DD
  cost?: number;
  media: Media[];
  elementIds?: string[]; // prvky, kterých se zápis týká
  documentIds?: string[]; // doklady (protokol, faktura) uložené s tímto zápisem
  author?: EntryAuthor; // chybí = zapsal majitel sám
  result?: InspectionResult; // výsledek revize
  submissionId?: string; // přišlo jako zápis od řemeslníka (potvrzeno majitelem)
  confirmedAt?: string;
  createdAt: string;
};

export type DocItem = {
  id: string;
  title: string;
  category: DocCategory;
  section?: DocSection;
  fileName?: string;
  dataUrl?: string;
  elementIds?: string[];
  extracted?: ExtractionResult; // co z dokladu vyčetla AI (a člověk potvrdil)
  createdAt?: string;
};

export type Property = {
  id: string;
  name: string;
  type: PropertyType;
  street?: string;
  city?: string;
  zip?: string;
  cadastralArea?: string;
  parcelNumber?: string;
  yearBuilt?: number;
  description?: string;
  investor?: string;
  floorArea?: number; // m² (užitná plocha)
  energyClass?: string; // A–G
  architect?: string; // autor projektu
  contractors?: string; // kontakty na dodavatele (řádky)
  designer?: string; // projektant
  constructionSystem?: string; // konstrukční systém
  builtUpArea?: number; // zastavěná plocha m²
  materials?: string; // hlavní materiály
  createdByRole?: Role; // kdo pas vytvořil
  handedOver?: boolean; // architekt předal klientovi → pro architekta jen ke čtení
  ownerName: string;
  shareEnabled: boolean;
  entries: Entry[];
  documents: DocItem[];
  reminders: Reminder[];
  transfers: TransferRecord[];
  inventory: InventoryItem[];
  consultations?: ConsultationNote[];
  bids?: ContractorBid[];
  designs?: DesignProposal[];
  milestones?: ArchMilestone[];
  elements?: HouseElement[]; // prvky domu (páteř knihy)
  models?: HouseModel[]; // podklady modelu (půdorysy, IFC)
  invites?: Invite[]; // pozvánky pro řemeslníky / revizní techniky
  ownerKey?: string; // tajný klíč majitele k inboxu zápisů na serveru (nesdílí se)
  createdAt: string;
  updatedAt: string;
};

export type PropertyInput = {
  name: string;
  type: PropertyType;
  street?: string;
  city?: string;
  zip?: string;
  cadastralArea?: string;
  parcelNumber?: string;
  yearBuilt?: number;
  description?: string;
  investor?: string;
  floorArea?: number;
  energyClass?: string;
  architect?: string;
  contractors?: string;
  designer?: string;
  constructionSystem?: string;
  builtUpArea?: number;
  materials?: string;
};

export type EntryInput = {
  type: EntryType;
  title: string;
  description?: string;
  date: string;
  cost?: number;
  media: Media[];
  elementIds?: string[];
  documentIds?: string[];
  author?: EntryAuthor;
  result?: InspectionResult;
  submissionId?: string;
  confirmedAt?: string;
};

export type DocumentInput = {
  title: string;
  category: DocCategory;
  section?: DocSection;
  fileName?: string;
  dataUrl?: string;
  elementIds?: string[];
  extracted?: ExtractionResult;
};

export type ReminderType = "INSPECTION" | "MAINTENANCE" | "WARRANTY" | "OTHER";

// Jedno provedení termínu (revize, servis) — historie u termínu
export type ReminderCompletion = {
  date: string; // YYYY-MM-DD
  entryId?: string;
  documentId?: string; // doklad (protokol)
  result?: InspectionResult;
  note?: string;
};

// Termín / revize. Opakovaný termín má intervalMonths: po provedení se posune další termín.
export type Reminder = {
  id: string;
  title: string;
  type: ReminderType;
  dueDate: string; // YYYY-MM-DD — další termín
  note?: string;
  done: boolean;
  elementId?: string; // prvek, ke kterému termín patří (revize → rozvaděč, záruka → kotel)
  intervalMonths?: number; // lhůta opakování; nevymýšlí se — zadá ji člověk / protokol
  intervalConfirmed?: boolean; // lhůtu potvrdil revizní technik
  confirmedBy?: string; // kdo lhůtu potvrdil
  lastDone?: string; // poslední provedení (YYYY-MM-DD)
  notifyDaysBefore?: number; // upozornit předem (dny), výchozí 30
  documentId?: string; // doklad posledního provedení
  history?: ReminderCompletion[];
};

export type ReminderInput = {
  title: string;
  type: ReminderType;
  dueDate: string;
  note?: string;
  elementId?: string;
  intervalMonths?: number;
  intervalConfirmed?: boolean;
  confirmedBy?: string;
  lastDone?: string;
  notifyDaysBefore?: number;
  documentId?: string;
};

// Pozvánka pro řemeslníka / revizního technika: odkaz nebo QR bez registrace.
// Smí jen přidat zápis (čeká na potvrzení majitelem); nic dalšího o domě nevidí.
export type Invite = {
  token: string;
  role: InviteRole;
  elementId?: string; // pozvánka ke konkrétnímu prvku (QR na rozvaděči)
  label?: string; // pro koho („Elektro Dvořák")
  expiresAt: string; // YYYY-MM-DD (platí včetně)
  createdAt: string;
  revoked?: boolean;
};

export type InviteInput = Pick<Invite, "role" | "elementId" | "label" | "expiresAt">;

// Návrh zápisu (z AI vyčtení nebo od řemeslníka) — uloží se až po potvrzení majitelem.
export type EntryProposal = {
  entry: EntryInput;
  documents?: DocumentInput[]; // protokol, faktura… (navážou se na zápis)
  // Termín: buď provedení existujícího (reminderId), nebo nový / posunutý další termín
  deadline?: {
    reminderId?: string;
    type: ReminderType;
    title: string;
    elementId?: string;
    nextDueDate?: string;
    intervalMonths?: number;
    intervalConfirmed?: boolean;
    confirmedBy?: string;
  };
  // Zápis zpřesňuje model (např. fotka otevřené zdi s metrem → „změřeno")
  refineElement?: { elementId: string; source: ElementSource; accuracyMm?: number };
};

export type TransferRecord = {
  id: string;
  fromName: string;
  toName: string;
  note?: string;
  date: string;
};

// Průběžné konzultace architekta s klientem (vlákno poznámek/dotazů)
export type ConsultationStatus = "OPEN" | "WAITING" | "RESOLVED";

export type ConsultationNote = {
  id: string;
  authorRole: Role;
  topic?: string;
  text: string;
  status?: ConsultationStatus;
  createdAt: string;
};

// Výběr stavební firmy — poptávky a nabídky dodavatelů
export type BidStatus = "REQUESTED" | "RECEIVED" | "SELECTED" | "REJECTED";

export type ContractorBid = {
  id: string;
  company: string;
  contact?: string;
  price?: number;
  durationWeeks?: number;
  rating?: number; // 1–5
  note?: string;
  status: BidStatus;
  createdAt: string;
};

export type ContractorBidInput = {
  company: string;
  contact?: string;
  price?: number;
  durationWeeks?: number;
  rating?: number;
  note?: string;
};

// Návrhy — studie a vizualizace, které architekt průběžně nahrává
export type DesignProposal = {
  id: string;
  title: string;
  note?: string;
  media: Media[];
  authorRole: Role;
  createdAt: string;
};

// Architektonická historie — „životopis stavby" (milníky v čase)
export type ArchMilestone = {
  id: string;
  year: number;
  title: string;
  note?: string;
  createdAt: string;
};

// Vybavení a materiály v domě – „Co je v mém domě" (baterie, kotel, podlaha…)
export type InventoryItem = {
  id: string;
  name: string;
  location?: string; // místnost / oblast (Koupelna, Kotelna, Střecha…)
  brand?: string; // značka / model
  price?: number;
  warrantyUntil?: string; // záruka do (YYYY-MM-DD)
  productUrl?: string; // odkaz na produkt
  note?: string;
  fileName?: string; // doklad (faktura / záruční list)
  dataUrl?: string;
  elementId?: string; // prvek domu (kotel ↔ záruka na kotel)
};

export type InventoryInput = {
  name: string;
  location?: string;
  brand?: string;
  price?: number;
  warrantyUntil?: string;
  productUrl?: string;
  note?: string;
  fileName?: string;
  dataUrl?: string;
  elementId?: string;
};

type Store = {
  properties: Property[];
  hydrated: boolean;
  getProperty: (id: string) => Property | undefined;
  createProperty: (data: PropertyInput) => string;
  createPropertyFull: (
    data: PropertyInput,
    entries: EntryInput[],
    documents: DocumentInput[],
  ) => string;
  updateProperty: (id: string, data: PropertyInput) => void;
  deleteProperty: (id: string) => void;
  importProperties: (data: Property[]) => void;
  addEntry: (propertyId: string, data: EntryInput) => void;
  deleteEntry: (propertyId: string, entryId: string) => void;
  addDocument: (propertyId: string, data: DocumentInput) => void;
  deleteDocument: (propertyId: string, docId: string) => void;
  addReminder: (propertyId: string, data: ReminderInput) => void;
  toggleReminder: (propertyId: string, reminderId: string) => void;
  deleteReminder: (propertyId: string, reminderId: string) => void;
  addInventoryItem: (propertyId: string, data: InventoryInput) => void;
  deleteInventoryItem: (propertyId: string, itemId: string) => void;
  addConsultation: (propertyId: string, data: { topic?: string; text: string }) => void;
  deleteConsultation: (propertyId: string, noteId: string) => void;
  setConsultationStatus: (propertyId: string, noteId: string, status: ConsultationStatus) => void;
  addBid: (propertyId: string, data: ContractorBidInput) => void;
  deleteBid: (propertyId: string, bidId: string) => void;
  setBidStatus: (propertyId: string, bidId: string, status: BidStatus) => void;
  addDesign: (propertyId: string, data: { title: string; note?: string; media: Media[] }) => void;
  deleteDesign: (propertyId: string, designId: string) => void;
  addMilestone: (propertyId: string, data: { year: number; title: string; note?: string }) => void;
  deleteMilestone: (propertyId: string, milestoneId: string) => void;
  transferProperty: (propertyId: string, toName: string, note?: string) => void;
  setShare: (propertyId: string, enabled: boolean) => void;
  // Kniha domu — prvky a model
  addElement: (propertyId: string, data: ElementInput) => string;
  updateElement: (propertyId: string, elementId: string, data: Partial<ElementInput>) => void;
  deleteElement: (propertyId: string, elementId: string) => void;
  addModel: (propertyId: string, data: ModelInput) => string;
  updateModel: (propertyId: string, modelId: string, data: Partial<ModelInput>) => void;
  deleteModel: (propertyId: string, modelId: string) => void;
  // Navázání existujících záznamů na prvky
  setEntryElements: (propertyId: string, entryId: string, elementIds: string[]) => void;
  setDocumentElements: (propertyId: string, docId: string, elementIds: string[]) => void;
  setInventoryElement: (propertyId: string, itemId: string, elementId?: string) => void;
  // Termíny / revize
  updateReminder: (propertyId: string, reminderId: string, data: Partial<ReminderInput>) => void;
  completeReminder: (propertyId: string, reminderId: string, completion: ReminderCompletion) => void;
  // Pozvánky pro řemeslníky
  createInvite: (propertyId: string, data: InviteInput) => Invite;
  revokeInvite: (propertyId: string, token: string) => void;
  ensureOwnerKey: (propertyId: string) => string;
  // Potvrzení návrhu zápisu (AI / řemeslník) jedním klepnutím
  applyProposal: (propertyId: string, proposal: EntryProposal) => string;
  role: Role | null;
  login: (password: string) => boolean;
  logout: () => void;
  branding: Branding;
  setBranding: (b: Branding) => void;
};

const StoreContext = createContext<Store | null>(null);
const KEY = "domovni-pas-v1";
const ROLE_KEY = "bulo-role";
const BRANDING_KEY = "bulo-branding";

// Demo přihlášení – 3 hesla = 3 role. (Změnit lze tady.)
const PASSWORDS: Record<string, Role> = {
  architekt: "ARCHITECT",
  klient: "CLIENT",
  tvurce: "CREATOR",
};

const now = () => new Date().toISOString();

// Doplní chybějící kolekce u starších dat (localStorage, zálohy).
function normalizeProperty(p: Property): Property {
  return upgradeDemo({
    ...p,
    entries: p.entries ?? [],
    documents: p.documents ?? [],
    reminders: p.reminders ?? [],
    transfers: p.transfers ?? [],
    inventory: p.inventory ?? [],
    consultations: p.consultations ?? [],
    bids: p.bids ?? [],
    designs: p.designs ?? [],
    milestones: p.milestones ?? [],
    elements: p.elements ?? [],
    models: p.models ?? [],
    invites: p.invites ?? [],
  }, p.elements === undefined);
}

// Demo dům dostane ukázkový model (půdorys + prvky) jen jednou — při první migraci na prvky.
function upgradeDemo(p: Property, firstMigration: boolean): Property {
  if (!firstMigration || p.id !== "demo-dum") return p;
  return withDemoModel(p);
}

// Aktualizace jednoho domu (beze změny ostatních)
function patchProperty(
  list: Property[],
  propertyId: string,
  fn: (p: Property) => Property,
): Property[] {
  return list.map((p) => (p.id === propertyId ? fn(p) : p));
}

// Provedení termínu: zapíše historii, opakovaný termín posune o interval.
function completeReminderIn(r: Reminder, c: ReminderCompletion): Reminder {
  const history = [c, ...(r.history ?? [])];
  const lastDone = !r.lastDone || c.date > r.lastDone ? c.date : r.lastDone;
  const base = {
    ...r,
    history,
    lastDone,
    // doklad patří k poslednímu provedení (bez dokladu → žádný, starší zůstanou v historii)
    documentId: c.date >= (r.lastDone ?? "") ? c.documentId : r.documentId,
  };
  if (r.intervalMonths && r.intervalMonths > 0) {
    return { ...base, dueDate: addMonths(c.date, r.intervalMonths), done: false };
  }
  return { ...base, done: true };
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [role, setRole] = useState<Role | null>(null);
  const [branding, setBrandingState] = useState<Branding>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const storedRole = localStorage.getItem(ROLE_KEY) as Role | null;
      if (storedRole) setRole(storedRole);
    } catch {
      // ignore
    }
    try {
      const b = localStorage.getItem(BRANDING_KEY);
      if (b) setBrandingState(JSON.parse(b) as Branding);
    } catch {
      // ignore
    }
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Property[];
        // migrace starších dat (chybějící kolekce, prvky domu)
        setProperties(parsed.map(normalizeProperty));
      } else {
        setProperties(seed().map(normalizeProperty));
      }
    } catch {
      setProperties(seed().map(normalizeProperty));
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(properties));
    } catch {
      // localStorage může být plný (velké obrázky) – v ukázce ignorujeme
    }
  }, [properties, hydrated]);

  // Synchronizace sdílených pasů na server (aby QR/odkaz fungoval pro kohokoli).
  // Bez nakonfigurovaného backendu API vrátí 503 a tichounce se ignoruje.
  const publishedRef = useRef<Record<string, string>>({});
  useEffect(() => {
    if (!hydrated) return;
    for (const p of properties) {
      if (!p.shareEnabled) continue;
      const json = JSON.stringify(toShareSnapshot(p));
      if (publishedRef.current[p.id] === json) continue;
      publishedRef.current[p.id] = json;
      fetch(`/api/passport/${p.id}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: json,
      }).catch(() => {});
    }
    for (const id of Object.keys(publishedRef.current)) {
      const prop = properties.find((p) => p.id === id);
      if (!prop || !prop.shareEnabled) {
        delete publishedRef.current[id];
        fetch(`/api/passport/${id}`, { method: "DELETE" }).catch(() => {});
      }
    }
  }, [properties, hydrated]);

  const getProperty = useCallback(
    (id: string) => properties.find((p) => p.id === id),
    [properties],
  );

  const createProperty = useCallback(
    (data: PropertyInput) => {
      const id = newId();
      const p: Property = {
        ...data,
        id,
        ownerName: "Vy",
        shareEnabled: false,
        createdByRole: role ?? "CLIENT",
        handedOver: false,
        entries: [],
        documents: [],
        reminders: [],
        transfers: [],
        inventory: [],
        consultations: [],
        bids: [],
        designs: [],
        milestones: [],
        elements: [],
        models: [],
        invites: [],
        createdAt: now(),
        updatedAt: now(),
      };
      setProperties((prev) => [p, ...prev]);
      return id;
    },
    [role],
  );

  // Vytvoří nemovitost rovnou i se záznamy a dokumenty (používá průvodce „Založit pas").
  const createPropertyFull = useCallback(
    (data: PropertyInput, entries: EntryInput[], documents: DocumentInput[]) => {
      const id = newId();
      const p: Property = {
        ...data,
        id,
        ownerName: "Vy",
        shareEnabled: false,
        createdByRole: role ?? "CLIENT",
        handedOver: false,
        entries: entries.map((e) => ({ ...e, id: newId(), createdAt: now() })),
        documents: documents.map((d) => ({ ...d, id: newId(), createdAt: now() })),
        reminders: [],
        transfers: [],
        inventory: [],
        consultations: [],
        bids: [],
        designs: [],
        milestones: [],
        elements: [],
        models: [],
        invites: [],
        createdAt: now(),
        updatedAt: now(),
      };
      setProperties((prev) => [p, ...prev]);
      return id;
    },
    [role],
  );

  const updateProperty = useCallback((id: string, data: PropertyInput) => {
    setProperties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...data, updatedAt: now() } : p)),
    );
  }, []);

  const deleteProperty = useCallback((id: string) => {
    setProperties((prev) => prev.filter((p) => p.id !== id));
  }, []);

  // Obnova ze zálohy (správce). Doplní chybějící kolekce u starších záloh.
  const importProperties = useCallback((data: Property[]) => {
    setProperties(data.map(normalizeProperty));
  }, []);

  const addEntry = useCallback((propertyId: string, data: EntryInput) => {
    const entry: Entry = { ...data, id: newId(), createdAt: now() };
    setProperties((prev) =>
      prev.map((p) =>
        p.id === propertyId
          ? { ...p, entries: [entry, ...p.entries], updatedAt: now() }
          : p,
      ),
    );
  }, []);

  const deleteEntry = useCallback((propertyId: string, entryId: string) => {
    setProperties((prev) =>
      prev.map((p) =>
        p.id === propertyId
          ? { ...p, entries: p.entries.filter((e) => e.id !== entryId), updatedAt: now() }
          : p,
      ),
    );
  }, []);

  const addDocument = useCallback((propertyId: string, data: DocumentInput) => {
    const doc: DocItem = { ...data, id: newId(), createdAt: now() };
    setProperties((prev) =>
      prev.map((p) =>
        p.id === propertyId
          ? { ...p, documents: [doc, ...p.documents], updatedAt: now() }
          : p,
      ),
    );
  }, []);

  const deleteDocument = useCallback((propertyId: string, docId: string) => {
    setProperties((prev) =>
      prev.map((p) =>
        p.id === propertyId
          ? { ...p, documents: p.documents.filter((d) => d.id !== docId), updatedAt: now() }
          : p,
      ),
    );
  }, []);

  const addReminder = useCallback((propertyId: string, data: ReminderInput) => {
    const reminder: Reminder = { ...data, id: newId(), done: false };
    setProperties((prev) =>
      prev.map((p) =>
        p.id === propertyId
          ? { ...p, reminders: [...p.reminders, reminder], updatedAt: now() }
          : p,
      ),
    );
  }, []);

  const toggleReminder = useCallback((propertyId: string, reminderId: string) => {
    setProperties((prev) =>
      prev.map((p) =>
        p.id === propertyId
          ? {
              ...p,
              reminders: p.reminders.map((r) =>
                r.id === reminderId ? { ...r, done: !r.done } : r,
              ),
            }
          : p,
      ),
    );
  }, []);

  const deleteReminder = useCallback((propertyId: string, reminderId: string) => {
    setProperties((prev) =>
      prev.map((p) =>
        p.id === propertyId
          ? { ...p, reminders: p.reminders.filter((r) => r.id !== reminderId) }
          : p,
      ),
    );
  }, []);

  const addInventoryItem = useCallback((propertyId: string, data: InventoryInput) => {
    const item: InventoryItem = { ...data, id: newId() };
    setProperties((prev) =>
      prev.map((p) =>
        p.id === propertyId
          ? { ...p, inventory: [...p.inventory, item], updatedAt: now() }
          : p,
      ),
    );
  }, []);

  const deleteInventoryItem = useCallback((propertyId: string, itemId: string) => {
    setProperties((prev) =>
      prev.map((p) =>
        p.id === propertyId
          ? { ...p, inventory: p.inventory.filter((i) => i.id !== itemId) }
          : p,
      ),
    );
  }, []);

  const addConsultation = useCallback(
    (propertyId: string, data: { topic?: string; text: string }) => {
      const note: ConsultationNote = {
        id: newId(),
        authorRole: role ?? "CLIENT",
        topic: data.topic,
        text: data.text,
        status: "OPEN",
        createdAt: now(),
      };
      setProperties((prev) =>
        prev.map((p) =>
          p.id === propertyId
            ? { ...p, consultations: [...(p.consultations ?? []), note], updatedAt: now() }
            : p,
        ),
      );
    },
    [role],
  );

  const deleteConsultation = useCallback((propertyId: string, noteId: string) => {
    setProperties((prev) =>
      prev.map((p) =>
        p.id === propertyId
          ? { ...p, consultations: (p.consultations ?? []).filter((c) => c.id !== noteId) }
          : p,
      ),
    );
  }, []);

  const setConsultationStatus = useCallback(
    (propertyId: string, noteId: string, status: ConsultationStatus) => {
      setProperties((prev) =>
        prev.map((p) =>
          p.id === propertyId
            ? {
                ...p,
                consultations: (p.consultations ?? []).map((c) =>
                  c.id === noteId ? { ...c, status } : c,
                ),
              }
            : p,
        ),
      );
    },
    [],
  );

  const addBid = useCallback((propertyId: string, data: ContractorBidInput) => {
    const bid: ContractorBid = { ...data, id: newId(), status: "RECEIVED", createdAt: now() };
    setProperties((prev) =>
      prev.map((p) =>
        p.id === propertyId ? { ...p, bids: [...(p.bids ?? []), bid], updatedAt: now() } : p,
      ),
    );
  }, []);

  const deleteBid = useCallback((propertyId: string, bidId: string) => {
    setProperties((prev) =>
      prev.map((p) =>
        p.id === propertyId ? { ...p, bids: (p.bids ?? []).filter((b) => b.id !== bidId) } : p,
      ),
    );
  }, []);

  const setBidStatus = useCallback((propertyId: string, bidId: string, status: BidStatus) => {
    setProperties((prev) =>
      prev.map((p) =>
        p.id === propertyId
          ? { ...p, bids: (p.bids ?? []).map((b) => (b.id === bidId ? { ...b, status } : b)) }
          : p,
      ),
    );
  }, []);

  const addDesign = useCallback(
    (propertyId: string, data: { title: string; note?: string; media: Media[] }) => {
      const design: DesignProposal = {
        id: newId(),
        title: data.title,
        note: data.note,
        media: data.media,
        authorRole: role ?? "ARCHITECT",
        createdAt: now(),
      };
      setProperties((prev) =>
        prev.map((p) =>
          p.id === propertyId
            ? { ...p, designs: [design, ...(p.designs ?? [])], updatedAt: now() }
            : p,
        ),
      );
    },
    [role],
  );

  const deleteDesign = useCallback((propertyId: string, designId: string) => {
    setProperties((prev) =>
      prev.map((p) =>
        p.id === propertyId
          ? { ...p, designs: (p.designs ?? []).filter((d) => d.id !== designId) }
          : p,
      ),
    );
  }, []);

  const addMilestone = useCallback(
    (propertyId: string, data: { year: number; title: string; note?: string }) => {
      const m: ArchMilestone = { ...data, id: newId(), createdAt: now() };
      setProperties((prev) =>
        prev.map((p) =>
          p.id === propertyId
            ? { ...p, milestones: [...(p.milestones ?? []), m], updatedAt: now() }
            : p,
        ),
      );
    },
    [],
  );

  const deleteMilestone = useCallback((propertyId: string, milestoneId: string) => {
    setProperties((prev) =>
      prev.map((p) =>
        p.id === propertyId
          ? { ...p, milestones: (p.milestones ?? []).filter((m) => m.id !== milestoneId) }
          : p,
      ),
    );
  }, []);

  // Převod vlastnictví – jádro hodnoty (přenositelnost). V ukázce zaznamená předání
  // a přepíše jméno vlastníka; auditní stopa zůstává v transfers.
  const transferProperty = useCallback((propertyId: string, toName: string, note?: string) => {
    setProperties((prev) =>
      prev.map((p) => {
        if (p.id !== propertyId) return p;
        const record: TransferRecord = {
          id: newId(),
          fromName: p.ownerName,
          toName,
          note,
          date: now(),
        };
        return {
          ...p,
          ownerName: toName,
          shareEnabled: false,
          handedOver: true,
          transfers: [record, ...p.transfers],
          // pozvánky předchozího majitele po převodu neplatí
          invites: (p.invites ?? []).map((i) => ({ ...i, revoked: true })),
          updatedAt: now(),
        };
      }),
    );
  }, []);

  const setShare = useCallback((propertyId: string, enabled: boolean) => {
    setProperties((prev) =>
      prev.map((p) => (p.id === propertyId ? { ...p, shareEnabled: enabled } : p)),
    );
  }, []);

  // --- Kniha domu: prvky ---

  const addElement = useCallback((propertyId: string, data: ElementInput) => {
    const id = newId();
    const el: HouseElement = { ...data, id, createdAt: now(), updatedAt: now() };
    setProperties((prev) =>
      patchProperty(prev, propertyId, (p) => ({
        ...p,
        elements: [...(p.elements ?? []), el],
        updatedAt: now(),
      })),
    );
    return id;
  }, []);

  const updateElement = useCallback(
    (propertyId: string, elementId: string, data: Partial<ElementInput>) => {
      setProperties((prev) =>
        patchProperty(prev, propertyId, (p) => ({
          ...p,
          elements: (p.elements ?? []).map((e) =>
            e.id === elementId ? { ...e, ...data, updatedAt: now() } : e,
          ),
          updatedAt: now(),
        })),
      );
    },
    [],
  );

  // Smaže prvek a odpojí ho od záznamů, dokumentů, termínů a vybavení (ty zůstávají).
  const deleteElement = useCallback((propertyId: string, elementId: string) => {
    const unlink = (ids?: string[]) => {
      if (!ids) return ids;
      const next = ids.filter((x) => x !== elementId);
      return next.length ? next : undefined;
    };
    setProperties((prev) =>
      patchProperty(prev, propertyId, (p) => ({
        ...p,
        elements: (p.elements ?? []).filter((e) => e.id !== elementId),
        entries: p.entries.map((e) => ({ ...e, elementIds: unlink(e.elementIds) })),
        documents: p.documents.map((d) => ({ ...d, elementIds: unlink(d.elementIds) })),
        reminders: p.reminders.map((r) =>
          r.elementId === elementId ? { ...r, elementId: undefined } : r,
        ),
        inventory: p.inventory.map((i) =>
          i.elementId === elementId ? { ...i, elementId: undefined } : i,
        ),
        invites: (p.invites ?? []).map((i) =>
          i.elementId === elementId ? { ...i, revoked: true } : i,
        ),
        updatedAt: now(),
      })),
    );
  }, []);

  // --- Kniha domu: podklady modelu ---

  const addModel = useCallback((propertyId: string, data: ModelInput) => {
    const id = newId();
    setProperties((prev) =>
      patchProperty(prev, propertyId, (p) => {
        const sameTitle = (p.models ?? []).filter((m) => m.title === data.title);
        const version = data.version ?? sameTitle.reduce((v, m) => Math.max(v, m.version), 0) + 1;
        const model: HouseModel = { ...data, id, version, createdAt: now() };
        return { ...p, models: [...(p.models ?? []), model], updatedAt: now() };
      }),
    );
    return id;
  }, []);

  const updateModel = useCallback(
    (propertyId: string, modelId: string, data: Partial<ModelInput>) => {
      setProperties((prev) =>
        patchProperty(prev, propertyId, (p) => ({
          ...p,
          models: (p.models ?? []).map((m) => (m.id === modelId ? { ...m, ...data } : m)),
          updatedAt: now(),
        })),
      );
    },
    [],
  );

  // Smaže podklad; prvkům na něm umístěným zůstane vše kromě polohy na tomto podkladu.
  const deleteModel = useCallback((propertyId: string, modelId: string) => {
    setProperties((prev) =>
      patchProperty(prev, propertyId, (p) => ({
        ...p,
        models: (p.models ?? []).filter((m) => m.id !== modelId),
        elements: (p.elements ?? []).map((e) =>
          e.plan?.modelId === modelId ? { ...e, plan: undefined } : e,
        ),
        updatedAt: now(),
      })),
    );
  }, []);

  // --- Navázání existujících záznamů na prvky ---

  const setEntryElements = useCallback(
    (propertyId: string, entryId: string, elementIds: string[]) => {
      setProperties((prev) =>
        patchProperty(prev, propertyId, (p) => ({
          ...p,
          entries: p.entries.map((e) =>
            e.id === entryId ? { ...e, elementIds: elementIds.length ? elementIds : undefined } : e,
          ),
          updatedAt: now(),
        })),
      );
    },
    [],
  );

  const setDocumentElements = useCallback(
    (propertyId: string, docId: string, elementIds: string[]) => {
      setProperties((prev) =>
        patchProperty(prev, propertyId, (p) => ({
          ...p,
          documents: p.documents.map((d) =>
            d.id === docId ? { ...d, elementIds: elementIds.length ? elementIds : undefined } : d,
          ),
          updatedAt: now(),
        })),
      );
    },
    [],
  );

  const setInventoryElement = useCallback(
    (propertyId: string, itemId: string, elementId?: string) => {
      setProperties((prev) =>
        patchProperty(prev, propertyId, (p) => ({
          ...p,
          inventory: p.inventory.map((i) => (i.id === itemId ? { ...i, elementId } : i)),
          updatedAt: now(),
        })),
      );
    },
    [],
  );

  // --- Termíny / revize ---

  const updateReminder = useCallback(
    (propertyId: string, reminderId: string, data: Partial<ReminderInput>) => {
      setProperties((prev) =>
        patchProperty(prev, propertyId, (p) => ({
          ...p,
          reminders: p.reminders.map((r) => (r.id === reminderId ? { ...r, ...data } : r)),
          updatedAt: now(),
        })),
      );
    },
    [],
  );

  const completeReminder = useCallback(
    (propertyId: string, reminderId: string, completion: ReminderCompletion) => {
      setProperties((prev) =>
        patchProperty(prev, propertyId, (p) => ({
          ...p,
          reminders: p.reminders.map((r) =>
            r.id === reminderId ? completeReminderIn(r, completion) : r,
          ),
          updatedAt: now(),
        })),
      );
    },
    [],
  );

  // --- Pozvánky ---

  // Klíč majitele k inboxu na serveru (vznikne při první pozvánce, zůstává v prohlížeči).
  // Vrací existující klíč, nebo vygeneruje nový a uloží ho.
  const ensureOwnerKey = useCallback(
    (propertyId: string) => {
      const existing = properties.find((p) => p.id === propertyId)?.ownerKey;
      if (existing) return existing;
      const key = newToken();
      setProperties((prev) =>
        patchProperty(prev, propertyId, (p) => (p.ownerKey ? p : { ...p, ownerKey: key })),
      );
      return key;
    },
    [properties],
  );

  const createInvite = useCallback((propertyId: string, data: InviteInput) => {
    const invite: Invite = { ...data, token: newToken(), createdAt: now() };
    setProperties((prev) =>
      patchProperty(prev, propertyId, (p) => ({
        ...p,
        invites: [invite, ...(p.invites ?? [])],
        updatedAt: now(),
      })),
    );
    return invite;
  }, []);

  const revokeInvite = useCallback((propertyId: string, token: string) => {
    setProperties((prev) =>
      patchProperty(prev, propertyId, (p) => ({
        ...p,
        invites: (p.invites ?? []).map((i) => (i.token === token ? { ...i, revoked: true } : i)),
        updatedAt: now(),
      })),
    );
  }, []);

  // --- Potvrzení návrhu zápisu (vše v jednom kroku) ---
  // Uloží doklady, zápis (s odkazy na doklady a prvky), provede/posune termín
  // a případně zpřesní polohu prvku. Vrací id nového zápisu.
  const applyProposal = useCallback((propertyId: string, proposal: EntryProposal) => {
    const entryId = newId();
    const stamp = now();
    const docs: DocItem[] = (proposal.documents ?? []).map((d) => ({
      ...d,
      id: newId(),
      elementIds: d.elementIds ?? proposal.entry.elementIds,
      createdAt: stamp,
    }));
    const entry: Entry = {
      ...proposal.entry,
      id: entryId,
      documentIds: [...(proposal.entry.documentIds ?? []), ...docs.map((d) => d.id)],
      confirmedAt: proposal.entry.confirmedAt ?? stamp,
      createdAt: stamp,
    };
    if (!entry.documentIds?.length) entry.documentIds = undefined;

    setProperties((prev) =>
      patchProperty(prev, propertyId, (p) => {
        let reminders = p.reminders;
        const dl = proposal.deadline;
        if (dl) {
          const protocolId = docs.find((d) => d.category === "PROTOCOL" || d.category === "CERTIFICATE")?.id;
          const completion: ReminderCompletion = {
            date: entry.date,
            entryId,
            documentId: protocolId,
            result: entry.result,
            note: entry.description,
          };
          const existing = dl.reminderId ? reminders.find((r) => r.id === dl.reminderId) : undefined;
          if (existing) {
            reminders = reminders.map((r) => {
              if (r.id !== existing.id) return r;
              const withInterval: Reminder = {
                ...r,
                intervalMonths: dl.intervalMonths ?? r.intervalMonths,
                intervalConfirmed: dl.intervalConfirmed ?? r.intervalConfirmed,
                confirmedBy: dl.confirmedBy ?? r.confirmedBy,
                elementId: r.elementId ?? dl.elementId,
              };
              const done = completeReminderIn(withInterval, completion);
              // výslovně uvedený další termín (z protokolu) má přednost před výpočtem
              return dl.nextDueDate ? { ...done, dueDate: dl.nextDueDate, done: false } : done;
            });
          } else if (dl.nextDueDate) {
            const created: Reminder = {
              id: newId(),
              title: dl.title,
              type: dl.type,
              dueDate: dl.nextDueDate,
              done: false,
              elementId: dl.elementId,
              intervalMonths: dl.intervalMonths,
              intervalConfirmed: dl.intervalConfirmed,
              confirmedBy: dl.confirmedBy,
              lastDone: entry.date,
              documentId: protocolId,
              history: [completion],
            };
            reminders = [...reminders, created];
          }
        }

        let elements = p.elements ?? [];
        const rf = proposal.refineElement;
        if (rf) {
          elements = elements.map((e) =>
            e.id === rf.elementId
              ? { ...e, source: rf.source, accuracyMm: rf.accuracyMm ?? e.accuracyMm, updatedAt: stamp }
              : e,
          );
        }

        return {
          ...p,
          entries: [entry, ...p.entries],
          documents: [...docs, ...p.documents],
          reminders,
          elements,
          updatedAt: stamp,
        };
      }),
    );
    return entryId;
  }, []);

  const login = useCallback((password: string) => {
    const r = PASSWORDS[password.trim().toLowerCase()];
    if (!r) return false;
    setRole(r);
    try {
      localStorage.setItem(ROLE_KEY, r);
    } catch {
      // ignore
    }
    return true;
  }, []);

  const logout = useCallback(() => {
    setRole(null);
    try {
      localStorage.removeItem(ROLE_KEY);
    } catch {
      // ignore
    }
  }, []);

  const setBranding = useCallback((b: Branding) => {
    setBrandingState(b);
    try {
      localStorage.setItem(BRANDING_KEY, JSON.stringify(b));
    } catch {
      // ignore
    }
  }, []);

  const value: Store = {
    properties,
    hydrated,
    getProperty,
    createProperty,
    createPropertyFull,
    updateProperty,
    deleteProperty,
    importProperties,
    addEntry,
    deleteEntry,
    addDocument,
    deleteDocument,
    addReminder,
    toggleReminder,
    deleteReminder,
    addInventoryItem,
    deleteInventoryItem,
    addConsultation,
    deleteConsultation,
    setConsultationStatus,
    addBid,
    deleteBid,
    setBidStatus,
    addDesign,
    deleteDesign,
    addMilestone,
    deleteMilestone,
    transferProperty,
    setShare,
    addElement,
    updateElement,
    deleteElement,
    addModel,
    updateModel,
    deleteModel,
    setEntryElements,
    setDocumentElements,
    setInventoryElement,
    updateReminder,
    completeReminder,
    createInvite,
    revokeInvite,
    ensureOwnerKey,
    applyProposal,
    role,
    login,
    logout,
    branding,
    setBranding,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): Store {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore musí být uvnitř <StoreProvider>");
  return ctx;
}

// --- Demo data (zobrazí se při prvním otevření) ---
function seed(): Property[] {
  return [
    {
      id: "demo-dum",
      name: "Rodinný dům Říčany",
      type: "HOUSE",
      street: "Lipová 482",
      city: "Říčany",
      zip: "25101",
      cadastralArea: "Říčany u Prahy",
      parcelNumber: "1284/7",
      yearBuilt: 2009,
      description: "Dvoupodlažní cihlový dům, zateplený, plynový kotel.",
      investor: "Rodina Nováková",
      floorArea: 180,
      energyClass: "B",
      architect: "Ateliér Kořínek",
      contractors:
        "Stavební firma: Stavby Novák s.r.o. (777 123 456)\nElektro: Jan Dvořák (605 987 654)\nVoda a topení: TermoInstal (775 222 333)",
      designer: "Ing. Petr Malý (statika)",
      constructionSystem: "Zděný (Porotherm), železobetonové stropy",
      builtUpArea: 110,
      materials: "Cihla Porotherm, minerální zateplení, betonová krytina, dřevěná eurookna",
      ownerName: "Jana Nováková",
      shareEnabled: false,
      createdByRole: "CLIENT",
      handedOver: false,
      entries: [
        {
          id: "s-e1",
          type: "INSPECTION",
          title: "Revize plynového kotle",
          description: "Roční servisní prohlídka, kotel v pořádku, vyměněn filtr.",
          date: "2025-10-12",
          cost: 1800,
          media: [],
          createdAt: "2025-10-12",
        },
        {
          id: "s-e2",
          type: "DEFECT",
          title: "Zatékání u střešního okna",
          description: "Při dešti zatéká kolem rámu střešního okna v ložnici.",
          date: "2025-11-03",
          media: [],
          createdAt: "2025-11-03",
        },
        {
          id: "s-e3",
          type: "REPAIR",
          title: "Oprava oplechování střešního okna",
          description: "Vyměněno oplechování a přetmeleno, zatékání vyřešeno.",
          date: "2025-11-20",
          cost: 4500,
          media: [],
          createdAt: "2025-11-20",
        },
        {
          id: "s-e4",
          type: "RENOVATION",
          title: "Rekonstrukce koupelny v patře",
          description: "Nové obklady, sprchový kout, podlahové topení.",
          date: "2024-06-15",
          cost: 189000,
          media: [],
          createdAt: "2024-06-15",
        },
      ],
      documents: [
        {
          id: "s-d1",
          title: "Průkaz energetické náročnosti budovy",
          category: "ENERGY_LABEL",
          section: "BUDOVA",
          fileName: "PENB_Ricany.pdf",
        },
        {
          id: "s-d2",
          title: "Projektová dokumentace – půdorysy",
          category: "PLAN",
          section: "NAVRH",
          fileName: "Pudorysy.pdf",
        },
        {
          id: "s-d3",
          title: "Výpis z katastru nemovitostí",
          category: "OTHER",
          section: "POZEMEK",
          fileName: "Vypis_katastr.pdf",
        },
        {
          id: "s-d4",
          title: "Faktura — rekonstrukce koupelny",
          category: "INVOICE",
          section: "REALIZACE",
          fileName: "Faktura_koupelna.pdf",
        },
      ],
      reminders: [
        { id: "s-r1", type: "INSPECTION", title: "Revize plynového kotle", dueDate: "2026-10-12", note: "Roční servis", done: false },
        { id: "s-r2", type: "INSPECTION", title: "Revize komínu", dueDate: "2026-05-30", done: false },
        { id: "s-r3", type: "WARRANTY", title: "Konec záruky na střešní okno", dueDate: "2027-11-20", done: false },
      ],
      transfers: [],
      inventory: [
        { id: "s-i1", name: "Páková baterie Grohe", location: "Koupelna", brand: "Grohe Eurosmart", price: 3200, warrantyUntil: "2032-06-01", productUrl: "https://www.grohe.cz" },
        { id: "s-i2", name: "Plynový kotel", location: "Kotelna", brand: "Model XYZ", warrantyUntil: "2027-10-12", note: "Servis 2025, další revize 2027" },
        { id: "s-i3", name: "Střešní krytina", location: "Střecha", brand: "Krytina ABC", note: "Montáž 2024" },
        { id: "s-i4", name: "Dřevěná podlaha", location: "Obývací pokoj", brand: "Kährs dub", price: 48000, warrantyUntil: "2030-06-15" },
      ],
      milestones: [
        { id: "m-1", year: 2008, title: "Návrh domu", note: "Studie a projektová dokumentace.", createdAt: "2024-01-01" },
        { id: "m-2", year: 2009, title: "Realizace stavby", note: "Hrubá stavba a dokončení.", createdAt: "2024-01-01" },
        { id: "m-3", year: 2018, title: "Výměna plynového kotle", createdAt: "2024-01-01" },
        { id: "m-4", year: 2024, title: "Rekonstrukce koupelny v patře", createdAt: "2024-01-01" },
        { id: "m-5", year: 2025, title: "Oprava oplechování střešního okna", createdAt: "2024-01-01" },
      ],
      createdAt: "2024-01-01",
      updatedAt: "2025-11-20",
    },
    {
      id: "demo-byt",
      name: "Byt Karlín 3+kk",
      type: "APARTMENT",
      street: "Sokolovská 120",
      city: "Praha 8",
      zip: "18600",
      yearBuilt: 2018,
      description: "Rekonstrukce bytu v cihlovém domě.",
      ownerName: "Jana Nováková",
      shareEnabled: false,
      createdByRole: "CLIENT",
      handedOver: false,
      entries: [
        {
          id: "s-e5",
          type: "RENOVATION",
          title: "Výměna kuchyňské linky",
          description: "Nová linka na míru včetně spotřebičů.",
          date: "2025-03-10",
          cost: 120000,
          media: [],
          createdAt: "2025-03-10",
        },
        {
          id: "s-e6",
          type: "DEFECT",
          title: "Prosakující odpad pod dřezem",
          description: "Pod kuchyňským dřezem se objevila vlhkost, nutné prověřit těsnění.",
          date: "2026-06-05",
          media: [],
          createdAt: "2026-06-05",
        },
      ],
      documents: [],
      reminders: [
        { id: "s-r4", type: "MAINTENANCE", title: "Výměna filtrů rekuperace", dueDate: "2026-07-01", done: false },
      ],
      transfers: [],
      inventory: [
        { id: "s-i5", name: "Kuchyňská linka na míru", location: "Kuchyně", price: 120000, warrantyUntil: "2030-03-10" },
        { id: "s-i6", name: "Indukční deska", location: "Kuchyně", brand: "Bosch", warrantyUntil: "2026-07-10" },
      ],
      createdAt: "2024-02-01",
      updatedAt: "2025-03-10",
    },
    {
      id: "demo-vila",
      name: "Vila Beroun",
      type: "HOUSE",
      street: "Na Stráni 12",
      city: "Beroun",
      zip: "26601",
      yearBuilt: 2025,
      description: "Novostavba, dokončeno a předáno investorovi.",
      investor: "Rodina Svobodova",
      floorArea: 210,
      energyClass: "A",
      architect: "Ateliér Kořínek",
      contractors: "Stavební firma: Bau Beroun s.r.o.\nOkna: Window Pro",
      createdByRole: "ARCHITECT",
      handedOver: true,
      ownerName: "Rodina Svobodova",
      shareEnabled: false,
      entries: [
        {
          id: "v-e1",
          type: "OTHER",
          title: "Předání projektu architektem",
          date: "2026-03-01",
          media: [],
          createdAt: "2026-03-01",
        },
      ],
      documents: [],
      reminders: [],
      transfers: [
        {
          id: "v-t1",
          fromName: "Ateliér Kořínek",
          toName: "Rodina Svobodova",
          date: "2026-03-01T10:00:00.000Z",
          note: "Předání hotové stavby",
        },
      ],
      inventory: [],
      createdAt: "2025-06-01",
      updatedAt: "2026-03-01",
    },
    {
      id: "demo-novostavba",
      name: "Novostavba Černošice",
      type: "HOUSE",
      street: "Slunečná 8",
      city: "Černošice",
      zip: "25228",
      yearBuilt: 2026,
      description: "Rozpracovaný projekt, zatím nepředáno.",
      investor: "Pan Horák",
      floorArea: 160,
      energyClass: "A",
      architect: "Ateliér Kořínek",
      createdByRole: "ARCHITECT",
      handedOver: false,
      ownerName: "Ateliér Kořínek",
      shareEnabled: false,
      entries: [
        {
          id: "n-e1",
          type: "RENOVATION",
          title: "Zahájení realizace",
          date: "2026-04-15",
          media: [],
          createdAt: "2026-04-15",
        },
      ],
      documents: [],
      reminders: [],
      transfers: [],
      inventory: [],
      consultations: [
        {
          id: "k-1",
          authorRole: "ARCHITECT",
          topic: "Studie — dispozice",
          text: "Posílám upravenou studii s otevřenou dispozicí přízemí a posunutým schodištěm. Prosím o připomínky.",
          status: "RESOLVED",
          createdAt: "2026-02-18",
        },
        {
          id: "k-2",
          authorRole: "CLIENT",
          topic: "Studie — dispozice",
          text: "Děkujeme, vypadá to skvěle. Šlo by zvětšit spíž a přidat okno do koupelny?",
          status: "RESOLVED",
          createdAt: "2026-02-21",
        },
        {
          id: "k-3",
          authorRole: "ARCHITECT",
          topic: "Materiály fasády",
          text: "K fasádě navrhuji kombinaci omítky a dřevěného obkladu. Vzorky ukážu na příští schůzce.",
          status: "WAITING",
          createdAt: "2026-03-10",
        },
      ],
      bids: [
        { id: "b-1", company: "Stavby Novák s.r.o.", contact: "777 123 456", price: 9850000, durationWeeks: 52, rating: 4, note: "Reference v okolí, dobrá komunikace.", status: "RECEIVED", createdAt: "2026-03-15" },
        { id: "b-2", company: "Bau Beroun s.r.o.", contact: "604 222 333", price: 9200000, durationWeeks: 60, rating: 5, note: "Nejlepší cena, delší termín.", status: "SELECTED", createdAt: "2026-03-18" },
        { id: "b-3", company: "RychláStavba a.s.", contact: "608 999 111", price: 11200000, durationWeeks: 40, rating: 3, note: "Rychlý termín, vyšší cena.", status: "REJECTED", createdAt: "2026-03-20" },
      ],
      designs: [
        {
          id: "d-1",
          title: "Studie — přízemí (v2)",
          note: "Otevřená dispozice s posunutým schodištěm dle konzultace.",
          authorRole: "ARCHITECT",
          media: [
            { id: "dm-1", name: "studie-prizemi.svg", kind: "image", dataUrl: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0ODAiIGhlaWdodD0iMzIwIj48cmVjdCB3aWR0aD0iNDgwIiBoZWlnaHQ9IjMyMCIgZmlsbD0iIzE4NEU1QSIvPjx0ZXh0IHg9IjI0MCIgeT0iMTcwIiBmb250LXNpemU9IjMwIiBmaWxsPSIjZmZmZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiI+U3R1ZGllIC0gcHJpemVtaTwvdGV4dD48L3N2Zz4=" },
          ],
          createdAt: "2026-02-18",
        },
        {
          id: "d-2",
          title: "Vizualizace fasády + řez",
          note: "Kombinace omítky a dřevěného obkladu, řez A–A.",
          authorRole: "ARCHITECT",
          media: [
            { id: "dm-2", name: "fasada.svg", kind: "image", dataUrl: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0ODAiIGhlaWdodD0iMzIwIj48cmVjdCB3aWR0aD0iNDgwIiBoZWlnaHQ9IjMyMCIgZmlsbD0iI0I1NTQzQSIvPjx0ZXh0IHg9IjI0MCIgeT0iMTcwIiBmb250LXNpemU9IjMwIiBmaWxsPSIjZmZmZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiI+Vml6dWFsaXphY2UgZmFzYWR5PC90ZXh0Pjwvc3ZnPg==" },
            { id: "dm-3", name: "rez.svg", kind: "image", dataUrl: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0ODAiIGhlaWdodD0iMzIwIj48cmVjdCB3aWR0aD0iNDgwIiBoZWlnaHQ9IjMyMCIgZmlsbD0iIzJGNUQ1MCIvPjx0ZXh0IHg9IjI0MCIgeT0iMTcwIiBmb250LXNpemU9IjMwIiBmaWxsPSIjZmZmZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiI+UmV6IEEtQTwvdGV4dD48L3N2Zz4=" },
          ],
          createdAt: "2026-03-10",
        },
      ],
      createdAt: "2026-01-10",
      updatedAt: "2026-04-15",
    },
  ];
}
