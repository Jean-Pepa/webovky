"use client";

import { useEffect, useMemo, useState } from "react";
import { PageTitle } from "@/components/PageTitle";
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
import { ImageViewer } from "@/components/ImageViewer";
import { loadReceipt } from "@/lib/receipts";
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
  const [view, setView] = useState<"domu" | "zony" | "material">("domu"); // spodní podlišta výzdoby

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
    <div className="space-y-6 pb-24 md:pb-6">
      {canEditCurrentYear && !canEdit && (
        <ReadOnlyBanner>Výzdobu máš jen k náhledu — upravovat ji může jen správce a příslušná role.</ReadOnlyBanner>
      )}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <PageTitle>Výzdoba</PageTitle>
        {/* Přepínač (desktop) — na mobilu je dole ve svítící zlaté liště */}
        <div className="hidden gap-1.5 md:flex">
          {VYZDOBA_TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setView(t.id)}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition ${
                view === t.id ? "bg-gold-grad text-[#1d1d1f] shadow-sm" : "bg-paper2 text-ink-soft hover:bg-gold-100"
              }`}
            >
              {t.emoji} {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Domů — pravidla, plánek a hlasování týmu */}
      {view === "domu" && (
        <>
          <RulesCard year={year} canEdit={isLead} />
          <PlanCard year={year} canEdit={isLead} />
          <TeamVoting year={year} canEdit={canEdit} me={me} />
        </>
      )}

      {/* Zóny */}
      {view === "zony" && <ZonesSection year={year} canEdit={canEdit} isLead={isLead} me={me} />}

      {/* Materiál a nápady */}
      {view === "material" && (
      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="eyebrow">Materiál a nápady</h2>
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
          <div className="empty-state">
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
      )}

      {/* Spodní podlišta výzdoby (mobil) — Zóny · Domů · Materiál */}
      <div className="fixed inset-x-3 bottom-[calc(5.1rem+env(safe-area-inset-bottom))] z-40 md:hidden">
        <div className="mx-auto max-w-3xl">
          <div className="drop-in-bounce grid grid-cols-3 gap-1 rounded-[28px] border-2 border-gold-500 bg-paper/95 p-1.5 shadow-lg backdrop-blur">
            {VYZDOBA_TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setView(t.id)}
                className={`flex min-h-12 flex-col items-center justify-center rounded-[22px] px-0.5 text-[11px] font-semibold leading-tight transition ${
                  view === t.id ? "bg-gold-100 text-ink" : "text-ink-soft active:scale-[0.97]"
                }`}
              >
                <span className="text-base leading-none">{t.emoji}</span>
                <span className="mt-0.5 text-center">{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// 3 pohledy výzdoby (svítící podlišta) — domů (přehled) je uprostřed.
const VYZDOBA_TABS: { id: "zony" | "domu" | "material"; emoji: string; label: string }[] = [
  { id: "zony", emoji: "📍", label: "Zóny" },
  { id: "domu", emoji: "🏠", label: "Domů" },
  { id: "material", emoji: "🎨", label: "Materiál" },
];

// Text pravidel = hlavní text (běžné řádky) + odrážky (řádky s „-"). Rozdělíme
// je na dvě části, ať se dají upravovat i zobrazovat samostatně.
function parseRules(text: string): { main: string; bullets: string[] } {
  const lines = text.split("\n").map((l) => l.trim());
  const main = lines.filter((l) => l && !/^[-–—•]/.test(l)).join("\n");
  const bullets = lines.filter((l) => /^[-–—•]/.test(l)).map((l) => l.replace(/^[-–—•]\s*/, "").trim()).filter(Boolean);
  return { main, bullets };
}
// Zpět do jednoho textu: hlavní text + každá odrážka na řádku s „- ".
function serializeRules(main: string, bullets: string[]): string {
  const parts = [main.trim(), ...bullets.map((b) => b.trim()).filter(Boolean).map((b) => `- ${b}`)];
  return parts.filter(Boolean).join("\n");
}

// Přehledně naformátovaná pravidla — hlavní text nahoře, pod ním odrážky.
function RulesView({ text }: { text: string }) {
  const { main, bullets } = parseRules(text);
  return (
    <div className="space-y-4">
      {main && <p className="whitespace-pre-wrap text-[15px] font-medium leading-relaxed text-ink">{main}</p>}
      {bullets.length > 0 && (
        <ul className="space-y-2">
          {bullets.map((b, i) => (
            <li key={i} className="flex gap-2.5 rounded-xl bg-paper2/50 px-3.5 py-2.5 text-[15px] leading-relaxed text-ink-soft">
              <span aria-hidden className="mt-0.5 shrink-0 text-lg font-bold leading-none text-gold-600">•</span>
              <span className="min-w-0">{b}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Pravidla — hlavní text je vidět rovnou na kartě ve zvýrazněné bublině, která
// bliká červeně, dokud si ho člověk nepřečte (neklikne na „Přečíst pravidla").
// Ve velkém okně se pak ukážou i všechny odrážky. Úpravy: hlavní text zvlášť +
// odrážky se přidávají po jedné tlačítkem „+ přidat odrážku".
function RulesCard({ year, canEdit }: { year: Year; canEdit: boolean }) {
  const { dispatch } = useStore();
  const [edit, setEdit] = useState(false);
  const [openRules, setOpenRules] = useState(false);
  const [mainText, setMainText] = useState("");
  const [bullets, setBullets] = useState<string[]>([]);
  const [seen, setSeen] = useState(true); // dokud nevíme (SSR), nebliká — pak upřesníme v efektu

  const rules = year.decorRules ?? "";
  const parsed = parseRules(rules);
  const seenKey = `marena_vyzdoba_rules_seen_${year.id}`;

  // Přečteno = v localStorage je uložený přesně tenhle text. Když se pravidla
  // změní, bublina začne blikat znovu (uložený podpis se přestane shodovat).
  useEffect(() => {
    let val = true;
    try {
      val = localStorage.getItem(seenKey) === rules;
    } catch {
      val = true;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSeen(val);
  }, [seenKey, rules]);

  function markSeen() {
    try {
      localStorage.setItem(seenKey, rules);
    } catch {
      /* demo bez úložiště */
    }
    setSeen(true);
  }
  function startEdit() {
    const p = parseRules(year.decorRules ?? "");
    setMainText(p.main);
    setBullets(p.bullets);
    setEdit(true);
  }
  function saveEdit() {
    dispatch({ type: "setDecorRules", yearId: year.id, text: serializeRules(mainText, bullets) });
    setEdit(false);
    flash("Pravidla uložena", "📋");
  }

  if (!canEdit && !rules) return null;
  return (
    <section className="card p-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="eyebrow">Pravidla</h2>
        {canEdit && !edit && (
          <button className="btn-ghost px-2 py-1 text-xs" onClick={startEdit}>
            {rules ? "Upravit" : "+ Přidat"}
          </button>
        )}
      </div>

      {edit ? (
        <div className="mt-2 space-y-4">
          <div className="space-y-1.5">
            <label className="block eyebrow">Hlavní text</label>
            <textarea
              className="input min-h-24"
              value={mainText}
              onChange={(e) => setMainText(e.target.value)}
              placeholder="Hlavní text pravidel — co je důležité vědět, než se začne tvořit…"
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <label className="block eyebrow">Odrážky</label>
            {bullets.map((b, i) => (
              <div key={i} className="flex items-center gap-2">
                <span aria-hidden className="shrink-0 text-lg font-bold leading-none text-gold-600">•</span>
                <input
                  className="input"
                  value={b}
                  onChange={(e) => setBullets((arr) => arr.map((x, j) => (j === i ? e.target.value : x)))}
                  placeholder={`Odrážka ${i + 1}`}
                />
                <button className="btn-ghost shrink-0 px-2" aria-label="Odebrat odrážku" onClick={() => setBullets((arr) => arr.filter((_, j) => j !== i))}>
                  ✕
                </button>
              </div>
            ))}
            <button
              className="inline-flex items-center gap-1 rounded-lg border border-dashed border-gold-500/60 bg-gold-50 px-3 py-1.5 text-xs font-semibold text-gold-700 transition hover:bg-gold-100"
              onClick={() => setBullets((arr) => [...arr, ""])}
            >
              + přidat odrážku
            </button>
          </div>
          <div className="flex gap-2">
            <button className="btn-primary py-2 text-sm" onClick={saveEdit}>Uložit</button>
            <button className="btn-ghost py-2 text-sm" onClick={() => setEdit(false)}>Zrušit</button>
          </div>
        </div>
      ) : rules ? (
        <div className="mt-2 space-y-3">
          {/* Hlavní text ve zvýrazněné bublině — bliká červeně, dokud se nepřečte */}
          <div className={`rounded-2xl border-2 bg-paper2/50 p-4 ${seen ? "border-transparent" : "readonly-pulse border-red-500"}`}>
            <p className="whitespace-pre-wrap text-[15px] font-medium leading-relaxed text-ink">
              {parsed.main || "Přečti si prosím pravidla výzdoby, než začneš tvořit."}
            </p>
          </div>
          <button className="btn-primary w-full py-2.5 text-sm" onClick={() => { markSeen(); setOpenRules(true); }}>
            📖 Přečíst pravidla
          </button>
        </div>
      ) : (
        <p className="mt-2 text-sm text-ink-soft/70">Zatím žádná pravidla.</p>
      )}

      <Modal open={openRules} onClose={() => setOpenRules(false)} title="📋 Pravidla výzdoby">
        <div className="space-y-4">
          {rules ? <RulesView text={rules} /> : <p className="text-sm text-ink-soft">Zatím žádná pravidla.</p>}
          <button className="btn-primary w-full py-2.5" onClick={() => setOpenRules(false)}>
            Zavřít
          </button>
        </div>
      </Modal>
    </section>
  );
}

// Plánky velké a na celou šířku (celý obrázek, ne oříznutý) — klik zvětší na fullscreen.
function PlanImages({ ids }: { ids: string[] }) {
  const { configured } = useStore();
  const [urls, setUrls] = useState<Record<string, string>>({});
  const [viewIdx, setViewIdx] = useState<number | null>(null);
  useEffect(() => {
    let alive = true;
    (async () => {
      for (const id of ids) {
        const u = await loadReceipt(id, configured);
        if (alive && u) setUrls((p) => (p[id] ? p : { ...p, [id]: u }));
      }
    })();
    return () => {
      alive = false;
    };
  }, [ids, configured]);
  const ready = ids.filter((id) => urls[id]).map((id) => urls[id]);
  if (!ready.length) return <p className="text-sm text-ink-soft">Zatím žádný plánek.</p>;
  return (
    <div className="space-y-3">
      {ready.map((u, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={i} src={u} alt="plánek zón" onClick={() => setViewIdx(i)} className="w-full cursor-zoom-in rounded-xl object-contain ring-1 ring-ink/10" />
      ))}
      <ImageViewer images={ready} index={viewIdx} onIndex={setViewIdx} title="Plánek zón" />
    </div>
  );
}

// Plánek — čistá karta s tlačítkem, plánky se ukážou velké ve středovém okně.
function PlanCard({ year, canEdit }: { year: Year; canEdit: boolean }) {
  const { dispatch } = useStore();
  const [open, setOpen] = useState(false); // okno prohlídky
  const [manage, setManage] = useState(false); // režim úprav (nahrání/popis)
  const [editDesc, setEditDesc] = useState(false);
  const [text, setText] = useState(year.decorPlanDesc ?? "");
  const ids = year.decorPlanIds ?? [];
  const desc = year.decorPlanDesc;
  const hasContent = ids.length > 0 || !!desc;
  if (!canEdit && !hasContent) return null;
  return (
    <section className="card p-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="eyebrow">Plánek zón</h2>
        {canEdit && (
          <button className="btn-ghost px-2 py-1 text-xs" onClick={() => setManage((v) => !v)}>
            {manage ? "Hotovo" : "Upravit"}
          </button>
        )}
      </div>
      <p className="mt-0.5 text-xs text-ink-soft">Fotka prostoru s rozdělením na zóny.</p>

      {manage && canEdit ? (
        <div className="mt-2 space-y-3">
          <ImageBoard
            ids={ids}
            canEdit
            addLabel="Přidat plánek"
            thumb="h-28 w-28"
            onChange={(next) => dispatch({ type: "setDecorPlan", yearId: year.id, ids: next })}
          />
          {editDesc ? (
            <div className="space-y-2">
              <textarea className="input min-h-20" value={text} onChange={(e) => setText(e.target.value)} placeholder="Popis plánku — jak jsou zóny rozdělené…" autoFocus />
              <div className="flex gap-2">
                <button className="btn-primary py-1.5 text-xs" onClick={() => { dispatch({ type: "setDecorPlanDesc", yearId: year.id, text }); setEditDesc(false); flash("Popis plánku uložen", "🗺️"); }}>
                  Uložit popis
                </button>
                <button className="btn-ghost py-1.5 text-xs" onClick={() => { setText(desc ?? ""); setEditDesc(false); }}>Zrušit</button>
              </div>
            </div>
          ) : desc ? (
            <p className="whitespace-pre-wrap rounded-lg bg-paper2/50 px-3 py-2 text-sm text-ink-soft cursor-pointer hover:text-ink" onClick={() => { setText(desc); setEditDesc(true); }}>
              {desc}
            </p>
          ) : (
            <button
              className="inline-flex items-center gap-1 rounded-lg border border-dashed border-gold-500/60 bg-gold-50 px-3 py-2 text-sm font-semibold text-gold-700 transition hover:bg-gold-100"
              onClick={() => { setText(""); setEditDesc(true); }}
            >
              ✍️ Přidat popis
            </button>
          )}
        </div>
      ) : hasContent ? (
        <button className="btn-primary mt-2 w-full py-2.5 text-sm" onClick={() => setOpen(true)}>
          🗺️ Prohlédnout plánek
        </button>
      ) : (
        <p className="mt-2 text-sm text-ink-soft/70">Zatím žádný plánek.</p>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="🗺️ Plánek zón">
        <div className="space-y-4">
          <PlanImages ids={ids} />
          {desc && <p className="readonly-pulse whitespace-pre-wrap rounded-lg border-2 border-red-500 bg-paper2/50 px-3 py-2 text-sm text-ink-soft">{desc}</p>}
          <button className="btn-primary w-full py-2.5" onClick={() => setOpen(false)}>
            Zavřít
          </button>
        </div>
      </Modal>
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
  const [openZoneId, setOpenZoneId] = useState<string | null>(null); // otevřená zóna v okně
  const zones = year.decorZones ?? [];
  // Seřazené podle názvu (A-1, A-1-2-3, B-1…) — přehlednější než pořadí přidání.
  const sorted = [...zones].sort((a, b) => a.name.localeCompare(b.name, "cs"));
  const openZone = zones.find((z) => z.id === openZoneId);
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
        <h2 className="eyebrow">Zóny</h2>
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
        <div className="empty-state">
          Zatím žádné zóny.
        </div>
      ) : (
        <div className="card divide-y divide-ink/10 overflow-hidden">
          {sorted.map((z) => (
            <ZoneTile key={z.id} zone={z} year={year} me={me} onClick={() => setOpenZoneId(z.id)} />
          ))}
        </div>
      )}

      {/* Detail zóny v okně na střed */}
      <Modal open={!!openZone} onClose={() => setOpenZoneId(null)} title={openZone ? `📍 ${openZone.name}` : ""}>
        {openZone && (
          <ZoneDetail key={openZone.id} zone={openZone} year={year} canEdit={canEdit} isLead={isLead} me={me} onClose={() => setOpenZoneId(null)} />
        )}
      </Modal>
    </section>
  );
}

// Řádek zóny v editorialním seznamu (vlasové linky) — klik otevře detail v okně.
function ZoneTile({ zone, year, me, onClick }: { zone: DecorZone; year: Year; me: string; onClick: () => void }) {
  const iAmIn = zone.members.some((m) => sameName(m, me));
  const zoneTasks = year.tasks.filter((t) => t.zoneId === zone.id);
  const done = zoneTasks.filter((t) => t.done).length;
  const total = zoneTasks.length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  const empty = zone.members.length === 0;
  return (
    <button onClick={onClick} className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition hover:bg-paper2/50">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="min-w-0 break-words font-display text-[15px] font-semibold leading-snug">{zone.name}</span>
          {iAmIn && <span className="rounded-full bg-leaf/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-leaf-700">jsi tu</span>}
          {empty && <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-red-600">volná</span>}
        </div>
        <div className="mt-0.5 flex items-center gap-3 text-xs tabular-nums text-ink-soft">
          <span>{zone.members.length} v týmu</span>
          {total > 0 && <span className={done === total ? "font-semibold text-leaf-700" : ""}>{done}/{total} úkolů</span>}
        </div>
      </div>
      {total > 0 && (
        <div className="hidden h-1 w-16 shrink-0 overflow-hidden rounded-full bg-paper2 sm:block">
          <div className="h-full rounded-full bg-leaf transition-all" style={{ width: `${pct}%` }} />
        </div>
      )}
      <span aria-hidden className="shrink-0 text-lg leading-none text-ink-soft/40">›</span>
    </button>
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

  // Hlasování výzdoby je jen pro výzdobáře (a správce/vedoucího) — kdo nesmí
  // upravovat výzdobu, sekci vůbec nevidí.
  if (!canEdit) return null;

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="eyebrow">Hlasování týmu</h2>
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
        <div className="empty-state">
          Zatím žádné hlasování.
        </div>
      ) : (
        <div className="space-y-2.5">
          {polls.map((p) => {
            const closed = isPollClosed(p);
            const voted = p.options.some((o) => o.voters.some((v) => sameName(v, me)));
            const votes = new Set(p.options.flatMap((o) => o.voters)).size;
            // Nové (ještě neodhlasované a otevřené) → celé okénko bliká, ať ho nejde přehlédnout.
            const isNew = !voted && !closed;
            return (
              <div
                key={p.id}
                className={`flex flex-wrap items-center gap-3 rounded-2xl border p-4 ${
                  closed
                    ? "border-ink/10 bg-surface opacity-90"
                    : voted
                      ? "border-leaf/45 bg-leaf/[0.06]"
                      : "pending-glow border-2 border-gold-500 bg-gold-50"
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {isNew && <span className="shrink-0 rounded-full bg-gold-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#1d1d1f]">🆕 nové</span>}
                    <p className="min-w-0 break-words font-semibold">🗳️ {p.question}</p>
                  </div>
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
                  <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-leaf/50 bg-leaf/15 px-3.5 py-2 text-xs font-bold text-leaf-700">
                    ✅ Hlasoval jsi
                  </span>
                ) : (
                  <Link href={`/zazemi/hlasovani?poll=${p.id}`} className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-gold-500 px-4 py-2.5 text-sm font-bold text-[#1d1d1f] shadow-sm transition hover:bg-gold-400">
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
    <p className="eyebrow flex items-center gap-1.5">
      <span aria-hidden>{icon}</span>
      {children}
      {count && <span className="text-ink-soft/60">{count}</span>}
    </p>
  );
}

// Jedna zóna — sbalitelná karta. Sbaleno = přehled (lidi, postup úkolů,
// materiál); rozbaleno = kdo spravuje, referenční obrázek + popis, úkoly zóny
// (svítí členům v Moje agenda) a přiřazený materiál. Moje zóny jsou rozbalené.
function ZoneDetail({ zone, year, canEdit, isLead, me, onClose }: { zone: DecorZone; year: Year; canEdit: boolean; isLead: boolean; me: string; onClose: () => void }) {
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
    <div className="space-y-4">
      {/* Stav zóny */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-soft">
        {iAmIn && <span className="rounded-full bg-leaf px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">jsi tu</span>}
        {empty && <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-red-600">volná</span>}
        <span>👥 {zone.members.length}</span>
        {total > 0 && <span className={done === total ? "font-semibold text-leaf-700" : ""}>✅ {done}/{total} úkolů</span>}
        {zoneMaterial.length > 0 && <span>🎨 {zoneMaterial.length}× materiál</span>}
      </div>
      {total > 0 && (
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-paper2">
          <div className="h-full rounded-full bg-leaf transition-all" style={{ width: `${pct}%` }} />
        </div>
      )}
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

      <button className="btn-primary w-full py-2.5" onClick={onClose}>
        Zavřít
      </button>
    </div>
  );
}

function DecorRow({ d, yearId, canEdit, admin, zones, myZones }: { d: Decor; yearId: string; canEdit: boolean; admin?: boolean; zones: DecorZone[]; myZones: DecorZone[] }) {
  const { dispatch, me } = useStore();
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
  // „Chci shánět": nápad → shání se. Když ještě není určeno, kdo shání,
  // zapíše se jméno toho, kdo tlačítko zmáčkl.
  function startShani() {
    if (!canEdit || locked) return;
    const takeOver = !d.who?.trim();
    dispatch({ type: "updateDecor", yearId, decorId: d.id, patch: { status: "shani", ...(takeOver ? { who: me } : {}) } });
    flash(takeOver ? `Sháníš to ty — ${me} 🛒` : "Shání se 🛒", "🛒");
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
      {/* Horní řádek: stav + viditelná akce vlevo, úpravy/smazání vpravo */}
      <div className="flex flex-wrap items-center gap-2">
        <span className={`badge shrink-0 ${STATUS[d.status].cls}`}>
          {STATUS[d.status].label}
          {locked ? " 🔒" : ""}
        </span>

        {/* Viditelná akce podle stavu: nápad → chci shánět → sehnal jsem (hotovo) */}
        {canEdit && !locked && d.status === "napad" && (
          <button
            className="btn-pill btn-pill-gold"
            onClick={startShani}
          >
            🛒 Chci shánět
          </button>
        )}
        {canEdit && !locked && d.status === "shani" && (
          <button
            className="btn-pill btn-pill-leaf"
            onClick={() => setAskDone(true)}
          >
            ✅ Sehnal jsem
          </button>
        )}

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
