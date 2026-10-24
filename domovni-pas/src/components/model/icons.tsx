import type { SVGProps } from "react";

// Ikony jen pro model domu (ve stylu components/Icons.tsx)
type IconProps = SVGProps<SVGSVGElement>;

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
};

export function IconMinus(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M5 12h14" />
    </svg>
  );
}

// Celý půdorys (rohy výřezu)
export function IconFit(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M4 9V5a1 1 0 0 1 1-1h4M15 4h4a1 1 0 0 1 1 1v4M20 15v4a1 1 0 0 1-1 1h-4M9 20H5a1 1 0 0 1-1-1v-4" />
    </svg>
  );
}

export function IconRuler(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="m3.5 15.5 12-12 5 5-12 12-5-5Z" />
      <path d="m7.5 11.5 2 2M10.5 8.5l2 2M13.5 5.5l2 2" />
    </svg>
  );
}

export function IconMapPin(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M12 21s-6.5-6.2-6.5-11.2a6.5 6.5 0 0 1 13 0C18.5 14.8 12 21 12 21Z" />
      <circle cx="12" cy="9.8" r="2.3" />
    </svg>
  );
}

export function IconUndo(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M9 14 4 9l5-5" />
      <path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" />
    </svg>
  );
}

export function IconUpload(p: IconProps) {
  return (
    <svg {...base} {...p}>
      <path d="M12 16V4M7 9l5-5 5 5" />
      <path d="M4 15v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4" />
    </svg>
  );
}
