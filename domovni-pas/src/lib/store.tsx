"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { newId } from "./id";

export type Role = "ARCHITECT" | "CLIENT" | "CREATOR";

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
  floorArea?: number; // m²
  energyClass?: string; // A–G
  architect?: string;
  contractors?: string; // kontakty na dodavatele (řádky)
  createdByRole?: Role; // kdo pas vytvořil
  handedOver?: boolean; // architekt předal klientovi → pro architekta jen ke čtení
  ownerName: string;
  shareEnabled: boolean;
  entries: Entry[];
  documents: DocItem[];
  reminders: Reminder[];
  transfers: TransferRecord[];
  inventory: InventoryItem[];
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
  addEntry: (propertyId: string, data: EntryInput) => void;
  deleteEntry: (propertyId: string, entryId: string) => void;
  addDocument: (propertyId: string, data: DocumentInput) => void;
  deleteDocument: (propertyId: string, docId: string) => void;
  addReminder: (propertyId: string, data: ReminderInput) => void;
  toggleReminder: (propertyId: string, reminderId: string) => void;
  deleteReminder: (propertyId: string, reminderId: string) => void;
  addInventoryItem: (propertyId: string, data: InventoryInput) => void;
  deleteInventoryItem: (propertyId: string, itemId: string) => void;
  transferProperty: (propertyId: string, toName: string, note?: string) => void;
  setShare: (propertyId: string, enabled: boolean) => void;
  role: Role | null;
  login: (password: string) => boolean;
  logout: () => void;
};

const StoreContext = createContext<Store | null>(null);
const KEY = "domovni-pas-v1";
const ROLE_KEY = "bulo-role";

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
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const storedRole = localStorage.getItem(ROLE_KEY) as Role | null;
      if (storedRole) setRole(storedRole);
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

  const value: Store = {
    properties,
    hydrated,
    getProperty,
    createProperty,
    createPropertyFull,
    updateProperty,
    deleteProperty,
    addEntry,
    deleteEntry,
    addDocument,
    deleteDocument,
    addReminder,
    toggleReminder,
    deleteReminder,
    addInventoryItem,
    deleteInventoryItem,
    transferProperty,
    setShare,
    role,
    login,
    logout,
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
          fileName: "PENB_Ricany.pdf",
        },
        {
          id: "s-d2",
          title: "Projektová dokumentace – půdorysy",
          category: "PLAN",
          fileName: "Pudorysy.pdf",
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
      ],
      documents: [],
      reminders: [
        { id: "s-r4", type: "MAINTENANCE", title: "Výměna filtrů rekuperace", dueDate: "2026-07-01", done: false },
      ],
      transfers: [],
      inventory: [
        { id: "s-i5", name: "Kuchyňská linka na míru", location: "Kuchyně", price: 120000, warrantyUntil: "2030-03-10" },
        { id: "s-i6", name: "Indukční deska", location: "Kuchyně", brand: "Bosch", warrantyUntil: "2027-03-10" },
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
      createdAt: "2026-01-10",
      updatedAt: "2026-04-15",
    },
  ];
}
