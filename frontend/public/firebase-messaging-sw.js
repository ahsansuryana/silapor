importScripts('https://www.gstatic.com/firebasejs/11.6.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.6.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: '___FIREBASE_API_KEY___',
  authDomain: '___FIREBASE_AUTH_DOMAIN___',
  projectId: '___FIREBASE_PROJECT_ID___',
  storageBucket: '___FIREBASE_STORAGE_BUCKET___',
  messagingSenderId: '___FIREBASE_MESSAGING_SENDER_ID___',
  appId: '___FIREBASE_APP_ID___',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const { title, body } = payload.notification || {};
  const data = payload.data || {};

  self.registration.showNotification(title || 'SILAPOR', {
    body: body || '',
    icon: '/LOGO_SILAPOR.png',
    data: { url: data.url || '/notifications' },
    badge: '/LOGO_SILAPOR.png',
  });
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/notifications';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.postMessage({ type: 'FCM_CLICK', url });
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    }),
  );
});

// ─────────────────────────────────────────
// PWA - Cache static assets
// ─────────────────────────────────────────
const CACHE_NAME = 'silapor-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/LOGO_SILAPOR.png',
  '/vite.svg',
  '/icons/icon-192.svg',
  '/icons/icon-512.svg',
  '/icons/icon-192-maskable.svg',
  '/icons/icon-512-maskable.svg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }),
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)));
    }),
  );
  clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  if (event.request.url.includes('/api/')) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request).then((response) => {
        if (response.ok && response.type === 'basic') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      });
    }),
  );
});
