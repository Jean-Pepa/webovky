"use client";

import { useI18n } from "@/i18n/context";

export default function CookieSettingsButton({ className }: { className?: string }) {
  const { t } = useI18n();
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("eika:open-cookies"))}
      className={className}
    >
      {t("legal.cookiesSettings")}
    </button>
  );
}
