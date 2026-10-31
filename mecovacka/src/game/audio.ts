// Zvuky syntetizované přes Web Audio (žádné zvukové soubory): svist meče podle rychlosti švihu,
// plácnutí pěnou, ťuknutí meče o meč, žbluňk, publikum a jednoduchá hudba.
export type Sfx =
  | "hit"
  | "hitStrong"
  | "block"
  | "clash"
  | "splash"
  | "count"
  | "go"
  | "join"
  | "click"
  | "teeter"
  | "cheer"
  | "slice"
  | "bonk"
  | "squeak"
  | "point"
  | "win"
  | "ready"
  | "tick"
  | "gong"
  | "combo"
  | "miss";

/** Svist meče: šum přes pásmový filtr, hlasitost a výška podle rychlosti špičky. */
export class SwingVoice {
  private src: AudioBufferSourceNode;
  private f: BiquadFilterNode;
  private g: GainNode;
  private p: StereoPannerNode | null;
  private ctx: AudioContext;

  constructor(ctx: AudioContext, out: AudioNode, noise: AudioBuffer) {
    this.ctx = ctx;
    this.src = ctx.createBufferSource();
    this.src.buffer = noise;
    this.src.loop = true;
    this.f = ctx.createBiquadFilter();
    this.f.type = "bandpass";
    this.f.Q.value = 2.2;
    this.f.frequency.value = 500;
    this.g = ctx.createGain();
    this.g.gain.value = 0;
    this.p = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
    this.src.connect(this.f).connect(this.g);
    if (this.p) this.g.connect(this.p).connect(out);
    else this.g.connect(out);
    this.src.start();
  }

  /** speed = rychlost špičky (m/s), pan = −1 … 1 */
  set(speed: number, pan: number, vol = 1) {
    const t = this.ctx.currentTime;
    const s = Math.max(0, Math.min(1, (speed - 2.5) / 14));
    this.f.frequency.setTargetAtTime(380 + s * s * 2600, t, 0.02);
    this.g.gain.setTargetAtTime(vol * s * s * 0.55, t, s > 0.05 ? 0.015 : 0.05);
    if (this.p) this.p.pan.setTargetAtTime(Math.max(-1, Math.min(1, pan)), t, 0.05);
  }

  stop() {
    const t = this.ctx.currentTime;
    this.g.gain.setTargetAtTime(0, t, 0.03);
    this.src.stop(t + 0.3);
  }
}

export class Sound {
  ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private sfxBus: GainNode | null = null;
  musicBus: GainNode | null = null;
  private noise: AudioBuffer | null = null;
  muted = false;

  /** Prohlížeč pustí zvuk až po prvním kliknutí / stisku klávesy. */
  unlock() {
    if (!this.ctx) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AC) return;
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.muted ? 0 : 0.85;
      const comp = this.ctx.createDynamicsCompressor();
      this.master.connect(comp).connect(this.ctx.destination);
      this.sfxBus = this.ctx.createGain();
      this.sfxBus.connect(this.master);
      this.musicBus = this.ctx.createGain();
      this.musicBus.gain.value = 0.16;
      this.musicBus.connect(this.master);
      const len = this.ctx.sampleRate * 2;
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
    if (this.master && this.ctx) this.master.gain.setTargetAtTime(m ? 0 : 0.85, this.ctx.currentTime, 0.05);
  }

  swing(): SwingVoice | null {
    if (!this.ctx || !this.sfxBus || !this.noise) return null;
    return new SwingVoice(this.ctx, this.sfxBus, this.noise);
  }

  /** Tón v absolutním čase. */
  note(dest: AudioNode, freq: number, t: number, dur: number, type: OscillatorType, vol: number, slideTo?: number, attack = 0.006) {
    const ctx = this.ctx!;
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(dest);
    o.start(t);
    o.stop(t + dur + 0.05);
  }

  /** Šum přes filtr v absolutním čase. */
  noiseHit(dest: AudioNode, t: number, dur: number, vol: number, freq: number, type: BiquadFilterType, freqTo?: number, q = 1) {
    const ctx = this.ctx!;
    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    const f = ctx.createBiquadFilter();
    f.type = type;
    f.frequency.setValueAtTime(freq, t);
    if (freqTo) f.frequency.exponentialRampToValueAtTime(freqTo, t + dur);
    f.Q.value = q;
    const g = ctx.createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f).connect(g).connect(dest);
    src.start(t, Math.random() * 1.5);
    src.stop(t + dur + 0.05);
  }

  play(s: Sfx, vol = 1) {
    if (!this.ctx || !this.sfxBus || this.muted) return;
    const t = this.ctx.currentTime + 0.005, out = this.sfxBus;
    switch (s) {
      case "hit":
        // plácnutí pěnou: tlumené „puf“ + hluboký úder
        this.noiseHit(out, t, 0.12, 0.7 * vol, 1400, "bandpass", 500, 0.9);
        this.note(out, 150, t, 0.18, "sine", 0.6 * vol, 60);
        break;
      case "hitStrong":
        this.noiseHit(out, t, 0.2, 0.9 * vol, 2200, "bandpass", 400, 0.8);
        this.note(out, 120, t, 0.32, "sine", 0.8 * vol, 45);
        this.note(out, 520, t, 0.08, "triangle", 0.25 * vol, 300);
        this.noiseHit(out, t + 0.03, 0.4, 0.25 * vol, 5000, "highpass");
        break;
      case "block":
        // ťuknutí: krátký dřevěný tón
        this.note(out, 680, t, 0.09, "triangle", 0.5 * vol, 520);
        this.note(out, 1030, t, 0.06, "sine", 0.25 * vol);
        this.noiseHit(out, t, 0.05, 0.4 * vol, 3000, "bandpass", undefined, 2);
        break;
      case "clash":
        this.note(out, 760, t, 0.12, "triangle", 0.5 * vol, 600);
        this.note(out, 590, t + 0.04, 0.12, "triangle", 0.4 * vol, 480);
        this.noiseHit(out, t, 0.12, 0.5 * vol, 4200, "bandpass", 2000, 1.5);
        break;
      case "splash":
        this.noiseHit(out, t, 0.9, 0.9 * vol, 2600, "lowpass", 260);
        this.noiseHit(out, t, 0.25, 0.5 * vol, 900, "bandpass", 300, 1.2);
        for (let i = 0; i < 6; i++) this.note(out, 400 + Math.random() * 500, t + 0.25 + i * 0.09, 0.07, "sine", 0.12 * vol, 900);
        break;
      case "count":
        this.note(out, 660, t, 0.12, "square", 0.12 * vol);
        break;
      case "go":
      case "gong":
        this.note(out, 196, t, 1.1, "sine", 0.45 * vol, 190);
        this.note(out, 294, t, 0.9, "sine", 0.25 * vol);
        this.note(out, 392, t, 0.7, "triangle", 0.12 * vol);
        break;
      case "join":
        this.note(out, 523, t, 0.1, "triangle", 0.3 * vol);
        this.note(out, 784, t + 0.08, 0.16, "triangle", 0.3 * vol);
        break;
      case "click":
        this.note(out, 900, t, 0.04, "square", 0.08 * vol);
        break;
      case "ready":
        this.note(out, 660, t, 0.08, "triangle", 0.3 * vol);
        this.note(out, 990, t + 0.07, 0.14, "triangle", 0.3 * vol);
        break;
      case "tick":
        this.note(out, 1200, t, 0.03, "square", 0.05 * vol);
        break;
      case "teeter":
        // „uáá“ — balancování na okraji
        this.note(out, 420, t, 0.5, "sine", 0.2 * vol, 300);
        this.note(out, 300, t + 0.25, 0.45, "sine", 0.18 * vol, 420);
        break;
      case "cheer": {
        // publikum: několik vln šumu
        for (let i = 0; i < 4; i++) this.noiseHit(out, t + i * 0.1, 1.4, 0.18 * vol, 1200 + i * 300, "bandpass", 900, 0.6);
        break;
      }
      case "slice":
        this.noiseHit(out, t, 0.14, 0.7 * vol, 6000, "highpass");
        this.note(out, 240, t + 0.02, 0.12, "sine", 0.4 * vol, 120);
        break;
      case "bonk":
        this.note(out, 330, t, 0.18, "sine", 0.5 * vol, 520);
        this.note(out, 220, t, 0.12, "square", 0.12 * vol);
        break;
      case "squeak":
        this.note(out, 1200, t, 0.18, "sine", 0.3 * vol, 1800);
        this.note(out, 1500, t + 0.15, 0.2, "sine", 0.25 * vol, 900);
        break;
      case "combo":
        this.note(out, 880, t, 0.08, "triangle", 0.25 * vol);
        this.note(out, 1320, t + 0.06, 0.1, "triangle", 0.25 * vol);
        break;
      case "miss":
        this.note(out, 300, t, 0.25, "triangle", 0.2 * vol, 160);
        break;
      case "point":
        [523, 659, 784].forEach((f, i) => this.note(out, f, t + i * 0.09, 0.22, "triangle", 0.3 * vol));
        break;
      case "win":
        [523, 659, 784, 1047, 784, 1047].forEach((f, i) => this.note(out, f, t + i * 0.13, i === 5 ? 0.7 : 0.2, "triangle", 0.32 * vol));
        [262, 330, 392].forEach((f) => this.note(out, f, t + 0.65, 0.9, "sine", 0.18 * vol));
        break;
    }
  }
}

/** Jednoduchá smyčka hudby pro každou arénu (loutna, basa, bubínek). */
export class Music {
  private s: Sound;
  private timer = 0;
  private step = 0;
  private nextT = 0;
  private theme = "";
  private on = false;

  constructor(s: Sound) {
    this.s = s;
  }

  play(theme: string) {
    if (this.on && this.theme === theme) return;
    this.stop();
    this.theme = theme;
    this.on = true;
    this.step = 0;
    this.nextT = 0;
    this.timer = window.setInterval(() => this.tick(), 50);
  }

  stop() {
    this.on = false;
    clearInterval(this.timer);
  }

  private tick() {
    const s = this.s;
    if (!s.ctx || !s.musicBus || s.muted) return;
    const ctx = s.ctx;
    const bpm = this.theme === "hrad" ? 104 : this.theme === "kra" ? 92 : 118;
    const stepDur = 60 / bpm / 2;
    if (this.nextT < ctx.currentTime) this.nextT = ctx.currentTime + 0.05;
    while (this.nextT < ctx.currentTime + 0.25) {
      this.playStep(this.step, this.nextT, stepDur);
      this.step = (this.step + 1) % 64;
      this.nextT += stepDur;
    }
  }

  private playStep(i: number, t: number, d: number) {
    const s = this.s, out = this.s.musicBus!;
    const N = (n: number) => 220 * Math.pow(2, n / 12);
    // dórská stupnice od D (vlastní melodie)
    const scale = [0, 2, 3, 5, 7, 9, 10, 12, 14, 15, 17];
    const melodies: Record<string, number[]> = {
      molo: [7, -1, 5, 4, 3, -1, 4, 2, 0, -1, 2, 4, 5, 4, 3, 2, 4, -1, 5, 7, 8, 7, 5, 4, 3, 4, 2, -1, 0, -1, -1, -1],
      hrad: [0, -1, 0, 2, 3, -1, 2, 0, 4, -1, 4, 3, 2, -1, 0, -1, 5, -1, 4, 3, 2, 3, 4, -1, 2, 1, 0, -1, 0, -1, -1, -1],
      kra: [7, -1, -1, 9, 8, -1, 7, -1, 4, -1, -1, 5, 4, -1, 2, -1, 3, -1, -1, 4, 5, -1, 7, -1, 4, -1, 2, -1, 0, -1, -1, -1],
    };
    const mel = melodies[this.theme] ?? melodies.molo;
    const m = mel[i % 32];
    const base = this.theme === "kra" ? 5 : 0;
    if (m >= 0) {
      const f = N(scale[m % scale.length] + base + 5);
      s.note(out, f, t, d * (this.theme === "kra" ? 3 : 1.6), this.theme === "kra" ? "sine" : "triangle", this.theme === "kra" ? 0.35 : 0.5);
      if (this.theme === "kra") s.note(out, f * 2, t, d * 2, "sine", 0.08);
    }
    // basa: kvinta na doby
    if (i % 4 === 0) {
      const root = [0, 0, 5, 7][Math.floor(i / 16) % 4];
      s.note(out, N(root + base - 12), t, d * 3.5, this.theme === "hrad" ? "sawtooth" : "triangle", this.theme === "hrad" ? 0.18 : 0.42);
    }
    // bubínek
    if (this.theme !== "kra") {
      if (i % 4 === 0) s.noiseHit(out, t, 0.12, 0.35, 180, "lowpass");
      if (i % 4 === 2) s.noiseHit(out, t, 0.06, 0.18, 4500, "highpass");
      if (this.theme === "molo" && i % 8 === 7) s.noiseHit(out, t, 0.05, 0.12, 6000, "highpass");
    } else if (i % 8 === 0) s.noiseHit(out, t, 0.6, 0.06, 7000, "highpass");
  }
}
