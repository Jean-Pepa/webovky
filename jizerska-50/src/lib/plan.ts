// 24týdenní periodizovaný plán přípravy na Jizerskou 50 (60. ročník, 11.–14. 2. 2027).
// Celá příprava je OFF-SNOW (bez běžek) — běh, chůze s holemi, imitace, síla, kolo.
// Princip: polarizovaný trénink 80/20 (většina lehce, málo tvrdě) + 2× síla týdně
// + progresivní dlouhé jednotky (over-distance) simulující délku závodu.

export type Zone = "Z1" | "Z2" | "Z3" | "Z4" | "Z5" | "-";

export type Kind =
  | "rest"
  | "run"
  | "long"
  | "intervals"
  | "poles"
  | "strength"
  | "cross";

export interface Session {
  day: string;
  kind: Kind;
  title: string;
  duration: string;
  zone: Zone;
  detail: string;
}

export interface Week {
  n: number;
  phase: string;
  phaseKey: PhaseKey;
  dateRange: string;
  focus: string;
  volume: string;
  sessions: Session[];
}

export type PhaseKey = "restart" | "base" | "specific" | "peak" | "taper";

export interface Phase {
  key: PhaseKey;
  name: string;
  weeks: string;
  goal: string;
  color: string; // tailwind text/bg accent klíč
}

export const PHASES: Phase[] = [
  {
    key: "restart",
    name: "1 · Restart & báze",
    weeks: "Týden 1–4 · Září",
    goal:
      "Rozjezd po letní pauze. Vybudovat návyk, znovu nastartovat aerobní motor, rozběhnout hubnutí a naučit tělo silový trénink. Zatím žádné tvrdé intervaly.",
    color: "leaf",
  },
  {
    key: "base",
    name: "2 · Aerobní motor",
    weeks: "Týden 5–10 · Říjen–půl listopadu",
    goal:
      "Navyšovat objem lehkého pohybu, přidat chůzi s holemi do kopce a imitační skoky. Síla přechází do hypertrofie (nabírání svalů). Dlouhé jednotky rostou.",
    color: "sky",
  },
  {
    key: "specific",
    name: "3 · Specifická síla & vytrvalost",
    weeks: "Týden 11–16 · Půl listopadu–prosinec",
    goal:
      "Trénink cílený na klasiku: silová vytrvalost dvojšlapu (horní půlka těla), imitační intervaly do kopce, over-distance 2–3 h. Přidávají se prahové intervaly.",
    color: "violet",
  },
  {
    key: "peak",
    name: "4 · Ladění výkonu",
    weeks: "Týden 17–21 · Leden",
    goal:
      "Nejtěžší blok. VO2max intervaly, simulace závodního tempa, nejdelší jednotky. Pokud se dostaneš na sníh, nahraď dlouhé jednotky lyžováním klasikou.",
    color: "marigold",
  },
  {
    key: "taper",
    name: "5 · Taper & závod",
    weeks: "Týden 22–24 · Únor",
    goal:
      "Sklízíš formu. Snížit objem o 40–50 %, udržet ostrost krátkými výběhy, doplnit sacharidy. Přijet na start odpočatý a nabitý. 🏁",
    color: "ink",
  },
];

// ---- Pomocné funkce pro data ------------------------------------------------

// Start = pondělí 31. 8. 2026. Týden N začíná v pondělí start + (N-1)*7 dní.
const START = new Date(Date.UTC(2026, 7, 31)); // měsíc 7 = srpen
const MONTHS = [
  "led", "úno", "bře", "dub", "kvě", "čvn",
  "čvc", "srp", "zář", "říj", "lis", "pro",
];

function weekDates(n: number): string {
  const mon = new Date(START.getTime() + (n - 1) * 7 * 86400000);
  const sun = new Date(mon.getTime() + 6 * 86400000);
  const f = (d: Date) => `${d.getUTCDate()}. ${MONTHS[d.getUTCMonth()]}`;
  return `${f(mon)} – ${f(sun)}`;
}

// ---- Sestavení plánu --------------------------------------------------------

const REST: Session = {
  day: "Po",
  kind: "rest",
  title: "Volno / mobilita",
  duration: "0–20 min",
  zone: "-",
  detail:
    "Úplné volno nebo lehká mobilita a protažení. Regenerace je součást tréninku — právě při ní tělo staví svaly a zesiluje.",
};

function restartWeek(n: number, i: number): Session[] {
  // i = pořadí v rámci fáze (0..3), delší dlouhá jednotka každý týden
  const longMin = [55, 65, 75, 60][i]; // 4. týden lehčí (deload)
  const runMin = [35, 40, 45, 35][i];
  return [
    REST,
    {
      day: "Út",
      kind: "run",
      title: "Klidný běh + core",
      duration: `${runMin} min`,
      zone: "Z2",
      detail:
        "Lehký souvislý běh, u kterého zvládneš mluvit v celých větách. Po běhu 15 min core (plank, mrtvý brouk, boční plank).",
    },
    {
      day: "St",
      kind: "strength",
      title: "Síla A — celotělová",
      duration: "45 min",
      zone: "-",
      detail:
        "Základní full-body: dřep, výpady, tlak nad hlavu, přítahy, plank. 3 série × 10–12 opakování, technika před vahou. Viz sekce Cviky.",
    },
    {
      day: "Čt",
      kind: "run",
      title: "Klidný běh",
      duration: `${runMin + 5} min`,
      zone: "Z2",
      detail: "Aerobní běh v Z2. Poslední 4× 20 s svižně (ne sprint) na rozhýbání nohou, plná pauza.",
    },
    {
      day: "Pá",
      kind: "cross",
      title: "Volno nebo procházka",
      duration: "30–45 min",
      zone: "Z1",
      detail: "Aktivní regenerace — svižná procházka, lehké kolo nebo úplné volno podle únavy.",
    },
    {
      day: "So",
      kind: "long",
      title: "Dlouhá jednotka",
      duration: `${longMin} min`,
      zone: "Z2",
      detail:
        "Nejdelší jednotka týdne, klidné tempo. Kombinuj běh a svižnou chůzi do kopce. Cíl: čas na nohou, ne rychlost.",
    },
    {
      day: "Ne",
      kind: "strength",
      title: "Síla B nebo kolo",
      duration: "40 min",
      zone: "Z1",
      detail:
        "Buď druhý lehčí silový okruh (core + záda + nohy), nebo 60 min klidného kola/plavání pro regeneraci.",
    },
  ];
}

function baseWeek(n: number, i: number): Session[] {
  // 6 týdnů; deload v 6. (i=5)
  const deload = i === 5;
  const longMin = deload ? 90 : [80, 90, 100, 110, 120][i];
  return [
    REST,
    {
      day: "Út",
      kind: "run",
      title: "Běh + rychlá stoupání",
      duration: "55 min",
      zone: "Z2",
      detail:
        "50 min Z2, pak 6× 15 s svižný výběh do kopce s plnou pauzou. Rozvíjí ekonomiku běhu a sílu nohou bez velké únavy.",
    },
    {
      day: "St",
      kind: "strength",
      title: "Síla A — hypertrofie",
      duration: "55 min",
      zone: "-",
      detail:
        "Nabírání svalů: dřep, rumunský mrtvý tah, tlak s jednoručkami, přítahy, výpady. 3–4 série × 8–12, poslední série do blízko selhání. + core.",
    },
    {
      day: "Čt",
      kind: "poles",
      title: "Chůze s holemi do kopce",
      duration: `${deload ? 55 : 60 + i * 5} min`,
      zone: "Z2",
      detail:
        "Nordic walking / ostrá chůze do kopce s trekovými holemi — nejbližší náhrada běžek bez sněhu. Aktivně odpichuj holemi. Na konci 4× 20 s imitační skoky.",
    },
    {
      day: "Pá",
      kind: "run",
      title: "Regenerační běh",
      duration: "40 min",
      zone: "Z1",
      detail: "Opravdu lehce, jen protočit. Kdyby byly nohy těžké, nahraď kolem nebo volnem.",
    },
    {
      day: "So",
      kind: "long",
      title: "Dlouhý běh",
      duration: `${longMin} min`,
      zone: "Z2",
      detail:
        "Progresivně nejdelší jednotka. Uprostřed kopcovitý profil. Vyzkoušej pití a jídlo za pohybu (gel/banán) — nácvik na závod.",
    },
    {
      day: "Ne",
      kind: "strength",
      title: "Síla B + kolo",
      duration: "50 + 45 min",
      zone: "Z1",
      detail:
        "Silový blok na záda a dvojšlap (přítahy, sklopky, trojhlavý sval, core) + 45 min klidné kolo. Trénuje horní půlku pro odpich.",
    },
  ];
}

function specificWeek(n: number, i: number): Session[] {
  // 6 týdnů; deload v 6. (i=5)
  const deload = i === 5;
  const longMin = deload ? 110 : [120, 135, 150, 165, 180][i];
  return [
    REST,
    {
      day: "Út",
      kind: "intervals",
      title: "Prahové intervaly",
      duration: "60 min",
      zone: "Z4",
      detail:
        `Rozklus 15 min, pak ${deload ? 3 : 4 + Math.min(i, 2)}× 6 min tempo na prahu (souvisle „nepříjemně, ale udržitelně") / 2 min klus, výklus 10 min.`,
    },
    {
      day: "St",
      kind: "strength",
      title: "Silová vytrvalost dvojšlapu",
      duration: "55 min",
      zone: "-",
      detail:
        "Horní půlka na odpich: kladka/gumy stahování shora dolů (imitace dvojšlapu), kliky, trojhlavý sval, přítahy, těžký core. Vyšší opakování 12–20, kratší pauzy.",
    },
    {
      day: "Čt",
      kind: "poles",
      title: "Imitační skoky do kopce",
      duration: "80 min",
      zone: "Z3",
      detail:
        `Chůze/běh s holemi 60 min Z2 + ${deload ? 4 : 6}× 30 s imitační odrazové skoky do prudkého kopce s holemi (klasika „střídavý běh"), pauza sejít dolů.`,
    },
    {
      day: "Pá",
      kind: "run",
      title: "Regenerační běh",
      duration: "45 min",
      zone: "Z1",
      detail: "Lehce, protočit nohy po intervalech. Protažení, případně masážní válec.",
    },
    {
      day: "So",
      kind: "long",
      title: "Over-distance",
      duration: `${Math.round(longMin / 60 * 10) / 10} h`,
      zone: "Z2",
      detail:
        "Klíčová jednotka bloku — dlouhý smíšený výstup: běh + chůze s holemi v kopcovitém terénu. Průběžně jez a pij (nácvik doplňování jako na 50 km). Tempo klidné.",
    },
    {
      day: "Ne",
      kind: "strength",
      title: "Síla celotělová + kolo",
      duration: "50 + 45 min",
      zone: "Z1",
      detail:
        "Udržovací silová jednotka (síla/výbušnost, 4–6 opakování těžce) + lehké kolo 45 min na vyplavení. Alternativa při únavě: jen kolo.",
    },
  ];
}

function peakWeek(n: number, i: number): Session[] {
  // 5 týdnů; poslední lehčí přechod do taperu (i=4)
  const easier = i === 4;
  const longMin = easier ? 150 : [180, 195, 210, 180][i];
  return [
    REST,
    {
      day: "Út",
      kind: "intervals",
      title: "VO2max intervaly",
      duration: "65 min",
      zone: "Z5",
      detail:
        `Rozklus 15 min, ${easier ? 4 : 5}× 3 min tvrdě (rychlé, ale kontrolované dýchání na hraně) / 3 min klus, výklus 10 min. Nejvyšší intenzita v plánu.`,
    },
    {
      day: "St",
      kind: "strength",
      title: "Udržovací síla + core",
      duration: "45 min",
      zone: "-",
      detail:
        "Kratší, ale ostrá: 3–4 hlavní cviky (dřep, přítah/kladka, tlak), 4–5 opakování těžce. Cíl je sílu UDRŽET, ne budovat únavu. + core na dvojšlap.",
    },
    {
      day: "Čt",
      kind: "poles",
      title: "Specifická síla s holemi",
      duration: "75 min",
      zone: "Z3",
      detail:
        "Chůze s holemi + 6–8× 1 min výstup jen s odpichem holí (nohy pasivní) do kopce — cílí přesně na svaly dvojšlapu na 50 km. Pauza sejít dolů.",
    },
    {
      day: "Pá",
      kind: "run",
      title: "Regenerační běh",
      duration: "40 min",
      zone: "Z1",
      detail: "Lehounce. Před sobotní dlouhou jednotkou nechat nohy odpočinout.",
    },
    {
      day: "So",
      kind: "long",
      title: "Dlouhá jednotka / na sníh",
      duration: `${Math.round(longMin / 60 * 10) / 10} h`,
      zone: "Z2",
      detail:
        "Nejdelší jednotky přípravy. POKUD JE SNÍH a dostaneš se na běžky, jeď místo toho klasiku 2,5–3,5 h — nejlepší možný trénink. Jinak dlouhý smíšený výstup s holemi.",
    },
    {
      day: "Ne",
      kind: "intervals",
      title: "Simulace závodního tempa",
      duration: "60 min",
      zone: "Z3",
      detail:
        `2–3× ${easier ? 8 : 12} min v tempu, jaké chceš držet na závodě (Z3, „svižné cestovní") / 5 min klus. Nauč tělo i hlavu závodní rytmus.`,
    },
  ];
}

function taperWeek(n: number, i: number): Session[] {
  if (i === 2) {
    // závodní týden
    return [
      { ...REST, day: "Po" },
      {
        day: "Út",
        kind: "run",
        title: "Krátký výběh s rovinkami",
        duration: "30 min",
        zone: "Z2",
        detail: "20 min lehce + 4× 20 s svižně. Jen udržet nohy ostré, žádná únava.",
      },
      {
        day: "St",
        kind: "cross",
        title: "Volno / lehká procházka",
        duration: "0–30 min",
        zone: "Z1",
        detail: "Odpočinek. Připrav vybavení, vosky, oblečení, plán občerstvení na trati.",
      },
      {
        day: "Čt",
        kind: "run",
        title: "Rozproudění",
        duration: "25 min",
        zone: "Z2",
        detail: "15 min klus + 3× 30 s v závodním tempu. Nabuzení svalů, ne vyčerpání.",
      },
      {
        day: "Pá",
        kind: "rest",
        title: "Volno + sacharidová superkompenzace",
        duration: "0 min",
        zone: "-",
        detail:
          "Úplné volno. Zvýšit příjem sacharidů (rýže, těstoviny, brambory), hodně pít. Dnes se hubnutí neřeší — plníš zásobník energie.",
      },
      {
        day: "So",
        kind: "run",
        title: "Předzávodní rozcvičení",
        duration: "20 min",
        zone: "Z2",
        detail: "Krátké protočení + pár rovinek. Brzy spát, vše nachystané.",
      },
      {
        day: "Ne",
        kind: "long",
        title: "🏁 ZÁVOD — Jizerská 50",
        duration: "50 km",
        zone: "Z2",
        detail:
          "Den D! Vyjeď kontrolovaně, prvních 15 km drž rezervu, jez a pij od začátku pravidelně. Celá příprava tě sem dovedla — užij si to.",
      },
    ];
  }
  const longMin = i === 0 ? 120 : 80;
  return [
    REST,
    {
      day: "Út",
      kind: "intervals",
      title: "Krátké ostré intervaly",
      duration: "50 min",
      zone: "Z4",
      detail:
        "Rozklus 15 min, 4× 3 min v prahovém tempu / 3 min klus, výklus. Kratší objem, udržet ostrost — forma se ladí, nebuduje.",
    },
    {
      day: "St",
      kind: "strength",
      title: "Lehká síla + core",
      duration: "30 min",
      zone: "-",
      detail: "Jen udržovací, 2 série hlavních cviků, žádné selhání. Hlavně mobilita a core.",
    },
    {
      day: "Čt",
      kind: "poles",
      title: "Chůze s holemi",
      duration: "60 min",
      zone: "Z2",
      detail: "Klidná specifická jednotka, pár krátkých odpichů. Užívej si pohyb.",
    },
    { ...REST, day: "Pá", title: "Volno" },
    {
      day: "So",
      kind: "long",
      title: "Zkrácená dlouhá jednotka",
      duration: `${Math.round(longMin / 60 * 10) / 10} h`,
      zone: "Z2",
      detail:
        "Poslední delší jednotka před závodem (jen 1. týden taperu), pak už jen kratší. Klidně, s doplňováním energie.",
    },
    {
      day: "Ne",
      kind: "cross",
      title: "Lehké kolo / regenerace",
      duration: "45 min",
      zone: "Z1",
      detail: "Aktivní regenerace, protažení, spánek. Necháváš tělo dobít.",
    },
  ];
}

function buildWeek(n: number): Week {
  let phase: Phase;
  let sessions: Session[];
  if (n <= 4) {
    phase = PHASES[0];
    sessions = restartWeek(n, n - 1);
  } else if (n <= 10) {
    phase = PHASES[1];
    sessions = baseWeek(n, n - 5);
  } else if (n <= 16) {
    phase = PHASES[2];
    sessions = specificWeek(n, n - 11);
  } else if (n <= 21) {
    phase = PHASES[3];
    sessions = peakWeek(n, n - 17);
  } else {
    phase = PHASES[4];
    sessions = taperWeek(n, n - 22);
  }

  const focusMap: Record<PhaseKey, string> = {
    restart: "Návyk, aerobní báze, rozjezd hubnutí",
    base: "Objem, chůze s holemi, hypertrofie",
    specific: "Dvojšlap, imitace, over-distance",
    peak: "VO2max, závodní tempo, nejdelší jednotky",
    taper: "Snížit objem, udržet ostrost, závod",
  };

  // deload/lehčí týdny označíme v objemu
  const isDeload =
    (phase.key === "base" && n === 10) ||
    (phase.key === "specific" && n === 16) ||
    (phase.key === "restart" && n === 4);
  const volumeByPhase: Record<PhaseKey, string> = {
    restart: "5–6 h",
    base: "7–9 h",
    specific: "8–10 h",
    peak: "9–11 h",
    taper: "3–6 h",
  };

  return {
    n,
    phase: phase.name,
    phaseKey: phase.key,
    dateRange: weekDates(n),
    focus: focusMap[phase.key],
    volume: isDeload ? `${volumeByPhase[phase.key]} (odlehčení)` : volumeByPhase[phase.key],
    sessions,
  };
}

export const PLAN: Week[] = Array.from({ length: 24 }, (_, i) => buildWeek(i + 1));

export const RACE_DATE = new Date(Date.UTC(2027, 1, 14)); // 14. 2. 2027

// ---- Legenda intenzitních zón ----------------------------------------------
export const ZONES: { z: Zone; name: string; feel: string }[] = [
  { z: "Z1", name: "Regenerace", feel: "Velmi lehce, konverzačně, sotva se zadýcháš" },
  { z: "Z2", name: "Aerobní báze", feel: "Lehce, mluvíš v celých větách — 80 % tréninku" },
  { z: "Z3", name: "Tempo", feel: "Svižné cestovní, mluvíš po krátkých větách" },
  { z: "Z4", name: "Práh", feel: "Nepříjemně, ale udržitelně; jen pár slov" },
  { z: "Z5", name: "VO2max", feel: "Tvrdě, na hraně, souvislá věta nejde" },
];

export const KIND_META: Record<Kind, { label: string; color: string; icon: string }> = {
  rest: { label: "Volno", color: "ink", icon: "○" },
  run: { label: "Běh", color: "sky", icon: "🏃" },
  long: { label: "Dlouhá", color: "violet", icon: "🥾" },
  intervals: { label: "Intervaly", color: "marigold", icon: "⚡" },
  poles: { label: "Hole/imitace", color: "leaf", icon: "🎿" },
  strength: { label: "Síla", color: "amber", icon: "🏋️" },
  cross: { label: "Doplněk", color: "cyan", icon: "🚴" },
};
