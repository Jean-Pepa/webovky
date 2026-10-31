import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";

const here = (p: string) => fileURLToPath(new URL(p, import.meta.url));

// Dvě stránky: index.html = obrazovka na PC (hra), pad.html = ovladač v telefonu.
export default defineConfig({
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
