"use client";

import { useState } from "react";
import { distance, formatMeters, formatScale, metersBetween, type Pt } from "@/lib/plan";
import { IconRuler } from "./icons";

// Kalibrace měřítka: dva body se známou vzdáleností → px podkladu na 1 m
export function ScaleCalibration({
  points,
  pxPerMeter,
  onSave,
  onReset,
  onCancel,
}: {
  points: Pt[]; // px podkladu (0–2)
  pxPerMeter?: number; // současné měřítko
  onSave: (meters: number) => void;
  onReset: () => void;
  onCancel: () => void;
}) {
  // chyba platí jen pro tuto dvojici bodů (po novém klepnutí zmizí)
  const [error, setError] = useState<{ text: string; points: Pt[] } | null>(null);
  const shownError = error && error.points === points ? error.text : null;
  const ready = points.length === 2;
  const tooClose = ready && distance(points[0], points[1]) < 5;

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const raw = String(new FormData(e.currentTarget).get("meters") ?? "")
      .replace(/\s/g, "")
      .replace(",", ".");
    const m = Number(raw);
    if (!raw || !Number.isFinite(m) || m <= 0) {
      setError({ text: "Zadejte vzdálenost v metrech, např. 0,8 nebo 4,25.", points });
      return;
    }
    if (m > 500) {
      setError({ text: "To je na půdorys domu moc — zadejte vzdálenost v metrech (ne v cm nebo mm).", points });
      return;
    }
    setError(null);
    onSave(m);
  }

  return (
    <div className="rounded-xl border border-stone-300 bg-white p-3" role="region" aria-label="Nastavení měřítka">
      <div className="flex items-start gap-2">
        <IconRuler className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-stone-900">Nastavit měřítko</p>
          <p className="text-xs text-stone-500">Teď: {formatScale(pxPerMeter)}</p>
        </div>
      </div>

      {!ready ? (
        <p className="mt-2 text-sm text-stone-700" aria-live="polite">
          Klepněte na dva body se známou vzdáleností — třeba konce kóty, délku stěny nebo šířku dveří.{" "}
          <span className="text-stone-500">({points.length}/2)</span>
        </p>
      ) : tooClose ? (
        <p className="mt-2 text-sm text-red-700" role="alert">
          Body jsou moc blízko sebe. Přibližte si půdorys a zvolte vzdálenější body.
        </p>
      ) : (
        <form onSubmit={submit} className="mt-2" noValidate>
          <label htmlFor="cal-meters" className="label">
            Skutečná vzdálenost mezi body (m)
          </label>
          <div className="flex flex-wrap gap-2">
            <input
              id="cal-meters"
              name="meters"
              className="input max-w-36"
              inputMode="decimal"
              autoComplete="off"
              placeholder="např. 4,25"
              autoFocus
            />
            <button type="submit" className="btn-primary min-h-10">
              Uložit měřítko
            </button>
          </div>
          {pxPerMeter ? (
            <p className="mt-1 text-xs text-stone-500">
              Podle současného měřítka je to {formatMeters(metersBetween(points[0], points[1], pxPerMeter))}.
            </p>
          ) : null}
          {shownError && (
            <p className="mt-1 text-xs text-red-700" role="alert">
              {shownError}
            </p>
          )}
        </form>
      )}

      <div className="mt-3 flex flex-wrap gap-2">
        {points.length > 0 && (
          <button type="button" onClick={onReset} className="btn-secondary min-h-10">
            Znovu
          </button>
        )}
        <button type="button" onClick={onCancel} className="btn-ghost min-h-10">
          Zrušit
        </button>
      </div>
    </div>
  );
}
