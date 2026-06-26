// E2E smoke test Mařeny — proklikání všech hlavních tlačítek a funkcí.
//
// Spuštění (v jiném terminálu musí běžet dev server):
//   npm run dev          # v jednom terminálu (http://localhost:3000)
//   npm run e2e          # v druhém terminálu
//
// Funguje i bez Redisu (demo režim přes localStorage) — přihlášení projde
// formátovým heslem „marena2026". Každý běh startuje v čistém kontextu, takže
// data se mezi běhy nehromadí.
//
// Konfigurace přes proměnné prostředí:
//   BASE_URL    – adresa appky (výchozí http://localhost:3000)
//   CHROME_PATH – cesta k Chromium/Chrome (jinak se zkusí najít automaticky)
//   E2E_SHOT    – kam uložit závěrečný screenshot (výchozí systémové temp)

import { chromium } from "playwright-core";
import { existsSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const BASE = process.env.BASE_URL || "http://localhost:3000";
const SHOT = process.env.E2E_SHOT || join(tmpdir(), "marena-e2e.png");

// Najdi spustitelný Chromium: env → předinstalované balíčky Playwrightu → default.
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
    /* root neexistuje – necháme Playwright vyřešit defaultně */
  }
  return undefined; // necháme Playwright použít vlastní stažený prohlížeč
}

const results = [];
const consoleErrors = [];
const pageErrors = [];
let current = "init";

function rec(ok, name, detail = "") {
  results.push({ ok, name, detail });
  console.log(`${ok ? "✅" : "❌"} ${name}${detail ? " — " + detail : ""}`);
}
async function step(name, fn) {
  current = name;
  try {
    await fn();
    rec(true, name);
  } catch (e) {
    rec(false, name, String(e.message || e).split("\n")[0].slice(0, 200));
  }
}

const browser = await chromium.launch({ executablePath: findChrome(), args: ["--no-sandbox"] });
// Viewport jde přepsat přes env E2E_W/E2E_H (kvůli testu na telefonu/tabletu).
const VW = Number(process.env.E2E_W) || 1400;
const VH = Number(process.env.E2E_H) || 1000;
const ctx = await browser.newContext({ viewport: { width: VW, height: VH } });
const page = await ctx.newPage();
page.on("console", (m) => {
  if (m.type() === "error") consoleErrors.push(`[${current}] ${m.text().slice(0, 200)}`);
});
page.on("pageerror", (e) => pageErrors.push(`[${current}] ${String(e).slice(0, 200)}`));

const sel = (s) => page.locator(s);
const byText = (t) => page.getByText(t, { exact: false });
async function clickText(t, opts = {}) {
  await page.getByText(t, { exact: false }).first().click(opts);
}

try {
  // ---------- HOMEPAGE ----------
  await step("Homepage načtení", async () => {
    await page.goto(BASE, { waitUntil: "networkidle" });
    await sel("h1").filter({ hasText: "MAŘENA" }).first().waitFor({ timeout: 8000 });
  });
  await step("Homepage: jazykový přepínač EN", async () => {
    await page.getByRole("button", { name: "English" }).first().click();
    await byText("What awaits you").first().waitFor({ timeout: 4000 });
  });
  await step("Homepage: zpět CZ", async () => {
    await page.getByRole("button", { name: "Čeština" }).first().click();
    await byText("Co tě na Mařeně čeká").first().waitFor({ timeout: 4000 });
  });
  await step("Homepage: jazykový přepínač DE", async () => {
    await page.getByRole("button", { name: "Deutsch" }).first().click();
    await page.waitForTimeout(400);
    await page.getByRole("button", { name: "Čeština" }).first().click();
    await byText("Co tě na Mařeně čeká").first().waitFor({ timeout: 4000 });
  });
  await step("Homepage: merch CTA odkaz na /merch", async () => {
    await page.locator('a[href="/merch"]').first().waitFor({ timeout: 4000 });
  });

  // ---------- PŘIHLÁŠENÍ ----------
  await step("Přihlášení: špatné heslo → chyba", async () => {
    await page.goto(`${BASE}/prihlaseni`, { waitUntil: "networkidle" });
    await page.getByPlaceholder("Heslo do zázemí").fill("spatne");
    await page.getByRole("button", { name: /vstoupit|přihlásit|odeslat/i }).first().click().catch(() => {});
    await page.waitForTimeout(800);
    if (!page.url().includes("prihlaseni")) throw new Error("špatné heslo pustilo dál");
  });
  await step("Přihlášení: správné heslo marena2026", async () => {
    await page.getByPlaceholder("Heslo do zázemí").fill("marena2026");
    await page.getByPlaceholder("Heslo do zázemí").press("Enter");
    await page.waitForURL(/\/zazemi/, { timeout: 8000 });
  });

  // ---------- IDENTITY GATE ----------
  await step("IdentityGate: neznámý e-mail nepustí", async () => {
    // Výchozí režim „Už mám účet" — neexistující e-mail musí dát chybu, ne pustit dál.
    await page.getByPlaceholder("E-mail").fill("neznamy@nikde.cz");
    await page.getByRole("button", { name: /vstoupit do zázemí/i }).click();
    await page.waitForTimeout(500);
    if (await page.getByRole("button", { name: /Přidat info/i }).count()) throw new Error("neznámý e-mail pustil dál");
  });
  await step("IdentityGate: správce Mařena jen jménem", async () => {
    // Správce se přihlásí jen jménem „Mařena" (žádný e-mail/telefon).
    await page.getByPlaceholder("E-mail").fill("Mařena");
    await page.getByRole("button", { name: /vstoupit do zázemí/i }).click();
    // „+ Přidat info" je na nástěnce viditelné na všech velikostech (nav je na mobilu schovaný v hamburgeru).
    await page.getByRole("button", { name: /Přidat info/i }).first().waitFor({ timeout: 6000 });
  });

  // ---------- NÁSTĚNKA ----------
  await step("Nástěnka: přidat příspěvek", async () => {
    await page.goto(`${BASE}/zazemi`, { waitUntil: "networkidle" });
    await clickText("Přidat info");
    await page.waitForTimeout(300);
    await page.getByPlaceholder(/Nadpis|Titulek|Co je nového|název/i).first().fill("E2E test příspěvek");
    await page.locator("textarea").first().fill("Tělo testovacího příspěvku");
    await page.getByRole("button", { name: /Přidat|Zveřejnit|Uložit|Publikovat/i }).last().click();
    await byText("E2E test příspěvek").first().waitFor({ timeout: 4000 });
  });

  // ---------- HLASOVÁNÍ ----------
  await step("Hlasování: vytvořit anketu", async () => {
    await page.goto(`${BASE}/zazemi/hlasovani`, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: /Nová anketa/i }).click();
    await page.getByPlaceholder(/Otázka/i).fill("E2E anketa?");
    const opts = page.getByPlaceholder(/Možnost/i);
    await opts.nth(0).fill("Áno");
    await opts.nth(1).fill("Ne");
    await page.getByRole("button", { name: /Vytvořit anketu/i }).click();
    await byText("E2E anketa?").first().waitFor({ timeout: 4000 });
  });
  await step("Hlasování: hlasovat + přehled", async () => {
    await clickText("Áno");
    await page.waitForTimeout(400);
    await page.getByRole("button", { name: /Přehled/i }).first().click();
    await byText("Kdo hlasoval za co").first().waitFor({ timeout: 3000 });
  });

  // ---------- TÝM & ROLE ----------
  await step("Tým & role: načtení", async () => {
    await page.goto(`${BASE}/zazemi/tym`, { waitUntil: "networkidle" });
    await byText("Tým & role").filter({ visible: true }).first().waitFor({ timeout: 5000 });
  });
  await step("Tým & role: vzít si roli (Grafik) → vedoucí", async () => {
    const card = page.locator(".card", { hasText: "Grafik" }).first();
    await card.getByRole("button", { name: /Vzít si/i }).first().click();
    await page.waitForTimeout(800);
    await byText("vedoucí").first().waitFor({ timeout: 3000 });
  });

  // ---------- PROVOZ ----------
  await step("Provoz: přidat směnu", async () => {
    await page.goto(`${BASE}/zazemi/provoz`, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: /Přidat směnu/i }).click();
    await page.getByPlaceholder(/Oblast/i).fill("Bar");
    await page.getByPlaceholder(/Co se dělá/i).fill("E2E výčep");
    await page.getByRole("button", { name: /Vytvořit směnu/i }).click();
    await byText("E2E výčep").first().waitFor({ timeout: 4000 });
  });
  await step("Provoz: přihlásit se na směnu", async () => {
    const card = page.locator(".card", { hasText: "E2E výčep" }).first();
    await card.getByRole("button", { name: /Přihlásit se/i }).click();
    await page.waitForTimeout(500);
  });

  // ---------- FINANCE + KASA ----------
  await step("Finance: přidat položku", async () => {
    await page.goto(`${BASE}/zazemi/finance`, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: /Přidat položku/i }).click();
    await page.getByPlaceholder(/Popis/i).first().fill("E2E výdaj");
    // „Částka (Kč)" je pole položky; samotná „Částka" je u výběru — proto specificky.
    await page.getByPlaceholder(/Částka.*Kč/i).first().fill("500");
    await page.getByRole("button", { name: /^Přidat$|Uložit|Přidat výdaj|Přidat položku/i }).last().click();
    // Položka se vykresluje 2× (mobil karta + desktop tabulka) — cílíme na viditelnou.
    await byText("E2E výdaj").filter({ visible: true }).first().waitFor({ timeout: 4000 });
  });
  await step("Finance: otevřít kasu", async () => {
    await page.getByRole("button", { name: /\+ Kasa/i }).click();
    await page.getByPlaceholder(/Bar, úterý|Označení/i).fill("E2E kasa");
    await page.getByPlaceholder(/např\. 2000/i).fill("1000");
    await page.getByRole("button", { name: /Otevřít kasu/i }).click();
    await byText("Kasa — E2E kasa").first().waitFor({ timeout: 4000 });
  });
  await step("Finance: uzavřít kasu → tržba do financí", async () => {
    const box = page.locator(".card", { hasText: "E2E kasa" }).first();
    await box.getByPlaceholder(/Večer v kase/i).fill("3000");
    await box.getByRole("button", { name: /Uzavřít a zapsat/i }).click();
    await page.waitForTimeout(600);
    await byText("zapsáno do financí").first().waitFor({ timeout: 4000 });
  });
  await step("Finance: výběr — přidat přispěvatele + vráceno", async () => {
    await page.getByRole("button", { name: /^\+ Výběr$/ }).click(); // odkryje vyplňovací řádek
    await page.waitForTimeout(200);
    const sec = page.locator("section#vyber");
    await sec.getByPlaceholder("Jméno a příjmení").fill("E2E Vkladatel");
    await sec.getByPlaceholder("Částka").fill("2000");
    await sec.getByRole("button", { name: /^\+ Přidat$/ }).click();
    await sec.getByText("E2E Vkladatel").first().waitFor({ timeout: 4000 });
    // označit vráceno (admin) → škrtnuté + badge „Vráceno"
    const row = sec.locator("li", { hasText: "E2E Vkladatel" }).first();
    await row.getByRole("button", { name: /Vrátit/ }).click();
    await page.waitForTimeout(400);
    await row.getByRole("button", { name: /Vráceno/ }).first().waitFor({ timeout: 3000 });
  });

  // ---------- MERCH (správa) ----------
  await step("Merch: přidat produkt se skladem", async () => {
    await page.goto(`${BASE}/zazemi/merch`, { waitUntil: "networkidle" });
    await page.getByPlaceholder(/Název/i).first().fill("E2E tričko");
    await page.getByPlaceholder(/Cena/i).first().fill("250");
    await page.getByPlaceholder(/Velikosti/i).fill("S, M, L");
    await page.getByPlaceholder(/Barvy/i).fill("černá, bílá");
    await page.getByRole("button", { name: /Přidat do nabídky/i }).click();
    await byText("E2E tričko").first().waitFor({ timeout: 4000 });
  });
  await step("Merch: nastavit skladem u produktu", async () => {
    const card = page.locator(".card", { hasText: "E2E tričko" }).first();
    const stockInput = card.getByPlaceholder("ks").first();
    await stockInput.fill("5");
    await stockInput.press("Enter");
    await page.waitForTimeout(500);
    await card.getByText(/zbývá 5/i).first().waitFor({ timeout: 3000 });
  });
  await step("Merch: QR odkaz přítomen", async () => {
    await byText("QR k objednání").first().waitFor({ timeout: 3000 });
  });

  // ---------- VEŘEJNÁ OBJEDNÁVKA ----------
  await step("Veřejná objednávka: načíst /merch/2026", async () => {
    await page.goto(`${BASE}/merch/2026`, { waitUntil: "networkidle" });
    await byText("E2E tričko").first().waitFor({ timeout: 5000 });
  });
  await step("Veřejná objednávka: vybrat a do košíku", async () => {
    const card = page.locator(".card", { hasText: "E2E tričko" }).first();
    await card.getByRole("button", { name: /Do košíku/i }).click();
    await page.waitForTimeout(400);
    await byText("1× E2E tričko").first().waitFor({ timeout: 3000 });
  });
  await step("Veřejná objednávka: vyžaduje jméno+telefon+email", async () => {
    await page.getByRole("button", { name: /^Objednat$/i }).click();
    await page.waitForTimeout(300);
    await byText(/Vyplň prosím jméno|Vyplň telefon|Vyplň e-mail/i).first().waitFor({ timeout: 3000 });
  });
  await step("Veřejná objednávka: odeslat", async () => {
    await page.getByPlaceholder(/Jméno a příjmení/i).fill("Test Kupující");
    await page.getByPlaceholder(/Telefon/i).fill("+420600600600");
    await page.getByPlaceholder("E-mail").fill("kupujici@test.cz");
    await page.getByRole("button", { name: /^Objednat$/i }).click();
    await byText(/objednávka odeslána/i).first().waitFor({ timeout: 5000 });
  });

  // ---------- MERCH: OBJEDNÁVKA + VYŘÍZENO → FINANCE ----------
  await step("Merch: objednávka dorazila do zázemí", async () => {
    await page.goto(`${BASE}/zazemi/merch`, { waitUntil: "networkidle" });
    await byText("Test Kupující").first().waitFor({ timeout: 5000 });
  });
  await step("Merch: označit Vyřízeno → finance", async () => {
    const row = page.locator(".card", { hasText: "Test Kupující" }).first();
    await row.getByRole("button", { name: /Čeká/i }).click();
    await page.waitForTimeout(600);
    await row.getByText(/Vyřízeno/i).first().waitFor({ timeout: 3000 });
  });
  await step("Finance: merch příjem zapsán", async () => {
    await page.goto(`${BASE}/zazemi/finance`, { waitUntil: "networkidle" });
    await byText("Merch — Test Kupující").filter({ visible: true }).first().waitFor({ timeout: 5000 });
  });

  // ---------- KALENDÁŘ ----------
  await step("Kalendář: přidat událost", async () => {
    await page.goto(`${BASE}/zazemi/kalendar`, { waitUntil: "networkidle" });
    await page.getByPlaceholder("Co se děje?").fill("E2E událost");
    await page.getByRole("button", { name: /Přidat do kalendáře/i }).click();
    await byText("E2E událost").first().waitFor({ timeout: 4000 });
  });

  // ---------- ÚKOLY ----------
  await step("Úkoly: přidat úkol", async () => {
    await page.goto(`${BASE}/zazemi/ukoly`, { waitUntil: "networkidle" });
    await page.getByPlaceholder(/Nový úkol/i).fill("E2E úkol");
    await page.getByRole("button", { name: /Přidat úkol/i }).click();
    await byText("E2E úkol").first().waitFor({ timeout: 4000 });
  });
  await step("Úkoly: odškrtnout hotovo", async () => {
    const row = page.locator("li", { hasText: "E2E úkol" }).first();
    // .click() (ne .check()) — položka se po odškrtnutí odpojí z filtru „Nehotové".
    await row.locator('input[type="checkbox"]').click();
    await page.waitForTimeout(500);
    await page.getByRole("button", { name: /^Hotové$/ }).click();
    await byText("E2E úkol").first().waitFor({ timeout: 3000 });
  });

  // ---------- KONTAKTY ----------
  await step("Kontakty: přidat kontakt", async () => {
    await page.goto(`${BASE}/zazemi/kontakty`, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: /Přidat kontakt/i }).click();
    await page.getByPlaceholder(/^Název/).fill("E2E kontakt");
    await page.getByPlaceholder(/Odkaz \/ e-mail \/ telefon/i).fill("test@e2e.cz");
    await page.getByRole("button", { name: /Uložit kontakt/i }).click();
    await byText("E2E kontakt").first().waitFor({ timeout: 4000 });
  });

  // ---------- PROGRAM ----------
  await step("Program: přidat pozvánku", async () => {
    await page.goto(`${BASE}/zazemi/program`, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: /Přidat do programu/i }).click();
    await page.getByPlaceholder(/Kategorie/i).fill("Kapely");
    await page.getByPlaceholder(/Kdo\?/i).first().fill("E2E kapela");
    await page.getByRole("button", { name: /^Přidat$/ }).first().click();
    await byText("E2E kapela").filter({ visible: true }).first().waitFor({ timeout: 4000 });
  });

  // ---------- FINANCE: FILTRY ----------
  await step("Finance: přepínání filtrů nepadá", async () => {
    await page.goto(`${BASE}/zazemi/finance`, { waitUntil: "networkidle" });
    for (const t of ["Příjmy", "Výdaje", "Nezaplacené", "Merch", "Kasy", "Vše"]) {
      await page.getByRole("button", { name: t, exact: true }).first().click();
      await page.waitForTimeout(150);
    }
    await byText("Všechny finance").first().waitFor({ timeout: 3000 });
  });

  // ---------- MERCH: ÚPRAVA PRODUKTU ----------
  await step("Merch: upravit cenu produktu", async () => {
    await page.goto(`${BASE}/zazemi/merch`, { waitUntil: "networkidle" });
    const card = page.locator(".card", { hasText: "E2E tričko" }).first();
    await card.getByRole("button", { name: /^Upravit$/ }).click();
    const dialog = page.getByRole("dialog");
    await dialog.waitFor({ timeout: 3000 });
    await dialog.locator("input").nth(1).fill("300");
    await dialog.getByRole("button", { name: /^Uložit$/ }).click();
    await page.waitForTimeout(500);
    await page.locator(".card", { hasText: "E2E tričko" }).first().getByText(/300/).first().waitFor({ timeout: 3000 });
  });

  // ---------- KONTAKTY: SMAZÁNÍ (potvrzovací tok) ----------
  await step("Kontakty: smazat kontakt (dvě kliknutí)", async () => {
    await page.goto(`${BASE}/zazemi/kontakty`, { waitUntil: "networkidle" });
    const row = page.locator("li", { hasText: "E2E kontakt" }).first();
    await row.getByRole("button", { name: "Smazat" }).click();
    await row.getByRole("button", { name: /Opravdu/i }).click();
    await page.waitForTimeout(500);
    if (await page.getByText("E2E kontakt").count()) throw new Error("kontakt se nesmazal");
  });

  // ---------- OSTATNÍ STRÁNKY (načtení bez chyb) ----------
  for (const [path, txt] of [
    ["/zazemi/kuchyne", "Kuchyně"],
    ["/zazemi/almanach", ""],
  ]) {
    await step(`Stránka ${path} se načte`, async () => {
      await page.goto(`${BASE}${path}`, { waitUntil: "networkidle" });
      await page.waitForTimeout(400);
      if (txt) await byText(txt).filter({ visible: true }).first().waitFor({ timeout: 4000 });
    });
  }

  // ---------- ODHLÁŠENÍ ----------
  await step("Odhlášení funguje", async () => {
    await page.goto(`${BASE}/zazemi`, { waitUntil: "networkidle" });
    const logout = page.getByRole("button", { name: /Odhlásit/i }).first();
    if (await logout.count()) {
      await logout.click();
      await page.waitForTimeout(600);
    }
  });
} catch (e) {
  rec(false, "FATÁLNÍ: " + current, String(e.message || e).slice(0, 200));
} finally {
  await page.screenshot({ path: SHOT }).catch(() => {});
  await browser.close();
  const fail = results.filter((r) => !r.ok);
  console.log("\n================ SOUHRN ================");
  console.log(`Kroků: ${results.length} · OK: ${results.length - fail.length} · CHYB: ${fail.length}`);
  if (fail.length) {
    console.log("\n--- NEÚSPĚŠNÉ ---");
    for (const f of fail) console.log(`❌ ${f.name} — ${f.detail}`);
  }
  if (pageErrors.length) {
    console.log("\n--- JS VÝJIMKY NA STRÁNCE ---");
    for (const e of [...new Set(pageErrors)]) console.log("⚠️ " + e);
  }
  // Pozn.: 503 /api/db (demo režim bez Redisu), 401 (test špatného hesla)
  // a externí QR obrázek bez sítě jsou očekávané — nejde o chyby appky.
  if (consoleErrors.length) {
    console.log("\n--- CONSOLE (info, vč. očekávaných 503/401) ---");
    for (const e of [...new Set(consoleErrors)].slice(0, 25)) console.log("• " + e);
  }
  console.log(`\nScreenshot: ${SHOT}`);
  process.exit(fail.length || pageErrors.length ? 1 : 0);
}
