import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const appDir = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  // V repu je víc projektů (vlastní lockfiles). Bez připnutí by Next odvodil
  // root celého repozitáře a omylem kompiloval cizí soubory. Oba musí ukazovat
  // na složku této appky.
  outputFileTracingRoot: appDir,
  turbopack: { root: appDir },
};

export default nextConfig;
