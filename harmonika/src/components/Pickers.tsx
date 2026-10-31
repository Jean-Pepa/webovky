"use client";

import { HOLE_OPTIONS, holesRange } from "@/lib/harmonica";
import { ARPEGGIOS, HARP_KEYS, KEY_ROWS, SCALES, type Mode, type PatternDef } from "@/lib/music";

export function HolesPicker({ value, onPick }: { value: number; onPick: (v: number) => void }) {
  return (
    <div style={{ width: 300 }}>
      <div className="pick-title">Holes</div>
      <div className="pick-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
        {HOLE_OPTIONS.map((h) => (
          <button key={h} type="button" className={`pick-btn lime ${h === value ? "sel" : ""}`} onClick={() => onPick(h)}>
            {h} holes
            <span className="sub">{holesRange(h)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function HarpKeyPicker({ value, onPick }: { value: string; onPick: (v: string) => void }) {
  return (
    <div style={{ width: 320 }}>
      <div className="pick-title">Harmonica key</div>
      <div className="pick-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
        {HARP_KEYS.map((k) => (
          <button
            key={k.name}
            type="button"
            className={`pick-btn cyan ${k.name === value ? "sel" : ""}`}
            onClick={() => onPick(k.name)}
          >
            {k.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export function KeyPicker({ value, onPick }: { value: string; onPick: (v: string) => void }) {
  return (
    <div style={{ width: 380 }}>
      <div className="pick-title">Key</div>
      <div className="pick-grid" style={{ gridTemplateColumns: "repeat(7, 1fr)" }}>
        {KEY_ROWS.flat().map((k, i) =>
          k ? (
            <button
              key={k}
              type="button"
              className={`pick-btn orange ${k === value ? "sel" : ""}`}
              onClick={() => onPick(k)}
              style={{ padding: "6px 2px" }}
            >
              {k}
            </button>
          ) : (
            <span key={`e${i}`} className="pick-btn ghost" />
          ),
        )}
      </div>
    </div>
  );
}

function formula(def: PatternDef) {
  return def.intervals.join(" ");
}

export function PatternPicker({
  mode,
  value,
  keyName,
  onPick,
}: {
  mode: Mode;
  value: string;
  keyName: string;
  onPick: (id: string) => void;
}) {
  const list = mode === "scale" ? SCALES : ARPEGGIOS;
  const groups = [...new Set(list.map((d) => d.group))];
  return (
    <div style={{ width: 680 }}>
      <div className="pick-title">{mode === "scale" ? `Scales in ${keyName}` : `Arpeggios in ${keyName}`}</div>
      <div className="pick-cols">
        {groups.map((g) => (
          <div className="pick-section" key={g}>
            <div className="pick-title" style={{ paddingTop: 10 }}>
              {g}
            </div>
            <div className="pick-list">
              {list
                .filter((d) => d.group === g)
                .map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    className={`pick-row ${d.id === value ? "sel" : ""}`}
                    onClick={() => onPick(d.id)}
                  >
                    <span>{mode === "scale" ? d.name : `${keyName}${d.symbol ?? " " + d.name}`}</span>
                    <span className="formula">{formula(d)}</span>
                  </button>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
