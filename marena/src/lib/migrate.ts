// Normalizace uložených dat po sloučení rolí (2026): stará ID rolí
// v členech, vedoucích, úkolech i příspěvcích se převedou na nová,
// takže lidem zůstane všechno správně přiřazené — bez ručního zásahu
// do Redisu. Normalizuje se při každém načtení DB (je to čistá funkce);
// při první další změně se data uloží už v nové podobě.
import type { DB, Year } from "./types";
import { LEGACY_ROLE_MAP } from "./roles";

const mapId = (id: string): string => LEGACY_ROLE_MAP[id] ?? id;

function normalizeYear(y: Year): Year {
  let changed = false;

  const members = y.members.map((m) => {
    const ids = [...new Set(m.roleIds.map(mapId))];
    const reqs = m.roleRequests ? [...new Set(m.roleRequests.map(mapId))] : undefined;
    const idsSame = ids.length === m.roleIds.length && ids.every((v, i) => v === m.roleIds[i]);
    const reqsSame = !m.roleRequests || (reqs!.length === m.roleRequests.length && reqs!.every((v, i) => v === m.roleRequests![i]));
    if (idsSame && reqsSame) return m;
    changed = true;
    return { ...m, roleIds: ids, roleRequests: reqs };
  });

  const leads: Record<string, string> = {};
  for (const [k, v] of Object.entries(y.roleLeads ?? {})) {
    const nk = mapId(k);
    if (nk !== k) changed = true;
    if (!leads[nk]) leads[nk] = v; // při kolizi vyhrává první (původní vedoucí)
  }

  const tasks = (y.tasks ?? []).map((t) => {
    if (!t.roleId || !LEGACY_ROLE_MAP[t.roleId]) return t;
    changed = true;
    return { ...t, roleId: mapId(t.roleId) };
  });

  const posts = (y.posts ?? []).map((p) => {
    if (!p.roleId || !LEGACY_ROLE_MAP[p.roleId]) return p;
    changed = true;
    return { ...p, roleId: mapId(p.roleId) };
  });

  return changed ? { ...y, members, roleLeads: leads, tasks, posts } : y;
}

export function normalizeDb(db: DB): DB {
  const years = db.years.map(normalizeYear);
  return years.some((y, i) => y !== db.years[i]) ? { ...db, years } : db;
}
