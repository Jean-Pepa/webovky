"use client";

import { useState } from "react";

// Fotka s elegantním fallbackem. Když soubor v /public/photos chybí, ukáže se
// stylový placeholder s popiskem — appka tak funguje i bez nahraných fotek.
// `imgClass` umožní doladit ořez (např. object-bottom).
export function Photo({
  src,
  alt,
  label,
  className = "",
  imgClass = "object-center",
}: {
  src: string;
  alt: string;
  label: string;
  className?: string;
  imgClass?: string;
}) {
  const [err, setErr] = useState(false);
  return (
    <div className={`overflow-hidden bg-plum-800 ${className}`}>
      {!err ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} onError={() => setErr(true)} className={`h-full w-full object-cover ${imgClass}`} loading="lazy" />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-plum-600 to-plum-900 p-4 text-center">
          <span className="text-sm font-medium text-white/70">📷 {label}</span>
        </div>
      )}
    </div>
  );
}
