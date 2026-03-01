"use client";

import Link from "next/link";

interface BackArrowProps {
  locale: string;
}

export default function BackArrow({ locale }: BackArrowProps) {
  return (
    <Link
      href={`/${locale}`}
      className="fixed top-7 left-7 z-20 w-10 h-10 rounded-full bg-white/50 backdrop-blur-[6px] border border-black/[0.08] flex items-center justify-center cursor-pointer transition-opacity duration-300 hover:opacity-60"
    >
      <svg
        className="w-4 h-4"
        viewBox="0 0 24 24"
        stroke="#222"
        strokeWidth="1.5"
        fill="none"
      >
        <polyline points="15 6 9 12 15 18" />
      </svg>
    </Link>
  );
}
