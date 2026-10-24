// E2E test oblasti „prvky-model" knihy domu BULO — prvky domu, stránka prvku, model (půdorys),
// umísťování, měřítko, podklady, formuláře s vazbou na prvek, režim jen ke čtení a telefon.
//
// Spuštění (dev server musí běžet, např. na http://127.0.0.1:3100):
//   node e2e/prvky-model.e2e.mjs
//
// Konfigurace přes proměnné prostředí:
//   BASE_URL – adresa appky (výchozí http://127.0.0.1:3100)
//   E2E_SHOT – složka pro screenshoty při chybě (výchozí systémové temp)
//
// Každá část běží v čistém kontextu prohlížeče (= jiné zařízení, čerstvá ukázková data
// z localStorage). Test selže na chybě v konzoli (React / nezachycená výjimka), na 5xx
// odpovědi appky a na vodorovném přetečení stránky na telefonu.

import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { join } from "node:path";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const BASE = (process.env.BASE_URL || "http://127.0.0.1:3100").replace(/\/$/, "");
const SHOT_DIR = process.env.E2E_SHOT || tmpdir();
const STORE_KEY = "domovni-pas-v1";
const P = "/nemovitost/demo-dum";

const results = [];
const problems = []; // chyby v konzoli, výjimky, 5xx (každá = selhání)
let current = "init";

function rec(ok, name, detail = "") {
  results.push({ ok, name, detail });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? " — " + detail : ""}`);
}

// Jeden pojmenovaný krok; výjimka = FAIL (a screenshot), běh pokračuje dál.
async function step(name, page, fn) {
  current = name;
  try {
    await fn();
    rec(true, name);
    return true;
  } catch (e) {
    rec(false, name, String(e?.message || e).split("\n")[0].slice(0, 300));
    if (page) {
      const file = join(SHOT_DIR, `prvky-model-${results.length}.png`);
      await page.screenshot({ path: file, fullPage: false }).catch(() => {});
      console.log(`      screenshot: ${file}`);
    }
    return false;
  }
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

// Čeká, až podmínka platí (polling) — pro stav v localStorage, URL apod.
async function until(fn, msg, timeout = 6000) {
  const t0 = Date.now();
  let last;
  while (Date.now() - t0 < timeout) {
    try {
      last = await fn();
      if (last) return last;
    } catch (e) {
      last = e;
    }
    await new Promise((r) => setTimeout(r, 120));
  }
  throw new Error(`${msg} (timeout ${timeout} ms${last instanceof Error ? ": " + last.message : ""})`);
}

// Očekávané hlášky v konzoli, které nejsou chybou appky
const BENIGN = [
  /Download the React DevTools/i,
  /\[HMR\]/i,
  /\[Fast Refresh\]/i,
];

const browser = await chromium.launch();

// Nový kontext = nové zařízení. kind: "desktop" | "phone"
async function openSession(kind, label) {
  const opts =
    kind === "phone"
      ? { viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }
      : { viewport: { width: 1280, height: 800 } };
  const ctx = await browser.newContext({ ...opts, locale: "cs-CZ", timezoneId: "Europe/Prague" });
  const page = await ctx.newPage();
  page.setDefaultTimeout(8000);
  const dialogs = []; // fronta odpovědí na confirm(): true = OK, false = Zrušit
  page.on("dialog", async (d) => {
    const answer = dialogs.shift();
    if (answer === undefined) {
      problems.push(`[${label}/${current}] nečekaný dialog: ${d.message().slice(0, 120)}`);
      await d.dismiss().catch(() => {});
    } else if (answer) await d.accept().catch(() => {});
    else await d.dismiss().catch(() => {});
  });
  page.on("console", (m) => {
    if (m.type() !== "error") return;
    const text = m.text();
    if (BENIGN.some((re) => re.test(text))) return;
    problems.push(`[${label}/${current}] console.error: ${text.slice(0, 300)}`);
  });
  page.on("pageerror", (e) => problems.push(`[${label}/${current}] pageerror: ${String(e).slice(0, 300)}`));
  page.on("response", (r) => {
    if (r.status() >= 500 && r.url().startsWith(BASE)) {
      problems.push(`[${label}/${current}] HTTP ${r.status()} ${r.url().replace(BASE, "")}`);
    }
  });
  return { ctx, page, dialogs, kind };
}

async function login(page, password) {
  await page.goto(`${BASE}/prihlaseni`, { waitUntil: "domcontentloaded" });
  const pw = page.locator('input[name="password"]');
  await pw.waitFor();
  await pw.fill(password);
  await pw.press("Enter");
  await page.waitForURL(/\/prehled/, { timeout: 15000 });
}

// Navigace na stránku appky a čekání na hydrataci (nadpis h1)
async function go(page, path, h1) {
  await page.goto(`${BASE}${path}`, { waitUntil: "domcontentloaded" });
  if (h1) await page.locator("main h1").filter({ hasText: h1 }).first().waitFor({ timeout: 20000 });
  else await page.locator("main h1").first().waitFor({ timeout: 20000 });
}

// Telefon: žádné vodorovné přetečení stránky
async function noOverflow(page, where) {
  const r = await page.evaluate(() => ({
    sw: document.documentElement.scrollWidth,
    iw: window.innerWidth,
    wide: [...document.querySelectorAll("main *")]
      .filter((el) => el.getBoundingClientRect().right > window.innerWidth + 1)
      .slice(0, 3)
      .map((el) => `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 60)}`),
  }));
  assert(r.sw <= r.iw + 1, `${where}: vodorovné přetečení ${r.sw} > ${r.iw} (${r.wide.join(" | ")})`);
}

async function readStore(page) {
  return page.evaluate((k) => JSON.parse(localStorage.getItem(k) || "[]"), STORE_KEY);
}
async function demoDum(page) {
  return (await readStore(page)).find((p) => p.id === "demo-dum");
}

// Bod podkladu (px obrázku) → souřadnice okna přes CTM prohlížeče půdorysu
async function planToClient(page, x, y) {
  return page.evaluate(
    ([x, y]) => {
      const svg = document.querySelector('svg[role="application"]');
      if (!svg) throw new Error("půdorys (svg[role=application]) nenalezen");
      const pt = svg.createSVGPoint();
      pt.x = x;
      pt.y = y;
      const r = pt.matrixTransform(svg.getScreenCTM());
      return [r.x, r.y];
    },
    [x, y],
  );
}
// Počká, až se stránka i pohled půdorysu ustálí (plynulé posouvání, první pohled)
async function settle(page) {
  let last = null;
  for (let i = 0; i < 50; i++) {
    const now = await page.evaluate(() => {
      const s = document.querySelector('svg[role="application"]');
      const r = s ? s.getBoundingClientRect() : { top: 0 };
      return `${Math.round(r.top)}|${s?.getAttribute("viewBox")}|${Math.round(window.scrollY)}`;
    });
    if (now === last) return;
    last = now;
    await page.waitForTimeout(90);
  }
}
async function clickPlan(page, x, y) {
  await settle(page);
  const [cx, cy] = await planToClient(page, x, y);
  await page.mouse.click(cx, cy);
}
// Počet prvků vykreslených v půdorysu (vrstva prvků = první <g> v SVG)
async function shapeCount(page) {
  return page.evaluate(() => {
    const g = document.querySelector('svg[role="application"] > g');
    return g ? g.children.length : -1;
  });
}
async function viewBox(page) {
  const vb = await page.locator('svg[role="application"]').getAttribute("viewBox");
  return vb.split(/\s+/).map(Number);
}
async function waitPlanReady(page) {
  await page.locator('svg[role="application"] image').first().waitFor({ state: "attached", timeout: 15000 });
  await page.waitForTimeout(250); // ResizeObserver → první pohled
}

// PNG vygenerovaný v prohlížeči (canvas) — nový podklad „1. NP"
async function makePng(page, label) {
  const b64 = await page.evaluate((label) => {
    const c = document.createElement("canvas");
    c.width = 1200;
    c.height = 800;
    const x = c.getContext("2d");
    x.fillStyle = "#ffffff";
    x.fillRect(0, 0, 1200, 800);
    x.strokeStyle = "#2a211e";
    x.lineWidth = 12;
    x.strokeRect(60, 60, 1080, 680);
    x.beginPath();
    x.moveTo(600, 60);
    x.lineTo(600, 740);
    x.stroke();
    x.fillStyle = "#57534e";
    x.font = "48px sans-serif";
    x.fillText(label, 480, 420);
    return c.toDataURL("image/png").split(",")[1];
  }, label);
  return Buffer.from(b64, "base64");
}

const NEW_EL = "E2E Zásuvka garáž";
const NEW_EL2 = "E2E Zásuvka garáž upravená";
let newElId = null; // prvek vytvořený ve formuláři (bez polohy)
let invElId = null; // prvek vytvořený z položky vybavení

// Části testu (každá v čistém kontextu). E2E_ONLY=desktop|readonly|phone spustí jen jednu.
const ONLY = process.env.E2E_ONLY || "";
async function suite(name, fn) {
  if (ONLY && ONLY !== name) return;
  try {
    await fn();
  } catch (e) {
    rec(false, `FATÁLNÍ (${name}): ${current}`, String(e?.stack || e).slice(0, 400));
  }
}

try {
  // =====================================================================
  // DESKTOP — majitel (klient), demo-dum
  // =====================================================================
  await suite("desktop", async () => {
    const D = await openSession("desktop", "desktop");
    const page = D.page;

    await step("Přihlášení jako klient", page, async () => {
      await login(page, "klient");
    });

    // ---------- 1. Karta „Prvky domu" na stránce nemovitosti ----------
    await step("Nemovitost: karta Prvky domu s počty vrstev a přesností", page, async () => {
      await go(page, P, "Rodinný dům Říčany");
      const card = page.locator("section").filter({ has: page.locator("h2", { hasText: /^Prvky domu$/ }) }).first();
      await card.waitFor();
      const text = await card.innerText();
      for (const [layer, n] of [["Elektro", 3], ["Voda a odpady", 1], ["Topení", 3], ["Plyn", 1], ["Konstrukce", 2]]) {
        assert(new RegExp(`${layer}\\s*${n}`).test(text), `počet vrstvy ${layer} ≠ ${n}: ${text.slice(0, 200)}`);
      }
      assert(/Zakresleno v modelu: 7 z 10/.test(text), "chybí „Zakresleno v modelu: 7 z 10“");
      const acc = await card.locator('svg[aria-label^="Přesnost polohy"]').count();
      assert(acc >= 6, `ukazatelů přesnosti jen ${acc}`);
      assert((await card.locator(`a[href="${P}/model"]`).count()) >= 1, "chybí odkaz na model");
      assert((await card.locator(`a[href="${P}/prvky"]`).count()) >= 1, "chybí odkaz na /prvky");
      // náhled: 6 prvků, nejdřív ten, který potřebuje pozornost (střešní okno — Sledovat)
      const rows = card.locator(`a[href^="${P}/prvek/"]`);
      assert((await rows.count()) === 6, `náhled má ${await rows.count()} prvků`);
      assert((await rows.first().getAttribute("href")) === `${P}/prvek/demo-el-stresni-okno`, "první není prvek se stavem Sledovat");
      assert(/Všechny prvky \(další 4\)/.test(text), "chybí „Všechny prvky (další 4)“");
    });

    await step("Nemovitost: odkaz „Všechny prvky“ → /prvky", page, async () => {
      await page.locator(`a[href="${P}/prvky"]`).first().click();
      await page.waitForURL(/\/prvky$/);
      await page.locator("main h1", { hasText: "Prvky domu" }).waitFor();
    });

    await step("Nemovitost: odkaz „Model domu“ → /model", page, async () => {
      await go(page, P, "Rodinný dům Říčany");
      const card = page.locator("section").filter({ has: page.locator("h2", { hasText: /^Prvky domu$/ }) }).first();
      await card.locator(`a[href="${P}/model"]`).first().click();
      await page.waitForURL(/\/model$/);
      await page.locator("main h1", { hasText: "Model domu" }).waitFor();
    });

    // ---------- 2. /prvky — seznam, filtr, hledání, nový prvek, úprava ----------
    await step("Prvky: seskupení podle vrstev", page, async () => {
      await go(page, `${P}/prvky`, "Prvky domu");
      const heads = await page.locator("main section > h2").allInnerTexts();
      const order = ["Elektro", "Voda a odpady", "Topení", "Plyn", "Konstrukce"];
      const got = heads.map((h) => h.split("·")[0].trim());
      assert(JSON.stringify(got) === JSON.stringify(order), `skupiny: ${got.join(", ")}`);
      assert((await page.locator(`a[href="${P}/prvek/demo-el-kotel"]`).count()) === 1, "kotel v seznamu chybí");
      // u každého řádku přesnost (zdroj + ±mm)
      const kotelRow = page.locator("li").filter({ has: page.locator(`a[href="${P}/prvek/demo-el-kotel"]`) });
      const t = await kotelRow.innerText();
      assert(/±10 cm · odhad \(zadal uživatel\)/.test(t), `přesnost kotle: ${t}`);
    });

    await step("Prvky: filtr vrstvy Topení a zpět Vše", page, async () => {
      const chips = page.getByRole("group", { name: "Filtr vrstev" });
      await chips.getByRole("button", { name: /Topení/ }).click();
      await until(async () => (await page.locator("main section > h2").count()) === 1, "filtr nezúžil skupiny");
      const h = await page.locator("main section > h2").innerText();
      assert(h.startsWith("Topení"), `po filtru skupina ${h}`);
      assert((await page.locator(`a[href="${P}/prvek/demo-el-rozvadec"]`).count()) === 0, "rozvaděč pořád vidět");
      assert(
        (await chips.getByRole("button", { name: /Topení/ }).getAttribute("aria-pressed")) === "true",
        "chip Topení není aktivní",
      );
      await chips.getByRole("button", { name: /^Vše/ }).click();
      await until(async () => (await page.locator("main section > h2").count()) === 5, "Vše neukázalo všechny skupiny");
    });

    await step("Prvky: hledání bez diakritiky („plynovy kotel“, „rozvadec“)", page, async () => {
      const q = page.getByRole("searchbox", { name: "Hledat prvek" });
      await q.fill("plynovy kotel");
      await until(
        async () => (await page.locator(`main a[href^="${P}/prvek/"]`).count()) === 1,
        "hledání „plynovy kotel“ nenašlo právě 1 prvek",
      );
      assert((await page.locator(`a[href="${P}/prvek/demo-el-kotel"]`).count()) === 1, "nenašel kotel");
      await q.fill("ROZVADEC");
      await until(async () => (await page.locator(`a[href="${P}/prvek/demo-el-rozvadec"]`).count()) === 1, "nenašel rozvaděč");
      await q.fill("xyzneexistuje");
      await page.getByText("Nic nenalezeno").waitFor();
      await q.fill("");
      await until(async () => (await page.locator(`main a[href^="${P}/prvek/"]`).count()) === 10, "po smazání hledání ne 10 prvků");
    });

    await step("Prvky: nový prvek — zdroj předvyplní přesnost, odhad ze stáří domu", page, async () => {
      await page.getByRole("button", { name: "Přidat prvek" }).first().click();
      const form = page.locator("form").filter({ has: page.getByLabel("Název prvku *") });
      await form.waitFor();
      await form.getByLabel("Název prvku *").fill(NEW_EL);
      await form.getByLabel("Vrstva / kategorie *").selectOption("ELEKTRO");
      const acc = form.getByLabel("Přesnost (±mm)");
      assert((await acc.inputValue()) === "300", `výchozí přesnost ${await acc.inputValue()}`);
      await form.getByLabel("Zdroj údaje *").selectOption("SKEN");
      assert((await acc.inputValue()) === "10", `SKEN → přesnost ${await acc.inputValue()}`);
      await form.getByLabel("Zdroj údaje *").selectOption("KOTA_VYKRESU");
      assert((await acc.inputValue()) === "50", `KOTA_VYKRESU → přesnost ${await acc.inputValue()}`);
      // vlastní hodnota se změnou zdroje nepřepíše
      await acc.fill("40");
      await form.getByLabel("Zdroj údaje *").selectOption("MERITKO_VYKRESU");
      assert((await acc.inputValue()) === "40", `vlastní přesnost přepsána na ${await acc.inputValue()}`);
      await form.getByRole("button", { name: /Odhadnout ze stáří domu \(2009\)/ }).click();
      assert((await form.getByLabel("Datum instalace").inputValue()) === "2009-01-01", "datum instalace z roku výstavby");
      assert(await form.getByLabel("datum je odhad").isChecked(), "„datum je odhad“ nezaškrtnuto");
      await form.getByLabel("Místnost").fill("Garáž");
      await form.getByRole("button", { name: "Přidat prvek" }).click();
      await page.getByText(`Prvek „${NEW_EL}“ je v knize domu.`).waitFor();
      const place = page.getByRole("link", { name: "Umístit na půdorys" });
      const href = await place.getAttribute("href");
      const m = /\/model\?prvek=([^&]+)&umistit=1$/.exec(href || "");
      assert(m, `odkaz Umístit na půdorys: ${href}`);
      newElId = decodeURIComponent(m[1]);
      const dum = await demoDum(page);
      const el = dum.elements.find((e) => e.id === newElId);
      assert(el, "nový prvek není v úložišti");
      assert(el.source === "MERITKO_VYKRESU" && el.accuracyMm === 40, `zdroj/přesnost ${el.source}/${el.accuracyMm}`);
      assert(el.installDate === "2009-01-01" && el.installDateEstimated === true, "datum instalace neuloženo jako odhad");
      assert(!el.plan, "nový prvek nemá mít polohu");
      assert((await page.locator(`a[href="${P}/prvek/${newElId}"]`).count()) >= 1, "nový prvek v seznamu chybí");
    });

    await step("Prvky: úprava prvku se projeví v seznamu", page, async () => {
      assert(newElId, "chybí id nového prvku");
      await page.getByRole("button", { name: "Zavřít" }).first().click().catch(() => {});
      await page.getByRole("button", { name: `Upravit ${NEW_EL}` }).click();
      const form = page.locator("li form");
      await form.waitFor();
      const name = form.getByLabel("Název prvku *");
      assert((await name.inputValue()) === NEW_EL, "formulář úpravy nemá původní název");
      assert((await form.getByLabel("Přesnost (±mm)").inputValue()) === "40", "úprava: přesnost");
      await name.fill(NEW_EL2);
      await form.getByLabel("Stav").selectOption("ATTENTION");
      await form.getByRole("button", { name: "Uložit změny" }).click();
      await page.locator(`a[href="${P}/prvek/${newElId}"]`).filter({ hasText: NEW_EL2 }).waitFor();
      const row = page.locator("li").filter({ has: page.locator(`a[href="${P}/prvek/${newElId}"]`) });
      const t = await row.innerText();
      assert(/Sledovat/.test(t), `stav po úpravě: ${t}`);
      assert(/Nezakresleno/.test(t), "nový prvek má být „Nezakresleno“");
      const el = (await demoDum(page)).elements.find((e) => e.id === newElId);
      assert(el.name === NEW_EL2 && el.room === "Garáž", "úprava neuložena");
    });

    await step("Prvek: nový termín bez lhůty a s lhůtou — lhůta se nevymýšlí", page, async () => {
      assert(newElId, "chybí nový prvek");
      await go(page, `${P}/prvek/${encodeURIComponent(newElId)}`, NEW_EL2);
      const sec = page.locator("section").filter({ has: page.locator("h2", { hasText: /^Termíny a revize$/ }) });
      await sec.getByText(/Lhůtu nevymýšlíme/).waitFor();
      await sec.getByRole("button", { name: "Přidat" }).click();
      await sec.getByLabel("Název termínu").fill("E2E Revize zásuvek");
      await sec.getByLabel("Další termín *").fill("2027-03-15");
      await sec.getByRole("button", { name: "Uložit termín" }).click();
      const li1 = sec.locator("li").filter({ hasText: "E2E Revize zásuvek" });
      await li1.waitFor();
      assert(!/Opakuje se/.test(await li1.innerText()), "termín bez lhůty ukazuje opakování");
      let r = (await demoDum(page)).reminders.find((x) => x.title === "E2E Revize zásuvek");
      assert(r && r.elementId === newElId && r.intervalMonths === undefined, `termín: ${JSON.stringify(r)}`);
      // lhůta jen celé měsíce; zadaná člověkem = nepotvrzená technikem
      await sec.getByRole("button", { name: "Přidat" }).click();
      await sec.getByLabel("Název termínu").fill("E2E Servis zásuvek");
      await sec.getByLabel("Další termín *").fill("2027-06-01");
      await sec.getByLabel("Opakovat po měsících").fill("1,5");
      await sec.getByRole("button", { name: "Uložit termín" }).click();
      await sec.getByRole("alert").filter({ hasText: "Lhůta musí být celý počet měsíců" }).waitFor();
      await sec.getByLabel("Opakovat po měsících").fill("24");
      await sec.getByRole("button", { name: "Uložit termín" }).click();
      const li2 = sec.locator("li").filter({ hasText: "E2E Servis zásuvek" });
      await li2.waitFor();
      const t2 = await li2.innerText();
      assert(/Opakuje se/.test(t2) && /Lhůtu zatím nepotvrdil revizní technik/.test(t2), `termín s lhůtou: ${t2}`);
      r = (await demoDum(page)).reminders.find((x) => x.title === "E2E Servis zásuvek");
      assert(r.intervalMonths === 24 && r.intervalConfirmed === false, `uložená lhůta: ${JSON.stringify(r)}`);
    });

    // ---------- 3. Stránka prvku /prvek/demo-el-kotel ----------
    await step("Prvek kotel: Kde vede — náhled půdorysu, přesnost, bezpečnostní upozornění", page, async () => {
      await go(page, `${P}/prvek/demo-el-kotel`, "Plynový kotel");
      const where = page.locator("section").filter({ has: page.locator("h2", { hasText: /^Kde vede$/ }) });
      const mini = where.locator('svg[role="img"][aria-label^="Poloha prvku Plynový kotel"]');
      await mini.waitFor();
      const href = await mini.locator("image").getAttribute("href");
      assert(href && href.startsWith("data:image/svg+xml"), "náhled bez obrázku podkladu");
      const t = await where.innerText();
      assert(/Přesnost polohy/.test(t) && /±10 cm · odhad \(zadal uživatel\)/.test(t), `přesnost: ${t.slice(0, 200)}`);
      assert(/Poloha je podklad, ne záruka\. Před vrtáním nebo bouráním vždy ověřte vedení detektorem\./.test(t), "chybí bezpečnostní upozornění");
      assert(/Přízemí · verze 1/.test(t), "chybí popisek podkladu");
      const body = await page.locator("main").innerText();
      assert(!/bezpečn[éě] vrtat/i.test(body), "stránka tvrdí „bezpečné vrtat“");
    });

    await step("Prvek kotel: Co to je — navázané vybavení Plynový kotel", page, async () => {
      const what = page.locator("section").filter({ has: page.locator("h2", { hasText: /^Co to je$/ }) });
      const t = await what.innerText();
      assert(/Plynový kotel/.test(t) && /Model XYZ/.test(t), `vybavení: ${t.slice(0, 300)}`);
      assert(/Záruka do/.test(t), "u vybavení chybí záruka");
      assert(/2018.*\(odhad\)/.test(t), "instalace jako odhad");
    });

    await step("Prvek kotel: Termíny a revize — s-r1 se stavem a potvrzenou lhůtou", page, async () => {
      const dl = page.locator("section").filter({ has: page.locator("h2", { hasText: /^Termíny a revize$/ }) });
      const t = await dl.innerText();
      assert(/Revize plynového kotle/.test(t), "chybí termín s-r1");
      assert(/Po termínu/.test(t), `stav termínu: ${t.slice(0, 300)}`);
      assert(/Opakuje se/.test(t) && /Lhůtu potvrdil revizní technik/.test(t), "lhůta / potvrzení chybí");
    });

    await step("Prvek kotel: Historie — navázaný záznam „Revize plynového kotle“", page, async () => {
      const hist = page.locator("section").filter({ has: page.locator("h2", { hasText: /^Historie$/ }) });
      await hist.locator("h3", { hasText: "Revize plynového kotle" }).waitFor();
      assert((await hist.locator("h3", { hasText: "Rekonstrukce koupelny v patře" }).count()) === 0, "cizí záznam v historii");
    });

    await step("Prvek kotel: odkazy akcí mají správné adresy", page, async () => {
      const q = "prvek=demo-el-kotel";
      const want = [
        ["Zapsat sem", `${P}/zaznam/novy?${q}`],
        ["Nahrát protokol (AI)", `${P}/zaznam/z-dokladu?${q}`],
        ["Pozvat řemeslníka", `${P}/pozvanky?${q}`],
        ["Otevřít v modelu", `${P}/model?${q}`],
      ];
      for (const [name, href] of want) {
        const got = await page.getByRole("link", { name }).first().getAttribute("href");
        assert(got === href, `${name}: ${got} ≠ ${href}`);
      }
      const what = page.locator("section").filter({ has: page.locator("h2", { hasText: /^Co to je$/ }) });
      const add = await what.getByRole("link", { name: "Přidat" }).getAttribute("href");
      assert(add === `${P}/vybaveni/nove?${q}`, `Přidat vybavení: ${add}`);
      const back = await page.getByRole("link", { name: "Všechny prvky" }).getAttribute("href");
      assert(back === `${P}/prvky`, `Všechny prvky: ${back}`);
    });

    await step("Prvek kotel: Navázat existující záznam a zase odpojit", page, async () => {
      const hist = page.locator("section").filter({ has: page.locator("h2", { hasText: /^Historie$/ }) });
      await page.getByRole("button", { name: "Navázat existující záznamy" }).click();
      const box = page.getByRole("checkbox", { name: /Rekonstrukce koupelny v patře/ });
      await box.waitFor();
      assert((await box.getAttribute("aria-checked")) === "false", "záznam už je navázaný");
      await box.click();
      await until(async () => (await box.getAttribute("aria-checked")) === "true", "zaškrtnutí neproběhlo");
      await hist.locator("h3", { hasText: "Rekonstrukce koupelny v patře" }).waitFor();
      // záznam patří i k podlahovému topení — zůstane mu
      let e4 = (await demoDum(page)).entries.find((e) => e.id === "s-e4");
      assert(
        e4.elementIds.includes("demo-el-kotel") && e4.elementIds.includes("demo-el-podlahovka"),
        `elementIds s-e4: ${JSON.stringify(e4.elementIds)}`,
      );
      await box.click();
      await until(async () => (await box.getAttribute("aria-checked")) === "false", "odškrtnutí neproběhlo");
      await until(
        async () => (await hist.locator("h3", { hasText: "Rekonstrukce koupelny v patře" }).count()) === 0,
        "záznam po odpojení pořád v historii",
      );
      e4 = (await demoDum(page)).entries.find((e) => e.id === "s-e4");
      assert(JSON.stringify(e4.elementIds) === JSON.stringify(["demo-el-podlahovka"]), `po odpojení: ${JSON.stringify(e4.elementIds)}`);
    });

    // ---------- 4. Nový záznam z prvku ----------
    const ENTRY = "E2E výměna ventilu kotle";
    await step("Nový záznam: prvek předvybraný, Enter ve hledání neodešle formulář", page, async () => {
      await go(page, `${P}/zaznam/novy?prvek=demo-el-kotel`, "Nový záznam");
      await page.getByRole("button", { name: "Odebrat prvek Plynový kotel" }).waitFor();
      const before = (await demoDum(page)).entries.length;
      await page.getByLabel("Název *").fill(ENTRY);
      await page.getByRole("button", { name: /Upravit výběr/ }).click();
      const search = page.getByRole("searchbox", { name: "Hledat prvek" });
      await search.fill("rozvadec");
      await search.press("Enter");
      await page.waitForTimeout(700);
      assert(/\/zaznam\/novy/.test(page.url()), `Enter odeslal formulář → ${page.url()}`);
      assert((await demoDum(page)).entries.length === before, "Enter uložil záznam");
      const opt = page.getByRole("button", { name: /Hlavní rozvaděč/, pressed: false });
      await opt.click();
      await page.getByRole("button", { name: "Odebrat prvek Hlavní rozvaděč" }).waitFor();
    });

    await step("Nový záznam: uložení → zpět na prvek, záznam se štítkem prvku", page, async () => {
      await page.getByRole("button", { name: "Uložit záznam" }).click();
      await page.waitForURL(new RegExp(`${P}/prvek/demo-el-kotel$`));
      const hist = page.locator("section").filter({ has: page.locator("h2", { hasText: /^Historie$/ }) });
      const card = hist.locator("li").filter({ has: page.locator("h3", { hasText: ENTRY }) });
      await card.waitFor();
      // na stránce kotle se kotel znovu nevypisuje, rozvaděč ano
      assert((await card.getByRole("link", { name: "Hlavní rozvaděč" }).count()) === 1, "chybí štítek rozvaděče");
      assert((await card.getByRole("link", { name: "Plynový kotel" }).count()) === 0, "štítek kotle na stránce kotle");
      const e = (await demoDum(page)).entries.find((x) => x.title === ENTRY);
      assert(
        e && JSON.stringify([...e.elementIds].sort()) === JSON.stringify(["demo-el-kotel", "demo-el-rozvadec"]),
        `elementIds: ${JSON.stringify(e?.elementIds)}`,
      );
    });

    await step("Nemovitost: vybavení ukazuje štítek navázaného prvku", page, async () => {
      await go(page, P, "Rodinný dům Říčany");
      const inv = page.locator("section").filter({ has: page.locator("h2", { hasText: "Vybavení a materiály" }) });
      const kotel = inv.locator("li").filter({ hasText: "Model XYZ" });
      assert(
        (await kotel.getByRole("link", { name: "Plynový kotel" }).getAttribute("href")) === `${P}/prvek/demo-el-kotel`,
        "položka Plynový kotel bez štítku prvku",
      );
      const grohe = inv.locator("li").filter({ hasText: "Páková baterie Grohe" });
      assert((await grohe.locator(`a[href^="${P}/prvek/"]`).count()) === 0, "nenavázaná položka má štítek prvku");
    });

    await step("Nemovitost: EntryCard ukazuje štítky prvků (odkazy na prvek)", page, async () => {
      await go(page, P, "Rodinný dům Říčany");
      const card = page.locator("li").filter({ has: page.locator("h3", { hasText: ENTRY }) });
      await card.waitFor();
      const kotel = card.getByRole("link", { name: "Plynový kotel" });
      assert((await kotel.getAttribute("href")) === `${P}/prvek/demo-el-kotel`, "štítek kotle bez odkazu");
      assert((await card.getByRole("link", { name: "Hlavní rozvaděč" }).count()) === 1, "chybí štítek rozvaděče");
      const rev = page.locator("li").filter({ has: page.locator("h3", { hasText: /^Revize plynového kotle$/ }) });
      assert((await rev.getByRole("link", { name: "Plynový kotel" }).count()) === 1, "demo záznam bez štítku kotle");
    });

    // ---------- 5. Vybavení s novým prvkem, dokument s prvkem ----------
    const INV = "E2E Ohřívač vody";
    await step("Vybavení: „Vytvořit nový prvek z této položky“ → prvek vytvořen a navázán", page, async () => {
      await go(page, `${P}/vybaveni/nove`, "Přidat vybavení");
      await page.getByLabel("Co to je *").fill(INV);
      await page.getByLabel("Místnost / umístění").fill("Koupelna");
      await page.getByLabel("Značka / model").fill("Dražice OKCE 100");
      await page.getByLabel("Prvek domu").selectOption("__novy__");
      await page.getByLabel("Vrstva nového prvku").selectOption("ZARIZENI");
      await page.getByRole("button", { name: "Přidat do vybavení" }).click();
      await page.waitForURL(new RegExp(`${P}/prvek/[^/?]+$`));
      invElId = decodeURIComponent(page.url().split("/prvek/")[1]);
      await page.locator("main h1", { hasText: INV }).waitFor();
      const what = page.locator("section").filter({ has: page.locator("h2", { hasText: /^Co to je$/ }) });
      await what.getByText(INV).waitFor();
      assert(/Dražice OKCE 100/.test(await what.innerText()), "u prvku chybí značka vybavení");
      const dum = await demoDum(page);
      const el = dum.elements.find((e) => e.id === invElId);
      assert(el && el.category === "ZARIZENI" && el.room === "Koupelna", `nový prvek: ${JSON.stringify(el)}`);
      const it = dum.inventory.find((i) => i.name === INV);
      assert(it && it.elementId === invElId, "položka vybavení není navázaná na prvek");
      assert((await page.locator("main h1").innerText()).includes(INV), "prvek nemá název položky");
      // poloha nového prvku: zdroj + přesnost vždy vidět
      const where = page.locator("section").filter({ has: page.locator("h2", { hasText: /^Kde vede$/ }) });
      const wt = await where.innerText();
      assert(/Přesnost polohy/.test(wt) && /odhad \(zadal uživatel\)/.test(wt), `přesnost nového prvku: ${wt.slice(0, 200)}`);
      assert(/Poloha zatím není zakreslená/.test(wt), "nový prvek nemá být zakreslený");
    });

    const DOC = "E2E Záruční list kotle";
    await step("Dokument: nahrání s prvkem → štítek u dokumentu i v sekci prvku", page, async () => {
      await go(page, P, "Rodinný dům Říčany");
      const sec = page.locator("section").filter({ has: page.locator("h2", { hasText: "Originální dokumentace stavby" }) });
      await sec.getByRole("button", { name: "Nahrát dokument" }).click();
      const form = sec.locator("form");
      await form.waitFor();
      await form.getByPlaceholder("Název dokumentu (volitelné)").fill(DOC);
      await form.locator('select[name="category"]').selectOption("WARRANTY");
      await form.locator('select[name="section"]').selectOption("BUDOVA");
      await form.getByRole("button", { name: "Vybrat prvky" }).click();
      await form.getByRole("button", { name: /Plynový kotel/, pressed: false }).click();
      await form.getByRole("button", { name: "Odebrat prvek Plynový kotel" }).waitFor();
      await form.locator('input[name="file"]').setInputFiles({
        name: "zarucni-list.pdf",
        mimeType: "application/pdf",
        buffer: Buffer.from("%PDF-1.4\n% e2e\n"),
      });
      await form.locator('button[type="submit"]').click();
      const row = sec.locator("li").filter({ hasText: DOC });
      await row.waitFor();
      const chip = row.getByRole("link", { name: "Plynový kotel" });
      assert((await chip.getAttribute("href")) === `${P}/prvek/demo-el-kotel`, "dokument bez štítku prvku");
      const d = (await demoDum(page)).documents.find((x) => x.title === DOC);
      assert(d && JSON.stringify(d.elementIds) === JSON.stringify(["demo-el-kotel"]), "dokument neuložil prvek");
      await go(page, `${P}/prvek/demo-el-kotel`, "Plynový kotel");
      const docs = page.locator("section").filter({ has: page.locator("h2", { hasText: /^Dokumenty$/ }) });
      await docs.getByText(DOC).waitFor();
    });

    // ---------- 6. Model domu ----------
    await step("Model: ukázkový podklad se vykreslí (SVG <image> s půdorysem)", page, async () => {
      await go(page, `${P}/model`, "Model domu");
      await waitPlanReady(page);
      const info = await page.evaluate(() => {
        const img = document.querySelector('svg[role="application"] image');
        const b = img.getBBox();
        return { href: img.getAttribute("href") || "", w: b.width, h: b.height };
      });
      assert(info.href.startsWith("data:image/svg+xml") && info.w === 1000 && info.h === 640, JSON.stringify(info).slice(0, 120));
      const n = await shapeCount(page);
      assert(n === 7, `na půdorysu ${n} prvků, čekáno 7`);
      await page.getByText("Přízemí · verze 1").first().waitFor();
    });

    await step("Model: vrstvy skryjí a zase ukážou tvary", page, async () => {
      const layers = page.getByRole("group", { name: "Vrstvy půdorysu" });
      await layers.getByRole("button", { name: /Elektro/ }).click();
      await until(async () => (await shapeCount(page)) === 4, "Elektro off ≠ 4 tvary");
      await layers.getByRole("button", { name: /Topení/ }).click();
      await until(async () => (await shapeCount(page)) === 2, "Topení off ≠ 2 tvary");
      await layers.getByRole("button", { name: "Zobrazit vše" }).click();
      await until(async () => (await shapeCount(page)) === 7, "Zobrazit vše ≠ 7");
    });

    await step("Model: klepnutí na značku kotle otevře boční panel prvku", page, async () => {
      await clickPlan(page, 130, 80);
      const aside = page.locator("main aside").filter({ has: page.getByRole("link", { name: /Vše o prvku/ }) });
      await aside.locator("h2", { hasText: "Plynový kotel" }).waitFor();
      assert((await aside.getByRole("link", { name: /Vše o prvku/ }).getAttribute("href")) === `${P}/prvek/demo-el-kotel`, "Vše o prvku href");
      assert(
        (await aside.getByRole("link", { name: /Zapsat sem/ }).getAttribute("href")) === `${P}/zaznam/novy?prvek=demo-el-kotel`,
        "Zapsat sem href",
      );
      const t = await aside.innerText();
      assert(/Před vrtáním nebo bouráním vždy ověřte vedení detektorem/.test(t), "panel bez bezpečnostního upozornění");
      assert(/±10 cm · odhad \(zadal uživatel\)/.test(t), `panel bez přesnosti: ${t.slice(0, 200)}`);
      assert(!/bezpečn[éě] vrtat/i.test(t), "panel tvrdí bezpečné vrtat");
    });

    await step("Model: klepnutí na trasu okruhu otevře jeho panel; Esc zavře", page, async () => {
      await clickPlan(page, 250, 393);
      const aside = page.locator("main aside");
      await aside.locator("h2", { hasText: "Okruh zásuvek — obývací pokoj" }).waitFor();
      assert(/Tudy vede/.test(await aside.innerText()), "u trasy chybí „Tudy vede“");
      await page.keyboard.press("Escape");
      await aside.getByText("Vyberte prvek").waitFor();
    });

    await step("Model: zoom +/− a „Celý půdorys“", page, async () => {
      const v0 = await viewBox(page);
      await page.getByRole("button", { name: "Přiblížit" }).click();
      await until(async () => (await viewBox(page))[2] < v0[2] * 0.8, "Přiblížit nezmenšilo výřez");
      const v1 = await viewBox(page);
      await page.getByRole("button", { name: "Oddálit" }).click();
      await until(async () => (await viewBox(page))[2] > v1[2] * 1.2, "Oddálit nezvětšilo výřez");
      await page.getByRole("button", { name: "Přiblížit" }).click();
      await page.getByRole("button", { name: "Přiblížit" }).click();
      await page.getByRole("button", { name: "Celý půdorys" }).click();
      await until(async () => {
        const v = await viewBox(page);
        return v.every((x, i) => Math.abs(x - v0[i]) < 0.5);
      }, "Celý půdorys nevrátil výchozí výřez");
    });

    await step("Model: kolečko myši a klávesy +/−/0 zoomují, stránka se neposune", page, async () => {
      await settle(page);
      const v0 = await viewBox(page);
      const y0 = await page.evaluate(() => window.scrollY);
      const [cx, cy] = await planToClient(page, 500, 320);
      await page.mouse.move(cx, cy);
      await page.mouse.wheel(0, -400);
      await until(async () => (await viewBox(page))[2] < v0[2] * 0.9, "kolečko nepřiblížilo");
      await page.waitForTimeout(300);
      assert(Math.abs((await page.evaluate(() => window.scrollY)) - y0) < 2, "kolečko nad půdorysem posunulo stránku");
      await page.locator('svg[role="application"]').focus();
      await page.keyboard.press("0");
      await until(async () => Math.abs((await viewBox(page))[2] - v0[2]) < 0.5, "klávesa 0 nevrátila celý půdorys");
      await page.keyboard.press("+");
      await until(async () => (await viewBox(page))[2] < v0[2] * 0.9, "klávesa + nepřiblížila");
      await page.keyboard.press("-");
      await page.keyboard.press("-");
      await until(async () => (await viewBox(page))[2] > v0[2] * 0.95, "klávesa − neoddálila");
      await page.keyboard.press("0");
    });

    await step("Model: posun tažením nevybere prvek", page, async () => {
      const v0 = await viewBox(page);
      await settle(page);
      const [sx, sy] = await planToClient(page, 130, 80); // začátek tahu přímo na kotli
      await page.mouse.move(sx, sy);
      await page.mouse.down();
      for (let i = 1; i <= 8; i++) await page.mouse.move(sx + i * 12, sy + i * 8);
      await page.mouse.up();
      await page.waitForTimeout(300);
      const v1 = await viewBox(page);
      assert(Math.abs(v1[0] - v0[0]) > 5 || Math.abs(v1[1] - v0[1]) > 5, "tažení neposunulo půdorys");
      assert((await page.locator("main aside").getByRole("link", { name: /Vše o prvku/ }).count()) === 0, "tažení vybralo prvek");
      await page.getByRole("button", { name: "Celý půdorys" }).click();
    });

    // ---------- 7. Umístění prvku ----------
    await step("Umístění: ?prvek=…&umistit=1 zapne režim umísťování", page, async () => {
      assert(newElId, "chybí nový prvek");
      await go(page, `${P}/model?prvek=${encodeURIComponent(newElId)}&umistit=1`, "Model domu");
      await waitPlanReady(page);
      const bar = page.getByRole("region", { name: "Umístění prvku" });
      await bar.waitFor();
      assert((await bar.innerText()).includes(`Umísťujete: ${NEW_EL2}`), "lišta neukazuje prvek");
      await bar.getByText("Zatím žádný bod.").waitFor();
    });

    await step("Umístění: tažení nepřidá bod, 3 klepnutí, Zpět o bod, Hotovo", page, async () => {
      const bar = page.getByRole("region", { name: "Umístění prvku" });
      // tažení = posun, ne bod
      await settle(page);
      const [sx, sy] = await planToClient(page, 700, 450);
      await page.mouse.move(sx, sy);
      await page.mouse.down();
      for (let i = 1; i <= 6; i++) await page.mouse.move(sx - i * 10, sy - i * 6);
      await page.mouse.up();
      await page.waitForTimeout(300);
      assert(/Zatím žádný bod\./.test(await bar.innerText()), "tažení přidalo bod");
      await page.getByRole("button", { name: "Celý půdorys" }).click();
      await page.waitForTimeout(200);
      await clickPlan(page, 600, 420);
      await clickPlan(page, 760, 420);
      await clickPlan(page, 760, 540);
      await bar.getByText("3 body — trasa.").waitFor();
      await bar.getByRole("button", { name: "Zpět o bod" }).click();
      await bar.getByText("2 body — trasa.").waitFor();
      await clickPlan(page, 860, 540);
      await bar.getByText("3 body — trasa.").waitFor();
      await bar.getByRole("button", { name: "Hotovo" }).click();
      await page.getByRole("status").filter({ hasText: `Poloha prvku „${NEW_EL2}“ je uložená na podkladu Přízemí.` }).waitFor();
      const el = (await demoDum(page)).elements.find((e) => e.id === newElId);
      assert(el.plan && el.plan.modelId === "demo-model-prizemi" && el.plan.points.length === 3, `plan: ${JSON.stringify(el.plan)}`);
      const [x2, y2] = el.plan.points[2];
      assert(Math.abs(x2 - 0.86) < 0.02 && Math.abs(y2 - 540 / 640) < 0.02, `3. bod ${x2},${y2}`);
      // ?umistit=1 se z adresy uklidí (obnovení / Zpět už umísťování nespustí), oznámení zůstane
      await until(async () => !page.url().includes("umistit"), `adresa po Hotovo: ${page.url()}`);
      assert(page.url().includes(`prvek=${encodeURIComponent(newElId)}`), `adresa ztratila prvek: ${page.url()}`);
      await page.getByRole("status").filter({ hasText: `Poloha prvku „${NEW_EL2}“` }).waitFor();
      await page.locator("main aside h2", { hasText: NEW_EL2 }).waitFor();
    });

    await step("Umístění: po obnovení stránky je trasa nakreslená (bez režimu umísťování)", page, async () => {
      await page.reload({ waitUntil: "domcontentloaded" });
      await page.locator("main h1", { hasText: "Model domu" }).waitFor();
      await waitPlanReady(page);
      await until(async () => (await shapeCount(page)) === 8, "po obnovení není 8 tvarů");
      assert((await page.getByRole("region", { name: "Umístění prvku" }).count()) === 0, "obnovení znovu spustilo umísťování");
      // klepnutí na trasu vybere nový prvek
      await page.keyboard.press("Escape");
      await page.getByRole("button", { name: "Celý půdorys" }).click();
      await clickPlan(page, 680, 420); // první úsek trasy (600,420)→(760,420)
      await page.locator("main aside h2", { hasText: NEW_EL2 }).waitFor();
    });

    await step("Umístění: stránka prvku teď ukazuje náhled půdorysu", page, async () => {
      await go(page, `${P}/prvek/${encodeURIComponent(newElId)}`, NEW_EL2);
      await page.locator(`svg[role="img"][aria-label^="Poloha prvku ${NEW_EL2}"]`).waitFor();
      assert((await page.getByText("Poloha zatím není zakreslená.").count()) === 0, "pořád „není zakreslená“");
    });

    await step("Umístění: Esc zruší umísťování bez uložení", page, async () => {
      assert(invElId, "chybí prvek z vybavení");
      await go(page, `${P}/model?prvek=${encodeURIComponent(invElId)}&umistit=1`, "Model domu");
      await waitPlanReady(page);
      const bar = page.getByRole("region", { name: "Umístění prvku" });
      await bar.waitFor();
      await clickPlan(page, 300, 500);
      await bar.getByText(/1 bod — zařízení/).waitFor();
      await page.keyboard.press("Escape");
      await until(async () => (await bar.count()) === 0, "Esc nezrušil umísťování");
      await page.getByRole("group", { name: "Vrstvy půdorysu" }).waitFor();
      const el = (await demoDum(page)).elements.find((e) => e.id === invElId);
      assert(!el.plan, "zrušené umísťování uložilo polohu");
      await until(async () => !page.url().includes("umistit"), `adresa po Esc: ${page.url()}`);
    });

    await step("Model: „Umístit“ u prvku bez polohy spustí umísťování, Zrušit nic neuloží", page, async () => {
      await go(page, `${P}/model`, "Model domu");
      await waitPlanReady(page);
      const list = page.locator("section").filter({ has: page.locator("h2", { hasText: "Prvky bez polohy" }) });
      const row = list.locator("li").filter({ hasText: "Střešní okno — ložnice" });
      await row.getByRole("button", { name: "Umístit" }).click();
      const bar = page.getByRole("region", { name: "Umístění prvku" });
      await bar.getByText("Umísťujete: Střešní okno — ložnice").waitFor();
      await clickPlan(page, 500, 200);
      await bar.getByText(/1 bod — zařízení/).waitFor();
      await bar.getByRole("button", { name: "Zrušit" }).click();
      await page.getByRole("group", { name: "Vrstvy půdorysu" }).waitFor();
      const el = (await demoDum(page)).elements.find((e) => e.id === "demo-el-stresni-okno");
      assert(!el.plan, "Zrušit uložil polohu");
    });

    await step("Model: panel — „Odebrat z půdorysu“ s potvrzením", page, async () => {
      await go(page, `${P}/model?prvek=${encodeURIComponent(newElId)}`, "Model domu");
      await waitPlanReady(page);
      const aside = page.locator("main aside");
      await aside.locator("h2", { hasText: NEW_EL2 }).waitFor();
      D.dialogs.push(false);
      await aside.getByRole("button", { name: "Odebrat z půdorysu" }).click();
      await page.waitForTimeout(300);
      assert((await demoDum(page)).elements.find((e) => e.id === newElId).plan, "Zrušit přesto odebral polohu");
      D.dialogs.push(true);
      await aside.getByRole("button", { name: "Odebrat z půdorysu" }).click();
      await page.getByRole("status").filter({ hasText: `„${NEW_EL2}“ už na půdorysu není.` }).waitFor();
      await until(async () => (await shapeCount(page)) === 7, "po odebrání není 7 tvarů");
      assert(!(await demoDum(page)).elements.find((e) => e.id === newElId).plan, "poloha zůstala");
      // prvek je zpátky v seznamu bez polohy, záznamy zůstaly
      const list = page.locator("section").filter({ has: page.locator("h2", { hasText: "Prvky bez polohy" }) });
      await list.getByText(NEW_EL2).waitFor();
    });

    // ---------- 8. Měřítko ----------
    await step("Měřítko: dva body + metry → měřítko uložené a zobrazené", page, async () => {
      await go(page, `${P}/model`, "Model domu");
      await waitPlanReady(page);
      const bandsBefore = await page.evaluate(() =>
        [...document.querySelectorAll('svg[role="application"] > g path')].map((p) => p.getAttribute("stroke-width")).join("|"),
      );
      await page.getByRole("button", { name: "Nastavit měřítko" }).click();
      const reg = page.getByRole("region", { name: "Nastavení měřítka" });
      await reg.waitFor();
      await clickPlan(page, 40, 600);
      await reg.getByText("(1/2)").waitFor();
      await clickPlan(page, 960, 600);
      const input = reg.getByLabel("Skutečná vzdálenost mezi body (m)");
      await input.fill("9,2");
      await reg.getByRole("button", { name: "Uložit měřítko" }).click();
      await page.getByRole("status").filter({ hasText: /Měřítko nastaveno: 1 m = \d+([,.]\d)? px/ }).waitFor();
      await page.getByText(/Měřítko: 1 m = \d+([,.]\d)? px/).waitFor();
      const m = (await demoDum(page)).models.find((x) => x.id === "demo-model-prizemi");
      assert(m.pxPerMeter > 95 && m.pxPerMeter < 105, `pxPerMeter ${m.pxPerMeter}`);
      // pruh měřítka v rohu a změněné šířky pruhů přesnosti
      await page.locator("div.pointer-events-none.absolute.bottom-2").waitFor();
      const bandsAfter = await page.evaluate(() =>
        [...document.querySelectorAll('svg[role="application"] > g path')].map((p) => p.getAttribute("stroke-width")).join("|"),
      );
      assert(bandsAfter !== bandsBefore, "šířky pruhů se po nastavení měřítka nezměnily");
      assert(await page.getByRole("button", { name: "Zrušit měřítko" }).isVisible(), "chybí Zrušit měřítko");
    });

    // ---------- 9. Nový podklad, verze, smazání ----------
    await step("Podklad: nahrání PNG „1. NP“ → objeví se ve výběru podkladů", page, async () => {
      const png = await makePng(page, "1. NP");
      await page.getByRole("button", { name: "Nahrát podklad" }).click();
      await page.getByRole("heading", { name: "Nový podklad" }).waitFor();
      await page.locator('input[type="file"]').setInputFiles({ name: "1np.png", mimeType: "image/png", buffer: png });
      await page.getByAltText("Náhled půdorysu").waitFor({ timeout: 15000 });
      await page.getByLabel("Název").fill("1. NP");
      await page.getByRole("button", { name: "Uložit podklad" }).click();
      await page.getByRole("status").filter({ hasText: "Podklad 1. NP · verze 1 je nahraný." }).waitFor();
      const picker = page.getByRole("group", { name: "Podklady" });
      const btn = picker.getByRole("button", { name: /1\. NP\s*verze 1/ });
      await btn.waitFor();
      assert((await btn.getAttribute("aria-pressed")) === "true", "nový podklad není vybraný");
      await waitPlanReady(page);
      const href = await page.locator('svg[role="application"] image').getAttribute("href");
      assert(href.startsWith("data:image/jpeg") || href.startsWith("data:image/png"), "podklad není obrázek");
    });

    await step("Podklad: stejný název podruhé → verze 2", page, async () => {
      const png = await makePng(page, "1. NP v2");
      await page.getByRole("button", { name: "Nahrát podklad" }).click();
      await page.locator('input[type="file"]').setInputFiles({ name: "1np-v2.png", mimeType: "image/png", buffer: png });
      await page.getByAltText("Náhled půdorysu").waitFor({ timeout: 15000 });
      await page.getByLabel("Název").fill("1. NP");
      await page.getByText(/Uloží se jako\s*verze 2/).waitFor();
      await page.getByRole("button", { name: "Uložit podklad" }).click();
      await page.getByRole("status").filter({ hasText: "Podklad 1. NP · verze 2 je nahraný." }).waitFor();
      await page.getByRole("group", { name: "Podklady" }).getByRole("button", { name: /1\. NP\s*verze 2/ }).waitFor();
      await page.getByText("Starší verze (1)").waitFor();
      const models = (await demoDum(page)).models.filter((m) => m.title === "1. NP").map((m) => m.version).sort();
      assert(JSON.stringify(models) === "[1,2]", `verze: ${JSON.stringify(models)}`);
    });

    await step("Podklad: smazání s potvrzením", page, async () => {
      D.dialogs.push(false); // nejdřív Zrušit → nic se nesmaže
      await page.getByRole("button", { name: "Smazat", exact: true }).click();
      await page.waitForTimeout(300);
      assert((await demoDum(page)).models.filter((m) => m.title === "1. NP").length === 2, "Zrušit přesto smazal");
      D.dialogs.push(true);
      await page.getByRole("button", { name: "Smazat", exact: true }).click();
      await page.getByRole("status").filter({ hasText: "Podklad „1. NP“ (verze 2) je smazaný." }).waitFor();
      await page.getByRole("group", { name: "Podklady" }).getByRole("button", { name: /1\. NP\s*verze 1/ }).waitFor();
      const left = (await demoDum(page)).models.filter((m) => m.title === "1. NP").map((m) => m.version);
      assert(JSON.stringify(left) === "[1]", `po smazání: ${JSON.stringify(left)}`);
    });

    await step("Podklad: nová verze Přízemí s převzetím poloh a měřítka", page, async () => {
      const before = await demoDum(page);
      const old = before.models.find((m) => m.id === "demo-model-prizemi");
      const placed = before.elements.filter((e) => e.plan?.modelId === old.id).length;
      assert(placed >= 7, `na Přízemí jen ${placed} prvků`);
      await page.getByRole("group", { name: "Podklady" }).getByRole("button", { name: /Přízemí\s*verze 1/ }).click();
      await page.getByText(/Přízemí · verze 1/).first().waitFor();
      await page.getByRole("button", { name: "Nová verze" }).click();
      await page.getByRole("heading", { name: "Nová verze podkladu „Přízemí“" }).waitFor();
      assert((await page.getByLabel("Název").inputValue()) === "Přízemí", "název nové verze není předvyplněný");
      const png = await makePng(page, "Přízemí v2");
      await page.locator('input[type="file"]').setInputFiles({ name: "prizemi-v2.png", mimeType: "image/png", buffer: png });
      await page.getByAltText("Náhled půdorysu").waitFor({ timeout: 15000 });
      const carry = page.getByLabel(new RegExp(`Převzít polohy \\(${placed} prvků\\) a měřítko z verze 1`));
      await carry.check();
      await page.getByRole("button", { name: "Uložit podklad" }).click();
      await page.getByRole("status").filter({ hasText: "Podklad Přízemí · verze 2 je nahraný." }).waitFor();
      await waitPlanReady(page);
      await until(async () => (await shapeCount(page)) === placed, "na verzi 2 nejsou převzaté prvky");
      const dum = await demoDum(page);
      const v2 = dum.models.find((m) => m.title === "Přízemí" && m.version === 2);
      assert(v2 && v2.width === 1200, `verze 2: ${JSON.stringify({ ...v2, dataUrl: undefined })}`);
      assert(dum.elements.filter((e) => e.plan?.modelId === v2.id).length === placed, "polohy se nepřevzaly");
      assert(Math.abs(v2.pxPerMeter - old.pxPerMeter * 1.2) < 0.05, `měřítko ${v2.pxPerMeter} vs ${old.pxPerMeter}`);
      // starší verze zůstává v historii a jde zobrazit
      await page.getByText("Starší verze (1)").click();
      await page.getByRole("button", { name: /verze 1\s*stav k/ }).click();
      await page.getByText("Prohlížíte starší verzi 1. Aktuální je verze 2.").waitFor();
      await page.getByRole("button", { name: "Zobrazit aktuální" }).click();
      await page.getByText(/Přízemí · verze 2/).first().waitFor();
      // stránka prvku ukazuje náhled na nové verzi
      await go(page, `${P}/prvek/demo-el-kotel`, "Plynový kotel");
      await page.getByText("Přízemí · verze 2").waitFor();
    });

    // ---------- 2b. Smazání prvku (vazby se odpojí) ----------
    await step("Prvky: smazání prvku s potvrzením → zmizí, záznamy a vybavení se odpojí", page, async () => {
      assert(invElId, "chybí prvek z vybavení");
      // naváže záznam na prvek z vybavení, ať je co odpojovat
      const before = await demoDum(page);
      const invName = before.elements.find((e) => e.id === invElId).name;
      await go(page, `${P}/zaznam/novy?prvek=${encodeURIComponent(invElId)}`, "Nový záznam");
      await page.getByLabel("Název *").fill("E2E servis ohřívače");
      await page.getByRole("button", { name: "Uložit záznam" }).click();
      await page.waitForURL(new RegExp(`/prvek/${invElId}$`));
      await go(page, `${P}/prvky`, "Prvky domu");
      D.dialogs.push(false);
      await page.getByRole("button", { name: `Smazat ${invName}` }).click();
      await page.waitForTimeout(300);
      assert((await page.locator(`a[href="${P}/prvek/${invElId}"]`).count()) === 1, "Zrušit přesto smazal prvek");
      D.dialogs.push(true);
      await page.getByRole("button", { name: `Smazat ${invName}` }).click();
      await until(async () => (await page.locator(`a[href="${P}/prvek/${invElId}"]`).count()) === 0, "prvek po smazání pořád v seznamu");
      const dum = await demoDum(page);
      assert(!dum.elements.some((e) => e.id === invElId), "prvek pořád v úložišti");
      const entry = dum.entries.find((e) => e.title === "E2E servis ohřívače");
      assert(entry && !(entry.elementIds ?? []).includes(invElId), "záznam se neodpojil (nebo zmizel)");
      const it = dum.inventory.find((i) => i.name === INV);
      assert(it && it.elementId === undefined, "vybavení se neodpojilo (nebo zmizelo)");
      await page.goto(`${BASE}${P}/prvek/${encodeURIComponent(invElId)}`, { waitUntil: "domcontentloaded" });
      await page.getByText("Prvek nenalezen — mohl být smazán.").waitFor({ timeout: 20000 });
    });

    await step("Prvek: smazání ze stránky prvku → přesměrování na /prvky", page, async () => {
      await go(page, `${P}/prvek/${encodeURIComponent(newElId)}`, NEW_EL2);
      D.dialogs.push(true);
      await page.getByRole("button", { name: "Smazat", exact: true }).click();
      await page.waitForURL(new RegExp(`${P}/prvky$`));
      await page.locator("main h1", { hasText: "Prvky domu" }).waitFor();
      assert((await page.locator(`a[href="${P}/prvek/${newElId}"]`).count()) === 0, "smazaný prvek v seznamu");
      const dum = await demoDum(page);
      assert(!dum.elements.some((e) => e.id === newElId), "prvek pořád v úložišti");
      const r = dum.reminders.find((x) => x.title === "E2E Revize zásuvek");
      assert(r && r.elementId === undefined, "termín se neodpojil (nebo zmizel)");
      // Zpět nevede na smazaný prvek (replace)
      await page.goBack();
      await page.waitForTimeout(800);
      assert(!page.url().includes(`/prvek/${newElId}`), `Zpět vede na smazaný prvek: ${page.url()}`);
    });

    await D.ctx.close();
  });

  // =====================================================================
  // JEN KE ČTENÍ — architekt, předaná demo-vila
  // =====================================================================
  await suite("readonly", async () => {
    const R = await openSession("desktop", "readonly");
    const rp = R.page;
    const V = "/nemovitost/demo-vila";
    await step("Jen ke čtení: architekt, demo-vila doplněná o půdorys a prvek", rp, async () => {
      await login(rp, "architekt");
      await go(rp, "/prehled");
      // do úložiště tohoto „zařízení" doplníme vile podklad a prvek (jako by je zadal majitel)
      await rp.evaluate((key) => {
        const data = JSON.parse(localStorage.getItem(key));
        const vila = data.find((p) => p.id === "demo-vila");
        const dum = data.find((p) => p.id === "demo-dum");
        const model = { ...dum.models.find((m) => m.id === "demo-model-prizemi"), id: "e2e-vila-plan", title: "Přízemí" };
        vila.models = [model];
        vila.elements = [
          {
            id: "e2e-vila-rozvadec",
            name: "Rozvaděč vily",
            category: "ELEKTRO",
            kind: "Rozvaděč",
            source: "SKEN",
            accuracyMm: 10,
            condition: "OK",
            plan: { modelId: "e2e-vila-plan", points: [[0.3, 0.5]] },
            createdAt: "2026-03-01",
            updatedAt: "2026-03-01",
          },
          {
            id: "e2e-vila-okno",
            name: "Okno obývák vily",
            category: "KONSTRUKCE",
            source: "ZADAL_UZIVATEL",
            condition: "OK",
            createdAt: "2026-03-01",
            updatedAt: "2026-03-01",
          },
        ];
        localStorage.setItem(key, JSON.stringify(data));
      }, STORE_KEY);
      await go(rp, `${V}/prvky`, "Prvky domu");
      await rp.getByText("Tuto nemovitost máte jen ke čtení.").waitFor();
    });

    await step("Jen ke čtení: /prvky bez přidání, úprav a mazání", rp, async () => {
      assert((await rp.getByRole("button", { name: /Přidat prvek/ }).count()) === 0, "vidět Přidat prvek");
      assert((await rp.getByRole("button", { name: /^Upravit / }).count()) === 0, "vidět Upravit");
      assert((await rp.getByRole("button", { name: /^Smazat / }).count()) === 0, "vidět Smazat");
      await go(rp, `${V}/prvky?nova=1`, "Prvky domu");
      assert((await rp.getByLabel("Název prvku *").count()) === 0, "?nova=1 otevřel formulář čtenáři");
    });

    await step("Jen ke čtení: stránka prvku bez akcí (Zapsat, Upravit, Navázat…)", rp, async () => {
      await go(rp, `${V}/prvek/e2e-vila-rozvadec`, "Rozvaděč vily");
      await rp.locator('svg[role="img"][aria-label^="Poloha prvku Rozvaděč vily"]').waitFor();
      for (const name of [/Zapsat sem/, /Nahrát protokol/, /Pozvat řemeslníka/, /Zapsat provedení/]) {
        assert((await rp.getByRole("link", { name }).count()) === 0, `vidět odkaz ${name}`);
      }
      for (const name of [/^Upravit$/, /^Smazat$/, /Navázat existující/]) {
        assert((await rp.getByRole("button", { name }).count()) === 0, `vidět tlačítko ${name}`);
      }
      const t = await rp.locator("main").innerText();
      assert(/±10 mm · změřeno \(sken/.test(t), "u prvku chybí přesnost");
      assert(/Před vrtáním nebo bouráním vždy ověřte vedení detektorem/.test(t), "chybí bezpečnostní upozornění");
      await go(rp, `${V}/prvek/e2e-vila-okno`, "Okno obývák vily");
      assert((await rp.getByRole("link", { name: /Zakreslit v modelu/ }).count()) === 0, "vidět Zakreslit v modelu");
    });

    await step("Jen ke čtení: model bez nahrávání, měřítka a umísťování", rp, async () => {
      await go(rp, `${V}/model?prvek=e2e-vila-okno&umistit=1`, "Model domu");
      await waitPlanReady(rp);
      await rp.getByText(/Model máte jen ke čtení/).waitFor();
      assert((await rp.getByRole("region", { name: "Umístění prvku" }).count()) === 0, "čtenář je v režimu umísťování");
      for (const name of [/Nahrát podklad/, /Nastavit měřítko/, /Nová verze/, /^Smazat$/, /^Umístit/, /Přidat prvek/]) {
        assert((await rp.getByRole("button", { name }).count()) === 0, `vidět tlačítko ${name}`);
      }
      // klepnutí na prvek: panel s „Vše o prvku", bez „Zapsat sem" a bez umísťování
      await clickPlan(rp, 300, 320);
      const aside = rp.locator("main aside");
      await aside.locator("h2", { hasText: "Rozvaděč vily" }).waitFor();
      assert((await aside.getByRole("link", { name: /Vše o prvku/ }).count()) === 1, "chybí Vše o prvku");
      assert((await aside.getByRole("link", { name: /Zapsat sem/ }).count()) === 0, "čtenář vidí Zapsat sem");
      assert((await aside.getByRole("button", { name: /Překreslit|Umístit|Odebrat/ }).count()) === 0, "čtenář vidí úpravu polohy");
      // ani tažení / klepnutí v režimu prohlížení nic neuloží
      const el = (await readStore(rp)).find((p) => p.id === "demo-vila").elements.find((e) => e.id === "e2e-vila-okno");
      assert(!el.plan, "čtenáři se uložila poloha");
    });

    await step("Jen ke čtení: /zaznam/novy a /vybaveni/nove nejdou", rp, async () => {
      await rp.goto(`${BASE}${V}/zaznam/novy?prvek=e2e-vila-rozvadec`, { waitUntil: "domcontentloaded" });
      await rp.getByText(/jen ke čtení — záznam přidat nelze/).waitFor({ timeout: 20000 });
      await rp.goto(`${BASE}${V}/vybaveni/nove?prvek=e2e-vila-rozvadec`, { waitUntil: "domcontentloaded" });
      await rp.getByText(/jen ke čtení — vybavení přidat nelze/).waitFor({ timeout: 20000 });
    });
    await R.ctx.close();
  });

  // =====================================================================
  // TELEFON 375 × 812 — majitel
  // =====================================================================
  await suite("phone", async () => {
    const M = await openSession("phone", "phone");
    const mp = M.page;
    await step("Telefon: přihlášení", mp, async () => {
      await login(mp, "klient");
    });

    const phonePages = [
      [P, "Rodinný dům Říčany"],
      [`${P}/prvky`, "Prvky domu"],
      [`${P}/prvky?nova=1`, "Prvky domu"],
      [`${P}/prvek/demo-el-kotel`, "Plynový kotel"],
      [`${P}/prvek/demo-el-okruh-obyvak`, "Okruh zásuvek"],
      [`${P}/model`, "Model domu"],
      [`${P}/model?prvek=demo-el-strecha&umistit=1`, "Model domu"],
      [`${P}/zaznam/novy?prvek=demo-el-kotel`, "Nový záznam"],
      [`${P}/vybaveni/nove?prvek=demo-el-kotel`, "Přidat vybavení"],
    ];
    for (const [path, h1] of phonePages) {
      await step(`Telefon: bez vodorovného přetečení ${path.replace(P, "") || "/"}`, mp, async () => {
        await go(mp, path, h1);
        if (path.includes("/model")) await waitPlanReady(mp);
        await mp.waitForTimeout(250);
        await noOverflow(mp, path);
      });
    }

    await step("Telefon: /prvky — otevřený výběr prvků a formuláře nepřetékají", mp, async () => {
      await go(mp, `${P}/prvky`, "Prvky domu");
      await mp.getByRole("button", { name: "Upravit Plynový kotel" }).click();
      await mp.getByRole("button", { name: "Uložit změny" }).waitFor();
      await mp.locator("details summary", { hasText: "Pokročilé" }).click();
      await noOverflow(mp, "/prvky (úprava)");
      await go(mp, `${P}/zaznam/novy?prvek=demo-el-kotel`, "Nový záznam");
      await mp.getByRole("button", { name: /Upravit výběr/ }).click();
      await mp.getByRole("searchbox", { name: "Hledat prvek" }).waitFor();
      await noOverflow(mp, "/zaznam/novy (výběr prvků)");
      await go(mp, `${P}/prvek/demo-el-kotel`, "Plynový kotel");
      await mp.getByRole("button", { name: "Navázat existující záznamy" }).click();
      await mp.getByRole("checkbox").first().waitFor();
      await mp.getByRole("button", { name: /^Přidat$/ }).first().click(); // nový termín
      await noOverflow(mp, "/prvek (navázání + termín)");
      await go(mp, P, "Rodinný dům Říčany");
      const sec = mp.locator("section").filter({ has: mp.locator("h2", { hasText: "Originální dokumentace stavby" }) });
      await sec.getByRole("button", { name: "Nahrát dokument" }).click();
      await sec.getByRole("button", { name: "Vybrat prvky" }).click();
      await noOverflow(mp, "/nemovitost (nahrání dokumentu s prvkem)");
    });

    // Posune okno tak, aby horní hrana půdorysu byla na y (px okna)
    async function scrollPlanTo(page, y) {
      await page.evaluate((y) => {
        const r = document.querySelector('svg[role="application"]').getBoundingClientRect();
        window.scrollBy({ top: r.top - y, behavior: "instant" });
      }, y);
      await settle(page);
    }
    const phoneSheet = () =>
      mp.locator("div.fixed.bottom-0").filter({ has: mp.getByRole("link", { name: /Vše o prvku/ }) });
    // Vybraný kotel musí po otevření listu zůstat vidět nad ním (a pod horní lištou)
    async function assertKotelAboveSheet(where) {
      await settle(mp);
      const [kx, ky] = await planToClient(mp, 130, 80);
      const sheetTop = (await phoneSheet().boundingBox()).y;
      const svgBox = await mp.locator('svg[role="application"]').boundingBox();
      assert(
        ky < sheetTop - 8 && ky > Math.max(56, svgBox.y) && kx > svgBox.x && kx < svgBox.x + svgBox.width,
        `${where}: kotel schovaný (kotel y=${Math.round(ky)}, půdorys od ${Math.round(svgBox.y)}, list od ${Math.round(sheetTop)})`,
      );
    }

    await step("Telefon: klepnutí na kotel otevře spodní list s „Vše o prvku“", mp, async () => {
      await go(mp, `${P}/model`, "Model domu");
      await waitPlanReady(mp);
      await scrollPlanTo(mp, 70); // půdorys těsně pod horní lištou
      const [x, y] = await planToClient(mp, 130, 80);
      await mp.touchscreen.tap(x, y);
      const sheet = phoneSheet();
      await sheet.locator("h2", { hasText: "Plynový kotel" }).waitFor();
      await assertKotelAboveSheet("půdorys nahoře");
      const box = await sheet.boundingBox();
      assert(box && box.y + box.height <= 812 + 1 && box.x >= 63 && box.x + box.width <= 375 + 1, `list mimo obrazovku ${JSON.stringify(box)}`);
      assert(box.height <= 812 * 0.6, `list zabírá ${box.height}px`);
      assert(/Před vrtáním nebo bouráním vždy ověřte vedení detektorem/.test(await sheet.innerText()), "list bez upozornění");
      assert(/±10 cm · odhad \(zadal uživatel\)/.test(await sheet.innerText()), "list bez přesnosti");
      await noOverflow(mp, "/model (spodní list)");
      // „Vše o prvku" i „Zapsat sem" jsou v listu vidět a nic je nepřekrývá
      for (const name of [/Vše o prvku/, /Zapsat sem/]) {
        const link = sheet.getByRole("link", { name });
        const covered = await link.evaluate((a) => {
          const r = a.getBoundingClientRect();
          if (r.bottom > window.innerHeight || r.top < 0) return "mimo obrazovku";
          const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
          return hit && (hit === a || a.contains(hit)) ? "" : `překryté (${hit?.tagName})`;
        });
        assert(!covered, `${name}: ${covered}`);
      }
    });

    await step("Telefon: tažení prstem posune půdorys a nic nevybere / nezavře", mp, async () => {
      const cdp = await M.ctx.newCDPSession(mp);
      await settle(mp);
      const v0 = await viewBox(mp);
      const svgBox = await mp.locator('svg[role="application"]').boundingBox();
      const sheetTop = (await phoneSheet().boundingBox()).y;
      // začátek tahu ve viditelné části půdorysu nad listem
      const sx = svgBox.x + svgBox.width * 0.6;
      const sy = (Math.max(56, svgBox.y) + Math.min(sheetTop, svgBox.y + svgBox.height)) / 2;
      await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: sx, y: sy }] });
      for (let i = 1; i <= 8; i++) {
        await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: sx - i * 10, y: sy + i * 3 }] });
      }
      await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
      await mp.waitForTimeout(400);
      const v1 = await viewBox(mp);
      assert(Math.abs(v1[0] - v0[0]) > 5, `tažení prstem neposunulo půdorys (${v0[0]} → ${v1[0]})`);
      assert((await phoneSheet().locator("h2", { hasText: "Plynový kotel" }).count()) === 1, "tažení změnilo výběr");
    });

    await step("Telefon: zoom dvěma prsty přiblíží půdorys", mp, async () => {
      await go(mp, `${P}/model`, "Model domu");
      await waitPlanReady(mp);
      await scrollPlanTo(mp, 70);
      const cdp = await M.ctx.newCDPSession(mp);
      const v0 = await viewBox(mp);
      const box = await mp.locator('svg[role="application"]').boundingBox();
      const cx = box.x + box.width / 2;
      const cy = box.y + box.height / 2;
      const pts = (d) => [
        { x: cx - d, y: cy, id: 1 },
        { x: cx + d, y: cy, id: 2 },
      ];
      await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: pts(30) });
      for (let d = 40; d <= 110; d += 10) {
        await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: pts(d) });
      }
      await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
      await mp.waitForTimeout(400);
      const v1 = await viewBox(mp);
      assert(v1[2] < v0[2] * 0.6, `zoom dvěma prsty: šířka výřezu ${v0[2]} → ${v1[2]}`);
      assert((await phoneSheet().count()) === 0, "zoom dvěma prsty vybral prvek");
      await mp.getByRole("button", { name: "Celý půdorys" }).click();
    });

    await step("Telefon: klepnutí na kotel, když je půdorys nízko — list ho nezakryje", mp, async () => {
      await go(mp, `${P}/model`, "Model domu");
      await waitPlanReady(mp);
      // uživatel dojel jen k hornímu okraji půdorysu: kotel je ve spodní polovině obrazovky
      await scrollPlanTo(mp, 420);
      const [x, y] = await planToClient(mp, 130, 80);
      assert(y > 430 && y < 800, `kotel má být dole na obrazovce (y=${y})`);
      await mp.touchscreen.tap(x, y);
      await phoneSheet().locator("h2", { hasText: "Plynový kotel" }).waitFor();
      await assertKotelAboveSheet("půdorys nízko");
      await noOverflow(mp, "/model (list, půdorys nízko)");
    });

    await step("Telefon: výběr prvku ze seznamu pod půdorysem — list ho nezakryje", mp, async () => {
      await go(mp, `${P}/model`, "Model domu");
      await waitPlanReady(mp);
      const chips = mp.locator("section").filter({ has: mp.locator("h2", { hasText: "Na tomto podkladu" }) });
      const chip = chips.getByRole("button", { name: "Plynový kotel" });
      await chip.scrollIntoViewIfNeeded();
      await chip.click();
      await phoneSheet().locator("h2", { hasText: "Plynový kotel" }).waitFor();
      await mp.waitForTimeout(700); // plynulé posunutí k půdorysu
      await assertKotelAboveSheet("výběr ze seznamu");
    });

    await step("Telefon: „Vše o prvku“ ze spodního listu otevře stránku prvku", mp, async () => {
      const sheet = phoneSheet();
      await sheet.getByRole("link", { name: /Vše o prvku/ }).click();
      await mp.waitForURL(new RegExp(`${P}/prvek/demo-el-kotel$`));
      await mp.locator("main h1", { hasText: "Plynový kotel" }).waitFor();
      await noOverflow(mp, "/prvek po přechodu z modelu");
    });

    await step("Telefon: „Otevřít v modelu“ z prvku — půdorys s prvkem je vidět nad listem", mp, async () => {
      await go(mp, `${P}/prvek/demo-el-kotel`, "Plynový kotel");
      await mp.getByRole("link", { name: "Otevřít v modelu" }).click();
      await mp.waitForURL(/\/model\?prvek=demo-el-kotel$/);
      await waitPlanReady(mp);
      await phoneSheet().locator("h2", { hasText: "Plynový kotel" }).waitFor();
      await assertKotelAboveSheet("otevření z prvku");
    });

    await step("Telefon: zavření listu tlačítkem Zavřít", mp, async () => {
      await go(mp, `${P}/model?prvek=demo-el-kotel`, "Model domu");
      await waitPlanReady(mp);
      const sheet = mp.locator("div.fixed.bottom-0").filter({ has: mp.getByRole("link", { name: /Vše o prvku/ }) });
      await sheet.waitFor();
      await sheet.getByRole("button", { name: "Zavřít" }).click();
      await until(async () => (await sheet.count()) === 0, "list se nezavřel");
    });

    await step("Telefon: umístění klepnutím (touch) a Hotovo", mp, async () => {
      await go(mp, `${P}/model?prvek=demo-el-strecha&umistit=1`, "Model domu");
      await waitPlanReady(mp);
      const bar = mp.getByRole("region", { name: "Umístění prvku" });
      await bar.waitFor();
      const svg = mp.locator('svg[role="application"]');
      await svg.scrollIntoViewIfNeeded();
      for (const [x, y] of [[100, 560], [500, 560]]) {
        const [cx, cy] = await planToClient(mp, x, y);
        await mp.touchscreen.tap(cx, cy);
        await mp.waitForTimeout(150);
      }
      await bar.getByText("2 body — trasa.").waitFor();
      await bar.getByRole("button", { name: "Hotovo" }).click();
      await mp.getByRole("status").filter({ hasText: "Poloha prvku „Střešní krytina“" }).waitFor();
      const el = (await demoDum(mp)).elements.find((e) => e.id === "demo-el-strecha");
      assert(el.plan?.points.length === 2, `plan: ${JSON.stringify(el.plan)}`);
      await noOverflow(mp, "/model (po umístění)");
    });
    await M.ctx.close();
  });
} catch (e) {
  rec(false, "FATÁLNÍ: " + current, String(e?.stack || e).slice(0, 400));
} finally {
  await browser.close().catch(() => {});
  if (problems.length) {
    rec(false, "Konzole / výjimky / 5xx bez chyb", `${problems.length}×`);
  } else {
    rec(true, "Konzole / výjimky / 5xx bez chyb");
  }
  const fail = results.filter((r) => !r.ok);
  console.log("\n================ SOUHRN ================");
  console.log(`Kontrol: ${results.length} · PASS: ${results.length - fail.length} · FAIL: ${fail.length}`);
  if (fail.length) {
    console.log("\n--- NEÚSPĚŠNÉ ---");
    for (const f of fail) console.log(`FAIL  ${f.name} — ${f.detail}`);
  }
  if (problems.length) {
    console.log("\n--- KONZOLE / VÝJIMKY / 5xx ---");
    for (const p of [...new Set(problems)].slice(0, 40)) console.log("• " + p);
  }
  process.exit(fail.length ? 1 : 0);
}
