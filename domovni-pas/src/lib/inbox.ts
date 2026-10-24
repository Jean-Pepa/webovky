// Pozvánky a inbox zápisů od řemeslníků — klientské pomocníky.
// Nejdřív server (Upstash). Když backend není nastavený (503 not_configured), běží
// „ukázkový režim" v tomto prohlížeči (localStorage) se stejnými pravidly jako server.

import type { Invite, Property } from "./store";
import {
  SUBMISSION_LIMITS,
  type InvitePublic,
  type Submission,
  type SubmissionFile,
  type SubmissionFileRole,
} from "./submission";
import {
  DATA_URL_RE,
  MAX_SUBMISSIONS_PER_INVITE,
  isInviteExpired,
  validateSubmissionPayload,
  type SubmissionPayload,
} from "./submission-proposal";
import { fileToMedia } from "./media";
import { newId } from "./id";

export const INBOX_STORAGE_KEY = "bulo-inbox-v1";
const OWNER_HEADER = "x-owner-key";

export type InboxMode = "server" | "local";

const ERROR_MESSAGES: Record<string, string> = {
  not_found: "Pozvánka neexistuje nebo ji majitel zrušil.",
  expired: "Platnost pozvánky skončila. Požádejte majitele o novou.",
  unauthorized: "Chybí klíč majitele k doručeným zápisům.",
  forbidden: "Klíč majitele nesouhlasí — tento dům na serveru spravuje jiný prohlížeč.",
  too_large: "Zápis je příliš velký — uberte prosím přílohy.",
  inbox_full: "Majitel má teď moc nevyřízených zápisů. Zkuste to prosím později.",
  invite_limit: "Přes tuto pozvánku už bylo odesláno moc zápisů. Požádejte majitele o novou.",
  storage_full:
    "Zápis se nevešel do úložiště tohoto prohlížeče (ukázkový režim). Zkuste méně nebo menší fotky.",
  rate_limited: "Z tohoto připojení teď přišlo moc požadavků. Zkuste to prosím za chvíli.",
  server_error: "Na serveru se něco pokazilo. Zkuste to prosím znovu.",
  network: "Nepodařilo se spojit se serverem. Zkontrolujte připojení a zkuste to znovu.",
};

function messageFor(code: string): string {
  return ERROR_MESSAGES[code] ?? "Něco se nepovedlo. Zkuste to prosím znovu.";
}

// --- Id domu na serveru ------------------------------------------------------------
// Id z prohlížeče + krátký otisk klíče majitele. Ukázkový dům („demo-dum") má stejné id
// v každém prohlížeči — bez otisku by si ho na serveru zabral první návštěvník a ostatním
// by pozvánky ani inbox nešly. Z otisku (53 bitů ze 128bitového klíče) se klíč zjistit nedá.
export function serverPropertyId(propertyId: string, ownerKey: string): string {
  const base = propertyId.replace(/[^A-Za-z0-9_-]/g, "_").slice(0, 40) || "dum";
  return `${base}-${fingerprint(`bulo-inbox:${ownerKey}`)}`;
}

// cyrb53 — rychlý deterministický otisk (stejný v každém prohlížeči, i bez crypto.subtle)
function fingerprint(s: string): string {
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (let i = 0; i < s.length; i++) {
    const ch = s.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
}

// --- Uložení potvrzeného zápisu -------------------------------------------------------
// Kniha domu se ukládá do localStorage (store.tsx) a plné úložiště zápis tiše neuloží.
// Kopii z inboxu proto mažeme, až když je potvrzený zápis v úložišti opravdu uložený.
const BOOK_STORAGE_KEY = "domovni-pas-v1"; // stejný klíč jako ve store.tsx

export function isConfirmedEntrySaved(submissionId: string, attempts?: number): Promise<boolean> {
  return isInSavedBook(`"submissionId":${JSON.stringify(submissionId)}`, attempts);
}

// Totéž pro zápis podle id (potvrzení návrhu z dokladu)
export function isEntrySaved(entryId: string, attempts?: number): Promise<boolean> {
  return isInSavedBook(`"id":${JSON.stringify(entryId)}`, attempts);
}

// Store ukládá v efektu po překreslení — chvíli počkáme
async function isInSavedBook(needle: string, attempts = 40): Promise<boolean> {
  for (let i = 0; i < attempts; i++) {
    let raw: string | null;
    try {
      raw = localStorage.getItem(BOOK_STORAGE_KEY);
    } catch {
      return true; // úložiště nejde číst → ověřit nelze, vyřízení nebráníme
    }
    if (raw?.includes(needle)) return true;
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  return false;
}

async function errorInfo(res: Response): Promise<{ error: string; message: string }> {
  let error = res.status === 413 ? "too_large" : `http_${res.status}`;
  let message: string | undefined;
  try {
    const d = (await res.json()) as { error?: unknown; message?: unknown };
    if (typeof d.error === "string") error = d.error;
    if (typeof d.message === "string") message = d.message;
  } catch {
    // tělo není JSON (např. limit platformy)
  }
  return { error, message: message ?? messageFor(error) };
}

// --- Ukázkový režim (localStorage) ---------------------------------------------

type LocalInbox = { submissions: Submission[]; counts: Record<string, number> };

function readLocal(): LocalInbox {
  try {
    const raw = localStorage.getItem(INBOX_STORAGE_KEY);
    if (!raw) return { submissions: [], counts: {} };
    const o = JSON.parse(raw) as Partial<LocalInbox> | null;
    return {
      submissions: Array.isArray(o?.submissions) ? o.submissions : [],
      counts: o?.counts && typeof o.counts === "object" ? o.counts : {},
    };
  } catch {
    return { submissions: [], counts: {} };
  }
}

function writeLocal(data: LocalInbox): boolean {
  try {
    localStorage.setItem(INBOX_STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch {
    return false; // plné úložiště
  }
}

// --- Pozvánka (majitel) ----------------------------------------------------------

// Co o domě uvidí řemeslník: název, obec, prvek — a seznam prvků jen u pozvánky na celý dům.
export function buildInvitePublic(
  property: Property,
  invite: Pick<Invite, "token" | "role" | "expiresAt" | "elementId">,
): InvitePublic {
  const el = invite.elementId ? property.elements?.find((e) => e.id === invite.elementId) : undefined;
  const list = invite.elementId ? (el ? [el] : []) : (property.elements ?? []);
  return {
    token: invite.token,
    propertyId: property.id,
    propertyName: property.name.slice(0, 200),
    city: property.city?.trim() ? property.city.trim().slice(0, 120) : undefined,
    role: invite.role,
    expiresAt: invite.expiresAt,
    elementId: invite.elementId,
    elementName: el?.name.slice(0, 200),
    elementCategory: el?.category,
    elements: list.slice(0, 500).map((e) => ({
      id: e.id,
      name: e.name.slice(0, 200),
      category: e.category,
      kind: e.kind?.trim() ? e.kind.trim().slice(0, 120) : undefined,
      room: e.room?.trim() ? e.room.trim().slice(0, 120) : undefined,
    })),
  };
}

export type PublishResult = "server" | "local" | { error: string };

// Zveřejní (nebo aktualizuje) pozvánku na serveru. Bez backendu → "local".
export async function publishInvite(
  property: Property,
  invite: Pick<Invite, "token" | "role" | "expiresAt" | "elementId">,
  ownerKey: string,
): Promise<PublishResult> {
  const pub: InvitePublic = { ...buildInvitePublic(property, invite), propertyId: serverPropertyId(property.id, ownerKey) };
  try {
    const res = await fetch(`/api/invite/${encodeURIComponent(invite.token)}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ invite: pub, ownerKey }),
    });
    if (res.ok) return "server";
    if (res.status === 503) return "local";
    return { error: (await errorInfo(res)).message };
  } catch {
    return { error: messageFor("network") };
  }
}

export async function revokeInviteRemote(
  token: string,
  ownerKey: string | undefined,
): Promise<{ ok: true } | { ok: false; message: string }> {
  if (!ownerKey) return { ok: true }; // nikdy nebyla na serveru
  try {
    const res = await fetch(`/api/invite/${encodeURIComponent(token)}`, {
      method: "DELETE",
      headers: { [OWNER_HEADER]: ownerKey },
    });
    if (res.ok || res.status === 404 || res.status === 503) return { ok: true };
    return { ok: false, message: (await errorInfo(res)).message };
  } catch {
    return { ok: false, message: messageFor("network") };
  }
}

// --- Pozvánka (řemeslník) --------------------------------------------------------

export type InviteLookup =
  | { status: "ok"; invite: InvitePublic; mode: InboxMode }
  | { status: "expired"; invite?: InvitePublic }
  | { status: "not_found" }
  | { status: "error"; message: string };

export type RemoteInviteLookup = InviteLookup | { status: "not_configured" };

export async function fetchInviteRemote(token: string): Promise<RemoteInviteLookup> {
  try {
    const res = await fetch(`/api/invite/${encodeURIComponent(token)}`, { cache: "no-store" });
    if (res.ok) return { status: "ok", invite: (await res.json()) as InvitePublic, mode: "server" };
    if (res.status === 503) return { status: "not_configured" };
    if (res.status === 404) return { status: "not_found" };
    if (res.status === 410) return { status: "expired" };
    return { status: "error", message: (await errorInfo(res)).message };
  } catch {
    return { status: "error", message: messageFor("network") };
  }
}

// Pozvánka uložená v tomto prohlížeči (ukázkový režim / majitel na svém telefonu)
export function findLocalInvite(token: string, properties: Property[]): InviteLookup | null {
  for (const p of properties) {
    const inv = p.invites?.find((i) => i.token === token);
    if (!inv) continue;
    if (inv.revoked) return { status: "not_found" };
    const pub = buildInvitePublic(p, inv);
    if (isInviteExpired(pub)) return { status: "expired", invite: pub };
    return { status: "ok", invite: pub, mode: "local" };
  }
  return null;
}

// Server má přednost; když pozvánku nezná (nebo neběží), zkusíme tento prohlížeč.
export function combineInviteLookup(remote: RemoteInviteLookup, local: InviteLookup | null): InviteLookup {
  if (remote.status === "ok" || remote.status === "expired") return remote;
  if (local) return local;
  if (remote.status === "not_configured") return { status: "not_found" };
  return remote;
}

export async function fetchInvite(token: string, localProperties: Property[]): Promise<InviteLookup> {
  const remote = await fetchInviteRemote(token);
  return combineInviteLookup(remote, findLocalInvite(token, localProperties));
}

export type SubmitResult =
  | { ok: true; id: string; mode: InboxMode }
  | { ok: false; error: string; message: string };

function submitLocal(invite: InvitePublic, payload: SubmissionPayload): SubmitResult {
  const v = validateSubmissionPayload(payload, invite);
  if (!v.ok) return v;
  const data = readLocal();
  const pending = data.submissions.filter((s) => s.propertyId === invite.propertyId).length;
  if (pending >= SUBMISSION_LIMITS.maxPendingPerProperty) {
    return { ok: false, error: "inbox_full", message: messageFor("inbox_full") };
  }
  const count = (data.counts[invite.token] ?? 0) + 1;
  if (count > MAX_SUBMISSIONS_PER_INVITE) {
    return { ok: false, error: "invite_limit", message: messageFor("invite_limit") };
  }
  const sub: Submission = {
    ...v.value,
    id: newId(),
    token: invite.token,
    propertyId: invite.propertyId,
    createdAt: new Date().toISOString(),
  };
  const next: LocalInbox = {
    submissions: [sub, ...data.submissions],
    counts: { ...data.counts, [invite.token]: count },
  };
  if (!writeLocal(next)) return { ok: false, error: "storage_full", message: messageFor("storage_full") };
  return { ok: true, id: sub.id, mode: "local" };
}

export async function submitToInvite(
  token: string,
  payload: SubmissionPayload,
  localProperties: Property[],
): Promise<SubmitResult> {
  let res: Response;
  try {
    res = await fetch(`/api/invite/${encodeURIComponent(token)}/submit`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    return { ok: false, error: "network", message: messageFor("network") };
  }
  if (res.ok) {
    const d = (await res.json().catch(() => ({}))) as { id?: unknown };
    return { ok: true, id: typeof d.id === "string" ? d.id : "", mode: "server" };
  }
  // Bez backendu, nebo pozvánka existuje jen v tomto prohlížeči
  if (res.status === 503 || res.status === 404) {
    const local = findLocalInvite(token, localProperties);
    if (local?.status === "ok") return submitLocal(local.invite, payload);
    const code = local?.status === "expired" ? "expired" : "not_found";
    return { ok: false, error: code, message: messageFor(code) };
  }
  const info = await errorInfo(res);
  return { ok: false, ...info };
}

// --- Inbox (majitel) -------------------------------------------------------------

export type InboxItem = { submission: Submission; source: InboxMode };
export type InboxResult = { items: InboxItem[]; error?: string };

type OwnerRef = Pick<Property, "id" | "ownerKey">;

// Zápisy čekající na potvrzení: server (když má dům klíč majitele) + ukázkový režim, nejnovější první.
export async function fetchInbox(property: OwnerRef): Promise<InboxResult> {
  const items: InboxItem[] = [];
  let error: string | undefined;
  if (property.ownerKey) {
    try {
      const res = await fetch(`/api/inbox/${encodeURIComponent(serverPropertyId(property.id, property.ownerKey))}`, {
        headers: { [OWNER_HEADER]: property.ownerKey },
        cache: "no-store",
      });
      if (res.ok) {
        const d = (await res.json()) as { submissions?: Submission[] };
        for (const s of d.submissions ?? []) items.push({ submission: s, source: "server" });
      } else if (res.status !== 503 && !(res.status === 404 && (await isNoInbox(res)))) {
        error = (await errorInfo(res)).message;
      }
    } catch {
      error = "Nepodařilo se načíst zápisy ze serveru — zkontrolujte připojení.";
    }
  }
  for (const s of readLocal().submissions) {
    if (s.propertyId !== property.id) continue;
    if (items.some((i) => i.submission.id === s.id)) continue;
    items.push({ submission: s, source: "local" });
  }
  items.sort((a, b) => String(b.submission.createdAt).localeCompare(String(a.submission.createdAt)));
  return { items, error };
}

// 404 „no_inbox" = dům na serveru ještě nemá žádnou pozvánku → prázdný inbox
async function isNoInbox(res: Response): Promise<boolean> {
  try {
    const d = (await res.clone().json()) as { error?: unknown };
    return d.error === "no_inbox" || d.error === "not_found";
  } catch {
    return false;
  }
}

// Doplní přílohám dataUrl (ze serveru po jednom souboru). Chybějící soubor zůstane bez dataUrl.
export async function loadSubmissionFiles(property: OwnerRef, submission: Submission): Promise<Submission> {
  const local = readLocal().submissions.find(
    (s) => s.id === submission.id && s.propertyId === property.id,
  );
  if (local) return local;
  const key = property.ownerKey;
  if (!key) throw new Error(messageFor("unauthorized"));
  const base = `/api/inbox/${encodeURIComponent(serverPropertyId(property.id, key))}/${encodeURIComponent(submission.id)}`;
  const attachments = await Promise.all(
    submission.attachments.map(async (a): Promise<SubmissionFile> => {
      if (a.dataUrl) return a;
      let res: Response;
      try {
        res = await fetch(`${base}?file=${encodeURIComponent(a.id)}`, {
          headers: { [OWNER_HEADER]: key },
          cache: "no-store",
        });
      } catch {
        throw new Error(messageFor("network"));
      }
      if (res.ok) {
        const d = (await res.json()) as { dataUrl?: unknown };
        return { ...a, dataUrl: typeof d.dataUrl === "string" ? d.dataUrl : undefined };
      }
      if (res.status === 404) return { ...a, dataUrl: undefined };
      throw new Error((await errorInfo(res)).message);
    }),
  );
  return { ...submission, attachments };
}

// Vyřízený zápis (potvrzený nebo odmítnutý) zmizí z inboxu i se soubory.
export async function removeSubmission(
  property: OwnerRef,
  subId: string,
): Promise<{ ok: true } | { ok: false; message: string }> {
  const data = readLocal();
  if (data.submissions.some((s) => s.id === subId && s.propertyId === property.id)) {
    const ok = writeLocal({
      ...data,
      submissions: data.submissions.filter((s) => !(s.id === subId && s.propertyId === property.id)),
    });
    return ok ? { ok: true } : { ok: false, message: "Zápis se nepodařilo odebrat z úložiště prohlížeče." };
  }
  if (!property.ownerKey) return { ok: true };
  try {
    const res = await fetch(
      `/api/inbox/${encodeURIComponent(serverPropertyId(property.id, property.ownerKey))}/${encodeURIComponent(subId)}`,
      { method: "DELETE", headers: { [OWNER_HEADER]: property.ownerKey } },
    );
    if (res.ok || res.status === 404 || res.status === 503) return { ok: true };
    return { ok: false, message: (await errorInfo(res)).message };
  } catch {
    return { ok: false, message: messageFor("network") };
  }
}

// --- Přílohy (stránka řemeslníka) ---------------------------------------------------

export type AttachmentResult = { ok: true; file: SubmissionFile } | { ok: false; message: string };

const MAX_MB_TEXT = "asi 1 MB";

// Hotová data URL → příloha (ověří formát a velikost jako server)
export function dataUrlToAttachment(
  dataUrl: string,
  name: string,
  role: SubmissionFileRole,
): AttachmentResult {
  const m = DATA_URL_RE.exec(dataUrl);
  if (!m) return { ok: false, message: `Soubor „${name}“ neumíme přiložit — pošlete foto (JPG, PNG) nebo PDF.` };
  if (dataUrl.length > SUBMISSION_LIMITS.maxFileBytes) {
    return { ok: false, message: `Soubor „${name}“ je moc velký (max. ${MAX_MB_TEXT}).` };
  }
  const mediaType = m[1];
  const kind = mediaType.startsWith("image/") ? "image" : "file";
  if (role === "PHOTO" && kind !== "image") {
    return { ok: false, message: `„${name}“ není fotka. Protokol nebo fakturu nahrajte výše.` };
  }
  return {
    ok: true,
    file: { id: newId(), name: name.slice(0, 200), kind, mediaType, role, size: dataUrl.length, dataUrl },
  };
}

// Fotka z telefonu → zmenšená JPEG příloha (přes fileToMedia)
export async function photoToAttachment(file: File): Promise<AttachmentResult> {
  const name = file.name || "foto.jpg";
  if (!file.type.startsWith("image/")) {
    return { ok: false, message: `„${name}“ není fotka.` };
  }
  const media = await fileToMedia(file);
  if (media.kind !== "image" || !media.dataUrl) {
    return { ok: false, message: `Fotku „${name}“ se nepodařilo zpracovat. Zkuste jinou.` };
  }
  return dataUrlToAttachment(media.dataUrl, name, "PHOTO");
}

// Doklad (foto protokolu / PDF) → příloha. Obrázek zmenšíme čitelně, PDF pošleme celé (do limitu).
export async function documentToAttachment(
  file: File,
  role: "PROTOCOL" | "INVOICE",
): Promise<AttachmentResult> {
  const name = file.name || "doklad";
  const isPdf = file.type === "application/pdf" || /\.pdf$/i.test(name);
  if (isPdf) {
    // base64 je o třetinu delší než soubor
    if (file.size * 1.34 > SUBMISSION_LIMITS.maxFileBytes) {
      return {
        ok: false,
        message: `PDF „${name}“ je moc velké (max. ${MAX_MB_TEXT}). Vyfoťte prosím protokol telefonem.`,
      };
    }
    const raw = await readAsDataUrl(file);
    if (!raw) return { ok: false, message: `Soubor „${name}“ se nepodařilo načíst.` };
    // některé prohlížeče nevyplní typ souboru
    const dataUrl = raw.replace(/^data:[^;,]*;base64,/, "data:application/pdf;base64,");
    return dataUrlToAttachment(dataUrl, name, role);
  }
  if (!file.type.startsWith("image/")) {
    return { ok: false, message: `Soubor „${name}“ neumíme přiložit — pošlete foto nebo PDF.` };
  }
  for (const [dim, quality] of [
    [2000, 0.8],
    [1600, 0.72],
    [1280, 0.65],
  ] as const) {
    let dataUrl: string;
    try {
      dataUrl = await downscaleToJpeg(file, dim, quality);
    } catch {
      return { ok: false, message: `Obrázek „${name}“ se nepodařilo zpracovat. Zkuste jiný.` };
    }
    if (dataUrl.length <= SUBMISSION_LIMITS.maxFileBytes) return dataUrlToAttachment(dataUrl, name, role);
  }
  return { ok: false, message: `Obrázek „${name}“ je i po zmenšení moc velký. Zkuste jinou fotku.` };
}

function readAsDataUrl(file: File): Promise<string | undefined> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : undefined);
    reader.onerror = () => resolve(undefined);
    reader.readAsDataURL(file);
  });
}

function downscaleToJpeg(file: File, maxDim: number, quality: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
      const w = Math.max(1, Math.round(img.width * scale));
      const h = Math.max(1, Math.round(img.height * scale));
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      URL.revokeObjectURL(url);
      if (!ctx) {
        reject(new Error("no canvas"));
        return;
      }
      // bílé pozadí (průhledné PNG by v JPEG zčernalo)
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("image load error"));
    };
    img.src = url;
  });
}
