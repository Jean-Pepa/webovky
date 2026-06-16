"use client";

import Link from "next/link";
import { useStore, type Property, type Reminder } from "@/lib/store";
import { Loading } from "@/components/Loading";
import { REMINDER_TYPES } from "@/lib/enums";
import { dueStatus } from "@/lib/format";
import { canSeeProperty } from "@/lib/access";
import { IconCalendar, IconCheck, IconTrash } from "@/components/Icons";

type Item = { r: Reminder; p: Property };

export default function RemindersPage() {
  const { properties, hydrated, role, toggleReminder, deleteReminder } = useStore();
  if (!hydrated) return <Loading />;

  const visible = role ? properties.filter((p) => canSeeProperty(p, role)) : [];
  const all: Item[] = visible.flatMap((p) => p.reminders.map((r) => ({ r, p })));
  const active = all.filter((i) => !i.r.done).sort((a, b) => a.r.dueDate.localeCompare(b.r.dueDate));
  const overdue = active.filter((i) => dueStatus(i.r.dueDate).overdue);
  const upcoming = active.filter((i) => !dueStatus(i.r.dueDate).overdue);
  const done = all.filter((i) => i.r.done);

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-stone-900">Připomínky</h1>
      <p className="mt-1 text-sm text-stone-500">
        Revize, údržba a záruky napříč všemi vašimi nemovitostmi.
      </p>

      {all.length === 0 ? (
        <div className="card mt-8 flex flex-col items-center px-6 py-16 text-center">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-teal-50 text-teal-700">
            <IconCalendar className="h-7 w-7" />
          </div>
          <p className="mt-4 text-sm font-medium text-stone-800">Žádné připomínky</p>
          <p className="mt-1 max-w-sm text-sm text-stone-500">
            Připomínky přidáte u konkrétní nemovitosti — třeba termín příští revize kotle nebo konec
            záruky.
          </p>
          <Link href="/prehled" className="btn-secondary mt-6">
            Na přehled nemovitostí
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-8">
          <Group title="Po termínu" items={overdue} toggle={toggleReminder} remove={deleteReminder} />
          <Group title="Nadcházející" items={upcoming} toggle={toggleReminder} remove={deleteReminder} />
          <Group title="Splněné" items={done} toggle={toggleReminder} remove={deleteReminder} />
        </div>
      )}
    </div>
  );
}

function Group({
  title,
  items,
  toggle,
  remove,
}: {
  title: string;
  items: Item[];
  toggle: (propertyId: string, reminderId: string) => void;
  remove: (propertyId: string, reminderId: string) => void;
}) {
  if (items.length === 0) return null;
  return (
    <section>
      <h2 className="text-sm font-semibold text-stone-500">
        {title} <span className="text-stone-400">· {items.length}</span>
      </h2>
      <ul className="card mt-2 divide-y divide-stone-100 px-5">
        {items.map(({ r, p }) => {
          const st = dueStatus(r.dueDate);
          return (
            <li key={r.id} className="flex items-start gap-3 py-3">
              <button
                onClick={() => toggle(p.id, r.id)}
                className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border transition ${
                  r.done
                    ? "border-teal-600 bg-teal-600 text-white"
                    : "border-stone-300 text-transparent hover:border-teal-500"
                }`}
                aria-label="Označit jako splněné"
              >
                <IconCheck className="h-3.5 w-3.5" />
              </button>
              <div className="min-w-0 flex-1">
                <p
                  className={`text-sm font-medium ${
                    r.done ? "text-stone-400 line-through" : "text-stone-800"
                  }`}
                >
                  {r.title}
                </p>
                <p className="truncate text-xs text-stone-400">
                  {REMINDER_TYPES[r.type]} ·{" "}
                  <Link href={`/nemovitost/${p.id}`} className="hover:text-teal-700 hover:underline">
                    {p.name}
                  </Link>
                </p>
              </div>
              {!r.done && (
                <span
                  className={`shrink-0 text-xs font-medium ${
                    st.overdue ? "text-red-600" : st.soon ? "text-amber-600" : "text-stone-500"
                  }`}
                >
                  {st.label}
                </span>
              )}
              <button
                onClick={() => {
                  if (confirm("Smazat připomínku?")) remove(p.id, r.id);
                }}
                className="btn-ghost btn-sm text-stone-400 hover:text-red-600"
                aria-label="Smazat"
              >
                <IconTrash className="h-4 w-4" />
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
