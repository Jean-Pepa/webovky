import { ImageResponse } from "next/og";

export const alt = "EIKA ZNOJMO – hutní materiál, železářství a vinohradnictví";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Dynamicky generovaný náhledový obrázek pro sdílení (Facebook, Messenger, …)
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#b81f24",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 130, fontWeight: 800, letterSpacing: -4, lineHeight: 1 }}>EIKA</div>
        <div style={{ fontSize: 46, fontWeight: 700, marginTop: 8, opacity: 0.95 }}>ZNOJMO, a.s.</div>
        <div style={{ fontSize: 40, marginTop: 40, maxWidth: 900, lineHeight: 1.3 }}>
          Hutní materiál · Železářství · Vinohradnictví
        </div>
        <div style={{ fontSize: 30, marginTop: 28, opacity: 0.9 }}>Pobočky Brno a Znojmo · www.eika.cz</div>
      </div>
    ),
    { ...size },
  );
}
