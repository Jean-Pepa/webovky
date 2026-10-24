// AI vyčtení dokladů (protokol, faktura, záruční list) → návrh zápisu.
// Podpisy jsou závazné (používá je i stránka řemeslníka). Bez "use client" —
// normalizeExtraction používá i serverová routa /api/extract.

import type { DocCategory, DocSection, DocumentInput, EntryProposal, Property, ReminderType } from "./store";
import {
  INSPECTION_RESULTS,
  WORK_TYPES,
  type ExtractedDocKind,
  type ExtractionContext,
  type ExtractionResult,
  type InspectionResult,
  type WorkType,
} from "./submission";
import { ISO_DATE_RE, localIsoDate } from "./deadlines";

export type DocumentPayload = { name: string; mediaType: string; dataUrl: string };

export type ExtractOutcome =
  | { ok: true; result: ExtractionResult }
  | { ok: false; reason: "not_configured" | "unsupported" | "too_large" | "failed"; message?: string };

// --- Limity -------------------------------------------------------------------

export const PDF_MAX_BYTES = 3_000_000; // PDF posíláme celé, jen do 3 MB
export const EXTRACT_MAX_CHARS = 4_100_000; // délka data URL, kterou přijme /api/extract (PDF 3 MB ≈ 4 MB base64)
export const DOC_STORE_MAX_CHARS = 1_500_000; // větší soubor se v prohlížeči uloží jen názvem
const IMAGE_MAX_DIM = 2000; // protokoly mají drobné písmo — nezmenšovat moc
const IMAGE_TARGET_CHARS = 3_500_000;

export const EXTRACT_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"] as const;
export type ExtractImageType = (typeof EXTRACT_IMAGE_TYPES)[number];

// --- Příprava souboru ---------------------------------------------------------

function isPdf(file: File): boolean {
  return file.type === "application/pdf" || /\.pdf$/i.test(file.name);
}

function looksLikeImage(file: File): boolean {
  return file.type.startsWith("image/") || /\.(jpe?g|png|webp|gif|heic|heif|avif|bmp)$/i.test(file.name);
}

function withExt(name: string, ext: string): string {
  const base = name.replace(/\.[^./\\]+$/, "") || "doklad";
  return `${base}.${ext}`;
}

function readAsDataUrl(file: Blob): Promise<string | null> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : null);
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
}

function loadImageSrc(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("image load error"));
    img.src = src;
  });
}

function renderImage(img: HTMLImageElement, maxDim: number): HTMLCanvasElement | null {
  let w = img.naturalWidth;
  let h = img.naturalHeight;
  if (!w || !h) return null;
  const scale = Math.min(1, maxDim / Math.max(w, h));
  w = Math.max(1, Math.round(w * scale));
  h = Math.max(1, Math.round(h * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  // průhledné PNG by v JPEG zčernalo
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(img, 0, 0, w, h);
  return canvas;
}

// Připraví soubor (foto / PDF) pro AI: obrázky zmenší (čitelně), PDF pošle celé (do limitu).
// Vrací null, když soubor neumíme (HEIC v prohlížeči bez podpory, Word…) nebo je PDF moc velké.
export async function fileToDocumentPayload(file: File): Promise<DocumentPayload | null> {
  if (isPdf(file)) {
    if (file.size > PDF_MAX_BYTES) return null;
    const url = await readAsDataUrl(file);
    if (!url) return null;
    const data = url.slice(url.indexOf(",") + 1);
    if (!data) return null;
    return { name: file.name, mediaType: "application/pdf", dataUrl: `data:application/pdf;base64,${data}` };
  }

  if (!looksLikeImage(file)) return null;
  const url = URL.createObjectURL(file);
  try {
    // HEIC umí jen některé prohlížeče (Safari) — jinak chyba → null
    const img = await loadImageSrc(url);
    const keepPng = file.type === "image/png";
    for (const [dim, quality] of [
      [IMAGE_MAX_DIM, 0.85],
      [1600, 0.8],
      [1280, 0.72],
    ] as const) {
      const canvas = renderImage(img, dim);
      if (!canvas) return null;
      let dataUrl = canvas.toDataURL("image/jpeg", quality);
      let mediaType = "image/jpeg";
      // snímek obrazovky bývá jako PNG menší a ostřejší
      if (keepPng) {
        const png = canvas.toDataURL("image/png");
        if (png.startsWith("data:image/png") && png.length < dataUrl.length) {
          dataUrl = png;
          mediaType = "image/png";
        }
      }
      if (!dataUrl.startsWith(`data:${mediaType}`)) return null;
      if (dataUrl.length <= IMAGE_TARGET_CHARS) {
        const ext = mediaType === "image/png" ? "png" : "jpg";
        const sameType = file.type === mediaType || (mediaType === "image/jpeg" && /\.jpe?g$/i.test(file.name));
        return { name: sameType ? file.name : withExt(file.name, ext), mediaType, dataUrl };
      }
    }
    return null;
  } catch {
    return null;
  } finally {
    URL.revokeObjectURL(url);
  }
}

// Kopie dokladu k uložení v prohlížeči: velkou fotku zmenší pod limit localStorage
// (pro AI posíláme ostřejší verzi). PDF a malé soubory vrací beze změny.
export async function shrinkForStorage(doc: DocumentPayload): Promise<DocumentPayload> {
  if (doc.dataUrl.length <= DOC_STORE_MAX_CHARS || !doc.mediaType.startsWith("image/")) return doc;
  try {
    const img = await loadImageSrc(doc.dataUrl);
    for (const [dim, quality] of [
      [1600, 0.75],
      [1280, 0.7],
      [1024, 0.65],
    ] as const) {
      const canvas = renderImage(img, dim);
      if (!canvas) break;
      const dataUrl = canvas.toDataURL("image/jpeg", quality);
      if (dataUrl.startsWith("data:image/jpeg") && dataUrl.length <= DOC_STORE_MAX_CHARS) {
        const name = doc.mediaType === "image/jpeg" ? doc.name : withExt(doc.name, "jpg");
        return { name, mediaType: "image/jpeg", dataUrl };
      }
    }
  } catch {
    // necháme původní — uloží se jen název
  }
  return doc;
}

// Proč fileToDocumentPayload vrátil null — srozumitelně pro uživatele.
export function payloadProblem(file: File): string {
  if (isPdf(file)) {
    return file.size > PDF_MAX_BYTES
      ? `PDF je moc velké na vyčtení (${formatMb(file.size)}, max. ${formatMb(PDF_MAX_BYTES)}). Vyfoťte jen podstatnou stranu, nebo vyplňte údaje ručně.`
      : "PDF se nepodařilo načíst. Zkuste ho uložit znovu, nebo vyplňte údaje ručně.";
  }
  if (/heic|heif/i.test(file.type) || /\.(heic|heif)$/i.test(file.name)) {
    return "Fotku ve formátu HEIC tento prohlížeč neumí otevřít. Vyfoťte doklad přímo tlačítkem „Vyfotit“, nebo ho uložte jako JPG.";
  }
  if (looksLikeImage(file)) return "Obrázek se nepodařilo načíst. Zkuste jinou fotku, nebo vyplňte údaje ručně.";
  return "Tenhle typ souboru AI neumí přečíst. Nahrajte fotku (JPG, PNG) nebo PDF — nebo vyplňte údaje ručně.";
}

function formatMb(bytes: number): string {
  return `${(bytes / 1_000_000).toLocaleString("cs-CZ", { maximumFractionDigits: 1 })} MB`;
}

// --- Volání AI ----------------------------------------------------------------

const FAIL_MESSAGES: Record<string, string> = {
  refused: "AI tento dokument odmítla zpracovat. Vyplňte prosím údaje ručně.",
  unreadable: "Soubor se nepodařilo přečíst (poškozený nebo nečitelný). Zkuste jinou fotku.",
  rate_limited: "AI je teď vytížená. Zkuste to prosím za chvíli znovu.",
  timeout: "Čtení trvalo příliš dlouho. Zkuste to znovu, případně vyfoťte jen první stranu.",
};

// Zavolá /api/extract. Bez ANTHROPIC_API_KEY vrátí { ok: false, reason: "not_configured" }.
export async function extractDocument(
  doc: DocumentPayload,
  context: ExtractionContext,
): Promise<ExtractOutcome> {
  if (doc.dataUrl.length > EXTRACT_MAX_CHARS) return { ok: false, reason: "too_large" };
  let res: Response;
  try {
    res = await fetch("/api/extract", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ doc, context }),
    });
  } catch {
    return { ok: false, reason: "failed", message: "Nepodařilo se spojit se serverem. Zkontrolujte připojení." };
  }

  if (res.ok) {
    const data: unknown = await res.json().catch(() => null);
    if (!data || typeof data !== "object") {
      return { ok: false, reason: "failed", message: "AI vrátila nečitelnou odpověď. Zkuste to znovu." };
    }
    return { ok: true, result: normalizeExtraction(data, context) };
  }

  if (res.status === 503) return { ok: false, reason: "not_configured" };
  if (res.status === 413) return { ok: false, reason: "too_large" };
  if (res.status === 415) return { ok: false, reason: "unsupported" };
  const body = (await res.json().catch(() => null)) as { error?: unknown; message?: unknown } | null;
  const code = typeof body?.error === "string" ? body.error : "";
  const message =
    (Object.prototype.hasOwnProperty.call(FAIL_MESSAGES, code) ? FAIL_MESSAGES[code] : undefined) ??
    (res.status === 429 ? FAIL_MESSAGES.rate_limited : undefined) ??
    (res.status === 504 ? FAIL_MESSAGES.timeout : undefined) ??
    (typeof body?.message === "string" && body.message ? body.message : undefined) ??
    "AI vyčtení se nepovedlo. Zkuste to znovu, nebo vyplňte údaje ručně.";
  return { ok: false, reason: "failed", message };
}

// Kontext pro AI z domu (jen názvy prvků, žádná citlivá data)
export function extractionContext(property: Property, onlyElementId?: string): ExtractionContext {
  const elements = (property.elements ?? [])
    .filter((e) => !onlyElementId || e.id === onlyElementId)
    .map((e) => ({ id: e.id, name: e.name, category: e.category, kind: e.kind, room: e.room }));
  return { propertyName: property.name, elements };
}

// --- Normalizace výstupu AI (server i klient) ---------------------------------

const DOC_KINDS: ExtractedDocKind[] = ["PROTOCOL", "INVOICE", "WARRANTY", "OTHER"];
const CONFIDENCES: ExtractionResult["confidence"][] = ["HIGH", "MEDIUM", "LOW"];

const DOC_KIND_TITLES: Record<ExtractedDocKind, string> = {
  PROTOCOL: "Protokol",
  INVOICE: "Faktura",
  WARRANTY: "Záruční list",
  OTHER: "Doklad",
};

const DOC_KIND_CATEGORY: Record<ExtractedDocKind, DocCategory> = {
  PROTOCOL: "PROTOCOL",
  INVOICE: "INVOICE",
  WARRANTY: "WARRANTY",
  OTHER: "OTHER",
};

// Platné datum YYYY-MM-DD (i kalendářně — 2026-02-30 neprojde)
export function isValidIsoDate(s: unknown): s is string {
  if (typeof s !== "string" || !ISO_DATE_RE.test(s)) return false;
  const [y, m, d] = s.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return y >= 1800 && dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
}

function str(v: unknown, max = 300): string | null {
  if (typeof v !== "string") return null;
  const s = v.replace(/\s+/g, " ").trim();
  if (!s) return null;
  return s.length > max ? `${s.slice(0, max - 1)}…` : s;
}

function strList(v: unknown, maxItems = 30, maxLen = 400): string[] {
  if (!Array.isArray(v)) return [];
  const out: string[] = [];
  for (const item of v) {
    const s = str(item, maxLen);
    if (s && !out.includes(s)) out.push(s);
    if (out.length >= maxItems) break;
  }
  return out;
}

function num(v: unknown): number | null {
  const n = typeof v === "string" ? Number(v.replace(/\s/g, "").replace(",", ".")) : v;
  return typeof n === "number" && Number.isFinite(n) && n >= 0 ? n : null;
}

function pick<T extends string>(v: unknown, allowed: readonly T[]): T | null {
  return typeof v === "string" && (allowed as readonly string[]).includes(v) ? (v as T) : null;
}

// Ověří a uklidí, co vrátila AI: neplatné hodnoty → null, prvek jen z kontextu, žádné vymyšlené lhůty.
export function normalizeExtraction(raw: unknown, context?: ExtractionContext): ExtractionResult {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const warnings = strList(r.warnings);

  const docKind = pick(r.docKind, DOC_KINDS) ?? "OTHER";
  const workType =
    pick(r.workType, Object.keys(WORK_TYPES) as WorkType[]) ?? (docKind === "PROTOCOL" ? "INSPECTION" : "OTHER");

  const date = isValidIsoDate(r.date) ? r.date : null;
  let nextDueDate = isValidIsoDate(r.nextDueDate) ? r.nextDueDate : null;
  if (nextDueDate && date && nextDueDate <= date) {
    nextDueDate = null;
    warnings.push("Další termín vyšel dřív než datum dokladu — vyplňte ho prosím ručně.");
  }

  const months = num(r.intervalMonths);
  const intervalMonths = months != null && months >= 1 && months <= 1200 ? Math.round(months) : null;
  const costRaw = num(r.cost);
  const cost = costRaw != null ? Math.round(costRaw * 100) / 100 : null;

  const ids = new Set((context?.elements ?? []).map((e) => e.id));
  const elementId = typeof r.elementId === "string" && ids.has(r.elementId) ? r.elementId : null;

  return {
    docKind,
    workType,
    title: str(r.title, 120) ?? DOC_KIND_TITLES[docKind],
    summary: str(r.summary, 1200) ?? "Údaje vyčtené z dokladu — zkontrolujte je prosím.",
    date,
    result: pick(r.result, Object.keys(INSPECTION_RESULTS) as InspectionResult[]),
    device: str(r.device, 160),
    elementId,
    nextDueDate,
    intervalMonths,
    cost,
    supplier: str(r.supplier, 160),
    technician: str(r.technician, 160),
    defects: strList(r.defects),
    confidence: pick(r.confidence, CONFIDENCES) ?? "LOW",
    warnings,
  };
}

// Prázdný „výsledek" pro ruční vyplnění, když AI není k dispozici (název z názvu souboru).
export function manualExtraction(fileName: string | undefined, workType: WorkType): ExtractionResult {
  const fromName = (fileName ?? "")
    .replace(/\.[^.]+$/, "")
    .replace(/_+/g, " ")
    .replace(/(\p{L})-+(?=\p{L})/gu, "$1 ")
    .replace(/\s+/g, " ")
    .trim();
  // názvy z fotoaparátu a snímky obrazovky („IMG 2041", „Screenshot 2026 10 24") nic neříkají
  const rest = fromName.replace(/^(img|dscn?|pxl|photo|foto|scan|image|screenshot|sn[ií]mek obrazovky)/i, "");
  const generic = (rest !== fromName && !/\p{L}{4,}/u.test(rest)) || !/\p{L}{3,}/u.test(fromName);
  const title = generic ? "Doklad" : fromName.charAt(0).toLocaleUpperCase("cs-CZ") + fromName.slice(1);
  return {
    docKind: "OTHER",
    workType,
    title: title.slice(0, 120),
    summary: "",
    date: null,
    result: null,
    device: null,
    elementId: null,
    nextDueDate: null,
    intervalMonths: null,
    cost: null,
    supplier: null,
    technician: null,
    defects: [],
    confidence: "LOW",
    warnings: ["AI vyčtení není k dispozici — vyplňte údaje ručně"],
  };
}

// --- Návrh zápisu -------------------------------------------------------------

// Popis zápisu: shrnutí + závady jako odrážky + kdo práci provedl
export function extractionDescription(result: ExtractionResult): string {
  const parts: string[] = [];
  if (result.summary.trim()) parts.push(result.summary.trim());
  if (result.defects.length) {
    parts.push(["Zjištěné závady:", ...result.defects.map((d) => `• ${d}`)].join("\n"));
  }
  const who = [result.supplier, result.technician].filter(Boolean).join(", ");
  if (who) parts.push(`Provedl: ${who}`);
  return parts.join("\n\n");
}

function reminderTypeFor(workType: WorkType): ReminderType {
  return workType === "INSPECTION" ? "INSPECTION" : "MAINTENANCE";
}

// Z vyčtených dat udělá návrh zápisu (doklad + zápis + termín) pro ProposalReview.
export function extractionToProposal(
  property: Property,
  result: ExtractionResult,
  doc: DocumentPayload | null,
  opts?: { elementId?: string; reminderId?: string },
): EntryProposal {
  const elements = property.elements ?? [];
  const exists = (id?: string | null): id is string => !!id && elements.some((e) => e.id === id);
  const reminder = opts?.reminderId ? property.reminders.find((r) => r.id === opts.reminderId) : undefined;

  const elementId = [opts?.elementId, reminder?.elementId, result.elementId].find(exists);
  const elementIds = elementId ? [elementId] : undefined;
  const element = elementId ? elements.find((e) => e.id === elementId) : undefined;

  const description = extractionDescription(result);
  const proposal: EntryProposal = {
    entry: {
      type: result.workType,
      title: result.title,
      description: description || undefined,
      date: result.date ?? localIsoDate(),
      cost: result.cost ?? undefined,
      result: result.result ?? undefined,
      elementIds,
      media: [],
    },
  };

  if (doc) {
    const section: DocSection = result.docKind === "INVOICE" ? "REALIZACE" : "BUDOVA";
    const document: DocumentInput = {
      title: `${DOC_KIND_TITLES[result.docKind]}: ${result.title}`,
      category: DOC_KIND_CATEGORY[result.docKind],
      section,
      fileName: doc.name,
      // localStorage má limit — velké soubory uložíme jen názvem
      dataUrl: doc.dataUrl && doc.dataUrl.length <= DOC_STORE_MAX_CHARS ? doc.dataUrl : undefined,
      extracted: result,
      elementIds,
    };
    proposal.documents = [document];
  }

  const technician = result.technician ?? undefined;
  const intervalMonths = result.intervalMonths ?? undefined;
  // nová lhůta z dokladu není potvrzená, dokud ji majitel neověří u technika;
  // stejná lhůta jako u termínu ponechá jeho dosavadní potvrzení
  const confirmation = (prev?: number) =>
    intervalMonths != null && intervalMonths !== prev
      ? { intervalConfirmed: false, confirmedBy: technician }
      : { intervalConfirmed: undefined, confirmedBy: undefined };

  if (reminder) {
    // provedení konkrétního termínu (otevřeno z termínu ?termin=)
    proposal.deadline = {
      reminderId: reminder.id,
      type: reminder.type,
      title: reminder.title,
      elementId: reminder.elementId ?? elementId,
      nextDueDate: result.nextDueDate ?? undefined,
      intervalMonths,
      ...confirmation(reminder.intervalMonths),
    };
    return proposal;
  }

  const type = reminderTypeFor(result.workType);
  // existující otevřený termín u stejného prvku a stejného typu → provést ho (posune se)
  const open = elementId
    ? property.reminders
        .filter((r) => !r.done && r.elementId === elementId && r.type === type)
        .sort((a, b) => a.dueDate.localeCompare(b.dueDate))[0]
    : undefined;

  const what = result.device ?? element?.name ?? result.title;
  if (result.nextDueDate) {
    proposal.deadline = open
      ? {
          reminderId: open.id,
          type: open.type,
          title: open.title,
          elementId,
          nextDueDate: result.nextDueDate,
          intervalMonths,
          ...confirmation(open.intervalMonths),
        }
      : {
          type,
          title: `${type === "INSPECTION" ? "Revize" : "Servis"} — ${what}`,
          elementId,
          nextDueDate: result.nextDueDate,
          intervalMonths,
          intervalConfirmed: false,
          confirmedBy: technician,
        };
  } else if (open && (result.workType === "INSPECTION" || result.workType === "REPAIR")) {
    // bez data v dokladu: termín se po provedení posune o svou lhůtu
    proposal.deadline = {
      reminderId: open.id,
      type: open.type,
      title: open.title,
      elementId,
      intervalMonths,
      ...confirmation(open.intervalMonths),
    };
  } else if (intervalMonths != null) {
    // lhůta je v dokladu, datum ne — ProposalReview ho dopočítá od data zápisu
    proposal.deadline = {
      type,
      title: `${type === "INSPECTION" ? "Revize" : "Servis"} — ${what}`,
      elementId,
      intervalMonths,
      intervalConfirmed: false,
      confirmedBy: technician,
    };
  }

  return proposal;
}
