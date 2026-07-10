// Cloud Couriers service worker — network-first with cache fallback.
// Fresh files whenever online (no stale-module version skew), full offline play otherwise.
const VERSION = 'cloud-couriers-v5';
const CORE = [
  '.', 'index.html',
  'css/font.css', 'css/styles.css',
  'js/main.js', 'js/ui.js', 'js/game.js', 'js/engine.js', 'js/levels.js',
  'js/solver.js', 'js/icons.js', 'js/svg.js', 'js/data.js', 'js/save.js',
  'js/audio.js', 'js/dom.js', 'js/ambient.js',
  'js/i18n.js', 'js/postmap.js', 'js/roomart.js', 'js/characters.js', 'js/music.js',
  'manifest.webmanifest', 'icons/icon.svg', 'icons/icon-192.png', 'icons/icon-512.png',
  // audio/*.mp3 are runtime-cached on first play (not precached — keeps install light)
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const copy = res.clone();
        caches.open(VERSION).then((c) => c.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
