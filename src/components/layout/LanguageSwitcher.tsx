"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function switchLocale(newLocale: "cs" | "en") {
    router.replace(pathname, { locale: newLocale });
  }

  return (
    <div className="flex gap-1 text-[0.85rem]">
      <button
        onClick={() => switchLocale("cs")}
        className={`px-2 py-1 transition-colors ${
          locale === "cs" ? "font-bold text-accent" : "text-secondary hover:text-primary"
        }`}
      >
        CZ
      </button>
      <span className="text-secondary">|</span>
      <button
        onClick={() => switchLocale("en")}
        className={`px-2 py-1 transition-colors ${
          locale === "en" ? "font-bold text-accent" : "text-secondary hover:text-primary"
        }`}
      >
        EN
      </button>
    </div>
  );
}
