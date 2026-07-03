/* eslint-disable */
// Datový soubor průvodce. Naplněno z hloubkového researche (viz meta.researchDate a sekce zdrojů).
// verification: 2 = potvrzeno více nezávislými zdroji, 1 = jeden zdroj / méně jisté.
window.GUIDE_DATA = {
  meta: {
    researchDate: "3.–4. 7. 2026",
    center: { lat: 45.1788, lon: 29.1671 },
    heroLead: "",
    heroStats: [],
    heroNote: "",
    mapLead: "",
    fishLead: "",
    seasonLead: "",
    rulesLead: "",
    footerNote: ""
  },

  // typ: jezero | kanal | rameno | laguna | more | zakladna
  spots: [
    {
      id: "penzion",
      name: "Agropensiune Beluga (základna)",
      type: "zakladna",
      lat: 45.1788, lon: 29.1671,
      distanceKm: 0,
      species: [],
      primary: [],
      description: "Výchozí bod — penzion na břehu ramene Sulina ve vsi Gorgova.",
      techniques: "",
      baits: "",
      season: "",
      verification: 2,
      sources: []
    }
  ],

  fish: [
    {
      id: "sumec",
      name: "Sumec velký",
      ro: "somn",
      latin: "Silurus glanis",
      emoji: "🐋",
      intro: "",
      baits: [],
      techniques: [],
      timeOfDay: "",
      season: "",
      spots: "",
      legal: "",
      tip: "",
      verification: 2
    }
  ],

  climate: {
    sub: "",
    source: "",
    // tmax/tmin = průměrné denní max/min vzduch (°C), water = teplota vody (°C), precip = srážky (mm)
    months: [
      { m: "Led", tmax: 3, tmin: -3, water: 2, precip: 30 },
      { m: "Úno", tmax: 5, tmin: -2, water: 3, precip: 28 },
      { m: "Bře", tmax: 10, tmin: 2, water: 7, precip: 27 },
      { m: "Dub", tmax: 16, tmin: 7, water: 12, precip: 33 },
      { m: "Kvě", tmax: 22, tmin: 12, water: 18, precip: 40 },
      { m: "Čvn", tmax: 26, tmin: 16, water: 22, precip: 45 },
      { m: "Čvc", tmax: 28, tmin: 18, water: 24, precip: 40 },
      { m: "Srp", tmax: 28, tmin: 18, water: 24, precip: 35 },
      { m: "Zář", tmax: 24, tmin: 14, water: 20, precip: 35 },
      { m: "Říj", tmax: 17, tmin: 9, water: 14, precip: 30 },
      { m: "Lis", tmax: 10, tmin: 4, water: 9, precip: 35 },
      { m: "Pro", tmax: 5, tmin: -1, water: 4, precip: 35 }
    ]
  },

  // aktivita 0–3 (0 = mimo/zakázáno, 1 = slabé, 2 = dobré, 3 = vrchol)
  seasonMatrix: {
    months: ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"],
    rows: [
      { fish: "Štika", values: [2, 2, 1, 0, 0, 2, 2, 2, 3, 3, 3, 2] }
    ],
    legend: ["mimo / hájení", "slabší", "dobré", "vrchol sezóny"]
  },

  seasonInfo: [],

  rules: [],

  checklists: [],

  pension: [],

  sources: []
};
