"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { PropertyCard } from "@/components/PropertyCard";
import { Loading } from "@/components/Loading";
import { IconPlus, IconHome, IconCalendar } from "@/components/Icons";
import { dueStatus } from "@/lib/format";
import { REMINDER_TYPES } from "@/lib/enums";

function plural(n: number) {
  if (n === 1) return "nemovitost";
  if (n >= 2 && n <= 4) return "nemovitosti";
  return "nemovitostí";
}

export default function DashboardPage() {
  const { properties, hydrated } = useStore();
  if (!hydrated) return <Loading />;

  const upcoming = properties
    .flatMap((p) => p.reminders.filter((r) => !r.done).map((r) => ({ r, p })))
    .sort((a, b) => a.r.dueDate.localeCompare(b.r.dueDate))
    .slice(0, 6);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-stone-900">Moje nemovitosti</h1>
          <p className="mt-1 text-sm text-stone-500">
            {properties.length > 0
              ? `Spravujete ${properties.length} ${plural(properties.length)}.`
              : "Zatím nemáte žádnou nemovitost."}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/nemovitost/nova" className="btn-secondary">
            Rychlé přidání
          </Link>
          <Link href="/nemovitost/zalozit" className="btn-primary">
            <IconPlus className="h-4 w-4" />
            Založit pas
          </Link>
        </div>
      </div>

      {upcoming.length > 0 && (
        <section className="card mt-6 p-5">
          <div className="flex items-center gap-2">
            <IconCalendar className="h-4 w-4 text-teal-700" />
            <h2 className="text-sm font-semibold text-stone-900">Nadcházející připomínky</h2>
          </div>
          <ul className="mt-2 divide-y divide-stone-100">
            {upcoming.map(({ r, p }) => {
              const st = dueStatus(r.dueDate);
              return (
                <li key={r.id}>
                  <Link
                    href={`/nemovitost/${p.id}`}
                    className="-mx-1 flex items-center justify-between gap-3 rounded px-1 py-2.5 hover:bg-stone-50"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-stone-800">{r.title}</p>
                      <p className="truncate text-xs text-stone-400">
                        {REMINDER_TYPES[r.type]} · {p.name}
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

      {properties.length === 0 ? (
        <div className="card mt-8 flex flex-col items-center px-6 py-16 text-center">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-teal-50 text-teal-700">
            <IconHome className="h-8 w-8" />
          </div>
          <h2 className="mt-5 text-lg font-semibold text-stone-900">Založte první nemovitost</h2>
          <p className="mt-2 max-w-sm text-sm text-stone-500">
            Vytvořte záznam pro svůj dům nebo byt a začněte budovat jeho trvalou historii — opravy,
            revize, dokumenty i fotky na jednom místě.
          </p>
          <Link href="/nemovitost/zalozit" className="btn-primary mt-6">
            <IconPlus className="h-4 w-4" />
            Založit pas
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      )}
    </div>
  );
}
