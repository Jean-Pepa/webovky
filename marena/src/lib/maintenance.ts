import { getRedis } from "./redis";

// Režim údržby (vypnutí aplikace) — globální přepínač jen pro správce. Ukládá se
// mimo hlavní DB pod vlastní Redis klíč. Když je „on", přihlášení se zablokuje
// (kromě správce) a uvnitř se nedá nic dělat, dokud správce nepřepne zpět.
export const MAINT_KEY = "marena:maintenance";

export async function getMaintenance(): Promise<boolean> {
  const redis = getRedis();
  if (!redis) return false;
  return (await redis.get(MAINT_KEY)) === "on";
}

export async function setMaintenance(on: boolean): Promise<boolean> {
  const redis = getRedis();
  if (!redis) return false;
  await redis.set(MAINT_KEY, on ? "on" : "off");
  return true;
}
