"use client";

import { useState } from "react";
import { dataSource } from "@/lib/store";
import Dashboard from "@/components/Dashboard";
import Activities from "@/components/Activities";
import Journal from "@/components/Journal";
import Status from "@/components/Status";

const TABS = [
  { key: "prehled", label: "Přehled", icon: "📊" },
  { key: "aktivity", label: "Aktivity", icon: "🏃" },
  { key: "denik", label: "Deník", icon: "💬" },
  { key: "stav", label: "Stav", icon: "⚙️" },
];

export default function Home() {
  const [tab, setTab] = useState("prehled");
  const cloud = dataSource === "supabase";

  return (
    <div className="mx-auto min-h-screen max-w-2xl pb-24">
      <header className="flex items-center justify-between px-4 pt-6 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎯</span>
          <div>
            <h1 className="text-lg font-black leading-tight">Trénink cockpit</h1>
            <p className="text-xs text-ink-soft">data z Garminu · vyhodnocení · společný deník</p>
          </div>
        </div>
        <button
          onClick={() => setTab("stav")}
          className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
            cloud ? "bg-green-050 text-green" : "bg-orange-050 text-orange"
          }`}
          title="Stav připojení"
        >
          <span className={`h-2 w-2 rounded-full ${cloud ? "bg-green" : "bg-orange"}`} />
          {cloud ? "cloud" : "lokálně"}
        </button>
      </header>

      <nav className="sticky top-0 z-10 hidden border-b border-line bg-paper/85 px-2 backdrop-blur sm:block">
        <div className="flex gap-1">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-1.5 border-b-2 px-4 py-3 text-sm font-semibold transition ${
                tab === t.key ? "border-sky text-sky-600" : "border-transparent text-ink-soft hover:text-ink"
              }`}
            >
              <span>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="px-4 py-5">
        {tab === "prehled" && <Dashboard />}
        {tab === "aktivity" && <Activities />}
        {tab === "denik" && <Journal />}
        {tab === "stav" && <Status />}
      </main>

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
