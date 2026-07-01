"use client";

import { useState } from "react";
import { RACE_DATE } from "@/lib/plan";
import { useDayIndex } from "@/lib/store";
import Dashboard from "@/components/Dashboard";
import PlanView from "@/components/PlanView";
import WeightTracker from "@/components/WeightTracker";
import ExercisesView from "@/components/ExercisesView";
import TheoryView from "@/components/TheoryView";

const START = Date.UTC(2026, 7, 31); // pondělí 31. 8. 2026

const TABS = [
  { key: "prehled", label: "Přehled", icon: "🏔️" },
  { key: "plan", label: "Plán", icon: "🗓️" },
  { key: "vaha", label: "Váha", icon: "⚖️" },
  { key: "cviky", label: "Cviky", icon: "🏋️" },
  { key: "teorie", label: "Teorie", icon: "📚" },
];

export default function Home() {
  const [tab, setTab] = useState("prehled");
  const dayIndex = useDayIndex(); // null při SSR, jinak den (UTC) dneška

  // Půlnoc dneška v ms (UTC) — den je dost jemná granularita pro odpočet i týden.
  const now = dayIndex != null ? dayIndex * 86400000 : null;
  const daysToRace = now != null ? Math.ceil((RACE_DATE.getTime() - now) / 86400000) : 0;
  const currentWeek =
    now != null ? Math.max(0, Math.min(24, Math.floor((now - START) / (7 * 86400000)) + 1)) : 0;
  // Den v týdnu (0=Ne..6=So). 1. 1. 1970 (UTC) byl čtvrtek → (dayIndex + 4) % 7.
  const todayDow = dayIndex != null ? (dayIndex + 4) % 7 : -1;

  return (
    <div className="mx-auto min-h-screen max-w-2xl pb-24">
      {/* Hlavička */}
      <header className="px-4 pt-6 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎿</span>
          <div>
            <h1 className="text-lg font-black leading-tight">Jizerská 50 — příprava</h1>
            <p className="text-xs text-ink-soft">24týdenní plán bez sněhu · klasika · únor 2027</p>
          </div>
        </div>
      </header>

      {/* Taby (desktop nahoře) */}
      <nav className="sticky top-0 z-10 hidden border-b border-line bg-paper/85 px-2 backdrop-blur sm:block">
        <div className="flex gap-1">
          {TABS.map((t) => (
            <TabButton key={t.key} t={t} active={tab === t.key} onClick={() => setTab(t.key)} />
          ))}
        </div>
      </nav>

      <main className="px-4 py-5">
        {tab === "prehled" && (
          <Dashboard currentWeek={currentWeek} daysToRace={daysToRace} todayDow={todayDow} onGoto={setTab} />
        )}
        {tab === "plan" && <PlanView currentWeek={currentWeek} />}
        {tab === "vaha" && <WeightTracker />}
        {tab === "cviky" && <ExercisesView />}
        {tab === "teorie" && <TheoryView />}
      </main>

      {/* Taby (mobil dole) */}
      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-card/95 backdrop-blur sm:hidden">
        <div className="mx-auto flex max-w-2xl">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-semibold transition ${
                tab === t.key ? "text-sky-600" : "text-ink-soft"
              }`}
            >
              <span className="text-lg leading-none">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

function TabButton({
  t,
  active,
  onClick,
}: {
  t: { key: string; label: string; icon: string };
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 border-b-2 px-4 py-3 text-sm font-semibold transition ${
        active ? "border-sky text-sky-600" : "border-transparent text-ink-soft hover:text-ink"
      }`}
    >
      <span>{t.icon}</span>
      {t.label}
    </button>
  );
}
