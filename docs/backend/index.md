# Backend — Entry Point (`src/index.ts`)

## Lokasi file asli
`backend/src/index.ts`

## Tujuan / peran file ini
Ini "pintu masuk" server Express. Tugasnya: load env, setup middleware global (CORS, body parser, logger), mount semua route di bawah prefix `/api/*`, dan jalankan server di port 3000.

## Penjelasan per bagian

### 1. Load environment variable
```ts
const isGlobal = process.env.IS_GLOBAL === "true";
const envFile = isGlobal ? ".env.global" : ".env";
dotenv.config({ path: path.resolve(process.cwd(), envFile) });
```
Project ini punya **dua file env**: `.env` (mode lokal) dan `.env.global` (mode "global" — entah testing tunnel, staging, dsb). Toggle pakai env variable `IS_GLOBAL=true`. Kenapa? Biar developer bisa cepat switch antara dev lokal vs deploy lewat tunnel tanpa edit file env tiap kali. Di production (lewat Docker) variabel di-inject dari `docker-compose.yml` jadi pemilihan file ini sebenarnya tidak terpakai.

### 2. CORS manual (bukan `cors` middleware)
```ts
const allowedOrigins = [...];
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    ...
  }
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});
```
Pakai whitelist origin (domain frontend + localhost dev). Penting: `Access-Control-Allow-Credentials: true` karena refresh token dikirim sebagai **httpOnly cookie**, dan browser hanya mau kirim cookie cross-origin kalau credentials = true. Preflight `OPTIONS` dijawab manual dengan 204.

> ⚠️ Catatan: package `cors` sudah diimport di `package.json` tapi tidak dipakai. Implementasi manual ini cukup, tapi rawan typo. Hati-hati kalau mau nambah origin baru.

### 3. cookieParser + body parser
```ts
app.use(cookieParser());
app.use(express.json({ limit: '1mb' }));
```
`cookieParser` dipakai supaya bisa baca `req.cookies.refresh_token`. Limit body 1MB cocok untuk JSON; **upload gambar laporan** pakai `multer` dengan limit terpisah 10MB (lihat `routes/reports.route.ts`).

### 4. Request/response logger
Middleware ini override `res.json` supaya tiap response yang berformat JSON otomatis di-log: method, URL, query, body request, status, body response, dan durasi.
Kenapa override `res.json`? Karena di Express tidak ada hook bawaan "after response sent". Trik ini dipakai supaya body response bisa ikut di-log.

> ⚠️ Catatan: **password user akan ikut ke-log** kalau lewat `/api/auth/login` karena body request di-log mentah. Untuk debug ok, untuk production sebaiknya redact field sensitif.

### 5. Mounting routes
```ts
app.use("/api/auth", authRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/reports", reportImagesRoutes);    // share prefix
app.use("/api/assignments", assignmentsRoutes);
app.use("/api/reports", reportHistoryRoutes);   // share prefix
app.use("/api/notifications", notificationsRoutes);
app.use("/api/staff-locations", staffLocationsRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/users", usersRoutes);
```
Note: `reports`, `reportImages`, dan `reportHistory` semuanya mount di `/api/reports`. Path lengkapnya diatur di file masing-masing (`/:id/images`, `/:id/history`). Kalau ada konflik route, urutan mount yang menentukan.

### 6. Listen
```ts
app.listen(PORT, "0.0.0.0", ...)
```
Bind ke `0.0.0.0` (bukan `127.0.0.1`) supaya container Docker bisa terima koneksi dari luar (lewat port forwarding).

## Dependensi
- **Diimport oleh**: ini entry point, tidak dipakai siapa-siapa.
- **Mengimport**: semua file di `routes/`, plus `cookie-parser`, `dotenv`, `express`.

## Alur request umum
```
Client → CORS check → cookieParser → JSON parser → Logger → Router → Controller → Model (DB) → Response
```

## Hal yang perlu diperhatikan
- Tidak ada error handler global. Kalau controller throw error tidak tertangkap, Express akan kirim default HTML stack trace — bocor info.
- Logger mencatat body request mentah; password & token ikut ter-log.
- Rate limiter cuma ada di route `/login` (lihat `auth.route.ts`), tidak ada throttling global.
