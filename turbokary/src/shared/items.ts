// Věci, které se dají sebrat z krystalů na trati.

export type ItemId = "turbo" | "turbo3" | "oil" | "rocket" | "shield";

export const ITEMS: Record<ItemId, { name: string; emoji: string; hint: string }> = {
  turbo: { name: "Turbo", emoji: "⚡", hint: "krátké zrychlení" },
  turbo3: { name: "Trojité turbo", emoji: "⚡", hint: "třikrát zrychlení" },
  oil: { name: "Olej", emoji: "🛢️", hint: "vylij ho za sebe" },
  rocket: { name: "Raketa", emoji: "🚀", hint: "letí po soupeři před tebou" },
  shield: { name: "Štít", emoji: "🛡️", hint: "chrání před jedním zásahem" },
};

export const ITEM_IDS = Object.keys(ITEMS) as ItemId[];
