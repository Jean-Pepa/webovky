"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { playNote, setA4, setVolume, unlockAudio } from "@/lib/audio";
import { buildLayout, buildSequence, posKey } from "@/lib/harmonica";
import { buildPattern, findDef, mod12, noteBarList, patternTitle, pcOfName } from "@/lib/music";
import { ZONE_COLOR } from "@/lib/pitch";
import {
  DEFAULT_SETTINGS,
  loadLessons,
  loadRoutines,
  loadSettings,
  saveLessons,
  saveRoutines,
  saveSettings,
  type LessonProgress,
  type Routine,
  type Settings,
} from "@/lib/store";
import HarpGrid from "./HarpGrid";
import { usePlayer, useTuner } from "./hooks";
import Learning from "./learning/Learning";
import { HarpKeyPicker, HolesPicker, KeyPicker, PatternPicker } from "./Pickers";
import { AboutSheet, PlaybackSheet, RoutinesSheet, SettingsSheet } from "./Sheets";
import TunerPanel from "./TunerPanel";
import { ForkIcon, MetronomeIcon, PlayIcon, Popover, StopIcon } from "./ui";

type PickType = "holes" | "harp" | "pattern" | "key" | "menu";
type SheetType = "playback" | "routines" | "settings" | "about" | null;

// Změny, které mění přehrávanou sekvenci → přehrávání se zastaví.
const SEQ_KEYS = new Set<keyof Settings>([
  "mode",
  "holes",
  "harpKey",
  "tuning",
  "scaleId",
  "arpId",
  "key",
  "direction",
  "startHole",
  "endHole",
  "repetitions",
]);

export default function HarmonicaApp() {
  const [s, setS] = useState<Settings>(() => loadSettings());
  const [routines, setRoutinesState] = useState<Routine[]>(() => loadRoutines());
  const [progress, setProgressState] = useState<Record<string, LessonProgress>>(() => loadLessons());
  const [pick, setPick] = useState<{ type: PickType; el: HTMLElement } | null>(null);
  const [sheet, setSheet] = useState<SheetType>(null);
  const [learnOpen, setLearnOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef(0);

  const { playing, metro, current, beat, api: player } = usePlayer();
  const tuner = useTuner(s.a4);

  useEffect(() => saveSettings(s), [s]);
  useEffect(() => setA4(s.a4), [s.a4]);
  useEffect(() => setVolume(s.volume), [s.volume]);
  useEffect(() => player.configure(s.bpm, s.metronome), [player, s.bpm, s.metronome]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2600);
  }, []);

  const update = useCallback(
    (patch: Partial<Settings>) => {
      if (player.isPlaying() && (Object.keys(patch) as (keyof Settings)[]).some((k) => SEQ_KEYS.has(k))) player.stop();
      setS((prev) => {
        const next = { ...prev, ...patch };
        if (patch.holes !== undefined && patch.holes !== prev.holes && patch.startHole === undefined) {
          next.startHole = 1;
          next.endHole = patch.holes;
        }
        return next;
      });
    },
    [player],
  );

  const setRoutines = useCallback((r: Routine[]) => {
    setRoutinesState(r);
    saveRoutines(r);
  }, []);

  const setProgress = useCallback((fn: (p: Record<string, LessonProgress>) => Record<string, LessonProgress>) => {
    setProgressState((prev) => {
      const next = fn(prev);
      saveLessons(next);
      return next;
    });
  }, []);

  const def = findDef(s.mode, s.mode === "scale" ? s.scaleId : s.arpId);
  const pattern = useMemo(() => buildPattern(s.key, def), [s.key, def]);
  const layout = useMemo(() => buildLayout(s.holes, s.tuning, s.harpKey), [s.holes, s.tuning, s.harpKey]);
  const seq = useMemo(
    () => buildSequence(layout, pattern.pcs, s.startHole, s.endHole, s.direction, s.repetitions),
    [layout, pattern, s.startHole, s.endHole, s.direction, s.repetitions],
  );

  const title = patternTitle(s.mode, def, s.key);
  const noteList = noteBarList(pattern);
  const curPc = current ? mod12(current.midi) : null;
  const fullRange = s.startHole === 1 && s.endHole === s.holes;

  const togglePlay = () => {
    if (playing) {
      player.stop();
      return;
    }
    if (!seq.length) {
      showToast("No notes of this pattern in the selected hole range.");
      return;
    }
    player.play(seq);
  };

  const onTap = (midi: number) => {
    if (!s.tapToPlay) return;
    unlockAudio();
    playNote(midi, undefined, 0.7);
  };

  const loadRoutine = (r: Routine, play: boolean) => {
    const next = { ...s, ...r.settings };
    update(r.settings);
    setSheet(null);
    if (play) {
      const lay = buildLayout(next.holes, next.tuning, next.harpKey);
      const pat = buildPattern(next.key, findDef(next.mode, next.mode === "scale" ? next.scaleId : next.arpId));
      const sq = buildSequence(lay, pat.pcs, next.startHole, next.endHole, next.direction, next.repetitions);
      window.setTimeout(() => player.play(sq), 30);
    } else {
      showToast(`Loaded “${r.name}”`);
    }
  };

  const open = (type: PickType) => (e: React.MouseEvent<HTMLElement>) => setPick({ type, el: e.currentTarget });
  const closePick = () => setPick(null);

  const detect =
    tuner.on && tuner.reading?.fresh
      ? { midi: tuner.reading.midi, cents: tuner.reading.cents, color: ZONE_COLOR[tuner.reading.zone] }
      : null;

  return (
    <main className="app">
      <header className="topbar">
        <button type="button" className="btn menu-btn" onClick={open("menu")}>
          Menu
        </button>
        <div className="topbar-center">
          <button
            type="button"
            className={`icon-btn ${metro ? "on" : ""} ${metro ? (beat % 2 ? "beat" : "beat2") : ""}`}
            aria-label="Metronome"
            aria-pressed={metro}
            onClick={player.toggleMetronome}
          >
            <MetronomeIcon />
          </button>
          <button
            type="button"
            className={`icon-btn ${playing ? "on" : ""}`}
            aria-label={playing ? "Stop" : "Play"}
            onClick={togglePlay}
          >
            {playing ? <StopIcon /> : <PlayIcon />}
          </button>
          <button
            type="button"
            className={`icon-btn ${tuner.on ? "on" : ""}`}
            aria-label="Tuner"
            aria-pressed={tuner.on}
            onClick={() => (tuner.on ? tuner.stop() : void tuner.start())}
          >
            <ForkIcon />
          </button>
        </div>
        <button type="button" className="btn learn-btn" onClick={() => setLearnOpen(true)}>
          <span className="emoji">📚</span> Learning
        </button>
      </header>

      <div className="controls">
        <div className="seg" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={s.mode === "scale"}
            className={s.mode === "scale" ? "sel" : ""}
            onClick={() => update({ mode: "scale" })}
          >
            Scale
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={s.mode === "arpeggio"}
            className={s.mode === "arpeggio" ? "sel" : ""}
            onClick={() => update({ mode: "arpeggio" })}
          >
            Arpeggios
          </button>
        </div>
        <button type="button" className="chip lime" onClick={open("holes")}>
          <span className="chip-label">Holes</span>
          <span className="chip-value">{s.holes}</span>
        </button>
        <button type="button" className="chip cyan" onClick={open("harp")}>
          <span className="chip-label">Harmonica</span>
          <span className="chip-value">{s.harpKey}</span>
        </button>
        <button type="button" className="chip lime" onClick={open("pattern")}>
          <span className="chip-label">{s.mode === "scale" ? "Scale" : "Arpeggio"}</span>
          <span className="chip-value">{title}</span>
        </button>
        <button type="button" className="chip orange" onClick={open("key")}>
          <span className="chip-label">Key</span>
          <span className="chip-value">{s.key}</span>
        </button>
      </div>

      <div className="info">
        <div className="info-box">
          <span className="info-label">Note</span>
          {noteList.map((n, i) => (
            <span key={i} className={curPc !== null && pcOfName(n) === curPc ? "hl" : ""}>
              {n}
            </span>
          ))}
        </div>
        <div className="info-box">
          <span className="info-label">Degrees</span>
          {pattern.degrees.map((d, i) => (
            <span key={i} className={curPc !== null && pcOfName(pattern.notes[i]) === curPc ? "hl" : ""}>
              {d}
            </span>
          ))}
        </div>
      </div>

      <HarpGrid
        layout={layout}
        pattern={pattern}
        labels={s.labels}
        playingKey={current ? posKey(current) : null}
        detect={detect}
        onTap={onTap}
        range={fullRange ? undefined : [s.startHole, s.endHole]}
      />
      <div className="rotate-hint">↔ Swipe the grid sideways — or turn the phone to see all {s.holes} holes.</div>

      {tuner.on && <TunerPanel reading={tuner.reading} error={tuner.error} starting={tuner.starting} />}

      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}

      {pick && (
        <Popover
          anchor={pick.el}
          onClose={closePick}
          align={pick.type === "menu" ? "left" : "center"}
        >
          {pick.type === "holes" && (
            <HolesPicker
              value={s.holes}
              onPick={(v) => {
                update({ holes: v });
                closePick();
              }}
            />
          )}
          {pick.type === "harp" && (
            <HarpKeyPicker
              value={s.harpKey}
              onPick={(v) => {
                update({ harpKey: v });
                closePick();
              }}
            />
          )}
          {pick.type === "key" && (
            <KeyPicker
              value={s.key}
              onPick={(v) => {
                update({ key: v });
                closePick();
              }}
            />
          )}
          {pick.type === "pattern" && (
            <PatternPicker
              mode={s.mode}
              value={s.mode === "scale" ? s.scaleId : s.arpId}
              keyName={s.key}
              onPick={(id) => {
                update(s.mode === "scale" ? { scaleId: id } : { arpId: id });
                closePick();
              }}
            />
          )}
          {pick.type === "menu" && (
            <div className="menu-list">
              {(
                [
                  ["⏱", "Playback Options", () => setSheet("playback")],
                  ["⭐️", "My Routines", () => setSheet("routines")],
                  ["🎚", "Harmonica & Sound", () => setSheet("settings")],
                  ["📚", "Learning", () => setLearnOpen(true)],
                  ["ℹ️", "About", () => setSheet("about")],
                ] as [string, string, () => void][]
              ).map(([icon, label, fn], i) => (
                <div key={label}>
                  {i === 3 && <div className="menu-sep" />}
                  <button
                    type="button"
                    className="menu-item"
                    onClick={() => {
                      closePick();
                      fn();
                    }}
                  >
                    <span className="mi-icon">{icon}</span>
                    {label}
                  </button>
                </div>
              ))}
            </div>
          )}
        </Popover>
      )}

      {sheet === "playback" && <PlaybackSheet s={s} update={update} onClose={() => setSheet(null)} />}
      {sheet === "routines" && (
        <RoutinesSheet
          s={s}
          routines={routines}
          setRoutines={setRoutines}
          onLoad={loadRoutine}
          onClose={() => setSheet(null)}
        />
      )}
      {sheet === "settings" && (
        <SettingsSheet
          s={s}
          update={update}
          onResetLessons={() => setProgress(() => ({}))}
          onResetSettings={() => update({ ...DEFAULT_SETTINGS })}
          onClose={() => setSheet(null)}
        />
      )}
      {sheet === "about" && <AboutSheet onClose={() => setSheet(null)} />}

      {learnOpen && (
        <Learning
          progress={progress}
          setProgress={setProgress}
          onClose={() => setLearnOpen(false)}
          onPractice={(patch) => {
            update(patch);
            setLearnOpen(false);
            showToast("Loaded into the trainer — press ▶ to play.");
          }}
          onAddRoutine={(r) => setRoutines([r, ...loadRoutines()])}
        />
      )}
    </main>
  );
}
