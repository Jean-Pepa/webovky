"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// Logo se načítá z REÁLNÉHO souboru (oficiální logo FA, beze změny). Vlož ho do
// /public jako logo-fa.svg (ideálně) nebo logo-fa.png. Soubor se zkouší načíst
// až v prohlížeči — dokud tam není, ukáže se čistá náhradní značka (žádný
// rozbitý obrázek). Na tmavém podkladu (light) je logo v bílém poli.
const SOURCES = ["/logo-fa.svg", "/logo-fa.png", "/photos/logo-fa.svg", "/photos/logo-fa.png"];

export function Logo({ href = "/", light = false }: { href?: string; light?: boolean }) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      for (const s of SOURCES) {
        const ok = await new Promise<boolean>((res) => {
          const im = new Image();
          im.onload = () => res(true);
          im.onerror = () => res(false);
          im.src = s;
        });
        if (cancelled) return;
        if (ok) {
          setSrc(s);
          return;
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Link href={href} className="inline-flex items-center" aria-label="Mařena — Fakulta architektury VUT">
      {src ? (
        <span className={light ? "inline-flex rounded-md bg-white p-1.5" : "inline-flex"}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt="Fakulta architektury VUT" className="h-[1.5cm] w-auto" />
        </span>
      ) : (
        <FallbackMark light={light} />
      )}
    </Link>
  );
}

// Náhradní značka, dokud není dodán oficiální soubor loga.
function FallbackMark({ light }: { light: boolean }) {
  const ink = light ? "#ffffff" : "#161616";
  const paper = light ? "#161616" : "#ffffff";
  return (
    <svg viewBox="0 0 48 24" fill="none" role="img" aria-hidden className="h-[1.5cm] w-auto">
      <rect x="0" y="1" width="22" height="22" rx="1.5" fill={ink} />
      <g fill={paper}>
        <rect x="4.5" y="5" width="13" height="3.4" rx="0.4" />
        <rect x="9.3" y="5" width="3.4" height="13" rx="0.4" />
      </g>
      <rect x="25.2" y="1.75" width="20.5" height="20.5" rx="1.5" fill="none" stroke={ink} strokeWidth="1.5" />
      <text x="35.4" y="16.4" textAnchor="middle" fontFamily="inherit" fontSize="11" fontWeight="700" fill={ink}>
        FA
      </text>
    </svg>
  );
}
