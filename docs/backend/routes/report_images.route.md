# `backend/src/routes/report_images.route.ts` — Route gambar laporan

## Lokasi file asli
`backend/src/routes/report_images.route.ts`

## Tujuan / peran file ini
Mount handler `report_images` di prefix `/api/reports`. Share prefix dengan `reports.route.ts` & `report_history.route.ts`.

## Daftar route
| Method | Path | Middleware | Handler |
|---|---|---|---|
| GET | `/:id/images` | `authenticate` | `getByReportId` |
| POST | `/:id/images` | `authenticate` | `upload` |
| DELETE | `/:id/images/:imageId` | `authenticate` | `remove` |

## Dependensi
- `../controllers/report_images.controller`
- **Di-mount oleh**: `index.ts` di `/api/reports`.

## Hal yang perlu diperhatikan
- ⚠ **Bug:** route POST tidak attach middleware multer. Handler-nya akses `req.file` yang akan `undefined`. Fix: tambahkan `upload.single("file")` middleware seperti di `reports.route.ts`.
- Handler `serveImage` (di controller) tidak terdaftar di sini — saat ini dead code. Kalau mau dipakai, daftarkan sebagai `GET /:id/images/:imageId/raw` atau semacamnya.
- Tidak ada cek owner: user A bisa upload/hapus gambar laporan user B asal tahu ID.
