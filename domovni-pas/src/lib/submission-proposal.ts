// Zápis od řemeslníka: validace odeslání (sdílí server i ukázkový režim v prohlížeči)
// a převod potvrzovaného zápisu na návrh pro ProposalReview.
// Bez "use client" a bez přístupu k prohlížeči — importují ho i serverové routy.

import type { DocumentInput, EntryProposal, Media, Property, ReminderType } from "./store";
import {
  INSPECTION_RESULTS,
  INVITE_ROLES,
  SUBMISSION_LIMITS,
  WORK_TYPES,
  type ExtractedDocKind,
  type ExtractionResult,
  type InspectionResult,
  type InvitePublic,
  type InviteRole,
  type Submission,
  type SubmissionFile,
  type SubmissionFileRole,
  type WorkType,
} from "./submission";
import { accuracyClass, DEFAULT_ACCURACY_MM, findElement } from "./elements";

// Co posílá řemeslník (id, token, dům, čas a roli autora doplní server podle pozvánky)
export type SubmissionPayload = {
  elementId?: string;
  author: { name: string; company?: string; phone?: string };
  workType: WorkType;
  title: string;
  description?: string;
  date: string;
  cost?: number;
  result?: InspectionResult;
  nextDueDate?: string;
  intervalMonths?: number;
  measuredOpenWall?: boolean;
  attachments: SubmissionFile[]; // vč. dataUrl
  extracted?: ExtractionResult;
};

export type SubmissionData = Omit<Submission, "id" | "token" | "propertyId" | "createdAt">;

export type Validated<T> = { ok: true; value: T } | { ok: false; error: string; message: string };

export const TEXT_LIMITS = {
  title: 200,
  description: 4000,
  name: 120,
  company: 120,
  phone: 40,
  fileName: 200,
  propertyName: 200,
  city: 120,
};

// Max. počet zápisů přes jednu pozvánku
export const MAX_SUBMISSIONS_PER_INVITE = 20;

// Token pozvánky / klíč majitele (base64url, 16–64 znaků)
export const TOKEN_RE = /^[A-Za-z0-9_-]{16,64}$/;
// Id domu, prvku, souboru, zápisu
export const ID_RE = /^[A-Za-z0-9_-]{1,64}$/;
// Povolené přílohy: JPG / PNG / WebP / PDF jako base64 data URL
export const DATA_URL_RE = /^data:(image\/(?:jpeg|png|webp)|application\/pdf);base64,[A-Za-z0-9+/]+={0,2}$/;

const ISO_RE = /^\d{4}-\d{2}-\d{2}$/;

export function isIsoDate(v: unknown): v is string {
  if (typeof v !== "string" || !ISO_RE.test(v)) return false;
  const [y, m, d] = v.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
}

// Dnešek v české časové zóně (server běží v UTC, platnost pozvánky se počítá po dnech)
export function todayIso(now: Date = new Date()): string {
  try {
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Prague",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(now);
    const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
    const iso = `${get("year")}-${get("month")}-${get("day")}`;
    if (isIsoDate(iso)) return iso;
  } catch {
    // bez ICU časových zón — spadneme na UTC
  }
  return now.toISOString().slice(0, 10);
}

// Platí včetně dne expiresAt
export function isInviteExpired(invite: { expiresAt: string }, today: string = todayIso()): boolean {
  return today > invite.expiresAt;
}

// --- Validace ------------------------------------------------------------------

class Invalid extends Error {
  constructor(
    public code: string,
    message: string,
  ) {
    super(message);
  }
}

function fail(code: string, message: string): never {
  throw new Invalid(code, message);
}

function run<T>(fn: () => T): Validated<T> {
  try {
    return { ok: true, value: fn() };
  } catch (e) {
    if (e instanceof Invalid) return { ok: false, error: e.code, message: e.message };
    return { ok: false, error: "invalid", message: "Neplatná data." };
  }
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function optText(v: unknown, max: number, label: string): string | undefined {
  if (v == null) return undefined;
  if (typeof v !== "string") fail("invalid", `Pole „${label}“ má neplatnou hodnotu.`);
  const s = v.trim();
  if (!s) return undefined;
  if (s.length > max) fail("too_long", `Pole „${label}“ je příliš dlouhé (max. ${max} znaků).`);
  return s;
}

function reqText(v: unknown, max: number, label: string, missing: string): string {
  const s = optText(v, max, label);
  if (!s) fail("missing", missing);
  return s;
}

// Text, který jen zkrátíme (názvy souborů, výstup AI)
function clip(v: unknown, max: number): string | null {
  if (typeof v !== "string") return null;
  const s = v.trim();
  return s ? s.slice(0, max) : null;
}

function optId(v: unknown, label: string): string | undefined {
  if (v == null || v === "") return undefined;
  if (typeof v !== "string" || !ID_RE.test(v)) fail("invalid", `Pole „${label}“ má neplatnou hodnotu.`);
  return v;
}

function optDate(v: unknown, label: string): string | undefined {
  if (v == null || v === "") return undefined;
  if (!isIsoDate(v)) fail("invalid_date", `Pole „${label}“ není platné datum.`);
  return v;
}

function optNumber(v: unknown, label: string, max: number): number | undefined {
  if (v == null || v === "") return undefined;
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0 || v > max) {
    fail("invalid_number", `Pole „${label}“ musí být nezáporné číslo.`);
  }
  return v;
}

function oneOf<T extends string>(v: unknown, map: Record<T, string>): T | undefined {
  return typeof v === "string" && Object.prototype.hasOwnProperty.call(map, v) ? (v as T) : undefined;
}

// Veřejné údaje pozvánky (PUT od majitele) — jen známá pole, ořezané délky
export function validateInvitePublic(raw: unknown): Validated<InvitePublic> {
  return run(() => {
    if (!isRecord(raw)) fail("invalid", "Neplatná pozvánka.");
    if (typeof raw.token !== "string" || !TOKEN_RE.test(raw.token)) {
      fail("invalid_token", "Neplatný token pozvánky.");
    }
    if (typeof raw.propertyId !== "string" || !ID_RE.test(raw.propertyId)) {
      fail("invalid", "Neplatné id domu.");
    }
    const role = oneOf<InviteRole>(raw.role, INVITE_ROLES);
    if (!role) fail("invalid", "Neplatná role pozvánky.");
    if (!isIsoDate(raw.expiresAt)) fail("invalid_date", "Neplatná platnost pozvánky.");
    const elementId = optId(raw.elementId, "Prvek");

    let elements: InvitePublic["elements"];
    if (raw.elements != null) {
      if (!Array.isArray(raw.elements) || raw.elements.length > 500) fail("invalid", "Neplatný seznam prvků.");
      elements = raw.elements.map((e) => {
        if (!isRecord(e)) fail("invalid", "Neplatný prvek.");
        const id = optId(e.id, "Prvek");
        if (!id) fail("invalid", "Neplatný prvek.");
        return {
          id,
          name: reqText(e.name, 200, "Název prvku", "Prvek nemá název."),
          category: reqText(e.category, 40, "Kategorie prvku", "Prvek nemá kategorii."),
          kind: optText(e.kind, 120, "Druh prvku"),
          room: optText(e.room, 120, "Místnost"),
        };
      });
      // pozvánka k jednomu prvku nesmí prozradit ostatní
      if (elementId) elements = elements.filter((e) => e.id === elementId);
    }

    return {
      token: raw.token,
      propertyId: raw.propertyId,
      propertyName: reqText(raw.propertyName, TEXT_LIMITS.propertyName, "Název domu", "Chybí název domu."),
      city: optText(raw.city, TEXT_LIMITS.city, "Obec"),
      elementId,
      elementName: elementId ? optText(raw.elementName, 200, "Název prvku") : undefined,
      elementCategory: elementId ? optText(raw.elementCategory, 40, "Kategorie prvku") : undefined,
      role,
      expiresAt: raw.expiresAt,
      elements,
    };
  });
}

const DOC_KINDS: Record<ExtractedDocKind, string> = {
  PROTOCOL: "",
  INVOICE: "",
  WARRANTY: "",
  OTHER: "",
};
const CONFIDENCE = { HIGH: "", MEDIUM: "", LOW: "" };

function numOrNull(v: unknown, max: number): number | null {
  return typeof v === "number" && Number.isFinite(v) && v >= 0 && v <= max ? v : null;
}

function strList(v: unknown, maxItems: number, maxLen: number): string[] {
  if (!Array.isArray(v)) return [];
  return v
    .map((s) => clip(s, maxLen))
    .filter((s): s is string => !!s)
    .slice(0, maxItems);
}

// Výstup AI je jen nápověda — neplatná pole vynulujeme, nic neodmítáme
export function sanitizeExtraction(raw: unknown): ExtractionResult | undefined {
  if (!isRecord(raw)) return undefined;
  return {
    docKind: oneOf<ExtractedDocKind>(raw.docKind, DOC_KINDS) ?? "OTHER",
    workType: oneOf<WorkType>(raw.workType, WORK_TYPES) ?? "OTHER",
    title: clip(raw.title, TEXT_LIMITS.title) ?? "",
    summary: clip(raw.summary, 2000) ?? "",
    date: isIsoDate(raw.date) ? raw.date : null,
    result: oneOf<InspectionResult>(raw.result, INSPECTION_RESULTS) ?? null,
    device: clip(raw.device, 200),
    elementId: typeof raw.elementId === "string" && ID_RE.test(raw.elementId) ? raw.elementId : null,
    nextDueDate: isIsoDate(raw.nextDueDate) ? raw.nextDueDate : null,
    intervalMonths: numOrNull(raw.intervalMonths, 1200),
    cost: numOrNull(raw.cost, 1e9),
    supplier: clip(raw.supplier, 200),
    technician: clip(raw.technician, 200),
    defects: strList(raw.defects, 30, 300),
    confidence: oneOf<"HIGH" | "MEDIUM" | "LOW">(raw.confidence, CONFIDENCE) ?? "LOW",
    warnings: strList(raw.warnings, 20, 300),
  };
}

const FILE_ROLES: Record<SubmissionFileRole, string> = { PROTOCOL: "", INVOICE: "", PHOTO: "" };

function validateAttachments(raw: unknown): SubmissionFile[] {
  if (raw == null) return [];
  if (!Array.isArray(raw)) fail("invalid", "Neplatné přílohy.");
  if (raw.length > SUBMISSION_LIMITS.maxFiles) {
    fail("too_many_files", `Najednou lze poslat nejvýš ${SUBMISSION_LIMITS.maxFiles} souborů.`);
  }
  const ids = new Set<string>();
  let total = 0;
  return raw.map((a) => {
    if (!isRecord(a)) fail("invalid", "Neplatná příloha.");
    const id = optId(a.id, "Příloha");
    if (!id || ids.has(id)) fail("invalid", "Neplatná příloha.");
    ids.add(id);
    const name = clip(a.name, TEXT_LIMITS.fileName) ?? "příloha";
    const role = oneOf<SubmissionFileRole>(a.role, FILE_ROLES);
    if (!role) fail("invalid", `Příloha „${name}“ nemá určený druh.`);
    if (typeof a.dataUrl !== "string" || !a.dataUrl) fail("invalid", `Příloha „${name}“ je prázdná.`);
    if (a.dataUrl.length > SUBMISSION_LIMITS.maxFileBytes) {
      fail("file_too_large", `Soubor „${name}“ je příliš velký (max. asi 1 MB).`);
    }
    const m = DATA_URL_RE.exec(a.dataUrl);
    if (!m) fail("bad_file", `Soubor „${name}“ má nepodporovaný formát — pošlete JPG, PNG, WebP nebo PDF.`);
    const mediaType = m[1];
    if (a.mediaType != null && a.mediaType !== mediaType) {
      fail("bad_file", `U souboru „${name}“ nesedí typ souboru.`);
    }
    const kind = mediaType.startsWith("image/") ? "image" : "file";
    if (role === "PHOTO" && kind !== "image") fail("bad_file", `Fotka „${name}“ musí být obrázek.`);
    total += a.dataUrl.length;
    if (total > SUBMISSION_LIMITS.maxTotalBytes) {
      fail("too_large_total", "Přílohy jsou dohromady příliš velké (max. asi 4 MB). Uberte prosím fotky.");
    }
    return { id, name, kind, mediaType, role, size: a.dataUrl.length, dataUrl: a.dataUrl };
  });
}

// Zápis od řemeslníka proti pozvánce. Roli autora určuje pozvánka, ne odesílatel.
export function validateSubmissionPayload(raw: unknown, invite: InvitePublic): Validated<SubmissionData> {
  return run(() => {
    if (!isRecord(raw)) fail("invalid", "Neplatná data zápisu.");
    const author = raw.author ?? {};
    if (!isRecord(author)) fail("invalid", "Neplatné údaje o autorovi.");

    const workType = oneOf<WorkType>(raw.workType, WORK_TYPES);
    if (!workType) fail("invalid", "Vyberte prosím typ práce.");

    const date = optDate(raw.date, "Datum");
    if (!date) fail("missing", "Vyplňte prosím datum.");

    let result: InspectionResult | undefined;
    if (raw.result != null && raw.result !== "") {
      result = oneOf<InspectionResult>(raw.result, INSPECTION_RESULTS);
      if (!result) fail("invalid", "Neplatný výsledek revize.");
    }

    const interval = optNumber(raw.intervalMonths, "Lhůta (měsíce)", 1200);
    const intervalMonths = interval != null && Math.round(interval) > 0 ? Math.round(interval) : undefined;

    // Prvek: u pozvánky k prvku jen ten, jinak jeden z prvků pozvánky (nebo žádný)
    let elementId = optId(raw.elementId, "Prvek");
    if (invite.elementId) {
      if (elementId && elementId !== invite.elementId) {
        fail("invalid_element", "Tato pozvánka platí jen pro jeden prvek domu.");
      }
      elementId = invite.elementId;
    } else if (elementId && !(invite.elements ?? []).some((e) => e.id === elementId)) {
      fail("invalid_element", "Vybraný prvek k této pozvánce nepatří.");
    }

    // AI smí přiřadit jen prvek, ke kterému pozvánka platí
    const extracted = sanitizeExtraction(raw.extracted);
    if (extracted?.elementId) {
      const allowed = invite.elementId
        ? extracted.elementId === invite.elementId
        : (invite.elements ?? []).some((e) => e.id === extracted.elementId);
      if (!allowed) extracted.elementId = null;
    }

    return {
      elementId,
      author: {
        name: reqText(author.name, TEXT_LIMITS.name, "Jméno", "Vyplňte prosím své jméno."),
        company: optText(author.company, TEXT_LIMITS.company, "Firma"),
        phone: optText(author.phone, TEXT_LIMITS.phone, "Telefon"),
        role: invite.role,
      },
      workType,
      title: reqText(raw.title, TEXT_LIMITS.title, "Co se dělalo", "Vyplňte prosím, co se dělalo."),
      description: optText(raw.description, TEXT_LIMITS.description, "Popis"),
      date,
      cost: optNumber(raw.cost, "Cena", 1e9),
      result,
      nextDueDate: optDate(raw.nextDueDate, "Další termín"),
      intervalMonths,
      measuredOpenWall: raw.measuredOpenWall === true ? true : undefined,
      attachments: validateAttachments(raw.attachments),
      extracted,
    };
  });
}

// --- Návrh zápisu pro potvrzení majitelem ----------------------------------------

const DOC_TITLES: Record<"PROTOCOL" | "INVOICE", string> = {
  PROTOCOL: "Protokol",
  INVOICE: "Faktura",
};

// Odeslání řemeslníka (s načtenými přílohami) → návrh zápisu. Nic neukládá.
export function submissionToProposal(property: Property, sub: Submission): EntryProposal {
  const element = findElement(property, sub.elementId);
  const elementIds = element ? [element.id] : undefined;

  const media: Media[] = sub.attachments
    .filter((a) => a.role === "PHOTO" && a.dataUrl)
    .map((a) => ({ id: a.id, name: a.name, kind: "image", dataUrl: a.dataUrl }));

  // Vyčtená data patří k dokladu, ze kterého je AI četla (první protokol / faktura)
  const extractedRole = sub.extracted?.docKind === "INVOICE" ? "INVOICE" : "PROTOCOL";
  let extractedUsed = false;
  const docFiles = sub.attachments.filter(
    (a): a is SubmissionFile & { role: "PROTOCOL" | "INVOICE" } =>
      a.role === "PROTOCOL" || a.role === "INVOICE",
  );
  const documents: DocumentInput[] = docFiles.map((a, i) => {
    const sameRole = docFiles.filter((d) => d.role === a.role);
    const n = sameRole.length > 1 ? ` (${sameRole.indexOf(a) + 1})` : "";
    let extracted: ExtractionResult | undefined;
    if (sub.extracted && !extractedUsed && (a.role === extractedRole || i === docFiles.length - 1)) {
      extracted = sub.extracted;
      extractedUsed = true;
    }
    return {
      title: `${DOC_TITLES[a.role]} — ${sub.title}${n}`,
      category: a.role,
      section: "BUDOVA",
      fileName: a.name,
      dataUrl: a.dataUrl,
      extracted,
      elementIds,
    };
  });

  // Termín: revize → INSPECTION, jinak servis. Navážeme na otevřený termín téhož prvku.
  const deadlineType: ReminderType = sub.workType === "INSPECTION" ? "INSPECTION" : "MAINTENANCE";
  const openReminder = element
    ? property.reminders.find((r) => !r.done && r.elementId === element.id && r.type === deadlineType)
    : undefined;
  let deadline: EntryProposal["deadline"];
  // termín navrhneme, když technik uvedl další termín nebo lhůtu (z lhůty ho dopočítá ProposalReview),
  // nebo když revize provádí otevřený termín téhož prvku
  if (sub.nextDueDate || sub.intervalMonths != null || (openReminder && sub.workType === "INSPECTION")) {
    deadline = {
      reminderId: openReminder?.id,
      type: deadlineType,
      title: `${deadlineType === "INSPECTION" ? "Revize" : "Servis"} — ${element?.name ?? sub.title}`,
      elementId: element?.id,
      nextDueDate: sub.nextDueDate,
      intervalMonths: sub.intervalMonths,
      // lhůtu potvrzuje jen revizní technik, a jen když ji uvedl (jinak termín nechá beze změny)
      intervalConfirmed: sub.intervalMonths != null ? sub.author.role === "INSPECTOR" : undefined,
      confirmedBy: sub.intervalMonths != null ? sub.author.name : undefined,
    };
  }

  // Fotka otevřené zdi s metrem zpřesní polohu — ale nezhorší už přesněji změřený prvek
  let refineElement: EntryProposal["refineElement"];
  const photoAccuracy = DEFAULT_ACCURACY_MM.FOTO_OTEVRENE_ZDI;
  if (sub.measuredOpenWall && element && media.length > 0) {
    const alreadyBetter =
      accuracyClass(element) === "MEASURED" && element.accuracyMm != null && element.accuracyMm <= photoAccuracy;
    if (!alreadyBetter) {
      refineElement = { elementId: element.id, source: "FOTO_OTEVRENE_ZDI", accuracyMm: photoAccuracy };
    }
  }

  return {
    entry: {
      type: sub.workType,
      title: sub.title,
      description: sub.description,
      date: sub.date,
      cost: sub.cost,
      result: sub.result,
      media,
      elementIds,
      author: {
        name: sub.author.name,
        role: sub.author.role,
        company: sub.author.company,
        phone: sub.author.phone,
      },
      submissionId: sub.id,
    },
    documents: documents.length ? documents : undefined,
    deadline,
    refineElement,
  };
}

// „Jan Novák (Elektro Dvořák) · revizní technik"
export function submissionSourceLabel(sub: Pick<Submission, "author">): string {
  const company = sub.author.company ? ` (${sub.author.company})` : "";
  return `Od: ${sub.author.name}${company} · ${INVITE_ROLES[sub.author.role].toLowerCase()}`;
}
