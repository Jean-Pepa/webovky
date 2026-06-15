import type { MetadataRoute } from "next";
import { CATEGORIES, PRODUCTS } from "@/data/catalog";

const base = "https://www.eika.cz";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/katalog`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/o-nas`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/kontakt`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/poptavka`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];
  for (const c of CATEGORIES) {
    pages.push({ url: `${base}/katalog/${c.slug}`, lastModified: now, changeFrequency: "weekly", priority: 0.8 });
  }
  for (const p of PRODUCTS) {
    pages.push({ url: `${base}/produkt/${p.slug}`, lastModified: now, changeFrequency: "weekly", priority: 0.6 });
  }
  return pages;
}
