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
  | "click"
  | "trick"
  | "jump"
  | "land"
  | "bees"
  | "bonk"
  | "ram"
  | "throw"
  | "fanfare"
  | "warn";

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
  /** hlasitost hudby (samostatná větev) */
  musicBus: GainNode | null = null;
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
      this.musicBus = this.ctx.createGain();
      this.musicBus.gain.value = 0.17;
      this.musicBus.connect(this.master);
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

  /** Tón v absolutním čase (pro hudbu). */
  note(dest: AudioNode, freq: number, t: number, dur: number, type: OscillatorType, vol: number, slideTo?: number) {
    const ctx = this.ctx!;
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(dest);
    o.start(t);
    o.stop(t + dur + 0.05);
  }

  /** Šum v absolutním čase (bicí). */
  noiseHit(dest: AudioNode, t: number, dur: number, vol: number, freq: number, type: BiquadFilterType) {
    const ctx = this.ctx!;
    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    const f = ctx.createBiquadFilter();
    f.type = type;
    f.frequency.value = freq;
    const g = ctx.createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f).connect(g).connect(dest);
    src.start(t, Math.random() * 0.5);
    src.stop(t + dur + 0.05);
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
      case "trick":
        [880, 1175, 1568].forEach((f, i) => this.tone(f, 0.08, "square", v * 0.3, i * 0.05));
        break;
      case "jump":
        this.tone(220, 0.25, "triangle", v * 0.5, 0, 660);
        break;
      case "land":
        this.tone(110, 0.12, "sine", v * 0.6, 0, 60);
        break;
      case "bees":
        for (let i = 0; i < 3; i++) this.tone(190 + i * 7, 0.9, "sawtooth", v * 0.12, i * 0.02, 230 + i * 9);
        break;
      case "bonk":
        this.tone(320, 0.08, "square", v * 0.3, 0, 180);
        break;
      case "ram":
        this.tone(140, 0.5, "sawtooth", v * 0.5, 0, 420);
        this.hiss(0.5, v * 0.4, 300, 2000);
        break;
      case "throw":
        this.hiss(0.25, v * 0.5, 2500, 600);
        break;
      case "warn":
        for (let i = 0; i < 4; i++) this.tone(i % 2 ? 660 : 880, 0.22, "square", v * 0.3, i * 0.24);
        break;
      case "fanfare":
        [523, 659, 784, 1046, 1046, 1318, 1568].forEach((f, i) => this.tone(f, i > 4 ? 0.5 : 0.2, "square", v * 0.35, i * 0.14));
        break;
    }
  }
}

// ---------------------------------------------------------------- hudba

type Song = {
  bpm: number;
  /** kořen akordu (MIDI) pro každý ze 4 taktů */
  chords: number[][];
  /** melodie: 64 šestnáctin, číslo = MIDI nota, 0 = pauza */
  lead: number[];
  leadType: OscillatorType;
};

const _ = 0;
// Vlastní krátké smyčky (žádné převzaté melodie).
const SONGS: Record<string, Song> = {
  meadow: {
    bpm: 128,
    chords: [[48, 52, 55], [45, 48, 52], [41, 45, 48], [43, 47, 50]],
    lead: [
      76, _, 79, _, 81, 79, 76, _, 72, _, 74, 76, _, _, 72, _,
      69, _, 72, _, 76, 74, 72, _, 69, _, 72, _, 74, _, _, _,
      77, _, 76, _, 74, 72, 69, _, 72, _, 77, 76, _, 74, _, _,
      74, _, 76, _, 79, _, 77, 76, 74, _, 71, _, 74, 76, 79, _,
    ],
    leadType: "square",
  },
  desert: {
    bpm: 124,
    chords: [[45, 48, 52], [43, 47, 50], [41, 45, 48], [40, 44, 47]],
    lead: [
      69, _, 70, 72, _, 70, 69, _, 68, _, 69, _, 72, _, _, _,
      67, _, 69, 71, _, 69, 67, _, 66, _, 67, _, 71, _, _, _,
      65, _, 67, 69, _, 72, 74, _, 72, _, 69, _, 67, _, 69, _,
      68, _, _, 71, _, 74, 76, _, 74, 72, 71, _, 68, _, 64, _,
    ],
    leadType: "sawtooth",
  },
  ice: {
    bpm: 132,
    chords: [[50, 53, 57], [53, 57, 60], [48, 52, 55], [43, 47, 50]],
    lead: [
      74, _, 77, _, 81, _, 79, 77, 76, _, 74, _, 72, _, 74, _,
      77, _, 81, _, 84, _, 81, 79, 77, _, 76, _, 77, _, _, _,
      79, _, 76, _, 72, _, 76, 79, 81, _, 79, _, 76, _, 72, _,
      71, _, 74, _, 79, _, 77, 74, 71, _, 74, _, 79, _, _, _,
    ],
    leadType: "triangle",
  },
};

SONGS.crazy = {
  bpm: 142,
  chords: [[45, 48, 52], [41, 45, 48], [43, 47, 50], [40, 44, 47]],
  lead: [
    69, 72, 76, _, 74, 72, 69, _, 76, _, 79, 77, 76, 74, 72, _,
    65, 69, 72, _, 71, 69, 65, _, 72, _, 74, 72, 71, 69, 67, _,
    67, 71, 74, _, 72, 71, 67, _, 74, _, 76, 74, 72, 71, 69, _,
    68, _, 71, _, 74, _, 76, _, 80, _, 79, 76, 74, 71, 68, _,
  ],
  leadType: "square",
};

const hz = (n: number) => 440 * Math.pow(2, (n - 69) / 12);

export class Music {
  private s: Sound;
  private timer = 0;
  private step = 0;
  private nextTime = 0;
  private song: Song = SONGS.meadow;
  private fast = false;
  private on = false;

  constructor(s: Sound) {
    this.s = s;
  }

  play(theme: string) {
    this.stop();
    this.song = SONGS[theme] ?? SONGS.meadow;
    this.fast = false;
    this.step = 0;
    this.on = true;
    this.nextTime = 0;
    this.timer = window.setInterval(() => this.schedule(), 25);
  }

  setFast(f: boolean) {
    this.fast = f;
  }

  stop() {
    this.on = false;
    clearInterval(this.timer);
  }

  private schedule() {
    const ctx = this.s.ctx, bus = this.s.musicBus;
    if (!this.on || !ctx || !bus || ctx.state !== "running" || this.s.muted) return;
    if (this.nextTime < ctx.currentTime) this.nextTime = ctx.currentTime + 0.05;
    const spb = 60 / (this.song.bpm * (this.fast ? 1.15 : 1)) / 4;
    while (this.nextTime < ctx.currentTime + 0.12) {
      this.playStep(this.step, this.nextTime, spb, bus);
      this.nextTime += spb;
      this.step = (this.step + 1) % 64;
    }
  }

  private playStep(i: number, t: number, spb: number, bus: AudioNode) {
    const s = this.s, song = this.song;
    const bar = Math.floor(i / 16) % 4, b = i % 16;
    const chord = song.chords[bar];
    // bicí
    if (b % 8 === 0 || b === 10) s.note(bus, 130, t, 0.18, "sine", 0.9, 42);
    if (b === 4 || b === 12) s.noiseHit(bus, t, 0.14, 0.5, 1800, "bandpass");
    if (b % 2 === 1) s.noiseHit(bus, t, 0.04, 0.22, 7000, "highpass");
    // basa
    if ([0, 3, 6, 8, 11, 14].includes(b)) {
      const n = chord[0] - 12 + (b === 6 || b === 14 ? 12 : 0);
      s.note(bus, hz(n), t, spb * 1.8, "square", 0.32);
    }
    // akordový rozklad
    if (b % 2 === 0) s.note(bus, hz(chord[(b / 2) % 3] + 12), t, spb * 1.5, "triangle", 0.18);
    // melodie
    const m = song.lead[i];
    if (m) {
      let len = 1;
      while (len < 4 && !song.lead[(i + len) % 64]) len++;
      s.note(bus, hz(m), t, spb * len * 0.95, song.leadType, 0.26);
    }
  }
}
