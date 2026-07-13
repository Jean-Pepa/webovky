import type { Metadata, Viewport } from "next";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";
import { ThirdPartyAnalytics } from "@/components/ThirdPartyAnalytics";

export const metadata: Metadata = {
  title: "Mařena — studentský festival Fakulty architektury VUT",
  description:
    "Mařena je týdenní studentský festival na Fakultě architektury VUT v Brně. Přednášky, bar na dvoře, party večery, průvod městem a křest prváků na Flédě. Sleduj nás na Instagramu.",
  applicationName: "Mařena",
  // PWA — po „Přidat na plochu" se z webu stane appka (ikona kačenky, běží na celou obrazovku).
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Mařena",
    statusBarStyle: "default",
  },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  // Kvůli starším iPhonům — ať se po „Přidat na plochu" appka otevře na celou obrazovku.
  other: { "apple-mobile-web-app-capable": "yes" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
  // Bez "cover" hlásí iOS env(safe-area-inset-*) nulu a spodní lišta zázemí
  // se pak bije s domovským indikátorem (swipe pruhem) na iPhonech.
  viewportFit: "cover",
};

// Noční režim jen v zázemí. Skript běží ještě před vykreslením, aby při tvrdém
// načtení /zazemi… nezablikalo světlé pozadí (žádný FOUC). Tři stavy: uložené
// "dark"/"light" vyhrává; bez volby se řídí nastavením telefonu (prefers-color-scheme).
const THEME_SCRIPT = `(function(){try{if(location.pathname.indexOf('/zazemi')!==0)return;var v=localStorage.getItem('marena_theme');var dark=v==='dark'||(v!=='light'&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(dark)document.documentElement.classList.add('dark');}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs">
      {/* Používáme systémový font (SF Pro / Segoe UI / Roboto) — žádné externí načítání. */}
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <ThirdPartyAnalytics />
      </head>
      <body>
        <StoreProvider>
          <AnalyticsTracker />
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
