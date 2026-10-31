// Obrázky od Codexe (public/img). Když obrázek chybí, vrací null a použije se náhrada.
import files from "virtual:assets";
import type { ItemId } from "./items";

const have = new Set(files);
const BASE = import.meta.env.BASE_URL;

export function img(name: string): string | null {
  for (const ext of [".png", ".webp", ".svg", ".jpg", ".jpeg"]) {
    if (have.has(name + ext)) return `${BASE}img/${name}${ext}`;
  }
  return null;
}

export const charImg = (id: number) => img(`chars/${id}`);
export const itemImg = (id: ItemId) => img(`items/${id}`);
export const padImg = (name: "gas" | "brake" | "drift" | "item") => img(`pad/${name}`);
export const logoImg = () => img("logo");
