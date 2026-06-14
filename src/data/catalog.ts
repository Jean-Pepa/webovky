// Datový model katalogu EIKA.
// Demo data podle reálného sortimentu EIKA (hutní materiál, železářství, vinohradnictví).

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
  unit: string;
  price: number;
  originalPrice?: number;
  priceB2B: number;
  stock: number;
  sku: string;
  rating: number;
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
      "Betonářská ocel a KARI sítě",
      "Profily IPE, HEA, HEB, UNP",
      "Úhelníky a T-profily",
      "Jekly a trubky",
      "Plechy a trapézové plechy",
      "Plochá, kruhová a čtvercová ocel",
    ],
  },
  {
    slug: "zelezarstvi",
    name: "Železářství",
    tagline: "Nářadí, spojovací materiál, vodo-topo",
    description:
      "Přes 12 tisíc položek pro dům, dílnu i zahradu – nářadí a nástroje, spojovací a kotevní materiál, vodoinstalace a topení, zámky a kování, žebříky a kamna.",
    icon: "tools",
    subcategories: [
      "Nářadí a nástroje",
      "Spojovací materiál",
      "Kotevní a nýtovací technika",
      "Vodoinstalace a topení",
      "Zámky, panty a kování",
      "Žebříky a kamna",
    ],
  },
  {
    slug: "vinohradnictvi",
    name: "Vinohradnictví",
    tagline: "Potřeby pro vinaře a vinohrady",
    description:
      "Jeden z největších dodavatelů potřeb pro vinohradnictví na jižní Moravě – sloupky, dráty, vázací materiál, napínáky, kotvy a nářadí pro vinaře.",
    icon: "grape",
    subcategories: [
      "Vinohradnické sloupky",
      "Dráty do vinohradu",
      "Vázací materiál a kleště",
      "Napínáky a kotvy",
      "Nářadí pro vinaře",
    ],
  },
];

export const PRODUCTS: Product[] = [
  // === HUTNÍ MATERIÁL ===
  {
    slug: "betonarska-ocel-r10",
    name: "Betonářská ocel R 10 (žebírková)",
    category: "hutni-material",
    subcategory: "Betonářská ocel a KARI sítě",
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
    subcategory: "Betonářská ocel a KARI sítě",
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
  {
    slug: "profil-ipe-160",
    name: "Ocelový profil IPE 160",
    category: "hutni-material",
    subcategory: "Profily IPE, HEA, HEB, UNP",
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
    ],
    description:
      "Válcovaný I-profil IPE 160, jakost S235JR. Vhodný pro nosné konstrukce, překlady a ocelové rámy.",
    featured: true,
  },
  {
    slug: "profil-unp-100",
    name: "Ocelový profil UNP 100 (U)",
    category: "hutni-material",
    subcategory: "Profily IPE, HEA, HEB, UNP",
    brand: "Ferona",
    unit: "m",
    price: 318,
    priceB2B: 280,
    stock: 160,
    sku: "HM-UNP100",
    rating: 4.6,
    ratingCount: 15,
    params: [
      { label: "Profil", value: "UNP 100" },
      { label: "Jakost", value: "S235JR" },
    ],
    description:
      "Válcovaný U-profil UNP 100, jakost S235JR. Pro nosné a spojovací prvky ocelových konstrukcí.",
  },
  {
    slug: "uhelnik-50x50x5",
    name: "Úhelník 50×50×5 mm (L profil)",
    category: "hutni-material",
    subcategory: "Úhelníky a T-profily",
    brand: "Ferona",
    unit: "m",
    price: 96,
    priceB2B: 82,
    stock: 420,
    sku: "HM-L5055",
    rating: 4.7,
    ratingCount: 22,
    params: [
      { label: "Rozměr", value: "50 × 50 × 5 mm" },
      { label: "Jakost", value: "S235JR" },
    ],
    description:
      "Rovnoramenný úhelník (L profil) 50×50×5 mm. Pro rámy, výztuhy a zámečnické konstrukce.",
  },
  {
    slug: "jekl-40x40x2",
    name: "Jekl 40×40×2 mm",
    category: "hutni-material",
    subcategory: "Jekly a trubky",
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
      { label: "Tloušťka", value: "2,0 mm" },
      { label: "Jakost", value: "S235JR" },
    ],
    description:
      "Uzavřený svařovaný profil (jekl) 40×40×2 mm. Pro ploty, konstrukce, přístřešky a zámečnické výrobky.",
    featured: true,
  },
  {
    slug: "trubka-zavitova-1",
    name: 'Trubka závitová 1" pozinkovaná',
    category: "hutni-material",
    subcategory: "Jekly a trubky",
    brand: "Ferona",
    unit: "m",
    price: 142,
    priceB2B: 124,
    stock: 210,
    sku: "HM-TR1",
    rating: 4.5,
    ratingCount: 12,
    params: [
      { label: "Závit", value: '1"' },
      { label: "Povrch", value: "pozinkováno" },
    ],
    description:
      'Závitová ocelová trubka 1", žárově pozinkovaná. Pro rozvody, konstrukce a zábradlí.',
  },
  {
    slug: "plech-trapez-tr18",
    name: "Trapézový plech TR 18 pozinkovaný",
    category: "hutni-material",
    subcategory: "Plechy a trapézové plechy",
    brand: "ArcelorMittal",
    unit: "m²",
    price: 268,
    priceB2B: 232,
    stock: 95,
    sku: "HM-TZ18",
    rating: 4.5,
    ratingCount: 19,
    params: [
      { label: "Profil", value: "TR 18" },
      { label: "Tloušťka", value: "0,5 mm" },
      { label: "Povrch", value: "pozinkováno" },
    ],
    description:
      "Trapézový plech TR 18, tloušťka 0,5 mm, žárově pozinkovaný. Na střechy, opláštění a ploty.",
    featured: true,
  },
  {
    slug: "plocha-ocel-40x5",
    name: "Plochá ocel 40×5 mm",
    category: "hutni-material",
    subcategory: "Plochá, kruhová a čtvercová ocel",
    brand: "Ferona",
    unit: "m",
    price: 58,
    priceB2B: 50,
    stock: 380,
    sku: "HM-PL405",
    rating: 4.6,
    ratingCount: 14,
    params: [
      { label: "Rozměr", value: "40 × 5 mm" },
      { label: "Jakost", value: "S235JR" },
    ],
    description:
      "Plochá tyčová ocel 40×5 mm. Univerzální pro zámečnické a stavební výrobky.",
  },

  // === ŽELEZÁŘSTVÍ ===
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
      "Příklepový vrták SDS-plus se slinutou špičkou, průměr 8 mm. Pro beton, cihlu i kámen.",
    featured: true,
  },
  {
    slug: "zednicke-kladivo-500",
    name: "Zednické kladivo 500 g",
    category: "zelezarstvi",
    subcategory: "Nářadí a nástroje",
    brand: "FESTA",
    unit: "ks",
    price: 199,
    priceB2B: 169,
    stock: 120,
    sku: "ZE-KL500",
    rating: 4.6,
    ratingCount: 18,
    params: [
      { label: "Hmotnost", value: "500 g" },
      { label: "Násada", value: "sklolaminát" },
    ],
    description:
      "Zednické kladivo s hlavou 500 g a sklolaminátovou násadou. Odolné pro každodenní práci.",
  },
  {
    slug: "vrut-do-dreva-5x60",
    name: "Vrut do dřeva 5,0×60 mm (bal. 200 ks)",
    category: "zelezarstvi",
    subcategory: "Spojovací materiál",
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
    featured: true,
  },
  {
    slug: "matice-m10-din934",
    name: "Matice M10 DIN 934 (bal. 100 ks)",
    category: "zelezarstvi",
    subcategory: "Spojovací materiál",
    brand: "FESTA",
    unit: "bal.",
    price: 89,
    priceB2B: 72,
    stock: 260,
    sku: "ZE-MAT10",
    rating: 4.5,
    ratingCount: 9,
    params: [
      { label: "Závit", value: "M10" },
      { label: "Norma", value: "DIN 934" },
      { label: "Balení", value: "100 ks" },
    ],
    description:
      "Šestihranná matice M10 dle DIN 934, pozinkovaná. Balení 100 ks.",
  },
  {
    slug: "hmozdinka-natloukaci-8x80",
    name: "Natloukací hmoždinka 8×80 mm (bal. 100 ks)",
    category: "zelezarstvi",
    subcategory: "Kotevní a nýtovací technika",
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
    slug: "pruchozi-kotva-m10",
    name: "Průchozí kotva M10×100 mm (bal. 25 ks)",
    category: "zelezarstvi",
    subcategory: "Kotevní a nýtovací technika",
    brand: "Fischer",
    unit: "bal.",
    price: 239,
    priceB2B: 199,
    stock: 80,
    sku: "ZE-KO10",
    rating: 4.7,
    ratingCount: 14,
    params: [
      { label: "Závit", value: "M10" },
      { label: "Délka", value: "100 mm" },
      { label: "Balení", value: "25 ks" },
    ],
    description:
      "Ocelová průchozí kotva M10×100 mm pro kotvení do betonu. Balení 25 ks.",
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
      'Mosazný kulový kohout 1/2", plnoprůtokový, páčka. Pro vodu i topení.',
  },
  {
    slug: "visaci-zamek-50mm",
    name: "Visací zámek 50 mm, 3 klíče",
    category: "zelezarstvi",
    subcategory: "Zámky, panty a kování",
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
    subcategory: "Žebříky a kamna",
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

  // === VINOHRADNICTVÍ ===
  {
    slug: "vinohradnicky-sloupek-radovy",
    name: "Vinohradnický řadový sloupek pozink 2,2 m",
    category: "vinohradnictvi",
    subcategory: "Vinohradnické sloupky",
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
      "Žárově pozinkovaný řadový sloupek pro vedení vinné révy, délka 2,2 m. Vysoká odolnost proti korozi.",
    featured: true,
  },
  {
    slug: "vinohradnicky-sloupek-novum",
    name: "Vinohradnický sloupek NOVUM 60×40",
    category: "vinohradnictvi",
    subcategory: "Vinohradnické sloupky",
    brand: "EIKA",
    unit: "ks",
    price: 219,
    priceB2B: 185,
    stock: 180,
    sku: "VI-NOVUM",
    rating: 4.6,
    ratingCount: 12,
    params: [
      { label: "Rozměr", value: "60 × 40 mm" },
      { label: "Povrch", value: "žárový zinek" },
    ],
    description:
      "Profilovaný sloupek NOVUM 60×40 pro pevné opěrné konstrukce vinohradu.",
  },
  {
    slug: "drat-vodici-3-15",
    name: "Vodicí drát do vinohradu 3,15 mm (25 kg)",
    category: "vinohradnictvi",
    subcategory: "Dráty do vinohradu",
    brand: "EIKA",
    unit: "bal.",
    price: 690,
    priceB2B: 590,
    stock: 90,
    sku: "VI-DR315",
    rating: 4.6,
    ratingCount: 17,
    params: [
      { label: "Průměr", value: "3,15 mm" },
      { label: "Návin", value: "25 kg" },
      { label: "Povrch", value: "pozinkováno" },
    ],
    description:
      "Pozinkovaný vodicí drát 3,15 mm pro nosné dráty opěrné konstrukce. Návin 25 kg.",
    featured: true,
  },
  {
    slug: "drat-zdvojeny-2-24",
    name: "Zdvojený drát 2,24 mm (25 kg)",
    category: "vinohradnictvi",
    subcategory: "Dráty do vinohradu",
    brand: "EIKA",
    unit: "bal.",
    price: 640,
    priceB2B: 545,
    stock: 85,
    sku: "VI-DR224",
    rating: 4.5,
    ratingCount: 9,
    params: [
      { label: "Průměr", value: "2,24 mm" },
      { label: "Návin", value: "25 kg" },
    ],
    description:
      "Pozinkovaný zdvojený drát 2,24 mm pro vedení a fixaci letorostů. Návin 25 kg.",
  },
  {
    slug: "vazaci-dratek-pellenc",
    name: "Vázací drátek PELLENC papírový",
    category: "vinohradnictvi",
    subcategory: "Vázací materiál a kleště",
    brand: "PELLENC",
    unit: "bal.",
    price: 129,
    priceB2B: 105,
    stock: 240,
    sku: "VI-PEL",
    rating: 4.7,
    ratingCount: 22,
    badges: ["novinka"],
    params: [
      { label: "Materiál", value: "papírový" },
      { label: "Použití", value: "vázací kleště PELLENC" },
    ],
    description:
      "Papírový vázací drátek do vázacích kleští PELLENC. Rychlé a šetrné vázání letorostů.",
  },
  {
    slug: "vazaci-kleste-pellenc",
    name: "Vázací kleště na vinohrad PELLENC",
    category: "vinohradnictvi",
    subcategory: "Vázací materiál a kleště",
    brand: "PELLENC",
    unit: "ks",
    price: 1290,
    priceB2B: 1090,
    stock: 30,
    sku: "VI-KLE",
    rating: 4.8,
    ratingCount: 14,
    params: [
      { label: "Použití", value: "papírový drátek" },
      { label: "Rukojeť", value: "ergonomická" },
    ],
    description:
      "Vázací kleště pro rychlé vázání révy papírovým drátkem. Výrazně zrychlí práci ve vinohradu.",
  },
  {
    slug: "napinak-dratu",
    name: "Napínák drátu vinohradnický",
    category: "vinohradnictvi",
    subcategory: "Napínáky a kotvy",
    brand: "EIKA",
    unit: "ks",
    price: 39,
    priceB2B: 32,
    stock: 600,
    sku: "VI-NAP",
    rating: 4.5,
    ratingCount: 20,
    params: [
      { label: "Povrch", value: "pozinkováno" },
    ],
    description:
      "Pozinkovaný napínák pro vypnutí nosných drátů opěrné konstrukce vinohradu.",
  },
  {
    slug: "zemni-kotva-vrut",
    name: "Zemní kotva (vrut) do vinohradu",
    category: "vinohradnictvi",
    subcategory: "Napínáky a kotvy",
    brand: "EIKA",
    unit: "ks",
    price: 89,
    priceB2B: 74,
    stock: 320,
    sku: "VI-KOT",
    rating: 4.6,
    ratingCount: 11,
    params: [
      { label: "Provedení", value: "zemní vrut" },
      { label: "Povrch", value: "pozinkováno" },
    ],
    description:
      "Zemní kotva (vrut) pro ukotvení krajových sloupků a napínání drátů.",
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
      "Profesionální vinohradnické nůžky s kovanými čepelemi a ergonomickou rukojetí. Pro řez révy a keřů.",
    featured: true,
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
