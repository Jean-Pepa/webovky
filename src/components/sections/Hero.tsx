"use client";

import { useEffect, useState } from "react";

interface HeroProps {
  title: string;
}

export default function Hero({ title }: HeroProps) {
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    function handleScroll() {
      const wrapper = document.querySelector(".headline-wrapper");
      if (!wrapper) return;
      const wrapperBottom = wrapper.getBoundingClientRect().bottom;
      const windowH = window.innerHeight;
      const fadeZone = windowH * 0.6;

      let newOpacity: number;
      if (wrapperBottom >= windowH) {
        newOpacity = 1;
      } else if (wrapperBottom <= windowH - fadeZone) {
        newOpacity = 0;
      } else {
        newOpacity = (wrapperBottom - (windowH - fadeZone)) / fadeZone;
      }
      setOpacity(newOpacity);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div className="headline-wrapper relative h-screen">
        <div
          className="fixed top-0 left-0 right-0 h-screen flex items-center justify-center text-center px-4 sm:px-7 z-0 pt-[5vh] sm:pt-[10vh]"
          style={{ opacity, transition: "opacity 0.02s linear" }}
        >
          <h2
            className="text-[clamp(24px,4.5vw,48px)] leading-[1.35] tracking-[0.06em]"
            style={{ fontFamily: '"Montserrat", sans-serif', fontWeight: 100 }}
          >
            {title}
          </h2>
        </div>
      </div>

      {/* Scroll arrow */}
      <div
        className="fixed bottom-9 left-1/2 -translate-x-1/2 z-0 cursor-pointer"
        style={{
          opacity,
          pointerEvents: opacity < 0.1 ? "none" : "auto",
          transition: "opacity 0.02s linear",
        }}
        onClick={() =>
          document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })
        }
      >
        <svg
          className="w-7 h-7 animate-[bounceArrow_2s_ease-in-out_infinite]"
          viewBox="0 0 24 24"
          stroke="#222"
          strokeWidth="1.5"
          fill="none"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </>
  );
}
