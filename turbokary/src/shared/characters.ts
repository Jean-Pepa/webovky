// Vlastní postavičky (zvířátka a robot) — každá má svou barvu motokáry.

export type CharStyle = "fox" | "frog" | "penguin" | "bunny" | "cat" | "bear" | "robot" | "pig";

export interface CharStats {
  /** max. rychlost (násobek) */
  speed: number;
  /** zrychlení (násobek) */
  accel: number;
  /** ovladatelnost v zatáčkách (násobek) */
  handling: number;
  /** váha při srážkách (násobek) */
  weight: number;
}

export interface CharacterDef {
  id: number;
  name: string;
  short: string;
  emoji: string;
  style: CharStyle;
  /** hlavní barva motokáry */
  kart: number;
  /** doplňková barva (bočnice, náboje) */
  accent: number;
  /** barva hlavy / srsti */
  fur: number;
  /** druhá barva (čumák, bříško, vnitřek uší) */
  fur2: number;
  /** barva trička */
  shirt: number;
  cls: "lehká" | "střední" | "těžká";
  stats: CharStats;
}

export const CHARACTERS: CharacterDef[] = [
  { id: 0, name: "Liška Zrzka", short: "Zrzka", emoji: "🦊", style: "fox", kart: 0xff7a1a, accent: 0xfff1d6, fur: 0xf27a24, fur2: 0xfff6ea, shirt: 0x2b2d42, cls: "střední", stats: { speed: 1.0, accel: 1.06, handling: 1.06, weight: 0.92 } },
  { id: 1, name: "Žabák Kvak", short: "Kvak", emoji: "🐸", style: "frog", kart: 0x3ccf4e, accent: 0xfff36b, fur: 0x63d34c, fur2: 0xdaf7a6, shirt: 0xff6b6b, cls: "lehká", stats: { speed: 0.975, accel: 1.14, handling: 1.1, weight: 0.8 } },
  { id: 2, name: "Tučňák Frak", short: "Frak", emoji: "🐧", style: "penguin", kart: 0x22b8f0, accent: 0xffffff, fur: 0x23272e, fur2: 0xffffff, shirt: 0xffb703, cls: "střední", stats: { speed: 1.0, accel: 1.0, handling: 1.02, weight: 1.0 } },
  { id: 3, name: "Králík Hop", short: "Hop", emoji: "🐰", style: "bunny", kart: 0xff5fa8, accent: 0xffffff, fur: 0xf4f4f4, fur2: 0xffb3c9, shirt: 0x7b61ff, cls: "lehká", stats: { speed: 0.97, accel: 1.16, handling: 1.12, weight: 0.78 } },
  { id: 4, name: "Kocour Mour", short: "Mour", emoji: "🐱", style: "cat", kart: 0x9b4dff, accent: 0x2b2b33, fur: 0x8d8d9b, fur2: 0xf0f0f0, shirt: 0x06d6a0, cls: "střední", stats: { speed: 1.01, accel: 1.02, handling: 1.04, weight: 0.95 } },
  { id: 5, name: "Medvěd Huňáč", short: "Huňáč", emoji: "🐻", style: "bear", kart: 0x2f6bff, accent: 0xffd23f, fur: 0x8a5a2b, fur2: 0xd9a46c, shirt: 0xef476f, cls: "těžká", stats: { speed: 1.04, accel: 0.86, handling: 0.9, weight: 1.3 } },
  { id: 6, name: "Robot Šroubek", short: "Šroubek", emoji: "🤖", style: "robot", kart: 0xe53935, accent: 0xb0bec5, fur: 0xc3ccd3, fur2: 0x4fe3ff, shirt: 0x37474f, cls: "těžká", stats: { speed: 1.035, accel: 0.9, handling: 0.92, weight: 1.25 } },
  { id: 7, name: "Prasátko Kvík", short: "Kvík", emoji: "🐷", style: "pig", kart: 0xffd21f, accent: 0xff6f91, fur: 0xffa7bb, fur2: 0xff7f9e, shirt: 0x118ab2, cls: "těžká", stats: { speed: 1.02, accel: 0.94, handling: 0.96, weight: 1.14 } },
];

export const hex = (c: number) => "#" + c.toString(16).padStart(6, "0");
