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

export interface GoldenDef {
  /** poloha podél trati (0–1) */
  at: number;
  /** příčná poloha (-1 … 1) */
  d: number;
  /** výška nad silnicí (m) — vysoko visící bedna jde sebrat jen výskokem */
  h: number;
}

export interface TrackDef {
  id: string;
  name: string;
  desc: string;
  theme: "meadow" | "desert" | "ice" | "crazy";
  /** řídicí body [x, z] nebo [x, z, výška] */
  pts: ([number, number] | [number, number, number])[];
  /** polovina šířky silnice */
  hw: number;
  /** řady krystalů (zlomky délky trati) */
  items: number[];
  boosts: BoostPad[];
  ramps: RampDef[];
  /** zlaté bedny (křídla a jiné silné věci) */
  golden: GoldenDef[];
  /** tunely skrz skálu (zlomky délky trati) */
  tunnels?: { from: number; to: number }[];
  /** místa, kam občas spadne letadlo (zlomky délky trati) */
  planes?: number[];
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
    golden: [{ at: 0.147, d: 0.3, h: 2.6 }],
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
    golden: [{ at: 0.802, d: 0.3, h: 2.6 }],
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
    golden: [{ at: 0.127, d: -0.3, h: 2.6 }],
  },
  {
    id: "hora",
    name: "Šílená hora",
    desc: "Serpentiny do kopce, tunel skrz skálu, most, velký skok a padající letadla!",
    theme: "crazy",
    hw: 8.5,
    pts: [
      [-40, 0, 0], [40, 0, 0], [110, 6, 0], [158, 46, 2], [162, 100, 5], [161, 140, 7.5],
      [162, 172, 9], [171, 196, 9.8], [192, 206, 10.3], [213, 196, 10.8], [222, 172, 11.6], [223, 140, 13],
      [220, 96, 15.5], [221, 76, 16.5], [231, 54, 17.5], [257, 44, 19], [283, 54, 20], [293, 78, 21], [294, 100, 22.5],
      [290, 160, 25.5], [266, 222, 28], [216, 248, 29], [160, 252, 29], [112, 240, 27],
      [70, 226, 20], [44, 186, 22], [42, 140, 17], [48, 92, 19], [52, 44, 14], [50, -6, 12],
      [46, -56, 9], [16, -94, 6], [-40, -104, 4], [-90, -76, 2], [-110, -26, 1], [-90, 4, 0],
    ],
    items: [0.1, 0.305, 0.645, 0.86],
    boosts: [{ at: 0.035, d: 0 }, { at: 0.465, d: 0 }, { at: 0.705, d: 0.2 }],
    ramps: [{ at: 0.583, d: 0 }],
    golden: [{ at: 0.596, d: 0, h: 3 }, { at: 0.9, d: -0.8, h: 0.6 }],
    tunnels: [{ from: 0.505, to: 0.565 }],
    planes: [0.72, 0.88, 0.2],
  },
];
