// Import Workbox from the CDN
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.3/workbox-sw.js');

// Import Firebase SDK and config
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');
importScripts('/firebase-messaging-sw.js');

if (workbox) {
  console.log('[Service Worker] Workbox is loaded.');
  workbox.precaching.precacheAndRoute(self.__WB_MANIFEST || []);
} else {
  console.log('[Service Worker] Workbox did not load.');
}

// ---------------------
// Lifecycle Events
// ---------------------

self.addEventListener('install', event => {
  console.log('[Custom Worker] Install event fired.');
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', event => {
  console.log('[Custom Worker] Activate event fired.');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== 'precache-v1' && cacheName !== 'runtime-cache') {
            console.log('[Custom Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// ---------------------
// Runtime Caching
// ---------------------

const RUNTIME = 'runtime-cache';

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(networkResponse => {
          caches.open(RUNTIME).then(cache => cache.put(request, networkResponse.clone()));
          return networkResponse;
        })
        .catch(() => caches.match('/offline.html'))
    );
    return;
  }
  
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
  
  event.respondWith(
    caches.match(request).then(cachedResponse => {
      if (cachedResponse) {
        event.waitUntil(
          fetch(request).then(networkResponse => {
            return caches.open(RUNTIME).then(cache => cache.put(request, networkResponse.clone()));
          })
        );
        return cachedResponse;
      }
      return fetch(request)
        .then(networkResponse => {
          return caches.open(RUNTIME).then(cache => {
            cache.put(request, networkResponse.clone());
            return networkResponse;
          });
        })
        .catch(error => {
          console.error('[Custom Worker] Fetch error:', error);
        });
    })
  );
});

// ---------------------
// FCM Token Refresh Functions
// ---------------------

async function getNewFCMToken() {
  try {
    const messaging = firebase.messaging();
    const newToken = await messaging.getToken();
    console.log('[Custom Worker] New FCM token obtained:', newToken);
    return newToken;
  } catch (error) {
    console.error('[Custom Worker] Error getting new FCM token:', error);
    throw error;
  }
}

async function updateTokenInDB(newToken) {
  try {
    const clients = await self.clients.matchAll();
    const client = clients[0];
    const deviceId = await client.storage.getItem('deviceId');

    if (!deviceId) {
      throw new Error('DeviceId not found in localStorage');
    }

    const response = await fetch('/api/notification/update-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ deviceId, token: newToken }),
    });

    if (!response.ok) {
      throw new Error('Failed to update token in database');
    }

    const result = await response.json();
    console.log('[Custom Worker] Token updated in database:', result);
    return result;
  } catch (error) {
    console.error('[Custom Worker] Error updating token in DB:', error);
    throw error;
  }
}

async function handleTokenRefresh() {
  try {
    const newToken = await getNewFCMToken();
    await updateTokenInDB(newToken);
    console.log('[Custom Worker] Token refresh completed successfully');
  } catch (error) {
    console.error('[Custom Worker] Error in token refresh:', error);
  }
}

// ---------------------
// Push Notifications & Silent Token Refresh
// ---------------------

self.addEventListener('push', event => {
  console.log('[Custom Worker] Push event received.');
  let data = {};
  try {
    data = event.data.json();
  } catch (error) {
    console.error('[Custom Worker] Error parsing push data:', error);
  }
  
  if (data.action && data.action === 'REFRESH_TOKEN') {
    console.log('[Custom Worker] Silent push for token refresh received.');
    event.waitUntil(handleTokenRefresh());
    return;
  }
  
  const title = data.title || 'New Notification';
  const options = {
    body: data.body || 'You have a new message.',
    icon: data.icon || '/icon.png',
    badge: data.badge || '/badge.png',
    data: {
      url: data.url || '/',
    },
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

// ---------------------
// Notification Click Handler
// ---------------------

self.addEventListener('notificationclick', event => {
  console.log('[Custom Worker] Notification click received.');
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

// ---------------------
// Background Sync Handler
// ---------------------

self.addEventListener('sync', event => {
  if (event.tag === 'refresh-token-sync') {
    console.log('[Custom Worker] Background sync for token refresh triggered.');
    event.waitUntil(handleTokenRefresh());
  }
});

// ---------------------
// Message Listener
// ---------------------

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('[Custom Worker] Skip waiting message received.');
    self.skipWaiting();
  }
});

console.log('[Custom Worker] custom-worker.js has been loaded.');