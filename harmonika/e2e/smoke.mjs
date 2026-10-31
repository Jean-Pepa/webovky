// E2E smoke test harmoniky — proklikání všech hlavních funkcí.
//
// Spuštění (v jiném terminálu musí běžet server):
//   npm run build && npm run start      # http://localhost:3000
//   npm run e2e
//
// Proměnné prostředí:
//   BASE_URL    – adresa appky (výchozí http://localhost:3000)
//   CHROME_PATH – cesta k Chromium/Chrome (jinak se zkusí najít automaticky)
//   E2E_W/E2E_H – viewport (výchozí iPad Pro 12.9" na šířku 1366 × 1024)
//   E2E_SHOT    – kam uložit závěrečný screenshot
//   E2E_TONE    – WAV soubor jako falešný mikrofon (otestuje i ladičku)

import { chromium } from "playwright-core";
import { existsSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const BASE = process.env.BASE_URL || "http://localhost:3000";
const SHOT = process.env.E2E_SHOT || join(tmpdir(), "harmonika-e2e.png");
const W = Number(process.env.E2E_W || 1366);
const H = Number(process.env.E2E_H || 1024);
const TONE = process.env.E2E_TONE;

function findChrome() {
  if (process.env.CHROME_PATH && existsSync(process.env.CHROME_PATH)) return process.env.CHROME_PATH;
  const root = process.env.PLAYWRIGHT_BROWSERS_PATH || "/opt/pw-browsers";
  try {
    for (const dir of readdirSync(root)) {
      if (!dir.startsWith("chromium-") || dir.includes("headless")) continue;
      const exe = join(root, dir, "chrome-linux", "chrome");
      if (existsSync(exe)) return exe;
    }
  } catch {
    /* necháme Playwright vyřešit defaultně */
  }
  return undefined;
}

const results = [];
const errors = [];
function rec(ok, name, detail = "") {
  results.push({ ok, name, detail });
  console.log(`${ok ? "✅" : "❌"} ${name}${detail ? " — " + detail : ""}`);
}
async function step(name, fn) {
  try {
    await fn();
    rec(true, name);
  } catch (e) {
    rec(false, name, String(e.message || e).split("\n")[0].slice(0, 220));
  }
}
function expect(cond, msg) {
  if (!cond) throw new Error(msg);
}

const args = ["--no-sandbox", "--autoplay-policy=no-user-gesture-required"];
if (TONE) args.push("--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream", `--use-file-for-fake-audio-capture=${TONE}`);
const browser = await chromium.launch({ executablePath: findChrome(), args });
const ctx = await browser.newContext({
  viewport: { width: W, height: H },
  hasTouch: true,
  permissions: TONE ? ["microphone"] : [],
});
const page = await ctx.newPage();
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));

const text = (sel) => page.locator(sel).first().evaluate((e) => e.textContent.replace(/\s+/g, " ").trim());
// Výpis lišty Note/Degrees (jednotlivé položky jsou samostatné prvky).
const bar = (n) => page.$eval(`.info-box:nth-child(${n})`, (e) => [...e.children].map((c) => c.textContent).join(" "));
const cell = (pos) => page.$eval(`[data-pos="${pos}"]`, (e) => e.firstChild.textContent);
const clickText = (t) => page.getByText(t, { exact: true }).first().click();
const openMenu = async (item) => {
  await page.click(".menu-btn");
  await page.locator(".menu-item", { hasText: item }).click();
};

await page.goto(BASE, { waitUntil: "networkidle" });
await page.waitForSelector(".harp");

await step("Výchozí obrazovka: 12 dírek, C dur, horní dírka táhnutí+šoupátko = D", async () => {
  expect((await page.$$(".hole-col")).length === 12, "počet dírek");
  expect((await bar(1)) === "Note C D E F G A B C", await bar(1));
  expect((await bar(2)) === "Degrees P1 M2 M3 P4 P5 M6 M7", await bar(2));
  expect((await cell("12-drawSlide")) === "D", "12 draw slide");
  expect((await cell("4-drawSlide")) === "C", "4 draw slide");
  expect(await page.$eval('[data-pos="1-blow"]', (e) => e.classList.contains("root")), "kořen oranžově");
  expect(await page.$eval('[data-pos="1-blowSlide"]', (e) => e.classList.contains("out")), "C# šedě");
});

await step("Holes: jen 12dírková (čip bez výběru)", async () => {
  expect((await text(".chip.static .chip-value")) === "12", "Holes 12");
  await page.click(".chip.static");
  expect((await page.$$(".popover")).length === 0, "žádný výběr dírek");
});

await step("Harmonica → G a zpět na C", async () => {
  await page.click(".chip.cyan");
  await page.locator(".pick-btn.cyan", { hasText: /^G$/ }).click();
  expect((await text(".chip.cyan .chip-value")) === "G", "čip G");
  expect((await cell("1-blow")) === "G", "dírka 1 = G");
  await page.click(".chip.cyan");
  await page.locator(".pick-btn.cyan", { hasText: /^C$/ }).click();
});

await step("Key → F: správný pravopis (Bb)", async () => {
  await page.click(".chip.orange");
  await page.locator(".pick-btn.orange", { hasText: /^F$/ }).click();
  expect((await bar(1)) === "Note F G A Bb C D E F", await bar(1));
  expect((await cell("3-drawSlide")) === "Bb", "A# jako Bb");
});

await step("Scale → Dorian", async () => {
  await page.click(".chip.lime >> nth=1");
  await page.locator(".pick-row", { hasText: "Dorian" }).first().click();
  expect((await text(".chip.lime >> nth=1")).includes("F Dorian"), await text(".chip.lime >> nth=1"));
});

await step("Arpeggios → FMaj7 (P1 M3 P5 M7)", async () => {
  await clickText("Arpeggios");
  expect((await bar(2)) === "Degrees P1 M3 P5 M7", await bar(2));
  expect((await text(".chip.lime >> nth=1")).includes("FMaj7"), "čip arpeggia");
  await clickText("Scale");
  await page.click(".chip.orange");
  await page.locator(".pick-btn.orange", { hasText: /^C$/ }).click();
  await page.click(".chip.lime >> nth=1");
  await page.locator(".pick-row", { hasText: /^Major/ }).first().click();
});

await step("Play: zvýrazňuje hrané dírky, Stop", async () => {
  await page.click('[aria-label="Play"]');
  await page.waitForSelector(".cell.playing", { timeout: 4000 });
  await page.waitForTimeout(800);
  await page.click('[aria-label="Stop"]');
  expect((await page.$$(".cell.playing")).length === 0, "po stopu nic nehraje");
});

await step("Metronom zapnout / vypnout", async () => {
  await page.click('[aria-label="Metronome"]');
  expect((await page.getAttribute('[aria-label="Metronome"]', "aria-pressed")) === "true", "zapnuto");
  await page.waitForTimeout(700);
  await page.click('[aria-label="Metronome"]');
  expect((await page.getAttribute('[aria-label="Metronome"]', "aria-pressed")) === "false", "vypnuto");
});

await step("Menu → Playback Options: Reverse, BPM, rozsah, Apply", async () => {
  await openMenu("Playback Options");
  await clickText("Reverse");
  await page.click('[aria-label="Tempo plus"]');
  expect((await text(".dial-num")) === "091", await text(".dial-num"));
  await page.click('[aria-label="End hole minus"]');
  await page.click('[aria-label="End hole minus"]');
  await clickText("Apply");
  expect((await page.$$(".hole-col.dim")).length === 2, "dírky 11–12 ztlumené");
  await openMenu("Playback Options");
  await clickText("Both");
  await page.click('[aria-label="Tempo minus"]');
  await page.click('[aria-label="End hole plus"]');
  await page.click('[aria-label="End hole plus"]');
  await clickText("Apply");
});

await step("Menu → My Routines: uložit a načíst", async () => {
  await openMenu("My Routines");
  await page.locator(".small-btn.green", { hasText: "Save" }).click();
  expect((await page.$$(".list-card >> nth=1 >> .list-row")).length >= 1, "rutina v seznamu");
  await page.locator(".small-btn", { hasText: "Load" }).first().click();
  await page.waitForSelector(".toast");
});

await step("Menu → Harmonica & Sound: popisky Degrees", async () => {
  await openMenu("Harmonica & Sound");
  await page.locator(".seg-mini button", { hasText: "Degrees" }).click();
  await page.click(".sheet-close");
  const c1 = await cell("1-blow");
  expect(c1 === "P1", `dírka 1 = ${c1} (${await text(".chip.lime >> nth=1")})`);
  await openMenu("Harmonica & Sound");
  await page.locator(".seg-mini button", { hasText: "Notes" }).click();
  await page.click(".sheet-close");
});

await step("Ťuknutí na dírku (přehraje tón)", async () => {
  await page.click('[data-pos="5-blow"]');
});

await step("Ladička: panel s pravítkem a údaji", async () => {
  await page.click('[aria-label="Tuner"]');
  await page.waitForSelector(".tuner .ruler");
  if (TONE) {
    await page.waitForTimeout(2000);
    const pills = await page.$$eval(".pill", (els) => els.map((e) => e.textContent.replace(/\s+/g, " ")));
    console.log("   ladička:", pills.join(" | "));
    expect((await page.$$(".pitch-line")).length > 0, "čárka v dírce");
  }
  await page.click('[aria-label="Tuner"]');
});

await step("Songs: výběr písničky, tabulatura, přehrávání v rytmu", async () => {
  await page.getByRole("tab", { name: "Songs" }).click();
  await page.waitForSelector(".song-bar");
  await page.click(".song-chip");
  await page.locator(".song-row", { hasText: "Greensleeves" }).click();
  expect((await text(".song-chip .chip-value")) === "Greensleeves", await text(".song-chip .chip-value"));
  expect((await text(".chip.orange .chip-value")) === "Am", "tónina Am");
  const first = await page.$eval(".tab", (e) => e.textContent);
  expect(first === "-3A", `první tab ${first}`);
  expect((await page.$$(".tab")).length === 70, "70 not");
  await page.click('[aria-label="Play"]');
  await page.waitForSelector(".tab.now", { timeout: 6000 });
  await page.waitForSelector(".cell.playing", { timeout: 2000 });
  await page.click('[aria-label="Stop"]');
  expect((await page.$$(".tab.now")).length === 0, "po stopu nic");
});

await step("Songs: transpozice (Am → Gm) a začátek od vybrané noty", async () => {
  await page.click(".chip.orange");
  await page.locator(".pick-btn.orange", { hasText: /^G$/ }).click();
  expect((await text(".chip.orange .chip-value")) === "Gm", await text(".chip.orange .chip-value"));
  const first = await page.$eval(".tab .n", (e) => e.textContent);
  expect(first === "G", `první nota ${first}`);
  await page.locator(".tab").nth(8).click();
  expect(await page.locator(".tab").nth(8).evaluate((e) => e.classList.contains("cursor")), "kurzor na 9. notě");
  await page.click('[aria-label="Back to start"]');
  await page.click(".chip.orange");
  await page.locator(".pick-btn.orange", { hasText: /^A$/ }).click();
});

await step("Songs: Melody / Play-along přepínač", async () => {
  await page.locator(".song-btn", { hasText: "Melody" }).click();
  await page.locator(".song-btn", { hasText: "Play-along" }).waitFor();
  await page.locator(".song-btn", { hasText: "Play-along" }).click();
  await page.locator(".song-btn", { hasText: "Melody" }).waitFor();
});

await step("Songs: Practice (mikrofon čeká na správný tón)", async () => {
  await page.click(".song-chip");
  await page.locator(".song-row", { hasText: "Twinkle" }).click();
  await page.locator(".song-btn", { hasText: "Practice" }).click();
  await page.waitForSelector(".tab.now");
  if (TONE) {
    await page.waitForSelector(".tab.ok", { timeout: 5000 });
    console.log("   procvičování:", await text(".song-stat"));
  }
  await page.locator(".song-btn", { hasText: "Practice" }).click();
  expect((await page.$$(".tab.now")).length === 0, "procvičování vypnuto");
  await page.getByRole("tab", { name: "Scale" }).click();
});

await step("Learning: 0 of 8, lekce 1 až do konce, odemknutí", async () => {
  await page.click(".learn-btn");
  expect((await text(".learn-title")) === "All Lessons | 0 of 8 completed", await text(".learn-title"));
  expect((await page.$$(".lesson-card.locked")).length === 5, "zamčené lekce 4–8");
  await page.click(".start-btn >> nth=0");
  for (let i = 0; i < 4; i++) {
    if (i === 0) await page.locator(".kb-white").first().dispatchEvent("pointerdown");
    await page.locator(".lv-btn.primary", { hasText: "Next" }).click();
  }
  const answers = ["D#", "E–F", "Bb", "Raises every note a semitone"];
  for (const [qi, a] of answers.entries()) {
    await page.locator(".quiz-q").nth(qi).locator(".quiz-opt", { hasText: a }).first().click();
  }
  await page.locator(".lv-btn.success").click();
  await page.waitForSelector(".lv-done");
  await page.locator(".lv-btn", { hasText: "All Lessons" }).click();
  expect((await text(".learn-title")) === "All Lessons | 1 of 8 completed", await text(".learn-title"));
  expect((await text(".lesson-card >> nth=0")).includes("Interactions:"), "statistiky lekce");
});

await step("Lekce 2–8 jdou otevřít a projít kroky", async () => {
  // Projdi lekce 2 a 3 (odemknuté) — a kvízy splň, aby se odemkla 4.
  for (let li = 1; li < 8; li++) {
    const card = page.locator(".lesson-card").nth(li);
    if (await card.evaluate((e) => e.classList.contains("locked"))) throw new Error(`lekce ${li + 1} zamčená`);
    await card.locator(".start-btn").click();
    const steps = await page.$$eval(".lv-progress span", (e) => e.length);
    for (let s = 0; s < steps - 1; s++) {
      const w = page.locator(".lv-widget .w-btn, .lv-widget .cell, .lv-widget .kb-white").first();
      if (await w.count()) await w.dispatchEvent(await w.evaluate((e) => (e.classList.contains("cell") || e.classList.contains("kb-white") ? "pointerdown" : "click")));
      await page.locator(".lv-btn.primary", { hasText: "Next" }).click();
    }
    const qs = page.locator(".quiz-q");
    const n = await qs.count();
    for (let qi = 0; qi < n; qi++) {
      const opts = qs.nth(qi).locator(".quiz-opt");
      const cnt = await opts.count();
      for (let oi = 0; oi < cnt; oi++) {
        await opts.nth(oi).click();
        if (await opts.nth(oi).evaluate((e) => e.classList.contains("right"))) break;
      }
    }
    await page.locator(".lv-btn.success").click();
    await page.waitForSelector(".lv-done");
    await page.locator(".lv-btn", { hasText: "All Lessons" }).click();
  }
  expect((await text(".learn-title")) === "All Lessons | 8 of 8 completed", await text(".learn-title"));
  await page.click('[aria-label="Close lessons"]');
});

await step("Bez chyb v konzoli", async () => {
  const real = errors.filter((e) => !/Permission|NotAllowed|NotFound|getUserMedia|AudioContext/i.test(e));
  expect(real.length === 0, real.join(" | "));
});

await page.screenshot({ path: SHOT });
console.log(`\nScreenshot: ${SHOT}`);
await browser.close();

const failed = results.filter((r) => !r.ok).length;
console.log(`\n${results.length - failed}/${results.length} kroků prošlo.`);
process.exit(failed ? 1 : 0);
