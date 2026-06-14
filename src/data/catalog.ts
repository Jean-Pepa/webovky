// Datový model katalogu EIKA.
// Fáze 1: demo data. Ve Fázi 2 se nahradí daty z databáze (Supabase).

export type CategorySlug = "hutni-material" | "zelezarstvi" | "vinohradnictvi";

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
  unit: string; // ks, m, kg, bal.
  price: number; // cena bez DPH v Kč (B2C)
  priceB2B: number; // velkoobchodní cena pro firmy/živnostníky bez DPH
  stock: number; // skladem (počet jednotek)
  sku: string;
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
    unit: "m",
    price: 412,
    priceB2B: 365,
    stock: 240,
    sku: "HM-IPE160",
    description:
      "Válcovaný I-profil IPE 160, jakost S235JR. Vhodný pro nosné konstrukce, překlady a ocelové rámy. Dělení na míru na pile.",
    featured: true,
  },
  {
    slug: "profil-hea-100",
    name: "Ocelový profil HEA 100",
    category: "hutni-material",
    subcategory: "Profily (IPE, HEA, HEB, UNP, INP)",
    unit: "m",
    price: 389,
    priceB2B: 344,
    stock: 180,
    sku: "HM-HEA100",
    description:
      "Široký I-profil HEA 100, jakost S235JR. Univerzální nosník pro stavební a strojní konstrukce.",
  },
  {
    slug: "jekl-40x40x2",
    name: "Jekl 40×40×2 mm",
    category: "hutni-material",
    subcategory: "Trubky a duté profily",
    unit: "m",
    price: 78,
    priceB2B: 67,
    stock: 620,
    sku: "HM-J40402",
    description:
      "Uzavřený svařovaný profil (jekl) 40×40×2 mm. Pro ploty, konstrukce, přístřešky a zámečnické výrobky.",
    featured: true,
  },
  {
    slug: "plech-pozink-1mm",
    name: "Pozinkovaný plech 1,0 mm",
    category: "hutni-material",
    subcategory: "Plechy a trapézové plechy",
    unit: "m²",
    price: 268,
    priceB2B: 232,
    stock: 95,
    sku: "HM-PZ10",
    description:
      "Žárově pozinkovaný plech tloušťky 1,0 mm. Formát 1000×2000 mm, možnost dělení na tabule.",
  },
  {
    slug: "betonarska-ocel-r10",
    name: "Betonářská ocel R 10 (žebírková)",
    category: "hutni-material",
    subcategory: "Betonářská ocel a sítě",
    unit: "m",
    price: 39,
    priceB2B: 33,
    stock: 1500,
    sku: "HM-BR10",
    description:
      "Žebírková betonářská ocel B500B, průměr 10 mm. Pro výztuž základů, věnců a desek. Stříhání a ohýbání na zakázku.",
    featured: true,
  },
  {
    slug: "kari-sit-150x150x6",
    name: "KARI síť 150×150×6 mm",
    category: "hutni-material",
    subcategory: "Betonářská ocel a sítě",
    unit: "ks",
    price: 489,
    priceB2B: 421,
    stock: 320,
    sku: "HM-KARI6",
    description:
      "Svařovaná betonářská síť KARI, oko 150×150 mm, drát 6 mm, rozměr 2×3 m. Pro vyztužení podlah a desek.",
  },

  // --- Železářství ---
  {
    slug: "vrtak-do-betonu-8mm",
    name: "Vrták do betonu SDS-plus 8×160 mm",
    category: "zelezarstvi",
    subcategory: "Nářadí a nástroje",
    unit: "ks",
    price: 89,
    priceB2B: 71,
    stock: 210,
    sku: "ZE-SDS8",
    description:
      "Příklepový vrták SDS-plus se slinutou špičkou, průměr 8 mm, délka 160 mm. Pro beton, cihlu i kámen.",
    featured: true,
  },
  {
    slug: "vrut-do-dreva-5x60",
    name: "Vrut do dřeva 5,0×60 mm (bal. 200 ks)",
    category: "zelezarstvi",
    subcategory: "Spojovací a kotevní materiál",
    unit: "bal.",
    price: 215,
    priceB2B: 178,
    stock: 140,
    sku: "ZE-VR560",
    description:
      "Univerzální vrut se zápustnou hlavou, TX drážka, žlutý zinek. Balení 200 ks.",
  },
  {
    slug: "hmozdinka-natloukaci-8x80",
    name: "Natloukací hmoždinka 8×80 mm (bal. 100 ks)",
    category: "zelezarstvi",
    subcategory: "Spojovací a kotevní materiál",
    unit: "bal.",
    price: 169,
    priceB2B: 139,
    stock: 96,
    sku: "ZE-NH880",
    description:
      "Natloukací hmoždinka s vrutem, 8×80 mm. Pro rychlé kotvení latí, profilů a konstrukcí do zdiva.",
    featured: true,
  },
  {
    slug: "kulovy-kohout-1-2",
    name: 'Kulový kohout 1/2" voda',
    category: "zelezarstvi",
    subcategory: "Vodoinstalace a topení",
    unit: "ks",
    price: 119,
    priceB2B: 94,
    stock: 175,
    sku: "ZE-KK12",
    description:
      'Mosazný kulový kohout 1/2", plnoprůtokový, páčka. Pracovní tlak do 30 bar, pro vodu i topení.',
  },
  {
    slug: "visaci-zamek-50mm",
    name: "Visací zámek 50 mm, 3 klíče",
    category: "zelezarstvi",
    subcategory: "Zámky a kování",
    unit: "ks",
    price: 149,
    priceB2B: 121,
    stock: 130,
    sku: "ZE-VZ50",
    description:
      "Visací zámek s tvrzeným třmenem, šířka těla 50 mm, dodáván se 3 klíči.",
  },
  {
    slug: "zebrik-hlinikovy-3x9",
    name: "Hliníkový žebřík 3×9 příček",
    category: "zelezarstvi",
    subcategory: "Žebříky a polykarbonát",
    unit: "ks",
    price: 4290,
    priceB2B: 3790,
    stock: 18,
    sku: "ZE-ZEB39",
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
    unit: "ks",
    price: 159,
    priceB2B: 129,
    stock: 460,
    sku: "VI-SL22",
    description:
      "Žárově pozinkovaný profilovaný sloupek pro vedení vinné révy, délka 2,2 m. Vysoká odolnost proti korozi.",
    featured: true,
  },
  {
    slug: "vazaci-drat-pozink-2mm",
    name: "Vázací drát pozinkovaný 2,0 mm (5 kg)",
    category: "vinohradnictvi",
    subcategory: "Vázací a drátěný materiál",
    unit: "bal.",
    price: 289,
    priceB2B: 244,
    stock: 210,
    sku: "VI-DR20",
    description:
      "Pozinkovaný napínací drát 2,0 mm pro vinohrady, návin 5 kg. Pro nosné a vodicí dráty opěrné konstrukce.",
  },
  {
    slug: "vinohradnicke-nuzky",
    name: "Vinohradnické nůžky profi",
    category: "vinohradnictvi",
    subcategory: "Nářadí pro vinaře",
    unit: "ks",
    price: 459,
    priceB2B: 379,
    stock: 64,
    sku: "VI-NU01",
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

export function productsByCategory(slug: string): Product[] {
  return PRODUCTS.filter((p) => p.category === slug);
}

export function featuredProducts(): Product[] {
  return PRODUCTS.filter((p) => p.featured);
}

export function searchProducts(query: string): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return PRODUCTS;
  return PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      p.subcategory.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
  );
}
