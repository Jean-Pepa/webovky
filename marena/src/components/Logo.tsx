import Link from "next/link";

// Slovní značka Mařeny s malou květinou (odkaz na folklórní věneček maskota).
export function Logo({ href = "/", light = false }: { href?: string; light?: boolean }) {
  return (
    <Link href={href} className="inline-flex items-center gap-2">
      <span aria-hidden className="grid h-8 w-8 place-items-center rounded-full bg-marigold-600 text-white">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <g fill="currentColor">
            <circle cx="12" cy="5" r="3.2" />
            <circle cx="12" cy="19" r="3.2" />
            <circle cx="5" cy="12" r="3.2" />
            <circle cx="19" cy="12" r="3.2" />
          </g>
          <circle cx="12" cy="12" r="3.4" fill="#5b2139" />
        </svg>
      </span>
      <span
        className={`font-display text-xl font-semibold tracking-tight ${light ? "text-white" : "text-ink"}`}
      >
        Mařena
      </span>
    </Link>
  );
}
