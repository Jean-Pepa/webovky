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

export function ArrowLeftIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ArrowRightIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function StarBadgeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <circle cx="12" cy="9.5" r="6.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="m12 6 1.3 2.7 2.9.4-2.1 2 .5 2.9L12 12.6 9.5 14l.5-2.9-2.1-2 2.9-.4L12 6Z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
      <path d="M9 15.5 7.5 21l4.5-2 4.5 2-1.5-5.5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

export function BoxesIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <rect x="2.5" y="13" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.6" />
      <rect x="13.5" y="13" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.6" />
      <rect x="8" y="3.5" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function BoxIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <path d="M12 3 4 7v10l8 4 8-4V7l-8-4Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M4 7l8 4 8-4M12 11v10" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}

export function ClipboardIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <rect x="5" y="4" width="14" height="17" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M9 4.5h6V6a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V4.5Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8.5 11h7M8.5 14.5h7M8.5 18h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function CzFlag({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-label="Čeština">
      <defs>
        <clipPath id="cz-circle">
          <circle cx="12" cy="12" r="11" />
        </clipPath>
      </defs>
      <g clipPath="url(#cz-circle)">
        <rect x="0" y="0" width="24" height="12" fill="#ffffff" />
        <rect x="0" y="12" width="24" height="12" fill="#d7141a" />
        <path d="M0 0 L13 12 L0 24 Z" fill="#11457e" />
      </g>
      <circle cx="12" cy="12" r="11" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
    </svg>
  );
}

export function GbFlag({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-label="English">
      <defs>
        <clipPath id="gb-circle"><circle cx="12" cy="12" r="11" /></clipPath>
      </defs>
      <g clipPath="url(#gb-circle)">
        <rect width="24" height="24" fill="#012169" />
        <path d="M0 0 24 24M24 0 0 24" stroke="#fff" strokeWidth="5" />
        <path d="M0 0 24 24M24 0 0 24" stroke="#C8102E" strokeWidth="2" />
        <path d="M12 0V24M0 12H24" stroke="#fff" strokeWidth="6" />
        <path d="M12 0V24M0 12H24" stroke="#C8102E" strokeWidth="3.5" />
      </g>
      <circle cx="12" cy="12" r="11" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
    </svg>
  );
}

export function DeFlag({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-label="Deutsch">
      <defs>
        <clipPath id="de-circle"><circle cx="12" cy="12" r="11" /></clipPath>
      </defs>
      <g clipPath="url(#de-circle)">
        <rect width="24" height="8" y="0" fill="#000000" />
        <rect width="24" height="8" y="8" fill="#DD0000" />
        <rect width="24" height="8" y="16" fill="#FFCE00" />
      </g>
      <circle cx="12" cy="12" r="11" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
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

export function FuelIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden>
      <rect x="9" y="7" width="20" height="34" rx="2.5" stroke="currentColor" strokeWidth="3" />
      <path d="M13 15h12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M29 18l6 6v11a3 3 0 0 0 6 0V21l-6-6" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

export function PhoneIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M6.6 10.8a13.5 13.5 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.24c1.1.37 2.3.57 3.5.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.2.2 2.4.57 3.5a1 1 0 0 1-.24 1l-2.23 2.3z" />
    </svg>
  );
}

export function MailIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
