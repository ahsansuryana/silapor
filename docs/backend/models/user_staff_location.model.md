# `backend/src/models/user_staff_location.model.ts` — Mapping staff ↔ lokasi yang ditangani

## Lokasi file asli
`backend/src/models/user_staff_location.model.ts`

## Tujuan / peran file ini
Pivot table. Tiap staff bisa dapat tugas multi-lokasi, tiap lokasi bisa punya banyak staff. Tabel ini yang dipakai algoritma **auto-assign** (lihat `locations.model.ts → findStaffInHierarchy`).

## Struktur data
```ts
interface UserStaffLocation { id, staff_id, location_id, created_at }

interface UserStaffLocationWithDetails extends ... {
  staff_name, location_name, location_type
}
```

## Method
- `findByStaffId(staffId)` — lokasi-lokasi yang ditangani satu staff (with details).
- `findByLocationId(locationId)` — staff-staff yang ditugaskan ke satu lokasi.
- `findById(id)` — lookup pivot by id (jarang dipakai).
- `assign({...})` — INSERT dengan `ON CONFLICT DO NOTHING`. Idempotent: kalau mapping sudah ada, return null tanpa error → controller bisa response 409.
- `remove({...})` — hapus pivot (un-assign).
- `removeByStaffId(staffId)` — hapus semua lokasi yang dia handle (sebelum re-assign atau saat delete staff).
- `getStaffForAutoAssign(locationId)` — ambil **1 staff random** dari lokasi tertentu. Dipakai oleh endpoint `/api/assignments/auto-assign`. Note: `LIMIT 1` saja, jadi staff pertama yang ketemu — tidak ada load balancing.

## Dependensi
- `../lib/db`
- **Dipakai oleh**: `user_staff_location.controller.ts`, `staff_assignments.controller.ts`, `staff.route.ts`, `auth.controller.ts` (saat registerStaff).

## Hal yang perlu diperhatikan
- Tidak ada cek role saat `assign` — model assume controller sudah cek (`staff.role === "STAFF"`). Memang controller-nya cek, tapi kalau ada caller baru lupa cek, bisa kemasukan ID admin/mahasiswa.
- `getStaffForAutoAssign` tidak melihat workload eksisting; staff terpilih bisa kebanjiran. Bisa diimprove dengan `ORDER BY (current active assignment count) ASC`.
