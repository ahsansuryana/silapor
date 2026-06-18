import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import api from "../lib/api";
import { getUserFromToken } from "../lib/jwt";


export default function Login() {
  const navigate = useNavigate();
  const [nim, setNim] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await api.post("/auth/login", {
        nim,
        password,
      });

      localStorage.setItem("access_token", data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect based on role
      if (data.user.role === "ADMIN") {
        navigate("/admin", { replace: true });
      } else if (data.user.role === "STAFF") {
        navigate("/staff", { replace: true });
      } else {
        navigate("/home", { replace: true });
      }
    } catch (err: unknown) {
      console.log("Login error:", { err });
      let errorMessage = "Login gagal";
      if (err && typeof err === "object" && "response" in err) {
        const axiosErr = err as any;
        if (axiosErr.response?.data?.message) {
          errorMessage = axiosErr.response.data.message;
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-surface">
      {/* Left Panel - Hero */}
      <div className="hidden md:flex md:w-1/2 relative overflow-hidden bg-primary items-center justify-center p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-container opacity-90"></div>
        <div
          className="absolute inset-0 opacity-20 pointer-events-none bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1541339907198-e08756ebafe3?q=80&w=2070&auto=format&fit=crop')",
          }}
        ></div>

        <div className="relative z-10 max-w-md text-white">
          <h1 className="font-headline font-extrabold text-5xl tracking-tight mb-6">
            SILAPOR
          </h1>
          <p className="font-body text-xl opacity-90 leading-relaxed mb-8">
            Your dedicated concierge for campus infrastructure maintenance and
            reporting.
          </p>

          <div className="space-y-6">
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-xl">
              <div className="bg-primary-fixed/20 p-2 rounded-lg">
                <span className="material-symbols-outlined text-primary-fixed">
                  speed
                </span>
              </div>
              <div>
                <p className="font-headline font-semibold text-white">
                  Fast Response
                </p>
                <p className="text-sm text-white/70">
                  Reports processed in under 24 hours.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-xl">
              <div className="bg-primary-fixed/20 p-2 rounded-lg">
                <span className="material-symbols-outlined text-primary-fixed">
                  verified
                </span>
              </div>
              <div>
                <p className="font-headline font-semibold text-white">
                  Verified Status
                </p>
                <p className="text-sm text-white/70">
                  Real-time updates on your fix requests.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12">
        <div className="w-full max-w-[400px] space-y-8">
          <div className="text-center md:text-left space-y-2">
            <div className="md:hidden mb-6 flex justify-center">
              <span className="font-headline font-extrabold text-3xl tracking-tight text-primary">
                SILAPOR
              </span>
            </div>
            <h2 className="font-headline font-bold text-3xl text-on-surface tracking-tight">
              Student Login
            </h2>
            <p className="font-body text-on-surface-variant">
              Sign in to report campus facility issues.
            </p>
          </div>

          <div className="space-y-4">
            <a
              href={
                import.meta.env.VITE_API_BACKEND_URL +
                "/api/auth/google/redirect"
              }
              className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-surface-container-lowest border border-outline-variant/20 rounded-xl hover:bg-surface-container-low transition-all duration-200 group"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                ></path>
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                ></path>
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                ></path>
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
                  fill="#EA4335"
                ></path>
              </svg>
              <span className="font-label font-medium text-on-surface">
                Continue with Google
              </span>
            </a>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-outline-variant/20"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-surface px-2 text-on-surface-variant font-label tracking-widest">
                  Or login with email
                </span>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              {error && (
                <div className="p-3 bg-error/10 border border-error/30 rounded-xl">
                  <p className="font-body text-sm text-error">{error}</p>
                </div>
              )}

              <div className="space-y-1.5">
                <label
                  className="font-label text-sm font-semibold text-on-surface-variant ml-1"
                  htmlFor="email"
                >
                  NIM
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-on-surface-variant/40 group-focus-within:text-primary transition-colors" />
                  </div>
                  <input
                    className="block w-full pl-11 pr-4 py-3 bg-surface-container-lowest border-0 rounded-xl ring-1 ring-outline-variant/20 focus:ring-2 focus:ring-primary focus:bg-surface-bright transition-all outline-none font-body text-on-surface placeholder:text-on-surface-variant/40"
                    id="email"
                    placeholder="123456789"
                    type="text"
                    value={nim}
                    onChange={(e) => setNim(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center ml-1">
                  <label
                    className="font-label text-sm font-semibold text-on-surface-variant"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  {/* <Link
                    className="font-label text-xs font-semibold text-primary hover:underline"
                    to="#"
                  >
                    Forgot?
                  </Link> */}
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-on-surface-variant/40 group-focus-within:text-primary transition-colors" />
                  </div>
                  <input
                    className="block w-full pl-11 pr-11 py-3 bg-surface-container-lowest border-0 rounded-xl ring-1 ring-outline-variant/20 focus:ring-2 focus:ring-primary focus:bg-surface-bright transition-all outline-none font-body text-on-surface placeholder:text-on-surface-variant/40"
                    id="password"
                    placeholder="••••••••"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-on-surface-variant/40 hover:text-on-surface transition-colors"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* <div className="flex items-center gap-2 px-1">
                <input
                  className="w-4 h-4 rounded border-outline-variant/30 text-primary focus:ring-primary bg-surface-container-lowest"
                  id="remember"
                  type="checkbox"
                />
                <label
                  className="font-label text-xs text-on-surface-variant font-medium"
                  htmlFor="remember"
                >
                  Remember this device
                </label>
              </div> */}

              <button
                className="w-full py-4 bg-gradient-to-br from-primary to-primary-container text-white font-headline font-bold rounded-xl shadow-lg shadow-primary/10 hover:shadow-primary/20 hover:opacity-95 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                type="submit"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login to Dashboard"}
                {!loading && <ArrowRight className="w-5 h-5" />}
              </button>
            </form>
          </div>

          {/* <div className="pt-4 text-center">
            <p className="font-body text-sm text-on-surface-variant">
              Don't have an account?
              <Link
                className="font-semibold text-primary hover:underline ml-1"
                to="#"
              >
                Register Student ID
              </Link>
            </p>
          </div> */}

          {/* <div className="mt-12 flex justify-center gap-6 opacity-40">
            <span className="text-[10px] font-label font-bold tracking-widest uppercase">
              Privacy Policy
            </span>
            <span className="text-[10px] font-label font-bold tracking-widest uppercase">
              Terms of Service
            </span>
            <span className="text-[10px] font-label font-bold tracking-widest uppercase">
              Help Center
            </span>
          </div> */}
        </div>
      </div>
    </div>
  );
}
