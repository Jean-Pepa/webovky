import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    qualities: [100],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "tozasdhvjewrodbvowzw.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "images.adsttc.com",
      },
      {
        protocol: "https",
        hostname: "static.dezeen.com",
      },
      {
        protocol: "http",
        hostname: "static.dezeen.com",
      },
      {
        protocol: "https",
        hostname: "www.designboom.com",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
