// Zvuky syntetizované přes Web Audio (žádné zvukové soubory).
export type Sfx =
  | "count"
  | "go"
  | "pickup"
  | "item"
  | "boost"
  | "hit"
  | "wall"
  | "bump"
  | "rocket"
  | "boom"
  | "oil"
  | "shield"
  | "lap"
  | "final"
  | "finish"
  | "drift1"
  | "drift2"
  | "hop"
  | "join"
  | "click";

export class EngineVoice {
  private o1: OscillatorNode;
  private o2: OscillatorNode;
  private f: BiquadFilterNode;
  private g: GainNode;
  private ctx: AudioContext;

  constructor(ctx: AudioContext, out: AudioNode, pitch: number) {
    this.ctx = ctx;
    this.o1 = ctx.createOscillator();
    this.o2 = ctx.createOscillator();
    this.o1.type = "sawtooth";
    this.o2.type = "square";
    this.o2.detune.value = 7 + pitch * 4;
    this.f = ctx.createBiquadFilter();
    this.f.type = "lowpass";
    this.f.frequency.value = 600;
    this.f.Q.value = 3;
    this.g = ctx.createGain();
    this.g.gain.value = 0;
    this.o1.connect(this.f);
    this.o2.connect(this.f);
    this.f.connect(this.g).connect(out);
    this.o1.start();
    this.o2.start();
  }

  set(speed01: number, boost: boolean, offroad: boolean, volume: number) {
    const t = this.ctx.currentTime;
    const base = 52 + speed01 * 120 + (boost ? 30 : 0);
    this.o1.frequency.setTargetAtTime(base, t, 0.05);
    this.o2.frequency.setTargetAtTime(base * 0.5, t, 0.05);
    this.f.frequency.setTargetAtTime(380 + speed01 * 1500 + (boost ? 800 : 0) - (offroad ? 200 : 0), t, 0.06);
    this.g.gain.setTargetAtTime(volume * (0.05 + speed01 * 0.05), t, 0.08);
  }

  stop() {
    const t = this.ctx.currentTime;
    this.g.gain.setTargetAtTime(0, t, 0.05);
    this.o1.stop(t + 0.3);
    this.o2.stop(t + 0.3);
  }
}

export class Sound {
  ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private sfxBus: GainNode | null = null;
  private engineBus: GainNode | null = null;
  private noise: AudioBuffer | null = null;
  muted = false;

  /** Prohlížeč pustí zvuk až po prvním kliknutí / stisku klávesy. */
  unlock() {
    if (!this.ctx) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AC) return;
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.muted ? 0 : 0.8;
      const comp = this.ctx.createDynamicsCompressor();
      this.master.connect(comp).connect(this.ctx.destination);
      this.sfxBus = this.ctx.createGain();
      this.sfxBus.connect(this.master);
      this.engineBus = this.ctx.createGain();
      this.engineBus.connect(this.master);
      const len = this.ctx.sampleRate;
      this.noise = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
      const d = this.noise.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    }
    if (this.ctx.state === "suspended") void this.ctx.resume();
  }

  get ready() {
    return !!this.ctx && this.ctx.state === "running";
  }

  setMuted(m: boolean) {
    this.muted = m;
    if (this.master && this.ctx) this.master.gain.setTargetAtTime(m ? 0 : 0.8, this.ctx.currentTime, 0.05);
  }

  engine(pitch: number): EngineVoice | null {
    if (!this.ctx || !this.engineBus) return null;
    return new EngineVoice(this.ctx, this.engineBus, pitch);
  }

  private tone(freq: number, dur: number, type: OscillatorType, vol: number, at = 0, slideTo?: number) {
    const ctx = this.ctx!, t = ctx.currentTime + at;
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(this.sfxBus!);
    o.start(t);
    o.stop(t + dur + 0.05);
  }

  private hiss(dur: number, vol: number, f0: number, f1: number, type: BiquadFilterType = "bandpass", at = 0) {
    const ctx = this.ctx!, t = ctx.currentTime + at;
    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    const f = ctx.createBiquadFilter();
    f.type = type;
    f.frequency.setValueAtTime(f0, t);
    f.frequency.exponentialRampToValueAtTime(f1, t + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f).connect(g).connect(this.sfxBus!);
    src.start(t);
    src.stop(t + dur + 0.05);
  }

  play(s: Sfx, vol = 1) {
    if (!this.ready || this.muted) return;
    const v = 0.35 * vol;
    switch (s) {
      case "count":
        this.tone(440, 0.22, "square", v * 0.6);
        break;
      case "go":
        this.tone(880, 0.6, "square", v * 0.7);
        this.tone(1320, 0.6, "triangle", v * 0.4);
        break;
      case "pickup":
        [660, 880, 1320].forEach((f, i) => this.tone(f, 0.09, "triangle", v * 0.6, i * 0.05));
        break;
      case "item":
        [1046, 1568].forEach((f, i) => this.tone(f, 0.12, "sine", v * 0.6, i * 0.07));
        break;
      case "boost":
        this.hiss(0.5, v * 0.7, 400, 3000);
        this.tone(180, 0.45, "sawtooth", v * 0.3, 0, 520);
        break;
      case "hit":
        this.tone(160, 0.5, "sine", v, 0, 40);
        this.hiss(0.4, v * 0.6, 2000, 300);
        break;
      case "wall":
        this.tone(90, 0.18, "sine", v * 0.8, 0, 50);
        this.hiss(0.12, v * 0.5, 900, 200, "lowpass");
        break;
      case "bump":
        this.tone(120, 0.12, "triangle", v * 0.5, 0, 70);
        break;
      case "rocket":
        this.hiss(0.6, v * 0.6, 600, 2400);
        break;
      case "boom":
        this.hiss(0.8, v, 1200, 80, "lowpass");
        this.tone(70, 0.6, "sine", v * 0.8, 0, 30);
        break;
      case "oil":
        this.tone(300, 0.25, "sine", v * 0.6, 0, 90);
        break;
      case "shield":
        [523, 659, 784].forEach((f, i) => this.tone(f, 0.3, "sine", v * 0.4, i * 0.04));
        break;
      case "lap":
        this.tone(880, 0.15, "triangle", v * 0.6);
        this.tone(1175, 0.25, "triangle", v * 0.6, 0.12);
        break;
      case "final":
        [784, 988, 1175, 1568].forEach((f, i) => this.tone(f, 0.18, "square", v * 0.35, i * 0.1));
        break;
      case "finish":
        [523, 659, 784, 1046, 784, 1046].forEach((f, i) => this.tone(f, 0.22, "square", v * 0.35, i * 0.13));
        break;
      case "drift1":
        this.tone(1200, 0.08, "square", v * 0.25);
        break;
      case "drift2":
        this.tone(1600, 0.1, "square", v * 0.3);
        break;
      case "hop":
        this.tone(300, 0.08, "triangle", v * 0.25, 0, 500);
        break;
      case "join":
        [523, 784].forEach((f, i) => this.tone(f, 0.12, "triangle", v * 0.6, i * 0.08));
        break;
      case "click":
        this.tone(700, 0.05, "square", v * 0.3);
        break;
    }
  }
}
