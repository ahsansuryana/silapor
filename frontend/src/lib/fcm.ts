import { getToken, onMessage } from 'firebase/messaging';
import { messaging } from './firebase';
import api from './api';

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;
const LS_KEY = 'fcm_token';

export async function requestFcmToken(): Promise<string | null> {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.warn('[FCM] Notification permission denied');
      return null;
    }

    const token = await getToken(messaging, { vapidKey: VAPID_KEY });
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
    await api.post('/auth/fcm-token', { token, device_type: 'web' });
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

  const token = await requestFcmToken();
  if (token) {
    const prev = getStoredFcmToken();
    if (token !== prev) {
      await registerFcmToken(token);
    }
  }

  listenForForegroundMessages();
}

export function listenForForegroundMessages() {
  onMessage(messaging, (payload) => {
    window.dispatchEvent(new CustomEvent('fcm-message', { detail: payload }));
  });
}
