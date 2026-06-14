import {
  CATEGORIES,
  PRODUCTS,
  type Category,
  type Product,
  type CategorySlug,
} from "@/data/catalog";
import type { Lang } from "./messages";

type Loc = { en: string; de: string };
type LocList = { en: string[]; de: string[] };

// --- Kategorie ---
const CAT: Record<CategorySlug, { name: Loc; tagline: Loc; description: Loc; subs: LocList }> = {
  "hutni-material": {
    name: { en: "Metal materials", de: "Hüttenmaterial" },
    tagline: {
      en: "Profiles, sheets, tubes, rebar",
      de: "Profile, Bleche, Rohre, Betonstahl",
    },
    description: {
      en: "A wide range of metal materials and products – steel profiles, sheets, tubes, rebar and mesh. Cutting to size and delivery by volume.",
      de: "Breites Sortiment an Hüttenmaterial – Stahlprofile, Bleche, Rohre, Betonstahl und Matten. Zuschnitt nach Maß und Lieferung nach Volumen.",
    },
    subs: {
      en: ["Profiles (IPE, HEA, HEB, UNP, INP)", "Sheets and trapezoidal sheets", "Tubes and hollow profiles", "Rebar and mesh", "Sandwich panels"],
      de: ["Profile (IPE, HEA, HEB, UNP, INP)", "Bleche und Trapezbleche", "Rohre und Hohlprofile", "Betonstahl und Matten", "Sandwichpaneele"],
    },
  },
  zelezarstvi: {
    name: { en: "Hardware", de: "Eisenwaren" },
    tagline: {
      en: "Tools, fasteners, plumbing & heating",
      de: "Werkzeuge, Verbindungselemente, Sanitär & Heizung",
    },
    description: {
      en: "Everything for home, workshop and garden – tools, fasteners and anchors, plumbing and heating, locks and fittings, ladders, polycarbonate and galvanised goods.",
      de: "Alles für Haus, Werkstatt und Garten – Werkzeuge, Verbindungs- und Ankertechnik, Sanitär und Heizung, Schlösser und Beschläge, Leitern, Polycarbonat und verzinkte Waren.",
    },
    subs: {
      en: ["Tools and instruments", "Fasteners and anchors", "Plumbing and heating", "Locks and fittings", "Ladders and polycarbonate"],
      de: ["Werkzeuge und Geräte", "Verbindungs- und Ankertechnik", "Sanitär und Heizung", "Schlösser und Beschläge", "Leitern und Polycarbonat"],
    },
  },
  vinohradnictvi: {
    name: { en: "Viticulture", de: "Weinbau" },
    tagline: {
      en: "Supplies for winegrowers and vineyards",
      de: "Bedarf für Winzer und Weinberge",
    },
    description: {
      en: "One of the largest suppliers of viticulture supplies in South Moravia – posts, wire, tying material, support systems and tools for winegrowers.",
      de: "Einer der größten Lieferanten für Weinbaubedarf in Südmähren – Pfähle, Draht, Bindematerial, Stützsysteme und Werkzeuge für Winzer.",
    },
    subs: {
      en: ["Posts and support systems", "Tying and wire material", "Tools for winegrowers"],
      de: ["Pfähle und Stützsysteme", "Binde- und Drahtmaterial", "Werkzeuge für Winzer"],
    },
  },
};

// --- Produkty (název + popis) ---
const PROD: Record<string, { name: Loc; description: Loc }> = {
  "profil-ipe-160": {
    name: { en: "Steel profile IPE 160", de: "Stahlprofil IPE 160" },
    description: { en: "Rolled I-profile IPE 160, grade S235JR. Suitable for load-bearing structures, lintels and steel frames. Cut to size.", de: "Gewalztes I-Profil IPE 160, Güte S235JR. Für tragende Konstruktionen, Stürze und Stahlrahmen. Zuschnitt nach Maß." },
  },
  "profil-hea-100": {
    name: { en: "Steel profile HEA 100", de: "Stahlprofil HEA 100" },
    description: { en: "Wide I-profile HEA 100, grade S235JR. A versatile beam for structural and mechanical use.", de: "Breites I-Profil HEA 100, Güte S235JR. Vielseitiger Träger für Bau und Maschinenbau." },
  },
  "jekl-40x40x2": {
    name: { en: "Square tube 40×40×2 mm", de: "Vierkantrohr 40×40×2 mm" },
    description: { en: "Closed welded profile 40×40×2 mm. For fences, structures, shelters and metalwork.", de: "Geschlossenes geschweißtes Profil 40×40×2 mm. Für Zäune, Konstruktionen, Überdachungen und Schlosserarbeiten." },
  },
  "plech-pozink-1mm": {
    name: { en: "Galvanised sheet 1.0 mm", de: "Verzinktes Blech 1,0 mm" },
    description: { en: "Hot-dip galvanised sheet 1.0 mm thick. Format 1000×2000 mm, can be cut to size.", de: "Feuerverzinktes Blech 1,0 mm. Format 1000×2000 mm, Zuschnitt möglich." },
  },
  "betonarska-ocel-r10": {
    name: { en: "Rebar R 10 (ribbed)", de: "Betonstahl R 10 (gerippt)" },
    description: { en: "Ribbed rebar B500B, diameter 10 mm. For reinforcing foundations, ring beams and slabs. Cutting and bending to order.", de: "Gerippter Betonstahl B500B, Durchmesser 10 mm. Zur Bewehrung von Fundamenten, Ringankern und Platten. Schneiden und Biegen auf Bestellung." },
  },
  "kari-sit-150x150x6": {
    name: { en: "Mesh 150×150×6 mm", de: "Baustahlmatte 150×150×6 mm" },
    description: { en: "Welded reinforcing mesh, 150×150 mm grid, 6 mm wire, 2×3 m. For reinforcing floors and slabs.", de: "Geschweißte Bewehrungsmatte, Raster 150×150 mm, Draht 6 mm, 2×3 m. Zur Bewehrung von Böden und Platten." },
  },
  "vrtak-do-betonu-8mm": {
    name: { en: "Concrete drill SDS-plus 8×160 mm", de: "Betonbohrer SDS-plus 8×160 mm" },
    description: { en: "SDS-plus hammer drill with carbide tip, 8 mm diameter, 160 mm length. For concrete, brick and stone.", de: "SDS-plus Hammerbohrer mit Hartmetallspitze, 8 mm, Länge 160 mm. Für Beton, Ziegel und Stein." },
  },
  "vrut-do-dreva-5x60": {
    name: { en: "Wood screw 5.0×60 mm (pack of 200)", de: "Holzschraube 5,0×60 mm (200 Stk.)" },
    description: { en: "Universal countersunk screw, TX drive, yellow zinc. Pack of 200.", de: "Universal-Senkkopfschraube, TX-Antrieb, gelb verzinkt. 200 Stück." },
  },
  "hmozdinka-natloukaci-8x80": {
    name: { en: "Hammer-in anchor 8×80 mm (pack of 100)", de: "Einschlagdübel 8×80 mm (100 Stk.)" },
    description: { en: "Hammer-in anchor with screw, 8×80 mm. For fast fixing of battens, profiles and structures into masonry.", de: "Einschlagdübel mit Schraube, 8×80 mm. Zur schnellen Befestigung von Latten, Profilen und Konstruktionen im Mauerwerk." },
  },
  "kulovy-kohout-1-2": {
    name: { en: 'Ball valve 1/2" water', de: 'Kugelhahn 1/2" Wasser' },
    description: { en: 'Brass ball valve 1/2", full bore, lever. Working pressure up to 30 bar, for water and heating.', de: 'Messing-Kugelhahn 1/2", voller Durchgang, Hebel. Betriebsdruck bis 30 bar, für Wasser und Heizung.' },
  },
  "visaci-zamek-50mm": {
    name: { en: "Padlock 50 mm, 3 keys", de: "Vorhängeschloss 50 mm, 3 Schlüssel" },
    description: { en: "Padlock with hardened shackle, 50 mm body, supplied with 3 keys.", de: "Vorhängeschloss mit gehärtetem Bügel, 50 mm Körper, mit 3 Schlüsseln." },
  },
  "zebrik-hlinikovy-3x9": {
    name: { en: "Aluminium ladder 3×9 rungs", de: "Aluminiumleiter 3×9 Sprossen" },
    description: { en: "Three-part aluminium ladder 3×9 rungs, extendable, load capacity 150 kg. Working height up to 6.1 m.", de: "Dreiteilige Aluminiumleiter 3×9 Sprossen, ausziehbar, Tragkraft 150 kg. Arbeitshöhe bis 6,1 m." },
  },
  "vinohradnicky-sloupek-pozink": {
    name: { en: "Galvanised vineyard post 2.2 m", de: "Verzinkter Weinbergpfahl 2,2 m" },
    description: { en: "Hot-dip galvanised profiled post for training vines, 2.2 m long. High corrosion resistance.", de: "Feuerverzinkter Profilpfahl zum Führen von Reben, 2,2 m lang. Hohe Korrosionsbeständigkeit." },
  },
  "vazaci-drat-pozink-2mm": {
    name: { en: "Galvanised tying wire 2.0 mm (5 kg)", de: "Verzinkter Bindedraht 2,0 mm (5 kg)" },
    description: { en: "Galvanised tensioning wire 2.0 mm for vineyards, 5 kg coil. For carrier and guide wires of support systems.", de: "Verzinkter Spanndraht 2,0 mm für Weinberge, 5 kg Rolle. Für Trag- und Führungsdrähte von Stützsystemen." },
  },
  "vinohradnicke-nuzky": {
    name: { en: "Professional vine secateurs", de: "Profi-Rebschere" },
    description: { en: "Professional garden/vine secateurs with forged blades and ergonomic grip. For pruning vines and shrubs.", de: "Professionelle Garten-/Rebschere mit geschmiedeten Klingen und ergonomischem Griff. Zum Schnitt von Reben und Sträuchern." },
  },
};

// --- Termíny pro parametry (label i hodnoty) ---
const TERMS: Record<string, Loc> = {
  Profil: { en: "Profile", de: "Profil" },
  Jakost: { en: "Grade", de: "Güte" },
  Hmotnost: { en: "Weight", de: "Gewicht" },
  "Délka tyče": { en: "Bar length", de: "Stangenlänge" },
  Délka: { en: "Length", de: "Länge" },
  Rozměr: { en: "Dimensions", de: "Abmessung" },
  "Tloušťka stěny": { en: "Wall thickness", de: "Wandstärke" },
  Tloušťka: { en: "Thickness", de: "Dicke" },
  Formát: { en: "Format", de: "Format" },
  Povrch: { en: "Surface", de: "Oberfläche" },
  Průměr: { en: "Diameter", de: "Durchmesser" },
  Oko: { en: "Mesh", de: "Masche" },
  Drát: { en: "Wire", de: "Draht" },
  Upnutí: { en: "Chuck", de: "Aufnahme" },
  Drážka: { en: "Drive", de: "Antrieb" },
  Balení: { en: "Packaging", de: "Verpackung" },
  Typ: { en: "Type", de: "Typ" },
  Připojení: { en: "Connection", de: "Anschluss" },
  Materiál: { en: "Material", de: "Material" },
  "Max. tlak": { en: "Max. pressure", de: "Max. Druck" },
  "Šířka těla": { en: "Body width", de: "Körperbreite" },
  Třmen: { en: "Shackle", de: "Bügel" },
  Klíče: { en: "Keys", de: "Schlüssel" },
  Provedení: { en: "Design", de: "Ausführung" },
  Nosnost: { en: "Load capacity", de: "Tragkraft" },
  "Pracovní výška": { en: "Working height", de: "Arbeitshöhe" },
  Návin: { en: "Coil", de: "Rolle" },
  Čepel: { en: "Blade", de: "Klinge" },
  Střih: { en: "Cut", de: "Schnitt" },
  Rukojeť: { en: "Grip", de: "Griff" },
  // hodnoty
  "žárový zinek": { en: "hot-dip galvanised", de: "feuerverzinkt" },
  "pozinkováno": { en: "galvanised", de: "verzinkt" },
  "žebírkový": { en: "ribbed", de: "gerippt" },
  "natloukací s vrutem": { en: "hammer-in with screw", de: "Einschlag mit Schraube" },
  mosaz: { en: "brass", de: "Messing" },
  "kalená ocel": { en: "hardened steel", de: "gehärteter Stahl" },
  "kovaná ocel": { en: "forged steel", de: "geschmiedeter Stahl" },
  "ergonomická": { en: "ergonomic", de: "ergonomisch" },
  "do 12 m": { en: "up to 12 m", de: "bis 12 m" },
  "do 25 mm": { en: "up to 25 mm", de: "bis 25 mm" },
};

function term(lang: Lang, s: string): string {
  if (lang === "cs") return s;
  const hit = TERMS[s];
  return hit ? hit[lang] : s;
}

export function locCategory(c: Category, lang: Lang): Category {
  if (lang === "cs") return c;
  const x = CAT[c.slug];
  return {
    ...c,
    name: x.name[lang],
    tagline: x.tagline[lang],
    description: x.description[lang],
    subcategories: x.subs[lang],
  };
}

export function locProduct(p: Product, lang: Lang): Product {
  if (lang === "cs") return p;
  const x = PROD[p.slug];
  return {
    ...p,
    name: x ? x.name[lang] : p.name,
    description: x ? x.description[lang] : p.description,
    subcategory: localizedSubcategory(p, lang),
    params: p.params?.map((pr) => ({ label: term(lang, pr.label), value: term(lang, pr.value) })),
  };
}

// najdi přeloženou podkategorii podle pozice v původní kategorii
function localizedSubcategory(p: Product, lang: "en" | "de"): string {
  const cat = CATEGORIES.find((c) => c.slug === p.category);
  if (!cat) return p.subcategory;
  const idx = cat.subcategories.indexOf(p.subcategory);
  if (idx < 0) return p.subcategory;
  return CAT[p.category].subs[lang][idx] ?? p.subcategory;
}

// pomocné: lokalizované seznamy
export function locCategories(lang: Lang): Category[] {
  return CATEGORIES.map((c) => locCategory(c, lang));
}
export function locProducts(list: Product[], lang: Lang): Product[] {
  return list.map((p) => locProduct(p, lang));
}
