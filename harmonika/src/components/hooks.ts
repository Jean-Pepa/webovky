"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { audio, click, playNote, unlockAudio } from "@/lib/audio";
import type { Pos } from "@/lib/harmonica";
import { PitchDetector, zoneOf } from "@/lib/pitch";
import type { TunerReading } from "./TunerPanel";

// ---------------------------------------------------------------- přehrávač
//
// Jeden plánovač (Web Audio lookahead) pro metronom, stupnice i písničky.
// Stupnice: každá doba = jeden tón. Písnička: skutečný rytmus (délky not),
// volitelně jeden takt předtaktí metronomu.

export type SongPlayEvent = { idx: number; midi: number | null; q: number; dur: number; pos: Pos | null };

export type SongOpts = {
  /** Čtvrťových dob na jeden klik. */
  beatQ: number;
  /** Kliků na takt. */
  barBeats: number;
  pickup: number;
  countIn: boolean;
  reps: number;
  /** Index události, od které se hraje. */
  startIdx: number;
};

type SongRun = {
  ev: (SongPlayEvent & { rel: number })[];
  i: number;
  beatQ: number;
  barBeats: number;
  pickup: number;
  startQ: number;
  len: number;
  endQ: number;
  clickQ: number;
  firstClickQ: number;
  anchorQ: number;
  anchorT: number;
  spq: number;
  bpm: number;
  lastQ: number;
  lastT: number;
};

type Engine = {
  timer: number;
  next: number;
  beat: number;
  idx: number;
  playing: boolean;
  metro: boolean;
  seq: Pos[];
  song: SongRun | null;
  bpm: number;
  clicks: boolean;
  songSound: boolean;
  timeouts: Set<number>;
};

export type PlayerApi = {
  play: (seq: Pos[]) => void;
  playSong: (events: SongPlayEvent[], opts: SongOpts) => void;
  stop: () => void;
  toggleMetronome: () => void;
  configure: (bpm: number, clicks: boolean, songSound: boolean) => void;
  isPlaying: () => boolean;
};

export function usePlayer() {
  const eng = useRef<Engine>({
    timer: 0,
    next: 0,
    beat: 0,
    idx: 0,
    playing: false,
    metro: false,
    seq: [],
    song: null,
    bpm: 90,
    clicks: true,
    songSound: true,
    timeouts: new Set(),
  });
  const [playing, setPlaying] = useState(false);
  const [metro, setMetro] = useState(false);
  const [current, setCurrent] = useState<Pos | null>(null);
  const [songIdx, setSongIdx] = useState<number | null>(null);
  const [beat, setBeat] = useState(0);

  const api = useMemo<PlayerApi>(() => {
    const e = eng.current;

    const at = (t: number, fn: () => void) => {
      const delay = Math.max(0, (t - audio().currentTime) * 1000);
      const id = window.setTimeout(() => {
        e.timeouts.delete(id);
        fn();
      }, delay);
      e.timeouts.add(id);
    };

    const halt = () => {
      if (e.timer) window.clearInterval(e.timer);
      e.timer = 0;
    };

    const isDownbeat = (s: SongRun, rel: number) => {
      let q = rel + s.startQ;
      if (q >= s.len && s.len > 0) q = (rel - (s.len - s.startQ)) % s.len;
      const k = (q - s.pickup) / s.beatQ;
      const r = Math.round(k);
      return Math.abs(k - r) < 1e-6 && (((r % s.barBeats) + s.barBeats) % s.barBeats) === 0;
    };

    const scheduleSong = (horizon: number) => {
      const s = e.song!;
      if (s.bpm !== e.bpm) {
        s.anchorQ = s.lastQ;
        s.anchorT = s.lastT;
        s.bpm = e.bpm;
        s.spq = 60 / e.bpm / s.beatQ;
      }
      const tOf = (q: number) => s.anchorT + (q - s.anchorQ) * s.spq;
      for (let guard = 0; guard < 400; guard++) {
        const ev = s.i < s.ev.length ? s.ev[s.i] : null;
        const evQ = ev ? ev.rel : s.endQ;
        if (s.clickQ <= evQ + 1e-9 && s.clickQ < s.endQ - 1e-9) {
          const t = tOf(s.clickQ);
          if (t > horizon) return;
          const counting = s.clickQ < -1e-9;
          if (counting || e.clicks || e.metro) {
            click(t, counting ? s.clickQ <= s.firstClickQ + 1e-9 : isDownbeat(s, s.clickQ));
            at(t, () => setBeat((b) => b + 1));
          }
          s.lastQ = s.clickQ;
          s.lastT = t;
          s.clickQ += s.beatQ;
          continue;
        }
        if (!ev) {
          const t = tOf(s.endQ);
          if (t > horizon) return;
          e.song = null;
          at(t, () => {
            setCurrent(null);
            setSongIdx(null);
            setPlaying(false);
          });
          if (e.metro) {
            e.next = tOf(s.clickQ);
            e.beat = 0;
          } else halt();
          return;
        }
        const t = tOf(ev.rel);
        if (t > horizon) return;
        if (ev.midi !== null && e.songSound) playNote(ev.midi, t, Math.max(0.06, ev.dur * s.spq * 0.9));
        const p = ev;
        at(t, () => {
          setCurrent(p.pos);
          setSongIdx(p.idx);
        });
        s.lastQ = ev.rel;
        s.lastT = t;
        s.i += 1;
      }
    };

    const tick = () => {
      const horizon = audio().currentTime + 0.12;
      if (e.song) {
        scheduleSong(horizon);
        return;
      }
      while (e.timer && e.next < horizon) {
        const t = e.next;
        const spb = 60 / e.bpm;
        if (e.metro || (e.playing && e.clicks)) {
          click(t, e.beat % 4 === 0);
          at(t, () => setBeat((b) => b + 1));
        }
        if (e.playing) {
          if (e.idx < e.seq.length) {
            const p = e.seq[e.idx];
            playNote(p.midi, t, spb * 0.86);
            at(t, () => setCurrent(p));
            e.idx += 1;
          } else {
            e.playing = false;
            at(t, () => {
              setCurrent(null);
              setPlaying(false);
            });
          }
        }
        e.beat += 1;
        e.next += spb;
        if (!e.playing && !e.metro) halt();
      }
    };

    const ensureLoop = () => {
      if (e.timer) return;
      e.beat = 0;
      e.next = audio().currentTime + 0.08;
      e.timer = window.setInterval(tick, 25);
      tick();
    };

    const clearPending = () => {
      e.timeouts.forEach((id) => window.clearTimeout(id));
      e.timeouts.clear();
    };

    return {
      play(seq) {
        unlockAudio();
        if (!seq.length) return;
        e.song = null;
        e.seq = seq;
        e.idx = 0;
        e.playing = true;
        setPlaying(true);
        ensureLoop();
      },
      playSong(events, o) {
        unlockAudio();
        const notes = events.filter((x) => x.pos !== null || x.midi === null);
        if (!notes.some((x) => x.midi !== null)) return;
        clearPending();
        e.playing = false;
        const last = events[events.length - 1];
        const len = last.q + last.dur;
        const startIdx = Math.max(0, Math.min(o.startIdx, events.length - 1));
        const startQ = events[startIdx].q;
        const reps = Math.max(1, o.reps);
        const ev: SongRun["ev"] = [];
        for (let r = 0; r < reps; r++) {
          const from = r === 0 ? startIdx : 0;
          const off = r === 0 ? -startQ : len - startQ + (r - 1) * len;
          for (const x of events.slice(from)) ev.push({ ...x, rel: x.q + off });
        }
        const spq = 60 / e.bpm / o.beatQ;
        const p0 = ((o.pickup % o.beatQ) + o.beatQ) % o.beatQ;
        const firstGrid = Math.ceil((startQ - p0) / o.beatQ - 1e-9) * o.beatQ + p0 - startQ;
        const firstClickQ = o.countIn ? -o.barBeats * o.beatQ : firstGrid;
        const t0 = audio().currentTime + 0.1;
        e.song = {
          ev,
          i: 0,
          beatQ: o.beatQ,
          barBeats: o.barBeats,
          pickup: o.pickup,
          startQ,
          len,
          endQ: len - startQ + (reps - 1) * len,
          clickQ: firstClickQ,
          firstClickQ,
          anchorQ: firstClickQ,
          anchorT: t0,
          spq,
          bpm: e.bpm,
          lastQ: firstClickQ,
          lastT: t0,
        };
        setCurrent(null);
        setSongIdx(null);
        setPlaying(true);
        if (e.timer) tick();
        else {
          e.timer = window.setInterval(tick, 25);
          tick();
        }
      },
      stop() {
        e.playing = false;
        e.song = null;
        clearPending();
        setPlaying(false);
        setCurrent(null);
        setSongIdx(null);
        if (!e.metro) halt();
        else e.next = audio().currentTime + 60 / e.bpm;
      },
      toggleMetronome() {
        unlockAudio();
        e.metro = !e.metro;
        setMetro(e.metro);
        if (e.metro) ensureLoop();
        else if (!e.playing && !e.song) halt();
      },
      configure(bpm, clicks, songSound) {
        e.bpm = bpm;
        e.clicks = clicks;
        e.songSound = songSound;
      },
      isPlaying: () => e.playing || !!e.song,
    };
  }, []);

  useEffect(() => {
    const e = eng.current;
    return () => {
      if (e.timer) window.clearInterval(e.timer);
      e.timeouts.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  return { playing, metro, current, songIdx, beat, api };
}

// ------------------------------------------------------------------ ladička

/** Jeden snímek z mikrofonu pro posluchače (procvičování písniček). */
export type TunerFrame = { rms: number; det: { midi: number; cents: number } | null };

export function useTuner(a4: number) {
  const [on, setOn] = useState(false);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reading, setReading] = useState<TunerReading | null>(null);
  const det = useRef<PitchDetector | null>(null);
  const raf = useRef(0);
  const listener = useRef<((f: TunerFrame) => void) | null>(null);
  const st = useRef({ a4: 440, lastValid: 0, lastPush: 0, needle: 0, midi: -1, last: null as TunerReading | null });

  useEffect(() => {
    st.current.a4 = a4;
  }, [a4]);

  const api = useMemo(() => {
    const stop = () => {
      cancelAnimationFrame(raf.current);
      det.current?.stop();
      det.current = null;
      st.current.last = null;
      setOn(false);
      setStarting(false);
      setReading(null);
      setError(null);
    };

    const start = async () => {
      if (det.current) return;
      unlockAudio();
      setOn(true);
      setStarting(true);
      setError(null);
      try {
        const d = new PitchDetector();
        await d.start();
        det.current = d;
        setStarting(false);
        const s = st.current;
        const frame = (ts: number) => {
          const dd = det.current;
          if (!dd) return;
          const f = dd.read();
          let hit: TunerFrame["det"] = null;
          if (f && f.freq > 0 && f.confidence >= 0.8) {
            const mf = 69 + 12 * Math.log2(f.freq / s.a4);
            const midi = Math.round(mf);
            const cents = (mf - midi) * 100;
            hit = { midi, cents };
            s.needle = midi === s.midi ? s.needle * 0.6 + cents * 0.4 : cents;
            s.midi = midi;
            s.lastValid = ts;
            s.last = {
              midi,
              cents,
              freq: f.freq,
              confidence: f.confidence,
              zone: zoneOf(cents),
              needle: s.needle,
              fresh: true,
            };
          }
          listener.current?.({ rms: f?.rms ?? 0, det: hit });
          if (ts - s.lastPush > 66 && s.last) {
            s.lastPush = ts;
            setReading({ ...s.last, fresh: ts - s.lastValid < 450 });
          }
          raf.current = requestAnimationFrame(frame);
        };
        raf.current = requestAnimationFrame(frame);
      } catch (err) {
        setStarting(false);
        const name = err instanceof DOMException ? err.name : "";
        setError(
          !window.isSecureContext
            ? "The tuner needs a secure (HTTPS) page to use the microphone."
            : name === "NotAllowedError" || name === "SecurityError"
              ? "Microphone access was denied — allow it in the browser settings and tap the tuning fork again."
              : name === "NotFoundError" || name === "OverconstrainedError"
                ? "No microphone was found on this device."
                : "The microphone could not be started.",
        );
      }
    };
    const setListener = (fn: ((f: TunerFrame) => void) | null) => {
      listener.current = fn;
    };
    return { start, stop, setListener };
  }, []);

  useEffect(() => {
    return () => {
      cancelAnimationFrame(raf.current);
      det.current?.stop();
    };
  }, []);

  return { on, starting, error, reading, ...api };
}

// ------------------------------------------------- procvičování písničky
//
// Režim „čekej na mě“: appka ukáže další tón a počká, až ho zahraješ (mikrofon).
// Správně = stejný tón v toleranci ±40 centů aspoň ~50 ms. Opakovaný stejný tón
// se uzná až po nasazení (pokles hlasitosti nebo přerušení).

export type PracticeNote = { idx: number; midi: number };
export type PracticeMark = "ok" | "late";
export type PracticeState = {
  on: boolean;
  done: boolean;
  /** Index cílového tónu v seznamu not (ne událostí). */
  i: number;
  marks: Record<number, PracticeMark>;
  misses: number;
  /** Právě zahraný špatný tón (MIDI), nebo null. */
  wrong: number | null;
};

const IDLE: PracticeState = { on: false, done: false, i: 0, marks: {}, misses: 0, wrong: null };

export function usePractice(onDone: (firstTry: number, total: number) => void) {
  const [state, setState] = useState<PracticeState>(IDLE);
  const done = useRef(onDone);
  useEffect(() => {
    done.current = onDone;
  }, [onDone]);
  const r = useRef({
    on: false,
    notes: [] as PracticeNote[],
    i: 0,
    hold: 0,
    wrongMidi: -1,
    wrongCount: 0,
    missed: false,
    needRelease: false,
    relFrames: 0,
    /** Právě uznaný tón — jeho doznívání se nepočítá jako chyba. */
    prevMidi: -1,
    peak: 0,
    marks: {} as Record<number, PracticeMark>,
    misses: 0,
    total: 0,
  });

  const api = useMemo(() => {
    const publish = (wrong: number | null = null) => {
      const p = r.current;
      setState({ on: p.on, done: !p.on && p.i >= p.notes.length && p.notes.length > 0, i: p.i, marks: { ...p.marks }, misses: p.misses, wrong });
    };

    const onFrame = (f: TunerFrame) => {
      const p = r.current;
      if (!p.on) return;
      const target = p.notes[p.i];
      if (!target) return;
      const d = f.det;

      // Opakovaný stejný tón: čekej na nové nasazení (tón přeruší nebo zeslábne
      // aspoň na 2 snímky — jeden výpadek detekce se nepočítá).
      if (p.needRelease) {
        const same = d !== null && d.midi === target.midi;
        if (same && f.rms >= p.peak * 0.45) {
          p.peak = Math.max(p.peak, f.rms);
          p.relFrames = 0;
          return;
        }
        p.relFrames += 1;
        if (p.relFrames >= 2) {
          p.needRelease = false;
          p.relFrames = 0;
          p.hold = 0;
        }
        return;
      }

      if (d && d.midi === target.midi && Math.abs(d.cents) <= 40) {
        p.hold += 1;
        p.wrongCount = 0;
        if (p.hold >= 3) {
          p.marks[target.idx] = p.missed ? "late" : "ok";
          p.i += 1;
          p.hold = 0;
          p.missed = false;
          const next = p.notes[p.i];
          p.needRelease = !!next && next.midi === target.midi;
          p.relFrames = 0;
          p.prevMidi = target.midi;
          p.peak = f.rms;
          if (!next) {
            p.on = false;
            const first = Object.values(p.marks).filter((m) => m === "ok").length;
            done.current(first, p.total);
          }
          publish();
        }
        return;
      }

      p.hold = 0;
      if (d && d.midi !== target.midi) {
        if (d.midi === p.prevMidi) return;
        p.prevMidi = -1;
        if (d.midi === p.wrongMidi) p.wrongCount += 1;
        else {
          p.wrongMidi = d.midi;
          p.wrongCount = 1;
        }
        if (p.wrongCount === 8) {
          if (!p.missed) {
            p.missed = true;
            p.misses += 1;
          }
          publish(d.midi);
        }
      } else if (!d) {
        p.prevMidi = -1;
        if (p.wrongCount) {
          p.wrongCount = 0;
          p.wrongMidi = -1;
        }
      }
    };

    return {
      onFrame,
      start(notes: PracticeNote[], fromIdx: number) {
        const p = r.current;
        const startAt = Math.max(0, notes.findIndex((n) => n.idx >= fromIdx));
        p.notes = notes;
        p.i = startAt;
        p.total = notes.length - startAt;
        p.hold = 0;
        p.wrongMidi = -1;
        p.wrongCount = 0;
        p.missed = false;
        p.needRelease = false;
        p.relFrames = 0;
        p.prevMidi = -1;
        p.peak = 0;
        p.marks = {};
        p.misses = 0;
        p.on = notes.length > 0;
        publish();
      },
      stop() {
        r.current.on = false;
        r.current.notes = [];
        setState(IDLE);
      },
      isOn: () => r.current.on,
    };
  }, []);

  return { state, ...api };
}
