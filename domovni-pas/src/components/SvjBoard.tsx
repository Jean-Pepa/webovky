"use client";

import Link from "next/link";
import type { Property, Announcement, Contact } from "@/lib/store";
import { formatDate } from "@/lib/format";
import { ANN_CAT } from "@/lib/svj";
import { IconMegaphone, IconCalendar, IconPhone } from "@/components/Icons";

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export function SvjBoard({ property }: { property: Property }) {
  const id = property.id;
  const anns = property.announcements ?? [];
  const pinned = anns.filter((a) => a.pinned).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const latest = anns
    .filter((a) => !a.pinned)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 3);

  const now = new Date();
  const ym = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const events = [...(property.events ?? [])].sort((a, b) => a.date.localeCompare(b.date));
  const monthEvents = events.filter((e) => e.date.startsWith(ym));
  const shownEvents = (monthEvents.length ? monthEvents : events.filter((e) => e.date >= now.toISOString().slice(0, 10))).slice(0, 6);

  const board = (property.contacts ?? []).filter((c) => c.kind === "VYBOR" || c.kind === "SPRAVCE");

  return (
    <div className="mt-6 space-y-6">
      {/* Připnuté zprávy */}
      <BoardSection icon={<IconMegaphone className="h-4 w-4 text-teal-700" />} title="Připnuté zprávy" href={`/nemovitost/${id}/zpravy`}>
        {pinned.length === 0 ? (
          <p className="text-sm text-stone-500">Žádné připnuté zprávy.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-3">
            {pinned.slice(0, 3).map((a) => (
              <MessageCard key={a.id} a={a} href={`/nemovitost/${id}/zpravy`} />
            ))}
          </div>
        )}
      </BoardSection>

      {/* Poslední zprávy */}
      <BoardSection icon={<IconMegaphone className="h-4 w-4 text-stone-400" />} title="Poslední zprávy" href={`/nemovitost/${id}/zpravy`}>
        {latest.length === 0 ? (
          <p className="text-sm text-stone-500">Žádné další zprávy.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-3">
            {latest.map((a) => (
              <MessageCard key={a.id} a={a} href={`/nemovitost/${id}/zpravy`} />
            ))}
          </div>
        )}
      </BoardSection>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Události na aktuální měsíc */}
        <BoardSection icon={<IconCalendar className="h-4 w-4 text-teal-700" />} title="Události na aktuální měsíc" href={`/nemovitost/${id}/udalosti`} hrefLabel="Zobrazit celý kalendář">
          {shownEvents.length === 0 ? (
            <p className="text-sm text-stone-500">Žádné nadcházející události.</p>
          ) : (
            <ul className="space-y-2.5">
              {shownEvents.map((e) => (
                <li key={e.id} className="flex items-start gap-3 border-l-2 border-teal-300 pl-3">
                  <div>
                    <p className="text-xs text-stone-400">
                      {formatDate(e.date)}
                      {e.time ? ` · ${e.time}` : ""}
                    </p>
                    <p className="text-sm font-medium text-stone-800">{e.title}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </BoardSection>

        {/* Důležité kontakty / Statutární orgán */}
        <BoardSection icon={<IconPhone className="h-4 w-4 text-teal-700" />} title="Důležité kontakty" href={`/nemovitost/${id}/kontakty`}>
          {board.length === 0 ? (
            <p className="text-sm text-stone-500">Žádné kontakty.</p>
          ) : (
            <ul className="space-y-2.5">
              {board.slice(0, 6).map((c) => (
                <ContactRow key={c.id} c={c} />
              ))}
            </ul>
          )}
        </BoardSection>
      </div>
    </div>
  );
}

function BoardSection({
  icon,
  title,
  href,
  hrefLabel = "Zobrazit zprávy",
  children,
}: {
  icon: React.ReactNode;
  title: string;
  href: string;
  hrefLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="card p-5">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="text-sm font-semibold text-stone-900">{title}</h2>
        </div>
        <Link href={href} className="text-xs font-medium text-teal-700 hover:underline">
          {hrefLabel}
        </Link>
      </div>
      {children}
    </section>
  );
}

function MessageCard({ a, href }: { a: Announcement; href: string }) {
  const cat = ANN_CAT[a.category ?? "GENERAL"];
  return (
    <Link href={href} className="flex flex-col rounded-xl border border-stone-200 p-3 transition hover:border-teal-300">
      <p className="text-sm font-semibold text-stone-900">
        {a.pinned && <span className="mr-1 text-amber-600">📌</span>}
        {a.title}
      </p>
      <div className="mt-1 flex items-center gap-2">
        <span className={`rounded px-1.5 py-0.5 text-[11px] font-medium ${cat.badge}`}>{cat.label}</span>
        <span className="text-xs text-stone-400">{formatDate(a.createdAt)}</span>
      </div>
      <p className="mt-2 line-clamp-3 text-sm text-stone-600">{a.text}</p>
    </Link>
  );
}

function ContactRow({ c }: { c: Contact }) {
  return (
    <li className="flex items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-2.5">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-teal-700 text-xs font-semibold text-white">
          {initials(c.name)}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-stone-800">{c.name}</p>
          {c.position && <p className="truncate text-xs text-stone-400">{c.position}</p>}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-3 text-stone-400">
        {c.phone && (
          <a href={`tel:${c.phone.replace(/\s/g, "")}`} className="hover:text-teal-700" title={c.phone}>
            <IconPhone className="h-4 w-4" />
          </a>
        )}
        {c.email && (
          <a href={`mailto:${c.email}`} className="text-xs hover:text-teal-700" title={c.email}>
            @
          </a>
        )}
      </div>
    </li>
  );
}
