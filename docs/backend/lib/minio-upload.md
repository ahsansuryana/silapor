# `backend/src/lib/minio-upload.ts` — Helper upload / delete / presigned URL

## Lokasi file asli
`backend/src/lib/minio-upload.ts`

## Tujuan / peran file ini
Tiga fungsi pembungkus operasi MinIO yang sering dipakai: upload buffer, hapus object, dan bikin URL temporary untuk akses publik.

## Penjelasan per bagian

### `uploadToMinIO(file, originalName)`
```ts
const ext = originalName.split('.').pop() || 'jpg';
const objectKey = `reports/${randomUUID()}.${ext}`;
await minioClient.putObject(BUCKET_NAME, objectKey, file);
return objectKey;
```
- Bikin key random pakai `crypto.randomUUID()` supaya tidak ada bentrokan & user tidak bisa nebak path.
- Folder logis `reports/` di dalam bucket.
- Yang disimpan ke database hanya `objectKey` (mis. `reports/abc-123.jpg`), bukan URL — supaya kalau endpoint MinIO pindah, data tidak perlu di-migrate.

### `deleteFromMinIO(objectKey)`
Hapus object dari MinIO. Dipanggil saat user/admin hapus gambar laporan.

### `getPresignedUrl(objectKey, expires = 3600)`
```ts
return publicClient.presignedGetObject(BUCKET_NAME, objectKey, expires);
```
- Pakai **`publicClient`** (lihat `minio.md`) supaya URL-nya bisa diakses browser.
- Default expire 1 jam. Tiap kali backend kirim list laporan ke frontend, semua URL gambar di-generate ulang (lihat `reports.controller.ts`).

## Dependensi
- `./minio` (untuk `minioClient`, `publicClient`, `BUCKET_NAME`)
- `crypto` (built-in Node)
- **Dipakai oleh**: `controllers/reports.controller.ts`, `controllers/report_images.controller.ts`.

## Alur upload gambar laporan
```
Frontend (multipart/form-data) → POST /api/reports
   → multer (memory storage) → file.buffer di memori
   → uploadToMinIO(buffer, name) → key disimpan ke tabel report_images
   → response: report + URL presigned (digenerate saat GET, bukan saat POST)
```

## Hal yang perlu diperhatikan
- File disimpan di **memory** dulu (multer.memoryStorage), bukan disk. Cocok untuk ukuran kecil-menengah (limit 10MB), tapi kalau banyak upload bareng bisa makan RAM.
- Tidak ada validasi konten file (cuma mime type di route). Bisa diakali kirim file non-gambar dengan `Content-Type: image/jpeg`.
- Presigned URL 1 jam — kalau user open page lalu tinggal 2 jam, image-nya broken. Re-fetch baru bisa.
