export function Logo({ className = "", light = false }: { className?: string; light?: boolean }) {
  const ink = light ? "#ffffff" : "#184e5a";

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg viewBox="0 0 48 48" className="h-9 w-9 shrink-0" fill="none" aria-hidden>
        {/* kruh */}
        <circle cx="24" cy="24" r="21" stroke={ink} strokeWidth="2.4" />
        {/* monogram B */}
        <g
          stroke={ink}
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        >
          <path d="M18 14 V34" />
          <path d="M18 14 H25 C30 14 30 24 25 24 H18" />
          <path d="M18 24 H26 C31.5 24 31.5 34 26 34 H18" />
        </g>
        {/* mosazná tečka */}
        <circle cx="33.5" cy="19" r="2.4" fill="#b58b4b" />
      </svg>
      <span
        className={`text-lg font-semibold tracking-tight ${light ? "text-white" : "text-stone-900"}`}
      >
        BULO
      </span>
    </span>
  );
}
