// Tratě (zatím jedna — další se přidají jako další položka pole TRACKS).
// Řídicí body (x, z v metrech) uzavřené Catmull-Rom křivky.
// Jezdí se ve směru pořadí bodů, start/cíl je u prvního bodu.
// Tento soubor jsou jen data (používá ho i kontrolní skript scripts/check-tracks.ts).

export interface BoostPad {
  /** poloha podél trati jako zlomek délky (0–1) */
  at: number;
  /** příčná poloha: -1 = levý okraj, 0 = střed, 1 = pravý okraj */
  d: number;
}

export interface RampDef {
  /** poloha podél trati (0–1) */
  at: number;
  /** příčná poloha (-1 … 1) */
  d: number;
}

export interface TrackDef {
  id: string;
  name: string;
  desc: string;
  theme: "meadow" | "desert" | "ice";
  pts: [number, number][];
  /** polovina šířky silnice */
  hw: number;
  /** řady krystalů (zlomky délky trati) */
  items: number[];
  boosts: BoostPad[];
  ramps: RampDef[];
}

export const TRACKS: TrackDef[] = [
  {
    id: "louka",
    name: "Zelená louka",
    desc: "Plynulé zatáčky mezi stromy. Ideální na první závod.",
    theme: "meadow",
    hw: 8.5,
    pts: [
      [-120, 0], [-40, 0], [40, 0], [110, 10], [150, 50], [152, 110], [112, 150], [50, 152],
      [12, 122], [-30, 92], [-80, 110], [-128, 142], [-180, 122], [-202, 62], [-172, 14],
    ],
    items: [0.2, 0.52, 0.8],
    boosts: [{ at: 0.06, d: 0 }, { at: 0.62, d: -0.3 }],
    ramps: [{ at: 0.13, d: 0.3 }],
  },
  {
    id: "kanon",
    name: "Písečný kaňon",
    desc: "Ostré vracečky, skokánky a kaktusy. Driftuj!",
    theme: "desert",
    hw: 8,
    pts: [
      [-40, 0], [24, 0], [72, 2], [112, -26], [120, -78], [86, -112], [36, -112], [8, -148],
      [34, -190], [94, -198], [146, -178], [182, -136], [204, -76], [196, -10], [168, 44],
      [108, 72], [34, 72], [-36, 70], [-100, 68], [-136, 54], [-146, 30], [-132, 6], [-96, -2],
    ],
    items: [0.18, 0.47, 0.74],
    boosts: [{ at: 0.04, d: 0.25 }, { at: 0.56, d: 0 }, { at: 0.83, d: -0.2 }],
    ramps: [{ at: 0.495, d: -0.3 }, { at: 0.79, d: 0.3 }],
  },
  {
    id: "jezero",
    name: "Ledové jezero",
    desc: "Zamrzlé jezero, kde to klouže. Brzdi včas!",
    theme: "ice",
    hw: 9,
    pts: [
      [-60, 0], [40, 0], [120, 6], [178, 42], [194, 104], [164, 160], [106, 184], [54, 166],
      [2, 190], [-50, 214], [-110, 198], [-152, 150], [-158, 84], [-122, 32],
    ],
    items: [0.16, 0.45, 0.75],
    boosts: [{ at: 0.05, d: 0 }, { at: 0.58, d: 0.2 }],
    ramps: [{ at: 0.11, d: -0.3 }],
  },
];
