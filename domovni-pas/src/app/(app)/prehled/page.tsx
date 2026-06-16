"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { PropertyCard } from "@/components/PropertyCard";
import { Loading } from "@/components/Loading";
import { IconPlus, IconHome, IconCalendar, IconBuilding } from "@/components/Icons";
import { dueStatus } from "@/lib/format";
import { REMINDER_TYPES } from "@/lib/enums";
import { canSeeProperty } from "@/lib/access";

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

  const heading = isArchitect ? "Moje projekty" : isCreator ? "Přehled — správce" : "Moje nemovitosti";
  const sub =
    visible.length > 0
      ? isArchitect
        ? `Máte ${visible.length} ${pluralProjekt(visible.length)}.`
        : `${isCreator ? "V systému je" : "Spravujete"} ${visible.length} ${plural(visible.length)}.`
      : isArchitect
        ? "Zatím nemáte žádný projekt."
        : "Zatím tu nic není.";

  // Připomínky řeší majitel/správce, ne architekt
  const upcoming = isArchitect
    ? []
    : visible
        .flatMap((p) => p.reminders.filter((rem) => !rem.done).map((rem) => ({ r: rem, p })))
        .sort((a, b) => a.r.dueDate.localeCompare(b.r.dueDate))
        .slice(0, 6);

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
              Předat projekt
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

      {/* Nadcházející připomínky (majitel / správce) */}
      {upcoming.length > 0 && (
        <section className="card mt-6 p-5">
          <div className="flex items-center gap-2">
            <IconCalendar className="h-4 w-4 text-teal-700" />
            <h2 className="text-sm font-semibold text-stone-900">Nadcházející připomínky</h2>
          </div>
          <ul className="mt-2 divide-y divide-stone-100">
            {upcoming.map(({ r: rem, p }) => {
              const st = dueStatus(rem.dueDate);
              return (
                <li key={rem.id}>
                  <Link
                    href={`/nemovitost/${p.id}`}
                    className="-mx-1 flex items-center justify-between gap-3 rounded px-1 py-2.5 hover:bg-stone-50"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-stone-800">{rem.title}</p>
                      <p className="truncate text-xs text-stone-400">
                        {REMINDER_TYPES[rem.type]} · {p.name}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 text-xs font-medium ${
                        st.overdue ? "text-red-600" : st.soon ? "text-amber-600" : "text-stone-500"
                      }`}
                    >
                      {st.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
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
            {isArchitect ? "Předat projekt" : "Založit pas"}
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((p) => (
            <PropertyCard key={p.id} property={p} showStatus={isArchitect || isCreator} />
          ))}
        </div>
      )}
    </div>
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
