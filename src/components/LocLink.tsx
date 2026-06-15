"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { useI18n } from "@/i18n/context";

// Odkaz, který automaticky přidá jazykový prefix (/en, /de). Čeština bez prefixu.
export default function LocLink({
  href,
  ...rest
}: ComponentProps<typeof Link>) {
  const { lang } = useI18n();
  let h = href;
  if (typeof href === "string" && href.startsWith("/") && lang !== "cs") {
    h = `/${lang}${href === "/" ? "" : href}`;
  }
  return <Link href={h} {...rest} />;
}
