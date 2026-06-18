import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { requestFcmToken } from "../lib/fcm";
import api from "../lib/api";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      localStorage.setItem("access_token", token);
      window.history.replaceState({}, document.title, window.location.pathname);

      requestFcmToken().then((fcmToken) => {
        if (fcmToken) {
          const prev = localStorage.getItem('fcm_token');
          if (fcmToken !== prev) {
            localStorage.setItem('fcm_token', fcmToken);
            api.post('/auth/fcm-token', {
              token: fcmToken,
              device_type: 'web',
              device_name: navigator.userAgent.slice(0, 255),
            }).catch((err) => console.error('[FCM] Register after Google login failed:', err));
          }
        }
      });

      navigate("/home", { replace: true });
    } else {
      navigate("/login", { replace: true });
    }
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p>Memproses autentikasi...</p>
      </div>
    </div>
  );
}
