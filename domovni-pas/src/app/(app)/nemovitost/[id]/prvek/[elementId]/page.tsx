"use client";

import Link from "next/link";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  useStore,
  type HouseElement,
  type InventoryItem,
  type Property,
  type Reminder,
  type ReminderType,
} from "@/lib/store";
import { canEditProperty, canSeeProperty } from "@/lib/access";
import {
  ELEMENT_CATEGORIES,
  ELEMENT_CATEGORY_COLORS,
  ELEMENT_CONDITIONS,
  ELEMENT_CONDITION_COLORS,
  SAFETY_NOTE,
  accuracyClass,
  accuracyLabel,
  elementLinks,
} from "@/lib/elements";
import {
  DEADLINE_STATE_COLORS,
  DEADLINE_STATE_LABELS,
  ISO_DATE_RE,
  daysUntil,
  deadlineState,
  formatDay,
  intervalLabel,
  relativeDueLabel,
} from "@/lib/deadlines";
import { REMINDER_TYPES } from "@/lib/enums";
import { Loading } from "@/components/Loading";
import { BackLink } from "@/components/BackLink";
import { Badge } from "@/components/ui/Badge";
import { EntryCard } from "@/components/EntryCard";
import { DocumentRow } from "@/components/DocumentRow";
import { PlanMini } from "@/components/model/PlanMini";
import {
  IconAlert,
  IconBox,
  IconCalendar,
  IconChevronDown,
  IconFile,
  IconLink,
  IconPlus,
  IconShield,
  IconSparkles,
  IconTrash,
  IconUsers,
} from "@/components/Icons";
import { AccuracyIndicator } from "@/components/elements/AccuracyIndicator";
import { ElementForm } from "@/components/elements/ElementForm";
import { LinkRecordsPanel } from "@/components/elements/LinkRecordsPanel";
import { IconPencil, IconPin } from "@/components/elements/icons";
import { isPlaced, modelHref } from "@/components/elements/element-utils";

export default function ElementDetailPage() {
  const { id, elementId } = useParams<{ id: string; elementId: string }>();
  const router = useRouter();
  const { getProperty, hydrated, role, deleteElement, deleteEntry } = useStore();
  const [editing, setEditing] = useState(false);
  const [linking, setLinking] = useState(false);
  const [deleted, setDeleted] = useState(false); // po smazání jen čekáme na přesměrování

  if (!hydrated) return <Loading />;

  const property = getProperty(id);
  if (!property || (role && !canSeeProperty(property, role))) {
    return (
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-stone-500">
          {property ? "K této nemovitosti nemáte přístup." : "Nemovitost nenalezena."}
        </p>
        <Link href="/prehled" className="btn-secondary mt-4">
          Zpět na přehled
        </Link>
      </div>
    );
  }

  const el = property.elements?.find((e) => e.id === elementId);
  if (!el) {
    if (deleted) return <Loading />;
    return (
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-stone-500">Prvek nenalezen — mohl být smazán.</p>
        <Link href={`/nemovitost/${id}/prvky`} className="btn-secondary mt-4">
          Prvky domu
        </Link>
      </div>
    );
  }

  const editable = role ? canEditProperty(property, role) : false;
  const links = elementLinks(property, el.id);
  const entries = [...links.entries].sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
  const meta = [el.kind, el.room].filter(Boolean).join(" · ");
  const base = `/nemovitost/${id}`;
  const q = `prvek=${encodeURIComponent(el.id)}`;

  function openLinking() {
    setLinking(true);
    requestAnimationFrame(() =>
      document.getElementById("navazat")?.scrollIntoView({ behavior: "smooth", block: "start" }),
    );
  }

  function remove(e: HouseElement) {
    const ok = confirm(
      `Smazat prvek „${e.name}“?\n\nNavázané záznamy, dokumenty, termíny a vybavení zůstanou v knize, jen se od prvku odpojí. Pozvánky k tomuto prvku přestanou platit.`,
    );
    if (!ok) return;
    // replace: tlačítko Zpět se nevrátí na smazaný prvek
    setDeleted(true);
    router.replace(`${base}/prvky`);
    deleteElement(id, e.id);
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <BackLink href={base}>Zpět na nemovitost</BackLink>
        <Link href={`${base}/prvky`} className="text-sm text-stone-500 transition hover:text-stone-800">
          Všechny prvky
        </Link>
      </div>

      {!editable && (
        <div className="mt-4 flex items-start gap-3 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
          <IconShield className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <p>Tuto nemovitost máte jen ke čtení.</p>
        </div>
      )}

      {/* Hlavička */}
      <div className="mt-4 flex items-stretch gap-3">
        <span
          className="w-1.5 shrink-0 rounded-full"
          style={{ backgroundColor: ELEMENT_CATEGORY_COLORS[el.category] }}
          aria-hidden
        />
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: ELEMENT_CATEGORY_COLORS[el.category] }}>
            {ELEMENT_CATEGORIES[el.category]}
          </p>
          <h1 className="mt-0.5 break-words text-2xl font-semibold tracking-tight text-stone-900">
            {el.name}
          </h1>
          <div className="mt-1.5 flex flex-wrap items-center gap-2 text-sm text-stone-500">
            {meta && <span className="break-words">{meta}</span>}
            <Badge color={ELEMENT_CONDITION_COLORS[el.condition]}>{ELEMENT_CONDITIONS[el.condition]}</Badge>
          </div>
          <p className="mt-1 text-xs text-stone-400">{property.name}</p>
        </div>
      </div>

      {editable && (
        <div className="mt-5 flex flex-wrap gap-2">
          <Link href={`${base}/zaznam/novy?${q}`} className="btn-primary">
            <IconPlus className="h-4 w-4" />
            Zapsat sem
          </Link>
          <Link href={`${base}/zaznam/z-dokladu?${q}`} className="btn-secondary">
            <IconSparkles className="h-4 w-4" />
            Nahrát protokol (AI)
          </Link>
          <Link href={`${base}/pozvanky?${q}`} className="btn-secondary">
            <IconUsers className="h-4 w-4" />
            Pozvat řemeslníka
          </Link>
          <button
            type="button"
            onClick={() => setEditing((v) => !v)}
            className="btn-ghost"
            aria-expanded={editing}
          >
            <IconPencil className="h-4 w-4" />
            Upravit
          </button>
          <button type="button" onClick={() => remove(el)} className="btn-ghost text-stone-500 hover:text-red-600">
            <IconTrash className="h-4 w-4" />
            Smazat
          </button>
        </div>
      )}

      {editable && editing && (
        <section className="card mt-6 p-5 sm:p-6">
          <h2 className="text-base font-semibold text-stone-900">Upravit prvek</h2>
          <div className="mt-5">
            <ElementForm
              key={el.updatedAt}
              property={property}
              element={el}
              onSaved={() => setEditing(false)}
              onCancel={() => setEditing(false)}
            />
          </div>
        </section>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <WhereSection property={property} element={el} editable={editable} />
        <WhatSection property={property} element={el} inventory={links.inventory} editable={editable} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <DeadlinesSection property={property} element={el} reminders={links.reminders} editable={editable} />

        <section className="card p-5">
          <SectionTitle icon={<IconFile className="h-4 w-4" />} title="Dokumenty" count={links.documents.length} />
          {links.documents.length === 0 ? (
            <p className="mt-2 text-sm text-stone-500">
              Žádný doklad. Protokoly, faktury a záruční listy k prvku se objeví tady.
            </p>
          ) : (
            <ul className="mt-1 divide-y divide-stone-100">
              {links.documents.map((d) => (
                <DocumentRow key={d.id} doc={d} propertyId={id} excludeElementId={el.id} />
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Historie */}
      <section className="mt-8">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-semibold text-stone-900">Historie</h2>
          {editable && entries.length > 0 && (
            <Link href={`${base}/zaznam/novy?${q}`} className="btn-secondary btn-sm min-h-10">
              <IconPlus className="h-4 w-4" />
              Zapsat sem
            </Link>
          )}
        </div>
        {entries.length === 0 ? (
          <div className="card mt-4 flex flex-col items-center px-6 py-10 text-center">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-teal-50 text-teal-700">
              <IconCalendar className="h-6 w-6" />
            </div>
            <p className="mt-4 text-sm font-medium text-stone-800">K prvku zatím nic není zapsané</p>
            {editable && (
              <>
                <p className="mt-1 max-w-sm text-sm text-stone-500">
                  Zapište opravu nebo revizi, nahrajte protokol — nebo navažte záznamy, které už v
                  knize máte.
                </p>
                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  <Link href={`${base}/zaznam/novy?${q}`} className="btn-primary">
                    <IconPlus className="h-4 w-4" />
                    Zapsat sem
                  </Link>
                  <button type="button" onClick={openLinking} className="btn-secondary">
                    <IconLink className="h-4 w-4" />
                    Navázat existující
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <ol className="mt-5 space-y-5 border-l-2 border-stone-200 pl-7">
            {entries.map((entry) => (
              <EntryCard
                key={entry.id}
                entry={entry}
                property={property}
                excludeElementId={el.id}
                onDelete={editable ? () => deleteEntry(id, entry.id) : undefined}
              />
            ))}
          </ol>
        )}
      </section>

      {/* Migrace existujících dat na prvek */}
      {editable && (
        <section id="navazat" className="card mt-8 scroll-mt-6">
          <button
            type="button"
            onClick={() => setLinking((v) => !v)}
            className="flex min-h-14 w-full items-center justify-between gap-3 px-5 py-3 text-left"
            aria-expanded={linking}
          >
            <span className="flex items-center gap-2">
              <IconLink className="h-4 w-4 text-teal-700" />
              <span className="text-sm font-semibold text-stone-900">Navázat existující záznamy</span>
            </span>
            <IconChevronDown className={`h-4 w-4 shrink-0 text-stone-400 transition ${linking ? "rotate-180" : ""}`} />
          </button>
          {linking && (
            <div className="border-t border-stone-100 px-5 pb-5 pt-4">
              <LinkRecordsPanel property={property} element={el} />
            </div>
          )}
        </section>
      )}
    </div>
  );
}

function SectionTitle({ icon, title, count }: { icon: React.ReactNode; title: string; count?: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-teal-700">{icon}</span>
      <h2 className="text-sm font-semibold text-stone-900">{title}</h2>
      {count != null && count > 0 && <span className="text-xs text-stone-400">· {count}</span>}
    </div>
  );
}

// „Kde vede" — poloha na půdorysu, slovní popis, přesnost a bezpečnostní upozornění
function WhereSection({
  property,
  element: el,
  editable,
}: {
  property: Property;
  element: HouseElement;
  editable: boolean;
}) {
  const placed = isPlaced(property, el);
  const model = placed ? property.models?.find((m) => m.id === el.plan?.modelId) : undefined;
  const cls = accuracyClass(el);

  return (
    <section className="card p-5">
      <SectionTitle icon={<IconPin className="h-4 w-4" />} title="Kde vede" />

      <div className="mt-3">
        {placed ? (
          <>
            <PlanMini property={property} elementId={el.id} className="w-full" />
            {model && (
              <p className="mt-1.5 text-xs text-stone-400">
                Podklad: {model.title}
                {model.version > 1 ? ` (verze ${model.version})` : ""}
              </p>
            )}
          </>
        ) : (
          <div className="rounded-xl border border-dashed border-stone-300 bg-stone-50 px-4 py-5 text-center">
            <p className="text-sm text-stone-600">Poloha zatím není zakreslená.</p>
            {editable && (
              <Link
                href={modelHref(property.id, el.id, true)}
                className="btn-secondary mt-3"
              >
                <IconPin className="h-4 w-4" />
                Zakreslit v modelu
              </Link>
            )}
          </div>
        )}
      </div>

      {el.location && (
        <p className="mt-4 whitespace-pre-line break-words text-sm leading-relaxed text-stone-700">
          {el.location}
        </p>
      )}

      <div className="mt-4 flex items-center gap-3 rounded-xl bg-stone-50 p-3">
        <AccuracyIndicator element={el} size="lg" />
        <div className="min-w-0">
          <p className="text-xs text-stone-500">Přesnost polohy</p>
          <p className="break-words text-sm font-semibold text-stone-900">{accuracyLabel(el)}</p>
          {cls === "ESTIMATE" && (
            <p className="mt-0.5 text-xs text-stone-500">
              Je to odhad. Zpřesní ho fotka otevřené zdi s metrem nebo sken.
            </p>
          )}
        </div>
      </div>

      <div className="mt-3 flex items-start gap-2.5 rounded-xl bg-amber-50 p-3 text-sm text-amber-900" role="note">
        <IconAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
        <p>{SAFETY_NOTE}</p>
      </div>

      <Link
        href={modelHref(property.id, el.id)}
        className="mt-3 inline-flex min-h-10 items-center gap-1.5 text-sm font-medium text-teal-700 hover:underline"
      >
        <IconBox className="h-4 w-4" />
        Otevřít v modelu
      </Link>
    </section>
  );
}

// „Co to je" — druh, kategorie, instalace, IFC, poznámka, navázané vybavení
function WhatSection({
  property,
  element: el,
  inventory,
  editable,
}: {
  property: Property;
  element: HouseElement;
  inventory: InventoryItem[];
  editable: boolean;
}) {
  return (
    <section className="card p-5">
      <SectionTitle icon={<IconBox className="h-4 w-4" />} title="Co to je" />
      <dl className="mt-3 space-y-2.5 text-sm">
        <Row label="Druh" value={el.kind ?? "—"} />
        <Row label="Vrstva" value={ELEMENT_CATEGORIES[el.category]} />
        {el.room && <Row label="Místnost" value={el.room} />}
        <Row
          label="Instalace"
          value={
            el.installDate
              ? `${formatDay(el.installDate)}${el.installDateEstimated ? " (odhad)" : ""}`
              : "neznámá"
          }
        />
        <Row label="Stav" value={ELEMENT_CONDITIONS[el.condition]} />
        {el.ifcGlobalId && (
          <div className="flex justify-between gap-3">
            <dt className="shrink-0 text-stone-400">IFC GlobalId</dt>
            <dd className="min-w-0 break-all text-right font-mono text-xs text-stone-700">{el.ifcGlobalId}</dd>
          </div>
        )}
      </dl>
      {el.note && (
        <p className="mt-3 whitespace-pre-line break-words border-t border-stone-100 pt-3 text-sm leading-relaxed text-stone-600">
          {el.note}
        </p>
      )}

      <div className="mt-4 border-t border-stone-100 pt-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-400">Vybavení</h3>
          {editable && (
            <Link
              href={`/nemovitost/${property.id}/vybaveni/nove?prvek=${encodeURIComponent(el.id)}`}
              className="btn-ghost btn-sm min-h-10 text-teal-700"
            >
              <IconPlus className="h-4 w-4" />
              Přidat
            </Link>
          )}
        </div>
        {inventory.length === 0 ? (
          <p className="text-sm text-stone-500">Bez navázaného vybavení (značka, záruka, doklad).</p>
        ) : (
          <ul className="mt-1 divide-y divide-stone-100">
            {inventory.map((it) => (
              <InventoryRow key={it.id} item={it} />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function InventoryRow({ item: it }: { item: InventoryItem }) {
  const expired =
    it.warrantyUntil && ISO_DATE_RE.test(it.warrantyUntil) ? daysUntil(it.warrantyUntil) < 0 : false;
  return (
    <li className="py-2">
      <p className="break-words text-sm font-medium text-stone-800">{it.name}</p>
      <p className="flex flex-wrap gap-x-3 text-xs">
        {it.brand && <span className="text-stone-500">{it.brand}</span>}
        {it.warrantyUntil && (
          <span className={expired ? "text-stone-400" : "text-emerald-700"}>
            {expired ? "Záruka skončila" : "Záruka do"} {formatDay(it.warrantyUntil)}
          </span>
        )}
        {it.dataUrl && (
          <a href={it.dataUrl} download={it.fileName ?? it.name} className="text-teal-700 hover:underline">
            Doklad
          </a>
        )}
      </p>
    </li>
  );
}

// „Termíny a revize" — další termín, stav, interval (zadaný člověkem / z protokolu)
function DeadlinesSection({
  property,
  element: el,
  reminders,
  editable,
}: {
  property: Property;
  element: HouseElement;
  reminders: Reminder[];
  editable: boolean;
}) {
  const { addReminder } = useStore();
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const base = `/nemovitost/${property.id}`;
  const sorted = [...reminders].sort(
    (a, b) => Number(a.done) - Number(b.done) || (a.dueDate ?? "").localeCompare(b.dueDate ?? ""),
  );

  return (
    <section className="card p-5">
      <div className="flex items-center justify-between gap-2">
        <SectionTitle icon={<IconCalendar className="h-4 w-4" />} title="Termíny a revize" count={reminders.length} />
        {editable && (
          <button
            type="button"
            onClick={() => {
              setAdding((v) => !v);
              setError(null);
            }}
            className="btn-ghost btn-sm min-h-10 text-teal-700"
            aria-expanded={adding}
          >
            <IconPlus className="h-4 w-4" />
            Přidat
          </button>
        )}
      </div>

      {editable && adding && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const fd = new FormData(form);
            const title = String(fd.get("title") || "").trim();
            const dueDate = String(fd.get("dueDate") || "");
            if (!title) return setError("Vyplňte, o jaký termín jde.");
            if (!ISO_DATE_RE.test(dueDate)) return setError("Zadejte datum dalšího termínu.");
            const intervalRaw = String(fd.get("interval") || "").trim();
            const months = /^\d+$/.test(intervalRaw) ? Number(intervalRaw) : 0;
            if (intervalRaw && (months < 1 || months > 240)) {
              return setError("Lhůta musí být celý počet měsíců (1–240).");
            }
            setError(null);
            addReminder(property.id, {
              title,
              type: String(fd.get("type") || "INSPECTION") as ReminderType,
              dueDate,
              elementId: el.id,
              // lhůtu zadal člověk; potvrzení technikem přijde s protokolem
              intervalMonths: months > 0 ? months : undefined,
              intervalConfirmed: months > 0 ? false : undefined,
            });
            form.reset();
            setAdding(false);
          }}
          className="mt-3 space-y-2 border-b border-stone-100 pb-4"
        >
          <input name="title" required className="input" placeholder={`Např. Revize — ${el.name}`} aria-label="Název termínu" />
          <div className="grid gap-2 sm:grid-cols-2">
            <label className="block">
              <span className="label">Typ</span>
              <select name="type" className="input" defaultValue="INSPECTION">
                {Object.entries(REMINDER_TYPES).map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="label">Další termín *</span>
              <input name="dueDate" type="date" required className="input" />
            </label>
          </div>
          <div>
            {/* textové pole: type=number by „1,5" tiše vyprázdnil */}
            <input
              name="interval"
              inputMode="numeric"
              className="input"
              placeholder="Opakovat po … měsících (volitelné)"
              aria-label="Opakovat po měsících"
            />
            <p className="mt-1 text-xs text-stone-400">
              Lhůtu vyplňte, jen když ji znáte z protokolu nebo od technika — nevymýšlíme ji.
            </p>
          </div>
          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
              {error}
            </p>
          )}
          <button type="submit" className="btn-secondary w-full">
            Uložit termín
          </button>
        </form>
      )}

      {sorted.length === 0 ? (
        <div className="mt-2 text-sm text-stone-500">
          <p>
            K prvku zatím nepatří žádný termín. Lhůtu nevymýšlíme — doplní ji protokol od revizního
            technika, nebo ji zadáte sami.
          </p>
          {editable && (
            <Link
              href={`${base}/zaznam/z-dokladu?prvek=${encodeURIComponent(el.id)}`}
              className="mt-3 inline-flex min-h-10 items-center gap-1.5 font-medium text-teal-700 hover:underline"
            >
              <IconSparkles className="h-4 w-4" />
              Nahrát protokol
            </Link>
          )}
        </div>
      ) : (
        <ul className="mt-1 divide-y divide-stone-100">
          {sorted.map((r) => {
            const { state, daysLeft } = deadlineState(r);
            return (
              <li key={r.id} className="py-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className={`min-w-0 break-words text-sm font-medium ${r.done ? "text-stone-400" : "text-stone-800"}`}>
                    {r.title}
                  </p>
                  <Badge color={DEADLINE_STATE_COLORS[state]}>{DEADLINE_STATE_LABELS[state]}</Badge>
                </div>
                <p className="mt-0.5 text-xs text-stone-500">
                  {REMINDER_TYPES[r.type] ?? r.type} ·{" "}
                  {r.done ? (
                    "splněno"
                  ) : (
                    <>
                      další termín {formatDay(r.dueDate)}
                      {state !== "OK" && ` · ${relativeDueLabel(daysLeft)}`}
                    </>
                  )}
                </p>
                {r.intervalMonths ? (
                  <p className="mt-0.5 text-xs text-stone-500">
                    Opakuje se {intervalLabel(r.intervalMonths)}.{" "}
                    {r.intervalConfirmed ? (
                      <span className="text-emerald-700">
                        Lhůtu potvrdil revizní technik{r.confirmedBy ? ` (${r.confirmedBy})` : ""}.
                      </span>
                    ) : (
                      <span className="text-amber-700">Lhůtu zatím nepotvrdil revizní technik.</span>
                    )}
                  </p>
                ) : null}
                {r.lastDone && (
                  <p className="mt-0.5 text-xs text-stone-400">Naposledy provedeno {formatDay(r.lastDone)}</p>
                )}
                {editable && !r.done && (
                  <Link
                    href={`${base}/zaznam/z-dokladu?prvek=${encodeURIComponent(el.id)}&termin=${encodeURIComponent(r.id)}`}
                    className="mt-1 inline-flex min-h-10 items-center gap-1.5 text-xs font-medium text-teal-700 hover:underline"
                  >
                    <IconSparkles className="h-3.5 w-3.5" />
                    Zapsat provedení z protokolu
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      )}
      <Link
        href={`${base}#terminy`}
        className="mt-1 inline-flex min-h-10 items-center text-xs font-medium text-stone-500 hover:text-stone-800"
      >
        Všechny termíny domu →
      </Link>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="shrink-0 text-stone-400">{label}</dt>
      <dd className="min-w-0 break-words text-right font-medium text-stone-700">{value}</dd>
    </div>
  );
}
