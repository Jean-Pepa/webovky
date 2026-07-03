/* eslint-disable */
/*
 * Datový soubor průvodce „Gorgova — rybaření v deltě Dunaje“.
 * Naplněno z hloubkové rešerše (viz sekce sources). Míra ověření:
 *   verification 2 = potvrzeno více nezávislými zdroji (adversariálně ověřeno),
 *   verification 1 = jeden zdroj / propagační web / orientační odhad — brát s rezervou.
 * GPS souřadnice jezer, kanálů a chráněných zón jsou ORIENTAČNÍ (pro mapu), ne
 * navigační — jediný pevně ověřený bod je penzion. Rešerše: červenec 2026.
 */
window.GUIDE_DATA = {
  meta: {
    researchDate: "3.–4. 7. 2026",
    center: { lat: 45.1788, lon: 29.1671 },
    heroLead:
      "Praktický průvodce rybařením kolem Agropenzionu Beluga ve vsi Gorgova — uprostřed Biosférické rezervace Delta Dunaje. Mapa lovišť se souřadnicemi, na co a jak které ryby brát, pravidla a povolenky, měsíční počasí a kompletní příprava na cestu. U každého údaje je vidět, jak dobře je ověřený.",
    heroStats: [
      { label: "Základna", value: "Gorgova", sub: "Strada Dunării 64, ~29 km od Tulcey" },
      { label: "Přístup", value: "jen po vodě", sub: "loď Navrom / rychločlun z Tulcey" },
      { label: "Rybářská povolenka", value: "zdarma", sub: "ARBDD, online permise.ddbra.ro" },
      { label: "Hlavní sezóna", value: "VII–XII", sub: "dravci; sumec v létě v noci" }
    ],
    heroNote:
      "⚠️ Pravidla se v Rumunsku vyhlašují každý rok znovu. Termíny hájení, denní limity a ceny povolení si před cestou vždy ověř na oficiálních stránkách rezervace (ddbra.ro) a ANPA — hodnoty níže platí pro sezónu 2025/2026 a u méně jistých je to označeno.",
    mapLead:
      "Loviště v dosahu penzionu i dál po deltě (do ~200 km). Přepni si vrstvu na „Satelit“ (vpravo nahoře) — na leteckém snímku je dobře vidět, jak jezera a kanály navazují. Červené značky ⛔ jsou přísně chráněné zóny se zákazem vstupu i rybolovu. Filtruj podle ryby. Souřadnice jsou orientační.",
    fishLead:
      "Nástrahy, montáže a načasování pro hlavní druhy delty. Postupy vycházejí z rumunských rybářských webů a reportů; u druhů je uvedená míra ověření (dravci jsou doloženi nejlépe).",
    seasonLead:
      "Delta patří k nejsušším a nejteplejším koutům Rumunska. Grafy ukazují odhad pro Gorgovou (mezi kontinentální Tulceou a přímořskou Sulinou). Rybářsky nejlepší jsou léto (sumec, kapr) a hlavně podzim (štika, candát).",
    rulesLead:
      "Rybářskou povolenku v deltě vydává Správa rezervace (ARBDD) — platí ona, ne běžná celostátní. Potřebuješ dvě různé věci: bezplatnou rybářskou povolenku ARBDD a placené vstupní povolení do rezervace. K tomu platí každoroční hájení, denní limity, minimální míry a přísné zákazy (jeseteři, chráněné zóny).",
    footerNote:
      "Zdroje jsou weby místních průvodců (gorgova.ro, info-delta.ro, dunare.ro, rapitori.ro), oficiální stránky rezervace ARBDD a dopravce Navrom, klimatické databáze a rybářské reporty/fóra. Tvrzení byla křížově ověřována; přesto jde o pomůcku, ne o úřední dokument. Ceny, jízdní řády a limity se mění — před cestou ověř. Rešerše červenec 2026."
  },

  // Popisky druhů pro filtr a tagy
  speciesLabels: {
    stika: "Štika",
    candat: "Candát",
    okoun: "Okoun",
    sumec: "Sumec",
    bolen: "Bolen",
    kapr: "Kapr",
    karas: "Karas",
    cejn: "Cejn",
    lin: "Lín",
    perlin: "Perlín/plotice"
  },

  // typ: zakladna | jezero | kanal | rameno | laguna | chranena | orientace
  spots: [
    {
      id: "penzion",
      name: "Agropensiune Beluga (základna)",
      type: "zakladna",
      lat: 45.1788, lon: 29.1671, distanceKm: 0,
      species: [], primary: [],
      description: "Výchozí bod — penzion na pravém břehu Sulinského ramene ve vsi Gorgova. Vlastní ponton u vody, odkud vyplouvají lodě na okolní jezera a kanály.",
      mapNote: "Strada Dunării 64, Gorgova. Přístup jen po vodě z Tulcey.",
      verification: 2,
      sources: [{ label: "gorgova.ro", url: "https://gorgova.ro/agropensiunea-beluga/" }]
    },

    /* ---- JÁDRO: v dosahu Gorgovy (výjezdy z penzionu) ---- */
    {
      id: "gorgova",
      name: "Jezero Gorgova",
      type: "jezero",
      lat: 45.1506, lon: 29.1832, distanceKm: 4, areaKm2: 13.8,
      species: ["stika", "kapr", "okoun", "sumec", "cejn"],
      primary: ["stika", "kapr"],
      description: "Velké, téměř kruhové jezero (~1 380 ha) hned pod vsí Gorgova a vstupní brána k jezerům Isac a Uzlina. Mělké, zarostlé — typická deltová voda pro štiku a kapra. Nejbližší velká voda od penzionu. Pozor: severně sousedí přísně chráněná zóna Lacul Potcoava (zákaz vstupu).",
      techniques: "Přívlač na okrajích rákosí a v ústí kanálů; položená na kapra a cejn.",
      baits: "Woblery a třpytky mělko nad porostem, gumy; na kapra nadháněné boilie/kukuřice.",
      season: "Léto a podzim; štika nejlépe od července.",
      access: "Z penzionu pár minut lodí přes ves na jih.",
      verification: 2,
      sources: [
        { label: "Wikipedia (rozloha)", url: "https://en.wikipedia.org/wiki/Danube_Delta" },
        { label: "gorgova.ro", url: "https://gorgova.ro/lacul-isac-isaccel/" }
      ]
    },
    {
      id: "isac",
      name: "Jezero Isac (Isacova)",
      type: "jezero",
      lat: 45.1300, lon: 29.2300, distanceKm: 10, areaKm2: 11.0,
      species: ["stika", "kapr", "karas", "cejn", "okoun", "perlin"],
      primary: ["stika"],
      description: "Podle místních průvodců nejlepší štikové jezero v okolí Gorgovy — koná se tu i závod ve štice. Mělké (max ~2,5 m), s bohatým osazením: štika, kapr, karas, cejn, okoun, perlín. Přístup z Gorgovy přes jezero Gorgova a kanál Litcov → kanál Isac.",
      techniques: "Přívlač a nahazování na štiku podél rákosových hran a v kanálových ústích; jemná položená na bílou rybu.",
      baits: "Třpytky, woblery, gumové nástrahy; živá/mrtvá nástraha na velkou štiku.",
      season: "Štika špička na podzim; jaro po hájení také dobré.",
      access: "Odpovídá oficiální turistické trase ARBDD č. 13. Za nízké vody může ARBDD kanály uzavřít — potvrď trasu s penzionem.",
      verification: 2,
      sources: [
        { label: "gorgova.ro", url: "https://gorgova.ro/lacul-isac-isaccel/" },
        { label: "info-delta.ro (druhy)", url: "https://www.info-delta.ro/" }
      ]
    },
    {
      id: "isacel",
      name: "Jezero Isăcel (Isaccel)",
      type: "jezero",
      lat: 45.1150, lon: 29.2500, distanceKm: 12,
      species: ["stika", "kapr", "karas"],
      primary: ["stika"],
      description: "Menší satelitní jezero jihovýchodně od Isacu, severně od kanálu Litcov. Uvádí se spolu s Isacem jako štikový revír; klidnější, méně navštěvované.",
      techniques: "Přívlač na štiku v porostech; položená na karase a kapra.",
      baits: "Woblery, gumy; žížala/těsto na bílou rybu.",
      season: "Podzim; léto.",
      verification: 1,
      sources: [{ label: "gorgova.ro", url: "https://gorgova.ro/lacul-isac-isaccel/" }]
    },
    {
      id: "fortuna",
      name: "Jezero Fortuna (Furtuna)",
      type: "jezero",
      lat: 45.2128, lon: 29.1210, distanceKm: 9, areaKm2: 9.8,
      species: ["stika", "okoun", "kapr", "sumec"],
      primary: ["stika", "okoun"],
      description: "Jedno z největších a nejlepších štikových jezer delty (řadí se k Matiței, Merhei, Uzlině, Isacu). ~900–977 ha, asi 5 km severovýchodně od Maliucu, snadno dostupné ze Sulinského ramene. Štika běžně 1–3 kg, trofej 12–15 kg; loví se z lodi i ze břehu, k tomu kapr a sumec. Pozor: v komplexu Fortuna je přísně chráněné jezero Nebunu (zákaz).",
      techniques: "Přívlač na štiku a okouna, doporučené zóny u ústí kanálů Fortuna/Fortuna 1 (jih/severovýchod/východ); ze břehu položená na kapra a sumce.",
      baits: "Třpytky a woblery na štiku, drobné gumy a drop-shot na okouna; boilie/červi ze břehu.",
      season: "Štika od začátku července do prosince; sumec v teplých měsících v noci.",
      access: "Přes kanál Fortuna nebo Crânjală ze Sulinského ramene u Maliucu. Samotné jezero Fortuna není chráněná zóna.",
      verification: 2,
      sources: [
        { label: "info-delta.ro (lacul Fortuna)", url: "https://www.info-delta.ro/locuri-de-pescuit-in-delta-dunarii-61/pescuit/lacul-fortuna-142.html" },
        { label: "gorgova.ro", url: "https://gorgova.ro/excursii-in-delta-dunarii/" }
      ]
    },
    {
      id: "sontea",
      name: "Kanál Șontea",
      type: "kanal",
      lat: 45.2150, lon: 29.1000, distanceKm: 10,
      species: ["stika", "okoun", "kapr", "karas", "cejn"],
      primary: ["stika", "okoun"],
      description: "Přírodní gârla + kanálový koridor (~43 km) severně od komplexu Fortuna, spojuje kanály od Mila 35 s Dunărea Veche u Mila 23. Oblíbený kanál na štiku a okouna (i na živou nástražní rybku); jsou tu všechny sladkovodní druhy KROMĚ candáta. Dostupný z Gorgovy, Maliucu, Partizani i Mila 23.",
      techniques: "Přívlač podél břehů a v zákrutech; na okouna drop-shot a mikrojig; živá nástraha na štiku.",
      baits: "Woblery, gumy, třpytky na dravce; nástražní rybka (perlín/plotice).",
      season: "Štika ~červenec–prosinec; okoun celoročně.",
      access: "Zkratka Canalul Olguța ústí na Șonteu — dobrá volba na štiku a okouna.",
      verification: 2,
      sources: [
        { label: "balti.ro (canal Șontea)", url: "https://www.balti.ro/delta-dunarii/delta-canalul-sontea.html" },
        { label: "gorgova.ro", url: "https://gorgova.ro/excursii-in-delta-dunarii/" }
      ]
    },
    {
      id: "litcov",
      name: "Kanál Litcov",
      type: "kanal",
      lat: 45.1200, lon: 29.2000, distanceKm: 8,
      species: ["candat", "okoun", "sumec", "cejn"],
      primary: ["candat"],
      description: "Hlubší kanál vedoucí od Sfântugheorghského ramene jižně pod jezery Gorgova–Isac–Uzlina k Crișanu/Caraormanu — hlavní spojnice mezi jezery i sám o sobě loviště. Hlubší proudící voda svědčí candátovi a okounovi.",
      techniques: "Jigování a drop-shot podél hran a v prohlubních; položená na sumce.",
      baits: "Gumové nástrahy (twistery), mrtvá nástraha na candáta a sumce.",
      season: "Candát jaro a podzim, za úsvitu a soumraku.",
      access: "Průplav mezi jezery; splavnost závisí na stavu Dunaje.",
      verification: 1,
      sources: [{ label: "gazetteer delty (poloha)", url: "https://www.info-delta.ro/" }]
    },
    {
      id: "uzlina",
      name: "Jezero Uzlina",
      type: "jezero",
      lat: 45.0880, lon: 29.2400, distanceKm: 12, areaKm2: 5.0,
      species: ["stika", "okoun", "kapr", "candat", "karas"],
      primary: ["stika", "kapr"],
      description: "Jedno z nejlepších míst na štiku v deltě (~500 ha, mělké). Soukromá ohrada Cormoran má nasazeného kapra 8–14 kg a štiku přes 3 kg; koná se tu závod Cupa Uzlina. K tomu candát, karas, plotice, okoun. Přístup kanálem Uzlina ze Sfântugheorghského ramene.",
      techniques: "Přívlač na štiku v porostech; okoun na drobné nástrahy; kapr na boilie/kukuřici (režim chyť a pusť).",
      baits: "Woblery, třpytky, gumy; boilie a kukuřice na kapra.",
      season: "Podzim (štika); léto (kapr).",
      access: "Od obce Uzlina ~1 h člunem 15 HP od Murighiolu; poblíž resort Cormoran.",
      verification: 2,
      sources: [{ label: "info-delta.ro (lacul Uzlina)", url: "https://www.info-delta.ro/locuri-de-pescuit-in-delta-dunarii-61/pescuit/lacul-uzlina-116.html" }]
    },
    {
      id: "dunareaveche",
      name: "Dunărea Veche (u Mila 23)",
      type: "rameno",
      lat: 45.2299, lon: 29.2506, distanceKm: 13,
      species: ["sumec", "candat", "kapr", "stika", "bolen"],
      primary: ["sumec", "candat"],
      description: "Meandrující staré koryto Sulinského ramene, které se klikatí kolem lipovanské rybářské vsi Mila 23. Hluboké tůně (gropi) u soutoků kanálů jsou proslulé velkými sumci a candáty; v proudech u ústí bere bolen.",
      techniques: "Clonkování a položená na sumce v hlubinách meandrů a na soutocích kanálů; jig na candáta v prvních tůních; povrchové nástrahy na bolena v proudu.",
      baits: "Na sumce chuchvalec žížal, mrtvá/živá nástraha; gumy na candáta; třpytky/povrchovky na bolena.",
      season: "Sumec léto (noc); candát jaro/podzim.",
      access: "Po Sulinském rameni k Mila 23 a do starých meandrů (přístup jen po vodě).",
      verification: 2,
      sources: [{ label: "pensiuneagigantfish.ro (Mila 23)", url: "https://pensiuneagigantfish.ro/pescuit-la-mila-23/" }]
    },

    /* ---- DÁL PO DELTĚ ---- */
    {
      id: "matita",
      name: "Jezero Matița",
      type: "jezero",
      lat: 45.2850, lon: 29.3800, distanceKm: 22, areaKm2: 6.5,
      species: ["stika", "okoun", "kapr", "cejn"],
      primary: ["stika"],
      description: "Srdce severního komplexu Matița–Merhei, jedno z nejznámějších štikových jezer delty. Divoká, zarostlá voda; přístup jen po vodě. Samotné jezero je v nárazníkové zóně a LZE ho lovit — přísně chráněná (zákaz) je až sousední Roșca–Buhaiova severně od Merhei.",
      techniques: "Přívlač na štiku podél leknínů a rákosí (režim chyť a pusť).",
      baits: "Woblery, třpytky, gumy; živá nástraha.",
      season: "Podzim.",
      access: "Přes kanály od Mila 23. Drž se povolených tras, mimo Roșca–Buhaiova.",
      verification: 2,
      sources: [{ label: "info-delta.ro (lacul Matița)", url: "https://www.info-delta.ro/locuri-de-pescuit-in-delta-dunarii-61/pescuit/lacul-matita-148.html" }]
    },
    {
      id: "merhei",
      name: "Jezero Merhei",
      type: "jezero",
      lat: 45.3260, lon: 29.4325, distanceKm: 26,
      species: ["cejn", "stika", "kapr"],
      primary: ["cejn", "stika"],
      description: "Severovýchodní konec komplexu Matița–Merhei, severně od lesa Letea. Vyhlášené na cejna a štiku, čistá voda, působivá krajina. Jezero je lovitelné (nárazníková zóna), ale bezprostředně severně leží přísně chráněná Roșca–Buhaiova — tam zákaz.",
      techniques: "Feeder na cejna; přívlač na štiku.",
      baits: "Krmítková směs a žížala na cejna; woblery, gumy na štiku.",
      season: "Podzim; teplá část roku (cejn).",
      access: "Po vodě přes komplex Matița–Merhei. Ověř s průvodcem legální partie.",
      verification: 2,
      sources: [{ label: "info-delta.ro (komplex Matița–Merhei)", url: "https://www.info-delta.ro/locuri-de-pescuit-in-delta-dunarii-61/pescuit/lacul-matita-148.html" }]
    },
    {
      id: "treiiezere",
      name: "Trei Iezere",
      type: "jezero",
      lat: 45.2600, lon: 29.3200, distanceKm: 20,
      species: ["stika", "kapr", "okoun"],
      primary: ["stika"],
      description: "Shluk jezer („Tři jezera“) severně od Dunărea Veche, přístupný kanálem Eracle od Mila 23. Velmi mělká (1–1,5 m); klasické štikové jezero (spolu s Matiței, Fortunou, Bogdaproste). Kolem štika i na Ligheance, Vacaru, Băclănești, Bogdaproste.",
      techniques: "Přívlač na štiku v mělčinách a mezi porosty (chyť a pusť).",
      baits: "Mělko vedené woblery a třpytky.",
      season: "Podzim; jaro.",
      verification: 2,
      sources: [{ label: "info-delta.ro (pescuit la știucă)", url: "https://www.info-delta.ro/pescuit-18/atelier-pescuit-pe-dunare-si-in-delta-dunarii/pescuit-la-stiuca-in-delta-dunarii/" }]
    },
    {
      id: "rosu",
      name: "Jezero Roșu",
      type: "jezero",
      lat: 45.0667, lon: 29.5833, distanceKm: 34,
      species: ["kapr", "sumec", "stika", "candat", "karas"],
      primary: ["stika", "candat"],
      description: "Velké hluboké jezero komplexu Roșu–Puiu–Lumina (~24 000 ha) mezi Sulinským a Sfântugheorghským ramenem, ~10 km od Černého moře. Vysoký rybí potenciál — štika, candát, kapr, sumec, karas. Kanál Puiu–Roșu je hluboký, se silným proudem, dobrý na dravce.",
      techniques: "Přívlač a jig z lodi po otevřené vodě i u porostů; trolling; mrtvá nástraha na candáta.",
      baits: "Woblery, gumy; deadbait na candáta a sumce.",
      season: "Podzim; léto.",
      access: "Od Caraormanu / Crișanu na jihovýchod.",
      verification: 1,
      sources: [{ label: "wpo-deltadunarii.ro (Lumina a Roșu)", url: "https://wpo-deltadunarii.ro/2023/07/08/lacul-lumina-si-lacul-rosu/" }]
    },
    {
      id: "puiu",
      name: "Jezero Puiu",
      type: "jezero",
      lat: 45.0850, lon: 29.5100, distanceKm: 30, areaKm2: 8.7,
      species: ["stika", "candat", "sumec", "kapr", "karas"],
      primary: ["candat", "stika"],
      description: "Velké hluboké jezero (~8,7 km²) západně od Roșu, jižně od Luminy. Silný rybí potenciál; kanál Puiu–Roșu se silným proudem okysličuje vodu a stahuje dravce. Doporučené místo na štiku a candáta.",
      techniques: "Jig a drop-shot na candáta a okouna; přívlač na štiku; položená na sumce.",
      baits: "Gumové nástrahy, mrtvá nástraha; woblery.",
      season: "Podzim.",
      verification: 1,
      sources: [{ label: "infopescar.tv fórum (canal Puiu–Roșu)", url: "https://www.infopescar.tv/forum/delta-dunarii/canalul-puiu-rosu-t6469.html" }]
    },
    {
      id: "lumina",
      name: "Jezero Lumina",
      type: "jezero",
      lat: 45.1050, lon: 29.5100, distanceKm: 29, areaKm2: 13.7,
      species: ["stika", "kapr", "sumec", "cejn", "candat"],
      primary: ["stika"],
      description: "Jedno z největších jezer komplexu (>1 360 ha), severně od Puiu, ~40 km od Suliny. Pestrá skladba — štika, kapr, sumec, cejn. Propojka mezi Luminou a Puiulețem má rákosové břehy, pod nimiž se drží sumec, kapr a karas.",
      techniques: "Trolling a přívlač po otevřené ploše; jig u hran; položená u rákosí.",
      baits: "Woblery, gumy; boilie/kukuřice na kapra.",
      season: "Podzim; léto.",
      verification: 1,
      sources: [{ label: "info-delta.ro (lacul Lumina)", url: "https://www.info-delta.ro/lacul-lumina-loc-de-pescuit-in-delta-dunarii/" }]
    },
    {
      id: "sfgheorghe",
      name: "Rameno Sf. Gheorghe (Murighiol/Mahmudia)",
      type: "rameno",
      lat: 45.0700, lon: 29.1300, distanceKm: 16,
      species: ["candat", "sumec", "kapr", "bolen", "cejn"],
      primary: ["candat", "sumec"],
      description: "Jižní rameno Dunaje (~112 km, 22 % průtoku) s hlubší proudící vodou u Mahmudie a Murighiolu. Klasika na candáta a velkého sumce; v proudech bolen, u dna kapr a cejn.",
      techniques: "Jig na candáta u dna a hran; clonkování/položená na sumce; feeder na kapra a cejn.",
      baits: "Gumy a mrtvá nástraha na candáta/sumce; boilie/červi na dně.",
      season: "Candát jaro/podzim; sumec léto.",
      access: "Silnice vede do Murighiolu i Mahmudie (na rozdíl od Gorgovy) — dostupné i autem.",
      verification: 1,
      sources: [{ label: "adventurefishing.eu", url: "https://adventurefishing.eu/roumania---danube-delta" }]
    },
    {
      id: "razim",
      name: "Laguna Razim (Razim–Sinoe)",
      type: "laguna",
      lat: 44.9000, lon: 28.9500, distanceKm: 40, areaKm2: 415,
      species: ["candat", "okoun", "kapr", "cejn", "karas"],
      primary: ["candat"],
      description: "Největší rumunská laguna (~415 km²) a jádro komplexu Razim–Sinoe jižně od vlastní delty (5 hlavních jezer: Razim, Sinoe, Zmeica, Golovița, Babadag). Přezdívá se mu „patria șalăului“ — kolébka candáta: čistá okysličená voda a písčito-štěrkové dno. V Razimu dominují sladkovodní druhy, v Sinoe druhy snášející proměnlivou salinitu.",
      techniques: "Trolling a jig na candáta na velké vodě; přívlač na okouna u struktur; feeder na kapra a cejn.",
      baits: "Woblery, gumy, mrtvá nástraha; feeder směs na bílou rybu.",
      season: "Jaro a podzim; za větru pozor na velkou vlnu.",
      access: "Od Jurilovcy, Murighiolu (kanál Dunavăț) nebo Dunavățu de Jos. Dostupné i autem od Jurilovcy.",
      verification: 2,
      sources: [{ label: "rapitori.ro (candát Razim–Sinoe)", url: "https://www.rapitori.ro/pescuitul-rapitorilor/pescuitul-salaului-cu-naluci-in-complexul-lagunar-razelm-sinoe/" }]
    },
    {
      id: "chilia",
      name: "Rameno Chilia (Chilia Veche)",
      type: "rameno",
      lat: 45.4200, lon: 29.2850, distanceKm: 32,
      species: ["kapr", "sumec", "candat", "bolen"],
      primary: ["kapr", "sumec"],
      description: "Severní, největší rameno Dunaje (hranice s Ukrajinou). Hluboká, silně proudící voda — proslulá velkými kapry (běžně přes 20 kg) a sumci. Na hraničním rameni je navíc potřeba avízo pohraniční policie.",
      techniques: "Těžká položená na kapra a sumce po předchozím vnadění; clonkování na sumce.",
      baits: "Boilie, kukuřice, mamaliga na kapra; žížaly/nástražní ryba na sumce.",
      season: "Léto a podzim.",
      access: "K Chilia Veche vede i silnice. Pozor na hraniční režim — ohlásit pohraniční policii.",
      verification: 1,
      sources: [{ label: "adventurefishing.eu", url: "https://adventurefishing.eu/roumania---danube-delta" }]
    },

    /* ---- PŘÍSNĚ CHRÁNĚNÉ ZÓNY (zákaz vstupu i rybolovu) ---- */
    {
      id: "z_potcoava", name: "Lacul Potcoava — zákaz", type: "chranena",
      lat: 45.1950, lon: 29.2050, distanceKm: 6, species: [],
      mapNote: "Přísně chráněná zóna NEJBLÍŽ Gorgové — leží mezi jezerem Gorgova a Obretinul Mic (625 ha). Zákaz vstupu i rybolovu. Poloha orientační.",
      verification: 2, sources: [{ label: "info-delta.ro", url: "https://www.info-delta.ro/delta-dunarii-17/lacul-potcoava--116.html" }]
    },
    {
      id: "z_nebunu", name: "Lacul Nebunu — zákaz", type: "chranena",
      lat: 45.1950, lon: 29.0550, distanceKm: 9, species: [],
      mapNote: "Přísně chráněné jezero v komplexu Șontea–Fortuna západně od Gorgovy. Ovlivňuje západní trasy. Poloha orientační.",
      verification: 2, sources: [{ label: "info-delta.ro", url: "https://www.info-delta.ro/delta-dunarii-17/lacul-nebunu--115.html" }]
    },
    {
      id: "z_rosca", name: "Roșca–Buhaiova — zákaz", type: "chranena",
      lat: 45.3750, lon: 29.4200, distanceKm: 28, species: [],
      mapNote: "Přísná rezervace severně od Merhei — největší kolonie pelikánů v Evropě. Zákaz vstupu, rybolovu i táboření. Okolní jezera Matița–Merhei se ale lovit smí. Poloha orientační.",
      verification: 2, sources: [{ label: "dunare.ro (zóny)", url: "https://dunare.ro/zone-strict-protejate-din-delta-dunarii/" }]
    },
    {
      id: "z_erenciuc", name: "Arinișul Erenciuc — zákaz", type: "chranena",
      lat: 45.0050, lon: 29.4450, distanceKm: 24, species: [],
      mapNote: "Jediná olšina v deltě, u ramene Sf. Gheorghe. Zákaz vstupu i rybolovu. Poloha orientační.",
      verification: 2, sources: [{ label: "info-delta.ro", url: "https://www.info-delta.ro/delta-dunarii-17/arinisul-erenciuc--106.html" }]
    },
    {
      id: "z_vatafu", name: "Vătafu–Lungulețu — zákaz", type: "chranena",
      lat: 45.0900, lon: 29.4700, distanceKm: 27, species: [],
      mapNote: "Přísně chráněná zóna mezi Caraormanem a komplexem Roșu–Puiu–Lumina. Poloha orientační.",
      verification: 2, sources: [{ label: "info-delta.ro", url: "https://www.info-delta.ro/delta-dunarii-17/zone-strict-protejate-in-delta-dunarii-105.html" }]
    },
    {
      id: "z_belciug", name: "Lacul Belciug — zákaz", type: "chranena",
      lat: 44.8820, lon: 29.4600, distanceKm: 34, species: [],
      mapNote: "Přísně chráněné jezero v posledním meandru ramene Sf. Gheorghe (ostrov Dranov, hloubka 5–6 m). Poloha orientační.",
      verification: 2, sources: [{ label: "info-delta.ro", url: "https://www.info-delta.ro/delta-dunarii-17/lacul-belciug--114.html" }]
    },
    {
      id: "z_sacalin", name: "Sacalin–Zătoane — zákaz", type: "chranena",
      lat: 44.7800, lon: 29.6000, distanceKm: 46, species: [],
      mapNote: "Přísně chráněná mořská pobřežní zóna u ústí ramene Sf. Gheorghe. Poloha orientační.",
      verification: 2, sources: [{ label: "info-delta.ro", url: "https://www.info-delta.ro/delta-dunarii-17/sacalin-zatoane--110.html" }]
    },
    {
      id: "z_periteasca", name: "Periteașca–Leahova — zákaz", type: "chranena",
      lat: 44.7000, lon: 29.0300, distanceKm: 55, species: [],
      mapNote: "Přísně chráněná pobřežní/lagunová zóna u Gura Portiței (komplex Razim). Poloha orientační.",
      verification: 2, sources: [{ label: "descoperadeltadunarii.ro", url: "https://www.descoperadeltadunarii.ro/zone-strict-protejate-delta-dunarii/" }]
    },

    /* ---- ORIENTAČNÍ BODY (ne loviště) ---- */
    { id: "tulcea", name: "Tulcea (brána do delty)", type: "orientace", lat: 45.1787, lon: 28.8050, distanceKm: 29, species: [], primary: [], mapNote: "Odsud vyplouvají lodě Navrom i rychločluny do Gorgovy. Poslední velké nákupy, bankomaty, benzín.", verification: 2, sources: [] },
    { id: "sulina", name: "Sulina (ústí do moře)", type: "orientace", lat: 45.1559, lon: 29.6536, species: [], primary: [], mapNote: "Nejvýchodnější bod delty, konec Sulinského ramene. Nejsušší místo Rumunska.", verification: 2, sources: [] },
    { id: "sfgh_obec", name: "Sfântu Gheorghe (pobřeží)", type: "orientace", lat: 44.8831, lon: 29.6000, species: [], primary: [], mapNote: "Vesnice u moře na konci jižního ramene; pláže, mořský rybolov.", verification: 2, sources: [] }
  ],

  fish: [
    {
      id: "sumec",
      name: "Sumec velký",
      ro: "somn",
      latin: "Silurus glanis",
      emoji: "🐋",
      intro: "Největší dravec delty a jeden z hlavních důvodů, proč sem rybáři jezdí. Loví v hlubokých tůních (gropi) u soutoků kanálů a v ramenech; zakalená voda mu nevadí. Běžné jsou desítky kilo.",
      baits: ["živá i mrtvá nástražní rybka (deadbait u dna)", "svazek žížal/rousnic", "kusy ryb a filety", "clonek — buldo"],
      techniques: ["Clonkování z lodi: klonek udeří o hladinu a zvuk láká sumce z hloubky (2 velké háky 2–4 m pod hladinou)", "Těžká dnová montáž v gropi na soutocích kanálů", "Těžký spinning s velkými gumami (prut 2,4–2,7 m, 80–120 g)"],
      timeOfDay: "Hlavně v noci (velké kusy po tmě), ale v teplém období bere i přes den.",
      season: "Léto — červenec a srpen nejlepší, voda nad ~15 °C.",
      spots: "Dunărea Veche a hluboké tůně u Mila 23, kanál Șontea, tůně v kanálu Crișan–Caraorman.",
      legal: "Minimální míra 50 cm; drž denní limit. Na řadě jezer režim chyť a pusť.",
      tip: "Sumec jde po zvuku a pachu — clonek a výrazně páchnoucí nástraha ho přivolají i v kalu.",
      verification: 2
    },
    {
      id: "stika",
      name: "Štika obecná",
      ro: "știucă",
      latin: "Esox lucius",
      emoji: "🐊",
      intro: "Vlajkový dravec deltových jezer — legendární stavy. Drží se u submerzní vegetace (brădiș), okrajů rákosí a leknínů. Průměr 1–3 kg, trofej 12–15 kg. Většina vody je v režimu chyť a pusť.",
      baits: ["oscilační i rotační třpytky (linguriță — základ)", "woblery (Rapala X-Rap, Max Rap, Extreme Swimmer)", "jerkbaity", "gumové nástrahy (shady)", "živá nástražní rybka"],
      techniques: ["Přívlač z lodi kolem vegetace a okrajů rákosí", "Vedení nástrahy nad zarostlým dnem (weedless montáž s gumou projde tam, kam třpytka ne)", "Nahazování do ústí kanálů"],
      timeOfDay: "Ráno kolem východu slunce a za soumraku; na podzim i přes den.",
      season: "Špička podzim (říjen–listopad, žír před zimou), trvá do prosince; rozjezd v červenci. Jaro tře, hájení ~1. 2. – 7. 6.",
      spots: "Fortuna, Uzlina, Matița, Merhei, Trei Iezere, Bogdaproste, Isac, Lumina, Gorgova.",
      legal: "Minimální míra 40 cm; možný odlišný termín hájení. Hodně vody C&R.",
      tip: "V zarostlé vodě je nejúčinnější univerzál pořád třpytka; do porostů použij protizáklepovou gumu.",
      verification: 2
    },
    {
      id: "candat",
      name: "Candát obecný",
      ro: "șalău",
      latin: "Sander lucioperca",
      emoji: "🐟",
      intro: "Dravec hlubší, čistší a proudící vody — hlavní kanály, hluboké tůně (8–10 m) a laguna Razim–Sinoe. Loví u dna a na rozhraní čisté a kalné vody (mud lines). V čistě sladkovodních kanálech typu Șontea candát chybí.",
      baits: ["gumové nástrahy — twistery 6–7 cm, shady na jig hlavě", "mrtvá nástražní rybka (deadbait)", "drop-shot"],
      techniques: ["Jigování s hlavou 3,5–18 g dle hloubky; na hlubinách Dunaje těžší jig 20–100 g s tenkou pletenkou", "Lov v hlubokých kanálech, gropi a u písčitého dna"],
      timeOfDay: "Úsvit a soumrak; na podzim v hlubokých tůních.",
      season: "Nejlépe podzim (září–listopad), agresivní žír.",
      spots: "Rameno Sulina u Crișanu, Mila 23, tůně na Dunărea Veche, kanál Litcov, komplex Razim–Sinoe („patria șalăului“).",
      legal: "Minimální míra 40 cm; drž denní limit.",
      tip: "Nechej gumu opravdu klepat o dno a veď ji pomalu, se zastávkami — candát bere u dna.",
      verification: 2
    },
    {
      id: "okoun",
      name: "Okoun říční",
      ro: "biban",
      latin: "Perca fluviatilis",
      emoji: "🐠",
      intro: "Všudypřítomný, vděčný dravec — loví v hejnech u rákosí, leknínů, potopených větví a na prazích u ústí kanálů, kde se shromažďuje drobná rybka. Skvělá zábava na ultralight.",
      baits: ["malé rotačky (Mepps Aglia č. 2, Blue Fox Vibrax č. 2)", "malé jigy/shady 4–7 cm (2–5 g)", "drop-shot", "žížala"],
      techniques: ["Ultralight spinning; drop-shot hlavně ve studené vodě", "Cílení hejn u struktur — způsob vedení je často důležitější než volba nástrahy"],
      timeOfDay: "Aktivní přes den, výrazně ráno.",
      season: "Celoročně; dobře na podzim a v zimě.",
      spots: "Fortuna, kanál Șontea, jezera a soutoky kanálů celé oblasti.",
      legal: "Drž denní limit.",
      tip: "Když najdeš jedno hejno, obvykle jich je víc pohromadě — u aktivních okounů rychlá, dráždivá animace.",
      verification: 2
    },
    {
      id: "bolen",
      name: "Bolen dravý",
      ro: "avat",
      latin: "Leuciscus aspius",
      emoji: "🐡",
      intro: "Dravá bílá ryba proudů — hltá drobné rybky u hladiny v proudnicích a hlavně u ústí kanálů do hlavních ramen, která fungují jako „krmné stanice“. Velmi agresivní, na lehkou přívlač zážitek.",
      baits: ["povrchové nástrahy (popper — smrtící u ústí kanálů)", "úzké kovové třpytky pro dlouhý hod (Berti Taifun, DAM Effzett)", "montáž s několika streamery nad nástrahou", "streamery na muškaření"],
      techniques: ["Házení do proudu u ústí kanálů a soutoků, rychlá retrieva", "Nahazování na lovící bolen v proudu"],
      timeOfDay: "Přes den, loví za světla.",
      season: "Léto — nejaktivnější u ústí kanálů v teplé, okysličené vodě plné plůdku.",
      spots: "Ústí kanálů a bifurkace ramen (Dunărea Veche, Sf. Gheorghe, Chilia).",
      legal: "Drž denní limit.",
      tip: "Když vidíš na hladině „výbuchy“ — hází se na lovící rybu; dlouhý přesný hod a rychlá animace.",
      verification: 2
    },
    {
      id: "kapr",
      name: "Kapr obecný (i divoký)",
      ro: "crap",
      latin: "Cyprinus carpio",
      emoji: "🎣",
      intro: "Delta hostí i původního divokého dunajského kapra (sazana) — silného bojovníka, který se drží u překážek a rákosí v pomalé až střední vodě. Běžně 3–6 kg, na dobrých úsecích i přes 20 kg (rekord delty ~34 kg). Klíč k úspěchu je vnadění.",
      baits: ["kukuřice (porumb) — základ", "mamaliga (kukuřičné těsto)", "boilie (nejlépe rybí/korýšové)", "pšenice, pelety, partikl"],
      techniques: ["Intenzivní vnadění (nădire) 1–2 dny předem, běžně 10+ kg kukuřice", "Vlasová montáž (2 zrna kukuřice) na dně / feeder", "Na boilie delší session 24 h+"],
      timeOfDay: "Ráno, večer a v noci; přes den ve stínu a hloubce.",
      season: "Polovina června až říjen/listopad; září je považováno za velmi vhodné.",
      spots: "Ramena (Chilia, Sf. Gheorghe), jezera Uzlina (Cormoran), Lumina, Puiu, Roșu, kanály Tătaru a Dunavăț.",
      legal: "Minimální míra 40 cm; na řadě vod režim chyť a pusť — velké kusy pouštěj.",
      tip: "Bez vnadění to bývá o štěstí — zavnaď místo den dva dopředu stejnou nástrahou, na kterou pak chytáš.",
      verification: 2
    },
    {
      id: "karas",
      name: "Karas stříbřitý",
      ro: "caras",
      latin: "Carassius gibelio",
      emoji: "🐟",
      intro: "Odolná, hojná ryba mělkých zarostlých jezer, tůní a klidných kanálů s vegetací. Vděčná pro klidný lov na plavanou i pro děti, dobrá do rybí polévky (ciorbă).",
      baits: ["žížala", "mamaliga (měkké, pružné kukuřičné těsto)", "chléb/těsto", "vařené cereálie"],
      techniques: ["Jemná plavaná (pluta) u rákosí", "Lehká položená / feeder"],
      timeOfDay: "Přes den, nejlépe ráno a večer.",
      season: "Teplá část roku.",
      spots: "Isac, Gorgova, Uzlina a mělká jezera; spadlé stromy a rákosí.",
      legal: "Minimální míra ~15 cm; jinak jen denní limit.",
      tip: "Bere jemně — citlivý splávek a menší háček; mamaliga musí být měkká (test: odskočí od lžíce).",
      verification: 2
    },
    {
      id: "cejn",
      name: "Cejn velký",
      ro: "plătică",
      latin: "Abramis brama",
      emoji: "🐟",
      intro: "Hejnová ryba dna v ramenech, kanálech i jezerech. Když se trefíš do hejna, je akce nonstop — ideální na feeder. Vyhlášené je na cejna jezero Merhei.",
      baits: ["svazek žížal / patentka", "kousek plotice", "kukuřice", "krmná směs (nada)"],
      techniques: ["Feeder — košík ~60 g, tenký háček č. 14 s velkým rozevřením (cejn má tenké, trhavé pysky)", "Dnový lov s pravidelným krmením; funguje i noční feeder"],
      timeOfDay: "Ráno a večer; produktivní i v noci.",
      season: "Teplá část roku.",
      spots: "Kanály Tătaru, Sulina a Dunavăț, jezero Merhei, ramena.",
      legal: "Minimální míra ~25 cm; drž denní limit.",
      tip: "Zakrmuj vytrvale a jemně — hejno cejnů si u krmítka drží.",
      verification: 2
    },
    {
      id: "lin",
      name: "Lín obecný",
      ro: "lin",
      latin: "Tinca tinca",
      emoji: "🐟",
      intro: "Ryba teplých, zarostlých mělčin s bahnitým dnem — v deltě velmi hojná. Opatrný, krásně zbarvený; bere u dna blízko rákosí a leknínů.",
      baits: ["žížala", "kukuřice", "těsto"],
      techniques: ["Jemná plavaná u porostů, nechat nástrahu pomalu klesat", "Lehká položená u dna"],
      timeOfDay: "Nejaktivnější přes den, v teplém období i v noci.",
      season: "Jaro (žír, tření V–VII při 18–20 °C) a pozdní podzim.",
      spots: "Klidné jezerní a kanálové zátoky se stojatou vodou a hustou vegetací.",
      legal: "Drž denní limit.",
      tip: "Hledej bublinky u rákosí — prozrazují sbírajícího lína; nahoď těsně k nim.",
      verification: 1
    },
    {
      id: "perlin",
      name: "Perlín / plotice",
      ro: "roșioară / babușcă",
      latin: "Scardinius / Rutilus",
      emoji: "🐟",
      intro: "Drobná bílá ryba, které je v deltě všude spousta — u shluků rákosí a vedle leknínů. Vděčná na jemnou plavanou (i pro děti) a zároveň ideální nástražní rybka na štiku, candáta a sumce.",
      baits: ["vařené i syrové cereálie", "těsto/chléb", "kousky žížaly, larvy"],
      techniques: ["Velmi jemná plavaná (vlasec 0,10–0,15 mm, háček č. 12–20)", "Lov mezi vodou a při hladině u vegetace"],
      timeOfDay: "Nejlépe za slunečna bez větru a vln.",
      season: "Teplá část roku.",
      spots: "Všechna jezera a kanály, u rákosí a leknínů.",
      legal: "Nástražní ryby využívej dle pravidel.",
      tip: "Pár nachytaných perlínů je nejlepší živá/mrtvá nástraha na místní dravce.",
      verification: 2
    }
  ],

  climate: {
    sub: "Odhad pro Gorgovou (mezi Tulceou a Sulinou). Vzduch = průměrné denní max/min; voda = orientační teplota deltové vody.",
    precipSub: "Průměrný měsíční úhrn (mm). Delta je nejsušší kout Rumunska — déšť rybolov prakticky neomezuje.",
    source: "climatestotravel.com (Sulina), weather-atlas / weather-and-climate.com (Tulcea/Gorgova).",
    monthNames: ["Leden", "Únor", "Březen", "Duben", "Květen", "Červen", "Červenec", "Srpen", "Září", "Říjen", "Listopad", "Prosinec"],
    // tmax/tmin = průměrné denní max/min vzduch (°C), water = orientační teplota vody (°C), precip = srážky (mm)
    months: [
      { m: "Led", tmax: 4, tmin: -2, water: 2, precip: 38 },
      { m: "Úno", tmax: 5, tmin: -1, water: 3, precip: 34 },
      { m: "Bře", tmax: 10, tmin: 2, water: 7, precip: 34 },
      { m: "Dub", tmax: 16, tmin: 7, water: 12, precip: 40 },
      { m: "Kvě", tmax: 22, tmin: 13, water: 18, precip: 48 },
      { m: "Čvn", tmax: 26, tmin: 17, water: 22, precip: 54 },
      { m: "Čvc", tmax: 29, tmin: 19, water: 24, precip: 48 },
      { m: "Srp", tmax: 29, tmin: 19, water: 24, precip: 38 },
      { m: "Zář", tmax: 24, tmin: 15, water: 20, precip: 44 },
      { m: "Říj", tmax: 18, tmin: 10, water: 14, precip: 38 },
      { m: "Lis", tmax: 11, tmin: 5, water: 9, precip: 42 },
      { m: "Pro", tmax: 6, tmin: 0, water: 4, precip: 42 }
    ]
  },

  // aktivita 0–3 (0 = mimo/hájení, 1 = slabší, 2 = dobré, 3 = vrchol)
  seasonMatrix: {
    months: ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"],
    note: "Pozn.: obecné hájení ~9. 4. – 7. 6. (nulové sloupce kolem května). Termíny se každý rok mění — ověř.",
    rows: [
      { fish: "Sumec", values: [0, 0, 1, 1, 0, 2, 3, 3, 2, 1, 0, 0] },
      { fish: "Štika", values: [2, 2, 1, 0, 0, 1, 2, 2, 3, 3, 3, 2] },
      { fish: "Candát", values: [1, 1, 2, 1, 0, 2, 2, 2, 3, 3, 2, 1] },
      { fish: "Okoun", values: [1, 1, 2, 1, 0, 2, 2, 2, 3, 3, 2, 1] },
      { fish: "Bolen", values: [0, 0, 1, 1, 0, 2, 3, 3, 2, 1, 0, 0] },
      { fish: "Kapr", values: [0, 0, 1, 1, 0, 2, 3, 3, 2, 2, 1, 0] }
    ],
    legend: ["mimo / hájení", "slabší", "dobré", "vrchol sezóny"]
  },

  seasonInfo: [
    {
      icon: "🎣",
      title: "Nejlepší měsíce na ryby",
      list: [
        "Podzim (září–listopad) — celkově nejlepší, hlavně na štiku, candáta a okouna.",
        "Léto (červenec–srpen) — sumec a kapr; sumec loví hlavně v noci, voda přes 15 °C.",
        "Jaro po hájení (druhá půlka června) — probouzející se dravci, méně lidí, méně komárů.",
        "Zima — štika bere i za chladu, ale doprava a počasí komplikují pobyt."
      ]
    },
    {
      icon: "🦟",
      title: "Komáři — kdy jsou nejhorší",
      paras: [
        "Nejhorší jsou červenec a srpen — doslova spousta komárů, nejaktivnější za soumraku (~20–21 h) a ráno (5–8 h). Obvykle obtěžují 2–3 hodiny denně, hlavně u břehu a ve vegetaci.",
        "Květen–červen a podzim (září–listopad) mají komárů výrazně méně, na podzim skoro mizí. Stálý vánek podél ramen je srazí — na otevřené vodě je klid. Repelent ber vždy."
      ]
    },
    {
      icon: "🌡️",
      title: "Teplo, voda a vítr",
      paras: [
        "Léto je horké (denní maxima kolem 29–33 °C), zima mírná, ale větrná. Voda se ohřívá z ~2–4 °C v zimě na ~24 °C v srpnu; mělká jezera ještě rychleji.",
        "Otevřená velká jezera (Roșu, Lumina, Razim) umí za větru pořádně zvlnit — sleduj předpověď a měj plán na závětří."
      ]
    },
    {
      icon: "🌅",
      title: "Světlo a rytmus dne",
      paras: [
        "V létě svítá kolem 5:30 a stmívá se po 21. hodině — dlouhý den umožní brzké ranní i pozdní večerní výjezdy, kdy dravci nejvíc berou.",
        "Naplánuj lov na úsvit a soumrak; přes poledne v horku ryby zpomalí a je čas na jídlo a odpočinek."
      ]
    }
  ],

  rules: [
    {
      icon: "🎟️",
      title: "Rybářská povolenka ARBDD (zdarma)",
      intro: "Rekreační/sportovní rybolov v přírodních vodách rezervace je povolen VÝHRADNĚ na povolenku vydanou Správou rezervace (ARBDD). V deltě platí ta, ne běžná celostátní povolenka — samotná pravidla (limity, míry) se ale řídí předpisem ANPA.",
      items: [
        "Povolenka je zdarma (bez tax a poplatků, dle zákona 1/2017).",
        "Vyřídíš ji online přes aplikaci odkazovanou z ddbra.ro (permise.ddbra.ro) — přijde PDF e-mailem — nebo z nonstop automatů (sídlo ARBDD Tulcea, Str. Portului 34A; dále Murighiol, Corbu, Vadu a návštěvnická centra Sulina, Crișan, Chilia Veche).",
        "Novinka 2026: povinná „fișa de captură“ — hlášení úlovků (bez poplatku).",
        "Měj povolenku (vytištěnou i v telefonu) u sebe pro kontrolu."
      ],
      src: "ddbra.ro/eliberare-permise-online; info-delta.ro; dunare.ro (2024–2026)",
      important: false
    },
    {
      icon: "🎫",
      title: "Vstupní povolení do rezervace (placené, zvlášť)",
      intro: "Kromě bezplatné rybářské povolenky potřebuješ SAMOSTATNÉ vstupní povolení do rezervace (permis de acces).",
      table: {
        head: ["Vstupní permis", "Cena (orientačně)"],
        rows: [
          ["1 den / osoba", "5 RON"],
          ["1 týden / osoba", "15 RON"],
          ["1 rok / osoba", "30 RON"]
        ]
      },
      items: [
        "Lze platit SMS na číslo 7494: „TUR1 jméno“ (1 den), „TUR7 jméno“ (7 dní), „TURAN jméno“ (1 rok); cena SMS navíc dle operátora.",
        "Po zaplacení přijde potvrzovací SMS s kódem — je POVINNÉ ji uchovat v telefonu a předložit při kontrole.",
        "Pozor: SMS kanál 7494 řeší VSTUPNÍ povolení, ne rybářskou povolenku (tu vyřiď online/automatem).",
        "Pro rok 2026 některé zdroje naznačují možnou bezplatnost turistického vstupu — ověř aktuální tarif."
      ],
      src: "ddbra.ro (tisková zpráva SMS); info-delta.ro; Ordin 610/2009",
      important: false
    },
    {
      icon: "📏",
      title: "Denní limity, míry a náčiní",
      intro: "Pravidla rekreačního rybolovu (ANPA, platná 2025/2026). Dřívější blogové údaje o „chyť a pusť kromě 1 ks do 3 kg“ byly nesprávné — správné hodnoty jsou tyto:",
      table: {
        head: ["Ryba", "Minimální míra"],
        rows: [
          ["Štika (știucă)", "40 cm"],
          ["Candát (șalău)", "40 cm"],
          ["Kapr (crap)", "40 cm"],
          ["Sumec (somn)", "50 cm"],
          ["Cejn (plătică)", "25 cm"],
          ["Karas (caras)", "~15 cm"]
        ]
      },
      items: [
        "Denní limit: 5 kg ryb / den, NEBO jeden jediný kus, pokud sám váží přes 5 kg.",
        "Náčiní: max. 4 pruty (udice), každý se 2 háčky (celkem max 8 háčků).",
        "V rezervaci navíc smíš odvézt max. 10 kg na rybáře / 15 kg na rodinu — bez ohledu na délku pobytu.",
        "Podměrečné ryby ihned a šetrně pusť zpět živé. Na řadě jezer je navíc dobrovolný/povinný režim chyť a pusť.",
        "Míry dle Ordin 342/2008 ve znění Ordin 304/2023 — před cestou ověř aktuální předpis."
      ],
      src: "ANPA (Ordin 304/2023); info-delta.ro; edelta.ro",
      important: false
    },
    {
      icon: "🚫",
      title: "Hájení (prohibiție) — každoroční zákaz",
      intro: "V deltě platí každoroční ~60denní obecný zákaz rybolovu ve všech přírodních vodách (včetně komplexu Razim–Sinoe).",
      items: [
        "Sezóna 2025/2026: obecně 9. dubna – 7. června včetně (Ordin 23/297/2025).",
        "Hraniční vody 45 dní (24. 4. – 7. 6.); ukrajinská hranice včetně zálivu Musura 16. 4. – 30. 5.",
        "Některé druhy (štika, candát/okoun, placka pontická) mají vlastní odchylné termíny.",
        "Termíny se vyhlašují každý rok znovu — před dubnovou/červnovou cestou zkontroluj aktuální ordin na anpa.ro."
      ],
      src: "Ordinul 23/297/2025 (Monitorul Oficial 95/2025); anpa.ro",
      important: true
    },
    {
      icon: "🛑",
      title: "Jeseteři a přísně chráněné zóny",
      intro: "Některé věci jsou zakázané tvrdě a bez výjimky.",
      items: [
        "Lov jeseterů (morun, nisetru, cegă, păstrugă, viză) je v Rumunsku i na Dunaji ZCELA ZAKÁZÁN — od roku 2006, v roce 2021 prodlouženo na dobu neurčitou. Platí i v 2026. Případně chyceného jesetera okamžitě a šetrně pusť.",
        "Přísně chráněné zóny mají zákaz vstupu i rybolovu. Nejblíž Gorgové je Lacul Potcoava (mezi jezerem Gorgova a Obretinem), dále Nebunu (komplex Șontea–Fortuna) a Roșca–Buhaiova (severně od Merhei).",
        "Naopak samotná jezera Matița a Merhei jsou v nárazníkové zóně a lovit se SMÍ — zakázané je jen jádro Roșca–Buhaiova.",
        "Organizované lodě musí držet schválené turistické trasy ARBDD; za nízké vody bývají některé kanály uzavřeny. Přesnou trasu si potvrď s penzionem/průvodcem."
      ],
      src: "ARBDD; info-delta.ro (zone strict protejate); moratorium na jesetery (2021)",
      important: true
    }
  ],

  checklists: [
    {
      id: "doklady",
      icon: "📄",
      title: "Doklady a povolení",
      items: [
        { text: "Občanský průkaz / cestovní pas" },
        { text: "Rybářská povolenka ARBDD (vyřídit online předem)", note: "permise.ddbra.ro — zdarma, PDF do e-mailu" },
        { text: "Vstupní permis do rezervace (nebo připravená SMS na 7494)" },
        { text: "Cestovní pojištění (i na loď/vodu)" },
        { text: "Rezervace penzionu a spojení Navrom / kontakt na převozníka" },
        { text: "Hotovost v lei (RON)", note: "v Gorgově se kartou nespolehni" },
        { text: "Kopie povolení v telefonu i vytištěná" }
      ]
    },
    {
      id: "privlac",
      icon: "🎣",
      title: "Přívlač (štika, candát, okoun, bolen)",
      items: [
        { text: "Prut 2,4–2,7 m, střední/těžká akce (na štiku 20–60 g)" },
        { text: "Naviják 3000–4000 s kvalitní brzdou" },
        { text: "Splétaná šňůra 0,12–0,17 mm + fluorocarbon návazec" },
        { text: "Ocelové/titanové lanko na štiku (zabrání prokousnutí)" },
        { text: "Woblery, třpytky (linguriță), spinnerbaity, sada gum + jigové hlavy 3,5–18 g" },
        { text: "Drop-shot a mikrojig na okouna; popper/kovová třpytka na bolena" },
        { text: "Kleště na háčky, uvolňovač, měřítko, čelovka" }
      ]
    },
    {
      id: "kapr",
      icon: "🐟",
      title: "Kapr a bílá ryba (feeder/položená)",
      items: [
        { text: "Feeder/těžší prut + naviják 4000–5000" },
        { text: "Krmítka (~60 g), montáže (vlasová), háčky vel. 4–14" },
        { text: "Kukuřice, mamaliga, boilie, žížaly/patentky, krmná směs", note: "vnaď místo 1–2 dny předem" },
        { text: "Podběrák s velkou hlavou, podložka pod rybu" },
        { text: "Vidličky/stojan, signalizace záběru" },
        { text: "Kbelík, vážicí sak, dezinfekce na háčkové rány" }
      ]
    },
    {
      id: "sumec",
      icon: "🐋",
      title: "Sumec (položená / clonek)",
      items: [
        { text: "Silný sumcový prut (do 200+ g) + robustní naviják" },
        { text: "Splétaná šňůra 0,40–0,60 mm, silné návazce a háčky" },
        { text: "Clonek (buldo) na přivolání sumce" },
        { text: "Nástražní ryby / velké žížaly / páchnoucí nástraha" },
        { text: "Bójka, těžká olova, kluzná montáž" },
        { text: "Silné rukavice, kleště, čelovka (lov v noci)" }
      ]
    },
    {
      id: "oblec",
      icon: "🧢",
      title: "Oblečení a ochrana",
      items: [
        { text: "Repelent proti komárům (silný, na kůži i oděv)", note: "nejhorší VII–VIII, ráno a večer u vody" },
        { text: "Dlouhé lehké kalhoty a tričko s dlouhým rukávem" },
        { text: "Klobouk/kšiltovka, polarizační brýle", note: "brýle chrání oči a odhalí ryby pod hladinou" },
        { text: "Opalovací krém (vysoký faktor) — na vodě pálí víc" },
        { text: "Nepromokavá bunda/pláštěnka, vrstvy na chladné ráno" },
        { text: "Voděodolná obuv / holínky, náhradní ponožky" },
        { text: "Moskytiéra na spaní (dle penzionu)" }
      ]
    },
    {
      id: "ostatni",
      icon: "🔋",
      title: "Elektřina, voda, ostatní",
      items: [
        { text: "Powerbanka a nabíječky", note: "mobilní signál je slabý/kolísavý, počítej s omezeným dobíjením" },
        { text: "Balená pitná voda / lahev s filtrem", note: "voda z kohoutku/Dunaje NENÍ pitná" },
        { text: "Lékárnička, osobní léky, tablety proti nevolnosti na loď" },
        { text: "Chladicí box na úlovek a jídlo" },
        { text: "Voděodolný obal na telefon a doklady" },
        { text: "Čelovka + náhradní baterie, nůž, provázek" },
        { text: "Odpadkové pytle — vše si odvez s sebou" }
      ]
    }
  ],

  pension: [
    {
      icon: "🏡",
      title: "Agropensiune Beluga",
      paras: [
        "Malý penzion (6 pokojů) na pravém břehu Sulinského ramene ve vsi Gorgova, s vlastním pontonem u vody. Pokoje mají vlastní koupelnu, klimatizaci, TV a WiFi; k dispozici terasa a gril. Hodnocení hostů kolem 9,9.",
        "Penzion se prezentuje hlavně jako klidný „culinary retreat“ (kuchyně z vlastních/farmářských surovin) a zároveň pořádá lodní výlety — pozorování ptáků i sportovní rybolov."
      ],
      kv: [
        ["Adresa", "Strada Dunării 64, Gorgova (obec Maliuc, župa Tulcea)"],
        ["Telefon", "+40 744 577 963"],
        ["E-mail", "info@agropensiunebeluga.com (ověř)"],
        ["Web / rezervace", "belugagorgova.com, gorgova.ro, Booking.com"],
        ["Poloha", "pravý břeh Sulinského ramene, ~29 km od Tulcey"],
        ["Přístup", "jen po vodě (Gorgova nemá silniční spojení)"]
      ]
    },
    {
      icon: "💳",
      title: "Rezervace a ceny",
      list: [
        "Rezervace telefonicky, přes web nebo Booking.com; typicky záloha 30 % převodem, doplatek při příjezdu.",
        "Storno zpravidla zdarma do 7 dnů před příjezdem (blíž se účtuje záloha) — ověř aktuální podmínky.",
        "Ceny pokojů se uvádějí s polopenzí (snídaně + večeře) a mění se dle termínu (na Booking až po zadání dat).",
        "Doložená položka: přistýlka pro osobu 15+ ≈ 250 lei/os./noc.",
        "Ceny lodních výletů a rybářských túr penzion veřejně neuvádí — domluv individuálně.",
        "Platba: Mastercard/Visa/hotovost/převod; v samotné Gorgově měj hotovost v lei."
      ]
    },
    {
      icon: "⛴️",
      title: "Doprava: Navrom z Tulcey",
      steps: [
        { strong: "Do Tulcey:", text: "autem nebo letecky do Rumunska a pak do přístavu Tulcea — brána do delty (poslední bankomaty, nákupy, benzín; auto lze nechat na parkovišti v Tulcei)." },
        { strong: "Linka:", text: "Gorgovu obsluhuje KLASICKÁ linka Tulcea–Sulina, zastávky Tulcea–Partizani–Maliuc–Gorgova–Crișan–Sulina. Jezdí denně (hlavní sezóna ~1. 5. – 30. 9.)." },
        { strong: "Časy:", text: "klasická (pomalejší, levnější) loď z Tulcey ~13:30; v létě navíc rychlejší katamarán ~10:00. Zpět ze Suliny klasická ~07:00, rychlá ~13:30. Časy ověř na navromdelta.ro." },
        { strong: "Cena a čas:", text: "celá trasa Tulcea–Sulina turista ~60 lei (klasik) / 70 lei (rychlá); do Gorgovy (mezizastávka) méně — přesnou částku a jízdní dobu (~2–2,5 h, odhad) ověř u dopravce (+40 240 519 008)." },
        { strong: "Alternativa:", text: "soukromý rychločlun/transfer — často nejjednodušší nechat zařídit přímo penzionem." }
      ]
    }
  ],

  sources: [
    {
      title: "Loviště a druhy",
      links: [
        { url: "https://www.info-delta.ro/pescuit-18/atelier-pescuit-pe-dunare-si-in-delta-dunarii/pescuit-la-stiuca-in-delta-dunarii/", label: "info-delta.ro — štika v deltě" },
        { url: "https://www.rapitori.ro/pescuitul-rapitorilor/pescuitul-salaului-cu-naluci-in-complexul-lagunar-razelm-sinoe/", label: "rapitori.ro — candát Razim–Sinoe" },
        { url: "https://www.info-delta.ro/locuri-de-pescuit-in-delta-dunarii-61/pescuit/lacul-fortuna-142.html", label: "info-delta.ro — jezero Fortuna" },
        { url: "https://pensiuneagigantfish.ro/pescuit-la-mila-23/", label: "gigantfish.ro — Mila 23 (sumec, candát)" },
        { url: "https://gorgova.ro/lacul-isac-isaccel/", label: "gorgova.ro — Isac a Isăcel" }
      ]
    },
    {
      title: "Pravidla a povolenky",
      links: [
        { url: "https://ddbra.ro/eliberare-permise-online/", label: "ARBDD — online povolenky", note: "oficiální" },
        { url: "https://ddbra.ro/plata-prin-sms-o-noua-modalitate-de-obtinere-a-permiselor-de-acces-in-rezervatia-biosferei-delta-dunarii/", label: "ARBDD — platba vstupu přes SMS" },
        { url: "https://www.info-delta.ro/ordinul-304-din-18-iulie-2023-dimensiuni-minime-pesti-retinuti/", label: "info-delta.ro — minimální míry (Ordin 304/2023)" },
        { url: "https://dunare.ro/zone-strict-protejate-din-delta-dunarii/", label: "dunare.ro — přísně chráněné zóny" }
      ]
    },
    {
      title: "Penzion a doprava",
      links: [
        { url: "https://gorgova.ro/agropensiunea-beluga/", label: "gorgova.ro — Agropensiune Beluga" },
        { url: "https://www.booking.com/hotel/ro/agropensiunea-beluga.html", label: "Booking.com — Beluga Gorgova" },
        { url: "https://www.navromdelta.ro/en/schedule-prices/", label: "Navrom Delta — jízdní řády a ceny" },
        { url: "https://infotulcea.ro/programul-si-preturile-curselor-regulate-ale-navrom-delta-in-sezonul-de-vara/", label: "infotulcea.ro — program a ceny Navrom" }
      ]
    },
    {
      title: "Počasí, komáři, praktikálie",
      links: [
        { url: "https://www.climatestotravel.com/climate/romania/sulina", label: "Climates to Travel — Sulina" },
        { url: "https://www.weather-atlas.com/en/romania/tulcea-climate", label: "Weather Atlas — Tulcea" },
        { url: "https://www.info-delta.ro/cand-sunt-tantarii-mai-putini-mai-multi-in-delta-dunarii/", label: "info-delta.ro — komáři podle měsíců" },
        { url: "https://www.edelta.ro/en/sulina-en", label: "eDelta.ro — hladiny a teplota vody Sulina" }
      ]
    }
  ]
};
