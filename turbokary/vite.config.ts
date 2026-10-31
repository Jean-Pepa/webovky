import { defineConfig, type Plugin } from "vite";
import { existsSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const here = (p: string) => fileURLToPath(new URL(p, import.meta.url));

/**
 * Seznam obrázků v public/img (dodává je Codex) jako modul `virtual:assets`.
 * Hra tak ví, které obrázky existují, a jinak použije náhradu — bez zbytečných 404.
 */
function assetList(): Plugin {
  const id = "virtual:assets";
  const rid = "\0" + id;
  const root = here("./public/img");
  const walk = (dir: string, out: string[]) => {
    for (const name of readdirSync(dir)) {
      const p = join(dir, name);
      if (statSync(p).isDirectory()) walk(p, out);
      else if (/\.(png|webp|jpe?g|svg)$/i.test(name)) out.push(relative(root, p).split("\\").join("/"));
    }
    return out;
  };
  return {
    name: "turbokary-assets",
    resolveId: (s) => (s === id ? rid : null),
    load: (i) => (i === rid ? `export default ${JSON.stringify(existsSync(root) ? walk(root, []) : [])};` : null),
  };
}

// Dvě stránky: index.html = obrazovka na PC (hra), pad.html = ovladač v telefonu.
export default defineConfig({
  plugins: [assetList()],
  server: { host: true },
  preview: { host: true },
  build: {
    target: "es2020",
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      input: { main: here("./index.html"), pad: here("./pad.html") },
    },
  },
});
