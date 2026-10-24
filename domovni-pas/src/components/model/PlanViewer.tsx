"use client";

import {
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type Ref,
} from "react";
import type { HouseElement, HouseModel } from "@/lib/store";
import {
  bbox,
  clamp,
  clampView,
  distance,
  fitView,
  formatMeters,
  hitTest,
  hitTolerance,
  niceScaleBar,
  planSize,
  polylinePath,
  screenToPlan,
  viewBoxOf,
  zoomAt,
  type Pt,
  type View,
} from "@/lib/plan";
import { ElementShape, elementGeometry, type ShapeEmphasis } from "./ElementShape";
import { IconFit, IconMinus } from "./icons";
import { planDims } from "./model-utils";
import { IconPlus } from "@/components/Icons";

export type PlanViewerHandle = {
  fit: () => void;
  zoomBy: (factor: number) => void;
  focusOn: (points: Pt[]) => void; // px podkladu
  // posun, ať prvek nezakryje nic pod clientBottom (spodní list) ani nad clientTop (horní lišta)
  reveal: (points: Pt[], clientBottom: number, clientTop?: number) => void;
};

type Size = { w: number; h: number };

type Gesture =
  | { kind: "pan"; id: number; sx: number; sy: number; start: View; moved: boolean; touch: boolean }
  | { kind: "pinch"; startDist: number; mid: Pt; start: View };

// Celý půdorys v kontejneru
function fitWhole(w: number, h: number, s: Size): View {
  return fitView({ x: 0, y: 0, w, h }, s.w, s.h, 12);
}

// Rozsah zoomu vůči „celému půdorysu"
function kLimits(w: number, h: number, s: Size) {
  const fitK = fitWhole(w, h, s).k;
  return { min: fitK * 0.5, max: Math.max(fitK * 20, 2) };
}

// Přiblížení na prvek — vždy s kusem okolí (aspoň ~35 % podkladu), nikdy dál než celý půdorys
function focusView(points: Pt[], w: number, h: number, s: Size): View {
  const b = bbox(points);
  if (!b) return fitWhole(w, h, s);
  const size = planSize(w, h);
  const bw = Math.max(b.w * 1.6, size * 0.35);
  const bh = Math.max(b.h * 1.6, size * 0.35 * (s.h / s.w));
  const cx = b.x + b.w / 2;
  const cy = b.y + b.h / 2;
  const lim = kLimits(w, h, s);
  const fitK = fitWhole(w, h, s).k;
  const k = clamp(fitView({ x: cx - bw / 2, y: cy - bh / 2, w: bw, h: bh }, s.w, s.h).k, Math.max(fitK, lim.min), lim.max);
  return { x: cx - s.w / (2 * k), y: cy - s.h / (2 * k), k };
}

const zoomBtn =
  "grid h-10 w-10 place-items-center rounded-lg border border-stone-200 bg-white/95 text-stone-700 shadow-sm transition hover:bg-stone-50 active:bg-stone-100";

// Interaktivní půdorys: SVG nad obrázkem podkladu (viewBox = px podkladu).
// Posun tažením, zoom kolečkem / dvěma prsty / tlačítky. Klepnutí = výběr prvku, nebo bod (kreslení).
// Během gesta se pohled mění přímo v DOM (ref + requestAnimationFrame), do Reactu se uloží až na konci.
export function PlanViewer({
  model,
  elements,
  selectedId = null,
  mode = "select",
  draft,
  calibration,
  dimOthers = false,
  initialFocus,
  onSelect,
  onPlanTap,
  className = "",
  ref,
}: {
  model: HouseModel;
  elements: HouseElement[]; // viditelné prvky umístěné na tomto podkladu
  selectedId?: string | null;
  mode?: "select" | "draw";
  draft?: { points: Pt[]; color: string } | null; // px podkladu
  calibration?: Pt[] | null; // px podkladu
  dimOthers?: boolean;
  initialFocus?: Pt[] | null; // px podkladu — při prvním zobrazení přiblížit sem
  onSelect?: (id: string | null) => void;
  onPlanTap?: (p: Pt) => void;
  className?: string;
  ref?: Ref<PlanViewerHandle>;
}) {
  const { w: W, h: H } = planDims(model);

  const boxRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const viewRef = useRef<View | null>(null);
  const sizeRef = useRef<Size | null>(null);
  const rafRef = useRef(0);
  const commitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pointers = useRef(new Map<number, Pt>());
  const gesture = useRef<Gesture | null>(null);

  const [view, setView] = useState<View | null>(null);
  const [size, setSize] = useState<Size | null>(null);
  const [focus] = useState(() => initialFocus ?? null);

  const apply = useCallback(() => {
    rafRef.current = 0;
    const v = viewRef.current;
    const s = sizeRef.current;
    if (v && s && svgRef.current) svgRef.current.setAttribute("viewBox", viewBoxOf(v, s.w, s.h));
  }, []);

  // Živá změna pohledu (bez renderu Reactu)
  const setLive = useCallback(
    (v: View) => {
      const s = sizeRef.current;
      if (!s) return;
      viewRef.current = clampView(v, W, H, s.w, s.h);
      if (!rafRef.current) rafRef.current = requestAnimationFrame(apply);
    },
    [W, H, apply],
  );

  // Uložení pohledu do stavu (přepočet tlouštěk čar, měřítka)
  const commit = useCallback(() => {
    if (commitTimer.current) {
      clearTimeout(commitTimer.current);
      commitTimer.current = null;
    }
    const v = viewRef.current;
    const s = sizeRef.current;
    if (v && s) {
      setView(v);
      setSize(s);
    }
  }, []);

  const commitSoon = useCallback(() => {
    if (commitTimer.current) clearTimeout(commitTimer.current);
    commitTimer.current = setTimeout(commit, 140);
  }, [commit]);

  const setNow = useCallback(
    (v: View) => {
      setLive(v);
      commit();
    },
    [setLive, commit],
  );

  const zoomAround = useCallback(
    (factor: number, sx?: number, sy?: number) => {
      const v = viewRef.current;
      const s = sizeRef.current;
      if (!v || !s) return;
      const lim = kLimits(W, H, s);
      const k = clamp(v.k * factor, lim.min, lim.max);
      setNow(zoomAt(v, k, sx ?? s.w / 2, sy ?? s.h / 2));
    },
    [W, H, setNow],
  );

  const fit = useCallback(() => {
    const s = sizeRef.current;
    if (s) setNow(fitWhole(W, H, s));
  }, [W, H, setNow]);

  const focusOn = useCallback(
    (points: Pt[]) => {
      const s = sizeRef.current;
      if (s && points.length) setNow(focusView(points, W, H, s));
    },
    [W, H, setNow],
  );

  // Jen posun (bez zoomu), aby byl prvek vidět nad spodním listem na mobilu
  const reveal = useCallback(
    (points: Pt[], clientBottom: number, clientTop = 0) => {
      const v = viewRef.current;
      const s = sizeRef.current;
      const b = bbox(points);
      if (!v || !s || !b || !boxRef.current) return;
      const rect = boxRef.current.getBoundingClientRect();
      const top = clamp(clientTop - rect.top, 0, s.h);
      const bottom = clamp(clientBottom - rect.top, 0, s.h);
      if (bottom - top < 80) return;
      const px = b.x + b.w / 2;
      const py = b.y + b.h / 2;
      const sx = (px - v.x) * v.k;
      const sy = (py - v.y) * v.k;
      const m = 28;
      let { x, y } = v;
      if (sy < top + m || sy > bottom - m) y = py - (top + (bottom - top) * 0.45) / v.k;
      if (sx < m || sx > s.w - m) x = px - s.w / (2 * v.k);
      if (x !== v.x || y !== v.y) setNow({ ...v, x, y });
    },
    [setNow],
  );

  useImperativeHandle(
    ref,
    () => ({ fit, zoomBy: (f: number) => zoomAround(f), focusOn, reveal }),
    [fit, zoomAround, focusOn, reveal],
  );

  // Velikost kontejneru → první pohled (celý půdorys / přiblížení na prvek), při změně drží střed
  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const ro = new ResizeObserver((entries) => {
      const r = entries[0]?.contentRect;
      if (!r || r.width < 20 || r.height < 20) return;
      const s: Size = { w: r.width, h: r.height };
      const prev = sizeRef.current;
      const v = viewRef.current;
      let next: View;
      if (!v || !prev) {
        next = focus && focus.length ? focusView(focus, W, H, s) : fitWhole(W, H, s);
      } else {
        const cx = v.x + prev.w / (2 * v.k);
        const cy = v.y + prev.h / (2 * v.k);
        next = { x: cx - s.w / (2 * v.k), y: cy - s.h / (2 * v.k), k: v.k };
      }
      sizeRef.current = s;
      viewRef.current = clampView(next, W, H, s.w, s.h);
      setSize(s);
      setView(viewRef.current);
    });
    ro.observe(box);
    return () => ro.disconnect();
  }, [W, H, focus]);

  // Kolečko myši / gesto na touchpadu — nepasivní posluchač, ať nescrolluje stránka
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const onWheel = (e: WheelEvent) => {
      const v = viewRef.current;
      const s = sizeRef.current;
      if (!v || !s) return;
      e.preventDefault();
      const rect = svg.getBoundingClientRect();
      const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? s.h : 1;
      const dy = clamp(e.deltaY * unit, -240, 240);
      const factor = Math.exp(-dy * (e.ctrlKey ? 0.01 : 0.0018));
      const lim = kLimits(W, H, s);
      const k = clamp(v.k * factor, lim.min, lim.max);
      setLive(zoomAt(v, k, e.clientX - rect.left, e.clientY - rect.top));
      commitSoon();
    };
    svg.addEventListener("wheel", onWheel, { passive: false });
    return () => svg.removeEventListener("wheel", onWheel);
  }, [W, H, setLive, commitSoon]);

  useEffect(
    () => () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (commitTimer.current) clearTimeout(commitTimer.current);
    },
    [],
  );

  function tap(sx: number, sy: number) {
    const v = viewRef.current;
    if (!v) return;
    const p = screenToPlan(v, sx, sy);
    if (mode === "draw") {
      const m = planSize(W, H) * 0.02;
      if (p[0] < -m || p[1] < -m || p[0] > W + m || p[1] > H + m) return; // mimo podklad
      onPlanTap?.([clamp(p[0], 0, W), clamp(p[1], 0, H)]);
      return;
    }
    const targets = elements.map((el) => {
      const g = elementGeometry(el, W, H, model.pxPerMeter, v.k);
      return { id: el.id, points: g.points, tol: hitTolerance(g.points.length === 1, g.reach, v.k) };
    });
    onSelect?.(hitTest(p, targets));
  }

  function localPos(e: React.PointerEvent<SVGSVGElement>): Pt {
    const rect = e.currentTarget.getBoundingClientRect();
    return [e.clientX - rect.left, e.clientY - rect.top];
  }

  function onPointerDown(e: React.PointerEvent<SVGSVGElement>) {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    // myš je jen jedna — zapomenout případný „visící“ ukazatel (puštěno mimo okno)
    if (e.pointerType === "mouse") {
      pointers.current.clear();
      gesture.current = null;
    }
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }
    const pos = localPos(e);
    pointers.current.set(e.pointerId, pos);
    const v = viewRef.current;
    if (!v) return;
    if (pointers.current.size === 1) {
      gesture.current = {
        kind: "pan",
        id: e.pointerId,
        sx: pos[0],
        sy: pos[1],
        start: v,
        moved: false,
        touch: e.pointerType !== "mouse",
      };
    } else if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      gesture.current = {
        kind: "pinch",
        startDist: Math.max(distance(a, b), 1),
        mid: [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2],
        start: v,
      };
    }
  }

  function onPointerMove(e: React.PointerEvent<SVGSVGElement>) {
    if (!pointers.current.has(e.pointerId)) return;
    const pos = localPos(e);
    pointers.current.set(e.pointerId, pos);
    const g = gesture.current;
    if (!g) return;
    if (g.kind === "pan") {
      if (e.pointerId !== g.id) return;
      const dx = pos[0] - g.sx;
      const dy = pos[1] - g.sy;
      if (!g.moved) {
        if (Math.hypot(dx, dy) < (g.touch ? 9 : 4)) return; // ještě klepnutí, ne tažení
        gesture.current = { ...g, moved: true };
        e.currentTarget.style.cursor = "grabbing";
      }
      setLive({ x: g.start.x - dx / g.start.k, y: g.start.y - dy / g.start.k, k: g.start.k });
      return;
    }
    const s = sizeRef.current;
    if (!s || pointers.current.size < 2) return;
    const [a, b] = [...pointers.current.values()];
    const mid: Pt = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    const lim = kLimits(W, H, s);
    const k = clamp((g.start.k * distance(a, b)) / g.startDist, lim.min, lim.max);
    // bod podkladu pod počátečním středem prstů zůstane pod aktuálním středem
    const px = g.start.x + g.mid[0] / g.start.k;
    const py = g.start.y + g.mid[1] / g.start.k;
    setLive({ x: px - mid[0] / k, y: py - mid[1] / k, k });
  }

  function onPointerEnd(e: React.PointerEvent<SVGSVGElement>) {
    if (!pointers.current.delete(e.pointerId)) return;
    const g = gesture.current;
    if (g?.kind === "pan" && g.id === e.pointerId) {
      gesture.current = null;
      if (!g.moved && e.type === "pointerup") tap(g.sx, g.sy);
      else commit();
    } else if (g?.kind === "pinch") {
      const rest = [...pointers.current.entries()];
      const v = viewRef.current;
      if (rest.length === 1 && v) {
        // zbyl jeden prst → pokračuje posun (už ne klepnutí)
        const [id, pos] = rest[0];
        gesture.current = { kind: "pan", id, sx: pos[0], sy: pos[1], start: v, moved: true, touch: true };
      } else if (rest.length === 0) {
        gesture.current = null;
      }
      commit();
    }
    if (pointers.current.size === 0) e.currentTarget.style.cursor = "";
  }

  function onKeyDown(e: React.KeyboardEvent<SVGSVGElement>) {
    const v = viewRef.current;
    if (!v) return;
    const step = 80 / v.k;
    const moves: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step],
    };
    if (moves[e.key]) {
      e.preventDefault();
      setNow({ ...v, x: v.x + moves[e.key][0], y: v.y + moves[e.key][1] });
    } else if (e.key === "+" || e.key === "=") {
      e.preventDefault();
      zoomAround(1.4);
    } else if (e.key === "-") {
      e.preventDefault();
      zoomAround(1 / 1.4);
    } else if (e.key === "0") {
      e.preventDefault();
      fit();
    }
  }

  const k = view?.k ?? 1;
  const s = 1 / k;
  const scaleBar = model.pxPerMeter && view ? niceScaleBar(model.pxPerMeter, k) : null;
  const hasSelection = !!selectedId && elements.some((e) => e.id === selectedId);

  return (
    <div ref={boxRef} className={`relative overflow-hidden bg-stone-100 ${className}`}>
      <svg
        ref={svgRef}
        className={`absolute inset-0 h-full w-full touch-none select-none outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal-600 ${
          mode === "draw" ? "cursor-crosshair" : "cursor-grab"
        }`}
        viewBox={view && size ? viewBoxOf(view, size.w, size.h) : `0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid meet"
        tabIndex={0}
        role="application"
        aria-label={`Půdorys ${model.title}. Posun tažením nebo šipkami, přiblížení kolečkem, dvěma prsty nebo klávesami + a −.`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
        onLostPointerCapture={onPointerEnd}
        onKeyDown={onKeyDown}
      >
        {view && (
          <>
            <rect x={0} y={0} width={W} height={H} fill="#ffffff" />
            {model.dataUrl && (
              <image href={model.dataUrl} x={0} y={0} width={W} height={H} preserveAspectRatio="none" />
            )}
            <rect x={0} y={0} width={W} height={H} fill="none" stroke="#d6d3d1" strokeWidth={s} />
            <ElementsLayer
              elements={elements}
              width={W}
              height={H}
              pxPerMeter={model.pxPerMeter}
              k={k}
              selectedId={hasSelection ? selectedId : null}
              dimOthers={dimOthers}
            />
            {draft && draft.points.length > 0 && <DraftShape points={draft.points} color={draft.color} k={k} />}
            {calibration && calibration.length > 0 && <CalibrationShape points={calibration} k={k} />}
          </>
        )}
      </svg>

      <div className="absolute right-2 top-2 flex flex-col gap-1.5">
        <button type="button" className={zoomBtn} onClick={() => zoomAround(1.5)} aria-label="Přiblížit" title="Přiblížit">
          <IconPlus className="h-5 w-5" />
        </button>
        <button type="button" className={zoomBtn} onClick={() => zoomAround(1 / 1.5)} aria-label="Oddálit" title="Oddálit">
          <IconMinus className="h-5 w-5" />
        </button>
        <button type="button" className={zoomBtn} onClick={fit} aria-label="Celý půdorys" title="Celý půdorys">
          <IconFit className="h-5 w-5" />
        </button>
      </div>

      {scaleBar && scaleBar.px > 0 && (
        <div className="pointer-events-none absolute bottom-2 left-2 rounded-md bg-white/90 px-2 py-1 shadow-sm">
          <div
            className="h-1.5 border-x-2 border-b-2 border-stone-700"
            style={{ width: `${Math.round(scaleBar.px)}px` }}
          />
          <p className="mt-0.5 text-[11px] font-medium leading-none text-stone-700">
            {formatMeters(scaleBar.meters)}
          </p>
        </div>
      )}
    </div>
  );
}

// Prvky — trasy pod zařízeními, vybraný nahoře. Překreslí se jen při změně dat nebo zoomu.
const ElementsLayer = memo(function ElementsLayer({
  elements,
  width,
  height,
  pxPerMeter,
  k,
  selectedId,
  dimOthers,
}: {
  elements: HouseElement[];
  width: number;
  height: number;
  pxPerMeter?: number;
  k: number;
  selectedId: string | null;
  dimOthers: boolean;
}) {
  const routes = elements.filter((e) => e.id !== selectedId && (e.plan?.points.length ?? 0) > 1);
  const points = elements.filter((e) => e.id !== selectedId && e.plan?.points.length === 1);
  const selected = selectedId ? elements.find((e) => e.id === selectedId) : undefined;
  const rest: ShapeEmphasis = dimOthers || selected ? "dim" : "normal";
  return (
    <g>
      {[...routes, ...points].map((el) => (
        <ElementShape
          key={el.id}
          element={el}
          width={width}
          height={height}
          pxPerMeter={pxPerMeter}
          k={k}
          emphasis={rest}
        />
      ))}
      {selected && (
        <ElementShape
          element={selected}
          width={width}
          height={height}
          pxPerMeter={pxPerMeter}
          k={k}
          emphasis={dimOthers ? "dim" : "selected"}
        />
      )}
    </g>
  );
});

// Rozpracovaná poloha (režim umísťování): body a lomená čára
function DraftShape({ points, color, k }: { points: Pt[]; color: string; k: number }) {
  const s = 1 / k;
  return (
    <g pointerEvents="none">
      {points.length > 1 && (
        <>
          <path
            d={polylinePath(points)}
            fill="none"
            stroke="#ffffff"
            strokeWidth={6 * s}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={polylinePath(points)}
            fill="none"
            stroke={color}
            strokeWidth={3 * s}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}
      {points.map(([x, y], i) => {
        const last = i === points.length - 1;
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={(last ? 8 : 6) * s}
            fill={last ? color : "#ffffff"}
            stroke={last ? "#ffffff" : color}
            strokeWidth={2.5 * s}
          />
        );
      })}
    </g>
  );
}

// Kalibrace měřítka: dva body a spojnice
function CalibrationShape({ points, k }: { points: Pt[]; k: number }) {
  const s = 1 / k;
  const ink = "#2a211e";
  return (
    <g pointerEvents="none">
      {points.length === 2 && (
        <>
          <path d={polylinePath(points)} stroke="#ffffff" strokeWidth={6 * s} strokeLinecap="round" />
          <path
            d={polylinePath(points)}
            stroke={ink}
            strokeWidth={2.5 * s}
            strokeDasharray={`${8 * s} ${5 * s}`}
            strokeLinecap="round"
          />
        </>
      )}
      {points.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={9 * s} fill="#ffffff" fillOpacity={0.85} stroke={ink} strokeWidth={2 * s} />
          <path
            d={`M${x - 6 * s} ${y}H${x + 6 * s}M${x} ${y - 6 * s}V${y + 6 * s}`}
            stroke={ink}
            strokeWidth={1.5 * s}
          />
        </g>
      ))}
    </g>
  );
}
