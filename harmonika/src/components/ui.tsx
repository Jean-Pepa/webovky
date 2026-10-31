"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

// ------------------------------------------------------------------ ikony

export function MetronomeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.2 2.8h5.6l3.6 18.4H5.6z" />
      <path d="M6.6 16.4h10.8" />
      <path d="M12 16.4l5.4-10.2" />
      <path d="M15.6 8.7l2.3 1.2" />
    </svg>
  );
}

export function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M7.5 4.8v14.4L19 12z" fill="currentColor" />
    </svg>
  );
}

export function StopIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <rect x="6.5" y="6.5" width="11" height="11" rx="1.6" fill="currentColor" />
    </svg>
  );
}

export function ForkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7.5 2.5v6.5a4.5 4.5 0 0 0 9 0V2.5" />
      <path d="M12 13.5v8" />
    </svg>
  );
}

// ---------------------------------------------------------------- popover

/** Bublina ukotvená pod prvkem (čip, tlačítko Menu). Klik mimo ji zavře. */
export function Popover({
  anchor,
  onClose,
  children,
  width,
  align = "center",
}: {
  anchor: HTMLElement | null;
  onClose: () => void;
  children: ReactNode;
  width?: number;
  align?: "center" | "left" | "right";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ left: number; top: number; maxH?: number } | null>(null);

  useLayoutEffect(() => {
    const place = () => {
      const el = ref.current;
      if (!el) return;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const r = anchor?.getBoundingClientRect() ?? { left: vw / 2, right: vw / 2, top: 60, bottom: 60, width: 0 };
      const w = el.offsetWidth;
      let left = align === "left" ? r.left : align === "right" ? r.right - w : r.left + r.width / 2 - w / 2;
      left = Math.max(10, Math.min(left, vw - w - 10));
      let top = r.bottom + 8;
      const maxH = vh - top - 12;
      if (maxH < 220) top = Math.max(10, vh - el.offsetHeight - 12);
      setPos({ left, top, maxH: Math.max(220, maxH) });
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [anchor, align]);

  return (
    <>
      <div className="backdrop" onClick={onClose} />
      <div
        ref={ref}
        className="popover"
        role="dialog"
        style={{
          left: pos?.left ?? -9999,
          top: pos?.top ?? 0,
          width,
          maxWidth: "calc(100vw - 20px)",
          maxHeight: pos?.maxH ? Math.min(pos.maxH, 640) : undefined,
          visibility: pos ? "visible" : "hidden",
        }}
      >
        {children}
      </div>
    </>
  );
}

// ------------------------------------------------------------- drobnosti

export function Switch({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      className={`switch ${on ? "on" : ""}`}
      onClick={() => onChange(!on)}
    />
  );
}

export function Stepper({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="stepper-label">{label}</div>
      <div className="stepper">
        <button type="button" className="round-btn" aria-label={`${label} minus`} onClick={() => onChange(Math.max(min, value - 1))}>
          −
        </button>
        <span className="val">{value}</span>
        <button type="button" className="round-btn" aria-label={`${label} plus`} onClick={() => onChange(Math.min(max, value + 1))}>
          +
        </button>
      </div>
    </div>
  );
}

export function SheetClose({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" className="sheet-close" aria-label="Close" onClick={onClick}>
      ×
    </button>
  );
}
