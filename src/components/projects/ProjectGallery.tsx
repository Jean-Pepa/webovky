"use client";

import { useState } from "react";
import Image from "next/image";

interface ProjectGalleryProps {
  images: string[];
  title: string;
}

export default function ProjectGallery({ images, title }: ProjectGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (images.length === 0) return null;

  return (
    <>
      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4">
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => setSelectedIndex(i)}
            className="relative w-full h-[150px] sm:h-[200px] cursor-pointer hover:opacity-90 transition-opacity"
          >
            <Image
              src={src}
              alt={`${title} - ${i + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          onClick={() => setSelectedIndex(null)}
        >
          <button
            onClick={() => setSelectedIndex(null)}
            className="absolute top-6 right-6 text-white text-3xl z-10 hover:opacity-70"
          >
            &times;
          </button>

          {/* Previous */}
          {selectedIndex > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIndex(selectedIndex - 1);
              }}
              className="absolute left-6 text-white text-4xl hover:opacity-70"
            >
              &lsaquo;
            </button>
          )}

          <div className="relative max-w-[90vw] max-h-[85vh] w-full h-full">
            <Image
              src={images[selectedIndex]}
              alt={`${title} - ${selectedIndex + 1}`}
              fill
              className="object-contain"
              sizes="90vw"
            />
          </div>

          {/* Next */}
          {selectedIndex < images.length - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIndex(selectedIndex + 1);
              }}
              className="absolute right-6 text-white text-4xl hover:opacity-70"
            >
              &rsaquo;
            </button>
          )}

          <div className="absolute bottom-6 text-white/60 text-sm">
            {selectedIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
