import type { Metadata } from "next";
import type { Lang } from "./messages";

// Vytvoří canonical + hreflang alternativy pro danou českou cestu.
// cs běží na kořeni, en/de mají prefix.
export function altLinks(lang: Lang, path: string): Metadata["alternates"] {
  const enPath = `/en${path === "/" ? "" : path}`;
  const dePath = `/de${path === "/" ? "" : path}`;
  const csPath = path;
  const canonical = lang === "en" ? enPath : lang === "de" ? dePath : csPath;
  return {
    canonical,
    languages: {
      cs: csPath,
      en: enPath,
      de: dePath,
      "x-default": csPath,
    },
  };
}
