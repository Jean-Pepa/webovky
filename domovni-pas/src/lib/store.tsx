"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { newId } from "./id";

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
  ownerName: string;
  shareEnabled: boolean;
  entries: Entry[];
  documents: DocItem[];
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
  setShare: (propertyId: string, enabled: boolean) => void;
};

const StoreContext = createContext<Store | null>(null);
const KEY = "domovni-pas-v1";
const now = () => new Date().toISOString();

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      setProperties(raw ? (JSON.parse(raw) as Property[]) : seed());
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

  const createProperty = useCallback((data: PropertyInput) => {
    const id = newId();
    const p: Property = {
      ...data,
      id,
      ownerName: "Vy",
      shareEnabled: false,
      entries: [],
      documents: [],
      createdAt: now(),
      updatedAt: now(),
    };
    setProperties((prev) => [p, ...prev]);
    return id;
  }, []);

  // Vytvoří nemovitost rovnou i se záznamy a dokumenty (používá průvodce „Založit pas").
  const createPropertyFull = useCallback(
    (data: PropertyInput, entries: EntryInput[], documents: DocumentInput[]) => {
      const id = newId();
      const p: Property = {
        ...data,
        id,
        ownerName: "Vy",
        shareEnabled: false,
        entries: entries.map((e) => ({ ...e, id: newId(), createdAt: now() })),
        documents: documents.map((d) => ({ ...d, id: newId() })),
        createdAt: now(),
        updatedAt: now(),
      };
      setProperties((prev) => [p, ...prev]);
      return id;
    },
    [],
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

  const setShare = useCallback((propertyId: string, enabled: boolean) => {
    setProperties((prev) =>
      prev.map((p) => (p.id === propertyId ? { ...p, shareEnabled: enabled } : p)),
    );
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
    setShare,
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
      ownerName: "Jana Nováková",
      shareEnabled: false,
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
      createdAt: "2024-02-01",
      updatedAt: "2025-03-10",
    },
  ];
}
