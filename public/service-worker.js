const CACHE_NAME = 'disney-countdown-cache-v2';
const OFFLINE_URLS = [
  './',
  'index.html',
  'manifest.json',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'background-castle.jpg',
  'background-castle.png',
  'background-castle-vertical.jpg',
  'background-castle-vertical.png',
  'confetti.png'
];
const ASSET_PATTERN = /"(assets\/[^"]+\.(?:js|css))"/g;

const toAbsoluteUrl = (path) => new URL(path, self.registration.scope).toString();

const safeCacheAdd = async (cache, url) => {
  try {
    await cache.add(url);
  } catch (error) {
    console.warn('[service-worker] Skipping cache for', url, error);
  }
};

const cacheOfflineAssets = async () => {
  const cache = await caches.open(CACHE_NAME);
  await Promise.all(OFFLINE_URLS.map((path) => safeCacheAdd(cache, toAbsoluteUrl(path))));

  try {
    const indexUrl = toAbsoluteUrl('index.html');
    const indexResponse = await fetch(indexUrl);
    await cache.put(indexUrl, indexResponse.clone());
    const html = await indexResponse.text();
    const bundleUrls = Array.from(html.matchAll(ASSET_PATTERN), (match) => toAbsoluteUrl(match[1]));
    const uniqueBundleUrls = [...new Set(bundleUrls)];
    await Promise.all(uniqueBundleUrls.map((url) => safeCacheAdd(cache, url)));
  } catch (error) {
    console.warn('[service-worker] Unable to precache bundle assets', error);
  }
};

self.addEventListener('install', (event) => {
  event.waitUntil(cacheOfflineAssets().then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
          return undefined;
        })
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const isNavigation = event.request.mode === 'navigate';

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request)
        .then((response) => {
          if (response.ok && new URL(event.request.url).origin === self.location.origin) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(async () => {
          if (isNavigation) {
            const fallback = await caches.match(toAbsoluteUrl('index.html'));
            if (fallback) {
              return fallback;
            }
          }

          return Response.error();
        });
    })
  );
});
