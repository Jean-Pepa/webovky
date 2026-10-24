"use client";

import { useId, useState } from "react";
import {
  useStore,
  type AuthorRole,
  type DocCategory,
  type DocumentInput,
  type EntryProposal,
  type EntryType,
  type Media,
  type Property,
  type Reminder,
  type ReminderType,
} from "@/lib/store";
import { INSPECTION_RESULTS, type ExtractionResult, type InspectionResult } from "@/lib/submission";
import { DOCUMENT_CATEGORIES, ENTRY_TYPES, REMINDER_TYPES } from "@/lib/enums";
import { ELEMENT_SOURCES, SAFETY_NOTE, accuracyLabel, findElement, formatMm } from "@/lib/elements";
import { addMonths, formatDay, intervalLabel } from "@/lib/deadlines";
import { isValidIsoDate } from "@/lib/extract";
import { AttachmentThumb } from "@/components/AttachmentThumb";
import { ElementPicker } from "@/components/elements/ElementPicker";
import { IconCalendar, IconCheck, IconClose, IconExternal, IconFile, IconWrench } from "@/components/Icons";
import { ExtractionSummary } from "./ExtractionSummary";
import { openDataUrl } from "./open-file";

export type ProposalReviewProps = {
  property: Property;
  proposal: EntryProposal; // počáteční návrh (z AI vyčtení nebo od řemeslníka)
  extraction?: ExtractionResult; // co vyčetla AI (důvěra, varování, závady)
  sourceLabel?: string; // „Vyčteno AI z protokolu" / „Od: Elektro Dvořák (revizní technik)"
  previews?: Media[]; // náhledy příloh (protokol, fotky) k zobrazení vedle formuláře
  confirmLabel?: string; // výchozí „Potvrdit a zapsat do knihy"
  onConfirm: (entryId: string) => void; // voláno po uložení přes applyProposal
  onReject?: () => void;
};

const AUTHOR_ROLES: Record<AuthorRole, string> = {
  OWNER: "Majitel",
  CRAFTSMAN: "Řemeslník",
  INSPECTOR: "Revizní technik",
  ARCHITECT: "Architekt",
};

type EntryDraft = {
  type: EntryType;
  title: string;
  date: string;
  cost: string;
  result: InspectionResult | "";
  description: string;
  elementIds: string[];
};

type DeadlineDraft = {
  reminderId: string; // "" = nový termín
  type: ReminderType;
  title: string;
  nextDueDate: string;
  intervalMonths: string;
  intervalConfirmed: boolean;
  confirmedBy: string;
};

// „12 450,50" → 12450.5; prázdné → undefined; nesmysl → null
function parseAmount(s: string): number | undefined | null {
  const t = s.replace(/\s/g, "").replace(",", ".");
  if (!t) return undefined;
  const n = Number(t);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

function parsePositiveInt(s: string): number | undefined | null {
  const t = s.trim();
  if (!t) return undefined;
  const n = Number(t);
  return Number.isInteger(n) && n > 0 ? n : null;
}

const defaultReminderType = (t: EntryType): ReminderType => (t === "INSPECTION" ? "INSPECTION" : "MAINTENANCE");

// Editovatelný návrh zápisu → potvrzení jedním klepnutím.
// Nic se neuloží bez potvrzení; uložení dělá applyProposal(property.id, upravenýNávrh).
// Při novém návrhu (jiný doklad) ho rodič přemontuje přes `key`.
export function ProposalReview({
  property,
  proposal,
  extraction,
  sourceLabel,
  previews,
  confirmLabel,
  onConfirm,
  onReject,
}: ProposalReviewProps) {
  const { applyProposal } = useStore();
  const uid = useId();
  const elements = property.elements ?? [];

  const [entry, setEntry] = useState<EntryDraft>(() => ({
    type: proposal.entry.type,
    title: proposal.entry.title ?? "",
    date: proposal.entry.date ?? "",
    cost: proposal.entry.cost != null ? String(proposal.entry.cost) : "",
    result: proposal.entry.result ?? "",
    description: proposal.entry.description ?? "",
    elementIds: (proposal.entry.elementIds ?? []).filter((id) => elements.some((e) => e.id === id)),
  }));
  const [docs, setDocs] = useState<DocumentInput[]>(() => proposal.documents ?? []);

  // Termín: provedení existujícího (reminderId), nebo nový další termín
  const initialExisting = proposal.deadline?.reminderId
    ? property.reminders.find((r) => r.id === proposal.deadline?.reminderId)
    : undefined;
  const newTitleDefault =
    proposal.deadline && !initialExisting
      ? proposal.deadline.title
      : `${REMINDER_TYPES[defaultReminderType(proposal.entry.type)]} — ${
          findElement(property, proposal.entry.elementIds?.[0])?.name ?? proposal.entry.title
        }`;
  const [deadlineOn, setDeadlineOn] = useState(() => !!proposal.deadline);
  const [deadline, setDeadline] = useState<DeadlineDraft>(() => {
    const dl = proposal.deadline;
    return {
      reminderId: initialExisting?.id ?? "",
      type: initialExisting?.type ?? dl?.type ?? defaultReminderType(proposal.entry.type),
      title: initialExisting?.title ?? newTitleDefault,
      nextDueDate: dl?.nextDueDate ?? "",
      intervalMonths: String(dl?.intervalMonths ?? initialExisting?.intervalMonths ?? ""),
      intervalConfirmed: dl?.intervalConfirmed ?? initialExisting?.intervalConfirmed ?? false,
      confirmedBy: dl?.confirmedBy ?? initialExisting?.confirmedBy ?? "",
    };
  });

  // Zpřesnění polohy prvku (fotka otevřené zdi s metrem → změřeno)
  const refine = proposal.refineElement;
  const refineEl = refine ? findElement(property, refine.elementId) : undefined;
  const [refineOn, setRefineOn] = useState(() => !!refineEl);
  const [refineMm, setRefineMm] = useState(() => (refine?.accuracyMm != null ? String(refine.accuracyMm) : ""));

  const [saving, setSaving] = useState(false);

  // --- odvozené hodnoty a kontrola ---
  const existing: Reminder | undefined = deadline.reminderId
    ? property.reminders.find((r) => r.id === deadline.reminderId)
    : undefined;
  const reminderChoices = property.reminders
    .filter((r) => !r.done || r.id === deadline.reminderId)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  const titleOk = entry.title.trim().length > 0;
  const dateOk = isValidIsoDate(entry.date);
  const cost = parseAmount(entry.cost);
  const interval = parsePositiveInt(deadline.intervalMonths);
  const nextFilled = deadline.nextDueDate !== "";
  const nextValid = nextFilled && isValidIsoDate(deadline.nextDueDate);
  const nextAfter = !nextValid || !dateOk || deadline.nextDueDate > entry.date;
  // prázdná lhůta u existujícího termínu = ponechá jeho dosavadní lhůtu (applyProposal)
  const effectiveInterval = interval ?? (existing ? existing.intervalMonths : undefined);
  // další termín: z dokladu, jinak spočítaný z lhůty od data zápisu
  const computedNext = nextValid
    ? deadline.nextDueDate
    : effectiveInterval && dateOk
      ? addMonths(entry.date, effectiveInterval)
      : undefined;
  const refineVal = parsePositiveInt(refineMm);

  const problems: string[] = [];
  if (!titleOk) problems.push("Doplňte název zápisu.");
  if (!dateOk) problems.push("Doplňte platné datum.");
  if (cost === null) problems.push("Náklad musí být číslo v Kč (např. 12 450,50).");
  if (deadlineOn) {
    if (interval === null) problems.push("Lhůta musí být celý počet měsíců.");
    if (nextFilled && !nextValid) problems.push("Další termín není platné datum.");
    if (!nextAfter) problems.push("Další termín musí být po datu zápisu.");
    if (!existing) {
      if (!deadline.title.trim()) problems.push("Doplňte název termínu.");
      if (!computedNext) problems.push("Doplňte datum dalšího termínu nebo lhůtu — případně plánování vypněte.");
    }
  }
  if (refineOn && refineEl && refineVal === null) problems.push("Přesnost polohy musí být kladné číslo v mm.");
  const canConfirm = problems.length === 0 && !saving;

  function patchEntry(p: Partial<EntryDraft>) {
    setEntry((e) => ({ ...e, ...p }));
  }
  function patchDeadline(p: Partial<DeadlineDraft>) {
    setDeadline((d) => ({ ...d, ...p }));
  }
  function patchDoc(i: number, p: Partial<DocumentInput>) {
    setDocs((list) => list.map((d, j) => (j === i ? { ...d, ...p } : d)));
  }

  function chooseReminder(id: string) {
    const r = property.reminders.find((x) => x.id === id);
    const fromDoc = proposal.deadline?.intervalMonths;
    if (r) {
      setDeadline((d) => ({
        ...d,
        reminderId: r.id,
        type: r.type,
        title: r.title,
        intervalMonths: String(fromDoc ?? r.intervalMonths ?? ""),
        intervalConfirmed: r.intervalConfirmed ?? false,
        confirmedBy: r.confirmedBy ?? d.confirmedBy,
      }));
    } else {
      setDeadline((d) => ({
        ...d,
        reminderId: "",
        type: proposal.deadline && !initialExisting ? proposal.deadline.type : defaultReminderType(entry.type),
        title: newTitleDefault,
        intervalMonths: String(fromDoc ?? ""),
        intervalConfirmed: proposal.deadline?.intervalConfirmed ?? false,
      }));
    }
  }

  function submit() {
    if (!canConfirm) return;
    setSaving(true);
    const elementIds = entry.elementIds.filter((id) => elements.some((e) => e.id === id));
    const linked = elementIds.length ? elementIds : undefined;
    const confirmedBy = deadline.intervalConfirmed ? deadline.confirmedBy.trim() || undefined : undefined;

    let dl: EntryProposal["deadline"];
    if (deadlineOn && existing) {
      dl = {
        reminderId: existing.id,
        type: existing.type,
        title: existing.title,
        elementId: existing.elementId ?? elementIds[0],
        nextDueDate: nextValid ? deadline.nextDueDate : undefined,
        intervalMonths: interval ?? undefined,
        intervalConfirmed: deadline.intervalConfirmed,
        confirmedBy,
      };
    } else if (deadlineOn && computedNext) {
      const proposed = proposal.deadline?.elementId;
      dl = {
        type: deadline.type,
        title: deadline.title.trim(),
        elementId: proposed && elementIds.includes(proposed) ? proposed : elementIds[0],
        nextDueDate: computedNext,
        intervalMonths: interval ?? undefined,
        intervalConfirmed: deadline.intervalConfirmed,
        confirmedBy,
      };
    }

    const edited: EntryProposal = {
      entry: {
        ...proposal.entry, // autor, fotky, submissionId zůstávají
        type: entry.type,
        title: entry.title.trim(),
        date: entry.date,
        cost: cost ?? undefined,
        result: entry.type === "INSPECTION" && entry.result ? entry.result : undefined,
        description: entry.description.trim() || undefined,
        elementIds: linked,
      },
      documents: docs.length
        ? docs.map((d) => ({
            ...d,
            title: d.title.trim() || d.fileName || "Doklad",
            elementIds: linked,
          }))
        : undefined,
      deadline: dl,
      refineElement:
        refineOn && refine && refineEl
          ? { ...refine, accuracyMm: refineVal ?? refine.accuracyMm }
          : undefined,
    };
    const entryId = applyProposal(property.id, edited);
    onConfirm(entryId);
  }

  const id = (name: string) => `${uid}-${name}`;
  const author = proposal.entry.author;

  return (
    <div className="space-y-5">
      <ExtractionSummary sourceLabel={sourceLabel} extraction={extraction} />

      {previews && previews.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {previews.map((m) => (
            <PreviewThumb key={m.id} m={m} />
          ))}
        </div>
      )}

      {/* --- Zápis --- */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-stone-900">Zápis do historie</h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor={id("type")}>
              Typ záznamu
            </label>
            <select
              id={id("type")}
              className="input"
              value={entry.type}
              onChange={(e) => patchEntry({ type: e.target.value as EntryType })}
            >
              {Object.entries(ENTRY_TYPES).map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor={id("date")}>
              Datum *
            </label>
            <input
              id={id("date")}
              type="date"
              className="input"
              value={entry.date}
              onChange={(e) => patchEntry({ date: e.target.value })}
              aria-invalid={!dateOk}
            />
          </div>
        </div>

        <div>
          <label className="label" htmlFor={id("title")}>
            Název *
          </label>
          <input
            id={id("title")}
            className="input"
            value={entry.title}
            onChange={(e) => patchEntry({ title: e.target.value })}
            placeholder="Např. Revize elektroinstalace"
            aria-invalid={!titleOk}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {entry.type === "INSPECTION" && (
            <div>
              <label className="label" htmlFor={id("result")}>
                Výsledek revize
              </label>
              <select
                id={id("result")}
                className="input"
                value={entry.result}
                onChange={(e) => patchEntry({ result: e.target.value as InspectionResult | "" })}
              >
                <option value="">— neuvedeno —</option>
                {Object.entries(INSPECTION_RESULTS).map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="label" htmlFor={id("cost")}>
              Náklad (Kč vč. DPH)
            </label>
            <input
              id={id("cost")}
              className="input"
              inputMode="decimal"
              value={entry.cost}
              onChange={(e) => patchEntry({ cost: e.target.value })}
              placeholder="volitelné"
              aria-invalid={cost === null}
            />
          </div>
        </div>

        <div>
          <label className="label" htmlFor={id("desc")}>
            Popis
          </label>
          <textarea
            id={id("desc")}
            className="input"
            rows={4}
            value={entry.description}
            onChange={(e) => patchEntry({ description: e.target.value })}
            placeholder="Co se dělalo, výsledek, závady…"
          />
        </div>

        <ElementPicker
          elements={elements}
          value={entry.elementIds}
          onChange={(ids) => patchEntry({ elementIds: ids })}
          label="Týká se prvku domu"
          hint="Zápis i doklad se pak ukážou u prvku — revize u rozvaděče, servis u kotle."
        />

        {author && (
          <div className="rounded-lg bg-stone-50 p-3 text-sm">
            <p className="text-xs text-stone-500">Zapsal</p>
            <p className="mt-0.5 break-words font-medium text-stone-800">
              {author.name}
              <span className="font-normal text-stone-500">
                {" · "}
                {AUTHOR_ROLES[author.role] ?? author.role}
                {author.company ? ` · ${author.company}` : ""}
              </span>
            </p>
            {author.phone && (
              <a href={`tel:${author.phone.replace(/\s/g, "")}`} className="mt-0.5 inline-block text-xs text-teal-700 hover:underline">
                {author.phone}
              </a>
            )}
          </div>
        )}
      </section>

      {/* --- Doklady --- */}
      {docs.length > 0 && (
        <section className="space-y-3 border-t border-stone-100 pt-5">
          <h3 className="text-sm font-semibold text-stone-900">Doklad k uložení</h3>
          <ul className="space-y-3">
            {docs.map((d, i) => (
              <li key={i} className="rounded-xl border border-stone-200 p-3">
                <div className="flex items-start gap-3">
                  <span className="mt-1 hidden h-9 w-9 shrink-0 place-items-center rounded-lg bg-stone-100 text-stone-500 sm:grid">
                    <IconFile className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1 space-y-2">
                    <div>
                      <label className="sr-only" htmlFor={id(`doc-title-${i}`)}>
                        Název dokladu
                      </label>
                      <input
                        id={id(`doc-title-${i}`)}
                        className="input"
                        value={d.title}
                        onChange={(e) => patchDoc(i, { title: e.target.value })}
                        placeholder="Název dokladu"
                      />
                    </div>
                    <div>
                      <label className="sr-only" htmlFor={id(`doc-cat-${i}`)}>
                        Druh dokladu
                      </label>
                      <select
                        id={id(`doc-cat-${i}`)}
                        className="input"
                        value={d.category}
                        onChange={(e) => patchDoc(i, { category: e.target.value as DocCategory })}
                      >
                        {Object.entries(DOCUMENT_CATEGORIES).map(([v, l]) => (
                          <option key={v} value={v}>
                            {l}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone-500">
                      {d.fileName && <span className="min-w-0 break-all">{d.fileName}</span>}
                      {d.dataUrl ? (
                        <button
                          type="button"
                          onClick={() => d.dataUrl && openDataUrl(d.dataUrl, d.fileName)}
                          className="inline-flex min-h-10 items-center gap-1 font-medium text-teal-700 hover:underline"
                        >
                          <IconExternal className="h-3.5 w-3.5" />
                          Otevřít
                        </button>
                      ) : (
                        d.fileName && (
                          <span className="text-amber-700">
                            Uloží se jen název — soubor je na uložení v prohlížeči moc velký nebo
                            v nepodporovaném formátu. Originál si nechte.
                          </span>
                        )
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDocs((list) => list.filter((_, j) => j !== i))}
                    className="-mr-1 grid h-10 w-10 shrink-0 place-items-center rounded-lg text-stone-400 transition hover:bg-stone-100 hover:text-red-600"
                    aria-label={`Neukládat doklad ${d.title}`}
                    title="Neukládat doklad"
                  >
                    <IconClose className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* --- Termín --- */}
      <section className="space-y-3 border-t border-stone-100 pt-5">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-stone-900">
          <IconCalendar className="h-4 w-4 text-teal-700" />
          Termín / revize
        </h3>
        <label className="flex min-h-10 cursor-pointer items-start gap-3 text-sm text-stone-800">
          <input
            type="checkbox"
            className="mt-0.5 h-5 w-5 shrink-0 accent-teal-700"
            checked={deadlineOn}
            onChange={(e) => setDeadlineOn(e.target.checked)}
          />
          <span className="min-w-0 break-words">
            {existing ? (
              <>
                Označit termín <strong className="font-medium">„{existing.title}“</strong> jako provedený
                <span className="mt-0.5 block text-xs text-stone-500">
                  {existing.done ? "Splněno" : `Do ${formatDay(existing.dueDate)}`}
                  {existing.intervalMonths ? ` · ${intervalLabel(existing.intervalMonths)}` : ""}
                </span>
              </>
            ) : (
              "Naplánovat další termín"
            )}
          </span>
        </label>

        {deadlineOn && (
          <div className="space-y-4 rounded-xl bg-stone-50 p-3 sm:p-4">
            {reminderChoices.length > 0 && (
              <div>
                <label className="label" htmlFor={id("reminder")}>
                  Který termín
                </label>
                <select
                  id={id("reminder")}
                  className="input"
                  value={deadline.reminderId}
                  onChange={(e) => chooseReminder(e.target.value)}
                >
                  <option value="">Nový termín</option>
                  {reminderChoices.map((r) => (
                    <option key={r.id} value={r.id}>
                      {`Provést: ${r.title} (do ${formatDay(r.dueDate)})`}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {!existing && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label" htmlFor={id("dl-type")}>
                    Druh
                  </label>
                  <select
                    id={id("dl-type")}
                    className="input"
                    value={deadline.type}
                    onChange={(e) => patchDeadline({ type: e.target.value as ReminderType })}
                  >
                    {Object.entries(REMINDER_TYPES).map(([v, l]) => (
                      <option key={v} value={v}>
                        {l}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label" htmlFor={id("dl-title")}>
                    Název termínu *
                  </label>
                  <input
                    id={id("dl-title")}
                    className="input"
                    value={deadline.title}
                    onChange={(e) => patchDeadline({ title: e.target.value })}
                    placeholder="Např. Revize elektroinstalace"
                  />
                </div>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor={id("dl-next")}>
                  Další termín{existing ? " (je-li v dokladu)" : ""}
                </label>
                <input
                  id={id("dl-next")}
                  type="date"
                  className="input"
                  value={deadline.nextDueDate}
                  onChange={(e) => patchDeadline({ nextDueDate: e.target.value })}
                  aria-invalid={(nextFilled && !nextValid) || !nextAfter}
                />
              </div>
              <div>
                <label className="label" htmlFor={id("dl-interval")}>
                  Lhůta opakování (měsíce)
                </label>
                <input
                  id={id("dl-interval")}
                  type="number"
                  inputMode="numeric"
                  min={1}
                  step={1}
                  className="input"
                  value={deadline.intervalMonths}
                  onChange={(e) => patchDeadline({ intervalMonths: e.target.value })}
                  placeholder="např. 60"
                  aria-invalid={interval === null}
                />
              </div>
            </div>

            <label className="flex min-h-10 cursor-pointer items-start gap-3 text-sm text-stone-800">
              <input
                type="checkbox"
                className="mt-0.5 h-5 w-5 shrink-0 accent-teal-700"
                checked={deadline.intervalConfirmed}
                onChange={(e) => patchDeadline({ intervalConfirmed: e.target.checked })}
              />
              <span>Lhůtu potvrdil revizní technik</span>
            </label>
            {deadline.intervalConfirmed && (
              <div>
                <label className="label" htmlFor={id("dl-by")}>
                  Kdo lhůtu potvrdil
                </label>
                <input
                  id={id("dl-by")}
                  className="input"
                  value={deadline.confirmedBy}
                  onChange={(e) => patchDeadline({ confirmedBy: e.target.value })}
                  placeholder="Jméno, příp. číslo oprávnění"
                />
              </div>
            )}

            <DeadlineOutcome
              existing={existing}
              nextFromDoc={nextValid ? deadline.nextDueDate : undefined}
              computedNext={computedNext}
              interval={effectiveInterval}
            />
            <p className="text-xs text-stone-500">
              {existing
                ? "Opakovaný termín se po provedení posune o lhůtu od data zápisu. Datum uvedené v dokladu má přednost."
                : "Lhůty nevymýšlíme — vyplňte jen to, co stojí v dokladu nebo co potvrdil technik."}
            </p>
          </div>
        )}
      </section>

      {/* --- Zpřesnění modelu --- */}
      {refine && refineEl && (
        <section className="space-y-3 border-t border-stone-100 pt-5">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-stone-900">
            <IconWrench className="h-4 w-4 text-teal-700" />
            Zpřesnění modelu
          </h3>
          <label className="flex min-h-10 cursor-pointer items-start gap-3 text-sm text-stone-800">
            <input
              type="checkbox"
              className="mt-0.5 h-5 w-5 shrink-0 accent-teal-700"
              checked={refineOn}
              onChange={(e) => setRefineOn(e.target.checked)}
            />
            <span className="min-w-0 break-words">
              Zpřesnit polohu prvku <strong className="font-medium">{refineEl.name}</strong>:{" "}
              {(ELEMENT_SOURCES[refine.source] ?? refine.source).toLowerCase()}
              {refineVal ? ` ±${formatMm(refineVal)}` : ""}
            </span>
          </label>
          {refineOn && (
            <div className="space-y-2 rounded-xl bg-stone-50 p-3 sm:p-4">
              <p className="text-xs text-stone-500">Teď: {accuracyLabel(refineEl)}</p>
              <div className="max-w-48">
                <label className="label" htmlFor={id("refine-mm")}>
                  Přesnost polohy (± mm)
                </label>
                <input
                  id={id("refine-mm")}
                  type="number"
                  inputMode="numeric"
                  min={1}
                  step={1}
                  className="input"
                  value={refineMm}
                  onChange={(e) => setRefineMm(e.target.value)}
                  aria-invalid={refineVal === null}
                />
              </div>
              <p className="text-xs text-stone-500">{SAFETY_NOTE}</p>
            </div>
          )}
        </section>
      )}

      {/* --- Potvrzení --- */}
      <div className="space-y-3 border-t border-stone-100 pt-5">
        {problems.length > 0 && (
          <ul className="space-y-0.5 text-xs text-red-700" aria-live="polite">
            {problems.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        )}
        <div className="flex flex-col gap-2 sm:flex-row">
          <button type="button" className="btn-primary min-h-11" onClick={submit} disabled={!canConfirm}>
            <IconCheck className="h-4 w-4" />
            {saving ? "Ukládám…" : (confirmLabel ?? "Potvrdit a zapsat do knihy")}
          </button>
          {onReject && (
            <button type="button" className="btn-secondary min-h-11" onClick={onReject} disabled={saving}>
              Odmítnout
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Náhled přílohy (jako AttachmentThumb), po klepnutí otevře soubor v nové záložce
function PreviewThumb({ m }: { m: Media }) {
  const url = m.dataUrl;
  if (!url) return <AttachmentThumb m={m} />;
  return (
    <button
      type="button"
      onClick={() => openDataUrl(url, m.name)}
      title={`Otevřít ${m.name}`}
      aria-label={`Otevřít ${m.name}`}
      className="group block w-full overflow-hidden rounded-lg border border-stone-200"
    >
      {m.kind === "image" ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt={m.name} className="h-24 w-full object-cover transition group-hover:scale-105" />
      ) : (
        <span className="flex h-24 flex-col items-center justify-center gap-1.5 bg-stone-50 p-2 text-center text-xs text-stone-600">
          <IconFile className="h-6 w-6 text-stone-400" />
          <span className="line-clamp-2 break-all">{m.name}</span>
        </span>
      )}
    </button>
  );
}

// Co se po potvrzení stane s termínem
function DeadlineOutcome({
  existing,
  nextFromDoc,
  computedNext,
  interval,
}: {
  existing?: Reminder;
  nextFromDoc?: string;
  computedNext?: string;
  interval?: number;
}) {
  let text: string;
  if (existing) {
    if (nextFromDoc) text = `Termín se označí jako provedený a další bude ${formatDay(nextFromDoc)}.`;
    else if (computedNext && interval)
      text = `Termín se označí jako provedený a posune se na ${formatDay(computedNext)} (${intervalLabel(interval)}).`;
    else if (interval) text = `Termín se označí jako provedený a posune se o lhůtu (${intervalLabel(interval)}).`;
    else text = "Termín nemá lhůtu opakování — označí se jako splněný.";
  } else if (computedNext) {
    text = `Nový termín: ${formatDay(computedNext)}${interval ? `, pak ${intervalLabel(interval)}` : ""}.`;
  } else {
    return null;
  }
  return (
    <p className="rounded-lg bg-white px-3 py-2 text-xs font-medium text-stone-700 ring-1 ring-stone-200">
      {text}
    </p>
  );
}
