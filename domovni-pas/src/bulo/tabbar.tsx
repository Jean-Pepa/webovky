"use client";

import { useLayoutEffect, useRef } from "react";
import { Icon, type IconName } from "./icons";
import { useNav } from "./nav";

export const TABS: { key: string; label: string; icon: IconName; fab?: boolean }[] = [
  { key: "dum", label: "Dům", icon: "house" },
  { key: "zarizeni", label: "Zařízení", icon: "grid" },
  { key: "zapsat", label: "Zapsat", icon: "camera", fab: true },
  { key: "terminy", label: "Termíny", icon: "calendar" },
  { key: "dokumenty", label: "Dokumenty", icon: "doc" },
];

// Poslední aktivní záložka (bublina se přelije z ní na novou).
let lastTab = 0;

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, x));
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function GlassTab({ active, houseId, onZapsat }: { active: string; houseId: string; onZapsat: () => void }) {
  const nav = useNav();
  const bar = useRef<HTMLDivElement>(null);
  const bub = useRef<HTMLDivElement>(null);
  const idx = Math.max(0, TABS.findIndex((t) => t.key === active));

  useLayoutEffect(() => {
    const b = bar.current;
    const u = bub.current;
    if (!b || !u) return;
    const geo = () => {
      const W = b.clientWidth;
      const slot = (W - 14) / TABS.length;
      const bw = Math.min(62, slot - 6);
      return { slot, bw, x: (i: number) => 6 + i * slot + (slot - bw) / 2 };
    };
    const place = (x0: number, x1: number, e: number) => {
      const g = geo();
      const a = g.x(x0);
      const d = g.x(x1) - a;
      const k = Math.min(1, Math.abs(d) / 140);
      const q = d === 0 ? 1 : e + 0.5 * e * e * Math.sin(Math.PI * e);
      const m = Math.sin(Math.PI * clamp(e / 0.85, 0, 1));
      let sx = 1 + 0.3 * k * m;
      let sy = 1 - 0.12 * k * m;
      if (e > 0.85) {
        const s2 = Math.sin((Math.PI * (e - 0.85)) / 0.15);
        sx -= 0.04 * k * s2;
        sy += 0.03 * k * s2;
      }
      u.style.width = `${g.bw}px`;
      u.style.transform = `translateX(${(a + d * q).toFixed(2)}px) scale(${sx.toFixed(4)},${sy.toFixed(4)})`;
    };
    const from = lastTab;
    lastTab = idx;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    if (from === idx || reduce) place(idx, idx, 1);
    else {
      const t0 = performance.now();
      const step = (now: number) => {
        const p = clamp((now - t0) / 460, 0, 1);
        place(from, idx, ease(p));
        if (p < 1) raf = requestAnimationFrame(step);
      };
      place(from, idx, 0);
      raf = requestAnimationFrame(step);
    }
    const ro = new ResizeObserver(() => place(idx, idx, 1));
    ro.observe(b);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [idx]);

  const go = (key: string) => {
    if (key === "zapsat") return onZapsat();
    if (key === active) return;
    nav.reset([{ name: "domy" }, { name: key, params: { id: houseId } }], "none");
  };

  return (
    <>
      <div className="gedge" />
      <nav className="gtab" ref={bar} aria-label="Sekce domu">
        <div className="gbub" ref={bub}>
          <div className="gl">
            <i className="gglow" />
          </div>
        </div>
        {TABS.map((t, i) => (
          <button
            key={t.key}
            type="button"
            className={`gti ${t.fab ? "gz" : ""} ${i === idx && !t.fab ? "on" : ""}`}
            onClick={() => go(t.key)}
            aria-current={i === idx && !t.fab ? "page" : undefined}
          >
            {t.fab ? (
              <span className="gfab">
                <Icon name="camera" size={20} color="#fff" sw={2.1} />
              </span>
            ) : (
              <Icon name={t.icon} size={24} sw={2} />
            )}
            <span>{t.label}</span>
          </button>
        ))}
      </nav>
    </>
  );
}
