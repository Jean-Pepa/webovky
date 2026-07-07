import type { CalEvent, EventKind } from "./types";

// Milníky z almanachu Mařeny — „kdy co začít dělat". Jeden zdroj pravdy pro
// výchozí kalendář (seed) i pro tlačítko „Doplnit milníky z almanachu".
//
// Datumy jsou orientační a navázané na festival na přelomu září a října.
// Kdo má jiný termín, jednotlivé milníky si v kalendáři posune. `md` je
// „MM-DD", `endMd` dělá vícedenní událost (rozsah od–do).
export interface Milestone {
  id: string; // stabilní id (kvůli deduplikaci při doplňování)
  md: string; // "MM-DD"
  endMd?: string; // "MM-DD" — konec rozsahu (nepovinné)
  title: string;
  kind: EventKind;
  note?: string;
}

export const ALMANACH_MILESTONES: Milestone[] = [
  // ── Rozjezd (zima) ─────────────────────────────────────────────
  {
    id: "ms_kickoff",
    md: "01-15",
    title: "Rozjezd: rozdělit role, založit skupinu a společný účet",
    kind: "deadline",
    note: "Role: organizátor, ekonom, kapelník, výzdobář, kuchař, bavič. Účet drží jedna důvěryhodná osoba, na kterou je psaný. Flédu a datum řešit co nejdřív.",
  },
  {
    id: "ms_vklad",
    md: "02-01",
    title: "Vypsat a začít vybírat třídní vklad (~1500 Kč)",
    kind: "deadline",
    note: "Je to jen polštář — když se vydělá, vrací se celý. Počítej s ~3 koly upomínek.",
  },
  // ── Program (jaro) ─────────────────────────────────────────────
  {
    id: "ms_kapely",
    md: "03-01",
    title: "Domlouvat kapely (první v pořadí programu)",
    kind: "program",
    note: "Řeší ten, kdo kapelu zná (Maškarák / Plesh).",
  },
  {
    id: "ms_zahranicni",
    md: "03-15",
    title: "Oslovit zahraniční přednášející (min. půl roku předem)",
    kind: "prednaska",
    note: "Nejdelší proces — neodkládat.",
  },
  {
    id: "ms_tema",
    md: "04-01",
    title: "Vybrat téma ročníku (ať se může dělat grafika)",
    kind: "deadline",
  },
  // ── Červen: propagace, prváci, sponzoři ────────────────────────
  {
    id: "ms_propagace",
    md: "06-01",
    title: "Spustit propagaci, předat Instagram, založit FB událost",
    kind: "deadline",
    note: "Od června běží zápis prváků. Vše CZ i EN.",
  },
  {
    id: "ms_prvaci_zapis",
    md: "06-10",
    title: "Odchytit prváky u zápisu (Forte → Doubravová)",
    kind: "jine",
  },
  {
    id: "seed_e1", // původní seed — Fléda
    md: "06-15",
    title: "Zamluvit Flédu co nejdřív + vyřešit datum",
    kind: "deadline",
    note: "Pronájem cca 30–35 000 Kč. Flédě se pak pravidelně připomínej.",
  },
  {
    id: "ms_sponzori",
    md: "06-20",
    title: "Oslovit sponzory (The Roses jako první)",
    kind: "jine",
    note: "~95 % neodpoví — neber si to osobně a posílej dál. Piš z mařena mailu jako STUDENTSKÁ akce.",
  },
  // ── Léto: české přednášky, fakulta, aula, průvod ───────────────
  {
    id: "ms_ceske",
    md: "07-01",
    title: "Oslovit české přednášející (2–3 měsíce předem)",
    kind: "prednaska",
  },
  {
    id: "ms_sona",
    md: "07-05",
    title: "Ozvat se Soni Lisoňové (až je datum a nahozený program)",
    kind: "jine",
    note: "Zařídí tablety, dataprojektory, zvukaře placeného školou, banner na fasádu.",
  },
  {
    id: "ms_aula",
    md: "07-15",
    title: "Zamluvit aulu (p. Forte); pozor na sbor (p. Ocetek)",
    kind: "jine",
  },
  {
    id: "ms_pruvod_trasa",
    md: "07-20",
    title: "Průvod: sepsat trasu + odbor dopravy (L. Polánková)",
    kind: "pruvod",
    note: "Rozjeď byrokracii včas. Sled: městské části → BKOM → DPMB → policie.",
  },
  // ── Srpen ──────────────────────────────────────────────────────
  {
    id: "seed_e2", // původní seed — povolení průvodu
    md: "08-15",
    title: "Průvod: povolení min. 30 dní předem (odbor dopravy)",
    kind: "pruvod",
    note: "Hlásit jako kulturní akci. Počítej se správním poplatkem.",
  },
  {
    id: "ms_posty",
    md: "08-20",
    title: "Připravit posty a grafiky dopředu (programy, medailonky)",
    kind: "deadline",
  },
  // ── Září: finiš ────────────────────────────────────────────────
  {
    id: "ms_dekan",
    md: "09-01",
    title: "Děkan napíše na vrátnici (otevření do půlnoci)",
    kind: "deadline",
    note: "Bez toho vás vrátný ve 20–22 h vyhodí.",
  },
  {
    id: "ms_bozp",
    md: "09-01",
    title: "Podepsat BOZP formulář (p. Hasala)",
    kind: "deadline",
  },
  {
    id: "ms_nakupy",
    md: "09-05",
    title: "Nákupy (Makro), pípa (Rado), kelímky, zajistit auto",
    kind: "jine",
    note: "Napřed koukni, co zbylo z minulého ročníku.",
  },
  {
    id: "seed_e3", // původní seed — spuštění merche
    md: "09-10",
    title: "Spustit merch eshop (prvních pár dní školy)",
    kind: "deadline",
    note: "Předtím zkušební objednávka na sebe. Zdůrazňuj vyzvednutí NA DVOŘE.",
  },
  {
    id: "ms_merch_close",
    md: "09-19",
    title: "Zavřít merch eshop → dotisk podle poptávky",
    kind: "deadline",
  },
  {
    id: "ms_vyzdoba",
    md: "09-25",
    title: "Zdobit fakultu (stačí 1–2 dny předem)",
    kind: "jine",
    note: "Plán výzdoby předem ke schválení tajemníkovi. Materiál v uzamykatelné Arše/kotelně.",
  },
  // ── Festival (přelom září/října) ───────────────────────────────
  {
    id: "ms_festival",
    md: "09-28",
    endMd: "10-04",
    title: "🎪 Mařena — týden festivalu",
    kind: "program",
    note: "Přelom září/října, 7–10 dní. Uprav podle svého data.",
  },
  {
    id: "ms_prezentace",
    md: "09-28",
    title: "1. den: prezentace Mařeny prvákům v aule",
    kind: "program",
  },
  {
    id: "ms_listky",
    md: "10-01",
    title: "Prodávat lístky na Flédu (Archa/knihovna ~150, na místě ~200)",
    kind: "fleda",
  },
  {
    id: "ms_pruvod_den",
    md: "10-04",
    title: "Průvod městem (16:30 běhat, 17:20 odchod, 19:00 Fléda)",
    kind: "pruvod",
    note: "Min. 2 organizátoři v oranžových vestách. Organizátoři pijí až před Lužánkami.",
  },
  {
    id: "ms_fleda_krest",
    md: "10-04",
    title: "Fléda: křest prváků (zakončení festivalu)",
    kind: "fleda",
    note: "Prváci se MUSÍ najíst PŘED Flédou. Pošli 2–3 lidi napřed připravit křest.",
  },
  // ── Po festivalu ───────────────────────────────────────────────
  {
    id: "ms_vyuctovani",
    md: "10-07",
    title: "Vyúčtování (ze schovaných účtenek) + vrátit třídní vklad",
    kind: "deadline",
  },
];

// Postaví z milníků kalendářní události pro daný rok.
export function almanachMilestoneEvents(year: number, createdAt: string, author = "Mařena"): CalEvent[] {
  return ALMANACH_MILESTONES.map((m) => ({
    id: m.id,
    date: `${year}-${m.md}`,
    endDate: m.endMd ? `${year}-${m.endMd}` : undefined,
    title: m.title,
    kind: m.kind,
    note: m.note,
    author,
    createdAt,
  }));
}

// Vrátí jen milníky, které v kalendáři ještě nejsou — deduplikace podle
// stabilního id i podle názvu (ať se nepřidají duplikáty ke starším zápisům).
export function missingMilestoneEvents(existing: CalEvent[], year: number, createdAt: string, author = "Mařena"): CalEvent[] {
  const norm = (s: string) => s.trim().toLowerCase();
  const haveIds = new Set(existing.map((e) => e.id));
  const haveTitles = new Set(existing.map((e) => norm(e.title)));
  return almanachMilestoneEvents(year, createdAt, author).filter((e) => !haveIds.has(e.id) && !haveTitles.has(norm(e.title)));
}
