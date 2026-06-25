// Porovnání jmen napříč appkou. Identita je jen jméno, takže drobné rozdíly
// (velikost písmen, diakritika, mezery) by neměly zakládat duplicitní účty.
// „Emma Džurbanová" == „emma dzurbanova".

export function normName(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/\s+/g, " ");
}

export function sameName(a: string, b: string): boolean {
  const na = normName(a);
  return na !== "" && na === normName(b);
}
