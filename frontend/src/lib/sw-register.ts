let swRegistration: ServiceWorkerRegistration | null = null;
let updateCallback: (() => void) | null = null;

export async function initSW() {
  if (!('serviceWorker' in navigator)) return null;

  try {
    const reg = await navigator.serviceWorker.register('/sw.js');
    swRegistration = reg;

    if (reg.waiting && navigator.serviceWorker.controller) {
      updateCallback?.();
    }

    reg.addEventListener('updatefound', () => {
      const newSW = reg.installing;
      if (!newSW) return;

      newSW.addEventListener('statechange', () => {
        if (newSW.state === 'installed' && navigator.serviceWorker.controller) {
          updateCallback?.();
        }
      });
    });

    return reg;
  } catch (err) {
    console.error('[SW] Registration failed:', err);
    return null;
  }
}

export function onSWUpdate(cb: () => void) {
  updateCallback = cb;
  if (swRegistration?.waiting && navigator.serviceWorker.controller) {
    cb();
  }
}

export function applyUpdate() {
  if (!swRegistration?.waiting) return;
  swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
  window.location.reload();
}
