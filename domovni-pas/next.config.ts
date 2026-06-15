import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const appDir = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  // Pin workspace root na tuto appku (vedle existuje rodičovský projekt s vlastním lockfile).
  turbopack: { root: appDir },
  // Prisma musí zůstat externí vůči server bundlu.
  serverExternalPackages: ["@prisma/client", "prisma"],
  experimental: {
    // Fotky a videa se nahrávají přes server actions.
    serverActions: { bodySizeLimit: "30mb" },
  },
};

export default nextConfig;
