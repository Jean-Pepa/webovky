// Hlavní nadpis stránky — velký nadpis, kde je konec zlatě zvýrazněný
// (u víceslovných je zlaté poslední slovo, u jednoslovných konec slova).
const SPLITS: Record<string, number> = {
  Výzdoba: 2,
  Program: 3,
  Sponzoři: 4,
  Finance: 3,
  Prodej: 3,
  Nástěnka: 3,
  Úkoly: 2,
  Hlasování: 4,
  Kalendář: 4,
  Merch: 2,
  Prváci: 3,
};

export function PageTitle({ children }: { children: string }) {
  const text = String(children);
  const lastSpace = text.trimEnd().lastIndexOf(" ");
  const i = lastSpace > 0 ? lastSpace + 1 : SPLITS[text] ?? Math.max(1, Math.round(text.length * 0.42));
  return (
    <h1 className="page-title">
      {text.slice(0, i)}
      <span className="text-gold-grad">{text.slice(i)}</span>
    </h1>
  );
}
