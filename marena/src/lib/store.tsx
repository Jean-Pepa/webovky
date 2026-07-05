"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { DB, Year } from "./types";
import { normalizeDb } from "./migrate";
import { applyAction, type Action } from "./actions";
import { seedDB } from "./seed";
import { isYearEditable, yearFromPassword } from "./years";
import { supabaseEnabled } from "./supabase/config";
import { createSupabaseBrowser } from "./supabase/client";
import { sameName } from "./names";
import { isAdmin } from "./admin";

type Mode = "loading" | "server" | "local";

interface StoreState {
  ready: boolean;
  mode: Mode;
  configured: boolean; // běží sdílený backend (Redis)?
  authed: boolean;
  db: DB | null;
  me: string; // moje jméno (identita bez účtu)
  currentYearId: string | null;
  syncError: string | null; // chyba uložení na server (ať se data neztrácí tiše)
}

interface StoreApi extends StoreState {
  currentYear: Year | null;
  canEditCurrentYear: boolean; // smím měnit aktuálně vybraný ročník? (starší jsou zamčené)
  pendingApproval: boolean; // čekám na schválení správcem (zamčeno, jen náhled)
  login: (password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  setMe: (name: string) => void;
  setCurrentYearId: (id: string) => void;
  // Vrací true, když se změna opravdu zapsala (server ji přijal / lokálně
  // uložena). false = neuloženo (uzamčený ročník, výpadek sítě, odhlášení).
  dispatch: (action: Action) => Promise<boolean>;
  dismissSyncError: () => void;
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
      if (parsed && Array.isArray(parsed.years)) return normalizeDb(parsed);
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
    syncError: null,
  });
  const modeRef = useRef<Mode>("loading");
  // Vždy aktuální stav (kvůli kontrole zámku uvnitř memoizovaného dispatch).
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  });

  // Načtení identity z localStorage + zjištění režimu (server/local) z API.
  useEffect(() => {
    const me = localStorage.getItem(LS_ME) || "";
    const savedYear = localStorage.getItem(LS_YEAR);

    (async () => {
      try {
        const res = await fetch("/api/db", { cache: "no-store" });
        if (res.ok) {
          const { db: rawDb } = (await res.json()) as { db: DB };
          const db = normalizeDb(rawDb);
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

    // Heslo „marenaYYYY" → po přihlášení otevři ten ročník (zakládá ho ale jen
    // správce přes „+ ročník", tady se na něj jen přepneme, když existuje).
    const wantedYear = yearFromPassword(password);

    // Po přihlášení zjisti režim a načti data.
    try {
      const dbRes = await fetch("/api/db", { cache: "no-store" });
      if (dbRes.ok) {
        const db = normalizeDb(((await dbRes.json()) as { db: DB }).db);
        modeRef.current = "server";
        const yearId = wantedYear && db.years.some((y) => y.id === wantedYear) ? wantedYear : pickYear(db, null);
        if (yearId) localStorage.setItem(LS_YEAR, yearId);
        setState((s) => ({ ...s, mode: "server", configured: true, authed: true, db, currentYearId: yearId }));
        return true;
      }
    } catch {
      /* ignore → lokální režim níže */
    }
    const localDb = loadLocalDB();
    localStorage.setItem(LS_AUTH, "1");
    modeRef.current = "local";
    const localYearId = wantedYear && localDb.years.some((y) => y.id === wantedYear) ? wantedYear : pickYear(localDb, null);
    if (localYearId) localStorage.setItem(LS_YEAR, localYearId);
    setState((s) => ({ ...s, mode: "local", configured: false, authed: true, db: localDb, currentYearId: localYearId }));
    return true;
  }, []);

  const logout = useCallback(async () => {
    if (supabaseEnabled()) {
      try {
        await createSupabaseBrowser().auth.signOut();
      } catch {
        /* ignore */
      }
    }
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => null);
    // Úplné odhlášení: zapomeň heslo do zázemí i identitu, ať se příště musí
    // znovu zadat heslo (marena2026) i přihlášení.
    localStorage.removeItem(LS_AUTH);
    localStorage.removeItem(LS_ME);
    setState((s) => ({ ...s, authed: false, me: "" }));
  }, []);

  const setMe = useCallback((name: string) => {
    localStorage.setItem(LS_ME, name);
    setState((s) => ({ ...s, me: name }));
  }, []);

  const setCurrentYearId = useCallback((id: string) => {
    localStorage.setItem(LS_YEAR, id);
    setState((s) => ({ ...s, currentYearId: id }));
  }, []);

  const dispatch = useCallback(async (action: Action): Promise<boolean> => {
    // Zámek starších ročníků: měnit jde jen aktuální ročník (správce vždy).
    const yearId = (action as { yearId?: string }).yearId;
    if (yearId && !isYearEditable(stateRef.current.db, yearId, stateRef.current.me)) {
      setState((s) => ({
        ...s,
        syncError: "Tento ročník je uzamčený — jde ho jen prohlížet. Měnit lze jen aktuální (nejnovější) ročník.",
      }));
      return false;
    }
    if (modeRef.current === "server") {
      const res = await fetch("/api/db", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(action),
      }).catch(() => null);
      if (res && res.ok) {
        const { db: rawDb } = (await res.json()) as { db: DB };
        const db = normalizeDb(rawDb);
        setState((s) => ({ ...s, db, syncError: null, currentYearId: pickYear(db, s.currentYearId) }));
        return true;
      }
      if (res && res.status === 401) {
        // session vypršela → odhlásit; layout přesměruje na /prihlaseni
        setState((s) => ({ ...s, authed: false, syncError: null }));
        return false;
      }
      // Chyba serveru (síť / 5xx / konflikt). NEaplikovat tiše lokálně —
      // to by změnu nikdy nedostalo na server a po reloadu by zmizela.
      setState((s) => ({
        ...s,
        syncError: "Změnu se nepodařilo uložit na server. Zkontroluj připojení a zkus to znovu.",
      }));
      return false;
    }
    // lokální (demo) režim — ukládáme do localStorage tohoto prohlížeče
    setState((s) => {
      if (!s.db) return s;
      const db = applyAction(s.db, action);
      saveLocalDB(db);
      return { ...s, db, currentYearId: pickYear(db, s.currentYearId) };
    });
    return true;
  }, []);

  const dismissSyncError = useCallback(() => setState((s) => ({ ...s, syncError: null })), []);

  const currentYear = useMemo(() => {
    if (!state.db) return null;
    return state.db.years.find((y) => y.id === state.currentYearId) ?? state.db.years[0] ?? null;
  }, [state.db, state.currentYearId]);

  // Čekání na schválení: můj člen má approved === false (a nejsem správce).
  const myMember = currentYear?.members.find((m) => sameName(m.name, state.me));
  const pendingApproval = !isAdmin(state.me) && myMember?.approved === false;
  const canEditCurrentYear = isYearEditable(state.db, currentYear?.id ?? null, state.me) && !pendingApproval;

  const value: StoreApi = {
    ...state,
    currentYear,
    canEditCurrentYear,
    pendingApproval,
    login,
    logout,
    setMe,
    setCurrentYearId,
    dispatch,
    dismissSyncError,
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
