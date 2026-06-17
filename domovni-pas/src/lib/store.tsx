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
    announcements: [], // nástěnka SVJ je interní
    units: [], // evidence vlastníků = osobní údaje
    contacts: [], // kontakty jsou interní
    polls: [], // hlasování je interní
    meters: [], // odečty měřidel jsou interní
    events: [], // kalendář schůzí je interní
    svj: undefined, // identita SVJ + fond oprav nesdílíme veřejně
    assemblies: [], // shromáždění jsou interní
  };
}

export type Role = "ARCHITECT" | "CLIENT" | "CREATOR" | "OWNER";

// Branding architekta — zobrazí se na reportu a sdíleném pasu.
export type Branding = { studioName?: string; color?: string; tagline?: string };

export type PropertyType = "HOUSE" | "APARTMENT" | "BUILDING" | "OTHER";
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
  // SVJ moduly
  announcements?: Announcement[];
  units?: Unit[];
  contacts?: Contact[];
  polls?: Poll[];
  meters?: Meter[];
  events?: SvjEvent[];
  svj?: SvjInfo;
  assemblies?: Assembly[];
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

// ── SVJ moduly ──────────────────────────────────────────────────────────────

// Nástěnka — oznámení výboru pro vlastníky
export type AnnouncementCategory = "GENERAL" | "IMPORTANT" | "INTERNAL" | "MAINTENANCE";
export type Announcement = {
  id: string;
  title: string;
  text: string;
  category?: AnnouncementCategory;
  pinned?: boolean;
  authorRole: Role;
  createdAt: string;
};
export type AnnouncementInput = {
  title: string;
  text: string;
  category?: AnnouncementCategory;
  pinned?: boolean;
};

// Evidence jednotek a vlastníků
export type Unit = {
  id: string;
  label: string; // č. jednotky, např. „12/3"
  floor?: string; // patro
  area?: number; // m²
  share?: string; // spoluvlastnický podíl, např. „754/10000"
  ownerName: string;
  contact?: string; // e-mail / telefon
  monthlyFee?: number; // měsíční příspěvek do fondu oprav / na správu
};
export type UnitInput = {
  label: string;
  floor?: string;
  area?: number;
  share?: string;
  ownerName: string;
  contact?: string;
  monthlyFee?: number;
};

// Kontakty — výbor, správce, dodavatelé
export type ContactKind = "VYBOR" | "SPRAVCE" | "DODAVATEL";
export type Contact = {
  id: string;
  name: string;
  kind: ContactKind;
  position?: string; // funkce / obor (předseda, instalatér…)
  phone?: string;
  email?: string;
  note?: string;
};
export type ContactInput = {
  name: string;
  kind: ContactKind;
  position?: string;
  phone?: string;
  email?: string;
  note?: string;
};

// Hlasování / ankety (per rollam)
export type PollStatus = "OPEN" | "CLOSED";
export type PollOption = { id: string; label: string; votes: number };
export type Poll = {
  id: string;
  question: string;
  note?: string;
  options: PollOption[];
  deadline?: string;
  status: PollStatus;
  createdAt: string;
};
export type PollInput = { question: string; note?: string; options: string[]; deadline?: string };

// Odečty měřidel
export type MeterReading = { id: string; date: string; value: number };
export type Meter = {
  id: string;
  label: string; // popis (Studená voda – byt 2/3, Plyn kotelna…)
  kind?: string; // voda / plyn / elektřina / teplo
  unit?: string; // m³, kWh, GJ
  serial?: string; // výrobní číslo
  readings: MeterReading[];
};
export type MeterInput = { label: string; kind?: string; unit?: string; serial?: string };

// Kalendář — schůze, shromáždění, termíny
export type SvjEvent = {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time?: string;
  kind?: string; // schůze / shromáždění / termín
  note?: string;
};
export type SvjEventInput = { title: string; date: string; time?: string; kind?: string; note?: string };

// Detail společenství (identita SVJ + fond oprav)
export type SvjInfo = {
  ico?: string;
  sidlo?: string;
  founded?: string; // datum vzniku / zápisu do rejstříku
  manager?: string; // správce
  bankAccount?: string; // číslo účtu (fond oprav)
  fundBalance?: number; // zůstatek fondu oprav
  fundNote?: string;
};

// Shromáždění vlastníků
export type AssemblyStatus = "PLANNED" | "DONE";
export type Assembly = {
  id: string;
  title: string;
  date: string;
  time?: string;
  location?: string;
  agenda?: string; // program (po řádcích)
  minutes?: string; // zápis
  status: AssemblyStatus;
  createdAt: string;
};
export type AssemblyInput = {
  title: string;
  date: string;
  time?: string;
  location?: string;
  agenda?: string;
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
  // SVJ moduly
  addAnnouncement: (propertyId: string, data: AnnouncementInput) => void;
  deleteAnnouncement: (propertyId: string, annId: string) => void;
  addUnit: (propertyId: string, data: UnitInput) => void;
  deleteUnit: (propertyId: string, unitId: string) => void;
  addContact: (propertyId: string, data: ContactInput) => void;
  deleteContact: (propertyId: string, contactId: string) => void;
  addPoll: (propertyId: string, data: PollInput) => void;
  deletePoll: (propertyId: string, pollId: string) => void;
  votePoll: (propertyId: string, pollId: string, optionId: string) => void;
  setPollStatus: (propertyId: string, pollId: string, status: PollStatus) => void;
  addMeter: (propertyId: string, data: MeterInput) => void;
  deleteMeter: (propertyId: string, meterId: string) => void;
  addMeterReading: (propertyId: string, meterId: string, date: string, value: number) => void;
  deleteMeterReading: (propertyId: string, meterId: string, readingId: string) => void;
  addEvent: (propertyId: string, data: SvjEventInput) => void;
  deleteEvent: (propertyId: string, eventId: string) => void;
  setSvjInfo: (propertyId: string, data: SvjInfo) => void;
  addAssembly: (propertyId: string, data: AssemblyInput) => void;
  updateAssembly: (
    propertyId: string,
    assemblyId: string,
    data: Partial<Omit<Assembly, "id" | "createdAt">>,
  ) => void;
  deleteAssembly: (propertyId: string, assemblyId: string) => void;
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
// Verze ukázkových dat – po bumpnutí se jednorázově doplní nově přidané demo budovy
// (bez mazání dat uživatele; smazané demo se znovu nepřidá).
const SEED_KEY = "bulo-seed";
const SEED_VERSION = "2026-06-svj-4";

// Demo přihlášení – 3 hesla = 3 role. (Změnit lze tady.)
const PASSWORDS: Record<string, Role> = {
  architekt: "ARCHITECT",
  klient: "CLIENT",
  svj: "CREATOR",
  spravce: "CREATOR",
  tvurce: "CREATOR", // zpětná kompatibilita
  vlastnik: "OWNER",
  rezident: "OWNER",
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
        let loaded: Property[] = parsed.map((p) => ({
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
          announcements: p.announcements ?? [],
          units: p.units ?? [],
          contacts: p.contacts ?? [],
          polls: p.polls ?? [],
          meters: p.meters ?? [],
          events: p.events ?? [],
          assemblies: p.assemblies ?? [],
        }));
        // Po bumpnutí verze obnovíme ukázkové (demo-) budovy na aktuální podobu;
        // vlastní pasy uživatele zůstávají beze změny.
        if (localStorage.getItem(SEED_KEY) !== SEED_VERSION) {
          const userProps = loaded.filter((p) => !p.id.startsWith("demo-"));
          const demoProps = seed().filter((s) => s.id.startsWith("demo-"));
          loaded = [...demoProps, ...userProps];
          localStorage.setItem(SEED_KEY, SEED_VERSION);
        }
        setProperties(loaded);
      } else {
        setProperties(seed());
        localStorage.setItem(SEED_KEY, SEED_VERSION);
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

  // ── SVJ moduly ──────────────────────────────────────────────────────────
  const addAnnouncement = useCallback(
    (propertyId: string, data: AnnouncementInput) => {
      const ann: Announcement = {
        id: newId(),
        title: data.title,
        text: data.text,
        pinned: data.pinned,
        authorRole: role ?? "CREATOR",
        createdAt: now(),
      };
      setProperties((prev) =>
        prev.map((p) =>
          p.id === propertyId
            ? { ...p, announcements: [ann, ...(p.announcements ?? [])], updatedAt: now() }
            : p,
        ),
      );
    },
    [role],
  );

  const deleteAnnouncement = useCallback((propertyId: string, annId: string) => {
    setProperties((prev) =>
      prev.map((p) =>
        p.id === propertyId
          ? { ...p, announcements: (p.announcements ?? []).filter((a) => a.id !== annId) }
          : p,
      ),
    );
  }, []);

  const addUnit = useCallback((propertyId: string, data: UnitInput) => {
    const unit: Unit = { ...data, id: newId() };
    setProperties((prev) =>
      prev.map((p) =>
        p.id === propertyId ? { ...p, units: [...(p.units ?? []), unit], updatedAt: now() } : p,
      ),
    );
  }, []);

  const deleteUnit = useCallback((propertyId: string, unitId: string) => {
    setProperties((prev) =>
      prev.map((p) =>
        p.id === propertyId ? { ...p, units: (p.units ?? []).filter((u) => u.id !== unitId) } : p,
      ),
    );
  }, []);

  const addContact = useCallback((propertyId: string, data: ContactInput) => {
    const contact: Contact = { ...data, id: newId() };
    setProperties((prev) =>
      prev.map((p) =>
        p.id === propertyId
          ? { ...p, contacts: [...(p.contacts ?? []), contact], updatedAt: now() }
          : p,
      ),
    );
  }, []);

  const deleteContact = useCallback((propertyId: string, contactId: string) => {
    setProperties((prev) =>
      prev.map((p) =>
        p.id === propertyId
          ? { ...p, contacts: (p.contacts ?? []).filter((c) => c.id !== contactId) }
          : p,
      ),
    );
  }, []);

  const addPoll = useCallback((propertyId: string, data: PollInput) => {
    const poll: Poll = {
      id: newId(),
      question: data.question,
      note: data.note,
      deadline: data.deadline,
      status: "OPEN",
      options: data.options
        .map((label) => label.trim())
        .filter(Boolean)
        .map((label) => ({ id: newId(), label, votes: 0 })),
      createdAt: now(),
    };
    setProperties((prev) =>
      prev.map((p) =>
        p.id === propertyId ? { ...p, polls: [poll, ...(p.polls ?? [])], updatedAt: now() } : p,
      ),
    );
  }, []);

  const deletePoll = useCallback((propertyId: string, pollId: string) => {
    setProperties((prev) =>
      prev.map((p) =>
        p.id === propertyId ? { ...p, polls: (p.polls ?? []).filter((pl) => pl.id !== pollId) } : p,
      ),
    );
  }, []);

  const votePoll = useCallback((propertyId: string, pollId: string, optionId: string) => {
    setProperties((prev) =>
      prev.map((p) =>
        p.id === propertyId
          ? {
              ...p,
              polls: (p.polls ?? []).map((pl) =>
                pl.id === pollId
                  ? {
                      ...pl,
                      options: pl.options.map((o) =>
                        o.id === optionId ? { ...o, votes: o.votes + 1 } : o,
                      ),
                    }
                  : pl,
              ),
            }
          : p,
      ),
    );
  }, []);

  const setPollStatus = useCallback((propertyId: string, pollId: string, status: PollStatus) => {
    setProperties((prev) =>
      prev.map((p) =>
        p.id === propertyId
          ? { ...p, polls: (p.polls ?? []).map((pl) => (pl.id === pollId ? { ...pl, status } : pl)) }
          : p,
      ),
    );
  }, []);

  const addMeter = useCallback((propertyId: string, data: MeterInput) => {
    const meter: Meter = { ...data, id: newId(), readings: [] };
    setProperties((prev) =>
      prev.map((p) =>
        p.id === propertyId ? { ...p, meters: [...(p.meters ?? []), meter], updatedAt: now() } : p,
      ),
    );
  }, []);

  const deleteMeter = useCallback((propertyId: string, meterId: string) => {
    setProperties((prev) =>
      prev.map((p) =>
        p.id === propertyId ? { ...p, meters: (p.meters ?? []).filter((m) => m.id !== meterId) } : p,
      ),
    );
  }, []);

  const addMeterReading = useCallback(
    (propertyId: string, meterId: string, date: string, value: number) => {
      const reading: MeterReading = { id: newId(), date, value };
      setProperties((prev) =>
        prev.map((p) =>
          p.id === propertyId
            ? {
                ...p,
                meters: (p.meters ?? []).map((m) =>
                  m.id === meterId
                    ? {
                        ...m,
                        readings: [...m.readings, reading].sort((a, b) => a.date.localeCompare(b.date)),
                      }
                    : m,
                ),
                updatedAt: now(),
              }
            : p,
        ),
      );
    },
    [],
  );

  const deleteMeterReading = useCallback((propertyId: string, meterId: string, readingId: string) => {
    setProperties((prev) =>
      prev.map((p) =>
        p.id === propertyId
          ? {
              ...p,
              meters: (p.meters ?? []).map((m) =>
                m.id === meterId
                  ? { ...m, readings: m.readings.filter((r) => r.id !== readingId) }
                  : m,
              ),
            }
          : p,
      ),
    );
  }, []);

  const addEvent = useCallback((propertyId: string, data: SvjEventInput) => {
    const ev: SvjEvent = { ...data, id: newId() };
    setProperties((prev) =>
      prev.map((p) =>
        p.id === propertyId ? { ...p, events: [...(p.events ?? []), ev], updatedAt: now() } : p,
      ),
    );
  }, []);

  const deleteEvent = useCallback((propertyId: string, eventId: string) => {
    setProperties((prev) =>
      prev.map((p) =>
        p.id === propertyId ? { ...p, events: (p.events ?? []).filter((e) => e.id !== eventId) } : p,
      ),
    );
  }, []);

  const setSvjInfo = useCallback((propertyId: string, data: SvjInfo) => {
    setProperties((prev) =>
      prev.map((p) => (p.id === propertyId ? { ...p, svj: data, updatedAt: now() } : p)),
    );
  }, []);

  const addAssembly = useCallback((propertyId: string, data: AssemblyInput) => {
    const a: Assembly = { ...data, id: newId(), status: "PLANNED", createdAt: now() };
    setProperties((prev) =>
      prev.map((p) =>
        p.id === propertyId ? { ...p, assemblies: [a, ...(p.assemblies ?? [])], updatedAt: now() } : p,
      ),
    );
  }, []);

  const updateAssembly = useCallback(
    (propertyId: string, assemblyId: string, data: Partial<Omit<Assembly, "id" | "createdAt">>) => {
      setProperties((prev) =>
        prev.map((p) =>
          p.id === propertyId
            ? {
                ...p,
                assemblies: (p.assemblies ?? []).map((a) =>
                  a.id === assemblyId ? { ...a, ...data } : a,
                ),
                updatedAt: now(),
              }
            : p,
        ),
      );
    },
    [],
  );

  const deleteAssembly = useCallback((propertyId: string, assemblyId: string) => {
    setProperties((prev) =>
      prev.map((p) =>
        p.id === propertyId
          ? { ...p, assemblies: (p.assemblies ?? []).filter((a) => a.id !== assemblyId) }
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
    addAnnouncement,
    deleteAnnouncement,
    addUnit,
    deleteUnit,
    addContact,
    deleteContact,
    addPoll,
    deletePoll,
    votePoll,
    setPollStatus,
    addMeter,
    deleteMeter,
    addMeterReading,
    deleteMeterReading,
    addEvent,
    deleteEvent,
    setSvjInfo,
    addAssembly,
    updateAssembly,
    deleteAssembly,
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
      messages: [
        { id: "dch-1", authorRole: "ARCHITECT", text: "Dobrý den, roční revize kotle proběhla v pořádku, vyměnil jsem filtr.", createdAt: "2025-10-12T10:05:00.000Z" },
        { id: "dch-2", authorRole: "CLIENT", text: "Děkujeme moc za info!", createdAt: "2025-10-12T11:20:00.000Z" },
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
    {
      id: "demo-svj",
      name: "Bytový dům — SVJ Jugoslávská 12",
      type: "BUILDING",
      street: "Jugoslávská 12",
      city: "Praha 2",
      zip: "12000",
      yearBuilt: 1931,
      floorArea: 1840,
      description:
        "Činžovní dům, 18 bytových jednotek, společná plynová kotelna a výtah. Spravováno výborem SVJ.",
      ownerName: "SVJ Jugoslávská 12",
      shareEnabled: false,
      createdByRole: "CREATOR",
      handedOver: false,
      entries: [
        {
          id: "s-esvj1",
          type: "REPAIR",
          title: "Oprava stoupačky vody (2. NP)",
          description: "Výměna prasklého kusu stoupačky studené vody, zazdění a malba.",
          date: "2026-03-12",
          cost: 18400,
          media: [],
          createdAt: "2026-03-12",
        },
        {
          id: "s-esvj2",
          type: "INSPECTION",
          title: "Roční revize elektro — společné prostory",
          description: "Revize elektroinstalace chodeb a sklepů. Bez závad.",
          date: "2025-09-30",
          media: [],
          createdAt: "2025-09-30",
        },
      ],
      documents: [
        { id: "s-dsvj1", title: "Domovní řád", category: "CONTRACT", section: "BUDOVA" },
        { id: "s-dsvj2", title: "Revizní zpráva elektro 2025", category: "CERTIFICATE", section: "BUDOVA" },
      ],
      reminders: [
        { id: "s-rsvj1", type: "INSPECTION", title: "Revize výtahu", dueDate: "2026-05-20", note: "Čtvrtletní odborná prohlídka výtahu", done: false },
        { id: "s-rsvj2", type: "INSPECTION", title: "Revize domovní plynové kotelny", dueDate: "2026-04-10", note: "Roční revize plynového zařízení", done: false },
        { id: "s-rsvj3", type: "INSPECTION", title: "Kontrola hasicích přístrojů a hydrantů", dueDate: "2026-07-08", done: false },
        { id: "s-rsvj4", type: "INSPECTION", title: "Revize elektro — společné prostory", dueDate: "2026-09-30", done: false },
        { id: "s-rsvj5", type: "INSPECTION", title: "Čištění a kontrola komínů", dueDate: "2026-10-01", done: false },
        { id: "s-rsvj6", type: "INSPECTION", title: "Revize hromosvodu", dueDate: "2026-11-15", done: false },
      ],
      transfers: [],
      inventory: [
        { id: "s-isvj1", name: "Osobní výtah", location: "Strojovna", brand: "OTIS", warrantyUntil: "2027-04-30" },
        { id: "s-isvj2", name: "Plynový kotel kaskáda", location: "Domovní kotelna", brand: "Buderus" },
      ],
      consultations: [
        {
          id: "ksvj-1",
          authorRole: "CLIENT",
          topic: "Závada — sklep",
          text: "Ve sklepní kóji u stoupačky se objevila vlhkost. Můžete prosím prověřit?",
          status: "OPEN",
          createdAt: "2026-06-14",
        },
      ],
      announcements: [
        {
          id: "asvj-1",
          title: "Odstávka teplé vody 24. 6.",
          text: "Z důvodu servisu výměníku bude 24. 6. od 8 do 14 hod. odstávka teplé vody. Děkujeme za pochopení.",
          category: "MAINTENANCE",
          pinned: true,
          authorRole: "CREATOR",
          createdAt: "2026-06-10",
        },
        {
          id: "asvj-2",
          title: "Shromáždění vlastníků 3. 7. 2026",
          text: "Zveme všechny vlastníky na řádné shromáždění ve čtvrtek 3. 7. v 18:00 ve společenské místnosti. Program a podklady najdete v Dokumentech.",
          category: "IMPORTANT",
          authorRole: "CREATOR",
          createdAt: "2026-06-05",
        },
      ],
      units: [
        { id: "usvj-1", label: "1/1", floor: "přízemí", area: 64, share: "640/12480", ownerName: "Jan Dvořák", monthlyFee: 2400 },
        { id: "usvj-2", label: "2/3", floor: "2. NP", area: 78, share: "780/12480", ownerName: "Marie Veselá", contact: "vesela@email.cz", monthlyFee: 2900 },
        { id: "usvj-3", label: "3/5", floor: "3. NP", area: 92, share: "920/12480", ownerName: "Petr Horák", monthlyFee: 3400 },
        { id: "usvj-4", label: "4/8", floor: "4. NP", area: 58, share: "580/12480", ownerName: "Eva Králová", monthlyFee: 2200 },
      ],
      contacts: [
        { id: "csvj-1", name: "Jan Dvořák", kind: "VYBOR", position: "Předseda výboru", phone: "777 100 200", email: "predseda@svj-jugoslavska.cz" },
        { id: "csvj-2", name: "Marie Veselá", kind: "VYBOR", position: "Místopředsedkyně", phone: "777 100 201" },
        { id: "csvj-3", name: "SpravByt s.r.o.", kind: "SPRAVCE", position: "Správce domu", phone: "222 333 444", email: "info@spravbyt.cz" },
        { id: "csvj-4", name: "Výtahy Praha s.r.o.", kind: "DODAVATEL", position: "Servis výtahu", phone: "603 555 111" },
        { id: "csvj-5", name: "Topení Novák", kind: "DODAVATEL", position: "Plynová kotelna", phone: "604 222 888" },
      ],
      polls: [
        {
          id: "psvj-1",
          question: "Schvalujete zateplení dvorní fasády v roce 2027?",
          note: "Předpokládaný náklad 1,8 mil. Kč z fondu oprav. Hlasování per rollam do 30. 6.",
          options: [
            { id: "po-1", label: "Pro", votes: 9 },
            { id: "po-2", label: "Proti", votes: 2 },
            { id: "po-3", label: "Zdržuji se", votes: 1 },
          ],
          deadline: "2026-06-30",
          status: "OPEN",
          createdAt: "2026-06-08",
        },
      ],
      meters: [
        {
          id: "msvj-1",
          label: "Studená voda — hlavní",
          kind: "Voda",
          unit: "m³",
          serial: "SV-2019-0042",
          readings: [
            { id: "mr-1", date: "2025-12-31", value: 1840 },
            { id: "mr-2", date: "2026-03-31", value: 1968 },
            { id: "mr-3", date: "2026-06-15", value: 2071 },
          ],
        },
        {
          id: "msvj-2",
          label: "Plyn — domovní kotelna",
          kind: "Plyn",
          unit: "m³",
          serial: "PL-552130",
          readings: [
            { id: "mr-4", date: "2025-12-31", value: 38450 },
            { id: "mr-5", date: "2026-06-15", value: 41020 },
          ],
        },
        {
          id: "msvj-3",
          label: "Elektřina — společné prostory",
          kind: "Elektřina",
          unit: "kWh",
          readings: [{ id: "mr-6", date: "2026-06-15", value: 7320 }],
        },
      ],
      events: [
        { id: "esv-1", title: "Shromáždění vlastníků", date: "2026-07-03", time: "18:00", kind: "Shromáždění", note: "Společenská místnost, přízemí" },
        { id: "esv-2", title: "Odečet vody (čtvrtletní)", date: "2026-09-30", kind: "Termín" },
        { id: "esv-3", title: "Schůze výboru", date: "2026-06-24", time: "19:00", kind: "Schůze" },
      ],
      svj: {
        ico: "26512345",
        sidlo: "Jugoslávská 12, 120 00 Praha 2",
        founded: "2007-03-15",
        manager: "SpravByt s.r.o.",
        bankAccount: "2200456789/2010",
        fundBalance: 612000,
        fundNote: "Fond oprav — stav k 31. 5. 2026",
      },
      assemblies: [
        {
          id: "asm-1",
          title: "Řádné shromáždění vlastníků 2026",
          date: "2026-07-03",
          time: "18:00",
          location: "Společenská místnost, přízemí",
          agenda:
            "Schválení účetní závěrky 2025\nRozpočet a výše příspěvků 2026\nZateplení dvorní fasády\nVolba člena výboru\nRůzné",
          status: "PLANNED",
          createdAt: "2026-06-05",
        },
        {
          id: "asm-2",
          title: "Shromáždění vlastníků 2025",
          date: "2025-06-26",
          time: "18:00",
          location: "Společenská místnost",
          agenda: "Účetní závěrka 2024\nPlán oprav\nRůzné",
          minutes:
            "Účetní závěrka 2024 schválena (90 % hlasů). Schválen plán oprav stoupaček. Příspěvek do fondu oprav ponechán beze změny.",
          status: "DONE",
          createdAt: "2025-06-26",
        },
      ],
      createdAt: "2024-09-01",
      updatedAt: "2026-06-14",
    },
  ];
}
