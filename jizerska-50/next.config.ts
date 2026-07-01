import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const appDir = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  // Statický export do out/ — appka je celá client-side (localStorage), takže
  // ji lze hostovat jako statické soubory kdekoli a cachovat pro offline režim.
  output: "export",
  // V repu je víc projektů (vlastní lockfiles). Bez připnutí by Next na Vercelu
  // odvodil root celého repozitáře a omylem kompiloval cizí soubory.
  outputFileTracingRoot: appDir,
  turbopack: { root: appDir },
};

export default nextConfig;
