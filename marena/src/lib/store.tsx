"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { DB, Year } from "./types";
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
  currentYearId: string | null;
}

interface StoreApi extends StoreState {
  currentYear: Year | null;
  login: (password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  setMe: (name: string) => void;
  setCurrentYearId: (id: string) => void;
  dispatch: (action: Action) => Promise<void>;
}

const LS_ME = "marena_me";
const LS_YEAR = "marena_year";
const LS_AUTH = "marena_authed";
const LS_DB = "marena_db";

const Ctx = createContext<StoreApi | null>(null);

function loadLocalDB(): DB {
  if (typeof window === "undefined") return seedDB();
  try {
    const raw = localStorage.getItem(LS_DB);
    if (raw) {
      const parsed = JSON.parse(raw) as DB;
      if (parsed && Array.isArray(parsed.years)) return parsed;
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
    currentYearId: null,
  });
  const modeRef = useRef<Mode>("loading");

  // Načtení identity z localStorage + zjištění režimu (server/local) z API.
  useEffect(() => {
    const me = localStorage.getItem(LS_ME) || "";
    const savedYear = localStorage.getItem(LS_YEAR);

    (async () => {
      try {
        const res = await fetch("/api/db", { cache: "no-store" });
        if (res.ok) {
          const { db } = (await res.json()) as { db: DB };
          modeRef.current = "server";
          setState((s) => ({ ...s, ready: true, mode: "server", configured: true, authed: true, db, me, currentYearId: pickYear(db, savedYear) }));
          return;
        }
        if (res.status === 401) {
          modeRef.current = "server";
          setState((s) => ({ ...s, ready: true, mode: "server", configured: true, authed: false, db: null, me, currentYearId: savedYear }));
          return;
        }
      } catch {
        /* síť selhala → lokální režim */
      }
      // 503 nebo chyba sítě → lokální (demo) režim z localStorage
      const localDb = loadLocalDB();
      const authed = localStorage.getItem(LS_AUTH) === "1";
      modeRef.current = "local";
      setState((s) => ({ ...s, ready: true, mode: "local", configured: false, authed, db: localDb, me, currentYearId: pickYear(localDb, savedYear) }));
    })();
  }, []);

  const login = useCallback(async (password: string): Promise<boolean> => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    }).catch(() => null);
    if (!res || !res.ok) return false;

    // Po přihlášení zjisti režim a načti data.
    try {
      const dbRes = await fetch("/api/db", { cache: "no-store" });
      if (dbRes.ok) {
        const { db } = (await dbRes.json()) as { db: DB };
        modeRef.current = "server";
        setState((s) => ({ ...s, mode: "server", configured: true, authed: true, db, currentYearId: pickYear(db, s.currentYearId) }));
        return true;
      }
    } catch {
      /* ignore → lokální režim níže */
    }
    const localDb = loadLocalDB();
    localStorage.setItem(LS_AUTH, "1");
    modeRef.current = "local";
    setState((s) => ({ ...s, mode: "local", configured: false, authed: true, db: localDb, currentYearId: pickYear(localDb, s.currentYearId) }));
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

  const setCurrentYearId = useCallback((id: string) => {
    localStorage.setItem(LS_YEAR, id);
    setState((s) => ({ ...s, currentYearId: id }));
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
        setState((s) => ({ ...s, db, currentYearId: pickYear(db, s.currentYearId) }));
        return;
      }
      // fall-through na lokální při chybě serveru
    }
    setState((s) => {
      if (!s.db) return s;
      const db = applyAction(s.db, action);
      saveLocalDB(db);
      return { ...s, db, currentYearId: pickYear(db, s.currentYearId) };
    });
  }, []);

  const currentYear = useMemo(() => {
    if (!state.db) return null;
    return state.db.years.find((y) => y.id === state.currentYearId) ?? state.db.years[0] ?? null;
  }, [state.db, state.currentYearId]);

  const value: StoreApi = {
    ...state,
    currentYear,
    login,
    logout,
    setMe,
    setCurrentYearId,
    dispatch,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

function pickYear(db: DB, preferred: string | null): string | null {
  if (preferred && db.years.some((y) => y.id === preferred)) return preferred;
  return db.years[0]?.id ?? null;
}

export function useStore(): StoreApi {
  const v = useContext(Ctx);
  if (!v) throw new Error("useStore must be used within <StoreProvider>");
  return v;
}
