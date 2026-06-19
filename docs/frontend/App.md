# `frontend/src/App.tsx` — Root component

## Lokasi file asli
`frontend/src/App.tsx`

## Tujuan / peran file ini
Wrapper paling luar: `AppProvider` (context global) → `BrowserRouter` → routes + 2 komponen overlay (banner install PWA & banner update SW).

## Penjelasan
```tsx
<AppProvider>
  <Router>
    <AppRoutes />
    <InstallBanner />
    <PwaUpdater />
  </Router>
</AppProvider>
```
- **`AppProvider`** punya state sederhana `appName` (lihat `context/AppContext.md`). Dipakai di `HomePage` untuk tampilkan nama brand.
- **`Router`** = `BrowserRouter` dari react-router-dom v7 (pakai History API, butuh fallback `try_files` di nginx — lihat `frontend/nginx.conf`).
- **`InstallBanner`** & **`PwaUpdater`** dipasang sekali di root supaya muncul di halaman manapun.

## Dependensi
- `./context/AppContext`, `./routes/AppRoutes`
- `./components/ui/InstallBanner`, `./components/ui/PwaUpdater`
- **Dipanggil oleh**: `main.tsx`.

## Hal yang perlu diperhatikan
- Tidak ada auth state global di context — autentikasi dibaca on-the-fly dari `localStorage` oleh komponen yang butuh (`getRoleFromToken`). Sederhana tapi tidak reaktif: kalau token expired di middle of session, komponen lain tidak otomatis re-render — tergantung 401 interceptor di `api.ts`.
