# `backend/src/models/reports.model.ts` — Akses tabel `reports`

## Lokasi file asli
`backend/src/models/reports.model.ts`

## Tujuan / peran file ini
Model terbesar di project ini. Tabel `reports` adalah jantung sistem (= laporan/pengaduan). File ini berisi CRUD + query gabungan (laporan + reporter + lokasi + kategori + gambar) + statistik dashboard.

## Struktur data
```ts
type ReportStatus = "menunggu" | "diterima" | "diproses" | "selesai" | "ditolak";
type ReportPriority = "rendah" | "sedang" | "tinggi";

interface Report {
  id, reporter_id, location_id, category_id,
  title, description, status, priority,
  created_at, updated_at
}

interface ReportWithDetails extends Report {
  reporter_name, location_name, category_name,
  images: ReportImage[]
}
```

## Method utama

### Lookup sederhana
- `findAll(limit, offset)` — paginasi dasar
- `findById(id)`
- `findByReporter(reporterId, ...)` — semua laporan milik user
- `findByStatus`, `findByPriority` — filter

### Lookup dengan join (yang dipakai UI)
- `findWithDetails(limit, offset)` — list semua laporan + info reporter/lokasi/kategori + array gambar
- `findByIdWithDetails(id)` — versi single
- `findByReporterWithDetails(reporterId)` — versi laporan user

Pola query joinnya:
```sql
SELECT r.*, u.name as reporter_name, l.name as location_name, c.name as category_name,
  COALESCE(array_agg(
    json_build_object('id', ri.id, 'minio_object_key', ri.minio_object_key, ...)
  ) FILTER (WHERE ri.id IS NOT NULL), '{}') as images
FROM reports r
JOIN users u ON r.reporter_id = u.id
JOIN locations l ON r.location_id = l.id
JOIN categories c ON r.category_id = c.id
LEFT JOIN report_images ri ON r.id = ri.report_id
GROUP BY r.id, u.name, l.name, c.name
ORDER BY r.created_at DESC
```
**Kenapa `array_agg + FILTER + COALESCE`?**
- `array_agg(json_build_object(...))` → kumpulkan semua gambar jadi array JSON.
- `FILTER (WHERE ri.id IS NOT NULL)` → kalau laporan tidak punya gambar, jangan munculkan `{null}` (artefak dari LEFT JOIN).
- `COALESCE(..., '{}')` → kalau semua difilter, kasih array kosong, bukan NULL. Frontend bisa langsung `.map`.

### Create
```ts
create({ reporter_id, location_id, category_id, title, description, priority })
```
Default `priority = 'rendah'`. Status default lewat DDL Postgres (`'menunggu'`).

### Update
- `update(id, { title, description, priority })` — biasa, pakai COALESCE.
- `updateStatus(id, status)` — terpisah karena status change punya side-effect (history + notifikasi) yang ditangani controller.

### `getStats()` — dashboard admin
Bikin metric **7 hari terakhir**:
1. Total laporan 7 hari terakhir.
2. Hitung per status (`menunggu`, `diproses`, `selesai`).
3. Compare ke minggu sebelumnya (`% perubahan`).
4. Build `weeklyData` (array 7 angka, 1 per hari) untuk chart line. Loop manual dari `today - 6` ke `today` supaya hari tanpa laporan tetap dapat `0` (kalau langsung dari DB, hari kosong tidak muncul).

> ⚠️ Catatan: format perbandingan tanggal pakai `date.toISOString().split('T')[0]` vs `d.day.toString().split('T')[0]`. Tergantung type Postgres return (`DATE` vs `TIMESTAMP`), bisa miss kalau timezone berbeda. Aman selama server pakai UTC.

## Dependensi
- `../lib/db`
- `./report_images.model` (type)
- **Dipakai oleh**: `controllers/reports.controller.ts`, dan tidak langsung oleh `controllers/staff_assignments.controller.ts` & `controllers/report_history.controller.ts`.

## Hal yang perlu diperhatikan
- Query dengan `array_agg` dieksekusi tiap kali list ditampilkan. Untuk volume besar, bisa lambat — pertimbangkan index `reports(created_at DESC)` dan `report_images(report_id)`.
- `delete` cuma hapus row di `reports`. Cascade ke `report_images`, `report_status_history`, `notifications`, `staff_report_assigments` harus diatur di DDL — kalau tidak, orphan.
- `getStats()` di-hardcode 7 hari. Belum ada parameter range dinamis.
