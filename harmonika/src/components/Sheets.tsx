"use client";

import { useRef, useState } from "react";
import { holesRange, TUNINGS, type Direction } from "@/lib/harmonica";
import { findDef, patternTitle } from "@/lib/music";
import { routineFrom, uid, type Routine, type Settings } from "@/lib/store";
import { SheetClose, Stepper, Switch } from "./ui";

const BPM_MIN = 20;
const BPM_MAX = 240;

// ------------------------------------------------------------ BPM kolečko

function BpmDial({ bpm, onChange }: { bpm: number; onChange: (v: number) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const R = 92;
  const C = 2 * Math.PI * R;
  const frac = Math.min(1, bpm / BPM_MAX);

  const fromEvent = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    let ang = (Math.atan2(dx, -dy) * 180) / Math.PI;
    if (ang < 0) ang += 360;
    let v = Math.round((ang / 360) * BPM_MAX);
    if (Math.abs(v - bpm) > BPM_MAX / 2) v = bpm > BPM_MAX / 2 ? BPM_MAX : BPM_MIN;
    onChange(Math.max(BPM_MIN, Math.min(BPM_MAX, v)));
  };

  return (
    <div
      ref={ref}
      className="dial"
      role="slider"
      aria-label="Tempo"
      aria-valuemin={BPM_MIN}
      aria-valuemax={BPM_MAX}
      aria-valuenow={bpm}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowUp" || e.key === "ArrowRight") onChange(Math.min(BPM_MAX, bpm + 1));
        if (e.key === "ArrowDown" || e.key === "ArrowLeft") onChange(Math.max(BPM_MIN, bpm - 1));
      }}
      onWheel={(e) => onChange(Math.max(BPM_MIN, Math.min(BPM_MAX, bpm + (e.deltaY < 0 ? 1 : -1))))}
      onPointerDown={(e) => {
        dragging.current = true;
        (e.target as Element).setPointerCapture?.(e.pointerId);
        fromEvent(e);
      }}
      onPointerMove={(e) => dragging.current && fromEvent(e)}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
    >
      <svg viewBox="0 0 220 220">
        <circle cx="110" cy="110" r={R} fill="#f6f6f8" stroke="#dcdce1" strokeWidth="7" />
        <circle
          cx="110"
          cy="110"
          r={R}
          fill="none"
          stroke="#a6d86f"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={`${C * frac} ${C}`}
          transform="rotate(-90 110 110)"
        />
        <circle
          cx={110 + R * Math.sin(frac * 2 * Math.PI)}
          cy={110 - R * Math.cos(frac * 2 * Math.PI)}
          r="9"
          fill="#fff"
          stroke="#a6d86f"
          strokeWidth="4"
        />
      </svg>
      <div className="dial-center">
        <div className="dial-num">{String(bpm).padStart(3, "0")}</div>
        <div className="dial-unit">BPM</div>
      </div>
    </div>
  );
}

// ------------------------------------------------------- Playback Options

export function PlaybackSheet({
  s,
  update,
  onClose,
}: {
  s: Settings;
  update: (p: Partial<Settings>) => void;
  onClose: () => void;
}) {
  const [start, setStart] = useState(s.startHole);
  const [end, setEnd] = useState(s.endHole);
  const [reps, setReps] = useState(s.repetitions);
  const dirs: { id: Direction; label: string }[] = [
    { id: "forward", label: "Forward" },
    { id: "reverse", label: "Reverse" },
    { id: "both", label: "Both" },
  ];
  const setBpm = (v: number) => update({ bpm: v });

  return (
    <div className="sheet" role="dialog" aria-label="Playback Options">
      <SheetClose onClick={onClose} />
      <h1 className="sheet-title">
        Playback
        <br />
        Options
      </h1>
      <div className="po-grid">
        <div className="card">
          <div className="card-title">Direction</div>
          <div className="dir-btns">
            {dirs.map((d) => (
              <button
                key={d.id}
                type="button"
                className={`dir-btn ${s.direction === d.id ? "sel" : ""}`}
                onClick={() => update({ direction: d.id })}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-title">Time</div>
          <BpmDial bpm={s.bpm} onChange={setBpm} />
          <div className="bpm-step">
            <button type="button" className="round-btn wide" onClick={() => setBpm(Math.max(BPM_MIN, s.bpm - 5))}>
              −5
            </button>
            <button type="button" className="round-btn" aria-label="Tempo minus" onClick={() => setBpm(Math.max(BPM_MIN, s.bpm - 1))}>
              −
            </button>
            <button type="button" className="round-btn" aria-label="Tempo plus" onClick={() => setBpm(Math.min(BPM_MAX, s.bpm + 1))}>
              +
            </button>
            <button type="button" className="round-btn wide" onClick={() => setBpm(Math.min(BPM_MAX, s.bpm + 5))}>
              +5
            </button>
          </div>
          <div className="toggle-row">
            <Switch on={s.metronome} onChange={(v) => update({ metronome: v })} label="Metronome" />
            <span>Metronome</span>
          </div>
        </div>

        <div className="card white">
          <div className="card-title">Range &amp; Repetitions</div>
          <Stepper
            label="Start hole"
            value={start}
            min={1}
            max={s.holes}
            onChange={(v) => {
              setStart(v);
              if (v > end) setEnd(v);
            }}
          />
          <Stepper
            label="End hole"
            value={end}
            min={1}
            max={s.holes}
            onChange={(v) => {
              setEnd(v);
              if (v < start) setStart(v);
            }}
          />
          <Stepper label="Repetitions" value={reps} min={1} max={20} onChange={setReps} />
          <button
            type="button"
            className="apply-btn"
            onClick={() => {
              update({ startHole: start, endHole: end, repetitions: reps });
              onClose();
            }}
          >
            Apply
          </button>
        </div>
      </div>
      <p className="po-summary">
        {s.holes}-hole harmonica in {s.harpKey} ({holesRange(s.holes)}). Playback runs one note per beat through every
        highlighted note between the start and end hole.
      </p>
    </div>
  );
}

// ------------------------------------------------------------------ rutiny

function describe(r: Routine["settings"]) {
  const def = findDef(r.mode, r.mode === "scale" ? r.scaleId : r.arpId);
  const dir = r.direction === "both" ? "Both" : r.direction === "forward" ? "Forward" : "Reverse";
  return `${patternTitle(r.mode, def, r.key)} · ${r.bpm} BPM · ${dir} · holes ${r.startHole}–${r.endHole} · ×${r.repetitions} · ${r.holes}-hole ${r.harpKey} harp${r.metronome ? " · metronome" : ""}`;
}

export function RoutinesSheet({
  s,
  routines,
  setRoutines,
  onLoad,
  onClose,
}: {
  s: Settings;
  routines: Routine[];
  setRoutines: (r: Routine[]) => void;
  onLoad: (r: Routine, play: boolean) => void;
  onClose: () => void;
}) {
  const def = findDef(s.mode, s.mode === "scale" ? s.scaleId : s.arpId);
  const suggested = `${patternTitle(s.mode, def, s.key)} · ${s.bpm} BPM`;
  const [name, setName] = useState("");

  return (
    <div className="sheet" role="dialog" aria-label="My Routines">
      <SheetClose onClick={onClose} />
      <h1 className="sheet-title">My Routines</h1>
      <p className="sheet-sub">Save the current exercise (scale or arpeggio, key, tempo, direction, range and repetitions) and recall it with one tap.</p>

      <div className="list-card">
        <div className="list-row">
          <div className="grow">
            <div className="set-label" style={{ marginBottom: 8 }}>
              Save current setup
            </div>
            <input
              className="text-input"
              value={name}
              placeholder={suggested}
              onChange={(e) => setName(e.target.value)}
              maxLength={60}
            />
            <div className="r-desc" style={{ marginTop: 6 }}>
              {describe(routineFrom(s))}
            </div>
          </div>
          <button
            type="button"
            className="small-btn green"
            onClick={() => {
              const r: Routine = { id: uid(), name: name.trim() || suggested, created: Date.now(), settings: routineFrom(s) };
              setRoutines([r, ...routines]);
              setName("");
            }}
          >
            Save
          </button>
        </div>
      </div>

      <div className="list-card">
        {routines.length === 0 ? (
          <div className="empty">No routines yet. Set up an exercise on the main screen and save it here.</div>
        ) : (
          routines.map((r) => (
            <div className="list-row" key={r.id}>
              <div className="grow">
                <div className="r-name">{r.name}</div>
                <div className="r-desc">{describe(r.settings)}</div>
              </div>
              <button type="button" className="small-btn teal" onClick={() => onLoad(r, true)}>
                ▶ Play
              </button>
              <button type="button" className="small-btn" onClick={() => onLoad(r, false)}>
                Load
              </button>
              <button
                type="button"
                className="small-btn danger"
                aria-label={`Delete ${r.name}`}
                onClick={() => setRoutines(routines.filter((x) => x.id !== r.id))}
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// --------------------------------------------------------------- nastavení

export function SettingsSheet({
  s,
  update,
  onResetLessons,
  onResetSettings,
  onClose,
}: {
  s: Settings;
  update: (p: Partial<Settings>) => void;
  onResetLessons: () => void;
  onResetSettings: () => void;
  onClose: () => void;
}) {
  return (
    <div className="sheet" role="dialog" aria-label="Settings">
      <SheetClose onClick={onClose} />
      <h1 className="sheet-title">Harmonica &amp; Sound</h1>

      <div className="list-card">
        <div className="list-row">
          <div className="grow">
            <div className="set-label">Tuning</div>
            <div className="set-desc">Solo tuning is the standard chromatic layout (top hole slide-draw = D).</div>
          </div>
          <div className="seg-mini">
            {TUNINGS.map((t) => (
              <button key={t.id} type="button" className={s.tuning === t.id ? "sel" : ""} onClick={() => update({ tuning: t.id })}>
                {t.name}
              </button>
            ))}
          </div>
        </div>
        <div className="list-row">
          <div className="grow">
            <div className="set-label">Cell labels</div>
            <div className="set-desc">Show note names or scale degrees (intervals) on the grid.</div>
          </div>
          <div className="seg-mini">
            <button type="button" className={s.labels === "notes" ? "sel" : ""} onClick={() => update({ labels: "notes" })}>
              Notes
            </button>
            <button type="button" className={s.labels === "degrees" ? "sel" : ""} onClick={() => update({ labels: "degrees" })}>
              Degrees
            </button>
          </div>
        </div>
        <div className="list-row">
          <div className="grow">
            <div className="set-label">Tuner reference</div>
            <div className="set-desc">Concert pitch A4 used by the tuner and by the sound.</div>
          </div>
          <div className="stepper" style={{ margin: 0 }}>
            <button type="button" className="round-btn" aria-label="A4 minus" onClick={() => update({ a4: Math.max(430, s.a4 - 1) })}>
              −
            </button>
            <span className="val" style={{ minWidth: 86 }}>
              {s.a4} Hz
            </span>
            <button type="button" className="round-btn" aria-label="A4 plus" onClick={() => update({ a4: Math.min(450, s.a4 + 1) })}>
              +
            </button>
          </div>
        </div>
      </div>

      <div className="list-card">
        <div className="list-row">
          <div className="grow">
            <div className="set-label">Play notes on tap</div>
            <div className="set-desc">Tapping a hole on the grid plays its note.</div>
          </div>
          <Switch on={s.tapToPlay} onChange={(v) => update({ tapToPlay: v })} label="Play notes on tap" />
        </div>
        <div className="list-row">
          <div className="grow">
            <div className="set-label">Volume</div>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={s.volume}
            aria-label="Volume"
            onChange={(e) => update({ volume: parseFloat(e.target.value) })}
          />
        </div>
      </div>

      <div className="list-card">
        <div className="list-row">
          <div className="grow">
            <div className="set-label">Reset lesson progress</div>
            <div className="set-desc">Locks lessons 4–8 again and clears time and interactions.</div>
          </div>
          <button
            type="button"
            className="small-btn danger"
            onClick={() => {
              if (window.confirm("Reset all lesson progress?")) onResetLessons();
            }}
          >
            Reset
          </button>
        </div>
        <div className="list-row">
          <div className="grow">
            <div className="set-label">Reset settings</div>
            <div className="set-desc">Back to 12 holes, C harmonica, C Major, 90 BPM.</div>
          </div>
          <button
            type="button"
            className="small-btn danger"
            onClick={() => {
              if (window.confirm("Reset all settings to defaults?")) onResetSettings();
            }}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

export function AboutSheet({ onClose }: { onClose: () => void }) {
  return (
    <div className="sheet about" role="dialog" aria-label="About">
      <SheetClose onClick={onClose} />
      <h1 className="sheet-title">About</h1>
      <p>
        <b>Chromatic Harp Trainer</b> — practise scales and arpeggios on the chromatic harmonica. The grid shows every hole
        with blow, draw and the slide: the root is orange, the other notes of the scale are blue and everything else is
        grey.
      </p>
      <p>
        <b>▶ Play</b> runs the selected scale or arpeggio through the chosen range with the tempo, direction and
        repetitions from <i>Menu → Playback Options</i>. The <b>metronome</b> button starts a click track, the{" "}
        <b>tuning fork</b> starts the tuner — play a note and the matching hole shows a line: high in the box = sharp,
        low = flat.
      </p>
      <p>
        <b>Install on iPad / iPhone:</b> open the page in Safari → Share → <i>Add to Home Screen</i>. The app then opens
        full screen and works offline after the first visit.
      </p>
      <p>Your settings, routines and lesson progress are stored only in this browser.</p>
    </div>
  );
}
