"use client";

import { PLAN, PHASES, KIND_META } from "@/lib/plan";
import { GOAL_WEIGHT, START_WEIGHT } from "@/lib/nutrition";
import { useDoneSessions, useWeightLog } from "@/lib/store";
import { accent } from "./accents";

const DAY_LABELS = ["Ne", "Po", "Út", "St", "Čt", "Pá", "So"];

export default function Dashboard({
  currentWeek,
  daysToRace,
  todayDow,
  onGoto,
}: {
  currentWeek: number;
  daysToRace: number;
  todayDow: number; // 0=Ne .. 6=So, -1 při SSR
  onGoto: (tab: string) => void;
}) {
  const { done, hydrated } = useDoneSessions();
  const [log] = useWeightLog();

  const started = daysToRace <= 24 * 7 && currentWeek >= 1;
  const week = PLAN[Math.min(Math.max(currentWeek, 1), 24) - 1];
  const phase = PHASES.find((p) => p.key === week.phaseKey)!;
  const a = accent(phase.color);

  const todayLabel = todayDow >= 0 ? DAY_LABELS[todayDow] : "";
  const todaySession = started ? week.sessions.find((s) => s.day === todayLabel) : undefined;

  const totalSessions = PLAN.reduce(
    (acc, w) => acc + w.sessions.filter((s) => s.kind !== "rest").length,
    0
  );
  const doneTotal = hydrated ? done.length : 0;
  const pct = Math.round((doneTotal / totalSessions) * 100);

  const latestKg = log.length
    ? [...log].sort((x, y) => x.date.localeCompare(y.date)).at(-1)!.kg
    : START_WEIGHT;
  const lost = Math.round((START_WEIGHT - latestKg) * 10) / 10;
  const toGoal = Math.round((latestKg - GOAL_WEIGHT) * 10) / 10;

  return (
    <div className="space-y-5">
      {/* Odpočet */}
      <div className="overflow-hidden rounded-2xl bg-ink text-white shadow-sm">
        <div className="relative p-5">
          <div className="text-xs font-semibold uppercase tracking-wide text-white/60">
            60. ČEZ Jizerská 50 · 14. 2. 2027 · Bedřichov
          </div>
          <div className="mt-2 flex items-end gap-3">
            <span className="text-5xl font-black leading-none">{Math.max(daysToRace, 0)}</span>
            <span className="mb-1 text-sm text-white/70">
              {daysToRace > 0 ? "dní do startu 50 km klasika" : "je čas — hodně štěstí! 🏁"}
            </span>
          </div>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm">
            <span className="text-white/70">
              {started ? (
                <>
                  Teď: <span className="font-semibold text-white">Týden {currentWeek}/24</span>
                </>
              ) : (
                <span className="font-semibold text-white">Start plánu 31. 8. 2026</span>
              )}
            </span>
            <span className="text-white/70">
              Fáze: <span className="font-semibold text-white">{phase.name.split(" · ")[0]}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Dnešní trénink */}
      {todaySession ? (
        <button
          onClick={() => onGoto("plan")}
          className="block w-full rounded-2xl border border-line bg-card p-4 text-left shadow-sm transition hover:border-sky"
        >
          <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink-soft">Dnešní jednotka</div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{KIND_META[todaySession.kind].icon}</span>
            <div className="flex-1">
              <div className="font-bold">{todaySession.title}</div>
              <div className="text-sm text-ink-soft">
                {todaySession.duration}
                {todaySession.zone !== "-" && ` · ${todaySession.zone}`}
              </div>
            </div>
            <span className="text-ink-soft">→</span>
          </div>
        </button>
      ) : (
        <div className="rounded-2xl border border-line bg-card p-4 text-sm text-ink-soft shadow-sm">
          {started
            ? "Dnes odpočinek nebo volný den — regenerace je součást plánu."
            : "Plán startuje 31. 8. 2026. Do té doby si projdi teorii a nachystej vybavení (hole, boty, oblečení)."}
        </div>
      )}

      {/* Fáze */}
      <button
        onClick={() => onGoto("plan")}
        className={`block w-full rounded-2xl border-l-4 ${a.border} ${a.bgSoft} p-4 text-left`}
      >
        <div className="text-xs font-semibold text-ink-soft">{phase.weeks}</div>
        <div className={`text-base font-bold ${a.text}`}>{phase.name}</div>
        <p className="mt-1 text-sm text-ink-soft">{phase.goal}</p>
      </button>

      {/* Dlaždice postupu */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => onGoto("plan")}
          className="rounded-2xl border border-line bg-card p-4 text-left shadow-sm transition hover:border-sky"
        >
          <div className="text-xs text-ink-soft">Splněno jednotek</div>
          <div className="text-2xl font-black text-sky-600">{pct}%</div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-paper2">
            <div className="h-full rounded-full bg-sky" style={{ width: `${pct}%` }} />
          </div>
          <div className="mt-1 text-xs text-ink-soft">
            {doneTotal}/{totalSessions}
          </div>
        </button>

        <button
          onClick={() => onGoto("vaha")}
          className="rounded-2xl border border-line bg-card p-4 text-left shadow-sm transition hover:border-sky"
        >
          <div className="text-xs text-ink-soft">Váha</div>
          <div className="text-2xl font-black">{latestKg} kg</div>
          <div className="mt-1 text-xs text-ink-soft">
            {lost > 0 ? `−${lost} kg shozeno · ` : ""}
            {toGoal > 0 ? `zbývá ${toGoal} kg do ${GOAL_WEIGHT}` : `cíl ${GOAL_WEIGHT} kg splněn 💪`}
          </div>
        </button>
      </div>

      {/* Rychlé odkazy */}
      <div className="grid grid-cols-2 gap-3">
        <QuickLink label="Zásobník cviků" icon="🏋️" onClick={() => onGoto("cviky")} />
        <QuickLink label="Jak a proč (teorie)" icon="📚" onClick={() => onGoto("teorie")} />
      </div>
    </div>
  );
}

function QuickLink({ label, icon, onClick }: { label: string; icon: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 rounded-2xl border border-line bg-card p-4 text-left shadow-sm transition hover:border-sky"
    >
      <span className="text-xl">{icon}</span>
      <span className="text-sm font-semibold">{label}</span>
    </button>
  );
}
