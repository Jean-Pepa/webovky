// Datový model Mařeny. Vše je „ploché“ a serializovatelné — ukládá se buď do
// Upstash Redis (sdílené), nebo do localStorage (demo režim v prohlížeči).

export interface Member {
  id: string;
  name: string;
  roleIds: string[]; // posty/funkce, které si člověk vybral (viz lib/roles.ts)
  email?: string;
  phone?: string;
  contact?: string; // starší pole (instagram apod.) — kvůli zpětné kompatibilitě
  note?: string;
  approved?: boolean; // schválení správcem. false = čeká (zamčeno); jinak má přístup
  createdAt: string;
}

export interface Post {
  id: string;
  author: string;
  roleId?: string; // za jakou funkci to píše
  title: string;
  body: string;
  pinned: boolean;
  createdAt: string;
  editedBy?: string; // kdo naposledy upravil (autor založení se nemění) — legacy
  editedAt?: string; // ISO – kdy se naposledy upravilo — legacy
  edits?: { by: string; at: string }[]; // historie úprav (kdo a kdy), od nejstarší
}

export interface PollOption {
  id: string;
  label: string;
  voters: string[]; // jména hlasujících
}

export interface Poll {
  id: string;
  question: string;
  author: string;
  options: PollOption[];
  multi: boolean; // lze vybrat víc možností
  closed: boolean;
  createdAt: string;
}

export type EventKind =
  | "schuzka"
  | "deadline"
  | "prednaska"
  | "program"
  | "pruvod"
  | "fleda"
  | "jine";

export interface CalEvent {
  id: string;
  date: string; // ISO "YYYY-MM-DD" — začátek (od)
  endDate?: string; // ISO — konec (do); vícedenní událost
  time?: string; // "17:00"
  title: string;
  kind: EventKind;
  note?: string;
  author: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  roleId?: string;
  assignee?: string;
  done: boolean;
  due?: string; // ISO datum
  createdAt: string;
}

export interface LinkItem {
  id: string;
  label: string; // např. "Soňa Lisoňová", "Fléda", "AlienPay"
  value: string; // odkaz, e-mail, telefon nebo libovolný text
  folder?: string; // složka/kategorie (Fakulta, Úřady, Fléda, Dodavatelé, Sponzoři…)
  note?: string;
  createdAt: string;
}

export interface Shift {
  id: string;
  area: string; // Bar, Kuchyně, Nákupy, Úklid, Stavění… (oblast provozu)
  title?: string; // konkrétní úkol (např. „Výčep", „Oběd – guláš", „Nákup Makro")
  date?: string; // ISO datum
  from?: string; // čas od
  to?: string; // čas do
  capacity: number; // kolik lidí je potřeba (0 = neomezeně)
  people: string[]; // přihlášená jména
  backup?: string[]; // záloha (kdyby někdo vypadl)
  note?: string;
  createdAt: string;
}

export type FinanceKind = "prijem" | "vydaj"; // příjem / výdaj

export interface FinanceItem {
  id: string;
  kind: FinanceKind;
  label: string; // popis (např. "Třídní vklad — Petra", "Pronájem Flédy")
  amount: number; // částka v Kč — VŽDY s DPH (reálná hotovost), počítá se z ní bilance
  net?: number; // částka bez DPH (jen když bylo zadáno „bez DPH"); amount = net × 1,21
  category?: string; // vklad, bar, lístky, výzdoba, přednášející, merch, sponzoring…
  who?: string; // kdo zaplatil / od koho / komu
  paid: boolean; // zaplaceno / proplaceno
  date?: string; // ISO datum
  note?: string;
  receiptId?: string; // starší pole (jedna účtenka) — kvůli zpětné kompatibilitě
  receiptIds?: string[]; // víc účtenek (fotky) — ukládají se zvlášť, ne v hlavní DB
  createdAt: string;
}

// Denní kasa na hotovost — ráno se vloží základ (na vracení), večer se spočítá
// stav; rozdíl (tržba) se automaticky zapíše do financí.
export interface Cashbox {
  id: string;
  label?: string; // např. „Bar", „úterý"
  opening: number; // ranní vklad (Kč)
  openedAt: string; // ISO – kdy se kasa otevřela
  closing?: number; // večerní stav kasy (Kč)
  closedAt?: string; // ISO – kdy se uzavřela
  financeId?: string; // navázaná finanční položka (tržba)
  createdAt: string;
}

// Výběr (třídní vklad) — kdo dal kolik do společné kasy. Nevrácené příspěvky se
// počítají do celkového balíku jako příjem; po „vráceno" se z balíku odečtou.
export interface Contribution {
  id: string;
  name: string; // jméno (a příjmení) přispěvatele
  amount: number; // kolik dal (Kč)
  returned?: boolean; // na konci vráceno
  returnedAt?: string; // ISO – kdy se vrátilo
  createdAt: string;
}

// Kuchyně & bar — položka menu s recepturou (suroviny + náklad).
// Bar = drinky (koktejl/panák), kuchyně = jídla (snídaně/oběd) — skládají se stejně.
export type DrinkKind = "koktejl" | "panak" | "snidane" | "obed" | "jine";
// Den v týdnu — u kuchyně se jídla rozdělují na jednotlivé dny (Po–Ne).
export type Weekday = "po" | "ut" | "st" | "ct" | "pa" | "so" | "ne";
export interface DrinkIngredient {
  name: string; // surovina (gin 40ml, brambory 2kg…)
  cost: number; // náklad za porci (Kč)
}
export interface Drink {
  id: string;
  place?: "bar" | "kuchyne"; // kam patří (chybí = bar, kvůli starým datům)
  name: string; // např. „VÍLÍ NEKTAR" / „Guláš"
  kind: DrinkKind;
  day?: Weekday; // den v týdnu (jen u kuchyně; chybí = bez dne)
  ingredients: DrinkIngredient[]; // receptura
  price?: number; // prodejní cena (Kč) — hlavně u baru
  note?: string;
  createdAt: string;
}

// Sponzoři — koho oslovit o podporu, co dávají a v jakém stavu domluva je.
export type SponsorStatus = "oslovit" | "ceka" | "potvrzeno" | "odmitl";
export type SponsorCategory = "jidlo_piti" | "stavebni" | "tisk" | "technika" | "ostatni";
export interface Sponsor {
  id: string;
  name: string;
  gives?: string; // co dává (pivo, čaj, kávovar, poukazy, peníze…)
  status: SponsorStatus; // oslovit → čeká → potvrzeno / odmítl
  statusAt?: string; // ISO – kdy se naposledy změnil stav (řazení ve skupině)
  category?: SponsorCategory; // jídlo a pití / stavební materiál / tisk / technika / ostatní
  returning?: boolean; // stálý sponzor (sponzoroval Mařenu už dřív)
  who?: string; // kdo to řeší
  link?: string; // legacy – jeden odkaz; nově se používá links[]
  links?: string[]; // odkazy / kontakty (může jich být víc)
  note?: string; // požadavky / detaily (např. „chce logo")
  createdAt: string;
}

// Výzdoba — nápady a materiál na výzdobu dvora/fakulty; kdo to shání a stav.
export type DecorStatus = "napad" | "shani" | "hotovo";
export interface Decor {
  id: string;
  title: string; // nápad / materiál (např. „Luxfery z Bazoše", „LED pásky")
  status: DecorStatus; // nápad → shání se → hotovo
  who?: string; // kdo to má na starost / shání
  link?: string; // odkaz (bazoš, eshop…)
  note?: string;
  createdAt: string;
}

// Prváci — ruční seznam prváků (účastníků), o kterých festival je.
export interface Freshman {
  id: string;
  name: string;
  email?: string;
  note?: string; // cokoli (skupina, telefon, poznámka…)
  createdAt: string;
}

// Kuchyně — denní menu (co se který den vaří) a nákupní seznam.
export type Meal = "snidane" | "obed" | "jine";
export interface MenuEntry {
  id: string;
  day: string; // volný popis dne (např. „Čtvrtek 18.9.")
  meal: Meal;
  dish: string; // co se vaří
  createdAt: string;
}
export interface ShoppingItem {
  id: string;
  place?: "bar" | "kuchyne"; // kam patří (chybí = kuchyně)
  name: string;
  qty?: string; // množství (volný text, např. „4 kg", „2 basy")
  bought?: boolean;
  createdAt: string;
}

// Kuchyně — nahrané fotky a soubory (nákupní seznamy, menu na vaření, recepty…).
export interface KitchenFile {
  id: string;
  place?: "bar" | "kuchyne"; // kam patří (chybí = kuchyně)
  label: string; // popis (např. „Nákup Makro – sobota", „Menu úterý")
  category: string; // "Nákupy" | "Menu" | "Ostatní"
  blobId: string; // ID uloženého souboru (foto/soubor se ukládá zvlášť, ne v hlavní DB)
  fileKind: "image" | "file";
  fileName?: string; // původní název (u ne-obrázků)
  note?: string;
  author: string;
  createdAt: string;
}

// Pozvánka do programu — koho oslovit (přednášející, kapely) a stav domlouvání.
export type Interest = "nevim" | "ceka" | "ano" | "ne";

export interface Invite {
  id: string;
  category: string; // "Přednášky", "Kapely", "DJs", "Workshopy"…
  name: string; // Kdo?
  link?: string; // Odkaz
  priority?: number; // priorita č.
  contacted: boolean; // napsali jsme mu/jí?
  interest: Interest; // má zájem?
  availability?: string; // kdy může?
  price?: string; // kolik za to chce peněz?
  confirmedDate?: string; // finálně potvrzené datum
  cancelled?: boolean; // zrušeno (i u dříve potvrzeného) — propadne dolů
  note?: string;
  createdAt: string;
}

// Merch — nabídka (produkty s fotkou) a objednávky z veřejné stránky (QR).
export interface MerchProduct {
  id: string;
  name: string; // např. „Tričko Mařena 2026", „Mikina", „Plátěnka"
  price?: number; // cena v Kč
  blobId?: string; // foto produktu (ukládá se zvlášť, ne v hlavní DB)
  sizes?: string[]; // nabízené velikosti (S, M, L…) — zadává správce / role merch
  colors?: string[]; // nabízené barvy
  stock?: number; // kolik kusů máme skladem (prázdné = neomezeně); zbývá = stock − prodáno
  note?: string; // další detaily (materiál apod.)
  createdAt: string;
}

export interface MerchOrderItem {
  productId: string;
  name: string; // název produktu v době objednávky
  size?: string; // zvolená velikost
  color?: string; // zvolená barva
  price?: number; // cena za kus v době objednávky (Kč)
  qty: number;
}

export interface MerchOrder {
  id: string;
  name: string; // jméno objednávajícího
  phone?: string;
  email?: string;
  items: MerchOrderItem[]; // co si chce koupit z nabídky
  note?: string; // poznámka (velikost apod.)
  done?: boolean; // vyřízeno (true) / čeká (false/undefined)
  financeId?: string; // navázaná finanční položka (vznikne při „vyřízeno")
  createdAt: string;
}

export interface Year {
  id: string; // např. "2025"
  label: string; // "Mařena 2025"
  theme?: string; // téma ročníku
  fledaDate?: string; // termín průvodu / Flédy (ISO)
  plannedPeople?: number; // plánovaný počet účastníků (pro kalkulaci financí)
  deposit?: number; // třídní vklad na osobu (Kč)
  members: Member[];
  roleLeads?: Record<string, string>; // roleId → memberId vedoucího (první = vedoucí, ostatní pomocníci)
  posts: Post[];
  polls: Poll[];
  events: CalEvent[];
  tasks: Task[];
  links?: LinkItem[]; // důležité kontakty a odkazy (volitelné kvůli zpětné kompatibilitě)
  finances?: FinanceItem[]; // pokladní kniha — příjmy a výdaje
  cashboxes?: Cashbox[]; // denní kasy na hotovost (ráno vklad → večer tržba)
  contributions?: Contribution[]; // výběr – kdo dal kolik do společné kasy (vklady)
  freshmen?: Freshman[]; // prváci – ruční seznam účastníků
  decor?: Decor[]; // výzdoba – nápady a materiál
  sponsors?: Sponsor[]; // sponzoři – koho oslovit, co dává, stav
  bar?: Drink[]; // bar – ceník drinků s recepturou
  menu?: MenuEntry[]; // kuchyně – denní menu
  shopping?: ShoppingItem[]; // kuchyně – nákupní seznam
  shifts?: Shift[]; // provoz — rozpis směn, na které se lidi přihlašují
  invites?: Invite[]; // program — koho oslovit (přednášející, kapely)
  kitchen?: KitchenFile[]; // kuchyně — nahrané fotky/soubory (nákupy, menu…)
  merch?: MerchProduct[]; // merch — nabídka produktů (fotky)
  merchOrders?: MerchOrder[]; // merch — objednávky z veřejné stránky (QR)
  createdAt: string;
}

export interface DB {
  years: Year[];
}
