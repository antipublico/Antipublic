// Service Worker for mobile-optimized performance
const CACHE_NAME = 'antipublic-v1.0.1';
const STATIC_CACHE_URLS = [
  '/',
  '/index.html',
  '/static/js/main.js',
  '/static/css/main.css',
  '/presage.svg'
];

// Audio lazy-loaded on demand, cache first 2 tracks for better UX
const PRIORITY_AUDIO_CACHE = [
  '/audio1.mp3',
  '/audio2.mp3'
];

// All audio files for lazy caching
const ALL_AUDIO_FILES = [
  '/audio1.mp3', '/audio2.mp3', '/audio3.mp3', 
  '/audio4.mp3', '/audio5.mp3', '/audio6.mp3',
  '/audio7.mp3', '/audio8.mp3', '/audio9.mp3'
];

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
  if (ALL_AUDIO_FILES.some(audioUrl => url.pathname === audioUrl)) {
    event.respondWith(
      caches.match(request)
        .then(response => {
          if (response) {
            return response;
          }
          // Cache audio files on first request, with range request support for mobile
          return fetch(request)
            .then(response => {
              // Only cache successful responses
              if (response.status === 200) {
                const responseClone = response.clone();
                caches.open(CACHE_NAME)
                  .then(cache => cache.put(request, responseClone))
                  .catch(() => {}); // Ignore cache errors
              }
              return response;
            })
            .catch(() => {
              // Return empty response for offline scenarios
              return new Response('', { status: 404 });
            });
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
          // Return cached version or fetch from network
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
