// Ladička: detekce výšky tónu z mikrofonu algoritmem YIN.

import { audio, setAudioSession } from "./audio";

export type PitchFrame = { freq: number; confidence: number; rms: number };

export type Zone = "Perfect" | "Good" | "Fair" | "Poor";

export function zoneOf(cents: number): Zone {
  const a = Math.abs(cents);
  if (a <= 5) return "Perfect";
  if (a <= 15) return "Good";
  if (a <= 25) return "Fair";
  return "Poor";
}

export const ZONE_COLOR: Record<Zone, string> = {
  Perfect: "#2f9e57",
  Good: "#6aa83a",
  Fair: "#e08a1e",
  Poor: "#c9402f",
};

/** YIN (de Cheveigné & Kawahara). Vrací frekvenci a jistotu 0–1. */
export function yin(buf: Float32Array, sr: number, minF = 110, maxF = 2700, threshold = 0.12): PitchFrame {
  const n = buf.length;
  let rms = 0;
  for (let i = 0; i < n; i++) rms += buf[i] * buf[i];
  rms = Math.sqrt(rms / n);
  if (rms < 0.004) return { freq: 0, confidence: 0, rms };

  const W = Math.floor(n / 2);
  const tauMax = Math.min(W - 2, Math.floor(sr / minF));
  const tauMin = Math.max(2, Math.floor(sr / maxF));
  const d = new Float32Array(tauMax + 2);
  for (let tau = 1; tau <= tauMax + 1; tau++) {
    let s = 0;
    for (let j = 0; j < W; j++) {
      const x = buf[j] - buf[j + tau];
      s += x * x;
    }
    d[tau] = s;
  }
  const c = new Float32Array(tauMax + 2);
  c[0] = 1;
  let run = 0;
  for (let tau = 1; tau <= tauMax + 1; tau++) {
    run += d[tau];
    c[tau] = run > 0 ? (d[tau] * tau) / run : 1;
  }
  let tau = -1;
  for (let t = tauMin; t <= tauMax; t++) {
    if (c[t] < threshold) {
      while (t + 1 <= tauMax && c[t + 1] < c[t]) t++;
      tau = t;
      break;
    }
  }
  if (tau < 0) {
    let best = tauMin;
    for (let t = tauMin; t <= tauMax; t++) if (c[t] < c[best]) best = t;
    tau = best;
  }
  let better = tau;
  if (tau > 1 && tau <= tauMax) {
    const s0 = c[tau - 1];
    const s1 = c[tau];
    const s2 = c[tau + 1];
    const den = s0 - 2 * s1 + s2;
    if (den !== 0) better = tau + (s0 - s2) / (2 * den);
  }
  return { freq: sr / better, confidence: Math.max(0, Math.min(1, 1 - c[tau])), rms };
}

export class PitchDetector {
  private stream: MediaStream | null = null;
  private nodes: AudioNode[] = [];
  private analyser: AnalyserNode | null = null;
  private buf: Float32Array<ArrayBuffer> | null = null;
  private sr = 48000;

  async start() {
    if (!navigator.mediaDevices?.getUserMedia) throw new Error("Microphone is not available in this browser.");
    setAudioSession("play-and-record");
    const ctx = audio();
    this.stream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
    });
    const src = ctx.createMediaStreamSource(this.stream);
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 80;
    const an = ctx.createAnalyser();
    an.fftSize = 2048;
    src.connect(hp);
    hp.connect(an);
    this.nodes = [src, hp, an];
    this.analyser = an;
    this.buf = new Float32Array(an.fftSize);
    this.sr = ctx.sampleRate;
  }

  read(): PitchFrame | null {
    if (!this.analyser || !this.buf) return null;
    this.analyser.getFloatTimeDomainData(this.buf);
    return yin(this.buf, this.sr);
  }

  stop() {
    this.stream?.getTracks().forEach((t) => t.stop());
    this.nodes.forEach((n) => {
      try {
        n.disconnect();
      } catch {
        /* už odpojeno */
      }
    });
    this.nodes = [];
    this.stream = null;
    this.analyser = null;
    setAudioSession("playback");
  }
}
