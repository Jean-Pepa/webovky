"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useI18n } from "@/i18n/context";

// Plovoucí odznak vpravo dole – nahoře vidět napůl, po scrollu vyjede celý.
export default function StickyBadge() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setOpen(window.scrollY > 120);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="fixed bottom-0 right-5 z-40 hidden lg:block transition-transform duration-500 ease-out"
      style={{ transform: open ? "translateY(0)" : "translateY(46%)" }}
    >
      <div
        className="w-44 rounded-t-2xl shadow-2xl text-center text-white px-5 pt-5 pb-6"
        style={{ background: "var(--color-accent)" }}
      >
        <div className="text-2xl font-extrabold tracking-tight">Eika</div>
        <div className="mt-2 text-[15px] font-bold leading-tight">{t("badge.tagline")}</div>
        <div className="text-xs text-white/80">{t("badge.since")}</div>
        <Link
          href="/o-nas"
          className="mt-3 inline-block bg-white rounded-lg px-4 py-1.5 text-sm font-semibold"
          style={{ color: "var(--color-accent)" }}
        >
          {t("badge.cta")}
        </Link>
      </div>
    </div>
  );
}
