import type { MetadataRoute } from "next";
import { CATEGORIES, PRODUCTS } from "@/data/catalog";

const base = "https://www.eika.cz";

// Pro každou českou cestu vytvoří hreflang alternativy (cs kořen, en/de prefix).
function entry(
  path: string,
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
  priority: number,
  now: Date,
): MetadataRoute.Sitemap[number] {
  const en = `${base}/en${path === "/" ? "" : path}`;
  const de = `${base}/de${path === "/" ? "" : path}`;
  const cs = `${base}${path === "/" ? "/" : path}`;
  return {
    url: cs,
    lastModified: now,
    changeFrequency,
    priority,
    alternates: { languages: { cs, en, de } },
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages: MetadataRoute.Sitemap = [
    entry("/", "weekly", 1, now),
    entry("/katalog", "weekly", 0.9, now),
    entry("/sluzby", "monthly", 0.7, now),
    entry("/cerpaci-stanice", "monthly", 0.6, now),
    entry("/o-nas", "monthly", 0.6, now),
    entry("/kontakt", "monthly", 0.6, now),
    entry("/poptavka", "monthly", 0.5, now),
    entry("/ochrana-osobnich-udaju", "yearly", 0.3, now),
    entry("/obchodni-podminky", "yearly", 0.3, now),
    entry("/reklamacni-rad", "yearly", 0.3, now),
  ];
  for (const c of CATEGORIES) {
    pages.push(entry(`/katalog/${c.slug}`, "weekly", 0.8, now));
  }
  for (const p of PRODUCTS) {
    pages.push(entry(`/produkt/${p.slug}`, "weekly", 0.6, now));
  }
  return pages;
}
