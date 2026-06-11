let swRegistration: ServiceWorkerRegistration | null = null;
let updateCallback: (() => void) | null = null;

export function initSW() {
  if (!('serviceWorker' in navigator)) return;

  navigator.serviceWorker.register('/sw.js').then((reg) => {
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
  }).catch((err) => {
    console.error('[SW] Registration failed:', err);
  });
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
