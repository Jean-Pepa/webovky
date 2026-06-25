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

// Kuchyně — nahrané fotky a soubory (nákupní seznamy, menu na vaření, recepty…).
export interface KitchenFile {
  id: string;
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
  note?: string;
  createdAt: string;
}

// Merch — nabídka (produkty s fotkou) a objednávky z veřejné stránky (QR).
export interface MerchProduct {
  id: string;
  name: string; // např. „Tričko Mařena 2026", „Mikina", „Plátěnka"
  price?: number; // cena v Kč
  blobId?: string; // foto produktu (ukládá se zvlášť, ne v hlavní DB)
  note?: string; // velikosti, barvy, detaily
  createdAt: string;
}

export interface MerchOrderItem {
  productId: string;
  name: string; // název produktu v době objednávky
  qty: number;
}

export interface MerchOrder {
  id: string;
  name: string; // jméno objednávajícího
  phone?: string;
  email?: string;
  items: MerchOrderItem[]; // co si chce koupit z nabídky
  note?: string; // poznámka (velikost apod.)
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
  posts: Post[];
  polls: Poll[];
  events: CalEvent[];
  tasks: Task[];
  links?: LinkItem[]; // důležité kontakty a odkazy (volitelné kvůli zpětné kompatibilitě)
  finances?: FinanceItem[]; // pokladní kniha — příjmy a výdaje
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
