import { getToken, onMessage } from 'firebase/messaging';
import { messaging } from './firebase';
import api from './api';

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;
const LS_KEY = 'fcm_token';

function clearFcmDb(): Promise<void> {
  return new Promise((resolve) => {
    const names = ['firebase-messaging-database', 'firebase-installations-database'];
    let done = 0;
    for (const name of names) {
      const req = indexedDB.deleteDatabase(name);
      req.onsuccess = req.onerror = req.onblocked = () => {
        done++;
        if (done === names.length) resolve();
      };
    }
    if (!names.length) resolve();
  });
}

export async function requestFcmToken(forceClean = false): Promise<string | null> {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.warn('[FCM] Notification permission denied');
      return null;
    }

    const swReg = await navigator.serviceWorker.ready.catch(() => undefined) as ServiceWorkerRegistration | undefined;
    if (!swReg) {
      console.warn('[FCM] Service worker not ready');
      return null;
    }

    if (forceClean) {
      await clearFcmDb();
    }

    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: swReg,
    });
    if (!token) {
      console.warn('[FCM] No token returned');
      return null;
    }

    const prev = localStorage.getItem(LS_KEY);
    if (token !== prev) {
      localStorage.setItem(LS_KEY, token);
    }

    return token;
  } catch (err) {
    console.error('[FCM] Failed to get token:', err);
    return null;
  }
}

export function getStoredFcmToken(): string | null {
  return localStorage.getItem(LS_KEY);
}

export async function registerFcmToken(token: string) {
  try {
    await api.post('/auth/fcm-token', {
      token,
      device_type: 'web',
      device_name: navigator.userAgent.slice(0, 255),
    });
  } catch (err) {
    console.error('[FCM] Failed to register token:', err);
  }
}

export async function unregisterFcmToken(token: string) {
  try {
    await api.delete('/auth/fcm-token', { data: { token } });
  } catch (err) {
    console.error('[FCM] Failed to unregister token:', err);
  }
}

export async function initFcm() {
  const accessToken = localStorage.getItem('access_token');
  if (!accessToken) return;

  let token = await requestFcmToken();
  if (!token) {
    token = await requestFcmToken(true);
  }
  if (token) {
    const prev = getStoredFcmToken();
    if (token !== prev) {
      await registerFcmToken(token);
    }
  }
}

export function listenForForegroundMessages() {
  try {
    onMessage(messaging, (payload) => {
      window.dispatchEvent(new CustomEvent('fcm-message', { detail: payload }));
    });
  } catch (err) {
    console.error('[FCM] Failed to listen for foreground messages:', err);
  }
}
