"use client";

import { midiName } from "@/lib/music";
import { ZONE_COLOR, type Zone } from "@/lib/pitch";

export type TunerReading = {
  midi: number;
  cents: number;
  freq: number;
  confidence: number;
  zone: Zone;
  /** Vyhlazená odchylka pro ručičku. */
  needle: number;
  fresh: boolean;
};

const SPAN = 62.5;
const xOf = (c: number) => 50 + (Math.max(-SPAN, Math.min(SPAN, c)) / SPAN) * 46;

const TICKS = Array.from({ length: 21 }, (_, i) => -SPAN + i * 6.25);
const LABELS = [-50, -25, 0, 25, 50];

export default function TunerPanel({
  reading,
  error,
  starting,
}: {
  reading: TunerReading | null;
  error: string | null;
  starting: boolean;
}) {
  const r = reading;
  const stale = !r || !r.fresh;
  return (
    <section className="tuner" aria-label="Tuner">
      <svg className="ruler" aria-hidden="true">
        {LABELS.map((c) => (
          <text key={c} x={`${xOf(c)}%`} y="30%" textAnchor="middle" style={{ fontSize: "calc(19 * var(--u))" }}>
            {c}
          </text>
        ))}
        {TICKS.map((c) => {
          const major = c === 0;
          const labeled = LABELS.includes(c);
          return (
            <line
              key={c}
              x1={`${xOf(c)}%`}
              x2={`${xOf(c)}%`}
              y1={major ? "44%" : labeled ? "52%" : "60%"}
              y2="80%"
              stroke={major ? "#6d6d73" : "#a9a9af"}
              strokeWidth={major ? 2 : 1.3}
            />
          );
        })}
        {r && (
          <line
            x1={`${xOf(r.needle)}%`}
            x2={`${xOf(r.needle)}%`}
            y1="40%"
            y2="84%"
            stroke="#7d8e2b"
            strokeWidth={3.5}
            strokeLinecap="round"
            opacity={stale ? 0.4 : 1}
            style={{ transition: "all 90ms linear" }}
          />
        )}
      </svg>

      <div className="tuner-pills">
        <span className={`pill ${stale ? "stale" : ""}`}>
          <b>{r ? `${Math.round(r.confidence * 100)}%` : "--%"}</b> Confidence
        </span>
        <span className={`pill ${stale ? "stale" : ""}`}>
          <span>
            Note <b>{r ? midiName(r.midi) : "--"}</b>
          </span>
          <span>
            <b>{r ? r.freq.toFixed(1) : "---.-"}</b> HZ
          </span>
          <span>
            <b>{r ? `${r.cents > 0 ? "+" : ""}${Math.round(r.cents)}` : "--"}</b> Cents
          </span>
        </span>
        <span className={`pill ${stale ? "stale" : ""}`}>
          Zone <b style={{ color: r ? ZONE_COLOR[r.zone] : undefined }}>{r ? r.zone : "--"}</b>
        </span>
      </div>
      {error ? (
        <div className="tuner-msg err">{error}</div>
      ) : starting ? (
        <div className="tuner-msg">Starting microphone…</div>
      ) : !r ? (
        <div className="tuner-msg">Play a note into the microphone.</div>
      ) : null}
    </section>
  );
}
