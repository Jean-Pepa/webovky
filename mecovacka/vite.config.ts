import { defineConfig, type Plugin } from "vite";
import basicSsl from "@vitejs/plugin-basic-ssl";
import { existsSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const here = (p: string) => fileURLToPath(new URL(p, import.meta.url));

/**
 * Seznamy souborů od Codexu jako moduly `virtual:assets` (obrázky v public/img) a `virtual:models`
 * (3D modely v public/models). Hra tak ví, co existuje, a jinak kreslí náhradu — bez zbytečných 404.
 */
function assetList(): Plugin {
  const lists: Record<string, { root: string; ext: RegExp }> = {
    "virtual:assets": { root: here("./public/img"), ext: /\.(png|webp|jpe?g|svg)$/i },
    "virtual:models": { root: here("./public/models"), ext: /\.(glb|gltf)$/i },
  };
  const walk = (root: string, dir: string, ext: RegExp, out: string[]) => {
    for (const name of readdirSync(dir)) {
      const p = join(dir, name);
      if (statSync(p).isDirectory()) walk(root, p, ext, out);
      else if (ext.test(name)) out.push(relative(root, p).split("\\").join("/"));
    }
    return out;
  };
  return {
    name: "mecovacka-assets",
    resolveId: (s) => (lists[s] ? "\0" + s : null),
    load: (i) => {
      const l = lists[i.slice(1)];
      if (!i.startsWith("\0") || !l) return null;
      return `export default ${JSON.stringify(existsSync(l.root) ? walk(l.root, l.root, l.ext, []) : [])};`;
    },
  };
}

// Dvě stránky: index.html = obrazovka na PC (hra), pad.html = meč v telefonu.
// `npm run dev:https` (mode https) zapne https s vlastním certifikátem — pohybové senzory
// v telefonu fungují jen přes https, takže jde hru vyzkoušet doma i bez nasazení.
export default defineConfig(({ mode }) => ({
  plugins: [assetList(), ...(mode === "https" ? [basicSsl()] : [])],
  server: { host: true },
  preview: { host: true },
  build: {
    target: "es2020",
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      input: { main: here("./index.html"), pad: here("./pad.html") },
    },
  },
}));
