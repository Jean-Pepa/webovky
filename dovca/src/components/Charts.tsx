"use client";

import { fmtCZK } from "@/lib/format";
import type { Slice } from "@/lib/expenses";

// Koláč (donut) — čisté SVG, bez knihoven. Uprostřed je celková částka.
export function DonutChart({ data }: { data: Slice[] }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const r = 54;
  const c = 2 * Math.PI * r;
  const sw = 24;
  const segments = data.filter((d) => d.value > 0);

  let acc = 0;
  return (
    <div className="flex items-center gap-4">
      <svg viewBox="0 0 140 140" className="h-36 w-36 shrink-0">
        <g transform="rotate(-90 70 70)">
          {total > 0 ? (
            segments.map((d, i) => {
              const dash = (d.value / total) * c;
              const seg = (
                <circle
                  key={i}
                  cx="70"
                  cy="70"
                  r={r}
                  fill="none"
                  stroke={d.color}
                  strokeWidth={sw}
                  strokeDasharray={`${dash} ${c - dash}`}
                  strokeDashoffset={-acc}
                />
              );
              acc += dash;
              return seg;
            })
          ) : (
            <circle cx="70" cy="70" r={r} fill="none" stroke="#e7edf1" strokeWidth={sw} />
          )}
        </g>
        <text x="70" y="68" textAnchor="middle" className="fill-ink text-[15px] font-bold">
          {fmtCZK(total)}
        </text>
        <text x="70" y="84" textAnchor="middle" className="fill-ink-soft text-[9px]">
          celkem
        </text>
      </svg>
      <div className="min-w-0 flex-1 space-y-1.5">
        {segments.length === 0 && <p className="text-sm text-ink-soft">Zatím žádné útraty.</p>}
        {segments.map((d) => (
          <div key={d.label} className="flex items-center gap-2 text-xs">
            <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: d.color }} />
            <span className="min-w-0 flex-1 truncate text-ink-soft">{d.label}</span>
            <span className="shrink-0 font-semibold tabular-nums">{fmtCZK(d.value)}</span>
            <span className="w-9 shrink-0 text-right text-ink-soft tabular-nums">
              {total > 0 ? Math.round((d.value / total) * 100) : 0}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Vodorovné sloupce — kdo kolik zaplatil / součet po autech apod.
export function BarList({ items, empty }: { items: Slice[]; empty?: string }) {
  const max = Math.max(...items.map((i) => i.value), 1);
  if (items.length === 0) return <p className="text-sm text-ink-soft">{empty ?? "Žádná data."}</p>;
  return (
    <div className="space-y-2">
      {items.map((i) => (
        <div key={i.label} className="flex items-center gap-2 text-xs">
          <span className="w-20 shrink-0 truncate text-ink-soft">{i.label}</span>
          <div className="h-3 flex-1 overflow-hidden rounded-full bg-paper2">
            <div className="h-full rounded-full" style={{ width: `${(i.value / max) * 100}%`, background: i.color }} />
          </div>
          <span className="w-20 shrink-0 text-right font-semibold tabular-nums">{fmtCZK(i.value)}</span>
        </div>
      ))}
    </div>
  );
}
