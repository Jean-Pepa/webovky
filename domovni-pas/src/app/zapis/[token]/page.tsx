"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useStore, type ElementCategory, type Property } from "@/lib/store";
import {
  INSPECTION_RESULTS,
  INVITE_ROLES,
  SUBMISSION_LIMITS,
  WORK_TYPES,
  type ExtractionResult,
  type InspectionResult,
  type InvitePublic,
  type SubmissionFile,
  type WorkType,
} from "@/lib/submission";
import {
  combineInviteLookup,
  documentToAttachment,
  fetchInviteRemote,
  findLocalInvite,
  photoToAttachment,
  submitToInvite,
  type InboxMode,
  type RemoteInviteLookup,
} from "@/lib/inbox";
import { TEXT_LIMITS, validateSubmissionPayload, type SubmissionPayload } from "@/lib/submission-proposal";
import { extractDocument, fileToDocumentPayload, type DocumentPayload } from "@/lib/extract";
import { ELEMENT_CATEGORIES } from "@/lib/elements";
import { formatDay, localIsoDate } from "@/lib/deadlines";
import { formatFileSize } from "@/lib/format";
import { Logo } from "@/components/Logo";
import { Loading } from "@/components/Loading";
import { Badge } from "@/components/ui/Badge";
import {
  IconCamera,
  IconCheck,
  IconClose,
  IconFile,
  IconPlus,
  IconShield,
  IconSparkles,
} from "@/components/Icons";

// Veřejná stránka pro řemeslníka / revizního technika (odkaz nebo QR, bez přihlášení).
// Vidí jen údaje pozvánky; zápis čeká na potvrzení majitelem.
export default function CraftsmanPage() {
  const { token } = useParams<{ token: string }>();
  const { properties, hydrated } = useStore();
  const [remote, setRemote] = useState<RemoteInviteLookup | null>(null);

  useEffect(() => {
    let alive = true;
    fetchInviteRemote(token).then((r) => {
      if (alive) setRemote(r);
    });
    return () => {
      alive = false;
    };
  }, [token]);

  if (!remote || !hydrated) {
    return (
      <Shell>
        <Loading label="Načítám pozvánku…" />
      </Shell>
    );
  }

  // Server má přednost; bez něj pozvánka z tohoto prohlížeče (ukázkový režim)
  const lookup = combineInviteLookup(remote, findLocalInvite(token, properties));

  if (lookup.status === "not_found") {
    return (
      <Shell>
        <Notice
          title="Odkaz neplatí"
          text="Pozvánka neexistuje nebo ji majitel domu zrušil. Požádejte ho prosím o nový odkaz."
        />
      </Shell>
    );
  }
  if (lookup.status === "expired") {
    return (
      <Shell>
        <Notice
          title="Platnost pozvánky skončila"
          text={`${
            lookup.invite ? `Pozvánka platila do ${formatDay(lookup.invite.expiresAt)}. ` : ""
          }Požádejte prosím majitele domu o nový odkaz.`}
        />
      </Shell>
    );
  }
  if (lookup.status === "error") {
    return (
      <Shell>
        <Notice title="Pozvánku se nepodařilo načíst" text={lookup.message}>
          <button type="button" onClick={() => window.location.reload()} className="btn-primary mt-6">
            Zkusit znovu
          </button>
        </Notice>
      </Shell>
    );
  }

  return (
    <Shell>
      <InviteHeader invite={lookup.invite} />
      <SubmissionForm invite={lookup.invite} mode={lookup.mode} token={token} properties={properties} />
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <meta name="robots" content="noindex, nofollow" />
      <div className="h-1.5 w-full bg-brass" />
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-3 px-4 py-3">
          <Logo className="text-2xl" />
          <span className="text-xs font-medium tracking-[0.18em] text-stone-400">KNIHA DOMU</span>
        </div>
      </header>
      <main className="mx-auto max-w-lg px-4 py-6 pb-16">{children}</main>
    </div>
  );
}

function Notice({ title, text, children }: { title: string; text: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center py-12 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-stone-100 text-stone-400">
        <IconShield className="h-7 w-7" />
      </div>
      <h1 className="mt-5 text-xl font-semibold text-stone-900">{title}</h1>
      <p className="mt-2 max-w-sm text-sm text-stone-500">{text}</p>
      {children}
    </div>
  );
}

function categoryLabel(cat?: string): string | undefined {
  if (!cat) return undefined;
  return ELEMENT_CATEGORIES[cat as ElementCategory] ?? cat;
}

function InviteHeader({ invite }: { invite: InvitePublic }) {
  const cat = categoryLabel(invite.elementCategory);
  return (
    <div className="card p-4">
      <Badge color={invite.role === "INSPECTOR" ? "violet" : "blue"}>{INVITE_ROLES[invite.role]}</Badge>
      <h1 className="mt-2 text-xl font-semibold tracking-tight text-stone-900">Zápis do knihy domu</h1>
      <p className="mt-1 break-words text-sm font-medium text-stone-800">
        {invite.propertyName}
        {invite.city ? <span className="font-normal text-stone-500"> · {invite.city}</span> : null}
      </p>
      {invite.elementId && invite.elementName && (
        <p className="mt-1 break-words text-sm text-teal-700">
          Prvek: {invite.elementName}
          {cat ? <span className="text-stone-500"> ({cat})</span> : null}
        </p>
      )}
      <p className="mt-2 text-xs text-stone-400">Pozvánka platí do {formatDay(invite.expiresAt)}.</p>
    </div>
  );
}

// --- Formulář -------------------------------------------------------------------

type FormState = {
  name: string;
  company: string;
  phone: string;
  workType: WorkType;
  elementId: string;
  date: string;
  title: string;
  description: string;
  cost: string;
  result: InspectionResult | "";
  nextDueDate: string;
  intervalMonths: string;
};

type FieldKey = keyof FormState;

type DocItem = { file: File; att: SubmissionFile };

type AiState =
  | { status: "idle" }
  | { status: "loading"; fileId: string }
  | { status: "done"; fileId: string }
  | { status: "off" | "failed"; message: string };

const CONTACT_KEY = "bulo-zapis-kontakt";

function initialForm(invite: InvitePublic): FormState {
  let contact = { name: "", company: "", phone: "" };
  try {
    const raw = localStorage.getItem(CONTACT_KEY);
    if (raw) contact = { ...contact, ...(JSON.parse(raw) as Partial<typeof contact>) };
  } catch {
    // bez úložiště prostě nepředvyplníme
  }
  return {
    name: String(contact.name ?? ""),
    company: String(contact.company ?? ""),
    phone: String(contact.phone ?? ""),
    workType: invite.role === "INSPECTOR" ? "INSPECTION" : "REPAIR",
    elementId: "",
    date: localIsoDate(),
    title: "",
    description: "",
    cost: "",
    result: "",
    nextDueDate: "",
    intervalMonths: "",
  };
}

const CONFIDENCE_LABELS: Record<ExtractionResult["confidence"], string> = {
  HIGH: "AI si je jistá",
  MEDIUM: "AI si je částečně jistá",
  LOW: "AI si není jistá — zkontrolujte pečlivě",
};

function parseNumber(v: string): number | undefined {
  const s = v.replace(/\s/g, "").replace(",", ".");
  if (!s) return undefined;
  return Number(s);
}

function SubmissionForm({
  invite,
  mode,
  token,
  properties,
}: {
  invite: InvitePublic;
  mode: InboxMode;
  token: string;
  properties: Property[];
}) {
  // hodnoty formuláře + pole předvyplněná AI (mění se vždy spolu)
  const [state, setState] = useState<{ form: FormState; aiFilled: FieldKey[] }>(() => ({
    form: initialForm(invite),
    aiFilled: [],
  }));
  const { form, aiFilled } = state;
  const [docs, setDocs] = useState<DocItem[]>([]);
  const [photos, setPhotos] = useState<SubmissionFile[]>([]);
  const [measured, setMeasured] = useState(false);
  const [ai, setAi] = useState<AiState>({ status: "idle" });
  // poslední úspěšné vyčtení (patří k jednomu dokladu); pozdější neúspěch ho nesmaže
  const [extraction, setExtraction] = useState<{ fileId: string; result: ExtractionResult } | null>(null);
  const aiRun = useRef(0); // zahodí pozdní výsledek AI (doklad mezitím odebrán / nový zápis)
  const [processing, setProcessing] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState<InboxMode | null>(null);

  const fixedElement = !!invite.elementId;
  const elements = invite.elements ?? [];
  const isInspection = form.workType === "INSPECTION";
  const showNext = isInspection || form.workType === "REPAIR";
  const extracted = extraction?.result;

  const allFiles = [...docs.map((d) => d.att), ...photos];
  const totalSize = allFiles.reduce((s, f) => s + (f.size ?? 0), 0);
  const usedPct = Math.min(100, Math.round((totalSize / SUBMISSION_LIMITS.maxTotalBytes) * 100));

  function set<K extends FieldKey>(key: K, value: FormState[K]) {
    setState((s) => ({
      form: { ...s.form, [key]: value },
      aiFilled: s.aiFilled.filter((k) => k !== key),
    }));
  }

  // Přidání souborů s limity (počet, velikost) — přátelské hlášky
  function fitsLimits(added: SubmissionFile[], file: SubmissionFile): string | null {
    const count = allFiles.length + added.length + 1;
    if (count > SUBMISSION_LIMITS.maxFiles) {
      return `Najednou lze poslat nejvýš ${SUBMISSION_LIMITS.maxFiles} souborů. Další zápis můžete poslat hned potom.`;
    }
    const size = totalSize + added.reduce((s, f) => s + (f.size ?? 0), 0) + (file.size ?? 0);
    if (size > SUBMISSION_LIMITS.maxTotalBytes) {
      return "Přílohy by byly dohromady moc velké. Uberte nějakou fotku, nebo pošlete zbytek v dalším zápisu.";
    }
    return null;
  }

  async function addDocs(files: File[]) {
    if (files.length === 0) return;
    setFileError(null);
    setProcessing(true);
    const added: DocItem[] = [];
    let error: string | null = null;
    for (const file of files) {
      const r = await documentToAttachment(file, "PROTOCOL");
      if (!r.ok) {
        error = r.message;
        continue;
      }
      const limit = fitsLimits(
        added.map((d) => d.att),
        r.file,
      );
      if (limit) {
        error = limit;
        break;
      }
      added.push({ file, att: r.file });
    }
    setDocs((d) => [...d, ...added]);
    setFileError(error);
    setProcessing(false);
  }

  async function addPhotos(files: File[]) {
    if (files.length === 0) return;
    setFileError(null);
    setProcessing(true);
    const added: SubmissionFile[] = [];
    let error: string | null = null;
    for (const file of files) {
      const r = await photoToAttachment(file);
      if (!r.ok) {
        error = r.message;
        continue;
      }
      const limit = fitsLimits(added, r.file);
      if (limit) {
        error = limit;
        break;
      }
      added.push(r.file);
    }
    setPhotos((p) => [...p, ...added]);
    setFileError(error);
    setProcessing(false);
  }

  function removeDoc(id: string) {
    setDocs((d) => d.filter((x) => x.att.id !== id));
    // vyčtení patřilo k tomuto dokladu → zahodíme ho (údaje ve formuláři zůstanou)
    if (extraction?.fileId === id) setExtraction(null);
    if ((ai.status === "done" || ai.status === "loading") && ai.fileId === id) {
      aiRun.current++;
      setAi({ status: "idle" });
    }
  }

  function setDocRole(id: string, role: "PROTOCOL" | "INVOICE") {
    setDocs((d) => d.map((x) => (x.att.id === id ? { ...x, att: { ...x.att, role } } : x)));
  }

  async function runAi(doc: DocItem) {
    const fileId = doc.att.id;
    const run = ++aiRun.current;
    setAi({ status: "loading", fileId });
    let payload: DocumentPayload | null = null;
    try {
      payload = await fileToDocumentPayload(doc.file);
    } catch {
      payload = null;
    }
    if (aiRun.current !== run) return;
    if (!payload && doc.att.dataUrl) {
      payload = { name: doc.att.name, mediaType: doc.att.mediaType, dataUrl: doc.att.dataUrl };
    }
    if (!payload) {
      setAi({ status: "failed", message: "Tento soubor AI neumí přečíst — vyplňte prosím údaje ručně." });
      return;
    }
    let out: Awaited<ReturnType<typeof extractDocument>>;
    try {
      out = await extractDocument(payload, { propertyName: invite.propertyName, elements });
    } catch {
      out = { ok: false, reason: "failed" };
    }
    if (aiRun.current !== run) return;
    if (!out.ok) {
      const message =
        out.reason === "not_configured"
          ? "AI vyčtení není v této ukázce zapnuté — vyplňte prosím ručně."
          : out.reason === "unsupported"
            ? "Tento soubor AI neumí přečíst — vyplňte prosím údaje ručně."
            : out.reason === "too_large"
              ? "Soubor je pro AI moc velký — vyplňte prosím údaje ručně."
              : out.message || "Vyčtení se nepovedlo — vyplňte prosím údaje ručně.";
      setAi({ status: out.reason === "not_configured" ? "off" : "failed", message });
      return;
    }
    applyExtraction(out.result, fileId);
  }

  // Předvyplní formulář návrhem od AI (jen co AI opravdu našla; ruční text nepřepíše)
  function applyExtraction(r: ExtractionResult, fileId: string) {
    setState((s) => {
      const f = s.form;
      const next = { ...f };
      const filled: FieldKey[] = [];
      const put = <K extends FieldKey>(key: K, value: FormState[K] | null | undefined | "") => {
        if (value == null || value === "") return;
        next[key] = value as FormState[K];
        filled.push(key);
      };
      put("workType", r.workType);
      put("title", r.title.slice(0, TEXT_LIMITS.title));
      if (!f.description.trim()) {
        const defects = r.defects.length ? `\n\nZjištěné závady:\n${r.defects.map((d) => `– ${d}`).join("\n")}` : "";
        put("description", `${r.summary}${defects}`.trim().slice(0, TEXT_LIMITS.description));
      }
      put("date", r.date);
      put("cost", r.cost != null ? String(r.cost) : null);
      put("result", r.result);
      put("nextDueDate", r.nextDueDate);
      put("intervalMonths", r.intervalMonths != null ? String(r.intervalMonths) : null);
      if (!fixedElement && r.elementId && elements.some((e) => e.id === r.elementId)) {
        put("elementId", r.elementId);
      }
      if (!f.company.trim()) put("company", r.supplier?.slice(0, TEXT_LIMITS.company));
      if (!f.name.trim()) put("name", r.technician?.slice(0, TEXT_LIMITS.name));
      return { form: next, aiFilled: filled };
    });
    if (r.docKind === "INVOICE" || r.docKind === "PROTOCOL") setDocRole(fileId, r.docKind);
    setExtraction({ fileId, result: r });
    setAi({ status: "done", fileId });
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (processing || sending || ai.status === "loading") return;
    setSubmitError(null);
    const payload: SubmissionPayload = {
      elementId: fixedElement ? invite.elementId : form.elementId || undefined,
      author: { name: form.name, company: form.company, phone: form.phone },
      workType: form.workType,
      title: form.title,
      description: form.description,
      date: form.date,
      cost: parseNumber(form.cost),
      result: isInspection && form.result ? form.result : undefined,
      nextDueDate: showNext && form.nextDueDate ? form.nextDueDate : undefined,
      intervalMonths: showNext ? parseNumber(form.intervalMonths) : undefined,
      measuredOpenWall: photos.length > 0 && measured ? true : undefined,
      attachments: allFiles,
      extracted,
    };
    // stejné kontroly jako na serveru — hláška hned, bez čekání
    const v = validateSubmissionPayload(payload, invite);
    if (!v.ok) {
      setSubmitError(v.message);
      return;
    }
    setSending(true);
    const r = await submitToInvite(token, payload, properties);
    setSending(false);
    if (!r.ok) {
      setSubmitError(r.message);
      return;
    }
    try {
      localStorage.setItem(
        CONTACT_KEY,
        JSON.stringify({ name: form.name.trim(), company: form.company.trim(), phone: form.phone.trim() }),
      );
    } catch {
      // nevadí
    }
    setSent(r.mode);
    window.scrollTo({ top: 0 });
  }

  function startOver() {
    setState((s) => ({
      form: { ...initialForm(invite), name: s.form.name, company: s.form.company, phone: s.form.phone },
      aiFilled: [],
    }));
    setDocs([]);
    setPhotos([]);
    setMeasured(false);
    aiRun.current++;
    setAi({ status: "idle" });
    setExtraction(null);
    setFileError(null);
    setSubmitError(null);
    setSent(null);
  }

  if (sent) {
    return (
      <div className="card mt-4 flex flex-col items-center px-5 py-10 text-center">
        <div className="grid h-14 w-14 place-items-center rounded-full bg-emerald-50 text-emerald-600">
          <IconCheck className="h-7 w-7" />
        </div>
        <h2 className="mt-4 text-lg font-semibold text-stone-900">Odesláno.</h2>
        <p className="mt-1 max-w-xs text-sm text-stone-600">Majitel zápis potvrdí jedním klepnutím.</p>
        {sent === "local" && (
          <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
            Ukázkový režim: zápis uvidí majitel jen v tomto prohlížeči.
          </p>
        )}
        <button type="button" onClick={startOver} className="btn-secondary mt-6 min-h-10">
          <IconPlus className="h-4 w-4" />
          Zapsat další práci
        </button>
      </div>
    );
  }

  const aiTag = (key: FieldKey) =>
    aiFilled.includes(key) ? (
      <span className="ml-1.5 rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">
        AI
      </span>
    ) : null;
  const aiRing = (key: FieldKey) => (aiFilled.includes(key) ? " border-amber-300 bg-amber-50/40" : "");
  const busy = processing || sending;
  const aiLoading = ai.status === "loading";

  return (
    <form onSubmit={submit} className="mt-4 space-y-4" noValidate>
      {mode === "local" && (
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
          Ukázkový režim: zápis se uloží jen v tomto prohlížeči.
        </p>
      )}

      <fieldset className="card space-y-4 p-4" disabled={sending}>
        <legend className="sr-only">Kdo zapisuje</legend>
        <h2 className="text-sm font-semibold text-stone-900">Kdo zapisuje</h2>
        <div>
          <label className="label" htmlFor="z-name">
            Vaše jméno *{aiTag("name")}
          </label>
          <input
            id="z-name"
            className={`input${aiRing("name")}`}
            required
            maxLength={TEXT_LIMITS.name}
            autoComplete="name"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="z-company">
              Firma{aiTag("company")}
            </label>
            <input
              id="z-company"
              className={`input${aiRing("company")}`}
              maxLength={TEXT_LIMITS.company}
              autoComplete="organization"
              value={form.company}
              onChange={(e) => set("company", e.target.value)}
            />
          </div>
          <div>
            <label className="label" htmlFor="z-phone">
              Telefon
            </label>
            <input
              id="z-phone"
              type="tel"
              inputMode="tel"
              className="input"
              maxLength={TEXT_LIMITS.phone}
              autoComplete="tel"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="card space-y-3 p-4" disabled={sending}>
        <legend className="sr-only">Protokol nebo faktura</legend>
        <div>
          <h2 className="text-sm font-semibold text-stone-900">Protokol nebo faktura</h2>
          <p className="mt-0.5 text-xs text-stone-500">
            Vyfoťte nebo nahrajte doklad — AI z něj umí předvyplnit údaje.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <FileButton
            label="Vyfotit doklad"
            icon={<IconCamera className="h-4 w-4" />}
            accept="image/*"
            capture
            disabled={busy}
            onFiles={addDocs}
          />
          <FileButton
            label="Nahrát PDF / foto"
            icon={<IconFile className="h-4 w-4" />}
            accept="image/*,application/pdf"
            multiple
            disabled={busy}
            onFiles={addDocs}
          />
        </div>

        {docs.length > 0 && (
          <ul className="space-y-3">
            {docs.map((d) => {
              const reading = ai.status === "loading" && ai.fileId === d.att.id;
              return (
                <li key={d.att.id} className="rounded-xl border border-stone-200 p-3">
                  <div className="flex items-center gap-3">
                    <Thumb file={d.att} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-stone-800">{d.att.name}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <select
                          aria-label="Druh dokladu"
                          className="rounded-md border border-stone-300 bg-white px-2 py-1.5 text-xs"
                          value={d.att.role}
                          onChange={(e) => setDocRole(d.att.id, e.target.value === "INVOICE" ? "INVOICE" : "PROTOCOL")}
                        >
                          <option value="PROTOCOL">Protokol</option>
                          <option value="INVOICE">Faktura</option>
                        </select>
                        <span className="text-xs text-stone-400">{formatFileSize((d.att.size ?? 0) * 0.75)}</span>
                      </div>
                    </div>
                    <RemoveButton label={`Odebrat ${d.att.name}`} onClick={() => removeDoc(d.att.id)} />
                  </div>
                  <button
                    type="button"
                    onClick={() => runAi(d)}
                    disabled={busy || ai.status === "loading"}
                    className="btn-secondary btn-sm mt-3 min-h-10 w-full"
                  >
                    <IconSparkles className="h-4 w-4" />
                    {reading ? "Čtu doklad…" : "Vyčíst údaje z dokladu (AI)"}
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        {(ai.status === "off" || ai.status === "failed") && (
          <p className="rounded-lg bg-stone-100 px-3 py-2 text-xs text-stone-600">{ai.message}</p>
        )}
        {extraction && (
          <div className="rounded-lg bg-amber-50 p-3 text-xs text-amber-900">
            <p className="flex items-center gap-1.5 font-semibold">
              <IconSparkles className="h-4 w-4" />
              Návrh od AI — zkontrolujte
            </p>
            <p className="mt-1">
              {CONFIDENCE_LABELS[extraction.result.confidence]}. Pole označená „AI“ jsou předvyplněná — opravte,
              co nesedí.
            </p>
            {extraction.result.device && <p className="mt-1">Zařízení: {extraction.result.device}</p>}
            {extraction.result.warnings.length > 0 && (
              <ul className="mt-1.5 list-disc space-y-0.5 pl-4">
                {extraction.result.warnings.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </fieldset>

      <fieldset className="card space-y-4 p-4" disabled={sending}>
        <legend className="sr-only">Co se dělalo</legend>
        <h2 className="text-sm font-semibold text-stone-900">Co se dělalo</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="z-type">
              Typ práce{aiTag("workType")}
            </label>
            <select
              id="z-type"
              className={`input min-h-10${aiRing("workType")}`}
              value={form.workType}
              onChange={(e) => set("workType", e.target.value as WorkType)}
            >
              {Object.entries(WORK_TYPES).map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="z-date">
              Datum *{aiTag("date")}
            </label>
            <input
              id="z-date"
              type="date"
              required
              className={`input min-h-10${aiRing("date")}`}
              value={form.date}
              onChange={(e) => set("date", e.target.value)}
            />
          </div>
        </div>

        {!fixedElement && elements.length > 0 && (
          <div>
            <label className="label" htmlFor="z-element">
              Čeho se práce týká{aiTag("elementId")}
            </label>
            <select
              id="z-element"
              className={`input min-h-10${aiRing("elementId")}`}
              value={form.elementId}
              onChange={(e) => set("elementId", e.target.value)}
            >
              <option value="">Nevím / jiné</option>
              {elements.map((el) => (
                <option key={el.id} value={el.id}>
                  {el.name}
                  {el.room ? ` · ${el.room}` : ""}
                  {categoryLabel(el.category) ? ` (${categoryLabel(el.category)})` : ""}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="label" htmlFor="z-title">
            Co se dělalo *{aiTag("title")}
          </label>
          <input
            id="z-title"
            required
            maxLength={TEXT_LIMITS.title}
            className={`input${aiRing("title")}`}
            placeholder={isInspection ? "Např. Pravidelná revize elektroinstalace" : "Např. Výměna jističe"}
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
          />
        </div>

        <div>
          <label className="label" htmlFor="z-desc">
            Popis{aiTag("description")}
          </label>
          <textarea
            id="z-desc"
            maxLength={TEXT_LIMITS.description}
            className={`input${aiRing("description")}`}
            placeholder="Co jste zjistili nebo udělali, použitý materiál, doporučení…"
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
          />
        </div>

        <div>
          <label className="label" htmlFor="z-cost">
            Cena (Kč){aiTag("cost")}
          </label>
          <input
            id="z-cost"
            type="number"
            min={0}
            step="any"
            inputMode="decimal"
            className={`input${aiRing("cost")}`}
            placeholder="volitelné"
            value={form.cost}
            onChange={(e) => set("cost", e.target.value)}
          />
        </div>

        {isInspection && (
          <div>
            <label className="label" htmlFor="z-result">
              Výsledek revize{aiTag("result")}
            </label>
            <select
              id="z-result"
              className={`input min-h-10${aiRing("result")}`}
              value={form.result}
              onChange={(e) => set("result", e.target.value as InspectionResult | "")}
            >
              <option value="">— neuvádím —</option>
              {Object.entries(INSPECTION_RESULTS).map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </select>
          </div>
        )}

        {showNext && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="z-next">
                {isInspection ? "Příští revize" : "Příští servis"}
                {aiTag("nextDueDate")}
              </label>
              <input
                id="z-next"
                type="date"
                className={`input min-h-10${aiRing("nextDueDate")}`}
                value={form.nextDueDate}
                onChange={(e) => set("nextDueDate", e.target.value)}
              />
            </div>
            <div>
              <label className="label" htmlFor="z-interval">
                Lhůta (měsíce){aiTag("intervalMonths")}
              </label>
              <input
                id="z-interval"
                type="number"
                min={1}
                max={1200}
                step={1}
                inputMode="numeric"
                className={`input${aiRing("intervalMonths")}`}
                value={form.intervalMonths}
                onChange={(e) => set("intervalMonths", e.target.value)}
              />
              <p className="mt-1 text-xs text-stone-400">Jen pokud je uvedena v protokolu.</p>
            </div>
          </div>
        )}
      </fieldset>

      <fieldset className="card space-y-3 p-4" disabled={sending}>
        <legend className="sr-only">Fotky</legend>
        <div>
          <h2 className="text-sm font-semibold text-stone-900">Fotky</h2>
          <p className="mt-0.5 text-xs text-stone-500">
            Ideálně otevřená zeď nebo zařízení s metrem či značkami — zpřesní to plán domu.
          </p>
        </div>
        <FileButton
          label="Přidat fotky"
          icon={<IconCamera className="h-4 w-4" />}
          accept="image/*"
          multiple
          disabled={busy}
          onFiles={addPhotos}
        />
        {photos.length > 0 && (
          <>
            <ul className="grid grid-cols-3 gap-2">
              {photos.map((p) => (
                <li key={p.id} className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.dataUrl} alt={p.name} className="h-24 w-full rounded-lg border border-stone-200 object-cover" />
                  <button
                    type="button"
                    onClick={() => setPhotos((list) => list.filter((x) => x.id !== p.id))}
                    aria-label={`Odebrat ${p.name}`}
                    className="absolute right-0 top-0 grid h-10 w-10 place-items-center"
                  >
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-white/90 text-stone-700 shadow">
                      <IconClose className="h-4 w-4" />
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            <label className="flex min-h-10 cursor-pointer items-start gap-3 rounded-lg bg-stone-50 p-3 text-sm text-stone-700">
              <input
                type="checkbox"
                className="mt-0.5 h-5 w-5 shrink-0 accent-teal-700"
                checked={measured}
                onChange={(e) => setMeasured(e.target.checked)}
              />
              <span>Na fotkách otevřené zdi je metr / značky — poloha je změřená</span>
            </label>
          </>
        )}
      </fieldset>

      {(allFiles.length > 0 || processing) && (
        <p className="text-xs text-stone-500">
          {processing
            ? "Zpracovávám soubory…"
            : `Přílohy: ${allFiles.length} z ${SUBMISSION_LIMITS.maxFiles} souborů, využito ${usedPct} % limitu velikosti.`}
        </p>
      )}
      {fileError && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
          {fileError}
        </p>
      )}

      <div className="rounded-xl bg-stone-100/70 p-3 text-xs leading-relaxed text-stone-600">
        <p className="font-medium text-stone-700">Co se odešle</p>
        <p className="mt-0.5">
          Vaše jméno, firma a telefon, údaje o práci a přiložené soubory. Uvidí je jen majitel domu
          a do knihy se zápis uloží až po jeho potvrzení. Tlačítko AI pošle doklad k automatickému
          přečtení — výsledek je jen návrh, který kontrolujete vy i majitel.
        </p>
      </div>

      {submitError && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {submitError}
        </p>
      )}

      <button type="submit" disabled={busy || aiLoading} className="btn-primary min-h-12 w-full text-base">
        {sending ? "Odesílám…" : "Odeslat do knihy domu"}
      </button>
      <p className="text-center text-xs text-stone-400">
        <Link href="/" className="hover:underline">
          Co je BULO?
        </Link>
      </p>
    </form>
  );
}

function FileButton({
  label,
  icon,
  accept,
  multiple,
  capture,
  disabled,
  onFiles,
}: {
  label: string;
  icon: React.ReactNode;
  accept: string;
  multiple?: boolean;
  capture?: boolean;
  disabled?: boolean;
  onFiles: (files: File[]) => void;
}) {
  return (
    <label
      className={`btn-secondary min-h-11 w-full px-3 text-center ${
        disabled ? "pointer-events-none opacity-60" : ""
      }`}
    >
      {icon}
      {label}
      <input
        type="file"
        className="sr-only"
        accept={accept}
        multiple={multiple}
        capture={capture ? "environment" : undefined}
        disabled={disabled}
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          e.target.value = ""; // stejný soubor půjde vybrat znovu
          onFiles(files);
        }}
      />
    </label>
  );
}

function Thumb({ file }: { file: SubmissionFile }) {
  if (file.kind === "image" && file.dataUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={file.dataUrl} alt="" className="h-12 w-12 shrink-0 rounded-lg border border-stone-200 object-cover" />
    );
  }
  return (
    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-stone-100 text-stone-500">
      <IconFile className="h-5 w-5" />
    </span>
  );
}

function RemoveButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="grid h-10 w-10 shrink-0 place-items-center rounded-lg text-stone-400 hover:bg-stone-100 hover:text-stone-700"
    >
      <IconClose className="h-4 w-4" />
    </button>
  );
}
