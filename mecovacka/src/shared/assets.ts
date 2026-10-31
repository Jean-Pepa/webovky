// Volitelné obrázky v public/img (portréty, logo). Když obrázek chybí, vrací null a použije se náhrada.
import files from "virtual:assets";

const have = new Set(files);
const BASE = import.meta.env.BASE_URL;

export function img(name: string): string | null {
  for (const ext of [".png", ".webp", ".svg", ".jpg", ".jpeg"]) {
    if (have.has(name + ext)) return `${BASE}img/${name}${ext}`;
  }
  return null;
}

export const charImg = (id: number) => img(`chars/${id}`);
export const logoImg = () => img("logo");
export const modeImg = (id: string) => img(`modes/${id}`);
export const padImg = (name: "shield" | "hold") => img(`pad/${name}`);
