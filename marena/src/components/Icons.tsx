// Jednotná sada čistých linkových ikon (styl Lucide) místo emoji.
import type { ReactNode } from "react";

export type IconName =
  | "board"
  | "vote"
  | "calendar"
  | "mic"
  | "users"
  | "tasks"
  | "ops"
  | "finance"
  | "contacts"
  | "book"
  | "logout"
  | "plus"
  | "spark"
  | "lecture"
  | "food"
  | "beer"
  | "music"
  | "palette"
  | "flag"
  | "star"
  | "instagram"
  | "download";

const PATHS: Record<IconName, ReactNode> = {
  board: (
    <>
      <rect x="5" y="5" width="14" height="16" rx="2" />
      <rect x="9" y="3" width="6" height="4" rx="1" />
      <path d="M9 12h6M9 16h4" />
    </>
  ),
  vote: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="2.5" />
      <path d="m8 12 2.5 2.5L16 9" />
    </>
  ),
  calendar: (
    <>
      <rect x="4" y="5" width="16" height="15" rx="2.5" />
      <path d="M4 9.5h16M8 3v4M16 3v4" />
      <path d="M8 13h.5M12 13h.5M16 13h.5M8 16.5h.5M12 16.5h.5" />
    </>
  ),
  mic: (
    <>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M6 11a6 6 0 0 0 12 0M12 17v4M9 21h6" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8.5" r="3.2" />
      <path d="M3.5 20c0-3 2.5-5 5.5-5s5.5 2 5.5 5" />
      <path d="M15.5 6.5a3 3 0 0 1 0 5.5" />
      <path d="M16.5 15.2c2.3.4 4 2.4 4 4.8" />
    </>
  ),
  tasks: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m8.5 12 2.5 2.5 4.5-5" />
    </>
  ),
  ops: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  finance: (
    <>
      <rect x="4" y="6" width="16" height="13" rx="2.5" />
      <path d="M4 10.5h16" />
      <circle cx="16.5" cy="14.5" r="1.1" fill="currentColor" stroke="none" />
    </>
  ),
  contacts: (
    <>
      <rect x="3.5" y="5" width="17" height="14" rx="2.5" />
      <circle cx="9" cy="11" r="2.1" />
      <path d="M5.8 16c0-1.7 1.5-2.9 3.2-2.9s3.2 1.2 3.2 2.9" />
      <path d="M14.5 10h3.2M14.5 13h3.2" />
    </>
  ),
  book: (
    <>
      <path d="M12 6.5C10.4 5.3 8.4 5 4 5v13c4.4 0 6.4.3 8 1.5 1.6-1.2 3.6-1.5 8-1.5V5c-4.4 0-6.4.3-8 1.5Z" />
      <path d="M12 6.5V19.5" />
    </>
  ),
  logout: (
    <>
      <path d="M14 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-2" />
      <path d="M9.5 12h10.5M17 9l3 3-3 3" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  spark: (
    <>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
      <path d="m6.3 6.3 2.5 2.5M15.2 15.2l2.5 2.5M17.7 6.3l-2.5 2.5M8.8 15.2l-2.5 2.5" />
    </>
  ),
  lecture: (
    <>
      <rect x="3" y="4" width="18" height="11" rx="2" />
      <path d="M7 8h8M7 11h5" />
      <path d="M12 15v3M8.5 21l3.5-3 3.5 3" />
    </>
  ),
  food: (
    <>
      <path d="M3.5 11.5h17a8.5 8.5 0 0 1-17 0Z" />
      <path d="M3 11.5h18" />
      <path d="M9 3.5c-.6 1 .6 2 0 3M13 3.5c-.6 1 .6 2 0 3" />
    </>
  ),
  beer: (
    <>
      <path d="M7 7h8v12a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2Z" />
      <path d="M15 10h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2" />
      <path d="M10 10.5v7M12 10.5v7" />
    </>
  ),
  music: (
    <>
      <path d="M9 17.5V6l9-1.8v11.3" />
      <circle cx="7" cy="17.5" r="2" />
      <circle cx="16" cy="15.5" r="2" />
    </>
  ),
  palette: (
    <>
      <path d="M12 3.5C7 3.5 3.5 7 3.5 11.5c0 4 3 7 7 7 1 0 1.6-.85 1.4-1.7-.2-.85.4-1.5 1.25-1.45L15 15.4a4 4 0 0 0 4-4c0-4.4-3.1-7.9-7-7.9Z" />
      <circle cx="8" cy="11" r="1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="8.2" r="1" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="11" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  flag: (
    <>
      <path d="M5.5 21V3.5" />
      <path d="M5.5 4.5h11l-2.2 3.2 2.2 3.2h-11" />
    </>
  ),
  star: <path d="M12 3.6l2.5 5 5.5.8-4 3.9.95 5.5L12 16.2l-4.9 2.6.95-5.5-4-3.9 5.5-.8z" />,
  instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="3.8" />
      <circle cx="16.8" cy="7.2" r="1.05" fill="currentColor" stroke="none" />
    </>
  ),
  download: (
    <>
      <path d="M12 3v11" />
      <path d="m7.5 10 4.5 4.5L16.5 10" />
      <path d="M5 20h14" />
    </>
  ),
};

export function Icon({ name, className = "h-4 w-4" }: { name: IconName; className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {PATHS[name]}
    </svg>
  );
}
