import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const appDir = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  // V repu je víc projektů (vlastní lockfiles i middleware.ts). Bez připnutí by Next
  // na Vercelu odvodil root celého repozitáře a omylem kompiloval cizí soubory.
  // Oba musí mít stejnou hodnotu = složka této appky.
  outputFileTracingRoot: appDir,
  turbopack: { root: appDir },
  // Otisk nasazení (commit na Vercelu) — klient ho porovnává s /api/version a po
  // novém nasazení si otevřená appka na telefonu sama načte novou verzi.
  env: { NEXT_PUBLIC_BUILD_ID: process.env.VERCEL_GIT_COMMIT_SHA || process.env.VERCEL_DEPLOYMENT_ID || "dev" },
};

export default nextConfig;
