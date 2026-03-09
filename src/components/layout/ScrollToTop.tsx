"use client";

import { useEffect, useState } from "react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > 400);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="scroll-to-top fixed bottom-8 right-7 z-20 w-10 h-10 rounded-full bg-white/50 backdrop-blur-[6px] border border-black/[0.08] flex items-center justify-center cursor-pointer transition-opacity duration-300"
      style={{
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <svg className="w-4 h-4" viewBox="0 0 24 24" stroke="#222" strokeWidth="1.5" fill="none">
        <polyline points="18 15 12 9 6 15" />
      </svg>
    </button>
  );
}
