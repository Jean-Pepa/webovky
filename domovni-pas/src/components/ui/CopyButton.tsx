"use client";

import { useState } from "react";
import { IconCheck, IconLink } from "@/components/Icons";

export function CopyButton({
  text,
  className = "btn-secondary btn-sm",
}: {
  text: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      className={className}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          // schránka nemusí být dostupná (např. bez HTTPS)
        }
      }}
    >
      {copied ? (
        <>
          <IconCheck className="h-4 w-4" />
          Zkopírováno
        </>
      ) : (
        <>
          <IconLink className="h-4 w-4" />
          Kopírovat odkaz
        </>
      )}
    </button>
  );
}
