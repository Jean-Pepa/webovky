"use client";

import { IconDownload } from "@/components/Icons";

export function PrintButton() {
  return (
    <button type="button" className="btn-primary btn-sm" onClick={() => window.print()}>
      <IconDownload className="h-4 w-4" />
      Tisk / uložit PDF
    </button>
  );
}
