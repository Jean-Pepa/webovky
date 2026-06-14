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
    tagline: { en: "Profiles, sheets, tubes, rebar", de: "Profile, Bleche, Rohre, Betonstahl" },
    description: {
      en: "A wide range of metal materials and products – steel profiles, sheets, tubes, rebar and mesh. Cutting to size and delivery by volume.",
      de: "Breites Sortiment an Hüttenmaterial – Stahlprofile, Bleche, Rohre, Betonstahl und Matten. Zuschnitt nach Maß und Lieferung nach Volumen.",
    },
    subs: {
      en: ["Rebar and welded mesh", "Profiles IPE, HEA, HEB, UNP", "Angles and T-profiles", "Square tubes and pipes", "Sheets and trapezoidal sheets", "Flat, round and square steel"],
      de: ["Betonstahl und Baustahlmatten", "Profile IPE, HEA, HEB, UNP", "Winkel und T-Profile", "Vierkantrohre und Rohre", "Bleche und Trapezbleche", "Flach-, Rund- und Vierkantstahl"],
    },
  },
  zelezarstvi: {
    name: { en: "Hardware", de: "Eisenwaren" },
    tagline: { en: "Tools, fasteners, plumbing & heating", de: "Werkzeuge, Verbindungselemente, Sanitär & Heizung" },
    description: {
      en: "Over 12,000 items for home, workshop and garden – tools, fasteners and anchors, plumbing and heating, locks and fittings, ladders and stoves.",
      de: "Über 12.000 Artikel für Haus, Werkstatt und Garten – Werkzeuge, Verbindungs- und Ankertechnik, Sanitär und Heizung, Schlösser und Beschläge, Leitern und Öfen.",
    },
    subs: {
      en: ["Tools and instruments", "Fasteners", "Anchors and rivets", "Plumbing and heating", "Locks, hinges and fittings", "Ladders and stoves"],
      de: ["Werkzeuge und Geräte", "Verbindungselemente", "Anker- und Niettechnik", "Sanitär und Heizung", "Schlösser, Scharniere und Beschläge", "Leitern und Öfen"],
    },
  },
  vinohradnictvi: {
    name: { en: "Viticulture", de: "Weinbau" },
    tagline: { en: "Supplies for winegrowers and vineyards", de: "Bedarf für Winzer und Weinberge" },
    description: {
      en: "One of the largest suppliers of viticulture supplies in South Moravia – posts, wires, tying material, tensioners, anchors and tools for winegrowers.",
      de: "Einer der größten Lieferanten für Weinbaubedarf in Südmähren – Pfähle, Drähte, Bindematerial, Spanner, Anker und Werkzeuge für Winzer.",
    },
    subs: {
      en: ["Vineyard posts", "Vineyard wires", "Tying material and pliers", "Tensioners and anchors", "Tools for winegrowers"],
      de: ["Weinbergpfähle", "Weinbergdrähte", "Bindematerial und Zangen", "Spanner und Anker", "Werkzeuge für Winzer"],
    },
  },
};

// --- Produkty (název + popis) ---
const PROD: Record<string, { name: Loc; description: Loc }> = {
  "betonarska-ocel-r10": {
    name: { en: "Rebar R 10 (ribbed)", de: "Betonstahl R 10 (gerippt)" },
    description: { en: "Ribbed rebar B500B, 10 mm. For reinforcing foundations, ring beams and slabs. Cutting and bending to order.", de: "Gerippter Betonstahl B500B, 10 mm. Zur Bewehrung von Fundamenten, Ringankern und Platten. Schneiden und Biegen auf Bestellung." },
  },
  "kari-sit-150x150x6": {
    name: { en: "Welded mesh 150×150×6 mm", de: "Baustahlmatte 150×150×6 mm" },
    description: { en: "Welded reinforcing mesh, 150×150 mm grid, 6 mm wire, 2×3 m. For reinforcing floors and slabs.", de: "Geschweißte Bewehrungsmatte, Raster 150×150 mm, Draht 6 mm, 2×3 m. Zur Bewehrung von Böden und Platten." },
  },
  "profil-ipe-160": {
    name: { en: "Steel profile IPE 160", de: "Stahlprofil IPE 160" },
    description: { en: "Rolled I-profile IPE 160, grade S235JR. For load-bearing structures, lintels and steel frames.", de: "Gewalztes I-Profil IPE 160, Güte S235JR. Für tragende Konstruktionen, Stürze und Stahlrahmen." },
  },
  "profil-unp-100": {
    name: { en: "Steel profile UNP 100 (U)", de: "Stahlprofil UNP 100 (U)" },
    description: { en: "Rolled U-profile UNP 100, grade S235JR. For load-bearing and connecting parts of steel structures.", de: "Gewalztes U-Profil UNP 100, Güte S235JR. Für tragende und verbindende Teile von Stahlkonstruktionen." },
  },
  "uhelnik-50x50x5": {
    name: { en: "Angle 50×50×5 mm (L profile)", de: "Winkel 50×50×5 mm (L-Profil)" },
    description: { en: "Equal angle (L profile) 50×50×5 mm. For frames, stiffeners and metalwork.", de: "Gleichschenkliger Winkel (L-Profil) 50×50×5 mm. Für Rahmen, Aussteifungen und Schlosserarbeiten." },
  },
  "jekl-40x40x2": {
    name: { en: "Square tube 40×40×2 mm", de: "Vierkantrohr 40×40×2 mm" },
    description: { en: "Closed welded profile 40×40×2 mm. For fences, structures, shelters and metalwork.", de: "Geschlossenes geschweißtes Profil 40×40×2 mm. Für Zäune, Konstruktionen, Überdachungen und Schlosserarbeiten." },
  },
  "trubka-zavitova-1": {
    name: { en: 'Threaded pipe 1" galvanised', de: 'Gewinderohr 1" verzinkt' },
    description: { en: 'Threaded steel pipe 1", hot-dip galvanised. For piping, structures and railings.', de: 'Gewinde-Stahlrohr 1", feuerverzinkt. Für Leitungen, Konstruktionen und Geländer.' },
  },
  "plech-trapez-tr18": {
    name: { en: "Trapezoidal sheet TR 18 galvanised", de: "Trapezblech TR 18 verzinkt" },
    description: { en: "Trapezoidal sheet TR 18, 0.5 mm, hot-dip galvanised. For roofs, cladding and fences.", de: "Trapezblech TR 18, 0,5 mm, feuerverzinkt. Für Dächer, Verkleidungen und Zäune." },
  },
  "plocha-ocel-40x5": {
    name: { en: "Flat steel 40×5 mm", de: "Flachstahl 40×5 mm" },
    description: { en: "Flat bar steel 40×5 mm. Universal for metalwork and construction.", de: "Flachstahl 40×5 mm. Universell für Schlosser- und Bauarbeiten." },
  },
  "vrtak-do-betonu-8mm": {
    name: { en: "Concrete drill SDS-plus 8×160 mm", de: "Betonbohrer SDS-plus 8×160 mm" },
    description: { en: "SDS-plus hammer drill with carbide tip, 8 mm. For concrete, brick and stone.", de: "SDS-plus Hammerbohrer mit Hartmetallspitze, 8 mm. Für Beton, Ziegel und Stein." },
  },
  "zednicke-kladivo-500": {
    name: { en: "Mason's hammer 500 g", de: "Maurerhammer 500 g" },
    description: { en: "Mason's hammer with 500 g head and fibreglass handle. Durable for everyday work.", de: "Maurerhammer mit 500-g-Kopf und Fiberglasstiel. Robust für den täglichen Einsatz." },
  },
  "vrut-do-dreva-5x60": {
    name: { en: "Wood screw 5.0×60 mm (pack of 200)", de: "Holzschraube 5,0×60 mm (200 Stk.)" },
    description: { en: "Universal countersunk screw, TX drive, yellow zinc. Pack of 200.", de: "Universal-Senkkopfschraube, TX-Antrieb, gelb verzinkt. 200 Stück." },
  },
  "matice-m10-din934": {
    name: { en: "Nut M10 DIN 934 (pack of 100)", de: "Mutter M10 DIN 934 (100 Stk.)" },
    description: { en: "Hexagon nut M10 per DIN 934, galvanised. Pack of 100.", de: "Sechskantmutter M10 nach DIN 934, verzinkt. 100 Stück." },
  },
  "hmozdinka-natloukaci-8x80": {
    name: { en: "Hammer-in anchor 8×80 mm (pack of 100)", de: "Einschlagdübel 8×80 mm (100 Stk.)" },
    description: { en: "Hammer-in anchor with screw, 8×80 mm. For fast fixing of battens and profiles into masonry.", de: "Einschlagdübel mit Schraube, 8×80 mm. Zur schnellen Befestigung von Latten und Profilen im Mauerwerk." },
  },
  "pruchozi-kotva-m10": {
    name: { en: "Through anchor M10×100 mm (pack of 25)", de: "Durchsteckanker M10×100 mm (25 Stk.)" },
    description: { en: "Steel through anchor M10×100 mm for anchoring into concrete. Pack of 25.", de: "Stahl-Durchsteckanker M10×100 mm zur Verankerung in Beton. 25 Stück." },
  },
  "kulovy-kohout-1-2": {
    name: { en: 'Ball valve 1/2" water', de: 'Kugelhahn 1/2" Wasser' },
    description: { en: 'Brass ball valve 1/2", full bore, lever. For water and heating.', de: 'Messing-Kugelhahn 1/2", voller Durchgang, Hebel. Für Wasser und Heizung.' },
  },
  "visaci-zamek-50mm": {
    name: { en: "Padlock 50 mm, 3 keys", de: "Vorhängeschloss 50 mm, 3 Schlüssel" },
    description: { en: "Padlock with hardened shackle, 50 mm body, supplied with 3 keys.", de: "Vorhängeschloss mit gehärtetem Bügel, 50 mm Körper, mit 3 Schlüsseln." },
  },
  "zebrik-hlinikovy-3x9": {
    name: { en: "Aluminium ladder 3×9 rungs", de: "Aluminiumleiter 3×9 Sprossen" },
    description: { en: "Three-part aluminium ladder 3×9 rungs, extendable, load 150 kg. Working height up to 6.1 m.", de: "Dreiteilige Aluminiumleiter 3×9 Sprossen, ausziehbar, Tragkraft 150 kg. Arbeitshöhe bis 6,1 m." },
  },
  "vinohradnicky-sloupek-radovy": {
    name: { en: "Vineyard row post galvanised 2.2 m", de: "Weinberg-Reihenpfahl verzinkt 2,2 m" },
    description: { en: "Hot-dip galvanised row post for training vines, 2.2 m. High corrosion resistance.", de: "Feuerverzinkter Reihenpfahl zum Führen von Reben, 2,2 m. Hohe Korrosionsbeständigkeit." },
  },
  "vinohradnicky-sloupek-novum": {
    name: { en: "Vineyard post NOVUM 60×40", de: "Weinbergpfahl NOVUM 60×40" },
    description: { en: "Profiled NOVUM 60×40 post for sturdy vineyard support structures.", de: "Profilierter Pfahl NOVUM 60×40 für stabile Weinberg-Stützkonstruktionen." },
  },
  "drat-vodici-3-15": {
    name: { en: "Vineyard guide wire 3.15 mm (25 kg)", de: "Weinberg-Führungsdraht 3,15 mm (25 kg)" },
    description: { en: "Galvanised guide wire 3.15 mm for carrier wires of support systems. 25 kg coil.", de: "Verzinkter Führungsdraht 3,15 mm für Tragdrähte von Stützsystemen. 25-kg-Rolle." },
  },
  "drat-zdvojeny-2-24": {
    name: { en: "Double wire 2.24 mm (25 kg)", de: "Doppeldraht 2,24 mm (25 kg)" },
    description: { en: "Galvanised double wire 2.24 mm for guiding and fixing shoots. 25 kg coil.", de: "Verzinkter Doppeldraht 2,24 mm zum Führen und Fixieren der Triebe. 25-kg-Rolle." },
  },
  "vazaci-dratek-pellenc": {
    name: { en: "PELLENC paper tying wire", de: "PELLENC Papier-Bindedraht" },
    description: { en: "Paper tying wire for PELLENC tying pliers. Fast and gentle tying of shoots.", de: "Papier-Bindedraht für PELLENC-Bindezangen. Schnelles und schonendes Binden der Triebe." },
  },
  "vazaci-kleste-pellenc": {
    name: { en: "PELLENC vineyard tying pliers", de: "PELLENC Weinberg-Bindezange" },
    description: { en: "Tying pliers for fast binding of vines with paper wire. Greatly speeds up vineyard work.", de: "Bindezange zum schnellen Binden der Reben mit Papierdraht. Beschleunigt die Arbeit im Weinberg erheblich." },
  },
  "napinak-dratu": {
    name: { en: "Vineyard wire tensioner", de: "Weinberg-Drahtspanner" },
    description: { en: "Galvanised tensioner for tensioning the carrier wires of a vineyard support structure.", de: "Verzinkter Spanner zum Spannen der Tragdrähte einer Weinberg-Stützkonstruktion." },
  },
  "zemni-kotva-vrut": {
    name: { en: "Ground anchor (screw) for vineyard", de: "Erdanker (Schraube) für Weinberg" },
    description: { en: "Ground anchor (screw) for anchoring end posts and tensioning wires.", de: "Erdanker (Schraube) zur Verankerung von Endpfählen und zum Spannen der Drähte." },
  },
  "vinohradnicke-nuzky": {
    name: { en: "Professional vine secateurs", de: "Profi-Rebschere" },
    description: { en: "Professional vine secateurs with forged blades and ergonomic grip. For pruning vines and shrubs.", de: "Professionelle Rebschere mit geschmiedeten Klingen und ergonomischem Griff. Zum Schnitt von Reben und Sträuchern." },
  },
};

// --- Termíny pro parametry (label i hodnoty) ---
const TERMS: Record<string, Loc> = {
  Profil: { en: "Profile", de: "Profil" },
  Jakost: { en: "Grade", de: "Güte" },
  Hmotnost: { en: "Weight", de: "Gewicht" },
  Délka: { en: "Length", de: "Länge" },
  Rozměr: { en: "Dimensions", de: "Abmessung" },
  Tloušťka: { en: "Thickness", de: "Dicke" },
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
  Závit: { en: "Thread", de: "Gewinde" },
  Norma: { en: "Standard", de: "Norm" },
  Násada: { en: "Handle", de: "Stiel" },
  Použití: { en: "Use", de: "Verwendung" },
  // hodnoty
  "žárový zinek": { en: "hot-dip galvanised", de: "feuerverzinkt" },
  "pozinkováno": { en: "galvanised", de: "verzinkt" },
  "žebírkový": { en: "ribbed", de: "gerippt" },
  "natloukací s vrutem": { en: "hammer-in with screw", de: "Einschlag mit Schraube" },
  mosaz: { en: "brass", de: "Messing" },
  "kalená ocel": { en: "hardened steel", de: "gehärteter Stahl" },
  "kovaná ocel": { en: "forged steel", de: "geschmiedeter Stahl" },
  "ergonomická": { en: "ergonomic", de: "ergonomisch" },
  "sklolaminát": { en: "fibreglass", de: "Fiberglas" },
  "papírový": { en: "paper", de: "Papier" },
  "zemní vrut": { en: "ground screw", de: "Erdschraube" },
  "vázací kleště PELLENC": { en: "PELLENC tying pliers", de: "PELLENC-Bindezange" },
  "papírový drátek": { en: "paper wire", de: "Papierdraht" },
  "do 25 mm": { en: "up to 25 mm", de: "bis 25 mm" },
};

function term(lang: "en" | "de", s: string): string {
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

function localizedSubcategory(p: Product, lang: "en" | "de"): string {
  const cat = CATEGORIES.find((c) => c.slug === p.category);
  if (!cat) return p.subcategory;
  const idx = cat.subcategories.indexOf(p.subcategory);
  if (idx < 0) return p.subcategory;
  return CAT[p.category].subs[lang][idx] ?? p.subcategory;
}

export function locCategories(lang: Lang): Category[] {
  return CATEGORIES.map((c) => locCategory(c, lang));
}
export function locProducts(list: Product[], lang: Lang): Product[] {
  return list.map((p) => locProduct(p, lang));
}
