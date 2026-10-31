import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Chromatic Harp Trainer",
    short_name: "Harp Trainer",
    description: "Scales, arpeggios, tuner and lessons for the chromatic harmonica.",
    start_url: "/",
    display: "standalone",
    background_color: "#eeeef1",
    theme_color: "#eeeef1",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
