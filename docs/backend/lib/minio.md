# `backend/src/lib/minio.ts` — Setup MinIO client (internal & public)

## Lokasi file asli
`backend/src/lib/minio.ts`

## Tujuan / peran file ini
Bikin dua MinIO client:
1. **`minioClient`** — untuk komunikasi backend ↔ MinIO di dalam Docker network (pakai hostname `minio:9000`, tanpa SSL).
2. **`publicClient`** — untuk **generate presigned URL** yang akan diakses browser user. Pakai endpoint publik (`s3-silapor.nuxantara.site:443`, SSL).

## Penjelasan per bagian

```ts
const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: Number(process.env.MINIO_PORT) || 9000,
  useSSL: false,
  ...
});
```
Ini "internal client". Backend pakai ini untuk `putObject` / `removeObject` / `getObject` — semua operasi storage langsung. Jalan di network Docker.

```ts
const publicEndpoint = process.env.MINIO_PUBLIC_ENDPOINT;
const publicClient = publicEndpoint ? new Client({...}) : minioClient;
```
Kalau env `MINIO_PUBLIC_ENDPOINT` di-set (di prod = `s3-silapor.nuxantara.site`), kita bikin client kedua. Kenapa? Karena **presigned URL** yang dibikin oleh client mencakup hostname endpoint-nya. Kalau pakai `minioClient`, URL-nya bakal `http://minio:9000/...` yang tidak bisa diakses browser publik. Kalau pakai `publicClient`, URL-nya `https://s3-silapor.nuxantara.site/...` — bisa.

Kalau env publik tidak di-set (dev lokal), fallback ke `minioClient`.

```ts
export const BUCKET_NAME = process.env.MINIO_BUCKET || 'silapor';
```
Nama bucket default `silapor`. Semua file laporan di-upload ke sini.

## Dependensi
- Library `minio`
- Env vars: `MINIO_ENDPOINT`, `MINIO_PORT`, `MINIO_USER`, `MINIO_PASSWORD`, `MINIO_BUCKET`, `MINIO_PUBLIC_ENDPOINT`, `MINIO_PUBLIC_PORT`, `MINIO_PUBLIC_SSL`.
- **Dipakai oleh**: `lib/minio-upload.ts`, `controllers/report_images.controller.ts`.

## Hal yang perlu diperhatikan
- Bucket `silapor` harus sudah ada. Tidak ada auto-create di kode ini. Kalau bucket belum dibuat, upload bakal fail.
- Tidak ada rotasi credential.
- Endpoint publik di-hardcode di `docker-compose.yml` (`s3-silapor.nuxantara.site`) — kalau pindah server, edit di sana.
