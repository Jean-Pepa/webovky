"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface DocImage {
  src: string;
  alt: string;
}

interface DocGalleryProps {
  images: DocImage[];
}

export default function DocGallery({ images }: DocGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const idx = lightboxIndex;
    document.body.style.overflow = "hidden";
    // Hide back arrow and scroll-to-top when lightbox is open
    const backArrow = document.querySelector(".back-arrow") as HTMLElement | null;
    const scrollBtn = document.querySelector(".scroll-to-top") as HTMLElement | null;
    if (backArrow) backArrow.style.display = "none";
    if (scrollBtn) scrollBtn.style.display = "none";

    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowRight" && idx < images.length - 1)
        setLightboxIndex(idx + 1);
      if (e.key === "ArrowLeft" && idx > 0)
        setLightboxIndex(idx - 1);
    }
    document.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      if (backArrow) backArrow.style.display = "";
      if (scrollBtn) scrollBtn.style.display = "";
      document.removeEventListener("keydown", handleKey);
    };
  }, [lightboxIndex, images.length]);

  return (
    <>
      <div className="mt-12 flex flex-col items-center gap-10">
        {images.map((img, i) => (
          <div
            key={i}
            className={i === 0 ? "w-[45%]" : "w-[60%]"}
          >
            <button
              onClick={() => setLightboxIndex(i)}
              className="w-full cursor-pointer group block"
            >
              <Image
                src={img.src}
                alt={img.alt}
                width={800}
                height={600}
                className="w-full h-auto transition-opacity duration-300 group-hover:opacity-75"
              />
            </button>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/90 cursor-pointer animate-[fadeIn_0.3s_ease]"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-5 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-white/15 text-white text-[26px] font-extralight cursor-pointer z-10 border-none transition-opacity hover:opacity-70 leading-none"
          >
            &times;
          </button>

          {lightboxIndex > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex(lightboxIndex - 1);
              }}
              className="absolute left-6 text-white text-4xl hover:opacity-70 z-10"
            >
              &lsaquo;
            </button>
          )}

          <Image
            src={images[lightboxIndex].src}
            alt={images[lightboxIndex].alt}
            width={1920}
            height={1400}
            className="max-w-[92vw] max-h-[92vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {lightboxIndex < images.length - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex(lightboxIndex + 1);
              }}
              className="absolute right-6 text-white text-4xl hover:opacity-70 z-10"
            >
              &rsaquo;
            </button>
          )}

          <div className="absolute bottom-6 text-white/60 text-sm">
            {lightboxIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
