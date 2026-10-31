// E2E test TurboKáry: PC obrazovka + telefon(y) v jednom prohlížeči, lokální signalizační server.
//
//   npm run build && npm run e2e
//
// Bez BASE_URL si test sám spustí `vite preview` (port 4173) a PeerJS server (port 9000).
// Proměnné: BASE_URL, PEER (host:port), E2E_W/E2E_H (velikost PC okna), E2E_OUT (složka na screenshoty).
import { chromium } from "playwright-core";
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = process.env.E2E_OUT || join(root, "e2e", "out");
const W = Number(process.env.E2E_W || 960);
const H = Number(process.env.E2E_H || 540);
mkdirSync(OUT, { recursive: true });

const procs = [];
let BASE = process.env.BASE_URL;
let PEER = process.env.PEER || "localhost:9000";
async function waitFor(url, ms = 15000) {
  const t0 = Date.now();
  while (Date.now() - t0 < ms) {
    try {
      const r = await fetch(url);
      if (r.ok) return;
    } catch {
      /* ještě neběží */
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error("Server neodpovídá: " + url);
}
if (!BASE) {
  const bin = (n) => join(root, "node_modules", ".bin", n);
  procs.push(spawn(bin("peerjs"), ["--host", "0.0.0.0", "--port", "9000"], { stdio: "ignore" }));
  procs.push(spawn(bin("vite"), ["preview", "--port", "4173", "--strictPort"], { cwd: root, stdio: "ignore" }));
  BASE = "http://localhost:4173";
  await waitFor("http://localhost:9000/peerjs/id");
  await waitFor(BASE + "/");
}

function findChrome() {
  const rootDir = process.env.PLAYWRIGHT_BROWSERS_PATH || "/opt/pw-browsers";
  try {
    for (const dir of readdirSync(rootDir)) {
      if (!dir.startsWith("chromium-") || dir.includes("headless")) continue;
      for (const sub of ["chrome-linux64", "chrome-linux"]) {
        const exe = join(rootDir, dir, sub, "chrome");
        if (existsSync(exe)) return exe;
      }
    }
  } catch {
    /* necháme Playwright najít prohlížeč sám */
  }
  return undefined;
}

const results = [];
const errors = [];
function rec(ok, name, detail = "") {
  results.push({ ok, name });
  console.log(`${ok ? "✅" : "❌"} ${name}${detail ? " — " + detail : ""}`);
}
async function step(name, fn) {
  try {
    await fn();
    rec(true, name);
  } catch (e) {
    rec(false, name, String(e?.message || e).split("\n")[0].slice(0, 240));
  }
}
const expect = (c, m) => {
  if (!c) throw new Error(m);
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function until(fn, ms, what) {
  const t0 = Date.now();
  let last;
  while (Date.now() - t0 < ms) {
    last = await fn();
    if (last) return last;
    await sleep(200);
  }
  throw new Error("Nedočkal jsem se: " + what);
}

const browser = await chromium.launch({
  executablePath: findChrome(),
  args: [
    "--no-sandbox",
    "--use-angle=swiftshader",
    "--enable-unsafe-swiftshader",
    "--ignore-gpu-blocklist",
    "--autoplay-policy=no-user-gesture-required",
    "--disable-features=WebRtcHideLocalIpsWithMdns",
  ],
});
function watch(page, label) {
  page.on("pageerror", (e) => errors.push(`${label} pageerror: ${e.message}`));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(`${label} console: ${m.text().slice(0, 200)}`);
  });
}

// --- PC obrazovka
const pcCtx = await browser.newContext({ viewport: { width: W, height: H } });
const pc = await pcCtx.newPage();
watch(pc, "PC");
const state = () => pc.evaluate(() => window.__tk.state());
await pc.goto(`${BASE}/?peer=${PEER}&speed=4`, { waitUntil: "load" });

let padUrl = "";
await step("PC: lobby s QR kódem a kódem místnosti", async () => {
  const st = await until(async () => {
    const s = await state();
    return s.ready && s.padUrl ? s : null;
  }, 15000, "registrace na signalizačním serveru");
  padUrl = st.padUrl;
  expect(/^[A-Z]{4}$/.test(st.code), "kód " + st.code);
  expect(padUrl.includes(`r=${st.code}`), padUrl);
  const qr = await pc.$eval(".qr", (c) => c.toDataURL().length);
  expect(qr > 2000, "QR je prázdný");
  await pc.screenshot({ path: join(OUT, "pc-lobby.png") });
});

// --- telefon (na šířku, dotyk)
async function phone(label) {
  const ctx = await browser.newContext({ viewport: { width: 844, height: 390 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 });
  // telefon na šířku (otočený doleva) se senzorem náklonu, který hlásí 20× za sekundu
  await ctx.addInitScript(() => {
    Object.defineProperty(screen, "orientation", { value: { angle: 90, type: "landscape-primary", addEventListener() {} }, configurable: true });
    window.__beta = 0;
    setInterval(() => window.dispatchEvent(new DeviceOrientationEvent("deviceorientation", { alpha: 0, beta: window.__beta, gamma: -90 })), 50);
  });
  const page = await ctx.newPage();
  watch(page, label);
  const cdp = await ctx.newCDPSession(page);
  const touches = new Map();
  const send = (type) =>
    cdp.send("Input.dispatchTouchEvent", { type, touchPoints: [...touches.entries()].map(([id, p]) => ({ x: p.x, y: p.y, id })) });
  const center = async (sel) => {
    const b = await page.locator(sel).first().boundingBox();
    return { x: b.x + b.width / 2, y: b.y + b.height / 2 };
  };
  return {
    ctx,
    page,
    async hold(id, sel) {
      touches.set(id, await center(sel));
      await send("touchStart");
    },
    async release(id) {
      touches.delete(id);
      await send(touches.size ? "touchEnd" : "touchEnd");
    },
    async tap(sel) {
      touches.set(99, await center(sel));
      await send("touchStart");
      await sleep(60);
      touches.delete(99);
      await send("touchEnd");
    },
    async tilt(deg) {
      // telefon na šířku displejem k sobě (gamma -90); natočení jako volantem mění betu:
      // +20 = otočeno o 20° po směru hodinek = doprava
      await page.evaluate((b) => (window.__beta = b), deg);
    },
  };
}

const p1 = await phone("Telefon 1");

await step("Telefon: otevře odkaz z QR a připojí se", async () => {
  await p1.page.goto(padUrl, { waitUntil: "load" });
  await p1.page.waitForSelector(".lobby-scr", { timeout: 20000 });
  const st = await until(async () => {
    const s = await state();
    return s.players.length === 1 && s.players[0].online ? s : null;
  }, 8000, "hráč v lobby na PC");
  expect(st.players[0].kind === "pad", "druh hráče");
  await p1.page.screenshot({ path: join(OUT, "phone-lobby.png") });
});

await step("Telefon: jméno a postavička se propíšou na PC", async () => {
  await p1.page.fill(".name-in", "Kristýna");
  await p1.page.click('.ch[data-char="3"]');
  await until(async () => {
    const s = await state();
    return s.players[0].name === "Kristýna" && s.players[0].char === 3;
  }, 5000, "změna jména a postavy");
  const txt = await pc.textContent(".lb-players");
  expect(txt.includes("Kristýna"), "PC lobby neukazuje jméno");
});

await step("Telefon: hráč 1 je hostitel a vidí START", async () => {
  await p1.page.waitForSelector(".host-box:not([hidden])", { timeout: 5000 });
  await p1.page.click("[data-a=laps-]");
  await p1.page.click("[data-a=laps-]");
  await until(async () => (await p1.page.textContent(".laps")) === "1", 4000, "počet kol 1");
});

await step("Start z telefonu → odpočet na PC, ovladač na telefonu", async () => {
  await p1.page.click("[data-a=start]");
  await until(async () => (await state()).phase !== "lobby", 5000, "start závodu");
  await p1.page.waitForSelector(".race-scr", { timeout: 5000 });
  await until(async () => (await state()).phase === "race", 20000, "konec odpočtu");
});

await step("Plyn + náklon: motokára jede a zatáčí podle telefonu", async () => {
  await p1.tilt(0); // rovně
  await p1.hold(1, ".btn.gas");
  await sleep(2500);
  let s = await state();
  const me = () => s.race.karts.find((k) => k.slot === 0);
  expect(me().speed > 20, "rychlost " + me().speed);
  const d0 = me().d;
  const steer = await p1.page.evaluate(() => document.querySelector(".race-scr") !== null);
  expect(steer, "ovladač");
  // náklon doprava (pravý okraj dolů) → kára uhne doprava (d roste)
  await p1.tilt(20);
  await sleep(1200);
  s = await state();
  const d1 = me().d;
  const wheel = await p1.page.$eval(".wheel svg", (e) => e.style.transform);
  expect(/rotate\(\d/.test(wheel), "volant na telefonu se nenatočil: " + wheel);
  await p1.tilt(0);
  await sleep(600);
  expect(d1 > d0 + 0.5, `příčná poloha ${d0} → ${d1}`);
  await p1.page.screenshot({ path: join(OUT, "phone-race.png") });
  await pc.screenshot({ path: join(OUT, "pc-race-1p.png") });
});

await step("Věc: telefon ukáže věc a tlačítkem ji použije", async () => {
  await pc.evaluate(() => window.__tk.giveItem(0, "turbo"));
  await p1.page.waitForSelector(".item-big.has", { timeout: 4000 });
  await p1.tap(".item-big");
  await until(async () => (await state()).race.karts.find((k) => k.slot === 0).item === null, 4000, "spotřebování věci");
  await p1.release(1);
});

await step("Závod do cíle (autopilot) → výsledky na PC i telefonu", async () => {
  await pc.evaluate(() => window.__tk.autopilot(0, true));
  await until(async () => (await state()).phase === "results", 120000, "konec závodu");
  await p1.page.waitForSelector(".results-scr", { timeout: 6000 });
  const place = await p1.page.textContent(".place");
  expect(/^\d\.$/.test(place.trim()), "místo " + place);
  await pc.screenshot({ path: join(OUT, "pc-results.png") });
  await p1.page.screenshot({ path: join(OUT, "phone-results.png") });
});

await step("Další závod z telefonu → zpět do lobby", async () => {
  await p1.page.click("[data-a=next]");
  await until(async () => (await state()).phase === "lobby", 5000, "lobby");
  await p1.page.waitForSelector(".lobby-scr", { timeout: 5000 });
});

const p2 = await phone("Telefon 2");
await step("Druhý telefon se připojí jako hráč 2 (jiná postavička)", async () => {
  await p2.page.goto(padUrl, { waitUntil: "load" });
  await p2.page.waitForSelector(".lobby-scr", { timeout: 20000 });
  const s = await until(async () => {
    const st = await state();
    return st.players.length === 2 ? st : null;
  }, 8000, "dva hráči");
  expect(s.players[0].char !== s.players[1].char, "stejná postava");
  const disabled = await p2.page.$eval('.ch[data-char="3"]', (b) => b.disabled);
  expect(disabled, "obsazená postava není zašedlá");
  const host2 = await p2.page.$eval(".host-box", (b) => b.hidden);
  expect(host2, "hráč 2 nemá být hostitel");
});

await step("Obnovení stránky telefonu → stejný slot (znovupřipojení)", async () => {
  await p2.page.reload({ waitUntil: "load" });
  await p2.page.waitForSelector(".lobby-scr", { timeout: 20000 });
  await sleep(500);
  const s = await state();
  expect(s.players.length === 2, "hráčů: " + s.players.length);
});

await step("Klávesnice + 2 telefony → rozdělená obrazovka pro 3 hráče", async () => {
  await pc.keyboard.press("KeyK");
  await until(async () => (await state()).players.length === 3, 3000, "hráč na klávesnici");
  await p1.page.click("[data-a=start]");
  await until(async () => (await state()).phase === "race", 25000, "start");
  await sleep(1500);
  const panels = await pc.$$eval(".pp", (e) => e.length);
  expect(panels === 3, "panelů HUD: " + panels);
  await pc.screenshot({ path: join(OUT, "pc-race-3p.png") });
  await pc.keyboard.press("Escape");
  await until(async () => (await state()).phase === "lobby", 5000, "zpět do lobby");
});

await step("Žádné chyby v konzoli", async () => {
  const uniq = [...new Set(errors)];
  expect(uniq.length === 0, uniq.slice(0, 5).join(" | "));
});

await browser.close();
for (const p of procs) p.kill();
const failed = results.filter((r) => !r.ok).length;
console.log(`\n${results.length - failed}/${results.length} OK · screenshoty: ${OUT}`);
process.exit(failed ? 1 : 0);
