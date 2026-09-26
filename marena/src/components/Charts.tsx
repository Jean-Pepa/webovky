"use client";

import { useState, type ReactNode } from "react";

// Malé grafy pro analytiku (koláče a dělené pruhy) — čisté SVG/HTML, bez knihovny.
// Barvy jsou CSS proměnné z globals.css (--viz-*), zvalidované pro barvoslepost
// ve světlém i nočním režimu. Legenda je vždy u grafu (hodnota + podíl), takže
// nic nezávisí jen na barvě; najetí/focus na výseč ukáže totéž v bublině.

export const VIZ = [1, 2, 3, 4, 5, 6].map((i) => `var(--viz-${i})`);
export const VIZ_OTHER = "var(--viz-other)";
export const VIZ_ORD = [1, 2, 3, 4].map((i) => `var(--viz-ord-${i})`);
export const VIZ_NEG = "var(--viz-neg)";

export type Slice = { label: string; value: number; color?: string; sub?: string };
type Fmt = (n: number) => string;
const fmtNum = (n: number) => Math.round(n).toLocaleString("cs-CZ");
const pct = (v: number, total: number) => (total > 0 ? `${Math.round((v / total) * 100)} %` : "—");

// Přebytečné položky (nad `max`) se složí do „Ostatní" — koláč s víc než šesti
// výsečemi se nedá číst a další barvy by už nešly rozlišit.
function fold(items: Slice[], max: number, sort: boolean): Slice[] {
  const positive = items.filter((i) => i.value > 0);
  const list = sort ? [...positive].sort((a, b) => b.value - a.value) : positive;
  if (list.length <= max) return list;
  const head = list.slice(0, max - 1);
  const rest = list.slice(max - 1);
  return [...head, { label: `Ostatní (${rest.length})`, value: rest.reduce((s, i) => s + i.value, 0), color: VIZ_OTHER }];
}

function Legend({
  data,
  total,
  unit,
  format,
  active,
  onActive,
}: {
  data: Slice[];
  total: number;
  unit: string;
  format?: Fmt;
  active: number | null;
  onActive: (i: number | null) => void;
}) {
  const f = format ?? ((n: number) => `${fmtNum(n)}${unit ? ` ${unit}` : ""}`);
  return (
    <ul className="w-full min-w-0 flex-1 space-y-0.5 text-xs">
      {data.map((d, i) => (
        <li
          key={d.label}
          className={`flex items-center gap-2 rounded-md px-1 py-0.5 transition ${active === i ? "bg-ink/[0.05]" : ""}`}
          onMouseEnter={() => onActive(i)}
          onMouseLeave={() => onActive(null)}
        >
          <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: d.color }} aria-hidden />
          <span className="min-w-0 flex-1 leading-tight">
            {d.label}
            {d.sub && <span className="text-ink-soft"> · {d.sub}</span>}
          </span>
          <span className="shrink-0 font-semibold tabular-nums">{f(d.value)}</span>
          <span className="w-10 shrink-0 text-right tabular-nums text-ink-soft">{pct(d.value, total)}</span>
        </li>
      ))}
    </ul>
  );
}

function Frame({ title, note, children }: { title: string; note?: string; children: ReactNode }) {
  return (
    <figure className="rounded-xl bg-paper2/60 p-3">
      <figcaption className="text-[10px] font-medium uppercase tracking-wide text-ink-soft">{title}</figcaption>
      {children}
      {note && <p className="mt-1.5 text-[11px] text-ink-soft">{note}</p>}
    </figure>
  );
}

// Koláč (prstenec): podíly z celku, nejvýš 6 výsečí, 2px mezera v barvě podkladu
// mezi výsečemi, uprostřed celek. Legenda vedle = tabulka hodnot.
export function DonutChart({
  title,
  items,
  unit = "",
  format,
  max = 6,
  sort = true,
  note,
  empty = "Zatím žádná data.",
}: {
  title: string;
  items: Slice[];
  unit?: string;
  format?: Fmt;
  max?: number;
  sort?: boolean;
  note?: string;
  empty?: string;
}) {
  const [active, setActive] = useState<number | null>(null);
  const data = fold(items, max, sort).map((d, i) => ({ ...d, color: d.color ?? VIZ[i % VIZ.length] }));
  const total = data.reduce((s, d) => s + d.value, 0);
  const f = format ?? ((n: number) => `${fmtNum(n)}${unit ? ` ${unit}` : ""}`);
  if (total <= 0) {
    return (
      <Frame title={title} note={note}>
        <p className="mt-2 text-xs text-ink-soft">{empty}</p>
      </Frame>
    );
  }
  // Geometrie: viewBox 100×100, prstenec o poloměru 38, tloušťka 14 (aktivní 17).
  const cx = 50, cy = 50, r = 38;
  const gap = data.length > 1 ? 1.4 / r : 0; // ≈ 2 px mezera při vykreslení na ~150 px
  const arcs: (Slice & { i: number; path: string })[] = [];
  let angle = -Math.PI / 2;
  for (let i = 0; i < data.length; i++) {
    const d = data[i];
    const span = (d.value / total) * Math.PI * 2;
    const a0 = angle + gap / 2;
    const a1 = Math.max(a0 + 0.01, angle + span - gap / 2);
    angle += span;
    const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    const large = a1 - a0 > Math.PI ? 1 : 0;
    const path =
      data.length === 1
        ? `M ${cx + r} ${cy} A ${r} ${r} 0 1 1 ${cx - r} ${cy} A ${r} ${r} 0 1 1 ${cx + r} ${cy}`
        : `M ${x0.toFixed(2)} ${y0.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
    arcs.push({ ...d, i, path });
  }
  const a = active != null ? data[active] : null;
  const label = `${title}: ${data.map((d) => `${d.label} ${f(d.value)} (${pct(d.value, total)})`).join(", ")}`;
  return (
    <Frame title={title} note={note}>
      {/* Na úzkém sloupci legenda pod koláčem, od md vedle něj. */}
      <div className="mt-2 flex flex-col items-center gap-2 md:flex-row md:gap-3">
        <div className="relative h-[128px] w-[128px] shrink-0">
          <svg viewBox="0 0 100 100" className="h-full w-full" role="img" aria-label={label}>
            {arcs.map((s) => (
              <path
                key={s.label}
                d={s.path}
                fill="none"
                stroke={s.color}
                strokeWidth={active === s.i ? 17 : 14}
                strokeLinecap="butt"
                className="cursor-pointer outline-none transition-[stroke-width] duration-150"
                tabIndex={0}
                onMouseEnter={() => setActive(s.i)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(s.i)}
                onBlur={() => setActive(null)}
              >
                <title>{`${s.label}: ${f(s.value)} (${pct(s.value, total)})`}</title>
              </path>
            ))}
          </svg>
          {/* Střed: celek (proporcionální číslice — velké číslo, ne sloupec) */}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
            {a ? (
              <>
                <span className="text-base font-semibold leading-tight">{pct(a.value, total)}</span>
                <span className="max-w-[80px] truncate text-[10px] leading-tight text-ink-soft">{a.label}</span>
              </>
            ) : (
              <>
                <span className="text-base font-semibold leading-tight">{fmtNum(total)}</span>
                <span className="text-[10px] leading-tight text-ink-soft">{unit || "celkem"}</span>
              </>
            )}
          </div>
        </div>
        <Legend data={data} total={total} unit={unit} format={format} active={active} onActive={setActive} />
      </div>
    </Frame>
  );
}

// Dělený pruh: podíl dvou–tří částí z celku (tam, kde by koláč o dvou výsečích
// nedával smysl). 2px mezery v barvě podkladu, legenda s hodnotami a podíly.
export function SplitBar({
  title,
  parts,
  unit = "",
  format,
  note,
  empty = "Zatím žádná data.",
}: {
  title: string;
  parts: Slice[];
  unit?: string;
  format?: Fmt;
  note?: string;
  empty?: string;
}) {
  const [active, setActive] = useState<number | null>(null);
  const data = parts.map((d, i) => ({ ...d, color: d.color ?? VIZ[i % VIZ.length] }));
  const total = data.reduce((s, d) => s + Math.max(0, d.value), 0);
  const f = format ?? ((n: number) => `${fmtNum(n)}${unit ? ` ${unit}` : ""}`);
  if (total <= 0) {
    return (
      <Frame title={title} note={note}>
        <p className="mt-2 text-xs text-ink-soft">{empty}</p>
      </Frame>
    );
  }
  const shown = data.filter((d) => d.value > 0);
  return (
    <Frame title={title} note={note}>
      <div className="mt-2 flex h-3 w-full gap-[2px] overflow-hidden rounded-full" role="img" aria-label={`${title}: ${shown.map((d) => `${d.label} ${f(d.value)} (${pct(d.value, total)})`).join(", ")}`}>
        {shown.map((d) => (
          <div
            key={d.label}
            className={`h-full transition-opacity ${active != null && active !== data.indexOf(d) ? "opacity-60" : ""}`}
            style={{ width: `${Math.max(1.5, (d.value / total) * 100)}%`, background: d.color }}
            title={`${d.label}: ${f(d.value)} (${pct(d.value, total)})`}
            onMouseEnter={() => setActive(data.indexOf(d))}
            onMouseLeave={() => setActive(null)}
          />
        ))}
      </div>
      <div className="mt-2">
        <Legend data={data} total={total} unit={unit} format={format} active={active} onActive={setActive} />
      </div>
    </Frame>
  );
}

// Řádkové pruhy se znaménkem (zisk / ztráta po druzích): délka = velikost,
// barva = znaménko (modrá plus, červená minus), hodnota vedle v textové barvě.
export function SignedBars({
  title,
  rows,
  format,
  note,
}: {
  title: string;
  rows: { label: string; value: number }[];
  format?: Fmt;
  note?: string;
}) {
  const f = format ?? ((n: number) => `${n >= 0 ? "+" : "−"}${fmtNum(Math.abs(n))}`);
  const max = Math.max(1, ...rows.map((r) => Math.abs(r.value)));
  return (
    <Frame title={title} note={note}>
      <ul className="mt-2 space-y-1.5 text-xs">
        {rows.map((r) => (
          <li key={r.label} className="flex items-center gap-2">
            <span className="w-24 shrink-0 truncate" title={r.label}>{r.label}</span>
            <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-ink/[0.06]" title={`${r.label}: ${f(r.value)}`}>
              <div className="h-full rounded-r-full" style={{ width: `${(Math.abs(r.value) / max) * 100}%`, background: r.value >= 0 ? VIZ[0] : VIZ_NEG }} />
            </div>
            <span className={`w-24 shrink-0 text-right font-semibold tabular-nums ${r.value < 0 ? "text-red-600" : ""}`}>{f(r.value)}</span>
          </li>
        ))}
      </ul>
    </Frame>
  );
}
