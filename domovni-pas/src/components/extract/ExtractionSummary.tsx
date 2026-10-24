"use client";

import { Badge } from "@/components/ui/Badge";
import { IconAlert, IconSparkles } from "@/components/Icons";
import { INSPECTION_RESULTS, type ExtractionResult } from "@/lib/submission";

export const CONFIDENCE_LABELS: Record<ExtractionResult["confidence"], string> = {
  HIGH: "Vysoká jistota",
  MEDIUM: "Střední jistota",
  LOW: "Nízká jistota — zkontrolujte",
};

export const CONFIDENCE_COLORS = {
  HIGH: "emerald",
  MEDIUM: "amber",
  LOW: "red",
} as const;

const RESULT_COLORS = { OK: "emerald", DEFECTS: "amber", FAIL: "red" } as const;

// Záhlaví návrhu: odkud je, že se nic neuloží bez potvrzení, a co AI vyčetla (jistota, varování, závady).
export function ExtractionSummary({
  sourceLabel,
  extraction,
}: {
  sourceLabel?: string;
  extraction?: ExtractionResult;
}) {
  const facts = extraction
    ? ([
        ["Zařízení", extraction.device],
        ["Firma", extraction.supplier],
        ["Technik", extraction.technician],
      ] as const).filter(([, v]) => !!v)
    : [];

  return (
    <div className="rounded-xl border border-teal-100 bg-teal-50/60 p-4">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
        <IconSparkles className="h-4 w-4 shrink-0 text-teal-700" />
        <p className="min-w-0 break-words text-sm font-semibold text-stone-900">
          {sourceLabel ?? "Návrh zápisu"}
        </p>
        {extraction && (
          <Badge color={CONFIDENCE_COLORS[extraction.confidence]}>
            {CONFIDENCE_LABELS[extraction.confidence]}
          </Badge>
        )}
        {extraction?.result && (
          <Badge color={RESULT_COLORS[extraction.result]}>{INSPECTION_RESULTS[extraction.result]}</Badge>
        )}
      </div>
      <p className="mt-1.5 text-sm text-stone-600">
        <strong className="font-medium text-stone-800">Nic se neuloží bez vašeho potvrzení.</strong>{" "}
        Zkontrolujte údaje a případně je opravte.
      </p>

      {facts.length > 0 && (
        <dl className="mt-3 grid gap-x-4 gap-y-1 text-xs sm:grid-cols-[auto_1fr]">
          {facts.map(([k, v]) => (
            <div key={k} className="contents">
              <dt className="text-stone-500">{k}</dt>
              <dd className="mb-1 break-words font-medium text-stone-800 sm:mb-0">{v}</dd>
            </div>
          ))}
        </dl>
      )}

      {extraction && extraction.warnings.length > 0 && (
        <div className="mt-3 rounded-lg bg-amber-50 p-3 text-xs text-amber-900">
          <p className="flex items-center gap-1.5 font-medium">
            <IconAlert className="h-4 w-4 shrink-0 text-amber-600" />
            Na co se podívat
          </p>
          <ul className="mt-1.5 list-disc space-y-0.5 pl-5">
            {extraction.warnings.map((w, i) => (
              <li key={i} className="break-words">
                {w}
              </li>
            ))}
          </ul>
        </div>
      )}

      {extraction && extraction.defects.length > 0 && (
        <div className="mt-3 rounded-lg bg-red-50 p-3 text-xs text-red-900">
          <p className="flex items-center gap-1.5 font-medium">
            <IconAlert className="h-4 w-4 shrink-0 text-red-600" />
            Zjištěné závady ({extraction.defects.length})
          </p>
          <ul className="mt-1.5 list-disc space-y-0.5 pl-5">
            {extraction.defects.map((d, i) => (
              <li key={i} className="break-words">
                {d}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
