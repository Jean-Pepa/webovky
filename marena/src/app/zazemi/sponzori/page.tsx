"use client";

import { useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { useStore } from "@/lib/store";
import { DeleteButton } from "@/components/DeleteButton";
import { SearchBox } from "@/components/SearchBox";
import { matchesQuery } from "@/lib/search";
import { flash } from "@/components/Flash";
import type { Sponsor, SponsorStatus, SponsorCategory } from "@/lib/types";

// Editor více odkazů / kontaktů — tlačítko „+" přidá další pole, „✕" ho odebere.
function LinksEditor({ links, setLinks }: { links: string[]; setLinks: Dispatch<SetStateAction<string[]>> }) {
  return (
    <div className="space-y-2">
      {links.map((l, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            className="input"
            placeholder="Odkaz / kontakt"
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

const STATUS: Record<SponsorStatus, { label: string; cls: string }> = {
  oslovit: { label: "📋 oslovit", cls: "bg-paper2 text-ink-soft" },
  ceka: { label: "⏳ čeká", cls: "bg-marigold-600/12 text-marigold-700" },
  potvrzeno: { label: "✅ potvrzeno", cls: "bg-leaf/15 text-leaf-700" },
  odmitl: { label: "✖️ odmítl", cls: "bg-red-500/10 text-red-600" },
};
const NEXT: Record<SponsorStatus, SponsorStatus> = { oslovit: "ceka", ceka: "potvrzeno", potvrzeno: "odmitl", odmitl: "oslovit" };
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
const hrefOf = (l: string) => (l.startsWith("http") ? l : `https://${l}`);

export default function SponzoriPage() {
  const { currentYear, dispatch, canEditCurrentYear } = useStore();
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
  const canEdit = canEditCurrentYear;

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
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Sponzoři ✨</h1>
          <p className="mt-0.5 text-sm text-ink-soft">Koho oslovit, co dává a jak domluva stojí. Klikni na stav: oslovit → čeká → potvrzeno → odmítl.</p>
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
          <input className="input" placeholder="Kdo to řeší" value={who} onChange={(e) => setWho(e.target.value)} />
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
                  className={`rounded-full px-3 py-1 text-xs font-medium transition ${category === c.id ? "bg-marigold-600 text-white" : "bg-paper2 text-ink-soft hover:bg-black/5"}`}
                >
                  {c.emoji} {c.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-1 text-xs font-medium text-ink-soft">Typ sponzora</p>
            <div className="inline-flex rounded-full bg-paper2 p-0.5 text-xs">
              <button type="button" onClick={() => setReturning(false)} className={`rounded-full px-3 py-1 font-medium transition ${!returning ? "bg-white text-ink shadow-sm" : "text-ink-soft"}`}>
                🆕 Nový
              </button>
              <button type="button" onClick={() => setReturning(true)} className={`rounded-full px-3 py-1 font-medium transition ${returning ? "bg-white text-ink shadow-sm" : "text-ink-soft"}`}>
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
          <p className="text-sm text-ink-soft">
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
                  className={`rounded-full px-3 py-1 text-xs font-medium transition ${filter === f.id ? "bg-ink text-white" : "bg-paper2 text-ink-soft hover:bg-black/5"}`}
                >
                  {f.label} <span className="opacity-70">{n}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {sponsors.length === 0 ? (
        <div className="card grid place-items-center p-10 text-center text-sm text-ink-soft">
          {canEdit ? "Zatím žádní sponzoři. Přidej prvního nahoře." : "Zatím žádní sponzoři."}
        </div>
      ) : list.length === 0 ? (
        <div className="card grid place-items-center p-8 text-center text-sm text-ink-soft">V tomhle filtru nikdo není.</div>
      ) : (
        <ul className="space-y-2">
          {list.map((s) => (
            <SponsorRow key={s.id} s={s} yearId={year.id} canEdit={canEdit} />
          ))}
        </ul>
      )}
    </div>
  );
}

function SponsorRow({ s, yearId, canEdit }: { s: Sponsor; yearId: string; canEdit: boolean }) {
  const { dispatch } = useStore();
  const [edit, setEdit] = useState(false);
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
        <input className="input" value={who} onChange={(e) => setWho(e.target.value)} placeholder="Kdo to řeší" />
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
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${category === c.id ? "bg-marigold-600 text-white" : "bg-paper2 text-ink-soft hover:bg-black/5"}`}
              >
                {c.emoji} {c.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-1 text-xs font-medium text-ink-soft">Typ sponzora</p>
          <div className="inline-flex rounded-full bg-paper2 p-0.5 text-xs">
            <button type="button" onClick={() => setReturning(false)} className={`rounded-full px-3 py-1 font-medium transition ${!returning ? "bg-white text-ink shadow-sm" : "text-ink-soft"}`}>
              🆕 Nový
            </button>
            <button type="button" onClick={() => setReturning(true)} className={`rounded-full px-3 py-1 font-medium transition ${returning ? "bg-white text-ink shadow-sm" : "text-ink-soft"}`}>
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

  return (
    <li className="card flex items-start gap-3 p-3">
      <button
        onClick={() => canEdit && dispatch({ type: "updateSponsor", yearId, sponsorId: s.id, patch: { status: NEXT[s.status] } })}
        disabled={!canEdit}
        className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium transition ${STATUS[s.status].cls} ${canEdit ? "hover:opacity-80" : ""}`}
        title={canEdit ? "Klikni pro změnu stavu" : undefined}
      >
        {STATUS[s.status].label}
      </button>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <p className="break-words font-medium">{s.name}</p>
          {s.returning && <span className="rounded-full bg-plum-600/10 px-2 py-0.5 text-[11px] font-medium text-plum-700">🔁 stálý</span>}
          {s.category && (
            <span className="rounded-full bg-paper2 px-2 py-0.5 text-[11px] font-medium text-ink-soft">
              {CAT[s.category].emoji} {CAT[s.category].label}
            </span>
          )}
        </div>
        {s.gives && <p className="break-words text-sm text-leaf-700">dává: {s.gives}</p>}
        <div className="mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-ink-soft">
          {s.who && <span>👤 {s.who}</span>}
          {linksOf(s).map((l, i, arr) => (
            <a key={i} href={hrefOf(l)} target="_blank" rel="noreferrer" className="break-all text-marigold-700 hover:underline">
              🔗 odkaz{arr.length > 1 ? ` ${i + 1}` : ""}
            </a>
          ))}
          {s.note && <span className="break-words">📝 {s.note}</span>}
        </div>
      </div>
      {canEdit && (
        <div className="flex shrink-0 items-center gap-1">
          <button className="btn-ghost px-2 py-1 text-xs" onClick={() => setEdit(true)}>
            Upravit
          </button>
          <DeleteButton onConfirm={() => dispatch({ type: "removeSponsor", yearId, sponsorId: s.id })} />
        </div>
      )}
    </li>
  );
}
