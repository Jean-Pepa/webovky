"use client";

import type { EntryProposal, Media, Property } from "@/lib/store";
import type { ExtractionResult } from "@/lib/submission";

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

// STUB — implementuje agent „AI vyčtení": editovatelný návrh zápisu → potvrzení jedním klepnutím.
// Nic se neuloží bez potvrzení; uložení dělá applyProposal(property.id, upravenýNávrh).
export function ProposalReview(props: ProposalReviewProps) {
  void props;
  return null;
}
