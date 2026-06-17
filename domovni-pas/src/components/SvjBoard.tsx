"use client";

import Link from "next/link";
import type { Property } from "@/lib/store";
import { formatDate } from "@/lib/format";
import { IconMegaphone, IconPhone, IconKey, IconUsers, IconVote } from "@/components/Icons";

export function SvjBoard({ property }: { property: Property }) {
  const id = property.id;
  const anns = [...(property.announcements ?? [])]
    .sort((a, b) => {
      if (!!b.pinned !== !!a.pinned) return b.pinned ? 1 : -1;
      return b.createdAt.localeCompare(a.createdAt);
    })
    .slice(0, 3);
  const people = (property.contacts ?? []).filter((c) => c.kind === "VYBOR" || c.kind === "SPRAVCE");
  const units = property.units ?? [];
  const openReports = (property.consultations ?? []).filter(
    (c) => (c.status ?? "OPEN") !== "RESOLVED",
  ).length;
  const openPolls = (property.polls ?? []).filter((p) => p.status === "OPEN").length;

  return (
    <div className="mt-6 grid gap-4 lg:grid-cols-3">
      {/* Nástěnka */}
      <section className="card p-5 lg:col-span-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <IconMegaphone className="h-4 w-4 text-teal-700" />
            <h2 className="text-sm font-semibold text-stone-900">Nástěnka</h2>
          </div>
          <Link href={`/nemovitost/${id}/nastenka`} className="text-xs font-medium text-teal-700 hover:underline">
            Vše →
          </Link>
        </div>
        {anns.length === 0 ? (
          <p className="mt-2 text-sm text-stone-500">Zatím žádná oznámení.</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {anns.map((a) => (
              <li
                key={a.id}
                className={`rounded-xl border p-3 ${
                  a.pinned ? "border-amber-200 bg-amber-50/50" : "border-stone-200"
                }`}
              >
                <p className="text-sm font-semibold text-stone-900">
                  {a.pinned && <span className="mr-1.5 text-amber-600">📌</span>}
                  {a.title}
                </p>
                <p className="mt-0.5 line-clamp-2 text-sm text-stone-600">{a.text}</p>
                <p className="mt-1 text-xs text-stone-400">{formatDate(a.createdAt)}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Rychlé kontakty + ukazatele */}
      <div className="space-y-4">
        <section className="card p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <IconPhone className="h-4 w-4 text-teal-700" />
              <h2 className="text-sm font-semibold text-stone-900">Rychlé kontakty</h2>
            </div>
            <Link href={`/nemovitost/${id}/kontakty`} className="text-xs font-medium text-teal-700 hover:underline">
              Vše →
            </Link>
          </div>
          {people.length === 0 ? (
            <p className="mt-2 text-sm text-stone-500">Zatím žádné kontakty.</p>
          ) : (
            <ul className="mt-2 space-y-2">
              {people.slice(0, 4).map((c) => (
                <li key={c.id} className="flex items-center justify-between gap-2 text-sm">
                  <span className="min-w-0">
                    <span className="block truncate font-medium text-stone-800">{c.name}</span>
                    {c.position && <span className="block truncate text-xs text-stone-400">{c.position}</span>}
                  </span>
                  {c.phone && (
                    <a href={`tel:${c.phone.replace(/\s/g, "")}`} className="shrink-0 font-medium text-teal-700 hover:underline">
                      {c.phone}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="grid grid-cols-3 gap-3">
          <BoardChip href={`/nemovitost/${id}/vlastnici`} icon={<IconKey className="h-4 w-4" />} value={String(units.length)} label="Jednotek" />
          <BoardChip href={`/nemovitost/${id}/konzultace`} icon={<IconUsers className="h-4 w-4" />} value={String(openReports)} label="Hlášení" highlight={openReports > 0} />
          <BoardChip href={`/nemovitost/${id}/hlasovani`} icon={<IconVote className="h-4 w-4" />} value={String(openPolls)} label="Hlasování" highlight={openPolls > 0} />
        </div>
      </div>
    </div>
  );
}

function BoardChip({
  href,
  icon,
  value,
  label,
  highlight,
}: {
  href: string;
  icon: React.ReactNode;
  value: string;
  label: string;
  highlight?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`card flex flex-col items-center gap-0.5 p-3 text-center transition hover:border-teal-300 ${
        highlight ? "ring-1 ring-amber-300" : ""
      }`}
    >
      <span className={highlight ? "text-amber-600" : "text-stone-400"}>{icon}</span>
      <span className="text-lg font-semibold text-stone-900">{value}</span>
      <span className="text-[11px] text-stone-500">{label}</span>
    </Link>
  );
}
