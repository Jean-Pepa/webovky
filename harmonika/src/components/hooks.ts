"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { audio, click, playNote, unlockAudio } from "@/lib/audio";
import type { Pos } from "@/lib/harmonica";
import { PitchDetector, zoneOf } from "@/lib/pitch";
import type { TunerReading } from "./TunerPanel";

// ---------------------------------------------------------------- přehrávač
//
// Jeden plánovač (Web Audio lookahead) pro metronom i přehrávání stupnice:
// každá doba = jeden tón, klik metronomu se plánuje na stejný čas.

type Engine = {
  timer: number;
  next: number;
  beat: number;
  idx: number;
  playing: boolean;
  metro: boolean;
  seq: Pos[];
  bpm: number;
  clicks: boolean;
  timeouts: Set<number>;
};

export type PlayerApi = {
  play: (seq: Pos[]) => void;
  stop: () => void;
  toggleMetronome: () => void;
  configure: (bpm: number, clicks: boolean) => void;
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
    bpm: 90,
    clicks: true,
    timeouts: new Set(),
  });
  const [playing, setPlaying] = useState(false);
  const [metro, setMetro] = useState(false);
  const [current, setCurrent] = useState<Pos | null>(null);
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

    const tick = () => {
      const horizon = audio().currentTime + 0.12;
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

    return {
      play(seq) {
        unlockAudio();
        if (!seq.length) return;
        e.seq = seq;
        e.idx = 0;
        e.playing = true;
        setPlaying(true);
        ensureLoop();
      },
      stop() {
        e.playing = false;
        e.timeouts.forEach((id) => window.clearTimeout(id));
        e.timeouts.clear();
        setPlaying(false);
        setCurrent(null);
        if (!e.metro) halt();
      },
      toggleMetronome() {
        unlockAudio();
        e.metro = !e.metro;
        setMetro(e.metro);
        if (e.metro) ensureLoop();
        else if (!e.playing) halt();
      },
      configure(bpm, clicks) {
        e.bpm = bpm;
        e.clicks = clicks;
      },
      isPlaying: () => e.playing,
    };
  }, []);

  useEffect(() => {
    const e = eng.current;
    return () => {
      if (e.timer) window.clearInterval(e.timer);
      e.timeouts.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  return { playing, metro, current, beat, api };
}

// ------------------------------------------------------------------ ladička

export function useTuner(a4: number) {
  const [on, setOn] = useState(false);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reading, setReading] = useState<TunerReading | null>(null);
  const det = useRef<PitchDetector | null>(null);
  const raf = useRef(0);
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
          if (f && f.freq > 0 && f.confidence >= 0.8) {
            const mf = 69 + 12 * Math.log2(f.freq / s.a4);
            const midi = Math.round(mf);
            const cents = (mf - midi) * 100;
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
    return { start, stop };
  }, []);

  useEffect(() => {
    return () => {
      cancelAnimationFrame(raf.current);
      det.current?.stop();
    };
  }, []);

  return { on, starting, error, reading, ...api };
}
