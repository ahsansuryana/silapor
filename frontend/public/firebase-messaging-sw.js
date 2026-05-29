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
