// Červené upozornění „máš jen náhled / uzamčeno" — dává se úplně nahoru,
// nad hlavní nadpis sekce, ať je hned vidět, že se tu nedá nic měnit.
export function ReadOnlyBanner({ children }: { children: React.ReactNode }) {
  return (
    <div className="readonly-pulse mb-4 flex items-start gap-2 rounded-xl border-2 border-red-500 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
      <span aria-hidden>🔒</span>
      <span>{children}</span>
    </div>
  );
}
