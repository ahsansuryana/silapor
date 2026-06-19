# `frontend/src/main.tsx` — Entry point React

## Lokasi file asli
`frontend/src/main.tsx`

## Tujuan / peran file ini
Bootstrap aplikasi React: mount `<App />` ke DOM, init PWA install handler, register service worker, lalu init Firebase Cloud Messaging.

## Penjelasan per bagian

```tsx
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```
React 19 + `createRoot`. `StrictMode` aktif → useEffect & komponen jalan dua kali di dev untuk deteksi side-effect tidak idempotent. Wajar di dev, hilang di production build.

```tsx
initPwaInstall();
initSW().then(() => {
  initFcm();
  listenForForegroundMessages();
});
```
Urutan penting:
1. `initPwaInstall()` — pasang listener `beforeinstallprompt` ASAP supaya event Chrome tidak hilang.
2. `initSW()` — daftarkan `/sw.js`. **Harus selesai dulu** karena FCM butuh service worker registration sebagai parameter.
3. `initFcm()` — minta permission notif + dapat token + register ke backend.
4. `listenForForegroundMessages()` — listen pesan FCM saat tab aktif (kalau tab background, service worker yang handle).

## Dependensi
- `./App` (root component)
- `./lib/fcm`, `./lib/pwa`, `./lib/sw-register`
- `./index.css` (Tailwind v4 entry)
- **Dimuat oleh**: `index.html` lewat `<script type="module" src="/src/main.tsx">`.

## Hal yang perlu diperhatikan
- `initFcm` di-call **tanpa await user login**. Token FCM tetap diminta, tapi register-nya skip kalau tidak ada `access_token` di localStorage (lihat `lib/fcm.ts`).
- Tidak ada error boundary di root. Crash di App = page kosong. Bisa tambah `<ErrorBoundary>`.
