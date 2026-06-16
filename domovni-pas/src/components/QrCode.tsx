"use client";

import { QRCodeSVG } from "qrcode.react";

// QR kód s bílým „quiet zone" rámečkem, ať jde dobře naskenovat.
export function QrCode({ value, size = 180 }: { value: string; size?: number }) {
  return (
    <div className="inline-block rounded-xl border border-stone-200 bg-white p-3">
      <QRCodeSVG value={value} size={size} level="M" />
    </div>
  );
}
