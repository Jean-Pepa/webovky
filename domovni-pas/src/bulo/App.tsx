"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import { StoreProvider, houseByCode, useStore, type AppState } from "./store";
import { NavProvider, useNav, ActiveCtx, type Entry, type Route } from "./nav";
import { OverlayHost, OverlayProvider, useOverlay } from "./overlay";
import { ModeCtx, TabletCtx } from "./ui";
import { SCREENS } from "./screens";
import { Guide } from "./guide";

// ---------- Velikost okna a režim ----------
let vpCache = { w: 390, h: 844 };
function subscribeVp(cb: () => void) {
  window.addEventListener("resize", cb);
  window.addEventListener("orientationchange", cb);
  return () => {
    window.removeEventListener("resize", cb);
    window.removeEventListener("orientationchange", cb);
  };
}
function getVp() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  if (w !== vpCache.w || h !== vpCache.h) vpCache = { w, h };
  return vpCache;
}
const serverVp = { w: 390, h: 844 };
function useViewport() {
  return useSyncExternalStore(subscribeVp, getVp, () => serverVp);
}

function forcedMode(): "framed" | "native" | null {
  try {
    const r = new URLSearchParams(window.location.search).get("rezim");
    if (r === "telefon") return "native";
    if (r === "ramecek") return "framed";
  } catch {
    // nic
  }
  return null;
}

export default function BuloApp({ code }: { code?: string }) {
  return (
    <StoreProvider code={code}>
      <Root code={code} />
    </StoreProvider>
  );
}

function initialRoutes(s: AppState, code?: string): Route[] {
  if (s.role === "technik") {
    const h = houseByCode(s.houses, code);
    if (h) {
      const job = s.jobs.find((j) => j.houseId === h.id && j.status === "open");
      return [{ name: "zakazky" }, { name: "zarizeni-dum", params: { job: job?.id ?? "servis", house: h.id } }];
    }
    return [{ name: "zakazky" }];
  }
  return [{ name: "domy" }];
}

function Root({ code }: { code?: string }) {
  const { s } = useStore();
  const [initial] = useState(() => initialRoutes(s, code));
  return (
    <NavProvider initial={initial}>
      <OverlayProvider>
        <Shell />
      </OverlayProvider>
    </NavProvider>
  );
}

function Shell() {
  const vp = useViewport();
  const [forced] = useState(forcedMode);
  const mode: "framed" | "native" = forced ?? (vp.w >= 760 && vp.h >= 600 ? "framed" : "native");
  const nav = useNav();
  const tabletWanted = nav.top.name === "agent" && mode === "framed" && vp.w >= 1100;

  useEffect(() => {
    document.documentElement.style.background = "#F2F0ED";
    document.body.style.background = "#F2F0ED";
  }, []);

  return (
    <ModeCtx.Provider value={mode}>
      <div className={`bulo ${mode}`}>
        {mode === "framed" ? (
          <div className={`stage ${tabletWanted ? "tab-mode" : ""}`}>
            <Guide />
            <Frame vp={vp} tablet={tabletWanted} />
          </div>
        ) : (
          <Device tablet={false} />
        )}
      </div>
    </ModeCtx.Provider>
  );
}

function Frame({ vp, tablet }: { vp: { w: number; h: number }; tablet: boolean }) {
  const nat = tablet ? { w: 1180 + 36, h: 820 + 36 } : { w: 390 + 24, h: 844 + 24 };
  const availW = tablet ? vp.w - 380 - 80 : vp.w >= 980 ? vp.w - 480 : vp.w - 40;
  const k = Math.max(0.4, Math.min(1, (vp.h - 48) / nat.h, availW / nat.w));
  const box: CSSProperties = { width: nat.w * k, height: nat.h * k, position: "relative", flex: "none", justifySelf: "center" };
  return (
    <div style={box}>
      <div className={`phone ${tablet ? "tablet" : ""}`} style={{ position: "absolute", left: 0, top: 0, transform: `scale(${k})`, transformOrigin: "0 0" }}>
        <div className="screen">
          <Device tablet={tablet} />
        </div>
      </div>
    </div>
  );
}

function Device({ tablet }: { tablet: boolean }) {
  return (
    <div className={`dev ${tablet ? "tablet" : ""}`}>
      <TabletCtx.Provider value={tablet}>
        <Stack />
      </TabletCtx.Provider>
      {!tablet && <div className="isl" />}
      <OverlayHost />
      <NotifWatcher />
    </div>
  );
}

const IN: Record<string, string> = { push: "a-push-in", pop: "a-pop-in", up: "a-up-in", down: "", fade: "a-fade-in", none: "" };
const OUT: Record<string, string> = { pop: "a-pop-out", down: "a-down-out", fade: "a-fade-out", push: "", up: "", none: "hidden" };

function Stack() {
  const { stack, leaving, kind, busy } = useNav();
  const n = stack.length;
  const items: { e: Entry; cls: string; top: boolean }[] = [];
  stack.forEach((e, i) => {
    const top = i === n - 1;
    let cls = "";
    if (top) cls = busy ? IN[kind] : "";
    else if (i === n - 2 && busy && kind === "push") cls = "a-push-out";
    else if (i === n - 2 && (stack[n - 1].params?.__modal || (busy && kind === "up"))) cls = "";
    else cls = "hidden";
    items.push({ e, cls, top });
  });
  for (const e of leaving) items.push({ e, cls: busy ? OUT[kind] : "hidden", top: false });
  return (
    <>
      {items.map(({ e, cls, top }) => {
        const C = SCREENS[e.name] ?? SCREENS.chybi;
        return (
          <div key={e.key} className={`scr ${cls} ${busy ? "busy" : ""}`} aria-hidden={!top}>
            <ActiveCtx.Provider value={top}>
              <C params={e.params ?? {}} />
            </ActiveCtx.Provider>
          </div>
        );
      })}
    </>
  );
}

// Nové notifikace pro aktuální roli se ukážou jako banner nahoře.
function NotifWatcher() {
  const { s, dispatch } = useStore();
  const nav = useNav();
  const ov = useOverlay();
  const shown = useRef<Set<string>>(new Set(s.notifs.map((n) => n.id)));
  const role = s.role;
  const latest = s.notifs[0];
  useEffect(() => {
    if (!latest || shown.current.has(latest.id)) return;
    shown.current.add(latest.id);
    if (latest.role !== role || s.lockQueue.includes(latest.id)) return;
    ov.banner({
      title: "BULO · Chata Loučky",
      head: latest.title.startsWith("BULO") ? undefined : latest.title,
      body: latest.body,
      onTap: () => {
        dispatch({ t: "readNotif", id: latest.id });
        if (latest.go?.length) nav.reset(latest.go, "fade");
      },
    });
  }, [latest, role, s.lockQueue, ov, nav, dispatch]);
  return null;
}
