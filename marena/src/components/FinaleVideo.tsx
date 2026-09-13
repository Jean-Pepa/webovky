"use client";

import { useEffect, useRef } from "react";

// Video se světelnými čarami (light-painting z Instagramu Mařeny) jako pozadí
// finálové karty. Přes mix-blend-mode: screen se černé pozadí videa „přebarví"
// na zlatou karty a bílé čáry zůstanou bílé. Bez zvuku, ve smyčce, jen dekorace.
export function FinaleVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    // React neumí spolehlivě vyrenderovat atribut `muted` → nastavit ručně, jinak
    // prohlížeč autoplay zablokuje. Při „omezit pohyb" video nechat stát.
    v.muted = true;
    v.defaultMuted = true;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      v.pause();
      return;
    }
    v.play().catch(() => {});
  }, []);
  return (
    <video
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full object-cover mix-blend-screen"
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      disablePictureInPicture
    >
      {/* WebM (VP9) pro Chromium bez H.264, MP4 pro Safari a ostatní */}
      <source src="/finale-flashes.webm" type="video/webm" />
      <source src="/finale-flashes.mp4" type="video/mp4" />
    </video>
  );
}
