"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { parseAccount, spdString } from "@/lib/payment";
import { fmtCZK } from "@/lib/format";

// Platební QR (standard QR Platba) — generuje se lokálně v prohlížeči,
// číslo účtu ani částka neputují na žádnou externí službu.
export function PayQr({ account, amount, message, size = 240 }: { account: string; amount: number; message?: string; size?: number }) {
  const [url, setUrl] = useState<string | null>(null);
  const parsed = parseAccount(account);

  useEffect(() => {
    let alive = true;
    // Odloženě (mimo tělo efektu), ať se stav nemění synchronně při renderu.
    const t = setTimeout(() => {
      const p = parseAccount(account);
      if ("error" in p || amount <= 0) {
        if (alive) setUrl(null);
        return;
      }
      QRCode.toDataURL(spdString({ iban: p.iban, bic: p.bic, amount, message }), {
        width: size,
        margin: 2,
        errorCorrectionLevel: "M",
      })
        .then((u) => alive && setUrl(u))
        .catch(() => alive && setUrl(null));
    }, 0);
    return () => {
      alive = false;
      clearTimeout(t);
    };
  }, [account, amount, message, size]);

  if ("error" in parsed) {
    return <p className="text-sm text-red-600">Účet pro platby není správně nastavený: {parsed.error}</p>;
  }
  if (amount <= 0) return null;

  return (
    <div className="flex flex-col items-center gap-2 text-center">
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="QR platba" data-spd={"error" in parsed ? "" : spdString({ iban: parsed.iban, bic: parsed.bic, amount, message })} className="rounded-lg bg-[#fff] p-2 ring-1 ring-ink/10" style={{ width: size, height: size }} />
      ) : (
        <div className="grid place-items-center rounded-lg bg-paper2 text-sm text-ink-soft" style={{ width: size, height: size }}>
          Generuji QR…
        </div>
      )}
      <p className="font-display text-[28px] font-bold tabular-nums tracking-tight">{fmtCZK(Math.round(amount))}</p>
      <p className="text-sm text-ink-soft">
        Naskenuj bankovní aplikací · účet {parsed.display}
      </p>
    </div>
  );
}
