// Zvuk: syntetizovaná harmonika (Web Audio), klik metronomu a pomocníci pro lekce.
// AudioContext vzniká až po dotyku uživatele (iOS/Safari to vyžaduje).

import { midiToFreq } from "./music";

type AnyWindow = Window & { webkitAudioContext?: typeof AudioContext };
type AudioSessionNavigator = Navigator & { audioSession?: { type: string } };

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let wave: PeriodicWave | null = null;
let noise: AudioBuffer | null = null;
let volume = 0.8;
let a4 = 440;
let session: "playback" | "play-and-record" | null = null;

export function setA4(v: number) {
  a4 = v;
}
export function getA4() {
  return a4;
}

export function setVolume(v: number) {
  volume = v;
  if (master && ctx) master.gain.setTargetAtTime(v, ctx.currentTime, 0.02);
}

export function setAudioSession(type: "playback" | "play-and-record") {
  session = type;
  try {
    const nav = navigator as AudioSessionNavigator;
    if (nav.audioSession) nav.audioSession.type = type;
  } catch {
    /* není podporováno */
  }
}

export function audio(): AudioContext {
  if (!ctx) {
    const AC = window.AudioContext || (window as AnyWindow).webkitAudioContext!;
    ctx = new AC({ latencyHint: "interactive" });
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -12;
    comp.knee.value = 10;
    comp.ratio.value = 4;
    comp.attack.value = 0.003;
    comp.release.value = 0.2;
    master = ctx.createGain();
    master.gain.value = volume;
    master.connect(comp);
    comp.connect(ctx.destination);

    // Spektrum jazýčku: silný základ a bohaté vyšší harmonické.
    const amps = [0, 1, 0.62, 0.5, 0.37, 0.31, 0.24, 0.18, 0.13, 0.1, 0.075, 0.056, 0.042, 0.031, 0.022, 0.016];
    const real = new Float32Array(amps.length);
    const imag = new Float32Array(amps);
    wave = ctx.createPeriodicWave(real, imag);

    noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const d = noise.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

/** Volat v obsluze dotyku/kliknutí – odemkne zvuk na iOS (přehrává i při tichém režimu). */
export function unlockAudio() {
  const c = audio();
  if (session === null) setAudioSession("playback");
  const b = c.createBuffer(1, 1, 22050);
  const s = c.createBufferSource();
  s.buffer = b;
  s.connect(c.destination);
  s.start(0);
}

export function now(): number {
  return audio().currentTime;
}

/** Jeden tón harmoniky. `when` je čas AudioContextu, `dur` délka v sekundách. */
export function playNote(midi: number, when?: number, dur = 0.6, velocity = 1) {
  const c = audio();
  if (!master || !wave) return;
  const t0 = Math.max(when ?? c.currentTime + 0.005, c.currentTime);
  const f = midiToFreq(midi, a4);
  const end = t0 + Math.max(0.07, dur);
  const rel = 0.09;

  const osc = c.createOscillator();
  osc.setPeriodicWave(wave);
  osc.frequency.value = f;
  // Nástup jazýčku lehce zespodu + jemné vibrato po chvíli.
  osc.detune.setValueAtTime(-14, t0);
  osc.detune.linearRampToValueAtTime(0, t0 + 0.05);
  const lfo = c.createOscillator();
  lfo.frequency.value = 5.3;
  const lfoGain = c.createGain();
  lfoGain.gain.setValueAtTime(0, t0);
  lfoGain.gain.linearRampToValueAtTime(0, t0 + 0.22);
  lfoGain.gain.linearRampToValueAtTime(6, t0 + 0.5);
  lfo.connect(lfoGain);
  lfoGain.connect(osc.detune);

  const lp = c.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = Math.min(9000, f * 7 + 700);
  lp.Q.value = 0.6;
  const body = c.createBiquadFilter();
  body.type = "peaking";
  body.frequency.value = 1350;
  body.Q.value = 1.1;
  body.gain.value = 5;

  const g = c.createGain();
  const peak = 0.3 * velocity;
  const decayEnd = Math.min(t0 + 0.16, end);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(peak, t0 + 0.028);
  g.gain.exponentialRampToValueAtTime(peak * 0.78, decayEnd);
  g.gain.setValueAtTime(peak * 0.78, end);
  g.gain.exponentialRampToValueAtTime(0.0001, end + rel);

  osc.connect(lp);
  lp.connect(body);
  body.connect(g);
  g.connect(master);

  // Dech.
  if (noise) {
    const ns = c.createBufferSource();
    ns.buffer = noise;
    ns.loop = true;
    const nf = c.createBiquadFilter();
    nf.type = "bandpass";
    nf.frequency.value = Math.min(7000, f * 3);
    nf.Q.value = 0.8;
    const ng = c.createGain();
    ng.gain.setValueAtTime(0.0001, t0);
    ng.gain.exponentialRampToValueAtTime(0.045 * velocity, t0 + 0.018);
    ng.gain.exponentialRampToValueAtTime(0.01 * velocity, decayEnd);
    ng.gain.setValueAtTime(0.01 * velocity, end);
    ng.gain.exponentialRampToValueAtTime(0.0001, end + rel);
    ns.connect(nf);
    nf.connect(ng);
    ng.connect(master);
    ns.start(t0, Math.random() * 0.5);
    ns.stop(end + rel + 0.05);
  }

  osc.start(t0);
  lfo.start(t0);
  osc.stop(end + rel + 0.05);
  lfo.stop(end + rel + 0.05);
}

/** Klik metronomu (první doba taktu s akcentem). */
export function click(when: number, accent: boolean) {
  const c = audio();
  if (!master) return;
  const o = c.createOscillator();
  o.type = "square";
  o.frequency.value = accent ? 1760 : 1320;
  const bp = c.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = accent ? 2600 : 2000;
  bp.Q.value = 1.8;
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, when);
  g.gain.exponentialRampToValueAtTime(accent ? 0.55 : 0.34, when + 0.002);
  g.gain.exponentialRampToValueAtTime(0.0001, when + 0.05);
  o.connect(bp);
  bp.connect(g);
  g.connect(master);
  o.start(when);
  o.stop(when + 0.07);
}

/** Melodie (MIDI tóny po sobě). Vrací délku v sekundách. */
export function playMelody(midis: number[], step = 0.4, noteLen = 0.36): number {
  const c = audio();
  const t = c.currentTime + 0.05;
  midis.forEach((m, i) => playNote(m, t + i * step, noteLen));
  return midis.length * step;
}

/** Akord (všechny tóny naráz, mírně slabší). */
export function playChord(midis: number[], dur = 1.1, delay = 0) {
  const c = audio();
  const t = c.currentTime + 0.05 + delay;
  const vel = Math.max(0.35, 1 / Math.sqrt(midis.length));
  midis.forEach((m) => playNote(m, t, dur, vel));
}
