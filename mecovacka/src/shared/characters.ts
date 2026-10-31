// Šermíři — stejná zvířátka jako v TurboKárách, tentokrát s pěnovými meči.

export type CharStyle = "fox" | "frog" | "penguin" | "bunny" | "cat" | "bear" | "robot" | "pig";

export interface FighterStats {
  /** síla odhozu, který rozdává (násobek) */
  power: number;
  /** váha — odolnost proti odhozu (násobek) */
  weight: number;
  /** délka meče (násobek) */
  reach: number;
}

export interface CharacterDef {
  id: number;
  name: string;
  short: string;
  emoji: string;
  style: CharStyle;
  /** hlavní barva (vesta, pěnový meč) */
  main: number;
  /** doplňková barva (lemy, záštita) */
  accent: number;
  /** barva hlavy / srsti */
  fur: number;
  /** druhá barva (čumák, bříško, vnitřek uší) */
  fur2: number;
  /** barva trička (rukávy) */
  shirt: number;
  cls: "lehký" | "střední" | "těžký";
  /** krátká povaha do lobby */
  trait: string;
  stats: FighterStats;
}

export const CHARACTERS: CharacterDef[] = [
  { id: 0, name: "Liška Zrzka", short: "Zrzka", emoji: "🦊", style: "fox", main: 0xff7a1a, accent: 0xfff1d6, fur: 0xf27a24, fur2: 0xfff6ea, shirt: 0x2b2d42, cls: "střední", trait: "vyvážená", stats: { power: 1.0, weight: 0.96, reach: 1.02 } },
  { id: 1, name: "Žabák Kvak", short: "Kvak", emoji: "🐸", style: "frog", main: 0x3ccf4e, accent: 0xfff36b, fur: 0x63d34c, fur2: 0xdaf7a6, shirt: 0xff6b6b, cls: "lehký", trait: "dlouhý meč", stats: { power: 0.92, weight: 0.86, reach: 1.08 } },
  { id: 2, name: "Tučňák Frak", short: "Frak", emoji: "🐧", style: "penguin", main: 0x22b8f0, accent: 0xffffff, fur: 0x23272e, fur2: 0xffffff, shirt: 0xffb703, cls: "střední", trait: "pevně stojí", stats: { power: 0.98, weight: 1.06, reach: 0.98 } },
  { id: 3, name: "Králík Hop", short: "Hop", emoji: "🐰", style: "bunny", main: 0xff5fa8, accent: 0xffffff, fur: 0xf4f4f4, fur2: 0xffb3c9, shirt: 0x7b61ff, cls: "lehký", trait: "dlouhý meč", stats: { power: 0.94, weight: 0.85, reach: 1.07 } },
  { id: 4, name: "Kocour Mour", short: "Mour", emoji: "🐱", style: "cat", main: 0x9b4dff, accent: 0x2b2b33, fur: 0x8d8d9b, fur2: 0xf0f0f0, shirt: 0x06d6a0, cls: "střední", trait: "vyvážený", stats: { power: 1.02, weight: 0.95, reach: 1.02 } },
  { id: 5, name: "Medvěd Huňáč", short: "Huňáč", emoji: "🐻", style: "bear", main: 0x2f6bff, accent: 0xffd23f, fur: 0x8a5a2b, fur2: 0xd9a46c, shirt: 0xef476f, cls: "těžký", trait: "silná rána", stats: { power: 1.12, weight: 1.2, reach: 0.95 } },
  { id: 6, name: "Robot Šroubek", short: "Šroubek", emoji: "🤖", style: "robot", main: 0xe53935, accent: 0xb0bec5, fur: 0xc3ccd3, fur2: 0x4fe3ff, shirt: 0x37474f, cls: "těžký", trait: "těžký jako skříň", stats: { power: 1.06, weight: 1.26, reach: 0.96 } },
  { id: 7, name: "Prasátko Kvík", short: "Kvík", emoji: "🐷", style: "pig", main: 0xffd21f, accent: 0xff6f91, fur: 0xffa7bb, fur2: 0xff7f9e, shirt: 0x118ab2, cls: "těžký", trait: "silná rána", stats: { power: 1.1, weight: 1.14, reach: 0.97 } },
];

export const hex = (c: number) => "#" + c.toString(16).padStart(6, "0");
