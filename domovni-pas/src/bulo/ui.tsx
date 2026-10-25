"use client";

import { createContext, useContext, useEffect, useRef, useSyncExternalStore, type CSSProperties, type ReactNode } from "react";
import { Icon, type IconName } from "./icons";
import { TONES } from "./data";
import type { Tone } from "./types";
import { hm } from "./time";

// ---------- Hodiny (stavový řádek) ----------
let clockNow = 0;
function subscribeClock(cb: () => void) {
  const id = setInterval(() => {
    clockNow = Date.now();
    cb();
  }, 15000);
  return () => clearInterval(id);
}
function getClock() {
  if (!clockNow) clockNow = Date.now();
  return Math.floor(clockNow / 60000);
}
export function useClockMinute() {
  return useSyncExternalStore(subscribeClock, getClock, () => 0);
}
// Aktuální čas pro vykreslování (mění se po minutách; v renderu nevoláme Date.now()).
export function useNow() {
  return useClockMinute() * 60000;
}
export function useNowLabel() {
  const m = useClockMinute();
  return m ? hm(m * 60000) : "9:41";
}

// Režim zobrazení: framed (desktop, telefon v rámečku) / native (mobil na celou obrazovku).
export const ModeCtx = createContext<"framed" | "native">("native");
export const useMode = () => useContext(ModeCtx);

function Bars({ c }: { c: string }) {
  return (
    <span style={{ display: "flex", gap: 6, alignItems: "center" }}>
      <svg width="18" height="12" viewBox="0 0 18 12">
        <rect x="0" y="8" width="3" height="4" rx="1" fill={c} />
        <rect x="5" y="5.5" width="3" height="6.5" rx="1" fill={c} />
        <rect x="10" y="3" width="3" height="9" rx="1" fill={c} />
        <rect x="15" y="0" width="3" height="12" rx="1" fill={c} />
      </svg>
      <svg width="16" height="12" viewBox="0 0 16 12">
        <path d="M8 11.5l2.2-2.6a3.2 3.2 0 0 0-4.4 0zM3.6 6.6a6.4 6.4 0 0 1 8.8 0l1.5-1.7a8.8 8.8 0 0 0-11.8 0zM.6 3.2a11 11 0 0 1 14.8 0L16.8 1.6a13.3 13.3 0 0 0-17.6 0z" fill={c} />
      </svg>
      <svg width="27" height="13" viewBox="0 0 27 13">
        <rect x=".5" y=".5" width="23" height="12" rx="3.5" fill="none" stroke={c} strokeOpacity=".4" />
        <rect x="2" y="2" width="17" height="9" rx="2" fill={c} />
        <rect x="24.5" y="4.5" width="2" height="4" rx="1" fill={c} fillOpacity=".45" />
      </svg>
    </span>
  );
}

export function StatusBar({ dark, time }: { dark?: boolean; time?: string }) {
  const now = useNowLabel();
  const c = dark ? "#FFFFFF" : "#141414";
  return (
    <div className="sb" style={{ color: c }}>
      <span>{time ?? now}</span>
      <Bars c={c} />
    </div>
  );
}

// ---------- Obrazovka ----------
export function Screen({
  children,
  dark,
  bg,
  className,
  style,
  statusTime,
  noStatus,
}: {
  children: ReactNode;
  dark?: boolean;
  bg?: string;
  className?: string;
  style?: CSSProperties;
  statusTime?: string;
  noStatus?: boolean;
}) {
  return (
    <div className={`layer ${dark ? "dk" : ""} ${className ?? ""}`} style={{ background: bg, ...style }}>
      {!noStatus && <StatusBar dark={dark} time={statusTime} />}
      {children}
      <div className={`hi ${dark ? "hiw" : ""}`} />
    </div>
  );
}

export function Body({
  children,
  gap,
  tab,
  bottom,
  style,
  className,
  bodyRef,
}: {
  children: ReactNode;
  gap?: number;
  tab?: boolean;
  bottom?: boolean | 2;
  style?: CSSProperties;
  className?: string;
  bodyRef?: React.Ref<HTMLDivElement>;
}) {
  const cls = ["body", tab ? "has-tab" : "", bottom === 2 ? "has-bottom2" : bottom ? "has-bottom" : "", className ?? ""].join(" ");
  return (
    <div ref={bodyRef} className={cls} style={{ gap, ...style }}>
      {children}
    </div>
  );
}

export function Nav({ back, onBack, right }: { back?: string; onBack?: () => void; right?: ReactNode }) {
  return (
    <div className="nav">
      {back ? (
        <button type="button" className="navb" onClick={onBack} aria-label={`Zpět: ${back}`}>
          <Icon name="back" size={24} color="#B5543A" sw={2.4} />
          {back}
        </button>
      ) : (
        <span />
      )}
      {right}
    </div>
  );
}

export function Title({ title, sub, style }: { title: ReactNode; sub?: ReactNode; style?: CSSProperties }) {
  return (
    <div style={style}>
      <div className="lt">{title}</div>
      {sub && <div className="sub">{sub}</div>}
    </div>
  );
}

export function Ic({ icon, tone = "muted", size = 20, box = 40, color, bg, sw = 2 }: { icon: IconName; tone?: Tone; size?: number; box?: number; color?: string; bg?: string; sw?: number }) {
  const t = TONES[tone];
  return (
    <span className="ic" style={{ background: bg ?? t.bg, width: box, height: box, borderRadius: box / 2 }}>
      <Icon name={icon} size={size} color={color ?? t.fg} sw={sw} />
    </span>
  );
}

export function Chip({ tone = "muted", children, style, icon }: { tone?: Tone; children: ReactNode; style?: CSSProperties; icon?: IconName }) {
  const t = TONES[tone];
  return (
    <span className="chip" style={{ background: t.bg, color: t.fg, ...style }}>
      {icon && <Icon name={icon} size={14} color={t.fg} sw={2.4} />}
      {children}
    </span>
  );
}

export function Row({
  children,
  onClick,
  style,
  className,
  id,
}: {
  children: ReactNode;
  onClick?: () => void;
  style?: CSSProperties;
  className?: string;
  id?: string;
}) {
  if (onClick)
    return (
      <button type="button" id={id} className={`row press ${className ?? ""}`} style={style} onClick={onClick}>
        {children}
      </button>
    );
  return (
    <div id={id} className={`row ${className ?? ""}`} style={style}>
      {children}
    </div>
  );
}

export function RowText({ title, sub, titleStyle, subStyle }: { title: ReactNode; sub?: ReactNode; titleStyle?: CSSProperties; subStyle?: CSSProperties }) {
  return (
    <span className="rt">
      <b style={titleStyle}>{title}</b>
      {sub !== undefined && <span style={subStyle}>{sub}</span>}
    </span>
  );
}

export const Chevron = () => <Icon name="chevron" size={18} color="#C4BEB6" sw={2.2} />;

export function Btn({
  children,
  icon,
  variant,
  onClick,
  disabled,
  style,
  id,
}: {
  children: ReactNode;
  icon?: IconName;
  variant?: "dark" | "light" | "ok";
  onClick?: () => void;
  disabled?: boolean;
  style?: CSSProperties;
  id?: string;
}) {
  return (
    <button type="button" id={id} className={`btn ${variant ?? ""}`} onClick={onClick} disabled={disabled} style={style}>
      {icon && <Icon name={icon} size={22} color={variant === "light" ? "#141414" : "#fff"} sw={2.4} />}
      {children}
    </button>
  );
}

export function Bottom({ children, note, fade = true }: { children: ReactNode; note?: ReactNode; fade?: boolean }) {
  return (
    <>
      {fade && <div className="bottom-fade" />}
      <div className="bottom">
        <div className="brow">{children}</div>
        {note && <div className="bnote">{note}</div>}
      </div>
    </>
  );
}

export function Card({ children, style, className }: { children: ReactNode; style?: CSSProperties; className?: string }) {
  return (
    <div className={`card ${className ?? ""}`} style={{ overflow: "hidden", ...style }}>
      {children}
    </div>
  );
}

export function Label({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div className="lbl" style={style}>
      {children}
    </div>
  );
}

// Pulzující kruh (živé hodnoty, AR značky).
export function Pulse({ color = "#fff", size = 40, style }: { color?: string; size?: number; style?: CSSProperties }) {
  return (
    <span
      aria-hidden="true"
      style={{
        position: "absolute",
        width: size,
        height: size,
        left: -size / 2,
        top: -size / 2,
        borderRadius: "50%",
        border: `2.5px solid ${color}`,
        animation: "bulo-pulse 1.6s ease-out infinite",
        pointerEvents: "none",
        ...style,
      }}
    />
  );
}

// Posun obsahu na začátek, když se obrazovka znovu otevře s jiným parametrem.
export function useScrollTopOn(dep: unknown) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.scrollTo({ top: 0 });
  }, [dep]);
  return ref;
}

// Je zařízení v rámečku tabletu (agent projektu na desktopu)?
export const TabletCtx = createContext(false);
export const useTablet = () => useContext(TabletCtx);
