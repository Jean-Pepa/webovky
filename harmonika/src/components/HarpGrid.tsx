"use client";

import { useState } from "react";
import { ACTION_LABEL, posKey, type Action, type Hole } from "@/lib/harmonica";
import { SHARP_NAMES, mod12, midiName, type Pattern } from "@/lib/music";

export type Detect = { midi: number; cents: number; color: string } | null;

const TOP: Action[] = ["blowSlide", "blow"];
const BOTTOM: Action[] = ["draw", "drawSlide"];

export function cellLabel(midi: number, pattern: Pattern | null, labels: "notes" | "degrees") {
  const pc = mod12(midi);
  const inP = pattern?.pcs.has(pc);
  if (labels === "degrees" && inP) return pattern!.degreeByPc.get(pc) ?? "";
  if (inP) return pattern!.nameByPc.get(pc) ?? SHARP_NAMES[pc];
  return SHARP_NAMES[pc];
}

export default function HarpGrid({
  layout,
  pattern,
  labels = "notes",
  playingKey = null,
  pickedKeys,
  detect = null,
  onTap,
  compact = false,
  range,
}: {
  layout: Hole[];
  pattern: Pattern | null;
  labels?: "notes" | "degrees";
  playingKey?: string | null;
  pickedKeys?: Set<string>;
  detect?: Detect;
  onTap?: (midi: number, hole: number, action: Action) => void;
  compact?: boolean;
  range?: [number, number];
}) {
  const [flash, setFlash] = useState<{ k: string; n: number } | null>(null);

  const renderCell = (h: Hole, a: Action) => {
    const midi = h[a];
    const pc = mod12(midi);
    const k = posKey({ hole: h.hole, action: a });
    const kind = !pattern ? "in" : pc === pattern.rootPc ? "root" : pattern.pcs.has(pc) ? "in" : "out";
    const text = cellLabel(midi, pattern, labels);
    const cls = [
      "cell",
      kind,
      text.length > 2 ? "small-label" : "",
      playingKey === k ? "playing" : "",
      pickedKeys?.has(k) ? "picked" : "",
      flash?.k === k ? "flash" : "",
    ]
      .filter(Boolean)
      .join(" ");
    const showLine = detect && detect.midi === midi;
    return (
      <div className="cell-slot" key={a}>
        <button
          key={flash?.k === k ? `f${flash.n}` : "c"}
          type="button"
          className={cls}
          data-pos={k}
          aria-label={`${text} (${midiName(midi)}) – hole ${h.hole} ${ACTION_LABEL[a]}`}
          onPointerDown={(e) => {
            if (e.pointerType === "mouse" && e.button !== 0) return;
            setFlash((f) => ({ k, n: (f?.n ?? 0) + 1 }));
            onTap?.(midi, h.hole, a);
          }}
        >
          {text}
          {showLine && (
            <span
              className="pitch-line"
              style={{ top: `${Math.max(6, Math.min(94, 50 - detect.cents))}%`, background: detect.color }}
            />
          )}
        </button>
      </div>
    );
  };

  return (
    <div className="grid-wrap">
      <div className={`harp ${compact ? "compact" : ""}`} style={{ ["--n" as string]: layout.length }}>
        <div className="harp-labels">
          <div>Slide</div>
          <div>Blow</div>
          <div />
          <div>Draw</div>
          <div>Slide</div>
        </div>
        <div className="harp-holes">
          {layout.map((h, i) => {
            const divider = i > 0 && layout[i - 1].group !== h.group;
            const dim = range ? h.hole < range[0] || h.hole > range[1] : false;
            return (
              <div key={h.hole} className={`hole-col ${divider ? "divider" : ""} ${dim ? "dim" : ""}`}>
                {TOP.map((a) => renderCell(h, a))}
                <div className="hole-num">{h.hole}</div>
                {BOTTOM.map((a) => renderCell(h, a))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
