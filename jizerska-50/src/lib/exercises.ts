// Zásobník cviků pro běžkaře-klasika bez sněhu. Zaměření: dvojšlap (horní půlka
// + core), síla a výbušnost nohou, imitace a stabilita. Vše doplňkově k běhu.

export type Group = "core" | "upper" | "legs" | "ski" | "mobility";

export interface Exercise {
  name: string;
  group: Group;
  sets: string;
  why: string;
  how: string;
}

export const GROUPS: { key: Group; label: string; note: string }[] = [
  { key: "core", label: "Core & střed těla", note: "Přenos síly z holí do trupu — základ dvojšlapu." },
  { key: "upper", label: "Horní půlka & dvojšlap", note: "Odpich holemi = triceps, záda, prsa, ramena." },
  { key: "legs", label: "Nohy & výbušnost", note: "Odraz, střídavý běh, stabilita na jedné noze." },
  { key: "ski", label: "Imitace & specifika", note: "Nejbližší náhrada pohybu na běžkách bez sněhu." },
  { key: "mobility", label: "Mobilita & prevence", note: "Zdravé kyčle, kotníky a ramena = bez zranění." },
];

export const EXERCISES: Exercise[] = [
  // CORE
  {
    name: "Plank (prkno)",
    group: "core",
    sets: "3 × 30–60 s",
    why: "Zpevňuje střed těla, kterým se přenáší síla odpichu do skluzu. Bez pevného core se energie z holí „ztratí“.",
    how: "Předloktí a špičky na zemi, tělo v jedné přímce, zpevnit břicho a hýždě, nepovolit boky.",
  },
  {
    name: "Mrtvý brouk (dead bug)",
    group: "core",
    sets: "3 × 10/stranu",
    why: "Učí držet stabilní bederní páteř při pohybu končetin — přesně to, co dvojšlap dělá.",
    how: "Leh na záda, ruce a pokrčené nohy nahoru. Pomalu natahuj opačnou ruku a nohu, bedra tlač do země.",
  },
  {
    name: "Pallof press (anti-rotace)",
    group: "core",
    sets: "3 × 12/stranu",
    why: "Posiluje odolnost trupu proti rotaci — stabilizuje tělo při jednostranném odpichu.",
    how: "Guma/kladka ze strany, ruce před hrudník, vytlač dopředu a drž, nenech se stočit.",
  },
  {
    name: "Hyperextenze / sklopky",
    group: "core",
    sets: "3 × 12–15",
    why: "Silná spodní část zad chrání před bolestí při dlouhém předklonu ve dvojšlapu.",
    how: "Na lavici nebo zemi zvedej trup proti gravitaci, kontrolovaně, bez švihu.",
  },

  // UPPER / DVOJŠLAP
  {
    name: "Stahování kladky shora (lat pulldown)",
    group: "upper",
    sets: "4 × 10–12",
    why: "Nejpřímější imitace dvojšlapu — táhneš rukama shora dolů přesně jako s holemi.",
    how: "Sed, úchop na šíři ramen, táhni lokty dolů k tělu, kontrolovaně pouštěj. Nešvihej trupem.",
  },
  {
    name: "Stahování gumy shora (na doma)",
    group: "upper",
    sets: "4 × 15–20",
    why: "Domácí varianta odpichu — trénuje silovou vytrvalost dvojšlapu bez posilovny.",
    how: "Gumu zaháknout vysoko, chytit oběma rukama a stahovat dolů k bokům, mírný předklon jako na běžkách.",
  },
  {
    name: "Kliky",
    group: "upper",
    sets: "3 × max",
    why: "Prsa, ramena a triceps — dokončení odpichu, kdy paže tlačí za tělo.",
    how: "Tělo v přímce, lokty mírně k tělu, hrudník k zemi a zpět. Lehčí varianta na kolenou.",
  },
  {
    name: "Tricepsové stahy / dipy",
    group: "upper",
    sets: "3 × 12–15",
    why: "Triceps dokončuje každý odpich — na 50 km se sečte tisíckrát.",
    how: "Kladka/guma dolů, lokty u těla, natahuj paže. Nebo dipy o lavici.",
  },
  {
    name: "Přítahy v předklonu / veslování",
    group: "upper",
    sets: "3 × 10–12",
    why: "Vyrovnává tlakové cviky, drží zdravá ramena a záda při hodinách odpichu.",
    how: "Předklon s rovnými zády, táhni jednoručky/činku k bokům, lopatky k sobě.",
  },

  // LEGS
  {
    name: "Dřep (goblet / s činkou)",
    group: "legs",
    sets: "3–4 × 8–12",
    why: "Základ síly nohou pro střídavý běh do kopce a stabilní odraz.",
    how: "Chodidla na šíři ramen, klesej boky dozadu a dolů, kolena ven, záda rovná. Nahoru přes paty.",
  },
  {
    name: "Rumunský mrtvý tah",
    group: "legs",
    sets: "3 × 8–10",
    why: "Zadní řetězec (hamstringy, hýždě) = motor odrazu a ochrana zad.",
    how: "Mírně pokrčená kolena, boky dozadu, činka klouže podél stehen, záda rovná. Cítíš tah v zadní straně stehen.",
  },
  {
    name: "Bulharské výpady",
    group: "legs",
    sets: "3 × 8/nohu",
    why: "Jednostranná síla a stabilita — běžky i běh jsou pořád přenášení váhy z nohy na nohu.",
    how: "Zadní noha na lavici, klesej předním kolenem dolů, koleno nad kotníkem, nahoru přes patu.",
  },
  {
    name: "Výstupy na bednu (step-up)",
    group: "legs",
    sets: "3 × 10/nohu",
    why: "Imituje výšlap do kopce, posiluje jednonohou sílu a rovnováhu.",
    how: "Nášlap celou plochou na bednu/lavici, propni se nahoru přes patu, kontrolovaně dolů.",
  },
  {
    name: "Výpony na lýtka",
    group: "legs",
    sets: "3 × 15–20",
    why: "Silná lýtka a kotníky drží odraz a chrání achilovku při imitačních skocích.",
    how: "Stoj na špičkách, pomalu nahoru a dolů, ideálně z hrany schodu pro plný rozsah.",
  },

  // SKI / IMITACE
  {
    name: "Imitační skoky do kopce (klasika)",
    group: "ski",
    sets: "6 × 30 s",
    why: "Nejlepší suchá náhrada střídavého běhu na běžkách — spojuje odraz nohy, práci holí a rytmus.",
    how: "Prudší kopec, odrážej se z nohy na nohu velkými skoky, aktivně zapichuj hole a odpichuj. Pauza sejít dolů.",
  },
  {
    name: "Chůze/běh s holemi (Nordic walking)",
    group: "ski",
    sets: "60–90 min",
    why: "Zapojuje horní půlku i nohy v kombinaci jako běžky, aerobně, šetrně ke kloubům.",
    how: "Trekové/nordic hole, aktivní odpich za tělo, vzpřímené držení, dýchej klidně. Ideál do kopcovitého terénu.",
  },
  {
    name: "Odpich jen holemi do kopce (double poling)",
    group: "ski",
    sets: "6–8 × 1 min",
    why: "Izoluje sval dvojšlapu — cíleně staví vytrvalost horní půlky na rovinaté pasáže 50 km.",
    how: "Do mírného kopce postupuj POUZE odpichem holí, nohy pasivní jen kráčí. Předklon, tlač holemi až za boky.",
  },
  {
    name: "Skate bounding (imitace bruslení)",
    group: "ski",
    sets: "4 × 30 s",
    why: "Laterální výbušnost a rovnováha na jedné noze — hodí se, i když jedeš klasiku.",
    how: "Odrážej se šikmo do strany z nohy na nohu, dolet a stabilizace, doprovázej pohybem paží.",
  },

  // MOBILITY
  {
    name: "Mobilita kyčlí (90/90, výpad s rotací)",
    group: "mobility",
    sets: "5–8 min",
    why: "Volné kyčle = delší krok a odraz, méně bolavých zad při dlouhém předklonu.",
    how: "Střídej sed 90/90 s rotací trupu a hluboký výpad s rotací k přední noze. Dýchej do rozsahu.",
  },
  {
    name: "Mobilita hrudní páteře",
    group: "mobility",
    sets: "5 min",
    why: "Pohyblivý hrudník umožní silný odpich holemi a chrání ramena i krční páteř.",
    how: "Rotace vsedě/na čtyřech (thread the needle), otevírání hrudníku přes válec.",
  },
  {
    name: "Mobilita kotníků",
    group: "mobility",
    sets: "3 × 10/stranu",
    why: "Volný kotník zlepší odraz a sníží riziko úrazu při imitačních skocích a v terénu.",
    how: "Koleno přes špičku ke zdi bez zvednutí paty, kolébej dopředu, postupně zvětšuj vzdálenost.",
  },
  {
    name: "Protažení + válcování po tréninku",
    group: "mobility",
    sets: "10 min",
    why: "Urychluje regeneraci a udrží tě zdravého přes celých 24 týdnů — nevynechávej.",
    how: "Po dlouhých jednotkách proválcuj stehna, lýtka a záda, protáhni hamstringy, kyčle a hrudník.",
  },
];
