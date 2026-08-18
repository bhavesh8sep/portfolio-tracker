// Minimal service worker. Its only job is to exist (Chrome requires an
// active service worker before it will offer "Install app"), and to let
// the tracker keep working if you're offline. It does NOT touch your
// data — that all lives in localStorage on the device.
const CACHE = 'portfolio-tracker-v1';
const ASSET = './index.html';

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.add(ASSET))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request)
      .then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(cache => cache.put(event.request, copy));
        return res;
      })
      .catch(() => caches.match(event.request))
  );
});
