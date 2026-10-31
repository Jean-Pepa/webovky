// Vzhled a „povrch“ trati.

export type DecorKind = "tree" | "pine" | "rock" | "bush";

export interface Theme {
  id: string;
  ground: number;
  groundDots: number;
  road: number;
  roadLine: number;
  curbA: number;
  curbB: number;
  wallA: number;
  wallB: number;
  skyTop: number;
  skyHorizon: number;
  fogNear: number;
  fogFar: number;
  sun: number;
  sunIntensity: number;
  hemiSky: number;
  hemiGround: number;
  hill: number;
  mountain: number;
  mountainCap: number;
  decor: { kind: DecorKind; weight: number }[];
  decorDensity: number;
  /** přilnavost: 1 = normální, menší = klouže */
  grip: number;
  /** max. rychlost mimo silnici (násobek) */
  offroad: number;
  dust: number;
}

export const THEMES: Record<string, Theme> = {
  meadow: {
    id: "meadow",
    ground: 0x6cc24a,
    groundDots: 0x5aae3c,
    road: 0x4a4f5a,
    roadLine: 0xf5f5f5,
    curbA: 0xe63946,
    curbB: 0xf8f9fa,
    wallA: 0xf8f9fa,
    wallB: 0x2f6bff,
    skyTop: 0x3a8dff,
    skyHorizon: 0xd6eeff,
    fogNear: 180,
    fogFar: 1100,
    sun: 0xfff4dc,
    sunIntensity: 2.4,
    hemiSky: 0xcfe8ff,
    hemiGround: 0x5a8f3a,
    hill: 0x5aaa44,
    mountain: 0x8394ad,
    mountainCap: 0xffffff,
    decor: [
      { kind: "tree", weight: 5 },
      { kind: "pine", weight: 2 },
      { kind: "bush", weight: 3 },
      { kind: "rock", weight: 1 },
    ],
    decorDensity: 1,
    grip: 1,
    offroad: 0.55,
    dust: 0x8fc860,
  },
};
