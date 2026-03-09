"use client";

import { useParams } from "next/navigation";
import Link from "next/link";

interface FooterProps {
  showNovinky?: boolean;
}

export default function Footer({ showNovinky = true }: FooterProps) {
  const params = useParams();
  const locale = (params?.locale as string) ?? "cs";

  return (
    <>
      {/* Admin link */}
      <div className="text-center py-4 relative z-[1] bg-white">
        <Link
          href={`/${locale}/login`}
          className="text-[11px] text-black/20 hover:text-black/40 transition-colors"
        >
          Admin
        </Link>
      </div>

      {/* NOVINKY — blog link, fixed bottom-left */}
      {showNovinky && <Link
        href={`/${locale}/blog`}
        className="fixed bottom-8 left-7 z-20 h-[32px] rounded-full backdrop-blur-[6px] flex items-center justify-center cursor-pointer px-[91px] text-[11px] font-medium uppercase tracking-[0.15em]"
        style={{
          animation: "pulseInvert 6s ease-in-out infinite",
          fontFamily: '"Montserrat", sans-serif',
          backgroundColor: "rgba(0,0,0,0.75)",
          color: "#fff",
          border: "1px solid rgba(255,255,255,0.25)",
        }}
      >
        NOVINKY
      </Link>}
    </>
  );
}
