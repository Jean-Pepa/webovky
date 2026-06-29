"use client";

// Sdílený vyhledávací input (lupa + křížek na vymazání). Filtrování si řeší
// každá stránka sama přes matchesQuery z lib/search.
export function SearchBox({
  value,
  onChange,
  placeholder = "Hledat…",
  className = "",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-ink-soft">🔍</span>
      <input
        type="search"
        className="input w-full pl-9"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Zrušit hledání"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-soft hover:text-ink"
        >
          ✕
        </button>
      )}
    </div>
  );
}
