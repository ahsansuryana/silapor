import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { initFcm } from "../lib/fcm";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      localStorage.setItem("access_token", token);
      window.history.replaceState({}, document.title, window.location.pathname);

      initFcm();
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
