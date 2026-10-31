// Věci, které se dají sebrat z krystalů na trati.

export type ItemId = "turbo" | "turbo3" | "oil" | "coconut" | "rocket" | "bees" | "shield" | "ram";

export interface ItemDef {
  name: string;
  emoji: string;
  hint: string;
  /** výchozí směr: 1 = dopředu, -1 = za sebe, 0 = nikam (použije se na sebe) */
  dir: -1 | 0 | 1;
}

export const ITEMS: Record<ItemId, ItemDef> = {
  turbo: { name: "Turbo", emoji: "⚡", hint: "krátké zrychlení", dir: 0 },
  turbo3: { name: "Trojité turbo", emoji: "⚡", hint: "třikrát zrychlení", dir: 0 },
  oil: { name: "Olej", emoji: "🛢️", hint: "vylij za sebe nebo hoď dopředu", dir: -1 },
  coconut: { name: "Kokos", emoji: "🥥", hint: "letí rovně a odráží se od bariér", dir: 1 },
  rocket: { name: "Raketa", emoji: "🚀", hint: "navede se na soupeře před tebou (nebo za tebou)", dir: 1 },
  bees: { name: "Roj včel", emoji: "🐝", hint: "letí na vedoucího závodníka", dir: 1 },
  shield: { name: "Štít", emoji: "🛡️", hint: "chrání před jedním zásahem", dir: 0 },
  ram: { name: "Beranidlo", emoji: "🐏", hint: "chvíli nezranitelný a rychlejší, trkáš soupeře", dir: 0 },
};

export const ITEM_IDS = Object.keys(ITEMS) as ItemId[];

/** Dá se věc hodit oběma směry? */
export const throwable = (id: ItemId) => id === "oil" || id === "coconut" || id === "rocket";
