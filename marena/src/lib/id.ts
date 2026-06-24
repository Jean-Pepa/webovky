// Krátké náhodné ID. Nepoužívá Math.random kvůli kryptografii — jen pro klíče.
export function uid(prefix = ""): string {
  const rnd = Math.random().toString(36).slice(2, 8);
  const t = Date.now().toString(36).slice(-4);
  return `${prefix}${t}${rnd}`;
}
