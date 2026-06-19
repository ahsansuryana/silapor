# `backend/src/models/locations.model.ts` — Akses tabel `locations` (hierarki)

## Lokasi file asli
`backend/src/models/locations.model.ts`

## Tujuan / peran file ini
CRUD lokasi + traversal hierarki. Lokasi punya parent-child (tree), mis. `UNIVERSITAS → FAKULTAS → JURUSAN → RUANGAN/AREA`. File ini juga berisi logika "cari staff yang bertanggung jawab di hierarki lokasi" yang dipakai auto-assign.

## Struktur data
```ts
type LocationType = "UNIVERSITAS" | "FAKULTAS" | "JURUSAN" | "RUANGAN" | "AREA";

interface Location {
  id: string;
  name: string;
  type: LocationType;
  parent_id: string | null;   // null = root
  created_at: Date;
  updated_at: Date | null;
}

type LocationWithChildren = Location & { children: LocationWithChildren[] };
```

## Penjelasan per bagian

### `buildLocationTree(items)`
Helper murni JS yang ubah flat array (hasil query SQL) jadi tree nested. Pakai `Map<id, node>` supaya O(n). Kalau parent tidak ketemu (data rusak), node fallback ke roots — supaya tidak hilang dari output.

### `findRootsWithChildren()` — query rekursif CTE
```sql
WITH RECURSIVE location_tree AS (
  SELECT ... FROM locations WHERE parent_id IS NULL
  UNION ALL
  SELECT ... FROM locations child JOIN location_tree parent ON child.parent_id = parent.id
)
SELECT * FROM location_tree ORDER BY parent_id NULLS FIRST, name
```
Ini cara Postgres ambil **seluruh tree dalam 1 query** lalu di-rangkai jadi nested di JS. Lebih efisien daripada query rekursif manual.

### `findStaffInHierarchy(locationId)` — yang penting untuk auto-assign
```ts
while (currentLocationId) {
  // 1) Cek apakah ada staff yang di-assign langsung ke lokasi ini
  if (rows.length > 0) return rows[0];
  // 2) Tidak ada → naik ke parent
  const parent = await LocationsModel.findById(currentLocationId);
  if (!parent || !parent.parent_id) {
    // sudah di root → cari staff di root mana saja
    return rootRows[0] || null;
  }
  currentLocationId = parent.parent_id;
}
```
Logikanya:
1. Mahasiswa lapor di lokasi `RUANGAN A`.
2. Cari staff yang di-assign langsung ke `RUANGAN A`. Ada? Pakai.
3. Belum ada? Naik ke `JURUSAN` parent. Cari staff di sana. Berulang.
4. Sampai root → cari staff random yang ditugaskan di root manapun.

> ⚠️ Performance note: tiap iterasi adalah 2 query DB (cari staff + cari parent). Tree dalam 4-5 level biasanya cuma 8-10 query — masih oke. Tapi kalau tree dalam, bisa lambat. Bisa dioptimasi dengan recursive CTE.

> ⚠️ Catatan logika: fallback "staff di root manapun" mungkin tidak ideal. Kalau staff cuma di root "UNIVERSITAS A" dan lapor ada di "UNIVERSITAS B" yang belum ada staff sama sekali, dia akan dilempar ke staff UNIV A — tidak nyambung.

## Dependensi
- `../lib/db`
- **Dipakai oleh**: `controllers/location.controller.ts`, `controllers/reports.controller.ts` (auto-assign).

## Hal yang perlu diperhatikan
- Tidak ada validasi cycle. Kalau ada bug di UI yang set `parent_id` jadi keturunannya sendiri, query rekursif bisa infinite loop (Postgres punya safety limit, tapi tetap eror).
- `delete` tidak cek apakah lokasi masih punya children atau dipakai laporan.
