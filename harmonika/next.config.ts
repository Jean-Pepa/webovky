import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const appDir = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  // V repu je víc projektů (vlastní lockfiles i middleware.ts). Root musí být
  // připnutý na složku této appky, jinak by Next odvodil root celého repozitáře.
  outputFileTracingRoot: appDir,
  turbopack: { root: appDir },
};

export default nextConfig;
