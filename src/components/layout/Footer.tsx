"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface FooterProps {
  showNovinky?: boolean;
  showBackToTop?: boolean;
}

export default function Footer({ showNovinky = true, showBackToTop = true }: FooterProps) {
  const [showArrow, setShowArrow] = useState(false);
  const params = useParams();
  const locale = (params?.locale as string) ?? "cs";

  useEffect(() => {
    function handleScroll() {
      const wrapper = document.querySelector(".headline-wrapper");
      if (!wrapper) return;
      const wrapperBottom = wrapper.getBoundingClientRect().bottom;
      const windowH = window.innerHeight;
      setShowArrow(wrapperBottom < windowH);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Back to top text */}
      {showBackToTop && (
        <div className="text-center px-4 sm:px-7 py-[30px] text-xs relative z-[1] bg-white">
          <a
            href="#"
            className="opacity-30 transition-opacity hover:opacity-100"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            &uarr; Back to Top
          </a>
        </div>
      )}

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

      {/* Back to top floating arrow */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-8 right-7 z-20 w-10 h-10 rounded-full bg-white/50 backdrop-blur-[6px] border border-black/[0.08] flex items-center justify-center cursor-pointer transition-opacity duration-300"
        style={{
          opacity: showArrow ? 1 : 0,
          pointerEvents: showArrow ? "auto" : "none",
        }}
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" stroke="#222" strokeWidth="1.5" fill="none">
          <polyline points="18 15 12 9 6 15" />
        </svg>
      </button>
    </>
  );
}
