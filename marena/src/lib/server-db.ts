import { getRedis, DB_KEY } from "./redis";
import { seedDB } from "./seed";
import type { DB } from "./types";
import { applyAction, type Action } from "./actions";

const REV_KEY = "marena:rev";

// Optimistický zámek: zapiš novou DB jen když se od načtení nezměnila revize.
// Tím se zabrání ztrátě zápisů při souběhu (např. celý tým hlasuje naráz).
const CAS_SCRIPT = `
local curRev = redis.call('GET', KEYS[2])
if curRev == false then curRev = '0' end
if curRev ~= ARGV[2] then return -1 end
redis.call('SET', KEYS[1], ARGV[1])
redis.call('SET', KEYS[2], tostring(tonumber(ARGV[2]) + 1))
return 1
`;

// Načte DB i s revizí. Pokud je úložiště prázdné, nasází výchozí stav.
export async function readState(): Promise<{ db: DB; rev: number } | null> {
  const redis = getRedis();
  if (!redis) return null;
  const db = (await redis.get(DB_KEY)) as DB | null;
  const rev = ((await redis.get(REV_KEY)) as number | null) ?? 0;
  if (!db || !Array.isArray(db.years)) {
    const seeded = seedDB();
    await redis.set(DB_KEY, seeded);
    await redis.set(REV_KEY, 0);
    return { db: seeded, rev: 0 };
  }
  return { db, rev };
}

export async function readDB(): Promise<DB | null> {
  const state = await readState();
  return state ? state.db : null;
}

// Atomicky aplikuje jednu akci. Read-modify-write s CAS a několika pokusy.
// Vrací novou DB, null = backend není nastavený nebo se zápis nepodařil (konflikt).
export async function applyActionAtomic(action: Action): Promise<DB | null> {
  const redis = getRedis();
  if (!redis) return null;
  for (let attempt = 0; attempt < 6; attempt++) {
    const state = await readState();
    if (!state) return null;
    const next = applyAction(state.db, action);
    const res = (await redis.eval(
      CAS_SCRIPT,
      [DB_KEY, REV_KEY],
      [JSON.stringify(next), String(state.rev)],
    )) as number;
    if (res === 1) return next;
    // jiná revize mezitím → načti znovu a zkus přehrát akci na čerstvém stavu
  }
  return null;
}

export function isConfigured(): boolean {
  return getRedis() !== null;
}
