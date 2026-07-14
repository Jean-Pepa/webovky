// TARS – service worker (PWA). Ukládá "skořápku" appky, aby se rychle načítala.
// Pozn.: funguje jen v bezpečném kontextu (localhost nebo https). Přes prosté
// http z mobilu se neregistruje – to nevadí, appka jede dál, jen bez cache.

const CACHE = "tars-v1";
const SHELL = [
  "/",
  "/index.html",
  "/styles.css",
  "/app.js",
  "/favicon.svg",
  "/manifest.webmanifest",
  "/icons/icon-192.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches
      .open(CACHE)
      .then((c) => c.addAll(SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  // jiná doména nebo ne-GET → nech být
  if (url.origin !== self.location.origin || e.request.method !== "GET") return;
  // API se NIKDY necachuje – vždy živě na server (poznámky, chat, paměť)
  if (url.pathname.startsWith("/api/")) return;

  // skořápka: nejdřív ze sítě (ať se projeví změny), při výpadku z cache
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(e.request).then((r) => r || caches.match("/index.html")))
  );
});
