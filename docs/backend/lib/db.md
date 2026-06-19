# `backend/src/lib/db.ts` — Pool koneksi PostgreSQL

## Lokasi file asli
`backend/src/lib/db.ts`

## Tujuan / peran file ini
Bikin satu instance `pg.Pool` global yang dipakai semua model untuk query. Biar tiap query tidak buka koneksi baru ke Postgres (mahal), kita pakai connection pool.

## Penjelasan per bagian

```ts
const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || "admin",
  password: process.env.DB_PASSWORD || "admin123",
  database: process.env.DB_NAME || "silapor_db",
});
```
Pool baca konfigurasi dari env. Default `admin/admin123` cuma untuk fallback dev — **jangan dipakai di production** (tapi yang penting `.env` di-set).

```ts
pool.on("connect", () => console.log("✅ PostgreSQL connected"));
pool.on("error", (err) => console.error("❌ PostgreSQL error:", err));
```
Listener untuk debug: tiap kali pool acquire connection baru atau dapat error idle, di-log.

## Dependensi
- Library `pg`
- **Dipakai oleh**: semua model (`UsersModel`, `ReportsModel`, dll) dan beberapa controller/route lewat `require("../lib/db").default`.

## Alur data
```
Model.query() → pool.query() → connection pool → Postgres (container `silapor_db`) → rows
```

## Hal yang perlu diperhatikan
- Tidak ada konfigurasi `max` (default 10) — kalau request banyak bareng, query bisa antri.
- Default password di-hardcode `admin123` — jangan andalkan default, isi env-nya.
- File ini juga `dotenv.config()` sendiri (selain di `index.ts`) supaya kalau model di-import duluan (mis. dari script CLI), env tetap ke-load.
