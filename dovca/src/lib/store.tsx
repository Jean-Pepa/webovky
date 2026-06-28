"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { DB, Trip } from "./types";
import { applyAction, type Action } from "./actions";
import { seedDB } from "./seed";

type Mode = "loading" | "server" | "local";

interface StoreState {
  ready: boolean;
  mode: Mode;
  configured: boolean; // běží sdílený backend (Redis)?
  authed: boolean;
  db: DB | null;
  me: string; // moje jméno (identita bez účtu)
  syncError: string | null;
}

interface StoreApi extends StoreState {
  trips: Trip[];
  login: (password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  setMe: (name: string) => void;
  dispatch: (action: Action) => Promise<void>;
  dismissSyncError: () => void;
}

const LS_ME = "dovca_me";
const LS_AUTH = "dovca_authed";
const LS_DB = "dovca_db";

const Ctx = createContext<StoreApi | null>(null);

function loadLocalDB(): DB {
  if (typeof window === "undefined") return seedDB();
  try {
    const raw = localStorage.getItem(LS_DB);
    if (raw) {
      const parsed = JSON.parse(raw) as DB;
      if (parsed && Array.isArray(parsed.trips)) return parsed;
    }
  } catch {
    /* ignore */
  }
  const seeded = seedDB();
  localStorage.setItem(LS_DB, JSON.stringify(seeded));
  return seeded;
}

function saveLocalDB(db: DB) {
  try {
    localStorage.setItem(LS_DB, JSON.stringify(db));
  } catch {
    /* ignore */
  }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<StoreState>({
    ready: false,
    mode: "loading",
    configured: false,
    authed: false,
    db: null,
    me: "",
    syncError: null,
  });
  const modeRef = useRef<Mode>("loading");

  // Načtení identity + zjištění režimu (server/local) z API.
  useEffect(() => {
    const me = localStorage.getItem(LS_ME) || "";
    (async () => {
      try {
        const res = await fetch("/api/db", { cache: "no-store" });
        if (res.ok) {
          const { db } = (await res.json()) as { db: DB };
          modeRef.current = "server";
          setState((s) => ({ ...s, ready: true, mode: "server", configured: true, authed: true, db, me }));
          return;
        }
        if (res.status === 401) {
          modeRef.current = "server";
          setState((s) => ({ ...s, ready: true, mode: "server", configured: true, authed: false, db: null, me }));
          return;
        }
      } catch {
        /* síť selhala → lokální režim */
      }
      // 503 nebo chyba sítě → lokální (demo) režim z localStorage
      const localDb = loadLocalDB();
      const authed = localStorage.getItem(LS_AUTH) === "1";
      modeRef.current = "local";
      setState((s) => ({ ...s, ready: true, mode: "local", configured: false, authed, db: localDb, me }));
    })();
  }, []);

  const login = useCallback(async (password: string): Promise<boolean> => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    }).catch(() => null);
    if (!res || !res.ok) return false;

    try {
      const dbRes = await fetch("/api/db", { cache: "no-store" });
      if (dbRes.ok) {
        const db = ((await dbRes.json()) as { db: DB }).db;
        modeRef.current = "server";
        setState((s) => ({ ...s, mode: "server", configured: true, authed: true, db }));
        return true;
      }
    } catch {
      /* ignore → lokální režim níže */
    }
    const localDb = loadLocalDB();
    localStorage.setItem(LS_AUTH, "1");
    modeRef.current = "local";
    setState((s) => ({ ...s, mode: "local", configured: false, authed: true, db: localDb }));
    return true;
  }, []);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => null);
    localStorage.removeItem(LS_AUTH);
    setState((s) => ({ ...s, authed: false }));
  }, []);

  const setMe = useCallback((name: string) => {
    localStorage.setItem(LS_ME, name);
    setState((s) => ({ ...s, me: name }));
  }, []);

  const dispatch = useCallback(async (action: Action) => {
    if (modeRef.current === "server") {
      const res = await fetch("/api/db", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(action),
      }).catch(() => null);
      if (res && res.ok) {
        const { db } = (await res.json()) as { db: DB };
        setState((s) => ({ ...s, db, syncError: null }));
        return;
      }
      if (res && res.status === 401) {
        setState((s) => ({ ...s, authed: false, syncError: null }));
        return;
      }
      setState((s) => ({
        ...s,
        syncError: "Změnu se nepodařilo uložit na server. Zkontroluj připojení a zkus to znovu.",
      }));
      return;
    }
    // lokální (demo) režim — ukládáme do localStorage tohoto prohlížeče
    setState((s) => {
      if (!s.db) return s;
      const db = applyAction(s.db, action);
      saveLocalDB(db);
      return { ...s, db };
    });
  }, []);

  const dismissSyncError = useCallback(() => setState((s) => ({ ...s, syncError: null })), []);

  const trips = useMemo(() => state.db?.trips ?? [], [state.db]);

  const value: StoreApi = {
    ...state,
    trips,
    login,
    logout,
    setMe,
    dispatch,
    dismissSyncError,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore(): StoreApi {
  const v = useContext(Ctx);
  if (!v) throw new Error("useStore must be used within <StoreProvider>");
  return v;
}
