import type { IconName } from "./icons";
import type { Boiler, DocCat, Device, Drawing, HistoryItem, HouseInfo, SensorId, Tone } from "./types";

// Obrázky aplikace leží v /public/aplikace.
export const IMG = (p: string) => `/aplikace/${p}`;

// Barvy stavů (z návrhu).
export const TONES: Record<Tone, { bg: string; fg: string }> = {
  ok: { bg: "#E4F1E8", fg: "#2E7D4F" },
  warn: { bg: "#F8ECD8", fg: "#A8661A" },
  bad: { bg: "#F8E1DE", fg: "#C0392B" },
  clay: { bg: "#F4E4DD", fg: "#B5543A" },
  info: { bg: "#E1ECF9", fg: "#2F7FD8" },
  muted: { bg: "#EEEBE7", fg: "#6F6A65" },
  orange: { bg: "#FBEBDD", fg: "#E0791A" },
  gas: { bg: "#F7F0D0", fg: "#9A7A00" },
  bim: { bg: "#E3EEF7", fg: "#3E7CB1" },
  neutral: { bg: "#EEEBE7", fg: "#141414" },
};

// ---------- Půdorys 1. NP chaty (souřadnice 346 × 271, z návrhu) ----------
export const PLAN_RECTS: [number, number, number, number, string][] = [[53.1,216.2,280.4,44.7,"#EFEAE3"], [18.5,78.2,76.5,131.6,"#F7F5F2"], [95.0,78.2,71.0,131.6,"#F7F5F2"], [149.6,17.5,65.5,54.4,"#F7F5F2"], [218.1,17.5,36.4,54.4,"#F7F5F2"], [258.2,17.5,33.5,54.4,"#F7F5F2"], [149.6,78.2,142.0,20.5,"#F7F5F2"], [171.5,105.5,58.3,104.4,"#F7F5F2"], [233.4,105.5,58.3,104.4,"#F7F5F2"], [149.6,54.0,21.9,24.2,"#F7F5F2"], [11.2,132.3,7.3,77.5,"#141414"], [11.2,67.0,7.3,42.9,"#141414"], [11.2,209.8,40.0,6.3,"#141414"], [87.7,209.8,3.6,6.3,"#141414"], [129.6,209.8,56.5,6.3,"#141414"], [215.2,209.8,34.6,6.3,"#141414"], [278.9,209.8,19.3,6.3,"#141414"], [291.6,63.3,6.6,146.5,"#141414"], [291.6,17.5,6.6,29.1,"#141414"], [142.3,10.0,30.6,7.5,"#141414"], [186.8,10.0,42.3,7.5,"#141414"], [242.1,10.0,56.1,7.5,"#141414"], [142.3,71.1,7.3,7.1,"#141414"], [142.3,17.5,7.3,36.5,"#141414"], [18.5,67.0,76.5,11.2,"#141414"], [95.0,72.6,16.4,5.6,"#141414"], [136.9,72.6,5.5,5.6,"#141414"], [93.2,78.2,3.6,76.5,"#141414"], [166.0,98.7,5.5,111.8,"#141414"], [229.7,102.5,3.6,108.1,"#141414"], [171.5,98.7,29.1,6.7,"#141414"], [215.2,98.7,27.3,6.7,"#141414"], [257.0,98.7,34.6,6.7,"#141414"], [171.5,71.9,25.5,6.3,"#141414"], [211.5,71.9,9.1,6.3,"#141414"], [233.4,71.9,27.3,6.3,"#141414"], [275.3,71.9,16.4,6.3,"#141414"], [149.6,71.9,1.8,6.3,"#141414"], [166.0,71.9,5.5,6.3,"#141414"], [215.2,17.5,2.9,54.4,"#141414"], [254.5,17.5,3.6,54.4,"#141414"], [191.5,42.8,2.9,29.1,"#141414"]];
export const PLAN_PATHS: [string, string, number][] = [["M76.5 216.2V260.9","#E2DBD2",1], ["M99.9 216.2V260.9","#E2DBD2",1], ["M123.2 216.2V260.9","#E2DBD2",1], ["M146.6 216.2V260.9","#E2DBD2",1], ["M170.0 216.2V260.9","#E2DBD2",1], ["M193.3 216.2V260.9","#E2DBD2",1], ["M216.7 216.2V260.9","#E2DBD2",1], ["M240.1 216.2V260.9","#E2DBD2",1], ["M263.4 216.2V260.9","#E2DBD2",1], ["M286.8 216.2V260.9","#E2DBD2",1], ["M310.2 216.2V260.9","#E2DBD2",1], ["M51.3 213.0H87.7","#9FB7C4",2], ["M172.9 13.7H186.8","#9FB7C4",2], ["M229.0 13.7H242.1","#9FB7C4",2], ["M111.4 75.4H136.9","#9FB7C4",2], ["M27.1 78.2V109.9","#CFC8BF",1], ["M35.7 78.2V109.9","#CFC8BF",1], ["M44.3 78.2V109.9","#CFC8BF",1], ["M52.9 78.2V109.9","#CFC8BF",1], ["M61.4 78.2V109.9","#CFC8BF",1], ["M70.0 78.2V109.9","#CFC8BF",1]];
export const PLAN_TEXTS: [number, number, string][] = [[56.8,162.9,"Pokoj"], [130.5,148.0,"Kuchyň"], [220.6,92.5,"Chodba"], [200.6,161.6,"Pokoj"], [262.5,161.6,"Pokoj"], [193.3,242.5,"Terasa"]];
// Cesta od vstupu do technické místnosti (pro technika).
export const PLAN_ENTRY: [number, number] = [138.2, 62.6];
export const PLAN_ROUTE: [number, number][] = [[138.2, 62.6], [153.9, 62.6], [162.4, 67.5], [162.4, 88.6], [227.4, 88.6], [227.4, 68.8], [234.3, 57.6], [234.3, 46.5]];

// Místnosti půdorysu (pro ruční umístění hlídače).
export const ROOMS: { name: string; x: number; y: number; w: number; h: number }[] = [
  { name: "Pokoj", x: 18.5, y: 78.2, w: 76.5, h: 131.6 },
  { name: "Kuchyň", x: 95, y: 78.2, w: 71, h: 131.6 },
  { name: "Koupelna", x: 149.6, y: 17.5, w: 65.5, h: 54.4 },
  { name: "Technická místnost", x: 218.1, y: 17.5, w: 73.6, h: 54.4 },
  { name: "Chodba", x: 149.6, y: 78.2, w: 142, h: 20.5 },
  { name: "Pokoj", x: 171.5, y: 105.5, w: 58.3, h: 104.4 },
  { name: "Pokoj", x: 233.4, y: 105.5, w: 58.3, h: 104.4 },
  { name: "Terasa", x: 53.1, y: 216.2, w: 280.4, h: 44.7 },
];

// ---------- AR (souřadnice ve fotce technické místnosti 1920 × 1080, z návrhu) ----------
export const AR = {
  pxPerM: 744,
  kotel: [868.6, 463.8] as [number, number],
  valve: [1302.0, 803.8] as [number, number],
  ext: [1167.5, 781.3] as [number, number],
  leak: [1217.8, 634.7] as [number, number],
  hull: [[760.8, 271.8], [970.6, 271], [982.6, 283.4], [981.1, 638.6], [969.7, 712.6], [777.6, 708]] as [number, number][],
  routes: {
    gas: [[801, 742], [592, 1117], [645, 1739]],
    el: [[664, -532], [719, 574]],
    el_k: [[715, 500], [778, 466]],
    heat_s: [[792, 1035], [798, 1178], [909, 1185], [936, 989], [1445, 1011]],
    heat_r: [[823, 942], [827, 1070], [960, 1076], [970, 971], [1432, 990]],
    water: [[1218, 635], [1211, 763], [1016, 758], [1014, 825], [866, 821], [817, 970], [817, 961]],
  } as Record<string, [number, number][]>,
  labels: {
    gas: [678.8, 961.2],
    el: [706.3, 314.8],
    heat_s: [1100, 996],
    water: [1133.8, 761.0],
  } as Record<string, [number, number]>,
};

// Trasy ve zdi u kotle (fotka 780 × 1690 = obrazovka 390 × 845 při 2×).
export const WALL = {
  gas: [[524, 587], [33, 584], [-254, 583], [-244, 1246]] as [number, number][],
  cable: [[146, -899], [148, 221]] as [number, number][],
  socket: [147, 254] as [number, number],
};

// ---------- Budovy ----------
export const HOUSE_CODE = "LOU-0127";

export const HOUSES: HouseInfo[] = [
  { id: "loucky", name: "Chata Loučky", place: "Bítov", kind: "rekreační chata", icon: "house", color: "#B5543A", code: HOUSE_CODE, hero: IMG("img/hero.jpg"), demo: true },
  { id: "u-parku", name: "Dům U Parku", place: "Brno", kind: "SVJ · 24 bytů", icon: "building", color: "#3E7CB1", code: "UPA-0412" },
  { id: "dilna", name: "Dílna a sklad", place: "Znojmo", kind: "firma", icon: "warehouse", color: "#4F7A5A", code: "DIL-0388" },
];

// ---------- Chata Loučky: zařízení ----------
export const BOILER_START: Boiler = {
  model: "KK 24",
  power: "24 kW",
  serial: "2404-118722",
  warranty: "4/2029",
  installed: "4/2024",
  serviceLast: "11/2025",
  serviceNext: "dnes",
};

export const DEVICES: Device[] = [
  {
    id: "kotel", name: "Kotel", type: "Plynový kondenzační · 24 kW", room: "Technická místnost", where: "z chodby 2. dveře vlevo",
    icon: "flame", tone: "clay", plan: [223.3, 43.9], num: 1, photo: IMG("img/kotel_photo.jpg"),
    connections: [
      { name: "Plyn", detail: "Ve zdi od kotle k rohu", acc: "změřeno ±2 cm", icon: "flame", tone: "gas" },
      { name: "Elektro", detail: "Okruh F7 · zásuvka vlevo", acc: "změřeno ±1 cm", icon: "bolt", tone: "orange" },
      { name: "Komín", detail: "Kouřovod do komína", acc: "viditelné", icon: "chimney", tone: "muted" },
    ],
  },
  { id: "komin", name: "Komín", type: "Nerezová vložka Ø 80 mm", room: "Technická místnost → střecha", where: "kouřovod nad kotlem", icon: "chimney", tone: "warn", plan: [223.6, 12.2], num: 2, serviceLast: "10/2025" },
  { id: "rozvadec", name: "Rozvaděč R1", type: "Hlavní rozvaděč · 12 okruhů", room: "Chodba u vstupu", where: "vlevo za dveřmi", icon: "bolt", tone: "orange", plan: [180.2, 81.2], num: 3, serviceLast: "6/2022", serviceNext: "6/2027" },
  { id: "uzaver", name: "Hlavní uzávěr vody", type: "Kulový ventil DN 25 · u vodoměru", room: "Technická místnost", where: "u okna, za vodoměrem", icon: "drop", tone: "info", plan: [256.9, 22.2], num: 4 },
  { id: "vodomer", name: "Vodoměr", type: "Hlavní přívod · výměna 3/2024", room: "Technická místnost", where: "u okna", icon: "drop", tone: "info", installed: "3/2024" },
  { id: "zasobnik", name: "Zásobník teplé vody", type: "Nepřímotopný · 120 l", room: "Technická místnost", where: "vpravo od kotle", icon: "drop", tone: "bad", installed: "4/2024", warranty: "4/2029" },
  { id: "hup", name: "Hlavní uzávěr plynu", type: "Přípojka plynu · HUP", room: "Fasáda u vstupu", where: "skříňka vlevo od dveří", icon: "flame", tone: "gas" },
  { id: "elektromer", name: "Elektroměr", type: "Přípojková skříň", room: "Pilíř u brány", where: "u vjezdu", icon: "bolt", tone: "orange" },
  { id: "hasicak", name: "Hasicí přístroj", type: "Práškový 6 kg", room: "Technická místnost", where: "vpravo u dveří", icon: "ext", tone: "bad", serviceLast: "10/2024", serviceNext: "10/2027" },
  { id: "hlasic", name: "Hlásič kouře", type: "Autonomní, bateriový", room: "Chodba", where: "strop u schodů", icon: "smoke", tone: "muted", serviceLast: "10/2026" },
  { id: "radiatory", name: "Radiátory", type: "6 ks · deskové", room: "Pokoje a kuchyň", where: "pod okny", icon: "thermo", tone: "bad", installed: "2/2024" },
  { id: "svetla", name: "Venkovní osvětlení", type: "Terasa · okruh F3", room: "Terasa", where: "pod přesahem střechy", icon: "sun", tone: "orange", installed: "12/2023" },
];

// ---------- Hlídače (čidla) ----------
export const SENSORS: { id: SensorId; name: string; place: string; icon: IconName; tone: Tone }[] = [
  { id: "teplota", name: "Teplota", place: "Pokoj · 1. NP", icon: "thermo", tone: "bad" },
  { id: "kour", name: "Kouř", place: "Chodba · test 10/2026", icon: "smoke", tone: "muted" },
  { id: "komin", name: "Komín", place: "usazeniny v kouřovodu", icon: "chimney", tone: "warn" },
  { id: "voda", name: "Voda", place: "průtok · hlavní přívod", icon: "drop", tone: "info" },
  { id: "elektrina", name: "Elektřina", place: "odběr · rozvaděč R1", icon: "bolt", tone: "orange" },
  { id: "plyn", name: "Plyn", place: "průtok · kotel topí", icon: "flame", tone: "gas" },
];

// ---------- Dokumenty ----------
export const DOCS: DocCat[] = [
  {
    id: "vykresy", name: "Výkresy", sub: "půdorysy, řezy, pohledy · 8", icon: "doc", tone: "neutral", chip: "z ArchiCADu",
    files: [],
  },
  {
    id: "bim", name: "BIM model", sub: "IFC · verze 12 · 20. 10.", icon: "cube", tone: "bim", chip: "aktuální",
    files: [
      { id: "bim12", name: "Chata_Loucky_v12.ifc", meta: "48 MB · verze 12 · 20. 10. 2026", kind: "ifc", source: "Architekt" },
      { id: "bim11", name: "Chata_Loucky_v11.ifc", meta: "47 MB · verze 11 · 2. 9. 2026 · nahrazeno", kind: "ifc", source: "Architekt" },
    ],
  },
  {
    id: "povoleni", name: "Povolení stavby", sub: "rozhodnutí stavebního úřadu", icon: "key", tone: "neutral", chip: "ověřeno",
    files: [
      { id: "pov1", name: "Rozhodnutí o povolení stavby.pdf", meta: "6 stran · MěÚ Znojmo · 8/2023", kind: "pdf", source: "Stavební úřad" },
      { id: "pov2", name: "Stanoviska dotčených orgánů.pdf", meta: "14 stran · 7/2023", kind: "pdf", source: "Architekt" },
    ],
  },
  {
    id: "pbr", name: "Požárně bezpečnostní řešení", sub: "PBŘ k projektu", icon: "flame", tone: "bad", chip: "z projektu",
    files: [{ id: "pbr1", name: "PBŘ – technická zpráva.pdf", meta: "11 stran · 6/2023", kind: "pdf", source: "Projektant PBŘ" }],
  },
  {
    id: "penb", name: "Energetický štítek", sub: "PENB · třída C", icon: "bolt", tone: "orange", chip: "ověřeno",
    files: [{ id: "penb1", name: "PENB Chata Loučky.pdf", meta: "4 strany · třída C · 9/2025", kind: "pdf", source: "Energetický specialista" }],
  },
  {
    id: "revize", name: "Revize", sub: "elektro, plyn, komín", icon: "check", tone: "ok", chip: "1 chybí",
    files: [
      { id: "rev1", name: "Revize elektro.pdf", meta: "9 stran · 6/2022 · další 6/2027", kind: "pdf", source: "Elektro Bítov" },
      { id: "rev2", name: "Kontrola plynu.pdf", meta: "3 strany · 3/2024 · další 3/2027", kind: "pdf", source: "Plyn Znojmo" },
      { id: "rev3", name: "Zpráva o kontrole komína.pdf", meta: "2 strany · 10/2025 · další za 12 dní", kind: "pdf", source: "Kominík Vrba" },
    ],
  },
  {
    id: "kolaudace", name: "Kolaudace", sub: "termín 30. 11.", icon: "calendar", tone: "warn", chip: "čeká",
    files: [{ id: "kol1", name: "Žádost o kolaudační souhlas.pdf", meta: "rozpracováno · chybí 2 doklady", kind: "pdf", source: "Architekt" }],
  },
  {
    id: "zaruky", name: "Záruky a návody", sub: "12 zařízení", icon: "history", tone: "neutral", chip: "v pořádku",
    files: [
      { id: "zar1", name: "Kotel KK 24 – záruční list.pdf", meta: "2 strany · záruka do 4/2029", kind: "pdf", source: "Topení Bítov" },
      { id: "zar2", name: "Kotel KK 24 – návod k obsluze.pdf", meta: "36 stran", kind: "pdf", source: "Výrobce" },
      { id: "zar3", name: "Zásobník 120 l – záruční list.pdf", meta: "1 strana · záruka do 4/2029", kind: "pdf", source: "Topení Bítov" },
      { id: "zar4", name: "Vodoměr – ověřovací list.pdf", meta: "1 strana · 3/2024", kind: "pdf", source: "Vodárny Znojmo" },
      { id: "zar5", name: "Hasicí přístroj – kontrolní štítek.jpg", meta: "fotka · 10/2024", kind: "img", source: "PO servis" },
    ],
  },
];

export const DRAWINGS: Drawing[] = [
  { id: "p1np", name: "Půdorys 1. NP", sub: "9 místností · zařízení na mapě", img: IMG("img/p1np.png"), chip: "z projektu" },
  { id: "p2np", name: "Půdorys 2. NP", sub: "s pohledem na střechu", img: IMG("img/p2np.png"), chip: "z projektu" },
  { id: "a01", name: "Řez A01", sub: "příčný · výšky podlaží", img: IMG("img/rez_a01.png"), chip: "z projektu" },
  { id: "a02", name: "Řez A02", sub: "podélný · schodiště", img: IMG("img/rez_a02.png"), chip: "z projektu" },
  { id: "pohledy", name: "Pohledy", sub: "4 pohledy · fasády", img: IMG("img/pohled_j.png"), chip: "z projektu" },
];

// ---------- Historie (31 změn, nejnovější nahoře) ----------
export const HISTORY: HistoryItem[] = [
  { id: "h31", date: "20. 10. 2026", title: "BIM model · verze 12", detail: "Posun zásuvky v kuchyni o 30 cm", who: "Architekt", icon: "cube", tone: "info" },
  { id: "h30", date: "14. 10. 2026", title: "Test hlásiče kouře", detail: "Chodba · bez závad", who: "Majitel", icon: "smoke", tone: "ok" },
  { id: "h29", date: "30. 9. 2026", title: "Výkres výztuže stropu · v3", detail: "Uloženo k modelu, 2. NP", who: "Statik", icon: "doc", tone: "muted" },
  { id: "h28", date: "2. 9. 2026", title: "Hlídače připojeny", detail: "Teplota, kouř, komín, elektřina, plyn", who: "Elektro Bítov", icon: "shield", tone: "ok" },
  { id: "h27", date: "26. 8. 2026", title: "Fotky před omítkami", detail: "38 stěn · zarovnáno s modelem", who: "Stavbyvedoucí", icon: "image", tone: "muted" },
  { id: "h26", date: "18. 6. 2026", title: "Rozvody elektro 2. NP", detail: "Okruhy F5–F9 · změřeno ±1 cm", who: "Elektro Bítov", icon: "bolt", tone: "warn" },
  { id: "h25", date: "3. 6. 2026", title: "Rozvody vody 2. NP", detail: "Změřeno ±2 cm", who: "Instalatér Dvořák", icon: "drop", tone: "info" },
  { id: "h24", date: "12. 2. 2026", title: "Výměna baterie ve sprše", detail: "Koupelna · bez zásahu do zdi", who: "Instalatér Dvořák", icon: "drop", tone: "info" },
  { id: "h23", date: "15. 1. 2026", title: "Odečet energií za rok 2025", detail: "Elektřina 3 410 kWh · plyn 1 020 m³", who: "Majitel", icon: "bolt", tone: "warn" },
  { id: "h22", date: "27. 11. 2025", title: "Servis kotle", detail: "Výměna těsnění · bez závad", who: "Topení Bítov", icon: "flame", tone: "clay" },
  { id: "h21", date: "21. 10. 2025", title: "Kontrola komína", detail: "Bez závad · vymeteno", who: "Kominík Vrba", icon: "chimney", tone: "warn" },
  { id: "h20", date: "5. 9. 2025", title: "Energetický štítek", detail: "PENB · třída C", who: "Energetický specialista", icon: "doc", tone: "muted" },
  { id: "h19", date: "14. 6. 2025", title: "Nátěr terasy", detail: "Olej · 42 m²", who: "Majitel", icon: "house", tone: "muted" },
  { id: "h18", date: "22. 4. 2025", title: "Servis kotle", detail: "První servis · bez závad", who: "Topení Bítov", icon: "flame", tone: "clay" },
  { id: "h17", date: "10. 3. 2025", title: "Okna · seřízení kování", detail: "9 oken", who: "Okna Znojmo", icon: "house", tone: "muted" },
  { id: "h16", date: "12. 12. 2024", title: "Kontrola komína", detail: "Bez závad", who: "Kominík Vrba", icon: "chimney", tone: "warn" },
  { id: "h15", date: "18. 10. 2024", title: "Hasicí přístroj", detail: "Pravidelná kontrola", who: "PO servis", icon: "ext", tone: "bad" },
  { id: "h14", date: "24. 4. 2024", title: "Instalace kotle KK 24", detail: "Plynový kondenzační · 24 kW", who: "Topení Bítov", icon: "flame", tone: "clay" },
  { id: "h13", date: "18. 3. 2024", title: "Výměna vodoměru", detail: "Hlavní přívod · technická místnost", who: "Vodárny Znojmo", icon: "drop", tone: "info" },
  { id: "h12", date: "11. 3. 2024", title: "Kontrola plynu", detail: "Těsnost · bez závad", who: "Plyn Znojmo", icon: "flame", tone: "warn" },
  { id: "h11", date: "20. 2. 2024", title: "Rozvody topení", detail: "Z kotle k radiátorům · změřeno ±2 cm", who: "Topení Bítov", icon: "thermo", tone: "bad" },
  { id: "h10", date: "29. 1. 2024", title: "Fotky rozvodů před zakrytím", detail: "212 záběrů · procházka domem", who: "Stavbyvedoucí", icon: "image", tone: "muted" },
  { id: "h9", date: "14. 12. 2023", title: "Rozvody elektro 1. NP", detail: "Rozvaděč R1 · okruhy F1–F4, F7", who: "Elektro Bítov", icon: "bolt", tone: "warn" },
  { id: "h8", date: "20. 11. 2023", title: "Rozvody vody 1. NP", detail: "Od vodoměru ke koupelně a kuchyni", who: "Instalatér Dvořák", icon: "drop", tone: "info" },
  { id: "h7", date: "16. 10. 2023", title: "Přípojka plynu", detail: "Z přípojky přímo ke kotli", who: "Plyn Znojmo", icon: "flame", tone: "warn" },
  { id: "h6", date: "4. 9. 2023", title: "Zahájení stavby", detail: "Rekonstrukce chaty", who: "Stavbyvedoucí", icon: "walk", tone: "muted" },
  { id: "h5", date: "21. 8. 2023", title: "Povolení stavby", detail: "Rozhodnutí MěÚ Znojmo · ověřeno", who: "Stavební úřad", icon: "key", tone: "ok" },
  { id: "h4", date: "26. 6. 2023", title: "Požárně bezpečnostní řešení", detail: "PBŘ k projektu", who: "Projektant PBŘ", icon: "flame", tone: "bad" },
  { id: "h3", date: "15. 5. 2023", title: "Projekt pro povolení", detail: "ArchiCAD · verze 1", who: "Architekt", icon: "doc", tone: "muted" },
  { id: "h2", date: "9. 3. 2023", title: "Zaměření stávajícího stavu", detail: "Laserové zaměření · ±1 cm", who: "Geodet", icon: "target", tone: "muted" },
  { id: "h1", date: "14. 2. 2023", title: "Pas domu založen", detail: "Chata Loučky, Bítov", who: "Architekt", icon: "house", tone: "clay" },
];

// ---------- Procházka (ukázka záběrů) ----------
export const WALK: { src: string; title: string; sub: string }[] = [
  { src: IMG("scene/prijezd.jpg"), title: "Příjezd k chatě", sub: "Venku · 9/2026" },
  { src: IMG("scene/chata.jpg"), title: "Chata z jihu", sub: "Venku · 9/2026" },
  { src: IMG("img/hero.jpg"), title: "Terasa", sub: "Venku · 6/2025" },
  { src: IMG("img/feed_dum.jpg"), title: "Kód domu u vchodu", sub: "Vstup · 10/2026" },
  { src: IMG("scene/technicka-mistnost.jpg"), title: "Technická místnost", sub: "1. NP · 10/2026" },
  { src: IMG("img/door_feed.jpg"), title: "Technická místnost od dveří", sub: "1. NP · 10/2026" },
  { src: IMG("scene/kotel.jpg"), title: "Kotel a expanzní nádoba", sub: "1. NP · 4/2024" },
  { src: IMG("scene/hlidac.jpg"), title: "Vodoměr a přívod", sub: "1. NP · 3/2024" },
  { src: IMG("img/feed_wall.jpg"), title: "Zásuvka u kotle", sub: "1. NP · okruh F7" },
  { src: IMG("scene/model.jpg"), title: "Model domu", sub: "BIM · verze 12" },
];

// ---------- Spotřeba ----------
export type Period = "tyden" | "mesic" | "rok";
export const CONSUMPTION: Record<Period, { key: string; name: string; value: string; delta: string; tone: Tone; color: string; bars: number[] }[]> = {
  tyden: [
    { key: "el", name: "Elektřina", value: "71 kWh", delta: "−4 % meziročně", tone: "ok", color: "#E0791A", bars: [9, 11, 10, 12, 8, 10, 11] },
    { key: "voda", name: "Voda", value: "0,9 m³", delta: "+1 % meziročně", tone: "info", color: "#2F7FD8", bars: [12, 14, 13, 11, 15, 12, 13] },
    { key: "plyn", name: "Plyn", value: "23 m³", delta: "+17 % meziročně", tone: "warn", color: "#B58B1F", bars: [3, 3.2, 3.4, 3.1, 3.6, 3.3, 3.4] },
  ],
  mesic: [
    { key: "el", name: "Elektřina", value: "312 kWh", delta: "−6 % meziročně", tone: "ok", color: "#E0791A", bars: [29, 27.1, 30, 28, 26.5, 27.8, 29.2, 26, 25.4, 27, 28.5, 26.2] },
    { key: "voda", name: "Voda", value: "4,1 m³", delta: "+2 % meziročně", tone: "info", color: "#2F7FD8", bars: [25.7, 27.9, 25.7, 26.5, 27.2, 26, 25.4, 27.6, 26.3, 25.9, 27.1, 26.6] },
    { key: "plyn", name: "Plyn", value: "96 m³", delta: "+18 % meziročně", tone: "warn", color: "#B58B1F", bars: [18.2, 19.1, 20, 20.8, 21.9, 22.5, 23.6, 24.4, 25.8, 26.9, 28.1, 29.2] },
  ],
  rok: [
    { key: "el", name: "Elektřina", value: "3 410 kWh", delta: "−3 % meziročně", tone: "ok", color: "#E0791A", bars: [31, 29, 26, 21, 17, 14, 13, 14, 17, 22, 27, 30] },
    { key: "voda", name: "Voda", value: "48 m³", delta: "+2 % meziročně", tone: "info", color: "#2F7FD8", bars: [18, 17, 19, 22, 25, 29, 31, 30, 24, 20, 18, 19] },
    { key: "plyn", name: "Plyn", value: "1 020 m³", delta: "+12 % meziročně", tone: "warn", color: "#B58B1F", bars: [33, 30, 24, 15, 8, 4, 3, 3, 7, 16, 26, 32] },
  ],
};

// ---------- Plán obnovy (Připravujeme) ----------
export const RENEWAL_BASE = [
  { year: 2028, title: "Střecha · kontrola krytiny", sub: "podle stáří a revizí" },
  { year: 2031, title: "Okna · výměna těsnění", sub: "životnost 15 let" },
];

// ---------- Nabídky techniků (Připravujeme) ----------
export const OFFERS = [
  { id: "vk", init: "VK", name: "Váš kominík", sub: "byl tu 10/2025 · zná dům", slot: "čt 8:00", tone: "warn" as Tone, best: true },
  { id: "kv", init: "KV", name: "Kominík z Vranova", sub: "9 km", slot: "pá 10:00", tone: "muted" as Tone },
  { id: "kz", init: "KZ", name: "Kominík ze Znojma", sub: "24 km", slot: "po 9:00", tone: "muted" as Tone },
];

// ---------- Agent projektu (Připravujeme) ----------
export const AGENT_ROLES = [
  { k: "Architekt", c: "#7B61C9", i: "A" },
  { k: "Statik", c: "#3E7CB1", i: "S" },
  { k: "Elektro", c: "#E0791A", i: "E" },
  { k: "Voda a kanalizace", c: "#2F7FD8", i: "V" },
  { k: "Vytápění", c: "#C0392B", i: "V" },
  { k: "Stavbyvedoucí", c: "#5E7B4C", i: "S" },
  { k: "Technik", c: "#6F6A65", i: "T" },
  { k: "Majitel a SVJ", c: "#B5543A", i: "M" },
];
export const AGENT_FEED = [
  { who: "Architekt", c: "#7B61C9", i: "A", ago: "před 2 min", title: "Model v ArchiCADu · verze 12", note: "Posun zásuvky v kuchyni o 30 cm → předáno elektrikáři", chip: "předáno", tone: "bad" as Tone },
  { who: "Statik", c: "#3E7CB1", i: "S", ago: "před 9 min", title: "Výkres výztuže stropu · v3", note: "Uloženo k modelu, 2. NP · nahrazuje v2", chip: "hotovo", tone: "ok" as Tone },
  { who: "Voda a kanalizace", c: "#2F7FD8", i: "V", ago: "před 21 min", title: "Tlaková zkouška vody · protokol", note: "Chybí podpis montéra → připomenuto, termín zítra", chip: "hlídá", tone: "warn" as Tone },
  { who: "Elektro", c: "#E0791A", i: "E", ago: "před 1 h", title: "Revizní zpráva rozvaděče R1", note: "Další revize 2031 vytvořena v termínech", chip: "hotovo", tone: "ok" as Tone },
  { who: "Stavbyvedoucí", c: "#5E7B4C", i: "S", ago: "před 2 h", title: "Fotky před omítkami · 38 stěn", note: "Zarovnáno s modelem · 1 odchylka 8 cm opravena", chip: "hotovo", tone: "ok" as Tone },
  { who: "Vytápění", c: "#C0392B", i: "V", ago: "před 3 h", title: "Servis kotle · 27. 10.", note: "Zapsáno technikem · PDF majiteli · další 11/2027", chip: "hotovo", tone: "ok" as Tone },
];
export const AGENT_DEADLINES = [
  { when: "zítra", title: "Tlaková zkouška vody", who: "Voda a kanalizace", tone: "warn" as Tone, hot: true },
  { when: "za 12 dní", title: "Kontrola komína", who: "povinné · Vytápění", tone: "warn" as Tone },
  { when: "6. 11.", title: "Revize elektro", who: "Elektro", tone: "muted" as Tone },
  { when: "30. 11.", title: "Kolaudace", who: "Stavbyvedoucí", tone: "muted" as Tone },
];

// ---------- Další budovy (jednodušší data) ----------
export const OTHER: Record<string, { devices: Device[]; docs: DocCat[]; history: HistoryItem[]; deadlines: { title: string; sub: string; chip: string; tone: Tone }[]; status: string; hero?: string }> = {
  "u-parku": {
    status: "v pořádku",
    devices: [
      { id: "vytah", name: "Výtah", type: "Osobní · 630 kg", room: "Hlavní schodiště", where: "vchod A", icon: "building", tone: "info", serviceLast: "9/2026", serviceNext: "12/2026" },
      { id: "kotelna", name: "Kotelna", type: "2× kondenzační kotel · 2× 60 kW", room: "Suterén", where: "vstup ze dvora", icon: "flame", tone: "clay", serviceLast: "8/2026", serviceNext: "8/2027" },
      { id: "r-dom", name: "Domovní rozvaděč", type: "Hlavní rozvaděč", room: "Suterén", where: "vedle kotelny", icon: "bolt", tone: "warn", serviceLast: "3/2023", serviceNext: "3/2028" },
      { id: "hydranty", name: "Hydranty", type: "4× nástěnný hydrant", room: "Chodby", where: "každé patro", icon: "drop", tone: "info", serviceLast: "5/2026", serviceNext: "5/2027" },
      { id: "hromosvod", name: "Hromosvod", type: "Jímací soustava", room: "Střecha", where: "", icon: "bolt", tone: "warn", serviceLast: "4/2024", serviceNext: "4/2028" },
    ],
    docs: [
      { id: "pd", name: "Projektová dokumentace", sub: "skenováno z archivu", icon: "doc", tone: "muted", chip: "sken", files: [{ id: "u1", name: "Projekt 1972 – sken.pdf", meta: "84 stran", kind: "pdf", source: "Správce" }] },
      { id: "rev", name: "Revize", sub: "výtah, plyn, elektro, hydranty", icon: "check", tone: "ok", chip: "v pořádku", files: [{ id: "u2", name: "Revize výtahu.pdf", meta: "9/2026", kind: "pdf", source: "Výtahy Brno" }] },
      { id: "svj", name: "Dokumenty SVJ", sub: "stanovy, zápisy ze shromáždění", icon: "doc", tone: "muted", chip: "12", files: [{ id: "u3", name: "Zápis ze shromáždění 2026.pdf", meta: "6 stran", kind: "pdf", source: "Výbor SVJ" }] },
    ],
    history: [
      { id: "u-h3", date: "9. 9. 2026", title: "Odborná prohlídka výtahu", detail: "Bez závad", who: "Výtahy Brno", icon: "building", tone: "info" },
      { id: "u-h2", date: "21. 8. 2026", title: "Servis kotelny", detail: "Oba kotle · bez závad", who: "Topení Brno", icon: "flame", tone: "clay" },
      { id: "u-h1", date: "12. 5. 2026", title: "Kontrola hydrantů", detail: "Tlaková zkouška", who: "PO servis", icon: "drop", tone: "info" },
    ],
    deadlines: [
      { title: "Odborná prohlídka výtahu", sub: "12/2026 · povinná", chip: "za 2 měsíce", tone: "muted" },
      { title: "Hydranty", sub: "5/2027 · povinná", chip: "plán", tone: "muted" },
    ],
  },
  dilna: {
    status: "v pořádku",
    devices: [
      { id: "kompresor", name: "Kompresor", type: "Pístový · 270 l", room: "Dílna", where: "u vrat", icon: "wrench", tone: "muted", serviceLast: "6/2026", serviceNext: "6/2027" },
      { id: "r-dil", name: "Rozvaděč", type: "Průmyslový · 3 × 32 A", room: "Dílna", where: "u vstupu", icon: "bolt", tone: "warn", serviceLast: "2/2025", serviceNext: "2/2028" },
      { id: "vrata", name: "Sekční vrata", type: "Elektrický pohon", room: "Sklad", where: "", icon: "warehouse", tone: "muted", serviceLast: "3/2026", serviceNext: "3/2027" },
    ],
    docs: [
      { id: "rev", name: "Revize", sub: "elektro, tlakové nádoby", icon: "check", tone: "ok", chip: "v pořádku", files: [{ id: "d1", name: "Revize tlakové nádoby.pdf", meta: "6/2026", kind: "pdf", source: "Revize Znojmo" }] },
      { id: "pd", name: "Kolaudace", sub: "kolaudační souhlas 2019", icon: "key", tone: "muted", chip: "ověřeno", files: [{ id: "d2", name: "Kolaudační souhlas.pdf", meta: "2 strany", kind: "pdf", source: "Stavební úřad" }] },
    ],
    history: [
      { id: "d-h2", date: "18. 6. 2026", title: "Revize kompresoru", detail: "Tlaková nádoba · bez závad", who: "Revize Znojmo", icon: "wrench", tone: "muted" },
      { id: "d-h1", date: "3. 3. 2026", title: "Servis vrat", detail: "Seřízení pohonu", who: "Vrata Morava", icon: "warehouse", tone: "muted" },
    ],
    deadlines: [{ title: "Revize kompresoru", sub: "6/2027 · povinná", chip: "plán", tone: "muted" }],
  },
};

// Ukázkový dokument a věta pro zápis (tlačítka „Ukázka“).
export const DEMO_DOC: Record<string, { name: string; meta: string }> = {
  unik: { name: "Protokol o tlakové zkoušce.pdf", meta: "2 strany · přiloženo k zápisu" },
  servis: { name: "Revizní zpráva spalin.pdf", meta: "2 strany · přiloženo k zápisu" },
  obecny: { name: "Faktura.pdf", meta: "1 strana · přiloženo k zápisu" },
};
export const DEMO_SENTENCE: Record<string, string> = {
  unik: "Vyměnil jsem těsnění na koleně za vodoměrem, tlaková zkouška bez úniku.",
  servis: "Vyměnil jsem těsnění hořáku, spalování v normě, CO dvanáct ppm.",
  obecny: "Vyčistil jsem filtr a zkontroloval těsnost, vše v pořádku.",
};
