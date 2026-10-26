"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import { Icon } from "./icons";

interface SheetSpec {
  id: number;
  render: (close: () => void) => ReactNode;
}
interface BannerSpec {
  id: number;
  /** Řádek aplikace, např. „BULO · Chata Loučky“. */
  title: string;
  head?: string;
  body: string;
  time?: string;
  onTap?: () => void;
  leaving?: boolean;
}

export interface OverlayApi {
  sheet: (render: (close: () => void) => ReactNode) => void;
  closeSheet: () => void;
  banner: (b: Omit<BannerSpec, "id">) => void;
  toast: (text: string) => void;
}

interface OverlayState {
  sheets: SheetSpec[];
  banner: BannerSpec | null;
  toast: { id: number; text: string } | null;
}

const Ctx = createContext<OverlayApi | null>(null);
const StateCtx = createContext<OverlayState & { close: (id: number) => void; tapBanner: () => void }>({
  sheets: [],
  banner: null,
  toast: null,
  close: () => {},
  tapBanner: () => {},
});

export function OverlayProvider({ children }: { children: ReactNode }) {
  const [sheets, setSheets] = useState<SheetSpec[]>([]);
  const [banner, setBanner] = useState<BannerSpec | null>(null);
  const [toast, setToast] = useState<{ id: number; text: string } | null>(null);
  const seq = useRef(0);
  const bt = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tt = useRef<ReturnType<typeof setTimeout> | null>(null);

  const close = useCallback((id: number) => setSheets((l) => l.filter((x) => x.id !== id)), []);
  const hideBanner = useCallback(() => {
    setBanner((b) => (b ? { ...b, leaving: true } : b));
    if (bt.current) clearTimeout(bt.current);
    bt.current = setTimeout(() => setBanner(null), 320);
  }, []);

  const api = useMemo<OverlayApi>(
    () => ({
      sheet: (render) => setSheets((l) => [...l, { id: ++seq.current, render }]),
      closeSheet: () => setSheets((l) => l.slice(0, -1)),
      banner: (b) => {
        const id = ++seq.current;
        setBanner({ ...b, id });
        if (bt.current) clearTimeout(bt.current);
        bt.current = setTimeout(() => {
          setBanner((cur) => (cur && cur.id === id ? { ...cur, leaving: true } : cur));
          bt.current = setTimeout(() => setBanner((cur) => (cur && cur.id === id ? null : cur)), 320);
        }, 6500);
      },
      toast: (text) => {
        const id = ++seq.current;
        setToast({ id, text });
        if (tt.current) clearTimeout(tt.current);
        tt.current = setTimeout(() => setToast((t) => (t && t.id === id ? null : t)), 2400);
      },
    }),
    [],
  );

  const tapBanner = useCallback(() => {
    const fn = banner?.onTap;
    hideBanner();
    fn?.();
  }, [banner, hideBanner]);

  return (
    <Ctx.Provider value={api}>
      <StateCtx.Provider value={{ sheets, banner, toast, close, tapBanner }}>{children}</StateCtx.Provider>
    </Ctx.Provider>
  );
}

export function useOverlay(): OverlayApi {
  const v = useContext(Ctx);
  if (!v) throw new Error("useOverlay mimo OverlayProvider");
  return v;
}

// Vykresluje se uvnitř telefonu (.dev).
export function OverlayHost() {
  const { sheets, banner, toast, close, tapBanner } = useContext(StateCtx);
  return (
    <>
      {sheets.map((sh) => (
        <div className="sheet-wrap" key={sh.id}>
          <div className="sheet-back" onClick={() => close(sh.id)} />
          <div className="sheet" role="dialog" aria-modal="true">
            <div className="grab" />
            {sh.render(() => close(sh.id))}
          </div>
        </div>
      ))}
      {banner && (
        <button type="button" className={`banner ${banner.leaving ? "leaving" : ""}`} onClick={tapBanner}>
          <span className="appicon">B</span>
          <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
            <span style={{ display: "flex", justifyContent: "space-between", gap: 8, fontSize: 13, color: "#6F6A65" }}>
              <b style={{ color: "#141414", fontWeight: 600 }}>{banner.title}</b>
              <span style={{ flex: "none" }}>{banner.time ?? "teď"}</span>
            </span>
            {banner.head && <b style={{ fontSize: 15, fontWeight: 600 }}>{banner.head}</b>}
            <span style={{ fontSize: 14, lineHeight: 1.35 }}>{banner.body}</span>
          </span>
        </button>
      )}
      {toast && (
        <div className="toast" role="status" key={toast.id}>
          {toast.text}
        </div>
      )}
    </>
  );
}

// Jednoduchý výběrový sheet (akce pod sebou).
export function ActionList({
  items,
  close,
}: {
  items: { icon: Parameters<typeof Icon>[0]["name"]; label: string; sub?: string; tone?: string; onClick: () => void }[];
  close: () => void;
}) {
  return (
    <div className="card" style={{ overflow: "hidden" }}>
      {items.map((it) => (
        <button
          key={it.label}
          type="button"
          className="row press"
          onClick={() => {
            close();
            it.onClick();
          }}
        >
          <span className="ic" style={{ background: "#F4E4DD" }}>
            <Icon name={it.icon} size={20} color={it.tone ?? "#B5543A"} />
          </span>
          <span className="rt">
            <b>{it.label}</b>
            {it.sub && <span>{it.sub}</span>}
          </span>
          <Icon name="chevron" size={18} color="#C4BEB6" sw={2.2} />
        </button>
      ))}
    </div>
  );
}
