// Vlastní postavičky (zvířátka a robot) — každá má svou barvu motokáry.
// Všechny jezdí stejně rychle, liší se jen vzhledem. Zrychlit jde jen turbem, driftem,
// závětřím, skokánky a věcmi.

export type CharStyle = "fox" | "frog" | "penguin" | "bunny" | "cat" | "bear" | "robot" | "pig";

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
}

export const CHARACTERS: CharacterDef[] = [
  { id: 0, name: "Liška Zrzka", short: "Zrzka", emoji: "🦊", style: "fox", kart: 0xff7a1a, accent: 0xfff1d6, fur: 0xf27a24, fur2: 0xfff6ea, shirt: 0x2b2d42 },
  { id: 1, name: "Žabák Kvak", short: "Kvak", emoji: "🐸", style: "frog", kart: 0x3ccf4e, accent: 0xfff36b, fur: 0x63d34c, fur2: 0xdaf7a6, shirt: 0xff6b6b },
  { id: 2, name: "Tučňák Frak", short: "Frak", emoji: "🐧", style: "penguin", kart: 0x22b8f0, accent: 0xffffff, fur: 0x23272e, fur2: 0xffffff, shirt: 0xffb703 },
  { id: 3, name: "Králík Hop", short: "Hop", emoji: "🐰", style: "bunny", kart: 0xff5fa8, accent: 0xffffff, fur: 0xf4f4f4, fur2: 0xffb3c9, shirt: 0x7b61ff },
  { id: 4, name: "Kocour Mour", short: "Mour", emoji: "🐱", style: "cat", kart: 0x9b4dff, accent: 0x2b2b33, fur: 0x8d8d9b, fur2: 0xf0f0f0, shirt: 0x06d6a0 },
  { id: 5, name: "Medvěd Huňáč", short: "Huňáč", emoji: "🐻", style: "bear", kart: 0x2f6bff, accent: 0xffd23f, fur: 0x8a5a2b, fur2: 0xd9a46c, shirt: 0xef476f },
  { id: 6, name: "Robot Šroubek", short: "Šroubek", emoji: "🤖", style: "robot", kart: 0xe53935, accent: 0xb0bec5, fur: 0xc3ccd3, fur2: 0x4fe3ff, shirt: 0x37474f },
  { id: 7, name: "Prasátko Kvík", short: "Kvík", emoji: "🐷", style: "pig", kart: 0xffd21f, accent: 0xff6f91, fur: 0xffa7bb, fur2: 0xff7f9e, shirt: 0x118ab2 },
];

export const hex = (c: number) => "#" + c.toString(16).padStart(6, "0");
