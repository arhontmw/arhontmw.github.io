const CACHE_NAME = 'metronome-v1.0.0';
const ASSETS = [
  './',
  './index.html',
  './src/scripts/app.js',
  './src/app.css',
  './manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
