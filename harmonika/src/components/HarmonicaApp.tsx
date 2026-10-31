"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { playNote, setA4, setVolume, unlockAudio } from "@/lib/audio";
import { HOLES, buildLayout, buildSequence, choosePositions, layoutRange, posKey } from "@/lib/harmonica";
import { buildPattern, findDef, mod12, noteBarList, patternTitle, pcOfName } from "@/lib/music";
import { ZONE_COLOR } from "@/lib/pitch";
import { findSong, parseSong, songKeyLabel, songPattern, transposeSong } from "@/lib/songs";
import {
  DEFAULT_SETTINGS,
  loadLessons,
  loadRoutines,
  loadSettings,
  loadSongScores,
  sanitize,
  saveLessons,
  saveRoutines,
  saveSettings,
  saveSongScores,
  type LessonProgress,
  type Routine,
  type Settings,
  type SongScore,
} from "@/lib/store";
import HarpGrid from "./HarpGrid";
import { usePlayer, usePractice, useTuner, type SongPlayEvent } from "./hooks";
import Learning from "./learning/Learning";
import { HarpKeyPicker, KeyPicker, PatternPicker, SongPicker } from "./Pickers";
import { AboutSheet, PlaybackSheet, RoutinesSheet, SettingsSheet } from "./Sheets";
import SongBar from "./SongBar";
import TunerPanel from "./TunerPanel";
import { ForkIcon, MetronomeIcon, PlayIcon, Popover, StopIcon } from "./ui";

type PickType = "harp" | "pattern" | "key" | "song" | "menu";
type SheetType = "playback" | "routines" | "settings" | "about" | null;

// Změny, které mění přehrávanou sekvenci → přehrávání i procvičování se zastaví.
const SEQ_KEYS = new Set<keyof Settings>([
  "mode",
  "harpKey",
  "tuning",
  "scaleId",
  "arpId",
  "key",
  "songId",
  "songKey",
  "direction",
  "startHole",
  "endHole",
  "repetitions",
]);

/** Písnička v aktuální tónině a s prstokladem pro danou harmoniku. */
function songSetup(songId: string, songKey: string | null, tuning: string, harpKey: string) {
  const def = findSong(songId);
  const layout = buildLayout(tuning, harpKey);
  const [lo, hi] = layoutRange(layout);
  const root = songKey ?? def.key;
  const events = transposeSong(parseSong(def), def.key, root, lo, hi);
  const positions = choosePositions(
    layout,
    events.map((e) => e.midi),
  );
  const playEvents: SongPlayEvent[] = events.map((e) => ({ idx: e.idx, midi: e.midi, q: e.q, dur: e.dur, pos: positions[e.idx] }));
  const practiceNotes = events
    .filter((e) => e.midi !== null && positions[e.idx])
    .map((e) => ({ idx: e.idx, midi: e.midi! }));
  return { def, root, events, positions, playEvents, practiceNotes, pattern: songPattern(events, root) };
}

export default function HarmonicaApp() {
  const [s, setS] = useState<Settings>(() => loadSettings());
  const [routines, setRoutinesState] = useState<Routine[]>(() => loadRoutines());
  const [progress, setProgressState] = useState<Record<string, LessonProgress>>(() => loadLessons());
  const [scores, setScores] = useState<Record<string, SongScore>>(() => loadSongScores());
  const [pick, setPick] = useState<{ type: PickType; el: HTMLElement } | null>(null);
  const [sheet, setSheet] = useState<SheetType>(null);
  const [learnOpen, setLearnOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [cursor, setCursor] = useState(0);
  const toastTimer = useRef(0);
  const tunerByPractice = useRef(false);

  const { playing, metro, current, songIdx, beat, api: player } = usePlayer();
  const tuner = useTuner(s.a4);
  const { start: tunerStart, stop: tunerStop, setListener } = tuner;

  useEffect(() => saveSettings(s), [s]);
  useEffect(() => setA4(s.a4), [s.a4]);
  useEffect(() => setVolume(s.volume), [s.volume]);
  useEffect(() => player.configure(s.bpm, s.metronome, s.songSound), [player, s.bpm, s.metronome, s.songSound]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2800);
  }, []);

  const song = useMemo(() => songSetup(s.songId, s.songKey, s.tuning, s.harpKey), [s.songId, s.songKey, s.tuning, s.harpKey]);

  // Konec procvičování: ulož nejlepší výsledek, vypni mikrofon, pokud ho zapnulo procvičování.
  const onPracticeDone = useCallback(
    (first: number, total: number) => {
      const pct = total ? Math.round((first / total) * 100) : 0;
      setScores((prev) => {
        const cur = prev[song.def.id] ?? { best: 0, plays: 0 };
        const next = { ...prev, [song.def.id]: { best: Math.max(cur.best, pct), plays: cur.plays + 1 } };
        saveSongScores(next);
        return next;
      });
      showToast(`🎉 ${song.def.title}: ${pct}% first try`);
      if (tunerByPractice.current) {
        tunerByPractice.current = false;
        tunerStop();
      }
    },
    [song.def.id, song.def.title, showToast, tunerStop],
  );
  const practice = usePractice(onPracticeDone);
  const { onFrame: practiceFrame, start: practiceStart, stop: practiceStop, isOn: practiceIsOn } = practice;

  useEffect(() => {
    setListener(practiceFrame);
    return () => setListener(null);
  }, [setListener, practiceFrame]);

  const stopPractice = useCallback(() => {
    practiceStop();
    if (tunerByPractice.current) {
      tunerByPractice.current = false;
      tunerStop();
    }
  }, [practiceStop, tunerStop]);

  const update = useCallback(
    (patch: Partial<Settings>) => {
      const touches = (Object.keys(patch) as (keyof Settings)[]).some((k) => SEQ_KEYS.has(k));
      if (touches && player.isPlaying()) player.stop();
      if (touches && practiceIsOn()) stopPractice();
      setS((prev) => sanitize({ ...prev, ...patch }));
    },
    [player, practiceIsOn, stopPractice],
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

  const isSong = s.mode === "song";
  const patternMode = s.mode === "arpeggio" ? "arpeggio" : "scale";
  const def = findDef(patternMode, patternMode === "scale" ? s.scaleId : s.arpId);
  const scalePattern = useMemo(() => buildPattern(s.key, def), [s.key, def]);
  const layout = useMemo(() => buildLayout(s.tuning, s.harpKey), [s.tuning, s.harpKey]);
  const seq = useMemo(
    () => buildSequence(layout, scalePattern.pcs, s.startHole, s.endHole, s.direction, s.repetitions),
    [layout, scalePattern, s.startHole, s.endHole, s.direction, s.repetitions],
  );
  const pattern = isSong ? song.pattern : scalePattern;

  const title = patternTitle(patternMode, def, s.key);
  const noteList = noteBarList(scalePattern);
  const curPc = current ? mod12(current.midi) : null;
  const fullRange = s.startHole === 1 && s.endHole === HOLES;

  const targetIdx = practice.state.on ? (song.practiceNotes[practice.state.i]?.idx ?? null) : null;
  const targetPos = targetIdx !== null ? song.positions[targetIdx] : null;
  const playingKey = current ? posKey(current) : targetPos ? posKey(targetPos) : null;

  const playSong = (sd: ReturnType<typeof songSetup>, settings: Settings, from: number) => {
    player.playSong(sd.playEvents, {
      beatQ: sd.def.beat,
      barBeats: sd.def.bar,
      pickup: sd.def.pickup ?? 0,
      countIn: settings.metronome,
      reps: settings.repetitions,
      startIdx: from,
    });
  };

  const togglePlay = () => {
    if (playing) {
      player.stop();
      return;
    }
    if (isSong) {
      if (practiceIsOn()) stopPractice();
      playSong(song, s, cursor);
      return;
    }
    if (!seq.length) {
      showToast("No notes of this pattern in the selected hole range.");
      return;
    }
    player.play(seq);
  };

  const togglePractice = () => {
    if (practice.state.on) {
      stopPractice();
      return;
    }
    if (player.isPlaying()) player.stop();
    if (!tuner.on) {
      tunerByPractice.current = true;
      void tunerStart();
    }
    practiceStart(song.practiceNotes, cursor);
  };

  const onTap = (midi: number) => {
    if (!s.tapToPlay) return;
    unlockAudio();
    playNote(midi, undefined, 0.7);
  };

  const loadRoutine = (r: Routine, play: boolean) => {
    const next = sanitize({ ...s, ...r.settings });
    update(r.settings);
    setCursor(0);
    setSheet(null);
    if (!play) {
      showToast(`Loaded “${r.name}”`);
      return;
    }
    window.setTimeout(() => {
      if (next.mode === "song") {
        playSong(songSetup(next.songId, next.songKey, next.tuning, next.harpKey), next, 0);
      } else {
        const lay = buildLayout(next.tuning, next.harpKey);
        const pat = buildPattern(next.key, findDef(next.mode, next.mode === "scale" ? next.scaleId : next.arpId));
        player.play(buildSequence(lay, pat.pcs, next.startHole, next.endHole, next.direction, next.repetitions));
      }
    }, 30);
  };

  const open = (type: PickType) => (e: React.MouseEvent<HTMLElement>) => setPick({ type, el: e.currentTarget });
  const closePick = () => setPick(null);

  const detect =
    tuner.on && tuner.reading?.fresh
      ? { midi: tuner.reading.midi, cents: tuner.reading.cents, color: ZONE_COLOR[tuner.reading.zone] }
      : null;

  const clicking = metro || (playing && s.metronome);

  return (
    <main className={`app ${isSong ? "song" : ""}`}>
      <header className="topbar">
        <button type="button" className="btn menu-btn" onClick={open("menu")}>
          Menu
        </button>
        <div className="topbar-center">
          <button
            type="button"
            className={`icon-btn ${metro ? "on" : ""} ${clicking ? (beat % 2 ? "beat" : "beat2") : ""}`}
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
            onClick={() => {
              if (tuner.on) {
                if (practiceIsOn()) stopPractice();
                tunerByPractice.current = false;
                tunerStop();
              } else void tunerStart();
            }}
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
          {(
            [
              ["scale", "Scale"],
              ["arpeggio", "Arpeggios"],
              ["song", "Songs"],
            ] as const
          ).map(([m, label]) => (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={s.mode === m}
              className={s.mode === m ? "sel" : ""}
              onClick={() => update({ mode: m })}
            >
              {label}
            </button>
          ))}
        </div>
        <span className="chip lime static" title="12-hole chromatic harmonica (C4 – D7 in C)">
          <span className="chip-label">Holes</span>
          <span className="chip-value">{HOLES}</span>
        </span>
        <button type="button" className="chip cyan" onClick={open("harp")}>
          <span className="chip-label">Harmonica</span>
          <span className="chip-value">{s.harpKey}</span>
        </button>
        {isSong ? (
          <button type="button" className="chip lime song-chip" onClick={open("song")}>
            <span className="chip-label">Song</span>
            <span className="chip-value">{song.def.title}</span>
          </button>
        ) : (
          <button type="button" className="chip lime" onClick={open("pattern")}>
            <span className="chip-label">{s.mode === "scale" ? "Scale" : "Arpeggio"}</span>
            <span className="chip-value">{title}</span>
          </button>
        )}
        <button type="button" className="chip orange" onClick={open("key")}>
          <span className="chip-label">Key</span>
          <span className="chip-value">{isSong ? songKeyLabel(song.def, song.root) : s.key}</span>
        </button>
      </div>

      {isSong ? (
        <SongBar
          def={song.def}
          keyLabel={songKeyLabel(song.def, song.root)}
          events={song.events}
          positions={song.positions}
          pattern={song.pattern}
          activeIdx={playing ? songIdx : targetIdx}
          cursor={cursor}
          practice={practice.state}
          targetIdx={targetIdx}
          sound={s.songSound}
          best={scores[song.def.id]?.best ?? null}
          onSeek={(idx) => {
            setCursor(idx);
            const ev = song.events[idx];
            if (ev && ev.midi !== null && s.tapToPlay && !playing) {
              unlockAudio();
              playNote(ev.midi, undefined, 0.5);
            }
            if (practice.state.on) practiceStart(song.practiceNotes, idx);
          }}
          onToggleSound={() => update({ songSound: !s.songSound })}
          onTogglePractice={togglePractice}
          onRestart={() => {
            setCursor(0);
            if (player.isPlaying()) player.stop();
            if (practice.state.on) practiceStart(song.practiceNotes, 0);
          }}
        />
      ) : (
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
            {scalePattern.degrees.map((d, i) => (
              <span key={i} className={curPc !== null && pcOfName(scalePattern.notes[i]) === curPc ? "hl" : ""}>
                {d}
              </span>
            ))}
          </div>
        </div>
      )}

      <HarpGrid
        layout={layout}
        pattern={pattern}
        labels={s.labels}
        playingKey={playingKey}
        detect={detect}
        onTap={onTap}
        range={isSong || fullRange ? undefined : [s.startHole, s.endHole]}
      />
      <div className="rotate-hint">↔ Swipe the grid sideways — or turn the phone to see all {HOLES} holes.</div>

      {tuner.on && <TunerPanel reading={tuner.reading} error={tuner.error} starting={tuner.starting} />}

      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}

      {pick && (
        <Popover anchor={pick.el} onClose={closePick} align={pick.type === "menu" ? "left" : "center"}>
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
              value={isSong ? song.root : s.key}
              onPick={(v) => {
                if (isSong) {
                  update({ songKey: v === song.def.key ? null : v });
                  setCursor(0);
                } else update({ key: v });
                closePick();
              }}
            />
          )}
          {pick.type === "pattern" && (
            <PatternPicker
              mode={patternMode}
              value={patternMode === "scale" ? s.scaleId : s.arpId}
              keyName={s.key}
              onPick={(id) => {
                update(patternMode === "scale" ? { scaleId: id } : { arpId: id });
                closePick();
              }}
            />
          )}
          {pick.type === "song" && (
            <SongPicker
              value={s.songId}
              scores={scores}
              onPick={(id) => {
                update({ songId: id, songKey: null, bpm: findSong(id).bpm });
                setCursor(0);
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
