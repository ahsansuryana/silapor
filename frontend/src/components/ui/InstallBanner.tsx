import { useState, useEffect } from "react";
import { getDeferredPrompt, clearDeferredPrompt, promptInstall } from "../../lib/pwa";
import { X } from "lucide-react";

export default function InstallBanner() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(() => sessionStorage.getItem("pwa-dismissed") === "true");

  useEffect(() => {
    const check = () => {
      if (!dismissed && getDeferredPrompt()) {
        setShow(true);
      }
    };
    check();
    window.addEventListener("beforeinstallprompt", check);
    return () => window.removeEventListener("beforeinstallprompt", check);
  }, [dismissed]);

  if (!show) return null;

  const handleInstall = async () => {
    const ok = await promptInstall();
    if (ok) {
      setShow(false);
      clearDeferredPrompt();
    }
  };

  const handleDismiss = () => {
    setShow(false);
    setDismissed(true);
    sessionStorage.setItem("pwa-dismissed", "true");
  };

  return (
    <div className="fixed bottom-24 left-4 right-4 z-50 bg-surface-container-lowest border border-outline-variant/10 rounded-2xl p-4 shadow-xl flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-headline font-bold text-lg">
        S
      </div>
      <div className="flex-1">
        <p className="font-headline font-bold text-sm text-on-surface">Install SILAPOR</p>
        <p className="text-xs text-on-surface-variant">Pasang di layar utama agar mudah diakses</p>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={handleInstall} className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl">
          Install
        </button>
        <button onClick={handleDismiss} className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low rounded-lg">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
