export function Loading({ label = "Načítám…" }: { label?: string }) {
  return (
    <div className="grid min-h-[60vh] place-items-center text-ink-soft">
      <div className="flex flex-col items-center gap-3">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-marigold-300 border-t-marigold-600" />
        <span className="text-sm">{label}</span>
      </div>
    </div>
  );
}
