# `backend/src/routes/auth.route.ts` — Route auth + login rate limiter

## Lokasi file asli
`backend/src/routes/auth.route.ts`

## Tujuan / peran file ini
Mount handler-handler auth controller di bawah `/api/auth/*`. Plus implementasi rate limiter sederhana untuk endpoint login.

## Rate limiter
```ts
const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const loginLimiter = (req, res, next) => {
  const ip = req.ip || req.connection?.remoteAddress || 'unknown';
  const now = Date.now();
  const entry = loginAttempts.get(ip);
  if (entry && now < entry.resetAt) {
    if (entry.count >= 10) return res.status(429).json({...});
  } else {
    loginAttempts.set(ip, { count: 0, resetAt: now + 60000 });
  }
  (req as any).rateLimitIp = ip;
  (req as any).rateLimitStore = loginAttempts;
  next();
};
```
- **Window 60 detik, max 10 attempts per IP**.
- Middleware ini cuma _baca_ dan attach `rateLimitIp` + `rateLimitStore` ke request — yang **menambah counter** adalah controller `login` setelah `bcrypt.compare` gagal. Sukses → counter di-reset.
- In-memory; tidak persist; tidak share antar instance.

> ⚠️ Catatan: `req.ip` butuh Express `trust proxy` di-set kalau ada di balik reverse proxy (nginx). Kalau tidak, semua request kelihatan dari satu IP (loopback) → satu IP menghabiskan quota untuk semua.

## Daftar route
| Method | Path | Middleware | Handler |
|---|---|---|---|
| POST | `/register` | — | `register` |
| POST | `/register/staff` | `authenticate, requireAdmin` | `registerStaff` |
| POST | `/register/admin` | — ⚠ | `registerAdmin` |
| POST | `/update-role` | — ⚠ | `updateRole` |
| POST | `/login` | `loginLimiter` | `login` |
| GET | `/google/redirect` | — | `googleRedirect` |
| GET | `/google/callback` | — | `googleCallback` |
| POST | `/refresh` | — | `refresh` (baca cookie) |
| PUT | `/profile` | `authenticate` | `updateProfile` |
| POST | `/logout` | `authenticate` | `logout` |
| POST | `/fcm-token` | `authenticate` | `registerFcmToken` |
| DELETE | `/fcm-token` | `authenticate` | `deleteFcmToken` |

## Dependensi
- `../controllers/auth.controller`
- `../middlewares/auth.middleware`
- **Di-mount oleh**: `index.ts` di prefix `/api/auth`.

## Hal yang perlu diperhatikan
- ⚠ Endpoint `/register/admin` dan `/update-role` tanpa middleware auth. **Bahaya production.**
- Rate limiter bisa di-bypass dengan ganti IP (proxy/VPN). Defense in depth: tambah captcha atau penalty per akun.
