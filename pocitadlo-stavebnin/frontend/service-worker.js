/* Jednoduchý service worker – cachuje "skořápku" appky, aby šla otevřít i offline. */
const CACHE = "stavebniny-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./manifest.json",
  "./icon.svg",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  // API požadavky nikdy necachujeme (potřebujeme čerstvá data z modelu).
  if (req.url.includes("/api/")) return;
  e.respondWith(
    caches.match(req).then((cached) => cached || fetch(req))
  );
});
