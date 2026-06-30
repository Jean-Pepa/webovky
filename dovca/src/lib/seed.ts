import type { DB, AvailStatus } from "./types";

// Výchozí (demo) data — ať appka po prvním spuštění není prázdná a je hned
// vidět, jak funguje heatmapa i hledání oken. Klidně smaž a založ si vlastní.

function paint(dates: [string, string], status: AvailStatus): Record<string, AvailStatus> {
  const out: Record<string, AvailStatus> = {};
  const cur = new Date(`${dates[0]}T00:00:00`);
  const end = new Date(`${dates[1]}T00:00:00`);
  let guard = 0;
  while (cur <= end && guard < 400) {
    const iso = `${cur.getFullYear()}-${String(cur.getMonth() + 1).padStart(2, "0")}-${String(cur.getDate()).padStart(2, "0")}`;
    out[iso] = status;
    cur.setDate(cur.getDate() + 1);
    guard++;
  }
  return out;
}

export function seedDB(): DB {
  return {
    trips: [
      {
        id: "demo",
        name: "Léto 2026 (ukázka)",
        horizonStart: "2026-07-01",
        horizonEnd: "2026-08-31",
        lengthDays: 7,
        minPeople: 4,
        createdBy: "Kuba",
        createdAt: "2026-06-20T10:00:00.000Z",
        members: ["Kuba", "Tomáš", "Vojta", "Marek", "Péťa"],
        availability: {
          Kuba: {},
          Tomáš: { ...paint(["2026-07-01", "2026-07-12"], "out"), ...paint(["2026-08-01", "2026-08-09"], "maybe") },
          Vojta: paint(["2026-08-10", "2026-08-31"], "out"),
          Marek: paint(["2026-07-20", "2026-07-26"], "out"),
          Péťa: paint(["2026-07-27", "2026-08-02"], "maybe"),
        },
        proposals: [],
        expenses: [
          { id: "x1", amount: 1450, category: "benzin", paidBy: "Kuba", car: "Kubova Octavia", note: "plná nádrž", date: "2026-07-13", createdAt: "2026-07-13T08:00:00.000Z" },
          { id: "x2", amount: 380, category: "myto", paidBy: "Kuba", car: "Kubova Octavia", note: "rakouská dálnice", date: "2026-07-13", createdAt: "2026-07-13T09:30:00.000Z" },
          { id: "x3", amount: 1620, category: "benzin", paidBy: "Tomáš", car: "Tomášovo Audi", date: "2026-07-13", createdAt: "2026-07-13T08:10:00.000Z" },
          { id: "x4", amount: 240, category: "parkovne", paidBy: "Vojta", note: "u apartmánu", date: "2026-07-14", createdAt: "2026-07-14T19:00:00.000Z" },
          { id: "x5", amount: 900, category: "jidlo", paidBy: "Marek", note: "společný nákup", date: "2026-07-14", createdAt: "2026-07-14T17:00:00.000Z" },
        ],
        locked: null,
      },
    ],
  };
}

export function emptyDB(): DB {
  return { trips: [] };
}
