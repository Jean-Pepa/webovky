import type { DB } from "./types";

// Výchozí stav při prvním spuštění. Jeden rozjetý ročník s pár startovacími
// úkoly, milníky z manuálu a uvítací nástěnkou — ať background není prázdný.
export function seedDB(): DB {
  const year = new Date().getFullYear();
  const id = String(year);
  const t = new Date().toISOString();
  return {
    years: [
      {
        id,
        label: `Mařena ${id}`,
        theme: undefined,
        fledaDate: undefined,
        createdAt: t,
        members: [],
        posts: [
          {
            id: "seed_welcome",
            author: "Mařena",
            title: "Vítejte v zázemí Mařeny 👋",
            body:
              "Tady se všechno domlouvá, zapisuje a hlasuje. Nahoře si přepneš ročník, " +
              "v Týmu si vyber svoji roli (post) a v Nástěnce dávej ostatním vědět důležité info. " +
              "Anketa řeší rozhodování, Kalendář drží termíny a v Úkolech se deleguje. " +
              "Vše potřebné najdeš v Almanachu. Mařeny není nikdy dost.",
            pinned: true,
            createdAt: t,
          },
        ],
        polls: [
          {
            id: "seed_poll",
            question: "Jaké téma letošní Mařeny?",
            author: "Mařena",
            multi: false,
            closed: false,
            createdAt: t,
            options: [
              { id: "so1", label: "Vesmír", voters: [] },
              { id: "so2", label: "Pravěk", voters: [] },
              { id: "so3", label: "Noir / detektivka", voters: [] },
            ],
          },
        ],
        events: [
          { id: "seed_e1", date: `${year}-06-15`, title: "Zamluvit Flédu co nejdřív + vyřešit datum", kind: "deadline", author: "Mařena", createdAt: t },
          { id: "seed_e2", date: `${year}-08-15`, title: "Průvod: povolení min. 30 dní předem (odbor dopravy)", kind: "pruvod", author: "Mařena", createdAt: t },
          { id: "seed_e3", date: `${year}-09-10`, title: "Spustit merch eshop (prvních pár dní školy)", kind: "deadline", author: "Mařena", createdAt: t },
        ],
        tasks: [
          { id: "seed_t1", title: "Založit společný účet a vybrat třídní vklad", roleId: "ekonom", done: false, createdAt: t },
          { id: "seed_t2", title: "Domluvit se Soňou termín a co fakulta zaplatí", roleId: "fakulta", done: false, createdAt: t },
          { id: "seed_t3", title: "Obeslat první kapely a přednášející", roleId: "kapelnik", done: false, createdAt: t },
          { id: "seed_t4", title: "Vybrat téma ročníku, ať se může dělat grafika", roleId: "grafik", done: false, createdAt: t },
        ],
        links: [
          { id: "seed_l1", label: "Soňa Lisoňová (fakulta)", value: "klíčová spojka — technika, zvukař, banner", note: "Ozvat se až bude datum a nahozený program.", createdAt: t },
          { id: "seed_l2", label: "Odbor dopravy — pí Lenka Polánková", value: "Měnínská 4", note: "Povolení průvodu, min. 30 dní předem.", createdAt: t },
          { id: "seed_l3", label: "Fléda", value: "studentský klub — křest prváků", note: "Zamluvit co nejdřív, pronájem cca 30–35 000.", createdAt: t },
          { id: "seed_l4", label: "AlienPay (p. Vostal)", value: "generátor QR kódů pro platby na baru", note: "Ochotný nasdílet — stačí kontaktovat.", createdAt: t },
        ],
      },
    ],
  };
}
