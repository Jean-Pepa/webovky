import Link from "next/link";

// Značka v duchu loga Fakulty architektury VUT (černý čtverec se symbolem + „FA"
// v rámečku) + slovní značka Mařena. Barvy se přepínají podle `light`.
export function Logo({ href = "/", light = false }: { href?: string; light?: boolean }) {
  const ink = light ? "#ffffff" : "#161616";
  const paper = light ? "#161616" : "#ffffff";
  return (
    <Link href={href} className="inline-flex items-center gap-2.5">
      <svg width="56" height="28" viewBox="0 0 48 24" fill="none" aria-label="Fakulta architektury VUT" role="img">
        {/* levý čtverec se symbolem „T" */}
        <rect x="0" y="1" width="22" height="22" rx="1.5" fill={ink} />
        <g fill={paper}>
          <rect x="4.5" y="5" width="13" height="3.4" rx="0.4" />
          <rect x="9.3" y="5" width="3.4" height="13" rx="0.4" />
        </g>
        {/* pravý čtverec s „FA" */}
        <rect x="25.2" y="1.75" width="20.5" height="20.5" rx="1.5" fill="none" stroke={ink} strokeWidth="1.5" />
        <text x="35.4" y="16.4" textAnchor="middle" fontFamily="inherit" fontSize="11" fontWeight="700" fill={ink}>
          FA
        </text>
      </svg>
      <span className={`font-display text-xl font-semibold tracking-tight ${light ? "text-white" : "text-ink"}`}>
        Mařena
      </span>
    </Link>
  );
}
