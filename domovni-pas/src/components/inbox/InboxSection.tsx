"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { EntryProposal, Media, Property } from "@/lib/store";
import { INVITE_ROLES, WORK_TYPES, type Submission } from "@/lib/submission";
import {
  INBOX_STORAGE_KEY,
  fetchInbox,
  isConfirmedEntrySaved,
  loadSubmissionFiles,
  removeSubmission,
  type InboxItem,
} from "@/lib/inbox";
import { submissionSourceLabel, submissionToProposal } from "@/lib/submission-proposal";
import { elementName } from "@/lib/elements";
import { formatDay, pluralCs } from "@/lib/deadlines";
import { ProposalReview } from "@/components/extract/ProposalReview";
import { Badge } from "@/components/ui/Badge";
import { IconArrowLeft, IconCheck, IconClose, IconFile, IconSparkles, IconUsers } from "@/components/Icons";

type Review = {
  submission: Submission;
  proposal: EntryProposal;
  previews: Media[];
  missing: number; // soubory, které už na serveru nejsou
};

const NOT_SAVED =
  "Zápis se nepodařilo trvale uložit — úložiště tohoto prohlížeče je plné a po obnovení stránky by zmizel. " +
  "Proto ho nechávám i mezi čekajícími. Uvolněte místo (třeba smažte velké fotky nebo dokumenty), " +
  "nebo ho po obnovení stránky potvrďte znovu.";

// „Čeká na tebe" — zápisy od řemeslníků přes pozvánku. Do knihy se uloží až po potvrzení majitelem.
export function InboxSection({ property, editable }: { property: Property; editable: boolean }) {
  if (!editable) return null;
  return <Inbox property={property} />;
}

function Inbox({ property }: { property: Property }) {
  const pid = property.id;
  const ownerKey = property.ownerKey;
  const [reloadKey, setReloadKey] = useState(0);
  const [data, setData] = useState<{ items: InboxItem[]; error?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [review, setReview] = useState<Review | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    fetchInbox({ id: pid, ownerKey }).then((r) => {
      if (!alive) return;
      setData(r);
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, [pid, ownerKey, reloadKey]);

  // Ukázkový režim: zápis odeslaný v jiné záložce tohoto prohlížeče
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === INBOX_STORAGE_KEY) setReloadKey((k) => k + 1);
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Zápisy, které už v knize jsou (potvrzené dřív), jen dočistíme z inboxu
  const confirmed = new Set(property.entries.map((e) => e.submissionId).filter(Boolean));
  const items = (data?.items ?? []).filter((i) => !confirmed.has(i.submission.id));
  const staleKey = (data?.items ?? [])
    .filter((i) => confirmed.has(i.submission.id))
    .map((i) => i.submission.id)
    .join(",");
  useEffect(() => {
    if (!staleKey) return;
    let alive = true;
    for (const subId of staleKey.split(",")) {
      // jen když je zápis v knize opravdu uložený (plné úložiště ho tiše neuloží)
      void isConfirmedEntrySaved(subId).then((saved) => {
        if (alive && saved) void removeSubmission({ id: pid, ownerKey }, subId);
      });
    }
    return () => {
      alive = false;
    };
  }, [staleKey, pid, ownerKey]);

  function reload() {
    setLoading(true);
    setReloadKey((k) => k + 1);
  }

  async function openReview(item: InboxItem) {
    setActionError(null);
    setNotice(null);
    setBusyId(item.submission.id);
    try {
      const full = await loadSubmissionFiles({ id: pid, ownerKey }, item.submission);
      const proposal = submissionToProposal(property, full);
      const previews: Media[] = full.attachments
        .filter((a) => a.kind === "image" && a.dataUrl)
        .map((a) => ({ id: a.id, name: a.name, kind: "image", dataUrl: a.dataUrl }));
      setReview({
        submission: full,
        proposal,
        previews,
        missing: full.attachments.filter((a) => !a.dataUrl).length,
      });
    } catch (e) {
      setActionError(e instanceof Error && e.message ? e.message : "Zápis se nepodařilo načíst.");
    } finally {
      setBusyId(null);
    }
  }

  async function afterConfirm(sub: Submission) {
    setReview(null);
    setActionError(null);
    // kopii z inboxu smažeme, až když je zápis v knize opravdu uložený
    if (!(await isConfirmedEntrySaved(sub.id))) {
      setActionError(NOT_SAVED);
      return;
    }
    setNotice(`Zápis „${sub.title}“ je v knize domu.`);
    const r = await removeSubmission({ id: pid, ownerKey }, sub.id);
    if (!r.ok) setActionError(`Zápis je v knize, jen ho nešlo odebrat z čekajících: ${r.message}`);
    reload();
  }

  async function reject(sub: Submission) {
    if (!confirm(`Odmítnout zápis „${sub.title}“ od ${sub.author.name}? Do knihy se nezapíše a smaže se.`)) {
      return;
    }
    setActionError(null);
    setBusyId(sub.id);
    const r = await removeSubmission({ id: pid, ownerKey }, sub.id);
    setBusyId(null);
    if (!r.ok) {
      setActionError(r.message);
      return;
    }
    setReview(null);
    setNotice("Zápis odmítnut — do knihy se nezapsal.");
    reload();
  }

  // Nic nečeká a nic se nepokazilo → sekci nezobrazujeme
  if (!data) return null;
  if (items.length === 0 && !data.error && !actionError && !notice && !review) return null;

  return (
    <section id="ceka-na-tebe" className="card mt-6 scroll-mt-24 border-teal-200 p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <IconUsers className="h-4 w-4 shrink-0 text-teal-700" />
          <h2 className="text-sm font-semibold text-stone-900">Čeká na tebe</h2>
          {items.length > 0 && <Badge color="teal">{items.length}</Badge>}
        </div>
        <div className="flex items-center gap-1">
          <Link
            href={`/nemovitost/${pid}/pozvanky`}
            className="btn-ghost btn-sm min-h-10 text-teal-700"
          >
            Pozvat řemeslníka
          </Link>
          <button
            type="button"
            onClick={reload}
            disabled={loading}
            className="btn-ghost btn-sm min-h-10"
          >
            {loading ? "Načítám…" : "Obnovit"}
          </button>
        </div>
      </div>
      <p className="mt-1 text-xs text-stone-500">
        Zápisy od řemeslníků a revizních techniků. Do knihy se uloží, až je zkontrolujete a
        potvrdíte.
      </p>

      {notice && (
        <div
          role="status"
          className="mt-3 flex items-start gap-2 rounded-lg bg-emerald-50 p-3 text-xs text-emerald-800"
        >
          <IconCheck className="mt-0.5 h-4 w-4 shrink-0" />
          <p className="min-w-0 flex-1 break-words">{notice}</p>
          <button
            type="button"
            onClick={() => setNotice(null)}
            className="-m-2 grid h-10 w-10 shrink-0 place-items-center text-emerald-700 hover:text-emerald-900"
            aria-label="Zavřít"
          >
            <IconClose className="h-4 w-4" />
          </button>
        </div>
      )}

      {(data.error || actionError) && (
        <div role="alert" className="mt-3 rounded-lg bg-red-50 p-3 text-xs text-red-700">
          {actionError && <p className="break-words">{actionError}</p>}
          {data.error && (
            <p className="break-words">
              {data.error}{" "}
              <button type="button" onClick={reload} className="inline-flex min-h-10 items-center font-medium underline">
                Zkusit znovu
              </button>
            </p>
          )}
        </div>
      )}

      {review ? (
        <div className="mt-3 border-t border-stone-100 pt-3">
          <button
            type="button"
            onClick={() => setReview(null)}
            className="-ml-2 inline-flex min-h-10 items-center gap-1.5 px-2 text-sm text-stone-500 hover:text-stone-800"
          >
            <IconArrowLeft className="h-4 w-4" />
            Zpět na čekající
          </button>
          {review.missing > 0 && (
            <p className="mt-2 rounded-lg bg-amber-50 p-3 text-xs text-amber-800">
              {review.missing} {pluralCs(review.missing, "soubor už není", "soubory už nejsou", "souborů už není")}{" "}
              k dispozici (na serveru se drží půl roku). Zbytek zápisu můžete potvrdit.
            </p>
          )}
          <div className="mt-2">
            <ProposalReview
              key={review.submission.id}
              property={property}
              proposal={review.proposal}
              extraction={review.submission.extracted}
              sourceLabel={submissionSourceLabel(review.submission)}
              previews={review.previews}
              onConfirm={() => afterConfirm(review.submission)}
              onReject={() => reject(review.submission)}
            />
          </div>
        </div>
      ) : (
        items.length > 0 && (
          <ul className="mt-2 divide-y divide-stone-100">
            {items.map((item) => (
              <SubmissionRow
                key={item.submission.id}
                item={item}
                property={property}
                busy={busyId === item.submission.id}
                disabled={busyId !== null}
                onOpen={() => openReview(item)}
                onReject={() => reject(item.submission)}
              />
            ))}
          </ul>
        )
      )}
    </section>
  );
}

function SubmissionRow({
  item,
  property,
  busy,
  disabled,
  onOpen,
  onReject,
}: {
  item: InboxItem;
  property: Property;
  busy: boolean;
  disabled: boolean;
  onOpen: () => void;
  onReject: () => void;
}) {
  const sub = item.submission;
  const el = elementName(property, sub.elementId);
  const files = sub.attachments.length;
  const docs = sub.attachments.filter((a) => a.role !== "PHOTO").length;
  const photos = files - docs;

  return (
    <li className="py-3">
      <div className="flex flex-wrap items-center gap-1.5">
        <Badge color={sub.author.role === "INSPECTOR" ? "violet" : "blue"}>
          {INVITE_ROLES[sub.author.role] ?? sub.author.role}
        </Badge>
        <Badge color="gray">{WORK_TYPES[sub.workType] ?? sub.workType}</Badge>
        {sub.extracted && (
          <Badge color="amber">
            <IconSparkles className="mr-1 h-3 w-3" />
            AI předvyplnilo
          </Badge>
        )}
        {item.source === "local" && <Badge color="gray">Ukázkový režim</Badge>}
      </div>
      <p className="mt-1.5 break-words text-sm font-medium text-stone-900">{sub.title}</p>
      <p className="mt-0.5 break-words text-xs text-stone-500">
        {sub.author.name}
        {sub.author.company ? ` · ${sub.author.company}` : ""}
        {sub.author.phone ? (
          <>
            {" · "}
            <a href={`tel:${sub.author.phone.replace(/\s/g, "")}`} className="text-teal-700 hover:underline">
              {sub.author.phone}
            </a>
          </>
        ) : null}
      </p>
      <p className="mt-0.5 break-words text-xs text-stone-500">
        {formatDay(sub.date)}
        {el ? ` · ${el}` : sub.elementId ? " · prvek už v knize není" : ""}
      </p>
      {files > 0 && (
        <p className="mt-1 flex items-center gap-1 text-xs text-stone-500">
          <IconFile className="h-3.5 w-3.5 shrink-0" />
          {docs > 0 && `${docs} ${pluralCs(docs, "doklad", "doklady", "dokladů")}`}
          {docs > 0 && photos > 0 && " · "}
          {photos > 0 && `${photos} ${pluralCs(photos, "fotka", "fotky", "fotek")}`}
        </p>
      )}
      <div className="mt-2.5 flex flex-wrap gap-2">
        <button type="button" onClick={onOpen} disabled={disabled} className="btn-primary btn-sm min-h-10">
          {busy ? "Načítám…" : "Zkontrolovat a potvrdit"}
        </button>
        <button type="button" onClick={onReject} disabled={disabled} className="btn-ghost btn-sm min-h-10">
          Odmítnout
        </button>
      </div>
    </li>
  );
}
