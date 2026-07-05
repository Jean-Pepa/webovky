"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { hasSupabase, supa } from "./supabase";
import {
  type Activity,
  type JournalEntry,
  type Author,
  type JournalKind,
  type ActivityRow,
  rowToActivity,
} from "./types";

// Datová vrstva má dva režimy:
//  • Supabase (když jsou klíče) — obousměrně, sdílené mezi zařízeními, realtime.
//  • localStorage (bez klíčů) — appka funguje hned, data jen v prohlížeči.

const LS_ACT = "cockpit:activities";
const LS_JOURNAL = "cockpit:journal";

export const dataSource: "supabase" | "local" = hasSupabase ? "supabase" : "local";

function lsRead<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function lsWrite<T>(key: string, value: T) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* kvóta / privátní režim */
  }
}

// Dnešní datum (YYYY-MM-DD) čtené mimo render (v getSnapshot), aby nespadl
// lint react-hooks/purity a nedošlo k SSR/klient nesouladu.
const noopSub = () => () => {};
const getTodayIso = () => new Date(Date.now()).toISOString().slice(0, 10);
const getTodayServer = (): string | null => null;
export function useToday(): string | null {
  return useSyncExternalStore(noopSub, getTodayIso, getTodayServer);
}

function uid(): string {
  // Jednoduché ID pro lokální záznamy (bez Date.now v renderu — tady je to v handleru).
  return "loc-" + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// ---- Aktivity (read-only v UI; zapisuje je Claude přes ingest) --------------

export function useActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    const load = async (): Promise<Activity[]> => {
      const client = supa();
      if (client) {
        const { data, error } = await client
          .from("cockpit_activities")
          .select("*")
          .order("date", { ascending: false });
        if (error) throw error;
        return (data as ActivityRow[]).map(rowToActivity);
      }
      return lsRead<Activity[]>(LS_ACT, []);
    };
    load()
      .then((d) => {
        if (alive) {
          setActivities(d);
          setLoading(false);
        }
      })
      .catch(() => {
        if (alive) setLoading(false);
      });

    // Realtime: když Claude vloží novou aktivitu, appka se sama obnoví.
    const client = supa();
    if (client) {
      const ch = client
        .channel("cockpit_activities_rt")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "cockpit_activities" },
          () => {
            load().then((d) => alive && setActivities(d)).catch(() => {});
          }
        )
        .subscribe();
      return () => {
        alive = false;
        client.removeChannel(ch);
      };
    }
    return () => {
      alive = false;
    };
  }, []);

  return { activities, loading };
}

// ---- Deník (obousměrný: user i claude) --------------------------------------

export function useJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const loadLocal = () =>
    lsRead<JournalEntry[]>(LS_JOURNAL, []).sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt)
    );

  useEffect(() => {
    let alive = true;
    const load = async (): Promise<JournalEntry[]> => {
      const client = supa();
      if (client) {
        const { data, error } = await client
          .from("cockpit_journal")
          .select("*")
          .order("created_at", { ascending: false });
        if (error) throw error;
        return (data as { id: string; author: Author; kind: JournalKind; body: string; created_at: string }[]).map(
          (r) => ({ id: r.id, author: r.author, kind: r.kind, body: r.body, createdAt: r.created_at })
        );
      }
      return loadLocal();
    };
    load()
      .then((d) => {
        if (alive) {
          setEntries(d);
          setLoading(false);
        }
      })
      .catch(() => {
        if (alive) setLoading(false);
      });

    const client = supa();
    if (client) {
      const ch = client
        .channel("cockpit_journal_rt")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "cockpit_journal" },
          () => {
            load().then((d) => alive && setEntries(d)).catch(() => {});
          }
        )
        .subscribe();
      return () => {
        alive = false;
        client.removeChannel(ch);
      };
    }
    return () => {
      alive = false;
    };
  }, []);

  const addEntry = useCallback(
    async (body: string, kind: JournalKind = "note", author: Author = "user") => {
      const text = body.trim();
      if (!text) return;
      const client = supa();
      if (client) {
        const { data, error } = await client
          .from("cockpit_journal")
          .insert({ author, kind, body: text })
          .select()
          .single();
        if (!error && data) {
          const r = data as { id: string; author: Author; kind: JournalKind; body: string; created_at: string };
          setEntries((prev) => [
            { id: r.id, author: r.author, kind: r.kind, body: r.body, createdAt: r.created_at },
            ...prev,
          ]);
        }
      } else {
        const entry: JournalEntry = {
          id: uid(),
          author,
          kind,
          body: text,
          createdAt: new Date().toISOString(),
        };
        const next = [entry, ...lsRead<JournalEntry[]>(LS_JOURNAL, [])];
        lsWrite(LS_JOURNAL, next);
        setEntries(next.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
      }
    },
    []
  );

  return { entries, loading, addEntry };
}
