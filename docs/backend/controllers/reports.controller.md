# `backend/src/controllers/reports.controller.ts` — Laporan: CRUD, status, stats

## Lokasi file asli
`backend/src/controllers/reports.controller.ts`

## Tujuan / peran file ini
Controller laporan. Tangani list/detail/create/update/delete laporan, ubah status (dengan side-effects: history + notifikasi + push), filter per status/priority, dan endpoint statistik admin.

## Penjelasan per handler

### `getAll(req, res)` — admin list
Ambil semua laporan + details + presigned URL untuk tiap gambar.
```ts
const reports = await ReportsModel.findWithDetails(...);
const reportsWithImages = await Promise.all(reports.map(async report => {
  const imagesWithUrls = await Promise.all(report.images.map(async img => ({
    ...img, url: await getPresignedUrl(img.minio_object_key),
  })));
  return { ...report, images: imagesWithUrls };
}));
```
URL gambar di-generate **on the fly** tiap request. Tidak di-cache. Kalau ada 100 laporan × 3 gambar = 300 panggilan ke MinIO per request → bisa lambat. Optimasi mungkin perlu di scale besar.

### `getById(req, res)` — detail
Sama seperti `getAll` tapi single. Dipakai page `/report/:id`.

### `getMyReports(req, res)` — laporan milik user
Filter by `req.user.id`. Untuk page `My Reports` mahasiswa.

### `create(req, res)` — bikin laporan baru (penting!)
1. Validasi `location_id`, `category_id`, `title` (max 255 char).
2. `ReportsModel.create({...})` → row baru di `reports` (status default `menunggu`).
3. Kalau ada `req.file` (dari multer `upload.single("file")`):
   - Upload buffer ke MinIO → dapat objectKey.
   - Simpan ke `report_images`.
4. **Auto-assign**: `LocationsModel.findStaffInHierarchy(location_id)` → cari staff. Kalau ketemu:
   - Buat assignment `is_auto_assign: true`.
   - Buat notif in-app.
   - Kirim push FCM.

> ⚠️ Cuma 1 gambar per laporan saat create (multer `single`). Kalau mau multiple, ganti ke `upload.array("files", 5)` + loop.

### `update(req, res)` — edit isi laporan
Update field `title`, `description`, `priority`. Status tidak di-update di sini (ada handler terpisah).

### `updateStatus(req, res)` — sangat penting
1. Cari laporan existing untuk dapat `oldStatus`.
2. `ReportsModel.updateStatus(id, newStatus)`.
3. Append ke `report_status_history` (siapa, kapan, dari→ke, notes).
4. Notif ke **reporter** (DB + push).
5. Kalau ada `activeAssignment` dan assignee bukan user yang trigger update → notif ke assignee juga.

Side-effect berlapis ini WAJIB untuk consistency UX (timeline + bell badge).

### `remove(req, res)` — delete laporan
Cuma `ReportsModel.delete`. Cascade orphan harus di-set di DDL.

### `getByStatus` / `getByPriority`
Simple filter, no `findWithDetails` — return Report saja (tanpa images URL). Dipakai di filter list.

### `getStats(req, res)`
Wrapper try/catch di sekitar `ReportsModel.getStats()`. Return weekly chart + counts untuk dashboard admin.

## Dependensi
- Models: `ReportsModel`, `ReportStatusHistoryModel`, `StaffReportAssignmentsModel`, `NotificationsModel`, `ReportImagesModel`, `LocationsModel`.
- Lib: `minio-upload`, `push-notification`.
- **Dipanggil oleh**: `routes/reports.route.ts`.

## Alur "create laporan" lengkap
```
Mahasiswa → POST /api/reports (multipart: data + file)
   → multer parse → req.body + req.file (buffer)
   → ReportsModel.create
   → uploadToMinIO + ReportImagesModel.create (kalau ada file)
   → findStaffInHierarchy → assign + NotificationsModel.create + sendPush
   → response 201 (report)
```

## Hal yang perlu diperhatikan
- `updateStatus` tidak transactional. Bisa terjadi status berubah tapi history gagal (atau notif gagal).
- N+1 presigned URL di list — bisa di-paralelkan lebih agresif atau di-cache singkat.
- `remove` tidak bersihkan gambar di MinIO. File di-orphan.
- Tidak ada validasi authorization: bisa user A `update` / `delete` laporan user B? Tidak ada cek `reporter_id === user.id`. Hanya route admin yang diproteksi (`getAll`, `getStats`). **Audit ulang**.
