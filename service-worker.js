const CACHE_NAME = 'metronome-v1.2.0';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/service-worker.js',
  // icons
  '/src/icons/android-chrome-192x192.png',
  '/src/icons/android-chrome-512x512.png',
  '/src/icons/apple-touch-icon.png',
  '/src/icons/favicon-16x16.png',
  '/src/icons/favicon-32x32.png',
  '/src/icons/favicon.ico',
  // styles
  '/src/styles/app.css',
  '/src/styles/bottomsheet.css',
  '/src/styles/bpm-visualizer.css',
  '/src/styles/colors.css',
  '/src/styles/play.css',
  '/src/styles/settings.css',
  // scripts
  '/src/scripts/app.js',
  '/src/scripts/bottomsheet-manager.js',
  '/src/scripts/bpm-visualizer.js',
  '/src/scripts/constants.js',
  '/src/scripts/dom.js',
  '/src/scripts/metronome.js',
  '/src/scripts/player.js',
  '/src/scripts/settings.js',
  '/src/scripts/utils.js',
  '/src/scripts/vibration.js',
  '/src/scripts/wake-lock.js'
];

self.addEventListener('install', event => {
  // activate SW immediately without waiting all PWA tabs closed
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', (event) => {
  // remove old caches on activation
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => key !== CACHE_NAME && caches.delete(key))
      )
    )
  );

  // take all clients under control
  clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
