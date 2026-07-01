"use client";

import { useEffect } from "react";
import { Modal } from "@/components/Modal";

// Jednotný prohlížeč obrázků pro celou Mařenu (nástěnka, účtenky, kuchyně, merch…).
// Fullscreen přes Modal, listování šipkami ‹ ›, počítadlo „N / M" a velké tlačítko
// Zavřít. Je čistě prezentační — obrázky (data URL) i aktuální index řídí volající.
export function ImageViewer({
  images,
  index,
  onIndex,
  title = "Obrázek",
}: {
  images: string[]; // seřazené data URL
  index: number | null; // otevřený index, nebo null = zavřeno
  onIndex: (i: number | null) => void;
  title?: string;
}) {
  const count = images.length;
  const many = count > 1;

  // Klávesnice: šipky listují (Esc řeší Modal). Držíme mimo render, ať se
  // nevytváří nová funkce zbytečně; závislosti pokrývají index i počet.
  useEffect(() => {
    if (index === null || count < 2) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") onIndex((index - 1 + count) % count);
      else if (e.key === "ArrowRight") onIndex((index + 1) % count);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, count, onIndex]);

  const go = (delta: number) => {
    if (index === null || count === 0) return;
    onIndex((index + delta + count) % count);
  };

  return (
    <Modal open={index !== null} onClose={() => onIndex(null)} title={title}>
      {index !== null && images[index] && (
        <div>
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={images[index]} alt="obrázek" className="max-h-[68vh] w-full rounded-xl object-contain" />
            {many && (
              <>
                <button
                  onClick={() => go(-1)}
                  aria-label="Předchozí"
                  className="absolute left-1 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-ink/70 text-2xl leading-none text-white shadow-lg transition hover:bg-ink"
                >
                  ‹
                </button>
                <button
                  onClick={() => go(1)}
                  aria-label="Další"
                  className="absolute right-1 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-ink/70 text-2xl leading-none text-white shadow-lg transition hover:bg-ink"
                >
                  ›
                </button>
              </>
            )}
          </div>
          {many && <p className="mt-2 text-center text-sm text-ink-soft">{index + 1} / {count}</p>}
          <div className="mt-3 flex justify-center">
            <button onClick={() => onIndex(null)} className="btn-primary px-8">
              Zavřít
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
