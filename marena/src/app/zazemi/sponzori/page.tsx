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
                  className={`rounded-full px-3 py-1 text-xs font-medium transition ${filter === f.id ? "bg-ink text-white" : "bg-paper2 text-ink-soft hover:bg-ink/5"}`}
                >
                  {f.label} <span className="opacity-70">{n}</span>
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
  const { dispatch, me } = useStore();
  const [edit, setEdit] = useState(false);
  const [askCancel, setAskCancel] = useState(false); // potvrzení „Zrušeno?"
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

  // Stavové akce jako u Programu: „Osloveno?" (oslovit ↔ čeká) + domluva ano/ne
  // (čeká → potvrzeno / odmítl). Po rozhodnutí zamčeno — mění jen správce.
  const admin = isAdmin(me);
  const contacted = s.status !== "oslovit";
  const confirmed = s.status === "potvrzeno";
  const decided = confirmed || s.status === "odmitl";
  // Potvrzené je zamčené i pro správce — překlikne se jen přes „Zrušeno?".
  const lockContact = confirmed || (decided && !admin);
  const lockDecide = s.status === "odmitl" && !admin;
  const setStatus = (status: SponsorStatus) => canEdit && dispatch({ type: "updateSponsor", yearId, sponsorId: s.id, patch: { status } });

  return (
    <li className={`card p-3 ${s.status === "potvrzeno" ? "bg-leaf/[0.05]" : s.status === "odmitl" ? "bg-red-500/[0.04]" : ""}`}>
      {/* Jméno + odznaky + odkaz */}
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <p className="break-words font-medium">{s.name}</p>
        {s.returning && <span className="rounded-full bg-plum-600/10 px-2 py-0.5 text-[11px] font-medium text-plum-700">🔁 stálý</span>}
        {s.category && (
          <span className="rounded-full bg-paper2 px-2 py-0.5 text-[11px] font-medium text-ink-soft">
            {CAT[s.category].emoji} {CAT[s.category].label}
          </span>
        )}
        {linksOf(s).map((l, i, arr) => (
          <a key={i} href={hrefOf(l)} target="_blank" rel="noreferrer" className="break-all text-xs font-medium text-gold-700 hover:underline">
            🔗 odkaz{arr.length > 1 ? ` ${i + 1}` : ""} ↗
          </a>
        ))}
      </div>

      {/* Co dává + kdo řeší + poznámka */}
      {s.gives && <p className="mt-1 break-words text-sm text-leaf-700">🎁 dává: {s.gives}</p>}
      {(s.who || s.note) && (
        <div className="mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-ink-soft">
          {s.who && <span>👤 {s.who}</span>}
          {s.note && <span className="break-words">📝 {s.note}</span>}
        </div>
      )}

      {/* Stavová tlačítka (jako Program): Osloveno + domluva ano/ne */}
      <div className="mt-2 flex flex-wrap items-center gap-2">
        {/* „Neosloveno" je jen štítek stavu — oslovení se dělá výrazným tlačítkem
            „Oslovil jsem" vedle. Klikací (pro vrácení zpět) je až zelené „Osloveno ✓". */}
        {canEdit && contacted ? (
          <button
            disabled={lockContact}
            onClick={() => setStatus("oslovit")}
            title={lockContact ? "Rozhodnuto — změnit může jen správce" : undefined}
            className={`rounded-full px-2.5 py-1 text-xs font-medium transition bg-leaf/15 text-leaf-700 hover:bg-leaf/25 ${
              lockContact ? "cursor-not-allowed opacity-60 hover:bg-leaf/15" : ""
            }`}
          >
            Osloveno ✓
          </button>
        ) : (
          <span className={`badge ${contacted ? "badge-done" : "badge-idle"}`}>
            {contacted ? "Osloveno ✓" : "Neosloveno"}
          </span>
        )}

        {/* Výrazné tlačítko „Oslovil jsem" — mezi stavem a Upravit/Smazat, dokud není osloveno */}
        {canEdit && !contacted && (
          <button
            onClick={() => { setStatus("ceka"); flash(`${s.name} — osloveno`, "✉️"); }}
            className="btn-pill btn-pill-gold"
          >
            ✉️ Oslovil jsem
          </button>
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
    </li>
  );
}
