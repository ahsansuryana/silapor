# `backend/src/controllers/report_images.controller.ts` — Gambar laporan

## Lokasi file asli
`backend/src/controllers/report_images.controller.ts`

## Tujuan / peran file ini
Endpoint untuk: list gambar laporan, upload tambahan, hapus, dan **serve gambar langsung** (proxy MinIO).

## Penjelasan per handler

### `getByReportId(id)`
List gambar laporan + presigned URL fresh.

### `upload(id)` — POST gambar tambahan
```ts
const uploadMulter = multer({ storage: multer.memoryStorage() });
```
> ⚠️ Note: deklarasi `uploadMulter` di file ini **tidak dipakai** — route memang tidak attach middleware multer untuk endpoint upload. Akibatnya endpoint ini saat ini tidak benar-benar bisa terima file upload sampai middleware multer ditambah di route. **Bug / unfinished feature.**

Logikanya seharusnya: terima file → upload MinIO → simpan DB.

### `remove(imageId)`
Cari gambar di DB, hapus dari MinIO, hapus dari DB. Urutan ini penting: kalau DB dihapus dulu lalu MinIO error, file orphan.

### `serveImage(imageId)` — proxy MinIO
```ts
const stream = await minioClient.getObject(BUCKET_NAME, image.minio_object_key);
res.setHeader('Content-Type', mime);
res.setHeader('Cache-Control', 'public, max-age=86400');
stream.pipe(res);
```
Alternatif presigned URL: stream langsung dari backend. Berguna kalau frontend mau loading gambar tanpa expose endpoint MinIO. Detect mime dari ekstensi (jpg/png/webp).

> ⚠️ Catatan: `serveImage` tidak terdaftar di route file (`report_images.route.ts`). Berarti **handler ini tidak ter-expose** — dead code, atau route belum ditambah.

## Dependensi
- `ReportImagesModel`, `lib/minio-upload`, `lib/minio`, `multer`.
- **Dipanggil oleh**: `routes/report_images.route.ts`.

## Hal yang perlu diperhatikan
- Variable `uploadMulter` deklarasi tapi tidak dipakai → endpoint upload kemungkinan tidak fungsional.
- `serveImage` tidak terdaftar di router → tidak terpakai.
- Tidak ada cek "user X boleh upload/hapus gambar laporan Y?". Siapa saja yang authenticated bisa.
