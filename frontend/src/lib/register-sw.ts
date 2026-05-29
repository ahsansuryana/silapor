const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

export async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) {
    console.warn('[SW] Service Worker not supported');
    return null;
  }

  if (!VAPID_KEY) {
    console.warn('[SW] Firebase VAPID key not set, skipping SW registration');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
    console.log('[SW] Registered:', registration.scope);
    return registration;
  } catch (err) {
    console.error('[SW] Registration failed:', err);
    return null;
  }
}
