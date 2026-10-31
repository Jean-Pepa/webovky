// E2E test Mečovačky: PC obrazovka + telefon v jednom prohlížeči, lokální signalizační server.
// Natočení telefonu se simuluje událostmi `deviceorientation`.
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
const W = Number(process.env.E2E_W || 1280);
const H = Number(process.env.E2E_H || 720);
mkdirSync(OUT, { recursive: true });

const procs = [];
let BASE = process.env.BASE_URL;
const PEER = process.env.PEER || "localhost:9000";
async function waitFor(url, ms = 20000) {
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
function check(name, ok, info = "") {
  results.push({ name, ok });
  console.log(`${ok ? "✓" : "✗"} ${name}${info ? " — " + info : ""}`);
}

const browser = await chromium.launch({
  executablePath: findChrome(),
  args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--autoplay-policy=no-user-gesture-required"],
});
const errors = [];
const watch = (p, tag) => {
  p.on("pageerror", (e) => errors.push(`${tag}: ${e.message}`));
  p.on("console", (m) => {
    if (m.type() === "error" && !/favicon|ERR_CONNECTION|peerjs|WebSocket/i.test(m.text())) errors.push(`${tag}: ${m.text()}`);
  });
};

try {
  // ---------------------------------------------------------------- PC
  const pc = await browser.newPage({ viewport: { width: W, height: H } });
  watch(pc, "pc");
  await pc.goto(`${BASE}/?peer=${PEER}`);
  const state = () => pc.evaluate(() => window.__mc.state());
  let st = null;
  for (let i = 0; i < 80 && !(st && st.ready); i++) {
    await pc.waitForTimeout(250);
    st = await pc.evaluate(() => window.__mc && window.__mc.state());
  }
  check("PC: místnost s kódem", !!st?.ready && /^[A-Z]{4}$/.test(st.code), st?.code);
  await pc.screenshot({ path: join(OUT, "01-pc-lobby.png") });

  // ---------------------------------------------------------------- telefon
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const pad = await ctx.newPage();
  watch(pad, "pad");
  await pad.goto(st.padUrl);
  await pad.waitForSelector(".chars", { timeout: 20000 });
  // simulované natočení: telefon naplocho, horní hrana míří na obrazovku
  await pad.evaluate(() => {
    window.__ori = { a: 0, b: 0, g: 0 };
    setInterval(() => window.dispatchEvent(new DeviceOrientationEvent("deviceorientation", { alpha: window.__ori.a, beta: window.__ori.b, gamma: window.__ori.g })), 16);
  });
  const ori = (a, b = 0, g = 0) => pad.evaluate(([a, b, g]) => Object.assign(window.__ori, { a, b, g }), [a, b, g]);
  await pad.click('.ch[data-char="5"]');
  await pad.fill(".name-in", "Tester");
  await pad.waitForTimeout(1200);
  st = await state();
  check("Telefon v lobby (jméno, postava, senzor)", st.players.length === 1 && st.players[0].name === "Tester" && st.players[0].char === 5 && st.players[0].sensor === "ori", JSON.stringify(st.players[0]));
  check("Telefon ukazuje, že meč sleduje telefon", await pad.isVisible(".sensor.ok"));
  await pad.screenshot({ path: join(OUT, "02-pad-lobby.png"), fullPage: true });
  await pc.screenshot({ path: join(OUT, "03-pc-lobby-player.png") });

  const holdGuard = async (until) => {
    const g = await pad.$(".guard");
    const box = await g.boundingBox();
    await pad.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await pad.mouse.down();
    let ok = false;
    for (let i = 0; i < 60 && !ok; i++) {
      await pad.waitForTimeout(200);
      ok = await until();
    }
    await pad.mouse.up();
    return ok;
  };
  const sweep = async (n, pitch = 10, pause = 200) => {
    for (let k = 0; k < n; k++) {
      for (const a of [60, 30, 0, -30, -60]) {
        await ori(a, pitch);
        await pad.waitForTimeout(20);
      }
      for (const a of [-30, 0, 30, 60]) {
        await ori(a, pitch);
        await pad.waitForTimeout(20);
      }
      await ori(60, pitch);
      await pad.waitForTimeout(pause);
    }
    await ori(0, 0);
  };

  // ---------------------------------------------------------------- souboj
  await pad.click('[data-a="start"]');
  for (let i = 0; i < 40 && !(st && st.act); i++) {
    await pc.waitForTimeout(250);
    st = await state();
  }
  check("Souboj začal (hráč proti počítači)", st.act?.kind === "duel" && st.act.fighters.length === 2);
  await pc.evaluate(() => window.__mc.skip());
  await pad.waitForSelector(".guard", { timeout: 10000 });
  await pad.screenshot({ path: join(OUT, "04-pad-ready.png") });
  const ready = await holdGuard(async () => (await state()).act.duel.ready[0]);
  st = await state();
  check("Kalibrace: namířit na obrazovku a podržet KRYT", ready && st.act.fighters[0].calibrated);
  check("Po kalibraci meč míří dopředu", st.act.fighters[0].dir[2] < -0.5, JSON.stringify(st.act.fighters[0].dir));
  for (let i = 0; i < 40; i++) {
    await pc.waitForTimeout(200);
    if ((await state()).act.duel.phase === "fight") break;
  }
  check("Fáze boje", (await state()).act.duel.phase === "fight");
  // alfa roste proti směru hodinových ručiček (při pohledu shora) = telefon se točí doleva
  await ori(70, 0);
  await pc.waitForTimeout(700);
  st = await state();
  check("Telefon natočený doleva = meč doleva (1:1)", st.act.fighters[0].dir[0] < -0.5, JSON.stringify(st.act.fighters[0].dir));
  await ori(-70, 0);
  await pc.waitForTimeout(700);
  st = await state();
  check("Telefon natočený doprava = meč doprava", st.act.fighters[0].dir[0] > 0.5, JSON.stringify(st.act.fighters[0].dir));
  await ori(0, 60);
  await pc.waitForTimeout(700);
  st = await state();
  check("Telefon špičkou nahoru = meč nahoru", st.act.fighters[0].dir[1] > 0.5, JSON.stringify(st.act.fighters[0].dir));
  await ori(0, 0);
  await sweep(6);
  await pc.screenshot({ path: join(OUT, "05-pc-duel.png") });
  st = await state();
  const [me, cpu] = st.act.fighters;
  const events = me.hits + cpu.hits + me.blocks + cpu.blocks;
  check("Švihy telefonem: zásahy / kryty", events > 0, `hráč zásahy ${me.hits}, kryty ${me.blocks}; počítač zásahy ${cpu.hits}, kryty ${cpu.blocks}`);
  // odhoz do vody
  await pc.evaluate(() => window.__mc.knock(1, 12));
  let scored = false;
  for (let i = 0; i < 50 && !scored; i++) {
    await pc.waitForTimeout(200);
    st = await state();
    scored = st.act.duel.score[0] === 1;
  }
  check("Pád z mola = bod (kolo)", scored, JSON.stringify(st.act.duel));
  await pc.waitForTimeout(900);
  await pc.screenshot({ path: join(OUT, "06-pc-splash.png") });
  // pauza z telefonu hostitele
  for (let i = 0; i < 40; i++) {
    await pc.waitForTimeout(200);
    if ((await state()).act.duel.phase === "ready") break;
  }
  await pad.click(".pause-btn");
  await pc.waitForTimeout(800);
  check("Pauza z telefonu", (await state()).paused);
  await pad.screenshot({ path: join(OUT, "07-pad-pause.png") });
  await pad.click('.paused [data-a="pause"]');
  await pc.waitForTimeout(800);
  check("Pokračování z telefonu", !(await state()).paused);
  // druhé kolo: kalibrace a výhra → výsledky
  await holdGuard(async () => (await state()).act.duel.ready[0]);
  for (let i = 0; i < 40; i++) {
    await pc.waitForTimeout(200);
    if ((await state()).act.duel.phase === "fight") break;
  }
  await pc.evaluate(() => window.__mc.knock(1, 12));
  for (let i = 0; i < 80; i++) {
    await pc.waitForTimeout(250);
    st = await state();
    if (st.top === "results") break;
  }
  check("Konec zápasu → výsledky", st.top === "results", st.top);
  await pad.waitForSelector(".results-scr", { timeout: 8000 }).catch(() => {});
  check("Telefon ukazuje výsledky", await pad.isVisible(".results-scr"));
  await pc.screenshot({ path: join(OUT, "08-pc-results.png") });
  await pad.screenshot({ path: join(OUT, "09-pad-results.png") });

  // ---------------------------------------------------------------- krájení
  await pad.click('[data-a="menu"]');
  await pad.waitForSelector(".chars", { timeout: 10000 });
  await pad.click('[data-mode="1"]');
  await pad.waitForTimeout(600);
  check("Volba hry z telefonu (Krájení)", (await state()).mode === "slice");
  await pad.click('[data-a="start"]');
  await pad.waitForSelector(".guard", { timeout: 10000 });
  const sReady = await holdGuard(async () => {
    const s = (await state()).act;
    return s && s.slice && s.slice.ready[0];
  });
  check("Krájení: kalibrace", sReady);
  let things = 0;
  for (let i = 0; i < 40 && !things; i++) {
    await pc.waitForTimeout(250);
    things = (await state()).act.slice.things;
  }
  check("Krájení: z vody vyskakují věci", things > 0);
  for (let k = 0; k < 4; k++) {
    await sweep(2, 15);
    for (const b of [60, 20, -20, 60]) {
      await ori(0, b);
      await pad.waitForTimeout(25);
    }
  }
  await pc.screenshot({ path: join(OUT, "10-pc-slice.png") });
  st = await state();
  const L = st.act.slice.lanes[0];
  check("Krájení: švihy se počítají (rozseknuto / špatný směr / minuto)", L.cuts + L.wrong + L.missed > 0, JSON.stringify(L));

  // ---------------------------------------------------------------- trénink
  await pc.evaluate(() => window.__mc.lobby());
  await pad.waitForSelector(".chars", { timeout: 10000 });
  await pad.click('[data-mode="2"]');
  await pad.waitForTimeout(500);
  await pad.click('[data-a="start"]');
  await pad.waitForSelector(".guard", { timeout: 10000 });
  const tReady = await holdGuard(async () => {
    const s = (await state()).act;
    return s && s.train && s.train.ready[0];
  });
  check("Trénink: kalibrace", tReady);
  for (let i = 0; i < 40; i++) {
    await pc.waitForTimeout(200);
    if ((await state()).act.train.phase === "fight") break;
  }
  // mezi švihy pauza, ať meč zpomalí (každý švih se počítá zvlášť)
  for (let k = 0; k < 8 && (await state()).act.train.step === "swing"; k++) await sweep(1, 10, 1500);
  st = await state();
  check("Trénink: první krok (švihy) splněn", st.act.train.step !== "swing", JSON.stringify(st.act.train));
  await pc.screenshot({ path: join(OUT, "11-pc-train.png") });
  await pad.screenshot({ path: join(OUT, "12-pad-game.png") });
  await pc.evaluate(() => window.__mc.lobby());
  await pc.waitForTimeout(500);
  check("Zpět v lobby", (await state()).top === "lobby");
} catch (e) {
  check("Test doběhl bez výjimky", false, e.message);
} finally {
  check("Žádné chyby v konzoli", errors.length === 0, errors.slice(0, 5).join(" | "));
  await browser.close();
  for (const p of procs) p.kill();
}

const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} v pořádku. Screenshoty: ${OUT}`);
process.exit(failed.length ? 1 : 0);
