// E2E test oblasti „Termíny a revize" (BULO — kniha domu).
//
// Proklikává termíny u nemovitosti (stav, prvek, lhůta, „Provedeno", přidání/úprava/smazání),
// export do kalendáře (.ics), stránky /pripominky a /kalendar, upozornění v prohlížeči,
// „Vyžaduje pozornost" na /prehled, zpětnou kompatibilitu starých dat a telefonní šířku.
//
// Spuštění (dev server musí běžet):
//   node e2e/terminy.e2e.mjs
//
// Konfigurace přes proměnné prostředí:
//   BASE_URL – adresa appky (výchozí http://127.0.0.1:3100)
//   E2E_TZ   – časové pásmo prohlížeče (výchozí Europe/Prague); kvůli chybám s datem
//              stojí za to pustit i s Pacific/Kiritimati (UTC+14) a Pacific/Pago_Pago (UTC−11)
//
// Každý blok běží v novém kontextu prohlížeče (= jiné zařízení, čistý localStorage
// s ukázkovými daty). Dnešní datum bere z hodin stroje; ukázková data počítají s tím,
// že revize kotle (12. 10. 2026) je po termínu.

import { createRequire } from "node:module";
import { readFileSync } from "node:fs";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const BASE = (process.env.BASE_URL || "http://127.0.0.1:3100").replace(/\/$/, "");
const DESKTOP = { viewport: { width: 1280, height: 800 } };
const PHONE = { viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true };
const STORE_KEY = "domovni-pas-v1";
const TZ = process.env.E2E_TZ || "Europe/Prague";

// ---------- Datumy (v časovém pásmu prohlížeče) ----------
function addDaysIso(date, n) {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
}
function diffDays(a, b) {
  return Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 86_400_000);
}
// „20. října 2026" — stejně jako formatDay v appce (cs-CZ, dlouhý měsíc)
function czDay(date) {
  return new Intl.DateTimeFormat("cs-CZ", { day: "numeric", month: "long", year: "numeric" }).format(
    new Date(`${date}T00:00:00`),
  );
}
// „dnes" tak, jak ho vidí prohlížeč v pásmu TZ (en-CA = YYYY-MM-DD)
const TODAY = new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(new Date());
const KOTEL_LATE = diffDays("2026-10-12", TODAY); // o kolik dní je revize kotle po termínu
const daysCs = (n) => `${n} ${n === 1 ? "den" : n >= 2 && n <= 4 ? "dny" : "dní"}`;
const IN10 = addDaysIso(TODAY, 10);
const IN200 = addDaysIso(TODAY, 200);
const DONE_DATE = "2026-10-20"; // provedení revize kotle
const NEXT_DUE = "2027-10-20"; // + 12 měsíců od data provedení

// ---------- Výsledky ----------
const results = [];
const pageErrors = [];
const consoleErrors = [];
const serverErrors = [];
let current = "init";

function rec(ok, name, detail = "") {
  results.push({ ok, name, detail });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? " — " + detail : ""}`);
}
function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}
// Console chyby, které nejsou chybou appky (4xx zdroje řeší jiné kontroly)
function isBenignConsole(text) {
  return /Failed to load resource: the server responded with a status of 4\d\d/.test(text) || /favicon/i.test(text);
}
// Krok: selže při výjimce i při nové JS výjimce / React chybě / 5xx během kroku
async function step(name, fn) {
  current = name;
  const before = {
    pe: pageErrors.length,
    ce: consoleErrors.length,
    se: serverErrors.length,
  };
  try {
    await fn();
    const newPe = pageErrors.slice(before.pe);
    const newCe = consoleErrors.slice(before.ce).filter((t) => !isBenignConsole(t));
    const newSe = serverErrors.slice(before.se);
    if (newPe.length) throw new Error(`JS výjimka na stránce: ${newPe[0]}`);
    if (newSe.length) throw new Error(`5xx odpověď: ${newSe[0]}`);
    if (newCe.length) throw new Error(`console.error: ${newCe[0]}`);
    rec(true, name);
  } catch (e) {
    rec(false, name, String(e.message || e).split("\n")[0].slice(0, 300));
  }
}

const browser = await chromium.launch();
const contexts = [];

async function newPage(kind, label, opts = {}) {
  const ctx = await browser.newContext({
    ...(kind === "phone" ? PHONE : DESKTOP),
    locale: "cs-CZ",
    timezoneId: TZ,
    acceptDownloads: true,
  });
  contexts.push(ctx);
  if (opts.grant) await ctx.grantPermissions(["notifications"], { origin: BASE });
  for (const s of opts.initScripts ?? []) await ctx.addInitScript(s.fn, s.arg);
  const page = await ctx.newPage();
  page.on("console", (m) => {
    if (m.type() === "error") consoleErrors.push(`[${label} · ${current}] ${m.text().slice(0, 300)}`);
  });
  page.on("pageerror", (e) => pageErrors.push(`[${label} · ${current}] ${String(e.message || e).slice(0, 300)}`));
  page.on("response", (r) => {
    if (r.status() >= 500 && r.url().startsWith(BASE)) {
      serverErrors.push(`[${label} · ${current}] ${r.status()} ${r.request().method()} ${r.url()}`);
    }
  });
  // potvrzovací dialogy (smazání) — výchozí odpověď „ano"
  page.on("dialog", (d) => d.accept().catch(() => {}));
  return { ctx, page };
}

async function login(page, password = "klient") {
  await page.goto(`${BASE}/prihlaseni`);
  const pw = page.locator('input[name="password"]');
  await pw.fill(password);
  await pw.press("Enter");
  await page.waitForURL(/\/prehled/, { timeout: 20000 });
  await page.getByRole("heading", { level: 1 }).first().waitFor({ timeout: 20000 });
}

// Načtení stránky appky (po hydrataci je vidět nadpis h1)
async function open(page, path) {
  const resp = await page.goto(`${BASE}${path}`);
  assert(!resp || resp.status() < 500, `${path}: HTTP ${resp && resp.status()}`);
  await page.getByRole("heading", { level: 1 }).first().waitFor({ timeout: 20000 });
}

// Na telefonu stránka nesmí přetékat do strany
async function assertNoOverflow(page, where) {
  const r = await page.evaluate(() => {
    const iw = window.innerWidth;
    const sw = document.documentElement.scrollWidth;
    const culprits = [];
    if (sw > iw + 1) {
      for (const el of document.querySelectorAll("body *")) {
        const b = el.getBoundingClientRect();
        if (b.right > iw + 1 && b.width > 0) {
          culprits.push(
            `${el.tagName.toLowerCase()}.${String(el.className).split(" ").slice(0, 3).join(".")} (${Math.round(b.right)}px) „${(el.textContent || "").trim().slice(0, 30)}"`,
          );
          if (culprits.length >= 3) break;
        }
      }
    }
    return { iw, sw, culprits };
  });
  assert(
    r.sw <= r.iw + 1,
    `${where}: vodorovné přetečení (scrollWidth ${r.sw} > innerWidth ${r.iw}); ${r.culprits.join(" | ")}`,
  );
}

async function readStore(page) {
  return page.evaluate((k) => JSON.parse(localStorage.getItem(k) || "[]"), STORE_KEY);
}

// Otevřené termíny viditelné pro klienta (stejné pravidlo jako canSeeProperty pro CLIENT)
function openRemindersForClient(props) {
  const out = [];
  for (const p of props) {
    const created = p.createdByRole ?? "CLIENT";
    if (!(created === "CLIENT" || p.handedOver)) continue;
    for (const r of p.reminders ?? []) if (!r.done && r.dueDate) out.push({ r, p });
  }
  return out;
}

// ---------- Kontrola .ics (RFC 5545) ----------
function unescapeIcs(v) {
  return v.replace(/\\([\\;,nN])/g, (_, c) => (c === "n" || c === "N" ? "\n" : c));
}
function parseAndCheckIcs(buf, label) {
  const text = buf.toString("utf8");
  assert(text.length > 0, `${label}: prázdný soubor`);
  // CRLF všude: žádné samotné \n ani \r
  assert(!/(^|[^\r])\n/.test(text), `${label}: řádek ukončený jen LF (chybí CRLF)`);
  assert(!/\r(?!\n)/.test(text), `${label}: samotné CR`);
  assert(text.endsWith("\r\n"), `${label}: soubor nekončí CRLF`);
  const physical = text.split("\r\n").slice(0, -1);
  for (const [i, line] of physical.entries()) {
    const bytes = Buffer.byteLength(line, "utf8");
    assert(bytes <= 75, `${label}: řádek ${i + 1} má ${bytes} oktetů (> 75): ${line.slice(0, 40)}…`);
    assert(line.length > 0, `${label}: prázdný řádek ${i + 1}`);
  }
  // Pokračovací řádky začínají mezerou a nerozdělují vícebajtový znak (UTF-8 je platné)
  assert(!text.includes("�"), `${label}: rozbité UTF-8 (rozdělený vícebajtový znak)`);
  const unfolded = text.replace(/\r\n[ \t]/g, "");
  const lines = unfolded.split("\r\n").filter(Boolean);
  assert(lines[0] === "BEGIN:VCALENDAR", `${label}: první řádek není BEGIN:VCALENDAR`);
  assert(lines.at(-1) === "END:VCALENDAR", `${label}: poslední řádek není END:VCALENDAR`);
  assert(lines.includes("VERSION:2.0"), `${label}: chybí VERSION:2.0`);
  assert(lines.some((l) => /^PRODID:.+/.test(l)), `${label}: chybí PRODID`);

  const events = [];
  let ev = null;
  let inAlarm = false;
  for (const l of lines) {
    if (l === "BEGIN:VEVENT") {
      ev = { props: {}, alarm: null };
      continue;
    }
    if (l === "END:VEVENT") {
      events.push(ev);
      ev = null;
      continue;
    }
    if (!ev) continue;
    if (l === "BEGIN:VALARM") {
      inAlarm = true;
      ev.alarm = {};
      continue;
    }
    if (l === "END:VALARM") {
      inAlarm = false;
      continue;
    }
    const idx = l.indexOf(":");
    const name = l.slice(0, idx);
    const value = l.slice(idx + 1);
    (inAlarm ? ev.alarm : ev.props)[name] = value;
  }
  for (const e of events) {
    const uid = e.props.UID ?? "";
    assert(uid.endsWith("@bulo"), `${label}: UID „${uid}" nekončí @bulo`);
    assert(/^\d{8}$/.test(e.props["DTSTART;VALUE=DATE"] ?? ""), `${label}: ${uid} nemá DTSTART;VALUE=DATE:YYYYMMDD`);
    assert(e.alarm, `${label}: ${uid} nemá VALARM`);
    assert(/^-P\d+D$/.test(e.alarm.TRIGGER ?? ""), `${label}: ${uid} TRIGGER „${e.alarm.TRIGGER}" není -P<n>D`);
    for (const k of ["SUMMARY", "DESCRIPTION"]) {
      const v = e.props[k];
      if (v == null) continue;
      // v TEXT hodnotě nesmí být neescapovaná čárka / středník
      assert(!/(^|[^\\])[,;]/.test(v.replace(/\\\\/g, "")), `${label}: ${uid} ${k} má neescapovanou čárku/středník`);
    }
    e.summary = unescapeIcs(e.props.SUMMARY ?? "");
    e.description = unescapeIcs(e.props.DESCRIPTION ?? "");
    e.uid = uid;
  }
  return { text, unfolded, lines, events };
}

async function downloadFrom(page, locator) {
  const [dl] = await Promise.all([page.waitForEvent("download", { timeout: 10000 }), locator.click()]);
  const path = await dl.path();
  return { name: dl.suggestedFilename(), buf: readFileSync(path) };
}

// ---------- Lokátory sekce „Termíny a revize" ----------
const sectionOf = (page) => page.locator("section#terminy");
const openItems = (page) => sectionOf(page).locator("xpath=./ul/li");
const itemByTitle = (page, title) =>
  openItems(page).filter({ has: page.getByText(title, { exact: true }) }).first();

async function openItemsSummary(page) {
  return openItems(page).evaluateAll((lis) =>
    lis.map((li) => ({
      title: li.querySelector("p")?.textContent?.trim() ?? "",
      state: li.querySelector("div > span")?.textContent?.trim() ?? "",
    })),
  );
}

// Stub Notification: počítá vytvořená upozornění (přes reload v localStorage).
// perm = počáteční stav povolení, answer = co vrátí requestPermission.
function notificationStub({ perm, answer }) {
  let current = perm;
  const bump = (k) => {
    try {
      localStorage.setItem(k, String(Number(localStorage.getItem(k) || "0") + 1));
    } catch {
      /* ignore */
    }
  };
  class FakeNotification {
    constructor(title, options) {
      bump("__e2e_notif_count");
      try {
        localStorage.setItem("__e2e_notif_last", JSON.stringify({ title, body: options && options.body }));
      } catch {
        /* ignore */
      }
      this.onclick = null;
    }
    close() {}
    static get permission() {
      return current;
    }
    static requestPermission(cb) {
      bump("__e2e_notif_requests");
      current = answer;
      if (cb) cb(answer);
      return Promise.resolve(answer);
    }
  }
  window.Notification = FakeNotification;
}

try {
  // =====================================================================
  // DESKTOP — majitel (klient), Rodinný dům Říčany
  // =====================================================================
  const { page } = await newPage("desktop", "desktop");

  await step("Přihlášení jako klient", async () => {
    await login(page, "klient");
  });

  await step("/prehled: „Vyžaduje pozornost“ obsahuje revizi kotle s názvem prvku", async () => {
    const card = page.locator("section", { has: page.getByRole("heading", { name: "Vyžaduje pozornost" }) });
    await card.waitFor({ timeout: 10000 });
    const row = card.locator("li", { hasText: "Plynový kotel — Revize plynového kotle" });
    await row.first().waitFor({ timeout: 5000 });
    const href = await row.first().getByRole("link").getAttribute("href");
    assert(href === "/nemovitost/demo-dum#terminy", `odkaz z pozornosti: ${href}`);
    const txt = await row.first().innerText();
    assert(txt.includes(`Po termínu o ${daysCs(KOTEL_LATE)}`), `čekal jsem „Po termínu o ${daysCs(KOTEL_LATE)}", je: ${txt.replace(/\s+/g, " ")}`);
    assert(/Rodinný dům Říčany/.test(txt), "chybí název nemovitosti");
  });

  await step("/prehled → klik na revizi kotle skočí rovnou na „Termíny a revize“", async () => {
    await page.getByText("Plynový kotel — Revize plynového kotle").first().click();
    await page.waitForURL(/\/nemovitost\/demo-dum#terminy$/, { timeout: 10000 });
    await sectionOf(page).waitFor({ timeout: 10000 });
    await page.waitForTimeout(500);
    const top = await sectionOf(page).evaluate((el) => el.getBoundingClientRect().top);
    assert(top >= 0 && top < 400, `sekce termínů není v zorném poli (top ${Math.round(top)} px)`);
  });

  await step("Nemovitost: sekce „Termíny a revize“ se načte", async () => {
    await open(page, "/nemovitost/demo-dum");
    await sectionOf(page).getByRole("heading", { name: "Termíny a revize" }).waitFor({ timeout: 10000 });
    await itemByTitle(page, "Revize plynového kotle").waitFor({ timeout: 5000 });
  });

  await step("Revize kotle: stav „Po termínu“, prvek, lhůta potvrzená technikem, naposledy", async () => {
    const it = itemByTitle(page, "Revize plynového kotle");
    const txt = (await it.innerText()).replace(/\s+/g, " ");
    assert(txt.includes("Po termínu"), `chybí „Po termínu": ${txt}`);
    const el = it.getByRole("link", { name: "Plynový kotel", exact: true });
    assert((await el.count()) === 1, "chybí odkaz na prvek „Plynový kotel“");
    const href = await el.getAttribute("href");
    assert(href === "/nemovitost/demo-dum/prvek/demo-el-kotel", `špatný odkaz na prvek: ${href}`);
    assert(txt.includes("každých 12 měsíců"), `chybí „každých 12 měsíců": ${txt}`);
    assert(/potvrdil revizní technik/.test(txt), `chybí potvrzení lhůty technikem: ${txt}`);
    assert(txt.includes(`Naposledy ${czDay("2025-10-12")}`), `chybí datum posledního provedení: ${txt}`);
    assert(txt.includes(`Další termín ${czDay("2026-10-12")}`), `chybí další termín: ${txt}`);
    assert(txt.includes(`Po termínu o ${daysCs(KOTEL_LATE)}`), `chybí relativní text: ${txt}`);
    await sectionOf(page).getByText("2 po termínu").first().waitFor({ timeout: 3000 });
  });

  await step("Řazení: nejdřív po termínu, pak podle data", async () => {
    const rows = await openItemsSummary(page);
    const order = { "Po termínu": 0, "Blíží se": 1, "V pořádku": 2 };
    for (let i = 1; i < rows.length; i++) {
      assert(
        (order[rows[i - 1].state] ?? 9) <= (order[rows[i].state] ?? 9),
        `špatné pořadí: ${rows.map((r) => `${r.title} [${r.state}]`).join(", ")}`,
      );
    }
    assert(rows[0].state === "Po termínu", `první položka není po termínu: ${rows[0].title}`);
    const titles = rows.map((r) => r.title);
    assert(
      titles.indexOf("Revize komínu") < titles.indexOf("Revize plynového kotle"),
      `starší termín po termínu má být první: ${titles.join(", ")}`,
    );
  });

  await step("„Nahrát protokol (AI)“ vede na z-dokladu s ?termin=s-r1", async () => {
    const link = itemByTitle(page, "Revize plynového kotle").getByRole("link", { name: /Nahrát protokol \(AI\)/ });
    const href = await link.getAttribute("href");
    // jen ?termin= (prvek se doplní z termínu; po potvrzení zpět na nemovitost, ne na prvek)
    assert(href === "/nemovitost/demo-dum/zaznam/z-dokladu?termin=s-r1", `špatný odkaz: ${href}`);
  });

  // ---------- Přidat termín ----------
  const T1 = "Kontrola hasicího přístroje, kuchyň; garáž";
  const T2 = "Revize elektroinstalace";
  const T3 = "Dočasný termín ke smazání";
  const TECH = "Ing. Jan Elektrikář, ev. č. 45/2019";

  async function openAddForm() {
    await sectionOf(page).getByRole("button", { name: "Přidat termín" }).click();
    const form = sectionOf(page).locator("form");
    await form.waitFor({ timeout: 3000 });
    return form;
  }

  await step("Přidat termín: bez data se neuloží (validace)", async () => {
    const before = await openItems(page).count();
    const form = await openAddForm();
    await form.getByLabel("Co se má udělat *").fill(T1);
    await form.getByRole("button", { name: "Přidat termín" }).click();
    await form.getByRole("alert").filter({ hasText: "Zadejte datum dalšího termínu." }).waitFor({ timeout: 3000 });
    assert((await openItems(page).count()) === before, "termín bez data se uložil");
  });

  await step("Přidat termín: jednorázový, prvek, za 10 dní, upozornit 30 → „Blíží se“", async () => {
    const form = sectionOf(page).locator("form");
    await form.getByLabel("Prvek domu").selectOption({ label: "Okruh zásuvek — kuchyň (Kuchyň)" }).catch(async () => {
      await form.getByLabel("Prvek domu").selectOption("demo-el-okruh-kuchyn");
    });
    await form.getByLabel("Další termín *").fill(IN10);
    await form.getByLabel("Upozornit předem").selectOption("30");
    await form.getByRole("button", { name: "Přidat termín" }).click();
    await sectionOf(page).getByRole("status").filter({ hasText: `Termín „${T1}“ přidán.` }).waitFor({ timeout: 3000 });
    const it = itemByTitle(page, T1);
    const txt = (await it.innerText()).replace(/\s+/g, " ");
    assert(txt.includes("Blíží se"), `čekal jsem „Blíží se": ${txt}`);
    assert(txt.includes("Za 10 dní"), `chybí „Za 10 dní": ${txt}`);
    assert(!/každ[ýéi]/.test(txt), `jednorázový termín ukazuje lhůtu: ${txt}`);
    assert(txt.includes("jednorázový termín"), `chybí „jednorázový termín": ${txt}`);
    assert(!/potvrdil revizní technik/.test(txt), `nepotvrzená lhůta se tváří jako potvrzená: ${txt}`);
    assert(txt.includes("Okruh zásuvek — kuchyň"), `chybí prvek: ${txt}`);
    assert(txt.includes("30 dní předem"), `chybí „30 dní předem": ${txt}`);
  });

  await step("Přidat termín: s lhůtou + „Lhůtu potvrdil revizní technik“ + jméno", async () => {
    const form = await openAddForm();
    await form.getByLabel("Co se má udělat *").fill(T2);
    await form.getByLabel("Prvek domu").selectOption("demo-el-rozvadec");
    await form.getByLabel("Další termín *").fill(IN200);
    await form.getByLabel("Lhůta opakování (měsíce)").fill("48");
    await form.getByText("Opakuje se každých 48 měsíců (4 roky).").waitFor({ timeout: 3000 });
    await form.getByLabel("Lhůtu potvrdil revizní technik").check();
    await form.getByLabel("Kdo lhůtu potvrdil").fill(TECH);
    await form.getByLabel("Upozornit předem").selectOption("60");
    await form.getByRole("button", { name: "Přidat termín" }).click();
    await sectionOf(page).getByRole("status").filter({ hasText: `Termín „${T2}“ přidán.` }).waitFor({ timeout: 3000 });
    const txt = (await itemByTitle(page, T2).innerText()).replace(/\s+/g, " ");
    assert(txt.includes("V pořádku"), `čekal jsem „V pořádku": ${txt}`);
    assert(txt.includes("každých 48 měsíců (4 roky)"), `chybí lhůta: ${txt}`);
    assert(txt.includes(`potvrdil revizní technik — ${TECH}`), `chybí potvrzení + jméno: ${txt}`);
    assert(txt.includes("Hlavní rozvaděč"), `chybí prvek: ${txt}`);
  });

  await step("Přidat termín: lhůta bez potvrzení → „lhůta nepotvrzená“ (nic se nevymýšlí)", async () => {
    const form = await openAddForm();
    await form.getByLabel("Co se má udělat *").fill(T3);
    await form.getByLabel("Další termín *").fill(IN200);
    await form.getByLabel("Lhůta opakování (měsíce)").fill("6");
    await form.getByRole("button", { name: "Přidat termín" }).click();
    await sectionOf(page).getByRole("status").filter({ hasText: `Termín „${T3}“ přidán.` }).waitFor({ timeout: 3000 });
    const txt = (await itemByTitle(page, T3).innerText()).replace(/\s+/g, " ");
    assert(txt.includes("každých 6 měsíců"), `chybí lhůta: ${txt}`);
    assert(txt.includes("lhůta nepotvrzená"), `chybí upozornění na nepotvrzenou lhůtu: ${txt}`);
  });

  await step("Upravit termín: změna názvu a upozornění", async () => {
    const it = itemByTitle(page, T3);
    await it.getByRole("button", { name: "Upravit" }).click();
    const form = it.locator("form");
    await form.waitFor({ timeout: 3000 });
    assert((await form.getByLabel("Co se má udělat *").inputValue()) === T3, "formulář úpravy není předvyplněný");
    assert((await form.getByLabel("Lhůta opakování (měsíce)").inputValue()) === "6", "lhůta není předvyplněná");
    await form.getByLabel("Co se má udělat *").fill(`${T3} (upraveno)`);
    await form.getByLabel("Upozornit předem").selectOption("7");
    await form.getByRole("button", { name: "Uložit změny" }).click();
    const edited = itemByTitle(page, `${T3} (upraveno)`);
    await edited.waitFor({ timeout: 3000 });
    const txt = (await edited.innerText()).replace(/\s+/g, " ");
    assert(txt.includes("7 dní předem"), `upozornění se nezměnilo: ${txt}`);
    assert((await itemByTitle(page, T3).count()) === 0 || !(await page.getByText(T3, { exact: true }).count()), "zůstal starý název");
  });

  await step("Smazat termín (s potvrzením)", async () => {
    const it = itemByTitle(page, `${T3} (upraveno)`);
    await it.getByRole("button", { name: "Smazat termín" }).click();
    await page.waitForTimeout(300);
    assert((await page.getByText(`${T3} (upraveno)`, { exact: true }).count()) === 0, "termín se nesmazal");
    const store = await readStore(page);
    const dum = store.find((p) => p.id === "demo-dum");
    assert(!dum.reminders.some((r) => r.title.startsWith(T3)), "termín zůstal v úložišti");
  });

  // ---------- .ics u nemovitosti ----------
  await step(".ics u nemovitosti („Do kalendáře“): formát, zalomení, VALARM, escapování, čeština", async () => {
    const btn = sectionOf(page).getByRole("button", { name: /Do kalendáře/ });
    const { name, buf } = await downloadFrom(page, btn);
    assert(name === "bulo-terminy-rodinny-dum-ricany.ics", `název souboru: ${name}`);
    const ics = parseAndCheckIcs(buf, "nemovitost.ics");
    const store = await readStore(page);
    const dum = store.find((p) => p.id === "demo-dum");
    const openRem = dum.reminders.filter((r) => !r.done);
    assert(ics.events.length === openRem.length, `VEVENTů ${ics.events.length}, otevřených termínů ${openRem.length}`);
    for (const r of openRem) {
      const e = ics.events.find((x) => x.uid === `${r.id}@bulo`);
      assert(e, `chybí VEVENT pro ${r.title}`);
      assert(e.props["DTSTART;VALUE=DATE"] === r.dueDate.replace(/-/g, ""), `${r.title}: špatné DTSTART`);
      assert(e.alarm.TRIGGER === `-P${r.notifyDaysBefore ?? 30}D`, `${r.title}: TRIGGER ${e.alarm.TRIGGER}`);
    }
    const kotel = ics.events.find((e) => e.uid === "s-r1@bulo");
    assert(kotel.summary === "Revize plynového kotle — Rodinný dům Říčany", `SUMMARY: ${kotel.summary}`);
    assert(kotel.description.includes("Prvek: Plynový kotel"), `DESCRIPTION bez prvku: ${kotel.description}`);
    assert(kotel.description.includes("Opakování: každých 12 měsíců"), `DESCRIPTION bez lhůty: ${kotel.description}`);
    assert(kotel.description.includes("Naposledy provedeno: "), `DESCRIPTION bez posledního provedení`);
    assert(kotel.description.split("\n").length >= 3, "DESCRIPTION nemá zachované řádky");
    const t1 = ics.events.find((e) => e.summary.startsWith(T1));
    assert(t1, "chybí událost s čárkou a středníkem v názvu");
    assert(t1.props.SUMMARY.startsWith("Kontrola hasicího přístroje\\, kuchyň\\; garáž"), `neescapovaný SUMMARY: ${t1.props.SUMMARY}`);
    assert(t1.summary === `${T1} — Rodinný dům Říčany`, `SUMMARY po unescapu: ${t1.summary}`);
    const t2 = ics.events.find((e) => e.summary.startsWith(T2));
    assert(t2.description.includes(`potvrdil: ${TECH}`), `DESCRIPTION bez technika: ${t2.description}`);
    assert(t2.alarm.TRIGGER === "-P60D", `TRIGGER u T2: ${t2.alarm.TRIGGER}`);
    assert(ics.lines.includes("X-WR-CALNAME:BULO – termíny a revize"), "chybí/rozbitý název kalendáře");
    // dlouhé řádky s diakritikou musely být zalomené
    assert(/\r\n /.test(ics.text), "žádný řádek nebyl zalomený (DESCRIPTION je delší než 75 oktetů)");
  });

  // ---------- Provedeno: opakovaná revize kotle ----------
  await step("„Provedeno“ u revize kotle: 20. 10. 2026 + zápis do historie", async () => {
    const entriesBefore = await page.locator("ol > li", { has: page.getByRole("heading", { name: "Revize plynového kotle", level: 3 }) }).count();
    const it = itemByTitle(page, "Revize plynového kotle");
    await it.getByRole("button", { name: "Provedeno" }).click();
    const form = it.locator("form");
    await form.waitFor({ timeout: 3000 });
    const toHistory = form.getByLabel(/Zapsat do historie domu/);
    assert(await toHistory.isChecked(), "„Zapsat do historie domu“ není ve výchozím stavu zapnuté");
    await form.getByLabel("Kdy se provedlo *").fill(DONE_DATE);
    await form.getByText(`Další termín se posune na ${czDay(NEXT_DUE)}`).waitFor({ timeout: 3000 });
    await form.getByLabel("Výsledek").selectOption("OK");
    await form.getByRole("button", { name: "Uložit provedení" }).click();
    await sectionOf(page)
      .getByRole("status")
      .filter({ hasText: `Další termín: ${czDay(NEXT_DUE)}` })
      .waitFor({ timeout: 3000 });
    const txt = (await itemByTitle(page, "Revize plynového kotle").innerText()).replace(/\s+/g, " ");
    assert(txt.includes("V pořádku"), `stav po provedení: ${txt}`);
    assert(txt.includes(`Další termín ${czDay(NEXT_DUE)}`), `další termín: ${txt}`);
    assert(txt.includes(`Naposledy ${czDay(DONE_DATE)}`), `naposledy: ${txt}`);
    assert(txt.includes("Historie provedení (1)"), `chybí historie provedení: ${txt}`);
    const entriesAfter = await page.locator("ol > li", { has: page.getByRole("heading", { name: "Revize plynového kotle", level: 3 }) }).count();
    assert(entriesAfter === entriesBefore + 1, `záznamů „Revize plynového kotle" ${entriesBefore} → ${entriesAfter}`);
  });

  await step("Historie provedení u termínu ukazuje datum a výsledek", async () => {
    const it = itemByTitle(page, "Revize plynového kotle");
    await it.getByText(/Historie provedení \(1\)/).click();
    const hist = it.locator("details");
    await hist.getByText(czDay(DONE_DATE)).waitFor({ timeout: 3000 });
    const txt = (await hist.innerText()).replace(/\s+/g, " ");
    assert(txt.includes("zapsáno v historii domu"), `chybí vazba na záznam: ${txt}`);
    assert(txt.includes("Schopné bezpečného provozu"), `chybí výsledek revize: ${txt}`);
  });

  await step("Timeline „Historie“: nový záznam Revize s prvkem Plynový kotel", async () => {
    const entry = page
      .locator("ol > li", { has: page.getByRole("heading", { name: "Revize plynového kotle", level: 3 }) })
      .filter({ hasText: czDay(DONE_DATE) })
      .first();
    await entry.waitFor({ timeout: 3000 });
    const txt = (await entry.innerText()).replace(/\s+/g, " ");
    assert(txt.includes("Revize"), `chybí typ Revize: ${txt}`);
    assert(
      (await entry.getByRole("link", { name: /Plynový kotel/ }).count()) +
        (await entry.getByText("Plynový kotel", { exact: true }).count()) >
        0,
      `chybí štítek prvku: ${txt}`,
    );
    // na začátku timeline (nejnovější nahoře)
    const firstTitle = await page.locator("ol > li h3").first().innerText();
    assert(firstTitle === "Revize plynového kotle", `nový záznam není nahoře: ${firstTitle}`);
  });

  await step("Řazení po provedení: kotel (v pořádku) je až za blížícím se termínem", async () => {
    const rows = await openItemsSummary(page);
    const titles = rows.map((r) => r.title);
    assert(titles.indexOf(T1) < titles.indexOf("Revize plynového kotle"), `pořadí: ${titles.join(", ")}`);
  });

  await step("Reload: provedení kotle je uložené", async () => {
    await page.reload();
    await itemByTitle(page, "Revize plynového kotle").waitFor({ timeout: 10000 });
    const txt = (await itemByTitle(page, "Revize plynového kotle").innerText()).replace(/\s+/g, " ");
    assert(txt.includes("V pořádku") && txt.includes(czDay(NEXT_DUE)), `po reloadu: ${txt}`);
    const store = await readStore(page);
    const r = store.find((p) => p.id === "demo-dum").reminders.find((x) => x.id === "s-r1");
    assert(r.dueDate === NEXT_DUE && r.lastDone === DONE_DATE && !r.done, `úložiště: ${JSON.stringify(r)}`);
    assert(r.intervalMonths === 12, "lhůta se změnila");
    assert(r.history?.length === 1 && r.history[0].entryId, "historie bez vazby na záznam");
  });

  // ---------- Provedeno: jednorázový termín bez zápisu ----------
  await step("„Provedeno“ u revize komínu bez zápisu do historie → „Splněné (1)“", async () => {
    const entriesBefore = await page.locator("ol > li").count();
    const it = itemByTitle(page, "Revize komínu");
    await it.getByRole("button", { name: "Provedeno" }).click();
    const form = it.locator("form");
    await form.waitFor({ timeout: 3000 });
    await form.getByLabel(/Zapsat do historie domu/).uncheck();
    await form.getByText("Termín se přesune mezi splněné.").waitFor({ timeout: 3000 });
    await form.getByRole("button", { name: "Uložit provedení" }).click();
    await sectionOf(page).getByRole("status").filter({ hasText: "„Revize komínu“ je splněno." }).waitFor({ timeout: 3000 });
    assert((await itemByTitle(page, "Revize komínu").count()) === 0, "komín zůstal mezi otevřenými");
    const done = sectionOf(page).locator("details", { hasText: "Splněné (1)" });
    await done.waitFor({ timeout: 3000 });
    await done.getByText("Splněné (1)").click();
    const txt = (await done.innerText()).replace(/\s+/g, " ");
    assert(txt.includes("Revize komínu") && txt.includes(`splněno ${czDay(TODAY)}`), `splněné: ${txt}`);
    assert((await page.locator("ol > li").count()) === entriesBefore, "vznikl záznam v historii, i když byl vypnutý");
    await sectionOf(page).getByText("1 po termínu").waitFor({ timeout: 1000 }).catch(() => {});
  });

  await step("Splněný termín: „Znovu otevřít“ a zpět „Provedeno“", async () => {
    const done = sectionOf(page).locator("details", { hasText: "Splněné (1)" });
    await done.getByRole("button", { name: "Znovu otevřít" }).click();
    await itemByTitle(page, "Revize komínu").waitFor({ timeout: 3000 });
    const it = itemByTitle(page, "Revize komínu");
    await it.getByRole("button", { name: "Provedeno" }).click();
    await it.locator("form").getByLabel(/Zapsat do historie domu/).uncheck();
    await it.locator("form").getByRole("button", { name: "Uložit provedení" }).click();
    await sectionOf(page).locator("details", { hasText: "Splněné (1)" }).waitFor({ timeout: 3000 });
  });

  await step("„Provedeno“: datum v budoucnosti se neuloží", async () => {
    const it = itemByTitle(page, T1);
    await it.getByRole("button", { name: "Provedeno" }).click();
    const form = it.locator("form");
    await form.getByLabel("Kdy se provedlo *").fill(addDaysIso(TODAY, 5));
    await form.getByRole("button", { name: "Uložit provedení" }).click();
    await form.getByRole("alert").filter({ hasText: "nemůže být v budoucnosti" }).waitFor({ timeout: 3000 });
    await form.getByRole("button", { name: "Zrušit" }).click();
    assert((await it.locator("form").count()) === 0, "formulář se nezavřel");
  });

  await step("/prehled: po provedení revize kotle zmizela z „Vyžaduje pozornost“", async () => {
    await open(page, "/prehled");
    await page.getByRole("heading", { name: "Vyžaduje pozornost" }).waitFor({ timeout: 5000 });
    assert(
      (await page.getByText("Plynový kotel — Revize plynového kotle").count()) === 0,
      "revize kotle je stále v pozornosti",
    );
    assert((await page.getByText("Revize komínu").count()) === 0, "splněný komín je stále v pozornosti");
    // blížící se nový termín (za 10 dní) tam naopak je, s prvkem
    await page.getByText(`Okruh zásuvek — kuchyň — ${T1}`).first().waitFor({ timeout: 3000 });
  });

  // ---------- /pripominky ----------
  await step("/pripominky: skupiny, stavové štítky, prvky", async () => {
    await open(page, "/pripominky");
    const h = page.getByRole("heading", { level: 1 });
    assert((await h.innerText()).includes("Termíny a revize"), "nadpis");
    for (const g of ["Blíží se", "V pořádku"]) {
      await page.getByRole("heading", { level: 2, name: new RegExp(`^${g}`) }).waitFor({ timeout: 5000 });
    }
    const kotel = page.locator("li", { has: page.getByText("Revize plynového kotle", { exact: true }) }).first();
    const txt = (await kotel.innerText()).replace(/\s+/g, " ");
    assert(txt.includes("V pořádku"), `kotel stav: ${txt}`);
    assert(txt.includes("Plynový kotel"), `kotel prvek: ${txt}`);
    assert(txt.includes("Rodinný dům Říčany"), `kotel nemovitost: ${txt}`);
    // demo-byt: výměna filtrů je po termínu
    const filtry = page.locator("li", { has: page.getByText("Výměna filtrů rekuperace", { exact: true }) }).first();
    assert((await filtry.innerText()).includes("Po termínu"), "filtry rekuperace nejsou po termínu");
    // Splněné
    await page.getByText(/^Splněné \(\d+\)$/).first().waitFor({ timeout: 3000 });
  });

  await step("/pripominky: export .ics všech otevřených termínů", async () => {
    const btn = page.getByRole("button", { name: /Přidat do kalendáře \(\.ics\)/ });
    const { name, buf } = await downloadFrom(page, btn);
    assert(name === "bulo-terminy.ics", `název: ${name}`);
    const ics = parseAndCheckIcs(buf, "pripominky.ics");
    const expected = openRemindersForClient(await readStore(page));
    assert(ics.events.length === expected.length, `VEVENTů ${ics.events.length}, otevřených ${expected.length}`);
    const uids = new Set(ics.events.map((e) => e.uid));
    assert(uids.size === ics.events.length, "duplicitní UID");
    for (const { r } of expected) assert(uids.has(`${r.id}@bulo`), `chybí ${r.title}`);
    assert(!uids.has("s-r2@bulo"), "splněný termín je v exportu");
    const byt = ics.events.find((e) => e.uid === "s-r4@bulo");
    assert(byt.summary === "Výměna filtrů rekuperace — Byt Karlín 3+kk", `SUMMARY: ${byt.summary}`);
  });

  await step("/pripominky: „Provedeno“ funguje i tady (filtry rekuperace)", async () => {
    const it = page.locator("li", { has: page.getByText("Výměna filtrů rekuperace", { exact: true }) }).first();
    await it.getByRole("button", { name: "Provedeno" }).click();
    const form = it.locator("form");
    await form.getByLabel(/Zapsat do historie domu/).uncheck();
    await form.getByRole("button", { name: "Uložit provedení" }).click();
    await page.getByRole("status").filter({ hasText: "„Výměna filtrů rekuperace“ je splněno." }).waitFor({ timeout: 3000 });
  });

  await step("/pripominky: karta „Upozornění v prohlížeči“ je vidět", async () => {
    const card = page.locator("section", { has: page.getByRole("heading", { name: "Upozornění v prohlížeči" }) });
    await card.waitFor({ timeout: 3000 });
    const txt = (await card.innerText()).replace(/\s+/g, " ");
    assert(
      /Zapnout upozornění|Upozornění jsou zapnutá|zablokovaná|neumí/.test(txt),
      `karta bez stavu: ${txt}`,
    );
    assert(txt.includes("Spolehlivější je kalendář"), "chybí doporučení .ics");
  });

  // ---------- /kalendar ----------
  await step("/kalendar: stavové štítky, prvky, filtry", async () => {
    await open(page, "/kalendar");
    const kotel = page.locator("li", { has: page.getByText("Revize plynového kotle", { exact: true }) }).first();
    await kotel.waitFor({ timeout: 5000 });
    const txt = (await kotel.innerText()).replace(/\s+/g, " ");
    assert(txt.includes("V pořádku"), `kotel stav: ${txt}`);
    assert(txt.includes("Plynový kotel"), `kotel prvek: ${txt}`);
    assert(txt.includes(czDay(NEXT_DUE)), `kotel datum: ${txt}`);
    const t1 = page.locator("li", { has: page.getByText(T1, { exact: true }) }).first();
    assert((await t1.innerText()).includes("Blíží se"), "nový termín není „Blíží se“");
    // filtr Záruky: žádné revize
    await page.getByRole("button", { name: "Záruky", exact: true }).click();
    await page.getByText("Konec záruky na střešní okno", { exact: true }).waitFor({ timeout: 3000 });
    assert((await page.getByText("Revize plynového kotle", { exact: true }).count()) === 0, "Záruky ukazují revizi");
    // filtr Revize: žádné záruky
    await page.getByRole("button", { name: "Revize", exact: true }).click();
    await page.getByText("Revize plynového kotle", { exact: true }).waitFor({ timeout: 3000 });
    assert((await page.getByText("Konec záruky na střešní okno", { exact: true }).count()) === 0, "Revize ukazují záruku");
    assert((await page.getByText(/^Konec záruky:/).count()) === 0, "Revize ukazují záruku z vybavení");
    await page.getByRole("button", { name: "Vše", exact: true }).click();
    await page.getByText("Konec záruky na střešní okno", { exact: true }).waitFor({ timeout: 3000 });
  });

  await step("/kalendar: export .ics", async () => {
    const btn = page.getByRole("button", { name: /Přidat do kalendáře \(\.ics\)/ });
    const { buf } = await downloadFrom(page, btn);
    const ics = parseAndCheckIcs(buf, "kalendar.ics");
    const expected = openRemindersForClient(await readStore(page));
    assert(ics.events.length === expected.length, `VEVENTů ${ics.events.length}, otevřených ${expected.length}`);
  });

  await step("/kalendar: „Provedeno“ u termínu", async () => {
    const it = page.locator("li", { has: page.getByText(T1, { exact: true }) }).first();
    await it.getByRole("button", { name: /jako provedené/ }).click();
    const form = it.locator("form");
    await form.getByLabel(/Zapsat do historie domu/).uncheck();
    await form.getByRole("button", { name: "Uložit provedení" }).click();
    await page.getByRole("status").filter({ hasText: `„${T1}“ je splněno.` }).waitFor({ timeout: 3000 });
    assert((await page.getByText(T1, { exact: true }).count()) === 0, "splněný termín zůstal v kalendáři");
  });

  await step("/statistiky se načte a počítá otevřené termíny", async () => {
    await open(page, "/statistiky");
    const stat = page.locator(".card", { hasText: "Otevřené připomínky" }).first();
    const txt = (await stat.innerText()).replace(/\s+/g, " ");
    const expected = openRemindersForClient(await readStore(page)).length;
    assert(txt.startsWith(String(expected)), `stat „${txt}", čekal jsem ${expected}`);
  });

  // =====================================================================
  // UPOZORNĚNÍ V PROHLÍŽEČI
  // =====================================================================
  {
    const { page: p2 } = await newPage("desktop", "notif-default", {
      initScripts: [{ fn: notificationStub, arg: { perm: "default", answer: "granted" } }],
    });
    await step("Upozornění: bez povolení se při načtení na nic neptáme ani neupozorňujeme", async () => {
      await login(p2);
      await open(p2, "/pripominky");
      await p2.waitForTimeout(500);
      const s = await p2.evaluate(() => ({
        n: localStorage.getItem("__e2e_notif_count"),
        req: localStorage.getItem("__e2e_notif_requests"),
      }));
      assert(!s.n, `vzniklo upozornění bez povolení (${s.n})`);
      assert(!s.req, `appka se sama zeptala na povolení (${s.req}×)`);
    });
    await step("Upozornění: „Zapnout upozornění“ → povoleno → „Upozornění jsou zapnutá“", async () => {
      const card = p2.locator("section", { has: p2.getByRole("heading", { name: "Upozornění v prohlížeči" }) });
      await card.getByRole("button", { name: "Zapnout upozornění" }).click();
      await card.getByText("Upozornění jsou zapnutá").waitFor({ timeout: 3000 });
      await card.getByRole("status").filter({ hasText: "jednou denně" }).waitFor({ timeout: 3000 });
      await card.getByRole("button", { name: "Vyzkoušet" }).click();
      await card.getByRole("status").filter({ hasText: "Zkušební upozornění odesláno." }).waitFor({ timeout: 3000 });
      const last = await p2.evaluate(() => JSON.parse(localStorage.getItem("__e2e_notif_last") || "null"));
      assert(last && /po termínu|se blíží/.test(last.body), `text upozornění: ${JSON.stringify(last)}`);
    });
  }
  {
    const { page: p3 } = await newPage("desktop", "notif-denied", {
      initScripts: [{ fn: notificationStub, arg: { perm: "default", answer: "denied" } }],
    });
    await step("Upozornění: zamítnuté povolení → nabídne kalendář", async () => {
      await login(p3);
      await open(p3, "/pripominky");
      const card = p3.locator("section", { has: p3.getByRole("heading", { name: "Upozornění v prohlížeči" }) });
      await card.getByRole("button", { name: "Zapnout upozornění" }).click();
      await card.getByText("zablokovaná").waitFor({ timeout: 3000 });
      await card.getByRole("status").filter({ hasText: "nepovolili" }).waitFor({ timeout: 3000 });
    });
  }
  {
    const { page: p4 } = await newPage("desktop", "notif-granted", {
      grant: true,
      initScripts: [{ fn: notificationStub, arg: { perm: "granted", answer: "granted" } }],
    });
    await step("Upozornění (povoleno): karta ukazuje „Upozornění jsou zapnutá“", async () => {
      await login(p4);
      await open(p4, "/pripominky");
      const card = p4.locator("section", { has: p4.getByRole("heading", { name: "Upozornění v prohlížeči" }) });
      await card.getByText("Upozornění jsou zapnutá").waitFor({ timeout: 3000 });
      await card.getByRole("button", { name: "Vyzkoušet" }).waitFor({ timeout: 3000 });
      assert((await card.getByRole("button", { name: "Zapnout upozornění" }).count()) === 0, "nabízí zapnutí, i když je povoleno");
    });
    await step("Upozornění (povoleno): nejvýš jedno za den i po dvou reloadech", async () => {
      // přihlášení (/prehled) + /pripominky už proběhly
      const c1 = await p4.evaluate(() => Number(localStorage.getItem("__e2e_notif_count") || "0"));
      assert(c1 === 1, `po přihlášení ${c1} upozornění (čekal jsem 1)`);
      await p4.reload();
      await p4.getByRole("heading", { level: 1 }).first().waitFor();
      await p4.waitForTimeout(400);
      await p4.reload();
      await p4.getByRole("heading", { level: 1 }).first().waitFor();
      await p4.waitForTimeout(400);
      await open(p4, "/nemovitost/demo-dum");
      await p4.waitForTimeout(400);
      const s = await p4.evaluate(() => ({
        n: Number(localStorage.getItem("__e2e_notif_count") || "0"),
        day: localStorage.getItem("bulo-deadlines-notified"),
        last: JSON.parse(localStorage.getItem("__e2e_notif_last") || "null"),
      }));
      assert(s.n === 1, `upozornění ${s.n}× (čekal jsem 1×)`);
      assert(s.day === TODAY, `uložený den ${s.day}`);
      assert(s.last.title === "BULO – termíny a revize", `titulek: ${s.last.title}`);
      assert(/2 termíny po termínu/.test(s.last.body) || /po termínu/.test(s.last.body), `text: ${s.last.body}`);
    });
  }
  {
    // skutečný prohlížeč s udělením oprávnění (bez stubu) — nesmí nic shodit
    const { page: p5 } = await newPage("desktop", "notif-real", { grant: true });
    await step("Upozornění (skutečné API, grantPermissions): stránka funguje, karta má stav", async () => {
      await login(p5);
      await open(p5, "/pripominky");
      const card = p5.locator("section", { has: p5.getByRole("heading", { name: "Upozornění v prohlížeči" }) });
      const txt = (await card.innerText()).replace(/\s+/g, " ");
      assert(/Upozornění jsou zapnutá|zablokovaná|Zapnout upozornění|neumí/.test(txt), `karta: ${txt}`);
    });
  }

  // =====================================================================
  // ZPĚTNÁ KOMPATIBILITA — stará data bez prvků/modelů/pozvánek
  // =====================================================================
  {
    const oldProp = {
      id: "stary-dum",
      name: "Starý dům Kolín",
      type: "HOUSE",
      street: "Stará 1",
      city: "Kolín",
      ownerName: "Pan Starý",
      shareEnabled: false,
      entries: [
        { id: "o-e1", type: "INSPECTION", title: "Revize hromosvodu", date: "2024-03-01", media: [], createdAt: "2024-03-01" },
      ],
      documents: [],
      reminders: [
        { id: "o-r1", title: "Revize hromosvodu (stará)", type: "INSPECTION", dueDate: "2026-01-15", done: false },
        { id: "o-r2", title: "Servis kotle (starý)", type: "MAINTENANCE", dueDate: addDaysIso(TODAY, 5), done: false },
        { id: "o-r3", title: "Záruka oken (stará)", type: "WARRANTY", dueDate: "2029-05-01", done: false },
        { id: "o-r4", title: "Vyčištění okapů (staré)", type: "OTHER", dueDate: "2025-04-01", done: true },
      ],
      transfers: [],
      inventory: [],
      createdAt: "2023-01-01",
      updatedAt: "2023-01-01",
    };
    const { page: p6 } = await newPage("desktop", "old-data", {
      initScripts: [
        {
          fn: ({ key, data }) => {
            if (!sessionStorage.getItem("__e2e_seeded")) {
              localStorage.setItem(key, JSON.stringify(data));
              localStorage.setItem("bulo-role", "CLIENT");
              sessionStorage.setItem("__e2e_seeded", "1");
            }
          },
          arg: { key: STORE_KEY, data: [oldProp] },
        },
      ],
    });
    await step("Stará data: /prehled se načte (pozornost: stará revize po termínu)", async () => {
      await open(p6, "/prehled");
      await p6.getByText("Starý dům Kolín").first().waitFor({ timeout: 5000 });
      await p6.getByText("Revize hromosvodu (stará)").first().waitFor({ timeout: 5000 });
    });
    await step("Stará data: nemovitost — termíny mají rozumný stav", async () => {
      await open(p6, "/nemovitost/stary-dum");
      await sectionOf(p6).waitFor({ timeout: 5000 });
      const st = Object.fromEntries((await openItemsSummary(p6)).map((r) => [r.title, r.state]));
      assert(st["Revize hromosvodu (stará)"] === "Po termínu", `hromosvod: ${st["Revize hromosvodu (stará)"]}`);
      assert(st["Servis kotle (starý)"] === "Blíží se", `servis: ${st["Servis kotle (starý)"]}`);
      assert(st["Záruka oken (stará)"] === "V pořádku", `záruka: ${st["Záruka oken (stará)"]}`);
      const txt = (await itemByTitle(p6, "Revize hromosvodu (stará)").innerText()).replace(/\s+/g, " ");
      assert(txt.includes("jednorázový termín"), `stará revize bez lhůty: ${txt}`);
      assert(!/každ[ýé]/.test(txt), `vymyšlená lhůta: ${txt}`);
      assert(txt.includes("Naposledy —"), `naposledy: ${txt}`);
      await sectionOf(p6).getByText("Splněné (1)").waitFor({ timeout: 3000 });
    });
    await step("Stará data: „Provedeno“ a „Přidat termín“ bez prvků fungují", async () => {
      const it = itemByTitle(p6, "Servis kotle (starý)");
      await it.getByRole("button", { name: "Provedeno" }).click();
      await it.locator("form").getByRole("button", { name: "Uložit provedení" }).click();
      await sectionOf(p6).getByText("Splněné (2)").waitFor({ timeout: 3000 });
      await sectionOf(p6).getByRole("button", { name: "Přidat termín" }).click();
      const form = sectionOf(p6).locator("form");
      assert(await form.getByLabel("Prvek domu").isDisabled(), "výběr prvku není zakázaný bez prvků");
      await form.getByRole("button", { name: "Zrušit" }).click();
    });
    for (const path of ["/pripominky", "/kalendar", "/statistiky"]) {
      await step(`Stará data: ${path} se načte`, async () => {
        await open(p6, path);
        await p6.waitForTimeout(300);
        if (path !== "/statistiky") {
          await p6.getByText("Revize hromosvodu (stará)").first().waitFor({ timeout: 5000 });
          const row = p6.locator("li", { has: p6.getByText("Revize hromosvodu (stará)", { exact: true }) }).first();
          assert((await row.innerText()).includes("Po termínu"), "stará revize není po termínu");
        }
      });
    }
    await step("Stará data: export .ics", async () => {
      await open(p6, "/pripominky");
      const btn = p6.getByRole("button", { name: /Přidat do kalendáře \(\.ics\)/ });
      const { buf } = await downloadFrom(p6, btn);
      const ics = parseAndCheckIcs(buf, "stara.ics");
      assert(ics.events.length === 2, `VEVENTů ${ics.events.length}`);
      for (const e of ics.events) assert(e.alarm.TRIGGER === "-P30D", `výchozí upozornění: ${e.alarm.TRIGGER}`);
    });
  }

  // =====================================================================
  // JEN KE ČTENÍ — architekt u předaného projektu nesmí termíny měnit
  // =====================================================================
  {
    const handed = {
      id: "predany-projekt",
      name: "Předaný projekt Mělník",
      type: "HOUSE",
      ownerName: "Klient Předaný",
      shareEnabled: false,
      createdByRole: "ARCHITECT",
      handedOver: true,
      entries: [],
      documents: [],
      reminders: [
        { id: "h-r1", title: "Revize spalinové cesty", type: "INSPECTION", dueDate: "2026-09-01", done: false, intervalMonths: 12 },
        { id: "h-r2", title: "Kontrola střechy", type: "MAINTENANCE", dueDate: "2027-06-01", done: false },
      ],
      transfers: [],
      inventory: [],
      createdAt: "2025-01-01",
      updatedAt: "2025-01-01",
    };
    const { page: pa } = await newPage("desktop", "architect-readonly", {
      initScripts: [
        {
          fn: ({ key, data }) => {
            if (!sessionStorage.getItem("__e2e_seeded")) {
              localStorage.setItem(key, JSON.stringify(data));
              localStorage.setItem("bulo-role", "ARCHITECT");
              sessionStorage.setItem("__e2e_seeded", "1");
            }
          },
          arg: { key: STORE_KEY, data: [handed] },
        },
        { fn: notificationStub, arg: { perm: "granted", answer: "granted" } },
      ],
    });
    await step("Jen ke čtení (architekt, předáno): žádné „Provedeno“/úpravy, export .ics zůstává", async () => {
      await open(pa, "/nemovitost/predany-projekt");
      await itemByTitle(pa, "Revize spalinové cesty").waitFor({ timeout: 5000 });
      const sec = sectionOf(pa);
      for (const name of ["Provedeno", "Přidat termín", "Upravit", "Smazat termín"]) {
        assert((await sec.getByRole("button", { name, exact: true }).count()) === 0, `jen ke čtení, ale je tu „${name}“`);
      }
      assert((await sec.getByRole("link", { name: /Nahrát (protokol|doklad) \(AI\)/ }).count()) === 0, "jen ke čtení, ale je tu AI odkaz");
      const { buf } = await downloadFrom(pa, sec.getByRole("button", { name: /Do kalendáře/ }));
      assert(parseAndCheckIcs(buf, "readonly.ics").events.length === 2, "export jen ke čtení");
    });
    for (const path of ["/pripominky", "/kalendar"]) {
      await step(`Jen ke čtení: ${path} bez „Provedeno“`, async () => {
        await open(pa, path);
        await pa.getByText("Revize spalinové cesty", { exact: true }).first().waitFor({ timeout: 5000 });
        assert(
          (await pa.getByRole("button", { name: /^Provedeno$|jako provedené/ }).count()) === 0,
          "architekt může označit předaný termín jako provedený",
        );
      });
    }
    await step("Jen ke čtení: architekt nedostává upozornění na termíny předaného projektu", async () => {
      await open(pa, "/prehled");
      await pa.waitForTimeout(500);
      const n = await pa.evaluate(() => Number(localStorage.getItem("__e2e_notif_count") || "0"));
      assert(n === 0, `architekt dostal ${n} upozornění na cizí (předaný) termín`);
    });
  }

  // =====================================================================
  // SPRÁVCE (tvurce) — vidí termíny napříč systémem
  // =====================================================================
  {
    const { page: pc } = await newPage("desktop", "creator");
    await step("Správce: /pripominky a /kalendar se načtou s termíny všech nemovitostí", async () => {
      await login(pc, "tvurce");
      await open(pc, "/pripominky");
      await pc.getByText("Revize plynového kotle", { exact: true }).first().waitFor({ timeout: 5000 });
      await pc.getByText("Výměna filtrů rekuperace", { exact: true }).first().waitFor({ timeout: 5000 });
      await open(pc, "/kalendar");
      await pc.getByText("Revize plynového kotle", { exact: true }).first().waitFor({ timeout: 5000 });
      await open(pc, "/prehled");
      await pc.getByText("Plynový kotel — Revize plynového kotle").first().waitFor({ timeout: 5000 });
    });
    await step("Správce: /statistiky — záloha dat (JSON) se stáhne", async () => {
      await open(pc, "/statistiky");
      const { name, buf } = await downloadFrom(pc, pc.getByRole("button", { name: "Export dat (JSON)" }));
      assert(name === `bulo-zaloha-${TODAY}.json`, `název zálohy: ${name}`);
      const data = JSON.parse(buf.toString("utf8"));
      assert(Array.isArray(data) && data.some((p) => p.id === "demo-dum"), "záloha neobsahuje data");
    });
  }

  // =====================================================================
  // PROTOKOL PŘES AI → TERMÍN (vazba na „Nahrát protokol (AI)")
  // =====================================================================
  {
    const { page: pai } = await newPage("desktop", "ai-protocol");
    const PNG = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
      "base64",
    );
    await step("AI protokol: z termínu → vyčtení → bez potvrzení se nic neuloží", async () => {
      await login(pai);
      await open(pai, "/nemovitost/demo-dum");
      await itemByTitle(pai, "Revize plynového kotle").getByRole("link", { name: /Nahrát protokol \(AI\)/ }).click();
      await pai.waitForURL(/z-dokladu\?termin=s-r1/, { timeout: 10000 });
      await pai.getByText(/Termín: Revize plynového kotle/).waitFor({ timeout: 10000 });
      await pai.locator('input[type="file"]:not([capture])').setInputFiles({
        name: "protokol-kotel.png",
        mimeType: "image/png",
        buffer: PNG,
      });
      await pai.getByRole("button", { name: "Vyčíst údaje" }).click();
      await pai.getByRole("button", { name: /Potvrdit a zapsat/ }).waitFor({ timeout: 30000 });
      const r = (await readStore(pai)).find((p) => p.id === "demo-dum").reminders.find((x) => x.id === "s-r1");
      assert(r.dueDate === "2026-10-12" && !r.history?.length, `termín se změnil před potvrzením: ${JSON.stringify(r)}`);
    });
    await step("AI protokol: po potvrzení zpět na nemovitost, termín posunutý, doklad + historie", async () => {
      await pai.getByRole("button", { name: /Potvrdit a zapsat/ }).click();
      await pai.waitForURL((u) => u.pathname === "/nemovitost/demo-dum", { timeout: 10000 });
      const it = itemByTitle(pai, "Revize plynového kotle");
      await it.waitFor({ timeout: 10000 });
      const txt = (await it.innerText()).replace(/\s+/g, " ");
      assert(txt.includes("V pořádku"), `stav: ${txt}`);
      assert(txt.includes(`Další termín ${czDay(NEXT_DUE)}`), `další termín: ${txt}`);
      assert(txt.includes(`Naposledy ${czDay(DONE_DATE)}`), `naposledy: ${txt}`);
      assert(txt.includes("každých 12 měsíců"), `lhůta: ${txt}`);
      const doc = it.getByRole("link", { name: /Protokol: Revize plynového kotle/ });
      assert((await doc.count()) >= 1, `chybí doklad ke stažení: ${txt}`);
      assert((await doc.first().getAttribute("download")) != null, "doklad nejde stáhnout");
      await it.getByText(/Historie provedení \(1\)/).click();
      const hist = (await it.locator("details").innerText()).replace(/\s+/g, " ");
      assert(hist.includes("Schopné bezpečného provozu"), `výsledek v historii: ${hist}`);
      assert(hist.includes("Ing. Petr Novák"), `technik v historii: ${hist}`);
    });
  }

  // =====================================================================
  // ZPĚTNÁ KOMPATIBILITA — demo dům ze staré verze (bez prvků) se doplní o model
  // =====================================================================
  {
    const oldDemo = {
      id: "demo-dum",
      name: "Rodinný dům Říčany",
      type: "HOUSE",
      ownerName: "Jana Nováková",
      shareEnabled: false,
      createdByRole: "CLIENT",
      entries: [],
      documents: [],
      reminders: [
        { id: "s-r1", type: "INSPECTION", title: "Revize plynového kotle", dueDate: "2026-10-12", done: false },
        { id: "s-r2", type: "INSPECTION", title: "Revize komínu", dueDate: "2026-05-30", done: true },
      ],
      transfers: [],
      inventory: [],
      createdAt: "2024-01-01",
      updatedAt: "2024-01-01",
    };
    const { page: pd } = await newPage("desktop", "old-demo", {
      initScripts: [
        {
          fn: ({ key, data }) => {
            if (!sessionStorage.getItem("__e2e_seeded")) {
              localStorage.setItem(key, JSON.stringify(data));
              localStorage.setItem("bulo-role", "CLIENT");
              sessionStorage.setItem("__e2e_seeded", "1");
            }
          },
          arg: { key: STORE_KEY, data: [oldDemo] },
        },
      ],
    });
    await step("Starý demo dům: termíny po migraci ukazují prvek a lhůtu, splněné zůstanou splněné", async () => {
      await open(pd, "/nemovitost/demo-dum");
      const it = itemByTitle(pd, "Revize plynového kotle");
      await it.waitFor({ timeout: 10000 });
      const txt = (await it.innerText()).replace(/\s+/g, " ");
      assert(txt.includes("Po termínu") && txt.includes("Plynový kotel"), `kotel: ${txt}`);
      await sectionOf(pd).getByText("Splněné (1)").waitFor({ timeout: 3000 });
      for (const path of ["/prehled", "/pripominky", "/kalendar", "/statistiky"]) {
        await open(pd, path);
      }
    });
  }

  // =====================================================================
  // TELEFON 375×812
  // =====================================================================
  {
    const { page: ph } = await newPage("phone", "phone");
    await step("Telefon: přihlášení a /prehled bez přetečení", async () => {
      await login(ph);
      await assertNoOverflow(ph, "/prehled");
    });
    await step("Telefon: nemovitost — sekce termínů bez přetečení", async () => {
      await open(ph, "/nemovitost/demo-dum");
      await sectionOf(ph).scrollIntoViewIfNeeded();
      await assertNoOverflow(ph, "/nemovitost/demo-dum");
      const box = await sectionOf(ph).boundingBox();
      assert(box && box.x >= 0 && box.x + box.width <= 376, `sekce mimo obrazovku: ${JSON.stringify(box)}`);
    });
    await step("Telefon: formulář „Provedeno“ je použitelný", async () => {
      const it = itemByTitle(ph, "Revize plynového kotle");
      await it.getByRole("button", { name: "Provedeno" }).tap();
      const form = it.locator("form");
      await form.waitFor({ timeout: 3000 });
      await assertNoOverflow(ph, "formulář Provedeno");
      for (const loc of [
        form.getByLabel("Kdy se provedlo *"),
        form.getByLabel("Výsledek"),
        form.getByRole("button", { name: "Uložit provedení" }),
      ]) {
        await loc.scrollIntoViewIfNeeded();
        const b = await loc.boundingBox();
        assert(b && b.x >= 0 && b.x + b.width <= 376, `prvek formuláře mimo obrazovku: ${JSON.stringify(b)}`);
        assert(b.height >= 36, `malý cíl pro prst (${Math.round(b.height)} px)`);
      }
      await form.getByLabel("Kdy se provedlo *").fill(DONE_DATE);
      await form.getByRole("button", { name: "Uložit provedení" }).tap();
      await sectionOf(ph).getByRole("status").waitFor({ timeout: 3000 });
      const txt = (await itemByTitle(ph, "Revize plynového kotle").innerText()).replace(/\s+/g, " ");
      assert(txt.includes("V pořádku") && txt.includes(czDay(NEXT_DUE)), `po uložení: ${txt}`);
      await assertNoOverflow(ph, "po uložení provedení");
    });
    await step("Telefon: formulář „Přidat termín“ bez přetečení", async () => {
      await sectionOf(ph).getByRole("button", { name: "Přidat termín" }).tap();
      await sectionOf(ph).locator("form").waitFor({ timeout: 3000 });
      await assertNoOverflow(ph, "formulář Přidat termín");
      await sectionOf(ph).locator("form").getByRole("button", { name: "Zrušit" }).tap();
    });
    await step("Telefon: /pripominky bez přetečení", async () => {
      await open(ph, "/pripominky");
      await assertNoOverflow(ph, "/pripominky");
      const it = ph.locator("li", { has: ph.getByText("Revize komínu", { exact: true }) }).first();
      await it.getByRole("button", { name: "Provedeno" }).tap();
      await assertNoOverflow(ph, "/pripominky formulář Provedeno");
      await it.locator("form").getByRole("button", { name: "Zrušit" }).tap();
    });
    await step("Telefon: /kalendar bez přetečení, „Provedeno“ dostupné", async () => {
      await open(ph, "/kalendar");
      await assertNoOverflow(ph, "/kalendar");
      const it = ph.locator("li", { has: ph.getByText("Revize komínu", { exact: true }) }).first();
      const btn = it.getByRole("button", { name: /jako provedené/ });
      const b = await btn.boundingBox();
      assert(b && b.x + b.width <= 376 && b.height >= 36, `tlačítko Provedeno: ${JSON.stringify(b)}`);
      await btn.tap();
      await it.locator("form").waitFor({ timeout: 3000 });
      await assertNoOverflow(ph, "/kalendar formulář Provedeno");
      await it.locator("form").getByRole("button", { name: "Zrušit" }).tap();
    });
    await step("Telefon: /statistiky bez přetečení", async () => {
      await open(ph, "/statistiky");
      await assertNoOverflow(ph, "/statistiky");
    });
  }
} catch (e) {
  rec(false, "FATÁLNÍ: " + current, String(e.message || e).slice(0, 300));
} finally {
  for (const c of contexts) await c.close().catch(() => {});
  await browser.close();
  const fail = results.filter((r) => !r.ok);
  console.log("\n================ SOUHRN ================");
  console.log(`Kontrol: ${results.length} · PASS: ${results.length - fail.length} · FAIL: ${fail.length}`);
  if (fail.length) {
    console.log("\n--- NEÚSPĚŠNÉ ---");
    for (const f of fail) console.log(`FAIL  ${f.name} — ${f.detail}`);
  }
  if (pageErrors.length) {
    console.log("\n--- JS VÝJIMKY NA STRÁNCE ---");
    for (const e of [...new Set(pageErrors)]) console.log("! " + e);
  }
  if (serverErrors.length) {
    console.log("\n--- 5xx ODPOVĚDI ---");
    for (const e of [...new Set(serverErrors)]) console.log("! " + e);
  }
  if (consoleErrors.length) {
    console.log("\n--- CONSOLE ERROR ---");
    for (const e of [...new Set(consoleErrors)].slice(0, 30)) console.log("• " + e);
  }
  process.exit(fail.length || pageErrors.length || serverErrors.length ? 1 : 0);
}
