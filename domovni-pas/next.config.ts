import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const appDir = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  // Pin workspace root na tuto appku (vedle existuje rodičovský projekt s vlastním lockfile).
  turbopack: { root: appDir },
};

export default nextConfig;
