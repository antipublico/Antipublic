// Service Worker for mobile-optimized performance
const CACHE_NAME = 'antipublic-v1.0.1';
const STATIC_CACHE_URLS = [
  './',
  './index.html',
  './static/js/main.cd135f96.js',
  './static/css/main.a46b3db5.css',
  './presage.svg'
];

const AUDIO_FILES = [
  'audio1.mp3', 'audio2.mp3', 'audio3.mp3',
  'audio4.mp3', 'audio5.mp3', 'audio6.mp3',
  'audio7.mp3', 'audio8.mp3', 'audio9.mp3',
  'audio10.mp3', 'audio11.mp3', 'audio12.mp3'
];

const isAudioRequest = (pathname) => AUDIO_FILES.some((fileName) => pathname.endsWith('/' + fileName));

// Install event - cache static assets immediately
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_CACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle audio files with mobile-optimized caching strategy
  if (isAudioRequest(url.pathname)) {
    event.respondWith(
      caches.match(request)
        .then(response => {
          if (response) {
            return response;
          }

          return fetch(request)
            .then(response => {
              if (response.status === 200) {
                const responseClone = response.clone();
                caches.open(CACHE_NAME)
                  .then(cache => cache.put(request, responseClone))
                  .catch(() => {});
              }
              return response;
            })
            .catch(() => new Response('', { status: 404 }));
        })
    );
    return;
  }

  // Handle other static assets
  if (request.destination === 'image' ||
      request.destination === 'script' ||
      request.destination === 'style' ||
      url.pathname.endsWith('.svg')) {
    event.respondWith(
      caches.match(request)
        .then(response => {
          return response || fetch(request)
            .then(response => {
              const responseClone = response.clone();
              caches.open(CACHE_NAME)
                .then(cache => cache.put(request, responseClone));
              return response;
            });
        })
        .catch(() => {
          // Fallback for offline scenario
        })
    );
  }
});

// Message handling for cache updates
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

