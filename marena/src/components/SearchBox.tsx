"use client";

// Šedý kolečkový křížek na vymazání pole — sjednocený vzhled pro všechny
// vyhledávače v aplikaci (i pro ty, co nepoužívají SearchBox). Nativní křížek
// u <input type="search"> je schovaný v globals.css, ať se nedublují.
export function SearchClear({ onClear, className = "" }: { onClear: () => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClear}
      aria-label="Vymazat hledání"
      className={`grid h-5 w-5 shrink-0 place-items-center rounded-full bg-ink/25 text-[11px] font-bold leading-none text-white transition hover:bg-ink/40 ${className}`}
    >
      ✕
    </button>
  );
}

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
        className={`input w-full pl-9 ${value ? "pr-10" : ""}`}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && <SearchClear onClear={() => onChange("")} className="absolute right-2.5 top-1/2 -translate-y-1/2" />}
    </div>
  );
}
