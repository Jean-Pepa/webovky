// Ukázkový model domu pro demo „Rodinný dům Říčany": půdorys přízemí + prvky.
// Doplní se k demo domu jen jednou (při migraci dat bez prvků).

import type { HouseElement, HouseModel, Property } from "./store";

const W = 1000;
const H = 640;

const PLAN_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
<rect width="${W}" height="${H}" fill="#ffffff"/>
<g fill="none" stroke="#2a211e" stroke-linecap="square">
<rect x="40" y="40" width="920" height="560" stroke-width="14"/>
<path d="M300 40V250M420 40V600M40 250H420M40 400H420M420 300H960" stroke-width="8"/>
</g>
<g fill="#ffffff">
<rect x="33" y="300" width="14" height="60"/>
<rect x="320" y="246" width="60" height="8"/>
<rect x="150" y="396" width="60" height="8"/>
<rect x="416" y="320" width="8" height="70"/>
<rect x="600" y="296" width="120" height="8"/>
<rect x="560" y="33" width="140" height="14"/>
<rect x="700" y="593" width="160" height="14"/>
</g>
<g stroke="#a8a29e" stroke-width="2" fill="none">
<rect x="260" y="265" width="140" height="115"/>
<path d="M280 265V380M300 265V380M320 265V380M340 265V380M360 265V380M380 265V380"/>
<rect x="440" y="50" width="420" height="60"/>
<circle cx="700" cy="80" r="16"/>
</g>
<g font-family="Inter, Arial, sans-serif" font-size="22" fill="#78716c" text-anchor="middle">
<text x="170" y="150">Technická místnost</text>
<text x="360" y="150">WC</text>
<text x="150" y="335">Chodba</text>
<text x="230" y="510">Pracovna</text>
<text x="690" y="200">Kuchyně</text>
<text x="690" y="460">Obývací pokoj</text>
</g>
<text x="${W - 50}" y="${H - 14}" font-family="Inter, Arial, sans-serif" font-size="16" fill="#a8a29e" text-anchor="end">Přízemí · 1 : 100 (ukázka)</text>
</svg>`;

export const DEMO_MODEL_ID = "demo-model-prizemi";

export const DEMO_MODEL: HouseModel = {
  id: DEMO_MODEL_ID,
  kind: "FLOORPLAN",
  title: "Přízemí",
  fileName: "pudorys-prizemi.svg",
  dataUrl: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(PLAN_SVG)}`,
  width: W,
  height: H,
  version: 1,
  date: "2009-06-01",
  source: "Projektová dokumentace (Ateliér Kořínek)",
  createdAt: "2024-01-01",
};

const T = "2024-01-01";
const at = (x: number, y: number): [number, number] => [x / W, y / H];
const onPlan = (...pts: [number, number][]) => ({ modelId: DEMO_MODEL_ID, points: pts });

export const DEMO_ELEMENTS: HouseElement[] = [
  {
    id: "demo-el-rozvadec",
    name: "Hlavní rozvaděč",
    category: "ELEKTRO",
    kind: "Rozvaděč",
    room: "Chodba",
    location: "Na stěně u vchodu, spodní hrana 1,4 m nad podlahou",
    source: "KOTA_VYKRESU",
    accuracyMm: 50,
    condition: "OK",
    installDate: "2009-06-01",
    plan: onPlan(at(62, 285)),
    createdAt: T,
    updatedAt: T,
  },
  {
    id: "demo-el-okruh-obyvak",
    name: "Okruh zásuvek — obývací pokoj",
    category: "ELEKTRO",
    kind: "Elektrický okruh",
    room: "Obývací pokoj",
    location: "Vodorovně 30 cm nad podlahou, pak ve stěně k zásuvkám",
    source: "FOTO_OTEVRENE_ZDI",
    accuracyMm: 20,
    condition: "OK",
    installDate: "2009-06-01",
    note: "Změřeno z fotek otevřené zdi s metrem při opravě omítky.",
    plan: onPlan(at(62, 300), at(62, 393), at(428, 393), at(428, 575), at(700, 575)),
    createdAt: T,
    updatedAt: T,
  },
  {
    id: "demo-el-okruh-kuchyn",
    name: "Okruh zásuvek — kuchyň",
    category: "ELEKTRO",
    kind: "Elektrický okruh",
    room: "Kuchyně",
    location: "Pravděpodobně pod stropem chodby, pak svisle ke kuchyňské lince",
    source: "TYPOLOGIE",
    accuracyMm: 300,
    condition: "UNKNOWN",
    plan: onPlan(at(62, 270), at(62, 262), at(440, 262), at(440, 125), at(850, 125)),
    createdAt: T,
    updatedAt: T,
  },
  {
    id: "demo-el-kotel",
    name: "Plynový kotel",
    category: "TOPENI",
    kind: "Kotel",
    room: "Technická místnost",
    source: "ZADAL_UZIVATEL",
    accuracyMm: 100,
    condition: "OK",
    installDate: "2018-01-01",
    installDateEstimated: true,
    plan: onPlan(at(130, 80)),
    createdAt: T,
    updatedAt: T,
  },
  {
    id: "demo-el-komin",
    name: "Komín / spalinová cesta",
    category: "TOPENI",
    kind: "Komín / spalinová cesta",
    room: "Technická místnost",
    source: "KOTA_VYKRESU",
    accuracyMm: 50,
    condition: "OK",
    installDate: "2009-06-01",
    plan: onPlan(at(70, 70)),
    createdAt: T,
    updatedAt: T,
  },
  {
    id: "demo-el-plyn",
    name: "Plynový rozvod (HUP → kotel)",
    category: "PLYN",
    kind: "Plynový rozvod",
    room: "Technická místnost",
    location: "Od hlavního uzávěru na fasádě po kotel",
    source: "KOTA_VYKRESU",
    accuracyMm: 50,
    condition: "OK",
    installDate: "2009-06-01",
    plan: onPlan(at(40, 200), at(130, 200), at(130, 92)),
    createdAt: T,
    updatedAt: T,
  },
  {
    id: "demo-el-voda-kuchyn",
    name: "Rozvod vody — kuchyň",
    category: "VODA",
    kind: "Rozvod studené vody",
    room: "Kuchyně",
    location: "Ve stěně podél severní fasády (odhad podle typického vedení)",
    source: "TYPOLOGIE",
    accuracyMm: 300,
    condition: "UNKNOWN",
    plan: onPlan(at(250, 62), at(700, 62)),
    createdAt: T,
    updatedAt: T,
  },
  {
    id: "demo-el-stresni-okno",
    name: "Střešní okno — ložnice",
    category: "KONSTRUKCE",
    kind: "Okno",
    room: "Ložnice",
    source: "ZADAL_UZIVATEL",
    condition: "ATTENTION",
    installDate: "2009-06-01",
    note: "Po opravě oplechování 11/2025 sledovat při dešti.",
    createdAt: T,
    updatedAt: T,
  },
  {
    id: "demo-el-podlahovka",
    name: "Podlahové topení — koupelna v patře",
    category: "TOPENI",
    kind: "Podlahové topení",
    room: "Koupelna",
    source: "ZADAL_UZIVATEL",
    accuracyMm: 300,
    condition: "OK",
    installDate: "2024-06-15",
    createdAt: T,
    updatedAt: T,
  },
  {
    id: "demo-el-strecha",
    name: "Střešní krytina",
    category: "KONSTRUKCE",
    kind: "Střecha",
    room: "Střecha",
    source: "ZADAL_UZIVATEL",
    condition: "OK",
    installDate: "2024-01-01",
    installDateEstimated: true,
    createdAt: T,
    updatedAt: T,
  },
];

// Vazby existujících demo záznamů na prvky (id záznamu → prvky)
const ENTRY_LINKS: Record<string, string[]> = {
  "s-e1": ["demo-el-kotel"],
  "s-e2": ["demo-el-stresni-okno"],
  "s-e3": ["demo-el-stresni-okno"],
  "s-e4": ["demo-el-podlahovka"],
};
const DOC_LINKS: Record<string, string[]> = {
  "s-d4": ["demo-el-podlahovka"],
};
const REMINDER_LINKS: Record<string, Partial<Property["reminders"][number]>> = {
  "s-r1": {
    elementId: "demo-el-kotel",
    intervalMonths: 12,
    lastDone: "2025-10-12",
    intervalConfirmed: true,
    confirmedBy: "Servisní technik (protokol 10/2025)",
  },
  "s-r2": { elementId: "demo-el-komin" },
  "s-r3": { elementId: "demo-el-stresni-okno" },
};
const INVENTORY_LINKS: Record<string, string> = {
  "s-i2": "demo-el-kotel",
  "s-i3": "demo-el-strecha",
};

// Doplní model a prvky k demo domu a naváže na ně jeho existující záznamy.
export function withDemoModel(p: Property): Property {
  return {
    ...p,
    models: [...(p.models ?? []), DEMO_MODEL],
    elements: [...(p.elements ?? []), ...DEMO_ELEMENTS],
    entries: p.entries.map((e) => (ENTRY_LINKS[e.id] ? { ...e, elementIds: ENTRY_LINKS[e.id] } : e)),
    documents: p.documents.map((d) => (DOC_LINKS[d.id] ? { ...d, elementIds: DOC_LINKS[d.id] } : d)),
    reminders: p.reminders.map((r) => (REMINDER_LINKS[r.id] ? { ...r, ...REMINDER_LINKS[r.id] } : r)),
    inventory: p.inventory.map((i) =>
      INVENTORY_LINKS[i.id] ? { ...i, elementId: INVENTORY_LINKS[i.id] } : i,
    ),
  };
}
