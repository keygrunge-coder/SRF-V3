const CACHE_NAME = 'srf-cache-v3';
const urlsToCache = [
  'index.html',
  'pengiriman.html',
  'scanretur.html',
  'uploadreturjnt.html',
  'uploadreturspx.html',
  'pengaturan.html',
  'style.css',
  'config.js',
  'tts.js',
  'index.js',
  'pengiriman.js',
  'scanretur.js',
  'uploadreturjnt.js',
  'uploadreturspx.js',
  'pengaturan.js',
  'manifest.json'
];

// Install Service Worker & Cache File
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch dari Cache jika offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});

// Update Cache yang lama
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
