// Vzhled a „povrch“ tratí.

export type DecorKind = "tree" | "pine" | "rock" | "bush" | "cactus" | "palm" | "snowpine" | "snowman" | "crystal";

export interface Theme {
  id: string;
  ground: number;
  groundDots: number;
  flowers: boolean;
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
  /** vzdálená krajina: zelené kopce, skalní stolové hory, nebo zasněžené kopce */
  scenery: "hills" | "mesas" | "snow";
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
  /** částice ve vzduchu (sněžení) */
  snow: boolean;
}

export const THEMES: Record<string, Theme> = {
  meadow: {
    id: "meadow",
    ground: 0x6cc24a,
    groundDots: 0x5aae3c,
    flowers: true,
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
    scenery: "hills",
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
    snow: false,
  },
  desert: {
    id: "desert",
    ground: 0xe9b872,
    groundDots: 0xd99c58,
    flowers: false,
    road: 0x5b4b49,
    roadLine: 0xfff3d6,
    curbA: 0xff7b00,
    curbB: 0xfff3d6,
    wallA: 0xfff3d6,
    wallB: 0xc1121f,
    skyTop: 0x4f7cff,
    skyHorizon: 0xffe3b8,
    fogNear: 200,
    fogFar: 1200,
    sun: 0xffe2b8,
    sunIntensity: 2.6,
    hemiSky: 0xffe9c4,
    hemiGround: 0xb5784a,
    scenery: "mesas",
    hill: 0xd9894a,
    mountain: 0xc2703c,
    mountainCap: 0xe9a15e,
    decor: [
      { kind: "cactus", weight: 5 },
      { kind: "rock", weight: 4 },
      { kind: "palm", weight: 1 },
    ],
    decorDensity: 0.75,
    grip: 0.92,
    offroad: 0.5,
    dust: 0xe0b070,
    snow: false,
  },
  ice: {
    id: "ice",
    ground: 0xeef6ff,
    groundDots: 0xd3e5fa,
    flowers: false,
    road: 0x9fc4e6,
    roadLine: 0xffffff,
    curbA: 0x1d4ed8,
    curbB: 0xffffff,
    wallA: 0xffffff,
    wallB: 0x38bdf8,
    skyTop: 0x5c7cc4,
    skyHorizon: 0xe3ecff,
    fogNear: 140,
    fogFar: 900,
    sun: 0xf3f7ff,
    sunIntensity: 2.1,
    hemiSky: 0xe8f1ff,
    hemiGround: 0x9fb8d6,
    scenery: "snow",
    hill: 0xf4f8ff,
    mountain: 0x8aa6c8,
    mountainCap: 0xffffff,
    decor: [
      { kind: "snowpine", weight: 6 },
      { kind: "snowman", weight: 1 },
      { kind: "crystal", weight: 1 },
      { kind: "rock", weight: 1 },
    ],
    decorDensity: 1,
    grip: 0.45,
    offroad: 0.6,
    dust: 0xffffff,
    snow: true,
  },
  crazy: {
    id: "crazy",
    ground: 0x5f8f3a,
    groundDots: 0x4c7a2e,
    flowers: true,
    road: 0x363944,
    roadLine: 0xffd21f,
    curbA: 0xffd21f,
    curbB: 0x1b1430,
    wallA: 0xffd21f,
    wallB: 0x1b1430,
    skyTop: 0x4b3ab8,
    skyHorizon: 0xffb68a,
    fogNear: 240,
    fogFar: 1500,
    sun: 0xffd6a8,
    sunIntensity: 2.3,
    hemiSky: 0xffd9c2,
    hemiGround: 0x4a5a3a,
    scenery: "hills",
    hill: 0x5d8a3a,
    mountain: 0x7b7f8f,
    mountainCap: 0xffffff,
    decor: [
      { kind: "pine", weight: 5 },
      { kind: "rock", weight: 3 },
      { kind: "tree", weight: 2 },
      { kind: "bush", weight: 1 },
    ],
    decorDensity: 0.9,
    grip: 1,
    offroad: 0.55,
    dust: 0x9a8a6a,
    snow: false,
  },
};
