"use client";

import Link from "next/link";
import { useStore, type Property } from "@/lib/store";
import { PropertyCard } from "@/components/PropertyCard";
import { Loading } from "@/components/Loading";
import { IconPlus, IconHome, IconBuilding, IconAlert, IconCalendar, IconShield } from "@/components/Icons";
import { canSeeProperty } from "@/lib/access";
import { getAttentionItems, ATTENTION_KIND_LABELS, type AttentionKind } from "@/lib/attention";

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
  const { properties, hydrated, role } = useStore();
  if (!hydrated) return <Loading />;

  const r = role ?? "CLIENT";
  const isArchitect = r === "ARCHITECT";
  const isCreator = r === "CREATOR";
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

      {/* Pipeline pro architekta */}
      {isArchitect && visible.length > 0 && (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:max-w-sm">
          <StatBox label="Čeká na převzetí" value={String(waiting.length)} />
          <StatBox label="Předáno klientovi" value={String(handed.length)} />
        </div>
      )}

      {/* Vyžaduje pozornost (majitel / správce) */}
      {attention.length > 0 && (
        <section className="card mt-6 p-5">
          <div className="flex items-center gap-2">
            <IconAlert className="h-4 w-4 text-brass" />
            <h2 className="text-sm font-semibold text-stone-900">Vyžaduje pozornost</h2>
            <span className="text-xs text-stone-400">· {attention.length}</span>
          </div>
          <ul className="mt-2 divide-y divide-stone-100">
            {attention.slice(0, 6).map((a) => (
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
          {attention.length > 6 && (
            <Link href="/kalendar" className="mt-3 inline-block text-sm font-medium text-brass hover:underline">
              Zobrazit vše →
            </Link>
          )}
        </section>
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

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="card p-4">
      <p className="text-2xl font-semibold text-stone-900">{value}</p>
      <p className="mt-0.5 text-xs text-stone-500">{label}</p>
    </div>
  );
}
