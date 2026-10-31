"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { playChord, playMelody, playNote, unlockAudio } from "@/lib/audio";
import { ACTION_LABEL, buildLayout, positionsOf, posKey, type Action } from "@/lib/harmonica";
import {
  ARPEGGIOS,
  CIRCLE,
  FLAT_NAMES,
  FLAT_ORDER,
  SHARP_NAMES,
  SHARP_ORDER,
  SEMITONE_INTERVALS,
  buildPattern,
  findDef,
  intervalBetween,
  midiName,
  mod12,
  noteName,
  parseInterval,
  parseNote,
  pcOfName,
  transpose,
  type Mode,
} from "@/lib/music";
import type { Routine, Settings } from "@/lib/store";
import { uid } from "@/lib/store";
import HarpGrid, { cellLabel } from "../HarpGrid";

// --------------------------------------------------------------- kontext

type Ctx = {
  interact: () => void;
  practice: (p: Partial<Settings>) => void;
  addRoutine: (r: Routine) => void;
};

export const LessonCtx = createContext<Ctx>({ interact: () => {}, practice: () => {}, addRoutine: () => {} });
const useLesson = () => useContext(LessonCtx);

const MAJOR_KEYS = ["C", "Db", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"];

/** Kořen do rozsahu G3–F#4, ať jsou ukázky v pohodlné výšce. */
function rootMidi(key: string, low = 55) {
  let m = 60 + pcOfName(key);
  while (m - 12 >= low) m -= 12;
  while (m < low) m += 12;
  return m;
}

function useLights() {
  const [lit, setLit] = useState<number | null>(null);
  const timers = useRef<number[]>([]);
  useEffect(() => {
    const list = timers.current;
    return () => list.forEach((t) => window.clearTimeout(t));
  }, []);
  const run = (count: number, step: number, map: (i: number) => number = (i) => i) => {
    timers.current.splice(0).forEach((t) => window.clearTimeout(t));
    for (let i = 0; i < count; i++) timers.current.push(window.setTimeout(() => setLit(map(i)), 50 + i * step * 1000));
    timers.current.push(window.setTimeout(() => setLit(null), 50 + count * step * 1000));
  };
  return { lit, run };
}

function KeySelect({ value, onChange }: { value: string; onChange: (k: string) => void }) {
  return (
    <div className="w-row" style={{ marginBottom: 10 }}>
      {MAJOR_KEYS.map((k) => (
        <button key={k} type="button" className={`w-btn ${k === value ? "sel" : ""}`} style={{ minWidth: 44 }} onClick={() => onChange(k)}>
          {k}
        </button>
      ))}
    </div>
  );
}

function stepName(d: number) {
  return d === 1 ? "H" : d === 2 ? "W" : d === 3 ? "m3" : d === 4 ? "M3" : `${d}`;
}

// -------------------------------------------------------------- klávesnice

export function Keyboard({
  octaves = 2,
  names = "white",
  highlight,
  rootPc,
}: {
  octaves?: number;
  names?: "white" | "both";
  highlight?: number[];
  rootPc?: number;
}) {
  const { interact } = useLesson();
  const [info, setInfo] = useState("Tap a key.");
  const [pressed, setPressed] = useState<number | null>(null);
  const from = 60;
  const whites: number[] = [];
  for (let o = 0; o < octaves; o++) for (const pc of [0, 2, 4, 5, 7, 9, 11]) whites.push(from + 12 * o + pc);
  whites.push(from + 12 * octaves);
  const n = whites.length;
  const blacks: { midi: number; left: number }[] = [];
  whites.forEach((m, i) => {
    if (i < n - 1 && [0, 2, 5, 7, 9].includes(mod12(m))) blacks.push({ midi: m + 1, left: ((i + 1) / n) * 100 });
  });
  const hl = new Set(highlight ?? []);
  const press = (m: number) => {
    unlockAudio();
    playNote(m, undefined, 0.6);
    interact();
    setPressed(m);
    const pc = mod12(m);
    const oct = Math.floor(m / 12) - 1;
    const sharp = SHARP_NAMES[pc];
    if (sharp.length === 1) setInfo(`${sharp}${oct}`);
    else setInfo(`${sharp}${oct}  =  ${FLAT_NAMES[pc]}${oct}  (enharmonic)`);
  };
  const bw = (100 / n) * 0.62;
  return (
    <div className="w-box">
      <div className="kb">
        {whites.map((m) => (
          <button
            key={m}
            type="button"
            className={`kb-white ${hl.has(mod12(m)) ? (mod12(m) === rootPc ? "root" : "lit") : ""} ${pressed === m ? "press" : ""}`}
            onPointerDown={() => press(m)}
            onPointerUp={() => setPressed(null)}
            onPointerLeave={() => setPressed(null)}
          >
            {SHARP_NAMES[mod12(m)]}
          </button>
        ))}
        {blacks.map((b) => {
          const pc = mod12(b.midi);
          return (
            <button
              key={b.midi}
              type="button"
              className={`kb-black ${hl.has(pc) ? "lit" : ""} ${pressed === b.midi ? "press" : ""}`}
              style={{ left: `calc(${b.left}% - ${bw / 2}%)`, width: `${bw}%` }}
              onPointerDown={() => press(b.midi)}
              onPointerUp={() => setPressed(null)}
              onPointerLeave={() => setPressed(null)}
            >
              {names === "both" ? (
                <span>
                  {SHARP_NAMES[pc]}
                  <br />
                  {FLAT_NAMES[pc]}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
      <div className="w-caption">
        <b>{info}</b>
      </div>
    </div>
  );
}

// ------------------------------------------------------ pravopis stupnic

export function SpellingCompare() {
  const { interact } = useLesson();
  const rows = [
    { label: "F major — correct", notes: ["F", "G", "A", "Bb", "C", "D", "E"], ok: true },
    { label: "F major — wrong (A twice, no B)", notes: ["F", "G", "A", "A#", "C", "D", "E"], ok: false },
    { label: "D major", notes: ["D", "E", "F#", "G", "A", "B", "C#"], ok: true },
    { label: "F# major (needs E#)", notes: ["F#", "G#", "A#", "B", "C#", "D#", "E#"], ok: true },
  ];
  return (
    <div className="w-box">
      {rows.map((r) => (
        <div key={r.label} style={{ marginBottom: 10 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: r.ok ? "#3d6b1f" : "#a33a28", textAlign: "center" }}>
            {r.ok ? "✓" : "✗"} {r.label}
          </div>
          <div className="w-notes">
            {r.notes.map((n, i) => (
              <span key={i} className={`w-note ${i === 0 ? "root" : ""}`} style={r.ok ? undefined : { background: "#f3dcd8" }}>
                {n}
              </span>
            ))}
            <button
              type="button"
              className="w-btn"
              onClick={() => {
                unlockAudio();
                interact();
                const root = rootMidi(r.notes[0], 60);
                const midis = r.notes.map((n) => {
                  let m = 60 + pcOfName(n);
                  while (m < root) m += 12;
                  return m;
                });
                playMelody([...midis, root + 12], 0.3, 0.28);
              }}
            >
              ▶
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ------------------------------------------------------- malá mřížka

type Choice = { label: string; key: string; mode: Mode; id: string };

export function MiniGrid({
  holes = 12,
  holeChoices,
  choices,
  initial = 0,
}: {
  holes?: number;
  holeChoices?: number[];
  choices: Choice[];
  initial?: number;
}) {
  const { interact } = useLesson();
  const [h, setH] = useState(holes);
  const [c, setC] = useState(initial);
  const [info, setInfo] = useState("Tap a hole to hear it.");
  const layout = useMemo(() => buildLayout(h, "solo", "C"), [h]);
  const cur = choices[c];
  const pattern = useMemo(() => buildPattern(cur.key, findDef(cur.mode, cur.id)), [cur]);
  return (
    <div className="w-box">
      {(choices.length > 1 || holeChoices) && (
        <div className="w-row" style={{ marginBottom: 8 }}>
          {choices.length > 1 &&
            choices.map((ch, i) => (
              <button
                key={ch.label}
                type="button"
                className={`w-btn ${i === c ? "sel" : ""}`}
                onClick={() => {
                  setC(i);
                  interact();
                }}
              >
                {ch.label}
              </button>
            ))}
          {holeChoices?.map((hh) => (
            <button
              key={hh}
              type="button"
              className={`w-btn ${hh === h ? "sel" : ""}`}
              onClick={() => {
                setH(hh);
                interact();
              }}
            >
              {hh} holes
            </button>
          ))}
        </div>
      )}
      <HarpGrid
        compact
        layout={layout}
        pattern={pattern}
        onTap={(midi, hole, action) => {
          unlockAudio();
          playNote(midi, undefined, 0.6);
          interact();
          setInfo(`Hole ${hole} · ${ACTION_LABEL[action]} → ${cellLabel(midi, pattern, "notes")} (${midiName(midi)})`);
        }}
      />
      <div className="w-caption">
        <b>{info}</b>
      </div>
    </div>
  );
}

// --------------------------------------------- interval mezi dvěma dírkami

export function IntervalFinder() {
  const { interact } = useLesson();
  const layout = useMemo(() => buildLayout(12, "solo", "C"), []);
  const pattern = useMemo(() => buildPattern("C", findDef("scale", "major")), []);
  const [picked, setPicked] = useState<{ k: string; midi: number; hole: number; action: Action }[]>([]);
  const onTap = (midi: number, hole: number, action: Action) => {
    unlockAudio();
    interact();
    const k = posKey({ hole, action });
    const next = picked.length >= 2 ? [{ k, midi, hole, action }] : [...picked, { k, midi, hole, action }];
    setPicked(next);
    if (next.length === 2) playMelody([next[0].midi, next[1].midi], 0.5, 0.45);
    else playNote(midi, undefined, 0.5);
  };
  let text = "Tap the first hole…";
  if (picked.length === 1) text = `${midiName(picked[0].midi)} (hole ${picked[0].hole} ${ACTION_LABEL[picked[0].action].toLowerCase()}) — now tap the second hole.`;
  if (picked.length === 2) {
    const iv = intervalBetween(picked[0].midi, picked[1].midi);
    text = `${midiName(picked[0].midi)} → ${midiName(picked[1].midi)}:  ${iv.short} — ${iv.long}, ${iv.semis} semitone${iv.semis === 1 ? "" : "s"}`;
  }
  return (
    <div className="w-box">
      <HarpGrid compact layout={layout} pattern={pattern} pickedKeys={new Set(picked.map((p) => p.k))} onTap={onTap} />
      <div className="w-caption">
        <b>{text}</b>
      </div>
    </div>
  );
}

// -------------------------------------------------------------- intervaly

const IV_EXAMPLES = ["C–C", "C–Db", "C–D", "C–Eb", "C–E", "C–F", "C–F# / Gb", "C–G", "C–Ab", "C–A", "C–Bb", "C–B", "C–C'"];

export function IntervalPlayer() {
  const { interact } = useLesson();
  const [harm, setHarm] = useState(false);
  const [sel, setSel] = useState<number | null>(null);
  return (
    <div className="w-box">
      <div className="w-row" style={{ marginBottom: 10 }}>
        <button type="button" className={`w-btn ${!harm ? "sel" : ""}`} onClick={() => setHarm(false)}>
          Melodic (one after another)
        </button>
        <button type="button" className={`w-btn ${harm ? "sel" : ""}`} onClick={() => setHarm(true)}>
          Harmonic (together)
        </button>
      </div>
      <div className="w-row">
        {SEMITONE_INTERVALS.map((iv, i) => (
          <button
            key={iv.short}
            type="button"
            className={`w-btn ${sel === i ? "sel" : ""}`}
            style={{ minWidth: 64 }}
            onClick={() => {
              unlockAudio();
              interact();
              setSel(i);
              if (harm) playChord([60, 60 + i], 1.2);
              else playMelody([60, 60 + i], 0.55, 0.5);
            }}
          >
            {iv.short}
            <small>{i} st</small>
          </button>
        ))}
      </div>
      <div className="w-caption">
        {sel === null ? (
          "Tap an interval to hear it from C4."
        ) : (
          <b>
            {SEMITONE_INTERVALS[sel].short} — {SEMITONE_INTERVALS[sel].long} — {sel} semitone{sel === 1 ? "" : "s"} — {IV_EXAMPLES[sel]}
          </b>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------- kvintový kruh

function annular(cx: number, cy: number, r1: number, r2: number, a0: number, a1: number) {
  const p = (r: number, a: number) => [cx + r * Math.cos(a), cy + r * Math.sin(a)].map((v) => v.toFixed(2)).join(" ");
  return `M ${p(r2, a0)} A ${r2} ${r2} 0 0 1 ${p(r2, a1)} L ${p(r1, a1)} A ${r1} ${r1} 0 0 0 ${p(r1, a0)} Z`;
}

export function CircleOfFifths() {
  const { interact } = useLesson();
  const [sel, setSel] = useState(0);
  const k = CIRCLE[sel];
  const sig =
    k.acc === 0
      ? "no sharps or flats"
      : k.acc > 0
        ? `${k.acc} sharp${k.acc > 1 ? "s" : ""}: ${SHARP_ORDER.slice(0, k.acc).join(" ")}`
        : `${-k.acc} flat${k.acc < -1 ? "s" : ""}: ${FLAT_ORDER.slice(0, -k.acc).join(" ")}`;
  const choose = (i: number) => {
    unlockAudio();
    interact();
    setSel(i);
    const p = buildPattern(CIRCLE[i].major, findDef("scale", "major"));
    const r = rootMidi(CIRCLE[i].major, 57);
    playMelody([...p.semis.map((s) => r + s), r + 12], 0.22, 0.2);
  };
  return (
    <div className="w-box">
      <svg className="circle5" viewBox="0 0 360 360">
        {CIRCLE.map((c, i) => {
          const a0 = ((i * 30 - 105) * Math.PI) / 180;
          const a1 = ((i * 30 - 75) * Math.PI) / 180;
          const mid = (a0 + a1) / 2;
          const on = i === sel;
          return (
            <g key={c.major} className="seg5" onClick={() => choose(i)}>
              <path d={annular(180, 180, 112, 172, a0, a1)} fill={on ? "#d9b6f2" : "#ffffff"} stroke="#d6d6dc" strokeWidth="1.5" />
              <path d={annular(180, 180, 66, 112, a0, a1)} fill={on ? "#ead7f8" : "#f3f3f6"} stroke="#d6d6dc" strokeWidth="1.5" />
              <text x={180 + 142 * Math.cos(mid)} y={180 + 142 * Math.sin(mid) + 7} textAnchor="middle" fontSize="20" fontWeight="700" fill="#222">
                {c.major}
              </text>
              <text x={180 + 89 * Math.cos(mid)} y={180 + 89 * Math.sin(mid) + 5} textAnchor="middle" fontSize="13" fontWeight="600" fill="#555">
                {c.minor}
              </text>
            </g>
          );
        })}
        <circle cx="180" cy="180" r="64" fill="#f1f1f4" />
        <text x="180" y="176" textAnchor="middle" fontSize="26" fontWeight="800" fill="#222">
          {k.major}
        </text>
        <text x="180" y="200" textAnchor="middle" fontSize="13" fill="#666">
          {k.minor} relative
        </text>
      </svg>
      <div className="w-caption">
        <b>
          {k.major} major / {k.minor} — {sig}
        </b>
      </div>
    </div>
  );
}

const FOURTHS = ["C", "F", "Bb", "Eb", "Ab", "Db", "Gb", "B", "E", "A", "D", "G"];

export function CirclePractice() {
  const { interact, practice } = useLesson();
  const [i, setI] = useState(0);
  const key = FOURTHS[i];
  const p = buildPattern(key, findDef("scale", "major"));
  const go = (d: number) => {
    unlockAudio();
    interact();
    const n = (i + d + 12) % 12;
    setI(n);
    const k = FOURTHS[n];
    const pp = buildPattern(k, findDef("scale", "major"));
    const r = rootMidi(k, 57);
    playMelody([...pp.semis.map((s) => r + s), r + 12], 0.22, 0.2);
  };
  return (
    <div className="w-box">
      <div className="w-steps">AROUND THE CIRCLE IN FOURTHS</div>
      <div className="w-big">{key} major</div>
      <div className="w-notes">
        {p.notes.map((n, j) => (
          <span key={j} className={`w-note ${j === 0 ? "root" : ""}`}>
            {n}
          </span>
        ))}
      </div>
      <div className="w-row" style={{ marginTop: 8 }}>
        <button type="button" className="w-btn" onClick={() => go(-1)}>
          ◀ Previous
        </button>
        <button type="button" className="w-btn teal" onClick={() => go(1)}>
          Next key ▶
        </button>
        <button
          type="button"
          className="w-btn"
          onClick={() => {
            interact();
            practice({ mode: "scale", scaleId: "major", key });
          }}
        >
          Practice {key} major in trainer ↗
        </button>
      </div>
      <div className="w-caption">
        {i + 1} / 12 · {FOURTHS.join(" → ")}
      </div>
    </div>
  );
}

// ------------------------------------------------- průzkumník stupnic/akordů

function NotesRow({ notes, degrees, lit, mark }: { notes: string[]; degrees: string[]; lit: number | null; mark?: string }) {
  return (
    <div className="w-notes">
      {notes.map((n, i) => (
        <span
          key={i}
          className={`w-note ${i === 0 ? "root" : ""} ${lit === i ? "lit" : ""}`}
          style={mark && degrees[i] === mark ? { background: "#d9b6f2" } : undefined}
        >
          {n}
          <span className="deg">{degrees[i]}</span>
        </span>
      ))}
    </div>
  );
}

export function ScaleExplorer({ ids, keyName = "C", keyChoice = false }: { ids: string[]; keyName?: string; keyChoice?: boolean }) {
  const { interact, practice } = useLesson();
  const [id, setId] = useState(ids[0]);
  const [key, setKey] = useState(keyName);
  const def = findDef("scale", id);
  const p = buildPattern(key, def);
  const { lit, run } = useLights();
  const steps = [...p.semis.slice(1), 12].map((s, i) => stepName(s - p.semis[i]));
  const play = () => {
    unlockAudio();
    interact();
    const r = rootMidi(key, 57);
    const up = [...p.semis.map((s) => r + s), r + 12];
    const seq = [...up, ...up.slice(0, -1).reverse()];
    const step = 0.26;
    playMelody(seq, step, 0.24);
    const n = p.semis.length;
    run(seq.length, step, (i) => (i <= n ? i % n : (2 * n - i) % n));
  };
  return (
    <div className="w-box">
      {keyChoice && <KeySelect value={key} onChange={setKey} />}
      {ids.length > 1 && (
        <div className="w-row" style={{ marginBottom: 6 }}>
          {ids.map((x) => (
            <button
              key={x}
              type="button"
              className={`w-btn ${x === id ? "sel" : ""}`}
              onClick={() => {
                setId(x);
                interact();
              }}
            >
              {findDef("scale", x).name}
            </button>
          ))}
        </div>
      )}
      <div className="w-big">
        {key} {def.name}
      </div>
      <NotesRow notes={p.notes} degrees={p.degrees} lit={lit} />
      <div className="w-steps">{steps.join("  ·  ")}</div>
      <div className="w-row" style={{ marginTop: 10 }}>
        <button type="button" className="w-btn teal" onClick={play}>
          ▶ Play up &amp; down
        </button>
        <button
          type="button"
          className="w-btn"
          onClick={() => {
            interact();
            practice({ mode: "scale", scaleId: id, key });
          }}
        >
          Practice in trainer ↗
        </button>
      </div>
    </div>
  );
}

export function ChordExplorer({ ids, keyName = "C" }: { ids: string[]; keyName?: string }) {
  const { interact, practice } = useLesson();
  const [id, setId] = useState(ids[0]);
  const def = findDef("arpeggio", id);
  const p = buildPattern(keyName, def);
  const { lit, run } = useLights();
  const play = () => {
    unlockAudio();
    interact();
    const r = rootMidi(keyName, 55);
    const notes = p.semis.map((s) => r + s);
    const step = 0.3;
    playMelody(notes, step, 0.3);
    playChord(notes, 1.3, notes.length * step + 0.15);
    run(notes.length, step);
  };
  return (
    <div className="w-box">
      <div className="w-row" style={{ marginBottom: 6 }}>
        {ids.map((x) => {
          const d = findDef("arpeggio", x);
          return (
            <button
              key={x}
              type="button"
              className={`w-btn ${x === id ? "sel" : ""}`}
              onClick={() => {
                setId(x);
                interact();
              }}
            >
              {keyName}
              {d.symbol ?? " " + d.name}
            </button>
          );
        })}
      </div>
      <div className="w-big">
        {keyName}
        {def.symbol ?? " " + def.name}
      </div>
      <NotesRow notes={p.notes} degrees={p.degrees} lit={lit} />
      <div className="w-row" style={{ marginTop: 10 }}>
        <button type="button" className="w-btn teal" onClick={play}>
          ▶ Arpeggio + chord
        </button>
        <button
          type="button"
          className="w-btn"
          onClick={() => {
            interact();
            practice({ mode: "arpeggio", arpId: id, key: keyName });
          }}
        >
          Practice in trainer ↗
        </button>
      </div>
    </div>
  );
}

const DIATONIC: { roman: string; arp: string }[] = [
  { roman: "Imaj7", arp: "maj7" },
  { roman: "ii m7", arp: "min7" },
  { roman: "iii m7", arp: "min7" },
  { roman: "IVmaj7", arp: "maj7" },
  { roman: "V7", arp: "dom7" },
  { roman: "vi m7", arp: "min7" },
  { roman: "viiø7", arp: "m7b5" },
];

export function DiatonicChords() {
  const { interact } = useLesson();
  const [key, setKey] = useState("C");
  const [sel, setSel] = useState(0);
  const scale = buildPattern(key, findDef("scale", "major"));
  const chords = DIATONIC.map((d, i) => {
    const root = scale.notes[i];
    const def = findDef("arpeggio", d.arp);
    return { ...d, root, def, p: buildPattern(root, def), semi: scale.semis[i] };
  });
  const c = chords[sel];
  return (
    <div className="w-box">
      <KeySelect value={key} onChange={setKey} />
      <div className="w-row">
        {chords.map((ch, i) => (
          <button
            key={i}
            type="button"
            className={`w-btn ${i === sel ? "sel" : ""}`}
            onClick={() => {
              unlockAudio();
              interact();
              setSel(i);
              const r = rootMidi(key, 55) + ch.semi;
              const notes = ch.p.semis.map((s) => r + s);
              playMelody(notes, 0.26, 0.26);
              playChord(notes, 1.2, notes.length * 0.26 + 0.1);
            }}
          >
            {ch.roman}
            <small>
              {ch.root}
              {ch.def.symbol}
            </small>
          </button>
        ))}
      </div>
      <div className="w-big">
        {c.root}
        {c.def.symbol}
      </div>
      <NotesRow notes={c.p.notes} degrees={c.p.degrees} lit={null} />
    </div>
  );
}

const MODES = [
  { id: "major", label: "Ionian", deg: 0, mark: "M7" },
  { id: "dorian", label: "Dorian", deg: 1, mark: "M6" },
  { id: "phrygian", label: "Phrygian", deg: 2, mark: "m2" },
  { id: "lydian", label: "Lydian", deg: 3, mark: "A4" },
  { id: "mixolydian", label: "Mixolydian", deg: 4, mark: "m7" },
  { id: "aeolian", label: "Aeolian", deg: 5, mark: "m6" },
  { id: "locrian", label: "Locrian", deg: 6, mark: "d5" },
];

export function ModeExplorer() {
  const { interact, practice } = useLesson();
  const [sel, setSel] = useState(0);
  const parent = buildPattern("C", findDef("scale", "major"));
  const m = MODES[sel];
  const root = parent.notes[m.deg];
  const p = buildPattern(root, findDef("scale", m.id));
  const { lit, run } = useLights();
  return (
    <div className="w-box">
      <div className="w-row">
        {MODES.map((mm, i) => (
          <button
            key={mm.id}
            type="button"
            className={`w-btn ${i === sel ? "sel" : ""}`}
            onClick={() => {
              setSel(i);
              unlockAudio();
              interact();
              const r = 60 + parent.semis[mm.deg];
              const pp = buildPattern(parent.notes[mm.deg], findDef("scale", mm.id));
              const notes = [...pp.semis.map((s) => r + s), r + 12];
              playMelody(notes, 0.24, 0.22);
              run(notes.length, 0.24, (j) => j % 7);
            }}
          >
            {parent.notes[mm.deg]} {mm.label}
          </button>
        ))}
      </div>
      <div className="w-big">
        {root} {m.label}
      </div>
      <NotesRow notes={p.notes} degrees={p.degrees} lit={lit} mark={m.mark} />
      <div className="w-caption">
        Characteristic note: <b>{p.notes[p.degrees.indexOf(m.mark)]}</b> ({m.mark}) — all white keys, starting on {root}.
      </div>
      <div className="w-row" style={{ marginTop: 8 }}>
        <button
          type="button"
          className="w-btn"
          onClick={() => {
            interact();
            practice({ mode: "scale", scaleId: m.id, key: root });
          }}
        >
          Practice {root} {m.label} in trainer ↗
        </button>
      </div>
    </div>
  );
}

const CHORD_SCALES = [
  { chord: "Cmaj7", key: "C", arp: "maj7", scale: "major", note: "Ionian (Major) — avoid holding F" },
  { chord: "Cmaj7#11", key: "C", arp: "maj7s11", scale: "lydian", note: "Lydian — the #4 is the colour" },
  { chord: "Dm7", key: "D", arp: "min7", scale: "dorian", note: "Dorian — minor with a major 6th" },
  { chord: "G7", key: "G", arp: "dom7", scale: "mixolydian", note: "Mixolydian — major with b7" },
  { chord: "G7#11", key: "G", arp: "dom7", scale: "lydianDominant", note: "Lydian Dominant — 4th mode of D melodic minor" },
  { chord: "G7alt", key: "G", arp: "dom7s9", scale: "altered", note: "Altered — b9 #9 b5 b13 (7th mode of Ab mel. minor)" },
  { chord: "G7b9", key: "G", arp: "dom7b9", scale: "diminishedHW", note: "Diminished half-whole" },
  { chord: "Bm7b5", key: "B", arp: "m7b5", scale: "locrian", note: "Locrian (or Locrian #2)" },
  { chord: "Cdim7", key: "C", arp: "dim7", scale: "diminishedWH", note: "Diminished whole-half" },
];

export function ChordScaleTable() {
  const { interact, practice } = useLesson();
  const [sel, setSel] = useState<number | null>(null);
  return (
    <div className="w-box" style={{ overflowX: "auto" }}>
      <table className="tbl">
        <thead>
          <tr>
            <th>Chord</th>
            <th>Scale</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {CHORD_SCALES.map((r, i) => (
            <tr key={r.chord} className={sel === i ? "sel" : ""}>
              <td style={{ fontWeight: 800 }}>{r.chord}</td>
              <td>
                <b>
                  {r.key} {findDef("scale", r.scale).name}
                </b>
                <div style={{ color: "#6b6b72", fontSize: 12.5 }}>{r.note}</div>
              </td>
              <td style={{ whiteSpace: "nowrap", textAlign: "right" }}>
                <button
                  type="button"
                  className="small-btn teal"
                  onClick={() => {
                    unlockAudio();
                    interact();
                    setSel(i);
                    const r0 = rootMidi(r.key, 55);
                    const ch = buildPattern(r.key, findDef("arpeggio", r.arp)).semis.map((s) => r0 + s);
                    playChord(ch, 1.0);
                    const sc = buildPattern(r.key, findDef("scale", r.scale)).semis;
                    const s0 = rootMidi(r.key, 60);
                    window.setTimeout(() => playMelody([...sc.map((s) => s0 + s), s0 + 12], 0.2, 0.19), 1100);
                  }}
                >
                  ▶
                </button>{" "}
                <button
                  type="button"
                  className="small-btn"
                  onClick={() => {
                    interact();
                    practice({ mode: "scale", scaleId: r.scale, key: r.key });
                  }}
                >
                  ↗
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ------------------------------------------------------------- ii–V–I

function iiVI(key: string) {
  const root = parseNote(key);
  const ii = noteName(transpose(root, parseInterval("M2")));
  const V = noteName(transpose(root, parseInterval("P5")));
  return [
    { name: `${ii}m7`, root: ii, p: buildPattern(ii, findDef("arpeggio", "min7")) },
    { name: `${V}7`, root: V, p: buildPattern(V, findDef("arpeggio", "dom7")) },
    { name: `${key}Maj7`, root: key, p: buildPattern(key, findDef("arpeggio", "maj7")) },
  ];
}

function nearest(pc: number, around: number) {
  let best = 0;
  let dist = Infinity;
  for (let m = around - 12; m <= around + 12; m++) {
    if (mod12(m) === pc && Math.abs(m - around) < dist) {
      best = m;
      dist = Math.abs(m - around);
    }
  }
  return best;
}

export function IIVIPlayer() {
  const { interact } = useLesson();
  const [key, setKey] = useState("C");
  const [cur, setCur] = useState<number | null>(null);
  const timers = useRef<number[]>([]);
  useEffect(() => {
    const list = timers.current;
    return () => list.forEach((t) => window.clearTimeout(t));
  }, []);
  const chords = iiVI(key);

  const mark = (i: number, at: number) => timers.current.push(window.setTimeout(() => setCur(i), at * 1000));

  // Přehrání přes časovou osu AudioContextu (ať je to rytmicky přesné).
  const playTimeline = (kind: "arp" | "guide") => {
    unlockAudio();
    interact();
    timers.current.splice(0).forEach((t) => window.clearTimeout(t));
    const step = 0.3;
    const events: { midis: number[]; at: number; dur: number }[] = [];
    let t = 0;
    if (kind === "arp") {
      chords.forEach((c, i) => {
        const r = rootMidi(c.root, 55);
        mark(i, t);
        c.p.semis.forEach((s) => {
          events.push({ midis: [r + s], at: t, dur: step * 0.95 });
          t += step;
        });
        t += step;
      });
    } else {
      let v1 = 0;
      let v2 = 0;
      chords.forEach((c, i) => {
        const third = mod12(pcOfName(c.p.notes[1]));
        const seventh = mod12(pcOfName(c.p.notes[3]));
        if (i === 0) {
          v1 = nearest(third, 65);
          v2 = nearest(seventh, v1 + 6);
        } else {
          const a1 = nearest(third, v1);
          const a2 = nearest(seventh, v2);
          const b1 = nearest(seventh, v1);
          const b2 = nearest(third, v2);
          if (Math.abs(a1 - v1) + Math.abs(a2 - v2) <= Math.abs(b1 - v1) + Math.abs(b2 - v2)) {
            v1 = a1;
            v2 = a2;
          } else {
            v1 = b1;
            v2 = b2;
          }
        }
        mark(i, t);
        events.push({ midis: [v1, v2], at: t, dur: 1.0 });
        t += 1.1;
      });
    }
    timers.current.push(window.setTimeout(() => setCur(null), (t + 0.4) * 1000));
    events.forEach((e) => (e.midis.length > 1 ? playChord(e.midis, e.dur, e.at) : playMelodyAt(e.midis[0], e.at, e.dur)));
  };

  return (
    <div className="w-box">
      <KeySelect value={key} onChange={setKey} />
      <div className="w-row">
        {chords.map((c, i) => (
          <div key={c.name} className="w-btn" style={{ minWidth: 150, outline: cur === i ? "3px solid #2d2d31" : undefined }}>
            <div style={{ fontSize: 20, fontWeight: 800 }}>{c.name}</div>
            <small>
              {c.p.notes.join(" ")} · guide tones {c.p.notes[1]} &amp; {c.p.notes[3]}
            </small>
          </div>
        ))}
      </div>
      <div className="w-row" style={{ marginTop: 10 }}>
        <button type="button" className="w-btn teal" onClick={() => playTimeline("arp")}>
          ▶ Arpeggios
        </button>
        <button type="button" className="w-btn teal" onClick={() => playTimeline("guide")}>
          ▶ Guide tones (3rds &amp; 7ths)
        </button>
      </div>
    </div>
  );
}

function playMelodyAt(midi: number, at: number, dur: number) {
  playChord([midi], dur, at);
}

// ---------------------------------------------------- přibližovací tóny

const APPROACHES = [
  { label: "Chromatic from below", notes: [71, 72] },
  { label: "Chromatic from above", notes: [73, 72] },
  { label: "Scale step from above", notes: [74, 72] },
  { label: "Enclosure (above, below, target)", notes: [74, 71, 72] },
  { label: "Double chromatic", notes: [70, 71, 72] },
  { label: "Bebop run into the 3rd", notes: [69, 68, 67, 65, 64] },
];

export function ApproachPlayer() {
  const { interact } = useLesson();
  const layout = useMemo(() => buildLayout(12, "solo", "C"), []);
  const [sel, setSel] = useState<number | null>(null);
  const where = (m: number) => {
    const ps = positionsOf(layout, m).sort((a, b) => Number(a.action.includes("Slide")) - Number(b.action.includes("Slide")));
    const p = ps[0];
    return p ? `${midiName(m)} = hole ${p.hole} ${ACTION_LABEL[p.action].toLowerCase()}` : midiName(m);
  };
  return (
    <div className="w-box">
      <div className="w-row">
        {APPROACHES.map((a, i) => (
          <button
            key={a.label}
            type="button"
            className={`w-btn ${sel === i ? "sel" : ""}`}
            onClick={() => {
              unlockAudio();
              interact();
              setSel(i);
              playMelody(a.notes, 0.34, 0.32);
            }}
          >
            {a.label}
          </button>
        ))}
      </div>
      <div className="w-caption">
        {sel === null ? "Target: C5 over Cmaj7. Tap an example." : <b>{APPROACHES[sel].notes.map(where).join("  →  ")}</b>}
      </div>
    </div>
  );
}

// ------------------------------------------------------------ rozladění

export function DetunePlayer() {
  const { interact } = useLesson();
  const [sel, setSel] = useState<number | null>(null);
  const opts = [5, 15, 25, 50];
  const zone = (c: number) => (c <= 5 ? "Perfect" : c <= 15 ? "Good" : c <= 25 ? "Fair" : "Poor");
  return (
    <div className="w-box">
      <div className="w-row">
        {opts.map((c) => (
          <button
            key={c}
            type="button"
            className={`w-btn ${sel === c ? "sel" : ""}`}
            onClick={() => {
              unlockAudio();
              interact();
              setSel(c);
              playMelody([69, 69 + c / 100], 0.9, 0.8);
              playChord([69, 69 + c / 100], 1.6, 2.0);
            }}
          >
            +{c} cents
            <small>{zone(c)}</small>
          </button>
        ))}
      </div>
      <div className="w-caption">
        {sel === null ? (
          "You hear A4 (440 Hz), the detuned note, then both together."
        ) : (
          <b>
            A4 vs. A4 +{sel} cents → tuner zone “{zone(sel)}”. Listen for the beating when they sound together.
          </b>
        )}
      </div>
    </div>
  );
}

// --------------------------------------------------------- hotové rutiny

const PRESETS: { name: string; s: Routine["settings"] }[] = [
  { name: "Warm-up · C Major · Both · 60 BPM", s: { mode: "scale", holes: 12, harpKey: "C", scaleId: "major", arpId: "maj7", key: "C", bpm: 60, direction: "both", metronome: true, startHole: 1, endHole: 12, repetitions: 2 } },
  { name: "D Dorian · 80 BPM", s: { mode: "scale", holes: 12, harpKey: "C", scaleId: "dorian", arpId: "min7", key: "D", bpm: 80, direction: "both", metronome: true, startHole: 1, endHole: 12, repetitions: 1 } },
  { name: "G Mixolydian · 80 BPM", s: { mode: "scale", holes: 12, harpKey: "C", scaleId: "mixolydian", arpId: "dom7", key: "G", bpm: 80, direction: "both", metronome: true, startHole: 1, endHole: 12, repetitions: 1 } },
  { name: "ii: Dm7 arpeggio · 90 BPM", s: { mode: "arpeggio", holes: 12, harpKey: "C", scaleId: "dorian", arpId: "min7", key: "D", bpm: 90, direction: "both", metronome: true, startHole: 1, endHole: 12, repetitions: 1 } },
  { name: "V: G7 arpeggio · 90 BPM", s: { mode: "arpeggio", holes: 12, harpKey: "C", scaleId: "mixolydian", arpId: "dom7", key: "G", bpm: 90, direction: "both", metronome: true, startHole: 1, endHole: 12, repetitions: 1 } },
  { name: "I: Cmaj7 arpeggio · 90 BPM", s: { mode: "arpeggio", holes: 12, harpKey: "C", scaleId: "major", arpId: "maj7", key: "C", bpm: 90, direction: "both", metronome: true, startHole: 1, endHole: 12, repetitions: 1 } },
  { name: "G Altered · 70 BPM", s: { mode: "scale", holes: 12, harpKey: "C", scaleId: "altered", arpId: "dom7s9", key: "G", bpm: 70, direction: "both", metronome: true, startHole: 1, endHole: 12, repetitions: 1 } },
  { name: "C Blues · 100 BPM", s: { mode: "scale", holes: 12, harpKey: "C", scaleId: "blues", arpId: "dom7", key: "C", bpm: 100, direction: "both", metronome: true, startHole: 1, endHole: 12, repetitions: 2 } },
];

export function RoutinePresets() {
  const { interact, practice, addRoutine } = useLesson();
  const [added, setAdded] = useState<Set<number>>(new Set());
  return (
    <div className="w-box" style={{ padding: 0, overflow: "hidden" }}>
      {PRESETS.map((p, i) => (
        <div className="list-row" key={p.name} style={{ background: "#fff" }}>
          <div className="grow">
            <div className="r-name" style={{ fontSize: 15 }}>
              {p.name}
            </div>
          </div>
          <button
            type="button"
            className={`small-btn ${added.has(i) ? "" : "green"}`}
            disabled={added.has(i)}
            onClick={() => {
              interact();
              addRoutine({ id: uid(), name: p.name, created: Date.now(), settings: p.s });
              setAdded(new Set(added).add(i));
            }}
          >
            {added.has(i) ? "Added ✓" : "+ My Routines"}
          </button>
          <button
            type="button"
            className="small-btn teal"
            onClick={() => {
              interact();
              practice(p.s);
            }}
          >
            Try ↗
          </button>
        </div>
      ))}
    </div>
  );
}

// re-export pro lekce
export { ARPEGGIOS };
