# `frontend/src/lib/api.ts` — Axios instance + auto refresh token

## Lokasi file asli
`frontend/src/lib/api.ts`

## Tujuan / peran file ini
Bikin satu axios instance global. Tambahkan dua interceptor: **request** (pasang Authorization header otomatis) dan **response** (kalau 401/403 → coba refresh token → retry request asli).

## Penjelasan per bagian

### Base config
```ts
const api = axios.create({
  baseURL: (import.meta.env.VITE_API_BACKEND_URL || "http://localhost:3000") + "/api",
  withCredentials: true,
});
```
- `baseURL` di-set dari env saat build (Vite ganti placeholder ke string konstan). Dev fallback ke localhost.
- **`withCredentials: true`** krusial: tanpa ini, browser tidak kirim cookie `refresh_token` saat hit `/api/auth/refresh`. Backend juga perlu kirim `Access-Control-Allow-Credentials: true` (dia melakukannya — lihat `backend/src/index.ts`).

### Request interceptor — auto Authorization
```ts
const token = localStorage.getItem("access_token");
if (token) config.headers.Authorization = `Bearer ${token}`;
```
Tiap request otomatis bawa token kalau ada. Tidak perlu set header manual di tiap call.

### Response interceptor — auto refresh
```ts
if ((error.response?.status === 401 || error.response?.status === 403)
    && !originalRequest._retry) {
  originalRequest._retry = true;
  // hit /api/auth/refresh
  // kalau sukses → simpan access_token baru → retry originalRequest
  // kalau gagal → clear access_token → redirect /login
}
```
Flag `_retry` mencegah infinite loop kalau refresh juga 401.

> ⚠️ Catatan race condition: kalau di waktu yang sama ada 5 request bareng yang semuanya kena 401, lima-limanya bakal hit `/refresh` paralel. Tidak fatal (backend hanya validasi cookie), tapi boros. Solusi: queue request kedua dst sampai refresh pertama selesai. Untuk MVP, biarin.

> ⚠️ Backend kirim **401 saat token tidak ada** dan **403 saat token invalid/expired**. Interceptor handle keduanya — tapi ini juga berarti API endpoint lain yang return 403 untuk "akses ditolak" (mis. mahasiswa hit endpoint admin) juga akan trigger refresh+retry sia-sia. Berfungsi tapi tidak ideal.

## Dependensi
- `axios`
- Env: `VITE_API_BACKEND_URL`
- **Dipakai oleh**: semua page yang fetch data + `lib/fcm.ts`.

## Hal yang perlu diperhatikan
- Token di-`localStorage` → vulnerable XSS. Trade-off untuk SPA simple. Mitigasi: refresh token tetap di httpOnly cookie (server-side).
- Tidak ada parsing error message terpusat — tiap page handle error sendiri.
