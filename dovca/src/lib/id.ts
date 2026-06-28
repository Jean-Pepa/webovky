// Krátké náhodné ID. crypto.randomUUID když je k dispozici, jinak fallback.
export function newId(): string {
  try {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID().slice(0, 8);
    }
  } catch {
    /* ignore */
  }
  return Math.random().toString(36).slice(2, 10);
}
