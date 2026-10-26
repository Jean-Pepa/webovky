// „AI“ bez klíče: odpovědi a návrhy zápisů skládané přímo z dat pasu domu.
// Když je na serveru ANTHROPIC_API_KEY, odpovídá Claude (viz /api/bulo/*) a tohle je záloha.

import type { AppState } from "./store";
import type { Boiler, FieldRow } from "./types";
import { chimneyDue } from "./store";
import { DEVICES } from "./data";
import { dm, dmy, hm, nextTerm, relDays } from "./time";

export interface Answer {
  paragraphs: string[];
  image?: string;
  actions?: ("close_valve" | "open_model" | "open_terminy" | "open_spotreba")[];
}

const fold = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

export function localAnswer(question: string, hasPhoto: boolean, s: AppState, now: number): Answer {
  const q = fold(question);
  const leakWords = /skvrn|mokr|vlhk|tece|tekl|kape|kapk|zatek|unik|plisen|flek|louz|voda na|na zdi|mokro/;
  const isLeakQ = leakWords.test(q) || (hasPhoto && !!s.leak && s.leak.phase !== "fixed");

  if (isLeakQ) {
    if (s.leak && s.leak.phase !== "fixed") {
      const p = ["Za skvrnou vede **přívod vody od vodoměru**, koleno 70 cm nad podlahou (změřeno ±2 cm)."];
      if (s.leak.phase === "flow") p.push(`Hlídač průtoku hlásí **0,4 l/min od ${s.leak.since}**, i když nikdo vodu nepouští.`);
      else p.push(`Hlídač hlásil **0,4 l/min od ${s.leak.since}**. Uzávěr je zavřený od ${hm(s.leak.closedAt ?? now)}, teď teče 0,0 l/min.`);
      p.push("Nejspíš netěsní spoj u kolena. Poslední zásah: výměna vodoměru 3/2024.");
      return { paragraphs: p, image: "/aplikace/img/ph_stain_ar.jpg", actions: s.leak.phase === "flow" ? ["close_valve"] : [] };
    }
    if (s.leak?.phase === "fixed") {
      return {
        paragraphs: [
          "Za touto stěnou vede **přívod vody od vodoměru**, koleno 70 cm nad podlahou.",
          `Únik u kolena opravil instalatér ${dm(s.leak.fixedAt ?? now)} (spoj utěsněn, tlaková zkouška 6 bar · 15 min). Hlídač teď hlásí **0,0 l/min**.`,
          "Zeď může vysychat několik dní. Když skvrna poroste, vyfoťte ji znovu.",
        ],
        image: "/aplikace/img/ph_stain_ar.jpg",
      };
    }
    if (s.water) {
      return {
        paragraphs: [
          "Za touto stěnou vede **přívod vody od vodoměru**, koleno 70 cm nad podlahou (změřeno ±2 cm).",
          "Hlídač průtoku teď hlásí **0,0 l/min**, voda neteče. Skvrna může být stará nebo od kondenzace na trubce.",
          "Vyfoťte ji zítra znovu, porovnám, jestli roste.",
        ],
        image: "/aplikace/img/ph_stain_ar.jpg",
      };
    }
    return {
      paragraphs: [
        "Za touto stěnou vede **přívod vody od vodoměru**, koleno 70 cm nad podlahou (změřeno ±2 cm).",
        "Hlídač vody v domě zatím není, takže nevím, jestli voda teče. Připojte ho k vodoměru: Hlídače → Nový hlídač.",
      ],
      image: "/aplikace/img/ph_stain_ar.jpg",
    };
  }

  if (/vrt|hreb|povesit|obraz|polic|kotv|hmozd|skrin/.test(q)) {
    return {
      paragraphs: [
        "Ve zdi u kotle vede **plyn 85 cm nad podlahou** (±2 cm) a **elektro F7 svisle nad zásuvkou** (±1 cm).",
        "Nevrtejte v pásu ±5 cm kolem těchto tras. Všechny rozvody v domě uvidíte v modelu.",
      ],
      actions: ["open_model"],
    };
  }

  if (/komin|kominik|saze|kourovod/.test(q)) {
    const due = chimneyDue(s);
    const booked = s.chimneyBooked ? ` Objednáno: ${s.chimneyBooked.who}, ${s.chimneyBooked.slot}.` : "";
    return {
      paragraphs: [
        `Kontrola komína je povinná 1× ročně (vyhl. 34/2016 Sb.). Další je **${relDays(due, now)}** (${dmy(due)}).${booked}`,
        "Minule 10/2025 bez závad. Hlídač v kouřovodu ukazuje usazeniny 64 %, vyčistit do 30 dní.",
      ],
      actions: ["open_terminy"],
    };
  }

  if (/kotel|kotl|topen|topi|radiator|tepla voda|ohrev/.test(q)) {
    const b = s.boiler;
    return {
      paragraphs: [
        `Kotel **${b.model}** (${b.power}) je v technické místnosti, z chodby 2. dveře vlevo.`,
        `Poslední servis ${b.serviceLast}, další ${b.serviceNext === "dnes" ? "dnes (objednáno)" : b.serviceNext}. Záruka do ${b.warranty}.`,
        s.oldBoilers.length ? `Předchozí kotel ${s.oldBoilers[0].model} je v historii domu.` : "Spotřeba plynu je o 18 % vyšší než loni při stejném počasí. Seřízení kotle by ji mělo snížit.",
      ],
    };
  }

  if (/zaruk|reklam|zarucni/.test(q)) {
    return {
      paragraphs: [
        `Záruky: kotel ${s.boiler.model} do **${s.boiler.warranty}**, zásobník teplé vody do **4/2029**.`,
        "Záruční listy a návody najdete v Dokumentech → Záruky a návody.",
      ],
    };
  }

  if (/spotreb|elektrin|ucet|kolik.*(plyn|vod|elektr)|plyn/.test(q)) {
    return {
      paragraphs: [
        "Za poslední měsíc: elektřina **312 kWh** (−6 % meziročně), voda **4,1 m³** (+2 %), plyn **96 m³** (+18 %).",
        "Plyn je o 18 % výš než loni při stejném počasí. Kotel možná potřebuje seřízení.",
      ],
      actions: ["open_spotreba"],
    };
  }

  const where = /kde (je|jsou|najdu|mam|vede)|kudy/.test(q);
  if (where) {
    const hit = DEVICES.find((d) => {
      const n = fold(d.name);
      return n.split(" ").some((w) => w.length > 3 && q.includes(w.slice(0, Math.max(4, w.length - 2))));
    });
    if (hit) return { paragraphs: [`**${hit.name}**: ${hit.room}, ${hit.where}.`, `${hit.type}.`] };
    if (/uzaver|ventil/.test(q)) return { paragraphs: ["**Hlavní uzávěr vody**: technická místnost, u okna za vodoměrem."] };
    if (/jistic|pojist/.test(q)) return { paragraphs: ["**Rozvaděč R1**: chodba u vstupu, vlevo za dveřmi. Okruh F7 je zásuvka u kotle."] };
  }

  if (/dokument|povoleni|vykres|pbr|stitek|penb|revize|kolaudac|projekt/.test(q)) {
    return {
      paragraphs: [
        "Povolení stavby **ověřeno**, PBŘ z projektu, energetický štítek **třída C**.",
        "Revize: elektro, plyn a komín jsou, **chybí revize spalinové cesty**. Kolaudace má termín 30. 11.",
      ],
    };
  }

  return {
    paragraphs: [
      "Na tohle v pasu domu odpověď nemám.",
      "Zeptejte se na zařízení, rozvody ve zdi, termíny, spotřebu nebo dokumenty, třeba „Kde je hlavní uzávěr vody?“ nebo „Kde můžu vrtat u kotle?“",
    ],
  };
}

// ---------- Česká čísla slovy (diktování) ----------
const UNITS: Record<string, number> = {
  nula: 0, jedna: 1, jeden: 1, jedno: 1, dva: 2, dve: 2, tri: 3, ctyri: 4, pet: 5, sest: 6, sedm: 7, osm: 8, devet: 9,
  deset: 10, jedenact: 11, dvanact: 12, trinact: 13, ctrnact: 14, patnact: 15, sestnact: 16, sedmnact: 17, osmnact: 18, devatenact: 19,
};
const TENS: Record<string, number> = { dvacet: 20, tricet: 30, ctyricet: 40, padesat: 50, sedesat: 60, sedmdesat: 70, osmdesat: 80, devadesat: 90, sto: 100 };

/** Najde číslo (cifry nebo slovy) těsně před jednotkou, např. „CO dvanáct ppm“ → 12. */
export function numberBefore(text: string, unit: RegExp): number | null {
  const t = fold(text).replace(/[„“",.]/g, " ");
  const words = t.split(/\s+/).filter(Boolean);
  for (let i = 0; i < words.length; i++) {
    if (!unit.test(words[i])) continue;
    const prev = words.slice(Math.max(0, i - 3), i);
    const digits = prev.join(" ").match(/(\d+(?:[.,]\d+)?)\s*$/);
    if (digits) return parseFloat(digits[1].replace(",", "."));
    let total = 0;
    let found = false;
    for (const w of prev) {
      if (w in TENS) {
        total += TENS[w];
        found = true;
      } else if (w in UNITS) {
        total += UNITS[w];
        found = true;
      } else if (found) {
        total = 0;
        found = false;
      }
    }
    if (found) return total;
  }
  return null;
}

export interface Draft {
  title: string;
  fields: FieldRow[];
}

export function localDraft(kind: "unik" | "servis" | "obecny", sentence: string, docNames: string[], now: number, deviceName?: string): Draft {
  const t = fold(sentence);
  if (kind === "unik") {
    const pressureDoc = docNames.some((n) => /tlak/i.test(fold(n)));
    const bar = numberBefore(sentence, /^bar/);
    const measured: FieldRow = pressureDoc
      ? { k: "Naměřeno", v: "6 bar · 15 min", note: "z protokolu" }
      : { k: "Naměřeno", v: bar ? `${String(bar).replace(".", ",")} bar` : "—" };
    return {
      title: "Oprava úniku vody",
      fields: [
        { k: "Úkon", v: "Oprava úniku vody" },
        { k: "Výsledek", v: /bez uniku|utesn|tesn|opraven|v poradku/.test(t) ? "Spoj utěsněn" : "Opraveno" },
        measured,
        { k: "Další krok", v: "Hlídač hlídá dál" },
      ],
    };
  }
  if (kind === "servis") {
    const co = numberBefore(sentence, /^ppm/);
    const flueDoc = docNames.some((n) => /spalin|reviz/i.test(fold(n)));
    return {
      title: "Servis kotle",
      fields: [
        { k: "Úkon", v: "Servis kotle" },
        { k: "Výsledek", v: /v norme|bez zavad|v poradku|ok\b|spravne/.test(t) ? "Bez závad" : "Viz poznámka" },
        co !== null ? { k: "Naměřeno", v: `CO ${String(co).replace(".", ",")} ppm` } : flueDoc ? { k: "Naměřeno", v: "spaliny v normě", note: "z protokolu" } : { k: "Naměřeno", v: "—" },
        { k: "Další termín", v: nextTerm(now, 12), note: "vytvoří se sám" },
      ],
    };
  }
  const first = sentence.replace(/[„“"]/g, "").split(/[,.;]/)[0].trim();
  return {
    title: deviceName ? `Zápis · ${deviceName}` : "Zápis",
    fields: [
      { k: "Úkon", v: first ? first.charAt(0).toUpperCase() + first.slice(1, 48) : "Údržba" },
      { k: "Výsledek", v: "Hotovo" },
      { k: "Kde", v: deviceName ?? "Chata Loučky" },
    ],
  };
}

// ---------- Nový kotel: co se změní ----------
export function localBoilerFromDoc(now: number): Boiler {
  const d = new Date(now);
  const inst = `${d.getMonth() + 1}/${d.getFullYear()}`;
  const war = `${d.getMonth() + 1}/${d.getFullYear() + 5}`;
  return {
    model: "KK 28 Plus",
    power: "28 kW",
    serial: "2610-204551",
    warranty: war,
    installed: inst,
    serviceLast: inst,
    serviceNext: nextTerm(now, 12),
    flueCheck: "do 30 dní",
  };
}
