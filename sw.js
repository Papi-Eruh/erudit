const CACHE_NAME = 'erudit-v1';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './bus.js',
  './db.js',
  './music.js',
  './quiz.js',
  './theme.js',
  './manifest.json',
  'https://cdn.jsdelivr.net/npm/beercss@4.0.16/dist/cdn/beer.min.css',
  'https://cdn.jsdelivr.net/npm/beercss@4.0.16/dist/cdn/beer.min.js',
  'https://cdn.jsdelivr.net/npm/material-dynamic-colors@1.1.4/dist/cdn/material-dynamic-colors.min.js',
  'https://unpkg.com/@rive-app/canvas',
  './assets/icons/app-icon.svg',
  './assets/icons/192.png',
  './assets/icons/512.png',
  './assets/icons/theme.svg',
  './assets/icons/collection.svg',
  './assets/icons/chest.svg',
  './assets/themes/japan-icon.svg',
  './assets/themes/egypt-icon.svg',
  './assets/musics/home.mp3',
  './assets/animations/boat_front.riv',
  './assets/animations/pirates.riv',
  './assets/animations/progress_bar.riv',
  './assets/themes/egypt.riv',
  './assets/themes/japan.riv'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
