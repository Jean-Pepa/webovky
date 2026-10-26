"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { AR } from "./data";
import { Icon, type IconName } from "./icons";
import { useActive } from "./nav";

// Simulované AR nad snímkem technické místnosti (1920 × 1080).
// Značky a trasy jsou „ukotvené“ k pixelům snímku; prst (nebo natočení telefonu) otáčí pohledem.

export type ArMode = "kotel" | "unik";

interface Cam {
  cx: number;
  cy: number;
  h: number;
}

const IW = 1920;
const IH = 1080;
const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, x));
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export interface Pin {
  k: string;
  name: string;
  col: string;
  ic: IconName;
  at: [number, number];
  main?: boolean;
  lab?: "right" | "below";
  layer: "topeni" | "voda" | "pozar";
}

export const PINS: Record<ArMode, Pin[]> = {
  kotel: [
    { k: "valve", name: "Uzávěr vody", col: "#2F7FD8", ic: "drop", at: AR.valve, lab: "below", layer: "voda" },
    { k: "ext", name: "Hasicí přístroj", col: "#C0392B", ic: "ext", at: AR.ext, lab: "right", layer: "pozar" },
    { k: "kotel", name: "Kotel", col: "#B5543A", ic: "flame", at: AR.kotel, main: true, layer: "topeni" },
  ],
  unik: [
    { k: "kotel", name: "Kotel", col: "#B5543A", ic: "flame", at: AR.kotel, lab: "right", layer: "topeni" },
    { k: "ext", name: "Hasicí přístroj", col: "#C0392B", ic: "ext", at: AR.ext, lab: "right", layer: "pozar" },
    { k: "valve", name: "Uzávěr · zavřen", col: "#2F7FD8", ic: "drop", at: AR.valve, lab: "below", layer: "voda" },
    { k: "leak", name: "Možný únik", col: "#C0392B", ic: "excl", at: AR.leak, main: true, layer: "voda" },
  ],
};

export const ROUTES = [
  { k: "water", col: "#2F7FD8", t0: 0.8, d: 1.1, name: "Voda", det: "od vodoměru ke kotli", acc: "±2 cm", layer: "voda" },
  { k: "heat_s", col: "#C0392B", t0: 1.1, d: 1.1, name: "Topení", det: "v podlaze ke koupelně", acc: "±2 cm", layer: "topeni" },
  { k: "heat_r", col: "#C0392B", t0: 1.2, d: 1.1, op: 0.55, layer: "topeni" },
  { k: "el", col: "#E0791A", t0: 2.7, d: 0.8, name: "Elektro F7", det: "ze stropu k zásuvce", acc: "±1 cm", layer: "topeni" },
  { k: "el_k", col: "#E0791A", t0: 3.3, d: 0.4, layer: "topeni" },
  { k: "gas", col: "#F2C21B", t0: 3.0, d: 0.9, name: "Plyn", det: "85 cm nad podlahou", acc: "±2 cm", layer: "topeni" },
] as { k: string; col: string; t0: number; d: number; name?: string; det?: string; acc?: string; op?: number; layer: string }[];

const START: Record<ArMode, Cam> = { kotel: { cx: 1150, cy: 540, h: 1066 }, unik: { cx: 930, cy: 540, h: 1066 } };
const TARGET: Record<ArMode, Cam> = { kotel: { cx: 880, cy: 490, h: 860 }, unik: { cx: 1215, cy: 640, h: 860 } };
const ROUTE_CAM: Record<ArMode, Cam> = { kotel: { cx: 900, cy: 560, h: 1066 }, unik: { cx: 1120, cy: 560, h: 1066 } };

function partial(pts: [number, number][], f: number): [number, number][] {
  if (f <= 0 || pts.length < 2) return [];
  const seg: number[] = [];
  let L = 0;
  for (let i = 1; i < pts.length; i++) {
    const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    seg.push(d);
    L += d;
  }
  let target = L * clamp(f, 0, 1);
  const out: [number, number][] = [pts[0]];
  for (let i = 1; i < pts.length; i++) {
    if (target >= seg[i - 1]) {
      out.push(pts[i]);
      target -= seg[i - 1];
    } else {
      const t = target / seg[i - 1];
      out.push([lerp(pts[i - 1][0], pts[i][0], t), lerp(pts[i - 1][1], pts[i][1], t)]);
      break;
    }
  }
  return out;
}

export function ArView({
  mode,
  stage,
  filter,
  onMain,
  gyro,
  children,
  onDistance,
}: {
  mode: ArMode;
  stage: "find" | "card" | "routes";
  filter: string;
  onMain: () => void;
  gyro: boolean;
  children?: ReactNode;
  onDistance?: (m: number, dir: "vlevo" | "vpravo" | "před vámi") => void;
}) {
  const active = useActive();
  const box = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 390, h: 844 });
  const [cam, setCam] = useState<Cam>(START[mode]);
  const [rt, setRt] = useState(0); // čas animace tras
  const [t, setT] = useState(0); // pulz
  const anim = useRef<{ from: Cam | null; to: Cam; t0: number; dur: number } | null>(null);
  const touched = useRef(false);
  const ptrs = useRef(new Map<number, [number, number]>());
  const pinch = useRef<{ d0: number; h0: number } | null>(null);
  const gyro0 = useRef<{ a: number; b: number; cam: Cam | null } | null>(null);

  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setSize({ w: el.clientWidth || 390, h: el.clientHeight || 844 }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Úvodní najetí na cíl (jako ve videu), dokud uživatel sám neotočí pohled.
  useEffect(() => {
    if (!active) return;
    const id = setTimeout(() => {
      if (!touched.current) anim.current = { from: START[mode], to: TARGET[mode], t0: performance.now(), dur: 2600 };
    }, 700);
    return () => clearTimeout(id);
  }, [active, mode]);

  // Při rozvodech se pohled oddálí, aby byly vidět trasy.
  useEffect(() => {
    if (stage === "routes") anim.current = { from: null, to: ROUTE_CAM[mode], t0: performance.now(), dur: 900 };
    else if (stage === "card") anim.current = { from: null, to: TARGET[mode], t0: performance.now(), dur: 700 };
  }, [stage, mode]);

  useEffect(() => {
    if (!active) return;
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      setT((x) => x + dt);
      setRt((x) => (stage === "routes" ? Math.min(8, x + dt) : 0));
      const a = anim.current;
      if (a) {
        const p = clamp((now - a.t0) / a.dur, 0, 1);
        const e = ease(p);
        setCam((c) => {
          if (!a.from) a.from = c;
          const f = a.from;
          return { cx: lerp(f.cx, a.to.cx, e), cy: lerp(f.cy, a.to.cy, e), h: lerp(f.h, a.to.h, e) };
        });
        if (p >= 1) anim.current = null;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [active, stage]);

  // Natočení telefonu (gyroskop) posouvá pohled.
  useEffect(() => {
    if (!gyro || !active) return;
    const on = (e: DeviceOrientationEvent) => {
      if (e.alpha == null || e.beta == null) return;
      if (!gyro0.current) {
        gyro0.current = { a: e.alpha, b: e.beta, cam: null };
        return;
      }
      touched.current = true;
      anim.current = null;
      const g0 = gyro0.current;
      let da = e.alpha - g0.a;
      if (da > 180) da -= 360;
      if (da < -180) da += 360;
      const db = e.beta - g0.b;
      setCam((c) => {
        if (!g0.cam) g0.cam = c;
        return { ...c, cx: g0.cam.cx - da * 22, cy: g0.cam.cy - db * 16 };
      });
    };
    window.addEventListener("deviceorientation", on);
    return () => {
      window.removeEventListener("deviceorientation", on);
      gyro0.current = null;
    };
  }, [gyro, active]);

  // Přepočet kamery → obrazovka
  const W = size.w;
  const H = size.h;
  let h = clamp(cam.h, 520, IH);
  let w = (h * W) / H;
  if (w > IW) {
    w = IW;
    h = (w * H) / W;
  }
  const cx = clamp(cam.cx, w / 2 + 8, IW - w / 2 - 8);
  const cy = clamp(cam.cy, h / 2 + 4, IH - h / 2 - 4);
  const s = H / h;
  const x0 = cx - w / 2;
  const y0 = cy - h / 2;
  const map = (p: [number, number]): [number, number] => [(p[0] - x0) * s, (p[1] - y0) * s];
  const near = mode === "unik" ? [3.2, 2.1] : [1.9, 1.2];
  const q = clamp((1066 - h) / (1066 - 860), 0, 1);
  const main = PINS[mode].find((p) => p.main)!;
  const mp = map(main.at);
  const off = mp[0] < W * 0.2 ? "vlevo" : mp[0] > W * 0.8 ? "vpravo" : "před vámi";
  const dist = lerp(near[0], near[1], q) + (off === "před vámi" ? 0 : 0.4);
  const distRef = useRef("");
  useEffect(() => {
    const key = `${dist.toFixed(1)}|${off}`;
    if (key !== distRef.current) {
      distRef.current = key;
      onDistance?.(dist, off as "vlevo" | "vpravo" | "před vámi");
    }
  });

  const onDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("[data-pin]")) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    ptrs.current.set(e.pointerId, [e.clientX, e.clientY]);
    touched.current = true;
    anim.current = null;
    if (ptrs.current.size === 2) {
      const [a, b] = [...ptrs.current.values()];
      pinch.current = { d0: Math.hypot(a[0] - b[0], a[1] - b[1]), h0: cam.h };
    }
  };
  const onMove = (e: React.PointerEvent) => {
    const p = ptrs.current.get(e.pointerId);
    if (!p) return;
    const k = e.currentTarget.getBoundingClientRect().width / W || 1;
    const dx = (e.clientX - p[0]) / k;
    const dy = (e.clientY - p[1]) / k;
    ptrs.current.set(e.pointerId, [e.clientX, e.clientY]);
    if (ptrs.current.size === 2 && pinch.current) {
      const [a, b] = [...ptrs.current.values()];
      const d = Math.hypot(a[0] - b[0], a[1] - b[1]);
      setCam((c) => ({ ...c, h: clamp((pinch.current!.h0 * pinch.current!.d0) / d, 560, IH) }));
    } else setCam((c) => ({ ...c, cx: c.cx - dx / s, cy: c.cy - dy / s }));
  };
  const onUp = (e: React.PointerEvent) => {
    ptrs.current.delete(e.pointerId);
    if (ptrs.current.size < 2) pinch.current = null;
  };

  const show = (layer: string) => filter === "vse" || filter === layer;
  const sel = stage !== "find";

  // SVG: obrys kotle, trasy, únik
  let svg: ReactNode[] = [];
  if (stage !== "routes" && mode === "kotel" && sel) {
    svg.push(<polygon key="hull" points={AR.hull.map(map).map((p) => p.join(",")).join(" ")} fill="#B5543A" fillOpacity={0.18} stroke="#FFFFFF" strokeOpacity={0.95} strokeWidth={3} strokeLinejoin="round" />);
  }
  const labels: ReactNode[] = [];
  if (stage === "routes") {
    for (const r of ROUTES) {
      if (!show(r.layer) && !(mode === "unik" && r.k === "water")) continue;
      const f = clamp((rt - r.t0 * 0.6) / r.d, 0, 1);
      const pts = partial(AR.routes[r.k].map(map), f);
      if (pts.length < 2) continue;
      const op = (r.op ?? 1) * (mode === "unik" && r.k !== "water" ? 0.45 : 1);
      const P = pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
      svg.push(
        <g key={r.k}>
          <polyline points={P} fill="none" stroke={r.col} strokeOpacity={0.22 * op} strokeWidth={22} strokeLinejoin="round" strokeLinecap="round" />
          <polyline points={P} fill="none" stroke="rgba(0,0,0,0.45)" strokeWidth={8.5} strokeLinejoin="round" strokeLinecap="round" />
          <polyline points={P} fill="none" stroke={r.col} strokeOpacity={op} strokeWidth={5} strokeLinejoin="round" strokeLinecap="round" />
        </g>,
      );
      if (r.name && AR.labels[r.k]) {
        const L = map(AR.labels[r.k]);
        const a = clamp((rt - r.t0 * 0.6 - r.d * 0.6) / 0.35, 0, 1) * clamp(Math.min(L[0] + 20, W + 20 - L[0], L[1] - 150, H - 14 - L[1]) / 30, 0, 1);
        if (a > 0) {
          const lw = Math.max((r.name.length + (r.acc ?? "").length) * 7.6 + 52, (r.det ?? "").length * 6.7 + 26);
          const lx = clamp(L[0] - lw / 2, 8, W - 8 - lw);
          labels.push(
            <div key={`l-${r.k}`} style={{ position: "absolute", left: lx, top: L[1] - 64, width: lw, opacity: a, padding: "7px 11px", borderRadius: 14, background: "rgba(255,255,255,0.96)", boxShadow: "0 6px 16px rgba(0,0,0,0.22)", display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 700, color: "#141414" }}>
                <span style={{ width: 10, height: 10, borderRadius: 5, background: r.col, flex: "none" }} />
                {r.name}
                <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 700, color: "#2E7D4F", background: "#E4F1E8", borderRadius: 8, padding: "2px 7px" }}>{r.acc}</span>
              </span>
              <span style={{ fontSize: 12, color: "#6F6A65", whiteSpace: "nowrap" }}>{r.det}</span>
            </div>,
          );
          labels.push(<span key={`d-${r.k}`} style={{ position: "absolute", left: L[0] - 6, top: L[1] - 6, width: 12, height: 12, borderRadius: 6, background: "#fff", border: `3px solid ${r.col}`, opacity: a }} />);
        }
      }
    }
    if (mode === "unik") {
      const L = map(AR.leak);
      const ph = (t * 0.9) % 1;
      const la = clamp((rt - 0.5) / 0.4, 0, 1);
      svg.push(
        <g key="leak" opacity={la}>
          <circle cx={L[0]} cy={L[1]} r={10 + 26 * ph} fill="none" stroke="#E5533D" strokeWidth={3} opacity={0.85 * (1 - ph)} />
          <circle cx={L[0]} cy={L[1]} r={9} fill="#E5533D" stroke="#FFFFFF" strokeWidth={3} />
        </g>,
      );
      if (la > 0)
        labels.push(
          <div key="leak-l" style={{ position: "absolute", left: clamp(L[0] - 104, 8, W - 216), top: L[1] - 74, width: 208, opacity: la, padding: "7px 11px", borderRadius: 14, background: "#E5533D", color: "#fff", boxShadow: "0 6px 16px rgba(0,0,0,0.25)", display: "flex", flexDirection: "column", gap: 1 }}>
            <b style={{ fontSize: 14 }}>Možný únik</b>
            <span style={{ fontSize: 12, opacity: 0.92 }}>koleno přívodu · 70 cm nad podlahou</span>
          </div>,
        );
    }
  }
  if (stage === "routes" && filter !== "vse") svg = svg.filter(Boolean);

  // Značky
  const pins =
    stage === "routes"
      ? null
      : PINS[mode]
          .filter((p) => p.main || show(p.layer))
          .map((d) => {
            const [X, Y] = map(d.at);
            if (!d.main && (X < -26 || X > W + 26)) return null;
            const dim = d.main ? 1 : sel ? 0.3 : 1;
            const r = d.main ? 27 : 20;
            const stem = d.main ? 28 : 18;
            const dot = d.main ? 14 : 10;
            const lab = d.main ? `${d.name} · ${dist.toFixed(1).replace(".", ",")} m` : d.name;
            const lh = d.main ? 32 : 26;
            const fs = d.main ? 15 : 13;
            const lw = lab.length * (d.main ? 8.2 : 7.3) + (d.main ? 26 : 22);
            let lx: number;
            let ly: number;
            if (d.lab === "below") {
              lx = -lw / 2;
              ly = 12;
            } else {
              lx = r + 8;
              ly = -(stem + 2 + r) - lh / 2;
              if (X + lx + lw > W - 8) lx = -(r + 8 + lw);
            }
            if (d.main) lx = clamp(X + lx, 8, W - 8 - lw) - X;
            const ph = (t * 0.8) % 1;
            return (
              <div key={d.k} style={{ position: "absolute", left: X, top: Y, width: 0, height: 0, opacity: dim, transition: "opacity 300ms" }}>
                <span style={{ position: "absolute", left: -dot / 2, top: -dot / 2, width: dot, height: dot, borderRadius: "50%", background: "#fff", border: `3px solid ${d.col}` }} />
                <span style={{ position: "absolute", left: -1, top: -(stem + 2), width: 2, height: stem, background: "rgba(255,255,255,0.92)" }} />
                {d.main && !sel && <span style={{ position: "absolute", left: -(8 + 20 * ph), top: -(stem + 2 + r) - (8 + 20 * ph), width: 2 * (8 + 20 * ph), height: 2 * (8 + 20 * ph), borderRadius: "50%", border: "2.5px solid #fff", opacity: 0.75 * (1 - ph) }} />}
                <button
                  type="button"
                  data-pin
                  aria-label={d.main ? `${d.name}, otevřít kartu` : d.name}
                  onClick={d.main ? onMain : undefined}
                  style={{ position: "absolute", left: -r, top: -(stem + 2 + 2 * r), width: 2 * r, height: 2 * r, borderRadius: "50%", background: d.main ? d.col : "#fff", border: "3px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 18px rgba(0,0,0,0.35)", transform: `scale(${d.main && sel ? 1.12 : 1})`, transformOrigin: "50% 100%", transition: "transform 300ms" }}
                >
                  <Icon name={d.ic} size={d.main ? 24 : 20} color={d.main ? "#fff" : d.col} sw={2.2} />
                </button>
                <span style={{ position: "absolute", left: lx, top: ly, height: lh, padding: `0 ${d.main ? 12 : 10}px`, borderRadius: lh / 2, background: d.main ? "#fff" : "rgba(20,20,20,0.62)", color: d.main ? "#141414" : "#fff", fontSize: fs, fontWeight: d.main ? 700 : 600, display: "flex", alignItems: "center", whiteSpace: "nowrap", boxShadow: "0 4px 12px rgba(0,0,0,0.18)", pointerEvents: "none" }}>
                  {lab}
                </span>
              </div>
            );
          });

  return (
    <div ref={box} style={{ position: "absolute", inset: 0, overflow: "hidden", touchAction: "none", background: "#111" }} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
      <img
        src={mode === "unik" ? "/aplikace/img/door_feed_leak.jpg" : "/aplikace/img/door_feed.jpg"}
        alt="Technická místnost"
        draggable={false}
        style={{ position: "absolute", left: 0, top: 0, width: IW, height: IH, maxWidth: "none", transformOrigin: "0 0", transform: `translate(${(-x0 * s).toFixed(2)}px, ${(-y0 * s).toFixed(2)}px) scale(${s.toFixed(5)})`, userSelect: "none" }}
      />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(0,0,0,0.45) 0%,rgba(0,0,0,0) 21%,rgba(0,0,0,0) 74%,rgba(0,0,0,0.3) 100%)", pointerEvents: "none" }} />
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}>
        {svg}
      </svg>
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <div style={{ pointerEvents: "auto" }}>{pins}</div>
        {labels}
      </div>
      {children}
    </div>
  );
}

// Trasy ve zdi u kotle (fotka 780 × 1690, souřadnice z návrhu jsou v polovičním měřítku).
export function WallView({ children }: { children?: ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  const active = useActive();
  const [size, setSize] = useState({ w: 390, h: 844 });
  const [t, setT] = useState(0);
  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setSize({ w: el.clientWidth || 390, h: el.clientHeight || 844 }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const t0 = performance.now();
    const loop = (now: number) => {
      const x = (now - t0) / 1000;
      setT(x);
      if (x < 3) raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [active]);
  const k = Math.max(size.w / 780, size.h / 1690);
  const ox = (size.w - 780 * k) / 2;
  const oy = (size.h - 1690 * k) / 2;
  const m = (p: [number, number]): [number, number] => [ox + p[0] * 2 * k, oy + p[1] * 2 * k];
  const pm = 744 * 2 * k; // px na metr v souřadnicích obrazovky
  const band = (pts: [number, number][], col: string, f: number, key: string) => {
    const pp = partial(pts.map(m), f);
    if (pp.length < 2) return null;
    const P = pp.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
    return (
      <g key={key}>
        <polyline points={P} fill="none" stroke={col} strokeOpacity={0.22} strokeWidth={0.1 * pm} strokeLinejoin="round" />
        <polyline points={P} fill="none" stroke="rgba(0,0,0,0.55)" strokeWidth={9} strokeLinejoin="round" strokeLinecap="round" />
        <polyline points={P} fill="none" stroke={col} strokeWidth={5.5} strokeLinejoin="round" strokeLinecap="round" />
      </g>
    );
  };
  const fg = clamp((t - 0.2) / 0.9, 0, 1);
  const fe = clamp((t - 0.8) / 0.8, 0, 1);
  const lab = clamp((t - 1.5) / 0.5, 0, 1);
  const gas = AR_WALL.gas;
  const cable = AR_WALL.cable;
  const sock = m(AR_WALL.socket);
  const gl = m(gas[1]);
  const el = m(cable[1]);
  return (
    <div ref={box} style={{ position: "absolute", inset: 0, overflow: "hidden", background: "#111" }}>
      <img src="/aplikace/img/feed_wall.jpg" alt="Stěna u kotle" style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      <svg width={size.w} height={size.h} style={{ position: "absolute", left: 0, top: 0 }}>
        {band(gas, "#F2C21B", fg, "gas")}
        {band(cable, "#E0791A", fe, "el")}
        {fe > 0.9 && <circle cx={sock[0]} cy={sock[1]} r={16} fill="none" stroke="#E0791A" strokeWidth={3.5} />}
      </svg>
      <span className="chip" style={{ position: "absolute", left: clamp(gl[0], 20, size.w - 120) - 10, top: gl[1] - 50, opacity: clamp(lab * 2, 0, 1), background: "#fff", color: "#141414" }}>
        Plyn ve zdi
      </span>
      <span className="chip" style={{ position: "absolute", left: el[0] + 16, top: el[1] - 120, opacity: clamp(lab * 2 - 0.6, 0, 1), background: "#fff", color: "#141414" }}>
        Elektro F7
      </span>
      {children}
    </div>
  );
}

const AR_WALL = {
  gas: [[524, 587], [33, 584], [-254, 583], [-244, 1246]] as [number, number][],
  cable: [[146, -899], [148, 221]] as [number, number][],
  socket: [147, 254] as [number, number],
};
