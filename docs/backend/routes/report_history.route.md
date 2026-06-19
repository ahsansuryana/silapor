# `backend/src/routes/report_history.route.ts` — Route riwayat status laporan

## Lokasi file asli
`backend/src/routes/report_history.route.ts`

## Tujuan / peran file ini
Mount handler `report_history` di prefix `/api/reports`. Share prefix dengan `reports.route.ts` dan `report_images.route.ts` (semua mount di `/api/reports` di `index.ts`). Pemisahan jadi router terpisah cuma untuk kerapian — tidak ada konflik karena path-nya selalu pakai segmen unik `/history`.

## Daftar route
| Method | Path | Middleware | Handler |
|---|---|---|---|
| GET | `/:id/history` | `authenticate` | `getByReportId` |
| GET | `/:id/history/:historyId` | `authenticate` | `getById` |

## Dependensi
- `../controllers/report_history.controller`
- `../middlewares/auth.middleware`
- **Di-mount oleh**: `index.ts` di `/api/reports`.

## Hal yang perlu diperhatikan
- Tidak ada cek "user X boleh lihat history laporan Y?". Siapa pun login bisa.
- Mounting ke prefix `/api/reports` yang sama dengan reports.route.ts berarti urutan `app.use` di `index.ts` matters — kebetulan tidak ada konflik karena path-nya selalu mengandung `/history`.
