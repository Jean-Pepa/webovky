"use client";

import { useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { Gate } from "@/components/Gate";
import { Header } from "@/components/Header";
import { Modal } from "@/components/Modal";
import { fmtRange, todayISO, addDays } from "@/lib/format";
import { rankWindows, topDistinctWindows } from "@/lib/windows";
import { newId } from "@/lib/id";
import type { Trip } from "@/lib/types";

export default function Home() {
  return (
    <Gate>
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-6">
        <SyncBanner />
        <TripList />
      </main>
    </Gate>
  );
}

function SyncBanner() {
  const { syncError, dismissSyncError } = useStore();
  if (!syncError) return null;
  return (
    <div className="mb-4 flex items-center gap-3 rounded-2xl border border-out/30 bg-out-soft px-4 py-3 text-sm text-out">
      <span className="flex-1">{syncError}</span>
      <button className="btn-ghost px-2 py-1 text-xs" onClick={dismissSyncError}>
        zavřít
      </button>
    </div>
  );
}

function TripList() {
  const { trips } = useStore();
  const [adding, setAdding] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Naše výpravy</h1>
          <p className="text-sm text-ink-soft">Vyber výpravu, nebo založ novou.</p>
        </div>
        <button className="btn-primary" onClick={() => setAdding(true)}>
          + Nová výprava
        </button>
      </div>

      {trips.length === 0 ? (
        <div className="card grid place-items-center gap-2 p-10 text-center">
          <div className="text-4xl">🧭</div>
          <p className="font-medium">Zatím žádná výprava.</p>
          <p className="max-w-sm text-sm text-ink-soft">
            Založ první — třeba „Léto 2026“ — nastav období a délku dovču a pošli klukům heslo.
          </p>
          <button className="btn-primary mt-1" onClick={() => setAdding(true)}>
            + Založit výpravu
          </button>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {trips.map((t) => (
            <TripCardLink key={t.id} trip={t} />
          ))}
        </div>
      )}

      {adding && <NewTripModal onClose={() => setAdding(false)} />}
    </div>
  );
}

function TripCardLink({ trip }: { trip: Trip }) {
  const best = topDistinctWindows(rankWindows(trip), 1)[0];
  return (
    <Link href={`/vyprava/${trip.id}`} className="card block p-4 transition hover:ring-2 hover:ring-sea-300">
      <div className="flex items-center gap-2">
        <h2 className="font-display text-lg font-semibold">{trip.name}</h2>
        {trip.locked && <span className="chip bg-free-soft text-free">✓ termín domluven</span>}
      </div>
      <p className="mt-0.5 text-sm text-ink-soft">{fmtRange(trip.horizonStart, trip.horizonEnd)}</p>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
        <span className="chip">👥 {trip.members.length} lidí</span>
        <span className="chip">🗓️ {trip.lengthDays} dní</span>
        {trip.locked ? (
          <span className="chip bg-free-soft text-free">{fmtRange(trip.locked.start, trip.locked.end)}</span>
        ) : best ? (
          <span className="chip bg-sea-50 text-sea-700">
            zatím nejlíp: {fmtRange(best.start, best.end)} · {best.can.length}/{trip.members.length}
          </span>
        ) : (
          <span className="chip">zatím bez společného okna</span>
        )}
      </div>
    </Link>
  );
}

function NewTripModal({ onClose }: { onClose: () => void }) {
  const { me, dispatch } = useStore();
  const [name, setName] = useState("");
  const [start, setStart] = useState(todayISO());
  const [end, setEnd] = useState(addDays(todayISO(), 120));
  const [length, setLength] = useState(7);
  const [minPeople, setMinPeople] = useState(3);

  async function create() {
    if (!name.trim() || end < start) return;
    const trip: Trip = {
      id: newId(),
      name: name.trim(),
      horizonStart: start,
      horizonEnd: end,
      lengthDays: Math.max(1, length),
      minPeople: Math.max(1, minPeople),
      createdBy: me,
      createdAt: new Date().toISOString(),
      members: [me],
      availability: {},
      proposals: [],
      locked: null,
    };
    await dispatch({ type: "addTrip", trip });
    onClose();
  }

  return (
    <Modal open onClose={onClose} title="Nová výprava">
      <div className="space-y-3">
        <div>
          <label className="label">Název</label>
          <input className="input" autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="třeba Léto 2026" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="label">Hledáme od</label>
            <input type="date" className="input" value={start} onChange={(e) => setStart(e.target.value)} />
          </div>
          <div>
            <label className="label">do</label>
            <input type="date" className="input" value={end} min={start} onChange={(e) => setEnd(e.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="label">Délka dovču (dní)</label>
            <input type="number" min={1} max={60} className="input" value={length} onChange={(e) => setLength(Number(e.target.value))} />
          </div>
          <div>
            <label className="label">Minimálně lidí</label>
            <input type="number" min={1} max={50} className="input" value={minPeople} onChange={(e) => setMinPeople(Number(e.target.value))} />
          </div>
        </div>
        <div className="flex items-center gap-2 pt-1">
          <button className="btn-primary flex-1" onClick={create} disabled={!name.trim() || end < start}>
            Založit
          </button>
          <button className="btn-ghost" onClick={onClose}>
            Zrušit
          </button>
        </div>
      </div>
    </Modal>
  );
}
