# `backend/src/controllers/location.controller.ts` — CRUD lokasi & tree

## Lokasi file asli
`backend/src/controllers/location.controller.ts`

## Tujuan / peran file ini
Wrapper tipis di atas `LocationsModel`. Tambahan: endpoint `tree` untuk dapat lokasi hierarki nested.

## Penjelasan per handler
- **`getAll`** — flat list. Public.
- **`getRootsWithChildren`** — tree (nested). Public. Dipakai UI dropdown cascading saat pilih lokasi laporan.
- **`getById`** — single. Public.
- **`create`** — `name` + `type` wajib, `parent_id` optional (null = root). Auth required.
- **`update`** / **`remove`** — biasa.

## Dependensi
- `LocationsModel`
- **Dipanggil oleh**: `routes/location.route.ts`.

## Hal yang perlu diperhatikan
- Route create/update/delete tidak dilindungi `requireAdmin`. Sama dengan kategori — semua user login bisa edit lokasi.
- Tidak validasi: `parent_id` harus mengarah ke lokasi existing, dan `type` parent harus "lebih tinggi" dari child. Mis. UNIVERSITAS parent → JURUSAN child secara semantik aneh — saat ini di-allow.
