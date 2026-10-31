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

export interface TrackDef {
  id: string;
  name: string;
  desc: string;
  theme: "meadow";
  pts: [number, number][];
  /** polovina šířky silnice */
  hw: number;
  /** řady krystalů (zlomky délky trati) */
  items: number[];
  boosts: BoostPad[];
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
  },
];
