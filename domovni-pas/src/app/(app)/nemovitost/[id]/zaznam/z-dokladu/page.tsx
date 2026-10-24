"use client";

import Link from "next/link";
import { Suspense, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useStore, type EntryProposal, type HouseElement, type Media, type Property, type Reminder } from "@/lib/store";
import { canEditProperty, canSeeProperty } from "@/lib/access";
import { findElement } from "@/lib/elements";
import { DEADLINE_STATE_COLORS, DEADLINE_STATE_LABELS, deadlineState, formatDay } from "@/lib/deadlines";
import { formatFileSize } from "@/lib/format";
import {
  extractDocument,
  extractionContext,
  extractionToProposal,
  fileToDocumentPayload,
  manualExtraction,
  payloadProblem,
  shrinkForStorage,
  type DocumentPayload,
  type ExtractOutcome,
} from "@/lib/extract";
import type { ExtractionResult } from "@/lib/submission";
import { isEntrySaved } from "@/lib/inbox";
import { Loading } from "@/components/Loading";
import { BackLink } from "@/components/BackLink";
import { Badge } from "@/components/ui/Badge";
import { CategoryDot } from "@/components/elements/ElementChip";
import { elementHref } from "@/components/elements/element-utils";
import { ProposalReview } from "@/components/extract/ProposalReview";
import { IconAlert, IconCalendar, IconCamera, IconFile, IconSparkles } from "@/components/Icons";

export default function FromDocumentPage() {
  return (
    <Suspense fallback={<Loading />}>
      <FromDocument />
    </Suspense>
  );
}

function FromDocument() {
  const { id } = useParams<{ id: string }>();
  const search = useSearchParams();
  const prvek = search.get("prvek") ?? undefined;
  const termin = search.get("termin") ?? undefined;
  const { getProperty, hydrated, role } = useStore();
  if (!hydrated) return <Loading />;

  const property = getProperty(id);
  const editable = property && role ? canEditProperty(property, role) : false;
  if (!property || (role && !canSeeProperty(property, role)) || !editable) {
    return (
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-stone-500">
          {!property
            ? "Nemovitost nenalezena."
            : role && !canSeeProperty(property, role)
              ? "K této nemovitosti nemáte přístup."
              : "Tuto nemovitost máte jen ke čtení — zápis z dokladu přidat nelze."}
        </p>
        <Link href={property ? `/nemovitost/${id}` : "/prehled"} className="btn-secondary mt-4">
          {property ? "Zpět na nemovitost" : "Zpět na přehled"}
        </Link>
      </div>
    );
  }

  const element = findElement(property, prvek);
  const reminder = termin ? property.reminders.find((r) => r.id === termin) : undefined;
  const backHref = element ? elementHref(id, element.id) : `/nemovitost/${id}`;

  return (
    <div className="mx-auto max-w-2xl">
      <BackLink href={backHref}>{element ? "Zpět na prvek" : "Zpět na nemovitost"}</BackLink>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight text-stone-900">Zápis z dokladu</h1>
      <p className="mt-1 break-words text-sm text-stone-500">
        {property.name}
        {element ? ` · ${element.name}` : ""}
      </p>

      {(element || reminder) && <ContextChips element={element} reminder={reminder} />}

      <div className="card mt-6 p-4 sm:p-6">
        <DocumentFlow
          key={`${element?.id ?? "-"}:${reminder?.id ?? "-"}`}
          property={property}
          element={element}
          reminder={reminder}
          doneHref={backHref}
        />
      </div>
    </div>
  );
}

// Ke kterému prvku / termínu zápis přidáváme (z ?prvek= a ?termin=)
function ContextChips({ element, reminder }: { element?: HouseElement; reminder?: Reminder }) {
  const state = reminder ? deadlineState(reminder).state : undefined;
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {element && (
        <span className="inline-flex min-h-8 max-w-full items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3 py-1 text-xs font-medium text-stone-700">
          <CategoryDot category={element.category} className="h-2 w-2" />
          <span className="truncate">Prvek: {element.name}</span>
        </span>
      )}
      {reminder && state && (
        <span className="inline-flex min-h-8 max-w-full flex-wrap items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3 py-1 text-xs font-medium text-stone-700">
          <IconCalendar className="h-3.5 w-3.5 shrink-0 text-teal-700" />
          <span className="min-w-0 break-words">
            Termín: {reminder.title} · {reminder.done ? "splněno" : `do ${formatDay(reminder.dueDate)}`}
          </span>
          {!reminder.done && <Badge color={DEADLINE_STATE_COLORS[state]}>{DEADLINE_STATE_LABELS[state]}</Badge>}
        </span>
      )}
    </div>
  );
}

type Picked = {
  file: File;
  payload: DocumentPayload | null; // pro AI (null = soubor neumíme)
  stored: DocumentPayload | null; // kopie k uložení v prohlížeči (menší)
  problem?: string;
};

type Review = {
  key: number;
  proposal: EntryProposal;
  extraction?: ExtractionResult;
  sourceLabel: string;
  notice?: { text: string; retry: boolean };
};

const NOT_AVAILABLE: Record<Exclude<ExtractOutcome, { ok: true }>["reason"], string> = {
  not_configured:
    "AI vyčtení tu zatím není zapnuté (ukázkový režim). Vyplňte údaje z dokladu ručně — doklad se uloží spolu se zápisem.",
  unsupported: "Tenhle typ souboru AI neumí přečíst. Vyplňte údaje ručně, nebo nahrajte fotku či PDF.",
  too_large: "Soubor je na AI vyčtení moc velký. Vyfoťte jen podstatnou stranu, nebo vyplňte údaje ručně.",
  failed: "AI vyčtení se nepovedlo. Zkuste to znovu, nebo vyplňte údaje ručně.",
};

function DocumentFlow({
  property,
  element,
  reminder,
  doneHref,
}: {
  property: Property;
  element?: HouseElement;
  reminder?: Reminder;
  doneHref: string;
}) {
  const router = useRouter();
  const [preparing, setPreparing] = useState(false);
  const [picked, setPicked] = useState<Picked | null>(null);
  const [reading, setReading] = useState(false);
  const [review, setReview] = useState<Review | null>(null);
  const [unsaved, setUnsaved] = useState(false); // plné úložiště prohlížeče — zápis by se ztratil
  const run = useRef(0); // pozdní výsledek po „Zrušit" / jiném souboru zahodíme

  const opts = { elementId: element?.id, reminderId: reminder?.id };

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // stejný soubor půjde vybrat znovu
    if (!file) return;
    const my = ++run.current;
    setReview(null);
    setPicked(null);
    setReading(false);
    setPreparing(true);
    const payload = await fileToDocumentPayload(file);
    const stored = payload ? await shrinkForStorage(payload) : null;
    if (my !== run.current) return;
    setPreparing(false);
    setPicked({ file, payload, stored, problem: payload ? undefined : payloadProblem(file) });
  }

  function manualReview(p: Picked, notice?: Review["notice"]) {
    const result = manualExtraction(p.file.name, reminder ? "INSPECTION" : "REPAIR");
    // bez čitelné kopie uložíme aspoň název souboru
    const doc = p.stored ?? { name: p.file.name, mediaType: p.file.type, dataUrl: "" };
    const proposal = extractionToProposal(property, result, doc, opts);
    // v dokladu nejsou data vyčtená AI
    proposal.documents = proposal.documents?.map((d) => ({ ...d, extracted: undefined }));
    setReview({
      key: ++run.current,
      proposal,
      sourceLabel: `Vyplňte údaje podle dokladu „${p.file.name}“`,
      notice,
    });
  }

  async function read(p: Picked) {
    if (!p.payload) return;
    const my = ++run.current;
    setReview(null);
    setReading(true);
    const outcome = await extractDocument(p.payload, extractionContext(property));
    if (my !== run.current) return;
    setReading(false);
    if (outcome.ok) {
      setReview({
        key: my,
        proposal: extractionToProposal(property, outcome.result, p.stored ?? p.payload, opts),
        extraction: outcome.result,
        sourceLabel: `Vyčteno AI z dokladu „${p.payload.name}“`,
      });
      return;
    }
    const text =
      outcome.reason === "unsupported"
        ? (p.problem ?? NOT_AVAILABLE.unsupported)
        : (outcome.message ?? NOT_AVAILABLE[outcome.reason]);
    manualReview(p, { text, retry: outcome.reason === "failed" });
  }

  function cancelRead() {
    run.current++; // výsledek, který ještě doběhne, zahodíme
    setReading(false);
  }

  function reset() {
    run.current++;
    setPicked(null);
    setReview(null);
    setReading(false);
    setPreparing(false);
  }

  function previews(p: Picked): Media[] {
    const src = p.payload ?? p.stored;
    if (src?.mediaType.startsWith("image/")) {
      return [{ id: "doklad", name: src.name, kind: "image", dataUrl: src.dataUrl }];
    }
    return [{ id: "doklad", name: p.file.name, kind: "file", dataUrl: src?.dataUrl || undefined }];
  }

  // Po potvrzení ověříme, že se zápis do úložiště prohlížeče opravdu vešel
  async function afterConfirm(entryId: string) {
    if (await isEntrySaved(entryId)) router.push(doneHref);
    else setUnsaved(true);
  }

  if (unsaved) {
    return (
      <div role="alert" className="space-y-3 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
        <p className="flex items-center gap-2 font-semibold">
          <IconAlert className="h-5 w-5 shrink-0 text-amber-600" />
          Zápis se nepodařilo trvale uložit
        </p>
        <p>
          Úložiště tohoto prohlížeče je plné, takže zápis zůstane v knize jen do zavření nebo
          obnovení stránky. Když uvolníte místo (třeba smažete velké dokumenty nebo fotky), uloží
          se s další změnou v knize. Originál dokladu si zatím nechte.
        </p>
        <Link href={doneHref} className="btn-secondary min-h-10">
          Pokračovat
        </Link>
      </div>
    );
  }

  // --- 2. krok: kontrola návrhu ---
  if (review && picked) {
    return (
      <div className="space-y-4">
        {review.notice && (
          <div role="status" className="flex items-start gap-3 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">
            <IconAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
            <div className="min-w-0 flex-1">
              <p className="break-words">{review.notice.text}</p>
              {review.notice.retry && picked.payload && (
                <button
                  type="button"
                  onClick={() => read(picked)}
                  className="btn-secondary btn-sm mt-2 min-h-10"
                >
                  <IconSparkles className="h-4 w-4" />
                  Zkusit AI znovu
                </button>
              )}
            </div>
          </div>
        )}
        <ProposalReview
          key={review.key}
          property={property}
          proposal={review.proposal}
          extraction={review.extraction}
          sourceLabel={review.sourceLabel}
          previews={previews(picked)}
          onConfirm={(entryId) => void afterConfirm(entryId)}
          onReject={reset}
        />
      </div>
    );
  }

  // --- 1. krok: výběr dokladu ---
  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-teal-50 text-teal-700">
          <IconSparkles className="h-5 w-5" />
        </span>
        <div className="min-w-0 text-sm text-stone-600">
          <p>
            Vyfoťte nebo nahrajte revizní zprávu, servisní protokol, fakturu či záruční list. AI z něj
            vyčte druh práce, výsledek, zařízení a další termín.
          </p>
          <p className="mt-1.5">
            Je to jen <strong className="font-medium text-stone-800">návrh</strong> — zkontrolujete ho a
            potvrdíte jedním klepnutím. Nic se neuloží bez vašeho potvrzení.
          </p>
        </div>
      </div>

      {!picked && !preparing && (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="btn-primary min-h-12 cursor-pointer focus-within:ring-2 focus-within:ring-teal-600/40">
              <IconCamera className="h-5 w-5" />
              Vyfotit doklad
              <input
                type="file"
                accept="image/*"
                capture="environment"
                className="sr-only"
                onChange={onFile}
              />
            </label>
            <label className="btn-secondary min-h-12 cursor-pointer focus-within:ring-2 focus-within:ring-teal-600/40">
              <IconFile className="h-5 w-5" />
              Vybrat soubor (foto / PDF)
              <input type="file" accept="image/*,application/pdf" className="sr-only" onChange={onFile} />
            </label>
          </div>
          <p className="text-xs text-stone-400">
            Fotky se zmenší, ale zůstanou čitelné. PDF do 3 MB. Bez dokladu?{" "}
            <Link
              href={`/nemovitost/${property.id}/zaznam/novy${element ? `?prvek=${encodeURIComponent(element.id)}` : ""}`}
              className="font-medium text-teal-700 hover:underline"
            >
              Přidat záznam ručně
            </Link>
          </p>
        </>
      )}

      {preparing && <Busy text="Připravuji soubor…" />}

      {picked && (
        <div className="space-y-4">
          <FileRow picked={picked} />

          {picked.problem && (
            <div role="status" className="flex items-start gap-3 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">
              <IconAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
              <p className="min-w-0 break-words">{picked.problem}</p>
            </div>
          )}

          {reading ? (
            <div className="space-y-3">
              <Busy text="Čtu doklad… obvykle to trvá 10–40 sekund." />
              <button type="button" onClick={cancelRead} className="btn-ghost min-h-10 w-full sm:w-auto">
                Zrušit
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              {picked.payload && (
                <button type="button" onClick={() => read(picked)} className="btn-primary min-h-11">
                  <IconSparkles className="h-4 w-4" />
                  Vyčíst údaje
                </button>
              )}
              <button
                type="button"
                onClick={() => manualReview(picked)}
                className={`${picked.payload ? "btn-secondary" : "btn-primary"} min-h-11`}
              >
                Vyplnit ručně
              </button>
              <button type="button" onClick={reset} className="btn-ghost min-h-11">
                Vybrat jiný doklad
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function FileRow({ picked }: { picked: Picked }) {
  const img = picked.payload?.mediaType.startsWith("image/") ? picked.payload : undefined;
  return (
    <div className="flex items-center gap-3 rounded-xl border border-stone-200 p-3">
      {img ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={img.dataUrl} alt="" className="h-16 w-16 shrink-0 rounded-lg border border-stone-200 object-cover" />
      ) : (
        <span className="grid h-16 w-16 shrink-0 place-items-center rounded-lg bg-stone-100 text-stone-500">
          <IconFile className="h-6 w-6" />
        </span>
      )}
      <div className="min-w-0 flex-1">
        <p className="break-all text-sm font-medium text-stone-800">{picked.file.name}</p>
        <p className="text-xs text-stone-400">{formatFileSize(picked.file.size)}</p>
      </div>
    </div>
  );
}

function Busy({ text }: { text: string }) {
  return (
    <div role="status" aria-live="polite" className="flex items-center gap-3 rounded-xl bg-stone-50 p-4 text-sm text-stone-600">
      <span className="h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-teal-700 border-t-transparent" aria-hidden />
      {text}
    </div>
  );
}
