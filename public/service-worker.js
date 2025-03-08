// service-worker.js

// Define cache names and assets to precache
const PRECACHE = 'precache-v1';
const RUNTIME = 'runtime-cache';

// List of core assets to precache (adjust to your needs)
const PRECACHE_URLS = [
  '/',                    // App shell
  '/index.html',
  '/offline.html',        // Offline fallback page
  '/styles.css',
  '/script.js',
  '/favicon.ico',
  '/icon.png'
];

// Installation: Precache critical assets
self.addEventListener('install', event => {
  console.log('[Service Worker] Install event');
  event.waitUntil(
    caches.open(PRECACHE).then(cache => {
      console.log('[Service Worker] Precaching assets');
      return cache.addAll(PRECACHE_URLS);
    })
    .then(() => self.skipWaiting())
  );
});

// Activation: Clean up old caches and take control immediately
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activate event');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== PRECACHE && cacheName !== RUNTIME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => self.clients.claim())
  );
});

// Fetch: Handle network requests with different caching strategies
self.addEventListener('fetch', event => {
  const request = event.request;
  
  // Use a network-first strategy for navigation (HTML pages)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(networkResponse => {
          // Optionally update runtime cache
          caches.open(RUNTIME).then(cache => cache.put(request, networkResponse.clone()));
          return networkResponse;
        })
        .catch(() => {
          // If network fails, serve the offline fallback
          return caches.match('/offline.html');
        })
    );
    return;
  }
  
  // For API calls, use stale-while-revalidate strategy
  if (request.url.includes('/api/')) {
    event.respondWith(
      caches.match(request).then(cachedResponse => {
        const networkFetch = fetch(request)
          .then(networkResponse => {
            caches.open(RUNTIME).then(cache => cache.put(request, networkResponse.clone()));
            return networkResponse;
          })
          .catch(() => cachedResponse);
        return cachedResponse || networkFetch;
      })
    );
    return;
  }
  
  // For all other requests, use cache-first strategy with background update
  event.respondWith(
    caches.match(request).then(cachedResponse => {
      if (cachedResponse) {
        // Update the cache in the background for future requests
        event.waitUntil(
          fetch(request).then(networkResponse => {
            return caches.open(RUNTIME).then(cache => cache.put(request, networkResponse.clone()));
          })
        );
        return cachedResponse;
      }
      // Otherwise, try network and cache the response
      return fetch(request)
        .then(networkResponse => {
          return caches.open(RUNTIME).then(cache => {
            cache.put(request, networkResponse.clone());
            return networkResponse;
          });
        })
        .catch(error => {
          console.error('[Service Worker] Fetch error:', error);
        });
    })
  );
});

// Push Notifications: Display notification when a push is received
self.addEventListener('push', event => {
  console.log('[Service Worker] Push event received');
  let data = {};
  if (event.data) {
    data = event.data.json();
  }
  const title = data.title || 'New Notification';
  const options = {
    body: data.body || 'You have a new message.',
    icon: data.icon || '/icon.png',
    badge: data.badge || '/badge.png',
    data: {
      url: data.url || '/' // URL to open on notification click
    }
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

// Notification Click: Handle notification clicks to open or focus a window
self.addEventListener('notificationclick', event => {
  console.log('[Service Worker] Notification click received');
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url === event.notification.data.url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data.url);
      }
    })
  );
});

// Background Sync: Process queued tasks when connectivity returns
self.addEventListener('sync', event => {
  if (event.tag === 'sync-queue') {
    console.log('[Service Worker] Background sync event triggered');
    event.waitUntil(processSyncQueue());
  }
});

// Example background sync function (replace with your own logic)
async function processSyncQueue() {
  // Retrieve any queued data (e.g., from IndexedDB) and send it to the server
  console.log('[Service Worker] Processing sync queue...');
  // For demonstration, we simply resolve immediately.
  return Promise.resolve();
}

// Message event: Listen for messages (e.g., to trigger skipWaiting)
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('[Service Worker] Skip waiting message received');
    self.skipWaiting();
  }
});
