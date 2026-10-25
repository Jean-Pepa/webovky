"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, type ReactNode } from "react";

export interface Route {
  name: string;
  params?: Record<string, unknown>;
}
export interface Entry extends Route {
  key: number;
}
export type Kind = "push" | "pop" | "up" | "down" | "fade" | "none";

interface NavState {
  stack: Entry[];
  leaving: Entry[];
  kind: Kind;
  busy: boolean;
  seq: number;
}

type NavAction =
  | { t: "push"; route: Route; kind: Kind }
  | { t: "pop"; n: number; kind?: Kind }
  | { t: "reset"; routes: Route[]; kind: Kind }
  | { t: "replace"; route: Route; kind: Kind }
  | { t: "settle" };

function reducer(s: NavState, a: NavAction): NavState {
  switch (a.t) {
    case "push": {
      const seq = s.seq + 1;
      return { stack: [...s.stack, { ...a.route, key: seq }], leaving: [], kind: a.kind, busy: a.kind !== "none", seq };
    }
    case "pop": {
      if (s.stack.length <= 1) return s;
      const n = Math.min(a.n, s.stack.length - 1);
      const leaving = s.stack.slice(s.stack.length - n);
      const top = leaving[leaving.length - 1];
      const kind = a.kind ?? (top.params?.__modal ? "down" : "pop");
      return { ...s, stack: s.stack.slice(0, s.stack.length - n), leaving: [top], kind, busy: true };
    }
    case "reset": {
      let seq = s.seq;
      const stack = a.routes.map((r) => ({ ...r, key: ++seq }));
      const top = s.stack[s.stack.length - 1];
      return { stack, leaving: a.kind === "none" || !top ? [] : [top], kind: a.kind, busy: a.kind !== "none", seq };
    }
    case "replace": {
      const seq = s.seq + 1;
      const top = s.stack[s.stack.length - 1];
      return { stack: [...s.stack.slice(0, -1), { ...a.route, key: seq }], leaving: top ? [top] : [], kind: a.kind, busy: true, seq };
    }
    case "settle":
      return s.busy || s.leaving.length ? { ...s, leaving: [], busy: false } : s;
  }
}

export interface NavApi {
  stack: Entry[];
  leaving: Entry[];
  kind: Kind;
  busy: boolean;
  top: Entry;
  push: (route: Route | string, kind?: Kind) => void;
  modal: (route: Route | string) => void;
  pop: (n?: number) => void;
  back: () => void;
  popTo: (name: string) => void;
  reset: (routes: (Route | string)[], kind?: Kind) => void;
  replace: (route: Route | string, kind?: Kind) => void;
}

const Ctx = createContext<NavApi | null>(null);
const DUR = 440;

const norm = (r: Route | string): Route => (typeof r === "string" ? { name: r } : r);

export function NavProvider({ initial, children }: { initial: Route[]; children: ReactNode }) {
  const [s, dispatch] = useReducer(reducer, undefined, () => ({
    stack: initial.map((r, i) => ({ ...r, key: i + 1 })),
    leaving: [],
    kind: "none" as Kind,
    busy: false,
    seq: initial.length,
  }));
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const settleLater = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => dispatch({ t: "settle" }), DUR);
  }, []);
  const go = useCallback(
    (a: NavAction) => {
      dispatch(a);
      settleLater();
    },
    [settleLater],
  );

  // Tlačítko Zpět v prohlížeči / gesto zpět na iOS: držíme jednu „past“ v historii.
  const armed = useRef(false);
  const ignore = useRef(false);
  const depth = s.stack.length;
  const depthRef = useRef(depth);
  useEffect(() => {
    depthRef.current = depth;
    if (depth > 1 && !armed.current) {
      window.history.pushState({ bulo: true }, "");
      armed.current = true;
    } else if (depth <= 1 && armed.current) {
      armed.current = false;
      ignore.current = true;
      window.history.back();
    }
  }, [depth]);
  useEffect(() => {
    const onPop = () => {
      if (ignore.current) {
        ignore.current = false;
        return;
      }
      armed.current = false;
      if (depthRef.current > 1) {
        dispatch({ t: "pop", n: 1 });
        settleLater();
        if (depthRef.current - 1 > 1) {
          window.history.pushState({ bulo: true }, "");
          armed.current = true;
        }
      }
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [settleLater]);

  const api = useMemo<NavApi>(() => {
    const top = s.stack[s.stack.length - 1];
    return {
      stack: s.stack,
      leaving: s.leaving,
      kind: s.kind,
      busy: s.busy,
      top,
      push: (r, kind = "push") => go({ t: "push", route: norm(r), kind }),
      modal: (r) => {
        const route = norm(r);
        go({ t: "push", route: { ...route, params: { ...route.params, __modal: true } }, kind: "up" });
      },
      pop: (n = 1) => go({ t: "pop", n }),
      back: () => go({ t: "pop", n: 1 }),
      popTo: (name) => {
        const i = s.stack.map((e) => e.name).lastIndexOf(name);
        if (i >= 0 && i < s.stack.length - 1) go({ t: "pop", n: s.stack.length - 1 - i, kind: "pop" });
      },
      reset: (routes, kind = "fade") => go({ t: "reset", routes: routes.map(norm), kind }),
      replace: (r, kind = "fade") => go({ t: "replace", route: norm(r), kind }),
    };
  }, [s, go]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useNav(): NavApi {
  const v = useContext(Ctx);
  if (!v) throw new Error("useNav mimo NavProvider");
  return v;
}

// Je obrazovka právě nahoře (aktivní)? Skryté obrazovky v zásobníku mají false.
export const ActiveCtx = createContext(true);
export function useActive() {
  return useContext(ActiveCtx);
}
