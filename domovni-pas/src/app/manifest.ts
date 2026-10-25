import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "BULO · Pas domu",
    short_name: "BULO",
    description: "Celý dům na jednom místě.",
    start_url: "/aplikace",
    display: "standalone",
    background_color: "#F2F0ED",
    theme_color: "#F2F0ED",
    icons: [
      { src: "/aplikace/ikona-192.png", sizes: "192x192", type: "image/png" },
      { src: "/aplikace/ikona-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
