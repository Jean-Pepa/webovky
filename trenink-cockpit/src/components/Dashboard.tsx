"use client";

import { useActivities, useToday } from "@/lib/store";
import { summarize, weeklyBuckets, fmtDuration, fmtKm, fmtPace, typeMeta } from "@/lib/metrics";

function Stat({ label, value, unit, sub, accent }: { label: string; value: string; unit?: string; sub?: string; accent?: boolean }) {
  return (
    <div className={`rounded-2xl border border-line p-4 ${accent ? "bg-sky-050" : "bg-card"}`}>
      <div className="text-xs font-medium text-ink-soft">{label}</div>
      <div className="mt-1 flex items-baseline gap-1">
        <span className={`text-2xl font-bold ${accent ? "text-sky-600" : ""}`}>{value}</span>
        {unit && <span className="text-xs text-ink-soft">{unit}</span>}
      </div>
      {sub && <div className="mt-0.5 text-xs text-ink-soft">{sub}</div>}
    </div>
  );
}

function WeeklyChart({ activities }: { activities: ReturnType<typeof useActivities>["activities"] }) {
  const buckets = weeklyBuckets(activities, 12);
  const max = Math.max(1, ...buckets.map((b) => b.km));
  if (!buckets.length) return null;
  return (
    <div className="rounded-2xl border border-line bg-card p-4">
      <h3 className="mb-3 text-sm font-semibold">Týdenní objem (posledních {buckets.length} týdnů)</h3>
      <div className="flex items-end gap-1.5" style={{ height: 120 }}>
        {buckets.map((b) => (
          <div key={b.key} className="flex flex-1 flex-col items-center gap-1">
            <div className="flex w-full items-end justify-center" style={{ height: 96 }}>
              <div
                className="w-full max-w-[26px] rounded-t-md bg-sky"
                style={{ height: `${Math.max(3, (b.km / max) * 96)}px` }}
                title={`${Math.round(b.km)} km`}
              />
            </div>
            <span className="text-[9px] text-ink-soft">{b.key.slice(6)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { activities, loading } = useActivities();
  const today = useToday();
  const s = summarize(activities, today);

  if (loading) {
    return <div className="rounded-2xl border border-line bg-card p-8 text-center text-ink-soft">Načítám data…</div>;
  }

  if (!activities.length) {
    return (
      <div className="rounded-2xl border border-line bg-card p-6 text-center">
        <div className="text-3xl">📡</div>
        <h3 className="mt-2 font-semibold">Zatím tu nejsou žádná data</h3>
        <p className="mx-auto mt-1 max-w-md text-sm text-ink-soft">
          Připoj Garmin konektor a řekni Claudovi „natáhni data z Garminu“. Aktivity z tvého Forerunneru 965 se objeví tady.
          Do té doby si můžeš psát do <strong>Deníku</strong>.
        </p>
      </div>
    );
  }

  const last = s.lastActivity;
  return (
    <div className="space-y-4">
      {last && (
        <div className="rounded-2xl bg-ink p-5 text-white">
          <div className="text-xs font-semibold uppercase tracking-wide text-white/60">Poslední aktivita</div>
          <div className="mt-1 flex items-center gap-3">
            <span className="text-2xl">{typeMeta(last.type).icon}</span>
            <div>
              <div className="font-bold">{last.name || typeMeta(last.type).label}</div>
              <div className="text-sm text-white/70">
                {last.date} · {fmtKm(last.distanceKm)} km · {fmtDuration(last.durationS)}
                {last.paceSPerKm ? ` · ${fmtPace(last.paceSPerKm)}/km` : ""}
                {last.avgHr ? ` · ${last.avgHr} tep` : ""}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Tento týden" value={fmtKm(s.thisWeekKm)} unit="km" sub={`${s.thisWeekCount} aktivit`} accent />
        <Stat label="Celkem" value={fmtKm(s.totalKm)} unit="km" sub={`${s.totalCount} aktivit`} />
        <Stat label="Čas celkem" value={fmtDuration(s.totalDurationS)} />
        <Stat label="VO₂max" value={s.latestVo2max != null ? String(s.latestVo2max) : "–"} sub="poslední" />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Prům. tep (běh/běžky)" value={s.avgHrRuns != null ? String(s.avgHrRuns) : "–"} unit="bpm" />
        <Stat
          label="Nejdelší"
          value={fmtKm(s.longest?.distanceKm ?? null)}
          unit="km"
          sub={s.longest?.date ?? ""}
        />
      </div>

      <WeeklyChart activities={activities} />
    </div>
  );
}
