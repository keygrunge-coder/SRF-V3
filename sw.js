const CACHE_NAME = 'srf-scanner-cache-v1';

// Daftar file yang akan disimpan dalam cache agar bisa diakses secara offline
const assets = [
  'index.html',
  'scanretur.html',
  'uploadjnt.html',
  'uploadspx.html',
  'css/style.css',
  'api/config.js',
  'js/uploadreturjnt.js',
  'js/uploadspx.js',
  'images/icon.png',
  'manifest.json',
  'https://unpkg.com/html5-qrcode'
];

// Event Install: Menyimpan semua aset ke cache
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(assets);
    })
  );
});

// Event Activate: Menghapus cache lama jika ada versi baru
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// Event Fetch: Mengambil data dari cache atau internet
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request);
    })
  );
});