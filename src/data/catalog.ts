// Datový model katalogu EIKA.
// Fáze 1: demo data. Ve Fázi 2 se nahradí daty z databáze (Supabase).

export type CategorySlug = "hutni-material" | "zelezarstvi" | "vinohradnictvi";

export type Badge = "akce" | "novinka" | "top" | "doprodej";

export interface Param {
  label: string;
  value: string;
}

export interface Category {
  slug: CategorySlug;
  name: string;
  tagline: string;
  description: string;
  icon: "beam" | "tools" | "grape";
  subcategories: string[];
}

export interface Product {
  slug: string;
  name: string;
  category: CategorySlug;
  subcategory: string;
  brand: string;
  unit: string; // ks, m, kg, bal.
  price: number; // aktuální cena bez DPH v Kč (B2C)
  originalPrice?: number; // původní cena (pro akční zboží)
  priceB2B: number; // velkoobchodní cena pro firmy/živnostníky bez DPH
  stock: number; // skladem (počet jednotek)
  sku: string;
  rating: number; // 0–5
  ratingCount: number;
  badges?: Badge[];
  params?: Param[];
  description: string;
  featured?: boolean;
}

export const CATEGORIES: Category[] = [
  {
    slug: "hutni-material",
    name: "Hutní materiál",
    tagline: "Profily, plechy, trubky, betonářská ocel",
    description:
      "Široký sortiment hutního materiálu a hutních výrobků – ocelové profily, plechy, trubky, betonářská ocel a sítě. Dělení materiálu na míru a doprava dle objemu.",
    icon: "beam",
    subcategories: [
      "Profily (IPE, HEA, HEB, UNP, INP)",
      "Plechy a trapézové plechy",
      "Trubky a duté profily",
      "Betonářská ocel a sítě",
      "Sendvičové panely",
    ],
  },
  {
    slug: "zelezarstvi",
    name: "Železářství",
    tagline: "Nářadí, spojovací materiál, vodo-topo",
    description:
      "Vše pro dům, dílnu i zahradu – nářadí a nástroje, spojovací a kotevní materiál, vodoinstalace a topení, zámky a kování, žebříky, polykarbonát a pozinkované zboží.",
    icon: "tools",
    subcategories: [
      "Nářadí a nástroje",
      "Spojovací a kotevní materiál",
      "Vodoinstalace a topení",
      "Zámky a kování",
      "Žebříky a polykarbonát",
    ],
  },
  {
    slug: "vinohradnictvi",
    name: "Vinohradnictví",
    tagline: "Potřeby pro vinaře a vinohrady",
    description:
      "Jeden z největších dodavatelů potřeb pro vinohradnictví na jižní Moravě – sloupky, drát, vázací materiál, opěrné systémy a nářadí pro vinaře.",
    icon: "grape",
    subcategories: [
      "Sloupky a opěrné systémy",
      "Vázací a drátěný materiál",
      "Nářadí pro vinaře",
    ],
  },
];

export const PRODUCTS: Product[] = [
  // --- Hutní materiál ---
  {
    slug: "profil-ipe-160",
    name: "Ocelový profil IPE 160",
    category: "hutni-material",
    subcategory: "Profily (IPE, HEA, HEB, UNP, INP)",
    brand: "Ferona",
    unit: "m",
    price: 412,
    priceB2B: 365,
    stock: 240,
    sku: "HM-IPE160",
    rating: 4.8,
    ratingCount: 34,
    badges: ["top"],
    params: [
      { label: "Profil", value: "IPE 160" },
      { label: "Jakost", value: "S235JR" },
      { label: "Hmotnost", value: "15,8 kg/m" },
      { label: "Délka tyče", value: "do 12 m" },
    ],
    description:
      "Válcovaný I-profil IPE 160, jakost S235JR. Vhodný pro nosné konstrukce, překlady a ocelové rámy. Dělení na míru na pile.",
    featured: true,
  },
  {
    slug: "profil-hea-100",
    name: "Ocelový profil HEA 100",
    category: "hutni-material",
    subcategory: "Profily (IPE, HEA, HEB, UNP, INP)",
    brand: "Ferona",
    unit: "m",
    price: 389,
    priceB2B: 344,
    stock: 180,
    sku: "HM-HEA100",
    rating: 4.7,
    ratingCount: 21,
    params: [
      { label: "Profil", value: "HEA 100" },
      { label: "Jakost", value: "S235JR" },
      { label: "Hmotnost", value: "16,7 kg/m" },
    ],
    description:
      "Široký I-profil HEA 100, jakost S235JR. Univerzální nosník pro stavební a strojní konstrukce.",
  },
  {
    slug: "jekl-40x40x2",
    name: "Jekl 40×40×2 mm",
    category: "hutni-material",
    subcategory: "Trubky a duté profily",
    brand: "Ferona",
    unit: "m",
    price: 67,
    originalPrice: 78,
    priceB2B: 60,
    stock: 620,
    sku: "HM-J40402",
    rating: 4.9,
    ratingCount: 58,
    badges: ["akce", "top"],
    params: [
      { label: "Rozměr", value: "40 × 40 mm" },
      { label: "Tloušťka stěny", value: "2,0 mm" },
      { label: "Jakost", value: "S235JR" },
    ],
    description:
      "Uzavřený svařovaný profil (jekl) 40×40×2 mm. Pro ploty, konstrukce, přístřešky a zámečnické výrobky.",
    featured: true,
  },
  {
    slug: "plech-pozink-1mm",
    name: "Pozinkovaný plech 1,0 mm",
    category: "hutni-material",
    subcategory: "Plechy a trapézové plechy",
    brand: "ArcelorMittal",
    unit: "m²",
    price: 268,
    priceB2B: 232,
    stock: 95,
    sku: "HM-PZ10",
    rating: 4.5,
    ratingCount: 12,
    params: [
      { label: "Tloušťka", value: "1,0 mm" },
      { label: "Formát", value: "1000 × 2000 mm" },
      { label: "Povrch", value: "žárový zinek" },
    ],
    description:
      "Žárově pozinkovaný plech tloušťky 1,0 mm. Formát 1000×2000 mm, možnost dělení na tabule.",
  },
  {
    slug: "betonarska-ocel-r10",
    name: "Betonářská ocel R 10 (žebírková)",
    category: "hutni-material",
    subcategory: "Betonářská ocel a sítě",
    brand: "Ferona",
    unit: "m",
    price: 39,
    priceB2B: 33,
    stock: 1500,
    sku: "HM-BR10",
    rating: 4.8,
    ratingCount: 73,
    badges: ["top"],
    params: [
      { label: "Průměr", value: "10 mm" },
      { label: "Jakost", value: "B500B" },
      { label: "Povrch", value: "žebírkový" },
    ],
    description:
      "Žebírková betonářská ocel B500B, průměr 10 mm. Pro výztuž základů, věnců a desek. Stříhání a ohýbání na zakázku.",
    featured: true,
  },
  {
    slug: "kari-sit-150x150x6",
    name: "KARI síť 150×150×6 mm",
    category: "hutni-material",
    subcategory: "Betonářská ocel a sítě",
    brand: "Ferona",
    unit: "ks",
    price: 489,
    priceB2B: 421,
    stock: 320,
    sku: "HM-KARI6",
    rating: 4.6,
    ratingCount: 28,
    params: [
      { label: "Oko", value: "150 × 150 mm" },
      { label: "Drát", value: "6 mm" },
      { label: "Rozměr", value: "2 × 3 m" },
    ],
    description:
      "Svařovaná betonářská síť KARI, oko 150×150 mm, drát 6 mm, rozměr 2×3 m. Pro vyztužení podlah a desek.",
  },

  // --- Železářství ---
  {
    slug: "vrtak-do-betonu-8mm",
    name: "Vrták do betonu SDS-plus 8×160 mm",
    category: "zelezarstvi",
    subcategory: "Nářadí a nástroje",
    brand: "Bosch",
    unit: "ks",
    price: 71,
    originalPrice: 89,
    priceB2B: 62,
    stock: 210,
    sku: "ZE-SDS8",
    rating: 4.7,
    ratingCount: 41,
    badges: ["akce"],
    params: [
      { label: "Upnutí", value: "SDS-plus" },
      { label: "Průměr", value: "8 mm" },
      { label: "Délka", value: "160 mm" },
    ],
    description:
      "Příklepový vrták SDS-plus se slinutou špičkou, průměr 8 mm, délka 160 mm. Pro beton, cihlu i kámen.",
    featured: true,
  },
  {
    slug: "vrut-do-dreva-5x60",
    name: "Vrut do dřeva 5,0×60 mm (bal. 200 ks)",
    category: "zelezarstvi",
    subcategory: "Spojovací a kotevní materiál",
    brand: "FESTA",
    unit: "bal.",
    price: 215,
    priceB2B: 178,
    stock: 140,
    sku: "ZE-VR560",
    rating: 4.6,
    ratingCount: 36,
    params: [
      { label: "Rozměr", value: "5,0 × 60 mm" },
      { label: "Drážka", value: "TX (Torx)" },
      { label: "Balení", value: "200 ks" },
    ],
    description:
      "Univerzální vrut se zápustnou hlavou, TX drážka, žlutý zinek. Balení 200 ks.",
  },
  {
    slug: "hmozdinka-natloukaci-8x80",
    name: "Natloukací hmoždinka 8×80 mm (bal. 100 ks)",
    category: "zelezarstvi",
    subcategory: "Spojovací a kotevní materiál",
    brand: "Fischer",
    unit: "bal.",
    price: 169,
    priceB2B: 139,
    stock: 96,
    sku: "ZE-NH880",
    rating: 4.8,
    ratingCount: 52,
    badges: ["top"],
    params: [
      { label: "Rozměr", value: "8 × 80 mm" },
      { label: "Typ", value: "natloukací s vrutem" },
      { label: "Balení", value: "100 ks" },
    ],
    description:
      "Natloukací hmoždinka s vrutem, 8×80 mm. Pro rychlé kotvení latí, profilů a konstrukcí do zdiva.",
    featured: true,
  },
  {
    slug: "kulovy-kohout-1-2",
    name: 'Kulový kohout 1/2" voda',
    category: "zelezarstvi",
    subcategory: "Vodoinstalace a topení",
    brand: "Giacomini",
    unit: "ks",
    price: 119,
    priceB2B: 94,
    stock: 175,
    sku: "ZE-KK12",
    rating: 4.5,
    ratingCount: 19,
    params: [
      { label: "Připojení", value: '1/2"' },
      { label: "Materiál", value: "mosaz" },
      { label: "Max. tlak", value: "30 bar" },
    ],
    description:
      'Mosazný kulový kohout 1/2", plnoprůtokový, páčka. Pracovní tlak do 30 bar, pro vodu i topení.',
  },
  {
    slug: "visaci-zamek-50mm",
    name: "Visací zámek 50 mm, 3 klíče",
    category: "zelezarstvi",
    subcategory: "Zámky a kování",
    brand: "FAB",
    unit: "ks",
    price: 149,
    priceB2B: 121,
    stock: 130,
    sku: "ZE-VZ50",
    rating: 4.4,
    ratingCount: 23,
    params: [
      { label: "Šířka těla", value: "50 mm" },
      { label: "Třmen", value: "kalená ocel" },
      { label: "Klíče", value: "3 ks" },
    ],
    description:
      "Visací zámek s tvrzeným třmenem, šířka těla 50 mm, dodáván se 3 klíči.",
  },
  {
    slug: "zebrik-hlinikovy-3x9",
    name: "Hliníkový žebřík 3×9 příček",
    category: "zelezarstvi",
    subcategory: "Žebříky a polykarbonát",
    brand: "ELKOP",
    unit: "ks",
    price: 3790,
    originalPrice: 4290,
    priceB2B: 3390,
    stock: 18,
    sku: "ZE-ZEB39",
    rating: 4.9,
    ratingCount: 47,
    badges: ["akce", "top"],
    params: [
      { label: "Provedení", value: "3 × 9 příček" },
      { label: "Nosnost", value: "150 kg" },
      { label: "Pracovní výška", value: "6,1 m" },
    ],
    description:
      "Trojdílný hliníkový žebřík 3×9 příček, výsuvný, nosnost 150 kg. Pracovní výška až 6,1 m.",
    featured: true,
  },

  // --- Vinohradnictví ---
  {
    slug: "vinohradnicky-sloupek-pozink",
    name: "Vinohradnický sloupek pozinkovaný 2,2 m",
    category: "vinohradnictvi",
    subcategory: "Sloupky a opěrné systémy",
    brand: "EIKA",
    unit: "ks",
    price: 159,
    priceB2B: 129,
    stock: 460,
    sku: "VI-SL22",
    rating: 4.7,
    ratingCount: 31,
    badges: ["top"],
    params: [
      { label: "Délka", value: "2,2 m" },
      { label: "Povrch", value: "žárový zinek" },
      { label: "Profil", value: "Ω (omega)" },
    ],
    description:
      "Žárově pozinkovaný profilovaný sloupek pro vedení vinné révy, délka 2,2 m. Vysoká odolnost proti korozi.",
    featured: true,
  },
  {
    slug: "vazaci-drat-pozink-2mm",
    name: "Vázací drát pozinkovaný 2,0 mm (5 kg)",
    category: "vinohradnictvi",
    subcategory: "Vázací a drátěný materiál",
    brand: "EIKA",
    unit: "bal.",
    price: 289,
    priceB2B: 244,
    stock: 210,
    sku: "VI-DR20",
    rating: 4.6,
    ratingCount: 17,
    params: [
      { label: "Průměr", value: "2,0 mm" },
      { label: "Návin", value: "5 kg" },
      { label: "Povrch", value: "pozinkováno" },
    ],
    description:
      "Pozinkovaný napínací drát 2,0 mm pro vinohrady, návin 5 kg. Pro nosné a vodicí dráty opěrné konstrukce.",
  },
  {
    slug: "vinohradnicke-nuzky",
    name: "Vinohradnické nůžky profi",
    category: "vinohradnictvi",
    subcategory: "Nářadí pro vinaře",
    brand: "FELCO",
    unit: "ks",
    price: 459,
    priceB2B: 379,
    stock: 64,
    sku: "VI-NU01",
    rating: 4.9,
    ratingCount: 64,
    badges: ["novinka"],
    params: [
      { label: "Čepel", value: "kovaná ocel" },
      { label: "Střih", value: "do 25 mm" },
      { label: "Rukojeť", value: "ergonomická" },
    ],
    description:
      "Profesionální zahradnické/vinohradnické nůžky s kovanými čepelemi a ergonomickou rukojetí. Pro řez révy a keřů.",
  },
];

export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getProducts(slugs: string[]): Product[] {
  return slugs
    .map((s) => PRODUCTS.find((p) => p.slug === s))
    .filter((p): p is Product => Boolean(p));
}

export function productsByCategory(slug: string): Product[] {
  return PRODUCTS.filter((p) => p.category === slug);
}

export function featuredProducts(): Product[] {
  return PRODUCTS.filter((p) => p.featured);
}

export function allBrands(products: Product[] = PRODUCTS): string[] {
  return Array.from(new Set(products.map((p) => p.brand))).sort((a, b) =>
    a.localeCompare(b, "cs")
  );
}

export function priceBounds(products: Product[] = PRODUCTS): [number, number] {
  const prices = products.map((p) => p.price);
  return [Math.min(...prices), Math.max(...prices)];
}

export function searchProducts(query: string): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return PRODUCTS;
  return PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.subcategory.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
  );
}
