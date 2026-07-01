// Teoretický podklad — souhrn hloubkového researchu, o který se plán opírá.
// Psáno pro sportovce, ne pro vědce: proč to funguje a co z toho plyne pro trénink.

export interface TheoryBlock {
  title: string;
  body: string[];
}

export interface TheorySection {
  id: string;
  heading: string;
  lead: string;
  blocks: TheoryBlock[];
}

export const THEORY: TheorySection[] = [
  {
    id: "zavod",
    heading: "Co je Jizerská 50 a co si žádá",
    lead:
      "60. ročník se jede 11.–14. února 2027 v Bedřichově, hlavní trať měří 50 km klasickou technikou a je součástí seriálu Worldloppet. Je to největší hromadný běžkařský závod ve střední Evropě.",
    blocks: [
      {
        title: "Fyziologie závodu",
        body: [
          "Běh na lyžích patří k aerobně nejnáročnějším sportům vůbec — špičkoví běžkaři mají jedny z nejvyšších naměřených hodnot VO2max ze všech sportovců, protože pracuje horní i dolní polovina těla zároveň.",
          "50 km klasikou trvá rekreačnímu závodníkovi zhruba 3–5 hodin převážně v aerobním pásmu. Rozhoduje tedy hlavně vytrvalost (aerobní motor) a schopnost dlouho opakovat odpich, ne maximální rychlost.",
          "Klasika = střídavý běh (diagonál) do kopců + dvojšlap (odpich obou holí naráz) na rovinách a mírných sjezdech. Dvojšlap zapojuje výrazně horní půlku těla a střed — proto je silový trénink trupu a paží tak důležitý.",
        ],
      },
      {
        title: "Tvoje výchozí situace",
        body: [
          "23 let, 185 cm, ~98 kg, druhým rokem na běžkách a jde ti to. V květnu jsi zaběhl maraton — máš tedy slušnou aerobní bázi a hlavu zvyklou na dlouhý výkon.",
          "Od května do září nesportuješ, takže část formy poklesne — plán proto začíná opatrným restartem, ne rovnou tvrdě.",
          "Běhat můžeš, ale na běžkách trénovat ne (chybí sníh) — proto je celá příprava postavená na suchých náhradách: běh, chůze s holemi, imitace, síla, kolo.",
        ],
      },
    ],
  },
  {
    id: "polarizace",
    heading: "Princip 1 — Polarizovaný trénink 80/20",
    lead:
      "Nejlépe prověřený přístup vytrvalců: ~80 % objemu jezdi lehce (Z1–Z2) a jen ~20 % tvrdě (Z4–Z5). Střední „šedá zóna“ se z velké části vynechává.",
    blocks: [
      {
        title: "Proč to funguje",
        body: [
          "Většina adaptací vytrvalce (víc mitochondrií, hustší kapiláry, lepší spalování tuků, silnější srdce) vzniká z velkého objemu LEHKÉHO pohybu — ne z toho, že se pořád ničíš.",
          "Tvrdý trénink je účinný, ale drahý na regeneraci. Malá dávka (jedna, později dvě jednotky týdně) přidá vrchol formy, aniž tě přetrénuje.",
          "Nejčastější chyba amatérů: běhat pořád „středně rychle“. To je moc pomalé na zlepšení špičky a moc rychlé na kvalitní regeneraci. Buď opravdu lehce, nebo opravdu tvrdě.",
        ],
      },
      {
        title: "Jak poznáš zóny bez měřáku",
        body: [
          "Z2 (báze, 80 %): mluvíš v celých větách, dýcháš nosem, po jednotce se cítíš svěží. Tady tráv většinu času.",
          "Z4 (práh): udržitelně nepříjemné, zvládneš pár slov. Sem patří prahové intervaly.",
          "Z5 (VO2max): tvrdě, na hraně, souvislá věta nejde. Jen krátké intervaly v lednovém bloku.",
        ],
      },
    ],
  },
  {
    id: "periodizace",
    heading: "Princip 2 — Periodizace (od obecného ke specifickému)",
    lead:
      "24 týdnů je rozděleno do fází, které jdou od široké aerobní báze postupně ke stále specifičtějšímu tréninku klasiky a vrcholu formy na závod.",
    blocks: [
      {
        title: "Pět fází",
        body: [
          "1 · Restart & báze (zář): opatrný rozjezd, návyk, aerobní motor, rozběhnutí hubnutí a síly.",
          "2 · Aerobní motor (říj–půl lis): roste objem, přidává se chůze s holemi a imitace, síla míří do hypertrofie (svaly).",
          "3 · Specifická síla & vytrvalost (půl lis–pro): silová vytrvalost dvojšlapu, imitační intervaly, dlouhé over-distance 2–3 h.",
          "4 · Ladění výkonu (led): VO2max intervaly, závodní tempo, nejdelší jednotky. Když je sníh, přesouváš se na běžky.",
          "5 · Taper & závod (úno): objem dolů o 40–50 %, udržet ostrost, doplnit sacharidy, odpočatý na start.",
        ],
      },
      {
        title: "Odlehčovací (deload) týdny",
        body: [
          "Každé 3–4 týdny přijde lehčí týden se sníženým objemem. Právě v klidu tělo dožene adaptace a zesílí.",
          "Progrese není přímka — je to schody: zatížit, odlehčit, posunout se výš. Vynechávání deloadů vede k únavě a zranění.",
        ],
      },
    ],
  },
  {
    id: "sila",
    heading: "Princip 3 — Síla a specifika bez sněhu",
    lead:
      "Bez běžek se dá připravit překvapivě dobře. Klíč je trefit pohyby, které přenesou sílu do klasiky — hlavně dvojšlap (horní půlka + core) a odraz nohou.",
    blocks: [
      {
        title: "Suché náhrady běžek",
        body: [
          "Chůze/běh s holemi do kopce (Nordic walking): nejbližší celotělová náhrada, aerobně i silově zapojí ruce, trup i nohy.",
          "Imitační skoky do kopce: velké odrazové skoky z nohy na nohu s holemi = přímá imitace střídavého běhu.",
          "Odpich jen holemi do kopce (double poling): izoluje a staví přesně ten sval, který nese dvojšlap na rovinách 50 km.",
          "Kolo a plavání: doplňkový aerobní objem šetrný ke kloubům, dobré pro regeneraci a hubnutí.",
        ],
      },
      {
        title: "Silovna cíleně",
        body: [
          "Horní půlka na odpich: stahování kladky/gumy shora dolů (imitace dvojšlapu), kliky, triceps, přítahy.",
          "Nohy: dřep, rumunský mrtvý tah, jednonohé cviky (výpady, výstupy) pro odraz a stabilitu.",
          "Core: plank, mrtvý brouk, anti-rotace — pevný střed přenáší sílu holí do pohybu.",
          "2 silové jednotky týdně prokazatelně zlepšují ekonomiku i výkon běžkaře a chrání před zraněním.",
        ],
      },
    ],
  },
  {
    id: "recompo",
    heading: "Princip 4 — Hubnutí 98 → 85 kg a nabírání svalů zároveň",
    lead:
      "Chceš zhubnout 13 kg a přitom nabrat svaly (body recomposition). Dobrá zpráva: jsi přesně ten typ, u kterého to jde nejlíp — s nadváhou a po tréninkové pauze.",
    blocks: [
      {
        title: "Proč to u tebe půjde",
        body: [
          "Tělo s většími tukovými zásobami a po pauze umí čerpat energii z tuku na stavbu svalů i v mírném kalorickém deficitu — tzv. „newbie/returner“ efekt.",
          "Podmínky recompa jsou jasné: silový trénink (spouští růst svalu), dost bílkovin (staví a chrání svaly), mírný deficit (ubírá tuk) a spánek (regenerace).",
          "Váha na osobní váze bude klesat pomaleji, než odpovídá spálenému tuku, protože zároveň přibývá sval a voda ve svalech. To je v pořádku — sleduj i pas a zrcadlo, ne jen číslo.",
        ],
      },
      {
        title: "Konkrétní čísla",
        body: [
          "Deficit ~500 kcal/den ≈ 0,5–0,65 kg úbytku týdně → 13 kg zvládneš zhruba do 5 měsíců, tedy do poloviny přípravy. Pak přejdi na udržování, aby netrpěl výkon.",
          "Bílkoviny ~2 g na kg hmotnosti (tj. ~180–200 g denně) rozložené do 4 jídel. To je pro recompo nejdůležitější živina.",
          "Sacharidy načasuj kolem tréninků — jsou palivo pro dlouhé a tvrdé jednotky. V dnech dlouhých jednotek deficit zmírni.",
          "Nehubni tvrději než ~0,7 kg/týden. Větší deficit ukrojí ze svalů, výkonu i imunity — a na běžkách to poznáš.",
        ],
      },
      {
        title: "Pozor na konflikt cílů",
        body: [
          "Maximální nabírání svalů a maximální vytrvalost si trochu odporují (tzv. interference efekt). Pro amatéra to ale není problém — silový trénink zaměř na core a horní půlku pro dvojšlap a na funkční sílu nohou, ne na kulturistický objem stehen.",
          "Priorita je jasná: aerobní motor a specifika klasiky > velikost svalů. Svaly bereš jako bonus, který zvýší výkon a spálí víc tuku.",
        ],
      },
    ],
  },
  {
    id: "regenerace",
    heading: "Princip 5 — Regenerace, spánek a prevence",
    lead:
      "Trénink je jen podnět — zesílíš, až když se zregeneruješ. Bez spánku a klidu se plán obrátí proti tobě.",
    blocks: [
      {
        title: "Základ regenerace",
        body: [
          "Spánek 7–9 h je nejsilnější „doplněk“ na výkon i hubnutí. Nedostatek spánku zvyšuje chuť k jídlu a bere svaly.",
          "Aspoň 1 den v týdnu úplné volno. Poslouchej tělo — nemoc nebo velká únava = zpomal, neber to jako selhání.",
          "Mobilita a protažení po dlouhých jednotkách udrží zdravé kyčle, kotníky a ramena přes celých 24 týdnů.",
        ],
      },
      {
        title: "Jak nepřepálit start",
        body: [
          "Po letní pauze nezačínej hrdinsky. Prvních pár týdnů schválně vypadá lehce — buduje se šlacha, kloub a návyk, ne rekordy.",
          "Objem navyšuj postupně (řádově ~10 % týdně) a respektuj deload týdny. Většina zranění vzniká z příliš rychlého nárůstu.",
        ],
      },
    ],
  },
];

export interface Source {
  label: string;
  url: string;
}

export const SOURCES: Source[] = [
  { label: "ČEZ Jizerská 50 — oficiální propozice a program (jiz50.cz)", url: "https://jiz50.cz/en/propozice/cez-jizerska-50" },
  { label: "Jizerská padesátka — Wikipedia", url: "https://en.wikipedia.org/wiki/Jizersk%C3%A1_pades%C3%A1tka" },
  { label: "Dryland Training 101 pro běžkaře — BigLife Magazine", url: "https://www.biglifemag.com/dryland-training-101-endurance-strength-coordination-cross-country-skiing/" },
  { label: "Dryland Training 101 — Nordic Racers Ski Club", url: "https://www.nordicracers.ca/tips-from-our-coaches-1/2019/3/25/dryland-training-101" },
  { label: "Polarizovaný trénink 80/20 — Marathon Handbook", url: "https://marathonhandbook.com/polarized-training/" },
  { label: "Polarized Training s Dr. Stephenem Seilerem — Fast Talk Labs", url: "https://www.fasttalklabs.com/pathways/polarized-training/" },
  { label: "Body Recomposition — Healthline", url: "https://www.healthline.com/nutrition/body-recomposition" },
  { label: "8-Week Body Recomposition Guide — Transparent Labs", url: "https://www.transparentlabs.com/blogs/all/body-recomposition-how-to-lose-fat-and-gain-muscle" },
];
