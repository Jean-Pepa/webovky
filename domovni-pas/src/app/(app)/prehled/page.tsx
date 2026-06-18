"use client";

import Link from "next/link";
import { useState } from "react";
import { useStore, type Property, type ConsultationStatus, type ConsultationNote } from "@/lib/store";
import { PropertyCard } from "@/components/PropertyCard";
import { Loading } from "@/components/Loading";
import {
  IconPlus,
  IconHome,
  IconBuilding,
  IconAlert,
  IconCalendar,
  IconShield,
  IconUsers,
  IconChevronDown,
} from "@/components/Icons";
import { canSeeProperty, ROLE_LABELS } from "@/lib/access";
import { getAttentionItems, ATTENTION_KIND_LABELS, type AttentionKind, type AttentionItem } from "@/lib/attention";

type ConsItem = { c: ConsultationNote; p: Property };

function consLastActivity(c: ConsultationNote): string {
  const times = [c.createdAt, ...(c.replies ?? []).map((r) => r.createdAt)];
  return times.sort().at(-1) ?? c.createdAt;
}
function consLatest(c: ConsultationNote): { authorRole: ConsultationNote["authorRole"]; text: string } {
  const reps = c.replies ?? [];
  if (reps.length) return reps[reps.length - 1];
  return { authorRole: c.authorRole, text: c.text };
}

const CONS_TEXT: Record<string, string> = {
  OPEN: "text-amber-600",
  WAITING: "text-stone-500",
  RESOLVED: "text-emerald-600",
};

function fmtMsg(iso: string) {
  return new Intl.DateTimeFormat("cs-CZ", {
    day: "numeric",
    month: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

function plural(n: number) {
  if (n === 1) return "nemovitost";
  if (n >= 2 && n <= 4) return "nemovitosti";
  return "nemovitostí";
}
function pluralProjekt(n: number) {
  if (n === 1) return "projekt";
  if (n >= 2 && n <= 4) return "projekty";
  return "projektů";
}

export default function DashboardPage() {
  const { properties, hydrated, role, setConsultationStatus } = useStore();
  if (!hydrated) return <Loading />;

  const r = role ?? "CLIENT";
  const isArchitect = r === "ARCHITECT";
  const isCreator = r === "CREATOR";
  const isClient = r === "CLIENT";
  const visible = role ? properties.filter((p) => canSeeProperty(p, role)) : [];
  const waiting = visible.filter((p) => !p.handedOver);
  const handed = visible.filter((p) => p.handedOver);

  const heading = isArchitect ? "Moje projekty" : isCreator ? "Přehled — správce" : "Moje nemovitosti";
  const sub =
    visible.length > 0
      ? isArchitect
        ? `Máte ${visible.length} ${pluralProjekt(visible.length)}.`
        : `${isCreator ? "V systému je" : "Spravujete"} ${visible.length} ${plural(visible.length)}.`
      : isArchitect
        ? "Zatím nemáte žádný projekt."
        : "Zatím tu nic není.";

  // Co „hoří" — záruky a revize se hlídají automaticky (architekt neřeší)
  const attention = isArchitect ? [] : getAttentionItems(visible);

  // Komunikace = konzultace (sjednoceno), seřazené podle poslední aktivity
  const recentConsultations: ConsItem[] = !isArchitect
    ? visible
        .flatMap((p) => (p.consultations ?? []).map((c) => ({ c, p })))
        .sort((a, b) => consLastActivity(b.c).localeCompare(consLastActivity(a.c)))
    : [];

  // Otevřené dotazy / konzultace napříč projekty (architekt / správce)
  const consultations =
    isArchitect || isCreator
      ? visible
          .flatMap((p) => (p.consultations ?? []).map((c) => ({ c, p })))
          .filter(({ c }) => (c.status ?? "OPEN") !== "RESOLVED")
          .sort((a, b) => {
            const rank = (s?: string) => (s === "WAITING" ? 1 : 0);
            return rank(a.c.status) - rank(b.c.status) || b.c.createdAt.localeCompare(a.c.createdAt);
          })
      : [];

  const stats = isCreator
    ? {
        total: visible.length,
        handed: visible.filter((p) => p.handedOver).length,
        byArchitect: visible.filter((p) => p.createdByRole === "ARCHITECT").length,
        byClient: visible.filter((p) => (p.createdByRole ?? "CLIENT") === "CLIENT").length,
      }
    : null;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-stone-900">{heading}</h1>
          <p className="mt-1 text-sm text-stone-500">{sub}</p>
        </div>
        <div className="flex gap-2">
          {(r === "CLIENT" || isCreator) && (
            <Link href="/nemovitost/zalozit" className="btn-primary">
              <IconPlus className="h-4 w-4" />
              Založit pas
            </Link>
          )}
          {(isArchitect || isCreator) && (
            <Link
              href="/projekt/novy"
              className={isArchitect ? "btn-primary" : "btn-secondary"}
            >
              <IconBuilding className="h-4 w-4" />
              Přidat projekt
            </Link>
          )}
        </div>
      </div>

      {/* Statistiky pro správce */}
      {stats && (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatBox label="Nemovitostí celkem" value={String(stats.total)} />
          <StatBox label="Předáno klientovi" value={String(stats.handed)} />
          <StatBox label="Od architektů" value={String(stats.byArchitect)} />
          <StatBox label="Od majitelů" value={String(stats.byClient)} />
        </div>
      )}

      {/* Dotazy a konzultace (architekt / správce) */}
      {consultations.length > 0 && (
        <section className="card mt-6 p-5">
          <div className="flex items-center gap-2">
            <IconUsers className="h-4 w-4 text-brass" />
            <h2 className="text-sm font-semibold text-stone-900">Dotazy a konzultace</h2>
            <span className="text-xs text-stone-400">· {consultations.length}</span>
          </div>
          <ul className="mt-2 divide-y divide-stone-100">
            {consultations.slice(0, 6).map(({ c, p }) => (
              <li key={c.id} className="flex items-center justify-between gap-3 py-2.5">
                <Link href={`/nemovitost/${p.id}/konzultace`} className="min-w-0 flex-1 rounded">
                  <p className="truncate text-sm font-medium text-stone-800 hover:text-teal-800">
                    {c.topic ? `${c.topic}: ` : ""}
                    {c.text}
                  </p>
                  <p className="truncate text-xs text-stone-400">
                    {ROLE_LABELS[c.authorRole]} · {p.name}
                  </p>
                </Link>
                <div className="flex shrink-0 items-center gap-2">
                  <select
                    value={c.status ?? "OPEN"}
                    onChange={(e) =>
                      setConsultationStatus(p.id, c.id, e.target.value as ConsultationStatus)
                    }
                    className={`rounded-md border border-stone-200 bg-white px-2 py-1 text-xs font-medium ${
                      CONS_TEXT[c.status ?? "OPEN"]
                    }`}
                    aria-label="Stav dotazu"
                  >
                    <option value="OPEN">Otevřeno</option>
                    <option value="WAITING">Čeká na klienta</option>
                    <option value="RESOLVED">Vyřešeno</option>
                  </select>
                  <Link
                    href={`/nemovitost/${p.id}/konzultace`}
                    className="btn-secondary btn-sm whitespace-nowrap"
                  >
                    Odpovědět
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Klient: pozornost + komunikace (rozbalovací, svítí když je důležité) */}
      {isClient && (
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <AttentionCard items={attention} limit={6} />
          <KomunikaceCard items={recentConsultations} />
        </div>
      )}

      {/* Správce: pozornost přes celou šířku */}
      {isCreator && attention.length > 0 && (
        <AttentionCard items={attention} limit={6} className="mt-6" />
      )}

      {visible.length === 0 ? (
        <div className="card mt-8 flex flex-col items-center px-6 py-16 text-center">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-teal-50 text-teal-700">
            {isArchitect ? <IconBuilding className="h-8 w-8" /> : <IconHome className="h-8 w-8" />}
          </div>
          <h2 className="mt-5 text-lg font-semibold text-stone-900">
            {isArchitect ? "Zatím žádný projekt" : "Založte první nemovitost"}
          </h2>
          <p className="mt-2 max-w-sm text-sm text-stone-500">
            {isArchitect
              ? "Předejte první projekt klientovi — dokumentace, fotky a materiály na jednom místě."
              : "Vytvořte záznam pro svůj dům nebo byt a začněte budovat jeho trvalou historii."}
          </p>
          <Link
            href={isArchitect ? "/projekt/novy" : "/nemovitost/zalozit"}
            className="btn-primary mt-6"
          >
            {isArchitect ? <IconBuilding className="h-4 w-4" /> : <IconPlus className="h-4 w-4" />}
            {isArchitect ? "Přidat projekt" : "Založit pas"}
          </Link>
        </div>
      ) : isArchitect ? (
        <div className="mt-8 space-y-8">
          <PropertySection title="Čeká na převzetí klientem" items={waiting} />
          <PropertySection title="Předáno klientovi" items={handed} />
        </div>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((p) => (
            <PropertyCard key={p.id} property={p} showStatus={isCreator} />
          ))}
        </div>
      )}
    </div>
  );
}

function PropertySection({ title, items }: { title: string; items: Property[] }) {
  if (items.length === 0) return null;
  return (
    <section>
      <h2 className="text-sm font-semibold text-stone-500">
        {title} <span className="text-stone-400">· {items.length}</span>
      </h2>
      <div className="mt-3 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => (
          <PropertyCard key={p.id} property={p} showStatus />
        ))}
      </div>
    </section>
  );
}

function KindIcon({ kind, overdue }: { kind: AttentionKind; overdue: boolean }) {
  const Icon = kind === "warranty" ? IconShield : kind === "defect" ? IconAlert : IconCalendar;
  const color = overdue ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600";
  return (
    <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${color}`}>
      <Icon className="h-4 w-4" />
    </span>
  );
}

// Svítící „tep" — upozorňuje, že karta obsahuje něco důležitého
function GlowDot({ color = "amber" }: { color?: "amber" | "teal" | "red" }) {
  const solid = color === "teal" ? "bg-teal-500" : color === "red" ? "bg-red-500" : "bg-amber-500";
  const ping = color === "teal" ? "bg-teal-400" : color === "red" ? "bg-red-400" : "bg-amber-400";
  return (
    <span className="relative ml-1 flex h-2 w-2">
      <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${ping} opacity-75`} />
      <span className={`relative inline-flex h-2 w-2 rounded-full ${solid}`} />
    </span>
  );
}

function AttentionCard({
  items,
  limit = 6,
  className = "",
}: {
  items: AttentionItem[];
  limit?: number;
  className?: string;
}) {
  const important = items.some((a) => a.severity === "overdue");
  const [open, setOpen] = useState(false);

  return (
    <section
      className={`card p-5 transition ${
        important ? "shadow-md shadow-amber-100 ring-2 ring-amber-300/70" : ""
      } ${className}`}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2 text-left"
      >
        <IconAlert className={`h-4 w-4 ${important ? "text-amber-500" : "text-brass"}`} />
        <h2 className="text-sm font-semibold text-stone-900">Vyžaduje pozornost</h2>
        {items.length > 0 && <span className="text-xs text-stone-400">· {items.length}</span>}
        {important && <GlowDot color="amber" />}
        <IconChevronDown
          className={`ml-auto h-4 w-4 shrink-0 text-stone-400 transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open &&
        (items.length === 0 ? (
          <p className="mt-3 text-sm text-stone-500">Vše v pořádku — nic nehoří. 🎉</p>
        ) : (
          <>
            <ul className="mt-2 divide-y divide-stone-100">
              {items.slice(0, limit).map((a) => (
                <li key={a.id}>
                  <Link
                    href={`/nemovitost/${a.property.id}`}
                    className="-mx-1 flex items-center justify-between gap-3 rounded px-1 py-2.5 hover:bg-stone-50"
                  >
                    <div className="flex min-w-0 items-center gap-2.5">
                      <KindIcon kind={a.kind} overdue={a.severity === "overdue"} />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-stone-800">{a.title}</p>
                        <p className="truncate text-xs text-stone-400">
                          {ATTENTION_KIND_LABELS[a.kind]} · {a.property.name}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`shrink-0 text-xs font-medium ${
                        a.severity === "overdue" ? "text-red-600" : "text-amber-600"
                      }`}
                    >
                      {a.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            {items.length > limit && (
              <Link
                href="/kalendar"
                className="mt-3 inline-block text-sm font-medium text-brass hover:underline"
              >
                Zobrazit vše →
              </Link>
            )}
          </>
        ))}
    </section>
  );
}

const CONS_STATUS_LABEL: Record<string, string> = {
  OPEN: "Čeká na architekta",
  WAITING: "Čeká na klienta",
  RESOLVED: "Vyřešeno",
};

function KomunikaceCard({ items }: { items: ConsItem[] }) {
  const important = items.some(({ c }) => (c.status ?? "OPEN") !== "RESOLVED");
  const [open, setOpen] = useState(false);

  return (
    <section
      className={`card p-5 transition ${
        important ? "shadow-md shadow-teal-100 ring-2 ring-teal-300/70" : ""
      }`}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2 text-left"
      >
        <IconUsers className={`h-4 w-4 ${important ? "text-teal-600" : "text-teal-700"}`} />
        <h2 className="text-sm font-semibold text-stone-900">Komunikace</h2>
        {items.length > 0 && <span className="text-xs text-stone-400">· {items.length}</span>}
        {important && <GlowDot color="teal" />}
        <IconChevronDown
          className={`ml-auto h-4 w-4 shrink-0 text-stone-400 transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open &&
        (items.length === 0 ? (
          <p className="mt-3 text-sm text-stone-500">
            Zatím žádné konzultace. Napsat můžete u konkrétní nemovitosti.
          </p>
        ) : (
          <ul className="mt-2 divide-y divide-stone-100">
            {items.slice(0, 6).map(({ c, p }) => {
              const status = c.status ?? "OPEN";
              const latest = consLatest(c);
              return (
                <li key={c.id}>
                  <Link
                    href={`/nemovitost/${p.id}/konzultace`}
                    className="-mx-1 block rounded px-1 py-2.5 hover:bg-stone-50"
                  >
                    <p className="truncate text-sm text-stone-800">
                      <span className="font-medium">{ROLE_LABELS[latest.authorRole]}:</span>{" "}
                      {latest.text}
                    </p>
                    <p className="truncate text-xs text-stone-400">
                      {c.topic ? `${c.topic} · ` : ""}
                      {p.name} · {fmtMsg(consLastActivity(c))} ·{" "}
                      <span className={CONS_TEXT[status]}>{CONS_STATUS_LABEL[status]}</span>
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
        ))}
    </section>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="card p-4">
      <p className="text-2xl font-semibold text-stone-900">{value}</p>
      <p className="mt-0.5 text-xs text-stone-500">{label}</p>
    </div>
  );
}
