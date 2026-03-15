const ARCH_TERMS: Record<string, string> = {
  // Building types
  museum: "muzeum",
  library: "knihovna",
  school: "škola",
  university: "univerzita",
  hospital: "nemocnice",
  church: "kostel",
  chapel: "kaple",
  theater: "divadlo",
  theatre: "divadlo",
  gallery: "galerie",
  pavilion: "pavilon",
  stadium: "stadion",
  tower: "věž",
  bridge: "most",
  station: "stanice",
  airport: "letiště",
  hotel: "hotel",
  office: "kancelář",
  factory: "továrna",
  warehouse: "sklad",
  // Project types
  residential: "rezidenční",
  commercial: "komerční",
  cultural: "kulturní",
  public: "veřejný",
  industrial: "průmyslový",
  mixed: "smíšený",
  housing: "bydlení",
  apartment: "byt",
  villa: "vila",
  house: "dům",
  // Actions
  renovation: "rekonstrukce",
  restoration: "restaurace",
  extension: "přístavba",
  conversion: "konverze",
  refurbishment: "rekonstrukce",
  masterplan: "územní plán",
  // Materials & features
  concrete: "beton",
  wood: "dřevo",
  timber: "dřevo",
  brick: "cihla",
  glass: "sklo",
  steel: "ocel",
  stone: "kámen",
  sustainable: "udržitelný",
  landscape: "krajina",
  interior: "interiér",
  facade: "fasáda",
  rooftop: "střešní",
  courtyard: "dvůr",
  // Style
  modern: "moderní",
  contemporary: "současný",
  minimalist: "minimalistický",
  brutalist: "brutalistický",
  parametric: "parametrický",
};

export function translateTag(tag: string): string {
  const lower = tag.toLowerCase();
  return ARCH_TERMS[lower] || tag;
}

export function translateTags(tags: string[]): string[] {
  return tags.map(translateTag);
}
