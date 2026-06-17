"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { newId } from "./id";

// Sdílený „pas" pro server — bez datových příloh (dataUrl), ať je payload malý.
function toShareSnapshot(p: Property): Property {
  return {
    ...p,
    documents: p.documents.map((d) => ({ ...d, dataUrl: undefined })),
    entries: p.entries.map((e) => ({
      ...e,
      media: e.media.map((m) => ({ ...m, dataUrl: undefined })),
    })),
    inventory: p.inventory.map((i) => ({ ...i, dataUrl: undefined })),
    consultations: [], // interní konzultace nesdílíme veřejně
    bids: [], // nabídky firem jsou interní
    designs: [], // návrhy (velká média) nesdílíme přes server
    costs: [], // náklady a faktury jsou interní
    messages: [], // chat je interní
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
  | "ENERGY_LABEL"
  | "INVOICE"
  | "OTHER";

// Fáze/sekce projektu, do které dokument patří
export type DocSection = "POZEMEK" | "NAVRH" | "REALIZACE" | "BUDOVA";

export type Media = { id: string; name: string; kind: "image" | "file"; dataUrl?: string };

export type Entry = {
  id: string;
  type: EntryType;
  title: string;
  description?: string;
  date: string; // YYYY-MM-DD
  cost?: number;
  media: Media[];
  createdAt: string;
};

export type DocItem = {
  id: string;
  title: string;
  category: DocCategory;
  section?: DocSection;
  fileName?: string;
  dataUrl?: string;
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
  costs?: CostItem[];
  messages?: ChatMessage[];
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
};

export type DocumentInput = {
  title: string;
  category: DocCategory;
  section?: DocSection;
  fileName?: string;
  dataUrl?: string;
};

export type ReminderType = "INSPECTION" | "MAINTENANCE" | "WARRANTY" | "OTHER";

export type Reminder = {
  id: string;
  title: string;
  type: ReminderType;
  dueDate: string; // YYYY-MM-DD
  note?: string;
  done: boolean;
};

export type ReminderInput = {
  title: string;
  type: ReminderType;
  dueDate: string;
  note?: string;
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

export type ConsultationReply = {
  id: string;
  authorRole: Role;
  text: string;
  createdAt: string;
};

export type ConsultationNote = {
  id: string;
  authorRole: Role;
  topic?: string;
  text: string;
  status?: ConsultationStatus;
  replies?: ConsultationReply[];
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

// Chat u nemovitosti — komunikace mezi architektem, klientem a dalšími
export type ChatMessage = {
  id: string;
  authorRole: Role;
  text: string;
  createdAt: string;
};

// Náklad stavby s napojenou fakturou (databáze nákladů)
export type CostItem = {
  id: string;
  title: string;
  category?: string;
  amount: number;
  date: string; // YYYY-MM-DD
  supplier?: string;
  invoiceName?: string;
  invoiceUrl?: string;
  note?: string;
  createdAt: string;
};

export type CostInput = {
  title: string;
  category?: string;
  amount: number;
  date: string;
  supplier?: string;
  invoiceName?: string;
  invoiceUrl?: string;
  note?: string;
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
  updateDocument: (
    propertyId: string,
    docId: string,
    data: { title: string; category: DocCategory; section?: DocSection },
  ) => void;
  deleteDocument: (propertyId: string, docId: string) => void;
  addReminder: (propertyId: string, data: ReminderInput) => void;
  updateReminder: (propertyId: string, reminderId: string, data: ReminderInput) => void;
  toggleReminder: (propertyId: string, reminderId: string) => void;
  deleteReminder: (propertyId: string, reminderId: string) => void;
  addInventoryItem: (propertyId: string, data: InventoryInput) => void;
  deleteInventoryItem: (propertyId: string, itemId: string) => void;
  addConsultation: (propertyId: string, data: { topic?: string; text: string }) => void;
  deleteConsultation: (propertyId: string, noteId: string) => void;
  setConsultationStatus: (propertyId: string, noteId: string, status: ConsultationStatus) => void;
  addConsultationReply: (propertyId: string, noteId: string, text: string) => void;
  addBid: (propertyId: string, data: ContractorBidInput) => void;
  deleteBid: (propertyId: string, bidId: string) => void;
  setBidStatus: (propertyId: string, bidId: string, status: BidStatus) => void;
  addDesign: (propertyId: string, data: { title: string; note?: string; media: Media[] }) => void;
  deleteDesign: (propertyId: string, designId: string) => void;
  addMilestone: (propertyId: string, data: { year: number; title: string; note?: string }) => void;
  deleteMilestone: (propertyId: string, milestoneId: string) => void;
  addCost: (propertyId: string, data: CostInput) => void;
  deleteCost: (propertyId: string, costId: string) => void;
  addChatMessage: (propertyId: string, text: string) => void;
  deleteChatMessage: (propertyId: string, messageId: string) => void;
  transferProperty: (propertyId: string, toName: string, note?: string) => void;
  setShare: (propertyId: string, enabled: boolean) => void;
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
        // migrace starších dat bez reminders/transfers
        setProperties(
          parsed.map((p) => ({
            ...p,
            reminders: p.reminders ?? [],
            transfers: p.transfers ?? [],
            inventory: p.inventory ?? [],
            consultations: p.consultations ?? [],
            bids: p.bids ?? [],
            designs: p.designs ?? [],
            milestones: p.milestones ?? [],
            costs: p.costs ?? [],
            messages: p.messages ?? [],
          })),
        );
      } else {
        setProperties(seed());
      }
    } catch {
      setProperties(seed());
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
        costs: [],
        messages: [],
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
        documents: documents.map((d) => ({ ...d, id: newId() })),
        reminders: [],
        transfers: [],
        inventory: [],
        consultations: [],
        bids: [],
        designs: [],
        milestones: [],
        costs: [],
        messages: [],
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
    setProperties(
      data.map((p) => ({
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
        costs: p.costs ?? [],
        messages: p.messages ?? [],
      })),
    );
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
    const doc: DocItem = { ...data, id: newId() };
    setProperties((prev) =>
      prev.map((p) =>
        p.id === propertyId
          ? { ...p, documents: [doc, ...p.documents], updatedAt: now() }
          : p,
      ),
    );
  }, []);

  const updateDocument = useCallback(
    (
      propertyId: string,
      docId: string,
      data: { title: string; category: DocCategory; section?: DocSection },
    ) => {
      setProperties((prev) =>
        prev.map((p) =>
          p.id === propertyId
            ? {
                ...p,
                documents: p.documents.map((d) =>
                  d.id === docId
                    ? { ...d, title: data.title, category: data.category, section: data.section }
                    : d,
                ),
                updatedAt: now(),
              }
            : p,
        ),
      );
    },
    [],
  );

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

  const updateReminder = useCallback(
    (propertyId: string, reminderId: string, data: ReminderInput) => {
      setProperties((prev) =>
        prev.map((p) =>
          p.id === propertyId
            ? {
                ...p,
                reminders: p.reminders.map((r) => (r.id === reminderId ? { ...r, ...data } : r)),
                updatedAt: now(),
              }
            : p,
        ),
      );
    },
    [],
  );

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
      const author = role ?? "CLIENT";
      const note: ConsultationNote = {
        id: newId(),
        authorRole: author,
        topic: data.topic,
        text: data.text,
        // Stav podle toho, kdo psal: klient → čeká na architekta (OPEN),
        // architekt/správce → čeká na klienta (WAITING).
        status: author === "CLIENT" ? "OPEN" : "WAITING",
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

  const addConsultationReply = useCallback(
    (propertyId: string, noteId: string, text: string) => {
      const author = role ?? "CLIENT";
      const reply: ConsultationReply = {
        id: newId(),
        authorRole: author,
        text,
        createdAt: now(),
      };
      // Po odpovědi se stav nastaví sám podle toho, kdo odpověděl.
      const newStatus: ConsultationStatus = author === "CLIENT" ? "OPEN" : "WAITING";
      setProperties((prev) =>
        prev.map((p) =>
          p.id === propertyId
            ? {
                ...p,
                consultations: (p.consultations ?? []).map((c) =>
                  c.id === noteId
                    ? { ...c, replies: [...(c.replies ?? []), reply], status: newStatus }
                    : c,
                ),
                updatedAt: now(),
              }
            : p,
        ),
      );
    },
    [role],
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

  const addCost = useCallback((propertyId: string, data: CostInput) => {
    const cost: CostItem = { ...data, id: newId(), createdAt: now() };
    setProperties((prev) =>
      prev.map((p) =>
        p.id === propertyId ? { ...p, costs: [cost, ...(p.costs ?? [])], updatedAt: now() } : p,
      ),
    );
  }, []);

  const deleteCost = useCallback((propertyId: string, costId: string) => {
    setProperties((prev) =>
      prev.map((p) =>
        p.id === propertyId ? { ...p, costs: (p.costs ?? []).filter((c) => c.id !== costId) } : p,
      ),
    );
  }, []);

  const addChatMessage = useCallback(
    (propertyId: string, text: string) => {
      const msg: ChatMessage = {
        id: newId(),
        authorRole: role ?? "CLIENT",
        text,
        createdAt: now(),
      };
      setProperties((prev) =>
        prev.map((p) =>
          p.id === propertyId
            ? { ...p, messages: [...(p.messages ?? []), msg], updatedAt: now() }
            : p,
        ),
      );
    },
    [role],
  );

  const deleteChatMessage = useCallback((propertyId: string, messageId: string) => {
    setProperties((prev) =>
      prev.map((p) =>
        p.id === propertyId
          ? { ...p, messages: (p.messages ?? []).filter((m) => m.id !== messageId) }
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
    updateDocument,
    deleteDocument,
    addReminder,
    updateReminder,
    toggleReminder,
    deleteReminder,
    addInventoryItem,
    deleteInventoryItem,
    addConsultation,
    deleteConsultation,
    setConsultationStatus,
    addConsultationReply,
    addBid,
    deleteBid,
    setBidStatus,
    addDesign,
    deleteDesign,
    addMilestone,
    deleteMilestone,
    addCost,
    deleteCost,
    addChatMessage,
    deleteChatMessage,
    transferProperty,
    setShare,
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
      costs: [
        { id: "co-1", title: "Rekonstrukce koupelny — obklady a montáž", category: "PRACE", amount: 124000, date: "2024-06-15", supplier: "KoupelnyPlus s.r.o.", invoiceName: "faktura_koupelna.pdf", invoiceUrl: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MjAiIGhlaWdodD0iNTYwIj48cmVjdCB3aWR0aD0iNDIwIiBoZWlnaHQ9IjU2MCIgZmlsbD0iI2ZmZmZmZiIvPjxyZWN0IHdpZHRoPSI0MjAiIGhlaWdodD0iNzAiIGZpbGw9IiMxODRFNUEiLz48dGV4dCB4PSIyNCIgeT0iNDQiIGZvbnQtc2l6ZT0iMjIiIGZpbGw9IiNmZmZmZmYiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIj5GQUtUVVJBPC90ZXh0Pjx0ZXh0IHg9IjI0IiB5PSIxMjAiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiMzMzMiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIj5SZWtvbnN0cnVrY2Uga291cGVsbnk8L3RleHQ+PHRleHQgeD0iMjQiIHk9IjE2MCIgZm9udC1zaXplPSIxMyIgZmlsbD0iIzc3NyIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPkRvZGF2YXRlbCAtIHVrYXprb3Z5IGRva2xhZDwvdGV4dD48bGluZSB4MT0iMjQiIHkxPSIyMDAiIHgyPSIzOTYiIHkyPSIyMDAiIHN0cm9rZT0iI2NjYyIvPjx0ZXh0IHg9IjI0IiB5PSIyNDAiIGZvbnQtc2l6ZT0iMTMiIGZpbGw9IiM1NTUiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIj5Qb2xvemthIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uIGNhc3RrYTwvdGV4dD48L3N2Zz4=", createdAt: "2024-06-15" },
        { id: "co-2", title: "Sprchový kout a baterie", category: "MATERIAL", amount: 38000, date: "2024-06-10", supplier: "Sanita CZ", createdAt: "2024-06-10" },
        { id: "co-3", title: "Podlahové topení v koupelně", category: "TZB", amount: 27000, date: "2024-06-12", createdAt: "2024-06-12" },
        { id: "co-4", title: "Oprava oplechování střešního okna", category: "PRACE", amount: 4500, date: "2025-11-20", supplier: "Klempířství Dvořák", invoiceName: "faktura_strecha.pdf", invoiceUrl: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MjAiIGhlaWdodD0iNTYwIj48cmVjdCB3aWR0aD0iNDIwIiBoZWlnaHQ9IjU2MCIgZmlsbD0iI2ZmZmZmZiIvPjxyZWN0IHdpZHRoPSI0MjAiIGhlaWdodD0iNzAiIGZpbGw9IiMxODRFNUEiLz48dGV4dCB4PSIyNCIgeT0iNDQiIGZvbnQtc2l6ZT0iMjIiIGZpbGw9IiNmZmZmZmYiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIj5GQUtUVVJBPC90ZXh0Pjx0ZXh0IHg9IjI0IiB5PSIxMjAiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiMzMzMiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIj5PcHJhdmEgc3RyZWNoeTwvdGV4dD48dGV4dCB4PSIyNCIgeT0iMTYwIiBmb250LXNpemU9IjEzIiBmaWxsPSIjNzc3IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiI+RG9kYXZhdGVsIC0gdWthemtvdnkgZG9rbGFkPC90ZXh0PjxsaW5lIHgxPSIyNCIgeTE9IjIwMCIgeDI9IjM5NiIgeTI9IjIwMCIgc3Ryb2tlPSIjY2NjIi8+PHRleHQgeD0iMjQiIHk9IjI0MCIgZm9udC1zaXplPSIxMyIgZmlsbD0iIzU1NSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPlBvbG96a2EgLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4gY2FzdGthPC90ZXh0Pjwvc3ZnPg==", createdAt: "2025-11-20" },
        { id: "co-5", title: "Revize plynového kotle", category: "OSTATNI", amount: 1800, date: "2025-10-12", supplier: "TermoInstal", createdAt: "2025-10-12" },
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
          replies: [
            { id: "kr-1", authorRole: "CLIENT", text: "Super, líbí se nám to. Jen prosím větší spíž.", createdAt: "2026-02-19T08:00:00.000Z" },
            { id: "kr-2", authorRole: "ARCHITECT", text: "Zapracováno, spíž zvětšena. Děkuji!", createdAt: "2026-02-20T09:30:00.000Z" },
          ],
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
      messages: [
        { id: "ch-1", authorRole: "ARCHITECT", text: "Dobrý den, posílám aktualizovanou studii. Mrkněte prosím na dispozici přízemí.", createdAt: "2026-02-18T09:00:00.000Z" },
        { id: "ch-2", authorRole: "CLIENT", text: "Děkujeme! Vypadá to skvěle, jen bychom chtěli větší spíž.", createdAt: "2026-02-18T12:30:00.000Z" },
        { id: "ch-3", authorRole: "ARCHITECT", text: "Jasně, spíž zvětším a pošlu novou verzi do pátku.", createdAt: "2026-02-19T08:15:00.000Z" },
      ],
      createdAt: "2026-01-10",
      updatedAt: "2026-04-15",
    },
  ];
}
