// Pomocník: vyfotí lokální HTML soubor do PNG (pro náhledy). node scripts/shot.mjs in.html out.png [w] [h]
import { chromium } from "playwright-core";
import { pathToFileURL } from "node:url";
import { existsSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
function findChrome() {
  const root = "/opt/pw-browsers";
  for (const dir of readdirSync(root)) {
    if (!dir.startsWith("chromium-") || dir.includes("headless")) continue;
    const exe = join(root, dir, "chrome-linux", "chrome");
    if (existsSync(exe)) return exe;
  }
}
const [inp, out, w = "1600", h = "900"] = process.argv.slice(2);
const b = await chromium.launch({ executablePath: findChrome(), args: ["--no-sandbox"] });
const p = await b.newPage({ viewport: { width: +w, height: +h } });
await p.goto(pathToFileURL(resolve(inp)).href);
await p.screenshot({ path: out, fullPage: true });
await b.close();
