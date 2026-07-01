"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { isAdmin } from "@/lib/admin";
import { Icon } from "@/components/Icons";
import { Collapsible } from "@/components/Collapsible";
import {
  type Lang,
  LANGS,
  STRINGS,
  LINEUP_MEDIA,
  DEFAULT_PHOTOS,
  THEMES,
  type ThemeId,
  themeOf,
  type HomeContent,
  type HomeText,
  type HomeNews,
  loadLocalHomepage,
  saveLocalHomepage,
} from "@/lib/homepage";

// Textová pole s jedním řádkem / delším textem, seskupená podle sekcí webu.
type ScalarKey =
  | "heroKicker" | "heroTagline" | "heroBadge" | "ctaInsta" | "ctaScroll" | "merchCta"
  | "whatsKicker" | "whatsTitle" | "whatsIntro"
  | "finaleBadge" | "finaleTitle" | "finaleText"
  | "band" | "stepsTitle" | "newsTitle" | "instaTitle" | "instaText" | "footerTagline";

const GROUPS: { title: string; emoji: string; fields: { key: ScalarKey; label: string; area?: boolean }[]; hasLineup?: boolean; hasSteps?: boolean }[] = [
  {
    title: "Hero (úvodní obrazovka)", emoji: "🎬",
    fields: [
      { key: "heroKicker", label: "Nadřádek (malý text nahoře)" },
      { key: "heroTagline", label: "Hlavní věta pod nápisem MAŘENA", area: true },
      { key: "heroBadge", label: "Oranžový odznak pro prváky" },
      { key: "ctaInsta", label: "Tlačítko — Instagram" },
      { key: "ctaScroll", label: "Tlačítko — „co tě čeká“" },
      { key: "merchCta", label: "Velké tlačítko — merch" },
    ],
  },
  {
    title: "Co tě čeká", emoji: "✨",
    fields: [
      { key: "whatsKicker", label: "Nadřádek" },
      { key: "whatsTitle", label: "Nadpis sekce" },
      { key: "whatsIntro", label: "Úvodní odstavec", area: true },
    ],
    hasLineup: true,
  },
  {
    title: "Finále — Fléda", emoji: "⭐",
    fields: [
      { key: "finaleBadge", label: "Odznak" },
      { key: "finaleTitle", label: "Nadpis" },
      { key: "finaleText", label: "Text", area: true },
    ],
  },
  {
    title: "Velký nápis MAŘENA", emoji: "🏛️",
    fields: [{ key: "band", label: "Text přes fotku", area: true }],
  },
  {
    title: "Jak týden probíhá", emoji: "🗓️",
    fields: [{ key: "stepsTitle", label: "Nadpis sekce" }],
    hasSteps: true,
  },
  {
    title: "Instagram blok", emoji: "📸",
    fields: [
      { key: "instaTitle", label: "Nadpis" },
      { key: "instaText", label: "Text", area: true },
    ],
  },
  {
    title: "Patička", emoji: "🔻",
    fields: [{ key: "footerTagline", label: "Text patičky", area: true }],
  },
  {
    title: "Novinky — nadpis sekce", emoji: "📰",
    fields: [{ key: "newsTitle", label: "Nadpis nad novinkami" }],
  },
];

const LANG_LABEL: Record<Lang, string> = { cs: "🇨🇿 Čeština", en: "🇬🇧 English", de: "🇩🇪 Deutsch" };

export default function WebEditorPage() {
  const { me } = useStore();
  const [lang, setLang] = useState<Lang>("cs");
  const [c, setC] = useState<HomeContent>({});
  const [loaded, setLoaded] = useState(false);
  const [status, setStatus] = useState<null | "saving" | "saved" | "local">(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/homepage", { cache: "no-store" })
      .then((r) => r.json())
      .then((d: { content?: HomeContent | null }) => {
        if (!alive) return;
        setC(d.content ?? loadLocalHomepage() ?? {});
        setLoaded(true);
      })
      .catch(() => {
        if (!alive) return;
        setC(loadLocalHomepage() ?? {});
        setLoaded(true);
      });
    return () => {
      alive = false;
    };
  }, []);

  if (!isAdmin(me)) {
    return (
      <div className="card p-6 text-center">
        <p className="text-lg font-semibold">🔒 Jen pro správce</p>
        <p className="mt-1 text-sm text-ink-soft">Správu webu může upravovat jen správce (Mařena).</p>
      </div>
    );
  }

  const tx: HomeText = c.text?.[lang] ?? {};

  function setText(key: ScalarKey, value: string) {
    setC((prev) => {
      const text = { ...(prev.text ?? {}) };
      text[lang] = { ...(text[lang] ?? {}), [key]: value };
      return { ...prev, text };
    });
  }
  function setLineupText(i: number, key: "title" | "text", value: string) {
    setC((prev) => {
      const text = { ...(prev.text ?? {}) };
      const cur = { ...(text[lang] ?? {}) };
      const arr = [...(cur.lineup ?? [])];
      arr[i] = { ...(arr[i] ?? {}), [key]: value };
      cur.lineup = arr;
      text[lang] = cur;
      return { ...prev, text };
    });
  }
  function setStepText(i: number, key: "day" | "text", value: string) {
    setC((prev) => {
      const text = { ...(prev.text ?? {}) };
      const cur = { ...(text[lang] ?? {}) };
      const arr = [...(cur.steps ?? [])];
      arr[i] = { ...(arr[i] ?? {}), [key]: value };
      cur.steps = arr;
      text[lang] = cur;
      return { ...prev, text };
    });
  }
  function setPhoto(key: "hero" | "finale" | "letters", value: string) {
    setC((prev) => ({ ...prev, photos: { ...(prev.photos ?? {}), [key]: value } }));
  }
  function setLineupPhoto(i: number, value: string) {
    setC((prev) => {
      const photos = { ...(prev.photos ?? {}) };
      const arr = [...(photos.lineup ?? [])];
      arr[i] = value;
      photos.lineup = arr;
      return { ...prev, photos };
    });
  }
  function setIg(key: "url" | "handle", value: string) {
    setC((prev) => ({ ...prev, ig: { ...(prev.ig ?? {}), [key]: value } }));
  }
  function setTheme(theme: ThemeId) {
    setC((prev) => ({ ...prev, theme }));
  }
  const activeTheme = themeOf(c);

  const news = c.news ?? [];
  const newId = () => `n${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
  function addNews() {
    setC((prev) => ({ ...prev, news: [{ id: newId(), title: "", text: "" }, ...(prev.news ?? [])] }));
  }
  function patchNews(id: string, patch: Partial<HomeNews>) {
    setC((prev) => ({ ...prev, news: (prev.news ?? []).map((n) => (n.id === id ? { ...n, ...patch } : n)) }));
  }
  function delNews(id: string) {
    setC((prev) => ({ ...prev, news: (prev.news ?? []).filter((n) => n.id !== id) }));
  }
  function moveNews(id: string, dir: -1 | 1) {
    setC((prev) => {
      const arr = [...(prev.news ?? [])];
      const i = arr.findIndex((n) => n.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= arr.length) return prev;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      return { ...prev, news: arr };
    });
  }

  async function save() {
    setStatus("saving");
    const payload: HomeContent = { ...c, updatedAt: new Date().toISOString(), updatedBy: me };
    // Vždy ulož do prohlížeče — pojistka proti ztrátě + okamžitý náhled webu tady.
    saveLocalHomepage(payload);
    let serverOk = false;
    try {
      const r = await fetch("/api/homepage", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      serverOk = r.ok;
    } catch {
      serverOk = false;
    }
    setC(payload);
    setStatus(serverOk ? "saved" : "local");
    setTimeout(() => setStatus(null), 4500);
  }

  if (!loaded) return <p className="text-sm text-ink-soft">Načítám obsah webu…</p>;

  return (
    <div className="space-y-5 pb-24">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Správa webu</h1>
          <p className="mt-0.5 text-sm text-ink-soft">
            Uprav texty, nadpisy, fotky a novinky na veřejné homepage. Prázdné pole = zůstane výchozí text.
          </p>
        </div>
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium text-ink-soft ring-1 ring-black/10 transition hover:bg-black/5"
        >
          <Icon name="globe" className="h-4 w-4" /> Otevřít web ↗
        </a>
      </div>

      {c.updatedAt && (
        <p className="text-xs text-ink-soft">
          Naposledy uloženo: {new Date(c.updatedAt).toLocaleString("cs")} {c.updatedBy ? `· ${c.updatedBy}` : ""}
        </p>
      )}

      {/* TÉMA WEBU — vzhled homepage (každý ročník může mít jiné) */}
      <section className="card p-4 sm:p-5">
        <h2 className="font-display text-lg font-semibold">🎨 Téma webu</h2>
        <p className="mb-3 mt-0.5 text-xs text-ink-soft">
          Vyber vzhled veřejné homepage. Texty, fotky i novinky zůstávají stejné — mění se jen styl. Ulož změny dole.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {THEMES.map((th) => {
            const on = activeTheme === th.id;
            return (
              <button
                key={th.id}
                type="button"
                onClick={() => setTheme(th.id)}
                className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition ${
                  on ? "border-marigold-500 bg-marigold-50 ring-2 ring-marigold-500/30" : "border-black/10 hover:bg-black/[0.03]"
                }`}
              >
                <span className="text-2xl">{th.emoji}</span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2 font-semibold">
                    {th.name}
                    {on && <span className="rounded-full bg-marigold-600 px-2 py-0.5 text-[11px] font-semibold text-white">Aktivní</span>}
                  </span>
                  <span className="mt-0.5 block text-xs text-ink-soft">{th.desc}</span>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* FOTKY — společné pro všechny jazyky (vlož odkaz na obrázek / URL) */}
      <Collapsible
        defaultOpen
        className="card p-4 sm:p-5"
        header={<span className="font-display text-lg font-semibold">📷 Fotky (společné pro všechny jazyky)</span>}
      >
        <p className="mb-3 mt-2 text-xs text-ink-soft">
          Vlož odkaz (URL) na obrázek — např. z hostingu nebo Instagramu. Prázdné = výchozí fotka.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <PhotoField label="Hero (velká fotka nahoře)" value={c.photos?.hero ?? ""} fallback={DEFAULT_PHOTOS.hero} onChange={(v) => setPhoto("hero", v)} />
          <PhotoField label="Finále (Fléda)" value={c.photos?.finale ?? ""} fallback={DEFAULT_PHOTOS.finale} onChange={(v) => setPhoto("finale", v)} />
          <PhotoField label="Velký nápis MAŘENA" value={c.photos?.letters ?? ""} fallback={DEFAULT_PHOTOS.letters} onChange={(v) => setPhoto("letters", v)} />
        </div>
        <p className="mb-2 mt-4 text-sm font-semibold">Fotky „Co tě čeká“ (6 dlaždic)</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {LINEUP_MEDIA.map((m, i) => (
            <PhotoField
              key={i}
              label={`Dlaždice ${i + 1}`}
              value={c.photos?.lineup?.[i] ?? ""}
              fallback={m.photo}
              onChange={(v) => setLineupPhoto(i, v)}
            />
          ))}
        </div>
      </Collapsible>

      {/* ODKAZ NA INSTAGRAM — společný */}
      <Collapsible
        className="card p-4 sm:p-5"
        header={<span className="font-display text-lg font-semibold">📸 Instagram odkaz (společný)</span>}
      >
        <div className="mt-2 grid gap-4 sm:grid-cols-2">
          <Field label="URL profilu" value={c.ig?.url ?? ""} placeholder="https://www.instagram.com/marena2k25" onChange={(v) => setIg("url", v)} />
          <Field label="Zobrazená přezdívka" value={c.ig?.handle ?? ""} placeholder="@marena2k25" onChange={(v) => setIg("handle", v)} />
        </div>
      </Collapsible>

      {/* JAZYKOVÉ ZÁLOŽKY PRO TEXTY */}
      <div className="sticky top-16 z-10 -mx-1 flex flex-wrap gap-1 rounded-2xl bg-paper/90 p-1 backdrop-blur ring-1 ring-black/5">
        {LANGS.map((l) => (
          <button
            key={l}
            onClick={() => setLang(l)}
            className={`rounded-xl px-3 py-1.5 text-sm font-medium transition ${lang === l ? "bg-marigold-600 text-white" : "text-ink-soft hover:bg-black/5"}`}
          >
            {LANG_LABEL[l]}
          </button>
        ))}
        <span className="ml-auto self-center px-2 text-xs text-ink-soft">Texty se ukládají zvlášť pro každý jazyk.</span>
      </div>

      {/* TEXTOVÉ SEKCE (podle jazyka) */}
      {GROUPS.map((g) => (
        <Collapsible
          key={g.title}
          defaultOpen={g.title.startsWith("Hero")}
          className="card p-4 sm:p-5"
          header={<span className="font-display text-lg font-semibold">{g.emoji} {g.title}</span>}
        >
          <div className="mt-2 grid gap-4">
            {g.fields.map((f) => (
              <Field
                key={f.key}
                label={f.label}
                area={f.area}
                value={tx[f.key] ?? ""}
                placeholder={STRINGS[lang][f.key]}
                onChange={(v) => setText(f.key, v)}
              />
            ))}
          </div>

          {g.hasLineup && (
            <div className="mt-4 space-y-3">
              <p className="text-sm font-semibold">Dlaždice (nadpis + text)</p>
              {STRINGS[lang].lineup.map((def, i) => (
                <div key={i} className="rounded-xl bg-paper2/60 p-3">
                  <p className="mb-2 text-xs font-semibold text-ink-soft">Dlaždice {i + 1}</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Nadpis" value={tx.lineup?.[i]?.title ?? ""} placeholder={def.title} onChange={(v) => setLineupText(i, "title", v)} />
                    <Field label="Text" area value={tx.lineup?.[i]?.text ?? ""} placeholder={def.text} onChange={(v) => setLineupText(i, "text", v)} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {g.hasSteps && (
            <div className="mt-4 space-y-3">
              <p className="text-sm font-semibold">Kroky (4)</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {STRINGS[lang].steps.map((def, i) => (
                  <div key={i} className="rounded-xl bg-paper2/60 p-3">
                    <p className="mb-2 text-xs font-semibold text-ink-soft">Krok {i + 1}</p>
                    <Field label="Kdy" value={tx.steps?.[i]?.day ?? ""} placeholder={def.day} onChange={(v) => setStepText(i, "day", v)} />
                    <div className="mt-2">
                      <Field label="Co" value={tx.steps?.[i]?.text ?? ""} placeholder={def.text} onChange={(v) => setStepText(i, "text", v)} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Collapsible>
      ))}

      {/* NOVINKY — dynamický seznam (přidávej / maž / řaď) */}
      <Collapsible
        defaultOpen
        className="card p-4 sm:p-5"
        header={<span className="font-display text-lg font-semibold">📰 Novinky ({news.length})</span>}
      >
        <div className="mb-3 mt-2 flex items-center justify-between gap-2">
          <p className="text-xs text-ink-soft">Zobrazují se na webu jako dlaždice (nejnovější dej nahoru). Společné pro všechny jazyky.</p>
          <button onClick={addNews} className="btn-primary shrink-0 px-3 py-1.5 text-sm">
            <Icon name="plus" className="h-4 w-4" /> Přidat novinku
          </button>
        </div>
        {news.length === 0 ? (
          <p className="text-sm text-ink-soft">Zatím žádná novinka. Sekce se na webu skryje, dokud nějakou nepřidáš.</p>
        ) : (
          <div className="space-y-4">
            {news.map((n, i) => (
              <div key={n.id} className="rounded-2xl border border-black/10 p-3">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-ink-soft">Novinka {i + 1}</span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => moveNews(n.id, -1)} disabled={i === 0} className="btn-ghost px-2 py-0.5 text-xs disabled:opacity-30" title="Nahoru">↑</button>
                    <button onClick={() => moveNews(n.id, 1)} disabled={i === news.length - 1} className="btn-ghost px-2 py-0.5 text-xs disabled:opacity-30" title="Dolů">↓</button>
                    <button onClick={() => delNews(n.id)} className="btn-ghost px-2 py-0.5 text-xs text-red-600 hover:bg-red-50" title="Smazat">Smazat</button>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Datum / štítek (nepovinné)" value={n.date ?? ""} placeholder="např. 12. 9. 2026" onChange={(v) => patchNews(n.id, { date: v })} />
                  <Field label="Nadpis" value={n.title} placeholder="Nadpis novinky" onChange={(v) => patchNews(n.id, { title: v })} />
                </div>
                <div className="mt-3">
                  <Field label="Text" area value={n.text} placeholder="O co jde…" onChange={(v) => patchNews(n.id, { text: v })} />
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <PhotoField label="Fotka (URL, nepovinné)" value={n.photo ?? ""} fallback="" onChange={(v) => patchNews(n.id, { photo: v })} />
                  <Field label="Odkaz „Více →“ (nepovinné)" value={n.link ?? ""} placeholder="https://…" onChange={(v) => patchNews(n.id, { link: v })} />
                </div>
              </div>
            ))}
          </div>
        )}
      </Collapsible>

      {/* SPODNÍ LIŠTA — Uložit */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-black/10 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <div className="text-sm">
            {status === "saving" && <span className="text-ink-soft">Ukládám…</span>}
            {status === "saved" && <span className="font-medium text-leaf-700">✓ Uloženo na server — web je aktualizovaný pro všechny.</span>}
            {status === "local" && <span className="font-medium text-amber-700">✓ Uloženo v tomto prohlížeči (demo / bez serveru).</span>}
            {status === null && <Link href="/" target="_blank" className="text-ink-soft hover:text-ink">Náhled webu ↗</Link>}
          </div>
          <button onClick={save} disabled={status === "saving"} className="btn-primary px-6 py-2.5">
            {status === "saving" ? "Ukládám…" : "Uložit změny"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  area,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  area?: boolean;
}) {
  return (
    <label className="block min-w-0">
      <span className="mb-1 block text-xs font-medium text-ink-soft">{label}</span>
      {area ? (
        <textarea className="input min-h-[84px]" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
      ) : (
        <input className="input" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
      )}
    </label>
  );
}

function PhotoField({
  label,
  value,
  onChange,
  fallback,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  fallback: string;
}) {
  const preview = value.trim() || fallback;
  return (
    <div className="flex gap-3">
      <div className="grid h-16 w-24 shrink-0 place-items-center overflow-hidden rounded-lg bg-paper2 text-lg ring-1 ring-black/10">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="" className="h-full w-full object-cover" />
        ) : (
          "🖼️"
        )}
      </div>
      <label className="min-w-0 flex-1">
        <span className="mb-1 block text-xs font-medium text-ink-soft">{label}</span>
        <input className="input" value={value} onChange={(e) => onChange(e.target.value)} placeholder={fallback || "https://…"} />
      </label>
    </div>
  );
}
