import { useEffect, useState } from "react";
import { RefreshCw, X } from "lucide-react";
import { onSWUpdate, applyUpdate } from "../../lib/sw-register";

export default function PwaUpdater() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    onSWUpdate(() => setShow(true));
  }, []);

  if (!show) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 max-w-md mx-auto animate-slide-up">
      <div className="bg-on-surface text-surface px-5 py-4 rounded-2xl shadow-2xl flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <RefreshCw className="w-5 h-5 shrink-0 animate-spin-slow" />
          <p className="text-sm font-bold truncate">Update tersedia</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => { applyUpdate(); }}
            className="px-4 py-1.5 bg-white/20 rounded-xl text-xs font-bold hover:bg-white/30 transition-colors"
          >
            Update
          </button>
          <button
            onClick={() => setShow(false)}
            className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
