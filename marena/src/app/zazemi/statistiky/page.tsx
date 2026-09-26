"use client";

import { useCallback, useEffect, useState } from "react";
import { PageTitle } from "@/components/PageTitle";
import { useStore } from "@/lib/store";
import { isAdmin } from "@/lib/admin";
import type { AnalyticsSummary, RecentItem, UserRow } from "@/lib/analytics";
import { DonutChart, SplitBar, StatTiles, ColumnChart, BarList as RankList, VIZ } from "@/components/Charts";

const nf = (n: number) => n.toLocaleString("cs-CZ");

function ago(t: number): string {
  const s = Math.max(0, Math.floor((Date.now() - t) / 1000));
  if (s < 60) return "teď";
  if (s < 3600) return `před ${Math.floor(s / 60)} min`;
  if (s < 86400) return `před ${Math.floor(s / 3600)} h`;
  return `před ${Math.floor(s / 86400)} dny`;
}

export default function StatistikyPage() {
  const { me } = useStore();
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [days, setDays] = useState(14);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(false);

  const load = useCallback(async (d: number) => {
    setLoading(true);
    setErr(false);
    try {
      const res = await fetch(`/api/analytics/summary?days=${d}`, { cache: "no-store" });
      if (!res.ok) throw new Error();
      setData((await res.json()) as AnalyticsSummary);
    } catch {
      setErr(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load(days);
  }, [days, load]);

  if (!isAdmin(me)) {
    return (
      <div className="space-y-4">
        <PageTitle>Statistiky</PageTitle>
        <div className="empty-state">Tahle sekce je jen pro správce.</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <PageTitle>Statistiky</PageTitle>
          <p className="mt-1 text-sm text-ink-soft">Návštěvnost, chování a funnel — přehled jen pro tebe.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-full bg-paper2 p-0.5 ring-1 ring-ink/10">
            {[7, 14, 30].map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                  days === d ? "bg-ink text-white" : "text-ink-soft hover:bg-ink/5"
                }`}
              >
                {d} dní
              </button>
            ))}
          </div>
          <button onClick={() => load(days)} className="btn-ghost px-3 py-1.5 text-sm" title="Načíst znovu">
            ↻
          </button>
        </div>
      </div>

      {loading && !data && <div className="empty-state">Načítám…</div>}
      {err && <div className="card p-6 text-sm text-red-600">Přehled se nepodařilo načíst.</div>}

      {data && !data.enabled && (
        <div className="card p-6 text-sm text-ink-soft">
          Analytika běží až na produkci s připojeným Redisem. V demo režimu (bez Redisu) se data nesbírají.
        </div>
      )}

      {data && data.enabled && (
        <>
          {/* Klíčová čísla */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="Dnes (DAU)" value={data.dau} tone="gold" hint="unikátních dnes" />
            <Stat label="Týden (WAU)" value={data.wau} tone="leaf" hint="za 7 dní" />
            <Stat label="Měsíc (MAU)" value={data.mau} tone="plum" hint="za 30 dní" />
            <Stat label={`Za ${data.periodDays} dní`} value={data.uniquesInPeriod} hint="unikátních lidí" />
          </div>
          <Overview data={data} />

          {/* Návštěvnost v čase — lidé a boti po dnech */}
          <Card title="Zobrazení stránek v čase">
            <ColumnChart
              title={`Zobrazení po dnech (${data.periodDays} dní)`}
              unit="zobr."
              categories={data.series.map((s) => shortDay(s.date))}
              series={[
                { key: "human", label: "Lidé", color: VIZ[0] },
                { key: "bot", label: "Boti / AI", color: VIZ[1] },
              ]}
              data={data.series.map((s) => [s.human ?? s.pv, s.bot ?? 0])}
              note={`Celkem ${nf(data.pageviews)} zobrazení za období. Nahoře nejsilnější (nebo najetý) den.`}
            />
          </Card>

          <div className="grid gap-4 lg:grid-cols-2">
            {/* Kdo to otevírá */}
            <Card title="Kdo to otevírá">
              <SplitBar
                title={`Unikátní lidé za ${data.periodDays} dní`}
                unit="lidí"
                parts={[
                  { label: "🔑 Přihlášení (tým)", value: data.loggedInUniques, color: VIZ[0] },
                  { label: "👤 Návštěvníci", value: data.visitorUniques, color: VIZ[1] },
                ]}
                note="Přihlášení podle jména, návštěvníci podle tokenu / IP."
              />
            </Card>

            {/* Lidé vs boti */}
            <Card title="Lidé vs. boti (AI)">
              <SplitBar
                title="Zobrazení stránek"
                unit="zobr."
                parts={[
                  { label: "🙂 Lidé", value: data.humans, color: VIZ[0] },
                  { label: "🤖 Boti / AI", value: data.bots, color: VIZ[1] },
                ]}
              />
              {data.botNames.length > 0 && (
                <div className="mt-3">
                  <DonutChart title="Kteří boti" unit="zobr." items={data.botNames.map((b) => ({ label: b.label, value: b.count }))} note="Podle hlavičky prohlížeče; nejvýš šest, zbytek jako Ostatní." />
                </div>
              )}
            </Card>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card title="Nejnavštěvovanější stránky">
              {data.topPages.length ? <RankList title="Zobrazení podle stránky" unit="zobr." rows={data.topPages.map((p) => ({ label: p.label, value: p.count }))} /> : <Empty />}
            </Card>
            <Card title="Na co se nejvíc kliká">
              {data.topClicks.length ? <RankList title="Kliknutí podle prvku" unit="klik." rows={data.topClicks.map((p) => ({ label: p.label, value: p.count }))} /> : <Empty />}
            </Card>
          </div>

          {/* Funnel objednávek */}
          <Card title="Funnel merche (dokončení objednávky)">
            <Funnel steps={data.funnel} />
          </Card>

          {/* Zařízení — koláče */}
          <div className="grid gap-4 sm:grid-cols-3">
            <Card title="Zařízení">
              {data.devices.length ? <DonutChart title="Podle typu zařízení" unit="zobr." items={data.devices.map((d) => ({ label: d.label, value: d.count }))} /> : <Empty />}
            </Card>
            <Card title="Systém">
              {data.os.length ? <DonutChart title="Podle systému" unit="zobr." items={data.os.map((d) => ({ label: d.label, value: d.count }))} /> : <Empty />}
            </Card>
            <Card title="Prohlížeč">
              {data.browsers.length ? <DonutChart title="Podle prohlížeče" unit="zobr." items={data.browsers.map((d) => ({ label: d.label, value: d.count }))} /> : <Empty />}
            </Card>
          </div>

          {/* Uživatelé + IP */}
          <Card title="Uživatelé, zařízení a IP">
            <UsersTable users={data.users} />
          </Card>

          {/* Živý feed */}
          <Card title="Poslední aktivita">
            <RecentFeed items={data.recent} />
          </Card>

          <p className="text-center text-[11px] text-ink-soft">
            Sbírá se první-strana (vlastní) analytika do Redisu. Data se nemažou, zůstávají natrvalo.
          </p>
        </>
      )}
    </div>
  );
}

const shortDay = (iso: string) => `${Number(iso.slice(8, 10))}.${Number(iso.slice(5, 7))}.`;

// Druhá řada čísel: zobrazení, průměr na den, nejsilnější den, podíl lidí, konverze.
function Overview({ data }: { data: AnalyticsSummary }) {
  const days = data.series.length || 1;
  const peak = data.series.reduce((best, s) => (s.pv > best.pv ? s : best), data.series[0] ?? { date: "", pv: 0, human: 0, bot: 0 });
  const total = data.humans + data.bots;
  const funnelTop = data.funnel[0]?.count || 0;
  const funnelEnd = data.funnel[data.funnel.length - 1]?.count || 0;
  return (
    <StatTiles
      stats={[
        { label: "Zobrazení", value: nf(data.pageviews), sub: `za ${data.periodDays} dní` },
        { label: "Průměr za den", value: nf(Math.round(data.pageviews / days)), sub: "zobrazení" },
        { label: "Nejsilnější den", value: peak.date ? shortDay(peak.date) : "—", sub: peak.date ? `${nf(peak.pv)} zobrazení` : undefined },
        { label: "Lidé", value: total ? `${Math.round((data.humans / total) * 100)} %` : "—", sub: `${nf(data.humans)} zobrazení` },
        { label: "Boti / AI", value: total ? `${Math.round((data.bots / total) * 100)} %` : "—", sub: `${nf(data.bots)} zobrazení` },
        { label: "Konverze merche", value: funnelTop ? `${Math.round((funnelEnd / funnelTop) * 100)} %` : "—", sub: funnelTop ? `${nf(funnelEnd)} z ${nf(funnelTop)} dokončilo` : "zatím nikdo neotevřel nabídku", tone: funnelTop && funnelEnd / funnelTop >= 0.3 ? "good" : undefined },
      ]}
    />
  );
}

function Stat({ label, value, hint, tone }: { label: string; value: number; hint?: string; tone?: "gold" | "leaf" | "plum" }) {
  const color = tone === "gold" ? "text-gold-700" : tone === "leaf" ? "text-leaf-700" : tone === "plum" ? "text-plum-600" : "text-ink";
  return (
    <div className="card p-4">
      <div className="eyebrow">{label}</div>
      <div className={`mt-1 font-display text-3xl font-bold tabular-nums ${color}`}>{nf(value)}</div>
      {hint && <div className="text-xs text-ink-soft">{hint}</div>}
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="card p-4">
      <h2 className="eyebrow mb-3">{title}</h2>
      {children}
    </section>
  );
}

function Empty() {
  return <p className="text-sm text-ink-soft">Zatím žádná data.</p>;
}




function Funnel({ steps }: { steps: { step: string; label: string; count: number }[] }) {
  const top = steps[0]?.count || 0;
  return (
    <div className="space-y-2">
      {steps.map((s, i) => {
        const pctOfTop = top ? Math.round((s.count / top) * 100) : 0;
        const prev = i > 0 ? steps[i - 1].count : s.count;
        const drop = prev ? Math.round((s.count / prev) * 100) : 100;
        return (
          <div key={s.step}>
            <div className="flex items-center justify-between text-sm">
              <span className="text-ink">
                <span className="mr-1.5 inline-grid h-5 w-5 place-items-center rounded-full bg-paper2 text-xs font-bold tabular-nums">{i + 1}</span>
                {s.label}
              </span>
              <span className="font-semibold tabular-nums text-ink-soft">
                {nf(s.count)}
                {i > 0 && <span className="ml-1 text-xs text-ink-soft/70">({drop}%)</span>}
              </span>
            </div>
            <div className="mt-0.5 h-2.5 w-full overflow-hidden rounded-full bg-paper2">
              <div className="h-full rounded-full bg-gold-500" style={{ width: `${Math.max(2, pctOfTop)}%` }} />
            </div>
          </div>
        );
      })}
      {top > 0 && (
        <p className="pt-1 text-xs text-ink-soft">
          Celková konverze: <strong className="text-ink">{Math.round(((steps[steps.length - 1]?.count || 0) / top) * 100)}%</strong> z těch, co otevřeli nabídku, dokončilo objednávku.
        </p>
      )}
    </div>
  );
}

function UsersTable({ users }: { users: UserRow[] }) {
  if (!users.length) return <Empty />;
  return (
    <div className="-mx-4 overflow-x-auto px-4">
      <table className="w-full min-w-[560px] text-sm">
        <thead>
          <tr className="border-b border-ink/10 text-left text-xs uppercase tracking-wide text-ink-soft">
            <th className="py-1.5 pr-3 font-medium">Kdo</th>
            <th className="py-1.5 pr-3 font-medium">Zařízení</th>
            <th className="py-1.5 pr-3 font-medium tabular-nums">Zobr.</th>
            <th className="py-1.5 pr-3 font-medium">Naposledy</th>
            <th className="py-1.5 font-medium">IP</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.key} className="border-b border-ink/5">
              <td className="py-1.5 pr-3">
                {u.name ? (
                  <span className="font-medium text-ink">🔑 {u.name}</span>
                ) : (
                  <span className="text-ink-soft" title={u.key}>👤 návštěvník</span>
                )}
              </td>
              <td className="py-1.5 pr-3 text-ink-soft">{[u.dev, u.os, u.br].filter(Boolean).join(" · ") || "—"}</td>
              <td className="py-1.5 pr-3 tabular-nums text-ink-soft">{nf(u.hits)}</td>
              <td className="py-1.5 pr-3 text-ink-soft">{u.last ? ago(u.last) : "—"}</td>
              <td className="py-1.5 font-mono text-xs text-ink-soft">{u.ips.join(", ") || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RecentFeed({ items }: { items: RecentItem[] }) {
  if (!items.length) return <Empty />;
  return (
    <ul className="max-h-96 space-y-1 overflow-y-auto text-sm">
      {items.map((r, i) => (
        <li key={i} className="flex items-center gap-2 border-b border-ink/5 py-1">
          <span className="w-16 shrink-0 text-xs tabular-nums text-ink-soft">{ago(r.t)}</span>
          {r.kind === "bot" ? (
            <span className="min-w-0 flex-1 truncate text-ink-soft">🤖 {r.label || "bot"} {r.path ? `· ${r.path}` : ""}</span>
          ) : r.kind === "funnel" ? (
            <span className="min-w-0 flex-1 truncate">🛒 <strong className="text-ink">{r.who}</strong> · {r.step}</span>
          ) : (
            <span className="min-w-0 flex-1 truncate">
              {r.anon ? "👤" : "🔑"} <strong className="text-ink">{r.who}</strong>
              <span className="text-ink-soft"> · {r.path}{r.dev ? ` · ${r.dev}` : ""}</span>
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
