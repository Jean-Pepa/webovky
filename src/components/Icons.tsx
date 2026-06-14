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

export function HeartIcon({
  className,
  filled = false,
}: IconProps & { filled?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill={filled ? "currentColor" : "none"}
      aria-hidden
    >
      <path
        d="M12 20s-7-4.35-9.2-8.5C1.4 9 2.3 6 5.2 6 7 6 8.2 7 12 10.5 15.8 7 17 6 18.8 6c2.9 0 3.8 3 2.4 5.5C19 15.65 12 20 12 20Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function StarIcon({
  className,
  fill = "full",
}: IconProps & { fill?: "full" | "half" | "empty" }) {
  const paint =
    fill === "full" ? "currentColor" : fill === "empty" ? "none" : "url(#star-half)";
  return (
    <svg viewBox="0 0 24 24" className={className} fill={paint} aria-hidden>
      {fill === "half" && (
        <defs>
          <linearGradient id="star-half">
            <stop offset="50%" stopColor="currentColor" />
            <stop offset="50%" stopColor="transparent" />
          </linearGradient>
        </defs>
      )}
      <path
        d="m12 3 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.2l1-5.8L3.5 9.2l5.9-.9L12 3Z"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ChevronDownIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function FilterIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <path d="M3 5h18M6 12h12M10 19h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function TruckIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <path d="M3 7h11v8H3zM14 10h4l3 3v2h-7z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="7" cy="17.5" r="1.8" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.5" cy="17.5" r="1.8" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function ShieldIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <path d="M12 3 5 6v5c0 4 3 7 7 9 4-2 7-5 7-9V6l-7-3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function UserIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <circle cx="12" cy="8" r="3.4" stroke="currentColor" strokeWidth="1.7" />
      <path d="M5 20c1.2-3.4 4-5 7-5s5.8 1.6 7 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}
