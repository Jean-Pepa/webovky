// STUB — implementuje agent „AI vyčtení". Podpisy jsou závazné (používá je i stránka řemeslníka).

import type { EntryProposal, Property } from "./store";
import type { ExtractionContext, ExtractionResult } from "./submission";

export type DocumentPayload = { name: string; mediaType: string; dataUrl: string };

export type ExtractOutcome =
  | { ok: true; result: ExtractionResult }
  | { ok: false; reason: "not_configured" | "unsupported" | "too_large" | "failed"; message?: string };

// Připraví soubor (foto / PDF) pro AI: obrázky zmenší (čitelně), PDF pošle celé (do limitu).
export async function fileToDocumentPayload(file: File): Promise<DocumentPayload | null> {
  void file;
  return null;
}

// Zavolá /api/extract. Bez ANTHROPIC_API_KEY vrátí { ok: false, reason: "not_configured" }.
export async function extractDocument(
  doc: DocumentPayload,
  context: ExtractionContext,
): Promise<ExtractOutcome> {
  void doc;
  void context;
  return { ok: false, reason: "not_configured" };
}

// Kontext pro AI z domu (jen názvy prvků, žádná citlivá data)
export function extractionContext(property: Property, onlyElementId?: string): ExtractionContext {
  const elements = (property.elements ?? [])
    .filter((e) => !onlyElementId || e.id === onlyElementId)
    .map((e) => ({ id: e.id, name: e.name, category: e.category, kind: e.kind, room: e.room }));
  return { propertyName: property.name, elements };
}

// Z vyčtených dat udělá návrh zápisu (doklad + zápis + termín) pro ProposalReview.
export function extractionToProposal(
  property: Property,
  result: ExtractionResult,
  doc: DocumentPayload | null,
  opts?: { elementId?: string; reminderId?: string },
): EntryProposal {
  void property;
  void doc;
  void opts;
  return {
    entry: { type: result.workType, title: result.title, date: result.date ?? "", media: [] },
  };
}
