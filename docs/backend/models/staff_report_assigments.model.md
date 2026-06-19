# `backend/src/models/staff_report_assigments.model.ts` — Penugasan staff ke laporan

## Lokasi file asli
`backend/src/models/staff_report_assigments.model.ts` (perhatikan typo: `assigments` bukan `assignments`)

## Tujuan / peran file ini
Tabel pivot antara laporan dan staff yang menangani. Tiap laporan bisa punya banyak baris di sini (riwayat transfer), tapi hanya **satu yang aktif** (`is_active = true`) sekali waktu.

## Struktur data
```ts
interface StaffReportAssignment {
  id, report_id, assigned_to, assigned_by,
  is_active: boolean,
  is_auto_assign: boolean,        // true = auto, false = manual oleh admin/staff
  notes: string,
  created_at, updated_at
}
```

## Method utama

### `findByReportId(reportId)` — semua history assignment satu laporan.
### `findActiveByReportId(reportId)` — staff yang sedang menangani (pakai `is_active = true`).
### `findByStaffId(staffId)` — semua assignment milik staff (history).
### `findActiveByStaffId(staffId)` — task aktif staff, **plus detail laporan** (JOIN reports, categories, locations, users). Inilah query "my tasks" di dashboard staff.

### `assign({...})` — transactional pattern
```ts
await pool.query(`UPDATE staff_report_assigments SET is_active = false WHERE report_id = $1`, [...]);
// lalu INSERT baru is_active = true
```
Pola: deaktivasi semua assignment lama untuk report itu, lalu insert baru aktif. **Tidak pakai transaction**, jadi kalau crash di tengah, bisa terjadi state "tidak ada assignment aktif" — minor karena tahap kedua langsung menyusul.

### `transfer({...})` — alias panggilan `assign` dengan `is_auto_assign = false`. Cuma perbedaan semantik (transfer = manual antar staff).

### `deactivate(id)` — pasif tanpa nge-assign yang baru (misal saat laporan diselesaikan tapi tidak butuh pengganti).

## Dependensi
- `../lib/db`
- **Dipakai oleh**: `controllers/staff_assignments.controller.ts`, `controllers/reports.controller.ts` (auto-assign).

## Hal yang perlu diperhatikan
- **Typo nama tabel & file** (`assigments` vs `assignments`) — sudah terlanjur kena DB, riskan untuk rename. Konsisten saja.
- Tidak ada transaksi di `assign`. Pertimbangkan `BEGIN; ... COMMIT;` kalau di-call concurrent.
- Tidak ada unique constraint `(report_id, is_active=true)` — secara logika boleh ada 2 aktif kalau race condition. Saat ini diandalkan kode "matikan dulu, lalu insert".
