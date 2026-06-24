import type { DB } from "./types";
import { defaultRoleTasks } from "./actions";

// Výchozí stav při prvním spuštění. Jeden rozjetý ročník s úkoly rozdanými na
// role, milníky z manuálu, kontakty ve složkách a uvítací nástěnkou.
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
        plannedPeople: 30,
        deposit: 1500,
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
        tasks: defaultRoleTasks(t),
        links: [
          { id: "seed_l1", label: "Soňa Lisoňová", value: "sona.lisonova@fa.vut.cz", folder: "Fakulta", note: "Klíčová spojka — technika, zvukař, banner. Ozvat se až bude datum a program.", createdAt: t },
          { id: "seed_l2", label: "Vrátnice FA", value: "—", folder: "Fakulta", note: "Hlásit příjezdy externistů, otevření do půlnoci.", createdAt: t },
          { id: "seed_l3", label: "Odbor dopravy — pí Lenka Polánková", value: "Měnínská 4, Brno", folder: "Město a úřady", note: "Povolení průvodu, min. 30 dní předem.", createdAt: t },
          { id: "seed_l4", label: "Fléda", value: "https://www.fleda.cz", folder: "Klub Fléda", note: "Zamluvit co nejdřív, pronájem cca 30–35 000.", createdAt: t },
          { id: "seed_l5", label: "AlienPay (p. Vostal)", value: "generátor QR kódů na platby", folder: "Dodavatelé", note: "Ochotný nasdílet — stačí kontaktovat.", createdAt: t },
          { id: "seed_l6", label: "The Roses", value: "kafe — sponzorský dar", folder: "Sponzoři", note: "Chtějí sponzorovat i další ročník.", createdAt: t },
        ],
        finances: [
          { id: "seed_f1", kind: "prijem", label: "Třídní vklad (vzor)", amount: 1500, category: "vklad", who: "Petra", paid: true, createdAt: t },
          { id: "seed_f2", kind: "vydaj", label: "Pronájem Flédy (vzor)", amount: 32000, category: "Fléda", paid: false, createdAt: t },
        ],
      },
    ],
  };
}
