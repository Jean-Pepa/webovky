export function Loading({ label = "Načítám…" }: { label?: string }) {
  return <div className="flex items-center justify-center py-20 text-sm text-stone-400">{label}</div>;
}
