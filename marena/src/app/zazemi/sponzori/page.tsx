"use client";

import { useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { PageTitle } from "@/components/PageTitle";
import { useStore } from "@/lib/store";
import { canEditSection } from "@/lib/access";
import { isAdmin } from "@/lib/admin";
import { ReadOnlyBanner } from "@/components/ReadOnlyBanner";
import { DeleteButton } from "@/components/DeleteButton";
import { Modal } from "@/components/Modal";
import { SearchBox } from "@/components/SearchBox";
import { WhoSelect } from "@/components/WhoSelect";
import { CopyContact } from "@/components/CopyContact";
import { matchesQuery } from "@/lib/search";
import { flash } from "@/components/Flash";
import type { Sponsor, SponsorStatus, SponsorCategory, ContactVia } from "@/lib/types";

// Jak jsme sponzora oslovili — emoji + popisky pro tlačítka i štítek.
const VIA: Record<ContactVia, { emoji: string; label: string; adverb: string }> = {
  email: { emoji: "✉️", label: "E-mailem", adverb: "e-mailem" },
  phone: { emoji: "📞", label: "Telefonicky", adverb: "telefonicky" },
  osobne: { emoji: "🤝", label: "Osobně", adverb: "osobně" },
};

// Editor více odkazů / kontaktů — tlačítko „+" přidá další pole, „✕" ho odebere.
function LinksEditor({ links, setLinks }: { links: string[]; setLinks: Dispatch<SetStateAction<string[]>> }) {
  return (
    <div className="space-y-2">
      {links.map((l, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            className="input"
            placeholder="Web, e-mail nebo telefon"
            value={l}
            onChange={(e) => setLinks((arr) => arr.map((x, j) => (j === i ? e.target.value : x)))}
          />
          {links.length > 1 && (
            <button
              type="button"
              className="btn-ghost px-2"
              aria-label="Odebrat odkaz"
              title="Odebrat odkaz"
              onClick={() => setLinks((arr) => arr.filter((_, j) => j !== i))}
            >
              ✕
            </button>
          )}
        </div>
      ))}
      <button type="button" className="btn-ghost text-sm" onClick={() => setLinks((arr) => [...arr, ""])}>
        + Další odkaz / kontakt
      </button>
    </div>
  );
}

// Pořadí skupin: „čeká" nahoře, pak „potvrzeno", pak „oslovit", „odmítl" úplně dole.
const GROUP: Record<SponsorStatus, number> = { ceka: 0, potvrzeno: 1, oslovit: 2, odmitl: 3 };

const CATEGORIES: { id: SponsorCategory; label: string; emoji: string }[] = [
  { id: "jidlo_piti", label: "Jídlo a pití", emoji: "🍔" },
  { id: "stavebni", label: "Stavební materiál", emoji: "🧱" },
  { id: "tisk", label: "Tisk", emoji: "🖨️" },
  { id: "technika", label: "Technika", emoji: "💻" },
  { id: "ostatni", label: "Ostatní", emoji: "📦" },
];
const CAT = Object.fromEntries(CATEGORIES.map((c) => [c.id, c])) as Record<SponsorCategory, (typeof CATEGORIES)[number]>;

const FILTERS: { id: "vse" | SponsorStatus; label: string }[] = [
  { id: "vse", label: "Vše" },
  { id: "oslovit", label: "Oslovit" },
  { id: "ceka", label: "Čeká" },
  { id: "potvrzeno", label: "Potvrzeno" },
  { id: "odmitl", label: "Odmítl" },
];

// Odkazy sponzora: nové links[] + starý jeden link (kvůli původním datům).
const linksOf = (s: Sponsor): string[] => [...(s.links ?? []), ...(s.link ? [s.link] : [])];

// Pozná, jestli je „kontakt" e-mail, telefon nebo web, a udělá správný odkaz
// (mailto: / tel: / https:). Dřív se všechno bralo jako web — telefon i e-mail
// se pak chybně otvíraly jako https://…
type LinkKind = "email" | "phone" | "url";
function classifyLink(raw: string): { kind: LinkKind; href: string; label: string } {
  const l = raw.trim();
  const email = l.replace(/^mailto:/i, "");
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { kind: "email", href: `mailto:${email}`, label: email };
  const tel = l.replace(/^tel:/i, "");
  if (/^\+?\d[\d\s()/.-]{5,}$/.test(tel)) return { kind: "phone", href: `tel:${tel.replace(/[\s()/.-]/g, "")}`, label: tel };
  return { kind: "url", href: l.startsWith("http") ? l : `https://${l}`, label: "odkaz" };
}

export default function SponzoriPage() {
  const { currentYear, me, dispatch, canEditCurrentYear } = useStore();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [gives, setGives] = useState("");
  const [who, setWho] = useState("");
  const [links, setLinks] = useState<string[]>([""]);
  const [note, setNote] = useState("");
  const [category, setCategory] = useState<SponsorCategory>("jidlo_piti");
  const [returning, setReturning] = useState(false);
  const [filter, setFilter] = useState<"vse" | SponsorStatus>("vse");
  const [q, setQ] = useState("");

  const year = currentYear;
  const sponsors = useMemo(() => year?.sponsors ?? [], [year]);

  const counts = useMemo(() => {
    const c = { oslovit: 0, ceka: 0, potvrzeno: 0, odmitl: 0 };
    for (const s of sponsors) c[s.status]++;
    return c;
  }, [sponsors]);

  const list = useMemo(() => {
    const sorted = [...sponsors].sort((a, b) => {
      if (GROUP[a.status] !== GROUP[b.status]) return GROUP[a.status] - GROUP[b.status];
      // uvnitř skupiny: podle času změny stavu (fronta — kdo dřív, ten výš)
      const ta = a.statusAt ?? a.createdAt;
      const tb = b.statusAt ?? b.createdAt;
      return ta.localeCompare(tb) || a.name.localeCompare(b.name, "cs");
    });
    const byStatus = filter === "vse" ? sorted : sorted.filter((s) => s.status === filter);
    return byStatus.filter((s) =>
      matchesQuery(q, s.name, s.gives, s.who, s.note, CAT[s.category ?? "ostatni"]?.label, linksOf(s).join(" ")),
    );
  }, [sponsors, filter, q]);

  if (!year) return null;
  const canEdit = canEditCurrentYear && canEditSection(year, me, "sponzori");

  async function add() {
    if (!name.trim() || !year || !canEdit) return;
    await dispatch({ type: "addSponsor", yearId: year.id, name: name.trim(), gives, who, links, note, category, returning });
    setName("");
    setGives("");
    setWho("");
    setLinks([""]);
    setNote("");
    setReturning(false);
    flash("Sponzor přidán", "🤝");
  }

  return (
    <div className="space-y-5">
      {canEditCurrentYear && !canEdit && (
        <ReadOnlyBanner>Sponzory máš jen k náhledu — upravovat je může jen správce a příslušná role.</ReadOnlyBanner>
      )}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <PageTitle>Sponzoři</PageTitle>
        </div>
        {canEdit && (
          <button className="btn-primary" onClick={() => setOpen((v) => !v)}>
            {open ? "Zavřít" : "+ Přidat sponzora"}
          </button>
        )}
      </div>

      {sponsors.length > 0 && (
        <div className="flex justify-end">
          <SearchBox value={q} onChange={setQ} placeholder="Hledat sponzora…" className="w-full sm:w-72" />
        </div>
      )}

      {open && canEdit && (
        <div className="card space-y-3 p-4">
          <input
            className="input"
            placeholder="Název sponzora (např. Rebel Bean, Pivovar Hauskrecht…)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && add()}
            autoFocus
          />
          <input className="input" placeholder="Co dává (pivo, čaj, kávovar, peníze…)" value={gives} onChange={(e) => setGives(e.target.value)} />
          <WhoSelect value={who} onChange={setWho} placeholder="Kdo to řeší? (nepovinné)" />
          <LinksEditor links={links} setLinks={setLinks} />
          <input className="input" placeholder="Požadavky / poznámka (např. chce logo)" value={note} onChange={(e) => setNote(e.target.value)} />

          <div>
            <p className="mb-1 text-xs font-medium text-ink-soft">Kategorie</p>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategory(c.id)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition ${category === c.id ? "bg-gold-500 text-[#1d1d1f]" : "bg-paper2 text-ink-soft hover:bg-ink/5"}`}
                >
                  {c.emoji} {c.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-1 text-xs font-medium text-ink-soft">Typ sponzora</p>
            <div className="inline-flex rounded-full bg-paper2 p-0.5 text-xs">
              <button type="button" onClick={() => setReturning(false)} className={`rounded-full px-3 py-1 font-medium transition ${!returning ? "bg-gold-grad text-[#1d1d1f] shadow-sm" : "text-ink-soft"}`}>
                🆕 Nový
              </button>
              <button type="button" onClick={() => setReturning(true)} className={`rounded-full px-3 py-1 font-medium transition ${returning ? "bg-gold-grad text-[#1d1d1f] shadow-sm" : "text-ink-soft"}`}>
                🔁 Stálý
              </button>
            </div>
          </div>

          <div className="flex gap-2">
            <button className="btn-primary py-2 text-sm" onClick={add} disabled={!name.trim()}>
              + Přidat sponzora
            </button>
            <button className="btn-ghost py-2 text-sm" onClick={() => setOpen(false)}>
              Zrušit
            </button>
          </div>
        </div>
      )}

      {sponsors.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-ink-soft tabular-nums">
            {sponsors.length} sponzorů · <span className="font-semibold text-leaf-700">{counts.potvrzeno} potvrzeno</span> ·{" "}
            <span className="font-semibold text-red-600">{counts.odmitl} odmítl</span>
          </p>
          <div className="flex flex-wrap gap-1.5">
            {FILTERS.map((f) => {
              const n = f.id === "vse" ? sponsors.length : counts[f.id];
              return (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition ${filter === f.id ? "bg-ink text-surface" : "bg-paper2 text-ink-soft hover:bg-ink/5"}`}
                >
                  {f.label} <span className="opacity-70 tabular-nums">{n}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {sponsors.length === 0 ? (
        <div className="empty-state">
          Zatím žádní sponzoři.
        </div>
      ) : list.length === 0 ? (
        <div className="empty-state">V tomhle filtru nikdo není.</div>
      ) : (
        <ul className="card divide-y divide-ink/10 overflow-hidden">
          {list.map((s) => (
            <SponsorRow key={s.id} s={s} yearId={year.id} canEdit={canEdit} />
          ))}
        </ul>
      )}
    </div>
  );
}

function SponsorRow({ s, yearId, canEdit }: { s: Sponsor; yearId: string; canEdit: boolean }) {
  const { dispatch, me } = useStore();
  const [edit, setEdit] = useState(false);
  const [askCancel, setAskCancel] = useState(false); // potvrzení „Zrušeno?"
  const [askContact, setAskContact] = useState(false); // okno „jak jsi oslovil?"
  const [name, setName] = useState(s.name);
  const [gives, setGives] = useState(s.gives ?? "");
  const [who, setWho] = useState(s.who ?? "");
  const [links, setLinks] = useState<string[]>(() => {
    const l = linksOf(s);
    return l.length ? l : [""];
  });
  const [note, setNote] = useState(s.note ?? "");
  const [category, setCategory] = useState<SponsorCategory>(s.category ?? "ostatni");
  const [returning, setReturning] = useState(!!s.returning);

  async function save() {
    await dispatch({ type: "updateSponsor", yearId, sponsorId: s.id, patch: { name, gives, who, links, note, category, returning } });
    setEdit(false);
  }

  if (edit) {
    return (
      <li className="card space-y-3 p-3">
        <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Název sponzora" />
        <input className="input" value={gives} onChange={(e) => setGives(e.target.value)} placeholder="Co dává (pivo, čaj, kávovar, peníze…)" />
        <WhoSelect value={who} onChange={setWho} placeholder="Kdo to řeší? (nepovinné)" />
        <LinksEditor links={links} setLinks={setLinks} />
        <input className="input" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Požadavky / poznámka (např. chce logo)" />
        <div>
          <p className="mb-1 text-xs font-medium text-ink-soft">Kategorie</p>
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCategory(c.id)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${category === c.id ? "bg-gold-500 text-[#1d1d1f]" : "bg-paper2 text-ink-soft hover:bg-ink/5"}`}
              >
                {c.emoji} {c.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-1 text-xs font-medium text-ink-soft">Typ sponzora</p>
          <div className="inline-flex rounded-full bg-paper2 p-0.5 text-xs">
            <button type="button" onClick={() => setReturning(false)} className={`rounded-full px-3 py-1 font-medium transition ${!returning ? "bg-gold-grad text-[#1d1d1f] shadow-sm" : "text-ink-soft"}`}>
              🆕 Nový
            </button>
            <button type="button" onClick={() => setReturning(true)} className={`rounded-full px-3 py-1 font-medium transition ${returning ? "bg-gold-grad text-[#1d1d1f] shadow-sm" : "text-ink-soft"}`}>
              🔁 Stálý
            </button>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="btn-primary py-2 text-sm" onClick={save}>
            Uložit
          </button>
          <button className="btn-ghost py-2 text-sm" onClick={() => setEdit(false)}>
            Zrušit
          </button>
        </div>
      </li>
    );
  }

  // Stavové akce jako u Programu: „Osloveno?" (oslovit ↔ čeká) + domluva ano/ne
  // (čeká → potvrzeno / odmítl). Po rozhodnutí zamčeno — mění jen správce.
  const admin = isAdmin(me);
  const contacted = s.status !== "oslovit";
  const confirmed = s.status === "potvrzeno";
  const decided = confirmed || s.status === "odmitl";
  const lockDecide = s.status === "odmitl" && !admin;
  const setStatus = (status: SponsorStatus) => canEdit && dispatch({ type: "updateSponsor", yearId, sponsorId: s.id, patch: { status } });

  // „Oslovil jsem" → zaškrtni jeden nebo víc způsobů. První zaškrtnutí posune
  // sponzora z „neosloveno" na „čeká". Ukládá se hned (okno se zavře až „Hotovo").
  function toggleVia(via: ContactVia) {
    const cur = s.contactedVia ?? [];
    const next = cur.includes(via) ? cur.filter((v) => v !== via) : [...cur, via];
    dispatch({
      type: "updateSponsor",
      yearId,
      sponsorId: s.id,
      patch: { status: s.status === "oslovit" && next.length ? "ceka" : s.status, contactedVia: next },
    });
  }
  function closeContact() {
    setAskContact(false);
    const via = s.contactedVia ?? [];
    if (via.length) flash(`${s.name} — osloveno ${via.map((v) => VIA[v].emoji).join(" ")}`, "✅");
  }
  function revertContact() {
    dispatch({ type: "updateSponsor", yearId, sponsorId: s.id, patch: { status: "oslovit" } });
    setAskContact(false);
    flash(`${s.name} — vráceno na „neosloveno"`, "↩️");
  }

  return (
    <li className={`p-4 ${s.status === "potvrzeno" ? "bg-leaf/[0.05]" : s.status === "odmitl" ? "bg-red-500/[0.04]" : ""}`}>
      {/* Jméno + odznaky + odkaz */}
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <p className="break-words font-medium">{s.name}</p>
        {s.returning && <span className="rounded-full bg-plum-600/10 px-2 py-0.5 text-[11px] font-medium text-plum-700">🔁 stálý</span>}
        {s.category && (
          <span className="rounded-full bg-paper2 px-2 py-0.5 text-[11px] font-medium text-ink-soft">
            {CAT[s.category].emoji} {CAT[s.category].label}
          </span>
        )}
        {(() => {
          // Pevné pořadí kontaktů: nejdřív web (odkaz), pak telefon, pak e-mail.
          const rank = { url: 0, phone: 1, email: 2 };
          const items = linksOf(s).map(classifyLink).sort((a, b) => rank[a.kind] - rank[b.kind]);
          const urlTotal = items.filter((c) => c.kind === "url").length;
          const cls = "break-all text-xs font-medium text-gold-700 hover:underline";
          return items.map((c, i) => {
            if (c.kind === "url") {
              const urlN = items.slice(0, i + 1).filter((x) => x.kind === "url").length;
              return (
                <a key={i} href={c.href} target="_blank" rel="noreferrer" className={cls}>
                  🔗 odkaz{urlTotal > 1 ? ` ${urlN}` : ""} ↗
                </a>
              );
            }
            const ringed = !!s.contactedVia?.includes(c.kind as ContactVia); // takhle jsme oslovili → zakroužkuj
            return (
              <CopyContact
                key={i}
                value={c.label}
                kind={c.kind}
                className={ringed ? `${cls} rounded-full bg-gold-50 px-2 py-0.5 ring-1 ring-gold-400` : cls}
              />
            );
          });
        })()}
      </div>

      {/* Co dává + kdo řeší + poznámka */}
      {s.gives && <p className="mt-1 break-words text-sm text-leaf-700">🎁 dává: {s.gives}</p>}
      {(s.who || s.note) && (
        <div className="mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-ink-soft">
          {s.who && <span>👤 {s.who}</span>}
          {s.note && <span className="break-words">📝 {s.note}</span>}
        </div>
      )}

      {/* Řádek 1: stav (+ čím jsme oslovili) + domluva + akce; řádek 2: tlačítko „Oslovil jsem" */}
      <div className="mt-2 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
        {/* Stav oslovení — jen štítek; přepíná se tlačítkem „Oslovil jsem" níže. Ukazuje i způsob. */}
        {contacted ? (
          <span className="badge badge-done">
            Osloveno ✓{s.contactedVia?.length ? ` · ${s.contactedVia.map((v) => `${VIA[v].emoji} ${VIA[v].adverb}`).join(" · ")}` : ""}
          </span>
        ) : (
          <span className="badge badge-idle">Neosloveno</span>
        )}

        {/* Stav domluvy */}
        {s.status === "ceka" && <span className="badge badge-wait">⏳ čeká</span>}
        {s.status === "potvrzeno" && (
          <span className="badge badge-done ring-1 ring-inset ring-leaf/40">✅ potvrzeno</span>
        )}
        {s.status === "odmitl" && <span className="badge badge-reject">👎 odmítl</span>}

        {/* Domluva ano/ne — po oslovení; po potvrzení se schová a zamkne (mění se jen přes „Zrušeno?") */}
        {canEdit && contacted && !confirmed && (
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-ink-soft">domluva?</span>
            <div className="flex gap-1" title={lockDecide ? "Rozhodnuto — změnit může jen správce" : undefined}>
              <button
                disabled={lockDecide}
                onClick={() => setStatus(s.status === "potvrzeno" ? "ceka" : "potvrzeno")}
                className={`rounded-full px-2.5 py-1 text-xs font-semibold transition ${
                  s.status === "potvrzeno" ? "bg-leaf text-white" : "bg-leaf/10 text-leaf-700 hover:bg-leaf/20"
                } ${lockDecide ? "cursor-not-allowed opacity-60" : ""}`}
              >
                ano
              </button>
              <button
                disabled={lockDecide}
                onClick={() => setStatus(s.status === "odmitl" ? "ceka" : "odmitl")}
                className={`rounded-full px-2.5 py-1 text-xs font-semibold transition ${
                  s.status === "odmitl" ? "bg-red-500 text-white" : "bg-red-500/10 text-red-600 hover:bg-red-500/20"
                } ${lockDecide ? "cursor-not-allowed opacity-60" : ""}`}
              >
                ne
              </button>
            </div>
          </div>
        )}

        {canEdit && (
          <div className="ml-auto flex items-center gap-1 self-start">
            {/* Zrušeno? — jen u potvrzeného; přesune mezi odmítnuté */}
            {confirmed && (
              <button
                className="btn-ghost px-2 py-1 text-xs text-red-600"
                onClick={() => setAskCancel(true)}
              >
                Zrušeno?
              </button>
            )}
            <button className="btn-ghost px-2 py-1 text-xs" onClick={() => setEdit(true)}>
              Upravit
            </button>
            <DeleteButton onConfirm={() => dispatch({ type: "removeSponsor", yearId, sponsorId: s.id })} />
          </div>
        )}
        </div>

        {/* Tlačítko „Oslovil jsem" — dole vlevo pod stavem; zlaté dokud neosloveno, pak bílé.
            Otevře okno s volbou způsobu (e-mail / telefon / osobně). Po rozhodnutí se skryje. */}
        {canEdit && !decided && (
          <button
            onClick={() => setAskContact(true)}
            className={
              contacted
                ? "inline-flex items-center gap-1.5 rounded-full bg-surface px-3.5 py-1.5 text-sm font-medium text-ink ring-1 ring-ink/15 transition hover:bg-ink/5"
                : "btn-pill btn-pill-gold"
            }
          >
            {contacted ? `${s.contactedVia?.length ? s.contactedVia.map((v) => VIA[v].emoji).join("") : "✉️"} Oslovil jsem` : "✉️ Oslovil jsem"}
          </button>
        )}
      </div>

      {/* „Zrušeno?" — u potvrzeného sponzora; přesune mezi odmítnuté (info zůstane) */}
      <Modal open={askCancel} onClose={() => setAskCancel(false)} title="Opravdu zrušeno?">
        <p className="text-sm text-ink-soft">
          Opravdu domluva se sponzorem <strong className="text-ink">{s.name}</strong> padla? Přesuneme ho mezi odmítnuté (info zůstane).
        </p>
        <div className="mt-4 flex items-center gap-2">
          <button
            className="btn-primary flex-1"
            onClick={() => {
              dispatch({ type: "updateSponsor", yearId, sponsorId: s.id, patch: { status: "odmitl" } });
              setAskCancel(false);
              flash(`${s.name} spadl mezi odmítnuté`, "👎");
            }}
          >
            Ano, zrušeno
          </button>
          <button className="btn-ghost" onClick={() => setAskCancel(false)}>
            Ne
          </button>
        </div>
      </Modal>

      {/* „Jak jsi oslovil?" — vyskočí po kliknutí na „Oslovil jsem". Víc voleb naráz. */}
      <Modal open={askContact} onClose={closeContact} title={`Jak jsi oslovil ${s.name}?`}>
        <p className="text-sm text-ink-soft">
          Zaškrtni všechny způsoby, kterými jsi ho oslovil — klidně víc (třeba mail, pak telefon, nakonec osobně).
        </p>
        <div className="mt-4 grid gap-2">
          {(Object.keys(VIA) as ContactVia[]).map((v) => {
            const on = !!s.contactedVia?.includes(v);
            return (
              <button
                key={v}
                onClick={() => toggleVia(v)}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left text-[15px] font-medium ring-1 transition ${
                  on ? "bg-gold-50 ring-gold-400" : "ring-ink/10 hover:bg-ink/5"
                }`}
              >
                <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-md text-xs font-bold ${on ? "bg-gold-500 text-white" : "ring-1 ring-ink/25"}`}>
                  {on ? "✓" : ""}
                </span>
                <span className="text-xl">{VIA[v].emoji}</span>
                {VIA[v].label}
              </button>
            );
          })}
        </div>
        <button onClick={closeContact} className="btn-primary mt-4 w-full justify-center">
          Hotovo
        </button>
        {contacted && (
          <button
            onClick={revertContact}
            className="mt-2 w-full rounded-xl px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-500/5"
          >
            ↩︎ Ještě jsem neoslovil (vrátit zpět)
          </button>
        )}
      </Modal>
    </li>
  );
}
