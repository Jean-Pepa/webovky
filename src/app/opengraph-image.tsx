import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";

export const alt = "EIKA ZNOJMO";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Náhledový obrázek pro sdílení = čisté logo EIKA na bílém pozadí
export default function OpengraphImage() {
  const logo = readFileSync(join(process.cwd(), "public/logo.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#ffffff",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={820} height={336} alt="EIKA" />
      </div>
    ),
    { ...size },
  );
}
