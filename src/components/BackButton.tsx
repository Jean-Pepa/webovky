"use client";

import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "./Icons";
import { useI18n } from "@/i18n/context";

export default function BackButton({ className = "" }: { className?: string }) {
  const router = useRouter();
  const { t } = useI18n();
  return (
    <button
      type="button"
      onClick={() => router.back()}
      aria-label={t("nav.back")}
      className={`shrink-0 grid place-items-center w-9 h-9 rounded-md border border-black text-white hover:opacity-90 transition ${className}`}
      style={{ background: "var(--color-accent)" }}
    >
      <ArrowLeftIcon className="w-5 h-5" />
    </button>
  );
}
