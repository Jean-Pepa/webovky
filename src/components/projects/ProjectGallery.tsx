"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface ProjectGalleryProps {
  images: string[];
  title: string;
  thumbnailUrl?: string;
}

export default function ProjectGallery({
  images,
  title,
  thumbnailUrl,
}: ProjectGalleryProps) {
  const allImages = thumbnailUrl
    ? [thumbnailUrl, ...images.filter((img) => img !== thumbnailUrl)]
    : images;

  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Auto-advance slideshow every 5 seconds
  useEffect(() => {
    if (lightboxIndex !== null || allImages.length <= 1) return;
    const timer = setInterval(() => {
      setFeaturedIndex((prev) => (prev + 1) % allImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [lightboxIndex, allImages.length, featuredIndex]);

  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.classList.add("lightbox-open");
    } else {
      document.body.classList.remove("lightbox-open");
    }
    return () => document.body.classList.remove("lightbox-open");
  }, [lightboxIndex]);

  if (allImages.length === 0) return null;

  return (
    <>
      {/* Featured image + thumbnail strip */}
      {thumbnailUrl && (
        <div className="mb-10" style={{ paddingLeft: "15%", paddingRight: "15%" }}>
          {/* Featured — crossfade */}
          <div
            className="relative w-full aspect-[16/9] overflow-hidden cursor-pointer group"
            onClick={() => setLightboxIndex(featuredIndex)}
          >
            {allImages.map((src, i) => (
              <Image
                key={src}
                src={src}
                alt={`${title} - ${i + 1}`}
                fill
                className="object-cover transition-opacity duration-1000 ease-in-out group-hover:scale-[1.02]"
                style={{ opacity: i === featuredIndex ? 1 : 0 }}
                sizes="(max-width: 768px) 100vw, 55vw"
                priority={i === 0}
              />
            ))}
          </div>

          {/* Thumbnail strip */}
          {allImages.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
              {allImages.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setFeaturedIndex(i)}
                  className={`relative w-16 h-16 flex-shrink-0 overflow-hidden transition-all ${
                    i === featuredIndex
                      ? "ring-2 ring-primary opacity-100"
                      : "opacity-40 hover:opacity-70"
                  }`}
                >
                  <Image
                    src={src}
                    alt={`${title} thumb ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-6 right-6 text-white text-3xl z-10 hover:opacity-70"
          >
            &times;
          </button>

          {/* Previous */}
          {lightboxIndex > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex(lightboxIndex - 1);
              }}
              className="absolute left-6 text-white text-4xl hover:opacity-70"
            >
              &lsaquo;
            </button>
          )}

          <div className="relative max-w-[90vw] max-h-[85vh] w-full h-full">
            <Image
              src={allImages[lightboxIndex]}
              alt={`${title} - ${lightboxIndex + 1}`}
              fill
              className="object-contain"
              sizes="90vw"
            />
          </div>

          {/* Next */}
          {lightboxIndex < allImages.length - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex(lightboxIndex + 1);
              }}
              className="absolute right-6 text-white text-4xl hover:opacity-70"
            >
              &rsaquo;
            </button>
          )}

          <div className="absolute bottom-6 text-white/60 text-sm">
            {lightboxIndex + 1} / {allImages.length}
          </div>
        </div>
      )}
    </>
  );
}
