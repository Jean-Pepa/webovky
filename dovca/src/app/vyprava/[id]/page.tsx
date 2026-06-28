"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { Gate } from "@/components/Gate";
import { Header } from "@/components/Header";
import { Modal } from "@/components/Modal";
import { TripCalendar } from "@/components/TripCalendar";
import { fmtRange, addDays } from "@/lib/format";
import { rankWindows, topDistinctWindows, type WindowResult } from "@/lib/windows";
import { newId } from "@/lib/id";
import type { Trip, Proposal, VoteValue } from "@/lib/types";

export default function TripPage() {
  return (
    <Gate>
      <Header />
      <TripDetail />
    </Gate>
  );
}

function TripDetail() {
  const params = useParams();
  const id = String(params?.id ?? "");
  const { trips, me, dispatch } = useStore();
  const trip = trips.find((t) => t.id === id);

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [proposalPrefill, setProposalPrefill] = useState<{ start: string; end: string } | null>(null);

  // Auto-přihlášení do výpravy (přidá mě mezi účastníky, výchozí stav = můžu).
  const memberKey = trip?.members.join("|");
  useEffect(() => {
    if (trip && me && !trip.members.includes(me)) {
      dispatch({ type: "joinTrip", tripId: trip.id, person: me });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trip?.id, me, memberKey]);

  const ranked = useMemo(() => (trip ? rankWindows(trip) : []), [trip]);
  const topPicks = useMemo(() => topDistinctWindows(ranked, 6), [ranked]);

  if (!trip) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10 text-center">
        <p className="text-ink-soft">Výprava nenalezena.</p>
        <Link href="/" className="btn-secondary mt-4 inline-flex">← Zpět na výpravy</Link>
      </main>
    );
  }

  const total = trip.members.length;

  return (
    <main className="mx-auto max-w-4xl space-y-5 px-4 py-6">
      <div>
        <Link href="/" className="text-sm text-ink-soft hover:text-ink">← výpravy</Link>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <h1 className="font-display text-2xl font-semibold tracking-tight">{trip.name}</h1>
          <button className="btn-ghost px-2 py-1 text-xs" onClick={() => setSettingsOpen(true)}>
            ⚙︎ upravit
          </button>
        </div>
        <p className="text-sm text-ink-soft">
          Hledáme {trip.lengthDays} dní v období {fmtRange(trip.horizonStart, trip.horizonEnd)} · minimálně{" "}
          {trip.minPeople} lidí
        </p>
      </div>

      {trip.locked && (
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-free/30 bg-free-soft px-4 py-3">
          <span className="text-xl">✅</span>
          <div className="flex-1">
            <p className="font-display font-semibold text-free">Termín domluven!</p>
            <p className="text-sm text-ink">
              {fmtRange(trip.locked.start, trip.locked.end)}
              {trip.locked.place ? ` · ${trip.locked.place}` : ""}
            </p>
          </div>
          <button className="btn-ghost text-xs" onClick={() => dispatch({ type: "unlockTrip", tripId: trip.id })}>
            zrušit
          </button>
        </div>
      )}

      <Members trip={trip} me={me} />

      <div className="grid gap-5 lg:grid-cols-2">
        <TripCalendar trip={trip} me={me} />
        <BestWindows
          trip={trip}
          picks={topPicks}
          totalWindows={ranked.length}
          onPropose={(w) => setProposalPrefill({ start: w.start, end: w.end })}
        />
      </div>

      <Proposals trip={trip} me={me} onNew={() => setProposalPrefill({ start: trip.horizonStart, end: addDays(trip.horizonStart, trip.lengthDays - 1) })} />

      {settingsOpen && <SettingsModal trip={trip} onClose={() => setSettingsOpen(false)} />}
      {proposalPrefill && (
        <ProposalModal trip={trip} me={me} prefill={proposalPrefill} onClose={() => setProposalPrefill(null)} />
      )}

      <p className="pb-6 text-center text-xs text-ink-soft">
        Celkem {total} {total === 1 ? "člověk" : total < 5 ? "lidi" : "lidí"} ve výpravě. Vše může každý měnit —
        je to nástroj pro partu, co si věří.
      </p>
    </main>
  );
}

function Members({ trip, me }: { trip: Trip; me: string }) {
  const { dispatch } = useStore();
  return (
    <div className="card flex flex-wrap items-center gap-2 p-4">
      <span className="text-sm font-medium text-ink-soft">Parta:</span>
      {trip.members.map((m) => (
        <span key={m} className={`chip ${m === me ? "bg-sea-100 text-sea-800" : ""}`}>
          {m === me ? "🫵 " : "👤 "}
          {m}
        </span>
      ))}
      {!trip.members.includes(me) && (
        <button className="btn-ghost px-2 py-1 text-xs" onClick={() => dispatch({ type: "joinTrip", tripId: trip.id, person: me })}>
          + přidat se
        </button>
      )}
    </div>
  );
}

function BestWindows({
  trip,
  picks,
  totalWindows,
  onPropose,
}: {
  trip: Trip;
  picks: WindowResult[];
  totalWindows: number;
  onPropose: (w: WindowResult) => void;
}) {
  const total = trip.members.length;
  return (
    <div className="card p-4">
      <h3 className="font-display text-base font-semibold">Nejlepší termíny</h3>
      <p className="mb-3 text-xs text-ink-soft">
        Okna délky {trip.lengthDays} dní, kde může nejvíc lidí (aspoň {trip.minPeople}).
      </p>

      {picks.length === 0 ? (
        <p className="rounded-xl bg-paper2 p-3 text-sm text-ink-soft">
          Zatím se nenašlo okno, kde by mohlo aspoň {trip.minPeople} z vás. Zkuste si víc vyplnit kalendář,
          zkrátit dovču nebo snížit minimum (⚙︎ upravit).
        </p>
      ) : (
        <ul className="space-y-2">
          {picks.map((w) => (
            <li key={w.start} className="rounded-xl border border-black/[0.06] p-3">
              <div className="flex items-center gap-2">
                <span className="font-display font-semibold">{fmtRange(w.start, w.end)}</span>
                <span className={`chip ml-auto ${w.can.length === total ? "bg-free-soft text-free" : "bg-sea-50 text-sea-700"}`}>
                  může {w.can.length}/{total}
                </span>
              </div>
              <Bar can={w.can.length} shaky={w.shaky.length} total={total} />
              {w.cant.length > 0 && (
                <p className="mt-1.5 text-xs text-out">nemůže: {w.cant.join(", ")}</p>
              )}
              {w.shaky.length > 0 && (
                <p className="text-xs text-maybe">na vážkách: {w.shaky.join(", ")}</p>
              )}
              <div className="mt-2 flex gap-2">
                <button className="btn-ghost px-2 py-1 text-xs" onClick={() => onPropose(w)}>
                  → navrhnout tenhle termín
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {totalWindows > picks.length && (
        <p className="mt-2 text-xs text-ink-soft">…a dalších {totalWindows - picks.length} (překrývajících se) možností.</p>
      )}
    </div>
  );
}

function Bar({ can, shaky, total }: { can: number; shaky: number; total: number }) {
  if (total === 0) return null;
  const hard = can - shaky;
  const pct = (n: number) => `${(n / total) * 100}%`;
  return (
    <div className="mt-2 flex h-2.5 overflow-hidden rounded-full bg-paper2">
      <div className="bg-free" style={{ width: pct(hard) }} title={`${hard} úplně volných`} />
      <div className="bg-maybe" style={{ width: pct(shaky) }} title={`${shaky} na vážkách`} />
    </div>
  );
}

function Proposals({ trip, me, onNew }: { trip: Trip; me: string; onNew: () => void }) {
  const { dispatch } = useStore();
  const sorted = [...trip.proposals].sort((a, b) => (a.start < b.start ? -1 : a.start > b.start ? 1 : 0));

  return (
    <div className="card p-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-display text-base font-semibold">Návrhy termínů</h3>
        <button className="btn-secondary px-3 py-1.5 text-xs" onClick={onNew}>
          + návrh
        </button>
      </div>
      {sorted.length === 0 ? (
        <p className="text-sm text-ink-soft">
          Zatím žádný návrh. Vyber okno vlevo a klikni „navrhnout termín“, nebo přidej vlastní.
        </p>
      ) : (
        <ul className="space-y-3">
          {sorted.map((p) => (
            <ProposalRow key={p.id} trip={trip} proposal={p} me={me} dispatch={dispatch} />
          ))}
        </ul>
      )}
    </div>
  );
}

function ProposalRow({
  trip,
  proposal,
  me,
  dispatch,
}: {
  trip: Trip;
  proposal: Proposal;
  me: string;
  dispatch: ReturnType<typeof useStore>["dispatch"];
}) {
  const tally = { yes: 0, no: 0, maybe: 0 } as Record<VoteValue, number>;
  Object.values(proposal.votes).forEach((v) => (tally[v] += 1));
  const myVote = proposal.votes[me];

  const vote = (v: VoteValue) =>
    dispatch({ type: "voteProposal", tripId: trip.id, proposalId: proposal.id, person: me, vote: myVote === v ? null : v });

  return (
    <li className="rounded-xl border border-black/[0.06] p-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-display font-semibold">{fmtRange(proposal.start, proposal.end)}</span>
        {proposal.place && <span className="chip bg-sea-50 text-sea-700">📍 {proposal.place}</span>}
        <div className="ml-auto flex items-center gap-1">
          <button
            className="btn-primary px-3 py-1.5 text-xs"
            onClick={() => dispatch({ type: "lockTrip", tripId: trip.id, start: proposal.start, end: proposal.end, place: proposal.place })}
            title="Označit jako domluvený termín"
          >
            ✓ to je ono
          </button>
          <button className="btn-ghost px-2 py-1 text-xs" onClick={() => dispatch({ type: "removeProposal", tripId: trip.id, proposalId: proposal.id })}>
            smazat
          </button>
        </div>
      </div>
      {proposal.note && <p className="mt-1 text-sm">{proposal.note}</p>}
      {proposal.link && (
        <a href={proposal.link} target="_blank" rel="noreferrer" className="mt-1 inline-block text-xs text-sea-600 underline">
          {proposal.link}
        </a>
      )}

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <VoteBtn active={myVote === "yes"} onClick={() => vote("yes")} c="free">👍 jedu ({tally.yes})</VoteBtn>
        <VoteBtn active={myVote === "maybe"} onClick={() => vote("maybe")} c="maybe">🤷 možná ({tally.maybe})</VoteBtn>
        <VoteBtn active={myVote === "no"} onClick={() => vote("no")} c="out">👎 nemůžu ({tally.no})</VoteBtn>
        <span className="ml-auto text-[11px] text-ink-soft">navrhl {proposal.author}</span>
      </div>
    </li>
  );
}

function VoteBtn({
  active,
  onClick,
  c,
  children,
}: {
  active: boolean;
  onClick: () => void;
  c: "free" | "maybe" | "out";
  children: React.ReactNode;
}) {
  const on =
    c === "free" ? "border-free bg-free-soft text-free" : c === "maybe" ? "border-maybe bg-maybe-soft text-maybe" : "border-out bg-out-soft text-out";
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${active ? on : "border-black/10 bg-white text-ink-soft hover:bg-paper2"}`}
    >
      {children}
    </button>
  );
}

function ProposalModal({
  trip,
  me,
  prefill,
  onClose,
}: {
  trip: Trip;
  me: string;
  prefill: { start: string; end: string };
  onClose: () => void;
}) {
  const { dispatch } = useStore();
  const [place, setPlace] = useState("");
  const [start, setStart] = useState(prefill.start);
  const [end, setEnd] = useState(prefill.end);
  const [note, setNote] = useState("");
  const [link, setLink] = useState("");

  async function add() {
    if (end < start) return;
    const proposal: Proposal = {
      id: newId(),
      start,
      end,
      place: place.trim(),
      note: note.trim() || undefined,
      link: link.trim() || undefined,
      author: me,
      createdAt: new Date().toISOString(),
      votes: { [me]: "yes" },
    };
    await dispatch({ type: "addProposal", tripId: trip.id, proposal });
    onClose();
  }

  return (
    <Modal open onClose={onClose} title="Návrh termínu">
      <div className="space-y-3">
        <div>
          <label className="label">Kam (nepovinné)</label>
          <input className="input" value={place} onChange={(e) => setPlace(e.target.value)} placeholder="třeba Chorvatsko – Pag" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="label">Od</label>
            <input type="date" className="input" value={start} onChange={(e) => setStart(e.target.value)} />
          </div>
          <div>
            <label className="label">Do</label>
            <input type="date" className="input" value={end} min={start} onChange={(e) => setEnd(e.target.value)} />
          </div>
        </div>
        <div>
          <label className="label">Poznámka (nepovinné)</label>
          <input className="input" value={note} onChange={(e) => setNote(e.target.value)} placeholder="cena, ubytko, doprava…" />
        </div>
        <div>
          <label className="label">Odkaz (nepovinné)</label>
          <input className="input" value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://…" />
        </div>
        <div className="flex items-center gap-2 pt-1">
          <button className="btn-primary flex-1" onClick={add} disabled={end < start}>
            Přidat návrh
          </button>
          <button className="btn-ghost" onClick={onClose}>
            Zrušit
          </button>
        </div>
      </div>
    </Modal>
  );
}

function SettingsModal({ trip, onClose }: { trip: Trip; onClose: () => void }) {
  const { dispatch } = useStore();
  const [name, setName] = useState(trip.name);
  const [start, setStart] = useState(trip.horizonStart);
  const [end, setEnd] = useState(trip.horizonEnd);
  const [length, setLength] = useState(trip.lengthDays);
  const [minPeople, setMinPeople] = useState(trip.minPeople);

  async function save() {
    if (!name.trim() || end < start) return;
    await dispatch({
      type: "updateTrip",
      tripId: trip.id,
      patch: {
        name: name.trim(),
        horizonStart: start,
        horizonEnd: end,
        lengthDays: Math.max(1, length),
        minPeople: Math.max(1, minPeople),
      },
    });
    onClose();
  }

  return (
    <Modal open onClose={onClose} title="Nastavení výpravy">
      <div className="space-y-3">
        <div>
          <label className="label">Název</label>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
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
        <div className="flex items-center justify-between gap-2 pt-1">
          <button
            className="btn-danger"
            onClick={() => {
              if (confirm(`Opravdu smazat výpravu „${trip.name}"?`)) {
                dispatch({ type: "removeTrip", tripId: trip.id });
                window.location.href = "/";
              }
            }}
          >
            Smazat výpravu
          </button>
          <div className="flex gap-2">
            <button className="btn-ghost" onClick={onClose}>Zrušit</button>
            <button className="btn-primary" onClick={save} disabled={!name.trim() || end < start}>Uložit</button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
