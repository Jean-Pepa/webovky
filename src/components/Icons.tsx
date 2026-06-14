import type { CSSProperties } from "react";

interface IconProps {
  className?: string;
  style?: CSSProperties;
}

export function BeamIcon({ className }: IconProps) {
  // Stylizovaný I-profil (hutní materiál)
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden>
      <path
        d="M10 10h28M10 38h28M24 10v28"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ToolsIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden>
      <path
        d="M30 8a8 8 0 0 0-8 11l-12 12a3 3 0 1 0 4 4l12-12a8 8 0 0 0 11-8l-5 5-4-1-1-4 5-5z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function GrapeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden>
      <path d="M24 10c0-3 2-4 4-4" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <g stroke="currentColor" strokeWidth="3">
        <circle cx="24" cy="16" r="3.5" />
        <circle cx="17" cy="22" r="3.5" />
        <circle cx="31" cy="22" r="3.5" />
        <circle cx="24" cy="28" r="3.5" />
        <circle cx="18" cy="33" r="3.5" />
        <circle cx="30" cy="33" r="3.5" />
      </g>
    </svg>
  );
}

export function CategoryIcon({
  icon,
  className,
}: {
  icon: "beam" | "tools" | "grape";
  className?: string;
}) {
  if (icon === "beam") return <BeamIcon className={className} />;
  if (icon === "tools") return <ToolsIcon className={className} />;
  return <GrapeIcon className={className} />;
}

export function CartIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <path
        d="M3 4h2l2.5 12h10L20 7H6.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="20" r="1.6" fill="currentColor" />
      <circle cx="17" cy="20" r="1.6" fill="currentColor" />
    </svg>
  );
}

export function SearchIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
      <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
