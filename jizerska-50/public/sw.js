/* Service worker pro offline režim Jizerská 50.
   Strategie: navigace = network-first s fallbackem na uloženou úvodní stránku,
   ostatní GET požadavky (JS/CSS/obrázky) = stale-while-revalidate.
   Po první online návštěvě appka funguje plně offline. */

const CACHE = "j50-cache-v1";
// Kořen podle umístění SW (funguje i při hostování v podsložce).
const ROOT = new Request("./", { cache: "reload" });

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.add(ROOT))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // cizí domény neřešíme

  // Navigace (otevření/refresh stránky): zkus síť, jinak vrať uloženou stránku.
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() =>
          caches.match(req).then((r) => r || caches.match(new URL("./", self.location).href))
        )
    );
    return;
  }

  // Ostatní zdroje: rychle z cache, na pozadí aktualizuj.
  event.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req)
        .then((res) => {
          if (res && res.status === 200 && res.type === "basic") {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
