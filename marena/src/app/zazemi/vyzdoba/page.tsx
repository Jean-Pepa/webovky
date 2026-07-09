"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { canEditSection } from "@/lib/access";
import { isAdmin } from "@/lib/admin";
import { sameName } from "@/lib/names";
import { uid } from "@/lib/id";
import { ReadOnlyBanner } from "@/components/ReadOnlyBanner";
import { DeleteButton } from "@/components/DeleteButton";
import { Modal } from "@/components/Modal";
import { WhoSelect } from "@/components/WhoSelect";
import { ImageBoard } from "@/components/ImageBoard";
import { Collapsible } from "@/components/Collapsible";
import { SearchBox } from "@/components/SearchBox";
import { matchesQuery } from "@/lib/search";
import { flash } from "@/components/Flash";
import { DeadlineField } from "@/components/PollCard";
import { isPollClosed } from "@/lib/poll";
import type { Decor, DecorStatus, DecorZone, Year } from "@/lib/types";

const STATUS: Record<DecorStatus, { label: string; cls: string; order: number }> = {
  napad: { label: "💡 nápad", cls: "bg-paper2 text-ink-soft", order: 0 },
  shani: { label: "🛒 shání se", cls: "bg-gold-600/12 text-gold-700", order: 1 },
  hotovo: { label: "✅ hotovo", cls: "bg-leaf/15 text-leaf-700", order: 2 },
};
const NEXT: Record<DecorStatus, DecorStatus> = { napad: "shani", shani: "hotovo", hotovo: "napad" };

// Vedoucí výzdoby = výslovně určený vedoucí role „vyzdoba" (roleLeads), jinak
// nejdřív zapsaný držitel role. Ten zóny zakládá a velí jim (+ správce/hlavní).
function vyzdobaLeadId(year: Year): string | undefined {
  const holders = year.members.filter((m) => m.roleIds.includes("vyzdoba"));
  if (!holders.length) return undefined;
  const explicit = year.roleLeads?.vyzdoba;
  if (explicit && holders.some((h) => h.id === explicit)) return explicit;
  return [...holders].sort((a, b) => a.createdAt.localeCompare(b.createdAt))[0].id;
}

export default function VyzdobaPage() {
  const { currentYear, me, dispatch, canEditCurrentYear } = useStore();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [title, setTitle] = useState("");
  const [who, setWho] = useState("");
  const [link, setLink] = useState("");
  const [note, setNote] = useState("");
  const [zone, setZone] = useState(""); // zóna zvolená rovnou při přidávání nápadu
  const [addNewZone, setAddNewZone] = useState(false); // inline „nová zóna" v okně přidání
  const [addNewZoneName, setAddNewZoneName] = useState("");

  const year = currentYear;
  const list = useMemo(
    () =>
      [...(year?.decor ?? [])]
        .filter((d) => matchesQuery(q, d.title, d.who, d.link, d.note))
        .sort((a, b) => STATUS[a.status].order - STATUS[b.status].order || a.createdAt.localeCompare(b.createdAt)),
    [year, q],
  );

  if (!year) return null;
  const myMember = year.members.find((m) => sameName(m.name, me));
  const canEdit = canEditCurrentYear && canEditSection(year, me, "vyzdoba");
  // Vedoucí: správce, hlavní organizátor, nebo určený vedoucí role Výzdoba.
  const isLead =
    canEditCurrentYear &&
    (isAdmin(me) || (myMember?.roleIds.includes("hlavni") ?? false) || (!!myMember && vyzdobaLeadId(year) === myMember.id));
  const zones = year.decorZones ?? [];
  // Zóny, kde jsem přihlášený — do nich si můžu vzít volný materiál.
  const myZones = zones.filter((z) => z.members.some((m) => sameName(m, me)));

  // Založí novou zónu a rovnou ji předvybere pro přidávaný nápad.
  function createZoneForAdd() {
    const name = addNewZoneName.trim();
    if (!name || !year) return;
    const zid = uid("dz_");
    dispatch({ type: "addDecorZone", yearId: year.id, name, id: zid });
    setZone(zid);
    setAddNewZone(false);
    setAddNewZoneName("");
    flash(`Zóna „${name}" vytvořena`, "📍");
  }

  async function add() {
    if (!title.trim() || !year || !canEdit) return;
    await dispatch({ type: "addDecor", yearId: year.id, title: title.trim(), who, link, note, zoneId: zone || undefined });
    setTitle("");
    setWho("");
    setLink("");
    setNote("");
    setZone("");
    flash(zone ? "Nápad přidán do zóny" : "Nápad přidán", "🎨");
  }

  return (
    <div className="space-y-6">
      {canEditCurrentYear && !canEdit && (
        <ReadOnlyBanner>Výzdobu máš jen k náhledu — upravovat ji může jen správce a příslušná role.</ReadOnlyBanner>
      )}
      <div>
        <h1 className="font-display text-[28px] font-bold uppercase tracking-tight">Výzdoba</h1>
      </div>

      {/* Pravidla */}
      <RulesCard year={year} canEdit={isLead} />

      {/* Plánek zón */}
      <PlanCard year={year} canEdit={isLead} />

      {/* Zóny */}
      <ZonesSection year={year} canEdit={canEdit} isLead={isLead} me={me} />

      {/* Hlasování týmu — propíše se i do obecného Hlasování */}
      <TeamVoting year={year} canEdit={canEdit} me={me} />

      {/* Materiál a nápady */}
      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-[19px] font-bold">🎨 Materiál a nápady</h2>
          {canEdit && (
            <button className="btn-primary px-3 py-1.5 text-sm" onClick={() => setOpen((v) => !v)}>
              {open ? "Zavřít" : "+ Přidat nápad"}
            </button>
          )}
        </div>

        {(year.decor?.length ?? 0) > 0 && <SearchBox value={q} onChange={setQ} placeholder="Hledat materiál…" />}

        {open && canEdit && (
          <div className="card space-y-2 p-4">
            <input
              className="input"
              placeholder="Nápad / materiál (např. Luxfery z Bazoše, LED pásky…)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && add()}
              autoFocus
            />
            <div className="grid gap-2 sm:grid-cols-2">
              <WhoSelect value={who} onChange={setWho} placeholder="Kdo shání? (nepovinné)" />
              <input className="input" placeholder="Odkaz (nepovinné)" value={link} onChange={(e) => setLink(e.target.value)} />
            </div>
            <input className="input" placeholder="Poznámka" value={note} onChange={(e) => setNote(e.target.value)} onKeyDown={(e) => e.key === "Enter" && add()} />
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-ink-soft">
                <span className="shrink-0 font-medium">📍 Zóna:</span>
                <select className="min-w-0 flex-1 rounded-lg border border-ink/15 bg-white px-2 py-1.5 text-sm" value={zone} onChange={(e) => setZone(e.target.value)}>
                  <option value="">Volné (bez zóny)</option>
                  {zones.map((z) => (
                    <option key={z.id} value={z.id}>{z.name}</option>
                  ))}
                </select>
              </label>
              {addNewZone ? (
                <div className="flex gap-2">
                  <input
                    className="input"
                    placeholder="Název nové zóny"
                    value={addNewZoneName}
                    onChange={(e) => setAddNewZoneName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && createZoneForAdd()}
                    autoFocus
                  />
                  <button className="btn-primary shrink-0 px-3 text-sm" onClick={createZoneForAdd} disabled={!addNewZoneName.trim()}>OK</button>
                  <button className="btn-ghost shrink-0 px-2 text-sm" onClick={() => { setAddNewZone(false); setAddNewZoneName(""); }}>Zrušit</button>
                </div>
              ) : (
                <button
                  className="rounded-lg border border-dashed border-gold-500/60 bg-gold-50 px-3 py-1.5 text-xs font-semibold text-gold-700 transition hover:bg-gold-100"
                  onClick={() => setAddNewZone(true)}
                >
                  ➕ Nová zóna
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <button className="btn-primary py-2 text-sm" onClick={add} disabled={!title.trim()}>
                + Přidat nápad
              </button>
              <button className="btn-ghost py-2 text-sm" onClick={() => setOpen(false)}>
                Zrušit
              </button>
            </div>
          </div>
        )}

        {(year.decor?.length ?? 0) === 0 ? (
          <div className="card grid place-items-center p-10 text-center text-sm text-ink-soft">
            Zatím žádný materiál.
          </div>
        ) : list.length === 0 && q.trim() ? (
          <p className="text-sm text-ink-soft">Nic neodpovídá hledání.</p>
        ) : (
          <ul className="space-y-2">
            {list.map((d) => (
              <DecorRow key={d.id} d={d} yearId={year.id} canEdit={canEdit} admin={isAdmin(me)} zones={zones} myZones={myZones} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

// Pravidla — textový blok „co se musí dodržet". Píše vedoucí/správce.
function RulesCard({ year, canEdit }: { year: Year; canEdit: boolean }) {
  const { dispatch } = useStore();
  const [edit, setEdit] = useState(false);
  const [text, setText] = useState(year.decorRules ?? "");
  const rules = year.decorRules;
  if (!canEdit && !rules) return null;
  return (
    <section className="card p-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-display text-[19px] font-bold">📋 Pravidla</h2>
        {canEdit && !edit && (
          <button className="btn-ghost px-2 py-1 text-xs" onClick={() => { setText(year.decorRules ?? ""); setEdit(true); }}>
            {rules ? "Upravit" : "+ Přidat"}
          </button>
        )}
      </div>
      {edit ? (
        <div className="mt-2 space-y-2">
          <textarea className="input min-h-28" value={text} onChange={(e) => setText(e.target.value)} placeholder="Co se musí při výzdobě dodržet (materiály, bezpečnost, termíny…)" autoFocus />
          <div className="flex gap-2">
            <button className="btn-primary py-2 text-sm" onClick={() => { dispatch({ type: "setDecorRules", yearId: year.id, text }); setEdit(false); flash("Pravidla uložena", "📋"); }}>
              Uložit
            </button>
            <button className="btn-ghost py-2 text-sm" onClick={() => setEdit(false)}>Zrušit</button>
          </div>
        </div>
      ) : rules ? (
        <p className="mt-2 whitespace-pre-wrap text-sm text-ink-soft">{rules}</p>
      ) : (
        <p className="mt-2 text-sm text-ink-soft/70">Zatím žádná pravidla.</p>
      )}
    </section>
  );
}

// Plánek — fotky prostoru s vyznačenými zónami.
function PlanCard({ year, canEdit }: { year: Year; canEdit: boolean }) {
  const { dispatch } = useStore();
  const ids = year.decorPlanIds ?? [];
  if (!canEdit && ids.length === 0) return null;
  return (
    <section className="card p-4">
      <h2 className="font-display text-[19px] font-bold">🗺️ Plánek zón</h2>
      <p className="mt-0.5 text-xs text-ink-soft">Fotka prostoru s rozdělením na zóny.</p>
      <div className="mt-2">
        <ImageBoard
          ids={ids}
          canEdit={canEdit}
          addLabel="Přidat plánek"
          thumb="h-32 w-32"
          onChange={(next) => dispatch({ type: "setDecorPlan", yearId: year.id, ids: next })}
        />
      </div>
    </section>
  );
}

// Sekce Zóny — vedoucí přidává zóny, každá je sbalitelná karta (ZoneCard).
function ZonesSection({ year, canEdit, isLead, me }: { year: Year; canEdit: boolean; isLead: boolean; me: string }) {
  const { dispatch } = useStore();
  const [name, setName] = useState("");
  const [desc, setDesc] = useState(""); // volitelný popis nové zóny (jako mají zóny uvnitř)
  const [descOpen, setDescOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const zones = year.decorZones ?? [];
  const involved = new Set(zones.flatMap((z) => z.members.map((m) => m.toLowerCase()))).size;
  const zoneWord = zones.length === 1 ? "zóna" : zones.length >= 2 && zones.length <= 4 ? "zóny" : "zón";
  function addZone() {
    if (!name.trim()) return;
    const zid = uid("dz_");
    dispatch({ type: "addDecorZone", yearId: year.id, name: name.trim(), id: zid });
    if (desc.trim()) dispatch({ type: "updateDecorZone", yearId: year.id, zoneId: zid, patch: { description: desc.trim() } });
    setName("");
    setDesc("");
    setDescOpen(false);
    flash("Zóna přidána", "📍");
  }
  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-display text-[19px] font-bold">📍 Zóny</h2>
        <div className="flex items-center gap-2">
          {zones.length > 0 && (
            <span className="text-xs text-ink-soft">
              {zones.length} {zoneWord} · {involved} zapojeno
            </span>
          )}
          {isLead && (
            <button className="btn-primary px-3 py-1.5 text-sm" onClick={() => setAddOpen((v) => !v)}>
              {addOpen ? "Zavřít" : "+ Zóna"}
            </button>
          )}
        </div>
      </div>
      {isLead && addOpen && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input className="input" placeholder="Nová zóna (např. Vstup, Dvůr, Aula)" value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addZone()} autoFocus />
            <button className="btn-primary shrink-0" onClick={addZone} disabled={!name.trim()}>
              Přidat
            </button>
          </div>
          {descOpen ? (
            <textarea className="input min-h-20" placeholder="Popis zóny — jak si to představujeme…" value={desc} onChange={(e) => setDesc(e.target.value)} autoFocus />
          ) : (
            <button
              className="inline-flex items-center gap-1 rounded-lg border border-dashed border-gold-500/60 bg-gold-50 px-3 py-1.5 text-xs font-semibold text-gold-700 transition hover:bg-gold-100"
              onClick={() => setDescOpen(true)}
            >
              ✍️ Přidat popis
            </button>
          )}
        </div>
      )}
      {zones.length === 0 ? (
        <div className="card grid place-items-center p-8 text-center text-sm text-ink-soft">
          Zatím žádné zóny.
        </div>
      ) : (
        <div className="space-y-2.5">
          {zones.map((z) => (
            <ZoneCard key={z.id} zone={z} year={year} canEdit={canEdit} isLead={isLead} me={me} />
          ))}
        </div>
      )}
    </section>
  );
}

// Hlasování týmu výzdoby — vedoucí (a tým) zakládá ankety o rozhodnutích výzdoby.
// Anketa jde do sdílených `year.polls`, takže se objeví i v obecném Hlasování.
function TeamVoting({ year, canEdit, me }: { year: Year; canEdit: boolean; me: string }) {
  const { dispatch } = useStore();
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [multi, setMulti] = useState(false);
  const [closesAt, setClosesAt] = useState<string | undefined>(undefined);

  const polls = [...year.polls]
    .filter((p) => p.tag === "vyzdoba")
    .sort((a, b) => {
      const ac = isPollClosed(a), bc = isPollClosed(b);
      if (ac !== bc) return ac ? 1 : -1;
      return b.createdAt.localeCompare(a.createdAt);
    });

  async function create() {
    const opts = options.map((o) => o.trim()).filter(Boolean);
    if (!question.trim() || opts.length < 2) return;
    await dispatch({ type: "addPoll", yearId: year.id, author: me, question, options: opts, multi, closesAt, tag: "vyzdoba" });
    setQuestion("");
    setOptions(["", ""]);
    setMulti(false);
    setClosesAt(undefined);
    setOpen(false);
    flash("Anketa vytvořena — je i v Hlasování", "🗳️");
  }

  if (!canEdit && polls.length === 0) return null;

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-display text-[19px] font-bold">🗳️ Hlasování týmu</h2>
        {canEdit && (
          <button className="btn-primary px-3 py-1.5 text-sm" onClick={() => setOpen((v) => !v)}>
            {open ? "Zavřít" : "+ Nová anketa"}
          </button>
        )}
      </div>

      {open && canEdit && (
        <div className="card space-y-3 p-4">
          <input className="input" placeholder="Otázka (např. Jakou barvu lampionů?)" value={question} onChange={(e) => setQuestion(e.target.value)} autoFocus />
          <div className="space-y-2">
            {options.map((o, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  className="input"
                  placeholder={`Možnost ${i + 1}`}
                  value={o}
                  onChange={(e) => setOptions((arr) => arr.map((x, j) => (j === i ? e.target.value : x)))}
                />
                {options.length > 2 && (
                  <button className="btn-ghost px-2" aria-label={`Odebrat možnost ${i + 1}`} title="Odebrat možnost" onClick={() => setOptions((arr) => arr.filter((_, j) => j !== i))}>
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button className="btn-ghost" onClick={() => setOptions((arr) => [...arr, ""])}>
              + Další možnost
            </button>
          </div>
          <DeadlineField value={closesAt} onChange={setClosesAt} />
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-ink-soft">
              <input type="checkbox" checked={multi} onChange={(e) => setMulti(e.target.checked)} />
              Lze vybrat víc možností
            </label>
            <button className="btn-primary ml-auto" onClick={create}>
              Vytvořit anketu
            </button>
          </div>
        </div>
      )}

      {polls.length === 0 ? (
        <div className="card grid place-items-center p-8 text-center text-sm text-ink-soft">
          Zatím žádné hlasování.
        </div>
      ) : (
        <div className="space-y-2">
          {polls.map((p) => {
            const closed = isPollClosed(p);
            const voted = p.options.some((o) => o.voters.some((v) => sameName(v, me)));
            const votes = new Set(p.options.flatMap((o) => o.voters)).size;
            return (
              <div key={p.id} className={`card flex flex-wrap items-center gap-3 p-3.5 ${voted && !closed ? "bg-leaf/[0.05] ring-1 ring-leaf/40" : ""}`}>
                <div className="min-w-0 flex-1">
                  <p className="break-words font-medium">🗳️ {p.question}</p>
                  <p className="mt-0.5 text-xs text-ink-soft">
                    {votes === 0 ? "zatím nikdo nehlasoval" : `${votes} ${votes === 1 ? "hlas" : votes <= 4 ? "hlasy" : "hlasů"}`}
                    {closed ? " · uzavřeno" : ""}
                  </p>
                </div>
                {closed ? (
                  <Link href={`/zazemi/hlasovani?poll=${p.id}`} className="shrink-0 rounded-full bg-paper2 px-3.5 py-2 text-xs font-semibold text-ink-soft transition hover:bg-ink/5">
                    Výsledek →
                  </Link>
                ) : voted ? (
                  <span className="badge-closed-glow inline-flex shrink-0 items-center gap-1.5 rounded-full border border-leaf/50 bg-leaf/15 px-3.5 py-2 text-xs font-bold text-leaf-700">
                    ✅ Hlasoval jsi
                  </span>
                ) : (
                  <Link href={`/zazemi/hlasovani?poll=${p.id}`} className="pending-glow inline-flex shrink-0 items-center gap-1.5 rounded-full bg-gold-500 px-4 py-2 text-xs font-bold text-[#1d1d1f] transition hover:bg-gold-400">
                    🗳️ Hlasovat →
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

// Malý nadpis podsekce v zóně (ikona + popisek + volitelný počet).
function ZoneLabel({ icon, children, count }: { icon: string; children: React.ReactNode; count?: string }) {
  return (
    <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-ink-soft">
      <span aria-hidden>{icon}</span>
      {children}
      {count && <span className="text-ink-soft/60">{count}</span>}
    </p>
  );
}

// Jedna zóna — sbalitelná karta. Sbaleno = přehled (lidi, postup úkolů,
// materiál); rozbaleno = kdo spravuje, referenční obrázek + popis, úkoly zóny
// (svítí členům v Moje agenda) a přiřazený materiál. Moje zóny jsou rozbalené.
function ZoneCard({ zone, year, canEdit, isLead, me }: { zone: DecorZone; year: Year; canEdit: boolean; isLead: boolean; me: string }) {
  const { dispatch } = useStore();
  const [editName, setEditName] = useState(false);
  const [name, setName] = useState(zone.name);
  const [desc, setDesc] = useState(zone.description ?? "");
  const [editDesc, setEditDesc] = useState(false);
  const [taskText, setTaskText] = useState("");
  const [manage, setManage] = useState(false);

  const iAmIn = zone.members.some((m) => sameName(m, me));
  const canEditZone = isLead || (canEdit && iAmIn); // přispívat do zóny (obrázek, popis)
  const zoneTasks = year.tasks.filter((t) => t.zoneId === zone.id);
  const zoneMaterial = (year.decor ?? []).filter((d) => d.zoneId === zone.id);
  const done = zoneTasks.filter((t) => t.done).length;
  const total = zoneTasks.length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  const empty = zone.members.length === 0;

  function addZoneTask() {
    if (!taskText.trim()) return;
    dispatch({ type: "addTask", yearId: year.id, title: taskText.trim(), zoneId: zone.id, roleId: "vyzdoba" });
    setTaskText("");
    flash(`Úkol pro zónu „${zone.name}" — svítí členům v agendě`, "✅");
  }

  return (
    <Collapsible
      defaultOpen={iAmIn}
      className={`card p-4 transition ${iAmIn ? "ring-1 ring-leaf/40" : ""}`}
      headerClassName="items-start gap-3"
      header={(open) => (
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-display text-lg font-semibold">📍 {zone.name}</span>
            {iAmIn && <span className="rounded-full bg-leaf px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">jsi tu</span>}
            {empty && <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-red-600">volná</span>}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-ink-soft">
            <span>👥 {zone.members.length}</span>
            {total > 0 && <span className={done === total ? "font-semibold text-leaf-700" : ""}>✅ {done}/{total} úkolů</span>}
            {zoneMaterial.length > 0 && <span>🎨 {zoneMaterial.length}× materiál</span>}
            {!open && zone.members.length > 0 && <span className="min-w-0 truncate text-ink-soft/70">· {zone.members.join(", ")}</span>}
          </div>
          {total > 0 && (
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-paper2">
              <div className="h-full rounded-full bg-leaf transition-all" style={{ width: `${pct}%` }} />
            </div>
          )}
        </div>
      )}
    >
      <div className="mt-3 space-y-4 border-t border-ink/[0.08] pt-3">
        {/* Akce vedoucího */}
        {isLead && (
          <div className="flex items-center gap-2">
            {editName ? (
              <div className="flex flex-1 gap-2">
                <input className="input" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
                <button className="btn-primary shrink-0 px-2.5 py-1 text-xs" onClick={() => { dispatch({ type: "updateDecorZone", yearId: year.id, zoneId: zone.id, patch: { name } }); setEditName(false); }}>
                  OK
                </button>
              </div>
            ) : (
              <>
                <button className="btn-ghost px-2 py-1 text-xs" onClick={() => { setName(zone.name); setEditName(true); }}>✏️ Přejmenovat</button>
                <DeleteButton onConfirm={() => dispatch({ type: "removeDecorZone", yearId: year.id, zoneId: zone.id })} what={`zónu „${zone.name}"`} />
              </>
            )}
          </div>
        )}

        {/* Kdo spravuje */}
        <div>
          <ZoneLabel icon="👥">Kdo spravuje</ZoneLabel>
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            {zone.members.length === 0 && <span className="text-sm italic text-ink-soft/70">zatím nikdo — přihlaš se</span>}
            {zone.members.map((m) => (
              <span key={m} className={`chip ${sameName(m, me) ? "bg-leaf text-white" : ""}`}>
                {m}
                {isLead && (
                  <button onClick={() => dispatch({ type: "leaveDecorZone", yearId: year.id, zoneId: zone.id, name: m })} className="ml-1 opacity-70 hover:opacity-100" aria-label="Odebrat ze zóny">
                    ×
                  </button>
                )}
              </span>
            ))}
          </div>
          {canEdit && (
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {iAmIn ? (
                <button className="rounded-full bg-paper2 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50" onClick={() => dispatch({ type: "leaveDecorZone", yearId: year.id, zoneId: zone.id, name: me })}>
                  Odhlásit se
                </button>
              ) : (
                <button className="btn-primary px-3 py-1.5 text-xs" onClick={() => { dispatch({ type: "joinDecorZone", yearId: year.id, zoneId: zone.id, name: me }); flash(`Přihlášen do zóny „${zone.name}"`, "📍"); }}>
                  Přihlásit se do zóny
                </button>
              )}
              {isLead && (
                <button className="btn-ghost px-2.5 py-1.5 text-xs" onClick={() => setManage((v) => !v)}>
                  {manage ? "Hotovo" : "+ Přidat člověka"}
                </button>
              )}
            </div>
          )}
          {isLead && manage && (
            <div className="mt-2">
              <WhoSelect value="" onChange={(v) => v && dispatch({ type: "joinDecorZone", yearId: year.id, zoneId: zone.id, name: v })} placeholder="Přidat člena do zóny…" />
            </div>
          )}
        </div>

        {/* Referenční obrázek + popis */}
        <div>
          <ZoneLabel icon="🖼️">Jak si to představujeme</ZoneLabel>
          <div className="mt-1.5 space-y-2">
            <ImageBoard
              ids={zone.refImageIds ?? []}
              canEdit={canEditZone}
              addLabel="Ref. obrázek"
              onChange={(next) => dispatch({ type: "updateDecorZone", yearId: year.id, zoneId: zone.id, patch: { refImageIds: next } })}
            />
            {editDesc && canEditZone ? (
              <div className="space-y-2">
                <textarea className="input min-h-20" value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Popis představy zóny…" autoFocus />
                <div className="flex gap-2">
                  <button className="btn-primary py-1.5 text-xs" onClick={() => { dispatch({ type: "updateDecorZone", yearId: year.id, zoneId: zone.id, patch: { description: desc } }); setEditDesc(false); }}>
                    Uložit popis
                  </button>
                  <button className="btn-ghost py-1.5 text-xs" onClick={() => setEditDesc(false)}>Zrušit</button>
                </div>
              </div>
            ) : zone.description ? (
              <p className={`whitespace-pre-wrap rounded-lg bg-paper2/50 px-3 py-2 text-sm text-ink-soft ${canEditZone ? "cursor-pointer hover:text-ink" : ""}`} onClick={() => canEditZone && (setDesc(zone.description ?? ""), setEditDesc(true))}>
                {zone.description}
              </p>
            ) : canEditZone ? (
              <button
                className="inline-flex items-center gap-1 rounded-lg border border-dashed border-gold-500/60 bg-gold-50 px-3 py-2 text-sm font-semibold text-gold-700 transition hover:bg-gold-100"
                onClick={() => { setDesc(""); setEditDesc(true); }}
              >
                ✍️ Přidat popis
              </button>
            ) : null}
          </div>
        </div>

        {/* Úkoly zóny */}
        <div>
          <ZoneLabel icon="✅" count={total > 0 ? `(${done}/${total})` : undefined}>Úkoly zóny</ZoneLabel>
          {total > 0 ? (
            <ul className="mt-1.5 space-y-1">
              {zoneTasks.map((t) => (
                <li key={t.id} className="flex items-center gap-2 text-sm">
                  <span className={`grid h-4 w-4 shrink-0 place-items-center rounded-[5px] border text-[11px] font-bold leading-none ${t.done ? "border-leaf bg-leaf text-white" : "border-ink/30 bg-white text-transparent"}`}>✓</span>
                  <span className={t.done ? "text-ink-soft line-through" : "font-medium"}>{t.title}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-1.5 text-sm text-ink-soft/70">Zatím žádné úkoly.</p>
          )}
          {isLead && (
            <div className="mt-2 flex gap-2">
              <input className="input" placeholder="Nový úkol pro zónu…" value={taskText} onChange={(e) => setTaskText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addZoneTask()} />
              <button className="btn-primary shrink-0 px-2.5 py-1 text-xs" onClick={addZoneTask} disabled={!taskText.trim()}>+ Úkol</button>
            </div>
          )}
          {total > 0 && (
            <Link
              href="/zazemi/ukoly"
              className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-gold-500/50 bg-gold-50 px-3.5 py-2 text-sm font-semibold text-gold-700 shadow-sm transition hover:bg-gold-100"
            >
              ✅ Odškrtnout v Úkolech →
            </Link>
          )}
        </div>

        {/* Materiál zóny */}
        {zoneMaterial.length > 0 && (
          <div>
            <ZoneLabel icon="🎨" count={`(${zoneMaterial.length})`}>Materiál zóny</ZoneLabel>
            <ul className="mt-1.5 space-y-1">
              {zoneMaterial.map((d) => (
                <li key={d.id} className="flex items-center gap-2 text-sm">
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${STATUS[d.status].cls}`}>{STATUS[d.status].label}</span>
                  <span className={d.status === "hotovo" ? "text-ink-soft line-through" : ""}>{d.title}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Collapsible>
  );
}

function DecorRow({ d, yearId, canEdit, admin, zones, myZones }: { d: Decor; yearId: string; canEdit: boolean; admin?: boolean; zones: DecorZone[]; myZones: DecorZone[] }) {
  const { dispatch } = useStore();
  const [edit, setEdit] = useState(false);
  const [askDone, setAskDone] = useState(false); // potvrzení „hotovo → uzamknout"
  const [title, setTitle] = useState(d.title);
  const [who, setWho] = useState(d.who ?? "");
  const [link, setLink] = useState(d.link ?? "");
  const [note, setNote] = useState(d.note ?? "");
  const [newZone, setNewZone] = useState(false); // inline „nová zóna" rovnou od materiálu
  const [newZoneName, setNewZoneName] = useState("");
  const locked = d.status === "hotovo"; // hotové je uzamčené, dokud se neodemkne
  const zoneName = zones.find((z) => z.id === d.zoneId)?.name;

  async function save() {
    await dispatch({ type: "updateDecor", yearId, decorId: d.id, patch: { title, who, link, note } });
    setEdit(false);
  }
  // Založí novou zónu a rovnou k ní materiál přiřadí (funguje i bez existujících zón).
  function createZoneAndAssign() {
    const name = newZoneName.trim();
    if (!name) return;
    const zid = uid("dz_");
    dispatch({ type: "addDecorZone", yearId, name, id: zid });
    dispatch({ type: "updateDecor", yearId, decorId: d.id, patch: { zoneId: zid } });
    flash(`Zóna „${name}" vytvořena a přiřazena`, "📍");
    setNewZone(false);
    setNewZoneName("");
  }
  // Klik na stav: nápad → shání se rovnou; před „hotovo" se to potvrdí a pak
  // se uzamkne. Hotové už samo neroluje zpět (šlo by jen omylem).
  function cycle() {
    if (!canEdit || locked) return;
    if (d.status === "shani") {
      setAskDone(true);
      return;
    }
    dispatch({ type: "updateDecor", yearId, decorId: d.id, patch: { status: NEXT[d.status] } });
  }
  function scrollToSelf() {
    setTimeout(() => document.getElementById(`decor-${d.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" }), 120);
  }
  function confirmDone() {
    dispatch({ type: "updateDecor", yearId, decorId: d.id, patch: { status: "hotovo" } });
    setAskDone(false);
    flash("Hotovo — uzamčeno 🔒", "✅");
    scrollToSelf();
  }
  function reset() {
    dispatch({ type: "updateDecor", yearId, decorId: d.id, patch: { status: "napad" } });
    flash("Resetováno na nápad — je mezi nápady nahoře", "🔄");
    scrollToSelf();
  }

  if (edit) {
    return (
      <li className="card space-y-2 p-3">
        <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Nápad / materiál" />
        <div className="grid gap-2 sm:grid-cols-2">
          <WhoSelect value={who} onChange={setWho} placeholder="Kdo shání? (nepovinné)" />
          <input className="input" value={link} onChange={(e) => setLink(e.target.value)} placeholder="Odkaz (nepovinné)" />
        </div>
        <input className="input" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Poznámka" />
        <div className="flex gap-2">
          <button className="btn-primary py-2 text-sm" onClick={save}>Uložit</button>
          <button className="btn-ghost py-2 text-sm" onClick={() => setEdit(false)}>Zrušit</button>
        </div>
      </li>
    );
  }

  return (
    <li id={`decor-${d.id}`} className="card scroll-mt-24 space-y-2 p-3">
      {/* Horní řádek: stav vlevo, akce vpravo — zarovnané na jednu linku */}
      <div className="flex items-center gap-2">
        <button
          onClick={cycle}
          disabled={!canEdit || locked}
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium transition ${STATUS[d.status].cls} ${canEdit && !locked ? "hover:opacity-80" : ""}`}
          title={locked ? "Hotovo — uzamčeno" : undefined}
        >
          {STATUS[d.status].label}
          {locked ? " 🔒" : ""}
        </button>
        {canEdit && (
          <div className="ml-auto flex shrink-0 items-center gap-1">
            {locked && admin && (
              <button className="btn-ghost px-2 py-1 text-xs font-semibold text-gold-700" onClick={reset}>
                🔄 Reset
              </button>
            )}
            {!locked && <button className="btn-ghost px-2 py-1 text-xs" onClick={() => setEdit(true)}>Upravit</button>}
            <DeleteButton onConfirm={() => dispatch({ type: "removeDecor", yearId, decorId: d.id })} />
          </div>
        )}
      </div>

      {/* Název přes celou šířku */}
      <p className={`break-words font-medium ${d.status === "hotovo" ? "text-ink-soft line-through" : ""}`}>{d.title}</p>

      {/* Kdo shání / odkaz / poznámka */}
      {(d.who || d.link || d.note) && (
        <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-ink-soft">
          {d.who && <span>👤 {d.who}</span>}
          {d.link && (
            <a href={d.link.startsWith("http") ? d.link : `https://${d.link}`} target="_blank" rel="noreferrer" className="break-all text-gold-700 hover:underline">
              🔗 odkaz
            </a>
          )}
          {d.note && <span className="break-words">📝 {d.note}</span>}
        </div>
      )}

      {/* Zóna — viditelná tlačítka: volné ⇄ vzít do své zóny; vedoucí přiřadí kamkoli */}
      <div className="flex flex-wrap items-center gap-2 pt-0.5">
        {d.zoneId ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-gold-600/12 px-2.5 py-1 text-xs font-bold text-gold-700">
            📍 {zoneName ?? "Zóna"}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-paper2 px-2.5 py-1 text-xs font-semibold text-ink-soft">
            📍 Volné
          </span>
        )}

        {/* Přiřazené: uvolnit zpět mezi volné */}
        {canEdit && d.zoneId && (
          <button
            className="rounded-full border border-ink/15 bg-white px-3 py-1 text-xs font-semibold text-ink-soft transition hover:bg-ink/5"
            onClick={() => { dispatch({ type: "updateDecor", yearId, decorId: d.id, patch: { zoneId: null } }); flash("Uvolněno — je volné", "📍"); }}
          >
            Uvolnit
          </button>
        )}

        {/* Volné: vzít do své zóny (jedno tlačítko na každou moji zónu) */}
        {canEdit &&
          !d.zoneId &&
          myZones.map((z) => (
            <button
              key={z.id}
              className="rounded-full border border-leaf/50 bg-leaf/10 px-3 py-1.5 text-xs font-bold text-leaf-700 transition hover:bg-leaf/20"
              onClick={() => { dispatch({ type: "updateDecor", yearId, decorId: d.id, patch: { zoneId: z.id } }); flash(`Vzato do zóny „${z.name}"`, "📍"); }}
            >
              ➕ Vzít do „{z.name}&ldquo;
            </button>
          ))}

        {/* Přiřadit do libovolné zóny — může kdokoli z týmu (editor) */}
        {canEdit && zones.length > 0 && (
          <select
            className="min-w-0 rounded-full border border-ink/15 bg-white px-2.5 py-1 text-xs text-ink-soft"
            value={d.zoneId ?? ""}
            onChange={(e) => dispatch({ type: "updateDecor", yearId, decorId: d.id, patch: { zoneId: e.target.value || null } })}
          >
            <option value="">↪︎ přiřadit do zóny…</option>
            {zones.map((z) => (
              <option key={z.id} value={z.id}>
                {z.name}
              </option>
            ))}
          </select>
        )}

        {/* Nová zóna rovnou od materiálu — funguje i když ještě žádná není */}
        {canEdit &&
          (newZone ? (
            <span className="inline-flex items-center gap-1">
              <input
                className="w-32 rounded-full border border-ink/15 bg-white px-2.5 py-1 text-xs"
                placeholder="Název zóny"
                value={newZoneName}
                onChange={(e) => setNewZoneName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && createZoneAndAssign()}
                autoFocus
              />
              <button className="rounded-full bg-gold-500 px-2.5 py-1 text-xs font-bold text-[#1d1d1f]" onClick={createZoneAndAssign} disabled={!newZoneName.trim()}>
                OK
              </button>
              <button className="rounded-full px-1.5 py-1 text-xs text-ink-soft" onClick={() => { setNewZone(false); setNewZoneName(""); }} aria-label="Zrušit">
                ✕
              </button>
            </span>
          ) : (
            <button
              className="rounded-full border border-dashed border-gold-500/60 bg-gold-50 px-2.5 py-1 text-xs font-semibold text-gold-700 transition hover:bg-gold-100"
              onClick={() => setNewZone(true)}
            >
              ➕ Nová zóna
            </button>
          ))}
      </div>

      {/* Potvrzení „hotovo" — pak se to uzamkne */}
      <Modal open={askDone} onClose={() => setAskDone(false)} title="Označit jako hotovo?">
        <p className="text-sm text-ink-soft">
          <strong className="text-ink">„{d.title}“</strong> se uzamkne. Odemkne jen správce.
        </p>
        <div className="mt-4 flex items-center gap-2">
          <button className="btn-primary flex-1" onClick={confirmDone}>
            ✅ Hotovo
          </button>
          <button className="btn-ghost" onClick={() => setAskDone(false)}>
            Zrušit
          </button>
        </div>
      </Modal>
    </li>
  );
}
