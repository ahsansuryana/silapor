# `backend/src/controllers/staff_assignments.controller.ts` — Penugasan staff

## Lokasi file asli
`backend/src/controllers/staff_assignments.controller.ts`

## Tujuan / peran file ini
Tangani assign/transfer/auto-assign staff ke laporan, plus endpoint "my tasks" untuk staff dashboard.

## Penjelasan per handler

### `getByReportId(reportId)`
Semua history assignment satu laporan (siapa pernah ditugaskan).

### `getMyTasks(req)` — penting untuk staff
Task aktif staff yang sedang login, dengan detail laporan (category, location, reporter). Dipakai page "Staff Dashboard".

### `assign(req)` — admin/staff tugaskan ke staff lain (manual)
1. Cari laporan; 404 kalau tidak ada.
2. Validasi `assigned_to`.
3. `StaffReportAssignmentsModel.assign(...)`.
4. **`ReportsModel.updateStatus(report_id, "diterima")`** — auto transition dari `menunggu` → `diterima`.
5. Notif + push ke staff yang baru ditugaskan.

> ⚠️ Catatan: tidak ada history status di `report_status_history` saat status berubah ke "diterima" lewat sini (karena tidak panggil controller `updateStatus`, langsung model). Timeline laporan akan kelihatan loncat.

### `transfer(req)` — pindah dari staff lama ke staff baru
1. Cek laporan.
2. Cari assignment lama yang aktif; kalau ada → notif "Laporan ditransfer" ke staff lama (DB only, no push).
3. `StaffReportAssignmentsModel.transfer(...)` — deaktif yang lama, insert yang baru aktif.
4. Notif + push ke staff baru.

### `autoAssign(req)` — endpoint manual trigger auto-assign
1. Cari laporan.
2. `UserStaffLocationModel.getStaffForAutoAssign(report.location_id)` — staff random untuk lokasi (BUKAN traversal hierarki seperti di `reports.controller.create`).
3. Assign. Update status ke `diterima`.

> ⚠️ Catatan: ada **dua algoritma auto-assign** di codebase:
> - `LocationsModel.findStaffInHierarchy` (lebih pintar, naik parent) — dipakai saat create laporan.
> - `UserStaffLocationModel.getStaffForAutoAssign` (langsung pakai location_id tanpa hierarki) — dipakai endpoint manual.
>
> Bisa membingungkan. Pertimbangkan unifikasi.

### `getActiveAssignment(reportId)` — staff aktif sekarang
Untuk UI "ditugaskan ke: X". 404 kalau belum ada assignment.

## Dependensi
- Models: `StaffReportAssignmentsModel`, `ReportsModel`, `UserStaffLocationModel`, `NotificationsModel`.
- Lib: `push-notification`.
- **Dipanggil oleh**: `routes/assignments.route.ts`.

## Hal yang perlu diperhatikan
- Status diubah langsung pakai model, bukan via controller — history status tidak tercatat saat `assign`/`autoAssign`.
- Tidak ada validasi: `assigned_to` harus role STAFF. Bisa nyangkut admin/mahasiswa.
- `transfer` push notif ke staff baru tapi cuma DB notif (tidak push) ke staff lama.
