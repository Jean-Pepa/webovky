"use client";

import type { ReactNode } from "react";
import { PLAN_PATHS, PLAN_RECTS, PLAN_TEXTS } from "./data";

// Půdorys 1. NP chaty Loučky (z návrhu), přes něj se kreslí značky a trasy.
export function Plan({
  children,
  label = "Půdorys 1. NP chaty",
  onPoint,
  height,
}: {
  children?: ReactNode;
  label?: string;
  onPoint?: (x: number, y: number) => void;
  height?: number;
}) {
  return (
    <svg
      role="img"
      aria-label={label}
      viewBox="0 0 346 271"
      style={{ width: "100%", maxWidth: 346, height: height ?? "auto", display: "block", margin: "0 auto", touchAction: onPoint ? "none" : undefined, cursor: onPoint ? "crosshair" : undefined }}
      onPointerDown={
        onPoint
          ? (e) => {
              const svg = e.currentTarget;
              const pt = svg.createSVGPoint();
              pt.x = e.clientX;
              pt.y = e.clientY;
              const m = svg.getScreenCTM();
              if (!m) return;
              const p = pt.matrixTransform(m.inverse());
              onPoint(p.x, p.y);
            }
          : undefined
      }
    >
      {PLAN_RECTS.map(([x, y, w, h, f], i) => (
        <rect key={`r${i}`} x={x} y={y} width={w} height={h} fill={f} rx={i === 0 ? 2 : undefined} />
      ))}
      {PLAN_PATHS.map(([d, c, sw], i) => (
        <path key={`p${i}`} d={d} stroke={c} strokeWidth={sw} />
      ))}
      {PLAN_TEXTS.map(([x, y, t], i) => (
        <text key={`t${i}`} x={x} y={y} textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="11" fill="#6F6A65">
          {t}
        </text>
      ))}
      {children}
    </svg>
  );
}

export function PlanPin({
  x,
  y,
  n,
  color,
  big,
  halo,
  label,
  labelSide = "right",
  onClick,
  pulse,
}: {
  x: number;
  y: number;
  n?: number | string;
  color: string;
  big?: boolean;
  halo?: boolean;
  label?: string;
  labelSide?: "right" | "below" | "left";
  onClick?: () => void;
  pulse?: boolean;
}) {
  const r = big ? 14 : 12;
  const lw = label ? Math.max(56, label.length * 7.6 + 20) : 0;
  let lx = x + 20;
  let ly = y + 8;
  if (labelSide === "below") {
    lx = x - lw / 2;
    ly = y + 22;
  } else if (labelSide === "left") {
    lx = x - 20 - lw;
    ly = y + 8;
  }
  lx = Math.max(4, Math.min(342 - lw, lx));
  return (
    <g onClick={onClick} style={{ cursor: onClick ? "pointer" : undefined }}>
      {halo && <circle cx={x} cy={y} r={22} fill={color} fillOpacity={0.18} />}
      {pulse && (
        <circle cx={x} cy={y} r={12} fill={color} fillOpacity={0.25}>
          <animate attributeName="r" values="12;30" dur="1.6s" repeatCount="indefinite" />
          <animate attributeName="fill-opacity" values="0.3;0" dur="1.6s" repeatCount="indefinite" />
        </circle>
      )}
      <circle cx={x} cy={y} r={r} fill={color} stroke="#FFFFFF" strokeWidth={3} />
      {n !== undefined && (
        <text x={x} y={y + 4} textAnchor="middle" fontFamily="Inter" fontSize="11" fontWeight="700" fill="#FFFFFF">
          {n}
        </text>
      )}
      {label && (
        <g>
          <rect x={lx} y={ly} width={lw} height={26} rx={13} fill="#141414" />
          <text x={lx + lw / 2} y={ly + 17} textAnchor="middle" fontFamily="Inter" fontSize="13" fontWeight="600" fill="#FFFFFF">
            {label}
          </text>
        </g>
      )}
      {onClick && <circle cx={x} cy={y} r={22} fill="transparent" />}
    </g>
  );
}
