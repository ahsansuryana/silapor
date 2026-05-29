let deferredPrompt: Event | null = null;

export function initPwaInstall() {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
  });

  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
  });
}

export function getDeferredPrompt(): Event | null {
  return deferredPrompt;
}

export function clearDeferredPrompt() {
  deferredPrompt = null;
}

export async function promptInstall(): Promise<boolean> {
  if (!deferredPrompt) return false;
  (deferredPrompt as any).prompt();
  const result = await (deferredPrompt as any).userChoice;
  deferredPrompt = null;
  return result.outcome === "accepted";
}
